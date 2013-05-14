interface IFoo<T> {
    x: T;
}

interface Array<T> extends IFoo<T> { }
