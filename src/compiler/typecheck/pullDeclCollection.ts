// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />
///<reference path='..\..\prototype\SyntaxWalker.generated.ts' />

module TypeScript {

    export class DeclCollectionContext {

        public parentChain: PullDecl[] = [];

        constructor (public semanticInfo: SemanticInfo, public scriptName = "") {
        }

        public getParent() { return this.parentChain ? this.parentChain[this.parentChain.length - 1] : null; }

        public pushParent(parentDecl: PullDecl) { if (parentDecl) { this.parentChain[this.parentChain.length] = parentDecl; } }

        public popParent() { this.parentChain.length--; }
    }

    export function preCollectImportDecls(ast: AST, parent: AST, context: DeclCollectionContext) {
        var importDecl = <ImportDeclaration>ast;
        var isExported = hasFlag(importDecl.varFlags, VarFlags.Exported);
        var declFlags = isExported ? PullElementFlags.Exported : PullElementFlags.None;
        var span = new DeclSpan();

        span.minChar = importDecl.minChar;

        span.limChar = importDecl.limChar

        var decl = new PullDecl(importDecl.id.actualText, PullElementKind.TypeAlias, declFlags, span, context.scriptName);

        context.getParent().addChildDecl(decl);

        context.semanticInfo.setDeclForAST(ast, decl);

        context.semanticInfo.setASTForDecl(decl,ast);

        return false;
    }

    export function preCollectModuleDecls(ast: AST, parent: AST, context: DeclCollectionContext) {
        var moduleDecl: ModuleDeclaration = <ModuleDeclaration>ast;
        var declFlags = PullElementFlags.None;

        if (hasFlag(moduleDecl.modFlags, ModuleFlags.Ambient)) {
            declFlags |= PullElementFlags.Ambient;
        }

        if (hasFlag(moduleDecl.modFlags, ModuleFlags.IsEnum)) {
            declFlags |= PullElementFlags.Enum;
        }

        if (hasFlag(moduleDecl.modFlags, ModuleFlags.Exported)) {
            declFlags |= PullElementFlags.Exported;
        }

        var modName = (<Identifier>moduleDecl.name).text;
        var span = new DeclSpan();

        span.minChar = moduleDecl.minChar;

        span.limChar = moduleDecl.limChar;

        var isDynamic = isQuoted(modName);
        var decl = new PullDecl(modName, isDynamic ? PullElementKind.DynamicModule : PullElementKind.Module, declFlags, span, context.scriptName);

        context.getParent().addChildDecl(decl);

        context.pushParent(decl);

        context.semanticInfo.setDeclForAST(ast, decl);

        context.semanticInfo.setASTForDecl(decl,ast);

        return true;
    }

    export function preCollectClassDecls(ast: AST, parent: AST, context: DeclCollectionContext) {
        var classDecl = <ClassDeclaration>ast;
        var declFlags = PullElementFlags.None;

        if (hasFlag(classDecl.varFlags, VarFlags.Ambient)) {
            declFlags |= PullElementFlags.Ambient;
        }

        if (hasFlag(classDecl.varFlags, VarFlags.Exported)) {
            declFlags |= PullElementFlags.Exported;
        }

        var span = new DeclSpan();

        span.minChar = classDecl.minChar;

        span.limChar = classDecl.limChar;

        var decl = new PullDecl(classDecl.name.text, PullElementKind.Class, declFlags, span, context.scriptName);

        context.getParent().addChildDecl(decl);

        context.pushParent(decl);

        context.semanticInfo.setDeclForAST(ast, decl);

        context.semanticInfo.setASTForDecl(decl,ast);

        return true;
    }

    export function preCollectInterfaceDecls(ast: AST, parent: AST, context: DeclCollectionContext) {
        var interfaceDecl = <InterfaceDeclaration>ast;
        var declFlags = PullElementFlags.None;

        if (hasFlag(interfaceDecl.varFlags, VarFlags.Exported)) {
            declFlags |= PullElementFlags.Exported;
        }

        var span = new DeclSpan();

        span.minChar = interfaceDecl.minChar;

        span.limChar = interfaceDecl.limChar;

        var decl = new PullDecl(interfaceDecl.name.text, PullElementKind.Interface, declFlags, span, context.scriptName);

        var parent = context.getParent();

        // if we're collecting a decl for a type annotation, we don't want to add the decl to the parent scope
        if (parent) {
            parent.addChildDecl(decl);
        }

        context.pushParent(decl);

        context.semanticInfo.setDeclForAST(ast, decl);

        context.semanticInfo.setASTForDecl(decl,ast);

        return true;
    }

