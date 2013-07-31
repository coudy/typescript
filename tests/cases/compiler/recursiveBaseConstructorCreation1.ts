class C1 {
public func(param: C2 /* Change param type to remove error */): any { }
}
class C2 extends C1 {
// Or uncomment this constructor to remove error
// constructor() { super(); }
}
var x = new C2(); // ERROR: Invalid new expression
