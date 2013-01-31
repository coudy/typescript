// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />
///<reference path='..\Syntax\SyntaxWalker.generated.ts' />

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
}