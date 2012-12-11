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
            result.push(trivia);

            if (trivia.kind() === SyntaxKind.NewLineTrivia) {
                // We hit a newline processing the trivia.  We need to add the indentation to the 
                // next line as well.
                result.push(this.indentationTrivia);
            }
        }

        return SyntaxTriviaList.create(result);
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