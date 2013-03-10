///<reference path='ISyntaxList.ts' />

module Syntax {
    export interface IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        exportAssignment(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax;
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        extendsClause(extendsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax;
        implementsClause(implementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax;
        moduleDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, moduleKeyword: ISyntaxToken, moduleName: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        functionDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, functionKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        variableStatement(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        variableDeclarator(identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax;
        colonValueClause(colonToken: ISyntaxToken, value: IExpressionSyntax): ColonValueClauseSyntax;
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        omittedExpression(): OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax;
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        constructorType(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        functionType(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        genericType(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax;
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax;
        parameter(dotDotDotToken: ISyntaxToken, publicOrPrivateKeyword: ISyntaxToken, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: SyntaxKind, operand: IExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        invocationExpression(expression: IExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        argumentList(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        constructSignature(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): FunctionSignatureSyntax;
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        propertySignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        typeParameterList(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax;
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax;
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        constructorDeclaration(constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        memberFunctionDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        getMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, getKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax;
        setMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, setKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax;
        memberVariableDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax;
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax;
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        enumElement(identifier: ISyntaxToken, stringLiteral: ISyntaxToken, colonValueClause: ColonValueClauseSyntax): EnumElementSyntax;
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
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
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, /*parsedInStrictMode:*/ false);
        }
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
            return new ModuleNameModuleReferenceSyntax(moduleName, /*parsedInStrictMode:*/ false);
        }
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        exportAssignment(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax {
            return new ExportAssignmentSyntax(exportKeyword, equalsToken, identifier, semicolonToken, /*parsedInStrictMode:*/ false);
        }
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, /*parsedInStrictMode:*/ false);
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
        colonValueClause(colonToken: ISyntaxToken, value: IExpressionSyntax): ColonValueClauseSyntax {
            return new ColonValueClauseSyntax(colonToken, value, /*parsedInStrictMode:*/ false);
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
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ false);
        }
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ false);
        }
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax {
            return new QualifiedNameSyntax(left, dotToken, right, /*parsedInStrictMode:*/ false);
        }
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
            return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ false);
        }
        constructorType(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax {
            return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
        }
        functionType(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax {
            return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
        }
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, /*parsedInStrictMode:*/ false);
        }
        genericType(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax {
            return new GenericTypeSyntax(name, typeArgumentList, /*parsedInStrictMode:*/ false);
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
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax {
            return new MemberAccessExpressionSyntax(expression, dotToken, name, /*parsedInStrictMode:*/ false);
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
        argumentList(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax {
            return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, /*parsedInStrictMode:*/ false);
        }
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right, /*parsedInStrictMode:*/ false);
        }
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, /*parsedInStrictMode:*/ false);
        }
        constructSignature(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax {
            return new ConstructSignatureSyntax(newKeyword, callSignature, /*parsedInStrictMode:*/ false);
        }
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
            return new FunctionSignatureSyntax(identifier, questionToken, callSignature, /*parsedInStrictMode:*/ false);
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
        typeParameterList(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
            return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, /*parsedInStrictMode:*/ false);
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
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, enumElements, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        enumElement(identifier: ISyntaxToken, stringLiteral: ISyntaxToken, colonValueClause: ColonValueClauseSyntax): EnumElementSyntax {
            return new EnumElementSyntax(identifier, stringLiteral, colonValueClause, /*parsedInStrictMode:*/ false);
        }
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, /*parsedInStrictMode:*/ false);
        }
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, /*parsedInStrictMode:*/ false);
        }
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, /*parsedInStrictMode:*/ false);
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
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, /*parsedInStrictMode:*/ true);
        }
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
            return new ModuleNameModuleReferenceSyntax(moduleName, /*parsedInStrictMode:*/ true);
        }
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        exportAssignment(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax {
            return new ExportAssignmentSyntax(exportKeyword, equalsToken, identifier, semicolonToken, /*parsedInStrictMode:*/ true);
        }
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, /*parsedInStrictMode:*/ true);
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
        colonValueClause(colonToken: ISyntaxToken, value: IExpressionSyntax): ColonValueClauseSyntax {
            return new ColonValueClauseSyntax(colonToken, value, /*parsedInStrictMode:*/ true);
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
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ true);
        }
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ true);
        }
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax {
            return new QualifiedNameSyntax(left, dotToken, right, /*parsedInStrictMode:*/ true);
        }
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
            return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ true);
        }
        constructorType(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax {
            return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ true);
        }
        functionType(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax {
            return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ true);
        }
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, /*parsedInStrictMode:*/ true);
        }
        genericType(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax {
            return new GenericTypeSyntax(name, typeArgumentList, /*parsedInStrictMode:*/ true);
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
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax {
            return new MemberAccessExpressionSyntax(expression, dotToken, name, /*parsedInStrictMode:*/ true);
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
        argumentList(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax {
            return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, /*parsedInStrictMode:*/ true);
        }
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right, /*parsedInStrictMode:*/ true);
        }
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, /*parsedInStrictMode:*/ true);
        }
        constructSignature(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax {
            return new ConstructSignatureSyntax(newKeyword, callSignature, /*parsedInStrictMode:*/ true);
        }
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
            return new FunctionSignatureSyntax(identifier, questionToken, callSignature, /*parsedInStrictMode:*/ true);
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
        typeParameterList(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
            return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, /*parsedInStrictMode:*/ true);
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
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, enumElements, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        enumElement(identifier: ISyntaxToken, stringLiteral: ISyntaxToken, colonValueClause: ColonValueClauseSyntax): EnumElementSyntax {
            return new EnumElementSyntax(identifier, stringLiteral, colonValueClause, /*parsedInStrictMode:*/ true);
        }
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, /*parsedInStrictMode:*/ true);
        }
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, /*parsedInStrictMode:*/ true);
        }
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, /*parsedInStrictMode:*/ true);
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