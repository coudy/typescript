///<reference path='ISyntaxList.ts' />

module Syntax {
    export interface IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        moduleReference(): ModuleReferenceSyntax;
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        extendsClause(extendsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax;
        implementsClause(implementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax;
        moduleDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, moduleKeyword: ISyntaxToken, moduleName: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        functionDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, functionKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        variableStatement(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        variableDeclarator(identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax;
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        omittedExpression(): OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        arrowFunctionExpression(): ArrowFunctionExpressionSyntax;
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISimpleNameSyntax): QualifiedNameSyntax;
        genericName(identifier: ISyntaxToken, typeArgumentList: TypeArgumentListSyntax): GenericNameSyntax;
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        constructorType(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        functionType(parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax;
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax;
        parameter(dotDotDotToken: ISyntaxToken, publicOrPrivateKeyword: ISyntaxToken, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, identifierName: ISyntaxToken): MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: SyntaxKind, operand: IExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        invocationExpression(expression: IExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        argumentList(openParenToken: ISyntaxToken, arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        typeMember(): TypeMemberSyntax;
        constructSignature(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax;
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax;
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        propertySignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        typeParameterList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax;
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax;
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        constructorDeclaration(constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        memberFunctionDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        memberAccessorDeclaration(): MemberAccessorDeclarationSyntax;
        getMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, getKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax;
        setMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, setKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax;
        memberVariableDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        switchClause(): SwitchClauseSyntax;
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        iterationStatement(): IterationStatementSyntax;
        baseForStatement(): BaseForStatementSyntax;
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax;
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax;
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        propertyAssignment(): PropertyAssignmentSyntax;
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        accessorPropertyAssignment(): AccessorPropertyAssignmentSyntax;
        getAccessorPropertyAssignment(getKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): GetAccessorPropertyAssignmentSyntax;
        setAccessorPropertyAssignment(setKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, parameterName: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): SetAccessorPropertyAssignmentSyntax;
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax;
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax;
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax;
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IExpressionSyntax): TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IExpressionSyntax): DeleteExpressionSyntax;
        voidExpression(voidKeyword: ISyntaxToken, expression: IExpressionSyntax): VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
    }

    class NormalModeFactory implements IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax {
            return new SourceUnitSyntax(moduleElements, endOfFileToken, /*parsedInStrictMode:*/ false);
        }
        moduleReference(): ModuleReferenceSyntax {
            return new ModuleReferenceSyntax(/*parsedInStrictMode:*/ false);
        }
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, /*parsedInStrictMode:*/ false);
        }
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
            return new ModuleNameModuleReferenceSyntax(moduleName, /*parsedInStrictMode:*/ false);
        }
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body, /*parsedInStrictMode:*/ false);
        }
        extendsClause(extendsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
            return new ExtendsClauseSyntax(extendsKeyword, typeNames, /*parsedInStrictMode:*/ false);
        }
        implementsClause(implementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
            return new ImplementsClauseSyntax(implementsKeyword, typeNames, /*parsedInStrictMode:*/ false);
        }
        moduleDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, moduleKeyword: ISyntaxToken, moduleName: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
            return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        functionDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, functionKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
            return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        variableStatement(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax {
            return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
            return new VariableDeclarationSyntax(varKeyword, variableDeclarators, /*parsedInStrictMode:*/ false);
        }
        variableDeclarator(identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
            return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ false);
        }
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax {
            return new EqualsValueClauseSyntax(equalsToken, value, /*parsedInStrictMode:*/ false);
        }
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
            return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, /*parsedInStrictMode:*/ false);
        }
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
            return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, /*parsedInStrictMode:*/ false);
        }
        omittedExpression(): OmittedExpressionSyntax {
            return new OmittedExpressionSyntax(/*parsedInStrictMode:*/ false);
        }
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
            return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, /*parsedInStrictMode:*/ false);
        }
        arrowFunctionExpression(): ArrowFunctionExpressionSyntax {
            return new ArrowFunctionExpressionSyntax(/*parsedInStrictMode:*/ false);
        }
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ false);
        }
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ false);
        }
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISimpleNameSyntax): QualifiedNameSyntax {
            return new QualifiedNameSyntax(left, dotToken, right, /*parsedInStrictMode:*/ false);
        }
        genericName(identifier: ISyntaxToken, typeArgumentList: TypeArgumentListSyntax): GenericNameSyntax {
            return new GenericNameSyntax(identifier, typeArgumentList, /*parsedInStrictMode:*/ false);
        }
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
            return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ false);
        }
        constructorType(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax {
            return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
        }
        functionType(parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax {
            return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
        }
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, /*parsedInStrictMode:*/ false);
        }
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax {
            return new TypeAnnotationSyntax(colonToken, type, /*parsedInStrictMode:*/ false);
        }
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax {
            return new BlockSyntax(openBraceToken, statements, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        parameter(dotDotDotToken: ISyntaxToken, publicOrPrivateKeyword: ISyntaxToken, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
            return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ false);
        }
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, identifierName: ISyntaxToken): MemberAccessExpressionSyntax {
            return new MemberAccessExpressionSyntax(expression, dotToken, identifierName, /*parsedInStrictMode:*/ false);
        }
        postfixUnaryExpression(kind: SyntaxKind, operand: IExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
            return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, /*parsedInStrictMode:*/ false);
        }
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
            return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, /*parsedInStrictMode:*/ false);
        }
        invocationExpression(expression: IExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
            return new InvocationExpressionSyntax(expression, argumentList, /*parsedInStrictMode:*/ false);
        }
        argumentList(openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax {
            return new ArgumentListSyntax(openParenToken, _arguments, closeParenToken, /*parsedInStrictMode:*/ false);
        }
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right, /*parsedInStrictMode:*/ false);
        }
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, /*parsedInStrictMode:*/ false);
        }
        typeMember(): TypeMemberSyntax {
            return new TypeMemberSyntax(/*parsedInStrictMode:*/ false);
        }
        constructSignature(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax {
            return new ConstructSignatureSyntax(newKeyword, typeParameterList, parameterList, typeAnnotation, /*parsedInStrictMode:*/ false);
        }
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax {
            return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation, /*parsedInStrictMode:*/ false);
        }
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
            return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, /*parsedInStrictMode:*/ false);
        }
        propertySignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
            return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, /*parsedInStrictMode:*/ false);
        }
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax {
            return new ParameterListSyntax(openParenToken, parameters, closeParenToken, /*parsedInStrictMode:*/ false);
        }
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
            return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, /*parsedInStrictMode:*/ false);
        }
        typeParameterList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
            return new TypeParameterListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ false);
        }
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax {
            return new TypeParameterSyntax(identifier, constraint, /*parsedInStrictMode:*/ false);
        }
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax {
            return new ConstraintSyntax(extendsKeyword, type, /*parsedInStrictMode:*/ false);
        }
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax {
            return new ElseClauseSyntax(elseKeyword, statement, /*parsedInStrictMode:*/ false);
        }
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax {
            return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, /*parsedInStrictMode:*/ false);
        }
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
            return new ExpressionStatementSyntax(expression, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        constructorDeclaration(constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
            return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        memberFunctionDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
            return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        memberAccessorDeclaration(): MemberAccessorDeclarationSyntax {
            return new MemberAccessorDeclarationSyntax(/*parsedInStrictMode:*/ false);
        }
        getMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, getKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
            return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, /*parsedInStrictMode:*/ false);
        }
        setMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, setKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
            return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, /*parsedInStrictMode:*/ false);
        }
        memberVariableDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
            return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax {
            return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax {
            return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
            return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, /*parsedInStrictMode:*/ false);
        }
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
            return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        switchClause(): SwitchClauseSyntax {
            return new SwitchClauseSyntax(/*parsedInStrictMode:*/ false);
        }
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax {
            return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, /*parsedInStrictMode:*/ false);
        }
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax {
            return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, /*parsedInStrictMode:*/ false);
        }
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax {
            return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax {
            return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        iterationStatement(): IterationStatementSyntax {
            return new IterationStatementSyntax(/*parsedInStrictMode:*/ false);
        }
        baseForStatement(): BaseForStatementSyntax {
            return new BaseForStatementSyntax(/*parsedInStrictMode:*/ false);
        }
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax {
            return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, /*parsedInStrictMode:*/ false);
        }
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax {
            return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, /*parsedInStrictMode:*/ false);
        }
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax {
            return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ false);
        }
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax {
            return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ false);
        }
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, /*parsedInStrictMode:*/ false);
        }
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        propertyAssignment(): PropertyAssignmentSyntax {
            return new PropertyAssignmentSyntax(/*parsedInStrictMode:*/ false);
        }
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, /*parsedInStrictMode:*/ false);
        }
        accessorPropertyAssignment(): AccessorPropertyAssignmentSyntax {
            return new AccessorPropertyAssignmentSyntax(/*parsedInStrictMode:*/ false);
        }
        getAccessorPropertyAssignment(getKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
            return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, /*parsedInStrictMode:*/ false);
        }
        setAccessorPropertyAssignment(setKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, parameterName: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
            return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, /*parsedInStrictMode:*/ false);
        }
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax {
            return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, /*parsedInStrictMode:*/ false);
        }
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
            return new EmptyStatementSyntax(semicolonToken, /*parsedInStrictMode:*/ false);
        }
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax {
            return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, /*parsedInStrictMode:*/ false);
        }
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax {
            return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, /*parsedInStrictMode:*/ false);
        }
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax {
            return new FinallyClauseSyntax(finallyKeyword, block, /*parsedInStrictMode:*/ false);
        }
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax {
            return new LabeledStatementSyntax(identifier, colonToken, statement, /*parsedInStrictMode:*/ false);
        }
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax {
            return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IExpressionSyntax): TypeOfExpressionSyntax {
            return new TypeOfExpressionSyntax(typeOfKeyword, expression, /*parsedInStrictMode:*/ false);
        }
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IExpressionSyntax): DeleteExpressionSyntax {
            return new DeleteExpressionSyntax(deleteKeyword, expression, /*parsedInStrictMode:*/ false);
        }
        voidExpression(voidKeyword: ISyntaxToken, expression: IExpressionSyntax): VoidExpressionSyntax {
            return new VoidExpressionSyntax(voidKeyword, expression, /*parsedInStrictMode:*/ false);
        }
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
            return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, /*parsedInStrictMode:*/ false);
        }
    }

    class StrictModeFactory implements IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax {
            return new SourceUnitSyntax(moduleElements, endOfFileToken, /*parsedInStrictMode:*/ true);
        }
        moduleReference(): ModuleReferenceSyntax {
            return new ModuleReferenceSyntax(/*parsedInStrictMode:*/ true);
        }
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, /*parsedInStrictMode:*/ true);
        }
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
            return new ModuleNameModuleReferenceSyntax(moduleName, /*parsedInStrictMode:*/ true);
        }
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body, /*parsedInStrictMode:*/ true);
        }
        extendsClause(extendsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
            return new ExtendsClauseSyntax(extendsKeyword, typeNames, /*parsedInStrictMode:*/ true);
        }
        implementsClause(implementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
            return new ImplementsClauseSyntax(implementsKeyword, typeNames, /*parsedInStrictMode:*/ true);
        }
        moduleDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, moduleKeyword: ISyntaxToken, moduleName: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
            return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        functionDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, functionKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
            return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        variableStatement(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax {
            return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
            return new VariableDeclarationSyntax(varKeyword, variableDeclarators, /*parsedInStrictMode:*/ true);
        }
        variableDeclarator(identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
            return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ true);
        }
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax {
            return new EqualsValueClauseSyntax(equalsToken, value, /*parsedInStrictMode:*/ true);
        }
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
            return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, /*parsedInStrictMode:*/ true);
        }
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
            return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, /*parsedInStrictMode:*/ true);
        }
        omittedExpression(): OmittedExpressionSyntax {
            return new OmittedExpressionSyntax(/*parsedInStrictMode:*/ true);
        }
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
            return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, /*parsedInStrictMode:*/ true);
        }
        arrowFunctionExpression(): ArrowFunctionExpressionSyntax {
            return new ArrowFunctionExpressionSyntax(/*parsedInStrictMode:*/ true);
        }
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ true);
        }
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ true);
        }
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISimpleNameSyntax): QualifiedNameSyntax {
            return new QualifiedNameSyntax(left, dotToken, right, /*parsedInStrictMode:*/ true);
        }
        genericName(identifier: ISyntaxToken, typeArgumentList: TypeArgumentListSyntax): GenericNameSyntax {
            return new GenericNameSyntax(identifier, typeArgumentList, /*parsedInStrictMode:*/ true);
        }
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
            return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ true);
        }
        constructorType(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax {
            return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ true);
        }
        functionType(parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax {
            return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ true);
        }
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, /*parsedInStrictMode:*/ true);
        }
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax {
            return new TypeAnnotationSyntax(colonToken, type, /*parsedInStrictMode:*/ true);
        }
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax {
            return new BlockSyntax(openBraceToken, statements, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        parameter(dotDotDotToken: ISyntaxToken, publicOrPrivateKeyword: ISyntaxToken, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
            return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ true);
        }
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, identifierName: ISyntaxToken): MemberAccessExpressionSyntax {
            return new MemberAccessExpressionSyntax(expression, dotToken, identifierName, /*parsedInStrictMode:*/ true);
        }
        postfixUnaryExpression(kind: SyntaxKind, operand: IExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
            return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, /*parsedInStrictMode:*/ true);
        }
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
            return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, /*parsedInStrictMode:*/ true);
        }
        invocationExpression(expression: IExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
            return new InvocationExpressionSyntax(expression, argumentList, /*parsedInStrictMode:*/ true);
        }
        argumentList(openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax {
            return new ArgumentListSyntax(openParenToken, _arguments, closeParenToken, /*parsedInStrictMode:*/ true);
        }
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right, /*parsedInStrictMode:*/ true);
        }
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, /*parsedInStrictMode:*/ true);
        }
        typeMember(): TypeMemberSyntax {
            return new TypeMemberSyntax(/*parsedInStrictMode:*/ true);
        }
        constructSignature(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax {
            return new ConstructSignatureSyntax(newKeyword, typeParameterList, parameterList, typeAnnotation, /*parsedInStrictMode:*/ true);
        }
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax {
            return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation, /*parsedInStrictMode:*/ true);
        }
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
            return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, /*parsedInStrictMode:*/ true);
        }
        propertySignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
            return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, /*parsedInStrictMode:*/ true);
        }
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax {
            return new ParameterListSyntax(openParenToken, parameters, closeParenToken, /*parsedInStrictMode:*/ true);
        }
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
            return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, /*parsedInStrictMode:*/ true);
        }
        typeParameterList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
            return new TypeParameterListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ true);
        }
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax {
            return new TypeParameterSyntax(identifier, constraint, /*parsedInStrictMode:*/ true);
        }
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax {
            return new ConstraintSyntax(extendsKeyword, type, /*parsedInStrictMode:*/ true);
        }
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax {
            return new ElseClauseSyntax(elseKeyword, statement, /*parsedInStrictMode:*/ true);
        }
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax {
            return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, /*parsedInStrictMode:*/ true);
        }
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
            return new ExpressionStatementSyntax(expression, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        constructorDeclaration(constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
            return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        memberFunctionDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
            return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        memberAccessorDeclaration(): MemberAccessorDeclarationSyntax {
            return new MemberAccessorDeclarationSyntax(/*parsedInStrictMode:*/ true);
        }
        getMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, getKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
            return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, /*parsedInStrictMode:*/ true);
        }
        setMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, setKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
            return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, /*parsedInStrictMode:*/ true);
        }
        memberVariableDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
            return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax {
            return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax {
            return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
            return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, /*parsedInStrictMode:*/ true);
        }
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
            return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        switchClause(): SwitchClauseSyntax {
            return new SwitchClauseSyntax(/*parsedInStrictMode:*/ true);
        }
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax {
            return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, /*parsedInStrictMode:*/ true);
        }
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax {
            return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, /*parsedInStrictMode:*/ true);
        }
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax {
            return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax {
            return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        iterationStatement(): IterationStatementSyntax {
            return new IterationStatementSyntax(/*parsedInStrictMode:*/ true);
        }
        baseForStatement(): BaseForStatementSyntax {
            return new BaseForStatementSyntax(/*parsedInStrictMode:*/ true);
        }
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax {
            return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, /*parsedInStrictMode:*/ true);
        }
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax {
            return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, /*parsedInStrictMode:*/ true);
        }
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax {
            return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ true);
        }
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax {
            return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ true);
        }
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, /*parsedInStrictMode:*/ true);
        }
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        propertyAssignment(): PropertyAssignmentSyntax {
            return new PropertyAssignmentSyntax(/*parsedInStrictMode:*/ true);
        }
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, /*parsedInStrictMode:*/ true);
        }
        accessorPropertyAssignment(): AccessorPropertyAssignmentSyntax {
            return new AccessorPropertyAssignmentSyntax(/*parsedInStrictMode:*/ true);
        }
        getAccessorPropertyAssignment(getKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
            return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, /*parsedInStrictMode:*/ true);
        }
        setAccessorPropertyAssignment(setKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, parameterName: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
            return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, /*parsedInStrictMode:*/ true);
        }
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax {
            return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, /*parsedInStrictMode:*/ true);
        }
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
            return new EmptyStatementSyntax(semicolonToken, /*parsedInStrictMode:*/ true);
        }
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax {
            return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, /*parsedInStrictMode:*/ true);
        }
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax {
            return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, /*parsedInStrictMode:*/ true);
        }
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax {
            return new FinallyClauseSyntax(finallyKeyword, block, /*parsedInStrictMode:*/ true);
        }
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax {
            return new LabeledStatementSyntax(identifier, colonToken, statement, /*parsedInStrictMode:*/ true);
        }
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax {
            return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IExpressionSyntax): TypeOfExpressionSyntax {
            return new TypeOfExpressionSyntax(typeOfKeyword, expression, /*parsedInStrictMode:*/ true);
        }
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IExpressionSyntax): DeleteExpressionSyntax {
            return new DeleteExpressionSyntax(deleteKeyword, expression, /*parsedInStrictMode:*/ true);
        }
        voidExpression(voidKeyword: ISyntaxToken, expression: IExpressionSyntax): VoidExpressionSyntax {
            return new VoidExpressionSyntax(voidKeyword, expression, /*parsedInStrictMode:*/ true);
        }
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
            return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, /*parsedInStrictMode:*/ true);
        }
    }

    export var normalModeFactory: IFactory = new NormalModeFactory();
    export var strictModeFactory: IFactory = new StrictModeFactory();
}