import { ServerResponse } from 'http';
import { Writable } from 'stream';

export class Responder extends Writable {
	private readonly response: ServerResponse;

	constructor(response: ServerResponse) {
		super();
		this.response = response;
	}
	_final(callback: () => void): void {
		this.response.end();
		callback();
	}
	_write(chunk: any, encoding: string, callback: () => void): void {
		this.response.write(chunk);
		callback();
	}
	responder(data: any): void {
		const str = JSON.stringify(data);
		const headersResponse = { 'Content-Type': 'text/json' };
		this.response.writeHead(200, headersResponse);
		this.response.write(str);
		this.response.end();
	}
	writeHead(code: number, header?: any): void {
		this.response.writeHead(code, header);
	}
}
