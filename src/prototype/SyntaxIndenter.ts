///<reference path='References.ts' />

class SyntaxIndenter extends SyntaxRewriter {
    private lastTriviaWasNewLine = true;
    private indentationTrivia: ISyntaxTrivia;
    
    constructor(indentFirstToken: bool, indentationTrivia: ISyntaxTrivia) {
        super();
        this.lastTriviaWasNewLine = indentFirstToken;
        this.indentationTrivia = indentationTrivia;
    }

    private visitToken(token: ISyntaxToken): ISyntaxToken {
        var result = token;
        if (this.lastTriviaWasNewLine) {
            // have to add our indentation to every line that this token hits.
            result = token.withLeadingTrivia(this.adjustIndentation(token.leadingTrivia()));
        }

        var trailingTrivia = token.trailingTrivia();
        this.lastTriviaWasNewLine = 
            trailingTrivia.count() > 0 && trailingTrivia.last().kind() === SyntaxKind.NewLineTrivia;

        return result;
    }

    private adjustIndentation(triviaList: ISyntaxTriviaList): ISyntaxTriviaList {
        var result = [this.indentationTrivia];

        for (var i = 0, n = triviaList.count(); i < n; i++) {
            var trivia = triviaList.syntaxTriviaAt(i);

            if (trivia.kind() === SyntaxKind.MultiLineCommentTrivia) {
                // This trivia may span multiple lines.  If it does, we need to indent each 
                // successive line of it until it terminates.
                result.push(this.adjustMultiLineCommentIndentation(trivia));
                continue;
            }

            // All other trivia we just append to the list.
            result.push(trivia);
            if (trivia.kind() === SyntaxKind.NewLineTrivia) {
                // We hit a newline processing the trivia.  We need to add the indentation to the 
                // next line as well.
                result.push(this.indentationTrivia);
            }
        }

        return SyntaxTriviaList.create(result);
    }

    private adjustMultiLineCommentIndentation(trivia: ISyntaxTrivia): ISyntaxTrivia {
        var oldTriviaText = trivia.fullText();
        var newTriviaText: number[] = null;
        var indentationText = this.indentationTrivia.fullText();
        
        for (var i = 0; i < oldTriviaText.length; i++) {
            var ch = oldTriviaText.charCodeAt(i);

            // When we run into a newline for the first time, create the string builder and copy
            // all the values up to this newline into it.
            switch (ch) {
                case CharacterCodes.carriageReturn:
                case CharacterCodes.lineFeed:
                case CharacterCodes.paragraphSeparator:
                case CharacterCodes.lineSeparator:
                    if (newTriviaText === null) {
                        newTriviaText = [];
                        StringUtilities.copyTo(oldTriviaText, 0, newTriviaText, 0, i);
                    }
            }

            // Add the character to the string builder if we have one.
            if (newTriviaText !== null) {
                newTriviaText.push(ch);
            }

            // Now, if the character was a newline, then add an indent after that so that all 
            // subsequent characters will be offset properly.
            switch (ch) {
                case CharacterCodes.carriageReturn:
                    // \r\n  case.
                    // If the next character is a linefeed, then don't add the indent yet.  We want
                    // to add it once we process that character instead.
                    if (i < oldTriviaText.length - 1 && oldTriviaText.charCodeAt(i + 1) === CharacterCodes.lineFeed) {
                        continue;
                    }

                    // Otherwise, fall through.

                case CharacterCodes.lineFeed:
                case CharacterCodes.paragraphSeparator:
                case CharacterCodes.lineSeparator:
                    // Now add the indent as well.
                    StringUtilities.copyTo(
                        indentationText, 0, newTriviaText, newTriviaText.length, indentationText.length);
            }
        }

        // if there were no newlines, we can return it as is.
        if (newTriviaText === null) {
            return trivia;
        }

        // Create a new trivia token out of the indented lines.
        return SyntaxTrivia.create(SyntaxKind.MultiLineCommentTrivia, StringUtilities.fromCharCodeArray(newTriviaText));
    }

    public static indentNode(node: SyntaxNode, indentFirstToken: bool, indentTrivia: ISyntaxTrivia): SyntaxNode {
        var indenter = new SyntaxIndenter(indentFirstToken, indentTrivia);
        return node.accept1(indenter);
    }

    public static indentNodes(nodes: SyntaxNode[], indentFirstToken: bool, indentTrivia: ISyntaxTrivia): SyntaxNode[] {
        // Note: it is necessary for correctness that we reuse the same SyntaxIndenter here.  
        // That's because when working on nodes 1-N, we need to know if the previous node ended
        // with a newline.  The indenter will track that for us.
        
        var indenter = new SyntaxIndenter(indentFirstToken, indentTrivia);
        
        var result = ArrayUtilities.select(nodes, n => n.accept1(indenter));

        return result;
    }
}