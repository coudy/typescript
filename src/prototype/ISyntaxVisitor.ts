///<reference path='SyntaxNodes.generated.ts' />

interface ISyntaxVisitor {
    visitSourceUnit(node: SourceUnitSyntax): void;
    visitExternalModuleReference(node: ExternalModuleReferenceSyntax): void;
    visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): void;
    visitImportDeclaration(node: ImportDeclarationSyntax): void;
    visitClassDeclaration(node: ClassDeclarationSyntax): void;
    visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void;
    visitExtendsClause(node: ExtendsClauseSyntax): void;
    visitImplementsClause(node: ImplementsClauseSyntax): void;
    visitModuleDeclaration(node: ModuleDeclarationSyntax): void;
    visitFunctionDeclaration(node: FunctionDeclarationSyntax): void;
    visitVariableStatement(node: VariableStatementSyntax): void;
    visitVariableDeclaration(node: VariableDeclarationSyntax): void;
    visitVariableDeclarator(node: VariableDeclaratorSyntax): void;
    visitEqualsValueClause(node: EqualsValueClauseSyntax): void;
    visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): void;
    visitThisExpression(node: ThisExpressionSyntax): void;
    visitLiteralExpression(node: LiteralExpressionSyntax): void;
    visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): void;
    visitOmittedExpression(node: OmittedExpressionSyntax): void;
    visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): void;
    visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): void;
    visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void;
    visitIdentifierName(node: IdentifierNameSyntax): void;
    visitQualifiedName(node: QualifiedNameSyntax): void;
    visitConstructorType(node: ConstructorTypeSyntax): void;
    visitFunctionType(node: FunctionTypeSyntax): void;
    visitObjectType(node: ObjectTypeSyntax): void;
    visitArrayType(node: ArrayTypeSyntax): void;
    visitPredefinedType(node: PredefinedTypeSyntax): void;
    visitTypeAnnotation(node: TypeAnnotationSyntax): void;
    visitBlock(node: BlockSyntax): void;
    visitParameter(node: ParameterSyntax): void;
    visitMemberAccessExpression(node: MemberAccessExpressionSyntax): void;
    visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): void;
    visitElementAccessExpression(node: ElementAccessExpressionSyntax): void;
    visitInvocationExpression(node: InvocationExpressionSyntax): void;
    visitArgumentList(node: ArgumentListSyntax): void;
    visitBinaryExpression(node: BinaryExpressionSyntax): void;
    visitConditionalExpression(node: ConditionalExpressionSyntax): void;
    visitConstructSignature(node: ConstructSignatureSyntax): void;
    visitFunctionSignature(node: FunctionSignatureSyntax): void;
    visitIndexSignature(node: IndexSignatureSyntax): void;
    visitPropertySignature(node: PropertySignatureSyntax): void;
    visitParameterList(node: ParameterListSyntax): void;
    visitCallSignature(node: CallSignatureSyntax): void;
    visitElseClause(node: ElseClauseSyntax): void;
    visitIfStatement(node: IfStatementSyntax): void;
    visitExpressionStatement(node: ExpressionStatementSyntax): void;
    visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void;
    visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void;
    visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void;
    visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void;
    visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void;
    visitThrowStatement(node: ThrowStatementSyntax): void;
    visitReturnStatement(node: ReturnStatementSyntax): void;
    visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): void;
    visitSwitchStatement(node: SwitchStatementSyntax): void;
    visitCaseSwitchClause(node: CaseSwitchClauseSyntax): void;
    visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): void;
    visitBreakStatement(node: BreakStatementSyntax): void;
    visitContinueStatement(node: ContinueStatementSyntax): void;
    visitForStatement(node: ForStatementSyntax): void;
    visitForInStatement(node: ForInStatementSyntax): void;
    visitWhileStatement(node: WhileStatementSyntax): void;
    visitWithStatement(node: WithStatementSyntax): void;
    visitEnumDeclaration(node: EnumDeclarationSyntax): void;
    visitCastExpression(node: CastExpressionSyntax): void;
    visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): void;
    visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): void;
    visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): void;
    visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): void;
    visitFunctionExpression(node: FunctionExpressionSyntax): void;
    visitEmptyStatement(node: EmptyStatementSyntax): void;
    visitSuperExpression(node: SuperExpressionSyntax): void;
    visitTryStatement(node: TryStatementSyntax): void;
    visitCatchClause(node: CatchClauseSyntax): void;
    visitFinallyClause(node: FinallyClauseSyntax): void;
    visitLabeledStatement(node: LabeledStatement): void;
    visitDoStatement(node: DoStatementSyntax): void;
    visitTypeOfExpression(node: TypeOfExpressionSyntax): void;
    visitDeleteExpression(node: DeleteExpressionSyntax): void;
    visitVoidExpression(node: VoidExpressionSyntax): void;
    visitDebuggerStatement(node: DebuggerStatementSyntax): void;
}

