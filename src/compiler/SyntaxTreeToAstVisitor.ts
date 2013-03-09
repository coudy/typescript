/// <reference path='Syntax\SyntaxVisitor.generated.ts' />
/// <reference path='Syntax\SyntaxWalker.generated.ts' />
/// <reference path='Syntax\SyntaxInformationMap.ts' />
/// <reference path='ast.ts' />

module TypeScript {
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
                    if (element.isNode()) {
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

        private nestingLevel = 0;
        private position = 0;

        private varLists: ASTList[] = [];
        private scopeLists: ASTList[] = [];
        private staticsLists: ASTList[] = [];

        private requiresExtendsBlock: bool = false;

        constructor(private syntaxPositionMap: SyntaxPositionMap,
                    private fileName: string,
                    private unitIndex: number,
                    private lineMap: ILineMap) {
        }

        public static visit(syntaxTree: SyntaxTree, fileName: string, unitIndex: number): Script {
            var map = checkPositions ? SyntaxPositionMap.create(syntaxTree.sourceUnit()) : null;
            var visitor = new SyntaxTreeToAstVisitor(map, fileName, unitIndex, syntaxTree.lineMap());
            return syntaxTree.sourceUnit().accept(visitor);
        }

        private assertElementAtPosition(element: ISyntaxElement) {
            if (SyntaxTreeToAstVisitor.checkPositions) {
                Debug.assert(this.position === this.syntaxPositionMap.fullStart(element));
            }
        }

        private movePast(element: ISyntaxToken): void {
            if (element !== null) {
                this.assertElementAtPosition(element);
                this.position += element.fullWidth();
            }
        }

        private moveTo2(element1: ISyntaxNodeOrToken, element2: ISyntaxElement): void {
            if (element2 !== null) {
                this.position += Syntax.childOffset(element1, element2);
            }
        }

        private moveTo3(element1: ISyntaxNodeOrToken, element2: ISyntaxNodeOrToken, element3: ISyntaxNodeOrToken): void {
            this.moveTo2(element1, element2);
            this.moveTo2(element2, element3);
        }

        private setSpan(span: IASTSpan, start: number, end: number): void {
            span.minChar = start;
            span.limChar = end;
        }

        private hasEscapeSequence(token: ISyntaxToken): bool {
            // TODO: implement this.
            return false;
        }

        private valueText(token: ISyntaxToken): string {
            // TODO: handle unicode escapes here.
            return token.text();
        }

        private identifierFromToken(token: ISyntaxToken, isOptional: bool): Identifier {
            this.assertElementAtPosition(token);

            var result: Identifier = null;
            if (token.fullWidth() === 0) {
                result = new MissingIdentifier();
                result.flags |= ASTFlags.Error;
            }
            else {
                result = new Identifier(this.valueText(token), this.hasEscapeSequence(token));
            }

            if (isOptional) {
                result.flags |= ASTFlags.OptionalName;
            }

            this.setSpan(result, this.position, this.position + token.width());
            return result;
        }

        private visitSyntaxList(list: ISyntaxList): ASTList {
            var result = new ASTList();
            var start = this.position;

            for (var i = 0, n = list.childCount(); i < n; i++) {
                result.append(list.childAt(i).accept(this));
            }

            this.setSpan(result, start, this.position);
            return result;
        }

        private visitSeparatedSyntaxList(list: ISeparatedSyntaxList): ASTList {
            var result = new ASTList();
            var start = this.position;

            for (var i = 0, n = list.childCount(); i < n; i++) {
                if (i % 2 === 0) {
                    result.append(list.childAt(i).accept(this));
                }
                else {
                    this.movePast(<ISyntaxToken>list.childAt(i));
                }
            }

            this.setSpan(result, start, this.position);
            return result;
        }

        private createRef(text: string, hasEscapeSequence: bool, minChar: number): Identifier {
            var id = new Identifier(text, hasEscapeSequence);
            id.minChar = minChar;
            return id;
        }

        private pushDeclLists() {
            this.staticsLists.push(new ASTList());
            this.varLists.push(new ASTList());
            this.scopeLists.push(new ASTList());
        }

        private popDeclLists() {
            this.staticsLists.pop();
            this.varLists.pop();
            this.scopeLists.pop();
        }

        private topVarList() {
            return this.varLists[this.varLists.length - 1];
        }

        private topScopeList() {
            return this.scopeLists[this.scopeLists.length - 1];
        }

        private topStaticsList() {
            return this.staticsLists[this.staticsLists.length - 1];
        }

        private convertComment(trivia: ISyntaxTrivia): Comment {
            throw Errors.notYetImplemented();
        }

        private convertComments(triviaList: ISyntaxTriviaList): Comment[] {
            var result: Comment[] = [];

            for (var i = 0, n = triviaList.count(); i < n; i++) {
                var trivia = triviaList.syntaxTriviaAt(i);

                if (trivia.isComment()) {
                    result.push(this.convertComment(trivia));
                }
            }

            return result;
        }

        private convertLeadingComments(token: ISyntaxToken): Comment[] {
            if (!token.hasLeadingComment()) {
                return null;
            }

            return this.convertComments(token.leadingTrivia());
        }

        private convertTrailingComments(token: ISyntaxToken): Comment[] {
            if (!token.hasTrailingComment()) {
                return null;
            }

            return this.convertComments(token.trailingTrivia());
        }

        private visitToken(token: ISyntaxToken): AST {
            this.assertElementAtPosition(token);

            var result: AST = null;

            if (token.kind() === SyntaxKind.ThisKeyword) {
                result = new AST(NodeType.This);
            }
            else if (token.kind() === SyntaxKind.SuperKeyword) {
                result = new AST(NodeType.Super);
            }
            else if (token.kind() === SyntaxKind.TrueKeyword) {
                result = new AST(NodeType.True);
            }
            else if (token.kind() === SyntaxKind.FalseKeyword) {
                result = new AST(NodeType.False);
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
                var value = token.text().indexOf(".") > 0 ? parseFloat(token.text()) : parseInt(token.text());
                result = new NumberLiteral(value, token.text());
            }
            else {
                result = this.identifierFromToken(token, /*isOptional:*/ false);
            }

            this.setSpan(result, this.position, this.position + token.width());
            this.movePast(token);
            return result;
        }

        private hasTopLevelImportOrExport(node: SourceUnitSyntax): bool {
            // TODO: implement this.
            for (var i = 0, n = node.moduleElements.childCount(); i < n; i++) {
                var moduleElement = node.moduleElements.childAt(i);

                var firstToken = moduleElement.firstToken();
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

            var firstToken = node.firstToken();
            if (firstToken.hasLeadingComment()) {
                var leadingTrivia = firstToken.leadingTrivia();
                for (var i = 0, n = leadingTrivia.count(); i < n; i++) {
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

        private visitSourceUnit(node: SourceUnitSyntax): Script {
            this.assertElementAtPosition(node);

            var start = this.position;
            var members;
            this.pushDeclLists();

            var isParsingDeclareFile = isDSTRFile(this.fileName) || isDTSFile(this.fileName);

            var bod = this.visitSyntaxList(node.moduleElements);

            var topLevelMod: ModuleDeclaration = null;
            if (moduleGenTarget != ModuleGenTarget.Local && this.hasTopLevelImportOrExport(node)) {
                var correctedFileName = switchToForwardSlashes(this.fileName);
                var id: Identifier = new Identifier(correctedFileName);
                topLevelMod = new ModuleDeclaration(id, bod, this.topVarList(), null);
                this.setSpan(topLevelMod, start, this.position);

                topLevelMod.modFlags |= ModuleFlags.IsDynamic;
                topLevelMod.modFlags |= ModuleFlags.IsWholeFile;
                topLevelMod.modFlags |= ModuleFlags.Exported;

                if (isParsingDeclareFile) {
                    topLevelMod.modFlags |= ModuleFlags.Ambient;
                }

                topLevelMod.prettyName = getPrettyName(correctedFileName);
                //topLevelMod.containsUnicodeChar = this.scanner.seenUnicodeChar;
                //topLevelMod.containsUnicodeCharInComment = this.scanner.seenUnicodeCharInComment;

                // topLevelMod.amdDependencies = this.amdDependencies;

                bod = new ASTList();
                this.setSpan(bod, start, this.position);
                bod.append(topLevelMod);
            }

            var result = new Script(this.topVarList(), this.topScopeList());
            this.setSpan(result, start, this.position);

            this.popDeclLists();

            result.bod = bod;
            result.locationInfo = new LocationInfo(this.fileName, this.lineMap.lineStarts(), this.unitIndex);
            result.topLevelMod = topLevelMod;
            result.isDeclareFile = isDSTRFile(this.fileName) || isDTSFile(this.fileName);
            result.requiresExtendsBlock = this.requiresExtendsBlock;

            return result;
        }

        private visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any {
            this.assertElementAtPosition(node);
            this.moveTo2(node, node.stringLiteral);
            var result = this.identifierFromToken(node.stringLiteral, /*isOptional:*/ false);
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
            this.moveTo2(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);

            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var extendsList = node.extendsClause ? node.extendsClause.accept(this) : new ASTList();
            var implementsList = node.implementsClause ? node.implementsClause.accept(this) : new ASTList();
            this.movePast(node.openBraceToken);
            var members = this.visitSyntaxList(node.classElements);
            this.movePast(node.closeBraceToken);

            this.requiresExtendsBlock = this.requiresExtendsBlock || !!node.extendsClause;

            var result = new ClassDeclaration(name, typeParameters, members, extendsList, implementsList);
            this.setSpan(result, start, this.position);

            if (node.exportKeyword) {
                result.varFlags |= VarFlags.Exported;
            }

            if (node.declareKeyword) {
                result.varFlags |= VarFlags.Ambient;
            }

            result.varFlags |= VarFlags.Class;

            for (var i = 0; i < members.members.length; i++) {
                var member = members.members[i];
                if (member.nodeType === NodeType.FuncDecl) {
                    var funcDecl = <FuncDecl>member;

                    if (funcDecl.isConstructor) {
                        funcDecl.name = name;
                        funcDecl.returnTypeAnnotation = new TypeReference(name, 0);
                        funcDecl.classDecl = result;

                        result.constructorDecl = funcDecl;
                    }
                }
            }

            var knownMemberNames: any = {};
            for (var i = 0, n = node.classElements.childCount(); i < n; i++) {
                var classElement = <IClassElementSyntax>node.classElements.childAt(i);

                if (classElement.kind() === SyntaxKind.MemberVariableDeclaration) {
                    var variableDeclaration = <MemberVariableDeclarationSyntax>classElement;
                    knownMemberNames[this.valueText(variableDeclaration.variableDeclarator.identifier)] = true;
                }
                else if (classElement.kind() === SyntaxKind.MemberFunctionDeclaration) {
                    var functionDeclaration = <MemberFunctionDeclarationSyntax>classElement;
                    knownMemberNames[this.valueText(functionDeclaration.functionSignature.identifier)] = true;
                }
            }

            result.knownMemberNames = knownMemberNames;

            return result;
        }

        private visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): InterfaceDeclaration {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var extendsList = node.extendsClause ? node.extendsClause.accept(this) : null;
            this.movePast(node.body.openBraceToken);
            var members = this.visitSeparatedSyntaxList(node.body.typeMembers);

            // Fix up interface method flags
            if (members.members) {
                for (var i = 0; i < members.members.length; i++) {
                    if (members.members[i].nodeType == NodeType.FuncDecl) {
                        (<FuncDecl>members.members[i]).fncFlags |= FncFlags.Method;
                        (<FuncDecl>members.members[i]).fncFlags |= FncFlags.Signature;
                    }
                }
            }

            this.movePast(node.body.closeBraceToken);

            var result = new InterfaceDeclaration(name, typeParameters, members, extendsList, null);
            this.setSpan(result, start, this.position);

            //if (node.publicOrPrivateKeyword) {
            //    result.varFlags |= VarFlags.Private;
            //}
            //if (hasFlag(modifiers, Modifiers.Public)) {
            //    result.varFlags |= VarFlags.Public;
            //}
            if (node.exportKeyword) {
                result.varFlags |= VarFlags.Exported;
            }

            return result;
        }

        private visitExtendsClause(node: ExtendsClauseSyntax): ASTList {
            this.assertElementAtPosition(node);

            var result = new ASTList();

            this.movePast(node.extendsKeyword);
            for (var i = 0, n = node.typeNames.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(<ISyntaxToken>node.typeNames.childAt(i));
                }
                else {
                    var type = this.visitType(node.typeNames.childAt(i));
                    if (type.nodeType === NodeType.TypeRef) {
                        type = (<TypeReference>type).term;
                    }

                    result.append(type);
                }
            }

            return result;
        }

        private visitImplementsClause(node: ImplementsClauseSyntax): ASTList {
            this.assertElementAtPosition(node);

            var result = new ASTList();

            this.movePast(node.implementsKeyword);
            for (var i = 0, n = node.typeNames.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(<ISyntaxToken>node.typeNames.childAt(i));
                }
                else {
                    var type = this.visitType(node.typeNames.childAt(i));
                    if (type.nodeType === NodeType.TypeRef) {
                        type = (<TypeReference>type).term;
                    }

                    result.append(type);
                }
            }

            return result;
        }

        private getModuleNames(node: ModuleDeclarationSyntax): Identifier[] {
            var result: Identifier[] = [];

            if (node.stringLiteral !== null) {
                result.push(this.identifierFromToken(node.stringLiteral, /*isOptional:*/false));
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
                result.push(this.identifierFromToken(qualifiedName.right, /*isOptional:*/ false));
                this.movePast(qualifiedName.right);
            }
            else {
                result.push(this.identifierFromToken(<ISyntaxToken>name, /*isOptional:*/ false));
                this.movePast(<ISyntaxToken>name);
            }
        }

        private visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleDeclaration {
            this.assertElementAtPosition(node);

            this.pushDeclLists();

            var start = this.position;
            this.movePast(node.exportKeyword);
            this.movePast(node.declareKeyword);
            this.movePast(node.moduleKeyword);
            var names = this.getModuleNames(node);
            this.movePast(node.openBraceToken);
            var members = this.visitSyntaxList(node.moduleElements);
            var closeBracePosition = this.position;
            this.movePast(node.closeBraceToken);

            var moduleDecl: ModuleDeclaration = null;
            for (var i = names.length - 1; i >= 0; i--) {
                var innerName = names[i];

                var closeBraceSpan = new ASTSpan();
                closeBraceSpan.minChar = closeBracePosition;
                closeBraceSpan.limChar = this.position;
                var moduleDecl = new ModuleDeclaration(innerName, members, this.topVarList(), closeBraceSpan);
                this.setSpan(moduleDecl, start, this.position);
                //innerDecl.preComments = preComments;

                //if (this.parsingDeclareFile || hasFlag(modifiers, Modifiers.Ambient)) {
                //    innerDecl.modFlags |= ModuleFlags.Ambient;
                //}

                // mark the inner module declarations as exported
                if (i) {
                    moduleDecl.modFlags |= ModuleFlags.Exported;
                }

                // REVIEW: will also possibly need to re-parent comments as well

                if (i === 0) {
                    this.popDeclLists();
                }

                members = new ASTList();
                members.append(moduleDecl);
            }

            if (node.declareKeyword) {
                moduleDecl.modFlags |= ModuleFlags.Ambient;
            }

            if (node.exportKeyword) {
                moduleDecl.modFlags |= ModuleFlags.Exported;
            }

            //if (hasFlag(modifiers, Modifiers.Exported)) {
            //    moduleDecl.modFlags |= ModuleFlags.Exported;
            //} else if (svAmbient) {
            //    this.reportAmbientElementNotExported(name);
            //}

            //if (isDynamicMod) {
            //    moduleDecl.modFlags |= ModuleFlags.IsDynamic;
            //}

            //this.ambientModule = svAmbient;

            //this.topLevel = svTopLevel;
            //moduleDecl.leftCurlyCount = this.scanner.leftCurlyCount - leftCurlyCount;
            //moduleDecl.rightCurlyCount = this.scanner.rightCurlyCount - rightCurlyCount;
            //moduleDecl.limChar = moduleBody.limChar;

            return moduleDecl;
        }

        private hasDotDotDotParameter(parameters: ISeparatedSyntaxList): bool {
            for (var i = 0, n = parameters.nonSeparatorCount(); i < n; i++) {
                if ((<ParameterSyntax>parameters.nonSeparatorAt(i)).dotDotDotToken) {
                    return true;
                }
            }

            return false;
        }

        private convertBlock(node: BlockSyntax): ASTList {
            if (!node) {
                return null;
            }

            this.movePast(node.openBraceToken);
            var statements = this.visitSyntaxList(node.statements);
            this.movePast(node.closeBraceToken);

            return statements;
        }

        private visitFunctionDeclaration(node: FunctionDeclarationSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo3(node, node.functionSignature, node.functionSignature.identifier);
            var name = this.identifierFromToken(node.functionSignature.identifier, !!node.functionSignature.questionToken);

            this.movePast(node.functionSignature.identifier);
            this.movePast(node.functionSignature.questionToken);

            var typeParameters = node.functionSignature.callSignature.typeParameterList === null ? null : node.functionSignature.callSignature.typeParameterList.accept(this);
            var parameters = node.functionSignature.callSignature.parameterList.accept(this);

            var returnType = node.functionSignature.callSignature.typeAnnotation
                ? node.functionSignature.callSignature.typeAnnotation.accept(this)
                : null;

            this.pushDeclLists();

            var bod = this.convertBlock(node.block);
            if (bod) {
                bod.append(new EndCode());
            }

            this.movePast(node.semicolonToken);

            var funcDecl = new FuncDecl(name, bod, false, typeParameters, parameters, this.topVarList(),
                this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.variableArgList = this.hasDotDotDotParameter(node.functionSignature.callSignature.parameterList.parameters);
            funcDecl.returnTypeAnnotation = returnType;
            funcDecl.variableArgList = this.hasDotDotDotParameter(node.functionSignature.callSignature.parameterList.parameters);

            if (node.exportKeyword) {
                funcDecl.fncFlags |= FncFlags.Exported;
            }

            if (node.declareKeyword) {
                funcDecl.fncFlags |= FncFlags.Ambient;
            }

            if (node.semicolonToken) {
                funcDecl.fncFlags |= FncFlags.Signature;
            }

            return funcDecl;
        }

        private visitEnumDeclaration(enumDeclaration: EnumDeclarationSyntax): ModuleDeclaration {
            this.assertElementAtPosition(enumDeclaration);

            this.moveTo2(enumDeclaration, enumDeclaration.identifier);
            var name = this.identifierFromToken(enumDeclaration.identifier, /*isOptional:*/ false);
            this.movePast(enumDeclaration.identifier);

            this.pushDeclLists();

            this.movePast(enumDeclaration.openBraceToken);
            var members = new ASTList();

            var mapDecl = new VarDecl(new Identifier("_map"), 0);
            mapDecl.varFlags |= VarFlags.Exported;
            mapDecl.varFlags |= VarFlags.Private;

            // REVIEW: Is this still necessary?
            mapDecl.varFlags |= (VarFlags.Property | VarFlags.Public);
            mapDecl.init = new UnaryExpression(NodeType.ArrayLit, null);
            members.append(mapDecl);
            var lastValue: NumberLiteral = null;
            var memberNames: Identifier[] = [];
            var start = this.position;

            for (var i = 0, n = enumDeclaration.variableDeclarators.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(<ISyntaxToken>enumDeclaration.variableDeclarators.childAt(i));
                }
                else {
                    var variableDeclarator = <VariableDeclaratorSyntax>enumDeclaration.variableDeclarators.childAt(i);

                    var memberName: Identifier = this.identifierFromToken(variableDeclarator.identifier, /*isOptional:*/ false);
                    this.movePast(variableDeclarator.identifier);
                    var memberValue: AST = null;
                    var memberStart = this.position;

                    if (variableDeclarator.equalsValueClause !== null) {
                        memberValue = variableDeclarator.equalsValueClause.accept(this);
                        lastValue = <NumberLiteral>memberValue;
                    }
                    else {
                        if (lastValue == null) {
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
                        members.append(map);
                    }
                    var member = new VarDecl(memberName, this.nestingLevel);
                    member.init = memberValue;
                    // Note: Leave minChar, limChar as "-1" on typeExpr as this is a parsing artifact.
                    member.typeExpr = new TypeReference(this.createRef(name.actualText, name.hasEscapeSequence, -1), 0);
                    member.varFlags |= (VarFlags.Readonly | VarFlags.Property);
                    this.setSpan(member, memberStart, this.position);

                    if (memberValue.nodeType == NodeType.NumberLit) {
                        member.varFlags |= VarFlags.Constant;
                    }
                    else if (memberValue.nodeType === NodeType.Lsh) {
                        // If the initializer is of the form "value << value" then treat it as a constant
                        // as well.
                        var binop = <BinaryExpression>memberValue;
                        if (binop.operand1.nodeType === NodeType.NumberLit && binop.operand2.nodeType === NodeType.NumberLit) {
                            member.varFlags |= VarFlags.Constant;
                        }
                    }
                    else if (memberValue.nodeType === NodeType.Name) {
                        // If the initializer refers to an earlier enum value, then treat it as a constant
                        // as well.
                        var nameNode = <Identifier>memberValue;
                        for (var j = 0; j < memberNames.length; j++) {
                            var memberName = memberNames[j];
                            if (memberName.text === nameNode.text) {
                                member.varFlags |= VarFlags.Constant;
                                break;
                            }
                        }
                    }

                    members.append(member);
                    // all enum members are exported
                    member.varFlags |= VarFlags.Exported;
                }
            }

            this.movePast(enumDeclaration.closeBraceToken);

            var endingToken = new ASTSpan();
            var modDecl = new ModuleDeclaration(name, members, this.topVarList(), endingToken);
            modDecl.modFlags |= ModuleFlags.IsEnum;
            modDecl.recordNonInterface();

            if (enumDeclaration.exportKeyword) {
                modDecl.modFlags |= ModuleFlags.Exported;
            }

            this.setSpan(modDecl, start, this.position);
            
            this.popDeclLists();

            return modDecl;
        }

        private visitImportDeclaration(node: ImportDeclarationSyntax): ImportDeclaration {
            this.assertElementAtPosition(node);
            var start = this.position;

            this.moveTo2(node, node.identifier);

            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.equalsToken);
            var alias = node.moduleReference.accept(this);
            this.movePast(node.semicolonToken);

            var importDecl = new ImportDeclaration(name, alias);
            importDecl.isDynamicImport = node.moduleReference.kind() === SyntaxKind.ExternalModuleReference;

            this.setSpan(importDecl, start, this.position);

            return importDecl;
        }

        private visitExportAssignment(node: ExportAssignmentSyntax): ExportAssignment {
            this.assertElementAtPosition(node);
            var start = this.position;

            this.moveTo2(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.semicolonToken);

            var result = new ExportAssignment(name);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitVariableStatement(node: VariableStatementSyntax): AST {
            this.assertElementAtPosition(node);
            var start = this.position;

            this.moveTo2(node, node.variableDeclaration);
            var varList = node.variableDeclaration.accept(this);
            this.movePast(node.semicolonToken);

            if (varList.nodeType === NodeType.VarDecl) {
                varDecl = <VarDecl>varList;
                varList = new ASTList();
                varList.append(varDecl);
            }

            for (var i = 0, n = varList.members.length; i < n; i++) {
                var varDecl = <VarDecl>varList.members[i];

                if (node.exportKeyword) {
                    varDecl.varFlags |= VarFlags.Exported;
                }

                if (node.declareKeyword) {
                    varDecl.varFlags |= VarFlags.Ambient;
                }
            }

            if (node.variableDeclaration.variableDeclarators.nonSeparatorCount() === 1) {
                return varList.members[0];
            }
            else {
                var result = new Block(varList, /*isStatementBlock:*/ false);
                this.setSpan(result, start, this.position);

                return result;
            }
        }

        private visitVariableDeclaration(node: VariableDeclarationSyntax): AST {
            this.assertElementAtPosition(node);

            this.moveTo2(node, node.variableDeclarators);
            var variableDecls = this.visitSeparatedSyntaxList(node.variableDeclarators);

            for (var i = 0; i < variableDecls.members.length; i++) {
                (<BoundDecl>variableDecls.members[i]).nestingLevel = i;
            }

            if (variableDecls.members.length === 1) {
                return variableDecls.members[0];
            }

            return variableDecls;
        }

        private visitVariableDeclarator(node: VariableDeclaratorSyntax): VarDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
            var init = node.equalsValueClause ? node.equalsValueClause.accept(this) : null;

            var result = new VarDecl(name, 0);
            this.setSpan(result, start, this.position);

            this.topVarList().append(result);

            result.typeExpr = typeExpr;
            result.init = init;
            if (init && init.nodeType == NodeType.FuncDecl) {
                var funcDecl = <FuncDecl>init;
                funcDecl.hint = name.actualText;
            }

            // TODO: more flags

            return result;
        }

        private visitEqualsValueClause(node: EqualsValueClauseSyntax): AST {
            this.assertElementAtPosition(node);

            this.movePast(node.equalsToken);
            return node.value.accept(this);
        }

        private getUnaryExpressionNodeType(kind: SyntaxKind): NodeType {
            switch (kind) {
                case SyntaxKind.PlusExpression: return NodeType.Pos;
                case SyntaxKind.NegateExpression: return NodeType.Neg;
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
            this.movePast(node.operatorToken);
            var operand = node.operand.accept(this);

            var result = new UnaryExpression(this.getUnaryExpressionNodeType(node.kind()), operand);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.openBracketToken);
            var expressions = this.visitSeparatedSyntaxList(node.expressions);
            this.movePast(node.closeBracketToken);

            if (node.expressions.childCount() > 0 && node.expressions.childAt(node.expressions.childCount() - 1).kind() === SyntaxKind.CommaToken) {
                expressions.append(new AST(NodeType.EmptyExpr));
            }

            var result = new UnaryExpression(NodeType.ArrayLit, expressions);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitOmittedExpression(node: OmittedExpressionSyntax): any {
            this.assertElementAtPosition(node);

            var start = this.position;

            var result = new AST(NodeType.EmptyExpr);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): AST {
            this.assertElementAtPosition(node);

            this.movePast(node.openParenToken);
            var result = node.expression.accept(this);
            this.movePast(node.closeParenToken);
            
            result.isParenthesized = true;

            return result;
        }

        private getArrowFunctionStatements(body: ISyntaxNodeOrToken): ASTList {
            var statements: ASTList = null;

            if (body.kind() === SyntaxKind.Block) {
                var block = <BlockSyntax>body;

                statements = this.convertBlock(block);
            }
            else {
                statements = new ASTList();

                var expr = body.accept(this);
                var retStmt = new ReturnStatement();
                retStmt.returnExpression = expr;

                statements.append(retStmt);
            }

            statements.append(new EndCode());

            return statements;
        }

        private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.equalsGreaterThanToken);

            var parameters = new ASTList();
            parameters.append(new ArgDecl(identifier));

            this.pushDeclLists();

            var statements = this.getArrowFunctionStatements(node.body);

            var result = new FuncDecl(null, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            this.popDeclLists();
            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.returnTypeAnnotation = null;
            result.fncFlags |= FncFlags.IsFunctionExpression;
            result.fncFlags |= FncFlags.IsFatArrowFunction;

            return result;
        }

        private visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;
            this.movePast(node.equalsGreaterThanToken);

            this.pushDeclLists();

            var statements = this.getArrowFunctionStatements(node.body);

            var result = new FuncDecl(null, statements, /*isConstructor:*/ false, typeParameters, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            this.popDeclLists();
            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.returnTypeAnnotation = returnType;
            result.fncFlags |= FncFlags.IsFunctionExpression;
            result.fncFlags |= FncFlags.IsFatArrowFunction;
            result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);

            return result;
        }

        private visitType(type: ITypeSyntax): AST {
            this.assertElementAtPosition(type);

            if (type.isToken()) {
                var typeToken = <ISyntaxToken>type;

                var start = this.position;
                var identifier = this.identifierFromToken(typeToken, /*isOptional:*/ false);
                this.movePast(typeToken);

                var result = new TypeReference(identifier, 0);
                this.setSpan(result, start, this.position);

                return result;
            }
            else {
                return type.accept(this);
            }
        }

        private visitQualifiedName(node: QualifiedNameSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var left = this.visitType(node.left);
            this.movePast(node.dotToken);
            var right = this.identifierFromToken(node.right, /*isOptional:*/ false);
            this.movePast(node.right);

            if (left.nodeType === NodeType.TypeRef) {
                left = (<TypeReference>left).term;
            }

            var term = new BinaryExpression(NodeType.Dot, left, right);
            this.setSpan(term, start, this.position);

            var result = new TypeReference(term, 0);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitTypeArgumentList(node: TypeArgumentListSyntax): ASTList {
            this.assertElementAtPosition(node);

            var result = new ASTList();

            this.movePast(node.lessThanToken);
            for (var i = 0, n = node.typeArguments.childCount(); i < n; i++) {
                if (i % 2 === 1) {
                    this.movePast(<ISyntaxToken>node.typeArguments.childAt(i));
                }
                else {
                    result.append(this.visitType(node.typeArguments.childAt(i)));
                }
            }
            this.movePast(node.greaterThanToken);

            return result;
        }

        private visitConstructorType(node: ConstructorTypeSyntax): any {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.newKeyword);
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var parameters = node.parameterList.accept(this);
            this.movePast(node.equalsGreaterThanToken);
            var returnType = node.type ? this.visitType(node.type) : null;

            var result = new FuncDecl(null, null, false, typeParameters, parameters, null, null, null, NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            result.returnTypeAnnotation = returnType;
            // funcDecl.variableArgList = variableArgList;
            result.fncFlags |= FncFlags.Signature;
            result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);

            result.fncFlags |= FncFlags.ConstructMember;
            result.flags |= ASTFlags.TypeReference;
            result.hint = "_construct";
            result.classDecl = null;

            var typeRef = new TypeReference(result, 0);
            this.setSpan(typeRef, start, this.position);

            return typeRef;
        }

        private visitFunctionType(node: FunctionTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var parameters = node.parameterList.accept(this);
            this.movePast(node.equalsGreaterThanToken);
            var returnType = node.type ? this.visitType(node.type) : null;

            var result = new FuncDecl(null, null, false, typeParameters, parameters, null, null, null, NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            result.returnTypeAnnotation = returnType;
            // funcDecl.variableArgList = variableArgList;
            result.fncFlags |= FncFlags.Signature;
            result.flags |= ASTFlags.TypeReference;
            result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);

            var typeRef = new TypeReference(result, 0);
            this.setSpan(typeRef, start, this.position);

            return typeRef;
        }

        private visitObjectType(node: ObjectTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.openBraceToken);
            var typeMembers = this.visitSeparatedSyntaxList(node.typeMembers);

            if (typeMembers.members) {
                for (var i = 0; i < typeMembers.members.length; i++) {
                    if (typeMembers.members[i].nodeType == NodeType.FuncDecl) {
                        (<FuncDecl>typeMembers.members[i]).fncFlags |= FncFlags.Method;
                        (<FuncDecl>typeMembers.members[i]).fncFlags |= FncFlags.Signature;
                    }
                }
            }
            this.movePast(node.closeBraceToken);

            var result = new InterfaceDeclaration(
                new Identifier("_anonymous"),
                null,
                typeMembers,
                null, null);

            result.flags |= ASTFlags.TypeReference;

            this.setSpan(result, start, this.position);
            
            var typeRef = new TypeReference(result, 0);
            this.setSpan(typeRef, start, this.position);

            return typeRef;
        }

