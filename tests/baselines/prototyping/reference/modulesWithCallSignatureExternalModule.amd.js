////[moduleWithAmbientCallSignatureTest.js]
define(["require", "exports", "externalModuleWithAmbientCallSignature"], function(require, exports, __s__) {
    var s = __s__;

    exports.d = s.foo();
    exports.e = s.foo.x;
    exports.y = s();
    exports.z = new s();
})
////[moduleWithAmbientCallSignatureTest.d.ts]
import s = module ("externalModuleWithAmbientCallSignature");
export var d: string;
export var e: number;
export var y: string;
export var z: s.foo.b;