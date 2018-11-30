import { after, around, before, provided } from "../lib/Decorators";

describe("Combinators",
	() => {
		test("before acts before",
			() => {
				class Person {
					public anxiety: number = 0;
					@before(function() { 
						this.anxiety++;
					})
					public fret(...args: any[]) {
						expect(this.anxiety).toBe(1);
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				expect(sam.anxiety).toBe(2);
			});

		test("after acts after",
			() => {
				class Person {
					public anxiety: number = 0;
					@after(function(name: string) { 
						this.anxiety++;
						expect(name).toBe("fret");
					})
					public fret(...args: any[]) {
						expect(this.anxiety).toBe(0);
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				expect(sam.anxiety).toBe(2);
			});
		test("around acts around",
			() => {
				class Person {
					public anxiety: number = 0;
					@around(function(callback) { 
						this.anxiety++;
						callback();
						this.anxiety++;
					})
					public fret(...args: any[]) {
						expect(this.anxiety).toBe(1);
						this.anxiety++;
					}
				}
				let sam = new Person();
				sam.fret(1, 2, 3);
				expect(sam.anxiety).toBe(3);
			});
		test("provided acts if provided",
			() => {
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
				expect(sam.anxiety).toBe(1);
				sam.fret(1, 2, 3);
				expect(sam.anxiety).toBe(1);
			});
		test("combination acts from outer to inner",
			() => {
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
				expect(sam.anxiety).toBe(2);
				sam.fret(1, 2, 3);
				expect(sam.anxiety).toBe(2);
			});
			
	}
);
