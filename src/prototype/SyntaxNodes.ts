class SourceUnitSyntax extends SyntaxNode {
    private _moduleElements: ISyntaxList;
    private _endOfFileToken: ISyntaxToken;

    constructor(moduleElements: ISyntaxList,
                endOfFileToken: ISyntaxToken) {
        super();

        this._moduleElements = moduleElements;
        this._endOfFileToken = endOfFileToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSourceUnit(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSourceUnit(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SourceUnit;
    }

    public moduleElements(): ISyntaxList {
        return this._moduleElements;
    }

    public endOfFileToken(): ISyntaxToken {
        return this._endOfFileToken;
    }
}

class ModuleElementSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class ModuleReferenceSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class ExternalModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _stringLiteral: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;

    constructor(moduleKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                stringLiteral: ISyntaxToken,
                closeParenToken: ISyntaxToken) {
        super();

        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitExternalModuleReference(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitExternalModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExternalModuleReference;
    }

    public moduleKeyword(): ISyntaxToken {
        return this._moduleKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public stringLiteral(): ISyntaxToken {
        return this._stringLiteral;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }
}

class ModuleNameModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleName: NameSyntax;

    constructor(moduleName: NameSyntax) {
        super();

        this._moduleName = moduleName;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitModuleNameModuleReference(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitModuleNameModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleNameModuleReference;
    }

    public moduleName(): NameSyntax {
        return this._moduleName;
    }
}

class ImportDeclarationSyntax extends ModuleElementSyntax {
    private _importKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _equalsToken: ISyntaxToken;
    private _moduleReference: ModuleReferenceSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(importKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                equalsToken: ISyntaxToken,
                moduleReference: ModuleReferenceSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitImportDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitImportDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImportDeclaration;
    }

    public importKeyword(): ISyntaxToken {
        return this._importKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public equalsToken(): ISyntaxToken {
        return this._equalsToken;
    }

    public moduleReference(): ModuleReferenceSyntax {
        return this._moduleReference;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ClassDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _classKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _extendsClause: ExtendsClauseSyntax;
    private _implementsClause: ImplementsClauseSyntax;
    private _openBraceToken: ISyntaxToken;
    private _classElements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                classKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                extendsClause: ExtendsClauseSyntax,
                implementsClause: ImplementsClauseSyntax,
                openBraceToken: ISyntaxToken,
                classElements: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._classKeyword = classKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._implementsClause = implementsClause;
        this._openBraceToken = openBraceToken;
        this._classElements = classElements;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitClassDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitClassDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ClassDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public classKeyword(): ISyntaxToken {
        return this._classKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public extendsClause(): ExtendsClauseSyntax {
        return this._extendsClause;
    }

    public implementsClause(): ImplementsClauseSyntax {
        return this._implementsClause;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public classElements(): ISyntaxList {
        return this._classElements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class InterfaceDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _interfaceKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _extendsClause: ExtendsClauseSyntax;
    private _body: ObjectTypeSyntax;

    constructor(exportKeyword: ISyntaxToken,
                interfaceKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                extendsClause: ExtendsClauseSyntax,
                body: ObjectTypeSyntax) {
        super();

        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._body = body;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitInterfaceDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitInterfaceDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InterfaceDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public interfaceKeyword(): ISyntaxToken {
        return this._interfaceKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public extendsClause(): ExtendsClauseSyntax {
        return this._extendsClause;
    }

    public body(): ObjectTypeSyntax {
        return this._body;
    }
}

class ExtendsClauseSyntax extends SyntaxNode {
    private _extendsKeyword: ISyntaxToken;
    private _typeNames: ISeparatedSyntaxList;

    constructor(extendsKeyword: ISyntaxToken,
                typeNames: ISeparatedSyntaxList) {
        super();

        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitExtendsClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitExtendsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExtendsClause;
    }

    public extendsKeyword(): ISyntaxToken {
        return this._extendsKeyword;
    }

    public typeNames(): ISeparatedSyntaxList {
        return this._typeNames;
    }
}

class ImplementsClauseSyntax extends SyntaxNode {
    private _implementsKeyword: ISyntaxToken;
    private _typeNames: ISeparatedSyntaxList;

    constructor(implementsKeyword: ISyntaxToken,
                typeNames: ISeparatedSyntaxList) {
        super();

        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitImplementsClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitImplementsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImplementsClause;
    }

    public implementsKeyword(): ISyntaxToken {
        return this._implementsKeyword;
    }

    public typeNames(): ISeparatedSyntaxList {
        return this._typeNames;
    }
}

class ModuleDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _moduleKeyword: ISyntaxToken;
    private _moduleName: NameSyntax;
    private _stringLiteral: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _moduleElements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                moduleKeyword: ISyntaxToken,
                moduleName: NameSyntax,
                stringLiteral: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                moduleElements: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._moduleKeyword = moduleKeyword;
        this._moduleName = moduleName;
        this._stringLiteral = stringLiteral;
        this._openBraceToken = openBraceToken;
        this._moduleElements = moduleElements;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitModuleDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitModuleDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public moduleKeyword(): ISyntaxToken {
        return this._moduleKeyword;
    }

    public moduleName(): NameSyntax {
        return this._moduleName;
    }

    public stringLiteral(): ISyntaxToken {
        return this._stringLiteral;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public moduleElements(): ISyntaxList {
        return this._moduleElements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class StatementSyntax extends ModuleElementSyntax {
    constructor() {
        super();
    }
}

class FunctionDeclarationSyntax extends StatementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _functionKeyword: ISyntaxToken;
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                functionKeyword: ISyntaxToken,
                functionSignature: FunctionSignatureSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public functionKeyword(): ISyntaxToken {
        return this._functionKeyword;
    }

    public functionSignature(): FunctionSignatureSyntax {
        return this._functionSignature;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class VariableStatementSyntax extends StatementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVariableStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitVariableStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableStatement;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ExpressionSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class UnaryExpressionSyntax extends ExpressionSyntax {
    constructor() {
        super();
    }
}

class VariableDeclarationSyntax extends SyntaxNode {
    private _varKeyword: ISyntaxToken;
    private _variableDeclarators: ISeparatedSyntaxList;

    constructor(varKeyword: ISyntaxToken,
                variableDeclarators: ISeparatedSyntaxList) {
        super();

        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVariableDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclaration;
    }

    public varKeyword(): ISyntaxToken {
        return this._varKeyword;
    }

    public variableDeclarators(): ISeparatedSyntaxList {
        return this._variableDeclarators;
    }
}

class VariableDeclaratorSyntax extends SyntaxNode {
    private _identifier: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _equalsValueClause: EqualsValueClauseSyntax;

    constructor(identifier: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax,
                equalsValueClause: EqualsValueClauseSyntax) {
        super();

        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVariableDeclarator(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitVariableDeclarator(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclarator;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public equalsValueClause(): EqualsValueClauseSyntax {
        return this._equalsValueClause;
    }
}

class EqualsValueClauseSyntax extends SyntaxNode {
    private _equalsToken: ISyntaxToken;
    private _value: ExpressionSyntax;

    constructor(equalsToken: ISyntaxToken,
                value: ExpressionSyntax) {
        super();

        this._equalsToken = equalsToken;
        this._value = value;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitEqualsValueClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitEqualsValueClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EqualsValueClause;
    }

    public equalsToken(): ISyntaxToken {
        return this._equalsToken;
    }

    public value(): ExpressionSyntax {
        return this._value;
    }
}

class PrefixUnaryExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _operatorToken: ISyntaxToken;
    private _operand: UnaryExpressionSyntax;

    constructor(kind: SyntaxKind,
                operatorToken: ISyntaxToken,
                operand: UnaryExpressionSyntax) {
        super();

        this._kind = kind;
        this._operatorToken = operatorToken;
        this._operand = operand;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPrefixUnaryExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPrefixUnaryExpression(this);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public operand(): UnaryExpressionSyntax {
        return this._operand;
    }
}

class ThisExpressionSyntax extends UnaryExpressionSyntax {
    private _thisKeyword: ISyntaxToken;

    constructor(thisKeyword: ISyntaxToken) {
        super();

        this._thisKeyword = thisKeyword;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitThisExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitThisExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThisExpression;
    }

    public thisKeyword(): ISyntaxToken {
        return this._thisKeyword;
    }
}

class LiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _literalToken: ISyntaxToken;

    constructor(kind: SyntaxKind,
                literalToken: ISyntaxToken) {
        super();

        this._kind = kind;
        this._literalToken = literalToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitLiteralExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public literalToken(): ISyntaxToken {
        return this._literalToken;
    }
}

class ArrayLiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _openBracketToken: ISyntaxToken;
    private _expressions: ISeparatedSyntaxList;
    private _closeBracketToken: ISyntaxToken;

    constructor(openBracketToken: ISyntaxToken,
                expressions: ISeparatedSyntaxList,
                closeBracketToken: ISyntaxToken) {
        super();

        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitArrayLiteralExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitArrayLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayLiteralExpression;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public expressions(): ISeparatedSyntaxList {
        return this._expressions;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }
}

class OmittedExpressionSyntax extends ExpressionSyntax {
    constructor() {
        super();
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitOmittedExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitOmittedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.OmittedExpression;
    }
}

class ParenthesizedExpressionSyntax extends UnaryExpressionSyntax {
    private _openParenToken: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken) {
        super();

        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParenthesizedExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitParenthesizedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedExpression;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }
}

class ArrowFunctionExpressionSyntax extends UnaryExpressionSyntax {
    constructor() {
        super();
    }
}

class SimpleArrowFunctionExpression extends ArrowFunctionExpressionSyntax {
    private _identifier: ISyntaxToken;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _body: SyntaxNode;

    constructor(identifier: ISyntaxToken,
                equalsGreaterThanToken: ISyntaxToken,
                body: SyntaxNode) {
        super();

        this._identifier = identifier;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSimpleArrowFunctionExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSimpleArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimpleArrowFunctionExpression;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): SyntaxNode {
        return this._body;
    }
}

class ParenthesizedArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
    private _callSignature: CallSignatureSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _body: SyntaxNode;

    constructor(callSignature: CallSignatureSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                body: SyntaxNode) {
        super();

        this._callSignature = callSignature;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParenthesizedArrowFunctionExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitParenthesizedArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedArrowFunctionExpression;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): SyntaxNode {
        return this._body;
    }
}

class TypeSyntax extends UnaryExpressionSyntax {
    constructor() {
        super();
    }
}

class NameSyntax extends TypeSyntax {
    constructor() {
        super();
    }
}

class IdentifierNameSyntax extends NameSyntax {
    private _identifier: ISyntaxToken;

    constructor(identifier: ISyntaxToken) {
        super();

        this._identifier = identifier;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitIdentifierName(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitIdentifierName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IdentifierName;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }
}

class QualifiedNameSyntax extends NameSyntax {
    private _left: NameSyntax;
    private _dotToken: ISyntaxToken;
    private _right: IdentifierNameSyntax;

    constructor(left: NameSyntax,
                dotToken: ISyntaxToken,
                right: IdentifierNameSyntax) {
        super();

        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitQualifiedName(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitQualifiedName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.QualifiedName;
    }

    public left(): NameSyntax {
        return this._left;
    }

    public dotToken(): ISyntaxToken {
        return this._dotToken;
    }

    public right(): IdentifierNameSyntax {
        return this._right;
    }
}

class ConstructorTypeSyntax extends TypeSyntax {
    private _newKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(newKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConstructorType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitConstructorType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorType;
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }
}

class FunctionTypeSyntax extends TypeSyntax {
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitFunctionType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionType;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }
}

class ObjectTypeSyntax extends TypeSyntax {
    private _openBraceToken: ISyntaxToken;
    private _typeMembers: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                typeMembers: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitObjectType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitObjectType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectType;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public typeMembers(): ISeparatedSyntaxList {
        return this._typeMembers;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class ArrayTypeSyntax extends TypeSyntax {
    private _type: TypeSyntax;
    private _openBracketToken: ISyntaxToken;
    private _closeBracketToken: ISyntaxToken;

    constructor(type: TypeSyntax,
                openBracketToken: ISyntaxToken,
                closeBracketToken: ISyntaxToken) {
        super();

        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitArrayType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitArrayType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayType;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }
}

class PredefinedTypeSyntax extends TypeSyntax {
    private _keyword: ISyntaxToken;

    constructor(keyword: ISyntaxToken) {
        super();

        this._keyword = keyword;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPredefinedType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPredefinedType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PredefinedType;
    }

    public keyword(): ISyntaxToken {
        return this._keyword;
    }
}

class TypeAnnotationSyntax extends SyntaxNode {
    private _colonToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(colonToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        this._colonToken = colonToken;
        this._type = type;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitTypeAnnotation(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitTypeAnnotation(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeAnnotation;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }
}

class BlockSyntax extends StatementSyntax {
    private _openBraceToken: ISyntaxToken;
    private _statements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                statements: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._openBraceToken = openBraceToken;
        this._statements = statements;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitBlock(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitBlock(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Block;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class ParameterSyntax extends SyntaxNode {
    private _dotDotDotToken: ISyntaxToken;
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _equalsValueClause: EqualsValueClauseSyntax;

    constructor(dotDotDotToken: ISyntaxToken,
                publicOrPrivateKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax,
                equalsValueClause: EqualsValueClauseSyntax) {
        super();

        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParameter(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitParameter(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Parameter;
    }

    public dotDotDotToken(): ISyntaxToken {
        return this._dotDotDotToken;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public equalsValueClause(): EqualsValueClauseSyntax {
        return this._equalsValueClause;
    }
}

class MemberAccessExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _dotToken: ISyntaxToken;
    private _identifierName: IdentifierNameSyntax;

    constructor(expression: ExpressionSyntax,
                dotToken: ISyntaxToken,
                identifierName: IdentifierNameSyntax) {
        super();

        this._expression = expression;
        this._dotToken = dotToken;
        this._identifierName = identifierName;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitMemberAccessExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitMemberAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberAccessExpression;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public dotToken(): ISyntaxToken {
        return this._dotToken;
    }

    public identifierName(): IdentifierNameSyntax {
        return this._identifierName;
    }
}

class PostfixUnaryExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _operand: ExpressionSyntax;
    private _operatorToken: ISyntaxToken;

    constructor(kind: SyntaxKind,
                operand: ExpressionSyntax,
                operatorToken: ISyntaxToken) {
        super();

        this._kind = kind;
        this._operand = operand;
        this._operatorToken = operatorToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPostfixUnaryExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPostfixUnaryExpression(this);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public operand(): ExpressionSyntax {
        return this._operand;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }
}

class ElementAccessExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _openBracketToken: ISyntaxToken;
    private _argumentExpression: ExpressionSyntax;
    private _closeBracketToken: ISyntaxToken;

    constructor(expression: ExpressionSyntax,
                openBracketToken: ISyntaxToken,
                argumentExpression: ExpressionSyntax,
                closeBracketToken: ISyntaxToken) {
        super();

        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitElementAccessExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitElementAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElementAccessExpression;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public argumentExpression(): ExpressionSyntax {
        return this._argumentExpression;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }
}

class InvocationExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _argumentList: ArgumentListSyntax;

    constructor(expression: ExpressionSyntax,
                argumentList: ArgumentListSyntax) {
        super();

        this._expression = expression;
        this._argumentList = argumentList;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitInvocationExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitInvocationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InvocationExpression;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }
}

class ArgumentListSyntax extends SyntaxNode {
    private _openParenToken: ISyntaxToken;
    private _arguments: ISeparatedSyntaxList;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                arguments: ISeparatedSyntaxList,
                closeParenToken: ISyntaxToken) {
        super();

        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitArgumentList(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitArgumentList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArgumentList;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public arguments(): ISeparatedSyntaxList {
        return this._arguments;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }
}

class BinaryExpressionSyntax extends ExpressionSyntax {
    private _kind: SyntaxKind;
    private _left: ExpressionSyntax;
    private _operatorToken: ISyntaxToken;
    private _right: ExpressionSyntax;

    constructor(kind: SyntaxKind,
                left: ExpressionSyntax,
                operatorToken: ISyntaxToken,
                right: ExpressionSyntax) {
        super();

        this._kind = kind;
        this._left = left;
        this._operatorToken = operatorToken;
        this._right = right;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitBinaryExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitBinaryExpression(this);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public left(): ExpressionSyntax {
        return this._left;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public right(): ExpressionSyntax {
        return this._right;
    }
}

class ConditionalExpressionSyntax extends ExpressionSyntax {
    private _condition: ExpressionSyntax;
    private _questionToken: ISyntaxToken;
    private _whenTrue: ExpressionSyntax;
    private _colonToken: ISyntaxToken;
    private _whenFalse: ExpressionSyntax;

    constructor(condition: ExpressionSyntax,
                questionToken: ISyntaxToken,
                whenTrue: ExpressionSyntax,
                colonToken: ISyntaxToken,
                whenFalse: ExpressionSyntax) {
        super();

        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConditionalExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitConditionalExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConditionalExpression;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public whenTrue(): ExpressionSyntax {
        return this._whenTrue;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public whenFalse(): ExpressionSyntax {
        return this._whenFalse;
    }
}

class TypeMemberSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class ConstructSignatureSyntax extends TypeMemberSyntax {
    private _newKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(newKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConstructSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitConstructSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructSignature;
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }
}

class FunctionSignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitFunctionSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionSignature;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }
}

class IndexSignatureSyntax extends TypeMemberSyntax {
    private _openBracketToken: ISyntaxToken;
    private _parameter: ParameterSyntax;
    private _closeBracketToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(openBracketToken: ISyntaxToken,
                parameter: ParameterSyntax,
                closeBracketToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        this._openBracketToken = openBracketToken;
        this._parameter = parameter;
        this._closeBracketToken = closeBracketToken;
        this._typeAnnotation = typeAnnotation;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitIndexSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitIndexSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IndexSignature;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public parameter(): ParameterSyntax {
        return this._parameter;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }
}

class PropertySignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPropertySignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPropertySignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PropertySignature;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }
}

class ParameterListSyntax extends SyntaxNode {
    private _openParenToken: ISyntaxToken;
    private _parameters: ISeparatedSyntaxList;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                parameters: ISeparatedSyntaxList,
                closeParenToken: ISyntaxToken) {
        super();

        this._openParenToken = openParenToken;
        this._parameters = parameters;
        this._closeParenToken = closeParenToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParameterList(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitParameterList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParameterList;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public parameters(): ISeparatedSyntaxList {
        return this._parameters;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }
}

class CallSignatureSyntax extends TypeMemberSyntax {
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCallSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitCallSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CallSignature;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }
}

class ElseClauseSyntax extends SyntaxNode {
    private _elseKeyword: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(elseKeyword: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        this._elseKeyword = elseKeyword;
        this._statement = statement;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitElseClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitElseClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElseClause;
    }

    public elseKeyword(): ISyntaxToken {
        return this._elseKeyword;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class IfStatementSyntax extends StatementSyntax {
    private _ifKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;
    private _elseClause: ElseClauseSyntax;

    constructor(ifKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax,
                elseClause: ElseClauseSyntax) {
        super();

        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitIfStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitIfStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IfStatement;
    }

    public ifKeyword(): ISyntaxToken {
        return this._ifKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public elseClause(): ElseClauseSyntax {
        return this._elseClause;
    }
}

class ExpressionStatementSyntax extends StatementSyntax {
    private _expression: ExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(expression: ExpressionSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitExpressionStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitExpressionStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExpressionStatement;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ClassElementSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class ConstructorDeclarationSyntax extends ClassElementSyntax {
    private _constructorKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(constructorKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConstructorDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitConstructorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorDeclaration;
    }

    public constructorKeyword(): ISyntaxToken {
        return this._constructorKeyword;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class MemberDeclarationSyntax extends ClassElementSyntax {
    constructor() {
        super();
    }
}

class MemberFunctionDeclarationSyntax extends MemberDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                functionSignature: FunctionSignatureSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitMemberFunctionDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitMemberFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public functionSignature(): FunctionSignatureSyntax {
        return this._functionSignature;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class MemberAccessorDeclarationSyntax extends MemberDeclarationSyntax {
    constructor() {
        super();
    }
}

class GetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _getKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _block: BlockSyntax;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                getKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax,
                block: BlockSyntax) {
        super();

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._getKeyword = getKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitGetMemberAccessorDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitGetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetMemberAccessorDeclaration;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public getKeyword(): ISyntaxToken {
        return this._getKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class SetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _setKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _block: BlockSyntax;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                setKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                parameterList: ParameterListSyntax,
                block: BlockSyntax) {
        super();

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._setKeyword = setKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSetMemberAccessorDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetMemberAccessorDeclaration;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public setKeyword(): ISyntaxToken {
        return this._setKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class MemberVariableDeclarationSyntax extends MemberDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _variableDeclarator: VariableDeclaratorSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                variableDeclarator: VariableDeclaratorSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitMemberVariableDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitMemberVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberVariableDeclaration;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public variableDeclarator(): VariableDeclaratorSyntax {
        return this._variableDeclarator;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ThrowStatementSyntax extends StatementSyntax {
    private _throwKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(throwKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._throwKeyword = throwKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitThrowStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitThrowStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThrowStatement;
    }

    public throwKeyword(): ISyntaxToken {
        return this._throwKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ReturnStatementSyntax extends StatementSyntax {
    private _returnKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(returnKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        this._returnKeyword = returnKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitReturnStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitReturnStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ReturnStatement;
    }

    public returnKeyword(): ISyntaxToken {
        return this._returnKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ObjectCreationExpressionSyntax extends UnaryExpressionSyntax {
    private _newKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _argumentList: ArgumentListSyntax;

    constructor(newKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                argumentList: ArgumentListSyntax) {
        super();

        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitObjectCreationExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitObjectCreationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectCreationExpression;
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }
}

class SwitchStatementSyntax extends StatementSyntax {
    private _switchKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _caseClauses: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(switchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                caseClauses: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._switchKeyword = switchKeyword;
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._openBraceToken = openBraceToken;
        this._caseClauses = caseClauses;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSwitchStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSwitchStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SwitchStatement;
    }

    public switchKeyword(): ISyntaxToken {
        return this._switchKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public caseClauses(): ISyntaxList {
        return this._caseClauses;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class SwitchClauseSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class CaseSwitchClauseSyntax extends SwitchClauseSyntax {
    private _caseKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxList;

    constructor(caseKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                colonToken: ISyntaxToken,
                statements: ISyntaxList) {
        super();

        this._caseKeyword = caseKeyword;
        this._expression = expression;
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCaseSwitchClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitCaseSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CaseSwitchClause;
    }

    public caseKeyword(): ISyntaxToken {
        return this._caseKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }
}

class DefaultSwitchClauseSyntax extends SwitchClauseSyntax {
    private _defaultKeyword: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxList;

    constructor(defaultKeyword: ISyntaxToken,
                colonToken: ISyntaxToken,
                statements: ISyntaxList) {
        super();

        this._defaultKeyword = defaultKeyword;
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDefaultSwitchClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitDefaultSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DefaultSwitchClause;
    }

    public defaultKeyword(): ISyntaxToken {
        return this._defaultKeyword;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }
}

class BreakStatementSyntax extends StatementSyntax {
    private _breakKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(breakKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitBreakStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitBreakStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.BreakStatement;
    }

    public breakKeyword(): ISyntaxToken {
        return this._breakKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ContinueStatementSyntax extends StatementSyntax {
    private _continueKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(continueKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        this._continueKeyword = continueKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitContinueStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitContinueStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ContinueStatement;
    }

    public continueKeyword(): ISyntaxToken {
        return this._continueKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class IterationStatementSyntax extends StatementSyntax {
    constructor() {
        super();
    }
}

class BaseForStatementSyntax extends IterationStatementSyntax {
    constructor() {
        super();
    }
}

class ForStatementSyntax extends BaseForStatementSyntax {
    private _forKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _initializer: ExpressionSyntax;
    private _firstSemicolonToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _secondSemicolonToken: ISyntaxToken;
    private _incrementor: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                initializer: ExpressionSyntax,
                firstSemicolonToken: ISyntaxToken,
                condition: ExpressionSyntax,
                secondSemicolonToken: ISyntaxToken,
                incrementor: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._initializer = initializer;
        this._firstSemicolonToken = firstSemicolonToken;
        this._condition = condition;
        this._secondSemicolonToken = secondSemicolonToken;
        this._incrementor = incrementor;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitForStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitForStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForStatement;
    }

    public forKeyword(): ISyntaxToken {
        return this._forKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public initializer(): ExpressionSyntax {
        return this._initializer;
    }

    public firstSemicolonToken(): ISyntaxToken {
        return this._firstSemicolonToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public secondSemicolonToken(): ISyntaxToken {
        return this._secondSemicolonToken;
    }

    public incrementor(): ExpressionSyntax {
        return this._incrementor;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class ForInStatementSyntax extends BaseForStatementSyntax {
    private _forKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _left: ExpressionSyntax;
    private _inKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                left: ExpressionSyntax,
                inKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._left = left;
        this._inKeyword = inKeyword;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitForInStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitForInStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForInStatement;
    }

    public forKeyword(): ISyntaxToken {
        return this._forKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public left(): ExpressionSyntax {
        return this._left;
    }

    public inKeyword(): ISyntaxToken {
        return this._inKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class WhileStatementSyntax extends IterationStatementSyntax {
    private _whileKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitWhileStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitWhileStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WhileStatement;
    }

    public whileKeyword(): ISyntaxToken {
        return this._whileKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class WithStatementSyntax extends StatementSyntax {
    private _withKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(withKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        this._withKeyword = withKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitWithStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitWithStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WithStatement;
    }

    public withKeyword(): ISyntaxToken {
        return this._withKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class EnumDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _enumKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _variableDeclarators: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                enumKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                variableDeclarators: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._exportKeyword = exportKeyword;
        this._enumKeyword = enumKeyword;
        this._identifier = identifier;
        this._openBraceToken = openBraceToken;
        this._variableDeclarators = variableDeclarators;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitEnumDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitEnumDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EnumDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public enumKeyword(): ISyntaxToken {
        return this._enumKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public variableDeclarators(): ISeparatedSyntaxList {
        return this._variableDeclarators;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class CastExpressionSyntax extends UnaryExpressionSyntax {
    private _lessThanToken: ISyntaxToken;
    private _type: TypeSyntax;
    private _greaterThanToken: ISyntaxToken;
    private _expression: UnaryExpressionSyntax;

    constructor(lessThanToken: ISyntaxToken,
                type: TypeSyntax,
                greaterThanToken: ISyntaxToken,
                expression: UnaryExpressionSyntax) {
        super();

        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCastExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitCastExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CastExpression;
    }

    public lessThanToken(): ISyntaxToken {
        return this._lessThanToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public greaterThanToken(): ISyntaxToken {
        return this._greaterThanToken;
    }

    public expression(): UnaryExpressionSyntax {
        return this._expression;
    }
}

class ObjectLiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _openBraceToken: ISyntaxToken;
    private _propertyAssignments: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                propertyAssignments: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitObjectLiteralExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitObjectLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectLiteralExpression;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public propertyAssignments(): ISeparatedSyntaxList {
        return this._propertyAssignments;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class PropertyAssignmentSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class SimplePropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    private _propertyName: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(propertyName: ISyntaxToken,
                colonToken: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        this._propertyName = propertyName;
        this._colonToken = colonToken;
        this._expression = expression;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSimplePropertyAssignment(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSimplePropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimplePropertyAssignment;
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }
}

class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    constructor() {
        super();
    }
}

class GetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
    private _getKeyword: ISyntaxToken;
    private _propertyName: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(getKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super();

        this._getKeyword = getKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitGetAccessorPropertyAssignment(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitGetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetAccessorPropertyAssignment;
    }

    public getKeyword(): ISyntaxToken {
        return this._getKeyword;
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class SetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
    private _setKeyword: ISyntaxToken;
    private _propertyName: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _parameterName: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(setKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                parameterName: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super();

        this._setKeyword = setKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._parameterName = parameterName;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSetAccessorPropertyAssignment(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetAccessorPropertyAssignment;
    }

    public setKeyword(): ISyntaxToken {
        return this._setKeyword;
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public parameterName(): ISyntaxToken {
        return this._parameterName;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class FunctionExpressionSyntax extends UnaryExpressionSyntax {
    private _functionKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _callSignature: CallSignatureSyntax;
    private _block: BlockSyntax;

    constructor(functionKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                callSignature: CallSignatureSyntax,
                block: BlockSyntax) {
        super();

        this._functionKeyword = functionKeyword;
        this._identifier = identifier;
        this._callSignature = callSignature;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionExpression;
    }

    public functionKeyword(): ISyntaxToken {
        return this._functionKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class EmptyStatementSyntax extends StatementSyntax {
    private _semicolonToken: ISyntaxToken;

    constructor(semicolonToken: ISyntaxToken) {
        super();

        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitEmptyStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitEmptyStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EmptyStatement;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class SuperExpressionSyntax extends UnaryExpressionSyntax {
    private _superKeyword: ISyntaxToken;

    constructor(superKeyword: ISyntaxToken) {
        super();

        this._superKeyword = superKeyword;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSuperExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSuperExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SuperExpression;
    }

    public superKeyword(): ISyntaxToken {
        return this._superKeyword;
    }
}

class TryStatementSyntax extends StatementSyntax {
    private _tryKeyword: ISyntaxToken;
    private _block: BlockSyntax;
    private _catchClause: CatchClauseSyntax;
    private _finallyClause: FinallyClauseSyntax;

    constructor(tryKeyword: ISyntaxToken,
                block: BlockSyntax,
                catchClause: CatchClauseSyntax,
                finallyClause: FinallyClauseSyntax) {
        super();

        this._tryKeyword = tryKeyword;
        this._block = block;
        this._catchClause = catchClause;
        this._finallyClause = finallyClause;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitTryStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitTryStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TryStatement;
    }

    public tryKeyword(): ISyntaxToken {
        return this._tryKeyword;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public catchClause(): CatchClauseSyntax {
        return this._catchClause;
    }

    public finallyClause(): FinallyClauseSyntax {
        return this._finallyClause;
    }
}

class CatchClauseSyntax extends SyntaxNode {
    private _catchKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(catchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                identifier: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super();

        this._catchKeyword = catchKeyword;
        this._openParenToken = openParenToken;
        this._identifier = identifier;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCatchClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitCatchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CatchClause;
    }

    public catchKeyword(): ISyntaxToken {
        return this._catchKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class FinallyClauseSyntax extends SyntaxNode {
    private _finallyKeyword: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(finallyKeyword: ISyntaxToken,
                block: BlockSyntax) {
        super();

        this._finallyKeyword = finallyKeyword;
        this._block = block;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFinallyClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitFinallyClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FinallyClause;
    }

    public finallyKeyword(): ISyntaxToken {
        return this._finallyKeyword;
    }

    public block(): BlockSyntax {
        return this._block;
    }
}

class LabeledStatement extends StatementSyntax {
    private _identifier: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(identifier: ISyntaxToken,
                colonToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        this._identifier = identifier;
        this._colonToken = colonToken;
        this._statement = statement;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitLabeledStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitLabeledStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.LabeledStatement;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class DoStatementSyntax extends IterationStatementSyntax {
    private _doKeyword: ISyntaxToken;
    private _statement: StatementSyntax;
    private _whileKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(doKeyword: ISyntaxToken,
                statement: StatementSyntax,
                whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        this._doKeyword = doKeyword;
        this._statement = statement;
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDoStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitDoStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DoStatement;
    }

    public doKeyword(): ISyntaxToken {
        return this._doKeyword;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public whileKeyword(): ISyntaxToken {
        return this._whileKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class TypeOfExpressionSyntax extends UnaryExpressionSyntax {
    private _typeOfKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(typeOfKeyword: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        this._typeOfKeyword = typeOfKeyword;
        this._expression = expression;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitTypeOfExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitTypeOfExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeOfExpression;
    }

    public typeOfKeyword(): ISyntaxToken {
        return this._typeOfKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }
}

class DeleteExpressionSyntax extends UnaryExpressionSyntax {
    private _deleteKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(deleteKeyword: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        this._deleteKeyword = deleteKeyword;
        this._expression = expression;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDeleteExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitDeleteExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DeleteExpression;
    }

    public deleteKeyword(): ISyntaxToken {
        return this._deleteKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }
}

class VoidExpressionSyntax extends UnaryExpressionSyntax {
    private _voidKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(voidKeyword: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        this._voidKeyword = voidKeyword;
        this._expression = expression;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVoidExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitVoidExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VoidExpression;
    }

    public voidKeyword(): ISyntaxToken {
        return this._voidKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }
}

class DebuggerStatementSyntax extends StatementSyntax {
    private _debuggerKeyword: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(debuggerKeyword: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        this._debuggerKeyword = debuggerKeyword;
        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDebuggerStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitDebuggerStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DebuggerStatement;
    }

    public debuggerKeyword(): ISyntaxToken {
        return this._debuggerKeyword;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}