    export function preCollectArgDecls(ast: AST, parent: AST, context: DeclCollectionContext) {
        var argDecl = <BoundDecl>ast;
        var declFlags = PullElementFlags.None;

        if (hasFlag(argDecl.varFlags, VarFlags.Private)) {
            declFlags |= PullElementFlags.Private;
        }

        var span = new DeclSpan();

        span.minChar = argDecl.minChar;

        span.limChar = argDecl.limChar;

        var decl = new PullDecl(argDecl.id.text, PullElementKind.Argument, declFlags, span, context.scriptName);

        context.getParent().addChildDecl(decl);

        // if it's a property type, we'll need to add it to the parent's parent as well
        if (hasFlag(argDecl.varFlags, VarFlags.Property)) {
            var propDecl = new PullDecl(argDecl.id.text, PullElementKind.Property, declFlags, span, context.scriptName);
            context.parentChain[context.parentChain.length - 2].addChildDecl(propDecl);
            context.semanticInfo.setASTForDecl(propDecl, ast);
            context.semanticInfo.setDeclForAST(ast, propDecl);
        }
        else {
            context.semanticInfo.setASTForDecl(decl,ast);
            context.semanticInfo.setDeclForAST(ast, decl);   
        }

        if (argDecl.typeExpr && 
            ((<TypeReference>argDecl.typeExpr).term.nodeType == NodeType.InterfaceDeclaration ||
            (<TypeReference>argDecl.typeExpr).term.nodeType == NodeType.FuncDecl)) {

            var declCollectionContext = new DeclCollectionContext(context.semanticInfo);

            declCollectionContext.scriptName = context.scriptName;

            getAstWalkerFactory().walk((<TypeReference>argDecl.typeExpr).term, preCollectDecls, postCollectDecls, null, declCollectionContext);
        }
         
        return false;
    }

    export function preCollectVarDecls(ast: AST, parent: AST, context: DeclCollectionContext) {
        var varDecl = <VarDecl>ast;
        var declFlags = PullElementFlags.None;
        var declType = PullElementKind.Variable;
        var isProperty = false;
        var isStatic = false;

        if (hasFlag(varDecl.varFlags, VarFlags.Ambient)) {
            declFlags |= PullElementFlags.Ambient;
        }

        if (hasFlag(varDecl.varFlags, VarFlags.Exported)) {
            declFlags |= PullElementFlags.Exported;
        }

        if (hasFlag(varDecl.varFlags, VarFlags.Property)) {
            isProperty = true;
            declFlags |= PullElementFlags.Public;
        }

        if (hasFlag(varDecl.varFlags, VarFlags.Static)) {
            isProperty = true;
            isStatic = true;
            declFlags |= PullElementFlags.Static;
        }

        if (hasFlag(varDecl.varFlags, VarFlags.Private)) {
            isProperty = true;
            declFlags |= PullElementFlags.Private;
        }

        if (hasFlag(varDecl.id.flags, ASTFlags.OptionalName)) {
            declFlags |= PullElementFlags.Optional;
        }

        if (isProperty) {
            declType = PullElementKind.Property;
        }
        
        var span = new DeclSpan();

        span.minChar = varDecl.minChar;

        span.limChar = varDecl.limChar;

        var decl = new PullDecl(varDecl.id.text, declType, declFlags, span, context.scriptName);

        context.getParent().addChildDecl(decl);

        context.semanticInfo.setDeclForAST(ast, decl);

        context.semanticInfo.setASTForDecl(decl,ast);

        if (varDecl.typeExpr && 
            ((<TypeReference>varDecl.typeExpr).term.nodeType == NodeType.InterfaceDeclaration ||
            (<TypeReference>varDecl.typeExpr).term.nodeType == NodeType.FuncDecl)) {

            var declCollectionContext = new DeclCollectionContext(context.semanticInfo);

            declCollectionContext.scriptName = context.scriptName;

            getAstWalkerFactory().walk((<TypeReference>varDecl.typeExpr).term, preCollectDecls, postCollectDecls, null, declCollectionContext);
        }

        return false;
    }

