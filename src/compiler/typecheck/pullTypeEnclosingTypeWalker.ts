// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\references.ts' />

module TypeScript {
    export interface StartEnclosingTypeWalkerInfo {
        enclosingType: PullTypeSymbol;
        currentSymbols: PullSymbol[];
    }

    export class PullTypeEnclosingTypeWalker {
        public enclosingType: PullTypeSymbol = null;
        private currentSymbols: PullSymbol[] = null;

        public _canWalkStructure() {
            return !!this.enclosingType && this.enclosingType.isGeneric();
        }

        public _getCurrentSymbol() {
            if (this.currentSymbols && this.currentSymbols.length) {
                return this.currentSymbols[this.currentSymbols.length - 1];
            }

            return null;
        }

        public getGenerativeClassification() {
            if (this._canWalkStructure()) {
                var currentType = <PullTypeSymbol>this.currentSymbols[this.currentSymbols.length - 1];
                if (!currentType) {
                    // This may occur if we are trying to walk type parameter in the original declaration
                    return GenerativeTypeClassification.Unknown;
                }
                return currentType.getGenerativeTypeClassification(this.enclosingType);
            }

            return GenerativeTypeClassification.Closed;
        }

        private _pushSymbol(symbol: PullSymbol) {
            return this.currentSymbols.push(symbol);
        }

        private _popSymbol() {
            return this.currentSymbols.pop();
        }

        private _getEnclosingTypeOfNamedType(type: PullTypeSymbol) {
            return PullHelpers.getRootType(type);
        }

        private _setEnclosingTypeOfParentDecl(decl: PullDecl, setSignature: boolean) {
            var parentDecl = decl.getParentDecl();
            if (parentDecl) {
                // Always set signatures in parents
                if (parentDecl.kind & PullElementKind.SomeInstantiatableType) {
                    this._setEnclosingTypeWorker(<PullTypeSymbol>parentDecl.getSymbol(), /*setSignature*/ true);
                } else {
                    this._setEnclosingTypeOfParentDecl(parentDecl, /*setSignature*/ true);
                }

                if (this._canWalkStructure()) {
                    // Update the current decl in the 
                    var symbol = decl.getSymbol();
                    if (symbol) {
                        if (symbol.kind == PullElementKind.Parameter ||
                            symbol.kind == PullElementKind.Property ||
                            symbol.kind == PullElementKind.Method ||
                            symbol.kind == PullElementKind.ConstructorMethod ||
                            symbol.kind == PullElementKind.FunctionExpression) {
                            symbol = symbol.type;
                        }

                        this._pushSymbol(symbol);
                    }

                    // Set signature symbol if asked
                    if (setSignature) {
                        var signature = decl.getSignatureSymbol();
                        if (signature) {
                            this._pushSymbol(signature);
                        }
                    }
                }
            }
        }

        private _setEnclosingTypeWorker(symbol: PullSymbol, setSignature: boolean) {
            if (symbol.isType() && (<PullTypeSymbol>symbol).isNamedTypeSymbol()) {
                this.enclosingType = this._getEnclosingTypeOfNamedType(<PullTypeSymbol>symbol);
                this.currentSymbols = [this.enclosingType];
                return;
            }

            var decls = symbol.getDeclarations();
            for (var i = 0; i < decls.length; i++) {
                var decl = decls[i];
                this._setEnclosingTypeOfParentDecl(decl, setSignature);
                if (this._canWalkStructure()) {
                    return;
                }
            }
        }

        public setCurrentSymbol(symbol: PullSymbol) {
            Debug.assert(this._canWalkStructure());
            this.currentSymbols[this.currentSymbols.length - 1] = symbol;
        }

        public startWalkingType(symbol: PullTypeSymbol): StartEnclosingTypeWalkerInfo {
            var enclosingType = this.enclosingType;
            var currentSymbols = this.currentSymbols;

            var setEnclosingType = !this.enclosingType || symbol.isNamedTypeSymbol();
            if (setEnclosingType) {
                this.enclosingType = null;
                this.currentSymbols = null;
                this.setEnclosingType(symbol);
            }
            return { enclosingType: enclosingType, currentSymbols: currentSymbols };
        }
        public endWalkingType(startedWalkingType: StartEnclosingTypeWalkerInfo) {
            this.enclosingType = startedWalkingType.enclosingType;
            this.currentSymbols = startedWalkingType.currentSymbols;
        }

