import * as Calc from "../Calc";
import { IRect } from "./IRect";
import { IVec2 } from "./IVec2";
import { Range2 } from "./Range2";
import { Vec2 } from "./Vec2";

export class Rect implements IRect {
	public start: Vec2;
	public stop: Vec2;
	public endInclusive: boolean;

	public get isZero(): boolean {
		return this.start.isZero && this.stop.isZero;
	}
	constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0, endInclusive: boolean = false) {
		this.start = new Vec2(x1, y1);
		this.stop = new Vec2(x2, y2);
		this.endInclusive = endInclusive;
	}
	protected create(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0, endInclusive: boolean = false): this {
		return new ((this as any).constructor)(x1, y1, x2, y2, endInclusive);
	}
	public set(src: IRect): this {
		this.start.set(src.start);
		this.stop.set(src.stop);
		return this;
	}
	public clone(out?: this): this {
		const result = out ? out.set(this) : this.create(this.start.x, this.start.y, this.stop.x, this.stop.y);
		return result;
	}
	public fromRange2(range: IRange2, endInclusive: boolean = false): this {
		this.start.x = range.pos.x,
		this.start.y = range.pos.y,
		this.stop.x = range.pos.x - (endInclusive ? (range.size.x < 0 ? -1 : 1) : 0) + range.size.x,
		this.stop.y = range.pos.y - (endInclusive ? (range.size.y < 0 ? -1 : 1) : 0) + range.size.y,
		this.endInclusive = endInclusive;
		return this;
	}
	public scale(factor: IVec2, keepCenter: boolean = true): this {
		const ow = this.stop.x - this.start.x;
		const oh = this.stop.y - this.start.y;
		let w = ow;
		let h = oh;
		w *= factor.x;
		h *= factor.y;
		if (keepCenter) {
			this.start.x -= (w - ow) / 2;
			this.start.y -= (h - oh) / 2;
		}
		this.stop.x = this.start.x + w;
		this.stop.y = this.start.y + h;
		return this;
	}
	public translate(system: IVec2): this {
		this.start.scale(system);
		this.stop.scale(system);
		return this;
	}
	public equals(rect: IRect): boolean {
		return this.start.equals(rect.start) && this.stop.equals(rect.stop);
	}
	public toInt(): this {
		this.start.toInt();
		this.stop.toInt();
		return this;
	}
	public toDecimal(): this {
		this.start.toDecimal();
		this.stop.toDecimal();
		return this;
	}
	public area(): number {
		const x = this.stop.x - this.start.x;
		const y = this.stop.y - this.start.y;
		return x * y;
	}
	public move(vec: IVec2): this {
		this.start.add(vec);
		this.stop.add(vec);
		return this;
	}
	public contains(target: IRect): boolean {
		return this.start.x <= target.start.x &&
			this.start.y <= target.start.y &&
			this.stop.x >= target.stop.x &&
			this.stop.y >= target.stop.y;
	}
	public intersect(target: IRect): boolean {
		return this.containsPoint(target.start.x, target.start.y) ||
			this.containsPoint(target.stop.x, target.stop.y) ||
			this.containsPoint(target.start.x, target.stop.y) ||
			this.containsPoint(target.stop.x, target.start.y);
	}
	public containsPoint(x: number, y: number): boolean {
		return this.start.x <= x && this.stop.x >= x &&
			this.start.y <= y && this.stop.y >= y; 
	}
	public zero(): this {
		this.start.zero();
		this.stop.zero();
		return this;
	}
}
