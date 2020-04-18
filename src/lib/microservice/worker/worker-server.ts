import assert from 'assert';
import { MessagePort, parentPort, workerData } from 'worker_threads';

import { ServiceData } from '@Interfaces';
import { Microservice, ModuleService, WorkerMessage } from '../interface';

// tslint:disable-next-line: no-require-imports
require('module-alias/register');

class WorkerServer {
    private readonly service: Microservice;

    constructor() {
        const conf: ServiceData = workerData;
        console.log(`Init service ${conf.service.name}`);
        const module: ModuleService = require(`@Services/${conf.service.name}`);
        this.service = module.init(conf);

        parentPort.on('message', (data: WorkerMessage) => {
            assert(data.port instanceof MessagePort);
            this.service.process(data.req).then(result => {
                data.port.postMessage(result);
                data.port.close();
            });
        });
    }
}

const worker = new WorkerServer();
