import tls, { Server, TLSSocket } from 'tls';
import fs from 'fs';
import { CertificateFiles } from '../interface';

export class SocketClient {
	port: number;
	host: string;
	options: any;
	client: TLSSocket;

	constructor(host: string, port: number, cert: CertificateFiles) {
		this.host = host;
		this.port = port;

		this.options = {
			key: fs.readFileSync(cert.key),
			cert: fs.readFileSync(cert.cert),
			ca: fs.readFileSync(cert.ca),
			rejectUnauthorized: true,
			requestCert: true
		};

	}
	init(): void {
		const socket = tls.connect(this.port, this.options, () => {
			console.log('client connected',
				socket.authorized ? 'authorized' : 'unauthorized');
			process.stdin.pipe(socket);
			process.stdin.resume();
		});
		socket.setEncoding('utf8');
		socket.on('data', (data) => {
			console.log(data);
		});
		socket.on('end', () => {
			console.log('server ends connection');
		});
	}
}
