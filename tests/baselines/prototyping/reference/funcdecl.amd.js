function simpleFunc() {
    return "this is my simple func";
}
var simpleFuncVar = simpleFunc;
function anotherFuncNoReturn() {
}
var anotherFuncNoReturnVar = anotherFuncNoReturn;
function withReturn() {
    return "Hello";
}
var withReturnVar = withReturn;
function withParams(a) {
    return a;
}
var withparamsVar = withParams;
function withMultiParams(a, b, c) {
    return a;
}
var withMultiParamsVar = withMultiParams;
function withOptionalParams(a) {
}
var withOptionalParamsVar = withOptionalParams;
function withInitializedParams(a, b0, b, c) {
    if (typeof b === "undefined") { b = 30; }
    if (typeof c === "undefined") { c = "string value"; }
}
var withInitializedParamsVar = withInitializedParams;
function withOptionalInitializedParams(a, c) {
    if (typeof c === "undefined") { c = "hello string"; }
}
var withOptionalInitializedParamsVar = withOptionalInitializedParams;
function withRestParams(a) {
    var myRestParameter = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        myRestParameter[_i] = arguments[_i + 1];
    }
    return myRestParameter;
}
var withRestParamsVar = withRestParams;
function overload1(ns) {
    return ns.toString();
}
var withOverloadSignature = overload1;
function f(n) {
}
var m2;
(function (m2) {
    function foo(n) {
    }
    m2.foo = foo;
})(m2 || (m2 = {}));
m2.foo(function () {
    var b = 30;
    return b;
});
var f2 = function () {
    return "string";
};
////[0.d.ts]
function simpleFunc(): string;
var simpleFuncVar: () => string;
function anotherFuncNoReturn(): void;
var anotherFuncNoReturnVar: () => void;
function withReturn(): string;
var withReturnVar: () => string;
function withParams(a: string): string;
var withparamsVar: (a: string) => string;
function withMultiParams(a: number, b, c: Object): number;
var withMultiParamsVar: (a: number, b: any, c: Object) => number;
function withOptionalParams(a?: string): void;
var withOptionalParamsVar: (a?: string) => void;
function withInitializedParams(a: string, b0, b?: number, c?: string): void;
var withInitializedParamsVar: (a: string, b0: any, b?: number, c?: string) => void;
function withOptionalInitializedParams(a: string, c?: string): void;
var withOptionalInitializedParamsVar: (a: string, c?: string) => void;
function withRestParams(a: string, ...myRestParameter: {}[]): {}[];
var withRestParamsVar: (a: string, myRestParameter?: {}[]) => {}[];
function overload1(n: number): string;
function overload1(s: string): string;
var withOverloadSignature: {
    (n: number): string;
    (s: string): string;
};
function f(n: () => void): void;
module m2 {
    function foo(n: () => void): void;
}
var f2: () => string;