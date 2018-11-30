
import * as MocData from "../lib/MocData";
import * as Test from "../lib/Test";

describe("MocData",
	() => {
		test("NumericArray Generates linear and non linead int and float arrays",
			() => {
				const base = MocData.numericArray(1);
				expect(base.length).toBe(1);
				expect((typeof(base[0]))).toBe("number");
				expect(base[0]).toBe(base[0] | 0);
				expect(MocData.numericArray(3, MocData.MocDataType.LinearInt)).toEqual([0, 1, 2]);
				expect(MocData.numericArray(3, MocData.MocDataType.LinearFloat)).toEqual([0.5, 1.5, 2.5]);
				const rndInt = MocData.numericArray(3, MocData.MocDataType.RandomInt);
				expect(rndInt.length).toBe(3);
				expect(rndInt[1]).toBe(rndInt[1] | 0);
				const rndFloat = MocData.numericArray(3, MocData.MocDataType.RandomFloat);
				expect(rndFloat.length).toBe(3);
				expect(rndFloat[1]).not.toBe(rndFloat[1] | 0);
			});
		test("RandomInt returns int",
			() => {
				const val = MocData.randomInt();
				expect((typeof(val))).toBe("number");
				expect(val).toBe(val | 0);

				const val2 = MocData.randomInt(10, 20);
				expect((typeof(val2))).toBe("number");
				expect(val2).toBe(val2 | 0);
				expect((val2 >= 10 && val2 < 20)).toBe(true);
			});
		test("RandomNumber returns number",
			() => {
				const val = MocData.randomNumber();
				expect((typeof(val))).toBe("number");

				const val2 = MocData.randomNumber(10, 20);
				expect((typeof(val2))).toBe("number");
				expect((val2 >= 10 && val2 < 20)).toBe(true);
			});
		test("RandomString returns string of correct length",
			() => {
				const val = MocData.randomString(10);
				expect((typeof(val))).toBe("string");
				expect(val.length).toBe(10);
			});
		test("StringArray returns an array of strings of given length",
			() => {
				const val = MocData.stringArray(2, 3);
				expect(Test.isArray(val)).toBe(true);
				expect(val.length).toBe(2);
				expect(val[1].length).toBe(3);
				expect((typeof(val[1]))).toBe("string");
			});
	}
);
