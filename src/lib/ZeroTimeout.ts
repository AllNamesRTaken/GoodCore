
import { Global } from "./Global";
import { hasWindow } from "./Test";

export interface IZeroEvent extends Event {
	data: string;
}
export function createZeroTimeout(): (fn: Function) => void {
	const timeouts: Function[] = [];
	const messageName = "zero-timeout-message";

	function setZeroTimeout(fn: Function): void {
		timeouts.push(fn);
		Global.window.postMessage(messageName, "*");
	}

	function handleMessage(event: IZeroEvent) {
		if ((((event as any).source) === undefined || ((event as any).source) === Global.window) && event.data === messageName) {
			event.stopPropagation();
			if (timeouts.length > (0 | 0)) {
				const fn = timeouts.shift();
				fn();
			}
		}
	}
	if (hasWindow()) {
		Global.window.addEventListener("message", handleMessage, true);
		return setZeroTimeout;
	} else {
		return setTimeout;
	}
}
export let zeroTimeout: (fn: Function) => void = createZeroTimeout();
