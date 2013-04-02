// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var pullDeclID = 0;
    export var lastBoundPullDeclId = 0;

    export class PullDecl {
        private declType: PullElementKind;

        private declName: string;

        private symbol: PullSymbol = null;

        // use this to store the signature symbol for a function declaration
        private signatureSymbol: PullSignatureSymbol = null;

        private childDecls: PullDecl[] = [];
        private typeParameters: PullDecl[] = [];

        // Mappings from names to decls.  Public only for diffing purposes.
        public childDeclTypeCache: any = new BlockIntrinsics();
        public childDeclValueCache: any = new BlockIntrinsics();
        public childDeclTypeParameterCache: any = new BlockIntrinsics();

        private declID = pullDeclID++;

        private declFlags: PullElementFlags = PullElementFlags.None;

        private span: TextSpan;

        private scriptName: string;

        private diagnostics: IDiagnostic[] = null;

        private parentDecl: PullDecl = null;

        // In the case of classes, initialized modules and enums, we need to track the implicit
        // value set to the constructor or instance type.  We can use this field to make sure that on
        // edits and updates we don't leak the val decl or symbol
        private synthesizedValDecl: PullDecl = null;

        constructor(declName: string, declType: PullElementKind, declFlags: PullElementFlags, span: TextSpan, scriptName: string) {
            this.declName = declName;
            this.declType = declType;
            this.declFlags = declFlags;
            this.span = span;
            this.scriptName = scriptName;
        }

        public getDeclID() { return this.declID; }

        public getName() { return this.declName; }
        public getKind() { return this.declType }

        public setSymbol(symbol: PullSymbol) { this.symbol = symbol; }
        public getSymbol(): PullSymbol { return this.symbol; }

        public setSignatureSymbol(signature: PullSignatureSymbol): void { this.signatureSymbol = signature; }
        public getSignatureSymbol(): PullSignatureSymbol { return this.signatureSymbol; }

        public getFlags(): PullElementFlags { return this.declFlags; }
        public setFlags(flags: PullElementFlags) { this.declFlags = flags; }

        public getSpan(): TextSpan { return this.span; }
        public setSpan(span: TextSpan) { this.span = span; }

        public getScriptName(): string { return this.scriptName; }

        public setValueDecl(valDecl: PullDecl) { this.synthesizedValDecl = valDecl; }
        public getValueDecl() { return this.synthesizedValDecl; }

        public isEqual(other: PullDecl) {
            return  (this.declName == other.declName) &&
                    (this.declType == other.declType) &&
                    (this.declFlags == other.declFlags) &&
                    (this.scriptName == other.scriptName) &&
                    (this.span.start() == other.span.start()) &&
                    (this.span.end() == other.span.end());
        }

        public getParentDecl(): PullDecl {
            return this.parentDecl;
        }

        public setParentDecl(parentDecl: PullDecl) {
            this.parentDecl = parentDecl;
        }

        public addDiagnostic(diagnostic: IDiagnostic) {
            if (!this.diagnostics) {
                this.diagnostics = [];
            }

            //error.adjustOffset(this.span.start());

            this.diagnostics[this.diagnostics.length] = diagnostic;
        }

        public getDiagnostics(): IDiagnostic[] {
            return this.diagnostics;
        }

        public setErrors(diagnostics: PullDiagnostic[]) {
            if (diagnostics) {
                this.diagnostics = [];

                // adjust the spans as we parent the errors to the new decl
                for (var i = 0; i < diagnostics.length; i++) {
                    diagnostics[i].adjustOffset(this.span.start());
                    this.diagnostics[this.diagnostics.length] = diagnostics[i];
                }
            }
        }

        public resetErrors() {
            this.diagnostics = [];
        }

        private getChildDeclCache(declKind: PullElementKind): any {
            return declKind === PullElementKind.TypeParameter
                ? this.childDeclTypeParameterCache
                : hasFlag(declKind, PullElementKind.SomeType)
                    ? this.childDeclTypeCache
                    : this.childDeclValueCache;
        }

        // returns 'true' if the child decl was successfully added
        // ('false' is returned if addIfDuplicate is false and there is a collision)
        public addChildDecl(childDecl: PullDecl): void {
            // check if decl exists
            // merge if necessary

            if (childDecl.getKind() === PullElementKind.TypeParameter) {
                this.typeParameters[this.typeParameters.length] = childDecl;
            }
            else {
                this.childDecls[this.childDecls.length] = childDecl;
            }

            // add to the appropriate cache
            var declName = childDecl.getName();
            var cache = this.getChildDeclCache(childDecl.getKind());
            var childrenOfName = <PullDecl[]>cache[declName];
            if (!childrenOfName) {
                childrenOfName = [];
            }

            childrenOfName.push(childDecl);
            cache[declName] = childrenOfName;
        }

        //public lookupChildDecls(declName: string, declKind: PullElementKind): PullDecl[] {
        //    // find the decl with the optional type
        //    // if necessary, cache the decl
        //    // may be wise to return a chain of decls, or take a parent decl as a parameter
        //    var cache = this.getChildDeclCache(declKind);
        //    var childrenOfName = <PullDecl[]>cache[declName];

        //    return childrenOfName ? childrenOfName : [];
        //}

        // Search for a child decl with the given name.  'isType' is used to specify whether or 
        // not child types or child values are returned.
        public searchChildDecls(declName: string, isType: bool): PullDecl[]{
             // find the decl with the optional type
             // if necessary, cache the decl
             // may be wise to return a chain of decls, or take a parent decl as a parameter
            var cache = isType ? this.childDeclTypeCache : this.childDeclValueCache;
            var cacheVal = <PullDecl[]>cache[declName];

            if (cacheVal) {
                return cacheVal;
            }
            else {
                // If we didn't find it, and they were searchign for types, then also check the 
                // type parameter cache.
                if (isType) {
                    cacheVal = this.childDeclTypeParameterCache[declName];

                    if (cacheVal) {
                        return cacheVal;
                    }
                }

                return [];
            }
         }

        public getChildDecls() { return this.childDecls; }
        public getTypeParameters() { return this.typeParameters; }
    }
}