///<reference path='References.ts' />

class SourceUnitSyntax extends SyntaxNode {
    private _moduleElements: ISyntaxNodeList/*<ModuleElementSyntax>*/;
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
    private _moduleKeyword: ISyntaxToken = null;
    private _openParenToken: ISyntaxToken = null;
    private _stringLiteral: ISyntaxToken = null;
    private _closeParenToken: ISyntaxToken = null;

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
    private _moduleName: NameSyntax = null;

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
    private _importKeyword: ISyntaxToken = null;
    private _identifier: ISyntaxToken = null;
    private _equalsToken: ISyntaxToken = null;
    private _moduleReference: ModuleReferenceSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

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
    private _exportKeyword: ISyntaxToken = null;
    private _classKeyword: ISyntaxToken = null;
    private _identifier: ISyntaxToken = null;
    private _extendsClause: ExtendsClauseSyntax = null;
    private _implementsClause: ImplementsClauseSyntax = null;
    private _openBraceToken: ISyntaxToken = null;
    private _classElements: ISyntaxNodeList = null;
    private _closeBraceToken: ISyntaxToken = null;

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
    private _exportKeyword: ISyntaxToken = null;
    private _interfaceKeyword: ISyntaxToken = null;
    private _identifier: ISyntaxToken = null;
    private _extendsClause: ExtendsClauseSyntax = null;
    private _body: ObjectTypeSyntax = null;

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
    private _extendsKeyword: ISyntaxToken = null;
    private _typeNames: ISeparatedSyntaxList = null;

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
    private _implementsKeyword: ISyntaxToken = null;
    private _typeNames: ISeparatedSyntaxList = null;

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
    private _exportKeyword: ISyntaxToken = null;
    private _moduleKeyword: ISyntaxToken = null;
    private _moduleName: NameSyntax = null;
    private _openBraceToken: ISyntaxToken = null;
    private _moduleElements: ISyntaxNodeList = null;
    private _closeBraceToken: ISyntaxToken = null;

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
    private _exportKeyword: ISyntaxToken = null;
    private _functionKeyword: ISyntaxToken = null;
    private _functionSignature: FunctionSignatureSyntax = null;
    private _block: BlockSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

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
    private _exportKeyword: ISyntaxToken = null;
    private _varKeyword: ISyntaxToken = null;
    private _variableDeclarations: ISeparatedSyntaxList = null;
    private _semicolonToken: ISyntaxToken = null;

    constructor (exportKeyword: ISyntaxToken,
                 varKeyword: ISyntaxToken,
                 variableDeclarations: ISeparatedSyntaxList,
                 semicolonToken: ISyntaxToken) {
        super();

        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }

        if (varKeyword.keywordKind() !== SyntaxKind.VarKeyword) {
            throw Errors.argument("varKeyword");
        }

        if (variableDeclarations === null) {
            throw Errors.argumentNull("variableDeclarations");
        }

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._exportKeyword = exportKeyword;
        this._varKeyword = varKeyword;
        this._variableDeclarations = variableDeclarations;
        this._semicolonToken = semicolonToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableStatement;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public varKeyword(): ISyntaxToken {
        return this._varKeyword;
    }

    public variableDeclarations(): ISeparatedSyntaxList {
        return this._variableDeclarations;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }
}

class ExpressionSyntax extends SyntaxNode {
}

class VariableDeclarationSyntax extends SyntaxNode {
    private _identifier: ISyntaxToken = null;
    private _typeAnnotation: TypeAnnotationSyntax = null;
    private _equalsValueClause: EqualsValueClauseSyntax = null;

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
        return SyntaxKind.VariableDeclaration;
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
    private _equalsToken: ISyntaxToken = null;
    private _value: ExpressionSyntax = null;

    constructor (equalsToken: ISyntaxToken,
                 value: ExpressionSyntax) {
        super();

        if (equalsToken.kind() !== SyntaxKind.EqualsToken) {
            throw Errors.argument("equalsToken");
        }

        this._equalsToken = equalsToken;
        this._value = value;
    }

