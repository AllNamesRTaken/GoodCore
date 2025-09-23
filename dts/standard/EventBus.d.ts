/// <reference path="../base.d.ts" />

export class EventBus<T extends EventMap> implements IEventBus<T> {
  on(key: BusKey<T>, handler: T[BusKey<T>], id?: string): () => void
  off(key: BusKey<T>, handler: T[BusKey<T>], id?: string): void
  emit(key: BusKey<T>, ...payload: Parameters<T[BusKey<T>]>): void
  once(key: BusKey<T>, handler: T[BusKey<T>]): void
  rpc(
    key: BusKey<T>,
    ...payload: Parameters<T[BusKey<T>]>
  ): Promise<InnerPromiseType<ResultType<T[BusKey<T>]>>>
  rpcMany(
    key: BusKey<T>,
    ...payload: Parameters<T[BusKey<T>]>
  ): Promise<InnerPromiseType<ResultType<T[BusKey<T>]>>[]>
}