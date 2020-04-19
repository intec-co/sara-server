import { Microservice, PromiseCallback } from '@Lib/microservice';
import { MessageService, ServiceConf } from '@Interfaces';

class Auth extends Microservice {

	constructor(conf: ServiceConf) {
		super(conf);
	}
	fromWeb(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		if (message.response) {
			message.applicant = undefined;
			message.service = undefined;
			message.response = {
				msg: 'from auth web',
				mg: message.response
			};
			resolve(message);
		} else {
			message.applicant = this.name;
			message.service = 'monguments';
			message.response = { msg: 'desde auth web' };
			message.serviceRequest = { msg: 'request from auth' };
			resolve(message);
		}
	}
}

export const init = (conf: ServiceConf) => new Auth(conf);
