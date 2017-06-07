import {should} from "chai";
import {expect} from "chai";
import { MocData, MocDataType } from "../lib/MocData";
import { Test } from "../lib/Test";
should();

describe("MocData",
	function() {
		it("NumericArray Generates linear and non linead int and float arrays",
			function(){
				const base = MocData.numericArray(1);
				base.length.should.equal(1);
				(typeof(base[0])).should.equal("number");
				base[0].should.equal(base[0] | 0);
				MocData.numericArray(3, MocDataType.LinearInt).should.deep.equal([0, 1, 2]);
				MocData.numericArray(3, MocDataType.LinearFloat).should.deep.equal([0.5, 1.5, 2.5]);
				const rndInt = MocData.numericArray(3, MocDataType.RandomInt);
				rndInt.length.should.equal(3);
				rndInt[1].should.equal(rndInt[1] | 0);
				const rndFloat = MocData.numericArray(3, MocDataType.RandomFloat);
				rndFloat.length.should.equal(3);
				rndFloat[1].should.not.equal(rndFloat[1] | 0);
			});
		it("RandomInt returns int",
			function() {
				const val = MocData.randomInt();
				(typeof(val)).should.equal("number");
				val.should.equal(val | 0);
			});
		it("RandomNumber returns number",
			function() {
				const val = MocData.randomNumber();
				(typeof(val)).should.equal("number");
			});
		it("RandomString returns string of correct length",
			function() {
				const val = MocData.randomString(10);
				(typeof(val)).should.equal("string");
				val.length.should.equal(10);
			});
		it("StringArray returns an array of strings of given length",
			function() {
				const val = MocData.stringArray(2, 3);
				Test.isArray(val).should.be.true;
				val.length.should.equal(2);
				val[1].length.should.equal(3);
				(typeof(val[1])).should.equal("string");
			});
	}
);
