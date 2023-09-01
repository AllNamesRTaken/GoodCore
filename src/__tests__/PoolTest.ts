import { Poolable } from "../lib/mixins/Poolable.js";
import { Pool } from "../lib/standard/Pool.js";

describe("Pool",
	() => {
		test("Get gets first free instance",
			() => {
				@Poolable
				class Obj { public bar: number; }
				const pool = new Pool(Obj);
				const first = pool.getInstance();
				expect(first).toBeInstanceOf(Obj);
				const second = pool.getInstance();
				expect(second).toBeInstanceOf(Obj);
				expect(first).not.toBe(second);
				first.release();
				const third = pool.getInstance();
				expect(third).toBe(first);
			});
		test("Getting more than growthStep increases the pool by growthStep",
			() => {
				@Poolable
				class Obj { }
				const pool = new Pool(Obj, 2);
				expect(pool.size).toBe(2);
				expect(pool.available).toBe(2);
				const first = pool.getInstance();
				const second = pool.getInstance();
				const third = pool.getInstance();
				expect(pool.size).toBe(4);
				expect(pool.available).toBe(1);
				third.release();
				first.release();
				expect(pool.available).toBe(3);
			});
	}
);
