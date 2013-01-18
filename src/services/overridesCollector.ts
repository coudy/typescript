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

///<reference path='typescriptServices.ts' />

module Services {
    export class OverridesCollector {
        constructor (public symbolTree: ISymbolTree) {
        }

        public findMemberOverrides(memberSym: TypeScript.Symbol): SymbolSet {
            return this.findMemberOverridesImpl(memberSym, /*lookInBases:*/true, /*lookInDerived:*/true);
        }

        public findImplementors(sym: TypeScript.Symbol): SymbolSet {
            if (this.symbolTree.isClass(sym) || this.symbolTree.isInterface(sym)) {
                return this.symbolTree.findDerivedTypesTransitiveClosure(<TypeScript.TypeSymbol>sym);
            }
            else if (this.symbolTree.isMethod(sym) || this.symbolTree.isField(sym)) {
                return this.findMemberOverridesImpl(sym, /*lookInBases:*/false, /*lookInDerived:*/true);
            }
            else {
                return new SymbolSet();
            }
        }

        private findMemberOverridesImpl(memberSym: TypeScript.Symbol, lookInBases:bool, lookInDerived:bool): SymbolSet {
            var result = new SymbolSet();
            result.add(memberSym);
            if (memberSym.container === null)
                return result;

            var baseTypes = (lookInBases ? this.symbolTree.findBaseTypesTransitiveClosure(<TypeScript.TypeSymbol>memberSym.container) : new SymbolSet());
            var derivedTypes = (lookInDerived ? this.symbolTree.findDerivedTypesTransitiveClosure(<TypeScript.TypeSymbol>memberSym.container) : new SymbolSet());

            var allTypes = new SymbolSet();
            allTypes.add(memberSym.container);
            allTypes.union(baseTypes);
            allTypes.union(derivedTypes);

            allTypes.getAll().forEach((x) => {
                var override = this.symbolTree.getOverride(<TypeScript.TypeSymbol>x, memberSym);
                if (override !== null) {
                    result.add(override);
                }
            });

            return result;
        }

    }
}
