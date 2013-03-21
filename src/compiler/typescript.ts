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
///<reference path='parser.ts' />
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

    export enum UpdateUnitKind {
        Unknown,
        NoEdits,
    }

    export class UpdateUnitResult {
        constructor (public kind: UpdateUnitKind, public fileName: string, public script1: Script, public script2: Script) { }

        static noEdits(fileName: string) {
            return new UpdateUnitResult(UpdateUnitKind.NoEdits, fileName, null, null);
        }

        static unknownEdits(script1: Script, script2: Script) {
            return new UpdateUnitResult(UpdateUnitKind.Unknown, script1.locationInfo.fileName, script1, script2);
        }
    }

    export class ErrorEntry {
        constructor(public fileName: string,
                    public minChar: number,
                    public limChar: number,
                    public message: string) {
        }
    }

    export var defaultSettings = new CompilationSettings();

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

    export interface PullTypeAtPositionInfo {
        symbol: PullSymbol;
        ast: AST;
        enclosingScopeSymbol: PullSymbol;
        candidateSignature: PullSignatureSymbol;
        callSignatures: PullSignatureSymbol[];
    }

    export class TypeScriptCompiler {
        public parser = new Parser();
        public typeChecker: TypeChecker;
        public typeFlow: TypeFlow = null;
        public errorReporter: ErrorReporter;
        public pullErrorReporter: PullErrorReporter;

        public pullTypeChecker: PullTypeChecker = null;
        public semanticInfoChain: SemanticInfoChain = null;

        public persistentTypeState: PersistentGlobalTypeState;

        public emitSettings: EmitOptions;

        public fileNameToScript = new TypeScript.StringHashTable();
        public fileNameToLocationInfo = new TypeScript.StringHashTable();
        public fileNameToSyntaxTree = new TypeScript.StringHashTable();

        constructor(public errorOutput: ITextWriter,
                    public logger: ILogger = new NullLogger(),
                    public settings: CompilationSettings = defaultSettings,
                    public diagnosticMessages: TypeScriptDiagnosticMessages = null) {
            this.errorReporter = new ErrorReporter(this.errorOutput);
            this.pullErrorReporter = new PullErrorReporter(this.errorOutput);
            this.persistentTypeState = new PersistentGlobalTypeState(this.errorReporter);
            this.errorReporter.parser = this.parser;
            this.initTypeChecker(this.errorOutput);

            this.parser.style_requireSemi = this.settings.styleSettings.requireSemi;
            this.parser.style_funcInLoop = this.settings.styleSettings.funcInLoop;
            this.emitSettings = new EmitOptions(this.settings);

            if (this.diagnosticMessages) {
                typescriptDiagnosticMessages = diagnosticMessages
            }

            codeGenTarget = settings.codeGenTarget;
        }

        public timeFunction(funcDescription: string, func: () => any): any {
            return TypeScript.timeFunction(this.logger, funcDescription, func);
        }

        public initTypeChecker(errorOutput: ITextWriter) {
            // The initial "refresh" initializes the persistent type state
            this.persistentTypeState.refreshPersistentState();
            this.typeChecker = new TypeChecker(this.persistentTypeState);
            this.typeChecker.errorReporter = this.errorReporter;

            // REVIEW: These properties should be moved out of the typeCheck object
            // ideally, CF should be a separate pass, independent of control flow
            this.typeChecker.checkControlFlow = this.settings.controlFlow;
            this.typeChecker.checkControlFlowUseDef = this.settings.controlFlowUseDef;
            this.typeChecker.printControlFlowGraph = this.settings.printControlFlow;

            this.typeChecker.errorsOnWith = this.settings.errorOnWith;
            this.typeChecker.styleSettings = this.settings.styleSettings;
            this.typeChecker.canCallDefinitionSignature = this.settings.canCallDefinitionSignature;

            this.errorReporter.checker = this.typeChecker;
            this.setErrorOutput(this.errorOutput);
        }

        public setErrorOutput(outerr) {
            this.errorOutput = outerr;
            this.errorReporter.setErrOut(outerr);
            this.parser.outfile = outerr;
        }

        public emitCommentsToOutput() {
            this.emitSettings = new EmitOptions(this.settings);
        }

        public setErrorCallback(fn: (minChar: number, charLen: number, message: string, fileName: string, lineMap: ILineMap) =>void ) {
            this.parser.errorCallback = fn;
        }

        public updateUnit(prog: string, fileName: string) {
            return this.updateSourceUnit(new StringScriptSnapshot(prog), fileName);
        }

        public updateSourceUnit(sourceText: IScriptSnapshot, fileName: string): bool {
            return this.timeFunction("updateSourceUnit(" + fileName + ")", () => {
                var updateResult = this.partialUpdateUnit(sourceText, fileName);
                return this.applyUpdateResult(updateResult);
            });
        }

        // Apply changes to compiler state.
        // Return "false" if the change is empty and nothing was updated.
        public applyUpdateResult(updateResult: UpdateUnitResult): bool {
            switch (updateResult.kind) {
                case UpdateUnitKind.NoEdits:
                    return false;

                case UpdateUnitKind.Unknown:
                    this.fileNameToScript.addOrUpdate(updateResult.fileName, updateResult.script2);
                    this.fileNameToLocationInfo.addOrUpdate(updateResult.fileName, updateResult.script2.locationInfo);
                    return true;
            }
        }

        public partialUpdateUnit(sourceText: IScriptSnapshot, fileName: string): UpdateUnitResult {
            return this.timeFunction("partialUpdateUnit(" + fileName + ")", () => {
                var oldScript = this.fileNameToScript.lookup(fileName);
                var newScript = SyntaxTreeToAstVisitor.visit(
                    Parser1.parse(new ScriptSnapshotText(sourceText)), fileName);

                return UpdateUnitResult.unknownEdits(oldScript, newScript);
            });
        }

        public addUnit(prog: string, fileName: string, referencedFiles?: IFileReference[] = []): Script {
            return this.addSourceUnit(new StringScriptSnapshot(prog), fileName, referencedFiles);
        }

        private typeCollectionTime = 0;

        public addSourceUnit(sourceText: IScriptSnapshot, fileName: string, referencedFiles?: IFileReference[] = []): Script {
            return this.timeFunction("addSourceUnit(" + fileName + ")", () => {
                //if (fileName.indexOf("getCompletionsAtPosition5") < 0) {
                //    return;
                //}

                var timer = new Timer();
                var reParsedScript: Script = null;
                
                if (!this.settings.usePull) {
                    timer.start();
                    var script: Script = this.parser.parse(sourceText, fileName, AllowedElements.Global);
                    timer.end();

                    reParsedScript = script;

                    var oldParseTime = timer.time;

                    script.referencedFiles = referencedFiles;
                    this.persistentTypeState.setCollectionMode(TypeCheckCollectionMode.Transient);
                }
                else {
                    var text = new TypeScript.ScriptSnapshotText(sourceText);

                    timer.start();
                    var syntaxTree = Parser1.parse(text, LanguageVersion.EcmaScript5);
                    timer.end();

                    var newParseTime = timer.time;

                    timer.start();
                    var script2: Script = SyntaxTreeToAstVisitor.visit(syntaxTree, fileName);
                    timer.end();

                    var translateTime = timer.time;

                    script2.referencedFiles = referencedFiles;

                    reParsedScript = script2;

                    this.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
                }

                this.fileNameToLocationInfo.addOrUpdate(fileName, reParsedScript.locationInfo);

                if (!this.settings.usePull) {
                    var typeCollectionStart = new Date().getTime();
                    this.typeChecker.collectTypes(reParsedScript);
                    this.typeCollectionTime += (new Date().getTime()) - typeCollectionStart;
                }

                this.fileNameToScript.addOrUpdate(fileName, reParsedScript);

                return reParsedScript;
            });
        }

        public typeCheck() {
            return this.timeFunction("typeCheck()", () => {
                var binder = new Binder(this.typeChecker);
                this.typeChecker.fileNameToLocationInfo = this.fileNameToLocationInfo;
                binder.bind(this.typeChecker.globalScope, this.typeChecker.globals);
                binder.bind(this.typeChecker.globalScope, this.typeChecker.ambientGlobals);
                binder.bind(this.typeChecker.globalScope, this.typeChecker.globalTypes);
                binder.bind(this.typeChecker.globalScope, this.typeChecker.ambientGlobalTypes);
                this.typeFlow = new TypeFlow(this.logger, this.typeChecker.globalScope, this.typeChecker);
                var i = 0;
                var script: Script = null;

                // next typecheck scripts that may change
                this.persistentTypeState.setCollectionMode(TypeCheckCollectionMode.Transient);
                var fileNames = this.fileNameToScript.getAllKeys();
                var len = fileNames.length;
                for (i = 0; i < len; i++) {
                    script = this.fileNameToScript.lookup(fileNames[i]);
                    this.typeFlow.assignScopes(script);
                    this.typeFlow.initLibs();
                }
                for (i = 0; i < len; i++) {
                    script = this.fileNameToScript.lookup(fileNames[i]);
                    this.typeFlow.typeCheck(script);
                }

                this.logger.log("Total type collection time: " + this.typeCollectionTime);

                return null;
            });
        }

        public cleanASTTypesForReTypeCheck(ast: AST) {
            function cleanASTType(ast: AST, parent: AST): AST {
                ast.type = null;
                if (ast.nodeType === NodeType.VarDecl) {
                    var vardecl = <VarDecl>ast;
                    vardecl.sym = null;
                }
                else if (ast.nodeType === NodeType.ArgDecl) {
                    var argdecl = <ArgDecl>ast;
                    argdecl.sym = null;
                }
                else if (ast.nodeType === NodeType.Name) {
                    var name = <Identifier>ast;
                    name.sym = null;
                }
                else if (ast.nodeType === NodeType.FuncDecl) {
                    var funcdecl = <FuncDecl>ast;
                    funcdecl.signature = null;
                    funcdecl.freeVariables = []
                    funcdecl.symbols = null;
                    funcdecl.accessorSymbol = null;
                    funcdecl.scopeType = null;
                }
                else if (ast.nodeType === NodeType.ModuleDeclaration) {
                    var modDecl = <ModuleDeclaration>ast;
                    modDecl.mod = null;
                }
                else if (ast.nodeType === NodeType.With) {
                    (<WithStatement>ast).withSym = null;
                }
                else if (ast.nodeType === NodeType.Catch) {
                    (<Catch>ast).containedScope = null;
                }
                else if (ast.nodeType === NodeType.Script) {
                    (<Script>ast).externallyVisibleImportedSymbols = [];
                }
                return ast;
            }

            TypeScript.getAstWalkerFactory().walk(ast, cleanASTType);
        }

        public cleanTypesForReTypeCheck() {
            return this.timeFunction("cleanTypesForReTypeCheck()", () => {
                var fileNames = this.fileNameToScript.getAllKeys();
                for (var i = 0, len = fileNames.length; i < len; i++) {
                    var script = this.fileNameToScript.lookup(fileNames[i]);
                    this.cleanASTTypesForReTypeCheck(script);
                    this.typeChecker.collectTypes(script);
                }

                return null;
            });
        }

        // Return "true" if the incremental typecheck was successful
        // Return "false" if incremental typecheck failed, requiring a full typecheck
        public attemptIncrementalTypeCheck(updateResult: TypeScript.UpdateUnitResult): bool {
            return this.timeFunction("attemptIncrementalTypeCheck()", () => {
                // updateResult.kind === editsInsideFunction
                // updateResult.scope1 === old function
                // updateResult.scope2 === new function
                //REVIEW: What about typecheck errors? How do we replace the old ones with the new ones?
                return false;
            });
        }

        public reTypeCheck() {
            return this.timeFunction("reTypeCheck()", () => {
                CompilerDiagnostics.analysisPass++;
                this.initTypeChecker(this.errorOutput);
                this.persistentTypeState.setCollectionMode(TypeCheckCollectionMode.Transient);
                this.cleanTypesForReTypeCheck();
                return this.typeCheck();
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
                if (script.emitRequired(this.emitSettings)) {
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
                                    this.errorReporter.emitterError(null, "Cannot find the common subdirectory path for the input files");
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

            this.emitSettings.commonDirectoryPath = commonComponents.slice(0, commonComponentsLength).join("/") + "/";
            if (this.emitSettings.outputOption.charAt(this.emitSettings.outputOption.length - 1) != "/") {
                this.emitSettings.outputOption += "/";
            }
        }

        public parseEmitOption(ioHost: EmitterIOHost) {
            this.emitSettings.ioHost = ioHost;
            if (this.emitSettings.outputOption === "") {
                this.emitSettings.outputMany = true;
                this.emitSettings.commonDirectoryPath = "";
                return;
            }

            this.emitSettings.outputOption = switchToForwardSlashes(this.emitSettings.ioHost.resolvePath(this.emitSettings.outputOption));

            // Determine if output options is directory or file
            if (this.emitSettings.ioHost.directoryExists(this.emitSettings.outputOption)) {
                // Existing directory
                this.emitSettings.outputMany = true;
            } else if (this.emitSettings.ioHost.fileExists(this.emitSettings.outputOption)) {
                // Existing file
                this.emitSettings.outputMany = false;
            }
            else {
                // New File/directory
                this.emitSettings.outputMany = !isJSFile(this.emitSettings.outputOption);
            }

            // Verify if options are correct
            if (this.isDynamicModuleCompilation() && !this.emitSettings.outputMany) {
                this.errorReporter.emitterError(null, "Cannot compile dynamic modules when emitting into single file");
            }

            // Parse the directory structure
            if (this.emitSettings.outputMany) {
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

        public useUTF8ForFile(script: Script) {
            if (this.emitSettings.outputMany) {
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

        public emitDeclarationsUnit(script: Script, usePullEmitter?: bool, reuseEmitter?: bool, declarationEmitter?: DeclarationEmitter) {
            if (!this.canEmitDeclarations(script)) {
                return null;
            }

            if (!declarationEmitter) {
                var declareFileName = this.emitSettings.mapOutputFileName(script.locationInfo.fileName, TypeScriptCompiler.mapToDTSFileName);
                var declareFile = this.createFile(declareFileName, this.useUTF8ForFile(script));
                if (usePullEmitter) {
                    declarationEmitter = new PullDeclarationEmitter(this.semanticInfoChain, this.emitSettings, this.errorReporter);
                } else {
                    declarationEmitter = new DeclarationEmitter(this.typeChecker, this.emitSettings, this.errorReporter);
                }
                declarationEmitter.setDeclarationFile(declareFile);
            }

            declarationEmitter.emitDeclarations(script);

            if (!reuseEmitter) {
                declarationEmitter.Close();
                return null;
            } else {
                return declarationEmitter;
            }
        }

        public emitDeclarations(usePullEmitter?: bool) {
            if (!this.canEmitDeclarations()) {
                return;
            }

            if (this.errorReporter.hasErrors || this.pullErrorReporter.hasErrors) {
                // There were errors reported, do not generate declaration file
                return;
            }

            if (this.fileNameToScript.count() === 0) {
                return;
            }

            var declarationEmitter: DeclarationEmitter = null;

            var fileNames = this.fileNameToScript.getAllKeys();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var script = <Script>this.fileNameToScript.lookup(fileNames[i]); 
                if (this.emitSettings.outputMany || declarationEmitter === null) {
                    // Create or reuse file
                    declarationEmitter = this.emitDeclarationsUnit(script, usePullEmitter, !this.emitSettings.outputMany);
                } else {
                    // Emit in existing emitter
                    this.emitDeclarationsUnit(script, usePullEmitter, true, declarationEmitter);
                }
            }

            if (declarationEmitter) {
                declarationEmitter.Close();
            }
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

        public emitUnit(script: Script, reuseEmitter?: bool, emitter?: Emitter, usePullEmitter?: bool, inputOutputMapper?: (inputName: string, outputName: string) => void) {
            if (!script.emitRequired(this.emitSettings)) {
                return null;
            }

            var fname = script.locationInfo.fileName;
            if (!emitter) {
                var outFname = this.emitSettings.mapOutputFileName(fname, TypeScriptCompiler.mapToJSFileName);
                var outFile = this.createFile(outFname, this.useUTF8ForFile(script));
                if (usePullEmitter) {
                    emitter = new PullEmitter(outFname, outFile, this.emitSettings, this.errorReporter, this.semanticInfoChain);
                }
                else {
                    emitter = new Emitter(this.typeChecker, outFname, outFile, this.emitSettings, this.errorReporter);
                }
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
            if (usePullEmitter) {
                (<PullEmitter>emitter).setUnit(script.locationInfo);
            } else {
                this.typeChecker.locationInfo = script.locationInfo;
            }

            emitter.emitJavascript(script, TokenID.Comma, false);
            if (!reuseEmitter) {
                emitter.Close();
                return null;
            } else {
                return emitter;
            }
        }

        public emit(ioHost: EmitterIOHost, usePullEmitter?: bool, inputOutputMapper?: (inputFile: string, outputFile: string) => void) {
            this.parseEmitOption(ioHost);

            var emitter: Emitter = null;
            var fileNames = this.fileNameToScript.getAllKeys();
            var startEmitTime = (new Date()).getTime();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var script = <Script>this.fileNameToScript.lookup(fileNames[i]);
                if (this.emitSettings.outputMany || emitter === null) {
                    emitter = this.emitUnit(script, !this.emitSettings.outputMany, null, usePullEmitter, inputOutputMapper);
                } else {
                    this.emitUnit(script, true, emitter, usePullEmitter);
                }
            }
            this.logger.log("Emit: " + ((new Date()).getTime() - startEmitTime));

            if (emitter) {
                emitter.Close();
            }
        }

        public emitToOutfile(outputFile: ITextWriter) {
            if (this.settings.mapSourceFiles) {
                throw Error("Cannot generate source map");
            }

            if (this.settings.generateDeclarationFiles) {
                throw Error("Cannot generate declaration files");
            }

            if (this.settings.outputOption != "") {
                throw Error("Cannot parse output option");
            }

            var emitter: Emitter = emitter = new Emitter(this.typeChecker, "stdout", outputFile, this.emitSettings, this.errorReporter);

            var fileNames = this.fileNameToScript.getAllKeys();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var script = <Script>this.fileNameToScript.lookup(fileNames[i]);
                this.typeChecker.locationInfo = script.locationInfo;
                emitter.emitJavascript(script, TokenID.Comma, false);
            }
        }

        private outputScriptToUTF8(script: Script): bool {
            return script.containsUnicodeChar || (this.emitSettings.emitComments && script.containsUnicodeCharInComment);
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
                return this.emitSettings.ioHost.createFile(fileName, useUTF8);
            } catch (ex) {
                this.errorReporter.emitterError(null, ex.message);
            }
        }

        //
        // Pull typecheck infrastructure
        //

        public pullResolveFile(fileName: string): bool {
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

        public pullGetErrorsForFile(fileName: string): SemanticError[] {
            var errors: PullError[] = [];

            var unit = this.semanticInfoChain.getUnit(fileName);

            if (unit) {
                var script: Script = this.fileNameToScript.lookup(fileName);

                if (script) {
                    this.pullTypeChecker.typeCheckScript(script, fileName, this);

                    unit.getErrors(errors);
                }
            }

            return errors;
        }

        public pullTypeCheck(refresh = false, reportErrors = false) {
            return this.timeFunction("pullTypeCheck()", () => {

                if (!this.pullTypeChecker || refresh) {
                    this.semanticInfoChain = new SemanticInfoChain();
                    this.pullTypeChecker = new PullTypeChecker(this.semanticInfoChain);
                }

                this.pullErrorReporter.setUnits(this.fileNameToLocationInfo);

                var declCollectionContext: DeclCollectionContext = null;
                var semanticInfo: SemanticInfo = null;
                var i = 0;

                var createDeclsStartTime = new Date().getTime();

                var fileNames = this.fileNameToScript.getAllKeys();
                for (; i < fileNames.length; i++) {
                    var fileName = fileNames[i];
                    semanticInfo = new SemanticInfo(fileName, this.fileNameToLocationInfo.lookup(fileName));

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

                var binder = new PullSymbolBinder(this.semanticInfoChain);

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

                    if ( reportErrors ) {
                        this.logger.log( "Type checking " + fileName );
                        this.pullTypeChecker.typeCheckScript( <Script>this.fileNameToScript.lookup( fileName ), fileName, this );
                    }
                    else {
                        this.logger.log( "Resolving " + fileName );
                        this.pullResolveFile(fileName);
                    }
                }
                var findErrorsEndTime = new Date().getTime();                

                this.logger.log("Decl creation: " + (createDeclsEndTime - createDeclsStartTime));
                this.logger.log("Binding: " + (bindEndTime - bindStartTime));
                this.logger.log("    Time in findSymbol: " + time_in_findSymbol);
                this.logger.log("Find errors: " + (findErrorsEndTime - findErrorsStartTime));

                if (reportErrors) {
                    this.pullErrorReporter.reportErrors(this.semanticInfoChain.postErrors());
                }
            });
        }
        
        // returns 'true' if diffs were detected
        public pullUpdateScript(oldScript: Script, newScript: Script): bool {
            return this.timeFunction("pullUpdateScript: ", () => {
                
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

                var binder = new PullSymbolBinder(this.semanticInfoChain);
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

                    return true;
                }

                this.pullErrorReporter.setUnits(this.fileNameToLocationInfo);
                this.pullErrorReporter.reportErrors(this.semanticInfoChain.postErrors());

                return false;
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
            var resolutionContext = new PullTypeResolutionContext();
            return this.pullTypeChecker.resolver.resolveDeclaration(ast, resolutionContext, enlosingDecl);
        }
        
        public resolvePosition(pos: number, script: Script, scriptName?: string): PullTypeAtPositionInfo {

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

                this.pullTypeChecker.setUnit(script.locationInfo.fileName);

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
                    if (foundAST.nodeType === NodeType.Name && resultASTs.length > 1) {
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
                        var typeSymbol = symbol.getType();
                        callSignatures = callExpression.nodeType === NodeType.Call ? typeSymbol.getCallSignatures() : typeSymbol.getConstructSignatures();
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

                if (funcDecl) {
                    if (symbol && symbol.getKind() != PullElementKind.Property) {
                        var signatureInfo = PullHelpers.getSignatureForFuncDecl(funcDecl, this.pullTypeChecker.resolver.semanticInfoChain, this.pullTypeChecker.resolver.getUnitPath());
                        candidateSignature = signatureInfo.signature;
                        callSignatures = signatureInfo.allSignatures;
                    }
                } else if (symbol && symbol.getKind() === PullElementKind.Method) {
                    var typeSym = symbol.getType()
                    if (typeSym) {
                        callSignatures = typeSym.getCallSignatures();
                    }
                }
            }

            var enclosingScopeSymbol = this.getSymbolOfDeclaration(enclosingDecl);

            return { symbol: symbol, ast: foundAST, enclosingScopeSymbol: enclosingScopeSymbol, candidateSignature: candidateSignature, callSignatures: callSignatures };
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

        public pullGetCallInformationFromPath(path: AstPath, script: Script, scriptName?: string): { targetSymbol: PullSymbol; resolvedSignatures: PullSignatureSymbol[]; candidateSignature: PullSignatureSymbol; ast: AST; } {
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
                ast: path.ast()
            };

            if (isNew) {
                this.pullTypeChecker.resolver.resolveNewExpression(<CallExpression>path.ast(), context.isTypedAssignment, context.enclosingDecl, context.resolutionContext, callResolutionResults);
            }
            else {
                this.pullTypeChecker.resolver.resolveCallExpression(<CallExpression>path.ast(), context.isTypedAssignment, context.enclosingDecl, context.resolutionContext, callResolutionResults);
            }

            return callResolutionResults;
        }

        public pullGetVisibleMemberSymbolsFromPath(path: AstPath, script: Script, scriptName?: string): PullSymbol[] {
            var context = this.extractResolutionContextFromPath(path, script, scriptName);
            if (!context) {
                return null;
            }

            return this.pullTypeChecker.resolver.getVisibleMembersFromExpresion(path.ast(), context.enclosingDecl, context.resolutionContext);
        }

        public pullGetVisibleSymbolsFromPath(path: AstPath, script: Script, scriptName?: string): PullSymbol[] {

            var context = this.extractResolutionContextFromPath(path, script, scriptName);
            if (!context) {
                return null;
            }

            return this.pullTypeChecker.resolver.getVisibleSymbols(context.enclosingDecl, context.resolutionContext);
        }

        public pullGetTypeInfoAtPosition(pos: number, script: Script, scriptName?: string): PullTypeAtPositionInfo {
            return this.timeFunction("pullGetTypeInfoAtPosition for pos " + pos + ":", () => {
                
                var info = this.resolvePosition(pos, script, scriptName);
                return info;
            });
        }

        public pullUpdateUnit(sourceText: IScriptSnapshot, fileName: string): bool {
            return this.timeFunction("pullUpdateUnit(" + fileName + ")", () => {
                var updateResult: UpdateUnitResult;

                var oldScript = <Script>this.fileNameToScript.lookup(fileName);

                var syntaxTree = Parser1.parse(new TypeScript.ScriptSnapshotText(sourceText), LanguageVersion.EcmaScript5);
                var newScript = SyntaxTreeToAstVisitor.visit(syntaxTree, fileName);

                this.fileNameToSyntaxTree.addOrUpdate(fileName, syntaxTree);
                this.fileNameToScript.addOrUpdate(fileName, newScript);
                this.fileNameToLocationInfo.addOrUpdate(fileName, newScript.locationInfo);

                return this.pullUpdateScript(oldScript, newScript);
            });
        }
    }

    export class ScopeEntry {
        constructor (
            public name: string,
            public type: string,
            public sym: Symbol) {
        }
    }

    export class ScopeTraversal {
        constructor (private compiler: TypeScriptCompiler) {
        }

        public getScope(enclosingScopeContext: EnclosingScopeContext): SymbolScope {
            if (enclosingScopeContext.enclosingObjectLit && enclosingScopeContext.isMemberCompletion) {
                return enclosingScopeContext.getObjectLiteralScope();
            }
            else if (enclosingScopeContext.isMemberCompletion) {
                if (enclosingScopeContext.useFullAst) {
                    return this.compiler.typeFlow.findMemberScopeAtFullAst(enclosingScopeContext)
                }
                else {
                    return this.compiler.typeFlow.findMemberScopeAt(enclosingScopeContext)
                }
            }
            else {
                return enclosingScopeContext.getScope();
            }
        }

        public getScopeEntries(enclosingScopeContext: EnclosingScopeContext, getPrettyTypeName?: bool): ScopeEntry[] {
            var scope = this.getScope(enclosingScopeContext);
            if (scope === null) {
                return [];
            }

            var inScopeNames: IHashTable = new StringHashTable();
            var allSymbolNames: string[] = scope.getAllSymbolNames(enclosingScopeContext.isMemberCompletion);

            // there may be duplicates between the type and value tables, so batch the symbols
            // getTypeNamesForNames will prefer the entry in the value table
            for (var i = 0; i < allSymbolNames.length; i++) {
                var name = allSymbolNames[i];

                // Skip global/internal symbols that won't compile in user code
                if (name === globalId || name === "_Core" || name === "_element") {
                    continue;
                }

                inScopeNames.add(name, "");
            }

            var svModuleDecl = this.compiler.typeChecker.currentModDecl;
            this.compiler.typeChecker.currentModDecl = enclosingScopeContext.deepestModuleDecl;

            var result = this.getTypeNamesForNames(enclosingScopeContext, inScopeNames.getAllKeys(), scope, getPrettyTypeName);

            this.compiler.typeChecker.currentModDecl = svModuleDecl;
            return result;
        }

        private getTypeNamesForNames(enclosingScopeContext: EnclosingScopeContext, allNames: string[], scope: SymbolScope, getPrettyTypeName? : bool): ScopeEntry[] {
            var result: ScopeEntry[] = [];

            var enclosingScope = enclosingScopeContext.getScope();
            for (var i = 0; i < allNames.length; i++) {
                var name = allNames[i];
                // Search for the id in the value space first
                // if we don't find it, search in the type space.
                // We don't want to search twice, because the first
                // search may insert the name in the symbol value table
                // if the scope is aggregate
                var publicsOnly = enclosingScopeContext.publicsOnly && enclosingScopeContext.isMemberCompletion;
                var symbol = scope.find(name, publicsOnly, false/*typespace*/);  // REVIEW: Should search public members only?
                if (symbol === null) {
                    symbol = scope.find(name, publicsOnly, true/*typespace*/);
                }

                var displayThisMember = symbol && symbol.flags & SymbolFlags.Private ? symbol.container === scope.container : true;

                if (symbol) {
                    // Do not add dynamic module names to the list, since they're not legal as identifiers
                    if (displayThisMember && !isQuoted(symbol.name) && !isRelative(symbol.name)) {
                        var getPrettyOverload = getPrettyTypeName && symbol.declAST && symbol.declAST.nodeType === NodeType.FuncDecl;
                        var type = symbol.getType();
                        var typeName = type ? type.getScopedTypeName(enclosingScope, getPrettyOverload) : "";
                        result.push(new ScopeEntry(name, typeName, symbol));
                    }
                }
                else {
                    // Special case for "true" and "false"
                    // REVIEW: This may no longer be necessary?
                    if (name === "true" || name === "false") {
                        result.push(new ScopeEntry(name, "bool", this.compiler.typeChecker.booleanType.symbol));
                    }
                }
            }

            return result;
        }
    }
}
