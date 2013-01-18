//﻿
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='formatting.ts' />


module Formatting {
    export class TokenSpan {
        private _lineNumber: number;

        constructor(public Token: AuthorTokenKind, public tokenID: TypeScript.TokenID, public Span: SnapshotSpan) {
            this._lineNumber = null;
        }

        public lineNumber(): number {
            if (this._lineNumber === null) {
                this._lineNumber = this.Span.snapshot.GetLineNumberFromPosition(this.Span.startPosition());
            }

            return this._lineNumber;
        }

        public toString():string {
            var result = "[tokenKind=" + (<any>AuthorTokenKind)._map[this.Token] + ", " +
                "tokenID=" + (<any>TypeScript.TokenID)._map[this.tokenID] + ", " +
                "lineNumber=" + this._lineNumber + ", " +
                "span=" + this.Span + "]";
            return result;
        }
    }
}
