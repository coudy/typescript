class C {
    foo() { }
}
 
class D extends C {
    // BUG 773665
    x = super(); 
 
    constructor() {
        super();
 
        var y = () => {
	    // BUG 773665
            super(); 
        }
    }
}
 
var d = new D();
