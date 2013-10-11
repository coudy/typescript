///<reference path='references.ts' />

module TypeScript {
    /// Compiler settings
    export class CompilationSettings {
        public propagateEnumConstants: boolean = false;
        public removeComments: boolean = false;
        public watch: boolean = false;
        public noResolve: boolean = false;
        public allowAutomaticSemicolonInsertion: boolean = true;
        public noImplicitAny: boolean = false;
        public noLib: boolean = false;
        public codeGenTarget: LanguageVersion = LanguageVersion.EcmaScript3;
        public moduleGenTarget: ModuleGenTarget = ModuleGenTarget.Unspecified;
        public outFileOption: string = "";
        public outDirOption: string = "";
        public mapSourceFiles: boolean = false;
        public mapRoot: string = "";
        public sourceRoot: string = "";
        public generateDeclarationFiles: boolean = false;
        public useCaseSensitiveFileResolution: boolean = false;
        public gatherDiagnostics: boolean = false;
        public codepage: number = null
    }

    export class ImmutableCompilationSettings {
        private static _defaultSettings: ImmutableCompilationSettings;

        private _propagateEnumConstants: boolean;
        private _removeComments: boolean;
        private _watch: boolean;
        private _noResolve: boolean;
        private _allowAutomaticSemicolonInsertion: boolean;
        private _noImplicitAny: boolean;
        private _noLib: boolean;
        private _codeGenTarget: LanguageVersion;
        private _moduleGenTarget: ModuleGenTarget;
        private _outFileOption: string;
        private _outDirOption: string;
        private _mapSourceFiles: boolean;
        private _mapRoot: string;
        private _sourceRoot: string;
        private _generateDeclarationFiles: boolean;
        private _useCaseSensitiveFileResolution: boolean;
        private _gatherDiagnostics: boolean;
        private _codepage: number;

        public propagateEnumConstants1() { return this._propagateEnumConstants; }
        public removeComments1() { return this._removeComments; }
        public watch1() { return this._watch; }
        public noResolve1() { return this._noResolve; }
        public allowAutomaticSemicolonInsertion1() { return this._allowAutomaticSemicolonInsertion; }
        public noImplicitAny1() { return this._noImplicitAny; }
        public noLib1() { return this._noLib; }
        public codeGenTarget1() { return this._codeGenTarget; }
        public moduleGenTarget1() { return this._moduleGenTarget; }
        public outFileOption1() { return this._outFileOption; }
        public outDirOption1() { return this._outDirOption; }
        public mapSourceFiles1() { return this._mapSourceFiles; }
        public mapRoot1() { return this._mapRoot; }
        public sourceRoot1() { return this._sourceRoot; }
        public generateDeclarationFiles1() { return this._generateDeclarationFiles; }
        public useCaseSensitiveFileResolution1() { return this._useCaseSensitiveFileResolution; }
        public gatherDiagnostics1() { return this._gatherDiagnostics; }
        public codepage1() { return this._codepage; }

        constructor(
            propagateEnumConstants: boolean,
            removeComments: boolean,
            watch: boolean,
            noResolve: boolean,
            allowAutomaticSemicolonInsertion: boolean,
            noImplicitAny: boolean,
            noLib: boolean,
            codeGenTarget: LanguageVersion,
            moduleGenTarget: ModuleGenTarget,
            outFileOption: string,
            outDirOption: string,
            mapSourceFiles: boolean,
            mapRoot: string,
            sourceRoot: string,
            generateDeclarationFiles: boolean,
            useCaseSensitiveFileResolution: boolean,
            gatherDiagnostics: boolean,
            codepage: number) {

            this._propagateEnumConstants = propagateEnumConstants;
            this._removeComments = removeComments;
            this._watch = watch;
            this._noResolve = noResolve;
            this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
            this._noImplicitAny = noImplicitAny;
            this._noLib = noLib;
            this._codeGenTarget = codeGenTarget;
            this._moduleGenTarget = moduleGenTarget;
            this._outFileOption = outFileOption;
            this._outDirOption = outDirOption;
            this._mapSourceFiles = mapSourceFiles;
            this._mapRoot = mapRoot;
            this._sourceRoot = sourceRoot;
            this._generateDeclarationFiles = generateDeclarationFiles;
            this._useCaseSensitiveFileResolution = useCaseSensitiveFileResolution;
            this._gatherDiagnostics = gatherDiagnostics;
            this._codepage = codepage;
        }

        public static defaultSettings() {
            if (!ImmutableCompilationSettings._defaultSettings) {
                ImmutableCompilationSettings._defaultSettings = ImmutableCompilationSettings.fromCompilationSettings(new CompilationSettings());
            }

            return ImmutableCompilationSettings._defaultSettings;
        }

        public static fromCompilationSettings(settings: CompilationSettings): ImmutableCompilationSettings {
            return new ImmutableCompilationSettings(
                settings.propagateEnumConstants,
                settings.removeComments,
                settings.watch,
                settings.noResolve,
                settings.allowAutomaticSemicolonInsertion,
                settings.noImplicitAny,
                settings.noLib,
                settings.codeGenTarget,
                settings.moduleGenTarget,
                settings.outFileOption,
                settings.outDirOption,
                settings.mapSourceFiles,
                settings.mapRoot,
                settings.sourceRoot,
                settings.generateDeclarationFiles,
                settings.useCaseSensitiveFileResolution,
                settings.gatherDiagnostics,
                settings.codepage);
        }

        public toJSON(): any {
            var result = {};

            for (var name in this) {
                if (this.hasOwnProperty(name) && StringUtilities.startsWith(name, "_")) {
                    result[name.substr(1)] = this[name];
                }
            }

            return result;
        }
    }
}