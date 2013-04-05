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

///<reference path='typescript.ts' />

module TypeScript {
    export interface IASTSpan {
        minChar: number;
        limChar: number;
    }

    export class ASTSpan implements IASTSpan {
        public minChar: number = -1;  // -1 = "undefined" or "compiler generated"
        public limChar: number = -1;  // -1 = "undefined" or "compiler generated"   
    }

    export var astID = 0;

    export function structuralEqualsNotIncludingPosition(ast1: AST, ast2: AST): bool {
        return structuralEquals(ast1, ast2, false);
    }

    export function structuralEqualsIncludingPosition(ast1: AST, ast2: AST): bool {
        return structuralEquals(ast1, ast2, true);
    }

    function structuralEquals(ast1: AST, ast2: AST, includingPosition: bool): bool {
        if (ast1 === ast2) {
            return true;
        }

        return ast1 !== null && ast2 !== null &&
               ast1.nodeType === ast2.nodeType &&
               ast1.structuralEquals(ast2, includingPosition);
    }

    function astArrayStructuralEquals(array1: AST[], array2: AST[], includingPosition): bool {
        return ArrayUtilities.sequenceEquals(array1, array2,
            includingPosition ? structuralEqualsIncludingPosition : structuralEqualsNotIncludingPosition);
    }

    export class AST implements IASTSpan {
        public minChar: number = -1;  // -1 = "undefined" or "compiler generated"
        public limChar: number = -1;  // -1 = "undefined" or "compiler generated"   

        public type: Type = null;
        private _flags = ASTFlags.None;

        public typeCheckPhase = -1;

        private astID = astID++;

        // REVIEW: for diagnostic purposes
        public passCreated: number = CompilerDiagnostics.analysisPass;

        public preComments: Comment[] = null;
        public postComments: Comment[] = null;
        private docComments: Comment[] = null;

        constructor(public nodeType: NodeType) {
        }

