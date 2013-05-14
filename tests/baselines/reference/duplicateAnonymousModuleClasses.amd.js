module;
 {
}

var Helper = (function () {
    function Helper() {
    }
    return Helper;
})();

module;
 {
}

var Helper = (function () {
    function Helper() {
    }
    return Helper;
})();

var Foo;
(function (Foo) {
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    })();
})(Foo || (Foo = {}));

var Foo;
(function (Foo) {
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    })();
})(Foo || (Foo = {}));

var Gar;
(function (Gar) {
    var Foo;
    (function (Foo) {
        var Helper = (function () {
            function Helper() {
            }
            return Helper;
        })();
    })(Foo || (Foo = {}));

    var Foo;
    (function (Foo) {
        var Helper = (function () {
            function Helper() {
            }
            return Helper;
        })();
    })(Foo || (Foo = {}));
})(Gar || (Gar = {}));
