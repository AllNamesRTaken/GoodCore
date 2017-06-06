import { List } from "./List";
export declare class BaseTree<T> implements ITreeNode<T> {
    Id: string;
    Parent: Tree<T>;
    Children: List<Tree<T>>;
    Data: T;
}
export declare const _InitableTree: typeof BaseTree & ICtor<IInitable<typeof BaseTree>>;
export declare class Tree<T> extends _InitableTree<T> implements ICloneable<ITreeNode<T>> {
    static fromObject<T>(obj: any): Tree<T>;
    constructor();
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
