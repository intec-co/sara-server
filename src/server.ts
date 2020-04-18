// tslint:disable-next-line: no-require-imports
require('module-alias/register');

import { MasterSara } from './master';

console.log('Iniciando SARA MASTER');
const args = process.argv.slice(2);
const pathConf: string = args[0] ? args[0] : '/etc/sara/conf.json';

const master = new MasterSara();
master.init(pathConf);
