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

    public static create(parent: PositionedElement, element: ISyntaxElement, fullStart: number): PositionedElement {
        if (element === null) {
            return null;
        }

        if (element.isNode()) {
            return new PositionedNode(parent, <SyntaxNode>element, fullStart);
        }
        else if (element.isToken()) {
            return new PositionedToken(parent, <ISyntaxToken>element, fullStart);
        }
        else if (element.isList()) {
            return new PositionedList(parent, <ISyntaxList>element, fullStart);
        }
        else if (element.isSeparatedList()) {
            return new PositionedSeparatedList(parent, <ISeparatedSyntaxList>element, fullStart);
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    public parent(): PositionedElement {
        return this._parent;
    }

    public element(): ISyntaxElement {
        return this._element;
    }

    public kind(): SyntaxKind {
        return this.element().kind();
    }

    public childCount(): number {
        return this.element().childCount();
    }

    public childAt(index: number): PositionedElement {
        var offset = 0;

        for (var i = 0; i < index; i++) {
            offset += this.element().childAt(i).fullWidth();
        }

        return PositionedElement.create(this, this.element().childAt(index), offset);
    }

    public getPositionedChild(child: ISyntaxElement) {
        var offset = Syntax.childOffset(this.element(), child);

        return PositionedElement.create(this, child, offset);
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

    public containingNode(): PositionedNode {
        var current = this.parent();

        while (current !== null && !current.element().isNode()) {
            current = current.parent();
        }
        
        return <PositionedNode>current;
    }
}

class PositionedNodeOrToken extends PositionedElement {
    constructor(parent: PositionedElement, nodeOrToken: ISyntaxNodeOrToken, fullStart: number) {
        super(parent, nodeOrToken, fullStart);
    }

    public nodeOrToken(): ISyntaxNodeOrToken {
        return <ISyntaxNodeOrToken>this.element();
    }
}

class PositionedNode extends PositionedNodeOrToken {
    constructor(parent: PositionedElement, node: SyntaxNode, fullStart: number) {
        super(parent, node, fullStart);
    }
    
    public node(): SyntaxNode {
        return <SyntaxNode>this.element();
    }
}

class PositionedToken extends PositionedNodeOrToken {
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