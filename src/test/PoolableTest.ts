import { Poolable } from "../lib/standard/mixins/Poolable";
import { Pool } from "../lib/standard/Pool";
import assert = require("assert");
import { should } from "chai";
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
				const obj = new PoolableFoo();
				obj.Foo.should.equal("foo");
				obj.InitPool(pool);
				obj.__pool__.should.equal(pool);
				const available = pool.Available;
				obj.Release();
				pool.Available.should.equal(available + 1);
			});
	}
);
