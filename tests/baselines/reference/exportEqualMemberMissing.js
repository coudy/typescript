//// [exportEqualMemberMissing_0.js]
//// [exportEqualMemberMissing_1.js]
///<reference path='exportEqualMemberMissing_0.ts'/>
var connect = require('connect');
connect().use(connect.static('foo'));

