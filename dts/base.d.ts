type Constructor<T> = new (...args: any[]) => T;
type ICtor<T> = { new(...args: any[]): T; };
type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type PickKeysOfType<T, KT> = ({ [P in keyof T]: T[P] extends KT ? P : never })[keyof T];
type PickType<T, KT> = Pick<T, PickKeysOfType<T, KT>>;
type PickFunctions<T> = PickType<T, Function>;
type ExcludeType<T, KT> = Omit<T, PickKeysOfType<T, KT>>;
type ExcludeFunctions<T> = ExcludeType<T, Function>;

interface Indexable<T> {
	[key: string | symbol]: T;
}
interface IObject extends Indexable<any> {}
interface IInstance<T> extends IObject {
	constructor?: ICtor<T>;
}
type ArgTypes<T> = T extends (...a:infer A) => unknown ? A : [];
type ResultType<T> = T extends (...a: unknown[]) => infer S ? S : never;
interface IPool<T extends IPoolable> {
	get(): T;
	release(obj: T): void;
}
interface IPoolable {
	__pool__: IPool<IPoolable>;
	release(): void;
	initPool(pool: IPool<IPoolable>): void;
}
interface ICloneable {
	clone(): this;
}
interface IInitable {
	init(obj: Partial<ExcludeFunctions<this>>, mapping?: any): this;
}
interface ISerializable<T> {
	toJSON(): any;
	serialize(): T;
}
interface IDeserializable<T> {
	deserialize(data: any, ...types: Array<Constructor<any>>): T;
}
interface IBasicList<T> {
	values: T[];
	get(pos: number): T | undefined;
	count: number;
	clear(): IBasicList<T>;
	add(v: T): IBasicList<T>;
	pop(): T | undefined;
	shift(): T | undefined;
	copy(src: IBasicList<T> | T[]): IBasicList<T>;
	fill(size: number, populator: ((i: number) => T) | T): IBasicList<T>;
	clone(): this;
	remove(v: T): IBasicList<T>;
	removeFirst(fn: (el: T) => boolean): T | undefined;
	removeAt(n: number): T | undefined;
	forEach(fn: (el: T, i?: number) => any, startIndex?: number): IBasicList<T>;
	forSome(filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): IBasicList<T>;
	until(fnOrTest: (el: T, i: number) => boolean, startIndex?: number): IBasicList<T>;
	until(fnOrTest: (el: T, i: number) => boolean, fn: (el: T, i: number, startIndex?: number) => void): IBasicList<T>;
	reverseForEach(fn: (el: T, i: number) => any): IBasicList<T>;
	reverseUntil(fnOrTest: (el: T, i: number) => boolean, fn?: (el: T, i: number) => void): IBasicList<T>;
	first(fn?: (el: T) => boolean): T | undefined;
	find(fn: (el: T) => boolean): T | undefined;
	last(): T | undefined;
	indexOf(v: T | ((el: T) => boolean)): number;
	contains(v: T | ((el: T) => boolean)): boolean;
	some(fn: (el: T) => boolean): boolean;
	all(fn: (el: T) => boolean): boolean;
	select(fn: (el: T) => boolean): IBasicList<T>;
	selectInto(src: IBasicList<T> | T[], fn: (el: T) => boolean): IBasicList<T>;
	map<S>(fn: (el: T, i?: number) => S): IBasicList<S>;
	mapInto(src: IBasicList<any> | any[], fn: (el: any, i?: number) => any): IBasicList<T>;
	reduce(fn: (acc: any, cur: T) => any, start: any): any;
	reverseReduce(fn: (acc: any, cur: T) => any, start: any): any;
	equals(b: IBasicList<T>): boolean;
	same(b: IBasicList<T>): boolean;
	intersect(b: IBasicList<T>): IBasicList<T>;
	union(b: IBasicList<T>): IBasicList<T>;
}
interface IList<T> extends IBasicList<T> {
	getByIndex(key: number | string): T | undefined;
	set(pos: number, value: T): IList<T>;
	push(v: T): number;
	splice(pos?: number, remove?: number, insert?: T[] | IList<T>): IList<T>;
	concat(v: T[] | IList<T>): IList<T>;
	append(v: T[] | IList<T>): void;
	shallowCopy(src: IList<T> | T[]): IList<T>;
	reverse(): IList<T>;
	orderBy(fn: (a: T, b: T) => number): IList<T>;
	subtract(b: IList<T>): IList<T>;
	zip<U, V>(list: IList<U>, fn: (t: T, u: U) => V): IList<V>;
	unzip<U, V>(fn: (el: T) => [U, V]): [IList<U>, IList<V>];
	flatten<U>(maxDepth?: number): IList<U>;
}
interface ITreeNode<T> {
	id: string;
	parent: ITreeNode<T> | null;
	children: Array<ITreeNode<T>> | null;
	data: T | null;
}
type TreeEvent = "change";
interface IVec2 {
	x: number;
	y: number;
}
interface IRange2 {
	pos: IVec2;
	size: IVec2;
}
interface IRect {
	start: IVec2;
	stop: IVec2;
	endInclusive?: boolean;
}
interface IDebounceOptions {
	leading: boolean;
}
type DebounceResultType<T, U> = T extends (...a: unknown[]) => PromiseLike<infer S> ? 
	PromiseLike<S> : 
	T extends (...a: unknown[]) => infer R ? 
		U extends { leading: true } ?
			R : 
			PromiseLike<R>
		: never;
