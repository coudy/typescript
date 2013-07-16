///<reference path='references.ts' />

module TypeScript {
    export class ParseOptions {
        private _languageVersion: LanguageVersion;
        private _moduleGenTarget: ModuleGenTarget;
        private _allowAutomaticSemicolonInsertion: boolean;

        constructor(languageVersion: LanguageVersion,
                    moduleGenTarget: ModuleGenTarget,
                    allowAutomaticSemicolonInsertion: boolean) {
            this._languageVersion = languageVersion;
            this._moduleGenTarget = moduleGenTarget;
            this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
        }

        public toJSON(key) {
            return { allowAutomaticSemicolonInsertion: this._allowAutomaticSemicolonInsertion };
        }

        public languageVersion(): LanguageVersion {
            return this._languageVersion;
        }

        public moduleGenTarget(): ModuleGenTarget {
            return this._moduleGenTarget;
        }

        public allowAutomaticSemicolonInsertion(): boolean {
            return this._allowAutomaticSemicolonInsertion;
        }
    }
}