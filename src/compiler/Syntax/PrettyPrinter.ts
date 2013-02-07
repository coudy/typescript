///<reference path='SyntaxNode.ts' />

module PrettyPrinter {
    export function prettyPrint(node: SyntaxNode, indentWhitespace: string = "    "): SyntaxNode {
        var impl = new PrettyPrinterImpl(indentWhitespace);
        var result = impl.visitNode(node);
        return result;
    }

    class PrettyPrinterImpl extends SyntaxRewriter {
        private previousToken: ISyntaxToken = null;
        private previousTokenParent: SyntaxNode = null;
        private indentNext: bool = false;

        private afterLineBreak: bool = true;
        private afterIndentation: bool = false;

        private indentations: ISyntaxTrivia[] = [];

        private position: number = 0;
        private nodeOrTokenStack: ISyntaxNodeOrToken[] = [];

        constructor(private indentWhitespace: string) {
            super();
        }

        public visitNode(node: SyntaxNode): SyntaxNode {
            this.nodeOrTokenStack.push(node);
            var result = super.visitNode(node);
            this.nodeOrTokenStack.pop();
            return result;
        }

        private visitToken(token: ISyntaxToken): ISyntaxToken {
            if (token === null || token.fullWidth() === 0) {
                return token;
            }

            var tokenParent = ArrayUtilities.last(this.nodeOrTokenStack);
            this.nodeOrTokenStack.push(token);

            var resultToken = this.visitTokenWorker(token, tokenParent);

            this.nodeOrTokenStack.pop();
            this.previousToken = token;
            this.previousTokenParent = tokenParent;
            this.position += token.fullWidth();

            return resultToken;
        }

        private visitTokenWorker(token: ISyntaxToken, tokenParent: SyntaxNode): ISyntaxToken {
            var resultToken = token;

            var depth = this.getDeclarationDepth(tokenParent);
            var needsIndentation = this.indentNext || (this.lineBreaksAfter2(this.previousToken, this.previousTokenParent, token, tokenParent) > 0);
            this.indentNext = false;

            resultToken = resultToken.withLeadingTrivia(this.rewriteTrivia(
                tokenParent,
                token.leadingTrivia(),
                depth,
                /*isTrailing:*/ false,
                /*mustBeIndented:*/ needsIndentation,
                /*mustHaveSeparator:*/ false,
                /*lineBreaksAfter:*/ this.lineBreaksAfter1(token)));

            var root = <SyntaxNode>this.nodeOrTokenStack[0];

            var nextToken = root.findToken(this.position + token.fullWidth());

            this.afterLineBreak = this.tokenEndsInLineBreak(token);
            this.afterIndentation = false;

            var lineBreaksAfter = this.lineBreaksAfter2(token, tokenParent, nextToken.token(), nextToken.containingNode().node());

            resultToken = resultToken.withTrailingTrivia(this.rewriteTrivia(
                tokenParent,
                token.trailingTrivia(),
                depth,
                /*isTrailing:*/ true,
                /*mustBeIndented:*/ false,
                /*mustHaveSeparator:*/ this.needsSeparator(token, tokenParent, nextToken.token(), nextToken.containingNode().node()),
                /*lineBreaksAfter:*/ lineBreaksAfter));

            if (lineBreaksAfter > 0) {
                this.indentNext = true;
            }

            return resultToken;
        }

        private getIndentation(count: number): ISyntaxTrivia {
            for (var i = this.indentations.length; i <= count; i++) {
                var text = i === 0
                    ? ""
                    : this.indentations[i - 1].fullText() + this.indentWhitespace;
                this.indentations[i] = Syntax.whitespace(text);
            }

            return this.indentations[count];
        }

        private lineBreaksAfter1(token: ISyntaxToken): number {
            return 0;
        }

