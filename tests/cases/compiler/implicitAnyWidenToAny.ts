//@disallowimplicitany: true
// these should be errors
var x = null;                        // error at "x"
var x1 = undefined;		             // error at "x1"
var widenArray = [null, undefined];  // error at "widenArray"
var emptyArray = [];		         // error at "emptyArray"

// these should not be error
class AnimalObj {
      x:any;
}
var foo = 5;
var bar = "Hello World";
var foo1: any = null;
var foo2: any = undefined;
var temp: number = 5;
var c: AnimalObj = { x: null }; 
var array1 = ["Bob",2];
var array2: any[] = [];
var array3: any[] = [null, undefined];
var array4: number[] = [null, undefined];