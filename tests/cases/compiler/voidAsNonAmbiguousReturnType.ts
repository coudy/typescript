//@module: commonjs
// @Filename: voidAsNonAmbiguousReturnType_0.ts
declare module "fs" {
    export function mkdirSync(path: string, mode?: number): void;
    export function mkdirSync(path: string, mode?: string): void;
}

// @Filename: voidAsNonAmbiguousReturnType_1.ts
///<reference path='voidAsNonAmbiguousReturnType_0.ts'/>
import fs = require("fs");

function main() {
 fs.mkdirSync('test'); // should not error - return types are the same
}
