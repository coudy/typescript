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

module TypeScript {
    export enum EmitContainer {
        Prog,
        Module,
        DynamicModule,
        Class,
        Constructor,
        Function,
        Args,
        Interface,
    }

    export class EmitState {
        public column: number;
        public line: number;
        public inObjectLiteral: boolean;
        public container: EmitContainer;

        constructor() {
            this.column = 0;
            this.line = 0;
            this.inObjectLiteral = false;
            this.container = EmitContainer.Prog;
        }
    }

    export class EmitOptions {
        public ioHost: EmitterIOHost = null;
        public outputMany: boolean = true;
        public commonDirectoryPath = "";

        constructor(public compilationSettings: CompilationSettings) {
        }

        public mapOutputFileName(fileName: string, extensionChanger: (fname: string, wholeFileNameReplaced: boolean) => string) {
            if (this.outputMany) {
                var updatedFileName = fileName;
                if (this.compilationSettings.outputOption != "") {
                    // Replace the common directory path with the option specified
                    updatedFileName = fileName.replace(this.commonDirectoryPath, "");
                    updatedFileName = this.compilationSettings.outputOption + updatedFileName;
                }
                return extensionChanger(updatedFileName, false);
            } else {
                return extensionChanger(this.compilationSettings.outputOption, true);
            }
        }
    }

    export class Indenter {
        static indentStep: number = 4;
        static indentStepString: string = "    ";
        static indentStrings: string[] = [];
        public indentAmt: number = 0;

        public increaseIndent() {
            this.indentAmt += Indenter.indentStep;
        }

        public decreaseIndent() {
            this.indentAmt -= Indenter.indentStep;
        }

        public getIndent() {
            var indentString = Indenter.indentStrings[this.indentAmt];
            if (indentString === undefined) {
                indentString = "";
                for (var i = 0; i < this.indentAmt; i = i + Indenter.indentStep) {
                    indentString += Indenter.indentStepString;
                }
                Indenter.indentStrings[this.indentAmt] = indentString;
            }
            return indentString;
        }
    }

    export interface BoundDeclInfo {
        boundDecl: BoundDecl;
        pullDecl: PullDecl;
    }

    export class Emitter {
        public globalThisCapturePrologueEmitted = false;
        public extendsPrologueEmitted = false;
        public thisClassNode: TypeDeclaration = null;
        public thisFunctionDeclaration: FunctionDeclaration = null;
        public moduleName = "";
        public emitState = new EmitState();
        public indenter = new Indenter();
        public modAliasId: string = null;
        public firstModAlias: string = null;
        public allSourceMappers: SourceMapper[] = [];
        public sourceMapper: SourceMapper = null;
        public captureThisStmtString = "var _this = this;";
        public varListCountStack: number[] = [0];
        private pullTypeChecker: PullTypeChecker = null;
        private declStack: PullDecl[] = [];
        private resolvingContext = new PullTypeResolutionContext();

        public document: Document = null;

        constructor(public emittingFileName: string,
                    public outfile: ITextWriter,
                    public emitOptions: EmitOptions,
                    private semanticInfoChain: SemanticInfoChain) {
            this.pullTypeChecker = new PullTypeChecker(emitOptions.compilationSettings, semanticInfoChain);
        }

        private pushDecl(decl: PullDecl) {
            if (decl) {
                this.declStack[this.declStack.length] = decl;
            }
        }

        private popDecl(decl: PullDecl) {
            if (decl) {
                this.declStack.length--;
            }
        }

        private getEnclosingDecl() {
            var declStackLen = this.declStack.length;
            var enclosingDecl = declStackLen > 0 ? this.declStack[declStackLen - 1] : null;
            return enclosingDecl;
        }

        private setTypeCheckerUnit(fileName: string) {
            if (!this.pullTypeChecker.resolver) {
                this.pullTypeChecker.setUnit(fileName);
                return;
            }

            this.pullTypeChecker.resolver.setUnitPath(fileName);
        }

        public setDocument(document: Document) {
            this.document = document;
        }

        public importStatementShouldBeEmitted(importDeclAST: ImportDeclaration, unitPath?: string): boolean {
            if (!importDeclAST.isDynamicImport) {
                return true;
            }

            var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST, this.document.fileName);
            var pullSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();
            return pullSymbol.getIsUsedAsValue();
        }

        public setSourceMappings(mapper: SourceMapper) {
            this.allSourceMappers.push(mapper);
            this.sourceMapper = mapper;
        }

        public writeToOutput(s: string) {
            this.outfile.Write(s);
            // TODO: check s for newline
            this.emitState.column += s.length;
        }

        public writeToOutputTrimmable(s: string) {
            if (this.emitOptions.compilationSettings.minWhitespace) {
                s = s.replace(/[\s]*/g, '');
            }
            this.writeToOutput(s);
        }

        public writeLineToOutput(s: string) {
            if (this.emitOptions.compilationSettings.minWhitespace) {
                this.writeToOutput(s);
                var c = s.charCodeAt(s.length - 1);
                if (!((c === CharacterCodes.space) || (c === CharacterCodes.semicolon) || (c === CharacterCodes.openBracket))) {
                    this.writeToOutput(' ');
                }
            }
            else {
                this.outfile.WriteLine(s);
                this.emitState.column = 0
                this.emitState.line++;
            }
        }

        public writeCaptureThisStatement(ast: AST) {
            this.emitIndent();
            this.recordSourceMappingStart(ast);
            this.writeToOutput(this.captureThisStmtString);
            this.recordSourceMappingEnd(ast);
            this.writeLineToOutput("");
        }

        public setInVarBlock(count: number) {
            this.varListCountStack[this.varListCountStack.length - 1] = count;
        }

        public setInObjectLiteral(val: boolean): boolean {
            var temp = this.emitState.inObjectLiteral;
            this.emitState.inObjectLiteral = val;
            return temp;
        }

        public setContainer(c: number): number {
            var temp = this.emitState.container;
            this.emitState.container = c;
            return temp;
        }

        private getIndentString() {
            if (this.emitOptions.compilationSettings.minWhitespace) {
                return "";
            }
            else {
                return this.indenter.getIndent();
            }
        }

        public emitIndent() {
            this.writeToOutput(this.getIndentString());
        }

        public emitCommentInPlace(comment: Comment) {
            var text = comment.getText();
            var hadNewLine = false;

            if (comment.isBlockComment) {
                if (this.emitState.column === 0) {
                    this.emitIndent();
                }
                this.recordSourceMappingStart(comment);
                this.writeToOutput(text[0]);

                if (text.length > 1 || comment.endsLine) {
                    for (var i = 1; i < text.length; i++) {
                        this.writeLineToOutput("");
                        this.emitIndent();
                        this.writeToOutput(text[i]);
                    }
                    this.recordSourceMappingEnd(comment);
                    this.writeLineToOutput("");
                    hadNewLine = true;
                } else {
                    this.recordSourceMappingEnd(comment);
                }
            }
            else {
                if (this.emitState.column === 0) {
                    this.emitIndent();
                }
                this.recordSourceMappingStart(comment);
                this.writeToOutput(text[0]);
                this.recordSourceMappingEnd(comment);
                this.writeLineToOutput("");
                hadNewLine = true;
            }

            if (hadNewLine) {
                this.emitIndent();
            }
            else {
                this.writeToOutput(" ");
            }
        }

        public emitComments(ast: AST, pre: boolean) {
            var comments = pre ? ast.preComments : ast.postComments;

            if (this.emitOptions.compilationSettings.emitComments && comments && comments.length != 0) {
                for (var i = 0; i < comments.length; i++) {
                    this.emitCommentInPlace(comments[i]);
                }
            }
        }

        private useNewLinesInLiteral(): boolean {
            var useNewLines = true;
            for (var i = this.varListCountStack.length - 1; i >= 0; i--) {
                // If we're in any var decl, not in the last position, then don't emit newlines.
                if (this.varListCountStack[i] < -1 || this.varListCountStack[i] > 1) {
                    return false;
                }
            }

            return true;
        }

        public emitObjectLiteral(content: ASTList) {
            var useNewLines = this.useNewLinesInLiteral();

            this.writeToOutput("{");
            if (content && content.members.length > 0) {
                if (useNewLines) {
                    this.writeLineToOutput("");
                }

                this.indenter.increaseIndent();
                var inObjectLiteral = this.setInObjectLiteral(true);
                var separator = useNewLines ? "," : ", ";
                this.emitJavascriptList(content, separator, useNewLines, false, false);
                this.setInObjectLiteral(inObjectLiteral);
                this.indenter.decreaseIndent();
                this.emitIndent();
            }
            this.writeToOutput("}");
        }

