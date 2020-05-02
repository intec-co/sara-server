import { Microservice, PromiseCallback } from '@Lib/microservice';
import { MessageService, ServiceConf } from '@Interfaces';
import { MgConf, mgConnectDb, Monguments } from 'monguments';
import path from 'path';
import { jsonFile } from '@Lib/utils';
import { Auth } from './auth';

class MongumentsService extends Microservice {

	private monguments: Monguments;
	private auth: Auth;

	constructor(conf: ServiceConf) {
		super(conf);
		const mgConf: MgConf = conf.conf;
		const pathFile = path.join(conf.confPath, 'collections.json');
		const collectionsConf = jsonFile.read(pathFile);
		const collections = collectionsConf;
		const propertiesDefault = collectionsConf.propertiesDefault ?
			collectionsConf.propertiesDefault :
			{
				isLast: '_isLast',
				w: '_w',
				closed: '_closed',
				history: '_h_*',
				date: '_date'
			};
		for (const collName in collections) {
			if (collections.hasOwnProperty(collName)) {
				const coll = collections[collName];
				if (!coll.properties) {
					coll.properties = propertiesDefault;
				}
			}
		}
		const mgClient = {
			collections,
			db: mgConf.db
		};
		mgConnectDb(mgConf, mgClient,
			(connector: Monguments | undefined) => {
				if (connector) {
					this.monguments = connector;
					this.auth = new Auth(connector.db, conf.confPath);
				} else {
					console.error('No se pudo conectar a MongoDB');
				}
			});
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
		switch (message.request.body.route) {
			case 'auth':
				this.auth.process(message, resolve, reject);
				break;
			default:
				//TODO habilitar permisos
				this.monguments.process(
					message.request.body.route,
					message.request.body,
					'RW_',
					result => {
						message.response = result;
						resolve(message);
					});
		}
	}
}

export const init = (conf: ServiceConf) => new MongumentsService(conf);
