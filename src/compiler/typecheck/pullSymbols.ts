// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullSymbolID = 0;
    export var lastBoundPullSymbolID = 0;
    export var globalTyvarID = 0;

    export class PullSymbol {

        // private state
        private pullSymbolID = pullSymbolID++;

        private name: string;

        private cachedPathIDs: any = {};

        private declKind: PullElementKind;

        private _container: PullTypeSymbol = null;
        private _type: PullTypeSymbol = null;

        // We cache the declarations to improve look-up speed
        // (but we re-create on edits because deletion from the linked list is
        // much faster)
        private _declarations: PullDecl[] = null;

        private hasBeenResolved = false;

        private isOptional = false;

        private inResolution = false;

        private isSynthesized = false;

        private isVarArg = false;

        private isSpecialized = false;
        private isBeingSpecialized = false;

        private rootSymbol: PullSymbol = null;

        private _parentAccessorSymbol: PullSymbol = null;
        private _enclosingSignature: PullSignatureSymbol = null;

        public typeChangeUpdateVersion = -1;
        public addUpdateVersion = -1;
        public removeUpdateVersion = -1;

        public docComments: string = null;

        public isPrinting = false;

        // public surface area
        public getSymbolID() { return this.pullSymbolID; }

        public isType() {
            return (this.declKind & PullElementKind.SomeType) != 0;
        }

        public isSignature() {
            return (this.declKind & PullElementKind.SomeSignature) != 0;
        }

        public isArray() {
            return (this.declKind & PullElementKind.Array) != 0;
        }

        public isPrimitive() {
            return this.declKind === PullElementKind.Primitive;
        }

        public isAccessor() {
            return false;
        }

        public isError() {
            return false;
        }

        public isInterface() {
            return this.getKind() === PullElementKind.Interface;
        }

        public isMethod() {
            return this.getKind() === PullElementKind.Method;
        }

        public isProperty() {
            return this.getKind() === PullElementKind.Property;
        }

        constructor(name: string, declKind: PullElementKind) {
            this.name = name;
            this.declKind = declKind;
        }

        public isAlias() { return false; }
        public isContainer() { return false; }

        public setAccessorSymbol(accessor: PullSymbol) {
            this._parentAccessorSymbol = accessor;
        }

        public getAccessorySymbol(): PullSymbol {
            return this._parentAccessorSymbol;
        }

        private findAliasedType(decls: PullDecl[]) {
            for (var i = 0; i < decls.length; i++) {
                var childDecls = decls[i].getChildDecls();
                for (var j = 0; j < childDecls.length; j++) {
                    if (childDecls[j].getKind() === PullElementKind.TypeAlias) {
                        var symbol = <PullTypeAliasSymbol>childDecls[j].getSymbol();
                        if (PullContainerTypeSymbol.usedAsSymbol(symbol, this)) {
                            return symbol;
                        }
                    }
                }
            }

            return null;
        }

        public getAliasedSymbol(scopeSymbol: PullSymbol) {
            if (!scopeSymbol) {
                return null;
            }

            var scopePath = scopeSymbol.pathToRoot();
            if (scopePath.length && scopePath[scopePath.length - 1].getKind() === PullElementKind.DynamicModule) {
                var decls = scopePath[scopePath.length - 1].getDeclarations();
                var symbol = this.findAliasedType(decls);
                return symbol;
            }

            return null;
        }

        /** Use getName for type checking purposes, and getDisplayName to report an error or display info to the user.
         * They will differ when the identifier is an escaped unicode character or the identifier "__proto__".
         */
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getAliasedSymbol(scopeSymbol);
            if (symbol) {
                return symbol.getName();
            }
            
            return this.name;
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getAliasedSymbol(scopeSymbol);
            if (symbol) {
                return symbol.getDisplayName();
            }

            // Get the actual name associated with a declaration for this symbol
            return this.getDeclarations()[0].getDisplayName();
        }

        public getKind() { return this.declKind; }
        public setKind(declType: PullElementKind) { this.declKind = declType; }

        public setIsOptional() { this.isOptional = true; }
        public getIsOptional() { return this.isOptional; }

        public getIsVarArg() { return this.isVarArg; }
        public setIsVarArg() { this.isVarArg = true; }

        public setIsSpecialized() { this.isSpecialized = true; this.isBeingSpecialized = false; }
        public getIsSpecialized() { return this.isSpecialized; }
        public currentlyBeingSpecialized() { return this.isBeingSpecialized; }
        public setIsBeingSpecialized() { this.isBeingSpecialized = true; }
        public setValueIsBeingSpecialized(val: boolean) { this.isBeingSpecialized = val; }

        public getRootSymbol() { 
            if (!this.rootSymbol) {
                return this;
            }
            return this.rootSymbol;
        }
        public setRootSymbol(symbol: PullSymbol) { this.rootSymbol = symbol; }

        public setIsSynthesized(value = true) {
            this.isSynthesized = value;
        }
        public getIsSynthesized() { return this.isSynthesized; }

        public setEnclosingSignature(signature: PullSignatureSymbol) {
            this._enclosingSignature = signature;
        }

        public getEnclosingSignature(): PullSignatureSymbol {
            return this._enclosingSignature;
        }

        public addCacheID(cacheID: string) {
            if (!this.cachedPathIDs[cacheID]) {
                this.cachedPathIDs[cacheID] = true;
            }
        }

        public invalidateCachedIDs(cache: any) {
            for (var id in this.cachedPathIDs) {
                if (cache[id]) {
                    cache[id] = undefined;
                }
            }
        }

        // declaration methods
        public addDeclaration(decl: PullDecl) {
            Debug.assert(!!decl);

            if (this.rootSymbol) {
                return;
            }

            if (!this._declarations) {
                this._declarations = [decl];
            }
            else {
                this._declarations[this._declarations.length] = decl;
            }
        }

        public getDeclarations(): PullDecl[] {
            if (this.rootSymbol) {
                return this.rootSymbol.getDeclarations();
            }

            if (!this._declarations) {
                this._declarations = [];
            }

            return this._declarations;
        }

        // link methods

        public setContainer(containerSymbol: PullTypeSymbol) {
            if (this.rootSymbol) {
                return;
            }

            this._container = containerSymbol;
        }

        public getContainer(): PullTypeSymbol {
            if (this.rootSymbol) {
                return this.rootSymbol.getContainer();
            }

            return this._container;
        }

        public setType(type: PullTypeSymbol) {
            this._type = type;
        }

        public getType(): PullTypeSymbol {
            return this._type;
        }

        public isTyped() {
            return this._type != null;
        }

        public setResolved() {
            this.hasBeenResolved = true;
            this.inResolution = false;
        }
        public isResolved() { return this.hasBeenResolved; }

        public startResolving() {
            this.inResolution = true;
        }
        public isResolving() {
            return this.inResolution;
        }

        public setUnresolved() {
            this.hasBeenResolved = false;
            this.inResolution = false;
        }

        public invalidate() {

            this.hasBeenResolved = false;

            var declarations = this.getDeclarations();

            // reset the errors for its decl
            for (var i = 0; i < declarations.length; i++) {
                declarations[i].resetErrors();
            }
        }

        public hasFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if ((declarations[i].getFlags() & flag) !== PullElementFlags.None) {
                    return true;
                }
            }
            return false;
        }

        public allDeclsHaveFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if (!((declarations[i].getFlags() & flag) !== PullElementFlags.None)) {
                    return false;
                }
            }
            return true;
        }

        public pathToRoot() {
            var path: PullSymbol[] = [];
            var node = this;
            while (node) {
                if (node.isType()) {
                    var associatedContainerSymbol = (<PullTypeSymbol>node).getAssociatedContainerType();
                    if (associatedContainerSymbol) {
                        node = associatedContainerSymbol;
                    }
                }
                path[path.length] = node;
                node = node.getContainer();
            }
            return path;
        }

        public findCommonAncestorPath(b: PullSymbol): PullSymbol[] {
            var aPath = this.pathToRoot();
            if (aPath.length === 1) {
                // Global symbol
                return aPath;
            }

            var bPath: PullSymbol[];
            if (b) {
                bPath = b.pathToRoot();
            } else {
                return aPath;
            }

            var commonNodeIndex = -1;
            for (var i = 0, aLen = aPath.length; i < aLen; i++) {
                var aNode = aPath[i];
                for (var j = 0, bLen = bPath.length; j < bLen; j++) {
                    var bNode = bPath[j];
                    if (aNode === bNode) {
                        var aDecl: PullDecl = null;
                        if (i > 0) {
                            var decls = aPath[i - 1].getDeclarations();
                            if (decls.length) {
                                aDecl = decls[0].getParentDecl();
                            }
                        }
                        var bDecl: PullDecl = null;
                        if (j > 0) {
                            var decls = bPath[j - 1].getDeclarations();
                            if (decls.length) {
                                bDecl = decls[0].getParentDecl();
                            }
                        }
                        if (!aDecl || !bDecl || aDecl == bDecl) {
                            commonNodeIndex = i;
                            break;
                        }
                    }
                }
                if (commonNodeIndex >= 0) {
                    break;
                }
            }

            if (commonNodeIndex >= 0) {
                return aPath.slice(0, commonNodeIndex);
            }
            else {
                return aPath;
            }
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var str = this.getNameAndTypeName(scopeSymbol);
            return str;
        }

        public getNamePartForFullName() {
            return this.getDisplayName(null, true);
        }

        public fullName(scopeSymbol?: PullSymbol) {
            var path = this.pathToRoot();
            var fullName = "";
            var aliasedSymbol = this.getAliasedSymbol(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.getDisplayName();
            }

            for (var i = 1; i < path.length; i++) {
                aliasedSymbol = path[i].getAliasedSymbol(scopeSymbol);
                if (aliasedSymbol) {
                    // Aliased name found
                    fullName = aliasedSymbol.getDisplayName() + "." + fullName;
                    break;
                } else {
                    var scopedName = path[i].getNamePartForFullName();
                    if (path[i].getKind() == PullElementKind.DynamicModule && !isQuoted(scopedName)) {
                        // Same file as dynamic module - do not include this name
                        break;
                    }

                    if (scopedName === "") {
                        // If the item does not have a name, stop enumarting them, e.g. Object literal
                        break;
                    }

                    fullName = scopedName + "." + fullName;
                }
            }

            fullName = fullName + this.getNamePartForFullName();
            return fullName;
        }

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var path = this.findCommonAncestorPath(scopeSymbol);
            var fullName = "";
            var aliasedSymbol = this.getAliasedSymbol(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.getDisplayName();
            }

            for (var i = 1; i < path.length; i++) {
                var kind = path[i].getKind();
                if (kind === PullElementKind.Container || kind === PullElementKind.DynamicModule) {
                    aliasedSymbol = path[i].getAliasedSymbol(scopeSymbol);
                    if (aliasedSymbol) {
                        // Aliased name
                        fullName = aliasedSymbol.getDisplayName() + "." + fullName;
                        break;
                    } else if (kind === PullElementKind.Container) {
                        fullName = path[i].getDisplayName() + "." + fullName;
                    } else {
                        // Dynamic module 
                        var displayName = path[i].getDisplayName();
                        if (isQuoted(displayName)) {
                            fullName = displayName + "." + fullName;
                        }
                        break;
                    }
                } else {
                    // Any other type of container is not part of the name
                    break;
                }
            }
            fullName = fullName + this.getDisplayName(scopeSymbol, useConstraintInName);
            return fullName;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean) {
            var name = this.getScopedName(scopeSymbol, useConstraintInName);
            return MemberName.create(name);
        }

        public getTypeName(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean) {
            var memberName = this.getTypeNameEx(scopeSymbol, getPrettyTypeName);
            return memberName.toString();
        }

        public getTypeNameEx(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean) {
            var type = this.getType();
            if (type) {
                var memberName: MemberName = getPrettyTypeName ? this.getTypeNameForFunctionSignature("", scopeSymbol, getPrettyTypeName) : null;
                if (!memberName) {
                    memberName = type.getScopedNameEx(scopeSymbol, /*useConstraintInName:*/ true, getPrettyTypeName);
                }

                return memberName;
            }
            return MemberName.create("");
        }

        private getTypeNameForFunctionSignature(prefix: string, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean) {
            var type = this.getType();
            if (type && !type.isNamedTypeSymbol() && this.declKind != PullElementKind.Property && this.declKind != PullElementKind.Variable && this.declKind != PullElementKind.Parameter) {
                var signatures = type.getCallSignatures();
                if (signatures.length == 1 || (getPrettyTypeName && signatures.length)) {
                    var typeName = new MemberNameArray();
                    var signatureName = PullSignatureSymbol.getSignaturesTypeNameEx(signatures, prefix, false, false, scopeSymbol, getPrettyTypeName);
                    typeName.addAll(signatureName);
                    return typeName;
                }
            }

            return null;
        }

        public getNameAndTypeName(scopeSymbol?: PullSymbol) {
            var nameAndTypeName = this.getNameAndTypeNameEx(scopeSymbol);
            return nameAndTypeName.toString();
        }

        public getNameAndTypeNameEx(scopeSymbol?: PullSymbol) {
            var type = this.getType();
            var nameStr = this.getDisplayName(scopeSymbol);
            if (type) {
                nameStr = nameStr + (this.getIsOptional() ? "?" : "");
                var memberName: MemberName = this.getTypeNameForFunctionSignature(nameStr, scopeSymbol);
                if (!memberName) {
                    var typeNameEx = type.getScopedNameEx(scopeSymbol);
                    memberName = MemberName.create(typeNameEx, nameStr + ": ", "");
                }
                return memberName;
            }
            return MemberName.create(nameStr);
        }

        static getTypeParameterString(typars: PullTypeSymbol[], scopeSymbol?: PullSymbol, useContraintInName?: boolean) {
            return PullSymbol.getTypeParameterStringEx(typars, scopeSymbol, /*getTypeParamMarkerInfo:*/ undefined, useContraintInName).toString();
        }

        static getTypeParameterStringEx(typeParameters: PullTypeSymbol[], scopeSymbol?: PullSymbol, getTypeParamMarkerInfo?: boolean, useContraintInName?: boolean) {
            var builder = new MemberNameArray();
            builder.prefix = "";

            if (typeParameters && typeParameters.length) {
                builder.add(MemberName.create("<"));

                for (var i = 0; i < typeParameters.length; i++) {
                    if (i) {
                        builder.add(MemberName.create(", "));
                    }

                    if (getTypeParamMarkerInfo) {
                        builder.add(new MemberName());
                    }

                    builder.add(typeParameters[i].getScopedNameEx(scopeSymbol, useContraintInName));

                    if (getTypeParamMarkerInfo) {
                        builder.add(new MemberName());
                    }
                }

                builder.add(MemberName.create(">"));
            }

            return builder;
        }

        static getIsExternallyVisible(symbol: PullSymbol, fromIsExternallyVisibleSymbol: PullSymbol, inIsExternallyVisibleSymbols: PullSymbol[]) {
            if (inIsExternallyVisibleSymbols) {
                for (var i = 0; i < inIsExternallyVisibleSymbols.length; i++) {
                    if (inIsExternallyVisibleSymbols[i] === symbol) {
                        return true;
                    }
                }
            } else {
                inIsExternallyVisibleSymbols = [];
            }

            if (fromIsExternallyVisibleSymbol === symbol) {
                return true;
            }
            inIsExternallyVisibleSymbols = inIsExternallyVisibleSymbols.concat(<any>fromIsExternallyVisibleSymbol);

            return symbol.isExternallyVisible(inIsExternallyVisibleSymbols);
        }

        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean {
            // Primitive
            var kind = this.getKind();
            if (kind === PullElementKind.Primitive) {
                return true;
            }

            // Type - use container to determine privacy info
            if (this.isType()) {
                var associatedContainerSymbol = (<PullTypeSymbol>this).getAssociatedContainerType();
                if (associatedContainerSymbol) {
                    return PullSymbol.getIsExternallyVisible(associatedContainerSymbol, this, inIsExternallyVisibleSymbols);
                }
            }

            // Private member
            if (this.hasFlag(PullElementFlags.Private)) {
                return false;
            }

            // If the container for this symbol is null, then this symbol is visible
            var container = this.getContainer();
            if (container === null) {
                return true;
            }

            // If export assignment check if this is the symbol that is exported
            if (container.getKind() == PullElementKind.DynamicModule ||
                (container.getAssociatedContainerType() && container.getAssociatedContainerType().getKind() == PullElementKind.DynamicModule)) {
                var containerTypeSymbol = container.getKind() == PullElementKind.DynamicModule
                    ? <PullContainerTypeSymbol>container
                    : <PullContainerTypeSymbol>container.getAssociatedContainerType();
                if (PullContainerTypeSymbol.usedAsSymbol(containerTypeSymbol, this)) {
                    return true;
                }
            }

            // If non exported member and is not class properties and method, it is not visible
            if (!this.hasFlag(PullElementFlags.Exported) && kind != PullElementKind.Property && kind != PullElementKind.Method) {
                return false;
            }

            // Visible if parent is visible
            return PullSymbol.getIsExternallyVisible(container, this, inIsExternallyVisibleSymbols);
        }
    }

    export class PullSignatureSymbol extends PullSymbol {

        private _parameters: PullSymbol[] = null;
        private _typeParameters: PullTypeParameterSymbol[] = null;
        private _returnType: PullTypeSymbol = null;
        private _functionType: PullTypeSymbol = null;

        private hasOptionalParam = false;
        private nonOptionalParamCount = 0;

        private hasVarArgs = false;

        private specializationCache: any = {};

        private memberTypeParameterNameCache: any = null;

        private hasAGenericParameter = false;
        private stringConstantOverload: boolean = undefined;

        constructor(kind: PullElementKind) {
            super("", kind);
        }

        public setFunctionType(type: PullTypeSymbol) {
            this._functionType = type;
        }

        public getFunctionType() {
            return this._functionType;
        }

        public isDefinition() { return false; }

        public hasVariableParamList() { return this.hasVarArgs; }
        public setHasVariableParamList() { this.hasVarArgs = true; }

        public setHasGenericParameter() { this.hasAGenericParameter = true; }
        public hasGenericParameter() { return this.hasAGenericParameter; }

        public isGeneric() { return this.hasAGenericParameter || (this._typeParameters && this._typeParameters.length != 0); }

        public addParameter(parameter: PullSymbol, isOptional = false) {
            if (!this._parameters) {
                this._parameters = [];
            }

            this._parameters[this._parameters.length] = parameter;
            this.hasOptionalParam = isOptional;

            if (!parameter.getEnclosingSignature()) {
                parameter.setEnclosingSignature(this); 
            }

            if (!isOptional) {
                this.nonOptionalParamCount++;
            }
        }

        public addSpecialization(signature: PullSignatureSymbol, typeArguments: PullTypeSymbol[]) {
            if (typeArguments && typeArguments.length) {
                this.specializationCache[getIDForTypeSubstitutions(typeArguments)] = signature;
            }
        }

        public getSpecialization(typeArguments): PullSignatureSymbol {

            if (typeArguments) {
                var sig = <PullSignatureSymbol>this.specializationCache[getIDForTypeSubstitutions(typeArguments)];

                if (sig) {
                    return sig;
                }
            }

            return null;
        }

        public addTypeParameter(typeParameter: PullTypeParameterSymbol) {
            if (!this._typeParameters) {
                this._typeParameters = [];
            }

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();
            }

            this._typeParameters[this._typeParameters.length] = typeParameter;

            this.memberTypeParameterNameCache[typeParameter.getName()] = typeParameter;
        }

        public getNonOptionalParameterCount() { return this.nonOptionalParamCount; }

        public setReturnType(returnType: PullTypeSymbol) {

            this._returnType = returnType;
        }

        // TODO: Why copy?
        public getParameters() {
            var params: PullSymbol[] = [];

            if (this._parameters) {
                for (var i = 0; i < this._parameters.length; i++) {
                    params[params.length] = this._parameters[i];
                }
            }

            return params;
        }

        // TODO: Why copy?
        public getTypeParameters(): PullTypeParameterSymbol[] {
            var params: PullTypeParameterSymbol[] = [];

            if (this._typeParameters) {
                for (var i = 0; i < this._typeParameters.length; i++) {
                    params[params.length] = <PullTypeParameterSymbol>this._typeParameters[i];
                }
            }

            return params;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            var memberSymbol: PullTypeParameterSymbol;

            if (!this.memberTypeParameterNameCache) {
                this.memberTypeParameterNameCache = new BlockIntrinsics();

                if (this._typeParameters) {
                    for (var i = 0; i < this._typeParameters.length; i++) {
                        this.memberTypeParameterNameCache[this._typeParameters[i].getName()] = this._typeParameters[i];
                    }
                }
            }

            memberSymbol = this.memberTypeParameterNameCache[name];

            return memberSymbol;
        }

        public mimicSignature(signature: PullSignatureSymbol, resolver: PullTypeResolver) {
            // mimic type parameters
            var typeParameters = signature.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;

            if (typeParameters) {
                for (var i = 0; i < typeParameters.length; i++) {
                    //typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());
                    //typeParameter.addDeclaration(typeParameters[i].getDeclarations()[0]);
                    this.addTypeParameter(typeParameters[i]);
                }
            }

            // mimic paremeteres (optionality, varargs)
            var parameters = signature.getParameters();
            var parameter: PullSymbol;

            if (parameters) {
                for (var j = 0; j < parameters.length; j++) {
                    parameter = new PullSymbol(parameters[j].getName(), PullElementKind.Parameter);
                    parameter.setRootSymbol(parameters[j]);
                    //parameter.addDeclaration(parameters[j].getDeclarations()[0]);
                    if (parameters[j].getIsOptional()) {
                        parameter.setIsOptional();
                    }
                    if (parameters[j].getIsVarArg()) {
                        parameter.setIsVarArg();
                        this.setHasVariableParamList();
                    }
                    this.addParameter(parameter);
                }
            }

            // Don't set the return type, since that will just lead to redundant
            // calls to setReturnType when we re-resolve the signature for
            // specialization

             var returnType = signature.getReturnType();

             if (!resolver.isTypeArgumentOrWrapper(returnType)) {
                 this.setReturnType(returnType);
             }
        }

        public getReturnType(): PullTypeSymbol {
            return this._returnType;
        }

        public isFixed(): boolean {

            if (!this.isGeneric()) {
                return true;
            }

            if (this._parameters) {
                var paramType: PullTypeSymbol;
                for (var i = 0; i < this._parameters.length; i++) {
                    paramType = this._parameters[i].getType();

                    if (paramType && !paramType.isFixed()) {
                        return false;
                    }
                }
            }

            if (this._returnType) {
                if (!this._returnType.isFixed()) {
                    return false;
                }
            }

            return true;
        }

        public invalidate() {

            this.nonOptionalParamCount = 0;
            this.hasOptionalParam = false;
            this.hasAGenericParameter = false;
            this.stringConstantOverload = undefined;

            super.invalidate();
        }

        public isStringConstantOverloadSignature() {
            if (this.stringConstantOverload === undefined) {
                var params = this.getParameters();
                this.stringConstantOverload = false;
                for (var i = 0; i < params.length; i++) {
                    var paramType = params[i].getType();
                    if (paramType && paramType.isPrimitive() && (<PullPrimitiveTypeSymbol>paramType).isStringConstant()) {
                        this.stringConstantOverload = true;
                    }
                }
            }

            return this.stringConstantOverload;
        }

        static getSignatureTypeMemberName(candidateSignature: PullSignatureSymbol, signatures: PullSignatureSymbol[], scopeSymbol: PullSymbol) {
            var allMemberNames = new MemberNameArray();
            var signatureMemberName = PullSignatureSymbol.getSignaturesTypeNameEx(signatures, "", false, false, scopeSymbol, true, candidateSignature);
            allMemberNames.addAll(signatureMemberName);
            return allMemberNames;
        }

        static getSignaturesTypeNameEx(signatures: PullSignatureSymbol[],
                                       prefix: string,
                                       shortform: boolean,
                                       brackets: boolean,
                                       scopeSymbol?: PullSymbol,
                                       getPrettyTypeName?: boolean,
                                       candidateSignature?: PullSignatureSymbol) {
            var result: MemberName[] = [];
            if (!signatures) {
                return result;
            }

            var len = signatures.length;
            if (!getPrettyTypeName && len > 1) {
                shortform = false;
            }

            var foundDefinition = false;
            if (candidateSignature && candidateSignature.isDefinition() && len > 1) {
                // Overloaded signature with candidateSignature = definition - cannot be used.
                candidateSignature = null;
            }

            for (var i = 0; i < len; i++) {
                // the definition signature shouldn't be printed if there are overloads
                if (len > 1 && signatures[i].isDefinition()) {
                    foundDefinition = true;
                    continue;
                }

                var signature = signatures[i];
                if (getPrettyTypeName && candidateSignature) {
                    signature = candidateSignature;
                }

                result.push(signature.getSignatureTypeNameEx(prefix, shortform, brackets, scopeSymbol));
                if (getPrettyTypeName) {
                    break;
                }
            }

            if (getPrettyTypeName && result.length && len > 1) {
                var lastMemberName = <MemberNameArray>result[result.length - 1];
                for (var i = i + 1; i < len; i++) {
                    if (signatures[i].isDefinition()) {
                        foundDefinition = true;
                        break;
                    }
                }
                var overloadString = " (+ " + (foundDefinition ? len - 2 : len - 1) + " overload(s))";
                lastMemberName.add(MemberName.create(overloadString));
            }

            return result;
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var s = this.getSignatureTypeNameEx(this.getScopedNameEx().toString(), false, false, scopeSymbol, undefined, useConstraintInName).toString();
            return s;
        }

        public getSignatureTypeNameEx(prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getParamMarkerInfo?: boolean, getTypeParamMarkerInfo?: boolean) {
            var typeParamterBuilder = new MemberNameArray();

            typeParamterBuilder.add(PullSymbol.getTypeParameterStringEx(
                this.getTypeParameters(), scopeSymbol, getTypeParamMarkerInfo, /*useConstraintInName*/true));

            if (brackets) {
                typeParamterBuilder.add(MemberName.create("["));
            }
            else {
                typeParamterBuilder.add(MemberName.create("("));
            }

            var builder = new MemberNameArray();
            builder.prefix = prefix;

            if (getTypeParamMarkerInfo) {
                builder.prefix = prefix;
                builder.addAll(typeParamterBuilder.entries);
            }
            else {
                builder.prefix = prefix + typeParamterBuilder.toString();
            }

            var params = this.getParameters();
            var paramLen = params.length;
            for (var i = 0; i < paramLen; i++) {
                var paramType = params[i].getType();
                var typeString = paramType ? ": " : "";
                var paramIsVarArg = params[i].getIsVarArg();
                var varArgPrefix = paramIsVarArg ? "..." : "";
                var optionalString = (!paramIsVarArg && params[i].getIsOptional()) ? "?" : "";
                if (getParamMarkerInfo) {
                    builder.add(new MemberName());
                }
                builder.add(MemberName.create(varArgPrefix + params[i].getScopedNameEx(scopeSymbol).toString() + optionalString + typeString));
                if (paramType) {
                    builder.add(paramType.getScopedNameEx(scopeSymbol));
                }
                if (getParamMarkerInfo) {
                    builder.add(new MemberName());
                }
                if (i < paramLen - 1) {
                    builder.add(MemberName.create(", "));
                }
            }

            if (shortform) {
                if (brackets) {
                    builder.add(MemberName.create("] => "));
                }
                else {
                    builder.add(MemberName.create(") => "));
                }
            }
            else {
                if (brackets) {
                    builder.add(MemberName.create("]: "));
                }
                else {
                    builder.add(MemberName.create("): "));
                }
            }

            var returnType = this.getReturnType();

            if (returnType) {
                builder.add(returnType.getScopedNameEx(scopeSymbol));
            }
            else {
                builder.add(MemberName.create("any"));
            }

            return builder;
        }
    }

    export class PullTypeSymbol extends PullSymbol {

        private _members: PullSymbol[] = null;
        private _enclosedMemberTypes: PullTypeSymbol[] = null;
        private _typeParameters: PullTypeParameterSymbol[] = null;
        private _typeArguments: PullTypeSymbol[] = null;
        private _containedNonMembers: PullSymbol[] = null;
        private _containedNonMemberTypes: PullTypeSymbol[] = null;

        private _specializedVersionsOfThisType: PullTypeSymbol[] = null;
        private _arrayVersionOfThisType: PullTypeSymbol = null;

        private _implementedTypes: PullTypeSymbol[] = null;
        private _extendedTypes: PullTypeSymbol[] = null;

        private _typesThatExplicitlyImplementThisType: PullTypeSymbol[] = null;
        private _typesThatExtendThisType: PullTypeSymbol[] = null;

        private _callSignatures: PullSignatureSymbol[] = null;
        private _constructSignatures: PullSignatureSymbol[] = null;
        private _indexSignatures: PullSignatureSymbol[] = null;

        private _elementType: PullTypeSymbol = null;

        private _memberNameCache: any = null;
        private _enclosedTypeNameCache: any = null;
        private _typeParameterNameCache: any = null;
        private _containedNonMemberNameCache: any = null;
        private _containedNonMemberTypeNameCache: any = null;
        private _specializedTypeIDCache: any = null;

        private _hasGenericSignature = false;
        private _hasGenericMember = false;
        private _hasBaseTypeConflict = false;

        private _knownBaseTypeCount = 0;

        private _invalidatedSpecializations = false;

        private _associatedContainerTypeSymbol: PullTypeSymbol = null;

        private _constructorMethod: PullSymbol = null;
        private _hasDefaultConstructor = false;
        
        // TODO: Really only used to track doc comments...
        private _functionSymbol: PullSymbol = null;

        public isType() { return true; }
        public isClass() {
            return this.getKind() == PullElementKind.Class || (this._constructorMethod != null);
        }
        public isFunction() { return (this.getKind() & (PullElementKind.ConstructorType | PullElementKind.FunctionType)) != 0; }
        public isConstructor() { return this.getKind() == PullElementKind.ConstructorType; }
        public isTypeParameter() { return false; }
        public isTypeVariable() { return false; }
        public isError() { return false; }

        public getKnownBaseTypeCount() { return this._knownBaseTypeCount; }
        public resetKnownBaseTypeCount() { this._knownBaseTypeCount = 0; }
        public incrementKnownBaseCount() { this._knownBaseTypeCount++; }

        public setHasBaseTypeConflict() {
            this._hasBaseTypeConflict = true;
        }
        public hasBaseTypeConflict() {
            return this._hasBaseTypeConflict;
        }

        public setUnresolved() {
            super.setUnresolved();

            this._invalidatedSpecializations = false;

            var specializations = this.getKnownSpecializations();

            for (var i = 0; i < specializations.length; i++) {
                specializations[i].setUnresolved();
            }
        }

        public hasMembers() {

            if (this._members != null) {
                return true;
            }

            var parents = this.getExtendedTypes();

            for (var i = 0; i < parents.length; i++) {
                if (parents[i].hasMembers()) {
                    return true;
                }
            }

            return false;
        }

        public setHasGenericSignature() { this._hasGenericSignature = true; }
        public getHasGenericSignature() { return this._hasGenericSignature; }

        public setHasGenericMember() { this._hasGenericMember = true; }
        public getHasGenericMember() { return this._hasGenericMember; }

        public setAssociatedContainerType(type: PullTypeSymbol) {
            this._associatedContainerTypeSymbol = type;
        }

        public getAssociatedContainerType() {
            return this._associatedContainerTypeSymbol;
        }

        public getType() { return this; }

        public getArrayType() { return this._arrayVersionOfThisType; }

        public getElementType(): PullTypeSymbol {            
            return this._elementType;
        }

        public setElementType(type: PullTypeSymbol) {
            this._elementType = type;
        }

        public setArrayType(arrayType: PullTypeSymbol) {
            this._arrayVersionOfThisType = arrayType;
        }

        public getFunctionSymbol() {
            return this._functionSymbol;
        }

        public setFunctionSymbol(symbol: PullSymbol) {
            if (symbol) {
                this._functionSymbol = symbol;
            }
        }

        public addContainedNonMember(nonMember: PullSymbol) {

            if (!nonMember) {
                return;
            }

            if (!this._containedNonMembers) {
                this._containedNonMembers = [];
            }

            this._containedNonMembers[this._containedNonMembers.length] = nonMember;

            if (!this._containedNonMemberNameCache) {
                this._containedNonMemberNameCache = new BlockIntrinsics();
            }

            this._containedNonMemberNameCache[nonMember.getName()] = nonMember;
        }

        // TODO: This seems to conflate exposed members with private non-Members
        public findContainedNonMember(name: string): PullSymbol {
            if (!this._containedNonMemberNameCache) {
                return null;
            }

            return this._containedNonMemberNameCache[name];
        }

        public findContainedNonMemberType(typeName: string): PullTypeSymbol {
            if (!this._containedNonMemberTypeNameCache) {
                return null;
            }

            return this._containedNonMemberTypeNameCache[typeName];
        }

        public addMember(memberSymbol: PullSymbol): void {
            if (!memberSymbol) {
                return;
            }

            memberSymbol.setContainer(this);

            if (!this._memberNameCache) {
                this._memberNameCache = new BlockIntrinsics();
            }

            if (!this._members) {
                this._members = [];
            }

            this._members[this._members.length] = memberSymbol;
            this._memberNameCache[memberSymbol.getName()] = memberSymbol;
        }

        public addEnclosedMemberType(enclosedType: PullTypeSymbol): void {

            if (!enclosedType) {
                return;
            }

            enclosedType.setContainer(this);

            if (!this._enclosedTypeNameCache) {
                this._enclosedTypeNameCache = new BlockIntrinsics();
            }

            if (!this._enclosedMemberTypes) {
                this._enclosedMemberTypes = [];
            }

            this._enclosedMemberTypes[this._enclosedMemberTypes.length] = enclosedType;
            this._enclosedTypeNameCache[enclosedType.getName()] = enclosedType;
        }

        public addEnclosedNonMember(enclosedNonMember: PullSymbol): void {

            if (!enclosedNonMember) {
                return;
            }

            enclosedNonMember.setContainer(this);

            if (!this._containedNonMemberNameCache) {
                this._containedNonMemberNameCache = new BlockIntrinsics();
            }

            if (!this._containedNonMembers) {
                this._containedNonMembers = [];
            }

            this._containedNonMembers[this._containedNonMembers.length] = enclosedNonMember;
            this._containedNonMemberNameCache[enclosedNonMember.getName()] = enclosedNonMember;
        }

        public addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void {

            if (!enclosedNonMemberType) {
                return;
            }

            enclosedNonMemberType.setContainer(this);

            if (!this._containedNonMemberTypeNameCache) {
                this._containedNonMemberTypeNameCache = new BlockIntrinsics();
            }

            if (!this._containedNonMemberTypes) {
                this._containedNonMemberTypes = [];
            }

            this._containedNonMemberTypes[this._containedNonMemberTypes.length] = enclosedNonMemberType;
            this._containedNonMemberTypeNameCache[enclosedNonMemberType.getName()] = enclosedNonMemberType;
        }

        public addTypeParameter(typeParameter: PullTypeParameterSymbol): void {

            if (!typeParameter) {
                return;
            }

            if (!typeParameter.getContainer()) {
                typeParameter.setContainer(this);
            }

            if (!this._typeParameterNameCache) {
                this._typeParameterNameCache = new BlockIntrinsics();
            }

            if (!this._typeParameters) {
                this._typeParameters = [];
            }

            this._typeParameters[this._typeParameters.length] = typeParameter;
            this._typeParameterNameCache[typeParameter.getName()] = typeParameter;
        }

        public addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol) {

            this.addTypeParameter(typeParameter);

            var constructSignatures = this.getConstructSignatures();

            for (var i = 0; i < constructSignatures.length; i++) {
                constructSignatures[i].addTypeParameter(typeParameter);
            }
        }

        public getMembers(): PullSymbol[]{
            if (!this._members) {
                return [];
            }

            return this._members;
        }

        public setHasDefaultConstructor(hasOne= true) {
            this._hasDefaultConstructor = hasOne;
        }

        public getHasDefaultConstructor() {
            return this._hasDefaultConstructor;
        }

        public getConstructorMethod() {
            return this._constructorMethod;
        }

        public setConstructorMethod(constructorMethod: PullSymbol) {
            this._constructorMethod = constructorMethod;
        }

        public getTypeParameters(): PullTypeParameterSymbol[]{
            if (!this._typeParameters) {
                return [];
            }

            return this._typeParameters;
        }

        public isGeneric(): boolean {
            return (this._typeParameters && this._typeParameters.length != 0) ||
                this._hasGenericSignature ||
                this._hasGenericMember ||
                (this._typeArguments && this._typeArguments.length) ||
                this.isArray();
        }

        public isFixed() {

            if (!this.isGeneric()) {
                return true;
            }

            if (this._typeParameters && this._typeArguments) {
                if (!this._typeArguments.length || this._typeArguments.length < this._typeParameters.length) {
                    return false;
                }

                for (var i = 0; i < this._typeArguments.length; i++) {
                    if (!this._typeArguments[i].isFixed()) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void {

            if (!substitutingTypes || !substitutingTypes.length) {
                return;
            }

            if (!this._specializedTypeIDCache) {
                this._specializedTypeIDCache = new BlockIntrinsics();
            }

            if (!this._specializedVersionsOfThisType) {
                this._specializedVersionsOfThisType = [];
            }

            this._specializedVersionsOfThisType[this._specializedVersionsOfThisType.length] = specializedVersionOfThisType;

            this._specializedTypeIDCache[getIDForTypeSubstitutions(substitutingTypes)] = specializedVersionOfThisType;
        }

        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol {

            if (!substitutingTypes || !substitutingTypes.length) {
                return null;
            }

            if (!this._specializedTypeIDCache) {
                this._specializedTypeIDCache = new BlockIntrinsics();

                return null;
            }

            var specialization = <PullTypeSymbol>this._specializedTypeIDCache[getIDForTypeSubstitutions(substitutingTypes)];

            if (!specialization) {
                return null;
            }

            return specialization;
        }

        public getKnownSpecializations(): PullTypeSymbol[]{
            if (!this._specializedVersionsOfThisType) {
                return [];
            }

            return this._specializedVersionsOfThisType;
        }

        public getTypeArguments() {
            return this._typeArguments;
        }
        public setTypeArguments(typeArgs: PullTypeSymbol[]) { this._typeArguments = typeArgs; }

        public addCallSignature(callSignature: PullSignatureSymbol) {

            if (!this._callSignatures) {
                this._callSignatures = [];
            }

            this._callSignatures[this._callSignatures.length] = callSignature;

            if (callSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            callSignature.setFunctionType(this);
        }

        public addConstructSignature(constructSignature: PullSignatureSymbol) {

            if (!this._constructSignatures) {
                this._constructSignatures = [];
            }

            this._constructSignatures[this._constructSignatures.length] = constructSignature;

            if (constructSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            constructSignature.setFunctionType(this);
        }

        public addIndexSignature(indexSignature: PullSignatureSymbol) {
            if (!this._indexSignatures) {
                this._indexSignatures = [];
            }

            this._indexSignatures[this._indexSignatures.length] = indexSignature;

            if (indexSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            indexSignature.setFunctionType(this);
        }

        public hasOwnCallSignatures() { return !!this._callSignatures; }

        public getCallSignatures(collectBaseSignatures=true): PullSignatureSymbol[]{
            var signatures: PullSignatureSymbol[] = [];

            if (this._callSignatures) {
                signatures = signatures.concat(this._callSignatures);
            }

            if (collectBaseSignatures && this._extendedTypes) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getCallSignatures());
                }
            }

            return signatures;
        }

        public hasOwnConstructSignatures() { return !!this._constructSignatures; }

        public getConstructSignatures(collectBaseSignatures=true): PullSignatureSymbol[]{
            var signatures: PullSignatureSymbol[] = [];

            if (this._constructSignatures) {
                signatures = signatures.concat(this._constructSignatures);
            }

            // If it's a constructor type, we don't inherit construct signatures
            // (E.g., we'd be looking at the statics on a class, where we want
            // to inherit members, but not construct signatures
            if (collectBaseSignatures && this._extendedTypes && !(this.getKind() == PullElementKind.ConstructorType)) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getConstructSignatures());
                }
            }

            return signatures;
        }

        public hasOwnIndexSignatures() { return !!this._indexSignatures; }

        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[]{
            var signatures: PullSignatureSymbol[] = [];

            if (this._indexSignatures) {
                signatures = signatures.concat(this._indexSignatures);
            }

            if (collectBaseSignatures && this._extendedTypes) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getIndexSignatures());
                }
            }

            return signatures;
        }

        public addImplementedType(implementedType: PullTypeSymbol) {
            if (!implementedType) {
                return;
            }

            if (!this._implementedTypes) {
                this._implementedTypes = [];
            }

            this._implementedTypes[this._implementedTypes.length] = implementedType;

            implementedType.addTypeThatExplicitlyImplementsThisType(this);
        }

        public getImplementedTypes(): PullTypeSymbol[]{
            if (!this._implementedTypes) {
                return [];
            }

            return this._implementedTypes;
        }

        public addExtendedType(extendedType: PullTypeSymbol) {
            if (!extendedType) {
                return;
            }

            if (!this._extendedTypes) {
                this._extendedTypes = [];
            }

            this._extendedTypes[this._extendedTypes.length] = extendedType;

            extendedType.addTypeThatExtendsThisType(this);
        }

        public getExtendedTypes(): PullTypeSymbol[]{
            if (!this._extendedTypes) {
                return [];
            }

            return this._extendedTypes;
        }

        public addTypeThatExtendsThisType(type: PullTypeSymbol) {
            if (!type) {
                return;
            }

            if (!this._typesThatExtendThisType) {
                this._typesThatExtendThisType = [];
            }

            this._typesThatExtendThisType[this._typesThatExtendThisType.length] = type;
        }

        public getTypesThatExtendThisType(): PullTypeSymbol[]{
            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            return this._typesThatExtendThisType;
        }

        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol) {
            if (!type) {
                return;
            }

            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            this._typesThatExplicitlyImplementThisType[this._typesThatExplicitlyImplementThisType.length] = type;
        }

        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[]{
            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            return this._typesThatExplicitlyImplementThisType;
        }

        public hasBase(potentialBase: PullTypeSymbol, origin=null) {
            if (this === potentialBase) {
                return true;
            }

            if (origin && (this === origin || this.getRootSymbol() === origin)) {
                return true;
            }

            if (!origin) {
                origin = this;
            }

            var extendedTypes = this.getExtendedTypes();

            for (var i = 0; i < extendedTypes.length; i++) {
                if (extendedTypes[i].hasBase(potentialBase, origin)) {
                    return true;
                }
            }

            var implementedTypes = this.getImplementedTypes();

            for (var i = 0; i < implementedTypes.length; i++) {
                if (implementedTypes[i].hasBase(potentialBase, origin)) {
                    return true;
                }
            }

            return false;
        }

        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean) {
            // Error type symbol is invalid base kind
            if (baseType.isError()) {
                return false;
            }

            var thisIsClass = this.isClass();
            if (isExtendedType) {
                if (thisIsClass) {
                    // Class extending non class Type is invalid
                    return baseType.getKind() === PullElementKind.Class;
                }
            } else {
                if (!thisIsClass) {
                    // Interface implementing baseType is invalid
                    return false;
                }
            }

            // Interface extending non interface or class 
            // or class implementing non interface or class - are invalid
            return !!(baseType.getKind() & (PullElementKind.Interface | PullElementKind.Class | PullElementKind.Array));
        }

        public findMember(name: string, lookInParent = true): PullSymbol {
            var memberSymbol: PullSymbol = null;

            if (this._memberNameCache) {
                memberSymbol = this._memberNameCache[name];
            }            

            if (!lookInParent) {
                return memberSymbol;
            }
            else if (memberSymbol) {
                return memberSymbol;
            }

            // check parents
            if (!memberSymbol && this._extendedTypes) {

                for (var i = 0; i < this._extendedTypes.length; i++) {
                    memberSymbol = this._extendedTypes[i].findMember(name);

                    if (memberSymbol) {
                        return memberSymbol;
                    }
                }
            }

            // when all else fails, look for a nested type name
            return this.findNestedType(name);
        }

        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            var memberSymbol: PullTypeSymbol;

            if (!this._enclosedTypeNameCache) {
                return null;
            }

            memberSymbol = this._enclosedTypeNameCache[name];

            if (memberSymbol && kind != PullElementKind.None) {
                memberSymbol = ((memberSymbol.getKind() & kind) != 0) ? memberSymbol : null;
            }

            return memberSymbol;
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {

            var allMembers: PullSymbol[] = [];

            var i = 0;
            var j = 0;
            var m = 0;
            var n = 0;

            // Add members
            if (this._members) {

                for (var i = 0, n = this._members.length; i < n; i++) {
                    var member = this._members[i];
                    if ((member.getKind() & searchDeclKind) && (includePrivate || !member.hasFlag(PullElementFlags.Private))) {
                        allMembers[allMembers.length] = member;
                    }
                }
            }

            // Add parent members
            if (this._extendedTypes) {

                for (var i = 0 , n = this._extendedTypes.length; i < n; i++) {
                    var extendedMembers = this._extendedTypes[i].getAllMembers(searchDeclKind, includePrivate);

                    for (var j = 0 , m = extendedMembers.length; j < m; j++) {
                        var extendedMember = extendedMembers[j];
                        if (!(this._memberNameCache && this._memberNameCache[extendedMember.getName()])) {
                            allMembers[allMembers.length] = extendedMember;
                        }
                    }
                }
            }

            if (this.isContainer() && this._enclosedMemberTypes) {
                for (var i = 0; i < this._enclosedMemberTypes.length; i++) {
                    allMembers[allMembers.length] = this._enclosedMemberTypes[i];
                }
            }

            return allMembers;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            if (!this._typeParameterNameCache) {
                return null;
            }

            return this._typeParameterNameCache[name];
        }

        public setResolved() {
            super.setResolved();
        }

        public invalidate() {

            if (this._constructorMethod) {
                this._constructorMethod.invalidate();
            }
            
            this._knownBaseTypeCount = 0;

            super.invalidate();
        }

        public getNamePartForFullName() {
            var name = super.getNamePartForFullName();

            var typars = this.getTypeArguments();
            if (!typars || !typars.length) {
                typars = this.getTypeParameters();
            }

            var typarString = PullSymbol.getTypeParameterString(typars, this, /*useConstraintInName:*/ true);
            return name + typarString;
        }

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.getScopedNameEx(scopeSymbol, useConstraintInName).toString();
        }

        public isNamedTypeSymbol() {
            var kind = this.getKind();
            if (kind === PullElementKind.Primitive || // primitives
            kind === PullElementKind.Class || // class
            kind === PullElementKind.Container || // module
            kind === PullElementKind.DynamicModule || // dynamic module
            kind === PullElementKind.TypeAlias || // dynamic module
            kind === PullElementKind.Enum || // enum
            kind === PullElementKind.TypeParameter || //TypeParameter
            ((kind === PullElementKind.Interface || kind === PullElementKind.ObjectType) && this.getName() != "")) {
                return true;
            }

            return false;
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            var s = this.getScopedNameEx(scopeSymbol, useConstraintInName).toString();
            return s;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean) {

            if (this.isArray()) {
                var elementMemberName = this._elementType ?
                    (this._elementType.isArray() || this._elementType.isNamedTypeSymbol() ?
                    this._elementType.getScopedNameEx(scopeSymbol, false, getPrettyTypeName, getTypeParamMarkerInfo) :
                    this._elementType.getMemberTypeNameEx(false, scopeSymbol, getPrettyTypeName)) :
                    MemberName.create("any");
                return MemberName.create(elementMemberName, "", "[]");
            }

            if (!this.isNamedTypeSymbol()) {
                return this.getMemberTypeNameEx(true, scopeSymbol, getPrettyTypeName);
            }

            var builder = new MemberNameArray();
            builder.prefix = super.getScopedName(scopeSymbol, useConstraintInName);

            var typars = this.getTypeArguments();
            if (!typars || !typars.length) {
                typars = this.getTypeParameters();
            }

            builder.add(PullSymbol.getTypeParameterStringEx(typars, this, getTypeParamMarkerInfo, useConstraintInName));

            return builder;
        }

        public hasOnlyOverloadCallSignatures() {
            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            return members.length === 0 && constructSignatures.length === 0 && callSignatures.length > 1;
        }

        public getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): MemberName {

            if (this.isArray()) {
                var elementMemberName = this._elementType ? this._elementType.getMemberTypeNameEx(false, scopeSymbol, getPrettyTypeName) : MemberName.create("any");
                return MemberName.create(elementMemberName, "", "[]");
            }

            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            var indexSignatures = this.getIndexSignatures();

            if (members.length > 0 || callSignatures.length > 0 || constructSignatures.length > 0 || indexSignatures.length > 0) {
                var allMemberNames = new MemberNameArray();
                var curlies = !topLevel || indexSignatures.length != 0;
                var delim = "; ";
                for (var i = 0; i < members.length; i++) {
                    if (members[i].getKind() == PullElementKind.Method && members[i].getType().hasOnlyOverloadCallSignatures()) {
                        // Add all Call signatures of the method
                        var methodCallSignatures = members[i].getType().getCallSignatures();
                        var nameStr = members[i].getDisplayName(scopeSymbol) + (members[i].getIsOptional() ? "?" : "");;
                        var methodMemberNames = PullSignatureSymbol.getSignaturesTypeNameEx(methodCallSignatures, nameStr, false, false, scopeSymbol);
                        allMemberNames.addAll(methodMemberNames);
                    } else {
                        var memberTypeName = members[i].getNameAndTypeNameEx(scopeSymbol);
                        if (memberTypeName.isArray() && (<MemberNameArray>memberTypeName).delim === delim) {
                            allMemberNames.addAll((<MemberNameArray>memberTypeName).entries);
                        } else {
                            allMemberNames.add(memberTypeName);
                        }
                    }
                    curlies = true;
                }

                // Use pretty Function overload signature if this is just a call overload
                var getPrettyFunctionOverload = getPrettyTypeName && !curlies && this.hasOnlyOverloadCallSignatures();

                var signatureCount = callSignatures.length + constructSignatures.length + indexSignatures.length;
                if (signatureCount != 0 || members.length != 0) {
                    var useShortFormSignature = !curlies && (signatureCount === 1);
                    var signatureMemberName: MemberName[];

                    if (callSignatures.length > 0) {
                        signatureMemberName =
                        PullSignatureSymbol.getSignaturesTypeNameEx(callSignatures, "", useShortFormSignature, false, scopeSymbol, getPrettyFunctionOverload);
                        allMemberNames.addAll(signatureMemberName);
                    }

                    if (constructSignatures.length > 0) {
                        signatureMemberName =
                        PullSignatureSymbol.getSignaturesTypeNameEx(constructSignatures, "new", useShortFormSignature, false, scopeSymbol);
                        allMemberNames.addAll(signatureMemberName);
                    }

                    if (indexSignatures.length > 0) {
                        signatureMemberName =
                        PullSignatureSymbol.getSignaturesTypeNameEx(indexSignatures, "", useShortFormSignature, true, scopeSymbol);
                        allMemberNames.addAll(signatureMemberName);
                    }

                    if ((curlies) || (!getPrettyFunctionOverload && (signatureCount > 1) && topLevel)) {
                        allMemberNames.prefix = "{ ";
                        allMemberNames.suffix = "}";
                        allMemberNames.delim = delim;
                    } else if (allMemberNames.entries.length > 1) {
                        allMemberNames.delim = delim;
                    }

                    return allMemberNames;
                }
            }

            return MemberName.create("{}");
        }

        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean {
            var isVisible = super.isExternallyVisible(inIsExternallyVisibleSymbols);
            if (isVisible) {
                // Get type parameters
                var typars = this.getTypeArguments();
                if (!typars || !typars.length) {
                    typars = this.getTypeParameters();
                }

                if (typars) {
                    // If any of the type parameter is not visible the type is invisible
                    for (var i = 0; i < typars.length; i++) {
                        isVisible = PullSymbol.getIsExternallyVisible(typars[i], this, inIsExternallyVisibleSymbols);
                        if (!isVisible) {
                            break;
                        }
                    }
                }
            }

            return isVisible;
        }

        public setType(type: PullTypeSymbol) {
            Debug.assert(false, "tried to set type of type");
        }
    }

    export class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string) {
            super(name, PullElementKind.Primitive);
        }

        public isResolved() { return true; }

        public isStringConstant() { return false; }

        public isFixed() {
            return true;
        }

        public invalidate() {
            // do nothing...
        }
    }

    export class PullStringConstantTypeSymbol extends PullPrimitiveTypeSymbol {
        constructor(name: string) {
            super(name);
        }

        public isStringConstant() {
            return true;
        }
    }

    export class PullErrorTypeSymbol extends PullPrimitiveTypeSymbol {

        constructor(private diagnostic: Diagnostic, public delegateType: PullTypeSymbol, private _data = null) {
            super("error");
        }

        public isError() {
            return true;
        }

        public getDiagnostic() {
            return this.diagnostic;
        }

        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.delegateType.getName(scopeSymbol, useConstraintInName);
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.delegateType.getDisplayName(scopeSymbol, useConstraintInName);
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            return this.delegateType.toString(scopeSymbol, useConstraintInName);
        }

        public isResolved() {
            return false;
        }

        public setData(data: any) {
            this._data = data;
        }

        public getData() {
            return this._data;
        }
    }

    // represents the module "namespace" type
    export class PullContainerTypeSymbol extends PullTypeSymbol {
        public instanceSymbol: PullSymbol = null;

        private _exportAssignedValueSymbol: PullSymbol = null;
        private _exportAssignedTypeSymbol: PullTypeSymbol = null;
        private _exportAssignedContainerSymbol: PullContainerTypeSymbol = null;

        constructor(name: string, kind = PullElementKind.Container) {
            super(name, kind);
        }

        public isContainer() { return true; }

        public setInstanceSymbol(symbol: PullSymbol) {
            this.instanceSymbol = symbol;
        }

        public getInstanceSymbol(): PullSymbol {
            return this.instanceSymbol;
        }

        public invalidate() {

            if (this.instanceSymbol) {
                this.instanceSymbol.invalidate();
            }

            super.invalidate();
        }

        public setExportAssignedValueSymbol(symbol: PullSymbol): void {

            this._exportAssignedValueSymbol = symbol;
        }
        public getExportAssignedValueSymbol(): PullSymbol {
            return this._exportAssignedValueSymbol;
        }

        public setExportAssignedTypeSymbol(type: PullTypeSymbol): void {
            this._exportAssignedTypeSymbol = type;
        }
        public getExportAssignedTypeSymbol(): PullTypeSymbol {
            return this._exportAssignedTypeSymbol;
        }

        public setExportAssignedContainerSymbol(container: PullContainerTypeSymbol): void {
            this._exportAssignedContainerSymbol = container;
        }
        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol {
            return this._exportAssignedContainerSymbol;
        }

        public resetExportAssignedSymbols() {
            this._exportAssignedContainerSymbol = null;
            this._exportAssignedTypeSymbol = null;
            this._exportAssignedValueSymbol = null;
        }

        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol) {
            if (!containerSymbol || !containerSymbol.isContainer()) {
                return false;
            }

            if (containerSymbol.getType() == symbol) {
                return true;
            }

            var containerTypeSymbol = <PullContainerTypeSymbol>containerSymbol;
            var valueExportSymbol = containerTypeSymbol.getExportAssignedValueSymbol();
            var typeExportSymbol = containerTypeSymbol.getExportAssignedTypeSymbol();
            var containerExportSymbol = containerTypeSymbol.getExportAssignedContainerSymbol();
            if (valueExportSymbol || typeExportSymbol || containerExportSymbol) {
                return valueExportSymbol == symbol || typeExportSymbol == symbol || containerExportSymbol == symbol || PullContainerTypeSymbol.usedAsSymbol(containerExportSymbol, symbol);
            }

            return false;
        }
    }

    export class PullTypeAliasSymbol extends PullTypeSymbol {

        private _aliasedType: PullTypeSymbol = null;
        private isUsedAsValue = false;
        private typeUsedExternally = false;
        private retrievingExportAssignment = false;

        constructor(name: string) {
            super(name, PullElementKind.TypeAlias);
        }

        public isAlias() { return true; }
        public isContainer() { return true; }

        public setAliasedType(type: PullTypeSymbol) {
            Debug.assert(!type.isError(), "Attempted to alias an error");

            this._aliasedType = type;
        }

        public getExportAssignedValueSymbol(): PullSymbol {
            if (!this._aliasedType) {
                return null;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this._aliasedType.isContainer()) {
                this.retrievingExportAssignment = true;
                var sym = (<PullContainerTypeSymbol>this._aliasedType).getExportAssignedValueSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public getExportAssignedTypeSymbol(): PullTypeSymbol {
            if (!this._aliasedType) {
                return null;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this._aliasedType.isContainer()) {
                this.retrievingExportAssignment = true;
                var sym = (<PullContainerTypeSymbol>this._aliasedType).getExportAssignedTypeSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol {
            if (!this._aliasedType) {
                return null;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this._aliasedType.isContainer()) {
                this.retrievingExportAssignment = true;
                var sym = (<PullContainerTypeSymbol>this._aliasedType).getExportAssignedContainerSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public getType(): PullTypeSymbol {

            return this._aliasedType;
        }

        public setType(type: PullTypeSymbol) {
            this.setAliasedType(type);
        }

        public setIsUsedAsValue() {
            this.isUsedAsValue = true;
        }

        public getIsUsedAsValue() {
            return this.isUsedAsValue;
        }

        public setIsTypeUsedExternally() {
            this.typeUsedExternally = true;
        }

        public getTypeUsedExternally() {
            return this.typeUsedExternally;
        }

        public getMembers(): PullSymbol[] {
            if (this._aliasedType) {
                return this._aliasedType.getMembers();
            }

            return [];
        }

        public getCallSignatures(): PullSignatureSymbol[] {
            if (this._aliasedType) {
                return this._aliasedType.getCallSignatures();
            }

            return [];
        }

        public getConstructSignatures(): PullSignatureSymbol[] {
            if (this._aliasedType) {
                return this._aliasedType.getConstructSignatures();
            }

            return [];
        }

        public getIndexSignatures(): PullSignatureSymbol[] {
            if (this._aliasedType) {
                return this._aliasedType.getIndexSignatures();
            }

            return [];
        }

        public findMember(name: string): PullSymbol {
            if (this._aliasedType) {
                return this._aliasedType.findMember(name);
            }

            return null;
        }

        public findNestedType(name: string): PullTypeSymbol {
            if (this._aliasedType) {
                return this._aliasedType.findNestedType(name);
            }

            return null;
        }

        public getAllMembers(searchDeclKind: PullElementKind, includePrivate: boolean): PullSymbol[] {
            if (this._aliasedType) {
                return this._aliasedType.getAllMembers(searchDeclKind, includePrivate);
            }

            return [];
        }

        public invalidate() {
            this.isUsedAsValue = false;

            super.invalidate();
        }
    }

    export class PullDefinitionSignatureSymbol extends PullSignatureSymbol {
        public isDefinition() { return true; }
    }

    export class PullTypeParameterSymbol extends PullTypeSymbol {
        private _constraint: PullTypeSymbol = null;

        constructor(name: string, private _isFunctionTypeParameter) {
            super(name, PullElementKind.TypeParameter);
        }

        public isTypeParameter() { return true; }
        public isFunctionTypeParameter() { return this._isFunctionTypeParameter; }

        public isFixed() { return false; }

        public setConstraint(constraintType: PullTypeSymbol) {
            this._constraint = constraintType;
        }

        public getConstraint(): PullTypeSymbol {
            return this._constraint;
        }

        public isGeneric() { return true; }

        public fullName(scopeSymbol?: PullSymbol) {
            var name = this.getDisplayName(scopeSymbol);
            var container = this.getContainer();
            if (container) {
                var containerName = container.fullName(scopeSymbol);
                name = name + " in " + containerName;
            }

            return name;
        }

        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {

            var name = super.getName(scopeSymbol);

            if (this.isPrinting) {
                return name;
            }

            this.isPrinting = true;         

            if (useConstraintInName && this._constraint) {
                name += " extends " + this._constraint.toString(scopeSymbol);
            }

            this.isPrinting = false;
        
            return name;
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {

            var name = super.getDisplayName(scopeSymbol, useConstraintInName);

            if (this.isPrinting) {
                return name;
            }

            this.isPrinting = true;

            if (useConstraintInName && this._constraint) {
                name += " extends " + this._constraint.toString(scopeSymbol);
            }

            this.isPrinting = false;
            
            return name;
        }

        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean {
            var constraint = this.getConstraint();
            if (constraint) {
                return PullSymbol.getIsExternallyVisible(constraint, this, inIsExternallyVisibleSymbols);
            }

            return true;          
        }
    }

    // transient type variables...
    export class PullTypeVariableSymbol extends PullTypeParameterSymbol {

        constructor(name: string, isFunctionTypeParameter: boolean) {
            super(name, isFunctionTypeParameter);
        }

        private tyvarID =  globalTyvarID++;

        public isTypeParameter() { return true; }
        public isTypeVariable() { return true; }
    }

    export class PullAccessorSymbol extends PullSymbol {

        private _getterSymbol: PullSymbol = null;
        private _setterSymbol: PullSymbol = null;

        constructor(name: string) {
            super(name, PullElementKind.Property);
        }

        public isAccessor() { return true; }

        public setSetter(setter: PullSymbol) {
            if (!setter) {
                return;
            }

            this._setterSymbol = setter;

            setter.setAccessorSymbol(this);
        }

        public getSetter(): PullSymbol {
            return this._setterSymbol;
        }

        public setGetter(getter: PullSymbol) {
            if (!getter) {
                return;
            }

            this._getterSymbol = getter;

            getter.setAccessorSymbol(this);
        }

        public getGetter(): PullSymbol {
            return this._getterSymbol;
        }

        public invalidate() {
            if (this._getterSymbol) {
                this._getterSymbol.invalidate();
            }

            if (this._setterSymbol) {
                this._setterSymbol.invalidate();
            }

            super.invalidate();
        }
    }

    export function typeWrapsTypeParameter(type: PullTypeSymbol, typeParameter: PullTypeParameterSymbol) {

        if (type.isTypeParameter()) {
            return type == typeParameter;
        }

        var typeArguments = type.getTypeArguments();

        if (typeArguments) {
            for (var i = 0; i < typeArguments.length; i++) {
                if (typeWrapsTypeParameter(typeArguments[i], typeParameter)) {
                    return true;
                }
            }
        }

        return false;
    }

    export function getRootType(typeToSpecialize: PullTypeSymbol) {
        var decl = typeToSpecialize.getDeclarations()[0];

        if (!typeToSpecialize.isGeneric()) {
            return typeToSpecialize;
        }

        return (typeToSpecialize.getKind() & (PullElementKind.Class | PullElementKind.Interface)) ? <PullTypeSymbol>decl.getSymbol().getType() : typeToSpecialize;
    }

    export var nSpecializationsCreated = 0;
    export var nSpecializedSignaturesCreated = 0;

    export function shouldSpecializeTypeParameterForTypeParameter(specialization: PullTypeParameterSymbol, typeToSpecialize: PullTypeParameterSymbol) {
        if (specialization == typeToSpecialize) {
            return false;
        }

        if (!(specialization.isTypeParameter() && typeToSpecialize.isTypeParameter())) {
            return true;
        }

        var parent = specialization.getDeclarations()[0].getParentDecl();
        var targetParent = typeToSpecialize.getDeclarations()[0].getParentDecl();

        // if they share a parent, it's fine to specialize
        if (parent == targetParent) {
            return true;
        }

        // if the target parent encloses the specialization type, we don't want to specialize
        while (parent) {
            if (parent.getFlags() & PullElementFlags.Static) {
                return true;
            }

            if (parent == targetParent) {
                return false;
            }

            parent = parent.getParentDecl();
        }

        return true;
    }

    export function specializeType(typeToSpecialize: PullTypeSymbol, typeArguments: PullTypeSymbol[], resolver: PullTypeResolver, enclosingDecl: PullDecl, context: PullTypeResolutionContext, ast?: AST): PullTypeSymbol {

        if (typeToSpecialize.isPrimitive() || !typeToSpecialize.isGeneric()) {
            return typeToSpecialize;
        }

        var searchForExistingSpecialization = typeArguments != null;

        if (typeArguments === null || (context.specializingToAny && typeArguments.length)) {
            typeArguments = [];
        }

        if (typeToSpecialize.isTypeParameter()) {

            if (context.specializingToAny) {
                return resolver.semanticInfoChain.anyTypeSymbol;
            }

            var substitution = context.findSpecializationForType(typeToSpecialize);

            if (substitution != typeToSpecialize) {

                if (shouldSpecializeTypeParameterForTypeParameter(<PullTypeParameterSymbol>substitution, <PullTypeParameterSymbol>typeToSpecialize)) {
                    return substitution;
                }
            }

            if (typeArguments && typeArguments.length) {
                if (shouldSpecializeTypeParameterForTypeParameter(<PullTypeParameterSymbol>typeArguments[0], <PullTypeParameterSymbol>typeToSpecialize)) {
                    return typeArguments[0];
                }
            }

            return typeToSpecialize;
        }

        // In this case, we have an array type that may have been specialized to a type variable
        if (typeToSpecialize.isArray()) {

            if (typeToSpecialize.currentlyBeingSpecialized()) {
                return typeToSpecialize;
            }

            var newElementType: PullTypeSymbol = null;

            if (!context.specializingToAny) {
                var elementType = typeToSpecialize.getElementType();

                newElementType = specializeType(elementType, typeArguments, resolver, enclosingDecl, context, ast);
            }
            else {
                newElementType = resolver.semanticInfoChain.anyTypeSymbol;
            }

            // we re-specialize so that we can re-use any cached array type symbols
            var newArrayType = specializeType(resolver.getCachedArrayType(), [newElementType], resolver, enclosingDecl, context);

            return newArrayType;
        }     

        var typeParameters = typeToSpecialize.getTypeParameters();

        // if we don't have the complete list of types to specialize to, we'll need to reconstruct the specialization signature
        if (!context.specializingToAny && searchForExistingSpecialization && (typeParameters.length > typeArguments.length)) {
            searchForExistingSpecialization = false;
        }

        var newType: PullTypeSymbol = null;

        var newTypeDecl = typeToSpecialize.getDeclarations()[0];

        var rootType: PullTypeSymbol = getRootType(typeToSpecialize);

        var isArray = typeToSpecialize === resolver.getCachedArrayType() || typeToSpecialize.isArray();

        if (searchForExistingSpecialization || context.specializingToAny) {
            if (!typeArguments.length || context.specializingToAny) {
                for (var i = 0; i < typeParameters.length; i++) {
                    typeArguments[typeArguments.length] = resolver.semanticInfoChain.anyTypeSymbol;
                }
            }

            if (isArray) {
                newType = typeArguments[0].getArrayType();
            }
            else if (typeArguments.length) {
                newType = rootType.getSpecialization(typeArguments);
            }
            
            if (!newType && !typeParameters.length && context.specializingToAny) {
                newType = rootType.getSpecialization([resolver.semanticInfoChain.anyTypeSymbol]);
            }
            
            for (var i = 0; i < typeArguments.length; i++) {
                if (!typeArguments[i].isTypeParameter() && (typeArguments[i] == rootType || typeWrapsTypeParameter(typeArguments[i], typeParameters[i]))) {
                    declAST = resolver.semanticInfoChain.getASTForDecl(newTypeDecl);
                    if (declAST && typeArguments[i] != resolver.getCachedArrayType()) {
                        diagnostic = context.postError(enclosingDecl.getScriptName(), declAST.minChar, declAST.getLength(), DiagnosticCode.A_generic_type_may_not_reference_itself_with_a_wrapped_form_of_its_own_type_parameters, null, enclosingDecl, true);
                        return resolver.getNewErrorTypeSymbol(diagnostic);
                    }
                    else {
                        return resolver.semanticInfoChain.anyTypeSymbol;
                    }
                }
            }
        }
        else {
            var knownTypeArguments = typeToSpecialize.getTypeArguments();
            var typesToReplace = knownTypeArguments ? knownTypeArguments : typeParameters;
            var diagnostic: Diagnostic;
            var declAST: AST;

            for (var i = 0; i < typesToReplace.length; i++) {

                if (!typesToReplace[i].isTypeParameter() && (typeArguments[i] == rootType || typeWrapsTypeParameter(typesToReplace[i], typeParameters[i]))) {
                    declAST = resolver.semanticInfoChain.getASTForDecl(newTypeDecl);
                    if (declAST && typeArguments[i] != resolver.getCachedArrayType()) {
                        diagnostic = context.postError(enclosingDecl.getScriptName(), declAST.minChar, declAST.getLength(), DiagnosticCode.A_generic_type_may_not_reference_itself_with_a_wrapped_form_of_its_own_type_parameters, null, enclosingDecl, true);
                        return resolver.getNewErrorTypeSymbol(diagnostic);
                    }
                    else {
                        return resolver.semanticInfoChain.anyTypeSymbol;
                    }
                }

                substitution = specializeType(typesToReplace[i], null, resolver, enclosingDecl, context, ast);

                typeArguments[i] = substitution != null ? substitution : typesToReplace[i];
            }
            
            newType = rootType.getSpecialization(typeArguments);            
        }

        // check to see if this is a recursive specialization while resolving the root type
        // E.g.,
        //
        // interface Array<T> {
        //     p: Array<T>; <- This is really just the declaration
        // }
        //
        var rootTypeParameters = rootType.getTypeParameters();

        if (rootTypeParameters.length && (rootTypeParameters.length == typeArguments.length)) {
            for (var i = 0; i < typeArguments.length; i++) {
                if (typeArguments[i] != rootTypeParameters[i]) {
                    break;
                }
            }

            if (i == rootTypeParameters.length) {
                return rootType;
            }
        }   

        if (newType) {
            if (!newType.isResolved() && !newType.currentlyBeingSpecialized()) {
                //typeToSpecialize.invalidateSpecializations();
            }
            else {
                return newType;
            }
        }
        
        var prevInSpecialization = context.inSpecialization;
        context.inSpecialization = true;

        if (!newType) {
            nSpecializationsCreated++;

            newType = typeToSpecialize.isClass() ? new PullTypeSymbol(typeToSpecialize.getName(), PullElementKind.Class) :
                                                    isArray ? new PullTypeSymbol("Array", PullElementKind.Array) :
                                                        typeToSpecialize.isTypeParameter() ? // watch out for replacing one tyvar with another
                                                            new PullTypeVariableSymbol(typeToSpecialize.getName(), (<PullTypeParameterSymbol>typeToSpecialize).isFunctionTypeParameter()) :
                                                                new PullTypeSymbol(typeToSpecialize.getName(), typeToSpecialize.getKind());
            newType.setRootSymbol(rootType);
        }

        newType.setIsBeingSpecialized();

        newType.setTypeArguments(typeArguments);

        rootType.addSpecialization(newType, typeArguments);

        if (isArray) {
            newType.setElementType(typeArguments[0]);
            typeArguments[0].setArrayType(newType);
        }

        if (typeToSpecialize.currentlyBeingSpecialized()) {
            return newType;
        }

        // If it's a constructor, we want to flag the type as being specialized
        // to prevent stack overflows when specializing the return type
        var prevCurrentlyBeingSpecialized = typeToSpecialize.currentlyBeingSpecialized();
        if (typeToSpecialize.getKind() == PullElementKind.ConstructorType) {
            typeToSpecialize.setIsBeingSpecialized();
        }

        // create the type replacement map

        var typeReplacementMap: any = {};

        for (var i = 0; i < typeParameters.length; i++) {
            if (typeParameters[i] != typeArguments[i]) {
                typeReplacementMap[typeParameters[i].getSymbolID().toString()] = typeArguments[i];
            }
            newType.addTypeParameter(typeParameters[i]);
        }

        // specialize any extends/implements types
        var extendedTypesToSpecialize = typeToSpecialize.getExtendedTypes();
        var typeDecl: PullDecl;
        var typeAST: TypeDeclaration;
        var unitPath: string;
        var decls: PullDecl[] = typeToSpecialize.getDeclarations();

        if (extendedTypesToSpecialize.length) {
            for (var i = 0; i < decls.length; i++) {
                typeDecl = decls[i];
                typeAST = <TypeDeclaration>resolver.semanticInfoChain.getASTForDecl(typeDecl);

                // if this is an 'extended' interface declaration, the AST's extends list may not match
                if (typeAST.extendsList) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(typeDecl.getScriptName());
                    context.pushTypeSpecializationCache(typeReplacementMap);
                    var extendTypeSymbol = resolver.resolveTypeReference(new TypeReference(typeAST.extendsList.members[0], 0), typeDecl, context);
                    resolver.setUnitPath(unitPath);
                    context.popTypeSpecializationCache();

                    newType.addExtendedType(extendTypeSymbol);
                }
            }
        }

        var implementedTypesToSpecialize = typeToSpecialize.getImplementedTypes();

        if (implementedTypesToSpecialize.length) {
            for (var i = 0; i < decls.length; i++) {
                typeDecl = decls[i];
                typeAST = <TypeDeclaration>resolver.semanticInfoChain.getASTForDecl(typeDecl);

                if (typeAST.implementsList) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(typeDecl.getScriptName());
                    context.pushTypeSpecializationCache(typeReplacementMap);
                    var implementedTypeSymbol = resolver.resolveTypeReference(new TypeReference(typeAST.implementsList.members[0], 0), typeDecl, context);
                    resolver.setUnitPath(unitPath);
                    context.popTypeSpecializationCache();

                    newType.addImplementedType(implementedTypeSymbol);
                }
            }
        }

        var callSignatures = typeToSpecialize.getCallSignatures(false);
        var constructSignatures = typeToSpecialize.getConstructSignatures(false);
        var indexSignatures = typeToSpecialize.getIndexSignatures(false);
        var members = typeToSpecialize.getMembers();

        // specialize call signatures
        var newSignature: PullSignatureSymbol;
        var placeHolderSignature: PullSignatureSymbol;
        var signature: PullSignatureSymbol;

        var decl: PullDecl = null;
        var declAST: AST = null;
        var parameters: PullSymbol[];
        var newParameters: PullSymbol[];
        var returnType: PullTypeSymbol = null;
        var prevSpecializationSignature: PullSignatureSymbol = null;

        for (var i = 0; i < callSignatures.length; i++) {
            signature = callSignatures[i];

            if (!signature.currentlyBeingSpecialized()) {

                context.pushTypeSpecializationCache(typeReplacementMap);

                decl = signature.getDeclarations()[0];
                unitPath = resolver.getUnitPath();
                resolver.setUnitPath(decl.getScriptName());

                newSignature = new PullSignatureSymbol(signature.getKind());
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Call signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);
                resolver.resolveAST(declAST, false, newTypeDecl, context);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.getParameters();
                newParameters = newSignature.getParameters();

                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].setType(parameters[p].getType());
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.getReturnType();

                if (!returnType) {
                    newSignature.setReturnType(signature.getReturnType());
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                placeHolderSignature = newSignature;
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

                if (newSignature != placeHolderSignature) {
                    newSignature.setRootSymbol(signature);
                }

                context.popTypeSpecializationCache();

                if (!newSignature) {
                    context.inSpecialization = prevInSpecialization;
                    typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
                    Debug.assert(false, "returning from call");
                    return resolver.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                newSignature = signature;
            }          

            newType.addCallSignature(newSignature);

            if (newSignature.hasGenericParameter()) {
                newType.setHasGenericSignature();
            }
        }

        // specialize construct signatures
        for (var i = 0; i < constructSignatures.length; i++) {
            signature = constructSignatures[i];

            if (!signature.currentlyBeingSpecialized()) {

                context.pushTypeSpecializationCache(typeReplacementMap);

                decl = signature.getDeclarations()[0];
                unitPath = resolver.getUnitPath();
                resolver.setUnitPath(decl.getScriptName());

                newSignature = new PullSignatureSymbol(signature.getKind());
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Construct signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);
                resolver.resolveAST(declAST, false, newTypeDecl, context);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.getParameters();
                newParameters = newSignature.getParameters();

                // we need to clone the parameter types, but the return type
                // was set during resolution
                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].setType(parameters[p].getType());
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.getReturnType();

                if (!returnType) {
                    newSignature.setReturnType(signature.getReturnType());
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                placeHolderSignature = newSignature;
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

                if (newSignature != placeHolderSignature) {
                    newSignature.setRootSymbol(signature);
                }

                context.popTypeSpecializationCache();

                if (!newSignature) {
                    context.inSpecialization = prevInSpecialization;
                    typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
                    Debug.assert(false, "returning from construct");
                    return resolver.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                newSignature = signature;
            }   

            newType.addConstructSignature(newSignature);

            if (newSignature.hasGenericParameter()) {
                newType.setHasGenericSignature();
            }
        }

        // specialize index signatures
        for (var i = 0; i < indexSignatures.length; i++) {
            signature = indexSignatures[i];

            if (!signature.currentlyBeingSpecialized()) {                

                context.pushTypeSpecializationCache(typeReplacementMap);

                decl = signature.getDeclarations()[0];
                unitPath = resolver.getUnitPath();
                resolver.setUnitPath(decl.getScriptName());

                newSignature = new PullSignatureSymbol(signature.getKind());
                nSpecializedSignaturesCreated++;
                newSignature.mimicSignature(signature, resolver);
                declAST = resolver.semanticInfoChain.getASTForDecl(decl);

                Debug.assert(declAST != null, "Index signature for type '" + typeToSpecialize.toString() + "' could not be specialized because of a stale declaration");

                prevSpecializationSignature = decl.getSpecializingSignatureSymbol();
                decl.setSpecializingSignatureSymbol(newSignature);
                resolver.resolveAST(declAST, false, newTypeDecl, context);
                decl.setSpecializingSignatureSymbol(prevSpecializationSignature);

                parameters = signature.getParameters();
                newParameters = newSignature.getParameters();

                // we need to clone the parameter types, but the return type
                // was set during resolution
                for (var p = 0; p < parameters.length; p++) {
                    newParameters[p].setType(parameters[p].getType());
                }
                newSignature.setResolved();

                resolver.setUnitPath(unitPath);

                returnType = newSignature.getReturnType();

                if (!returnType) {
                    newSignature.setReturnType(signature.getReturnType());
                }

                signature.setIsBeingSpecialized();
                newSignature.setRootSymbol(signature);
                placeHolderSignature = newSignature;
                newSignature = specializeSignature(newSignature, true, typeReplacementMap, null, resolver, newTypeDecl, context);
                signature.setIsSpecialized();

                if (newSignature != placeHolderSignature) {
                    newSignature.setRootSymbol(signature);
                }

                context.popTypeSpecializationCache();

                if (!newSignature) {
                    context.inSpecialization = prevInSpecialization;
                    typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
                    Debug.assert(false, "returning from index");
                    return resolver.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                newSignature = signature;
            }   
            
            newType.addIndexSignature(newSignature);

            if (newSignature.hasGenericParameter()) {
                newType.setHasGenericSignature();
            }
        }        

        // specialize members

        var field: PullSymbol = null;
        var newField: PullSymbol = null;

        var fieldType: PullTypeSymbol = null;
        var newFieldType: PullTypeSymbol = null;
        var replacementType: PullTypeSymbol = null;

        var fieldSignatureSymbol: PullSignatureSymbol = null;

        for (var i = 0; i < members.length; i++) {
            field = members[i];
            field.setIsBeingSpecialized();

            decls = field.getDeclarations();

            newField = new PullSymbol(field.getName(), field.getKind());

            newField.setRootSymbol(field);

            if (field.getIsOptional()) {
                newField.setIsOptional();
            }

            if (!field.isResolved()) {
                resolver.resolveDeclaredSymbol(field, newTypeDecl, context);
            }            

            fieldType = field.getType();

            if (!fieldType) {
                fieldType = newType; //new PullTypeVariableSymbol("tyvar" + globalTyvarID);
            }

            replacementType = <PullTypeSymbol>typeReplacementMap[fieldType.getSymbolID().toString()];

            if (replacementType) {
                newField.setType(replacementType);
            }
            else {
                // re-resolve all field decls using the current replacements
                if (fieldType.isGeneric() && !fieldType.isFixed()) {
                    unitPath = resolver.getUnitPath();
                    resolver.setUnitPath(decls[0].getScriptName());

                    context.pushTypeSpecializationCache(typeReplacementMap);

                    newFieldType = specializeType(fieldType, !fieldType.getIsSpecialized() ? typeArguments : null, resolver, newTypeDecl, context, ast);

                    resolver.setUnitPath(unitPath);

                    context.popTypeSpecializationCache();

                    newField.setType(newFieldType);
                }
                else {
                    newField.setType(fieldType);
                }
            }
            field.setIsSpecialized();
            newType.addMember(newField);
        }

        // specialize the constructor and statics, if need be
        if (typeToSpecialize.isClass()) {
            var constructorMethod = typeToSpecialize.getConstructorMethod();

            // If we haven't yet resolved the constructor method, we need to resolve it *without* substituting
            // for any type variables, so as to avoid accidentally specializing the root declaration
            if (!constructorMethod.isResolved()) {
                var prevIsSpecializingConstructorMethod = context.isSpecializingConstructorMethod;
                context.isSpecializingConstructorMethod = true;
                resolver.resolveDeclaredSymbol(constructorMethod, enclosingDecl, context);
                context.isSpecializingConstructorMethod = prevIsSpecializingConstructorMethod;
            }

            var newConstructorMethod = new PullSymbol(constructorMethod.getName(), PullElementKind.ConstructorMethod);
            var newConstructorType = specializeType(constructorMethod.getType(), typeArguments, resolver, newTypeDecl, context, ast);

            newConstructorMethod.setType(newConstructorType);

            var constructorDecls: PullDecl[] = constructorMethod.getDeclarations();

            newConstructorMethod.setRootSymbol(constructorMethod);

            newType.setConstructorMethod(newConstructorMethod);
        }

        newType.setIsSpecialized();

        newType.setResolved();
        typeToSpecialize.setValueIsBeingSpecialized(prevCurrentlyBeingSpecialized);
        context.inSpecialization = prevInSpecialization;
        return newType;
    }

    // PULLTODO: Replace typeReplacementMap with use of context
    export function specializeSignature(signature: PullSignatureSymbol,
        skipLocalTypeParameters: boolean,
        typeReplacementMap: any,
        typeArguments: PullTypeSymbol[],
        resolver: PullTypeResolver,
        enclosingDecl: PullDecl,
        context: PullTypeResolutionContext,
        ast?: AST): PullSignatureSymbol {

        if (signature.currentlyBeingSpecialized()) {
            return signature;
        }

        if (!signature.isResolved() && !signature.isResolving()) {
            resolver.resolveDeclaredSymbol(signature, enclosingDecl, context);
        }

        var newSignature = signature.getSpecialization(typeArguments);

        if (newSignature) {
            return newSignature;
        }

        signature.setIsBeingSpecialized();

        var prevInSpecialization = context.inSpecialization;
        context.inSpecialization = true;

        newSignature = new PullSignatureSymbol(signature.getKind());
        nSpecializedSignaturesCreated++;
        newSignature.setRootSymbol(signature);

        if (signature.hasVariableParamList()) {
            newSignature.setHasVariableParamList();
        }

        if (signature.hasGenericParameter()) {
            newSignature.setHasGenericParameter();
        }

        signature.addSpecialization(newSignature, typeArguments);      

        var parameters = signature.getParameters();
        var typeParameters = signature.getTypeParameters();
        var returnType = signature.getReturnType();

        for (var i = 0; i < typeParameters.length; i++) {
            newSignature.addTypeParameter(typeParameters[i]);
        }

        if (signature.hasGenericParameter()) {
            newSignature.setHasGenericParameter();
        }

        var newParameter: PullSymbol;
        var newParameterType: PullTypeSymbol;
        var newParameterElementType: PullTypeSymbol;
        var parameterType: PullTypeSymbol;
        var replacementParameterType: PullTypeSymbol;
        var localTypeParameters: any = new BlockIntrinsics();
        var localSkipMap: any = null;

        // if we specialize the signature recursive (through, say, the specialization of a method whilst specializing
        // its class), we need to prevent accidental specialization of type parameters that shadow type parameters in the
        // enclosing type.  (E.g., "class C<T> { public m<T>() {...} }" )
        if (skipLocalTypeParameters) {
            for (var i = 0; i < typeParameters.length; i++) {
                localTypeParameters[typeParameters[i].getName()] = true;
                if (!localSkipMap) {
                    localSkipMap = {};
                }
                localSkipMap[typeParameters[i].getSymbolID().toString()] = typeParameters[i];
            }
        }

        context.pushTypeSpecializationCache(typeReplacementMap);

        if (skipLocalTypeParameters && localSkipMap) {
            context.pushTypeSpecializationCache(localSkipMap);
        }
        var newReturnType = (!localTypeParameters[returnType.getName()] /*&& typeArguments != null*/) ? specializeType(returnType, null/*typeArguments*/, resolver, enclosingDecl, context, ast) : returnType;
        if (skipLocalTypeParameters && localSkipMap) {
            context.popTypeSpecializationCache();
        }
        context.popTypeSpecializationCache();

        newSignature.setReturnType(newReturnType);

        for (var k = 0; k < parameters.length; k++) {

            newParameter = new PullSymbol(parameters[k].getName(), parameters[k].getKind());
            newParameter.setRootSymbol(parameters[k]);

            parameterType = parameters[k].getType();

            context.pushTypeSpecializationCache(typeReplacementMap);
            if (skipLocalTypeParameters && localSkipMap) {
                context.pushTypeSpecializationCache(localSkipMap);
            }
            newParameterType = !localTypeParameters[parameterType.getName()] ? specializeType(parameterType, null/*typeArguments*/, resolver, enclosingDecl, context, ast) : parameterType;
            if (skipLocalTypeParameters && localSkipMap) {
                context.popTypeSpecializationCache();
            }
            context.popTypeSpecializationCache();

            if (parameters[k].getIsOptional()) {
                newParameter.setIsOptional();
            }

            if (parameters[k].getIsVarArg()) {
                newParameter.setIsVarArg();
                newSignature.setHasVariableParamList();
            }

            if (resolver.isTypeArgumentOrWrapper(newParameterType)) {
                newSignature.setHasGenericParameter();
            }

            newParameter.setType(newParameterType);
            newSignature.addParameter(newParameter, newParameter.getIsOptional());
        }

        signature.setIsSpecialized();

        context.inSpecialization = prevInSpecialization;

        return newSignature;
    }

    export function getIDForTypeSubstitutions(types: PullTypeSymbol[]): string {
        var substitution = "";

        for (var i = 0; i < types.length; i++) {
            substitution += types[i].getSymbolID().toString() + "#";
        }

        return substitution;
    }
}