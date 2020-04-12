import { MessageService, ServerConf, ServiceConf } from '$Interfaces';
import { MessagePort } from 'worker_threads';
import { Microservice } from './microservice';

export type PromiseCallback = (value: any | null) => void;

export interface ModuleService {
	init(conf: any): Microservice;
}

export interface MicroserviceConnection {
	send(req: MessageService): Promise<MessageService>;
}

export class WorkerMessage {
	port: MessagePort;
	req: MessageService;
}

export class CertificateFiles {
	ca: string;
	cert: string;
	key: string;
}
