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
    export class IndentationBag {
        private indentationEdits: Dictionary_int_List_IndentationEditInfo;

        constructor(private snapshot: ITextSnapshot) {
            // A map from line number to a list of indentations that happened on that line.
            // We need a list since a line might cut into multiple lines due to NewLine rules.
            this.indentationEdits = new Dictionary_int_List_IndentationEditInfo();
        }

        public AddIndent(edit: IndentationEditInfo): void
        {
            var line = this.snapshot.GetLineNumberFromPosition(edit.Position());

            var lineIndents: List_IndentationEditInfo = this.indentationEdits.GetValue(line);

            if (lineIndents === null) {
                lineIndents = new List_IndentationEditInfo();
                this.indentationEdits.Add(line, lineIndents);
            }

            lineIndents.add(edit);
        }

        public  FindIndent(position: number): IndentationEditInfo {
            var line = this.snapshot.GetLineNumberFromPosition(position);

            var lineIndents = this.indentationEdits.GetValue(line);
            if (lineIndents !== null) {
                for (var i = lineIndents.count() - 1; i >= 0; i--) {
                    if (position >= lineIndents.get(i).Position()) {
                        return lineIndents.get(i);
                    }
                }
            }

            return null;
        }
    }
}
