// @Filename: module1.ts
export var q1 = 3;

// @Filename: module2.ts
export var q2 = 3;

// @Filename: test.ts
import m1 = module("module1");
import m2 = module('module2');
declare module "module3" {
    export var q3: number;
}
import m3 = module('module3');
import m4 = module("module3");
declare module 'module4' {
    export var q4: number;
}
import m5 = module('module4');
import m6 = module("module4");
var q = 3;
m1.q1 = q;
m2.q2 = q;
m3.q3 = q;
m4.q3 = q;
m5.q4 = q;
m6.q4 = q;
