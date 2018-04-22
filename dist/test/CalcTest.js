"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Calc_1 = require("../lib/Calc");
chai_1.should();
describe("Calc", function () {
    it("sign should return correct sign or NaN", function () {
        Calc_1.sign(-43).should.equal(-1);
        Calc_1.sign(+43).should.equal(1);
        Calc_1.sign(0).should.equal(0);
        Calc_1.sign(-0).should.equal(0);
        Calc_1.sign(Infinity).should.equal(1);
        Calc_1.sign(-Infinity).should.equal(-1);
        Calc_1.sign(undefined).should.be.NaN;
    });
    it("rotationDeg should return correct x, y with 1 degree precision (round down)", function () {
        Calc_1.rotationDeg(-360).should.deep.equal([1, 0]);
        Calc_1.rotationDeg(0).should.deep.equal([1, 0]);
        Calc_1.rotationDeg(360).should.deep.equal([1, 0]);
        Calc_1.rotationDeg(90)[0].should.approximately(0, 1e-6);
        Calc_1.rotationDeg(90)[1].should.approximately(1, 1e-6);
        Calc_1.rotationDeg(1)[0].should.approximately(0.9998477, 1e-6, "1 deg");
        Calc_1.rotationDeg(1)[1].should.approximately(0.01745241, 1e-6, "1 deg");
        Calc_1.rotationDeg(0.7)[0].should.equal(1, "0.7 deg");
        Calc_1.rotationDeg(0.7)[1].should.equal(0, "0.7 deg");
        Calc_1.rotationDeg(1.7)[0].should.approximately(0.9998477, 1e-6, "1.2 deg");
        Calc_1.rotationDeg(1.7)[1].should.approximately(0.01745241, 1e-6, "1.2 deg");
    });
    it("rotationRad should return correct x and y", function () {
        Calc_1.rotationRad(0).should.deep.equal([1, 0]);
        Calc_1.rotationRad(2 * Math.PI).should.deep.equal([1, 0]);
        Calc_1.rotationRad(Math.PI / 2)[0].should.approximately(0, 1e-6);
        Calc_1.rotationRad(Math.PI / 2)[1].should.approximately(1, 1e-6);
    });
    it("closestRadianRotation should return the approximative radian value", function () {
        Calc_1.closestRadianRotation(-2 * Math.PI).should.equal(0, "2PI rad");
        Calc_1.closestRadianRotation(0).should.equal(0, "0 rad");
        Calc_1.closestRadianRotation(2 * Math.PI).should.equal(0, "2PI rad");
        Calc_1.closestRadianRotation(Math.PI / 360).should.equal(0, "0.5 deg");
        Calc_1.closestRadianRotation(Math.PI / 180).should.approximately(Math.PI / 180, 1e-6, "1 deg");
    });
});
//# sourceMappingURL=CalcTest.js.map