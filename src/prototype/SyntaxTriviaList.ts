///<reference path='References.ts' />

module SyntaxTriviaList {
    class EmptySyntaxTriviaList implements ISyntaxTriviaList {
        public count(): number {
            return 0;
        }
        
        public syntaxTriviaAt(index: number): ISyntaxTrivia {
            throw Errors.argumentOutOfRange("index");
        }

        public toJSON(key) {
            return [];
        }
    }

    export var empty: ISyntaxTriviaList = new EmptySyntaxTriviaList();

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

        public toJSON(key) {
            return this.trivia;
        }
    }

    export function create(...trivia: ISyntaxTrivia[]): ISyntaxTriviaList {
        if (trivia === null || trivia.length === 0) {
            return SyntaxTriviaList.empty;
        }

        if (trivia.length === 1) {
            return new SingletonSyntaxTriviaList(trivia[0]);
        }

        return new NormalSyntaxTriviaList(trivia);
    }
}