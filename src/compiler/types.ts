//﻿
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='typescript.ts' />

module TypeScript {

    export enum Primitive {
        None = 0,
        Void = 1,
        Double = 2,
        String = 4,
        Boolean = 8,
        Any = 16,
        Null = 32,
        Undefined = 64,
    }

    export class MemberName {
        public prefix: string = "";
        public suffix: string = "";

        public isString() { return false; }
        public isArray() { return false; }

        public toString(): string {
            return MemberName.memberNameToString(this);
        }

        static memberNameToString(memberName: MemberName): string {
            var result = memberName.prefix;

            if (memberName.isString()) {
                result += (<MemberNameString>memberName).text;
            }
            else {
                var ar = <MemberNameArray>memberName;
                for (var index = 0; index < ar.entries.length; index++) {

                    result += MemberName.memberNameToString(ar.entries[index]);
                    result += ar.delim;
                }
            }

            result += memberName.suffix;
            return result;
        }

        static create(text: string): MemberName;
        static create(entry: MemberName, prefix: string, suffix: string): MemberName;
        static create(arg1: any, arg2?: any, arg3?: any): MemberName {
            if (typeof arg1 === "string") {
                return new MemberNameString(arg1);
            }
            else {
                var result = new MemberNameArray();
                if (arg2)
                    result.prefix = arg2;
                if (arg3)
                    result.suffix = arg3;
                result.entries.push(arg1);
                return result;
            }
        }
    }

    export class MemberNameString extends MemberName {
        constructor(public text: string) {
            super();
        }

        public isString() { return true; }
    }

    export class MemberNameArray extends MemberName {
        public delim: string = "";
        public entries: MemberName[] = [];

        public isArray() { return true; }

        public add(entry: MemberName) {
            this.entries.push(entry);
        }

        public addAll(entries: MemberName[]) {
            for (var i = 0 ; i < entries.length; i++) {
                this.entries.push(entries[i]);
            }
        }

        constructor() {
            super();
        }
    }

    export class Type {
        public members: ScopedMembers;
        public ambientMembers: ScopedMembers;

        public construct: SignatureGroup = null;
        public call: SignatureGroup = null;
        public index: SignatureGroup = null;

        // REVIEW: for either of the below, why do we have lists of types and lists of type links?
        // interface can only extend
        public extendsList: Type[];

        // class can also implement
        public implementsList: Type[];

        public elementType: Type;

        public primitiveTypeClass: number = Primitive.None;

        // REVIEW: Prune constructorScope
        public constructorScope: SymbolScope;
        public containedScope: SymbolScope;

        public typeFlags = TypeFlags.None;

        public symbol: TypeSymbol;

        public instanceType: Type;

        // REVIEW: Prune
        public isClass() { return this.instanceType != null; }
        public isArray() { return this.elementType != null; }
        public isClassInstance() {
            return this.symbol && !this.elementType && (<TypeSymbol>this.symbol).type.isClass();
        }

        public isString() { return hasFlag(this.primitiveTypeClass, Primitive.String); }

        // REVIEW: No need for this to be a method
        public getTypeName(): string {
            return this.getMemberTypeName("", true, false, null);
        }

        public getScopedTypeNameEx(scope: SymbolScope, getPrettyTypeName?: boolean) {
            return this.getMemberTypeNameEx("", true, false, scope, getPrettyTypeName);
        }

        // REVIEW: No need for this to be a method
        public callCount() {
            var total = 0;
            if (this.call) {
                total += this.call.signatures.length;
            }
            if (this.construct) {
                total += this.construct.signatures.length;
            }
            if (this.index) {
                total += this.index.signatures.length;
            }
            return total;
        }

        // REVIEW: No need for this to be a method
        public getMemberTypeName(prefix: string, topLevel: boolean, isElementType: boolean, scope: SymbolScope, getPrettyTypeName?: boolean): string {
            var memberName = this.getMemberTypeNameEx(prefix, topLevel, isElementType, scope, getPrettyTypeName);
            return memberName.toString();
        }

