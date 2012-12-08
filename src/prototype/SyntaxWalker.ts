///<reference path='References.ts' />

class SyntaxWalker implements ISyntaxVisitor {
    public visitToken(token: ISyntaxToken): void {
    }

    private visit(element: ISyntaxElement): void {
        if (element === null) {
            return;
        }

        if (element.isToken()) {
            this.visitToken(<ISyntaxToken>element);
        }
        else if (element.isNode()) {
            (<SyntaxNode>element).accept(this);
        }
        else if (element.isList()) {
            var list = <ISyntaxList>element;
            for (var i = 0, n = list.count(); i < n; i++) {
                this.visit(list.syntaxNodeAt(i));
            }
        }
        else if (element.isSeparatedList()) {
            var separatedList = <ISeparatedSyntaxList>element;
            for (var i = 0, n = separatedList.count(); i < n; i++) {
                this.visit(separatedList.itemAt(i));
            }
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    public visitSourceUnit(node: SourceUnitSyntax): void {
        this.visit(node.moduleElements());
        this.visit(node.endOfFileToken());
    }
    
    public visitExternalModuleReference(node: ExternalModuleReferenceSyntax): void {
        this.visit(node.moduleKeyword());
        this.visit(node.openParenToken());
        this.visit(node.stringLiteral());
        this.visit(node.closeParenToken());
    }

    public visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): void {
        this.visit(node.moduleName());
    }

    public visitImportDeclaration(node: ImportDeclarationSyntax): void {
        this.visit(node.importKeyword());
        this.visit(node.identifier());
        this.visit(node.equalsToken());
        this.visit(node.moduleReference());
        this.visit(node.semicolonToken());
    }

    public visitClassDeclaration(node: ClassDeclarationSyntax): void {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.classKeyword());
        this.visit(node.identifier());
        this.visit(node.extendsClause());
        this.visit(node.implementsClause());
        this.visit(node.openBraceToken());
        this.visit(node.classElements());
        this.visit(node.closeBraceToken());
    }

    public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void {
        this.visit(node.exportKeyword());
        this.visit(node.interfaceKeyword());
        this.visit(node.identifier());
        this.visit(node.extendsClause());
        this.visit(node.body());
    }

    public visitExtendsClause(node: ExtendsClauseSyntax): void {
        this.visit(node.extendsKeyword());
        this.visit(node.typeNames());
    }

    public visitImplementsClause(node: ImplementsClauseSyntax): void {
        this.visit(node.implementsKeyword());
        this.visit(node.typeNames());
    }

