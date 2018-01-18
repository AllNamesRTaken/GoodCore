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
				class PoolableFoo implements IPoolable {
					__pool__: IPool<IPoolable>;
					release(): void {
						throw new Error("Method not implemented.");
					}
					initPool(pool: IPool<IPoolable>): void {
						throw new Error("Method not implemented.");
					}
					public Foo = "foo";
				}
				const pool = new Pool(PoolableFoo);
				const obj = new PoolableFoo();
				obj.Foo.should.equal("foo");
				obj.initPool(pool);
				obj.__pool__.should.equal(pool);
				const available = pool.available;
				obj.release();
				pool.available.should.equal(available + 1);
			});
	}
);