        public getFlags(): ASTFlags {
            return this._flags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setFlags(flags: ASTFlags): void {
            this._flags = flags;
        }

        public getLength() { return this.limChar - this.minChar; }

        public getID() { return this.astID; }

        public isDeclaration() { return false; }

        public isStatement() {
            return false;
        }

        public typeCheck(typeFlow: TypeFlow) {
            switch (this.nodeType) {
                case NodeType.OmittedExpression:
                    this.type = typeFlow.anyType;
                    break;
                case NodeType.ThisExpression:
                    return typeFlow.typeCheckThis(this);
                case NodeType.NullLiteral:
                    this.type = typeFlow.nullType;
                    break;
                case NodeType.FalseLiteral:
                case NodeType.TrueLiteral:
                    this.type = typeFlow.booleanType;
                    break;
                case NodeType.SuperExpression:
                    return typeFlow.typeCheckSuper(this);
                case NodeType.EmptyStatement:
                case NodeType.VoidExpression:
                    this.type = typeFlow.voidType;
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
            return this;
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            switch (this.nodeType) {
                case NodeType.OmittedExpression:
                    break;
                case NodeType.VoidExpression:
                    emitter.recordSourceMappingStart(this);
                    emitter.writeToOutput("void ");
                    emitter.recordSourceMappingEnd(this);
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
            emitter.emitComments(this, false);
        }

        public print(context: PrintContext) {
            context.startLine();
            context.writeLine(this.printLabel());
        }

        public printLabel() {
            return "";
            /*
            if (nodeTypeTable[this.nodeType] !== undefined) {
                return nodeTypeTable[this.nodeType];
            }
            else {
                return (<any>NodeType)._map[this.nodeType];
            }
            */
        }

        public addToControlFlow(context: ControlFlowContext): void {
            // by default, AST adds itself to current basic block and does not check its children
            context.walker.options.goChildren = false;
            context.addContent(this);
        }

        public treeViewLabel(): string {
            return (<any>NodeType)._map[this.nodeType];
        }

        public getDocComments(): Comment[] {
            if (!this.isDeclaration() || !this.preComments || this.preComments.length === 0) {
                return [];
            }

            if (!this.docComments) {
                var preCommentsLength = this.preComments.length;
                var docComments: Comment[] = [];
                for (var i = preCommentsLength - 1; i >= 0; i--) {
                    if (this.preComments[i].isDocComment()) {
                        var prevDocComment = docComments.length > 0 ? docComments[docComments.length - 1] : null;
                        if (prevDocComment === null || // If the help comments were not yet set then this is the comment
                             (this.preComments[i].limLine === prevDocComment.minLine ||
                              this.preComments[i].limLine + 1 === prevDocComment.minLine)) { // On same line or next line
                            docComments.push(this.preComments[i]);
                            continue;
                        }
                    }
                    break;
                }

                this.docComments = docComments.reverse();
            }

            return this.docComments;
        }

        public structuralEquals(ast: AST, includingPosition: bool): bool {
            if (includingPosition) {
                if (this.minChar !== ast.minChar || this.limChar !== ast.limChar) {
                    return false;
                }
            }

            return this._flags === ast._flags &&
                   astArrayStructuralEquals(this.preComments, ast.preComments, includingPosition) &&
                   astArrayStructuralEquals(this.postComments, ast.postComments, includingPosition)
        }
    }

    export class ASTList extends AST {
        // public enclosingScope: SymbolScope = null;
        public members: AST[] = [];

        constructor() {
            super(NodeType.List);
        }

        public addToControlFlow(context: ControlFlowContext) {
            var len = this.members.length;
            for (var i = 0; i < len; i++) {
                if (context.noContinuation) {
                    context.addUnreachable(this.members[i]);
                    break;
                }
                else {
                    this.members[i] = context.walk(this.members[i], this);
                }
            }
            context.walker.options.goChildren = false;
        }

        public append(ast: AST) {
            this.members[this.members.length] = ast;
            return this;
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.recordSourceMappingStart(this);
            emitter.emitJavascriptList(this, null, SyntaxKind.SemicolonToken, startLine, false, false);
            emitter.recordSourceMappingEnd(this);
        }

        public typeCheck(typeFlow: TypeFlow) {
            var len = this.members.length;
            typeFlow.nestingLevel++;
            for (var i = 0; i < len; i++) {
                if (this.members[i]) {
                    this.members[i] = this.members[i].typeCheck(typeFlow);
                }
            }
            typeFlow.nestingLevel--;
            return this;
        }

        public structuralEquals(ast: ASTList, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   astArrayStructuralEquals(this.members, ast.members, includingPosition);
        }
    }

    export class Identifier extends AST {
        public sym: Symbol = null;
        public text: string;

        // 'actualText' is the text that the user has entered for the identifier. the text might 
        // include any Unicode escape sequences (e.g.: \u0041 for 'A'). 'text', however, contains 
        // the resolved value of any escape sequences in the actual text; so in the previous 
        // example, actualText = '\u0041', text = 'A'.
        //
        // For purposes of finding a symbol, use text, as this will allow you to match all 
        // variations of the variable text. For full-fidelity translation of the user input, such
        // as emitting, use the actualText field.
        // 
        // Note: 
        //    To change text, and to avoid running into a situation where 'actualText' does not 
        //    match 'text', always use setText.
        constructor(public actualText: string) {
            super(NodeType.Name);
            this.setText(actualText);
        }

        public setText(actualText: string) {
            this.actualText = actualText;
            this.text = actualText;
        }

        public isMissing() { return false; }

        public treeViewLabel() {
            return "id: " + this.actualText;
        }

        public printLabel() {
            if (this.actualText) {
                return "id: " + this.actualText;
            }
            else {
                return "name node";
            }
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckName(this);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitJavascriptName(this, true);
        }

        public structuralEquals(ast: Identifier, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.text === ast.text &&
                   this.actualText === ast.actualText &&
                   this.isMissing() === ast.isMissing();
        }
    }

    export class MissingIdentifier extends Identifier {
        constructor() {
            super("__missing");
        }

        public isMissing() {
            return true;
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            // Emit nothing for a missing ID
        }
    }

    export class Expression extends AST {
        constructor(nodeType: NodeType) {
            super(nodeType);
        }
    }

    export class LiteralExpression extends Expression {
        constructor(nodeType: NodeType) {
            super(nodeType);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            switch (this.nodeType) {
                case NodeType.NullLiteral:
                    emitter.recordSourceMappingStart(this);
                    emitter.writeToOutput("null");
                    emitter.recordSourceMappingEnd(this);
                    break;
                case NodeType.FalseLiteral:
                    emitter.recordSourceMappingStart(this);
                    emitter.writeToOutput("false");
                    emitter.recordSourceMappingEnd(this);
                    break;
                case NodeType.TrueLiteral:
                    emitter.recordSourceMappingStart(this);
                    emitter.writeToOutput("true");
                    emitter.recordSourceMappingEnd(this);
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class ThisExpression extends Expression {
        constructor() {
            super(NodeType.ThisExpression);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            if (emitter.thisFnc && (hasFlag(emitter.thisFnc.getFunctionFlags(), FunctionFlags.IsFatArrowFunction))) {
                emitter.writeToOutput("_this");
            }
            else {
                emitter.writeToOutput("this");
            }
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class SuperExpression extends Expression {
        constructor() {
            super(NodeType.SuperExpression);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.emitSuperReference();
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class ParenthesizedExpression extends Expression {
        constructor(public expression: AST) {
            super(NodeType.ParenthesizedExpression);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.writeToOutput("(");
            emitter.recordSourceMappingStart(this);
            emitter.emitJavascript(this.expression, SyntaxKind.CloseParenToken, false);
            emitter.recordSourceMappingEnd(this);
            emitter.writeToOutput(")");
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: ParenthesizedExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expression, ast.expression, includingPosition);
        }
    }

    export class UnaryExpression extends Expression {
        public targetType: Type = null; // Target type for an object literal (null if no target type)
        public castTerm: AST = null;

        constructor(nodeType: NodeType, public operand: AST) {
            super(nodeType);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            super.addToControlFlow(context);
            // TODO: add successor as catch block/finally block if present
            if (this.nodeType === NodeType.ThrowStatement) {
                context.returnStmt();
            }
        }

        public typeCheck(typeFlow: TypeFlow) {
            switch (this.nodeType) {
                case NodeType.BitwiseNotExpression:
                    return typeFlow.typeCheckBitNot(this);

                case NodeType.LogicalNotExpression:
                    return typeFlow.typeCheckLogNot(this);

                case NodeType.PlusExpression:
                case NodeType.NegateExpression:
                    return typeFlow.typeCheckUnaryNumberOperator(this);

                case NodeType.PostIncrementExpression:
                case NodeType.PreIncrementExpression:
                case NodeType.PostDecrementExpression:
                case NodeType.PreDecrementExpression:
                    return typeFlow.typeCheckIncOrDec(this);

                case NodeType.ArrayLiteralExpression:
                    typeFlow.typeCheckArrayLit(this);
                    return this;

                case NodeType.ObjectLiteralExpression:
                    typeFlow.typeCheckObjectLit(this);
                    return this;

                case NodeType.ThrowStatement:
                    this.operand = typeFlow.typeCheck(this.operand);
                    this.type = typeFlow.voidType;
                    return this;

                case NodeType.TypeOfExpression:
                    this.operand = typeFlow.typeCheck(this.operand);
                    this.type = typeFlow.stringType;
                    return this;

                case NodeType.DeleteExpression:
                    this.operand = typeFlow.typeCheck(this.operand);
                    this.type = typeFlow.booleanType;
                    break;

                case NodeType.CastExpression:
                    this.castTerm = typeFlow.typeCheck(this.castTerm);
                    var applyTargetType = this.operand.nodeType !== NodeType.ParenthesizedExpression;

                    var targetType = applyTargetType ? this.castTerm.type : null;

                    typeFlow.checker.typeCheckWithContextualType(targetType, typeFlow.checker.inProvisionalTypecheckMode(), true, this.operand);
                    typeFlow.castWithCoercion(this.operand, this.castTerm.type, false, true);
                    this.type = this.castTerm.type;
                    return this;

                case NodeType.VoidExpression:
                    // REVIEW - Although this is good to do for completeness's sake,
                    // this shouldn't be strictly necessary from the void operator's
                    // point of view
                    this.operand = typeFlow.typeCheck(this.operand);
                    this.type = typeFlow.checker.undefinedType;
                    break;

                default:
                    throw new Error("please implement in derived class");
            }
            return this;
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            switch (this.nodeType) {
                case NodeType.PostIncrementExpression:
                    emitter.emitJavascript(this.operand, SyntaxKind.PlusPlusToken, false);
                    emitter.writeToOutput("++");
                    break;
                case NodeType.LogicalNotExpression:
                    emitter.writeToOutput("!");
                    emitter.emitJavascript(this.operand, SyntaxKind.ExclamationToken, false);
                    break;
                case NodeType.PostDecrementExpression:
                    emitter.emitJavascript(this.operand, SyntaxKind.MinusMinusToken, false);
                    emitter.writeToOutput("--");
                    break;
                case NodeType.ObjectLiteralExpression:
                    emitter.emitObjectLiteral(<ASTList>this.operand);
                    break;
                case NodeType.ArrayLiteralExpression:
                    emitter.emitArrayLiteral(<ASTList>this.operand);
                    break;
                case NodeType.BitwiseNotExpression:
                    emitter.writeToOutput("~");
                    emitter.emitJavascript(this.operand, SyntaxKind.TildeToken, false);
                    break;
                case NodeType.NegateExpression:
                    emitter.writeToOutput("-");
                    if (this.operand.nodeType === NodeType.NegateExpression || this.operand.nodeType === NodeType.PreDecrementExpression) {
                        emitter.writeToOutput(" ");
                    }
                    emitter.emitJavascript(this.operand, SyntaxKind.MinusToken, false);
                    break;
                case NodeType.PlusExpression:
                    emitter.writeToOutput("+");
                    if (this.operand.nodeType === NodeType.PlusExpression || this.operand.nodeType === NodeType.PreIncrementExpression) {
                        emitter.writeToOutput(" ");
                    }
                    emitter.emitJavascript(this.operand, SyntaxKind.PlusToken, false);
                    break;
                case NodeType.PreIncrementExpression:
                    emitter.writeToOutput("++");
                    emitter.emitJavascript(this.operand, SyntaxKind.PlusPlusToken, false);
                    break;
                case NodeType.PreDecrementExpression:
                    emitter.writeToOutput("--");
                    emitter.emitJavascript(this.operand, SyntaxKind.MinusMinusToken, false);
                    break;
                case NodeType.ThrowStatement:
                    emitter.writeToOutput("throw ");
                    emitter.emitJavascript(this.operand, SyntaxKind.TildeToken, false);
                    emitter.writeToOutput(";");
                    break;
                case NodeType.TypeOfExpression:
                    emitter.writeToOutput("typeof ");
                    emitter.emitJavascript(this.operand, SyntaxKind.TildeToken, false);
                    break;
                case NodeType.DeleteExpression:
                    emitter.writeToOutput("delete ");
                    emitter.emitJavascript(this.operand, SyntaxKind.TildeToken, false);
                    break;
                case NodeType.VoidExpression:
                    emitter.writeToOutput("void ");
                    emitter.emitJavascript(this.operand, SyntaxKind.TildeToken, false);
                    break;
                case NodeType.CastExpression:
                    emitter.emitJavascript(this.operand, SyntaxKind.TildeToken, false);
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: UnaryExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.castTerm, ast.castTerm, includingPosition) &&
                   structuralEquals(this.operand, ast.operand, includingPosition);
        }
    }

    export class CallExpression extends Expression {
        constructor(nodeType: NodeType,
                    public target: AST,
                    public typeArguments: ASTList,
                    public arguments: ASTList) {
            super(nodeType);
        }

        public signature: Signature = null;

        public typeCheck(typeFlow: TypeFlow) {
            if (this.nodeType === NodeType.ObjectCreationExpression) {
                return typeFlow.typeCheckNew(this);
            }
            else {
                return typeFlow.typeCheckCall(this);
            }
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);

            if (this.nodeType === NodeType.ObjectCreationExpression) {
                emitter.emitNew(this.target, this.arguments);
            }
            else {
                emitter.emitCall(this, this.target, this.arguments);
            }

            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: CallExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.target, ast.target, includingPosition) &&
                   structuralEquals(this.typeArguments, ast.typeArguments, includingPosition) &&
                   structuralEquals(this.arguments, ast.arguments, includingPosition);
        }
    }

    export class BinaryExpression extends Expression {
        constructor(nodeType: NodeType,
                    public operand1: AST,
                    public operand2: AST) {
            super(nodeType);
        }

        public typeCheck(typeFlow: TypeFlow) {
            switch (this.nodeType) {
                case NodeType.MemberAccessExpression:
                    return typeFlow.typeCheckDotOperator(this);
                case NodeType.AssignmentExpression:
                    return typeFlow.typeCheckAsgOperator(this);
                case NodeType.AddExpression:
                case NodeType.SubtractExpression:
                case NodeType.MultiplyExpression:
                case NodeType.DivideExpression:
                case NodeType.ModuloExpression:
                case NodeType.BitwiseOrExpression:
                case NodeType.BitwiseAndExpression:
                    return typeFlow.typeCheckArithmeticOperator(this, false);
                case NodeType.BitwiseExclusiveOrExpression:
                    return typeFlow.typeCheckBitwiseOperator(this, false);
                case NodeType.NotEqualsWithTypeConversionExpression:
                case NodeType.EqualsWithTypeConversionExpression:
                    /*
                    var text: string;
                    if (typeFlow.checker.styleSettings.eqeqeq) {
                        text = nodeTypeTable[this.nodeType];
                        typeFlow.checker.errorReporter.styleError(this, "use of " + text);
                    }
                    else if (typeFlow.checker.styleSettings.eqnull) {
                        text = nodeTypeTable[this.nodeType];
                        if ((this.operand2 !== null) && (this.operand2.nodeType === NodeType.Null)) {
                            typeFlow.checker.errorReporter.styleError(this, "use of " + text + " to compare with null");
                        }
                    }
                    */
                case NodeType.EqualsExpression:
                case NodeType.NotEqualsExpression:
                case NodeType.LessThanExpression:
                case NodeType.LessThanOrEqualExpression:
                case NodeType.GreaterThanOrEqualExpression:
                case NodeType.GreaterThanExpression:
                    return typeFlow.typeCheckBooleanOperator(this);
                case NodeType.ElementAccessExpression:
                    return typeFlow.typeCheckIndex(this);
                case NodeType.Member:
                    this.type = typeFlow.voidType;
                    return this;
                case NodeType.LogicalOrExpression:
                    return typeFlow.typeCheckLogOr(this);
                case NodeType.LogicalAndExpression:
                    return typeFlow.typeCheckLogAnd(this);
                case NodeType.AddAssignmentExpression:
                case NodeType.SubtractAssignmentExpression:
                case NodeType.MultiplyAssignmentExpression:
                case NodeType.DivideAssignmentExpression:
                case NodeType.ModuloAssignmentExpression:
                case NodeType.OrAssignmentExpression:
                case NodeType.AndAssignmentExpression:
                    return typeFlow.typeCheckArithmeticOperator(this, true);
                case NodeType.ExclusiveOrAssignmentExpression:
                    return typeFlow.typeCheckBitwiseOperator(this, true);
                case NodeType.LeftShiftExpression:
                case NodeType.SignedRightShiftExpression:
                case NodeType.UnsignedRightShiftExpression:
                    return typeFlow.typeCheckShift(this, false);
                case NodeType.LeftShiftAssignmentExpression:
                case NodeType.SignedRightShiftAssignmentExpression:
                case NodeType.UnsignedRightShiftAssignmentExpression:
                    return typeFlow.typeCheckShift(this, true);
                case NodeType.CommaExpression:
                    return typeFlow.typeCheckCommaOperator(this);
                case NodeType.InstanceOfExpression:
                    return typeFlow.typeCheckInstOf(this);
                case NodeType.InExpression:
                    return typeFlow.typeCheckInOperator(this);
                    break;
                default:
                    throw new Error("please implement in derived class");
            }
            return this;
        }

        private static getTextForBinaryToken(nodeType: NodeType): string {
            switch (nodeType) {
                case NodeType.CommaExpression: return ",";
                case NodeType.AssignmentExpression: return "=";
                case NodeType.AddAssignmentExpression: return "+=";
                case NodeType.SubtractAssignmentExpression: return "-=";
                case NodeType.MultiplyAssignmentExpression: return "*=";
                case NodeType.DivideAssignmentExpression: return "/=";
                case NodeType.ModuloAssignmentExpression: return "%=";
                case NodeType.AndAssignmentExpression: return "&=";
                case NodeType.ExclusiveOrAssignmentExpression: return "^=";
                case NodeType.OrAssignmentExpression: return "|=";
                case NodeType.LeftShiftAssignmentExpression: return "<<=";
                case NodeType.SignedRightShiftAssignmentExpression: return ">>=";
                case NodeType.UnsignedRightShiftAssignmentExpression: return ">>>=";
                case NodeType.LogicalOrExpression: return "||";
                case NodeType.LogicalAndExpression: return "&&";
                case NodeType.BitwiseOrExpression: return "|";
                case NodeType.BitwiseExclusiveOrExpression: return "^";
                case NodeType.BitwiseAndExpression: return "&";
                case NodeType.EqualsWithTypeConversionExpression: return "==";
                case NodeType.NotEqualsWithTypeConversionExpression: return "!=";
                case NodeType.EqualsExpression: return "===";
                case NodeType.NotEqualsExpression: return "!==";
                case NodeType.LessThanExpression: return "<";
                case NodeType.GreaterThanExpression: return ">";
                case NodeType.LessThanOrEqualExpression: return "<="
                case NodeType.GreaterThanOrEqualExpression: return ">="
                case NodeType.InstanceOfExpression: return "instanceof";
                case NodeType.InExpression: return "in";
                case NodeType.LeftShiftExpression: return "<<";
                case NodeType.SignedRightShiftExpression: return ">>"
                case NodeType.UnsignedRightShiftExpression: return ">>>"
                case NodeType.MultiplyExpression: return "*"
                case NodeType.DivideExpression: return "/"
                case NodeType.ModuloExpression: return "%"
                case NodeType.AddExpression: return "+"
                case NodeType.SubtractExpression: return "-";
            }

            throw Errors.invalidOperation();
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);

            switch (this.nodeType) {
                case NodeType.MemberAccessExpression:
                    if (!emitter.tryEmitConstant(this)) {
                        emitter.emitJavascript(this.operand1, SyntaxKind.DotToken, false);
                        emitter.writeToOutput(".");
                        emitter.emitJavascriptName(<Identifier>this.operand2, false);
                    }
                    break;
                case NodeType.ElementAccessExpression:
                    emitter.emitIndex(this.operand1, this.operand2);
                    break;

                case NodeType.Member:
                    if (this.operand2.nodeType === NodeType.FunctionDeclaration && (<FunctionDeclaration>this.operand2).isAccessor()) {
                        var funcDecl = <FunctionDeclaration>this.operand2;
                        if (hasFlag(funcDecl.getFunctionFlags(), FunctionFlags.GetAccessor)) {
                            emitter.writeToOutput("get ");
                        }
                        else {
                            emitter.writeToOutput("set ");
                        }
                        emitter.emitJavascript(this.operand1, SyntaxKind.ColonToken, false);
                    }
                    else {
                        emitter.emitJavascript(this.operand1, SyntaxKind.ColonToken, false);
                        emitter.writeToOutputTrimmable(": ");
                    }
                    emitter.emitJavascript(this.operand2, SyntaxKind.CommaToken, false);
                    break;
                case NodeType.CommaExpression:
                    emitter.emitJavascript(this.operand1, SyntaxKind.CommaToken, false);
                    if (emitter.emitState.inObjectLiteral) {
                        emitter.writeLineToOutput(", ");
                    }
                    else {
                        emitter.writeToOutput(", ");
                    }
                    emitter.emitJavascript(this.operand2, SyntaxKind.CommaToken, false);
                    break;
                default:
                    {
                        emitter.emitJavascript(this.operand1, SyntaxKind.DotToken, false);
                        var binOp = BinaryExpression.getTextForBinaryToken(this.nodeType);
                        if (binOp === "instanceof") {
                            emitter.writeToOutput(" instanceof ");
                        }
                        else if (binOp === "in") {
                            emitter.writeToOutput(" in ");
                        }
                        else {
                            emitter.writeToOutputTrimmable(" " + binOp + " ");
                        }

                        emitter.emitJavascript(this.operand2, SyntaxKind.DotToken, false);
                    }
            }

            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: BinaryExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.operand1, ast.operand1, includingPosition) &&
                   structuralEquals(this.operand2, ast.operand2, includingPosition);
        }
    }

    export class ConditionalExpression extends Expression {
        constructor(public operand1: AST,
                    public operand2: AST,
                    public operand3: AST) {
            super(NodeType.ConditionalExpression);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckQMark(this);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.emitJavascript(this.operand1, SyntaxKind.QuestionToken, false);
            emitter.writeToOutput(" ? ");
            emitter.emitJavascript(this.operand2, SyntaxKind.QuestionToken, false);
            emitter.writeToOutput(" : ");
            emitter.emitJavascript(this.operand3, SyntaxKind.QuestionToken, false);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: ConditionalExpression, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.operand1, ast.operand1, includingPosition) &&
                   structuralEquals(this.operand2, ast.operand2, includingPosition) &&
                   structuralEquals(this.operand3, ast.operand3, includingPosition);
        }
    }

    export class NumberLiteral extends Expression {
        constructor(public value: number, public text: string) {
            super(NodeType.NumericLiteral);
        }

        public typeCheck(typeFlow: TypeFlow) {
            this.type = typeFlow.doubleType;
            return this;
        }

        public treeViewLabel() {
            return "num: " + this.printLabel();
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput(this.text);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public printLabel(): string {
            return this.text;
        }

        public structuralEquals(ast: NumberLiteral, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.value === ast.value &&
                   this.text === ast.text;
        }
    }

    export class RegexLiteral extends Expression {
        constructor(public text: string) {
            super(NodeType.RegularExpressionLiteral);
        }

        public typeCheck(typeFlow: TypeFlow) {
            this.type = typeFlow.regexType;
            return this;
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput(this.text);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: RegexLiteral, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.text === ast.text;
        }
    }

    export class StringLiteral extends Expression {
        constructor(public text: string) {
            super(NodeType.StringLiteral);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.emitStringLiteral(this.text);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            this.type = typeFlow.stringType;
            return this;
        }

        public treeViewLabel() {
            return "st: " + this.text;
        }

        public printLabel() {
            return this.text;
        }

        public structuralEquals(ast: StringLiteral, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.text === ast.text;
        }
    }

    export class ImportDeclaration extends AST {
        public isDynamicImport = false;

        constructor(public id: Identifier, public alias: AST) {
            super(NodeType.ImportDeclaration);
        }

        public isDeclaration() { return true; }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            // REVIEW: Only modules may be aliased for now, though there's no real
            // restriction on what the type symbol may be
            if (emitter.importStatementShouldBeEmitted(this)) {
                var prevModAliasId = emitter.modAliasId;
                var prevFirstModAlias = emitter.firstModAlias;

                emitter.recordSourceMappingStart(this);
                emitter.emitComments(this, true);
                emitter.writeToOutput("var " + this.id.actualText + " = ");
                emitter.modAliasId = this.id.actualText;
                emitter.firstModAlias = this.firstAliasedModToString();
                var aliasAST = this.alias.nodeType == NodeType.TypeRef ? (<TypeReference>this.alias).term : this.alias;

                emitter.emitJavascript(aliasAST, SyntaxKind.TildeToken, false);
                // the dynamic import case will insert the semi-colon automatically
                if (!this.isDynamicImport) {
                    emitter.writeToOutput(";");
                }
                emitter.emitComments(this, false);
                emitter.recordSourceMappingEnd(this);

                emitter.modAliasId = prevModAliasId;
                emitter.firstModAlias = prevFirstModAlias;
            }
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckImportDecl(this);
        }

        public getAliasName(aliasAST: AST = this.alias): string {
            if (aliasAST.nodeType === NodeType.Name) {
                return (<Identifier>aliasAST).actualText;
            } else {
                var dotExpr = <BinaryExpression>aliasAST;
                return this.getAliasName(dotExpr.operand1) + "." + this.getAliasName(dotExpr.operand2);
            }
        }

        public firstAliasedModToString() {
            if (this.alias.nodeType === NodeType.Name) {
                return (<Identifier>this.alias).actualText;
            }
            else {
                var dotExpr = <TypeReference>this.alias;
                var firstMod = <Identifier>(<BinaryExpression>dotExpr.term).operand1;
                return firstMod.actualText;
            }
        }

        public structuralEquals(ast: ImportDeclaration, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.id, ast.id, includingPosition) &&
                   structuralEquals(this.alias, ast.alias, includingPosition);
        }
    }

    export class ExportAssignment extends AST {
        constructor(public id: Identifier) {
            super(NodeType.ExportAssignment);
        }

        public structuralEquals(ast: ExportAssignment, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.id, ast.id, includingPosition);
        }
    }

    export class BoundDecl extends AST {
        public init: AST = null;
        public typeExpr: AST = null;
        private _varFlags = VariableFlags.None;
        public sym: Symbol = null;
        public isDeclaration() { return true; }

        constructor(public id: Identifier, nodeType: NodeType) {
            super(nodeType);
        }

        public getVarFlags(): VariableFlags {
            return this._varFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setVarFlags(flags: VariableFlags): void {
            this._varFlags = flags;
        }

        public isProperty() { return hasFlag(this.getVarFlags(), VariableFlags.Property); }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckBoundDecl(this);
        }

        public printLabel() {
            return this.treeViewLabel();
        }

        public structuralEquals(ast: BoundDecl, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this._varFlags === ast._varFlags &&
                   structuralEquals(this.init, ast.init, includingPosition) &&
                   structuralEquals(this.typeExpr, ast.typeExpr, includingPosition) &&
                   structuralEquals(this.id, ast.id, includingPosition);
        }
    }

    export class VariableDeclarator extends BoundDecl {
        constructor(id: Identifier) {
            super(id, NodeType.VariableDeclarator);
        }

        public isExported() { return hasFlag(this.getVarFlags(), VariableFlags.Exported); }

        public isStatic() { return hasFlag(this.getVarFlags(), VariableFlags.Static); }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitJavascriptVariableDeclarator(this, tokenId);
        }

        public treeViewLabel() {
            return "var " + this.id.actualText;
        }
    }

