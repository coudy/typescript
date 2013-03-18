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

    export class PullTypeChecker {

        static globalPullTypeCheckPhase = 0;
        
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

        public typeCheckAST(ast: AST, typeCheckContext: PullTypeCheckContext, inTypedAssignment=false): PullTypeSymbol {

            if (!ast) {
                return null;
            }

            if (ast.typeCheckPhase >= PullTypeChecker.globalPullTypeCheckPhase) {
                return null;
            }
            else {
                ast.typeCheckPhase = PullTypeChecker.globalPullTypeCheckPhase;
            }
           
            switch (ast.nodeType) {

                // lists
                case NodeType.List:
                    return this.typeCheckList(ast, typeCheckContext);

                // decarations

                case NodeType.VarDecl:
                case NodeType.ArgDecl:
                    return this.typeCheckBoundDecl(ast, typeCheckContext);

                case NodeType.FuncDecl:
                    return this.typeCheckFunction(ast, typeCheckContext, inTypedAssignment);

                case NodeType.ClassDeclaration:
                    return this.typeCheckClass(ast, typeCheckContext);

                case NodeType.InterfaceDeclaration:
                    return this.typeCheckInterface(ast, typeCheckContext);

                case NodeType.ModuleDeclaration:
                    return this.typeCheckModule(ast, typeCheckContext);

                // expressions

                // assignment
                case NodeType.Asg:
                    return this.typeCheckAssignment(ast, typeCheckContext);

                case GenericType:
                    return this.typeCheckGenericType(ast, typeCheckContext);

                case NodeType.ObjectLit:
                    return this.typeCheckObjectLiteral(ast, typeCheckContext, inTypedAssignment);

                case NodeType.ArrayLit:
                    return this.typeCheckArrayLiteral(ast, typeCheckContext, inTypedAssignment);

                case NodeType.This:
                    return this.typeCheckThis(ast, typeCheckContext);

                case NodeType.Super:
                    return this.typeCheckSuper(ast, typeCheckContext);

                case NodeType.Call:
                    return this.typeCheckCall(ast, typeCheckContext);

                case NodeType.New:
                    return this.typeCheckNew(ast, typeCheckContext);

                case NodeType.TypeAssertion:
                    return this.typeCheckTypeAssertion(ast, typeCheckContext);

                case NodeType.TypeRef:
                    return this.typeCheckTypeReference(ast, typeCheckContext);

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
                    return this.typeCheckLogicalOperation(ast, typeCheckContext);

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
                    return this.typeCheckBinaryArithmeticOperation(ast, typeCheckContext);

                case NodeType.Pos:
                case NodeType.Neg:
                case NodeType.IncPost:
                case NodeType.IncPre:
                case NodeType.DecPost:
                case NodeType.DecPre:
                    return this.typeCheckUnaryArithmeticOperation(ast, typeCheckContext);

                case NodeType.Lsh:
                case NodeType.Rsh:
                case NodeType.Rs2:
                case NodeType.AsgLsh:
                case NodeType.AsgRsh:
                case NodeType.AsgRs2:
                    return this.typeCheckBitwiseOperation(ast, typeCheckContext);

                case NodeType.Index:
                    return this.typeCheckIndex(ast, typeCheckContext);

                case NodeType.LogOr:
                case NodeType.LogAnd:
                    return this.typeCheckLogicalAndOrExpression(ast, typeCheckContext);

                case NodeType.Typeof:
                    return this.typeCheckTypeOf(ast, typeCheckContext);

                case NodeType.ConditionalExpression:
                    return this.typeCheckConditionalExpression(ast, typeCheckContext);

                case NodeType.Void:
                    return this.typeCheckVoidExpression(ast, typeCheckContext);

                case NodeType.Throw:
                    return this.typeCheckThrowExpression(ast, typeCheckContext);

                case NodeType.Delete:
                    return this.typeCheckDeleteExpression(ast, typeCheckContext);

                case NodeType.Regex:
                    return this.typeCheckRegExpExpression(ast, typeCheckContext);

                // statements
                case NodeType.For:
                    return this.typeCheckForStatement(ast, typeCheckContext);

                case NodeType.ForIn:
                    return this.typeCheckForInStatement(ast, typeCheckContext);

                case NodeType.While:
                    return this.typeCheckWhileStatement(ast, typeCheckContext);

                case NodeType.DoWhile:
                    return this.typeCheckDoWhileStatement(ast, typeCheckContext);

                case NodeType.If:
                    return this.typeCheckIfStatement(ast, typeCheckContext);

                case NodeType.Block:
                    return this.typeCheckBlockStatement(ast, typeCheckContext);

                case NodeType.With:
                    return this.typeCheckWithStatement(ast, typeCheckContext);

                case NodeType.TryFinally:
                    return this.typeCheckTryFinallyStatement(ast, typeCheckContext);

                case NodeType.TryCatch:
                    return this.typeCheckTryCatchStatement(ast, typeCheckContext);

                case NodeType.Try:
                    return this.typeCheckTryBlock(ast, typeCheckContext);

                case NodeType.Catch:
                    return this.typeCheckCatchBlock(ast, typeCheckContext);

                case NodeType.Finally:
                    return this.typeCheckFinallyBlock(ast, typeCheckContext);

                case NodeType.Return:
                    return this.typeCheckReturnExpression(ast, typeCheckContext);

                case NodeType.Name:
                    return this.typeCheckNameExpression(ast, typeCheckContext);

                case NodeType.Dot:
                    return this.typeCheckDottedNameExpression(ast, typeCheckContext);

                case NodeType.Switch:
                    return this.typeCheckSwitchStatement(ast, typeCheckContext);

                case NodeType.Case:
                    return this.typeCheckCaseStatement(ast, typeCheckContext);

                default:
                    break;
            }

            return null;
        }

        //
        // Validation
        //

        // scripts
        public typeCheckScript(script: Script, scriptName: string, compiler: TypeScriptCompiler) {
            var typeCheckContext = new PullTypeCheckContext(compiler, script, scriptName);

            this.setUnit(scriptName);
            
            typeCheckContext.semanticInfo = typeCheckContext.compiler.semanticInfoChain.getUnit(typeCheckContext.scriptName);
            var scriptDecl = typeCheckContext.semanticInfo.getTopLevelDecls()[0];
            typeCheckContext.pushEnclosingDecl(scriptDecl);

            PullTypeChecker.globalPullTypeCheckPhase++;

            if (script.bod.members) {
                for (var i = 0; i < script.bod.members.length; i++) {
                    this.typeCheckAST(script.bod.members[i], typeCheckContext);
                }
            }

            typeCheckContext.popEnclosingDecl();
        }

        // lists
        public typeCheckList(ast: AST, typeCheckContext: PullTypeCheckContext) {
            var list = <ASTList>ast;

            if (!list) {
                return null;
            }

            for (var i = 0; i < list.members.length; i++) {
                this.typeCheckAST(list.members[i], typeCheckContext);
            }
        }

        // variable and argument declarations
        // validate:
        //  - lhs and rhs types agree (if lhs has no type annotation)
        public typeCheckBoundDecl(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var boundDeclAST = <BoundDecl>ast;

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var varTypeSymbol = this.resolver.resolveAST(boundDeclAST, false, enclosingDecl, this.context).getType();

            // if there's a type expr and an initializer, resolve the initializer
            if (boundDeclAST.init) {
                this.context.pushContextualType(varTypeSymbol, this.context.inProvisionalResolution(), null);
                //var initTypeSymbol = this.resolver.resolveAST(boundDeclAST.init, true, enclosingDecl, this.context).getType();
                var initTypeSymbol = this.typeCheckAST(boundDeclAST.init, typeCheckContext, true);
                this.context.popContextualType();
                
                //getAstWalkerFactory().walk(boundDeclAST.init, prePullTypeCheck, postPullTypeCheck, null, typeCheckContext);

                var comparisonInfo = new TypeComparisonInfo();

                var isAssignable = this.resolver.sourceIsAssignableToTarget(initTypeSymbol, varTypeSymbol, this.context, comparisonInfo);

                if (!isAssignable) {
                    var errorMessage = comparisonInfo.message;

                    // ignore comparison info for now
                    var message = getDiagnosticMessage(PullDiagnosticMessages.incompatibleTypes_2, [initTypeSymbol.toString(), varTypeSymbol.toString()]);

                    this.context.postError(boundDeclAST.minChar, boundDeclAST.getLength(), typeCheckContext.scriptName, message, enclosingDecl);
                }
            }

            return varTypeSymbol;
        }

        // functions 
        // validate:
        //  - use of super calls 
        //  - signatures agree in optionality
        //  - getter/setter type agreement
        //  - body members expr
        //  - getter/setter flags agree
        //  - getters have no parameters 
        //  - getters return a value
        //  - setters return no value
        // PULLTODO: split up into separate functions for constructors, indexers, expressions, signatures, etc.
        public typeCheckFunction(ast: AST, typeCheckContext: PullTypeCheckContext, inTypedAssignment = false): PullTypeSymbol {

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

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var functionSymbol = this.resolver.resolveAST(ast, inTypedAssignment, enclosingDecl, this.context).getType();

            var funcDeclAST = <FuncDecl>ast;

            var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(funcDeclAST);

            typeCheckContext.pushEnclosingDecl(functionDecl);

            this.typeCheckAST(funcDeclAST.bod, typeCheckContext);

            typeCheckContext.popEnclosingDecl();

            return functionSymbol.getType();
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
        public typeCheckClass(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var classAST = <ClassDeclaration>ast;
            // resolving the class also resolves its members...
            var classSymbol = <PullClassTypeSymbol>this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
            
            if (classAST.members) {
                for (var i = 0; i < classAST.members.members.length; i++) {
                    this.typeCheckAST(classAST.members.members[i], typeCheckContext);
                }
            }
            
            return classSymbol;
        }

        // Interfaces
        // validate:
        //  - mutually recursive bases
        //  - duplicate implemented or extended interfaces
        //  - mutually recursive type parameters
        //  - properties of extended interfaces do not conflict
        //  - bases are interfaces or classes
        //  - declarations agree in generic parameters 
        public typeCheckInterface(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {

            // resolving the interface also resolves its members...
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Modules
        // validate:
        //  - No type parameters?
        public typeCheckModule(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {

            // we resolve here because resolving a module *does not* resolve its MemberScopeContext
            // PULLREVIEW: Perhaps it should?
            var moduleDeclAST = <ModuleDeclaration>ast;
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context);

            var moduleDecl = typeCheckContext.semanticInfo.getDeclForAST(moduleDeclAST);
            typeCheckContext.pushEnclosingDecl(moduleDecl);

            if (moduleDeclAST.members) {
                this.typeCheckAST(moduleDeclAST.members, typeCheckContext);
            }

            typeCheckContext.popEnclosingDecl();

            return moduleDecl.getSymbol().getType();
        }

        // expressions

        // Assignment
        // validate:
        //  - lhs and rhs types agree
        //  - lhs is a valid value type
        public typeCheckAssignment(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
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
                var message = getDiagnosticMessage(PullDiagnosticMessages.incompatibleTypes_2, [rightType.toString(), leftType.toString()]);

                this.context.postError(assignmentAST.operand1.minChar, span.length(), typeCheckContext.scriptName, message, enclosingDecl);
            }

            return leftType;
        }

        // Generic Type references
        // validate:
        //
        public typeCheckGenericType(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // validate:
            //  - mutually recursive type parameters and constraints
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Object literals
        // validate:
        //
        public typeCheckObjectLiteral(ast: AST, typeCheckContext: PullTypeCheckContext, inTypedAssignment = false): PullTypeSymbol {
            var objectLitAST = <UnaryExpression>ast;

            var objectLitType = this.resolver.resolveAST(ast, inTypedAssignment, typeCheckContext.getEnclosingDecl(), this.context).getType();
            var memberDecls = <ASTList>objectLitAST.operand;

            // PULLTODO: Contextually type the members
            if (memberDecls) {
                var binex: BinaryExpression;
                for (var i = 0; i < memberDecls.members.length; i++) {
                    binex = <BinaryExpression>memberDecls.members[i];

                    this.typeCheckAST(binex.operand2, typeCheckContext);
                }
            }


            return objectLitType;
        }

        // Array literals
        // validate:
        //  - incompatible types in expression
        public typeCheckArrayLiteral(ast: AST, typeCheckContext: PullTypeCheckContext, inTypedAssignment = false): PullTypeSymbol {
            return this.resolver.resolveAST(ast, inTypedAssignment, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // 'This' expressions 
        // validate:
        //
        public typeCheckThis(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // 'Super' expressions 
        // validate:
        //
        public typeCheckSuper(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Call expressions 
        // validate:
        //
        public typeCheckCall(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // "use of new expression as a statement"
            var callEx = <CallExpression>ast;
            var resultType = this.resolver.resolveAST(callEx, false, typeCheckContext.getEnclosingDecl(), this.context).getType();


            var args = callEx.arguments;

            if (args) {
                for (var i = 0; i < args.members.length; i++) {
                    this.typeCheckAST(args.members[i], typeCheckContext);
                }
            }

            return resultType;
        }

        // 'New' expressions 
        // validate:
        //
        public typeCheckNew(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var callEx = <CallExpression>ast;
            var resultType = this.resolver.resolveAST(callEx, false, typeCheckContext.getEnclosingDecl(), this.context).getType();

            var args = callEx.arguments;

            if (args) {
                for (var i = 0; i < args.members.length; i++) {
                    this.typeCheckAST(args.members[i], typeCheckContext);
                }
            }

            return resultType;
        }

        // Type assertion expressions 
        // validate:
        //  - the type assertion and the expression it's applied to are assignment compatible
        public typeCheckTypeAssertion(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Logical operations
        // validate:
        //  - lhs and rhs are compatible
        public typeCheckLogicalOperation(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Logical 'And' and 'Or' expressions 
        // validate:
        // - lhs and rhs are compatible
        public typeCheckLogicalAndOrExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Binary arithmetic expressions 
        // validate:
        //  - lhs and rhs are compatible
        public typeCheckBinaryArithmeticOperation(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Unary arithmetic expressions 
        // validate:
        //  -
        public typeCheckUnaryArithmeticOperation(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Bitwise operations 
        // validate:
        //  -
        public typeCheckBitwiseOperation(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Index expression 
        // validate:
        //  -
        public typeCheckIndex(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // 'typeof' expression 
        // validate:
        //  -
        public typeCheckTypeOf(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Type reference expression
        // validate:
        //  -
        public typeCheckTypeReference(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // Conditional expressions
        // validate:
        //  -
        public typeCheckConditionalExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // new expression types
        public typeCheckThrowExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.resolver.resolveAST((<UnaryExpression>ast).operand, false, typeCheckContext.getEnclosingDecl(), this.context);
            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckDeleteExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.resolver.resolveAST((<UnaryExpression>ast).operand, false, typeCheckContext.getEnclosingDecl(), this.context);
            return this.semanticInfoChain.boolTypeSymbol;
        }

        public typeCheckVoidExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            this.resolver.resolveAST((<UnaryExpression>ast).operand, false, typeCheckContext.getEnclosingDecl(), this.context);
            return this.semanticInfoChain.undefinedTypeSymbol;
        }

        public typeCheckRegExpExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveStatementOrExpression(ast, false, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        // statements

        public typeCheckForStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var forStatementAST = <ForStatement>ast;

            this.typeCheckAST(forStatementAST.init, typeCheckContext);
            this.typeCheckAST(forStatementAST.cond, typeCheckContext);
            this.typeCheckAST(forStatementAST.body, typeCheckContext);            

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckForInStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {

            var forInStatement = <ForInStatement>ast;


            this.typeCheckAST(forInStatement.obj, typeCheckContext);
            
            var varDecl = <VarDecl>forInStatement.lval;

            if (varDecl.typeExpr) {
                this.context.postError(varDecl.minChar, varDecl.getLength(), typeCheckContext.scriptName, "Variable declarations for for/in expressions may not contain a type annotation", typeCheckContext.getEnclosingDecl());
            }

            var varSym = this.resolver.resolveAST(varDecl, false, typeCheckContext.getEnclosingDecl(), this.context);

            varSym.unsetType();

            varSym.setType(this.semanticInfoChain.stringTypeSymbol);
            varSym.setResolved();            

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckWhileStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var whileStatementAST = <WhileStatement>ast;

            this.typeCheckAST(whileStatementAST.cond, typeCheckContext);
            this.typeCheckAST(whileStatementAST.body, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckDoWhileStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var whileStatementAST = <DoWhileStatement>ast;

            this.typeCheckAST(whileStatementAST.cond, typeCheckContext);
            this.typeCheckAST(whileStatementAST.body, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckIfStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {

            var ifStatementAST = <IfStatement>ast;

            this.typeCheckAST(ifStatementAST.cond, typeCheckContext);
            this.typeCheckAST(ifStatementAST.thenBod, typeCheckContext);
            this.typeCheckAST(ifStatementAST.elseBod, typeCheckContext);
                
            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckBlockStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var blockStatement = <Block>ast;

            this.typeCheckAST(blockStatement.statements, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckWithStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            // PULLTODO: "With" statements
            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckTryFinallyStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var tryFinallyAST = <TryFinally>ast;

            this.typeCheckAST(tryFinallyAST.tryNode, typeCheckContext);
            this.typeCheckAST(tryFinallyAST.finallyNode, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckTryCatchStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var tryCatchAST = <TryCatch>ast;

            this.typeCheckAST(tryCatchAST.tryNode, typeCheckContext);
            this.typeCheckAST(tryCatchAST.catchNode, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckTryBlock(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var tryAST = <Try>ast;

            this.typeCheckAST(tryAST.body, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckCatchBlock(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var catchAST = <Catch>ast;

            this.typeCheckAST(catchAST.body, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckFinallyBlock(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var finallyAST = <Finally>ast;

            this.typeCheckAST(finallyAST.body, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckReturnExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var returnAST = <ReturnStatement>ast;

            return this.typeCheckAST(returnAST.returnExpression, typeCheckContext);
        }

        public typeCheckNameExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveNameExpression(<Identifier>ast, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        public typeCheckDottedNameExpression(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            return this.resolver.resolveDottedNameExpression(<BinaryExpression>ast, typeCheckContext.getEnclosingDecl(), this.context).getType();
        }

        public typeCheckSwitchStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var switchAST = <SwitchStatement>ast;

            this.typeCheckAST(switchAST.val, typeCheckContext);
            this.typeCheckAST(switchAST.caseList, typeCheckContext);
            this.typeCheckAST(switchAST.defaultCase, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

        public typeCheckCaseStatement(ast: AST, typeCheckContext: PullTypeCheckContext): PullTypeSymbol {
            var caseAST = <CaseStatement>ast;

            this.typeCheckAST(caseAST.expr, typeCheckContext);
            this.typeCheckAST(caseAST.body, typeCheckContext);

            return this.semanticInfoChain.voidTypeSymbol;
        }

    }
}
