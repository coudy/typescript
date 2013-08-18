// ok - overload signatures are assignment compatible with their implementation
var Accessor = (function () {
    function Accessor() {
    }
    return Accessor;
})();

function attr(nameOrMap, value) {
    if (nameOrMap && typeof nameOrMap === "object") {
        // handle map case
        return new Accessor();
    } else {
        // handle string case
        return "s";
    }
}

// not ok - there's an assignment compat error


function attr2(nameOrMap, value) {
    if (nameOrMap && typeof nameOrMap === "object") {
        // handle map case
        return "t";
    } else {
        // handle string case
        return "s";
    }
}

// error - signatures are not assignment compatible

function foo() {
    return "a";
}
;
