//// class then var
//class c1 { public foo() { } }
//var c1 = 1; // error

//// class then function
//class c2 { public foo() { } }
//function c2() { } // error
//var c2 = () => { }

//// class then class
//class c3 { public foo() { } }
//class c3 { public bar() { } } // error

//// class then enum
//class c4 { public foo() { } }
//enum c4 { One } // error

// class then module
class c5 { public foo() { } }
// BUG 694384
module c5 { } // should be ok

class c5a { public foo() { } }
// BUG 694384
module c5a { var y = 2; } // should be ok

class c5b { public foo() { } }
// BUG 694384
module c5b { export var y = 2; } // should be ok

//// class then import
class c5c { public foo() { } }
import c5c = require('');