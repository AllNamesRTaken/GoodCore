import { expect, describe, test } from 'vitest'
import { Graph, GraphNode } from "../../lib/wip/Graph.js";

describe("Graph",
	() => {
		test("builds a graph",
			() => {
				let graph = new Graph<{value?: number}>();
				graph.fromNodeList([
					{id: 0, nodeType: "red", data: {}, neighbours: ["1", "2"], costs: [10, 20], edgeTypes: ["down", "down"]},
					{id: 1, nodeType: "blue", data: {}, neighbours: ["0", "3"], costs: 10, edgeTypes: ["up", "down"]},
					{id: 2, nodeType: "blue", data: {}, neighbours: ["0", "3"], costs: [20, 10], edgeTypes: ["up", "down"]},
					{id: 3, nodeType: "green", data: {value: 2}, neighbours: ["1", "2"], costs: 10, edgeTypes: ["up", "up"]},
				]);
				expect(graph.findById(0)!.neighbours.length).toBe(2);
				expect(graph.size).toBe(4);
				expect(graph.findById(2)!.nodeType!).toBe("blue");
				expect(graph.findById(2)!.costs.read(0)!).toBe("20");
				expect(graph.findById(2)!.edgeTypes.read(1)!).toBe("down");
				expect(graph.findById(3)!.data!.value!).toBe(2);
			});
		test("traverse goes through all nodes",
			() => {
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
