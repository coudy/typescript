/// <reference path='Syntax\SyntaxVisitor.generated.ts' />
/// <reference path='Syntax\SyntaxWalker.generated.ts' />
/// <reference path='Syntax\SyntaxInformationMap.ts' />
/// <reference path='ast.ts' />

module TypeScript {
    export class SyntaxTreeToAstVisitor implements ISyntaxVisitor {
        private nestingLevel = 0;

        private varLists: ASTList[] = [];
        private scopeLists: ASTList[] = [];
        private staticsLists: ASTList[] = [];

        private requiresExtendsBlock: bool = false;

        constructor(private syntaxInformationMap: SyntaxInformationMap,
                    private fileName: string,
                    private unitIndex: number) {
        }

        public static visit(sourceUnit: SourceUnitSyntax, fileName: string, unitIndex: number): Script {
            var map = null;// SyntaxInformationMap.create(sourceUnit);
            var visitor = new SyntaxTreeToAstVisitor(map, fileName, unitIndex);
            return sourceUnit.accept(visitor);
        }

        private start(element: ISyntaxElement): number {
            return 0;
            // return this.syntaxInformationMap.start(element);
        }

        private end(element: ISyntaxElement): number {
            return 0;
            // return this.syntaxInformationMap.end(element);
        }

        private setSpan(span: ASTSpan, element: ISyntaxElement) {
            span.minChar = this.start(element);
            span.limChar = this.end(element);
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

            result.minChar = this.start(token);
            result.limChar = this.end(token);

            return result;
        }

        private visitSyntaxList(list: ISyntaxList): ASTList {
            var result = new ASTList();
            this.setSpan(result, list);

            for (var i = 0, n = list.childCount(); i < n; i++) {
                result.append(list.childAt(i).accept(this));
            }

            return result;
        }

