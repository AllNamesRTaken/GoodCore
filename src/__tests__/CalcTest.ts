import { expect, describe, beforeAll, test } from 'vitest'
import { closestRadianRotation, rotationDeg, rotationRad, sign } from "../lib/Calc.js";

describe("Calc",
	() => {
		test("sign should return correct sign or NaN",
			() => {
				expect(sign(-43)).toBe(-1);
				expect(sign(+43)).toBe(1);
				expect(sign(0)).toBe(0);
				expect(sign(-0)).toBe(0);
				expect(sign(Infinity)).toBe(1);
				expect(sign(-Infinity)).toBe(-1);
				expect(sign(undefined as any)).toBe(NaN);
			});
		test("rotationDeg should return correct x, y with 1 degree precision (round down)",
			() => {
				expect(rotationDeg(-360)).toEqual([1, 0]);
				expect(rotationDeg(0)).toEqual([1, 0]);
				expect(rotationDeg(360)).toEqual([1, 0]);
				expect(rotationDeg(90)[0]).toBeCloseTo(0, 1e-6);
				expect(rotationDeg(90)[1]).toBeCloseTo(1, 1e-6);
				expect(rotationDeg(1)[0]).toBeCloseTo(0.9998477, 1e-6);
				expect(rotationDeg(1)[1]).toBeCloseTo(0.01745241, 1e-6);
				expect(rotationDeg(0.7)[0]).toBe(1);
				expect(rotationDeg(0.7)[1]).toBe(0);
				expect(rotationDeg(1.7)[0]).toBeCloseTo(0.9998477, 1e-6);
				expect(rotationDeg(1.7)[1]).toBeCloseTo(0.01745241, 1e-6);
			});
		test("rotationRad should return correct x and y",
			() => {
				expect(rotationRad(0)).toEqual([1, 0]);
				expect(rotationRad(2 * Math.PI)).toEqual([1, 0]);
				expect(rotationRad(Math.PI / 2)[0]).toBeCloseTo(0, 1e-6);
				expect(rotationRad(Math.PI / 2)[1]).toBeCloseTo(1, 1e-6);
			});
		test("closestRadianRotation should return the approximative radian value",
			() => {
				expect(closestRadianRotation(-2 * Math.PI)).toBe(0);
				expect(closestRadianRotation(0)).toBe(0);
				expect(closestRadianRotation(2 * Math.PI)).toBe(0);
				expect(closestRadianRotation(Math.PI / 360)).toBe(0);
				expect(closestRadianRotation(Math.PI / 180)).toBeCloseTo(Math.PI / 180, 1e-6);
			});
	}
);
