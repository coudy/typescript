module TypeScript {
    export class Contract {
        public static requires(expression: bool): void {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        }

        public static throwIfFalse(expression: bool): void {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        }

        public static throwIfNull(value: any): void {
            if (value === null) {
                throw new Error("Contract violated. Null value.");
            }
        }
    }
}