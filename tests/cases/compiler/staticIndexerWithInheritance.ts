class C {
    static [s: string]: number;
}

class D extends C {
    static [n: number]: string;
    static foo: string;
}

class E {
    static [n: number]: string;
    static foo: string;
}

class F extends E {
    static [s: string]: number;
}