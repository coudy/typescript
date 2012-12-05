///<reference path='References.ts' />

class Emitter {
    private syntaxOnly: bool;

    constructor(syntaxOnly: bool) {
        this.syntaxOnly = syntaxOnly;
    }

    emit(input: SyntaxTree): SyntaxTree {
        return null;
    }
}