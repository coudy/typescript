///<reference path='References.ts' />

module SyntaxTriviaList {
    class EmptySyntaxTriviaList implements ISyntaxTriviaList {
        public count(): number {
            return 0;
        }
        
        public syntaxTriviaAt(index: number): ISyntaxTrivia {
            throw Errors.argumentOutOfRange("index");
        }

        public fullWidth(): number {
            return 0;
        }

        public fullText(text: IText): string {
            return "";
        }

        public hasComment(): bool {
            return false;
        }

        public hasNewLine(): bool {
            return false;
        }

        public toJSON(key) {
            return [];
        }
    }

    export var empty: ISyntaxTriviaList = new EmptySyntaxTriviaList();

    function isComment(trivia: ISyntaxTrivia): bool {
        return trivia.kind() === SyntaxKind.MultiLineCommentTrivia || trivia.kind() === SyntaxKind.SingleLineCommentTrivia;
    }

    class SingletonSyntaxTriviaList implements ISyntaxTriviaList {
        private item: ISyntaxTrivia;
        
        constructor(item: ISyntaxTrivia) {
            this.item = item;
        }

        public count(): number {
            return 1;
        }

        public syntaxTriviaAt(index: number): ISyntaxTrivia {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        public fullWidth(): number {
            return this.item.fullWidth();
        }

        public fullText(text: IText): string {
            return this.item.fullText(text);
        }

        public hasComment(): bool {
            return isComment(this.item);
        }

        public hasNewLine(): bool {
            return this.item.kind() === SyntaxKind.NewLineTrivia;
        }

        public toJSON(key) {
            return [this.item];
        }
    }

    class NormalSyntaxTriviaList implements ISyntaxTriviaList {
        private trivia: ISyntaxTrivia[];

        constructor(trivia: ISyntaxTrivia[]) {
            this.trivia = trivia;
        }

        public count() {
            return this.trivia.length;
        }

        public syntaxTriviaAt(index: number): ISyntaxTrivia {
            if (index < 0 || index >= this.trivia.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.trivia[index];
        }

        public fullWidth(): number {
            return ArrayUtilities.sum(this.trivia, t => t.fullWidth());
        }

        public fullText(text: IText): string {
            var result = "";

            for (var i = 0, n = this.trivia.length; i < n; i++) {
                result += this.trivia[i].fullText(text);
            }

            return result;
        }

        public hasComment(): bool {
            return ArrayUtilities.any(this.trivia, isComment);
        }

        public hasNewLine(): bool {
            return ArrayUtilities.any(this.trivia, t => t.kind() === SyntaxKind.NewLineTrivia);
        }

        public toJSON(key) {
            return this.trivia;
        }
    }

    export function create(trivia: ISyntaxTrivia[]): ISyntaxTriviaList {
        if (trivia === undefined || trivia === null || trivia.length === 0) {
            return SyntaxTriviaList.empty;
        }

        if (trivia.length === 1) {
            return new SingletonSyntaxTriviaList(trivia[0]);
        }

        return new NormalSyntaxTriviaList(trivia);
    }
}