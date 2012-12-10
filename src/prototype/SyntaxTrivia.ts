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
                     kind === SyntaxKind.WhitespaceTrivia);
        Debug.assert(text.length > 0);
        return new SimpleSyntaxTrivia(kind, text);
    }

    export var space: ISyntaxTrivia = create(SyntaxKind.WhitespaceTrivia, " ");
    export var lineFeed: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, "\n");
    export var carriageReturn: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, "\r");
    export var carriageReturnLineFeed: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, "\r\n");
}