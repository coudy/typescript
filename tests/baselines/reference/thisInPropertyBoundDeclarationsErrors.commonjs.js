var B = (function () {
    function B() {        var _this = this;

        this.prop1 = this;
        this.prop2 = function () {
            return _this;
        };
        this.prop3 = function () {
            return function () {
                return function () {
                    var _this = this;
                    return function () {
                        return _this;
                    };
                };
            };
        };
        this.prop4 = '  ' + function () {
        } + ' ' + function () {
            return function () {
                var _this = this;
                return function () {
                    return _this;
                };
            };
        };
        this.prop5 = {
            a: function () {
                return _this;
            }
        };
        this.prop6 = function () {
            var _this = this;
            return {
                a: function () {
                    return _this;
                }
            };
        };
    }
    return B;
})();