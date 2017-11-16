import {should} from "chai";
import { Dictionary } from "../lib/struct/Dictionary";
should();

describe("Dictionary",
	function() {
		it("Get returns Set value or undefined",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.get("key1").should.equal("value1");
				(d.get("key2") === undefined).should.be.true;
		});
		it("Values return array of values",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.values.should.deep.equal(["value1", "value2"]);
		});
		it("Keys return array of Keys",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.keys.should.deep.equal(["key1", "key2"]);
		});
		it("List return List of values",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.list.values.should.deep.equal(["value1", "value2"]);
		});
		it("Clear empties the dictionary",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.clear().values.length.should.equal(0);
		});
		it("Has returns true if dictionary has key otherwise false",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.has("key1").should.be.true;
				d.has("key2").should.be.false;
		});
		it("Contains returns true if dictionary has key otherwise false",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.contains("key1").should.be.true;
				d.contains("key2").should.be.false;
		});
		it("Delete removes a value from the dictionary",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.delete("key1");
				d.has("key1").should.be.false;
				d.values.should.deep.equal([]);
		});
		it("Count returns the corrent number of values",
			function(){
				const d = new Dictionary<string>();
				d.set("key1", "value1");
				d.set("key2", "value2");
				d.count.should.be.equal(2);
		});
		it("Should return undefined for object prototype functions ",
		function(){
			const d = new Dictionary<string>();
			(d.get("toString") === undefined).should.be.true;
		});
		it("ToJson formats Dict correct",
		function() {
			const d = new Dictionary<string>();
			d.set("key1", "value1");
			d.set("key2", "value2");
			JSON.stringify(d).should.equal('{"key1":"value1","key2":"value2"}');
		});
}

);
