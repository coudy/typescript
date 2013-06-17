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

///<reference path='typescript.ts'/>
///<reference path='io.ts'/>
///<reference path='optionsParser.ts'/>

module TypeScript {
    class SourceFile {
        private _scriptSnapshot: IScriptSnapshot;
        private _byteOrderMark: ByteOrderMark;

        constructor(scriptSnapshot: IScriptSnapshot, byteOrderMark: ByteOrderMark) {
            this._scriptSnapshot = scriptSnapshot;
            this._byteOrderMark = byteOrderMark;
        }

        public scriptSnapshot(): IScriptSnapshot {
            return this._scriptSnapshot;
        }

        public byteOrderMark(): ByteOrderMark {
            return this._byteOrderMark;
        }
    }

    class DiagnosticsLogger implements ILogger {
        constructor(public ioHost: IIO) {
        }
        public information(): boolean { return false; }
        public debug(): boolean { return false; }
        public warning(): boolean { return false; }
        public error(): boolean { return false; }
        public fatal(): boolean { return false; }
        public log(s: string): void {
            this.ioHost.stdout.WriteLine(s);
        }
    }

    export class BatchCompiler implements IReferenceResolverHost, IDiagnosticReporter, EmitterIOHost {
        public compilerVersion = "0.9.0.0";
        private inputFiles: string[] = [];
        private compilationSettings: CompilationSettings;
        private resolvedFiles: IResolvedFile[] = [];
        private inputFileNameToOutputFileName = new StringHashTable();
        private fileNameToSourceFile = new StringHashTable();
        private hasErrors: boolean = false;
        private logger: ILogger = null;

        constructor(private ioHost: IIO) {
            this.compilationSettings = new CompilationSettings();
        }

        // Begin batch compilation
        public batchCompile() {
            var start = new Date().getTime();

            CompilerDiagnostics.diagnosticWriter = { Alert: (s: string) => { this.ioHost.printLine(s); } };

            // Parse command line options
            if (this.parseOptions()) {
                this.logger = this.compilationSettings.gatherDiagnostics ? <ILogger>new DiagnosticsLogger(this.ioHost) : new NullLogger();

                if (this.compilationSettings.watch) {
                    // Watch will cause the program to stick around as long as the files exist
                    this.watchFiles();
                    return;
                }

                // Resolve the compilation environemnt
                this.resolve();

                if (!this.compilationSettings.updateTC) {
                    this.compile();

                    if (this.compilationSettings.gatherDiagnostics) {
                        this.logger.log("");
                        this.logger.log("File resolution time:                     " + TypeScript.fileResolutionTime);
                        this.logger.log("SyntaxTree parse time:                    " + TypeScript.syntaxTreeParseTime);
                        this.logger.log("Syntax Diagnostics time:                  " + TypeScript.syntaxDiagnosticsTime);
                        this.logger.log("AST translation time:                     " + TypeScript.astTranslationTime);
                        this.logger.log("");
                        this.logger.log("Type check time:                          " + TypeScript.typeCheckTime);
                        this.logger.log("");
                        this.logger.log("Emit time:                                " + TypeScript.emitTime);
                        this.logger.log("Declaration emit time:                    " + TypeScript.declarationEmitTime);

                        this.logger.log("  IsExternallyVisibleTime:                " + TypeScript.declarationEmitIsExternallyVisibleTime);
                        this.logger.log("  TypeSignatureTime:                      " + TypeScript.declarationEmitTypeSignatureTime);
                        this.logger.log("  GetBoundDeclTypeTime:                   " + TypeScript.declarationEmitGetBoundDeclTypeTime);
                        this.logger.log("  IsOverloadedCallSignatureTime:          " + TypeScript.declarationEmitIsOverloadedCallSignatureTime);
                        this.logger.log("  FunctionDeclarationGetSymbolTime:       " + TypeScript.declarationEmitFunctionDeclarationGetSymbolTime);
                        this.logger.log("  GetBaseTypeTime:                        " + TypeScript.declarationEmitGetBaseTypeTime);
                        this.logger.log("  GetAccessorFunctionTime:                " + TypeScript.declarationEmitGetAccessorFunctionTime);
                        this.logger.log("  GetTypeParameterSymbolTime:             " + TypeScript.declarationEmitGetTypeParameterSymbolTime);
                        this.logger.log("  GetImportDeclarationSymbolTime:         " + TypeScript.declarationEmitGetImportDeclarationSymbolTime);

                        this.logger.log("Emit write file time:                     " + TypeScript.emitWriteFileTime);
                        this.logger.log("Emit directory exists time:               " + TypeScript.emitDirectoryExistsTime);
                        this.logger.log("Emit file exists time:                    " + TypeScript.emitFileExistsTime);
                        this.logger.log("Emit resolve path time:                   " + TypeScript.emitResolvePathTime);

                        this.logger.log("IO host resolve path time:                " + TypeScript.ioHostResolvePathTime);
                        this.logger.log("IO host directory name time:              " + TypeScript.ioHostDirectoryNameTime);
                        this.logger.log("IO host create directory structure time:  " + TypeScript.ioHostCreateDirectoryStructureTime);
                        this.logger.log("IO host write file time:                  " + TypeScript.ioHostWriteFileTime);

                        this.logger.log("Node make directory time:                 " + TypeScript.nodeMakeDirectoryTime);
                        this.logger.log("Node writeFileSync time:                  " + TypeScript.nodeWriteFileSyncTime);
                        this.logger.log("Node createBuffer time:                   " + TypeScript.nodeCreateBufferTime);
                    }
                }
                else {
                    this.updateCompile();
                }

                if (!this.hasErrors) {
                    if (this.compilationSettings.exec) {
                        this.run();
                    }
                }
            }

            // Exit with the appropriate error code
            this.ioHost.quit(this.hasErrors ? 1 : 0);
        }

