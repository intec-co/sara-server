import { ControlData, RequestSara, SecurityData, ServiceConf } from '@Interfaces';

export class ControlLayer {
	private services: Set<string>;
	// TODO falta definir el tipo routes
	process(routes, req: RequestSara, security: SecurityData): ControlData {
		// TODO validar qeu el method este soportado
		// TODO validar que la ruta exista
		const routeParams = routes[req.method][req.body.route];

		const result: ControlData = { isInvalid: true };

		if (this.services.has(routeParams[1]) && (
			(security.authenticated && routeParams[0] === 'auth') ||
			(!security.authenticated && routeParams[0] === 'public')
		)) {
			result.isInvalid = false;
			result.service = routeParams[1];
		}

		return result;
	}

	setServices(list: Array<ServiceConf>): void {
		this.services = new Set();
		list.forEach(service => {
			this.services.add(service.name);
		});
	}
}
