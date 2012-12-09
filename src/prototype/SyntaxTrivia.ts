///<reference path='References.ts' />

module SyntaxTrivia {
    class SimpleSyntaxTrivia implements ISyntaxTrivia {
        private _kind: SyntaxKind;
        private _text: string;

        constructor(kind: SyntaxKind, text: string) {
            this._kind = kind;
            this._text = text;
        }

        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return true; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind {
            return this._kind;
        }

        public fullStart(): number {
            throw Errors.notYetImplemented();
        }

        public fullWidth(): number {
            return this._text.length;
        }

        public fullText(text: IText): string {
            return this._text;
        }
    }

    export function createTrivia(kind: SyntaxKind, text: string): ISyntaxTrivia {
        Debug.assert(kind === SyntaxKind.MultiLineCommentTrivia ||
                     kind === SyntaxKind.NewLineTrivia ||
                     kind === SyntaxKind.SingleLineCommentTrivia ||
                     kind === SyntaxKind.WhitespaceTrivia);
        return new SimpleSyntaxTrivia(kind, text);
    }

    export var space: ISyntaxTrivia = createTrivia(SyntaxKind.WhitespaceTrivia, " ");
}