///<reference path='SyntaxRewriter.generated.ts' />

///<reference path='FormattingOptions.ts' />
///<reference path='SyntaxDedenter.ts' />
///<reference path='SyntaxIndenter.ts' />
///<reference path='SyntaxInformationMap.ts' />
///<reference path='SyntaxNodeInvariantsChecker.ts' />
///<reference path='Syntax.ts' />

module Emitter {
    // Class that makes sure we're not reusing tokens in a tree
    class EnsureTokenUniquenessRewriter extends SyntaxRewriter {
        private tokenTable = Collections.createHashTable(Collections.DefaultHashTableCapacity, Syntax.tokenHashCode);

        private visitToken(token: ISyntaxToken): ISyntaxToken {
            if (this.tokenTable.containsKey(token)) {
                // already saw this token.  so clone it and return a new one. so that the tree stays
                // unique/
                return token.clone();
            }
            
            this.tokenTable.add(token, token);
            return token;
        }
    }

    class EmitterImpl extends SyntaxRewriter {
        private syntaxInformationMap: SyntaxInformationMap;
        private options: FormattingOptions;
        private space: ISyntaxTriviaList;
        private newLine: ISyntaxTriviaList;

        constructor(syntaxInformationMap: SyntaxInformationMap,
            options: FormattingOptions) {
            super();

            this.syntaxInformationMap = syntaxInformationMap;
            this.options = options || FormattingOptions.defaultOptions;

            // TODO: use proper new line based on options.
            this.space = SyntaxTriviaList.space;
            this.newLine = SyntaxTriviaList.create([SyntaxTrivia.carriageReturnLineFeed]);
        }

        private columnForStartOfToken(token: ISyntaxToken): number {
            return Indentation.columnForStartOfToken(token, this.syntaxInformationMap, this.options);
        }

        private columnForEndOfToken(token: ISyntaxToken): number {
            return Indentation.columnForEndOfToken(token, this.syntaxInformationMap, this.options);
        }

        private indentationTrivia(column: number): ISyntaxTriviaList {
            var triviaArray = column === 0 ? null : [Indentation.indentationTrivia(column, this.options)];
            return SyntaxTriviaList.create(triviaArray);
        }

        private indentationTriviaForStartOfToken(token: ISyntaxToken): ISyntaxTriviaList {
            var column = this.columnForStartOfToken(token);
            return this.indentationTrivia(column);
        }

        private adjustListIndentation(nodes: SyntaxNode[]): SyntaxNode[] {
            // TODO: determine if we should actually indent the first token or not.
            return SyntaxIndenter.indentNodes(nodes, /*indentFirstToken:*/ true, this.options.indentSpaces, this.options);
        }

