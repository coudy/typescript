class C1 {
    x: string;
    y: C1;
}

class C2 {
    test() { return true; }
}

interface I1 {
    (a: string, b: string): string;
    (x: number, y: number): I1;
};

interface I2 {
    x: string;
    y: number;
}

export var e: C1;
export var f: I1;
export var g: C2;
export var h: I2;