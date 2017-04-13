import { Timer } from "../lib/Timer";
import assert = require('assert');
import {should} from 'chai';
should();

describe('Timer',
    function() {
        it('Test Start Stop Time over 500ms',
            function(done){
                Timer.Start();
                setTimeout(function() {
                    Timer.Stop();
                    Timer.Time.should.be.approximately(500, 50);
                    done();
                }, 500);
            });
    }
);