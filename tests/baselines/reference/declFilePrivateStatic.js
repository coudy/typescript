//// [declFilePrivateStatic.js]
var C = (function () {
    function C() {
    }
    C.a = function () {
    };
    C.b = function () {
    };

    Object.defineProperty(C, "c", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(C, "d", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(C, "e", {
        set: function (v) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(C, "f", {
        set: function (v) {
        },
        enumerable: true,
        configurable: true
    });
    C.x = 1;
    C.y = 1;
    return C;
})();


////[declFilePrivateStatic.d.ts]
declare class C {
    private static x;
    static y: number;
    private static a();
    static b(): void;
    private static c;
    static d : number;
    private static e;
    static f : any;
}
