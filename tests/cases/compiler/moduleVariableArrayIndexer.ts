// bug 755711: Invalid codegen for second use of variable in module

module Bar {
    export var a = 1;
    var t = undefined[a][a]; // CG: var t = undefined[Bar.a][a];
}
