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
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax;
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
        constructSignature(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax;
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax;
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        propertySignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        callSignature(parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
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
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatement;
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax;
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IExpressionSyntax): TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IExpressionSyntax): DeleteExpressionSyntax;
        voidExpression(voidKeyword: ISyntaxToken, expression: IExpressionSyntax): VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
    }

    class NormalModeFactory implements IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax {
            return new SourceUnitSyntax(moduleElements, endOfFileToken);
        }
        moduleReference(): ModuleReferenceSyntax {
            return new ModuleReferenceSyntax();
        }
        externalModuleReference(moduleKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
        }
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
            return new ModuleNameModuleReferenceSyntax(moduleName);
        }
        importDeclaration(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
        }
        classDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, classKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, implementsClause: ImplementsClauseSyntax, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken);
        }
        interfaceDeclaration(exportKeyword: ISyntaxToken, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, extendsClause: ExtendsClauseSyntax, body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body);
        }
        extendsClause(extendsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
            return new ExtendsClauseSyntax(extendsKeyword, typeNames);
        }
        implementsClause(implementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
            return new ImplementsClauseSyntax(implementsKeyword, typeNames);
        }
        moduleDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, moduleKeyword: ISyntaxToken, moduleName: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
            return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken);
        }
        functionDeclaration(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, functionKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
            return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
        }
        variableStatement(exportKeyword: ISyntaxToken, declareKeyword: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax {
            return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
        }
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
            return new VariableDeclarationSyntax(varKeyword, variableDeclarators);
        }
        variableDeclarator(identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
            return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
        }
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax {
            return new EqualsValueClauseSyntax(equalsToken, value);
        }
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
            return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand);
        }
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
            return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken);
        }
        omittedExpression(): OmittedExpressionSyntax {
            return new OmittedExpressionSyntax();
        }
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
            return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
        }
        arrowFunctionExpression(): ArrowFunctionExpressionSyntax {
            return new ArrowFunctionExpressionSyntax();
        }
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body);
        }
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
        }
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax {
            return new QualifiedNameSyntax(left, dotToken, right);
        }
        constructorType(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax {
            return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type);
        }
        functionType(parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax {
            return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type);
        }
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken);
        }
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
        }
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax {
            return new TypeAnnotationSyntax(colonToken, type);
        }
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax {
            return new BlockSyntax(openBraceToken, statements, closeBraceToken);
        }
        parameter(dotDotDotToken: ISyntaxToken, publicOrPrivateKeyword: ISyntaxToken, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
            return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause);
        }
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, identifierName: ISyntaxToken): MemberAccessExpressionSyntax {
            return new MemberAccessExpressionSyntax(expression, dotToken, identifierName);
        }
        postfixUnaryExpression(kind: SyntaxKind, operand: IExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
            return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken);
        }
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
            return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
        }
        invocationExpression(expression: IExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
            return new InvocationExpressionSyntax(expression, argumentList);
        }
        argumentList(openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax {
            return new ArgumentListSyntax(openParenToken, _arguments, closeParenToken);
        }
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right);
        }
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse);
        }
        typeMember(): TypeMemberSyntax {
            return new TypeMemberSyntax();
        }
        constructSignature(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax {
            return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
        }
        functionSignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax {
            return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
        }
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
            return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
        }
        propertySignature(identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
            return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
        }
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax {
            return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
        }
        callSignature(parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
            return new CallSignatureSyntax(parameterList, typeAnnotation);
        }
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax {
            return new ElseClauseSyntax(elseKeyword, statement);
        }
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax {
            return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
        }
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
            return new ExpressionStatementSyntax(expression, semicolonToken);
        }
        constructorDeclaration(constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
            return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
        }
        memberFunctionDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, functionSignature: FunctionSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
            return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken);
        }
        memberAccessorDeclaration(): MemberAccessorDeclarationSyntax {
            return new MemberAccessorDeclarationSyntax();
        }
        getMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, getKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
            return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
        }
        setMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, setKeyword: ISyntaxToken, identifier: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
            return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
        }
        memberVariableDeclaration(publicOrPrivateKeyword: ISyntaxToken, staticKeyword: ISyntaxToken, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
            return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken);
        }
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax {
            return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
        }
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax {
            return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
        }
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
            return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
        }
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
            return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken);
        }
        switchClause(): SwitchClauseSyntax {
            return new SwitchClauseSyntax();
        }
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax {
            return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
        }
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax {
            return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
        }
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax {
            return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken);
        }
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax {
            return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken);
        }
        iterationStatement(): IterationStatementSyntax {
            return new IterationStatementSyntax();
        }
        baseForStatement(): BaseForStatementSyntax {
            return new BaseForStatementSyntax();
        }
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax {
            return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
        }
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax {
            return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement);
        }
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax {
            return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
        }
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax {
            return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement);
        }
        enumDeclaration(exportKeyword: ISyntaxToken, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken);
        }
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
        }
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken);
        }
        propertyAssignment(): PropertyAssignmentSyntax {
            return new PropertyAssignmentSyntax();
        }
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
        }
        accessorPropertyAssignment(): AccessorPropertyAssignmentSyntax {
            return new AccessorPropertyAssignmentSyntax();
        }
        getAccessorPropertyAssignment(getKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
            return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
        }
        setAccessorPropertyAssignment(setKeyword: ISyntaxToken, propertyName: ISyntaxToken, openParenToken: ISyntaxToken, parameterName: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
            return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
        }
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax {
            return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
        }
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
            return new EmptyStatementSyntax(semicolonToken);
        }
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax {
            return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause);
        }
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax {
            return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
        }
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax {
            return new FinallyClauseSyntax(finallyKeyword, block);
        }
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatement {
            return new LabeledStatement(identifier, colonToken, statement);
        }
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax {
            return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
        }
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IExpressionSyntax): TypeOfExpressionSyntax {
            return new TypeOfExpressionSyntax(typeOfKeyword, expression);
        }
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IExpressionSyntax): DeleteExpressionSyntax {
            return new DeleteExpressionSyntax(deleteKeyword, expression);
        }
        voidExpression(voidKeyword: ISyntaxToken, expression: IExpressionSyntax): VoidExpressionSyntax {
            return new VoidExpressionSyntax(voidKeyword, expression);
        }
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
            return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken);
        }
    }

    export var normalModeFactory: IFactory = new NormalModeFactory();
}