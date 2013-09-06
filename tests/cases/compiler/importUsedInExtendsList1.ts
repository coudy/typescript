//@module: commonjs
// @Filename: importUsedInExtendsList1_require.ts
declare module 'base' {
    export class Super { }
}

// @Filename: importUsedInExtendsList1_1.ts
///<reference path='importUsedInExtendsList1_require.ts'/>
import foo = require('base');
class Sub extends foo.Super { }
