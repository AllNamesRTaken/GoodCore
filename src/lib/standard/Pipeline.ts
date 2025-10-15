import { I } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import type { Indexable } from "../../@types/index.js";

interface IPipelineStepConfig {
    retries: number;
    retryStrategy: "immediate" | ((step: IPipelineStep) => number);
    inputs?:
        | [PipelineFn<unknown, unknown>]
        | PipelineFn<unknown, unknown>[]
        | string[];
    timeout: number;
}
type PipelineFn<T, S> = (
    input: T,
    step: IPipelineStep<unknown, unknown>,
) => Promise<S> | S;

type PipelineInput<T> = undefined extends T ? [input?: any] : [input: T];
type PipelineFnDependencyOutput<C> = C extends {
    inputs: [PipelineFn<unknown, infer R>];
}
    ? R
    : unknown[];
type PipelineFnInput<S, C> = C extends {
    inputs: PipelineFn<unknown, unknown>[];
}
    ? PipelineFnDependencyOutput<C>
    : C extends { inputs: string[] }
      ? unknown[]
      : S;
interface IResult<T> {
    value: T | null;
    success: boolean;
    message: string;
}
interface ISuccess<T> extends IResult<T> {}
interface IFailure extends IResult<string | null> {}

interface IPipelineStep<T = any, S = any> {
    fn: PipelineFn<T, S>;
    config: IPipelineStepConfig;
    run: number;
    input: unknown | null;
    result: IResult<S> | null;
    durations: number[];
    duration: number;
    shouldRetry(): boolean;
    reset(): void;
}

interface IConditionalStep<T> extends IPipelineStep<T, T> {
    condition: (
        input: T,
        step: IPipelineStep,
    ) => number | boolean | Promise<number | boolean>;
    pipelines: IPipeline<T, T>[];
}
interface IEffectStep<T, S = any> extends IPipelineStep<T, S> {
    effect:
        | ((input: T, step: IPipelineStep) => S | Promise<S>)
        | IPipeline<T, S>;
}

interface IPipeline<T = unknown, S = unknown> {
    step<R, C extends Partial<IPipelineStepConfig> | null>(
        fn: PipelineFn<PipelineFnInput<S, C>, R>,
        config?: C,
    ): IPipeline<T, R>;
    conditional<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<T, boolean | number>,
        conditionals: IPipeline<R, R>,
        config?: C,
    ): IPipeline<T, R>;
    conditional<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<T, boolean | number>,
        conditionals: IPipeline<R, R>[],
        config?: C,
    ): IPipeline<T, R>;
    effect<
        R extends PipelineFnInput<S, C>,
        C extends Partial<IPipelineStepConfig> | null,
    >(
        effect: (input: R, step: IPipelineStep) => any | Promise<any>,
        config?: C,
    ): IPipeline<T, R>;
    effect<
        R extends PipelineFnInput<S, C>,
        C extends Partial<IPipelineStepConfig> | null,
    >(
        effect: IPipeline<R, any>,
        config?: C,
    ): IPipeline<T, R>;
    instantiate(parent?: IInstantiatedPipeline<T, S> | null): IInstantiatedPipeline<T, S>;
    run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
}
interface IInstantiatedPipeline<T = unknown, S = unknown>
    extends IPipeline<T, S> {
    config: IPipelineStepConfig;
    steps: IPipelineStep[];
    pos: number;
    step<R, C extends Partial<IPipelineStepConfig> | null>(
        fn: PipelineFn<PipelineFnInput<S, C>, R>,
        config?: C,
    ): IPipeline<T, R>;
    conditional<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<T, boolean | number>,
        conditionals: IPipeline<R, R>,
        config?: C,
    ): IPipeline<T, R>;
    conditional<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<T, boolean | number>,
        conditionals: IPipeline<R, R>[],
        config?: C,
    ): IPipeline<T, R>;
    effect<
        R extends PipelineFnInput<S, C>,
        C extends Partial<IPipelineStepConfig> | null,
    >(
        effect: (input: R, step: IPipelineStep) => any | Promise<any>,
        config?: C,
    ): IPipeline<T, R>;
    effect<
        R extends PipelineFnInput<S, C>,
        C extends Partial<IPipelineStepConfig> | null,
    >(
        effect: IPipeline<R, any>,
        config?: C,
    ): IPipeline<T, R>;
    instantiate(): this;
    run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
    stateAt(
        name: PipelineFn<unknown, unknown> | string | number,
    ): ISuccess<unknown> | IFailure | null | undefined;
}

