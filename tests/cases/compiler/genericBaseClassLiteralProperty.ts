// bug 766872: function with type parameter in generic base class

class BaseClass<T> {
    public _getValue1: { (): T; };
    public _getValue2: () => T;
}

class SubClass extends BaseClass<number> {
    public Error(): void {

        var x : number = this._getValue1();
        var y : number = this._getValue2();
    }
}