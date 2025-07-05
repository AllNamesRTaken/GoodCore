import { IRange2 } from "../../@types/IRange2.js";
import { IVec2 } from "../../@types/IVec2.js";
import { Vec2 } from "./Vec2.js";
import { once } from "../Util.js";
import type { IRect } from "../../@types/index.js";

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
  protected create(
    x: number = 0,
    y: number = 0,
    w: number = 0,
    h: number = 0,
  ): this {
    return new (this as any).constructor(x, y, w, h);
  }
  // tslint:disable-next-line:no-reserved-keywords
  public set(src: IRange2): this {
    once(() => {
      console.warn(
        "Function Range2::set is deprecated please use Range2::copy instead. get is a reserved word.",
      );
    });
    return this.copy(src);
  }
  public copy(src: IRange2): this {
    this.pos.copy(src.pos);
    this.size.copy(src.size);
    return this;
  }
  public clone(out?: this): this {
    const result = out
      ? out.copy(this)
      : this.create(this.pos.x, this.pos.y, this.size.x, this.size.y);
    return result;
  }
  public fromRect(rect: IRect): this {
    let start = rect.start;
    let stop = rect.stop;
    this.pos.x = start.x;
    this.pos.y = start.y;
    this.size.x =
      stop.x + (rect.endInclusive ? (stop.x < start.x ? -1 : 1) : 0) - start.x;
    this.size.y =
      stop.y + (rect.endInclusive ? (stop.y < start.y ? -1 : 1) : 0) - start.y;
    return this;
  }
  public scale(factor: IVec2, keepCenter: boolean = true): this {
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
  public translate(system: IVec2): this {
    this.pos.scale(system);
    this.size.scale(system);
    return this;
  }
  public move(system: IVec2): this {
    this.pos.add(system);
    return this;
  }
  public toInt(): this {
    this.pos.toInt();
    this.size.toInt();
    return this;
  }
  public toDecimal(): this {
    this.pos.toDecimal();
    this.size.toDecimal();
    return this;
  }
  public contains(target: this): boolean {
    return (
      this.pos.x <= target.pos.x &&
      this.pos.y <= target.pos.y &&
      this.pos.x + this.size.x >= target.pos.x + target.size.x &&
      this.pos.y + this.size.y >= target.pos.y + target.size.y
    );
  }
  public containsPoint(vec: IVec2) {
    return (
      vec.x >= this.pos.x &&
      vec.x <= this.pos.x + this.size.x - 1 &&
      vec.y >= this.pos.y &&
      vec.y <= this.pos.y + this.size.y - 1
    );
  }
  public first(fn: (p: Vec2) => boolean): Vec2 | null {
    const p: Vec2 = new Vec2();
    const x = this.pos.x;
    const y = this.pos.y;
    for (let i = 0; i < this.size.x; i++) {
      for (let j = 0; j < this.size.y; j++) {
        ((p.x = i + x), (p.y = j + y));
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
  public zero(): this {
    this.pos.zero();
    this.size.zero();
    return this;
  }
}
