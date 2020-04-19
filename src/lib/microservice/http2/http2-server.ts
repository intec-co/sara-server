import { ServerConf } from '@Interfaces';
import { jsonFile } from '@Lib/utils/json-file';
import fs from 'fs';
import http2, { Http2SecureServer } from 'http2';
import path from 'path';


export abstract class Http2Server {
	private readonly conf: ServerConf;
	private readonly key: string;
	private readonly name: string;
	private server: Http2SecureServer;
	constructor(nameService: string, pathConf: string) {
		this.conf = jsonFile.read(path.join(pathConf, 'conf.json'));
		this.name = nameService;
		this.key = jsonFile.read(path.join(pathConf, 'key.json')).value;
	}
	init(): void {
		this.server = http2.createSecureServer(
			{
				key: fs.readFileSync('ssl/key.pem'),
				cert: fs.readFileSync('ssl/cert.pem')
			});

		this.server.on('error', (err) => console.error(err));

		this.server.on('stream', (stream: any, headers: Headers) => {

		});
		// TODO crear parámetro y definir conf para puerto
		this.server.listen(10001, () => {
			console.log(`start ${this.name} service in port: ${10001}`);
			console.log(`${new Date()}`);
		});
	}
	protected abstract stream(stream: any): void;
}
