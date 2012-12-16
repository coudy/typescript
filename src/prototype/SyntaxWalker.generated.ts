///<reference path='ISyntaxVisitor.ts' />

class SyntaxWalker implements ISyntaxVisitor {
    public visitToken(token: ISyntaxToken): void {
    }

    private visitOptionalToken(token: ISyntaxToken): void {
        if (token === null) {
            return;
        }

        this.visitToken(token);
    }

    public visitOptionalNode(node: SyntaxNode): void {
        if (node === null) {
            return;
        }

        node.accept1(this);
    }

    public visitList(list: ISyntaxList): void {
        for (var i = 0, n = list.count(); i < n; i++) {
           list.syntaxNodeAt(i).accept(this);
        }
    }

    public visitSeparatedList(list: ISeparatedSyntaxList): void {
        for (var i = 0, n = list.count(); i < n; i++) {
            var item = list.itemAt(i);
            if (item.isToken()) {
                this.visitToken(<ISyntaxToken>item);
            }
            else {
                (<SyntaxNode>item).accept(this);
            }
        }
    }

    public visitSourceUnit(node: SourceUnitSyntax): void {
        this.visitList(node.moduleElements());
        this.visitToken(node.endOfFileToken());
    }

    public visitExternalModuleReference(node: ExternalModuleReferenceSyntax): void {
        this.visitToken(node.moduleKeyword());
        this.visitToken(node.openParenToken());
        this.visitToken(node.stringLiteral());
        this.visitToken(node.closeParenToken());
    }

