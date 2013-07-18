interface f {
    groupBy<T>(): { [key: string]: T[]; };
}
var a: f;
var r = a.groupBy();