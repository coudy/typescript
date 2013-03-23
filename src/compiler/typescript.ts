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
 
///<reference path='diagnostics.ts' />
///<reference path='flags.ts' />
///<reference path='nodeTypes.ts' />
///<reference path='hashTable.ts' />
///<reference path='ast.ts' />
///<reference path='astWalker.ts' />
///<reference path='astWalkerCallback.ts' />
///<reference path='astPath.ts' />
///<reference path='binder.ts' />
///<reference path='base64.ts' />
///<reference path='sourceMapping.ts' />
///<reference path='emitter.ts' />
///<reference path='errorReporter.ts' />
///<reference path='printContext.ts' />
///<reference path='scanner.ts' />
///<reference path='scopeAssignment.ts' />
///<reference path='scopeWalk.ts' />
///<reference path='signatures.ts' />
///<reference path='symbols.ts' />
///<reference path='symbolScope.ts' />
///<reference path='tokens.ts' />
///<reference path='typeChecker.ts' />
///<reference path='typeCollection.ts' />
///<reference path='typeFlow.ts' />
///<reference path='types.ts' />
///<reference path='pathUtils.ts' />
///<reference path='referenceResolution.ts' />
///<reference path='precompile.ts' />
///<reference path='declarationEmitter.ts' />
///<reference path='Syntax\ISyntaxNodeOrToken.ts' />
///<reference path='Syntax\Parser.ts' />
///<reference path='Text\TextFactory.ts' />
///<reference path='typecheck\dataMap.ts' />
///<reference path='typecheck\pullFlags.ts' />
///<reference path='typecheck\pullDecls.ts' />
///<reference path='typecheck\pullSymbols.ts' />
///<reference path='typecheck\pullSymbolBindingContext.ts' />
///<reference path='typecheck\pullTypeResolutionContext.ts' />
///<reference path='typecheck\pullTypeResolution.ts' />
///<reference path='typecheck\pullTypeChecker.ts' />
///<reference path='typecheck\pullDeclDiffer.ts' />
///<reference path='typecheck\pullSemanticInfo.ts' />
///<reference path='typecheck\pullDeclCollection.ts' />
///<reference path='typecheck\pullSymbolBinder.ts' />
///<reference path='typecheck\pullSymbolGraph.ts' />
///<reference path='typecheck\pullEmitter.ts' />
///<reference path='typecheck\pullErrors.ts' />
///<reference path='typecheck\pullHelpers.ts' />
///<reference path='typecheck\pullDeclarationEmitter.ts' />
///<reference path='SyntaxTreeToAstVisitor.ts' />
///<reference path='resources.ts' />
///<reference path='resourceStrings.ts' />
///<reference path='Core\Timer.ts' />

module TypeScript {

    declare var IO;

    export interface EmitterIOHost {
        // function that can even create a folder structure if needed
        createFile(path: string, useUTF8?: bool): ITextWriter;

        // function to check if file exists on the disk
        fileExists(path: string): bool;

        // Function to check if the directory exists on the disk
        directoryExists(path: string): bool;

        // Resolves the path
        resolvePath(path: string): string;
    }

    export interface PullTypeInfoAtPositionInfo {
        symbol: PullSymbol;
        ast: AST;
        enclosingScopeSymbol: PullSymbol;
        candidateSignature: PullSignatureSymbol;
        callSignatures: PullSignatureSymbol[];
        isConstructorCall: bool;
    }

    export interface PullVisibleSymbolsInfo {
        symbols: PullSymbol[];
        enclosingScopeSymbol: PullSymbol;
    }

    export class TypeScriptCompiler {
        public errorReporter: SimpleErrorReporter = null;
        public pullErrorReporter: PullErrorReporter = null;

        public pullTypeChecker: PullTypeChecker = null;
        public semanticInfoChain: SemanticInfoChain = null;

        public emitOptions: EmitOptions;

        public fileNameToScript = new TypeScript.StringHashTable();
        public fileNameToLocationInfo = new TypeScript.StringHashTable();
        public fileNameToSyntaxTree = new TypeScript.StringHashTable();

        constructor(public errorOutput: ITextWriter,
                    public logger: ILogger = new NullLogger(),
                    public settings: CompilationSettings = new CompilationSettings(),
                    public diagnosticMessages: TypeScriptDiagnosticMessages = null) {
            this.errorReporter = new SimpleErrorReporter(this.errorOutput);
            this.pullErrorReporter = new PullErrorReporter(this.errorOutput);

            this.emitOptions = new EmitOptions(this.settings);

            if (this.diagnosticMessages) {
                typescriptDiagnosticMessages = diagnosticMessages
            }
        }

        public timeFunction(funcDescription: string, func: () => any): any {
            return TypeScript.timeFunction(this.logger, funcDescription, func);
        }

        public addSourceUnit(fileName: string, sourceText: IScriptSnapshot, referencedFiles?: IFileReference[] = []): Script {
            return this.timeFunction("addSourceUnit(" + fileName + ")", () => {
                var syntaxTree = Parser.parse(fileName, SimpleText.fromScriptSnapshot(sourceText), TypeScript.isDTSFile(fileName), LanguageVersion.EcmaScript5);
                var script = SyntaxTreeToAstVisitor.visit(syntaxTree, fileName, this.emitOptions.compilationSettings);
                script.referencedFiles = referencedFiles;

                this.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
                this.fileNameToLocationInfo.addOrUpdate(fileName, script.locationInfo);
                this.fileNameToScript.addOrUpdate(fileName, script);

                return script;
            });
        }

