import { Client, ClientConf } from '@Interfaces';
import { jsonFile } from '@Lib/utils';
import { transformAndValidate } from 'class-transformer-validator';
import fs from 'fs';
import path from 'path';

export class ClientLoader {
    constructor(
        private readonly pathClientConf: string,
        private readonly pathClientFile: string
    ) { }

    async load(name: string, key: string): Promise<Client> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!key || typeof key !== 'string') {
                    throw { error: 'null or invalid key' };
                }
                const pathClient = path.join(this.pathClientConf, name);
                // Load and validate client conf
                let pathFile = path.join(pathClient, 'conf.json');
                const confTxt = jsonFile.readTxt(pathFile);
                const clientConf: ClientConf = await transformAndValidate(ClientConf, confTxt) as ClientConf;

                // Load routes
                pathFile = path.join(pathClient, 'routes.json');
                const routes = jsonFile.read(pathFile);

                // Verified files dir
                const files = path.join(this.pathClientFile, name);
                if (!fs.existsSync(files)) {
                    fs.mkdirSync(files);
                }

                const client = new Client(clientConf, routes, files, key);
                console.log(`Init: ${client.name}`);
                resolve(client);
            } catch (error) {
                reject(error);
            }
        });
    }
}
