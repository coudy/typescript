// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />


module TypeScript {
    export interface IPullTypeCollection {
        // returns null when types are exhausted
        getLength(): number;
        setTypeAtIndex(index: number, type: PullTypeSymbol): void;
        getTypeAtIndex(index: number): PullTypeSymbol;
    }

    export interface IPullResolutionData {
        actuals: PullTypeSymbol[];
        exactCandidates: PullSignatureSymbol[];
        conversionCandidates: PullSignatureSymbol[];

        id: number;
    }

    export class PullResolutionDataCache {
        public cacheSize = 16;
        public rdCache: IPullResolutionData[] = [];
        public nextUp: number = 0;

        constructor() {
            for (var i = 0; i < this.cacheSize; i++) {
                this.rdCache[i] = {
                    actuals: <PullTypeSymbol[]>[],
                    exactCandidates: <PullSignatureSymbol[]>[],
                    conversionCandidates: <PullSignatureSymbol[]>[],
                    id: i
                };
            }
        }

        public getResolutionData(): IPullResolutionData {
            var rd: IPullResolutionData = null;

            if (this.nextUp < this.cacheSize) {
                rd = this.rdCache[this.nextUp];
            }

            if (rd == null) {
                this.cacheSize++;
                rd = {
                    actuals: <PullTypeSymbol[]>[],
                    exactCandidates: <PullSignatureSymbol[]>[],
                    conversionCandidates: <PullSignatureSymbol[]>[],
                    id: this.cacheSize
                };
                this.rdCache[this.cacheSize] = rd;
            }

            // cache operates as a stack - RD is always served up in-order
            this.nextUp++;

            return rd;
        }

        public returnResolutionData(rd: IPullResolutionData) {
            // Pop to save on array allocations, which are a bottleneck
            // REVIEW: On some VMs, Array.pop doesn't always pop the last value in the array
            rd.actuals.length = 0;
            rd.exactCandidates.length = 0;
            rd.conversionCandidates.length = 0;

            this.nextUp = rd.id;
        }
    }

    export interface PullApplicableSignature {
        signature: PullSignatureSymbol;
        hadProvisionalErrors: bool;
    }

    export interface PullAdditionalCallResolutionData {
        targetSymbol: PullSymbol;
        resolvedSignatures: PullSignatureSymbol[];
        candidateSignature: PullSignatureSymbol;
    }

    // The resolver associates types with a given AST
    export class PullTypeResolver {
        private cachedArrayInterfaceType: PullTypeSymbol = null;
        private cachedNumberInterfaceType: PullTypeSymbol = null;
        private cachedStringInterfaceType: PullTypeSymbol = null;
        private cachedBooleanInterfaceType: PullTypeSymbol = null;
        private cachedObjectInterfaceType: PullTypeSymbol = null;
        private cachedFunctionInterfaceType: PullTypeSymbol = null;
        private cachedIArgumentsInterfaceType: PullTypeSymbol = null;
        private cachedRegExpInterfaceType: PullTypeSymbol = null;

        private cachedFunctionArgumentsSymbol: PullSymbol = null;

        private assignableCache: any[] = <any>{};
        private subtypeCache: any[] = <any>{};
        private identicalCache: any[] = <any>{};

        private resolutionDataCache = new PullResolutionDataCache();

        private currentUnit: SemanticInfo = null;

        constructor(private compilationSettings: CompilationSettings,
                    public semanticInfoChain: SemanticInfoChain,
                    private unitPath: string) {
            this.cachedArrayInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Array", [], PullElementKind.Interface);
            this.cachedNumberInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Number", [], PullElementKind.Interface);
            this.cachedStringInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("String", [], PullElementKind.Interface);
            this.cachedBooleanInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Boolean", [], PullElementKind.Interface);
            this.cachedObjectInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Object", [], PullElementKind.Interface);
            this.cachedFunctionInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Function", [], PullElementKind.Interface);
            this.cachedIArgumentsInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("IArguments", [], PullElementKind.Interface);
            this.cachedRegExpInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("RegExp", [], PullElementKind.Interface);

            this.cachedFunctionArgumentsSymbol = new PullSymbol("arguments", PullElementKind.Variable);
            this.cachedFunctionArgumentsSymbol.setType(this.cachedIArgumentsInterfaceType ? this.cachedIArgumentsInterfaceType : this.semanticInfoChain.anyTypeSymbol);
            this.cachedFunctionArgumentsSymbol.setResolved();

            this.currentUnit = this.semanticInfoChain.getUnit(unitPath);
        }

        public getUnitPath() { return this.unitPath; }

        public setUnitPath(unitPath: string) {
            this.unitPath = unitPath;

            this.currentUnit = this.semanticInfoChain.getUnit(unitPath);
        }

        public getDeclForAST(ast: AST, unitPath?: string) {
            return this.semanticInfoChain.getDeclForAST(ast, unitPath ? unitPath : this.unitPath);
        }

        public getSymbolForAST(ast: AST, context: PullTypeResolutionContext, unitPath?: string) {
            return this.semanticInfoChain.getSymbolForAST(ast, unitPath ? unitPath : this.unitPath);
        }

        public setSymbolForAST(ast: AST, symbol: PullSymbol, context: PullTypeResolutionContext, unitPath?: string): void {

            if (context && (context.inProvisionalResolution() || context.inSpecialization)) {
                return;
            }

            this.semanticInfoChain.setSymbolForAST(ast, symbol, unitPath ? unitPath : this.unitPath);
        }

        public getASTForSymbol(symbol: PullSymbol, unitPath?: string) {
            return this.semanticInfoChain.getASTForSymbol(symbol, unitPath ? unitPath : this.unitPath);
        }

        public getASTForDecl(decl: PullDecl) {
            return this.semanticInfoChain.getASTForDecl(decl, decl.getScriptName());
        }

        public getCachedArrayType() {
            return this.cachedArrayInterfaceType;
        }

        private getNewErrorTypeSymbol(diagnostic: PullDiagnostic): PullErrorTypeSymbol {
            return new PullErrorTypeSymbol(diagnostic, this.semanticInfoChain.anyTypeSymbol);
        }

        // returns a list of decls leading up to decl, inclusive
        // PULLTODO: Don't bother using spans - obtain cached Decls from syntax nodes
        public getPathToDecl(decl: PullDecl): PullDecl[] {

            if (!decl) {
                return [];
            }

            //var parentDecl: PullDecl = decl.getParentDecl();
            //var decls: PullDecl[] = [];

            //while (parentDecl) {
            //    decls[decls.length] = parentDecl;
            //    parentDecl = parentDecl.getParentDecl();
            //}

            //return decls;

            var decls: PullDecl[] = [];
            var searchDecls = this.semanticInfoChain.getUnit(decl.getScriptName()).getTopLevelDecls();

            var spanToFind = decl.getSpan();
            var candidateSpan: TextSpan = null;
            var searchKinds = PullElementKind.SomeType | PullElementKind.SomeFunction;
            var found = false;

            while (true) {
                // Of the top-level decls, find the one to search off of
                found = false;
                for (var i = 0; i < searchDecls.length; i++) {
                    candidateSpan = searchDecls[i].getSpan();

                    if (spanToFind.start() >= candidateSpan.start() && spanToFind.end() <= candidateSpan.end()) {
                        if (searchDecls[i].getKind() & searchKinds) { // only consider types, which have scopes
                            if (!(searchDecls[i].getKind() & PullElementKind.ObjectLiteral)) {
                                decls[decls.length] = searchDecls[i];
                            }
                            searchDecls = searchDecls[i].getChildDecls();
                            found = true;
                        }
                    }
                }

                if (!found) {
                    break;
                }
            }

            // if the decl is a function expression, it would not have been parented during binding
            if (decls.length && (decl.getKind() & (PullElementKind.SomeFunction |
                                                    PullElementKind.ObjectType |
                                                    PullElementKind.FunctionType |
                                                    PullElementKind.ConstructorType)) &&
                (decls[decls.length - 1] != decl)) {

                var parent = decl.getParentDecl();

                if (parent && decls[decls.length - 1] != parent && !(parent.getKind() & PullElementKind.ObjectLiteral)) {
                    decls[decls.length] = parent;
                }

                decls[decls.length] = decl;
            }

            return decls;
        }

        public getEnclosingDecl(decl: PullDecl): PullDecl {
            var declPath = this.getPathToDecl(decl);

            if (!declPath.length) {
                return null;
            }
            else if (declPath.length > 1 && declPath[declPath.length - 1] == decl) {
                return declPath[declPath.length - 2];
            }
            else {
                return declPath[declPath.length - 1];
            }
        }

        //  Given a path to a name, e.g. ["foo"] or ["Foo", "Baz", "bar"], find the associated symbol
        public findSymbolForPath(pathToName: string[], enclosingDecl: PullDecl, declKind: PullElementKind): PullSymbol {

            if (!pathToName.length) {
                return null;
            }

            var symbolName = pathToName[pathToName.length - 1];
            var contextDeclPath = this.getPathToDecl(enclosingDecl);

            var contextSymbolPath: string[] = [];
            var nestedSymbolPath: string[] = [];

            var i = 0;

            // first, search within the given symbol path
            // (copy path to name so as not to mutate the input array)
            for (i = 0; i < pathToName.length; i++) {
                nestedSymbolPath[nestedSymbolPath.length] = pathToName[i];
            }

            var symbol: PullSymbol = null;

            while (nestedSymbolPath.length >= 2) {
                symbol = this.semanticInfoChain.findSymbol(nestedSymbolPath, declKind);

                if (symbol) {
                    return symbol;
                }
                nestedSymbolPath.length -= 2;
                nestedSymbolPath[nestedSymbolPath.length] = symbolName;
            }

            // next, try the enclosing context
            for (i = 0; i < contextDeclPath.length; i++) {
                contextSymbolPath[contextSymbolPath.length] = contextDeclPath[i].getName();
            }

            for (i = 0; i < pathToName.length; i++) {
                contextSymbolPath[contextSymbolPath.length] = pathToName[i];
            }

            while (contextSymbolPath.length >= 2) {
                symbol = this.semanticInfoChain.findSymbol(contextSymbolPath, declKind);

                if (symbol) {
                    return symbol;
                }
                contextSymbolPath.length -= 2;
                contextSymbolPath[contextSymbolPath.length] = symbolName;
            }

            // finally, try searching globally
            symbol = this.semanticInfoChain.findSymbol([symbolName], declKind);

            return symbol;
        }

        // search for an unqualified symbol name within a given decl path
        public getSymbolFromDeclPath(symbolName: string, declPath: PullDecl[], declSearchKind: PullElementKind): PullSymbol {
            var symbol: PullSymbol = null;

            // search backwards through the decl list
            //  - if the decl in question is a function, search its members
            //  - if the decl in question is a module, search the decl then the symbol
            //  - Otherwise, search globally

            var decl: PullDecl = null;
            var childDecls: PullDecl[];
            var declSymbol: PullTypeSymbol = null;
            var declMembers: PullSymbol[];
            var pathDeclKind: PullElementKind;
            var valDecl: PullDecl = null;
            var kind: PullElementKind;
            var instanceSymbol: PullSymbol = null;
            var instanceType: PullTypeSymbol = null;

            for (var i = declPath.length - 1; i >= 0; i--) {
                decl = declPath[i];
                pathDeclKind = decl.getKind();

                if (pathDeclKind & PullElementKind.Container) {

                    // first check locally
                    childDecls = decl.searchChildDecls(symbolName, (declSearchKind & PullElementKind.SomeType) !== 0);

                    if (childDecls.length) {
                        return childDecls[0].getSymbol();
                    }

                    if (declSearchKind & PullElementKind.SomeValue) {
                        valDecl = decl.getValueDecl();

                        if (valDecl) {
                            decl = valDecl;
                        }
                    }

                    // otherwise, check the members
                    declSymbol = decl.getSymbol().getType();
                    declMembers = declSymbol.getMembers();

                    for (var j = 0; j < declMembers.length; j++) {
                        // PULLTODO: declkind should equal declkind, or is it ok to just mask the value?
                        if (declMembers[j].getName() == symbolName) {
                            kind = declMembers[j].getKind();

                            if ((kind & declSearchKind) != 0) {
                                return declMembers[j];
                            }
                        }
                    }

                }
                else if ((declSearchKind & PullElementKind.SomeType) || !(pathDeclKind & PullElementKind.Class)) {
                    childDecls = decl.searchChildDecls(symbolName, (declSearchKind & PullElementKind.SomeType) !== 0);

                    if (childDecls.length) {
                        return childDecls[0].getSymbol();
                    }
                }
            }

            // otherwise, search globally
            symbol = this.semanticInfoChain.findSymbol([symbolName], declSearchKind);

            return symbol;
        }

        public getVisibleSymbolsFromDeclPath(declPath: PullDecl[]): PullSymbol[] {
            var symbols: PullSymbol[] = [];

            var decl: PullDecl = null;
            var childDecls: PullDecl[];
            var pathDeclKind: PullElementKind;
            var declSearchKind: PullElementKind = PullElementKind.SomeType | PullElementKind.SomeValue;
            var i = 0;
            var j = 0;
            var m = 0;
            var n = 0;

            var addSymbolsFromDecls = (decls: PullDecl[]) => {
                if (decls.length) {
                    var n = decls.length;
                    for (var j = 0; j < n; j++) {
                        if (decls[j].getKind() & declSearchKind) {
                            var symbol = decls[j].getSymbol();
                            if (symbol) {
                                symbols.push(symbol);
                            }
                        }
                    }
                }
            };

            for (i = declPath.length - 1; i >= 0; i--) {
                decl = declPath[i];
                pathDeclKind = decl.getKind();

                if (pathDeclKind & PullElementKind.SomeContainer) {
                    // Add locals
                    addSymbolsFromDecls(decl.getChildDecls())

                    // Add members
                    var declSymbol = <PullTypeSymbol>decl.getSymbol();
                    var members: PullSymbol[] = [];
                    if (declSymbol) {
                        // Look up all symbols on the module type
                        members = declSymbol.getMembers();
                    }

                    // Look up all symbols on the module instance type if it exists
                    var instanceSymbol = (<PullContainerTypeSymbol > declSymbol).getInstanceSymbol();
                    var searchTypeSymbol = instanceSymbol && instanceSymbol.getType();

                    if (searchTypeSymbol) {
                        members = members.concat(searchTypeSymbol.getMembers());
                    }

                    for (j = 0; j < members.length; j++) {
                        // PULLTODO: declkind should equal declkind, or is it ok to just mask the value?
                        if ((members[j].getKind() & declSearchKind) != 0) {
                            symbols.push(members[j]);
                        }
                    }
                    
                }
                else /*if (pathDeclKind & DeclKind.Function)*/ {
                    addSymbolsFromDecls(decl.getChildDecls())
                }
            }

            // Get the global symbols
            var units = this.semanticInfoChain.units;

            for (i = 0, n = units.length; i < n; i++) {
                var unit = units[i];
                if (unit === this.currentUnit && declPath.length != 0) {
                    // Current unit has already been processed. skip it.
                    continue;
                }
                var topLevelDecls = unit.getTopLevelDecls();
                if (topLevelDecls.length) {
                    for (j = 0, m = topLevelDecls.length; j < m; j++) {
                        var topLevelDecl = topLevelDecls[j];
                        if (topLevelDecl.getKind() === PullElementKind.Script || topLevelDecl.getKind() === PullElementKind.Global) {
                            addSymbolsFromDecls(topLevelDecl.getChildDecls());
                        }
                    }
                }
            }

            return symbols;
        }

