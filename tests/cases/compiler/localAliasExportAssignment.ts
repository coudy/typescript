//@module: commonjs
// @Filename: localAliasExportAssignment_0.ts
declare module 'connect' {

    var server: {

        (): any;

    };

    export = server;

}

// @Filename: localAliasExportAssignment_1.ts
///<reference path='localAliasExportAssignment_0.ts'/>
import connect = require('connect');

connect();


