// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export enum PullElementFlags {
        None = 0,
        Exported = 1,
        Private = 1 << 1,
        Public = 1 << 2,
        Ambient = 1 << 3,
        Static = 1 << 4,
        LocalStatic = 1 << 5,
        GetAccessor = 1 << 6,
        SetAccessor = 1 << 7,
        Optional = 1 << 8,
        Call = 1 << 9,
        Constructor = 1 << 10,
        Index = 1 << 11,
        Signature = 1 << 12,
        Enum = 1 << 13,
        FatArrow = 1 << 14,
        
        ClassConstructorVariable = 1 << 15,
        InitializedModuleVariable = 1 << 16,
        EnumVariable = 1 << 17,

        ImplicitVariable = ClassConstructorVariable | InitializedModuleVariable | EnumVariable,
    }

    export enum PullElementKind {
        None = 0,

        Script = 1,
        Global = 1 << 1,
        Primitive = 1 << 2,

        Module = 1 << 3,
        Class = 1 << 4,
        Interface = 1 << 5,
        DynamicModule = 1 << 6,
        Enum = 1 << 7,
        Array = 1 << 8,
        TypeAlias = 1 << 9,

        Variable = 1 << 10,
        Parameter = 1 << 11,
        Property = 1 << 12,

        Function = 1 << 13,
        ConstructorMethod = 1 << 14,
        Method = 1 << 15,
        FunctionExpression = 1 << 16,

        GetAccessor = 1 << 17,
        SetAccessor = 1 << 18,

        CallSignature = 1 << 19,
        ConstructSignature = 1 << 20,
        IndexSignature = 1 << 21,
        
        ObjectType = 1 << 22,
        FunctionType = 1 << 23,
        ConstructorType = 1 << 24,

        SomeFunction = Function | ConstructorMethod | Method | FunctionExpression | GetAccessor | SetAccessor,

        SomeValue = Variable | Parameter | Property | SomeFunction,

        SomeType =  Script | Global | Primitive | Module | Class | Interface | DynamicModule | 
                    Enum | Array | TypeAlias | ObjectType | FunctionType | ConstructorType,
        
        SomeSignature = CallSignature | ConstructSignature | IndexSignature,
    }

    export enum SymbolLinkKind {
        TypedAs,
        ContextuallyTypedAs,
        ProvidesInferredType,
        ArrayType,

        InstanceType,
        ArrayOf,

        PublicMember,
        PrivateMember,
        StaticMember, // PULLTODO: Remove

        ConstructorMethod,

        Aliases,

        ContainedBy,

        Extends,
        Implements,

        Parameter,
        ReturnType,

        CallSignature,
        ConstructSignature,
        IndexSignature,
    }
}