        private changeIndentation(node: SyntaxNode,
            changeFirstToken: bool,
            indentAmount: number): SyntaxNode {
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
                    /*minimumColumn:*/this.options.indentSpaces,
                    this.options);
            }
        }

        private withNoTrivia(token: ISyntaxToken): ISyntaxToken {
            return token.withLeadingTrivia(SyntaxTriviaList.empty).withTrailingTrivia(SyntaxTriviaList.empty);
        }

        private visitSourceUnit(node: SourceUnitSyntax): SourceUnitSyntax {
            return node.withModuleElements(SyntaxList.create(
                this.convertModuleElements(node.moduleElements())));
        }

        private convertModuleElements(list: ISyntaxList): ModuleElementSyntax[] {
            var moduleElements: ModuleElementSyntax[] = [];

            for (var i = 0, n = list.count(); i < n; i++) {
                var moduleElement = list.syntaxNodeAt(i);

                var converted = this.visitNode(moduleElement);
                if (converted !== null) {
                    if (ArrayUtilities.isArray(converted)) {
                        moduleElements.push.apply(moduleElements, converted);
                    }
                    else {
                        moduleElements.push(<ModuleElementSyntax>converted);
                    }
                }
            }

            return moduleElements;
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

        private leftmostName(name: NameSyntax): IdentifierNameSyntax {
            while (name.kind() === SyntaxKind.QualifiedName) {
                name = (<QualifiedNameSyntax>name).left();
            }

            return <IdentifierNameSyntax>name;
        }

        private rightmostName(name: NameSyntax): IdentifierNameSyntax {
            return name.kind() === SyntaxKind.QualifiedName
                ? (<QualifiedNameSyntax>name).right()
                : <IdentifierNameSyntax>name;
        }

        private exportModuleElement(moduleIdentifier: ISyntaxToken,
                                    moduleElement: ModuleElementSyntax,
                                    elementIdentifier: ISyntaxToken): ExpressionStatementSyntax {
            moduleIdentifier = this.withNoTrivia(moduleIdentifier);
            elementIdentifier = this.withNoTrivia(elementIdentifier);

            var indentationTrivia = this.indentationTriviaForStartOfToken(moduleElement.firstToken());

            // M1.e = e;
            return ExpressionStatementSyntax.create1(
                new BinaryExpressionSyntax(
                    SyntaxKind.AssignmentExpression,
                    MemberAccessExpressionSyntax.create1(
                        new IdentifierNameSyntax(moduleIdentifier.withLeadingTrivia(indentationTrivia)),
                        new IdentifierNameSyntax(elementIdentifier.withTrailingTrivia(SyntaxTriviaList.space))),
                    Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                    new IdentifierNameSyntax(elementIdentifier))).withTrailingTrivia(this.newLine);
        }

        private handleExportedModuleElement(parentModule: ISyntaxToken,
                                            moduleElement: ModuleElementSyntax,
                                            elements: ModuleElementSyntax[]): void {
            switch (moduleElement.kind()) {
                case SyntaxKind.VariableStatement:
                    var variableStatement = <VariableStatementSyntax>moduleElement;
                    if (variableStatement.exportKeyword() !== null) {
                        var declarators = variableStatement.variableDeclaration().variableDeclarators();
                        for (var i = 0, n = declarators.syntaxNodeCount(); i < n; i++) {
                            var declarator = <VariableDeclaratorSyntax>declarators.syntaxNodeAt(i);
                            elements.push(this.exportModuleElement(parentModule, moduleElement, declarator.identifier()));
                        }
                    }
                    return;

                case SyntaxKind.FunctionDeclaration:
                    var functionDeclaration = <FunctionDeclarationSyntax>moduleElement;
                    if (functionDeclaration.exportKeyword() !== null) {
                        elements.push(this.exportModuleElement(
                            parentModule, moduleElement, functionDeclaration.functionSignature().identifier()));
                    }
                    return;

                case SyntaxKind.ClassDeclaration:
                    var classDeclaration = <ClassDeclarationSyntax>moduleElement;
                    if (classDeclaration.exportKeyword() !== null) {
                        elements.push(this.exportModuleElement(parentModule, moduleElement, classDeclaration.identifier()));
                    }
                    return;

                case SyntaxKind.ModuleDeclaration:
                    var childModule = <ModuleDeclarationSyntax>moduleElement;
                    if (childModule.exportKeyword() !== null) {
                        elements.push(this.exportModuleElement(
                            parentModule, moduleElement, this.leftmostName(childModule.moduleName()).identifier()));
                    }
                    return;
            }
        }

        private visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleElementSyntax[] {
            // Break up the dotted name into pieces.
            var names = EmitterImpl.splitModuleName(node.moduleName());

            // Start with the rightmost piece.  This will be the one that actually contains the 
            // members declared in the module.

            // Recurse downwards and get the rewritten children.
            var moduleElements = this.convertModuleElements(node.moduleElements());

            // Handle the case where the child is an export.
            var parentModule = this.rightmostName(node.moduleName()).identifier()
            for (var i = 0, n = node.moduleElements().count(); i < n; i++) {
                this.handleExportedModuleElement(
                    parentModule, <ModuleElementSyntax>node.moduleElements().syntaxNodeAt(i), moduleElements);
            }

            // Then, for all the names left of that name, wrap what we've created in a larger module.
            for (var nameIndex = names.length - 1; nameIndex >= 0; nameIndex--) {
                moduleElements = this.convertModuleDeclaration(
                    node, names[nameIndex], moduleElements, nameIndex === 0);

                if (nameIndex > 0) {
                    // We're popping out and generate each outer module.  As we do so, we have to
                    // indent whatever we've created so far appropriately.
                    moduleElements.push(this.exportModuleElement(
                        names[nameIndex - 1].identifier(), node, names[nameIndex].identifier()));

                    moduleElements = <ModuleElementSyntax[]>this.adjustListIndentation(moduleElements);
                }
            }

            return moduleElements;
        }


        private initializedVariable(name: IdentifierNameSyntax): BinaryExpressionSyntax {
            return new BinaryExpressionSyntax(
                SyntaxKind.LogicalOrExpression,
                name,
                Syntax.token(SyntaxKind.BarBarToken),
                ParenthesizedExpressionSyntax.create1(
                    new BinaryExpressionSyntax(
                        SyntaxKind.AssignmentExpression,
                        name,
                        Syntax.token(SyntaxKind.EqualsToken),
                        ObjectLiteralExpressionSyntax.create1())));
        }

        private convertModuleDeclaration(moduleDeclaration: ModuleDeclarationSyntax,
                                         moduleName: IdentifierNameSyntax,
                                         moduleElements: ModuleElementSyntax[],
                                         outermost: bool): ModuleElementSyntax[] {
            moduleName = moduleName.withLeadingTrivia(SyntaxTriviaList.empty).withTrailingTrivia(SyntaxTriviaList.empty);
            var moduleIdentifier = moduleName.identifier();

            var moduleIndentation = this.indentationTriviaForStartOfToken(moduleDeclaration.firstToken());
            var leadingTrivia = outermost
                ? moduleDeclaration.leadingTrivia()
                : moduleIndentation;

            // var M;
            var variableStatement = VariableStatementSyntax.create1(
                    new VariableDeclarationSyntax(
                        Syntax.token(SyntaxKind.VarKeyword).withTrailingTrivia(this.space),
                        SeparatedSyntaxList.create(
                            [VariableDeclaratorSyntax.create(moduleIdentifier)]))
                ).withLeadingTrivia(leadingTrivia).withTrailingTrivia(this.newLine);

            // function(M) { ... }
            var functionExpression = FunctionExpressionSyntax.create1()
                .withCallSignature(Syntax.callSignature(ParameterSyntax.create(moduleIdentifier)).withTrailingTrivia(this.space))
                .withBlock(new BlockSyntax(
                    Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.newLine),
                    SyntaxList.create(moduleElements),
                    Syntax.token(SyntaxKind.CloseBraceToken).withLeadingTrivia(moduleIndentation)));

            // (function(M) { ... })(M||(M={}))
            var invocationExpression = new InvocationExpressionSyntax(
                ParenthesizedExpressionSyntax.create1(functionExpression),
                ArgumentListSyntax.create1().withArgument(
                    this.initializedVariable(moduleName)));

            // (function(M) { ... })(M||(M={}));
            var expressionStatement = ExpressionStatementSyntax.create1(invocationExpression)
                .withLeadingTrivia(moduleIndentation).withTrailingTrivia(this.newLine);

            return [variableStatement, expressionStatement];
        }

        private visitExpressionStatement(node: ExpressionStatementSyntax): ExpressionStatementSyntax {
            // Can't have an expression statement with an anonymous function expression in it.
            var rewritten: ExpressionStatementSyntax = super.visitExpressionStatement(node);

            // convert: function() { ... };  to (function() { ... });
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

            // Now, wrap the function expression in parens to make it legal in javascript.
            var parenthesizedExpression = ParenthesizedExpressionSyntax.create1(
                functionExpression.withLeadingTrivia(SyntaxTriviaList.empty)).withLeadingTrivia(functionExpression.leadingTrivia());

            return rewritten.withExpression(parenthesizedExpression);
        }

        private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): FunctionExpressionSyntax {
            var identifier = this.withNoTrivia(node.identifier());

            return FunctionExpressionSyntax.create1()
                .withCallSignature(Syntax.callSignature(ParameterSyntax.create(identifier)).withTrailingTrivia(this.space))
                .withBlock(this.convertArrowFunctionBody(node)).withLeadingTrivia(node.leadingTrivia());
        }

        private visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): FunctionExpressionSyntax {
            return FunctionExpressionSyntax.create1()
                .withCallSignature(CallSignatureSyntax.create(node.callSignature().parameterList().accept(this)))
                .withBlock(this.convertArrowFunctionBody(node)).withLeadingTrivia(node.leadingTrivia());
        }

        private convertArrowFunctionBody(arrowFunction: ArrowFunctionExpressionSyntax): BlockSyntax {
            var rewrittenBody = this.visitNode(arrowFunction.body());

            if (rewrittenBody.kind() === SyntaxKind.Block) {
                return <BlockSyntax>rewrittenBody;
            }

            var arrowToken = arrowFunction.equalsGreaterThanToken();

            // first, attach the expression to the return statement
            var returnStatement = new ReturnStatementSyntax(
                Syntax.token(SyntaxKind.ReturnKeyword, { trailingTrivia: arrowToken.trailingTrivia().toArray() }),
                <ExpressionSyntax>rewrittenBody,
                Syntax.token(SyntaxKind.SemicolonToken)).withTrailingTrivia(this.newLine);

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
                var arrowFunctionStart = this.columnForStartOfToken(arrowFunction.firstToken());
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
                var arrowEndColumn = this.columnForEndOfToken(arrowToken);
                var returnKeywordEndColumn = returnStatement.returnKeyword().width();
                difference = returnKeywordEndColumn - arrowEndColumn;
            }

            returnStatement = <ReturnStatementSyntax>this.changeIndentation(
                returnStatement, /*changeFirstToken:*/ false, difference);

            // Next, indent the return statement.  It's going in a block, so it needs to be properly
            // indented.  Note we do this *after* we've ensured the expression aligns properly.

            returnStatement = <ReturnStatementSyntax>this.changeIndentation(
                returnStatement, /*indentFirstToken:*/ true, this.options.indentSpaces);

            // Now wrap the return statement in a block.
            var block = new BlockSyntax(
                Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.newLine),
                SyntaxList.create([returnStatement]),
                Syntax.token(SyntaxKind.CloseBraceToken));

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

            block = <BlockSyntax>this.changeIndentation(block, /*indentFirstToken:*/ false,
                Indentation.columnForStartOfFirstTokenInLineContainingToken(
                    arrowFunction.firstToken(), this.syntaxInformationMap, this.options));
            return block;
        }

        private static functionSignatureDefaultParameters(signature: FunctionSignatureSyntax): ParameterSyntax[] {
            return EmitterImpl.parameterListDefaultParameters(signature.parameterList());
        }

        private static parameterListDefaultParameters(parameterList: ParameterListSyntax): ParameterSyntax[] {
            return EmitterImpl.parametersDefaultParameters(parameterList.parameters());
        }

        private static parameterListPropertyParameters(parameterList: ParameterListSyntax): ParameterSyntax[] {
            return EmitterImpl.parametersPropertyParameters(parameterList.parameters());
        }

        private static parametersDefaultParameters(list: ISeparatedSyntaxList): ParameterSyntax[] {
            return ArrayUtilities.where(list.toSyntaxNodeArray(), p => p.equalsValueClause() !== null);
        }

        private static parametersPropertyParameters(list: ISeparatedSyntaxList): ParameterSyntax[] {
            return ArrayUtilities.where(list.toSyntaxNodeArray(), p => p.publicOrPrivateKeyword() !== null);
        }

        private generatePropertyAssignmentStatement(parameter: ParameterSyntax): ExpressionStatementSyntax {
            var identifier = this.withNoTrivia(parameter.identifier());

            // this.foo = foo;
            return ExpressionStatementSyntax.create1(
                new BinaryExpressionSyntax(
                    SyntaxKind.AssignmentExpression,
                    MemberAccessExpressionSyntax.create1(
                        ThisExpressionSyntax.create1(),
                        new IdentifierNameSyntax(identifier.withTrailingTrivia(SyntaxTriviaList.space))),
                    Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                    new IdentifierNameSyntax(identifier))).withTrailingTrivia(this.newLine);
        }

        private generateDefaultValueAssignmentStatement(parameter: ParameterSyntax): IfStatementSyntax {
            var name = parameter.identifier().withLeadingTrivia(SyntaxTriviaList.empty)
                                             .withTrailingTrivia(this.space);
            var identifierName = new IdentifierNameSyntax(name);

            // typeof foo === 'undefined'
            var condition = new BinaryExpressionSyntax(
                    SyntaxKind.EqualsExpression,
                    new TypeOfExpressionSyntax(
                        Syntax.token(SyntaxKind.TypeOfKeyword).withTrailingTrivia(this.space),
                        identifierName),
                    Syntax.token(SyntaxKind.EqualsEqualsEqualsToken).withTrailingTrivia(this.space),
                    Syntax.stringLiteralExpression('"undefined"'));

            // foo = expr
            var assignment = new BinaryExpressionSyntax(
                SyntaxKind.AssignmentExpression,
                identifierName,
                Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                parameter.equalsValueClause().value().accept(this));

            // foo = expr; 
            var assignmentStatement = ExpressionStatementSyntax.create1(
                assignment).withTrailingTrivia(this.space);

            var block = new BlockSyntax(
                Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.space),
                SyntaxList.create([assignmentStatement]),
                Syntax.token(SyntaxKind.CloseBraceToken)).withTrailingTrivia(this.newLine);

            // if (typeof foo === 'undefined') { foo = expr; }
            return new IfStatementSyntax(
                Syntax.token(SyntaxKind.IfKeyword).withTrailingTrivia(this.space),
                Syntax.token(SyntaxKind.OpenParenToken),
                condition,
                Syntax.token(SyntaxKind.CloseParenToken).withTrailingTrivia(this.space),
                block, null);
        }

        private visitFunctionDeclaration(node: FunctionDeclarationSyntax): FunctionDeclarationSyntax {
            if (node.block() === null) {
                // Function overloads aren't emitted.
                return null;
            }

            var rewritten = <FunctionDeclarationSyntax>super.visitFunctionDeclaration(node);
            var parametersWithDefaults = EmitterImpl.functionSignatureDefaultParameters(node.functionSignature());

            if (parametersWithDefaults.length !== 0) {
                var defaultValueAssignmentStatements = ArrayUtilities.select(
                    parametersWithDefaults, p => this.generateDefaultValueAssignmentStatement(p));

                var functionDeclarationStartColumn = this.columnForStartOfToken(node.firstToken());
                var desiredColumn = functionDeclarationStartColumn + this.options.indentSpaces;

                defaultValueAssignmentStatements = ArrayUtilities.select(defaultValueAssignmentStatements,
                    s => this.changeIndentation(s, /*indentFirstToken:*/ true, desiredColumn));

                var statements: StatementSyntax[] = [];
                statements.push.apply(statements, defaultValueAssignmentStatements);
                statements.push.apply(statements, rewritten.block().statements().toArray());

                rewritten = rewritten.withBlock(rewritten.block().withStatements(
                    SyntaxList.create(statements)));
            }

            return rewritten.withExportKeyword(null)
                            .withDeclareKeyword(null)
                            .withLeadingTrivia(rewritten.leadingTrivia());
        }

        private visitParameter(node: ParameterSyntax): ParameterSyntax {
            // transfer the trivia from the first token to the the identifier.
            return ParameterSyntax.create(node.identifier())
                                  .withLeadingTrivia(node.leadingTrivia())
                                  .withTrailingTrivia(node.trailingTrivia())
        }

        private generatePropertyAssignment(classDeclaration: ClassDeclarationSyntax,
                                           static: bool,
                                           memberDeclaration: MemberVariableDeclarationSyntax): ExpressionStatementSyntax {
            var isStatic = memberDeclaration.staticKeyword() !== null;
            if (static !== isStatic) {
                return null;
            }

            var declarator = memberDeclaration.variableDeclarator();
            if (declarator.equalsValueClause() === null) {
                return null;
            }

            var classIdentifier = this.withNoTrivia(classDeclaration.identifier());
            var memberIdentifier = this.withNoTrivia(declarator.identifier());

            var receiver = static
                ? <ExpressionSyntax>new IdentifierNameSyntax(classIdentifier)
                : ThisExpressionSyntax.create1();

            // this.foo = expr;
            receiver = MemberAccessExpressionSyntax.create1(
                receiver,
                new IdentifierNameSyntax(memberIdentifier.withTrailingTrivia(SyntaxTriviaList.space)));

            return ExpressionStatementSyntax.create1(
                    new BinaryExpressionSyntax(
                        SyntaxKind.AssignmentExpression,
                        receiver,
                        Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                        declarator.equalsValueClause().value().accept(this).withTrailingTrivia(SyntaxTriviaList.empty))
                ).withLeadingTrivia(memberDeclaration.leadingTrivia()).withTrailingTrivia(this.newLine);
        }

        private generatePropertyAssignments(classDeclaration: ClassDeclarationSyntax,
                                            static: bool): ExpressionStatementSyntax[] {
            var result: ExpressionStatementSyntax[] = [];

            // TODO: handle alignment here.
            for (var i = classDeclaration.classElements().count() - 1; i >= 0; i--) {
                var classElement = classDeclaration.classElements().syntaxNodeAt(i);

                if (classElement.kind() === SyntaxKind.MemberVariableDeclaration) {
                    var statement = this.generatePropertyAssignment(
                        classDeclaration, static, <MemberVariableDeclarationSyntax>classElement);
                    if (statement !== null) {
                        result.push(statement);
                    }
                }
            }

            return result;
        }

        private createDefaultConstructorDeclaration(classDeclaration: ClassDeclarationSyntax): FunctionDeclarationSyntax {
            var functionSignature = FunctionSignatureSyntax.create1(this.withNoTrivia(classDeclaration.identifier()))
                                                           .withTrailingTrivia(this.space);

            var classIndentationColumn = this.columnForStartOfToken(classDeclaration.firstToken());

            var statements: StatementSyntax[] = [];
            if (classDeclaration.extendsClause() !== null) {
                var superIndentationColumn = classIndentationColumn + this.options.indentSpaces;
                var superIndentation = this.indentationTrivia(superIndentationColumn);

                var superStatement = ExpressionStatementSyntax.create1(
                    new InvocationExpressionSyntax(
                        MemberAccessExpressionSyntax.create1(
                            Syntax.identifierName("_super"), Syntax.identifierName("apply")),
                        ArgumentListSyntax.create1().withArguments(
                            SeparatedSyntaxList.create([
                                ThisExpressionSyntax.create1(),
                                Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.space),
                                Syntax.identifierName("arguments")])))).withLeadingTrivia(superIndentation).withTrailingTrivia(this.newLine);

                statements.push(superStatement);
            }

            var instanceAssignments = this.generatePropertyAssignments(
                classDeclaration, /*static:*/ false);
            statements.push.apply(statements, instanceAssignments);

            var indentationTrivia = this.indentationTrivia(classIndentationColumn);
            var block = new BlockSyntax(
                Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.newLine),
                SyntaxList.create(statements),
                Syntax.token(SyntaxKind.CloseBraceToken).withLeadingTrivia(indentationTrivia)).withTrailingTrivia(this.newLine);

            var functionDeclaration = new FunctionDeclarationSyntax(null, null,
                Syntax.token(SyntaxKind.FunctionKeyword).withLeadingTrivia(indentationTrivia).withTrailingTrivia(this.space),
                functionSignature,
                block, null);

            return <FunctionDeclarationSyntax>this.changeIndentation(
                functionDeclaration, /*indentFirstToken:*/ true, this.options.indentSpaces);
        }

        private convertConstructorDeclaration(classDeclaration: ClassDeclarationSyntax,
            constructorDeclaration: ConstructorDeclarationSyntax): FunctionDeclarationSyntax {
            if (constructorDeclaration === null ||
                constructorDeclaration.block() === null) {
                return null;
            }

            var identifier = this.withNoTrivia(classDeclaration.identifier());

            var constructorIndentationColumn = this.columnForStartOfToken(constructorDeclaration.firstToken());
            var originalParameterListindentation = this.columnForStartOfToken(constructorDeclaration.parameterList().firstToken());

            // The original indent + "function" + <space> + "ClassName"
            var newParameterListIndentation =
                constructorIndentationColumn + SyntaxFacts.getText(SyntaxKind.FunctionKeyword).length + 1 + identifier.width();

            var parameterList = constructorDeclaration.parameterList().accept(this);
            parameterList = this.changeIndentation(
                parameterList, /*changeFirstToken:*/ false, newParameterListIndentation - originalParameterListindentation);

            var functionSignature = FunctionSignatureSyntax.create(identifier, parameterList);

            var block = constructorDeclaration.block();
            var allStatements = block.statements().toArray();

            var normalStatements: StatementSyntax[] = ArrayUtilities.select(ArrayUtilities.where(allStatements,
                s => !EmitterImpl.isSuperInvocationExpressionStatement(s)), s => s.accept(this));
            var superStatements: StatementSyntax[] = ArrayUtilities.select(ArrayUtilities.where(allStatements,
                s => EmitterImpl.isSuperInvocationExpressionStatement(s)), s => s.accept(this));

            // TODO: handle alignment here.
            var instanceAssignments = this.generatePropertyAssignments(
                classDeclaration, /*static:*/ false);

            for (var i = instanceAssignments.length - 1; i >= 0; i--) {
                normalStatements.unshift(<ExpressionStatementSyntax>this.changeIndentation(
                    instanceAssignments[i], /*changeFirstToken:*/ true, this.options.indentSpaces));
            }

            var parameterPropertyAssignments = <ExpressionStatementSyntax[]>ArrayUtilities.select(
                EmitterImpl.parameterListPropertyParameters(constructorDeclaration.parameterList()),
                p => this.generatePropertyAssignmentStatement(p));

            for (var i = parameterPropertyAssignments.length - 1; i >= 0; i--) {
                var expressionStatement = parameterPropertyAssignments[i];
                expressionStatement = <ExpressionStatementSyntax>this.changeIndentation(
                    expressionStatement, /*changeFirstToken:*/ true, this.options.indentSpaces + constructorIndentationColumn);
                normalStatements.unshift(expressionStatement);
            }

            for (var i = superStatements.length - 1; i >= 0; i--) {
                normalStatements.unshift(superStatements[i]);
            }

            var defaultValueAssignments = <ExpressionStatementSyntax[]>ArrayUtilities.select(
                EmitterImpl.parameterListDefaultParameters(constructorDeclaration.parameterList()),
                p => this.generateDefaultValueAssignmentStatement(p));

            for (var i = defaultValueAssignments.length - 1; i >= 0; i--) {
                var expressionStatement = defaultValueAssignments[i];
                expressionStatement = <ExpressionStatementSyntax>this.changeIndentation(
                    expressionStatement, /*changeFirstToken:*/ true, this.options.indentSpaces + constructorIndentationColumn);
                normalStatements.unshift(expressionStatement);
            }

            block = block.withStatements(SyntaxList.create(normalStatements));

            return new FunctionDeclarationSyntax(null, null,
                Syntax.token(SyntaxKind.FunctionKeyword).withTrailingTrivia(this.space),
                functionSignature,
                block, null).withLeadingTrivia(constructorDeclaration.leadingTrivia());
        }

        private convertMemberFunctionDeclaration(classDeclaration: ClassDeclarationSyntax,
                                                 functionDeclaration: MemberFunctionDeclarationSyntax): ExpressionStatementSyntax {
            if (functionDeclaration.block() === null) {
                return null;
            }

            var classIdentifier = this.withNoTrivia(classDeclaration.identifier());
            var functionIdentifier = this.withNoTrivia(functionDeclaration.functionSignature().identifier());

            var receiver: ExpressionSyntax = new IdentifierNameSyntax(
                classIdentifier.withLeadingTrivia(functionDeclaration.leadingTrivia()));

            receiver = functionDeclaration.staticKeyword() !== null
                ? receiver
                : MemberAccessExpressionSyntax.create1(receiver, Syntax.identifierName("prototype"));

            receiver = MemberAccessExpressionSyntax.create1(
                receiver,
                new IdentifierNameSyntax(functionIdentifier.withTrailingTrivia(SyntaxTriviaList.space)));

            var block = <BlockSyntax>functionDeclaration.block().accept(this);
            var blockTrailingTrivia = block.trailingTrivia();

            block = block.withTrailingTrivia(SyntaxTriviaList.empty);

            var defaultParameters = EmitterImpl.functionSignatureDefaultParameters(functionDeclaration.functionSignature());
            var defaultValueAssignments = <StatementSyntax[]>ArrayUtilities.select(defaultParameters,
                p => this.generateDefaultValueAssignmentStatement(p));

            var functionColumn = this.columnForStartOfToken(functionDeclaration.firstToken());

            var blockStatements = block.statements().toArray();
            for (var i = defaultValueAssignments.length - 1; i >= 0; i--) {
                var assignment = <StatementSyntax>this.changeIndentation(
                    defaultValueAssignments[i], /*changeFirstToken:*/ true, functionColumn + this.options.indentSpaces);

                blockStatements.unshift(assignment);
            }

            block = block.withStatements(SyntaxList.create(blockStatements));

            var callSignatureParameterList = <ParameterListSyntax>functionDeclaration.functionSignature().parameterList().accept(this);
            if (!callSignatureParameterList.hasTrailingTrivia()) {
                callSignatureParameterList = <ParameterListSyntax>callSignatureParameterList.withTrailingTrivia(SyntaxTriviaList.space);
            }

            var functionExpression = FunctionExpressionSyntax.create1()
                .withCallSignature(CallSignatureSyntax.create(callSignatureParameterList))
                .withBlock(block);

            var assignmentExpression = new BinaryExpressionSyntax(
                SyntaxKind.AssignmentExpression,
                receiver,
                Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                functionExpression);

            return ExpressionStatementSyntax.create1(assignmentExpression)
                                            .withTrailingTrivia(blockTrailingTrivia);
        }

        private convertMemberAccessor(memberAccessor: MemberAccessorDeclarationSyntax): PropertyAssignmentSyntax {
            var propertyName = memberAccessor.kind() === SyntaxKind.GetMemberAccessorDeclaration
                ? "get" : "set";

            var indentationTrivia = this.indentationTriviaForStartOfToken(memberAccessor.firstToken());

            var parameterList = <ParameterListSyntax>memberAccessor.parameterList().accept(this);
            if (!parameterList.hasTrailingTrivia()) {
                parameterList = parameterList.withTrailingTrivia(SyntaxTriviaList.space);
            }

            var block = memberAccessor.block().accept(this);
            block = block.withTrailingTrivia(SyntaxTriviaList.empty);

            return new SimplePropertyAssignmentSyntax(
                Syntax.identifier(propertyName),
                Syntax.token(SyntaxKind.ColonToken).withTrailingTrivia(this.space),
                FunctionExpressionSyntax.create(
                    Syntax.token(SyntaxKind.FunctionKeyword),
                    CallSignatureSyntax.create(parameterList),
                    block)).withLeadingTrivia(indentationTrivia);
        }

        private convertMemberAccessorDeclaration(classDeclaration: ClassDeclarationSyntax,
                                                 memberAccessor: MemberAccessorDeclarationSyntax,
                                                 classElements: ClassElementSyntax[]): StatementSyntax {
            if (memberAccessor.block() === null) {
                return null;
            }

            var name = <string>memberAccessor.identifier().value();

            // Find all the accessors with that name.
            var accessors: MemberAccessorDeclarationSyntax[] = [memberAccessor];

            for (var i = classElements.length - 1; i >= 0; i--) {
                var element = classElements[i];
                if (element.kind() === SyntaxKind.GetMemberAccessorDeclaration ||
                    element.kind() === SyntaxKind.SetMemberAccessorDeclaration) {

                    var otherAccessor = <MemberAccessorDeclarationSyntax>element;
                    if (otherAccessor.identifier().value() === name &&
                        otherAccessor.block() !== null) {
                        accessors.push(otherAccessor);
                        classElements.splice(i, 1);
                    }
                }
            }

            var receiver = MemberAccessExpressionSyntax.create1(
                Syntax.identifierName("Object"),
                Syntax.identifierName("defineProperty")).withLeadingTrivia(memberAccessor.leadingTrivia());

            var arguments = [];

            var classIdentifier = this.withNoTrivia(classDeclaration.identifier());
            arguments.push(MemberAccessExpressionSyntax.create1(
                new IdentifierNameSyntax(classIdentifier),
                Syntax.identifierName("prototype")));
            arguments.push(Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.space));

            arguments.push(Syntax.stringLiteralExpression('"' + memberAccessor.identifier().text() + '"'));
            arguments.push(Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.space));

            var propertyAssignments = [];
            for (var i = 0; i < accessors.length; i++) {
                var converted = this.convertMemberAccessor(accessors[i]);
                converted = <PropertyAssignmentSyntax>this.changeIndentation(
                    converted, /*changeFirstToken:*/ true, this.options.indentSpaces);
                propertyAssignments.push(converted);
                propertyAssignments.push(
                    Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.newLine));
            }

            var accessorColumn = this.columnForStartOfToken(memberAccessor.firstToken());
            var accessorTrivia = this.indentationTrivia(accessorColumn);
            var propertyTrivia = this.indentationTrivia(accessorColumn + this.options.indentSpaces);

            propertyAssignments.push(new SimplePropertyAssignmentSyntax(
                Syntax.identifier("enumerable"),
                Syntax.token(SyntaxKind.ColonToken).withTrailingTrivia(this.space),
                Syntax.trueExpression()).withLeadingTrivia(propertyTrivia));
            propertyAssignments.push(Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.newLine));

            propertyAssignments.push(new SimplePropertyAssignmentSyntax(
                Syntax.identifier("configurable"),
                Syntax.token(SyntaxKind.ColonToken).withTrailingTrivia(this.space),
                Syntax.trueExpression()).withLeadingTrivia(propertyTrivia).withTrailingTrivia(this.newLine));

            var objectLiteral = new ObjectLiteralExpressionSyntax(
                Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.newLine),
                SeparatedSyntaxList.create(propertyAssignments),
                Syntax.token(SyntaxKind.CloseBraceToken).withLeadingTrivia(accessorTrivia));

            arguments.push(objectLiteral);

            var argumentList = ArgumentListSyntax.create1().withArguments(
                SeparatedSyntaxList.create(arguments));

            var invocationExpression = new InvocationExpressionSyntax(receiver, argumentList);

            return ExpressionStatementSyntax.create1(invocationExpression)
                                            .withTrailingTrivia(this.newLine);
        }

        private convertClassElements(classDeclaration: ClassDeclarationSyntax): StatementSyntax[] {
            var result: StatementSyntax[] = [];

            var classElements = <ClassElementSyntax[]>classDeclaration.classElements().toArray();
            while (classElements.length > 0) {
                var classElement = classElements.shift();
                if (classElement.kind() === SyntaxKind.ConstructorDeclaration) {
                    continue;
                }

                var converted: StatementSyntax = null;
                if (classElement.kind() === SyntaxKind.MemberFunctionDeclaration) {
                    var converted = this.convertMemberFunctionDeclaration(classDeclaration, <MemberFunctionDeclarationSyntax>classElement);
                }
                else if (classElement.kind() === SyntaxKind.MemberVariableDeclaration) {
                    var converted = this.generatePropertyAssignment(classDeclaration, /*static:*/ true, <MemberVariableDeclarationSyntax>classElement);
                }
                else if (classElement.kind() === SyntaxKind.GetMemberAccessorDeclaration ||
                         classElement.kind() === SyntaxKind.SetMemberAccessorDeclaration) {
                    // TODO: handle properties.
                    var converted = this.convertMemberAccessorDeclaration(classDeclaration, <MemberAccessorDeclarationSyntax>classElement, classElements);
                }

                if (converted !== null) {
                    result.push(converted);
                }
            }

            return result;
        }

        private visitClassDeclaration(node: ClassDeclarationSyntax): VariableStatementSyntax {
            var identifier = this.withNoTrivia(node.identifier());

            var statements: StatementSyntax[] = [];

            var statementColumn = this.options.indentSpaces + this.columnForStartOfToken(node.firstToken());
            var statementIndentation = this.indentationTrivia(statementColumn);

            if (node.extendsClause() !== null) {
                // __extends(C, _super);
                var extendsStatement = ExpressionStatementSyntax.create1(
                    new InvocationExpressionSyntax(
                        Syntax.identifierName("__extends"),
                        ArgumentListSyntax.create1().withArguments(SeparatedSyntaxList.create([
                            <any>new IdentifierNameSyntax(identifier),
                            Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.space),
                            Syntax.identifierName("_super")])))).withLeadingTrivia(statementIndentation).withTrailingTrivia(this.newLine);

                statements.push(extendsStatement);
            }

            var constructorDeclaration: ConstructorDeclarationSyntax =
                ArrayUtilities.firstOrDefault(node.classElements().toArray(), c => c.kind() === SyntaxKind.ConstructorDeclaration);

            var constructorFunctionDeclaration = constructorDeclaration === null
                ? this.createDefaultConstructorDeclaration(node)
                : this.convertConstructorDeclaration(node, constructorDeclaration);

            if (constructorFunctionDeclaration !== null) {
                statements.push(constructorFunctionDeclaration)
            }

            var classElementStatements = this.convertClassElements(node);
            statements.push.apply(statements, classElementStatements);

            // return C;
            statements.push(new ReturnStatementSyntax(
                Syntax.token(SyntaxKind.ReturnKeyword).withTrailingTrivia(this.space),
                new IdentifierNameSyntax(identifier),
                Syntax.token(SyntaxKind.SemicolonToken))
                    .withLeadingTrivia(statementIndentation).withTrailingTrivia(this.newLine));

            var classIndentationTrivia = this.indentationTriviaForStartOfToken(node.firstToken());

            var block = new BlockSyntax(
                Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.newLine),
                SyntaxList.create(statements),
                Syntax.token(SyntaxKind.CloseBraceToken).withLeadingTrivia(classIndentationTrivia));

            var callParameters = [];
            if (node.extendsClause() !== null) {
                callParameters.push(ParameterSyntax.create(Syntax.identifier("_super")));
            }

            var callSignature = CallSignatureSyntax.create(
                ParameterListSyntax.create1().withParameters(
                    SeparatedSyntaxList.create(callParameters))).withTrailingTrivia(this.space);

            var functionExpression = FunctionExpressionSyntax.create1()
                .withCallSignature(callSignature)
                .withBlock(block);

            var invocationParameters = [];
            if (node.extendsClause() !== null && node.extendsClause().typeNames().count() > 0) {
                invocationParameters.push(node.extendsClause().typeNames().syntaxNodeAt(0)
                    .withLeadingTrivia(SyntaxTriviaList.empty)
                    .withTrailingTrivia(SyntaxTriviaList.empty));
            }

            var invocationExpression = new InvocationExpressionSyntax(
                ParenthesizedExpressionSyntax.create1(functionExpression),
                ArgumentListSyntax.create1().withArguments(
                    SeparatedSyntaxList.create(invocationParameters)));

            var variableDeclarator = VariableDeclaratorSyntax.create(
                identifier.withTrailingTrivia(SyntaxTriviaList.space)).withEqualsValueClause(
                    new EqualsValueClauseSyntax(
                        Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                        invocationExpression));

            var variableDeclaration = new VariableDeclarationSyntax(
                Syntax.token(SyntaxKind.VarKeyword).withTrailingTrivia(this.space),
                SeparatedSyntaxList.create([variableDeclarator])).withLeadingTrivia(node.leadingTrivia());

            return VariableStatementSyntax.create1(variableDeclaration)
                                          .withTrailingTrivia(this.newLine);
        }

        private visitVariableDeclarator(node: VariableDeclaratorSyntax): VariableDeclaratorSyntax {
            var result: VariableDeclaratorSyntax = super.visitVariableDeclarator(node);
            if (result.typeAnnotation() === null) {
                return result;
            }

            var newTrailingTrivia = result.identifier().trailingTrivia().concat(
                result.typeAnnotation().trailingTrivia());

            return result.withTypeAnnotation(null)
                         .withIdentifier(result.identifier().withTrailingTrivia(newTrailingTrivia));
        }

        private visitCallSignature(node: CallSignatureSyntax): CallSignatureSyntax {
            var result: CallSignatureSyntax = super.visitCallSignature(node);
            if (result.typeAnnotation() === null) {
                return result;
            }

            var newTrailingTrivia = result.parameterList().trailingTrivia().concat(
                result.typeAnnotation().trailingTrivia());

            return result.withTypeAnnotation(null)
                         .withTrailingTrivia(newTrailingTrivia);
        }

        private visitCastExpression(node: CastExpressionSyntax): ExpressionSyntax {
            var result: CastExpressionSyntax = super.visitCastExpression(node);

            var subExpression = result.expression();
            var totalTrivia = result.leadingTrivia().concat(subExpression.leadingTrivia());

            return subExpression.withLeadingTrivia(totalTrivia);
        }

        private visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): InterfaceDeclarationSyntax {
            // TODO: transfer trivia if important.
            return null;
        }

        private generateEnumValueExpression(enumDeclaration: EnumDeclarationSyntax,
                                            variableDeclarator: VariableDeclaratorSyntax,
                                            assignDefaultValues: bool,
                                            index: number): ExpressionSyntax {
            if (variableDeclarator.equalsValueClause() !== null) {
                // Use the value if one is provided.
                return variableDeclarator.equalsValueClause().value()
                                         .withTrailingTrivia(SyntaxTriviaList.empty);
            }

            // Didn't have a value.  Synthesize one if we're doing that, or use the previous item's value
            // (plus one).
            if (assignDefaultValues) {
                return Syntax.numericLiteralExpression(index.toString());
            }

            // Add one to the previous value.
            var enumIdentifier = this.withNoTrivia(enumDeclaration.identifier());
            var previousVariable = <VariableDeclaratorSyntax>enumDeclaration.variableDeclarators().syntaxNodeAt(index - 1);
            var variableIdentifier = this.withNoTrivia(previousVariable.identifier());

            var receiver = MemberAccessExpressionSyntax.create1(
                new IdentifierNameSyntax(enumIdentifier),
                new IdentifierNameSyntax(variableIdentifier.withTrailingTrivia(SyntaxTriviaList.space)));

            return new BinaryExpressionSyntax(
                SyntaxKind.PlusExpression,
                receiver,
                Syntax.token(SyntaxKind.PlusToken).withTrailingTrivia(this.space),
                Syntax.numericLiteralExpression("1"));
        }

        private generateEnumFunctionExpression(node: EnumDeclarationSyntax): FunctionExpressionSyntax {
            var identifier = this.withNoTrivia(node.identifier());

            var enumColumn = this.columnForStartOfToken(node.firstToken());

            var statements: StatementSyntax[] = [];

            var initIndentationColumn = enumColumn + this.options.indentSpaces;
            var initIndentationTrivia = this.indentationTrivia(initIndentationColumn);

            if (node.variableDeclarators().syntaxNodeCount() > 0) {
                // var _ = E;
                statements.push(VariableStatementSyntax.create1(
                    new VariableDeclarationSyntax(
                        Syntax.token(SyntaxKind.VarKeyword).withTrailingTrivia(this.space),
                        SeparatedSyntaxList.create([new VariableDeclaratorSyntax(
                            Syntax.identifier("_").withTrailingTrivia(this.space),
                            null,
                            new EqualsValueClauseSyntax(
                                Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                                new IdentifierNameSyntax(identifier)))]))).withLeadingTrivia(initIndentationTrivia).withTrailingTrivia(this.newLine));

                // _._map = []
                statements.push(ExpressionStatementSyntax.create1(
                    new BinaryExpressionSyntax(
                        SyntaxKind.AssignmentExpression,
                        MemberAccessExpressionSyntax.create1(
                            Syntax.identifierName("_"),
                            Syntax.identifierName("_map").withTrailingTrivia(this.space)),
                        Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                        ArrayLiteralExpressionSyntax.create1())).withLeadingTrivia(initIndentationTrivia).withTrailingTrivia(this.newLine));

                var assignDefaultValues = { value: true };
                for (var i = 0, n = node.variableDeclarators().syntaxNodeCount(); i < n; i++) {
                    var variableDeclarator = <VariableDeclaratorSyntax>node.variableDeclarators().syntaxNodeAt(i)
                    var variableIdentifier = this.withNoTrivia(variableDeclarator.identifier());

                    assignDefaultValues.value = assignDefaultValues.value && variableDeclarator.equalsValueClause() === null;

                    // _.Foo = 1
                    var innerAssign = new BinaryExpressionSyntax(
                        SyntaxKind.AssignmentExpression,
                        MemberAccessExpressionSyntax.create1(
                            Syntax.identifierName("_"),
                            new IdentifierNameSyntax(variableIdentifier.withTrailingTrivia(SyntaxTriviaList.space))),
                        Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                        this.generateEnumValueExpression(node, variableDeclarator, assignDefaultValues.value, i))

                    // _._map[_.Foo = 1]
                    var elementAccessExpression = ElementAccessExpressionSyntax.create1(
                        MemberAccessExpressionSyntax.create1(
                            Syntax.identifierName("_"), Syntax.identifierName("_map")),
                        innerAssign).withLeadingTrivia(initIndentationTrivia).withTrailingTrivia(this.space);;

                    //_._map[_.Foo = 1] = "Foo"
                    var outerAssign = new BinaryExpressionSyntax(
                        SyntaxKind.AssignmentExpression,
                        elementAccessExpression,
                        Syntax.token(SyntaxKind.EqualsToken).withTrailingTrivia(this.space),
                        Syntax.stringLiteralExpression('"' + variableIdentifier.text() + '"'));

                    var expressionStatement = ExpressionStatementSyntax.create1(
                        outerAssign).withTrailingTrivia(this.newLine);

                    statements.push(expressionStatement);
                }
            }

            var indentationTrivia = this.indentationTrivia(enumColumn);
            var block = new BlockSyntax(
                Syntax.token(SyntaxKind.OpenBraceToken).withTrailingTrivia(this.newLine),
                SyntaxList.create(statements),
                Syntax.token(SyntaxKind.CloseBraceToken).withLeadingTrivia(indentationTrivia));

            var parameterList = ParameterListSyntax.create1().withParameter(ParameterSyntax.create1(identifier)).withTrailingTrivia(this.space);

            return FunctionExpressionSyntax.create1()
                .withCallSignature(CallSignatureSyntax.create(parameterList))
                .withBlock(block);
        }

        private visitEnumDeclaration(node: EnumDeclarationSyntax): StatementSyntax[] {
            var identifier = this.withNoTrivia(node.identifier());

            // Copy existing leading trivia of the enum declaration to this node.
            // var E;
            var variableStatement = VariableStatementSyntax.create1(new VariableDeclarationSyntax(
                Syntax.token(SyntaxKind.VarKeyword).withTrailingTrivia(this.space),
                SeparatedSyntaxList.create([VariableDeclaratorSyntax.create(identifier)])))
                    .withLeadingTrivia(node.leadingTrivia()).withTrailingTrivia(this.newLine);

            // (function(E) { E.e1 = ... })(E||(E={}));
            var expressionStatement = ExpressionStatementSyntax.create1(
                new InvocationExpressionSyntax(
                    ParenthesizedExpressionSyntax.create1(
                        this.generateEnumFunctionExpression(node)),
                    ArgumentListSyntax.create1().withArgument(
                        this.initializedVariable(new IdentifierNameSyntax(identifier)))));

            expressionStatement = expressionStatement.withLeadingTrivia(this.indentationTriviaForStartOfToken(node.firstToken()))
                                                     .withTrailingTrivia(this.newLine);

            return [variableStatement, expressionStatement];
        }

        private static isSuperInvocationExpressionStatement(node: SyntaxNode): bool {
            return node.kind() === SyntaxKind.ExpressionStatement &&
                EmitterImpl.isSuperInvocationExpression((<ExpressionStatementSyntax>node).expression());
        }

        private static isSuperInvocationExpression(node: SyntaxNode): bool {
            return node.kind() === SyntaxKind.InvocationExpression &&
                (<InvocationExpressionSyntax>node).expression().kind() === SyntaxKind.SuperExpression;
        }

        private static isSuperMemberAccessExpression(node: ExpressionSyntax): bool {
            return node.kind() === SyntaxKind.MemberAccessExpression &&
                (<MemberAccessExpressionSyntax>node).expression().kind() === SyntaxKind.SuperExpression;
        }

        private static isSuperMemberAccessInvocationExpression(node: SyntaxNode): bool {
            return node.kind() === SyntaxKind.InvocationExpression &&
                EmitterImpl.isSuperMemberAccessExpression((<InvocationExpressionSyntax>node).expression());
        }

        private convertSuperInvocationExpression(node: InvocationExpressionSyntax): InvocationExpressionSyntax {
            var result: InvocationExpressionSyntax = super.visitInvocationExpression(node);

            var expression = MemberAccessExpressionSyntax.create1(
                Syntax.identifierName("_super"), Syntax.identifierName("call"));

            var arguments = result.argumentList().arguments().toArray();
            if (arguments.length > 0) {
                arguments.unshift(Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.space));
            }

            arguments.unshift(ThisExpressionSyntax.create1());

            return result.withExpression(expression)
                         .withArgumentList(result.argumentList().withArguments(SeparatedSyntaxList.create(arguments)))
                         .withLeadingTrivia(result.leadingTrivia());
        }

        private convertSuperMemberAccessInvocationExpression(node: InvocationExpressionSyntax): InvocationExpressionSyntax {
            var result: InvocationExpressionSyntax = super.visitInvocationExpression(node);

            var arguments = result.argumentList().arguments().toArray();
            if (arguments.length > 0) {
                arguments.unshift(Syntax.token(SyntaxKind.CommaToken).withTrailingTrivia(this.space));
            }

            arguments.unshift(ThisExpressionSyntax.create1());

            var expression = MemberAccessExpressionSyntax.create1(
                result.expression(), Syntax.identifierName("call"));
            return result.withExpression(expression)
                         .withArgumentList(result.argumentList().withArguments(SeparatedSyntaxList.create(arguments)));
        }

        private visitInvocationExpression(node: InvocationExpressionSyntax): InvocationExpressionSyntax {
            if (EmitterImpl.isSuperInvocationExpression(node)) {
                return this.convertSuperInvocationExpression(node);
            }
            else if (EmitterImpl.isSuperMemberAccessInvocationExpression(node)) {
                return this.convertSuperMemberAccessInvocationExpression(node);
            }

            return super.visitInvocationExpression(node);
        }

        private visitMemberAccessExpression(node: MemberAccessExpressionSyntax): MemberAccessExpressionSyntax {
            var result: MemberAccessExpressionSyntax = super.visitMemberAccessExpression(node);
            if (!EmitterImpl.isSuperMemberAccessExpression(result)) {
                return result;
            }

            return MemberAccessExpressionSyntax.create1(
                MemberAccessExpressionSyntax.create1(
                    Syntax.identifierName("_super"), Syntax.identifierName("prototype")),
                result.identifierName()).withLeadingTrivia(result.leadingTrivia());
        }

        private visitVariableStatement(node: VariableStatementSyntax): VariableStatementSyntax {
            var result: VariableStatementSyntax = super.visitVariableStatement(node);

            return result.withExportKeyword(null)
                         .withDeclareKeyword(null)
                         .withLeadingTrivia(result.leadingTrivia());
        }
    }

    export function emit(input: SourceUnitSyntax, options: FormattingOptions = null): SourceUnitSyntax {
        // Make sure no one is passing us a bogus tree.
        SyntaxNodeInvariantsChecker.checkInvariants(input);

        // If there's nothing typescript specific about this node, then just return it as is.
        if (!input.isTypeScriptSpecific()) {
            return input;
        }

        // Do the initial conversion. Note: the result at this point may be 'bogus'.  For example,
        // it make contain the same token instance multiple times in the tree.
        var output: SourceUnitSyntax = input.accept(
            new EmitterImpl(SyntaxInformationMap.create(input), options));

        // Make sure we clone any nodes/tokens we used in multiple places in the result.  That way
        // we don't break the invariant that all tokens in a tree are unique.
        output = output.accept(new EnsureTokenUniquenessRewriter());

        SyntaxNodeInvariantsChecker.checkInvariants(output);
        Debug.assert(!output.isTypeScriptSpecific());

        return output;
    }
}