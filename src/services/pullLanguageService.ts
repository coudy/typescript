// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />

module Services {
    export interface IPullLanguageService {
        host: ILanguageServiceHost;

        refresh(): void;


        getErrors(maxCount: number): TypeScript.ErrorEntry[];
        getOutliningSpans(fileName: string): TextSpan[];
        getMatchingBraceSpans(fileName: string, position: number): TextSpan[];

        logAST(fileName: string): void;

        //getScriptAST(fileName: string): TypeScript.Script;
        //getScriptErrors(fileName: string, maxCount: number): TypeScript.ErrorEntry[];
        //getCompletionsAtPosition(fileName: string, pos: number, isMemberCompletion: bool): CompletionInfo;
        //getTypeAtPosition(fileName: string, pos: number): TypeInfo;
        //getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): SpanInfo;
        //getBreakpointStatementAtPosition(fileName: string, pos: number): SpanInfo;
        //getSignatureAtPosition(fileName: string, pos: number): SignatureInfo;
        //getDefinitionAtPosition(fileName: string, pos: number): DefinitionInfo;
        //getReferencesAtPosition(fileName: string, pos: number): ReferenceEntry[];
        //getOccurrencesAtPosition(fileName: string, pos: number): ReferenceEntry[];
        //getImplementorsAtPosition(fileName: string, pos: number): ReferenceEntry[];
        //getNavigateToItems(searchValue: string): NavigateToItem[];
        //getScriptLexicalStructure(fileName: string): NavigateToItem[];

        //getScriptSyntaxAST(fileName: string): ScriptSyntaxAST;
        //getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        //getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        //getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        //getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[];
        //getSmartIndentAtLineNumber(fileName: string, lineNumber: number, options: Services.EditorOptions): number;

        //getAstPathToPosition(script: TypeScript.AST, pos: number, options: TypeScript.GetAstPathOptions /*= Tools.GetAstPathOptions.Default*/): TypeScript.AstPath;
        //getIdentifierPathToPosition(script: TypeScript.AST, pos: number): TypeScript.AstPath;

        //getSymbolTree(): Services.ISymbolTree;
        //getEmitOutput(fileName: string): IOutputFile[];
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
            return [];
        }

        public getOccurrencesAtPosition(fileName: string, pos: number): ReferenceEntry[] {
            return [];
        }

        public getImplementorsAtPosition(fileName: string, position: number): ReferenceEntry[] {
            return [];
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
        private getBreakpointInStatement(pos: number, astSpan: TypeScript.ASTSpan, verifyASTPos: bool,
            existingResult: TypeScript.ASTSpan, forceFirstStatement: bool, isAst: bool): TypeScript.ASTSpan {
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
            var resultAST: TypeScript.ASTSpan = null;
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

        public getSignatureAtPosition(fileName: string, pos: number): SignatureInfo {
            return null;
        }

        public getDefinitionAtPosition(fileName: string, pos: number): DefinitionInfo {
            return null;
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

        // Given a script name and position in the script, return a pair of text range if the 
        // position corresponds to a "brace matchin" characters (e.g. "{" or "(", etc.)
        // If the position is not on any range, return "null".
        public getMatchingBraceSpans(fileName: string, position: number): TextSpan[] {
            this.refresh();

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            return BraceMatcher.getMatchSpans(syntaxTree, position);
        }

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

        public getOutliningSpans(fileName: string): TextSpan[] {
            this.refresh();

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            return OutliningElementsCollector.collectElements(syntaxTree.sourceUnit());
        }

        /// LOG AST
        ///
        public logAST(fileName: string): void {
            this.refresh();

            var syntaxTree = this.pullCompilerState.getSyntaxTree(fileName);
            var serializedTree = SyntaxNodeSerializer.serialize(syntaxTree.sourceUnit());
            this.logger.log("");
            this.logger.log(serializedTree);
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

            var info = this.pullCompilerState.getPullTypeInfoAtPosition(pos, script);
            var minChar = -1;
            var limChar = -1;

            if (info.ast) {
                minChar = info.ast.minChar;
                limChar = info.ast.limChar;
            }

            // PULLTODO: use typeInfo for now, since I want to see more info for debugging;
            //  we'll want to switch to typeName later, though
            var memberName = TypeScript.MemberName.create(info.typeInfo);

            var typeInfo = new TypeInfo(memberName, null, minChar, limChar);

            return typeInfo;
        }

        public getCompletionsAtPosition(fileName: string, pos: number, isMemberCompletion: bool): CompletionInfo {
            //this.minimalRefresh();
            this.refresh();

            var script = this.pullCompilerState.getScriptAST(fileName);

            var info = this.pullCompilerState.getPullTypeInfoAtPosition(pos, script);

            var type = info.typeSymbol;

            //if (isMemberCompletion && type.hasBrand()) {
            //    type = (<TypeScript.PullClassSymbol>type).getInstanceType();
            //}

            var completions = new CompletionInfo();
            
            // PULLREVIEW: Always enabling this for now, to reduce noise in the completion lists
            completions.isMemberCompletion = true;
            
            var members = type.getMembers();
            var completionEntry: CompletionEntry;

            for (var i = 0; i < members.length; i++) {
                completionEntry = new CompletionEntry;
                completionEntry.name = members[i].getName();
                if (members[i].getType()) {
                    completionEntry.type = members[i].getType().toString();
                }
                else {
                    completionEntry.type = "Not sure what the type is...";
                }

                completions.entries[completions.entries.length] = completionEntry;
            }

            return completions;
        }

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