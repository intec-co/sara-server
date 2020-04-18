export class ControlData {
	isInvalid: boolean;
	service?: string;
}

export interface SecurityData {
	authenticated: boolean;
	isInvalid: boolean;
}

export interface Keys {
	clients: any;
}
