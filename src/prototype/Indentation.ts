///<reference path='References.ts' />

class Indentation {
    // The raw character position of the indentation in the in the line. This will
    // range between [0, line.Length).
    private _linePosition: number;

    // The column position of the indentation in the line.  This will be equal to the
    // linePosition if the indentation is all spaces, but it can greater if there are tabs in
    // the indent that expand out to more than 1 space.
    public _column: number;

    constructor(linePosition: number, column: number) {
        this._linePosition = linePosition;
        this._column = column;
    }

    public linePosition(): number {
        return this._linePosition;
    }

    public column(): number {
        return this._column;
    }

    public static indentationForLineContainingToken(token: ISyntaxToken, syntaxInformationMap: SyntaxInformationMap, spacesPerTab: number) {
        // Walk backward through the tokens until we find the first one on the line.
        var firstToken = syntaxInformationMap.firstTokenOnLineContainingToken(token);

        return Indentation.indentationForFirstTokenOnLine(firstToken, spacesPerTab);
    }

    // Returns the indentation for this token.  The presumption is that this token is the first one
    // on the line.  If it isn't, then this will not return what you want.
    private static indentationForFirstTokenOnLine(firstTokenOnLine: ISyntaxToken, spacesPerTab: number) {
        var leadingTrivia = firstTokenOnLine.leadingTrivia();

        // Collect all the trivia that precedes this token.  Stopping when we hit a newline trivia
        // or a multiline comment that spans multiple lines.
        var indentationTextInReverse: string[] = [];
        for (var i = leadingTrivia.count() - 1; i >= 0; i--) {
            var trivia = leadingTrivia.syntaxTriviaAt(i);
            if (trivia.kind() === SyntaxKind.NewLineTrivia) {
                break;
            }

            if (trivia.kind() === SyntaxKind.MultiLineCommentTrivia) {
                var lineSegments = Indentation.splitMultiLineCommentTriviaIntoMultipleLines(trivia);
                indentationTextInReverse.push(ArrayUtilities.last(lineSegments));

                if (lineSegments.length > 0) {
                    // This multiline comment actually spanned multiple lines.  So we're done.
                    break;
                }

                // It was only on a single line, so keep on going.
            }

            indentationTextInReverse.push(trivia.fullText());
        }

        var linePosition = 0;
        var column = 0;

        // walk backwards.  This means we're actually walking forward from column 0 to the start of
        // the token.
        for (var i = indentationTextInReverse.length - 1; i >= 0; i--) {
            var indentationChunk = indentationTextInReverse[i];

            for (var j = 0; j < indentationChunk.length; j++) {
                var ch = indentationChunk.charCodeAt(j);

                linePosition++;
                if (ch === CharacterCodes.tab) {
                    column += spacesPerTab - column % spacesPerTab;
                }
                else {
                    column++;
                }
            }
        }

        return new Indentation(linePosition, column);
    }

    private static splitMultiLineCommentTriviaIntoMultipleLines(trivia: ISyntaxTrivia): string[] {
        Debug.assert(trivia.kind() === SyntaxKind.MultiLineCommentTrivia);
        var result: string[] = [];

        var triviaText = trivia.fullText();
        var currentIndex = 0;

        for (var i = 0; i < triviaText.length; i++) {
            var ch = triviaText.charCodeAt(i);

            // When we run into a newline for the first time, create the string builder and copy
            // all the values up to this newline into it.
            var isCarriageReturnLineFeed = false;
            switch (ch) {
                case CharacterCodes.carriageReturn:
                    if (i < triviaText.length - 1 && triviaText.charCodeAt(i + 1) === CharacterCodes.lineFeed) {
                        isCarriageReturnLineFeed = true;
                    }

                // Fall through.

                case CharacterCodes.lineFeed:
                case CharacterCodes.paragraphSeparator:
                case CharacterCodes.lineSeparator:
                    result.push(triviaText.substring(currentIndex, i));

                    // Move an extra space forward if this is a crlf.
                    if (isCarriageReturnLineFeed) {
                        i++;
                    }

                    // Set the current index to *after* the newline.
                    currentIndex = i + 1;
                    continue;
            }
        }

        result.push(triviaText.substring(currentIndex));
        return result;
    }

    public static indentationString(column: number, useTabs: bool, spacesPerTab: number): string {
        var numberOfTabs = 0;
        var numberOfSpaces = MathPrototype.max(0, column);

        if (useTabs) {
            numberOfTabs = column / spacesPerTab;
            numberOfSpaces -= numberOfTabs * spacesPerTab;
        }

        return StringUtilities.repeat('\t', numberOfTabs) +
               StringUtilities.repeat(' ', numberOfSpaces);
    }

    public static indentationTrivia(column: number, useTabs: bool, spacesPerTab: number): ISyntaxTrivia {
        return SyntaxTrivia.create(SyntaxKind.WhitespaceTrivia, this.indentationString(column, useTabs, spacesPerTab));
    }
}