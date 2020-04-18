import fs from 'fs';

class JsonFile {
	read(path: string): any {
		try {
			return JSON.parse(fs.readFileSync(path, 'utf8'));
		} catch (error) {
			console.log(error);
		}
	}
	readTxt(path: string): string {
		try {
			return fs.readFileSync(path, 'utf8');
		} catch (error) {
			console.log(error);
		}
	}
	write(path: string, obj: any): void {
		try {
			fs.writeFileSync(path, JSON.stringify(obj, undefined, '\t'));
		} catch (error) {
			console.log(error);
		}
	}
}
export const jsonFile = new JsonFile();
