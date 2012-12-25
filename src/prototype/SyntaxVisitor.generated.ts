///<reference path='SyntaxNodes.generated.ts' />

interface ISyntaxVisitor {
    visitSourceUnit(node: SourceUnitSyntax): any;
    visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any;
    visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any;
    visitImportDeclaration(node: ImportDeclarationSyntax): any;
    visitClassDeclaration(node: ClassDeclarationSyntax): any;
    visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any;
    visitExtendsClause(node: ExtendsClauseSyntax): any;
    visitImplementsClause(node: ImplementsClauseSyntax): any;
    visitModuleDeclaration(node: ModuleDeclarationSyntax): any;
    visitFunctionDeclaration(node: FunctionDeclarationSyntax): any;
    visitVariableStatement(node: VariableStatementSyntax): any;
    visitVariableDeclaration(node: VariableDeclarationSyntax): any;
    visitVariableDeclarator(node: VariableDeclaratorSyntax): any;
    visitEqualsValueClause(node: EqualsValueClauseSyntax): any;
    visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): any;
    visitThisExpression(node: ThisExpressionSyntax): any;
    visitLiteralExpression(node: LiteralExpressionSyntax): any;
    visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): any;
    visitOmittedExpression(node: OmittedExpressionSyntax): any;
    visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): any;
    visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): any;
    visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): any;
    visitIdentifierName(node: IdentifierNameSyntax): any;
    visitQualifiedName(node: QualifiedNameSyntax): any;
    visitConstructorType(node: ConstructorTypeSyntax): any;
    visitFunctionType(node: FunctionTypeSyntax): any;
    visitObjectType(node: ObjectTypeSyntax): any;
    visitArrayType(node: ArrayTypeSyntax): any;
    visitPredefinedType(node: PredefinedTypeSyntax): any;
    visitTypeAnnotation(node: TypeAnnotationSyntax): any;
    visitBlock(node: BlockSyntax): any;
    visitParameter(node: ParameterSyntax): any;
    visitMemberAccessExpression(node: MemberAccessExpressionSyntax): any;
    visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): any;
    visitElementAccessExpression(node: ElementAccessExpressionSyntax): any;
    visitInvocationExpression(node: InvocationExpressionSyntax): any;
    visitArgumentList(node: ArgumentListSyntax): any;
    visitBinaryExpression(node: BinaryExpressionSyntax): any;
    visitConditionalExpression(node: ConditionalExpressionSyntax): any;
    visitConstructSignature(node: ConstructSignatureSyntax): any;
    visitFunctionSignature(node: FunctionSignatureSyntax): any;
    visitIndexSignature(node: IndexSignatureSyntax): any;
    visitPropertySignature(node: PropertySignatureSyntax): any;
    visitParameterList(node: ParameterListSyntax): any;
    visitCallSignature(node: CallSignatureSyntax): any;
    visitElseClause(node: ElseClauseSyntax): any;
    visitIfStatement(node: IfStatementSyntax): any;
    visitExpressionStatement(node: ExpressionStatementSyntax): any;
    visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any;
    visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): any;
    visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): any;
    visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): any;
    visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): any;
    visitThrowStatement(node: ThrowStatementSyntax): any;
    visitReturnStatement(node: ReturnStatementSyntax): any;
    visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): any;
    visitSwitchStatement(node: SwitchStatementSyntax): any;
    visitCaseSwitchClause(node: CaseSwitchClauseSyntax): any;
    visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): any;
    visitBreakStatement(node: BreakStatementSyntax): any;
    visitContinueStatement(node: ContinueStatementSyntax): any;
    visitForStatement(node: ForStatementSyntax): any;
    visitForInStatement(node: ForInStatementSyntax): any;
    visitWhileStatement(node: WhileStatementSyntax): any;
    visitWithStatement(node: WithStatementSyntax): any;
    visitEnumDeclaration(node: EnumDeclarationSyntax): any;
    visitCastExpression(node: CastExpressionSyntax): any;
    visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): any;
    visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): any;
    visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): any;
    visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): any;
    visitFunctionExpression(node: FunctionExpressionSyntax): any;
    visitEmptyStatement(node: EmptyStatementSyntax): any;
    visitSuperExpression(node: SuperExpressionSyntax): any;
    visitTryStatement(node: TryStatementSyntax): any;
    visitCatchClause(node: CatchClauseSyntax): any;
    visitFinallyClause(node: FinallyClauseSyntax): any;
    visitLabeledStatement(node: LabeledStatement): any;
    visitDoStatement(node: DoStatementSyntax): any;
    visitTypeOfExpression(node: TypeOfExpressionSyntax): any;
    visitDeleteExpression(node: DeleteExpressionSyntax): any;
    visitVoidExpression(node: VoidExpressionSyntax): any;
    visitDebuggerStatement(node: DebuggerStatementSyntax): any;
}

