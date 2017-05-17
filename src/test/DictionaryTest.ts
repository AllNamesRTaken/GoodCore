import {should} from "chai";
import { Dictionary } from "../lib/struct/Dictionary";
should();

describe("Dictionary",
	function() {
		it("Get returns Set value or undefined",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Get("key1").should.equal("value1");
				(d.Get("key2") === undefined).should.be.true;
		});
		it("Values return array of values",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Set("key2", "value2");
				d.Values.should.deep.equal(["value1", "value2"]);
		});
		it("Keys return array of Keys",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Set("key2", "value2");
				d.Keys.should.deep.equal(["key1", "key2"]);
		});
		it("List return List of values",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Set("key2", "value2");
				d.List.Values.should.deep.equal(["value1", "value2"]);
		});
		it("Clear empties the dictionary",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Set("key2", "value2");
				d.Clear().Values.length.should.equal(0);
		});
		it("Has returns true if dictionary has key otherwise false",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Has("key1").should.be.true;
				d.Has("key2").should.be.false;
		});
		it("Delete removes a value from the dictionary",
			function(){
				const d = new Dictionary<string>();
				d.Set("key1", "value1");
				d.Delete("key1");
				d.Has("key1").should.be.false;
				d.Values.should.deep.equal([]);
		});
	}

);
