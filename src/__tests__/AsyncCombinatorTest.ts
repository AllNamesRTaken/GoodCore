import { async } from "../lib/Decorators.js";

describe("AsyncCombinators",
	() => {
		test("before acts before",
			function (done) {
				class Person {
					public anxiety: number = 0;
					@async.before!(function (): Promise<any> {
						return new Promise<void>((resolve, reject) => {
							setTimeout(() => {
								this.anxiety++;
								resolve();
							});
						});
					})
					@async
					public fret(...args: any[]) {
						expect(this.anxiety).toBe(1);
						this.anxiety++;
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
				(sam.fret(1) as any).then(() => {
					expect(sam.anxiety).toBe(2);
				});
				(sam.error(1) as any)
					.then(() => {
					})
					.catch((reason: Error) => {
						done();
					});
				expect(sam.anxiety).toBe(0);
			});
		test("after acts after",
			function (done) {
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
				(sam.fret(1) as any).then(() => {
					expect(sam.anxiety).toBe(2);
				});
				(sam.error(1) as any).then(() => {
				})
					.catch((reason: Error) => {
						done();
					});
			});
		test("provided acts if provided",
			function (done) {
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
				(sam.fret(1) as any).then(() => {
					expect(sam.anxiety).toBe(1);
					(sam.fret(1) as any).then(() => {
					}).catch((reason: any) => {
						expect(sam.anxiety).toBe(1);
					});
				});
				(sam.error(true) as any).catch((reason: Error) => {
					expect(reason.message).toBe("reason");
					(sam.error(false) as any).catch((reason: string) => {
						expect(reason).toBe("reject");
						done();
					});
				});
			});
	}
);
