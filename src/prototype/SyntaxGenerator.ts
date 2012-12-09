///<reference path='References.ts' />

var argumentChecks = true;

interface ITypeDefinition {
    name: string;
    baseType: string;
    isAbstract?: bool;
    children: IMemberDefinition[];
}

interface IMemberDefinition {
    name: string;
    type?: string;
    isToken?: bool;
    isList?: bool;
    isSeparatedList?: bool;
    isOptional?: bool;
    tokenKinds?: string[];
}

var definitions:ITypeDefinition[] = [
    <any>{
        name: 'SourceUnitSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'moduleElements', isList: true },
            <any>{ name: 'endOfFileToken', isToken: true },
        ]
    },
    <any>{
        name: 'ModuleElementSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'ModuleReferenceSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'ExternalModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            <any>{ name: 'moduleKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'stringLiteral', isToken: true },
            <any>{ name: 'closeParenToken', isToken: true },
        ]
    },
    <any>{
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            <any>{ name: 'moduleName', type: 'NameSyntax' },
        ]
    },
    <any>{
        name: 'ImportDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'importKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'equalsToken', isToken: true },
            <any>{ name: 'moduleReference', type: 'ModuleReferenceSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ClassDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true, isOptional: true  },
            <any>{ name: 'declareKeyword', isToken: true, isOptional: true  },
            <any>{ name: 'classKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'extendsClause', type: 'ExtendsClauseSyntax', isOptional: true },
            <any>{ name: 'implementsClause', type: 'ImplementsClauseSyntax', isOptional: true },
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'classElements', isList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'InterfaceDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true, isOptional: true  },
            <any>{ name: 'interfaceKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'extendsClause', type: 'ExtendsClauseSyntax', isOptional: true },
            <any>{ name: 'body', type: 'ObjectTypeSyntax' },
        ]
    },
    <any>{
        name: 'ExtendsClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'extendsKeyword', isToken: true },
            <any>{ name: 'typeNames', isSeparatedList: true },
        ]
    },
    <any>{
        name: 'ImplementsClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'implementsKeyword', isToken: true },
            <any>{ name: 'typeNames', isSeparatedList: true },
        ]
    },
    <any>{
        name: 'ModuleDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true, isOptional: true },
            <any>{ name: 'declareKeyword', isToken: true, isOptional: true },
            <any>{ name: 'moduleKeyword', isToken: true },
            <any>{ name: 'moduleName', type: 'NameSyntax', isOptional: true },
            <any>{ name: 'stringLiteral', isToken: true, isOptional: true },
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'moduleElements', isList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'StatementSyntax',
        baseType: 'ModuleElementSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'FunctionDeclarationSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true, isOptional: true },
            <any>{ name: 'declareKeyword', isToken: true, isOptional: true },
            <any>{ name: 'functionKeyword', isToken: true },
            <any>{ name: 'functionSignature', type: 'FunctionSignatureSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax', isOptional: true },
            <any>{ name: 'semicolonToken', isToken: true, isOptional: true },
        ]
    },
    <any>{
        name: 'VariableStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true, isOptional: true },
            <any>{ name: 'declareKeyword', isToken: true, isOptional: true },
            <any>{ name: 'variableDeclaration', type: 'VariableDeclarationSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ExpressionSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'UnaryExpressionSyntax',
        baseType: 'ExpressionSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'VariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'varKeyword', isToken: true },
            <any>{ name: 'variableDeclarators', isSeparatedList: true },
        ]
    },
    <any>{
        name: 'VariableDeclaratorSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            <any>{ name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'EqualsValueClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'equalsToken', isToken: true },
            <any>{ name: 'value', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'PrefixUnaryExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'kind', type: 'SyntaxKind' },
            <any>{ name: 'operatorToken', isToken: true, tokenKinds: ["PlusPlusToken", "MinusMinusToken", "PlusToken", "MinusToken", "TildeToken", "ExclamationToken"] },
            <any>{ name: 'operand', type: 'UnaryExpressionSyntax' },
        ]
    },
    <any>{
        name: 'ThisExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'thisKeyword', isToken: true },
        ]
    },
    <any>{
        name: 'LiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'kind', type: 'SyntaxKind' },
            <any>{ name: 'literalToken', isToken: true, tokenKinds: ["RegularExpressionLiteral", "StringLiteral", "NumericLiteral", "FalseKeyword", "TrueKeyword", "NullKeyword"] },
        ]
    },
    <any>{
        name: 'ArrayLiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'openBracketToken', isToken: true },
            <any>{ name: 'expressions', isSeparatedList: true },
            <any>{ name: 'closeBracketToken', isToken: true },
        ]
    },
    <any>{
        name: 'OmittedExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: []
    },
    <any>{
        name: 'ParenthesizedExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
        ]
    },
    <any>{
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'SimpleArrowFunctionExpression',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'equalsGreaterThanToken', isToken: true },
            <any>{ name: 'body', type: 'SyntaxNode' },
        ]
    },
    <any>{
        name: 'ParenthesizedArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            <any>{ name: 'callSignature', type: 'CallSignatureSyntax' },
            <any>{ name: 'equalsGreaterThanToken', isToken: true },
            <any>{ name: 'body', type: 'SyntaxNode' },
        ]
    },
    <any>{
        name: 'TypeSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'NameSyntax',
        baseType: 'TypeSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'IdentifierNameSyntax',
        baseType: 'NameSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
        ]
    },
    <any>{
        name: 'QualifiedNameSyntax',
        baseType: 'NameSyntax',
        children: [
            <any>{ name: 'left', type: 'NameSyntax' },
            <any>{ name: 'dotToken', isToken: true },
            <any>{ name: 'right', type: 'IdentifierNameSyntax' },
        ]
    },
    <any>{
        name: 'ConstructorTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            <any>{ name: 'newKeyword', isToken: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'equalsGreaterThanToken', isToken: true },
            <any>{ name: 'type', type: 'TypeSyntax' },
        ]
    },
    <any>{
        name: 'FunctionTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'equalsGreaterThanToken', isToken: true },
            <any>{ name: 'type', type: 'TypeSyntax' },
        ]
    },
    <any>{
        name: 'ObjectTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'typeMembers', isSeparatedList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'ArrayTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            <any>{ name: 'type', type: 'TypeSyntax' },
            <any>{ name: 'openBracketToken', isToken: true },
            <any>{ name: 'closeBracketToken', isToken: true },
        ]
    },
    <any>{
        name: 'PredefinedTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            <any>{ name: 'keyword', isToken: true, tokenKinds: ["AnyKeyword", "BoolKeyword", "NumberKeyword", "StringKeyword", "VoidKeyword"] },
        ]
    },
    <any>{
        name: 'TypeAnnotationSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'colonToken', isToken: true },
            <any>{ name: 'type', type: 'TypeSyntax' },
        ]
    },
    <any>{
        name: 'BlockSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'statements', isList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'ParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'dotDotDotToken', isToken: true, isOptional: true },
            <any>{ name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ["PublicKeyword", "PrivateKeyword"] },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'questionToken', isToken: true, isOptional: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            <any>{ name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'MemberAccessExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'dotToken', isToken: true },
            <any>{ name: 'identifierName', type: 'IdentifierNameSyntax' },
        ]
    },
    <any>{
        name: 'PostfixUnaryExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'kind', type: 'SyntaxKind' },
            <any>{ name: 'operand', type: 'ExpressionSyntax' },
            <any>{ name: 'operatorToken', isToken: true, tokenKinds:["PlusPlusToken", "MinusMinusToken"] },
        ]
    },
    <any>{
        name: 'ElementAccessExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'openBracketToken', isToken: true },
            <any>{ name: 'argumentExpression', type: 'ExpressionSyntax' },
            <any>{ name: 'closeBracketToken', isToken: true },
        ]
    },
    <any>{
        name: 'InvocationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'argumentList', type: 'ArgumentListSyntax' },
        ]
    },
    <any>{
        name: 'ArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'arguments', isSeparatedList: true },
            <any>{ name: 'closeParenToken', isToken: true },
        ]
    },
    <any>{
        name: 'BinaryExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: [
            <any>{ name: 'kind', type: 'SyntaxKind' },
            <any>{ name: 'left', type: 'ExpressionSyntax' },
            <any>{ name: 'operatorToken', isToken: true,
                   tokenKinds:["AsteriskToken",  "SlashToken",  "PercentToken", "PlusToken", "MinusToken",  "LessThanLessThanToken",
                               "GreaterThanGreaterThanToken", "GreaterThanGreaterThanGreaterThanToken", "LessThanToken",
                               "GreaterThanToken", "LessThanEqualsToken", "GreaterThanEqualsToken", "InstanceOfKeyword",
                               "InKeyword", "EqualsEqualsToken", "ExclamationEqualsToken", "EqualsEqualsEqualsToken",
                               "ExclamationEqualsEqualsToken", "AmpersandToken", "CaretToken", "BarToken", "AmpersandAmpersandToken",
                               "BarBarToken", "BarEqualsToken", "AmpersandEqualsToken", "CaretEqualsToken", "LessThanLessThanEqualsToken",
                               "GreaterThanGreaterThanEqualsToken", "GreaterThanGreaterThanGreaterThanEqualsToken", "PlusEqualsToken",
                               "MinusEqualsToken", "AsteriskEqualsToken", "SlashEqualsToken", "PercentEqualsToken", "EqualsToken",
                               "CommaToken"] },
            <any>{ name: 'right', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'ConditionalExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: [
            <any>{ name: 'condition', type: 'ExpressionSyntax' },
            <any>{ name: 'questionToken', isToken: true },
            <any>{ name: 'whenTrue', type: 'ExpressionSyntax' },
            <any>{ name: 'colonToken', isToken: true },
            <any>{ name: 'whenFalse', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'TypeMemberSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'ConstructSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'newKeyword', isToken: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'FunctionSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'questionToken', isToken: true, isOptional: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'IndexSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'openBracketToken', isToken: true },
            <any>{ name: 'parameter', type: 'ParameterSyntax' },
            <any>{ name: 'closeBracketToken', isToken: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'PropertySignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'questionToken', isToken: true, isOptional: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'ParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'parameters', isSeparatedList: true },
            <any>{ name: 'closeParenToken', isToken: true },
        ]
    },
    <any>{
        name: 'CallSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'ElseClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'elseKeyword', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
        ]
    },
    <any>{
        name: 'IfStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'ifKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'condition', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
            <any>{ name: 'elseClause', type: 'ElseClauseSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'ExpressionStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ClassElementSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'ConstructorDeclarationSyntax',
        baseType: 'ClassElementSyntax',
        children: [
            <any>{ name: 'constructorKeyword', isToken: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax', isOptional: true },
            <any>{ name: 'semicolonToken', isToken: true, isOptional: true },
        ]
    },
    <any>{
        name: 'MemberDeclarationSyntax',
        baseType: 'ClassElementSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'MemberFunctionDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            <any>{ name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ["PublicKeyword", "PrivateKeyword"] },
            <any>{ name: 'staticKeyword', isToken: true, isOptional: true },
            <any>{ name: 'functionSignature', type: 'FunctionSignatureSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax', isOptional: true },
            <any>{ name: 'semicolonToken', isToken: true, isOptional: true },
        ]
    },
    <any>{
        name: 'MemberAccessorDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'GetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            <any>{ name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ["PublicKeyword", "PrivateKeyword"] },
            <any>{ name: 'staticKeyword', isToken: true, isOptional: true },
            <any>{ name: 'getKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'SetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            <any>{ name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ["PublicKeyword", "PrivateKeyword"] },
            <any>{ name: 'staticKeyword', isToken: true, isOptional: true },
            <any>{ name: 'setKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            <any>{ name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ["PublicKeyword", "PrivateKeyword"] },
            <any>{ name: 'staticKeyword', isToken: true, isOptional: true },
            <any>{ name: 'variableDeclarator', type: 'VariableDeclaratorSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ThrowStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'throwKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ReturnStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'returnKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax', isOptional: true },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ObjectCreationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'newKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'argumentList', type: 'ArgumentListSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'SwitchStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'switchKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'caseClauses', isList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'SwitchClauseSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'CaseSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            <any>{ name: 'caseKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'colonToken', isToken: true },
            <any>{ name: 'statements', isList: true },
        ]
    },
    <any>{
        name: 'DefaultSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            <any>{ name: 'defaultKeyword', isToken: true },
            <any>{ name: 'colonToken', isToken: true },
            <any>{ name: 'statements', isList: true },
        ]
    },
    <any>{
        name: 'BreakStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'breakKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, isOptional: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ContinueStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'continueKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, isOptional: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'IterationStatementSyntax',
        baseType: 'StatementSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'BaseForStatementSyntax',
        baseType: 'IterationStatementSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'ForStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            <any>{ name: 'forKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'variableDeclaration', type: 'VariableDeclarationSyntax', isOptional: true },
            <any>{ name: 'initializer', type: 'ExpressionSyntax', isOptional: true },
            <any>{ name: 'firstSemicolonToken', isToken: true, tokenKinds: ["SemicolonToken"] },
            <any>{ name: 'condition', type: 'ExpressionSyntax', isOptional: true },
            <any>{ name: 'secondSemicolonToken', isToken: true, tokenKinds: ["SemicolonToken"] },
            <any>{ name: 'incrementor', type: 'ExpressionSyntax', isOptional: true },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
        ]
    },
    <any>{
        name: 'ForInStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            <any>{ name: 'forKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'variableDeclaration', type: 'VariableDeclarationSyntax', isOptional: true },
            <any>{ name: 'left', type: 'ExpressionSyntax', isOptional: true },
            <any>{ name: 'inKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
        ]
    },
    <any>{
        name: 'WhileStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            <any>{ name: 'whileKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'condition', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
        ]
    },
    <any>{
        name: 'WithStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'withKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'condition', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
        ]
    },
    <any>{
        name: 'EnumDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true, isOptional: true },
            <any>{ name: 'enumKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'variableDeclarators', isSeparatedList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'CastExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'lessThanToken', isToken: true },
            <any>{ name: 'type', type: 'TypeSyntax' },
            <any>{ name: 'greaterThanToken', isToken: true },
            <any>{ name: 'expression', type: 'UnaryExpressionSyntax' },
        ]
    },
    <any>{
        name: 'ObjectLiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'propertyAssignments', isSeparatedList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'PropertyAssignmentSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'SimplePropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            <any>{ name: 'propertyName', isToken: true, tokenKinds: ["IdentifierNameToken", "StringLiteral", "NumericLiteral"] },
            <any>{ name: 'colonToken', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'AccessorPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        isAbstract: true,
        children: []
    },
    <any>{
        name: 'GetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            <any>{ name: 'getKeyword', isToken: true },
            <any>{ name: 'propertyName', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'SetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            <any>{ name: 'setKeyword', isToken: true },
            <any>{ name: 'propertyName', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'parameterName', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'FunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'functionKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true, isOptional: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'callSignature', type: 'CallSignatureSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'EmptyStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'SuperExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'superKeyword', isToken: true },
        ]
    },
    <any>{
        name: 'TryStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'tryKeyword', isToken: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
            <any>{ name: 'catchClause', type: 'CatchClauseSyntax', isOptional: true },
            <any>{ name: 'finallyClause', type: 'FinallyClauseSyntax', isOptional: true },
        ]
    },
    <any>{
        name: 'CatchClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'catchKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'FinallyClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'finallyKeyword', isToken: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'LabeledStatement',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true, tokenKinds: ["IdentifierNameToken"] },
            <any>{ name: 'colonToken', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
        ]
    },
    <any>{
        name: 'DoStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            <any>{ name: 'doKeyword', isToken: true },
            <any>{ name: 'statement', type: 'StatementSyntax' },
            <any>{ name: 'whileKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'condition', type: 'ExpressionSyntax' },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'TypeOfExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'typeOfKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'DeleteExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'deleteKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'VoidExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'voidKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
        ]
    },
    <any>{
        name: 'DebuggerStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'debuggerKeyword', isToken: true },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
];

function endsWith(string: string, value: string): bool {
    return string.substring(string.length - value.length, string.length) === value;
}

function getNameWithoutSuffix(definition: ITypeDefinition) {
    var name = definition.name;
    if (endsWith(name, "Syntax")) {
        return name.substring(0, name.length - "Syntax".length);
    }

    return name;
}

function getType(child: IMemberDefinition): string {
    if (child.isToken) {
        return "ISyntaxToken";
    }
    else if (child.isSeparatedList) {
        return "ISeparatedSyntaxList";
    }
    else if (child.isList) {
        return "ISyntaxList";
    }
    else {
        return child.type;
    }
}

var hasKind = false;

function getSafeName(child: IMemberDefinition) {
    if (child.name === "arguments") {
        return "_" + child.name;
    }

    return child.name;
}

function getPropertyAccess(child: IMemberDefinition): string {
    return "this._" + child.name;
}

function generateProperties(definition: ITypeDefinition): string {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        result += "    private _" + child.name + ": " + getType(child) + ";\r\n";

        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }

    if (definition.children.length > 0) {
        result += "\r\n";
    }

    return result;
}