        public getVisibleSymbols(enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol[] {

            var declPath: PullDecl[] = enclosingDecl !== null ? this.getPathToDecl(enclosingDecl) : [];

            if (enclosingDecl && !declPath.length) {
                declPath = [enclosingDecl];
            }

            return this.getVisibleSymbolsFromDeclPath(declPath);
        }

        public getVisibleMembersFromExpression(expression: AST, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol[] {
            var lhs: PullSymbol = this.resolveStatementOrExpression(expression, false, enclosingDecl, context);
            var lhsType = lhs.getType();

            if (!lhsType) {
                return null;
            }

            if (this.isAnyOrEquivalent(lhsType)) {
                return null;
            }

            // Figure out if privates are available under the current scope
            var includePrivate = false;
            var containerSymbol = lhsType;
            if (containerSymbol.getKind() === PullElementKind.ConstructorType) {
                containerSymbol = containerSymbol.getConstructSignatures()[0].getReturnType();
            }

            if (containerSymbol && containerSymbol.isClass()) {
                var declPath = this.getPathToDecl(enclosingDecl);
                if (declPath && declPath.length) {
                    var declarations = containerSymbol.getDeclarations();
                    for (var i = 0, n = declarations.length; i < n; i++) {
                        var declaration = declarations[i];
                        if (declPath.indexOf(declaration) >= 0) {
                            includePrivate = true;
                            break;
                        }
                    }
                }
            }

            if (context.searchTypeSpace) {
                return lhsType.getAllMembers(PullElementKind.SomeType, includePrivate);
            }
            else {
                if (lhsType == this.semanticInfoChain.numberTypeSymbol && this.cachedNumberInterfaceType) {
                    lhsType = this.cachedNumberInterfaceType;
                }
                else if (lhsType == this.semanticInfoChain.stringTypeSymbol && this.cachedStringInterfaceType) {
                    lhsType = this.cachedStringInterfaceType;
                }
                else if (lhsType == this.semanticInfoChain.boolTypeSymbol && this.cachedBooleanInterfaceType) {
                    lhsType = this.cachedBooleanInterfaceType;
                }

                if (!lhsType.isResolved()) {
                    var potentiallySpecializedType = <PullTypeSymbol>this.resolveDeclaredSymbol(lhsType, enclosingDecl, context);

                    if (potentiallySpecializedType != lhsType) {
                        if (!lhs.isType()) {
                            context.setTypeInContext(lhs, potentiallySpecializedType);
                        }

                        lhsType = potentiallySpecializedType;
                    }
                }

                var members = lhsType.getAllMembers(PullElementKind.SomeValue, includePrivate);
                if (lhsType.isContainer()) {
                    var associatedInstance = (<PullContainerTypeSymbol>lhsType).getInstanceSymbol();
                    if (associatedInstance) {
                        var instanceType = associatedInstance.getType();
                        var instanceMembers = instanceType.getAllMembers(PullElementKind.SomeValue, includePrivate);
                        members = members.concat(instanceMembers);
                    }
                }

                // Add any additional members
                /// TODO: add "prototype" for classes
                //if (lhsType.isClass()) {
                //    memebers.push("prototype");
                //}

                // could be an enum
                if ((lhsType.getKind() == PullElementKind.Enum) && this.cachedNumberInterfaceType) {
                    members = members.concat(this.cachedNumberInterfaceType.getAllMembers(PullElementKind.SomeValue, false));
                }

                return members;
            }
        }

        public isAnyOrEquivalent(type: PullTypeSymbol) {
            return (type == this.semanticInfoChain.anyTypeSymbol) || type.isError();
        }

        public isTypeArgumentOrWrapper(type: PullTypeSymbol) {
            if (!type) {
                return false;
            }

            if (!type.isGeneric()) {
                return false;
            }

            if (type.isTypeParameter()) {
                return true;
            }

            if (type.isArray()) {
                return this.isTypeArgumentOrWrapper((<PullArrayTypeSymbol>type).getElementType());
            }

            var typeArguments = type.getTypeArguments();

            if (typeArguments) {
                for (var i = 0; i < typeArguments.length; i++) {
                    if (this.isTypeArgumentOrWrapper(typeArguments[i])) {
                        return true;
                    }
                }
            }

            return false;
        }

        public findTypeSymbolForDynamicModule(idText: string, currentFileName: string, search: (id: string) =>PullTypeSymbol): PullTypeSymbol {
            var originalIdText = idText;
            var symbol = search(idText);
           
            if (symbol === null) {
                // perhaps it's a dynamic module?
                if (!symbol) {
                    idText = swapQuotes(originalIdText);
                    symbol = search(idText);
                }

                // Check the literal path first
                if (!symbol) {
                    idText = stripQuotes(originalIdText) + ".ts";
                    symbol = search(idText);
                }

                if (!symbol) {
                    idText = stripQuotes(originalIdText) + ".d.ts";
                    symbol = search(idText);
                }

                // If the literal path doesn't work, begin the search
                if (!symbol && !isRelative(originalIdText)) {
                    // check the full path first, as this is the most likely scenario
                    idText = originalIdText;

                    var strippedIdText = stripQuotes(idText);

                    // REVIEW: Technically, we shouldn't have to normalize here - we should normalize in addUnit.
                    // Still, normalizing here alows any language services to be free of assumptions
                    var path = getRootFilePath(switchToForwardSlashes(currentFileName));

                    while (symbol === null && path != "") {
                        idText = normalizePath(path + strippedIdText + ".ts");
                        symbol = search(idText);

                        // check for .d.ts
                        if (symbol === null) {
                            idText = changePathToDTS(idText);
                            symbol = search(idText);
                        }

                        if (symbol === null) {
                            if(path === '/') {
                                path = '';
                            } else {
                                path = normalizePath(path + "..");
                                path = path && path != '/' ? path + '/' : path;
                            }
                        }
                    }
                }
            }

            return symbol;
        }

        // Declaration Resolution

        public resolveDeclaration(declAST: AST, context: PullTypeResolutionContext, enclosingDecl?: PullDecl): PullSymbol {
            switch (declAST.nodeType) {
                case NodeType.Script:
                    return null;

                case NodeType.ModuleDeclaration:
                    return this.resolveModuleDeclaration(<ModuleDeclaration>declAST, context);
                case NodeType.InterfaceDeclaration:
                    return this.resolveInterfaceDeclaration(<TypeDeclaration>declAST, context);
                case NodeType.ClassDeclaration:
                    return this.resolveClassDeclaration(<ClassDeclaration>declAST, context);
                case NodeType.FuncDecl:
                    {
                        var funcDecl = <FuncDecl>declAST;

                        if (funcDecl.isGetAccessor()) {
                            return this.resolveGetAccessorDeclaration(funcDecl, context);
                        }
                        else if (funcDecl.isSetAccessor()) {
                            return this.resolveSetAccessorDeclaration(funcDecl, context);
                        }
                        else {
                            return this.resolveFunctionDeclaration(<FuncDecl>declAST, context);
                        }
                    }
                case NodeType.VarDecl:
                case NodeType.ArgDecl:
                    return this.resolveVariableDeclaration(<BoundDecl>declAST, context, enclosingDecl);

                case NodeType.TypeParameter:
                    return this.resolveTypeParameterDeclaration(<TypeParameter>declAST, context);

                case NodeType.ImportDeclaration:
                    return this.resolveImportDeclaration(<ImportDeclaration>declAST, context);
                
                case NodeType.ObjectLiteralExpression:
                    return this.resolveObjectLiteralExpression(declAST, false, enclosingDecl, context);

                default:
                    throw new Error("Invalid declaration type");
            }
        }

        // PULLTODO: VERY IMPORTANT
        // Right now, the assumption is that the declaration's parse tree is still in memory
        // we need to add a cache-in/cache-out mechanism so that we can break the dependency on in-memory ASTs
        public resolveDeclaredSymbol(symbol: PullSymbol, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            if (!symbol || symbol.isResolved()) {
                return;
            }

            if (symbol.isResolving()) {
                symbol.setType(this.semanticInfoChain.anyTypeSymbol);

                return symbol;
            }

            var thisUnit = this.unitPath;

            var decls = symbol.getDeclarations();

            var ast: AST = null;

            var i = 0;

            // We want to walk and resolve all associated decls, so we can catch
            // cases like function overloads that may be spread across multiple
            // logical declarations
            for (i = 0; i < decls.length; i++) {
                var decl = decls[i];

                ast = this.semanticInfoChain.getASTForDecl(decl, decl.getScriptName());

                // if it's an object literal member, just return the symbol and wait for
                // the object lit to be resolved
                if (!ast || ast.nodeType == NodeType.Member) {
                    //var span = decl.getSpan();
                    //context.postError(span.minChar, span.limChar - span.minChar, this.unitPath, "Could not resolve location for symbol '" + symbol.getName() +"'", enclosingDecl);

                    // We'll return the cached results, and let the decl be corrected on the next invalidation
                    this.setUnitPath(thisUnit);
                    return symbol;
                }

                this.setUnitPath(decl.getScriptName());
                this.resolveDeclaration(ast, context, enclosingDecl);
            }

            var typeArgs = symbol.isType() ? (<PullTypeSymbol>symbol).getTypeArguments() : null;

            if (typeArgs && typeArgs.length) {
                var typeParameters = (<PullTypeSymbol>symbol).getTypeParameters();
                var typeCache: any = {}

                for (i = 0; i < typeParameters.length; i++) {
                    typeCache[typeParameters[i].getSymbolID().toString()] = typeArgs[i];
                }

                context.pushTypeSpecializationCache(typeCache);

                var specializedSymbol = specializeType((<PullTypeSymbol>symbol), typeArgs, this, enclosingDecl, context, ast);

                context.popTypeSpecializationCache();

                symbol = specializedSymbol;
            }

            this.setUnitPath(thisUnit);

            return symbol;
        }

        //
        // Resolve a module declaration
        //
        // The module and its members are pre-bound, so no further resolution is necessary
        //
        public resolveModuleDeclaration(ast: ModuleDeclaration, context: PullTypeResolutionContext): PullTypeSymbol {
            var declSymbol = <PullTypeSymbol>this.getSymbolForAST(ast, context, this.unitPath);

            return declSymbol;
        }

        //
        // Resolve a class declaration
        //
        // A class's implements and extends lists are not pre-bound, so they must be bound here
        // Once bound, we can add the parent type's members to the class
        //
        public resolveClassDeclaration(classDeclAST: ClassDeclaration, context: PullTypeResolutionContext): PullTypeSymbol {
            var classDecl: PullDecl = this.getDeclForAST(classDeclAST);
            var enclosingDecl = this.getEnclosingDecl(classDecl);
            var classDeclSymbol = <PullClassTypeSymbol>classDecl.getSymbol();
            var parentType: PullTypeSymbol = null;

            if (classDeclSymbol.isResolved()) {
                return classDeclSymbol;
            }
            
            var i = 0;

            if (classDeclAST.extendsList) {
                for (i = 0; i < classDeclAST.extendsList.members.length; i++) {
                    parentType = this.resolveTypeReference(new TypeReference(classDeclAST.extendsList.members[i], 0), classDecl, context);

                    if (parentType.getKind() != PullElementKind.Class) {
                        if (parentType.isError()) {
                            context.postError(classDeclAST.extendsList.members[i].minChar, classDeclAST.extendsList.members[i].getLength(), this.unitPath, (<PullErrorTypeSymbol>parentType).getDiagnostic().message(), enclosingDecl, true);
                        }
                        else {
                            context.postError(classDeclAST.extendsList.members[i].minChar, classDeclAST.extendsList.members[i].getLength(), this.unitPath, "A class may only extend other class types", enclosingDecl, true);
                        }
                    }
                    else {

                        if (parentType.isGeneric() && parentType.isResolved() && !parentType.getIsSpecialized()) {
                            parentType = this.specializeTypeToAny(parentType, enclosingDecl, context);
                        }

                        classDeclSymbol.addExtendedType(parentType);
                    }
                }
            }

            if (classDeclAST.implementsList) {
                var implementedType: PullTypeSymbol = null;

                for (i = 0; i < classDeclAST.implementsList.members.length; i++) {
                    implementedType = this.resolveTypeReference(new TypeReference(classDeclAST.implementsList.members[i], 0), classDecl, context);

                    if ((implementedType.getKind() & (PullElementKind.Interface | PullElementKind.Class)) == 0) {
                        if (implementedType.isError()) {
                            context.postError(classDeclAST.implementsList.members[i].minChar, classDeclAST.implementsList.members[i].getLength(), this.unitPath, (<PullErrorTypeSymbol>implementedType).getDiagnostic().message(), enclosingDecl, true);
                        }
                        else {
                            context.postError(classDeclAST.implementsList.members[i].minChar, classDeclAST.implementsList.members[i].getLength(), this.unitPath, "A class may only implement other class or interface types", enclosingDecl, true);
                        }
                    }
                    else {
                        if (implementedType.isGeneric() && implementedType.isResolved() && !implementedType.getIsSpecialized()) {
                            implementedType = this.specializeTypeToAny(implementedType, enclosingDecl, context);
                        }

                        classDeclSymbol.addImplementedType(implementedType);
                    }
                }
            }

            classDeclSymbol.setResolved();

            var classMembers = classDeclSymbol.getMembers();
            var constructorMethod = classDeclSymbol.getConstructorMethod();
            var classTypeParameters = classDeclSymbol.getTypeParameters();

            for (i = 0; i < classTypeParameters.length; i++) {
                this.resolveDeclaredSymbol(classTypeParameters[i], classDecl, context);
            }

            if (constructorMethod) {
                var constructorTypeSymbol = constructorMethod.getType();

                var constructSignatures = constructorTypeSymbol.getConstructSignatures();

                if (!constructSignatures.length) {
                    var constructorSignature: PullSignatureSymbol;
                    
                    // inherit parent's constructor signatures
                    if (parentType && parentType.isClass()) {
                        var parentClass = <PullClassTypeSymbol>parentType;
                        var parentConstructor = parentClass.getConstructorMethod();
                        var parentConstructorType = parentConstructor.getType();
                        var parentConstructSignatures = parentConstructorType.getConstructSignatures();

                        var parentConstructSignature: PullSignatureSymbol;
                        var parentParameters: PullSymbol[];
                        for (i = 0; i < parentConstructSignatures.length; i++) {
                            // create a new signature for each parent constructor
                            parentConstructSignature = parentConstructSignatures[i];
                            parentParameters = parentConstructSignature.getParameters();

                            constructorSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);
                            constructorSignature.setReturnType(classDeclSymbol);

                            for (var j = 0; j < parentParameters.length; j++) {
                                constructorSignature.addParameter(parentParameters[j], parentParameters[j].getIsOptional());
                            }

                            constructorTypeSymbol.addConstructSignature(constructorSignature);
                            constructorSignature.addDeclaration(classDecl);
                        }
                    }
                    else { // PULLREVIEW: This likely won't execute, unless there's some serious out-of-order resolution issues
                        constructorSignature = new PullSignatureSymbol(PullElementKind.ConstructSignature);
                        constructorSignature.setReturnType(classDeclSymbol);
                        constructorTypeSymbol.addConstructSignature(constructorSignature);
                        constructorSignature.addDeclaration(classDecl);
                    }
                }

                var constructorMembers = constructorTypeSymbol.getMembers();

                this.resolveDeclaredSymbol(constructorMethod, classDecl, context);

                for (i = 0; i < constructorMembers.length; i++) {
                    this.resolveDeclaredSymbol(constructorMembers[i], classDecl, context);
                }
            }

            for (i = 0; i < classMembers.length; i++) {
                this.resolveDeclaredSymbol(classMembers[i], classDecl, context);
            }

            return classDeclSymbol;
        }

        public resolveInterfaceDeclaration(interfaceDeclAST: TypeDeclaration, context: PullTypeResolutionContext): PullTypeSymbol {
            var interfaceDecl: PullDecl = this.getDeclForAST(interfaceDeclAST);
            var enclosingDecl = this.getEnclosingDecl(interfaceDecl);
            var interfaceDeclSymbol = <PullTypeSymbol>interfaceDecl.getSymbol();

            if (interfaceDeclSymbol.isResolved()) {
                return interfaceDeclSymbol;
            }

            var i = 0;

            if (interfaceDeclAST.extendsList) {
                var parentType: PullTypeSymbol = null;

                for (i = 0; i < interfaceDeclAST.extendsList.members.length; i++) {
                    parentType = this.resolveTypeReference(new TypeReference(interfaceDeclAST.extendsList.members[i], 0), interfaceDecl, context);

                    if ((parentType.getKind() & (PullElementKind.Interface | PullElementKind.Class)) == 0) {
                        if (parentType.isError()) {
                            context.postError(interfaceDeclAST.extendsList.members[i].minChar, interfaceDeclAST.extendsList.members[i].getLength(), this.unitPath, (<PullErrorTypeSymbol>parentType).getDiagnostic().message(), enclosingDecl, true);
                        }
                        else {
                            context.postError(interfaceDeclAST.extendsList.members[i].minChar, interfaceDeclAST.extendsList.members[i].getLength(), this.unitPath, "An interface may only extend other class or interface types", enclosingDecl, true);
                        }
                    }
                    else {
                        if (parentType.isGeneric() && parentType.isResolved() && !parentType.getIsSpecialized()) {
                            parentType = this.specializeTypeToAny(parentType, enclosingDecl, context);
                        }

                        interfaceDeclSymbol.addExtendedType(parentType);
                    }
                }                
            }

            if (interfaceDeclAST.implementsList) {
                context.postError(interfaceDeclAST.implementsList.minChar, interfaceDeclAST.implementsList.getLength(), this.unitPath, "An interface may not implement other types", enclosingDecl, true);
            }

            interfaceDeclSymbol.setResolved();

            var interfaceMembers = interfaceDeclSymbol.getMembers();
            var interfaceTypeParameters = interfaceDeclSymbol.getTypeParameters();

            for (i = 0; i < interfaceMembers.length; i++) {
                this.resolveDeclaredSymbol(interfaceMembers[i], interfaceDecl, context);
            }

            for (i = 0; i < interfaceTypeParameters.length; i++) {
                this.resolveDeclaredSymbol(interfaceTypeParameters[i], interfaceDecl, context);
            }

            var callSignatures = interfaceDeclSymbol.getCallSignatures();
            var constructSignatures = interfaceDeclSymbol.getConstructSignatures();
            var indexSignatures = interfaceDeclSymbol.getIndexSignatures();

            for (i = 0; i < callSignatures.length; i++) {
                this.resolveDeclaredSymbol(callSignatures[i], interfaceDecl, context);
            }

            for (i = 0; i < constructSignatures.length; i++) {
                this.resolveDeclaredSymbol(constructSignatures[i], interfaceDecl, context);
            }

            for (i = 0; i < indexSignatures.length; i++) {
                this.resolveDeclaredSymbol(indexSignatures[i], interfaceDecl, context);
            }

            return interfaceDeclSymbol;
        }

        public resolveImportDeclaration(importStatementAST: ImportDeclaration, context: PullTypeResolutionContext): PullTypeSymbol {
            // internal or external? (Does it matter?)
            var importDecl: PullDecl = this.getDeclForAST(importStatementAST);
            var enclosingDecl = this.getEnclosingDecl(importDecl);
            var importDeclSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();
            
            var aliasName = importStatementAST.id.text;
            var aliasedType: PullTypeSymbol = null;

            if (importDeclSymbol.isResolved()) {
                return importDeclSymbol;
            }

            importDeclSymbol.startResolving();

            // the alias name may be a string literal, in which case we'll need to convert it to a type
            // reference
            if (importStatementAST.alias.nodeType == NodeType.TypeRef) { // dotted name
                aliasedType = this.resolveTypeReference(<TypeReference>importStatementAST.alias, enclosingDecl, context);
            }
            else if (importStatementAST.alias.nodeType == NodeType.Name) { // name or dynamic module name
                var text = (<Identifier>importStatementAST.alias).actualText;

                if (!isQuoted(text)) {
                    aliasedType = this.resolveTypeReference(new TypeReference(importStatementAST.alias, 0), enclosingDecl, context);
                }
                else { // dynamic module name (string literal)
                    var modPath = (<StringLiteral>importStatementAST.alias).text;
                    var declPath = this.getPathToDecl(enclosingDecl);

                    importStatementAST.isDynamicImport = true;

                    aliasedType = this.findTypeSymbolForDynamicModule(modPath, importDecl.getScriptName(), (s: string) => <PullTypeSymbol>this.getSymbolFromDeclPath(s, declPath, PullElementKind.SomeType));

                    if (aliasedType) {
                        this.currentUnit.addDynamicModuleImport(importDeclSymbol);
                    }
                    else {
                        importDecl.addDiagnostic(new PullDiagnostic(importStatementAST.minChar, importStatementAST.getLength(), this.currentUnit.getPath(), "Could not resolve external module " + modPath));
                        aliasedType = this.semanticInfoChain.anyTypeSymbol;
                    }
                }
            }

            if (aliasedType) {

                if (!aliasedType.isContainer()) {
                    importDecl.addDiagnostic(new PullDiagnostic(importStatementAST.minChar, importStatementAST.getLength(), this.currentUnit.getPath(), "A module cannot be aliased to a non-module type"));
                }

                importDeclSymbol.setAliasedType(aliasedType);
                importDeclSymbol.setResolved();

                this.setSymbolForAST(importStatementAST.alias, aliasedType, context);
            }
         
            return importDeclSymbol;
        }

        public resolveFunctionTypeSignature(funcDeclAST: FuncDecl, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullTypeSymbol {
            var funcDeclSymbol = <PullFunctionTypeSymbol>this.getSymbolForAST(funcDeclAST, context, this.unitPath);

            if (!funcDeclSymbol) {
                var semanticInfo = this.semanticInfoChain.getUnit(this.unitPath);
                var declCollectionContext = new DeclCollectionContext(semanticInfo);

                declCollectionContext.scriptName = this.unitPath;

                if (enclosingDecl) {
                    declCollectionContext.pushParent(enclosingDecl);
                }

                getAstWalkerFactory().walk(funcDeclAST, preCollectDecls, postCollectDecls, null, declCollectionContext);

                var functionDecl = this.getDeclForAST(funcDeclAST);

                var binder = new PullSymbolBinder(this.compilationSettings, this.semanticInfoChain);
                binder.setUnit(this.unitPath);
                if (functionDecl.getKind() == PullElementKind.ConstructorType) {
                    binder.bindConstructorTypeDeclarationToPullSymbol(functionDecl);
                }
                else {
                    binder.bindFunctionTypeDeclarationToPullSymbol(functionDecl);
                }

                funcDeclSymbol = <PullFunctionTypeSymbol>functionDecl.getSymbol();
            }

            var signature = funcDeclSymbol.getKind() == PullElementKind.ConstructorType ?  funcDeclSymbol.getConstructSignatures()[0] : funcDeclSymbol.getCallSignatures()[0];

            // resolve the return type annotation
            if (funcDeclAST.returnTypeAnnotation) {
                var returnTypeRef = <TypeReference>funcDeclAST.returnTypeAnnotation;
                var returnTypeSymbol = this.resolveTypeReference(returnTypeRef, enclosingDecl, context);

                signature.setReturnType(returnTypeSymbol);

                if (this.isTypeArgumentOrWrapper(returnTypeSymbol)) {
                    signature.setHasGenericParameter();

                    if (funcDeclSymbol) {
                        funcDeclSymbol.getType().setHasGenericSignature();
                    }
                }
            }
            else {
                signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
            }

            // link parameters and resolve their annotations
            if (funcDeclAST.arguments) {
                for (var i = 0; i < funcDeclAST.arguments.members.length; i++) {
                    this.resolveFunctionTypeSignatureParameter(<ArgDecl>funcDeclAST.arguments.members[i], null, signature, enclosingDecl, context);
                }
            }

            if (signature.hasGenericParameter()) {
                // PULLREVIEW: This is split into a spearate if statement to make debugging slightly easier...
                if (funcDeclSymbol) {
                    funcDeclSymbol.getType().setHasGenericSignature();
                }
            }

            funcDeclSymbol.setResolved();

            return funcDeclSymbol;
        }

        public resolveFunctionTypeSignatureParameter(argDeclAST: ArgDecl, contextParam: PullSymbol, signature: PullSignatureSymbol, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {

            var paramSymbol = this.getSymbolForAST(argDeclAST, context, this.unitPath);

            if (argDeclAST.typeExpr) {
                var typeRef = this.resolveTypeReference(<TypeReference>argDeclAST.typeExpr, enclosingDecl, context);

                context.setTypeInContext(paramSymbol, typeRef);

                // if the typeExprSymbol is generic, set the "hasGenericParameter" field on the enclosing signature
                if (this.isTypeArgumentOrWrapper(typeRef)) {
                    signature.setHasGenericParameter();
                }
            } // PULLTODO: default values?
            else {
                if (contextParam) {
                    context.setTypeInContext(paramSymbol, contextParam.getType());
                }
                else {
                    context.setTypeInContext(paramSymbol, this.semanticInfoChain.anyTypeSymbol);
                }
            }

            paramSymbol.setResolved();
        }

        public resolveFunctionExpressionParameter(argDeclAST: ArgDecl, contextParam: PullSymbol, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {

            var paramSymbol = this.getSymbolForAST(argDeclAST, context);

            if (argDeclAST.typeExpr) {
                var typeRef = this.resolveTypeReference(<TypeReference>argDeclAST.typeExpr, enclosingDecl, context);

                context.setTypeInContext(paramSymbol, typeRef);

            } // PULLTODO: default values?
            else {
                if (contextParam) {
                    context.setTypeInContext(paramSymbol, contextParam.getType());
                }
                else {
                    context.setTypeInContext(paramSymbol, this.semanticInfoChain.anyTypeSymbol);
                }
            }

            paramSymbol.setResolved();
        }

        public resolveInterfaceTypeReference(interfaceDeclAST: NamedDeclaration, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullTypeSymbol {

            var interfaceSymbol = <PullTypeSymbol>this.getSymbolForAST(interfaceDeclAST, context, this.unitPath);//new PullTypeSymbol("", PullElementKind.Interface);

            if (!interfaceSymbol) {
                var semanticInfo = this.semanticInfoChain.getUnit(this.unitPath);
                var declCollectionContext = new DeclCollectionContext(semanticInfo);

                declCollectionContext.scriptName = this.unitPath;

                if (enclosingDecl) {
                    declCollectionContext.pushParent(enclosingDecl);
                }

                getAstWalkerFactory().walk(interfaceDeclAST, preCollectDecls, postCollectDecls, null, declCollectionContext);

                var interfaceDecl = this.getDeclForAST(interfaceDeclAST);

                var binder = new PullSymbolBinder(this.compilationSettings, this.semanticInfoChain);

                binder.setUnit(this.unitPath);
                binder.bindObjectTypeDeclarationToPullSymbol(interfaceDecl);

                interfaceSymbol = <PullFunctionTypeSymbol>interfaceDecl.getSymbol();
            }

            if (interfaceDeclAST.members) {

                var memberSymbol: PullSymbol = null;
                var typeMembers = <ASTList> interfaceDeclAST.members;

                for (var i = 0; i < typeMembers.members.length; i++) {
                    memberSymbol = this.getSymbolForAST(typeMembers.members[i], context, this.unitPath);

                    this.resolveDeclaredSymbol(memberSymbol, enclosingDecl, context);
                }
            }

            interfaceSymbol.setResolved();

            return interfaceSymbol;
        }

        public resolveTypeReference(typeRef: TypeReference, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullTypeSymbol {
            // the type reference can be
            // a name
            // a function
            // an interface
            // a dotted name
            // an array of any of the above

            if (!typeRef) {
                return null;
            }

            var previousResolutionSymbol = this.getSymbolForAST(typeRef, context);

            if (previousResolutionSymbol) {
                //CompilerDiagnostics.Alert("Call get hit");
                return <PullTypeSymbol>previousResolutionSymbol;
            }            

            var typeDeclSymbol: PullTypeSymbol = null;
            var prevResolvingTypeReference = context.resolvingTypeReference;
            var diagnostic: PullDiagnostic = null;

            // a name
            if (typeRef.term.nodeType == NodeType.Name) {
                var typeName = <Identifier>typeRef.term;

                // if it's a known primitive name, cheat
                if (typeName.actualText == "any") {
                    typeDeclSymbol = this.semanticInfoChain.anyTypeSymbol;
                }
                else if (typeName.actualText == "string") {
                    typeDeclSymbol = this.semanticInfoChain.stringTypeSymbol;
                }
                else if (typeName.actualText == "number") {
                    typeDeclSymbol = this.semanticInfoChain.numberTypeSymbol;
                }
                else if (typeName.actualText == "bool") {
                    typeDeclSymbol = this.semanticInfoChain.boolTypeSymbol;
                }
                else if (typeName.actualText == "null") {
                    typeDeclSymbol = this.semanticInfoChain.nullTypeSymbol;
                }
                else if (typeName.actualText == "undefined") {
                    typeDeclSymbol = this.semanticInfoChain.undefinedTypeSymbol;
                }
                else if (typeName.actualText == "void") {
                    typeDeclSymbol = this.semanticInfoChain.voidTypeSymbol;
                }
                else if (typeName.actualText == "_element") {
                    typeDeclSymbol = this.semanticInfoChain.elementTypeSymbol;
                }
                else {
                    context.resolvingTypeReference = true;

                    typeDeclSymbol = <PullTypeSymbol>this.resolveTypeNameExpression(typeName, enclosingDecl, context);

                    context.resolvingTypeReference = prevResolvingTypeReference;
                }

                if (typeDeclSymbol.isError()) {
                    return typeDeclSymbol;
                }
            }

                // a function
            else if (typeRef.term.nodeType == NodeType.FuncDecl) {

                typeDeclSymbol = this.resolveFunctionTypeSignature(<FuncDecl>typeRef.term, enclosingDecl, context);
            }

                // an interface
            else if (typeRef.term.nodeType == NodeType.InterfaceDeclaration) {

                typeDeclSymbol = this.resolveInterfaceTypeReference(<NamedDeclaration>typeRef.term, enclosingDecl, context);
            }
            else if (typeRef.term.nodeType == NodeType.GenericType) {
                typeDeclSymbol = this.resolveGenericTypeReference(<GenericType>typeRef.term, enclosingDecl, context);
            }
                // a dotted name
            else if (typeRef.term.nodeType == NodeType.Dot) {

                // assemble the dotted name path
                var dottedName = <BinaryExpression> typeRef.term;

                // find the decl
                prevResolvingTypeReference = context.resolvingTypeReference;

                typeDeclSymbol = <PullTypeSymbol>this.resolveDottedTypeNameExpression(dottedName, enclosingDecl, context);              

                context.resolvingTypeReference = prevResolvingTypeReference;

                if (typeDeclSymbol.isError()) {
                    return typeDeclSymbol;
                }
            }

            if (!typeDeclSymbol) {
                diagnostic = context.postError(typeRef.term.minChar, typeRef.term.getLength(), this.unitPath, "Could not resolve type reference", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            // an array of any of the above
            // PULLTODO: Arity > 1
            if (typeRef.arrayCount) {

                var arraySymbol: PullTypeSymbol = typeDeclSymbol.getArrayType();

                // otherwise, create a new array symbol
                if (!arraySymbol) {
                    // for each member in the array interface symbol, substitute in the the typeDecl symbol for "_element"

                    if (!this.cachedArrayInterfaceType) {
                        this.cachedArrayInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Array", this.getPathToDecl(enclosingDecl), PullElementKind.Interface);
                    }

                    if (this.cachedArrayInterfaceType && !this.cachedArrayInterfaceType.isResolved()) {
                        this.resolveDeclaredSymbol(this.cachedArrayInterfaceType, enclosingDecl, context);
                    }

                    arraySymbol = specializeToArrayType(this.semanticInfoChain.elementTypeSymbol, typeDeclSymbol, this, context);

                    if (!arraySymbol) {
                        arraySymbol = this.semanticInfoChain.anyTypeSymbol;
                    }
                }

                if (typeRef.arrayCount > 1) {
                    var arity = typeRef.arrayCount - 1;
                    var existingArraySymbol: PullTypeSymbol = null;

                    while (arity) {
                        existingArraySymbol = arraySymbol.getArrayType();

                        if (!existingArraySymbol) {
                            arraySymbol = specializeToArrayType(this.semanticInfoChain.elementTypeSymbol, arraySymbol, this, context);
                        }
                        else {
                            arraySymbol = existingArraySymbol;
                        }

                        arity--;
                    }
                }

                typeDeclSymbol = arraySymbol;
            }

            this.setSymbolForAST(typeRef, typeDeclSymbol, context);

            return typeDeclSymbol;
        }

        // Also resolves parameter declarations
        public resolveVariableDeclaration(varDecl: BoundDecl, context: PullTypeResolutionContext, enclosingDecl?: PullDecl): PullSymbol {

            var decl: PullDecl = this.getDeclForAST(varDecl);
            var declSymbol = decl.getSymbol();
            var declParameterSymbol: PullSymbol = decl.getValueDecl() ? decl.getValueDecl().getSymbol() : null;
            var hadError = false;

            if (declSymbol.isResolved()) {
                return declSymbol.getType();
            }

            if (declSymbol.isResolving()) {
                // PULLTODO: Error or warning?
                declSymbol.setType(this.semanticInfoChain.anyTypeSymbol);
                declSymbol.setResolved();

                return this.semanticInfoChain.anyTypeSymbol;
            }

            declSymbol.startResolving();

            var wrapperDecl = this.getEnclosingDecl(decl);
            wrapperDecl = wrapperDecl ? wrapperDecl : enclosingDecl;

            var diagnostic: PullDiagnostic = null;

            // Does this have a type expression? If so, that's the type
            if (varDecl.typeExpr) {
                var typeExprSymbol = this.resolveTypeReference(<TypeReference>varDecl.typeExpr, wrapperDecl, context);

                if (!typeExprSymbol) {
                    diagnostic = context.postError(varDecl.minChar, varDecl.getLength(), this.unitPath, "Could not resolve type expression for variable '" + varDecl.id.actualText + "'", decl);
                    declSymbol.setType(this.getNewErrorTypeSymbol(diagnostic));

                    if (declParameterSymbol) {
                        context.setTypeInContext(declParameterSymbol, this.semanticInfoChain.anyTypeSymbol);
                    }

                    hadError = true;
                }
                else {

                    if (typeExprSymbol.isNamedTypeSymbol() && typeExprSymbol.isGeneric() && !typeExprSymbol.isTypeParameter() && typeExprSymbol.isResolved() && !typeExprSymbol.getIsSpecialized()) {
                        typeExprSymbol = this.specializeTypeToAny(typeExprSymbol, enclosingDecl, context);
                    }              

                    // PULLREVIEW: If the type annotation is a container type, use the module instance type
                    if (typeExprSymbol.isContainer()) {
                        var instanceSymbol = (<PullContainerTypeSymbol>typeExprSymbol).getInstanceSymbol()

                        if (!instanceSymbol) {
                            diagnostic = context.postError(varDecl.minChar, varDecl.getLength(), this.unitPath, "Tried to set variable type to uninitialized module type'" + typeExprSymbol.toString() + "'", decl);
                            typeExprSymbol = this.getNewErrorTypeSymbol(diagnostic);
                        }
                        else {
                            typeExprSymbol = instanceSymbol.getType();
                        }
                    }

                    context.setTypeInContext(declSymbol, typeExprSymbol);

                    if (declParameterSymbol) {
                        declParameterSymbol.setType(typeExprSymbol);
                    }

                    // if the typeExprSymbol is generic, set the "hasGenericParameter" field on the enclosing signature
                    // we filter out arrays, since for those we just want to know if their element type is a type parameter...
                    if ((varDecl.nodeType == NodeType.ArgDecl) && enclosingDecl && ((typeExprSymbol.isGeneric() && !typeExprSymbol.isArray()) || this.isTypeArgumentOrWrapper(typeExprSymbol))) {
                        var signature = enclosingDecl.getSignatureSymbol();

                        if (signature) {
                            signature.setHasGenericParameter();
                        }
                    }
                }
            }

                // Does it have an initializer? If so, typecheck and use that
            else if (varDecl.init) {

                var initExprSymbol = this.resolveStatementOrExpression(varDecl.init, false, wrapperDecl, context);

                if (!initExprSymbol) {
                    diagnostic = context.postError(varDecl.minChar, varDecl.getLength(), this.unitPath, "Could not resolve type of initializer expression for variable '" + varDecl.id.actualText + "'", decl);

                    context.setTypeInContext(declSymbol, this.getNewErrorTypeSymbol(diagnostic));

                    if (declParameterSymbol) {
                        context.setTypeInContext(declParameterSymbol, this.semanticInfoChain.anyTypeSymbol);
                    }

                    hadError = true;
                }
                else {

                    context.setTypeInContext(declSymbol, this.widenType(initExprSymbol.getType()));
                    initExprSymbol.addOutgoingLink(declSymbol, SymbolLinkKind.ProvidesInferredType);

                    if (declParameterSymbol) {
                        context.setTypeInContext(declParameterSymbol, initExprSymbol.getType());
                        initExprSymbol.addOutgoingLink(declParameterSymbol, SymbolLinkKind.ProvidesInferredType);
                    }
                }
            }
            else if (declSymbol.getKind() == PullElementKind.Container) { // module instance value
                instanceSymbol = (<PullContainerTypeSymbol>declSymbol).getInstanceSymbol();
                var instanceType = instanceSymbol.getType();

                if (instanceType) {
                    context.setTypeInContext(declSymbol, instanceType);
                }
                else {
                    context.setTypeInContext(declSymbol, this.semanticInfoChain.anyTypeSymbol);
                }
            }
            //else if () {} // class instance value
                // Otherwise, it's of type 'any'
            else {
                context.setTypeInContext(declSymbol, this.semanticInfoChain.anyTypeSymbol);
                if (declParameterSymbol) {
                    declParameterSymbol.setType(this.semanticInfoChain.anyTypeSymbol);
                }
            }

            if (!hadError) {
                declSymbol.setResolved();

                if (declParameterSymbol) {
                    declParameterSymbol.setResolved();
                }
            }

            return declSymbol;
        }

        public resolveTypeParameterDeclaration(typeParameterAST: TypeParameter, context: PullTypeResolutionContext): PullTypeSymbol {
            var typeParameterDecl = this.getDeclForAST(typeParameterAST);
            var typeParameterSymbol = <PullTypeParameterSymbol>typeParameterDecl.getSymbol();

            if (typeParameterSymbol.isResolved() || typeParameterSymbol.isResolving()) {
                return typeParameterSymbol;
            }

            typeParameterSymbol.startResolving();

            if (typeParameterAST.constraint) {
                var enclosingDecl = this.getEnclosingDecl(typeParameterDecl);
                var constraintTypeSymbol = this.resolveTypeReference(<TypeReference>typeParameterAST.constraint, enclosingDecl, context);

                if (!constraintTypeSymbol) {
                    context.postError(typeParameterAST.minChar, typeParameterAST.getLength(), this.unitPath, "Could not resolve constraint for type parameter '" + typeParameterDecl.getName() + "'", enclosingDecl, true);
                }
                else if (constraintTypeSymbol.isPrimitive()) {
                    context.postError(typeParameterAST.constraint.minChar, typeParameterAST.constraint.getLength(), this.unitPath, "Type parameter constraints may not be primitive types", enclosingDecl, true);
                }
                else {
                    typeParameterSymbol.setConstraint(constraintTypeSymbol);
                }
            }

            typeParameterSymbol.setResolved();

            return typeParameterSymbol;
        }

        public resolveFunctionBodyReturnTypes(funcDeclAST: FuncDecl, signature: PullSignatureSymbol, useContextualType: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {
            var returnStatements: ReturnStatement[] = [];

            var preFindReturnExpressionTypes = function (ast: AST, parent: AST, walker: IAstWalker) {
                var go = true;

                switch (ast.nodeType) {
                    case NodeType.FuncDecl:
                        // don't recurse into a function decl - we don't want to confuse a nested
                        // return type with the top-level function's return type
                        go = false;
                        break;

                    case NodeType.ReturnStatement:
                        var returnStatement: ReturnStatement = <ReturnStatement>ast;
                        returnStatements[returnStatements.length] = returnStatement;
                        go = false;
                        break;

                    default:
                        break;
                }

                walker.options.goChildren = go;

                return ast;
            }

            getAstWalkerFactory().walk(funcDeclAST.bod, preFindReturnExpressionTypes);

            if (!returnStatements.length) {
                if (useContextualType) {
                    var contextualType = this.widenType(context.getContextualType());

                    signature.setReturnType(contextualType);

                    var isVoidOrAny = this.isAnyOrEquivalent(contextualType) || contextualType == this.semanticInfoChain.voidTypeSymbol;
               
                    if (!isVoidOrAny) {
                        context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Function declared a non-void return type, but has no return expression", enclosingDecl, true);
                    }                    
                }
                else {
                    signature.setReturnType(this.semanticInfoChain.voidTypeSymbol);
                }
            }

            else {
                var returnExpressionSymbols: PullTypeSymbol[] = [];
                var i = 0;

                for (i = 0; i < returnStatements.length; i++) {
                    if (returnStatements[i].returnExpression) {
                        returnExpressionSymbols[returnExpressionSymbols.length] = this.resolveStatementOrExpression(returnStatements[i].returnExpression, useContextualType, enclosingDecl, context).getType();
                    }
                }

                if (!returnExpressionSymbols.length) {
                    signature.setReturnType(this.semanticInfoChain.voidTypeSymbol);
                }
                else {

                    // combine return expression types for best common type
                    var collection: IPullTypeCollection = {
                        getLength: () => { return returnExpressionSymbols.length; },
                        setTypeAtIndex: (index: number, type: PullTypeSymbol) => { },
                        getTypeAtIndex: (index: number) => {
                            return returnExpressionSymbols[index].getType();
                        }
                    }

                    var returnType = this.findBestCommonType(returnExpressionSymbols[0], null, collection, true, context, new TypeComparisonInfo());

                    signature.setReturnType(returnType ? this.widenType(returnType) : this.semanticInfoChain.anyTypeSymbol);

                    // link return expressions to signature type to denote inference
                    for (i = 0; i < returnExpressionSymbols.length; i++) {
                        returnExpressionSymbols[i].addOutgoingLink(signature, SymbolLinkKind.ProvidesInferredType);
                    }
                }
            }
        }

        public resolveFunctionDeclaration(funcDeclAST: FuncDecl, context: PullTypeResolutionContext): PullSymbol {

            var funcDecl: PullDecl = this.getDeclForAST(funcDeclAST);

            var funcSymbol = <PullFunctionTypeSymbol>funcDecl.getSymbol();

            var signature: PullSignatureSymbol = funcDecl.getSignatureSymbol();

            var hadError = false;

            var isConstructor = funcDeclAST.isConstructor || hasFlag(funcDeclAST.getFunctionFlags(), FunctionFlags.ConstructMember);

            if (signature) {

                if (signature.isResolved()) {
                    return funcSymbol;
                }

                var diagnostic: PullDiagnostic;

                if (signature.isResolving()) {
                    
                    // try to set the return type, even though we may be lacking in some information
                    if (funcDeclAST.returnTypeAnnotation) {
                        var returnTypeRef = <TypeReference>funcDeclAST.returnTypeAnnotation;
                        var returnTypeSymbol = this.resolveTypeReference(returnTypeRef, funcDecl, context);
                        if (!returnTypeSymbol) {
                            diagnostic = context.postError(funcDeclAST.returnTypeAnnotation.minChar, funcDeclAST.returnTypeAnnotation.getLength(), this.unitPath, "Could not resolve return type reference for some reason...", funcDecl);
                            signature.setReturnType(this.getNewErrorTypeSymbol(diagnostic));
                            hadError = true;
                        } else {
                            if (this.isTypeArgumentOrWrapper(returnTypeSymbol)) {
                                signature.setHasGenericParameter();
                                if (funcSymbol) {
                                    funcSymbol.getType().setHasGenericSignature();
                                }
                            }
                            signature.setReturnType(returnTypeSymbol);

                            if (isConstructor && returnTypeSymbol == this.semanticInfoChain.voidTypeSymbol) {
                                context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Constructors may not have a return type of 'void'", funcDecl, true);
                            }                            
                        }
                    } 
                    else {
                        signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
                    }

                    signature.setResolved();
                    return funcSymbol;
                }

                signature.startResolving();

                // resolve parameter type annotations as necessary
                if (funcDeclAST.arguments) {
                    for (var i = 0; i < funcDeclAST.arguments.members.length; i++) {
                        this.resolveVariableDeclaration(<BoundDecl>funcDeclAST.arguments.members[i], context, funcDecl);
                    }
                }

                if (signature.isGeneric()) {
                    // PULLREVIEW: This is split into a spearate if statement to make debugging slightly easier...
                    if (funcSymbol) {
                        funcSymbol.getType().setHasGenericSignature();
                    }
                }

                // resolve the return type annotation
                if (funcDeclAST.returnTypeAnnotation) {
                    returnTypeRef = <TypeReference>funcDeclAST.returnTypeAnnotation;

                    // use the funcDecl for the enclosing decl, since we want to pick up any type parameters 
                    // on the function when resolving the return type
                    returnTypeSymbol = this.resolveTypeReference(returnTypeRef, funcDecl, context);

                    if (!returnTypeSymbol) {
                        diagnostic = context.postError(funcDeclAST.returnTypeAnnotation.minChar, funcDeclAST.returnTypeAnnotation.getLength(), this.unitPath, "Could not resolve return type reference for some reason...", funcDecl);
                        signature.setReturnType(this.getNewErrorTypeSymbol(diagnostic));

                        hadError = true;
                    }
                    else {
                        if (this.isTypeArgumentOrWrapper(returnTypeSymbol)) {
                            signature.setHasGenericParameter();

                            if (funcSymbol) {
                                funcSymbol.getType().setHasGenericSignature();
                            }
                        }

                        signature.setReturnType(returnTypeSymbol);

                        if (isConstructor && returnTypeSymbol == this.semanticInfoChain.voidTypeSymbol) {
                            context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Constructors may not have a return type of 'void'", funcDecl, true);
                        }                           
                    }
                }
                // if there's no return-type annotation
                //     - if it's not a definition signature, set the return type to 'any'
                //     - if it's a definition sigature, take the best common type of all return expressions
                //     - if it's a constructor, we set the return type link during binding
                else if (!funcDeclAST.isConstructor) {
                    if (funcDeclAST.isSignature()) {
                        signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
                    }
                    else {
                        this.resolveFunctionBodyReturnTypes(funcDeclAST, signature, false, funcDecl, new PullTypeResolutionContext());
                    }
                }

                if (!hadError) {
                    signature.setResolved();
                }
            }

            // don't resolve anything here that's not relevant to the type of the function!

            return funcSymbol;
        }

        public resolveGetAccessorDeclaration(funcDeclAST: FuncDecl, context: PullTypeResolutionContext): PullSymbol {

            var funcDecl: PullDecl = this.getDeclForAST(funcDeclAST);
            var accessorSymbol = <PullAccessorSymbol> funcDecl.getSymbol();

            var getterSymbol = accessorSymbol.getGetter();
            var getterTypeSymbol = <PullFunctionTypeSymbol>getterSymbol.getType();

            var signature: PullSignatureSymbol = getterTypeSymbol.getCallSignatures()[0];

            var hadError = false;
            var diagnostic: PullDiagnostic;

            if (signature) {

                if (signature.isResolved()) {
                    return accessorSymbol;
                }

                if (signature.isResolving()) {
                    // PULLTODO: Error or warning?
                    signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
                    signature.setResolved();

                    return accessorSymbol;
                }

                signature.startResolving();

                // resolve parameter type annotations as necessary
                if (funcDeclAST.arguments) {
                    for (var i = 0; i < funcDeclAST.arguments.members.length; i++) {
                        this.resolveVariableDeclaration(<BoundDecl>funcDeclAST.arguments.members[i], context, funcDecl);
                    }
                }

                if (signature.hasGenericParameter()) {
                    // PULLREVIEW: This is split into a spearate if statement to make debugging slightly easier...
                    if (getterSymbol) {
                        getterTypeSymbol.setHasGenericSignature();
                    }
                }

                // resolve the return type annotation
                if (funcDeclAST.returnTypeAnnotation) {
                    var returnTypeRef = <TypeReference>funcDeclAST.returnTypeAnnotation;

                    // use the funcDecl for the enclosing decl, since we want to pick up any type parameters 
                    // on the function when resolving the return type
                    var returnTypeSymbol = this.resolveTypeReference(returnTypeRef, funcDecl, context);

                    if (!returnTypeSymbol) {
                        diagnostic = context.postError(funcDeclAST.returnTypeAnnotation.minChar, funcDeclAST.returnTypeAnnotation.getLength(), this.unitPath, "Could not resolve return type reference for some reason...", funcDecl);
                        signature.setReturnType(this.getNewErrorTypeSymbol(diagnostic));

                        hadError = true;
                    }
                    else {

                        if (this.isTypeArgumentOrWrapper(returnTypeSymbol)) {
                            signature.setHasGenericParameter();

                            if (getterSymbol) {
                                getterTypeSymbol.setHasGenericSignature();
                            }
                        }

                        signature.setReturnType(returnTypeSymbol);
                    }
                }

                    // if there's no return-type annotation
                    //     - if it's not a definition signature, set the return type to 'any'
                    //     - if it's a definition sigature, take the best common type of all return expressions
                else {
                    if (funcDeclAST.isSignature()) {
                        signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
                    }
                    else {
                        this.resolveFunctionBodyReturnTypes(funcDeclAST, signature, false, funcDecl, new PullTypeResolutionContext());
                    }
                }


                if (!hadError) {
                    signature.setResolved();
                }
            }

            var accessorType = signature.getReturnType();

            var setter = accessorSymbol.getSetter();

            if (setter) {
                var setterType = setter.getType();
                var setterSig = setterType.getCallSignatures()[0];

                if (setterSig.isResolved()) {
                    // compare setter parameter type and getter return type
                    var setterParameters = setterSig.getParameters();

                    if (setterParameters.length) {
                        var setterParameter = setterParameters[0];
                        var setterParameterType = setterParameter.getType();

                        if (!this.typesAreIdentical(accessorType, setterParameterType)) {
                            diagnostic = context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Getter and setter types do not agree", this.getEnclosingDecl(funcDecl));
                            accessorSymbol.setType(this.getNewErrorTypeSymbol(diagnostic));
                        }
                    }
                }
                else {
                    accessorSymbol.setType(accessorType);
                }

            }
            else {
                accessorSymbol.setType(accessorType);
            }

            return accessorSymbol;
        }

        public resolveSetAccessorDeclaration(funcDeclAST: FuncDecl, context: PullTypeResolutionContext): PullSymbol {

            var funcDecl: PullDecl = this.getDeclForAST(funcDeclAST);
            var accessorSymbol = <PullAccessorSymbol> funcDecl.getSymbol();

            var setterSymbol = accessorSymbol.getSetter();
            var setterTypeSymbol = <PullFunctionTypeSymbol>setterSymbol.getType();

            var signature: PullSignatureSymbol = setterTypeSymbol.getCallSignatures()[0];

            var hadError = false;

            if (signature) {

                if (signature.isResolved()) {
                    return accessorSymbol;
                }

                if (signature.isResolving()) {
                    // PULLTODO: Error or warning?
                    signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
                    signature.setResolved();

                    return accessorSymbol;
                }

                signature.startResolving();

                // resolve parameter type annotations as necessary
                if (funcDeclAST.arguments) {
                    for (var i = 0; i < funcDeclAST.arguments.members.length; i++) {
                        this.resolveVariableDeclaration(<BoundDecl>funcDeclAST.arguments.members[i], context, funcDecl);
                    }
                }
                else {
                    context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Setters must take arguments", this.getEnclosingDecl(funcDecl), true);
                }

                if (signature.hasGenericParameter()) {
                    // PULLREVIEW: This is split into a spearate if statement to make debugging slightly easier...
                    if (setterSymbol) {
                        setterTypeSymbol.setHasGenericSignature();
                    }
                }

                // resolve the return type annotation
                if (funcDeclAST.returnTypeAnnotation) {
                    context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Setters may not contain return type annotations", this.getEnclosingDecl(funcDecl), true);
                }

                if (!hadError) {
                    signature.setResolved();
                }
            }

            var parameters = signature.getParameters();

            if (parameters.length) {
                var accessorType = parameters[0].getType();

                var getter = accessorSymbol.getGetter();

                if (getter) {
                    var getterType = getter.getType();
                    var getterSig = getterType.getCallSignatures()[0];

                    if (getterSig.isResolved()) {
                        // compare setter parameter type and getter return type
                        var getterReturnType = getterSig.getReturnType();

                        if (!this.typesAreIdentical(accessorType, getterReturnType)) {

                            if (this.isAnyOrEquivalent(accessorType)) {
                                accessorSymbol.setType(getterReturnType);
                                if (!accessorType.isError()) {
                                    parameters[0].setType(getterReturnType);
                                }
                            }
                            else {
                                var diagnostic = context.postError(funcDeclAST.minChar, funcDeclAST.getLength(), this.unitPath, "Getter and setter types do not agree", this.getEnclosingDecl(funcDecl));
                                accessorSymbol.setType(this.getNewErrorTypeSymbol(diagnostic));
                            }
                        }
                    }
                    else {
                        accessorSymbol.setType(accessorType);
                    }
                }
                else {
                    accessorSymbol.setType(accessorType);
                }
            }

            return accessorSymbol;
        }


        // Expression resolution

        public resolveAST(ast: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {
            switch (ast.nodeType) {
                case NodeType.ModuleDeclaration:
                case NodeType.InterfaceDeclaration:
                case NodeType.ClassDeclaration:
                case NodeType.VarDecl:
                case NodeType.ArgDecl:
                    return this.resolveDeclaration(ast, context, enclosingDecl);

                case NodeType.FuncDecl:
                    if (isTypedAssignment || ((<FuncDecl>ast).getFunctionFlags() & FunctionFlags.IsFunctionExpression)) {
                        return this.resolveStatementOrExpression(ast, isTypedAssignment, enclosingDecl, context);
                    }
                    else {
                        return this.resolveDeclaration(ast, context, enclosingDecl);
                    }

                default:
                    return this.resolveStatementOrExpression(ast, isTypedAssignment, enclosingDecl, context);
            }
        }

        public resolveStatementOrExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {
            switch (expressionAST.nodeType) {
                case NodeType.Name:
                    if (context.searchTypeSpace) {
                        return this.resolveTypeNameExpression(<Identifier>expressionAST, enclosingDecl, context);
                    }
                    else {
                        return this.resolveNameExpression(<Identifier>expressionAST, enclosingDecl, context);
                    }
                case GenericType:
                    return this.resolveGenericTypeReference(<GenericType>expressionAST, enclosingDecl, context);
                case NodeType.Dot:
                    if (context.searchTypeSpace) {
                        return this.resolveDottedTypeNameExpression(<BinaryExpression>expressionAST, enclosingDecl, context);
                    }
                    else {
                        return this.resolveDottedNameExpression(<BinaryExpression>expressionAST, enclosingDecl, context);
                    }

                case NodeType.FuncDecl:
                    {
                        var funcDecl = <FuncDecl>expressionAST;

                        if (funcDecl.isGetAccessor()) {
                            return this.resolveGetAccessorDeclaration(funcDecl, context);
                        }
                        else if (funcDecl.isSetAccessor()) {
                            return this.resolveSetAccessorDeclaration(funcDecl, context);
                        }
                        else {
                            return this.resolveFunctionExpression(funcDecl, isTypedAssignment, enclosingDecl, context);
                        }
                    }

                case NodeType.ObjectLiteralExpression:
                    return this.resolveObjectLiteralExpression(expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.ArrayLiteralExpression:
                    return this.resolveArrayLiteralExpression(expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.ThisExpression:
                    return this.resolveThisExpression(expressionAST, enclosingDecl, context);
                case NodeType.SuperExpression:
                    return this.resolveSuperExpression(expressionAST, enclosingDecl, context);

                case NodeType.Call:
                    return this.resolveCallExpression(<CallExpression>expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.New:
                    return this.resolveNewExpression(<CallExpression>expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.CastExpression:
                    return this.resolveTypeAssertionExpression(expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.TypeRef:
                    return this.resolveTypeReference(<TypeReference>expressionAST, enclosingDecl, context);

                // primitives
                case NodeType.NumericLiteral:
                    return this.semanticInfoChain.numberTypeSymbol;
                case NodeType.StringLiteral:
                    return this.semanticInfoChain.stringTypeSymbol;
                case NodeType.Null:
                    return this.semanticInfoChain.nullTypeSymbol;
                case NodeType.TrueLiteral:
                case NodeType.FalseLiteral:
                    return this.semanticInfoChain.boolTypeSymbol;
                case NodeType.VoidExpression:
                    return this.semanticInfoChain.voidTypeSymbol;

                // assignment
                case NodeType.Asg:
                    return this.resolveAssignmentStatement(expressionAST, isTypedAssignment, enclosingDecl, context);

                // boolean operations
                case NodeType.LogNot:
                case NodeType.Ne:
                case NodeType.Eq:
                case NodeType.Eqv:
                case NodeType.NEqv:
                case NodeType.Lt:
                case NodeType.Le:
                case NodeType.Ge:
                case NodeType.Gt:
                    return this.semanticInfoChain.boolTypeSymbol;

                case NodeType.Add:
                case NodeType.AsgAdd:                
                    return this.resolveArithmeticExpression(expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.AsgSub:
                case NodeType.AsgMul:
                case NodeType.AsgDiv:
                case NodeType.AsgMod:
                case NodeType.AsgOr:
                case NodeType.AsgAnd:

                case NodeType.Not:
                case NodeType.Sub:
                case NodeType.Mul:
                case NodeType.Div:
                case NodeType.Mod:
                case NodeType.Or:
                case NodeType.And:
                case NodeType.PlusExpression:
                case NodeType.NegateExpression:
                case NodeType.IncPost:
                case NodeType.IncPre:
                case NodeType.DecPost:
                case NodeType.DecPre:
                    return this.semanticInfoChain.numberTypeSymbol;

                case NodeType.Lsh:
                case NodeType.Rsh:
                case NodeType.Rs2:
                case NodeType.AsgLsh:
                case NodeType.AsgRsh:
                case NodeType.AsgRs2:
                    return this.semanticInfoChain.numberTypeSymbol;

                case NodeType.Index:
                    return this.resolveIndexExpression(expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.LogOr:
                    return this.resolveLogicalOrExpression(expressionAST, isTypedAssignment, enclosingDecl, context);
                case NodeType.LogAnd:
                    return this.resolveLogicalAndExpression(expressionAST, isTypedAssignment, enclosingDecl, context);

                case NodeType.Typeof:
                    return this.semanticInfoChain.stringTypeSymbol;

                case NodeType.ThrowStatement:
                    return this.semanticInfoChain.voidTypeSymbol;

                case NodeType.DeleteExpression:
                    return this.semanticInfoChain.boolTypeSymbol;

                case NodeType.ConditionalExpression:
                    return this.resolveConditionalExpression(<ConditionalExpression>expressionAST, enclosingDecl, context);

                case NodeType.RegularExpressionLiteral:
                    return this.cachedRegExpInterfaceType ? this.cachedRegExpInterfaceType : this.semanticInfoChain.anyTypeSymbol;

                case NodeType.ParenthesizedExpression:
                    return this.resolveParenthesizedExpression(<ParenthesizedExpression>expressionAST, enclosingDecl, context);

                case NodeType.ExpressionStatement:
                    return this.resolveExpressionStatement(<ExpressionStatement>expressionAST, isTypedAssignment, enclosingDecl, context);
            }

            return this.semanticInfoChain.anyTypeSymbol;
        }

        public resolveNameExpression(nameAST: Identifier, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            if (nameAST.isMissing()) {
                return this.semanticInfoChain.anyTypeSymbol;
            }

            var nameSymbol: PullSymbol = this.getSymbolForAST(nameAST, context);

            if (nameSymbol /*&& nameSymbol.isResolved()*/) {
                if (!nameSymbol.isResolved()) {
                    this.resolveDeclaredSymbol(nameSymbol, enclosingDecl, context);
                }
                return nameSymbol;
            }

            var id = nameAST.text;

            var declPath: PullDecl[] = enclosingDecl !== null ? this.getPathToDecl(enclosingDecl) : [];

            if (enclosingDecl && !declPath.length) {
                declPath = [enclosingDecl];
            }

            nameSymbol = this.getSymbolFromDeclPath(id, declPath, PullElementKind.SomeValue);

            // PULLREVIEW: until further notice, search out for modules or enums
            if (!nameSymbol) {
                nameSymbol = this.getSymbolFromDeclPath(id, declPath, PullElementKind.SomeType);

                if (nameSymbol && (nameSymbol.isPrimitive() && nameSymbol != this.semanticInfoChain.undefinedTypeSymbol && nameSymbol != this.semanticInfoChain.nullTypeSymbol)) {
                    nameSymbol = null;
                }
            }

            if (!nameSymbol && id === "arguments" && enclosingDecl && (enclosingDecl.getKind() & PullElementKind.SomeFunction)) {
                nameSymbol = this.cachedFunctionArgumentsSymbol;
            }            

            if (!nameSymbol) {
                var diagnostic = context.postError(nameAST.minChar, nameAST.getLength(), this.unitPath, "Could not find symbol '" + id + "'", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            if (!nameSymbol.isResolved()) {
                this.resolveDeclaredSymbol(nameSymbol, enclosingDecl, context);
            }

            this.setSymbolForAST(nameAST, nameSymbol, context);

            return nameSymbol;
        }

        public resolveDottedNameExpression(dottedNameAST: BinaryExpression, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {

            if ((<Identifier>dottedNameAST.operand2).isMissing()) {
                return this.semanticInfoChain.anyTypeSymbol;
            }            

            var nameSymbol: PullSymbol = this.getSymbolForAST(dottedNameAST, context);

            if (nameSymbol /*&& nameSymbol.isResolved()*/) {
                if (!nameSymbol.isResolved()) {
                    this.resolveDeclaredSymbol(nameSymbol, enclosingDecl, context);
                }
                return nameSymbol;
            }

            // assemble the dotted name path
            var rhsName = (<Identifier>dottedNameAST.operand2).text;

            var lhs: PullSymbol = this.resolveStatementOrExpression(dottedNameAST.operand1, false, enclosingDecl, context);
            var lhsType = lhs.getType();
            var diagnostic: PullDiagnostic;

            if (lhs.isAlias()) {
                (<PullTypeAliasSymbol>lhs).setIsUsedAsValue();
            }

            if (this.isAnyOrEquivalent(lhsType)) {
                return lhsType;
            }

            if (!lhsType) {
                diagnostic = context.postError(dottedNameAST.operand2.minChar, dottedNameAST.operand2.getLength(), this.unitPath, "Could not find enclosing symbol for dotted name '" + rhsName + "'", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            // if we're resolving a type reference, we really only want to check the constructor type
            if (lhsType == this.semanticInfoChain.numberTypeSymbol && this.cachedNumberInterfaceType) {
                lhsType = this.cachedNumberInterfaceType;
            }
            else if (lhsType == this.semanticInfoChain.stringTypeSymbol && this.cachedStringInterfaceType) {
                lhsType = this.cachedStringInterfaceType;
            }
            else if (lhsType == this.semanticInfoChain.boolTypeSymbol && this.cachedBooleanInterfaceType) {
                lhsType = this.cachedBooleanInterfaceType;
            }

            if (!lhsType.isResolved()) {
                var potentiallySpecializedType = <PullTypeSymbol>this.resolveDeclaredSymbol(lhsType, enclosingDecl, context);

                if (potentiallySpecializedType != lhsType) {
                    if (!lhs.isType()) {
                        context.setTypeInContext(lhs, potentiallySpecializedType);
                    }

                    lhsType = potentiallySpecializedType;
                }
            }

            if (rhsName == "prototype") {

                if (lhsType.isClass()) {
                    return lhsType;
                }
                else {
                    var classInstanceType = lhsType.getAssociatedContainerType();

                    if (classInstanceType && classInstanceType.isClass()) {
                        return classInstanceType;
                    }
                }
            }

            // now for the name...
            // For classes, check the statics first below
            if (!(lhs.isType() && lhs.isClass()) && !nameSymbol) {
                nameSymbol = lhsType.findMember(rhsName);
            }

            if (!nameSymbol) {

                // could be a static
                if (lhsType.isClass()) {
                    var staticType = (<PullClassTypeSymbol>lhsType).getConstructorMethod().getType();

                    nameSymbol = staticType.findMember(rhsName);

                    if (!nameSymbol) {
                        nameSymbol = lhsType.findMember(rhsName);
                    }
                }
                    // could be an enum
                else if ((lhsType.getKind() == PullElementKind.Enum) && this.cachedNumberInterfaceType) {
                    lhsType = this.cachedNumberInterfaceType;

                    nameSymbol = lhsType.findMember(rhsName);
                }
                // could be a function symbol
                else if (lhsType.getCallSignatures().length && this.cachedFunctionInterfaceType) {
                    lhsType = this.cachedFunctionInterfaceType;

                    nameSymbol = lhsType.findMember(rhsName);
                }
                // could be a type parameter with a contraint
                else if (lhsType.isTypeParameter()) {
                    var constraint = (<PullTypeParameterSymbol>lhsType).getConstraint();

                    if (constraint) {
                        nameSymbol = constraint.findMember(rhsName);
                    }
                }
                else if (lhsType.isContainer()) {
                    var associatedInstance = (<PullContainerTypeSymbol>lhsType).getInstanceSymbol();

                    if (associatedInstance) {
                        var instanceType = associatedInstance.getType();

                        nameSymbol = instanceType.findMember(rhsName);
                    }
                }
                // could be a module instance
                else {
                    var associatedType = lhsType.getAssociatedContainerType();

                    if (associatedType) {
                        nameSymbol = associatedType.findMember(rhsName);
                    }
                }

                // could be an object member
                if (!nameSymbol && !lhsType.isPrimitive() && this.cachedObjectInterfaceType) {
                    nameSymbol = this.cachedObjectInterfaceType.findMember(rhsName);
                }                

                if (!nameSymbol) {
                    diagnostic = context.postError(dottedNameAST.operand2.minChar, dottedNameAST.operand2.getLength(), this.unitPath, "Could not find dotted symbol name '" + rhsName + "'", enclosingDecl);
                    return this.getNewErrorTypeSymbol(diagnostic);
                }
            }

            if (!nameSymbol.isResolved()) {
                this.resolveDeclaredSymbol(nameSymbol, enclosingDecl, context);
            }

            this.setSymbolForAST(dottedNameAST, nameSymbol, context);
            this.setSymbolForAST(dottedNameAST.operand2, nameSymbol, context);

            return nameSymbol;
        }

        public resolveTypeNameExpression(nameAST: Identifier, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            if (nameAST.isMissing()) {
                return this.semanticInfoChain.anyTypeSymbol;
            }

            var typeNameSymbol: PullTypeSymbol = <PullTypeSymbol>this.getSymbolForAST(nameAST, context);

            if (typeNameSymbol /*&& typeNameSymbol.isResolved()*/) {
                if (!typeNameSymbol.isResolved()) {
                    this.resolveDeclaredSymbol(typeNameSymbol, enclosingDecl, context);
                }
                return typeNameSymbol;
            }

            var id = nameAST.text;

            var declPath: PullDecl[] = enclosingDecl !== null ? this.getPathToDecl(enclosingDecl) : [];
            var diagnostic: PullDiagnostic;

            if (enclosingDecl && !declPath.length) {
                declPath = [enclosingDecl];
            }

            typeNameSymbol = <PullTypeSymbol>this.getSymbolFromDeclPath(id, declPath, PullElementKind.SomeType);

            if (!typeNameSymbol) {
                diagnostic = context.postError(nameAST.minChar, nameAST.getLength(), this.unitPath, "Could not find type '" + id + "'", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            typeNameSymbol = context.findSpecializationForType(typeNameSymbol);

            if (!typeNameSymbol.isResolved()) {
                this.resolveDeclaredSymbol(typeNameSymbol, enclosingDecl, context);
            }

            this.setSymbolForAST(nameAST, typeNameSymbol, context);

            return typeNameSymbol;
        }

        public resolveGenericTypeReference(genericTypeAST: GenericType, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullTypeSymbol {          

            var nameAST = <Identifier> genericTypeAST.name;

            if (nameAST.isMissing()) {
                return this.semanticInfoChain.anyTypeSymbol;
            }  

            var id = nameAST.text;

            var declPath: PullDecl[] = enclosingDecl !== null ? this.getPathToDecl(enclosingDecl) : [];

            var diagnostic: PullDiagnostic;

            if (enclosingDecl && !declPath.length) {
                declPath = [enclosingDecl];
            }

            var genericTypeSymbol: PullTypeSymbol = null

            genericTypeSymbol = <PullTypeSymbol>this.getSymbolFromDeclPath(id, declPath, PullElementKind.SomeType);

            if (!genericTypeSymbol) {
                diagnostic = context.postError(nameAST.minChar, nameAST.getLength(), this.unitPath, "Could not find generic type '" + id + "'", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            if (genericTypeSymbol.isResolving()) {
                return genericTypeSymbol;
            }

            if (!genericTypeSymbol.isResolved()) {
                //genericTypeSymbol.startResolving();
                this.resolveDeclaredSymbol(genericTypeSymbol, enclosingDecl, context);
                //genericTypeSymbol.setResolved();
            }

            // specialize the type arguments
            var typeArgs: PullTypeSymbol[] = [];
            var typeArg: PullTypeSymbol = null;

            if (!genericTypeSymbol.isResolvingTypeArguments()) {

                genericTypeSymbol.startResolvingTypeArguments();

                if (genericTypeAST.typeArguments && genericTypeAST.typeArguments.members.length) {
                    for (var i = 0; i < genericTypeAST.typeArguments.members.length; i++) {
                        typeArg = this.resolveTypeReference(<TypeReference>genericTypeAST.typeArguments.members[i], enclosingDecl, context);
                        typeArgs[i] = context.findSpecializationForType(typeArg);
                    }
                }

                genericTypeSymbol.doneResolvingTypeArguments();
            }

            var typeParameters = genericTypeSymbol.getTypeParameters();

            if (typeArgs.length && typeArgs.length != typeParameters.length) {
                diagnostic = context.postError(genericTypeAST.minChar, genericTypeAST.getLength(), this.unitPath, "Generic type '" + genericTypeSymbol.toString() + "' expects " + genericTypeSymbol.getTypeParameters().length + " type arguments, but " + typeArgs.length + " arguments were supplied", enclosingDecl);

                return this.getNewErrorTypeSymbol(diagnostic);
            }

            var specializedSymbol = specializeType(genericTypeSymbol, typeArgs, this, enclosingDecl, context, genericTypeAST);

            // check constraints, if appropriate
            var typeConstraint: PullTypeSymbol = null;
            var upperBound: PullTypeSymbol = null;

            for (var iArg = 0; (iArg < typeArgs.length) && (iArg < typeParameters.length); iArg++) {
                typeArg = typeArgs[iArg];

                typeConstraint = typeParameters[iArg].getConstraint();

                // test specialization type for assignment compatibility with the constraint
                if (typeConstraint) {

                    if (typeArg.isTypeParameter()) {
                        upperBound = (<PullTypeParameterSymbol>typeArg).getConstraint();

                        if (upperBound) {
                            typeArg = upperBound;
                        }
                    }

                    if (!this.sourceIsAssignableToTarget(typeArg, typeConstraint, context)) {
                        context.postError(genericTypeAST.minChar, genericTypeAST.getLength(), this.getUnitPath(), "Type '" + typeArg.toString(true) + "' does not satisfy the constraint '" + typeConstraint.toString(true) + "' for type parameter '" + typeParameters[iArg].toString(true) + "'", enclosingDecl, true);
                    }
                }
            }

            return specializedSymbol;
        }

        public resolveDottedTypeNameExpression(dottedNameAST: BinaryExpression, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {

            if ((<Identifier>dottedNameAST.operand2).isMissing()) {
                return this.semanticInfoChain.anyTypeSymbol;
            }  

            var childTypeSymbol: PullTypeSymbol = <PullTypeSymbol>this.getSymbolForAST(dottedNameAST, context);

            if (childTypeSymbol /*&& childTypeSymbol.isResolved()*/) {
                if (!childTypeSymbol.isResolved()) {
                    this.resolveDeclaredSymbol(childTypeSymbol, enclosingDecl, context);
                }
                return childTypeSymbol;
            }

            var diagnostic: PullDiagnostic;

            // assemble the dotted name path
            var rhsName = (<Identifier>dottedNameAST.operand2).text;

            var prevSearchTypeSpace = context.searchTypeSpace;
            context.searchTypeSpace = true;

            var lhs: PullSymbol = this.resolveStatementOrExpression(dottedNameAST.operand1, false, enclosingDecl, context);

            context.searchTypeSpace = prevSearchTypeSpace;

            var lhsType = lhs.getType();

            if (this.isAnyOrEquivalent(lhsType)) {
                return lhsType;
            }

            if (!lhsType) {
                diagnostic = context.postError(dottedNameAST.operand2.minChar, dottedNameAST.operand2.getLength(), this.unitPath, "Could not find enclosing type for dotted type name '" + rhsName + "'", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            // now for the name...
            childTypeSymbol = lhsType.findNestedType(rhsName);

            if (!childTypeSymbol) {
                diagnostic = context.postError(dottedNameAST.operand2.minChar, dottedNameAST.operand2.getLength(), this.unitPath, "Could not find dotted type name '" + rhsName + "'", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            if (!childTypeSymbol.isResolved()) {
                this.resolveDeclaredSymbol(childTypeSymbol, enclosingDecl, context);
            }

            this.setSymbolForAST(dottedNameAST, childTypeSymbol, context);

            return childTypeSymbol;
        }

        public resolveFunctionExpression(funcDeclAST: FuncDecl, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            var functionDecl = this.getDeclForAST(funcDeclAST);
            var funcDeclSymbol: PullSymbol = null;

            if (functionDecl) {
                funcDeclSymbol = functionDecl.getSymbol();
                if (funcDeclSymbol.isResolved()) {
                    return funcDeclSymbol;
                }
            }

            // if we have an assigning AST with a type, and the funcDecl has no parameter types or return type annotation
            // we'll contextually type it
            // otherwise, just process it as a normal function declaration

            var shouldContextuallyType = isTypedAssignment;

            var assigningFunctionTypeSymbol: PullFunctionTypeSymbol = null;
            var assigningFunctionSignature: PullSignatureSymbol = null;
            var i = 0;

            if (funcDeclAST.returnTypeAnnotation) {
                shouldContextuallyType = false;
            }

            if (shouldContextuallyType && funcDeclAST.arguments) {

                for (i = 0; i < funcDeclAST.arguments.members.length; i++) {
                    if ((<ArgDecl>funcDeclAST.arguments.members[i]).typeExpr) {
                        shouldContextuallyType = false;
                        break;
                    }
                }
            }

            if (shouldContextuallyType) {

                assigningFunctionTypeSymbol = <PullFunctionTypeSymbol>context.getContextualType();

                if (assigningFunctionTypeSymbol) {
                    this.resolveDeclaredSymbol(assigningFunctionTypeSymbol, enclosingDecl, context);

                    if (assigningFunctionTypeSymbol) {
                        assigningFunctionSignature = assigningFunctionTypeSymbol.getCallSignatures()[0];
                    }
                }
            }

            // create a new function decl and symbol

            if (!funcDeclSymbol) {
                var semanticInfo = this.semanticInfoChain.getUnit(this.unitPath);
                var declCollectionContext = new DeclCollectionContext(semanticInfo);

                declCollectionContext.scriptName = this.unitPath;

                if (enclosingDecl) {
                    declCollectionContext.pushParent(enclosingDecl);
                }

                getAstWalkerFactory().walk(funcDeclAST, preCollectDecls, postCollectDecls, null, declCollectionContext);

                functionDecl = this.getDeclForAST(funcDeclAST);

                var binder = new PullSymbolBinder(this.compilationSettings, this.semanticInfoChain);
                binder.setUnit(this.unitPath);
                binder.bindFunctionExpressionToPullSymbol(functionDecl);

                funcDeclSymbol = <PullFunctionTypeSymbol>functionDecl.getSymbol();
            }

            var signature = funcDeclSymbol.getType().getCallSignatures()[0];

            // link parameters and resolve their annotations
            if (funcDeclAST.arguments) {

                var contextParams: PullSymbol[] = [];
                var contextParam: PullSymbol = null;

                if (assigningFunctionSignature) {
                    contextParams = assigningFunctionSignature.getParameters();
                }

                for (i = 0; i < funcDeclAST.arguments.members.length; i++) {

                    if (i < contextParams.length) {
                        contextParam = contextParams[i];
                    }

                    this.resolveFunctionExpressionParameter(<ArgDecl>funcDeclAST.arguments.members[i], contextParam, enclosingDecl, context);
                }
            }

            // resolve the return type annotation
            if (funcDeclAST.returnTypeAnnotation) {
                var returnTypeRef = <TypeReference>funcDeclAST.returnTypeAnnotation;
                var returnTypeSymbol = this.resolveTypeReference(returnTypeRef, enclosingDecl, context);

                signature.setReturnType(returnTypeSymbol);

            }
            else {
                if (assigningFunctionSignature) {
                    var returnType = assigningFunctionSignature.getReturnType();

                    if (returnType) {
                        context.pushContextualType(returnType, context.inProvisionalResolution(), null);
                        //signature.setReturnType(returnType);
                        this.resolveFunctionBodyReturnTypes(funcDeclAST, signature, true, functionDecl, context);
                        context.popContextualType();
                    }
                    else {
                        signature.setReturnType(this.semanticInfoChain.anyTypeSymbol);
                    }
                }
                else {
                    this.resolveFunctionBodyReturnTypes(funcDeclAST, signature, false, functionDecl, context);
                }
            }

            // set contextual type link
            if (assigningFunctionTypeSymbol) {
                funcDeclSymbol.addOutgoingLink(assigningFunctionTypeSymbol, SymbolLinkKind.ContextuallyTypedAs);
            }

            funcDeclSymbol.setResolved();

            return funcDeclSymbol;
        }

        static setSelfReferenceOnDecl(pullDecl: PullDecl) {
            pullDecl.setFlags(pullDecl.getFlags() | PullElementFlags.MustCaptureThis);
            return true;
        }

        // PULLTODO: Optimization: cache this for a given decl path
        public resolveThisExpression(ast: AST, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullTypeSymbol {
            if (!enclosingDecl) {
                return this.semanticInfoChain.anyTypeSymbol;
            }

            var previousResolutionSymbol = this.getSymbolForAST(ast, context);

            if (previousResolutionSymbol) {
                //CompilerDiagnostics.Alert("Call get hit");
                return <PullTypeSymbol>previousResolutionSymbol;
            }    

            var enclosingDeclKind = enclosingDecl.getKind();
            var diagnostic: PullDiagnostic = null;

            if (enclosingDeclKind == PullElementKind.Container) { // Dynamic modules are ok, though
                diagnostic = new PullDiagnostic(ast.minChar, ast.getLength(), this.currentUnit.getPath(), "'this' may not be referenced within module bodies");
                return this.getNewErrorTypeSymbol(diagnostic);

            }
            else if (!(enclosingDeclKind & (PullElementKind.SomeFunction | PullElementKind.Script))) {
                diagnostic = new PullDiagnostic(ast.minChar, ast.getLength(), this.currentUnit.getPath(), "Keyword 'this' cannot be referenced in initializers in a class body, or in super constructor calls");
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            var declPath: PullDecl[] = this.getPathToDecl(enclosingDecl);
            var decl: PullDecl;
            var classSymbol: PullClassTypeSymbol;

            // work back up the decl path, until you can find a class
            // PULLTODO: Obviously not completely correct, but this sufficiently unblocks testing of the pull model
            if (declPath.length) {
                var isFatArrowFunction = declPath[declPath.length - 1].getKind() == PullElementKind.FunctionExpression && (declPath[declPath.length - 1].getFlags() & PullElementFlags.FatArrow);
                var hasSetSelfReference = !isFatArrowFunction;
                var firstFncDecl: PullDecl = null;
                var i = 0;
                var declKind: PullElementKind;
                var declFlags: PullElementFlags;

                if (!hasSetSelfReference) {
                    for (i = declPath.length - 2; i >= 0; i--) {
                        decl = declPath[i];
                        declKind = decl.getKind();

                        if (declKind == PullElementKind.Function || declKind == PullElementKind.Method ||
                            declKind == PullElementKind.ConstructorMethod || declKind == PullElementKind.GetAccessor ||
                            declKind == PullElementKind.SetAccessor) {
                            hasSetSelfReference = PullTypeResolver.setSelfReferenceOnDecl(decl);
                        }
                        else if (declKind == PullElementKind.FunctionExpression) {
                            if (!(decl.getFlags() & PullElementFlags.FatArrow)) {
                                hasSetSelfReference = PullTypeResolver.setSelfReferenceOnDecl(decl);
                            }
                            else if (decl.getFlags() & PullElementFlags.MustCaptureThis) {
                                firstFncDecl = null;
                                break;
                            }
                            else if (!firstFncDecl) {
                                firstFncDecl = decl;
                            }
                        }
                        else {
                            break;
                        }
                    }

                    if (!hasSetSelfReference && firstFncDecl) {
                        hasSetSelfReference = PullTypeResolver.setSelfReferenceOnDecl(firstFncDecl);
                    }
                }

                var hadFatArrow = false;

                for (i = declPath.length - 1; i >= 0; i--) {
                    decl = declPath[i];
                    declKind = decl.getKind();
                    declFlags = decl.getFlags();

                    if (declFlags & PullElementFlags.Static) {
                        this.setSymbolForAST(ast, this.semanticInfoChain.anyTypeSymbol, context);
                        return this.semanticInfoChain.anyTypeSymbol;
                    }

                    if (declKind == PullElementKind.FunctionExpression) {
                        if (!(declFlags & PullElementFlags.FatArrow) && !hadFatArrow) {
                            this.setSymbolForAST(ast, this.semanticInfoChain.anyTypeSymbol, context);
                            return this.semanticInfoChain.anyTypeSymbol;
                        }
                        else {
                            hadFatArrow = true;
                        }
                    }

                    if (declKind == PullElementKind.Function) {
                        this.setSymbolForAST(ast, this.semanticInfoChain.anyTypeSymbol, context);
                        return this.semanticInfoChain.anyTypeSymbol;
                    }

                    if (declKind == PullElementKind.Class) {
                        classSymbol = <PullClassTypeSymbol>decl.getSymbol();

                        if (!hasSetSelfReference) {
                            hasSetSelfReference = PullTypeResolver.setSelfReferenceOnDecl(decl);
                        }
                        this.setSymbolForAST(ast, classSymbol, context);
                        return classSymbol;
                    }

                    if (!hasSetSelfReference &&
                        (declKind == PullElementKind.Container ||
                        declKind == PullElementKind.DynamicModule ||
                        declKind == PullElementKind.Script)) {
                        hasSetSelfReference = PullTypeResolver.setSelfReferenceOnDecl(decl);
                        break;
                    }
                }
            }
            this.setSymbolForAST(ast, this.semanticInfoChain.anyTypeSymbol, context);
            return this.semanticInfoChain.anyTypeSymbol;
        }

        // PULLTODO: Optimization: cache this for a given decl path
        public resolveSuperExpression(ast: AST, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {
            if (!enclosingDecl) {
                return this.semanticInfoChain.anyTypeSymbol;
            }

            var declPath: PullDecl[] = enclosingDecl !== null ? this.getPathToDecl(enclosingDecl) : [];
            var decl: PullDecl;
            var declFlags: PullElementFlags;
            var classSymbol: PullClassTypeSymbol = null;

            // work back up the decl path, until you can find a class
            if (declPath.length) {
                for (var i = declPath.length - 1; i >= 0; i--) {
                    decl = declPath[i];
                    declFlags = decl.getFlags();

                    if (decl.getKind() == PullElementKind.FunctionExpression &&
                        !(declFlags & PullElementFlags.FatArrow)) {

                        break;
                    }
                    else if (declFlags & PullElementFlags.Static) {
                        break;
                    }
                    else if (decl.getKind() == PullElementKind.Class) {
                        classSymbol = <PullClassTypeSymbol>decl.getSymbol();

                        break;
                    }
                }
            }

            if (classSymbol) {
                var parents = classSymbol.getExtendedTypes();

                if (parents.length) {
                    return parents[0];
                }
            }

            return this.semanticInfoChain.anyTypeSymbol;
        }

        // if there's no type annotation on the assigning AST, we need to create a type from each binary expression
        // in the object literal
        public resolveObjectLiteralExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            var previousResolutionSymbol = this.getSymbolForAST(expressionAST, context);

            if (previousResolutionSymbol) {
                //CompilerDiagnostics.Alert("Call get hit");
                return <PullTypeSymbol>previousResolutionSymbol;
            }   

            var typeSymbol: PullTypeSymbol = <PullTypeSymbol>this.getSymbolForAST(expressionAST, context);
            var span: TextSpan;

            if (typeSymbol && typeSymbol.isResolved()) {
                return typeSymbol.getType();
            }

            // PULLTODO: Create a decl for the object literal

            // walk the members of the object literal,
            // create fields for each based on the value assigned in
            var objectLitAST = <UnaryExpression>expressionAST;

            span = TextSpan.fromBounds(objectLitAST.minChar, objectLitAST.limChar);

            var objectLitDecl = new PullDecl("", PullElementKind.ObjectLiteral, PullElementFlags.None, span, this.unitPath);

            if (enclosingDecl) {
                objectLitDecl.setParentDecl(enclosingDecl);
            }

            this.currentUnit.setDeclForAST(objectLitAST, objectLitDecl);
            this.currentUnit.setASTForDecl(objectLitDecl, objectLitAST);

            typeSymbol = new PullTypeSymbol("", PullElementKind.Interface);
            typeSymbol.addDeclaration(objectLitDecl);
            objectLitDecl.setSymbol(typeSymbol);

            var memberDecls = <ASTList>objectLitAST.operand;

            var contextualType: PullTypeSymbol = null;

            if (isTypedAssignment) {
                contextualType = context.getContextualType();

                this.resolveDeclaredSymbol(contextualType, enclosingDecl, context);
            }

            if (memberDecls) {
                var binex: BinaryExpression;
                var id: AST;
                var text: string;
                var idText: string;
                var memberSymbol: PullSymbol;
                var memberExprType: PullSymbol;
                var assigningSymbol: PullSymbol = null;
                var acceptedContextualType = false;

                for (var i = 0, len = memberDecls.members.length; i < len; i++) {
                    binex = <BinaryExpression>memberDecls.members[i];

                    id = binex.operand1;

                    if (id.nodeType == NodeType.Name) {
                        text = (<Identifier>id).text;
                    }
                    else if (id.nodeType == NodeType.StringLiteral) {
                        idText = (<StringLiteral>id).text;
                        text = idText.substring(1, idText.length - 1);
                    }
                    else {
                        return this.semanticInfoChain.anyTypeSymbol;
                    }

                    // PULLTODO: Collect these at decl collection time, add them to the var decl
                    span = TextSpan.fromBounds(binex.minChar, binex.limChar);

                    var decl = new PullDecl(text, PullElementKind.Property, PullElementFlags.Public, span, this.unitPath);

                    objectLitDecl.addChildDecl(decl);
                    decl.setParentDecl(objectLitDecl);

                    this.semanticInfoChain.getUnit(this.unitPath).setDeclForAST(binex, decl);
                    this.semanticInfoChain.getUnit(this.unitPath).setASTForDecl(decl, binex);

                    memberSymbol = new PullSymbol(text, PullElementKind.Property);

                    memberSymbol.addDeclaration(decl);
                    decl.setSymbol(memberSymbol);

                    if (contextualType) {
                        assigningSymbol = contextualType.findMember(text);

                        if (assigningSymbol) {

                            this.resolveDeclaredSymbol(assigningSymbol, enclosingDecl, context);

                            context.pushContextualType(assigningSymbol.getType(), context.inProvisionalResolution(), null);

                            acceptedContextualType = true;
                        }
                    }

                    // if operand 2 is a getter or a setter, we need to resolve it properly
                    if (binex.operand2.nodeType == NodeType.FuncDecl) {
                        var funcDeclAST = <FuncDecl>binex.operand2;

                        if (funcDeclAST.isAccessor()) {
                            var semanticInfo = this.semanticInfoChain.getUnit(this.unitPath);
                            var declCollectionContext = new DeclCollectionContext(semanticInfo);

                            declCollectionContext.scriptName = this.unitPath;

                            declCollectionContext.pushParent(objectLitDecl);

                            getAstWalkerFactory().walk(funcDeclAST, preCollectDecls, postCollectDecls, null, declCollectionContext);

                            var functionDecl = this.getDeclForAST(funcDeclAST);

                            var binder = new PullSymbolBinder(this.compilationSettings, this.semanticInfoChain);
                            binder.setUnit(this.unitPath);
                            binder.pushParent(typeSymbol, objectLitDecl);

                            if (funcDeclAST.isGetAccessor()) {
                                binder.bindGetAccessorDeclarationToPullSymbol(functionDecl);
                            }
                            else {
                                binder.bindSetAccessorDeclarationToPullSymbol(functionDecl);
                            }
                        }
                    }

                    memberExprType = this.resolveStatementOrExpression(binex.operand2, assigningSymbol != null, enclosingDecl, context);

                    if (acceptedContextualType) {
                        context.popContextualType();
                        acceptedContextualType = false;
                    }

                    context.setTypeInContext(memberSymbol, memberExprType.getType());

                    memberSymbol.setResolved();

                    this.setSymbolForAST(binex.operand1, memberSymbol, context);

                    typeSymbol.addMember(memberSymbol, SymbolLinkKind.PublicMember);
                }
            }

            typeSymbol.setResolved();

            this.setSymbolForAST(expressionAST, typeSymbol, context);

            return typeSymbol;
        }

        public resolveArrayLiteralExpression(expressionAST: AST, isTypedAssignment, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            var previousResolutionSymbol = this.getSymbolForAST(expressionAST, context);

            if (previousResolutionSymbol) {
                return <PullTypeSymbol>previousResolutionSymbol;
            }   

            var arrayLit = <UnaryExpression>expressionAST;

            var elements = <ASTList>arrayLit.operand;
            var elementType = this.semanticInfoChain.anyTypeSymbol;
            var elementTypes: PullTypeSymbol[] = [];
            var targetElementType: PullTypeSymbol = null;
            var comparisonInfo = new TypeComparisonInfo();
            comparisonInfo.onlyCaptureFirstError = true;

            // if the target type is an array type, extract the element type
            if (isTypedAssignment) {
                var contextualType = context.getContextualType();

                this.resolveDeclaredSymbol(contextualType, enclosingDecl, context);

                if (contextualType.isArray()) {
                    contextualType = contextualType.getElementType();
                }

                context.pushContextualType(contextualType, context.inProvisionalResolution(), null);
            }

            if (elements) {

                for (var i = 0; i < elements.members.length; i++) {
                    elementTypes[elementTypes.length] = this.resolveStatementOrExpression(elements.members[i], isTypedAssignment, enclosingDecl, context).getType();
                }

                if (isTypedAssignment) {
                    context.popContextualType();
                }

                if (elementTypes.length) {
                    elementType = elementTypes[0];
                }

                var collection: IPullTypeCollection = {
                    getLength: () => { return elements.members.length; },
                    setTypeAtIndex: (index: number, type: PullTypeSymbol) => { elementTypes[index] = type; },
                    getTypeAtIndex: (index: number) => { return elementTypes[index]; }
                }

                elementType = this.findBestCommonType(elementType, targetElementType, collection, false, context, comparisonInfo);

                // if the array type is the undefined type, we should widen it to any
                // if it's of the null type, only widen it if it's not in a nested array element, so as not to 
                // short-circuit any checks for the best common type
                if (elementType == this.semanticInfoChain.undefinedTypeSymbol || elementType == this.semanticInfoChain.nullTypeSymbol) {
                    elementType = this.semanticInfoChain.anyTypeSymbol;
                }
            }
            if (!elementType) {
                context.postError(expressionAST.minChar, expressionAST.getLength(), this.unitPath, "Incompatible types in array literal expression", enclosingDecl, true);

                elementType = this.semanticInfoChain.anyTypeSymbol;
            }
            else if (targetElementType) {
                // for the case of zero-length 'any' arrays, we still want to set the contextual type, if
                // need be
                if (this.sourceIsAssignableToTarget(elementType, targetElementType, context)) {
                    elementType = targetElementType;
                }
            }

            var arraySymbol = elementType.getArrayType();

            // ...But in case we haven't...
            if (!arraySymbol) {

                if (!this.cachedArrayInterfaceType) {
                    this.cachedArrayInterfaceType = <PullTypeSymbol>this.getSymbolFromDeclPath("Array", this.getPathToDecl(enclosingDecl), PullElementKind.Interface);
                }

                if (this.cachedArrayInterfaceType && !this.cachedArrayInterfaceType.isResolved()) {
                    this.resolveDeclaredSymbol(this.cachedArrayInterfaceType, enclosingDecl, context);
                }

                arraySymbol = specializeToArrayType(this.semanticInfoChain.elementTypeSymbol, elementType, this, context);

                if (!arraySymbol) {
                    arraySymbol = this.semanticInfoChain.anyTypeSymbol;
                }
            }

            this.setSymbolForAST(expressionAST, arraySymbol, context);

            return arraySymbol;
        }

        public resolveIndexExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            var previousResolutionSymbol = this.getSymbolForAST(expressionAST, context);

            if (previousResolutionSymbol) {
                return <PullTypeSymbol>previousResolutionSymbol;
            }   

            var indexType = <PullTypeSymbol>this.resolveStatementOrExpression((<BinaryExpression>expressionAST).operand1, isTypedAssignment, enclosingDecl, context).getType();
            var elementType = indexType.getElementType();

            if (elementType) {
                this.setSymbolForAST(expressionAST, elementType, context);
                return elementType;
            }

            return this.semanticInfoChain.anyTypeSymbol;
        }

        public resolveBitwiseOperator(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            var binex = <BinaryExpression>expressionAST;

            var leftType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand1, isTypedAssignment, enclosingDecl, context).getType();
            var rightType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand2, isTypedAssignment, enclosingDecl, context).getType();

            if (this.sourceIsSubtypeOfTarget(leftType, this.semanticInfoChain.numberTypeSymbol, context) &&
                this.sourceIsSubtypeOfTarget(rightType, this.semanticInfoChain.numberTypeSymbol, context)) {

                return this.semanticInfoChain.numberTypeSymbol;
            }
            else if ((leftType == this.semanticInfoChain.boolTypeSymbol) &&
                     (rightType == this.semanticInfoChain.boolTypeSymbol)) {

                return this.semanticInfoChain.boolTypeSymbol;
            }
            else if (this.isAnyOrEquivalent(leftType)) {
                if ((this.isAnyOrEquivalent(rightType) ||
                    (rightType == this.semanticInfoChain.numberTypeSymbol) ||
                    (rightType == this.semanticInfoChain.boolTypeSymbol))) {

                    return this.semanticInfoChain.anyTypeSymbol;
                }
            }
            else if (this.isAnyOrEquivalent(rightType)) {
                if ((leftType == this.semanticInfoChain.numberTypeSymbol) ||
                    (leftType == this.semanticInfoChain.boolTypeSymbol)) {

                    return this.semanticInfoChain.anyTypeSymbol;
                }
            }

            return this.semanticInfoChain.anyTypeSymbol;
        }

        public resolveArithmeticExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {
            var binex = <BinaryExpression>expressionAST;

            var leftType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand1, isTypedAssignment, enclosingDecl, context).getType();
            var rightType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand2, isTypedAssignment, enclosingDecl, context).getType();

            // PULLREVIEW: Eh?  I've preserved the logic from the current implementation, but it could use cleaning up
            if (this.isNullOrUndefinedType(leftType)) {
                leftType = rightType;
            }
            if (this.isNullOrUndefinedType(rightType)) {
                rightType = leftType;
            }

            leftType = this.widenType(leftType);
            rightType = this.widenType(rightType);

            if (expressionAST.nodeType == NodeType.Add || expressionAST.nodeType == NodeType.AsgAdd) {
                if (leftType == this.semanticInfoChain.stringTypeSymbol || rightType == this.semanticInfoChain.stringTypeSymbol) {
                    return this.semanticInfoChain.stringTypeSymbol;
                }
                else if (leftType == this.semanticInfoChain.numberTypeSymbol && rightType == this.semanticInfoChain.numberTypeSymbol) {
                    return this.semanticInfoChain.numberTypeSymbol;
                }
                else if (this.sourceIsSubtypeOfTarget(leftType, this.semanticInfoChain.numberTypeSymbol, context) && this.sourceIsSubtypeOfTarget(rightType, this.semanticInfoChain.numberTypeSymbol, context)) {
                    return this.semanticInfoChain.numberTypeSymbol;
                }
                else {
                    // could be an error
                    return this.semanticInfoChain.anyTypeSymbol;
                }
            }
            else {
                if (leftType == this.semanticInfoChain.numberTypeSymbol && rightType == this.semanticInfoChain.numberTypeSymbol) {
                    return this.semanticInfoChain.numberTypeSymbol;
                }
                else if (this.sourceIsSubtypeOfTarget(leftType, this.semanticInfoChain.numberTypeSymbol, context) && this.sourceIsSubtypeOfTarget(rightType, this.semanticInfoChain.numberTypeSymbol, context)) {
                    return this.semanticInfoChain.numberTypeSymbol;
                }
                else if (this.isAnyOrEquivalent(leftType) || this.isAnyOrEquivalent(rightType)) {
                    return this.semanticInfoChain.numberTypeSymbol;
                }
                else {
                    // error
                    return this.semanticInfoChain.anyTypeSymbol;
                }
            }
        }

        public resolveLogicalOrExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {
            var binex = <BinaryExpression>expressionAST;

            var leftType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand1, isTypedAssignment, enclosingDecl, context).getType();
            var rightType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand2, isTypedAssignment, enclosingDecl, context).getType();

            if (this.isAnyOrEquivalent(leftType) || this.isAnyOrEquivalent(rightType)) {
                return this.semanticInfoChain.anyTypeSymbol;
            }
            else if (leftType == this.semanticInfoChain.boolTypeSymbol) {
                if (rightType == this.semanticInfoChain.boolTypeSymbol) {
                    return this.semanticInfoChain.boolTypeSymbol;
                }
                else {
                    return this.semanticInfoChain.anyTypeSymbol;
                }
            }
            else if (leftType == this.semanticInfoChain.numberTypeSymbol) {
                if (rightType == this.semanticInfoChain.numberTypeSymbol) {
                    return this.semanticInfoChain.numberTypeSymbol;
                }
                else {
                    return this.semanticInfoChain.anyTypeSymbol
                }
            }
            else if (leftType == this.semanticInfoChain.stringTypeSymbol) {
                if (rightType == this.semanticInfoChain.stringTypeSymbol) {
                    return this.semanticInfoChain.stringTypeSymbol;
                }
                else {
                    return this.semanticInfoChain.anyTypeSymbol;
                }
            }
            else if (this.sourceIsSubtypeOfTarget(leftType, rightType, context)) {
                return rightType;
            }
            else if (this.sourceIsSubtypeOfTarget(rightType, leftType, context)) {
                return leftType;
            }

            return this.semanticInfoChain.anyTypeSymbol;
        }

        public resolveLogicalAndExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {
            var binex = <BinaryExpression>expressionAST;

            var leftType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand1, isTypedAssignment, enclosingDecl, context).getType();
            var rightType = <PullTypeSymbol>this.resolveStatementOrExpression(binex.operand2, isTypedAssignment, enclosingDecl, context).getType();

            return rightType;
        }

        public resolveConditionalExpression(trinex: ConditionalExpression, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {
            var previousResolutionSymbol = this.getSymbolForAST(trinex, context);

            if (previousResolutionSymbol) {
                return <PullTypeSymbol>previousResolutionSymbol;
            }   

            var condType = this.resolveAST(trinex.operand1, false, enclosingDecl, context).getType();
            var leftType = this.resolveAST(trinex.operand2, false, enclosingDecl, context).getType();
            var rightType = this.resolveAST(trinex.operand3, false, enclosingDecl, context).getType();

            if (this.typesAreIdentical(leftType, rightType)) {
                return leftType;
            }

            var collection: IPullTypeCollection = {
                getLength: () => { return 2; },
                setTypeAtIndex: (index: number, type: PullTypeSymbol) => { }, // no contextual typing here, so no need to do anything
                getTypeAtIndex: (index: number) => { return rightType; } // we only want the "second" type - the "first" is skipped
            }

            var bct = this.findBestCommonType(leftType, null, collection, false, context);

            if (bct) {
                this.setSymbolForAST(trinex, bct, context);
                return bct;
            }

            var diagnostic = context.postError(trinex.minChar, trinex.getLength(), this.getUnitPath(), "Conditional expression types do not agree", enclosingDecl);

            return this.getNewErrorTypeSymbol(diagnostic);
        }

        public resolveParenthesizedExpression(ast: ParenthesizedExpression, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {
            return this.resolveAST(ast.expression, false, enclosingDecl, context);
        }

        public resolveExpressionStatement(ast: ExpressionStatement, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext) {
            return this.resolveAST(ast.expression, isTypedAssignment, enclosingDecl, context);
        }

        public resolveCallExpression(callEx: CallExpression, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): PullSymbol {

            if (!additionalResults) {
                var previousResolutionSymbol = this.getSymbolForAST(callEx, context);

                if (previousResolutionSymbol) {
                //CompilerDiagnostics.Alert("Call get hit");
                    return previousResolutionSymbol;
                }
            }

            // resolve the target
            var targetSymbol = this.resolveStatementOrExpression(callEx.target, isTypedAssignment, enclosingDecl, context).getType();

            if (this.isAnyOrEquivalent(targetSymbol)) {
                this.setSymbolForAST(callEx, this.semanticInfoChain.anyTypeSymbol, context);
                return targetSymbol;
            }

            var isSuperCall = false;
            var diagnostic: PullDiagnostic;

            if (callEx.target.nodeType == NodeType.SuperExpression) {
                isSuperCall = true;

                if (targetSymbol.isClass()) { 
                    targetSymbol = (<PullClassTypeSymbol>targetSymbol).getConstructorMethod().getType();
                }
                else {
                    diagnostic = context.postError(callEx.minChar, callEx.getLength(), this.unitPath, "Invalid super call on non-class type '"+ targetSymbol.toString() + "'", enclosingDecl);
                    return this.getNewErrorTypeSymbol(diagnostic);                    
                }
            }

            var signatures = isSuperCall ? (<PullFunctionTypeSymbol>targetSymbol).getConstructSignatures() : (<PullFunctionTypeSymbol>targetSymbol).getCallSignatures();

            var typeArgs: PullTypeSymbol[] = null;
            var typeReplacementMap: any = null;
            var i = 0;

            // resolve the type arguments, specializing if necessary
            if (callEx.typeArguments) {
                // specialize the type arguments
                typeArgs = [];

                var typeArg: PullTypeSymbol = null;

                if (callEx.typeArguments && callEx.typeArguments.members.length) {
                    for (i = 0; i < callEx.typeArguments.members.length; i++) {
                        typeArg = this.resolveTypeReference(<TypeReference>callEx.typeArguments.members[i], enclosingDecl, context);
                        typeArgs[i] = context.findSpecializationForType(typeArg);
                    }
                }
            }

            // next, walk the available signatures
            // if any are generic, and we don't have type arguments, try to infer
            // otherwise, try to specialize to the type arguments above
            if (targetSymbol.isGeneric()) {

                var resolvedSignatures: PullSignatureSymbol[] = [];
                var inferredTypeArgs: PullTypeSymbol[];
                var specializedSignature: PullSignatureSymbol;
                var typeParameters: PullTypeParameterSymbol[];
                var typeConstraint: PullTypeSymbol = null;

                for (i = 0; i < signatures.length; i++) {
                    typeParameters = signatures[i].getTypeParameters();
                    
                    if (signatures[i].isGeneric() && typeParameters.length) {
                        if (typeArgs) {
                            inferredTypeArgs = typeArgs;
                        }
                        else if (callEx.arguments) {
                            inferredTypeArgs = this.inferArgumentTypesForSignature(signatures[i], callEx.arguments, new TypeComparisonInfo(), enclosingDecl, context);
                        }

                        // if we could infer Args, or we have type arguments, then attempt to specialize the signature
                        if (inferredTypeArgs) {

                            if (inferredTypeArgs.length < typeParameters.length) {
                                continue;
                            }

                            typeReplacementMap = {};

                            for (var j = 0; j < typeParameters.length; j++) {
                                typeReplacementMap[typeParameters[j].getSymbolID().toString()] = inferredTypeArgs[j];

                                typeConstraint = typeParameters[j].getConstraint();

                                // test specialization type for assignment compatibility with the constraint
                                if (typeConstraint) {
                                    if (typeConstraint.isTypeParameter()) {
                                        context.pushTypeSpecializationCache(typeReplacementMap);
                                        typeConstraint = specializeType(typeConstraint, inferredTypeArgs, this, enclosingDecl, context);  //<PullTypeSymbol>this.resolveDeclaredSymbol(typeConstraint, enclosingDecl, context);
                                        context.popTypeSpecializationCache();
                                    }
                                    if (!this.sourceIsAssignableToTarget(inferredTypeArgs[j], typeConstraint, context)) {
                                        context.postError(callEx.target.minChar, callEx.target.getLength(), this.getUnitPath(), "Type '" + inferredTypeArgs[j].toString(true) + "' does not satisfy the constraint '" + typeConstraint.toString(true) + "' for type parameter '" + typeParameters[j].toString(true) + "'", enclosingDecl, true);
                                    }
                                }
                            }

                            specializedSignature = specializeSignature(signatures[i], false, typeReplacementMap, inferredTypeArgs, this, enclosingDecl, context);

                            if (specializedSignature) {
                                resolvedSignatures[resolvedSignatures.length] = specializedSignature;
                            }
                        }
                    }
                    else {
                        resolvedSignatures[resolvedSignatures.length] = signatures[i];
                    }
                }
                // PULLTODO: Try to avoid copying here...
                signatures = resolvedSignatures;
            }

            // the target should be a function
            //if (!targetSymbol.isType()) {
            //    this.log("Attempting to call a non-function symbol");
            //    return this.semanticInfoChain.anyTypeSymbol;
            //}

            if (!signatures.length) {

                // if there are no call signatures, but the target is a subtype of 'Function', return 'any'
                if (this.cachedFunctionInterfaceType && this.sourceIsSubtypeOfTarget(targetSymbol, this.cachedFunctionInterfaceType, context)) {
                    return this.semanticInfoChain.anyTypeSymbol;
                }

                diagnostic = context.postError(callEx.minChar, callEx.getLength(), this.unitPath, "Attempting to call on a type with no call signatures", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            var signature = this.resolveOverloads(callEx, signatures, enclosingDecl, context);

            // Store any additional resolution results if needed before we return
            if (additionalResults) {
                additionalResults.targetSymbol = targetSymbol;
                additionalResults.resolvedSignatures = signatures;
                additionalResults.candidateSignature = signature;
            }

            if (!signature) {
                diagnostic = context.postError(callEx.minChar, callEx.getLength(), this.unitPath, "Could not select overload for call expression", enclosingDecl);
                return this.getNewErrorTypeSymbol(diagnostic);
            }

            var returnType = signature.getReturnType();

            // contextually type arguments
            if (callEx.arguments) {
                var len = callEx.arguments.members.length;
                var params = signature.getParameters();
                var contextualType: PullTypeSymbol = null;
                var signatureDecl = signature.getDeclarations()[0];
                    
                for (i = 0; i < len; i++) {

                    if (params.length && i < params.length) {
                        if (typeReplacementMap) {
                            context.pushTypeSpecializationCache(typeReplacementMap);
                        }
                        this.resolveDeclaredSymbol(params[i], signatureDecl, context);
                        if (typeReplacementMap) {
                            context.popTypeSpecializationCache();
                        }
                        contextualType = params[i].getType();
                    }
                    else if (params.length) {
                        contextualType = params[params.length - 1].getType();
                        if (contextualType.isArray()) {
                            contextualType = contextualType.getElementType();
                        }
                    }

                    if (contextualType) {
                        context.pushContextualType(contextualType, context.inProvisionalResolution(), null);
                    }

                    this.resolveStatementOrExpression(callEx.arguments.members[i], contextualType != null, enclosingDecl, context);

                    if (contextualType) {
                        context.popContextualType();
                        contextualType = null;
                    }
                }
            }

            if (!returnType) {
                returnType = this.semanticInfoChain.anyTypeSymbol;
            }

            this.setSymbolForAST(callEx, returnType, context);

            return returnType;
        }

        public resolveNewExpression(callEx: CallExpression, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): PullSymbol {

            if (!additionalResults) {
                var previousResolutionSymbol = this.getSymbolForAST(callEx, context);

                if (previousResolutionSymbol) {
                //CompilerDiagnostics.Alert("New get hit");
                    return previousResolutionSymbol;
                }
            }

            var returnType: PullTypeSymbol = null;

            // resolve the target
            var targetSymbol = this.resolveStatementOrExpression(callEx.target, isTypedAssignment, enclosingDecl, context);

            var targetTypeSymbol = targetSymbol.isType() ? <PullTypeSymbol>targetSymbol : targetSymbol.getType();

            var i = 0;

            // PULLREVIEW: In the case of a generic instantiation of a class type,
            // we'll have gotten a 'GenericType' node, which will be resolved as the class type and not
            // the constructor type.  In this case, set the targetTypeSymbol to the constructor type
            if (targetTypeSymbol.isClass()) {
                targetTypeSymbol = (<PullClassTypeSymbol>targetTypeSymbol).getConstructorMethod().getType();
            }

            var constructSignatures = targetTypeSymbol.getConstructSignatures();

            var typeArgs: PullTypeSymbol[] = null;
            var typeReplacementMap: any = null;
            var usedCallSignaturesInstead = false;

            if (this.isAnyOrEquivalent(targetTypeSymbol)) {
                this.setSymbolForAST(callEx, targetTypeSymbol, context);
                return targetTypeSymbol;
            }            

            var diagnostic: PullDiagnostic;

            if (!constructSignatures.length) {
                constructSignatures = targetTypeSymbol.getCallSignatures();
                usedCallSignaturesInstead = true;
            }            

            if (constructSignatures.length) {

                // resolve the type arguments, specializing if necessary
                if (callEx.typeArguments) {
                    // specialize the type arguments
                    typeArgs = [];

                    var typeArg: PullTypeSymbol = null;

                    if (callEx.typeArguments && callEx.typeArguments.members.length) {
                        for (i = 0; i < callEx.typeArguments.members.length; i++) {
                            typeArg = this.resolveTypeReference(<TypeReference>callEx.typeArguments.members[i], enclosingDecl, context);
                            typeArgs[i] = context.findSpecializationForType(typeArg);
                        }
                    }
                }

                // next, walk the available signatures
                // if any are generic, and we don't have type arguments, try to infer
                // otherwise, try to specialize to the type arguments above
                if (targetTypeSymbol.isGeneric()) {

                    var resolvedSignatures: PullSignatureSymbol[] = [];
                    var inferredTypeArgs: PullTypeSymbol[];
                    var specializedSignature: PullSignatureSymbol;
                    var typeParameters: PullTypeParameterSymbol[];
                    var typeConstraint: PullTypeSymbol = null;

                    for (i = 0; i < constructSignatures.length; i++) {
                        if (constructSignatures[i].isGeneric()) {
                            if (typeArgs) {
                                inferredTypeArgs = typeArgs;
                            }
                            else if (callEx.arguments) {
                                inferredTypeArgs = this.inferArgumentTypesForSignature(constructSignatures[i], callEx.arguments, new TypeComparisonInfo(), enclosingDecl, context);
                            }

                            // if we could infer Args, or we have type arguments, then attempt to specialize the signature
                            if (inferredTypeArgs) {
                                typeParameters = constructSignatures[i].getTypeParameters();

                                if (inferredTypeArgs.length != typeParameters.length) {
                                    continue;
                                }

                                typeReplacementMap = {};

                                for (var j = 0; j < typeParameters.length; j++) {
                                    typeReplacementMap[typeParameters[j].getSymbolID().toString()] = inferredTypeArgs[j];

                                    typeConstraint = typeParameters[j].getConstraint();

                                    // test specialization type for assignment compatibility with the constraint
                                    if (typeConstraint) {
                                        
                                        if (typeConstraint.isTypeParameter()) {
                                            context.pushTypeSpecializationCache(typeReplacementMap);
                                            typeConstraint = specializeType(typeConstraint, inferredTypeArgs, this, enclosingDecl, context);  //<PullTypeSymbol>this.resolveDeclaredSymbol(typeConstraint, enclosingDecl, context);
                                            context.popTypeSpecializationCache();
                                        }

                                        if (!this.sourceIsAssignableToTarget(inferredTypeArgs[j], typeConstraint, context)) {
                                            context.postError(callEx.target.minChar, callEx.target.getLength(), this.getUnitPath(), "Type '" + inferredTypeArgs[j].toString(true) + "' does not satisfy the constraint '" + typeConstraint.toString(true) + "' for type parameter '" + typeParameters[j].toString(true) + "'", enclosingDecl, true);
                                        }

                                    }
                                }

                                specializedSignature = specializeSignature(constructSignatures[i], false, typeReplacementMap, inferredTypeArgs, this, enclosingDecl, context);

                                if (specializedSignature) {
                                    resolvedSignatures[resolvedSignatures.length] = specializedSignature;
                                }
                            }
                        }
                        else {
                            resolvedSignatures[resolvedSignatures.length] = constructSignatures[i];
                        }
                    }
                    // PULLTODO: Try to avoid copying here...
                    constructSignatures = resolvedSignatures;
                }

                // the target should be a function
                //if (!targetSymbol.isType()) {
                //    this.log("Attempting to call a non-function symbol");
                //    return this.semanticInfoChain.anyTypeSymbol;
                //}

                var signature = this.resolveOverloads(callEx, constructSignatures, enclosingDecl, context);

                // Store any additional resolution results if needed before we return
                if (additionalResults) {
                    additionalResults.targetSymbol = targetTypeSymbol;
                    additionalResults.resolvedSignatures = constructSignatures;
                    additionalResults.candidateSignature = signature;
                }

                // if we haven't been able to choose an overload, default to the first one
                if (!signature) {
                    //signature = constructSignatures[0];
                    diagnostic = context.postError(callEx.minChar, callEx.getLength(), this.unitPath, "Could not select overload for 'new' expression", enclosingDecl);
                    return this.getNewErrorTypeSymbol(diagnostic);
                }

                returnType = signature.getReturnType();

                // if it's a default constructor, and we have a type argument, we need to specialize
                if (returnType && !signature.isGeneric() && returnType.isGeneric() && !returnType.getIsSpecialized()) {
                    if (typeArgs.length) {
                        returnType = specializeType(returnType, typeArgs, this, enclosingDecl, context, callEx);
                    }
                    else {
                        returnType = this.specializeTypeToAny(returnType, enclosingDecl, context);
                    }
                }

                if (usedCallSignaturesInstead) {
                    if (returnType != this.semanticInfoChain.voidTypeSymbol) {
                        diagnostic = context.postError(callEx.minChar, callEx.getLength(), this.unitPath, "Call signatures used in a 'new' expression must have a return type of 'void'", enclosingDecl);
                        return this.getNewErrorTypeSymbol(diagnostic);                        
                    }
                }

                if (!returnType) {
                    returnType = signature.getReturnType();

                    if (!returnType) {
                        returnType = targetTypeSymbol;
                    }
                }

                // contextually type arguments
                if (callEx.arguments) {
                    var len = callEx.arguments.members.length;
                    var params = signature.getParameters();
                    var contextualType: PullTypeSymbol = null;
                    var signatureDecl = signature.getDeclarations()[0];

                    for (i = 0; i < len; i++) {

                        if (params.length && i < params.length) {
                            if (typeReplacementMap) {
                                context.pushTypeSpecializationCache(typeReplacementMap);
                            }
                            this.resolveDeclaredSymbol(params[i], signatureDecl, context);
                            if (typeReplacementMap) {
                                context.popTypeSpecializationCache();
                            }
                            contextualType = params[i].getType();
                        }
                        else if (params.length) {
                            contextualType = params[params.length - 1].getType();
                            if (contextualType.isArray()) {
                                contextualType = contextualType.getElementType();
                            }
                        }

                        if (contextualType) {
                            context.pushContextualType(contextualType, context.inProvisionalResolution(), null);
                        }

                        this.resolveStatementOrExpression(callEx.arguments.members[i], contextualType != null, enclosingDecl, context);

                        if (contextualType) {
                            context.popContextualType();
                            contextualType = null;
                        }
                    }
                }

                if (!returnType) {
                    returnType = this.semanticInfoChain.anyTypeSymbol;
                }

                this.setSymbolForAST(callEx, returnType, context);

                return returnType;
            }
            else if (targetTypeSymbol.isClass()) {

                this.setSymbolForAST(callEx, returnType, context);

                // implicit constructor
                return returnType;
            }

            diagnostic = context.postError(callEx.minChar, callEx.getLength(), this.unitPath, "Invalid 'new' expression", enclosingDecl);

            return this.getNewErrorTypeSymbol(diagnostic);

        }

        public resolveTypeAssertionExpression(expressionAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {

            var assertionExpression = <UnaryExpression>expressionAST;
            var typeReference = this.resolveTypeReference(<TypeReference>assertionExpression.castTerm, enclosingDecl, context);

            // PULLTODO: We don't technically need to resolve the operand, since the type of the
            // expression is the type of the cast term.  Still, it makes life a bit easier for the LS
            if (context.resolveAggressively && assertionExpression.operand.nodeType !== NodeType.ParenthesizedExpression) {
                context.pushContextualType(typeReference, context.inProvisionalResolution(), null);
                this.resolveStatementOrExpression(assertionExpression.operand, true, enclosingDecl, context);
                context.popContextualType();
            }

            return typeReference;
        }

        public resolveAssignmentStatement(statementAST: AST, isTypedAssignment: bool, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol {
            var previousResolutionSymbol = this.getSymbolForAST(statementAST, context);

            if (previousResolutionSymbol) {
                return <PullTypeSymbol>previousResolutionSymbol;
            }

            var binex = <BinaryExpression>statementAST;

            var leftType = this.resolveStatementOrExpression(binex.operand1, isTypedAssignment, enclosingDecl, context).getType();

            context.pushContextualType(leftType, context.inProvisionalResolution(), null);
            this.resolveStatementOrExpression(binex.operand2, true, enclosingDecl, context);
            context.popContextualType();

            this.setSymbolForAST(statementAST, leftType, context);

            return leftType;
        }

        public resolveBoundDecls(decl: PullDecl, context: PullTypeResolutionContext): void {

            if (!decl) {
                return;
            }
            
            switch (decl.getKind()) {
                case PullElementKind.Script:
                    var childDecls = decl.getChildDecls();
                    for (var i = 0; i < childDecls.length; i++) {
                        this.resolveBoundDecls(childDecls[i], context);
                    }
                    break;
                case PullElementKind.DynamicModule:
                case PullElementKind.Container:
                    var moduleDecl = <ModuleDeclaration>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);
                    this.resolveModuleDeclaration(moduleDecl, context);
                    break;
                case PullElementKind.Interface:
                // case PullElementKind.ObjectType:
                    var interfaceDecl = <TypeDeclaration>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);
                    this.resolveInterfaceDeclaration(interfaceDecl, context);
                    break;
                case PullElementKind.Class:
                    var classDecl = <ClassDeclaration>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);
                    this.resolveClassDeclaration(classDecl, context);
                    break;
                case PullElementKind.Method:
                case PullElementKind.Function:
                    var funcDecl = <FuncDecl>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);
                    this.resolveFunctionDeclaration(funcDecl, context);
                    break;
                case PullElementKind.GetAccessor:
                    funcDecl = <FuncDecl>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);
                    this.resolveGetAccessorDeclaration(funcDecl, context);
                    break;
                case PullElementKind.SetAccessor:
                    funcDecl = <FuncDecl>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);
                    this.resolveSetAccessorDeclaration(funcDecl, context);
                    break;
                case PullElementKind.Property:
                case PullElementKind.Variable:
                case PullElementKind.Parameter:
                    var varDecl = <BoundDecl>this.semanticInfoChain.getASTForDecl(decl, this.unitPath);

                    // varDecl may be null if we're dealing with an implicit variable created for a class,
                    // module or enum
                    if (varDecl) {
                        this.resolveVariableDeclaration(varDecl, context);
                    }
                    break;
            }
        }

        // type relationships

        public mergeOrdered(a: PullTypeSymbol, b: PullTypeSymbol, acceptVoid: bool, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo): PullTypeSymbol {
            if (this.isAnyOrEquivalent(a) || this.isAnyOrEquivalent(b)) {
                return this.semanticInfoChain.anyTypeSymbol;
            }
            else if (a == b) {
                return a;
            }
            else if ((b == this.semanticInfoChain.nullTypeSymbol) && a != this.semanticInfoChain.nullTypeSymbol) {
                return a;
            }
            else if ((a == this.semanticInfoChain.nullTypeSymbol) && (b != this.semanticInfoChain.nullTypeSymbol)) {
                return b;
            }
            else if (acceptVoid && (b == this.semanticInfoChain.voidTypeSymbol) && a != this.semanticInfoChain.voidTypeSymbol) {
                return a;
            }
            else if (acceptVoid && (a == this.semanticInfoChain.voidTypeSymbol) && (b != this.semanticInfoChain.voidTypeSymbol)) {
                return b;
            }
            else if ((b == this.semanticInfoChain.undefinedTypeSymbol) && a != this.semanticInfoChain.voidTypeSymbol) {
                return a;
            }
            else if ((a == this.semanticInfoChain.undefinedTypeSymbol) && (b != this.semanticInfoChain.undefinedTypeSymbol)) {
                return b;
            }
            else if (a.isTypeParameter() && !b.isTypeParameter()) {
                return b;
            }
            else if (!a.isTypeParameter() && b.isTypeParameter()) {
                return a;
            }
            else if (a.isArray() && b.isArray()) {
                if (a.getElementType() == b.getElementType()) {
                    return a;
                }
                else {
                    var mergedET = this.mergeOrdered(a.getElementType(), b.getElementType(), acceptVoid, context, comparisonInfo);
                    var mergedArrayType = mergedET.getArrayType();

                    if (!mergedArrayType) {
                        mergedArrayType = specializeToArrayType(this.semanticInfoChain.elementTypeSymbol, mergedET, this, context);
                    }

                    return mergedArrayType;
                }
            }
            else if (this.sourceIsSubtypeOfTarget(a, b, context, comparisonInfo)) {
                return b;
            }
            else if (this.sourceIsSubtypeOfTarget(b, a, context, comparisonInfo)) {
                return a;
            }
            else {
                return this.semanticInfoChain.anyTypeSymbol;
            }
        }

        public widenType(type: PullTypeSymbol): PullTypeSymbol {
            if (type == this.semanticInfoChain.undefinedTypeSymbol ||
                type == this.semanticInfoChain.nullTypeSymbol ||
                type.isError()) {

                return this.semanticInfoChain.anyTypeSymbol;
            }

            return type;
        }

        public isNullOrUndefinedType(type: PullTypeSymbol) {
            return type == this.semanticInfoChain.nullTypeSymbol ||
                    type == this.semanticInfoChain.undefinedTypeSymbol;
        }

        public findBestCommonType(initialType: PullTypeSymbol, targetType: PullTypeSymbol, collection: IPullTypeCollection, acceptVoid: bool, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo) {
            var i = 0;
            var len = collection.getLength();
            var nlastChecked = 0;
            var bestCommonType = initialType;

            if (targetType) {
                bestCommonType = bestCommonType ? this.mergeOrdered(bestCommonType, targetType, acceptVoid, context) : targetType;
            }

            // it's important that we set the convergence type here, and not in the loop,
            // since the first element considered may be the contextual type
            var convergenceType: PullTypeSymbol = bestCommonType;

            while (nlastChecked < len) {

                for (i = 0; i < len; i++) {

                    // no use in comparing a type against itself
                    if (i == nlastChecked) {
                        continue;
                    }

                    if (convergenceType && (bestCommonType = this.mergeOrdered(convergenceType, collection.getTypeAtIndex(i), acceptVoid, context, comparisonInfo))) {
                        convergenceType = bestCommonType;
                    }

                    if (this.isAnyOrEquivalent(bestCommonType) || bestCommonType == null) {
                        break;
                    }
                    else if (targetType) { // set the element type to the target type
                        collection.setTypeAtIndex(i, targetType);
                    }
                }

                // use the type if we've agreed upon it
                if (convergenceType && bestCommonType) {
                    break;
                }

                nlastChecked++;
                if (nlastChecked < len) {
                    convergenceType = collection.getTypeAtIndex(nlastChecked);
                }
            }

            return acceptVoid ? bestCommonType : (bestCommonType == this.semanticInfoChain.voidTypeSymbol ? null : bestCommonType);
        }

        // Type Identity

        public typesAreIdentical(t1: PullTypeSymbol, t2: PullTypeSymbol) {

            // This clause will cover both primitive types (since the type objects are shared),
            // as well as shared brands
            if (t1 == t2) {
                return true;
            }

            if (!t1 || !t2) {
                return false;
            }

            if (t1.isPrimitive() || t2.isPrimitive()) {
                return false;
            }

            if (t1.isClass()) {
                return false;
            }

            if (t1.isError() && t2.isError()) {
                return true;
            }

            var comboId = (t2.getSymbolID() << 16) | t1.getSymbolID();

            if (this.identicalCache[comboId]) {
                return true;
            }

            // If one is an enum, and they're not the same type, they're not identical
            if ((t1.getKind() & PullElementKind.Enum) || (t2.getKind() & PullElementKind.Enum)) {
                return false;
            }

            if (t1.isArray() || t2.isArray()) {
                if (!(t1.isArray() && t2.isArray())) {
                    return false;
                }
                this.identicalCache[comboId] = false;
                var ret = this.typesAreIdentical(t1.getElementType(), t2.getElementType());
                if (ret) {
                    this.subtypeCache[comboId] = true;
                }
                else {
                    this.subtypeCache[comboId] = undefined;
                }

                return ret;
            }

            if (t1.isPrimitive() != t2.isPrimitive()) {
                return false;
            }

            this.identicalCache[comboId] = false;

            // properties are identical in name, optionality, and type
            if (t1.hasMembers() && t2.hasMembers()) {
                var t1Members = t1.getMembers();
                var t2Members = t2.getMembers();

                if (t1Members.length != t2Members.length) {
                    this.identicalCache[comboId] = undefined;
                    return false;
                }

                var t1MemberSymbol: PullSymbol = null;
                var t2MemberSymbol: PullSymbol = null;

                var t1MemberType: PullTypeSymbol = null;
                var t2MemberType: PullTypeSymbol = null;

                for (var iMember = 0; iMember < t1Members.length; iMember++) {

                    t1MemberSymbol = t1Members[iMember];
                    t2MemberSymbol = t2.findMember(t1MemberSymbol.getName());

                    if (!t2MemberSymbol || (t1MemberSymbol.getIsOptional() != t2MemberSymbol.getIsOptional())) {
                        this.identicalCache[comboId] = undefined;
                        return false;
                    }

                    t1MemberType = t1MemberSymbol.getType();
                    t2MemberType = t2MemberSymbol.getType();

                    // catch the mutually recursive or cached cases
                    if (t1MemberType && t2MemberType && (this.identicalCache[(t2MemberType.getSymbolID() << 16) | t1MemberType.getSymbolID()] != undefined)) {
                        continue;
                    }

                    if (!this.typesAreIdentical(t1MemberType, t2MemberType)) {
                        this.identicalCache[comboId] = undefined;
                        return false;
                    }
                }
            }
            else if (t1.hasMembers() || t2.hasMembers()) {
                this.identicalCache[comboId] = undefined;
                return false;
            }

            var t1CallSigs = t1.getCallSignatures();
            var t2CallSigs = t2.getCallSignatures();

            var t1ConstructSigs = t1.getConstructSignatures();
            var t2ConstructSigs = t2.getConstructSignatures();

            var t1IndexSigs = t1.getIndexSignatures();
            var t2IndexSigs = t2.getIndexSignatures();

            if (!this.signatureGroupsAreIdentical(t1CallSigs, t2CallSigs)) {
                this.identicalCache[comboId] = undefined;
                return false;
            }

            if (!this.signatureGroupsAreIdentical(t1ConstructSigs, t2ConstructSigs)) {
                this.identicalCache[comboId] = undefined;
                return false;
            }

            if (!this.signatureGroupsAreIdentical(t1IndexSigs, t2IndexSigs)) {
                this.identicalCache[comboId] = undefined;
                return false;
            }

            this.identicalCache[comboId] = true;
            return true;
        }

        public signatureGroupsAreIdentical(sg1: PullSignatureSymbol[], sg2: PullSignatureSymbol[]) {

            // covers the null case
            if (sg1 == sg2) {
                return true;
            }

            // covers the mixed-null case
            if (!sg1 || !sg2) {
                return false;
            }

            if (sg1.length != sg2.length) {
                return false;
            }

            var sig1: PullSignatureSymbol = null;
            var sig2: PullSignatureSymbol = null;
            var sigsMatch = false;

            // The signatures in the signature group may not be ordered...
            // REVIEW: Should definition signatures be required to be identical as well?
            for (var iSig1 = 0; iSig1 < sg1.length; iSig1++) {
                sig1 = sg1[iSig1];

                for (var iSig2 = 0; iSig2 < sg2.length; iSig2++) {
                    sig2 = sg2[iSig2];

                    if (this.signaturesAreIdentical(sig1, sig2)) {
                        sigsMatch = true;
                        break;
                    }
                }

                if (sigsMatch) {
                    sigsMatch = false;
                    continue;
                }

                // no match found for a specific signature
                return false;
            }

            return true;
        }

        public signaturesAreIdentical(s1: PullSignatureSymbol, s2: PullSignatureSymbol) {

            if (s1.hasVariableParamList() != s2.hasVariableParamList()) {
                return false;
            }

            if (s1.getNonOptionalParameterCount() != s2.getNonOptionalParameterCount()) {
                return false;
            }

            var s1Params = s1.getParameters();
            var s2Params = s2.getParameters();

            if (s1Params.length != s2Params.length) {
                return false;
            }

            if (!this.typesAreIdentical(s1.getReturnType(), s2.getReturnType())) {
                return false;
            }

            for (var iParam = 0; iParam < s1Params.length; iParam++) {
                if (!this.typesAreIdentical(s1Params[iParam].getType(), s2Params[iParam].getType())) {
                    return false;
                }
            }

            return true;
        }

        // Assignment Compatibility and Subtyping

        public sourceIsSubtypeOfTarget(source: PullTypeSymbol, target: PullTypeSymbol, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo) {
            return this.sourceIsRelatableToTarget(source, target, false, this.subtypeCache, context, comparisonInfo);
        }

        public typeIsSubtypeOfFunction(source: PullTypeSymbol, context): bool {
            if (this.cachedFunctionInterfaceType) {
                return this.sourceIsSubtypeOfTarget(source, this.cachedFunctionInterfaceType, context);
            }

            return false;
        }

        public signatureGroupIsSubtypeOfTarget(sg1: PullSignatureSymbol[], sg2: PullSignatureSymbol[], context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo) {
            return this.signatureGroupIsRelatableToTarget(sg1, sg2, false, this.subtypeCache, context, comparisonInfo);
        }

        public signatureIsSubtypeOfTarget(s1: PullSignatureSymbol, s2: PullSignatureSymbol, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo) {
            return this.signatureIsRelatableToTarget(s1, s2, false, this.subtypeCache, context, comparisonInfo);
        }

        public sourceIsAssignableToTarget(source: PullTypeSymbol, target: PullTypeSymbol, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo): bool {
            return this.sourceIsRelatableToTarget(source, target, true, this.assignableCache, context, comparisonInfo);
        }

        public signatureGroupIsAssignableToTarget(sg1: PullSignatureSymbol[], sg2: PullSignatureSymbol[], context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo): bool {
            return this.signatureGroupIsRelatableToTarget(sg1, sg2, true, this.assignableCache, context, comparisonInfo);
        }

        public signatureIsAssignableToTarget(s1: PullSignatureSymbol, s2: PullSignatureSymbol, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo): bool {
            return this.signatureIsRelatableToTarget(s1, s2, true, this.assignableCache, context, comparisonInfo);
        }

        public sourceIsRelatableToTarget(source: PullTypeSymbol, target: PullTypeSymbol, assignableTo: bool, comparisonCache: any, context: PullTypeResolutionContext, comparisonInfo: TypeComparisonInfo): bool {

            // REVIEW: Does this check even matter?
            //if (this.typesAreIdentical(source, target)) {
            //    return true;
            //}
            if (source == target) {
                return true;
            }

            // An error has already been reported in this case
            if (!(source && target)) {
                return true;
            }

            var comboId = (source.getSymbolID() << 16) | target.getSymbolID();

            // In the case of a 'false', we want to short-circuit a recursive typecheck
            if (comparisonCache[comboId] != undefined) {
                return true;
            }

            // this is one difference between subtyping and assignment compatibility
            if (assignableTo) {
                if (this.isAnyOrEquivalent(source) || this.isAnyOrEquivalent(target)) {
                    return true;
                }
            }
            else {
                // This is one difference between assignment compatibility and subtyping
                if (this.isAnyOrEquivalent(target)) {
                    return true;
                }
            }

            if (source == this.semanticInfoChain.undefinedTypeSymbol) {
                return true;
            }

            if ((source == this.semanticInfoChain.nullTypeSymbol) && (target != this.semanticInfoChain.undefinedTypeSymbol && target != this.semanticInfoChain.voidTypeSymbol)) {
                return true;
            }

            // REVIEW: enum types aren't explicitly covered in the spec
            if (target == this.semanticInfoChain.numberTypeSymbol && (source.getKind() & PullElementKind.Enum)) {
                return true;
            }
            if (source == this.semanticInfoChain.numberTypeSymbol && (target.getKind() & PullElementKind.Enum)) {
                return true;
            }
            if ((source.getKind() & PullElementKind.Enum) || (target.getKind() & PullElementKind.Enum)) {
                return false;
            }

            if (source.isArray() || target.isArray()) {
                if (!(source.isArray() && target.isArray())) {
                    return false;
                }
                comparisonCache[comboId] = false;
                var ret = this.sourceIsRelatableToTarget(source.getElementType(), target.getElementType(), assignableTo, comparisonCache, context, comparisonInfo);
                if (ret) {
                    comparisonCache[comboId] = true;
                }
                else {
                    comparisonCache[comboId] = undefined;
                }

                return ret;
            }

            if (target.isTypeParameter()) {
                return true;
            }            

            // this check ensures that we only operate on object types from this point forward,
            // since the checks involving primitives occurred above
            if (source.isPrimitive() && target.isPrimitive()) {

                // we already know that they're not the same, and that neither is 'any'
                return false;
            }
            else if (source.isPrimitive() != target.isPrimitive()) {

                if (!target.isPrimitive()) {
                    if (source == this.semanticInfoChain.numberTypeSymbol && this.cachedNumberInterfaceType) {

                        if (!this.cachedNumberInterfaceType.isResolved()) {
                            this.resolveDeclaredSymbol(this.cachedNumberInterfaceType, null, context);
                        }

                        source = this.cachedNumberInterfaceType;
                    }
                    else if (source == this.semanticInfoChain.stringTypeSymbol && this.cachedStringInterfaceType) {

                        if (!this.cachedStringInterfaceType.isResolved()) {
                            this.resolveDeclaredSymbol(this.cachedStringInterfaceType, null, context);
                        }

                        source = this.cachedStringInterfaceType;
                    }
                    else if (source == this.semanticInfoChain.boolTypeSymbol && this.cachedBooleanInterfaceType) {

                        if (!this.cachedBooleanInterfaceType.isResolved()) {
                            this.resolveDeclaredSymbol(this.cachedBooleanInterfaceType, null, context);
                        }

                        source = this.cachedBooleanInterfaceType;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            comparisonCache[comboId] = false;

            if (source.hasBase(target)) {
                comparisonCache[comboId] = true;
                return true;
            }

            if (this.cachedObjectInterfaceType && target == this.cachedObjectInterfaceType) {
                return true;
            }

            if (this.cachedFunctionInterfaceType && (source.getCallSignatures().length || source.getConstructSignatures().length) && target == this.cachedFunctionInterfaceType) {
                return true;
            }

            if (target.hasMembers()) {
                var mProps = target.getMembers();
                var mProp: PullSymbol = null;
                var nProp: PullSymbol = null;
                var mPropType: PullTypeSymbol = null;
                var nPropType: PullTypeSymbol = null;

                for (var iMProp = 0; iMProp < mProps.length; iMProp++) {

                    mProp = mProps[iMProp];
                    nProp = source.findMember(mProp.getName());

                    // PULLTODO:
                    // methods do not have the "arguments" field
                    //if (mProp.getName() == "arguments" &&
                    //    this.cachedIArgumentsInterfaceType &&
                    //    (this.typeFlow.iargumentsInterfaceType.symbol.flags & SymbolFlags.CompilerGenerated) &&
                    //    mProp.kind() == SymbolKind.Variable &&
                    //    (<VariableSymbol>mProp).variable.typeLink.type == this.typeFlow.iargumentsInterfaceType) {
                    //    continue;
                    //}

                    if (!mProp.isResolved()) {
                        this.resolveDeclaredSymbol(mProp, null, context);
                    }

                    mPropType = mProp.getType();

                    if (!nProp) {
                        // If it's not present on the type in question, look for the property on 'Object'
                        if (this.cachedObjectInterfaceType) {
                            nProp = this.cachedObjectInterfaceType.findMember(mProp.getName());
                        }

                        if (!nProp) {
                            // Now, the property was not found on Object, but the type in question is a function, look
                            // for it on function
                            if (this.cachedFunctionInterfaceType && (mPropType.getCallSignatures().length || mPropType.getConstructSignatures().length)) {
                                nProp = this.cachedFunctionInterfaceType.findMember(mProp.getName());
                            }

                            // finally, check to see if the property is optional
                            if (!nProp) {
                                if (!(mProp.getIsOptional())) {
                                    comparisonCache[comboId] = undefined;
                                    if (comparisonInfo) { // only surface the first error
                                        comparisonInfo.flags |= TypeRelationshipFlags.RequiredPropertyIsMissing;
                                        comparisonInfo.addMessageToFront("Type '" + source.toString() + "' is missing property '" + mProp.getScopedNameEx().toString() + "' from type '" + target.toString() + "'");
                                    }
                                    return false;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    }

                    // if both are private members, test to ensure that they share a declaration
                    if (nProp.hasFlag(PullElementFlags.Private) && mProp.hasFlag(PullElementFlags.Private)) {
                        var mDecl = mProp.getDeclarations()[0];
                        var nDecl = nProp.getDeclarations()[0];

                        if (!mDecl.isEqual(nDecl)) {
                            return false;
                        }
                    }

                    if (!nProp.isResolved()) {
                        this.resolveDeclaredSymbol(nProp, null, context);
                    }


                    nPropType = nProp.getType();

                    // catch the mutually recursive or cached cases
                    if (mPropType && nPropType && (comparisonCache[(nPropType.getSymbolID() << 16) | mPropType.getSymbolID()] != undefined)) {
                        continue;
                    }

                    if (!this.sourceIsRelatableToTarget(nPropType, mPropType, assignableTo, comparisonCache, context, comparisonInfo)) {
                        comparisonCache[comboId] = undefined;
                        if (comparisonInfo) { // only surface the first error
                            comparisonInfo.flags |= TypeRelationshipFlags.IncompatiblePropertyTypes;
                            comparisonInfo.addMessageToFront("Types of property '" + mProp.getScopedNameEx().toString() + "' of types '" + source.toString() + "' and '" + target.toString() + "' are incompatible");
                        }
                        return false;
                    }
                }
            }

            var sourceCallSigs = source.getCallSignatures();
            var targetCallSigs = target.getCallSignatures();

            var sourceConstructSigs = source.getConstructSignatures();
            var targetConstructSigs = target.getConstructSignatures();

            var sourceIndexSigs = source.getIndexSignatures();
            var targetIndexSigs = target.getIndexSignatures();
            
            var hasSig: string;
            var lacksSig: string;

            // check signature groups
            if (targetCallSigs.length) {
                if (!this.signatureGroupIsRelatableToTarget(sourceCallSigs, targetCallSigs, assignableTo, comparisonCache, context, comparisonInfo)) {
                    if (comparisonInfo) {
                        if (sourceCallSigs.length && targetCallSigs.length) {
                            comparisonInfo.addMessageToFront("Call signatures of types '" + source.toString() + "' and '" + target.toString() + "' are incompatible");
                        }
                        else {
                            hasSig = targetCallSigs.length ? target.toString() : source.toString();
                            lacksSig = !targetCallSigs.length ? target.toString() : source.toString();
                            comparisonInfo.setMessage("Type '" + hasSig + "' requires a call signature, but Type '" + lacksSig + "' lacks one");
                        }
                        comparisonInfo.flags |= TypeRelationshipFlags.IncompatibleSignatures;
                    }
                    comparisonCache[comboId] = undefined;
                    return false;
                }
            }

            if (targetConstructSigs.length) {
                if (!this.signatureGroupIsRelatableToTarget(sourceConstructSigs, targetConstructSigs, assignableTo, comparisonCache, context, comparisonInfo)) {
                    if (comparisonInfo) {
                        if (sourceConstructSigs.length && targetConstructSigs.length) {
                            comparisonInfo.addMessageToFront("Construct signatures of types '" + source.toString() + "' and '" + target.toString() + "' are incompatible");
                        }
                        else {
                            hasSig = targetConstructSigs.length ? target.toString() : source.toString();
                            lacksSig = !targetConstructSigs.length ? target.toString() : source.toString();
                            comparisonInfo.setMessage("Type '" + hasSig + "' requires a construct signature, but Type '" + lacksSig + "' lacks one");
                        }
                        comparisonInfo.flags |= TypeRelationshipFlags.IncompatibleSignatures;
                    }
                    comparisonCache[comboId] = undefined;
                    return false;
                }
            }

            if (targetIndexSigs.length) {
                var targetIndex = !targetIndexSigs.length && this.cachedObjectInterfaceType ? this.cachedObjectInterfaceType.getIndexSignatures() : targetIndexSigs;
                var sourceIndex = !sourceIndexSigs.length && this.cachedObjectInterfaceType ? this.cachedObjectInterfaceType.getIndexSignatures() : sourceIndexSigs;

                if (!this.signatureGroupIsRelatableToTarget(sourceIndex, targetIndex, assignableTo, comparisonCache, context, comparisonInfo)) {
                    if (comparisonInfo) {
                        comparisonInfo.addMessageToFront("Index signatures of types '" + source.toString() + "' and '" + target.toString() + "' are incompatible");
                        comparisonInfo.flags |= TypeRelationshipFlags.IncompatibleSignatures;
                    }
                    comparisonCache[comboId] = undefined;
                    return false;
                }
            }

            comparisonCache[comboId] = true;
            return true;
        }

        // REVIEW: TypeChanges: Return an error context object so the user can get better diagnostic info
        public signatureGroupIsRelatableToTarget(sourceSG: PullSignatureSymbol[], targetSG: PullSignatureSymbol[], assignableTo: bool, comparisonCache: any, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo) {
            if (sourceSG == targetSG) {
                return true;
            }

            if (!(sourceSG.length && targetSG.length)) {
                return false;
            }

            var mSig: PullSignatureSymbol = null;
            var nSig: PullSignatureSymbol = null;
            var foundMatch = false;

            for (var iMSig = 0; iMSig < targetSG.length; iMSig++) {
                mSig = targetSG[iMSig];

                for (var iNSig = 0; iNSig < sourceSG.length; iNSig++) {
                    nSig = sourceSG[iNSig];
                    if (this.signatureIsRelatableToTarget(nSig, mSig, assignableTo, comparisonCache, context, comparisonInfo)) {
                        foundMatch = true;
                        break;
                    }
                }

                if (foundMatch) {
                    foundMatch = false;
                    continue;
                }
                return false;
            }

            return true;
        }

        public signatureIsRelatableToTarget(sourceSig: PullSignatureSymbol, targetSig: PullSignatureSymbol, assignableTo: bool, comparisonCache: any, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo) {

            var sourceParameters = sourceSig.getParameters();
            var targetParameters = targetSig.getParameters();

            if (!sourceParameters || !targetParameters) {
                return false;
            }

            var targetVarArgCount = /*targetSig.hasVariableParamList() ? targetSig.getNonOptionalParameterCount() - 1 :*/ targetSig.getNonOptionalParameterCount();
            var sourceVarArgCount = /*sourceSig.hasVariableParamList() ? sourceSig.getNonOptionalParameterCount() - 1 :*/ sourceSig.getNonOptionalParameterCount();

            if (sourceVarArgCount > targetVarArgCount && !targetSig.hasVariableParamList()) {
                if (comparisonInfo) {
                    comparisonInfo.flags |= TypeRelationshipFlags.SourceSignatureHasTooManyParameters;
                    comparisonInfo.addMessageToFront("Call signature expects " + targetVarArgCount + " or fewer parameters");
                }
                return false;
            }

            var sourceReturnType = sourceSig.getReturnType();
            var targetReturnType = targetSig.getReturnType();

            if (targetReturnType != this.semanticInfoChain.voidTypeSymbol) {
                if (!this.sourceIsRelatableToTarget(sourceReturnType, targetReturnType, assignableTo, comparisonCache, context, comparisonInfo)) {
                    if (comparisonInfo) {
                        comparisonInfo.flags |= TypeRelationshipFlags.IncompatibleReturnTypes;
                        // No need to print this one here - it's printed as part of the signature error in sourceIsRelatableToTarget
                        //comparisonInfo.addMessageToFront("Incompatible return types: '" + sourceReturnType.getTypeName() + "' and '" + targetReturnType.getTypeName() + "'");
                    }
                    return false;
                }
            }

            var len = (sourceVarArgCount < targetVarArgCount && sourceSig.hasVariableParamList()) ? targetVarArgCount : sourceVarArgCount;
            var sourceParamType: PullTypeSymbol = null;
            var targetParamType: PullTypeSymbol = null;
            var sourceParamName = "";
            var targetParamName = "";

            for (var iSource = 0, iTarget = 0; iSource < len; iSource++, iTarget++) {

                if (!sourceSig.hasVariableParamList || iSource < sourceVarArgCount) {
                    sourceParamType = sourceParameters[iSource].getType();
                    sourceParamName = sourceParameters[iSource].getName();
                }
                else if (iSource == sourceVarArgCount) {
                    sourceParamType = sourceParameters[iSource].getType();
                    if (sourceParamType.isArray()) {
                        sourceParamType = sourceParamType.getElementType();
                    }
                    sourceParamName = sourceParameters[iSource].getName();
                }

                if (iTarget < targetParameters.length && iTarget < targetVarArgCount) {
                    targetParamType = targetParameters[iTarget].getType();
                    targetParamName = targetParameters[iTarget].getName();
                }
                else if (targetSig.hasVariableParamList && iTarget == targetVarArgCount) {
                    targetParamType = targetParameters[iTarget].getType();
                    if (targetParamType.isArray()) {
                        targetParamType = targetParamType.getElementType();
                    }
                    targetParamName = targetParameters[iTarget].getName();
                }

                if (!(this.sourceIsRelatableToTarget(sourceParamType, targetParamType, assignableTo, comparisonCache, context, comparisonInfo) ||
                        this.sourceIsRelatableToTarget(targetParamType, sourceParamType, assignableTo, comparisonCache, context, comparisonInfo))) {

                    if (comparisonInfo) {
                        comparisonInfo.flags |= TypeRelationshipFlags.IncompatibleParameterTypes;
                    }
                    return false;
                }
            }
            return true;
        }

        // Overload resolution

        public resolveOverloads(application: AST, group: PullSignatureSymbol[], enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSignatureSymbol {
            var rd = this.resolutionDataCache.getResolutionData();
            var actuals = rd.actuals;
            var exactCandidates = rd.exactCandidates;
            var conversionCandidates = rd.conversionCandidates;
            var candidate: PullSignatureSymbol = null;
            var hasOverloads = group.length > 1;
            var comparisonInfo = new TypeComparisonInfo();
            var args: ASTList = null;
            var target: AST = null;
            var argSym: PullSymbol;
            var i = 0;

            if (application.nodeType == NodeType.Call || application.nodeType == NodeType.New) {
                var callEx = <CallExpression>application;

                args = callEx.arguments;
                target = callEx.target;

                if (callEx.arguments) {
                    var len = callEx.arguments.members.length;
                    
                    for (i = 0; i < len; i++) {
                        argSym = this.resolveStatementOrExpression(callEx.arguments.members[i], false, enclosingDecl, context);
                        actuals[i] = argSym.getType();
                    }
                }
            }
            else if (application.nodeType == NodeType.Index) {
                var binExp = <BinaryExpression>application;
                target = binExp.operand1;
                args = new ASTList();
                args.members[0] = binExp.operand2;
                argSym = this.resolveStatementOrExpression(args.members[0], false, enclosingDecl, context);
                actuals[0] = argSym.getType();
            }

            var signature: PullSignatureSymbol;
            var returnType: PullTypeSymbol;
            var candidateInfo: { sig: PullSignatureSymbol; ambiguous: bool; };

            for (var j = 0, groupLen = group.length; j < groupLen; j++) {
                signature = group[j];
                if (hasOverloads && signature.isDefinition()) {
                    continue;
                }

                returnType = signature.getReturnType();

                this.getCandidateSignatures(signature, actuals, exactCandidates, conversionCandidates, enclosingDecl, context, comparisonInfo);
            }
            if (exactCandidates.length == 0) {

                var applicableCandidates = this.getApplicableSignaturesFromCandidates(conversionCandidates, args, comparisonInfo, enclosingDecl, context);
                if (applicableCandidates.length > 0) {
                    candidateInfo = this.findMostApplicableSignature(applicableCandidates, args, enclosingDecl, context);
                    if (candidateInfo.ambiguous) {
                        //this.errorReporter.simpleError(target, "Ambiguous call expression - could not choose overload");
                        context.postError(application.minChar, application.getLength(), this.unitPath, "Ambiguous call expression - could not choose overload", enclosingDecl, true);
                    }
                    candidate = candidateInfo.sig;
                }
                else {
                    var emsg = "Supplied parameters do not match any signature of call target";
                    if (comparisonInfo.message) {
                        //this.checker.errorReporter.simpleError(target, emsg + ":\n\t" + comparisonInfo.message);
                        context.postError(application.minChar, application.getLength(), this.unitPath, emsg + ":\n\t" + comparisonInfo.message, enclosingDecl, true);
                    }
                    else {
                        context.postError(application.minChar, application.getLength(), this.unitPath, emsg, enclosingDecl, true);
                        //this.checker.errorReporter.simpleError(target, emsg);
                    }
                }
            }
            else {
                if (exactCandidates.length > 1) {
                    var applicableSigs: PullApplicableSignature[] = [];
                    for (i = 0; i < exactCandidates.length; i++) {
                        applicableSigs[i] = { signature: exactCandidates[i], hadProvisionalErrors: false };
                    }
                    candidateInfo = this.findMostApplicableSignature(applicableSigs, args, enclosingDecl, context);
                    if (candidateInfo.ambiguous) {
                        //this.checker.errorReporter.simpleError(target, "Ambiguous call expression - could not choose overload");
                        context.postError(application.minChar, application.getLength(), this.unitPath, "Ambiguous call expression - could not choose overload", enclosingDecl, true);
                    }
                    candidate = candidateInfo.sig;
                }
                else {
                    candidate = exactCandidates[0];
                }
            }

            this.resolutionDataCache.returnResolutionData(rd);
            return candidate;
        }

        public getCandidateSignatures(signature: PullSignatureSymbol, actuals: PullTypeSymbol[], exactCandidates: PullSignatureSymbol[], conversionCandidates: PullSignatureSymbol[], enclosingDecl: PullDecl, context: PullTypeResolutionContext, comparisonInfo: TypeComparisonInfo): void {
            var parameters = signature.getParameters();
            var lowerBound = signature.getNonOptionalParameterCount(); // required parameters
            var upperBound = parameters.length; // required and optional parameters
            var formalLen = lowerBound;
            var acceptable = false;

            if ((actuals.length >= lowerBound) && (signature.hasVariableParamList() || actuals.length <= upperBound)) {
                formalLen = (signature.hasVariableParamList() ? parameters.length : actuals.length);
                acceptable = true;
            }

            var repeatType: PullTypeSymbol = null;

            if (acceptable || signature.hasVariableParamList()) {
                // assumed structure here is checked when signature is formed
                if (signature.hasVariableParamList()) {
                    formalLen -= 1;
                    repeatType = parameters[formalLen].getType();
                    repeatType = repeatType.getElementType();
                    acceptable = actuals.length >= formalLen;
                }
                var len = actuals.length;

                var exact = acceptable;
                var convert = acceptable;

                var typeA: PullTypeSymbol;
                var typeB: PullTypeSymbol;

                for (var i = 0; i < len; i++) {

                    if (i < formalLen) {
                        typeA = parameters[i].getType();
                    }
                    else {
                        typeA = repeatType;
                    }

                    typeB = actuals[i];

                    if (typeA && !typeA.isResolved()) {
                        this.resolveDeclaredSymbol(typeA, enclosingDecl, context);
                    }

                    if (typeB && !typeB.isResolved()) {
                        this.resolveDeclaredSymbol(typeB, enclosingDecl, context);
                    }

                    if (!typeA || !typeB || !(this.typesAreIdentical(typeA, typeB))) {
                        exact = false;
                    }
                    // is the argument assignable to the parameter?
                    if (!this.sourceIsAssignableToTarget(typeB, typeA, context, comparisonInfo)) {
                        convert = false;
                    }
                    if (!(exact || convert)) {
                        break;
                    }
                }
                if (exact) {
                    exactCandidates[exactCandidates.length] = signature;
                }
                else if (convert && (exactCandidates.length == 0)) {
                    conversionCandidates[conversionCandidates.length] = signature;
                }
            }
        }

        public getApplicableSignaturesFromCandidates(candidateSignatures: PullSignatureSymbol[],
                                                     args: ASTList,
                                                     comparisonInfo: TypeComparisonInfo,
                                                     enclosingDecl: PullDecl,
                                                     context: PullTypeResolutionContext): PullApplicableSignature[] {

            var applicableSigs: PullApplicableSignature[] = [];
            var memberType: PullTypeSymbol = null;
            var miss = false;
            var cxt: PullContextualTypeContext = null;
            var hadProvisionalErrors = false;

            var parameters: PullSymbol[];
            var signature: PullSignatureSymbol;
            var argSym: PullSymbol;

            for (var i = 0; i < candidateSignatures.length; i++) {
                miss = false;

                signature = candidateSignatures[i];
                parameters = signature.getParameters();

                for (var j = 0; j < args.members.length; j++) {

                    if (j >= parameters.length) {
                        continue;
                    }

                    if (!parameters[j].isResolved()) {
                        this.resolveDeclaredSymbol(parameters[j], enclosingDecl, context);
                    }

                    memberType = parameters[j].getType();

                    // account for varargs
                    if (signature.hasVariableParamList() && (j >= signature.getNonOptionalParameterCount() - 1) && memberType.isArray()) {
                        memberType = memberType.getElementType();
                    }

                    if (this.isAnyOrEquivalent(memberType)) {
                        continue;
                    }
                    else if (args.members[j].nodeType == NodeType.FuncDecl) {

                        if (this.cachedFunctionInterfaceType && memberType == this.cachedFunctionInterfaceType) {
                            continue;
                        }

                        argSym = this.resolveFunctionExpression(<FuncDecl>args.members[j], false, enclosingDecl, context);

                        if (!this.canApplyContextualTypeToFunction(memberType, <FuncDecl>args.members[j], true)) {
                            // if it's just annotations that are blocking us, typecheck the function and add it to the list
                            if (this.canApplyContextualTypeToFunction(memberType, <FuncDecl>args.members[j], false)) {
                                if (!this.sourceIsAssignableToTarget(argSym.getType(), memberType, context, comparisonInfo)) {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                        else { // if it can be contextually typed, try it out...
                            //argSym.invalidate();
                            context.pushContextualType(memberType, true, null);

                            argSym = this.resolveFunctionExpression(<FuncDecl>args.members[j], true, enclosingDecl, context);

                            if (!this.sourceIsAssignableToTarget(argSym.getType(), memberType, context, comparisonInfo)) {
                                if (comparisonInfo) {
                                    comparisonInfo.setMessage("Could not apply type '" + memberType.toString() + "' to argument " + (j + 1) + ", which is of type '" + argSym.getTypeName() + "'");
                                }
                                miss = true;
                            }
                            argSym.invalidate();
                            cxt = context.popContextualType();
                            hadProvisionalErrors = cxt.hadProvisionalErrors();

                            //argSym.invalidate();

                            //this.resetProvisionalErrors();
                            if (miss) {
                                break;
                            }
                        }
                    }
                    else if (args.members[j].nodeType == NodeType.ObjectLiteralExpression) {
                        // now actually attempt to typecheck as the contextual type
                        if (this.cachedObjectInterfaceType && memberType == this.cachedObjectInterfaceType) {
                            continue;
                        }
                        context.pushContextualType(memberType, true, null);
                        argSym = this.resolveObjectLiteralExpression(args.members[j], true, enclosingDecl, context);


                        if (!this.sourceIsAssignableToTarget(argSym.getType(), memberType, context, comparisonInfo)) {
                            if (comparisonInfo) {
                                comparisonInfo.setMessage("Could not apply type '" + memberType.toString() + "' to argument " + (j + 1) + ", which is of type '" + argSym.getTypeName() + "'");
                            }
                            miss = true;
                        }
                        argSym.invalidate();
                        cxt = context.popContextualType();
                        hadProvisionalErrors = cxt.hadProvisionalErrors();

                        //argSym.invalidate();

                        //this.resetProvisionalErrors();
                        if (miss) {
                            break;
                        }
                    }
                    else if (args.members[j].nodeType == NodeType.ArrayLiteralExpression) {
                        // attempt to contextually type the array literal
                        if (this.cachedArrayInterfaceType && memberType == this.cachedArrayInterfaceType) {
                            continue;
                        }

                        context.pushContextualType(memberType, true, null);
                        argSym = this.resolveArrayLiteralExpression(args.members[j], true, enclosingDecl, context);

                        if (!this.sourceIsAssignableToTarget(argSym.getType(), memberType, context, comparisonInfo)) {
                            if (comparisonInfo) {
                                comparisonInfo.setMessage("Could not apply type '" + memberType.toString() + "' to argument " + (j + 1) + ", which is of type '" + argSym.getTypeName() + "'");
                            }
                            break;
                        }
                        argSym.invalidate();
                        cxt = context.popContextualType();

                        hadProvisionalErrors = cxt.hadProvisionalErrors();

                        //argSym.invalidate();

                        if (miss) {
                            break;
                        }
                    }
                }

                if (j == args.members.length) {
                    applicableSigs[applicableSigs.length] = { signature: candidateSignatures[i], hadProvisionalErrors: hadProvisionalErrors };
                }
                hadProvisionalErrors = false;
            }

            return applicableSigs;
        }

        public findMostApplicableSignature(signatures: PullApplicableSignature[], args: ASTList, enclosingDecl: PullDecl, context: PullTypeResolutionContext): { sig: PullSignatureSymbol; ambiguous: bool; } {

            if (signatures.length == 1) {
                return { sig: signatures[0].signature, ambiguous: false };
            }

            var best: PullApplicableSignature = signatures[0];
            var Q: PullApplicableSignature = null;

            var AType: PullTypeSymbol = null;
            var PType: PullTypeSymbol = null;
            var QType: PullTypeSymbol = null;

            var ambiguous = false;

            var argSym: PullSymbol;

            var bestParams: PullSymbol[];
            var qParams: PullSymbol[];

            for (var qSig = 1; qSig < signatures.length; qSig++) {
                Q = signatures[qSig];
                var i = 0;

                // find the better conversion
                for (i = 0; args && i < args.members.length; i++) {

                    argSym = this.resolveStatementOrExpression(args.members[i], false, enclosingDecl, context);

                    AType = argSym.getType();

                    // invalidate the argument so that we may correctly resolve it later as part of the call expression
                    argSym.invalidate();

                    bestParams = best.signature.getParameters();
                    qParams = Q.signature.getParameters();

                    PType = i < bestParams.length ? bestParams[i].getType() : bestParams[bestParams.length - 1].getType().getElementType();
                    QType = i < qParams.length ? qParams[i].getType() : qParams[qParams.length - 1].getType().getElementType();

                    if (this.typesAreIdentical(PType, QType)) {
                        continue;
                    }
                    else if (this.typesAreIdentical(AType, PType)) {
                        break;
                    }
                    else if (this.typesAreIdentical(AType, QType)) {
                        best = Q;
                        break;
                    }
                    else if (this.sourceIsSubtypeOfTarget(PType, QType, context)) {
                        break;
                    }
                    else if (this.sourceIsSubtypeOfTarget(QType, PType, context)) {
                        best = Q;
                        break;
                    }
                    else if (Q.hadProvisionalErrors) {
                        break;
                    }
                    else if (best.hadProvisionalErrors) {
                        best = Q;
                        break;
                    }
                }

                if (!args || i == args.members.length) {
                    var collection: IPullTypeCollection = {
                        getLength: () => { return 2; },
                        setTypeAtIndex: (index: number, type: PullTypeSymbol) => { }, // no contextual typing here, so no need to do anything
                        getTypeAtIndex: (index: number) => { return index ? Q.signature.getReturnType() : best.signature.getReturnType(); } // we only want the "second" type - the "first" is skipped
                    }
                    var bct = this.findBestCommonType(best.signature.getReturnType(), null, collection, false, context);
                    ambiguous = !bct;
                }
                else {
                    ambiguous = false;
                }
            }

            return { sig: best.signature, ambiguous: ambiguous };
        }

        public canApplyContextualTypeToFunction(candidateType: PullTypeSymbol, funcDecl: FuncDecl, beStringent: bool): bool {

            // in these cases, we do not attempt to apply a contextual type
            //  RE: isInlineCallLiteral - if the call target is a function literal, we don't want to apply the target type
            //  to its body - instead, it should be applied to its return type
            if (funcDecl.isMethod() ||
                beStringent && funcDecl.returnTypeAnnotation) {
                return false;
            }

            beStringent = beStringent || (this.cachedFunctionInterfaceType == candidateType);

            // At this point, if we're not being stringent, there's no need to check for multiple call sigs
            // or count parameters - we just want to unblock typecheck
            if (!beStringent) {
                return true;
            }

            var signature = this.getSymbolForAST(funcDecl, null).getType().getCallSignatures()[0];
            var parameters = signature.getParameters();
            var paramLen = parameters.length;

            // Check that the argument declarations have no type annotations
            for (var i = 0; i < paramLen; i++) {
                var param = parameters[i];
                var argDecl = <ArgDecl>this.getASTForSymbol(param);

                // REVIEW: a valid typeExpr is a requirement for varargs,
                // so we may want to revise our invariant
                if (beStringent && argDecl.typeExpr) {
                    return false;
                }
            }

            if (candidateType.getConstructSignatures().length && candidateType.getCallSignatures().length) {
                return false;
            }

            var candidateSigs = candidateType.getConstructSignatures().length ? candidateType.getConstructSignatures() : candidateType.getCallSignatures();

            if (!candidateSigs || candidateSigs.length > 1) {
                return false;
            }

            // if we're here, the contextual type can be applied to the function
            return true;
        }

        public inferArgumentTypesForSignature(signature: PullSignatureSymbol,
                                              args: ASTList,
                                              comparisonInfo: TypeComparisonInfo,
                                              enclosingDecl: PullDecl,
                                              context: PullTypeResolutionContext): PullTypeSymbol[] {

            var cxt: PullContextualTypeContext = null;
            var hadProvisionalErrors = false;

            var argSym: PullSymbol;

            var parameters = signature.getParameters();
            var typeParameters = signature.getTypeParameters();
            var argContext = new ArgumentInferenceContext();

            var parameterType: PullTypeSymbol = null;

            var i = 0;

            // seed each type parameter with the undefined type, so that we can widen it to 'any'
            // if no inferences can be made
            for (i = 0; i < typeParameters.length; i++) {
                argContext.addCandidateForInference(typeParameters[i], null, false);
            }

            var substitutions: any;
            var inferenceCandidates: PullTypeSymbol[];
            var inferenceCandidate: PullTypeSymbol;

            for (i = 0; i < args.members.length; i++) {

                if (i >= parameters.length) {
                    break;
                }

                parameterType = parameters[i].getType();

                // account for varargs
                if (signature.hasVariableParamList() && (i >= signature.getNonOptionalParameterCount() - 1) && parameterType.isArray()) {
                    parameterType = parameterType.getElementType();
                }

                inferenceCandidates = argContext.getInferenceCandidates();
                substitutions = {};

                if (inferenceCandidates.length) {
                    for (var j = 0; j < inferenceCandidates.length; j++) {

                        inferenceCandidate = inferenceCandidates[j];

                        substitutions = inferenceCandidates[j];

                        context.pushContextualType(parameterType, true, substitutions);
                        argSym = this.resolveStatementOrExpression(args.members[i], true, enclosingDecl, context);

                        this.relateTypeToTypeParameters(argSym.getType(), parameterType, false, argContext, enclosingDecl, context);

                        cxt = context.popContextualType();

                        argSym.invalidate();

                        hadProvisionalErrors = cxt.hadProvisionalErrors();
                    }
                }
                else {
                    context.pushContextualType(parameterType, true, {});
                    argSym = this.resolveStatementOrExpression(args.members[i], true, enclosingDecl, context);

                    this.relateTypeToTypeParameters(argSym.getType(), parameterType, false, argContext, enclosingDecl, context);

                    cxt = context.popContextualType();

                    argSym.invalidate();

                    hadProvisionalErrors = cxt.hadProvisionalErrors();
                }
            }

            hadProvisionalErrors = false;

            var inferenceResults = argContext.inferArgumentTypes(this, context);


            if (inferenceResults.unfit) {
                return null;
            }

            var resultTypes: PullTypeSymbol[] = [];

            for (i = 0; i < inferenceResults.results.length; i++) {
                resultTypes[resultTypes.length] = inferenceResults.results[i].type;
            }

            return resultTypes;
        }

        public relateTypeToTypeParameters(expressionType: PullTypeSymbol,
                                          parameterType: PullTypeSymbol,
                                          shouldFix: bool,
                                          argContext: ArgumentInferenceContext,
                                          enclosingDecl: PullDecl,
                                          context: PullTypeResolutionContext): void {

            if (parameterType == expressionType) {
                return;
            }

            if (parameterType.isTypeParameter()) {
                argContext.addCandidateForInference(<PullTypeParameterSymbol>parameterType, expressionType, shouldFix);
                return;
            }

            // if the expression and parameter type, with type arguments of 'any', are not assignment compatible, ignore
            var anyExpressionType = this.specializeTypeToAny(expressionType, enclosingDecl, context);
            var anyParameterType = this.specializeTypeToAny(parameterType, enclosingDecl, context);

            if (!this.sourceIsAssignableToTarget(anyExpressionType, anyParameterType, context)) {
                return;
            }

            if (expressionType.isArray() && parameterType.isArray()) {
                this.relateArrayTypeToTypeParameters(expressionType, parameterType, shouldFix, argContext, enclosingDecl, context);

                return;
            }

            this.relateObjectTypeToTypeParameters(expressionType, parameterType, shouldFix, argContext, enclosingDecl, context);
        }

        public relateFunctionSignatureToTypeParameters(expressionSignature: PullSignatureSymbol,
                                                       parameterSignature: PullSignatureSymbol,
                                                       argContext: ArgumentInferenceContext,
                                                       enclosingDecl: PullDecl,
                                                       context: PullTypeResolutionContext): void {
            // Sub in 'any' for type parameters

            var anyExpressionSignature = this.specializeSignatureToAny(expressionSignature, enclosingDecl, context);
            var anyParamExpressionSignature = this.specializeSignatureToAny(parameterSignature, enclosingDecl, context);

            if (!this.signatureIsAssignableToTarget(anyExpressionSignature, anyParamExpressionSignature, context)) {
                return;
            }

            var expressionParams = expressionSignature.getParameters();
            var expressionReturnType = expressionSignature.getReturnType();

            var parameterParams = parameterSignature.getParameters();
            var parameterReturnType = parameterSignature.getReturnType();

            var len = parameterParams.length < expressionParams.length ? parameterParams.length : expressionParams.length;

            for (var i = 0; i < len; i++) {
                this.relateTypeToTypeParameters(expressionParams[i].getType(), parameterParams[i].getType(), true, argContext, enclosingDecl, context);
            }

            this.relateTypeToTypeParameters(expressionReturnType, parameterReturnType, true, argContext, enclosingDecl, context);
        }

        public relateObjectTypeToTypeParameters(objectType: PullTypeSymbol,
                                                parameterType: PullTypeSymbol,
                                                shouldFix: bool,
                                                argContext: ArgumentInferenceContext,
                                                enclosingDecl: PullDecl,
                                                context: PullTypeResolutionContext): void {

            var parameterTypeMembers = parameterType.getMembers();
            var parameterSignatures: PullSignatureSymbol[];
            var parameterSignature: PullSignatureSymbol;

            var objectMember: PullSymbol;
            var objectSignatures: PullSignatureSymbol[];


            if (argContext.alreadyRelatingTypes(objectType, parameterType)) {
                return;
            }

            var i = 0;
            var j = 0;

            var objectTypeArguments = objectType.getTypeArguments();
            var parameterTypeParameters = parameterType.getTypeParameters();

            if (objectTypeArguments && (objectTypeArguments.length == parameterTypeParameters.length)) {
                for (i = 0; i < objectTypeArguments.length; i++) {
                    argContext.addCandidateForInference(parameterTypeParameters[i], objectTypeArguments[i], shouldFix);
                }
            }

            for (i = 0; i < parameterTypeMembers.length; i++) {
                objectMember = objectType.findMember(parameterTypeMembers[i].getName());

                if (objectMember) {
                    this.relateTypeToTypeParameters(objectMember.getType(), parameterTypeMembers[i].getType(), shouldFix, argContext, enclosingDecl, context);
                }
            }

            parameterSignatures = parameterType.getCallSignatures();
            objectSignatures = objectType.getCallSignatures();

            for (i = 0; i < parameterSignatures.length; i++) {
                parameterSignature = parameterSignatures[i];

                for (j = 0; j < objectSignatures.length; j++) {
                    this.relateFunctionSignatureToTypeParameters(objectSignatures[j], parameterSignature, argContext, enclosingDecl, context);
                }
            }

            parameterSignatures = parameterType.getConstructSignatures();
            objectSignatures = objectType.getConstructSignatures();

            for (i = 0; i < parameterSignatures.length; i++) {
                parameterSignature = parameterSignatures[i];

                for (j = 0; j < objectSignatures.length; j++) {
                    this.relateFunctionSignatureToTypeParameters(objectSignatures[j], parameterSignature, argContext, enclosingDecl, context);
                }
            }

            parameterSignatures = parameterType.getIndexSignatures();
            objectSignatures = objectType.getIndexSignatures();

            for (i = 0; i < parameterSignatures.length; i++) {
                parameterSignature = parameterSignatures[i];

                for (j = 0; j < objectSignatures.length; j++) {
                    this.relateFunctionSignatureToTypeParameters(objectSignatures[j], parameterSignature, argContext, enclosingDecl, context);
                }
            }
        }

        public relateArrayTypeToTypeParameters(argArrayType: PullTypeSymbol,
                                               parameterArrayType: PullTypeSymbol,
                                               shouldFix: bool,
                                               argContext: ArgumentInferenceContext,
                                               enclosingDecl: PullDecl,
                                               context: PullTypeResolutionContext): void {

            var argElement = argArrayType.getElementType();
            var paramElement = parameterArrayType.getElementType();

            this.relateTypeToTypeParameters(argElement, paramElement, shouldFix, argContext, enclosingDecl, context);
        }

        public specializeTypeToAny(typeToSpecialize: PullTypeSymbol, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullTypeSymbol {
            var prevSpecialize = context.specializingToAny;

            context.specializingToAny = true;
            var type = specializeType(typeToSpecialize, [], this, enclosingDecl, context);
            context.specializingToAny = prevSpecialize;

            return type;
        }

        public specializeSignatureToAny(signatureToSpecialize: PullSignatureSymbol, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSignatureSymbol {
            var typeParameters = signatureToSpecialize.getTypeParameters();
            var typeReplacementMap: any = {};
            var typeArguments: PullTypeSymbol[] = []; // PULLTODO - may be expensive, but easy to cache

            for (var i = 0; i < typeParameters.length; i++) {
                typeArguments[i] = this.semanticInfoChain.anyTypeSymbol;
                typeReplacementMap[typeParameters[i].getSymbolID().toString()] = typeArguments[i];
            }
            if (!typeArguments.length) {
                typeArguments[0] = this.semanticInfoChain.anyTypeSymbol;
            }

            // no need to worry about returning 'null', since 'any' satisfies all constraints
            return specializeSignature(signatureToSpecialize, false, typeReplacementMap, typeArguments, this, enclosingDecl, context);
        }
    }
}