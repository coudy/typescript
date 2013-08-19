//@module: amd
declare module 'aMod' {
    export var x: number;
}

import a = require('aMod');

function fn(arg: { x: number }) {
}

a.x; // OK
fn(a); // Error: property 'x' is missing from 'a'
