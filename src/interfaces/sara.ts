import { IsArray, IsInt, IsString } from 'class-validator';

export class RequestSara {
	authorization: string;
	body: RequestBody;
	ip: string;
	method: string;
	permissions?: any;
	url: string;
}

export interface RequestData {
	data: any;
	operation: string;
	route: string;
}

export class RequestBody {
	@IsInt()
	count: number;

	data: any;

	@IsInt()
	date: number;

	@IsArray()
	ips: Array<string>;

	@IsString()
	operation: string;

	@IsString()
	route: string;
}
export interface ResponseSara {
	data?: any;
	error?: string;
	isValid?: boolean;
	msg?: string;
}

export type CallbackSara = (data: any, result?: ResponseSara) => void;

export interface MessageService {
	applicant: string;
	request?: RequestSara;
	response?: any;
	service: string;
	serviceRequest?: any;
}
