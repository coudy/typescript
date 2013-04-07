
interface Promise<T> {
    then<A>(success?: (value: T) => Promise<A>): Promise<A>;
    then<B>(success?: (value: T) => B): Promise<B>;
    data: T;
}

var p: Promise<number> = null;
var p2 = p.then(function (x) {
    return p;
} );

var x: string = p2.data; // should be ‘number’

