import { Microservice, PromiseCallback } from '@Lib/microservice';
import { MessageService, ServiceConf } from '@Interfaces';

class MongumentsService extends Microservice {
	constructor(conf: ServiceConf) {
		super(conf);
	}
	fromService(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		message.service = message.applicant;
		message.applicant = undefined;
		message.response = { msg: 'desde monguments service' };
		resolve(message);
	}
	fromWeb(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		message.applicant = undefined;
		message.service = undefined;
		message.response = { msg: 'desde monguments web' };
		resolve(message);
	}
}

export const init = (conf: ServiceConf) => new MongumentsService(conf);
