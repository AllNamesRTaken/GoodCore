export function diff<T extends IDiffable, S extends IDiffable>(target: T, base: S): IDelta<T,S> {
	function changes<T extends IDiffable, S extends IDiffable>(target: T, base: S): IDelta<T,S> {
		if (isArray(target) && isArray(base)) {
			const [added, removed] = arrayDiff(target as IDiffable[], base as IDiffable[]);
			if(added.length === 0 && removed.length === 0 && equals(target, base)) {
				return [added, null, removed] as IDelta<T, S>
			}
			return [added, [] as any, removed] as IDelta<T, S>
		} else if(isObject(target) && isObject(base)) {
			const keyDiff = arrayDiff(Object.keys(target as Indexable<any>), Object.keys(base as Indexable<any>))
			const keyDiffLookup = keyDiff.map((keys) => toLookup(keys))
			const added = keyDiff[0].reduce((p: Partial<T>, c: string, i: number) => {
				(p as Indexable<any>)[c] = (target as Indexable<any>)[c]
				return p
			}, new ((target as Object).constructor as Constructor<T>)())
			const changed = transform(target as Indexable<IDiffable>, function(result: IDeltaObj<T, S>, value: IValueOf<T>, key: string) {
				if(!(key as string in keyDiffLookup[0])) {
					if (isDifferent(value, (base)[key as keyof S])) {
					(result)[key as keyof IDeltaObj<T, S>] = (isObject(value) && isObject((base)[key as keyof S])) ? 
						changes(value, (base)[key as keyof S] as IValueOf<S>) as unknown as IValueOf<IDeltaObj<T, S>> : 
						[value, null, (base)[key as keyof S] as IValueOf<S>] as unknown as IValueOf<IDeltaObj<T, S>>;
					}
				}
			}, {} as IDeltaObj<T,S>)
			const removed = keyDiff[1].reduce((p: Partial<S>, c: string, i: number) => {
				(p as Indexable<any>)[c] = (base as Indexable<any>)[c];
				return p;
			}, new ((base as Object).constructor as Constructor<S>)())
			return [added, changed, removed] as IDelta<T, S>;
		} else {
			return [target as Partial<T>, null, base as Partial<S>] as IDelta<T, S>;
		}
		
	}
	return changes(target, base);
}