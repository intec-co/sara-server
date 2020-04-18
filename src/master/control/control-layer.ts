import { ControlData, RequestSara, SecurityData, ServiceConf } from '@Interfaces';

export class ControlLayer {
    private services: Set<string>;

    process(req: RequestSara, security: SecurityData): ControlData {
        const routeParams = req.client.routes[req.method][req.body.route];

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

    private getRoute(req: RequestSara): string {
        const url = req.url;
        const basHref = req.client.baseHref;
        let route = url.split(basHref)[1];
        route = route.split('/')[0];

        return route;
    }
}
