//// [exportEqualErrorType_0.js]
//// [exportEqualErrorType_1.js]
define(["require", "exports", 'connect'], function(require, exports, connect) {
    
    connect().use(connect.static('foo'));
});
