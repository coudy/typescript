///<reference path='references.ts' />

module TypeScript {
    export class ParseOptions {
        private _allowAutomaticSemicolonInsertion: boolean;

        constructor(allowAutomaticSemicolonInsertion: boolean) {
            this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
        }

        public toJSON(key) {
            return { allowAutomaticSemicolonInsertion: this._allowAutomaticSemicolonInsertion };
        }

        public allowAutomaticSemicolonInsertion(): boolean {
            return this._allowAutomaticSemicolonInsertion;
        }
    }
}