import { IDebounceOptions, IThrottleOptions } from "src/@types";
import { isNotNullOrUndefined, isNotUndefined, isFunction } from "./Test";
import { debounce, AssertError, throttle, once as runOnlyOnce } from "./Util";

export function debounced<S>(
  duration?: number,
  options?: Partial<IDebounceOptions>,
) {
  return function innerDecorator<S>(
    target: S,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    return {
      // this is needed to have a unique timer per object instance
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: debounce(descriptor.value, duration, options),
        });

        return (this as any)[key];
      },
    };
  };
}
export function throttled<S>(
  duration?: number,
  options?: Partial<IThrottleOptions>,
) {
  return function innerDecorator<S>(
    target: S,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    return {
      // this is needed to have a unique timer per object instance
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: throttle(descriptor.value, duration, options),
        });

        return (this as any)[key];
      },
    };
  };
}
export function once<S>(
  target: S,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const orgFn = descriptor.value as Function;
  let result: any;
  let first = true;
  descriptor.value = function (...args: any[]) {
    if (first) {
      result = orgFn.apply(this, args);
      first = false;
    }
    return result;
  };
  return descriptor;
}

export function deprecated<S>(instead?: string, message?: string) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    const className = (target as Object).constructor.name;
    let localMessage = isNotNullOrUndefined(message)
      ? message!
          .replace("{class}", className)
          .replace("{name}", propertyKey)
          .replace("{instead}", instead || "")
      : "Function {class}::{name} is deprecated"
          .replace("{class}", className)
          .replace("{name}", propertyKey) +
        (isNotNullOrUndefined(instead)
          ? " please use {instead} instead".replace("{instead}", instead!)
          : "");

    const warn = runOnlyOnce(function () {
      console.warn(localMessage);
    });

    descriptor.value = function (...args: any[]) {
      warn();
      return orgFn.apply(this, args);
    };

    return descriptor;
  };
}

export function asserts<S>(assertFn: Function, result?: any) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    const className = (target as Object).constructor.name;
    const fnName = propertyKey;

    descriptor.value = function (...args: any[]) {
      try {
        assertFn.apply(this, args);
      } catch (assertError) {
        if (isNotUndefined(result)) {
          return isFunction(result) ? result(assertError) : result;
        } else {
          throw new AssertError(
            `Assertion failed in ${className}::${fnName}: ${assertError.message}`,
          );
        }
      }
      return orgFn.apply(this, args);
    };

    return descriptor;
  };
}

export function transform<S>(
  decoration: (name: string, ...args: any[]) => any[],
) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    descriptor.value = function (...args: any[]) {
      let newArgs = decoration.apply(this, [orgFn.name].concat(args));
      const result = orgFn.apply(this, newArgs);
      return result;
    };
    return descriptor;
  };
}

// credit to https://github.com/raganwald/method-combinators/blob/master/doc/async-js.md#method-combinators-in-an-asynchronous-world

export function before<S>(decoration: (name: string, ...args: any[]) => void) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    descriptor.value = function (...args: any[]) {
      decoration.apply(this, [orgFn.name].concat(args));
      const result = orgFn.apply(this, args);
      return result;
    };
    return descriptor;
  };
}

export function after<S>(decoration: (name: string, ...args: any[]) => void) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    descriptor.value = function (...args: any[]) {
      const result = orgFn.apply(this, args);
      decoration.apply(this, [orgFn.name].concat(args));
      return result;
    };
    return descriptor;
  };
}

export function around<S>(
  decoration: (callback: Function, name: string, ...args: any[]) => void,
) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    descriptor.value = function (...args: any[]) {
      let result: any;
      let callback = () => (result = orgFn.apply(this, args));
      decoration.apply(this, [callback, orgFn.name].concat(args));
      return result;
    };
    return descriptor;
  };
}

export function provided<S>(
  condition: (name: string, ...args: any[]) => boolean,
) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;
    descriptor.value = function (...args: any[]) {
      let result: any;
      if (condition.apply(this, [orgFn.name].concat(args))) {
        result = orgFn.apply(this, args);
      }
      return result;
    };
    return descriptor;
  };
}

export let async: {
  <S>(
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor;
  before?<S>(
    decoration: (name: string, ...args: any[]) => Promise<any>,
  ): (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => PropertyDescriptor;
  after?<S>(
    decoration: (name: string, ...args: any[]) => Promise<any>,
  ): (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => PropertyDescriptor;
  provided?<S>(
    async_predicate: (...args: any[]) => Promise<boolean>,
  ): (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => PropertyDescriptor;
} = function async<S>(
  target: S,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const orgFn = descriptor.value as Function;
  descriptor.value = function (...args: any[]): Promise<any> {
    let result = new Promise<any>((resolve, reject) => {
      let value: any;
      try {
        value = orgFn.apply(this, args);
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
    return result;
  };
  return descriptor;
};

async.before = function <S>(
  decoration: (name: string, ...args: any[]) => Promise<any>,
) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;

    descriptor.value = function (...args: any[]) {
      let result = new Promise<any>((resolve, reject) => {
        const callback = () => {
          orgFn
            .apply(this, args)
            .then((value: any) => {
              resolve(value);
            })
            .catch((reason: any) => {
              reject(reason);
            });
        };
        (decoration.apply(this, [orgFn.name].concat(args)) as Promise<any>)
          .then((value: any) => {
            callback();
          })
          .catch((reason: any) => {
            callback();
          });
      });
      return result;
    };
    return descriptor;
  };
};

async.after = function <S>(
  decoration: (
    value: any,
    reason: any,
    name: string,
    ...args: any[]
  ) => Promise<any>,
) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;

    descriptor.value = function (...args: any[]) {
      let result = new Promise<any>((resolve, reject) => {
        const callback = (value: any, reason: any) => {
          (
            decoration.apply(
              this,
              [value, reason, orgFn.name].concat(args),
            ) as Promise<any>
          )
            .then((value: any) => {
              resolve(value);
            })
            .catch((reason: any) => {
              reject(reason);
            });
        };
        orgFn
          .apply(this, args)
          .then((value: any) => {
            callback(value, undefined);
          })
          .catch((reason: any) => {
            callback(undefined, reason);
          });
      });
      return result;
    };
    return descriptor;
  };
};

async.provided = function <S>(
  async_predicate: (name: string, ...args: any[]) => Promise<boolean>,
) {
  return function (
    target: S,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const orgFn = descriptor.value as Function;

    descriptor.value = function (...args: any[]) {
      let result = new Promise<any>((resolve, reject) => {
        const callback = () => {
          orgFn
            .apply(this, args)
            .then((value: any) => {
              resolve(value);
            })
            .catch((reason: any) => {
              reject(reason);
            });
        };
        (
          async_predicate.apply(
            this,
            [orgFn.name].concat(args),
          ) as Promise<boolean>
        )
          .then((value: boolean) => {
            if (value) {
              callback();
            } else {
              reject(false);
            }
          })
          .catch((reason: any) => {
            reject(reason);
          });
      });
      return result;
    };
    return descriptor;
  };
};
