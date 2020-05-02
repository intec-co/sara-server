export interface AuthRequest {
	user: string;
	hash: string;
	key: string;
}

export interface AuthResponse {
	enterprises: any;
}

export interface Role {
	enterprise: number;
	roles: Array<string>;
}
