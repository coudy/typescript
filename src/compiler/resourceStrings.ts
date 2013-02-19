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
    export var typescriptDiagnosticMessages: TypeScriptDiagnosticMessages = {
        error_2: {
            category: DiagnosticCategory.Error,
            message: "error TS{0}: {1}",
            code: 0
        },

        warning_2: {
            category: DiagnosticCategory.Warning,
            message: "warning TS{0}: {1}",
            code: 1
        },

        duplicateIdentifier_1: {
            category: DiagnosticCategory.Error,
            message: "Duplicate identifier '{0}'",
            code: 100
        },

        unresolvedSymbol_1: {
            category: DiagnosticCategory.Error,
            message: "The name'{0}' does not exist in the current scope",
            code: 101
        },

        symbolDoesNotReferToAValue_1: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not refer to a value",
            code: 102
        },

        invalidSuperReference: {
            category: DiagnosticCategory.Error,
            message: "Keyword 'super' can only be used inside a class instance method",
            code: 103
        },

        valueCannotBeModified: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer",
            code: 104
        },

        usedCallInsteadOfNew_1: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable.  Did you mean to include 'new'?",
            code: 105
        },

        valueIsNotCallable_1: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable",
            code: 106
        },

        valueIsNotNewable_1: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not newable",
            code: 107
        },

        invalidIndexLHS_2: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not indexable by type '{1}'",
            code: 108
        },

        incompatibleTypesForOperator_3: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'",
            code: 109
        },

        incompatibleTypesForOperatorWithReason_4: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 110
        },

        incompatibleTypes_2: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}'",
            code: 111
        },

        incompatibleTypesWithReason_3: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}': {2}",
            code: 112
        },

        expectedClassOrInterface: {
            category: DiagnosticCategory.Error,
            message: "Expected var, class, interface, or module",
            code: 113
        },

        unaryOperatorTypeError_2: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to type '{1}'",
            code: 114
        },
    };
}