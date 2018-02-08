// import { shallowCopy } from "./Arr";

class Sedgewick {
	private _cmp: (a: string, b: string) => number = (a: string, b: string) => a < b ? -1 : a === b ? 0 : 1;

	// private charOrNull(s: string, pos: number): string | null {
	// 	return pos >= s.length ? null : s[pos];
	// }

	constructor(comparer?: (a: string, b: string) => number) {
		if (comparer !== undefined) {
			this._cmp = comparer;
		}
	}

	private medianOf3(x: string[], a: number, b: number, c: number, depth: number): number {
		let va = x[a][depth], vb = x[b][depth], vc = x[c][depth];

		if (va === vb) {
			return a;
		}
		if (va === vc || vb === vc) {
			return c;
		}
		let ab: number = this._cmp(va, vb);
		let bc: number = this._cmp(vb, vc);

		return ab < 0 ?
			(bc < 0 ? b : this._cmp(va, vc) < 0 ? c : a)
			: (bc > 0 ? b : this._cmp(va, vc) < 0 ? a : c);
	}

	//Pathological case is: strings with long common prefixes will
	//          cause long running times
	private insertionSort(x: string[], a: number, n: number, depth: number): void {
		let pi: number = 0;
		let pj: number = 0;
		for (pi = a + 1; --n > 0; pi++) {
			for (pj = pi; pj > a; pj--) {
				let s: string = x[pj - 1];
				let t: string = x[pj];
				let d: number = depth;

				let s_len: number = s.length;
				let t_len: number = t.length;
				while (d < s_len && d < t_len && this._cmp(s[d], t[d]) === 0) { ++d; }
				if (d === s_len || (d < t_len && this._cmp(s[d], t[d]) <= 0)) {
					break;
				}
				let pj1: number = pj - 1;
				let tmp: string = x[pj]; x[pj] = x[pj1]; x[pj1] = tmp;
			}
		}
	}

	private vecswap(x: string[], a: number, b: number, n: number): void {

		while (n-- > 0) {
			let t: string = x[a];
			x[a++] = x[b];
			x[b++] = t;
		}
	}

	public sort(input: string[]): string[] {
		let copy: string[] = input.slice(); //shallowCopy(input);
		this.inPlaceSort(copy, 0, copy.length, 0);
		return copy;
	}

	private inPlaceSort(x: string[], a: number, n: number, depth: number): void {
		let partval: string;
		let d: number, r;
		let pa: number;
		let pb: number;
		let pc: number;
		let pd: number;
		let pl: number;
		let pm: number;
		let pn: number;
		let t: string;
		if (n < 10) {
			this.insertionSort(x, a, n, depth);
			return;
		}
		pl = a;
		pm = a + (n / 2) | 0;
		pn = a + (n - 1);
		if (n > 30) {
			// On big arrays, pseudomedian of 9
			d = (n / 8) | 0;
			pl = this.medianOf3(x, pl, pl + d, pl + 2 * d, depth);
			pm = this.medianOf3(x, pm - d, pm, pm + d, depth);
			pn = this.medianOf3(x, pn - 2 * d, pn - d, pn, depth);
		}
		pm = this.medianOf3(x, pl, pm, pn, depth);

		{ t = x[a]; x[a] = x[pm]; x[pm] = t; }

		pa = pb = a + 1;
		pc = pd = a + n - 1;

		partval = x[a][depth];
		let len: number = x[a].length;
		let empty: boolean = (len === depth);

		for (; ;) {
			while (pb <= pc && (r = (empty ? (x[pb].length - depth) : ((depth === x[pb].length) ? -1 : (this._cmp(x[pb][depth], partval))))) <= 0) {
				if (r === 0) {
					//swap(pa, pb);
					{ t = x[pa]; x[pa] = x[pb]; x[pb] = t; }
					++pa;
				}
				++pb;
			}
			while (pb <= pc && (r = (empty ? (x[pc].length - depth) : ((depth === x[pc].length) ? -1 : (this._cmp(x[pc][depth], partval))))) >= 0) {
				if (r === 0) {   //swap(pc, pd); 
					{ t = x[pc]; x[pc] = x[pd]; x[pd] = t; }
					--pd;
				}
				--pc;
			}
			if (pb > pc) {
				break;
			}

			//swap(pb, pc);
			{ t = x[pb]; x[pb] = x[pc]; x[pc] = t; }
			++pb;
			--pc;
		}

		pn = a + n;
		if (pa - a < pb - pa) {
			r = (pa - a);
		} else {
			r = (pb - pa);
		}

		//swapping pointers to strings
		this.vecswap(x, a, pb - r, r);
		if (pd - pc < pn - pd - 1) { r = pd - pc; } else { r = pn - pd - 1; }
		this.vecswap(x, pb, pn - r, r);
		r = pb - pa;
		if (pa - a + pn - pd - 1 > 1 && x[a + r].length > depth) { //by definition x[a + r] has at least one element
			this.inPlaceSort(x, a + r, pa - a + pn - pd - 1, depth + 1);
		}
		if (r > 1) {
			this.inPlaceSort(x, a, r, depth);
		}
		if ((r = pd - pc) > 1) {
			this.inPlaceSort(x, a + n - r, r, depth);
		}
	}
}
