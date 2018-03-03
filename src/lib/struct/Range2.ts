import * as Calc from "../Calc";
import { IRange2 } from "./IRange2";
import { IVec2 } from "./IVec2";
import { Rect } from "./Rect";
import { Vec2 } from "./Vec2";

export class Range2 implements IRange2 {
	public pos: Vec2;
	public size: Vec2;

	public get isZero(): boolean {
		return this.pos.isZero && this.size.isZero;
	}
	constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
		this.pos = new Vec2(x, y);
		this.size = new Vec2(w, h);
	}
	protected create(x: number = 0, y: number = 0, w: number = 0, h: number = 0): Range2 {
		return new ((this as any).constructor)(x, y, w, h);
	}
	public set(src: IRange2): Range2 {
		this.pos.set(src.pos);
		this.size.set(src.size);
		return this;
	}
	public clone(out?: Range2): Range2 {
		const result = out ? out.set(this) : this.create(this.pos.x, this.pos.y, this.size.x, this.size.y);
		return result;
	}
	public fromRect(rect: IRect): Range2 {
		let start = rect.start;
		let stop = rect.stop;
		this.pos.x = start.x;
		this.pos.y = start.y;
		this.size.x = stop.x + (rect.endInclusive ? (stop.x < start.x ? -1 : 1) : 0) - start.x;
		this.size.y = stop.y + (rect.endInclusive ? (stop.y < start.y ? -1 : 1) : 0) - start.y;
		return this;
	}
	public scale(factor: IVec2, keepCenter: boolean = true): Range2 {
		let org: Vec2 | null = null;
		if (keepCenter) {
			org = this.size.clone();
		}
		this.size.scale(factor);
		if (keepCenter) {
			this.pos.add(org!.subtract(this.size).multiply(0.5));
		}
		return this;
	}
	public translate(system: IVec2): Range2 {
		this.pos.add(system);
		return this;
	}
	public toInt(): Range2 {
		this.pos.toInt();
		this.size.toInt();
		return this;
	}
	public toDecimal(): Range2 {
		this.pos.toDecimal();
		this.size.toDecimal();
		return this;
	}
	public contains(target: Range2): boolean {
		return this.pos.x <= target.pos.x &&
			this.pos.y <= target.pos.y &&
			this.pos.x + this.size.x >= target.pos.x + target.size.x &&
			this.pos.y + this.size.y >= target.pos.y + target.size.y;
	}
	public containsPoint(vec: IVec2) {
		return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
			&& vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
	}
	public first(fn: (p: Vec2) => boolean): Vec2 | null {
		const p: Vec2 = new Vec2();
		const x = this.pos.x;
		const y = this.pos.y;
		for (let i = 0; i < this.size.x; i++) {
			for (let j = 0; j < this.size.y; j++) {
				p.x = i + x, p.y = j + y;
				if (fn(p)) {
					return p;
				}
			}
		}
		return null;
	}
	public forEach(fn: (p: Vec2) => boolean, start: Vec2 | null = null): void {
		const pos: Vec2 = new Vec2();
		const begin = this.pos.clone().toInt();
		if (start === null || !this.containsPoint(start)) {
			start = begin;
		}
		const end: Vec2 = this.pos.clone().add(this.size).toInt();
		for (let y = begin.y; y < end.y; y += 1) {
			for (let x = begin.x; x < end.x; x += 1) {
				if (y < start.y || (y === start.y && x < start.x)) {
					continue;
				}
				pos.x = x;
				pos.y = y;
				const brk = fn(pos);
				if (brk) {
					return;
				}
			}
		}
	}
	public equals(range: IRange2): boolean {
		return this.pos.equals(range.pos) && this.size.equals(range.size);
	}
	public zero(): Range2 {
		this.pos.zero();
		this.size.zero();
		return this;
	}
}
