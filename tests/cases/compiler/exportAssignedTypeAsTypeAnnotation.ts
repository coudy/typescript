//@module: amd

// @Filename: exportAssignedTypeAsTypeAnnotation_0.ts
declare module "test" {
    interface x {
        (): Date;
        foo: string;
    }
    export = x;
}
 
// @Filename: exportAssignedTypeAsTypeAnnotation_1.ts
///<reference path='exportAssignedTypeAsTypeAnnotation_0.ts'/>
import test = require('test');
var t2: test; // should not raise a 'container type' error