class Result<T> implements IResult<T> {
    public value: T | null = null;
    public success = true;
    public message: string = "";

    constructor(value: T | null = null, message = "") {
        this.value = value;
        this.message = message;
        this.success = !(message !== "" && message !== "success");
    }
}

class Success<T> extends Result<T> implements ISuccess<T> {
    constructor(value: T | null = null) {
        super(value, "success");
        this.success = true;
    }
}

class Failure extends Result<string | null> implements IFailure {
    constructor(value: string | null = null, message = "failed") {
        super(value, message);
        this.success = false;
    }
}

class PipelineStep<T = any, S = any> implements IPipelineStep<T, S> {
    static defaultConfig: IPipelineStepConfig = {
        retries: 2,
        retryStrategy: "immediate",
        timeout: 0,
    };
    fn: PipelineFn<T, S>;
    config = { ...PipelineStep.defaultConfig };
    run = 0;
    input: unknown | null = null;
    result: Result<S> | null = null;
    durations: number[] = [];
    duration: number = 0;

    constructor(
        fn: PipelineFn<T, S>,
        config: Partial<IPipelineStepConfig> | null = null,
    ) {
        this.fn = fn;
        this.config = {
            ...PipelineStep.defaultConfig,
            ...config,
            inputs: config?.inputs ? [...config.inputs] : undefined,
        };
    }
    public shouldRetry(): boolean {
        return !(this instanceof ConditionalStep) &&  this.run <= this.config.retries;
    }
    public reset(): void {
        this.run = 0;
        this.input = null;
        this.result = null;
        this.durations.length = 0;
        this.duration = 0;
    }
}

class ConditionalStep<T>
    extends PipelineStep<T, T>
    implements IConditionalStep<T>
{
    condition: (
        input: T,
        step: IPipelineStep,
    ) => number | boolean | Promise<number | boolean>;
    pipelines: IPipeline<T, T>[];
    constructor(
        fn: PipelineFn<T, boolean | number>,
        config: Partial<IPipelineStepConfig> | null = null,
    ) {
        // dummy super call, we won't use fn or config here
        super((...args: any[]) => this.result?.value!, config);
        this.condition = fn;
    }
}

class EffectStep<T> extends PipelineStep<T, T> implements IEffectStep<T> {
    effect:
        | ((input: T, step: IPipelineStep) => any | Promise<any>)
        | IPipeline<T, any>;
    constructor(
        effect:
            | ((input: T, step: IPipelineStep) => any | Promise<any>)
            | IPipeline<T, any>,
        config: Partial<IPipelineStepConfig> | null = null,
    ) {
        super((...args: any[]) => this.result?.value!, config);
        this.effect = effect;
    }
}

export class Pipeline<T = unknown, S = unknown> implements IPipeline<T, S> {
    static defaultConfig: IPipelineStepConfig = {
        retries: 2,
        retryStrategy: "immediate",
        timeout: 0,
        inputs: undefined,
    };
    private parent: IInstantiatedPipeline | null = null;
    private isClone = false;
    config = { ...Pipeline.defaultConfig };
    private steps: PipelineStep[] = [];
    stepsLookup: Indexable<number> = {};
    pos = 0;
    public static step<U, R>(
        fn: PipelineFn<U, R>,
        config: Partial<IPipelineStepConfig> | null = null,
    ): IPipeline<U, R> {
        const p = new Pipeline<U, R>();
        p.steps.push(new PipelineStep(fn, config));
        if (fn.name) {
            p.stepsLookup[fn.name] = p.steps.length - 1;
        }
        return p as unknown as IPipeline<U, R>;
    }
    public static configure(
        config: Partial<IPipelineStepConfig>,
    ): IPipeline<unknown, unknown> {
        const p = new Pipeline();
        p.config = Pipeline.mergeConfig(p.config, config);
        return p as unknown as IPipeline<unknown, unknown>;
    }
    public static mergeConfig<T extends IPipelineStepConfig | Partial<IPipelineStepConfig>>(
        configA: T,
        configB: Partial<IPipelineStepConfig>,
    ): T {
        return {
            ...configA,
            ...configB,
            inputs: configB.inputs
                ? [...configB.inputs]
                : configA.inputs
                  ? [...configA.inputs]
                  : undefined,
        };
    }

