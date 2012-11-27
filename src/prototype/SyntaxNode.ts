///<reference path='References.ts' />

class SyntaxNode {
    public kind(): SyntaxKind {
        throw Errors.abstract();
    }

    public isMissing(): bool {
        return false;
    }

    public toJSON(key) {
        // Hackery.  Try to get the standard JSON behavior, but add some additional properties
        // into the mix.  
        this.toJSON = undefined;
        try {
            // Really bad from a perf perspective.
            var result = JSON2.parse(JSON2.stringify(this, null, 4));
            result.kind = (<any>SyntaxKind)._map[this.kind()];
            result.isMissing = this.isMissing();
            return result;
        } finally {
            delete this.toJSON;
        }
    }
}