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
        public isFixed(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isFixed();
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addSpecialization");
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
        public setTypeArguments(typeArgs: PullTypeSymbol[]): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": setTypeArguments");
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
            // GTODO: currently need to resolve to build the 'all' signature list
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);
        }
        public hasOwnConstructSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnConstructSignatures();
        }
        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            // GTODO: currently need to resolve to build the 'all' signature list
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);
        }
        public hasOwnIndexSignatures(): boolean {
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnIndexSignatures();
        }
        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            // GTODO: currently need to resolve to build the 'all' signature list
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getIndexSignatures(collectBaseSignatures);
        }

        public addImplementedType(implementedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addImplementedType(implementedType);
        }
        public getImplementedTypes(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getImplementedTypes();
        }
        public addExtendedType(extendedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addExtendedType(extendedType);
        }
        public getExtendedTypes(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getExtendedTypes();
        }
        public addTypeThatExtendsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExtendsThisType(type);
        }
        public getTypesThatExtendThisType(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExtendThisType();
        }
        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExplicitlyImplementsThisType(type);
        }
        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExplicitlyImplementThisType();
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            // GTODO: account for generic specialization?
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean {
            // GTODO: account for generic specialization?
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
        private _allInstantiatedMembers: PullSymbol[] = null;
        private _instantiatedMemberNameCache: any = new BlockIntrinsics(); // cache from member names to pull symbols
        private _instantiatedCallSignatures: PullSignatureSymbol[] = null;
        private _instantiatedConstructSignatures: PullSignatureSymbol[] = null;
        private _instantiatedIndexSignatures: PullSignatureSymbol[] = null;
        private _typeArgumentReferences: PullTypeSymbol[] = null;

        public isReferencedType: boolean = false;

        public getIsSpecialized() { return !this.isReferencedType; }

        public isArray() { return this.getRootSymbol() == globalResolver.getCachedArrayType(); }

        public getReferencedTypeSymbol(): PullTypeSymbol {
            this.ensureReferencedTypeIsResolved();

            return this;
        }

        // GTODO: Rather than pass in the map, pass in a list that we can construct from?
        // Or, just introduce a helper function to create the map for us
        public static create(type: PullTypeSymbol, typeParameterArgumentMap: any): PullInstantiatedTypeReferenceSymbol {

            // check for an existing instantiation
            var rootType = <PullTypeSymbol>type.getRootSymbol();

            var typeArgumentList: PullTypeSymbol[] = [];

            for (var typeParameterID in typeParameterArgumentMap) {
                typeArgumentList[typeArgumentList.length] = typeParameterArgumentMap[typeParameterID];
            }

            var instantiation = <PullInstantiatedTypeReferenceSymbol>rootType.getSpecialization(typeArgumentList);

            if (instantiation) {
                return instantiation;
            }

            var typeParameters = rootType.getTypeParameters();

            // If the reference is made to itself (e.g., referring to Array<T> within the declaration of Array<T>,
            // We want to special-case the reference so later calls to getMember, etc., will delegate directly
            // to the referenced declaration type, and not force any additional instantiation
            var isReferencedType = true;

            if (typeParameters && typeArgumentList && (typeParameters.length == typeArgumentList.length)) {
                
                for (var i = 0; i < typeParameters.length; i++) {
                    if (!PullHelpers.typeSymbolsAreIdentical(typeParameters[i], typeArgumentList[i])) {
                        isReferencedType = false;
                        break;
                    }
                }

                if (isReferencedType) {
                    typeParameterArgumentMap = {};
                }
            }

            instantiation = new PullInstantiatedTypeReferenceSymbol(type, typeParameterArgumentMap);

            rootType.addSpecialization(instantiation, typeArgumentList);

            if (isReferencedType) {
                instantiation.isReferencedType = true;
            }

            return instantiation;
        }

        constructor(public referencedTypeSymbol: PullTypeSymbol, private _typeParameterArgumentMap: any) {
            super(referencedTypeSymbol);

            nSpecializationsCreated++;

            Debug.assert(referencedTypeSymbol.isGeneric(), "Cannot instantiate a non-generic type");
        }

        public isGeneric(): boolean {
            return !!this.referencedTypeSymbol.getTypeParameters().length;
        }

        public generativeTypeKind: GenerativeTypeKind = GenerativeTypeKind.Unknown;

        public isFixed(): boolean {
            // GTODO: necessary?
            return this.referencedTypeSymbol.isFixed();
        }

        public getTypeArguments(): PullTypeSymbol[]{

            if (this.isReferencedType) {
                return null;
            }

            if (!this._typeArgumentReferences) {
                var typeParameters = this.referencedTypeSymbol.getTypeParameters();

                if (typeParameters.length) {
                    var typeArgument: PullTypeSymbol = null;
                    var typeArguments: PullTypeSymbol[] = [];

                    for (var i = 0; i < typeParameters.length; i++) {
                        typeArgument = <PullTypeSymbol>this._typeParameterArgumentMap[typeParameters[i].pullSymbolIDString];

                        if (!typeArgument) {
                            Debug.assert(this._typeArgumentReferences.length == typeParameters.length, "type argument mismatch");
                        }

                        typeArguments[typeArguments.length] = typeArgument;
                    }

                    this._typeArgumentReferences = typeArguments;
                }
            }

            return this._typeArgumentReferences;
        }
        public setTypeArguments(typeArgs: PullTypeSymbol[]): void {
            Debug.fail("setTypeArguments");
        }

        //
        // lazily evaluated members
        //
        public getMembers(): PullSymbol[] {
            // need to resolve the referenced types to get the members
            this.ensureReferencedTypeIsResolved();

            if (this.isReferencedType) {
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

                    if (!this._instantiatedMemberNameCache[referencedMember.name]) {

                        // if the member does not require further specialization, re-use the referenced symbol
                        if (!typeWrapsSomeTypeParameter(referencedMember.type, this._typeParameterArgumentMap)) {
                            instantiatedMember = referencedMember;
                        }
                        else {
                            instantiatedMember = new PullSymbol(referencedMember.name, referencedMember.kind);
                            instantiatedMember.setRootSymbol(referencedMember);
                            instantiatedMember.type = instantiateType(referencedMember.type, this._typeParameterArgumentMap);
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

            if (this.isReferencedType) {
                return this.referencedTypeSymbol.findMember(name, lookInParent);
            }

            // if the member exists on the referenced type, need to ensure that it's
            // instantiated

            var memberSymbol = <PullSymbol>this._instantiatedMemberNameCache[name];

            if (!memberSymbol) {
                var referencedMemberSymbol = this.referencedTypeSymbol.findMember(name, lookInParent);
                memberSymbol = new PullSymbol(referencedMemberSymbol.name, referencedMemberSymbol.kind);
                memberSymbol.setRootSymbol(referencedMemberSymbol);
                memberSymbol.type = instantiateType(referencedMemberSymbol.type, this._typeParameterArgumentMap);

                this._instantiatedMemberNameCache[memberSymbol.name] = memberSymbol;
            }

            return memberSymbol;
        }

        // May need to cache based on search kind / visibility combinations
        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[] {
            // ensure that the type is resolved before trying to collect all members
            this.ensureReferencedTypeIsResolved();

            if (this.isReferencedType) {
                return this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);
            }

            var requestedMembers: PullSymbol[] = [];
            var allReferencedMembers = this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);

            if (!this._allInstantiatedMembers) {
                // first, seed with this type's members
                var members = this.getMembers();

                for (var i = 0; i < members.length; i++) {
                    this._allInstantiatedMembers[this._allInstantiatedMembers.length] = members[i];
                }

                // next, for add any symbols belonging to the parent type, if necessary
                var referencedMember: PullSymbol = null;
                var requestedMember: PullSymbol = null;

                for (var i = 0; i < allReferencedMembers.length; i++) {
                    referencedMember = allReferencedMembers[i];

                    if (this._allInstantiatedMembers[referencedMember.name]) {
                        requestedMembers[requestedMembers.length] = this._allInstantiatedMembers[referencedMember.name];
                    }
                    else {
                        if (!typeWrapsSomeTypeParameter(referencedMember.type, this._typeParameterArgumentMap)) {
                            this._allInstantiatedMembers[referencedMember.name] = referencedMember;
                            requestedMembers[requestedMembers.length] = referencedMember;
                        }
                        else {
                            requestedMember = new PullSymbol(referencedMember.name, referencedMember.kind);
                            requestedMember.setRootSymbol(referencedMember);
                            requestedMember.type = instantiateType(referencedMember.type, this._typeParameterArgumentMap);

                            this._allInstantiatedMembers[requestedMember.name] = requestedMember;
                            requestedMembers[requestedMembers.length] = requestedMember;
                        }
                    }
                }
            }

            return requestedMembers;
        }

        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            this.ensureReferencedTypeIsResolved();

            if (this.isReferencedType) {
                return this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);
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

            if (this.isReferencedType) {
                return this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);
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

            if (this.isReferencedType) {
                return this.referencedTypeSymbol.getIndexSignatures(collectBaseSignatures);
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


        //
        // Base type checking
        //
        public addImplementedType(implementedType: PullTypeSymbol): void {
            Debug.fail("addImplementedType");
        }
        public getImplementedTypes(): PullTypeSymbol[] {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            return this.referencedTypeSymbol.getImplementedTypes();
        }
        public addExtendedType(extendedType: PullTypeSymbol): void {
            Debug.fail("addExtendedType");
        }
        public getExtendedTypes(): PullTypeSymbol[] {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            return this.referencedTypeSymbol.getExtendedTypes();
        }
        public addTypeThatExtendsThisType(type: PullTypeSymbol): void {
            Debug.fail("addTypeThatExtendsThisType");
        }
        public getTypesThatExtendThisType(): PullTypeSymbol[] {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            return this.referencedTypeSymbol.getTypesThatExtendThisType();
        }
        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void {
            Debug.fail("addTypeThatExplicitlyImplementsThisType");
        }
        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[] {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            return this.referencedTypeSymbol.getTypesThatExplicitlyImplementThisType();
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
    }

    // Instantiated signature symbols
    //export class PullInstantiatedSignatureSymbol extends PullSignatureSymbol {

    //    constructor(signature: PullSignatureSymbol) {
    //        super(signature.kind);

    //        this.setRootSymbol(signature);
    //    }

    //}
    
    function instantiateType(type: PullTypeSymbol, typeParameterArgumentMap: any): PullTypeSymbol {

        // if the type is a primitive type, nothing to do here
        if (type.isPrimitive()) {
            return type;
        }

        // if the type is an error, nothing to do here
        if (type.isError()) {
            return type;
        }

        if (type.isTypeParameter() && typeParameterArgumentMap[type.pullSymbolIDString]) {
            return typeParameterArgumentMap[type.pullSymbolIDString]
        }

        if (typeWrapsSomeTypeParameter(type, typeParameterArgumentMap)) {
            return PullInstantiatedTypeReferenceSymbol.create(type, typeParameterArgumentMap);
        }

        return type;
    }

    // GTODO: walk the type's members' types looking for wrapped type parameters
    // If one is found, we'll need to create a specialized version of the object type
    // If none are found, there's no need to specialize.
    // GTODO: I think this can replace 'isFixed' checks
    // GTODO: Should cache these checks

    // The argument map prevents us from accidentally flagging method type parameters, or (if we
    // ever decide to go that route) allows for partial specialization
    function typeWrapsSomeTypeParameter(type: PullTypeSymbol, typeParameterArgumentMap: any): boolean {

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

        type.inWrapCheck = false;

        return wrapsSomeTypeParameter;
    }

    function signatureWrapsSomeTypeParameter(signature: PullSignatureSymbol, typeParameterArgumentMap: any): boolean {

        if (typeWrapsSomeTypeParameter(signature.returnType, typeParameterArgumentMap)) {
            return true;
        }

        var parameters = signature.parameters;

        for (var i = 0; i < parameters.length; i++) {
            if (typeWrapsSomeTypeParameter(parameters[i].type, typeParameterArgumentMap)) {
                return true;
            }
        }

        return false;
    }

    export function instantiateSignature(signature: PullSignatureSymbol, typeParameterArgumentMap: any): PullSignatureSymbol {

        if (!signatureWrapsSomeTypeParameter(signature, typeParameterArgumentMap)) {
            return signature;
        }

        var typeArguments: PullTypeSymbol[] = [];

        var rootSignature = <PullSignatureSymbol>signature.getRootSymbol();

        for (var typeParameterID in typeParameterArgumentMap) {
            typeArguments[typeArguments.length] = typeParameterArgumentMap[typeParameterID];
        }

        var instantiatedSignature = rootSignature.getSpecialization(typeArguments);

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

        instantiatedSignature.returnType = instantiateType(signature.returnType, typeParameterArgumentMap);

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
                    this.hasVarArgs = true;
                }
                this.addParameter(parameter);

                parameter.type = instantiateType(parameters[j].type, typeParameterArgumentMap);
            }
        }

        signature.addSpecialization(instantiatedSignature, typeArguments);

        return instantiatedSignature;
    }
}