function generateNullChecks(definition: ITypeDefinition): string {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        if (!child.isOptional && !child.isToken) {
            result += "        if (" + child.name + " === null) { throw Errors.argumentNull('" + child.name + "'); }\r\n";
        }
    }

    return result;
}

function generateIfKindCheck(child: IMemberDefinition, tokenKinds: string[], indent: string): string {
    var result = "";
    
    result += indent + "        if (";

    for (var j = 0; j < tokenKinds.length; j++) {
        var tokenKind = tokenKinds[j];
        var isKeyword = tokenKind.indexOf("Keyword") >= 0;

        if (j > 0) {
            result += " && ";
        }

        if (isKeyword) {
            result += child.name + ".keywordKind() !== SyntaxKind." + tokenKind;
        }
        else {
            result += child.name + ".kind() !== SyntaxKind." + tokenKind;
        }
    }

    result += ") { throw Errors.argument('" + child.name + "'); }\r\n";
    return result;
}

function generateSwitchCase(tokenKind: string, indent: string): string {
    return indent + "            case SyntaxKind." + tokenKind + ":\r\n";
}

function generateBreakStatement(indent: string): string {
    return indent + "                break;\r\n";
}

function generateSwitchCases(tokenKinds: string[], indent: string): string {
    var result = "";
    for (var j = 0; j < tokenKinds.length; j++) {
        var tokenKind = tokenKinds[j];

        result += generateSwitchCase(tokenKind, indent);
    }

    if (tokenKinds.length > 0) {
        result += generateBreakStatement(indent);
    }

    return result;
}