        private lineBreaksAfter2(currentToken: ISyntaxToken,
                                 currentTokenParent: SyntaxNode,
                                 nextToken: ISyntaxToken,
                                 nextTokenParent: SyntaxNode): number {
            if (nextToken === null) {
                return 0;
            }

            switch (currentToken.kind()) {
                case SyntaxKind.OpenBraceToken:
                case SyntaxKind.FinallyKeyword:
                    return 1;

                case SyntaxKind.CloseBraceToken:
                    return this.lineBreaksAfterCloseBrace(nextToken, nextTokenParent);

                case SyntaxKind.CloseParenToken:
                    if (currentTokenParent.isStatement() && nextTokenParent !== currentTokenParent) {
                        return 1;
                    }

                    if (nextToken.kind() === SyntaxKind.OpenBraceToken) {
                        return 1;
                    }

                    return 0;

                case SyntaxKind.SemicolonToken:
                    return this.lineBreaksAfterSemicolon(currentToken, currentTokenParent, nextToken, nextTokenParent);

                case SyntaxKind.CommaToken:
                    return currentTokenParent.kind() === SyntaxKind.EnumDeclaration ? 1 : 0;

                case SyntaxKind.ElseKeyword:
                    return nextToken.kind() !== SyntaxKind.IfKeyword ? 1 : 0;

                case SyntaxKind.ColonToken:
                    if (currentTokenParent.kind() === SyntaxKind.LabeledStatement || currentTokenParent.isSwitchClause()) {
                        return 1;
                    }
                    break;
            }

            switch (nextToken.kind()) {
                case SyntaxKind.OpenBraceToken:
                case SyntaxKind.CloseBraceToken:
                case SyntaxKind.ElseKeyword:
                case SyntaxKind.FinallyKeyword:
                    return 1;
            }

            return 0;
        }

        private lineBreaksAfterCloseBrace(nextToken: ISyntaxToken, nextTokenParent: SyntaxNode): number {
            if (nextToken === null) {
                return 0;
            }

            if (nextToken.kind() === SyntaxKind.CloseBraceToken) {
                return 1;
            }
            else if (
                nextToken.kind() === SyntaxKind.CatchKeyword ||
                nextToken.kind() === SyntaxKind.FinallyKeyword ||
                nextToken.kind() === SyntaxKind.ElseKeyword) {
                return 1;
            }
            else if (
                nextToken.kind() === SyntaxKind.WhileKeyword &&
                nextTokenParent.kind() === SyntaxKind.DoStatement) {
                return 1;
            }
            else {
                return 2;
            }
        }

        private lineBreaksAfterSemicolon(currentToken: ISyntaxToken, currentTokenParent, nextToken: ISyntaxToken, nextTokenParent: SyntaxNode): number {
            if (currentTokenParent.kind() === SyntaxKind.ForStatement) {
                return 0;
            }
            else {
                return 1;
            }
        }

        private needsSeparator(token: ISyntaxToken, tokenParent: SyntaxNode, nextToken: ISyntaxToken, nextTokenParent: SyntaxNode): bool {
            if (tokenParent === null || nextTokenParent === null) {
                return false;
            }

            if ((SyntaxFacts.isAnyBinaryExpression(tokenParent.kind()) && this.binaryTokenNeedsSeparator(token.kind())) ||
                (SyntaxFacts.isAnyBinaryExpression(nextTokenParent.kind()) && this.binaryTokenNeedsSeparator(nextToken.kind()))) {
                return true;
            }

            if (token.kind() === SyntaxKind.GreaterThanToken && tokenParent.kind() === SyntaxKind.TypeArgumentList) {
                if (!SyntaxFacts.isAnyPunctuation(nextToken.kind())) {
                    return true;
                }
            }

            if (token.kind() === SyntaxKind.CommaToken &&
                nextToken.kind() !== SyntaxKind.CommaToken &&
                tokenParent.kind() !== SyntaxKind.EnumDeclaration) {
                return true;
            }

            if (token.kind() === SyntaxKind.SemicolonToken
                && !(nextToken.kind() === SyntaxKind.SemicolonToken || nextToken.kind() === SyntaxKind.CloseParenToken)) {
                return true;
            }

            if (token.kind() === SyntaxKind.QuestionToken && tokenParent.kind() === SyntaxKind.ConditionalExpression)
            {
                return true;
            }

            if (token.kind() === SyntaxKind.ColonToken) {
                return true;
            }

            if ((nextToken.kind() === SyntaxKind.QuestionToken || nextToken.kind() === SyntaxKind.ColonToken) &&
                nextTokenParent.kind() === SyntaxKind.ConditionalExpression) {
                return true;
            }

            if (token.kind() === SyntaxKind.CloseBracketToken && this.isWord(nextToken.kind())) {
                return true;
            }

            if (token.kind() === SyntaxKind.EqualsToken || nextToken.kind() === SyntaxKind.EqualsToken) {
                return true;
            }

            if (token.kind() === SyntaxKind.EqualsGreaterThanToken || nextToken.kind() === SyntaxKind.EqualsGreaterThanToken) {
                return true;
            }
            
            if (this.isKeyword(token.kind())) {
                if (nextToken.kind() !== SyntaxKind.ColonToken &&
                    nextToken.kind() !== SyntaxKind.DotToken &&
                    nextToken.kind() !== SyntaxKind.SemicolonToken &&
                    nextToken.kind() !== SyntaxKind.OpenBracketToken &&
                    nextToken.kind() !== SyntaxKind.CloseParenToken &&
                    nextToken.kind() !== SyntaxKind.CloseBraceToken &&
                    nextToken.kind() !== SyntaxKind.GreaterThanToken &&
                    nextToken.kind() !== SyntaxKind.CommaToken) {
                    return true;
                }
            }

            if (this.isWord(token.kind()) && this.isWord(nextToken.kind())) {
                return true;
            }
            else if (token.width() > 1 && nextToken.width() > 1) {
                var tokenLastChar = token.text().charAt(token.width() - 1);
                var nextFirstChar = nextToken.text().charAt(0);
                if (tokenLastChar === nextFirstChar && this.tokenCharacterCanBeDoubled(tokenLastChar)) {
                    return true;
                }
            }

            return false;
        }

