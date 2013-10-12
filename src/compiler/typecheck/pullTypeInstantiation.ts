// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
///<reference path="..\typescript.ts" />

module TypeScript {

    // Type references and instantiated type references
    export class PullTypeReferenceSymbol extends PullTypeSymbol {

        public static createTypeReference(type: PullTypeSymbol): PullTypeReferenceSymbol {

            if (type.isTypeReference()) {
                return <PullTypeReferenceSymbol>type;
            }

            var typeReference = type.typeReference;

            if (!typeReference) {
                typeReference = new PullTypeReferenceSymbol(type);
                type.typeReference = typeReference;
            }

            return typeReference;
        }

        // use the root symbol to model the actual type
        // do not call this directly!
        constructor(public referencedTypeSymbol: PullTypeSymbol) {
            super(referencedTypeSymbol.name, referencedTypeSymbol.kind);

            Debug.assert(referencedTypeSymbol != null, "Type root symbol may not be null");

            this.setRootSymbol(referencedTypeSymbol);

            this.typeReference = this;
        }

        public isTypeReference() {
            return true;
        }

        public isResolved = true;

        public setResolved() { }

        // do nothing on invalidate
        public setUnresolved(): void { }
        public invalidate(): void { }

        public ensureReferencedTypeIsResolved(): void {
            if (!this.referencedTypeSymbol.isResolved) {
                globalResolver.resolveDeclaredSymbol(this.referencedTypeSymbol);
            }
        }

        public getReferencedTypeSymbol(): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol;
        }

        public hasMembers(): boolean {
            // no need to resolve first - members are collected during binding

            return this.referencedTypeSymbol.hasMembers();
        }

