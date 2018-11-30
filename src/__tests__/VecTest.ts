import { Vec2, Vec2Const } from "../lib/struct/Vec2";
// tslint:disable-next-line:ordered-imports

describe("Vec2",
	() => {
		beforeAll(() => {

		});
		test("new should create correct sized vec2",
			() => {
				const v1 = new Vec2(2, 3);
				expect(v1.x).toBe(2);
				expect(v1.y).toBe(3);
			});
		test("Add adds correctly",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(4, 5);
				v1.add(v2);
				expect(v1.x).toBe(6);
				expect(v1.y).toBe(8);
			});
		test("Subtract subtracts correctly",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(4, 5);
				v1.subtract(v2);
				expect(v1.x).toBe(-2);
				expect(v1.y).toBe(-2);
			});
		test("Scale multiplies each factor with the corresponding factor in the scale vector",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(4, 5);
				v1.scale(v2);
				expect(v1.x).toBe(8);
				expect(v1.y).toBe(15);
			});
		test("Multiply multiplies both factors with a scalar",
			() => {
				const v1 = new Vec2(2, 3);
				v1.multiply(2);
				expect(v1.x).toBe(4);
				expect(v1.y).toBe(6);
			});
		test("Clone returns an exact clone",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = v1.clone();
				const v3 = new Vec2();
				v1.clone(v3);
				expect(v1.x).toBe(v2.x);
				expect(v1.y).toBe(v2.y);
				expect(v1).not.toBe(v2);
				expect(v1.equals(v3)).toBe(true);
			});
		test("Ceil performs ceiling on both factors",
			() => {
				const v1 = new Vec2(2.2, 3.8);
				v1.ceil();
				expect(v1.x).toBe(3);
				expect(v1.y).toBe(4);
			});
		test("Equal compares 2 vectors",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(2, 3);
				const v3 = new Vec2(1, 1);
				expect(v1.equals(v2)).toBe(true);
				expect(v1.equals(v3)).toBe(false);
			});
		test("Equal compares 2 vectors with Epislon fault tolerance",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(2, 3 + Vec2Const.EPSILON);
				const v3 = new Vec2(2, 3 + 2 * Vec2Const.EPSILON);
				expect(v1.almostEquals(v2)).toBe(true);
				expect(v1.almostEquals(v3)).toBe(false);
			});
		test("Invert inverts both factors",
			() => {
				const v1 = new Vec2(2, 4);
				v1.invert();
				expect(v1.x).toBe(-2);
				expect(v1.y).toBe(-4);
			});
		test("LengthSq = x^2 + y^2",
			() => {
				const v1 = new Vec2(2, 3);
				expect(v1.lengthSq()).toBe(2 * 2 + 3 * 3);
			});
		test("Length = sqrt(x^2 + y^2)",
			() => {
				const v1 = new Vec2(2, 3);
				expect(v1.length()).toBe(Math.sqrt(2 * 2 + 3 * 3));
			});
		test("Set sets each factor to that of another vector",
			() => {
				const v1 = new Vec2(2, 3);
				const v2 = new Vec2(1, 2);
				v1.set(v2);
				expect(v1.x).toBe(1);
				expect(v1.y).toBe(2);
			});
		test("Int makes it to an Int by flooring it",
			() => {
				const v1 = new Vec2(2.2, 3.8);
				v1.toInt();
				expect(v1.x).toBe(2);
				expect(v1.y).toBe(3);
			});
		test("Decimal makes it to a decimal",
			() => {
				const v1 = new Vec2(2, 3);
				v1.toDecimal();
				expect((v1.x) | 0).not.toBe(v1.x);
				expect((v1.y) | 0).not.toBe(v1.y);
				v1.toInt();
				expect(v1.x).toBe(2);
				expect(v1.y).toBe(3);
			});
		test("Relate divides each factor by the corresponding factor in another vector",
			() => {
				const v1 = new Vec2(4, 12);
				const v2 = new Vec2(2, 4);
				v1.relate(v2);
				expect(v1.x).toBe(2);
				expect(v1.y).toBe(3);
			});
		test("Normalize returns length 1 vector",
			() => {
				const v1 = new Vec2(3, 12);
				expect(v1.normalize().length()).toBe(1);
			});
		test("Normalize of zero length vector returns 1,0",
			() => {
				const v1 = new Vec2(0, 0);
				expect(v1.normalize().equals(new Vec2(1, 0))).toBe(true);
			});
		test("Rotate 1,0 Pi/2 returns correct vector 0,1",
			() => {
				const v1 = new Vec2(1, 0);
				expect(v1.rotate(Math.PI / 2).almostEquals(new Vec2(0, 1))).toBe(true);
			});
		test("HorizontalAngle returns Radians rotated counter clockwise from 1,0",
			() => {
				const v1 = new Vec2(1, 0);
				const v2 = new Vec2(0, 1);
				const v3 = new Vec2(-1, 0);
				const v4 = new Vec2(0, -1);
				expect(v1.horizontalAngle()).toBe(0);
				expect(v2.horizontalAngle()).toBe(Math.PI / 2);
				expect(v3.horizontalAngle()).toBe(Math.PI);
				expect(v4.horizontalAngle()).toBe(-Math.PI / 2);
			});
		test("VerticalAngle returns Radians rotated clockwise from 0,1",
			() => {
				const v1 = new Vec2(1, 0);
				const v2 = new Vec2(0, 1);
				const v3 = new Vec2(-1, 0);
				const v4 = new Vec2(0, -1);
				expect(v1.verticalAngle()).toBe(Math.PI / 2);
				expect(v2.verticalAngle()).toBe(0);
				expect(v3.verticalAngle()).toBe(-Math.PI / 2);
				expect(v4.verticalAngle()).toBe(Math.PI);
			});
		test("RotateAround returns vector rotated around a given point",
			() => {
				const v1 = new Vec2(1, 0);
				expect(v1.rotateAround(new Vec2(-1, 0), Math.PI).almostEquals(new Vec2(-3, 0))).toBe(true);
			});
		test("GetNormal returns 0,-1 for 10,0",
			() => {
				const v1 = new Vec2(10, 0);
				const v2 = v1.getNormal();
				expect(v2.almostEquals(new Vec2(0, -1))).toBe(true);
			});
		test("RotateBy returns vector rotated from 1,0",
			() => {
				const v1 = new Vec2(0, 1);
				expect(v1.rotateBy(Math.PI).almostEquals(new Vec2(-1, 0))).toBe(true);
			});
		test("ProjectOnto projects a vector onto another vector",
			() => {
				const v1 = new Vec2(2, 2);
				expect(v1.projectOnto(new Vec2(3, 0)).equals(new Vec2(2, 0))).toBe(true);
			});
		test("Dot returns the dotproduct of two vectors",
			() => {
				const v1 = new Vec2(2, 2);
				const v2 = new Vec2(-1, 3);
				expect(v1.dot(v2)).toBe(4);
			});
		test("Cross returns scalar value of the z component of the cross product in 3d ",
			() => {
				const v1 = new Vec2(2, 2);
				const v2 = new Vec2(-1, 3);
				expect(v1.cross(v2)).toBe(8);
			});
		test("Max sets the components to the largest of it and an input vector",
			() => {
				expect((new Vec2(1, 2)).max(new Vec2(3, 1)).equals(new Vec2(3, 2))).toBe(true);
			});
		test("Min sets the components to the smallest of it and an input vector",
			() => {
				expect((new Vec2(1, 2)).min(new Vec2(3, 1)).equals(new Vec2(1, 1))).toBe(true);
			});

	}
);
