//﻿
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='TypeScript2.ts' />

module TypeScript2.AstWalkerWithDetailCallback {
    export interface AstWalkerDetailCallback {
        EmptyCallback? (pre, ast: AST2): bool;
        EmptyExprCallback? (pre, ast: AST2): bool;
        TrueCallback? (pre, ast: AST2): bool;
        FalseCallback? (pre, ast: AST2): bool;
        ThisCallback? (pre, ast: AST2): bool;
        SuperCallback? (pre, ast: AST2): bool;
        QStringCallback? (pre, ast: AST2): bool;
        RegexCallback? (pre, ast: AST2): bool;
        NullCallback? (pre, ast: AST2): bool;
        ArrayLitCallback? (pre, ast: AST2): bool;
        ObjectLitCallback? (pre, ast: AST2): bool;
        VoidCallback? (pre, ast: AST2): bool;
        CommaCallback? (pre, ast: AST2): bool;
        PosCallback? (pre, ast: AST2): bool;
        NegCallback? (pre, ast: AST2): bool;
        DeleteCallback? (pre, ast: AST2): bool;
        AwaitCallback? (pre, ast: AST2): bool;
        InCallback? (pre, ast: AST2): bool;
        DotCallback? (pre, ast: AST2): bool;
        FromCallback? (pre, ast: AST2): bool;
        IsCallback? (pre, ast: AST2): bool;
        InstOfCallback? (pre, ast: AST2): bool;
        TypeofCallback? (pre, ast: AST2): bool;
        NumberLitCallback? (pre, ast: AST2): bool;
        NameCallback? (pre, identifierAst: Identifier2): bool;
        TypeRefCallback? (pre, ast: AST2): bool;
        IndexCallback? (pre, ast: AST2): bool;
        CallCallback? (pre, ast: AST2): bool;
        NewCallback? (pre, ast: AST2): bool;
        AsgCallback? (pre, ast: AST2): bool;
        AsgAddCallback? (pre, ast: AST2): bool;
        AsgSubCallback? (pre, ast: AST2): bool;
        AsgDivCallback? (pre, ast: AST2): bool;
        AsgMulCallback? (pre, ast: AST2): bool;
        AsgModCallback? (pre, ast: AST2): bool;
        AsgAndCallback? (pre, ast: AST2): bool;
        AsgXorCallback? (pre, ast: AST2): bool;
        AsgOrCallback? (pre, ast: AST2): bool;
        AsgLshCallback? (pre, ast: AST2): bool;
        AsgRshCallback? (pre, ast: AST2): bool;
        AsgRs2Callback? (pre, ast: AST2): bool;
        QMarkCallback? (pre, ast: AST2): bool;
        LogOrCallback? (pre, ast: AST2): bool;
        LogAndCallback? (pre, ast: AST2): bool;
        OrCallback? (pre, ast: AST2): bool;
        XorCallback? (pre, ast: AST2): bool;
        AndCallback? (pre, ast: AST2): bool;
        EqCallback? (pre, ast: AST2): bool;
        NeCallback? (pre, ast: AST2): bool;
        EqvCallback? (pre, ast: AST2): bool;
        NEqvCallback? (pre, ast: AST2): bool;
        LtCallback? (pre, ast: AST2): bool;
        LeCallback? (pre, ast: AST2): bool;
        GtCallback? (pre, ast: AST2): bool;
        GeCallback? (pre, ast: AST2): bool;
        AddCallback? (pre, ast: AST2): bool;
        SubCallback? (pre, ast: AST2): bool;
        MulCallback? (pre, ast: AST2): bool;
        DivCallback? (pre, ast: AST2): bool;
        ModCallback? (pre, ast: AST2): bool;
        LshCallback? (pre, ast: AST2): bool;
        RshCallback? (pre, ast: AST2): bool;
        Rs2Callback? (pre, ast: AST2): bool;
        NotCallback? (pre, ast: AST2): bool;
        LogNotCallback? (pre, ast: AST2): bool;
        IncPreCallback? (pre, ast: AST2): bool;
        DecPreCallback? (pre, ast: AST2): bool;
        IncPostCallback? (pre, ast: AST2): bool;
        DecPostCallback? (pre, ast: AST2): bool;
        TypeAssertionCallback? (pre, ast: AST2): bool;
        FuncDeclCallback? (pre, funcDecl: FuncDecl): bool;
        MemberCallback? (pre, ast: AST2): bool;
        VarDeclCallback? (pre, varDecl: VarDecl): bool;
        ArgDeclCallback? (pre, ast: AST2): bool;
        ReturnCallback? (pre, ast: AST2): bool;
        BreakCallback? (pre, ast: AST2): bool;
        ContinueCallback? (pre, ast: AST2): bool;
        ThrowCallback? (pre, ast: AST2): bool;
        ForCallback? (pre, ast: AST2): bool;
        ForInCallback? (pre, ast: AST2): bool;
        IfCallback? (pre, ast: AST2): bool;
        WhileCallback? (pre, ast: AST2): bool;
        DoWhileCallback? (pre, ast: AST2): bool;
        BlockCallback? (pre, block: Block): bool;
        CaseCallback? (pre, ast: AST2): bool;
        SwitchCallback? (pre, ast: AST2): bool;
        TryCallback? (pre, ast: AST2): bool;
        TryCatchCallback? (pre, ast: AST2): bool;
        TryFinallyCallback? (pre, ast: AST2): bool;
        FinallyCallback? (pre, ast: AST2): bool;
        CatchCallback? (pre, ast: AST2): bool;
        ListCallback? (pre, astList: ASTList2): bool;
        ScriptCallback? (pre, script: Script): bool;
        ClassDeclarationCallback? (pre, ast: AST2): bool;
        InterfaceDeclarationCallback? (pre, interfaceDecl: InterfaceDeclaration): bool;
        ModuleDeclarationCallback? (pre, moduleDecl: ModuleDeclaration): bool;
        ImportDeclarationCallback? (pre, ast: AST2): bool;
        WithCallback? (pre, ast: AST2): bool;
        LabelCallback? (pre, labelAST: AST2): bool;
        LabeledStatementCallback? (pre, ast: AST2): bool;
        EBStartCallback? (pre, ast: AST2): bool;
        GotoEBCallback? (pre, ast: AST2): bool;
        EndCodeCallback? (pre, ast: AST2): bool;
        ErrorCallback? (pre, ast: AST2): bool;
        CommentCallback? (pre, ast: AST2): bool;
        DebuggerCallback? (pre, ast: AST2): bool;
        DefaultCallback? (pre, ast: AST2): bool;
    }

    export function walk(script: Script, callback: AstWalkerDetailCallback): void {
        var pre = (cur: AST2, parent: AST2) => {
            walker.options.goChildren = AstWalkerCallback(true, cur, callback);
            return cur;
        }

        var post = (cur: AST2, parent: AST2) => {
            AstWalkerCallback(false, cur, callback);
            return cur;
        }

        var walker = TypeScript2.getAstWalkerFactory().getWalker(pre, post);
        walker.walk(script, null);
    }

    function AstWalkerCallback(pre: bool, ast: AST2, callback: AstWalkerDetailCallback): bool {
        // See if the Callback needs to be handled using specific one or default one
        var nodeType = ast.nodeType;
        var callbackString = (<any>NodeType)._map[nodeType] + "Callback";
        if (callback[callbackString]) {
            return callback[callbackString](pre, ast);
        }

        if (callback.DefaultCallback) {
            return callback.DefaultCallback(pre, ast);
        }

        return true;
    }
}