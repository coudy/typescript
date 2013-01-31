// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
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