        private binaryTokenNeedsSeparator(kind: SyntaxKind): bool {
            switch (kind) {
                case SyntaxKind.DotToken:
                    return false;
                default:
                    return SyntaxFacts.getBinaryExpressionFromOperatorToken(kind) !== SyntaxKind.None;
            }
        }

        private rewriteTrivia(tokenParent: SyntaxNode,
                              triviaList: ISyntaxTriviaList,
                              depth: number,
                              isTrailing: bool,
                              mustBeIndented: bool,
                              mustHaveSeparator: bool,
                              lineBreaksAfter: number): ISyntaxTriviaList {
            var currentTriviaList: ISyntaxTrivia[] = [];

            for (var i = 0, n = triviaList.count(); i < n; i++) {
                var trivia = triviaList.syntaxTriviaAt(i);

                if (trivia.isWhitespace() ||
                    trivia.isNewLine()) {
                    continue;
                }

                var needsSeparator =
                    (currentTriviaList.length > 0 && this.needsSeparatorBetween(ArrayUtilities.last(currentTriviaList), trivia)) ||
                    (currentTriviaList.length === 0 && isTrailing);
                var needsLineBreak =
                    this.needsLineBreakBefore(trivia, isTrailing) ||
                    (currentTriviaList.length > 0 && this.needsLineBreakBetween(ArrayUtilities.last(currentTriviaList), trivia, isTrailing));

                if (needsLineBreak && !this.afterLineBreak) {
                    currentTriviaList.push(this.getCarriageReturnLineFeed());
                    this.afterLineBreak = true;
                    this.afterIndentation = false;
                }

                if (this.afterLineBreak) {
                    if (!this.afterIndentation && this.needsIndentAfterLineBreak(trivia)) {
                        currentTriviaList.push(this.getIndentation(this.getDeclarationDepth(tokenParent)));
                        this.afterIndentation = true;
                    }
                }
                else if (needsSeparator) {
                    currentTriviaList.push(this.getSpace());
                    this.afterLineBreak = false;
                    this.afterIndentation = false;
                }

                currentTriviaList.push(trivia);

                if (this.needsLineBreakAfter(trivia, isTrailing)) {
                    currentTriviaList.push(this.getCarriageReturnLineFeed());
                    this.afterLineBreak = true;
                    this.afterIndentation = false;
                }
            }

            if (lineBreaksAfter > 0) {
                if (currentTriviaList.length > 0 && this.triviaEndsInLineBreak(ArrayUtilities.last(currentTriviaList))) {
                    lineBreaksAfter--;
                }

                for (var i = 0; i < lineBreaksAfter; i++) {
                    currentTriviaList.push(this.getCarriageReturnLineFeed());
                    this.afterLineBreak = true;
                    this.afterIndentation = false;
                }
            }
            else if (mustBeIndented) {
                currentTriviaList.push(this.getIndentation(depth));
                this.afterIndentation = true;
            }
            else if (mustHaveSeparator) {
                currentTriviaList.push(this.getSpace());
                this.afterLineBreak = false;
                this.afterIndentation = false;
            }

            return Syntax.triviaList(currentTriviaList);
        }