        private resolve() {
            // Resolve file dependencies, if requested
            var includeDefaultLibrary = this.compilationSettings.useDefaultLib;
            var resolvedFiles: IResolvedFile[] = [];

            var start = new Date().getTime();

            if (this.compilationSettings.resolve) {
                // Resolve references
                var resolutionResults = ReferenceResolver.resolve(this.inputFiles, this, this.compilationSettings);
                resolvedFiles = resolutionResults.resolvedFiles;

                // Only include the library if useDefaultLib is set to true and did not see any 'no-default-lib' comments
                includeDefaultLibrary = this.compilationSettings.useDefaultLib && !resolutionResults.seenNoDefaultLibTag;

                // Populate any diagnostic messages generated during resolution
                for (var i = 0, n = resolutionResults.diagnostics.length; i < n; i++) {
                    this.addDiagnostic(resolutionResults.diagnostics[i]);
                }
            }
            else {
                for (var i = 0, n = this.inputFiles.length; i < n; i++) {
                    var inputFile = this.inputFiles[i];
                    var referencedFiles: string[] = [];
                    var importedFiles: string[] = [];

                    // If declaration files are going to be emitted, preprocess the file contents and add in referenced files as well
                    if (this.compilationSettings.generateDeclarationFiles) {
                        var references = getReferencedFiles(inputFile, this.getScriptSnapshot(inputFile));
                        references.forEach((reference) => { referencedFiles.push(reference.path); });
                    }

                    resolvedFiles.push({
                        path: inputFile,
                        referencedFiles: referencedFiles,
                        importedFiles: importedFiles
                    });
                }
            }

            if (includeDefaultLibrary) {
                var libraryResolvedFile: IResolvedFile = {
                    path: this.getDefaultLibraryFilePath(),
                    referencedFiles: [],
                    importedFiles: []
                };

                // Prepend the library to the resolved list
                resolvedFiles = [libraryResolvedFile].concat(resolvedFiles);
            }

            this.resolvedFiles = resolvedFiles;

            TypeScript.fileResolutionTime = new Date().getTime() - start;
        }

