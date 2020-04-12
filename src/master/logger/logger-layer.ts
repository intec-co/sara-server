import { RequestSara, Client } from '$Interfaces';

export class LoggerLayer {
	process(req: RequestSara): boolean {
		return true;
	}

}
