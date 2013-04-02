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

    export function hasFlag(val: number, flag: number): bool {
        return (val & flag) !== 0;
    }

    export function withoutFlag(val: number, flag: number): number {
        return val & ~flag;
    }

    export enum ASTFlags {
        None = 0,
        StrictMode = 1 << 1, // node is in the strict mode environment
        OptionalName = 1 << 2,
        // REVIEW: This flag is to mark lambda nodes to note that the LParen of an expression has already been matched in the lambda header.
        //         The flag is used to communicate this piece of information to the calling parseTerm, which intern will remove it.
        //         Once we have a better way to associate information with nodes, this flag should not be used.
        TypeReference = 1 << 3,
        EnumInitializer = 1 << 4,
    }

    export enum DeclFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
    }

    export enum ModuleFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        IsEnum = 1 << 7,
        ShouldEmitModuleDecl = 1 << 8,
        IsWholeFile = 1 << 9,
        IsDynamic = 1 << 10,
    }

    export enum SymbolFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        Property = 1 << 7,
        ModuleMember = 1 << 8,
        InterfaceMember = 1 << 9,
        ClassMember = 1 << 10,
        BuiltIn = 1 << 11,
        TypeSetDuringScopeAssignment = 1 << 12,
        Constant = 1 << 13,
        Optional = 1 << 14,
        RecursivelyReferenced = 1 << 15,
        Bound = 1 << 16,
        CompilerGenerated = 1 << 17,
    }

    export enum VariableFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        Property = 1 << 8,
        ClassProperty = 1 << 11,
        Constant = 1 << 12,
    }

    export enum FunctionFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        GetAccessor = 1 << 5,
        SetAccessor = 1 << 6,
        Signature = 1 << 7,
        Method = 1 << 8,
        CallMember = 1 << 9,
        ConstructMember = 1 << 10,
        IsFatArrowFunction = 1 << 11,
        IndexerMember = 1 << 12,
        IsFunctionExpression = 1 << 13,
        ClassMethod = 1 << 14,
        ClassPropertyMethodExported = 1 << 15,
    }

    export enum SignatureFlags {
        None = 0,
        IsIndexer = 1,
        IsStringIndexer = 1 << 1,
        IsNumberIndexer = 1 << 2,
    }

    export function ToDeclFlags(functionFlags: FunctionFlags) : DeclFlags;
    export function ToDeclFlags(varFlags: VariableFlags) : DeclFlags;
    export function ToDeclFlags(symFlags: SymbolFlags): DeclFlags;
    export function ToDeclFlags(moduleFlags: ModuleFlags): DeclFlags;
    export function ToDeclFlags(fncOrVarOrSymbolOrModuleFlags: any) {
        return <DeclFlags>fncOrVarOrSymbolOrModuleFlags;
    }

    export enum TypeFlags {
        None = 0,
        HasImplementation = 1,
        HasSelfReference = 1 << 1,
        MergeResult = 1 << 2,
        IsEnum = 1 << 3,
        BuildingName = 1 << 4,
        HasBaseType = 1 << 5,
        HasBaseTypeOfObject = 1 << 6,
        IsClass = 1 << 7,
    }

    export enum TypeRelationshipFlags {
        SuccessfulComparison = 0,
        SourceIsNullTargetIsVoidOrUndefined = 1,
        RequiredPropertyIsMissing = 1 << 1,
        IncompatibleSignatures = 1 << 2,
        SourceSignatureHasTooManyParameters = 3,
        IncompatibleReturnTypes = 1 << 4,
        IncompatiblePropertyTypes = 1 << 5,
        IncompatibleParameterTypes = 1 << 6,
    }

    export enum ModuleGenTarget {
        Synchronous = 0,
        Asynchronous = 1,
        Local = 1 << 1,
    }
}