    export class Parameter extends BoundDecl {
        constructor(id: Identifier) {
            super(id, NodeType.Parameter);
        }

        public isOptional = false;

        public isOptionalArg() { return this.isOptional || this.init; }

        public treeViewLabel() {
            return "arg: " + this.id.actualText;
        }

        public parameterPropertySym: FieldSymbol = null;

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput(this.id.actualText);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: Parameter, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.isOptional === ast.isOptional;
        }
    }

    export class FunctionDeclaration extends AST {
        public hint: string = null;
        private _functionFlags = FunctionFlags.None;
        public returnTypeAnnotation: AST = null;
        public symbols: IHashTable;
        public variableArgList = false;
        public signature: Signature;
        public freeVariables: Symbol[] = [];
        public classDecl: NamedDeclaration = null;

        public accessorSymbol: Symbol = null;
        public returnStatementsWithExpressions: ReturnStatement[];
        public scopeType: Type = null; // Type of the FuncDecl, before target typing
        public endingToken: ASTSpan = null;
        public isDeclaration() { return true; }

        constructor(public name: Identifier,
                    public block: Block,
                    public isConstructor: bool,
                    public typeArguments: ASTList,
                    public arguments: ASTList,
                    nodeType: number) {

            super(nodeType);
        }

        public getFunctionFlags(): FunctionFlags {
            return this._functionFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setFunctionFlags(flags: FunctionFlags): void {
            this._functionFlags = flags;
        }

        public structuralEquals(ast: FunctionDeclaration, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this._functionFlags === ast._functionFlags &&
                   this.hint === ast.hint &&
                   this.variableArgList === ast.variableArgList &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.block, ast.block, includingPosition) &&
                   this.isConstructor === ast.isConstructor &&
                   structuralEquals(this.typeArguments, ast.typeArguments, includingPosition) &&
                   structuralEquals(this.arguments, ast.arguments, includingPosition);
        }

