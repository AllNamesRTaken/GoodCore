import {should} from "chai";
import * as MocData from "../lib/MocData";
import * as Test from "../lib/Test";
should();

describe("MocData",
	function() {
		it("NumericArray Generates linear and non linead int and float arrays",
			function() {
				const base = MocData.numericArray(1);
				base.length.should.equal(1);
				(typeof(base[0])).should.equal("number");
				base[0].should.equal(base[0] | 0);
				MocData.numericArray(3, MocData.MocDataType.LinearInt).should.deep.equal([0, 1, 2]);
				MocData.numericArray(3, MocData.MocDataType.LinearFloat).should.deep.equal([0.5, 1.5, 2.5]);
				const rndInt = MocData.numericArray(3, MocData.MocDataType.RandomInt);
				rndInt.length.should.equal(3);
				rndInt[1].should.equal(rndInt[1] | 0);
				const rndFloat = MocData.numericArray(3, MocData.MocDataType.RandomFloat);
				rndFloat.length.should.equal(3);
				rndFloat[1].should.not.equal(rndFloat[1] | 0);
			});
		it("RandomInt returns int",
			function() {
				const val = MocData.randomInt();
				(typeof(val)).should.equal("number");
				val.should.equal(val | 0);

				const val2 = MocData.randomInt(10, 20);
				(typeof(val2)).should.equal("number");
				val2.should.equal(val2 | 0);
				(val2 >= 10 && val2 < 20).should.be.true;
			});
		it("RandomNumber returns number",
			function() {
				const val = MocData.randomNumber();
				(typeof(val)).should.equal("number");

				const val2 = MocData.randomNumber(10, 20);
				(typeof(val2)).should.equal("number");
				(val2 >= 10 && val2 < 20).should.be.true;
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
