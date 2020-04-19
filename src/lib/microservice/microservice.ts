import { MessageService, ServiceConf } from '@Interfaces';
import { PromiseCallback } from './interface';

export abstract class Microservice {
	protected readonly allowServices: Set<string>;
	protected readonly name: string;

	constructor(conf: ServiceConf) {
		this.name = conf.name;
		this.allowServices = new Set();
		if (conf.allowServices) {
			conf.allowServices.forEach(service =>
				this.allowServices.add(service)
			);
		}
	}

	async process(message: MessageService): Promise<MessageService> {
		return new Promise(async (resolve, reject) => {
			try {
				if (message.applicant) {
					if (!this.allowServices.has(message.applicant)) {
						reject({ error: `Error - ${this.name}: service not available for ${message.applicant}` });
					} else if (!message.serviceRequest) {
						reject({ error: `Error - ${this.name}: request without data from ${message.applicant}` });
					} else {
						this.fromService(message, resolve, reject);
					}
				} else {
					this.fromWeb(message, resolve, reject);
				}
			} catch (error) {
				reject({ error });
			}
		});
	}

	protected fromService(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		reject({ error: 'Error - service not available' });
	}

	protected fromWeb(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		reject({ error: 'Error - service not available' });
	}
}
