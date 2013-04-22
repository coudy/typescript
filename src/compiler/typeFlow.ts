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
    export class ScopeChain {
        public thisType: Type;
        public classType: Type;
        public fnc: FunctionDeclaration;
        public moduleDecl: ModuleDeclaration;

        constructor(public container: Symbol, public previous: ScopeChain,
                     public scope: SymbolScope) { }
    }

    export class BBUseDefInfo {
        public defsBySymbol: boolean[] = [];
        public gen: BitVector;
        public kill: BitVector;
        public top: BitVector;
        // use lists by symbol 
        public useIndexBySymbol: number[][] = [];

        constructor(public bb: BasicBlock) { }

        public updateTop() {
            var temp = new BitVector(this.top.bitCount);
            for (var i = 0, succLen = this.bb.successors.length; i < succLen; i++) {
                var succ = this.bb.successors[i];
                if (succ.useDef) {
                    temp.union(succ.useDef.top);
                }
            }
            temp.difference(this.kill);
            temp.union(this.gen);
            var changed = temp.notEq(this.top);
            this.top = temp;
            return changed;
        }


        public initialize(useDefContext: UseDefContext) {
            var defSym = (sym: Symbol, context: UseDefContext) => {
                if (context.isLocalSym(sym)) {
                    var index = context.getSymbolIndex(sym);
                    // clear pending uses
                    this.useIndexBySymbol[index] = [];
                    this.defsBySymbol[index] = true;
                }
            }

            var useSym = (sym: Symbol, context: UseDefContext, ast: AST) => {
                if (context.isLocalSym(sym)) {
                    var symIndex = context.getSymbolIndex(sym);
                    if (this.useIndexBySymbol[symIndex] === undefined) {
                        this.useIndexBySymbol[symIndex] = [];
                    }
                    var symUses = this.useIndexBySymbol[symIndex];
                    var astIndex = context.getUseIndex(ast);
                    context.addUse(symIndex, astIndex);
                    symUses.push(astIndex);
                }
            }

            function initUseDefPre(cur: AST, parent: AST, walker: IAstWalker) {
                var context: UseDefContext = walker.state;
                var asg: BinaryExpression;
                var id: Identifier;

                if (cur === null) {
                    cur = null;
                }
                if (cur.nodeType === NodeType.VariableDeclarator) {
                    var varDecl = <BoundDecl>cur;
                    if (varDecl.init /*|| hasFlag(varDecl.getVarFlags(), VariableFlags.AutoInit)*/) {
                        defSym(varDecl.sym, context);
                    }
                }
                else if (cur.nodeType === NodeType.Name) {
                    // use
                    if (parent) {
                        if (parent.nodeType === NodeType.AssignmentExpression) {
                            asg = <BinaryExpression>parent;
                            if (asg.operand1 === cur) {
                                return cur;
                            }
                        }
                        else if (parent.nodeType === NodeType.VariableDeclarator) {
                            var parentDecl = <BoundDecl>parent;
                            if (parentDecl.id === cur) {
                                return cur;
                            }
                        }
                    }
                    id = <Identifier>cur;
                    useSym(id.sym, context, cur);
                }
                else if ((cur.nodeType >= NodeType.AssignmentExpression) && (cur.nodeType <= NodeType.UnsignedRightShiftAssignmentExpression)) {
                    // def
                    asg = <BinaryExpression>cur;
                    if (asg.operand1 && (asg.operand1.nodeType === NodeType.Name)) {
                        id = <Identifier>asg.operand1;
                        defSym(id.sym, context);
                    }
                }
                else if (cur.nodeType === NodeType.FunctionDeclaration) {
                    walker.options.goChildren = false;
                }

                return cur;
            }

            var options = new AstWalkOptions();
            // traverse ASTs in reverse order of execution (to match uses with preceding defs)
            // options.reverseSiblings = true;

            getAstWalkerFactory().walk(this.bb.content, initUseDefPre, null, options, useDefContext);
        }

        public initializeGen(useDefContext: UseDefContext) {
            var symbolLen = this.useIndexBySymbol.length;
            var bitCount = useDefContext.uses.length;
            this.gen = new BitVector(bitCount);
            for (var s = 0; s < symbolLen; s++) {
                var symUses = this.useIndexBySymbol[s];
                if ((symUses !== undefined) && (symUses.length > 0)) {
                    for (var u = 0, uLen = symUses.length; u < uLen; u++) {
                        this.gen.set(symUses[u], true);
                    }
                }
            }
            this.top = this.gen;
        }

        public initializeKill(useDefContext: UseDefContext) {
            this.kill = new BitVector(this.gen.bitCount);
            for (var s = 0, symbolLen = this.defsBySymbol.length; s < symbolLen; s++) {
                if (this.defsBySymbol[s]) {
                    var globalSymUses = useDefContext.useIndexBySymbol[s];
                    if (globalSymUses) {
                        for (var u = 0, useLen = globalSymUses.length; u < useLen; u++) {
                            this.kill.set(globalSymUses[u], true);
                        }
                    }
                }
            }
        }
    }

    export class UseDefContext {
        // global use lists by symbol
        public useIndexBySymbol: number[][] = [];
        // global list of uses (flat)
        public uses: AST[] = [];
        public symbols: VariableSymbol[] = [];
        public symbolMap = new StringHashTable();
        public symbolCount = 0;
        public func: Symbol;

        constructor() {
        }

        public getSymbolIndex(sym: Symbol) {
            var name = sym.name;
            var index = <number>(this.symbolMap.lookup(name));
            if (index === null) {
                index = this.symbolCount++;
                this.symbols[index] = <VariableSymbol>sym;
                this.symbolMap.add(name, index);
            }
            return index;
        }

        public addUse(symIndex: number, astIndex: number) {
            var useBySym = this.useIndexBySymbol[symIndex];
            if (useBySym === undefined) {
                useBySym = [];
                this.useIndexBySymbol[symIndex] = useBySym;
            }
            useBySym[useBySym.length] = astIndex;
        }

        public getUseIndex(ast: AST) {
            this.uses[this.uses.length] = ast;
            return this.uses.length - 1;
        }

        public isLocalSym(sym: Symbol) { return (sym && (sym.container === this.func) && (sym.kind() === SymbolKind.Variable)); }

        public killSymbol(sym: VariableSymbol, bbUses: BitVector) {
            var index: number = this.symbolMap.lookup(sym.name);
            var usesOfSym = this.useIndexBySymbol[index];
            for (var k = 0, len = usesOfSym.length; k < len; k++) {
                bbUses.set(usesOfSym[k], true);
            }
        }
    }

    export class BitVector {
        static packBits = 30;
        public firstBits = 0;
        public restOfBits: number[] = null;

        constructor(public bitCount: number) {
            if (this.bitCount > BitVector.packBits) {
                this.restOfBits = [];
                var len = Math.floor(this.bitCount / BitVector.packBits);
                for (var i = 0; i < len; i++) {
                    this.restOfBits[i] = 0;
                }
            }
        }

        public set (bitIndex: number, value: boolean) {
            if (bitIndex < BitVector.packBits) {
                if (value) {
                    this.firstBits |= (1 << bitIndex);
                }
                else {
                    this.firstBits &= (~(1 << bitIndex));
                }
            }
            else {
                var offset = Math.floor(bitIndex / BitVector.packBits) - 1;
                var localIndex = bitIndex % BitVector.packBits;
                if (value) {
                    this.restOfBits[offset] |= (1 << localIndex);
                }
                else {
                    this.restOfBits[offset] &= (~(1 << localIndex));
                }
            }
        }

        public map(fn: (index: number) => any) {
            for (var k = 0; k < BitVector.packBits; k++) {
                if (k === this.bitCount) {
                    return;
                }
                if (((1 << k) & this.firstBits) !== 0) {
                    fn(k);
                }
            }
            if (this.restOfBits) {
                var len: number;
                var cumu = BitVector.packBits;
                for (var k = 0, len = this.restOfBits.length; k < len; k++) {
                    var myBits = this.restOfBits[k];
                    for (var j = 0; j < BitVector.packBits; j++) {
                        if (((1 << j) & myBits) !== 0) {
                            fn(cumu);
                        }
                        cumu++;
                        if (cumu === this.bitCount) {
                            return;
                        }
                    }
                }
            }
        }

        // assume conforming sizes
        public union(b: BitVector) {
            this.firstBits |= b.firstBits;
            if (this.restOfBits) {
                for (var k = 0, len = this.restOfBits.length; k < len; k++) {
                    var myBits = this.restOfBits[k];
                    var bBits = b.restOfBits[k];
                    this.restOfBits[k] = myBits | bBits;
                }
            }
        }

        // assume conforming sizes
        public intersection(b: BitVector) {
            this.firstBits &= b.firstBits;
            if (this.restOfBits) {
                for (var k = 0, len = this.restOfBits.length; k < len; k++) {
                    var myBits = this.restOfBits[k];
                    var bBits = b.restOfBits[k];
                    this.restOfBits[k] = myBits & bBits;
                }
            }
        }

        // assume conforming sizes
        public notEq(b: BitVector) {
            if (this.firstBits !== b.firstBits) {
                return true;
            }
            if (this.restOfBits) {
                for (var k = 0, len = this.restOfBits.length; k < len; k++) {
                    var myBits = this.restOfBits[k];
                    var bBits = b.restOfBits[k];
                    if (myBits !== bBits) {
                        return true;
                    }
                }
            }
            return false;
        }

        public difference(b: BitVector) {
            var oldFirstBits = this.firstBits;
            this.firstBits &= (~b.firstBits);
            if (this.restOfBits) {
                for (var k = 0, len = this.restOfBits.length; k < len; k++) {
                    var myBits = this.restOfBits[k];
                    var bBits = b.restOfBits[k];
                    this.restOfBits[k] &= (~bBits);
                }
            }
        }
    }

    export class BasicBlock {
        // blocks that branch to the block after this one
        public predecessors: BasicBlock[] = [];
        public index = -1;
        public markValue = 0;
        public marked(markBase: number) { return this.markValue > markBase; }
        public mark() {
            this.markValue++;
        }
        public successors: BasicBlock[] = [];
        public useDef: BBUseDefInfo = null;
        public content = new ASTList();
        public addSuccessor(successor: BasicBlock): void {
            this.successors[this.successors.length] = successor;
            successor.predecessors[successor.predecessors.length] = this;
        }
    }

    export interface ITargetInfo {
        stmt: AST;
        continueBB: BasicBlock;
        breakBB: BasicBlock;
    }

    export class ControlFlowContext {
        public entry = null;
        // first unreachable ast for each unreachable code segment
        public unreachable: AST[] = null;
        public noContinuation = false;
        // statements enclosing the current statement
        public statementStack: ITargetInfo[] = [];
        public currentSwitch: BasicBlock[] = [];
        public walker: IAstWalker;

        constructor(public current: BasicBlock,
                     public exit: BasicBlock) {
            this.entry = this.current;
        }

        public walk(ast: AST, parent: AST) {
            return this.walker.walk(ast, parent);
        }

        public pushSwitch(bb: BasicBlock) {
            this.currentSwitch.push(bb);
        }

        public popSwitch() {
            return this.currentSwitch.pop();
        }

        public reportUnreachable(er: ErrorReporter) {
            if (this.unreachable && (this.unreachable.length > 0)) {
                var len = this.unreachable.length;
                for (var i = 0; i < len; i++) {
                    var unreachableAST = this.unreachable[i];
                    //if (unreachableAST.nodeType !== NodeType.EndCode) {
                    //    er.simpleError(unreachableAST, "unreachable code");
                    //}
                }
            }
        }

        private printAST(ast: AST, outfile: ITextWriter) {
            var printContext = new PrintContext(outfile);

            printContext.increaseIndent();
            //ast.walk(prePrintAST, postPrintAST, null, printContext);
            getAstWalkerFactory().walk(ast, prePrintAST, postPrintAST, null, printContext);

            printContext.decreaseIndent();
        }

        private printBlockContent(bb: BasicBlock, outfile: ITextWriter) {
            var content = bb.content;
            for (var i = 0, len = content.members.length; i < len; i++) {
                var ast = content.members[i];
                this.printAST(ast, outfile);
            }
        }

        public markBase = 0;

        public bfs(nodeFunc: (bb: BasicBlock) => void , edgeFunc: (node1: BasicBlock, node2: BasicBlock) => void ,
            preEdges: () => void , postEdges: () => void ) {
            var markValue = this.markBase++;
            var q: BasicBlock[] = [];
            q[q.length] = this.entry;

            while (q.length > 0) {
                var bb = q.pop();
                if (!(bb.marked(markValue))) {
                    bb.mark();
                    if (nodeFunc) {
                        nodeFunc(bb);
                    }
                    var succLen = bb.successors.length;
                    if (succLen > 0) {
                        if (preEdges) {
                            preEdges();
                        }
                        for (var j = succLen - 1; j >= 0; j--) {
                            var successor = bb.successors[j];
                            if (!(successor.marked(this.markBase))) {
                                if (edgeFunc) {
                                    edgeFunc(bb, successor);
                                }
                                q[q.length] = successor;
                            }
                        }
                        if (postEdges) {
                            postEdges();
                        }
                    }
                }
            }
        }

        public linearBBs: BasicBlock[] = [];

        public useDef(er: ErrorReporter, funcSym: Symbol) {
            var useDefContext = new UseDefContext();
            useDefContext.func = funcSym;
            var useDefInit = (bb: BasicBlock) => {
                bb.useDef = new BBUseDefInfo(bb);
                bb.useDef.initialize(useDefContext);
                this.linearBBs[this.linearBBs.length] = bb;
            }
            this.bfs(useDefInit, null, null, null);
            var i: number, bbLen: number;
            for (var i = 0, bbLen = this.linearBBs.length; i < bbLen; i++) {
                this.linearBBs[i].useDef.initializeGen(useDefContext);
                this.linearBBs[i].useDef.initializeKill(useDefContext);
            }
            var changed = true;

            while (changed) {
                changed = false;
                for (var i = 0; i < bbLen; i++) {
                    changed = this.linearBBs[i].useDef.updateTop() || changed;
                }
            }

            var top = this.entry.useDef.top;
            top.map((index) => {
                var ast = <Identifier>useDefContext.uses[<number>index];
                er.simpleError(ast, "use of variable '" + ast.actualText + "' that is not definitely assigned");
            });
        }

        public print(outfile: ITextWriter) {
            var index = 0;
            var node = (bb: BasicBlock) => {
                if (bb.index < 0) {
                    bb.index = index++;
                }
                if (bb === this.exit) {
                    outfile.WriteLine("Exit block with index " + bb.index);
                }
                else {
                    outfile.WriteLine("Basic block with index " + bb.index);
                    this.printBlockContent(bb, outfile);
                }
            }

            function preEdges() {
                outfile.Write("  Branches to ");
            }

            function postEdges() {
                outfile.WriteLine("");
            }

            function edge(node1: BasicBlock, node2: BasicBlock) {
                if (node2.index < 0) {
                    node2.index = index++;
                }
                outfile.Write(node2.index + " ");
            }

            this.bfs(node, edge, preEdges, postEdges);
            if (this.unreachable !== null) {
                for (var i = 0, len = this.unreachable.length; i < len; i++) {
                    outfile.WriteLine("Unreachable basic block ...");
                    this.printAST(this.unreachable[i], outfile);
                }
            }
        }

        public pushStatement(stmt: Statement, continueBB: BasicBlock, breakBB: BasicBlock) {
            this.statementStack.push({ stmt: stmt, continueBB: continueBB, breakBB: breakBB });
        }

        public popStatement() { return this.statementStack.pop(); }

        public returnStmt() {
            // TODO: make successor finally block if return stmt inside of try/finally 
            this.current.addSuccessor(this.exit);
            this.setUnreachable();
        }

        public setUnreachable() {
            this.current = null;
            this.noContinuation = true;
        }

        public addUnreachable(ast: AST) {
            if (this.unreachable === null) {
                this.unreachable = [];
            }
            this.unreachable[this.unreachable.length] = ast;
        }

        public unconditionalBranch(target: AST, isContinue: boolean) {
            var targetBB = null;
            for (var i = 0, len = this.statementStack.length; i < len; i++) {
                var targetInfo = this.statementStack[i];
                if (targetInfo.stmt === target) {
                    if (isContinue) {
                        targetBB = targetInfo.continueBB;
                    }
                    else {
                        targetBB = targetInfo.breakBB;
                    }
                    break;
                }
            }
            if (targetBB) {
                this.current.addSuccessor(targetBB);
            }
            this.setUnreachable();
        }

        public addContent(ast: AST): void {
            if (this.current) {
                this.current.content.append(ast);
            }
        }
    }

    export interface IResolutionData {
        actuals: Type[];
        exactCandidates: Signature[];
        conversionCandidates: Signature[];
        id: number;
    }

    export class ResolutionDataCache {
        public cacheSize = 16;
        public rdCache: IResolutionData[] = [];
        public nextUp: number = 0;

        constructor() {
            for (var i = 0; i < this.cacheSize; i++) {
                this.rdCache[i] = {
                    actuals: [],
                    exactCandidates: [],
                    conversionCandidates: [],
                    id: i
                };
            }
        }

        public getResolutionData(): IResolutionData {
            var rd: IResolutionData = null;

            if (this.nextUp < this.cacheSize) {
                rd = this.rdCache[this.nextUp];
            }

            if (rd === null) {
                this.cacheSize++;
                rd = {
                    actuals: [],
                    exactCandidates: [],
                    conversionCandidates: [],
                    id: this.cacheSize
                };
                this.rdCache[this.cacheSize] = rd;
            }

            // cache operates as a stack - RD is always served up in-order
            this.nextUp++;

            return rd;
        }

        public returnResolutionData(rd: IResolutionData) {
            // Pop to save on array allocations, which are a bottleneck
            // REVIEW: On some VMs, Array.pop doesn't always pop the last value in the array
            rd.actuals.length = 0;
            rd.exactCandidates.length = 0;
            rd.conversionCandidates.length = 0;

            this.nextUp = rd.id;
        }
    }
}