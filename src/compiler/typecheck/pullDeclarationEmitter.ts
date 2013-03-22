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

///<reference path='..\typescript.ts' />

module TypeScript {
    export class PullDeclarationEmitter extends DeclarationEmitter {

        private locationInfo: LocationInfo = null;

        constructor(private semanticInfoChain: SemanticInfoChain, emitOptions: EmitOptions, errorReporter: SimpleErrorReporter) {
            super(null, emitOptions, errorReporter);
        }

        private emitTypeSignature(type: PullTypeSymbol) {
            var declarationContainerAst = this.getAstDeclarationContainer();
            var declarationPullSymbol = this.semanticInfoChain.getSymbolForAST(declarationContainerAst, this.locationInfo.fileName);
            var typeNameMembers = type.getScopedNameEx(declarationPullSymbol);
            this.emitTypeNamesMember(typeNameMembers);
        }

        public emitTypeOfBoundDecl(boundDecl: BoundDecl) {
            var pullSymbol = this.semanticInfoChain.getSymbolForAST(boundDecl, this.locationInfo.fileName);
            var type = pullSymbol.getType();
            if (!type) {
                // PULLTODO
                return;
            }
            if (boundDecl.typeExpr || // Specified type expression
                (boundDecl.init && type != this.semanticInfoChain.anyTypeSymbol)) { // Not infered any
                this.declFile.Write(": ");
                this.emitTypeSignature(type);
            }
        }

        public isOverloadedConstructorSignature(funcDecl: FuncDecl) {
            var funcSymbol = this.semanticInfoChain.getSymbolForAST(funcDecl, this.locationInfo.fileName);
            var funcTypeSymbol = funcSymbol.getType();
            var signatures = funcTypeSymbol.getConstructSignatures();
            return signatures && signatures.length > 1;
        }

        public isOverloadedCallSignature(funcDecl: FuncDecl) {
            var funcSymbol = this.semanticInfoChain.getSymbolForAST(funcDecl, this.locationInfo.fileName);
            var funcTypeSymbol = funcSymbol.getType();
            var signatures = funcTypeSymbol.getCallSignatures();
            return signatures && signatures.length > 1;
        }

        public getFirstCallOverloadFuncDecl(funcDecl: FuncDecl) {
            var funcSymbol = this.semanticInfoChain.getSymbolForAST(funcDecl, this.locationInfo.fileName);
            var funcTypeSymbol = funcSymbol.getType();
            var signatures = funcTypeSymbol.getCallSignatures();
            Debug.assert(signatures && signatures.length > 1);
            var firstSignature = signatures[0].isDefinition() ? signatures[1] : signatures[0];
            var firstSignatureDecl = firstSignature.getDeclarations()[0];
            var firstFuncDecl = <FuncDecl>PullHelpers.getASTForDecl(firstSignatureDecl, this.semanticInfoChain);
            return firstFuncDecl;
        }

        public emitReturnTypeOfFuncDecl(funcDecl: FuncDecl) {
            var funcSignature = PullHelpers.getSignatureForFuncDecl(funcDecl, this.semanticInfoChain, this.locationInfo.fileName).signature;
            var returnType = funcSignature.getReturnType();
            if (funcDecl.returnTypeAnnotation ||
                (returnType && returnType != this.semanticInfoChain.anyTypeSymbol)) {
                this.declFile.Write(": ");
                this.emitTypeSignature(returnType);
            }
        }

        public hasGetterAndIsNotGetter(funcDecl: FuncDecl) {
            if (hasFlag(funcDecl.fncFlags, FncFlags.GetAccessor)) {
                return false;
            }

            var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.locationInfo.fileName);
            if (accessorSymbol.getGetter()) {
                return true;
            }

            return false;
        }

        public emitAccessorDeclarationComments(funcDecl: FuncDecl) {
            if (!this.emitOptions.compilationSettings.emitComments) {
                return;
            }

            var accessors = PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain, this.locationInfo.fileName);
            var comments: Comment[] = [];
            if (accessors.getter) {
                comments = comments.concat(accessors.getter.getDocComments());
            }
            if (accessors.setter) {
                comments = comments.concat(accessors.setter.getDocComments());
            }
            this.writeDeclarationComments(comments);
        }

        public emitPropertyTypeOfProperty(funcDecl: FuncDecl) {
            var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.locationInfo.fileName);
            var type = accessorSymbol.getType();
            this.emitTypeSignature(type);
        }

        public emitBaseExpression(bases: ASTList, index: number, useExtendsList: bool) {
            var containerAst = this.getAstDeclarationContainer();
            var containerSymbol = <PullTypeSymbol>this.semanticInfoChain.getSymbolForAST(containerAst, this.locationInfo.fileName);
            var baseType: PullTypeSymbol
            if (useExtendsList) {
                baseType = containerSymbol.getExtendedTypes()[index];
            } else {
                baseType = containerSymbol.getImplementedTypes()[index];
            }
            this.emitTypeSignature(baseType);
        }

        // PULLTODO
        //public ImportDeclarationCallback(pre: bool, importDecl: ImportDeclaration): bool {
        //    if (pre) {
        //        if ((<Script>this.declarationContainerStack[0]).isExternallyVisibleSymbol(importDecl.id.sym)) {
        //            this.emitDeclarationComments(importDecl);
        //            this.emitIndent();
        //            this.declFile.Write("import ");

        //            this.declFile.Write(importDecl.id.text + " = ");
        //            if (importDecl.isDynamicImport) {
        //                this.declFile.WriteLine("module (" + importDecl.getAliasName() + ");");
        //            } else {
        //                this.declFile.WriteLine(importDecl.getAliasName() + ";");
        //            }
        //        }
        //    }

        //    return false;
        //}

        public ScriptCallback(pre: bool, script: Script): bool {
            if (pre) {
                this.locationInfo = script.locationInfo;
            }
            else {
                this.locationInfo = null;
            }
            return super.ScriptCallback(pre, script);
        }
    }
}