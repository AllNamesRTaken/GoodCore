import { clone, setProperties } from "../Obj.js";
import { Initable } from "../mixins/Initable.js";
import { Dictionary } from "../struct/Dictionary.js";
import { List } from "../struct/List.js";
import { isArray, isNullOrUndefined, isNotUndefined, isNotNull } from "../Test.js";
import { Util } from "..";
import { assert, once } from "../Util.js";
import { zip, create } from "../Arr.js";

@Initable
export class GraphNode<T> implements ICloneable {
	private _id: number = 0;
	private _data: T | null = null;
	private _costs: List<number> | null = null;
	private _edgeTypes: List<string> | null = null;
	private _neighbours: List<GraphNode<T>> | null = null;
	private _nodeType: string | null = null;

	constructor(id?: number) {
		if (isNotUndefined(id)) {
			this._id = id!;
		}
	}

	public get id(): number {
		return this._id;
	}
	public set id(v: number) {
		this._id = v;
	}
	public get data(): T | null {
		return this._data;
	}
	public set data(v: T | null) {
		this._data = v;
	}
	public get neighbours(): List<GraphNode<T>> {
		if (this._neighbours === null) {
			this._neighbours = new List<GraphNode<T>>();
			this._neighbours.indexer = (el) => el.id;
		}
		return this._neighbours;
	}
	public get costs(): List<number> {
		if (this._costs === null) {
			this._costs = new List<number>();
		}
		return this._costs;
	}
	public get edgeTypes(): List<string> {
		if (this._edgeTypes === null) {
			this._edgeTypes = new List<string>();
		}
		return this._edgeTypes;
	}
	public get nodeType(): string | null {
		return this._nodeType;
	}
	public set nodeType(v: string | null) {
		this._nodeType = v;
	}

	public init(obj: Partial<GraphNode<T>>): GraphNode<T> {
		setProperties(this, obj);
		return this;
	}
	public clone(): this {
		const result = new ((this as any).constructor as ICtor<GraphNode<T>>)();
		result._id = this._id;
		result._data = isNullOrUndefined(this._data) ? this._data : clone(this._data);
		result._nodeType = this._nodeType;
		// result.costs = this.costs === null || this.costs === undefined ? this.costs : clone(this.costs);
		// result.edgeTypes = this.edgeTypes === null || this.edgeTypes === undefined ? this.edgeTypes : clone(this.edgeTypes);
		// result.neighbours = this.neighbours === null ? null : this.neighbours.clone();
		return result;
	}
	public connect(node: GraphNode<T>, cost?: number | null, edgeType?: string | [string, string] | null) {
		if (!this.neighbours.contains(node)) {
			this.neighbours.add(node);
			node.neighbours.add(this);
			if (cost !== null && cost !== undefined) {
				this.costs.add(cost);
				node.costs.add(cost);
			}
			if (edgeType !== null && edgeType !== undefined) {
				if (typeof (edgeType) === "string") {
					this.edgeTypes.add(edgeType);
					node.edgeTypes.add(edgeType);
				} else {
					this.edgeTypes.add(edgeType[0]);
					node.edgeTypes.add(edgeType[1]);
				}
			}
		}
	}
	public toJSON(): any {
		return { id: this._id, data: this._data, nodeType: this._nodeType };
	}
}

export class Graph<T> {
	private _id: string = "";
	private _nodes: List<GraphNode<T>> = new List<GraphNode<T>>();
	private _nodeIndexer: (node: GraphNode<T>) => number | string = (node: GraphNode<T>) => node.id;
	private _lastId: -1;
	private _idGenerator: () => number;
	private _defaults = {
		cost: null as number | null,
		edgeType: null as string | null,
		nodeType: null as string | null
	};
	//Lookups
	// private _idCounter = 0;
	// private _nodesCounter = 0;
	// private _edgeCounter = 0;
	// private nodeIds: Dictionary<number> = new Dictionary<number>();
	// private nodesTypes: Dictionary<number> = new Dictionary<number>();
	// private edgeTypes: Dictionary<number> = new Dictionary<number>();
	// private nodeIdNames: Dictionary<number> = new Dictionary<number>();
	// private nodesTypeNames: Dictionary<number> = new Dictionary<number>();
	// private edgeTypeNames: Dictionary<number> = new Dictionary<number>();

	constructor(id?: string, nodeIndexer?: (node: GraphNode<T>) => number | string, idGenerator?: () => number) {
		let uuid = Util.newUUID();
		this._id = id || uuid;
		this._nodeIndexer = nodeIndexer || this._nodeIndexer;
		this._nodes.indexer = this._nodeIndexer;
		this._idGenerator = idGenerator || (() => ++this._lastId);
	}

