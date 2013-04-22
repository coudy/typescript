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
    export class Continuation {
        public exceptionBlock = -1;
        constructor (public normalBlock: number) { }
    }

    function getBaseTypeLinks(bases: ASTList, baseTypeLinks: TypeLink[]) {
        if (bases) {
            var len = bases.members.length;
            if (!baseTypeLinks) {
                baseTypeLinks = [];
            }
            for (var i = 0; i < len; i++) {
                var baseExpr = bases.members[i];
                var name = baseExpr;
                var typeLink = new TypeLink();
                typeLink.ast = name;
                baseTypeLinks[baseTypeLinks.length] = typeLink;
            }
        }
        return baseTypeLinks;
    }

    function getBases(type: Type, typeDecl: TypeDeclaration) {
        type.extendsTypeLinks = getBaseTypeLinks(typeDecl.extendsList, type.extendsTypeLinks);
        type.implementsTypeLinks = getBaseTypeLinks(typeDecl.implementsList, type.implementsTypeLinks);
    }

    export function createNewConstructGroupForType(type: Type) {
        var signature = new Signature();
        signature.returnType = new TypeLink();
        signature.returnType.type = type.instanceType;
        signature.parameters = [];

        type.construct = new SignatureGroup();
        type.construct.addSignature(signature);     
    }

    export function cloneParentConstructGroupForChildType(child: Type, parent: Type) {
        child.construct = new SignatureGroup();
        var sig: Signature = null;

        if (!parent.construct) {
            createNewConstructGroupForType(parent);
        }

        for (var i = 0; i < parent.construct.signatures.length; i++) { 
            sig = new Signature();
            sig.parameters = parent.construct.signatures[i].parameters;
            sig.nonOptionalParameterCount = parent.construct.signatures[i].nonOptionalParameterCount;
            sig.typeCheckStatus = parent.construct.signatures[i].typeCheckStatus;
            sig.declAST = parent.construct.signatures[i].declAST;
            sig.returnType = new TypeLink();
            sig.returnType.type = child.instanceType;
            child.construct.addSignature(sig);
        }

    }

    export var globalId = "__GLO";

    function findTypeSymbolInScopeChain(name: string, scopeChain: ScopeChain): Symbol {
        var symbol = scopeChain.scope.find(name, false, true);

        if (symbol === null && scopeChain.previous) {
            symbol = findTypeSymbolInScopeChain(name, scopeChain.previous);
        }

        return symbol;
    }
}