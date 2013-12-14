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
                var currentType = <PullTypeSymbol>this._getCurrentSymbol();
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
                            symbol.kind == PullElementKind.Method) {
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
                var memberSymbol = resolver._getNamedPropertySymbolOfAugmentedType(memberName, currentType);
                Debug.assert(memberSymbol && memberSymbol.name == memberName);
                this._pushSymbol(memberSymbol.type);
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
                if (kind == PullElementKind.CallSignature) {
                    signatures = currentType.getCallSignatures();
                }
                else if (kind == PullElementKind.ConstructSignature) {
                    signatures = currentType.getConstructSignatures();
                }
                else {
                    signatures = currentType.getIndexSignatures();
                }

                Debug.assert(signatures && index < signatures.length);
                this._pushSymbol(signatures[index]);
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
                if (currentSymbol.isSignature()) {
                    typeParameters = (<PullSignatureSymbol>currentSymbol).typeParameters;
                } else {
                    Debug.assert(currentSymbol.isType());
                    typeParameters = (<PullTypeSymbol>currentSymbol).getTypeParameters();
                }
                Debug.assert(typeParameters && index < typeParameters.length);
                this._pushSymbol(typeParameters[index].getConstraint());
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
                this._pushSymbol(currentSignature.returnType);
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
                Debug.assert(currentSignature.parameters && iParam < currentSignature.parameters.length);
                this._pushSymbol(currentSignature.getParameterTypeAtIndex(iParam));
            }
        }
        public postWalkParameterType() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }

        public getBothKindOfIndexSignatures(resolver: PullTypeResolver, context: PullTypeResolutionContext, includeAugmentedType: boolean) {
            if (this._canWalkStructure()) {
                return resolver._getBothKindsOfIndexSignatures(<PullTypeSymbol>this._getCurrentSymbol(), context, includeAugmentedType);
            }
            return null;
        }
        public walkIndexSignatureReturnType(indexSigInfo: IndexSignatureInfo, useStringIndexSignature: boolean,
            onlySignature?: boolean) { 
            if (this._canWalkStructure()) {
                var indexSig = useStringIndexSignature ? indexSigInfo.stringSignature : indexSigInfo.numericSignature;
                Debug.assert(indexSig);
                this._pushSymbol(indexSig);
                if (!onlySignature) {
                    this._pushSymbol(indexSig.returnType);
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

        public walkElementType() {
            if (this._canWalkStructure()) {
                var currentType = <PullTypeSymbol>this._getCurrentSymbol();
                Debug.assert(currentType && currentType.isNamedTypeSymbol());
                this._pushSymbol(currentType.getElementType());
            }
        }
        public postWalkElementType() {
            if (this._canWalkStructure()) {
                this._popSymbol();
            }
        }
    }
}