import {should} from "chai";
import { closestRadianRotation, rotationDeg, rotationRad, sign } from "../lib/Calc";
should();

describe("Calc",
	function() {
		it("sign should return correct sign or NaN",
			function(){
				sign(-43).should.equal(-1);
				sign(+43).should.equal(1);
				sign(0).should.equal(0);
				sign(-0).should.equal(0);
				sign(Infinity).should.equal(1);
				sign(-Infinity).should.equal(-1);
				sign(undefined as any).should.be.NaN;
			});
		it("rotationDeg should return correct x, y with 1 degree precision (round down)",
			function(){
				rotationDeg(-360).should.deep.equal([1, 0]);
				rotationDeg(0).should.deep.equal([1, 0]);
				rotationDeg(360).should.deep.equal([1, 0]);
				rotationDeg(90)[0].should.approximately(0, 1e-6);
				rotationDeg(90)[1].should.approximately(1, 1e-6);
				rotationDeg(1)[0].should.approximately(0.9998477, 1e-6, "1 deg");
				rotationDeg(1)[1].should.approximately(0.01745241, 1e-6, "1 deg");
				rotationDeg(0.7)[0].should.equal(1, "0.7 deg");
				rotationDeg(0.7)[1].should.equal(0, "0.7 deg");
				rotationDeg(1.7)[0].should.approximately(0.9998477, 1e-6, "1.2 deg");
				rotationDeg(1.7)[1].should.approximately(0.01745241, 1e-6, "1.2 deg");
			});
		it("rotationRad should return correct x and y",
			function(){
				rotationRad(0).should.deep.equal([1, 0]);
				rotationRad(2 * Math.PI).should.deep.equal([1, 0]);
				rotationRad(Math.PI / 2)[0].should.approximately(0, 1e-6);
				rotationRad(Math.PI / 2)[1].should.approximately(1, 1e-6);
			});
		it("closestRadianRotation should return the approximative radian value",
			function(){
				closestRadianRotation(-2 * Math.PI).should.equal(0, "2PI rad");
				closestRadianRotation(0).should.equal(0, "0 rad");
				closestRadianRotation(2 * Math.PI).should.equal(0, "2PI rad");
				closestRadianRotation(Math.PI / 360).should.equal(0, "0.5 deg"); 
				closestRadianRotation(Math.PI / 180).should.approximately(Math.PI / 180, 1e-6, "1 deg"); 
			});
	}
);
