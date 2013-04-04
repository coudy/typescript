/// <reference path='Syntax\SyntaxVisitor.generated.ts' />
/// <reference path='Syntax\SyntaxWalker.generated.ts' />
/// <reference path='Syntax\SyntaxInformationMap.ts' />
/// <reference path='ast.ts' />

module TypeScript {
    var incrementalAst = true;
    export class SyntaxPositionMap {
        private position = 0;
        private elementToPosition = Collections.createHashTable(2048, Collections.identityHashCode);

        constructor(node: SyntaxNode) {
            this.process(node);
        }

        private process(element: ISyntaxElement) {
            if (element !== null) {
                if (element.isToken()) {
                    this.elementToPosition.add(element, this.position);
                    this.position += element.fullWidth();
                }
                else {
                    if (element.isNode() ||
                        (element.isList() && (<ISyntaxList>element).childCount() > 0) ||
                        (element.isSeparatedList() && (<ISeparatedSyntaxList>element).childCount() > 0)) {
                        this.elementToPosition.add(element, this.position);
                    }

                    for (var i = 0, n = element.childCount(); i < n; i++) {
                        this.process(element.childAt(i));
                    }
                }
            }
        }

        public static create(node: SyntaxNode): SyntaxPositionMap {
            var map = new SyntaxPositionMap(node);
            return map;
        }

        public fullStart(element: ISyntaxElement): number {
            return this.elementToPosition.get(element);
        }

        public start(element: ISyntaxElement): number {
            return this.fullStart(element) + element.leadingTriviaWidth();
        }

        public end(element: ISyntaxElement): number {
            return this.start(element) + element.width();
        }

        public fullEnd(element: ISyntaxElement): number {
            return this.fullStart(element) + element.fullWidth();
        }
    }

    export class SyntaxTreeToAstVisitor implements ISyntaxVisitor {
        public static checkPositions = false;

        private position = 0;

        private requiresExtendsBlock: bool = false;
        private previousTokenTrailingComments: Comment[] = null;

        private isParsingDeclareFile: bool;
        private isParsingAmbientModule = false;

        constructor(private syntaxPositionMap: SyntaxPositionMap,
                    private fileName: string,
                    private lineMap: LineMap,
                    private compilationSettings: CompilationSettings) {
            this.isParsingDeclareFile = isDTSFile(fileName);
        }

        public static visit(syntaxTree: SyntaxTree, fileName: string, compilationSettings: CompilationSettings): Script {
            var map = SyntaxTreeToAstVisitor.checkPositions ? SyntaxPositionMap.create(syntaxTree.sourceUnit()) : null;
            var visitor = new SyntaxTreeToAstVisitor(map, fileName, syntaxTree.lineMap(), compilationSettings);
            return syntaxTree.sourceUnit().accept(visitor);
        }

        private assertElementAtPosition(element: ISyntaxElement) {
            if (SyntaxTreeToAstVisitor.checkPositions) {
                Debug.assert(this.position === this.syntaxPositionMap.fullStart(element));
            }
        }

        private movePast(element: ISyntaxElement): void {
            if (element !== null) {
                this.assertElementAtPosition(element);
                this.position += element.fullWidth();
            }
        }

        private moveTo(element1: ISyntaxNodeOrToken, element2: ISyntaxElement): void {
            if (element2 !== null) {
                this.position += Syntax.childOffset(element1, element2);
            }
        }

        private applyDelta(ast: TypeScript.AST, delta: number) {
            if (delta === 0) {
                return;
            }

            var applyDelta = (ast: TypeScript.AST) => {
                if (ast.minChar !== -1) {
                    ast.minChar += delta;
                }
                if (ast.limChar !== -1) {
                    ast.limChar += delta;
                }
            }

            var applyDeltaToComments = (comments: TypeScript.Comment[]) => {
                if (comments && comments.length > 0) {
                    for (var i = 0; i < comments.length; i++) {
                        var comment = comments[i];
                        applyDelta(comment);
                        comment.minLine = this.lineMap.getLineNumberFromPosition(comment.minChar);
                        comment.limLine = this.lineMap.getLineNumberFromPosition(comment.limChar);
                    }
                }
            }

            var pre = function (cur: TypeScript.AST, parent: TypeScript.AST, walker: TypeScript.IAstWalker) {
                // Apply delta to this node
                applyDelta(cur);
                applyDeltaToComments(cur.preComments);
                applyDeltaToComments(cur.postComments);

                return cur;
            }

            TypeScript.getAstWalkerFactory().walk(ast, pre);
        }

        private setSpan(span: AST, fullStart: number, element: ISyntaxElement): void {
            var desiredMinChar = fullStart + element.leadingTriviaWidth();
            var desiredLimChar = fullStart + element.fullWidth();
            Debug.assert(!isNaN(desiredMinChar));
            Debug.assert(!isNaN(desiredLimChar));

            if (span.minChar !== -1) {
                Debug.assert(span.limChar !== -1);

                // Have an existing span.  We need to adjust it so that it starts at the provided
                // desiredMinChar.
                
                var delta = desiredMinChar - span.minChar;
                this.applyDelta(span, delta);

                span.limChar = desiredLimChar;

                Debug.assert(span.minChar === desiredMinChar);
                Debug.assert(span.limChar === desiredLimChar);
            }
            else {
                Debug.assert(span.limChar === -1);
                // Have a new span, just set it to the lim/min we were given.
                span.minChar = desiredMinChar;
                span.limChar = desiredLimChar;
            }

            Debug.assert(span.minChar !== -1);
            Debug.assert(span.limChar !== -1);
        }

        private setSpan1(span: IASTSpan, fullStart: number, element: ISyntaxElement): void {
            var desiredMinChar = fullStart + element.leadingTriviaWidth();
            var desiredLimChar = fullStart + element.fullWidth();
            Debug.assert(!isNaN(desiredMinChar));
            Debug.assert(!isNaN(desiredLimChar));

            span.minChar = desiredMinChar;
            span.limChar = desiredLimChar;

            Debug.assert(span.minChar !== -1);
            Debug.assert(span.limChar !== -1);
        }


        private setSpanExplicit(span: IASTSpan, start: number, end: number): void {
            span.minChar = start;
            span.limChar = end;
            Debug.assert(!isNaN(span.minChar));
            Debug.assert(!isNaN(span.limChar));
            Debug.assert(span.minChar !== -1);
            Debug.assert(span.limChar !== -1);
        }

        private identifierFromToken(token: ISyntaxToken, isOptional: bool, useValueText: bool): Identifier {
            this.assertElementAtPosition(token);

            var result: Identifier = null;
            if (token.fullWidth() === 0) {
                result = new MissingIdentifier();
            }
            else {
                result = new Identifier(token.text());
                result.text = useValueText ? token.valueText() : result.text;
            }

            if (isOptional) {
                result.setFlags(result.getFlags() | ASTFlags.OptionalName);
            }

            var start = this.position + token.leadingTriviaWidth();
            this.setSpanExplicit(result, start, start + token.width());

            return result;
        }

        private getAST(element: ISyntaxElement): any {
            if (incrementalAst) {
                var result = (<any>element)._ast;
                return result ? result : null;
            }
            else {
                return null;
            }
        }

        private setAST(element: ISyntaxElement, ast: IASTSpan): void {
            if (incrementalAst) {
                (<any>element)._ast = ast;
            }
        }

        private visitSyntaxList(list: ISyntaxList): ASTList {
            var start = this.position;
            var result: ASTList = this.getAST(list);
            if (result) {
                this.movePast(list);
            }
            else {
                result = new ASTList();

                for (var i = 0, n = list.childCount(); i < n; i++) {
                    result.append(list.childAt(i).accept(this));
                }

                if (n > 0) {
                    this.setAST(list, result);
                }
            }

            this.setSpan(result, start, list);
            return result;
        }

        private visitSeparatedSyntaxList(list: ISeparatedSyntaxList): ASTList {
            var start = this.position;
            var result: ASTList = this.getAST(list);
            if (result) {
                this.movePast(list);
            }
            else {
                result = new ASTList();

                for (var i = 0, n = list.childCount(); i < n; i++) {
                    if (i % 2 === 0) {
                        result.append(list.childAt(i).accept(this));
                        this.previousTokenTrailingComments = null;
                    }
                    else {
                        var separatorToken = <ISyntaxToken>list.childAt(i);
                        this.previousTokenTrailingComments = this.convertTokenTrailingComments(
                            separatorToken, this.position + separatorToken.leadingTriviaWidth() + separatorToken.width());
                        this.movePast(separatorToken);
                    }
                }

                this.previousTokenTrailingComments = null;

                if (n > 0) {
                    this.setAST(list, result);
                }
            }

            this.setSpan(result, start, list);
            return result;
        }

