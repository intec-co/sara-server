export interface SessionUser {
	person?: any;
	roles?: any;
	auth?: string;
}

export interface Roles {
	routes: any;
	files: any;
}
export interface Token {
	id: number;
	date: number;
	permissions?: any;
	files?: any;
}
