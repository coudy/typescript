//// [exportEqualErrorType_0.js]
//// [exportEqualErrorType_1.js]
define(["require", "exports", 'connect'], function(require, exports, __connect__) {
    ///<reference path='exportEqualErrorType_0.ts'/>
    var connect = __connect__;
    connect().use(connect.static('foo'));
});
