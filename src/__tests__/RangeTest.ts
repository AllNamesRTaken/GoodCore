import { Range2 } from "../lib/struct/Range2";
import { Rect } from "../lib/struct/Rect";
import { Vec2 } from "../lib/struct/Vec2";

describe("Range2",
	() => {
		test("Equals return true if 2 ranges are the same",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = new Range2(1, 1, 2, 3);
				const r3 = new Range2(10, 1, 2, 3);
				expect(r1.equals(r2)).toBe(true);
				expect(r1.equals(r3)).toBe(false);
			});
		test("Left out constructor parameters are set to 0",
			() => {
				const r1 = new Range2();
				expect(r1.equals(new Range2(0, 0, 0, 0))).toBe(true);
			});
		test("Clone returns a clone",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = r1.clone();
				let r3 = new Range2();
				r1.clone(r3);
				expect(r1.equals(r1)).toBe(true);
				expect(r1).not.toBe(r2);
				expect(r1.equals(r3)).toBe(true);
			});
		test("Contains is true when a point is inside the range",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				expect(r1.containsPoint(new Vec2(2, 2))).toBe(true);
			});

		test("First returns first point that fulfills a condition or null",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				expect(r1
				.first(function(p) {
					return p.equals(new Vec2(2, 2));
				})!
				.equals(new Vec2(2, 2))).toBe(true);
				let notFound = r1
					.first(function(p) {
						return p.equals(new Vec2(200, 200));
					});
				expect((notFound === null)).toBe(true);
			});
		test("ForEach loops over all points",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const x: number[] = [];
				const y: number[] = [];
				r1.forEach(function(p) {
					x.push(p.x);
					y.push(p.y);
					return false;
				});
				expect(x).toEqual([1, 2, 1, 2, 1, 2]);
				expect(y).toEqual([1, 1, 2, 2, 3, 3]);
			});
		test("ForEach loops until function returns true",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const x: number[] = [];
				const y: number[] = [];
				r1.forEach(function(p) {
					x.push(p.x);
					y.push(p.y);
					return p.equals(new Vec2(2, 2));
				});
				expect(x).toEqual([1, 2, 1, 2]);
				expect(y).toEqual([1, 1, 2, 2]);
			});
		test("ForEach starts at given point if within range",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const x: number[] = [];
				const y: number[] = [];
				r1.forEach(function(p) {
					x.push(p.x);
					y.push(p.y);
					return false;
				}, new Vec2(2, 2));
				expect(x).toEqual([2, 1, 2]);
				expect(y).toEqual([2, 3, 3]);
			});
		test("Scale multiplies size with the components of a vector",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				expect(r1.scale(new Vec2(2, 3), false).equals(new Range2(1, 1, 4, 9))).toBe(true);
			});
		test("Scale can keep the center position",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				expect(r1.scale(new Vec2(2, 3)).equals(new Range2(0, -2, 4, 9))).toBe(true);
			});
		test("Set copies all values into the target range",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = new Range2(2, 3, 4, 5);
				r1.set(r2);
				expect(r1.equals(r2)).toBe(true);
				expect(r1).not.toBe(r2);
			});
		test("ToInt floors position to Integer",
			() => {
				const r1 = new Range2(1.2, 1.8, 2, 3);
				const r2 = new Range2(1, 1, 2, 3);
				expect(r1.toInt().equals(r2)).toBe(true);
			});
		test("Decimal is not int",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const r2 = new Range2(1, 1, 2, 3);
				expect(r1.toDecimal().equals(r2)).toBe(false);
				expect(r1.toDecimal().toInt().equals(r2)).toBe(true);
			});
		test("Translate scales both pos and size by a system vector",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				expect(r1.translate(new Vec2(2, 3)).equals(new Range2(2, 3, 4, 9))).toBe(true);
			});
		test("Move adds a vector to the position",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				expect(r1.move(new Vec2(2, 3)).equals(new Range2(3, 4, 2, 3))).toBe(true);
			});
		test("FromRect converts the a Rect to a range with end non-inclusive",
			() => {
				const r1 = new Rect(1, 1, 3, 4);
				let range1 = new Range2().fromRect(r1);
				expect(range1.equals(new Range2(1, 1, 2, 3))).toBe(true);

				const r2 = new Rect(1, 1, 3, 4, true);
				let range2 = new Range2().fromRect(r2);
				expect(range2.equals(new Range2(1, 1, 3, 4))).toBe(true);

				const r3 = new Rect(1, 1, -2, -3, true);
				let range3 = new Range2().fromRect(r3);
				expect(range3.equals(new Range2(1, 1, -4, -5))).toBe(true);
			});
		test("Contains is true if another range is fully contained",
			() => {
				const r1 = new Range2(1, 1, 2, 3);
				const inside = new Range2(1, 1, 2, 2);
				const partially = new Range2(1, 1, 2, 4);
				expect(r1.contains(inside)).toBe(true);
				expect(r1.contains(partially)).toBe(false);
			});
		test("isZero checks if both vectors are zero",
		() => {
			const r1 = new Range2(0, 0, 3, 4);
			expect(r1.isZero).toBe(false);
			const r2 = new Range2(0, 0, 0, 0);
			expect(r2.isZero).toBe(true);
		});
		test("Zero zeroes both vectors",
		() => {
			const r1 = new Range2(1, 1, 3, 4);
			r1.zero();
			expect(r1.isZero).toBe(true);
		});
		}
);
