//@module: amd

// @Filename: exportEqualCallable_0.ts
declare module 'connect' {
    var server: {
        (): any;
    };
    export = server;
}

// @Filename: exportEqualCallable_1.ts
///<reference path='exportEqualCallable_0.ts'/>
import connect = require('connect');
connect();
