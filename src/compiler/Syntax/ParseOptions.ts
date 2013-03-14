module TypeScript {
    export class ParseOptions {
        private _allowAutomaticSemicolonInsertion: bool;

        constructor(allowAutomaticSemicolonInsertion?: bool = true) {
            this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
        }

        public allowAutomaticSemicolonInsertion(): bool {
            return this._allowAutomaticSemicolonInsertion;
        }
    }
}