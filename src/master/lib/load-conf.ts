import { ServerConf, Conf } from '@Interfaces';
import { jsonFile } from '@Lib/utils';
import { transformAndValidate } from 'class-transformer-validator';
import fs from 'fs';
import path from 'path';

export async function loadConf(confPath): Promise<Conf> {
	return new Promise(async (resolve, reject) => {
		try {
			// Load Configuration
			let filePath = path.join(confPath, 'conf.json');
			const confStr = jsonFile.readTxt(filePath);
			const conf: ServerConf = await transformAndValidate(ServerConf, confStr) as ServerConf;

			// Load MasterKey
			filePath = path.join(confPath, 'key');
			const key = fs.readFileSync(filePath).toString();

			// Load routes
			// TODO validar la estructura de las rutas minimo GET y POST
			// {
			// 	"GET": { },
			// 	"POST": {
			// 		"ruta": [
			// 			"public" || "private",
			// 			"microservicio"
			// 		]
			// 	}
			// }
			filePath = path.join(confPath, 'routes.json');
			const routes = jsonFile.read(filePath);

			// Verified files dir
			if (!fs.existsSync(conf.files)) {
				fs.mkdirSync(conf.files);
			}

			const fullConf = new Conf(conf, routes, key);
			resolve(fullConf);
		} catch (error) {
			reject(error);
		}
	});
}
