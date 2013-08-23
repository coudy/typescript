class A { a; }
class B { b; }
class C { c; }
class X<T> { x: T; }
class X1 { x: string; }
class X2 { x: string; }
function f(a: X1): A;
function f<T>(a: X<T>): B;
function f(a): any {
}

//var x1: X1;
//var x2: X2;
var xs: X<string>;
//var xn: X<number>;

//var t1 = f(x1);
//var t1: A; // OK

//var t2 = f(x2);
//var t2: A; // OK

var t3 = f(xs);
var t3: A; // Error because it matched the 2nd overload, however should have matched the 1st

//var t4 = f(xn);
//var t4: B; // OK
