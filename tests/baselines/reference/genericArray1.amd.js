/*
var n: number[];

interface Array<T> {
map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}

interface String{
length: number;
}
*/
var lengths = ["a", "b", "c"].map(function (x) {
    return x.length;
});

////[0.d.ts]
declare var lengths: number[];
