const DefaultEventOptions: EventInit = {
	bubbles: true,
	cancelable: true,	
}
export type AvailableEvents = "click" | "change" | "focus" | "blur" | "keydown" | "keyup";
function triggerCustom(event: string, target: HTMLElement, options: EventInit = {}): boolean {
	let result = true;
	if (typeof Event === "function") {
		let evt = new CustomEvent(event, options as CustomEventInit);
		result = target.dispatchEvent(evt!);
	}
	else if ("createEvent" in document) {
		let evt = document.createEvent("Event");
		evt.initEvent(event, options.bubbles, options.cancelable);
		result = target.dispatchEvent(evt!);
	}
	else {
		result = (target as any).fireEvent("on" + event);
	}
	return result;
}

export function trigger(event: AvailableEvents | string, target: HTMLElement, options: EventInit | MouseEventInit | FocusEventInit | KeyboardEventInit = {}): boolean {
	options = { ...DefaultEventOptions, ...options };
	let result = true;
	if (typeof Event === "function") {
		let evt: Event | null = null;
		switch (event as AvailableEvents) {
			case "click":
				evt = new MouseEvent(event, options as MouseEventInit);
				break;
			case "change":
				evt = new Event(event, options as EventInit);
				break;
			case "focus":
			case "blur":
				evt = new FocusEvent(event, options as FocusEventInit);
				break;
			case "keydown":
			case "keyup":
				evt = new KeyboardEvent(event, options as KeyboardEventInit);
				break;
			default:
				return triggerCustom(event, target, options);
		}
		result = target.dispatchEvent(evt!);
	}
	else if ("createEvent" in document) {
		let evt: Event;
		switch (event) {
			case "click":
				evt = document.createEvent("MouseEvent");
				(evt as MouseEvent).initEvent(event, options.bubbles, options.cancelable);
				break;
			case "change":
				evt = document.createEvent("InputEvent");
				(evt as Event).initEvent(event, options.bubbles, options.cancelable);
				break;
			case "focus":
			case "blur":
				evt = document.createEvent("FocusEvent");
				(evt as FocusEvent).initEvent(event, options.bubbles, options.cancelable);
				break;
			case "keydown":
			case "keyup":
				evt = document.createEvent("KeyboardEvent");
				(evt as KeyboardEvent).initEvent(event, options.bubbles, options.cancelable);
				break;
			default:
				return triggerCustom(event, target, options);
		}
		evt.initEvent(event, false, true);
		result = target.dispatchEvent(evt);
	}
	else {
		result = (target as any).fireEvent("on" + event);
	}
	return result;
}