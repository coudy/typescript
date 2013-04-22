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

    // private members are private to the scope
    // public members are public to the scope
    export class ScopedMembers {

        public allMembers: IHashTable;
        public publicMembers: IHashTable;
        public privateMembers: IHashTable;

        constructor (public dualMembers: DualStringHashTable) { 
            this.allMembers = this.dualMembers;
            this.publicMembers = this.dualMembers.primaryTable;
            this.privateMembers = this.dualMembers.secondaryTable;
        }

        // add a public member
        public addPublicMember(key: string, data) { return this.dualMembers.primaryTable.add(key, data); }

        // add a private member 
        public addPrivateMember(key: string, data) { return this.dualMembers.secondaryTable.add(key, data); }
    }

    export enum SymbolKind {
        None,
        Type,
        Field,
        Parameter,
        Variable,
    }

    export class SymbolScope {
        constructor (public container: Symbol) { }
        public printLabel() { return "base"; }
        public getAllSymbolNames(members: boolean): string[]{
            return ["please", "implement", "in", "derived", "classes"];
        }
        public getAllTypeSymbolNames(members: boolean): string[]{
            return ["please", "implement", "in", "derived", "classes"];
        }
        public getAllValueSymbolNames(members: boolean): string[]{
            return ["please", "implement", "in", "derived", "classes"];
        }

        // find in this immediate scope
        public findLocal(name: string, publicOnly: boolean, typespace: boolean): Symbol { return null; }
        // find in value namespace 
        public find(name: string, publicOnly: boolean, typespace: boolean): Symbol { return null; }
        // find symbol that supplies an implementation
        public findImplementation(name: string, publicOnly: boolean, typespace: boolean): Symbol { return null; }
        // restrict the search to ambient values
        public findAmbient(name: string, publicOnly: boolean, typespace: boolean): Symbol { return null; }
        public print(outfile: ITextWriter) {
            if (this.container) {
                outfile.WriteLine(this.printLabel() + " scope with container: " + this.container.name + "...");
            }
            else {
                outfile.WriteLine(this.printLabel() + " scope...");
            }
        }

        public getTable(): IHashTable {
            throw new Error("please implement in derived class");
        }
    }
}