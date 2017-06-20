import { should } from "chai";
import { jsdom } from "jsdom";
import { Timer } from "../lib/Timer";
import { init } from "../lib/Util";
import { createZeroTimeout, zeroTimeout } from "../lib/ZeroTimeout";
should();

describe("Util",
	function () {
		before(
			function () {
				const win = jsdom().defaultView;
				init(win);
				this.zero = createZeroTimeout();
			});
		it("Async should be close to 0 timeout",
			function (done) {
				Timer.start();
				this.zero(function () {
					Timer.stop();
					Timer.time.should.be.approximately(0, 5);
					done();
				});
			});
	}
);
