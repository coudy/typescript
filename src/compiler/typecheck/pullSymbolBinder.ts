// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

// PULLTODO: All new symbols should be bound to their ASTs when they're bound to a decl
// PULLTODO: All caching should occur in one place per method, consistently
// PULLTODO: Remove null checks for decl parameters

module TypeScript {
    export class PullSymbolBinder {

        private parentChain: PullTypeSymbol[] = [];
        private declPath: string[] = [];
        public semanticInfo: SemanticInfo;

        public reBindingAfterChange = false;
        public startingDeclForRebind = pullDeclId; // note that this gets set on creation

        constructor (public semanticInfoChain: SemanticInfoChain) {
        }

        public setUnit(fileName: string) {
            this.semanticInfo = this.semanticInfoChain.getUnit(fileName);
        }

        public getParent(n = 0): PullTypeSymbol {
            return this.parentChain ? this.parentChain[this.parentChain.length - 1 - n] : null;
        }

        public getDeclPath() { return this.declPath; }

        public pushParent(parentDecl: PullTypeSymbol) { 
            if (parentDecl) { 
                this.parentChain[this.parentChain.length] = parentDecl;
                this.declPath[this.declPath.length] = parentDecl.getName();
            } 
        }

        public popParent() {
            if (this.parentChain.length) {
                this.parentChain.length--;
                this.declPath.length--;
            }
        }

        public findSymbolInContext(name: string, declKind: PullElementKind, typeLookupPath: string[]): PullSymbol {
            var startTime = new Date().getTime();
            var contextSymbolPath: string[] = this.getDeclPath();
            var nestedSymbolPath: string[] = [];
            var copyOfContextSymbolPath = [];
            var symbol: PullSymbol = null;

            // first, search within the given symbol path
            if (typeLookupPath.length) {

                for (var i = 0; i < typeLookupPath.length; i++) {
                    nestedSymbolPath[nestedSymbolPath.length] = typeLookupPath[i];
                }

                nestedSymbolPath[nestedSymbolPath.length] = name;

                while (nestedSymbolPath.length >= 2) {
                    symbol = this.semanticInfoChain.findSymbol(nestedSymbolPath, declKind);

                    if (symbol) {
                        var endTime = new Date().getTime();
                        time_in_findSymbol += endTime - startTime;

                        symbol.setDeclPath(nestedSymbolPath);

                        return symbol;
                    }
                    nestedSymbolPath.length -= 2;
                    nestedSymbolPath[nestedSymbolPath.length] = name;
                }
            }

            // next, link back up to the enclosing context
            if (contextSymbolPath.length) {
            
                for (var i = 0; i < contextSymbolPath.length; i++) {
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = contextSymbolPath[i];
                }

                for (var i = 0; i < typeLookupPath.length; i++) {
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = typeLookupPath[i];
                }

                copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;

                while (copyOfContextSymbolPath.length >= 2) {
                    symbol = this.semanticInfoChain.findSymbol(copyOfContextSymbolPath, declKind);

                    if (symbol) {
                        var endTime = new Date().getTime();
                        time_in_findSymbol += endTime - startTime;

                        symbol.setDeclPath(copyOfContextSymbolPath);

                        return symbol;
                    }
                    copyOfContextSymbolPath.length -= 2;
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;
                }
            }

            // finally, try searching globally
            symbol = this.semanticInfoChain.findSymbol([name], declKind);

            if (symbol) {
                symbol.setDeclPath([name]);
            }

            var endTime = new Date().getTime();
            time_in_findSymbol += endTime - startTime;

            return symbol;
        }

        //
        // decl binding
        //

