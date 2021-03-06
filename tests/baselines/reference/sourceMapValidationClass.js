var Greeter = (function () {
    function Greeter(greeting) {
        var b = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            b[_i] = arguments[_i + 1];
        }
        this.greeting = greeting;
        this.x1 = 10;
    }
    Greeter.prototype.greet = function () {
        return "<h1>" + this.greeting + "</h1>";
    };

    Greeter.prototype.fn = function () {
        return this.greeting;
    };
    Object.defineProperty(Greeter.prototype, "greetings", {
        get: function () {
            return this.greeting;
        },
        set: function (greetings) {
            this.greeting = greetings;
        },
        enumerable: true,
        configurable: true
    });
    return Greeter;
})();
//# sourceMappingURL=sourceMapValidationClass.js.map
