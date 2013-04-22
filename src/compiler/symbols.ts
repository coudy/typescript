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
    export class Symbol {
        public bound = false;
        public container: Symbol;
        public writeable() { return false; }
        public isType(): boolean { return false; }
        public getType(): Type { return null; }
        public flags: SymbolFlags = SymbolFlags.None;
        public refs: Identifier[];
        public isAccessor() { return false; }

        public declAST: AST = null;
        public declModule: ModuleDeclaration = null;  // if child of module, this is the module that declared it

        public passSymbolCreated: number = CompilerDiagnostics.analysisPass;

        constructor(public name: string,
                    public location: number,
                    public length: number,
                    public fileName: string) {
        }

        public isInstanceProperty() {
            return hasFlag(this.flags, SymbolFlags.Property) && (!hasFlag(this.flags, SymbolFlags.ModuleMember));
        }

        public getTypeNameEx(): MemberName {
            return MemberName.create(this.toString());
        }

        public getOptionalNameString() {
            return hasFlag(this.flags, SymbolFlags.Optional) ? "?" : "";
        }

        public pathToRoot() {
            var path: Symbol[] = [];
            var node = this;
            while (node && (node.name != globalId)) {
                path[path.length] = node;
                node = node.container;
            }
            return path;
        }

        public findCommonAncestorPath(b: Symbol): Symbol[] {
            if (this.container === null) {
                return [];
            }
            var aPath = this.container.pathToRoot();
            var bPath: Symbol[];
            if (b) {
                bPath = b.pathToRoot();
            }
            else {
                bPath = [];
            }
            var commonNodeIndex = -1;
            for (var i = 0, aLen = aPath.length; i < aLen; i++) {
                var aNode = aPath[i];
                for (var j = 0, bLen = bPath.length; j < bLen; j++) {
                    var bNode = bPath[j];
                    if (aNode === bNode) {
                        commonNodeIndex = i;
                        break;
                    }
                }
                if (commonNodeIndex >= 0) {
                    break;
                }
            }
            if (commonNodeIndex >= 0) {
                return aPath.slice(0, commonNodeIndex);
            }
            else {
                return aPath;
            }
        }

        // Gets the pretty Name for the symbol withing the scope
        public getPrettyName() {
            return this.name;
        }

        public scopeRelativeName(): string {
            return this.getPrettyName() + this.getOptionalNameString();
        }

        public addRef(identifier: Identifier) {
            if (!this.refs) {
                this.refs = [];
            }
            this.refs[this.refs.length] = identifier;
        }

        public toString() {
            if (this.name) {
                return this.name;
            }
            else {
                return "_anonymous";
            }
        }

        public print(outfile) {
            outfile.Write(this.toString());
        }

        public setType(type: Type) {
            throw new Error("please implement in derived class");
        }

        public kind(): SymbolKind {
            throw new Error("please implement in derived class");
        }

        public getVarDeclFromSymbol() {
            if (this.declAST != null && this.declAST.nodeType === NodeType.VariableDeclarator) {
                return <VariableDeclarator>this.declAST;
            }

            return null;
        }

        public getDocComments() : Comment[] {
            if (this.declAST != null) {
                return this.declAST.getDocComments();
            }

            return [];
        }

        public isStatic() {
            return hasFlag(this.flags, SymbolFlags.Static);
        }
    }
}