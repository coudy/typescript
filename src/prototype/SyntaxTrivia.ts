///<reference path='References.ts' />

module SyntaxTrivia {
    class SimpleSyntaxTrivia implements ISyntaxTrivia {
        private _kind: SyntaxKind;
        private _text: string;

        constructor(kind: SyntaxKind, text: string) {
            this._kind = kind;
            this._text = text;
        }

        public toJSON(key) {
            var result: any = {};
            result.kind = (<any>SyntaxKind)._map[this._kind];
            result.text = this._text;
            return result;
        }

        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return true; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind {
            return this._kind;
        }

        public fullWidth(): number {
            return this._text.length;
        }

        public fullText(): string {
            return this._text;
        }

        public collectTextElements(elements: string[]): void {
            elements.push(this.fullText());
        }
    }

    export function create(kind: SyntaxKind, text: string): ISyntaxTrivia {
        Debug.assert(kind === SyntaxKind.MultiLineCommentTrivia ||
                     kind === SyntaxKind.NewLineTrivia ||
                     kind === SyntaxKind.SingleLineCommentTrivia ||
                     kind === SyntaxKind.WhitespaceTrivia ||
                     kind === SyntaxKind.SkippedTextTrivia);
        // Debug.assert(text.length > 0);
        return new SimpleSyntaxTrivia(kind, text);
    }

    export function createSpaces(count: number): ISyntaxTrivia {
        return create(SyntaxKind.WhitespaceTrivia, StringUtilities.repeat(" ", count));
    }

    export function createWhitespace(text: string): ISyntaxTrivia {
        return create(SyntaxKind.WhitespaceTrivia, text);
    }

    export function createMultiLineComment(text: string): ISyntaxTrivia {
        return create(SyntaxKind.MultiLineCommentTrivia, text);
    }

    export var space: ISyntaxTrivia = createSpaces(1);
    export var lineFeed: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, "\n");
    export var carriageReturn: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, "\r");
    export var carriageReturnLineFeed: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, "\r\n");

    export function splitMultiLineCommentTriviaIntoMultipleLines(trivia: ISyntaxTrivia): string[] {
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
                    // Move an extra space forward if this is a crlf.
                    if (isCarriageReturnLineFeed) {
                        // Consume the \r
                        i++;
                    }

                    result.push(triviaText.substring(currentIndex, i + 1));

                    // Set the current index to *after* the newline.
                    currentIndex = i + 1;
                    continue;
            }
        }

        result.push(triviaText.substring(currentIndex));
        return result;
    }
}