        public buildControlFlow(): ControlFlowContext {
            var entry = new BasicBlock();
            var exit = new BasicBlock();

            var context = new ControlFlowContext(entry, exit);

            var controlFlowPrefix = (ast: AST, parent: AST, walker: IAstWalker) => {
                ast.addToControlFlow(walker.state);
                return ast;
            }

            var walker = getAstWalkerFactory().getWalker(controlFlowPrefix, null, null, context);
            context.walker = walker;
            walker.walk(this.block, this);

            return context;
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckFunction(this);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitJavascriptFunction(this);
        }

        public getNameText() {
            if (this.name) {
                return this.name.actualText;
            }
            else {
                return this.hint;
            }
        }

        public isMethod() {
            return (this.getFunctionFlags() & FunctionFlags.Method) != FunctionFlags.None;
        }

        public isCallMember() { return hasFlag(this.getFunctionFlags(), FunctionFlags.CallMember); }
        public isConstructMember() { return hasFlag(this.getFunctionFlags(), FunctionFlags.ConstructMember); }
        public isIndexerMember() { return hasFlag(this.getFunctionFlags(), FunctionFlags.IndexerMember); }
        public isSpecialFn() { return this.isCallMember() || this.isIndexerMember() || this.isConstructMember(); }
        public isAccessor() { return hasFlag(this.getFunctionFlags(), FunctionFlags.GetAccessor) || hasFlag(this.getFunctionFlags(), FunctionFlags.SetAccessor); }
        public isGetAccessor() { return hasFlag(this.getFunctionFlags(), FunctionFlags.GetAccessor); }
        public isSetAccessor() { return hasFlag(this.getFunctionFlags(), FunctionFlags.SetAccessor); }
        public isStatic() { return hasFlag(this.getFunctionFlags(), FunctionFlags.Static); }

        public treeViewLabel() {
            if (this.name === null) {
                return "funcExpr";
            }
            else {
                return "func: " + this.name.actualText
            }
        }

        public isSignature() { return (this.getFunctionFlags() & FunctionFlags.Signature) != FunctionFlags.None; }
    }

    export class LocationInfo {
        constructor(public fileName: string,
                    public lineMap: LineMap) {
        }
    }

    export var unknownLocationInfo = new LocationInfo("unknown", null);

    export class Script extends AST {
        public moduleElements: ASTList = null;
        public locationInfo: LocationInfo = null;
        public referencedFiles: IFileReference[] = [];
        public requiresExtendsBlock = false;
        public isDeclareFile = false;
        public topLevelMod: ModuleDeclaration = null;
        // Remember if the script contains Unicode chars, that is needed when generating code for this script object to decide the output file correct encoding.
        public containsUnicodeChar = false;
        public containsUnicodeCharInComment = false;
        public cachedEmitRequired: bool;

        private setCachedEmitRequired(value: bool) {
            this.cachedEmitRequired = value;
            return this.cachedEmitRequired;
        }

        constructor() {
            super(NodeType.Script);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckScript(this);
        }

        public treeViewLabel() {
            return "Script";
        }

        public emitRequired(emitOptions: EmitOptions) {
            if (this.cachedEmitRequired != undefined) {
                return this.cachedEmitRequired;
            }

            if (!this.isDeclareFile && this.moduleElements) {
                if (this.moduleElements.members.length === 0) {
                    // allow empty files that are not declare files 
                    return this.setCachedEmitRequired(true);
                }

                for (var i = 0, len = this.moduleElements.members.length; i < len; i++) {
                    var stmt = this.moduleElements.members[i];
                    if (stmt.nodeType === NodeType.ModuleDeclaration) {
                        if (!hasFlag((<ModuleDeclaration>stmt).getModuleFlags(), ModuleFlags.ShouldEmitModuleDecl | ModuleFlags.Ambient)) {
                            return this.setCachedEmitRequired(true);
                        }
                    }
                    else if (stmt.nodeType === NodeType.ClassDeclaration) {
                        if (!hasFlag((<ClassDeclaration>stmt).getVarFlags(), VariableFlags.Ambient)) {
                            return this.setCachedEmitRequired(true);
                        }
                    }
                    else if (stmt.nodeType === NodeType.VariableDeclarator) {
                        if (!hasFlag((<VariableDeclarator>stmt).getVarFlags(), VariableFlags.Ambient)) {
                            return this.setCachedEmitRequired(true);
                        }
                    }
                    else if (stmt.nodeType === NodeType.FunctionDeclaration) {
                        if (!(<FunctionDeclaration>stmt).isSignature()) {
                            return this.setCachedEmitRequired(true);
                        }
                    }
                    else if (stmt.nodeType != NodeType.InterfaceDeclaration && stmt.nodeType != NodeType.EmptyStatement) {
                        return this.setCachedEmitRequired(true);
                    }
                }

                if (emitOptions.compilationSettings.emitComments &&
                    ((this.moduleElements.preComments && this.moduleElements.preComments.length > 0) || (this.moduleElements.postComments && this.moduleElements.postComments.length > 0))) {
                    return this.setCachedEmitRequired(true);
                }
            }
            return this.setCachedEmitRequired(false);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            if (this.emitRequired(emitter.emitOptions)) {
                emitter.emitJavascriptList(this.moduleElements, null, SyntaxKind.SemicolonToken, true, false, false, true, this.requiresExtendsBlock);
            }
        }
    }

    export class NamedDeclaration extends AST {
        public isDeclaration() { return true; }

        constructor(nodeType: NodeType,
                    public name: Identifier,
                    public members: ASTList) {
            super(nodeType);
        }