        /// Do the actual compilation reading from input files and
        /// writing to output file(s).
        private compile(): boolean {
            var compiler = new TypeScriptCompiler(this.logger, this.compilationSettings);

            var anySyntacticErrors = false;
            var anySemanticErrors = false;

            for (var i = 0, n = this.resolvedFiles.length; i < n; i++) {
                var resolvedFile = this.resolvedFiles[i];
                var sourceFile = this.getSourceFile(resolvedFile.path);
                compiler.addSourceUnit(resolvedFile.path, sourceFile.scriptSnapshot(), sourceFile.byteOrderMark(), /*version:*/ 0, /*isOpen:*/ false, resolvedFile.referencedFiles);

                var syntacticDiagnostics = compiler.getSyntacticDiagnostics(resolvedFile.path);
                compiler.reportDiagnostics(syntacticDiagnostics, this);

                if (syntacticDiagnostics.length > 0) {
                    anySyntacticErrors = true;
                }
            }

            if (anySyntacticErrors) {
                return true;
            }

            compiler.pullTypeCheck();
            var fileNames = compiler.fileNameToDocument.getAllKeys();
            var n = fileNames.length;
            for (var i = 0; i < n; i++) {
                var fileName = fileNames[i];
                var semanticDiagnostics = compiler.getSemanticDiagnostics(fileName);
                if (semanticDiagnostics.length > 0) {
                    anySemanticErrors = true;
                    compiler.reportDiagnostics(semanticDiagnostics, this);
                }
            }

            var mapInputToOutput = (inputFile: string, outputFile: string): void => {
                this.inputFileNameToOutputFileName.addOrUpdate(inputFile, outputFile);
            };

            // TODO: if there are any emit diagnostics.  Don't proceed.
            var emitDiagnostics = compiler.emitAll(this, mapInputToOutput);
            compiler.reportDiagnostics(emitDiagnostics, this);
            if (emitDiagnostics.length > 0) {
                return true;
            }

            // Don't emit declarations if we have any semantic diagnostics.
            if (anySemanticErrors) {
                return true;
            }

            var mapInputToOutput = (inputFile: string, outputFile: string): void => {
                this.inputFileNameToOutputFileName.addOrUpdate(inputFile, outputFile);
            };

            // TODO: if there are any emit diagnostics.  Don't proceed.
            var emitDiagnostics = compiler.emitAll(this, mapInputToOutput);
            compiler.reportDiagnostics(emitDiagnostics, this);
            if (emitDiagnostics.length > 0) {
                return true;
            }

            var emitDeclarationsDiagnostics = compiler.emitAllDeclarations();
            compiler.reportDiagnostics(emitDeclarationsDiagnostics, this);
            if (emitDeclarationsDiagnostics.length > 0) {
                return true;
            }

            return false;
        }

        public updateCompile(): boolean {
            var compiler = new TypeScript.TypeScriptCompiler(this.logger, this.compilationSettings);

            var anySyntacticErrors = false;
            var foundLib = false;

            for (var iCode = 0, n = this.resolvedFiles.length; iCode < n; iCode++) {
                var resolvedFile = this.resolvedFiles[iCode];

                if (resolvedFile.path.indexOf("lib.d.ts") != -1) {
                    foundLib = true;
                }
                else if ((foundLib && iCode > 1) || (!foundLib && iCode > 0)) {
                    break;
                }

                this.ioHost.stdout.WriteLine("Consuming " + resolvedFile.path + "...");

                // if file resolving is disabled, the file's content will not yet be loaded

                var sourceFile = this.getSourceFile(resolvedFile.path);
                compiler.addSourceUnit(resolvedFile.path, sourceFile.scriptSnapshot(), sourceFile.byteOrderMark(), /*version:*/ 0, /*isOpen:*/ true, resolvedFile.referencedFiles);

                var syntacticDiagnostics = compiler.getSyntacticDiagnostics(resolvedFile.path);
                compiler.reportDiagnostics(syntacticDiagnostics, this);

                if (syntacticDiagnostics.length > 0) {
                    anySyntacticErrors = true;
                }
            }

            //if (anySyntacticErrors) {
            //    return true;
            //}

            this.ioHost.stdout.WriteLine("**** Initial type check errors:");
            compiler.pullTypeCheck();

            var semanticDiagnostics: TypeScript.Diagnostic[];

            for (var i = 0; i < iCode; i++) {
                semanticDiagnostics = compiler.getSemanticDiagnostics(this.resolvedFiles[i].path);
                compiler.reportDiagnostics(semanticDiagnostics, this);
            }

            // Note: we continue even if there were type check warnings.

            // ok, now we got through the remaining files, 1-by-1, substituting the new code in for the old
            if (iCode && iCode <= this.resolvedFiles.length - 1) {
                var lastTypecheckedFileName = this.resolvedFiles[iCode - 1].path;
                var snapshot: TypeScript.IScriptSnapshot;

                for (; iCode < this.resolvedFiles.length; iCode++) {
                    var resolvedFile = this.resolvedFiles[iCode];
                    var sourceFile = this.getSourceFile(resolvedFile.path);
                    this.ioHost.stdout.WriteLine("**** Update type check and errors for " + resolvedFile.path + ":");

                    compiler.updateSourceUnit(lastTypecheckedFileName, sourceFile.scriptSnapshot(), /*version:*/ 0, /*isOpen:*/ true, null);
                    // resolve the file to simulate an IDE-driven pull
                    //compiler.pullResolveFile(lastTypecheckedFileName);
                    semanticDiagnostics = compiler.getSemanticDiagnostics(lastTypecheckedFileName);
                    compiler.reportDiagnostics(semanticDiagnostics, this);
                }
            }

            return false;
        }

