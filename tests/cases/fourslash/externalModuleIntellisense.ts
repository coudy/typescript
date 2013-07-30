/// <reference path='fourslash.ts'/>

////declare module "expressx" {
////    export = express;
////    function express(): express.ExpressServer;
////    module express {
////        export interface ExpressServer {
////            enable(name: string): ExpressServer;
////            post(path: RegExp, handler: (req: Function) => void): void;
////        }
////        export class ExpressServerRequest {
////        }
////    }
////}
////import express = require('expressx');
////var x = express();

verify.numberOfErrorsInCurrentFile(0);
goTo.eof();
edit.insert("x.");
verify.completionListContains('enable');
verify.completionListContains('post');
verify.memberListCount(2);
