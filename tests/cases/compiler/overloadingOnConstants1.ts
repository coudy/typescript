class Base { foo() { } }
class Derived1 extends Base { bar() { } }
class Derived2 extends Base { baz() { } }
class Derived3 extends Base { biz() { } }

interface Document2 {
    createElement(tagName: string): Base;
    createElement(tagName: 'canvas'): Derived1;
    createElement(tagName: 'div'): Derived2;
    createElement(tagName: 'span'): Derived3;
}

var d2: Document2;

// this is ok
var htmlElement: Base = d2.createElement("yo")

// these are errors (we pick the first overload even though it is not a string constant)
var htmlCanvasElement: Derived1 = d2.createElement("canvas");
var htmlDivElement: Derived2 = d2.createElement("div");
var htmlSpanElement: Derived3 = d2.createElement("span");
var htmlElement2: Derived1 = d2.createElement("yo")
var htmlCanvasElement2: Derived3 = d2.createElement("canvas");
var htmlDivElement2: Derived1 = d2.createElement("div");
var htmlSpanElement2: Derived1 = d2.createElement("span");