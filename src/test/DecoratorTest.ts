import { should } from "chai";
import { debounced } from "../lib/Decorators";
should();

describe("Decorators",
    function () {
        it("debounced should debounce the instance function",
            function (done) {
                class Foo {
                    value = 0;
                    @debounced(20)
                    setFoo() {
                        ++this.value;
                    }
                }
                let foo1 = new Foo();
                let foo2 = new Foo();
                foo1.setFoo();
                foo1.setFoo();
                foo2.setFoo();
                setTimeout(() => {
                    foo1.value.should.equal(1);
                    foo2.value.should.equal(1);
                    done();
                }, 20);
            });
        it("debounced on async with leading should return same promise",
            async function () {
                class Foo {
                    value = 0;
                    @debounced(20, {leading: true})
                    async setFoo() {
                        return ++this.value;
                    }
                }
                let foo1 = new Foo();
                let val: number = 0;
                val = await foo1.setFoo();
                val.should.equal(1);
                val = await foo1.setFoo();
                val.should.equal(1);
                setTimeout( async () => {
                    val = await foo1.setFoo();
                    val.should.equal(2);
                }, 20)
                return true;
            });
    }
);