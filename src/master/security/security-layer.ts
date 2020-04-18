import crypto, { CipherGCMTypes } from 'crypto';

import { RequestSara, SecurityData, ServerConf } from '@Interfaces';
import { jsonFile } from '@Lib/utils';

export class SecurityLayer {
    private readonly algorithm: CipherGCMTypes;
    private readonly digest: string;

    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.digest = 'sha512';
    }

    check(req: RequestSara): SecurityData {
        try {
            const result: SecurityData = {
                authenticated: false,
                isInvalid: true
            };
            if (req.authorization) {
                req.permissions = this.decrypt(req.authorization, req.client.key);
                result.authenticated = true;
                result.isInvalid = false;
            } else {
                result.isInvalid = false;
            }

            return result;
        } catch (error) {

            return {
                authenticated: false,
                isInvalid: true
            };
        }
    }

    createKeys(path: string, conf: ServerConf): void {
        const clientsKey: any = {};
        const servicesKey: any = {};
        conf.clients.forEach(client => {
            clientsKey[client] = crypto.randomBytes(64).toString('base64');
        });
        conf.services.forEach(service => {
            servicesKey[service.name] = crypto.randomBytes(64).toString('base64');
        });
        const keys = {
            clients: clientsKey,
            services: servicesKey,
            date: new Date().getTime()
        };
        jsonFile.write(path, keys);
    }

    private decrypt(encData: string, masterKey: string): any {
        const bData = Buffer.from(encData, 'base64');
        const salt = bData.slice(0, 64);
        const iv = bData.slice(64, 80);
        const tag = bData.slice(80, 96);
        const text = bData.slice(96).toString('base64');
        const key = crypto.pbkdf2Sync(masterKey, salt, 2145, 32, this.digest);
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(text, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    }

    private encrypt(obj: any, masterKey: string): string {
        const text = JSON.stringify(obj);
        const iv = crypto.randomBytes(16);
        const salt = crypto.randomBytes(64);
        const key = crypto.pbkdf2Sync(masterKey, salt, 2145, 32, this.digest);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return Buffer.concat([salt, iv, tag, encrypted])
            .toString('base64');
    }
}
