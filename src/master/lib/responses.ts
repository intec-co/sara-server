import { RequestSara } from '@Interfaces';
import { Responder } from './responder';

class Responses {
	private readonly foot: string = '</body></html>';
	private readonly head: string = '<html><head><meta charset="UTF-8"></head><body>';
	serverError(response: Responder): void {
		const headersResponse = [
			['Content-Type', 'text/html']
		];
		const msg = '<h2>Error interno del servidor</h2>';
		const html = this.head.concat(`<h1>Error 500</h1>${msg}`, this.foot);
		response.writeHead(500, headersResponse);
		response.write(html);
		response.end();
	}
	badRequest(response: Responder, message?: string): void {
		const headersResponse = [
			['Content-Type', 'text/html']
		];
		const msg = message ? message : '<h2>Error inesperado</h2>';
		const html = this.head.concat(`<h1>Error 404</h1>${msg}`, this.foot);
		response.writeHead(400, headersResponse);
		response.write(html);
		response.end();
	}
	fileNotFound(response: Responder): void {
		const headersResponse = [
			['Content-Type', 'text/html']
		];
		const html = this.head.concat('<h1>Error 404</h1><h2>Recurso no encontrado</h2>', this.foot);
		response.writeHead(404, headersResponse);
		response.write(html);
		response.end();
	}
	forbidden(response: Responder): void {
		const headersResponse = [
			['Content-Type', 'text/html']
		];
		const html = this.head.concat('<h1>Error 403</h1><h2>Recurso prohibido</h2>', this.foot);
		response.writeHead(403, headersResponse);
		response.write(html);
		response.end();
	}
	notModified(response: Responder, contentType: string): void {
		response.writeHead(304, { 'content-type': contentType });
		response.write('');
		response.end();
	}
	unauthorized(response: Responder, req: RequestSara): void {
		const headersResponse = [
			['Content-Type', 'text/html']
		];
		const html = this.head.concat(
			'<h1>Error 401</h1><h2>Por favor inicie sessión</h2>',
			this.foot);
		response.writeHead(401, headersResponse);
		response.write(html);
		response.end();
	}
}
export const responses = new Responses();
