///<reference path='References.ts' />

module TypeScript {
    export class Debug {
        public static assert(expression: bool, message?: string): void {
            if (!expression) {
                throw new Error("Debug Failure. False expression." + (message ? message : ""));
            }
        }
    }
}