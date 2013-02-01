/// <reference path='Syntax\SyntaxWalker.generated.ts' />
/// <reference path='Syntax\SyntaxInformationMap.ts' />
/// <reference path='ast.ts' />

module TypeScript {
    class SyntaxTreeToAstWalker extends SyntaxWalker {
        private position: number = 0;
        private nestingLevel = 0;

        private varLists: ASTList[] = [];
        private scopeLists: ASTList[] = [];
        private staticsLists: ASTList[] = [];

        private syntaxInformationMap: SyntaxInformationMap = null;

        private hasEscapeSequence(token: ISyntaxToken): bool {
            // TODO: implement this.
            return false;
        }

        private identifierFromToken(token: ISyntaxToken): Identifier {
            if (token.fullWidth() === 0) {
                var result: Identifier = new MissingIdentifier();
                //memberName.minChar = this.scanner.startPos;
                //memberName.limChar = this.scanner.startPos;
                result.flags |= ASTFlags.Error;

                return result;
            }
            else {
                var result = new Identifier(token.text(), this.hasEscapeSequence(token));

                result.minChar = this.syntaxInformationMap.start(token);
                result.limChar = this.syntaxInformationMap.end(token);

                return result;
            }
        }

        private createRef(text: string, hasEscapeSequence: bool, minChar: number): Identifier {
            var id = new Identifier(text, hasEscapeSequence);
            id.minChar = minChar;
            return id;
        }

        private pushDeclLists() {
            this.staticsLists.push(new ASTList());
            this.varLists.push(new ASTList());
            this.scopeLists.push(new ASTList());
        }

        private popDeclLists() {
            this.staticsLists.pop();
            this.varLists.pop();
            this.scopeLists.pop();
        }

        private topVarList() {
            return this.varLists[this.varLists.length - 1];
        }

        private topScopeList() {
            return this.scopeLists[this.scopeLists.length - 1];
        }

        private topStaticsList() {
            return this.staticsLists[this.staticsLists.length - 1];
        }

        private convertComment(trivia: ISyntaxTrivia): Comment {
            throw Errors.notYetImplemented();
        }

        private convertComments(triviaList: ISyntaxTriviaList): Comment[]{
            var result: Comment[] = [];

            for (var i = 0, n = triviaList.count(); i < n; i++) {
                var trivia = triviaList.syntaxTriviaAt(i);

                if (trivia.isComment()) {
                    result.push(this.convertComment(trivia));
                }
            }
            
            return result;
        }

        private convertLeadingComments(token: ISyntaxToken): Comment[] {
            if (!token.hasLeadingComment()) {
                return null;
            }

            return this.convertComments(token.leadingTrivia());
        }

        private convertTrailingComments(token: ISyntaxToken): Comment[] {
            if (!token.hasTrailingComment()) {
                return null;
            }

            return this.convertComments(token.trailingTrivia());
        }

