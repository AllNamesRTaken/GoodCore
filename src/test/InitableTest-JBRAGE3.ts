import {should} from "chai";
import { Initable } from "../lib/standard/mixins/Initable";
should();

describe("Initable",
	function() {
		it("Initable works as function wrapper around anon class",
			function(){
				class Person extends Initable(class {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}) {}
				let sam = new Person();
				
				sam.init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				sam.age.should.equal(17);
			});
		it("Initable works as function wrapper around named class",
			function(){
				class Human {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}
				class Person extends Initable(Human) {}
				let sam = new Person();
				
				sam.init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				sam.age.should.equal(17);
			});
		it("Initable works as decorator",
			function(){
				@Initable
				class Person {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}
				let sam = new Person();
				
				(sam as any).init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new Person()), JSON.stringify(sam));
				sam.age.should.equal(17);
			});
	}
);