class DefaultSyntaxVisitor implements ISyntaxVisitor {
    public defaultVisit(node: SyntaxNode): void {
    }

    public visitSourceUnit(node: SourceUnitSyntax): void {
        this.defaultVisit(node);
    }

    public visitExternalModuleReference(node: ExternalModuleReferenceSyntax): void {
        this.defaultVisit(node);
    }

    public visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): void {
        this.defaultVisit(node);
    }

    public visitImportDeclaration(node: ImportDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitClassDeclaration(node: ClassDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitExtendsClause(node: ExtendsClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitImplementsClause(node: ImplementsClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitModuleDeclaration(node: ModuleDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitVariableStatement(node: VariableStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitVariableDeclaration(node: VariableDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitVariableDeclarator(node: VariableDeclaratorSyntax): void {
        this.defaultVisit(node);
    }

    public visitEqualsValueClause(node: EqualsValueClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitThisExpression(node: ThisExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitLiteralExpression(node: LiteralExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitOmittedExpression(node: OmittedExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitIdentifierName(node: IdentifierNameSyntax): void {
        this.defaultVisit(node);
    }

    public visitQualifiedName(node: QualifiedNameSyntax): void {
        this.defaultVisit(node);
    }

    public visitConstructorType(node: ConstructorTypeSyntax): void {
        this.defaultVisit(node);
    }

    public visitFunctionType(node: FunctionTypeSyntax): void {
        this.defaultVisit(node);
    }

    public visitObjectType(node: ObjectTypeSyntax): void {
        this.defaultVisit(node);
    }

    public visitArrayType(node: ArrayTypeSyntax): void {
        this.defaultVisit(node);
    }

    public visitPredefinedType(node: PredefinedTypeSyntax): void {
        this.defaultVisit(node);
    }

    public visitTypeAnnotation(node: TypeAnnotationSyntax): void {
        this.defaultVisit(node);
    }

    public visitBlock(node: BlockSyntax): void {
        this.defaultVisit(node);
    }

    public visitParameter(node: ParameterSyntax): void {
        this.defaultVisit(node);
    }

    public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitElementAccessExpression(node: ElementAccessExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitInvocationExpression(node: InvocationExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitArgumentList(node: ArgumentListSyntax): void {
        this.defaultVisit(node);
    }

    public visitBinaryExpression(node: BinaryExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitConditionalExpression(node: ConditionalExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitConstructSignature(node: ConstructSignatureSyntax): void {
        this.defaultVisit(node);
    }

    public visitFunctionSignature(node: FunctionSignatureSyntax): void {
        this.defaultVisit(node);
    }

    public visitIndexSignature(node: IndexSignatureSyntax): void {
        this.defaultVisit(node);
    }

    public visitPropertySignature(node: PropertySignatureSyntax): void {
        this.defaultVisit(node);
    }

    public visitParameterList(node: ParameterListSyntax): void {
        this.defaultVisit(node);
    }

    public visitCallSignature(node: CallSignatureSyntax): void {
        this.defaultVisit(node);
    }

    public visitElseClause(node: ElseClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitIfStatement(node: IfStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitExpressionStatement(node: ExpressionStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitThrowStatement(node: ThrowStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitReturnStatement(node: ReturnStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitSwitchStatement(node: SwitchStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitBreakStatement(node: BreakStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitContinueStatement(node: ContinueStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitForStatement(node: ForStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitForInStatement(node: ForInStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitWhileStatement(node: WhileStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitWithStatement(node: WithStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitEnumDeclaration(node: EnumDeclarationSyntax): void {
        this.defaultVisit(node);
    }

    public visitCastExpression(node: CastExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): void {
        this.defaultVisit(node);
    }

    public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): void {
        this.defaultVisit(node);
    }

    public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): void {
        this.defaultVisit(node);
    }

    public visitFunctionExpression(node: FunctionExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitEmptyStatement(node: EmptyStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitSuperExpression(node: SuperExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitTryStatement(node: TryStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitCatchClause(node: CatchClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitFinallyClause(node: FinallyClauseSyntax): void {
        this.defaultVisit(node);
    }

    public visitLabeledStatement(node: LabeledStatement): void {
        this.defaultVisit(node);
    }

    public visitDoStatement(node: DoStatementSyntax): void {
        this.defaultVisit(node);
    }

    public visitTypeOfExpression(node: TypeOfExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitDeleteExpression(node: DeleteExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitVoidExpression(node: VoidExpressionSyntax): void {
        this.defaultVisit(node);
    }

    public visitDebuggerStatement(node: DebuggerStatementSyntax): void {
        this.defaultVisit(node);
    }
}

interface ISyntaxVisitor1 {
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

class DefaultSyntaxVisitor1 implements ISyntaxVisitor1 {
    public defaultVisit(node: SyntaxNode): any {
        return null;
    }

    public visitSourceUnit(node: SourceUnitSyntax): any {
        return null;
    }

    public visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any {
        return this.defaultVisit(node);
    }

    public visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any {
        return this.defaultVisit(node);
    }

    public visitImportDeclaration(node: ImportDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitClassDeclaration(node: ClassDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitExtendsClause(node: ExtendsClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitImplementsClause(node: ImplementsClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitModuleDeclaration(node: ModuleDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitFunctionDeclaration(node: FunctionDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitVariableStatement(node: VariableStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitVariableDeclaration(node: VariableDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitVariableDeclarator(node: VariableDeclaratorSyntax): any {
        return this.defaultVisit(node);
    }

    public visitEqualsValueClause(node: EqualsValueClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitThisExpression(node: ThisExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitLiteralExpression(node: LiteralExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitOmittedExpression(node: OmittedExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitIdentifierName(node: IdentifierNameSyntax): any {
        return this.defaultVisit(node);
    }

    public visitQualifiedName(node: QualifiedNameSyntax): any {
        return this.defaultVisit(node);
    }

    public visitConstructorType(node: ConstructorTypeSyntax): any {
        return this.defaultVisit(node);
    }

    public visitFunctionType(node: FunctionTypeSyntax): any {
        return this.defaultVisit(node);
    }

    public visitObjectType(node: ObjectTypeSyntax): any {
        return this.defaultVisit(node);
    }

    public visitArrayType(node: ArrayTypeSyntax): any {
        return this.defaultVisit(node);
    }

    public visitPredefinedType(node: PredefinedTypeSyntax): any {
        return this.defaultVisit(node);
    }

    public visitTypeAnnotation(node: TypeAnnotationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitBlock(node: BlockSyntax): any {
        return this.defaultVisit(node);
    }

    public visitParameter(node: ParameterSyntax): any {
        return this.defaultVisit(node);
    }

    public visitMemberAccessExpression(node: MemberAccessExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitElementAccessExpression(node: ElementAccessExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitInvocationExpression(node: InvocationExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitArgumentList(node: ArgumentListSyntax): any {
        return this.defaultVisit(node);
    }

    public visitBinaryExpression(node: BinaryExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitConditionalExpression(node: ConditionalExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitConstructSignature(node: ConstructSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    public visitFunctionSignature(node: FunctionSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    public visitIndexSignature(node: IndexSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    public visitPropertySignature(node: PropertySignatureSyntax): any {
        return this.defaultVisit(node);
    }

    public visitParameterList(node: ParameterListSyntax): any {
        return this.defaultVisit(node);
    }

    public visitCallSignature(node: CallSignatureSyntax): any {
        return this.defaultVisit(node);
    }

    public visitElseClause(node: ElseClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitIfStatement(node: IfStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitExpressionStatement(node: ExpressionStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitThrowStatement(node: ThrowStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitReturnStatement(node: ReturnStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitSwitchStatement(node: SwitchStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitCaseSwitchClause(node: CaseSwitchClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitBreakStatement(node: BreakStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitContinueStatement(node: ContinueStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitForStatement(node: ForStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitForInStatement(node: ForInStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitWhileStatement(node: WhileStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitWithStatement(node: WithStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitEnumDeclaration(node: EnumDeclarationSyntax): any {
        return this.defaultVisit(node);
    }

    public visitCastExpression(node: CastExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): any {
        return this.defaultVisit(node);
    }

    public visitGetAccessorPropertyAssignment(node: GetAccessorPropertyAssignmentSyntax): any {
        return this.defaultVisit(node);
    }

    public visitSetAccessorPropertyAssignment(node: SetAccessorPropertyAssignmentSyntax): any {
        return this.defaultVisit(node);
    }

    public visitFunctionExpression(node: FunctionExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitEmptyStatement(node: EmptyStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitSuperExpression(node: SuperExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitTryStatement(node: TryStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitCatchClause(node: CatchClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitFinallyClause(node: FinallyClauseSyntax): any {
        return this.defaultVisit(node);
    }

    public visitLabeledStatement(node: LabeledStatement): any {
        return this.defaultVisit(node);
    }

    public visitDoStatement(node: DoStatementSyntax): any {
        return this.defaultVisit(node);
    }

    public visitTypeOfExpression(node: TypeOfExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitDeleteExpression(node: DeleteExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitVoidExpression(node: VoidExpressionSyntax): any {
        return this.defaultVisit(node);
    }

    public visitDebuggerStatement(node: DebuggerStatementSyntax): any {
        return this.defaultVisit(node);
    }
}