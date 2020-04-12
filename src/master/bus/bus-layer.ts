
import {
	ControlData, MessageService, RequestSara, ResponseSara, ServerConf, ServiceConf
} from '$Interfaces';
import { WorkerClient, MicroserviceConnection } from '$Lib/microservice';

import { Responder } from '../lib/responder';

export class BusLayer {
	private services: Map<string, WorkerClient>;

	initServices(conf: ServerConf): void {
		this.services = new Map();
		conf.services.forEach((service: ServiceConf) => {
			switch (service.protocol) {
				case 'worker':
					this.services.set(service.name, new WorkerClient(conf, service));
					break;
				default:
					console.error(`Error: Protocolo ${service.protocol} para ${service.name} es desconocido.`);
			}
		});
	}

	async process(req: RequestSara, control: ControlData, response?: Responder): Promise<ResponseSara> {
		return new Promise(async (resolve, reject) => {
			try {
				let rspService: MessageService = {
					service: control.service,
					request: req,
					applicant: undefined
				};
				do {
					const service: MicroserviceConnection = this.services.get(rspService.service);
					if (!service) {
						throw { error: `service ${rspService.service} does not exist` };
					}
					rspService = await service.send(rspService);
				} while (rspService.service);
				if (response) {
					response.responder(rspService.response);
				}
				resolve(rspService.response);
			} catch (error) {
				reject(error);
			}
		});
	}
}
