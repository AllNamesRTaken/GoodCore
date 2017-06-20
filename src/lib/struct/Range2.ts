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
	public set(src: IRange2): Range2 {
		this.pos.set(src.pos);
		this.size.set(src.size);
		return this;
	}
	public clone(out?: Range2): Range2 {
		const result = out ? out.set(this) : new Range2(this.pos.x, this.pos.y, this.size.x, this.size.y);
		return result;
	}
	public toRect(endInclusive: boolean = false, out?: Rect): Rect {
		let result = out || new Rect();
		result.start.x = this.pos.x,
		result.start.y = this.pos.y,
		result.stop.x = this.pos.x - (endInclusive ? (this.size.x < 0 ? -1 : 1) : 0) + this.size.x,
		result.stop.y = this.pos.y - (endInclusive ? (this.size.y < 0 ? -1 : 1) : 0) + this.size.y,
		result.endInclusive = endInclusive;
		return result;
	}
	public scale(factor: IVec2, keepCenter: boolean = true): Range2 {
		let org: Vec2;
		if (keepCenter) {
			org = this.size.clone();
		}
		this.size.scale(factor);
		if (keepCenter) {
			this.pos.add(org.subtract(this.size).multiply(0.5));
		}
		return this;
	}
	public translate(system: IVec2): Range2 {
		this.toRect(false).translate(system).toRange2(this);
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
	public intersect(target: Range2): boolean {
		let s = this.toRect();
		let t = target.clone().toRect();
		return s.intersect(t);
	}
	public containsPoint(vec: IVec2) {
		return vec.x >= this.pos.x && vec.x <= this.pos.x + this.size.x - 1
			&& vec.y >= this.pos.y && vec.y <= this.pos.y + this.size.y - 1;
	}
	public first(fn: (p: Vec2) => boolean): Vec2 {
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
	public forEach(fn: (p: Vec2) => boolean, start: Vec2 = null): void {
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
