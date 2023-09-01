import { Rect } from "../lib/struct/Rect.js";
import { Vec2 } from "../lib/struct/Vec2.js";
import { Range2 } from "../lib/struct/Range2.js";

describe("Rect",
	() => {
		test("Clone returns a clone",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = r1.clone();
				let r3 = new Rect();
				r1.clone(r3);
				expect(r2.start.equals(new Vec2(1, 1))).toBe(true);
				expect(r2.stop.equals(new Vec2(3, 4))).toBe(true);
				expect(r1).not.toBe(r2);
				expect(r1.equals(r3)).toBe(true);
			});
		test("Equals is true when comparing equal rectangles",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = new Rect(1, 1, 3, 4);
				const r3 = new Rect(10, 1, 3, 4);
				expect(r1.equals(r2)).toBe(true);
				expect(r1.equals(r3)).toBe(false);
			});
		test("Left out constructor parameters are set to 0",
			() => {
				const r1 = new Rect();
				expect(r1.equals(new Rect(0, 0, 0, 0))).toBe(true);
			});
		test("Scale scales each dimension by the factors of a vector",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = r1.scale(new Vec2(2, 3), false);
				expect(r2.start.equals(new Vec2(1, 1))).toBe(true);
				expect(r2.stop.equals(new Vec2(5, 10))).toBe(true);
			});
		test("Scale can keep the center position by default",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = r1.scale(new Vec2(2, 3));
				expect(r2.start.equals(new Vec2(0, -2))).toBe(true);
				expect(r2.stop.equals(new Vec2(4, 7))).toBe(true);
			});
		test("ToInt floors each vector",
			() => {
				const r1 = new Rect(1.1, 1.2, 3.7, 4.8);
				expect(r1.toInt().equals(new Rect(1, 1, 3, 4))).toBe(true);
			});
		test("ToDecimal is decimal",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				r1.toDecimal();
				expect(r1.equals(new Rect(1, 1, 3, 4))).toBe(false);
				expect(r1.toInt().equals(new Rect(1, 1, 3, 4))).toBe(true);
			});
		test("Translate moved the rectangle by a vector",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				expect(r1.translate(new Vec2(2, 3)).equals(new Rect(2, 3, 6, 12))).toBe(true);
			});
		test("FromRange returns the correct rect",
			() => {
				const r1 = new Range2(1, 1, 3, 4);
				let rect1 = new Rect().fromRange2(r1);
				expect(rect1.start.equals(new Vec2(1, 1))).toBe(true);
				expect(rect1.stop.equals(new Vec2(4, 5))).toBe(true);
			});

		const r2 = new Range2(1, 1, -3, -4);
		let rect2 = new Rect().fromRange2(r2, true);
		expect(rect2.start.equals(new Vec2(1, 1))).toBe(true);
		expect(rect2.stop.equals(new Vec2(-1, -2))).toBe(true);
		test("Area return the correct size of the rectangle",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				expect(r1.area()).toBe(6);
			});
		test("Move adds a vector to each point in the rectangle",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				expect(r1.move(new Vec2(2, 3)).equals(new Rect(3, 4, 5, 7))).toBe(true);
			});
		test("Set sets start and stop vectors of Rect to that of another rect",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const r2 = new Rect(4, 5, 6, 7);
				r2.copy(r1);
				expect(r2.equals(new Rect(1, 1, 3, 4))).toBe(true);
			});
		test("Contains is true if another rect is fully contained",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const inside = new Rect(1, 1, 3, 3);
				const partially = new Rect(1, 1, 3, 5);
				expect(r1.contains(inside)).toBe(true);
				expect(r1.contains(partially)).toBe(false);
			});
		test("Intersect is true if another rect is partially contained",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				const inside = new Rect(1, 1, 3, 3);
				const partially = new Rect(1, 1, 3, 5);
				const outside = new Rect(10, 10, 13, 15);
				expect(r1.intersect(inside)).toBe(true);
				expect(r1.intersect(partially)).toBe(true);
				expect(r1.intersect(outside)).toBe(false);
			});
		test("isZero checks if both vectors are zero",
			() => {
				const r1 = new Rect(0, 0, 3, 4);
				expect(r1.isZero).toBe(false);
				const r2 = new Rect(0, 0, 0, 0);
				expect(r2.isZero).toBe(true);
			});
		test("Zero zeroes both vectors",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				r1.zero();
				expect(r1.isZero).toBe(true);
			});
	}
);
