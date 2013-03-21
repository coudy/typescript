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

    //
    // An cache entry in HostCache 
    //
    export class HostCacheEntry {
        private _sourceText: TypeScript.IScriptSnapshot;

        constructor(
            private fileName: string,
            private host: ILanguageServiceHost,
            public version: number) {
            this._sourceText = null;
        }
        
        public getScriptSnapshot(): TypeScript.IScriptSnapshot {
            if (this._sourceText === null) {
                this._sourceText = this.host.getScriptSnapshot(this.fileName);
            }

            return this._sourceText;
        }
    }

    //
    // Cache host information about scripts. Should be refreshed 
    // at each language service public entry point, since we don't know when 
    // set of scripts handled by the host changes.
    //
    export class HostCache {
        private map: TypeScript.StringHashTable;

        constructor(public host: ILanguageServiceHost) {
            // script id => script index
            this.map = new TypeScript.StringHashTable();

            var fileNames = this.host.getScriptFileNames();
            for (var i = 0, n = fileNames.length; i < n; i++) {
                var fileName = fileNames[i];
                this.map.add(fileName, new HostCacheEntry(
                    fileName, this.host, this.host.getScriptVersion(fileName)));
            }
        }

        public contains(fileName: string): bool {
            return this.map.lookup(fileName) !== null;
        }

        public getFileNames(): string[]{
            return this.map.getAllKeys();
        }

        public getVersion(fileName: string): number {
            return this.map.lookup(fileName).version;
        }

        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot {
            return this.map.lookup(fileName).getScriptSnapshot();
        }
    }
}