        public emitArrayLiteral(content: ASTList) {
            var useNewLines = this.useNewLinesInLiteral();

            this.writeToOutput("[");
            if (content && content.members.length > 0) {
                if (useNewLines) {
                    this.writeLineToOutput("");
                }

                this.indenter.increaseIndent();
                var separator = useNewLines ? "," : ", ";
                this.emitJavascriptList(content, separator, useNewLines, false, false);
                this.indenter.decreaseIndent();
                this.emitIndent();
            }
            this.writeToOutput("]");
        }

        public emitNew(target: AST, args: ASTList) {
            this.writeToOutput("new ");
            if (target.nodeType === NodeType.TypeRef) {
                var typeRef = <TypeReference>target;
                if (typeRef.arrayCount) {
                    this.writeToOutput("Array()");
                }
                else {
                    this.emitJavascript(typeRef.term, false);
                    this.writeToOutput("()");
                }
            }
            else {
                this.emitJavascript(target, false);
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                this.emitJavascriptList(args, ", ", false, false, false);
                this.writeToOutput(")");
                this.recordSourceMappingEnd(args);
            }
        }

        public getVarDeclFromIdentifier(boundDeclInfo: BoundDeclInfo): BoundDeclInfo {
            CompilerDiagnostics.assert(boundDeclInfo.boundDecl && boundDeclInfo.boundDecl.init &&
            boundDeclInfo.boundDecl.init.nodeType == NodeType.Name,
            "The init expression of bound declaration when emitting as constant has to be indentifier");

            var init = boundDeclInfo.boundDecl.init;
            var ident = <Identifier>init;

            this.setTypeCheckerUnit(this.document.fileName);
            var pullSymbol = this.resolvingContext.resolvingTypeReference ? this.pullTypeChecker.resolver.resolveTypeNameExpression(ident, boundDeclInfo.pullDecl.getParentDecl(), this.resolvingContext)
                                : this.pullTypeChecker.resolver.resolveNameExpression(ident, boundDeclInfo.pullDecl.getParentDecl(), this.resolvingContext);
            if (pullSymbol) {
                var pullDecls = pullSymbol.getDeclarations();
                if (pullDecls.length == 1) {
                    var pullDecl = pullDecls[0];
                    var ast = this.semanticInfoChain.getASTForDecl(pullDecl);
                    if (ast && ast.nodeType == NodeType.VariableDeclarator) {
                        return { boundDecl: <VariableDeclarator>ast, pullDecl: pullDecl };
                    }
                }
            }

            return null;
        }

        private getConstantValue(boundDeclInfo: BoundDeclInfo): number {
            var init = boundDeclInfo.boundDecl.init;
            if (init) {
                if (init.nodeType === NodeType.NumericLiteral) {
                    var numLit = <NumberLiteral>init;
                    return numLit.value;
                }
                else if (init.nodeType === NodeType.LeftShiftExpression) {
                    var binop = <BinaryExpression>init;
                    if (binop.operand1.nodeType === NodeType.NumericLiteral &&
                    binop.operand2.nodeType === NodeType.NumericLiteral) {
                        return (<NumberLiteral>binop.operand1).value << (<NumberLiteral>binop.operand2).value;
                    }
                }
                else if (init.nodeType === NodeType.Name) {
                    var varDeclInfo = this.getVarDeclFromIdentifier(boundDeclInfo);
                    if (varDeclInfo) {
                        return this.getConstantValue(varDeclInfo);
                    }
                }
            }

            return null;
        }

        public getConstantDecl(dotExpr: BinaryExpression): BoundDeclInfo {
            this.setTypeCheckerUnit(this.document.fileName);
            var pullSymbol = this.pullTypeChecker.resolver.resolveDottedNameExpression(dotExpr, this.getEnclosingDecl(), this.resolvingContext);
            if (pullSymbol && pullSymbol.hasFlag(PullElementFlags.Constant)) {
                var pullDecls = pullSymbol.getDeclarations();
                if (pullDecls.length == 1) {
                    var pullDecl = pullDecls[0];
                    var ast = this.semanticInfoChain.getASTForDecl(pullDecl);
                    if (ast && ast.nodeType == NodeType.VariableDeclarator) {
                        return { boundDecl: <VariableDeclarator>ast, pullDecl: pullDecl };
                    }
                }
            }

            return null;
        }

        public tryEmitConstant(dotExpr: BinaryExpression) {
            if (!this.emitOptions.compilationSettings.propagateConstants) {
                return false;
            }
            var propertyName = <Identifier>dotExpr.operand2;
            var boundDeclInfo = this.getConstantDecl(dotExpr);
            if (boundDeclInfo) {
                var value = this.getConstantValue(boundDeclInfo);
                if (value !== null) {
                    this.writeToOutput(value.toString());
                    var comment = " /* ";
                    comment += propertyName.actualText;
                    comment += " */ ";
                    this.writeToOutput(comment);
                    return true;
                }
            }

            return false;
        }

        public emitCall(callNode: CallExpression, target: AST, args: ASTList) {
            if (!this.emitSuperCall(callNode)) {
                if (target.nodeType === NodeType.FunctionDeclaration) {
                    this.writeToOutput("(");
                }
                if (callNode.target.nodeType === NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
                    this.writeToOutput("_super.call");
                }
                else {
                    this.emitJavascript(target, false);
                }
                if (target.nodeType === NodeType.FunctionDeclaration) {
                    this.writeToOutput(")");
                }
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                if (callNode.target.nodeType === NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
                    this.writeToOutput("this");
                    if (args && args.members.length) {
                        this.writeToOutput(", ");
                    }
                }
                this.emitJavascriptList(args, ", ", false, false, false);
                this.writeToOutput(")");
                this.recordSourceMappingEnd(args);
            }
        }

        public emitInnerFunction(funcDecl: FunctionDeclaration, printName: boolean, isMember: boolean,
                                 hasSelfRef: boolean, classDecl: TypeDeclaration) {

            /// REVIEW: The code below causes functions to get pushed to a newline in cases where they shouldn't
            /// such as: 
            ///     Foo.prototype.bar = 
            ///         function() {
            ///         };
            /// Once we start emitting comments, we should pull this code out to place on the outer context where the function
            /// is used.
            //if (funcDecl.preComments!=null && funcDecl.preComments.length>0) {
            //    this.writeLineToOutput("");
            //    this.increaseIndent();
            //    emitIndent();
            //}

            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl, this.document.fileName);
            this.pushDecl(pullDecl);

