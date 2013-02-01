///<reference path='SyntaxWalker.generated.ts' />

///<reference path='..\Core\HashTable.ts' />
///<reference path='SyntaxToken.ts' />

interface ITokenInformation {
    previousToken: ISyntaxToken;
    nextToken: ISyntaxToken;
}

class SyntaxInformationMap extends SyntaxWalker {
    private tokenToInformation = Collections.createHashTable(Collections.DefaultHashTableCapacity, Collections.identityHashCode);
    private elementToPosition = Collections.createHashTable(Collections.DefaultHashTableCapacity, Collections.identityHashCode);

    private _previousToken = null;
    private _previousTokenInformation: ITokenInformation = null;
    private _currentPosition = 0;
    private _elementToParent = Collections.createHashTable(Collections.DefaultHashTableCapacity, Collections.identityHashCode);

    private _parentStack: ISyntaxElement[] = [];

    constructor() {
        super();
        this._parentStack.push(null);
    }

    public static create(node: SyntaxNode): SyntaxInformationMap {
        var map = new SyntaxInformationMap();
        map.visitNode(node);
        return map;
    }

    private visitNode(node: SyntaxNode): void {
        this._elementToParent.add(node, ArrayUtilities.last(this._parentStack));
        this.elementToPosition.add(node, this._currentPosition);
        
        this._parentStack.push(node);
        super.visitNode(node);
        this._parentStack.pop();
    }

    public visitList(list: ISyntaxList): void {
        this._elementToParent.add(list, ArrayUtilities.last(this._parentStack));
        this.elementToPosition.add(list, this._currentPosition);

        this._parentStack.push(list);
        super.visitList(list);
        this._parentStack.pop();
    }

    public visitSeparatedList(list: ISeparatedSyntaxList): void {
        this._elementToParent.add(list, ArrayUtilities.last(this._parentStack));
        this.elementToPosition.add(list, this._currentPosition);

        this._parentStack.push(list);
        super.visitSeparatedList(list);
        this._parentStack.pop();
    }

    private visitToken(token: ISyntaxToken): void {
        this._elementToParent.add(token, ArrayUtilities.last(this._parentStack));
        this.elementToPosition.add(token, this._currentPosition);

        var tokenInformation: ITokenInformation = {
            previousToken: this._previousToken,
            nextToken: null
        };

        if (this._previousTokenInformation !== null) {
            this._previousTokenInformation.nextToken = token;
        }

        this._previousToken = token;
        this._currentPosition += token.fullWidth();
        this._previousTokenInformation = tokenInformation;

        this.tokenToInformation.add(token, tokenInformation);
    }

    public parent(element: ISyntaxElement): ISyntaxElement {
        return this._elementToParent.get(element);
    }

    public fullStart(element: ISyntaxElement): number {
        return this.elementToPosition.get(element);
    }

    public start(element: ISyntaxElement): number {
        return this.fullStart(element) + element.leadingTriviaWidth();
    }

    public end(element: ISyntaxElement): number {
        return this.start(element) + element.width();
    }

    public previousToken(token: ISyntaxToken): ISyntaxToken {
        return this.tokenInformation(token).previousToken;
    }

    public tokenInformation(token: ISyntaxToken): ITokenInformation {
        return this.tokenToInformation.get(token);
    }

    public firstTokenInLineContainingToken(token: ISyntaxToken): ISyntaxToken {
        var current = token;
        while (true) {
            var information = this.tokenInformation(current);
            if (this.isFirstTokenInLineWorker(information)) {
                break;
            }

            current = information.previousToken;
        }

        return current;
    }

    public isFirstTokenInLine(token: ISyntaxToken): bool {
        var information = this.tokenInformation(token);
        return this.isFirstTokenInLineWorker(information);
    }

    private isFirstTokenInLineWorker(information: ITokenInformation): bool {
        return information.previousToken === null || information.previousToken.hasTrailingNewLine();
    }
}