class SyntaxVisitor implements ISyntaxVisitor {
    public defaultVisit(node: SyntaxNode): any {
        return null;
    }

    private visitSourceUnit(node: SourceUnitSyntax): any {
        return this.defaultVisit(node);
    }

    private visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any {
        return this.defaultVisit(node);
    }

    private visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any {
        return this.defaultVisit(node);
    }

    private visitImportDeclaration(node: ImportDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitClassDeclaration(node: ClassDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitExtendsClause(node: ExtendsClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitImplementsClause(node: ImplementsClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitModuleDeclaration(node: ModuleDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitFunctionDeclaration(node: FunctionDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitVariableStatement(node: VariableStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitVariableDeclaration(node: VariableDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitVariableDeclarator(node: VariableDeclaratorSyntax): any {
        return this.defaultVisit(node);
    }

    private visitEqualsValueClause(node: EqualsValueClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitThisExpression(node: ThisExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitLiteralExpression(node: LiteralExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitOmittedExpression(node: OmittedExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitIdentifierName(node: IdentifierNameSyntax): any {
        return this.defaultVisit(node);
    }

    private visitQualifiedName(node: QualifiedNameSyntax): any {
        return this.defaultVisit(node);
    }

    private visitConstructorType(node: ConstructorTypeSyntax): any {
        return this.defaultVisit(node);
    }

    private visitFunctionType(node: FunctionTypeSyntax): any {
        return this.defaultVisit(node);
    }

    private visitObjectType(node: ObjectTypeSyntax): any {
        return this.defaultVisit(node);
    }

    private visitArrayType(node: ArrayTypeSyntax): any {
        return this.defaultVisit(node);
    }

    private visitPredefinedType(node: PredefinedTypeSyntax): any {
        return this.defaultVisit(node);
    }

    private visitTypeAnnotation(node: TypeAnnotationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitBlock(node: BlockSyntax): any {
        return this.defaultVisit(node);
    }

    private visitParameter(node: ParameterSyntax): any {
        return this.defaultVisit(node);
    }

    private visitMemberAccessExpression(node: MemberAccessExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitElementAccessExpression(node: ElementAccessExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitInvocationExpression(node: InvocationExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitArgumentList(node: ArgumentListSyntax): any {
        return this.defaultVisit(node);
    }

    private visitBinaryExpression(node: BinaryExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitConditionalExpression(node: ConditionalExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitConstructSignature(node: ConstructSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    private visitFunctionSignature(node: FunctionSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    private visitIndexSignature(node: IndexSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    private visitPropertySignature(node: PropertySignatureSyntax): any {
        return this.defaultVisit(node);
    }

    private visitParameterList(node: ParameterListSyntax): any {
        return this.defaultVisit(node);
    }

    private visitCallSignature(node: CallSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    private visitElseClause(node: ElseClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitIfStatement(node: IfStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitExpressionStatement(node: ExpressionStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitThrowStatement(node: ThrowStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitReturnStatement(node: ReturnStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitSwitchStatement(node: SwitchStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitCaseSwitchClause(node: CaseSwitchClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitBreakStatement(node: BreakStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitContinueStatement(node: ContinueStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitForStatement(node: ForStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitForInStatement(node: ForInStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitWhileStatement(node: WhileStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitWithStatement(node: WithStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitEnumDeclaration(node: EnumDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    private visitCastExpression(node: CastExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): any {
        return this.defaultVisit(node);
    }

    private visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): any {
        return this.defaultVisit(node);
    }

    private visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): any {
        return this.defaultVisit(node);
    }

    private visitFunctionExpression(node: FunctionExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitEmptyStatement(node: EmptyStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitSuperExpression(node: SuperExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitTryStatement(node: TryStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitCatchClause(node: CatchClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitFinallyClause(node: FinallyClauseSyntax): any {
        return this.defaultVisit(node);
    }

    private visitLabeledStatement(node: LabeledStatement): any {
        return this.defaultVisit(node);
    }

    private visitDoStatement(node: DoStatementSyntax): any {
        return this.defaultVisit(node);
    }

    private visitTypeOfExpression(node: TypeOfExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitDeleteExpression(node: DeleteExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitVoidExpression(node: VoidExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    private visitDebuggerStatement(node: DebuggerStatementSyntax): any {
        return this.defaultVisit(node);
    }
}