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
        InitializedModule = 1 << 16,
        EnumVariable = 1 << 17,

        MustCaptureThis = 1 << 18,
        Constant = 1 << 19,

        ExpressionElement = 1 << 20,

        ImplicitVariable = ClassConstructorVariable | InitializedModule, /* | EnumVariable, */
    }

    export enum PullElementKind {
        None = 0,

        Script = 1,
        Global = 1 << 1,
        Primitive = 1 << 2,

        Container = 1 << 3,
        Class = 1 << 4,
        Interface = 1 << 5,
        DynamicModule = 1 << 6,
        Enum = 1 << 7,
        Array = 1 << 8,
        TypeAlias = 1 << 9,
        //TypeVariable = 1 << 10,

        Variable = 1 << 11,
        Parameter = 1 << 12,
        Property = 1 << 13,
        TypeParameter = 1 << 14,

        Function = 1 << 15,
        ConstructorMethod = 1 << 16,
        Method = 1 << 17,
        FunctionExpression = 1 << 18,

        GetAccessor = 1 << 19,
        SetAccessor = 1 << 20,

        CallSignature = 1 << 21,
        ConstructSignature = 1 << 22,
        IndexSignature = 1 << 23,

        ObjectType = 1 << 24,
        FunctionType = 1 << 25,
        ConstructorType = 1 << 26,

        SomeFunction = Function | ConstructorMethod | Method | FunctionExpression | GetAccessor | SetAccessor | CallSignature | ConstructSignature | IndexSignature,

        // Warning: SomeValue and SomeType (along with their constituents) must be disjoint
        SomeValue = Variable | Parameter | Property | SomeFunction,

        SomeType = Script | Global | Primitive | Container | Class | Interface | DynamicModule |
                    Enum | Array | TypeAlias | ObjectType | FunctionType | ConstructorType | TypeParameter,

        SomeSignature = CallSignature | ConstructSignature | IndexSignature,
    }

    export enum SymbolLinkKind {
        TypedAs,
        ContextuallyTypedAs,
        ProvidesInferredType,
        ArrayType,

        ArrayOf,

        PublicMember,
        PrivateMember,

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

        TypeParameter,
        TypeArgument,
        TypeParameterSpecializedTo,
        SpecializedTo,

        TypeConstraint,

        GetterFunction,
        SetterFunction,
    }
}