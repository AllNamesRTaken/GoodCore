/// <reference path="../base.d.ts" />

export class Pipeline<T = unknown, S = unknown> implements IPipeline<T, S> {
    add<R, C extends Partial<IPipelineStepConfig> | null>(fn: PipelineFn<PipelineFnInput<S, C>, R>, config?: C): IPipeline<T, R>;
    if<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>, config?: C): IPipeline<T, R>;
    if<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>[], config?: C): IPipeline<T, R>;
    call<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: (input: R, step: IPipelineStep) => any | Promise<any>, config?: C): IPipeline<T, R>;
    call<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: IPipeline<R, any>, config?: C): IPipeline<T, R>
    instantiate(): IInstantiatedPipeline;
    run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
}