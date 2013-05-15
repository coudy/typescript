module TypeScript {    
    export class IdentifierWalker extends SyntaxWalker {

        constructor(public list: string[]) {
            super();
        }

        public visitToken(token: ISyntaxToken): void {
            this.list.push(token.text());
        }
    }
}