interface IDebouncedFunction<T, U> {
	(...args: ArgTypes<T>): DebounceResultType<T, U>;
	resetTimer?(): void;
}
interface IThrottleOptions {
	leading: boolean;
	trailing: boolean;
}
interface IThrottledFunction<T> {
	(...args: ArgTypes<T>): ResultType<T>;
}

type EventMap = Indexable<(...args: any) => unknown>;

type InnerPromiseType<T> = T extends Promise<infer U> ? U : T

interface IEventBus<T extends EventMap> {
  on(key: keyof T, handler: T[keyof T], id?: string): () => void
  off(key: keyof T, handler: T[keyof T], id?: string): void
  emit(key: keyof T, ...payload: Parameters<T[keyof T]>): void
  once(key: keyof T, handler: T[keyof T]): void
  rpc(
    key: keyof T,
    ...payload: Parameters<T[keyof T]>
  ): Promise<InnerPromiseType<ResultType<T[keyof T]>>>
  rpcMany(
    key: keyof T,
    ...payload: Parameters<T[keyof T]>
  ): Promise<InnerPromiseType<ResultType<T[keyof T]>>[]>
}

interface IPipelineStepConfig {
    retries: number
    retryStrategy: "immediate" | ((step: IPipelineStep) => number)
    inputs?: [PipelineFn<unknown, unknown>] | PipelineFn<unknown, unknown>[] | string[]
    timeout: number
}
type PipelineFn<T, S> = (input: T, step: IPipelineStep<unknown, unknown>) => Promise<S> | S

type PipelineInput<T> = undefined extends T ? [input?: any] : [input: T]
type PipelineFnDependencyOutput<C> = C extends {inputs: [PipelineFn<unknown, infer R>]} ? R : unknown[]
type PipelineFnInput<S, C> = C extends {inputs: PipelineFn<unknown, unknown>[]} ? PipelineFnDependencyOutput<C> : C extends {inputs: string[]} ? unknown[] : S
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
  durations: number[];
  duration: number;
  shouldRetry(): boolean;
  reset(): void;
}

interface IConditionalStep<T> extends IPipelineStep<T, T> {
  condition: (input: T, step: IPipelineStep) => number | boolean | Promise<number | boolean>;
  pipelines: IPipeline<T, T>[];
}
interface IEffectStep<T, S = any> extends IPipelineStep<T, S> {
  effect: ((input: T, step: IPipelineStep) => S | Promise<S>) | IPipeline<T, S>;
}

interface IPipeline<T = unknown, S = unknown> {
  add<R, C extends Partial<IPipelineStepConfig> | null>(fn: PipelineFn<PipelineFnInput<S, C>, R>, config?: C): IPipeline<T, R>;
  if<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>, config?: C): IPipeline<T, R>;
  if<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>[], config?: C): IPipeline<T, R>;
  call<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: (input: R, step: IPipelineStep) => any | Promise<any>, config?: C): IPipeline<T, R>;
  call<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: IPipeline<R, any>, config?: C): IPipeline<T, R>
  instantiate(): IInstantiatedPipeline;
  run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
}
interface IInstantiatedPipeline<T = unknown, S = unknown> extends IPipeline<T, S> {
  config: IPipelineStepConfig;
  steps: IPipelineStep[];
  pos: number;
  add<R, C extends Partial<IPipelineStepConfig> | null>(fn: PipelineFn<PipelineFnInput<S, C>, R>, config?: C): IPipeline<T, R>;
  if<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>, config?: C): IPipeline<T, R>;
  if<C extends Partial<IPipelineStepConfig> | null, R extends PipelineFnInput<S, C> = PipelineFnInput<S, C>>(fn: PipelineFn<T, boolean | number>, conditionals: IPipeline<R, R>[], config?: C): IPipeline<T, R>;
  call<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: (input: R, step: IPipelineStep) => any | Promise<any>, config?: C): IPipeline<T, R>;
  call<R extends PipelineFnInput<S, C>, C extends Partial<IPipelineStepConfig> | null>(effect: IPipeline<R, any>, config?: C): IPipeline<T, R>
  instantiate(): this;
  run(...input: PipelineInput<T>): Promise<ISuccess<S> | IFailure>;
  at(name: PipelineFn<unknown, unknown> | string | number): ISuccess<unknown> | IFailure | null | undefined;
}
