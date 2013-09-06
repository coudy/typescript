//@module: commonjs
// @Filename: importDeclarationUsedAsTypeQuery_require.ts
declare module 'a' {
    export class B {
        id: number;
    }
}
// @Filename: importDeclarationUsedAsTypeQuery_1.ts
///<reference path='importDeclarationUsedAsTypeQuery_require.ts'/>
import a = require('a');
var x: typeof a;