        private createRef(text: string, minChar: number): Identifier {
            var id = new Identifier(text);
            id.minChar = minChar;
            return id;
        }

        private convertComment(trivia: ISyntaxTrivia, commentStartPosition: number, hasTrailingNewLine: bool): Comment {
            var comment = new Comment(trivia.fullText(), trivia.kind() === SyntaxKind.MultiLineCommentTrivia, hasTrailingNewLine);

            comment.minChar = commentStartPosition;
            comment.limChar = commentStartPosition + trivia.fullWidth();
            comment.minLine = this.lineMap.getLineNumberFromPosition(comment.minChar);
            comment.limLine = this.lineMap.getLineNumberFromPosition(comment.limChar);

            return comment;
        }

        private convertComments(triviaList: ISyntaxTriviaList, commentStartPosition: number): Comment[] {
            var result: Comment[] = [];

            for (var i = 0, n = triviaList.count(); i < n; i++) {
                var trivia = triviaList.syntaxTriviaAt(i);

                if (trivia.isComment()) {
                    var hasTrailingNewLine = ((i + 1) < n) && triviaList.syntaxTriviaAt(i + 1).isNewLine();
                    result.push(this.convertComment(trivia, commentStartPosition, hasTrailingNewLine));
                }

                commentStartPosition += trivia.fullWidth();
            }

            return result;
        }

        private mergeComments(comments1: Comment[], comments2: Comment[]): Comment[] {
            if (comments1 === null) {
                return comments2;
            }

            if (comments2 === null) {
                return comments1;
            }

            return comments1.concat(comments2);

        }

        private convertTokenLeadingComments(token: ISyntaxToken, commentStartPosition: number): Comment[] {
            if (token === null) {
                return null;
            }

            var preComments = token.hasLeadingComment()
                ? this.convertComments(token.leadingTrivia(), commentStartPosition)
                : null;

            var previousTokenTrailingComments = this.previousTokenTrailingComments;
            this.previousTokenTrailingComments = null;

            return this.mergeComments(previousTokenTrailingComments, preComments);
        }

        private convertTokenTrailingComments(token: ISyntaxToken, commentStartPosition: number): Comment[] {
            if (token === null || !token.hasTrailingComment() || token.hasTrailingNewLine()) {
                return null;
            }

            return this.convertComments(token.trailingTrivia(), commentStartPosition);
        }

        private convertNodeLeadingComments(node: SyntaxNode, nodeStart: number): Comment[] {
            return this.convertTokenLeadingComments(node.firstToken(), nodeStart);
        }

        private convertNodeTrailingComments(node: SyntaxNode, nodeStart: number): Comment[] {
            return this.convertTokenTrailingComments(node.lastToken(), nodeStart + node.leadingTriviaWidth() + node.width());
        }

        private containsToken(list: ISyntaxList, kind: SyntaxKind): bool {
            for (var i = 0, n = list.childCount(); i < n; i++) {
                if (list.childAt(i).kind() === kind) {
                    return true;
                }
            }

            return false;
        }

        private visitToken(token: ISyntaxToken): AST {
            this.assertElementAtPosition(token);

            var result: AST = this.getAST(token);
            var fullStart = this.position;

            if (result) {
                this.movePast(token);
            }
            else {
                if (token.kind() === SyntaxKind.ThisKeyword) {
                    result = new AST(NodeType.ThisExpression);
                }
                else if (token.kind() === SyntaxKind.SuperKeyword) {
                    result = new AST(NodeType.SuperExpression);
                }
                else if (token.kind() === SyntaxKind.TrueKeyword) {
                    result = new AST(NodeType.TrueLiteral);
                }
                else if (token.kind() === SyntaxKind.FalseKeyword) {
                    result = new AST(NodeType.FalseLiteral);
                }
                else if (token.kind() === SyntaxKind.NullKeyword) {
                    result = new AST(NodeType.Null);
                }
                else if (token.kind() === SyntaxKind.StringLiteral) {
                    result = new StringLiteral(token.text());
                }
                else if (token.kind() === SyntaxKind.RegularExpressionLiteral) {
                    result = new RegexLiteral(token.text());
                }
                else if (token.kind() === SyntaxKind.NumericLiteral) {
                    var preComments = this.convertTokenLeadingComments(token, fullStart);
                    
                    var value = token.text().indexOf(".") > 0 ? parseFloat(token.text()) : parseInt(token.text());
                    result = new NumberLiteral(value, token.text());

                    result.preComments = preComments;
                }
                else {
                    result = this.identifierFromToken(token, /*isOptional:*/ false, /*useValueText:*/ true);
                }

                this.movePast(token);
            }

            var start = fullStart + token.leadingTriviaWidth();
            this.setAST(token, result);
            this.setSpanExplicit(result, start, start + token.width());
            return result;
        }

        private hasTopLevelImportOrExport(node: SourceUnitSyntax): bool {
            // TODO: implement this.

            var firstToken: ISyntaxToken;
            var i = 0;
            var n = 0;

            for (i = 0, n = node.moduleElements.childCount(); i < n; i++) {
                var moduleElement = node.moduleElements.childAt(i);

                firstToken = moduleElement.firstToken();
                if (firstToken !== null && firstToken.kind() === SyntaxKind.ExportKeyword) {
                    return true;
                }

                if (moduleElement.kind() === SyntaxKind.ImportDeclaration) {
                    var importDecl = <ImportDeclarationSyntax>moduleElement;
                    if (importDecl.moduleReference.kind() === SyntaxKind.ExternalModuleReference) {
                        return true;
                    }
                }
            }

            firstToken = node.firstToken();

            if (firstToken.hasLeadingComment()) {
                var leadingTrivia = firstToken.leadingTrivia();

                for (i = 0, n = leadingTrivia.count(); i < n; i++) {
                    var trivia = leadingTrivia.syntaxTriviaAt(i);

                    if (trivia.isComment()) {
                        // var dependencyPath = getAdditionalDependencyPath(trivia.text());

                        //if (dependencyPath) {
                        //    this.amdDependencies.push(dependencyPath);
                        //}

                        if (getImplicitImport(trivia.fullText())) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private hasUseStrictDirective(list: ISyntaxList): bool {
            // Check if all the items are directive prologue elements.
            for (var i = 0; i < list.childCount(); i++) {
                var item = list.childAt(i);
                if (!SyntaxFacts.isDirectivePrologueElement(item)) {
                    return false;
                }

                if (SyntaxFacts.isUseStrictDirective(item)) {
                    return true;
                }
            }

            return false;
        }

        private visitSourceUnit(node: SourceUnitSyntax): Script {
            this.assertElementAtPosition(node);

            var start = this.position;
            var members;

            var bod = this.visitSyntaxList(node.moduleElements);

            if (this.hasUseStrictDirective(node.moduleElements)) {
                bod.setFlags(bod.getFlags() | ASTFlags.StrictMode);
            }

            var topLevelMod: ModuleDeclaration = null;
            if (this.compilationSettings.moduleGenTarget != ModuleGenTarget.Local && this.hasTopLevelImportOrExport(node)) {
                var correctedFileName = switchToForwardSlashes(this.fileName);
                var id: Identifier = new Identifier(correctedFileName);
                topLevelMod = new ModuleDeclaration(id, bod, null);
                this.setSpanExplicit(topLevelMod, start, this.position);

                topLevelMod.setModuleFlags(topLevelMod.getModuleFlags() | ModuleFlags.IsDynamic);
                topLevelMod.setModuleFlags(topLevelMod.getModuleFlags() | ModuleFlags.IsWholeFile);
                topLevelMod.setModuleFlags(topLevelMod.getModuleFlags() | ModuleFlags.Exported);

                if (this.isParsingDeclareFile) {
                    topLevelMod.setModuleFlags(topLevelMod.getModuleFlags() | ModuleFlags.Ambient);
                }

                topLevelMod.prettyName = getPrettyName(correctedFileName);
                //topLevelMod.containsUnicodeChar = this.scanner.seenUnicodeChar;
                //topLevelMod.containsUnicodeCharInComment = this.scanner.seenUnicodeCharInComment;

                // topLevelMod.amdDependencies = this.amdDependencies;

                bod = new ASTList();
                this.setSpanExplicit(bod, start, this.position);
                bod.append(topLevelMod);
            }

            var result = new Script();
            this.setSpanExplicit(result, start, this.position);

            result.moduleElements = bod;
            result.locationInfo = new LocationInfo(this.fileName, this.lineMap);
            result.topLevelMod = topLevelMod;
            result.isDeclareFile = this.isParsingDeclareFile;
            result.requiresExtendsBlock = this.requiresExtendsBlock;

            return result;
        }

        private visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any {
            this.assertElementAtPosition(node);
            this.moveTo(node, node.stringLiteral);
            var result = this.identifierFromToken(node.stringLiteral, /*isOptional:*/ false, /*useValueText:*/ false);
            this.movePast(node.stringLiteral);
            this.movePast(node.closeParenToken);

            return result;
        }

        private visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any {
            this.assertElementAtPosition(node);
            return node.moduleName.accept(this);
        }

        private visitClassDeclaration(node: ClassDeclarationSyntax): ClassDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ClassDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);
                this.moveTo(node, node.identifier);
                var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);

                var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
                var extendsList = new ASTList();
                var implementsList = new ASTList();

                var i = 0;
                var n = 0;

                for (i = 0, n = node.heritageClauses.childCount(); i < n; i++) {
                    var heritageClause = <HeritageClauseSyntax>node.heritageClauses.childAt(i);
                    if (heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ExtendsKeyword) {
                        extendsList = heritageClause.accept(this);
                    }
                    else {
                        Debug.assert(heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ImplementsKeyword);
                        implementsList = heritageClause.accept(this);
                    }
                }

                this.movePast(node.openBraceToken);
                var members = this.visitSyntaxList(node.classElements);
                this.movePast(node.closeBraceToken);

                result = new ClassDeclaration(name, typeParameters, members, extendsList, implementsList);

                result.preComments = preComments;
                result.postComments = postComments;

                for (i = 0; i < members.members.length; i++) {
                    var member = members.members[i];
                    if (member.nodeType === NodeType.FunctionDeclaration) {
                        var funcDecl = <FunctionDeclaration>member;

                        if (funcDecl.isConstructor) {
                            funcDecl.name = name;
                            funcDecl.classDecl = result;

                            result.constructorDecl = funcDecl;
                        }
                    }
                }
            }

            this.requiresExtendsBlock = this.requiresExtendsBlock || result.extendsList.members.length > 0;

            if (this.containsToken(node.modifiers, SyntaxKind.ExportKeyword) || this.isParsingAmbientModule) {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Exported);
            }