    public equalsValue(): ISyntaxToken {
        return this._equalsToken;
    }

    public value(): ExpressionSyntax {
        return this._value;
    }
}

class PrefixUnaryExpressionSyntax extends ExpressionSyntax {
    private _kind: SyntaxKind = SyntaxKind.None;
    private _operatorToken: ISyntaxToken = null;
    private _operand: ExpressionSyntax = null;

    constructor (kind: SyntaxKind,
                 operatorToken: ISyntaxToken,
                 operand: ExpressionSyntax) {
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

    public operand(): ExpressionSyntax {
        return this._operand;
    }
}

class ThisExpressionSyntax extends ExpressionSyntax {
    private _thisKeyword: ISyntaxToken = null;

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

class LiteralExpressionSyntax extends ExpressionSyntax {
    private _kind: SyntaxKind = SyntaxKind.None;
    private _literalToken: ISyntaxToken = null;

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

class ArrayLiteralExpressionSyntax extends ExpressionSyntax {
    private _openBracketToken: ISyntaxToken = null;
    private _expressions: ISeparatedSyntaxList = null;
    private _closeBracketToken: ISyntaxToken = null;

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

class ParenthesizedExpressionSyntax extends ExpressionSyntax {
    private _openParenToken: ISyntaxToken = null;
    private _expression: ExpressionSyntax = null;
    private _closeParenToken: ISyntaxToken = null;

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

class ArrowFunctionExpressionSyntax extends ExpressionSyntax {
    private _equalsGreaterThanToken: ISyntaxToken = null;
    private _body: SyntaxNode = null;

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

class TypeSyntax extends ExpressionSyntax {
}

class NameSyntax extends TypeSyntax {
}

class IdentifierNameSyntax extends NameSyntax {
    private _identifier: ISyntaxToken = null;

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
    private _left: NameSyntax = null;
    private _dotToken: ISyntaxToken = null;
    private _right: IdentifierNameSyntax = null;

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
    private _parameterList: ParameterListSyntax = null;
    private _equalsGreaterThanToken: ISyntaxToken = null;
    private _type: TypeSyntax = null;

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
    private _openBraceToken: ISyntaxToken = null;
    private _typeMembers: ISeparatedSyntaxList = null;
    private _closeBraceToken: ISyntaxToken = null;

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
    private _type: TypeSyntax = null;
    private _openBracketToken: ISyntaxToken = null;
    private _closeBracketToken: ISyntaxToken = null;

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
    private _keyword: ISyntaxToken = null;
    
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
    private _colonToken: ISyntaxToken = null;
    private _type: TypeSyntax = null;

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
    private _callSignature: CallSignatureSyntax = null;