        private visitArrayType(node: ArrayTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var underlying = this.visitType(node.type);
            this.movePast(node.openBracketToken);
            this.movePast(node.closeBracketToken);

            var result: TypeReference = null;
            if (underlying.nodeType === NodeType.TypeRef) {
                result = <TypeReference>underlying;
                result.arrayCount++;
            }
            else {
                result = new TypeReference(underlying, 1);
            }
            
            result.flags |= ASTFlags.TypeReference;

            this.setSpan(result, start, this.position);

            return result;
        }

        private visitGenericType(node: GenericTypeSyntax): TypeReference {
            this.assertElementAtPosition(node);

            var start = this.position;
            var underlying = this.visitType(node.name);
            var typeArguments = node.typeArgumentList.accept(this);

            if (underlying.nodeType === NodeType.TypeRef) {
                underlying = (<TypeReference>underlying).term;
            }

            var genericType = new GenericType(underlying, typeArguments);

            genericType.flags |= ASTFlags.TypeReference;

            var result = new TypeReference(genericType, 0);
            this.setSpan(result, start, this.position);

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
            var statements = this.convertBlock(node);

            var result = new Block(statements, /*isStatementBlock:*/ true);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitParameter(node: ParameterSyntax): ArgDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.identifier);
            var identifier = this.identifierFromToken(node.identifier, !!node.questionToken);
            this.movePast(node.identifier);
            this.movePast(node.questionToken);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;
            var init = node.equalsValueClause ? node.equalsValueClause.accept(this) : null;

