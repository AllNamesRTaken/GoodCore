import { isNotUndefined, isNotNullOrUndefined } from "./Test";
import { IDebounceOptions, debounce } from "./Util";

export function debounced<S>(duration?: number, options?: Partial<IDebounceOptions>): 
<S>(target: S, key: string, descriptor: PropertyDescriptor) => {
	configurable: boolean;
	enumerable: boolean | undefined;
	get(): any;
} {
	return function innerDecorator<S>(target: S, key: string, descriptor: PropertyDescriptor) {
		return {
			configurable: true,
			enumerable: descriptor.enumerable,
			get: function getter() {
				Object.defineProperty(this, key, {
					configurable: true,
					enumerable: descriptor.enumerable,
					value: debounce(descriptor.value, duration, options)
				});

				return (this as any)[key];
			}
		};
	};
}
export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
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
	return function (target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value as Function;
		let localMessage = isNotUndefined(message) ? message!.replace("{name}", propertyKey).replace("{instead}", instead || "") :
			"Function {name} is deprecated".replace("{name}", propertyKey) + 
			(isNotNullOrUndefined(instead) ? " please use {instead} instead".replace("{instead}", instead!) : "");

		let warned = false;
		function warn() {
			if (!warned) {
				console.warn(localMessage);
			}
		}

		descriptor.value = function (...args: any[]) {
			warn();
			return orgFn.apply(this, args);
		};

		return descriptor;

	};
}
