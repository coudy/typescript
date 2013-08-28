// @declaration: true

export declare module 'm' {
    export var x: number;
}

export import a = require('m');
var y = a.x;

export import b = a;
var z = b.x;