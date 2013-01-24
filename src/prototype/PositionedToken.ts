///<reference path='ISyntaxToken.ts' />

class PositionedElement {
    private _parent: PositionedElement;
    private _element: ISyntaxElement;
    private _position: number;

    constructor(parent: PositionedElement, element: ISyntaxElement, position: number) {
        this._parent = parent;
        this._element = element;
        this._position = position;
    }

    public parent(): PositionedElement {
        return this._parent;
    }

    public element(): ISyntaxElement {
        return this._element;
    }

    public position(): number {
        return this._position;
    }
}

class PositionedNode extends PositionedElement {
    constructor(parent: PositionedElement, node: SyntaxNode, position: number) {
        super(parent, node, position);
    }

    public node(): SyntaxNode {
        return <SyntaxNode>this.element();
    }
}

class PositionedToken extends PositionedElement {
    constructor(parent: PositionedElement, token: ISyntaxToken, position: number) {
        super(parent, token, position);
    }

    public token(): ISyntaxToken {
        return <ISyntaxToken>this.element();
    }
}

class PositionedList extends PositionedElement {
    constructor(parent: PositionedElement, list: ISyntaxList, position: number) {
        super(parent, list, position);
    }

    public list(): ISyntaxList {
        return <ISyntaxList>this.element();
    }
}

class PositionedSeparatedList extends PositionedElement {
    constructor(parent: PositionedElement, list: ISeparatedSyntaxList, position: number) {
        super(parent, list, position);
    }

    public list(): ISeparatedSyntaxList {
        return <ISeparatedSyntaxList>this.element();
    }
}