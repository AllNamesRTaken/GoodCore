import { map } from "../Arr";
import { clone, isClassOf, isSameClass,  setProperties } from "../Obj";
import { Initable } from "../mixins/Initable";
import { Dictionary } from "../struct/Dictionary";
import { List } from "../struct/List";
import { SortedList } from "../struct/SortedList";
import { Stack } from "../struct/Stack";
import { isArray, isNullOrUndefined } from "../Test";
import { newUUID } from "../Util";

@Initable
export class GraphNode<T> implements ICloneable<GraphNode<T>>{
	private _id: string = "";
	private _data: T | null = null;
	private _costs: List<number> | null = null;
	private _edgeTypes: List<string> | null = null;
	private _neighbours: List<GraphNode<T>> | null = null; 
	private _nodeType: string | null = null;

	constructor() {
		this._id = newUUID();
	}

	public get id(): string {
		return this._id;
	}
	public set id(v: string) {
		this._id = v;
	}
	public get data(): T | null{
		return this._data;
	}
	public set data(v: T | null){
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
	public get nodeType(): string | null{
		return this._nodeType;
	}
	public set nodeType(v: string | null) {
		this._nodeType = v;
	}

	public init(obj: Partial<GraphNode<T>>): GraphNode<T> {
		setProperties(this, obj);
		return this;
	}
	public clone(): GraphNode<T> {
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
				if (typeof(edgeType) === "string") {
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
		return {id: this._id, data: this._data, nodeType: this._nodeType};
	}
}

export class Graph<T> {
	private _id: string = "";
	private _nodes: SortedList<GraphNode<T>> = new SortedList<GraphNode<T>>((a: GraphNode<T>, b: GraphNode<T>) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1);
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
	
	constructor() {
		this._id = newUUID();
	}

	public get id(): string {
		return this._id;
	}

	public get(id: string): GraphNode<T> | undefined {
		return this._nodes.find((el) => el.id === id);
	}
	public fromNodeList<S>(nodes: S[], mapcfg?: {
		id?: ((node: S) => string)|string, 
		data?: ((node: S) => T)|T,
		costs?: ((node: S) => number[])|number[], 
		edgeTypes?: ((node: S) => string[])|string[], 
		neighbours?: ((node: S) => string[])|string[],
		nodeType?: ((node: S) => string[])|string[], 
	}): void {
		// create map
		let mapResolver = (key: string) => {
			return !mapcfg || !(key in mapcfg) ? (el: S) => (el as any)[key] :
				isArray((mapcfg as any)[key]) ? (el: S) => (el as any)[key] :
				typeof((mapcfg as any)[key]) === "string" ? (el: S) => (el as any)[(mapcfg as any)[key]] : 
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
		list.forEach((el, i) => {
			let node = new GraphNode<T>().init({
				id: map.id(el), 
				data: map.data(el), 
				nodeType: map.nodeType(el)
			});
			// map
			lookup.set(node.id, node);
		});
		// hook nodes together
		list.forEach((el, i) => {
			let id = map.id(el);
			let costs: number[] = map.costs(el);
			let edgeTypes: string[] = map.edgeTypes(el);
			let neighbours: string[] = map.neighbours(el);
			for (let i = 0; i < neighbours.length; i++) {
				let nid = neighbours[i];
				if (lookup.contains(nid)) {
					let elB = lookup.get(nid);
					lookup.get(id)!.connect(elB!, isNullOrUndefined(costs) ? undefined : costs[i], isNullOrUndefined(edgeTypes) ? undefined : edgeTypes[i]);
				}
			}
		});
		this._nodes.bulkAdd(new List(lookup.values));
	}

	public add() {}
	public remove() {}
	public connect(a: GraphNode<T>, b: GraphNode<T>, cost?: number | null, edgeType?: [string, string] | string | null) {
		a.connect(b, cost, edgeType);
	}
	public contains(el: GraphNode<T>) {
		return this._nodes.contains(el);
	}
	public find(fn: (el: GraphNode<T>) => boolean) {
		return this._nodes.find(fn);
	}
	public pathTo() {}
	public filter() {}
}
