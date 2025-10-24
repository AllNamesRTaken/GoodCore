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
    step: string | number | null;
    error: Error | null;
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
interface IValidationStep<T> extends IPipelineStep<T, T> {
    validation: (
        input: T,
        step: IPipelineStep,
    ) => boolean | Promise<boolean>;
    retryStep: PipelineFn<unknown, unknown>;
}
interface IEffectStep<T, S = any> extends IPipelineStep<T, S> {
    effect:
        | ((input: T, step: IPipelineStep) => S | Promise<S>)
        | IPipeline<T, S>;
}
interface IOnErrorStep<T> extends IPipelineStep<T, T> {
    handler: 
        | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<T, T>) => any | Promise<any>)
        | IPipeline<T, any>;
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
    validation<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<R, boolean>,
        retryStep: PipelineFn<unknown, unknown>,
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
    onError<R extends PipelineFnInput<S, unknown>>(
        handler:
            | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
            | IPipeline<PipelineFnInput<unknown, unknown>, any>,
    ): IPipeline<T, R>;
    instantiate(parent?: IInstantiatedPipeline<T, S> | null): IInstantiatedPipeline<T, S>;
    run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
}
interface IInstantiatedPipeline<T = unknown, S = unknown> extends IPipeline<T, S> {
    config: IPipelineStepConfig;
    steps: IPipelineStep[];
    pos: number;
    errorHandler: 
        | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<T, T>) => any | Promise<any>)
        | IPipeline<T, any>
        | null;
    
    instantiate(): this;
    stateAt(
        name: PipelineFn<unknown, unknown> | string | number,
    ): ISuccess<unknown> | IFailure | null | undefined;
}