function generateDefaultCase(child: IMemberDefinition, indent: string): string {
    var result = "";
    
    result += indent + "            default:\r\n";
    result += indent + "                throw Errors.argument('" + child.name + "');"; 

    return result;
}

function generateSwitchKindCheck(child: IMemberDefinition, tokenKinds: string[], indent: string): string {
    if (tokenKinds.length === 0) {
        return "";
    }

    var result = "";

    var keywords = tokenKinds.filter((v, i, a) => v.indexOf("Keyword") >= 0, null);
    var tokens = tokenKinds.filter((v, i, a) => v.indexOf("Keyword") == 0, null);

    if (tokens.length === 0) {
        if (keywords.length <= 2) {
            result += generateIfKindCheck(child, keywords, indent);
        }
        else {
            result += indent + "        switch (" + child.name + ".keywordKind()) {\r\n";
            result += generateSwitchCases(keywords, indent);
        }
    }
    else {
        result += indent + "        switch (" + child.name + ".kind()) {\r\n";
        result += generateSwitchCases(tokens, indent);

        if (keywords.length > 0) {
            result += generateSwitchCase("IdentifierNameToken", indent);
            result += generateSwitchKindCheck(child, keywords, indent + "    ");
            result += generateBreakStatement(indent);
        }
    }
    
    result += generateDefaultCase(child, indent);
    result += indent + "        }\r\n";
    return result;
}

