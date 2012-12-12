///<reference path='References.ts' />

class SyntaxDedenter extends SyntaxRewriter {
    private lastTriviaWasNewLine = true;
    private dedentAmount: number;
    private minimumIndent: number;
    
    constructor(dedentFirstToken: bool, dedentAmount: number, minimumIndent: number) {
        super();
        this.lastTriviaWasNewLine = dedentFirstToken;
        this.dedentAmount = dedentAmount;
        this.minimumIndent = minimumIndent;
    }

    private visitToken(token: ISyntaxToken): ISyntaxToken {
        var result = token;
        if (this.lastTriviaWasNewLine) {
            // have to add our indentation to every line that this token hits.
            result = token.withLeadingTrivia(this.dedentTriviaList(token.leadingTrivia()));
        }

        var trailingTrivia = token.trailingTrivia();
        this.lastTriviaWasNewLine = 
            trailingTrivia.count() > 0 && trailingTrivia.last().kind() === SyntaxKind.NewLineTrivia;

        return result;
    }

    private dedentTriviaList(triviaList: ISyntaxTriviaList): ISyntaxTriviaList {
        var result = [];
        var dedentNextWhitespace = true;

        for (var i = 0, n = triviaList.count(); i < n; i++) {
            var trivia = triviaList.syntaxTriviaAt(i);

            if (dedentNextWhitespace && trivia.kind() === SyntaxKind.WhitespaceTrivia) {
                result.push(this.dedentWhitespace(trivia));
                dedentNextWhitespace = false;
                continue;
            }

            dedentNextWhitespace = false;

            if (trivia.kind() === SyntaxKind.MultiLineCommentTrivia) {
                // This trivia may span multiple lines.  If it does, we need to indent each 
                // successive line of it until it terminates.
                result.push(this.dedentMultiLineComment(trivia));
                continue;
            }

            // All other trivia we just append to the list.
            result.push(trivia);
            if (trivia.kind() === SyntaxKind.NewLineTrivia) {
                // We hit a newline processing the trivia.  We need to add the indentation to the 
                // next line as well.
                dedentNextWhitespace = true;
            }
        }

        return SyntaxTriviaList.create(result);
    }

    // TODO: properly handle tabs/spaces.
    private dedentWhitespace(trivia: ISyntaxTrivia): ISyntaxTrivia {
        var newLength = MathPrototype.max(trivia.fullWidth() - this.dedentAmount, this.minimumIndent);
        if (newLength === trivia.fullWidth()) {
            return trivia;
        }

        return SyntaxTrivia.createSpaces(newLength);
    }

    private dedentMultiLineComment(trivia: ISyntaxTrivia): ISyntaxTrivia {
        var segments = SyntaxTrivia.splitMultiLineCommentTriviaIntoMultipleLines(trivia);
        if (segments.length === 0) {
            return trivia;
        }

        for (var i = 1; i < segments.length; i++) {
            var segment = segments[i];
            segments[i] = this.dedentLineSegment(segment);
        }

        var result = segments.join("");

        // Create a new trivia token out of the indented lines.
        return SyntaxTrivia.create(SyntaxKind.MultiLineCommentTrivia, result);
    }

    private dedentLineSegment(segment: string): string {
        var segmentWithoutIndentation = this.removeIndentation(segment);
        var originalIndentation = segment.length - segmentWithoutIndentation.length;

        var desiredIndentation = MathPrototype.max(originalIndentation - this.dedentAmount, this.minimumIndent);

        return StringUtilities.repeat(" ", desiredIndentation) + segmentWithoutIndentation;
    }

    private removeIndentation(segment: string): string {
        var start = 0;
        while (start < segment.length && segment.charCodeAt(start) === CharacterCodes.space) {
            start++;
        }

        return segment.substring(start);
    }

    public static dedentNode(node: SyntaxNode, dedentFirstToken: bool, dedentAmount: number, minimumIndent: number): SyntaxNode {
        var dedenter = new SyntaxDedenter(dedentFirstToken, dedentAmount, minimumIndent);
        return node.accept1(dedenter);
    }

    //public static indentNodes(nodes: SyntaxNode[], indentFirstToken: bool, indentTrivia: ISyntaxTrivia): SyntaxNode[] {
    //    // Note: it is necessary for correctness that we reuse the same SyntaxIndenter here.  
    //    // That's because when working on nodes 1-N, we need to know if the previous node ended
    //    // with a newline.  The indenter will track that for us.
        
    //    var indenter = new SyntaxIndenter(indentFirstToken, indentTrivia);
        
    //    var result = ArrayUtilities.select(nodes, n => n.accept1(indenter));

    //    return result;
    //}
}