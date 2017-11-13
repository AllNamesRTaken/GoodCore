import {should} from "chai";
import { async } from "../lib/standard/AsyncCombinators";
should();

describe("AsyncCombinators",
	function() {
		it("before acts before",
			function(done){
				class Person {
					public anxiety: number = 0;
					@async.before!( function(): Promise<any> { 
						return new Promise<any>( (resolve, reject) => {
							setTimeout( () => {
								this.anxiety++;
								resolve();
							});
						});
					})
					@async
					public fret(...args: any[]) {
						this.anxiety.should.equal(1);
						this.anxiety++;
					}
					@async.before!( function(): Promise<any> { 
						return new Promise<any>( (resolve, reject) => {
							resolve();
						});
					})
					@async
					public error(...args: any[]) {
						throw new Error("reason");
					}
				}
				let sam = new Person();
				(sam.fret(1) as any).then(() => {
					sam.anxiety.should.equal(2);
				});
				(sam.error(1) as any)
				.then(() => {
				})
				.catch((reason: Error) => {
					done();
				});
				sam.anxiety.should.equal(0);				
			});
		it("after acts after",
			function(done){
				class Person {
					public anxiety: number = 0;
					@async.after!( function(value, reason): Promise<any> { 
						return new Promise<any>( (resolve, reject) => {
							setTimeout( () => {
								this.anxiety++;
								resolve();
							});
						});
					})
					@async
					public fret(...args: any[]) {
						this.anxiety++;
						this.anxiety.should.equal(1);
					}
					@async.after!( function(_: any, reason: Error ): Promise<any> { 
						return new Promise<any>( (resolve, reject) => {
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
					sam.anxiety.should.equal(2);
				});
				(sam.error(1) as any).then(() => {
				})
				.catch( (reason: Error) => {
					done();
				});
			});
		it("provided acts if provided",
			function(done){
				class Person {
					public anxiety: number = 0;
					@async.provided!(function(): Promise<any> { 
						return new Promise<any>( (resolve, reject) => {
							setTimeout( () => {
								resolve(this.anxiety === 0);
							});
						});
					})
					@async
					public fret(...args: any[]) {
						this.anxiety++;
					}
					@async.provided!(function(name: string, ok: boolean): Promise<any> { 
						return new Promise<any>( (resolve, reject) => {
							setTimeout( () => {
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
					sam.anxiety.should.equal(1);
					(sam.fret(1) as any).then(() => {
					}).catch( (reason: any) => {
						sam.anxiety.should.equal(1);
					});
				});
				(sam.error(true) as any).catch((reason: Error) => {
					reason.message.should.equal("reason");
					(sam.error(false) as any).catch((reason: string) => {
						reason.should.equal("reject");
						done();
					});
				});
			});
	}
);