function generateKindCheck(child: IMemberDefinition): string {
    var indent = "";
    var result = "";
    
    if (child.isOptional) {
        indent = "    ";

        result += "        if (" + child.name + " !== null) {\r\n";
    }

    var tokenKinds: string[] = child.tokenKinds
        ? child.tokenKinds
        : [child.name.substr(0, 1).toUpperCase() + child.name.substr(1)];

    if (true /*tokenKinds.length <= 2*/) {
        result += generateIfKindCheck(child, tokenKinds, indent);
    }
    else {
        result += generateSwitchKindCheck(child, tokenKinds, indent);
    }

    if (child.isOptional) {
        result += "        }\r\n";
    }

    return result;
}

function generateKindChecks(definition: ITypeDefinition): string {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child === undefined) { continue; }

        if (child.isToken) {
            result += generateKindCheck(child);
        }
    }

    return result;
}

function generateArgumentChecks(definition: ITypeDefinition): string {
    var result = "";

    if (argumentChecks) {
        result += generateNullChecks(definition);
        result += generateKindChecks(definition);

        if (definition.children.length > 0) {
            result += "\r\n";
        }
    }

    return result;
}

function generateConstructor(definition: ITypeDefinition): string {
    var result = "";
    result += "    constructor("

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child === undefined) { continue; }

        result += child.name + ": " + getType(child);

        if (i < definition.children.length - 2) {
            result += ",\r\n                ";
        }
    }

    result += ") {\r\n";

    result += "        super();\r\n";
    if (definition.children.length > 0) {
        result += "\r\n";
    }

    result += generateArgumentChecks(definition);

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        result += "        " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
    }

    result += "    }\r\n";

    return result;
}

