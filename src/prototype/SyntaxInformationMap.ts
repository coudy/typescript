///<reference path='References.ts' />

interface ITokenInformation {
    fullStart: number;
    previousToken: ISyntaxToken;
    nextToken: ISyntaxToken;
}

class SyntaxInformationMap extends SyntaxWalker {
    // TODO: in the future we could also track the position of syntax nodes.
    private tokenToInformation = new HashTable(HashTable.DefaultCapacity, SyntaxToken.hashCode);

    private _previousToken = null;
    private _previousTokenInformation: ITokenInformation = null;
    private _currentPosition = 0;

    public static create(node: SyntaxNode): SyntaxInformationMap {
        var map = new SyntaxInformationMap();
        node.accept(map);
        return map;
    }

    private visitToken(token: ISyntaxToken): void {
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
        return information.previousToken === null || information.previousToken.hasTrailingNewLineTrivia();
    }
}