        private visitSeparatedSyntaxList(list: ISeparatedSyntaxList): ASTList {
            var result = new ASTList();
            this.setSpan(result, list);

            for (var i = 0, n = list.nonSeparatorCount(); i < n; i++) {
                result.append(list.nonSeparatorAt(i).accept(this));
            }
            
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

        private convertComments(triviaList: ISyntaxTriviaList): Comment[]{
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

            this.setSpan(result, token);
            return result;
        }

        private hasTopLevelImportOrExport(node: SourceUnitSyntax): bool {
            // TODO: implement this.
            for (var i = 0, n = node.moduleElements().childCount(); i < n; i++) {
                var moduleElement = node.moduleElements().childAt(i);

                var firstToken = moduleElement.firstToken();
                if (firstToken !== null && firstToken.kind() === SyntaxKind.ExportKeyword) {
                    return true;
                }

                if (moduleElement.kind() === SyntaxKind.ImportDeclaration) {
                    var importDecl = <ImportDeclarationSyntax>moduleElement;
                    if (importDecl.moduleReference().kind() === SyntaxKind.ExternalModuleReference) {
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
            var members;
            this.pushDeclLists();

            var isParsingDeclareFile = isDSTRFile(this.fileName) || isDTSFile(this.fileName);

            var bod = this.visitSyntaxList(node.moduleElements());

            var topLevelMod: ModuleDeclaration = null;
            if (moduleGenTarget != ModuleGenTarget.Local && this.hasTopLevelImportOrExport(node)) {
                var correctedFileName = switchToForwardSlashes(this.fileName);
                var id: Identifier = new Identifier(correctedFileName);
                topLevelMod = new ModuleDeclaration(id, bod, this.topVarList(), null);
                this.setSpan(topLevelMod, node);

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
                this.setSpan(bod, node);
                bod.append(topLevelMod);
            }

            var result = new Script(this.topVarList(), this.topScopeList());
            this.setSpan(result, node);

            this.popDeclLists();

            result.bod = bod;
            result.locationInfo = new LocationInfo(this.fileName, null, this.unitIndex);
            result.topLevelMod = topLevelMod;
            result.isDeclareFile = isDSTRFile(this.fileName) || isDTSFile(this.fileName);
            result.requiresExtendsBlock = this.requiresExtendsBlock;

            return result;
        }

        private visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any {
            throw Errors.notYetImplemented();
        }

        private visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any {
            throw Errors.notYetImplemented();
        }

        private visitClassDeclaration(node: ClassDeclarationSyntax): ClassDeclaration {
            var name = this.identifierFromToken(node.identifier(), /*isOptional:*/ false);
            var typeParameters = node.typeParameterList() === null ? null : node.typeParameterList().accept(this);

            var extendsList = node.extendsClause() ? node.extendsClause().accept(this) : new ASTList();
            var implementsList = node.implementsClause() ? node.implementsClause().accept(this) : new ASTList();
            var members = this.visitSyntaxList(node.classElements());

            this.requiresExtendsBlock = this.requiresExtendsBlock || !!node.extendsClause();

            var result = new ClassDeclaration(name, typeParameters, members, extendsList, implementsList);
            this.setSpan(result, node);

            if (node.exportKeyword()) {
                result.varFlags |= VarFlags.Exported;
            }

            if (node.declareKeyword()) {
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
            for (var i = 0, n = node.classElements().childCount(); i < n; i++) {
                var classElement = <IClassElementSyntax>node.classElements().childAt(i);

                if (classElement.kind() === SyntaxKind.MemberVariableDeclaration) {
                    var variableDeclaration = <MemberVariableDeclarationSyntax>classElement;
                    knownMemberNames[this.identifierFromToken(variableDeclaration.variableDeclarator().identifier(), /*isOptional:*/ false).actualText] = true;
                }
                else if (classElement.kind() === SyntaxKind.MemberFunctionDeclaration) {
                    var functionDeclaration = <MemberFunctionDeclarationSyntax>classElement;
                    knownMemberNames[this.identifierFromToken(functionDeclaration.functionSignature().identifier(), /*isOptional:*/ false).actualText] = true;
                }
            }

            result.knownMemberNames = knownMemberNames;

            return result;
        }

        private visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any {
            var name = this.identifierFromToken(node.identifier(), /*isOptional:*/ false);
            var typeParameters = node.typeParameterList() === null ? null : node.typeParameterList().accept(this);
            var extendsList = node.extendsClause() ? node.extendsClause().accept(this) : null;
            var members = this.visitSeparatedSyntaxList(node.body().typeMembers());

            var result = new InterfaceDeclaration(name, typeParameters, members, extendsList, null);
            this.setSpan(result, node);

            //if (node.publicOrPrivateKeyword()) {
            //    result.varFlags |= VarFlags.Private;
            //}
            //if (hasFlag(modifiers, Modifiers.Public)) {
            //    result.varFlags |= VarFlags.Public;
            //}
            if (node.exportKeyword()) {
                result.varFlags |= VarFlags.Exported;
            }

            return result;
        }

        private visitExtendsClause(node: ExtendsClauseSyntax): ASTList {
            var result = new ASTList();

            for (var i = 0, n = node.typeNames().nonSeparatorCount(); i < n; i++) {
                var type = this.visitType(node.typeNames().nonSeparatorAt(i));
                if (type.nodeType === NodeType.TypeRef) {
                    type = (<TypeReference>type).term;
                }

                result.append(type);
            }

            return result;
        }

        private visitImplementsClause(node: ImplementsClauseSyntax): ASTList {
            var result = new ASTList();

            for (var i = 0, n = node.typeNames().nonSeparatorCount(); i < n; i++) {
                var type = this.visitType(node.typeNames().nonSeparatorAt(i));
                if (type.nodeType === NodeType.TypeRef) {
                    type = (<TypeReference>type).term;
                }

                result.append(type);
            }
            
            return result;
        }

        private getModuleNamesInReverse(node: ModuleDeclarationSyntax): ISyntaxToken[]{
            var result: ISyntaxToken[] = [];

            if (node.stringLiteral() !== null) {
                result.push(node.stringLiteral());
            }
            else {
                var current = node.moduleName();
                while (current.kind() === SyntaxKind.QualifiedName) {
                    result.push((<QualifiedNameSyntax>current).right());
                    current = (<QualifiedNameSyntax>current).left();
                }

                result.push(<ISyntaxToken>current);
            }

            return result;
        }

        private spanFromToken(token: ISyntaxToken): ASTSpan {
            var result = new ASTSpan();
            result.minChar = this.start(token);
            result.limChar = this.end(token);
            return result;
        }

        private visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleDeclaration {
            this.pushDeclLists();

            var members = this.visitSyntaxList(node.moduleElements());
            var namesInReverse = this.getModuleNamesInReverse(node);

            var moduleDecl: ModuleDeclaration = null;
            for (var i = 0; i < namesInReverse.length; i++) {
                var innerName = this.identifierFromToken(namesInReverse[i], /*isOptional:*/ false);

                var moduleDecl = new ModuleDeclaration(innerName, members, this.topVarList(), this.spanFromToken(node.closeBraceToken()));
                this.setSpan(moduleDecl, node);
                //innerDecl.preComments = preComments;

                //if (this.parsingDeclareFile || hasFlag(modifiers, Modifiers.Ambient)) {
                //    innerDecl.modFlags |= ModuleFlags.Ambient;
                //}

                moduleDecl.modFlags |= ModuleFlags.Exported;

                // REVIEW: will also possibly need to re-parent comments as well

                if (i === 0) {
                    this.popDeclLists();
                }

                members = new ASTList();
                members.append(moduleDecl);
            }

            if (node.declareKeyword()) {
                moduleDecl.modFlags |= ModuleFlags.Ambient;
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
                if ((<ParameterSyntax>parameters.nonSeparatorAt(i)).dotDotDotToken()) {
                    return true;
                }
            }

            return false;
        }

        private visitFunctionDeclaration(node: FunctionDeclarationSyntax): any {
            var name = this.identifierFromToken(node.functionSignature().identifier(), !!node.functionSignature().questionToken());
            var typeParameters = node.functionSignature().callSignature().typeParameterList() === null ? null : node.functionSignature().callSignature().typeParameterList().accept(this);
            var parameters = node.functionSignature().callSignature().parameterList().accept(this);

            var returnType = node.functionSignature().callSignature().typeAnnotation()
                ? node.functionSignature().callSignature().typeAnnotation().accept(this)
                : null;

            this.pushDeclLists();

            var bod = node.block() ? this.visitSyntaxList(node.block().statements()) : null;
            if (bod) {
                bod.append(new EndCode());
            }

            var funcDecl = new FuncDecl(name, bod, false, typeParameters, parameters, this.topVarList(),
                this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.variableArgList = this.hasDotDotDotParameter(node.functionSignature().callSignature().parameterList().parameters());
            funcDecl.returnTypeAnnotation = returnType;
            funcDecl.variableArgList = this.hasDotDotDotParameter(node.functionSignature().callSignature().parameterList().parameters());
            
            if (node.exportKeyword()) {
                funcDecl.fncFlags |= FncFlags.Exported;
            }

            if (node.declareKeyword()) {
                funcDecl.fncFlags |= FncFlags.Ambient;
            }

            if (node.semicolonToken()) {
                funcDecl.fncFlags |= FncFlags.Signature;
            }

            return funcDecl;
        }

        private visitEnumDeclaration(enumDeclaration: EnumDeclarationSyntax): ModuleDeclaration {
            var name = this.identifierFromToken(enumDeclaration.identifier(), /*isOptional:*/ false);

            var membersMinChar = this.start(enumDeclaration.openBraceToken());
            this.pushDeclLists();

            var members = new ASTList();
            members.minChar = membersMinChar;

            var mapDecl = new VarDecl(new Identifier("_map"), 0);
            mapDecl.varFlags |= VarFlags.Exported;
            mapDecl.varFlags |= VarFlags.Private;

            // REVIEW: Is this still necessary?
            mapDecl.varFlags |= (VarFlags.Property | VarFlags.Public);
            mapDecl.init = new UnaryExpression(NodeType.ArrayLit, null);
            members.append(mapDecl);
            var lastValue: NumberLiteral = null;
            var memberNames: Identifier[] = [];

            for (var i = 0, n = enumDeclaration.variableDeclarators().nonSeparatorCount(); i < n; i++) {
                var variableDeclarator = <VariableDeclaratorSyntax>enumDeclaration.variableDeclarators().nonSeparatorAt(i);

                var minChar = this.start(variableDeclarator);
                var limChar;
                var memberName: Identifier = this.identifierFromToken(variableDeclarator.identifier(), /*isOptional:*/ false);
                var memberValue: AST = null;
                var preComments = null;
                var postComments = null;

                limChar = this.start(variableDeclarator.identifier());
                preComments = this.convertComments(variableDeclarator.identifier().trailingTrivia());
                
                if (variableDeclarator.equalsValueClause() !== null) {
                    postComments = this.convertComments(variableDeclarator.equalsValueClause().equalsToken().trailingTrivia());
                    memberValue = variableDeclarator.equalsValueClause().accept(this);
                    lastValue = <NumberLiteral>memberValue;
                    limChar = this.end(variableDeclarator.equalsValueClause());
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
                member.minChar = minChar;
                member.limChar = limChar;
                member.init = memberValue;
                // Note: Leave minChar, limChar as "-1" on typeExpr as this is a parsing artifact.
                member.typeExpr = new TypeReference(this.createRef(name.actualText, name.hasEscapeSequence, -1), 0);
                member.varFlags |= (VarFlags.Readonly | VarFlags.Property);

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

                member.preComments = preComments;
                members.append(member);
                member.postComments = postComments;
                // all enum members are exported
                member.varFlags |= VarFlags.Exported;
            }

            var endingToken = new ASTSpan();
            endingToken.minChar = this.start(enumDeclaration.closeBraceToken());
            endingToken.limChar = this.end(enumDeclaration.closeBraceToken());

            members.limChar = endingToken.limChar;
            var modDecl = new ModuleDeclaration(name, members, this.topVarList(), endingToken);
            modDecl.modFlags |= ModuleFlags.IsEnum;
            this.popDeclLists();

            return modDecl;
        }

        private visitImportDeclaration(importDeclaration: ImportDeclarationSyntax): ImportDeclaration {
            var name: Identifier = null;
            var alias: AST = null;
            var importDecl: ImportDeclaration = null;
            var minChar = this.start(importDeclaration);
            var isDynamicImport = false;

            name = this.identifierFromToken(importDeclaration.identifier(), /*isOptional:*/ false);

            var aliasPreComments = this.convertTrailingComments(importDeclaration.equalsToken());

            var moduleReference = importDeclaration.moduleReference();
            var limChar = this.start(moduleReference);
            if (moduleReference.kind() === SyntaxKind.ExternalModuleReference) {
                alias = this.identifierFromToken((<ExternalModuleReferenceSyntax>moduleReference).stringLiteral(), /*isOptional:*/ false);
                isDynamicImport = true;
                alias.preComments = aliasPreComments;
            }
            else {
                alias = (<ModuleNameModuleReferenceSyntax>moduleReference).moduleName().accept(this);
                limChar = this.end(moduleReference);
            }

            importDecl = new ImportDeclaration(name, alias);
            importDecl.isDynamicImport = isDynamicImport;

            importDecl.minChar = minChar;
            importDecl.limChar = limChar;

            return importDecl;
        }

        private visitVariableStatement(node: VariableStatementSyntax): AST {
            var varList = node.variableDeclaration().accept(this);

            if (varList.nodeType === NodeType.VarDecl) {
                varDecl = <VarDecl>varList;
                varList = new ASTList();
                varList.append(varDecl);
            }

            for (var i = 0, n = varList.members.length; i < n; i++) {
                var varDecl = <VarDecl>varList.members[i];

                if (node.exportKeyword()) {
                    varDecl.varFlags |= VarFlags.Exported;
                }

                if (node.declareKeyword()) {
                    varDecl.varFlags |= VarFlags.Ambient;
                }
            }

            if (node.variableDeclaration().variableDeclarators().nonSeparatorCount() === 1) {
                return varList.members[0];
            }
            else {
                var result = new Block(varList, /*isStatementBlock:*/ false);
                this.setSpan(result, node);

                return result;
            }
        }

        private visitVariableDeclaration(node: VariableDeclarationSyntax): AST {
            var variableDecls = this.visitSeparatedSyntaxList(node.variableDeclarators());
            
            for (var i = 0; i < variableDecls.members.length; i++) {
                (<BoundDecl>variableDecls.members[i]).nestingLevel = i;
            }

            if (variableDecls.members.length === 1) {
                return variableDecls.members[0];
            }

            return variableDecls;
        }

        private visitVariableDeclarator(node: VariableDeclaratorSyntax): VarDecl {
            var name = this.identifierFromToken(node.identifier(), /*isOptional:*/ false);
            var result = new VarDecl(name, 0);
            this.setSpan(result, node);

            this.topVarList().append(result);

            if (node.equalsValueClause()) {
                result.init = node.equalsValueClause().accept(this);

                if (result.init.nodeType == NodeType.FuncDecl) {
                    var funcDecl = <FuncDecl>result.init;
                    funcDecl.hint = name.actualText;
                }
            }

            if (node.typeAnnotation()) {
                result.typeExpr = node.typeAnnotation().accept(this);
            }
            // TODO: more flags

            return result;
        }

        private visitEqualsValueClause(node: EqualsValueClauseSyntax): AST {
            return node.value().accept(this);
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
            var result = new UnaryExpression(
                this.getUnaryExpressionNodeType(node.kind()),
                node.operand().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): UnaryExpression {
            var expressions = this.visitSeparatedSyntaxList(node.expressions());
            if (node.expressions().childCount() > 0 && node.expressions().childAt(node.expressions().childCount() - 1).kind() === SyntaxKind.CommaToken) {
                expressions.append(new AST(NodeType.EmptyExpr));
            }

            var result = new UnaryExpression(NodeType.ArrayLit, expressions);
            this.setSpan(result, node);

            return result;
        }

        private visitOmittedExpression(node: OmittedExpressionSyntax): any {
            var result = new AST(NodeType.EmptyExpr);
            this.setSpan(result, node);

            return result;
        }

        private visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): AST {
            var result = node.expression().accept(this);
            result.isParenthesized = true;

            return result;
        }

        private getArrowFunctionStatements(body: ISyntaxNodeOrToken): ASTList {
            var statements: ASTList = null;

            if (body.kind() === SyntaxKind.Block) {
                var block = <BlockSyntax>body;

                statements = this.visitSyntaxList(block.statements());
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
            var parameters = new ASTList();
            parameters.append(new ArgDecl(this.identifierFromToken(node.identifier(), /*isOptional:*/ false)));
            var returnType = null;

            this.pushDeclLists();

            var statements = this.getArrowFunctionStatements(node.body());

            var result = new FuncDecl(null, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            this.popDeclLists();
            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.returnTypeAnnotation = returnType;
            result.fncFlags |= FncFlags.IsFunctionExpression;
            result.fncFlags |= FncFlags.IsFatArrowFunction;

            return result;
        }

        private visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): FuncDecl {
            var typeParameters = node.callSignature().typeParameterList() === null ? null : node.callSignature().typeParameterList().accept(this);
            var parameters = node.callSignature().parameterList().accept(this);
            var returnType = node.callSignature().typeAnnotation() ? node.callSignature().typeAnnotation().accept(this) : null;
            
            this.pushDeclLists();

            var statements = this.getArrowFunctionStatements(node.body());

            var result = new FuncDecl(null, statements, /*isConstructor:*/ false, typeParameters, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            this.popDeclLists();
            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.returnTypeAnnotation = returnType;
            result.fncFlags |= FncFlags.IsFunctionExpression;
            result.fncFlags |= FncFlags.IsFatArrowFunction;
            result.variableArgList = this.hasDotDotDotParameter(node.callSignature().parameterList().parameters());

            return result;
        }

        private visitType(type: ITypeSyntax): AST {
            if (type.isToken()) {
                return new TypeReference(this.identifierFromToken(<ISyntaxToken>type, /*isOptional:*/ false), 0);
            }
            else {
                return type.accept(this);
            }
        }

        private visitQualifiedName(node: QualifiedNameSyntax): TypeReference {
            var left = this.visitType(node.left());
            if (left.nodeType === NodeType.TypeRef) {
                left = (<TypeReference>left).term;
            }

            var result = new BinaryExpression(NodeType.Dot,
                left,
                this.identifierFromToken(node.right(), /*isOptional:*/ false));
            this.setSpan(result, node);

            return new TypeReference(result, 0);
        }

        private visitTypeArgumentList(node: TypeArgumentListSyntax): ASTList {
            var result = new ASTList();

            for (var i = 0, n = node.typeArguments().nonSeparatorCount(); i < n; i++) {
                result.append(this.visitType(node.typeArguments().nonSeparatorAt(i)));
            }

            return result;
        }

        private visitConstructorType(node: ConstructorTypeSyntax): any {
            throw Errors.notYetImplemented();
        }

        private visitFunctionType(node: FunctionTypeSyntax): TypeReference {
            var parameters = node.parameterList().accept(this);
            var typeParameters = node.typeParameterList() === null ? null : node.typeParameterList().accept(this);
            var result = new FuncDecl(null, null, false, typeParameters, parameters, null, null, null, NodeType.FuncDecl);
            this.setSpan(result, node);
            
            result.returnTypeAnnotation = node.type() ? this.visitType(node.type()) : null;
            // funcDecl.variableArgList = variableArgList;
            result.fncFlags |= FncFlags.Signature;
            result.variableArgList = this.hasDotDotDotParameter(node.parameterList().parameters());

            var typeRef = new TypeReference(result, 0);
            this.setSpan(typeRef, node);

            return typeRef;
        }

        private visitObjectType(node: ObjectTypeSyntax): TypeReference {
            var result = new InterfaceDeclaration(
                new Identifier("_anonymous"),
                null,
                this.visitSeparatedSyntaxList(node.typeMembers()),
                null, null);
            this.setSpan(result, node);

            var typeRef = new TypeReference(result, 0);
            this.setSpan(typeRef, node);

            return typeRef;
        }

        private visitArrayType(node: ArrayTypeSyntax): TypeReference {
            var count = 0;
            var current: ITypeSyntax = node;
            while (current.kind() === SyntaxKind.ArrayType) {
                count++;
                current = (<ArrayTypeSyntax>current).type();
            }

            var underlying = this.visitType(current);
            if (underlying.nodeType === NodeType.TypeRef) {
                underlying = (<TypeReference>underlying).term;
            }
            
            var result = new TypeReference(underlying, count);
            this.setSpan(result, node);

            return result;
        }

        private visitGenericType(node: GenericTypeSyntax): TypeReference {
            var underlying = this.visitType(node.name());
            if (underlying.nodeType === NodeType.TypeRef) {
                underlying = (<TypeReference>underlying).term;
            }

            var genericType = new GenericType(underlying, node.typeArgumentList().accept(this));
            return new TypeReference(genericType, 0);
        }
        
        private visitTypeAnnotation(node: TypeAnnotationSyntax): AST {
            return this.visitType(node.type());
        }

        private visitBlock(node: BlockSyntax): Block {
            var result = new Block(this.visitSyntaxList(node.statements()), /*isStatementBlock:*/ true);
            this.setSpan(result, node);

            return result;
        }

        private visitParameter(node: ParameterSyntax): ArgDecl {
            var result = new ArgDecl(this.identifierFromToken(node.identifier(), !!node.questionToken()));
            this.setSpan(result, node);

            result.isOptional = !!node.questionToken();
            
            if (node.publicOrPrivateKeyword()) {
                result.varFlags |= VarFlags.Property;

                if (node.publicOrPrivateKeyword().kind() === SyntaxKind.PublicKeyword) {
                    result.varFlags |= VarFlags.Public;
                }
                else {
                    result.varFlags |= VarFlags.Private;
                }
            }

            if (node.equalsValueClause()) {
                result.init = node.equalsValueClause().accept(this);
            }

            if (node.typeAnnotation()) {
                result.typeExpr = node.typeAnnotation().accept(this);
            }
            
            return result;
        }

        private visitMemberAccessExpression(node: MemberAccessExpressionSyntax): BinaryExpression {
            var expression: AST = node.expression().accept(this);
            expression.flags |= ASTFlags.DotLHS;

            var result = new BinaryExpression(NodeType.Dot, expression, this.identifierFromToken(node.name(), /*isOptional:*/ false));
            this.setSpan(result, node);

            return result;
        }

        private visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): UnaryExpression {
            var result = new UnaryExpression(node.kind() === SyntaxKind.PostIncrementExpression ? NodeType.IncPost : NodeType.DecPost,
                node.operand().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitElementAccessExpression(node: ElementAccessExpressionSyntax): BinaryExpression {
            var result = new BinaryExpression(NodeType.Index,
                node.expression().accept(this),
                node.argumentExpression().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitInvocationExpression(node: InvocationExpressionSyntax): CallExpression {
            var typeArguments = node.argumentList().typeArgumentList() !== null
                ? node.argumentList().typeArgumentList().accept(this)
                : null;

            var result = new CallExpression(NodeType.Call,
                node.expression().accept(this),
                typeArguments,
                node.argumentList().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitArgumentList(node: ArgumentListSyntax): ASTList {
            return this.visitSeparatedSyntaxList(node.arguments());
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
            var nodeType = this.getBinaryExpressionNodeType(node);
            var left = node.left().accept(this);
            var right = node.right().accept(this);

            var result = new BinaryExpression(nodeType, left, right);
            this.setSpan(result, node);

            if (right.nodeType === NodeType.FuncDecl) {
                var id = left.nodeType === NodeType.Dot ? (<BinaryExpression>left).operand2 : left;
                var idHint: string = id.nodeType === NodeType.Name ? id.actualText : null;

                var funcDecl = <FuncDecl>right;
                funcDecl.hint = idHint;
            }

            return result;
        }
        
        private visitConditionalExpression(node: ConditionalExpressionSyntax): ConditionalExpression {
            var result = new ConditionalExpression(
                node.condition().accept(this),
                node.whenTrue().accept(this),
                node.whenFalse().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitConstructSignature(node: ConstructSignatureSyntax): FuncDecl {
            var typeParameters = node.callSignature().typeParameterList() === null ? null : node.callSignature().typeParameterList().accept(this);
            var parameters = node.callSignature().parameterList().accept(this);

            var result = new FuncDecl(null, new ASTList(), /*isConstructor:*/ false, typeParameters, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            result.returnTypeAnnotation = node.callSignature().typeAnnotation()
                ? node.callSignature().typeAnnotation().accept(this)
                : null;

            result.hint = "_construct";
            result.fncFlags |= FncFlags.ConstructMember;
            result.variableArgList = this.hasDotDotDotParameter(node.callSignature().parameterList().parameters());

            var scopeList = this.topScopeList();
            scopeList.append(result);

            return result;
        }

        private visitFunctionSignature(node: FunctionSignatureSyntax): FuncDecl {
            var name = this.identifierFromToken(node.identifier(), !!node.questionToken());
            var typeParameters = node.callSignature().typeParameterList() === null ? null : node.callSignature().typeParameterList().accept(this);
            var parameters = node.callSignature().parameterList().accept(this);

            var result = new FuncDecl(name, new ASTList(), false, typeParameters, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            result.variableArgList = this.hasDotDotDotParameter(node.callSignature().parameterList().parameters());
            result.returnTypeAnnotation = node.callSignature().typeAnnotation()
                ? node.callSignature().typeAnnotation().accept(this)
                : null;

            var scopeList = this.topScopeList();
            scopeList.append(result);

            return result;
        }

        private visitIndexSignature(node: IndexSignatureSyntax): any {
            var name = new Identifier("__item");
            this.setSpan(name, node);

            var parameters = new ASTList();
            parameters.append(node.parameter().accept(this));
            
            var result = new FuncDecl(name, new ASTList(), /*isConstructor:*/ false, null, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            result.variableArgList = !!node.parameter().dotDotDotToken();
            result.returnTypeAnnotation = node.typeAnnotation()
                ? node.typeAnnotation().accept(this)
                : null;

            result.fncFlags |= FncFlags.IndexerMember;

            var scopeList = this.topScopeList();
            scopeList.append(result);

            return result;
        }

        private visitPropertySignature(node: PropertySignatureSyntax): any {
            var name = this.identifierFromToken(node.identifier(), !!node.questionToken());

            var result = new VarDecl(name, 0);
            this.setSpan(result, node);

            if (node.typeAnnotation()) {
                result.typeExpr = node.typeAnnotation().accept(this);
            }

            result.varFlags |= VarFlags.Property;
            return result;
        }

        private visitParameterList(node: ParameterListSyntax): ASTList {
            return this.visitSeparatedSyntaxList(node.parameters());
        }

        private visitCallSignature(node: CallSignatureSyntax): any {
            var typeParameters = node.typeParameterList() === null ? null : node.typeParameterList().accept(this);
            var parameters = node.parameterList().accept(this);

            var result = new FuncDecl(null, new ASTList(), /*isConstructor:*/ false, typeParameters, parameters, new ASTList(), new ASTList(), new ASTList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            result.variableArgList = this.hasDotDotDotParameter(node.parameterList().parameters());
            result.returnTypeAnnotation = node.typeAnnotation()
                ? node.typeAnnotation().accept(this)
                : null;

            result.hint = "_call";
            result.fncFlags |= FncFlags.CallMember;

            var scopeList = this.topScopeList();
            scopeList.append(result);

            return result;
        }

        private visitTypeParameterList(node: TypeParameterListSyntax): ASTList {
            return this.visitSeparatedSyntaxList(node.typeParameters());
        }

        private visitTypeParameter(node: TypeParameterSyntax): TypeParameter {
            var result = new TypeParameter(
                this.identifierFromToken(node.identifier(), /*isOptional:*/ false),
                node.constraint() === null ? null : node.constraint().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitConstraint(node: ConstraintSyntax): any {
            return this.visitType(node.type());
        }

        private visitIfStatement(node: IfStatementSyntax): IfStatement {
            var result = new IfStatement(node.condition().accept(this));
            this.setSpan(result, node);

            result.thenBod = node.statement().accept(this);
            if (node.elseClause() !== null) {
                result.elseBod = node.elseClause().accept(this);
            }

            return result;
        }

        private visitElseClause(node: ElseClauseSyntax): Statement {
            return node.statement().accept(this);
        }

        private visitExpressionStatement(node: ExpressionStatementSyntax): AST {
            var result = node.expression().accept(this);
            this.setSpan(result, node);

            result.flags |= ASTFlags.IsStatement;

            return result;
        }

        private visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any {
            var parameters = node.parameterList().accept(this);

            this.pushDeclLists();

            var statements = node.block() ? this.visitSyntaxList(node.block().statements()) : null;
            if (statements) {
                statements.append(new EndCode());
            }
            var result = new FuncDecl(null, statements, /*isConstructor:*/ true, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.variableArgList = this.hasDotDotDotParameter(node.parameterList().parameters());
            // constructorFuncDecl.preComments = preComments;
            //if (requiresSignature && !isAmbient) {
            //    constructorFuncDecl.isOverload = true;
            //}

            // constructorFuncDecl.variableArgList = variableArgList;
            // this.currentClassDecl = null;

            //if (isAmbient) {
            //    constructorFuncDecl.fncFlags |= FncFlags.Ambient;
            //}

            if (node.semicolonToken()) {
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

            //// REVIEW: Should we have a separate flag for class constructors?  (Constructors are not methods)
            //constructorFuncDecl.fncFlags |= FncFlags.ClassMethod;

            //this.currentClassDefinition.members.members[this.currentClassDefinition.members.members.length] = constructorFuncDecl;

            //this.parsingClasvisisConstructorDefinition = false;

            return result;
        }

        private visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): FuncDecl {
            var name = this.identifierFromToken(node.functionSignature().identifier(), !!node.functionSignature().questionToken());
            var typeParameters = node.functionSignature().callSignature().typeParameterList() === null ? null : node.functionSignature().callSignature().typeParameterList().accept(this);
            var parameters = node.functionSignature().callSignature().parameterList().accept(this);

            this.pushDeclLists();

            var statements = node.block() ? this.visitSyntaxList(node.block().statements()) : null;
            if (statements) {
                statements.append(new EndCode());
            }
            var result = new FuncDecl(name, statements, /*isConstructor:*/ false, typeParameters, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.variableArgList = this.hasDotDotDotParameter(node.functionSignature().callSignature().parameterList().parameters());
            result.returnTypeAnnotation = node.functionSignature().callSignature().typeAnnotation()
                ? node.functionSignature().callSignature().typeAnnotation().accept(this)
                : null;

            if (node.semicolonToken()) {
                result.fncFlags |= FncFlags.Signature;
            }

            if (node.publicOrPrivateKeyword()) {
                if (node.publicOrPrivateKeyword().kind() === SyntaxKind.PrivateKeyword) {
                    result.fncFlags |= FncFlags.Private;
                }
                else {
                    result.fncFlags |= FncFlags.Public;
                }
            }

            if (node.staticKeyword()) {
                result.fncFlags |= FncFlags.Static;
            }

            return result;
        }

        private visitMemberAccessorDeclaration(node: MemberAccessorDeclarationSyntax): FuncDecl {
            var name = this.identifierFromToken(node.identifier(), /*isOptional:*/ false);
            var parameters = node.parameterList().accept(this);

            this.pushDeclLists();

            var statements = node.block() ? this.visitSyntaxList(node.block().statements()) : null;
            if (statements) {
                statements.append(new EndCode());
            }
            var result = new FuncDecl(name, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(result, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(result);

            result.variableArgList = this.hasDotDotDotParameter(node.parameterList().parameters());

            if (node.publicOrPrivateKeyword()) {
                if (node.publicOrPrivateKeyword().kind() === SyntaxKind.PrivateKeyword) {
                    result.fncFlags |= FncFlags.Private;
                }
                else {
                    result.fncFlags |= FncFlags.Public;
                }
            }

            if (node.staticKeyword()) {
                result.fncFlags |= FncFlags.Static;
            }

            return result;
        }

        private visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): FuncDecl {
            var result = this.visitMemberAccessorDeclaration(node);

            result.fncFlags |= FncFlags.GetAccessor;
            result.hint = "get" + result.name.actualText;

            result.returnTypeAnnotation = node.typeAnnotation()
                ? node.typeAnnotation().accept(this)
                : null;

            return result;
        }

        private visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): FuncDecl {
            var result = this.visitMemberAccessorDeclaration(node);

            result.fncFlags |= FncFlags.SetAccessor;
            result.hint = "set" + result.name.actualText;

            return result;
        }

        private visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): VarDecl {
            var name = this.identifierFromToken(node.variableDeclarator().identifier(), /*isOptional:*/ false);
            var varDecl = new VarDecl(name, 0);
            this.setSpan(varDecl, node.variableDeclarator());

            if (node.variableDeclarator().typeAnnotation()) {
                varDecl.typeExpr = node.variableDeclarator().typeAnnotation().accept(this);
            }

            if (node.variableDeclarator().equalsValueClause()) {
                varDecl.init = node.variableDeclarator().equalsValueClause().accept(this);
            }

            if (node.staticKeyword()) {
                varDecl.varFlags |= VarFlags.Static;
            }

            if (node.publicOrPrivateKeyword()) {
                if (node.publicOrPrivateKeyword().kind() === SyntaxKind.PrivateKeyword) {
                    varDecl.varFlags |= VarFlags.Private;
                }
                else {
                    varDecl.varFlags |= VarFlags.Public;
                }
            }

            varDecl.varFlags |= VarFlags.Property;

            // this.currentClassDefinition.knownMemberNames[text.actualText] = true;

            //if (!isDeclaredInConstructor) {
            //    this.currentClassDefinition.members.members[this.currentClassDefinition.members.members.length] = varDecl;
            //}

            // varDecl.postComments = this.parseComments();
            return varDecl;
        }

        private visitThrowStatement(node: ThrowStatementSyntax): UnaryExpression {
            var result = new UnaryExpression(NodeType.Throw, node.expression().accept(this));
            this.setSpan(result, node);
            
            return result;
        }

        private visitReturnStatement(node: ReturnStatementSyntax): ReturnStatement {
            var result = new ReturnStatement();
            this.setSpan(result, node);

            if (node.expression() !== null) {
                result.returnExpression = node.expression().accept(this);
            }

            return result;
        }

        private visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): CallExpression {
            var expression = node.expression().accept(this);
            if (expression.nodeType === NodeType.TypeRef) {
                var typeRef = <TypeReference>expression;

                if (typeRef.arrayCount === 0) {
                    var term = typeRef.term;
                    if (term.nodeType === NodeType.Dot || term.nodeType === NodeType.Name) {
                        expression = term;
                    }
                }
            }



            var result = new CallExpression(NodeType.New,
                expression,
                node.argumentList() === null || node.argumentList().typeArgumentList() === null ? null : node.argumentList().typeArgumentList().accept(this),
                node.argumentList() === null ? null : node.argumentList().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitSwitchStatement(node: SwitchStatementSyntax): SwitchStatement {
            var result = new SwitchStatement(node.expression().accept(this));
            this.setSpan(result, node);

            result.statement.minChar = this.start(node);
            result.statement.limChar = this.end(node.closeParenToken());

            result.caseList = new ASTList()

            for (var i = 0, n = node.switchClauses().childCount(); i < n; i++) {
                var switchClause = node.switchClauses().childAt(i);
                var translated = switchClause.accept(this);

                if (switchClause.kind() === SyntaxKind.DefaultSwitchClause) {
                    result.defaultCase = translated;
                }

                result.caseList.append(translated);
            }

            return result;
        }

        private visitCaseSwitchClause(node: CaseSwitchClauseSyntax): CaseStatement {
            var result = new CaseStatement();
            this.setSpan(result, node);

            result.expr = node.expression().accept(this);
            result.body = this.visitSyntaxList(node.statements());

            return result;
        }

        private visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): CaseStatement {
            var result = new CaseStatement();
            this.setSpan(result, node);

            result.body = this.visitSyntaxList(node.statements());

            return result;
        }

        private visitBreakStatement(node: BreakStatementSyntax): Jump {
            var result = new Jump(NodeType.Break);
            this.setSpan(result, node);

            if (node.identifier() !== null) {
                result.target = this.valueText(node.identifier());
            }

            return result;
        }

        private visitContinueStatement(node: ContinueStatementSyntax): Jump {
            var result = new Jump(NodeType.Continue);
            this.setSpan(result, node);

            if (node.identifier() !== null) {
                result.target = this.valueText(node.identifier());
            }

            return result;
        }

        private visitForStatement(node: ForStatementSyntax): ForStatement {
            var init = node.variableDeclaration() !== null
                ? node.variableDeclaration().accept(this)
                : node.initializer() !== null
                    ? node.initializer().accept(this)
                    : null;
            var result = new ForStatement(init);
            this.setSpan(result, node);

            result.cond = node.condition() === null ? null : node.condition().accept(this);
            result.incr = node.incrementor() === null ? null : node.incrementor().accept(this);
            result.body = node.statement().accept(this);

            return result;
        }

        private visitForInStatement(node: ForInStatementSyntax): ForInStatement {
            var result = new ForInStatement(
                node.variableDeclaration() === null ? node.left().accept(this) : node.variableDeclaration().accept(this),
                node.expression().accept(this));
            this.setSpan(result, node);

            result.statement.minChar = this.start(node);
            result.statement.limChar = this.end(node.closeParenToken());

            result.body = node.statement().accept(this);

            return result;
        }

        private visitWhileStatement(node: WhileStatementSyntax): WhileStatement {
            var result = new WhileStatement(node.condition().accept(this));
            this.setSpan(result, node);

            result.body = node.statement().accept(this);

            return result;
        }

        private visitWithStatement(node: WithStatementSyntax): WithStatement {
            var result = new WithStatement(node.condition().accept(this));
            this.setSpan(result, node);

            result.body = node.statement().accept(this);

            return result;
        }

        private visitCastExpression(node: CastExpressionSyntax): UnaryExpression {
            var result = new UnaryExpression(NodeType.TypeAssertion, node.expression().accept(this));
            this.setSpan(result, node);

            result.castTerm = this.visitType(node.type());

            return result;
        }

        private visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): UnaryExpression {
            var result = new UnaryExpression(NodeType.ObjectLit, this.visitSeparatedSyntaxList(node.propertyAssignments()));
            this.setSpan(result, node);

            return result;
        }

        private visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): BinaryExpression {
            var left = node.propertyName().accept(this);
            var right = node.expression().accept(this);

            var result = new BinaryExpression(NodeType.Member, left, right);
            this.setSpan(result, node);

            if (right.nodeType == NodeType.FuncDecl) {
                var funcDecl = <FuncDecl>right;
                funcDecl.hint = left.text;
            }
            
            return result;
        }

        private visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): BinaryExpression {
            var parameters = new ASTList();

            var idHint = "get" + node.propertyName().text();
            var name = this.identifierFromToken(node.propertyName(), /*isOptional:*/ false);

            this.pushDeclLists();

            var statements = this.visitSyntaxList(node.block().statements());
            statements.append(new EndCode());

            var funcDecl = new FuncDecl(name, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.fncFlags |= FncFlags.GetAccessor;
            funcDecl.fncFlags |= FncFlags.IsFunctionExpression;
            funcDecl.hint = idHint;

            var result = new BinaryExpression(NodeType.Member, name, funcDecl);
            this.setSpan(result, node);

            return result;
        }

        private visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): BinaryExpression {
            var parameter = new ArgDecl(this.identifierFromToken(node.parameterName(), /*isOptional:*/ false));
            this.setSpan(parameter, node.parameterName());

            var parameters = new ASTList();
            parameters.append(parameter);

            var idHint = "set" + node.propertyName().text();
            var name = this.identifierFromToken(node.propertyName(), /*isOptional:*/ false);

            this.pushDeclLists();

            var statements = this.visitSyntaxList(node.block().statements());
            statements.append(new EndCode());

            var funcDecl = new FuncDecl(name, statements, /*isConstructor:*/ false, null, parameters, this.topVarList(),
                                        this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.fncFlags |= FncFlags.SetAccessor;
            funcDecl.fncFlags |= FncFlags.IsFunctionExpression;
            funcDecl.hint = idHint;

            var result = new BinaryExpression(NodeType.Member, name, funcDecl);
            this.setSpan(result, node);

            return result;
        }

        private visitFunctionExpression(node: FunctionExpressionSyntax): any {
            var name = node.identifier() === null ? null : this.identifierFromToken(node.identifier(), /*isOptional:*/ false);
            var typeParameters = node.callSignature().typeParameterList() === null ? null : node.callSignature().typeParameterList().accept(this);
            var parameters = node.callSignature().parameterList().accept(this);

            var returnType = node.callSignature().typeAnnotation()
                ? node.callSignature().typeAnnotation().accept(this)
                : null;

            this.pushDeclLists();

            var bod = node.block() ? this.visitSyntaxList(node.block().statements()) : null;
            if (bod) {
                bod.append(new EndCode());
            }

            var funcDecl = new FuncDecl(name, bod, false, typeParameters, parameters, this.topVarList(),
                this.topScopeList(), this.topStaticsList(), NodeType.FuncDecl);
            this.setSpan(funcDecl, node);

            this.popDeclLists();

            var scopeList = this.topScopeList();
            scopeList.append(funcDecl);

            funcDecl.variableArgList = this.hasDotDotDotParameter(node.callSignature().parameterList().parameters());
            funcDecl.returnTypeAnnotation = returnType;
            funcDecl.fncFlags |= FncFlags.IsFunctionExpression;

            return funcDecl;
        }

        private visitEmptyStatement(node: EmptyStatementSyntax): AST {
            var result = new AST(NodeType.Empty);
            this.setSpan(result, node);
            return result;
        }

        private visitTryStatement(node: TryStatementSyntax): AST {
            var tryPart: AST = new Try(node.block().accept(this));
            this.setSpan(tryPart, node);

            var tryCatch: TryCatch = null;
            if (node.catchClause() !== null) {
                var catchBit = node.catchClause().accept(this);

                tryCatch = new TryCatch(<Try>tryPart, catchBit);
                
                tryCatch.minChar = tryPart.minChar;
                tryCatch.limChar = catchBit.limChar;
            }

            if (node.finallyClause() !== null) {
                if (tryCatch !== null) {
                    tryPart = tryCatch;
                }

                var finallyBit = node.finallyClause().accept(this);

                var result = new TryFinally(tryPart, finallyBit);
                this.setSpan(result, node);

                return result;
            }

            Debug.assert(tryCatch !== null);
            return tryCatch;
        }

        private visitCatchClause(node: CatchClauseSyntax): Catch {
            var varDecl = new VarDecl(this.identifierFromToken(node.identifier(), /*isOptional:*/ false), 0);
            this.setSpan(varDecl, node.identifier());

            var result = new Catch(varDecl, node.block().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitFinallyClause(node: FinallyClauseSyntax): Finally {
            var result = new Finally(node.block().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitLabeledStatement(node: LabeledStatementSyntax): LabeledStatement {
            var labelList = new ASTList();
            labelList.append(new Label(this.identifierFromToken(node.identifier(), /*isOptional:*/ false)));

            var result = new LabeledStatement(labelList, node.statement().accept(this));
            this.setSpan(result, node);

            return result;
        }

        private visitDoStatement(node: DoStatementSyntax): DoWhileStatement {
            var result = new DoWhileStatement();
            this.setSpan(result, node);

            result.whileAST = this.identifierFromToken(node.whileKeyword(), /*isOptional:*/ false);
            result.cond = node.condition().accept(this);
            result.body = node.statement().accept(this);

            return result;
        }

        private visitTypeOfExpression(node: TypeOfExpressionSyntax): UnaryExpression {
            var result = new UnaryExpression(NodeType.Typeof, node.expression().accept(this));
            this.setSpan(result, node);
            return result;
        }

        private visitDeleteExpression(node: DeleteExpressionSyntax): UnaryExpression {
            var result = new UnaryExpression(NodeType.Delete, node.expression().accept(this));
            this.setSpan(result, node);
            return result;
        }

        private visitVoidExpression(node: VoidExpressionSyntax): UnaryExpression {
            var result = new UnaryExpression(NodeType.Void, node.expression().accept(this));
            this.setSpan(result, node);
            return result;
        }

        private visitDebuggerStatement(statement: DebuggerStatementSyntax): DebuggerStatement {
            var result = new DebuggerStatement();
            this.setSpan(result, statement);
            return result;
        }
    }
}