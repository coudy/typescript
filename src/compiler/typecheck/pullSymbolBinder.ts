// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export class PullSymbolBinder {

        private parentChain: PullTypeSymbol[] = [];
        private declPath: string[] = [];
        public semanticInfo: SemanticInfo;

        public reBindingAfterChange = false;
        public startingDeclForRebind = pullDeclId; // note that this gets set on creation

        constructor (public semanticInfoChain: SemanticInfoChain, public useFidelity = false) {
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
                        return symbol;
                    }
                    copyOfContextSymbolPath.length -= 2;
                    copyOfContextSymbolPath[copyOfContextSymbolPath.length] = name;
                }
            }

            // finally, try searching globally
            symbol = this.semanticInfoChain.findSymbol([name], declKind);

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
            var moduleSymbol: PullTypeSymbol = <PullTypeSymbol>this.findSymbolInContext(modName, PullElementKind.Module, []);
            var createdNewSymbol = false;

            if (!moduleSymbol) {
                var declKind = moduleDecl.getDeclFlags() & PullElementFlags.Enum ? PullElementKind.Enum : PullElementKind.Module;
                var moduleSymbol = new PullTypeSymbol(modName, declKind);
                createdNewSymbol = true;
            }

            if (moduleDecl) {
                moduleSymbol.addDeclaration(moduleDecl);
                moduleDecl.setSymbol(moduleSymbol);            
            }

            this.semanticInfo.setSymbolForDecl(moduleDecl, moduleSymbol);
        
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
            var createdNewSymbol = false;

            var declKind = PullElementKind.Enum;

            var enumSymbol = new PullTypeSymbol(enumName, declKind);

            if (enumDeclaration) {
                enumSymbol.addDeclaration(enumDeclaration);
                enumDeclaration.setSymbol(enumSymbol);            
            }

            this.semanticInfo.setSymbolForDecl(enumDeclaration, enumSymbol);
        
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
            var parentHadSymbol = false;

            var parent = this.getParent();

            if (this.reBindingAfterChange && parent) {
                // see if the parent already has a symbol for this class
                var members = parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == className && member.getKind() == PullElementKind.Class) {
                        parentHadSymbol = true;
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
                            }
                        }

                        break;
                    }
                }
            }

            if (!parentHadSymbol) {
                classSymbol = new PullClassSymbol(className);
                instanceSymbol = new PullClassInstanceSymbol(className);
                classSymbol.setInstanceType(instanceSymbol);
            }        
        
            classSymbol.addDeclaration(classDecl);
            instanceSymbol.addDeclaration(classDecl);

            classDecl.setSymbol(classSymbol);

            this.semanticInfo.setSymbolForDecl(classDecl, classSymbol);
        
            if (parent && !parentHadSymbol) {
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
            if (parentHadSymbol) {
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
            var interfaceSymbol: PullTypeSymbol = <PullTypeSymbol>this.findSymbolInContext(interfaceName, PullElementKind.Interface, []);
            var createdNewSymbol = false;

            if (!interfaceSymbol) {
                interfaceSymbol = new PullTypeSymbol(interfaceName, PullElementKind.Interface);
                createdNewSymbol = true;
            }

            if (interfaceDecl) {
                interfaceSymbol.addDeclaration(interfaceDecl);
                interfaceDecl.setSymbol(interfaceSymbol);
            }

            this.semanticInfo.setSymbolForDecl(interfaceDecl, interfaceSymbol);
        
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

        // variables
        public bindVariableDeclarationToPullSymbol(variableDeclaration: PullDecl) {
            var declFlags = variableDeclaration.getDeclFlags();
            var declType = variableDeclaration.getKind();

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

            if (variableDeclaration) {
                variableSymbol.addDeclaration(variableDeclaration);
                variableDeclaration.setSymbol(variableSymbol);
            }

            if (parent && !parentHadSymbol) {
                variableSymbol.addOutgoingLink(parent, SymbolLinkKind.ContainedBy);
            }
        }

        // properties
        public bindPropertyDeclarationToPullSymbol(propertyDeclaration: PullDecl) {
            var declFlags = propertyDeclaration.getDeclFlags();
            var declKind = propertyDeclaration.getKind();

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

            var parentHadSymbol = false;

            var parent = this.getParent();

            if (this.reBindingAfterChange && parent) {
                // see if the parent already has a symbol for this class
                var members = parent.hasBrand() && !isStatic ? (<PullClassSymbol>parent).getInstanceType().getMembers() : parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == declName && member.getKind() == declKind) {
                        parentHadSymbol = true;
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

            if (!parentHadSymbol) {
                propertySymbol = new PullSymbol(declName, declKind);
            }        

            if (propertyDeclaration) {
                propertySymbol.addDeclaration(propertyDeclaration);
                propertyDeclaration.setSymbol(propertySymbol);
            }

            if (isOptional) {
                propertySymbol.setIsOptional();
            }

            if (parent && !parentHadSymbol) {
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
        public bindParameterSymbols(parameters: ParameterListSyntax, signatureSymbol: PullSignatureSymbol) {
            // create a symbol for each ast
            // if it's a property, add the symbol to the enclosing type's member list
            var decl: PullDecl = null;

            var parameterSymbol: PullSymbol = null;
            var isProperty = false;
            var parameter: ParameterSyntax;

            var parameterSyntaxList = parameters.parameters();
            var parameterCount = parameterSyntaxList.nonSeparatorCount();

            if (parameterCount) {

                for (var i = 0; i < parameterCount; i++) {

                    parameter = <ParameterSyntax>parameterSyntaxList.nonSeparatorAt(i);

                    decl = this.semanticInfo.getDeclForSyntaxElement(parameter);

                    parameterSymbol = new PullSymbol(parameter.identifier().text(), PullElementKind.Variable);
                
                    if (decl) {
                        parameterSymbol.addDeclaration(decl);
                        decl.setSymbol(parameterSymbol);
                    }

                    signatureSymbol.addParameter(parameterSymbol);
                }
            }        
        }

        // function declarations
        public bindFunctionDeclarationToPullSymbol(functionDeclaration: PullDecl) {  
            var declKind = functionDeclaration.getKind();
            var declFlags = functionDeclaration.getDeclFlags();

            var isExported = (declFlags & PullElementFlags.Exported) != 0;

            var funcName = functionDeclaration.getName();

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent();
            var parentHadSymbol = false;

            // PULLREVIEW: On a re-bind, there's no need to search far-and-wide: just look in the parent's member list
            var functionSymbol: PullFunctionSymbol = null;

            if (this.reBindingAfterChange) {
                if (parent) { // PULLREVIEW: What if the parent's a function?
                    var members = parent.getMembers();
                    var member: PullSymbol = null;

                    for (var i = 0 ; i < members.length; i++) {
                        member = members[i];

                        if (member.getName() == funcName && (member.getKind() & declKind)) {
                            parentHadSymbol = true;
                            functionSymbol = <PullFunctionSymbol>member;

                            break;
                        }
                    }
                }
                else {
                    functionSymbol = <PullFunctionSymbol>this.findSymbolInContext(funcName, declKind, []);
                }

                if (functionSymbol) {
                    // prune out-of-date decls...
                    var decls = functionSymbol.getDeclarations();
                    var scriptName = functionDeclaration.getScriptName();

                    for (var j = 0; j < decls.length; j++) {
                        if (decls[j].getScriptName() == scriptName && decls[j].getDeclID() < this.startingDeclForRebind) {
                            functionSymbol.removeDeclaration(decls[j]);
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
                }

                if (candidateSym && (candidateSym.getKind() & PullElementKind.Function)) {
                    functionSymbol = <PullFunctionSymbol>candidateSym;
                }
            }

            if (!functionSymbol) {
                // PULLTODO: Make sure that we properly flag signature decl types when collecting decls
                functionSymbol = new PullFunctionSymbol(funcName, PullElementKind.Function);
            }

            if (functionDeclaration) {
                functionDeclaration.setSymbol(functionSymbol);
                functionSymbol.addDeclaration(functionDeclaration);
                this.semanticInfo.setSymbolForDecl(functionDeclaration, functionSymbol);
            }
        
            if (parent && !parentHadSymbol) {
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
            if (parentHadSymbol) {
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

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(functionDeclaration);
            var functionSignatureElement: FunctionSignatureSyntax = (<any>syntaxElement).functionSignature();
            var parameters = functionSignatureElement.callSignature().parameterList();

            this.bindParameterSymbols(parameters, signature);

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

        public bindFunctionExpressionToPullSymbol(functionExpressionTypeDeclaration: PullDecl) {
            var declKind = functionExpressionTypeDeclaration.getKind();
            var declFlags = functionExpressionTypeDeclaration.getDeclFlags();

            // 1. Test for existing decl - if it exists, use its symbol
            // 2. If no other decl exists, create a new symbol and use that one

            var functionSymbol = new PullFunctionSymbol("", PullElementKind.Function);

            if (functionExpressionTypeDeclaration) {
                functionExpressionTypeDeclaration.setSymbol(functionSymbol);
                functionSymbol.addDeclaration(functionExpressionTypeDeclaration);
                this.semanticInfo.setSymbolForDecl(functionExpressionTypeDeclaration, functionSymbol);
            }
        
            this.pushParent(functionSymbol);

            var signature = new PullDefinitionSignatureSymbol(PullElementKind.CallSignature);

            signature.addDeclaration(functionExpressionTypeDeclaration);
            functionExpressionTypeDeclaration.setSignatureSymbol(signature);

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(functionExpressionTypeDeclaration);
            var functionSignatureElement: FunctionSignatureSyntax = (<any>syntaxElement).functionSignature();
            var parameters = functionSignatureElement.callSignature().parameterList();

            this.bindParameterSymbols(parameters, signature);

            // add the implicit call member for this function type
            functionSymbol.addSignature(signature);
        
            var childDecls = functionExpressionTypeDeclaration.getChildDecls();

            for (var i = 0; i < childDecls.length; i++) {
                this.bindDeclToPullSymbol(childDecls[i]);
            }

            this.popParent();
        }

        // method declarations
        public bindMethodDeclarationToPullSymbol(methodDeclaration: PullDecl) {
            var declKind = methodDeclaration.getKind();
            var declFlags = methodDeclaration.getDeclFlags();

            var isPrivate = (declFlags & PullElementFlags.Private) != 0;
            var isStatic = (declFlags & PullElementFlags.Static) != 0;

            if (declFlags & PullElementFlags.Static) {
                isStatic = true;
            }
            if (declFlags & PullElementFlags.Private) {
                isPrivate = true;
            }

            var methodName = methodDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent();

            var parentHadSymbol = false;

            var methodSymbol: PullFunctionSymbol = null;

            var linkKind = isStatic ? SymbolLinkKind.StaticMember :
                            isPrivate ? SymbolLinkKind.PrivateMember : SymbolLinkKind.PublicMember;

            if (this.reBindingAfterChange) {
                var members = parent.hasBrand() && !isStatic ? (<PullClassSymbol>parent).getInstanceType().getMembers() : parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == methodName && (member.getKind() & declKind)) {
                        parentHadSymbol = true;
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

            if (methodDeclaration) {
                methodDeclaration.setSymbol(methodSymbol);
                methodSymbol.addDeclaration(methodDeclaration);
                this.semanticInfo.setSymbolForDecl(methodDeclaration, methodSymbol);
            }
        
            if (!parentHadSymbol) {

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

            if (parentHadSymbol) {
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

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(methodDeclaration);
            var functionSignatureElement: FunctionSignatureSyntax = (<any>syntaxElement).functionSignature();
            var parameters = functionSignatureElement.callSignature().parameterList();

            this.bindParameterSymbols(parameters, signature);

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

            var constructorName = constructorDeclaration.getName();

            var isSignature: bool = (declFlags & PullElementFlags.Signature) != 0;

            var parent = this.getParent();

            var parentHadSymbol = false;

            var constructorSymbol: PullFunctionSymbol = null;

            var linkKind = SymbolLinkKind.ConstructorMethod;

            if (this.reBindingAfterChange) {
                var members = parent.getMembers();
                var member: PullSymbol = null;

                for (var i = 0 ; i < members.length; i++) {
                    member = members[i];

                    if (member.getName() == constructorName && (member.getKind() & declKind)) {
                        parentHadSymbol = true;
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

            if (constructorDeclaration) {
                constructorDeclaration.setSymbol(constructorSymbol);
                constructorSymbol.addDeclaration(constructorDeclaration);
                this.semanticInfo.setSymbolForDecl(constructorDeclaration, constructorSymbol);
            }

            parent.addMember(constructorSymbol, SymbolLinkKind.ConstructorMethod);
        
            var constructorParent = parent;

            if (!isSignature) {
                this.pushParent(constructorSymbol);
            }

            if (parentHadSymbol) {
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

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(constructorDeclaration);
            var parameters = (<ConstructorDeclarationSyntax>syntaxElement).parameterList();

            this.bindParameterSymbols(parameters, callSignature);
            this.bindParameterSymbols(parameters, constructSignature);

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

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(constructSignatureDeclaration);
            var callSignatureSyntax: CallSignatureSyntax = (<ConstructSignatureSyntax>syntaxElement).callSignature();
            var parameters = callSignatureSyntax.parameterList();

            this.bindParameterSymbols(parameters, constructSignature);

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

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(callSignatureDeclaration);
            var parameters = (<CallSignatureSyntax>syntaxElement).parameterList();

            this.bindParameterSymbols(parameters, callSignature);

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

            var syntaxElement = this.semanticInfo.getSyntaxElementForDecl(indexSignatureDeclaration);
            var parameter = (<IndexSignatureSyntax>syntaxElement).parameter();

            if (parameter) {
                var paramDecl = this.semanticInfo.getDeclForSyntaxElement(parameter);

                var parameterSymbol = new PullSymbol(parameter.identifier().text(), PullElementKind.Variable);

                if (paramDecl) {
                    parameterSymbol.addDeclaration(paramDecl);
                    paramDecl.setSymbol(parameterSymbol);
                }

                indexSignature.addParameter(parameterSymbol);
            }

            parent.addIndexSignature(indexSignature);        
        }

        // binding
        public bindDeclToPullSymbol(decl: PullDecl, rebind = false) {

            if (rebind) {
                this.startingDeclForRebind = pullDeclId;
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

                default:
                    throw new Error("Unrecognized type declaration");
            }
        }

        public bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration: PullDecl) { }
        public bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration: PullDecl) { }
        public bindObjectTypeDeclarationToPullSymbol(objectTypeDeclaration: PullDecl) { }
        public bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration: PullDecl) { }
        public bindConstructorTypeDeclarationToPullSymbol(constructorTypeDeclaration: PullDecl) { }

        public bindDeclsForUnit(filePath: string, rebind = false) {
            this.setUnit(filePath);

            var topLevelDecls = this.semanticInfo.getTopLevelDecls();

            for (var i = 0; i < topLevelDecls.length; i++) {
                this.bindDeclToPullSymbol(topLevelDecls[i], rebind);
            }
        }
    }
}