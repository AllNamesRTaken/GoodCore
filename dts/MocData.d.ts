export enum MocDataType {
    LinearInt = 0,
    RandomInt = 1,
    LinearFloat = 2,
    RandomFloat = 3,
}
export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString(length?: number): string;
export function randomInt(): number;
export function randomNumber(): number;
export function numericArray(length: number, type?: MocDataType): number[];
export function stringArray(arrayLength: number, stringLength?: number): string[];
