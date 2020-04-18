import { IsString } from 'class-validator';

export class RequestMonguments {
	@IsString()
	collection: string;

	data: any;

	@IsString()
	operation: string;

	params?: any;
}
