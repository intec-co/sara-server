import {
	Client, ControlData, Keys, RequestSara, SecurityData, ServerConf
} from '$Interfaces';
import { jsonFile } from '$Lib/utils/json-file';
import { SecurityLayer } from '$Services/master/security';
import { transformAndValidate } from 'class-transformer-validator';
import http, { IncomingMessage, Server, ServerResponse } from 'http';

import { BusLayer } from './bus';
import { ClientLoader } from './clients';
import { ControlLayer } from './control';
import { Responder } from './lib/responder';
import { responses } from './lib/responses';
import { LoggerLayer } from './logger';

export class MasterSara {
	// Layers
	private readonly bus: BusLayer;
	private readonly clients: Map<string, Client>;
	private readonly confPath: string;
	private readonly control: ControlLayer;
	private keys: Keys;
	private readonly logger: LoggerLayer;
	private readonly security: SecurityLayer;
	private readonly server: Server;
	private serverConf: ServerConf;

	constructor(confPath: string) {
		this.confPath = confPath;
		this.security = new SecurityLayer();
		this.control = new ControlLayer();
		this.logger = new LoggerLayer();
		this.bus = new BusLayer();
		this.clients = new Map();
		this.server = http.createServer(this.listener);
	}

	async init(): Promise<void> {
		try {
			// Load Files
			const confStr = jsonFile.readTxt(this.confPath);
			this.serverConf = await transformAndValidate(ServerConf, confStr) as ServerConf;
			this.keys = jsonFile.read(this.serverConf.keysFile);
			this.control.setServices(this.serverConf.services);
			this.bus.initServices(this.serverConf);
			const clientLoader = new ClientLoader(this.serverConf.pathClientConf, this.serverConf.files);
			this.serverConf.clients.forEach(async clientName => {
				try {
					const client = await clientLoader.load(clientName, this.keys.clients[clientName]);
					this.clients.set(client.host, client);
				} catch (error) {
					console.error(`Error: client ${clientName} no loaded`);
					console.error(error);
				}
			});
			this.server.listen(this.serverConf.port, () => {
				console.log(`Master run in port: ${this.serverConf.port}`);
				console.log(new Date().toUTCString());
			});
		} catch (error) {
			console.log(error);
		}
	}

	private readonly listener = async (request: IncomingMessage, response: ServerResponse) => {
		const responder = new Responder(response);
		try {
			// Master Layer
			console.log('request');
			const req = await this.master(request);
			console.log(req);
			if (!req) {
				responses.badRequest(responder);

				return;
			}

			// Security Layer
			const security: SecurityData = this.security.check(req);
			if (security.isInvalid) {
				responses.unauthorized(responder, req);

				return;
			}

			// Logger Layer
			this.logger.process(req);

			// Control Layer
			const control: ControlData = this.control.process(req, security);
			if (control.isInvalid) {
				responses.forbidden(responder);

				return;
			}

			// Bus Layer
			await this.bus.process(req, control, responder);

		} catch (error) {
			console.log(error);
			responses.badRequest(responder, error.error);
		}
	};

	private async master(request: IncomingMessage): Promise<RequestSara> {
		return new Promise(async (resolve, reject) => {
			const host = request.headers.host;
			const client: Client = this.clients.get(host);
			if (!client) {
				reject({ error: 'Client not found' });

				return;
			}
			const headers = request.headers;
			const authorization = (headers.authorization ? headers.authorization : headers.Authorization) as string;
			let ip: string;
			if (request.headers['x-forwarded-for']) {
				ip = request.headers['x-forwarded-for'] as string;
			}
			const req: RequestSara = {
				url: request.url,
				method: request.method,
				body: undefined,
				authorization,
				ip,
				host,
				client
			};

			// Get Body on Post Request
			if (request.method === 'POST') {
				console.log('post');

				const data = [];
				request.on('data', chunk => {
					data.push(chunk);
				})
					.on('end', () => {
						try {
							const str = Buffer.concat(data)
								.toString();
							req.body = JSON.parse(str);
							// ToDo validate data
							console.log('resolve');

							resolve(req);
						} catch (error) {
							// ToDo
							reject();
						}
					});
			} else {
				resolve(req);
			}
		});
	}
}
