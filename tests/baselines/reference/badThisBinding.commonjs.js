var Greeter = (function () {
    function Greeter() {
        var _this = this;
        foo(function () {
            var _this = this;
            bar(function () {
                console.log(_this);
            });
        });
    }
    return Greeter;
})();