type Constructor<T> = new (...args: any[]) => T;
type ICtor<T> = new (...args: any[]) => T;
// tslint:disable-next-line:max-line-length
type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type PickKeysOfType<T, KT> = ({ [P in keyof T]: T[P] extends KT ? P : never })[keyof T];
type PickType<T, KT> = Pick<T, PickKeysOfType<T, KT>>;
type PickFunctions<T> = PickType<T, () => any>;
type ExcludeType<T, KT> = Omit<T, PickKeysOfType<T, KT>>;
type ExcludeFunctions<T> = ExcludeType<T, () => any>;

// tslint:disable-next-line:interface-name
interface Indexable<T> {
    [key: string]: T;
}
interface IObject extends Indexable<any> { }
interface IInstance<T> extends IObject {
    // tslint:disable-next-line:no-reserved-keywords
    constructor?: ICtor<T>;
}
type ArgTypes<T> = T extends (...a: infer A) => unknown ? A : [];
type ResultType<T> = T extends (...a: unknown[]) => infer S ? S : never;
interface IPool<T extends IPoolable> {
    get(): T;
    release(obj: T): void;
}
interface ICloneable {
    clone(): this;
}
interface ISerializable<T> {
    toJSON(): any;
    serialize(): T;
}
interface IDeserializable<T> {
    deserialize(data: any, ...types: Array<Constructor<any>>): T;
}
interface IRevivable<T> {
    revive(data: any, ...types: Array<Constructor<any>>): T;
    deserialize(array: any, ...types: Array<Constructor<any>>): T;
}
interface IDebounceOptions {
    leading: boolean;
}
declare const Global: {
    window: Window | null;
    hasNativeWindow: boolean;
    global: Window; // has to exclude Node since this is browser only
};
/**
* Functions that helps you manipulate arrays
*/
declare namespace Arr {
    /**
    * Flattens a nested array to a single level.
    * @param src Array to flatten
    * @returns the flattened array
    */
    export function flatten<T>(src: any[]): T[];
    /**
    * Reverses an array. (Very fast)
    * @param src Array to reverse
    */
    export function reverse<T>(array: T[]): T[];
    /**
    * Append an array to another array.
    * @param arr Source array
    * @param values Array data to append
    */
    export function append<T>(arr: T[], values: T[]): void;
    /**
    * Searches an array for a matching condition.
    * @param src Array search through
    * @param fn Condition test the elements against
    * @returns matching element or undefined
    */
    export function find<T>(src: T[], fn: (el: T) => boolean): T | undefined;
    /**
    * Copies an array by copying the elements by reference.
    * @param src Array to copy
    * @returns Copy
    */
    export function shallowCopy<T>(src: T[]): T[];
    /**
    * Copies an array deeply.
    * @param src Array to copy
    * @returns Copy
    */
    export function deepCopy<T>(src: T[]): T[];
    /**
    * Copies an array deeply into a target array.
    * @param src Array to copy
    * @param src Target array to copy into
    */
    export function deepCopyInto<T>(src: T[], target: T[]): void;
    /**
    * Applies an async function to all elements in an array and returns a resulting array
    * @param array Array loop over
    * @param fn Async function to apply
    * @param inParallel (Optional) option to execute functions in parallel or serially
    * @returns the flattened arrays
    */
    export function mapAsync<S, T>(src: S[], fn: (el: S, i: number) => PromiseLike<T>, inParallel?: boolean): Promise<T[]>;
    /**
    * Applies an async function to all elements in an array
    * @param array Array loop over
    * @param fn Async function to apply
    * @param inParallel (Optional) option to execute functions in parallel or serially
    */
    export function forEachAsync<T>(array: T[], fn: (el: T, i: number) => PromiseLike<any>, inParallel?: boolean): Promise<void>;
    /**
    * Applies a function to a subset of an array.
    * @param src Array to loop over
    * @param filter Filter function to apply to the array
    * @param fn Function to apply to each element in the subset
    */
    export function forSome<T>(src: T[], filter: (el: T, i: number) => boolean, fn: (el: T, i: number) => any): void;
    /**
    * Applies a function to the elements of an array until a condition is met.
    * @param src Array to loop over
    * @param fn Function to apply, if the function returns true, the loop will break.
    */
    export function until<T>(src: T[], fn: (el: T, i: number) => void, startIndex?: number): void;
    /**
    * Applies a function to the elements of an array until a condition is met.
    * @param src Array to loop over
    * @param test Test function. Returning true will break the loop.
    * @param fn Function to apply
    */
    export function until<T>(src: T[], test: (el: T, i: number) => boolean, fn: (el: T, i: number) => void, startIndex?: number): void;
    /**
    * Test if all elements in an array fullfils a condition
    * @param src Array to test
    * @param test Function to test against each elements
    */
    export function all<T>(src: T[], fn: (el: T) => boolean): boolean;
    /**
    * Searches a sorted array and returns the index of the found element or -1.
    * @param src Sorted array to search
    * @param cmp Comparer function that returns negative if it is below and positive if above and 0 if its a match 
    * @returns index of matching element or -1
    */
    export function binarySearch<T>(src: T[], cmp: (el: T) => number, closest?: boolean): number;
    /**
    * Creates an array and populates it based on a function.
    * @param length Length of new array
    * @param populator Function that returns the new value, given the index
    * @returns New array
    */
    export function create<T>(length: number, populator: (i: number, arr: T[]) => T): T[];
    type zipFn<S, T, U, V = undefined, W = undefined> = (i: number, a: S, b: T, c?: V, d?: W) => U;
    /**
    * Transforms two or more arrays of max length N into one array of length N
    * @param a Input array
    * @param b Input array
    * @param fn (Optional) transform function. Default will return an array of elements being tuples of [a, b]
    * @returns The new array
    */
    export function zip<S, T, U = [S, T], V = undefined, W = undefined>(
        a: S[],
        b: T[],
        fn?: zipFn<S, T, U, V, W>,
        c?: undefined,
        d?: undefined,
    ): U[];
    /**
    * Transforms two or more arrays of max length N into one array of length N
    * @param a Input array
    * @param b Input array
    * @param c Input array
    * @param fn (Optional) transform function. Default will return an array of elements being tuples of [a, b, c]
    * @returns The new array
    */
    export function zip<S, T, V, U = [S, T, V], W = undefined>(
        a: S[],
        b: T[],
        c: V[],
        fn?: zipFn<S, T, U, V, W>,
        d?: undefined,
    ): U[];
    /**
    * Transforms two or more arrays of min length N into one array of length N
    * @param a Input array
    * @param b Input array
    * @param c Input array
    * @param d Input array
    * @param fn (Optional) transform function. Default will return an array of elements being tuples of [a, b, c, d]
    * @returns The new array
    */
    export function zip<S, T, V, W, U = [S, T, V, W]>(
        a: S[],
        b: T[],
        c: V[],
        d: W[],
        fn?: zipFn<S, T, U, V, W>,
    ): U[];
    /**
    * Transforms an array of length N into a tuple of two arrays of length N.
    * @param arr Array to transform
    * @param fn Function that takes value and index and returns a tuple. Default will try and treat the value as a tuple of [a, b].
    * @returns A tuple of the two new arrays
    */
    export function unzip<S, T, U = [S, T]>(arr: U[], fn?: (u: U, i?: number, out?: [S, T]) => [S, T]): [S[], T[]];
    /**
    * Pivots a two dimensional array.
    * @param arr Array pivot
    * @returns The pivoted two dimensional array
    */
    export function pivot<S = any, T extends S[] = S[]>(arr: T[]): S[][];
    /**
    * Deserializes an array into an array of Objects of given types.
    * @param array Data to deserialize
    * @param target Array to place the deserialized data into
    * @param types List of constructors of classes that the data is deserializes to. Only the first will be used for the array data and any subsequent constructors are passed into future deserializers of the supplied classes.
    * @returns an array of the deserialized data
    */
    export function deserialize<S>(array: any[], target: S[], ...types: Array<Constructor<any>>): S[];
    type Descriminator<T> = (el: T) => boolean;
    /**
    * Splits an array into N buckets (arrays) based on N-1 descriminator functions.
    * @param array Array to split
    * @param desciminators N-1 functions that returns true if a value belongs to a bucket.
    * @returns a tuple with N arrays where ich array contains the elements matched by the matching deciminator function.
    */
    export function bucket<T>(array: T[], ...desciminators: Array<Descriminator<T>>): T[][];
    /**
    * Splits an array into two separate arrays bases on a descriminator function.
    * @param array Array to split
    * @param isA A function that returns true for the elements to put in the first result array.
    * @returns a tuple with two arrays, the first containing the elements matched by the deciminator function.
    */
    export function split<T>(array: T[], isA: Descriminator<T>): [T[], T[]];
    /**
    * Removes any duplicates from an array.
    * @param array Array to process
    * @param hashFn (Optional) Function to provide a hash for each value.
    * @returns a new array without duplicates
    */
    export function disinct<T>(array: T[], hashFn?: (el: T) => string): T[];
}
/**
* Functions that loops over, transform or act on objects
*/
declare namespace Obj {
    /**
    * Calles the destroy function on any IDestroyable or sets all properties to null on other objects.
    * @param obj Object to destroy.
    */
    export function destroy(obj: Object): void;
    /**
    * Deletes all properties of an object.
    * @param obj Object to wipe.
    */
    export function wipe(obj: Object): void;
    /**
    * Sets all properties of an object to null
    * @param obj Object to null.
    */
    export function setNull(obj: Object): void;
    /**
    * Test if an object is of a class inheriting from another objects class or of the same class
    * @param a Object to test.
    * @param b Object to test against.
    * @returns true if A inherits B or if A == B
    */
    export function isClassOf(a: Object, b: Object): boolean;
    /**
    * Test if an object is of the same class as another object
    * @param a Object to test.
    * @param b Object to test against.
    * @returns true if a and b is of the same class
    */
    export function isSameClass(a: Object, b: Object): boolean;
    /**
    * Test if an object is of a class inheriting from another objects class but not the same class
    * @param a Object to test.
    * @param b Object to test against.
    * @returns true if A inherits B
    */
    export function inherits(a: Object, b: Object): boolean;
    /**
    * Test if two objects are equal, deeply
    * @param a Object to test.
    * @param b Object to test against.
    * @returns true if a deeply equals b
    */
    export function equals(a: any, b: any): boolean;
    /**
    * Test if two objects are different, deeply
    * @param a Object to test.
    * @param b Object to test against.
    * @returns true if a differs from b
    */
    export function isDifferent(a: any, b: any): boolean;
    /**
    * Copys an object by copying its properties by reference
    * @param obj Object to copy
    * @returns a shallow copy of obj
    */
    export function shallowCopy<T, K extends keyof T>(obj: T): { [P in K]: T[P] };
    /**
    * Copys an object deeply
    * @param obj Object to copy
    * @returns a deep copy of obj
    */
    export function clone<T>(obj: T): T;
    /**
    * Copys an object deeply into a target object
    * @param src Object to copy
    * @param target Target to copy the properties of src into
    * @returns target
    */
    export function cloneInto<T, S>(src: T | S[], target: T | S[]): T | S[];
    /**
    * Adds the properties of a number of objects onto a target object
    * @param target The target object to apply properites to
    * @param exclude An object with properties whos names will not be copied from sources to target
    * @param sources List of objects to take properties from
    * @returns the total of target and sources
    */
    export function mixin(target: Indexable<any>, exclude: Indexable<any> | null, ...sources: Array<Indexable<any>>): Indexable<any>;
    /**
    * Sets the property values of a source object to the properties of a target object. Possibly limiting to non undefined properties in the target.
    * @param target Target to apply values to
    * @param values Values to apply to target
    * @param mapping (Optional) property name transformation map
    * @param limitToExisting (Optional) Limit the properties being set to those that have non undefined values in target
    */
    export function setProperties(target: Indexable<any>, values: Indexable<any>, mapping?: Indexable<string>, limitToExisting?: boolean): void;
    /**
    * Applies a function to all the properties of an object. Returning false will end the loop.
    * @param target Target object to loop over
    * @param fn Function to apply to each property. Returning false will end the loop
    */
    export function forEach<T>(
        target: Indexable<T> | T[],
        fn: (value: T, key: string) => boolean | void,
    ): void;
    // tslint:disable-next-line:max-line-length
    /**
    * Transforms an object to another object. Much like a reduce does on arrays.
    * @param target Input object.
    * @param fn Function to apply to each property. Returning false will end the transform. Mutations to the result argument is propagated to the next iteration.
    * @param accumulator (Optional) Object to alter using the transform function. Default is an instance of the target objects type.
    * @returns The last result argument.
    */
    export function transform<T extends { [index: string]: any }, S = {}, U = any>(target: T | U[], fn: (result: S, value: any, key: string) => boolean | void, accumulator?: S): S;
    /**
    * Creates an object with the propeties that are different between the target and the base object.
    * @param target Object to compare with.
    * @param base Object to compare against.
    * @returns An object of the targets type with the properties of target where those are different from the same properties in base.
    */
    export function difference<T extends { [index: string]: any }, S extends { [index: string]: any } = T>(target: T, base: S): T;
}
declare interface IObjectWithFunctions<T extends Object | void> {
    [key: string]: (...args: any[]) => T;
}

