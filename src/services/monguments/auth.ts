import { Db, Collection } from 'mongodb';
import { MessageService, AuthRequest } from '@Interfaces';
import crypto, { CipherGCMTypes } from 'crypto';
import { PromiseCallback } from '@Lib/microservice';
import { ProcessPermissions } from '@Lib/process-permissions';
import { jsonFile } from '@Lib/utils';
import path from 'path';
import fs from 'fs';

export class Auth {
	db: Db;
	personColl: Collection;
	credentialColl: Collection;
	rolesColl: Collection;
	processPermissions: ProcessPermissions;
	roles: any;
	key: string;

	private readonly algorithm: CipherGCMTypes;
	private readonly digest: string;

	constructor(db: Db, confPath: string) {
		this.algorithm = 'aes-256-gcm';
		this.digest = 'sha512';
		this.db = db;
		this.personColl = this.db.collection('person');
		this.credentialColl = this.db.collection('userCredentials');
		this.rolesColl = this.db.collection('roles');
		const routesPath = path.join(confPath, 'roles.json');
		this.roles = jsonFile.read(routesPath);
		const keyPath = path.join(confPath, 'key');
		this.key = fs.readFileSync(keyPath, { encoding: 'utf8' });
		this.processPermissions = new ProcessPermissions();
	}
	async process(message: MessageService, resolve: PromiseCallback, reject: PromiseCallback) {
		const req: AuthRequest = message.request.body.data;
		message.response = { isValid: false };
		const person = await this.personColl.findOne({ docId: req.user });
		if (person) {
			const credential = await this.credentialColl.findOne({ _id: person._id });
			const hash = crypto.createHash('sha256').update(`${credential.sha2}$${req.key}`).digest('hex');
			if (hash === req.hash) {
				const roles = await this.rolesColl.findOne({ _id: person._id });
				const routes = this.processRoutes(roles.list);
				const auth = this.encrypt(routes);
				message.response = {
					person,
					auth,
					enterprises: roles.list
				};
			}
		}
		resolve(message);
	}
	processRoutes(list: Array<any>): any {
		const routesAccess: any = {};
		if (this.roles) {
			list.forEach(enterprise => {
				routesAccess[enterprise.name] = this.processPermissions.getPermissions(this.roles, enterprise.roles);
			});
		}

		return routesAccess;
	}

	private encrypt(obj: any): string {
		const text = JSON.stringify(obj);
		const iv = crypto.randomBytes(16);
		const salt = crypto.randomBytes(64);
		const key = crypto.pbkdf2Sync(this.key, salt, 2145, 32, this.digest);
		const cipher = crypto.createCipheriv(this.algorithm, key, iv);
		const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
		const tag = cipher.getAuthTag();

		return Buffer.concat([salt, iv, tag, encrypted])
			.toString('base64');
	}
}
