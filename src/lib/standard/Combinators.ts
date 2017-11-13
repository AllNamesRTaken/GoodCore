// credit to https://github.com/raganwald/method-combinators/blob/master/doc/async-js.md#method-combinators-in-an-asynchronous-world

export function before<S>(decoration: (name: string, ...args: any[]) => void) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;
		descriptor.value = function(...args: any[]) {
			decoration.apply(this, [orgFn.name].concat(args));
			const result = orgFn.apply(this, args);
			return result;
		};
		return descriptor;
	};
}

export function after<S>(decoration: (name: string, ...args: any[]) => void) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;
		descriptor.value = function(...args: any[]) {
			const result = orgFn.apply(this, [orgFn.name].concat(args));
			decoration.apply(this, args);
			return result;
		};
		return descriptor;
	};
}

export function around<S>(decoration: (callback: Function, name: string, ...args: any[]) => void) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;
		descriptor.value = function(...args: any[]) {
			let result: any;
			let callback = () =>
				result = orgFn.apply(this, args);
			decoration.apply(this, [callback, orgFn.name].concat(args));
			return result;
		};
		return descriptor;
	};
}

export function provided<S>(condition: (name: string, ...args: any[]) => boolean) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;
		descriptor.value = function(...args: any[]) {
			let result: any;
			if (condition.apply(this, [orgFn.name].concat(args))) {
				result = orgFn.apply(this, args);
			}
			return result;
		};
		return descriptor;
	};
}