            if (this.containsToken(node.modifiers, SyntaxKind.DeclareKeyword) || this.isParsingAmbientModule || this.isParsingDeclareFile) {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Ambient);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): InterfaceDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: InterfaceDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);
                this.moveTo(node, node.identifier);
                var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);

                var i = 0;
                var n = 0;
                var extendsList: ASTList = null;

                for (i = 0, n = node.heritageClauses.childCount(); i < n; i++) {
                    var heritageClause = <HeritageClauseSyntax>node.heritageClauses.childAt(i);
                    if (i === 0) {
                        extendsList = heritageClause.accept(this);
                    }
                    else {
                        this.movePast(heritageClause);
                    }
                }

                this.movePast(node.body.openBraceToken);
                var members = this.visitSeparatedSyntaxList(node.body.typeMembers);

                this.movePast(node.body.closeBraceToken);

                result = new InterfaceDeclaration(name, typeParameters, members, extendsList, null);

                result.preComments = preComments;
                result.postComments = postComments;
            }

            if (this.containsToken(node.modifiers, SyntaxKind.ExportKeyword) || this.isParsingAmbientModule) {
                result.setVarFlags(result.getVarFlags() | VariableFlags.Exported);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitHeritageClause(node: HeritageClauseSyntax): ASTList {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ASTList = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                result = new ASTList();

                this.movePast(node.extendsOrImplementsKeyword);
                for (var i = 0, n = node.typeNames.childCount(); i < n; i++) {
                    if (i % 2 === 1) {
                        this.movePast(node.typeNames.childAt(i));
                    }
                    else {
                        var type = this.visitType(node.typeNames.childAt(i));
                        if (type.nodeType === NodeType.TypeRef) {
                            type = (<TypeReference>type).term;
                        }

                        result.append(type);
                    }
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private getModuleNames(node: ModuleDeclarationSyntax): Identifier[] {
            var result: Identifier[] = [];

            if (node.stringLiteral !== null) {
                result.push(this.identifierFromToken(node.stringLiteral, /*isOptional:*/false, /*useValueText:*/ false));
                this.movePast(node.stringLiteral);
            }
            else {
                this.getModuleNamesHelper(node.moduleName, result);
            }

            return result;
        }

        private getModuleNamesHelper(name: INameSyntax, result: Identifier[]): void {
            this.assertElementAtPosition(name);

            if (name.kind() === SyntaxKind.QualifiedName) {
                var qualifiedName = <QualifiedNameSyntax>name;
                this.getModuleNamesHelper(qualifiedName.left, result);
                this.movePast(qualifiedName.dotToken);
                result.push(this.identifierFromToken(qualifiedName.right, /*isOptional:*/ false, /*useValueText:*/ false));
                this.movePast(qualifiedName.right);
            }
            else {
                result.push(this.identifierFromToken(<ISyntaxToken>name, /*isOptional:*/ false, /*useValueText:*/ false));
                this.movePast(name);
            }
        }

        private visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ModuleDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.moduleKeyword);
                this.movePast(node.moduleKeyword);
                var names = this.getModuleNames(node);
                this.movePast(node.openBraceToken);
                var svIsParsingAmbientModule = this.isParsingAmbientModule;
                if (this.containsToken(node.modifiers, SyntaxKind.DeclareKeyword) || this.isParsingDeclareFile) {
                    this.isParsingAmbientModule = true;
                }
                var members = this.visitSyntaxList(node.moduleElements);
                this.isParsingAmbientModule = svIsParsingAmbientModule;
                var closeBracePosition = this.position;
                this.movePast(node.closeBraceToken);

                for (var i = names.length - 1; i >= 0; i--) {
                    var innerName = names[i];

                    var closeBraceSpan = new ASTSpan();
                    closeBraceSpan.minChar = closeBracePosition;
                    closeBraceSpan.limChar = this.position;

                    result = new ModuleDeclaration(innerName, members, closeBraceSpan);
                    this.setSpan(result, start, node);

                    result.preComments = preComments;
                    result.postComments = postComments;

                    preComments = null;
                    postComments = null;

                    // mark the inner module declarations as exported
                    if (i) {
                        result.setModuleFlags(result.getModuleFlags() | ModuleFlags.Exported);
                    } else if (this.containsToken(node.modifiers, SyntaxKind.ExportKeyword) || this.isParsingAmbientModule) {
                        // outer module is exported if export key word or parsing ambient module
                        result.setModuleFlags(result.getModuleFlags() | ModuleFlags.Exported);
                    }

                    // REVIEW: will also possibly need to re-parent comments as well

                    members = new ASTList();
                    members.append(result);
                }
            }

            // mark ambient if declare keyword or parsing ambient module or parsing declare file
            if (this.containsToken(node.modifiers, SyntaxKind.DeclareKeyword) || this.isParsingAmbientModule || this.isParsingDeclareFile) {
                result.setModuleFlags(result.getModuleFlags() | ModuleFlags.Ambient);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private hasDotDotDotParameter(parameters: ISeparatedSyntaxList): bool {
            for (var i = 0, n = parameters.nonSeparatorCount(); i < n; i++) {
                if ((<ParameterSyntax>parameters.nonSeparatorAt(i)).dotDotDotToken) {
                    return true;
                }
            }

            return false;
        }

        private visitFunctionDeclaration(node: FunctionDeclarationSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.identifier);
                var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);

                this.movePast(node.identifier);

                var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
                var parameters = node.callSignature.parameterList.accept(this);

                var returnType = node.callSignature.typeAnnotation
                    ? node.callSignature.typeAnnotation.accept(this)
                    : null;

                var block = node.block ? node.block.accept(this) : null;
                if (node.block) {
                    if (this.hasUseStrictDirective(node.block.statements)) {
                        block.setFlags(block.getFlags() | ASTFlags.StrictMode);
                    }
                }

                this.movePast(node.semicolonToken);

                result = new FunctionDeclaration(name, block, false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.postComments = postComments;
                result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
                result.returnTypeAnnotation = returnType;

                if (node.semicolonToken) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
                }
            }

            if (this.containsToken(node.modifiers, SyntaxKind.ExportKeyword) || this.isParsingAmbientModule) {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Exported);
            }

            if (this.containsToken(node.modifiers, SyntaxKind.DeclareKeyword) || this.isParsingAmbientModule || this.isParsingDeclareFile) {
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Ambient);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitEnumDeclaration(node: EnumDeclarationSyntax): ModuleDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;

            var preComments = this.convertNodeLeadingComments(node, start);
            var postComments = this.convertNodeTrailingComments(node, start);

            this.moveTo(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
            this.movePast(node.identifier);

            this.movePast(node.openBraceToken);
            var members = new ASTList();

            var mapDecl = new VarDecl(new Identifier("_map"));

            mapDecl.setVarFlags(mapDecl.getVarFlags() | VariableFlags.Exported);
            mapDecl.setVarFlags(mapDecl.getVarFlags() | VariableFlags.Private);

            // REVIEW: Is this still necessary?
            mapDecl.setVarFlags(mapDecl.getVarFlags() | (VariableFlags.Property | VariableFlags.Public));
            mapDecl.init = new UnaryExpression(NodeType.ArrayLiteralExpression, null);
            members.append(mapDecl);
            var lastValue: NumberLiteral = null;
            var memberNames: Identifier[] = [];
            var memberName: Identifier;

            for (var i = 0, n = node.enumElements.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(node.enumElements.childAt(i));
                }
                else {
                    var enumElement = <EnumElementSyntax>node.enumElements.childAt(i);

                    var memberValue: AST = null;

                    memberName = this.identifierFromToken(enumElement.propertyName, /*isOptional:*/ false, /*useValueText:*/ true);
                    this.movePast(enumElement.propertyName);

                    if (enumElement.equalsValueClause !== null) {
                        memberValue = enumElement.equalsValueClause.accept(this);
                        lastValue = <NumberLiteral>memberValue;
                    }

                    var memberStart = this.position;

                    if (memberValue === null) {
                        if (lastValue === null) {
                            memberValue = new NumberLiteral(0, "0");
                            lastValue = <NumberLiteral>memberValue;
                        }
                        else {
                            var nextValue = lastValue.value + 1;
                            memberValue = new NumberLiteral(nextValue, nextValue.toString());
                            lastValue = <NumberLiteral>memberValue;
                        }
                        var map: BinaryExpression =
                            new BinaryExpression(NodeType.Asg,
                                new BinaryExpression(NodeType.Index,
                                    new Identifier("_map"),
                                    memberValue),
                                new StringLiteral('"' + memberName.actualText + '"'));
                        map.setFlags(map.getFlags() | ASTFlags.EnumInitializer);
                        members.append(new ExpressionStatement(map));
                        this.setSpanExplicit(map, memberStart, this.position);
                        this.setSpanExplicit(map.operand1, memberStart, this.position);
                        this.setSpanExplicit(map.operand2, memberStart, this.position);
                    }

                    var member = new VarDecl(memberName);
                    member.init = memberValue;
                    // Note: Leave minChar, limChar as "-1" on typeExpr as this is a parsing artifact.
                    member.typeExpr = new TypeReference(this.createRef(name.actualText, -1), 0);
                    member.setVarFlags(member.getVarFlags() | VariableFlags.Property);
                    this.setSpanExplicit(member, memberStart, this.position);

                    if (memberValue.nodeType === NodeType.NumericLiteral) {
                        member.setVarFlags(member.getVarFlags() | VariableFlags.Constant);
                    }
                    else if (memberValue.nodeType === NodeType.Lsh) {
                        // If the initializer is of the form "value << value" then treat it as a constant
                        // as well.
                        var binop = <BinaryExpression>memberValue;
                        if (binop.operand1.nodeType === NodeType.NumericLiteral && binop.operand2.nodeType === NodeType.NumericLiteral) {
                            member.setVarFlags(member.getVarFlags() | VariableFlags.Constant);
                        }
                    }
                    else if (memberValue.nodeType === NodeType.Name) {
                        // If the initializer refers to an earlier enum value, then treat it as a constant
                        // as well.
                        var nameNode = <Identifier>memberValue;
                        for (var j = 0; j < memberNames.length; j++) {
                            memberName = memberNames[j];
                            if (memberName.text === nameNode.text) {
                                member.setVarFlags(member.getVarFlags() | VariableFlags.Constant);
                                break;
                            }
                        }
                    }

                    members.append(member);
                    memberNames.push(memberName);
                    // all enum members are exported
                    member.setVarFlags(member.getVarFlags() | VariableFlags.Exported);
                }
            }

            this.movePast(node.closeBraceToken);

            var endingToken = new ASTSpan();
            var modDecl = new ModuleDeclaration(name, members, endingToken);
            this.setSpan(modDecl, start, node);
            this.setSpan(mapDecl, start, node);

            modDecl.preComments = preComments;
            modDecl.postComments = postComments;
            modDecl.setModuleFlags(modDecl.getModuleFlags() | ModuleFlags.IsEnum);
            modDecl.recordNonInterface();

            if (this.containsToken(node.modifiers, SyntaxKind.ExportKeyword) || this.isParsingAmbientModule) {
                modDecl.setModuleFlags(modDecl.getModuleFlags() | ModuleFlags.Exported);
            }

            return modDecl;
        }

        private visitEnumElement(node: EnumElementSyntax): void {
            // Processing enum elements should be handled from inside visitEnumDeclaration.
            throw Errors.invalidOperation();
        }

        private visitImportDeclaration(node: ImportDeclarationSyntax): ImportDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ImportDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.identifier);
                var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                this.movePast(node.equalsToken);
                var alias = node.moduleReference.accept(this);
                this.movePast(node.semicolonToken);

                result = new ImportDeclaration(name, alias);

                result.preComments = preComments;
                result.postComments = postComments;
                result.isDynamicImport = node.moduleReference.kind() === SyntaxKind.ExternalModuleReference;
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitExportAssignment(node: ExportAssignmentSyntax): ExportAssignment {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ExportAssignment = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.moveTo(node, node.identifier);
                var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                this.movePast(node.semicolonToken);

                result = new ExportAssignment(name);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitVariableStatement(node: VariableStatementSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;

            var preComments: Comment[] = null;
            if (node.modifiers.childCount() > 0) {
                preComments = this.convertTokenLeadingComments(node.modifiers.firstToken(), start);
            }

            this.moveTo(node, node.variableDeclaration);

            var varList = node.variableDeclaration.accept(this);
            this.movePast(node.semicolonToken);

            if (varList.nodeType === NodeType.VarDecl) {
                varDecl = <VarDecl>varList;
                varList = new ASTList();
                varList.append(varDecl);
            }

            for (var i = 0, n = varList.members.length; i < n; i++) {
                var varDecl = <VarDecl>varList.members[i];

                if (i === 0) {
                    varDecl.preComments = this.mergeComments(preComments, varDecl.preComments);
                }

                if (this.containsToken(node.modifiers, SyntaxKind.ExportKeyword) || this.isParsingAmbientModule) {
                    varDecl.setVarFlags(varDecl.getVarFlags() | VariableFlags.Exported);
                }

                if (this.containsToken(node.modifiers, SyntaxKind.DeclareKeyword) || this.isParsingAmbientModule || this.isParsingDeclareFile) {
                    varDecl.setVarFlags(varDecl.getVarFlags() | VariableFlags.Ambient);
                }
            }

            if (node.variableDeclaration.variableDeclarators.nonSeparatorCount() === 1) {
                return varList.members[0];
            }
            else {
                var result = new Block(varList, /*isStatementBlock:*/ false);
                this.setSpan(result, start, node);

                return result;
            }
        }

        private visitVariableDeclaration(node: VariableDeclarationSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;

            var preComments = this.convertNodeLeadingComments(node, start);
            var postComments = this.convertNodeTrailingComments(node, start);

            this.moveTo(node, node.variableDeclarators);
            var variableDecls = this.visitSeparatedSyntaxList(node.variableDeclarators);

            for (var i = 0; i < variableDecls.members.length; i++) {
                if (i === 0) {
                    variableDecls.members[i].preComments = preComments;
                    variableDecls.members[i].postComments = postComments;
                }
            }

            if (variableDecls.members.length === 1) {
                return variableDecls.members[0];
            }

            return variableDecls;
        }

        private visitVariableDeclarator(node: VariableDeclaratorSyntax): VarDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
            this.movePast(node.identifier);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
            var init = node.equalsValueClause ? node.equalsValueClause.accept(this) : null;

            var result = new VarDecl(name);
            this.setSpan(result, start, node);

            result.typeExpr = typeExpr;
            result.init = init;
            if (init && init.nodeType === NodeType.FunctionDeclaration) {
                var funcDecl = <FunctionDeclaration>init;
                funcDecl.hint = name.actualText;
            }

            // TODO: more flags

            return result;
        }

        private visitEqualsValueClause(node: EqualsValueClauseSyntax): AST {
            this.assertElementAtPosition(node);

            this.previousTokenTrailingComments = this.convertTokenTrailingComments(node.equalsToken,
                this.position + node.equalsToken.leadingTriviaWidth() + node.equalsToken.width());

            this.movePast(node.equalsToken);
            var result = node.value.accept(this);

            this.previousTokenTrailingComments = null;
            return result;
        }

        private getUnaryExpressionNodeType(kind: SyntaxKind): NodeType {
            switch (kind) {
                case SyntaxKind.PlusExpression: return NodeType.PlusExpression;
                case SyntaxKind.NegateExpression: return NodeType.NegateExpression;
                case SyntaxKind.BitwiseNotExpression: return NodeType.Not;
                case SyntaxKind.LogicalNotExpression: return NodeType.LogNot;
                case SyntaxKind.PreIncrementExpression: return NodeType.IncPre;
                case SyntaxKind.PreDecrementExpression: return NodeType.DecPre;
                default:
                    throw Errors.invalidOperation();
            }
        }

        private visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.operatorToken);
                var operand = node.operand.accept(this);

                result = new UnaryExpression(this.getUnaryExpressionNodeType(node.kind()), operand);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.openBracketToken);
                var expressions = this.visitSeparatedSyntaxList(node.expressions);
                this.movePast(node.closeBracketToken);

                if (node.expressions.childCount() > 0 && node.expressions.childAt(node.expressions.childCount() - 1).kind() === SyntaxKind.CommaToken) {
                    expressions.append(new AST(NodeType.EmptyExpr));
                }

                result = new UnaryExpression(NodeType.ArrayLiteralExpression, expressions);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitOmittedExpression(node: OmittedExpressionSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: AST = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                result = new AST(NodeType.EmptyExpr);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): ParenthesizedExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ParenthesizedExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {

                this.movePast(node.openParenToken);
                var expr = node.expression.accept(this);
                this.movePast(node.closeParenToken);

                result = new ParenthesizedExpression(expr);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private getArrowFunctionStatements(body: ISyntaxNodeOrToken): Block {
            if (body.kind() === SyntaxKind.Block) {
                return body.accept(this);
            }
            else {
                var statements = new ASTList();
                statements.append(new ReturnStatement(body.accept(this)));

                return new Block(statements, /*isStatementBlock:*/ true);
            }
        }

        private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                this.movePast(node.equalsGreaterThanToken);

                var parameters = new ASTList();

                var parameter = new ArgDecl(identifier);
                this.setSpanExplicit(parameter, identifier.minChar, identifier.limChar);

                parameters.append(parameter);

                var statements = this.getArrowFunctionStatements(node.body);

                result = new FunctionDeclaration(null, statements, /*isConstructor:*/ false, null, parameters, NodeType.FunctionDeclaration);

                result.returnTypeAnnotation = null;
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFunctionExpression);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFatArrowFunction);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
                var parameters = node.callSignature.parameterList.accept(this);
                var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;
                this.movePast(node.equalsGreaterThanToken);

                var block = this.getArrowFunctionStatements(node.body);

                result = new FunctionDeclaration(null, block, /*isConstructor:*/ false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.returnTypeAnnotation = returnType;
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFunctionExpression);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFatArrowFunction);
                result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitType(type: ITypeSyntax): AST {
            this.assertElementAtPosition(type);

            if (type.isToken()) {
                var start = this.position;
                var result = new TypeReference(type.accept(this), 0);
                this.setSpan(result, start, type);

                return result;
            }
            else {
                return type.accept(this);
            }
        }

        private visitQualifiedName(node: QualifiedNameSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeReference = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {

                var left = this.visitType(node.left);
                this.movePast(node.dotToken);
                var right = this.identifierFromToken(node.right, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.right);

                if (left.nodeType === NodeType.TypeRef) {
                    left = (<TypeReference>left).term;
                }

                var term = new BinaryExpression(NodeType.Dot, left, right);
                this.setSpan(term, start, node);

                result = new TypeReference(term, 0);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitTypeArgumentList(node: TypeArgumentListSyntax): ASTList {
            this.assertElementAtPosition(node);

            var result = new ASTList();

            this.movePast(node.lessThanToken);
            for (var i = 0, n = node.typeArguments.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(node.typeArguments.childAt(i));
                }
                else {
                    result.append(this.visitType(node.typeArguments.childAt(i)));
                }
            }
            this.movePast(node.greaterThanToken);

            return result;
        }

        private visitConstructorType(node: ConstructorTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeReference = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.newKeyword);
                var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
                var parameters = node.parameterList.accept(this);
                this.movePast(node.equalsGreaterThanToken);
                var returnType = node.type ? this.visitType(node.type) : null;

                var funcDecl = new FunctionDeclaration(null, null, false, typeParameters, parameters, NodeType.FunctionDeclaration);
                this.setSpan(funcDecl, start, node);

                funcDecl.returnTypeAnnotation = returnType;
                funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.Signature);
                funcDecl.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);

                funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.ConstructMember);
                funcDecl.setFlags(funcDecl.getFlags() | ASTFlags.TypeReference);
                funcDecl.hint = "_construct";
                funcDecl.classDecl = null;

                result = new TypeReference(funcDecl, 0);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitFunctionType(node: FunctionTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeReference = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
                var parameters = node.parameterList.accept(this);
                this.movePast(node.equalsGreaterThanToken);
                var returnType = node.type ? this.visitType(node.type) : null;

                var funcDecl = new FunctionDeclaration(null, null, false, typeParameters, parameters, NodeType.FunctionDeclaration);
                this.setSpan(funcDecl, start, node);

                funcDecl.returnTypeAnnotation = returnType;
                // funcDecl.variableArgList = variableArgList;
                funcDecl.setFlags(funcDecl.getFunctionFlags() | FunctionFlags.Signature);
                funcDecl.setFlags(funcDecl.getFlags() | ASTFlags.TypeReference);
                funcDecl.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);

                result = new TypeReference(funcDecl, 0);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitObjectType(node: ObjectTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeReference = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.openBraceToken);
                var typeMembers = this.visitSeparatedSyntaxList(node.typeMembers);
                this.movePast(node.closeBraceToken);

                var interfaceDecl = new InterfaceDeclaration(
                    new Identifier("__anonymous"), null, typeMembers, null, null);
                this.setSpan(interfaceDecl, start, node);

                interfaceDecl.setFlags(interfaceDecl.getFlags() | ASTFlags.TypeReference);

                result = new TypeReference(interfaceDecl, 0);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitArrayType(node: ArrayTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeReference = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var underlying = this.visitType(node.type);
                this.movePast(node.openBracketToken);
                this.movePast(node.closeBracketToken);

                if (underlying.nodeType === NodeType.TypeRef) {
                    result = <TypeReference>underlying;
                    result.arrayCount++;
                }
                else {
                    result = new TypeReference(underlying, 1);
                }

                result.setFlags(result.getFlags() | ASTFlags.TypeReference);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitGenericType(node: GenericTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeReference = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var underlying = this.visitType(node.name);
                var typeArguments = node.typeArgumentList.accept(this);

                if (underlying.nodeType === NodeType.TypeRef) {
                    underlying = (<TypeReference>underlying).term;
                }

                var genericType = new GenericType(underlying, typeArguments);
                this.setSpan(genericType, start, node);

                genericType.setFlags(genericType.getFlags() | ASTFlags.TypeReference);

                result = new TypeReference(genericType, 0);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitTypeAnnotation(node: TypeAnnotationSyntax): AST {
            this.assertElementAtPosition(node);

            this.movePast(node.colonToken);
            return this.visitType(node.type);
        }

        private visitBlock(node: BlockSyntax): Block {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: Block = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.openBraceToken);
                var statements = this.visitSyntaxList(node.statements);
                this.movePast(node.closeBraceToken);

                result = new Block(statements, /*isStatementBlock:*/ true);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitParameter(node: ParameterSyntax): ArgDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ArgDecl = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.identifier);
                var identifier = this.identifierFromToken(node.identifier, !!node.questionToken, /*useValueText:*/ true);
                this.movePast(node.identifier);
                this.movePast(node.questionToken);
                var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
                var init = node.equalsValueClause ? node.equalsValueClause.accept(this) : null;

                result = new ArgDecl(identifier);

                result.preComments = preComments;
                result.postComments = postComments;
                result.isOptional = !!node.questionToken;
                result.init = init;
                result.typeExpr = typeExpr;

                if (node.publicOrPrivateKeyword) {
                    result.setVarFlags(result.getVarFlags() | VariableFlags.Property);

                    if (node.publicOrPrivateKeyword.kind() === SyntaxKind.PublicKeyword) {
                        result.setVarFlags(result.getVarFlags() | VariableFlags.Public);
                    }
                    else {
                        result.setVarFlags(result.getVarFlags() | VariableFlags.Private);
                    }
                }

                if (node.equalsValueClause || node.dotDotDotToken) {
                    result.setFlags(result.getFlags() | ASTFlags.OptionalName);
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitMemberAccessExpression(node: MemberAccessExpressionSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: BinaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var expression: AST = node.expression.accept(this);
                this.movePast(node.dotToken);
                var name = this.identifierFromToken(node.name, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.name);

                result = new BinaryExpression(NodeType.Dot, expression, name);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var operand = node.operand.accept(this);
                this.movePast(node.operatorToken);

                result = new UnaryExpression(node.kind() === SyntaxKind.PostIncrementExpression ? NodeType.IncPost : NodeType.DecPost, operand);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitElementAccessExpression(node: ElementAccessExpressionSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: BinaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var expression = node.expression.accept(this);
                this.movePast(node.openBracketToken);
                var argumentExpression = node.argumentExpression.accept(this);
                this.movePast(node.closeBracketToken);

                result = new BinaryExpression(NodeType.Index, expression, argumentExpression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private convertArgumentListArguments(node: ArgumentListSyntax): ASTList {
            if (node === null) {
                return null;
            }

            this.movePast(node.openParenToken);
            var result = this.visitSeparatedSyntaxList(node.arguments);
            this.movePast(node.closeParenToken);
            return result;
        }

        private visitInvocationExpression(node: InvocationExpressionSyntax): CallExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: CallExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var expression = node.expression.accept(this);
                var typeArguments = node.argumentList.typeArgumentList !== null
                    ? node.argumentList.typeArgumentList.accept(this)
                    : null;
                var argumentList = this.convertArgumentListArguments(node.argumentList);

                result = new CallExpression(NodeType.Call, expression, typeArguments, argumentList);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitArgumentList(node: ArgumentListSyntax): ASTList {
            // Processing argument lists should be handled from inside visitInvocationExpression or 
            // visitObjectCreationExpression.
            throw Errors.invalidOperation();
        }

        private getBinaryExpressionNodeType(node: BinaryExpressionSyntax): NodeType {
            switch (node.kind()) {
                case SyntaxKind.CommaExpression: return NodeType.CommaExpression;
                case SyntaxKind.AssignmentExpression: return NodeType.Asg;
                case SyntaxKind.AddAssignmentExpression: return NodeType.AsgAdd;
                case SyntaxKind.SubtractAssignmentExpression: return NodeType.AsgSub;
                case SyntaxKind.MultiplyAssignmentExpression: return NodeType.AsgMul;
                case SyntaxKind.DivideAssignmentExpression: return NodeType.AsgDiv;
                case SyntaxKind.ModuloAssignmentExpression: return NodeType.AsgMod;
                case SyntaxKind.AndAssignmentExpression: return NodeType.AsgAnd;
                case SyntaxKind.ExclusiveOrAssignmentExpression: return NodeType.AsgXor;
                case SyntaxKind.OrAssignmentExpression: return NodeType.AsgOr;
                case SyntaxKind.LeftShiftAssignmentExpression: return NodeType.AsgLsh;
                case SyntaxKind.SignedRightShiftAssignmentExpression: return NodeType.AsgRsh;
                case SyntaxKind.UnsignedRightShiftAssignmentExpression: return NodeType.AsgRs2;
                case SyntaxKind.LogicalOrExpression: return NodeType.LogOr;
                case SyntaxKind.LogicalAndExpression: return NodeType.LogAnd;
                case SyntaxKind.BitwiseOrExpression: return NodeType.Or;
                case SyntaxKind.BitwiseExclusiveOrExpression: return NodeType.Xor;
                case SyntaxKind.BitwiseAndExpression: return NodeType.And;
                case SyntaxKind.EqualsWithTypeConversionExpression: return NodeType.Eq;
                case SyntaxKind.NotEqualsWithTypeConversionExpression: return NodeType.Ne;
                case SyntaxKind.EqualsExpression: return NodeType.Eqv;
                case SyntaxKind.NotEqualsExpression: return NodeType.NEqv;
                case SyntaxKind.LessThanExpression: return NodeType.Lt;
                case SyntaxKind.GreaterThanExpression: return NodeType.Gt;
                case SyntaxKind.LessThanOrEqualExpression: return NodeType.Le;
                case SyntaxKind.GreaterThanOrEqualExpression: return NodeType.Ge;
                case SyntaxKind.InstanceOfExpression: return NodeType.InstOf;
                case SyntaxKind.InExpression: return NodeType.In;
                case SyntaxKind.LeftShiftExpression: return NodeType.Lsh;
                case SyntaxKind.SignedRightShiftExpression: return NodeType.Rsh;
                case SyntaxKind.UnsignedRightShiftExpression: return NodeType.Rs2;
                case SyntaxKind.MultiplyExpression: return NodeType.Mul;
                case SyntaxKind.DivideExpression: return NodeType.Div;
                case SyntaxKind.ModuloExpression: return NodeType.Mod;
                case SyntaxKind.AddExpression: return NodeType.Add;
                case SyntaxKind.SubtractExpression: return NodeType.Sub;
            }

            throw Errors.invalidOperation();
        }

        private visitBinaryExpression(node: BinaryExpressionSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: BinaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var nodeType = this.getBinaryExpressionNodeType(node);
                var left = node.left.accept(this);
                this.movePast(node.operatorToken);
                var right = node.right.accept(this);

                result = new BinaryExpression(nodeType, left, right);

                if (right.nodeType === NodeType.FunctionDeclaration) {
                    var id = left.nodeType === NodeType.Dot ? (<BinaryExpression>left).operand2 : left;
                    var idHint: string = id.nodeType === NodeType.Name ? id.actualText : null;

                    var funcDecl = <FunctionDeclaration>right;
                    funcDecl.hint = idHint;
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitConditionalExpression(node: ConditionalExpressionSyntax): ConditionalExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ConditionalExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var condition = node.condition.accept(this);
                this.movePast(node.questionToken);
                var whenTrue = node.whenTrue.accept(this);
                this.movePast(node.colonToken);
                var whenFalse = node.whenFalse.accept(this)

                result = new ConditionalExpression(condition, whenTrue, whenFalse);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitConstructSignature(node: ConstructSignatureSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                this.movePast(node.newKeyword);
                var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
                var parameters = node.callSignature.parameterList.accept(this);
                var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;

                result = new FunctionDeclaration(null, null, /*isConstructor:*/ false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.returnTypeAnnotation = returnType;

                result.hint = "_construct";
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.ConstructMember);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
                result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitMethodSignature(node: MethodSignatureSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                var name = this.identifierFromToken(node.propertyName, !!node.questionToken, /*useValueText:*/ true);
                this.movePast(node.propertyName);
                this.movePast(node.questionToken);

                var typeParameters = node.callSignature.typeParameterList ? node.callSignature.typeParameterList.accept(this) : null;
                var parameters = node.callSignature.parameterList.accept(this);
                var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;

                result = new FunctionDeclaration(name, null, false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
                result.returnTypeAnnotation = returnType;
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitIndexSignature(node: IndexSignatureSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                this.movePast(node.openBracketToken);

                var parameter = node.parameter.accept(this);

                this.movePast(node.closeBracketToken);
                var returnType = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

                var name = new Identifier("__item");
                this.setSpanExplicit(name, start, start);   // 0 length name.

                var parameters = new ASTList();
                parameters.append(parameter);

                result = new FunctionDeclaration(name, null, /*isConstructor:*/ false, null, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.variableArgList = false;
                result.returnTypeAnnotation = returnType;

                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IndexerMember);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitPropertySignature(node: PropertySignatureSyntax): VarDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: VarDecl = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                var name = this.identifierFromToken(node.propertyName, !!node.questionToken, /*useValueText:*/ true);
                this.movePast(node.propertyName);
                this.movePast(node.questionToken);
                var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

                result = new VarDecl(name);

                result.preComments = preComments;
                result.typeExpr = typeExpr;
                result.setVarFlags(result.getVarFlags() | VariableFlags.Property);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitParameterList(node: ParameterListSyntax): ASTList {
            this.assertElementAtPosition(node);

            var start = this.position;

            var openParenToken = node.openParenToken;
            this.previousTokenTrailingComments = this.convertTokenTrailingComments(
                openParenToken, start + openParenToken.leadingTriviaWidth() + openParenToken.width());

            this.movePast(node.openParenToken);
            var result = this.visitSeparatedSyntaxList(node.parameters);
            this.movePast(node.closeParenToken);

            return result;
        }

        private visitCallSignature(node: CallSignatureSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
                var parameters = node.parameterList.accept(this);
                var returnType = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

                result = new FunctionDeclaration(null, null, /*isConstructor:*/ false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);
                result.returnTypeAnnotation = returnType;

                result.hint = "_call";
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.CallMember);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitTypeParameterList(node: TypeParameterListSyntax): ASTList {
            this.assertElementAtPosition(node);

            this.movePast(node.lessThanToken);
            var result = this.visitSeparatedSyntaxList(node.typeParameters);
            this.movePast(node.greaterThanToken);

            return result;
        }

        private visitTypeParameter(node: TypeParameterSyntax): TypeParameter {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TypeParameter = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                var constraint = node.constraint ? node.constraint.accept(this) : null;

                result = new TypeParameter(identifier, constraint);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitConstraint(node: ConstraintSyntax): any {
            this.assertElementAtPosition(node);

            this.movePast(node.extendsKeyword);
            return this.visitType(node.type);
        }

        private visitIfStatement(node: IfStatementSyntax): IfStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: IfStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.moveTo(node, node.condition);
                var condition = node.condition.accept(this);
                this.movePast(node.closeParenToken);
                var thenBod = node.statement.accept(this);
                var elseBod = node.elseClause ? node.elseClause.accept(this) : null;

                result = new IfStatement(condition, thenBod, elseBod);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitElseClause(node: ElseClauseSyntax): Statement {
            this.assertElementAtPosition(node);

            this.movePast(node.elseKeyword);
            return node.statement.accept(this);
        }

        private visitExpressionStatement(node: ExpressionStatementSyntax): ExpressionStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ExpressionStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                var expression = node.expression.accept(this);
                this.movePast(node.semicolonToken);

                result = new ExpressionStatement(expression);
                result.preComments = preComments;
                result.postComments = postComments;
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitConstructorDeclaration(node: ConstructorDeclarationSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.parameterList);
                var parameters = node.parameterList.accept(this);

                var block = node.block ? node.block.accept(this) : null;
                this.movePast(node.semicolonToken);

                result = new FunctionDeclaration(null, block, /*isConstructor:*/ true, null, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.postComments = postComments;
                result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);

                if (node.semicolonToken) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
                }

                // REVIEW: Should we have a separate flag for class constructors?  (Constructors are not methods)
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.ClassMethod);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.propertyName);
                var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false, /*useValueText:*/ true);

                this.movePast(node.propertyName);

                var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
                var parameters = node.callSignature.parameterList.accept(this);
                var returnType = node.callSignature.typeAnnotation
                    ? node.callSignature.typeAnnotation.accept(this)
                    : null;

                var block = node.block ? node.block.accept(this) : null;
                this.movePast(node.semicolonToken);

                result = new FunctionDeclaration(name, block, /*isConstructor:*/ false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.postComments = postComments;
                result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
                result.returnTypeAnnotation = returnType;

                if (node.semicolonToken) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Signature);
                }

                if (this.containsToken(node.modifiers, SyntaxKind.PrivateKeyword)) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Private);
                }
                else {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Public);
                }

                if (this.containsToken(node.modifiers, SyntaxKind.StaticKeyword)) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Static);
                }

                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitMemberAccessorDeclaration(node: MemberAccessorDeclarationSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.propertyName);
                var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.propertyName);
                var parameters = node.parameterList.accept(this);
                var returnType = typeAnnotation ? typeAnnotation.accept(this) : null;

                var block = node.block ? node.block.accept(this) : null;
                result = new FunctionDeclaration(name, block, /*isConstructor:*/ false, null, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.postComments = postComments;
                result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);
                result.returnTypeAnnotation = returnType;

                if (this.containsToken(node.modifiers, SyntaxKind.PrivateKeyword)) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Private);
                }
                else {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Public);
                }

                if (this.containsToken(node.modifiers, SyntaxKind.StaticKeyword)) {
                    result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Static);
                }

                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.Method);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var result = this.visitMemberAccessorDeclaration(node, node.typeAnnotation);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.GetAccessor);
            result.hint = "get" + result.name.actualText;

            return result;
        }

        private visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var result = this.visitMemberAccessorDeclaration(node, null);

            result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.SetAccessor);
            result.hint = "set" + result.name.actualText;

            return result;
        }

        private visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): VarDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: VarDecl = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);
                var postComments = this.convertNodeTrailingComments(node, start);

                this.moveTo(node, node.variableDeclarator);
                this.moveTo(node.variableDeclarator, node.variableDeclarator.identifier);

                var name = this.identifierFromToken(node.variableDeclarator.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.variableDeclarator.identifier);
                var typeExpr = node.variableDeclarator.typeAnnotation ? node.variableDeclarator.typeAnnotation.accept(this) : null;
                var init = node.variableDeclarator.equalsValueClause ? node.variableDeclarator.equalsValueClause.accept(this) : null;
                this.movePast(node.semicolonToken);

                result = new VarDecl(name);

                result.preComments = preComments;
                result.postComments = postComments;
                result.typeExpr = typeExpr;
                result.init = init;

                if (this.containsToken(node.modifiers, SyntaxKind.StaticKeyword)) {
                    result.setVarFlags(result.getVarFlags() | VariableFlags.Static);
                }

                if (this.containsToken(node.modifiers, SyntaxKind.PrivateKeyword)) {
                    result.setVarFlags(result.getVarFlags() | VariableFlags.Private);
                }
                else {
                    result.setVarFlags(result.getVarFlags() | VariableFlags.Public);
                }

                result.setVarFlags(result.getVarFlags() | VariableFlags.ClassProperty);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitThrowStatement(node: ThrowStatementSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.throwKeyword);
                var expression = node.expression.accept(this);
                this.movePast(node.semicolonToken);

                result = new UnaryExpression(NodeType.ThrowStatement, expression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitReturnStatement(node: ReturnStatementSyntax): ReturnStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ReturnStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.returnKeyword);
                var expression = node.expression ? node.expression.accept(this) : null;
                this.movePast(node.semicolonToken);

                result = new ReturnStatement(expression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): CallExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: CallExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.newKeyword);
                var expression = node.expression.accept(this);
                var typeArgumentList = node.argumentList === null || node.argumentList.typeArgumentList === null ? null : node.argumentList.typeArgumentList.accept(this);
                var argumentList = this.convertArgumentListArguments(node.argumentList);

                result = new CallExpression(NodeType.New, expression, typeArgumentList, argumentList);

                if (expression.nodeType === NodeType.TypeRef) {
                    var typeRef = <TypeReference>expression;

                    if (typeRef.arrayCount === 0) {
                        var term = typeRef.term;
                        if (term.nodeType === NodeType.Dot || term.nodeType === NodeType.Name) {
                            expression = term;
                        }
                    }
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitSwitchStatement(node: SwitchStatementSyntax): SwitchStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: SwitchStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.switchKeyword);
                this.movePast(node.openParenToken);
                var expression = node.expression.accept(this);
                this.movePast(node.closeParenToken);
                var closeParenPosition = this.position;
                this.movePast(node.openBraceToken);

                result = new SwitchStatement(expression);

                result.statement.minChar = start;
                result.statement.limChar = closeParenPosition;

                result.caseList = new ASTList()

                for (var i = 0, n = node.switchClauses.childCount(); i < n; i++) {
                    var switchClause = node.switchClauses.childAt(i);
                    var translated = switchClause.accept(this);

                    if (switchClause.kind() === SyntaxKind.DefaultSwitchClause) {
                        result.defaultCase = translated;
                    }

                    result.caseList.append(translated);
                }

                this.movePast(node.closeBraceToken);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitCaseSwitchClause(node: CaseSwitchClauseSyntax): CaseClause {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: CaseClause = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.caseKeyword);
                var expression = node.expression.accept(this);
                this.movePast(node.colonToken);
                var statements = this.visitSyntaxList(node.statements);

                result = new CaseClause();

                result.expr = expression;
                result.body = statements;
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): CaseClause {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: CaseClause = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.defaultKeyword);
                this.movePast(node.colonToken);
                var statements = this.visitSyntaxList(node.statements);

                result = new CaseClause();
                result.body = statements;
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitBreakStatement(node: BreakStatementSyntax): Jump {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: Jump = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.breakKeyword);
                this.movePast(node.identifier);
                this.movePast(node.semicolonToken);

                result = new Jump(NodeType.BreakStatement);

                if (node.identifier !== null) {
                    result.target = node.identifier.valueText();
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitContinueStatement(node: ContinueStatementSyntax): Jump {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: Jump = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.continueKeyword);
                this.movePast(node.identifier);
                this.movePast(node.semicolonToken);

                result = new Jump(NodeType.ContinueStatement);

                if (node.identifier !== null) {
                    result.target = node.identifier.valueText();
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitForStatement(node: ForStatementSyntax): ForStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ForStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.forKeyword);
                this.movePast(node.openParenToken);
                var init = node.variableDeclaration
                    ? node.variableDeclaration.accept(this)
                    : node.initializer
                        ? node.initializer.accept(this)
                        : null;
                this.movePast(node.firstSemicolonToken);
                var cond = node.condition ? node.condition.accept(this) : null;
                this.movePast(node.secondSemicolonToken);
                var incr = node.incrementor ? node.incrementor.accept(this) : null;
                this.movePast(node.closeParenToken);
                var body = node.statement.accept(this);

                result = new ForStatement(init, cond, incr, body);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitForInStatement(node: ForInStatementSyntax): ForInStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: ForInStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.forKeyword);
                this.movePast(node.openParenToken);
                var init = node.variableDeclaration ? node.variableDeclaration.accept(this) : node.left.accept(this);
                this.movePast(node.inKeyword);
                var expression = node.expression.accept(this);
                this.movePast(node.closeParenToken);
                var body = node.statement.accept(this);

                result = new ForInStatement(init, expression, body);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitWhileStatement(node: WhileStatementSyntax): WhileStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: WhileStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.moveTo(node, node.condition);
                var condition = node.condition.accept(this);
                this.movePast(node.closeParenToken);
                var statement = node.statement.accept(this);

                result = new WhileStatement(condition, statement);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitWithStatement(node: WithStatementSyntax): WithStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: WithStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.moveTo(node, node.condition);
                var condition = node.condition.accept(this);
                this.movePast(node.closeParenToken);
                var statement = node.statement.accept(this);

                result = new WithStatement(condition, statement);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitCastExpression(node: CastExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.lessThanToken);
                var castTerm = this.visitType(node.type);
                this.movePast(node.greaterThanToken);
                var expression = node.expression.accept(this);

                result = new UnaryExpression(NodeType.CastExpression, expression);
                result.castTerm = castTerm;
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.openBraceToken);
                var propertyAssignments = this.visitSeparatedSyntaxList(node.propertyAssignments);
                this.movePast(node.closeBraceToken);

                result = new UnaryExpression(NodeType.ObjectLiteralExpression, propertyAssignments);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: BinaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                var left = node.propertyName.accept(this);

                this.previousTokenTrailingComments = this.convertTokenTrailingComments(
                    node.colonToken, this.position + node.colonToken.leadingTriviaWidth() + node.colonToken.width());

                this.movePast(node.colonToken);
                var right = node.expression.accept(this);

                result = new BinaryExpression(NodeType.Member, left, right);
                result.preComments = preComments;

                if (right.nodeType === NodeType.FunctionDeclaration) {
                    var funcDecl = <FunctionDeclaration>right;
                    funcDecl.hint = left.text;
                }
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: BinaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.moveTo(node, node.propertyName);
                var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.propertyName);
                this.movePast(node.openParenToken);
                this.movePast(node.closeParenToken);
                var returnType = node.typeAnnotation
                    ? node.typeAnnotation.accept(this)
                    : null;

                var block = node.block ? node.block.accept(this) : null;

                var funcDecl = new FunctionDeclaration(name, block, /*isConstructor:*/ false, null, new ASTList(), NodeType.FunctionDeclaration);
                this.setSpan(funcDecl, start, node);

                funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.GetAccessor);
                funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.IsFunctionExpression);
                funcDecl.hint = "get" + node.propertyName.valueText();
                funcDecl.returnTypeAnnotation = returnType;

                result = new BinaryExpression(NodeType.Member, name, funcDecl);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: BinaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.moveTo(node, node.propertyName);
                var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.propertyName);
                this.movePast(node.openParenToken);
                var parameter = node.parameter.accept(this);
                this.movePast(node.closeParenToken);

                var parameters = new ASTList();
                parameters.append(parameter);

                var block = node.block ? node.block.accept(this) : null;

                var funcDecl = new FunctionDeclaration(name, block, /*isConstructor:*/ false, null, parameters, NodeType.FunctionDeclaration);
                this.setSpan(funcDecl, start, node);

                funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.SetAccessor);
                funcDecl.setFunctionFlags(funcDecl.getFunctionFlags() | FunctionFlags.IsFunctionExpression);
                funcDecl.hint = "set" + node.propertyName.valueText();

                result = new BinaryExpression(NodeType.Member, name, funcDecl);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitFunctionExpression(node: FunctionExpressionSyntax): FunctionDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: FunctionDeclaration = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var preComments = this.convertNodeLeadingComments(node, start);

                this.movePast(node.functionKeyword);
                var name = node.identifier === null ? null : this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
                var parameters = node.callSignature.parameterList.accept(this);
                var returnType = node.callSignature.typeAnnotation
                    ? node.callSignature.typeAnnotation.accept(this)
                    : null;

                var block = node.block ? node.block.accept(this) : null;
                if (node.block) {
                    if (this.hasUseStrictDirective(node.block.statements)) {
                        block.setFlags(block.getFlags() | ASTFlags.StrictMode);
                    }
                }

                result = new FunctionDeclaration(name, block, false, typeParameters, parameters, NodeType.FunctionDeclaration);

                result.preComments = preComments;
                result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
                result.returnTypeAnnotation = returnType;
                result.setFunctionFlags(result.getFunctionFlags() | FunctionFlags.IsFunctionExpression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitEmptyStatement(node: EmptyStatementSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: AST = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.semicolonToken);

                result = new AST(NodeType.Empty);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitTryStatement(node: TryStatementSyntax): TryStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: TryStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.tryKeyword);
                var tryBody = node.block.accept(this);

                // var tryPart: AST = new Try(block);
                // this.setSpanExplicit(tryPart, start, this.position);

                var catchClause: CatchClause = null;
                if (node.catchClause !== null) {
                    catchClause = node.catchClause.accept(this);
                }

                var finallyBody: AST = null;
                if (node.finallyClause !== null) {
                    finallyBody = node.finallyClause.accept(this);
                }

                result = new TryStatement(tryBody, catchClause, finallyBody);
            }

            Debug.assert(result !== null);
            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitCatchClause(node: CatchClauseSyntax): CatchClause {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: CatchClause = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.catchKeyword);
                this.movePast(node.openParenToken);
                var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
                this.movePast(node.closeParenToken);
                var block = node.block.accept(this);

                var varDecl = new VarDecl(identifier);
                this.setSpanExplicit(varDecl, identifier.minChar, identifier.limChar);

                varDecl.typeExpr = typeExpr;

                result = new CatchClause(varDecl, block);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitFinallyClause(node: FinallyClauseSyntax): AST {
            this.movePast(node.finallyKeyword);
            return node.block.accept(this);
        }

        private visitLabeledStatement(node: LabeledStatementSyntax): LabeledStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: LabeledStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false, /*useValueText:*/ true);
                this.movePast(node.identifier);
                this.movePast(node.colonToken);
                var statement = node.statement.accept(this);

                result = new LabeledStatement(identifier, statement);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitDoStatement(node: DoStatementSyntax): DoWhileStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: DoWhileStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.doKeyword);
                var statement = node.statement.accept(this);
                var whileSpan = new ASTSpan();
                this.setSpan1(whileSpan, this.position, node.whileKeyword);

                this.movePast(node.whileKeyword);
                this.movePast(node.openParenToken);
                var condition = node.condition.accept(this);
                this.movePast(node.closeParenToken);
                this.movePast(node.semicolonToken);

                result = new DoWhileStatement(statement, condition);
                result.whileSpan = whileSpan;
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitTypeOfExpression(node: TypeOfExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.typeOfKeyword);
                var expression = node.expression.accept(this);

                result = new UnaryExpression(NodeType.Typeof, expression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitDeleteExpression(node: DeleteExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.deleteKeyword);
                var expression = node.expression.accept(this);

                result = new UnaryExpression(NodeType.DeleteExpression, expression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitVoidExpression(node: VoidExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: UnaryExpression = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.voidKeyword);
                var expression = node.expression.accept(this);

                result = new UnaryExpression(NodeType.VoidExpression, expression);
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }

        private visitDebuggerStatement(node: DebuggerStatementSyntax): DebuggerStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var result: DebuggerStatement = this.getAST(node);
            if (result) {
                this.movePast(node);
            }
            else {
                this.movePast(node.debuggerKeyword);
                this.movePast(node.semicolonToken);

                result = new DebuggerStatement();
            }

            this.setAST(node, result);
            this.setSpan(result, start, node);
            return result;
        }
    }
}