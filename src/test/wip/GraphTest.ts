import {should} from "chai";
import { newUUID } from "../../lib/Util";
import { Graph, GraphNode } from "../../lib/wip/Graph";

should();

describe("Graph",
	function() {
		it("builds a graph",
			function(){
				let graph = new Graph();
				graph.fromNodeList([
					{id: "0", nodeType: "red", neighbours: ["1", "2"], costs: [10, 20]},
					{id: "1", nodeType: "blue", neighbours: ["0", "3"], costs: [10, 10]},
					{id: "2", nodeType: "blue", neighbours: ["0", "3"], costs: [20, 10]},
					{id: "3", nodeType: "green", neighbours: ["1", "2"], costs: [10, 10]},
				]);
				graph.get("0").neighbours.length.should.equal(2);
			});
	}
);