    export function preCollectFuncDecls(ast: AST, parent: AST, context: DeclCollectionContext) {

        var funcDecl = <FuncDecl>ast;
        var declFlags = PullElementFlags.None;
        var declType = PullElementKind.Function;
        var isProperty = false;
        var isStatic = false;

        if (hasFlag(funcDecl.fncFlags, FncFlags.Ambient)) {
            declFlags |= PullElementFlags.Ambient;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.Exported)) {
            declFlags |= PullElementFlags.Exported;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.Method)) {
            isProperty = true;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.Static)) {
            isProperty = true;
            isStatic = true;
            declFlags |= PullElementFlags.Static;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.Private)) {
            isProperty = true;
            declFlags |= PullElementFlags.Private;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.ConstructMember) || funcDecl.isConstructor) {
            declFlags |= PullElementFlags.Constructor;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.CallMember)) {
            declFlags |= PullElementFlags.Call;
        }

        if (hasFlag(funcDecl.fncFlags, FncFlags.IndexerMember)) {
            declFlags |= PullElementFlags.Index;
        }

        if (funcDecl.isSignature()) {
            declFlags |= PullElementFlags.Signature;
        }

        if (funcDecl.isGetAccessor()) {
            declFlags |= PullElementFlags.GetAccessor;
        }

        if (funcDecl.isSetAccessor()) {
            declFlags |= PullElementFlags.SetAccessor;
        }

        if (funcDecl.name && hasFlag(funcDecl.name.flags, ASTFlags.OptionalName)) {
            declFlags |= PullElementFlags.Optional;
        }

        if (isProperty) {
            declType = PullElementKind.Method;
        }

        var span = new DeclSpan();

        span.minChar = funcDecl.minChar;

        span.limChar = funcDecl.limChar;

        var funcName = funcDecl.name ? funcDecl.name.text : funcDecl.hint ? funcDecl.hint : "";

        var decl = new PullDecl(funcName, declType, declFlags, span, context.scriptName);

        // parent could be null if we're collecting decls for a lambda expression
        var parent = context.getParent();

        if (parent) {
            parent.addChildDecl(decl);
        }
        context.pushParent(decl);

        context.semanticInfo.setDeclForAST(ast, decl);

        context.semanticInfo.setASTForDecl(decl, ast);

        if (funcDecl.returnTypeAnnotation && 
            ((<TypeReference>funcDecl.returnTypeAnnotation).term.nodeType == NodeType.InterfaceDeclaration ||
            (<TypeReference>funcDecl.returnTypeAnnotation).term.nodeType == NodeType.FuncDecl)) {

            var declCollectionContext = new DeclCollectionContext(context.semanticInfo);

            declCollectionContext.scriptName = context.scriptName;

            getAstWalkerFactory().walk((<TypeReference>funcDecl.returnTypeAnnotation).term, preCollectDecls, postCollectDecls, null, declCollectionContext);
        }

        return true;
    }

    export function preCollectDecls(ast: AST, parent: AST, walker: IAstWalker) {
        var context: DeclCollectionContext = walker.state;
        var go = false;

        if (ast.nodeType == NodeType.Script) {
            var script: Script = <Script>ast;
            var span = new DeclSpan();

            span.minChar = script.minChar;

            span.limChar = script.limChar;

            var decl = new PullDecl(context.scriptName, PullElementKind.Script, PullElementFlags.None, span, context.scriptName);

            context.pushParent(decl);

            go = true;
        }
        else if (ast.nodeType == NodeType.List) {
            go = true;
        }
        else if (ast.nodeType == NodeType.Block) {
            go = true;
        }
        else if (ast.nodeType == NodeType.ModuleDeclaration) {
            go = preCollectModuleDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.ClassDeclaration) {
            go = preCollectClassDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.InterfaceDeclaration) {
            go = preCollectInterfaceDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.ArgDecl) {
            go = preCollectArgDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.VarDecl) {
            go = preCollectVarDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.FuncDecl) {
            go = preCollectFuncDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.ImportDeclaration) {
            go = preCollectImportDecls(ast, parent, context);
        }
        else if (ast.nodeType == NodeType.If) {
            go = true;
        }
        else if (ast.nodeType == NodeType.For) {
            go = true;
        }
        else if (ast.nodeType == NodeType.ForIn) {
            go = true;
        }
        else if (ast.nodeType == NodeType.While) {
            go = true;
        }
        else if (ast.nodeType == NodeType.DoWhile) {
            go = true;
        }
        else if (ast.nodeType == NodeType.Comma) {
            go = true;
        }
        else if (ast.nodeType == NodeType.Return) {
            // want to be able to bind lambdas in return positions
            go = true;
        }
        else if (ast.nodeType == NodeType.Switch || ast.nodeType == NodeType.Case) {
            go = true;
        }

            // call and 'new' expressions may contain lambdas with bindings...
        else if (ast.nodeType == NodeType.Call) {
            // want to be able to bind lambdas in return positions
            go = true;
        }
        else if (ast.nodeType == NodeType.New) {
            // want to be able to bind lambdas in return positions
            go = true;
        }
        //// go into blocks, if necessary...
        //else if (ast.nodeType == NodeType.Block ||
        //         ast.nodeType == NodeType.For ||
        //         ast.nodeType == NodeType.ForIn ||
        //         ast.nodeType == NodeType.While ||
        //         ast.nodeType == NodeType.If ||
        //         ast.nodeType == NodeType.Try ||
        //         ast.nodeType == NodeType.TryCatch ||
        //         ast.nodeType == NodeType.TryFinally ||
        //         ast.nodeType == NodeType.Catch ||
        //         ast.nodeType == NodeType.Finally) {

        //    go = true;

        //}

        walker.options.goChildren = go;

        return ast;
    }

    export function postCollectDecls(ast: AST, parent: AST, walker: IAstWalker) {
        var context: DeclCollectionContext = walker.state;

        // Note that we never pop the Script - after the traversal, it should be the
        // one parent left in the context

        if (ast.nodeType == NodeType.ModuleDeclaration) {
            context.popParent();
        }
        else if (ast.nodeType == NodeType.ClassDeclaration) {
            context.popParent();
        }
        else if (ast.nodeType == NodeType.InterfaceDeclaration) {
            context.popParent();
        }
        else if (ast.nodeType == NodeType.FuncDecl) {
            context.popParent();
        }

        return ast;
    }

   // New Parse Tree format

    export class PullDeclCollector extends SyntaxWalker {
        private parentChain: PullDecl[] = [];
        private topLevelDecl: PullDecl;
        private position: number = 0;

        constructor(public semanticInfo: SemanticInfo) {
            super();
        }

        public getParent() {
            return this.parentChain ? this.parentChain[this.parentChain.length - 1] : null;
        }

        public pushParent(parentDecl: PullDecl) {
            if (parentDecl) { 
                this.parentChain[this.parentChain.length] = parentDecl;
            }
        }

        public popParent() {
            this.parentChain.length--;
        }

        // syntax node visitors

        // store off the position
        public visitToken(token: ISyntaxToken): void {
            this.position += token.fullWidth();
            super.visitToken(token);
        }

        // scripts
        private visitSourceUnit(node: SourceUnitSyntax): void {

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(this.semanticInfo.getPath(), PullElementKind.Script, PullElementFlags.None, span, this.semanticInfo.getPath());

            this.pushParent(decl);

            super.visitSourceUnit(node);

            decl.setSpan(span);

            this.topLevelDecl = decl;

            this.popParent();
        }

        // import declarations
        private visitImportDeclaration(node: ImportDeclarationSyntax): void {

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(node.identifier().text(), PullElementKind.TypeAlias, PullElementFlags.None, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            super.visitImportDeclaration(node);

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl,node);
        }

        // classes
        private visitClassDeclaration(node: ClassDeclarationSyntax): void {

            var declFlags = PullElementFlags.None;

            if (node.declareKeyword()) {
                declFlags |= PullElementFlags.Ambient;
            }

            if (node.exportKeyword()) {
                declFlags |= PullElementFlags.Exported;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(node.identifier().text(), PullElementKind.Class, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.pushParent(decl);

            super.visitClassDeclaration(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl,node);
        }

        // interfaces
        private visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void {

            var declFlags = PullElementFlags.None;

            if (node.exportKeyword()) {
                declFlags |= PullElementFlags.Exported;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(node.identifier().text(), PullElementKind.Interface, declFlags, span, this.semanticInfo.getPath());

            var parent = this.getParent();

            // if we're collecting a decl for a type annotation, we don't want to add the decl to the parent scope
            if (parent) {
                parent.addChildDecl(decl);
            }

            this.pushParent(decl);

            super.visitInterfaceDeclaration(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl,node);
        }

        // modules
        private visitModuleDeclaration(node: ModuleDeclarationSyntax): void {
            var declFlags = PullElementFlags.None;

            if (node.declareKeyword()) {
                declFlags |= PullElementFlags.Ambient;
            }

            if (node.exportKeyword()) {
                declFlags |= PullElementFlags.Exported;
            }

            var modName = node.moduleName().fullText();

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var isDynamic = isQuoted(modName);

            var decl = new PullDecl(modName, isDynamic ? PullElementKind.DynamicModule : PullElementKind.Module, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.pushParent(decl);

            super.visitModuleDeclaration(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        // object type declarations
        private visitObjectType(node: ObjectTypeSyntax): void {

            var declFlags = PullElementFlags.None;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("", PullElementKind.ObjectType, declFlags, span, this.semanticInfo.getPath());

            var parent = this.getParent();

            // if we're collecting a decl for a type annotation, we don't want to add the decl to the parent scope
            if (parent) {
                parent.addChildDecl(decl);
            }

            this.pushParent(decl);

            super.visitObjectType(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl,node);
        }

        // function type expressions
        private visitFunctionType(node: FunctionTypeSyntax): void {

            var declFlags = PullElementFlags.None;
            var declType = PullElementKind.FunctionType;
            var isProperty = false;
            var isStatic = false;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }

            this.pushParent(decl);

            var returnType = node.type();

            if (returnType &&
                (returnType.kind() == SyntaxKind.FunctionType || 
                 returnType.kind() == SyntaxKind.ObjectType ||
                 returnType.kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNodeOrToken(returnType);
            }

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        // constructor type
        private visitConstructorType(node: ConstructorTypeSyntax): void {

            var declFlags = PullElementFlags.None;
            var declType = PullElementKind.ConstructorType;
            var isProperty = false;
            var isStatic = false;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }

            this.pushParent(decl);

            var returnType = node.type();

            if (returnType &&
                (returnType.kind() == SyntaxKind.FunctionType || 
                 returnType.kind() == SyntaxKind.ObjectType ||
                 returnType.kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNodeOrToken(returnType);
            }

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        // functions
        private visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {

            var declFlags = PullElementFlags.None;
            var declType = PullElementKind.Function;
            var isProperty = false;
            var isStatic = false;

            if (node.declareKeyword()) {
                declFlags |= PullElementFlags.Ambient;
            }

            if (node.exportKeyword()) {
                declFlags |= PullElementFlags.Exported;
            }

            if (!node.block()) {
                declFlags |= PullElementFlags.Signature;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var signature = node.functionSignature();

            var funcName = signature.identifier() ? signature.identifier().text() : "";

            var decl = new PullDecl(funcName, declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitFunctionDeclaration(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = signature.callSignature().typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType || 
                 typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                 typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitFunctionExpression(node: FunctionExpressionSyntax): void {

            var declFlags = PullElementFlags.None;
            var declType = PullElementKind.FunctionExpression;

            if (!node.block()) {
                declFlags |= PullElementFlags.Signature;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitFunctionExpression(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = node.callSignature().typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType || 
                 typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                 typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): void {

            var declFlags = PullElementFlags.FatArrow;
            var declType = PullElementKind.FunctionExpression;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitSimpleArrowFunctionExpression(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        private visitParenthesizedSimpleArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void {

            var declFlags = PullElementFlags.FatArrow;
            var declType = PullElementKind.FunctionExpression;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitParenthesizedArrowFunctionExpression(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        private visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {

            var declFlags = PullElementFlags.None;
            var declType = PullElementKind.Method;
            var signature = node.functionSignature();

            if (node.staticKeyword()) {
                declFlags |= PullElementFlags.Static;
            }

            var publicOrPrivateKeyword = node.publicOrPrivateKeyword();

            if (publicOrPrivateKeyword && publicOrPrivateKeyword.tokenKind == SyntaxKind.PrivateKeyword) {
                declFlags |= PullElementFlags.Private;
            }

            if (!node.block) {
                declFlags |= PullElementFlags.Signature;
            }

            if (signature.questionToken) {
                declFlags |= PullElementFlags.Optional;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var funcName = signature.identifier() ? signature.identifier().text() : "";

            var decl = new PullDecl(funcName, declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitMemberFunctionDeclaration(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = signature.callSignature().typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType || 
                 typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                 typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }
        
        private visitIndexSignature(node: IndexSignatureSyntax): void {

            var declFlags = PullElementFlags.Signature | PullElementFlags.Index;
            var declType = PullElementKind.IndexSignature;
            var isStatic = false;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("[]", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitIndexSignature(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = node.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType || 
                 typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                 typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitCallSignature(node: CallSignatureSyntax): void {

            var declFlags = PullElementFlags.Signature | PullElementFlags.Call;
            var declType = PullElementKind.CallSignature;
            var isStatic = false;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("()", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitCallSignature(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = node.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType || 
                 typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                 typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitConstructSignature(node: ConstructSignatureSyntax): void {

            var declFlags = PullElementFlags.Signature | PullElementFlags.Constructor;
            var declType = PullElementKind.ConstructSignature;
            var isStatic = false;

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("new", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            var callSignature = node.callSignature();

            super.visitParameterList(callSignature.parameterList());

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = callSignature.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType || 
                 typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                 typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitMemberConstructorDeclaration(node: ConstructorDeclarationSyntax): void {

            var declFlags = PullElementFlags.Constructor;
            var declType = PullElementKind.ConstructorMethod;
            var isStatic = false;

            if (!node.block) {
                declFlags |= PullElementFlags.Signature;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl("constructor", declType, declFlags, span, this.semanticInfo.getPath());

            // parent could be null if we're collecting decls for a lambda expression
            var parent = this.getParent();

            if (parent) {
                parent.addChildDecl(decl);
            }
            this.pushParent(decl);

            super.visitConstructorDeclaration(node);

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        // variables, members and parameters
        private visitVariableStatement(node: VariableStatementSyntax): void {

            var declFlags = PullElementFlags.None;
            var declType = PullElementKind.Variable;

            if (node.declareKeyword()) {
                declFlags |= PullElementFlags.Ambient;
            }

            if (node.exportKeyword()) {
                declFlags |= PullElementFlags.Exported;
            }
        
            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var varDecls = node.variableDeclaration().variableDeclarators();
            var varDeclCount = varDecls.nonSeparatorCount();
            var varDecl: VariableDeclaratorSyntax;
            var typeAnnotation: TypeAnnotationSyntax;

            var decl: PullDecl;

            for (var i = 0; i < varDeclCount; i++) {
                varDecl = <VariableDeclaratorSyntax>varDecls.nonSeparatorAt(i);
                decl = new PullDecl(varDecl.identifier().text(), declType, declFlags, span, this.semanticInfo.getPath());

                this.getParent().addChildDecl(decl);

                this.semanticInfo.setDeclForSyntaxElement(node, decl);
                this.semanticInfo.setSyntaxElementForDecl(decl, node);

                typeAnnotation = varDecl.typeAnnotation();

                if (typeAnnotation &&
                    (typeAnnotation.type().kind() == SyntaxKind.FunctionType ||
                     typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                     typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                    // collect the annotations in their own context
                    var collector = new PullDeclCollector(this.semanticInfo);
                    collector.visitNode(typeAnnotation);
                }
            }
        }

        private visitPropertySignature(node: PropertySignatureSyntax): void {

            var declFlags = PullElementFlags.Public;
            var declType = PullElementKind.Property;

            if (node.questionToken()) {
                declFlags |= PullElementFlags.Optional;
            }
        
            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(node.identifier().text(), declType, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = node.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType ||
                    typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                    typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void {
            var declFlags = PullElementFlags.Public;
            var declType = PullElementKind.Property;

            var publicOrPrivateKeyword = node.publicOrPrivateKeyword();

            if (publicOrPrivateKeyword && publicOrPrivateKeyword.tokenKind == SyntaxKind.PrivateKeyword) {
                declFlags = PullElementFlags.Private;
            }

            if (node.staticKeyword()) {
                declFlags |= PullElementFlags.Static;
            }
        
            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var varDecl = node.variableDeclarator();

            var decl = new PullDecl(varDecl.identifier().text(), declType, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = varDecl.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType ||
                    typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                    typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
            var declFlags = PullElementFlags.Public;
            var declType = PullElementKind.GetAccessor;

            if (node.staticKeyword()) {
                declFlags |= PullElementFlags.Static;
            }

            var publicOrPrivateKeyword = node.publicOrPrivateKeyword();

            if (publicOrPrivateKeyword && publicOrPrivateKeyword.tokenKind == SyntaxKind.PrivateKeyword) {
                declFlags = PullElementFlags.Private;
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(node.identifier().text(), declType, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            var typeAnnotation = node.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType ||
                    typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                    typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
            var declFlags = PullElementFlags.Public;
            var declType = PullElementKind.SetAccessor;

            if (node.staticKeyword()) {
                declFlags |= PullElementFlags.Static;
            }

            var publicOrPrivateKeyword = node.publicOrPrivateKeyword();

            if (publicOrPrivateKeyword && publicOrPrivateKeyword.tokenKind == SyntaxKind.PrivateKeyword) {
                declFlags = PullElementFlags.Private;
            }
        
            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(node.identifier().text(), declType, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.pushParent(decl);

            // collect parameters
            super.visitParameterList(node.parameterList());

            this.popParent();

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);
        }

        private visitParameter(node: ParameterSyntax): void {

            var declFlags = PullElementFlags.None;
            var isProperty = false; 
            var publicOrPrivateKeyword = node.publicOrPrivateKeyword();

            if (publicOrPrivateKeyword) {
                isProperty = true;

                if (publicOrPrivateKeyword.tokenKind == SyntaxKind.PrivateKeyword) {
                    declFlags = PullElementFlags.Private;
                }
                else {
                    declFlags = PullElementFlags.Public;
                }
            }

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();
            
            var decl = new PullDecl(node.identifier().text(), PullElementKind.Argument, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            // if it's a property type, we'll need to add it to the parent's parent as well
            if (isProperty) {
                var propDecl = new PullDecl(node.identifier().text(), PullElementKind.Property, declFlags, span, this.semanticInfo.getPath());
                
                this.parentChain[this.parentChain.length - 2].addChildDecl(propDecl);

                this.semanticInfo.setSyntaxElementForDecl(propDecl, node);
                this.semanticInfo.setDeclForSyntaxElement(node, propDecl);
            }
            else {
                this.semanticInfo.setSyntaxElementForDecl(decl, node);
                this.semanticInfo.setDeclForSyntaxElement(node, decl);   
            }

            var typeAnnotation = node.typeAnnotation();

            if (typeAnnotation &&
                (typeAnnotation.type().kind() == SyntaxKind.FunctionType ||
                    typeAnnotation.type().kind() == SyntaxKind.ObjectType ||
                    typeAnnotation.type().kind() == SyntaxKind.ConstructorType)) {

                // collect the annotations in their own context
                var collector = new PullDeclCollector(this.semanticInfo);
                collector.visitNode(typeAnnotation);
            }
        }

        private visitEnumDeclarations(node: EnumDeclarationSyntax) {
            var declFlags = PullElementFlags.None;

            if (node.exportKeyword()) {
                declFlags |= PullElementFlags.Exported;
            }

            var enumName = node.identifier().text();

            var span = new DeclSpan();

            span.minChar = this.position;
            span.limChar = this.position + node.fullWidth();

            var decl = new PullDecl(enumName, PullElementKind.Enum, declFlags, span, this.semanticInfo.getPath());

            this.getParent().addChildDecl(decl);

            this.pushParent(decl);

            var varDecls = node.variableDeclarators();
            var varDeclCount = varDecls.nonSeparatorCount();
            var varDecl: VariableDeclaratorSyntax;
            var typeAnnotation: TypeAnnotationSyntax;

            var memberPullDecl: PullDecl;

            for (var i = 0; i < varDeclCount; i++) {
                varDecl = <VariableDeclaratorSyntax>varDecls.nonSeparatorAt(i);
                memberPullDecl = new PullDecl(varDecl.identifier().text(), PullElementKind.Variable, declFlags, span, this.semanticInfo.getPath());

                this.getParent().addChildDecl(memberPullDecl);

                this.semanticInfo.setDeclForSyntaxElement(varDecl, memberPullDecl);
                this.semanticInfo.setSyntaxElementForDecl(memberPullDecl, varDecl);

            }

            this.popParent();

            decl.setSpan(span);

            this.semanticInfo.setDeclForSyntaxElement(node, decl);
            this.semanticInfo.setSyntaxElementForDecl(decl, node);

            return true;
        }

        // public interface
        static collectDecls(sourceUnit: SourceUnitSyntax, semanticInfo: SemanticInfo): void {
            var collector = new PullDeclCollector(semanticInfo);
            sourceUnit.accept(collector);

            semanticInfo.addTopLevelDecl(collector.topLevelDecl);
        }
    }
}