            var isClassConstructor = funcDecl.isConstructor && hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.ClassMethod);
            var hasNonObjectBaseType = isClassConstructor && classDecl.extendsList && classDecl.extendsList.members.length > 0;
            var classPropertiesMustComeAfterSuperCall = hasNonObjectBaseType;

            // We have no way of knowing if the current function is used as an expression or a statement, so as to enusre that the emitted
            // JavaScript is always valid, add an extra parentheses for unparenthesized function expressions
            var shouldParenthesize = false;// hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.IsFunctionExpression) && !funcDecl.isAccessor() && (hasFlag(funcDecl.getFlags(), ASTFlags.ExplicitSemicolon) || hasFlag(funcDecl.getFlags(), ASTFlags.AutomaticSemicolon));

            this.emitComments(funcDecl, true);
            if (shouldParenthesize) {
                this.writeToOutput("(");
            }
            this.recordSourceMappingStart(funcDecl);
            var accessorSymbol = funcDecl.isAccessor() ? PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.document.fileName) : null;
            var container = accessorSymbol ? accessorSymbol.getContainer() : null;
            var containerKind = container ? container.getKind() : PullElementKind.None;
            if (!(funcDecl.isAccessor() && containerKind != PullElementKind.Class && containerKind != PullElementKind.ConstructorType)) {
                this.writeToOutput("function ");
            }
            if (printName) {
                var id = funcDecl.getNameText();
                if (id && !funcDecl.isAccessor()) {
                    if (funcDecl.name) {
                        this.recordSourceMappingStart(funcDecl.name);
                    }
                    this.writeToOutput(id);
                    if (funcDecl.name) {
                        this.recordSourceMappingEnd(funcDecl.name);
                    }
                }
            }

            this.writeToOutput("(");
            var argsLen = 0;
            var arg: Parameter;
            var defaultArgs: Parameter[] = [];
            if (funcDecl.arguments) {
                var tempContainer = this.setContainer(EmitContainer.Args);
                argsLen = funcDecl.arguments.members.length;
                var printLen = argsLen;
                if (funcDecl.variableArgList) {
                    printLen--;
                }
                for (var i = 0; i < printLen; i++) {
                    arg = <Parameter>funcDecl.arguments.members[i];
                    if (arg.init) {
                        defaultArgs.push(arg);
                    }
                    this.emitJavascript(arg, false);
                    if (i < (printLen - 1)) {
                        this.writeToOutput(", ");
                    }
                }
                this.setContainer(tempContainer);
            }
            this.writeLineToOutput(") {");

            if (funcDecl.isConstructor) {
                this.recordSourceMappingNameStart("constructor");
            } else if (funcDecl.isGetAccessor()) {
                this.recordSourceMappingNameStart("get_" + funcDecl.getNameText());
            } else if (funcDecl.isSetAccessor()) {
                this.recordSourceMappingNameStart("set_" + funcDecl.getNameText());
            } else {
                this.recordSourceMappingNameStart(funcDecl.getNameText());
            }
            this.indenter.increaseIndent();

            // set default args first
            for (var i = 0; i < defaultArgs.length; i++) {
                arg = defaultArgs[i];
                this.emitIndent();
                this.recordSourceMappingStart(arg);
                this.writeToOutput("if (typeof " + arg.id.actualText + " === \"undefined\") { ");//
                this.recordSourceMappingStart(arg.id);
                this.writeToOutput(arg.id.actualText);
                this.recordSourceMappingEnd(arg.id);
                this.writeToOutput(" = ");
                this.emitJavascript(arg.init, false);
                this.writeLineToOutput("; }")
                this.recordSourceMappingEnd(arg);
            }

            if (funcDecl.isConstructor && this.shouldCaptureThis(funcDecl.classDecl)) {
                this.writeCaptureThisStatement(funcDecl);
            }

            if (funcDecl.isConstructor && !classPropertiesMustComeAfterSuperCall) {
                if (funcDecl.arguments) {
                    argsLen = funcDecl.arguments.members.length;
                    for (var i = 0; i < argsLen; i++) {
                        arg = <Parameter>funcDecl.arguments.members[i];
                        if ((arg.getVarFlags() & VariableFlags.Property) != VariableFlags.None) {
                            this.emitIndent();
                            this.recordSourceMappingStart(arg);
                            this.recordSourceMappingStart(arg.id);
                            this.writeToOutput("this." + arg.id.actualText);
                            this.recordSourceMappingEnd(arg.id);
                            this.writeToOutput(" = ");
                            this.recordSourceMappingStart(arg.id);
                            this.writeToOutput(arg.id.actualText);
                            this.recordSourceMappingEnd(arg.id);
                            this.writeLineToOutput(";");
                            this.recordSourceMappingEnd(arg);
                        }
                    }
                }
            }
            if (hasSelfRef) {
                this.writeCaptureThisStatement(funcDecl);
            }
            if (funcDecl.variableArgList) {
                argsLen = funcDecl.arguments.members.length;
                var lastArg = <Parameter>funcDecl.arguments.members[argsLen - 1];
                this.emitIndent();
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("var ");
                this.recordSourceMappingStart(lastArg.id);
                this.writeToOutput(lastArg.id.actualText);
                this.recordSourceMappingEnd(lastArg.id);
                this.writeLineToOutput(" = [];");
                this.recordSourceMappingEnd(lastArg);
                this.emitIndent();
                this.writeToOutput("for (")
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("var _i = 0;");
                this.recordSourceMappingEnd(lastArg);
                this.writeToOutput(" ");
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("_i < (arguments.length - " + (argsLen - 1) + ")");
                this.recordSourceMappingEnd(lastArg);
                this.writeToOutput("; ");
                this.recordSourceMappingStart(lastArg);
                this.writeToOutput("_i++");
                this.recordSourceMappingEnd(lastArg);
                this.writeLineToOutput(") {");
                this.indenter.increaseIndent();
                this.emitIndent();

                this.recordSourceMappingStart(lastArg);
                this.writeToOutput(lastArg.id.actualText + "[_i] = arguments[_i + " + (argsLen - 1) + "];");
                this.recordSourceMappingEnd(lastArg);
                this.writeLineToOutput("");
                this.indenter.decreaseIndent();
                this.emitIndent();
                this.writeLineToOutput("}");
            }

            // if it's a class, emit the uninitializedMembers, first emit the non-proto class body members
            if (funcDecl.isConstructor && hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.ClassMethod) && !classPropertiesMustComeAfterSuperCall) {

                var nProps = this.thisClassNode.members.members.length;

                for (var i = 0; i < nProps; i++) {
                    if (this.thisClassNode.members.members[i].nodeType === NodeType.VariableDeclarator) {
                        var varDecl = <VariableDeclarator>this.thisClassNode.members.members[i];
                        if (!hasFlag(varDecl.getVarFlags(), VariableFlags.Static) && varDecl.init) {
                            this.emitIndent();
                            this.emitJavascriptVariableDeclarator(varDecl);
                            this.writeLineToOutput("");
                        }
                    }
                }
                //this.writeLineToOutput("");
            }

            this.emitJavascriptList(funcDecl.block.statements, null, true, false, classPropertiesMustComeAfterSuperCall);

            this.indenter.decreaseIndent();
            this.emitIndent();
            this.recordSourceMappingStart(funcDecl.block.closeBraceSpan);
            this.writeToOutput("}");

            this.recordSourceMappingNameEnd();
            this.recordSourceMappingEnd(funcDecl.block.closeBraceSpan);
            this.recordSourceMappingEnd(funcDecl);

            if (shouldParenthesize) {
                this.writeToOutput(")");
            }

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(funcDecl);

            this.emitComments(funcDecl, false);

            if (!isMember &&
                !funcDecl.isAccessor() &&
                !hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.IsFunctionExpression) &&
                (!hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Signature) || funcDecl.isConstructor)) {

                this.writeLineToOutput("");
            }

            this.popDecl(pullDecl);
        }

        public getModuleImportAndDepencyList(moduleDecl: ModuleDeclaration) {
            var importList = "";
            var dependencyList = "";

            var semanticInfo = this.semanticInfoChain.getUnit(this.document.fileName);
            var imports = semanticInfo.getDynamicModuleImports();

            // all dependencies are quoted
            if (imports.length) {
                for (var i = 0; i < imports.length; i++) {
                    var importStatement = imports[i];
                    var importStatementAST = <ImportDeclaration>semanticInfo.getASTForDecl(importStatement.getDeclarations()[0]);

                    if (importStatement.getIsUsedAsValue()) {
                        if (i <= imports.length - 1) {
                            dependencyList += ", ";
                            importList += ", ";
                        }

                        importList += "__" + importStatement.getName() + "__";
                        dependencyList += importStatementAST.firstAliasedModToString();
                    }
                }
            }

            // emit any potential amd dependencies
            for (var i = 0; i < moduleDecl.amdDependencies.length; i++) {
                dependencyList += ", \"" + moduleDecl.amdDependencies[i] + "\"";
            }

            return {
                importList: importList,
                dependencyList: dependencyList
            };
        }

        public shouldCaptureThis(ast: AST) {
            if (ast == null) {
                var scriptDecl = this.semanticInfoChain.getUnit(this.document.fileName).getTopLevelDecls()[0];
                return (scriptDecl.getFlags() & PullElementFlags.MustCaptureThis) == PullElementFlags.MustCaptureThis;
            }

            var decl = this.semanticInfoChain.getDeclForAST(ast, this.document.fileName);
            if (decl) {
                return (decl.getFlags() & PullElementFlags.MustCaptureThis) == PullElementFlags.MustCaptureThis;
            }

            return false;
        }

        public emitJavascriptModule(moduleDecl: ModuleDeclaration) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(moduleDecl, this.document.fileName);
            this.pushDecl(pullDecl);

            var modName = moduleDecl.name.actualText;
            if (isTSFile(modName)) {
                moduleDecl.name.setText(modName.substring(0, modName.length - 3));
            }

            if (!hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.Ambient)) {
                var isDynamicMod = hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.IsDynamic);
                var prevOutFile = this.outfile;
                var prevOutFileName = this.emittingFileName;
                var prevAllSourceMappers = this.allSourceMappers;
                var prevSourceMapper = this.sourceMapper;
                var prevColumn = this.emitState.column;
                var prevLine = this.emitState.line;
                var temp = this.setContainer(EmitContainer.Module);
                var svModuleName = this.moduleName;
                var isExported = hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.Exported);
                var isWholeFile = hasFlag(moduleDecl.getModuleFlags(), ModuleFlags.IsWholeFile);
                this.moduleName = moduleDecl.name.actualText;

                // prologue
                if (isDynamicMod) {
                    // create the new outfile for this module
                    var tsModFileName = stripQuotes(moduleDecl.name.actualText);
                    var modFilePath = trimModName(tsModFileName) + ".js";
                    modFilePath = this.emitOptions.mapOutputFileName(modFilePath, TypeScriptCompiler.mapToJSFileName);

                    if (this.emitOptions.ioHost) {
                        // Ensure that the slashes are normalized so that the comparison is fair
                        // REVIEW: Note that modFilePath is normalized to forward slashes in Parser.parse, so the 
                        // first call to switchToForwardSlashes is technically a no-op, but it will prevent us from
                        // regressing if the parser changes
                        if (switchToForwardSlashes(modFilePath) != switchToForwardSlashes(this.emittingFileName)) {
                            this.emittingFileName = modFilePath;
                            var useUTF8InOutputfile = moduleDecl.containsUnicodeChar || (this.emitOptions.compilationSettings.emitComments && moduleDecl.containsUnicodeCharInComment);
                            this.outfile = this.createFile(this.emittingFileName, useUTF8InOutputfile);
                            if (prevSourceMapper != null) {
                                this.allSourceMappers = [];
                                var sourceMapFile = this.emittingFileName + SourceMapper.MapFileExtension;
                                var sourceMappingFile = this.createFile(sourceMapFile, false);
                                this.setSourceMappings(new SourceMapper(tsModFileName, this.emittingFileName, sourceMapFile, this.outfile, sourceMappingFile, this.emitOptions.compilationSettings.emitFullSourceMapPath));
                                this.emitState.column = 0;
                                this.emitState.line = 0;
                            }
                        } else {
                            CompilerDiagnostics.assert(this.emitOptions.outputMany, "Cannot have dynamic modules compiling into single file");
                        }
                    }

                    this.setContainer(EmitContainer.DynamicModule); // discard the previous 'Module' container

                    this.recordSourceMappingStart(moduleDecl);
                    if (this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) { // AMD
                        var dependencyList = "[\"require\", \"exports\"";
                        var importList = "require, exports";

                        var importAndDependencyList = this.getModuleImportAndDepencyList(moduleDecl);
                        importList += importAndDependencyList.importList;
                        dependencyList += importAndDependencyList.dependencyList + "]";

                        this.writeLineToOutput("define(" + dependencyList + "," + " function(" + importList + ") {");
                    }
                    else { // Node

                    }
                }
                else {

                    if (!isExported) {
                        this.recordSourceMappingStart(moduleDecl);
                        this.writeToOutput("var ");
                        this.recordSourceMappingStart(moduleDecl.name);
                        this.writeToOutput(this.moduleName);
                        this.recordSourceMappingEnd(moduleDecl.name);
                        this.writeLineToOutput(";");
                        this.recordSourceMappingEnd(moduleDecl);
                        this.emitIndent();
                    }

                    this.writeToOutput("(");
                    this.recordSourceMappingStart(moduleDecl);
                    this.writeToOutput("function (");
                    this.recordSourceMappingStart(moduleDecl.name);
                    this.writeToOutput(this.moduleName);
                    this.recordSourceMappingEnd(moduleDecl.name);
                    this.writeLineToOutput(") {");
                }

                if (!isWholeFile) {
                    this.recordSourceMappingNameStart(this.moduleName);
                }

                // body - don't indent for Node
                if (!isDynamicMod || this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) {
                    this.indenter.increaseIndent();
                }

                if (this.shouldCaptureThis(moduleDecl)) {
                    this.writeCaptureThisStatement(moduleDecl);
                }

                this.emitJavascriptList(moduleDecl.members, null, true, false, false);
                if (!isDynamicMod || this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) {
                    this.indenter.decreaseIndent();
                }
                this.emitIndent();

                // epilogue
                if (isDynamicMod) {
                    if (this.emitOptions.compilationSettings.moduleGenTarget === ModuleGenTarget.Asynchronous) { // AMD
                        this.writeLineToOutput("})");
                    }
                    else { // Node
                    }
                    if (!isWholeFile) {
                        this.recordSourceMappingNameEnd();
                    }
                    this.recordSourceMappingEnd(moduleDecl);

                    // close the module outfile, and restore the old one
                    if (this.outfile != prevOutFile) {
                        this.emitSourceMapsAndClose();
                        if (prevSourceMapper != null) {
                            this.allSourceMappers = prevAllSourceMappers;
                            this.sourceMapper = prevSourceMapper;
                            this.emitState.column = prevColumn;
                            this.emitState.line = prevLine;
                        }
                        this.outfile = prevOutFile;
                        this.emittingFileName = prevOutFileName;
                    }
                }
                else {
                    var parentIsDynamic = temp == EmitContainer.DynamicModule;
                    this.recordSourceMappingStart(moduleDecl.endingToken);
                    if (temp === EmitContainer.Prog && isExported) {
                        this.writeToOutput("}");
                        if (!isWholeFile) {
                            this.recordSourceMappingNameEnd();
                        }
                        this.recordSourceMappingEnd(moduleDecl.endingToken);
                        this.writeToOutput(")(this." + this.moduleName + " || (this." + this.moduleName + " = {}));");
                    }
                    else if (isExported || temp === EmitContainer.Prog) {
                        var dotMod = svModuleName != "" ? (parentIsDynamic ? "exports" : svModuleName) + "." : svModuleName;
                        this.writeToOutput("}");
                        if (!isWholeFile) {
                            this.recordSourceMappingNameEnd();
                        }
                        this.recordSourceMappingEnd(moduleDecl.endingToken);
                        this.writeToOutput(")(" + dotMod + this.moduleName + " || (" + dotMod + this.moduleName + " = {}));");
                    }
                    else if (!isExported && temp != EmitContainer.Prog) {
                        this.writeToOutput("}");
                        if (!isWholeFile) {
                            this.recordSourceMappingNameEnd();
                        }
                        this.recordSourceMappingEnd(moduleDecl.endingToken);
                        this.writeToOutput(")(" + this.moduleName + " || (" + this.moduleName + " = {}));");
                    }
                    else {
                        this.writeToOutput("}");
                        if (!isWholeFile) {
                            this.recordSourceMappingNameEnd();
                        }
                        this.recordSourceMappingEnd(moduleDecl.endingToken);
                        this.writeToOutput(")();");
                    }
                    this.recordSourceMappingEnd(moduleDecl);
                    this.writeLineToOutput("");
                    if (temp != EmitContainer.Prog && isExported) {
                        this.emitIndent();
                        this.recordSourceMappingStart(moduleDecl);
                        if (parentIsDynamic) {
                            this.writeLineToOutput("var " + this.moduleName + " = exports." + this.moduleName + ";");
                        } else {
                            this.writeLineToOutput("var " + this.moduleName + " = " + svModuleName + "." + this.moduleName + ";");
                        }
                        this.recordSourceMappingEnd(moduleDecl);
                    }
                }

                this.setContainer(temp);
                this.moduleName = svModuleName;
            }
            this.popDecl(pullDecl);
        }

        public emitIndex(operand1: AST, operand2: AST) {
            var temp = this.setInObjectLiteral(false);
            this.emitJavascript(operand1, false);
            this.writeToOutput("[");
            this.emitJavascriptList(operand2, ", ", false, false, false);
            this.writeToOutput("]");
            this.setInObjectLiteral(temp);
        }

        public emitStringLiteral(text: string) {
            // should preserve escape etc.
            // TODO: simplify object literal simple name
            this.writeToOutput(text);
        }

        public emitJavascriptFunction(funcDecl: FunctionDeclaration) {
            if (hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Signature) /*|| funcDecl.isOverload*/) {
                return;
            }
            var temp: number;
            var tempFnc = this.thisFunctionDeclaration;
            this.thisFunctionDeclaration = funcDecl;

            if (funcDecl.isConstructor) {
                temp = this.setContainer(EmitContainer.Constructor);
            }
            else {
                temp = this.setContainer(EmitContainer.Function);
            }

            var hasSelfRef = false;
            var funcName = funcDecl.getNameText();

            if ((this.emitState.inObjectLiteral || !funcDecl.isAccessor()) &&
            ((temp != EmitContainer.Constructor) ||
            ((funcDecl.getFunctionFlags() & FunctionFlags.Method) === FunctionFlags.None))) {
                var tempLit = this.setInObjectLiteral(false);
                hasSelfRef = this.shouldCaptureThis(funcDecl);
                this.recordSourceMappingStart(funcDecl);
                this.emitInnerFunction(funcDecl, (funcDecl.name && !funcDecl.name.isMissing()), false, hasSelfRef, this.thisClassNode);
                this.setInObjectLiteral(tempLit);
            }
            this.setContainer(temp);
            this.thisFunctionDeclaration = tempFnc;

            if (!hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Signature)) {
                if (hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Static)) {
                    if (this.thisClassNode) {
                        if (funcDecl.isAccessor()) {
                            this.emitPropertyAccessor(funcDecl, this.thisClassNode.name.actualText, false);
                        }
                        else {
                            this.emitIndent();
                            this.recordSourceMappingStart(funcDecl);
                            this.writeLineToOutput(this.thisClassNode.name.actualText + "." + funcName + " = " + funcName + ";");
                            this.recordSourceMappingEnd(funcDecl);
                        }
                    }
                }
                else if ((this.emitState.container === EmitContainer.Module || this.emitState.container === EmitContainer.DynamicModule) && hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.Exported)) {
                    this.emitIndent();
                    var modName = this.emitState.container === EmitContainer.Module ? this.moduleName : "exports";
                    this.recordSourceMappingStart(funcDecl);
                    this.writeLineToOutput(modName + "." + funcName +
                    " = " + funcName + ";");
                    this.recordSourceMappingEnd(funcDecl);
                }
            }
        }

        public emitAmbientVarDecl(varDecl: VariableDeclarator) {
            if (varDecl.init) {
                this.emitComments(varDecl, true);
                this.recordSourceMappingStart(varDecl);
                this.recordSourceMappingStart(varDecl.id);
                this.writeToOutput(varDecl.id.actualText);
                this.recordSourceMappingEnd(varDecl.id);
                this.writeToOutput(" = ");
                this.emitJavascript(varDecl.init, false);
                this.recordSourceMappingEnd(varDecl);
                this.writeToOutput(";");
                this.emitComments(varDecl, false);
            }
        }

        public varListCount(): number {
            return this.varListCountStack[this.varListCountStack.length - 1];
        }

        // Emits "var " if it is allowed
        public emitVarDeclVar() {
            // If it is var list of form var a, b, c = emit it only if count > 0 - which will be when emitting first var
            // If it is var list of form  var a = varList count will be 0
            if (this.varListCount() >= 0) {
                this.writeToOutput("var ");
                this.setInVarBlock(-this.varListCount());
            }
            return true;
        }

        public onEmitVar() {
            if (this.varListCount() > 0) {
                this.setInVarBlock(this.varListCount() - 1);
            }
            else if (this.varListCount() < 0) {
                this.setInVarBlock(this.varListCount() + 1);
            }
        }

        public emitJavascriptVariableDeclaration(declaration: VariableDeclaration, startLine: boolean) {
            var varDecl = <VariableDeclarator>declaration.declarators.members[0];

            var symbol = this.semanticInfoChain.getSymbolForAST(varDecl, this.document.fileName);

            var parentSymbol = symbol ? symbol.getContainer() : null;
            var parentKind = parentSymbol ? parentSymbol.getKind() : PullElementKind.None;
            var inClass = parentKind === PullElementKind.Class;

            this.emitComments(declaration, true);
            this.recordSourceMappingStart(declaration);
            this.setInVarBlock(declaration.declarators.members.length);
            var temp = this.setInObjectLiteral(false);

            var isAmbientWithoutInit = hasFlag(varDecl.getVarFlags(), VariableFlags.Ambient) && varDecl.init === null;
            if (!isAmbientWithoutInit) {
                for (var i = 0, n = declaration.declarators.members.length; i < n; i++) {
                    var declarator = declaration.declarators.members[i];

                    if (i > 0) {
                        if (inClass) {
                            this.writeToOutputTrimmable(";");
                        }
                        else {
                            this.writeToOutputTrimmable(", ");
                        }
                    }

                    this.emitJavascript(declarator, (startLine && i === 0) || inClass);
                }
            }

            this.setInObjectLiteral(temp);
            this.recordSourceMappingEnd(declaration);
            this.emitComments(declaration, false);
        }

        public emitJavascriptVariableDeclarator(varDecl: VariableDeclarator) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl, this.document.fileName);
            this.pushDecl(pullDecl);
            if ((varDecl.getVarFlags() & VariableFlags.Ambient) === VariableFlags.Ambient) {
                this.emitAmbientVarDecl(varDecl);
                this.onEmitVar();
            }
            else {
                this.emitComments(varDecl, true);
                this.recordSourceMappingStart(varDecl);

                var symbol = this.semanticInfoChain.getSymbolForAST(varDecl, this.document.fileName);
                var parentSymbol = symbol ? symbol.getContainer() : null;
                var parentKind = parentSymbol ? parentSymbol.getKind() : PullElementKind.None;
                var associatedParentSymbol = parentSymbol ? parentSymbol.getAssociatedContainerType() : null;
                var associatedParentSymbolKind = associatedParentSymbol ? associatedParentSymbol.getKind() : PullElementKind.None;
                if (parentKind == PullElementKind.Class) {
                    // class
                    if (this.emitState.container != EmitContainer.Args) {
                        if (varDecl.isStatic()) {
                            this.writeToOutput(parentSymbol.getName() + ".");
                        }
                        else {
                            this.writeToOutput("this.");
                        }
                    }
                }
                else if (parentKind == PullElementKind.Enum ||
                         parentKind == PullElementKind.DynamicModule ||
                         associatedParentSymbolKind == PullElementKind.Container ||
                         associatedParentSymbolKind == PullElementKind.DynamicModule ||
                         associatedParentSymbolKind == PullElementKind.Enum) {
                    // module
                    if (!varDecl.isExported() && !varDecl.isProperty()) {
                        this.emitVarDeclVar();
                    }
                    else {
                        if (this.emitState.container === EmitContainer.DynamicModule) {
                            this.writeToOutput("exports.");
                        }
                        else {
                            this.writeToOutput(this.moduleName + ".");
                        }
                    }
                }
                else {
                    // function, constructor, method etc.
                    //if (tokenId != SyntaxKind.OpenParenToken) {
                        this.emitVarDeclVar();
                    //}
                }
                this.recordSourceMappingStart(varDecl.id);
                this.writeToOutput(varDecl.id.actualText);
                this.recordSourceMappingEnd(varDecl.id);
                var hasInitializer = (varDecl.init != null);
                if (hasInitializer) {
                    this.writeToOutputTrimmable(" = ");

                    // Ensure we have a fresh var list count when recursing into the variable 
                    // initializer.  We don't want our current list of variables to affect how we
                    // emit nested variable lists.
                    this.varListCountStack.push(0);
                    this.emitJavascript(varDecl.init, false);
                    this.varListCountStack.pop();
                }

                if (parentKind == PullElementKind.Class) {
                    // class
                    if (this.emitState.container != EmitContainer.Args) {
                        this.writeToOutput(";");
                    }
                }

                this.onEmitVar();
                //if ((tokenId != SyntaxKind.OpenParenToken)) {
                //    if (this.varListCount() < 0) {
                //        this.writeToOutput(", ");
                //    }
                //}
                this.recordSourceMappingEnd(varDecl);
                this.emitComments(varDecl, false);
            }
            this.popDecl(pullDecl);
        }

        private symbolIsUsedInItsEnclosingContainer(symbol: PullSymbol, dynamic = false) {
            var symDecls = symbol.getDeclarations();

            if (symDecls.length) {
                var enclosingDecl = this.getEnclosingDecl();
                if (enclosingDecl) {
                    var parentDecl = symDecls[0].getParentDecl();
                    if (parentDecl) {
                        var symbolDeclarationEnclosingContainer = parentDecl;
                        var enclosingContainer = enclosingDecl;

                        // compute the closing container of the symbol's declaration
                        while (symbolDeclarationEnclosingContainer) {
                            if (symbolDeclarationEnclosingContainer.getKind() == (dynamic ? PullElementKind.DynamicModule : PullElementKind.Container)) {
                                break;
                            }
                            symbolDeclarationEnclosingContainer = symbolDeclarationEnclosingContainer.getParentDecl();
                        }

                        // if the symbol in question is not a global, compute the nearest
                        // enclosing declaration from the point of usage
                        if (symbolDeclarationEnclosingContainer) {
                            while (enclosingContainer) {
                                if (enclosingContainer.getKind() == (dynamic ? PullElementKind.DynamicModule : PullElementKind.Container)) {
                                    break;
                                }

                                enclosingContainer = enclosingContainer.getParentDecl();
                            }
                        }

                        if (symbolDeclarationEnclosingContainer && enclosingContainer) {
                            var same = symbolDeclarationEnclosingContainer == enclosingContainer;

                            // initialized module object variables are bound to their parent's decls
                            if (!same && symbol.hasFlag(PullElementFlags.InitializedModule)) {
                                same = symbolDeclarationEnclosingContainer == enclosingContainer.getParentDecl();
                            }

                            return same;
                        }
                    }
                }
            }

            return false;
        }

        public emitJavascriptName(name: Identifier, addThis: boolean) {
            this.emitComments(name, true);
            this.recordSourceMappingStart(name);
            if (!name.isMissing()) {
                this.setTypeCheckerUnit(this.document.fileName);
                var pullSymbol = this.resolvingContext.resolvingTypeReference ? this.pullTypeChecker.resolver.resolveTypeNameExpression(name, this.getEnclosingDecl(), this.resolvingContext)
                    : this.pullTypeChecker.resolver.resolveNameExpression(name, this.getEnclosingDecl(), this.resolvingContext);
                var pullSymbolKind = pullSymbol.getKind();
                if (addThis && (this.emitState.container != EmitContainer.Args) && pullSymbol) {
                    var pullSymbolContainer = pullSymbol.getContainer();
                    if (pullSymbolContainer) {
                        var pullSymbolContainerKind = pullSymbolContainer.getKind();

                        if (pullSymbolContainerKind == PullElementKind.Class) {
                            if (pullSymbol.hasFlag(PullElementFlags.Static)) {
                                // This is static symbol
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                            else if (pullSymbolKind == PullElementKind.Property) {
                                this.emitThis();
                                this.writeToOutput(".");
                            }
                        }
                        else if (pullSymbolContainerKind == PullElementKind.Container || pullSymbolContainerKind == PullElementKind.Enum ||
                        pullSymbolContainer.hasFlag(PullElementFlags.InitializedModule)) {
                            // If property or, say, a constructor being invoked locally within the module of its definition
                            if (pullSymbolKind == PullElementKind.Property || pullSymbolKind == PullElementKind.EnumMember) {
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                            else if (pullSymbol.hasFlag(PullElementFlags.Exported) &&
                            pullSymbolKind == PullElementKind.Variable &&
                            !pullSymbol.hasFlag(PullElementFlags.InitializedModule)) {
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                            else if (pullSymbol.hasFlag(PullElementFlags.Exported) &&
                            !this.symbolIsUsedInItsEnclosingContainer(pullSymbol)) {
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                            // else if (pullSymbol.hasFlag(PullElementFlags.Exported) && 
                            //             pullSymbolKind != PullElementKind.Class && 
                            //             pullSymbolKind != PullElementKind.ConstructorMethod && 
                            //             !pullSymbol.hasFlag(PullElementFlags.ClassConstructorVariable)) {
                            //         this.writeToOutput(pullSymbolContainer.getName() + ".");
                            // }
                        }
                        else if (pullSymbolContainerKind == PullElementKind.DynamicModule) {
                            if (pullSymbolKind == PullElementKind.Property || pullSymbol.hasFlag(PullElementFlags.Exported)) {
                                // If dynamic module
                                if (pullSymbolKind == PullElementKind.Property) {
                                    this.writeToOutput("exports.");
                                }
                                else if (pullSymbol.hasFlag(PullElementFlags.Exported) &&
                                !this.symbolIsUsedInItsEnclosingContainer(pullSymbol, true)) {
                                    this.writeToOutput("exports.");
                                }
                            }
                        }
                        else if (pullSymbolKind == PullElementKind.Property) {
                            if (pullSymbolContainer.getKind() == PullElementKind.Class) {
                                this.emitThis();
                                this.writeToOutput(".");
                            }
                        }
                        else {
                            var pullDecls = pullSymbol.getDeclarations();
                            var emitContainerName = true;
                            for (var i = 0; i < pullDecls.length; i++) {
                                if (pullDecls[i].getScriptName() == this.document.fileName) {
                                    emitContainerName = false;
                                }
                            }
                            if (emitContainerName) {
                                this.writeToOutput(pullSymbolContainer.getName() + ".");
                            }
                        }
                    }
                }

                // If it's a dynamic module, we need to print the "require" invocation
                if (pullSymbol && pullSymbolKind == PullElementKind.DynamicModule) {
                    if (this.emitOptions.compilationSettings.moduleGenTarget == ModuleGenTarget.Asynchronous) {
                        this.writeToOutput("__" + this.modAliasId + "__");
                    }
                    else {
                        var moduleDecl: ModuleDeclaration = <ModuleDeclaration>this.semanticInfoChain.getASTForSymbol(pullSymbol, this.document.fileName);
                        var modPath = name.actualText;
                        var isAmbient = pullSymbol.hasFlag(PullElementFlags.Ambient);
                        modPath = isAmbient ? modPath : this.firstModAlias ? this.firstModAlias : quoteBaseName(modPath);
                        modPath = isAmbient ? modPath : (!isRelative(stripQuotes(modPath)) ? quoteStr("./" + stripQuotes(modPath)) : modPath);
                        this.writeToOutput("require(" + modPath + ")");
                    }
                }
                else {
                    this.writeToOutput(name.actualText);
                }
            }

            this.recordSourceMappingEnd(name);
            this.emitComments(name, false);
        }

        public emitJavascriptStatements(stmts: AST, emitEmptyBod: boolean) {
            if (stmts) {
                if (stmts.nodeType != NodeType.Block) {
                    var hasContents = (stmts && (stmts.nodeType != NodeType.List || ((<ASTList>stmts).members.length > 0)));
                    if (emitEmptyBod || hasContents) {
                        var hasOnlyBlockStatement = ((stmts.nodeType === NodeType.Block) ||
                        ((stmts.nodeType === NodeType.List) && ((<ASTList>stmts).members.length === 1) && ((<ASTList>stmts).members[0].nodeType === NodeType.Block)));

                        this.recordSourceMappingStart(stmts);
                        if (!hasOnlyBlockStatement) {
                            this.writeLineToOutput(" {");
                            this.indenter.increaseIndent();
                        }
                        this.emitJavascriptList(stmts, null, true, false, false);
                        if (!hasOnlyBlockStatement) {
                            this.writeLineToOutput("");
                            this.indenter.decreaseIndent();
                            this.emitIndent();
                            this.writeToOutput("}");
                        }
                        this.recordSourceMappingEnd(stmts);
                    }
                }
                else {
                    this.emitJavascript(stmts, true);
                }
            }
            else if (emitEmptyBod) {
                this.writeToOutput("{ }");
            }
        }

        public recordSourceMappingNameStart(name: string) {
            if (this.sourceMapper) {
                var finalName = name;
                if (!name) {
                    finalName = "";
                } else if (this.sourceMapper.currentNameIndex.length > 0) {
                    finalName = this.sourceMapper.names[this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1]] + "." + name;
                }

                // We are currently not looking for duplicate but that is possible.
                this.sourceMapper.names.push(finalName);
                this.sourceMapper.currentNameIndex.push(this.sourceMapper.names.length - 1);
            }
        }

        public recordSourceMappingNameEnd() {
            if (this.sourceMapper) {
                this.sourceMapper.currentNameIndex.pop();
            }
        }

        public recordSourceMappingStart(ast: IASTSpan) {
            if (this.sourceMapper && isValidAstNode(ast)) {
                var lineCol = { line: -1, character: -1 };
                var sourceMapping = new SourceMapping();
                sourceMapping.start.emittedColumn = this.emitState.column;
                sourceMapping.start.emittedLine = this.emitState.line;
                // REVIEW: check time consumed by this binary search (about two per leaf statement)
                var lineMap = this.document.lineMap;
                lineMap.fillLineAndCharacterFromPosition(ast.minChar, lineCol);
                sourceMapping.start.sourceColumn = lineCol.character;
                sourceMapping.start.sourceLine = lineCol.line + 1;
                lineMap.fillLineAndCharacterFromPosition(ast.limChar, lineCol);
                sourceMapping.end.sourceColumn = lineCol.character;
                sourceMapping.end.sourceLine = lineCol.line + 1;
                if (this.sourceMapper.currentNameIndex.length > 0) {
                    sourceMapping.nameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
                }
                // Set parent and child relationship
                var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
                siblings.push(sourceMapping);
                this.sourceMapper.currentMappings.push(sourceMapping.childMappings);
            }
        }

        public recordSourceMappingEnd(ast: IASTSpan) {
            if (this.sourceMapper && isValidAstNode(ast)) {
                // Pop source mapping childs
                this.sourceMapper.currentMappings.pop();

                // Get the last source mapping from sibling list = which is the one we are recording end for
                var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
                var sourceMapping = siblings[siblings.length - 1];

                sourceMapping.end.emittedColumn = this.emitState.column;
                sourceMapping.end.emittedLine = this.emitState.line;
            }
        }

        // Note: may throw exception.
        public emitSourceMapsAndClose(): void {
            // Output a source mapping.  As long as we haven't gotten any errors yet.
            if (this.sourceMapper !== null) {
                SourceMapper.emitSourceMapping(this.allSourceMappers);
            }

            try {
                this.outfile.Close();
            }
            catch (e) {
                Emitter.throwEmitterError(e);
            }
        }

        private emitConstructorPropertyAssignments(): void {
            // emit any parameter properties first
            var constructorDecl = (<ClassDeclaration>this.thisClassNode).constructorDecl;

            if (constructorDecl && constructorDecl.arguments) {
                var argsLen = constructorDecl.arguments.members.length;
                for (var iArg = 0; iArg < argsLen; iArg++) {
                    var arg = <BoundDecl>constructorDecl.arguments.members[iArg];
                    if ((arg.getVarFlags() & VariableFlags.Property) != VariableFlags.None) {
                        this.emitIndent();
                        this.recordSourceMappingStart(arg);
                        this.recordSourceMappingStart(arg.id);
                        this.writeToOutput("this." + arg.id.actualText);
                        this.recordSourceMappingEnd(arg.id);
                        this.writeToOutput(" = ");
                        this.recordSourceMappingStart(arg.id);
                        this.writeToOutput(arg.id.actualText);
                        this.recordSourceMappingEnd(arg.id);
                        this.writeLineToOutput(";");
                        this.recordSourceMappingEnd(arg);
                    }
                }
            }

            var nProps = this.thisClassNode.members.members.length;

            for (var iMember = 0; iMember < nProps; iMember++) {
                if (this.thisClassNode.members.members[iMember].nodeType === NodeType.VariableDeclarator) {
                    var varDecl = <VariableDeclarator>this.thisClassNode.members.members[iMember];
                    if (!hasFlag(varDecl.getVarFlags(), VariableFlags.Static) && varDecl.init) {
                        this.emitIndent();
                        this.emitJavascriptVariableDeclarator(varDecl);
                        this.writeLineToOutput("");
                    }
                }
            }
        }
        
        public emitJavascriptList(ast: AST, delimiter: string, startLine: boolean, onlyStatics: boolean, emitClassPropertiesAfterSuperCall: boolean, emitPrologue = false, requiresExtendsBlock?: boolean) {
            if (ast === null) {
                return;
            }
            else if (ast.nodeType != NodeType.List) {
                this.emitPrologue(emitPrologue);
                this.emitJavascript(ast, startLine);
            }
            else {
                var list = <ASTList>ast;
                this.emitComments(ast, true);
                if (list.members.length === 0) {
                    this.emitComments(ast, false);
                    return;
                }

                var len = list.members.length;
                for (var i = 0; i < len; i++) {
                    if (emitPrologue) {
                        // If the list has Strict mode flags, emit prologue after first statement
                        // otherwise emit before first statement
                        if (i === 1 || !hasFlag(list.getFlags(), ASTFlags.StrictMode)) {
                            this.emitPrologue(requiresExtendsBlock);
                            emitPrologue = false;
                        }
                    }

                    // In some circumstances, class property initializers must be emitted immediately after the 'super' constructor
                    // call which, in these cases, must be the first statement in the constructor body
                    if (i === 1 && emitClassPropertiesAfterSuperCall) {
                        this.emitConstructorPropertyAssignments();
                    }

                    var emitNode = list.members[i];

                    var isStaticDecl =
                        (emitNode.nodeType === NodeType.FunctionDeclaration && hasFlag((<FunctionDeclaration>emitNode).getFunctionFlags(), FunctionFlags.Static)) ||
                        (emitNode.nodeType === NodeType.VariableDeclarator && hasFlag((<VariableDeclarator>emitNode).getVarFlags(), VariableFlags.Static))

                    if (onlyStatics ? !isStaticDecl : isStaticDecl) {
                        continue;
                    }
                    this.emitJavascript(emitNode, startLine);

                    if (delimiter && (i < (len - 1))) {
                        if (startLine) {
                            this.writeLineToOutput(delimiter);
                        }
                        else {
                            this.writeToOutput(delimiter);
                        }
                    }
                    else if (startLine &&
                             (emitNode.nodeType != NodeType.ModuleDeclaration) &&
                             (emitNode.nodeType != NodeType.InterfaceDeclaration) &&
                             (!((emitNode.nodeType === NodeType.VariableDeclarator) &&
                             ((((<VariableDeclarator>emitNode).getVarFlags()) & VariableFlags.Ambient) === VariableFlags.Ambient) &&
                             (((<VariableDeclarator>emitNode).init) === null)) && this.varListCount() >= 0) &&
                             (emitNode.nodeType != NodeType.FunctionDeclaration)) {
                        this.writeLineToOutput("");
                    }
                }

                if (i === 1 && emitClassPropertiesAfterSuperCall) {
                    this.emitConstructorPropertyAssignments();
                }

                this.emitComments(ast, false);
            }
        }

        // tokenId is the id the preceding token
        public emitJavascript(ast: AST, startLine: boolean) {
            if (ast === null) {
                return;
            }

            // REVIEW: simplify rules for indenting
            if (startLine &&
                this.indenter.indentAmt > 0 &&
                ast.nodeType !== NodeType.List &&
                ast.nodeType !== NodeType.Block &&
                ast.nodeType !== NodeType.VariableDeclaration &&
                ast.nodeType !== NodeType.VariableStatement) {

                if ((ast.nodeType != NodeType.InterfaceDeclaration) &&
                    (!((ast.nodeType === NodeType.VariableDeclarator) &&
                    ((((<VariableDeclarator>ast).getVarFlags()) & VariableFlags.Ambient) === VariableFlags.Ambient) &&
                    (((<VariableDeclarator>ast).init) === null)) && this.varListCount() >= 0) &&
                    ((ast.nodeType != NodeType.FunctionDeclaration) ||
                    (this.emitState.container != EmitContainer.Constructor))) {

                    this.emitIndent();
                }
            }

            ast.emit(this, startLine);
        }

        public emitPropertyAccessor(funcDecl: FunctionDeclaration, className: string, isProto: boolean) {
            if (!hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.GetAccessor)) {
                var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.document.fileName);
                if (accessorSymbol.getGetter()) {
                    return;
                }
            }

            this.emitIndent();
            this.recordSourceMappingStart(funcDecl);
            this.writeLineToOutput("Object.defineProperty(" + className + (isProto ? ".prototype, \"" : ", \"") + funcDecl.name.actualText + "\"" + ", {");
            this.indenter.increaseIndent();

            var accessors = PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain, this.document.fileName);
            if (accessors.getter) {
                this.emitIndent();
                this.recordSourceMappingStart(accessors.getter);
                this.writeToOutput("get: ");
                this.emitInnerFunction(accessors.getter, false, isProto, this.shouldCaptureThis(accessors.getter), null);
                this.writeLineToOutput(",");
            }

            if (accessors.setter) {
                this.emitIndent();
                this.recordSourceMappingStart(accessors.setter);
                this.writeToOutput("set: ");
                this.emitInnerFunction(accessors.setter, false, isProto, this.shouldCaptureThis(accessors.setter), null);
                this.writeLineToOutput(",");
            }

            this.emitIndent();
            this.writeLineToOutput("enumerable: true,");
            this.emitIndent();
            this.writeLineToOutput("configurable: true");
            this.indenter.decreaseIndent();
            this.emitIndent();
            this.writeLineToOutput("});");
            this.recordSourceMappingEnd(funcDecl);
        }

        public emitPrototypeMember(member: AST, className: string) {
            if (member.nodeType === NodeType.FunctionDeclaration) {
                var funcDecl = <FunctionDeclaration>member;
                if (funcDecl.isAccessor()) {
                    this.emitPropertyAccessor(funcDecl, className, true);
                }
                else {
                    this.emitIndent();
                    this.recordSourceMappingStart(funcDecl);
                    this.writeToOutput(className + ".prototype." + funcDecl.getNameText() + " = ");
                    this.emitInnerFunction(funcDecl, false, true, this.shouldCaptureThis(funcDecl), null);
                    this.writeLineToOutput(";");
                }
            }
            else if (member.nodeType === NodeType.VariableDeclarator) {
                var varDecl = <VariableDeclarator>member;

                if (varDecl.init) {
                    this.emitIndent();
                    this.recordSourceMappingStart(varDecl);
                    this.recordSourceMappingStart(varDecl.id);
                    this.writeToOutput(className + ".prototype." + varDecl.id.actualText);
                    this.recordSourceMappingEnd(varDecl.id);
                    this.writeToOutput(" = ");
                    this.emitJavascript(varDecl.init, false);
                    this.recordSourceMappingEnd(varDecl);
                    this.writeLineToOutput(";");
                }
            }
        }

        public emitJavascriptClass(classDecl: ClassDeclaration) {
            if (!hasFlag(classDecl.getVarFlags(), VariableFlags.Ambient)) {
                var pullDecl = this.semanticInfoChain.getDeclForAST(classDecl, this.document.fileName);
                this.pushDecl(pullDecl);

                var svClassNode = this.thisClassNode;
                this.thisClassNode = classDecl;
                var className = classDecl.name.actualText;
                this.emitComments(classDecl, true);
                var temp = this.setContainer(EmitContainer.Class);

                this.recordSourceMappingStart(classDecl);
                this.writeToOutput("var " + className);

                //if (hasFlag(classDecl.getVarFlags(), VarFlags.Exported) && (temp === EmitContainer.Module || temp === EmitContainer.DynamicModule)) {
                //    var modName = temp === EmitContainer.Module ? this.moduleName : "exports";
                //    this.writeToOutput(" = " + modName + "." + className);
                //}

                var hasBaseClass = classDecl.extendsList && classDecl.extendsList.members.length;
                var baseNameDecl: AST = null;
                var baseName: AST = null;
                var varDecl: VariableDeclarator = null;

                if (hasBaseClass) {
                    this.writeLineToOutput(" = (function (_super) {");
                } else {
                    this.writeLineToOutput(" = (function () {");
                }

                this.recordSourceMappingNameStart(className);
                this.indenter.increaseIndent();

                if (hasBaseClass) {
                    baseNameDecl = classDecl.extendsList.members[0];
                    baseName = baseNameDecl.nodeType === NodeType.InvocationExpression ? (<CallExpression>baseNameDecl).target : baseNameDecl;
                    this.emitIndent();
                    this.writeLineToOutput("__extends(" + className + ", _super);");
                }

                this.emitIndent();

                var constrDecl = classDecl.constructorDecl;

                // output constructor
                if (constrDecl) {
                    // declared constructor
                    this.emitJavascript(classDecl.constructorDecl, false);

                }
                else {
                    var wroteProps = 0;

                    this.recordSourceMappingStart(classDecl);
                    // default constructor
                    this.indenter.increaseIndent();
                    this.writeToOutput("function " + classDecl.name.actualText + "() {");
                    this.recordSourceMappingNameStart("constructor");
                    if (hasBaseClass) {
                        this.writeLineToOutput("");
                        this.emitIndent();
                        this.writeLineToOutput("_super.apply(this, arguments);");
                        wroteProps++;
                    }

                    /*
                    if (classDecl.getVarFlags() & VariableFlags.MustCaptureThis) {
                        this.writeCaptureThisStatement(classDecl);
                    }
                    */

                    var members = this.thisClassNode.members.members

                    // output initialized properties
                    for (var i = 0; i < members.length; i++) {
                        if (members[i].nodeType === NodeType.VariableDeclarator) {
                            varDecl = <VariableDeclarator>members[i];
                            if (!hasFlag(varDecl.getVarFlags(), VariableFlags.Static) && varDecl.init) {
                                this.writeLineToOutput("");
                                this.emitIndent();
                                this.emitJavascriptVariableDeclarator(varDecl);
                                wroteProps++;
                            }
                        }
                    }
                    if (wroteProps) {
                        this.writeLineToOutput("");
                        this.indenter.decreaseIndent();
                        this.emitIndent();
                        this.writeLineToOutput("}");
                    }
                    else {
                        this.writeLineToOutput(" }");
                        this.indenter.decreaseIndent();
                    }
                    this.recordSourceMappingNameEnd();
                    this.recordSourceMappingEnd(classDecl);
                }

                var membersLen = classDecl.members.members.length;
                for (var j = 0; j < membersLen; j++) {

                    var memberDecl: AST = classDecl.members.members[j];

                    if (memberDecl.nodeType === NodeType.FunctionDeclaration) {
                        var fn = <FunctionDeclaration>memberDecl;

                        if (hasFlag(fn.getFunctionFlags(), FunctionFlags.Method) && !fn.isSignature()) {
                            if (!hasFlag(fn.getFunctionFlags(), FunctionFlags.Static)) {
                                this.emitPrototypeMember(fn, className);
                            }
                            else { // static functions
                                if (fn.isAccessor()) {
                                    this.emitPropertyAccessor(fn, this.thisClassNode.name.actualText, false);
                                }
                                else {
                                    this.emitIndent();
                                    this.recordSourceMappingStart(fn)
                                    this.writeToOutput(classDecl.name.actualText + "." + fn.name.actualText + " = ");
                                    this.emitInnerFunction(fn, (fn.name && !fn.name.isMissing()), true,
                                    this.shouldCaptureThis(fn), null);
                                    this.writeLineToOutput(";");
                                }
                            }
                        }
                    }
                    else if (memberDecl.nodeType === NodeType.VariableDeclarator) {
                        varDecl = <VariableDeclarator>memberDecl;
                        if (hasFlag(varDecl.getVarFlags(), VariableFlags.Static)) {

                            if (varDecl.init) {
                                // EMITREVIEW
                                this.emitIndent();
                                this.recordSourceMappingStart(varDecl);
                                this.writeToOutput(classDecl.name.actualText + "." + varDecl.id.actualText + " = ");
                                this.emitJavascript(varDecl.init, false);
                                // EMITREVIEW

                                this.writeLineToOutput(";");
                                this.recordSourceMappingEnd(varDecl);
                            }
                        }
                    }
                    else {
                        throw Error("We want to catch this");
                    }
                }

                this.emitIndent();
                this.recordSourceMappingStart(classDecl.endingToken);
                this.writeLineToOutput("return " + className + ";");
                this.recordSourceMappingEnd(classDecl.endingToken);
                this.indenter.decreaseIndent();
                this.emitIndent();
                this.recordSourceMappingStart(classDecl.endingToken);
                this.writeToOutput("}");
                this.recordSourceMappingNameEnd();
                this.recordSourceMappingEnd(classDecl.endingToken);
                this.recordSourceMappingStart(classDecl);
                this.writeToOutput(")(");
                if (hasBaseClass) {
                    this.resolvingContext.resolvingTypeReference = true;
                    this.emitJavascript(baseName, false);
                    this.resolvingContext.resolvingTypeReference = false;
                }
                this.writeToOutput(");");
                this.recordSourceMappingEnd(classDecl);

                if ((temp === EmitContainer.Module || temp === EmitContainer.DynamicModule) && hasFlag(classDecl.getVarFlags(), VariableFlags.Exported)) {
                    this.writeLineToOutput("");
                    this.emitIndent();
                    var modName = temp === EmitContainer.Module ? this.moduleName : "exports";
                    this.recordSourceMappingStart(classDecl);
                    this.writeToOutput(modName + "." + className + " = " + className + ";");
                    this.recordSourceMappingEnd(classDecl);
                }

                this.emitIndent();
                this.recordSourceMappingEnd(classDecl);
                this.emitComments(classDecl, false);
                this.setContainer(temp);
                this.thisClassNode = svClassNode;

                this.popDecl(pullDecl);
            }
        }

        public emitPrologue(reqInherits: boolean) {
            if (!this.extendsPrologueEmitted) {
                if (reqInherits) {
                    this.extendsPrologueEmitted = true;
                    this.writeLineToOutput("var __extends = this.__extends || function (d, b) {");
                    this.writeLineToOutput("    function __() { this.constructor = d; }");
                    this.writeLineToOutput("    __.prototype = b.prototype;");
                    this.writeLineToOutput("    d.prototype = new __();");
                    this.writeLineToOutput("};");
                }
            }

            if (!this.globalThisCapturePrologueEmitted) {
                if (this.shouldCaptureThis(null)) {
                    this.globalThisCapturePrologueEmitted = true;
                    this.writeLineToOutput(this.captureThisStmtString);
                }
            }
        }

        public emitSuperReference() {
            this.writeToOutput("_super.prototype");
        }

        public emitSuperCall(callEx: CallExpression): boolean {
            if (callEx.target.nodeType === NodeType.MemberAccessExpression) {
                var dotNode = <BinaryExpression>callEx.target;
                if (dotNode.operand1.nodeType === NodeType.SuperExpression) {
                    this.emitJavascript(dotNode, false);
                    this.writeToOutput(".call(");
                    this.emitThis();
                    if (callEx.arguments && callEx.arguments.members.length > 0) {
                        this.writeToOutput(", ");
                        this.emitJavascriptList(callEx.arguments, ", ", false, false, false);
                    }
                    this.writeToOutput(")");
                    return true;
                }
            }
            return false;
        }

        public emitThis() {
            if (this.thisFunctionDeclaration && !this.thisFunctionDeclaration.isMethod() && (!this.thisFunctionDeclaration.isConstructor)) {
                this.writeToOutput("_this");
            }
            else {
                this.writeToOutput("this");
            }
        }

        public static throwEmitterError(e: Error): void {
            var error: any = new Error(e.message);
            error.isEmitterError = true;
            throw error;
        }

        public static handleEmitterError(fileName: string, e: Error): IDiagnostic[] {
            if ((<any>e).isEmitterError === true) {
                return [new Diagnostic(0, 0, fileName, e.message)];
            }

            throw e;
        }

        // Note: throws exception.  
        private createFile(fileName: string, useUTF8: boolean): ITextWriter {
            try {
                return this.emitOptions.ioHost.createFile(fileName, useUTF8);
            }
            catch (e) {
                Emitter.throwEmitterError(e);
            }
        }
    }
}