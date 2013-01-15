class C1 {
    set: bool;
    get = 1;
}
class C2 {
    set;
}
class C3 {
    set (x) {
        return x + 1;
    };
}
class C4 {
    get: bool = true;
}
class C5 {
    public set: () => bool = function () { return true; };
    get (): bool { return true; }
    set t(x) { };
}