        // Execute the provided inputs
        private run() {
            for (var i = 0, n = this.resolvedFiles.length; i < n; i++) {
                var outputFileName: string = this.inputFileNameToOutputFileName.lookup(this.resolvedFiles[i].path);
                if (this.ioHost.fileExists(outputFileName)) {
                    var outputFileInformation = this.ioHost.readFile(outputFileName);
                    this.ioHost.run(outputFileInformation.contents(), outputFileName);
                }
            }
        }

        // Parse command line options
        private parseOptions() {
            var opts = new OptionsParser(this.ioHost, this.compilerVersion);
            var printedUsage = false;

            opts.option('out', {
                usage: 'Concatenate and emit output to single file | Redirect output structure to the directory',
                type: 'file|directory',
                set: (str) => {
                    this.compilationSettings.outputOption = str;
                }
            });

            opts.flag('sourcemap', {
                usage: 'Generates corresponding .map file',
                set: () => {
                    this.compilationSettings.mapSourceFiles = true;
                }
            });

            opts.flag('fullSourceMapPath', {
                usage: 'Writes the full path of map file in the generated js file',
                experimental: true,
                set: () => {
                    this.compilationSettings.emitFullSourceMapPath = true;
                }
            });

            opts.flag('declaration', {
                usage: 'Generates corresponding .d.ts file',
                set: () => {
                    this.compilationSettings.generateDeclarationFiles = true;
                }
            }, 'd');

            if (this.ioHost.watchFile) {
                opts.flag('watch', {
                    usage: 'Watch input files',
                    set: () => {
                        this.compilationSettings.watch = true;
                    }
                }, 'w');
            }

            opts.flag('exec', {
                usage: 'Execute the script after compilation',
                set: () => {
                    this.compilationSettings.exec = true;
                }
            }, 'e');

            opts.flag('minw', {
                usage: 'Minimize whitespace',
                experimental: true,
                set: () => { this.compilationSettings.minWhitespace = true; }
            }, 'mw');

            opts.flag('const', {
                usage: 'Propagate constants to emitted code',
                experimental: true,
                set: () => { this.compilationSettings.propagateConstants = true; }
            });

            opts.flag('comments', {
                usage: 'Emit comments to output',
                set: () => {
                    this.compilationSettings.emitComments = true;
                }
            }, 'c');

            opts.flag('noresolve', {
                usage: 'Skip resolution and preprocessing',
                experimental: true,
                set: () => {
                    this.compilationSettings.resolve = false;
                }
            });

            opts.flag('debug', {
                usage: 'Print debug output',
                experimental: true,
                set: () => {
                    CompilerDiagnostics.debug = true;
                }
            });

            opts.flag('nolib', {
                usage: 'Do not include a default lib.d.ts with global declarations',
                set: () => {
                    this.compilationSettings.useDefaultLib = false;
                }
            });

            opts.flag('diagnostics', {
                usage: 'gather diagnostic info about the compilation process',
                experimental: true,
                set: () => {
                    this.compilationSettings.gatherDiagnostics = true;
                }
            });

            opts.flag('update', {
                usage: 'Typecheck each file as an update on the first',
                experimental: true,
                set: () => {
                    this.compilationSettings.updateTC = true;
                }
            });

            opts.option('target', {
                usage: 'Specify ECMAScript target version: "ES3" (default), or "ES5"',
                type: 'VER',
                set: (type) => {
                    type = type.toLowerCase();

                    if (type === 'es3') {
                        this.compilationSettings.codeGenTarget = LanguageVersion.EcmaScript3;
                    }
                    else if (type === 'es5') {
                        this.compilationSettings.codeGenTarget = LanguageVersion.EcmaScript5;
                    }
                    else {
                        this.addDiagnostic(
                            new Diagnostic(null, 0, 0, DiagnosticCode.ECMAScript_target_version_0_not_supported_Using_default_1_code_generation, [type, "ES3"]));
                    }
                }
            });

            opts.option('module', {
                usage: 'Specify module code generation: "commonjs" (default) or "amd"',
                type: 'kind',
                set: (type) => {
                    type = type.toLowerCase();

                    if (type === 'commonjs' || type === 'node') {
                        this.compilationSettings.moduleGenTarget = ModuleGenTarget.Synchronous;
                    }
                    else if (type === 'amd') {
                        this.compilationSettings.moduleGenTarget = ModuleGenTarget.Asynchronous;
                    }
                    else {
                        this.addDiagnostic(
                            new Diagnostic(null, 0, 0, DiagnosticCode.Module_code_generation_0_not_supported_Using_default_1_code_generation, [type, "commonjs"]));
                    }
                }
            });

            opts.flag('help', {
                usage: 'Print this message',
                set: () => {
                    opts.printUsage();
                    printedUsage = true;
                }
            }, 'h');

            opts.flag('useCaseSensitiveFileResolution', {
                usage: 'Force file resolution to be case sensitive',
                experimental: true,
                set: () => {
                    this.compilationSettings.useCaseSensitiveFileResolution = true;
                }
            });

            opts.flag('version', {
                usage: 'Print the compiler\'s version: ' + this.compilerVersion,
                set: () => {
                    opts.printVersion();
                }
            }, 'v');

            opts.flag('allowbool', {
                usage: 'Allow use of deprecated "bool" type',
                set: () => {
                    this.compilationSettings.allowBool = true;
                }
            }, 'b');

            opts.flag('allowimportmodule', {
                usage: 'Allow use of deprecated "module" keyword when referencing an external module',
                set: () => {
                    this.compilationSettings.allowModuleKeywordInExternalModuleReference = true;
                }
            }, 'm');

            var locale: string = null;
            opts.option('locale', {
                usage: "Specify locale for errors and messages. For example 'en' or 'ja-jp'.",
                type: 'string',
                set: (value) => {
                    locale = value;
                }
            });

            opts.parse(this.ioHost.arguments);

            if (locale) {
                if (!this.setLocale(locale)) {
                    return false;
                }
            }

            for (var i = 0, n = opts.unnamed.length; i < n; i++) {
                this.inputFiles.push(opts.unnamed[i]);
            }

            // If no source files provided to compiler - print usage information
            if (this.inputFiles.length === 0) {
                if (!printedUsage) {
                    opts.printUsage();
                    return false;
                }
            }

            return true;
        }

