var Greeter = (function () {
    function Greeter() {
        var _this = this;
        foo(function () {
            bar(function () {
                var x = _this;
            });
        });
    }
    return Greeter;
})();
