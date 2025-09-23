import type { ResultType, Indexable } from '../../@types/index.js'

type Bus<E> = Record<keyof E, E[keyof E][]>
type Offs<E> = Record<keyof E, Array<() => void>>

type EventMap = Indexable<(...args: any) => unknown>;
export type InnerPromiseType<T> = T extends Promise<infer U> ? U : T
export type HandlerPayload<P> = P & Partial<{ args: unknown[] }>

export interface IEventBus<T extends EventMap> {
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

interface IBusConfig {
  onError?: (e: Error) => void
  verbose: 0 | 1
}
const defaultConfig: IBusConfig = {
  onError: undefined,
  verbose: 0,
}
export class EventBus<E extends EventMap> implements IEventBus<E> {
  private bus: Partial<Bus<E>> = {}
  private offs: Partial<Offs<E>> = {}
  private config: IBusConfig
  constructor(config?: Partial<IBusConfig>) {
    this.config = { ...defaultConfig, ...config }
  }

  public on(key: keyof E, handler: E[keyof E]) {
    if (this.bus[key] === undefined) {
      this.bus[key] = []
      this.offs[key] = []
    }

    this.bus[key]!.push(handler)
    const off = () => {
      this.off(key, handler)
    }
    this.offs[key]!.push(off)

    // unsubscribe function
    return off
  }

  public off(key: keyof E, handler: E[keyof E]) {
    const index = this.bus[key]?.indexOf(handler) ?? -1
    if (index === -1) {
      return
    }
    this.bus[key]?.splice(index >>> 0, 1)
    this.offs[key]?.splice(index >>> 0, 1)
  }

  public emit(key: keyof E, ...payload: Parameters<E[keyof E]>): void {
    this.bus[key]?.forEach((handler) => {
      try {
        const result = handler(payload[0])
        if (result instanceof Promise) {
          result.catch((e) => this.config.onError?.(e))
        }
      } catch (e) {
        this.config.onError?.(e)
      }
    })
  }

  public once(key: keyof E, handler: E[keyof E]) {
    const handleOnce = (
      payload: HandlerPayload<Parameters<typeof handler>>
    ) => {
      this.off(key, handleOnce as typeof handler)
      const result = handler(payload)
      if (result instanceof Promise) {
        return result;
      }
    }

    this.on(key, handleOnce as typeof handler)
  }

  public async rpcMany(
    key: keyof E | [keyof E, ...Parameters<E[keyof E]>],
    ...payload: Parameters<E[keyof E]> | undefined[]
  ): Promise<InnerPromiseType<ResultType<E[keyof E]>>[]> {
    if ('string' !== typeof key) {
      ;[key, ...payload] = key as [keyof E, ...Parameters<E[keyof E]>]
    }
    const results = this.bus[key]
      ?.map((handler) => {
        try {
          const result = handler(payload[0]) as ResultType<E[keyof E]>
          if (result instanceof Promise) {
            result.catch((e) => this.config.onError?.(e))
            return result as Promise<InnerPromiseType<ResultType<E[keyof E]>>>
          } else {
            return Promise.resolve(
              result as InnerPromiseType<ResultType<E[keyof E]>>
            )
          }
        } catch (e) {
          this.config.onError?.(e)
          return Promise.reject(e)
        }
      })
      .filter((r) => r instanceof Promise)
    if (this.config.verbose > 0 && !this.bus[key]) {
      console.warn(
        `No listener for emit to ${key.toString()} [payload: ${JSON.stringify(payload)}]`
      )
    }
    return Promise.all(results ?? [])
  }

  public async rpc(
    key: keyof E | [keyof E, ...Parameters<E[keyof E]>],
    ...payload: Parameters<E[keyof E]>
  ): Promise<InnerPromiseType<ResultType<E[keyof E]>>> {
    return (await this.rpcMany(key, ...payload))[0]
  }
}

//type MyBus = {
//    "event1": (payload: { data: string }) => Promise<string>
//    "event2": (payload: { data: string }) => void
//}

//const myBus = new EventBus<MyBus>();
//myBus.on('event1', (payload) => new Promise<string>((resolve) => {
//    resolve(payload.data)
//}))
//console.log(await myBus.rpc('event1', { data: 'hello' }))
