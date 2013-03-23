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

///<reference path='typescript.ts' />
///<reference path='Text\IScriptSnapshot.ts' />

module TypeScript {

    /// Compiler settings

    export class StyleSettings {
        // bitwise operations not permitted
        public bitwise = false;  
        // disallow non-block statements as bodies of compound statements
        public blockInCompoundStmt = false;
        // disallow == and !=
        public eqeqeq = false;
        // require body of for in loop to start with a filter
        public forin = false;
        // empty blocks permitted
        public emptyBlocks = true;
        // require result of new expression to be used (no new just for side-effects)
        public newMustBeUsed = false;
        // require semicolons to terminate statements
        public requireSemi = false;
        // no top-level assignment in conditionals if (a=b) { ...
        public assignmentInCond = false;
        // no == null or != null
        public eqnull = false;
        // permit eval
        public evalOK = true;
        // permit var use if decl in inner scope as in if (c) { var v=10; } v=11;
        public innerScopeDeclEscape = true;
        // permit functions in loops
        public funcInLoop = true;
        // permit re-declaration of local variable 
        public reDeclareLocal = true;
        // permit obj['x'] in addition to obj.x
        public literalSubscript = true;
        // flag implicit 'any'
        public implicitAny = false;

        public setOption(opt: string, val: bool): bool {
            var optExists = this[opt];
            if (optExists !== undefined) {
                this[opt] = val;
                return true;
            }
            else {
                return false;
            }
        }
        
        public parseOptions(str: string) {
            var opts=str.split(";");
            for (var i = 0, len = opts.length; i < len; i++) {
                var opt = opts[i];
                var val = true;
                var colonIndex=opt.lastIndexOf(":");
                if (colonIndex >= 0) {
                    var valStr = opt.substring(colonIndex+1);
                    opt = opt.substring(0, colonIndex);
                    if (valStr == "off") {
                        val = false;
                    }
                }
                if (!this.setOption(opt, val)) {
                    return false;
                }
            }
            return true;
        }
    }
    
    export class CompilationSettings {
        public styleSettings = new StyleSettings();
        public propagateConstants = false;
        public minWhitespace = false;
        public emitComments = false;
        public watch = false;
        public exec = false;
        public resolve = true;
        public controlFlow = false;
        public printControlFlow = false;
        public controlFlowUseDef = false;
        public errorOnWith = true;
        public canCallDefinitionSignature = false;

        public useDefaultLib = true;

        public codeGenTarget = LanguageVersion.EcmaScript3;
        public moduleGenTarget = ModuleGenTarget.Synchronous;
        public optimizeModuleCodeGen = true;

        // --out option passed. 
        // Default is the "" which leads to multiple files generated next to the.ts files
        public outputOption: string = "";
        public mapSourceFiles = false;
        public emitFullSourceMapPath = false; // By default emit relative path of the soucemap
        public generateDeclarationFiles = false;

        public useCaseSensitiveFileResolution = false;
        public gatherDiagnostics = false;

        public setStyleOptions(str: string) {
            this.styleSettings.parseOptions(str);
        }
    }

    ///
    /// Preprocessing
    ///
    export interface IPreProcessedFileInfo {
        settings: CompilationSettings;
        referencedFiles: IFileReference[];
        importedFiles: IFileReference[];
        isLibFile: bool;
    }

    export interface ITripleSlashDirectiveProperties {
        noDefaultLib: bool;
    }

    function getFileReferenceFromReferencePath(comment: string): IFileReference {
        var referencesRegEx = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*\/>/gim;
        var match = referencesRegEx.exec(comment);

        if (match) {
            var path: string = normalizePath(match[3]);
            var adjustedPath = normalizePath(path);
    
            var isResident = match.length >= 7 && match[6] == "true";
            if (isResident) {
                CompilerDiagnostics.debugPrint(path + " is resident");
            }
            return {
                line: 0,
                character: 0,
                position: 0,
                length: 0,
                path: switchToForwardSlashes(adjustedPath),
                isResident: isResident
            };
        }
        else {
            return null;
        }
    }

