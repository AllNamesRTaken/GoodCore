import { Poolable } from "../lib/mixins/Poolable";
import { Pool } from "../lib/standard/Pool";

describe("Pool",
	() => {
		test("Get gets first free instance",
			() => {
				@Poolable
				class Obj { public bar: number; }
				const pool = new Pool(Obj);
				const first = pool.get();
				expect(first).toBeInstanceOf(Obj);
				const second = pool.get();
				expect(second).toBeInstanceOf(Obj);
				expect(first).not.toBe(second);
				first.release();
				const third = pool.get();
				expect(third).toBe(first);
			});
		test("Getting more than growthStep increases the pool by growthStep",
			() => {
				@Poolable
				class Obj { }
				const pool = new Pool(Obj, 2);
				expect(pool.size).toBe(2);
				expect(pool.available).toBe(2);
				const first = pool.get();
				const second = pool.get();
				const third = pool.get();
				expect(pool.size).toBe(4);
				expect(pool.available).toBe(1);
				third.release();
				first.release();
				expect(pool.available).toBe(3);
			});
	}
);
