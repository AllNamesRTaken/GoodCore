import { MocData } from "../lib/MocData";
import { Util } from "../lib/Util";
import assert = require("assert");
import {should} from "chai";
import {expect} from "chai";
should();

describe("MocData",
	function() {
		it("NumericArray Generates linear and non linead int and float arrays",
			function(){
				const base = MocData.NumericArray(1);
				base.length.should.equal(1);
				(typeof(base[0])).should.equal("number");
				base[0].should.equal(base[0] | 0);
				MocData.NumericArray(3, MocData.Type.LinearInt).should.deep.equal([0, 1, 2]);
				MocData.NumericArray(3, MocData.Type.LinearFloat).should.deep.equal([0.5, 1.5, 2.5]);
				const rndInt = MocData.NumericArray(3, MocData.Type.RandomInt);
				rndInt.length.should.equal(3);
				rndInt[1].should.equal(rndInt[1] | 0);
				const rndFloat = MocData.NumericArray(3, MocData.Type.RandomFloat);
				rndFloat.length.should.equal(3);
				rndFloat[1].should.not.equal(rndFloat[1] | 0);
			});
		it("RandomInt returns int",
			function() {
				const val = MocData.RandomInt();
				(typeof(val)).should.equal("number");
				val.should.equal(val | 0);
			});
		it("RandomNumber returns number",
			function() {
				const val = MocData.RandomNumber();
				(typeof(val)).should.equal("number");
			});
		it("RandomString returns string of correct length",
			function() {
				const val = MocData.RandomString(10);
				(typeof(val)).should.equal("string");
				val.length.should.equal(10);
			});
		it("StringArray returns an array of strings of given length",
			function() {
				const val = MocData.StringArray(2, 3);
				Util.IsArray(val).should.be.true;
				val.length.should.equal(2);
				val[1].length.should.equal(3);
				(typeof(val[1])).should.equal("string");
			});
	}
);
