export default function Initable<T extends Constructor>(Base: T): T & ICtor<IInitable<T>>;
