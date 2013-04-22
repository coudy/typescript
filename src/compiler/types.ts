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

        // REVIEW: for either of the below, why do we have lists of types and lists of type links?
        // interface can only extend
        public extendsList: Type[];

        // class can also implement
        public implementsList: Type[];

        public elementType: Type;

        public primitiveTypeClass: number = Primitive.None;

        public typeFlags = TypeFlags.None;

        public instanceType: Type;

        // REVIEW: Prune
        public isClass() { return this.instanceType != null; }
        public isArray() { return this.elementType != null; }

        public isString() { return hasFlag(this.primitiveTypeClass, Primitive.String); }

        // REVIEW: No need for this to be a method
        public getTypeName(): string {
            return this.getMemberTypeName("", true, false, null);
        }

        public getScopedTypeNameEx(getPrettyTypeName?: boolean) {
            return this.getMemberTypeNameEx("", true, false, getPrettyTypeName);
        }

        // REVIEW: No need for this to be a method
        public callCount() {
            var total = 0;
            return total;
        }

        // REVIEW: No need for this to be a method
        public getMemberTypeName(prefix: string, topLevel: boolean, isElementType: boolean, getPrettyTypeName?: boolean): string {
            var memberName = this.getMemberTypeNameEx(prefix, topLevel, isElementType, getPrettyTypeName);
            return memberName.toString();
        }

        // REVIEW: No need for this to be a method
        public getMemberTypeNameEx(prefix: string, topLevel: boolean, isElementType: boolean, getPrettyTypeName?: boolean): MemberName {
            if (this.elementType) {
                return MemberName.create(this.elementType.getMemberTypeNameEx(prefix, false, true), "", "[]");
            }
            else {
                if (this.members) {
                    if (hasFlag(this.typeFlags, TypeFlags.BuildingName)) {
                        return MemberName.create("this");
                    }
                    this.typeFlags |= TypeFlags.BuildingName;
                    var builder = "";
                    var allMemberNames = new MemberNameArray();
                    var curlies = isElementType;
                    var memCount = 0;
                    var delim = "; ";
                    if (this.members) {
                        this.members.allMembers.map((key, s, unused) => {
                            var sym = <Symbol>s;
                            if (!hasFlag(sym.flags, SymbolFlags.BuiltIn)) {
                                // Remove the delimiter character from the generated type name, since
                                // our "allMemberNames" array takes care of storing delimiters
                                var typeNameMember = sym.getTypeNameEx();
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
                    var getPrettyFunctionOverload = getPrettyTypeName && !curlies && !this.members;
                    var shortform = !curlies && (signatureCount === 1 || getPrettyFunctionOverload) && topLevel;

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

        public getDocComments(): Comment[] {
            return [];
        }
    }

    export class TypeLink {
        public type: Type = null;
        public ast: AST = null;
    }
}