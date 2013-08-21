// @module: commonjs
var EntityPrototype = undefined;
var WorkspacePrototype = {
    serialize: function (): any {
    }
};
WorkspacePrototype['__proto__'] = EntityPrototype;

var o = {
    "__proto__": 0
};
class C {
    "__proto__" = 0;
}
declare module "__proto__" { export var x; }
import p = require("__proto__");
p.x;