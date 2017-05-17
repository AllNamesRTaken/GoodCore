import { should } from "chai";
import { expect } from "chai";
import { jsdom } from "jsdom";
import { _Dom, Dom } from "../lib/Dom";
should();

describe("Dom",
	function() {
		before(function() {
			const win = jsdom().defaultView;
			this.document = win.document;
			this.html1 = "<div id=\"bar\">text</div>";
			this.html2 = "<div id=\"foo\"><div id=\"sub1\"></div><div id=\"sub2\"></div></div>";
			this.Dom = Dom._(win);
		});
		it("Create creates dom elements and sets attributes",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html1, {
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
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				Dom.Clear(el);
				el.children.length.should.equal(0);
			});
		it("Children filters children by selector",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				const chld = Dom.Children(el, "#sub2");
				chld.length.should.equal(1);
				chld[0].id.should.equal("sub2");
			});
		it("Find finds the right element",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				this.document.body.appendChild(el);
				const chld = Dom.Find("#sub1");
				chld.id.should.equal("sub1");
				el.parentNode.removeChild(el);
			});
		it("FindAll finds right elements",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				this.document.body.appendChild(el);
				const chld = Dom.FindAll("div");
				chld.length.should.equal(3);
				el.parentNode.removeChild(el);
			});
		it("Get gets elementById",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				this.document.body.appendChild(el);
				const chld = Dom.Get("sub2");
				chld.id.should.equal("sub2");
				el.parentNode.removeChild(el);
			});
		it("Is matches element with selector",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				Dom.Is("#foo", el).should.be.true;
				Dom.Is(".bar", el).should.be.false;
			});
		it("OuterHTML returns correct html",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				Dom.OuterHTML(el).should.equal(this.html2);
			});
		it("Position sets style top and left",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				Dom.Position(el, 10, 20);
				el.style.left.should.equal("10px");
				el.style.top.should.equal("20px");
			});
		it("Remove removes the child from the parent",
			function() {
				const Dom = this.Dom as _Dom;
				const el = Dom.Create(this.html2);
				this.document.body.appendChild(el);
				el.parentNode.should.not.be.null;
				Dom.Remove(el);
				(el.parentNode === null).should.be.true;
			});
		it("Replace replaces an element with another",
			function() {
				const Dom = this.Dom as _Dom;
				const el1 = Dom.Create(this.html1);
				const el2 = Dom.Create(this.html2);
				this.document.body.appendChild(el1);
				Dom.Find("#bar").id.should.equal("bar");
				Dom.Replace(el1, el2);
				(Dom.Find("#bar") === null).should.be.true;
				Dom.Find("#sub1").id.should.equal("sub1");
				Dom.Remove(el2);
			});
	}
);
