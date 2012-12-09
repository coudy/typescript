///<reference path='References.ts' />


//class SyntaxRewriter implements ISyntaxVisitor1 {
//    public visitToken(token: ISyntaxToken): ISyntaxToken {
//        return token;
//    }

//    private visitList(list: ISyntaxList): ISyntaxList {
//        var newItems: SyntaxNode[] = null;

//        for (var i = 0, n = list.count(); i < n; i++) {
//            var item = list.syntaxNodeAt(i);
//            var newItem = <SyntaxNode>item.accept1(this);

//            if (item !== newItem && newItems === null) {
//                newItems = [];
//                for (var j = 0; j < i; j++) {
//                    newItems.push(list.syntaxNodeAt(j));
//                }
//            }

//            if (newItems) {
//                newItems.push(newItem);
//            }
//        }

//        Debug.assert(newItems === null || newItems.length === list.count());
//        return newItems === null ? list : SyntaxList.create(newItems);
//    }

//    private visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {
//        var newItems: any[] = null;

//        for (var i = 0, n = list.count(); i < n; i++) {
//            var item = list.itemAt(i);
//            var newItem = this.visit(item);

//            if (item !== newItem && newItems === null) {
//                newItems = [];
//                for (var j = 0; j < i; j++) {
//                    newItems.push(list.itemAt(j));
//                }
//            }

//            if (newItems) {
//                newItems.push(newItem);
//            }
//        }

//        Debug.assert(newItems === null || newItems.length === list.count());
//        return newItems === null ? list : SeparatedSyntaxList.create(newItems);
//    }

//    private visit(element: ISyntaxElement): ISyntaxElement {
//        if (element === null) {
//            return null;
//        }

//        if (element.isToken()) {
//            this.visitToken(<ISyntaxToken>element);
//        }
//        else if (element.isNode()) {
//            return (<SyntaxNode>element).accept1(this);
//        }
//        else if (element.isList()) {
//            return this.visitList(<ISyntaxList>element);
//        }
//        else if (element.isSeparatedList()) {
//            return this.visitSeparatedList(<ISeparatedSyntaxList>element);
//        }
//        else {
//            throw Errors.invalidOperation();
//        }
//    }

//    public visitSourceUnit(node: SourceUnitSyntax): SyntaxNode {
//        return node.update(
//            this.visit(node.moduleElements()),
//            this.visit(node.endOfFileToken()));
//    }

//    public visitExternalModuleReference(node: ExternalModuleReferenceSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.moduleKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.stringLiteral()),
//        this.visit(node.closeParenToken()));
//    }

//    public visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.moduleName()));
//    }

//    public visitImportDeclaration(node: ImportDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.importKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.equalsToken()),
//        this.visit(node.moduleReference()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitClassDeclaration(node: ClassDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.exportKeyword()),
//        this.visit(node.declareKeyword()),
//        this.visit(node.classKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.extendsClause()),
//        this.visit(node.implementsClause()),
//        this.visit(node.openBraceToken()),
//        this.visit(node.classElements()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.exportKeyword()),
//        this.visit(node.interfaceKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.extendsClause()),
//        this.visit(node.body()));
//    }

//    public visitExtendsClause(node: ExtendsClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.extendsKeyword()),
//        this.visit(node.typeNames()));
//    }

//    public visitImplementsClause(node: ImplementsClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.implementsKeyword()),
//        this.visit(node.typeNames()));
//    }

//    public visitModuleDeclaration(node: ModuleDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.exportKeyword()),
//        this.visit(node.declareKeyword()),
//        this.visit(node.moduleKeyword()),
//        this.visit(node.moduleName()),
//        this.visit(node.stringLiteral()),
//        this.visit(node.openBraceToken()),
//        this.visit(node.moduleElements()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitFunctionDeclaration(node: FunctionDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.exportKeyword()),
//        this.visit(node.declareKeyword()),
//        this.visit(node.functionKeyword()),
//        this.visit(node.functionSignature()),
//        this.visit(node.block()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitVariableStatement(node: VariableStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.exportKeyword()),
//        this.visit(node.declareKeyword()),
//        this.visit(node.variableDeclaration()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitVariableDeclaration(node: VariableDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.varKeyword()),
//        this.visit(node.variableDeclarators()));
//    }

//    public visitVariableDeclarator(node: VariableDeclaratorSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.identifier()),
//        this.visit(node.typeAnnotation()),
//        this.visit(node.equalsValueClause()));
//    }

//    public visitEqualsValueClause(node: EqualsValueClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.equalsToken()),
//        this.visit(node.value()));
//    }

//    public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.operatorToken()),
//        this.visit(node.operand()));
//    }

//    public visitThisExpression(node: ThisExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.thisKeyword()));
//    }

//    public visitLiteralExpression(node: LiteralExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.literalToken()));
//    }

//    public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openBracketToken()),
//        this.visit(node.expressions()),
//        this.visit(node.closeBracketToken()));
//    }

