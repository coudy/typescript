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
        error_TS_0__1: {
            category: DiagnosticCategory.Error,
            message: "error TS{0}: {1}",
            code: 0
        },

        warning_TS_0__1: {
            category: DiagnosticCategory.Warning,
            message: "warning TS{0}: {1}",
            code: 1
        },

        // Syntactic errors start at 100.

        // Semantic errors start at 200.
        Duplicate_identifier__0_: {
            category: DiagnosticCategory.Error,
            message: "Duplicate identifier '{0}'.",
            code: 200
        },

        The_name__0__does_not_exist_in_the_current_scope: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not exist in the current scope.",
            code: 201
        },

        The_name__0__does_not_refer_to_a_value: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not refer to a value.",
            code: 202
        },

        Keyword__super__can_only_be_used_inside_a_class_instance_method: {
            category: DiagnosticCategory.Error,
            message: "Keyword 'super' can only be used inside a class instance method.",
            code: 203
        },

        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer.",
            code: 204
        },

        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 205
        },

        Value_of_type__0__is_not_callable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable.",
            code: 206
        },

        Value_of_type__0__is_not_newable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not newable.",
            code: 207
        },

        Value_of_type__0__is_not_indexable_by_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not indexable by type '{1}'.",
            code: 208
        },

        Operator__0__cannot_be_applied_to_types__1__and__2_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
            code: 209
        },

        Operator__0__cannot_be_applied_to_types__1__and__2__3: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 210
        },

        Cannot_convert__0__to__1_: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}'.",
            code: 211
        },

        Cannot_convert__0__to__1___2: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}': {2}",
            code: 212
        },

        Expected_var__class__interface__or_module: {
            category: DiagnosticCategory.Error,
            message: "Expected var, class, interface, or module.",
            code: 213
        },

        Operator__0__cannot_be_applied_to_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to type '{1}'.",
            code: 214
        },

        Getter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Getter '{0}' already declared.",
            code: 215
        },

        Setter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Setter '{0}' already declared.",
            code: 216
        },

        Accessor_may_not_take_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "Accessors may not take type parameters.",
            code: 217
        },
    };
}