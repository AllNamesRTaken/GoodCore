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
				@Poolable
				class PoolableFoo {
					public Foo = "foo";
				}
				const pool = new Pool(PoolableFoo);
				const obj = new PoolableFoo();
				obj.Foo.should.equal("foo");
				(obj as any).initPool(pool);
				(obj as any).__pool__.should.equal(pool);
				const available = pool.available;
				(obj as any).release();
				pool.available.should.equal(available + 1);
			});
	}
);
