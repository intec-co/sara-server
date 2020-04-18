import { ServerConf } from './server-conf';

export class Conf {
	readonly files: string;
	readonly host: string;
	readonly key: string;
	readonly routes: any;
	readonly services: any;
	readonly port: any;

	constructor(conf: ServerConf, routes: any, key: string) {
		// ServerConf
		this.port = conf.port;
		this.host = conf.host;
		this.services = conf.services;
		this.files = conf.files;

		// Conf Loaded
		this.routes = routes;
		this.key = key;
	}
}
