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
            this.scriptMap = null; // Map from filename to FileMapEntry

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
            this.scriptMap.setEntry(this.hostCache.getScriptId(hostUnitIndex), this.hostCache.getIsResident(hostUnitIndex), this.hostCache.getVersion(hostUnitIndex));
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

            var newScript = compiler.addSourceUnit(this.hostCache.getSourceText(hostUnitIndex), this.hostCache.getScriptId(hostUnitIndex), this.hostCache.getIsResident(hostUnitIndex));
        }

        private getHostCompilationSettings() {
            var settings = this.host.getCompilationSettings();
            if (settings !== null) {
                return settings;
            }

            // Set "ES5" target by default for language service
            settings = new TypeScript.CompilationSettings();
            settings.codeGenTarget = TypeScript.CodeGenTarget.ES5;
            settings.useFidelity = true;
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
            this.compilationSettings.useFidelity = true;
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
                        this.logger.log("compiler unit[" + i + "].filename='" + this.compiler.units[i].filename + "'");
                    }
                    for (var i = 0; i < this.hostCache.count() ; i++) {
                        this.logger.log("host script[" + i + "].filename='" + this.hostCache.getScriptId(i) + "', version=" + this.hostCache.getVersion(i));
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
                var fileName = this.compiler.units[unitIndex].filename;

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

        public createSyntaxTree(fileName: string): SyntaxTree {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No SyntaxTree found for file \"" + fileName + "\".");
            }

            var sourceText = this.getSourceText2(fileName, /*cached:*/ false);
            var text = new TypeScript.SourceSimpleText(sourceText);
            return Parser1.parse(text);
        }

        public getSyntaxTree(fileName: string): SyntaxTree {
            var unitIndex = this.compilerCache.getUnitIndex(fileName);
            if (unitIndex < 0) {
                throw new Error("Interal error: No SyntaxTree found for file \"" + fileName + "\".");
            }

            if (!this.compiler.syntaxTrees[unitIndex]) {
                this.compiler.syntaxTrees[unitIndex] = this.createSyntaxTree(fileName);
            }

            return <SyntaxTree>this.compiler.syntaxTrees[unitIndex];
        }

        public setSyntaxTree(fileName: string, syntaxTree: SyntaxTree): void {
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

        public getErrorEntries(maxCount: number, filter: (unitIndex: number, error: SyntaxDiagnostic) => bool): TypeScript.ErrorEntry[] {
            var entries: TypeScript.ErrorEntry[] = [];
            var count = 0;

            var addError = (unitIndex: number, error: SyntaxDiagnostic): bool => {
                var entry = new TypeScript.ErrorEntry(this.mapToHostUnitIndex(unitIndex), error.position(), error.width(), error.message());
                entries.push(entry);
                count++;
                return (count < maxCount);
            }
    
            var addTypeError = (unitIndex: number, error: TypeScript.SemanticError): bool => {
                var entry = new TypeScript.ErrorEntry(this.mapToHostUnitIndex(unitIndex), error.getOffset(), error.length, error.message);
                entries.push(entry);
                count++;
                return (count < maxCount);
            }

            for (var hostUnitIndex = 0, len = this.host.getScriptCount() ; hostUnitIndex < len; hostUnitIndex++) {
                var fileName = this.hostCache.getScriptId(hostUnitIndex);
                var unitIndex = this.compilerCache.getUnitIndex(fileName);
                if (this.compiler.syntaxTrees[unitIndex]) {
                    var errors = (<SyntaxTree>this.compiler.syntaxTrees[unitIndex]).diagnostics();
                    if (errors !== undefined) {
                        for (var i = 0; i < errors.length; i++) {
                            var error = errors[i];
                            if (filter(unitIndex, error)) {
                                if (!addError(unitIndex, error)) {
                                    break;
                                }
                            }
                        }
                    }
                }

                
                //this.compiler.pullResolveFile(fileName);

                var typeErrors = this.compiler.pullGetErrorsForFile(fileName);
                if (typeErrors !== undefined) {
                    for (var i = 0; i < typeErrors.length; i++) {
                        var e = typeErrors[i];
                        //if (filter(unitIndex, e)) {
                            if (!addTypeError(unitIndex, e)) {
                                break;
                            }
                        //}
                    }
                }
            }

            return entries;
        } 

        public cleanASTTypesForReTypeCheck(ast: TypeScript.AST): void {
            this.compiler.cleanASTTypesForReTypeCheck(ast);
        }

        public getScriptEditRange(script: TypeScript.Script): TypeScript.ScriptEditRange {
            var lastKnownVersion = this.scriptMap.getEntry(script.locationInfo.filename).version;
            return this.getScriptEditRangeSinceVersion(script.locationInfo.filename, lastKnownVersion);
        }

        public getScriptEditRangeSinceVersion(fileName: string, lastKnownVersion: number): TypeScript.ScriptEditRange {
            var hostUnitIndex = this.hostCache.getUnitIndex(fileName);

            var currentVersion = this.hostCache.getVersion(hostUnitIndex);
            if (lastKnownVersion === currentVersion) {
                return null; // "No changes"
            }

            return this.host.getScriptEditRangeSinceVersion(hostUnitIndex, lastKnownVersion);
        }

        public getSourceText(script: TypeScript.Script, cached: bool = false) {
            return this.hostCache.getSourceText(this.hostCache.getUnitIndex(script.locationInfo.filename), cached);
        }

        public getSourceText2(fileName: string, cached: bool = false) {
            return this.hostCache.getSourceText(this.hostCache.getUnitIndex(fileName), cached);
        }

        public getSourceText3(unitIndex: number, cached: bool = false) {
            return this.hostCache.getSourceText(unitIndex, cached);
        }

        // Since we don't have incremental parsing or typecheck, we resort to parsing the whole source text
        // and return a "syntax only" AST. For example, we use this for formatting engine.
        // We will change this when we have incremental parsing.
        public getScriptSyntaxAST(fileName: string): ScriptSyntaxAST {
            var sourceText = this.hostCache.getSourceText(this.hostCache.getUnitIndex(fileName), /*cached*/true);

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

        public getPullSymbolFromPath(path: TypeScript.AstPath, script: TypeScript.Script) {
            return this.compiler.resolveSymbolForPath(path, script);
        }

        private updateCompilerUnit(compiler: TypeScript.TypeScriptCompiler, hostUnitIndex: number, unitIndex: number): bool {
            var scriptId = this.hostCache.getScriptId(hostUnitIndex);

            //Note: We need to call "_setUnitIndexMapping" _before_ calling into the compiler,
            //      in case the compiler fails (i.e. throws an exception). This is due to the way
            //      we recover from those failure (we still report errors to the host, 
            //      and we need unit mapping info to do that correctly.
            this.setUnitIndexMapping(unitIndex, hostUnitIndex);

            var previousEntry = this.scriptMap.getEntry(scriptId);

            //
            // If file version is the same, assume no update
            //
            var version = this.hostCache.getVersion(hostUnitIndex);
            if (previousEntry.version === version) {
                //logger.log("Assumed unchanged unit: " + unitIndex + "-"+ fileName);
                return false;
            }

            if (this.compilationSettings.useFidelity) {
                this.updateSyntaxTree(scriptId);
            }

            //
            // Otherwise, we need to re-parse/retypecheck the file (maybe incrementally)
            //

            var sourceText = this.hostCache.getSourceText(hostUnitIndex);
            this.setUnitMapping(unitIndex, hostUnitIndex);
            return compiler.pullUpdateUnit(sourceText, scriptId, true/*setRecovery*/);
        }

        private updateSyntaxTree(scriptId: string): void {
            var previousScript = this.getScriptAST(scriptId);
            var editRange = this.getScriptEditRange(previousScript);

            var start = editRange.minChar;
            var end = editRange.limChar;
            var newLength = end - start + editRange.delta;

            // Debug.assert(newLength >= 0);

            var newSourceText = this.getSourceText(previousScript, /*cached:*/ false);

            var textChangeRange = new TextChangeRange(TextSpan.fromBounds(start, end), newLength);

            var newText = new TypeScript.SourceSimpleText(newSourceText);

            var previousSyntaxTree = this.getSyntaxTree(scriptId);
            var nextSyntaxTree = Parser1.incrementalParse(
                previousSyntaxTree.sourceUnit(), [textChangeRange], newText);

            this.setSyntaxTree(scriptId, nextSyntaxTree);
        }

        // Attempt an incremental refresh of the compiler state.
        private partialRefresh(): void {
            this.logger.log("Updating files...");
            this.compilerCache = new CompilerCache(this.compiler);

            var fileAdded: bool = false;

            for (var hostUnitIndex = 0, len = this.host.getScriptCount() ; hostUnitIndex < len; hostUnitIndex++) {
                var fileName = this.hostCache.getScriptId(hostUnitIndex);
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