    constructor (callSignature: CallSignatureSyntax,
                 equalsGreaterThanToken: ISyntaxToken,
                 body: SyntaxNode) {
        super(equalsGreaterThanToken, body);

        if (callSignature === null) {
            throw Errors.argumentNull("callSignature");
        }

        this._callSignature = callSignature;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }
}

class BlockSyntax extends StatementSyntax {
    private _openBraceToken: ISyntaxToken = null;
    private _statements: ISyntaxNodeList = null;
    private _closeBraceToken: ISyntaxToken = null;

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
    private _dotDotDotToken: ISyntaxToken = null;
    private _publicOrPrivateKeyword: ISyntaxToken = null;
    private _identifier: ISyntaxToken = null;
    private _questionToken: ISyntaxToken = null;
    private _typeAnontation: TypeAnnotationSyntax = null;
    private _equalsValueClause: EqualsValueClauseSyntax = null;

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

class MemberAccessExpressionSyntax extends ExpressionSyntax {
    private _expression: ExpressionSyntax = null;
    private _dotToken: ISyntaxToken = null;
    private _identifierName: IdentifierNameSyntax = null;

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

class PostfixUnaryExpressionSyntax extends ExpressionSyntax {
    private _kind: SyntaxKind = SyntaxKind.None;
    private _operand: ExpressionSyntax = null;
    private _operatorToken: ISyntaxToken = null;

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

class ElementAccessExpressionSyntax extends ExpressionSyntax {
    private _expression: ExpressionSyntax = null;
    private _openBracketToken: ISyntaxToken = null;
    private _argumentExpression: ExpressionSyntax = null;
    private _closeBracketToken: ISyntaxToken = null;

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

class InvocationExpressionSyntax extends ExpressionSyntax {
    private _expression: ExpressionSyntax = null;
    private _argumentList: ArgumentListSyntax = null;

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
    private _openParenToken: ISyntaxToken = null;
    private _arguments: ISeparatedSyntaxList = null;
    private _closeParenToken: ISyntaxToken = null;

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
    private _left: ExpressionSyntax = null;
    private _operatorToken: ISyntaxToken = null;
    private _right: ExpressionSyntax = null;

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
    private _condition: ExpressionSyntax = null;
    private _questionToken: ISyntaxToken = null;
    private _whenTrue: ExpressionSyntax = null;
    private _colonToken: ISyntaxToken = null;
    private _whenFalse: ExpressionSyntax = null;

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
    private _identifier: ISyntaxToken = null;
    private _questionToken: ISyntaxToken = null;
    private _parameterList: ParameterListSyntax = null;
    private _typeAnnotation: TypeAnnotationSyntax = null;

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
}

class ParameterListSyntax extends SyntaxNode {
    private _openParenToken: ISyntaxToken = null;
    private _parameters: ISeparatedSyntaxList = null;
    private _closeParenToken: ISyntaxToken = null;

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
    private _parameterList: ParameterListSyntax = null;
    private _returnTypeAnnotation: TypeAnnotationSyntax = null;
    
    constructor (parameterList: ParameterListSyntax,
                 returnTypeAnnotation: TypeAnnotationSyntax) {
        super();

        if (parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }

        if (returnTypeAnnotation === null) {
            throw Errors.argumentNull("returnTypeAnnotation");
        }

        this._parameterList = parameterList;
        this._returnTypeAnnotation = returnTypeAnnotation;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public returnTypeAnnotation(): TypeAnnotationSyntax {
        return this._returnTypeAnnotation;
    }
}

class ElseClauseSyntax extends SyntaxNode {
    private _elseKeyword: ISyntaxToken = null;
    private _statement: StatementSyntax = null;

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

    public elseKeyword(): ISyntaxToken {
        return this._elseKeyword;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }
}

class IfStatementSyntax extends StatementSyntax {
    private _ifKeyword: ISyntaxToken = null;
    private _openParenToken: ISyntaxToken = null;
    private _condition: ExpressionSyntax = null;
    private _closeParenToken: ISyntaxToken = null;
    private _statement: StatementSyntax = null;
    private _elseClause: ElseClauseSyntax = null;

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
    private _expression: ExpressionSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

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
    private _constructorKeyword: ISyntaxToken = null;
    private _parameterList: ParameterListSyntax = null;
    private _block: BlockSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

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
    private _publicOrPrivateKeyword: ISyntaxToken = null;
    private _staticKeyword: ISyntaxToken = null;

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
    private _functionSignature: FunctionSignatureSyntax = null;
    private _block: BlockSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

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
    private _variableDeclaration: VariableDeclarationSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                semicolonToken: ISyntaxToken) {
        super(publicOrPrivateKeyword, staticKeyword);

        if (variableDeclaration === null) {
            throw Errors.argumentNull("variableDeclaration");
        }

        // TODO: Check that exactly one of 'block' and 'semicolon' is set.

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }

        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

}

class ReturnStatementSyntax extends StatementSyntax {
    private _returnKeyword: ISyntaxToken = null;
    private _expression: ExpressionSyntax = null;
    private _semicolonToken: ISyntaxToken = null;

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