//    public visitOmittedExpression(node: OmittedExpressionSyntax): SyntaxNode {
//        return node;
//    }

//    public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openParenToken()),
//        this.visit(node.expression()),
//        this.visit(node.closeParenToken()));
//    }

//    public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpression): SyntaxNode {
//        return node.update(
//        this.visit(node.identifier()),
//        this.visit(node.equalsGreaterThanToken()),
//        this.visit(node.body()));
//    }

//    public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.callSignature()),
//        this.visit(node.equalsGreaterThanToken()),
//        this.visit(node.body()));
//    }

//    public visitIdentifierName(node: IdentifierNameSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.identifier()));
//    }

//    public visitQualifiedName(node: QualifiedNameSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.left()),
//        this.visit(node.dotToken()),
//        this.visit(node.right()));
//    }

//    public visitConstructorType(node: ConstructorTypeSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.newKeyword()),
//        this.visit(node.parameterList()),
//        this.visit(node.equalsGreaterThanToken()),
//        this.visit(node.type()));
//    }

//    public visitFunctionType(node: FunctionTypeSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.parameterList()),
//        this.visit(node.equalsGreaterThanToken()),
//        this.visit(node.type()));
//    }

//    public visitObjectType(node: ObjectTypeSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openBraceToken()),
//        this.visit(node.typeMembers()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitArrayType(node: ArrayTypeSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.type()),
//        this.visit(node.openBracketToken()),
//        this.visit(node.closeBracketToken()));
//    }

//    public visitPredefinedType(node: PredefinedTypeSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.keyword()));
//    }

//    public visitTypeAnnotation(node: TypeAnnotationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.colonToken()),
//        this.visit(node.type()));
//    }

//    public visitBlock(node: BlockSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openBraceToken()),
//        this.visit(node.statements()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitParameter(node: ParameterSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.dotDotDotToken()),
//        this.visit(node.publicOrPrivateKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.questionToken()),
//        this.visit(node.typeAnnotation()),
//        this.visit(node.equalsValueClause()));
//    }

//    public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.expression()),
//        this.visit(node.dotToken()),
//        this.visit(node.identifierName()));
//    }

//    public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.operand()),
//        this.visit(node.operatorToken()));
//    }

//    public visitElementAccessExpression(node: ElementAccessExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.expression()),
//        this.visit(node.openBracketToken()),
//        this.visit(node.argumentExpression()),
//        this.visit(node.closeBracketToken()));
//    }

//    public visitInvocationExpression(node: InvocationExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.expression()),
//        this.visit(node.argumentList()));
//    }

//    public visitArgumentList(node: ArgumentListSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openParenToken()),
//        this.visit(node.arguments()),
//        this.visit(node.closeParenToken()));
//    }

//    public visitBinaryExpression(node: BinaryExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.left()),
//        this.visit(node.operatorToken()),
//        this.visit(node.right()));
//    }

//    public visitConditionalExpression(node: ConditionalExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.condition()),
//        this.visit(node.questionToken()),
//        this.visit(node.whenTrue()),
//        this.visit(node.colonToken()),
//        this.visit(node.whenFalse()));
//    }

//    public visitConstructSignature(node: ConstructSignatureSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.newKeyword()),
//        this.visit(node.parameterList()),
//        this.visit(node.typeAnnotation()));
//    }

//    public visitFunctionSignature(node: FunctionSignatureSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.identifier()),
//        this.visit(node.questionToken()),
//        this.visit(node.parameterList()),
//        this.visit(node.typeAnnotation()));
//    }

//    public visitIndexSignature(node: IndexSignatureSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openBracketToken()),
//        this.visit(node.parameter()),
//        this.visit(node.closeBracketToken()),
//        this.visit(node.typeAnnotation()));
//    }

//    public visitPropertySignature(node: PropertySignatureSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.identifier()),
//        this.visit(node.questionToken()),
//        this.visit(node.typeAnnotation()));
//    }

//    public visitParameterList(node: ParameterListSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openParenToken()),
//        this.visit(node.parameters()),
//        this.visit(node.closeParenToken()));
//    }

//    public visitCallSignature(node: CallSignatureSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.parameterList()),
//        this.visit(node.typeAnnotation()));
//    }

//    public visitElseClause(node: ElseClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.elseKeyword()),
//        this.visit(node.statement()));
//    }

//    public visitIfStatement(node: IfStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.ifKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.condition()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.statement()),
//        this.visit(node.elseClause()));
//    }

//    public visitExpressionStatement(node: ExpressionStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.expression()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.constructorKeyword()),
//        this.visit(node.parameterList()),
//        this.visit(node.block()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.publicOrPrivateKeyword()),
//        this.visit(node.staticKeyword()),
//        this.visit(node.functionSignature()),
//        this.visit(node.block()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.publicOrPrivateKeyword()),
//        this.visit(node.staticKeyword()),
//        this.visit(node.getKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.parameterList()),
//        this.visit(node.typeAnnotation()),
//        this.visit(node.block()));
//    }