        private setLocale(locale: string): boolean {
            var matchResult = /^([a-z]+)([_\-]([a-z]+))?$/.exec(locale.toLowerCase());
            if (!matchResult) {
                this.addDiagnostic(new Diagnostic(null, 0, 0, DiagnosticCode.Locale_must_be_of_the_form_language_or_language_territory_For_example_en_or_ja_jp, null));
                return false;
            }

            var language = matchResult[1];
            var territory = matchResult[3];

            // First try the entire locale, then fall back to just language if that's all we have.
            if (!this.setLanguageAndTerritory(language, territory) &&
                !this.setLanguageAndTerritory(language, null)) {

                this.addDiagnostic(new Diagnostic(null, 0, 0, DiagnosticCode.Unsupported_locale_0, [locale]));
                return false;
            }

            return true;
        }

        private setLanguageAndTerritory(language: string, territory: string): boolean {

            var compilerFilePath = this.ioHost.getExecutingFilePath();
            var containingDirectoryPath = this.ioHost.dirName(compilerFilePath);

            var filePath = IOUtils.combine(IOUtils.combine(containingDirectoryPath, "resources"), language);
            if (territory) {
                filePath = IOUtils.combine(filePath, territory);
            }

            filePath = this.ioHost.resolvePath(IOUtils.combine(filePath, "diagnosticMessages.generated.json"));

            if (!this.ioHost.fileExists(filePath)) {
                return false;
            }

            var fileContents = this.ioHost.readFile(filePath);
            TypeScript.LocalizedDiagnosticMessages = JSON.parse(fileContents.contents());
            return true;
        }

