import {should} from "chai";
import { Timer } from "../lib/Timer";
should();

describe("Timer",
	function() {
		it("Test Start Stop Time over 500ms",
			function(done){
				Timer.start();
				setTimeout(function() {
					Timer.stop();
					Timer.time.should.be.approximately(500, 50);
					done();
				}, 500);
			});
	}
);