    // used in the parser, but kept here in case we want to reintegrate it with preprocessing
    export function getAdditionalDependencyPath(comment: string): string {
        var amdDependencyRegEx = /^(\/\/\/\s*<amd-dependency\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*\/>/gim;
        var match = amdDependencyRegEx.exec(comment);

        if (match) {
            var path: string = match[3];
            return path;
        }
        else {
            return null;
        }
    }

    export function getImplicitImport(comment: string): bool {
        var implicitImportRegEx = /^(\/\/\/\s*<implicit-import\s*)*\/>/gim;
        var match = implicitImportRegEx.exec(comment);

        if (match) {
            return true;
        }
        
        return false;
    }

    export function getStyleSettings(comment: string, styleSettings: StyleSettings) {
        var styleRegEx = /^(\/\/\/\s*<style\s+)(([a-zA-Z])+=('|").+('|"))\s*\/>/gim;

        var settings = styleRegEx.exec(comment);

        if (settings) {
            var settingsRegEx = /^([a-zA-Z]+=['"]on['|"])/gim;
            settings = settingsRegEx.exec(settings[2]);
                
            if (settings) {
                for (var i = 0; i < settings.length; i++) {
                    var setting = (<string>settings[i]).split("=");
                    var on = "\"on\"";

                    switch (setting[0]) {
                        case "blockInCompoundStmt": styleSettings.blockInCompoundStmt = setting[1] == on; break;
                        case "eqeqeq": styleSettings.eqeqeq = setting[1] == on; break;
                        case "forin": styleSettings.forin = setting[1] == on; break;
                        case "emptyBlocks": styleSettings.emptyBlocks = setting[1] == on; break;
                        case "newMustBeUsed": styleSettings.newMustBeUsed = setting[1] == on; break;
                        case "requireSemi": styleSettings.requireSemi = setting[1] == on; break;
                        case "assignmentInCond": styleSettings.assignmentInCond = setting[1] == on; break;
                        case "eqnull": styleSettings.eqnull = setting[1] == on; break;
                        case "evalOK": styleSettings.evalOK = setting[1] == on; break;
                        case "innerScopeDeclEscape": styleSettings.innerScopeDeclEscape = setting[1] == on; break;
                        case "funcInLoop": styleSettings.funcInLoop = setting[1] == on; break;
                        case "reDeclareLocal": styleSettings.reDeclareLocal = setting[1] == on; break;
                        case "literalSubscript": styleSettings.literalSubscript = setting[1] == on; break;
                        case "implicitAny": styleSettings.implicitAny = setting[1] == on; break;                               
                    }
                }
            }
        }
    }

    export function getReferencedFiles(fileName: string, sourceText: IScriptSnapshot): IFileReference[] {
        var preProcessInfo = preProcessFile(fileName, sourceText, null, false);
        return preProcessInfo.referencedFiles;
    }

    var scannerWindow = ArrayUtilities.createArray(2048, 0);
    var scannerDiagnostics = [];

    function processImports(lineMap: LineMap, scanner: Scanner1, token: ISyntaxToken, importedFiles: IFileReference[]): void {
        var position = 0;
        var lineChar = { line: -1, character: -1 };

        // Look for: 
        // import foo = module("foo")
        while (token.tokenKind !== SyntaxKind.EndOfFileToken) {
            if (token.tokenKind === SyntaxKind.ImportKeyword) {
                var importStart = position + token.leadingTriviaWidth();
                token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                if (SyntaxFacts.isIdentifierNameOrAnyKeyword(token)) {
                    token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                    if (token.tokenKind === SyntaxKind.EqualsToken) {
                        token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                        if (token.tokenKind === SyntaxKind.ModuleKeyword) {
                            token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                            if (token.tokenKind === SyntaxKind.OpenParenToken) {
                                var afterOpenParenPosition = scanner.absoluteIndex();
                                token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

                                lineMap.fillLineAndCharacterFromPosition(importStart, lineChar);

                                if (token.tokenKind === SyntaxKind.StringLiteral) {
                                    var ref = {
                                        line: lineChar.line,
                                        character: lineChar.character,
                                        position: afterOpenParenPosition + token.leadingTriviaWidth(),
                                        length: token.width(),
                                        path: stripQuotes(switchToForwardSlashes(token.text())),
                                        isResident: false
                                    };
                                    importedFiles.push(ref);
                                }
                            }
                        }
                    }
                }
            }

            position = scanner.absoluteIndex();
            token = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);
        }
    }

    export function processTripleSlashDirectives(lineMap: LineMap, firstToken: ISyntaxToken, settings: CompilationSettings, referencedFiles: IFileReference[]): ITripleSlashDirectiveProperties {
        var leadingTrivia = firstToken.leadingTrivia();

        var position = 0;
        var lineChar = { line: -1, character: -1 };
        var noDefaultLib = false;

        for (var i = 0, n = leadingTrivia.count(); i < n; i++) {
            var trivia = leadingTrivia.syntaxTriviaAt(i);

            if (trivia.kind() === SyntaxKind.SingleLineCommentTrivia) {
                var triviaText = trivia.fullText();
                var referencedCode = getFileReferenceFromReferencePath(triviaText);

                if (referencedCode) {
                    lineMap.fillLineAndCharacterFromPosition(position, lineChar);
                    referencedCode.line = lineChar.line;
                    referencedCode.character = lineChar.character;

                    referencedFiles.push(referencedCode);
                }

                if (settings) {
                    getStyleSettings(triviaText, settings.styleSettings);

                    // is it a lib file?
                    var isNoDefaultLibRegex = /^(\/\/\/\s*<reference\s+no-default-lib=)('|")(.+?)\2\s*\/>/gim;
                    var isNoDefaultLibMatch: any = isNoDefaultLibRegex.exec(triviaText);
                    if (isNoDefaultLibMatch) {
                        noDefaultLib = (isNoDefaultLibMatch[3] == "true");
                    }
                }
            }

            position += trivia.fullWidth();
        }

        return { noDefaultLib: noDefaultLib};
    }

    export function preProcessFile(fileName: string, sourceText: IScriptSnapshot, settings?: CompilationSettings = new CompilationSettings(), readImportFiles? = true): IPreProcessedFileInfo {
        var text = SimpleText.fromScriptSnapshot(sourceText);
        var scanner = new Scanner1(fileName, text, LanguageVersion.EcmaScript5, scannerWindow);

        var firstToken = scanner.scan(scannerDiagnostics, /*allowRegularExpression:*/ false);

        // only search out dynamic mods
        // if you find a dynamic mod, ignore every other mod inside, until you balance rcurlies
        // var position

        var importedFiles: IFileReference[] = [];
        if (readImportFiles) {
            processImports(text.lineMap(), scanner, firstToken, importedFiles);
        }
        
        var referencedFiles: IFileReference[] = [];
        var properties  = processTripleSlashDirectives(text.lineMap(), firstToken, settings, referencedFiles);

        scannerDiagnostics.length = 0;
        return { settings:settings, referencedFiles: referencedFiles, importedFiles: importedFiles, isLibFile: properties.noDefaultLib };
    }

} // Tools