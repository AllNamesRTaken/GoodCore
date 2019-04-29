import { Timer } from "../lib/Timer";

describe("Timer",
	() => {
		test("Test Static Start Stop Time over 100ms",
			function(done) {
				Timer.start();
				setTimeout(() => {
					Timer.stop();
					expect(Timer.time / 1000).toBeCloseTo(0.1, 2);
					done();
				}, 100);
			});
		test("Test Start Stop Time over 100ms",
			function(done) {
				var t = new Timer();
				t.start();
				setTimeout(() => {
					t.stop();
					expect(t.time / 1000).toBeCloseTo(0.1, 2);
					done();
				}, 100);
			});
	}
);
