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
	public set(src: IRect): Rect {
		this.start.set(src.start);
		this.stop.set(src.stop);
		return this;
	}
	public clone(out?: Rect): Rect {
		const result = out ? out.set(this) : new Rect(this.start.x, this.start.y, this.stop.x, this.stop.y);
		return result;
	}
	public toRange2(out?: Range2): Range2 {
		let result = out || new Range2();
		let start = this.start;
		let stop = this.stop;
		result.pos.x = start.x;
		result.pos.y = start.y;
		result.size.x = stop.x + (this.endInclusive ? (stop.x < start.x ? -1 : 1) : 0) - start.x;
		result.size.y = stop.y + (this.endInclusive ? (stop.y < start.y ? -1 : 1) : 0) - start.y;
		return result;
	}
	public scale(factor: IVec2, keepCenter: boolean = true): Rect {
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
	public translate(system: IVec2): Rect {
		this.start.scale(system);
		this.stop.scale(system);
		return this;
	}
	public equals(rect: IRect): boolean {
		return this.start.equals(rect.start) && this.stop.equals(rect.stop);
	}
	public toInt(): Rect {
		this.start.toInt();
		this.stop.toInt();
		return this;
	}
	public toDecimal(): Rect {
		this.start.toDecimal();
		this.stop.toDecimal();
		return this;
	}
	public area(): number {
		const x = this.stop.x - this.start.x;
		const y = this.stop.y - this.start.y;
		return x * y;
	}
	public move(vec: IVec2): Rect {
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
	public zero(): Rect {
		this.start.zero();
		this.stop.zero();
		return this;
	}
}
