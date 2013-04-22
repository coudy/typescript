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
}