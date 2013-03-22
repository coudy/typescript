///<reference path='References.ts' />

module TypeScript {
    export class MathPrototype {
        public static max(a: number, b: number): number {
            return a >= b ? a : b;
        }

        public static min(a: number, b: number): number {
            return a <= b ? a : b;
        }
    }
}