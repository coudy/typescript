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
    export interface ISymbolTree {
        isClass(sym: TypeScript.Symbol): boolean;
        isInterface(sym: TypeScript.Symbol): boolean;
        isMethod(sym: TypeScript.Symbol): boolean;
        isField(sym: TypeScript.Symbol): boolean;
    }

    export interface ISymbolTreeHost {
        getScripts(): TypeScript.Script[];
    }

    export class SymbolTree implements ISymbolTree {
        private _allTypes: TypeScript.Symbol[];

        constructor (public host: ISymbolTreeHost) {
            this._allTypes = null;
        }

        public getAllTypes(): TypeScript.Symbol[] {
            if (this._allTypes === null) {
                var result = new SymbolSet();
                this.host.getScripts().forEach(script => {
                    // Collect types (class/interface) in "script"
                    TypeScript.walkAST(script, (path, walker) => {
                        if (path.isNameOfClass() || path.isNameOfInterface()) {
                            var sym = (<TypeScript.Identifier>path.ast()).sym;
                            if (sym != null) {
                                if (sym.kind() === TypeScript.SymbolKind.Type) {
                                    var typeSym = <TypeScript.TypeSymbol>sym;
                                    if (this.isClass(typeSym) || this.isInterface(typeSym)) {
                                        result.add(typeSym);
                                    }
                                }
                            }
                        }

                        // Shortcut visitation to skip function bodies, since they don't
                        // currently contain class/interface definition.
                        if (path.isBodyOfFunction()) {
                            walker.options.goChildren = false;
                        }
                    });
                });
                this._allTypes = result.getAll();
            }
            return this._allTypes;
        }

        private isDefinition(sym: TypeScript.Symbol): boolean {
            return this.isClass(sym) || this.isInterface(sym);
        }

        public isClass(sym: TypeScript.Symbol): boolean {
            return sym != null &&
                sym.kind() == TypeScript.SymbolKind.Type &&
                (<TypeScript.TypeSymbol>sym).isClass();
        }

        public isInterface(sym: TypeScript.Symbol): boolean {
            return sym != null &&
                sym.kind() == TypeScript.SymbolKind.Type &&
                sym.declAST != null &&
                sym.declAST.nodeType === TypeScript.NodeType.InterfaceDeclaration;
        }

        public isMethod(sym: TypeScript.Symbol): boolean {
            return sym != null &&
                sym.kind() === TypeScript.SymbolKind.Type &&
                (<TypeScript.TypeSymbol>sym).isMethod;
        }

        public isField(sym: TypeScript.Symbol): boolean {
            return sym != null &&
                sym.kind() === TypeScript.SymbolKind.Field;
        }

        public isStatic(sym: TypeScript.Symbol): boolean {
            return sym != null && sym.isStatic();
        }
    }
}