        // Handle -watch switch
        private watchFiles() {
            if (!this.ioHost.watchFile) {
                this.addDiagnostic(
                    new Diagnostic(null, 0, 0, DiagnosticCode.Current_host_does_not_support_w_atch_option, null));
                return;
            }

            var lastResolvedFileSet: string[] = []
            var watchers: { [x: string]: IFileWatcher; } = {};
            var firstTime = true;

            var addWatcher = (fileName: string) => {
                if (!watchers[fileName]) {
                    var watcher = this.ioHost.watchFile(fileName, onWatchedFileChange);
                    watchers[fileName] = watcher;
                }
                else {
                    CompilerDiagnostics.debugPrint("Cannot watch file, it is already watched.");
                }
            };

            var removeWatcher = (fileName: string) => {
                if (watchers[fileName]) {
                    watchers[fileName].close();
                    delete watchers[fileName];
                }
                else {
                    CompilerDiagnostics.debugPrint("Cannot stop watching file, it is not being watched.");
                }
            };

            var onWatchedFileChange = () => {
                // Clean errors for previous compilation
                this.hasErrors = false;

                // Resolve file dependencies, if requested
                this.resolve();

                // Check if any new files were added to the environment as a result of the file change
                var oldFiles = lastResolvedFileSet;
                var newFiles = this.resolvedFiles.map((resolvedFile) => { return resolvedFile.path; }).sort();

                var i = 0, j = 0;
                while (i < oldFiles.length && j < newFiles.length) {

                    var compareResult = oldFiles[i].localeCompare(newFiles[j]);
                    if (compareResult === 0) {
                        // No change here
                        i++;
                        j++;
                    }
                    else if (compareResult < 0) {
                        // Entry in old list does not exist in the new one, it was removed
                        removeWatcher(oldFiles[i]);
                        i++;
                    }
                    else {
                        // Entry in new list does exist in the new one, it was added
                        addWatcher(newFiles[j]);
                        j++;
                    }
                }

                // All remaining unmatched items in the old list have been removed
                for (var k = i; k < oldFiles.length; k++) {
                    removeWatcher(oldFiles[k]);
                }

                // All remaing unmatched items in the new list have been added
                for (k = j; k < newFiles.length; k++) {
                    addWatcher(newFiles[k]);
                }

                // Update the state
                lastResolvedFileSet = newFiles;

                // Print header
                if (!firstTime) {
                    this.ioHost.printLine("");
                    this.ioHost.printLine("Recompiling (" + new Date() + "): ");
                    lastResolvedFileSet.forEach((f) => this.ioHost.printLine("    " + f));
                }
                else {
                    firstTime = false;
                }

                // Trigger a new compilation
                this.compile();

                if (!this.hasErrors) {
                    if (this.compilationSettings.exec) {
                        try {
                            this.run();
                        }
                        catch (e) {
                            this.ioHost.stderr.WriteLine('Execution Failed.\n' + (e.stack || ""));
                        }
                    }
                }
            };

            // Switch to using stdout for all error messages
            this.ioHost.stderr = this.ioHost.stdout;

            onWatchedFileChange();
        }

