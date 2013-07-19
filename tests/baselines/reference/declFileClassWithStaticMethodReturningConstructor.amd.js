define(["require", "exports"], function(require, exports) {
    var Enhancement = (function () {
        function Enhancement() {
        }
        Enhancement.getType = function () {
            return this;
        };
        return Enhancement;
    })();
    exports.Enhancement = Enhancement;
});

////[declFileClassWithStaticMethodReturningConstructor.d.ts]
export declare class Enhancement {
    static getType(): {
        getType(): typeof Enhancement;
        new(): Enhancement;
    };
}
