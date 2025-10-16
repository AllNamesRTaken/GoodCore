import {
    expect,
    describe,
    test,
    vi,
    afterAll,
    beforeEach,
    afterEach,
} from "vitest";
import { Pipeline } from "../lib/standard/Pipeline.ts";

const delay = (fn: () => any, ms = 0) =>
    new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(fn());
            } catch (e) {
                reject(e);
            }
        }, ms);
    });

describe("Pipeline", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        // vi.runOnlyPendingTimers()
        vi.useRealTimers();
    });
    test.sequential("Sync pipeline works", async function () {
        function toString(input: number) {
            return input.toString();
        }
        function shout(input: string) {
            return input.toUpperCase() + "!";
        }
        function add5(input: number) {
            return input + 5;
        }
        const pipe = Pipeline.step((_, step) => 10)
            .step(add5)
            .step(toString)
            .step(shout, { inputs: [toString] });

        const pipeWithInput = Pipeline.step((input: number, step) => input)
            .step(add5)
            .step(toString)
            .step(shout, { inputs: [toString] });

        const success = pipe.run();
        const successWithInput = pipeWithInput.run(20);
        await vi.runAllTimersAsync();
        const result = await success;
        const resultWithInput = await successWithInput;

        expect(result.value).toBe("15!");
        expect(resultWithInput.value).toBe("25!");
    });
    test.sequential(
        "Sync pipeline with multiple inputs works",
        async function () {
            function toString(input: number) {
                return input.toString();
            }
            function shout(input: [number, string]) {
                return (input[0] + input[1]).toUpperCase() + "!";
            }
            function add5(input: number) {
                return input + 5;
            }
            const pipe = Pipeline.step((_, step) => 10)
                .step(add5)
                .step(toString)
                .step(shout, { inputs: [add5, toString] });

            const pipeWithInput = Pipeline.step((input: number, step) => input)
                .step(add5)
                .step(toString)
                .step(shout, { inputs: ["add5", "toString"] });

            const success = pipe.run();
            const successWithInput = pipeWithInput.run(20);
            await vi.runAllTimersAsync();
            const result = await success;
            const resultWithInput = await successWithInput;

            expect(result.value).toBe("1515!");
            expect(resultWithInput.value).toBe("2525!");
        },
    );
    test.sequential("Async pipeline works", async function () {
        const pipe = Pipeline.step(async (_, step) => delay(() => 10))
            .step(async (input, step) => delay(() => input + 5))
            .step(async (input, step) => delay(() => input.toString()));

        const success = pipe.run();
        await vi.runAllTimersAsync();
        const result = await success;

        expect(result.value).toBe("15");
    });
    test.sequential(
        "stateAt() returns result for named and indexed step",
        async function () {
            const pipe = Pipeline.step(function step1(input: number, step) {
                return input;
            })
                .step(function step2(input, step) {
                    return input + 5;
                })
                .step(function step3(input, step) {
                    return input.toString();
                })
                .instantiate();

            const success = pipe.run(20);

            await vi.runAllTimersAsync();

            expect(pipe.stateAt("step1")?.value).toBe(20);
            expect(pipe.stateAt("nonexisting")).toBe(undefined);
            expect(pipe.stateAt(1)?.value).toBe(25);
        },
    );
    test.sequential(
        "stateAt() returns result for indexed step when not named",
        async function () {
            const pipe = Pipeline.step((input: number, step) => input)
                .step((input, step) => input + 5)
                .step((input, step) => input.toString())
                .instantiate();

            const success = pipe.run(20);

            await vi.runAllTimersAsync();

            expect(pipe.stateAt("step1")?.value).toBe(undefined);
            expect(pipe.stateAt("nonexisting")).toBe(undefined);
            expect(pipe.stateAt(1)?.value).toBe(25);
        },
    );
    test.sequential(
        "stateAt() inside step returns result for named step",
        async function () {
            const pipe = Pipeline.step(function step1(input: number, step) {
                return input;
            })
                .step(function step2(input, step) {
                    return input + 5;
                })
                .step(
                    function step3(input: number[], step) {
                        return input.reduce((acc, curr) => acc + curr, 0);
                    },
                    { inputs: ["step1", "step2"] },
                );

            const success = pipe.run(20);

            await vi.runAllTimersAsync();
            const result = await success;

            expect(result?.value).toBe(45);
        },
    );
    test.sequential("Sync pipeline retries works", async function () {
        const pipe = Pipeline.step((_, step) => 10)
            .step((input, step) => input + 5)
            .step((input, step) => {
                if (step.shouldRetry()) throw new Error("Retry");
                return input.toString();
            })
            .instantiate();

        const success = pipe.run();
        await vi.runAllTimersAsync();
        const result = await success;

        expect(result.value).toBe("15");
        expect(pipe.steps[2].run).toBe(3);
    });
    test.sequential("Async pipeline retries works", async function () {
        const pipe = Pipeline.step(async (_, step) => delay(() => 10))
            .step(async (input, step) => delay(() => input + 5))
            .step(async (input, step) =>
                delay(() => {
                    if (step.shouldRetry()) throw new Error("Retry");
                    return input.toString();
                }),
            )
            .instantiate();

        const success = pipe.run();
        await vi.runAllTimersAsync();
        const result = await success;

        expect(result.value).toBe("15");
        expect(pipe.steps[2].run).toBe(3);
    });
    test.sequential("Async pipeline too many retries fail", async function () {
        const pipe = Pipeline.step(async (_, step) => delay(() => 10))
            .step(async (input, step) => delay(() => input + 5))
            .step(async (input, step) =>
                delay(() => {
                    throw new Error("Retry");
                }),
            );

        const success = pipe.run();
        await vi.runAllTimersAsync();
        const result = await success;

        expect(result.success).toBe(false);
        expect(result.value).toBe("Error: Retry");
        expect(result.message).toBe("Failed at step 3");
        expect(result.step).toBe(3);
    });
    test.sequential("Pipeline with retry strategy works", async function () {
        const pipe = Pipeline.configure({
            retries: 3,
            retryStrategy: (step) => step.run * 10,
        })
            .step((_, step) => 10)
            .step((input, step) => input + 5)
            .step((input, step) => {
                if (step.shouldRetry()) throw new Error("Retry");
                return input.toString();
            })
            .instantiate();

        const start = Date.now();
        const success = pipe.run();
        while (vi.getTimerCount()) {
            await vi.runOnlyPendingTimersAsync();
        }
        await vi.runAllTimersAsync();
        const result = await success;
        const time = Date.now() - start;

        expect(result.value).toBe("15");
        expect(pipe.steps[2].run).toBe(4);
        expect(time).toBe(10 + 20 + 30); // Sum of delays
    });
    test.sequential("Pipeline with long lasting steps work", async function () {
        const pipe = Pipeline.configure({
            retries: 3,
            retryStrategy: (step) => step.run * 10,
        })
            .step((_, step) => 10)
            .step((input, step) => input + 5)
            .step(
                async (input, step) =>
                    await delay(() => {
                        if (step.shouldRetry()) throw new Error("Retry");
                        return input.toString();
                    }, step.run * 100),
            )
            .instantiate();

        const start = Date.now();
        const success = pipe.run();
        while (vi.getTimerCount()) {
            await vi.runOnlyPendingTimersAsync();
        }
        await vi.runAllTimersAsync();
        const result = await success;
        const time = Date.now() - start;

        expect(result.value).toBe("15");
        expect(pipe.steps[2].run).toBe(4);
        expect(time).toBe(10 + 100 + 20 + 200 + 30 + 300 + 400); // Sum of delays
        expect(pipe.steps[0].duration).toBe(0);
        expect(pipe.steps[2].duration).toBeGreaterThanOrEqual(400);
        expect(pipe.steps[2].durations).toEqual([100, 200, 300, 400]);
    });
    test.sequential("Async pipeline with timeout times out", async function () {
        const pipe = Pipeline.step(async (_, step) => delay(() => 10))
            .step(async (input, step) => delay(() => input + 5))
            .step(
                async (input, step) =>
                    delay(() => {
                        return input.toString();
                    }, 1000),
                { timeout: 50, retries: 0 },
            );

        const success = pipe.run();
        await vi.runAllTimersAsync();
        const result = await success;

        expect(result.success).toBe(false);
    });
    test.sequential(
        "Async pipeline with timeout times out and retries",
        async function () {
            const pipe = Pipeline.step(async (_, step) => delay(() => 10))
                .step(async (input, step) => delay(() => input + 5))
                .step(
                    async (input, step) =>
                        delay(
                            () => {
                                return input.toString();
                            },
                            1000 - step.run * 500,
                        ),
                    { timeout: 50, retries: 2 },
                );

            const success = pipe.run();
            await vi.runAllTimersAsync();
            const result = await success;

            expect(result.success).toBe(true);
        },
    );
    test.sequential(
        "Conditional pipeline with boolean test works",
        async function () {
            const truePipe = Pipeline.step((input: number) => input * 2).step(
                (input: number) => input + 10,
            );
            const falsePipe = Pipeline.step((input: number) => input * 2).step(
                (input: number) => input + 20,
            );

            const pipeWithDefault = Pipeline.step((input: number) => input)
                .conditional((input: number) => input > 15, truePipe)
                .step((input: number) => input + 100);

            const pipeWithoutDefault = Pipeline.step((input: number) => input)
                .conditional(
                    (input: number) => input > 15,
                    [truePipe, falsePipe],
                )
                .step((input: number) => input + 100);

            const resultFalse = pipeWithDefault.run(10); // 10 > 15 = false, continue
            await vi.runAllTimersAsync();
            const finalFalse = await resultFalse;

            const resultTrue = pipeWithDefault.run(20); // 20 > 15 = true, truePipe
            await vi.runAllTimersAsync();
            const finalTrue = await resultTrue;

            const resultFalse2 = pipeWithoutDefault.run(10); // 10 > 15 = false, run falsePipe
            await vi.runAllTimersAsync();
            const finalFalse2 = await resultFalse2;

            const resultTrue2 = pipeWithoutDefault.run(20); // 20 > 15 = true, run truePipe
            await vi.runAllTimersAsync();
            const finalTrue2 = await resultTrue2;

            expect(finalFalse.value).toBe(110); // 10 + 100
            expect(finalTrue.value).toBe(150); // ((20 * 2) + 10) + 100 = 50 + 100
            expect(finalFalse2.value).toBe(140); // 10 + 100
            expect(finalTrue2.value).toBe(150); // ((20 * 2) + 10) + 100 = 50 + 100
        },
    );

    test.sequential(
        "Conditional pipeline with integer test works",
        async function () {
            const alt0Pipe = Pipeline.step((input: number) => input * 3);
            const alt1Pipe = Pipeline.step((input: number) => input * 4);

            const pipe = Pipeline.step((input: number) => input)
                .conditional(
                    (input: number) => (input === 0 ? 0 : 1),
                    [alt0Pipe, alt1Pipe],
                )
                .step((input: number) => input + 5);

            const resultZero = pipe.run(0); // 0 === 0 = true, run alt0Pipe
            await vi.runAllTimersAsync();
            const finalZero = await resultZero;

            const resultOne = pipe.run(7); // 7 !== 0 = false, run alt1Pipe
            await vi.runAllTimersAsync();
            const finalOne = await resultOne;

            expect(finalZero.value).toBe(5); // 0 + 5
            expect(finalOne.value).toBe(33); // (7 * 4) + 5 = 28 + 5
        },
    );

    test.sequential("Async conditional pipeline works", async function () {
        const secondaryPipe = Pipeline.step(async (input: number) =>
            delay(() => input * 2),
        ).step(async (input: number) => delay(() => input - 3));

        const pipe = Pipeline.step(async (input: number) => delay(() => input))
            .conditional(
                async (input: number) => delay(() => input > 10),
                secondaryPipe,
            )
            .step(async (input: number) => delay(() => input.toString()));

        const resultFalse = pipe.run(5); // 5 > 10 = false
        await vi.runAllTimersAsync();
        const resultTrue = pipe.run(15); // 15 > 10 = true

        const finalFalse = await resultFalse;
        await vi.runAllTimersAsync();
        const finalTrue = await resultTrue;

        expect(finalFalse.value).toBe("5"); // '5'
        expect(finalTrue.value).toBe("27"); // ((15 * 2) - 3).toString() = '27'
    });

    test.sequential(
        "Conditional pipeline with 2 conditional pipelines works",
        async function () {
            const firstConditionalPipe = Pipeline.step(
                (input: number) => input * 2,
            ).step((input: number) => input + 5);

            const secondConditionalPipe = Pipeline.step(
                (input: number) => input - 3,
            ).step((input: number) => input * 4);

            const pipe = Pipeline.step((input: number) => input)
                .conditional(
                    (input: number) => (input < 10 ? 0 : input < 30 ? 1 : 2),
                    [firstConditionalPipe, secondConditionalPipe],
                )
                .step((input: number) => input + 100);

            // Test case 1: input < 10, runs first conditional
            const resultFirst = pipe.run(5); // 5 < 10 = true, run first conditional
            await vi.runAllTimersAsync();
            const finalFirst = await resultFirst;

            // Test case 2: input > 20, runs second conditional
            const resultSecond = pipe.run(25); // 25 > 20 = true, run second conditional
            await vi.runAllTimersAsync();
            const finalSecond = await resultSecond;

            // Test case 3: 10 <= input <= 20, runs neither conditional
            const resultNeither = pipe.run(35); // neither condition met
            await vi.runAllTimersAsync();
            const finalNeither = await resultNeither;

            expect(finalFirst.value).toBe(115); // ((5 * 2) + 5) + 100 = 15 + 100
            expect(finalSecond.value).toBe(188); // ((25 - 3) * 4) + 100 = 88 + 100
            expect(finalNeither.value).toBe(
                "Error: Conditional pipeline index out of range: 2",
            ); // 15 + 100
        },
    );

    test.sequential("Pipeline with effect function works", async function () {
        let effectValue: number | undefined;

        const pipe = Pipeline.step((input: number) => input * 2)
            .effect((value: number) => {
                effectValue = value;
            })
            .step((input: number) => input + 10);

        const result = pipe.run(5);
        await vi.runAllTimersAsync();
        const final = await result;

        expect(effectValue).toBe(10); // Effect captured the value from step1
        expect(final.value).toBe(20); // Step2 received the same value: 10 + 10
    });

    test.sequential("Pipeline with effect pipeline works", async function () {
        let sideEffectResults: number[] = [];

        const effectPipeline = Pipeline.step((input: number) => {
            sideEffectResults.push(input);
            return input;
        }).step((input: number) => {
            sideEffectResults.push(input * 100);
            return input;
        });

        const pipe = Pipeline.step((input: number) => input * 3)
            .effect(effectPipeline)
            .step((input: number) => input + 50);

        const result = pipe.run(4);
        await vi.runAllTimersAsync();
        const final = await result;

        expect(sideEffectResults).toEqual([12, 1200]); // Effect pipeline ran with value 12
        expect(final.value).toBe(62); // Main pipeline continued: 12 + 50
    });

    test.sequential(
        "stateAt() on non-instantiated pipeline should throw",
        async function () {
            const pipe = Pipeline.step(function step1(input: number, step) {
                return input;
            })
                .step(function step2(input, step) {
                    return input + 5;
                })
                .step(function step3(input, step) {
                    return input.toString();
                });

            expect(() => (pipe as any).at("step1")).toThrow();
            expect(() => (pipe as any).at(0)).toThrow();
            expect(() => (pipe as any).at("nonexisting")).toThrow();
        },
    );

    test.sequential(
        "conditional-step returning illegal value or type should throw",
        async function () {
            const conditionalPipe1 = Pipeline.step(
                (input: number) => input * 2,
            );
            const conditionalPipe2 = Pipeline.step(
                (input: number) => input + 10,
            );

            const pipeNumber = Pipeline.step((input: number) => input)
                .conditional(
                    (input: number) => 5,
                    [conditionalPipe1, conditionalPipe2],
                ) // Returns 5, but only 2 pipelines (indices 0,1)
                .step((input: number) => input + 100);

            const pipeString = Pipeline.step((input: number) => input)
                .conditional(
                    (input: number) => "10" as unknown as boolean,
                    [conditionalPipe1, conditionalPipe2],
                ) // Returns 5, but only 2 pipelines (indices 0,1)
                .step((input: number) => input + 100);

            const result1 = pipeNumber.run(10);
            await vi.runAllTimersAsync();
            const final1 = await result1;

            const result2 = pipeString.run(10);
            await vi.runAllTimersAsync();
            const final2 = await result2;

            expect(final1.success).toBe(false);
            expect(final1.value).toContain(
                "Conditional pipeline index out of range: 5",
            );
            expect(final2.success).toBe(false);
            expect(final2.value).toContain(
                "Error: Conditional step function returned invalid type: string",
            );
        },
    );

    test.sequential("conditional pipeline fails throws", async function () {
        const failingConditionalPipe = Pipeline.step(
            (input: number) => input * 2,
        ).step((input: number) => {
            throw new Error("Conditional pipeline error");
        });

        const pipe = Pipeline.step((input: number) => input)
            .conditional(function condition(input: number) {return input > 10 }, failingConditionalPipe)
            .step((input: number) => input + 100);

        const result = pipe.run(15); // 15 > 10 = true, runs failing conditional
        await vi.runAllTimersAsync();
        const final = await result;

        expect(final.success).toBe(false);
        expect(final.value).toContain("Conditional pipeline failed:");
        expect(final.message).toBe("Failed at condition");
        expect(final.step).toBe("condition");
    });

    test.sequential(
        "effect step with effect pipeline that fails throws",
        async function () {
            const failingEffectPipeline = Pipeline.step(
                (input: number) => input * 2,
            ).step((input: number) => {
                throw new Error("Effect pipeline error");
            });

            const pipe = Pipeline.step((input: number) => input + 5)
                .effect(failingEffectPipeline)
                .step((input: number) => input * 10);

            const result = pipe.run(10);
            await vi.runAllTimersAsync();
            const final = await result;

            expect(final.success).toBe(false);
            expect(final.value).toContain("Effect pipeline failed:");
        },
    );

    test.sequential(
        "stateAt() on non-instantiated pipeline should throw",
        async function () {
            const pipe = Pipeline.step(function step1(input: number) {
                return input * 2;
            }).step(function step2(input: number) {
                return input + 5;
            });

            expect(() => (pipe as unknown as any).stateAt("step1")).toThrow(
                "Can only call stateAt() on a instantiated pipeline",
            );
            expect(() => (pipe as unknown as any).stateAt(0)).toThrow(
                "Can only call stateAt() on a instantiated pipeline",
            );
            expect(() =>
                (pipe as unknown as any).stateAt("nonexistent"),
            ).toThrow("Can only call stateAt() on a instantiated pipeline");
        },
    );
    test.sequential(
        "pipeline with inner conditional pipeline that throws in a step",
        async function () {
            const innerConditionalPipe = Pipeline.step((input: number) => {
                return input * 3;
            }).conditional(
                (input: number) => input > 50,
                Pipeline.step((input: number) => {
                    throw new Error("Inner conditional step error");
                }),
            );

            const mainPipe = Pipeline.step(
                (input: number) => input + 5,
            ).conditional((input: number) => input > 15, innerConditionalPipe);

            const result = mainPipe.run(20); // 25 > 15 = true, runs inner conditional
            // 25 * 3 = 75 > 50 = true, throws error
            await vi.runAllTimersAsync();
            const final = await result;

            expect(final.success).toBe(false);
            expect(final.message).toContain("Failed at step 2");
            expect(final.value).toContain("Inner conditional step error");
        },
    );
    test.sequential(
        "pipeline with inner conditional pipeline using parent pipeline step input",
        async function () {
            function step1(input: number) {
                return input + 10;
            };

            function step2(input: number) {
                return input * 2;
            };

            function step3(input: number) {
                // This step just uses the incoming input value
                return input + 100;
            };

            const result = await Pipeline.step(step1)
                .step(step2)
                .conditional(
                    (x) => true,
                    Pipeline.step(step3, { inputs: [step1] }),
                )
                .run(5);

            await vi.runAllTimersAsync();

            // Expected flow:
            // step1: 5 + 10 = 15
            // step2: 15 * 2 = 30
            // conditional: true, runs inner pipeline
            // step3: gets input from step1 (15) due to { inputs: ["step1"] }, so 15 + 100 = 115

            expect(result.success).toBe(true);
            expect(result.value).toBe(115);
        },
    );
});
