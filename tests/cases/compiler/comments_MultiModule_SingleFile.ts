// @target: ES5
// @declaration: true
// @comments: true

/// this is multi declare module
module multiM {
    /// class b
    export class b {
    }
}
/// thi is multi module 2
module multiM {
    /// class c comment
    export class c {
    }
}
new multiM.b();
new multiM.c();