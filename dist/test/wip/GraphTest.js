"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Graph_1 = require("../../lib/wip/Graph");
chai_1.should();
describe("Graph", function () {
    it("builds a graph", function () {
        let graph = new Graph_1.Graph();
        graph.fromNodeList([
            { id: "0", nodeType: "red", neighbours: ["1", "2"], costs: [10, 20] },
            { id: "1", nodeType: "blue", neighbours: ["0", "3"], costs: [10, 10] },
            { id: "2", nodeType: "blue", neighbours: ["0", "3"], costs: [20, 10] },
            { id: "3", nodeType: "green", neighbours: ["1", "2"], costs: [10, 10] },
        ]);
        graph.get("0").neighbours.length.should.equal(2);
    });
});
//# sourceMappingURL=GraphTest.js.map