    public visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): void {
        node.moduleName().accept(this);
    }

    public visitImportDeclaration(node: ImportDeclarationSyntax): void {
        this.visitToken(node.importKeyword());
        this.visitToken(node.identifier());
        this.visitToken(node.equalsToken());
        node.moduleReference().accept(this);
        this.visitToken(node.semicolonToken());
    }

    public visitClassDeclaration(node: ClassDeclarationSyntax): void {
        this.visitOptionalToken(node.exportKeyword());
        this.visitOptionalToken(node.declareKeyword());
        this.visitToken(node.classKeyword());
        this.visitToken(node.identifier());
        this.visitOptionalNode(node.extendsClause());
        this.visitOptionalNode(node.implementsClause());
        this.visitToken(node.openBraceToken());
        this.visitList(node.classElements());
        this.visitToken(node.closeBraceToken());
    }

    public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void {
        this.visitOptionalToken(node.exportKeyword());
        this.visitToken(node.interfaceKeyword());
        this.visitToken(node.identifier());
        this.visitOptionalNode(node.extendsClause());
        node.body().accept(this);
    }

    public visitExtendsClause(node: ExtendsClauseSyntax): void {
        this.visitToken(node.extendsKeyword());
        this.visitSeparatedList(node.typeNames());
    }

    public visitImplementsClause(node: ImplementsClauseSyntax): void {
        this.visitToken(node.implementsKeyword());
        this.visitSeparatedList(node.typeNames());
    }

    public visitModuleDeclaration(node: ModuleDeclarationSyntax): void {
        this.visitOptionalToken(node.exportKeyword());
        this.visitOptionalToken(node.declareKeyword());
        this.visitToken(node.moduleKeyword());
        this.visitOptionalNode(node.moduleName());
        this.visitOptionalToken(node.stringLiteral());
        this.visitToken(node.openBraceToken());
        this.visitList(node.moduleElements());
        this.visitToken(node.closeBraceToken());
    }

    public visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {
        this.visitOptionalToken(node.exportKeyword());
        this.visitOptionalToken(node.declareKeyword());
        this.visitToken(node.functionKeyword());
        node.functionSignature().accept(this);
        this.visitOptionalNode(node.block());
        this.visitOptionalToken(node.semicolonToken());
    }

    public visitVariableStatement(node: VariableStatementSyntax): void {
        this.visitOptionalToken(node.exportKeyword());
        this.visitOptionalToken(node.declareKeyword());
        node.variableDeclaration().accept(this);
        this.visitToken(node.semicolonToken());
    }

    public visitVariableDeclaration(node: VariableDeclarationSyntax): void {
        this.visitToken(node.varKeyword());
        this.visitSeparatedList(node.variableDeclarators());
    }

    public visitVariableDeclarator(node: VariableDeclaratorSyntax): void {
        this.visitToken(node.identifier());
        this.visitOptionalNode(node.typeAnnotation());
        this.visitOptionalNode(node.equalsValueClause());
    }

    public visitEqualsValueClause(node: EqualsValueClauseSyntax): void {
        this.visitToken(node.equalsToken());
        node.value().accept(this);
    }

    public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): void {
        this.visitToken(node.operatorToken());
        node.operand().accept(this);
    }

    public visitThisExpression(node: ThisExpressionSyntax): void {
        this.visitToken(node.thisKeyword());
    }

    public visitLiteralExpression(node: LiteralExpressionSyntax): void {
        this.visitToken(node.literalToken());
    }

    public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): void {
        this.visitToken(node.openBracketToken());
        this.visitSeparatedList(node.expressions());
        this.visitToken(node.closeBracketToken());
    }

    public visitOmittedExpression(node: OmittedExpressionSyntax): void {
    }

    public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): void {
        this.visitToken(node.openParenToken());
        node.expression().accept(this);
        this.visitToken(node.closeParenToken());
    }

    public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): void {
        this.visitToken(node.identifier());
        this.visitToken(node.equalsGreaterThanToken());
        node.body().accept(this);
    }

    public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void {
        node.callSignature().accept(this);
        this.visitToken(node.equalsGreaterThanToken());
        node.body().accept(this);
    }

    public visitIdentifierName(node: IdentifierNameSyntax): void {
        this.visitToken(node.identifier());
    }

    public visitQualifiedName(node: QualifiedNameSyntax): void {
        node.left().accept(this);
        this.visitToken(node.dotToken());
        node.right().accept(this);
    }

    public visitConstructorType(node: ConstructorTypeSyntax): void {
        this.visitToken(node.newKeyword());
        node.parameterList().accept(this);
        this.visitToken(node.equalsGreaterThanToken());
        node.type().accept(this);
    }

    public visitFunctionType(node: FunctionTypeSyntax): void {
        node.parameterList().accept(this);
        this.visitToken(node.equalsGreaterThanToken());
        node.type().accept(this);
    }

    public visitObjectType(node: ObjectTypeSyntax): void {
        this.visitToken(node.openBraceToken());
        this.visitSeparatedList(node.typeMembers());
        this.visitToken(node.closeBraceToken());
    }

    public visitArrayType(node: ArrayTypeSyntax): void {
        node.type().accept(this);
        this.visitToken(node.openBracketToken());
        this.visitToken(node.closeBracketToken());
    }

    public visitPredefinedType(node: PredefinedTypeSyntax): void {
        this.visitToken(node.keyword());
    }

    public visitTypeAnnotation(node: TypeAnnotationSyntax): void {
        this.visitToken(node.colonToken());
        node.type().accept(this);
    }

    public visitBlock(node: BlockSyntax): void {
        this.visitToken(node.openBraceToken());
        this.visitList(node.statements());
        this.visitToken(node.closeBraceToken());
    }

    public visitParameter(node: ParameterSyntax): void {
        this.visitOptionalToken(node.dotDotDotToken());
        this.visitOptionalToken(node.publicOrPrivateKeyword());
        this.visitToken(node.identifier());
        this.visitOptionalToken(node.questionToken());
        this.visitOptionalNode(node.typeAnnotation());
        this.visitOptionalNode(node.equalsValueClause());
    }

    public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): void {
        node.expression().accept(this);
        this.visitToken(node.dotToken());
        node.identifierName().accept(this);
    }

    public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): void {
        node.operand().accept(this);
        this.visitToken(node.operatorToken());
    }

    public visitElementAccessExpression(node: ElementAccessExpressionSyntax): void {
        node.expression().accept(this);
        this.visitToken(node.openBracketToken());
        node.argumentExpression().accept(this);
        this.visitToken(node.closeBracketToken());
    }

    public visitInvocationExpression(node: InvocationExpressionSyntax): void {
        node.expression().accept(this);
        node.argumentList().accept(this);
    }

    public visitArgumentList(node: ArgumentListSyntax): void {
        this.visitToken(node.openParenToken());
        this.visitSeparatedList(node.arguments());
        this.visitToken(node.closeParenToken());
    }

    public visitBinaryExpression(node: BinaryExpressionSyntax): void {
        node.left().accept(this);
        this.visitToken(node.operatorToken());
        node.right().accept(this);
    }

    public visitConditionalExpression(node: ConditionalExpressionSyntax): void {
        node.condition().accept(this);
        this.visitToken(node.questionToken());
        node.whenTrue().accept(this);
        this.visitToken(node.colonToken());
        node.whenFalse().accept(this);
    }

    public visitConstructSignature(node: ConstructSignatureSyntax): void {
        this.visitToken(node.newKeyword());
        node.parameterList().accept(this);
        this.visitOptionalNode(node.typeAnnotation());
    }

    public visitFunctionSignature(node: FunctionSignatureSyntax): void {
        this.visitToken(node.identifier());
        this.visitOptionalToken(node.questionToken());
        node.parameterList().accept(this);
        this.visitOptionalNode(node.typeAnnotation());
    }

    public visitIndexSignature(node: IndexSignatureSyntax): void {
        this.visitToken(node.openBracketToken());
        node.parameter().accept(this);
        this.visitToken(node.closeBracketToken());
        this.visitOptionalNode(node.typeAnnotation());
    }

    public visitPropertySignature(node: PropertySignatureSyntax): void {
        this.visitToken(node.identifier());
        this.visitOptionalToken(node.questionToken());
        this.visitOptionalNode(node.typeAnnotation());
    }

    public visitParameterList(node: ParameterListSyntax): void {
        this.visitToken(node.openParenToken());
        this.visitSeparatedList(node.parameters());
        this.visitToken(node.closeParenToken());
    }

    public visitCallSignature(node: CallSignatureSyntax): void {
        node.parameterList().accept(this);
        this.visitOptionalNode(node.typeAnnotation());
    }

    public visitElseClause(node: ElseClauseSyntax): void {
        this.visitToken(node.elseKeyword());
        node.statement().accept(this);
    }

    public visitIfStatement(node: IfStatementSyntax): void {
        this.visitToken(node.ifKeyword());
        this.visitToken(node.openParenToken());
        node.condition().accept(this);
        this.visitToken(node.closeParenToken());
        node.statement().accept(this);
        this.visitOptionalNode(node.elseClause());
    }

    public visitExpressionStatement(node: ExpressionStatementSyntax): void {
        node.expression().accept(this);
        this.visitToken(node.semicolonToken());
    }

    public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void {
        this.visitToken(node.constructorKeyword());
        node.parameterList().accept(this);
        this.visitOptionalNode(node.block());
        this.visitOptionalToken(node.semicolonToken());
    }

    public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {
        this.visitOptionalToken(node.publicOrPrivateKeyword());
        this.visitOptionalToken(node.staticKeyword());
        node.functionSignature().accept(this);
        this.visitOptionalNode(node.block());
        this.visitOptionalToken(node.semicolonToken());
    }

    public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
        this.visitOptionalToken(node.publicOrPrivateKeyword());
        this.visitOptionalToken(node.staticKeyword());
        this.visitToken(node.getKeyword());
        this.visitToken(node.identifier());
        node.parameterList().accept(this);
        this.visitOptionalNode(node.typeAnnotation());
        node.block().accept(this);
    }

    public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
        this.visitOptionalToken(node.publicOrPrivateKeyword());
        this.visitOptionalToken(node.staticKeyword());
        this.visitToken(node.setKeyword());
        this.visitToken(node.identifier());
        node.parameterList().accept(this);
        node.block().accept(this);
    }

    public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void {
        this.visitOptionalToken(node.publicOrPrivateKeyword());
        this.visitOptionalToken(node.staticKeyword());
        node.variableDeclarator().accept(this);
        this.visitToken(node.semicolonToken());
    }

    public visitThrowStatement(node: ThrowStatementSyntax): void {
        this.visitToken(node.throwKeyword());
        node.expression().accept(this);
        this.visitToken(node.semicolonToken());
    }

    public visitReturnStatement(node: ReturnStatementSyntax): void {
        this.visitToken(node.returnKeyword());
        this.visitOptionalNode(node.expression());
        this.visitToken(node.semicolonToken());
    }

    public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): void {
        this.visitToken(node.newKeyword());
        node.expression().accept(this);
        this.visitOptionalNode(node.argumentList());
    }

    public visitSwitchStatement(node: SwitchStatementSyntax): void {
        this.visitToken(node.switchKeyword());
        this.visitToken(node.openParenToken());
        node.expression().accept(this);
        this.visitToken(node.closeParenToken());
        this.visitToken(node.openBraceToken());
        this.visitList(node.caseClauses());
        this.visitToken(node.closeBraceToken());
    }

    public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): void {
        this.visitToken(node.caseKeyword());
        node.expression().accept(this);
        this.visitToken(node.colonToken());
        this.visitList(node.statements());
    }

    public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): void {
        this.visitToken(node.defaultKeyword());
        this.visitToken(node.colonToken());
        this.visitList(node.statements());
    }

    public visitBreakStatement(node: BreakStatementSyntax): void {
        this.visitToken(node.breakKeyword());
        this.visitOptionalToken(node.identifier());
        this.visitToken(node.semicolonToken());
    }

    public visitContinueStatement(node: ContinueStatementSyntax): void {
        this.visitToken(node.continueKeyword());
        this.visitOptionalToken(node.identifier());
        this.visitToken(node.semicolonToken());
    }

    public visitForStatement(node: ForStatementSyntax): void {
        this.visitToken(node.forKeyword());
        this.visitToken(node.openParenToken());
        this.visitOptionalNode(node.variableDeclaration());
        this.visitOptionalNode(node.initializer());
        this.visitToken(node.firstSemicolonToken());
        this.visitOptionalNode(node.condition());
        this.visitToken(node.secondSemicolonToken());
        this.visitOptionalNode(node.incrementor());
        this.visitToken(node.closeParenToken());
        node.statement().accept(this);
    }

    public visitForInStatement(node: ForInStatementSyntax): void {
        this.visitToken(node.forKeyword());
        this.visitToken(node.openParenToken());
        this.visitOptionalNode(node.variableDeclaration());
        this.visitOptionalNode(node.left());
        this.visitToken(node.inKeyword());
        node.expression().accept(this);
        this.visitToken(node.closeParenToken());
        node.statement().accept(this);
    }

    public visitWhileStatement(node: WhileStatementSyntax): void {
        this.visitToken(node.whileKeyword());
        this.visitToken(node.openParenToken());
        node.condition().accept(this);
        this.visitToken(node.closeParenToken());
        node.statement().accept(this);
    }

    public visitWithStatement(node: WithStatementSyntax): void {
        this.visitToken(node.withKeyword());
        this.visitToken(node.openParenToken());
        node.condition().accept(this);
        this.visitToken(node.closeParenToken());
        node.statement().accept(this);
    }

    public visitEnumDeclaration(node: EnumDeclarationSyntax): void {
        this.visitOptionalToken(node.exportKeyword());
        this.visitToken(node.enumKeyword());
        this.visitToken(node.identifier());
        this.visitToken(node.openBraceToken());
        this.visitSeparatedList(node.variableDeclarators());
        this.visitToken(node.closeBraceToken());
    }

    public visitCastExpression(node: CastExpressionSyntax): void {
        this.visitToken(node.lessThanToken());
        node.type().accept(this);
        this.visitToken(node.greaterThanToken());
        node.expression().accept(this);
    }

    public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): void {
        this.visitToken(node.openBraceToken());
        this.visitSeparatedList(node.propertyAssignments());
        this.visitToken(node.closeBraceToken());
    }

    public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): void {
        this.visitToken(node.propertyName());
        this.visitToken(node.colonToken());
        node.expression().accept(this);
    }

    public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): void {
        this.visitToken(node.getKeyword());
        this.visitToken(node.propertyName());
        this.visitToken(node.openParenToken());
        this.visitToken(node.closeParenToken());
        node.block().accept(this);
    }

    public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): void {
        this.visitToken(node.setKeyword());
        this.visitToken(node.propertyName());
        this.visitToken(node.openParenToken());
        this.visitToken(node.parameterName());
        this.visitToken(node.closeParenToken());
        node.block().accept(this);
    }

    public visitFunctionExpression(node: FunctionExpressionSyntax): void {
        this.visitToken(node.functionKeyword());
        this.visitOptionalToken(node.identifier());
        node.callSignature().accept(this);
        node.block().accept(this);
    }

    public visitEmptyStatement(node: EmptyStatementSyntax): void {
        this.visitToken(node.semicolonToken());
    }

    public visitSuperExpression(node: SuperExpressionSyntax): void {
        this.visitToken(node.superKeyword());
    }

    public visitTryStatement(node: TryStatementSyntax): void {
        this.visitToken(node.tryKeyword());
        node.block().accept(this);
        this.visitOptionalNode(node.catchClause());
        this.visitOptionalNode(node.finallyClause());
    }

    public visitCatchClause(node: CatchClauseSyntax): void {
        this.visitToken(node.catchKeyword());
        this.visitToken(node.openParenToken());
        this.visitToken(node.identifier());
        this.visitToken(node.closeParenToken());
        node.block().accept(this);
    }

    public visitFinallyClause(node: FinallyClauseSyntax): void {
        this.visitToken(node.finallyKeyword());
        node.block().accept(this);
    }

    public visitLabeledStatement(node: LabeledStatement): void {
        this.visitToken(node.identifier());
        this.visitToken(node.colonToken());
        node.statement().accept(this);
    }

    public visitDoStatement(node: DoStatementSyntax): void {
        this.visitToken(node.doKeyword());
        node.statement().accept(this);
        this.visitToken(node.whileKeyword());
        this.visitToken(node.openParenToken());
        node.condition().accept(this);
        this.visitToken(node.closeParenToken());
        this.visitToken(node.semicolonToken());
    }

    public visitTypeOfExpression(node: TypeOfExpressionSyntax): void {
        this.visitToken(node.typeOfKeyword());
        node.expression().accept(this);
    }

    public visitDeleteExpression(node: DeleteExpressionSyntax): void {
        this.visitToken(node.deleteKeyword());
        node.expression().accept(this);
    }

    public visitVoidExpression(node: VoidExpressionSyntax): void {
        this.visitToken(node.voidKeyword());
        node.expression().accept(this);
    }

    public visitDebuggerStatement(node: DebuggerStatementSyntax): void {
        this.visitToken(node.debuggerKeyword());
        this.visitToken(node.semicolonToken());
    }
}