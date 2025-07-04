import { expect, describe, beforeAll, test } from 'vitest'
import * as Arr from "../lib/Arr.js";
import * as MocData from "../lib/MocData.js";
import { Vec2 } from "../lib/struct/Vec2.js";
import { Global, Test } from "../lib/index.js";

describe("Arrays",
	() => {
		let longArr: number[];
		let arr1: number[];
		let arr2: number[];
		let arr3: Array<{a: number}>;
		beforeAll(
			() => {
				longArr = MocData.numericArray(100, MocData.MocDataType.RandomInt);
				arr1 = [1, 4, 7, 2] as number[];
				arr2 = [4, 8, 1, 9] as number[];
				arr3 = [{a: 1}, {a: 2}] as any[];
				Global.noDeprecationWarnings = true;
			});
		test("DeepCopy copies values correctly",
			() => {
				const arr = arr1;
				const copy = Arr.deepCopy(arr);
				expect(Arr.deepCopy(null!)).toEqual([]);
				expect(copy).toEqual(arr);
				expect(copy).not.toBe(arr);
			});
		test("ShallowCopy references same inner objects",
			() => {
				const arr = arr3;
				const copy = Arr.shallowCopy(arr);
				expect(copy[1]).toBe(arr[1]);
				expect(Arr.shallowCopy(null!)).toEqual([]);

				Test.Env.useNative = false;

				const copy2 = Arr.shallowCopy(arr);
				expect(copy2[1]).toBe(arr[1]);
				expect(Arr.shallowCopy(null!)).toEqual([]);

				Test.Env.useNative = undefined;
			});
		test("Append appends two arrays into the first",
			() => {
				const copy = Arr.shallowCopy(arr1 as number[]);
				Arr.append(copy, arr2 as number[]);
				const len = (arr1 as number[]).length + (arr2 as number[]).length;
				expect(copy.length).toBe(len);
				expect(copy).toEqual(arr1.concat(arr2));
				let arr = [1];
				Arr.append(arr, null!);
				expect(arr).toEqual([1]);
			});
		test("Concat works and does not change the sources",
			() => {
				const copy1 = Arr.deepCopy(arr1);
				const copy2 = Arr.deepCopy(arr2);
				const result = Arr.concat(copy1, copy2);
				const len = (arr1 as number[]).length + (arr2 as number[]).length;
				expect(result.length).toBe(len);
				expect(result).toEqual(arr1.concat(arr2));
				expect(copy1).toEqual(arr1);
				expect(copy2).toEqual(arr2);
			});
		test("DeepCopyInto works and copies into target",
			() => {
				const copy = Arr.shallowCopy(arr1);
				Arr.deepCopyInto(arr2, copy);
				expect(copy).toEqual(arr2);
				expect(copy).not.toBe(arr2);
				let arr = [1];
				Arr.deepCopyInto(null!, arr);
				expect(arr).toEqual([]);
			});
		test("Deepfill works like deepcopy at a position",
			() => {
				const copy = Arr.shallowCopy(arr1 as number[]);
				Arr.deepFill(arr2 as number[], copy, 2);
				const len = 2 + (arr2 as number[]).length;
				expect(copy.length).toBe(len);
				expect(copy).toEqual([1, 4, 4, 8, 1, 9]);
				let arr = [1, 2];
				Arr.deepFill(null!, arr, 1);
				expect(arr).toEqual([1, 2]);
			});
		test("IndexOf returns correct index",
			() => {
				expect(Arr.indexOf(arr1 as number[], (el) => el === 7)).toBe(2);
				expect(Arr.indexOf(arr1 as number[], (el) => el === 17)).toBe(-1);
				expect(Arr.indexOf(null!, (el) => true)).toBe(-1);

				Test.Env.useNative = false;

				expect(Arr.indexOf(arr1 as number[], (el) => el === 7)).toBe(2);
				expect(Arr.indexOf(arr1 as number[], (el) => el === 17)).toBe(-1);
				expect(Arr.indexOf(null!, (el) => true)).toBe(-1);

				Test.Env.useNative = undefined;
			});
		test("find return correct element or undefined",
			() => {
				expect(arr1.find((el) => el === 7)!).toBe(7);
				expect(arr1.find((el) => el === 77) === undefined).toBe(true);
			});
		test("Filter returns correct array",
			() => {
				const copy = arr1.filter((el, i) => i > 1);
				expect(copy).toEqual([7, 2]);
			});
		test("FilterInto uses supplied array",
			() => {
				const copy = Arr.shallowCopy(arr1 as number[]);
				Arr.filterInto(arr2 as number[], copy, (el, i) => i > 1);
				expect(copy).toEqual([1, 9]);
				Arr.filterInto(null!, copy, (el, i) => i > 1);
				expect(copy).toEqual([]);
			});
		test("Flatten returns correct array",
			() => {
				const copy = [1, [2, 3], 4].flat();
				expect(copy).toEqual([1, 2, 3, 4]);
			});
		test("ForEach loops correctly",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.forEach(arr1 as number[], (el, i) => {arrEl.push(el); arri.push(i); });
				expect(arrEl).toEqual(arr1);
				expect(arri).toEqual([0, 1, 2, 3]);
			});
		test("ForEach with startIndex loops correctly",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.forEach(arr1 as number[], (el, i) => {arrEl.push(el); arri.push(i); }, 1);
				expect(arrEl).toEqual([4, 7, 2]);
				expect(arri).toEqual([1, 2, 3]);
				const arrEl2 = new Array<number>();
				Arr.forEach(arr1 as number[], (el, i) => { arrEl2.push(el); }, 42);
				expect(arrEl2).toEqual([]);
			});
		test("ForEachAsync loops correctly",
			async () => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				await Arr.forEachAsync(arr1 as number[], async (el, i) => {arrEl.push(el); arri.push(i); });
				expect(arrEl).toEqual(arr1);
				expect(arri).toEqual([0, 1, 2, 3]);
				await Arr.forEachAsync(null! as number[], async (el, i) => {arrEl.push(el); arri.push(i); });
				expect(arri).toEqual([0, 1, 2, 3]);
				try {
					await Arr.forEachAsync(arr1 as number[], async (el, i) => {arrEl.push(el); arri.push(i); });
				} catch (err) {
					expect(err).toBeTruthy();
				}
			});
		test("ForEach with inParallel = true executes out of sequence",
			async () => {
				let sequence: number[] = [];
				await Arr.forEachAsync(arr1 as number[], async (el, i) => {
					await new Promise((resolve) => {
						setTimeout(() => {
							sequence.push(el);
							resolve(void(0));
						}, 10 - i * 2);
					});
					return el;
				}, true);
				expect(sequence).toEqual([2, 7, 4, 1]);
			});
		test("ForEach inParallel = false executes in sequence",
			async () => {
				let sequence: number[] = [];
				await Arr.forEachAsync(arr1 as number[], async (el, i) => {
					await new Promise((resolve) => {
						setTimeout(() => {
							sequence.push(el);
							resolve(void(0));
						}, 10 - i * 2);
					});
					return el;
				});
				expect(sequence).toEqual([1, 4, 7, 2]);
			});
		test("ReverseForEach loops correctly",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.reverseForEach(arr1 as number[], (el, i) => {arrEl.push(el); arri.push(i); });
				expect(arrEl).toEqual(Arr.reverse(Arr.shallowCopy(arr1 as number[])));
				expect(arri).toEqual([3, 2, 1, 0]);
				Arr.reverseForEach(null! as number[], (el, i) => {arrEl.push(el); arri.push(i); });
				expect(arri).toEqual([3, 2, 1, 0]);
			});
		test("IndexOfElement returns correct index",
			() => {
				expect(arr1.indexOf(7)).toBe(2);
				expect(arr1.indexOf(17)).toBe(-1);

				Test.Env.useNative = false;
				expect(arr1.indexOf(7)).toBe(2);
				expect(arr1.indexOf(17)).toBe(-1);
				Test.Env.useNative = undefined;
			});
		test("Map el and i are correct",
			() => {
				expect(arr1.map((el, i) => el)).toEqual([1, 4, 7, 2]);
				expect(arr1.map((el, i) => i)).toEqual([0, 1, 2, 3]);
			});
		test("MapAsync el and i are correct",
			async () => {
				expect(await Arr.mapAsync(arr1 as number[], async (el, i) => el)).toEqual([1, 4, 7, 2]);
				expect(await Arr.mapAsync(arr1 as number[], async (el, i) => i)).toEqual([0, 1, 2, 3]);
				expect(await Arr.mapAsync(null! as number[], async (el, i) => i)).toEqual([]);
			});
		test("MapAsync with inParallel = true executes out of sequence",
			async () => {
				let sequence: number[] = [];
				expect(await Arr.mapAsync(arr1 as number[], async (el, i) => {
					await new Promise((resolve) => {
						setTimeout(() => {
							sequence.push(el);
							resolve(void(0));
						}, 10 - i * 2);
					});
					return el;
				}, true)).toEqual([1, 4, 7, 2]);
				expect(sequence).toEqual([2, 7, 4, 1]);
			});
		test("MapAsync inParallel = false executes in sequence",
			async () => {
				let sequence: number[] = [];
				expect(await Arr.mapAsync(arr1 as number[], async (el, i) => {
					await new Promise((resolve) => {
						setTimeout(() => {
							sequence.push(el);
							resolve(void(0));
						}, 10 - i * 2);
					});
					return el;
				})).toEqual([1, 4, 7, 2]);
				expect(sequence).toEqual([1, 4, 7, 2]);
			});
		test("MapInto maps correctly and sets length",
			() => {
				let copy = [1, 2];
				Arr.mapInto(arr1 as number[], copy, (el, i) => el);
				expect(copy).toEqual([1, 4, 7, 2]);
				copy = [1, 2, 3, 4, 5];
				Arr.mapInto(arr1 as number[], copy, (el, i) => i);
				expect(copy).toEqual([0, 1, 2, 3]);
				copy = [1, 2, 3, 4, 5];
				Arr.mapInto(null! as number[], copy, (el, i) => i);
				expect(copy).toEqual([]);
			});
		test("Reduce works on numbers",
			() => {
				expect(Arr.reduce(arr1 as number[], (acc, cur) => cur + acc, 0)).toBe(14);
				expect(Arr.reduce(null! as number[], (acc, cur) => cur + acc, 0)).toBe(0);
			});
		test("Reduce works with from and to",
		() => {
			expect(Arr.reduce(arr1 as number[], (acc, cur) => cur + acc, 0, 1, 2)).toBe(11);
		});
		test("ReduceUntil works on numbers",
			() => {
				expect(Arr.reduceUntil(arr1 as number[], (acc, cur) => cur + acc, (acc, cur) => cur > 5, 0)).toBe(5);
				expect(Arr.reduceUntil(null! as number[], (acc, cur) => cur + acc, (acc, cur) => cur > 5, 0)).toBe(0);
			});
		test("ReduceUntil works with from and to",
		() => {
			expect(Arr.reduceUntil([9, 2, 3, 7, 5, 6] as number[], (acc, cur) => cur + acc, (acc, cur) => cur > 5, 0, 1, 4)).toBe(5);
		});
		test("ReverseReduce works on numbers",
			() => {
				expect(Arr.reverseReduce(arr1 as number[], (acc, cur) => cur + acc, 0)).toBe(14);
				expect(Arr.reverseReduce(null! as number[], (acc, cur) => cur + acc, 0)).toBe(0);
			});
		test("ReverseReduceUntil works on numbers",
			() => {
				expect(Arr.reverseReduceUntil(arr1 as number[], (acc, cur) => cur + acc, (acc, cur) => cur === 4, 0)).toBe(9);
				expect(Arr.reverseReduceUntil(null! as number[], (acc, cur) => cur + acc, (acc, cur) => cur === 4, 0)).toBe(0);
			});
		test("RemoveAt removes correct item",
			() => {
				const arr = [1, 2, 3, 4];
				expect(Arr.removeAt(arr, 2)!).toBe(3);
				expect(arr).toEqual([1, 2, 4]);
				expect((Arr.removeAt(null!, 2) === undefined)).toBe(true);

				Test.Env.useNative = false;

				const arr2 = [1, 2, 3, 4];
				expect(Arr.removeAt(arr2, 2)!).toBe(3);
				expect(arr2).toEqual([1, 2, 4]);
				expect((Arr.removeAt(null!, 2) === undefined)).toBe(true);
				expect((Arr.removeAt([1, 2, 3, 4], -1) === undefined)).toBe(true);

				Test.Env.useNative = undefined;
			});
		test("Remove removes correct element",
			() => {
				const arr = [1, 2, 3, 4];
				Arr.remove(arr, 2);
				expect(arr).toEqual([1, 3, 4]);
				Arr.remove(null!, 2); // no crash
			});
		test("RemoveOneByFn removes correct element",
			() => {
				const arr = [1, 2, 3, 4];
				Arr.removeOneByFn(arr, (el) => el > 2);
				expect(arr).toEqual([1, 2, 4]);
				Arr.removeOneByFn(null!, (el) => el as any > 2); // no crash
			});
		test("Reverse reverses the array",
			() => {
				const arr = [1, 2, 3, 4];
				Arr.reverse(arr);
				expect(arr).toEqual([4, 3, 2, 1]);
			});
		test("ShallowCopyInto copys correctly and keeps references",
			() => {
				const copy = [1, 2, 3, 4];
				Arr.shallowCopyInto(arr2, copy);
				expect(copy).toEqual(arr2);
				expect(copy[1]).toBe(arr2[1]);
				Arr.shallowCopyInto(null!, copy);
				expect(copy).toEqual([]);
			});
		test("ShallowFill works like ShallowCopyInto but at a position",
			() => {
				const copy = [1, 2, 3, 4];
				Arr.shallowFill(arr3, copy as any, 2);
				expect(copy).toEqual([1, 2, {a: 1}, {a: 2}]);
				expect(copy[2]).toBe(arr3[0]);
				Arr.shallowFill([5, 6, 7, 8, 9], copy, 0);
				expect(copy[4]).toBe(9);
				Arr.shallowFill(null!, copy, 0);
				expect(copy.length).toBe(5);
			});
		test("ForSome works like Filtered ForEach",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				Arr.forSome(arr1 as number[], (el, i) => i > 1, (el, i) => arrEl.push(el));
				Arr.forSome(arr1 as number[], (el, i) => i > 1, (el, i) => arri.push(i));
				expect(arrEl).toEqual([7, 2]);
				expect(arri).toEqual([2, 3]);
				Arr.forSome(null! as number[], (el, i) => i > 1, (el, i) => arri.push(i));
				expect(arri).toEqual([2, 3]);
			});
		test("Until work like ForEach where returning true breaks the loop",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				const arrEl2 = new Array<number>();
				const arri2 = new Array<number>();
				Arr.until(arr1 as number[], (el, i) => i >= 2, (el, i) => arrEl.push(el) );
				Arr.until(arr1 as number[], (el, i) => i >= 2, (el, i) => arri.push(i) );
				expect(arrEl).toEqual([1, 4]);
				expect(arri).toEqual([0, 1]);
				Arr.until(arr1 as number[], (el, i) => (arrEl2.push(el), i >= 2) );
				Arr.until(arr1 as number[], (el, i) => (arri2.push(i), i >= 2) );
				expect(arrEl2).toEqual([1, 4, 7]);
				expect(arri2).toEqual([0, 1, 2]);
				Arr.until(null! as number[], (el, i) => (arri2.push(i), i >= 2) );
				expect(arri2).toEqual([0, 1, 2]);
			});
		test("Until with startIndex work like ForEach with startIndex where returning true breaks the loop",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				const arrEl2 = new Array<number>();
				const arri2 = new Array<number>();
				const arrEl3 = new Array<number>();
				Arr.until(arr1 as number[], (el, i) => i >= 2, (el, i) => arrEl.push(el), 1 );
				Arr.until(arr1 as number[], (el, i) => i >= 2, (el, i) => arri.push(i), 1 );
				expect(arrEl).toEqual([4]);
				expect(arri).toEqual([1]);
				Arr.until(arr1 as number[], (el, i) => (arrEl2.push(el), i >= 2), 1 );
				Arr.until(arr1 as number[], (el, i) => (arri2.push(i), i >= 2), 1 );
				expect(arrEl2).toEqual([4, 7]);
				expect(arri2).toEqual([1, 2]);
				Arr.until(arr1 as number[], (el, i) => (arrEl3.push(el), i >= 2), 42);
				expect(arrEl3).toEqual([]);
			});
		test("ReverseUntil work like ReverseForEach where returning true breaks the loop",
			() => {
				const arrEl = new Array<number>();
				const arri = new Array<number>();
				const arrEl2 = new Array<number>();
				const arri2 = new Array<number>();
				Arr.reverseUntil(arr1 as number[], (el, i) => i === 1, (el, i) => arrEl.push(el) );
				Arr.reverseUntil(arr1 as number[], (el, i) => i === 1, (el, i) => arri.push(i) );
				expect(arrEl).toEqual([2, 7]);
				expect(arri).toEqual([3, 2]);
				Arr.reverseUntil(arr1 as number[], (el, i) => (arrEl2.push(el), i === 1) );
				Arr.reverseUntil(arr1 as number[], (el, i) => (arri2.push(i), i === 1) );
				expect(arrEl2).toEqual([2, 7, 4]);
				expect(arri2).toEqual([3, 2, 1]);
				Arr.reverseUntil(null! as number[], (el, i) => (arri2.push(i), i === 1) );
				expect(arri2).toEqual([3, 2, 1]);
			});
		test("InsertAt inserts an element at a position",
			() => {
				const arr = [1, 2, 3, 4];
				Arr.insertAt(arr, 2, 42);
				expect(arr).toEqual([1, 2, 42, 3, 4]);
				Arr.insertAt(arr, 0, 7);
				expect(arr).toEqual([7, 1, 2, 42, 3, 4]);
				try {
					Arr.insertAt(null!, 0, 7);
				} catch (err) {
					expect((err as Error).message.indexOf("Unable to insertAt")).toBe(0);
				}
			});
		test("BinarySearch should return correct index or -1",
			() => {
				const arr = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
				let i1 = Arr.binarySearch(arr, (el) => el.a - 2);
				expect(i1).toBe(1);
				let i2 = Arr.binarySearch(arr, (el) => el.a - 5);
				expect(i2).toBe(-1);
				expect(Arr.binarySearch(null!, (el) => 1)).toBe(-1);
			});
		test("Create creates an array of a given length and populates it using a function",
			() => {
				let arr = Arr.create<number>(10, (i, arr) => i! < 2 ? 1 : arr![i! - 2] + arr![i! - 1]);
				expect(arr).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
				let arr2 = Arr.create<number>(-10, (i, arr) => i! < 2 ? 1 : arr![i! - 2] + arr![i! - 1]);
				expect(arr2).toEqual([]);
			});
		test("Some is true if any element is true",
		() => {
			const arr = [1, 2, 3, 4];
			expect(arr.some((el) => el === 3)).toBe(true);
			expect(arr.some((el) => el === 5)).toBe(false);
		});
		test("All is true if all elements are true",
		() => {
			const arr = [1, 2, 3, 4];
			expect(Arr.all(arr, (el) => el > 0)).toBe(true);
			expect(Arr.all(arr, (el) => el < 4)).toBe(false);
			expect(Arr.all(null!, (el) => el as any < 4)).toBe(true);
		});
		test("Zip zips 2 arrays",
		() => {
			expect(Arr.zip([1, 2, 3], ["a", "b", "c"])).toEqual([[1, "a"], [2, "b"], [3, "c"]]);
			expect(Arr.zip<number, string, string>([1, 2, 3], ["a", "b", "c"], (i, a, b) => b.toString().repeat(a!) ))
			.toEqual([ "a", "bb", "ccc" ]);
		});
		test("Zip zips 3 arrays",
		() => {
			expect(Arr.zip([1, 2, 3], ["a", "b", "c"], [1, 2, 3], (i,a,b,c) => [a,b,c])).toEqual([[1, "a", 1], [2, "b", 2], [3, "c", 3]]);
			expect(Arr.zip<number, string, number, string>([1, 2, 3], ["a", "b", "c"], [1, 2, 3], (i, a, b, c) => b.toString().repeat(a!) + (c!) ))
			.toEqual([ "a1", "bb2", "ccc3" ]);
		});
		test("Zip zips 4 arrays",
		() => {
			expect(Arr.zip([1, 2, 3], ["a", "b", "c"], [1, 2, 3], [1, 2, 3], (i,a,b,c,d) => [a,b,c,d])).toEqual([[1, "a", 1, 1], [2, "b", 2, 2], [3, "c", 3, 3]]);
			expect(Arr.zip<number, string, number, number, string>([1, 2, 3], ["a", "b", "c"], [1, 2, 3], [1, 2, 3], (i, a, b, c, d) => b.toString().repeat(a!) + (c! + d!) ))
			.toEqual([ "a2", "bb4", "ccc6" ]);
		});
		test("Unzip unzips 1 array to a tuple of 2 arrays",
		() => {
			expect(Arr.unzip<number, string>([[1, "a"], [2, "b"], [3, "c"]])).toEqual([ [1, 2, 3], ["a", "b", "c"] ]);
			expect(Arr.unzip<number, string, string>(["f", "fo", "foo"], (u, i, out) => [u.length, u]))
			.toEqual([ [1, 2, 3], ["f", "fo", "foo"] ]);
		});
		test("pivot an array of int arrays and string arrays gives an array of int string arrays",
		() => {
			const org = [[1, 2, 3], ["a", "b", "c"]];
			let pivoted = Arr.pivot(org);
			expect(pivoted[0][0]).toBe(1);
			expect(pivoted[0][1]).toBe("a");
			expect(pivoted.length).toBe(3);
			expect(pivoted[0].length).toBe(2);
			let original = Arr.pivot(pivoted) as Array<number[] | string[]>;
			expect(original).toEqual(org);
		});
		test("Deserialize revives T[]",
		() => {
			class Revivable {
				public foo: number;
				public deserialize(data: number): Revivable {
					this.foo = data + 1;
					return this;
				}
			}
			const list1 = new Array<number>();
			const list2 = new Array<Revivable>();
			const list3 = new Array<Vec2>();
			Arr.deserialize([1, 2, 3, 4], list1);
			expect(JSON.stringify(list1)).toBe("[1,2,3,4]");
			Arr.deserialize([1, 2, 3, 4], list2, Revivable);
			expect(JSON.stringify(list2)).toBe('[{"foo":2},{"foo":3},{"foo":4},{"foo":5}]');
			Arr.deserialize([{x:1, y:1}, {x:2, y:2}], list3, Vec2);
			expect(JSON.stringify(list3)).toBe('[{"x":1,"y":1},{"x":2,"y":2}]');
		});
		test("Split array into buckets work",
		() => {
			let [a, b, c] = Arr.bucket([1,2,3,4,5], (el) => el % 3 === 0, (el) => el % 2 === 0);
			expect(a).toEqual([3]);
			expect(b).toEqual([2,4]);
			expect(c).toEqual([1,5]);
		});
		test("Split() splits into 2 buckets",
		() => {
			let [a, b] = Arr.split([1,2,3,4,5], (el) => el % 2 === 1);
			expect(a).toEqual([1,3,5]);
			expect(b).toEqual([2,4]);
		});
		test("distinct() without hash removes duplicates",
		() => {
			expect(Arr.distinct([1,2,3,2,1,5,null,undefined,{}])).toEqual([1,2,3,5,null,undefined,{}]);
			expect(Arr.distinct([{a:2, b:[1,2]}, {a:3, b:[1,2]}, {a:2, b:[1,3]}, {a:2, b:[1,2]}, {a:2}, {a:2}, {a:2, b:null}, {a:2, b:null}]))
			.toEqual([{a:2, b:[1,2]}, {a:3, b:[1,2]}, {a:2, b:[1,3]}, {a:2}, {a:2, b:null}]);
		});
		test("distinct() with hash removes duplicates",
		() => {
			expect(Arr.distinct([1,2,3,2,1,5], (el) => el > 3 ? "3" : el.toString())).toEqual([1,2,3]);
			expect(Arr.distinct([{a:2, b:[1,2]}, {a:3, b:[1,2]}, {a:2, b:[1,3]}, {a:2, b:[1,2]}, {a:2}, {a:2}, {a:2, b:null}, {a:2, b:null}], (el) => el.a.toString()))
			.toEqual([{a:2, b:[1,2]}, {a:3, b:[1,2]}]);
		});
		test("toLookup creates loopup from array",
		() => {
			expect(Arr.toLookup([1,2,3,2,1,5,null,undefined,{}]))
			.toEqual({'1':true,'2':true,'3':true,'5':true,'____null':true,'____undefined':true,'{}':true});
		});
		test("difference returns 2 arrays with the missing values from a and b",
		() => {
			expect(Arr.difference([1,2,3], [2,4])).toEqual([[1,3], [4]]);
		});
		test("intersect returns the array intersection of a and b",
		() => {
			expect(Arr.intersect([1,2,3], [2,3,4])).toEqual([2,3]);
		});
		test("union joins two arrays and returns the distinct array",
		() => {
			expect(Arr.union([1,2,3], [2,3,4])).toEqual([1,2,3,4]);
		});
		test("subtract removes elements in b from array a",
		() => {
			expect(Arr.subtract([1,2,3,5], [2,3,4])).toEqual([1,5]);
		});
});
