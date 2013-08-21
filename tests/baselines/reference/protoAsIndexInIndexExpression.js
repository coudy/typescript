var EntityPrototype = undefined;
var WorkspacePrototype = {
    serialize: function () {
    }
};
WorkspacePrototype['__proto__'] = EntityPrototype;

var o = {
    "__proto__": 0
};
var C = (function () {
    function C() {
        this["__proto__"] = 0;
    }
    return C;
})();

var p = require("__proto__");
p.x;

