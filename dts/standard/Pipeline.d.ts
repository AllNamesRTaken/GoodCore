/// <reference path="../base.d.ts" />

export class Pipeline<T = unknown, S = unknown> implements IPipeline<T, S> {
    static step<U, R>(fn: PipelineFn<U, R>, config?: Partial<IPipelineStepConfig> | null): IPipeline<U, R>;
    static configure(config: Partial<IPipelineStepConfig>): IPipeline<unknown, unknown>;
    static onError(
        handler:
            | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
            | IPipeline<unknown, any>,
    ): IPipeline<unknown, unknown>;
    step<R, C extends Partial<IPipelineStepConfig> | null>(fn: PipelineFn<PipelineFnInput<S, C>, R>, config?: C): IPipeline<T, R>;
    conditional<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>, config?: C): IPipeline<T, R>;
    conditional<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>[], config?: C): IPipeline<T, R>;
    effect<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: (input: R, step: IPipelineStep) => any | Promise<any>, config?: C): IPipeline<T, R>;
    effect<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: IPipeline<R, any>, config?: C): IPipeline<T, R>
    onError<R extends PipelineFnInput<S, unknown>>(
        handler:
            | ((failure: IFailure, step: IPipelineStep, pipeline: IInstantiatedPipeline<unknown, unknown>) => any | Promise<any>)
            | IPipeline<PipelineFnInput<unknown, unknown>, any>,
    ): IPipeline<T, R>;
    instantiate(): IInstantiatedPipeline<T, S>;
    run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
}