import {should} from "chai";
import { Initable } from "../lib/standard/mixins/Initable";
import { Poolable } from "../lib/standard/mixins/Poolable";
import { Pool } from "../lib/standard/Pool";
should();

describe("Pool",
	function() {
		it("Get gets first free instance",
			function(){
				class Base { public bar: number; }
				class Obj extends Poolable(Base) {}
				const pool = new Pool(Obj);
				const first = pool.get();
				first.should.be.instanceOf(Obj);
				const second = pool.get();
				second.should.be.instanceOf(Obj);
				first.should.not.equal(second);
				first.release();
				const third = pool.get();
				third.should.equal(first);
			});
		it("Getting more than growthStep increases the pool by growthStep",
			function(){
				class Base {}
				const PObj = Poolable(Base);
				class Obj extends PObj {}
				const pool = new Pool(Obj, 2);
				pool.size.should.equal(2);
				pool.available.should.equal(2);
				const first = pool.get();
				const second = pool.get();
				const third = pool.get();
				pool.size.should.equal(4);
				pool.available.should.equal(1);
				third.release();
				first.release();
				pool.available.should.equal(3);
			});
	}
);