        public setAssociatedContainerType(type: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": setAssociatedContainerType");
        }

        public getAssociatedContainerType(): PullTypeSymbol {
            return this.referencedTypeSymbol.getAssociatedContainerType();
        }

        public getFunctionSymbol(): PullSymbol {
            // necessary because the function symbol may be set during type resolution to
            // facilitate doc comments
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.getFunctionSymbol();
        }
        public setFunctionSymbol(symbol: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": setFunctionSymbol");
        }

        public addContainedNonMember(nonMember: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addContainedNonMember");
        }
        public findContainedNonMemberContainer(containerName: string, kind = PullElementKind.None): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.findContainedNonMemberContainer(containerName, kind);
        }

        public addMember(memberSymbol: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addMember");
        }
        public addEnclosedMemberType(enclosedType: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addEnclosedMemberType");
        }
        public addEnclosedMemberContainer(enclosedContainer: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addEnclosedMemberContainer");
        }
        public addEnclosedNonMember(enclosedNonMember: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addEnclosedNonMember");
        }
        public addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addEnclosedNonMemberType");
        }
        public addEnclosedNonMemberContainer(enclosedNonMemberContainer: PullTypeSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addEnclosedNonMemberContainer");
        }
        public addTypeParameter(typeParameter: PullTypeParameterSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addTypeParameter");
        }
        public addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addConstructorTypeParameter");
        }

        public findContainedNonMember(name: string): PullSymbol {
            // need to ensure the referenced type is resolved so we can find the non-member
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findContainedNonMember(name);
        }

        public findContainedNonMemberType(typeName: string, kind = PullElementKind.None): PullTypeSymbol {
            // similar to the above, need to ensure that the type is resolved so we can introspect any
            // contained types
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findContainedNonMemberType(typeName, kind);
        }

        public getMembers(): PullSymbol[]{
            // need to resolve the referenced types to get the members
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.getMembers();
        }

        public setHasDefaultConstructor(hasOne= true): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ":setHasDefaultConstructor");
        }
        public getHasDefaultConstructor(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getHasDefaultConstructor();
        }
        public getConstructorMethod(): PullSymbol {
            // need to resolve so we don't accidentally substitute in a default constructor
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getConstructorMethod();
        }
        public setConstructorMethod(constructorMethod: PullSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": setConstructorMethod");
        }
        public getTypeParameters(): PullTypeParameterSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeParameters();
        }

        public isGeneric(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isGeneric();
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {
            //Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addSpecialization");
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.addSpecialization(specializedVersionOfThisType, substitutingTypes);
        }
        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getSpecialization(substitutingTypes);
        }
        public getKnownSpecializations(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getKnownSpecializations();
        }
        public getTypeArguments(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeArguments();
        }
        public getTypeArgumentsOrTypeParameters(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeArgumentsOrTypeParameters();
        }

        public addCallSignature(callSignature: PullSignatureSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addCallSignature");
        }
        public addConstructSignature(constructSignature: PullSignatureSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addConstructSignature");
        }
        public addIndexSignature(indexSignature: PullSignatureSymbol): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addIndexSignature");
        }

        public hasOwnCallSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnCallSignatures();
        }
        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);
        }
        public hasOwnConstructSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnConstructSignatures();
        }
        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);
        }
        public hasOwnIndexSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnIndexSignatures();
        }
        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getIndexSignatures(collectBaseSignatures);
        }

        public addImplementedType(implementedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addImplementedType(implementedType);
        }
        public getImplementedTypes(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getImplementedTypes();
        }
        public addExtendedType(extendedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addExtendedType(extendedType);
        }
        public getExtendedTypes(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getExtendedTypes();
        }
        public addTypeThatExtendsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExtendsThisType(type);
        }
        public getTypesThatExtendThisType(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExtendThisType();
        }
        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExplicitlyImplementsThisType(type);
        }
        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[] {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExplicitlyImplementThisType();
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isValidBaseKind(baseType, isExtendedType);
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            // ensure that the type is resolved before looking for members
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findMember(name, lookInParent);
        }
        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            // ensure that the type is resolved before looking for nested types
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findNestedType(name, kind);
        }
        public findNestedContainer(name: string, kind = PullElementKind.None): PullTypeSymbol {
            // ensure that the type is resolved before looking for nested containers
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findNestedContainer(name, kind);
        }
        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[]{
            // ensure that the type is resolved before trying to collect all members
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            // ensure that the type is resolved before trying to look up a type parameter
            this.ensureReferencedTypeIsResolved();

            return this.referencedTypeSymbol.findTypeParameter(name);
        }

        /*
        public getNamePartForFullName(): string {
            return this.referencedTypeSymbol.getNamePartForFullName();
        }
        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.referencedTypeSymbol.getScopedName(scopeSymbol, useConstraintInName);
        }
        public isNamedTypeSymbol(): boolean {
            return this.referencedTypeSymbol.isNamedTypeSymbol();
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.referencedTypeSymbol.toString(scopeSymbol, useConstraintInName);
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean): MemberName {
            return this.referencedTypeSymbol.getScopedNameEx(scopeSymbol, useConstraintInName, getPrettyTypeName, getTypeParamMarkerInfo);
        }
        */

        public hasOnlyOverloadCallSignatures(): boolean {
            // no need to resolve the referenced type - only computed during printing
            return this.referencedTypeSymbol.hasOnlyOverloadCallSignatures();
        }
    }

    export enum GenerativeTypeKind {
        Unknown,
        Open,
        Closed,
        Generative
    }

    export class PullInstantiatedTypeReferenceSymbol extends PullTypeReferenceSymbol {

        private _instantiatedMembers: PullSymbol[] = null;
        private _allInstantiatedMemberNameCache: any = null;
        private _instantiatedMemberNameCache: any = new BlockIntrinsics(); // cache from member names to pull symbols
        private _instantiatedCallSignatures: PullSignatureSymbol[] = null;
        private _instantiatedConstructSignatures: PullSignatureSymbol[] = null;
        private _instantiatedIndexSignatures: PullSignatureSymbol[] = null;
        private _typeArgumentReferences: PullTypeSymbol[] = null;
        private _instantiatedConstructorMethod: PullSymbol = null;
        private _instantiatedAssociatedContainerType: PullTypeSymbol = null;
        private _isArray:boolean = undefined;

        public isInstanceReferenceType: boolean = false;

        public getIsSpecialized() { return !this.isInstanceReferenceType; }

        public isArray(): boolean {
            if (this._isArray === undefined) {
                this._isArray = this.getRootSymbol().isArray() || (this.getRootSymbol() == globalResolver.getCachedArrayType());
            }
            return this._isArray;
        }

        public getElementType(): PullTypeSymbol {
            if (!this.isArray()) {
                return null;
            }

            var typeArguments = this.getTypeArguments();

            if (typeArguments != null) {
                return typeArguments[0];
            }

            return null;
        }

        public getReferencedTypeSymbol(): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();

            return this;
        }

        // The typeParameterArgumentMap represents a mapping of PUll
        public static create(type: PullTypeSymbol, typeParameterArgumentMap: any, instantiateFunctionTypeParameters = false): PullInstantiatedTypeReferenceSymbol {

            // check for an existing instantiation
            var rootType = <PullTypeSymbol>type.getRootSymbol();

            var reconstructedTypeArgumentList: PullTypeSymbol[] = [];
            var typeArguments = type.getTypeArguments();
            var typeParameters = rootType.getTypeParameters();

            // if the type is already specialized, we need to create a new type argument map
            if (type.getIsSpecialized() && typeArguments && typeArguments.length) {
                for (var i = 0; i < typeArguments.length; i++) {
                    reconstructedTypeArgumentList[reconstructedTypeArgumentList.length] = instantiateType(typeArguments[i], typeParameterArgumentMap, instantiateFunctionTypeParameters);
                }
                
                for (var i = 0; i < typeArguments.length; i++) {
                    typeParameterArgumentMap[typeArguments[i].pullSymbolIDString] = reconstructedTypeArgumentList[i];
                }
            }
            else {
                var tyArg: PullTypeSymbol = null;

                for (var typeParameterID in typeParameterArgumentMap) {
                    tyArg = typeParameterArgumentMap[typeParameterID];

                    if (tyArg) {
                        reconstructedTypeArgumentList[reconstructedTypeArgumentList.length] = tyArg;
                    }
                }
            }

            if (!instantiateFunctionTypeParameters) {
                var instantiation = <PullInstantiatedTypeReferenceSymbol>rootType.getSpecialization(reconstructedTypeArgumentList);

                if (instantiation) {
                    return instantiation;
                }
            }

            // If the reference is made to itself (e.g., referring to Array<T> within the declaration of Array<T>,
            // We want to special-case the reference so later calls to getMember, etc., will delegate directly
            // to the referenced declaration type, and not force any additional instantiation
            var isReferencedType = (type.kind & PullElementKind.SomeNamedType) != 0;

            if (isReferencedType) {
                if (typeParameters && reconstructedTypeArgumentList) {
                    if (typeParameters.length == reconstructedTypeArgumentList.length) {
                        for (var i = 0; i < typeParameters.length; i++) {
                            if (!PullHelpers.typeSymbolsAreIdentical(typeParameters[i], reconstructedTypeArgumentList[i])) {
                                isReferencedType = false;
                                break;
                            }
                        }

                        if (isReferencedType) {
                            typeParameterArgumentMap = {};
                        }
                    }
                    else {
                        isReferencedType = false; // the same number of type parameters are not shared
                    }
                }
            }

            // if we're re-specializing a generic type (say, if a signature parameter gets specialized
            // from 'Array<S>' to 'Array<foo>', then we'll need to create a new initialization map
            if (type.isTypeReference() && type.isGeneric()) {
                var initializationMap = {};

                // first, initialize the argument map
                for (var typeParameterID in typeParameterArgumentMap) {
                    initializationMap[typeParameterID] = typeParameterArgumentMap[typeParameterID];
                }

                // next, overwrite any entries that should be re-directed to new type parameters
                for (var typeParameterID in (<PullInstantiatedTypeReferenceSymbol>type)._typeParameterArgumentMap) {
                    if (typeParameterArgumentMap[(<PullInstantiatedTypeReferenceSymbol>type)._typeParameterArgumentMap[typeParameterID].pullSymbolIDString]) {
                        initializationMap[typeParameterID] = typeParameterArgumentMap[(<PullInstantiatedTypeReferenceSymbol>type)._typeParameterArgumentMap[typeParameterID].pullSymbolIDString];
                    }
                }

                typeParameterArgumentMap = initializationMap;
            }

            instantiation = new PullInstantiatedTypeReferenceSymbol(isReferencedType ? rootType : type, typeParameterArgumentMap);

            if (!instantiateFunctionTypeParameters) {
                rootType.addSpecialization(instantiation, reconstructedTypeArgumentList);
            }

            if (isReferencedType) {
                instantiation.isInstanceReferenceType = true;
            }

            return instantiation;
        }

        constructor(public referencedTypeSymbol: PullTypeSymbol, private _typeParameterArgumentMap: any) {
            super(referencedTypeSymbol);

            nSpecializationsCreated++;
        }

        public isGeneric(): boolean {
            return !!this.referencedTypeSymbol.getTypeParameters().length;
        }

        public generativeTypeKind: GenerativeTypeKind = GenerativeTypeKind.Unknown;

        public getTypeArguments(): PullTypeSymbol[]{

            if (this.isInstanceReferenceType) {
                return this.getTypeParameters();
            }

            if (!this._typeArgumentReferences) {
                var typeParameters = this.referencedTypeSymbol.getTypeParameters();

                if (typeParameters.length) {
                    var typeArgument: PullTypeSymbol = null;
                    var typeArguments: PullTypeSymbol[] = [];

                    for (var i = 0; i < typeParameters.length; i++) {
                        typeArgument = <PullTypeSymbol>this._typeParameterArgumentMap[typeParameters[i].pullSymbolIDString];

                        // the mismatch may legitimately occur in error conditions...
                        if (!typeArgument) {
                            Debug.assert(this._typeArgumentReferences.length == typeParameters.length, "type argument mismatch");
                        }

                        if (typeArgument) {
                            typeArguments[typeArguments.length] = typeArgument;
                        }
                    }

                    this._typeArgumentReferences = typeArguments;
                }
            }

            return this._typeArgumentReferences;
        }
        
        public getTypeArgumentsOrTypeParameters() {
            return this.getTypeArguments();
        }

        //
        // lazily evaluated members
        //
        public getMembers(): PullSymbol[] {
            // need to resolve the referenced types to get the members
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getMembers();
            }

            // for each of the referenced type's members, need to properly instantiate their
            // type references
            if (!this._instantiatedMembers) {
                var referencedMembers = this.referencedTypeSymbol.getMembers();
                var referencedMember: PullSymbol = null;
                var instantiatedMember: PullSymbol = null;

                this._instantiatedMembers = [];

                for (var i = 0; i < referencedMembers.length; i++) {
                    referencedMember = referencedMembers[i];

                    if (!referencedMember.isResolved) {
                        globalResolver.resolveDeclaredSymbol(referencedMember);
                    }

                    if (!this._instantiatedMemberNameCache[referencedMember.name]) {

                        // if the member does not require further specialization, re-use the referenced symbol
                        if (!typeWrapsSomeTypeParameter(referencedMember.type, this._typeParameterArgumentMap)) {
                            instantiatedMember = referencedMember;
                        }
                        else {
                            instantiatedMember = new PullSymbol(referencedMember.name, referencedMember.kind);
                            instantiatedMember.setRootSymbol(referencedMember);
                            instantiatedMember.type = instantiateType(referencedMember.type, this._typeParameterArgumentMap);
                            instantiatedMember.isOptional = referencedMember.isOptional;
                        }

                        this._instantiatedMemberNameCache[instantiatedMember.name] = instantiatedMember;
                    }
                    else {
                        instantiatedMember = this._instantiatedMemberNameCache[referencedMember.name]
                    }

                    this._instantiatedMembers[this._instantiatedMembers.length] = instantiatedMember;
                }
            }

            return this._instantiatedMembers;
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            // ensure that the type is resolved before looking for members
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.findMember(name, lookInParent);
            }

            // if the member exists on the referenced type, need to ensure that it's
            // instantiated

            var memberSymbol = <PullSymbol>this._instantiatedMemberNameCache[name];

            if (!memberSymbol) {
                var referencedMemberSymbol = this.referencedTypeSymbol.findMember(name, lookInParent);

                if (referencedMemberSymbol) {
                    memberSymbol = new PullSymbol(referencedMemberSymbol.name, referencedMemberSymbol.kind);
                    memberSymbol.setRootSymbol(referencedMemberSymbol);

                    if (!referencedMemberSymbol.isResolved) {
                        globalResolver.resolveDeclaredSymbol(referencedMemberSymbol);
                    }

                    memberSymbol.type = instantiateType(referencedMemberSymbol.type, this._typeParameterArgumentMap);

                    memberSymbol.isOptional = referencedMemberSymbol.isOptional;

                    this._instantiatedMemberNameCache[memberSymbol.name] = memberSymbol;
                }
                else {
                    memberSymbol = null;
                }
            }

            return memberSymbol;
        }

        // May need to cache based on search kind / visibility combinations
        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[]{

            // ensure that the type is resolved before trying to collect all members
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);
            }

            var requestedMembers: PullSymbol[] = [];
            var allReferencedMembers = this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);

            if (!this._allInstantiatedMemberNameCache) {
                this._allInstantiatedMemberNameCache = new BlockIntrinsics();

                // first, seed with this type's members
                var members = this.getMembers();

                for (var i = 0; i < members.length; i++) {
                    this._allInstantiatedMemberNameCache[members[i].name] = members[i];
                }
            }

            // next, for add any symbols belonging to the parent type, if necessary
            var referencedMember: PullSymbol = null;
            var requestedMember: PullSymbol = null;

            for (var i = 0; i < allReferencedMembers.length; i++) {
                referencedMember = allReferencedMembers[i];

                if (!referencedMember.isResolved) {
                    globalResolver.resolveDeclaredSymbol(referencedMember);
                }

                if (this._allInstantiatedMemberNameCache[referencedMember.name]) {
                    requestedMembers[requestedMembers.length] = this._allInstantiatedMemberNameCache[referencedMember.name];
                }
                else {
                    if (!typeWrapsSomeTypeParameter(referencedMember.type, this._typeParameterArgumentMap)) {
                        this._allInstantiatedMemberNameCache[referencedMember.name] = referencedMember;
                        requestedMembers[requestedMembers.length] = referencedMember;
                    }
                    else {
                        requestedMember = new PullSymbol(referencedMember.name, referencedMember.kind);
                        requestedMember.setRootSymbol(referencedMember);

                        //if (!referencedMember.isResolved) {
                        //    globalResolver.resolveDeclaredSymbol(referencedMember);
                        //}

                        requestedMember.type = instantiateType(referencedMember.type, this._typeParameterArgumentMap);
                        requestedMember.isOptional = referencedMember.isOptional;

                        this._allInstantiatedMemberNameCache[requestedMember.name] = requestedMember;
                        requestedMembers[requestedMembers.length] = requestedMember;
                    }
                }
            }
            
            return requestedMembers;
        }

        public getConstructorMethod(): PullSymbol {

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getConstructorMethod();
            }

            if (!this._instantiatedConstructorMethod) {
                var referencedConstructorMethod = this.referencedTypeSymbol.getConstructorMethod();
                this._instantiatedConstructorMethod = new PullSymbol(referencedConstructorMethod.name, referencedConstructorMethod.kind);
                this._instantiatedConstructorMethod.type = PullInstantiatedTypeReferenceSymbol.create(referencedConstructorMethod.type, this._typeParameterArgumentMap);
            }


            return this._instantiatedConstructorMethod;
        }

        public getAssociatedContainerType(): PullTypeSymbol {

            if (!this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getAssociatedContainerType();
            }

            if (!this._instantiatedAssociatedContainerType) {
                var referencedAssociatedContainerType = this.referencedTypeSymbol.getAssociatedContainerType();

                if (referencedAssociatedContainerType) {
                    this._instantiatedAssociatedContainerType = PullInstantiatedTypeReferenceSymbol.create(referencedAssociatedContainerType, this._typeParameterArgumentMap);
                }
            }

            return this._instantiatedAssociatedContainerType;
        }

        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);
            }

            if (this._instantiatedCallSignatures) {
                return this._instantiatedCallSignatures;
            }

            var referencedCallSignatures = this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);
            this._instantiatedCallSignatures = [];

            for (var i = 0; i < referencedCallSignatures.length; i++) {
                if (!signatureWrapsSomeTypeParameter(referencedCallSignatures[i], this._typeParameterArgumentMap)) {
                    this._instantiatedCallSignatures[this._instantiatedCallSignatures.length] = referencedCallSignatures[i];
                }
                else {
                    this._instantiatedCallSignatures[this._instantiatedCallSignatures.length] = instantiateSignature(referencedCallSignatures[i], this._typeParameterArgumentMap);
                }
            }

            return this._instantiatedCallSignatures;
        }

        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);
            }

            if (this._instantiatedConstructSignatures) {
                return this._instantiatedConstructSignatures;
            }

            var referencedConstructSignatures = this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);
            this._instantiatedConstructSignatures = [];

            for (var i = 0; i < referencedConstructSignatures.length; i++) {
                if (!signatureWrapsSomeTypeParameter(referencedConstructSignatures[i], this._typeParameterArgumentMap)) {
                    this._instantiatedConstructSignatures[this._instantiatedConstructSignatures.length] = referencedConstructSignatures[i];
                }
                else {
                    this._instantiatedConstructSignatures[this._instantiatedConstructSignatures.length] = instantiateSignature(referencedConstructSignatures[i], this._typeParameterArgumentMap);
                }
            }

            return this._instantiatedConstructSignatures;
        }

        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isInstanceReferenceType) {
                return this.referencedTypeSymbol.getIndexSignatures(collectBaseSignatures);
            }

            if (this._instantiatedIndexSignatures) {
                return this._instantiatedIndexSignatures;
            }

            var referencedIndexSignatures = this.referencedTypeSymbol.getIndexSignatures(collectBaseSignatures);
            this._instantiatedIndexSignatures = [];

            for (var i = 0; i < referencedIndexSignatures.length; i++) {
                if (!signatureWrapsSomeTypeParameter(referencedIndexSignatures[i], this._typeParameterArgumentMap)) {
                    this._instantiatedIndexSignatures[this._instantiatedIndexSignatures.length] = referencedIndexSignatures[i];
                }
                else {
                    this._instantiatedIndexSignatures[this._instantiatedIndexSignatures.length] = instantiateSignature(referencedIndexSignatures[i], this._typeParameterArgumentMap);
                }
            }

            return this._instantiatedIndexSignatures;
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
    }
    
    export function instantiateType(type: PullTypeSymbol, typeParameterArgumentMap: any, instantiateFunctionTypeParameters = false): PullTypeSymbol {

        // if the type is a primitive type, nothing to do here
        if (type.isPrimitive()) {
            return type;
        }

        // if the type is an error, nothing to do here
        if (type.isError()) {
            return type;
        }

        if (typeParameterArgumentMap[type.pullSymbolIDString]) {
            return typeParameterArgumentMap[type.pullSymbolIDString]
        }

        if (typeWrapsSomeTypeParameter(type, typeParameterArgumentMap)) {
            return PullInstantiatedTypeReferenceSymbol.create(type, typeParameterArgumentMap, instantiateFunctionTypeParameters);
        }

        return type;
    }

    // REVIEW: Should cache these checks

    // The argument map prevents us from accidentally flagging method type parameters, or (if we
    // ever decide to go that route) allows for partial specialization
    function typeWrapsSomeTypeParameter(type: PullTypeSymbol, typeParameterArgumentMap: any): boolean {

        if (!type) {
            return false;
        }

        var wrapsSomeTypeParameter = false;

        if (type.inWrapCheck) {
            return wrapsSomeTypeParameter;
        }

        type.inWrapCheck = true;        

        // if we encounter a type paramter, we're obviously wrapping
        if (type.isTypeParameter() && typeParameterArgumentMap[type.pullSymbolIDString]) {
            wrapsSomeTypeParameter = true;
        }

        if (!wrapsSomeTypeParameter) {
            var typeArguments = type.getTypeArguments();

            // If there are no type arguments, we could be instantiating the 'root' type
            // declaration
            if (type.isGeneric() && !typeArguments) {
                typeArguments = type.getTypeParameters();
            }

            // if it's a generic type, scan the type arguments to see which may wrap type parameters
            if (typeArguments) {
                for (var i = 0; i < typeArguments.length; i++) {
                    if (typeWrapsSomeTypeParameter(typeArguments[i], typeParameterArgumentMap)) {
                        wrapsSomeTypeParameter = true;
                        break;
                    }
                }
            }
        }

        // if it's not a named type, we'll need to introspect its member list
        if (!(type.kind & PullElementKind.SomeNamedType) || !type.name) {
            if (!wrapsSomeTypeParameter) {
                // otherwise, walk the member list and signatures, checking for wraps
                var members = type.getAllMembers(PullElementKind.SomeValue, GetAllMembersVisiblity.all);

                for (var i = 0; i < members.length; i++) {
                    if (typeWrapsSomeTypeParameter(members[i].type, typeParameterArgumentMap)) {
                        wrapsSomeTypeParameter = true;
                        break;
                    }
                }
            }

            if (!wrapsSomeTypeParameter) {
                var sigs = type.getCallSignatures(true);

                for (var i = 0; i < sigs.length; i++) {
                    if (signatureWrapsSomeTypeParameter(sigs[i], typeParameterArgumentMap)) {
                        wrapsSomeTypeParameter = true;
                        break;
                    }
                }
            }

            if (!wrapsSomeTypeParameter) {
                sigs = type.getConstructSignatures(true);

                for (var i = 0; i < sigs.length; i++) {
                    if (signatureWrapsSomeTypeParameter(sigs[i], typeParameterArgumentMap)) {
                        wrapsSomeTypeParameter = true;
                        break;
                    }
                }
            }

            if (!wrapsSomeTypeParameter) {
                sigs = type.getIndexSignatures(true);

                for (var i = 0; i < sigs.length; i++) {
                    if (signatureWrapsSomeTypeParameter(sigs[i], typeParameterArgumentMap)) {
                        wrapsSomeTypeParameter = true;
                        break;
                    }
                }
            }
        }

        type.inWrapCheck = false;

        return wrapsSomeTypeParameter;
    }

    function signatureWrapsSomeTypeParameter(signature: PullSignatureSymbol, typeParameterArgumentMap: any): boolean {

        if (signature.inWrapCheck) {
            return false;
        }

        signature.inWrapCheck = true;

        var wrapsSomeTypeParameter = false;

        if (typeWrapsSomeTypeParameter(signature.returnType, typeParameterArgumentMap)) {
            wrapsSomeTypeParameter = true;
        }

        if (!wrapsSomeTypeParameter) {
            var parameters = signature.parameters;

            for (var i = 0; i < parameters.length; i++) {
                if (typeWrapsSomeTypeParameter(parameters[i].type, typeParameterArgumentMap)) {
                    wrapsSomeTypeParameter = true;
                    break;
                }
            }
        }

        signature.inWrapCheck = false;

        return wrapsSomeTypeParameter;
    }

    export function instantiateSignature(signature: PullSignatureSymbol, typeParameterArgumentMap: any, instantiateFunctionTypeParameters = false): PullSignatureSymbol {

        if (!signatureWrapsSomeTypeParameter(signature, typeParameterArgumentMap)) {
            return signature;
        }

        var typeArguments: PullTypeSymbol[] = [];

        var rootSignature = <PullSignatureSymbol>signature.getRootSymbol();

        for (var typeParameterID in typeParameterArgumentMap) {
            typeArguments[typeArguments.length] = typeParameterArgumentMap[typeParameterID];
        }

        var instantiatedSignature = instantiateFunctionTypeParameters ? rootSignature.getSpecialization(typeArguments) : null;

        if (instantiatedSignature) {
            return instantiatedSignature;
        }

        nSpecializedSignaturesCreated++;

        instantiatedSignature = new PullSignatureSymbol(signature.kind);
        instantiatedSignature.setRootSymbol(signature);

        // add type parameters
        var typeParameters = signature.getTypeParameters();

        for (var i = 0; i < typeParameters.length; i++) {
            instantiatedSignature.addTypeParameter(typeParameters[i]);
        }

        instantiatedSignature.returnType = instantiateType(signature.returnType, typeParameterArgumentMap, instantiateFunctionTypeParameters);

        var parameters = signature.parameters;
        var parameter: PullSymbol = null;

        if (parameters) {
            for (var j = 0; j < parameters.length; j++) {
                parameter = new PullSymbol(parameters[j].name, PullElementKind.Parameter);
                parameter.setRootSymbol(parameters[j]);
                //parameter.addDeclaration(parameters[j].getDeclarations()[0]);
                if (parameters[j].isOptional) {
                    parameter.isOptional = true;
                }
                if (parameters[j].isVarArg) {
                    parameter.isVarArg = true;
                    instantiatedSignature.hasVarArgs = true;
                }
                instantiatedSignature.addParameter(parameter, parameter.isOptional);

                parameter.type = instantiateType(parameters[j].type, typeParameterArgumentMap, instantiateFunctionTypeParameters);
            }
        }

        if (instantiateFunctionTypeParameters) {
            signature.addSpecialization(instantiatedSignature, typeArguments);
        }

        return instantiatedSignature;
    }
}