module TypeScript {    
    export class IdentifierWalker extends SyntaxWalker {

        private _identifierList: string[];

        constructor(list: string[]) {
            super();
            this._identifierList = list;
        }

        public visitToken(token: ISyntaxToken): void {

            this._identifierList.push(token.text());
        }
    }
}