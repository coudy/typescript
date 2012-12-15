///<reference path='References.ts' />

class Emitter extends SyntaxRewriter {
    private syntaxInformationMap: SyntaxInformationMap;
    private options: FormattingOptions;

    constructor(syntaxInformationMap: SyntaxInformationMap,
                options: FormattingOptions) {
        super();

        this.syntaxInformationMap = syntaxInformationMap;
        this.options = options || FormattingOptions.defaultOptions;
    }
    
    public static emit(input: SourceUnitSyntax, options: FormattingOptions = null): SourceUnitSyntax {
        SyntaxNodeInvariantsChecker.checkInvariants(input);
        var emitter = new Emitter(SyntaxInformationMap.create(input), options);

        var output = <SourceUnitSyntax>input.accept1(emitter);
        SyntaxNodeInvariantsChecker.checkInvariants(output);

        return output;
    }

    private visitSourceUnit(node: SourceUnitSyntax): SourceUnitSyntax {
        var moduleElements: ModuleElementSyntax[] = [];

        for (var i = 0, n = node.moduleElements().count(); i < n; i++) {
            var moduleElement = node.moduleElements().syntaxNodeAt(i);

            var converted = this.visitNode(moduleElement);
            if (ArrayUtilities.isArray(converted)) {
                moduleElements.push.apply(moduleElements, converted);
            }
            else {
                moduleElements.push(<ModuleElementSyntax>converted);
            }
        }

        return new SourceUnitSyntax(SyntaxList.create(moduleElements), node.endOfFileToken());
    }

