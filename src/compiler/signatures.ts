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
    export class Signature {
        public hasVariableArgList = false;
        public returnType: TypeLink;
        public parameters: ParameterSymbol[] = null;
        public declAST: FunctionDeclaration = null;
        public typeCheckStatus = TypeCheckStatus.NotStarted;
        public nonOptionalParameterCount = 0;

        public toString() {
            return this.toStringHelper(false, false, null);
        }

        public toStringHelper(shortform: boolean, brackets: boolean, scope: SymbolScope) {
            return this.toStringHelperEx(shortform, brackets, scope).toString();
        }

        public toStringHelperEx(shortform: boolean, brackets: boolean, scope: SymbolScope, prefix: string = ""): MemberNameArray {
            var builder = new MemberNameArray();
            if (brackets) {
                builder.prefix =  prefix + "[";
            }
            else {
                builder.prefix = prefix + "(";
            }

            var paramLen = this.parameters.length;
            var len = this.hasVariableArgList ? paramLen - 1 : paramLen;
            for (var i = 0; i < len; i++) {
                builder.add(MemberName.create(this.parameters[i].name + (this.parameters[i].isOptional() ? "?" : "") + ": "));
                builder.add(this.parameters[i].getType().getScopedTypeNameEx(scope));
                if (i < paramLen - 1) {
                    builder.add(MemberName.create(", "));
                }
            }

            if (this.hasVariableArgList) {
                builder.add(MemberName.create("..." + this.parameters[i].name + ": "));
                builder.add(this.parameters[i].getType().getScopedTypeNameEx(scope));
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

            if (this.returnType.type) {
                 builder.add(this.returnType.type.getScopedTypeNameEx(scope));
            }
            else {
                builder.add(MemberName.create("any"));
            }
            return builder;
        }
    }

    export class SignatureGroup {
        public signatures: Signature[] = [];
        public hasImplementation = true;
        public definitionSignature: Signature = null;
        public hasBeenTypechecked = false;
        public flags: SignatureFlags = SignatureFlags.None;
        public addSignature(signature: Signature) {
            if (this.signatures == null) {
                this.signatures = [];
            }
            this.signatures[this.signatures.length] = signature;
            
            // REVIEW: duplicates should be found within createFunctionSignature,
            // so we won't check for them here
            if (signature.declAST &&
                //!signature.declAST.isOverload &&
                !signature.declAST.isSignature() && 
                !hasFlag(signature.declAST.getFunctionFlags(), FunctionFlags.Ambient) &&
                !hasFlag(signature.declAST.getFunctionFlags(), FunctionFlags.Signature)) {
                this.definitionSignature = signature;
            }
        }

        public toString() { return this.signatures.toString(); }
        public toStrings(prefix: string, shortform: boolean, scope: SymbolScope, getPrettyTypeName? : boolean, useSignature? : Signature) {
            var result : MemberName[] = [];  
            var len = this.signatures.length;
            if (!getPrettyTypeName && len > 1) {
                shortform = false;
            }

            var getMemberNameOfSignature = (signature: Signature) => {
                if (this.flags & SignatureFlags.IsIndexer) {
                    return signature.toStringHelperEx(shortform, true, scope);
                }
                else {
                    return signature.toStringHelperEx(shortform, false, scope, prefix);
                }
            }

            if (useSignature) {
                result.push(getMemberNameOfSignature(useSignature));
            } else {
                for (var i = 0; i < len; i++) {
                    // the definition signature shouldn't be printed if there are overloads
                    if (len > 1 && this.signatures[i] == this.definitionSignature) {
                        continue;
                    }

                    result.push(getMemberNameOfSignature(this.signatures[i]));
                    if (getPrettyTypeName) {
                        break;
                    }
                }
            }

            if (getPrettyTypeName && len > 1) {
                var lastMemberName = <MemberNameArray>result[result.length - 1];
                var overloadString = " (+ " + ((this.definitionSignature != null) ? len - 2 : len - 1) + " overload(s))";
                lastMemberName.add(MemberName.create(overloadString));
            }

            return result;
        }
    }
}