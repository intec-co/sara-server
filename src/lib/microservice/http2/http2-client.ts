import http2 from 'http2';
import fs from 'fs';

import { jsonFile } from '@Lib/utils/json-file';

export abstract class Http2Client {
    private readonly key: string;

    constructor(keyFile: string) {
        this.key = jsonFile.read(keyFile).value;
    }
    protected async _request(content: any, path: string): Promise<any> {
        return new Promise(resolve => {

        });
    }
}