function generateAcceptMethods(definition: ITypeDefinition): string {
    var result = "";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): void {\r\n";
        result += "        visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";

        result += "\r\n";
        result += "    public accept1(visitor: ISyntaxVisitor1): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
    }

    return result;
}

function generateKindMethod(definition: ITypeDefinition): string {
    var result = "";

    if (!definition.isAbstract) {
        if (!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }

    return result;
}

function generateIsMissingMethod(definition: ITypeDefinition): string {
    var result = "";

    if (!definition.isAbstract) {

        result += "\r\n";
        result += "    public isMissing(): bool {\r\n";

        for (var i = 0; i < definition.children.length; i++) {
            var child: IMemberDefinition = definition.children[i];
            if (child === undefined) { continue; }

            if (getType(child) === "SyntaxKind") {
                continue;
            }

            if (child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null && !" + getPropertyAccess(child) + ".isMissing()) { return false; }\r\n";
            }
            else {
                result += "        if (!" + getPropertyAccess(child) + ".isMissing()) { return false; }\r\n";
            }
        }

        result += "        return true;\r\n";

        result += "    }\r\n";
    }

    return result;
}

function generateAccessors(definition: ITypeDefinition): string {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        result += "\r\n";
        result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
        result += "        return " + getPropertyAccess(child) + ";\r\n";
        result += "    }\r\n";
    }

    return result;
}

