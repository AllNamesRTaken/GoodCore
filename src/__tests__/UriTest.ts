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
				uri.init();
				expect(uri.hostName).toBe("domain.com");
				expect(uri.pathName).toBe("/path/page.html");
				expect(uri.args.arg2).toBe("2");
			});
	}
);
