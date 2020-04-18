class Base64 {
	atob(str: string): string {
		if (str) {
			return Buffer.from(str, 'base64')
				.toString('binary');
		}

		return undefined;
	}
	btoa(obj: any): string {
		if (obj) {
			let buffer: Buffer;
			buffer = (obj instanceof Buffer) ? obj : Buffer.from(obj.toString(), 'binary');

			return buffer.toString('base64');
		}

		return undefined;
	}
}
export const base64 = new Base64();
