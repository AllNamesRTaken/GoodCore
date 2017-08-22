import { should } from "chai";
import { Poolable } from "../lib/standard/mixins/Poolable";
import { Pool } from "../lib/standard/Pool";
should();

describe("Poolable",
	function() {
		before(function() {
		});
		it("Poolable has all the methods and does what i should",
			function() {
				class BaseObj {
					public Foo = "foo";
				}
				const _foo = Poolable(BaseObj);
				class PoolableFoo extends _foo { }	
				const pool = new Pool(PoolableFoo);
				const obj = new PoolableFoo(1, 2, 3);
				obj.Foo.should.equal("foo");
				obj.initPool(pool);
				obj.__pool__.should.equal(pool);
				const available = pool.available;
				obj.release();
				pool.available.should.equal(available + 1);
			});
	}
);
