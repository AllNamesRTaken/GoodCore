"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Timer_1 = require("../lib/Timer");
chai_1.should();
describe("Timer", function () {
    it("Test Start Stop Time over 100ms", function (done) {
        Timer_1.Timer.start();
        setTimeout(function () {
            Timer_1.Timer.stop();
            Timer_1.Timer.time.should.be.approximately(100, 50);
            done();
        }, 100);
    });
});
//# sourceMappingURL=TimerTest.js.map