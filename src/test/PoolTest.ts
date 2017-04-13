import Poolable from "../lib/standard/mixins/Poolable";
import Pool from "../lib/standard/Pool";
import assert = require('assert');
import {should} from 'chai';
should();

describe('Pool',
    function() {
        it('Get gets first free instance',
            function(){
                class Base {}
                let PObj = Poolable(Base);
                class Obj extends PObj {}
                let pool = new Pool(Obj);
                let first = pool.Get();
                first.should.be.instanceOf(Obj);
                let second = pool.Get();
                second.should.be.instanceOf(Obj);
                first.should.not.equal(second);
                first.Release();
                let third = pool.Get();
                third.should.equal(first);
            });
        it('Getting more than growthStep increases the pool by growthStep',
            function(){
                class Base {}
                let PObj = Poolable(Base);
                class Obj extends PObj {}
                let pool = new Pool(Obj, 2);
                pool.Size.should.equal(2);
                pool.Available.should.equal(2);
                let first = pool.Get();
                let second = pool.Get();
                let third = pool.Get();
                pool.Size.should.equal(4);
                pool.Available.should.equal(1);
                third.Release();
                first.Release();
                pool.Available.should.equal(3);
            });
    }
);