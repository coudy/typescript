// derived class constructors must contain a super call

class Base {
    x: string;
}

class Derived extends Base {
    constructor() { // error
    }
}

class Base2<T> {
    x: T;
}

class Derived2<T> extends Base2<T> {
    constructor() {
        // BUG 879122
        var r2 = () => super(); // no error
    }
}

class Derived3<T> extends Base2<T> {
    constructor() {
        var r = function () { super() } // error
    }
}

class Derived4<T> extends Base2<T> {
    constructor() {
        var r = super(); // ok
    }
}