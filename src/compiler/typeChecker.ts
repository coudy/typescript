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
    export class TypeComparisonInfo {
        public onlyCaptureFirstError = false;
        public flags: TypeRelationshipFlags = TypeRelationshipFlags.SuccessfulComparison;
        public message = "";
        public stringConstantVal: AST = null;
        private indent = 1;
        
        constructor(sourceComparisonInfo?: TypeComparisonInfo) {
            if (sourceComparisonInfo) {
                this.flags = sourceComparisonInfo.flags;
                this.onlyCaptureFirstError = sourceComparisonInfo.onlyCaptureFirstError;
                this.stringConstantVal = sourceComparisonInfo.stringConstantVal;
                this.indent = sourceComparisonInfo.indent + 1;
            }
        }

        public addMessage(message) {
            if (!this.onlyCaptureFirstError && this.message) {
                this.message = getDiagnosticMessage(DiagnosticCode._0__NL__1_TB__2, [this.message, this.indent, message]);
            }
            else {
                this.message = getDiagnosticMessage(DiagnosticCode._0_TB__1, [this.indent, message]);
            }
        }

        public setMessage(message) {
            this.message = getDiagnosticMessage(DiagnosticCode._0_TB__1, [this.indent, message]);
        }
    }

    export interface SignatureData {
        parameters: ParameterSymbol[];
        nonOptionalParameterCount: number;
    }

    export interface ApplicableSignature {
        signature: Signature;
        hadProvisionalErrors: boolean;
    }

    export enum TypeCheckCollectionMode {
        Resident,
        Transient
    }

    export class PersistentGlobalTypeState {
        public importedGlobalsTable = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable()));
        public importedGlobalsTypeTable = new ScopedMembers(new DualStringHashTable(new StringHashTable(), new StringHashTable()));

        public importedGlobals: SymbolScopeBuilder;

        // transient state
        public globals: IHashTable = null;
        public globalTypes: IHashTable = null;
        public ambientGlobals: IHashTable = null;
        public ambientGlobalTypes: IHashTable = null;

        // resident state
        public residentGlobalValues = new StringHashTable();
        public residentGlobalTypes = new StringHashTable();
        public residentGlobalAmbientValues = new StringHashTable();
        public residentGlobalAmbientTypes = new StringHashTable();

        // dual resident/transient state

        // REVIEW: We shouldn't need to allocate private hash tables for these, since there's no private global scope
        // REVIEW: In general, we should audit each instance of DualStringHashTable to ensure that both the primary
        // and secondary tables are necessary.  If it's not necessary, we should sub in a constant sentinel value.
        public dualGlobalValues: DualStringHashTable;
        public dualGlobalTypes: DualStringHashTable;
        public dualAmbientGlobalValues: DualStringHashTable;
        public dualAmbientGlobalTypes: DualStringHashTable;

        public globalScope: SymbolScope;

        public voidType: Type;
        public booleanType: Type;
        public doubleType: Type;

        public stringType: Type;
        public anyType: Type;
        public nullType: Type;
        public undefinedType: Type;

        // Use this flag to turn resident checking on and off
        public residentTypeCheck: boolean = true;

        public mod: ModuleType = null;
        public gloMod: TypeSymbol = null;

        public wildElm: TypeSymbol = null;

        constructor (public errorReporter: ErrorReporter, private compilationSettings: CompilationSettings) {
            this.importedGlobals = new SymbolScopeBuilder(null, this.importedGlobalsTable, null, this.importedGlobalsTypeTable, null, null);

            this.dualGlobalValues = new DualStringHashTable(this.residentGlobalValues, new StringHashTable());
            this.dualGlobalTypes = new DualStringHashTable(this.residentGlobalTypes, new StringHashTable());
            this.dualAmbientGlobalValues = new DualStringHashTable(this.residentGlobalAmbientValues, new StringHashTable());
            this.dualAmbientGlobalTypes = new DualStringHashTable(this.residentGlobalAmbientTypes, new StringHashTable());

            var dualGlobalScopedMembers = new ScopedMembers(new DualStringHashTable(this.dualGlobalValues, new StringHashTable()));
            var dualGlobalScopedAmbientMembers = new ScopedMembers(new DualStringHashTable(this.dualAmbientGlobalValues, new StringHashTable()));
            var dualGlobalScopedEnclosedTypes = new ScopedMembers(new DualStringHashTable(this.dualGlobalTypes, new StringHashTable()));
            var dualGlobalScopedAmbientEnclosedTypes = new ScopedMembers(new DualStringHashTable(this.dualAmbientGlobalTypes, new StringHashTable()));

            this.globalScope = new SymbolScopeBuilder(dualGlobalScopedMembers, dualGlobalScopedAmbientMembers, dualGlobalScopedEnclosedTypes, dualGlobalScopedAmbientEnclosedTypes, this.importedGlobals, null);

            this.voidType = this.enterPrimitive(Primitive.Void, "void");
            this.booleanType = this.enterPrimitive(Primitive.Boolean, "bool");
            this.doubleType = this.enterPrimitive(Primitive.Double, "number");
            this.importedGlobals.ambientEnclosedTypes.addPublicMember("number", this.doubleType.symbol);

            this.stringType = this.enterPrimitive(Primitive.String, "string");
            this.anyType = this.enterPrimitive(Primitive.Any, "any");
            this.nullType = this.enterPrimitive(Primitive.Null, "null");
            this.undefinedType = this.enterPrimitive(Primitive.Undefined, "undefined");

            // shared global state is resident
            this.setCollectionMode(TypeCheckCollectionMode.Resident);

            this.wildElm = new TypeSymbol("_element", -1, 0, ""/*unknownLocationInfo.fileName*/, new Type(), this.compilationSettings.optimizeModuleCodeGen);
            this.importedGlobalsTypeTable.addPublicMember(this.wildElm.name, this.wildElm);

            this.mod = new ModuleType(dualGlobalScopedEnclosedTypes, dualGlobalScopedAmbientEnclosedTypes);
            this.mod.members = dualGlobalScopedMembers;
            this.mod.ambientMembers = dualGlobalScopedAmbientMembers;
            this.mod.containedScope = this.globalScope;

            this.gloMod = new TypeSymbol(globalId, -1, 0, "" /*unknownLocationInfo.fileName*/, this.mod, this.compilationSettings.optimizeModuleCodeGen);
            this.mod.members.addPublicMember(this.gloMod.name, this.gloMod);

            this.defineGlobalValue("undefined", this.undefinedType);
        }

        public enterPrimitive(flags: number, name: string) {
            var primitive = new Type();
            primitive.primitiveTypeClass = flags;
            var symbol = new TypeSymbol(name, -1, name.length, "" /*unknownLocationInfo.fileName*/, primitive, this.compilationSettings.optimizeModuleCodeGen);
            symbol.typeCheckStatus = TypeCheckStatus.Finished;
            primitive.symbol = symbol;
            this.importedGlobals.enter(null, null, symbol, this.errorReporter, true, true, true);
            return primitive;
        }

        public setCollectionMode(mode: TypeCheckCollectionMode) {
            this.residentTypeCheck =
                this.dualGlobalValues.insertPrimary =
                    this.dualGlobalTypes.insertPrimary =
                        this.dualAmbientGlobalValues.insertPrimary =
                            this.dualAmbientGlobalTypes.insertPrimary = mode === TypeCheckCollectionMode.Resident;
        }

        public refreshPersistentState() {
            this.globals = new StringHashTable();
            this.globalTypes = new StringHashTable();
            this.ambientGlobals = new StringHashTable();
            this.ambientGlobalTypes = new StringHashTable();

            // add global types to the global scope
            this.globalTypes.add(this.voidType.symbol.name, this.voidType.symbol);
            this.globalTypes.add(this.booleanType.symbol.name, this.booleanType.symbol);
            this.globalTypes.add(this.doubleType.symbol.name, this.doubleType.symbol);
            this.globalTypes.add("number", this.doubleType.symbol);
            this.globalTypes.add(this.stringType.symbol.name, this.stringType.symbol);
            this.globalTypes.add(this.anyType.symbol.name, this.anyType.symbol);
            this.globalTypes.add(this.nullType.symbol.name, this.nullType.symbol);
            this.globalTypes.add(this.undefinedType.symbol.name, this.undefinedType.symbol);

            this.dualGlobalValues.secondaryTable = this.globals;
            this.dualGlobalTypes.secondaryTable = this.globalTypes;
            this.dualAmbientGlobalValues.secondaryTable = this.ambientGlobals;
            this.dualAmbientGlobalTypes.secondaryTable = this.ambientGlobalTypes;
        }

        public defineGlobalValue(name: string, type: Type) {
            var valueLocation = new ValueLocation();
            valueLocation.typeLink = new TypeLink();
            var sym = new VariableSymbol(name, 0, "" /*unknownLocationInfo.fileName*/, valueLocation);
            sym.setType(type);
            sym.typeCheckStatus = TypeCheckStatus.Finished;
            sym.container = this.gloMod;
            this.importedGlobalsTable.addPublicMember(name, sym);
        }
    }

    export class ContextualTypeContext {
        public targetSig: Signature = null;
        public targetThis: Type = null;
        public targetAccessorType: Type = null;

        constructor (public contextualType: Type,
            public provisional: boolean, public contextID: number) { }
    }
}