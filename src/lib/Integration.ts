import { Global } from "./Global";
import * as Good from "./index";

export function integrate(alias?: string | object) {
	let stringAlias = false;
	let objectAlias = false;
	if (typeof(alias) === "string") {
		(Global.window as any)[alias] = {};
		stringAlias = true;
	}
	for (const stuff in Good) {
		if (stringAlias) {
			(Global.window as any)[alias as string][stuff] = (Good as any)[stuff];
		} else if (objectAlias) {
			(alias as any)[stuff] = (Good as any)[stuff];
		} else {
			(Global.window as any)[stuff] = (Good as any)[stuff];
		}
	}
}
