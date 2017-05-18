import { Global } from "./Global";
import * as Good from "./index";

export function Integrate(alias?: string) {
	if (alias !== undefined) {
		(Global.window as any)[alias] = {};
	}
	for (const stuff in Good) {
		if (alias !== undefined) {
			(Global.window as any)[alias][stuff] = (Good as any)[stuff];
		} else {
			(Global.window as any)[stuff] = (Good as any)[stuff];
		}
	}
}