    public visitModuleDeclaration(node: ModuleDeclarationSyntax): void {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.moduleKeyword());
        this.visit(node.moduleName());
        this.visit(node.stringLiteral());
        this.visit(node.openBraceToken());
        this.visit(node.moduleElements());
        this.visit(node.closeBraceToken());
    }

    public visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.functionKeyword());
        this.visit(node.functionSignature());
        this.visit(node.block());
        this.visit(node.semicolonToken());
    }

    public visitVariableStatement(node: VariableStatementSyntax): void {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.variableDeclaration());
        this.visit(node.semicolonToken());
    }

    public visitVariableDeclaration(node: VariableDeclarationSyntax): void {
        this.visit(node.varKeyword());
        this.visit(node.variableDeclarators());
    }

    public visitVariableDeclarator(node: VariableDeclaratorSyntax): void {
        this.visit(node.identifier());
        this.visit(node.typeAnnotation());
        this.visit(node.equalsValueClause());
    }

    public visitEqualsValueClause(node: EqualsValueClauseSyntax): void {
        this.visit(node.equalsToken());
        this.visit(node.value());
    }

    public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): void {
        this.visit(node.operatorToken());
        this.visit(node.operand());
    }

    public visitThisExpression(node: ThisExpressionSyntax): void {
        this.visit(node.thisKeyword());
    }

    public visitLiteralExpression(node: LiteralExpressionSyntax): void {
        this.visit(node.literalToken());
    }

    public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): void {
        this.visit(node.openBracketToken());
        this.visit(node.expressions());
        this.visit(node.closeBracketToken());
    }

    public visitOmittedExpression(node: OmittedExpressionSyntax): void {
    }

    public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): void {
        this.visit(node.openParenToken());
        this.visit(node.expression());
        this.visit(node.closeParenToken());
    }

    public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpression): void {
        this.visit(node.identifier());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.body());
    }

    public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void {
        this.visit(node.callSignature());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.body());
    }

    public visitIdentifierName(node: IdentifierNameSyntax): void {
        this.visit(node.identifier());
    }

    public visitQualifiedName(node: QualifiedNameSyntax): void {
        this.visit(node.left());
        this.visit(node.dotToken());
        this.visit(node.right());
    }

    public visitConstructorType(node: ConstructorTypeSyntax): void {
        this.visit(node.newKeyword());
        this.visit(node.parameterList());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.type());
    }

    public visitFunctionType(node: FunctionTypeSyntax): void {
        this.visit(node.parameterList());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.type());
    }

    public visitObjectType(node: ObjectTypeSyntax): void {
        this.visit(node.openBraceToken());
        this.visit(node.typeMembers());
        this.visit(node.closeBraceToken());
    }

    public visitArrayType(node: ArrayTypeSyntax): void {
        this.visit(node.type());
        this.visit(node.openBracketToken());
        this.visit(node.closeBracketToken());
    }

    public visitPredefinedType(node: PredefinedTypeSyntax): void {
        this.visit(node.keyword());
    }

    public visitTypeAnnotation(node: TypeAnnotationSyntax): void {
        this.visit(node.colonToken());
        this.visit(node.type());
    }

    public visitBlock(node: BlockSyntax): void {
        this.visit(node.openBraceToken()); 
        this.visit(node.statements());
        this.visit(node.closeBraceToken());
    }

    public visitParameter(node: ParameterSyntax): void {
        this.visit(node.dotDotDotToken());
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.identifier());
        this.visit(node.questionToken());
        this.visit(node.typeAnnotation());
        this.visit(node.equalsValueClause());
    }

    public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): void {
        this.visit(node.expression());
        this.visit(node.dotToken());
        this.visit(node.identifierName());
    }

    public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): void {
        this.visit(node.operand());
        this.visit(node.operatorToken());
    }

    public visitElementAccessExpression(node: ElementAccessExpressionSyntax): void {
        this.visit(node.expression());
        this.visit(node.openBracketToken());
        this.visit(node.argumentExpression());
        this.visit(node.closeBracketToken());
    }

    public visitInvocationExpression(node: InvocationExpressionSyntax): void {
        this.visit(node.expression());
        this.visit(node.argumentList());
    }

    public visitArgumentList(node: ArgumentListSyntax): void {
        this.visit(node.openParenToken()); 
        this.visit(node.arguments());
        this.visit(node.closeParenToken());
    }

    public visitBinaryExpression(node: BinaryExpressionSyntax): void {
        this.visit(node.left());
        this.visit(node.operatorToken());
        this.visit(node.right());
    }

    public visitConditionalExpression(node: ConditionalExpressionSyntax): void {
        this.visit(node.condition());
        this.visit(node.questionToken());
        this.visit(node.whenTrue());
        this.visit(node.colonToken());
        this.visit(node.whenFalse());
    }

    public visitConstructSignature(node: ConstructSignatureSyntax): void {
        this.visit(node.newKeyword());
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
    }

    public visitFunctionSignature(node: FunctionSignatureSyntax): void {
        this.visit(node.identifier());
        this.visit(node.questionToken());
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
    }

    public visitIndexSignature(node: IndexSignatureSyntax): void {
        this.visit(node.openBracketToken());
        this.visit(node.parameter());
        this.visit(node.closeBracketToken());
        this.visit(node.typeAnnotation());
    }

    public visitPropertySignature(node: PropertySignatureSyntax): void {
        this.visit(node.identifier());
        this.visit(node.questionToken());
        this.visit(node.typeAnnotation());
    }

    public visitParameterList(node: ParameterListSyntax): void {
        this.visit(node.openParenToken());
        this.visit(node.parameters());
        this.visit(node.closeParenToken());
    }

    public visitCallSignature(node: CallSignatureSyntax): void {
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
    }

    public visitElseClause(node: ElseClauseSyntax): void {
        this.visit(node.elseKeyword());
        this.visit(node.statement());
    }

    public visitIfStatement(node: IfStatementSyntax): void {
        this.visit(node.ifKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
        this.visit(node.elseClause());
    }

    public visitExpressionStatement(node: ExpressionStatementSyntax): void {
        this.visit(node.expression());
        this.visit(node.semicolonToken());
    }

    public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void {
        this.visit(node.constructorKeyword());
        this.visit(node.parameterList());
        this.visit(node.block());
        this.visit(node.semicolonToken());
    }

    public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.functionSignature());
        this.visit(node.block());
        this.visit(node.semicolonToken());
    }

    public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.getKeyword());
        this.visit(node.identifier());
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
        this.visit(node.block());
    }

    public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.setKeyword());
        this.visit(node.identifier());
        this.visit(node.parameterList());
        this.visit(node.block());
    }

    public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.variableDeclarator());
        this.visit(node.semicolonToken());
    }
    
    public visitThrowStatement(node: ThrowStatementSyntax): void {
        this.visit(node.throwKeyword());
        this.visit(node.expression());
        this.visit(node.semicolonToken());
    }

    public visitReturnStatement(node: ReturnStatementSyntax): void {
        this.visit(node.returnKeyword());
        this.visit(node.expression());
        this.visit(node.semicolonToken());
    }

    public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): void {
        this.visit(node.newKeyword());
        this.visit(node.expression());
        this.visit(node.argumentList());
    }

    public visitSwitchStatement(node: SwitchStatementSyntax): void {
        this.visit(node.switchKeyword());
        this.visit(node.openParenToken());
        this.visit(node.expression());
        this.visit(node.closeParenToken());
        this.visit(node.openBraceToken());
        this.visit(node.caseClauses());
        this.visit(node.closeBraceToken());
    }

    public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): void {
        this.visit(node.caseKeyword());
        this.visit(node.expression());
        this.visit(node.colonToken());
        this.visit(node.statements());
    }

    public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): void {
        this.visit(node.defaultKeyword());
        this.visit(node.colonToken());
        this.visit(node.statements());
    }

    public visitBreakStatement(node: BreakStatementSyntax): void {
        this.visit(node.breakKeyword());
        this.visit(node.identifier());
        this.visit(node.semicolonToken());
    }

    public visitContinueStatement(node: ContinueStatementSyntax): void {
        this.visit(node.continueKeyword());
        this.visit(node.identifier());
        this.visit(node.semicolonToken());
    }

    public visitForStatement(node: ForStatementSyntax): void {
        this.visit(node.forKeyword());
        this.visit(node.openParenToken());
        this.visit(node.variableDeclaration());
        this.visit(node.initializer());
        this.visit(node.firstSemicolonToken());
        this.visit(node.condition());
        this.visit(node.secondSemicolonToken());
        this.visit(node.incrementor());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    }

    public visitForInStatement(node: ForInStatementSyntax): void {
        this.visit(node.forKeyword());
        this.visit(node.openParenToken());
        this.visit(node.variableDeclaration());
        this.visit(node.left());
        this.visit(node.inKeyword());
        this.visit(node.expression());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    }

    public visitWhileStatement(node: WhileStatementSyntax): void {
        this.visit(node.whileKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    }

    public visitWithStatement(node: WithStatementSyntax): void {
        this.visit(node.withKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    }

    public visitEnumDeclaration(node: EnumDeclarationSyntax): void {
        this.visit(node.exportKeyword());
        this.visit(node.enumKeyword());
        this.visit(node.identifier());
        this.visit(node.openBraceToken());
        this.visit(node.variableDeclarators());
        this.visit(node.closeBraceToken());
    }

    public visitCastExpression(node: CastExpressionSyntax): void {
        this.visit(node.lessThanToken());
        this.visit(node.type());
        this.visit(node.greaterThanToken());
        this.visit(node.expression());
    }

    public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): void {
        this.visit(node.openBraceToken());
        this.visit(node.propertyAssignments());
        this.visit(node.closeBraceToken());
    }

    public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): void {
        this.visit(node.propertyName());
        this.visit(node.colonToken());
        this.visit(node.expression());
    }

    public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): void {
        this.visit(node.getKeyword());
        this.visit(node.propertyName());
        this.visit(node.openParenToken());
        this.visit(node.closeParenToken());
        this.visit(node.block());
    }

    public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): void {
        this.visit(node.setKeyword());
        this.visit(node.propertyName());
        this.visit(node.openParenToken());
        this.visit(node.parameterName());
        this.visit(node.closeParenToken());
        this.visit(node.block());
    }

    public visitFunctionExpression(node: FunctionExpressionSyntax): void {
        this.visit(node.functionKeyword());
        this.visit(node.identifier());
        this.visit(node.callSignature());
        this.visit(node.block());
    }

    public visitEmptyStatement(node: EmptyStatementSyntax): void {
        this.visit(node.semicolonToken());
    }

    public visitSuperExpression(node: SuperExpressionSyntax): void {
        this.visit(node.superKeyword());
    }

    public visitTryStatement(node: TryStatementSyntax): void {
        this.visit(node.tryKeyword());
        this.visit(node.block());
        this.visit(node.catchClause());
        this.visit(node.finallyClause());
    }

    public visitCatchClause(node: CatchClauseSyntax): void {
        this.visit(node.catchKeyword());
        this.visit(node.openParenToken());
        this.visit(node.identifier());
        this.visit(node.closeParenToken());
        this.visit(node.block());
    }

    public visitFinallyClause(node: FinallyClauseSyntax): void {
        this.visit(node.finallyKeyword());
        this.visit(node.block());
    }

    public visitLabeledStatement(node: LabeledStatement): void {
        this.visit(node.identifier());
        this.visit(node.colonToken());
        this.visit(node.statement());
    }

    public visitDoStatement(node: DoStatementSyntax): void {
        this.visit(node.doKeyword());
        this.visit(node.statement());
        this.visit(node.whileKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.semicolonToken());
    }

    public visitTypeOfExpression(node: TypeOfExpressionSyntax): void {
        this.visit(node.typeOfKeyword());
        this.visit(node.expression());
    }

    public visitDeleteExpression(node: DeleteExpressionSyntax): void {
        this.visit(node.deleteKeyword());
        this.visit(node.expression());
    }

    public visitVoidExpression(node: VoidExpressionSyntax): void {
        this.visit(node.voidKeyword());
        this.visit(node.expression());
    }

    public visitDebuggerStatement(node: DebuggerStatementSyntax): void {
        this.visit(node.debuggerKeyword());
        this.visit(node.semicolonToken());
    }
}