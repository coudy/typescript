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
    export function instanceCompare(a: Symbol, b: Symbol) {
        if (((a === null) || (!a.isInstanceProperty()))) {
            return b;
        }
        else {
            return a;
        }
    }

    export function instanceFilterStop(s: Symbol) {
        return s.isInstanceProperty();
    }

    export class ScopeSearchFilter {

        constructor (public select: (a: Symbol, b: Symbol) =>Symbol,
                            public stop: (s: Symbol) =>boolean) { }

        public result: Symbol = null;

        public reset() {
            this.result = null;
        }

        public update(b: Symbol): boolean {
            this.result = this.select(this.result, b);
            if (this.result) {
                return this.stop(this.result);
            }
            else {
                return false;
            }
        }
    }

    export var instanceFilter = new ScopeSearchFilter(instanceCompare, instanceFilterStop);
}