//﻿
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
///<reference path='typescriptServices.ts' />

module Services {

    //
    // An cache entry in HostCache 
    //
    export class HostCacheEntry {
        private _sourceText: TypeScript.IScriptSnapshot;

        constructor(
            private fileName: string,
            private host: ILanguageServiceHost,
            public version: number) {
            this._sourceText = null;
        }
        
        public getScriptSnapshot(): TypeScript.IScriptSnapshot {
            if (this._sourceText === null) {
                this._sourceText = this.host.getScriptSnapshot(this.fileName);
            }

            return this._sourceText;
        }
    }

    //
    // Cache host information about scripts. Should be refreshed 
    // at each language service public entry point, since we don't know when 
    // set of scripts handled by the host changes.
    //
    export class HostCache {
        private map: TypeScript.StringHashTable;

        constructor(public host: ILanguageServiceHost) {
            // script id => script index
            this.map = new TypeScript.StringHashTable();

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];
                this.map.add(fileName, new HostCacheEntry(
                    fileName, this.host, this.host.getScriptVersion(fileName)));
            }
        }

        public contains(fileName: string): bool {
            return this.map.lookup(fileName) !== null;
        }

        public getFileNames(): string[]{
            return this.map.getAllKeys();
        }

        public getVersion(fileName: string): number {
            return this.map.lookup(fileName).version;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.map.lookup(fileName).getScriptSnapshot();
        }
    }

    export class CompilerState {
        private logger: TypeScript.ILogger;

        //
        // State related to compiler instance
        //
        private compiler: TypeScript.TypeScriptCompiler = null;

        private fileNameToCompilerScriptVersion: TypeScript.StringHashTable = null;
        private hostCache: HostCache = null;
        private symbolTree: SymbolTree = null;
        private _compilationSettings: TypeScript.CompilationSettings = null;

        constructor(private host: ILanguageServiceHost) {
            this.logger = this.host;
        }

        public compilationSettings() {
            return this._compilationSettings;
        }

        private onTypeCheckStarting(): void {
            this.symbolTree = new SymbolTree(this);
        }

        public getSymbolTree(): ISymbolTree {
            return this.symbolTree;
        }

        public getFileNames(): string[] {
            return this.compiler.fileNameToScript.getAllKeys();
        }

        public getScript(fileName: string): TypeScript.Script {
            return this.compiler.fileNameToScript.lookup(fileName)
        }

        public getScripts(): TypeScript.Script[] {
            return this.compiler.getScripts();
        }

        public getScriptVersion(fileName: string) {
            return this.hostCache.getVersion(fileName);
        }

        private addCompilerUnit(compiler: TypeScript.TypeScriptCompiler, fileName: string) {
            // Keep track of the version of script we're adding to the compiler.
            this.fileNameToCompilerScriptVersion.addOrUpdate(fileName, this.hostCache.getVersion(fileName));
            compiler.addSourceUnit(this.hostCache.getScriptSnapshot(fileName), fileName);
        }

        private getHostCompilationSettings(): TypeScript.CompilationSettings {
            var settings = this.host.getCompilationSettings();
            if (settings !== null) {
                return settings;
            }

            // Set "ES5" target by default for language service
            settings = new TypeScript.CompilationSettings();
            settings.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;

            return settings;
        }

        private createCompiler(): void {
            var outerr = { Write: (s) => { }, WriteLine: (s) => { }, Close: () => { } };

            // Create and initialize compiler
            this.logger.log("Initializing compiler");

            this._compilationSettings = new TypeScript.CompilationSettings();

            Services.copyDataObject(this.compilationSettings(), this.getHostCompilationSettings());
            this.compiler = new TypeScript.TypeScriptCompiler(outerr, this.logger, this.compilationSettings());
            this.fileNameToCompilerScriptVersion = new TypeScript.StringHashTable();

            // Add unit for all source files
            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                this.addCompilerUnit(this.compiler, fileNames[i]);
            }

            // Initial typecheck
            this.onTypeCheckStarting();
            this.compiler.pullTypeCheck(/*refresh:*/ false, /*reportErrors:*/ true);
        }

        public minimalRefresh(): void {
            //if (this.compiler === null) {
            //    this.refresh();
            //    return;
            //}

            // Reset the cache at start of every refresh
            this.hostCache = new HostCache(this.host);
        }

        public refresh(): void {
            // Reset the cache at start of every refresh
            this.hostCache = new HostCache(this.host);

            // If full refresh not needed, attempt partial refresh
            if (!this.fullRefresh()) {
                this.partialRefresh();
            }

            // Debugging: log version and unit index mapping data
            if (this.logger.information()) {
                var fileNames = this.compiler.fileNameToLocationInfo.getAllKeys();
                for (var i = 0; i < fileNames.length; i++) {
                    this.logger.log("compiler unit[" + i + "].fileName='" + fileNames[i] + "'");
                }

                fileNames = this.hostCache.getFileNames();
                for (var j = 0; j < fileNames.length; j++) {
                    var fileName = fileNames[j];
                    this.logger.log("host script[" + j + "].fileName='" + fileName + "', version=" + this.hostCache.getVersion(fileName));
                }
            }
        }

        //
        // Re-create a fresh compiler instance if needed. 
        // Return "true" if a fresh compiler instance was created. 
        //
        private fullRefresh(): bool {
            // Initial state: no compiler yet
            if (this.compiler == null) {
                this.logger.log("Creating new compiler instance because there is no currently active instance");
                this.createCompiler();
                return true;
            }

            // If any compilation settings changes, a new compiler instance is needed
            //if (!Services.compareDataObjects(this.compilationSettings, this.getHostCompilationSettings())) {
            //    this.logger.log("Creating new compiler instance because compilation settings have changed.");
            //    this.createCompiler();
            //    return true;
            //}

            /// If any file was deleted, we need to create a new compiler, because we are not
            /// even close to supporting removing symbols (unitindex will be all over the place
            /// if we remove scripts from the list).
            var fileNames = this.compiler.fileNameToLocationInfo.getAllKeys();
            for (var unitIndex = 0, len = fileNames.length; unitIndex < len; unitIndex++) {
                var fileName = fileNames[unitIndex];

                if (!this.hostCache.contains(fileName)) {
                    this.logger.log("Creating new compiler instance because of unit is not part of program anymore: " + unitIndex + "-" + fileName);
                    this.createCompiler();
                    return true;
                }
            }

            // We can attempt a partial refresh
            return false;
        }

        // Attempt an incremental refresh of the compiler state.
        private partialRefresh(): void {
            this.logger.log("Updating files...");

            var fileAdded: bool = false;

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];

                if (this.compiler.fileNameToLocationInfo.lookup(fileName)) {
                    this.updateCompilerUnit(this.compiler, fileName);
                }
                else {
                    this.addCompilerUnit(this.compiler, fileName);
                    fileAdded = true;
                }
            }

            if (fileAdded) {
                this.compiler.pullTypeCheck(true);
            }
        }

        public getScriptAST(fileName: string): TypeScript.Script {
            return <TypeScript.Script>this.compiler.fileNameToScript.lookup(fileName);
        }

        public getSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var syntaxTree = this.compiler.fileNameToSyntaxTree.lookup(fileName);
            if (syntaxTree === null) {
                syntaxTree = TypeScript.Parser1.parse(TypeScript.SimpleText.fromScriptSnapshot(this.getScriptSnapshot(fileName)));
                this.compiler.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
            }

            return syntaxTree;
        }

        public getLineMap(fileName: string): number[] {
            return this.compiler.fileNameToLocationInfo.lookup(fileName).lineMap;
        }

        public pullGetErrorsForFile(fileName: string): TypeScript.SemanticError[] {
            return this.compiler.pullGetErrorsForFile(fileName);
        }

        public getScriptTextChangeRangeSinceVersion(fileName: string, lastKnownVersion: number): TypeScript.TextChangeRange {
            var currentVersion = this.hostCache.getVersion(fileName);
            if (lastKnownVersion === currentVersion) {
                return TypeScript.TextChangeRange.unchanged; // "No changes"
            }

            var scriptSnapshot = this.hostCache.getScriptSnapshot(fileName);
            return scriptSnapshot.getTextChangeRangeSinceVersion(lastKnownVersion);
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.hostCache.getScriptSnapshot(fileName);
        }

        //
        // New Pull stuff
        //
        public getPullTypeInfoAtPosition(pos: number, script: TypeScript.Script) {
            return this.compiler.pullGetTypeInfoAtPosition(pos, script);
        }

        public getPullSymbolAtPosition(pos: number, script: TypeScript.Script) {
            return this.compiler.resolvePosition(pos, script);
        }

        public getSymbolInformationFromPath(path: TypeScript.AstPath, script: TypeScript.Script) {
            return this.compiler.pullGetSymbolInformationFromPath(path, script);
        }

        public getCallInformationFromPath(path: TypeScript.AstPath, script: TypeScript.Script) {
            return this.compiler.pullGetCallInformationFromPath(path, script);
        }

        public getVisibleMemberSymbolsFromPath(path: TypeScript.AstPath, script: TypeScript.Script) {
            return this.compiler.pullGetVisibleMemberSymbolsFromPath(path, script);
        }

        public getVisibleSymbolsFromPath(path: TypeScript.AstPath, script: TypeScript.Script) {
            return this.compiler.pullGetVisibleSymbolsFromPath(path, script);
        }

        private updateCompilerUnit(compiler: TypeScript.TypeScriptCompiler, fileName: string): void {
            var compilerScriptVersion: number = this.fileNameToCompilerScriptVersion.lookup(fileName);

            //
            // If file version is the same, assume no update
            //
            var version = this.hostCache.getVersion(fileName);
            if (compilerScriptVersion === version) {
                //logger.log("Assumed unchanged unit: " + unitIndex + "-"+ fileName);
                return;
            }

            var textChangeRange = this.getScriptTextChangeRangeSinceVersion(fileName, compilerScriptVersion);

            // Keep track of the version of script we're adding to the compiler.
            this.fileNameToCompilerScriptVersion.addOrUpdate(fileName, this.hostCache.getVersion(fileName));

            compiler.updateSourceUnit(fileName, this.hostCache.getScriptSnapshot(fileName), textChangeRange);
        }

        private getDocCommentsOfDecl(decl: TypeScript.PullDecl) {
            var ast = TypeScript.PullHelpers.getASTForDecl(decl, this.compiler.semanticInfoChain);
            if (ast && (ast.nodeType != TypeScript.NodeType.ModuleDeclaration || decl.getKind() != TypeScript.PullElementKind.Variable)) {
                return ast.getDocComments();
            }

            return [];
        }

        private getDocCommentArray(symbol: TypeScript.PullSymbol) {
            var docComments: TypeScript.Comment[] = [];
            if (!symbol) {
                return docComments;
            }
            var decls = symbol.getDeclarations();
            for (var i = 0; i < decls.length; i++) {
                docComments = docComments.concat(this.getDocCommentsOfDecl(decls[i]));
            }
            return docComments;
        }

        static getDefaultConstructorSymbolForDocComments(classSymbol: TypeScript.PullClassTypeSymbol) {
            if (classSymbol.getHasDefaultConstructor()) {
                // get from parent if possible
                var extendedTypes = classSymbol.getExtendedTypes();
                if (extendedTypes.length) {
                    return CompilerState.getDefaultConstructorSymbolForDocComments(<TypeScript.PullClassTypeSymbol>extendedTypes[0]);
                }
            }

            return classSymbol.getType().getConstructSignatures()[0];
        }

        public getDocComments(symbol: TypeScript.PullSymbol, useConstructorAsClass?: bool): string {
            if (!symbol) {
                return "";
            }
            var decls = symbol.getDeclarations();
            if (useConstructorAsClass && decls.length && decls[0].getKind() == TypeScript.PullElementKind.ConstructorMethod) {
                var classDecl = decls[0].getParentDecl();
                return TypeScript.Comment.getDocCommentText(this.getDocCommentsOfDecl(classDecl));
            }

            if (symbol.docComments === null) {
                var docComments: string = "";
                if (!useConstructorAsClass && symbol.getKind() == TypeScript.PullElementKind.ConstructSignature &&
                    decls.length && decls[0].getKind() == TypeScript.PullElementKind.Class) {
                    var classSymbol = <TypeScript.PullClassTypeSymbol>(<TypeScript.PullSignatureSymbol>symbol).getReturnType();
                    var extendedTypes = classSymbol.getExtendedTypes();
                    if (extendedTypes.length) {
                        docComments = this.getDocComments((<TypeScript.PullClassTypeSymbol>extendedTypes[0]).getConstructorMethod());
                    } else {
                        docComments = "";
                    }
                } else if (symbol.getKind() == TypeScript.PullElementKind.Parameter) {
                    var parameterComments: string[] = [];
                    var funcContainerList = symbol.findIncomingLinks(link => link.kind == TypeScript.SymbolLinkKind.Parameter);
                    for (var i = 0; i < funcContainerList.length; i++) {
                        var funcContainer = funcContainerList[i].start;
                        var funcDocComments = this.getDocCommentArray(funcContainer);
                        var paramComment = TypeScript.Comment.getParameterDocCommentText(symbol.getName(), funcDocComments);
                        if (paramComment != "") {
                            parameterComments.push(paramComment);
                        }
                    }
                    var paramSelfComment = TypeScript.Comment.getDocCommentText(this.getDocCommentArray(symbol));
                    if (paramSelfComment != "") {
                        parameterComments.push(paramSelfComment);
                    }
                    docComments = parameterComments.join("\n");
                } else {
                    var getSymbolComments = true;
                    if (symbol.getKind() == TypeScript.PullElementKind.FunctionType) {
                        var declarationList = symbol.findIncomingLinks(link => link.kind == TypeScript.SymbolLinkKind.TypedAs);
                        if (declarationList.length > 0) {
                            docComments = this.getDocComments(declarationList[0].start);
                            getSymbolComments = false;
                        }
                    }
                    if (getSymbolComments) {
                        docComments = TypeScript.Comment.getDocCommentText(this.getDocCommentArray(symbol));
                        if (docComments == "") {
                            if (symbol.getKind() == TypeScript.PullElementKind.CallSignature) {
                                var callList = symbol.findIncomingLinks(link => link.kind == TypeScript.SymbolLinkKind.CallSignature);
                                if (callList.length == 1) {
                                    var callTypeSymbol = <TypeScript.PullTypeSymbol>callList[0].start;
                                    if (callTypeSymbol.getCallSignatures().length == 1) {
                                        docComments = this.getDocComments(callTypeSymbol);
                                    }
                                }
                            }
                        }
                    }
                }
                symbol.docComments = docComments;
            }

            return symbol.docComments;
        }
    }
}