class Result<T> implements IResult<T> {
    public value: T | null = null;
    public success = true;
    public message: string = "";
    public step: string | number | null = null;
    public error: Error | null = null;

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
    constructor(value: string | null = null, message = "failed", step: string | number | null = null) {
        super(value, message);
        this.success = false;
        this.step = step;
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
    public getName(): string {
        return this.fn.name || "";
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
    public getName(): string {
        return this.condition.name || "";
    }
}

class ValidationStep<T>
    extends PipelineStep<T, T>
    implements IValidationStep<T>
{
    validation: (
        input: T,
        step: IPipelineStep,
    ) => boolean | Promise<boolean>;
    retryStep: PipelineFn<unknown, unknown>;
    constructor(
        validation: PipelineFn<T, boolean>,
        config: Partial<IPipelineStepConfig> | null = null,
    ) {
        // dummy super call, we won't use fn or config here
        super((...args: any[]) => this.result?.value!, config);
        this.validation = validation;
    }
    public getName(): string {
        return this.validation.name || "";
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
    public getName(): string {
        return (this.effect as Function).name || "";
    }
}

class OnErrorStep<T> extends PipelineStep<T, T> implements IOnErrorStep<T> {
    handler:
        | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
        | IPipeline<T, any>;
    constructor(
        handler:
            | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
            | IPipeline<T, any>,
    ) {
        super((...args: any[]) => this.result?.value!, {});
        this.handler = handler;
    }
    public getName(): string {
        return (this.handler as Function).name || "";
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
    errorHandler: 
        | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<T, T>) => any | Promise<any>)
        | IPipeline<T, any>
        | null = null;

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
    public static onError(
        handler:
            | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
            | IPipeline<unknown, any>,
    ): IPipeline<unknown, unknown> {
        const p = new Pipeline();
        const step = new OnErrorStep(handler);
        step.handler = handler;
        p.PushStep(step, handler);
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
        const step = new PipelineStep(fn, (config as C) ?? this.config);
        this.PushStep(step, fn);
        return this as unknown as IPipeline<T, R>;
    }

    private PushStep(step: PipelineStep<any, any>, fn: Function | IPipeline<any, any>) {
        this.steps.push(step);
        if (fn instanceof Function && fn.name) {
            this.stepsLookup[fn.name] = this.steps.length - 1;
        }
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
        this.PushStep(step, fn);
        step.pipelines = Array.isArray(conditionals)
            ? conditionals
            : [conditionals];
        return this as unknown as IPipeline<T, R>;
    }


    public validation<
        C extends Partial<IPipelineStepConfig> | null,
        R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>,
    >(
        fn: PipelineFn<R, boolean>,
        retryStep: PipelineFn<unknown, unknown>,
        config?: C,
    ): IPipeline<T, R> {
        const step = new ValidationStep(fn, (config as C) ?? this.config);
        this.PushStep(step, fn);
        step.retryStep = retryStep;
        return this as unknown as IPipeline<T, R>;
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
        this.PushStep(step, effect);
        return this as unknown as IPipeline<T, R>;
    }

    public onError<R extends PipelineFnInput<S, unknown>>(
        handler:
            | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
            | IPipeline<PipelineFnInput<unknown, unknown>, any>,
    ): IPipeline<T, R> {
        const step = new OnErrorStep(handler);
        step.handler = handler;
        this.PushStep(step, handler);
        return this as unknown as IPipeline<T, R>;
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
        return this.parent ? this.parent.stateAt(name) as Success<unknown> | Failure | null | undefined : undefined;
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
                case ValidationStep: {
                    const newStep = new ValidationStep(
                        (step as ValidationStep<unknown>).validation,
                        Pipeline.mergeConfig(step.config, {}),
                    );
                    newStep.retryStep = (
                        step as ValidationStep<unknown>
                    ).retryStep;
                    return newStep;
                }
                case EffectStep: {
                    const orgStep = step as EffectStep<unknown>;
                    const newStep = new EffectStep(
                        orgStep.effect,
                        Pipeline.mergeConfig(step.config, {}),
                    );
                    if (orgStep.effect instanceof Pipeline) {
                        newStep.effect = orgStep.effect.instantiate();
                    }
                    return newStep;
                }
                case OnErrorStep: {
                    const orgStep = step as OnErrorStep<unknown>;
                    const newStep = new OnErrorStep(
                        orgStep.handler,
                    );
                    if(orgStep.handler instanceof Pipeline) {
                        newStep.handler = orgStep.handler.instantiate();
                    }
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
        if (this.errorHandler instanceof Pipeline) {
            clone.errorHandler = this.errorHandler.instantiate(
                clone as unknown as IInstantiatedPipeline<T, S>,
            )
        } else {
            clone.errorHandler = this.errorHandler;
        }
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
        while (this.pos < this.steps.length) {
            const step = this.steps[this.pos];
            const inputValue = this.pos 
                ? this.steps[this.pos - 1].result?.value 
                : input[0];
            const result = await this.runStep(step, inputValue);
            if (result.success) {
                this.pos++;
                continue;
            }
            if (await this.waitForRetry(step)) continue;
            
            if (this.errorHandler) {
                const handler = (this as unknown as IInstantiatedPipeline<unknown, unknown>).errorHandler;
                if (handler instanceof Function) {
                    try {
                        await handler(result as IFailure, step, this as unknown as IInstantiatedPipeline<unknown, unknown>);
                    } catch (e) {
                        console.error("Error in onError handler:", e);
                    }
                }
                else if (handler instanceof Pipeline) {
                    const handlerResult = await handler.run(result as IFailure);
                    if (!handlerResult.success) {
                        console.error("Error in onError pipeline handler:", handlerResult.error);
                    }
                }
            }
            return result as Failure;
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
    private async runStep(step: PipelineStep<any, any>, input: unknown): Promise<Success<unknown> | Failure> {
        const start = Date.now();
        try {
            step.run++;
            input = this.selectInput(step, input);
            step.input = input;
            var fnResult = await this.execStepWithDelay(step, step.input);
            const value = new Success(fnResult);
            step.result = value;
            step.duration = Date.now() - start;
            step.durations.push(step.duration);
            return value;
        } catch (e) {
            const message = "Failed at " + (step.getName() || ("step " + (this.pos + 1)))
            const result = new Failure(e.toString(), message, step.fn.name || this.pos + 1)
            result.step = step.getName() || this.pos + 1;
            result.error = e;
            step.result = result;
            step.duration = Date.now() - start;
            step.durations.push(step.duration);
            if (e instanceof ValidationError) {
                const retryPos = this.stepsLookup[e.retryStep];
                if (retryPos !== undefined && retryPos < this.pos) {
                    this.pos = retryPos;
                }
                if (retryPos === undefined) {
                    result.message = `Retry step not found: ${e.retryStep}`;
                } else if (retryPos >= this.pos) {
                    result.message = `Retry step after validation: ${e.retryStep}`;
                }
            }
            return result;
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
        if (step instanceof ValidationStep) {
            result = await this.execValidationStep(step, input);
        } else if (step instanceof ConditionalStep) {
            result = await this.execConditionalStep(step, input);
        } else if (step instanceof EffectStep) {
            result = await this.execEffectStep(step, input);
        } else if (step instanceof OnErrorStep) {
            result = input;
            this.errorHandler = step.handler;
        } else {
            result = await step.fn(input, step);
        }
        return result;
    }

    private async execEffectStep(
        step: EffectStep<any>,
        input: unknown,
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
        return input;
    }

    private async execConditionalStep(
        step: ConditionalStep<any>,
        input: unknown,
    ) {
        const conditionResult = await step.condition(input as any, step);
        if (conditionResult === true || (conditionResult === false && step.pipelines.length > 1)) {
            const index = conditionResult ? 0 : 1;
            const pipelineResult = await this.RunConditionalPipeline(step, index, input);
            return pipelineResult.value;
        } else if ("number" === typeof conditionResult) {
            const index = Math.floor(conditionResult);
            if (index >= step.pipelines.length || index < 0) {
                throw new Error(
                    "Conditional pipeline index out of range: " + index,
                );
            }
            const pipelineResult = await this.RunConditionalPipeline(step, index, input);
            return pipelineResult.value;
        } else if ("boolean" !== typeof conditionResult) {
            throw new Error(
                "Conditional step function returned invalid type: " +
                    typeof conditionResult,
            );
        } else {
            return input;
        }
    }

    private async execValidationStep(
        step: ValidationStep<any>,
        input: unknown,
    ) {
        const validationResult = await step.validation(input as any, step);
        if (!validationResult) {
            throw new ValidationError("Validation failed", step.retryStep.name);
        }
        return input;
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

class ValidationError extends Error {
    public retryStep: string
    constructor(message: string, retryStep: string) {
        super(message);
        this.name = "ValidationError";
        this.retryStep = retryStep;
    }
}