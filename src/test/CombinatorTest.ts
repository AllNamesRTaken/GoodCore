import {should} from "chai";
import { after, around, before, once, provided } from "../lib/standard/Combinators";
should();

describe("Combinators",
	function() {
		it("before acts before",
			function(){
				class Person {
					public anxiety: number = 0;
					@before(function() { 
						this.anxiety++;
					})
					public fret(...args: any[]) {
						this.anxiety.should.equal(1);
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(2);
			});

		it("after acts after",
			function(){
				class Person {
					public anxiety: number = 0;
					@after(function(name: string) { 
						this.anxiety++;
						name.should.equal("fret");
					})
					public fret(...args: any[]) {
						this.anxiety.should.equal(0);
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(2);
			});
		it("around acts around",
			function(){
				class Person {
					public anxiety: number = 0;
					@around(function(callback) { 
						this.anxiety++;
						callback();
						this.anxiety++;
					})
					public fret(...args: any[]) {
						this.anxiety.should.equal(1);
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(3);
			});
		it("provided acts if provided",
			function(){
				class Person {
					public anxiety: number = 0;
					@provided(function(name: string) { 
						return this.anxiety === 0;
					})
					public fret(...args: any[]) {
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(1);
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(1);
			});
		it("combination acts from outer to inner",
			function(){
				class Person {
					public anxiety: number = 0;
					@provided(function() { 
						return this.anxiety === 0;
					})
					@before(function() {
						this.anxiety++;
					})
					public fret(...args: any[]) {
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(2);
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(2);
			});
		it("once returns first value",
			function(){
				class Person {
					public anxiety: number = 0;
					@once
					public fret(...args: any[]) {
						return ++this.anxiety;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				sam.fret(1, 2, 3);
				sam.anxiety.should.equal(1);
			});
			
	}
);
