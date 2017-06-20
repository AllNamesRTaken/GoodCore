import { List } from "./List";
export declare class Tree<T> implements ICloneable<ITreeNode<T>>, IInitable<ITreeNode<T>> {
    id: string;
    parent: Tree<T>;
    children: List<Tree<T>>;
    data: T;
    static fromObject<T>(obj: any): Tree<T>;
    constructor();
    init(obj: ITreeNode<T>): Tree<T>;
    private newId();
    insertAt(pos: number, data: T): void;
    add(data: T): void;
    remove(): void;
    prune(): Tree<T>;
    reduce(fn: (acc: any, cur: T) => any, start?: any): any;
    clone(): Tree<T>;
    private duplicateNode();
    filter(condition: (node: ITreeNode<T>) => boolean): Tree<T>;
    select(condition?: (node: ITreeNode<T>) => boolean, acc?: List<Tree<T>>): List<Tree<T>>;
    find(condition: (data: T) => boolean): ITreeNode<T>;
    contains(condition: (data: T) => boolean): boolean;
}
