export class ProcessPermissions {
	protected readonly levels = {
		read: '_rR',
		write: '_wW'
	};
	getPermissions(rolesConf: any, roles: Array<string>): any {
		if (roles) {
			const userPermissions: any = {};
			const filesPermissions: any = {};
			const rolesReview = JSON.parse(JSON.stringify(roles));
			rolesReview.push('all');
			for (const role of rolesReview) {
				const rolePermissions = rolesConf[role];
				for (const route in rolePermissions.routes) {
					if (rolePermissions.routes.hasOwnProperty(route)) {
						const roleRoutes = rolePermissions.routes[route];
						if (roleRoutes) {
							userPermissions[route] = userPermissions[route] ? this.sumPermissions(userPermissions[route], roleRoutes) : roleRoutes;
						}
					}
				}
				const fileAccess = rolePermissions.files;
				if (fileAccess) {
					for (const route in fileAccess) {
						if (fileAccess.hasOwnProperty(route)) {
							const roleFiles = fileAccess[route];
							filesPermissions[route] = filesPermissions[route] ? this.sumPermissions(filesPermissions[route], roleFiles) : roleFiles;
						}
					}
				}
			}

			return { routes: userPermissions, files: filesPermissions };
		}

		return {};
	}
	protected analyzePermissions(permission: string, levels: string): number {
		let level = 0;
		let count = 0;
		for (const c of levels) {
			if (permission === c) {
				level = count;
			}
			count++;
		}

		return level;
	}

	protected sumPermissions(permissions: string, rolePermission: string): string {
		let write: number;
		let read: number;
		let readRole: number;
		let writeRole: number;
		let strWrite: string;
		let strRead: string;
		read = this.analyzePermissions(permissions.charAt(0), this.levels.read);
		readRole = this.analyzePermissions(rolePermission.charAt(0), this.levels.read);
		write = this.analyzePermissions(permissions.charAt(1), this.levels.write);
		writeRole = this.analyzePermissions(rolePermission.charAt(1), this.levels.write);

		if (read < readRole) {
			read = readRole;
		}
		if (write < writeRole) {
			write = writeRole;
		}
		strRead = this.levels.read.charAt(read);
		strWrite = this.levels.write.charAt(write);
		if (permissions.charAt(2) === 'E' || rolePermission.charAt(2) === 'E') {
			return strRead.concat(strWrite, 'E');
		}

		return strRead.concat(strWrite, '_');
	}
}