    public step<R, C extends Partial<IPipelineStepConfig> | null>(
        fn: PipelineFn<PipelineFnInput<S, C>, R>,
        config?: C,
    ): IPipeline<T, R> {
        this.steps.push(new PipelineStep(fn, (config as C) ?? this.config));
        if (fn.name) {
            this.stepsLookup[fn.name] = this.steps.length - 1;
        }
        return this as unknown as Pipeline<T, R>;
    }

    public conditional<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<R, boolean | number>,
        conditionals: IPipeline<R, R> | IPipeline<R, R>[],
        config?: C,
    ): IPipeline<T, R> {
        const step = new ConditionalStep(fn, (config as C) ?? this.config);
        step.pipelines = Array.isArray(conditionals)
            ? conditionals
            : [conditionals];
        this.steps.push(step);
        return this as unknown as Pipeline<T, R>;
    }

    public effect<
        R extends PipelineFnInput<S, C>,
        C extends Partial<IPipelineStepConfig> | null,
    >(
        effect:
            | ((input: R, step: IPipelineStep) => any | Promise<any>)
            | IPipeline<R, any>,
        config?: C,
    ): IPipeline<T, R> {
        const step = new EffectStep(() => {}, (config as C) ?? this.config);
        step.effect = effect;
        this.steps.push(step);
        return this as unknown as Pipeline<T, R>;
    }

    public stateAt(
        name: PipelineFn<unknown, unknown> | string | number
    ): Success<unknown> | Failure | null | undefined {
        if (!this.isClone) {
            throw new Error("Can only call stateAt() on a instantiated pipeline");
        }
        if (typeof name === "number") {
            return this.steps[name]?.result;
        }
        if (name instanceof Function) {
            name = name.name;
        }
        const index = this.stepsLookup[name];
        if (index !== undefined) {
            return this.steps[index]?.result;
        }
        return this.parent ? this.parent.stateAt(name) : undefined;
    }
    private reset() {
        this.pos = 0;
        this.steps.forEach((step) => step.reset());
    }
    public instantiate(parent: IInstantiatedPipeline<T, S> | null = null): IInstantiatedPipeline<T, S> {
        const clone = new Pipeline<T, S>() as this;
        clone.config = Pipeline.mergeConfig(this.config, {});
        clone.steps = this.steps.map((step) => {
            switch (step.constructor) {
                case ConditionalStep: {
                    const newStep = new ConditionalStep(
                        (step as ConditionalStep<unknown>).condition,
                        Pipeline.mergeConfig(step.config, {}),
                    );
                    newStep.pipelines = (
                        step as ConditionalStep<unknown>
                    ).pipelines.map((p) => p.instantiate(clone as unknown as IInstantiatedPipeline<T, S>));
                    return newStep;
                }
                case EffectStep: {
                    const orgStep = step as EffectStep<unknown>;
                    const newStep = new EffectStep(
                        orgStep.effect,
                        Pipeline.mergeConfig(step.config, {}),
                    );
                    newStep.effect =
                        orgStep.effect instanceof Pipeline
                            ? (
                                  orgStep.effect as Pipeline<unknown, unknown>
                              ).instantiate()
                            : orgStep.effect;
                    return newStep;
                }
                default:
                    return new PipelineStep(
                        step.fn,
                        Pipeline.mergeConfig(step.config, {}),
                    );
            }
        });
        clone.stepsLookup = { ...this.stepsLookup };
        clone.isClone = true;
        clone.parent = parent;
        return clone as unknown as IInstantiatedPipeline<T, S>;
    }
    public async run(
        ...input: PipelineInput<T>
    ): Promise<Success<S> | Failure> {
        const clone = (!this.isClone ? this.instantiate() : this) as Pipeline<
            T,
            S
        >;
        const result = clone.innerRun(...input);
        return result;
    }
    public async innerRun(
        ...input: PipelineInput<T>
    ): Promise<Success<S> | Failure> {
        this.reset();
        let value: unknown = input[0] as unknown;
        while (this.pos < this.steps.length) {
            const result = await this.runStep(value);
            if (result.message == "success") {
                value = result.value;
                continue;
            }
            if (await this.waitForRetry(this.steps[this.pos])) continue;
            return new Failure(
                result.message,
                "Failed at step " + (this.pos + 1),
            );
        }
        return this.steps[this.pos - 1].result!;
    }
    private async waitForRetry(step: PipelineStep): Promise<boolean> {
        if (step.shouldRetry()) {
            const strategy = step.config.retryStrategy;
            if (strategy instanceof Function) {
                const wait = strategy(step);
                if (wait > 0) {
                    await new Promise((resolve) => setTimeout(resolve, wait));
                }
            }
            return true;
        }
        return false;
    }
    private async runStep(input: unknown): Promise<Success<unknown> | Failure> {
        const step = this.steps[this.pos];
        const start = Date.now();
        try {
            step.run++;
            input = this.selectInput(step, input);
            step.input = input;
            var fnResult = await this.execStepWithDelay(step, step.input);
            const value = new Success(fnResult);
            step.result = value;
            this.pos++;
            step.duration = Date.now() - start;
            step.durations.push(step.duration);
            return value;
        } catch (e) {
            const value = new Failure(null, e.toString());
            step.result = value;
            step.duration = Date.now() - start;
            step.durations.push(step.duration);
            return value;
        }
    }

    private selectInput(step: PipelineStep<any, any>, input: unknown) {
        if (step.config.inputs?.length) {
            const depOutputs = step.config.inputs.map(
                (dep) => this.stateAt(dep)?.value,
            );
            input = depOutputs.length === 1 ? depOutputs[0] : depOutputs;
        }
        return input;
    }

    private execStepWithDelay(step: PipelineStep<any, any>, input: unknown) {
        return new Promise(async (resolve, reject) => {
            try {
                let timer = null;
                if (step.config.timeout) {
                    timer = setTimeout(() => {
                        reject("Timeout");
                    }, step.config.timeout);
                }
                let result: unknown = await this.execStep(step, input);
                if (timer) {
                    clearTimeout(timer);
                }
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }

    private async execStep(step: PipelineStep<any, any>, input: unknown) {
        let result: unknown;
        if (step instanceof ConditionalStep) {
            result = await this.execConditionalStep(step, input, result);
        } else if (step instanceof EffectStep) {
            result = await this.execEffectStep(step, input, result);
        } else {
            result = await step.fn(input, step);
        }
        return result;
    }

    private async execEffectStep(
        step: EffectStep<any>,
        input: unknown,
        result: unknown,
    ) {
        if (step.effect instanceof Pipeline) {
            const pipelineResult = await step.effect.run(input as any);
            if (!pipelineResult.success) {
                throw new Error(
                    "Effect pipeline failed: " + pipelineResult.message,
                );
            }
        } else if (step.effect instanceof Function) {
            await step.effect(input as any, step);
        }
        result = input;
        return result;
    }

    private async execConditionalStep(
        step: ConditionalStep<any>,
        input: unknown,
        result: unknown,
    ) {
        const conditionResult = await step.condition(input as any, step);
        if (conditionResult === true || (conditionResult === false && step.pipelines.length > 1)) {
            const index = conditionResult ? 0 : 1;
            const pipelineResult = await this.RunConditionalPipeline(step, index, input);
            result = pipelineResult.value;
        } else if ("number" === typeof conditionResult) {
            const index = Math.floor(conditionResult);
            if (index >= step.pipelines.length || index < 0) {
                throw new Error(
                    "Conditional pipeline index out of range: " + index,
                );
            }
            const pipelineResult = await this.RunConditionalPipeline(step, index, input);
            result = pipelineResult.value;
        } else if ("boolean" !== typeof conditionResult) {
            throw new Error(
                "Conditional step function returned invalid type: " +
                    typeof conditionResult,
            );
        } else {
            result = input;
        }
        return result;
    }

    private async RunConditionalPipeline(step: ConditionalStep<any>, index: number, input: unknown) {
        const pipelineResult = await step.pipelines[index].run(input as any);
        if (!pipelineResult.success) {
            throw new Error(
                "Conditional pipeline failed: " + pipelineResult.message + " with: " + pipelineResult.value
            );
        }
        return pipelineResult;
    }
}
