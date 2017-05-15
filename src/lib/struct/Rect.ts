import { Calc } from "../Calc";
import { Range2 } from "./Range2";
import { Vec2 } from "./Vec2";

const Sign = Calc.Sign;

export class Rect {
	public start: Vec2;
	public stop: Vec2;
	public endInclusive: boolean;

	constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0, endInclusive: boolean = false) {
		this.start = new Vec2(x1, y1);
		this.stop = new Vec2(x2, y2);
		this.endInclusive = endInclusive;
	}
	public Set(src: Rect): Rect {
		this.start.Set(src.start);
		this.stop.Set(src.stop);
		return this;
	}
	public Clone(out?: Rect): Rect {
		const result = out ? out.Set(this) : new Rect(this.start.x, this.start.y, this.stop.x, this.stop.y);
		return result;
	}
	public ToRange2(): Range2 {
		return new Range2(
			this.start.x,
			this.start.y,
			this.stop.x + (this.endInclusive ? Calc.Sign(this.stop.x) : 0) - this.start.x,
			this.stop.y + (this.endInclusive ? Calc.Sign(this.stop.y) : 0) - this.start.y);
	}
	public Scale(factor: Vec2, keepCenter: boolean = true): Rect {
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
	public Translate(system: Vec2): Rect {
		this.start.Scale(system);
		this.stop.Scale(system);
		return this;
	}
	public Equals(rect: Rect): boolean {
		return this.start.Equals(rect.start) && this.stop.Equals(rect.stop);
	}
	public ToInt(): Rect {
		this.start.ToInt();
		this.stop.ToInt();
		return this;
	}
	public ToDecimal(): Rect {
		this.start.ToDecimal();
		this.stop.ToDecimal();
		return this;
	}
	public Area(): number {
		const x = this.stop.x - this.start.x;
		const y = this.stop.y - this.start.y;
		return x * y;
	}
	public Move(vec: Vec2): Rect {
		this.start.Add(vec);
		this.stop.Add(vec);
		return this;
	}
}
