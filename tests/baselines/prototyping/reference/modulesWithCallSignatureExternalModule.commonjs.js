////[moduleWithAmbientCallSignatureTest.js]
var s = require("externalModuleWithAmbientCallSignature")
exports.d = s.foo();
exports.e = s.foo.x;
exports.y = s();
exports.z = new s();
////[moduleWithAmbientCallSignatureTest.d.ts]
import s = module ("externalModuleWithAmbientCallSignature");
export var d: string;
export var e: number;
export var y: string;
export var z: s.foo.b;