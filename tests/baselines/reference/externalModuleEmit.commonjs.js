////[module1.js]
exports.q1 = 3;
////[module2.js]
exports.q2 = 3;
////[test.js]
var m1 = require("./module1")
var m2 = require('./module2')
var m3 = require('module3')
var m4 = require("module3")
var m5 = require('module4')
var m6 = require("module4")
var q = 3;
m1.q1 = q;
m2.q2 = q;
m3.q3 = q;
m4.q3 = q;
m5.q4 = q;
m6.q4 = q;