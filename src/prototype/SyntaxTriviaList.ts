///<reference path='References.ts' />

class SyntaxTriviaList {
    public static empty: ISyntaxTriviaList = {
        count: () => {
            return 0;
        },

        syntaxTriviaAt: (index: number): ISyntaxTrivia => {
            throw Errors.argumentOutOfRange("index");
        }
    };

    public static create(...trivia: ISyntaxTrivia[]): ISyntaxTriviaList {
        if (trivia === null || trivia.length === 0) {
            return SyntaxTriviaList.empty;
        }

        if (trivia.length === 1) {
            var item = trivia[0];
            return {
                count: () => 1,

                syntaxTriviaAt: (index: number) => {
                    if (index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }

                    return item;
                }
            };
        }

        return {
            count: () => trivia.length,

            syntaxTriviaAt: (index: number) => {
                if (index < 0 || index >= trivia.length) {
                    throw Errors.argumentOutOfRange("index");
                }

                return trivia[index];
            }
        };
    }
}