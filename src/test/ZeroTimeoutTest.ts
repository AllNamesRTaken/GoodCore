import { should } from "chai";
import { JSDOM } from "jsdom";
import { Timer } from "../lib/Timer";
import { init } from "../lib/Util";
import { createZeroTimeout, zeroTimeout } from "../lib/ZeroTimeout";
should();

describe("Util",
	function () {
		before(
			function () {
				const win = new JSDOM().window;
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
