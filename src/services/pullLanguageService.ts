// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='typescriptServices.ts' />
///<reference path='..\Compiler\Core\IDiagnostic.ts' />

module Services {
    export class LanguageService implements ILanguageService {
        private logger: TypeScript.ILogger;
        private compilerState: CompilerState;
        private singleFileSyntaxTreeState: ScriptSyntaxASTState;
        private formattingRulesProvider: TypeScript.Formatting.RulesProvider;

        constructor(public host: ILanguageServiceHost) {
            this.logger = this.host;
            this.compilerState = new CompilerState(this.host);
            this.singleFileSyntaxTreeState = new ScriptSyntaxASTState();
            this.formattingRulesProvider = new TypeScript.Formatting.RulesProvider(this.logger);
        }

        public refresh(): void {
            TypeScript.timeFunction(this.logger, "refresh()", () => {
                this.compilerState.refresh();
            });
        }

        private minimalRefresh(): void {
            TypeScript.timeFunction(this.logger, "minimalRefresh()", () => {
                this.compilerState.minimalRefresh();
            });
        }

        public getSymbolTree(): ISymbolTree {
            this.refresh();
            return this.compilerState.getSymbolTree();
        }

        public getReferencesAtPosition(fileName: string, pos: number): ReferenceEntry[] {
            this.refresh();

            var result: ReferenceEntry[] = [];

            var script = this.compilerState.getScriptAST(fileName);
              
            /// TODO: this does not allow getting references on "constructor"

            var path = this.getAstPathToPosition(script, pos);
            if (path.ast() === null || path.ast().nodeType !== TypeScript.NodeType.Name) {
                this.logger.log("No name found at the given position");
                return result;
            }

            var symbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, script);
            if (symbolInfoAtPosition === null || symbolInfoAtPosition.symbol === null) {
                this.logger.log("No symbol found at the given position");
                return result;
            }

            var symbol = symbolInfoAtPosition.symbol;
            
            var fileNames = this.compilerState.getFileNames();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                result = result.concat(this.getReferencesInFile(fileNames[i], symbol));
            }