        public updateSourceUnit(fileName: string, scriptSnapshot: IScriptSnapshot, textChangeRange: TextChangeRange): void {
            this.timeFunction("pullUpdateUnit(" + fileName + ")", () => {
                var oldScript = <Script>this.fileNameToScript.lookup(fileName);
                var oldSyntaxTree = this.fileNameToSyntaxTree.lookup(fileName);

                var text = SimpleText.fromScriptSnapshot(scriptSnapshot);

                var syntaxTree = textChangeRange === null
                    ? TypeScript.Parser.parse(fileName, text, TypeScript.isDTSFile(fileName))
                    : TypeScript.Parser.incrementalParse(oldSyntaxTree, textChangeRange, text);

                var newScript = SyntaxTreeToAstVisitor.visit(syntaxTree, fileName, this.emitOptions.compilationSettings);

                this.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
                this.fileNameToScript.addOrUpdate(fileName, newScript);
                this.fileNameToLocationInfo.addOrUpdate(fileName, newScript.locationInfo);

                this.pullUpdateScript(oldScript, newScript);
            });
        }

        private isDynamicModuleCompilation() {
            var fileNames = this.fileNameToScript.getAllKeys();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var script = <Script>this.fileNameToScript.lookup(fileNames[i]);
                if (!script.isDeclareFile && script.topLevelMod != null) {
                    return true;
                }
            }
            return false;
        }

        private updateCommonDirectoryPath() {
            var commonComponents: string[] = [];
            var commonComponentsLength = -1;

            var fileNames = this.fileNameToScript.getAllKeys();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var script = <Script>this.fileNameToScript.lookup(fileNames[i]);
                if (script.emitRequired(this.emitOptions)) {
                    var fileName = script.locationInfo.fileName;
                    var fileComponents = filePathComponents(fileName);
                    if (commonComponentsLength === -1) {
                        // First time at finding common path
                        // So common path = directory of file
                        commonComponents = fileComponents;
                        commonComponentsLength = commonComponents.length;
                    } else {
                        var updatedPath = false;
                        for (var j = 0; j < commonComponentsLength && j < fileComponents.length; j++) {
                            if (commonComponents[j] != fileComponents[j]) {
                                // The new components = 0 ... j -1
                                commonComponentsLength = j;
                                updatedPath = true;

                                if (j === 0) {
                                    // Its error to not have common path
                                    this.errorReporter.emitterError("Cannot find the common subdirectory path for the input files");
                                    return;
                                }

                                break;
                            }
                        }

                        // If the fileComponent path completely matched and less than already found update the length
                        if (!updatedPath && fileComponents.length < commonComponentsLength) {
                            commonComponentsLength = fileComponents.length;
                        }
                    }
                }
            }

