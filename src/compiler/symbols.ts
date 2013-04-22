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

    export enum TypeCheckStatus {
        NotStarted,
        Started,
        Finished,
    }

    export class Symbol {
        public bound = false;
        public container: Symbol;
        public isVariable() { return false; }
        public isMember() { return false; }
        public isInferenceSymbol() { return false; }
        public isWith() { return false; }
        public writeable() { return false; }
        public isType(): boolean { return false; }
        public getType(): Type { return null; }
        public flags: SymbolFlags = SymbolFlags.None;
        public refs: Identifier[];
        public isAccessor() { return false; }
        public isObjectLitField = false;

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

        public getTypeNameEx(scope: SymbolScope): MemberName {
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
        public getPrettyName(scopeSymbol: Symbol) {
            return this.name;
        }

        public scopeRelativeName(scope: SymbolScope): string {
            if (scope === null) {
                return this.getPrettyName(null) + this.getOptionalNameString();
            }
            var lca = this.findCommonAncestorPath(scope.container);
            var builder = "";
            for (var i = 0, len = lca.length; i < len; i++) {
                var prettyName = lca[i].getPrettyName(i === len - 1 ? scope.container : lca[i + 1]);
                builder = prettyName + "." + builder;
            }
            builder += this.getPrettyName(len === 0 ? scope.container : lca[0]) + this.getOptionalNameString();
            return builder;
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

    export class ValueLocation {
        public symbol: Symbol;
        public typeLink: TypeLink;
    }

    export class InferenceSymbol extends Symbol {
        constructor (name: string, location: number, length: number, fileName: string) {
            super(name, location, length, fileName);
        }

        public typeCheckStatus = TypeCheckStatus.NotStarted;
        public isInferenceSymbol() { return true; }
        public transferVarFlags(varFlags: VariableFlags) {
            if (hasFlag(varFlags, VariableFlags.Ambient)) {
                this.flags |= SymbolFlags.Ambient;
            }
            if (hasFlag(varFlags, VariableFlags.Constant)) {
                this.flags |= SymbolFlags.Constant;
            }
            if (hasFlag(varFlags, VariableFlags.Static)) {
                this.flags |= SymbolFlags.Static;
            }
            if (hasFlag(varFlags, VariableFlags.Property)) {
                this.flags |= SymbolFlags.Property;
            }
            if (hasFlag(varFlags, VariableFlags.Private)) {
                this.flags |= SymbolFlags.Private;
            }
            if (hasFlag(varFlags, VariableFlags.Public)) {
                this.flags |= SymbolFlags.Public;
            }
            if (hasFlag(varFlags, VariableFlags.Exported)) {
                this.flags |= SymbolFlags.Exported;
            }
        }
    }

    export class TypeSymbol extends InferenceSymbol {
        public additionalLocations: number[];
        public expansions: Type[] = []; // For types that may be "split", keep track of the subsequent definitions
        public expansionsDeclAST: AST[] = [];
        public isDynamic = false;
        public onlyReferencedAsTypeRef: boolean;

        constructor(locName: string, location: number, length: number, fileName: string, public type: Type, optimizeModuleCodeGen: boolean) {
            super(locName, location, length, fileName);
            this.prettyName = this.name;
            this.onlyReferencedAsTypeRef = optimizeModuleCodeGen;
        }

        public addLocation(loc: number) {
            if (!this.additionalLocations) {
                this.additionalLocations = [];
            }
            this.additionalLocations[this.additionalLocations.length] = loc;
        }
        public isMethod = false;
        public aliasLink:ImportDeclaration = null;
        public kind() { return SymbolKind.Type; }
        public isType(): boolean { return true; }
        public getType() { return this.type; }
        public prettyName: string;

        public getTypeNameEx(scope: SymbolScope) {
            return this.type.getMemberTypeNameEx(this.name ? this.name + this.getOptionalNameString() : "", false, false, scope);
        }

        // corresponding instance type if this is a class
        public instanceType: Type;

        public toString() {
            var result = this.type.getTypeName();
            if (this.name) {
                result = this.name + ":" + result;
            }
            return result;
        }

        public isClass() { return this.instanceType != null; }
        public isFunction() { return this.declAST != null && this.declAST.nodeType === NodeType.FunctionDeclaration; }

        // Gets the pretty name of the symbol with respect to symbol of the scope (scopeSymbol)
        // searchTillRoot specifies if the name need to searched in the root path of the scope
        public getPrettyName(scopeSymbol: Symbol) {
            if (!!scopeSymbol && isQuoted(this.prettyName) && this.type.isModuleType()) {
                // Its a dynamic module - and need to be specialized with the scope
                // Check in exported module members in each scope
                var symbolPath = scopeSymbol.pathToRoot();
                var prettyName = this.getPrettyNameOfDynamicModule(symbolPath);
                if (prettyName != null) {
                    return prettyName.name;
                }
            }

            return this.prettyName;
        }

        public getPrettyNameOfDynamicModule(scopeSymbolPath: Symbol[]) {
            var scopeSymbolPathLength = scopeSymbolPath.length;
            var externalSymbol: { name: string; symbol: Symbol; } = null;
            var moduleType: ModuleType;

            if (scopeSymbolPath.length > 0 &&
                scopeSymbolPath[scopeSymbolPathLength - 1].getType().isModuleType() &&
                (<TypeSymbol>scopeSymbolPath[scopeSymbolPathLength - 1]).isDynamic) {

                // Check if submodule is dynamic
                if (scopeSymbolPathLength > 1 &&
                    scopeSymbolPath[scopeSymbolPathLength - 2].getType().isModuleType() &&
                    (<TypeSymbol>scopeSymbolPath[scopeSymbolPathLength - 2]).isDynamic) {
                    moduleType = <ModuleType>scopeSymbolPath[scopeSymbolPathLength - 2].getType();
                    externalSymbol = moduleType.findDynamicModuleName(this.type);

                }

                if (externalSymbol === null) {
                    // Check in this module
                    moduleType = <ModuleType>scopeSymbolPath[scopeSymbolPathLength - 1].getType();
                    externalSymbol = moduleType.findDynamicModuleName(this.type);
                }
            }

            return externalSymbol;
        }

        public getDocComments(): Comment[]{
            var comments : Comment[] = [];
            if (this.declAST != null) {
                comments = comments.concat(this.declAST.getDocComments());
            }

            for (var i = 0; i < this.expansionsDeclAST.length; i++) {
                comments = comments.concat(this.expansionsDeclAST[i].getDocComments());
            }

            return comments;
        }
    }

    export class ParameterSymbol extends InferenceSymbol {
        public name: string;
        public location: number;
        private paramDocComment: string = null;
        public funcDecl: AST = null;
        
        constructor (name: string, location: number, fileName: string,
                          public parameter: ValueLocation) {
            super(name, location, name.length, fileName);

            this.name = name;
            this.location = location;
        }
        public kind() { return SymbolKind.Parameter; }
        public writeable() { return true; }
        public getType() { return this.parameter.typeLink.type; }
        public setType(type: Type) {
            this.parameter.typeLink.type = type;
        }
        public isVariable() { return true; }
        public argsOffset = (-1);
        public isOptional() {
            if (this.parameter && this.parameter.symbol && this.parameter.symbol.declAST) {
                return (<Parameter>this.parameter.symbol.declAST).isOptional;
            }
            else {
                return false;
            }
        }

        public getTypeNameEx(scope: SymbolScope) {
            return MemberName.create(this.getType().getScopedTypeNameEx(scope), this.name + (this.isOptional() ? "?" : "") + ": ", "");
        }

        public toString() { return this.getTypeNameEx(null).toString(); }

        public getParameterDocComments() {
            if (!this.paramDocComment) {
                var parameterComments: string[] = [];
                if (this.funcDecl) {
                    var fncDocComments = this.funcDecl.getDocComments();
                    var paramComment = Comment.getParameterDocCommentText(this.name, fncDocComments);
                    if (paramComment != "") {
                        parameterComments.push(paramComment);
                    }
                }
                var docComments = TypeScript.Comment.getDocCommentText(this.getDocComments());
                if (docComments != "") {
                    parameterComments.push(docComments);
                }
                
                this.paramDocComment = parameterComments.join("\n");
            }

            return this.paramDocComment;
        }

        public fullName(): string {
            return this.name;
        }
    }
}