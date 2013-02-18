// @target: ES5

class Foo {
    private _value: number;
    public set value(value: number) {
        this._value = value;
    }
    public get keys(): string[] {
        return keys('b');
    }
}
function keys(val: string) {
    return [ val ];
}
