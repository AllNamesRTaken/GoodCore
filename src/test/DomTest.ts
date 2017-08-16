import { should } from "chai";
import { expect } from "chai";
import { jsdom } from "jsdom";
import { Dom } from "../lib/Dom";
should();

describe("Dom",
	function() {
		before(function() {
			const win = jsdom().defaultView;
			this.document = win.document;
			this.html1 = "<div id=\"bar\">text</div>";
			this.html2 = "<div id=\"foo\"><div id=\"sub1\"></div><div id=\"sub2\"></div></div>";
			Dom.init(win);
		});
		it("Create creates dom elements and sets attributes",
			function() {
				const el = Dom.create(this.html1, {
					id: "id",
					classes: ["a", "b"],
					style: {
						"background-color": "red",
					}
				});
				el.id.should.equal("id");
				el.style.getPropertyValue("background-color").should.equal("red");
			});
		it("Clear removes all children of an element",
			function() {
				const el = Dom.create(this.html2);
				Dom.clear(el);
				el.children.length.should.equal(0);
			});
		it("Children filters children by selector",
			function() {
				const el = Dom.create(this.html2);
				const chld = Dom.children(el, "#sub2");
				chld.length.should.equal(1);
				chld[0].id.should.equal("sub2");
			});
		it("Find finds the right element",
			function() {
				const el = Dom.create(this.html2);
				this.document.body.appendChild(el);
				const chld = Dom.find("#sub1");
				chld.id.should.equal("sub1");
				el.parentNode!.removeChild(el);
			});
		it("FindAll finds right elements",
			function() {
				const el = Dom.create(this.html2);
				this.document.body.appendChild(el);
				const chld = Dom.findAll("div");
				chld.length.should.equal(3);
				el.parentNode!.removeChild(el);
			});
		it("Get gets elementById",
			function() {
				const el = Dom.create(this.html2);
				this.document.body.appendChild(el);
				const chld = Dom.get("sub2");
				chld.id.should.equal("sub2");
				el.parentNode!.removeChild(el);
			});
		it("Is matches element with selector",
			function() {
				const el = Dom.create(this.html2);
				Dom.is("#foo", el).should.be.true;
				Dom.is(".bar", el).should.be.false;
			});
		it("OuterHTML returns correct html",
			function() {
				const el = Dom.create(this.html2);
				Dom.outerHTML(el).should.equal(this.html2);
			});
		it("Position sets style top and left",
			function() {
				const el = Dom.create(this.html2);
				Dom.position(el, 10, 20);
				el.style.left!.should.equal("10px");
				el.style.top!.should.equal("20px");
			});
		it("Remove removes the child from the parent",
			function() {
				const el = Dom.create(this.html2);
				this.document.body.appendChild(el);
				el.parentNode!.should.not.be.null;
				Dom.remove(el);
				(el.parentNode === null).should.be.true;
			});
		it("Replace replaces an element with another",
			function() {
				const el1 = Dom.create(this.html1);
				const el2 = Dom.create(this.html2);
				this.document.body.appendChild(el1);
				Dom.find("#bar").id.should.equal("bar");
				Dom.replace(el1, el2);
				(Dom.find("#bar") === null).should.be.true;
				Dom.find("#sub1").id.should.equal("sub1");
				Dom.remove(el2);
			});
	}
);