        private getSpace(): ISyntaxTrivia {
            return Syntax.spaceTrivia;
        }

        private getCarriageReturnLineFeed(): ISyntaxTrivia {
            return Syntax.carriageReturnLineFeedTrivia;
        }

        private needsSeparatorBetween(trivia: ISyntaxTrivia, next: ISyntaxTrivia): bool {
            if (trivia.isWhitespace()) {
                return false;
            }

            return true;
        }

        private needsLineBreakBetween(trivia: ISyntaxTrivia, next: ISyntaxTrivia, isTrailingTrivia: bool): bool {
            if (this.triviaEndsInLineBreak(trivia)) {
                return false;
            }

            switch (next.kind()) {
                case SyntaxKind.SingleLineCommentTrivia:
                case SyntaxKind.MultiLineCommentTrivia:
                    return !isTrailingTrivia;
                default:
                    return false;
            }
        }

        private needsLineBreakBefore(trivia: ISyntaxTrivia, isTrailingTrivia: bool): bool {
            return false;
        }

        private needsLineBreakAfter(trivia: ISyntaxTrivia, isTrailingTrivia: bool): bool {
            switch (trivia.kind()) {
                case SyntaxKind.SingleLineCommentTrivia:
                    return true;
                case SyntaxKind.MultiLineCommentTrivia:
                    return !isTrailingTrivia;
                default:
                    return false;
            }
        }

        private needsIndentAfterLineBreak(trivia: ISyntaxTrivia): bool {
            switch (trivia.kind()) {
                case SyntaxKind.SingleLineCommentTrivia:
                case SyntaxKind.MultiLineCommentTrivia:
                    return true;
                default:
                    return false;
            }
        }

        private tokenEndsInLineBreak(token: ISyntaxToken): bool {
            return false;
        }

        private triviaEndsInLineBreak(trivia: ISyntaxTrivia): bool {
            return trivia.isNewLine();
        }

        private isWord(kind: SyntaxKind): bool {
            return kind === SyntaxKind.IdentifierName || this.isKeyword(kind);
        }

        private isKeyword(kind: SyntaxKind): bool {
            return SyntaxFacts.isAnyKeyword(kind);
        }

        private tokenCharacterCanBeDoubled(c: string): bool {
            switch (c) {
                case '+':
                case '-':
                case '<':
                case ':':
                case '?':
                case '=':
                case '"':
                    return true;
                default:
                    return false;
            }
        }

        private parent(node: SyntaxNode): SyntaxNode {
            for (var i = 1; i < this.nodeOrTokenStack.length; i++) {
                if (node === this.nodeOrTokenStack[i]) {
                    return <SyntaxNode>this.nodeOrTokenStack[i - 1];
                }
            }

            return null;
        }

        private getDeclarationDepth(node: SyntaxNode): number {
            if (node !== null) {
                var parent = this.parent(node);
                if (parent !== null) {
                    if (parent.kind() === SyntaxKind.SourceUnit) {
                        return 0;
                    }

                    var parentDepth = this.getDeclarationDepth(parent);

                    if (node.kind() === SyntaxKind.IfStatement && parent.kind() === SyntaxKind.ElseClause) {
                        return parentDepth;
                    }

                    if (parent.kind() === SyntaxKind.Block ||
                        (node.isStatement() && node.kind() !== SyntaxKind.Block)) {
                        // all nested statements are indented one level
                        return parentDepth + 1;
                    }

                    if (node.isSwitchClause()) {
                        return parentDepth + 1;
                    }

                    return parentDepth;
                }
            }

            return 0;
        }
    }
}