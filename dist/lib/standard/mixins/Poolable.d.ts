export default function Poolable<T extends Constructor>(Base: T): T & ICtor<IPoolable>;
