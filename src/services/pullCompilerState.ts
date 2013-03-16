// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    export class PullCompilerState {

        public logger: TypeScript.ILogger;
        //
        // State related to compiler instance
        //
        private compiler: TypeScript.TypeScriptCompiler;
        private errorCollector: CompilerErrorCollector;
        private unitIndexMap: number[];
        private scriptMap: ScriptMap;
        private hostCache: HostCache;
        private compilerCache: CompilerCache;
        private symbolTree: SymbolTree;
        private compilationSettings: TypeScript.CompilationSettings;

        constructor(public host: ILanguageServiceHost) {
            this.logger = this.host;
            //
            // State related to compiler instance
            //
            this.compiler = null;
            this.errorCollector = null;
            this.unitIndexMap = []; // Map from compiler unit index to host unitindex
            this.scriptMap = null; // Map from fileName to FileMapEntry

            //
            // State recomputed at every "refresh" call (performance)
            //
            this.hostCache = null;
            this.compilerCache = null;
            this.symbolTree = null;
            this.compilationSettings = null;
        }

        public getCompilationSettings() {
            return this.compilationSettings;
        }

        private setUnitMapping(unitIndex: number, hostUnitIndex: number) {
            this.scriptMap.setEntry(this.hostCache.getScriptFileName(hostUnitIndex), this.hostCache.getVersion(hostUnitIndex));
            this.setUnitIndexMapping(unitIndex, hostUnitIndex);
        }

        private setUnitIndexMapping(unitIndex: number, hostUnitIndex: number) {
            this.unitIndexMap[unitIndex] = hostUnitIndex;
        }

        private onTypeCheckStarting(): void {
            this.errorCollector.startTypeChecking();
            this.symbolTree = new SymbolTree(this);
        }

        public getSymbolTree(): ISymbolTree {
            return this.symbolTree;
        }

        public mapToHostUnitIndex(unitIndex: number): number {
            return this.unitIndexMap[unitIndex];
        }        

        public getScriptCount() {
            return this.compiler.scripts.members.length;
        }

        public getScript(index: number): TypeScript.Script {
            return <TypeScript.Script>this.compiler.scripts.members[index];
        }

        public getScripts(): TypeScript.Script[] {
            return <TypeScript.Script[]>this.compiler.scripts.members;
        }

        public getUnitIndex(fileName: string) {
            return this.compilerCache.getUnitIndex(fileName);
        }

        public getScriptVersion(fileName: string) {
            return this.hostCache.getVersion(this.hostCache.getUnitIndex(fileName));
        }

        private addCompilerUnit(compiler: TypeScript.TypeScriptCompiler, hostUnitIndex: number) {
            var newUnitIndex = compiler.units.length;
            this.errorCollector.startParsing(newUnitIndex);

            //Note: We need to call "_setUnitMapping" _before_ calling into the compiler,
            //      in case the compiler fails (i.e. throws an exception). This is due to the way
            //      we recover from those failure (we still report errors to the host, 
            //      and we need unit mapping info to do that correctly.
            this.setUnitMapping(newUnitIndex, hostUnitIndex);

            var newScript = compiler.addSourceUnit(this.hostCache.getScriptSnapshot(hostUnitIndex), this.hostCache.getScriptFileName(hostUnitIndex));
        }

        private getHostCompilationSettings() {
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

            this.compilationSettings = new TypeScript.CompilationSettings();
            
            Services.copyDataObject(this.compilationSettings, this.getHostCompilationSettings());
            this.compilationSettings.usePull = true;
            this.compiler = new TypeScript.TypeScriptCompiler(outerr, this.logger, this.compilationSettings);
            this.scriptMap = new ScriptMap();
            this.unitIndexMap = [];
            this.errorCollector = new CompilerErrorCollector(this.logger);

            //TODO: "bind" doesn't work here in the context of running unit tests
            //compiler.setErrorCallback(errorCollector.reportError.bind(errorCollector));
            this.compiler.setErrorCallback((a, b, c, d) => { this.errorCollector.reportError(a, b, c, d); });
            this.compiler.parser.errorRecovery = true;

            // Add unit for all source files
            for (var i = 0, length = this.host.getScriptCount() ; i < length; i++) {
                this.addCompilerUnit(this.compiler, i);
            }

            this.compilerCache = new CompilerCache(this.compiler);

            // Initial typecheck
            this.onTypeCheckStarting();
            this.compiler.pullTypeCheck();
        }

        public minimalRefresh(): void {
            // Reset the cache at start of every refresh
            this.hostCache = new HostCache(this.host);
        }

        public refresh(throwOnError: bool = true): void {
            try {
                // Reset the cache at start of every refresh
                this.hostCache = new HostCache(this.host);

                // If full refresh not needed, attempt partial refresh
                if (!this.fullRefresh()) {
                    this.partialRefresh();
                }

                // Debugging: log version and unit index mapping data
                if (this.logger.information()) {
                    for (var i = 0; i < this.compiler.units.length; i++) {
                        this.logger.log("compiler unit[" + i + "].fileName='" + this.compiler.units[i].fileName + "'");
                    }
                    for (var i = 0; i < this.hostCache.count() ; i++) {
                        this.logger.log("host script[" + i + "].fileName='" + this.hostCache.getScriptFileName(i) + "', version=" + this.hostCache.getVersion(i));
                    }
                    for (var i = 0; i < this.unitIndexMap.length; i++) {
                        this.logger.log("unitIndexMap[" + i + "] = " + this.unitIndexMap[i]);
                    }
                }
            }
            catch (err) {
                var lastUnitIndex = 0;
                if (this.compiler != null) {
                    lastUnitIndex = this.compiler.units.length - 1;
                }
                this.compiler = null;

                this.logger.log("WARNING: PERF: Internal error during \"Refresh\":");
                logInternalError(this.logger, err);
                this.logger.log("WARNING: PERF:    Compiler state is lost and will be re-initiliazed during next call.");

                this.errorCollector.reportError(0, 1, "Internal error: " + err.message, lastUnitIndex);
                this.errorCollector.reportError(0, 1, "Internal error: IntelliSense features are disabled. Try making edits to source files to restore a valid compilation state.", lastUnitIndex);

                if (throwOnError)
                    throw err;
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
            for (var unitIndex = 0, len = this.compiler.units.length; unitIndex < len; unitIndex++) {
                var fileName = this.compiler.units[unitIndex].fileName;

                var hostUnitIndex = this.hostCache.getUnitIndex(fileName);
                if (hostUnitIndex < 0) {
                    this.logger.log("Creating new compiler instance because of unit is not part of program anymore: " + unitIndex + "-" + fileName);
                    this.createCompiler();
                    return true;
                }
            }

            // We can attempt a partial refresh
            return false;
        }

        public getScriptAST(fileName: string): TypeScript.Script {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No AST found for file \"" + fileName + "\".");
            }

            return <TypeScript.Script>this.compiler.scripts.members[unitIndex];
        }

        public createSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No SyntaxTree found for file \"" + fileName + "\".");
            }

            var sourceText = this.getScriptSnapshot2(fileName);
            var text = new TypeScript.SegmentedScriptSnapshot(sourceText);
            return TypeScript.Parser1.parse(text);
        }

        public getSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No SyntaxTree found for file \"" + fileName + "\".");
            }

            if (!this.compiler.syntaxTrees[unitIndex]) {
                this.compiler.syntaxTrees[unitIndex] = this.createSyntaxTree(fileName);
            }

            return <TypeScript.SyntaxTree>this.compiler.syntaxTrees[unitIndex];
        }

        public setSyntaxTree(fileName: string, syntaxTree: TypeScript.SyntaxTree): void {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No SyntaxTree found for file \"" + fileName + "\".");
            }

            this.compiler.syntaxTrees[unitIndex] = syntaxTree;
        }

        public getLineMap(fileName: string): number[] {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No AST found for file \"" + fileName + "\".");
            }

            return this.compiler.units[unitIndex].lineMap;
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

        public getScriptTextChangeRange(script: TypeScript.Script): TypeScript.TextChangeRange {
            var lastKnownVersion = this.scriptMap.getEntry(script.locationInfo.fileName).version;
            return this.getScriptTextChangeRangeSinceVersion(script.locationInfo.fileName, lastKnownVersion);
        }

        public getScriptTextChangeRangeSinceVersion(fileName: string, lastKnownVersion: number): TypeScript.TextChangeRange {
            var hostUnitIndex = this.hostCache.getUnitIndex(fileName);

            var currentVersion = this.hostCache.getVersion(hostUnitIndex);
            if (lastKnownVersion === currentVersion) {
                return null; // "No changes"
            }

            return this.host.getScriptTextChangeRangeSinceVersion(hostUnitIndex, lastKnownVersion);
        }

        public getScriptSnapshot(script: TypeScript.Script) {
            return this.hostCache.getScriptSnapshot(this.hostCache.getUnitIndex(script.locationInfo.fileName));
        }

        public getScriptSnapshot2(fileName: string) {
            return this.hostCache.getScriptSnapshot(this.hostCache.getUnitIndex(fileName));
        }

        public getScriptSnapshot3(unitIndex: number) {
            return this.hostCache.getScriptSnapshot(unitIndex);
        }

        // Since we don't have incremental parsing or typecheck, we resort to parsing the whole source text
        // and return a "syntax only" AST. For example, we use this for formatting engine.
        // We will change this when we have incremental parsing.
        public getScriptSyntaxAST(fileName: string): ScriptSyntaxAST {
            var sourceText = this.hostCache.getScriptSnapshot(this.hostCache.getUnitIndex(fileName));

            var parser = new TypeScript.Parser();
            parser.setErrorRecovery(null);
            parser.errorCallback = (a, b, c, d) => { };

            var script = parser.parse(sourceText, fileName, 0);

            return new ScriptSyntaxAST(this.logger, script, sourceText);
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

        private updateCompilerUnit(compiler: TypeScript.TypeScriptCompiler, hostUnitIndex: number, unitIndex: number): bool {
            var fileName = this.hostCache.getScriptFileName(hostUnitIndex);

            //Note: We need to call "_setUnitIndexMapping" _before_ calling into the compiler,
            //      in case the compiler fails (i.e. throws an exception). This is due to the way
            //      we recover from those failure (we still report errors to the host, 
            //      and we need unit mapping info to do that correctly.
            this.setUnitIndexMapping(unitIndex, hostUnitIndex);

            var previousEntry = this.scriptMap.getEntry(fileName);

            //
            // If file version is the same, assume no update
            //
            var version = this.hostCache.getVersion(hostUnitIndex);
            if (previousEntry.version === version) {
                //logger.log("Assumed unchanged unit: " + unitIndex + "-"+ fileName);
                return false;
            }

            if (this.compilationSettings.usePull) {
                this.updateSyntaxTree(fileName);
            }

            //
            // Otherwise, we need to re-parse/retypecheck the file (maybe incrementally)
            //

            var sourceText = this.hostCache.getScriptSnapshot(hostUnitIndex);
            this.setUnitMapping(unitIndex, hostUnitIndex);
            return compiler.pullUpdateUnit(sourceText, fileName, true/*setRecovery*/);
        }

        private updateSyntaxTree(fileName: string): void {
            var previousScript = this.getScriptAST(fileName);
            var editRange = this.getScriptTextChangeRange(previousScript);

            if (editRange !== null) {
                var newSourceText = this.getScriptSnapshot(previousScript);
                var newText = new TypeScript.SegmentedScriptSnapshot(newSourceText);

                var previousSyntaxTree = this.getSyntaxTree(fileName);
                var nextSyntaxTree = TypeScript.Parser1.incrementalParse(
                    previousSyntaxTree.sourceUnit(), [editRange], newText);

                this.setSyntaxTree(fileName, nextSyntaxTree);
            }
        }

        // Attempt an incremental refresh of the compiler state.
        private partialRefresh(): void {
            this.logger.log("Updating files...");
            this.compilerCache = new CompilerCache(this.compiler);

            var fileAdded: bool = false;

            for (var hostUnitIndex = 0, len = this.host.getScriptCount() ; hostUnitIndex < len; hostUnitIndex++) {
                var fileName = this.hostCache.getScriptFileName(hostUnitIndex);
                var unitIndex = this.compilerCache.getUnitIndex(fileName);

                if (unitIndex >= 0) {
                    this.updateCompilerUnit(this.compiler, hostUnitIndex, unitIndex);
                }
                else {
                    this.addCompilerUnit(this.compiler, hostUnitIndex);
                    fileAdded = true;
                }
            }

            if (fileAdded) {
                this.compiler.pullTypeCheck(true);
            }
        }
    }
}