function generateUpdateMethod(definition: ITypeDefinition): string {
    if (definition.isAbstract) {
        return "";
    }

    var result = "";

    result += "\r\n";

    result += "    public update("

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        result += getSafeName(child) + ": " + getType(child);

        if (i < definition.children.length - 2) {
            result += ",\r\n                  ";
        }
    }

    result += ") {\r\n";

    if (definition.children.length === 0) {
        result += "        return this;\r\n";
    }
    else {
        result += "        if (";

        for (var i = 0; i < definition.children.length; i++) {
            var child: IMemberDefinition = definition.children[i];
            if (child === undefined) { continue; }

            if (i !== 0) {
                result += " && ";
            }

            result += getPropertyAccess(child) + " === " + getSafeName(child);
        }

        result += ") {\r\n";
        result += "            return this;\r\n";
        result += "        }\r\n\r\n";

        result += "        return new " + definition.name + "(";

        for (var i = 0; i < definition.children.length; i++) {
            var child: IMemberDefinition = definition.children[i];
            if (child === undefined) { continue; }

            if (i !== 0) {
                result += ", ";
            }

            result += getSafeName(child);
        }

        result += ");\r\n";
    }

    result += "    }\r\n";

    return result;
}

function generateNode(definition: ITypeDefinition): string {
    var result = "class " + definition.name + " extends " + definition.baseType + " {\r\n";
    hasKind = false;

    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateIsMissingMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);

    result += "}";

    return result;
}

