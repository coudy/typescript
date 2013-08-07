// Bug 755706: Invalid codegen when returning an unassiged variable from function in module
module Bar {
    export var a = 1;
    function fooA() { return a; } // Correct: return Bar.a

    export var b;
    function fooB() { return b; } // Incorrect: return b
}