//    public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.publicOrPrivateKeyword()),
//        this.visit(node.staticKeyword()),
//        this.visit(node.setKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.parameterList()),
//        this.visit(node.block()));
//    }

//    public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.publicOrPrivateKeyword()),
//        this.visit(node.staticKeyword()),
//        this.visit(node.variableDeclarator()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitThrowStatement(node: ThrowStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.throwKeyword()),
//        this.visit(node.expression()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitReturnStatement(node: ReturnStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.returnKeyword()),
//        this.visit(node.expression()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.newKeyword()),
//        this.visit(node.expression()),
//        this.visit(node.argumentList()));
//    }

//    public visitSwitchStatement(node: SwitchStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.switchKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.expression()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.openBraceToken()),
//        this.visit(node.caseClauses()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.caseKeyword()),
//        this.visit(node.expression()),
//        this.visit(node.colonToken()),
//        this.visit(node.statements()));
//    }

//    public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.defaultKeyword()),
//        this.visit(node.colonToken()),
//        this.visit(node.statements()));
//    }

//    public visitBreakStatement(node: BreakStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.breakKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitContinueStatement(node: ContinueStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.continueKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitForStatement(node: ForStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.forKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.variableDeclaration()),
//        this.visit(node.initializer()),
//        this.visit(node.firstSemicolonToken()),
//        this.visit(node.condition()),
//        this.visit(node.secondSemicolonToken()),
//        this.visit(node.incrementor()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.statement()));
//    }

//    public visitForInStatement(node: ForInStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.forKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.variableDeclaration()),
//        this.visit(node.left()),
//        this.visit(node.inKeyword()),
//        this.visit(node.expression()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.statement()));
//    }

//    public visitWhileStatement(node: WhileStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.whileKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.condition()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.statement()));
//    }

//    public visitWithStatement(node: WithStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.withKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.condition()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.statement()));
//    }

//    public visitEnumDeclaration(node: EnumDeclarationSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.exportKeyword()),
//        this.visit(node.enumKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.openBraceToken()),
//        this.visit(node.variableDeclarators()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitCastExpression(node: CastExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.lessThanToken()),
//        this.visit(node.type()),
//        this.visit(node.greaterThanToken()),
//        this.visit(node.expression()));
//    }

//    public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.openBraceToken()),
//        this.visit(node.propertyAssignments()),
//        this.visit(node.closeBraceToken()));
//    }

//    public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.propertyName()),
//        this.visit(node.colonToken()),
//        this.visit(node.expression()));
//    }

//    public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.getKeyword()),
//        this.visit(node.propertyName()),
//        this.visit(node.openParenToken()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.block()));
//    }

//    public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.setKeyword()),
//        this.visit(node.propertyName()),
//        this.visit(node.openParenToken()),
//        this.visit(node.parameterName()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.block()));
//    }

//    public visitFunctionExpression(node: FunctionExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.functionKeyword()),
//        this.visit(node.identifier()),
//        this.visit(node.callSignature()),
//        this.visit(node.block()));
//    }

//    public visitEmptyStatement(node: EmptyStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.semicolonToken()));
//    }

//    public visitSuperExpression(node: SuperExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.superKeyword()));
//    }

//    public visitTryStatement(node: TryStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.tryKeyword()),
//        this.visit(node.block()),
//        this.visit(node.catchClause()),
//        this.visit(node.finallyClause()));
//    }

//    public visitCatchClause(node: CatchClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.catchKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.identifier()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.block()));
//    }

//    public visitFinallyClause(node: FinallyClauseSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.finallyKeyword()),
//        this.visit(node.block()));
//    }

//    public visitLabeledStatement(node: LabeledStatement): SyntaxNode {
//        return node.update(
//        this.visit(node.identifier()),
//        this.visit(node.colonToken()),
//        this.visit(node.statement()));
//    }

//    public visitDoStatement(node: DoStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.doKeyword()),
//        this.visit(node.statement()),
//        this.visit(node.whileKeyword()),
//        this.visit(node.openParenToken()),
//        this.visit(node.condition()),
//        this.visit(node.closeParenToken()),
//        this.visit(node.semicolonToken()));
//    }

//    public visitTypeOfExpression(node: TypeOfExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.typeOfKeyword()),
//        this.visit(node.expression()));
//    }

//    public visitDeleteExpression(node: DeleteExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.deleteKeyword()),
//        this.visit(node.expression()));
//    }

//    public visitVoidExpression(node: VoidExpressionSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.voidKeyword()),
//        this.visit(node.expression()));
//    }

//    public visitDebuggerStatement(node: DebuggerStatementSyntax): SyntaxNode {
//        return node.update(
//        this.visit(node.debuggerKeyword()),
//        this.visit(node.semicolonToken()));
//    }
//}