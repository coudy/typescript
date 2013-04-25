class A {
  static bar(): string {
     return "";
    }
    foo(): number { return 1; }
}
 
class C2 extends A {}
 
var c2: C2;
c2.bar(); // error
