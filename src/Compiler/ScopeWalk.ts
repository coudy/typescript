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

///<reference path='Typescript.ts' />

module TypeScript {
    export class TypeCollectionContext {
        public script: Script = null;

        constructor (public scopeChain: ScopeChain, public checker: TypeChecker) {
        }
    }

    export function pushTypeCollectionScope(container: Symbol,
        valueMembers: ScopedMembers,
        ambientValueMembers: ScopedMembers,
        enclosedTypes: ScopedMembers,
        ambientEnclosedTypes: ScopedMembers,
        context: TypeCollectionContext,
        thisType: Type,
        classType: Type,
        moduleDecl: ModuleDeclaration) {
        var builder = new SymbolScopeBuilder(valueMembers, ambientValueMembers, enclosedTypes, ambientEnclosedTypes, null, container);
        var chain: ScopeChain = new ScopeChain(container, context.scopeChain, builder);
        chain.thisType = thisType;
        chain.classType = classType;
        chain.moduleDecl = moduleDecl;
        context.scopeChain = chain;
    }

    export function popTypeCollectionScope(context: TypeCollectionContext) {
        context.scopeChain = context.scopeChain.previous;
    }
}