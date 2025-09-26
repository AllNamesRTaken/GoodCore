interface IPipelineStepConfig {
    retries: number
    retryStrategy: "immediate" | ((step: IPipelineStep) => number)
}
type PipelineFn<T, S> =(input: T, step: IPipelineStep<unknown, unknown>) => Promise<S> | S

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
  input: T | null;
  result: IResult<S> | null;
  shouldRetry(): boolean;
  reset(): void;
}

interface IPipeline<S = any> {
  config: IPipelineStepConfig;
  steps: IPipelineStep[];
  pos: number;
  add<R>(fn: PipelineFn<S, R>): IPipeline<R>;
  run(): Promise<ISuccess<S> | IFailure>;
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
    input: T | null = null
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

export class Pipeline<S = any> implements IPipeline<S> {
  static defaultConfig: IPipelineStepConfig = {
    retries: 2,
    retryStrategy: 'immediate',
  }
  config = { ...Pipeline.defaultConfig }
  steps: PipelineStep[] = []
  pos = 0
  public static add<R>(
    fn: PipelineFn<unknown, R>,
    config: Partial<IPipelineStepConfig> | null = null
  ): Pipeline<R> {
    const p = new Pipeline<R>()
    p.steps.push(new PipelineStep(fn, config))
    return p as unknown as Pipeline<R>
  }
  public static configure(config: IPipelineStepConfig): Pipeline<unknown> {
    const p = new Pipeline()
    p.config = config
    return p as unknown as Pipeline<unknown>
  }
  public add<R>(
    fn: PipelineFn<S, R>,
    config: Partial<IPipelineStepConfig> | null = null
  ): Pipeline<R> {
    this.steps.push(new PipelineStep(fn, config ?? this.config))
    return this as unknown as Pipeline<R>
  }
  private reset() {
    this.pos = 0
    this.steps.forEach((step) => step.reset())
  }
  public async run(): Promise<Success<S> | Failure> {
    this.reset()
    let value: unknown = null
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

