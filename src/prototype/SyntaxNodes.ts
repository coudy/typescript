///<reference path='References.ts' />

class SourceUnitSyntax extends SyntaxNode {
    private _moduleElements: ISyntaxNodeList;
    private _endOfFileToken: ISyntaxToken;

    constructor (moduleElements: ISyntaxNodeList, endOfFileToken: ISyntaxToken) {
        super();

        if (moduleElements === null) {
            throw Errors.argumentNull("moduleElements");
        }

        if (endOfFileToken.kind() !== SyntaxKind.EndOfFileToken) {
            throw Errors.argument("endOfFileToken");
        }

        this._moduleElements = moduleElements;
        this._endOfFileToken = endOfFileToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SourceUnit;
    }

    public moduleElements(): ISyntaxNodeList {
        return this._moduleElements;
    }

    public endOfFileToken(): ISyntaxToken {
        return this._endOfFileToken;
    }
}

class ModuleElementSyntax extends SyntaxNode {
}

class ModuleReferenceSyntax extends SyntaxNode {
}

class ExternalModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _stringLiteral: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;

    constructor (moduleKeyword: ISyntaxToken,
                 openParenToken: ISyntaxToken,
                 stringLiteral: ISyntaxToken,
                 closeParenToken: ISyntaxToken) {
        super();

        if (moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) {
            throw Errors.argument("moduleKeyword");
        }

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (stringLiteral.kind() !== SyntaxKind.StringLiteral) {
            throw Errors.argument("stringLiteral");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
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

class ModuleNameModuleReference extends ModuleReferenceSyntax {
    private _moduleName: NameSyntax;

    constructor (moduleName: NameSyntax) {
        super();

        if (moduleName === null) {
            throw Errors.argumentNull("moduleName");
        }

        this._moduleName = moduleName;
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

    constructor (importKeyword: ISyntaxToken,
                 identifier: ISyntaxToken,
                 equalsToken: ISyntaxToken,
                 moduleReference: ModuleReferenceSyntax,
                 semicolonToken: ISyntaxToken) {
        super();

        if (importKeyword.kind() !== SyntaxKind.ImportKeyword) {
            throw Errors.argument("importKeyword");
        }

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (equalsToken.kind() !== SyntaxKind.EqualsToken) {
            throw Errors.argument("equalsToken");
        }

        if (moduleReference === null) {
            throw Errors.argumentNull("moduleReference");
        }

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }

    public importKeyword(): ISyntaxToken {
        return this._importKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public equalsTokens(): ISyntaxToken {
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
    private _classKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _extendsClause: ExtendsClauseSyntax;
    private _implementsClause: ImplementsClauseSyntax;
    private _openBraceToken: ISyntaxToken;
    private _classElements: ISyntaxNodeList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                classKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                extendsClause: ExtendsClauseSyntax,
                implementsClause: ImplementsClauseSyntax,
                openBraceToken: ISyntaxToken,
                classElements: ISyntaxNodeList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (classKeyword.keywordKind() !== SyntaxKind.ClassKeyword) {
            throw Errors.argument("classKeyword");
        }

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (classElements === null) {
            throw Errors.argumentNull("classElements");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }

        this._exportKeyword = exportKeyword;
        this._classKeyword = classKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._implementsClause = implementsClause;
        this._openBraceToken = openBraceToken;
        this._classElements = classElements;
        this._closeBraceToken = closeBraceToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ClassDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
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

    public classElements(): ISyntaxNodeList {
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

    constructor (exportKeyword: ISyntaxToken,
                 interfaceKeyword: ISyntaxToken,
                 identifier: ISyntaxToken,
                 extendsClause: ExtendsClauseSyntax,
                 body: ObjectTypeSyntax) {
        super();

        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (interfaceKeyword.keywordKind() !== SyntaxKind.InterfaceKeyword) {
            throw Errors.argument("interfaceKeyword");
        }

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (body === null) {
            throw Errors.argumentNull("body");
        }

        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._body = body;
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

    constructor (extendsKeyword: ISyntaxToken,
                 typeNames: ISeparatedSyntaxList) {
        super();

        if (extendsKeyword.keywordKind() !== SyntaxKind.ExtendsKeyword) {
            throw Errors.argument("extendsKeyword");
        }

        if (typeNames === null) {
            throw Errors.argumentNull("typeNames");
        }

        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
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

    constructor (implementsKeyword: ISyntaxToken,
                 typeNames: ISeparatedSyntaxList) {
        super();

        if (implementsKeyword.keywordKind() !== SyntaxKind.ImplementsKeyword) {
            throw Errors.argument("extendsKimplementsKeywordeyword");
        }

        if (typeNames === null) {
            throw Errors.argumentNull("typeNames");
        }

        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
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
    private _moduleKeyword: ISyntaxToken;
    private _moduleName: NameSyntax;
    private _openBraceToken: ISyntaxToken;
    private _moduleElements: ISyntaxNodeList;
    private _closeBraceToken: ISyntaxToken;

    constructor (exportKeyword: ISyntaxToken,
                 moduleKeyword: ISyntaxToken,
                 moduleName: NameSyntax,
                 openBraceToken: ISyntaxToken,
                 moduleElements: ISyntaxNodeList,
                 closeBraceToken: ISyntaxToken) {
        super();

        if (exportKeyword != null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) {
            throw Errors.argument("moduleKeyword");
        }

        if (moduleName === null) {
            throw Errors.argumentNull("moduleName");
        }

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (moduleElements === null) {
            throw Errors.argumentNull("moduleElements");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }

        this._moduleKeyword = moduleKeyword;
        this._moduleName = moduleName;
        this._openBraceToken = openBraceToken;
        this._moduleElements = moduleElements;
        this._closeBraceToken = closeBraceToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleDeclaration;
    }

    public moduleKeyword(): ISyntaxToken {
        return this._moduleKeyword;
    }

    public moduleName(): NameSyntax {
        return this._moduleName;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public moduleElements(): ISyntaxNodeList {
        return this._moduleElements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class StatementSyntax extends ModuleElementSyntax {
}

class FunctionDeclarationSyntax extends StatementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _functionKeyword: ISyntaxToken;
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor (exportKeyword: ISyntaxToken,
                 functionKeyword: ISyntaxToken,
                 functionSignature: FunctionSignatureSyntax,
                 block: BlockSyntax,
                 semicolonToken: ISyntaxToken) {
        super();

        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (functionKeyword.keywordKind() !== SyntaxKind.FunctionKeyword) {
            throw Errors.argument("functionKeyword");
        }

        if (functionSignature === null) {
            throw Errors.argumentNull("functionSignature");
        }

        // TODO: Add argument checking that exactly one of 'block' and 'semicolonToken' is set.

        if (semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._exportKeyword = exportKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature
        this._semicolonToken = semicolonToken;
        this._block = block;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionDeclaration;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
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
    private _variableDeclaration: VariableDeclarationSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor (exportKeyword: ISyntaxToken,
                 variableDeclaration: VariableDeclarationSyntax,
                 semicolonToken: ISyntaxToken) {
        super();

        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (variableDeclaration === null) {
            throw Errors.argumentNull("variableDeclaration");
        }

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._exportKeyword = exportKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableStatement;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ExpressionSyntax extends SyntaxNode {
}

class UnaryExpressionSyntax extends ExpressionSyntax {
}

class VariableDeclarationSyntax extends SyntaxNode {
    private _varKeyword: ISyntaxToken;
    private _variableDeclarators: ISeparatedSyntaxList;

    constructor(varKeyword: ISyntaxToken,
                variableDeclarators: ISeparatedSyntaxList) {
        super();

        if (varKeyword.keywordKind() !== SyntaxKind.VarKeyword) {
            throw Errors.argument("varKeyword");
        }

        if (variableDeclarators === null) {
            throw Errors.argumentNull("variableDeclarators");
        }

        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
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

    constructor (identifier: ISyntaxToken,
                 typeAnnotation: TypeAnnotationSyntax,
                 equalsValueClause: EqualsValueClauseSyntax) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
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

    constructor (equalsToken: ISyntaxToken,
                 value: ExpressionSyntax) {
        super();

        if (equalsToken.kind() !== SyntaxKind.EqualsToken) {
            throw Errors.argument("equalsToken");
        }

        this._equalsToken = equalsToken;
        this._value = value;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EqualsValueClause;
    }

    public equalsValue(): ISyntaxToken {
        return this._equalsToken;
    }

    public value(): ExpressionSyntax {
        return this._value;
    }
}

class PrefixUnaryExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind = SyntaxKind.None;
    private _operatorToken: ISyntaxToken;
    private _operand: UnaryExpressionSyntax;

    constructor (kind: SyntaxKind,
                 operatorToken: ISyntaxToken,
                 operand: UnaryExpressionSyntax) {
        super();

        // Add error checking for kind and operator token.
        if (operand === null) {
            throw Errors.argumentNull("operand");
        }

        this._kind = kind;
        this._operatorToken = operatorToken;
        this._operand = operand;
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

    constructor (thisKeyword: ISyntaxToken) {
        super();

        if (thisKeyword.keywordKind() !== SyntaxKind.ThisKeyword) { 
            throw Errors.argument("thisKeyword");
        }

        this._thisKeyword = thisKeyword;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThisExpression;
    }

    public thisKeyword(): ISyntaxToken {
        return this._thisKeyword;
    }
}

class LiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind = SyntaxKind.None;
    private _literalToken: ISyntaxToken;

    constructor (kind: SyntaxKind, literalToken: ISyntaxToken) {
        super();

        // TODO: Add argument checking.

        this._kind = kind;
        this._literalToken = literalToken;
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

    constructor (openBracketToken: ISyntaxToken,
                 expressions: ISeparatedSyntaxList,
                 closeBracketToken: ISyntaxToken) {
        super();

        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) {
            throw Errors.argument("openBracketToken");
        }

        if (expressions === null) {
            throw Errors.argumentNull("expressions");
        }

        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) {
            throw Errors.argument("closeBracketToken");
        }

        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
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
    constructor () {
        super();
    }
}

class ParenthesizedExpressionSyntax extends UnaryExpressionSyntax {
    private _openParenToken: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;

    constructor (openParenToken: ISyntaxToken,
                 expression: ExpressionSyntax,
                 closeParenToken: ISyntaxToken) {
        super();

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
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
    private _equalsGreaterThanToken: ISyntaxToken;
    private _body: SyntaxNode;

    constructor (equalsGreaterThanToken: ISyntaxToken,
                 body: SyntaxNode) {
        super();

        if (equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) {
            throw Errors.argument("equalsGreaterThanToken");
        }

        if (body === null) {
            throw Errors.argumentNull("body");
        }

        // TODO: Check that body is an expression or a block.

        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): SyntaxNode {
        return this._body
    }
}

class TypeSyntax extends UnaryExpressionSyntax {
}

class NameSyntax extends TypeSyntax {
}

class IdentifierNameSyntax extends NameSyntax {
    private _identifier: ISyntaxToken;

    constructor (identifier: ISyntaxToken) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        this._identifier = identifier;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IdentifierName;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public isMissing(): bool {
        return this.identifier().isMissing();
    }
}

class QualifiedNameSyntax extends NameSyntax {
    private _left: NameSyntax;
    private _dotToken: ISyntaxToken;
    private _right: IdentifierNameSyntax;

    constructor (left: NameSyntax,
                 dotToken: ISyntaxToken,
                 right: IdentifierNameSyntax) {
        super();

        if (left === null) {
            throw Errors.argumentNull("left");
        }

        if (dotToken.kind() !== SyntaxKind.DotToken) {
            throw Errors.argument("dotToken");
        }

        if (right === null) {
            throw Errors.argumentNull("right");
        }

        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
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
}

class FunctionTypeSyntax extends TypeSyntax {
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        if (parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }

        if (equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) {
            throw Errors.argument("equalsGreaterThanToken");
        }

        if (type === null) {
            throw Errors.argumentNull("type");
        }

        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
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

    constructor (openBraceToken: ISyntaxToken,
                 typeMembers: ISeparatedSyntaxList,
                 closeBraceToken: ISyntaxToken) {
        super();

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (typeMembers === null) {
            throw Errors.argumentNull("typeMembers");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }

        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
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

    constructor (type: TypeSyntax,
                 openBracketToken: ISyntaxToken,
                 closeBracketToken: ISyntaxToken) {
        super();

        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) {
            throw Errors.argument("openBracketToken");
        }

        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) {
            throw Errors.argument("closeBracketToken");
        }

        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
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
    
    constructor (keyword: ISyntaxToken) {
        super();

        // TODO: Add argument checking for keyword.
        this._keyword = keyword;
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

    constructor (colonToken: ISyntaxToken,
                 type: TypeSyntax) {
        super();

        if (colonToken.kind() !== SyntaxKind.ColonToken) {
            throw Errors.argument("colonToken");
        }

        if (type === null) {
            throw Errors.argumentNull("type");
        }

        this._colonToken = colonToken;
        this._type = type;
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

class ParenthesizedArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
    private _callSignature: CallSignatureSyntax;

    constructor (callSignature: CallSignatureSyntax,
                 equalsGreaterThanToken: ISyntaxToken,
                 body: SyntaxNode) {
        super(equalsGreaterThanToken, body);

        if (callSignature === null) {
            throw Errors.argumentNull("callSignature");
        }

        this._callSignature = callSignature;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedArrowFunctionExpression;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }
}

class BlockSyntax extends StatementSyntax {
    private _openBraceToken: ISyntaxToken;
    private _statements: ISyntaxNodeList;
    private _closeBraceToken: ISyntaxToken;

    constructor (openBraceToken: ISyntaxToken,
                 statements: ISyntaxNodeList,
                 closeBraceToken: ISyntaxToken) {
        super();

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (statements === null) {
            throw Errors.argumentNull("statements");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }

        this._openBraceToken = openBraceToken;
        this._statements = statements;
        this._closeBraceToken = closeBraceToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Block;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public statements(): ISyntaxNodeList {
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
    private _typeAnontation: TypeAnnotationSyntax;
    private _equalsValueClause: EqualsValueClauseSyntax;

    constructor (dotDotDotToken: ISyntaxToken,
                 publicOrPrivateKeyword: ISyntaxToken,
                 identifier: ISyntaxToken,
                 questionToken: ISyntaxToken,
                 typeAnnotation: TypeAnnotationSyntax,
                 equalsValueClause: EqualsValueClauseSyntax) {
        super();

        if (dotDotDotToken != null && dotDotDotToken.kind() !== SyntaxKind.DotDotDotToken) {
            throw Errors.argument("dotDotDotToken");
        }

        if (publicOrPrivateKeyword != null &&
            publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword &&
            publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) {
            throw Errors.argument("publicOrPrivateKeyword");
        }

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (questionToken != null && questionToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("questionToken");
        }

        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnontation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
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
        return this._typeAnontation;
    }

    public equalsValueClause(): EqualsValueClauseSyntax {
        return this._equalsValueClause;
    }
}

class MemberAccessExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _dotToken: ISyntaxToken;
    private _identifierName: IdentifierNameSyntax;

    constructor (expression: ExpressionSyntax,
                 dotToken: ISyntaxToken,
                 identifierName: IdentifierNameSyntax) {
        super();

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        if (dotToken.kind() !== SyntaxKind.DotToken) {
            throw Errors.argument("dotToken");
        }

        if (identifierName === null) {
            throw Errors.argumentNull("identifierName");
        }

        this._expression = expression;
        this._dotToken = dotToken;
        this._identifierName = identifierName;
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
    private _kind: SyntaxKind = SyntaxKind.None;
    private _operand: ExpressionSyntax;
    private _operatorToken: ISyntaxToken;

    constructor (kind: SyntaxKind,
                 operand: ExpressionSyntax,
                 operatorToken: ISyntaxToken) {
        super();

        if (kind !== SyntaxKind.PostIncrementExpression && kind !== SyntaxKind.PostDecrementExpression) {
            throw Errors.argument("kind");
        }

        if (operand === null) {
            throw Errors.argumentNull("operand");
        }

        if (operatorToken.kind() !== SyntaxKind.PlusPlusToken && operatorToken.kind() !== SyntaxKind.MinusMinusToken) {
            throw Errors.argument("operatorToken");
        }

        this._kind = kind;
        this._operand = operand;
        this._operatorToken = operatorToken;
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

    constructor (expression: ExpressionSyntax,
                 openBracketToken: ISyntaxToken,
                 argumentExpression: ExpressionSyntax,
                 closeBracketToken: ISyntaxToken) {
        super();

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) {
            throw Errors.argument("openBracketToken");
        }

        if (argumentExpression === null) {
            throw Errors.argumentNull("argumentExpression");
        }

        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) {
            throw Errors.argument("closeBracketToken");
        }

        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
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

    constructor (expression: ExpressionSyntax,
                 argumentList: ArgumentListSyntax) {
        super();

        if (expression === null) {
            throw Errors.argument("expression");
        }

        if (argumentList === null) {
            throw Errors.argument("argumentList");
        }

        this._expression = expression;
        this._argumentList = argumentList;
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

    constructor (openParenToken: ISyntaxToken,
                 arguments: ISeparatedSyntaxList,
                 closeParenToken: ISyntaxToken) {
        super();

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (arguments === null) {
            throw Errors.argumentNull("arguments");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
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
    private _kind: SyntaxKind = SyntaxKind.None;
    private _left: ExpressionSyntax;
    private _operatorToken: ISyntaxToken;
    private _right: ExpressionSyntax;

    constructor (kind: SyntaxKind,
                 left: ExpressionSyntax,
                 operatorToken: ISyntaxToken,
                 right: ExpressionSyntax) {
        super();

        // TODO: check kind.

        if (left === null) {
            throw Errors.argumentNull("left");
        }

        // TODO: check operator token.

        if (right === null) {
            throw Errors.argumentNull("right");
        }

        this._kind = kind;
        this._left = left;
        this._operatorToken = operatorToken;
        this._right = right;
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

    constructor (condition: ExpressionSyntax,
                 questionToken: ISyntaxToken,
                 whenTrue: ExpressionSyntax,
                 colonToken: ISyntaxToken,
                 whenFalse: ExpressionSyntax) {
        super();

        if (condition === null) {
            throw Errors.argumentNull("condition");
        }

        if (questionToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("questionToken");
        }

        if (whenTrue === null) {
            throw Errors.argumentNull("whenTrue");
        }

        if (colonToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("colonToken");
        }

        if (whenFalse === null) {
            throw Errors.argumentNull("whenFalse");
        }

        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
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
}

class ConstructSignatureSyntax extends TypeMemberSyntax {
}

class FunctionSignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor (identifier: ISyntaxToken,
                 questionToken: ISyntaxToken,
                 parameterList: ParameterListSyntax,
                 typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (questionToken !== null && questionToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("questionToken");
        }

        if (parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
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
}

class PropertySignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
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

    constructor (openParenToken: ISyntaxToken,
                 parameters: ISeparatedSyntaxList,
                 closeParenToken: ISyntaxToken) {
        super();

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (parameters === null) {
            throw Errors.argumentNull("parameters");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        
        this._openParenToken = openParenToken;
        this._parameters = parameters;
        this._closeParenToken = closeParenToken;
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
    
    constructor (parameterList: ParameterListSyntax,
                 typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }

        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
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

    constructor (elseKeyword: ISyntaxToken,
                 statement: StatementSyntax) {
        super();

        if (elseKeyword.keywordKind() !== SyntaxKind.ElseKeyword) {
            throw Errors.argument("elseKeyword");
        }

        if (statement === null) {
            throw Errors.argumentNull("statement");
        }

        this._elseKeyword = elseKeyword;
        this._statement = statement;
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

        if (ifKeyword.keywordKind() !== SyntaxKind.IfKeyword) {
            throw Errors.argument("ifKeyword");
        }

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (condition === null) {
            throw Errors.argumentNull("condition");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        if (statement === null) {
            throw Errors.argumentNull("statement");
        }

        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
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

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._expression = expression;
        this._semicolonToken = semicolonToken;
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

        if (constructorKeyword.keywordKind() !== SyntaxKind.ConstructorKeyword) {
            throw Errors.argument("constructorKeyword");
        }

        if (parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }

        // TODO: Check that exactly one of block and semicolonToken are set.

        if (semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("SemicolonToken");
        }

        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
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
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken) {
        super();

        if (publicOrPrivateKeyword !== null &&
            publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword &&
            publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) {
            throw Errors.argument("publicOrPrivateKeyword");
        }

        if (staticKeyword !== null && staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) {
            throw Errors.argument("staticKeyword");
        }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }
}

class MemberFunctionDeclarationSyntax extends MemberDeclarationSyntax {
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                functionSignature: FunctionSignatureSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super(publicOrPrivateKeyword, staticKeyword);

        if (functionSignature === null) {
            throw Errors.argumentNull("functionSignature");
        }

        // TODO: Check that exactly one of 'block' and 'semicolon' is set.

        if (semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
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
}

class MemberVariableDeclarationSyntax extends MemberDeclarationSyntax {
    private _variableDeclarator: VariableDeclaratorSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                variableDeclarator: VariableDeclaratorSyntax,
                semicolonToken: ISyntaxToken) {
        super(publicOrPrivateKeyword, staticKeyword);

        if (variableDeclarator === null) {
            throw Errors.argumentNull("variableDeclarator");
        }

        // TODO: Check that exactly one of 'block' and 'semicolon' is set.

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
    }

    public variableDeclarator(): VariableDeclaratorSyntax {
        return this._variableDeclarator;
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

        if (returnKeyword.keywordKind() !== SyntaxKind.ReturnKeyword) {
            throw Errors.argument("returnKeyword");
        }

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._returnKeyword = returnKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
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

        if (newKeyword.keywordKind() !== SyntaxKind.NewKeyword) {
            throw Errors.argument("newKeyword");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
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
    private _caseClauses: ISyntaxNodeList;
    private _closeBraceToken: ISyntaxToken;

    constructor(switchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                caseClauses: ISyntaxNodeList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (switchKeyword.keywordKind() !== SyntaxKind.SwitchKeyword) {
            throw Errors.argument("switchKeyword");
        }

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (caseClauses === null) {
            throw Errors.argumentNull("caseClauses");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }

        this._switchKeyword = switchKeyword;
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._openBraceToken = openBraceToken;
        this._caseClauses = caseClauses;
        this._closeBraceToken = closeBraceToken;
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

    public caseClauses(): ISyntaxNodeList {
        return this._caseClauses;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }
}

class SwitchClauseSyntax extends SyntaxNode {
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxNodeList;

    constructor(colonToken: ISyntaxToken,
                statements: ISyntaxNodeList) {
        super();

        if (colonToken.kind() !== SyntaxKind.ColonToken) {
            throw Errors.argument("colonToken");
        }

        if (statements === null) {
            throw Errors.argumentNull("statements");
        }
        
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statements(): ISyntaxNodeList {
        return this._statements;
    }
}

class CaseSwitchClauseSyntax extends SwitchClauseSyntax {
    private _caseKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(caseKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                colonToken: ISyntaxToken,
                statements: ISyntaxNodeList) {
        super(colonToken, statements);

        if (caseKeyword.keywordKind() !== SyntaxKind.CaseKeyword) {
            throw Errors.argument("caseKeyword");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        this._caseKeyword = caseKeyword;
        this._expression = expression;
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
}

class DefaultSwitchClauseSyntax extends SwitchClauseSyntax {
    private _defaultKeyword: ISyntaxToken;

    constructor(defaultKeyword: ISyntaxToken,
                colonToken: ISyntaxToken,
                statements: ISyntaxNodeList) {
        super(colonToken, statements);

        if (defaultKeyword.keywordKind() !== SyntaxKind.DefaultKeyword) {
            throw Errors.argument("defaultKeyword");
        }

        this._defaultKeyword = defaultKeyword;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DefaultSwitchClause;
    }

    public defaultKeyword(): ISyntaxToken {
        return this._defaultKeyword;
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

        if (breakKeyword.keywordKind() !== SyntaxKind.BreakKeyword) {
            throw Errors.argument("breakKeyword");
        }

        if (identifier !== null && identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
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

class BaseForStatementSyntax extends StatementSyntax {
    private _forKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (forKeyword.keywordKind() !== SyntaxKind.ForKeyword) {
            throw Errors.argument("forKeyword");
        }

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        if (statement === null) {
            throw Errors.argumentNull("statement");
        }

        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
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

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class ForStatementSyntax extends BaseForStatementSyntax {
    private _initializer: ExpressionSyntax;
    private _firstSemicolonToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _secondSemicolonToken: ISyntaxToken;
    private _incrementor: ExpressionSyntax;

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
        super(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement);

        // TODO: Check that exactly one of variableDeclaration and initializer is set.

        if (firstSemicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("firstSemicolonToken");
        }

        if (secondSemicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("secondSemicolonToken");
        }

        this._initializer = initializer;
        this._firstSemicolonToken = firstSemicolonToken;
        this._condition = condition;
        this._secondSemicolonToken = secondSemicolonToken;
        this._incrementor = incrementor;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForStatement;
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
}

class ForInStatementSyntax extends BaseForStatementSyntax {
    private _left: ExpressionSyntax;
    private _inKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                left: ExpressionSyntax,
                inKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement);

        if (inKeyword.keywordKind() !== SyntaxKind.InKeyword) {
            throw Errors.argument("inKeyword");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        this._left = left;
        this._inKeyword = inKeyword;
        this._expression = expression;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForInStatement;
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

        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (enumKeyword.keywordKind() !== SyntaxKind.EnumKeyword) {
            throw Errors.argument("enumKeyword");
        }

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (variableDeclarators === null) {
            throw Errors.argumentNull("variableDeclarators");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }

        this._exportKeyword = exportKeyword;
        this._enumKeyword = enumKeyword;
        this._identifier = identifier;
        this._openBraceToken = openBraceToken;
        this._variableDeclarators = variableDeclarators;
        this._closeBraceToken = closeBraceToken;
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

        if (lessThanToken.kind() !== SyntaxKind.LessThanToken) {
            throw Errors.argument("lessThanToken");
        }

        if (type === null) {
            throw Errors.argumentNull("null");
        }

        if (greaterThanToken.kind() !== SyntaxKind.GreaterThanToken) {
            throw Errors.argument("greaterThanToken");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
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

        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }

        if (propertyAssignments === null) {
            throw Errors.argument("propertyAssignments");
        }

        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        
        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
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
    private _propertyName: ISyntaxToken;

    constructor(propertyName: ISyntaxToken) {
        super();

        if (propertyName.kind() !== SyntaxKind.IdentifierNameToken &&
            propertyName.kind() !== SyntaxKind.StringLiteral &&
            propertyName.kind() !== SyntaxKind.NumericLiteral) {
            throw Errors.argument("propertyName");
        }

        this._propertyName = propertyName;
    }
    
    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }
}

class SimplePropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    private _colonToken: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(propertyName: ISyntaxToken,
                colonToken: ISyntaxToken,
                expression: ExpressionSyntax) {
        super(propertyName);

        if (colonToken.kind() !== SyntaxKind.ColonToken) {
            throw Errors.argument("colonToken");
        }

        if (expression === null) {
            throw Errors.argumentNull("expression");
        }

        this._colonToken = colonToken;
        this._expression = expression;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimplePropertyAssignment;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }
}

class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    private _openParenToken: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super(propertyName);

        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }

        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }

        if (block === null) {
            throw Errors.argumentNull("block");
        }

        this._openParenToken = openParenToken;
        this._closeParenToken = closeParenToken;
        this._block = block;
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

class GetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
    private _getKeyword: ISyntaxToken;

    constructor(getKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super(propertyName, openParenToken, closeParenToken, block);

        if (getKeyword.keywordKind() !== SyntaxKind.GetKeyword) {
            throw Errors.argument("getKeyword");
        }

        this._getKeyword = getKeyword;
    }

    public getKeyword(): ISyntaxToken {
        return this._getKeyword;
    }
}

class SetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
    private _setKeyword: ISyntaxToken;
    private _parameterName: ISyntaxToken;

    constructor(setKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                parameterName: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super(propertyName, openParenToken, closeParenToken, block);

        if (setKeyword.keywordKind() !== SyntaxKind.SetKeyword) {
            throw Errors.argument("setKeyword");
        }

        if (parameterName.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("parameterName");
        }

        this._setKeyword = setKeyword;
        this._parameterName = parameterName;
    }

    public setKeyword(): ISyntaxToken {
        return this._setKeyword;
    }

    public parameterName(): ISyntaxToken {
        return this._parameterName;
    }
}