///<reference path='CharacterCodes.ts' />
///<reference path='Debug.ts' />
///<reference path='ISyntaxTrivia.ts' />
///<reference path='StringUtilities.ts' />

module Syntax {
    class SyntaxTrivia implements ISyntaxTrivia {
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

        public kind(): SyntaxKind {
            return this._kind;
        }

        public fullWidth(): number {
            return this._text.length;
        }

        public fullText(): string {
            return this._text;
        }

        public isComment(): bool {
            return this.kind() === SyntaxKind.SingleLineCommentTrivia || this.kind() === SyntaxKind.MultiLineCommentTrivia;
        }

        public isNewLine(): bool {
            return this.kind() === SyntaxKind.NewLineTrivia;
        }

        public isSkippedText(): bool {
            return this.kind() === SyntaxKind.SkippedTextTrivia;
        }

        public collectTextElements(elements: string[]): void {
            elements.push(this.fullText());
        }
    }

    export function trivia(kind: SyntaxKind, text: string): ISyntaxTrivia {
        Debug.assert(kind === SyntaxKind.MultiLineCommentTrivia ||
                     kind === SyntaxKind.NewLineTrivia ||
                     kind === SyntaxKind.SingleLineCommentTrivia ||
                     kind === SyntaxKind.WhitespaceTrivia ||
                     kind === SyntaxKind.SkippedTextTrivia);
        Debug.assert(text.length > 0);
        return new SyntaxTrivia(kind, text);
    }

    export function spaces(count: number): ISyntaxTrivia {
        return trivia(SyntaxKind.WhitespaceTrivia, StringUtilities.repeat(" ", count));
    }

    export function whitespace(text: string): ISyntaxTrivia {
        return trivia(SyntaxKind.WhitespaceTrivia, text);
    }

    export function multiLineComment(text: string): ISyntaxTrivia {
        return trivia(SyntaxKind.MultiLineCommentTrivia, text);
    }

    export function singleLineComment(text: string): ISyntaxTrivia {
        return trivia(SyntaxKind.SingleLineCommentTrivia, text);
    }

    export var spaceTrivia: ISyntaxTrivia = spaces(1);
    export var lineFeedTrivia: ISyntaxTrivia = trivia(SyntaxKind.NewLineTrivia, "\n");
    export var carriageReturnTrivia: ISyntaxTrivia = trivia(SyntaxKind.NewLineTrivia, "\r");
    export var carriageReturnLineFeedTrivia: ISyntaxTrivia = trivia(SyntaxKind.NewLineTrivia, "\r\n");

    // Breaks a multiline trivia up into individual line components.  If the trivia doesn't span
    // any lines, then the result will be a single string with the entire text of the trivia. 
    // Otherwise, there will be one entry in the array for each line spanned by the trivia.  Each
    // entry will contain the line separator at the end of the string.
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
                        // Consume the \r
                        i++;
                    }

                // Fall through.

                case CharacterCodes.lineFeed:
                case CharacterCodes.paragraphSeparator:
                case CharacterCodes.lineSeparator:
                    // Eat from the last stating position through to the end of the newline.
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