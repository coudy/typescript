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

///<reference path='typescript.ts' />

module TypeScript {

    export enum DiagnosticCategory {
        Warning,
        Error,
    }

    export interface Diagnostic {
        category: DiagnosticCategory;
        message: string;
        code: number;
    }

    export enum DiagnosticMessages {
        error_2,
        warning_2,

        duplicateIdentifier_1,
        unresolvedSymbol_1,
        symbolDoesNotReferToAValue_1,
        invalidSuperReference,
        valueCannotBeModified,
        usedCallInsteadOfNew_1,
        valueIsNotCallable_1,
        valueIsNotNewable_1,
        invalidIndexLHS_2,
        incompatibleTypesForOperator_3,
        incompatibleTypesForOperatorWithReason_4,
        incompatibleTypes_2,
        incompatibleTypesWithReason_3,
        expectedClassOrInterface,
        unaryOperatorTypeError_2,

    }

    export interface TypeScriptDiagnosticMessages {
        error_2: Diagnostic;
        warning_2: Diagnostic;

        duplicateIdentifier_1: Diagnostic;
        unresolvedSymbol_1: Diagnostic;
        symbolDoesNotReferToAValue_1: Diagnostic;
        invalidSuperReference: Diagnostic;
        valueCannotBeModified: Diagnostic;
        usedCallInsteadOfNew_1: Diagnostic;
        valueIsNotCallable_1: Diagnostic;
        valueIsNotNewable_1: Diagnostic;
        invalidIndexLHS_2: Diagnostic;
        incompatibleTypesForOperator_3: Diagnostic;
        incompatibleTypesForOperatorWithReason_4: Diagnostic;
        incompatibleTypes_2: Diagnostic;
        incompatibleTypesWithReason_3: Diagnostic;
        expectedClassOrInterface: Diagnostic;
        unaryOperatorTypeError_2: Diagnostic;

    }
}