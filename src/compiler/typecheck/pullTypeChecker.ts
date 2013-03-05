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
                typeChecker.typeCheckBoundDecl(ast, typeCheckContext);
                break;

            case NodeType.FuncDecl:
                {
                    var functionDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                    typeCheckContext.pushEnclosingDecl(functionDecl);

                    typeChecker.typeCheckFunction(ast, typeCheckContext);

                    go = true;
                }
                break;

            case NodeType.ClassDeclaration:
                {
                    var classDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                    typeCheckContext.pushEnclosingDecl(classDecl);

                    typeChecker.typeCheckClass(ast, typeCheckContext);

                    go = true;
                }
                break;

            case NodeType.InterfaceDeclaration:
                {
                    var interfaceDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                    typeCheckContext.pushEnclosingDecl(interfaceDecl);

                    typeChecker.typeCheckInterface(ast, typeCheckContext);
                }
                break;

            case NodeType.ModuleDeclaration:
                {
                    var moduleDecl = typeCheckContext.semanticInfo.getDeclForAST(ast);
                    typeCheckContext.pushEnclosingDecl(moduleDecl);

                    typeChecker.typeCheckModule(ast, typeCheckContext);

                    go = true;
                }
                break;

            // expressions

            // assignment
            case NodeType.Asg:
                typeChecker.typeCheckAssignment(ast, typeCheckContext);
                break;

            case GenericType:
                typeChecker.typeCheckGenericType(ast, typeCheckContext);
                break;

            case NodeType.ObjectLit:
                typeChecker.typeCheckObjectLiteral(ast, typeCheckContext);
                break;

            case NodeType.ArrayLit:
                typeChecker.typeCheckArrayLiteral(ast, typeCheckContext);
                break;

            case NodeType.This:
                typeChecker.typeCheckThis(ast, typeCheckContext);
                break;

            case NodeType.Super:
                typeChecker.typeCheckSuper(ast, typeCheckContext);
                break;

            case NodeType.Call:
                typeChecker.typeCheckCall(ast, typeCheckContext);
                break;

            case NodeType.New:
                typeChecker.typeCheckNew(ast, typeCheckContext);
                break;

            case NodeType.TypeAssertion:
                typeChecker.typeCheckTypeAssertion(ast, typeCheckContext);
                break;

            case NodeType.TypeRef:
                typeChecker.typeCheckTypeReference(ast, typeCheckContext);
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
                typeChecker.typeCheckLogicalOperation(ast, typeCheckContext);
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
                typeChecker.typeCheckBinaryArithmeticOperation(ast, typeCheckContext);
                break;

            case NodeType.Pos:
            case NodeType.Neg:
            case NodeType.IncPost:
            case NodeType.IncPre:
            case NodeType.DecPost:
            case NodeType.DecPre:
                typeChecker.typeCheckUnaryArithmeticOperation(ast, typeCheckContext);
                break;

            case NodeType.Lsh:
            case NodeType.Rsh:
            case NodeType.Rs2:
            case NodeType.AsgLsh:
            case NodeType.AsgRsh:
            case NodeType.AsgRs2:
                typeChecker.typeCheckBitwiseOperation(ast, typeCheckContext);
                break;

            case NodeType.Index:
                typeChecker.typeCheckIndex(ast, typeCheckContext);
                break;

            case NodeType.LogOr:
            case NodeType.LogAnd:
                typeChecker.typeCheckLogicalAndOrExpression(ast, typeCheckContext);
                break;

            case NodeType.Typeof:
                typeChecker.typeCheckTypeOf(ast, typeCheckContext);
                break;

            default:
                break;
        }

        walker.options.goChildren = go;
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

        constructor(public semanticInfoChain) { }

        public setUnit(unitPath: string) {
            this.resolver = new PullTypeResolver(this.semanticInfoChain, unitPath);
        }

        public getScriptDecl(fileName: string): PullDecl {
            return this.semanticInfoChain.getUnit(fileName).getTopLevelDecls()[0];
        }

        // declarations

        public typeCheckScript(script: Script, scriptName: string, compiler: TypeScriptCompiler) {
            var typeCheckContext = new PullTypeCheckContext(compiler, script, scriptName);

            this.setUnit(scriptName);

            getAstWalkerFactory().walk(script, prePullTypeCheck, postPullTypeCheck, null, typeCheckContext);
        }

        public typeCheckBoundDecl(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        public typeCheckFunction(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        public typeCheckClass(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        public typeCheckInterface(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        public typeCheckModule(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        // expressions

        public typeCheckAssignment(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            var assignmentAST = <BinaryExpression>ast;

            var enclosingDecl = typeCheckContext.getEnclosingDecl();

            var leftType = this.resolver.resolveAST(assignmentAST.operand1, false, enclosingDecl, this.context).getType();
            var rightType = this.resolver.resolveAST(assignmentAST.operand2, false, enclosingDecl, this.context).getType();

            var comparisonInfo = new TypeComparisonInfo();

            var isAssignable = this.resolver.sourceIsAssignableToTarget(rightType, leftType, this.context, comparisonInfo);

            if (!isAssignable) {
                var errorMessage = comparisonInfo.message;
                var span = enclosingDecl.getSpan();

                // ignore comparison info for now
                var message = getDiagnosticMessage(DiagnosticMessages.incompatibleTypes_2, [rightType.getName(), leftType.getName()]);

                this.context.postError(assignmentAST.operand1.minChar - span.minChar, span.limChar - span.minChar, typeCheckContext.scriptName, message, enclosingDecl);
            }

            return ast;
        }

        public typeCheckGenericType(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            this.resolver.resolveAST(ast, false, typeCheckContext.getEnclosingDecl(), this.context)
            return ast;
        }

        public typeCheckObjectLiteral(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckArrayLiteral(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckThis(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckSuper(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckCall(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckNew(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckTypeAssertion(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckLogicalOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckLogicalAndOrExpression(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckBinaryArithmeticOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckUnaryArithmeticOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckBitwiseOperation(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckIndex(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckTypeOf(ast: AST, context: PullTypeCheckContext): AST {
            return ast;
        }

        public typeCheckTypeReference(ast: AST, typeCheckContext: PullTypeCheckContext): AST {
            return ast;
        }

    }

}
