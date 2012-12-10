///<reference path='References.ts' />

module SyntaxTrivia {
    class SimpleSyntaxTrivia implements ISyntaxTrivia {
        private _kind: SyntaxKind;
        private _fullStart: number;
        private _text: string;

        constructor(kind: SyntaxKind, fullStart: number, text: string) {
            this._kind = kind;
            this._fullStart = fullStart;
            this._text = text;
        }

        public toJSON(key) {
            var result: any = {};
            result.kind = (<any>SyntaxKind)._map[this._kind];
            result.fullStart = this._fullStart;
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

        public fullStart(): number {
            return this._fullStart;
        }

        public fullWidth(): number {
            return this._text.length;
        }

        public fullText(): string {
            return this._text;
        }

        public collectTextElements(text: IText, elements: string[]): void {
            elements.push(this.fullText());
        }

        public withFullStart(fullStart: number): ISyntaxTrivia {
            return new SimpleSyntaxTrivia(this._kind, fullStart, this._text);
        }
    }

    export function create(kind: SyntaxKind, fullStart: number, text: string): ISyntaxTrivia {
        Debug.assert(kind === SyntaxKind.MultiLineCommentTrivia ||
                     kind === SyntaxKind.NewLineTrivia ||
                     kind === SyntaxKind.SingleLineCommentTrivia ||
                     kind === SyntaxKind.WhitespaceTrivia);
        Debug.assert(text.length > 0);
        return new SimpleSyntaxTrivia(kind, fullStart, text);
    }

    export var space: ISyntaxTrivia = create(SyntaxKind.WhitespaceTrivia, 0, " ");
    export var lineFeed: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, 0, "\n");
    export var carriageReturn: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, 0, "\r");
    export var carriageReturnLineFeed: ISyntaxTrivia = create(SyntaxKind.NewLineTrivia, 0, "\r\n");
}