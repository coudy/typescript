var definitions = [
    {
        name: 'SourceUnitSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'moduleElements',
                isList: true
            }, 
            {
                name: 'endOfFileToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ModuleElementSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ModuleReferenceSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ExternalModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            {
                name: 'moduleKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'stringLiteral',
                isToken: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            {
                name: 'moduleName',
                type: 'NameSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ImportDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'importKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'equalsToken',
                isToken: true
            }, 
            {
                name: 'moduleReference',
                type: 'ModuleReferenceSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ClassDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'classKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'extendsClause',
                type: 'ExtendsClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'implementsClause',
                type: 'ImplementsClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'classElements',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'InterfaceDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'interfaceKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'extendsClause',
                type: 'ExtendsClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'body',
                type: 'ObjectTypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ExtendsClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'extendsKeyword',
                isToken: true
            }, 
            {
                name: 'typeNames',
                isSeparatedList: true
            }, 
            
        ]
    }, 
    {
        name: 'ImplementsClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'implementsKeyword',
                isToken: true
            }, 
            {
                name: 'typeNames',
                isSeparatedList: true
            }, 
            
        ]
    }, 
    {
        name: 'ModuleDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'moduleKeyword',
                isToken: true
            }, 
            {
                name: 'moduleName',
                type: 'NameSyntax',
                isOptional: true
            }, 
            {
                name: 'stringLiteral',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'moduleElements',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'StatementSyntax',
        baseType: 'ModuleElementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'FunctionDeclarationSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true
            }, 
            {
                name: 'functionKeyword',
                isToken: true
            }, 
            {
                name: 'functionSignature',
                type: 'FunctionSignatureSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'VariableStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'variableDeclaration',
                type: 'VariableDeclarationSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ExpressionSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'UnaryExpressionSyntax',
        baseType: 'ExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'VariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'varKeyword',
                isToken: true
            }, 
            {
                name: 'variableDeclarators',
                isSeparatedList: true
            }, 
            
        ]
    }, 
    {
        name: 'VariableDeclaratorSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            {
                name: 'equalsValueClause',
                type: 'EqualsValueClauseSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'EqualsValueClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'equalsToken',
                isToken: true
            }, 
            {
                name: 'value',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'PrefixUnaryExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'operatorToken',
                isToken: true
            }, 
            {
                name: 'operand',
                type: 'UnaryExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ThisExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'thisKeyword',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'LiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'literalToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ArrayLiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'expressions',
                isSeparatedList: true
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'OmittedExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: []
    }, 
    {
        name: 'ParenthesizedExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'SimpleArrowFunctionExpression',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'body',
                type: 'SyntaxNode'
            }, 
            
        ]
    }, 
    {
        name: 'ParenthesizedArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'body',
                type: 'SyntaxNode'
            }, 
            
        ]
    }, 
    {
        name: 'TypeSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'NameSyntax',
        baseType: 'TypeSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'IdentifierNameSyntax',
        baseType: 'NameSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'QualifiedNameSyntax',
        baseType: 'NameSyntax',
        children: [
            {
                name: 'left',
                type: 'NameSyntax'
            }, 
            {
                name: 'dotToken',
                isToken: true
            }, 
            {
                name: 'right',
                type: 'IdentifierNameSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ConstructorTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'FunctionTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ObjectTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'typeMembers',
                isSeparatedList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ArrayTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'PredefinedTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'keyword',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'TypeAnnotationSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'BlockSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'dotDotDotToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            {
                name: 'equalsValueClause',
                type: 'EqualsValueClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'MemberAccessExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'dotToken',
                isToken: true
            }, 
            {
                name: 'identifierName',
                type: 'IdentifierNameSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'PostfixUnaryExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'operand',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'operatorToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ElementAccessExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'argumentExpression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'InvocationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'argumentList',
                type: 'ArgumentListSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'arguments',
                isSeparatedList: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'BinaryExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'left',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'operatorToken',
                isToken: true
            }, 
            {
                name: 'right',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ConditionalExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: [
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'questionToken',
                isToken: true
            }, 
            {
                name: 'whenTrue',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'whenFalse',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'TypeMemberSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ConstructSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'FunctionSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'IndexSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'parameter',
                type: 'ParameterSyntax'
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'PropertySignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'ParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'parameters',
                isSeparatedList: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'CallSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'ElseClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'elseKeyword',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'IfStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'ifKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            {
                name: 'elseClause',
                type: 'ElseClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'ExpressionStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ClassElementSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ConstructorDeclarationSyntax',
        baseType: 'ClassElementSyntax',
        children: [
            {
                name: 'constructorKeyword',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true,
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'MemberDeclarationSyntax',
        baseType: 'ClassElementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'MemberFunctionDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'functionSignature',
                type: 'FunctionSignatureSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true,
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'MemberAccessorDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'GetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'getKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'SetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'setKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'variableDeclarator',
                type: 'VariableDeclaratorSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ThrowStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'throwKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ReturnStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'returnKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ObjectCreationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'argumentList',
                type: 'ArgumentListSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'SwitchStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'switchKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'caseClauses',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'SwitchClauseSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'CaseSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            {
                name: 'caseKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true
            }, 
            
        ]
    }, 
    {
        name: 'DefaultSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            {
                name: 'defaultKeyword',
                isToken: true
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true
            }, 
            
        ]
    }, 
    {
        name: 'BreakStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'breakKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ContinueStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'continueKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'IterationStatementSyntax',
        baseType: 'StatementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'BaseForStatementSyntax',
        baseType: 'IterationStatementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ForStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            {
                name: 'forKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'variableDeclaration',
                type: 'VariableDeclarationSyntax',
                isOptional: true
            }, 
            {
                name: 'initializer',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'firstSemicolonToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'secondSemicolonToken',
                isToken: true
            }, 
            {
                name: 'incrementor',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ForInStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            {
                name: 'forKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'variableDeclaration',
                type: 'VariableDeclarationSyntax',
                isOptional: true
            }, 
            {
                name: 'left',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'inKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'WhileStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            {
                name: 'whileKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'WithStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'withKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'EnumDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true
            }, 
            {
                name: 'enumKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'variableDeclarators',
                isSeparatedList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'CastExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'lessThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            {
                name: 'greaterThanToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'UnaryExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ObjectLiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'propertyAssignments',
                isSeparatedList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'PropertyAssignmentSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'SimplePropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            {
                name: 'propertyName',
                isToken: true
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'AccessorPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'GetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            {
                name: 'getKeyword',
                isToken: true
            }, 
            {
                name: 'propertyName',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'SetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            {
                name: 'setKeyword',
                isToken: true
            }, 
            {
                name: 'propertyName',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'parameterName',
                isToken: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'FunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'functionKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'EmptyStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'SuperExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'superKeyword',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'TryStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'tryKeyword',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            {
                name: 'catchClause',
                type: 'CatchClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'finallyClause',
                type: 'FinallyClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'CatchClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'catchKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'FinallyClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'finallyKeyword',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'LabeledStatement',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'DoStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            {
                name: 'doKeyword',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            {
                name: 'whileKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'TypeOfExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'typeOfKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'DeleteExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'deleteKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'VoidExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'voidKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'DebuggerStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'debuggerKeyword',
                isToken: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    
];
function endsWith(string, value) {
    return string.substring(string.length - value.length, string.length) === value;
}
function getNameWithoutSuffix(definition) {
    var name = definition.name;
    if(endsWith(name, "Syntax")) {
        return name.substring(0, name.length - "Syntax".length);
    }
    return name;
}
function getType(child) {
    if(child.isToken) {
        return "ISyntaxToken";
    } else {
        if(child.isSeparatedList) {
            return "ISeparatedSyntaxList";
        } else {
            if(child.isList) {
                return "ISyntaxList";
            } else {
                return child.type;
            }
        }
    }
}
var hasKind = false;
function getSafeName(child) {
    if(child.name === "arguments") {
        return "_" + child.name;
    }
    return child.name;
}
function getPropertyAccess(child) {
    return "this._" + child.name;
}
function generateProperties(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += "    private _" + child.name + ": " + getType(child) + ";\r\n";
        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }
    if(definition.children.length > 0) {
        result += "\r\n";
    }
    return result;
}
function generateConstructor(definition) {
    var result = "";
    result += "    constructor(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += child.name + ": " + getType(child);
        if(i < definition.children.length - 2) {
            result += ",\r\n                ";
        }
    }
    result += ") {\r\n";
    result += "        super();\r\n";
    if(definition.children.length > 0) {
        result += "\r\n";
    }
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += "        " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
    }
    result += "    }\r\n";
    return result;
}
function generateAcceptMethods(definition) {
    var result = "";
    if(!definition.isAbstract) {
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
function generateKindMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        if(!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateIsMissingMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public isMissing(): bool {\r\n";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child === undefined) {
                continue;
            }
            if(getType(child) === "SyntaxKind") {
                continue;
            }
            if(child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null && !" + getPropertyAccess(child) + ".isMissing()) { return false; }\r\n";
            } else {
                result += "        if (!" + getPropertyAccess(child) + ".isMissing()) { return false; }\r\n";
            }
        }
        result += "        return true;\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateAccessors(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += "\r\n";
        result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
        result += "        return " + getPropertyAccess(child) + ";\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateUpdateMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "";
    result += "\r\n";
    result += "    public update(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += getSafeName(child) + ": " + getType(child);
        if(i < definition.children.length - 2) {
            result += ",\r\n                  ";
        }
    }
    result += ") {\r\n";
    if(definition.children.length === 0) {
        result += "        return this;\r\n";
    } else {
        result += "        if (";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child === undefined) {
                continue;
            }
            if(i !== 0) {
                result += " && ";
            }
            result += getPropertyAccess(child) + " === " + getSafeName(child);
        }
        result += ") {\r\n";
        result += "            return this;\r\n";
        result += "        }\r\n\r\n";
        result += "        return new " + definition.name + "(";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child === undefined) {
                continue;
            }
            if(i !== 0) {
                result += ", ";
            }
            result += getSafeName(child);
        }
        result += ");\r\n";
    }
    result += "    }\r\n";
    return result;
}
function generateNode(definition) {
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
function generateNodes() {
    var result = "";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(definition === undefined) {
            continue;
        }
        if(result !== "") {
            result += "\r\n\r\n";
        }
        result += generateNode(definition);
    }
    return result;
}
var nodes = generateNodes();
1 + 1;
