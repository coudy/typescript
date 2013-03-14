module TypeScript {
    export class Debug {
        public static assert(expression: bool): void {
            if (!expression) {
                throw new Error("Debug Failure. False expression.");
            }
        }
    }
}