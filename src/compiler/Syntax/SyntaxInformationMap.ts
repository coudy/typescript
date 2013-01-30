///<reference path='SyntaxWalker.generated.ts' />

///<reference path='..\Core\HashTable.ts' />
///<reference path='SyntaxToken.ts' />

interface ITokenInformation {
    fullStart: number;
    previousToken: ISyntaxToken;
    nextToken: ISyntaxToken;
}

class SyntaxInformationMap extends SyntaxWalker {
    // TODO: in the future we could also track the position of syntax nodes.
    private tokenToInformation = Collections.createHashTable(Collections.DefaultHashTableCapacity, Collections.identityHashCode);

    private _previousToken = null;
    private _previousTokenInformation: ITokenInformation = null;
    private _currentPosition = 0;
    private _elementToParent = Collections.createHashTable(Collections.DefaultHashTableCapacity, Collections.identityHashCode);

    private _nodeStack: SyntaxNode[] = [];

    constructor() {
        super();
        this._nodeStack.push(null);
    }

    public static create(node: SyntaxNode): SyntaxInformationMap {
        var map = new SyntaxInformationMap();
        map.visitNode(node);
        return map;
    }

    private visitNode(node: SyntaxNode): void {
        this._elementToParent.add(node, ArrayUtilities.last(this._nodeStack));
        
        this._nodeStack.push(node);
        super.visitNode(node);
        this._nodeStack.pop();
    }

    private visitToken(token: ISyntaxToken): void {
        this._elementToParent.add(token, ArrayUtilities.last(this._nodeStack));

        var tokenInformation: ITokenInformation = {
            fullStart: this._currentPosition,
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

    public parent(nodeOrToken: ISyntaxNodeOrToken): SyntaxNode {
        return this._elementToParent.get(nodeOrToken);
    }

    public fullStart(token: ISyntaxToken): number {
        return this.tokenInformation(token).fullStart;
    }

    public start(token: ISyntaxToken): number {
        return this.fullStart(token) + token.leadingTriviaWidth();
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