            var result = new ArgDecl(identifier);
            this.setSpan(result, start, this.position);

            result.isOptional = !!node.questionToken;
            result.init = init;
            result.typeExpr = typeExpr;

            if (node.publicOrPrivateKeyword) {
                result.varFlags |= VarFlags.Property;

                if (node.publicOrPrivateKeyword.kind() === SyntaxKind.PublicKeyword) {
                    result.varFlags |= VarFlags.Public;
                }
                else {
                    result.varFlags |= VarFlags.Private;
                }
            }

            if (node.equalsValueClause || node.dotDotDotToken) {
                result.flags |= ASTFlags.OptionalName;
            }

            return result;
        }

        private visitMemberAccessExpression(node: MemberAccessExpressionSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var expression: AST = node.expression.accept(this);
            this.movePast(node.dotToken);
            var name = this.identifierFromToken(node.name, /*isOptional:*/ false);
            this.movePast(node.name);

            var result = new BinaryExpression(NodeType.Dot, expression, name);
            this.setSpan(result, start, this.position);

            expression.flags |= ASTFlags.DotLHS;

            return result;
        }

        private visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var operand = node.operand.accept(this);
            this.movePast(node.operatorToken);

            var result = new UnaryExpression(node.kind() === SyntaxKind.PostIncrementExpression ? NodeType.IncPost : NodeType.DecPost,
                operand);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitElementAccessExpression(node: ElementAccessExpressionSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var expression = node.expression.accept(this);
            this.movePast(node.openBracketToken);
            var argumentExpression = node.argumentExpression.accept(this);
            this.movePast(node.closeBracketToken);

            var result = new BinaryExpression(NodeType.Index, expression, argumentExpression);
            this.setSpan(result, start, this.position);

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
            var expression = node.expression.accept(this);
            var typeArguments = node.argumentList.typeArgumentList !== null
                ? node.argumentList.typeArgumentList.accept(this)
                : null;
            var argumentList = this.convertArgumentListArguments(node.argumentList);

            var result = new CallExpression(NodeType.Call, expression, typeArguments, argumentList);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitArgumentList(node: ArgumentListSyntax): ASTList {
            // Processing argument lists should be handled from inside visitInvocationExpression or 
            // visitObjectCreationExpression.
            throw Errors.invalidOperation();
        }

        private getBinaryExpressionNodeType(node: BinaryExpressionSyntax): NodeType {
            switch (node.kind()) {
                case SyntaxKind.CommaExpression: return NodeType.Comma;
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
            var nodeType = this.getBinaryExpressionNodeType(node);
            var left = node.left.accept(this);
            this.movePast(node.operatorToken);
            var right = node.right.accept(this);

            var result = new BinaryExpression(nodeType, left, right);
            this.setSpan(result, start, this.position);

            if (right.nodeType === NodeType.FuncDecl) {
                var id = left.nodeType === NodeType.Dot ? (<BinaryExpression>left).operand2 : left;
                var idHint: string = id.nodeType === NodeType.Name ? id.actualText : null;

                var funcDecl = <FuncDecl>right;
                funcDecl.hint = idHint;
            }

            return result;
        }

        private visitConditionalExpression(node: ConditionalExpressionSyntax): ConditionalExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var condition = node.condition.accept(this);
            this.movePast(node.questionToken);
            var whenTrue = node.whenTrue.accept(this);
            this.movePast(node.colonToken);
            var whenFalse = node.whenFalse.accept(this)

            var result = new ConditionalExpression(condition, whenTrue, whenFalse);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitConstructSignature(node: ConstructSignatureSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.newKeyword);
            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;

            var result = new FuncDecl(null, new ASTList(), /*isConstructor:*/ false, typeParameters, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            result.returnTypeAnnotation = returnType;

            result.hint = "_construct";
            result.fncFlags |= FncFlags.ConstructMember;
            result.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);

            var scopeList = this.topScopeList();
            scopeList.append(result);

            return result;
        }

        private visitFunctionSignature(node: FunctionSignatureSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var name = this.identifierFromToken(node.identifier, !!node.questionToken);
            this.movePast(node.identifier);
            this.movePast(node.questionToken);

            var typeParameters = node.callSignature.typeParameterList ? node.callSignature.typeParameterList.accept(this) : null;
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation ? node.callSignature.typeAnnotation.accept(this) : null;

            var funcDecl = new FuncDecl(name, new ASTList(), false, typeParameters, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, start, this.position);

            funcDecl.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
            funcDecl.returnTypeAnnotation = returnType;

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            return funcDecl;
        }

        private visitIndexSignature(node: IndexSignatureSyntax): FuncDecl {
            this.assertElementAtPosition(node);
            /*
            public openBracketToken: ISyntaxToken,
                public parameter: ParameterSyntax,
                public closeBracketToken: ISyntaxToken,
                public typeAnnotation*/

            var start = this.position;
            this.movePast(node.openBracketToken);
            var parameter = node.parameter.accept(this);
            this.movePast(node.closeBracketToken);
            var returnType = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

            var name = new Identifier("__item");
            this.setSpan(name, start, start);   // 0 length name.

            var parameters = new ASTList();
            parameters.append(parameter);

            var result = new FuncDecl(name, new ASTList(), /*isConstructor:*/ false, null, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            result.variableArgList = !!node.parameter.dotDotDotToken;
            result.returnTypeAnnotation = returnType;

            result.fncFlags |= FncFlags.IndexerMember;

            var scopeList = this.topScopeList();
            scopeList.append(result);

            return result;
        }

        private visitPropertySignature(node: PropertySignatureSyntax): VarDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var name = this.identifierFromToken(node.identifier, !!node.questionToken);
            this.movePast(node.identifier);
            this.movePast(node.questionToken);
            var typeExpr = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

            var result = new VarDecl(name, 0);
            this.setSpan(result, start, this.position);

            result.typeExpr = typeExpr;
            result.varFlags |= VarFlags.Property;

            return result;
        }

        private visitParameterList(node: ParameterListSyntax): ASTList {
            this.assertElementAtPosition(node);

            this.movePast(node.openParenToken);
            var result = this.visitSeparatedSyntaxList(node.parameters);
            this.movePast(node.closeParenToken);

            return result;
        }

        private visitCallSignature(node: CallSignatureSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            var typeParameters = node.typeParameterList === null ? null : node.typeParameterList.accept(this);
            var parameters = node.parameterList.accept(this);
            var returnType = node.typeAnnotation ? node.typeAnnotation.accept(this) : null;

            var result = new FuncDecl(null, new ASTList(), /*isConstructor:*/ false, typeParameters, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);
            result.returnTypeAnnotation = returnType;

            result.hint = "_call";
            result.fncFlags |= FncFlags.CallMember;

            var scopeList = this.topScopeList();
            scopeList.append(result);

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
            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var constraint = node.constraint ? node.constraint.accept(this) : null;

            var result = new TypeParameter(identifier, constraint);
            this.setSpan(result, start, this.position);

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
            this.moveTo2(node, node.condition);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            var thenBod = node.statement.accept(this);
            var elseBod = node.elseClause ? node.elseClause.accept(this) : null;

            var result = new IfStatement(condition);
            this.setSpan(result, start, this.position);

            result.thenBod = thenBod;
            result.elseBod = elseBod;

            return result;
        }

        private visitElseClause(node: ElseClauseSyntax): Statement {
            this.assertElementAtPosition(node);

            this.movePast(node.elseKeyword);
            return node.statement.accept(this);
        }

        private visitExpressionStatement(node: ExpressionStatementSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;
            var expression = node.expression.accept(this);
            this.movePast(node.semicolonToken);

            var result = expression;
            this.setSpan(result, start, this.position);

            result.flags |= ASTFlags.IsStatement;

            return result;
        }

        private visitConstructorDeclaration(node: ConstructorDeclarationSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.parameterList);
            var parameters = node.parameterList.accept(this);

            this.pushDeclLists();

            var statements = this.convertBlock(node.block);
            if (statements) {
                statements.append(new EndCode());
            }
            this.movePast(node.semicolonToken);

            var result = new FuncDecl(null, statements, /*isConstructor:*/ true, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);
            // constructorFuncDecl.preComments = preComments;
            //if (requiresSignature && !isAmbient) {
            //    constructorFuncDecl.isOverload = true;
            //}

            // constructorFuncDecl.variableArgList = variableArgList;
            // this.currentClassDecl = null;

            //if (isAmbient) {
            //    constructorFuncDecl.fncFlags |= FncFlags.Ambient;
            //}

            if (node.semicolonToken) {
                result.fncFlags |= FncFlags.Signature;
            }

            //if (this.currentClassDefinition.constructorDecl) {
            //    if (!isAmbient && !this.currentClassDefinition.constructorDecl.isSignature() && !constructorFuncDecl.isSignature()) {
            //        this.reportParseError("Duplicate constructor definition");
            //    }
            //}

            //if (isAmbient || !constructorFuncDecl.isSignature()) {
            //    this.currentClassDefinition.constructorDecl = constructorFuncDecl;
            //}

            // REVIEW: Should we have a separate flag for class constructors?  (Constructors are not methods)
            result.fncFlags |= FncFlags.ClassMethod;

            //this.currentClassDefinition.members.members[this.currentClassDefinition.members.members.length] = constructorFuncDecl;

            //this.parsingClasvisisConstructorDefinition = false;

            return result;
        }

        private visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo3(node, node.functionSignature, node.functionSignature.identifier);
            var name = this.identifierFromToken(node.functionSignature.identifier, !!node.functionSignature.questionToken);

            this.movePast(node.functionSignature.identifier);
            this.movePast(node.functionSignature.questionToken);

            var typeParameters = node.functionSignature.callSignature.typeParameterList === null ? null : node.functionSignature.callSignature.typeParameterList.accept(this);
            var parameters = node.functionSignature.callSignature.parameterList.accept(this);
            var returnType = node.functionSignature.callSignature.typeAnnotation
                ? node.functionSignature.callSignature.typeAnnotation.accept(this)
                : null;

            this.pushDeclLists();

            var statements = this.convertBlock(node.block);
            if (statements) {
                statements.append(new EndCode());
            }
            this.movePast(node.semicolonToken);

            var result = new FuncDecl(name, statements, /*isConstructor:*/ false, typeParameters, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.variableArgList = this.hasDotDotDotParameter(node.functionSignature.callSignature.parameterList.parameters);
            result.returnTypeAnnotation = returnType;

            if (node.semicolonToken) {
                result.fncFlags |= FncFlags.Signature;
            }

            if (node.publicOrPrivateKeyword) {
                if (node.publicOrPrivateKeyword.kind() === SyntaxKind.PrivateKeyword) {
                    result.fncFlags |= FncFlags.Private;
                }
                else {
                    result.fncFlags |= FncFlags.Public;
                }
            }

            if (node.staticKeyword) {
                result.fncFlags |= FncFlags.Static;
            }

            result.fncFlags |= FncFlags.Method;

            return result;
        }

        private visitMemberAccessorDeclaration(node: MemberAccessorDeclarationSyntax, typeAnnotation: TypeAnnotationSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.identifier);
            var name = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var parameters = node.parameterList.accept(this);
            var returnType = typeAnnotation ? typeAnnotation.accept(this) : null;

            this.pushDeclLists();

            var statements = this.convertBlock(node.block);
            if (statements) {
                statements.append(new EndCode());
            }
            var result = new FuncDecl(name, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.variableArgList = this.hasDotDotDotParameter(node.parameterList.parameters);
            result.returnTypeAnnotation = returnType;

            if (node.publicOrPrivateKeyword) {
                if (node.publicOrPrivateKeyword.kind() === SyntaxKind.PrivateKeyword) {
                    result.fncFlags |= FncFlags.Private;
                }
                else {
                    result.fncFlags |= FncFlags.Public;
                }
            }

            if (node.staticKeyword) {
                result.fncFlags |= FncFlags.Static;
            }

            return result;
        }

        private visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var result = this.visitMemberAccessorDeclaration(node, node.typeAnnotation);

            result.fncFlags |= FncFlags.GetAccessor;
            result.hint = "get" + result.name.actualText;

            return result;
        }

        private visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var result = this.visitMemberAccessorDeclaration(node, null);

            result.fncFlags |= FncFlags.SetAccessor;
            result.hint = "set" + result.name.actualText;

            return result;
        }

        private visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): VarDecl {
            this.assertElementAtPosition(node);

            this.moveTo3(node, node.variableDeclarator, node.variableDeclarator.identifier);
            var name = this.identifierFromToken(node.variableDeclarator.identifier, /*isOptional:*/ false);
            this.movePast(node.variableDeclarator.identifier);
            var typeExpr = node.variableDeclarator.typeAnnotation ? node.variableDeclarator.typeAnnotation.accept(this) : null;
            var init = node.variableDeclarator.equalsValueClause ? node.variableDeclarator.equalsValueClause.accept(this) : null;
            this.movePast(node.semicolonToken);

            var varDecl = new VarDecl(name, 0);
            this.setSpan(varDecl, name.minChar, name.limChar);

            varDecl.typeExpr = typeExpr;
            varDecl.init = init;

            if (node.staticKeyword) {
                varDecl.varFlags |= VarFlags.Static;
            }

            if (node.publicOrPrivateKeyword) {
                if (node.publicOrPrivateKeyword.kind() === SyntaxKind.PrivateKeyword) {
                    varDecl.varFlags |= VarFlags.Private;
                }
                else {
                    varDecl.varFlags |= VarFlags.Public;
                }
            }

            varDecl.varFlags |= VarFlags.ClassProperty;

            // this.currentClassDefinition.knownMemberNames[text.actualText] = true;

            //if (!isDeclaredInConstructor) {
            //    this.currentClassDefinition.members.members[this.currentClassDefinition.members.members.length] = varDecl;
            //}

            // varDecl.postComments = this.parseComments();
            return varDecl;
        }

        private visitThrowStatement(node: ThrowStatementSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.throwKeyword);
            var expression = node.expression.accept(this);
            this.movePast(node.semicolonToken);

            var result = new UnaryExpression(NodeType.Throw, expression);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitReturnStatement(node: ReturnStatementSyntax): ReturnStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.returnKeyword);
            var expression = node.expression ? node.expression.accept(this) : null;
            this.movePast(node.semicolonToken);

            var result = new ReturnStatement();
            this.setSpan(result, start, this.position);

            result.returnExpression = expression;

            return result;
        }

        private visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): CallExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.newKeyword);
            var expression = node.expression.accept(this);
            var typeArgumentList = node.argumentList === null || node.argumentList.typeArgumentList === null ? null : node.argumentList.typeArgumentList.accept(this);
            var argumentList = this.convertArgumentListArguments(node.argumentList);

            var result = new CallExpression(NodeType.New, expression, typeArgumentList, argumentList);
            this.setSpan(result, start, this.position);

            if (expression.nodeType === NodeType.TypeRef) {
                var typeRef = <TypeReference>expression;

                if (typeRef.arrayCount === 0) {
                    var term = typeRef.term;
                    if (term.nodeType === NodeType.Dot || term.nodeType === NodeType.Name) {
                        expression = term;
                    }
                }
            }

            return result;
        }

        private visitSwitchStatement(node: SwitchStatementSyntax): SwitchStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.switchKeyword);
            this.movePast(node.openParenToken);
            var expression = node.expression.accept(this);
            this.movePast(node.closeParenToken);
            var closeParenPosition = this.position;
            this.movePast(node.openBraceToken);

            var result = new SwitchStatement(expression);
            this.setSpan(result, start, this.position);

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

            return result;
        }

        private visitCaseSwitchClause(node: CaseSwitchClauseSyntax): CaseStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.caseKeyword);
            var expression = node.expression.accept(this);
            this.movePast(node.colonToken);
            var statements = this.visitSyntaxList(node.statements);

            var result = new CaseStatement();
            this.setSpan(result, start, this.position);

            result.expr = expression;
            result.body = statements;

            return result;
        }

        private visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): CaseStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.defaultKeyword);
            this.movePast(node.colonToken);
            var statements = this.visitSyntaxList(node.statements);

            var result = new CaseStatement();
            this.setSpan(result, start, this.position);

            result.body = statements;

            return result;
        }

        private visitBreakStatement(node: BreakStatementSyntax): Jump {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.breakKeyword);
            this.movePast(node.identifier);
            this.movePast(node.semicolonToken);

            var result = new Jump(NodeType.Break);
            this.setSpan(result, start, this.position);

            if (node.identifier !== null) {
                result.target = this.valueText(node.identifier);
            }

            return result;
        }

        private visitContinueStatement(node: ContinueStatementSyntax): Jump {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.continueKeyword);
            this.movePast(node.identifier);
            this.movePast(node.semicolonToken);

            var result = new Jump(NodeType.Continue);
            this.setSpan(result, start, this.position);

            if (node.identifier !== null) {
                result.target = this.valueText(node.identifier);
            }

            return result;
        }

        private visitForStatement(node: ForStatementSyntax): ForStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
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

            var result = new ForStatement(init);
            this.setSpan(result, start, this.position);

            result.cond = cond;
            result.incr = incr;
            result.body = body;

            return result;
        }

        private visitForInStatement(node: ForInStatementSyntax): ForInStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.forKeyword);
            this.movePast(node.openParenToken);
            var init = node.variableDeclaration ? node.variableDeclaration.accept(this) : node.left.accept(this);
            this.movePast(node.inKeyword);
            var expression = node.expression.accept(this);
            this.movePast(node.closeParenToken);
            var body = node.statement.accept(this);

            var result = new ForInStatement(init, expression);
            this.setSpan(result, start, this.position);

            result.body = body;

            return result;
        }

        private visitWhileStatement(node: WhileStatementSyntax): WhileStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.condition);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            var statement = node.statement.accept(this);

            var result = new WhileStatement(condition);
            this.setSpan(result, start, this.position);

            result.body = statement;

            return result;
        }

        private visitWithStatement(node: WithStatementSyntax): WithStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.condition);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            var statement = node.statement.accept(this);

            var result = new WithStatement(condition);
            this.setSpan(result, start, this.position);

            result.body = statement;

            return result;
        }

        private visitCastExpression(node: CastExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.lessThanToken);
            var castTerm = this.visitType(node.type);
            this.movePast(node.greaterThanToken);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.TypeAssertion, expression);
            this.setSpan(result, start, this.position);

            result.castTerm = castTerm;

            return result;
        }

        private visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.openBraceToken);
            var propertyAssignments = this.visitSeparatedSyntaxList(node.propertyAssignments);
            this.movePast(node.closeBraceToken);

            var result = new UnaryExpression(NodeType.ObjectLit, propertyAssignments);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            var left = node.propertyName.accept(this);
            this.movePast(node.colonToken);
            var right = node.expression.accept(this);

            var result = new BinaryExpression(NodeType.Member, left, right);
            this.setSpan(result, start, this.position);

            if (right.nodeType == NodeType.FuncDecl) {
                var funcDecl = <FuncDecl>right;
                funcDecl.hint = left.text;
            }

            return result;
        }

        private visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.propertyName);
            var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            this.movePast(node.propertyName);
            this.movePast(node.openParenToken);
            this.movePast(node.closeParenToken);

            this.pushDeclLists();

            var statements = this.convertBlock(node.block);
            statements.append(new EndCode());

            var funcDecl = new FuncDecl(name, statements, /*isConstructor:*/ false, null, new ASTList(), this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.fncFlags |= FncFlags.GetAccessor;
            funcDecl.fncFlags |= FncFlags.IsFunctionExpression;
            funcDecl.hint = "get" + node.propertyName.text();

            var result = new BinaryExpression(NodeType.Member, name, funcDecl);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): BinaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.moveTo2(node, node.propertyName);
            var name = this.identifierFromToken(node.propertyName, /*isOptional:*/ false);
            this.movePast(node.propertyName);
            this.movePast(node.openParenToken);
            var parameterName = this.identifierFromToken(node.parameterName, /*isOptional:*/ false);
            this.movePast(node.parameterName);
            this.movePast(node.closeParenToken);

            var parameter = new ArgDecl(parameterName);
            this.setSpan(parameter, parameterName.minChar, parameter.limChar);

            var parameters = new ASTList();
            parameters.append(parameter);

            this.pushDeclLists();

            var statements = this.convertBlock(node.block);
            statements.append(new EndCode());

            var funcDecl = new FuncDecl(name, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.fncFlags |= FncFlags.SetAccessor;
            funcDecl.fncFlags |= FncFlags.IsFunctionExpression;
            funcDecl.hint = "set" + node.propertyName.text();

            var result = new BinaryExpression(NodeType.Member, name, funcDecl);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitFunctionExpression(node: FunctionExpressionSyntax): FuncDecl {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.functionKeyword);
            var name = node.identifier === null ? null : this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            var typeParameters = node.callSignature.typeParameterList === null ? null : node.callSignature.typeParameterList.accept(this);
            var parameters = node.callSignature.parameterList.accept(this);
            var returnType = node.callSignature.typeAnnotation
                ? node.callSignature.typeAnnotation.accept(this)
                : null;

            this.pushDeclLists();

            var bod = this.convertBlock(node.block);
            if (bod) {
                bod.append(new EndCode());
            }

            var funcDecl = new FuncDecl(name, bod, false, typeParameters, parameters, this.topVarList(),
                this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, start, this.position);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.variableArgList = this.hasDotDotDotParameter(node.callSignature.parameterList.parameters);
            funcDecl.returnTypeAnnotation = returnType;
            funcDecl.fncFlags |= FncFlags.IsFunctionExpression;

            return funcDecl;
        }

        private visitEmptyStatement(node: EmptyStatementSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.semicolonToken);

            var result = new AST(NodeType.Empty);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitTryStatement(node: TryStatementSyntax): AST {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.tryKeyword);
            var block = node.block.accept(this);

            var tryPart: AST = new Try(block);
            this.setSpan(tryPart, start, this.position);

            var tryCatch: TryCatch = null;
            if (node.catchClause !== null) {
                var catchBit = node.catchClause.accept(this);

                tryCatch = new TryCatch(<Try>tryPart, catchBit);
                this.setSpan(tryCatch, start, this.position);
            }

            if (node.finallyClause !== null) {
                if (tryCatch !== null) {
                    tryPart = tryCatch;
                }

                var finallyBit = node.finallyClause.accept(this);

                var result = new TryFinally(tryPart, finallyBit);
                this.setSpan(result, start, this.position);

                return result;
            }

            Debug.assert(tryCatch !== null);
            return tryCatch;
        }

        private visitCatchClause(node: CatchClauseSyntax): Catch {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.catchKeyword);
            this.movePast(node.openParenToken);
            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.closeParenToken);
            var block = node.block.accept(this);

            var varDecl = new VarDecl(identifier, 0);
            this.setSpan(varDecl, identifier.minChar, identifier.limChar);

            var result = new Catch(varDecl, block);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitFinallyClause(node: FinallyClauseSyntax): Finally {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.finallyKeyword);
            var block = node.block.accept(this);

            var result = new Finally(block);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitLabeledStatement(node: LabeledStatementSyntax): LabeledStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            var identifier = this.identifierFromToken(node.identifier, /*isOptional:*/ false);
            this.movePast(node.identifier);
            this.movePast(node.colonToken);
            var statement = node.statement.accept(this);

            var labelList = new ASTList();
            labelList.append(new Label(identifier));

            var result = new LabeledStatement(labelList, statement);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitDoStatement(node: DoStatementSyntax): DoWhileStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.doKeyword);
            var statement = node.statement.accept(this);
            var whileAst = this.identifierFromToken(node.whileKeyword, /*isOptional:*/ false);
            this.movePast(node.whileKeyword);
            this.movePast(node.openParenToken);
            var condition = node.condition.accept(this);
            this.movePast(node.closeParenToken);
            this.movePast(node.semicolonToken);

            var result = new DoWhileStatement();
            this.setSpan(result, start, this.position);

            result.whileAST = whileAst;
            result.cond = condition;
            result.body = statement;

            return result;
        }

        private visitTypeOfExpression(node: TypeOfExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.typeOfKeyword);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.Typeof, expression);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitDeleteExpression(node: DeleteExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.deleteKeyword);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.Delete, expression);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitVoidExpression(node: VoidExpressionSyntax): UnaryExpression {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.voidKeyword);
            var expression = node.expression.accept(this);

            var result = new UnaryExpression(NodeType.Void, expression);
            this.setSpan(result, start, this.position);

            return result;
        }

        private visitDebuggerStatement(node: DebuggerStatementSyntax): DebuggerStatement {
            this.assertElementAtPosition(node);

            var start = this.position;
            this.movePast(node.debuggerKeyword);
            this.movePast(node.semicolonToken);

            var result = new DebuggerStatement();
            this.setSpan(result, start, this.position);

            return result;
        }
    }
}