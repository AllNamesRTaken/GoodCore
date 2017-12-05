import {should} from "chai";
import { JSDOM } from "jsdom";
import { Global } from "../lib/Global";
import { Uri } from "../lib/Uri";
should();

describe("Uri",
	function() {
		before(function() {
			const dom = new JSDOM();
			const win = dom.window;
			dom.reconfigure({ url: "http://domain.com/path/page.html?arg1=1&arg2=2" });
			Global.window = win;
		});
		it("Uri is populated",
			function(){
				let uri = new Uri();
				uri.init();
				uri.hostName.should.equal("domain.com");
				uri.pathName.should.equal("/path/page.html");
				uri.args.arg2.should.equal("2");
			});
	}
);
