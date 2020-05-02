export class ControlData {
	isInvalid: boolean;
	service?: string;
}

export interface SecurityData {
	authenticated: boolean;
	isInvalid: boolean;
	allPermissions?: any;
}

export interface Keys {
	clients: any;
}
