///<reference path='References.ts' />

class SyntaxNode {
    public kind(): SyntaxKind {
        throw Errors.abstract();
    }

    public isMissing(): bool {
        return false;
    }

    public toJSON(key) {
        var result: any = { kind: (<any>SyntaxKind)._map[this.kind()] };

        for (var name in this) {
            var value = this[name];
            if (value && typeof value === 'object') {
                if (typeof value.toJSON === 'function') {
                    result[name] = value.toJSON(name);
                }
                else {
                    result[name] = value;
                }
            }
        }

        return result;
    }
}