        // modules
        public bindModuleDeclarationToPullSymbol(moduleDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
        
            var modName = moduleDecl.getName();
            var moduleSymbol: PullTypeSymbol = <PullTypeSymbol>this.findSymbolInContext(modName, PullElementKind.SomeType, []);

            if (moduleSymbol && moduleSymbol.getKind() != PullElementKind.Module) {
                // duplicate symbol error
                moduleSymbol = null;
            }

            var moduleAST = <ModuleDeclaration>this.semanticInfo.getASTForDecl(moduleDecl);
            var createdNewSymbol = false;

            if (!moduleSymbol) {                
                var moduleSymbol = new PullTypeSymbol(modName, PullElementKind.Module);
                createdNewSymbol = true;
            }

            moduleSymbol.addDeclaration(moduleDecl);
            moduleDecl.setSymbol(moduleSymbol);

            this.semanticInfo.setSymbolForAST(moduleAST, moduleSymbol);
            this.semanticInfo.setSymbolForAST(moduleAST.name, moduleSymbol);
        
            if (createdNewSymbol) {
                var parent = this.getParent();

                if (parent) {
                    var linkKind = moduleDecl.getDeclFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                    if (linkKind == SymbolLinkKind.PublicMember) {
                        parent.addMember(moduleSymbol, linkKind);
                    }
                    else {
                        moduleSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
                    }
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = moduleSymbol.getDeclarations();
                var scriptName = moduleDecl.getScriptName();

                for (var i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        moduleSymbol.removeDeclaration(decls[i]);
                    }
                }
            }

            this.pushParent(moduleSymbol);

            var childDecls = moduleDecl.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        // enums
        public bindEnumDeclarationToPullSymbol(enumDeclaration: PullDecl) {
            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
        
            var enumName = enumDeclaration.getName();
            var enumSymbol = <PullTypeSymbol>this.findSymbolInContext(enumName, PullElementKind.SomeType, []);

            if (enumSymbol && enumSymbol.getKind() != PullElementKind.Enum) {
                // error
                enumSymbol = null;
            }

            var enumAST = <ModuleDeclaration>this.semanticInfo.getASTForDecl(enumDeclaration);
            var createdNewSymbol = false;

            if (!enumSymbol) {
                enumSymbol = new PullTypeSymbol(enumName, PullElementKind.Enum);
                enumSymbol.addDeclaration(enumDeclaration);
                enumDeclaration.setSymbol(enumSymbol);
            }

            enumSymbol.addDeclaration(enumDeclaration);
            enumDeclaration.setSymbol(enumSymbol);            
            
            this.semanticInfo.setSymbolForAST(enumAST, enumSymbol);
            this.semanticInfo.setSymbolForAST(enumAST.name, enumSymbol);
        
            if (createdNewSymbol) {
                var parent = this.getParent();

                if (parent) {
                    var linkKind = enumDeclaration.getDeclFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                    if (linkKind == SymbolLinkKind.PublicMember) {
                        parent.addMember(enumSymbol, linkKind);
                    }
                    else {
                        enumSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
                    }
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = enumSymbol.getDeclarations();
                var scriptName = enumDeclaration.getScriptName();

                for (var i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        enumSymbol.removeDeclaration(decls[i]);
                    }
                }
            }

            this.pushParent(enumSymbol);

            var childDecls = enumDeclaration.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();        
        }

        // classes
        public bindClassDeclarationToPullSymbol(classDecl: PullDecl) {

            var className = classDecl.getName();
            var classSymbol: PullClassSymbol = null;
            var instanceSymbol: PullTypeSymbol = null;
            var classAST = <ClassDeclaration>this.semanticInfo.getASTForDecl(classDecl);
            var reUsedSymbol = false;

            var parent = this.getParent();
            var cleanedPreviousDecls = false;

            if (this.reBindingAfterChange) {

                if (parent) {
                    // see if the parent already has a symbol for this class
                    var members = parent.getMembers();
                    var member: PullSymbol = null;

                    for (var i = 0 ; i < members.length; i++) {
                        member = members[i];

                        if (member.getName() == className && member.getKind() == PullElementKind.Class) {
                            reUsedSymbol = true;
                            classSymbol = <PullClassSymbol>member;
                            instanceSymbol = classSymbol.getInstanceType();

                            // prune out-of-date decls
                            var decls = classSymbol.getDeclarations();
                            var scriptName = classDecl.getScriptName();

                            for (var j = 0; j < decls.length; j++) {
                                if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                                    classSymbol.removeDeclaration(decls[j]);
                                }
                            }

                            decls = instanceSymbol.getDeclarations();

                            for (var j = 0; j < decls.length; j++) {
                                if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                                    instanceSymbol.removeDeclaration(decls[j]);
                                    cleanedPreviousDecls = true;
                                }
                            }

                            break;
                        }
                    }
                }
                else {
                    classSymbol = <PullClassSymbol>this.findSymbolInContext(className, PullElementKind.SomeType, []);

                    if (classSymbol && classSymbol.getKind() != PullElementKind.Class) {
                        classSymbol = null;
                    }
                    else {
                        reUsedSymbol = true;
                    }
                }
            }

