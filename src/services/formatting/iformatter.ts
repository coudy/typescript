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

/// <references path="formatting.ts"/>

module Formatting {
    export interface IFormatter {
        FormatDocument(minChar: number, limChar: number): Services.TextEdit[];
        FormatSelection(minChar: number, limChar: number): Services.TextEdit[];
        FormatOnPaste(minChar: number, limChar: number): Services.TextEdit[];
        FormatOnSemicolon(caretPosition: number): Services.TextEdit[];
        FormatOnClosingCurlyBrace(caretPosition: number): Services.TextEdit[];
        FormatOnEnter(caret: number): Services.TextEdit[];
        //ISmartIndent GetSmartIndenter();
    }
}