        private getSourceFile(fileName: string): SourceFile {
            var sourceFile = this.fileNameToSourceFile.lookup(fileName);
            if (!sourceFile) {
                // Attempt to read the file
                var fileInformation: FileInformation;

                try {
                    fileInformation = this.ioHost.readFile(fileName);
                }
                catch (e) {
                    this.addDiagnostic(new Diagnostic(null, 0, 0, DiagnosticCode.Cannot_read_file_0_1, [fileName, e.message]));
                    fileInformation = new FileInformation("", ByteOrderMark.None);
                }

                var snapshot = ScriptSnapshot.fromString(fileInformation.contents());
                var sourceFile = new SourceFile(snapshot, fileInformation.byteOrderMark());
                this.fileNameToSourceFile.add(fileName, sourceFile);
            }

            return sourceFile;
        }

        private getDefaultLibraryFilePath(): string {
            var compilerFilePath = this.ioHost.getExecutingFilePath();
            var containingDirectoryPath = this.ioHost.dirName(compilerFilePath);
            var libraryFilePath = this.ioHost.resolvePath(IOUtils.combine(containingDirectoryPath, "lib.d.ts"));

            return libraryFilePath;
        }

        /// IReferenceResolverHost methods
        getScriptSnapshot(fileName: string): IScriptSnapshot {
            return this.getSourceFile(fileName).scriptSnapshot();
        }

        resolveRelativePath(path: string, directory: string): string {
            var unQuotedPath = stripQuotes(path);
            var normalizedPath: string;

            if (isRooted(unQuotedPath) || !directory) {
                normalizedPath = unQuotedPath;
            } else {
                normalizedPath = IOUtils.combine(directory, unQuotedPath);
            }

            // get the absolute path
            normalizedPath = this.resolvePath(normalizedPath);

            // Switch to forward slashes
            normalizedPath = switchToForwardSlashes(normalizedPath);

            return normalizedPath;
        }

        fileExists(path: string): boolean {
            var start = new Date().getTime();
            var result = this.ioHost.fileExists(path);
            TypeScript.emitFileExistsTime += new Date().getTime() - start;
            return result;
        }

        getParentDirectory(path: string): string {
            return this.ioHost.dirName(path);
        }

        /// IDiagnosticsReporter methods
        addDiagnostic(diagnostic: Diagnostic) {
            this.hasErrors = true;

            if (diagnostic.fileName()) {
                var scriptSnapshot = this.getScriptSnapshot(diagnostic.fileName());
                var lineMap = new LineMap(scriptSnapshot.getLineStartPositions(), scriptSnapshot.getLength());
                var lineCol = { line: -1, character: -1 };
                lineMap.fillLineAndCharacterFromPosition(diagnostic.start(), lineCol);

                this.ioHost.stderr.Write(diagnostic.fileName() + "(" + (lineCol.line + 1) + "," + (lineCol.character + 1) + "): ");
            }

            this.ioHost.stderr.WriteLine(diagnostic.message());
        }

        /// EmitterIOHost methods
        writeFile(fileName: string, contents: string, writeByteOrderMark: boolean): void {
            var start = new Date().getTime();
            IOUtils.writeFileAndFolderStructure(this.ioHost, fileName, contents, writeByteOrderMark);
            TypeScript.emitWriteFileTime += new Date().getTime() - start;
        }

        directoryExists(path: string): boolean {
            var start = new Date().getTime();
            var result = this.ioHost.directoryExists(path);
            TypeScript.emitDirectoryExistsTime += new Date().getTime() - start;
            return result;
        }

        resolvePath(path: string): string {
            var start = new Date().getTime();
            var result = this.ioHost.resolvePath(path);
            TypeScript.emitResolvePathTime += new Date().getTime() - start;
            return result;
        }
    }
}

// Start the batch compilation using the current hosts IO
var batch = new TypeScript.BatchCompiler(IO);
batch.batchCompile();