            this.emitOptions.commonDirectoryPath = commonComponents.slice(0, commonComponentsLength).join("/") + "/";
            if (this.emitOptions.compilationSettings.outputOption.charAt(this.emitOptions.compilationSettings.outputOption.length - 1) != "/") {
                this.emitOptions.compilationSettings.outputOption += "/";
            }
        }

        public parseEmitOption(ioHost: EmitterIOHost) {
            this.emitOptions.ioHost = ioHost;
            if (this.emitOptions.compilationSettings.outputOption === "") {
                this.emitOptions.outputMany = true;
                this.emitOptions.commonDirectoryPath = "";
                return;
            }

            this.emitOptions.compilationSettings.outputOption = switchToForwardSlashes(this.emitOptions.ioHost.resolvePath(this.emitOptions.compilationSettings.outputOption));

            // Determine if output options is directory or file
            if (this.emitOptions.ioHost.directoryExists(this.emitOptions.compilationSettings.outputOption)) {
                // Existing directory
                this.emitOptions.outputMany = true;
            } else if (this.emitOptions.ioHost.fileExists(this.emitOptions.compilationSettings.outputOption)) {
                // Existing file
                this.emitOptions.outputMany = false;
            }
            else {
                // New File/directory
                this.emitOptions.outputMany = !isJSFile(this.emitOptions.compilationSettings.outputOption);
            }

            // Verify if options are correct
            if (this.isDynamicModuleCompilation() && !this.emitOptions.outputMany) {
                this.errorReporter.emitterError("Cannot compile dynamic modules when emitting into single file");
            }

            // Parse the directory structure
            if (this.emitOptions.outputMany) {
                this.updateCommonDirectoryPath();
            }
        }

        public getScripts(): Script[] {
            var result: TypeScript.Script[] = [];
            var fileNames = this.fileNameToScript.getAllKeys();

            for (var i = 0; i < fileNames.length; i++) {
                result.push(this.fileNameToScript.lookup(fileNames[i]));
            }

            return result;
        }

        private useUTF8ForFile(script: Script) {
            if (this.emitOptions.outputMany) {
                return this.outputScriptToUTF8(script);
            } else {
                return this.outputScriptsToUTF8(this.getScripts());
            }
        }

        static mapToDTSFileName(fileName: string, wholeFileNameReplaced: bool) {
            return getDeclareFilePath(fileName);
        }

        private canEmitDeclarations(script?: Script) {
            if (!this.settings.generateDeclarationFiles) {
                return false;
            }

            // If its already a declare file or is resident or does not contain body 
            if (!!script && (script.isDeclareFile || script.bod === null)) {
                return false;
            }

            return true;
        }

        // Caller is responsible for closing emitter.
        private emitDeclarationsUnit1(script: Script, declarationEmitter?: DeclarationEmitter): DeclarationEmitter {
            if (this.canEmitDeclarations(script)) {
                if (!declarationEmitter) {
                    var declareFileName = this.emitOptions.mapOutputFileName(script.locationInfo.fileName, TypeScriptCompiler.mapToDTSFileName);
                    var declareFile = this.createFile(declareFileName, this.useUTF8ForFile(script));

                    declarationEmitter = new PullDeclarationEmitter(this.semanticInfoChain, this.emitOptions, this.errorReporter);
                    declarationEmitter.setDeclarationFile(declareFile);
                }

                declarationEmitter.emitDeclarations(script);
            }

            return declarationEmitter;
        }

        public emitDeclarations1(): IDiagnostic[] {
            var diagnostics: IDiagnostic[] = [];
            if (this.canEmitDeclarations() &&
                !this.errorReporter.hasErrors && !this.pullErrorReporter.hasErrors) {

                var sharedEmitter: DeclarationEmitter = null;

                var fileNames = this.fileNameToScript.getAllKeys();

                // Keep on processing files as long as we don't get any errors.
                for (var i = 0, n = fileNames.length; i < n && diagnostics.length === 0; i++) {
                    var script = <Script>this.fileNameToScript.lookup(fileNames[i]);

                    if (this.emitOptions.outputMany) {
                        var singleEmitter = this.emitDeclarationsUnit1(script);
                        if (singleEmitter) {
                            singleEmitter.Close();
                            diagnostics = singleEmitter.diagnostics();
                        }
                    }
                    else {
                        // Create or reuse file
                        sharedEmitter = this.emitDeclarationsUnit1(script, sharedEmitter);
                        if (sharedEmitter) {
                            diagnostics = sharedEmitter.diagnostics();
                        }
                    }
                }

                if (sharedEmitter) {
                    sharedEmitter.Close();
                    diagnostics = sharedEmitter.diagnostics();
                }
            }

            return diagnostics;
        }

        static mapToFileNameExtension(extension: string, fileName: string, wholeFileNameReplaced: bool) {
            if (wholeFileNameReplaced) {
                // The complete output is redirected in this file so do not change extension
                return fileName;
            } else {
                // Change the extension of the file
                var splitFname = fileName.split(".");
                splitFname.pop();
                return splitFname.join(".") + extension;
            }
        }

        static mapToJSFileName(fileName: string, wholeFileNameReplaced: bool) {
            return TypeScriptCompiler.mapToFileNameExtension(".js", fileName, wholeFileNameReplaced);
        }

        // Caller is responsible for closing the returned emitter.
        private emitUnit(script: Script,
                          inputOutputMapper?: (inputName: string, outputName: string) => void,
                          emitter?: PullEmitter): PullEmitter {

            if (script.emitRequired(this.emitOptions)) {
                var fname = script.locationInfo.fileName;
                if (!emitter) {
                    var outFname = this.emitOptions.mapOutputFileName(fname, TypeScriptCompiler.mapToJSFileName);
                    var outFile = this.createFile(outFname, this.useUTF8ForFile(script));

                    emitter = new PullEmitter(outFname, outFile, this.emitOptions, this.errorReporter, this.semanticInfoChain);

                    if (this.settings.mapSourceFiles) {
                        emitter.setSourceMappings(new TypeScript.SourceMapper(fname, outFname, outFile, this.createFile(outFname + SourceMapper.MapFileExtension, false), this.errorReporter, this.settings.emitFullSourceMapPath));
                    }
                    if (inputOutputMapper) {
                        // Remember the name of the outfile for this source file
                        inputOutputMapper(script.locationInfo.fileName, outFname);
                    }
                } else if (this.settings.mapSourceFiles) {
                    emitter.setSourceMappings(new TypeScript.SourceMapper(fname, emitter.emittingFileName, emitter.outfile, emitter.sourceMapper.sourceMapOut, this.errorReporter, this.settings.emitFullSourceMapPath));
                }

                // Set location info
                emitter.setUnit(script.locationInfo);
                emitter.emitJavascript(script, TokenID.Comma, false);
            }

            return emitter;
        }

        public emit(ioHost: EmitterIOHost, inputOutputMapper?: (inputFile: string, outputFile: string) => void ): IDiagnostic[] {
            this.parseEmitOption(ioHost);

            var sharedEmitter: PullEmitter = null;
            var diagnostics: IDiagnostic[] = [];

            var startEmitTime = (new Date()).getTime();

            var fileNames = this.fileNameToScript.getAllKeys();

            // Iterate through the files, as long as we don't get a
            for (var i = 0, n = fileNames.length; i < n && diagnostics.length === 0; i++) {
                var script = <Script>this.fileNameToScript.lookup(fileNames[i]);

                if (this.emitOptions.outputMany) {
                    // We're outputting to mulitple files.  We don't want to reuse an emitter in that case.
                    var singleEmitter = this.emitUnit(script, inputOutputMapper);

                    // Close the emitter after each emitted file.
                    if (singleEmitter) {
                        singleEmitter.Close();
                        diagnostics = singleEmitter.diagnostics();
                    }
                }
                else {
                    // We're not outputting to multiple files.  Keep using the same emitter
                    sharedEmitter = this.emitUnit(script, inputOutputMapper, sharedEmitter);
                    if (sharedEmitter) {
                        diagnostics = sharedEmitter.diagnostics();
                    }
                }
            }

            this.logger.log("Emit: " + ((new Date()).getTime() - startEmitTime));

            if (sharedEmitter) {
                sharedEmitter.Close();
                diagnostics = sharedEmitter.diagnostics();
            }

            return diagnostics;
        }

        private outputScriptToUTF8(script: Script): bool {
            return script.containsUnicodeChar || (this.emitOptions.compilationSettings.emitComments && script.containsUnicodeCharInComment);
        }

        private outputScriptsToUTF8(scripts: Script[]): bool {
            for (var i = 0, len = scripts.length; i < len; i++) {
                var script = scripts[i];
                if (this.outputScriptToUTF8(script)) {
                    return true;
                }
            }
            return false;
        }

        private createFile(fileName: string, useUTF8: bool): ITextWriter {
            try {
                // Creating files can cause exceptions, report them.   
                return this.emitOptions.ioHost.createFile(fileName, useUTF8);
            } catch (ex) {
                this.errorReporter.emitterError(ex.message);
            }
        }

        //
        // Pull typecheck infrastructure
        //

        private pullResolveFile(fileName: string): bool {
            if (!this.pullTypeChecker) {
                return false;
            }

            var unit = this.semanticInfoChain.getUnit(fileName);

            if (!unit) {
                return false;
            }

            this.pullTypeChecker.setUnit(fileName);
            this.pullTypeChecker.resolver.resolveBoundDecls(unit.getTopLevelDecls()[0], new PullTypeResolutionContext());

            return true;
        }

        public getSyntacticDiagnostics(fileName: string): IDiagnostic[]{
            return this.fileNameToSyntaxTree.lookup(fileName).diagnostics();
        }

        public getSemanticDiagnostics(fileName: string): IDiagnostic[] {
            var errors: IDiagnostic[] = [];

            var unit = this.semanticInfoChain.getUnit(fileName);

            if (unit) {
                var script: Script = this.fileNameToScript.lookup(fileName);

                if (script) {
                    this.pullTypeChecker.typeCheckScript(script, fileName, this);

                    unit.getDiagnostics(errors);
                }
            }

            return errors;
        }

        public pullTypeCheck(refresh = false, reportDiagnostics = false) {
            return this.timeFunction("pullTypeCheck()", () => {

                if (!this.pullTypeChecker || refresh) {
                    this.semanticInfoChain = new SemanticInfoChain();
                    this.pullTypeChecker = new PullTypeChecker(this.settings, this.semanticInfoChain);
                }

                this.pullErrorReporter.setUnits(this.fileNameToLocationInfo);

                var declCollectionContext: DeclCollectionContext = null;
                var i = 0;

                var createDeclsStartTime = new Date().getTime();

                var fileNames = this.fileNameToScript.getAllKeys();
                for (; i < fileNames.length; i++) {
                    var fileName = fileNames[i];
                    var semanticInfo = new SemanticInfo(fileName, this.fileNameToLocationInfo.lookup(fileName));

                    declCollectionContext = new DeclCollectionContext(semanticInfo);

                    declCollectionContext.scriptName = fileName;

                    // create decls
                    getAstWalkerFactory().walk(this.fileNameToScript.lookup(fileName), preCollectDecls, postCollectDecls, null, declCollectionContext);

                    semanticInfo.addTopLevelDecl(declCollectionContext.getParent());

                    this.semanticInfoChain.addUnit(semanticInfo);
                }

                var createDeclsEndTime = new Date().getTime();

                // bind declaration symbols
                var bindStartTime = new Date().getTime();

                var binder = new PullSymbolBinder(this.settings, this.semanticInfoChain);

                // start at '1', so as to skip binding for global primitives such as 'any'
                for (i = 1; i < this.semanticInfoChain.units.length; i++) {
                    binder.bindDeclsForUnit(this.semanticInfoChain.units[i].getPath());
                }

                var bindEndTime = new Date().getTime();
                //var typeCheckStartTime = new Date().getTime();

                //// resolve symbols
                ////for (i = 0; i < this.scripts.members.length; i++) {
                ////    this.pullResolveFile(this.units[i].fileName);
                ////}

                //var typeCheckEndTime = new Date().getTime();

                var findErrorsStartTime = new Date().getTime();
                // type check
                fileNames = this.fileNameToScript.getAllKeys();
                for (i = 0; i < fileNames.length; i++) {
                    fileName = fileNames[i];

                    if (reportDiagnostics) {
                        this.logger.log("Type checking " + fileName);
                        this.pullTypeChecker.typeCheckScript(<Script>this.fileNameToScript.lookup(fileName), fileName, this);
                    }
                    else {
                        this.logger.log("Resolving " + fileName);
                        this.pullResolveFile(fileName);
                    }
                }
                var findErrorsEndTime = new Date().getTime();

                this.logger.log("Decl creation: " + (createDeclsEndTime - createDeclsStartTime));
                this.logger.log("Binding: " + (bindEndTime - bindStartTime));
                this.logger.log("    Time in findSymbol: " + time_in_findSymbol);
                this.logger.log("Find errors: " + (findErrorsEndTime - findErrorsStartTime));

                if (reportDiagnostics) {
                    this.pullErrorReporter.reportDiagnostics(this.semanticInfoChain.postDiagnostics());
                }
            });
        }

        // returns 'true' if diffs were detected
        private pullUpdateScript(oldScript: Script, newScript: Script): void {
            this.timeFunction("pullUpdateScript: ", () => {

                var declDiffer = new PullDeclDiffer();

                // want to name the new script semantic info the same as the old one
                var newScriptSemanticInfo = new SemanticInfo(oldScript.locationInfo.fileName, newScript.locationInfo);
                var oldScriptSemanticInfo = this.semanticInfoChain.getUnit(oldScript.locationInfo.fileName);

                lastBoundPullDeclId = pullDeclID;
                lastBoundPullSymbolID = pullSymbolID;

                var declCollectionContext = new DeclCollectionContext(newScriptSemanticInfo);

                declCollectionContext.scriptName = oldScript.locationInfo.fileName;

                // create decls
                getAstWalkerFactory().walk(newScript, preCollectDecls, postCollectDecls, null, declCollectionContext);

                var oldTopLevelDecl = oldScriptSemanticInfo.getTopLevelDecls()[0];
                var newTopLevelDecl = declCollectionContext.getParent();

                newScriptSemanticInfo.addTopLevelDecl(newTopLevelDecl);

                var diffResults: PullDeclDiff[] = [];

                var diffStartTime = new Date().getTime();
                declDiffer.diffDecls(oldTopLevelDecl, newTopLevelDecl, diffResults);

                var diffEndTime = new Date().getTime();
                this.logger.log("Update Script - Diff time: " + (diffEndTime - diffStartTime));

                // replace the old semantic info
                this.semanticInfoChain.updateUnit(oldScriptSemanticInfo, newScriptSemanticInfo);

                // re-bind
                var innerBindStartTime = new Date().getTime();

                var topLevelDecls = newScriptSemanticInfo.getTopLevelDecls();

                this.semanticInfoChain.update(newScript.locationInfo.fileName);

                var binder = new PullSymbolBinder(this.settings, this.semanticInfoChain);
                binder.setUnit(newScript.locationInfo.fileName);

                var i = 0;

                for (i = 0; i < topLevelDecls.length; i++) {
                    binder.bindDeclToPullSymbol(topLevelDecls[i], true);
                }

                var innerBindEndTime = new Date().getTime();

                this.logger.log("Update Script - Inner bind time: " + (innerBindEndTime - innerBindStartTime));
                if (diffResults.length) {

                    // propagate changes
                    var graphUpdater = new PullSymbolGraphUpdater(this.semanticInfoChain);
                    var diff: PullDeclDiff;

                    var traceStartTime = new Date().getTime();
                    for (i = 0; i < diffResults.length; i++) {
                        diff = diffResults[i];

                        if (diff.kind === PullDeclEdit.DeclRemoved) {
                            graphUpdater.removeDecl(diff.oldDecl);
                        }
                        else if (diff.kind === PullDeclEdit.DeclAdded) {
                            graphUpdater.addDecl(diff.newDecl);
                            graphUpdater.invalidateType(diff.oldDecl.getSymbol());
                        }
                        else {
                            // PULLTODO: Other kinds of edits
                        }
                    }

                    var traceEndTime = new Date().getTime();

                    // Don't re-typecheck or re-report errors just yet
                    this.pullTypeChecker.typeCheckScript(newScript, newScript.locationInfo.fileName, this);

                    this.logger.log("Update Script - Trace time: " + (traceEndTime - traceStartTime));
                    this.logger.log("Update Script - Number of diffs: " + diffResults.length);

                    this.pullErrorReporter.setUnits(this.fileNameToLocationInfo);

                    //this.pullErrorReporter.reportErrors(this.semanticInfoChain.postErrors())

                    return;
                }

                this.pullErrorReporter.setUnits(this.fileNameToLocationInfo);
                this.pullErrorReporter.reportDiagnostics(this.semanticInfoChain.postDiagnostics());
            });
        }

        public getSymbolOfDeclaration(decl: PullDecl) {
            if (!decl) {
                return null;
            }
            var ast = this.pullTypeChecker.resolver.getASTForDecl(decl);
            if (!ast) {
                return null;
            }
            var enlosingDecl = this.pullTypeChecker.resolver.getEnclosingDecl(decl);
            if (ast.nodeType == NodeType.Member) {
                return this.getSymbolOfDeclaration(enlosingDecl);
            }
            var resolutionContext = new PullTypeResolutionContext();
            return this.pullTypeChecker.resolver.resolveDeclaration(ast, resolutionContext, enlosingDecl);
        }

        public resolvePosition(pos: number, script: Script, scriptName?: string): PullTypeInfoAtPositionInfo {

            // find the enclosing decl
            var declStack: PullDecl[] = [];
            var resultASTs: AST[] = [];
            if (!scriptName) {
                scriptName = script.locationInfo.fileName;
            }
            var semanticInfo = this.semanticInfoChain.getUnit(scriptName);
            var lastDeclAST: AST = null;
            var foundAST: AST = null;
            var symbol: PullSymbol = null;
            var candidateSignature: PullSignatureSymbol = null;
            var callSignatures: PullSignatureSymbol[] = null;

            // these are used to track intermediate nodes so that we can properly apply contextual types
            var lambdaAST: FuncDecl = null;
            var declarationInitASTs: VarDecl[] = [];
            var objectLitAST: UnaryExpression = null;
            var asgAST: BinaryExpression = null;
            var typeAssertionASTs: UnaryExpression[] = [];
            var resolutionContext = new PullTypeResolutionContext();
            var inTypeReference = false;
            var enclosingDecl: PullDecl = null;
            var isConstructorCall = false;

            var pre = (cur: AST, parent: AST): AST => {
                if (isValidAstNode(cur)) {
                    if (pos >= cur.minChar && pos <= cur.limChar) {

                        var previous = resultASTs[resultASTs.length - 1];

                        if (previous === undefined || (cur.minChar >= previous.minChar && cur.limChar <= previous.limChar)) {

                            var decl = semanticInfo.getDeclForAST(cur);

                            if (decl) {
                                declStack[declStack.length] = decl;
                                lastDeclAST = cur;
                            }

                            if (cur.nodeType === NodeType.FuncDecl && hasFlag((<FuncDecl>cur).fncFlags, FncFlags.IsFunctionExpression)) {
                                lambdaAST = <FuncDecl>cur;
                            }
                            else if (cur.nodeType === NodeType.VarDecl) {
                                declarationInitASTs[declarationInitASTs.length] = <VarDecl>cur;
                            }
                            else if (cur.nodeType === NodeType.ObjectLit) {
                                objectLitAST = <UnaryExpression>cur;
                            }
                            else if (cur.nodeType === NodeType.TypeAssertion) {
                                typeAssertionASTs[typeAssertionASTs.length] = <UnaryExpression>cur;
                            }
                            else if (cur.nodeType === NodeType.Asg) {
                                asgAST = <BinaryExpression>cur;
                            }
                            else if (cur.nodeType === NodeType.TypeRef) {
                                inTypeReference = true;
                            }

                            resultASTs[resultASTs.length] = cur;
                        }
                    }
                }
                return cur;
            }

            getAstWalkerFactory().walk(script, pre);

            if (resultASTs.length) {
                this.pullTypeChecker.setUnit(scriptName);

                foundAST = resultASTs[resultASTs.length - 1];

                // Check if is a name of a container
                if (foundAST.nodeType === NodeType.Name && resultASTs.length > 1) {
                    var previousAST = resultASTs[resultASTs.length - 2];
                    switch (previousAST.nodeType) {
                        case NodeType.InterfaceDeclaration:
                        case NodeType.ClassDeclaration:
                        case NodeType.ModuleDeclaration:
                            if (foundAST === (<NamedDeclaration>previousAST).name) {
                                foundAST = previousAST;
                            }
                            break;

                        case NodeType.VarDecl:
                            if (foundAST === (<VarDecl>previousAST).id) {
                                foundAST = previousAST;
                            }
                            break;

                        case NodeType.FuncDecl:
                            if (foundAST === (<FuncDecl>previousAST).name) {
                                foundAST = previousAST;
                            }
                            break;
                    }
                }

                // are we within a decl?  if so, just grab its symbol
                var funcDecl: FuncDecl = null;
                if (lastDeclAST === foundAST) {
                    symbol = declStack[declStack.length - 1].getSymbol();
                    this.pullTypeChecker.resolver.resolveDeclaredSymbol(symbol, null, resolutionContext);
                    enclosingDecl = declStack[declStack.length - 1].getParentDecl();
                    if (foundAST.nodeType === NodeType.FuncDecl) {
                        funcDecl = <FuncDecl>foundAST;
                    }
                }
                else {
                    // otherwise, it's an expression that needs to be resolved, so we must pull...
                    var i = 0;

                    // first, find the enclosing decl
                    for (i = declStack.length - 1; i >= 0; i--) {
                        if (!(declStack[i].getKind() & (PullElementKind.Variable | PullElementKind.Parameter))) {
                            enclosingDecl = declStack[i];
                            break;
                        }
                    }

                    // next, obtain the assigning AST, if applicable
                    // (this would be the ast for the last decl on the decl stack)

                    // if the found AST is a named, we want to check for previous dotted expressions,
                    // since those will give us the right typing
                    var callExpression: CallExpression = null;
                    if ((foundAST.nodeType == NodeType.Super || foundAST.nodeType == NodeType.This || foundAST.nodeType == NodeType.Name) &&
                        resultASTs.length > 1) {
                        for (i = resultASTs.length - 2; i >= 0; i--) {
                            if (resultASTs[i].nodeType === NodeType.Dot &&
                                (<BinaryExpression>resultASTs[i]).operand2 === resultASTs[i + 1]) {
                                foundAST = resultASTs[i];
                            }
                            else if ((resultASTs[i].nodeType === NodeType.Call || resultASTs[i].nodeType === NodeType.New) &&
                                (<CallExpression>resultASTs[i]).target === resultASTs[i + 1]) {
                                callExpression = <CallExpression>resultASTs[i];
                                break;
                            } else if (resultASTs[i].nodeType === NodeType.FuncDecl && (<FuncDecl>resultASTs[i]).name === resultASTs[i + 1]) {
                                funcDecl = <FuncDecl>resultASTs[i];
                                break;
                            } else {
                                break;
                            }
                        }
                    }

                    // if it's a list, we may not have an exact AST, so find the next nearest one
                    if (foundAST.nodeType === NodeType.List) {
                        for (i = 0; i < (<ASTList>foundAST).members.length; i++) {
                            if ((<ASTList>foundAST).members[i].minChar > pos) {
                                foundAST = (<ASTList>foundAST).members[i];
                                break;
                            }
                        }
                    }

                    resolutionContext.resolveAggressively = true;
                    resolutionContext.searchTypeSpace = inTypeReference;

                    var isTypedAssignment = false;

                    if (declarationInitASTs.length) {
                        var assigningAST: VarDecl;
                        var varSymbol: PullSymbol;

                        for (i = 0; i < declarationInitASTs.length; i++) {

                            assigningAST = declarationInitASTs[i];
                            isTypedAssignment = (assigningAST != null) && (assigningAST.typeExpr != null);

                            this.pullTypeChecker.resolver.resolveDeclaration(assigningAST, resolutionContext);
                            varSymbol = this.semanticInfoChain.getSymbolForAST(assigningAST, scriptName);

                            if (varSymbol && isTypedAssignment) {
                                var contextualType = varSymbol.getType();
                                resolutionContext.pushContextualType(contextualType, false, null);
                            }

                            if (assigningAST.init) {
                                this.pullTypeChecker.resolver.resolveAST(assigningAST.init, isTypedAssignment, enclosingDecl, resolutionContext);
                            }
                        }
                    }

                    if (typeAssertionASTs.length) {
                        for (i = 0; i < typeAssertionASTs.length; i++) {
                            this.pullTypeChecker.resolver.resolveAST(typeAssertionASTs[i], isTypedAssignment, enclosingDecl, resolutionContext);
                        }
                    }

                    if (asgAST) {
                        this.pullTypeChecker.resolver.resolveAST(asgAST, isTypedAssignment, enclosingDecl, resolutionContext);
                    }

                    if (objectLitAST) {
                        this.pullTypeChecker.resolver.resolveAST(objectLitAST, isTypedAssignment, enclosingDecl, resolutionContext);
                    }

                    if (lambdaAST) {
                        this.pullTypeChecker.resolver.resolveAST(lambdaAST, true, enclosingDecl, resolutionContext);
                        enclosingDecl = semanticInfo.getDeclForAST(lambdaAST);
                    }

                    symbol = this.pullTypeChecker.resolver.resolveAST(foundAST, isTypedAssignment, enclosingDecl, resolutionContext);
                    if (callExpression) {
                        var isPropertyOrVar = symbol.getKind() == PullElementKind.Property || symbol.getKind() == PullElementKind.Variable;
                        var typeSymbol = symbol.getType();
                        if (isPropertyOrVar) {
                            isPropertyOrVar = (typeSymbol.getKind() != PullElementKind.Interface && typeSymbol.getKind() != PullElementKind.ObjectType) || typeSymbol.getName() == "";
                        }

                        if (!isPropertyOrVar) {
                            isConstructorCall = foundAST.nodeType == NodeType.Super || callExpression.nodeType === NodeType.New;

                            if (foundAST.nodeType == NodeType.Super) {
                                if (symbol.getKind() == PullElementKind.Class) {
                                    callSignatures = (<PullClassTypeSymbol>symbol).getConstructorMethod().getType().getConstructSignatures();
                                }
                            } else {
                                callSignatures = callExpression.nodeType === NodeType.Call ? typeSymbol.getCallSignatures() : typeSymbol.getConstructSignatures();
                            }
                            var callResolutionResults: PullAdditionalCallResolutionData = {
                                targetSymbol: null,
                                resolvedSignatures: null,
                                candidateSignature: null
                            };

                            if (callExpression.nodeType === NodeType.Call) {
                                this.pullTypeChecker.resolver.resolveCallExpression(callExpression, isTypedAssignment, enclosingDecl, resolutionContext, callResolutionResults);
                            } else {
                                this.pullTypeChecker.resolver.resolveNewExpression(callExpression, isTypedAssignment, enclosingDecl, resolutionContext, callResolutionResults);
                            }

                            if (callResolutionResults.candidateSignature) {
                                candidateSignature = callResolutionResults.candidateSignature;
                            }
                            if (callResolutionResults.targetSymbol && callResolutionResults.targetSymbol.getName() != "") {
                                symbol = callResolutionResults.targetSymbol;
                            }
                            foundAST = callExpression;
                        }
                    }
                }

                if (funcDecl) {
                    if (symbol && symbol.getKind() != PullElementKind.Property) {
                        var signatureInfo = PullHelpers.getSignatureForFuncDecl(funcDecl, this.semanticInfoChain, scriptName);
                        candidateSignature = signatureInfo.signature;
                        callSignatures = signatureInfo.allSignatures;
                    }
                } else if (!callSignatures && symbol &&
                    (symbol.getKind() === PullElementKind.Method || symbol.getKind() == PullElementKind.Function)) {
                    var typeSym = symbol.getType()
                    if (typeSym) {
                        callSignatures = typeSym.getCallSignatures();
                    }
                }
            }

            var enclosingScopeSymbol = this.getSymbolOfDeclaration(enclosingDecl);

            return {
                symbol: symbol,
                ast: foundAST,
                enclosingScopeSymbol: enclosingScopeSymbol,
                candidateSignature: candidateSignature,
                callSignatures: callSignatures,
                isConstructorCall: isConstructorCall
            };
        }

        private extractResolutionContextFromPath(path: AstPath, script: Script, scriptName?: string): { ast: AST; enclosingDecl: PullDecl; resolutionContext: PullTypeResolutionContext; isTypedAssignment: bool; } {
            if (!scriptName) {
                scriptName = script.locationInfo.fileName;
            }

            var semanticInfo = this.semanticInfoChain.getUnit(scriptName);
            var enclosingDecl: PullDecl = null;
            var isTypedAssignment = false;

            var resolutionContext = new PullTypeResolutionContext();
            resolutionContext.resolveAggressively = true;

            if (path.count() === 0) {
                return null;
            }

            var i = 0;
            var n = 0;

            // Extract infromation from path
            for (i = 0, n = path.count(); i < n; i++) {
                var current = path.asts[i];
                var decl = semanticInfo.getDeclForAST(current);

                if (decl && !(decl.getKind() & (PullElementKind.Variable | PullElementKind.Parameter))) {
                    enclosingDecl = decl;
                }

                switch (current.nodeType) {
                    case NodeType.FuncDecl:
                        if (hasFlag((<FuncDecl>current).fncFlags, FncFlags.IsFunctionExpression)) {
                            this.pullTypeChecker.resolver.resolveAST((<FuncDecl>current), true, enclosingDecl, resolutionContext);
                        }

                        break;

                    case NodeType.VarDecl:
                        var assigningAST = <VarDecl> current;
                        isTypedAssignment = (assigningAST.typeExpr != null);

                        this.pullTypeChecker.resolver.resolveDeclaration(assigningAST, resolutionContext);
                        var varSymbol = this.semanticInfoChain.getSymbolForAST(assigningAST, scriptName);

                        if (varSymbol && isTypedAssignment) {
                            var contextualType = varSymbol.getType();
                            resolutionContext.pushContextualType(contextualType, false, null);
                        }

                        if (assigningAST.init) {
                            this.pullTypeChecker.resolver.resolveAST(assigningAST.init, isTypedAssignment, enclosingDecl, resolutionContext);
                        }

                        break;

                    case NodeType.ObjectLit:
                        this.pullTypeChecker.resolver.resolveAST((<UnaryExpression>current), isTypedAssignment, enclosingDecl, resolutionContext);
                        break;

                    case NodeType.Asg:
                        this.pullTypeChecker.resolver.resolveAST((<BinaryExpression>current), isTypedAssignment, enclosingDecl, resolutionContext);
                        break;

                    case NodeType.TypeAssertion:
                        this.pullTypeChecker.resolver.resolveAST((<UnaryExpression>current), isTypedAssignment, enclosingDecl, resolutionContext);
                        resolutionContext.searchTypeSpace = true;
                        break;

                    case NodeType.TypeRef:
                    case NodeType.TypeParameter:
                        resolutionContext.searchTypeSpace = true;
                        break;
                }

            }

            // Other possible type space references
            if (path.isNameOfInterface() || path.isInClassImplementsList() || path.isInInterfaceExtendsList()) {
                resolutionContext.searchTypeSpace = true;
            }

            // if the found AST is a named, we want to check for previous dotted expressions,
            // since those will give us the right typing
            if (path.ast().nodeType === NodeType.Name && path.count() > 1) {
                for (i = path.count() - 1; i >= 0; i--) {
                    if (path.asts[path.top - 1].nodeType === NodeType.Dot &&
                        (<BinaryExpression>path.asts[path.top - 1]).operand2 === path.asts[path.top]) {
                        path.pop();
                    }
                    else {
                        break;
                    }
                }
            }

            return {
                ast: path.ast(),
                enclosingDecl: enclosingDecl,
                resolutionContext: resolutionContext,
                isTypedAssignment: isTypedAssignment
            };
        }

        public pullGetSymbolInformationFromPath(path: AstPath, script: Script, scriptName?: string): { symbol: PullSymbol; ast: AST; } {
            var context = this.extractResolutionContextFromPath(path, script, scriptName);
            if (!context) {
                return null;
            }

            var symbol = this.pullTypeChecker.resolver.resolveAST(path.ast(), context.isTypedAssignment, context.enclosingDecl, context.resolutionContext);

            return { symbol: symbol, ast: path.ast() };
        }

        public pullGetCallInformationFromPath(path: AstPath, script: Script, scriptName?: string): { targetSymbol: PullSymbol; resolvedSignatures: PullSignatureSymbol[]; candidateSignature: PullSignatureSymbol; ast: AST; enclosingScopeSymbol: PullSymbol; } {
            // AST has to be a call expression
            if (path.ast().nodeType !== NodeType.Call && path.ast().nodeType !== NodeType.New) {
                return null;
            }

            var isNew = (path.ast().nodeType === NodeType.New);

            var context = this.extractResolutionContextFromPath(path, script, scriptName);
            if (!context) {
                return null;
            }

            var callResolutionResults = {
                targetSymbol: null,
                resolvedSignatures: null,
                candidateSignature: null,
                ast: path.ast(),
                enclosingScopeSymbol: this.getSymbolOfDeclaration(context.enclosingDecl)
            };

            if (isNew) {
                this.pullTypeChecker.resolver.resolveNewExpression(<CallExpression>path.ast(), context.isTypedAssignment, context.enclosingDecl, context.resolutionContext, callResolutionResults);
            }
            else {
                this.pullTypeChecker.resolver.resolveCallExpression(<CallExpression>path.ast(), context.isTypedAssignment, context.enclosingDecl, context.resolutionContext, callResolutionResults);
            }
            return callResolutionResults;
        }

        public pullGetVisibleMemberSymbolsFromPath(path: AstPath, script: Script, scriptName?: string): PullVisibleSymbolsInfo {
            var context = this.extractResolutionContextFromPath(path, script, scriptName);
            if (!context) {
                return null;
            }

            var symbols = this.pullTypeChecker.resolver.getVisibleMembersFromExpresion(path.ast(), context.enclosingDecl, context.resolutionContext);
            if (!symbols) {
                return null;
            }

            return {
                symbols: symbols,
                enclosingScopeSymbol: this.getSymbolOfDeclaration(context.enclosingDecl)
            };
        }

        public pullGetVisibleSymbolsFromPath(path: AstPath, script: Script, scriptName?: string): PullVisibleSymbolsInfo {
            var context = this.extractResolutionContextFromPath(path, script, scriptName);
            if (!context) {
                return null;
            }

            var symbols = this.pullTypeChecker.resolver.getVisibleSymbols(context.enclosingDecl, context.resolutionContext);
            if (!symbols) {
                return null;
            }

            return {
                symbols: symbols,
                enclosingScopeSymbol: this.getSymbolOfDeclaration(context.enclosingDecl)
            };
        }

        public pullGetTypeInfoAtPosition(pos: number, script: Script, scriptName?: string): PullTypeInfoAtPositionInfo {
            return this.timeFunction("pullGetTypeInfoAtPosition for pos " + pos + ":", () => {

                var info = this.resolvePosition(pos, script, scriptName);
                return info;
            });
        }
    }
}