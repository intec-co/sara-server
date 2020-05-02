import { ControlData, RequestSara, SecurityData, ServiceConf, RoutesConf } from '@Interfaces';

export class ControlLayer {
	private services: Set<string>;
	process(routes: RoutesConf, req: RequestSara, security: SecurityData): ControlData {
		if (req.method === 'POST') {
			if (req.body.route && routes[req.method][req.body.route]) {
				const routeParams: [string, string] = routes[req.method][req.body.route];
				const result: ControlData = { isInvalid: true };
				result.service = routeParams[1];
				if (this.services.has(routeParams[1])) {
					if (routeParams[0] === 'public') {
						result.isInvalid = false;
					} else if (
						routeParams[0] === 'auth' &&
						security.authenticated &&
						req.permissions.routes[req.body.route]
					) {
						const permissions: string = security.allPermissions[req.body.route];
						const read = permissions.charAt(0);
						const write = permissions.charAt(1);
						req.permissions = permissions;
						if (
							(req.body.operation === 'read' || req.body.operation === 'readList') &&
							(read === 'R' || read === 'r')
						) {
							result.isInvalid = false;
						} else if (
							req.body.operation === 'write' &&
							(write === 'W' || write === 'w')
						) {
							result.isInvalid = false;
						}
					}
				}

				return result;
			}
		} else if (req.method === 'GET') {

		}

		return { isInvalid: true };
	}

	setServices(list: Array<ServiceConf>): void {
		this.services = new Set();
		list.forEach(service => {
			this.services.add(service.name);
		});
	}
}
