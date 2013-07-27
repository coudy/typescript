class Sammy {
   foo() { return "hi"; }
  static bar() {
    return -1;
   }
}
module Sammy {
    export var x = 1;
}
interface JQueryStatic {
    sammy: Sammy;
}
var $: JQueryStatic;
var instanceOfClassSammy = new $.sammy(); // should be error (bug 725997)
var r1 = instanceOfClassSammy.foo(); // r1 is string
var r2 = $.sammy.foo();
var r3 = $.sammy.bar(); // error
var r4 = $.sammy.x; // error

Sammy.bar();