            if (!reUsedSymbol) {
                classSymbol = new PullClassSymbol(className);
                instanceSymbol = new PullClassInstanceSymbol(className, classSymbol);
                classSymbol.setInstanceType(instanceSymbol);
            }        
        
            classSymbol.addDeclaration(classDecl);
            instanceSymbol.addDeclaration(classDecl);
            
            classDecl.setSymbol(classSymbol);

            this.semanticInfo.setSymbolForAST(classAST, classSymbol);
            this.semanticInfo.setSymbolForAST(classAST.name, classSymbol);
        
            if (parent && !reUsedSymbol) {
                var linkKind = classDecl.getDeclFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;

                if (linkKind == SymbolLinkKind.PublicMember) {
                    parent.addMember(classSymbol, linkKind);
                }
                else {
                    classSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
                }
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (reUsedSymbol && cleanedPreviousDecls) {
                var callSigs = classSymbol.getCallSignatures();
                var constructSigs = classSymbol.getConstructSignatures();
                var indexSigs = classSymbol.getIndexSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    classSymbol.removeCallSignature(callSigs[i], false);
                }
                for (var i = 0; i < constructSigs.length; i++) {
                    classSymbol.removeConstructSignature(constructSigs[i], false);
                }
                for (var i = 0; i < indexSigs.length; i++) {
                    classSymbol.removeIndexSignature(indexSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                classSymbol.invalidate();
            }

            this.pushParent(classSymbol);

            var childDecls = classDecl.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        // interfaces
        public bindInterfaceDeclarationToPullSymbol(interfaceDecl: PullDecl) {

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one
            var interfaceName = interfaceDecl.getName();
            var interfaceSymbol: PullTypeSymbol = <PullTypeSymbol>this.findSymbolInContext(interfaceName, PullElementKind.SomeType, []);

            if (interfaceSymbol && interfaceSymbol.getKind() != PullElementKind.Interface) {
                // error
                interfaceSymbol = null;
            }

            var interfaceAST = <TypeDeclaration>this.semanticInfo.getASTForDecl(interfaceDecl);
            var createdNewSymbol = false;

            if (!interfaceSymbol) {
                interfaceSymbol = new PullTypeSymbol(interfaceName, PullElementKind.Interface);
                createdNewSymbol = true;
            }

            interfaceSymbol.addDeclaration(interfaceDecl);
            interfaceDecl.setSymbol(interfaceSymbol);

            this.semanticInfo.setSymbolForAST(interfaceAST, interfaceSymbol);
            this.semanticInfo.setSymbolForAST(interfaceAST.name, interfaceSymbol);

            if (createdNewSymbol) {
                var parent = this.getParent();

                if (parent) {
                    var linkKind = interfaceDecl.getDeclFlags() & PullElementFlags.Exported ? SymbolLinkKind.PublicMember : SymbolLinkKind.PrivateMember;
                
                    if (linkKind == SymbolLinkKind.PublicMember) {
                        parent.addMember(interfaceSymbol, linkKind);
                    }
                    else {
                        interfaceSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
                    }
                }
            }
            else if (this.reBindingAfterChange) {
                // clear out the old decls...
                var decls = interfaceSymbol.getDeclarations();
                var scriptName = interfaceDecl.getScriptName();

                for (var i = 0; i < decls.length; i++) {
                    if (decls[i].getScriptName() == scriptName && decls[i].getDeclID() < this.startingDeclForRebind) {
                        interfaceSymbol.removeDeclaration(decls[i]);
                    }
                }
            }

            this.pushParent(interfaceSymbol);

            var childDecls = interfaceDecl.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        public bindObjectTypeDeclarationToPullSymbol(objectDecl: PullDecl) {
            var objectSymbolAST: AST = this.semanticInfo.getASTForDecl(objectDecl);

            var objectSymbol = new PullTypeSymbol("{}", PullElementKind.ObjectType);

            objectSymbol.addDeclaration(objectDecl);
            objectDecl.setSymbol(objectSymbol);

            this.semanticInfo.setSymbolForAST(objectSymbolAST, objectSymbol);        

            this.pushParent(objectSymbol);

            var childDecls = objectDecl.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();        
        }

        public bindConstructorTypeDeclarationToPullSymbol(functionTypeDeclaration: PullDecl) {
            var declKind = functionTypeDeclaration.getKind();
            var declFlags = functionTypeDeclaration.getDeclFlags();
            var funcTypeAST = this.semanticInfo.getASTForDecl(functionTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionSymbol = new PullFunctionSymbol("", PullElementKind.Function);
            
            functionTypeDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionTypeDeclaration);
            this.semanticInfo.setSymbolForAST(funcTypeAST, functionSymbol);
        
            this.pushParent(functionSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            signature.addDeclaration(functionTypeDeclaration);
            functionTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionTypeDeclaration), signature);

            // add the implicit construct member for this function type
            functionSymbol.addConstructSignature(signature);

            this.popParent();        
        }

        // variables
        public bindVariableDeclarationToPullSymbol(variableDeclaration: PullDecl) {
            var declFlags = variableDeclaration.getDeclFlags();
            var declType = variableDeclaration.getKind();
            var varDeclAST = <VarDecl>this.semanticInfo.getASTForDecl(variableDeclaration);

            var isExported = false;

            var linkKind = SymbolLinkKind.PrivateMember;

            var variableSymbol: PullSymbol = null;

            var declName = variableDeclaration.getName();

            var parentHadSymbol = false;

            var parent = this.getParent();

            if (this.reBindingAfterChange && parent) {
                // see if the parent already has a symbol for this class
                var members = parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == declName && member.getKind() == declType) {
                        parentHadSymbol = true;
                        variableSymbol = member;
                    
                        // prune out-of-date decls...
                        var decls = member.getDeclarations();
                        var scriptName = variableDeclaration.getScriptName();

                        for (var j = 0; j < decls.length; j++) {
                            if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                                variableSymbol.removeDeclaration(decls[j]);
                            }
                        }

                        break;
                    }
                }
            }

