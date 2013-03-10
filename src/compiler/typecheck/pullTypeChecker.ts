// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export class PullTypeCheckContext {
        public enclosingDeclStack: PullDecl[] = [];
        public semanticInfo: SemanticInfo = null;

        constructor(public compiler: TypeScriptCompiler, public script: Script, public scriptName: string) { }

        public pushEnclosingDecl(decl: PullDecl) {
            this.enclosingDeclStack[this.enclosingDeclStack.length] = decl;
        }

        public popEnclosingDecl() {
            this.enclosingDeclStack.length--;
        }

        public getEnclosingDecl() {
            if (this.enclosingDeclStack.length) {
                return this.enclosingDeclStack[this.enclosingDeclStack.length - 1];
            }

            return null;
        }

    }

    export function prePullTypeCheck(ast: AST, parent: AST, walker: IAstWalker): AST {

        var typeCheckContext: PullTypeCheckContext = <PullTypeCheckContext>walker.state;

        var typeChecker = typeCheckContext.compiler.pullTypeChecker;
        
        walker.options.goChildren = typeChecker.typeCheckAST(ast, typeCheckContext);
        return ast;
    }


    export function postPullTypeCheck(ast: AST, parent: AST, walker: IAstWalker): AST {
        var typeCheckContext: PullTypeCheckContext = <PullTypeCheckContext>walker.state;

        var go = false;

        switch (ast.nodeType) {

            case NodeType.FuncDecl:
            case NodeType.ClassDeclaration:
            case NodeType.InterfaceDeclaration:
            case NodeType.ModuleDeclaration:
                typeCheckContext.popEnclosingDecl();
            default:
                break;
        }

        return ast;
    }

    export class PullTypeChecker {

        public resolver: PullTypeResolver = null;

        public context: PullTypeResolutionContext = new PullTypeResolutionContext();

        constructor(public semanticInfoChain: SemanticInfoChain) { }

        public setUnit(unitPath: string) {
            this.resolver = new PullTypeResolver(this.semanticInfoChain, unitPath);
        }

        public getScriptDecl(fileName: string): PullDecl {
            return this.semanticInfoChain.getUnit(fileName).getTopLevelDecls()[0];
        }

        // declarations

        public typeCheckAST(ast: AST, typeCheckContext: PullTypeCheckContext): bool {
            var go = false;

            switch (ast.nodeType) {
                case NodeType.List:
                    go = true;
                    break;

                // decarations
                case NodeType.Script:
                    {
                        typeCheckContext.semanticInfo = typeCheckContext.compiler.semanticInfoChain.getUnit(typeCheckContext.scriptName);
                        var scriptDecl = typeCheckContext.semanticInfo.getTopLevelDecls()[0];
                        typeCheckContext.pushEnclosingDecl(scriptDecl);
                        go = true;
                    }
                    break;

                case NodeType.VarDecl:
                case NodeType.ArgDecl:
                    this.typeCheckBoundDecl(ast, typeCheckContext);

                    break;

                case NodeType.FuncDecl:
                    {
                        var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                        typeCheckContext.pushEnclosingDecl(functionDecl);

                        this.typeCheckFunction(ast, typeCheckContext);
                    }
                    break;

                case NodeType.ClassDeclaration:
                    {
                        var classDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                        typeCheckContext.pushEnclosingDecl(classDecl);

                        this.typeCheckClass(ast, typeCheckContext);

                        go = true;
                    }
                    break;

                case NodeType.InterfaceDeclaration:
                    {
                        var interfaceDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                        typeCheckContext.pushEnclosingDecl(interfaceDecl);

                        this.typeCheckInterface(ast, typeCheckContext);
                    }
                    break;

                case NodeType.ModuleDeclaration:
                    {
                        var moduleDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                        typeCheckContext.pushEnclosingDecl(moduleDecl);

                        this.typeCheckModule(ast, typeCheckContext);

                        go = true;
                    }
                    break;

                // expressions

                // assignment
                case NodeType.Asg:
                    this.typeCheckAssignment(ast, typeCheckContext);
                    break;

                case GenericType:
                    this.typeCheckGenericType(ast, typeCheckContext);
                    break;

                case NodeType.ObjectLit:
                    this.typeCheckObjectLiteral(ast, typeCheckContext);
                    break;

                case NodeType.ArrayLit:
                    this.typeCheckArrayLiteral(ast, typeCheckContext);
                    break;

                case NodeType.This:
                    this.typeCheckThis(ast, typeCheckContext);
                    break;

                case NodeType.Super:
                    this.typeCheckSuper(ast, typeCheckContext);
                    break;

                case NodeType.Call:
                    this.typeCheckCall(ast, typeCheckContext);
                    break;

                case NodeType.New:
                    this.typeCheckNew(ast, typeCheckContext);
                    break;

                case NodeType.TypeAssertion:
                    this.typeCheckTypeAssertion(ast, typeCheckContext);
                    break;

                case NodeType.TypeRef:
                    this.typeCheckTypeReference(ast, typeCheckContext);
                    break

                // boolean operations
                case NodeType.Not:
                case NodeType.LogNot:
                case NodeType.Ne:
                case NodeType.Eq:
                case NodeType.Eqv:
                case NodeType.NEqv:
                case NodeType.Lt:
                case NodeType.Le:
                case NodeType.Ge:
                case NodeType.Gt:
                    this.typeCheckLogicalOperation(ast, typeCheckContext);
                    break;

                case NodeType.Add:
                case NodeType.Sub:
                case NodeType.Mul:
                case NodeType.Div:
                case NodeType.Mod:
                case NodeType.Or:
                case NodeType.And:
                case NodeType.AsgAdd:
                case NodeType.AsgSub:
                case NodeType.AsgMul:
                case NodeType.AsgDiv:
                case NodeType.AsgMod:
                case NodeType.AsgOr:
                case NodeType.AsgAnd:
                    this.typeCheckBinaryArithmeticOperation(ast, typeCheckContext);
                    break;

                case NodeType.Pos:
                case NodeType.Neg:
                case NodeType.IncPost:
                case NodeType.IncPre:
                case NodeType.DecPost:
                case NodeType.DecPre:
                    this.typeCheckUnaryArithmeticOperation(ast, typeCheckContext);
                    break;

                case NodeType.Lsh:
                case NodeType.Rsh:
                case NodeType.Rs2:
                case NodeType.AsgLsh:
                case NodeType.AsgRsh:
                case NodeType.AsgRs2:
                    this.typeCheckBitwiseOperation(ast, typeCheckContext);
                    break;

                case NodeType.Index:
                    this.typeCheckIndex(ast, typeCheckContext);
                    break;

                case NodeType.LogOr:
                case NodeType.LogAnd:
                    this.typeCheckLogicalAndOrExpression(ast, typeCheckContext);
                    break;

                case NodeType.Typeof:
                    this.typeCheckTypeOf(ast, typeCheckContext);
                    break;

                default:
                    break;
            }

            return go;
        }

        //
        // Validation
        //

        // scripts
        public typeCheckScript(script: Script, scriptName: string, compiler: TypeScriptCompiler) {
            var typeCheckContext = new PullTypeCheckContext(compiler, script, scriptName);

            this.setUnit(scriptName);

            getAstWalkerFactory().walk(script, prePullTypeCheck, postPullTypeCheck, null, typeCheckContext);
        }

        // variable and argument declarations
        // validate:
        //  - lhs and rhs types agree (if lhs has no type annotation)
        public typeCheckBoundDecl(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            var boundDeclAST = <BoundDecl>ast;

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var varTypeSymbol = this.resolver.resolveAST(boundDeclAST, false, enclosingDecl, this.context).getType();

            // if there's a type expr and an initializer, resolve the initializer
            if (boundDeclAST.init) {
                this.context.pushContextualType(varTypeSymbol, this.context.inProvisionalResolution(), null);
                var initTypeSymbol = this.resolver.resolveAST(boundDeclAST.init, true, enclosingDecl, this.context).getType();
                this.context.popContextualType();

                // walk any children of the initializer expression
                getAstWalkerFactory().walk(boundDeclAST.init, prePullTypeCheck, postPullTypeCheck, null, typeCheckContext);

                var comparisonInfo = new TypeComparisonInfo();

                var isAssignable = this.resolver.sourceIsAssignableToTarget(initTypeSymbol, varTypeSymbol, this.context, comparisonInfo);

                if (!isAssignable) {
                    var errorMessage = comparisonInfo.message;

                    // ignore comparison info for now
                    var message = getDiagnosticMessage(DiagnosticMessages.incompatibleTypes_2, [initTypeSymbol.toString(), varTypeSymbol.toString()]);

                    this.context.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, message, enclosingDecl);
                }
            }

            return boundDeclAST;
        }

        // functions 
        // validate:
        //  - use of super calls 
        //  - signatures agree in optionality
        //  - getter/setter type agreement
        //  - body members expr
        // PULLTODO: split up into separate functions for constructors, indexers, expressions, signatures, etc.
        public typeCheckFunction(ast: AST, typeCheckContext: PullTypeCheckContext): AST {

            // "Calls to 'super' constructor are not allowed in classes that either inherit directly from 'Object' or have no base class"
            // "If a derived class contains initialized properties or constructor parameter properties, the first statement in the constructor body must be a call to the super constructor"
            // "Constructors for derived classes must contain a call to the class's 'super' constructor"
            // "Index signatures may take one and only one parameter"
            // "Index signatures may only take 'string' or 'number' as their parameter"
            // "Function declared a non-void return type, but has no return expression"
            // "Getters must return a value"
            // "Getter and setter types do not agree"
            // "Setters may have one and only one argument"
            // "Constructors may not have a return type of 'void'"

            var funcDeclAST = <FuncDecl>ast;

            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);

            typeCheckContext.pushEnclosingDecl(functionDecl);

            if (funcDeclAST.bod) {
                for (var i = 0; i < funcDeclAST.bod.members.length; i++) {
                    this.typeCheckAST(funcDeclAST.bod.members[i], typeCheckContext);
                }
            }

            typeCheckContext.popEnclosingDecl();

            return ast;
        }

        // Classes
        // validate:
        //  - mutually recursive base classes
        //  - duplicate implemented interfaces
        //  - mutually recursive type parameters
        //  - bases are interfaces or classes
        //  - properties satisfy implemented interfaces
        //  - properties of base class and implemented interfaces agree
        //  - type of overridden member is subtype of original
        //  - method does not overrided field, or vice-versa
        //  - body members
        public typeCheckClass(ast: AST, typeCheckContext: PullTypeCheckContext): AST {

            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context);
            return ast;
        }

        // Interfaces
        // validate:
        //  - mutually recursive bases
        //  - duplicate implemented or extended interfaces
        //  - mutually recursive type parameters
        //  - properties of extended interfaces do not conflict
        //  - bases are interfaces or classes
        public typeCheckInterface(ast: AST, typeCheckContext: PullTypeCheckContext): AST {

            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context);
            return ast;
        }


        // Modules
        // validate:
        //  -
        public typeCheckModule(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context);
            return ast;
        }

        // expressions

        // Assignment
        // validate:
        //  - lhs and rhs types agree
        //  - lhs is a valid value type
        public typeCheckAssignment(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            var assignmentAST = <BinaryExpression>ast;

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var leftType = this.resolver.resolveAST(assignmentAST.operand1, false, enclosingDecl, this.context).getType();

            this.context.pushContextualType(leftType, this.context.inProvisionalResolution(), null);
            var rightType = this.resolver.resolveAST(assignmentAST.operand2, true, enclosingDecl, this.context).getType();
            this.context.popContextualType();

            var comparisonInfo = new TypeComparisonInfo();

            var isAssignable = this.resolver.sourceIsAssignableToTarget(rightType, leftType, this.context, comparisonInfo);

            if (!isAssignable) {
                var errorMessage = comparisonInfo.message;
                var span = enclosingDecl.getSpan();

                // ignore comparison info for now
                var message = getDiagnosticMessage(DiagnosticMessages.incompatibleTypes_2, [rightType.toString(), leftType.toString()]);

                this.context.postError(assignmentAST.operand1.minChar - span.start(), span.length(), typeCheckContext.scriptName, message, enclosingDecl);
            }

            return ast;
        }

        // Generic Type references
        // validate:
        //
        public typeCheckGenericType(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            // validate:
            //  - mutually recursive type parameters and constraints
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        // Object literals
        // validate:
        //
        public typeCheckObjectLiteral(ast: AST, typeCheckContext: PullTypeCheckContext): AST {

            return ast;
        }

        // Array literals
        // validate:
        //  - incompatible types in expression
        public typeCheckArrayLiteral(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // 'This' expressions 
        // validate:
        //
        public typeCheckThis(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // 'Super' expressions 
        // validate:
        //
        public typeCheckSuper(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Call expressions 
        // validate:
        //
        public typeCheckCall(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            // "use of new expression as a statement"
            return ast;
        }

        // 'New' expressions 
        // validate:
        //
        public typeCheckNew(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Type assertion expressions 
        // validate:
        //  - the type assertion and the expression it's applied to are assignment compatible
        public typeCheckTypeAssertion(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Logical operations
        // validate:
        //  - lhs and rhs are compatible
        public typeCheckLogicalOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Logical 'And' and 'Or' expressions 
        // validate:
        // - lhs and rhs are compatible
        public typeCheckLogicalAndOrExpression(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Binary arithmetic expressions 
        // validate:
        //  - lhs and rhs are compatible
        public typeCheckBinaryArithmeticOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Unary arithmetic expressions 
        // validate:
        //  -
        public typeCheckUnaryArithmeticOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Bitwise operations 
        // validate:
        //  -
        public typeCheckBitwiseOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // Index expression 
        // validate:
        //  -
        public typeCheckIndex(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        // 'typeof' expression 
        // validate:
        //  -
        public typeCheckTypeOf(ast: AST, context: PullTypeCheckContext): AST {
            return ast;
        }

        // Type reference expression
        // validate:
        //  -
        public typeCheckTypeReference(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

    }

}
