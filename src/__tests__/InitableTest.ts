import { Initable } from "../lib/mixins/Initable.js";

describe("Initable",
	() => {
		test("Initable works as function wrapper around anon class",
			() => {
				class Person extends Initable(class {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}) {}
				let sam = new Person();
				
				sam.init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				expect(sam.age).toBe(17);
			});
		test("Initable works as function wrapper around Object",
			() => {
				class Person extends Initable() {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}
				let sam = new Person();
				sam.init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				expect(sam.age).toBe(17);
			});
		test("Initable works as function wrapper around named class",
			() => {
				class Human {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}
				class Person extends Initable(Human) {}
				let sam = new Person();
				
				sam.init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				expect(sam.age).toBe(17);
			});
		test("Initable works as decorator",
			() => {
				@Initable
				class Person {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}
				let sam = new Person();
				
				(sam as TInitable<Person>).init({ age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				expect(sam.age).toBe(17);
			});
	}
);