            if (!parentHadSymbol) {
                variableSymbol = new PullSymbol(declName, declType);
            }        

            variableSymbol.addDeclaration(variableDeclaration);
            variableDeclaration.setSymbol(variableSymbol);

            this.semanticInfo.setSymbolForAST(varDeclAST, variableSymbol);
            this.semanticInfo.setSymbolForAST(varDeclAST.id, variableSymbol);

            if (parent && !parentHadSymbol) {

                if (declFlags & PullElementFlags.Exported) {
                    parent.addMember(variableSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    variableSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
                }
            }
        }

        // properties
        public bindPropertyDeclarationToPullSymbol(propertyDeclaration: PullDecl) {
            var declFlags = propertyDeclaration.getDeclFlags();
            var declKind = propertyDeclaration.getKind();
            var propDeclAST = <VarDecl>this.semanticInfo.getASTForDecl(propertyDeclaration);
            
            var isStatic = false;
            var isOptional = false;

            var linkKind = SymbolLinkKind.PublicMember;

            var propertySymbol: PullSymbol = null;

            if (hasFlag(declFlags, PullElementFlags.Static)) {
                isStatic = true;
                linkKind = SymbolLinkKind.StaticMember;
            }

            if (hasFlag(declFlags, PullElementFlags.Private)) {
                linkKind = SymbolLinkKind.PrivateMember;
            }

            if (hasFlag(declFlags, PullElementFlags.Optional)) {
                isOptional = true;
            }

            var declName = propertyDeclaration.getName();

            var reUsedSymbol = false;

            var parent = this.getParent();

            if (this.reBindingAfterChange && parent) {
                // see if the parent already has a symbol for this class
                var members = parent.hasBrand() && !isStatic ? (<PullClassSymbol>parent).getInstanceType().getMembers() : parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == declName && member.getKind() == declKind) {
                        reUsedSymbol = true;
                        propertySymbol = member;
                    
                        // prune out-of-date decls...
                        var decls = member.getDeclarations();
                        var scriptName = propertyDeclaration.getScriptName();

                        for (var j = 0; j < decls.length; j++) {
                            if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                                propertySymbol.removeDeclaration(decls[j]);
                            }
                        }

                        break;
                    }
                }
            }

            if (!reUsedSymbol) {
                propertySymbol = new PullSymbol(declName, declKind);
            }        

            propertySymbol.addDeclaration(propertyDeclaration);
            propertyDeclaration.setSymbol(propertySymbol);
            this.semanticInfo.setSymbolForAST(propDeclAST, propertySymbol);
            this.semanticInfo.setSymbolForAST(propDeclAST.id, propertySymbol);

            if (isOptional) {
                propertySymbol.setIsOptional();
            }

            if (parent && !reUsedSymbol) {
                if (parent.hasBrand()) {
                    var classTypeSymbol = <PullClassSymbol>parent;
                    if (isStatic) {
                        classTypeSymbol.addMember(propertySymbol, linkKind);
                    }
                    else {
                        classTypeSymbol.getInstanceType().addMember(propertySymbol, linkKind);
                    }
                }
                else {
                    parent.addMember(propertySymbol, linkKind);
                }
            }
        }

        // parameters
        public bindParameterSymbols(funcDecl: FuncDecl, signatureSymbol: PullSignatureSymbol) {
            // create a symbol for each ast
            // if it's a property, add the symbol to the enclosing type's member list
            var parameters: PullSymbol[] = [];
            var decl: PullDecl = null;
            var argDecl: BoundDecl = null;
            var parameterSymbol: PullSymbol = null;
            var isProperty = false;

            if (funcDecl.arguments) {

                for (var i = 0; i < funcDecl.arguments.members.length; i++) {
                    argDecl = <BoundDecl>funcDecl.arguments.members[i];
                    decl = this.semanticInfo.getDeclForAST(argDecl);
                    isProperty = hasFlag(argDecl.varFlags, VarFlags.Property);
                    parameterSymbol = new PullSymbol(argDecl.id.actualText, PullElementKind.Variable);
                
                    if (decl) {
                        parameterSymbol.addDeclaration(decl);
                        decl.setSymbol(parameterSymbol);
                    }
                    
                    this.semanticInfo.setSymbolForAST(argDecl, parameterSymbol);
                    this.semanticInfo.setSymbolForAST(argDecl.id, parameterSymbol);

                    signatureSymbol.addParameter(parameterSymbol);

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
            var declFlags = functionDeclaration.getDeclFlags();
            var funcDeclAST = <FuncDecl>this.semanticInfo.getASTForDecl(functionDeclaration);

            var isExported = (declFlags & PullElementFlags.Exported) != 0;

            var funcName = functionDeclaration.getName();

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent();
            var reUsedSymbol = false;
            var cleanedPreviousDecls = false;

            // PULLREVIEW: On a re-bind, there's no need to search far-and-wide: just look in the parent's member list
            var functionSymbol: PullFunctionSymbol = null;

            if (this.reBindingAfterChange) {
                if (parent) { // PULLREVIEW: What if the parent's a function?
                    var members = parent.getMembers();
                    var member: PullSymbol = null;

                    for (var i = 0 ; i < members.length; i++) {
                        member = members[i];

                        if (member.getName() == funcName && (member.getKind() & declKind)) {
                            reUsedSymbol = true;
                            functionSymbol = <PullFunctionSymbol>member;

                            break;
                        }
                    }
                }
                else {
                    functionSymbol = <PullFunctionSymbol>this.findSymbolInContext(funcName, declKind, []);

                    // PULLTODO: Check that the symbol is a function symbol
                }

                if (functionSymbol) {
                    reUsedSymbol = true;
                    
                    // prune out-of-date decls...
                    var decls = functionSymbol.getDeclarations();
                    var scriptName = functionDeclaration.getScriptName();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            functionSymbol.removeDeclaration(decls[j]);
                            cleanedPreviousDecls = true;
                        }
                    }

                    functionSymbol.invalidate();
                }
            }
            else {
                var candidateSym: PullSymbol;

                // if there's already a parent symbol, any preceeding overloads will be present there,
                // so we can just check the parent's children
                if (parent) {
                    candidateSym = parent.getMemberByName(funcName);
                }
                else {
                    // PULLREVIEW: This call ends up being quite expensive - need to avoid it if at all possible
                    candidateSym = <PullFunctionSymbol>this.findSymbolInContext(funcName, declKind, []);

                    // PULLTODO: Check that the symbol is a function symbol
                }

                if (candidateSym && (candidateSym.getKind() & PullElementKind.Function)) {
                    functionSymbol = <PullFunctionSymbol>candidateSym;
                }
            }

            if (!functionSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                functionSymbol = new PullFunctionSymbol(funcName, PullElementKind.Function);
            }

            functionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionDeclaration);
            
            this.semanticInfo.setSymbolForAST(funcDeclAST, functionSymbol);
            this.semanticInfo.setSymbolForAST(funcDeclAST.name, functionSymbol);
        
            if (parent && !reUsedSymbol) {
                if (isExported) {
                    parent.addMember(functionSymbol, SymbolLinkKind.PublicMember);
                }
                else {
                    functionSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
                }
            }

            if (!isSignature) {
                this.pushParent(functionSymbol);
            }

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            if (reUsedSymbol && cleanedPreviousDecls) {
                var callSigs = functionSymbol.getCallSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    functionSymbol.removeCallSignature(callSigs[i], false);
                }

                // just invalidate this once, so we don't pay the cost of rebuilding caches
                // for each signature removed
                functionSymbol.invalidate();
            }

            var signature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);
            
            signature.addDeclaration(functionDeclaration);
            functionDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionDeclaration), signature);

            // add the implicit call member for this function type
            functionSymbol.addSignature(signature);
        
            if (!isSignature) {
                var childDecls = functionDeclaration.getChildDecls();

                for (var i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            }
        }

        public bindFunctionExpressionToPullSymbol(functionExpressionDeclaration: PullDecl) {
            var declKind = functionExpressionDeclaration.getKind();
            var declFlags = functionExpressionDeclaration.getDeclFlags();
            var funcExpAST = <FuncDecl>this.semanticInfo.getASTForDecl(functionExpressionDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionSymbol = new PullFunctionSymbol("", PullElementKind.Function);
            
            functionExpressionDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionExpressionDeclaration);
            this.semanticInfo.setSymbolForAST(funcExpAST, functionSymbol);
            if (funcExpAST.name) {
                this.semanticInfo.setSymbolForAST(funcExpAST.name, functionSymbol);
            }
        
            this.pushParent(functionSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(functionExpressionDeclaration);
            functionExpressionDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionExpressionDeclaration), signature);

            // add the implicit call member for this function type
            functionSymbol.addSignature(signature);
        
            var childDecls = functionExpressionDeclaration.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        public bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration: PullDecl) {
            var declKind = functionTypeDeclaration.getKind();
            var declFlags = functionTypeDeclaration.getDeclFlags();
            var funcTypeAST = this.semanticInfo.getASTForDecl(functionTypeDeclaration);

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionSymbol = new PullFunctionSymbol("", PullElementKind.Function);
            
            functionTypeDeclaration.setSymbol(functionSymbol);
            functionSymbol.addDeclaration(functionTypeDeclaration);
            this.semanticInfo.setSymbolForAST(funcTypeAST, functionSymbol);
        
            this.pushParent(functionSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(functionTypeDeclaration);
            functionTypeDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(functionTypeDeclaration), signature);

            // add the implicit call member for this function type
            functionSymbol.addCallSignature(signature);

            this.popParent();        
        }

        // method declarations
        public bindMethodDeclarationToPullSymbol(methodDeclaration: PullDecl) {
            var declKind = methodDeclaration.getKind();
            var declFlags = methodDeclaration.getDeclFlags();
            var methodAST = <FuncDecl>this.semanticInfo.getASTForDecl(methodDeclaration);

            var isPrivate = (declFlags & PullElementFlags.Private) != 0;
            var isStatic = (declFlags & PullElementFlags.Static) != 0;

            var methodName = methodDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent();

            var reUsedSymbol = false;
            var cleanedPreviousDecls = false;
            
            var methodSymbol: PullFunctionSymbol = null;

            var linkKind = isStatic ? SymbolLinkKind.StaticMember :
                            isPrivate ? SymbolLinkKind.PrivateMember : SymbolLinkKind.PublicMember;

            if (this.reBindingAfterChange) {
                var members = parent.hasBrand() && !isStatic ? (<PullClassSymbol>parent).getInstanceType().getMembers() : parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == methodName && (member.getKind() & declKind)) {
                        reUsedSymbol = true;
                        methodSymbol = <PullFunctionSymbol>member;

                        break;
                    }
                }
            
                if (methodSymbol) {
                    // prune out-of-date decls...
                    var decls = methodSymbol.getDeclarations();
                    var scriptName = methodDeclaration.getScriptName();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            methodSymbol.removeDeclaration(decls[j]);
                            cleanedPreviousDecls = true;
                        }
                    }

                    methodSymbol.invalidate();
                }
            }
            else {
                var candidateSym: PullSymbol;
                
                candidateSym = parent.getMemberByName(methodName);

                if (candidateSym && (candidateSym.getKind() & PullElementKind.Function)) {
                    methodSymbol = <PullFunctionSymbol>candidateSym;
                }
            }

            if (!methodSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                methodSymbol = new PullFunctionSymbol(methodName, PullElementKind.Method);
            }

            methodDeclaration.setSymbol(methodSymbol);
            methodSymbol.addDeclaration(methodDeclaration);
            this.semanticInfo.setSymbolForAST(methodAST, methodSymbol);
            this.semanticInfo.setSymbolForAST(methodAST.name, methodSymbol);
        
            if (!reUsedSymbol) {

                if (parent.hasBrand()) {
                    if (isStatic) {
                        (<PullClassSymbol>parent).addMember(methodSymbol, linkKind);
                    }
                    else {
                        (<PullClassSymbol>parent).getInstanceType().addMember(methodSymbol, linkKind);
                    }

                }
                else {
                    parent.addMember(methodSymbol, linkKind);
                }
            }

            if (!isSignature) {
                this.pushParent(methodSymbol);
            }

            if (reUsedSymbol && cleanedPreviousDecls) {
                var callSigs = methodSymbol.getCallSignatures();
                var constructSigs = methodSymbol.getConstructSignatures();
                var indexSigs = methodSymbol.getIndexSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    methodSymbol.removeCallSignature(callSigs[i], false);
                }
                for (var i = 0; i < constructSigs.length; i++) {
                    methodSymbol.removeConstructSignature(constructSigs[i], false);
                }
                for (var i = 0; i < indexSigs.length; i++) {
                    methodSymbol.removeIndexSignature(indexSigs[i], false);
                }

                methodSymbol.invalidate();
            }

            var sigKind = PullElementKind.CallSignature;

            var signature = isSignature ? new PullSignatureSymbol(sigKind) : new PullDefinitionSignatureSymbol(sigKind);

            signature.addDeclaration(methodDeclaration);
            methodDeclaration.setSignatureSymbol(signature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(methodDeclaration), signature);

            // add the implicit call member for this function type
            methodSymbol.addSignature(signature);
        
            if (!isSignature) {
                var childDecls = methodDeclaration.getChildDecls();

                for (var i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            } 
        }

        // class constructor declarations
        public bindConstructorDeclarationToPullSymbol(constructorDeclaration: PullDecl) {
            var declKind = constructorDeclaration.getKind();
            var declFlags = constructorDeclaration.getDeclFlags();
            var constructorAST = this.semanticInfo.getASTForDecl(constructorDeclaration);

            var constructorName = constructorDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent();

            var reUsedSymbol = false;
            var cleanedPreviousDecls = false;

            var constructorSymbol: PullFunctionSymbol = null;

            var linkKind = SymbolLinkKind.ConstructorMethod;

            if (this.reBindingAfterChange) {
                var members = parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == constructorName && (member.getKind() & declKind)) {
                        reUsedSymbol = true;
                        constructorSymbol = <PullFunctionSymbol>member;

                        break;
                    }
                }
            
                if (constructorSymbol) {
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
                }
            }
            else {
                var candidateSym: PullSymbol;
                
                candidateSym = parent.getMemberByName(constructorName);

                if (candidateSym && (candidateSym.getKind() & linkKind)) {
                    constructorSymbol = <PullFunctionSymbol>candidateSym;
                }
            }


            if (!constructorSymbol) {
                constructorSymbol = new PullFunctionSymbol(constructorName, PullElementKind.ConstructorMethod);
            }

            constructorDeclaration.setSymbol(constructorSymbol);
            constructorSymbol.addDeclaration(constructorDeclaration);
            this.semanticInfo.setSymbolForAST(constructorAST, constructorSymbol);

            parent.addMember(constructorSymbol, SymbolLinkKind.ConstructorMethod);
        
            var constructorParent = parent;

            if (!isSignature) {
                this.pushParent(constructorSymbol);
            }

            if (reUsedSymbol && cleanedPreviousDecls) {
                var callSigs = constructorSymbol.getCallSignatures();
                var parentConstructSigs = constructorParent.getType().getConstructSignatures();

                for (var i = 0; i < callSigs.length; i++) {
                    constructorSymbol.removeCallSignature(callSigs[i], false);
                }
                for (var i = 0; i < parentConstructSigs.length; i++) {
                    constructorParent.removeConstructSignature(parentConstructSigs[i]);
                }

                constructorSymbol.invalidate();
                constructorParent.invalidate();
            }
            
            // add a call signature to the constructor method, and a construct signature to the parent class type
            var callSignature = isSignature ? new PullSignatureSymbol(PullElementKind.CallSignature) : new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);
            var constructSignature = isSignature ? new PullSignatureSymbol(PullElementKind.ConstructSignature) : new PullDefinitionSignatureSymbol(PullElementKind.ConstructSignature);

            callSignature.addDeclaration(constructorDeclaration);
            constructSignature.addDeclaration(constructorDeclaration);
            constructorDeclaration.setSignatureSymbol(callSignature);

            var constructorDeclAST = <FuncDecl>this.semanticInfo.getASTForDecl(constructorDeclaration);

            this.bindParameterSymbols(constructorDeclAST, constructSignature);
            this.bindParameterSymbols(constructorDeclAST, callSignature);

            constructorSymbol.addCallSignature(callSignature);
            parent.addConstructSignature(constructSignature);
        
            if (!isSignature) {
                var childDecls = constructorDeclaration.getChildDecls();

                for (var i = 0; i < childDecls.length; i++) {
                    this.bindDeclToPullSymbol(childDecls[i]);
                }

                this.popParent();
            }
        }

        public bindConstructSignatureDeclarationToPullSymbol(constructSignatureDeclaration: PullDecl) {
            var parent = this.getParent();

            var constructSigs = parent.getConstructSignatures();

            for (var i = 0; i < constructSigs.length; i++) {
                parent.removeConstructSignature(constructSigs[i], false);
            }

            parent.invalidate();
            
            var constructSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);

            constructSignature.addDeclaration(constructSignatureDeclaration);
            constructSignatureDeclaration.setSignatureSymbol(constructSignature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(constructSignatureDeclaration), constructSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(constructSignatureDeclaration), constructSignature);

            parent.addConstructSignature(constructSignature);    
        }

        public bindCallSignatureDeclarationToPullSymbol(callSignatureDeclaration: PullDecl) {
            var parent = this.getParent();

            // PULLTODO: For now, remove stale signatures from the function type, but we want to be smarter about this when
            // incremental parsing comes online
            var callSigs = parent.getConstructSignatures();

            for (var i = 0; i < callSigs.length; i++) {
                parent.removeConstructSignature(callSigs[i], false);
            }

            parent.invalidate();
            
            var callSignature = new PullSignatureSymbol(PullElementKind.CallSignature);

            callSignature.addDeclaration(callSignatureDeclaration);
            callSignatureDeclaration.setSignatureSymbol(callSignature);

            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(callSignatureDeclaration), callSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(callSignatureDeclaration), callSignature);

            parent.addCallSignature(callSignature);
        }

        public bindIndexSignatureDeclarationToPullSymbol(indexSignatureDeclaration: PullDecl) {
            var parent = this.getParent();

            var indexSigs = parent.getIndexSignatures();

            for (var i = 0; i < indexSigs.length; i++) {
                parent.removeIndexSignature(indexSigs[i], false);
            }

            parent.invalidate();
            
            var indexSignature = new PullSignatureSymbol(PullElementKind.IndexSignature);

            indexSignature.addDeclaration(indexSignatureDeclaration);
            indexSignatureDeclaration.setSignatureSymbol(indexSignature);
            
            this.bindParameterSymbols(<FuncDecl>this.semanticInfo.getASTForDecl(indexSignatureDeclaration), indexSignature);

            this.semanticInfo.setSymbolForAST(this.semanticInfo.getASTForDecl(indexSignatureDeclaration), indexSignature);

            parent.addIndexSignature(indexSignature);        
        }

        // binding
        public bindDeclToPullSymbol(decl: PullDecl, rebind = false) {

            if (rebind) {
                this.startingDeclForRebind = lastBoundPullDeclId;
                this.reBindingAfterChange = true;
            }

            switch (decl.getKind()) {

                case PullElementKind.Script:
                    var childDecls = decl.getChildDecls();
                    for (var i = 0; i < childDecls.length; i++) {
                        this.bindDeclToPullSymbol(childDecls[i]);
                    }
                    break;

                case PullElementKind.Module:
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

        public bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration: PullDecl) { }
        public bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration: PullDecl) { }
        
        public bindDeclsForUnit(filePath: string, rebind = false) {
            this.setUnit(filePath);

            var topLevelDecls = this.semanticInfo.getTopLevelDecls();

            for (var i = 0; i < topLevelDecls.length; i++) {
                this.bindDeclToPullSymbol(topLevelDecls[i], rebind);
            }
        }
    }
}