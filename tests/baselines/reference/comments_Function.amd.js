// @target: ES5
// @declaration: true
// @comments: true
/** This comment should appear for foo*/
function foo() {
}
foo();
/** This is comment for function signature*/
function fooWithParameters(/** this is comment about a*/ a, /** this is comment for b*/
b) {
    var d = a;
}
fooWithParameters("a", 10);
/** fooFunc
* comment
*/
var fooFunc = function FooFunctionValue(/** fooFunctionValue param */ b) {
    return b;
};
/// lamdaFoo var comment
var lambdaFoo = /** this is lambda comment*/ function (/**param a*/ a, /**param b*/ b) {
    return a + b;
};
var lambddaNoVarComment = /** this is lambda multiplication*/ function (/**param a*/ a, /**param b*/ b) {
    return a * b;
};
lambdaFoo(10, 20);
lambddaNoVarComment(10, 20);
////[0.d.ts]
/** This comment should appear for foo*/
function foo(): void;
/** This is comment for function signature*/
function fooWithParameters(/** this is comment about a*/ a: string, /** this is comment for b*/
    b: number): void;
/** fooFunc
* comment
*/
var fooFunc: (b: string) => string;
var lambdaFoo: (a: number, b: number) => number;
var lambddaNoVarComment: (a: number, b: number) => number;