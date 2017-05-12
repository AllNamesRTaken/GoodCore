import List from "./List";
export declare class BaseTree<T> implements ITreeNode<T> {
    Id: string;
    Parent: Tree<T>;
    Children: List<Tree<T>>;
    Data: T;
}
export declare const _InitableTree: typeof BaseTree & ICtor<IInitable<typeof BaseTree>>;
export declare class Tree<T> extends _InitableTree<T> implements ICloneable<ITreeNode<T>> {
    static FromObject<T>(obj: any): Tree<T>;
    constructor();
    private NewId();
    InsertAt(pos: number, data: T): void;
    Add(data: T): void;
    Remove(): void;
    Prune(): Tree<T>;
    Reduce(fn: (acc: any, cur: T) => any, start?: any): any;
    Clone(): Tree<T>;
    private DuplicateNode();
    Filter(condition: (node: ITreeNode<T>) => boolean): Tree<T>;
    Select(condition?: (node: ITreeNode<T>) => boolean, acc?: List<Tree<T>>): List<Tree<T>>;
    Find(condition: (data: T) => boolean): ITreeNode<T>;
    Contains(condition: (data: T) => boolean): boolean;
}
