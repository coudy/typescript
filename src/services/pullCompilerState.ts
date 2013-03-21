// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    export class PullCompilerState {
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

        public getFileNames(): string[]{
            return this.compiler.fileNameToScript.getAllKeys();
        }

        public getScript(fileName: string): TypeScript.Script {
            return this.compiler.fileNameToScript.lookup(fileName)
        }

        public getScripts(): TypeScript.Script[]{
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
            settings.codeGenTarget = TypeScript.CodeGenTarget.ES5;
            settings.usePull = true;
            return settings;
        }

        private createCompiler() {
            var outfile = { Write: (s) => { }, WriteLine: (s) => { }, Close: () => { } };
            var outerr = { Write: (s) => { }, WriteLine: (s) => { }, Close: () => { } };

            // Create and initialize compiler
            this.logger.log("Initializing compiler");

            this._compilationSettings = new TypeScript.CompilationSettings();
            
            Services.copyDataObject(this.compilationSettings(), this.getHostCompilationSettings());
            this._compilationSettings.usePull = true;
            this.compiler = new TypeScript.TypeScriptCompiler(outerr, this.logger, this.compilationSettings());
            this.fileNameToCompilerScriptVersion = new TypeScript.StringHashTable();

            // Add unit for all source files
            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                this.addCompilerUnit(this.compiler, fileNames[i]);
            }

            // Initial typecheck
            this.onTypeCheckStarting();
            this.compiler.pullTypeCheck(false, true);
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

        public createSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var sourceText = this.getScriptSnapshot(fileName);
            var text = new TypeScript.ScriptSnapshotText(sourceText);
            return TypeScript.Parser1.parse(text);
        }

        public getSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var syntaxTree = this.compiler.fileNameToSyntaxTree.lookup(fileName);
            if (syntaxTree === null) {
                syntaxTree = this.createSyntaxTree(fileName);
                this.compiler.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
            }

            return syntaxTree;
        }

        public setSyntaxTree(fileName: string, syntaxTree: TypeScript.SyntaxTree): void {
            this.compiler.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
        }

        public getLineMap(fileName: string): number[] {
            return this.compiler.fileNameToLocationInfo.lookup(fileName).lineMap;
        }

        public getScopeEntries(enclosingScopeContext: TypeScript.EnclosingScopeContext) {
            return new TypeScript.ScopeTraversal(this.compiler).getScopeEntries(enclosingScopeContext);
        }

        public pullGetErrorsForFile(fileName: string): TypeScript.SemanticError[] {
            return this.compiler.pullGetErrorsForFile(fileName);
        }

        public cleanASTTypesForReTypeCheck(ast: TypeScript.AST): void {
            this.compiler.cleanASTTypesForReTypeCheck(ast);
        }

        public getScriptTextChangeRange(fileName: string): TypeScript.TextChangeRange {
            var lastKnownVersion: number = this.fileNameToCompilerScriptVersion.lookup(fileName);
            return this.getScriptTextChangeRangeSinceVersion(fileName, lastKnownVersion);
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

        private updateCompilerUnit(compiler: TypeScript.TypeScriptCompiler, fileName: string): bool {
            var compilerScriptVersion: number = this.fileNameToCompilerScriptVersion.lookup(fileName);

            //
            // If file version is the same, assume no update
            //
            var version = this.hostCache.getVersion(fileName);
            if (compilerScriptVersion === version) {
                //logger.log("Assumed unchanged unit: " + unitIndex + "-"+ fileName);
                return false;
            }

            this.updateSyntaxTree(fileName);

            //
            // Otherwise, we need to re-parse/retypecheck the file (maybe incrementally)
            //

            // Keep track of the version of script we're adding to the compiler.
            this.fileNameToCompilerScriptVersion.addOrUpdate(fileName, this.hostCache.getVersion(fileName));
            return compiler.pullUpdateUnit(this.hostCache.getScriptSnapshot(fileName), fileName);
        }

        private updateSyntaxTree(fileName: string): void {
            var newText = new TypeScript.ScriptSnapshotText(this.getScriptSnapshot(fileName));

            var editRange = this.getScriptTextChangeRange(fileName);
            if (editRange === null) {
                // Unknown edit.  Do a full parse.
                this.setSyntaxTree(fileName, TypeScript.Parser1.parse(newText));
            }
            else {
                // DO an incremental parser.
                this.setSyntaxTree(
                    fileName,
                    TypeScript.Parser1.incrementalParse(this.getSyntaxTree(fileName), editRange, newText));
            }
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

        public getDocComments(symbol: TypeScript.PullSymbol, useConstructorAsClass?: bool): string {
            if (!symbol) {
                return "";
            }
            var decls = symbol.getDeclarations();
            if (useConstructorAsClass && decls.length && decls[0].getKind() == TypeScript.PullElementKind.ConstructorMethod) {
                var classDecl = decls[0].getParentDecl();
                return TypeScript.Comment.getDocCommentText(this.getDocCommentsOfDecl(classDecl));
            }

            if (!useConstructorAsClass && symbol.getKind() == TypeScript.PullElementKind.ConstructSignature &&
                decls.length && decls[0].getKind() == TypeScript.PullElementKind.Class) {
                // Class without constructor with implicit constructor signature
                return "";
            }

            if (symbol.docComments === null) {
                var docComments: string = "";
                if (symbol.getKind() == TypeScript.PullElementKind.Parameter) {
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