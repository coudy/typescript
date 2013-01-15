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

///<reference path='typescriptServices.ts' />

module Services {
    export class Classifier {

        constructor(public host: IClassifierHost) {
        }

        private scanner = new TypeScript.Scanner();

        /// COLORIZATION
        public getClassificationsForLine(text: string, lexState: TypeScript.LexState): ClassificationResult {
            var result = new ClassificationResult();
            result.initialState = lexState;

            this.scanner.lexState = lexState;
            this.scanner.setText(text, TypeScript.LexMode.Line);
            var t = this.scanner.scanInLine();
            while (t.tokenId != TypeScript.TokenID.EndOfFile) {
                result.entries.push(new ClassificationInfo(this.scanner.pos, t.classification()));
                t = this.scanner.scanInLine();
            }

            result.finalLexState = this.scanner.lexState;
            return result;
        }
    }

    export interface IClassifierHost extends TypeScript.ILogger {
    }

    export class ClassificationResult {
        public initialState: TypeScript.LexState;
        public finalLexState: TypeScript.LexState;
        public entries: ClassificationInfo[];

        constructor() {
            this.initialState = TypeScript.LexState.Start;
            this.finalLexState = TypeScript.LexState.Start;
            this.entries = [];
        }
    }

    export class ClassificationInfo {
        constructor(public length: number, public classification: TypeScript.TokenClass) {
        }
    }
}
