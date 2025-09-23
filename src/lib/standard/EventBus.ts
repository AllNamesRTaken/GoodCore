import type { ResultType, Indexable } from '../../@types/index.js'

type Bus<E> = Record<BusKey<E>, E[BusKey<E>][]>
type Offs<E> = Record<BusKey<E>, Array<() => void>>

export type EventKey = string | symbol
export type BusKey<E> = keyof E & EventKey
export type EventHandlerResult<S> = Promise<S> | S | void
export type EventHandler = (...args: unknown[]) => EventHandlerResult<unknown>
export type EventMap = { [key: EventKey]: EventHandler }
export type InnerPromiseType<T> = T extends Promise<infer U> ? U : T
export type HandlerPayload<P> = P & Partial<{ args: unknown[] }>

export interface IEventBus<T extends EventMap> {
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

  public on(key: BusKey<E>, handler: E[BusKey<E>]) {
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

  public off(key: BusKey<E>, handler: E[BusKey<E>]) {
    const index = this.bus[key]?.indexOf(handler) ?? -1
    if (index === -1) {
      return
    }
    this.bus[key]?.splice(index >>> 0, 1)
    this.offs[key]?.splice(index >>> 0, 1)
  }

  public emit(key: BusKey<E>, ...payload: Parameters<E[BusKey<E>]>): void {
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

  public once(key: BusKey<E>, handler: E[BusKey<E>]) {
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
    key: BusKey<E> | [BusKey<E>, ...Parameters<E[BusKey<E>]>],
    ...payload: Parameters<E[BusKey<E>]> | undefined[]
  ): Promise<InnerPromiseType<ResultType<E[BusKey<E>]>>[]> {
    if ('string' !== typeof key) {
      ;[key, ...payload] = key as [BusKey<E>, ...Parameters<E[BusKey<E>]>]
    }
    const results = this.bus[key]
      ?.map((handler) => {
        try {
          const result = handler(payload[0]) as ResultType<E[BusKey<E>]>
          if (result instanceof Promise) {
            result.catch((e) => this.config.onError?.(e))
            return result as Promise<InnerPromiseType<ResultType<E[BusKey<E>]>>>
          } else {
            return Promise.resolve(
              result as InnerPromiseType<ResultType<E[BusKey<E>]>>
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
    key: BusKey<E> | [BusKey<E>, ...Parameters<E[BusKey<E>]>],
    ...payload: Parameters<E[BusKey<E>]>
  ): Promise<InnerPromiseType<ResultType<E[BusKey<E>]>>> {
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
