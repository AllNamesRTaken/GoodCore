import {should} from "chai";
import { Initable } from "../lib/standard/mixins/Initable";
should();

describe("Initable",
	function() {
		it("Initable should handle interfaces",
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
	}
);
