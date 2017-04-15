import Stack from "../lib/struct/Stack";
import assert = require('assert');
import {should} from 'chai';
should();

describe('Stack',
    function() {
        it('Push and Pop should change Depth to show correct number of pushed items',
            function(){
                let stack = new Stack();
                stack.Depth.should.equal(0);
                stack.Push(1);
                stack.Depth.should.equal(1);
                stack.Pop()
                stack.Depth.should.equal(0);
            });
        it('Values returns an array of the pushed elements in order',
            function(){
                let stack = new Stack();
                stack.Push(1);
                stack.Push(2);
                stack.Values.should.deep.equal([1,2]);
            });
        it('ToList returns values as list',
            function(){
                let stack = new Stack();
                stack.Push(1);
                stack.Push(2);
                stack.ToList().Values.should.deep.equal([1,2]);
            });
    }
);