
export let async: {
	<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
	before?: <S>(decoration: (...argv: any[]) => Promise<any>) => (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
	after?: <S>(decoration: (...argv: any[]) => Promise<any>) => (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
	provided?: <S>(async_predicate: (...argv: any[]) => Promise<boolean>) => (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
} =
function async<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
	const orgFn = descriptor.value;
	descriptor.value = function(...args: any[]): Promise<any> {
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

async.before = function<S>(decoration: (...argv: any[]) => Promise<any>) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;

		descriptor.value = function(...args: any[]) {
			let result = new Promise<any>( (resolve, reject) => {
				const callback = () => {
					orgFn.apply(this, args)
					.then((value: any) => {
						resolve(value);
					})
					.catch((reason: any) => {
						reject(reason);
					});	
				};
				(decoration.apply(this, args) as Promise<any>)
				.then((value: any) => {
					callback();
				})
				.catch((reason: any) => {
					callback();
				});
			} );
			return result;
		};
		return descriptor;
	};
};

async.after = function<S>(decoration: (value: any, reason: any, ...argv: any[]) => Promise<any>) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;

		descriptor.value = function(...args: any[]) {
			let result = new Promise<any>( (resolve, reject) => {
				const callback = (value: any, reason: any) => {
					(decoration.apply(this, [value, reason].concat( args )) as Promise<any>)
					.then((value: any) => {
						resolve(value);
					})
					.catch((reason: any) => {
						reject(reason);
					});
				};
				orgFn.apply(this, args)
				.then((value: any) => {
					callback(value, undefined);
				})
				.catch((reason: any) => {
					callback(undefined, reason);
				});	
					
			} );
			return result;
		};
		return descriptor;
	};
};

async.provided = function<S>(async_predicate: (...argv: any[]) => Promise<boolean>) {
	return function(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
		const orgFn = descriptor.value;

		descriptor.value = function(...args: any[]) {
			let result = new Promise<any>( (resolve, reject) => {
				const callback = () => {
					orgFn.apply(this, args)
					.then((value: any) => {
						resolve(value);
					})
					.catch((reason: any) => {
						reject(reason);
					});	
				};
				(async_predicate.apply(this, args) as Promise<boolean>)
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
			} );
			return result;
		};
		return descriptor;
	};
};
