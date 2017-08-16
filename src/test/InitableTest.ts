import {should} from "chai";
import { Initable } from "../lib/standard/mixins/Initable";
should();

describe("Initable",
	function() {
		it("Initable should handle interfaces",
			function(){
				class Person {
					public name: string = "";
					public age: number = 0;
					public superPower: string | null = null;
				}
				class InitablePerson extends Initable(Person) {}
				let sam = new InitablePerson();
				sam.init({age: 17, name: "Sam", superPower: "badassery"});
				console.log(JSON.stringify(new InitablePerson()), JSON.stringify(sam));
				sam.age.should.equal(17);
			});
	}
);
