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
}

var definitions:any[] = [
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
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'equalsToken', isToken: true },
            <any>{ name: 'moduleReference', type: 'ModuleReferenceSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ClassDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true },
            <any>{ name: 'declareKeyword', isToken: true },
            <any>{ name: 'classKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'extendsClause', type: 'ExtendsClauseSyntax' },
            <any>{ name: 'implementsClause', type: 'ImplementsClauseSyntax' },
            <any>{ name: 'openBraceToken', isToken: true },
            <any>{ name: 'classElements', isList: true },
            <any>{ name: 'closeBraceToken', isToken: true },
        ]
    },
    <any>{
        name: 'InterfaceDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true },
            <any>{ name: 'interfaceKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'extendsClause', type: 'ExtendsClauseSyntax' },
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
            <any>{ name: 'exportKeyword', isToken: true },
            <any>{ name: 'declareKeyword', isToken: true },
            <any>{ name: 'moduleKeyword', isToken: true },
            <any>{ name: 'moduleName', type: 'NameSyntax' },
            <any>{ name: 'stringLiteral', isToken: true },
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
            <any>{ name: 'exportKeyword', isToken: true },
            <any>{ name: 'declareKeyword', isToken: true },
            <any>{ name: 'functionKeyword', isToken: true },
            <any>{ name: 'functionSignature', type: 'FunctionSignatureSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'VariableStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'exportKeyword', isToken: true },
            <any>{ name: 'declareKeyword', isToken: true },
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
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
            <any>{ name: 'equalsValueClause', type: 'EqualsValueClauseSyntax' },
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
            <any>{ name: 'operatorToken', isToken: true },
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
            <any>{ name: 'literalToken', isToken: true },
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
            <any>{ name: 'identifier', isToken: true },
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
            <any>{ name: 'identifier', isToken: true },
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
            <any>{ name: 'keyword', isToken: true },
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
            <any>{ name: 'dotDotDotToken', isToken: true },
            <any>{ name: 'publicOrPrivateKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'questionToken', isToken: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
            <any>{ name: 'equalsValueClause', type: 'EqualsValueClauseSyntax' },
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
            <any>{ name: 'operatorToken', isToken: true },
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
            <any>{ name: 'operatorToken', isToken: true },
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
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
        ]
    },
    <any>{
        name: 'FunctionSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'questionToken', isToken: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
        ]
    },
    <any>{
        name: 'IndexSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'openBracketToken', isToken: true },
            <any>{ name: 'parameter', type: 'ParameterSyntax' },
            <any>{ name: 'closeBracketToken', isToken: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
        ]
    },
    <any>{
        name: 'PropertySignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'questionToken', isToken: true },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
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
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
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
            <any>{ name: 'elseClause', type: 'ElseClauseSyntax' },
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
            <any>{ name: 'block', type: 'BlockSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
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
            <any>{ name: 'publicOrPrivateKeyword', isToken: true },
            <any>{ name: 'staticKeyword', isToken: true },
            <any>{ name: 'functionSignature', type: 'FunctionSignatureSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
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
            <any>{ name: 'publicOrPrivateKeyword', isToken: true },
            <any>{ name: 'staticKeyword', isToken: true },
            <any>{ name: 'getKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'typeAnnotation', type: 'TypeAnnotationSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'SetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            <any>{ name: 'publicOrPrivateKeyword', isToken: true },
            <any>{ name: 'staticKeyword', isToken: true },
            <any>{ name: 'setKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'parameterList', type: 'ParameterListSyntax' },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            <any>{ name: 'publicOrPrivateKeyword', isToken: true },
            <any>{ name: 'staticKeyword', isToken: true },
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
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ObjectCreationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'newKeyword', isToken: true },
            <any>{ name: 'expression', type: 'ExpressionSyntax' },
            <any>{ name: 'argumentList', type: 'ArgumentListSyntax' },
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
            <any>{ name: 'identifier', isToken: true },
            <any>{ name: 'semicolonToken', isToken: true },
        ]
    },
    <any>{
        name: 'ContinueStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            <any>{ name: 'continueKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
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
            <any>{ name: 'variableDeclaration', type: 'VariableDeclarationSyntax' },
            <any>{ name: 'initializer', type: 'ExpressionSyntax' },
            <any>{ name: 'firstSemicolonToken', isToken: true },
            <any>{ name: 'condition', type: 'ExpressionSyntax' },
            <any>{ name: 'secondSemicolonToken', isToken: true },
            <any>{ name: 'incrementor', type: 'ExpressionSyntax' },
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
            <any>{ name: 'variableDeclaration', type: 'VariableDeclarationSyntax' },
            <any>{ name: 'left', type: 'ExpressionSyntax' },
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
            <any>{ name: 'exportKeyword', isToken: true },
            <any>{ name: 'enumKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
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
            <any>{ name: 'propertyName', isToken: true },
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
            <any>{ name: 'propertyName', isToken: true },
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
            <any>{ name: 'propertyName', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'parameterName', isToken: true },
            <any>{ name: 'closeParenToken', isToken: true },
            <any>{ name: 'block', type: 'BlockSyntax' },
        ]
    },
    <any>{
        name: 'FunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            <any>{ name: 'functionKeyword', isToken: true },
            <any>{ name: 'identifier', isToken: true },
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
            <any>{ name: 'catchClause', type: 'CatchClauseSyntax' },
            <any>{ name: 'finallyClause', type: 'FinallyClauseSyntax' },
        ]
    },
    <any>{
        name: 'CatchClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            <any>{ name: 'catchKeyword', isToken: true },
            <any>{ name: 'openParenToken', isToken: true },
            <any>{ name: 'identifier', isToken: true },
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
            <any>{ name: 'identifier', isToken: true },
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

function generateNode(definition: ITypeDefinition): string {
    var result = "class " + definition.name + " extends " + definition.baseType + " {\r\n";
    var hasKind = false;

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        result += "    private _" + child.name + ": " + getType(child) + ";\r\n";

        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }

    if (definition.children.length > 0) {
        result += "\r\n";
    }

    result += "    constructor("

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        //if (i !== 0) {
        //    result += "                ");
        //}
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

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }

        result += "        this._" + child.name + " = " + child.name + ";\r\n";
    }

    result += "    }\r\n";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): void {\r\n";
        result += "        visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";

        result += "\r\n";
        result += "    public accept1(visitor: ISyntaxVisitor1): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";

        if (!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }

    for (var i = 0; i < definition.children.length; i++) {
        var child: IMemberDefinition = definition.children[i];
        if (child === undefined) { continue; }
        
        result += "\r\n";
        result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
        result += "        return this._" + child.name + ";\r\n";
        result += "    }\r\n";
    }

    result += "}";

    return result;
}

function generateNodes(): string {
    var result = "";

    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition === undefined) { continue; }

        if (result !== "") {
            result += "\r\n\r\n";
        }

        result += generateNode(definition);
    }

    return result;
}

var nodes = generateNodes();

1 + 1;