export default class Pool<T extends IPoolable> implements IPool<IPoolable> {
    private pool: Array<T> = [];
    private growthStep: number;
    private cls: any;
    private available: number = 0;
    private size: number = 0;
    
    public get Available() : number {
        return this.available;
    }    
    public get Size() : number {
        return this.size;
    }    

    constructor(cls: ICtor<T>, growthStep: number = 10) {
        this.cls = cls;
        this.growthStep = growthStep;
        this.Create();
    }
    private Create() {
        let i = 0;
        for (; i < this.growthStep; i++) {
            this.pool.push(<T>new this.cls());
        }
        this.size += this.growthStep;
        this.available += this.growthStep;
    }
    public Get(): T {
        let result: T;
        if (this.pool.length === 0) {
            this.Create();
        }
        result = this.pool.pop();
        --this.available;
        result.InitPool(this);
        return result;
    }
    public Release(obj: T): void {
        this.pool.push(obj);
        ++this.available;
    }
}