        public structuralEquals(ast: NamedDeclaration, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.members, ast.members, includingPosition);
        }
    }

    export class ModuleDeclaration extends NamedDeclaration {
        private _moduleFlags = ModuleFlags.ShouldEmitModuleDecl;
        public mod: ModuleType = null;
        public prettyName: string;
        public amdDependencies: string[] = [];
        // Remember if the module contains Unicode chars, that is needed for dynamic module as we will generate a file for each.
        public containsUnicodeChar = false;
        public containsUnicodeCharInComment = false;

        constructor(name: Identifier, members: ASTList, public endingToken: ASTSpan) {
            super(NodeType.ModuleDeclaration, name, members);

            this.prettyName = this.name.actualText;
        }

        public getModuleFlags(): ModuleFlags {
            return this._moduleFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setModuleFlags(flags: ModuleFlags): void {
            this._moduleFlags = flags;
        }

        public structuralEquals(ast: ModuleDeclaration, includePosition: bool): bool {
            if (super.structuralEquals(ast, includePosition)) {
                // TODO: We don't need the 'withoutFlag' calls here once we get rid of 
                // ShouldEmitModuleDecl.
                return withoutFlag(this._moduleFlags, ModuleFlags.ShouldEmitModuleDecl) ===
                       withoutFlag(ast._moduleFlags, ModuleFlags.ShouldEmitModuleDecl);
            }

            return false;
        }

        public isEnum() { return hasFlag(this.getModuleFlags(), ModuleFlags.IsEnum); }
        public isWholeFile() { return hasFlag(this.getModuleFlags(), ModuleFlags.IsWholeFile); }

        public recordNonInterface() {
            this.setModuleFlags(this.getModuleFlags() & ~ModuleFlags.ShouldEmitModuleDecl);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckModule(this);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            if (!hasFlag(this.getModuleFlags(), ModuleFlags.ShouldEmitModuleDecl)) {
                emitter.emitComments(this, true);
                emitter.emitJavascriptModule(this);
                emitter.emitComments(this, false);
            }
        }
    }

    export class TypeDeclaration extends NamedDeclaration {
        private _varFlags = VariableFlags.None;

        constructor(nodeType: NodeType,
                    name: Identifier,
                    public typeParameters: ASTList,
                    public extendsList: ASTList,
                    public implementsList: ASTList,
                    members: ASTList) {
            super(nodeType, name, members);
        }

        public getVarFlags(): VariableFlags {
            return this._varFlags;
        }

        // Must only be called from SyntaxTreeVisitor
        public setVarFlags(flags: VariableFlags): void {
            this._varFlags = flags;
        }

        public structuralEquals(ast: TypeDeclaration, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this._varFlags === ast._varFlags &&
                   structuralEquals(this.typeParameters, ast.typeParameters, includingPosition) &&
                   structuralEquals(this.extendsList, ast.extendsList, includingPosition) &&
                   structuralEquals(this.implementsList, ast.implementsList, includingPosition);
        }
    }

    export class ClassDeclaration extends TypeDeclaration {
        public constructorDecl: FunctionDeclaration = null;
        public endingToken: ASTSpan = null;

        constructor(name: Identifier,
                    typeParameters: ASTList,
                    members: ASTList,
                    extendsList: ASTList,
                    implementsList: ASTList) {
            super(NodeType.ClassDeclaration, name, typeParameters, extendsList, implementsList, members);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckClass(this);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitJavascriptClass(this);
        }
    }

    export class InterfaceDeclaration extends TypeDeclaration {
        constructor(name: Identifier,
            typeParameters: ASTList,
            members: ASTList,
            extendsList: ASTList,
            implementsList: ASTList) {
            super(NodeType.InterfaceDeclaration, name, typeParameters, extendsList, implementsList, members);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckInterface(this);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
        }
    }

    export class Statement extends AST {
        constructor(nodeType: NodeType) {
            super(nodeType);
        }

        public isStatement() {
            return true;
        }

        public typeCheck(typeFlow: TypeFlow) {
            this.type = typeFlow.voidType;
            return this;
        }
    }

    export class ExpressionStatement extends Statement {
        constructor(public expression: AST) {
            super(NodeType.ExpressionStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            this.expression.emit(emitter, SyntaxKind.SemicolonToken, startLine);
            emitter.writeLineToOutput(";");
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: ExpressionStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expression, ast.expression, includingPosition);
        }
    }

    export class LabeledStatement extends Statement {
        constructor(public identifier: Identifier, public statement: AST) {
            super(NodeType.LabeledStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);

            emitter.recordSourceMappingStart(this.identifier);
            emitter.writeToOutput(this.identifier.actualText);
            emitter.recordSourceMappingEnd(this.identifier);
            emitter.writeLineToOutput(":");

            this.statement.emit(emitter, tokenId, true);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            this.statement = this.statement.typeCheck(typeFlow);
            return this;
        }

        public addToControlFlow(context: ControlFlowContext): void {
            var beforeBB = context.current;
            var bb = new BasicBlock();
            context.current = bb;
            beforeBB.addSuccessor(bb);
        }

        public structuralEquals(ast: LabeledStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.identifier, ast.identifier, includingPosition) &&
                   structuralEquals(this.statement, ast.statement, includingPosition);
        }
    }

    export class VariableDeclaration extends AST {
        constructor(public declarators: ASTList) {
            super(NodeType.VariableDeclaration);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitJavascriptVariableDeclaration(this, startLine);
        }

        public structuralEquals(ast: VariableDeclaration, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.declarators, ast.declarators, includingPosition);
        }
    }

    export class VariableStatement extends Statement {
        constructor(public declaration: VariableDeclaration) {
            super(NodeType.VariableStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.emitJavascript(this.declaration, tokenId, startLine);

            // If it was an ambient declarator without an initializer, then we won't emit anything.
            var varDecl = <VariableDeclarator>this.declaration.declarators.members[0];
            var isAmbientWithoutInit = hasFlag(varDecl.getVarFlags(), VariableFlags.Ambient) && varDecl.init === null;
            if (!isAmbientWithoutInit) {
                emitter.writeLineToOutput(";");
            }
            
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: VariableStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.declaration, ast.declaration, includingPosition);
        }
    }

    export class Block extends Statement {
        constructor(public statements: ASTList) {
            super(NodeType.Block);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeLineToOutput(" {");
            emitter.indenter.increaseIndent();
            var temp = emitter.setInObjectLiteral(false);
            if (this.statements) {
                emitter.emitJavascriptList(this.statements, null, SyntaxKind.SemicolonToken, true, false, false);
            }
            emitter.indenter.decreaseIndent();
            emitter.emitIndent();
            emitter.writeToOutput("}");
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public addToControlFlow(context: ControlFlowContext) {
            var afterIfNeeded = new BasicBlock();
            context.pushStatement(this, context.current, afterIfNeeded);
            if (this.statements) {
                context.walk(this.statements, this);
            }
            context.walker.options.goChildren = false;
            context.popStatement();
            if (afterIfNeeded.predecessors.length > 0) {
                context.current.addSuccessor(afterIfNeeded);
                context.current = afterIfNeeded;
            }
        }

        public typeCheck(typeFlow: TypeFlow) {
            if (!typeFlow.checker.styleSettings.emptyBlocks) {
                if ((this.statements === null) || (this.statements.members.length === 0)) {
                    typeFlow.checker.errorReporter.styleError(this, "empty block");
                }
            }

            typeFlow.typeCheck(this.statements);
            return this;
        }

        public structuralEquals(ast: Block, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.statements, ast.statements, includingPosition);
        }
    }

    export class Jump extends Statement {
        public target: string = null;
        public hasExplicitTarget() { return (this.target); }
        public resolvedTarget: Statement = null;

        constructor(nodeType: NodeType) {
            super(nodeType);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            super.addToControlFlow(context);
            context.unconditionalBranch(this.resolvedTarget, (this.nodeType === NodeType.ContinueStatement));
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            if (this.nodeType === NodeType.BreakStatement) {
                emitter.writeToOutput("break");
            }
            else {
                emitter.writeToOutput("continue");
            }
            if (this.hasExplicitTarget()) {
                emitter.writeToOutput(" " + this.target);
            }
            emitter.recordSourceMappingEnd(this);
            emitter.writeToOutput(";");
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: Jump, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.target === ast.target;
        }
    }

    export class WhileStatement extends Statement {
        constructor(public cond: AST, public body: AST) {
            super(NodeType.WhileStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.writeToOutput("while(");
            emitter.emitJavascript(this.cond, SyntaxKind.WhileKeyword, false);
            emitter.writeToOutput(")");
            emitter.emitJavascriptStatements(this.body, false);
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckWhile(this);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            var loopHeader = context.current;
            var loopStart = new BasicBlock();
            var afterLoop = new BasicBlock();

            loopHeader.addSuccessor(loopStart);
            context.current = loopStart;
            context.addContent(this.cond);
            var condBlock = context.current;
            var targetInfo: ITargetInfo = null;
            if (this.body) {
                context.current = new BasicBlock();
                condBlock.addSuccessor(context.current);
                context.pushStatement(this, loopStart, afterLoop);
                context.walk(this.body, this);
                targetInfo = context.popStatement();
            }
            if (!(context.noContinuation)) {
                var loopEnd = context.current;
                loopEnd.addSuccessor(loopStart);
            }
            context.current = afterLoop;
            condBlock.addSuccessor(afterLoop);
            // TODO: check for while (true) and then only continue if afterLoop has predecessors
            context.noContinuation = false;
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: WhileStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class DoWhileStatement extends Statement {
        public whileSpan: ASTSpan = null;

        constructor(public body: AST, public cond: AST) {
            super(NodeType.DoStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.writeToOutput("do");
            emitter.emitJavascriptStatements(this.body, true);
            emitter.recordSourceMappingStart(this.whileSpan);
            emitter.writeToOutput(" while");
            emitter.recordSourceMappingEnd(this.whileSpan);
            emitter.writeToOutput('(');
            emitter.emitJavascript(this.cond, SyntaxKind.CloseParenToken, false);
            emitter.writeToOutput(")");
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.writeToOutput(";");
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckDoWhile(this);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            var loopHeader = context.current;
            var loopStart = new BasicBlock();
            var afterLoop = new BasicBlock();
            loopHeader.addSuccessor(loopStart);
            context.current = loopStart;
            var targetInfo: ITargetInfo = null;
            if (this.body) {
                context.pushStatement(this, loopStart, afterLoop);
                context.walk(this.body, this);
                targetInfo = context.popStatement();
            }
            if (!(context.noContinuation)) {
                var loopEnd = context.current;
                loopEnd.addSuccessor(loopStart);
                context.addContent(this.cond);
                // TODO: check for while (true) 
                context.current = afterLoop;
                loopEnd.addSuccessor(afterLoop);
            }
            else {
                context.addUnreachable(this.cond);
            }
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: DoWhileStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition);
        }
    }

    export class IfStatement extends Statement {
        public statement: ASTSpan = new ASTSpan();

        constructor(public cond: AST,
                    public thenBod: AST,
                    public elseBod: AST) {
            super(NodeType.IfStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("if (");
            emitter.emitJavascript(this.cond, SyntaxKind.IfKeyword, false);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            emitter.emitJavascriptStatements(this.thenBod, true);
            if (this.elseBod) {
                if (this.elseBod.nodeType === NodeType.IfStatement) {
                    emitter.writeToOutput(" else ");
                    this.elseBod.emit(emitter, tokenId, /*startLine:*/ false);
                }
                else {
                    emitter.writeToOutput(" else");
                    emitter.emitJavascriptStatements(this.elseBod, true);
                }
            }
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckIf(this);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            this.cond.addToControlFlow(context);
            var afterIf = new BasicBlock();
            var beforeIf = context.current;
            context.pushStatement(this, beforeIf, afterIf);
            var hasContinuation = false;
            context.current = new BasicBlock();
            beforeIf.addSuccessor(context.current);
            context.walk(this.thenBod, this);
            if (!context.noContinuation) {
                hasContinuation = true;
                context.current.addSuccessor(afterIf);
            }
            if (this.elseBod) {
                // current block will be thenBod
                context.current = new BasicBlock();
                context.noContinuation = false;
                beforeIf.addSuccessor(context.current);
                context.walk(this.elseBod, this);
                if (!context.noContinuation) {
                    hasContinuation = true;
                    context.current.addSuccessor(afterIf);
                }
                else {
                    // thenBod created continuation for if statement
                    if (hasContinuation) {
                        context.noContinuation = false;
                    }
                }
            }
            else {
                beforeIf.addSuccessor(afterIf);
                context.noContinuation = false;
                hasContinuation = true;
            }
            var targetInfo = context.popStatement();
            if (afterIf.predecessors.length > 0) {
                context.noContinuation = false;
                hasContinuation = true;
            }
            if (hasContinuation) {
                context.current = afterIf;
            }
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: IfStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition) &&
                   structuralEquals(this.thenBod, ast.thenBod, includingPosition) &&
                   structuralEquals(this.elseBod, ast.elseBod, includingPosition);
        }
    }

    export class ReturnStatement extends Statement {
        constructor(public returnExpression: AST) {
            super(NodeType.ReturnStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            if (this.returnExpression) {
                emitter.writeToOutput("return ");
                emitter.emitJavascript(this.returnExpression, SyntaxKind.SemicolonToken, false);
                emitter.writeLineToOutput(";");
            }
            else {
                emitter.writeLineToOutput("return;");
            }
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            super.addToControlFlow(context);
            context.returnStmt();
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckReturn(this);
        }

        public structuralEquals(ast: ReturnStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.returnExpression, ast.returnExpression, includingPosition);
        }
    }

    export class ForInStatement extends Statement {
        constructor(public lval: AST, public obj: AST, public body: AST) {
            super(NodeType.ForInStatement);
        }

        public statement: ASTSpan = new ASTSpan();

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("for(");
            emitter.emitJavascript(this.lval, SyntaxKind.ForKeyword, false);
            emitter.writeToOutput(" in ");
            emitter.emitJavascript(this.obj, SyntaxKind.ForKeyword, false);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            emitter.emitJavascriptStatements(this.body, true);
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckForIn(this);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            if (this.lval) {
                context.addContent(this.lval);
            }
            if (this.obj) {
                context.addContent(this.obj);
            }

            var loopHeader = context.current;
            var loopStart = new BasicBlock();
            var afterLoop = new BasicBlock();

            loopHeader.addSuccessor(loopStart);
            context.current = loopStart;
            if (this.body) {
                context.pushStatement(this, loopStart, afterLoop);
                context.walk(this.body, this);
                context.popStatement();
            }
            if (!(context.noContinuation)) {
                var loopEnd = context.current;
                loopEnd.addSuccessor(loopStart);
            }
            context.current = afterLoop;
            context.noContinuation = false;
            loopHeader.addSuccessor(afterLoop);
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: ForInStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.lval, ast.lval, includingPosition) &&
                   structuralEquals(this.obj, ast.obj, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class ForStatement extends Statement {
        constructor(public init: AST,
                    public cond: AST,
                    public incr: AST,
                    public body: AST) {
            super(NodeType.ForStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.writeToOutput("for(");
            if (this.init) {
                if (this.init.nodeType != NodeType.List) {
                    emitter.emitJavascript(this.init, SyntaxKind.ForKeyword, false);
                }
                else {
                    emitter.setInVarBlock((<ASTList>this.init).members.length);
                    emitter.emitJavascriptList(this.init, null, SyntaxKind.ForKeyword, false, false, false);
                }
            }

            emitter.writeToOutput("; ");
            emitter.emitJavascript(this.cond, SyntaxKind.ForKeyword, false);
            emitter.writeToOutput("; ");
            emitter.emitJavascript(this.incr, SyntaxKind.ForKeyword, false);
            emitter.writeToOutput(")");
            emitter.emitJavascriptStatements(this.body, true);
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckFor(this);
        }

        public addToControlFlow(context: ControlFlowContext): void {
            if (this.init) {
                context.addContent(this.init);
            }
            var loopHeader = context.current;
            var loopStart = new BasicBlock();
            var afterLoop = new BasicBlock();

            loopHeader.addSuccessor(loopStart);
            context.current = loopStart;
            var condBlock: BasicBlock = null;
            var continueTarget = loopStart;
            var incrBB: BasicBlock = null;
            if (this.incr) {
                incrBB = new BasicBlock();
                continueTarget = incrBB;
            }
            if (this.cond) {
                condBlock = context.current;
                context.addContent(this.cond);
                context.current = new BasicBlock();
                condBlock.addSuccessor(context.current);
            }
            var targetInfo: ITargetInfo = null;
            if (this.body) {
                context.pushStatement(this, continueTarget, afterLoop);
                context.walk(this.body, this);
                targetInfo = context.popStatement();
            }
            if (this.incr) {
                if (context.noContinuation) {
                    if (incrBB.predecessors.length === 0) {
                        context.addUnreachable(this.incr);
                    }
                }
                else {
                    context.current.addSuccessor(incrBB);
                    context.current = incrBB;
                    context.addContent(this.incr);
                }
            }
            var loopEnd = context.current;
            if (!(context.noContinuation)) {
                loopEnd.addSuccessor(loopStart);

            }
            if (condBlock) {
                condBlock.addSuccessor(afterLoop);
                context.noContinuation = false;
            }
            if (afterLoop.predecessors.length > 0) {
                context.noContinuation = false;
                context.current = afterLoop;
            }
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: ForStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.init, ast.init, includingPosition) &&
                   structuralEquals(this.cond, ast.cond, includingPosition) &&
                   structuralEquals(this.incr, ast.incr, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class WithStatement extends Statement {
        public withSym: WithSymbol = null;

        constructor(public expr: AST, public body: AST) {
            super(NodeType.WithStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput("with (");
            if (this.expr) {
                emitter.emitJavascript(this.expr, SyntaxKind.WithKeyword, false);
            }

            emitter.writeToOutput(")");
            emitter.emitJavascriptStatements(this.body, true);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            return typeFlow.typeCheckWith(this);
        }

        public structuralEquals(ast: WithStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expr, ast.expr, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class SwitchStatement extends Statement {
        public caseList: ASTList;
        public defaultCase: CaseClause = null;
        public statement: ASTSpan = new ASTSpan();

        constructor(public val: AST) {
            super(NodeType.SwitchStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            var temp = emitter.setInObjectLiteral(false);
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("switch(");
            emitter.emitJavascript(this.val, SyntaxKind.IdentifierName, false);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            emitter.writeLineToOutput(" {");
            emitter.indenter.increaseIndent();
            var casesLen = this.caseList.members.length;
            for (var i = 0; i < casesLen; i++) {
                var caseExpr = this.caseList.members[i];
                emitter.emitJavascript(caseExpr, SyntaxKind.CaseKeyword, true);
            }
            emitter.indenter.decreaseIndent();
            emitter.emitIndent();
            emitter.writeToOutput("}");
            emitter.setInObjectLiteral(temp);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            var len = this.caseList.members.length;
            this.val = typeFlow.typeCheck(this.val);
            for (var i = 0; i < len; i++) {
                this.caseList.members[i] = typeFlow.typeCheck(this.caseList.members[i]);
            }
            this.defaultCase = <CaseClause>typeFlow.typeCheck(this.defaultCase);
            this.type = typeFlow.voidType;
            return this;
        }

        // if there are break statements that match this switch, then just link cond block with block after switch
        public addToControlFlow(context: ControlFlowContext) {
            var condBlock = context.current;
            context.addContent(this.val);
            var execBlock = new BasicBlock();
            var afterSwitch = new BasicBlock();

            condBlock.addSuccessor(execBlock);
            context.pushSwitch(execBlock);
            context.current = execBlock;
            context.pushStatement(this, execBlock, afterSwitch);
            context.walk(this.caseList, this);
            context.popSwitch();
            var targetInfo = context.popStatement();
            var hasCondContinuation = (this.defaultCase === null);
            if (this.defaultCase === null) {
                condBlock.addSuccessor(afterSwitch);
            }
            if (afterSwitch.predecessors.length > 0) {
                context.noContinuation = false;
                context.current = afterSwitch;
            }
            else {
                context.noContinuation = true;
            }
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: SwitchStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.caseList, ast.caseList, includingPosition) &&
                   structuralEquals(this.val, ast.val, includingPosition);
        }
    }

    export class CaseClause extends AST {
        public expr: AST = null;
        public body: ASTList;
        public colonSpan: ASTSpan = new ASTSpan();

        constructor() {
            super(NodeType.CaseClause);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            if (this.expr) {
                emitter.writeToOutput("case ");
                emitter.emitJavascript(this.expr, SyntaxKind.IdentifierName, false);
            }
            else {
                emitter.writeToOutput("default");
            }
            emitter.recordSourceMappingStart(this.colonSpan);
            emitter.writeToOutput(":");
            emitter.recordSourceMappingEnd(this.colonSpan);
            if (this.body.members.length === 1 && this.body.members[0].nodeType === NodeType.Block) {
                // The case statement was written with curly braces, so emit it with the appropriate formatting
                emitter.emitJavascriptStatements(this.body, false);
            }
            else {
                // No curly braces. Format in the expected way
                emitter.writeLineToOutput("");
                emitter.indenter.increaseIndent();
                emitter.emitJavascript(this.body, SyntaxKind.SemicolonToken, true);
                emitter.indenter.decreaseIndent();
            }
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public typeCheck(typeFlow: TypeFlow) {
            this.expr = typeFlow.typeCheck(this.expr);
            typeFlow.typeCheck(this.body);
            this.type = typeFlow.voidType;
            return this;
        }

        // TODO: more reasoning about unreachable cases (such as duplicate literals as case expressions)
        // for now, assume all cases are reachable, regardless of whether some cases fall through
        public addToControlFlow(context: ControlFlowContext) {
            var execBlock = new BasicBlock();
            var sw = context.currentSwitch[context.currentSwitch.length - 1];
            // TODO: fall-through from previous (+ to end of switch)
            if (this.expr) {
                var exprBlock = new BasicBlock();
                context.current = exprBlock;
                sw.addSuccessor(exprBlock);
                context.addContent(this.expr);
                exprBlock.addSuccessor(execBlock);
            }
            else {
                sw.addSuccessor(execBlock);
            }
            context.current = execBlock;
            if (this.body) {
                context.walk(this.body, this);
            }
            context.noContinuation = false;
            context.walker.options.goChildren = false;
        }

        public structuralEquals(ast: CaseClause, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.expr, ast.expr, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class TypeParameter extends AST {
        constructor(public name: Identifier, public constraint: AST) {
            super(NodeType.TypeParameter);
        }

        public structuralEquals(ast: TypeParameter, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.constraint, ast.constraint, includingPosition);
        }
    }

    export class GenericType extends AST {
        constructor(public name: AST, public typeArguments: ASTList) {
            super(NodeType.GenericType);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool): void {
            emitter.emitJavascript(this.name, SyntaxKind.IdentifierName, false);
        }

        public structuralEquals(ast: GenericType, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.name, ast.name, includingPosition) &&
                   structuralEquals(this.typeArguments, ast.typeArguments, includingPosition);
        }
    }

    export class TypeReference extends AST {
        constructor(public term: AST, public arrayCount: number) {
            super(NodeType.TypeRef);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            throw new Error("should not emit a type ref");
        }

        public typeCheck(typeFlow: TypeFlow) {
            var prevInTCTR = typeFlow.inTypeRefTypeCheck;
            typeFlow.inTypeRefTypeCheck = true;
            var typeLink = getTypeLink(this, typeFlow.checker, true);
            typeFlow.checker.resolveTypeLink(typeFlow.scope, typeLink, false);

            if (this.term) {
                typeFlow.typeCheck(this.term);
            }

            typeFlow.checkForVoidConstructor(typeLink.type, this);

            this.type = typeLink.type;

            // in error recovery cases, there may not be a term
            if (this.term) {
                this.term.type = this.type;
            }

            typeFlow.inTypeRefTypeCheck = prevInTCTR;
            return this;
        }

        public structuralEquals(ast: TypeReference, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.term, ast.term, includingPosition) &&
                   this.arrayCount === ast.arrayCount;
        }
    }

    export class TryStatement extends Statement {
        constructor(public tryBody: AST, public catchClause: CatchClause, public finallyBody: AST) {
            super(NodeType.TryStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput("try ");
            emitter.emitJavascript(this.tryBody, SyntaxKind.TryKeyword, false);
            emitter.emitJavascript(this.catchClause, SyntaxKind.CatchKeyword, false);

            if (this.finallyBody) {
                emitter.writeToOutput(" finally");
                emitter.emitJavascript(this.finallyBody, SyntaxKind.FinallyKeyword, false);
            }

            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: TryStatement, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.tryBody, ast.tryBody, includingPosition) &&
                   structuralEquals(this.catchClause, ast.catchClause, includingPosition) &&
                   structuralEquals(this.finallyBody, ast.finallyBody, includingPosition);
        }
    }

    export class CatchClause extends AST {
        constructor(public param: VariableDeclarator, public body: AST) {
            super(NodeType.CatchClause);
        }

        public statement: ASTSpan = new ASTSpan();
        public containedScope: SymbolScope = null;

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput(" ");
            emitter.recordSourceMappingStart(this.statement);
            emitter.writeToOutput("catch (");
            emitter.emitJavascript(this.param, SyntaxKind.OpenParenToken, false);
            emitter.writeToOutput(")");
            emitter.recordSourceMappingEnd(this.statement);
            emitter.emitJavascript(this.body, SyntaxKind.CatchKeyword, false);
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public addToControlFlow(context: ControlFlowContext) {
            if (this.param) {
                context.addContent(this.param);
                var bodBlock = new BasicBlock();
                context.current.addSuccessor(bodBlock);
                context.current = bodBlock;
            }
            if (this.body) {
                context.walk(this.body, this);
            }
            context.noContinuation = false;
            context.walker.options.goChildren = false;
        }

        public typeCheck(typeFlow: TypeFlow) {
            var prevScope = typeFlow.scope;
            typeFlow.scope = this.containedScope;
            this.param = <VariableDeclarator>typeFlow.typeCheck(this.param);
            var exceptVar = new ValueLocation();
            var varSym = new VariableSymbol((<VariableDeclarator>this.param).id.text,
                                          this.param.minChar,
                                          typeFlow.checker.locationInfo.fileName,
                                          exceptVar);
            exceptVar.symbol = varSym;
            exceptVar.typeLink = new TypeLink();
            // var type for now (add syntax for type annotation)
            exceptVar.typeLink.type = typeFlow.anyType;
            var thisFnc = typeFlow.thisFnc;
            if (thisFnc && thisFnc.type) {
                exceptVar.symbol.container = thisFnc.type.symbol;
            }
            else {
                exceptVar.symbol.container = null;
            }
            this.param.sym = exceptVar.symbol;
            typeFlow.scope.enter(exceptVar.symbol.container, this.param, exceptVar.symbol,
                                 typeFlow.checker.errorReporter, false, false, false);
            this.body = typeFlow.typeCheck(this.body);

            // if we're in provisional typecheck mode, clean up the symbol entry
            // REVIEW: This is obviously bad form, since we're counting on the internal
            // layout of the symbol table, but this is also the only place where we insert
            // symbols during typecheck
            if (typeFlow.checker.inProvisionalTypecheckMode()) {
                var table = typeFlow.scope.getTable();
                (<any>table).secondaryTable.table[exceptVar.symbol.name] = undefined;
            }
            this.type = typeFlow.voidType;
            typeFlow.scope = prevScope;
            return this;
        }

        public structuralEquals(ast: CatchClause, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   structuralEquals(this.param, ast.param, includingPosition) &&
                   structuralEquals(this.body, ast.body, includingPosition);
        }
    }

    export class DebuggerStatement extends Statement {
        constructor() {
            super(NodeType.DebuggerStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeToOutput("debugger");
            emitter.recordSourceMappingEnd(this);
            emitter.writeLineToOutput(";");
            emitter.emitComments(this, false);
        }
    }

    export class OmittedExpression extends Expression {
        constructor() {
            super(NodeType.OmittedExpression);
        }

        public structuralEquals(ast: CatchClause, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class EmptyStatement extends Statement {
        constructor() {
            super(NodeType.EmptyStatement);
        }

        public emit(emitter: Emitter, tokenId: SyntaxKind, startLine: bool) {
            emitter.emitComments(this, true);
            emitter.recordSourceMappingStart(this);
            emitter.writeLineToOutput(";");
            emitter.recordSourceMappingEnd(this);
            emitter.emitComments(this, false);
        }

        public structuralEquals(ast: CatchClause, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition);
        }
    }

    export class Comment extends AST {
        public text: string[] = null;
        public minLine: number;
        public limLine: number;
        private docCommentText: string = null;

        constructor(public content: string,
                    public isBlockComment: bool,
                    public endsLine) {
            super(NodeType.Comment);
        }

        public structuralEquals(ast: Comment, includingPosition: bool): bool {
            return super.structuralEquals(ast, includingPosition) &&
                   this.minLine === ast.minLine &&
                   this.content === ast.content &&
                   this.isBlockComment === ast.isBlockComment &&
                   this.endsLine === ast.endsLine;
        }

        public getText(): string[] {
            if (this.text === null) {
                if (this.isBlockComment) {
                    this.text = this.content.split("\n");
                    for (var i = 0; i < this.text.length; i++) {
                        this.text[i] = this.text[i].replace(/^\s+|\s+$/g, '');
                    }
                }
                else {
                    this.text = [(this.content.replace(/^\s+|\s+$/g, ''))];
                }
            }

            return this.text;
        }

        public isDocComment() {
            if (this.isBlockComment) {
                return this.content.charAt(2) === "*" && this.content.charAt(3) != "/";
            }

            return false;
        }

        public getDocCommentTextValue() {
            if (this.docCommentText === null) {
                this.docCommentText = Comment.cleanJSDocComment(this.content);
            }

            return this.docCommentText;
        }

        static consumeLeadingSpace(line: string, startIndex: number, maxSpacesToRemove?: number) {
            var endIndex = line.length;
            if (maxSpacesToRemove != undefined) {
                endIndex = min(startIndex + maxSpacesToRemove, endIndex);
            }

            for (; startIndex < endIndex; startIndex++) {
                var charCode = line.charCodeAt(startIndex);
                if (charCode !== CharacterCodes.space && charCode !== CharacterCodes.tab) {
                    return startIndex;
                }
            }

            if (endIndex != line.length) {
                return endIndex;
            }

            return -1;
        }

        static isSpaceChar(line: string, index: number) {
            var length = line.length;
            if (index < length) {
                var charCode = line.charCodeAt(index);
                // If the character is space
                return charCode === CharacterCodes.space || charCode === CharacterCodes.tab;
            }

            // If the index is end of the line it is space
            return index === length;
        }

        static cleanDocCommentLine(line: string, jsDocStyleComment: bool, jsDocLineSpaceToRemove?: number) {
            var nonSpaceIndex = Comment.consumeLeadingSpace(line, 0);
            if (nonSpaceIndex != -1) {
                var jsDocSpacesRemoved = nonSpaceIndex;
                if (jsDocStyleComment && line.charAt(nonSpaceIndex) === '*') { // remove leading * in case of jsDocComment
                    var startIndex = nonSpaceIndex + 1;
                    nonSpaceIndex = Comment.consumeLeadingSpace(line, startIndex, jsDocLineSpaceToRemove);

                    if (nonSpaceIndex != -1) {
                        jsDocSpacesRemoved = nonSpaceIndex - startIndex;
                    } else {
                        return null;
                    }
                }

                return {
                    minChar: nonSpaceIndex,
                    limChar: line.charAt(line.length - 1) === "\r" ? line.length - 1 : line.length,
                    jsDocSpacesRemoved: jsDocSpacesRemoved
                };
            }

            return null;
        }

        static cleanJSDocComment(content: string, spacesToRemove?: number) {

            var docCommentLines: string[] = [];
            content = content.replace("/**", ""); // remove /**
            if (content.length >= 2 && content.charAt(content.length - 1) === "/" && content.charAt(content.length - 2) === "*") {
                content = content.substring(0, content.length - 2); // remove last */
            }
            var lines = content.split("\n");
            var inParamTag = false;
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                var cleanLinePos = Comment.cleanDocCommentLine(line, true, spacesToRemove);
                if (!cleanLinePos) {
                    // Whole line empty, read next line
                    continue;
                }

                var docCommentText = "";
                var prevPos = cleanLinePos.minChar;
                for (var i = line.indexOf("@", cleanLinePos.minChar); 0 <= i && i < cleanLinePos.limChar; i = line.indexOf("@", i + 1)) {
                    // We have encoutered @. 
                    // If we were omitting param comment, we dont have to do anything
                    // other wise the content of the text till @ tag goes as doc comment
                    var wasInParamtag = inParamTag;

                    // Parse contents next to @
                    if (line.indexOf("param", i + 1) === i + 1 && Comment.isSpaceChar(line, i + 6)) {
                        // It is param tag. 

                        // If we were not in param tag earlier, push the contents from prev pos of the tag this tag start as docComment
                        if (!wasInParamtag) {
                            docCommentText += line.substring(prevPos, i);
                        }

                        // New start of contents 
                        prevPos = i;
                        inParamTag = true;
                    } else if (wasInParamtag) {
                        // Non param tag start
                        prevPos = i;
                        inParamTag = false;
                    }
                }

                if (!inParamTag) {
                    docCommentText += line.substring(prevPos, cleanLinePos.limChar);
                }

                // Add line to comment text if it is not only white space line
                var newCleanPos = Comment.cleanDocCommentLine(docCommentText, false);
                if (newCleanPos) {
                    if (spacesToRemove === undefined) {
                        spacesToRemove = cleanLinePos.jsDocSpacesRemoved;
                    }
                    docCommentLines.push(docCommentText);
                }
            }

            return docCommentLines.join("\n");
        }

        static getDocCommentText(comments: Comment[]) {
            var docCommentText: string[] = [];
            for (var c = 0 ; c < comments.length; c++) {
                var commentText = comments[c].getDocCommentTextValue();
                if (commentText != "") {
                    docCommentText.push(commentText);
                }
            }
            return docCommentText.join("\n");
        }

        static getParameterDocCommentText(param: string, fncDocComments: Comment[]) {
            if (fncDocComments.length === 0 || !fncDocComments[0].isBlockComment) {
                // there were no fnc doc comments and the comment is not block comment then it cannot have 
                // @param comment that can be parsed
                return "";
            }

            for (var i = 0; i < fncDocComments.length; i++) {
                var commentContents = fncDocComments[i].content;
                for (var j = commentContents.indexOf("@param", 0); 0 <= j; j = commentContents.indexOf("@param", j)) {
                    j += 6;
                    if (!Comment.isSpaceChar(commentContents, j)) {
                        // This is not param tag but a tag line @paramxxxxx
                        continue;
                    }

                    // This is param tag. Check if it is what we are looking for
                    j = Comment.consumeLeadingSpace(commentContents, j);
                    if (j === -1) {
                        break;
                    }

                    // Ignore the type expression
                    if (commentContents.charCodeAt(j) === CharacterCodes.openBrace) {
                        j++;
                        // Consume the type
                        var charCode = 0;
                        for (var curlies = 1; j < commentContents.length; j++) {
                            charCode = commentContents.charCodeAt(j);
                            // { character means we need to find another } to match the found one
                            if (charCode === CharacterCodes.openBrace) {
                                curlies++;
                                continue;
                            }

                            // } char
                            if (charCode === CharacterCodes.closeBrace) {
                                curlies--;
                                if (curlies === 0) {
                                    // We do not have any more } to match the type expression is ignored completely
                                    break;
                                } else {
                                    // there are more { to be matched with }
                                    continue;
                                }
                            }

                            // Found start of another tag
                            if (charCode === CharacterCodes.at) {
                                break;
                            }
                        }

                        // End of the comment
                        if (j === commentContents.length) {
                            break;
                        }

                        // End of the tag, go onto looking for next tag
                        if (charCode === CharacterCodes.at) {
                            continue;
                        }

                        j = Comment.consumeLeadingSpace(commentContents, j + 1);
                        if (j === -1) {
                            break;
                        }
                    }

                    // Parameter name
                    if (param != commentContents.substr(j, param.length) || !Comment.isSpaceChar(commentContents, j + param.length)) {
                        // this is not the parameter we are looking for
                        continue;
                    }

                    // Found the parameter we were looking for
                    j = Comment.consumeLeadingSpace(commentContents, j + param.length);
                    if (j === -1) {
                        return "";
                    }

                    var endOfParam = commentContents.indexOf("@", j);
                    var paramHelpString = commentContents.substring(j, endOfParam < 0 ? commentContents.length : endOfParam);

                    // Find alignement spaces to remove
                    var paramSpacesToRemove: number = undefined;
                    var paramLineIndex = commentContents.substring(0, j).lastIndexOf("\n") + 1;
                    if (paramLineIndex != 0) {
                        if (paramLineIndex < j && commentContents.charAt(paramLineIndex + 1) === "\r") {
                            paramLineIndex++;
                        }
                    }
                    var startSpaceRemovalIndex = Comment.consumeLeadingSpace(commentContents, paramLineIndex);
                    if (startSpaceRemovalIndex != j && commentContents.charAt(startSpaceRemovalIndex) === "*") {
                        paramSpacesToRemove = j - startSpaceRemovalIndex - 1;
                    }

                    // Clean jsDocComment and return
                    return Comment.cleanJSDocComment(paramHelpString, paramSpacesToRemove);
                }
            }

            return "";
        }

        static getDocCommentFirstOverloadSignature(signatureGroup: SignatureGroup) {
            for (var i = 0; i < signatureGroup.signatures.length; i++) {
                var signature = signatureGroup.signatures[i];
                if (signature === signatureGroup.definitionSignature) {
                    continue;
                }

                return TypeScript.Comment.getDocCommentText(signature.declAST.getDocComments());
            }

            return "";
        }
    }
}