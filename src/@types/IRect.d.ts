import { IVec2 } from "./IVec2";

export interface IRect {
	start: IVec2;
	stop: IVec2;
	endInclusive?: boolean;
}
