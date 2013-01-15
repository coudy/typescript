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
    export class IndentationEditInfo {
        public OrigIndentPosition: number;

        constructor(private textEditInfo: TextEditInfo) {
            this.OrigIndentPosition = this.textEditInfo.Position;
        }

        public Position(): number { { return this.textEditInfo.Position; } }
        public Indentation(): string { { return this.textEditInfo.ReplaceWith; } }

        public OrigIndentLength(): number { { return this.textEditInfo.Length; } }

        static create1(textEditInfo: TextEditInfo) {
            return new IndentationEditInfo(textEditInfo);
        }

        static create2(position: number, indentString: string, origPosition: number, origIndentLength: number) {
            var textEditInfo = new TextEditInfo(position, origIndentLength, indentString);
            var result = new IndentationEditInfo(textEditInfo);
            result.OrigIndentPosition = origPosition;
            return result;
        }
    }
}
