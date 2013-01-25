///<reference path='ISyntaxToken.ts' />

class PositionedElement {
    private _parent: PositionedElement;
    private _element: ISyntaxElement;
    private _fullStart: number;

    constructor(parent: PositionedElement, element: ISyntaxElement, fullStart: number) {
        this._parent = parent;
        this._element = element;
        this._fullStart = fullStart;
    }

    public parent(): PositionedElement {
        return this._parent;
    }

    public element(): ISyntaxElement {
        return this._element;
    }

    public fullStart(): number {
        return this._fullStart;
    }

    public fullEnd(): number {
        return this.fullStart() + this.element().fullWidth();
    }

    public start(): number {
        return this.fullStart() + this.element().leadingTriviaWidth();
    }

    public end(): number {
        return this.fullStart() + this.element().leadingTriviaWidth() + this.element().width();
    }

    public root(): PositionedNode {
        var current = this;
        while (current.parent() !== null) {
            current = current.parent();
        }

        return <PositionedNode>current;
    }
}

class PositionedNode extends PositionedElement {
    constructor(parent: PositionedElement, node: SyntaxNode, fullStart: number) {
        super(parent, node, fullStart);
    }
    
    public node(): SyntaxNode {
        return <SyntaxNode>this.element();
    }
}

class PositionedToken extends PositionedElement {
    constructor(parent: PositionedElement, token: ISyntaxToken, fullStart: number) {
        super(parent, token, fullStart);
    }

    public token(): ISyntaxToken {
        return <ISyntaxToken>this.element();
    }

    public previousToken(): PositionedToken {
        var fullStart = this.fullStart();
        if (fullStart === 0) {
            return null;
        }

        return this.root().node().findToken(fullStart - 1);
    }

    public nextToken(): PositionedToken {
        if (this.token().tokenKind === SyntaxKind.EndOfFileToken) {
            return null;
        }

        return this.root().node().findToken(this.fullEnd());
    }
}

class PositionedList extends PositionedElement {
    constructor(parent: PositionedElement, list: ISyntaxList, fullStart: number) {
        super(parent, list, fullStart);
    }

    public list(): ISyntaxList {
        return <ISyntaxList>this.element();
    }
}

class PositionedSeparatedList extends PositionedElement {
    constructor(parent: PositionedElement, list: ISeparatedSyntaxList, fullStart: number) {
        super(parent, list, fullStart);
    }

    public list(): ISeparatedSyntaxList {
        return <ISeparatedSyntaxList>this.element();
    }
}