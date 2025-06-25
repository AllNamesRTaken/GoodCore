import { expect, describe, test } from 'vitest'
import { async } from "../lib/Decorators.js";

describe("AsyncCombinators",
	() => {
		test("before acts before",
			async function () {
				class Person {
					public anxiety: number = 0;
					@async.before!(function (): Promise<any> {
						return new Promise<void>((resolve, reject) => {
							setTimeout(() => {
								++this.anxiety;
								resolve();
							});
						});
					})
					@async
					public fret(...args: any[]) {
						expect(this.anxiety).toBe(1);
						++this.anxiety;
					}
					@async.before!(function (): Promise<any> {
						return new Promise<any>((resolve, reject) => {
							reject();
						});
					})
					@async
					public error(...args: any[]) {
						throw new Error("reason");
					}
				}
				let sam = new Person();
				await (sam.fret() as any).then(() => {
					expect(sam.anxiety).toBe(2);
				});
				await (sam.error() as any)
					.then(() => {
					})
					.catch((reason: Error) => {
						expect(true)
					});
				expect(sam.anxiety).toBe(2);
			});
		test("after acts after",
			async function () {
				class Person {
					public anxiety: number = 0;
					@async.after!(function (value, reason): Promise<any> {
						return new Promise<void>((resolve, reject) => {
							setTimeout(() => {
								this.anxiety++;
								resolve();
							});
						});
					})
					@async
					public fret(...args: any[]) {
						this.anxiety++;
						expect(this.anxiety).toBe(1);
					}
					@async.after!(function (_: any, reason: Error): Promise<any> {
						return new Promise<any>((resolve, reject) => {
							reject(reason);
						});
					})
					@async
					public error(...args: any[]) {
						throw new Error("reason");
					}
				}
				let sam = new Person();
				await (sam.fret(1) as any).then(() => {
					expect(sam.anxiety).toBe(2);
				});
				await (sam.error(1) as any).then(() => {
				})
					.catch((reason: Error) => {
						expect(true)
					});
			});
		test("provided acts if provided",
			async function () {
				class Person {
					public anxiety: number = 0;
					@async.provided!(function (): Promise<any> {
						return new Promise<any>((resolve, reject) => {
							setTimeout(() => {
								resolve(this.anxiety === 0);
							});
						});
					})
					@async
					public fret(...args: any[]) {
						this.anxiety++;
					}
					@async.provided!(function (name: string, ok: boolean): Promise<any> {
						return new Promise<any>((resolve, reject) => {
							setTimeout(() => {
								if (ok) {
									resolve(true);
								} else {
									reject("reject");
								}
							});
						});
					})
					@async
					public error(ok: boolean) {
						throw new Error("reason");
					}
				}
				let sam = new Person();
				await (sam.fret(1) as any).then(() => {
					expect(sam.anxiety).toBe(1);
					(sam.fret(1) as any).then(() => {
					}).catch((reason: any) => {
						expect(sam.anxiety).toBe(1);
					});
				});
				await (sam.error(true) as any).catch((reason: Error) => {
					expect(reason.message).toBe("reason");
					(sam.error(false) as any).catch((reason: string) => {
						expect(reason).toBe("reject");
					});
				});
			});
	}
);
