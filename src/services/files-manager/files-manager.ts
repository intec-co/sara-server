import { Microservice, PromiseCallback } from '@Lib/microservice';
import { MessageService, ServiceConf } from '@Interfaces';
import path from 'path';
import fs from 'fs';
import { jsonFile } from '@Lib/utils';

class FilesManagerService extends Microservice {
	private conf: any;
	constructor(conf: ServiceConf) {
		super(conf);
		this.conf = conf;
	}

	writeFile(message, resolve: PromiseCallback, reject: PromiseCallback): void {
		const body = message.request.body;
		const filename = body.data._id.toString();
		const file = body.data.file;
		if (this.isFileNameValid(filename) && this.isFileValid(file)) {
			try {
				fs.writeFileSync(path.join(this.conf.files, body.route, filename), file, 'base64');
				message.response = {
					msg: 'correct'
				};
				resolve(message);
			} catch (error) {
				message.response = {
					msg: error
				};
				reject(message);
			}
		} else {
			message.response = { msg: 'desde FileManager fromWeb.writeFile.errorFileValid' };
			resolve(message);
			// reject(message); //TODO this don't work
		}
	}
	readFile(message, resolve: PromiseCallback, reject: PromiseCallback): void {
		const body = message.request.body;
		const filename = body.data._id;
		try {
			let file = fs.readFileSync(path.join(this.conf.files, body.route, filename), 'base64');
			message.response = {
				msg: 'correct',
				file: file
			};
			resolve(message);
		} catch (error) {
			message.response = {
				msg: error
			};
			resolve(message);
			// reject(message);
		}
	}
	isFileNameValid(fileName: any): boolean {
		let resp = false;
		if (fileName) {
			if (typeof fileName === 'string' || typeof fileName === 'number' ||
				Buffer.isBuffer(fileName) || this.validURL(fileName)) {
				resp = true;
			}
		}
		return resp;
	}

	validURL(str): boolean {
		const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

		return !!pattern.test(str);
	}
	isFileValid(data: string): boolean {
		if (data && data.length) {
			return true;
		}

		return false;
	}

	fromService(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		message.service = message.applicant;
		message.applicant = undefined;
		message.response = { msg: 'desde FileManager service' };
		resolve(message);
	}
	fromWeb(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback): void {
		message.applicant = undefined;
		message.service = undefined;

		if (message.request.body.data) {
			const data = message.request.body.data;
			if (data.crud === 'R' || data.crud === 'r' || data.crud === 'read') {
				try {
					this.readFile(message, resolve, reject);
				} catch (error) {
					message.response = { msg: 'FileManager fromWeb read error' };
					resolve(message);
				}
			} else {
				try {
					this.writeFile(message, resolve, reject);
				} catch (error) {
					message.response = { msg: 'FileManager fromWeb write error' };
					resolve(message);
				}
			}

		} else {
			message.response = { msg: 'body.data invalid' };
			resolve(message);
			// reject(message); //TODO this don't work
		}
	}
}

export const init = (conf: ServiceConf) => new FilesManagerService(conf);
