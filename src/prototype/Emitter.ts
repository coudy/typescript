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
            SyntaxToken.createElastic({ leadingTrivia: functionExpression.functionKeyword().leadingTrivia().toArray(), kind: SyntaxKind.OpenParenToken }),
            newFunctionExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }));

        return rewritten.withExpression(parenthesizedExpression);
    }

    private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FunctionExpressionSyntax {
        var identifier = node.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                          .withTrailingTrivia(SyntaxTriviaList.empty);

        var block = this.convertArrowFunctionBody(node);

        return FunctionExpressionSyntax.create(
            SyntaxToken.createElastic({ leadingTrivia: node.identifier().leadingTrivia().toArray(), kind: SyntaxKind.FunctionKeyword}),
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
            <ExpressionSyntax>parameter.equalsValueClause().value().clone());
        
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
        identifier = identifier.withLeadingTrivia(node.firstToken().leadingTrivia())
                               .withTrailingTrivia(node.lastToken().trailingTrivia());

        return ParameterSyntax.create(identifier);
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

        // We're generating FunctionDeclaration at column 0.  So we need to offset the block 
        // backward to be at that column as well.
        var block = constructorDeclaration.block().accept1(this);

        //block = <BlockSyntax>this.changeIndentation(
        //    block,
        //    this.syntaxInformationMap.isFirstTokenInLine(constructorDeclaration.block().firstToken()),
        //    -Indentation.columnForStartOfToken(constructorDeclaration.firstToken(), this.syntaxInformationMap, this.options),
        //    /*minimumColumn:*/ 0);

        var defaultValueAssignments = <StatementSyntax[]>ArrayUtilities.select(
            Emitter.parameterListDefaultParameters(constructorDeclaration.parameterList()),
            p => this.generateDefaultValueAssignmentStatement(p));

        var statements:StatementSyntax[] = block.statements().toArray();
        var constructorIndentationColumn = Indentation.columnForStartOfToken(
            constructorDeclaration.firstToken(), this.syntaxInformationMap, this.options);

        for (var i = defaultValueAssignments.length - 1; i >= 0; i--) {
            //var assignment = <StatementSyntax>this.changeIndentation(
            //    defaultValueAssignments[i], /*changeFirstToken:*/ true, this.options.indentSpaces);
            var assignment = defaultValueAssignments[i];
            assignment = <StatementSyntax>this.changeIndentation(
                assignment, /*changeFirstToken:*/ true, this.options.indentSpaces + constructorIndentationColumn);
            statements.unshift(assignment);
        }

        block = block.withStatements(SyntaxList.create(statements));

        var functionDeclaration = new FunctionDeclarationSyntax(null, null,
            SyntaxToken.createElastic({ leadingTrivia: constructorDeclaration.firstToken().leadingTrivia().toArray(),
                                        kind: SyntaxKind.FunctionKeyword,
                                        trailingTrivia: [SyntaxTrivia.space] }),
            functionSignature,
            block, null);

        return functionDeclaration;
    }

    private visitClassDeclaration(node: ClassDeclarationSyntax): VariableStatementSyntax {
        var identifier = node.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                          .withTrailingTrivia(SyntaxTriviaList.empty);
        
        var statements: StatementSyntax[] = [];

        var constructorFunctionDeclaration = this.convertConstructorDeclaration(node,
            ArrayUtilities.firstOrDefault(node.classElements().toArray(), c => c.kind() === SyntaxKind.ConstructorDeclaration));

        if (constructorFunctionDeclaration !== null) {
            //constructorFunctionDeclaration = <FunctionDeclarationSyntax>this.changeIndentation(
            //    constructorFunctionDeclaration, /*changeFirstToken:*/ true, this.options.indentSpaces);
            statements.push(constructorFunctionDeclaration)
        }

        var returnIndentation = Indentation.indentationTrivia(
            this.options.indentSpaces + Indentation.columnForStartOfToken(node.firstToken(), this.syntaxInformationMap, this.options),
            this.options);
        
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

        var callSignature = CallSignatureSyntax.create(
            ParameterListSyntax.create(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space] })));

        var functionExpression = FunctionExpressionSyntax.create(
            SyntaxToken.createElastic({ kind: SyntaxKind.FunctionKeyword }),
            callSignature,
            block);

        var parenthesizedExpression = new ParenthesizedExpressionSyntax(
            SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
            functionExpression,
            SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken }));

        var invocationExpression = new InvocationExpressionSyntax(
            parenthesizedExpression,
            ArgumentListSyntax.create(
                SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken })));

        var variableDeclarator = new VariableDeclaratorSyntax(
            identifier.withTrailingTrivia(SyntaxTriviaList.space),
            null,
            new EqualsValueClauseSyntax(
                SyntaxToken.createElastic({ kind: SyntaxKind.EqualsToken, trailingTrivia: [SyntaxTrivia.space] }),
                invocationExpression));

        var variableDeclaration = new VariableDeclarationSyntax(
            SyntaxToken.createElastic({ leadingTrivia: node.firstToken().leadingTrivia().toArray(),
                                        kind: SyntaxKind.VarKeyword,
                                        trailingTrivia: [SyntaxTrivia.space] }),
            SeparatedSyntaxList.create([ variableDeclarator ]));

        var variableStatement = VariableStatementSyntax.create(
            variableDeclaration,
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        var indentationColumn = Indentation.columnForStartOfToken(node.firstToken(), this.syntaxInformationMap, this.options);
        //variableStatement = <VariableStatementSyntax>this.changeIndentation(
        //    variableStatement, /*changeFirstToken:*/ false, indentationColumn);

        return variableStatement;
    }
    
    //private visitTypeAnnotation(node: TypeAnnotationSyntax): TypeAnnotationSyntax {
    //    // TODO: it's unlikely that a type annotation would have comments on them.  But if it does,
    //    // transfer it to the surrounding construct.
    //    return null;
    //}
}