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
                typeReference = new PullTypeReferenceSymbol(type.name, type.kind, type);
                type.typeReference = typeReference;
            }

            return typeReference;
        }

        // use the root symbol to model the actual type
        // do not call this directly!
        constructor(name: string, kind: PullElementKind, public referencedTypeSymbol: PullTypeSymbol) {
            super(name, kind);

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
            // GTODO: do not need to resolve
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
            // don't need to resolve the referenced type first - this is computed in the binder
            // GTODO: do not need to resolve
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
            // don't need to resolve the referenced type first - this is computed in the binder
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeParameters();
        }

        public isGeneric(): boolean {
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isGeneric();
        }
        public isFixed(): boolean {
            // GTODO: necessary?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.isFixed();
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": addSpecialization");
        }
        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getSpecialization(substitutingTypes);
        }
        public getKnownSpecializations(): PullTypeSymbol[]{
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getKnownSpecializations();
        }
        public getTypeArguments(): PullTypeSymbol[] {
            // GTODO: necessary?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypeArguments();
        }
        public setTypeArguments(typeArgs: PullTypeSymbol[]): void {
            Debug.fail("Reference symbol " + this.pullSymbolIDString + ": setTypeArguments");
        }
        public getTypeArgumentsOrTypeParameters(): PullTypeSymbol[] {
            // GTODO: resolve first?
            // GTODO: do not need to resolve
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
            // no need to resolve first - call signatures are computed in the binder
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnCallSignatures();
        }
        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            // GTODO: currently need to resolve to build the 'all' signature list
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);
        }
        public hasOwnConstructSignatures(): boolean {
            // no need to resolve first - construct signatures are computed in the binder
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasOwnConstructSignatures();
        }
        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            // GTODO: currently need to resolve to build the 'all' signature list
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);
        }
        public hasOwnIndexSignatures(): boolean {
            // no need to resolve first - index signatures are computed in the binder
            // GTODO: do not need to resolve
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
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getImplementedTypes();
        }
        public addExtendedType(extendedType: PullTypeSymbol): void {
            this.referencedTypeSymbol.addExtendedType(extendedType);
        }
        public getExtendedTypes(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getExtendedTypes();
        }
        public addTypeThatExtendsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExtendsThisType(type);
        }
        public getTypesThatExtendThisType(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExtendThisType();
        }
        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void {
            this.referencedTypeSymbol.addTypeThatExplicitlyImplementsThisType(type);
        }
        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[]{
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.getTypesThatExplicitlyImplementThisType();
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            // GTODO: do not need to resolve
            this.ensureReferencedTypeIsResolved();
            return this.referencedTypeSymbol.hasBase(potentialBase, visited);
        }
        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean {
            // GTODO: account for generic specialization?
            // GTODO: resolve first?
            // GTODO: do not need to resolve
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
        private _instantiatedCallSignatures: PullSignatureSymbol[] = null;
        private _instantiatedConstructSignatures: PullSignatureSymbol[] = null;
        private _instantiatedIndexSignatures: PullSignatureSymbol[] = null;

        constructor(name: string, kind: PullElementKind, public referencedTypeSymbol: PullTypeSymbol, private _typeArgumentReferences: PullTypeReferenceSymbol[]) {
            super(name, kind, referencedTypeSymbol);
        }

        public isGeneric(): boolean {
            return true;
        }

        public generativeTypeKind: GenerativeTypeKind = GenerativeTypeKind.Unknown;

        public isFixed(): boolean {
            // GTODO: necessary?
            return this.referencedTypeSymbol.isFixed();
        }

        public getTypeArguments(): PullTypeSymbol[] {
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

            // for each of the referenced type's members, need to properly instantiate their
            // type references

            return this._instantiatedMembers;
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            // ensure that the type is resolved before looking for members
            this.ensureReferencedTypeIsResolved();

            // if the member exists on the referenced type, need to ensure that it's
            // instantiated

            var memberSymbol = this.referencedTypeSymbol.findMember(name, lookInParent);

            return memberSymbol;
        }

        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[] {
            // ensure that the type is resolved before trying to collect all members
            this.ensureReferencedTypeIsResolved();

            var allMembers = this.referencedTypeSymbol.getAllMembers(searchDeclKind, memberVisiblity);

            return allMembers;
        }

        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {
            // no need to resolve first - call signatures are computed in the binder
            this._instantiatedCallSignatures = this.referencedTypeSymbol.getCallSignatures(collectBaseSignatures);

            return this._instantiatedCallSignatures;
        }

        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {
            this._instantiatedConstructSignatures = this.referencedTypeSymbol.getConstructSignatures(collectBaseSignatures);

            return this._instantiatedConstructSignatures;
        }

        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {
            this._instantiatedIndexSignatures = this.referencedTypeSymbol.getIndexSignatures(collectBaseSignatures);

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
    export class PullInstantiatedSignatureSymbol extends PullSignatureSymbol {
    }
}