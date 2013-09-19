class Foo {
    x() {
        var _this = 10; // Local var. No this capture in x(), so no conflict.
        function inner(_this: number) { // Error 
            return x => this;   // New scope.  So should inject new _this capture into function inner
        }
    }
    y() {
        var lamda = (_this: number) => { // Error 
            return x => this;   // New scope.  So should inject new _this capture
        }
    }
    z(_this: number) { // Error 
        var lambda = () => {
            return x => this;   // New scope.  So should inject new _this capture
        }
    }

    x1() {
        var _this = 10; // Local var. No this capture in x(), so no conflict.
        function inner(_this: number) { // No Error 
        }
    }
    y1() {
        var lamda = (_this: number) => { // No Error 
        }
    }
    z1(_this: number) { // No Error 
        var lambda = () => {
        }
    }
}