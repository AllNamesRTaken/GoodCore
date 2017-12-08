export enum MocDataType {
	LinearInt = 0,
	RandomInt = 1,
	LinearFloat = 2,
	RandomFloat = 3
}
export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomString(length: number = 25): string {
	let result = "";
	for (let i = 0; i < length; i += 1) {
		result += VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));
	}
	return result;
}
export function randomInt(): number {
	return this.randomNumber() | 0;
}
export function randomNumber(): number {
	return Math.random() * 2147483647;
}
export function numericArray(length: number, type: MocDataType = MocDataType.LinearInt): number[] {
	const result: number[] = new Array(length);
	switch (type) {
		case MocDataType.RandomInt:
			for (let i = 0; i < length; i += 1) {
				result[i] = this.randomInt();
			}
			break;
		case MocDataType.LinearFloat:
			for (let i = 0; i < length; i += 1) {
				result[i] = i + 0.5;
			}
			break;
		case MocDataType.RandomFloat:
			for (let i = 0; i < length; i += 1) {
				result[i] = this.randomNumber();
			}
			break;
		default:
			for (let i = 0; i < length; i += 1) {
				result[i] = i;
			}
			break;
	}
	return result;
}
export function stringArray(arrayLength: number, stringLength?: number): string[] {
	const result = new Array(arrayLength);
	let i = -1;
	while (++i < arrayLength) {
		result[i] = this.randomString(stringLength);
	}
	return result;
}