	public get size(): number {
		return this._nodes.length;
	}
	public set size(v: number) {
		throw new Error("there is no setter for Graph::size");
	}
	public get id(): string {
		return this._id;
	}
	// tslint:disable-next-line:no-reserved-keywords
	public get(id: number): GraphNode<T> | undefined {
		once(() => {
			console.warn("Function Graph::get is deprecated please use Graph::findById instead. get is a reserved word.");
		});
		return this.findById(id);
	}
	public findById(id: number): GraphNode<T> | undefined {
		return this._nodes.find((el) => el.id === id);
	}
	public get defaultCost(): number | null {
		return this._defaults.cost;
	}
	public set defaultCost(v: number | null) {
		this._defaults.cost = v;
	}
	public get defaultEdgeType(): string | null {
		return this._defaults.edgeType;
	}
	public set defaultEdgeType(v: string | null) {
		this._defaults.edgeType = v;
	}
	public get defaultNodeType(): string | null {
		return this._defaults.nodeType;
	}
	public set defaultNodeType(v: string | null) {
		this._defaults.nodeType = v;
	}
	public fromNodeList<S>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string) | string,
		data?: ((node: S) => T) | T,
		costs?: ((node: S) => number[]) | string,
		edgeTypes?: ((node: S) => string[]) | string,
		neighbours?: ((node: S) => string[]) | string,
		nodeType?: ((node: S) => string[]) | string,
	}): void {
		// create map
		let mapResolver = (key: string) => {
			return !mapcfg || !(key in mapcfg) ? (el: S) => (el as any)[key] :
				// isArray((mapcfg as any)[key]) ? (el: S) => (el as any)[key] :
				typeof ((mapcfg as any)[key]) === "string" ? (el: S) => (el as any)[(mapcfg as any)[key]] :
					(mapcfg as any)[key];
		};
		let map = {
			id: mapResolver("id"),
			data: mapResolver("data"),
			costs: mapResolver("costs"),
			edgeTypes: mapResolver("edgeTypes"),
			neighbours: mapResolver("neighbours"),
			nodeType: mapResolver("nodeType"),
		};
		// create node lookup
		let list = new List<S>(nodes);
		let lookup: Dictionary<GraphNode<T>> = new Dictionary();
		list.forEach((el) => {
			let node = new GraphNode<T>(map.id(el)).init({
				data: map.data(el),
				nodeType: map.nodeType(el)
			});
			// map
			lookup.add(this._nodeIndexer(node), node);
		});

		// hook nodes together
		list.forEach((el) => {
			let id: string = map.id(el);
			let costs: number[] | number = map.costs(el);
			let edgeTypes: string[] = map.edgeTypes(el);
			let neighbours: string[] = map.neighbours(el);
			for (let i = 0; i < neighbours.length; i++) {
				let nid = neighbours[i];
				if (lookup.contains(nid)) {
					let elB = lookup.lookup(nid);
					lookup.lookup(id)!.connect(
						elB!,
						isNullOrUndefined(costs) ?
							undefined :
							isArray(costs) ?
								(costs as number[])[i] :
								costs as number,
						isNullOrUndefined(edgeTypes) ?
							undefined :
							edgeTypes[i]);
				}
			}
		});
		this._nodes.append(lookup.values);
	}

	public add(data: GraphNode<T> | T) {
		let node: GraphNode<T>;
		if (data instanceof GraphNode) {
			node = data;
		} else {
			node = new GraphNode<T>(this._idGenerator()).init({ data });
			if (isNotUndefined(this.defaultNodeType)) {
				node.nodeType = this.defaultNodeType;
			}
		}
		if (this._nodes.contains(node)) {
			throw new Error(`node already used: ${this._nodeIndexer(node)}`);
		}
		this._nodes.add(node);
	}
	public remove(node: GraphNode<T>) {
		this._nodes.remove(node);
	}
	public removeByIndex(index: number | string) {
		let node = this._nodes.getByIndex(index);
		if (isNotUndefined(node)) {
			this._nodes.remove(node!);
		}
	}
	public connect(a: GraphNode<T>, b: GraphNode<T>, cost?: number | null, edgeType?: [string, string] | string | null) {
		if (!this.contains(a)) {
			this.add(a);
		}
		if (!this.contains(b)) {
			this.add(b);
		}
		a.connect(b, cost, edgeType);
	}
	public contains(node: GraphNode<T>) {
		return this._nodes.contains(node);
	}
	public find(fn: (node: GraphNode<T>) => boolean) {
		return this._nodes.find(fn);
	}
	public traverse<S>(
		entryPoints: Array<GraphNode<T>>,
		startValues: S[],
		actionFn: (node: GraphNode<T>, cost: number, acc: S) => S,
		pathSelecorFn: (node: GraphNode<T>, prevNode: GraphNode<T> | null, acc: S, traversed: List<GraphNode<T>>) => number[] | null,
		stopCondition: (node: GraphNode<T>, acc: S) => boolean | undefined,
		maxStep: number = 1000): S[] {

		//let queue: Array<GraphNode<T>> = [];
		let result: Dictionary<S> = new Dictionary();
		let traversed: List<GraphNode<T>> = new List();
		traversed.indexer = this._nodeIndexer;

		assert(entryPoints.length === startValues.length, "There has to be exactly 1 start value per entry point");
		let queue = zip(create(entryPoints.length, () => null as GraphNode<T> | null), entryPoints, startValues);

		let count = -1;
		let state: [GraphNode<T> | null, GraphNode<T>, S] | undefined;
		while (
			isNotUndefined(state = queue.shift()) && 
			--count < maxStep &&
			(stopCondition === undefined || stopCondition(state![1]!, state![2]!) !== false)
		) {
			let prev = state![0];
			let node = state![1];
			let acc = state![2];
			let newAcc = actionFn(node, 0, acc);
			if (!traversed.contains(node)) {
				traversed.push(node);
			}
			let pathIndexes = pathSelecorFn(node, prev, acc, traversed);
			if (isNotNull(pathIndexes)) {
				pathIndexes!.forEach((index) => {
					queue.push([node, node.neighbours.read(index)!, clone(newAcc)]);
				});
			} else {
				result.add(`${-1},${node.id}`, newAcc);
			}
		}

		return result.values;
	}
	public pathTo() { }
	public filter() { }
}
