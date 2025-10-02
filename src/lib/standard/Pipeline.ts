interface IPipelineStepConfig {
    retries: number
    retryStrategy: "immediate" | ((step: IPipelineStep) => number)
}
type PipelineFn<T, S> =(input: T, step: IPipelineStep<unknown, unknown>) => Promise<S> | S

type PipelineInput<T> = undefined extends T ? [input?: undefined] : [input: T]
interface IResult<T> {
  value:T | null;
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
  shouldRetry(): boolean;
  reset(): void;
}

interface IPipeline<T = unknown, S = unknown> {
  config: IPipelineStepConfig;
  steps: IPipelineStep[];
  pos: number;
  add<R>(fn: PipelineFn<S, R>): IPipeline<T, R>;
  run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
}

class Result<T> implements IResult<T> {
    public value:T | null = null;
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
        retryStrategy: "immediate"
    }
    fn: PipelineFn<T, S>
    config = {...PipelineStep.defaultConfig}
    run = 0
    input: unknown | null = null
    result: Result<S> | null = null

    constructor(fn: PipelineFn<T, S>, config: Partial<IPipelineStepConfig> | null = null) {
        this.fn = fn
        this.config = {...PipelineStep.defaultConfig, ...config}
    }
    public shouldRetry(): boolean {
        return this.run <= this.config.retries
    }
    public reset(): void {
        this.run = 0
        this.input = null
        this.result = null
    }
}

export class Pipeline<T = unknown, S = unknown> implements IPipeline<T, S> {
  static defaultConfig: IPipelineStepConfig = {
    retries: 2,
    retryStrategy: 'immediate',
  }
  config = { ...Pipeline.defaultConfig }
  steps: PipelineStep[] = []
  pos = 0
  public static add<U,R>(
    fn: PipelineFn<U, R>,
    config: Partial<IPipelineStepConfig> | null = null
  ): Pipeline<U, R> {
    const p = new Pipeline<U, R>()
    p.steps.push(new PipelineStep(fn, config))
    return p as unknown as Pipeline<U, R>
  }
  public static configure(config: IPipelineStepConfig): Pipeline<unknown, unknown> {
    const p = new Pipeline()
    p.config = config
    return p as unknown as Pipeline<unknown, unknown>
  }
  public add<R>(
    fn: PipelineFn<S, R>,
    config: Partial<IPipelineStepConfig> | null = null
  ): Pipeline<T, R> {
    this.steps.push(new PipelineStep(fn, config ?? this.config))
    return this as unknown as Pipeline<T, R>
  }
  private reset() {
    this.pos = 0
    this.steps.forEach((step) => step.reset())
  }
  public async run(...input: PipelineInput<T>): Promise<Success<S> | Failure> {
    this.reset()
    let value: unknown = input[0] as unknown
    while (this.pos < this.steps.length) {
      const result = await this.step(value)
      if (result.message == 'success') {
        value = result.value
        continue
      }
      if (await this.waitForRetry(this.steps[this.pos])) continue
      return new Failure(result.message, 'Failed at step ' + (this.pos + 1))
    }
    return this.steps[this.pos - 1].result!
  }
  private async waitForRetry(step: PipelineStep): Promise<boolean> {
    if (step.shouldRetry()) {
      const strategy = step.config.retryStrategy
      if (strategy instanceof Function) {
        const wait = strategy(step)
        if (wait > 0) {
          await new Promise((resolve) => setTimeout(resolve, wait))
        }
      }
      return true
    }
    return false
  }
  private async step(input: unknown): Promise<Success<unknown> | Failure> {
    const step = this.steps[this.pos]
    try {
      step.input = input
      step.run++
      const value = new Success(await step.fn(input, step))
      step.result = value
      this.pos++
      return value
    } catch (e) {
      const value = new Failure(null, e.toString())
      step.result = value
      return value
    }
  }
}

