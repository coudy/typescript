define(["require", "exports"], function(require, exports) {
    var Greeter = (function () {
        function Greeter() {
        }
        Greeter.prototype.greet = function () {
            return 'greet';
        };
        return Greeter;
    })();
    exports.Greeter = Greeter;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    
    var Hello = (function (_super) {
        __extends(Hello, _super);
        function Hello() {
            _super.apply(this, arguments);
        }
        return Hello;
    })(Greeter);
});