            return result;
        }

        public getOccurrencesAtPosition(fileName: string, pos: number): ReferenceEntry[]{
            // This needs to run on the default background thread and not the High response one.
            // Disabling for now.
            

            //this.refresh();

            //var result: ReferenceEntry[] = [];

            //var script = this.pullCompilerState.getScriptAST(fileName);

            ///// TODO: this does not allow getting references on "constructor"

            //var path = this.getAstPathToPosition(script, pos);
            //if (path.ast() === null || path.ast().nodeType !== TypeScript.NodeType.Name) {
            //    this.logger.log("No name found at the given position");
            //    return result;
            //}

            //var symbolInfoAtPosition = this.pullCompilerState.getSymbolInformationFromPath(path, script);
            //if (symbolInfoAtPosition === null || symbolInfoAtPosition.symbol === null) {
            //    this.logger.log("No symbol found at the given position");
            //    return result;
            //}

            //var symbol = symbolInfoAtPosition.symbol;
            //return this.getReferencesInFile(fileName, symbol);
            return [];
        }

        public getImplementorsAtPosition(fileName: string, position: number): ReferenceEntry[] {
            return [];
        }

        private getReferencesInFile(fileName: string, symbol: TypeScript.PullSymbol): ReferenceEntry[] {
            var result: ReferenceEntry[] = [];
            var symbolName = symbol.getName();
            
            var possiblePositions = this.getPossibleSymbolReferencePositions(fileName, symbol);
            if (possiblePositions && possiblePositions.length > 0) {
                var searchScript = this.compilerState.getScript(fileName);

                possiblePositions.forEach(p => {
                    var path = this.getAstPathToPosition(searchScript, p);
                    if (path.ast() === null || path.ast().nodeType !== TypeScript.NodeType.Name) {
                        return;
                    }

                    var searchSymbolInfoAtPosition = this.compilerState.getSymbolInformationFromPath(path, searchScript);
                    if (searchSymbolInfoAtPosition !== null && searchSymbolInfoAtPosition.symbol === symbol) {
                        var isWriteAccess = false; // this.isWriteAccess(searchSymbolInfoAtPosition.ast, searchSymbolInfoAtPosition.parentAST);
                        result.push(new ReferenceEntry(fileName, searchSymbolInfoAtPosition.ast, isWriteAccess));
                    }
                });
            }
            

            return result;
        }

        private getPossibleSymbolReferencePositions(fileName: string, symbol: TypeScript.PullSymbol): number []{
            var positions: number[] = [];

            /// TODO: Cache symbol existence for files to save text search
            /// TODO: Use a smarter search mechanism to avoid picking up partial matches, matches in comments and in string literals

            var sourceText = this.compilerState.getScriptSnapshot(fileName);
            var text = sourceText.getText(0, sourceText.getLength());
            var symbolName = symbol.getName();

            var position = text.indexOf(symbolName);
            while (position >= 0) {
                positions.push(position);
                position = text.indexOf(symbolName, position + symbolName.length + 1);
            }

            return positions;
        }

        public getSignatureAtPosition(fileName: string, position: number): SignatureInfo {
            this.refresh();

            var script = this.compilerState.getScriptAST(fileName);

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
            var callSymbolInfo = this.compilerState.getCallInformationFromPath(path, script);
            if (!callSymbolInfo || !callSymbolInfo.targetSymbol || !callSymbolInfo.resolvedSignatures) {
                this.logger.log("Could not find symbol for call expression");
                return null;
            }

            // Build the result
            var result = new SignatureInfo();

            result.formal = this.convertSignatureSymbolToSignatureInfo(callSymbolInfo.targetSymbol, isNew, callSymbolInfo.resolvedSignatures, callSymbolInfo.enclosingScopeSymbol);
            result.actual = this.convertCallExprToActualSignatureInfo(callExpression, position, atEOF);
            result.activeFormal = (callSymbolInfo.resolvedSignatures && callSymbolInfo.candidateSignature) ? callSymbolInfo.resolvedSignatures.indexOf(callSymbolInfo.candidateSignature) : -1;
            
            if (result.actual === null || result.formal === null || result.activeFormal === null) {
                this.logger.log("Can't compute actual and/or formal signature of the call expression");
                return null;
            }

            return result;
        }

        private convertSignatureSymbolToSignatureInfo(symbol: TypeScript.PullSymbol, isNew: bool, signatures: TypeScript.PullSignatureSymbol[], enclosingScopeSymbol: TypeScript.PullSymbol): FormalSignatureInfo {
            var result = new FormalSignatureInfo();
            result.isNew = isNew;
            result.name = symbol.getName();
            result.docComment = this.compilerState.getDocComments(symbol); 
            result.openParen = "(";  //(group.flags & TypeScript.SignatureFlags.IsIndexer ? "[" : "(");
            result.closeParen = ")";  //(group.flags & TypeScript.SignatureFlags.IsIndexer ? "]" : ")");

            var hasOverloads = signatures.length > 1;
            signatures
                // Same test as in "typeFlow.str: resolveOverload()": filter out the definition signature if there are overloads
                .filter(signature => !(hasOverloads && signature.isDefinition() && !this.compilerState.compilationSettings().canCallDefinitionSignature))
                .forEach(signature => {
                    var signatureGroupInfo = new FormalSignatureItemInfo();
                    signatureGroupInfo.docComment = this.compilerState.getDocComments(signature);
                    signatureGroupInfo.returnType = signature.getReturnType() === null ? "any" : signature.getReturnType().getScopedNameEx(enclosingScopeSymbol).toString();
                    var parameters = signature.getParameters();
                    parameters.forEach((p, i) => {
                        var signatureParameterInfo = new FormalParameterInfo();
                        signatureParameterInfo.isVariable = signature.hasVariableParamList() && (i === parameters.length - 1);
                        signatureParameterInfo.isOptional = p.getIsOptional();
                        signatureParameterInfo.name = p.getName();
                        signatureParameterInfo.docComment = this.compilerState.getDocComments(p);
                        signatureParameterInfo.type = p.getTypeName(enclosingScopeSymbol);
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

            var script = this.compilerState.getScriptAST(fileName);

            var path = this.getAstPathToPosition(script, position);
            if (path.count() == 0) {
                return null;
            }

            var symbolInfo = this.compilerState.getSymbolInformationFromPath(path, script);
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
            var symbolKind = this.mapPullElementKind(symbolInfo.symbol);//this.getSymbolElementKind(sym),
            var container = symbolInfo.symbol.getContainer();
            var containerName = container ? container.getName() : "<global>";//this.getSymbolContainerName(sym)
            var containerKind = "";//this.getSymbolContainerKind(sym)

            var entries: DefinitionInfo[] = [];
            var mainEntry = 0;
            for (var i = 0, n = declarations.length; i < n; i++) {
                var declaration = declarations[i];
                var span = declaration.getSpan();

                // For functions, pick the definition to be the main entry
                var signature = declaration.getSignatureSymbol();
                if (signature && signature.isDefinition()) {
                    mainEntry = i;
                }
                // TODO: find a better way of selecting the main entry for none-function overloaded types instead of selecting the first one

                entries.push(new DefinitionInfo(declaration.getScriptName(), span.start(), span.end(), symbolKind, symbolName, containerKind, containerName, null));
            }

            result = entries[mainEntry];
            if (entries.length > 1) {
                // Remove the main entry
                entries.splice(mainEntry, 1);
                result.overloads = entries;
            }
            
            return result;
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
            var len = 0;
            
            var fileNames = this.compilerState.getFileNames();
            for (i = 0, len = fileNames.length; i < len; i++) {
                // Add the item for the script name if needed
                var fileName = fileNames[i];
                var script = this.compilerState.getScript(fileName);

                var matchKind = match(null, script, fileName);
                if (matchKind != null) {
                    var item = new NavigateToItem();
                    item.name = fileName;
                    item.matchKind = matchKind;
                    item.kind = ScriptElementKind.scriptElement;
                    item.fileName = fileName;
                    item.minChar = script.minChar;
                    item.limChar = script.limChar;
                    result.push(item);
                }

                var items = this.getASTItems(fileName, script, match);
                for (var j = 0; j < items.length; j++) {
                    result.push(items[j]);
                }
            }
            return result;
        }

        public getScriptLexicalStructure(fileName: string): NavigateToItem[] {
            this.refresh();

            var script = this.compilerState.getScriptAST(fileName);
            return this.getASTItems(script.locationInfo.fileName, script, (name) => MatchKind.exact);
        }

        public getSyntacticDiagnostics(fileName: string): TypeScript.IDiagnostic[] {
            this.compilerState.refresh();

            var syntaxTree = this.compilerState.getSyntaxTree(fileName);
            return syntaxTree.diagnostics();
        }

        public getSemanticDiagnostics(fileName: string): TypeScript.IDiagnostic[] {
            this.compilerState.refresh();

            // JOE: Here is where you should call and get the right set of semantic errors for this file.
            return this.compilerState.pullGetErrorsForFile(fileName);
        }

        public getEmitOutput(fileName: string): IOutputFile[] {
            return [];
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
            fileName: string,
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
            context.fileName = fileName;

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
                    item.fileName = context.fileName;
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
                        kind = null;
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

            return TypeScript.getAstPathToPosition(script, pos, options);
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

        private getFullNameOfSymbol(symbol: TypeScript.PullSymbol, enclosingScopeSymbol: TypeScript.PullSymbol) {
            var container = symbol.getContainer();
            if (this.isLocal(symbol) ||
                symbol.getKind() == TypeScript.PullElementKind.Parameter) {
                // Local var
                return symbol.getScopedName(enclosingScopeSymbol);
            }

            if (symbol.getKind() == TypeScript.PullElementKind.Primitive) {
                // Primitive type symbols - do not use symbol name
                return "";
            }

            return symbol.fullName();
        }

        //
        // New Pull stuff
        //
        public getTypeAtPosition(fileName: string, pos: number): TypeInfo {
            this.refresh();

            var script = this.compilerState.getScriptAST(fileName);

            var typeInfoAtPosition = this.compilerState.getPullTypeInfoAtPosition(pos, script);
            if (!typeInfoAtPosition.symbol) {
                return null;
            }

            if (typeInfoAtPosition.callSignatures &&
                (!typeInfoAtPosition.candidateSignature || typeInfoAtPosition.candidateSignature.isDefinition())) {
                var len = typeInfoAtPosition.callSignatures.length;
                for (var i = 0; i < len; i++) {
                    if (len > 1 && typeInfoAtPosition.callSignatures[i].isDefinition()) {
                        continue;
                    }

                    typeInfoAtPosition.candidateSignature = typeInfoAtPosition.callSignatures[i];
                    break;
                }
            }

            var memberName = typeInfoAtPosition.callSignatures ?
                TypeScript.PullSignatureSymbol.getSignatureTypeMemberName(typeInfoAtPosition.candidateSignature,
                    typeInfoAtPosition.callSignatures, typeInfoAtPosition.enclosingScopeSymbol) :
                typeInfoAtPosition.symbol.getTypeNameEx(typeInfoAtPosition.enclosingScopeSymbol, true);
            var minChar = -1;
            var limChar = -1;
            var kind = this.mapPullElementKind(typeInfoAtPosition.symbol, !typeInfoAtPosition.callSignatures,
                !!typeInfoAtPosition.callSignatures, typeInfoAtPosition.ast && typeInfoAtPosition.ast.nodeType == TypeScript.NodeType.New);

            var symbolForDocComment = typeInfoAtPosition.candidateSignature ? typeInfoAtPosition.candidateSignature : typeInfoAtPosition.symbol;
            var docComment = this.compilerState.getDocComments(symbolForDocComment, !typeInfoAtPosition.callSignatures);
            var symbolName = this.getFullNameOfSymbol(typeInfoAtPosition.symbol, typeInfoAtPosition.enclosingScopeSymbol);

            if (typeInfoAtPosition.ast) {
                minChar = typeInfoAtPosition.ast.minChar;
                limChar = typeInfoAtPosition.ast.limChar;
            }

            return new TypeInfo(memberName, docComment, symbolName, kind, minChar, limChar);
        }

        public getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: bool): CompletionInfo {
            this.refresh();

            var completions = new CompletionInfo();

            var script = this.compilerState.getScriptAST(fileName);
            var path = this.getAstPathToPosition(script, position);
            if (this.isCompletionListBlocker(path)) {
                this.logger.log("Returning an empty list because position is inside a comment, string or regular expression");
                return null;
            }

            var isRightOfDot = false;
            if (path.count() >= 1 &&
                path.asts[path.top].nodeType === TypeScript.NodeType.Dot
                && (<TypeScript.BinaryExpression>path.asts[path.top]).operand1.limChar < position) {
                isRightOfDot = true;
                path.push((<TypeScript.BinaryExpression>path.asts[path.top]).operand1);
            }
            else if (path.count() >= 2 &&
                    path.asts[path.top].nodeType === TypeScript.NodeType.Name &&
                    path.asts[path.top - 1].nodeType === TypeScript.NodeType.Dot &&
                    (<TypeScript.BinaryExpression>path.asts[path.top - 1]).operand2 === path.asts[path.top]) {
                isRightOfDot = true;
                path.pop();
                path.push((<TypeScript.BinaryExpression>path.asts[path.top]).operand1);
            }

            if (isRightOfDot) {
                var members = this.compilerState.getVisibleMemberSymbolsFromPath(path, script);
                if (!members) {
                    return null;
                }
                completions.isMemberCompletion = true;
                completions.entries = this.getCompletionEntriesFromSymbols(members);
            }
            // Ensure we are in a position where it is ok to provide a completion list
            else if (isMemberCompletion || this.isCompletionListTriggerPoint(path)) {
                // Get scope memebers
                completions.isMemberCompletion = false;
                var symbols = this.compilerState.getVisibleSymbolsFromPath(path, script);
                completions.entries = this.getCompletionEntriesFromSymbols(symbols);
            }

            return completions;
        }

        private getCompletionEntriesFromSymbols(symbolInfo: TypeScript.PullVisibleSymbolsInfo): CompletionEntry[] {
            var result: CompletionEntry[] = [];

            symbolInfo.symbols.forEach((symbol) => {
                var entry = new CompletionEntry();
                entry.name = symbol.getName();
                entry.type = symbol.getTypeName(symbolInfo.enclosingScopeSymbol, true);
                entry.kind = this.mapPullElementKind(symbol, true);
                entry.fullSymbolName = this.getFullNameOfSymbol(symbol, symbolInfo.enclosingScopeSymbol);
                entry.docComment = this.compilerState.getDocComments(symbol, true);
                entry.kindModifiers = this.getScriptElementKindModifiers(symbol);
                result.push(entry);
            });
            return result;
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
                || path.isNameOfArgument() // function foo(a, b<here>
                || path.isArgumentListOfFunction() // function foo(<here>
                || path.ast().nodeType === TypeScript.NodeType.ArgDecl // function foo(a <here>
                ) {
                return false;
            }

            if (path.isNameOfVariable() // var <here>
                || path.isNameOfFunction() // function <here>
                || path.isNameOfArgument() // function foo(<here>
                || path.isArgumentListOfFunction() // function foo(<here>
                || path.isNameOfInterface() // interface <here>
                || path.isNameOfClass() // class <here>
                || path.isNameOfModule() // module <here>
                ) {
                return false;
            }

            //var node = path.count() >= 1 && path.ast();
            //if (node) {
            //    if (node.nodeType === TypeScript.NodeType.Member // class C() { property <here>
            //    || node.nodeType === TypeScript.NodeType.TryCatch // try { } catch(<here>
            //    || node.nodeType === TypeScript.NodeType.Catch // try { } catch(<here>
            //    ) {
            //        return false
            //    }
            //}

            return true;
        }

        private isLocal(symbol: TypeScript.PullSymbol) {
            var container = symbol.getContainer();
            if (container) {
                var containerKind = container.getKind();
                if (containerKind & (TypeScript.PullElementKind.SomeFunction | TypeScript.PullElementKind.FunctionType)) {
                    return true;
                }

                if (containerKind == TypeScript.PullElementKind.ConstructorType && !symbol.hasFlag(TypeScript.PullElementFlags.Static)) {
                    return true;
                }
            }

            return false;
        }

        private isModule(symbol: TypeScript.PullSymbol) {
            var decls = symbol.getDeclarations();
            for (var i = 0; i < decls.length; i++) {
                if (decls[i].getKind() == TypeScript.PullElementKind.Container) {
                    return true;
                }
            }

            return false;
        }

        private mapPullElementKind(symbol: TypeScript.PullSymbol, useConstructorAsClass?: bool, varIsFunction?: bool, functionIsConstructor?: bool): string {
            if (functionIsConstructor) {
                return ScriptElementKind.constructorImplementationElement;
            }

            var kind = symbol.getKind();
            if (varIsFunction) {
                switch (kind) {
                    case TypeScript.PullElementKind.Container:
                    case TypeScript.PullElementKind.Interface:
                    case TypeScript.PullElementKind.Class:
                    case TypeScript.PullElementKind.Parameter:
                        return ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.Variable:
                        return this.isLocal(symbol) ? ScriptElementKind.localFunctionElement : ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.Property:
                        return ScriptElementKind.memberFunctionElement;
                    case TypeScript.PullElementKind.Function:
                        return this.isLocal(symbol) ? ScriptElementKind.localFunctionElement : ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.ConstructorMethod:
                        return ScriptElementKind.constructorImplementationElement;
                    case TypeScript.PullElementKind.Method:
                        return ScriptElementKind.memberFunctionElement;
                    case TypeScript.PullElementKind.FunctionExpression:
                        return ScriptElementKind.localFunctionElement;
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
            } else {
                switch (kind) {
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
                        if (this.isModule(symbol)) {
                            return ScriptElementKind.moduleElement;
                        }
                        return this.isLocal(symbol) ? ScriptElementKind.localVariableElement : ScriptElementKind.variableElement;
                    case TypeScript.PullElementKind.Parameter:
                        return ScriptElementKind.parameterElement;
                    case TypeScript.PullElementKind.Property:
                        return ScriptElementKind.memberVariableElement;
                    case TypeScript.PullElementKind.Function:
                        return this.isLocal(symbol) ? ScriptElementKind.localFunctionElement : ScriptElementKind.functionElement;
                    case TypeScript.PullElementKind.ConstructorMethod:
                        return useConstructorAsClass ? ScriptElementKind.classElement : ScriptElementKind.constructorImplementationElement;
                    case TypeScript.PullElementKind.Method:
                        return ScriptElementKind.memberFunctionElement;
                    case TypeScript.PullElementKind.FunctionExpression:
                        return ScriptElementKind.localFunctionElement;
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
        // Syntactic Single-File features
        //

        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): SpanInfo {
            return null;
        }

        public getBreakpointStatementAtPosition(fileName: string, pos: number): SpanInfo {
            return null;
        }

        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);
           
            return manager.formatSelection(minChar, limChar);
        }

        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            return manager.formatDocument(minChar, limChar);
        }

        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            return manager.formatOnPaste(minChar, limChar);
        }

        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[] {
            this.minimalRefresh();

            var manager = this.getFormattingManager(fileName, options);

            if (key === "}") {
                return manager.formatOnClosingCurlyBrace(position);
            }
            else if (key === ";") {
                return manager.formatOnSemicolon(position);
            }
            else if (key === "\n") {
                return manager.formatOnEnter(position);
            }

            return [];
        }

        private getFormattingManager(fileName: string, options: FormatCodeOptions) {
            // Ensure rules are initialized and up to date wrt to formatting options
            this.formattingRulesProvider.ensureUptodate(options);

            // Get the Syntax Tree
            var syntaxTree = this.getSyntaxTree(fileName);

            // Convert IScriptSnapshot to ITextSnapshot
            var scriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var segmentedScriptSnapshot = new TypeScript.ScriptSnapshotText(scriptSnapshot);
            var textSnapshot = new TypeScript.Formatting.TextSnapshot(segmentedScriptSnapshot);

            var manager = new TypeScript.Formatting.FormattingManager(syntaxTree, textSnapshot, this.formattingRulesProvider, options);

            return manager;
        }

        public getOutliningRegions(fileName: string): TypeScript.TextSpan[] {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTree(fileName);

            return OutliningElementsCollector.collectElements(syntaxTree.sourceUnit());
        }

        // Given a script name and position in the script, return a string representing 
        // the desired smart indent text (assuming the line is empty).
        // Return "null" in case the smart indent cannot be determined.
        public getSmartIndentAtLineNumber(fileName: string, position: number, editorOptions: EditorOptions): number {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTree(fileName);

            var scriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var segmentedScriptSnapshot = new TypeScript.ScriptSnapshotText(scriptSnapshot);
            var textSnapshot = new TypeScript.Formatting.TextSnapshot(segmentedScriptSnapshot);
            var options = new FormattingOptions(!editorOptions.ConvertTabsToSpaces, editorOptions.TabSize, editorOptions.IndentSize, editorOptions.NewLineCharacter)
            
            return TypeScript.Formatting.SingleTokenIndenter.getIndentationAmount(position, syntaxTree.sourceUnit(), textSnapshot, options);
        }

        // Given a script name and position in the script, return a pair of text range if the 
        // position corresponds to a "brace matchin" characters (e.g. "{" or "(", etc.)
        // If the position is not on any range, return "null".
        public getBraceMatchingAtPosition(fileName: string, position: number): TypeScript.TextSpan[] {
            this.minimalRefresh();

            var syntaxTree = this.getSyntaxTree(fileName);

            return BraceMatcher.getMatchSpans(syntaxTree, position);
        }

        //
        // Manage Single file syntax tree state
        //
        private getSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var version = this.compilerState.getScriptVersion(fileName);
            var syntaxTree: TypeScript.SyntaxTree = null;

            if (this.singleFileSyntaxTreeState.syntaxTree === null || this.singleFileSyntaxTreeState.fileName !== fileName) {
                syntaxTree = this.createSyntaxTree(fileName);
            }
            else if (this.singleFileSyntaxTreeState.version !== version) {
                syntaxTree = this.updateSyntaxTree(fileName, this.singleFileSyntaxTreeState.syntaxTree, this.singleFileSyntaxTreeState.version);
            }

            if (syntaxTree !== null) {
                // All done, ensure state is up to date
                this.singleFileSyntaxTreeState.version = version;
                this.singleFileSyntaxTreeState.fileName = fileName;
                this.singleFileSyntaxTreeState.syntaxTree = syntaxTree;
            }
            return this.singleFileSyntaxTreeState.syntaxTree;
        }

        private createSyntaxTree(fileName: string): TypeScript.SyntaxTree {
            var scriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var segmentedScriptSnapshot = new TypeScript.ScriptSnapshotText(scriptSnapshot);

            var syntaxTree = TypeScript.Parser1.parse(segmentedScriptSnapshot);

            return syntaxTree
        }

        private updateSyntaxTree(fileName: string, previousSyntaxTree: TypeScript.SyntaxTree, previousFileVersion: number): TypeScript.SyntaxTree {
            var editRange = this.compilerState.getScriptTextChangeRangeSinceVersion(fileName, previousFileVersion);

            // If "no changes", tree is good to go as is
            if (editRange === null) {
                return previousSyntaxTree;
            }

            // Debug.assert(newLength >= 0);

            var newScriptSnapshot = this.compilerState.getScriptSnapshot(fileName);
            var newSegmentedScriptSnapshot = new TypeScript.ScriptSnapshotText(newScriptSnapshot);

            var nextSyntaxTree = TypeScript.Parser1.incrementalParse(
                previousSyntaxTree, editRange, newSegmentedScriptSnapshot);

            return nextSyntaxTree;
        }
    }
}