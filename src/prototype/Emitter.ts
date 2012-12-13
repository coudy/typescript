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
                SyntaxToken.createElasticKeyword({ kind: SyntaxKind.VarKeyword, trailingTrivia: [SyntaxTrivia.space] }),
                SeparatedSyntaxList.create(
                    [VariableDeclaratorSyntax.create(name.identifier().clone())])),
            SyntaxToken.createElastic({ kind: SyntaxKind.SemicolonToken, trailingTrivia: [SyntaxTrivia.carriageReturnLineFeed] }));

        var functionExpression = FunctionExpressionSyntax.create(
            SyntaxToken.createElasticKeyword({ kind: SyntaxKind.FunctionKeyword }),
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
            SyntaxToken.createElasticKeyword({ leadingTrivia: node.identifier().leadingTrivia().toArray(), kind: SyntaxKind.FunctionKeyword}),
            CallSignatureSyntax.create(
                new ParameterListSyntax(
                    SyntaxToken.createElastic({ kind: SyntaxKind.OpenParenToken }),
                    SeparatedSyntaxList.create([ParameterSyntax.create(identifier)]),
                    SyntaxToken.createElastic({ kind: SyntaxKind.CloseParenToken, trailingTrivia: [SyntaxTrivia.space] }))),
            block);
    }

    private changeIndentation(node: SyntaxNode, changeFirstToken: bool, indentAmount: number): SyntaxNode {
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
                /*minimumColumn:*/ this.options.indentSpaces,
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
            SyntaxToken.createElasticKeyword({ kind: SyntaxKind.ReturnKeyword, trailingTrivia: arrowToken.trailingTrivia().toArray() }),
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
}