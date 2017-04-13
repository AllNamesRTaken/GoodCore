import { Calc } from "../Calc"

export default class Vec2 {
    x: number;
    y: number;

    static EPSILON: number = 1e-8;
    static IDENTITY: Vec2 = new Vec2(1, 1);
    static X_DIM: Vec2 = new Vec2(1, 0);
    static Y_DIM: Vec2 = new Vec2(0, 1);

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    public Set(src: Vec2): Vec2 {
        this.x = src.x;
        this.y = src.y;
        return this;
    }
    public Clone(out?: Vec2): Vec2 {
        let result = out ? out.Set(this) : new Vec2(this.x, this.y);
        return result;
    }
    public ToInt(): Vec2 {
        this.x |= 0;
        this.y |= 0;
        return this;
    }
    public Ceil(): Vec2 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    public ToDecimal(): Vec2 {
        this.x += Vec2.EPSILON;
        this.y += Vec2.EPSILON;
        return this;
    }
    public LengthSq(): number { return (this.x * this.x + this.y * this.y); }

    public Length(): number { return Math.sqrt(this.LengthSq()); }

    public HorizontalAngle(): number { return Math.atan2(this.y, this.x); }

    public Rotate(angle: number): Vec2 {
        let rot = Calc.RotationRad(angle);
        let nx = (this.x * rot[0]) - (this.y * rot[1]);
        let ny = (this.x * rot[1]) + (this.y * rot[0]);

        this.x = nx;
        this.y = ny;

        return this;
    }

    public RotateAround(center: Vec2, angle: number): Vec2 {
        return this.Subtract(center).Rotate(angle).Add(center);
    }
    public Normalize(): Vec2 {
        let len = this.Length();

        if (len === 0) {
            this.x = 1;
            this.y = 0;
        } else {
            this.x = this.x / len;
            this.y = this.y / len;
        }
        return this;
    }

    public Scale(vectorB: Vec2): Vec2 {
        this.x = this.x * vectorB.x;
        this.y = this.y * vectorB.y;
        return this;
    }

    public Relate(vectorB: Vec2): Vec2 {
        this.x = this.x / vectorB.x;
        this.y = this.y / vectorB.y;
        return this;
    }

    public Multiply(scalar: number): Vec2 {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    }

    public Add(vectorB: Vec2): Vec2 {
        this.x = this.x + vectorB.x;
        this.y = this.y + vectorB.y;
        return this;
    }

    public Subtract(vectorB: Vec2): Vec2 {
        this.x = this.x - vectorB.x;
        this.y = this.y - vectorB.y;
        return this;
    }

    public Invert() {
        this.x = -this.x;
        this.y = -this.y;
    }

    public Equals(target: Vec2): boolean {
        return this.x === target.x && this.y === target.y;
    }
    public AlmostEquals(target: Vec2): boolean {
        return Math.abs(this.x - target.x) < Vec2.EPSILON && Math.abs(this.y - target.y) < Vec2.EPSILON;
    }

    public GetNormal(isNormalized?: boolean): Vec2 {
        let result = this.Clone();
        if (!isNormalized) {
            result.Set(this).Normalize();
        }
        let temp = result.x;
        result.x = result.y;
        result.y = -temp;
        return result;
    }

    public Dot(vectorB: Vec2): number { return (this.x * vectorB.x + this.y * vectorB.y) }

    public Cross(vectorB: Vec2): number { return ((this.x * vectorB.y) - (this.y * vectorB.x)) }

    public ProjectOnto(vectorB: Vec2): Vec2 {
        let coeff = ((this.x * vectorB.x) + (this.y * vectorB.y)) / ((vectorB.x * vectorB.x) + (vectorB.y * vectorB.y));
        this.x = coeff * vectorB.x;
        this.y = coeff * vectorB.y;
        return this;
    }

    public VerticalAngle(): number { return Math.atan2(this.x, this.y) }

    public Angle = this.HorizontalAngle;
    public Direction = this.HorizontalAngle;

    public RotateBy(rotation: number): Vec2 {
        let angle = -this.HorizontalAngle() + rotation;

        return this.Rotate(angle);
    }
}