    private static leftmostName(name: NameSyntax): IdentifierNameSyntax {
        if (name.kind() === SyntaxKind.IdentifierName) {
            return <IdentifierNameSyntax>name;
        }
        else if (name.kind() === SyntaxKind.QualifiedName) {
            return Emitter.leftmostName((<QualifiedNameSyntax>name).left());
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private static splitModuleName(name: NameSyntax): IdentifierNameSyntax[] {
        var result: IdentifierNameSyntax[] = [];
        while (true) {
            if (name.kind() === SyntaxKind.IdentifierName) {
                result.unshift(<IdentifierNameSyntax>name);
                return result;
            }
            else if (name.kind() === SyntaxKind.QualifiedName) {
                var qualifiedName = <QualifiedNameSyntax>name;
                result.unshift(qualifiedName.right());
                name = qualifiedName.left();
            }
            else {
                throw Errors.invalidOperation();
            }
        }
    }

    private adjustListIndentation(nodes: SyntaxNode[]): SyntaxNode[] {
        // TODO: determine if we should actually indent the first token or not.
        return SyntaxIndenter.indentNodes(nodes, /*indentFirstToken:*/ true, this.options.indentSpaces, this.options);
    }

    private visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleElementSyntax[] {
        // Break up the dotted name into pieces.
        var names = Emitter.splitModuleName(node.moduleName());

        // Start with the rightmost piece.  This will be the one that actually contains the 
        // members declared in the module.

        // Recurse downwards and get the rewritten children.
        var moduleElements: ModuleElementSyntax[] = <ModuleElementSyntax[]>node.moduleElements().toArray();
        moduleElements = ArrayUtilities.select(moduleElements, m => this.visitNode(m));

        // Then, for all the names left of that name, wrap what we've created in a larger module.
        for (var nameIndex = names.length - 1; nameIndex >= 0; nameIndex--) {
            moduleElements = this.convertModuleDeclaration(names[nameIndex], moduleElements);

            if (nameIndex > 0) {
                // We're popping out and generate each outer module.  As we do so, we have to
                // indent whatever we've created so far appropriately.
                moduleElements = <ModuleElementSyntax[]>this.adjustListIndentation(moduleElements);
            }
        }

        return moduleElements;
    }

    private convertModuleDeclaration(name: IdentifierNameSyntax, moduleElements: ModuleElementSyntax[]): ModuleElementSyntax[] {
        name = name.withIdentifier(
            name.identifier().withLeadingTrivia(SyntaxTriviaList.empty).withTrailingTrivia(SyntaxTriviaList.empty));

        var variableStatement = VariableStatementSyntax.create(
            new VariableDeclarationSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.VarKeyword, trailingTrivia: [SyntaxTrivia.space] }),
                SeparatedSyntaxList.create(
                    [VariableDeclaratorSyntax.create(name.identifier().clone())])),
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        var functionExpression = FunctionExpressionSyntax.create(
            SyntaxToken.createElastic({ kind: SyntaxKind.FunctionKeyword }),
            CallSignatureSyntax.create(
                new ParameterListSyntax(
                    SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                    SeparatedSyntaxList.create([
                        ParameterSyntax.create(name.identifier().clone())]),
                    SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space]  }))),
            new BlockSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenBraceToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed]  }),
                SyntaxList.create(moduleElements),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseBraceToken })));

        var parenthesizedFunctionExpression = new ParenthesizedExpressionSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
            functionExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }));
        
        var logicalOrExpression = new BinaryExpressionSyntax(
            SyntaxKind.LogicalOrExpression,
            <IdentifierNameSyntax>name.clone(),
            SyntaxToken.createElastic({ kind: SyntaxKind.BarBarToken }),
            new ParenthesizedExpressionSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                new BinaryExpressionSyntax(
                    SyntaxKind.AssignmentExpression,
                    <IdentifierNameSyntax>name.clone(),
                    SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken }),
                    new ObjectLiteralExpressionSyntax(
                        SyntaxToken.createElastic({ kind: SyntaxKind.OpenBraceToken }),
                        SeparatedSyntaxList.empty,
                        SyntaxToken.createElastic({ kind: SyntaxKind.CloseBraceToken })
                    )),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken })));

        var invocationExpression = new InvocationExpressionSyntax(
            parenthesizedFunctionExpression,
            new ArgumentListSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                SeparatedSyntaxList.create([logicalOrExpression]),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken })));

        var expressionStatement = new ExpressionStatementSyntax(
            invocationExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        return [variableStatement, expressionStatement];
    }

    private visitExpressionStatement(node: ExpressionStatementSyntax): ExpressionStatementSyntax {
        // Can't have an expression statement with an anonymous function expression in it.
        var rewritten = <ExpressionStatementSyntax>super.visitExpressionStatement(node);
        
        if (rewritten.expression().kind() !== SyntaxKind.FunctionExpression) {
            // Wasn't a function expression
            return rewritten;
        }

        var functionExpression = <FunctionExpressionSyntax>rewritten.expression();
        if (functionExpression.identifier() !== null) {
            // Wasn't anonymous.
            return rewritten;
        }

        // Remove the leading trivia from the function keyword.  We'll put it on the open paren 
        // token instead.
        var newFunctionExpression = functionExpression.withFunctionKeyword(
            functionExpression.functionKeyword().withLeadingTrivia(SyntaxTriviaList.empty));

        // Now, wrap the function expression in parens to make it legal in javascript.
        var parenthesizedExpression = new ParenthesizedExpressionSyntax(
            SyntaxToken.createElastic({ leadingTrivia: functionExpression.leadingTrivia().toArray(), kind: SyntaxKind.OpenParenToken }),
            newFunctionExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }));

        return rewritten.withExpression(parenthesizedExpression);
    }

    private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FunctionExpressionSyntax {
        var identifier = node.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                          .withTrailingTrivia(SyntaxTriviaList.empty);

        var block = this.convertArrowFunctionBody(node);

        return FunctionExpressionSyntax.create(
            SyntaxToken.createElastic({ leadingTrivia: node.leadingTrivia().toArray(), kind: SyntaxKind.FunctionKeyword}),
            CallSignatureSyntax.create(
                new ParameterListSyntax(
                    SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                    SeparatedSyntaxList.create([ParameterSyntax.create(identifier)]),
                    SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space] }))),
            block);
    }

    private changeIndentation(node: SyntaxNode,
                              changeFirstToken: bool,
                              indentAmount: number,
                              minimumColumn = this.options.indentSpaces): SyntaxNode {
        if (indentAmount === 0) {
            return node;
        }
        else if (indentAmount > 0) {
            return SyntaxIndenter.indentNode(
                node,
                /*indentFirstToken:*/ changeFirstToken,
                /*indentAmount:*/ indentAmount,
                this.options);
        }
        else {
            // Dedent the node.  But don't allow it go before the minimum indent amount.
            return SyntaxDedenter.dedentNode(
                node,
                /*dedentFirstToken:*/ changeFirstToken,
                /*dedentAmount:*/-indentAmount,
                /*minimumColumn:*/minimumColumn,
                this.options);
        }
    }

    private convertArrowFunctionBody(arrowFunction: ArrowFunctionExpressionSyntax): BlockSyntax {
        var rewrittenBody = this.visitNode(arrowFunction.body());

        if (rewrittenBody.kind() === SyntaxKind.Block) {
            return <BlockSyntax>rewrittenBody;
        }

        var arrowToken = arrowFunction.equalsGreaterThanToken();

        // first, attach the expression to the return statement
        var returnStatement = new ReturnStatementSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.ReturnKeyword, trailingTrivia: arrowToken.trailingTrivia().toArray() }),
            <ExpressionSyntax>rewrittenBody,
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        // We want to adjust the indentation of the expression so that is aligns as it 
        // did before.  For example, if we started with:
        //
        //          a => foo().bar()
        //                    .baz()
        //
        // Then we want to end up with:
        //
        //          return foo().bar()
        //                      .baz()
        //
        // To do this we look at where the previous token (=>) used to end and where the new pevious
        // token (return) ends.  The difference (in this case '2') is our offset.

        var difference = 0;
        if (arrowToken.hasTrailingNewLineTrivia()) {
            // The expression is on the next line.  i.e. 
            //
            //      foo =>
            //          expr
            //
            // So we want it to immediately follow the return statement. i.e.:
            //
            //      return
            //          expr;
            //
            // and we adjust based on the column difference between the start of the arrow function
            // and the start of the expr.
            var arrowFunctionStart = Indentation.columnForStartOfToken(arrowFunction.firstToken(), this.syntaxInformationMap, this.options);
            // var expressionStart = Indentation.columnForStartOfToken(arrowFunction.body().firstToken(), this.syntaxInformationMap, this.options);
            // var originalOffset = expressionStart - arrowFunctionStart;
            difference = -arrowFunctionStart;
        }
        else {
            // the expression immediately follows the arrow. i.e.:
            //
            //      foo => expr
            //
            // So we want it to immediately follow the return statement. i.e.:
            //
            //      return expr;
            //
            // and we adjust based on the column difference between the end of the arrow token and 
            // the end of the return statement.
            var arrowEndColumn = Indentation.columnForEndOfToken(arrowToken, this.syntaxInformationMap, this.options);
            var returnKeywordEndColumn = returnStatement.returnKeyword().width();
            difference = returnKeywordEndColumn - arrowEndColumn;
        }

        returnStatement = <ReturnStatementSyntax>this.changeIndentation(
            returnStatement, /*changeFirstToken:*/ false, difference);

        // Next, indent the return statement.  It's going in a block, so it needs to be properly
        // indented.  Note we do this *after* we've ensured the expression aligns properly.

        returnStatement = <ReturnStatementSyntax>SyntaxIndenter.indentNode(
            returnStatement, /*indentFirstToken:*/ true, this.options.indentSpaces, this.options);

        // Now wrap the return statement in a block.
        var block = new BlockSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenBraceToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }),
            SyntaxList.create([returnStatement]),
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseBraceToken }));

        // Note: if we started with something like:
        //
        //      var v = a => 1;
        //
        // Then we want to convert that to:
        //
        //      var v = function(a) {
        //          return 1;
        //      };
        //
        // However, right now what we've created is:
        //
        // {
        //     return 1;
        // }
        //
        // So we need to indent the block with our current column indent so that it aligns with the
        // parent structure.  Note: we don't wan to adjust the leading brace as that's going to go
        // after the function sigature.

        block = <BlockSyntax>SyntaxIndenter.indentNode(block, /*indentFirstToken:*/ false,
            Indentation.columnForStartOfFirstTokenInLineContainingToken(
                arrowFunction.firstToken(), this.syntaxInformationMap, this.options), this.options);
        return block;
    }

    private static functionSignatureDefaultParameters(signature: FunctionSignatureSyntax): ParameterSyntax[] {
        return Emitter.parameterListDefaultParameters(signature.parameterList());
    }

    private static parameterListDefaultParameters(parameterList: ParameterListSyntax): ParameterSyntax[] {
        return Emitter.parametersDefaultParameters(parameterList.parameters());
    }

    private static parameterListPropertyParameters(parameterList: ParameterListSyntax): ParameterSyntax[] {
        return Emitter.parametersPropertyParameters(parameterList.parameters());
    }

    private static parametersDefaultParameters(list: ISeparatedSyntaxList): ParameterSyntax[] {
        var result: ParameterSyntax[] = [];
        for (var i = 0, n = list.syntaxNodeCount(); i < n; i++) {
            var parameter = <ParameterSyntax>list.syntaxNodeAt(i);

            if (parameter.equalsValueClause() !== null) {
                result.push(parameter);
            }
        }

        return result;
    }

    private static parametersPropertyParameters(list: ISeparatedSyntaxList): ParameterSyntax[] {
        var result: ParameterSyntax[] = [];
        for (var i = 0, n = list.syntaxNodeCount(); i < n; i++) {
            var parameter = <ParameterSyntax>list.syntaxNodeAt(i);

            if (parameter.publicOrPrivateKeyword() !== null) {
                result.push(parameter);
            }
        }

        return result;
    }

    private generatePropertyAssignmentStatement(parameter: ParameterSyntax): ExpressionStatementSyntax {
        var identifier = parameter.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                               .withTrailingTrivia(SyntaxTriviaList.empty);

        return new ExpressionStatementSyntax(
            new BinaryExpressionSyntax(
                SyntaxKind.AssignmentExpression,
                new MemberAccessExpressionSyntax(
                    new ThisExpressionSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.ThisKeyword })),
                    SyntaxToken.createElastic({ kind: SyntaxKind.DotToken }),
                    new IdentifierNameSyntax(identifier.withTrailingTrivia(SyntaxTriviaList.space))),
                SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
                new IdentifierNameSyntax(identifier.clone())),
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));
    }

    private generateDefaultValueAssignmentStatement(parameter: ParameterSyntax): IfStatementSyntax {
        var space = SyntaxTriviaList.create([SyntaxTrivia.space]);
        var name = parameter.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                         .withTrailingTrivia(space);
        var identifierName = new IdentifierNameSyntax(name);

        var condition = new BinaryExpressionSyntax(
                SyntaxKind.EqualsExpression,
                new TypeOfExpressionSyntax(
                    SyntaxToken.createElastic({ kind: SyntaxKind.TypeOfKeyword, trailingTrivia: [SyntaxTrivia.space] }),
                    <IdentifierNameSyntax>identifierName.clone()),
                SyntaxToken.createElastic({ kind: SyntaxKind.EqualsEqualsEqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
                new LiteralExpressionSyntax(
                    SyntaxKind.StringLiteralExpression,
                    SyntaxToken.createElastic({ kind: SyntaxKind.StringLiteral, text: '"undefined"' })));

        var assignment = new BinaryExpressionSyntax(
            SyntaxKind.AssignmentExpression,
            <IdentifierNameSyntax>identifierName.clone(),
            SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
            <ExpressionSyntax>parameter.equalsValueClause().value().accept1(this).clone());
        
        var assignmentStatement = new ExpressionStatementSyntax(
            assignment,
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.space] }));

        var block = new BlockSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenBraceToken, trailingTrivia: [SyntaxTrivia.space] }),
            SyntaxList.create([assignmentStatement]),
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseBraceToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        return new IfStatementSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.IfKeyword, trailingTrivia: [SyntaxTrivia.space] }),
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
            condition,
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space] }),
            block, null);
    }

    private visitFunctionDeclaration(node: FunctionDeclarationSyntax): FunctionDeclarationSyntax {
        if (node.block() === null) {
            // Function overloads aren't emitted.
            return null;
        }

        var rewritten = <FunctionDeclarationSyntax>super.visitFunctionDeclaration(node);
        var parametersWithDefaults = Emitter.functionSignatureDefaultParameters(node.functionSignature());

        if (parametersWithDefaults.length === 0) {
            return rewritten;
        }

        var defaultValueAssignmentStatements = ArrayUtilities.select(
            parametersWithDefaults, p => this.generateDefaultValueAssignmentStatement(p));

        var functionDeclarationStartColumn = Indentation.columnForStartOfToken(
            node.firstToken(), this.syntaxInformationMap, this.options);
        var desiredColumn = functionDeclarationStartColumn + this.options.indentSpaces;

        defaultValueAssignmentStatements = ArrayUtilities.select(defaultValueAssignmentStatements,
            s => SyntaxIndenter.indentNode(s, /*indentFirstToken:*/ true, desiredColumn, this.options));

        var statements: StatementSyntax[] = [];
        statements.push.apply(statements, defaultValueAssignmentStatements);
        statements.push.apply(statements, rewritten.block().statements().toArray());

        // TODO: remove export/declare keywords.
        return rewritten.withBlock(rewritten.block().withStatements(
            SyntaxList.create(statements)));
    }

    public visitParameter(node: ParameterSyntax): ParameterSyntax {
        // transfer the trivia from the first token to the the identifier.
        var identifier = node.identifier();
        identifier = identifier.withLeadingTrivia(node.leadingTrivia())
                               .withTrailingTrivia(node.trailingTrivia());

        return ParameterSyntax.create(identifier);
    }

    private generatePropertyAssignment(classDeclaration: ClassDeclarationSyntax,
                                       static: bool,
                                       memberDeclaration: MemberVariableDeclarationSyntax): ExpressionStatementSyntax {
        var isStatic = memberDeclaration.staticKeyword() !== null;
        if ((static && !isStatic) ||
            (!static && isStatic)) {
            return null;
        }

        var declarator = memberDeclaration.variableDeclarator();
        if (declarator.equalsValueClause() === null) {
            return null;
        }

        var classIdentifier = classDeclaration.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                                           .withTrailingTrivia(SyntaxTriviaList.empty);
        var memberIdentifier = declarator.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                                      .withTrailingTrivia(SyntaxTriviaList.empty);

        var receiver = static
            ? <ExpressionSyntax>new IdentifierNameSyntax(classIdentifier.withLeadingTrivia(memberDeclaration.leadingTrivia()))
            : new ThisExpressionSyntax(SyntaxToken.createElastic({ leadingTrivia: memberDeclaration.leadingTrivia().toArray(), kind: SyntaxKind.ThisKeyword }));

        receiver = new MemberAccessExpressionSyntax(
            receiver,
            SyntaxToken.createElastic({ kind: SyntaxKind.DotToken }),
            new IdentifierNameSyntax(memberIdentifier.withTrailingTrivia(SyntaxTriviaList.space)));

        var statement = new ExpressionStatementSyntax(
            new BinaryExpressionSyntax(
                SyntaxKind.AssignmentExpression,
                receiver,
                SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
                <ExpressionSyntax>declarator.equalsValueClause().value().accept1(this)),
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        return statement;
    }

    private generatePropertyAssignments(classDeclaration: ClassDeclarationSyntax,
                                        static: bool): ExpressionStatementSyntax[] {
        var result: ExpressionStatementSyntax[] = [];

        // TODO: handle alignment here.
        for (var i = classDeclaration.classElements().count() - 1; i >= 0; i--) {
            var classElement = classDeclaration.classElements().syntaxNodeAt(i);

            if (classElement.kind() !== SyntaxKind.MemberVariableDeclaration) {
                continue;
            }

            var statement = this.generatePropertyAssignment(
                classDeclaration, static, <MemberVariableDeclarationSyntax>classElement);
            if (statement !== null) {
                result.push(statement);
            }
        }
        
        return result;
    }

    private createDefaultConstructorDeclaration(classDeclaration: ClassDeclarationSyntax): FunctionDeclarationSyntax {
        var identifier = classDeclaration.identifier()
                                         .withLeadingTrivia(SyntaxTriviaList.empty)
                                         .withTrailingTrivia(SyntaxTriviaList.empty);

        var functionSignature = FunctionSignatureSyntax.create(
            identifier.clone(),
            ParameterListSyntax.create(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space] })));

        var statements: StatementSyntax[] = [];
        if (classDeclaration.extendsClause() !== null) {
            var superStatement = new ExpressionStatementSyntax(
                new InvocationExpressionSyntax(
                    new MemberAccessExpressionSyntax(
                        new IdentifierNameSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "_super" })),
                        SyntaxToken.createElastic({ kind: SyntaxKind.DotToken }),
                        new IdentifierNameSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "apply" }))),
                    new ArgumentListSyntax(
                        SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                        SeparatedSyntaxList.create([
                            new ThisExpressionSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.ThisKeyword })),
                            SyntaxToken.createElastic({ kind: SyntaxKind.CommaToken, trailingTrivia: [SyntaxTrivia.space] }),
                            new IdentifierNameSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "arguments" }))]),
                        SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }))),
                SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

            superStatement = <ExpressionStatementSyntax>SyntaxIndenter.indentNode(
                superStatement, /*indentFirstToken:*/ true, this.options.indentSpaces, this.options);
            statements.push(superStatement);
        }

        var block = new BlockSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenBraceToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }),
            SyntaxList.create(statements),
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseBraceToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        var functionDeclaration = new FunctionDeclarationSyntax(null, null,
            SyntaxToken.createElastic({ kind: SyntaxKind.FunctionKeyword, trailingTrivia: [SyntaxTriviaList.space] }),
            functionSignature,
            block, null);

        var classIndentation = Indentation.columnForStartOfToken(
            classDeclaration.firstToken(), this.syntaxInformationMap, this.options);

        return <FunctionDeclarationSyntax>SyntaxIndenter.indentNode(
            functionDeclaration, /*indentFirstToken:*/ true, this.options.indentSpaces + classIndentation, this.options);
    }

    private convertConstructorDeclaration(classDeclaration: ClassDeclarationSyntax,
                                          constructorDeclaration: ConstructorDeclarationSyntax): FunctionDeclarationSyntax {
        if (constructorDeclaration === null ||
            constructorDeclaration.block() === null) {
            return null;
        }

        var identifier = classDeclaration.identifier()
                                         .withLeadingTrivia(SyntaxTriviaList.empty)
                                         .withTrailingTrivia(SyntaxTriviaList.empty);

        var functionSignature = FunctionSignatureSyntax.create(
            identifier.clone(),
            constructorDeclaration.parameterList().accept1(this));

        var block = constructorDeclaration.block().accept1(this);

        var statements:StatementSyntax[] = block.statements().toArray();

        var constructorIndentationColumn = Indentation.columnForStartOfToken(
            constructorDeclaration.firstToken(), this.syntaxInformationMap, this.options);

        // TODO: handle alignment here.
        var instanceAssignments = this.generatePropertyAssignments(
            classDeclaration, /*static:*/ false);

        for (var i = instanceAssignments.length - 1; i >= 0; i--) {
            var expressionStatement = instanceAssignments[i];
            expressionStatement = <ExpressionStatementSyntax>this.changeIndentation(
                expressionStatement, /*changeFirstToken:*/ true, this.options.indentSpaces);
            statements.unshift(expressionStatement);
        }

        var parameterPropertyAssignments = <ExpressionStatementSyntax[]>ArrayUtilities.select(
            Emitter.parameterListPropertyParameters(constructorDeclaration.parameterList()),
            p => this.generatePropertyAssignmentStatement(p));

        for (var i = parameterPropertyAssignments.length - 1; i >= 0; i--) {
            var expressionStatement = parameterPropertyAssignments[i];
            expressionStatement = <ExpressionStatementSyntax>this.changeIndentation(
                expressionStatement, /*changeFirstToken:*/ true, this.options.indentSpaces + constructorIndentationColumn);
            statements.unshift(expressionStatement);
        }

        var defaultValueAssignments = <ExpressionStatementSyntax[]>ArrayUtilities.select(
            Emitter.parameterListDefaultParameters(constructorDeclaration.parameterList()),
            p => this.generateDefaultValueAssignmentStatement(p));

        for (var i = defaultValueAssignments.length - 1; i >= 0; i--) {
            var expressionStatement = defaultValueAssignments[i];
            expressionStatement = <ExpressionStatementSyntax>this.changeIndentation(
                expressionStatement, /*changeFirstToken:*/ true, this.options.indentSpaces + constructorIndentationColumn);
            statements.unshift(expressionStatement);
        }

        block = block.withStatements(SyntaxList.create(statements));

        var functionDeclaration = new FunctionDeclarationSyntax(null, null,
            SyntaxToken.createElastic({ leadingTrivia: constructorDeclaration.leadingTrivia().toArray(),
                                        kind: SyntaxKind.FunctionKeyword,
                                        trailingTrivia: [SyntaxTrivia.space] }),
            functionSignature,
            block, null);

        return functionDeclaration;
    }

    private convertMemberFunctionDeclaration(classDeclaration: ClassDeclarationSyntax,
                                             functionDeclaration: MemberFunctionDeclarationSyntax): ExpressionStatementSyntax {
        if (functionDeclaration.block() === null) {
            return null;
        }

        var classIdentifier = classDeclaration.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                                           .withTrailingTrivia(SyntaxTriviaList.empty);
        var functionIdentifier = functionDeclaration.functionSignature()
                                                    .identifier()
                                                    .withLeadingTrivia(SyntaxTriviaList.empty)
                                                    .withTrailingTrivia(SyntaxTriviaList.empty);

        var receiver: ExpressionSyntax = new IdentifierNameSyntax(
            classIdentifier.withLeadingTrivia(functionDeclaration.leadingTrivia()));
         
        receiver = functionDeclaration.staticKeyword() !== null
            ? receiver
            : new MemberAccessExpressionSyntax(
                receiver,
                SyntaxToken.createElastic({ kind: SyntaxKind.DotToken }),
                new IdentifierNameSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "prototype" })));

        receiver = new MemberAccessExpressionSyntax(
            receiver,
            SyntaxToken.createElastic({ kind: SyntaxKind.DotToken }),
            new IdentifierNameSyntax(functionIdentifier.withTrailingTrivia(SyntaxTriviaList.space)));

        var block = <BlockSyntax>functionDeclaration.block().accept1(this);
        var blockTrailingTrivia = block.trailingTrivia();

        block = block.withCloseBraceToken(
            block.closeBraceToken().withTrailingTrivia(SyntaxTriviaList.empty));
        
        var defaultParameters = Emitter.functionSignatureDefaultParameters(functionDeclaration.functionSignature());
        var defaultValueAssignments = <StatementSyntax[]>ArrayUtilities.select(defaultParameters,
            p => this.generateDefaultValueAssignmentStatement(p));

        var functionColumn = Indentation.columnForStartOfToken(
            functionDeclaration.firstToken(), this.syntaxInformationMap, this.options);

        var blockStatements = block.statements().toArray();
        for (var i = defaultValueAssignments.length - 1; i >= 0; i--) {
            var assignment = <StatementSyntax>this.changeIndentation(
                defaultValueAssignments[i], /*changeFirstToken:*/ true, functionColumn + this.options.indentSpaces, 0);

            blockStatements.unshift(assignment);
        }

        block = block.withStatements(SyntaxList.create(blockStatements));

        var callSignature = CallSignatureSyntax.create(
            <ParameterListSyntax>functionDeclaration.functionSignature().parameterList().accept1(this));

        var functionExpression = FunctionExpressionSyntax.create(
            SyntaxToken.createElastic({ kind: SyntaxKind.FunctionKeyword }),
            callSignature,
            block);

        var assignmentExpression = new BinaryExpressionSyntax(
            SyntaxKind.AssignmentExpression,
            receiver,
            SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
            functionExpression);

        return new ExpressionStatementSyntax(
            assignmentExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: blockTrailingTrivia.toArray() }));
    }

    private convertClassElements(classDeclaration: ClassDeclarationSyntax): StatementSyntax[] {
        var result: StatementSyntax[] = [];

        var classElements = classDeclaration.classElements();
        for (var i = 0, n = classElements.count(); i < n; i++) {
            var classElement = <ClassElementSyntax>classElements.syntaxNodeAt(i);
            if (classElement.kind() === SyntaxKind.ConstructorDeclaration) {
                continue;
            }

            if (classElement.kind() === SyntaxKind.MemberFunctionDeclaration) {
                var converted = this.convertMemberFunctionDeclaration(classDeclaration, <MemberFunctionDeclarationSyntax>classElement)
                if (converted !== null) {
                    result.push(converted);
                }
            }
            else if (classElement.kind() === SyntaxKind.MemberVariableDeclaration) {
                var converted = this.generatePropertyAssignment(classDeclaration, /*static:*/ true, <MemberVariableDeclarationSyntax>classElement);
                if (converted !== null) {
                    result.push(converted);
                }
            }
            else if (classElement.kind() === SyntaxKind.GetMemberAccessorDeclaration ||
                     classElement.kind() === SyntaxKind.SetMemberAccessorDeclaration) {
                // TODO: handle properties.
            }
        }

        return result;
    }

    private visitClassDeclaration(node: ClassDeclarationSyntax): VariableStatementSyntax {
        var identifier = node.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                          .withTrailingTrivia(SyntaxTriviaList.empty);
        
        var statements: StatementSyntax[] = [];

        if (node.extendsClause() !== null) {
            var extendsParameters = [];
            extendsParameters.push(new IdentifierNameSyntax(identifier.clone()));
            extendsParameters.push(SyntaxToken.createElastic({ kind: SyntaxKind.CommaToken, trailingTrivia: [SyntaxTrivia.space] }));
            extendsParameters.push(new IdentifierNameSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "_super" })));

            var extendsStatement = new ExpressionStatementSyntax(
                new InvocationExpressionSyntax(
                    new IdentifierNameSyntax(SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "__extends" })),
                    new ArgumentListSyntax(
                        SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                        SeparatedSyntaxList.create(extendsParameters),
                        SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }))),
                SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

            statements.push(<StatementSyntax>SyntaxIndenter.indentNode(
                extendsStatement, /*indentFirstToken:*/ true, this.options.indentSpaces, this.options));
        }

        var constructorDeclaration: ConstructorDeclarationSyntax =
            ArrayUtilities.firstOrDefault(node.classElements().toArray(), c => c.kind() === SyntaxKind.ConstructorDeclaration);

        var constructorFunctionDeclaration = constructorDeclaration === null
            ? this.createDefaultConstructorDeclaration(node)
            : this.convertConstructorDeclaration(node, constructorDeclaration);

        if (constructorFunctionDeclaration !== null) {
            statements.push(constructorFunctionDeclaration)
        }

        var statementIndent = this.options.indentSpaces + Indentation.columnForStartOfToken(
            node.firstToken(), this.syntaxInformationMap, this.options)

        var classElementStatements = this.convertClassElements(node);
        statements.push.apply(statements, classElementStatements);

        var returnIndentation = Indentation.indentationTrivia(statementIndent, this.options);
        
        var returnStatement = new ReturnStatementSyntax(
            SyntaxToken.createElastic({ leadingTrivia: [returnIndentation], kind: SyntaxKind.ReturnKeyword, trailingTrivia: [SyntaxTrivia.space] }),
            new IdentifierNameSyntax(identifier.clone()),
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        statements.push(returnStatement);

        var classIndentation = Indentation.columnForStartOfToken(node.firstToken(), this.syntaxInformationMap, this.options);
        var closeCurlyIndentation = classIndentation > 0
            ? [Indentation.indentationTrivia(classIndentation, this.options)]
            : null;

        var block = new BlockSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenBraceToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }),
            SyntaxList.create(statements),
            SyntaxToken.createElastic({ leadingTrivia: closeCurlyIndentation, kind: SyntaxKind.CloseBraceToken }));

        var callParameters = [];
        if (node.extendsClause() !== null) {
            callParameters.push(ParameterSyntax.create(
                SyntaxToken.createElastic({ kind: SyntaxKind.IdentifierNameToken, text: "_super" })));
        }

        var callSignature = CallSignatureSyntax.create(
            new ParameterListSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                SeparatedSyntaxList.create(callParameters),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space] })));

        var functionExpression = FunctionExpressionSyntax.create(
            SyntaxToken.createElastic({ kind: SyntaxKind.FunctionKeyword }),
            callSignature,
            block);

        var parenthesizedExpression = new ParenthesizedExpressionSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
            functionExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }));

        var invocationParameters = [];
        if (node.extendsClause() !== null && node.extendsClause().typeNames().count() > 0) {
            invocationParameters.push(node.extendsClause().typeNames().syntaxNodeAt(0)
                .withLeadingTrivia(SyntaxTriviaList.empty)
                .withTrailingTrivia(SyntaxTriviaList.empty));
        }

        var invocationExpression = new InvocationExpressionSyntax(
            parenthesizedExpression,
            new ArgumentListSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                SeparatedSyntaxList.create(invocationParameters),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken })));

        var variableDeclarator = new VariableDeclaratorSyntax(
            identifier.withTrailingTrivia(SyntaxTriviaList.space),
            null,
            new EqualsValueClauseSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
                invocationExpression));

        var variableDeclaration = new VariableDeclarationSyntax(
            SyntaxToken.createElastic({ leadingTrivia: node.leadingTrivia().toArray(),
                                        kind: SyntaxKind.VarKeyword,
                                        trailingTrivia: [SyntaxTrivia.space] }),
            SeparatedSyntaxList.create([ variableDeclarator ]));

        var variableStatement = VariableStatementSyntax.create(
            variableDeclaration,
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        var indentationColumn = Indentation.columnForStartOfToken(node.firstToken(), this.syntaxInformationMap, this.options);

        return variableStatement;
    }
    
    private visitVariableDeclarator(node: VariableDeclaratorSyntax): VariableDeclaratorSyntax {
        var result = super.visitVariableDeclarator(node);
        if (result.typeAnnotation() === null) {
            return result;
        }

        var newTrailingTrivia = result.identifier().trailingTrivia().concat(
            result.typeAnnotation().trailingTrivia());

        return result.withTypeAnnotation(null)
                     .withIdentifier(result.identifier().withTrailingTrivia(newTrailingTrivia));
    }

    private visitCastExpression(node: CastExpressionSyntax): ExpressionSyntax {
        var result = <CastExpressionSyntax>super.visitCastExpression(node);

        var subExpression = result.expression();
        var totalTrivia = result.leadingTrivia().concat(subExpression.leadingTrivia());

        subExpression = <UnaryExpressionSyntax>subExpression.replaceToken(
            subExpression.firstToken(), subExpression.firstToken().withLeadingTrivia(totalTrivia));

        return subExpression;
    }
}