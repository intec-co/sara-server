import { MessageService } from '$Interfaces';
import { PromiseCallback } from './interface';

export abstract class Microservice {

	private readonly allowServices: Set<string>;
	private readonly extends: Map<string, Microservice>;
	private readonly name: string;

	abstract fromService(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void;
	abstract fromWeb(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void;

	internalBus(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		do {

		} while (true);
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
}
