import { beforeAll, expect, describe, test } from 'vitest'
import { Poolable } from "../lib/mixins/Poolable.js";
import { Pool } from "../lib/standard/Pool.js";

describe("Poolable",
	() => {
		beforeAll(() => {
		});
		test("Poolable has all the methods and does what i should",
			() => {
				@Poolable
				class PoolableFoo {
					public Foo = "foo";
				}
				const pool = new Pool(PoolableFoo);
				const obj = new PoolableFoo();
				expect(obj.Foo).toBe("foo");
				(obj as any).initPool(pool);
				expect((obj as any).__pool__).toBe(pool);
				const available = pool.available;
				(obj as any).release();
				expect(pool.available).toBe(available + 1);
			});
	}
);