function generateNodes(): string {
    var result = "///<reference path='References.ts' />";

    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition === undefined) { continue; }

        result += "\r\n\r\n";
        result += generateNode(definition);
    }

    return result;
}

function generateRewriter(): string {
    var result = "";

    result +=
"///<reference path='References.ts' />\r\n"+
"\r\n" +
"class SyntaxRewriter implements ISyntaxVisitor1 {\r\n" +
"    public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" +
"        return token;\r\n" +
"    }\r\n" +
"\r\n" +
"    private visitNode(node: SyntaxNode): SyntaxNode {\r\n" +
"        return node === null ? null : node.accept1(this);\r\n" +
"    }\r\n" +
"\r\n" +
"    private visitList(list: ISyntaxList): ISyntaxList {\r\n" +
"        var newItems: SyntaxNode[] = null;\r\n" +
"\r\n" +
"        for (var i = 0, n = list.count(); i < n; i++) {\r\n" +
"            var item = list.syntaxNodeAt(i);\r\n" +
"            var newItem = <SyntaxNode>item.accept1(this);\r\n" +
"\r\n" +
"            if (item !== newItem && newItems === null) {\r\n" +
"                newItems = [];\r\n" +
"                for (var j = 0; j < i; j++) {\r\n" +
"                    newItems.push(list.syntaxNodeAt(j));\r\n" +
"                }\r\n" +
"            }\r\n" +
"\r\n" +
"            if (newItems) {\r\n" +
"                newItems.push(newItem);\r\n" +
"            }\r\n" +
"        }\r\n" +
"\r\n" +
"        Debug.assert(newItems === null || newItems.length === list.count());\r\n" +
"        return newItems === null ? list : SyntaxList.create(newItems);\r\n" +
"    }\r\n" +
"\r\n" +
"    private visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" +
"        var newItems: any[] = null;\r\n" +
"\r\n" +
"        for (var i = 0, n = list.count(); i < n; i++) {\r\n" +
"            var item = list.itemAt(i);\r\n" +
"            var newItem = item.isToken() ? <ISyntaxElement>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" +
"\r\n" +
"            if (item !== newItem && newItems === null) {\r\n" +
"                newItems = [];\r\n" +
"                for (var j = 0; j < i; j++) {\r\n" +
"                    newItems.push(list.itemAt(j));\r\n" +
"                }\r\n" +
"            }\r\n" +
"\r\n" +
"            if (newItems) {\r\n" +
"                newItems.push(newItem);\r\n" +
"            }\r\n" +
"        }\r\n" +
"\r\n" +
"        Debug.assert(newItems === null || newItems.length === list.count());\r\n" +
"        return newItems === null ? list : SeparatedSyntaxList.create(newItems);\r\n" +
"    }\r\n";

    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition === undefined) { continue; }
        if (definition.isAbstract) { continue; }

        result += "\r\n";
        result += "    public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
        result += "        return node.update(\r\n";

        for (var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            if (child === undefined) { continue; }

            result += "            ";
            if (child.isOptional && child.isToken) {
                result += "node." + child.name + "() === null ? null : ";
            }

            if (child.isToken) {
                result += "this.visitToken(node." + child.name + "())";
            }
            else if (child.isList) {
                result += "this.visitList(node." + child.name + "())";
            }
            else if (child.isSeparatedList) {
                result += "this.visitSeparatedList(node." + child.name + "())";
            }
            else if (child.type === "SyntaxKind") {
                result += "node.kind()";
            }
            else {
                result += "<" + child.type + ">this.visitNode(node." + child.name + "())";
            }

            if (j < definition.children.length - 2) {
                result += ",\r\n";
            }
        }

        result += ");\r\n";
        result += "    }\r\n";
    }

    result += "}";
    return result;
}

var syntaxNodes = generateNodes();
var rewriter = generateRewriter();

Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxNodes.ts", syntaxNodes, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxRewriter.ts", rewriter, true);