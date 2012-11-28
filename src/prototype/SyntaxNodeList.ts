///<reference path='References.ts' />

class SyntaxNodeList {
    public static toJSON(list: ISyntaxNodeList) {
        var result = [];

        for (var i = 0; i < list.count(); i++) {
            result.push(list.syntaxNodeAt(i));
        }

        return result;
    }

    public static empty: ISyntaxNodeList = {
        toJSON: (key) => [],

        count: () => 0,

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
            var list: ISyntaxNodeList;
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

        var list: ISyntaxNodeList;
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