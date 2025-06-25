import { afterEach, beforeEach, afterAll, beforeAll, expect, describe, test, vi } from 'vitest'
import { Timer } from "../lib/Timer.js";

describe("Timer",
	() => {
		beforeEach(() => {
			vi.useFakeTimers();
		}),
		afterEach(() => {
			// vi.runOnlyPendingTimers()
			vi.useRealTimers()
		}),
		test.sequential("Test Static Start Stop Time over 100ms",
			function() {
				Timer.start();
				setTimeout(() => {
					Timer.stop();
					expect(Timer.time / 1000).toBeCloseTo(0.1, 2);
				}, 100);
				vi.advanceTimersToNextTimer();
			});
		test.sequential("Test Start Stop Time over 100ms",
			async function() {
				var t = new Timer();
				t.start();
				setTimeout(() => {
					Timer.stop();
					expect(Timer.time / 1000).toBeCloseTo(0.1, 2);
				}, 100);
				vi.advanceTimersToNextTimer();
			});
	}
);
