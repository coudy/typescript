// @Filename: exportEqualsVar_A.ts
var x = 0;

export = x;

// @Filename: exportEqualsVar_B.ts
import y = require("exportEqualsVar_A");

var n: number = y;