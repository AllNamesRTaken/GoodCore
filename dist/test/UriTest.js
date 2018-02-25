"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jsdom_1 = require("jsdom");
const Global_1 = require("../lib/Global");
const Uri_1 = require("../lib/Uri");
chai_1.should();
describe("Uri", function () {
    before(function () {
        const dom = new jsdom_1.JSDOM();
        this.win = dom.window;
        dom.reconfigure({ url: "http://domain.com/path/page.html?arg1=1&arg2=2" });
    });
    it("Uri is populated", function () {
        let uri = new Uri_1.Uri();
        Global_1.Global.window = null;
        uri.init();
        uri.hostName.should.equal("");
        Global_1.Global.window = this.win;
        uri.init();
        uri.hostName.should.equal("domain.com");
        uri.pathName.should.equal("/path/page.html");
        uri.args.arg2.should.equal("2");
    });
});
//# sourceMappingURL=UriTest.js.map