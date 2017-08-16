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
					public fret() {
						this.anxiety.should.equal(1);
						this.anxiety++;
					}
				}
				let sam = new Person();
				(sam.fret() as any).then(() => {
					sam.anxiety.should.equal(2);
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
					public fret() {
						this.anxiety++;
						this.anxiety.should.equal(1);
					}
				}
				let sam = new Person();
				(sam.fret() as any).then(() => {
					sam.anxiety.should.equal(2);
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
					public fret() {
						this.anxiety++;
					}
				}
				let sam = new Person();
				(sam.fret() as any).then(() => {
					sam.anxiety.should.equal(1);
					(sam.fret() as any).then(() => {
					}).catch( (reason: any) => {
						sam.anxiety.should.equal(1);
						done();
					});
				});
			});
	}
);
