import { Microservice } from '@Lib/microservice';
import { MessageService } from '@Interfaces';

class Auth implements Microservice {
	async process(req: MessageService): Promise<MessageService> {
		return new Promise((resolve, reject) => {
			req.applicant = undefined;
			req.service = undefined;
			req.response = { msg: 'desde auth' };
			resolve(req);
		});
	}
}

export const init = () => new Auth();