interface IDebounceOptions {
    leading: boolean;
}
//@ts-ignore TS2304
type DebounceResultType<T, U> = T extends (...a: unknown[]) => PromiseLike<infer S> ?
    PromiseLike<S> :
    T extends (...a: unknown[]) => infer R ?
    U extends { leading: true } ?
    R :
    PromiseLike<R>
    : never;
//@ts-ignore TS2304
interface IDebouncedFunction<T, U> {
    (...args: ArgTypes<T>): DebounceResultType<T, U>;
    //@ts-ignore TS2304
    resetTimer?(): void;
}
interface IThrottleOptions {
    leading: boolean;
    trailing: boolean;
}
type IThrottledFunction<T> = (...args: ArgTypes<T>) => ResultType<T>;
/**
* Utility functions to make your life full of sunshine
*/
declare namespace Util {
    export class LoggableCounter {
        public name: string;
        public log(): void;
        public inc(): LoggableCounter;
        public reset(): LoggableCounter;
        valueOf(): number;
        toString(): string;
    }
    /**
    * Gets an instance of a LoggableCounter.
    * @param key (Optional) name of the counter.
    * @returns LoggableCounter.
    */
    export function counter(key?: number | string): LoggableCounter;
    /**
    * Increases a counter with a given name by 1.
    * @param key (Optional) name of the counter.
    * @returns LoggableCounter.
    */
    export function count(key?: number | string): LoggableCounter;
    /**
    * Wraps a function so that it only runs once.
    * @param fn Function to wrap
    * @returns A wrapped function that will only execute once.
    */
    export function once<T extends (...args: any[]) => S, S = void>(fn: T): T;
    export function init(win?: Window): void;
    /**
    * Gets a new Date object with a delta. Not as exact as a Time library like moment.
    * @param delta (Optional) Delta in the form of "+1Y2M3d4h5m6s" e.g "-4d" for negative 4 days. Default is 0.
    * @param start (Optional) Start Date to add delta to. Default is now.
    * @returns A new Date.
    */
    export function getDate(delta?: string, start?: Date): Date;
    /**
    * Creates a reasonably unique UUID that conforms to to the standard UUID format.
    * @returns a UUID string.
    */
    export function newUUID(): string;
    /**
    * Creates a global integer counter and returns the next value.
    * @param key (Optional) name of counter.
    * @returns new integer.
    */
    export function newInt(key: number | string = 0): number;
    export class AssertError extends Error { }
    /**
    * Asserts that a boolean expression is true or throws an exception with a given message.
    * @param assertion Boolean expression to test.
    * @param message (Optional) message to show if assertion fails.
    * @param noThrow (Optional) turns the exception into a console.error if set to true.
    * @returns the value of the assertion.
    */
    export function assert(assertion: boolean, message?: string, noThrow?: boolean): boolean;
    // tslint:disable-next-line:max-line-length
    /**
    * Executes a function X times.
    * @param count Number of times to loop.
    * @param fn Function to execute on each loop.
    */
    export function loop(count: number, fn: (i: number, ...args: any[]) => any | void): void;
    /**
    * Turns an arraylike object into a proper array.
    * @param arr ArrayLike to transform.
    * @returns A new array.
    */
    export function toArray<T>(arr: ArrayLike<T>): T[];
    /**
    * Debounces a function, meaning that it delays execution until no other calls has been made to that function for a specified time.
    * @param method Function to debounce
    * @param duration Duration to debounce
    * @param options Options object to configure if the debounced function should also trigger on the leading call.
    * @returns The new debounced function.
    */
    export function debounce<T extends (...args: any[]) => any, U extends Partial<IDebounceOptions>>(
        method: T,
        duration: number,
        options?: U,
    ): IDebouncedFunction<T, U>;
    /**
    * Throttles a function, meaning that it delays execution until atleast a specified time has passed.
    * @param method Function to throttle
    * @param duration Duration to throttle
    * @param options Options object to configure if the throttled function should also trigger on the leading call and/or trailing the last timeout.
    * @returns The new throttled function.
    */
    export function throttle<T extends (...args: any[]) => any>(
        method: T,
        duration?: number,
        options?: Partial<IThrottleOptions>,
    ): IThrottledFunction<T>;
}
/**
* Functions that test if a value is what you hope it is
*/
declare namespace Test {
    export class Env {
        public static useNative?: boolean;
        public static isOpera(): boolean;
        public static isFirefox(): boolean;
        public static isSafari(): boolean;
        public static isIE(): boolean;
        public static isEdge(): boolean;
        public static isChrome(): boolean;
        public static isBlink(): boolean;
        public static hasFastNativeArrays(): boolean;
    }
    export function hasWindow(): boolean;
    export function hasConsole(): boolean;
    /**
    * Tests if the argument is an Object (most non-values are).
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isObject(it: any): boolean;
    /**
    * Tests if the argument is an Array.
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isArray(it: any): boolean;
    /**
    * Tests if the argument is an Element.
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isElement(target: any): boolean;
    /**
    * Tests if the argument is a function.
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isFunction(it: any): boolean;
    /**
    * Tests if the argument is a number. (Strings with numbers are not numbers.)
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isNumber(x: any): boolean;
    /**
    * Tests if the argument is an integer.
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isInt(x: any): boolean;
    /**
    * Tests if the argument is a string.
    * @param it Argument to test.
    * @returns true if it is.
    */
    export function isString(x: any): boolean;
    export function areNullOrUndefined(...args: any[]): boolean;
    export function areNotNullOrUndefined(...args: any[]): boolean;
    export function isNullOrUndefined(arg: any): boolean;
    export function isNotNullOrUndefined(arg: any): boolean;
    export function areUndefined(...args: any[]): boolean;
    export function areNotUndefined(...args: any[]): boolean;
    export function isNull(arg: any): boolean;
    export function isNotNull(arg: any): boolean;
    export function isUndefined(arg: any): boolean;
    export function isNotUndefined(arg: any): boolean;
}

declare class KeyValuePair<S, T> {
    key: S;
    value: T;
}
