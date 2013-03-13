// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var globalBindingPhase = 0;

    export class PullSymbolBinder {

        private parentChain: PullTypeSymbol[] = [];
        private parentDeclChain: PullDecl[] = [];
        private declPath: string[] = [];

        private bindingPhase = globalBindingPhase++;

        private staticClassMembers: PullSymbol[] = [];

        public semanticInfo: SemanticInfo;

        public reBindingAfterChange = false;
        public startingDeclForRebind = pullDeclID; // note that this gets set on creation
        public startingSymbolForRebind = pullSymbolID; // note that this gets set on creation


        constructor (public semanticInfoChain: SemanticInfoChain) {
        }

        public setUnit(fileName: string) {
            this.semanticInfo = this.semanticInfoChain.getUnit(fileName);
        }

        public getParent(returnInstanceType = false): PullTypeSymbol {
            var parent = this.parentChain ? this.parentChain[this.parentChain.length - 1] : null;

            if (parent && parent.isContainer() && returnInstanceType) {
                var instanceSymbol = (<PullContainerTypeSymbol>parent).getInstanceSymbol();

                if (instanceSymbol) {
                    parent = instanceSymbol.getType();
                }
            }

            return parent;
        }

        public getParentDecl(): PullDecl {
            return this.parentDeclChain.length ? this.parentDeclChain[this.parentDeclChain.length - 1] : null;
        }

        public getDeclPath() { return this.declPath; }

        public pushParent(parentType: PullTypeSymbol, parentDecl: PullDecl) { 
            if (parentType) { 
                this.parentChain[this.parentChain.length] = parentType;
                this.parentDeclChain[this.parentDeclChain.length] = parentDecl;
                this.declPath[this.declPath.length] = parentType.getName();
            } 
        }

        public popParent() {
            if (this.parentChain.length) {
                this.parentChain.length--;
                this.parentDeclChain.length--;
                this.declPath.length--;
            }
        }

        public findSymbolInContext(name: string, declKind: PullElementKind, typeLookupPath: string[]): PullSymbol {
            var startTime = new Date().getTime();
            var contextSymbolPath: string[] = this.getDeclPath();
            var nestedSymbolPath: string[] = [];
            var copyOfContextSymbolPath = [];
            var symbol: PullSymbol = null;

            var i = 0;
            var endTime = 0;


            // first, search within the given symbol path
            if (typeLookupPath.length) {

                for (i = 0; i < typeLookupPath.length; i++) {
                    nestedSymbolPath[nestedSymbolPath.length] = typeLookupPath[i];
                }

                nestedSymbolPath[nestedSymbolPath.length] = name;

                while (nestedSymbolPath.length >= 2) {
                    symbol = this.semanticInfoChain.findSymbol(nestedSymbolPath, declKind);

                    if (symbol) {
                        endTime = new Date().getTime();
                        time_in_findSymbol += endTime - startTime;

                        return symbol;
                    }
                    nestedSymbolPath.length -= 2;
                    nestedSymbolPath[nestedSymbolPath.length] = name;
                }
            }

            // next, link back up to the enclosing context
            if (contextSymbolPath.length) {
            
                for (i = 0; i < contextSymbolPath.length; i++) {
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = contextSymbolPath[i];
                }

                for (i = 0; i < typeLookupPath.length; i++) {
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = typeLookupPath[i];
                }

                copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;

                while (copyOfContextSymbolPath.length >= 2) {
                    symbol = this.semanticInfoChain.findSymbol(copyOfContextSymbolPath, declKind);

                    if (symbol) {
                        endTime = new Date().getTime();
                        time_in_findSymbol += endTime - startTime;

                        return symbol;
                    }
                    copyOfContextSymbolPath.length -= 2;
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;
                }
            }

            // finally, try searching globally
            symbol = this.semanticInfoChain.findSymbol([name], declKind);

            endTime = new Date().getTime();
            time_in_findSymbol += endTime - startTime;

            return symbol;
        }


        private recordNonInterfaceParentModule() {
            var parent = this.getParent();

            var ast = this.semanticInfo.getASTForSymbol(parent);
            if (ast && ast.nodeType == NodeType.ModuleDeclaration) {
                (<ModuleDeclaration>ast).recordNonInterface();
            }
        }

        public symbolIsRedeclaration(sym: PullSymbol): bool {
            var symID = sym.getSymbolID();
            return (symID > this.startingSymbolForRebind) || 
                    ((sym.getRebindingID() == this.bindingPhase) && (symID != this.startingSymbolForRebind));
        }

        //
        // decl binding
        //

        public bindModuleDeclarationToPullSymbol(moduleContainerDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
        
            var modName = moduleContainerDecl.getName();

            var moduleContainerTypeSymbol: PullContainerTypeSymbol = null;
            var moduleInstanceSymbol: PullSymbol = null;
            var moduleInstanceTypeSymbol: PullTypeSymbol = null;

            var moduleInstanceDecl: PullDecl = moduleContainerDecl.getValueDecl();

            var parent = this.getParent();
            var parentInstanceSymbol = this.getParent(true);
            var moduleAST = <ModuleDeclaration>this.semanticInfo.getASTForDecl(moduleContainerDecl);

            var createdNewSymbol = false;
            var i = 0;

            if (parent) {
                moduleContainerTypeSymbol = <PullContainerTypeSymbol>parent.findNestedType(modName);
            }
            else if (!(moduleContainerDecl.getFlags() & PullElementFlags.Exported)) {
                moduleContainerTypeSymbol = <PullContainerTypeSymbol>this.findSymbolInContext(modName, PullElementKind.SomeType, []);
            }

            if (moduleContainerTypeSymbol && moduleContainerTypeSymbol.getKind() != PullElementKind.Container) {
                // duplicate symbol error
                moduleContainerDecl.addError(new PullError(moduleAST.minChar, moduleAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [modName])));

                moduleContainerTypeSymbol = null;
            }

            if (moduleContainerTypeSymbol) {
                moduleInstanceSymbol = moduleContainerTypeSymbol.getInstanceSymbol();
            }
            else { 
                moduleContainerTypeSymbol = new PullContainerTypeSymbol(modName);
                createdNewSymbol = true;
            }

            if (!moduleInstanceSymbol && (moduleContainerDecl.getFlags() & PullElementFlags.InitializedModule)) {
                moduleInstanceTypeSymbol = new PullTypeSymbol(modName, PullElementKind.ObjectType);
                moduleInstanceTypeSymbol.addDeclaration(moduleContainerDecl);

                moduleInstanceTypeSymbol.setAssociatedContainerType(moduleContainerTypeSymbol);

                // The instance symbol is further set up in bindVariableDeclaration
                moduleInstanceSymbol = new PullSymbol(modName, PullElementKind.Variable);
                moduleInstanceSymbol.setType(moduleInstanceTypeSymbol);
                moduleInstanceSymbol.addDeclaration(moduleContainerDecl);

                moduleContainerTypeSymbol.setInstanceSymbol(moduleInstanceSymbol);
            }            

            moduleContainerTypeSymbol.addDeclaration(moduleContainerDecl);
            moduleContainerDecl.setSymbol(moduleContainerTypeSymbol);

            this.semanticInfo.setSymbolForAST(moduleAST.name, moduleContainerTypeSymbol);
            this.semanticInfo.setSymbolForAST(moduleAST, moduleContainerTypeSymbol);

            if (createdNewSymbol) {

                if (parent) {
                    var linkKind = moduleContainerDecl.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                    if (linkKind == SymbolLinkKind.PublicMember) {
                        parent.addMember(moduleContainerTypeSymbol, linkKind);

                        if (moduleInstanceSymbol && parentInstanceSymbol && (parentInstanceSymbol != moduleInstanceSymbol)) {
                            parentInstanceSymbol.addMember(moduleInstanceSymbol, linkKind);
                        }
                    }
                    else {
                        moduleContainerTypeSymbol.setContainer(parent);

                        if (moduleInstanceSymbol && parentInstanceSymbol && (parentInstanceSymbol != moduleInstanceSymbol)) {
                            moduleInstanceSymbol.setContainer(parentInstanceSymbol);
                        }
                    }

                    this.recordNonInterfaceParentModule();
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = moduleContainerTypeSymbol.getDeclarations();
                var scriptName = moduleContainerDecl.getScriptName();

                for (i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        moduleContainerTypeSymbol.removeDeclaration(decls[i]);
                    }
                }

                if (moduleInstanceSymbol) {
                    decls = moduleInstanceSymbol.getDeclarations();

                    for (i = 0; i < decls.length; i++) {
                        if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                            moduleInstanceSymbol.removeDeclaration(decls[i]);
                        }
                    }

                    moduleInstanceTypeSymbol = moduleInstanceSymbol.getType();

                    decls = moduleInstanceTypeSymbol.getDeclarations();

                    for (i = 0; i < decls.length; i++) {
                        if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                            moduleInstanceTypeSymbol.removeDeclaration(decls[i]);
                        }
                    }

                    // add the current module decl to the declaration list, to make up for the ones we just deleted
                    moduleInstanceTypeSymbol.addDeclaration(moduleContainerDecl);

                    moduleInstanceSymbol.invalidate();
                }

                moduleContainerTypeSymbol.invalidate();
            }

            this.pushParent(moduleContainerTypeSymbol, moduleContainerDecl);

            var childDecls = moduleContainerDecl.getChildDecls();

            for (i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        // enums
        public bindEnumDeclarationToPullSymbol(enumDeclaration: PullDecl) {
            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
            var enumName = enumDeclaration.getName();
            var enumSymbol = <PullTypeSymbol>this.findSymbolInContext(enumName, PullElementKind.Enum, []);

            var enumAST = <ModuleDeclaration>this.semanticInfo.getASTForDecl(enumDeclaration);
            var createdNewSymbol = false;
            var parent = this.getParent();

            var i = 0;

            if (parent) {
                enumSymbol = parent.findNestedType(enumName);
            }
            else if (!(enumDeclaration.getFlags() & PullElementFlags.Exported)) {
                enumSymbol = <PullTypeSymbol>this.findSymbolInContext(enumName, PullElementKind.SomeType, []);
            }

            if (enumSymbol && (enumSymbol.getKind() != PullElementKind.Enum || !this.reBindingAfterChange || this.symbolIsRedeclaration(enumSymbol))) {
                enumDeclaration.addError(new PullError(enumAST.minChar, enumAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [enumName])));
                enumSymbol = null;
            }

            if (!enumSymbol) {
                enumSymbol = new PullTypeSymbol(enumName, PullElementKind.Enum);

                enumSymbol.addDeclaration(enumDeclaration);
                enumDeclaration.setSymbol(enumSymbol);

                createdNewSymbol = true;
            }

            enumSymbol.addDeclaration(enumDeclaration);
            enumDeclaration.setSymbol(enumSymbol);            
            
            this.semanticInfo.setSymbolForAST(enumAST.name, enumSymbol);
            this.semanticInfo.setSymbolForAST(enumAST, enumSymbol);
        
            if (createdNewSymbol) {

                if (parent) {
                    var linkKind = enumDeclaration.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                    if (linkKind == SymbolLinkKind.PublicMember) {
                        parent.addMember(enumSymbol, linkKind);
                    }
                    else {
                        enumSymbol.setContainer(parent);
                    }
                    this.recordNonInterfaceParentModule();
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = enumSymbol.getDeclarations();
                var scriptName = enumDeclaration.getScriptName();

                for (i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        enumSymbol.removeDeclaration(decls[i]);
                    }
                }

                enumSymbol.invalidate();
            }

            this.pushParent(enumSymbol, enumDeclaration);

            var childDecls = enumDeclaration.getChildDecls();

            for (i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();

            enumSymbol.setIsBound(this.bindingPhase);
        }

        // classes
        public bindClassDeclarationToPullSymbol(classDecl: PullDecl) {

            var className = classDecl.getName();
            var classSymbol: PullClassTypeSymbol = null;

            var constructorSymbol: PullSymbol = null;
            var constructorTypeSymbol: PullConstructorTypeSymbol = null;

            var classAST = <ClassDeclaration>this.semanticInfo.getASTForDecl(classDecl);
            var parentHadSymbol = false;

            var parent = this.getParent();
            var cleanedPreviousDecls = false;

            var i = 0;
            var j = 0;

            if (parent) {
                classSymbol = <PullClassTypeSymbol>parent.findNestedType(className);
            }
            else if (!(classDecl.getFlags() & PullElementFlags.Exported)) {
                classSymbol = <PullClassTypeSymbol>this.findSymbolInContext(className, PullElementKind.SomeType, []);
            }

            if (classSymbol && (classSymbol.getKind() != PullElementKind.Class || !this.reBindingAfterChange || this.symbolIsRedeclaration(classSymbol))) {
                classDecl.addError(new PullError(classAST.minChar, classAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [className])));
                classSymbol = null;
            }
            else if (classSymbol) {
                parentHadSymbol = true;
            }

            var decls: PullDecl[];

            if (this.reBindingAfterChange && classSymbol) {

                // prune out-of-date decls
                decls = classSymbol.getDeclarations();
                var scriptName = classDecl.getScriptName();

                for (j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        classSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                constructorSymbol = classSymbol.getConstructorMethod();
                constructorTypeSymbol = <PullConstructorTypeSymbol>constructorSymbol.getType();

                decls = constructorSymbol.getDeclarations();

                for (j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        constructorSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (constructorSymbol.getIsSynthesized()) {
                    constructorSymbol.addDeclaration(classDecl);
                }

                if (classSymbol.isGeneric()) {
                    //classSymbol.invalidateSpecializations();
                    
                    var specializations = classSymbol.getKnownSpecializations();
                    var specialization: PullTypeSymbol = null;

                    for (i = 0; i < specializations.length; i++) {
                        specialization = specializations[i];

                        decls = specialization.getDeclarations();

                        for (j = 0; j < decls.length; j++) {
                            if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                                specialization.removeDeclaration(decls[j]);

                                cleanedPreviousDecls = true;
                            }
                        }

                        specialization.addDeclaration(classDecl);
                    }

                    classSymbol.cleanTypeParameters();
                    constructorTypeSymbol.cleanTypeParameters();
                }

                classSymbol.setUnresolved();
                constructorSymbol.setUnresolved();
                constructorTypeSymbol.setUnresolved();
            }

            if (!parentHadSymbol) {
                classSymbol = new PullClassTypeSymbol(className);
            }        
        
            classSymbol.addDeclaration(classDecl);
            
            classDecl.setSymbol(classSymbol);

            this.semanticInfo.setSymbolForAST(classAST.name, classSymbol);
            this.semanticInfo.setSymbolForAST(classAST, classSymbol);
        
            if (parent && !parentHadSymbol) {
                var linkKind = classDecl.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                if (linkKind == SymbolLinkKind.PublicMember) {
                    parent.addMember(classSymbol, linkKind);
                }
                else {
                    classSymbol.setContainer(parent);
                }
                this.recordNonInterfaceParentModule();
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            // PULLTODO: For now, classes should have none of these, though a pre-existing constructor might
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = classSymbol.getCallSignatures();
                var constructSigs = classSymbol.getConstructSignatures();
                var indexSigs = classSymbol.getIndexSignatures();

                for (i = 0; i < callSigs.length; i++) {
                    classSymbol.removeCallSignature(callSigs[i], false);
                }
                for (i = 0; i < constructSigs.length; i++) {
                    classSymbol.removeConstructSignature(constructSigs[i], false);
                }
                for (i = 0; i < indexSigs.length; i++) {
                    classSymbol.removeIndexSignature(indexSigs[i], false);
                }

                constructorSymbol = classSymbol.getConstructorMethod();
                constructorTypeSymbol = <PullConstructorTypeSymbol>(constructorSymbol ? constructorSymbol.getType() : null);

                if (constructorTypeSymbol) {
                    constructSigs = constructorTypeSymbol.getConstructSignatures();

                    for (i = 0; i < constructSigs.length; i++) {
                        constructorTypeSymbol.removeConstructSignature(constructSigs[i], false);
                    }
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                classSymbol.invalidate();
            }

            this.pushParent(classSymbol, classDecl);

            var childDecls = classDecl.getChildDecls();

            for (i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();

            // create the default constructor symbol, if necessary

            // even if we've already tried to set these, we want to try again after we've walked the class members
            constructorSymbol = classSymbol.getConstructorMethod();
            constructorTypeSymbol = <PullConstructorTypeSymbol>(constructorSymbol ? constructorSymbol.getType() : null);

            if (!constructorSymbol) {
                constructorSymbol = new PullSymbol(className, PullElementKind.ConstructorMethod);
                constructorTypeSymbol = new PullConstructorTypeSymbol();

                constructorSymbol.setIsSynthesized();

                constructorSymbol.setType(constructorTypeSymbol);
                constructorSymbol.addDeclaration(classDecl);
                classSymbol.setConstructorMethod(constructorSymbol);

                constructorTypeSymbol.addDeclaration(classDecl);

                classSymbol.setHasDefaultConstructor();

                if (!classAST.extendsList || !classAST.extendsList.members.length) {
                    var constructorSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);
                    constructorSignature.setReturnType(classSymbol);
                    constructorTypeSymbol.addConstructSignature(constructorSignature);
                    constructorSignature.addDeclaration(classDecl);
                }

                // set the class decl's AST to the class declaration
                this.semanticInfo.setASTForDecl(classDecl, classAST);
            }

            constructorTypeSymbol.setAssociatedContainerType(classSymbol);

            // bind statics to the constructor symbol
            if (this.staticClassMembers.length) {
                var member: PullSymbol;
                var isPrivate = false;
                
                for (i = 0; i < this.staticClassMembers.length; i++) {

                    member = this.staticClassMembers[i];
                    decls = member.getDeclarations();
                    isPrivate = (decls[0].getFlags() & PullElementFlags.Private) != 0;

                    constructorTypeSymbol.addMember(member, isPrivate ? SymbolLinkKind.PrivateMember : SymbolLinkKind.PublicMember);
                }

                this.staticClassMembers.length = 0;
            }

            var typeParameters = classDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            // PULLREVIEW: Now that we clean type paramters, searching is redundant
            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = classSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    classSymbol.addMember(typeParameter, SymbolLinkKind.TypeParameter);
                    constructorTypeSymbol.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

            classSymbol.setIsBound(this.bindingPhase);
        }

        // interfaces
        public bindInterfaceDeclarationToPullSymbol(interfaceDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
            var interfaceName = interfaceDecl.getName();
            var interfaceSymbol: PullTypeSymbol = <PullTypeSymbol>this.findSymbolInContext(interfaceName, PullElementKind.SomeType, []);

            var interfaceAST = <TypeDeclaration>this.semanticInfo.getASTForDecl(interfaceDecl);
            var createdNewSymbol = false;
            var parent = this.getParent();

            var i = 0;
            var j = 0;

            if (parent) {
                interfaceSymbol = parent.findNestedType(interfaceName);
            }
            else if (!(interfaceDecl.getFlags() & PullElementFlags.Exported)) {
                interfaceSymbol = <PullClassTypeSymbol>this.findSymbolInContext(interfaceName, PullElementKind.SomeType, []);
            }

            if (interfaceSymbol && (interfaceSymbol.getKind() != PullElementKind.Interface)) {
                interfaceDecl.addError(new PullError(interfaceAST.minChar, interfaceAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [interfaceName])));
                interfaceSymbol = null;
            }

            if (!interfaceSymbol) {
                interfaceSymbol = new PullTypeSymbol(interfaceName, PullElementKind.Interface);
                createdNewSymbol = true;
            }

            interfaceSymbol.addDeclaration(interfaceDecl);
            interfaceDecl.setSymbol(interfaceSymbol);

            this.semanticInfo.setSymbolForAST(interfaceAST.name, interfaceSymbol);
            this.semanticInfo.setSymbolForAST(interfaceAST, interfaceSymbol);

            if (createdNewSymbol) {

                if (parent) {
                    var linkKind = interfaceDecl.getFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;
                
                    if (linkKind == SymbolLinkKind.PublicMember) {
                        parent.addMember(interfaceSymbol, linkKind);
                    }
                    else {
                        interfaceSymbol.setContainer(parent);
                    }
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = interfaceSymbol.getDeclarations();
                var scriptName = interfaceDecl.getScriptName();

                for (i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        interfaceSymbol.removeDeclaration(decls[i]);
                    }
                }

                if (interfaceSymbol.isGeneric()) {

                    //interfaceSymbol.invalidateSpecializations();
                    
                    var specializations = interfaceSymbol.getKnownSpecializations();
                    var specialization: PullTypeSymbol = null;

                    for (i = 0; i < specializations.length; i++) {
                        specialization = specializations[i];

                        decls = specialization.getDeclarations();

                        for (j = 0; j < decls.length; j++) {
                            if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                                specialization.removeDeclaration(decls[j]);
                            }
                        }

                        specialization.addDeclaration(interfaceDecl);
                    }

                    interfaceSymbol.cleanTypeParameters();

                    interfaceSymbol.setUnresolved();
                }
            }

            this.pushParent(interfaceSymbol, interfaceDecl);

            var childDecls = interfaceDecl.getChildDecls();

            for (i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();

            var typeParameters = interfaceDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            // PULLREVIEW: Now that we clean type paramters, searching is redundant
            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = interfaceSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    interfaceSymbol.addMember(typeParameter, SymbolLinkKind.TypeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }
        }

        public bindObjectTypeDeclarationToPullSymbol(objectDecl: PullDecl) {
            var objectSymbolAST: AST = this.semanticInfo.getASTForDecl(objectDecl);

            var objectSymbol = new PullTypeSymbol("{}", PullElementKind.ObjectType);

            objectSymbol.addDeclaration(objectDecl);
            objectDecl.setSymbol(objectSymbol);

            this.semanticInfo.setSymbolForAST(objectSymbolAST, objectSymbol);        

            this.pushParent(objectSymbol, objectDecl);

            var childDecls = objectDecl.getChildDecls();

            var i = 0;

            for (i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();

            var typeParameters = objectDecl.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = objectSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    objectSymbol.addMember(typeParameter, SymbolLinkKind.TypeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }

        }

        public bindConstructorTypeDeclarationToPullSymbol(constructorTypeDeclaration: PullDecl) {
            var declKind = constructorTypeDeclaration.getKind();
            var declFlags = constructorTypeDeclaration.getFlags();
            var constructorTypeAST = this.semanticInfo.getASTForDecl(constructorTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var constructorTypeSymbol = new PullConstructorTypeSymbol();
            
            constructorTypeDeclaration.setSymbol(constructorTypeSymbol);
            constructorTypeSymbol.addDeclaration(constructorTypeDeclaration);
            this.semanticInfo.setSymbolForAST(constructorTypeAST, constructorTypeSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            signature.addDeclaration(constructorTypeDeclaration);
            constructorTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(constructorTypeDeclaration), constructorTypeSymbol, signature);

            // add the implicit construct member for this function type
            constructorTypeSymbol.addSignature(signature);

            var typeParameters = constructorTypeDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = constructorTypeSymbol.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    constructorTypeSymbol.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            
        }

        // variables
        public bindVariableDeclarationToPullSymbol(variableDeclaration: PullDecl) {
            var declFlags = variableDeclaration.getFlags();
            var declKind = variableDeclaration.getKind();
            var varDeclAST = <VarDecl>this.semanticInfo.getASTForDecl(variableDeclaration);

            var isExported = false;

            var linkKind = SymbolLinkKind.PrivateMember;

            var variableSymbol: PullSymbol = null;

            var declName = variableDeclaration.getName();

            var parentHadSymbol = false;

            var parent = this.getParent(true);

            var i = 0;

            // The code below accounts for the variable symbol being a type because
            // modules may create instance variables

            if (parent) {
                variableSymbol = parent.findMember(declName);

                if (!variableSymbol) {
                    variableSymbol = parent.findContainedMember(declName);
                    var parentDecl = this.getParentDecl();

                    if (variableSymbol && (parentDecl != variableSymbol.getDeclarations()[0].getParentDecl())) {
                        variableSymbol = null;
                    }
                }

            }
            else if (!(variableDeclaration.getFlags() & PullElementFlags.Exported)) {
                variableSymbol = this.findSymbolInContext(declName, PullElementKind.SomeValue, []);
            }

            if (variableSymbol && !variableSymbol.isType()) {
                parentHadSymbol = true;
            }

            var span: TextSpan;
            var decl: PullDecl;
            var decls: PullDecl[];
            var ast: AST;
            var members: PullSymbol[];
            
            // PULLTODO: Keeping these two error clauses separate for now, so that we can add a better error message later
            if (variableSymbol && this.symbolIsRedeclaration(variableSymbol)) {
                // if it's an implicit variable, then this variable symbol will actually be a class constructor
                // or container type that was just defined, so we don't want to raise an error
                if ((declFlags & PullElementFlags.ImplicitVariable) == 0) {
                    span = variableDeclaration.getSpan();

                    variableDeclaration.addError(new PullError(span.start(), span.length(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [declName])));
                    variableSymbol = null;
                    parentHadSymbol = false;
                 }
             }
             else if (variableSymbol && (variableSymbol.getKind() != PullElementKind.Variable) && ((declFlags & PullElementFlags.ImplicitVariable) == 0)) {
                span = variableDeclaration.getSpan();

                variableDeclaration.addError(new PullError(span.start(), span.length(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [declName])));
                variableSymbol = null;
                parentHadSymbol = false;                
             }

            if (this.reBindingAfterChange && variableSymbol && !variableSymbol.isType()) {
   
                // prune out-of-date decls...
                decls = variableSymbol.getDeclarations();
                var scriptName = variableDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        variableSymbol.removeDeclaration(decls[j]);
                    }
                }

                variableSymbol.invalidate();
            }

            if ((declFlags & PullElementFlags.ImplicitVariable) == 0) {
                if (!variableSymbol) {
                    variableSymbol = new PullSymbol(declName, declKind);
                }

                variableSymbol.addDeclaration(variableDeclaration);
                variableDeclaration.setSymbol(variableSymbol);

                this.semanticInfo.setSymbolForAST(varDeclAST.id, variableSymbol);
                this.semanticInfo.setSymbolForAST(varDeclAST, variableSymbol);
            }
            else if (!parentHadSymbol) {

                if ((declFlags & PullElementFlags.ClassConstructorVariable)) {
                    // it's really an implicit class decl, so we need to set the type of the symbol to
                    // the constructor type
                    // Note that we would have already found the class symbol in the search above
                    var classTypeSymbol: PullClassTypeSymbol = <PullClassTypeSymbol>variableSymbol;

                    // PULLTODO: In both this case and the case below, we should have already received the
                    // class or module symbol as the variableSymbol found above
                    if (parent) {
                        members = parent.getMembers();

                        for (i = 0; i < members.length; i++) {
                            if ((members[i].getName() == declName) && (members[i].getKind() == PullElementKind.Class)) {
                                classTypeSymbol = <PullClassTypeSymbol>members[i];
                                break;
                            }
                        }
                    }

                    if (!classTypeSymbol) {
                        classTypeSymbol = <PullClassTypeSymbol>this.findSymbolInContext(declName, PullElementKind.SomeType, []);

                        if (classTypeSymbol && (classTypeSymbol.getKind() != PullElementKind.Class)) {
                            classTypeSymbol = null;
                        }
                    }

                    if (classTypeSymbol) {
                        variableSymbol = classTypeSymbol.getConstructorMethod();
                        variableDeclaration.setSymbol(variableSymbol);

                        // set the AST to the constructor method's if possible
                        decls = classTypeSymbol.getDeclarations();

                        if (decls.length) {

                            decl = decls[decls.length - 1];
                            ast = this.semanticInfo.getASTForDecl(decl);

                            if (ast) {
                                this.semanticInfo.setASTForDecl(variableDeclaration, ast);
                            }
                        }
                    }
                    else {
                        // PULLTODO: Clodules/Interfaces on classes
                        if (!variableSymbol) {
                            variableSymbol = new PullSymbol(declName, declKind);
                        }

                        variableSymbol.addDeclaration(variableDeclaration);
                        variableDeclaration.setSymbol(variableSymbol);                       

                        variableSymbol.setType(this.semanticInfoChain.anyTypeSymbol);
                    }
                }
                else if ((declFlags & PullElementFlags.InitializedModule)) {
                    var moduleContainerTypeSymbol: PullContainerTypeSymbol = null;
                    var moduleParent = this.getParent(false);
                    
                    if (moduleParent) {
                        members = moduleParent.getMembers();

                        for (i = 0; i < members.length; i++) {
                            if ((members[i].getName() == declName) && (members[i].getKind() == PullElementKind.Container)) {
                                moduleContainerTypeSymbol = <PullContainerTypeSymbol>members[i];
                                break;
                            }
                        }
                    }

                    if (!moduleContainerTypeSymbol) {
                        moduleContainerTypeSymbol = <PullContainerTypeSymbol>this.findSymbolInContext(declName, PullElementKind.SomeType, []);

                        if (moduleContainerTypeSymbol && (moduleContainerTypeSymbol.getKind() != PullElementKind.Container)) {
                            moduleContainerTypeSymbol = null;
                        }
                    }

                    if (moduleContainerTypeSymbol) {
                        variableSymbol = moduleContainerTypeSymbol.getInstanceSymbol();

                        variableSymbol.addDeclaration(variableDeclaration);
                        variableDeclaration.setSymbol(variableSymbol);

                        // set the AST to the constructor method's if possible
                        decls = moduleContainerTypeSymbol.getDeclarations();

                        if (decls.length) {

                            decl = decls[decls.length - 1];
                            ast = this.semanticInfo.getASTForDecl(decl);

                            if (ast) {
                                this.semanticInfo.setASTForDecl(variableDeclaration, ast);
                            }
                        }                        
                        
                        // we added the variable to the parent when binding the module
                        parentHadSymbol = true;
                    }
                    else {
                        // PULLTODO: Raise an Error here
                        variableSymbol.setType(this.semanticInfoChain.anyTypeSymbol);
                    }
                }
            }
            else {
                variableSymbol.addDeclaration(variableDeclaration);
                variableDeclaration.setSymbol(variableSymbol);                
            }

            if (parent && !parentHadSymbol) {

                if (declFlags & PullElementFlags.Exported) {
                    parent.addMember(variableSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    variableSymbol.setContainer(parent);
                }
                this.recordNonInterfaceParentModule();
            }

            variableSymbol.setIsBound(this.bindingPhase);
        }

        // properties
        public bindPropertyDeclarationToPullSymbol(propertyDeclaration: PullDecl) {
            var declFlags = propertyDeclaration.getFlags();
            var declKind = propertyDeclaration.getKind();
            var propDeclAST = <VarDecl>this.semanticInfo.getASTForDecl(propertyDeclaration);
            
            var isStatic = false;
            var isOptional = false;

            var linkKind = SymbolLinkKind.PublicMember;

            var propertySymbol: PullSymbol = null;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            if (hasFlag(declFlags, PullElementFlags.Optional)) {
                isOptional = true;
            }

            var declName = propertyDeclaration.getName();

            var parentHadSymbol = false;

            var parent = this.getParent(true);

            propertySymbol = parent.findMember(declName);

            if (propertySymbol && (!this.reBindingAfterChange || this.symbolIsRedeclaration(propertySymbol))) {

                // use the span, since we may not have an AST if this is a class constructor property for a class
                // with an implicit constructor...
                var span = propertyDeclaration.getSpan();

                propertyDeclaration.addError(new PullError(span.start(), span.length(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [declName])));

                propertySymbol = null;
            }

            if (propertySymbol) {
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && propertySymbol) {

                // prune out-of-date decls...
                var decls = propertySymbol.getDeclarations();
                var scriptName = propertyDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        propertySymbol.removeDeclaration(decls[j]);
                    }
                }

                propertySymbol.setUnresolved();
            }

            var classTypeSymbol: PullClassTypeSymbol;

            if ((declFlags & PullElementFlags.ImplicitVariable) == 0) {
                if (!parentHadSymbol) {
                    propertySymbol = new PullSymbol(declName, declKind);
                }

                propertySymbol.addDeclaration(propertyDeclaration);
                propertyDeclaration.setSymbol(propertySymbol);

                this.semanticInfo.setSymbolForAST(propDeclAST.id, propertySymbol);
                this.semanticInfo.setSymbolForAST(propDeclAST, propertySymbol);
            }
            else {
                // it's really an implicit class decl, so we need to set the type of the symbol to
                // the constructor type
                classTypeSymbol = null;

                if (parent) {
                    var members = parent.getMembers();

                    for (var i = 0; i < members.length; i++) {
                        if ((members[i].getName() == declName) && (members[i].getKind() == PullElementKind.Class)) {
                            classTypeSymbol = <PullClassTypeSymbol>members[i];
                            break;
                        }
                    }
                }

                if (!classTypeSymbol) {
                    classTypeSymbol = <PullClassTypeSymbol>this.findSymbolInContext(declName, PullElementKind.SomeType, []);

                    if (classTypeSymbol && (classTypeSymbol.getKind() != PullElementKind.Class)) {
                        classTypeSymbol = null;
                    }
                }

                if (classTypeSymbol) {
                    propertySymbol = classTypeSymbol.getConstructorMethod();
                    propertyDeclaration.setSymbol(propertySymbol);
                }
                else {
                    propertySymbol.setType(this.semanticInfoChain.anyTypeSymbol);
                }

                propertySymbol.setResolved();
            }

            if (isOptional) {
                propertySymbol.setIsOptional();
            }

            if (parent && !parentHadSymbol) {
                if (parent.isClass()) {
                    classTypeSymbol = <PullClassTypeSymbol>parent;

                    if (isStatic) {
                        this.staticClassMembers[this.staticClassMembers.length] = propertySymbol;
                    }
                    else {
                        classTypeSymbol.addMember(propertySymbol, linkKind);
                    }
                }
                else {
                    parent.addMember(propertySymbol, linkKind);
                }
            }

            propertySymbol.setIsBound(this.bindingPhase);
        }

        public bindImportDeclaration(importDeclaration: PullDecl) {
            var declFlags = importDeclaration.getFlags();
            var declKind = importDeclaration.getKind();
            var importDeclAST = <VarDecl>this.semanticInfo.getASTForDecl(importDeclaration);

            var isExported = false;
            var linkKind = SymbolLinkKind.PrivateMember;
            var importSymbol: PullSymbol = null;
            var declName = importDeclaration.getName();
            var parentHadSymbol = false;
            var parent = this.getParent(true);

            // The code below accounts for the variable symbol being a type because
            // modules may create instance variables

            if (parent) {
                importSymbol = parent.findMember(declName);

                if (!importSymbol) {
                    importSymbol = parent.findContainedMember(declName);
                }
            }
            else if (!(importDeclaration.getFlags() & PullElementFlags.Exported)) {
                importSymbol = this.findSymbolInContext(declName, PullElementKind.SomeValue, []);
            }

            if (importSymbol) {
                parentHadSymbol = true;
            }

            if (importSymbol && this.symbolIsRedeclaration(importSymbol)) {

                // if it's an implicit variable, then this variable symbol will actually be a class constructor
                // or container type that was just defined, so we don't want to raise an error
                if ((declFlags & PullElementFlags.ImplicitVariable) == 0) {
                    importDeclaration.addError(new PullError(importDeclAST.minChar, importDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [declName])));
                    importSymbol = null;
                }
            }

            if (this.reBindingAfterChange && importSymbol) {

                // prune out-of-date decls...
                var decls = importSymbol.getDeclarations();
                var scriptName = importDeclaration.getScriptName();

                for (var j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        importSymbol.removeDeclaration(decls[j]);
                    }
                }

                importSymbol.setUnresolved();
            }

            if (!importSymbol) {
                importSymbol = new PullSymbol(declName, declKind);
            }

            importSymbol.addDeclaration(importDeclaration);
            importDeclaration.setSymbol(importSymbol);

            this.semanticInfo.setSymbolForAST(importDeclAST.id, importSymbol);
            this.semanticInfo.setSymbolForAST(importDeclAST, importSymbol);

            if (parent && !parentHadSymbol) {

                if (declFlags & PullElementFlags.Exported) {
                    parent.addMember(importSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    importSymbol.setContainer(parent);
                }
                this.recordNonInterfaceParentModule();
            }

            importSymbol.setIsBound(this.bindingPhase);
        }

        // parameters
        public bindParameterSymbols(funcDecl: FuncDecl, funcType: PullTypeSymbol, signatureSymbol: PullSignatureSymbol) {
            // create a symbol for each ast
            // if it's a property, add the symbol to the enclosing type's member list
            var parameters: PullSymbol[] = [];
            var decl: PullDecl = null;
            var argDecl: BoundDecl = null;
            var parameterSymbol: PullSymbol = null;
            var isProperty = false;
            var params: any = new BlockIntrinsics();

            if (funcDecl.arguments) {

                for (var i = 0; i < funcDecl.arguments.members.length; i++) {
                    argDecl = <BoundDecl>funcDecl.arguments.members[i];
                    decl = this.semanticInfo.getDeclForAST(argDecl);
                    isProperty = hasFlag(argDecl.varFlags, VarFlags.Property);
                    parameterSymbol = new PullSymbol(argDecl.id.actualText, PullElementKind.Parameter);

                    if (decl.getFlags() & PullElementFlags.Optional) {
                        parameterSymbol.setIsOptional();
                    }

                    if (params[argDecl.id.actualText]) {
                        decl.addError(new PullError(argDecl.minChar, argDecl.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [argDecl.id.actualText])));
                    }
                    else {
                        params[argDecl.id.actualText] = true;
                    }
                    if (decl) {
                        parameterSymbol.addDeclaration(decl);
                        decl.setSymbol(parameterSymbol);

                        var valDecl = decl.getValueDecl();

                        // if this is a parameter property, we still need to set the value decl
                        // for the function parameter
                        if (valDecl) {
                            valDecl.setSymbol(parameterSymbol);
                            parameterSymbol.addDeclaration(valDecl);
                        }
                    }
                    this.semanticInfo.setSymbolForAST(argDecl.id, parameterSymbol);
                    this.semanticInfo.setSymbolForAST(argDecl, parameterSymbol);

                    signatureSymbol.addParameter(parameterSymbol, parameterSymbol.getIsOptional());

                    if (signatureSymbol.isDefinition()) {
                        parameterSymbol.setContainer(funcType);
                    }

                    // PULLREVIEW: Shouldn't need this, since parameters are created off of decl collection
                    // add a member to the parent type
                    //if (decl && isProperty) {
                    //    parameterSymbol = new PullSymbol(argDecl.id.actualText, PullElementKind.Field);

                    //    parameterSymbol.addDeclaration(decl);
                    //    decl.setPropertySymbol(parameterSymbol);

                    //    var linkKind = (decl.getDeclFlags() & PullElementFlags.Private) ? SymbolLinkKind.PrivateProperty : SymbolLinkKind.PublicProperty;
                    //    var parent = context.getParent(1);
                    //    if (parent.hasBrand()) {
                    //        (<PullClassSymbol>parent).getInstanceType().addMember(parameterSymbol, linkKind);
                    //    }
                    //    else {
                    //        // PULLTODO: I don't think we ever even take this branch...
                    //        parent.addMember(parameterSymbol, linkKind);
                    //    }
                    //}
                }
            }        
        }

        // function declarations
        public bindFunctionDeclarationToPullSymbol(functionDeclaration: PullDecl) {  
            var declKind = functionDeclaration.getKind();
            var declFlags = functionDeclaration.getFlags();
            var funcDeclAST = <FuncDecl>this.semanticInfo.getASTForDecl(functionDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) != 0;

            var funcName = functionDeclaration.getName();

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent(true);
            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            // PULLREVIEW: On a re-bind, there's no need to search far-and-wide: just look in the parent's member list
            var functionSymbol: PullSymbol = null;
            var functionTypeSymbol: PullFunctionTypeSymbol = null;

            var i = 0;
            var j = 0;

            if (parent) {
                functionSymbol = parent.findMember(funcName);

                if (!functionSymbol) {
                    functionSymbol = parent.findContainedMember(funcName);
                    var parentDecl = this.getParentDecl();

                    if (functionSymbol && (parentDecl != functionSymbol.getDeclarations()[0].getParentDecl())) {
                        functionSymbol = null;
                    }
                }
            }
            else if (!(functionDeclaration.getFlags() & PullElementFlags.Exported)) {
                functionSymbol = this.findSymbolInContext(funcName, PullElementKind.SomeValue, []);
            }

            if (functionSymbol && functionSymbol.getKind() != PullElementKind.Function) {
                functionDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [funcName])));
                functionSymbol = null;
            }

            if (functionSymbol) {
                functionTypeSymbol = <PullFunctionTypeSymbol>functionSymbol.getType();
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && functionSymbol) {

                // prune out-of-date decls...
                var decls = functionSymbol.getDeclarations();
                var scriptName = functionDeclaration.getScriptName();

                for (j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        functionSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                functionSymbol.invalidate();
            } 

            if (!functionSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                functionSymbol = new PullSymbol(funcName, PullElementKind.Function);
                functionTypeSymbol = new PullFunctionTypeSymbol();

                functionSymbol.setType(functionTypeSymbol);
            }

            functionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionDeclaration);

            this.semanticInfo.setSymbolForAST(funcDeclAST.name, functionSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST, functionSymbol);


            if (parent && !parentHadSymbol) {
                if (isExported) {
                    parent.addMember(functionSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    functionSymbol.setContainer(parent);
                }
                this.recordNonInterfaceParentModule();
            }

            if (!isSignature) {
                this.pushParent(functionTypeSymbol, functionDeclaration);
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = functionTypeSymbol.getCallSignatures();

                for (i = 0; i < callSigs.length; i++) {
                    functionTypeSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                functionSymbol.invalidate();
                functionTypeSymbol.invalidate();
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);
            
            signature.addDeclaration(functionDeclaration);
            functionDeclaration.setSignatureSymbol(signature);

            if (funcDeclAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionDeclaration), functionTypeSymbol, signature);

            var typeParameters = functionDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            // add the implicit call member for this function type
            functionTypeSymbol.addSignature(signature);
        
            if (!isSignature) {
                var childDecls = functionDeclaration.getChildDecls();

                for (i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            }
        }

        public bindFunctionExpressionToPullSymbol(functionExpressionDeclaration: PullDecl) {
            var declKind = functionExpressionDeclaration.getKind();
            var declFlags = functionExpressionDeclaration.getFlags();
            var funcExpAST = <FuncDecl>this.semanticInfo.getASTForDecl(functionExpressionDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionSymbol: PullSymbol = new PullSymbol(functionExpressionDeclaration.getName(), PullElementKind.Function);
            var functionTypeSymbol = new PullFunctionTypeSymbol();

            functionSymbol.setType(functionTypeSymbol);
            
            functionExpressionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionExpressionDeclaration);

            if (funcExpAST.name) {
                this.semanticInfo.setSymbolForAST(funcExpAST.name, functionSymbol);
            }
            this.semanticInfo.setSymbolForAST(funcExpAST, functionSymbol);

            this.pushParent(functionTypeSymbol, functionExpressionDeclaration);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            if (funcExpAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            var typeParameters = functionExpressionDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            signature.addDeclaration(functionExpressionDeclaration);
            functionExpressionDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionExpressionDeclaration), functionTypeSymbol, signature);

            // add the implicit call member for this function type
            functionTypeSymbol.addSignature(signature);
        
            var childDecls = functionExpressionDeclaration.getChildDecls();

            for (i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        public bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration: PullDecl) {
            var declKind = functionTypeDeclaration.getKind();
            var declFlags = functionTypeDeclaration.getFlags();
            var funcTypeAST = <FuncDecl>this.semanticInfo.getASTForDecl(functionTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionTypeSymbol = new PullFunctionTypeSymbol();
            
            functionTypeDeclaration.setSymbol(functionTypeSymbol);
            functionTypeSymbol.addDeclaration(functionTypeDeclaration);
            this.semanticInfo.setSymbolForAST(funcTypeAST, functionTypeSymbol);
        
            this.pushParent(functionTypeSymbol, functionTypeDeclaration);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            if (funcTypeAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            var typeParameters = functionTypeDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (var i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            signature.addDeclaration(functionTypeDeclaration);
            functionTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionTypeDeclaration), functionTypeSymbol, signature);

            // add the implicit call member for this function type
            functionTypeSymbol.addSignature(signature);

            this.popParent();        
        }

        // method declarations
        public bindMethodDeclarationToPullSymbol(methodDeclaration: PullDecl) {
            var declKind = methodDeclaration.getKind();
            var declFlags = methodDeclaration.getFlags();
            var methodAST = <FuncDecl>this.semanticInfo.getASTForDecl(methodDeclaration);

            var isPrivate = (declFlags & PullElementFlags.Private) != 0;
            var isStatic = (declFlags & PullElementFlags.Static) != 0;

            var methodName = methodDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent(true);
            var parentHadSymbol = false;

            var cleanedPreviousDecls = false;
            
            var methodSymbol: PullSymbol = null;
            var methodTypeSymbol: PullFunctionTypeSymbol = null;

            var linkKind = isPrivate ? SymbolLinkKind.PrivateMember : SymbolLinkKind.PublicMember;

            var i = 0;
            var j = 0;

            methodSymbol = parent.isClass() && isStatic && (<PullClassTypeSymbol>parent).getConstructorMethod() ? (<PullClassTypeSymbol>parent).getConstructorMethod().getType().findMember(methodName) : parent.findMember(methodName);

            if (methodSymbol && methodSymbol.getKind() != PullElementKind.Method) {
                methodDeclaration.addError(new PullError(methodAST.minChar, methodAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [methodName])));
                methodSymbol = null;
            }

            if (methodSymbol) {
                methodTypeSymbol = <PullFunctionTypeSymbol>methodSymbol.getType();
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && methodSymbol) {

                // prune out-of-date decls...
                var decls = methodSymbol.getDeclarations();
                var scriptName = methodDeclaration.getScriptName();

                for (j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        methodSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                methodSymbol.invalidate();
            }

            if (!methodSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                methodSymbol = new PullSymbol(methodName, PullElementKind.Method);
                methodTypeSymbol = new PullFunctionTypeSymbol();

                methodSymbol.setType(methodTypeSymbol);
            }

            methodDeclaration.setSymbol(methodSymbol);
            methodSymbol.addDeclaration(methodDeclaration);
            this.semanticInfo.setSymbolForAST(methodAST.name, methodSymbol);
            this.semanticInfo.setSymbolForAST(methodAST, methodSymbol);

            if (!parentHadSymbol) {

                if (isStatic) {
                    this.staticClassMembers[this.staticClassMembers.length] = methodSymbol;
                }
                else {
                    parent.addMember(methodSymbol, linkKind);
                }
            }

            if (!isSignature) {
                this.pushParent(methodTypeSymbol, methodDeclaration);
            }

            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = methodTypeSymbol.getCallSignatures();
                var constructSigs = methodTypeSymbol.getConstructSignatures();
                var indexSigs = methodTypeSymbol.getIndexSignatures();

                for (i = 0; i < callSigs.length; i++) {
                    methodTypeSymbol.removeCallSignature(callSigs[i], false);
                }
                for (i = 0; i < constructSigs.length; i++) {
                    methodTypeSymbol.removeConstructSignature(constructSigs[i], false);
                }
                for (i = 0; i < indexSigs.length; i++) {
                    methodTypeSymbol.removeIndexSignature(indexSigs[i], false);
                }

                methodSymbol.invalidate();
                methodTypeSymbol.invalidate();
            }

            var sigKind = PullElementKind.CallSignature;

            var signature = isSignature ? new PullSignatureSymbol(sigKind) : new PullDefinitionSignatureSymbol(sigKind);

            if (methodAST.variableArgList) {
                signature.setHasVariableParamList();
            }

            var typeParameters = methodDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = signature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    signature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            signature.addDeclaration(methodDeclaration);
            methodDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(methodDeclaration), methodTypeSymbol, signature);

            // add the implicit call member for this function type
            methodTypeSymbol.addSignature(signature);
        
            if (!isSignature) {
                var childDecls = methodDeclaration.getChildDecls();

                for (i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            } 
        }

        // class constructor declarations
        public bindConstructorDeclarationToPullSymbol(constructorDeclaration: PullDecl) {
            var declKind = constructorDeclaration.getKind();
            var declFlags = constructorDeclaration.getFlags();
            var constructorAST = <FuncDecl>this.semanticInfo.getASTForDecl(constructorDeclaration);

            var constructorName = constructorDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = <PullClassTypeSymbol>this.getParent(true);

            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            var constructorSymbol: PullSymbol = parent.getConstructorMethod();
            var constructorTypeSymbol: PullConstructorTypeSymbol = null;

            var linkKind = SymbolLinkKind.ConstructorMethod;

            if (constructorSymbol) {

                constructorTypeSymbol = <PullConstructorTypeSymbol>constructorSymbol.getType();

                if (this.reBindingAfterChange) {
                    // prune out-of-date decls...
                    var decls = constructorSymbol.getDeclarations();
                    var scriptName = constructorDeclaration.getScriptName();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            constructorSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }

                    constructorSymbol.invalidate();
                    constructorTypeSymbol.invalidate();
                }
            }

            if (!constructorSymbol) {
                constructorSymbol = new PullSymbol(constructorName, PullElementKind.ConstructorMethod);
                constructorTypeSymbol = new PullConstructorTypeSymbol();
            }

            // Even if we're reusing the symbol, it would have been cleared by the call to invalidate above
            parent.setConstructorMethod(constructorSymbol);
            constructorSymbol.setType(constructorTypeSymbol);

            constructorDeclaration.setSymbol(constructorSymbol);
            constructorSymbol.addDeclaration(constructorDeclaration);
            this.semanticInfo.setSymbolForAST(constructorAST, constructorSymbol);

            var i = 0;
       
            if (!isSignature) {
                this.pushParent(constructorTypeSymbol, constructorDeclaration);
            }

            if (parentHadSymbol && cleanedPreviousDecls) {
                var constructSigs = constructorTypeSymbol.getConstructSignatures();

                for (i = 0; i < constructSigs.length; i++) {
                    constructorTypeSymbol.removeConstructSignature(constructSigs[i]);
                }

                constructorSymbol.invalidate();
                constructorTypeSymbol.invalidate();
            }
            
            // add a call signature to the constructor method, and a construct signature to the parent class type
            var constructSignature = isSignature ? new PullSignatureSymbol(PullElementKind.ConstructSignature) : new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            constructSignature.setReturnType(parent);

            constructSignature.addDeclaration(constructorDeclaration);
            constructorDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(constructorAST, constructorTypeSymbol, constructSignature);

            if (constructorAST.variableArgList) {
                constructSignature.setHasVariableParamList();
            }

            constructorTypeSymbol.addSignature(constructSignature);
        
            if (!isSignature) {
                var childDecls = constructorDeclaration.getChildDecls();

                for (i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            }
        }

        public bindConstructSignatureDeclarationToPullSymbol(constructSignatureDeclaration: PullDecl) {
            var parent = this.getParent(true);
            var constructorAST = <FuncDecl>this.semanticInfo.getASTForDecl(constructSignatureDeclaration);

            var constructSigs = parent.getConstructSignatures();

            var i = 0;

            for (i = 0; i < constructSigs.length; i++) {
                if (constructSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    parent.removeConstructSignature(constructSigs[i], false);
                }
            }

            // update the construct signature list
            parent.recomputeConstructSignatures();
            var constructSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);

            if (constructorAST.variableArgList) {
                constructSignature.setHasVariableParamList();
            }

            var typeParameters = constructSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = constructSignature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    constructSignature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            constructSignature.addDeclaration(constructSignatureDeclaration);
            constructSignatureDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(constructSignatureDeclaration), null, constructSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(constructSignatureDeclaration), constructSignature);

            parent.addConstructSignature(constructSignature); 
        }

        public bindCallSignatureDeclarationToPullSymbol(callSignatureDeclaration: PullDecl) {
            var parent = this.getParent(true);
            var callSignatureAST = <FuncDecl>this.semanticInfo.getASTForDecl(callSignatureDeclaration);

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            var callSigs = parent.getCallSignatures();

            var i = 0;

            for (i = 0; i < callSigs.length; i++) {
                if (callSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    parent.removeCallSignature(callSigs[i], false);
                }
            }

            // update the call signature list
            parent.recomputeCallSignatures();

            var callSignature = new PullSignatureSymbol(PullElementKind.CallSignature);

            if (callSignatureAST.variableArgList) {
                callSignature.setHasVariableParamList();
            }

            var typeParameters = callSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = callSignature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    callSignature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            callSignature.addDeclaration(callSignatureDeclaration);
            callSignatureDeclaration.setSignatureSymbol(callSignature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(callSignatureDeclaration), null, callSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(callSignatureDeclaration), callSignature);

            parent.addCallSignature(callSignature);
        }

        public bindIndexSignatureDeclarationToPullSymbol(indexSignatureDeclaration: PullDecl) {
            var parent = this.getParent(true);

            var indexSigs = parent.getIndexSignatures();

            var i = 0;

            for (i = 0; i < indexSigs.length; i++) {
                if (indexSigs[i].getSymbolID() < this.startingSymbolForRebind) {
                    parent.removeIndexSignature(indexSigs[i], false);
                }
            }

            // update the index signature list
            parent.recomputeIndexSignatures();         
            
            var indexSignature = new PullSignatureSymbol(PullElementKind.IndexSignature);

            var typeParameters = indexSignatureDeclaration.getTypeParameters();
            var typeParameter: PullTypeParameterSymbol;
            var typeParameterDecls: PullDecl[] = null;

            for (i = 0; i < typeParameters.length; i++) {

                typeParameter = indexSignature.findTypeParameter(typeParameters[i].getName());

                if (!typeParameter) {
                    typeParameter = new PullTypeParameterSymbol(typeParameters[i].getName());

                    indexSignature.addTypeParameter(typeParameter);
                }
                else {
                    // clean the decls
                    typeParameterDecls = typeParameter.getDeclarations();

                    for (var j = 0; j < typeParameterDecls.length; j++) {
                        if (typeParameterDecls[j].getDeclID() < this.startingDeclForRebind) {
                            typeParameter.removeDeclaration(typeParameterDecls[j]);
                        }
                    }
                }

                typeParameter.addDeclaration(typeParameters[i]);
                typeParameters[i].setSymbol(typeParameter);
            }            

            indexSignature.addDeclaration(indexSignatureDeclaration);
            indexSignatureDeclaration.setSignatureSymbol(indexSignature);
            
            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(indexSignatureDeclaration), null, indexSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(indexSignatureDeclaration), indexSignature);

            parent.addIndexSignature(indexSignature);        
        }

        // getters and setters
        
        public bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration: PullDecl) {
            var declKind = getAccessorDeclaration.getKind();
            var declFlags = getAccessorDeclaration.getFlags();
            var funcDeclAST = <FuncDecl>this.semanticInfo.getASTForDecl(getAccessorDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) != 0;

            var funcName = getAccessorDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;
            var isStatic = false;
            var linkKind = SymbolLinkKind.PublicMember;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            var parent = this.getParent(true);
            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;            

            var accessorSymbol: PullAccessorSymbol = null;
            var getterSymbol: PullSymbol = null;
            var getterTypeSymbol: PullFunctionTypeSymbol = null;

            var i = 0;
            var j = 0;

            accessorSymbol = <PullAccessorSymbol>parent.findMember(funcName);

            if (accessorSymbol) {
                if (!accessorSymbol.isAccessor()) {
                    getAccessorDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [funcName])));
                    accessorSymbol = null;
                }
                else {
                    getterSymbol = accessorSymbol.getGetter();

                    if (getterSymbol && (!this.reBindingAfterChange || this.symbolIsRedeclaration(getterSymbol))) {
                        getAccessorDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateGetter_1, [funcName])));
                        accessorSymbol = null;
                        getterSymbol = null;
                    }
                }
            }

            // we have an accessor we can use...
            if (accessorSymbol && getterSymbol) {
                getterTypeSymbol = <PullFunctionTypeSymbol>getterSymbol.getType();
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && accessorSymbol) {

                // prune out-of-date decls...
                var decls = accessorSymbol.getDeclarations();
                var scriptName = getAccessorDeclaration.getScriptName();

                for (j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        accessorSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (getterSymbol) {
                    decls = getterSymbol.getDeclarations();

                    for (j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            getterSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }
                }

                accessorSymbol.invalidate();
            }

            if (!accessorSymbol) {
                accessorSymbol = new PullAccessorSymbol(funcName);
            }

            if (!getterSymbol) {
                getterSymbol = new PullSymbol(funcName, PullElementKind.Function);
                getterTypeSymbol = new PullFunctionTypeSymbol();

                getterSymbol.setType(getterTypeSymbol);

                accessorSymbol.setGetter(getterSymbol);
            }

            getAccessorDeclaration.setSymbol(accessorSymbol);
            accessorSymbol.addDeclaration(getAccessorDeclaration);
            getterSymbol.addDeclaration(getAccessorDeclaration);

            this.semanticInfo.setSymbolForAST(funcDeclAST.name, getterSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST, getterSymbol);

            // PULLTODO: Verify parent is a class or object literal
            // PULLTODO: Verify static/non-static between getter and setter

            if (!parentHadSymbol) {

                if (isStatic) {
                    this.staticClassMembers[this.staticClassMembers.length] = accessorSymbol;
                }
                else {
                    parent.addMember(accessorSymbol, linkKind);
                }
            }

            if (!isSignature) {
                this.pushParent(getterTypeSymbol, getAccessorDeclaration);
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = getterTypeSymbol.getCallSignatures();

                for (i = 0; i < callSigs.length; i++) {
                    getterTypeSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                getterSymbol.invalidate();
                getterTypeSymbol.invalidate();
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(getAccessorDeclaration);
            getAccessorDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(getAccessorDeclaration), getterTypeSymbol, signature);

            var typeParameters = getAccessorDeclaration.getTypeParameters();

            if (typeParameters.length) {
                getAccessorDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.accessorsMayNotBeGeneric, null)));
            }

            // add the implicit call member for this function type
            getterTypeSymbol.addSignature(signature);

            if (!isSignature) {
                var childDecls = getAccessorDeclaration.getChildDecls();

                for (i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            }

            getterSymbol.setIsBound(this.bindingPhase);
        }

        public bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration: PullDecl) {
            var declKind = setAccessorDeclaration.getKind();
            var declFlags = setAccessorDeclaration.getFlags();
            var funcDeclAST = <FuncDecl>this.semanticInfo.getASTForDecl(setAccessorDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) != 0;

            var funcName = setAccessorDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;
            var isStatic = false;
            var linkKind = SymbolLinkKind.PublicMember;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            var parent = this.getParent(true);
            var parentHadSymbol = false;
            var cleanedPreviousDecls = false;

            var accessorSymbol: PullAccessorSymbol = null;
            var setterSymbol: PullSymbol = null;
            var setterTypeSymbol: PullFunctionTypeSymbol = null;

            var i = 0;
            var j = 0;

            accessorSymbol = <PullAccessorSymbol>parent.findMember(funcName);

            if (accessorSymbol) {
                if (!accessorSymbol.isAccessor()) {
                    setAccessorDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateIdentifier_1, [funcName])));
                    accessorSymbol = null;
                }
                else {
                    setterSymbol = accessorSymbol.getSetter();

                    if (setterSymbol && (!this.reBindingAfterChange || this.symbolIsRedeclaration(setterSymbol))) {
                        setAccessorDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.duplicateSetter_1, [funcName])));
                        accessorSymbol = null;
                        setterSymbol = null;
                    }
                }
            }

            // we have an accessor we can use...
            if (accessorSymbol && setterSymbol) {
                setterTypeSymbol = <PullFunctionTypeSymbol>setterSymbol.getType();
                parentHadSymbol = true;
            }

            if (this.reBindingAfterChange && accessorSymbol) {

                // prune out-of-date decls...
                var decls = accessorSymbol.getDeclarations();
                var scriptName = setAccessorDeclaration.getScriptName();

                for (j = 0; j < decls.length; j++) {
                    if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                        accessorSymbol.removeDeclaration(decls[j]);

                        cleanedPreviousDecls = true;
                    }
                }

                if (setterSymbol) {
                    decls = setterSymbol.getDeclarations();

                    for (j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            setterSymbol.removeDeclaration(decls[j]);

                            cleanedPreviousDecls = true;
                        }
                    }
                }

                accessorSymbol.invalidate();
            }

            if (!accessorSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                accessorSymbol = new PullAccessorSymbol(funcName);
            }

            if (!setterSymbol) {
                setterSymbol = new PullSymbol(funcName, PullElementKind.Function);
                setterTypeSymbol = new PullFunctionTypeSymbol();

                setterSymbol.setType(setterTypeSymbol);

                accessorSymbol.setSetter(setterSymbol);
            }

            setAccessorDeclaration.setSymbol(accessorSymbol);
            accessorSymbol.addDeclaration(setAccessorDeclaration);
            setterSymbol.addDeclaration(setAccessorDeclaration);

            this.semanticInfo.setSymbolForAST(funcDeclAST.name, setterSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST, setterSymbol);

            // PULLTODO: Verify parent is a class or object literal
            // PULLTODO: Verify static/non-static between getter and setter

            if (!parentHadSymbol) {

                if (isStatic) {
                    this.staticClassMembers[this.staticClassMembers.length] = accessorSymbol;
                }
                else {
                    parent.addMember(accessorSymbol, linkKind);
                }
            }

            if (!isSignature) {
                this.pushParent(setterTypeSymbol, setAccessorDeclaration);
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (parentHadSymbol && cleanedPreviousDecls) {
                var callSigs = setterTypeSymbol.getCallSignatures();

                for (i = 0; i < callSigs.length; i++) {
                    setterTypeSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                setterSymbol.invalidate();
                setterTypeSymbol.invalidate();
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(setAccessorDeclaration);
            setAccessorDeclaration.setSignatureSymbol(signature);

            // PULLTODO: setter should not have a parameters
            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(setAccessorDeclaration), setterTypeSymbol, signature);

            var typeParameters = setAccessorDeclaration.getTypeParameters();
 
            if (typeParameters.length) {
                setAccessorDeclaration.addError(new PullError(funcDeclAST.minChar, funcDeclAST.getLength(), this.semanticInfo.getPath(), getDiagnosticMessage(DiagnosticMessages.accessorsMayNotBeGeneric, null)));
            }

            // add the implicit call member for this function type
            setterTypeSymbol.addSignature(signature);

            if (!isSignature) {
                var childDecls = setAccessorDeclaration.getChildDecls();

                for (i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            }

            setterSymbol.setIsBound(this.bindingPhase);
        }

        // binding
        public bindDeclToPullSymbol(decl: PullDecl, rebind = false) {

            if (rebind) {
                this.startingDeclForRebind = lastBoundPullDeclId;
                this.startingSymbolForRebind = lastBoundPullSymbolID;
                this.reBindingAfterChange = true;
            }

            switch (decl.getKind()) {

                case PullElementKind.Script:
                    var childDecls = decl.getChildDecls();
                    for (var i = 0; i < childDecls.length; i++) {
                        this.bindDeclToPullSymbol(childDecls[i]);
                    }
                    break;

                case PullElementKind.Container:
                    this.bindModuleDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Interface:
                    this.bindInterfaceDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Class:
                    this.bindClassDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Function:
                    this.bindFunctionDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Variable:
                    this.bindVariableDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Property:
                    this.bindPropertyDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Method:
                    this.bindMethodDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ConstructorMethod:
                    this.bindConstructorDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.CallSignature:
                    this.bindCallSignatureDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ConstructSignature:
                    this.bindConstructSignatureDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.IndexSignature:
                    this.bindIndexSignatureDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.Enum:
                    this.bindEnumDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.GetAccessor:
                    this.bindGetAccessorDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.SetAccessor:
                    this.bindSetAccessorDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ObjectType:
                    this.bindObjectTypeDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.FunctionType:
                    this.bindFunctionTypeDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.ConstructorType:
                    this.bindConstructorTypeDeclarationToPullSymbol(decl);
                    break;

                case PullElementKind.FunctionExpression:
                    this.bindFunctionExpressionToPullSymbol(decl);
                    break;

                case PullElementKind.Parameter:
                    // parameters are bound by their enclosing function
                    break;

                default:
                    throw new Error("Unrecognized type declaration");
            }
        }
        
        public bindDeclsForUnit(filePath: string, rebind = false) {
            this.setUnit(filePath);

            var topLevelDecls = this.semanticInfo.getTopLevelDecls();

            for (var i = 0; i < topLevelDecls.length; i++) {
                this.bindDeclToPullSymbol(topLevelDecls[i], rebind);
            }
        }
    }
}