import { rotationRad } from "../Calc";
import { IVec2 } from "./IVec2";

export class Vec2Const {
	public static EPSILON: number = 1e-8;
	public static IDENTITY: IVec2 = {x: 1, y: 1};
	public static X_DIM: IVec2 = {x: 1, y: 0};
	public static Y_DIM: IVec2 = {x: 0, y: 1};
}
export class Vec2 implements IVec2 {
	public x: number;
	public y: number;

	public get isZero(): boolean {
		return this.x === 0 && this.y === 0;
	}
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}
	protected create(x: number = 0, y: number = 0): Vec2 {
		return new ((this as any).constructor)(x, y);
	}
	public set(src: IVec2): Vec2 {
		this.x = src.x;
		this.y = src.y;
		return this;
	}
	public clone(out?: Vec2): Vec2 {
		const result = out ? out.set(this) :this.create(this.x, this.y);
		return result;
	}
	public toInt(): Vec2 {
		this.x |= 0;
		this.y |= 0;
		return this;
	}
	public ceil(): Vec2 {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}
	public toDecimal(): Vec2 {
		this.x += Vec2Const.EPSILON;
		this.y += Vec2Const.EPSILON;
		return this;
	}
	public lengthSq(): number { return (this.x * this.x + this.y * this.y); }

	public length(): number { return Math.sqrt(this.lengthSq()); }

	public horizontalAngle(): number { return Math.atan2(this.y, this.x); }

	public rotate(angle: number): Vec2 {
		const rot = rotationRad(angle);
		const nx = (this.x * rot[0]) - (this.y * rot[1]);
		const ny = (this.x * rot[1]) + (this.y * rot[0]);

		this.x = nx;
		this.y = ny;

		return this;
	}

	public rotateAround(center: IVec2, angle: number): Vec2 {
		return this.subtract(center).rotate(angle).add(center);
	}
	public normalize(): Vec2 {
		const len = this.length();

		if (len === 0) {
			this.x = 1;
			this.y = 0;
		} else {
			this.x = this.x / len;
			this.y = this.y / len;
		}
		return this;
	}

	public scale(vectorB: IVec2): Vec2 {
		this.x = this.x * vectorB.x;
		this.y = this.y * vectorB.y;
		return this;
	}

	public relate(vectorB: IVec2): Vec2 {
		this.x = this.x / vectorB.x;
		this.y = this.y / vectorB.y;
		return this;
	}

	public multiply(scalar: number): Vec2 {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
		return this;
	}

	public add(vectorB: IVec2): Vec2 {
		this.x = this.x + vectorB.x;
		this.y = this.y + vectorB.y;
		return this;
	}

	public subtract(vectorB: IVec2): Vec2 {
		this.x = this.x - vectorB.x;
		this.y = this.y - vectorB.y;
		return this;
	}

	public invert() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	public equals(target: IVec2): boolean {
		return this.x === target.x && this.y === target.y;
	}
	public almostEquals(target: IVec2): boolean {
		return Math.abs(this.x - target.x) < Vec2Const.EPSILON && Math.abs(this.y - target.y) < Vec2Const.EPSILON;
	}

	public getNormal(isNormalized?: boolean): Vec2 {
		const result = this.clone();
		if (!isNormalized) {
			result.set(this).normalize();
		}
		const temp = result.x;
		result.x = result.y;
		result.y = -temp;
		return result;
	}

	public dot(vectorB: IVec2): number { return (this.x * vectorB.x + this.y * vectorB.y); }

	public cross(vectorB: IVec2): number { return ((this.x * vectorB.y) - (this.y * vectorB.x)); }

	public projectOnto(vectorB: IVec2): Vec2 {
		const coeff = ((this.x * vectorB.x) + (this.y * vectorB.y)) / ((vectorB.x * vectorB.x) + (vectorB.y * vectorB.y));
		this.x = coeff * vectorB.x;
		this.y = coeff * vectorB.y;
		return this;
	}

	public verticalAngle(): number { return Math.atan2(this.x, this.y); }

	public angle = this.horizontalAngle;
	public direction = this.horizontalAngle;

	public rotateBy(rotation: number): Vec2 {
		const angle = -this.horizontalAngle() + rotation;

		return this.rotate(angle);
	}
	public max(v: IVec2): Vec2 {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		return this;
	}
	public min(v: IVec2): Vec2 {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		return this;
	}
	public zero(): Vec2 {
		this.x = 0;
		this.y = 0;
		return this;
	}
}