        private visitEnumDeclaration(enumDeclaration: EnumDeclarationSyntax): ModuleDeclaration {
            var name = this.identifierFromToken(enumDeclaration.identifier());

            var membersMinChar = this.syntaxInformationMap.start(enumDeclaration.openBraceToken());
            this.pushDeclLists();

            var members = new ASTList();
            members.minChar = membersMinChar;
            var mapDecl = new VarDecl(new Identifier("_map"), 0);
            mapDecl.varFlags |= VarFlags.Exported;
            mapDecl.varFlags |= VarFlags.Private;

            // REVIEW: Is this still necessary?
            mapDecl.varFlags |= (VarFlags.Property | VarFlags.Public);
            mapDecl.init = new UnaryExpression(NodeType.ArrayLit, null);
            members.append(mapDecl);
            var lastValue: NumberLiteral = null;
            var memberNames: Identifier[] = [];

            for (var i = 0, n = enumDeclaration.variableDeclarators().nonSeparatorCount(); i < n; i++) {
                var variableDeclarator = <VariableDeclaratorSyntax>enumDeclaration.variableDeclarators().nonSeparatorAt(i);

                var minChar = this.syntaxInformationMap.start(variableDeclarator);
                var limChar;
                var memberName: Identifier = this.identifierFromToken(variableDeclarator.identifier());
                var memberValue: AST = null;
                var preComments = null;
                var postComments = null;

                limChar = this.syntaxInformationMap.start(variableDeclarator.identifier());
                preComments = this.convertComments(variableDeclarator.identifier().trailingTrivia());
                
                if (variableDeclarator.equalsValueClause() !== null) {
                    postComments = this.convertComments(variableDeclarator.equalsValueClause().equalsToken().trailingTrivia());
                    memberValue = variableDeclarator.equalsValueClause().value().accept(this);
                    lastValue = <NumberLiteral>memberValue;
                    limChar = this.syntaxInformationMap.end(variableDeclarator.equalsValueClause());
                }
                else {
                    if (lastValue == null) {
                        memberValue = new NumberLiteral(0);
                        lastValue = <NumberLiteral>memberValue;
                    }
                    else {
                        memberValue = new NumberLiteral(lastValue.value + 1);
                        lastValue = <NumberLiteral>memberValue;
                    }
                    var map: BinaryExpression =
                        new BinaryExpression(NodeType.Asg,
                                             new BinaryExpression(NodeType.Index,
                                                                  new Identifier("_map"),
                                                                  memberValue),
                                             new StringLiteral('"' + memberName.actualText + '"'));
                    members.append(map);
                }
                var member = new VarDecl(memberName, this.nestingLevel);
                member.minChar = minChar;
                member.limChar = limChar;
                member.init = memberValue;
                // Note: Leave minChar, limChar as "-1" on typeExpr as this is a parsing artifact.
                member.typeExpr = new TypeReference(this.createRef(name.actualText, name.hasEscapeSequence, -1), 0);
                member.varFlags |= (VarFlags.Readonly | VarFlags.Property);

                if (memberValue.nodeType == NodeType.NumberLit) {
                    member.varFlags |= VarFlags.Constant;
                }
                else if (memberValue.nodeType === NodeType.Lsh) {
                    // If the initializer is of the form "value << value" then treat it as a constant
                    // as well.
                    var binop = <BinaryExpression>memberValue;
                    if (binop.operand1.nodeType === NodeType.NumberLit && binop.operand2.nodeType === NodeType.NumberLit) {
                        member.varFlags |= VarFlags.Constant;
                    }
                }
                else if (memberValue.nodeType === NodeType.Name) {
                    // If the initializer refers to an earlier enum value, then treat it as a constant
                    // as well.
                    var nameNode = <Identifier>memberValue;
                    for (var i = 0; i < memberNames.length; i++) {
                        var memberName = memberNames[i];
                        if (memberName.text === nameNode.text) {
                            member.varFlags |= VarFlags.Constant;
                            break;
                        }
                    }
                }

                member.preComments = preComments;
                members.append(member);
                member.postComments = postComments;
                // all enum members are exported
                member.varFlags |= VarFlags.Exported;
            }

            var endingToken = new ASTSpan();
            endingToken.minChar = this.syntaxInformationMap.start(enumDeclaration.closeBraceToken());
            endingToken.limChar = this.syntaxInformationMap.end(enumDeclaration.closeBraceToken());

            members.limChar = endingToken.limChar;
            var modDecl = new ModuleDeclaration(name, members, this.topVarList(), this.topScopeList(), endingToken);
            modDecl.modFlags |= ModuleFlags.IsEnum;
            this.popDeclLists();

            return modDecl;
        }

        private visitQualifiedName(name: QualifiedNameSyntax): AST[] {
            var result: AST[] = [];

            var current: INameSyntax = name;
            while (true) {
                var identifier = current.kind() === SyntaxKind.QualifiedName
                    ? (<QualifiedNameSyntax>current).right()
                    : <ISyntaxToken>current;

                var id = this.identifierFromToken(identifier);
                id.preComments = this.convertTrailingComments(identifier);
                result.splice(0, 0, id);

                if (current.kind() !== SyntaxKind.QualifiedName) {
                    break;
                }

                current = (<QualifiedNameSyntax>current).left();
            }

            return result;
        }

        private visitImportDeclaration(importDeclaration: ImportDeclarationSyntax): ImportDeclaration {
            return null;
        }
    }
}