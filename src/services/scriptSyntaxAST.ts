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
    // Encapsulate state about a single script source, with access to token stream and syntax-only AST.
    //
    export class ScriptSyntaxAST { 
        constructor(private logger: TypeScript.ILogger, private script: TypeScript.Script, private sourceText: TypeScript.IScriptSnapshot) {
        }

        public getLogger(): TypeScript.ILogger {
            return this.logger;
        }

        public getScriptFileName(): string {
            return this.script.locationInfo.fileName;
        }

        public getScript(): TypeScript.Script {
            return this.script;
        }

        public getScriptSnapshot(): TypeScript.IScriptSnapshot {
            return this.sourceText;
        }

        public getTokenizationOffset(position: number): number {
            return TypeScript.getTokenizationOffset(this.script, position);
        }

        public getAstPathToPosition(pos: number, options = TypeScript.GetAstPathOptions.Default): TypeScript.AstPath {
            return TypeScript.getAstPathToPosition(this.script, pos, options);
        }
    }
}
