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
    class SymbolArraySet {
        static rtti_id = { id: "Services.SymbolArraySet" };
        private rtti = SymbolArraySet.rtti_id;
        private values: TypeScript.Symbol[];

        constructor() {
            this.values = [];
        }

        public add(sym: TypeScript.Symbol): bool {
            if (this.contains(sym))
                return false;

            this.values.push(sym);
            return true;
        }

        public contains(sym: TypeScript.Symbol): bool {
            return this.values.indexOf(sym) >= 0;
        }

        public forEach(callback: (x: TypeScript.Symbol) => void ): void {
            this.values.forEach(callback);
        }

        public getAll(): TypeScript.Symbol[] {
            return this.values;
        }
    }

    export class SymbolSet {
        private table: TypeScript.IHashTable;

        constructor() {
            this.table = new TypeScript.StringHashTable();
        }

        private isSymbolArraySet(value: any): bool {
            return value.rtti === SymbolArraySet.rtti_id;
        }

        public add(sym: TypeScript.Symbol): bool {
            var key = sym.name;
            var element = this.table.lookup(key);
            if (element === null) {
                this.table.add(key, sym);
                return true;
            }
            else if (this.isSymbolArraySet(element)) {
                return (<SymbolArraySet>element).add(sym);
            }
            else {
                var value: TypeScript.Symbol = element;
                if (value === sym) {
                    return false;
                }
                var arraySet = new SymbolArraySet();
                arraySet.add(value);
                arraySet.add(sym);
                this.table.addOrUpdate(key, arraySet);
                return true;
            }
        }

        public contains(sym: TypeScript.Symbol): bool {
            var key = sym.name;
            var element = this.table.lookup(key);
            if (element === null) {
                return false;
            }
            else if (this.isSymbolArraySet(element)) {
                return (<SymbolArraySet>element).contains(sym);
            }
            else {
                var value: TypeScript.Symbol = element;
                return (value === sym);
            }
        }

        public isEmpty(): bool {
            return this.table.count() === 0;
        }

        public getAll(): TypeScript.Symbol[] {
            var result: TypeScript.Symbol[] = [];
            this.forEach(x => { result.push(x); });
            return result;
        }

        public forEach(callback: (x: TypeScript.Symbol) => void ): void {
            this.table.map((key, element, ctx) => {
                if (element === null) {
                    // Nothing to do
                }
                else if (this.isSymbolArraySet(element)) {
                    (<SymbolArraySet>element).forEach(callback);
                }
                else {
                    callback(<TypeScript.Symbol>element);
                }
            }, null);
        }

        public union(other: SymbolSet): void {
            other.getAll().forEach(x => { this.add(x); });
        }
    }
}
