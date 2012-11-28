///<reference path='References.ts' />

class SeparatedSyntaxList {
    public static empty: ISeparatedSyntaxList = {
        toJSON: (key) => [],

        count: () => 0,
        syntaxNodeCount: () => 0,
        separatorCount: () => 0,

        itemAt: (index: number): any => {
            throw Errors.argumentOutOfRange("index");
        },

        syntaxNodeAt: (index: number): SyntaxNode => {
            throw Errors.argumentOutOfRange("index");
        },

        separatorAt: (index: number): ISyntaxToken => {
            throw Errors.argumentOutOfRange("index");
        }
    };

    private static toJSON(list: ISeparatedSyntaxList) {
        var result = [];

        for (var i = 0; i < list.count(); i++) {
            result.push(list.itemAt(i));
        }

        return result;
    }

    public static create(nodes: any[]): ISeparatedSyntaxList {
        if (nodes === null || nodes.length === 0) {
            return SeparatedSyntaxList.empty;
        }

        for (var i = 0; i < nodes.length; i++) {
            var item = nodes[i];

            if (i % 2 === 0) {
                Debug.assert(!SyntaxFacts.isTokenKind(item.kind()));
            }
            else {
                Debug.assert(SyntaxFacts.isTokenKind(item.kind()));
            }
        }

        if (nodes.length === 1) {
            var item = nodes[0];
            var list: ISeparatedSyntaxList;
            list = {
                toJSON: (key) => toJSON(list),

                count: () => 1,
                syntaxNodeCount: () => 1,
                separatorCount: () => 0,

                itemAt: (index: number): any => {
                    if (index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }

                    return item;
                },

                syntaxNodeAt: (index: number) => {
                    if (index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }

                    return item;
                },

                separatorAt: (index: number): ISyntaxToken => {
                    throw Errors.argumentOutOfRange("index");
                }
            };

            return list;
        }

        var list: ISeparatedSyntaxList;
        list = {
            toJSON: (key) => toJSON(list),

            count: () => nodes.length,
            syntaxNodeCount: () => IntegerUtilities.integerDivide(nodes.length + 1, 2),
            separatorCount: () => IntegerUtilities.integerDivide(nodes.length, 2),

            itemAt: (index: number): any => {
                if (index < 0 || index >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }

                return nodes[index];
            },

            syntaxNodeAt: (index: number): SyntaxNode => {
                var value = index * 2;
                if (value < 0 || value >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }

                return nodes[value];
            },

            separatorAt: (index: number): any => {
                var value = index * 2 + 1;
                if (value < 0 || value >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }

                return nodes[value];
            },
        };

        return list;
    }
}