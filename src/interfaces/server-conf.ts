import {
	ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, ValidateNested
} from 'class-validator';

export class ServerConf {
	@IsArray({
		message: 'Falta propiedad: clients'
	})
	@ArrayNotEmpty({
		message: 'Falta propiedad: clients'
	})
	@ValidateNested({ each: true, message: '' })
	clients: Array<string>;

	@IsString({
		message: 'Falta propiedad: files'
	})
	files: string;

	@IsString({
		message: 'Falta propiedad: host'
	})
	host: string;

	@IsString({
		message: 'Falta propiedad:'
	})
	keysFile: string;

	@IsOptional()
	@ValidateNested({ each: true, message: '' })
	mail: MailConf;

	@IsString({
		message: 'Falta propiedad:'
	})
	pathClientConf: string;

	@IsInt({
		message: 'Falta propiedad: port'
	})
	port: number;

	@IsOptional()
	@ValidateNested({ each: true, message: '' })
	services: Array<ServiceConf>;

}

export interface MailConf {
	server: ServiceConf;
}

export class ServiceConf {
	@IsOptional()
	allowServices: Array<string>;

	@IsOptional()
	conf: any;

	@IsString()
	@IsOptional()
	host: string;

	@IsString()
	name: string;

	@IsInt()
	@IsOptional()
	port: number;

	@IsString()
	protocol: string;
}

export class ServiceData {
	server: ServerConf;
	service: ServiceConf;
}
