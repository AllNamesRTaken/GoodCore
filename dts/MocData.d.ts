export enum MocDataType {
    LinearInt = 0,
    RandomInt = 1,
    LinearFloat = 2,
    RandomFloat = 3,
}
export const VALID_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString(length?: number): string;
export function randomInt(min?: number, max?: number): number;
export function randomNumber(min?: number, max?: number): number;
export function numericArray(length: number, dataType?: MocDataType, min?: number, max?: number): number[];
export function stringArray(arrayLength: number, stringLength?: number): string[];
