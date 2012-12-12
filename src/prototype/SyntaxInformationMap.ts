///<reference path='References.ts' />

interface ITokenInformation {
    fullStart: number;
    previousToken: ISyntaxToken;
    nextToken: ISyntaxToken;
}

class SyntaxInformationMap extends SyntaxWalker {
    // TODO: in the future we could also track the position of syntax nodes.
    private tokenToInformation = new HashTable(HashTable.DefaultCapacity, SyntaxToken.hashCode);

    private previousToken = null;
    private previousTokenInformation: ITokenInformation = null;
    private currentPosition = 0;

    public static create(node: SyntaxNode): SyntaxInformationMap {
        var map = new SyntaxInformationMap();
        node.accept(map);
        return map;
    }

    private visitToken(token: ISyntaxToken): void {
        var tokenInformation: ITokenInformation = {
            fullStart: this.currentPosition,
            previousToken: this.previousToken,
            nextToken: null
        };

        if (this.previousTokenInformation !== null) {
            this.previousTokenInformation.nextToken = token;
        }

        this.previousToken = token;
        this.currentPosition += token.fullWidth();
        this.previousTokenInformation = tokenInformation;

        this.tokenToInformation.add(token, tokenInformation);
    }

    public fullStart(token: ISyntaxToken): number {
        return this.tokenInformation(token).fullStart;
    }

    public start(token: ISyntaxToken): number {
        return this.fullStart(token) + token.leadingTriviaWidth();
    }

    public tokenInformation(token: ISyntaxToken): ITokenInformation {
        return this.tokenToInformation.get(token);
    }

    public firstTokenOnLineContainingToken(token: ISyntaxToken): ISyntaxToken {
        var current = token;
        while (true) {
            var information = this.tokenInformation(current);
            if (information.previousToken === null || information.previousToken.hasTrailingNewLineTrivia) {
                break;
            }

            current = information.previousToken;
        }

        return current;
    }
}