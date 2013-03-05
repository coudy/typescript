// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    /// IPullLanguageService represent language service features that use Fidelity Syntax Tree directelly without having to
    /// rely on the old AST format.
    export interface IPullLanguageService extends ILanguageService {
        host: ILanguageServiceHost;

        getOutliningSpans(fileName: string): TextSpan[];
        getMatchingBraceSpans(fileName: string, position: number): TextSpan[];
        logSyntaxTree(fileName: string): void;
        getIndentation(fileName: string, position: number, options: Services.EditorOptions): number;
    }

    export class PullLanguageService implements IPullLanguageService {

        public  logger: TypeScript.ILogger;
        private pullCompilerState: PullCompilerState;
        private syntaxASTState: ScriptSyntaxASTState;
        private formattingRulesProvider: Formatting.RulesProvider;

        constructor (public host: ILanguageServiceHost) {
            this.logger = this.host;
            this.pullCompilerState = new PullCompilerState(this.host);
            this.syntaxASTState = new ScriptSyntaxASTState();
            this.formattingRulesProvider = new Formatting.RulesProvider(this.logger);
        }

        public refresh(): void {
            TypeScript.timeFunction(this.logger, "refresh()", () => {
                this.pullCompilerState.refresh();
            });
        }

        public minimalRefresh(): void {
            TypeScript.timeFunction(this.logger, "minimalRefresh()", () => {
                this.pullCompilerState.minimalRefresh();
            });
        }

        public getSymbolTree(): ISymbolTree {
            this.refresh();
            return this.pullCompilerState.getSymbolTree();
        }

        public getScriptSyntaxAST(fileName: string): ScriptSyntaxAST {
            this.minimalRefresh();

            return this._getScriptSyntaxAST(fileName);
        }

        public getReferencesAtPosition(fileName: string, pos: number): ReferenceEntry[] {
            this.refresh();

            var result: ReferenceEntry[] = [];

            var script = this.pullCompilerState.getScriptAST(fileName);
              
            /// TODO: this does not allow getting references on "constructor"

            var path = this.getAstPathToPosition(script, pos);
            if (path.ast() === null || path.ast().nodeType !== TypeScript.NodeType.Name) {
                this.logger.log("No name found at the given position");
                return result;
            }

            var symbolInfoAtPosition = this.pullCompilerState.getSymbolInformationFromPath(path, script);
            if (symbolInfoAtPosition === null || symbolInfoAtPosition.symbol === null) {
                this.logger.log("No symbol found at the given position");
                return result;
            }

            var symbol = symbolInfoAtPosition.symbol;
            
            for (var i = 0, len = this.pullCompilerState.getScriptCount() ; i < len; i++) {
                result = result.concat(this.getReferencesInFile(i, symbol));
            }

            return result;
        }

        public getOccurrencesAtPosition(fileName: string, pos: number): ReferenceEntry[] {
            this.refresh();

            var result: ReferenceEntry[] = [];

            var script = this.pullCompilerState.getScriptAST(fileName);

            /// TODO: this does not allow getting references on "constructor"

            var path = this.getAstPathToPosition(script, pos);
            if (path.ast() === null || path.ast().nodeType !== TypeScript.NodeType.Name) {
                this.logger.log("No name found at the given position");
                return result;
            }

            var symbolInfoAtPosition = this.pullCompilerState.getSymbolInformationFromPath(path, script);
            if (symbolInfoAtPosition === null || symbolInfoAtPosition.symbol === null) {
                this.logger.log("No symbol found at the given position");
                return result;
            }

           
            var symbol = symbolInfoAtPosition.symbol;

            return this.getReferencesInFile(this.pullCompilerState.getUnitIndex(fileName), symbol);
        }

        public getImplementorsAtPosition(fileName: string, position: number): ReferenceEntry[] {
            return [];
        }

        private getReferencesInFile(unitIndex: number, symbol: TypeScript.PullSymbol): ReferenceEntry[] {
            var result: ReferenceEntry[] = [];
            var symbolName = symbol.getName();
            
            var possiblePositions = this.getPossibleSymbolReferencePositions(unitIndex, symbol);
            if (possiblePositions && possiblePositions.length > 0) {
                var searchScript = this.pullCompilerState.getScript(unitIndex);

                possiblePositions.forEach(p => {
                    var path = this.getAstPathToPosition(searchScript, p);
                    if (path.ast() === null || path.ast().nodeType !== TypeScript.NodeType.Name) {
                        return;
                    }

                    var searchSymbolInfoAtPosition = this.pullCompilerState.getSymbolInformationFromPath(path, searchScript);
                    if (searchSymbolInfoAtPosition !== null && searchSymbolInfoAtPosition.symbol === symbol) {
                        var isWriteAccess = false; // this.isWriteAccess(searchSymbolInfoAtPosition.ast, searchSymbolInfoAtPosition.parentAST);
                        result.push(new ReferenceEntry(unitIndex, searchSymbolInfoAtPosition.ast, isWriteAccess));
                    }
                });
            }
            

            return result;
        }

        private getPossibleSymbolReferencePositions(unitIndex: number, symbol: TypeScript.PullSymbol): number []{
            var positions: number[] = [];

            /// TODO: Cache symbol existence for files to save text search
            /// TODO: Use a smarter search mechanism to avoid picking up partial matches, matches in comments and in string literals

            var sourceText = this.pullCompilerState.getSourceText3(unitIndex);
            var text = sourceText.getText(0, sourceText.getLength());
            var symbolName = symbol.getName();

            var position = text.indexOf(symbolName);
            while (position >= 0) {
                positions.push(position);
                position = text.indexOf(symbolName, position + symbolName.length + 1);
            }

            return positions;
        }

        private _getScriptSyntaxAST(fileName: string): ScriptSyntaxAST {
            return TypeScript.timeFunction(this.logger, "getScriptSyntaxAST(\"" + fileName + "\")", () => {
                var version = this.pullCompilerState.getScriptVersion(fileName);

                var syntaxAST = this.syntaxASTState.syntaxAST;
                if (syntaxAST === null || this.syntaxASTState.fileName !== fileName) {
                    syntaxAST = this.pullCompilerState.getScriptSyntaxAST(fileName);
                }
                else if (this.syntaxASTState.version !== version) {
                    syntaxAST = this.attemptIncrementalSyntaxAST(this.syntaxASTState);
                    if (syntaxAST === null) {
                        syntaxAST = this.pullCompilerState.getScriptSyntaxAST(fileName);
                    }
                }

                // All done, ensure state is up to date
                this.syntaxASTState.version = version;
                this.syntaxASTState.fileName = fileName;
                this.syntaxASTState.syntaxAST = syntaxAST;
                return this.syntaxASTState.syntaxAST;
            });
        }

        private attemptIncrementalSyntaxAST(syntaxASTState: ScriptSyntaxASTState): ScriptSyntaxAST {
            var syntaxAST = syntaxASTState.syntaxAST;
            var fileName = syntaxAST.getScriptId();
            var newSourceText = this.pullCompilerState.getSourceText2(fileName);

            var editRange = this.pullCompilerState.getScriptEditRangeSinceVersion(fileName, syntaxASTState.version);

            // If "no changes", ast is good to go as is
            if (editRange === null) {
                return syntaxAST;
            }

            var incrementalParser = new TypeScript.IncrementalParser(this.logger)
            var updateResult = incrementalParser.attemptIncrementalUpdateUnit(syntaxAST.getScript(), syntaxAST.getScriptId(), newSourceText, editRange);
            if (updateResult !== null && updateResult.kind === TypeScript.UpdateUnitKind.EditsInsideSingleScope) {
                incrementalParser.mergeTrees(updateResult);
                return new ScriptSyntaxAST(this.logger, updateResult.script1, newSourceText);
            }

            return null;
        }

        public getScriptAST(fileName: string): TypeScript.Script {
            this.refresh();

            return this.pullCompilerState.getScriptAST(fileName);
        }

        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): SpanInfo {

            return null;
        }

        // Gets breakpoint span in the statement depending on context
        private getBreakpointInStatement(pos: number, astSpan: TypeScript.IASTSpan, verifyASTPos: bool,
                                         existingResult: TypeScript.IASTSpan, forceFirstStatement: bool, isAst: bool): TypeScript.IASTSpan {
            if (existingResult || !astSpan || (verifyASTPos && pos > astSpan.limChar)) {
                return existingResult;
            }

            if (!isAst) {
                // Satisfies the result
                return astSpan;
            }

            var ast = <TypeScript.AST>astSpan;
            var astList: TypeScript.ASTList = null;
            if (ast.nodeType == TypeScript.NodeType.Block) {
                var block = <TypeScript.Block>ast;
                astList = block.statements;
            } else if (ast.nodeType == TypeScript.NodeType.List) {
                astList = <TypeScript.ASTList>ast;
            } else {
                return ast;
            }

            if (astList.members.length > 0) {
                var lastAST = astList.members[astList.members.length - 1];
                if (!forceFirstStatement && pos > lastAST.limChar) {
                    // Use last one if the character after last statement in the block
                    return lastAST;
                } else {
                    return astList.members[0];
                }
            }

            return null;
        }

        public getBreakpointStatementAtPosition(fileName: string, pos: number): SpanInfo {
            this.refresh();
            var script = this.pullCompilerState.getScriptAST(fileName);

            var containerASTs: TypeScript.AST[] = [];
            var lineMap = this.pullCompilerState.getLineMap(fileName);

            // find line and col
            var lineCol = { line: -1, col: -1 };
            TypeScript.getSourceLineColFromMap(lineCol, pos, lineMap);

            // Get the valid breakpoint location container list till position so we could choose where to set breakpoint
            var pre = (cur: TypeScript.AST, parent: TypeScript.AST, walker: TypeScript.IAstWalker): TypeScript.AST => {
                if (TypeScript.isValidAstNode(cur)) {
                    if (pos >= cur.minChar && pos <= cur.limChar) {
                        switch (cur.nodeType) {
                            // Can be used as breakpoint location
                            case TypeScript.NodeType.ModuleDeclaration:
                            case TypeScript.NodeType.ClassDeclaration:
                            case TypeScript.NodeType.FuncDecl:
                            case TypeScript.NodeType.Break:
                            case TypeScript.NodeType.Continue:
                                containerASTs.push(cur);
                                break;

                            // These are expressions we cant be used as statements
                            case TypeScript.NodeType.Script:
                            case TypeScript.NodeType.List:
                            case TypeScript.NodeType.NumberLit:
                            case TypeScript.NodeType.Regex:
                            case TypeScript.NodeType.QString:
                            case TypeScript.NodeType.ArrayLit:
                            case TypeScript.NodeType.ObjectLit:
                            case TypeScript.NodeType.TypeAssertion:
                            case TypeScript.NodeType.Pos:
                            case TypeScript.NodeType.Neg:
                            case TypeScript.NodeType.Not:
                            case TypeScript.NodeType.LogNot:
                                break;

                            // Type Reference cannot have breakpoint, nor can its children
                            case TypeScript.NodeType.TypeRef:
                                walker.options.goChildren = false;
                                break;

                            default:
                                // If it is a statement or expression - they are debuggable
                                // But expressions are debuggable as standalone statement only
                                if (cur.isStatementOrExpression() &&
                                    (!cur.isExpression() ||
                                     containerASTs.length == 0 ||
                                     (!containerASTs[containerASTs.length - 1].isExpression() &&
                                      containerASTs[containerASTs.length - 1].nodeType != TypeScript.NodeType.VarDecl ||
                                      containerASTs[containerASTs.length - 1].nodeType == TypeScript.NodeType.ConditionalExpression))) {
                                    containerASTs.push(cur);
                                }
                                break;
                        }
                    } else {
                        walker.options.goChildren = false;
                    }
                }
                return cur;
            }
            TypeScript.getAstWalkerFactory().walk(script, pre);

            if (containerASTs.length == 0) {
                return null;
            }

            // We have container list in resultAST
            // Use it to determine where to set the breakpoint
            var resultAST: TypeScript.IASTSpan = null;
            var cur = containerASTs[containerASTs.length - 1];
            var customSpan: TypeScript.ASTSpan = null;

            switch (cur.nodeType) {
                // TODO : combine these as interface and use custom method instead of duplicate logic
                case TypeScript.NodeType.ModuleDeclaration:
                    var moduleDecl = <TypeScript.ModuleDeclaration>cur;
                    // If inside another module the whole module is debuggable
                    if (containerASTs.length > 1) {
                        resultAST = moduleDecl;
                    } else {
                        // Use first statement - whatever it is 
                        resultAST = this.getBreakpointInStatement(pos, moduleDecl.members, false, null, false, true);
                    }
                    // Can use ending token and if it cant find anything breakpoint cannot be set at this declaration
                    customSpan = moduleDecl.endingToken;
                    break;

                case TypeScript.NodeType.FuncDecl:
                    var funcDecl = <TypeScript.FuncDecl>cur;
                    // If function is inside module/class then it can be used completely as statement
                    if (containerASTs.length > 1) {
                        resultAST = funcDecl;
                    } else {
                        // We want to use first statement in the body if present
                        resultAST = this.getBreakpointInStatement(pos, funcDecl.bod, false, null, false, true);
                    }
                    // Can use ending token and if it cant find anything breakpoint cannot be set at this declaration
                    customSpan = funcDecl.endingToken;
                    break;

                case TypeScript.NodeType.ClassDeclaration:
                    var classDecl = <TypeScript.ClassDeclaration>cur;
                    // If class is inside module then it can be used completely as statement
                    if (containerASTs.length > 1) {
                        resultAST = classDecl;
                    } else {
                        // We want to use first statement in the body if present
                        resultAST = this.getBreakpointInStatement(pos, classDecl.members, false, null, false, true);
                    }
                    // Can use ending token and if it cant find anything breakpoint cannot be set at this declaration
                    customSpan = classDecl.endingToken;
                    break;

                case TypeScript.NodeType.VarDecl:
                    // Use varDecl only if it has initializer
                    var varDecl = <TypeScript.VarDecl>cur;
                    if (varDecl.init) {
                        resultAST = varDecl;
                    }
                    break;

                case TypeScript.NodeType.If:
                    var ifStatement = <TypeScript.IfStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, ifStatement.statement, true, resultAST, false, false);
                    resultAST = this.getBreakpointInStatement(pos, ifStatement.thenBod, true, resultAST, false, true);
                    resultAST = this.getBreakpointInStatement(pos, ifStatement.elseBod, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.ForIn:
                    var forInStatement = <TypeScript.ForInStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, forInStatement.statement, true, resultAST, false, false);
                    resultAST = this.getBreakpointInStatement(pos, forInStatement.body, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.For:
                    var forStatement = <TypeScript.ForStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, forStatement.init, true, null, false, true);
                    resultAST = this.getBreakpointInStatement(pos, forStatement.cond, true, resultAST, false, true);
                    resultAST = this.getBreakpointInStatement(pos, forStatement.incr, true, resultAST, false, true);
                    resultAST = this.getBreakpointInStatement(pos, forStatement.body, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.While:
                    var whileStatement = <TypeScript.WhileStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, whileStatement.cond, true, null, false, true);
                    resultAST = this.getBreakpointInStatement(pos, whileStatement.body, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.DoWhile:
                    var doWhileStatement = <TypeScript.DoWhileStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, doWhileStatement.body, true, null, false, true);
                    resultAST = this.getBreakpointInStatement(pos, doWhileStatement.cond, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.Switch:
                    var switchStatement = <TypeScript.SwitchStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, switchStatement.statement, true, resultAST, false, false);
                    // Loop through case statements and find the best one
                    var caseListCount = switchStatement.caseList.members.length;
                    if (caseListCount > 0) {
                        var lastCase = switchStatement.caseList.members[caseListCount - 1];
                        if (pos >= lastCase.limChar) {
                            // Use last one if the character after last statement in the block
                            var caseToUse = <TypeScript.CaseStatement>lastCase;
                            resultAST = this.getBreakpointInStatement(pos, caseToUse.body.members[0], false, resultAST, false, true);
                        } else {
                            var caseToUse = <TypeScript.CaseStatement>switchStatement.caseList.members[0];
                            resultAST = this.getBreakpointInStatement(pos, caseToUse.body.members[0], false, resultAST, true, true);
                        }
                    }
                    break;

                case TypeScript.NodeType.Case:
                    var caseStatement = <TypeScript.CaseStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, caseStatement.body.members[0], false, null, false, true);
                    break;

                case TypeScript.NodeType.With:
                    var withStatement = <TypeScript.WithStatement>cur;
                    resultAST = this.getBreakpointInStatement(pos, withStatement.body, false, null, false, true);
                    break;

                case TypeScript.NodeType.Try:
                    var tryNode = <TypeScript.Try>cur;
                    resultAST = this.getBreakpointInStatement(pos, tryNode.body, false, null, false, true);
                    break;

                case TypeScript.NodeType.Catch:
                    var catchNode = <TypeScript.Catch>cur;
                    resultAST = this.getBreakpointInStatement(pos, catchNode.statement, true, null, false, false);
                    resultAST = this.getBreakpointInStatement(pos, catchNode.body, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.Finally:
                    var finallyNode = <TypeScript.Finally>cur;
                    resultAST = this.getBreakpointInStatement(pos, finallyNode, false, null, false, true);
                    break;

                case TypeScript.NodeType.TryCatch:
                    var tryCatch = <TypeScript.TryCatch>cur;
                    resultAST = this.getBreakpointInStatement(pos, tryCatch.tryNode.body, true, null, false, true);
                    resultAST = this.getBreakpointInStatement(pos, tryCatch.catchNode.statement, true, resultAST, false, false);
                    resultAST = this.getBreakpointInStatement(pos, tryCatch.catchNode.body, false, resultAST, false, true);
                    break;

                case TypeScript.NodeType.TryFinally:
                    var tryFinally = <TypeScript.TryFinally>cur;
                    if (tryFinally.nodeType == TypeScript.NodeType.Try) {
                        resultAST = this.getBreakpointInStatement(pos, (<TypeScript.Try>tryFinally.tryNode).body, true, null, false, true);
                    } else {
                        var tryCatch = <TypeScript.TryCatch>tryFinally.tryNode;
                        resultAST = this.getBreakpointInStatement(pos, tryCatch.tryNode.body, true, null, false, true);
                        resultAST = this.getBreakpointInStatement(pos, tryCatch.catchNode.statement, true, resultAST, false, false);
                        resultAST = this.getBreakpointInStatement(pos, tryCatch.catchNode.body, true, resultAST, false, true);
                    }
                    resultAST = this.getBreakpointInStatement(pos, tryFinally.finallyNode, false, resultAST, false, true);
                    break;

                default:
                    resultAST = cur;
                    break;
            }

            // If we have custom span check if it is better option
            if (TypeScript.isValidAstNode(customSpan) && pos >= customSpan.minChar && pos <= customSpan.limChar) {
                resultAST = customSpan;
            }

            // Use result AST to create span info
            if (resultAST) {
                var result = new SpanInfo(resultAST.minChar, resultAST.limChar);
                return result;
            }

            return null;
        }

        public getSignatureAtPosition(fileName: string, position: number): SignatureInfo {
            this.refresh();

            var script = this.pullCompilerState.getScriptAST(fileName);

            // If "pos" is the "EOF" position
            var atEOF = (position === script.limChar);

            var path = this.getAstPathToPosition(script, position);
            if (path.count() == 0) {
                return null;
            }

            // First check whether we are in a comment where quick info should not be displayed
            if (path.nodeType() === TypeScript.NodeType.Comment) {
                this.logger.log("position is inside a comment");
                return null;
            }

            /// TODO: disable signature help in string literals and regexp literals

            // Find call expression
            while (path.count() >= 2) {
                // Path we are looking for...
                if (path.isArgumentListOfCall() || path.isArgumentListOfNew()) {
                    // The caret position should be *after* the opening "(" of the argument list
                    if (atEOF || position >= path.ast().minChar) {
                        path.pop();
                    }
                    break;
                } else if (path.ast().nodeType === TypeScript.NodeType.Call || path.ast().nodeType === TypeScript.NodeType.New) {
                    break;
                }

                // Path that should make us stop looking up..
                if (position > path.ast().minChar) {  // If cursor is on the "{" of the body, we may wat to display param help
                    if (path.ast().nodeType !== TypeScript.NodeType.List && path.ast().nodeType !== TypeScript.NodeType.Error) { 
                        break;
                    }
                }
                path.pop();
            }

            if (path.ast().nodeType !== TypeScript.NodeType.Call && path.ast().nodeType !== TypeScript.NodeType.New) {
                this.logger.log("No call expression for the given position");
                return null;
            }

            var callExpression = <TypeScript.CallExpression>path.ast();
            var isNew = (callExpression.nodeType === TypeScript.NodeType.New);

            // Resolve symbol
            var callSymbolInfo = this.pullCompilerState.getCallInformationFormPath(path, script);
            if (!callSymbolInfo || !callSymbolInfo.targetSymbol || !callSymbolInfo.signatures) {
                this.logger.log("Could not find symbol for call expression");
                return null;
            }

            // Build the result
            var result = new SignatureInfo();

            result.formal = this.convertSignatureSymbolToSignatureInfo(callSymbolInfo.targetSymbol, isNew, callSymbolInfo.signatures);
            result.actual = this.convertCallExprToActualSignatureInfo(callExpression, position, atEOF);
            result.activeFormal = (callSymbolInfo.signatures && callSymbolInfo.signature) ? callSymbolInfo.signatures.indexOf(callSymbolInfo.signature) : -1;
            
            if (result.actual === null || result.formal === null || result.activeFormal === null) {
                this.logger.log("Can't compute actual and/or formal signature of the call expression");
                return null;
            }

            return result;
        }

        private convertSignatureSymbolToSignatureInfo(symbol: TypeScript.PullSymbol, isNew: bool, signatures: TypeScript.PullSignatureSymbol[]): FormalSignatureInfo {
            var result = new FormalSignatureInfo();
            result.isNew = isNew;
            result.name = symbol.getName();
            result.docComment = symbol.getDocComments(); 
            result.openParen = "(";  //(group.flags & TypeScript.SignatureFlags.IsIndexer ? "[" : "(");
            result.closeParen = ")";  //(group.flags & TypeScript.SignatureFlags.IsIndexer ? "]" : ")");

            var hasOverloads = signatures.length > 1;
            signatures
                // Same test as in "typeFlow.str: resolveOverload()": filter out the definition signature if there are overloads
                .filter(signature => !(hasOverloads && signature.isDefinition() && !this.pullCompilerState.getCompilationSettings().canCallDefinitionSignature))
                .forEach(signature => {
                    var signatureGroupInfo = new FormalSignatureItemInfo();
                    signatureGroupInfo.docComment = signature.getDocComments();
                    signatureGroupInfo.returnType = signature.getReturnType() === null ? "any" : signature.getReturnType().getName(); //signature.returnType.type.getScopedTypeName(enclosingScopeContext.getScope()));
                    var parameters = signature.getParameters();
                    parameters.forEach((p, i) => {
                        var signatureParameterInfo = new FormalParameterInfo();
                        signatureParameterInfo.isVariable = signature.hasVariableParamList() && (i === parameters.length - 1);
                        signatureParameterInfo.isOptional = p.hasFlag(TypeScript.PullElementFlags.Optional);
                        signatureParameterInfo.name = p.getName();
                        signatureParameterInfo.docComment = p.getDocComments();
                        signatureParameterInfo.type = p.getType() ? p.getType().getName() : "";//.getScopedTypeName(enclosingScopeContext.getScope());
                        signatureGroupInfo.parameters.push(signatureParameterInfo);
                    });
                    result.signatureGroup.push(signatureGroupInfo);
                });
            return result;
        }

        private convertCallExprToActualSignatureInfo(ast: TypeScript.CallExpression, caretPosition: number, atEOF: bool): ActualSignatureInfo {
            if (!TypeScript.isValidAstNode(ast))
                return null;

            if (!TypeScript.isValidAstNode(ast.arguments))
                return null;

            var result = new ActualSignatureInfo();
            result.currentParameter = -1;
            result.openParenMinChar = ast.arguments.minChar;
            result.closeParenLimChar = Math.max(ast.arguments.minChar, ast.arguments.limChar);
            ast.arguments.members.forEach((arg, index) => {
                var parameter = new ActualParameterInfo();
                parameter.minChar = arg.minChar;
                parameter.limChar = Math.max(arg.minChar, arg.limChar);
                result.parameters.push(parameter);
            });

            result.parameters.forEach((parameter, index) => {
                var minChar = (index == 0 ? result.openParenMinChar : result.parameters[index - 1].limChar + 1);
                var limChar = (index == result.parameters.length - 1 ? result.closeParenLimChar : result.parameters[index + 1].minChar);
                if (caretPosition >= minChar && (atEOF ? caretPosition <= limChar : caretPosition < limChar)) {
                    result.currentParameter = index;
                }
            });
            return result;
        }

        public getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo {
            this.refresh();

            var result: DefinitionInfo = null;

            var script = this.pullCompilerState.getScriptAST(fileName);

            var path = this.getAstPathToPosition(script, position);
            if (path.count() == 0) {
                return null;
            }

            var symbolInfo = this.pullCompilerState.getSymbolInformationFromPath(path, script);
            if (symbolInfo == null || symbolInfo.symbol == null) {
                this.logger.log("No identifier at the specified location.");
                return result;
            }

            var declarations = symbolInfo.symbol.getDeclarations();
            if (declarations == null || declarations.length === 0) {
                this.logger.log("Could not find declaration for symbol.");
                return result;
            }

            var symbolName = symbolInfo.symbol.getName();
            var symbolKind = this.mapPullElementKind(symbolInfo.symbol.getKind());//this.getSymbolElementKind(sym),
            var container = symbolInfo.symbol.getContainer();
            var containerName = container ? container.getName() : "<global>";//this.getSymbolContainerName(sym)
            var containerKind = "";//this.getSymbolContainerKind(sym)


            var entries: DefinitionInfo[] = [];
            var mainEntry = 0;
            for (var i = 0, n = declarations.length; i < n; i++) {
                var declaration = declarations[i];
                var unitIndex = this.pullCompilerState.getUnitIndex(declaration.getScriptName());
                var span = declaration.getSpan();

                // For functions, pick the definition to be the main entry
                var signature = declaration.getSignatureSymbol();
                if (signature && signature.isDefinition()) {
                    mainEntry = i;
                }
                // TODO: find a better way of selecting the main entry for none-function overloaded types instead of selecting the first one

                entries.push(new DefinitionInfo(this.pullCompilerState.mapToHostUnitIndex(unitIndex), span.minChar, span.limChar, symbolKind, symbolName, containerKind, containerName, null));
            }

            result = entries[mainEntry];
            if (entries.length > 1) {
                // Remove the main entry
                entries.splice(mainEntry, 1);
                result.overloads = entries;
            }
            
            return result;
        }



        // Given a script name and position in the script, return a string representing 
        // the desired smart indent text (assuming the line is empty).
        // Return "null" in case the smart indent cannot be determined.
        public getSmartIndentAtLineNumber(fileName: string, lineNumber: number, options: EditorOptions): number {
            this.minimalRefresh();

            var syntaxAST = this._getScriptSyntaxAST(fileName);
            var manager = new Formatting.SmartIndentManager(syntaxAST, options);
            return manager.getSmartIndentAtLineNumber(lineNumber);
        }

        public getBraceMatchingAtPosition(fileName: string, position: number): TextRange[] {
            this.minimalRefresh();

            var syntaxAST = this._getScriptSyntaxAST(fileName);
            var manager = new BraceMatchingManager(syntaxAST);
            return manager.getBraceMatchingAtPosition(position);
        }

        // Given a script name and position in the script, return a pair of text range if the 
        // position corresponds to a "brace matchin" characters (e.g. "{" or "(", etc.)
        // If the position is not on any range, return "null".
    

        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            // Ensure rules are initialized and up to date wrt to formatting options
            this.formattingRulesProvider.ensureUptodate(options);

            var syntaxAST = this._getScriptSyntaxAST(fileName);
            var manager = new Formatting.FormattingManager(syntaxAST, this.formattingRulesProvider, options);
            var result = manager.FormatSelection(minChar, limChar);

           if (this.logger.information()) {
               this.logFormatCodeOptions(options);
               this.logEditResults(syntaxAST, result)
            }

            return result;
        }

        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();
            // Ensure rules are initialized and up to date wrt to formatting options
            this.formattingRulesProvider.ensureUptodate(options);

            var syntaxAST = this._getScriptSyntaxAST(fileName);
            var manager = new Formatting.FormattingManager(syntaxAST, this.formattingRulesProvider, options);
            var result = manager.FormatDocument(minChar, limChar);

            if (this.logger.information()) {
               this.logEditResults(syntaxAST, result)
            }

            return result;
        }

        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();
            // Ensure rules are initialized and up to date wrt to formatting options
            this.formattingRulesProvider.ensureUptodate(options);

            var syntaxAST = this._getScriptSyntaxAST(fileName);
            var manager = new Formatting.FormattingManager(syntaxAST, this.formattingRulesProvider, options);
            var result = manager.FormatOnPaste(minChar, limChar);

            if (this.logger.information()) {
               this.logEditResults(syntaxAST, result)
            }

            return result;
        }

        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            // Ensure rules are initialized and up to date wrt to formatting options
            this.formattingRulesProvider.ensureUptodate(options);

            if (key === "}") {
                var syntaxAST = this._getScriptSyntaxAST(fileName);
                var manager = new Formatting.FormattingManager(syntaxAST, this.formattingRulesProvider, options);
                return manager.FormatOnClosingCurlyBrace(position);
            }
            else if (key === ";") {
                var syntaxAST = this._getScriptSyntaxAST(fileName);
                var manager = new Formatting.FormattingManager(syntaxAST, this.formattingRulesProvider, options);
                return manager.FormatOnSemicolon(position);
            }
            else if (key === "\n") {
                var syntaxAST = this._getScriptSyntaxAST(fileName);
                var manager = new Formatting.FormattingManager(syntaxAST, this.formattingRulesProvider, options);
                return manager.FormatOnEnter(position);
            }
            return []; //TextEdit.createInsert(minChar, "/* format was invoked here!*/")];
        }

        public getNavigateToItems(searchValue: string): NavigateToItem[] {
            this.refresh();

            // Split search value in terms array
            var terms = searchValue.split(" ");
            for (var i = 0; i < terms.length; i++) {
                terms[i] = terms[i].trim().toLocaleLowerCase();
            }

            var match = (ast: TypeScript.AST, parent: TypeScript.AST, name: string): string => {
                name = name.toLocaleLowerCase();
                for (var i = 0; i < terms.length; i++) {
                    var term = terms[i];
                    if (name === term)
                        return MatchKind.exact;
                    if (name.indexOf(term) == 0)
                        return MatchKind.prefix;
                    if (name.indexOf(term) > 0)
                        return MatchKind.subString;
                }
                return null;
            }

            var result: NavigateToItem[] = [];

            // Process all script ASTs and look for matchin symbols
            for (var i = 0, len = this.pullCompilerState.getScriptCount() ; i < len; i++) {
                // Add the item for the script name if needed
                var script = this.pullCompilerState.getScript(i);
                var scriptId = script.locationInfo.filename;
                var matchKind = match(null, script, scriptId);
                if (matchKind != null) {
                    var item = new NavigateToItem();
                    item.name = scriptId;
                    item.matchKind = matchKind;
                    item.kind = ScriptElementKind.scriptElement;
                    item.unitIndex = this.pullCompilerState.mapToHostUnitIndex(i);
                    item.minChar = script.minChar;
                    item.limChar = script.limChar;
                    result.push(item);
                }

                var items = this.getASTItems(i, script, match);
                for (var j = 0; j < items.length; j++) {
                    result.push(items[j]);
                }
            }
            return result;
        }

        public getScriptLexicalStructure(fileName: string): NavigateToItem[] {
            this.refresh();

            var script = this.pullCompilerState.getScriptAST(fileName);
            return this.getASTItems(script.locationInfo.unitIndex, script, (name) => MatchKind.exact);
        }

        public getOutliningRegions(fileName: string): NavigateToItem[] {
            this.minimalRefresh();

            var script = this.pullCompilerState.getScriptAST(fileName);

            var maxLim = (current: number, ...asts: TypeScript.AST[]) => {
                var maxLim1 = (current: number, asts: TypeScript.AST[]) => {
                    var result = current;
                    for (var i = 0; i < asts.length; i++) {
                        var ast = asts[i];
                        if (ast != null && ast.limChar != 0 && ast.limChar > result) {
                            result = ast.limChar;
                        }
                    }
                    return result;
                }

                var result = maxLim1(current, asts);
                for (var i = 0; i < asts.length; i++) {
                    var ast = asts[i];
                    if (ast != null && ast.nodeType == TypeScript.NodeType.List) {
                        result = maxLim1(result, (<TypeScript.ASTList>ast).members);
                    }
                }
                return result;
            }

            var findMinChar = (parent: TypeScript.AST, ast: TypeScript.AST) => {
                var result = ast.minChar;
                switch (ast.nodeType) {
                    case TypeScript.NodeType.FuncDecl:
                        result = maxLim(result, (<TypeScript.FuncDecl>ast).name, (<TypeScript.FuncDecl>ast).arguments, (<TypeScript.FuncDecl>ast).returnTypeAnnotation);
                        break

                    case TypeScript.NodeType.ModuleDeclaration:
                        result = maxLim(result, (<TypeScript.ModuleDeclaration>ast).name);
                        break;

                    case TypeScript.NodeType.ClassDeclaration:
                        result = maxLim(result, (<TypeScript.ClassDeclaration>ast).name, (<TypeScript.ClassDeclaration>ast).extendsList, (<TypeScript.ClassDeclaration>ast).implementsList);
                        break;

                    case TypeScript.NodeType.InterfaceDeclaration:
                        result = maxLim(result, (<TypeScript.InterfaceDeclaration>ast).name, (<TypeScript.InterfaceDeclaration>ast).extendsList, (<TypeScript.InterfaceDeclaration>ast).implementsList);
                        break;
                }

                //logger.log("findMinChar(" + Tools.NodeType._map[ast.nodeType] + ")=" + result + " (instead of " + ast.minChar + ")");
                return result;
            }

            var findLimChar = (parent: TypeScript.AST, ast: TypeScript.AST) => {
                return ast.limChar;
            }

            var match = (parent: TypeScript.AST, ast: TypeScript.AST, name: string) => {
                switch (ast.nodeType) {
                    case TypeScript.NodeType.FuncDecl:
                        if ((<TypeScript.FuncDecl>ast).bod == null)
                            return MatchKind.none;
                    //fall through
                    case TypeScript.NodeType.ClassDeclaration:
                    case TypeScript.NodeType.ModuleDeclaration:
                    case TypeScript.NodeType.InterfaceDeclaration:
                        return MatchKind.exact;

                    default:
                        return null;
                }
            }

            return this.getASTItems(script.locationInfo.unitIndex, script, match, findMinChar, findLimChar);
        }

        /// LOG AST
        ///
        public logAST(fileName: string): void {
            this.refresh();

            var script = this.pullCompilerState.getScriptAST(fileName);
            new TypeScript.AstLogger(this.logger).logScript(script);
        }

        /// LOG SYNTAX AST
        ///
        public logSyntaxAST(fileName: string): void {
            this.minimalRefresh();

            var syntaxAST = this._getScriptSyntaxAST(fileName);
            new TypeScript.AstLogger(this.logger).logScript(syntaxAST.getScript());
        }

        public getErrors(maxCount: number): TypeScript.ErrorEntry[] {
            // Note: Do not throw on errors, as we want to report "internal" 
            //       errors that can occur when initializing the compiler 
            //       or typechecking the whole program.
            this.pullCompilerState.refresh(false/*throwOnError*/);

            return this.pullCompilerState.getErrorEntries(maxCount, (u, e) => true);
        }

        public getScriptErrors(fileName: string, maxCount: number): TypeScript.ErrorEntry[] {
            this.refresh();

            var unitIndex = this.pullCompilerState.getUnitIndex(fileName);
            return this.pullCompilerState.getErrorEntries(maxCount, (u, e) => { return u === unitIndex; });
        }

        public getEmitOutput(fileName: string): IOutputFile[] {
            return [];
        }        

        private getNameOrDottedNameSpanFromPosition(pos: number, script: TypeScript.Script): SpanInfo  {
            var result: SpanInfo = null;

            var pre = (cur: TypeScript.AST, parent: TypeScript.AST): TypeScript.AST => {
                if (TypeScript.isValidAstNode(cur)) {
                    if (pos >= cur.minChar && pos < cur.limChar) {
                        if (cur.nodeType == TypeScript.NodeType.Dot) {
                            // Dotted expression
                            if (result == null) {
                                result = new SpanInfo(cur.minChar, cur.limChar);
                            }
                        }
                        else if (cur.nodeType == TypeScript.NodeType.Name) {
                            // If it was the first thing we found, use it directly
                            if (result == null) {
                                result = new SpanInfo(cur.minChar, cur.limChar);
                            }
                            else {
                                // Its a dotted expression, use the current end as the end of our span
                                result.limChar = cur.limChar;
                            }
                        } else if (cur.nodeType == TypeScript.NodeType.QString || 
                            cur.nodeType == TypeScript.NodeType.This || 
                            cur.nodeType == TypeScript.NodeType.Super) {
                            result = new SpanInfo(cur.minChar, cur.limChar);
                        }
                    }
                }
                return cur;
            }

            TypeScript.getAstWalkerFactory().walk(script, pre);
            return result;
        }

        

        //
        // Return the comma separated list of modifers (from the ScriptElementKindModifier list of constants) 
        // of an AST node referencing a known declaration kind.
        //
        private getDeclNodeElementKindModifiers(ast: TypeScript.AST): string {
            var addMofifier = (result: string, testValue: bool, value: string): string => {
                if (!testValue)
                    return result;

                if (result === ScriptElementKindModifier.none) {
                    return value;
                }
                else {
                    return result + "," + value;
                }
            }

            var typeDeclToKindModifiers = (decl: TypeScript.TypeDeclaration): string => {
                var result = ScriptElementKindModifier.none;
                result = addMofifier(result, decl.isExported(), ScriptElementKindModifier.exportedModifier);
                result = addMofifier(result, decl.isAmbient(), ScriptElementKindModifier.ambientModifier);
                return result;
            }

            var classDeclToKindModifiers = (decl: TypeScript.ClassDeclaration): string => {
                var result = ScriptElementKindModifier.none;
                result = addMofifier(result, decl.isExported(), ScriptElementKindModifier.exportedModifier);
                result = addMofifier(result, decl.isAmbient(), ScriptElementKindModifier.ambientModifier);
                return result;
            }

            var moduleDeclToKindModifiers = (decl: TypeScript.ModuleDeclaration): string => {
                var result = ScriptElementKindModifier.none;
                result = addMofifier(result, decl.isExported(), ScriptElementKindModifier.exportedModifier);
                result = addMofifier(result, decl.isAmbient(), ScriptElementKindModifier.ambientModifier);
                return result;
            }

            var varDeclToKindModifiers = (decl: TypeScript.VarDecl): string => {
                var result = ScriptElementKindModifier.none;
                result = addMofifier(result, decl.isExported(), ScriptElementKindModifier.exportedModifier);
                result = addMofifier(result, decl.isAmbient(), ScriptElementKindModifier.ambientModifier);
                result = addMofifier(result, decl.isPublic(), ScriptElementKindModifier.publicMemberModifier);
                result = addMofifier(result, decl.isPrivate(), ScriptElementKindModifier.privateMemberModifier);
                result = addMofifier(result, decl.isStatic(), ScriptElementKindModifier.staticModifier);
                return result;
            }

            var argDeclToKindModifiers = (decl: TypeScript.ArgDecl): string => {
                var result = ScriptElementKindModifier.none;
                result = addMofifier(result, decl.isPublic(), ScriptElementKindModifier.publicMemberModifier);
                result = addMofifier(result, decl.isPrivate(), ScriptElementKindModifier.privateMemberModifier);
                return result;
            }

            var funcDeclToKindModifiers = (decl: TypeScript.FuncDecl): string => {
                var result = ScriptElementKindModifier.none;
                result = addMofifier(result, decl.isExported(), ScriptElementKindModifier.exportedModifier);
                result = addMofifier(result, decl.isAmbient(), ScriptElementKindModifier.ambientModifier);
                result = addMofifier(result, decl.isPublic(), ScriptElementKindModifier.publicMemberModifier);
                result = addMofifier(result, decl.isPrivate(), ScriptElementKindModifier.privateMemberModifier);
                result = addMofifier(result, decl.isStatic(), ScriptElementKindModifier.staticModifier);
                return result;
            }

            switch (ast.nodeType) {
                case TypeScript.NodeType.InterfaceDeclaration:
                    var typeDecl = <TypeScript.TypeDeclaration>ast;
                    return typeDeclToKindModifiers(typeDecl);

                case TypeScript.NodeType.ClassDeclaration:
                    var classDecl = <TypeScript.ClassDeclaration>ast;
                    return classDeclToKindModifiers(classDecl);

                case TypeScript.NodeType.ModuleDeclaration:
                    var moduleDecl = <TypeScript.ModuleDeclaration>ast;
                    return moduleDeclToKindModifiers(moduleDecl);

                case TypeScript.NodeType.VarDecl:
                    var varDecl = <TypeScript.VarDecl>ast;
                    return varDeclToKindModifiers(varDecl);

                case TypeScript.NodeType.ArgDecl:
                    var argDecl = <TypeScript.ArgDecl>ast;
                    return argDeclToKindModifiers(argDecl);

                case TypeScript.NodeType.FuncDecl:
                    var funcDecl = <TypeScript.FuncDecl>ast;
                    return funcDeclToKindModifiers(funcDecl);

                default:
                    if (this.logger.warning()) {
                        this.logger.log("Warning: unrecognized AST node type: " + (<any>TypeScript.NodeType)._map[ast.nodeType]);
                    }
                    return ScriptElementKindModifier.none;
            }
        }

        private getASTItems(
            unitIndex: number,
            ast: TypeScript.AST,
            match: (parent: TypeScript.AST, ast: TypeScript.AST, name: string) => string,
            findMinChar?: (parent: TypeScript.AST, ast: TypeScript.AST) => number,
            findLimChar?: (parent: TypeScript.AST, ast: TypeScript.AST) => number): NavigateToItem[] {

            if (findMinChar == null) {
                findMinChar = (parent, ast) => {
                    return ast.minChar;
                }
            }

            if (findLimChar == null) {
                findLimChar = (parent, ast) => {
                    return ast.limChar;
                }
            }

            var context = new NavigateToContext();
            context.unitIndex = unitIndex;

            var addItem = (parent: TypeScript.AST, ast: TypeScript.AST, name: string, kind: string): NavigateToItem => {
                // Compiler generated nodes have no positions (e.g. the "_map" of an enum)
                if (!TypeScript.isValidAstNode(ast))
                    return null;

                var matchKind = match(parent, ast, name);
                var minChar = findMinChar(parent, ast);
                var limChar = findLimChar(parent, ast)
                if (matchKind != null && minChar >= 0 && limChar >= 0 && limChar >= minChar) {
                    var item = new NavigateToItem();
                    item.name = name;
                    item.matchKind = matchKind;
                    item.kind = kind;
                    item.kindModifiers = this.getDeclNodeElementKindModifiers(ast);
                    item.unitIndex = this.pullCompilerState.mapToHostUnitIndex(context.unitIndex);
                    item.minChar = minChar;
                    item.limChar = limChar;
                    item.containerName = (TypeScript.lastOf(context.containerSymbols) === null ? "" : TypeScript.lastOf(context.containerSymbols).fullName());
                    item.containerKind = TypeScript.lastOf(context.containerKinds) === null ? "" : TypeScript.lastOf(context.containerKinds);
                    return item;
                }
                return null;
            }

            var getLimChar = (ast: TypeScript.AST): number => {
                return (ast == null ? -1 : ast.limChar);
            }

            var pre = (ast: TypeScript.AST, parent: TypeScript.AST, walker: TypeScript.IAstWalker) => {
                context.path.push(ast);

                if (!TypeScript.isValidAstNode(ast))
                    return ast;

                var item: NavigateToItem = null;

                switch (ast.nodeType) {
                    case TypeScript.NodeType.InterfaceDeclaration: {
                        var typeDecl = <TypeScript.TypeDeclaration>ast;
                        item = addItem(parent, typeDecl, typeDecl.name.actualText, ScriptElementKind.interfaceElement);
                        context.containerASTs.push(ast);
                        //context.containerSymbols.push(typeDecl.getType().symbol);
                        context.containerKinds.push("interface");
                    }
                        break;

                    case TypeScript.NodeType.ClassDeclaration: {
                        var classDecl = <TypeScript.ClassDeclaration>ast;
                        item = addItem(parent, classDecl, classDecl.name.actualText, ScriptElementKind.classElement);
                        context.containerASTs.push(ast);
                        //context.containerSymbols.push(classDecl.getType().symbol);
                        context.containerKinds.push("class");
                    }
                        break;

                    case TypeScript.NodeType.ModuleDeclaration: {
                        var moduleDecl = <TypeScript.ModuleDeclaration>ast;
                        var isEnum = moduleDecl.isEnum();
                        var kind = isEnum ? ScriptElementKind.enumElement : ScriptElementKind.moduleElement;
                        item = addItem(parent, moduleDecl, moduleDecl.name.actualText, kind);
                        context.containerASTs.push(ast);
                        //context.containerSymbols.push(moduleDecl.mod.symbol);
                        context.containerKinds.push(kind);
                    }
                        break;

                    case TypeScript.NodeType.VarDecl: {
                        var varDecl = <TypeScript.VarDecl>ast;
                        if (varDecl.id !== null) {
                            if (varDecl.isProperty()) {
                                item = addItem(parent, varDecl, varDecl.id.actualText, ScriptElementKind.memberVariableElement);
                            }
                            else if (context.path.isChildOfScript() || context.path.isChildOfModule()) {
                                item = addItem(parent, varDecl, varDecl.id.actualText, ScriptElementKind.variableElement);
                            }
                        }
                    }
                        walker.options.goChildren = false;
                        break;

                    case TypeScript.NodeType.ArgDecl: {
                        var argDecl = <TypeScript.ArgDecl>ast;
                        // Argument of class constructor are members (variables or properties)
                        if (argDecl.id !== null) {
                            if (context.path.isArgumentOfClassConstructor()) {
                                if (argDecl.isProperty()) {
                                    item = addItem(parent, argDecl, argDecl.id.actualText, ScriptElementKind.memberVariableElement);
                                }
                            }
                        }
                    }
                        walker.options.goChildren = false;
                        break;

                    case TypeScript.NodeType.FuncDecl: {
                        var funcDecl = <TypeScript.FuncDecl>ast;
                        var kind: string = null;
                        var name: string = (funcDecl.name !== null ? funcDecl.name.actualText : null);
                        if (funcDecl.isGetAccessor()) {
                            kind = ScriptElementKind.memberGetAccessorElement;
                        }
                        else if (funcDecl.isSetAccessor()) {
                            kind = ScriptElementKind.memberSetAccessorElement;
                        }
                        else if (funcDecl.isCallMember()) {
                            kind = ScriptElementKind.callSignatureElement;
                            name = "()";
                        }
                        else if (funcDecl.isIndexerMember()) {
                            kind = ScriptElementKind.indexSignatureElement;
                            name = "[]";
                        }
                        else if (funcDecl.isConstructMember()) {
                            kind = ScriptElementKind.constructSignatureElement;
                            name = "new()";
                        }
                        else if (funcDecl.isConstructor) {
                            kind = ScriptElementKind.constructorImplementationElement;
                            name = "constructor";
                        }
                        else if (funcDecl.isMethod()) {
                            kind = ScriptElementKind.memberFunctionElement;
                        }
                        else if (context.path.isChildOfScript() || context.path.isChildOfModule()) {
                            kind = ScriptElementKind.functionElement;
                        }

                        if (kind !== null && name !== null) {
                            item = addItem(parent, funcDecl, name, kind);
                        }
                    }
                        break;

                    case TypeScript.NodeType.ObjectLit:
                        walker.options.goChildren = false;
                        break;
                }

                if (item !== null) {
                    context.result.push(item);
                }

                return ast;
            }

            var post = (ast: TypeScript.AST, parent: TypeScript.AST) => {
                context.path.pop();

                if (ast === TypeScript.lastOf(context.containerASTs)) {
                    context.containerASTs.pop();
                    context.containerSymbols.pop();
                    context.containerKinds.pop();
                }
                return ast;
            }

            TypeScript.getAstWalkerFactory().walk(ast, pre, post);
            return context.result;
        }

        ///
        /// Return the stack of AST nodes containing "position"
        ///
        public getAstPathToPosition(script: TypeScript.AST, pos: number, options = TypeScript.GetAstPathOptions.Default): TypeScript.AstPath {
            if (this.logger.information()) {
                this.logger.log("getAstPathToPosition(" + script + ", " + pos + ")");
            }

            var path = TypeScript.getAstPathToPosition(script, pos, options);

            if (this.logger.information()) {
                if (path.count() == 0) {
                    this.logger.log("getAstPathToPosition: no ast found at position");
                }
                else {
                    new TypeScript.AstLogger(this.logger).logNode(<TypeScript.Script>script, path.ast(), 0);
                }
            }

            return path;
        }

        public getIdentifierPathToPosition(script: TypeScript.AST, pos: number): TypeScript.AstPath {
            this.logger.log("getIdentifierPathToPosition(" + script + ", " + pos + ")");

            var path = this.getAstPathToPosition(script, pos, TypeScript.GetAstPathOptions.EdgeInclusive);
            if (path.count() == 0)
                return null;

            if (path.nodeType() !== TypeScript.NodeType.Name) {
                return null;
            }

            return path;
        }

        //
        // New Pull stuff
        //
        public getTypeAtPosition(fileName: string, pos: number): TypeInfo {
            this.refresh();

            var script = this.pullCompilerState.getScriptAST(fileName);

            var typeInfoAtPosition = this.pullCompilerState.getPullTypeInfoAtPosition(pos, script);
            
            // PULLTODO: use typeInfo for now, since I want to see more info for debugging;
            //  we'll want to switch to typeName later, though
            var memberName = TypeScript.MemberName.create(typeInfoAtPosition.typeInfo);
            var minChar = -1;
            var limChar = -1;
            var kind = this.mapPullElementKind(typeInfoAtPosition.typeSymbol.getKind());
            var docComment = typeInfoAtPosition.typeSymbol.getDocComments();
            var symbolName = typeInfoAtPosition.typeSymbol.getName();

            if (typeInfoAtPosition.ast) {
                minChar = typeInfoAtPosition.ast.minChar;
                limChar = typeInfoAtPosition.ast.limChar;
            }

            return new TypeInfo(memberName, docComment, symbolName, kind, minChar, limChar);
        }

        public getCompletionsAtPosition(fileName: string, pos: number, isMemberCompletion: bool): CompletionInfo {
            this.refresh();

            var completions = new CompletionInfo();

            var script = this.pullCompilerState.getScriptAST(fileName);
            var path = this.getAstPathToPosition(script, pos);
            if (this.isCompletionListBlocker(path)) {
                this.logger.log("Returning an empty list because position is inside a comment");
            }
            // Special case for object literals
            //else if (this.isObjectLiteralMemberNameCompletion(enclosingScopeContext)) {
            //    this.logger.log("Completion list for members of object literal");
            //    return getCompletions(true);
            //}
            else if (this.isRightOfDot(path, pos)) {
                var parentDot = path.asts[path.top].nodeType === TypeScript.NodeType.Dot ? path.asts[path.top] : path.asts[path.top - 1];
                var operand = (<TypeScript.BinaryExpression>parentDot).operand1;
                var info = this.pullCompilerState.getPullTypeInfoAtPosition(operand.limChar, script);
                var type = info.typeSymbol;

                completions.isMemberCompletion = true;
                var members = type.getMembers();
                members.forEach((x) => {
                    var entry = new CompletionEntry();
                    entry.name = x.getName();
                    entry.type = x.getType()? x.getType().toString() : "unkown type";
                    entry.kind = this.mapPullElementKind(x.getKind());
                    //entry.fullSymbolName = this.getFullNameOfSymbol(x.sym, enclosingScopeContext);
                    entry.docComment = x.getDocComments();
                    entry.kindModifiers = this.getScriptElementKindModifiers(x);
                    completions.entries.push(entry);
                });

            }
            // Ensure we are in a position where it is ok to provide a completion list
            else if (isMemberCompletion || this.isCompletionListTriggerPoint(path)) {
                //return getCompletions(enclosingScopeContext.isMemberCompletion);
                // TODO: get scope memebers
            }

            return completions;
        }

        private isRightOfDot(path: TypeScript.AstPath, position: number): bool {
            return (path.count() >= 1 && path.asts[path.top].nodeType === TypeScript.NodeType.Dot && (<TypeScript.BinaryExpression>path.asts[path.top]).operand1.limChar < position) ||
                   (path.count() >= 2 && path.asts[path.top].nodeType === TypeScript.NodeType.Name && path.asts[path.top - 1].nodeType === TypeScript.NodeType.Dot && (<TypeScript.BinaryExpression>path.asts[path.top - 1]).operand2 === path.asts[path.top]);
        }

        private isCompletionListBlocker(path: TypeScript.AstPath): bool {
            var asts = path.asts;
            var node = path.count() >= 1 && path.ast();
            if (node) {
                if (node.nodeType === TypeScript.NodeType.Comment ||
                    node.nodeType === TypeScript.NodeType.Regex ||
                    node.nodeType === TypeScript.NodeType.QString) {
                    return true;
                }
            }
            return false;
        }

        private isCompletionListTriggerPoint(path: TypeScript.AstPath): bool {
            if (path.isNameOfVariable() // var <here>
                || path.isNameOfFunction() // function <here>
                || path.isNameOfArgument() // function foo(<here>
                || path.isNameOfInterface() // interface <here>
                || path.isNameOfClass() // class <here>
                || path.isNameOfModule() // module <here>
                ) {
                return false;
            }

            //var node = path.count() >= 1 && path.ast();
            //if (node) {
            //    if (node.nodeType === TypeScript.NodeType.Member) // class C() { property <here>
            //    || isNodeType(TypeScript.NodeType.TryCatch) // try { } catch(<here>
            //    || isNodeType(TypeScript.NodeType.Catch) // try { } catch(<here>
            //    //|| isNodeType(Tools.NodeType.Class) // doesn't work
            //    || isNodeType(TypeScript.NodeType.Comment)
            //    || isNodeType(TypeScript.NodeType.Regex)
            //    || isNodeType(TypeScript.NodeType.QString)
            //    ) {
            //    return false
            //}

            return true;
        }

        private mapPullElementKind(kind: TypeScript.PullElementKind): string {
            switch (kind)
            {
                case TypeScript.PullElementKind.Script:
                    return ScriptElementKind.scriptElement;
                case TypeScript.PullElementKind.Container:
                    return ScriptElementKind.moduleElement;
                case TypeScript.PullElementKind.Interface:
                    return ScriptElementKind.interfaceElement;
                case TypeScript.PullElementKind.Class:
                    return ScriptElementKind.classElement;
                case TypeScript.PullElementKind.Enum:
                    return ScriptElementKind.enumElement;
                case TypeScript.PullElementKind.Variable:
                    return ScriptElementKind.variableElement;
                case TypeScript.PullElementKind.Parameter:
                    return ScriptElementKind.parameterElement;
                case TypeScript.PullElementKind.Property:
                    return ScriptElementKind.memberVariableElement;
                case TypeScript.PullElementKind.Function:
                    return ScriptElementKind.functionElement;
                case TypeScript.PullElementKind.ConstructorMethod:
                    return ScriptElementKind.constructorImplementationElement;
                case TypeScript.PullElementKind.Method:
                    return ScriptElementKind.memberFunctionElement;
                case TypeScript.PullElementKind.FunctionExpression:
                    return ScriptElementKind.functionElement;
                case TypeScript.PullElementKind.GetAccessor:
                    return ScriptElementKind.memberGetAccessorElement;
                case TypeScript.PullElementKind.SetAccessor:
                    return ScriptElementKind.memberSetAccessorElement;
                case TypeScript.PullElementKind.CallSignature:
                    return ScriptElementKind.callSignatureElement;
                case TypeScript.PullElementKind.ConstructSignature:
                    return ScriptElementKind.constructSignatureElement;
                case TypeScript.PullElementKind.IndexSignature:
                    return ScriptElementKind.indexSignatureElement;
            }

            return ScriptElementKind.unknown;
        }

        private getScriptElementKindModifiers(symbol: TypeScript.PullSymbol): string {
            var result = [];

            if (symbol.hasFlag(TypeScript.PullElementFlags.Exported)) {
                result.push(ScriptElementKindModifier.exportedModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Ambient)) {
                result.push(ScriptElementKindModifier.ambientModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Public)) {
                result.push(ScriptElementKindModifier.publicMemberModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Private)) {
                result.push(ScriptElementKindModifier.privateMemberModifier);
            }
            if (symbol.hasFlag(TypeScript.PullElementFlags.Static)) {
                result.push(ScriptElementKindModifier.staticModifier);
            }

            return result.length > 0 ? result.join(',') : ScriptElementKindModifier.none;
        }

        // 
        // New IPullLanguageService features using Fiedlity Syntax Tree directelly
        //
        public getOutliningSpans(fileName: string): TextSpan[] {
            this.refresh();

            if (!this.pullCompilerState.getCompilationSettings().useFidelity) {
                throw new Error("getOutliningSpans is only available when useFidelity flag is set.");
            }

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            return OutliningElementsCollector.collectElements(syntaxTree.sourceUnit());
        }

        public getMatchingBraceSpans(fileName: string, position: number): TextSpan[] {
            this.refresh();

            if (!this.pullCompilerState.getCompilationSettings().useFidelity) {
                throw new Error("getMatchingBraceSpans is only available when useFidelity flag is set.");
            }

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            return BraceMatcher.getMatchSpans(syntaxTree, position);
        }

        public getIndentation(fileName: string, position: number, options: Services.EditorOptions): number {
            this.refresh();

            if (!this.pullCompilerState.getCompilationSettings().useFidelity) {
                throw new Error("getIndentation is only available when useFidelity flag is set.");
            }

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            var sourceText = this.pullCompilerState.getSourceText2(fileName, /* cached */ true);
            return Indenter.getIndentation(syntaxTree.sourceUnit(), sourceText, position, options);
        }

        public logSyntaxTree(fileName: string): void {
            this.refresh();

            if (!this.pullCompilerState.getCompilationSettings().useFidelity) {
                throw new Error("logSyntaxTree is only available when useFidelity flag is set.");
            }

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            var serializedTree = SyntaxNodeSerializer.serialize(syntaxTree.sourceUnit());
            this.logger.log("");
            this.logger.log(serializedTree);
        }

        //
        // Private methods
        //
        private logFormatCodeOptions(options: FormatCodeOptions) {
            if (this.logger.information()) {
                this.logger.log("options.InsertSpaceAfterCommaDelimiter=" + options.InsertSpaceAfterCommaDelimiter);
                this.logger.log("options.InsertSpaceAfterSemicolonInForStatements=" + options.InsertSpaceAfterSemicolonInForStatements);
                this.logger.log("options.InsertSpaceBeforeAndAfterBinaryOperators=" + options.InsertSpaceBeforeAndAfterBinaryOperators);
                this.logger.log("options.InsertSpaceAfterKeywordsInControlFlowStatements=" + options.InsertSpaceAfterKeywordsInControlFlowStatements);
                this.logger.log("options.InsertSpaceAfterFunctionKeywordForAnonymousFunctions=" + options.InsertSpaceAfterFunctionKeywordForAnonymousFunctions);
                this.logger.log("options.InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis=" + options.InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis);
                this.logger.log("options.PlaceOpenBraceOnNewLineForFunctions=" + options.PlaceOpenBraceOnNewLineForFunctions);
                this.logger.log("options.PlaceOpenBraceOnNewLineForControlBlocks=" + options.PlaceOpenBraceOnNewLineForControlBlocks);
            }
        }

        private logEditResults(syntaxAST: ScriptSyntaxAST, result: Services.TextEdit[]) {
            if (this.logger.information()) {
                var logSourceText = (text: string) => {
                    var textLines = text.replace(/^\s+|\s+$/g, "").replace(/\r\n?/g, "\n").split(/\n/);
                    for (var i = 0; i < textLines.length; i++) {
                        var textLine = textLines[i];
                        var msg = "line #" + i + "(length=" + textLine.length + "): \"" + textLine + "\"";
                        this.logger.log(msg);
                    }
                }

                var sourceText = syntaxAST.getSourceText();
                logSourceText(sourceText.getText(0, sourceText.getLength()));
                for (var i = 0; i < result.length; i++) {
                    var edit = result[i];
                    var oldSourceText = sourceText.getText(edit.minChar, edit.limChar);
                    var text = "edit #" + i + ": minChar=" + edit.minChar + ", " +
                        "limChar=" + edit.limChar + ", " +
                        "oldText=\"" + TypeScript.stringToLiteral(oldSourceText, 30) + "\", " +
                        "textLength=" + edit.text.length + ", " +
                        "text=\"" + TypeScript.stringToLiteral(edit.text, 30) + "\"";
                    this.logger.log(text);
                }
            }
        }
    }
}