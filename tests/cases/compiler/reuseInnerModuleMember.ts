//@module: commonjs
// @Filename: reuseInnerModuleMember_0.ts
declare module 'foo' { }

// @Filename: reuseInnerModuleMember_1.ts
///<reference path='reuseInnerModuleMember_0.ts'/>
declare module bar {

    interface alpha { }

}

import f = require('foo');

module bar {

    var x: alpha;

}
