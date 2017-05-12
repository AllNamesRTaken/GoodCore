import Poolable from "../lib/standard/mixins/Poolable";
import Pool from "../lib/standard/Pool";
import assert = require("assert");
import {should} from "chai";
should();

describe("Pool",
	function() {
		it("Get gets first free instance",
			function(){
				class Base {}
				const PObj = Poolable(Base);
				class Obj extends PObj {}
				const pool = new Pool(Obj);
				const first = pool.Get();
				first.should.be.instanceOf(Obj);
				const second = pool.Get();
				second.should.be.instanceOf(Obj);
				first.should.not.equal(second);
				first.Release();
				const third = pool.Get();
				third.should.equal(first);
			});
		it("Getting more than growthStep increases the pool by growthStep",
			function(){
				class Base {}
				const PObj = Poolable(Base);
				class Obj extends PObj {}
				const pool = new Pool(Obj, 2);
				pool.Size.should.equal(2);
				pool.Available.should.equal(2);
				const first = pool.Get();
				const second = pool.Get();
				const third = pool.Get();
				pool.Size.should.equal(4);
				pool.Available.should.equal(1);
				third.Release();
				first.Release();
				pool.Available.should.equal(3);
			});
	}
);
