/**
 * @jest-environment jsdom
 */

import * as Dom from "../lib/Dom";

describe("Dom",
	() => {
		let html1: string;
		let html2: string;
		beforeAll(() => {
			html1 = "<div id=\"bar\">text</div>";
			html2 = "<div id=\"foo\"><div id=\"sub1\"></div><div id=\"sub2\"></div></div>";
			Dom.init(window);
		});
		test("Create html with space trims space",
		() => {
			const el = Dom.create(" <div> ");
			expect(el.tagName).toBe("DIV");
		});
		test("Create 'table' creates a table",
			() => {
				const el = Dom.create("table");
				expect(el.tagName).toBe("TABLE");
			});
		test("Create creates dom elements and sets attributes",
			() => {
				const el = Dom.create(html1, {
					id: "id",
					classes: ["a", "b"],
					style: {
						"background-color": "red",
					}
				});
				expect(el.id).toBe("id");
				expect(el.style.getPropertyValue("background-color")).toBe("red");
			});
		test("Resolve resolves element under root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			expect(Dom.resolve(sub1, el)).toBe(sub1);
		});
		test("Resolve resolves selector under root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			expect(Dom.resolve("#sub1", el)).toBe(sub1);
		});
		test("Resolve resolves root under root",
		() => {
			const el = Dom.create(html2);
			expect(Dom.resolve("div", el)).toBe(el);
			expect(Dom.resolve("div")).toBe(null);
			expect(Dom.resolve("body")).toBe(document.body);
		});
		test("ResolveAll resolves elements under root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			const sub2 = el.children[1] as HTMLElement;
			expect(Dom.resolveAll([sub1, sub2], el)).toEqual([sub1, sub2]);
		});
		test("ResolveAll resolves selector under root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			const sub2 = el.children[1] as HTMLElement;
			expect(Dom.resolveAll("#sub1, #sub2", el)).toEqual([sub1, sub2]);
		});
		test("ResolveAll resolves root under root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			const sub2 = el.children[1] as HTMLElement;
			expect(Dom.resolveAll("div", el)).toEqual([el, sub1, sub2]);
			expect(Dom.resolveAll("div")).toEqual([]);
			expect(Dom.resolveAll("body")).toEqual([document.body]);
		});
		test("Contains tests that element is contained in root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			expect(Dom.contains(sub1, el)).toBe(true);
		});
		test("Contains tests that elements are all contained in root",
		() => {
			const el = Dom.create(html2);
			const sub1 = el.children[0] as HTMLElement;
			const sub2 = el.children[1] as HTMLElement;
			expect(Dom.contains([sub1, sub2], el)).toBe(true);
		});
		test("Contains tests that elements by selector are all contained in root",
		() => {
			const el = Dom.create(html2);
			expect(Dom.contains("#sub1, #sub2", el)).toBe(true);
			expect(Dom.contains("div", el)).toBe(false);
		});
		test("Contains tests that root is not contained in root",
		() => {
			const el = Dom.create(html2);
			expect(Dom.contains(el, el)).toBe(false);
		});
		test("Contains tests that root is contained in root when includeRoot is true",
		() => {
			const el = Dom.create(html2);
			expect(Dom.contains(el, el, true)).toBe(true);
		});
		test("Contains tests that all attached elements are returned when root is empty",
		() => {
			const el = Dom.create(html2);
			const notAttached = Dom.create(html1);
			const sub1 = el.children[0] as HTMLElement;
			const sub2 = el.children[1] as HTMLElement;
			document.body.appendChild(el);
			expect(Dom.contains([sub1, sub2, el], undefined, true)).toBe(true);
			expect(Dom.contains(notAttached)).toBe(false);
			Dom.remove(el);
		});
		test("Clear removes all children of an element",
			() => {
				const el = Dom.create(html2);
				Dom.clear(el);
				expect(el.children.length).toBe(0);
			});
		test("Children filters children by selector",
			() => {
				const el = Dom.create(html2);
				const chld = Dom.children(el, "#sub2");
				expect(chld.length).toBe(1);
				expect(chld[0].id).toBe("sub2");
				const chld2 = Dom.children(el);
				expect(chld2.length).toBe(2);
				expect(chld2[0].id).toBe("sub1");
			});
		test("Find finds the right element",
			() => {
				const el = Dom.create(html2);
				(document.body as HTMLBodyElement).appendChild(el as Node);
				let chld = Dom.find("#sub1");
				expect(chld!.id).toBe("sub1");
				chld = Dom.find("#sub1", document.body)!;
				expect(chld.id).toBe("sub1");
				chld = Dom.find("#sub1", chld);
				expect((chld === null)).toBe(true);
				el.parentNode!.removeChild(el);
			});
		test("FindAll finds right elements",
			() => {
				const el = Dom.create(html2);
				document.body.appendChild(el as Node);
				const chld = Dom.findAll("div");
				expect(chld.length).toBe(3);
				el.parentNode!.removeChild(el);
			});
		test("findParent finds parent matching selector or null",
			() => {
				const el = Dom.create(html2);
				document.body.appendChild(el as Node);
				const chld = Dom.find("#sub1");
				const parent = Dom.findParent(chld!, "body");
				expect(parent!).toBe(document.body);
				const non = Dom.findParent(chld!, "#non");
				expect(non).toBe(null);
				el.parentNode!.removeChild(el);
			});
		test("Get gets elementById",
			() => {
				const el = Dom.create(html2);
				document.body.appendChild(el as Node);
				const chld = Dom.byId("sub2")!;
				expect(chld.id).toBe("sub2");
				expect(Dom.byId("body")!.tagName).toBe("BODY");
				expect((Dom.byId("notvalid") === null)).toBe(true);
				el.parentNode!.removeChild(el);
			});
		test("Is matches element with selector",
			() => {
				const el = Dom.create(html2);
				expect(Dom.is("#foo", el)).toBe(true);
				expect(Dom.is(".bar", el)).toBe(false);
			});
		test("setStylesExplicitly reads styles (from classes) and sets them as explicit styles",
			() => {
				const el = Dom.create(html2);
				document.body.appendChild(el as Node);
				expect(el.style.display!).toBe("");
				Dom.setStylesExplicitly(el, "display");
				expect(el.style.display!).toBe("block");
				el.parentNode!.removeChild(el);
			});
		test("OuterHTML returns correct html",
			() => {
				const el = Dom.create(html2);
				expect(Dom.outerHTML(el)).toBe(html2);
			});
		test("setAttr sets the attributes on correct object",
			() => {
				const el = Dom.create(html2);
				document.body.appendChild(el as Node);
				Dom.setAttr("foo", {someAttr: "someValue"});
				expect(el.getAttribute("someAttr")!).toBe("someValue");
				Dom.setAttr(el, {style: {color: ["red", "important"]}});
				expect(el.style.getPropertyPriority("color")).toBe("important");
				Dom.setAttr(el, {class: "hey ho"});
				expect(el.className!).toBe("hey ho");
				Dom.setAttr(el, {class: ["kun", "lun"]});
				expect(el.className!).toBe("kun lun");
				el.parentNode!.removeChild(el);
			});		
		test("Position sets style top and left",
			() => {
				const el = Dom.create(html2);
				Dom.position(el, 10, 20);
				expect(el.style.left!).toBe("10px");
				expect(el.style.top!).toBe("20px");
			});
		test("getOffset returns the position relative to the page",
			() => {
				const el2 = Dom.create(html2);
				Dom.position(el2, 10, 20);
				let sub2 = Dom.find("#sub2", el2)!;
				Dom.setAttr(sub2, {style: {position: "absolute", top: "20px", left: "40px"}});
				document.body.appendChild(el2);
				let offset = Dom.getOffset(sub2);
				// this doesnt work since getBoundingClientRect does not seem to work headless
				// expect(offset.top).toBe(40);
				// expect(offset.left).toBe(30);
				Dom.remove(el2);
			});			
		test("Remove removes the child from the parent",
			() => {
				const el = Dom.create(html2);
				document.body.appendChild(el);
				expect(el.parentNode!).not.toBe(null);
				expect(Dom.remove(el)!).toBe(el);
				expect((el.parentNode === null)).toBe(true);
				expect((Dom.remove(el) === null)).toBe(true);
			});
		test("Replace replaces an element with another",
			() => {
				const el1 = Dom.create(html1);
				const el2 = Dom.create(html2);
				document.body.appendChild(el1);
				expect(Dom.find("#bar")!.id).toBe("bar");
				Dom.replace(el1, el2);
				expect((Dom.find("#bar") === null)).toBe(true);
				expect(Dom.find("#sub1")!.id).toBe("sub1");
				Dom.remove(el2);
			});
		test("findParents returns list of all parents",
			() => {
				const el1 = Dom.create(html1);
				const el2 = Dom.create(html2);
				document.body.appendChild(el1);
				document.body.appendChild(el2);
				let parentsEl1 = Dom.findParents(el1)
				let parentsSub1 = Dom.findParents(Dom.find("#sub1")!);
				let parentsSub2 = Dom.findParents(Dom.find("#sub2")!);
				expect(parentsEl1.length).toBe(2);
				expect(parentsSub1.length).toBe(3);
				expect(parentsSub2.length).toBe(3);
				Dom.remove(el1);
				Dom.remove(el2);
			});
		test("findClosestCommonParent finds first common parent in list of elements",
			() => {
				const el2 = Dom.create(html2);
				document.body.appendChild(el2);
				let els1 = Dom.findAll("#foo,#sub2");
				let els2 = Dom.findAll("#sub1,#sub2");
				expect(Dom.findClosestCommonParent(els1)).toBe(el2);
				expect(Dom.findClosestCommonParent(els2)).toBe(el2);
				expect(Dom.findClosestCommonParent([])).toBe(document.body);
				expect(Dom.findClosestCommonParent([el2])).toBe(el2);
				Dom.remove(el2);
			});
		}
);
