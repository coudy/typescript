//@module: commonjs
// @Filename: exportEqualMemberMissing_0.ts
declare module 'connect' {
    module server {
        export interface connectModule {
            (res, req, next): void;
        }
        export interface connectExport {
            use: (mod: connectModule) => connectExport;
        }
    }
    var server: {
        (): server.connectExport;
        foo: Date;
    };
    export = server;
}

// @Filename: exportEqualMemberMissing_1.ts
///<reference path='exportEqualMemberMissing_0.ts'/>
import connect = require('connect');
connect().use(connect.static('foo')); // Error	1	The property 'static' does not exist on value of type ''.
