///<reference path='References.ts' />

class SyntaxNodeList {
    public static empty: ISyntaxNodeList = {
        count: () => {
            return 0;
        },

        syntaxNodeAt: (index: number): SyntaxNode => {
            throw Errors.argumentOutOfRange("index");
        }
    };

    public static create(nodes: SyntaxNode[]): ISyntaxNodeList {
        if (nodes === null || nodes.length === 0) {
            return SyntaxNodeList.empty;
        }

        if (nodes.length === 1) {
            var item = nodes[0];
            return {
                count: () => 1,
                syntaxNodeAt: (index: number) => {
                    if (index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }

                    return item;
                }
            };
        }

        return {
            count: () => nodes.length,

            syntaxNodeAt: (index: number) => {
                if (index < 0 || index >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }

                return nodes[index];
            }
        };
    }
}