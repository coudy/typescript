/// <reference path="fourslash.ts" />

////declare module M {
////    function RegExp2(pattern: string): RegExp2;
////    export function RegExp2(pattern: string, flags: string): RegExp2;
////    export class RegExp2 {
////        constructor();
////    }
////}

goTo.bof();
// Bug 673512: Function signature export checking missed when removing 'declare' from module
// edit.deleteAtCaret('declare '.length);