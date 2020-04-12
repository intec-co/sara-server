import tls, { Server } from 'tls';
import fs from 'fs';
import { CertificateFiles } from '../interface';

export class SocketServer {
	port: number;
	host: string;
	options: any;
	server: Server;

	constructor(host: string, port: number, cert: CertificateFiles) {
		this.host = host;
		this.port = port;

		this.options = {
			key: fs.readFileSync(cert.key),
			cert: fs.readFileSync(cert.cert),
			ca: [fs.readFileSync(cert.ca)],
			requestCert: true,
			rejectUnauthorized: true
		};

	}
	init(): void {
		const server = tls.createServer(this.options, (socket) => {
			console.log('server connected',
				socket.authorized ? 'authorized' : 'unauthorized');
			socket.write('welcome!\n');
			socket.setEncoding('utf8');
			socket.pipe(socket);
		});
		server.listen(this.port, () => {
			console.log('server bound');
		});
	}

}