        public setEnclosingType(symbol: PullSymbol) {
            Debug.assert(!this.enclosingType);
            this._setEnclosingTypeWorker(symbol, symbol.isSignature());
        }

        public walkMemberType(memberName: string, resolver: PullTypeResolver) {
            if (this._canWalkStructure()) {
                var currentType = <PullTypeSymbol>this._getCurrentSymbol();
                var memberSymbol = currentType ? resolver._getNamedPropertySymbolOfAugmentedType(memberName, currentType) : null;
                this._pushSymbol(memberSymbol ? memberSymbol.type : null);
            }
        }
        public postWalkMemberType() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }

        public walkSignature(kind: PullElementKind, index: number) {
            if (this._canWalkStructure()) {
                var currentType = <PullTypeSymbol>this._getCurrentSymbol();
                var signatures: PullSignatureSymbol[];
                if (currentType) {
                    if (kind == PullElementKind.CallSignature) {
                        signatures = currentType.getCallSignatures();
                    }
                    else if (kind == PullElementKind.ConstructSignature) {
                        signatures = currentType.getConstructSignatures();
                    }
                    else {
                        signatures = currentType.getIndexSignatures();
                    }
                }

                this._pushSymbol(signatures ? signatures[index] : null);
            }
        }
        public postWalkSignature() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }

        public walkTypeParameterConstraint(index: number) {
            if (this._canWalkStructure()) {
                var typeParameters: PullTypeParameterSymbol[];
                var currentSymbol = this._getCurrentSymbol();
                if (currentSymbol) {
                    if (currentSymbol.isSignature()) {
                        typeParameters = (<PullSignatureSymbol>currentSymbol).getTypeParameters();
                    } else {
                        Debug.assert(currentSymbol.isType());
                        typeParameters = (<PullTypeSymbol>currentSymbol).getTypeParameters();
                    }
                }
                this._pushSymbol(typeParameters ? typeParameters[index].getConstraint() : null);
            }
        }
        public postWalkTypeParameterConstraint() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }

        public walkReturnType() {
            if (this._canWalkStructure()) {
                var currentSignature = <PullSignatureSymbol>this._getCurrentSymbol();
                this._pushSymbol(currentSignature ? currentSignature.returnType : null);
            }
        }

        public postWalkReturnType() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }

        public walkParameterType(iParam: number) {
            if (this._canWalkStructure()) {
                var currentSignature = <PullSignatureSymbol>this._getCurrentSymbol();
                this._pushSymbol(currentSignature ? currentSignature.getParameterTypeAtIndex(iParam) : null);
            }
        }
        public postWalkParameterType() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }

        public getBothKindOfIndexSignatures(resolver: PullTypeResolver, context: PullTypeResolutionContext, includeAugmentedType: boolean) {
            if (this._canWalkStructure()) {
                var currentType = <PullTypeSymbol>this._getCurrentSymbol();
                if (currentType) {
                    return resolver._getBothKindsOfIndexSignatures(currentType, context, includeAugmentedType);
                }
            }
            return null;
        }
        public walkIndexSignatureReturnType(indexSigInfo: IndexSignatureInfo, useStringIndexSignature: boolean,
            onlySignature?: boolean) {
            if (this._canWalkStructure()) {
                var indexSig = indexSigInfo ? (useStringIndexSignature ? indexSigInfo.stringSignature : indexSigInfo.numericSignature) : null;
                this._pushSymbol(indexSig);
                if (!onlySignature) {
                    this._pushSymbol(indexSig ? indexSig.returnType : null);
                }
            }
        }
        public postWalkIndexSignatureReturnType(onlySignature?: boolean) {
            if (this._canWalkStructure()) {
                if (!onlySignature) {
                    this._popSymbol(); // return type
                }
                this._popSymbol(); // index signature type
            }
        }
    }
}