class C {
    static [s: string]: number;
    [s: string]: string;

    static foo: number;
    static bar: string;

    foo: number;
    bar: string;

    constructor() { } // Ok, since it is not a named property
}