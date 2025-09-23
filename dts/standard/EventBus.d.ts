/// <reference path="../base.d.ts" />

export class EventBus<T extends EventMap> implements IEventBus<T> {
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