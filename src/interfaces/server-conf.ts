import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ServerConf {

	@IsString()
	files: string;

	@IsString()
	host: string;

	@IsInt()
	port: number;

	@IsOptional()
	@ValidateNested({ each: true, message: '' })
	services: Array<ServiceConf>;
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
