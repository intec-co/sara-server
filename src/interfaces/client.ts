import { MgProperties } from '$Modules/monguments';
import {
	IsEmail,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';

export class Client {

	readonly baseHref: string;
	readonly email: string;
	readonly files: string;
	readonly host: string;
	readonly key: string;
	readonly name: string;
	readonly pathFiles: any;
	readonly routes: any;
	readonly services: any;
	readonly webUrl: string;

	constructor(conf: ClientConf, routes: any, files: string, key: string) {
		// ClientConf
		this.name = conf.name;
		this.host = conf.host;
		this.email = conf.email;
		this.webUrl = conf.webUrl;
		this.baseHref = conf.baseHref;
		this.services = conf.services;
		this.pathFiles = conf.pathFiles;

		// Conf Loaded
		this.routes = routes;
		this.files = files;
		this.key = key;
	}
}

export class ClientConf {
	@IsString()
	@IsOptional()
	baseHref: string;

	@IsEmail({}, {
		message: 'ClientConf. Falta propiedad: email'
	})
	email: string;

	@IsString()
	fullName: string;

	@IsString({
		message: 'ClientConf. Falta propiedad: host'
	})
	host: string;

	@IsString({
		message: 'ClientConf. Falta propiedad: name'
	})
	name: string;

	@IsOptional()
	pathFiles?: {
		website: string
	};

	@IsOptional()
	services?: any;

	@IsString()
	@IsOptional()
	webUrl: string;
}
