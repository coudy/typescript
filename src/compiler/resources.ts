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

    export interface DiagnosticInfo {
        category: DiagnosticCategory;
        message: string;
        code: number;
    }

    export enum PullDiagnosticMessages {
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
        duplicateGetter_1,
        duplicateSetter_1,
        accessorsMayNotBeGeneric,
    }

    export interface TypeScriptDiagnosticMessages {
        error_2: DiagnosticInfo;
        warning_2: DiagnosticInfo;

        duplicateIdentifier_1: DiagnosticInfo;
        unresolvedSymbol_1: DiagnosticInfo;
        symbolDoesNotReferToAValue_1: DiagnosticInfo;
        invalidSuperReference: DiagnosticInfo;
        valueCannotBeModified: DiagnosticInfo;
        usedCallInsteadOfNew_1: DiagnosticInfo;
        valueIsNotCallable_1: DiagnosticInfo;
        valueIsNotNewable_1: DiagnosticInfo;
        invalidIndexLHS_2: DiagnosticInfo;
        incompatibleTypesForOperator_3: DiagnosticInfo;
        incompatibleTypesForOperatorWithReason_4: DiagnosticInfo;
        incompatibleTypes_2: DiagnosticInfo;
        incompatibleTypesWithReason_3: DiagnosticInfo;
        expectedClassOrInterface: DiagnosticInfo;
        unaryOperatorTypeError_2: DiagnosticInfo;
        duplicateGetter_1: DiagnosticInfo;
        duplicateSetter_1: DiagnosticInfo;
        accessorsMayNotBeGeneric: DiagnosticInfo;
    }
}