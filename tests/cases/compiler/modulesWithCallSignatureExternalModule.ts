// @declaration: true

// @Filename: externalModuleWithAmbientCallSignature.d.ts
export declare module foo {
    export function (): string;
    export var x: number;
    class b {
        public d: string;
    }
}
declare export function (): string;
declare export function new (): foo.b;


// @Filename: moduleWithAmbientCallSignatureTest.ts
import s = module("externalModuleWithAmbientCallSignature");
export var d = s.foo();
export var e = s.foo.x;
export var y = s();
export var z = new s();