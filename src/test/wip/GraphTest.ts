import {should} from "chai";
import { Graph, GraphNode } from "../../lib/wip/Graph";
import { notDeepEqual } from "assert";

should();

describe("Graph",
	function() {
		it("builds a graph",
			function() {
				let graph = new Graph<{value?: number}>();
				graph.fromNodeList([
					{id: 0, nodeType: "red", data: {}, neighbours: ["1", "2"], costs: [10, 20], edgeTypes: ["down", "down"]},
					{id: 1, nodeType: "blue", data: {}, neighbours: ["0", "3"], costs: 10, edgeTypes: ["up", "down"]},
					{id: 2, nodeType: "blue", data: {}, neighbours: ["0", "3"], costs: [20, 10], edgeTypes: ["up", "down"]},
					{id: 3, nodeType: "green", data: {value: 2}, neighbours: ["1", "2"], costs: 10, edgeTypes: ["up", "up"]},
				]);
				graph.get(0)!.neighbours.length.should.equal(2);
				graph.size.should.equal(4);
				graph.get(2)!.nodeType!.should.equal("blue");
				graph.get(2)!.costs.get(0)!.should.equal("20");
				graph.get(2)!.edgeTypes.get(1)!.should.equal("down");
				graph.get(3)!.data!.value!.should.equal(2);
			});
		it("traverse goes through all nodes",
			function() {
				let graph = new Graph<{value?: number}>();
				graph.fromNodeList([
					{id: 0, nodeType: "red", data: {}, neighbours: ["1", "2"], costs: [10, 20], edgeTypes: ["down", "down"]},
					{id: 1, nodeType: "blue", data: {}, neighbours: ["0", "3"], costs: 10, edgeTypes: ["up", "down"]},
					{id: 2, nodeType: "blue", data: {}, neighbours: ["0", "3"], costs: [20, 10], edgeTypes: ["up", "down"]},
					{id: 3, nodeType: "green", data: {value: 2}, neighbours: ["1", "2"], costs: 10, edgeTypes: ["up", "up"]},
					{id: 4, nodeType: "red", data: {}, neighbours: ["5"], costs: 10, edgeTypes: ["down"]},
					{id: 5, nodeType: "blue", data: {}, neighbours: ["2"], costs: 10, edgeTypes: ["down"]},
				]);
				let ids: number[] = [];
				let entries = graph.find((node) => node.nodeType === "red");
				// let result = graph.traverse(
				// 	entries, 
				// 	[0, 0], 
				// 	(node, cost, acc) => void, 
				// 	(node, prev, acc) => node.edgeTypes.filter((edge) => edge === "down")
				// );
			});
	}
);
