///<reference path='References.ts' />

class SyntaxList {
    public static toJSON(list: ISyntaxList) {
        var result = [];

        for (var i = 0; i < list.count(); i++) {
            result.push(list.syntaxNodeAt(i));
        }

        return result;
    }

    public static empty: ISyntaxList = {
        toJSON: (key) => [],

        count: () => 0,

        syntaxNodeAt: (index: number): SyntaxNode => {
            throw Errors.argumentOutOfRange("index");
        }
    };

    public static create(nodes: SyntaxNode[]): ISyntaxList {
        if (nodes === null || nodes.length === 0) {
            return SyntaxList.empty;
        }

        if (nodes.length === 1) {
            var item = nodes[0];
            var list: ISyntaxList;
            list = {
                toJSON: (key) => toJSON(list),
                count: () => 1,
                syntaxNodeAt: (index: number) => {
                    if (index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }

                    return item;
                }
            };

            return list;
        }

        var list: ISyntaxList;
        list = {
            toJSON: (key) => toJSON(list),

            count: () => nodes.length,

            syntaxNodeAt: (index: number) => {
                if (index < 0 || index >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }

                return nodes[index];
            }
        };

        return list;
    }
}