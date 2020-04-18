import url from 'url';
import { IncomingMessage } from 'http';
import { Client } from '@Interfaces';
import { base64 } from './base64';

class PathUtils {
    getPathComponents(request: IncomingMessage): Array<string> {
        const urlReq = request.url;
        const urlStr = url.parse(urlReq).pathname;
        const pathTrs = urlStr.split('/trs/');
        let pathStr = '';
        if (pathTrs.length === 1) {
            pathStr = pathTrs[0];
        } else if (pathTrs.length === 2) {
            pathStr = pathTrs[1];
        } else if (pathTrs.length > 2) {
            pathStr = pathTrs.join('/trs/');
        }
        const pathComp = pathStr.split('/');
        if (pathComp[0] === '') {
            pathComp.shift();
        }

        return pathComp;
    }
}
export const pathUtils = new PathUtils();
