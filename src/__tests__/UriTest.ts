/**
 * @jest-environment jsdom
 */

import { Uri } from "../lib/Uri";

describe("Uri",
	() => {
		beforeAll(() => {
			window.history.pushState({}, "Test Title", "/path/page.html?arg1=1&arg2=2");
		});
		test("Uri is populated",
			() => {
				let uri = new Uri();
				expect(uri.hostName).toBe("domain.com");
				expect(uri.pathName).toBe("/path/page.html");
				expect(uri.args.arg2).toBe("2");
			});
		test("non attached uri works",
			() => {
				let uri = new Uri("http://test.uri.com/ponent/with.html?parameters=1");
				expect(uri.hostName).toBe("test.uri.com");
				expect(uri.pathName).toBe("/ponent/with.html");
				expect(uri.args.parameters).toBe("1");
				uri.args = {apa: "banan"}
				expect(uri.args.parameters).toBeUndefined();
				expect(uri.args.apa).toBe("banan");
			});
		test("non attached uri does not change attached uri",
			() => {
				let attachedUri = new Uri();
				let nonAttachedUri = new Uri("http://test.uri.com/ponent/with.html?parameters=1");
				expect(attachedUri.hostName).toBe("domain.com");
			});
	}
);
