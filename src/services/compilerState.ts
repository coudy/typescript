//
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
            public fileName: string,
            private host: ILanguageServiceHost,
            public version: number,
            public isOpen: boolean,
            public byteOrderMark: ByteOrderMark) {
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
        private fileNameToEntry: TypeScript.StringHashTable<HostCacheEntry>;

        constructor(public host: ILanguageServiceHost) {
            // script id => script index
            this.fileNameToEntry = new TypeScript.StringHashTable<HostCacheEntry>();

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];
                this.fileNameToEntry.add(TypeScript.switchToForwardSlashes(fileName), new HostCacheEntry(
                    fileName, this.host, this.host.getScriptVersion(fileName), this.host.getScriptIsOpen(fileName), this.host.getScriptByteOrderMark(fileName)));
            }
        }

        public contains(fileName: string): boolean {
            return this.fileNameToEntry.lookup(TypeScript.switchToForwardSlashes(fileName)) !== null;
        }

        public getHostFileName(fileName: string) {
            var hostCacheEntry = this.fileNameToEntry.lookup(TypeScript.switchToForwardSlashes(fileName));
            if (hostCacheEntry) {
                return hostCacheEntry.fileName;
            }
            return fileName;
        }

        public getFileNames(): string[]{
            return this.fileNameToEntry.getAllKeys();
        }

        public getVersion(fileName: string): number {
            return this.fileNameToEntry.lookup(TypeScript.switchToForwardSlashes(fileName)).version;
        }

        public isOpen(fileName: string): boolean {
            return this.fileNameToEntry.lookup(TypeScript.switchToForwardSlashes(fileName)).isOpen;
        }

        public getByteOrderMark(fileName: string): ByteOrderMark {
            return this.fileNameToEntry.lookup(TypeScript.switchToForwardSlashes(fileName)).byteOrderMark;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.fileNameToEntry.lookup(TypeScript.switchToForwardSlashes(fileName)).getScriptSnapshot();
        }
    }

    export class CompilerState {
        private logger: TypeScript.ILogger;

        //
        // State related to compiler instance
        //
        public compiler: TypeScript.TypeScriptCompiler = null;
        private hostCache: HostCache = null;
        private _compilationSettings: TypeScript.CompilationSettings = null;

        constructor(private host: ILanguageServiceHost) {
            this.logger = this.host;
        }

        public compilationSettings() {
            return this._compilationSettings;
        }

        private addFile(compiler: TypeScript.TypeScriptCompiler, fileName: string): void {
            compiler.addFile(fileName,
                this.hostCache.getScriptSnapshot(fileName),
                this.hostCache.getByteOrderMark(fileName),
                this.hostCache.getVersion(fileName),
                this.hostCache.isOpen(fileName));
        }

        public getHostCompilationSettings(): TypeScript.CompilationSettings {
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
            // Create and initialize compiler
            this.logger.log("Initializing compiler");

            this._compilationSettings = new TypeScript.CompilationSettings();

            Services.copyDataObject(this.compilationSettings(), this.getHostCompilationSettings());
            this.compiler = new TypeScript.TypeScriptCompiler(this.logger, this.compilationSettings());

            // Add unit for all source files
            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                this.addFile(this.compiler, fileNames[i]);
            }
        }

        public getResolver(): TypeScript.PullTypeResolver {
            return null;
        }

        public synchronizeHostData(updateCompiler: boolean): void {
            // Reset the cache at start of every refresh
            this.hostCache = new HostCache(this.host);

            if (updateCompiler) {
                // If full refresh not needed, attempt partial refresh
                if (!this.fullRefresh()) {
                    this.partialRefresh();
                }
            }
        }

        //
        // Re-create a fresh compiler instance if needed. 
        // Return "true" if a fresh compiler instance was created. 
        //
        private fullRefresh(): boolean {
            // Initial state: no compiler yet
            if (this.compiler == null) {
                this.logger.log("Creating new compiler instance because there is no currently active instance");
                this.createCompiler();
                return true;
            }

            // If any compilation settings changes, a new compiler instance is needed
            if (!Services.compareDataObjects(this.compilationSettings(), this.getHostCompilationSettings())) {
                this.logger.log("Creating new compiler instance because compilation settings have changed.");
                this.createCompiler();
                return true;
            }

            // If any file was deleted, we need to create a new compiler, because we are not
            // even close to supporting removing symbols (unitindex will be all over the place
            // if we remove scripts from the list).
            var fileNames = this.compiler.fileNames();
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

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];

                if (this.compiler.getDocument(fileName)) {
                    this.updateFile(this.compiler, fileName);
                }
                else {
                    this.addFile(this.compiler, fileName);
                }
            }
        }

        private updateFile(compiler: TypeScript.TypeScriptCompiler, fileName: string): void {
            var document: TypeScript.Document = this.compiler.getDocument(fileName);

            //
            // If the document is the same, assume no update
            //
            var version = this.hostCache.getVersion(fileName);
            var isOpen = this.hostCache.isOpen(fileName);
            if (document.version === version && document.isOpen === isOpen) {
                return;
            }

            var textChangeRange = this.getScriptTextChangeRangeSinceVersion(fileName, document.version);
            compiler.updateFile(fileName,
                this.hostCache.getScriptSnapshot(fileName),
                version, isOpen, textChangeRange);
        }

        private getAllSyntacticDiagnostics(): TypeScript.Diagnostic[]{
            var diagnostics: TypeScript.Diagnostic[] = [];

            this.compiler.fileNames().forEach(fileName =>
                diagnostics.push.apply(diagnostics, this.compiler.getSyntacticDiagnostics(fileName)));

            return diagnostics;
        }

        private getAllSemanticDiagnostics(): TypeScript.Diagnostic[]{
            var diagnostics: TypeScript.Diagnostic[] = [];

            this.compiler.fileNames().map(fileName =>
                diagnostics.push.apply(diagnostics, this.compiler.getSemanticDiagnostics(fileName)));

            return diagnostics;
        }

        public getEmitOutput(fileName: string): TypeScript.EmitOutput {
            var resolvePath = (fileName: string) => this.host.resolveRelativePath(fileName, null);

            var outputMany = this.compiler.emitOptions.outputMany;

            // Check for syntactic errors
            var syntacticDiagnostics = outputMany
                ? this.getSyntacticDiagnostics(fileName)
                : this.getAllSyntacticDiagnostics();
            if (this.containErrors(syntacticDiagnostics)) {
                // This file has at least one syntactic error, return and do not emit code.
                return new TypeScript.EmitOutput();
            }

            // Force a type check before emit to ensure that all symbols have been resolved
            var document = this.getDocument(fileName);
            var semanticDiagnostics = outputMany ? this.getSemanticDiagnostics(fileName) : this.getAllSemanticDiagnostics();

            // Emit output files and source maps
                // Emit declarations, if there are no semantic errors
            var emitResult = this.compiler.emit(fileName, resolvePath);
            if (!this.containErrors(emitResult.diagnostics) &&
                !this.containErrors(semanticDiagnostics)) {

                // Merge the results
                var declarationEmitOutput = this.compiler.emitDeclarations(fileName, resolvePath);
                emitResult.outputFiles.push.apply(emitResult.outputFiles, declarationEmitOutput.outputFiles);
                emitResult.diagnostics.push.apply(emitResult.diagnostics, declarationEmitOutput.diagnostics);
            }

            return emitResult;
        }

        private containErrors(diagnostics: TypeScript.Diagnostic[]): boolean {
            if (diagnostics && diagnostics.length > 0) {
                for (var i = 0; i < diagnostics.length; i++) {
                    var diagnosticInfo = TypeScript.getDiagnosticInfoFromKey(diagnostics[i].diagnosticKey());
                    if (diagnosticInfo.category === TypeScript.DiagnosticCategory.Error) {
                        return true;
                    }
                }
            }

            return false;
        }

        public getScriptTextChangeRangeSinceVersion(fileName: string, lastKnownVersion: number): TypeScript.TextChangeRange {
            var currentVersion = this.hostCache.getVersion(fileName);
            if (lastKnownVersion === currentVersion) {
                return TypeScript.TextChangeRange.unchanged; // "No changes"
            }

            var scriptSnapshot = this.hostCache.getScriptSnapshot(fileName);
            return scriptSnapshot.getTextChangeRangeSinceVersion(lastKnownVersion);
        }

        // Methods that defer to the host cache to get the result.

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.hostCache.getScriptSnapshot(fileName);
        }

        public getHostFileName(fileName: string) {
            return this.hostCache.getHostFileName(fileName);
        }

        public getScriptVersion(fileName: string) {
            return this.hostCache.getVersion(fileName);
        }

        // Methods that defer to the compiler to get the result.

        public getFileNames(): string[] {
            return this.compiler.fileNames();
        }

        public getDocument(fileName: string): TypeScript.Document {
            return this.compiler.getDocument(fileName);
        }

        public getSyntacticDiagnostics(fileName: string): TypeScript.Diagnostic[] {
            return this.compiler.getSyntacticDiagnostics(fileName);
        }

        public getSemanticDiagnostics(fileName: string): TypeScript.Diagnostic[] {
            return this.compiler.getSemanticDiagnostics(fileName);
        }

        public getDeclarationSymbolInformation(ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetDeclarationSymbolInformation(ast, document);
        }

        public getSymbolInformationFromAST(ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetSymbolInformationFromAST(ast, document);
        }

        public getCallInformationFromAST(ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetCallInformationFromAST(ast, document);
        }

        public getVisibleMemberSymbolsFromAST(ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetVisibleMemberSymbolsFromAST(ast, document);
        }

        public getVisibleDeclsFromAST(ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetVisibleDeclsFromAST(ast, document);
        }

        public getContextualMembersFromAST(ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetContextualMembersFromAST(ast, document);
        }

        public pullGetDeclInformation(decl: TypeScript.PullDecl, ast: TypeScript.AST, document: TypeScript.Document) {
            return this.compiler.pullGetDeclInformation(decl, ast, document);
        }

        public getTopLevelDeclaration(fileName: string) {
            return this.compiler.getTopLevelDeclaration(fileName);
        }

        public getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl {
            return this.compiler.getDeclForAST(ast);
        }
    }
}
