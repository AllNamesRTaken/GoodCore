import * as Good from "./index";

export function Integrate(alias?: string, win: Window = window) {
	if (alias !== undefined) {
		(win as any)[alias] = {};
	}
	for (const stuff in Good) {
		if ((Good as any)[stuff]._) {
			if (alias !== undefined) {
				(win as any)[alias][stuff] = (Good as any)[stuff]._;
			} else {
				(win as any)[stuff] = (Good as any)[stuff]._;
			}
		} else {
			if (alias !== undefined) {
				(win as any)[alias][stuff] = (Good as any)[stuff];
			} else {
				(win as any)[stuff] = (Good as any)[stuff];
			}
		}
	}
}
