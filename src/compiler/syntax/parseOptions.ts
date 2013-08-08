///<reference path='references.ts' />

module TypeScript {
    export class ParseOptions {
        private _languageVersion: LanguageVersion;
        private _allowAutomaticSemicolonInsertion: boolean;
        private _allowModuleKeywordInExternalModuleReference: boolean;

        constructor(languageVersion: LanguageVersion,
                    allowAutomaticSemicolonInsertion: boolean,
                    allowModuleKeywordInExternalModuleReference: boolean) {
            this._languageVersion = languageVersion;
            this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
            this._allowModuleKeywordInExternalModuleReference = allowModuleKeywordInExternalModuleReference;
        }


        public toJSON(key: any) {
            return { allowAutomaticSemicolonInsertion: this._allowAutomaticSemicolonInsertion,
                     allowModuleKeywordInExternalModuleReference: this._allowModuleKeywordInExternalModuleReference };
         }

        public languageVersion(): LanguageVersion {
            return this._languageVersion;
        }

        public allowAutomaticSemicolonInsertion(): boolean {
            return this._allowAutomaticSemicolonInsertion;
        }

        public allowModuleKeywordInExternalModuleReference(): boolean {
            return this._allowModuleKeywordInExternalModuleReference;
        }

    }
}