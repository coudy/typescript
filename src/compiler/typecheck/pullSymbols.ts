// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullSymbolID = 0;
    export var globalTyvarID = 0;
    export var sentinelEmptyArray: any[] = [];

    export class PullSymbol {

        // private state
        public pullSymbolID = pullSymbolID++;
        public pullSymbolIDString: string = null;

        public name: string;

        public kind: PullElementKind;

        private _container: PullTypeSymbol = null;
        public type: PullTypeSymbol = null;

        // We cache the declarations to improve look-up speed
        // (but we re-create on edits because deletion from the linked list is
        // much faster)
        private _declarations: PullDecl[] = null;

        public isResolved = false;

        public isOptional = false;

        public inResolution = false;

        private isSynthesized = false;

        public isVarArg = false;

        private rootSymbol: PullSymbol = null;

        private _parentAccessorSymbol: PullSymbol = null;
        private _enclosingSignature: PullSignatureSymbol = null;
        public docComments: string = null;

        public isPrinting = false;

        // This is used to store the AST directly on the symbol, rather than using a data map,
        // if the useDirectTypeStorage flag is set
        public ast: AST = null;

        public isType() {
            return (this.kind & PullElementKind.SomeType) != 0;
        }

        public isTypeReference() { return false; }

        public isSignature() {
            return (this.kind & PullElementKind.SomeSignature) != 0;
        }

        // REVIEW: We need to remove this array special-case code
        public isArray() {
            return (this.kind & PullElementKind.Array) != 0;
        }

        public isPrimitive() {
            return this.kind === PullElementKind.Primitive;
        }

        public isAccessor() {
            return false;
        }

        public isError() {
            return false;
        }

        public isInterface() {
            return this.kind === PullElementKind.Interface;
        }

        public isMethod() {
            return this.kind === PullElementKind.Method;
        }

        public isProperty() {
            return this.kind === PullElementKind.Property;
        }

        public isAlias() { return false; }

        public isContainer() { return false; }

        constructor(name: string, declKind: PullElementKind) {
            this.name = name;
            this.kind = declKind;
            this.pullSymbolIDString = this.pullSymbolID.toString();
        }

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
                    if (childDecls[j].kind === PullElementKind.TypeAlias) {
                        var symbol = <PullTypeAliasSymbol>childDecls[j].getSymbol();
                        if (PullContainerSymbol.usedAsSymbol(symbol, this)) {
                            return symbol;
                        }
                        if (this.rootSymbol && PullContainerSymbol.usedAsSymbol(symbol, this.rootSymbol)) {
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
            if (scopePath.length && scopePath[scopePath.length - 1].kind === PullElementKind.DynamicModule) {
                var decls = scopePath[scopePath.length - 1].getDeclarations();
                var symbol = this.findAliasedType(decls);
                return symbol;
            }

            return null;
        }

        public getScopedDynamicModuleAlias(scopeSymbol: PullSymbol) {
            var aliasSymbol = this.getAliasedSymbol(scopeSymbol);
            // Use only alias symbols to the dynamic module
            if (aliasSymbol) {
                // Has value symbol
                if (aliasSymbol.assignedValue) {
                    return null;
                }

                // Has type that is not same as container
                if (aliasSymbol.assignedType && aliasSymbol.assignedType != aliasSymbol.assignedContainer) {
                    return null;
                }

                // Its internal module
                if (aliasSymbol.assignedContainer.kind != PullElementKind.DynamicModule) {
                    return null;
                }
            }
            return aliasSymbol;
        }

        /** Use getName for type checking purposes, and getDisplayName to report an error or display info to the user.
         * They will differ when the identifier is an escaped unicode character or the identifier "__proto__".
         */
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (symbol) {
                return symbol.getName();
            }

            return this.name;
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var symbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (symbol) {
                return symbol.getDisplayName();
            }

            // Get the actual name associated with a declaration for this symbol
            var decls = this.getDeclarations();
            return decls.length ? this.getDeclarations()[0].getDisplayName() : this.name;
        }

        public getIsSpecialized() { return false; }

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

        public setResolved() {
            this.isResolved = true;
            this.inResolution = false;
        }

        public startResolving() {
            this.inResolution = true;
        }

        public setUnresolved() {
            this.isResolved = false;
            this.inResolution = false;
        }

        public invalidate() {
            this.setUnresolved();
        }

        public hasFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if ((declarations[i].flags & flag) !== PullElementFlags.None) {
                    return true;
                }
            }
            return false;
        }

        public allDeclsHaveFlag(flag: PullElementFlags): boolean {
            var declarations = this.getDeclarations();
            for (var i = 0, n = declarations.length; i < n; i++) {
                if (!((declarations[i].flags & flag) !== PullElementFlags.None)) {
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
                var nodeKind = node.kind;
                if (nodeKind == PullElementKind.Parameter) {
                    break;
                } else {
                    node = node.getContainer();
                }
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

        public fullName(scopeSymbol?: PullSymbol): string {
            var path = this.pathToRoot();
            var fullName = "";
            var aliasedSymbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.fullName(scopeSymbol);
            }

            for (var i = 1; i < path.length; i++) {
                aliasedSymbol = path[i].getScopedDynamicModuleAlias(scopeSymbol);
                if (aliasedSymbol) {
                    // Aliased name found
                    fullName = aliasedSymbol.fullName(scopeSymbol) + "." + fullName;
                    break;
                } else {
                    var scopedName = path[i].getNamePartForFullName();
                    if (path[i].kind == PullElementKind.DynamicModule && !isQuoted(scopedName)) {
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

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var path = this.findCommonAncestorPath(scopeSymbol);
            var fullName = "";
            var aliasedSymbol = this.getScopedDynamicModuleAlias(scopeSymbol);
            if (aliasedSymbol) {
                return aliasedSymbol.getScopedName(scopeSymbol);
            }

            for (var i = 1; i < path.length; i++) {
                var kind = path[i].kind;
                if (kind === PullElementKind.Container || kind === PullElementKind.DynamicModule) {
                    aliasedSymbol = path[i].getScopedDynamicModuleAlias(scopeSymbol);
                    if (aliasedSymbol) {
                        // Aliased name
                        fullName = aliasedSymbol.getScopedName(scopeSymbol) + "." + fullName;
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
            var type = this.type;
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
            var type = this.type;
            if (type && !type.isNamedTypeSymbol() && this.kind != PullElementKind.Property && this.kind != PullElementKind.Variable && this.kind != PullElementKind.Parameter) {
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
            var type = this.type;
            var nameStr = this.getDisplayName(scopeSymbol);
            if (type) {
                nameStr = nameStr + (this.isOptional ? "?" : "");
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
            var kind = this.kind;
            if (kind === PullElementKind.Primitive) {
                return true;
            }

            if (this.rootSymbol) {
                return PullSymbol.getIsExternallyVisible(this.rootSymbol, this, inIsExternallyVisibleSymbols);
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
                var decls = this.getDeclarations();
                if (decls.length) {
                    var parentDecl = decls[0].getParentDecl();
                    if (parentDecl) {
                        var parentSymbol = parentDecl.getSymbol();
                        if (!parentSymbol || parentDecl.kind == PullElementKind.Script) {
                            return true;
                        }

                        return PullSymbol.getIsExternallyVisible(parentSymbol, this, inIsExternallyVisibleSymbols);
                    }
                }

                return true;
            }

            // If export assignment check if this is the symbol that is exported
            if (container.kind == PullElementKind.DynamicModule ||
                (container.getAssociatedContainerType() && container.getAssociatedContainerType().kind == PullElementKind.DynamicModule)) {
                var containerSymbol = container.kind == PullElementKind.DynamicModule
                    ? <PullContainerSymbol>container
                    : <PullContainerSymbol>container.getAssociatedContainerType();
                if (PullContainerSymbol.usedAsSymbol(containerSymbol, this)) {
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
        private _specializationCache: any = {};
        private _memberTypeParameterNameCache: BlockIntrinsics<PullTypeParameterSymbol> = null;
        private _stringConstantOverload: boolean = undefined;

        public parameters: PullSymbol[] = sentinelEmptyArray;
        public typeParameters: PullTypeParameterSymbol[] = null;
        public returnType: PullTypeSymbol = null;
        public functionType: PullTypeSymbol = null;

        public hasOptionalParam = false;
        public nonOptionalParamCount = 0;

        public hasVarArgs = false;

        public cachedObjectSpecialization: PullSignatureSymbol = null;

        // GTODO
        public hasAGenericParameter = false;

        public hasBeenChecked = false;
        public inWrapCheck = false;

        constructor(kind: PullElementKind) {
            super("", kind);
        }

        public isDefinition() { return false; }
        
        // GTODO
        public isGeneric() { return this.hasAGenericParameter || (this.typeParameters && this.typeParameters.length != 0); }

        public addParameter(parameter: PullSymbol, isOptional = false) {
            if (this.parameters == sentinelEmptyArray) {
                this.parameters = [];
            }

            this.parameters[this.parameters.length] = parameter;
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
                this._specializationCache[getIDForTypeSubstitutions(typeArguments)] = signature;
            }
        }

        public getSpecialization(typeArguments: PullTypeSymbol[]): PullSignatureSymbol {

            if (typeArguments) {
                var sig = <PullSignatureSymbol>this._specializationCache[getIDForTypeSubstitutions(typeArguments)];

                if (sig) {
                    return sig;
                }
            }

            return null;
        }

        public addTypeParameter(typeParameter: PullTypeParameterSymbol) {
            if (!this.typeParameters) {
                this.typeParameters = [];
            }

            if (!this._memberTypeParameterNameCache) {
                this._memberTypeParameterNameCache = new BlockIntrinsics();
            }

            this.typeParameters[this.typeParameters.length] = typeParameter;

            this._memberTypeParameterNameCache[typeParameter.getName()] = typeParameter;
        }

        public getTypeParameters(): PullTypeParameterSymbol[] {

            if (!this.typeParameters) {
                this.typeParameters = [];
            }

            return this.typeParameters;
        }

        public findTypeParameter(name: string): PullTypeParameterSymbol {
            var memberSymbol: PullTypeParameterSymbol;

            if (!this._memberTypeParameterNameCache) {
                this._memberTypeParameterNameCache = new BlockIntrinsics();

                if (this.typeParameters) {
                    for (var i = 0; i < this.typeParameters.length; i++) {
                        this._memberTypeParameterNameCache[this.typeParameters[i].getName()] = this.typeParameters[i];
                    }
                }
            }

            memberSymbol = this._memberTypeParameterNameCache[name];

            return memberSymbol;
        }

        public invalidate() {

            this.nonOptionalParamCount = 0;
            this.hasOptionalParam = false;
            this.hasAGenericParameter = false;
            this._stringConstantOverload = undefined;

            super.invalidate();
        }

        public isStringConstantOverloadSignature() {
            if (this._stringConstantOverload === undefined) {
                var params = this.parameters;
                this._stringConstantOverload = false;
                for (var i = 0; i < params.length; i++) {
                    var paramType = params[i].type;
                    if (paramType && paramType.isPrimitive() && (<PullPrimitiveTypeSymbol>paramType).isStringConstant()) {
                        this._stringConstantOverload = true;
                    }
                }
            }

            return this._stringConstantOverload;
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
                var overloadString = getLocalizedText(DiagnosticCode._0_overload_s, [foundDefinition ? len - 2 : len - 1]);
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

            var params = this.parameters;
            var paramLen = params.length;
            for (var i = 0; i < paramLen; i++) {
                var paramType = params[i].type;
                var typeString = paramType ? ": " : "";
                var paramIsVarArg = params[i].isVarArg;
                var varArgPrefix = paramIsVarArg ? "..." : "";
                var optionalString = (!paramIsVarArg && params[i].isOptional) ? "?" : "";
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

            if (this.returnType) {
                builder.add(this.returnType.getScopedNameEx(scopeSymbol));
            }
            else {
                builder.add(MemberName.create("any"));
            }

            return builder;
        }
    }

    export class PullTypeSymbol extends PullSymbol {

        private _members: PullSymbol[] = sentinelEmptyArray;
        private _enclosedMemberTypes: PullTypeSymbol[] = null;
        private _enclosedMemberContainers: PullTypeSymbol[] = null;
        private _typeParameters: PullTypeParameterSymbol[] = null;

        // GTODO
        private _typeArguments: PullTypeSymbol[] = null;

        private _containedNonMembers: PullSymbol[] = null;
        private _containedNonMemberTypes: PullTypeSymbol[] = null;
        private _containedNonMemberContainers: PullTypeSymbol[] = null;

        // GTODO
        private _specializedVersionsOfThisType: PullTypeSymbol[] = null;
        private _arrayVersionOfThisType: PullTypeSymbol = null;

        private _implementedTypes: PullTypeSymbol[] = null;
        private _extendedTypes: PullTypeSymbol[] = null;

        private _typesThatExplicitlyImplementThisType: PullTypeSymbol[] = null;
        private _typesThatExtendThisType: PullTypeSymbol[] = null;

        private _callSignatures: PullSignatureSymbol[] = null;
        private _allCallSignatures: PullSignatureSymbol[] = null;
        private _constructSignatures: PullSignatureSymbol[] = null;
        private _allConstructSignatures: PullSignatureSymbol[] = null;
        private _indexSignatures: PullSignatureSymbol[] = null;
        private _allIndexSignatures: PullSignatureSymbol[] = null;

        // GTODO
        private _elementType: PullTypeSymbol = null;

        private _memberNameCache: BlockIntrinsics<PullSymbol> = null;
        private _enclosedTypeNameCache: BlockIntrinsics<PullTypeSymbol> = null;
        private _enclosedContainerCache: BlockIntrinsics<PullTypeSymbol> = null;
        private _typeParameterNameCache: BlockIntrinsics<PullTypeParameterSymbol> = null;
        private _containedNonMemberNameCache: BlockIntrinsics<PullSymbol> = null;
        private _containedNonMemberTypeNameCache: BlockIntrinsics<PullTypeSymbol> = null;
        private _containedNonMemberContainerCache: BlockIntrinsics<PullTypeSymbol> = null;
        private _specializedTypeIDCache: BlockIntrinsics<PullTypeSymbol> = null;

        // GTODO
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
        private _inMemberTypeNameEx = false;


        // GTODO
        public memberWrapsOwnTypeParameter = false;

        public inSymbolPrivacyCheck = false;
        public inWrapCheck = false;

        public typeReference: PullTypeReferenceSymbol = null;

        constructor(name: string, kind: PullElementKind) {
            super(name, kind);
            this.type = this;
        }

        public isType() { return true; }
        public isClass() {
            return this.kind == PullElementKind.Class || (this._constructorMethod != null);
        }
        public isFunction() { return (this.kind & (PullElementKind.ConstructorType | PullElementKind.FunctionType)) != 0; }
        public isConstructor() { return this.kind == PullElementKind.ConstructorType; }
        public isTypeParameter() { return false; }
        public isTypeVariable() { return false; }
        public isError() { return false; }
        public isEnum() { return this.kind == PullElementKind.Enum; }

        public isObject(): boolean {
            return hasFlag(this.kind,
                PullElementKind.Array | PullElementKind.Class | PullElementKind.ConstructorType | PullElementKind.Enum | PullElementKind.FunctionType | PullElementKind.Interface | PullElementKind.ObjectType);
        }

        public getKnownBaseTypeCount() { return this._knownBaseTypeCount; }
        public resetKnownBaseTypeCount() { this._knownBaseTypeCount = 0; }
        public incrementKnownBaseCount() { this._knownBaseTypeCount++; }

        public setHasBaseTypeConflict(): void {
            this._hasBaseTypeConflict = true;
        }
        public hasBaseTypeConflict(): boolean {
            return this._hasBaseTypeConflict;
        }

        public setUnresolved(): void {
            super.setUnresolved();

            this._invalidatedSpecializations = false;

            var specializations = this.getKnownSpecializations();

            for (var i = 0; i < specializations.length; i++) {
                specializations[i].setUnresolved();
            }
        }

        public hasMembers(): boolean {

            if (this._members != sentinelEmptyArray) {
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

        // GTODO
        public setHasGenericSignature() { this._hasGenericSignature = true; }
        public getHasGenericSignature() { return this._hasGenericSignature; }

        // GTODO
        public setHasGenericMember() { this._hasGenericMember = true; }
        public getHasGenericMember() { return this._hasGenericMember; }

        public setAssociatedContainerType(type: PullTypeSymbol): void {
            this._associatedContainerTypeSymbol = type;
        }

        public getAssociatedContainerType(): PullTypeSymbol {
            return this._associatedContainerTypeSymbol;
        }

        // GTODO
        public getArrayType(): PullTypeSymbol { return this._arrayVersionOfThisType; }

        public getElementType(): PullTypeSymbol {
            return this._elementType;
        }

        public setElementType(type: PullTypeSymbol) {
            this._elementType = type;
        }

        public setArrayType(arrayType: PullTypeSymbol) {
            this._arrayVersionOfThisType = arrayType;
        }

        public getFunctionSymbol(): PullSymbol {
            return this._functionSymbol;
        }

        public setFunctionSymbol(symbol: PullSymbol): void {
            if (symbol) {
                this._functionSymbol = symbol;
            }
        }

        public addContainedNonMember(nonMember: PullSymbol): void {

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

            this._containedNonMemberNameCache[nonMember.name] = nonMember;
        }

        // TODO: This seems to conflate exposed members with private non-Members
        public findContainedNonMember(name: string): PullSymbol {
            if (!this._containedNonMemberNameCache) {
                return null;
            }

            return this._containedNonMemberNameCache[name];
        }

        public findContainedNonMemberType(typeName: string, kind = PullElementKind.None): PullTypeSymbol {
            if (!this._containedNonMemberTypeNameCache) {
                return null;
            }

            var nonMemberSymbol = this._containedNonMemberTypeNameCache[typeName];

            if (nonMemberSymbol && kind != PullElementKind.None) {
                nonMemberSymbol = ((nonMemberSymbol.kind & kind) != 0) ? nonMemberSymbol : null;
            }

            return nonMemberSymbol;
        }

        public findContainedNonMemberContainer(containerName: string, kind = PullElementKind.None): PullTypeSymbol {
            if (!this._containedNonMemberContainerCache) {
                return null;
            }

            var nonMemberSymbol = this._containedNonMemberContainerCache[containerName];

            if (nonMemberSymbol && kind != PullElementKind.None) {
                nonMemberSymbol = ((nonMemberSymbol.kind & kind) != 0) ? nonMemberSymbol : null;
            }

            return nonMemberSymbol;
        }

        public addMember(memberSymbol: PullSymbol): void {
            if (!memberSymbol) {
                return;
            }

            memberSymbol.setContainer(this);

            if (!this._memberNameCache) {
                this._memberNameCache = new BlockIntrinsics();
            }

            if (this._members == sentinelEmptyArray) {
                this._members = [];
            }

            this._members[this._members.length] = memberSymbol;
            this._memberNameCache[memberSymbol.name] = memberSymbol;
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
            this._enclosedTypeNameCache[enclosedType.name] = enclosedType;
        }

        public addEnclosedMemberContainer(enclosedContainer: PullTypeSymbol): void {

            if (!enclosedContainer) {
                return;
            }

            enclosedContainer.setContainer(this);

            if (!this._enclosedContainerCache) {
                this._enclosedContainerCache = new BlockIntrinsics();
            }

            if (!this._enclosedMemberContainers) {
                this._enclosedMemberContainers = [];
            }

            this._enclosedMemberContainers[this._enclosedMemberContainers.length] = enclosedContainer;
            this._enclosedContainerCache[enclosedContainer.name] = enclosedContainer;
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
            this._containedNonMemberNameCache[enclosedNonMember.name] = enclosedNonMember;
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
            this._containedNonMemberTypeNameCache[enclosedNonMemberType.name] = enclosedNonMemberType;
        }

        public addEnclosedNonMemberContainer(enclosedNonMemberContainer: PullTypeSymbol): void {

            if (!enclosedNonMemberContainer) {
                return;
            }

            enclosedNonMemberContainer.setContainer(this);

            if (!this._containedNonMemberContainerCache) {
                this._containedNonMemberContainerCache = new BlockIntrinsics();
            }

            if (!this._containedNonMemberContainers) {
                this._containedNonMemberContainers = [];
            }

            this._containedNonMemberContainers[this._containedNonMemberContainers.length] = enclosedNonMemberContainer;
            this._containedNonMemberContainerCache[enclosedNonMemberContainer.name] = enclosedNonMemberContainer;
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

        // GTODO
        public addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol): void {

            this.addTypeParameter(typeParameter);

            var constructSignatures = this.getConstructSignatures();

            for (var i = 0; i < constructSignatures.length; i++) {
                constructSignatures[i].addTypeParameter(typeParameter);
            }
        }

        public getMembers(): PullSymbol[] {
            return this._members;
        }

        public setHasDefaultConstructor(hasOne= true): void {
            this._hasDefaultConstructor = hasOne;
        }

        public getHasDefaultConstructor(): boolean {
            return this._hasDefaultConstructor;
        }

        public getConstructorMethod(): PullSymbol {
            return this._constructorMethod;
        }

        public setConstructorMethod(constructorMethod: PullSymbol): void {
            this._constructorMethod = constructorMethod;
        }

        public getTypeParameters(): PullTypeParameterSymbol[] {
            if (!this._typeParameters) {
                return sentinelEmptyArray;
            }

            return this._typeParameters;
        }

        // GTODO
        public isGeneric(): boolean {
            return (this._typeParameters && this._typeParameters.length != 0) ||
                this._hasGenericSignature ||
                this._hasGenericMember ||
                (this._typeArguments && this._typeArguments.length) ||
                this.isArray();
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

        public getKnownSpecializations(): PullTypeSymbol[] {
            if (!this._specializedVersionsOfThisType) {
                return sentinelEmptyArray;
            }

            return this._specializedVersionsOfThisType;
        }

        // GTODO
        public getTypeArguments(): PullTypeSymbol[] {
            return this._typeArguments;
        }

        public setTypeArguments(typeArgs: PullTypeSymbol[]): void { this._typeArguments = typeArgs; }

        public getTypeArgumentsOrTypeParameters(): PullTypeSymbol[] {
            return this.getTypeParameters();
        }

        public addCallSignature(callSignature: PullSignatureSymbol): void {

            if (!this._callSignatures) {
                this._callSignatures = [];
            }

            this._callSignatures[this._callSignatures.length] = callSignature;

            if (callSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            callSignature.functionType = this;
        }

        public addConstructSignature(constructSignature: PullSignatureSymbol): void {

            if (!this._constructSignatures) {
                this._constructSignatures = [];
            }

            this._constructSignatures[this._constructSignatures.length] = constructSignature;

            if (constructSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            constructSignature.functionType = this;
        }

        public addIndexSignature(indexSignature: PullSignatureSymbol): void {
            if (!this._indexSignatures) {
                this._indexSignatures = [];
            }

            this._indexSignatures[this._indexSignatures.length] = indexSignature;

            if (indexSignature.isGeneric()) {
                this._hasGenericSignature = true;
            }

            indexSignature.functionType = this;
        }

        public hasOwnCallSignatures(): boolean { return !!this._callSignatures; }

        public getCallSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {

            if (!collectBaseSignatures) {
                return this._callSignatures || [];
            }

            if (this._allCallSignatures) {
                return this._allCallSignatures;
            }

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

            this._allCallSignatures = signatures;

            return signatures;
        }

        public hasOwnConstructSignatures(): boolean { return !!this._constructSignatures; }

        public getConstructSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {

            if (!collectBaseSignatures) {
                return this._constructSignatures || [];
            }

            var signatures: PullSignatureSymbol[] = [];

            if (this._constructSignatures) {
                signatures = signatures.concat(this._constructSignatures);
            }

            // If it's a constructor type, we don't inherit construct signatures
            // (E.g., we'd be looking at the statics on a class, where we want
            // to inherit members, but not construct signatures
            if (collectBaseSignatures && this._extendedTypes && !(this.kind == PullElementKind.ConstructorType)) {
                for (var i = 0; i < this._extendedTypes.length; i++) {
                    if (this._extendedTypes[i].hasBase(this)) {
                        continue;
                    }

                    signatures = signatures.concat(this._extendedTypes[i].getConstructSignatures());
                }
            }

            return signatures;
        }

        public hasOwnIndexSignatures(): boolean { return !!this._indexSignatures; }

        public getIndexSignatures(collectBaseSignatures= true): PullSignatureSymbol[] {

            if (!collectBaseSignatures) {
                return this._indexSignatures || [];
            }

            if (this._allIndexSignatures) {
                return this._allIndexSignatures;
            }

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

            this._allIndexSignatures = signatures;

            return signatures;
        }

        public addImplementedType(implementedType: PullTypeSymbol): void {
            if (!implementedType) {
                return;
            }

            if (!this._implementedTypes) {
                this._implementedTypes = [];
            }

            this._implementedTypes[this._implementedTypes.length] = implementedType;

            implementedType.addTypeThatExplicitlyImplementsThisType(this);
        }

        public getImplementedTypes(): PullTypeSymbol[] {
            if (!this._implementedTypes) {
                return sentinelEmptyArray;
            }

            return this._implementedTypes;
        }

        public addExtendedType(extendedType: PullTypeSymbol): void {
            if (!extendedType) {
                return;
            }

            if (!this._extendedTypes) {
                this._extendedTypes = [];
            }

            this._extendedTypes[this._extendedTypes.length] = extendedType;

            extendedType.addTypeThatExtendsThisType(this);
        }

        public getExtendedTypes(): PullTypeSymbol[] {
            if (!this._extendedTypes) {
                return sentinelEmptyArray;
            }

            return this._extendedTypes;
        }

        public addTypeThatExtendsThisType(type: PullTypeSymbol): void {
            if (!type) {
                return;
            }

            if (!this._typesThatExtendThisType) {
                this._typesThatExtendThisType = [];
            }

            this._typesThatExtendThisType[this._typesThatExtendThisType.length] = type;
        }

        public getTypesThatExtendThisType(): PullTypeSymbol[] {
            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            return this._typesThatExtendThisType;
        }

        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void {
            if (!type) {
                return;
            }

            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            this._typesThatExplicitlyImplementThisType[this._typesThatExplicitlyImplementThisType.length] = type;
        }

        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[] {
            if (!this._typesThatExplicitlyImplementThisType) {
                this._typesThatExplicitlyImplementThisType = [];
            }

            return this._typesThatExplicitlyImplementThisType;
        }

        public hasBase(potentialBase: PullTypeSymbol, visited: PullSymbol[]= []): boolean {
            // Check if this is the potential base:
            //      A extends A  => this === potentialBase
            //      A<T> extends A<T>  => this.getRootSymbol() === potentialBase
            //      A<T> extends A<string> => this === potentialBase.getRootSymbol()
            if (this === potentialBase || this.getRootSymbol() === potentialBase || this === potentialBase.getRootSymbol()) {
                return true;
            }

            if (ArrayUtilities.contains(visited, this)) {
                return true;
            }

            visited.push(this);

            var extendedTypes = this.getExtendedTypes();

            for (var i = 0; i < extendedTypes.length; i++) {
                if (extendedTypes[i].hasBase(potentialBase, visited)) {
                    return true;
                }
            }

            var implementedTypes = this.getImplementedTypes();

            for (var i = 0; i < implementedTypes.length; i++) {
                if (implementedTypes[i].hasBase(potentialBase, visited)) {
                    return true;
                }
            }

            // Clean the list if we are returning false to ensure we are not leaving symbols that 
            // were not in the path. No need to do that if we return true, as that will short circuit
            // the search
            visited.pop();

            return false;
        }

        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean {
            // Error type symbol is invalid base kind
            if (baseType.isError()) {
                return false;
            }

            var thisIsClass = this.isClass();
            if (isExtendedType) {
                if (thisIsClass) {
                    // Class extending non class Type is invalid
                    return baseType.kind === PullElementKind.Class;
                }
            } else {
                if (!thisIsClass) {
                    // Interface implementing baseType is invalid
                    return false;
                }
            }

            // Interface extending non interface or class 
            // or class implementing non interface or class - are invalid
            return !!(baseType.kind & (PullElementKind.Interface | PullElementKind.Class | PullElementKind.Array));
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

            return null;
        }

        public findNestedType(name: string, kind = PullElementKind.None): PullTypeSymbol {
            var memberSymbol: PullTypeSymbol;

            if (!this._enclosedTypeNameCache) {
                return null;
            }

            memberSymbol = this._enclosedTypeNameCache[name];

            if (memberSymbol && kind != PullElementKind.None) {
                memberSymbol = ((memberSymbol.kind & kind) != 0) ? memberSymbol : null;
            }

            return memberSymbol;
        }

        public findNestedContainer(name: string, kind = PullElementKind.None): PullTypeSymbol {
            var memberSymbol: PullTypeSymbol;

            if (!this._enclosedContainerCache) {
                return null;
            }

            memberSymbol = this._enclosedContainerCache[name];

            if (memberSymbol && kind != PullElementKind.None) {
                memberSymbol = ((memberSymbol.kind & kind) != 0) ? memberSymbol : null;
            }

            return memberSymbol;
        }

        public getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[] {

            var allMembers: PullSymbol[] = [];

            var i = 0;
            var j = 0;
            var m = 0;
            var n = 0;

            // Add members
            if (this._members != sentinelEmptyArray) {

                for (var i = 0, n = this._members.length; i < n; i++) {
                    var member = this._members[i];
                    if ((member.kind & searchDeclKind) && (memberVisiblity !== GetAllMembersVisiblity.externallyVisible || !member.hasFlag(PullElementFlags.Private))) {
                        allMembers[allMembers.length] = member;
                    }
                }
            }

            // Add parent members
            if (this._extendedTypes) {
                // Do not look for the parent's private members unless we need to enumerate all members
                var extenedMembersVisibility = memberVisiblity !== GetAllMembersVisiblity.all ? GetAllMembersVisiblity.externallyVisible : GetAllMembersVisiblity.all;

                for (var i = 0, n = this._extendedTypes.length; i < n; i++) {
                    var extendedMembers = this._extendedTypes[i].getAllMembers(searchDeclKind, /*memberVisiblity*/ extenedMembersVisibility);

                    for (var j = 0, m = extendedMembers.length; j < m; j++) {
                        var extendedMember = extendedMembers[j];
                        if (!(this._memberNameCache && this._memberNameCache[extendedMember.name])) {
                            allMembers[allMembers.length] = extendedMember;
                        }
                    }
                }
            }

            if (this.isContainer()) {
                if (this._enclosedMemberTypes) {
                    for (var i = 0; i < this._enclosedMemberTypes.length; i++) {
                        allMembers[allMembers.length] = this._enclosedMemberTypes[i];
                    }
                }
                if (this._enclosedMemberContainers) {
                    for (var i = 0; i < this._enclosedMemberContainers.length; i++) {
                        allMembers[allMembers.length] = this._enclosedMemberContainers[i];
                    }
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

        public setResolved(): void {
            super.setResolved();
        }

        public invalidate(): void {

            if (this._constructorMethod) {
                this._constructorMethod.invalidate();
            }

            this._knownBaseTypeCount = 0;

            super.invalidate();
        }

        public getNamePartForFullName(): string {
            var name = super.getNamePartForFullName();

            var typars = this.getTypeArgumentsOrTypeParameters();
            var typarString = PullSymbol.getTypeParameterString(typars, this, /*useConstraintInName:*/ true);
            return name + typarString;
        }

        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.getScopedNameEx(scopeSymbol, useConstraintInName).toString();
        }

        public isNamedTypeSymbol(): boolean {
            if (this.isArray()) {
                return false;
            }

            var kind = this.kind;
            if (kind === PullElementKind.Primitive || // primitives
                kind === PullElementKind.Class || // class
                kind === PullElementKind.Container || // module
                kind === PullElementKind.DynamicModule || // dynamic module
                kind === PullElementKind.TypeAlias || // dynamic module
                kind === PullElementKind.Enum || // enum
                kind === PullElementKind.TypeParameter || //TypeParameter
                ((kind === PullElementKind.Interface || kind === PullElementKind.ObjectType) && this.name != "")) {
                return true;
            }

            return false;
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            var s = this.getScopedNameEx(scopeSymbol, useConstraintInName).toString();
            return s;
        }

        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean): MemberName {

            if (this.isArray()) {
                var elementType = this.getElementType();
                var elementMemberName = elementType ?
                    (elementType.isArray() || elementType.isNamedTypeSymbol() ?
                    elementType.getScopedNameEx(scopeSymbol, false, getPrettyTypeName, getTypeParamMarkerInfo) :
                    elementType.getMemberTypeNameEx(false, scopeSymbol, getPrettyTypeName)) :
                    MemberName.create("any");
                return MemberName.create(elementMemberName, "", "[]");
            }

            if (!this.isNamedTypeSymbol()) {
                return this.getMemberTypeNameEx(true, scopeSymbol, getPrettyTypeName);
            }

            var builder = new MemberNameArray();
            builder.prefix = super.getScopedName(scopeSymbol, useConstraintInName);

            var typars = this.getTypeArgumentsOrTypeParameters();
            builder.add(PullSymbol.getTypeParameterStringEx(typars, scopeSymbol, getTypeParamMarkerInfo, useConstraintInName));

            return builder;
        }

        public hasOnlyOverloadCallSignatures(): boolean {
            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            return members.length === 0 && constructSignatures.length === 0 && callSignatures.length > 1;
        }

        private getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): MemberName {
            var members = this.getMembers();
            var callSignatures = this.getCallSignatures();
            var constructSignatures = this.getConstructSignatures();
            var indexSignatures = this.getIndexSignatures();

            if (members.length > 0 || callSignatures.length > 0 || constructSignatures.length > 0 || indexSignatures.length > 0) {
                if (this._inMemberTypeNameEx) {
                    var associatedContainerType = this.getAssociatedContainerType();
                    if (associatedContainerType && associatedContainerType.isNamedTypeSymbol()) {
                        var nameForTypeOf = associatedContainerType.getScopedNameEx(scopeSymbol);
                        return MemberName.create(nameForTypeOf, "typeof ", "");
                    } else {
                        // If recursive without type name(possible?) default to any
                        return MemberName.create("any");
                    }
                }

                this._inMemberTypeNameEx = true;

                var allMemberNames = new MemberNameArray();
                var curlies = !topLevel || indexSignatures.length != 0;
                var delim = "; ";
                for (var i = 0; i < members.length; i++) {
                    if (members[i].kind == PullElementKind.Method && members[i].type.hasOnlyOverloadCallSignatures()) {
                        // Add all Call signatures of the method
                        var methodCallSignatures = members[i].type.getCallSignatures();
                        var nameStr = members[i].getDisplayName(scopeSymbol) + (members[i].isOptional ? "?" : "");;
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

                this._inMemberTypeNameEx = false;

                return allMemberNames;

            }

            return MemberName.create("{}");
        }
    }

    export class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string) {
            super(name, PullElementKind.Primitive);

            this.isResolved = true;
        }

        public isStringConstant() { return false; }

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

        constructor(private anyType: PullTypeSymbol, name: string) {
            super(name);

            this.isResolved = true;
        }

        public isError() {
            return true;
        }

        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.anyType.getName(scopeSymbol, useConstraintInName);
        }

        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string {
            return this.anyType.getName(scopeSymbol, useConstraintInName);
        }

        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean) {
            return this.anyType.getName(scopeSymbol, useConstraintInName);
        }
    }

    // represents the module "namespace" type
    export class PullContainerSymbol extends PullTypeSymbol {
        public instanceSymbol: PullSymbol = null;

        private assignedValue: PullSymbol = null;
        private assignedType: PullTypeSymbol = null;
        private assignedContainer: PullContainerSymbol = null;

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

        public setExportAssignedValueSymbol(symbol: PullSymbol) {
            this.assignedValue = symbol;
        }

        public getExportAssignedValueSymbol() {
            return this.assignedValue;
        }

        public setExportAssignedTypeSymbol(type: PullTypeSymbol) {
            this.assignedType = type;
        }

        public getExportAssignedTypeSymbol() {
            return this.assignedType;
        }

        public setExportAssignedContainerSymbol(container: PullContainerSymbol) {
            this.assignedContainer = container;
        }

        public getExportAssignedContainerSymbol() {
            return this.assignedContainer;
        }

        public resetExportAssignedSymbols() {
            this.assignedValue = null;
            this.assignedType = null;
            this.assignedContainer = null;
        }

        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol): boolean {
            if (!containerSymbol || !containerSymbol.isContainer()) {
                return false;
            }

            if (!containerSymbol.isAlias() && containerSymbol.type == symbol) {
                return true;
            }

            var moduleSymbol = <PullContainerSymbol>containerSymbol;
            var valueExportSymbol = moduleSymbol.getExportAssignedValueSymbol();
            var typeExportSymbol = moduleSymbol.getExportAssignedTypeSymbol();
            var containerExportSymbol = moduleSymbol.getExportAssignedContainerSymbol();
            if (valueExportSymbol || typeExportSymbol || containerExportSymbol) {
                return valueExportSymbol == symbol || typeExportSymbol == symbol || containerExportSymbol == symbol || PullContainerSymbol.usedAsSymbol(containerExportSymbol, symbol);
            }

            return false;
        }

        public getInstanceType() {
            return this.instanceSymbol ? this.instanceSymbol.type : null;
        }
    }

    export class PullTypeAliasSymbol extends PullTypeSymbol {
        public assignedValue: PullSymbol = null;
        public assignedType: PullTypeSymbol = null;
        public assignedContainer: PullContainerSymbol = null;

        public isUsedAsValue = false;
        public typeUsedExternally = false;
        private retrievingExportAssignment = false;

        constructor(name: string) {
            super(name, PullElementKind.TypeAlias);
        }

        public isAlias() { return true; }
        public isContainer() { return true; }

        public setAssignedValueSymbol(symbol: PullSymbol): void {
            this.assignedValue = symbol;
        }

        public getExportAssignedValueSymbol(): PullSymbol {
            if (this.assignedValue) {
                return this.assignedValue;
            }

            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.assignedContainer) {
                this.retrievingExportAssignment = true;
                var sym = this.assignedContainer.getExportAssignedValueSymbol();
                this.retrievingExportAssignment = false;
                return sym;
            }

            return null;
        }

        public setAssignedTypeSymbol(type: PullTypeSymbol): void {
            this.assignedType = type;
        }

        public getExportAssignedTypeSymbol(): PullTypeSymbol {
            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.assignedType) {
                if (this.assignedType.isAlias()) {
                    this.retrievingExportAssignment = true;
                    var sym = (<PullTypeAliasSymbol>this.assignedType).getExportAssignedTypeSymbol();
                    this.retrievingExportAssignment = false;
                } else if (this.assignedType != this.assignedContainer) {
                    return this.assignedType;
                }
            }

            if (this.assignedContainer) {
                this.retrievingExportAssignment = true;
                var sym = this.assignedContainer.getExportAssignedTypeSymbol();
                this.retrievingExportAssignment = false;
                if (sym) {
                    return sym;
                }
            }

            return this.assignedContainer;
        }

        public setAssignedContainerSymbol(container: PullContainerSymbol): void {
            this.assignedContainer = container;
        }

        public getExportAssignedContainerSymbol(): PullContainerSymbol {
            if (this.retrievingExportAssignment) {
                return null;
            }

            if (this.assignedContainer) {
                this.retrievingExportAssignment = true;
                var sym = this.assignedContainer.getExportAssignedContainerSymbol();
                this.retrievingExportAssignment = false;
                if (sym) {
                    return sym;
                }
            }

            return this.assignedContainer;
        }

        public getMembers(): PullSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getMembers();
            }

            return sentinelEmptyArray;
        }

        public getCallSignatures(): PullSignatureSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getCallSignatures();
            }

            return sentinelEmptyArray;
        }

        public getConstructSignatures(): PullSignatureSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getConstructSignatures();
            }

            return sentinelEmptyArray;
        }

        public getIndexSignatures(): PullSignatureSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getIndexSignatures();
            }

            return sentinelEmptyArray;
        }

        public findMember(name: string): PullSymbol {
            if (this.assignedType) {
                return this.assignedType.findMember(name);
            }

            return null;
        }

        public findNestedType(name: string): PullTypeSymbol {
            if (this.assignedType) {
                return this.assignedType.findNestedType(name);
            }

            return null;
        }

        public findNestedContainer(name: string): PullTypeSymbol {
            if (this.assignedType) {
                return this.assignedType.findNestedContainer(name);
            }

            return null;
        }

        public getAllMembers(searchDeclKind: PullElementKind, memberVisibility: GetAllMembersVisiblity): PullSymbol[] {
            if (this.assignedType) {
                return this.assignedType.getAllMembers(searchDeclKind, memberVisibility);
            }

            return sentinelEmptyArray;
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

        constructor(name: string, private _isFunctionTypeParameter: boolean) {
            super(name, PullElementKind.TypeParameter);
        }

        public isTypeParameter() { return true; }
        public isFunctionTypeParameter() { return this._isFunctionTypeParameter; }

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
            return true;          
        }
    }

    // transient type variables...
    // GTODO
    export class PullTypeVariableSymbol extends PullTypeParameterSymbol {

        constructor(name: string, isFunctionTypeParameter: boolean) {
            super(name, isFunctionTypeParameter);
        }

        private tyvarID = globalTyvarID++;

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

    // GTODO
    export function typeWrapsTypeParameter(type: PullTypeSymbol, typeParameter: PullTypeParameterSymbol) {

        if (type.isTypeParameter()) {
            return type == typeParameter;
        }

        if (type.inWrapCheck) {
            return false;
        }

        type.inWrapCheck = true;

        var wrapsType = false;

        var typeArguments = type.getTypeArguments();

        if (typeArguments) {
            for (var i = 0; i < typeArguments.length; i++) {
                if (typeWrapsTypeParameter(typeArguments[i], typeParameter)) {
                    wrapsType = true;
                    break;
                }
            }
        }

        if (!wrapsType) {
            var callSignatures = type.getCallSignatures();
            var constructSignatures = type.getConstructSignatures();
            var indexSignatures = type.getIndexSignatures();

            for (var i = 0; i < callSignatures.length; i++) {
                if (signatureWrapsTypeParameter(callSignatures[i], typeParameter)) {
                    wrapsType = true;
                    break;
                }
            }

            if (!wrapsType) {
                for (var i = 0; i < constructSignatures.length; i++) {
                    if (signatureWrapsTypeParameter(constructSignatures[i], typeParameter)) {
                        wrapsType = true;
                        break;
                    }
                }

                if (!wrapsType) {
                    for (var i = 0; i < indexSignatures.length; i++) {
                        if (signatureWrapsTypeParameter(indexSignatures[i], typeParameter)) {
                            wrapsType = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!wrapsType && (type.kind & (PullElementKind.ObjectType | PullElementKind.ObjectLiteral))) {
            var members = type.getMembers();

            for (var i = 0; i < members.length; i++) {
                if (members[i].type && typeWrapsTypeParameter(members[i].type, typeParameter)) {
                    wrapsType = true;
                    break;
                }
            }
        }

        type.inWrapCheck = false;

        return wrapsType;
    }

    // GTODO
    export function signatureWrapsTypeParameter(signature: PullSignatureSymbol, typeParameter: PullTypeParameterSymbol) {

        if (signature.inWrapCheck) {
            return false;
        }

        var wrapsType = false;

        // parameters
        if (signature.parameters) {
            for (var i = 0; i < signature.parameters.length; i++) {
                if (signature.parameters[i].type) {
                    if (typeWrapsTypeParameter(signature.parameters[i].type, typeParameter)) {

                        wrapsType = true;
                        break;
                    }
                }
            }
        }

        if (!wrapsType) {
            if (signature.returnType) {
                wrapsType = typeWrapsTypeParameter(signature.returnType, typeParameter);
            }
        }

        signature.inWrapCheck = false;

        return wrapsType;
    }

    export function getRootType(typeToSpecialize: PullTypeSymbol) {
        var decl = typeToSpecialize.getDeclarations()[0];

        if (!typeToSpecialize.isGeneric()) {
            return typeToSpecialize;
        }

        // get type from the decl if class or interface (Interface declaration with no name is declaration for object literal)
        return typeToSpecialize.kind == PullElementKind.Class || (typeToSpecialize.kind == PullElementKind.Interface && typeToSpecialize.name != "") ? <PullTypeSymbol>decl.getSymbol().type : typeToSpecialize;
    }

    export var nSpecializationsCreated = 0;
    export var nSpecializedSignaturesCreated = 0;

    export function getIDForTypeSubstitutions(types: PullTypeSymbol[]): string {
        var substitution = "";
        var members: PullSymbol[] = null;

        for (var i = 0; i < types.length; i++) {

            // Cache object types structurally
            if (types[i].kind != PullElementKind.ObjectType) {
                substitution += types[i].pullSymbolIDString + "#";
            }
            else {
                var structure = getIDForTypeSubstitutionsFromObjectType(types[i]);

                if (structure) {
                    substitution += structure;
                }
                else {
                    substitution += types[i].pullSymbolIDString + "#";
                }
            }
        }

        return substitution;
    }

    function getIDForTypeSubstitutionsFromObjectType(type: PullTypeSymbol): string {
        var structure = "";

        if (type.isResolved) {
            var members = type.getMembers();
            if (members && members.length) {
                for (var j = 0; j < members.length; j++) {
                    structure += members[j].name + "@" + getIDForTypeSubstitutions([members[j].type]);
                }
            }

            var callSignatures = type.getCallSignatures();
            if (callSignatures && callSignatures.length) {
                for (var j = 0; j < callSignatures.length; j++) {
                    structure += getIDForTypeSubstitutionFromSignature(callSignatures[j]);
                }
            }

            var constructSignatures = type.getConstructSignatures();
            if (constructSignatures && constructSignatures.length) {
                for (var j = 0; j < constructSignatures.length; j++) {
                    structure += "new" + getIDForTypeSubstitutionFromSignature(constructSignatures[j]);
                }
            }

            var indexSignatures = type.getIndexSignatures();
            if (indexSignatures && indexSignatures.length) {
                for (var j = 0; j < indexSignatures.length; j++) {
                    structure += "[]" + getIDForTypeSubstitutionFromSignature(indexSignatures[j]);
                }
            }
        }

        if (structure !== "") {
            return "{" + structure + "}";
        }

        return null;
    }

    function getIDForTypeSubstitutionFromSignature(signature: PullSignatureSymbol): string {
        var structure = "(";
        var parameters = signature.parameters;
        if (parameters && parameters.length) {
            for (var k = 0; k < parameters.length; k++) {
                structure += parameters[k].name + "@" + getIDForTypeSubstitutions([parameters[k].type]);
            }
        }

        structure += ")" + getIDForTypeSubstitutions([signature.returnType]);
        return structure;
    }

    export enum GetAllMembersVisiblity {
        // All properties of the type regardless of their accessibility level
        all = 0,

        // Only properties that are accessible on a class instance, i.e. public and private members of 
        // the current class, and only public members of any bases it extends
        internallyVisible = 1,

        // Only public members of classes
        externallyVisible = 2,
    }
}