        // REVIEW: No need for this to be a method
        public getMemberTypeNameEx(prefix: string, topLevel: boolean, isElementType: boolean, scope: SymbolScope, getPrettyTypeName?: boolean): MemberName {
            if (this.elementType) {
                return MemberName.create(this.elementType.getMemberTypeNameEx(prefix, false, true, scope), "", "[]");
            }
            else if (this.symbol && this.symbol.name && this.symbol.name != "_anonymous" &&
                     (((this.call === null) && (this.construct === null) && (this.index === null)) ||
                      (hasFlag(this.typeFlags, TypeFlags.BuildingName)) ||
                      (this.members && (!this.isClass())))) {
                var tn = this.symbol.scopeRelativeName(scope);
                return MemberName.create(tn === "null" ? "any" : tn); // REVIEW: GROSS!!!
            }
            else {
                if (this.members || this.call || this.construct) {
                    if (hasFlag(this.typeFlags, TypeFlags.BuildingName)) {
                        return MemberName.create("this");
                    }
                    this.typeFlags |= TypeFlags.BuildingName;
                    var builder = "";
                    var allMemberNames = new MemberNameArray();
                    var curlies = isElementType || this.index != null;
                    var memCount = 0;
                    var delim = "; ";
                    if (this.members) {
                        this.members.allMembers.map((key, s, unused) => {
                            var sym = <Symbol>s;
                            if (!hasFlag(sym.flags, SymbolFlags.BuiltIn)) {
                                // Remove the delimiter character from the generated type name, since
                                // our "allMemberNames" array takes care of storing delimiters
                                var typeNameMember = sym.getTypeNameEx(scope);
                                if (typeNameMember.isArray() && (<MemberNameArray>typeNameMember).delim === delim) {
                                    allMemberNames.addAll((<MemberNameArray>typeNameMember).entries);
                                } else {
                                    allMemberNames.add(typeNameMember);
                                }
                                memCount++;
                                curlies = true;
                            }
                        }, null);
                    }

                    var signatureCount = this.callCount();
                    var j: number;
                    var len = 0;
                    var getPrettyFunctionOverload = getPrettyTypeName && !curlies && this.call && this.call.signatures.length > 1 && !this.members && !this.construct;
                    var shortform = !curlies && (signatureCount === 1 || getPrettyFunctionOverload) && topLevel;
                    if (this.call) {
                        allMemberNames.addAll(this.call.toStrings(prefix, shortform, scope, getPrettyFunctionOverload));
                    }

                    if (this.construct) {
                        allMemberNames.addAll(this.construct.toStrings("new", shortform, scope));
                    }

                    if (this.index) {
                        allMemberNames.addAll(this.index.toStrings("", shortform, scope));
                    }

                    if ((curlies) || (!getPrettyFunctionOverload && (signatureCount > 1) && topLevel)) {
                        allMemberNames.prefix = "{ ";
                        allMemberNames.suffix = "}";
                        allMemberNames.delim = delim;
                    } else if (allMemberNames.entries.length > 1) {
                        allMemberNames.delim = delim;
                    }

                    this.typeFlags &= (~TypeFlags.BuildingName);
                    if ((signatureCount === 0) && (memCount === 0)) {
                        return MemberName.create("{}");
                    }
                    else {
                        return allMemberNames;
                    }
                }
                else {
                    return MemberName.create("{}");
                }
            }
        }

        public hasBase(baseType: Type): boolean {
            if (baseType === this) {
                return true;
            }
            else {
                if (this.extendsList) {
                    for (var i = 0, len = this.extendsList.length; i < len; i++) {
                        if (this.extendsList[i].hasBase(baseType)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        public isModuleType() { return false; }

        public getDocComments(): Comment[]{
            if (this.elementType || !this.symbol) {
                return [];
            }

            if (this.isClassInstance() || this.isClass()) {
                if (this.symbol.declAST.nodeType === NodeType.FunctionDeclaration) {
                    // Its a constructor - use the class declaration instead
                    return (<FunctionDeclaration>this.symbol.declAST).classDecl.getDocComments();
                } else {
                    // Its a class without constructor
                    return this.symbol.getDocComments();
                }
            }

            if (this.symbol.name && this.symbol.name != "_anonymous" &&
                (((this.call === null) && (this.construct === null) && (this.index === null))
                  || this.members)) {
                return this.symbol.getDocComments();
            }

            return [];
        }
    }

    export class ModuleType extends Type {
        public isModuleType() { return true; }
        public importedModules: ImportDeclaration[] = [];

        // Finds the dynamic module name of moduleType in the members
        // ignoreSymbols define list of symbols already visited - to avoid recursion
        static findDynamicModuleNameInHashTable(moduleType: Type, members: IHashTable) {
            var moduleName: { name: string; symbol: Symbol; } = null;
            members.map((key, s, c) => {
                if (moduleName === null && !isQuoted(key)) {
                    var symbol = <Symbol>s;
                    var type = symbol.getType();
                    if (type === moduleType) {
                        // If this is the module type we were looking for
                        moduleName = { name: key, symbol: symbol };
                    }
                }
            }, null);

            return moduleName;
        }

        // Finds the Dynamic module name of the moduleType in this moduleType
        // onlyPublic tells if we are looking for module name in public members only
        public findDynamicModuleName(moduleType: Type): { name: string; symbol: Symbol; } {
            var moduleName: { name: string; symbol: Symbol; } = null;
            // Not cached, so seach and add to the cache
            moduleName = ModuleType.findDynamicModuleNameInHashTable(moduleType, this.members.allMembers);
            if (moduleName === null) {
                moduleName = ModuleType.findDynamicModuleNameInHashTable(moduleType, this.ambientMembers.allMembers);
            }
            return moduleName;
        }
    }

    export class TypeLink {
        public type: Type = null;
        public ast: AST = null;
    }
}