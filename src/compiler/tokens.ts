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
    export enum TokenID {
        // Keywords
        Any,
        Bool,
        Break,
        Case,
        Catch,
        Class,
        Const,
        Continue,
        Debugger,
        Default,
        Delete,
        Do,
        Else,
        Enum,
        Export,
        Extends,
        Declare,
        False,
        Finally,
        For,
        Function,
        Constructor,
        Get,
        If,
        Implements,
        Import,
        In,
        InstanceOf,
        Interface,
        Let,
        Module,
        New,
        Number,
        Null,
        Package,
        Private,
        Protected,
        Public,
        Return,
        Set,
        Static,
        String,
        Super,
        Switch,
        This,
        Throw,
        True,
        Try,
        TypeOf,
        Var,
        Void,
        With,
        While,
        Yield,
        // Punctuation
        Semicolon,
        OpenParen,
        CloseParen,
        OpenBracket,
        CloseBracket,
        OpenBrace,
        CloseBrace,
        Comma,
        Equals,
        PlusEquals,
        MinusEquals,
        AsteriskEquals,
        SlashEquals,
        PercentEquals,
        AmpersandEquals,
        CaretEquals,
        BarEquals,
        LessThanLessThanEquals,
        GreaterThanGreaterThanEquals,
        GreaterThanGreaterThanGreaterThanEquals,
        Question,
        Colon,
        BarBar,
        AmpersandAmpersand,
        Bar,
        Caret,
        And,
        EqualsEquals,
        ExclamationEquals,
        EqualsEqualsEquals,
        ExclamationEqualsEquals,
        LessThan,
        LessThanEquals,
        GreaterThan,
        GreaterThanEquals,
        LessThanLessThan,
        GreaterThanGreaterThan,
        GreaterThanGreaterThanGreaterThan,
        Plus,
        Minus,
        Asterisk,
        Slash,
        Percent,
        Tilde,
        Exclamation,
        PlusPlus,
        MinusMinus,
        Dot,
        DotDotDot,
        Error,
        EndOfFile,
        EqualsGreaterThan,
        Identifier,
        StringLiteral,
        RegularExpressionLiteral,
        NumberLiteral,
        Whitespace,
        Comment,
        Lim,
        LimFixed = EqualsGreaterThan,
        LimKeyword = Yield,
    }

    export var tokenTable: TokenInfo[] = [];
    export var nodeTypeTable: string[] = [];
    export var nodeTypeToTokTable: number[] = [];
    export var noRegexTable: bool[] = [];

    noRegexTable[TokenID.Identifier] = true;
    noRegexTable[TokenID.StringLiteral] = true;
    noRegexTable[TokenID.NumberLiteral] = true;
    noRegexTable[TokenID.RegularExpressionLiteral] = true;
    noRegexTable[TokenID.This] = true;
    noRegexTable[TokenID.PlusPlus] = true;
    noRegexTable[TokenID.MinusMinus] = true;
    noRegexTable[TokenID.CloseParen] = true;
    noRegexTable[TokenID.CloseBracket] = true;
    noRegexTable[TokenID.CloseBrace] = true;
    noRegexTable[TokenID.True] = true;
    noRegexTable[TokenID.False] = true;

    export enum OperatorPrecedence {
        None,
        Comma,
        Assignment,
        Conditional,
        LogicalOr,
        LogicalAnd,
        BitwiseOr,
        BitwiseExclusiveOr,
        BitwiseAnd,
        Equality,
        Relational,
        Shift,
        Additive,
        Multiplicative,
        Unary,
        Lim
    }

    export class TokenInfo {
        constructor(public binopPrecedence: number,
                    public binopNodeType: number,
                    public unopPrecedence: number,
                    public unopNodeType: number,
                    public text: string) {
        }
    }

    function setTokenInfo(tokenId: TokenID, binopPrecedence: number,
        binopNodeType: number, unopPrecedence: number, unopNodeType: number,
        text: string) {
        if (tokenId !== undefined) {
            tokenTable[tokenId] = new TokenInfo(binopPrecedence, binopNodeType, unopPrecedence, unopNodeType, text);
            if (binopNodeType != NodeType.None) {
                nodeTypeTable[binopNodeType] = text;
                nodeTypeToTokTable[binopNodeType] = tokenId;
            }
            if (unopNodeType != NodeType.None) {
                nodeTypeTable[unopNodeType] = text;
            }
        }
    }

    setTokenInfo(TokenID.Any, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "any");
    setTokenInfo(TokenID.Bool, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "bool");
    setTokenInfo(TokenID.Break, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "break");
    setTokenInfo(TokenID.Case, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "case");
    setTokenInfo(TokenID.Catch, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "catch");
    setTokenInfo(TokenID.Class, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "class");
    setTokenInfo(TokenID.Const, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "const");
    setTokenInfo(TokenID.Continue, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "continue");
    setTokenInfo(TokenID.Debugger, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.Debugger, "debugger");
    setTokenInfo(TokenID.Default, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "default");
    setTokenInfo(TokenID.Delete, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.Delete, "delete");
    setTokenInfo(TokenID.Do, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "do");
    setTokenInfo(TokenID.Else, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "else");
    setTokenInfo(TokenID.Enum, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "enum");
    setTokenInfo(TokenID.Export, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "export");
    setTokenInfo(TokenID.Extends, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "extends");
    setTokenInfo(TokenID.Declare, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "declare");
    setTokenInfo(TokenID.False, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "false");
    setTokenInfo(TokenID.Finally, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "finally");
    setTokenInfo(TokenID.For, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "for");
    setTokenInfo(TokenID.Function, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "function");
    setTokenInfo(TokenID.Constructor, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "constructor");
    setTokenInfo(TokenID.Get, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "get");
    setTokenInfo(TokenID.Set, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "set");
    setTokenInfo(TokenID.If, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "if");
    setTokenInfo(TokenID.Implements, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "implements");
    setTokenInfo(TokenID.Import, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "import");
    setTokenInfo(TokenID.In, OperatorPrecedence.Relational, NodeType.In, OperatorPrecedence.None, NodeType.None, "in");
    setTokenInfo(TokenID.InstanceOf, OperatorPrecedence.Relational, NodeType.InstOf, OperatorPrecedence.None, NodeType.None, "instanceof");
    setTokenInfo(TokenID.Interface, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "interface");
    setTokenInfo(TokenID.Let, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "let");
    setTokenInfo(TokenID.Module, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "module");
    setTokenInfo(TokenID.New, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "new");
    setTokenInfo(TokenID.Number, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "number");
    setTokenInfo(TokenID.Null, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "null");
    setTokenInfo(TokenID.Package, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "package");
    setTokenInfo(TokenID.Private, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "private");
    setTokenInfo(TokenID.Protected, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "protected");
    setTokenInfo(TokenID.Public, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "public");
    setTokenInfo(TokenID.Return, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "return");
    setTokenInfo(TokenID.Static, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "static");
    setTokenInfo(TokenID.String, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "string");
    setTokenInfo(TokenID.Super, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "super");
    setTokenInfo(TokenID.Switch, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "switch");
    setTokenInfo(TokenID.This, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "this");
    setTokenInfo(TokenID.Throw, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "throw");
    setTokenInfo(TokenID.True, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "true");
    setTokenInfo(TokenID.Try, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "try");
    setTokenInfo(TokenID.TypeOf, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.Typeof, "typeof");
    setTokenInfo(TokenID.Var, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "var");
    setTokenInfo(TokenID.Void, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.Void, "void");
    setTokenInfo(TokenID.With, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.WithStatement, "with");
    setTokenInfo(TokenID.While, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "while");
    setTokenInfo(TokenID.Yield, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "yield");

    setTokenInfo(TokenID.Identifier, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "identifier");
    setTokenInfo(TokenID.NumberLiteral, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "numberLiteral");
    setTokenInfo(TokenID.RegularExpressionLiteral, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "regex");
    setTokenInfo(TokenID.StringLiteral, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "qstring");

    // Non-operator non-identifier tokens
    setTokenInfo(TokenID.Semicolon, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, ";"); // ;
    setTokenInfo(TokenID.CloseParen, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, ")"); // )
    setTokenInfo(TokenID.CloseBracket, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "]"); // ]
    setTokenInfo(TokenID.OpenBrace, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "{"); // {
    setTokenInfo(TokenID.CloseBrace, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "}"); // }
    setTokenInfo(TokenID.DotDotDot, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "..."); // ...

    // Operator non-identifier tokens
    setTokenInfo(TokenID.Comma, OperatorPrecedence.Comma, NodeType.Comma, OperatorPrecedence.None, NodeType.None, ","); // ,
    setTokenInfo(TokenID.Equals, OperatorPrecedence.Assignment, NodeType.Asg, OperatorPrecedence.None, NodeType.None, "="); // =
    setTokenInfo(TokenID.PlusEquals, OperatorPrecedence.Assignment, NodeType.AsgAdd, OperatorPrecedence.None, NodeType.None, "+="); // +=
    setTokenInfo(TokenID.MinusEquals, OperatorPrecedence.Assignment, NodeType.AsgSub, OperatorPrecedence.None, NodeType.None, "-="); // -=
    setTokenInfo(TokenID.AsteriskEquals, OperatorPrecedence.Assignment, NodeType.AsgMul, OperatorPrecedence.None, NodeType.None, "*="); // *=

    setTokenInfo(TokenID.SlashEquals, OperatorPrecedence.Assignment, NodeType.AsgDiv, OperatorPrecedence.None, NodeType.None, "/="); // /=
    setTokenInfo(TokenID.PercentEquals, OperatorPrecedence.Assignment, NodeType.AsgMod, OperatorPrecedence.None, NodeType.None, "%="); // %=
    setTokenInfo(TokenID.AmpersandEquals, OperatorPrecedence.Assignment, NodeType.AsgAnd, OperatorPrecedence.None, NodeType.None, "&="); // &=
    setTokenInfo(TokenID.CaretEquals, OperatorPrecedence.Assignment, NodeType.AsgXor, OperatorPrecedence.None, NodeType.None, "^="); // ^=
    setTokenInfo(TokenID.BarEquals, OperatorPrecedence.Assignment, NodeType.AsgOr, OperatorPrecedence.None, NodeType.None, "|="); // |=
    setTokenInfo(TokenID.LessThanLessThanEquals, OperatorPrecedence.Assignment, NodeType.AsgLsh, OperatorPrecedence.None, NodeType.None, "<<="); // <<=
    setTokenInfo(TokenID.GreaterThanGreaterThanEquals, OperatorPrecedence.Assignment, NodeType.AsgRsh, OperatorPrecedence.None, NodeType.None, ">>="); // >>=
    setTokenInfo(TokenID.GreaterThanGreaterThanGreaterThanEquals, OperatorPrecedence.Assignment, NodeType.AsgRs2, OperatorPrecedence.None, NodeType.None, ">>>="); // >>>=
    setTokenInfo(TokenID.Question, OperatorPrecedence.Conditional, NodeType.ConditionalExpression, OperatorPrecedence.None, NodeType.None, "?"); // ?
    setTokenInfo(TokenID.Colon, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, ":"); // :
    setTokenInfo(TokenID.BarBar, OperatorPrecedence.LogicalOr, NodeType.LogOr, OperatorPrecedence.None, NodeType.None, "||"); // ||
    setTokenInfo(TokenID.AmpersandAmpersand, OperatorPrecedence.LogicalAnd, NodeType.LogAnd, OperatorPrecedence.None, NodeType.None, "&&"); // &&
    setTokenInfo(TokenID.Bar, OperatorPrecedence.BitwiseOr, NodeType.Or, OperatorPrecedence.None, NodeType.None, "|"); // |
    setTokenInfo(TokenID.Caret, OperatorPrecedence.BitwiseExclusiveOr, NodeType.Xor, OperatorPrecedence.None, NodeType.None, "^"); // ^
    setTokenInfo(TokenID.And, OperatorPrecedence.BitwiseAnd, NodeType.And, OperatorPrecedence.None, NodeType.None, "&"); // &
    setTokenInfo(TokenID.EqualsEquals, OperatorPrecedence.Equality, NodeType.Eq, OperatorPrecedence.None, NodeType.None, "=="); // ==
    setTokenInfo(TokenID.ExclamationEquals, OperatorPrecedence.Equality, NodeType.Ne, OperatorPrecedence.None, NodeType.None, "!="); // !=
    setTokenInfo(TokenID.EqualsEqualsEquals, OperatorPrecedence.Equality, NodeType.Eqv, OperatorPrecedence.None, NodeType.None, "==="); // ===
    setTokenInfo(TokenID.ExclamationEqualsEquals, OperatorPrecedence.Equality, NodeType.NEqv, OperatorPrecedence.None, NodeType.None, "!=="); // !==
    setTokenInfo(TokenID.LessThan, OperatorPrecedence.Relational, NodeType.Lt, OperatorPrecedence.None, NodeType.None, "<"); // <
    setTokenInfo(TokenID.LessThanEquals, OperatorPrecedence.Relational, NodeType.Le, OperatorPrecedence.None, NodeType.None, "<="); // <=
    setTokenInfo(TokenID.GreaterThan, OperatorPrecedence.Relational, NodeType.Gt, OperatorPrecedence.None, NodeType.None, ">"); // >
    setTokenInfo(TokenID.GreaterThanEquals, OperatorPrecedence.Relational, NodeType.Ge, OperatorPrecedence.None, NodeType.None, ">="); // >=
    setTokenInfo(TokenID.LessThanLessThan, OperatorPrecedence.Shift, NodeType.Lsh, OperatorPrecedence.None, NodeType.None, "<<"); // <<
    setTokenInfo(TokenID.GreaterThanGreaterThan, OperatorPrecedence.Shift, NodeType.Rsh, OperatorPrecedence.None, NodeType.None, ">>"); // >>
    setTokenInfo(TokenID.GreaterThanGreaterThanGreaterThan, OperatorPrecedence.Shift, NodeType.Rs2, OperatorPrecedence.None, NodeType.None, ">>>"); // >>>
    setTokenInfo(TokenID.Plus, OperatorPrecedence.Additive, NodeType.Add, OperatorPrecedence.Unary, NodeType.Pos, "+"); // +
    setTokenInfo(TokenID.Minus, OperatorPrecedence.Additive, NodeType.Sub, OperatorPrecedence.Unary, NodeType.Neg, "-"); // -
    setTokenInfo(TokenID.Asterisk, OperatorPrecedence.Multiplicative, NodeType.Mul, OperatorPrecedence.None, NodeType.None, "*"); // *
    setTokenInfo(TokenID.Slash, OperatorPrecedence.Multiplicative, NodeType.Div, OperatorPrecedence.None, NodeType.None, "/"); // /
    setTokenInfo(TokenID.Percent, OperatorPrecedence.Multiplicative, NodeType.Mod, OperatorPrecedence.None, NodeType.None, "%"); // %
    setTokenInfo(TokenID.Tilde, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.Not, "~"); // ~
    setTokenInfo(TokenID.Exclamation, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.LogNot, "!"); // !
    setTokenInfo(TokenID.PlusPlus, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.IncPre, "++"); // ++
    setTokenInfo(TokenID.MinusMinus, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.Unary, NodeType.DecPre, "--"); // --
    setTokenInfo(TokenID.OpenParen, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "("); // (
    setTokenInfo(TokenID.OpenBracket, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "["); // [
    setTokenInfo(TokenID.Dot, OperatorPrecedence.Unary, NodeType.None, OperatorPrecedence.None, NodeType.None, "."); // .
    setTokenInfo(TokenID.EndOfFile, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "<EOF>"); // EOF
    setTokenInfo(TokenID.EqualsGreaterThan, OperatorPrecedence.None, NodeType.None, OperatorPrecedence.None, NodeType.None, "=>"); // =>

    export function lookupToken(tokenId: TokenID): TokenInfo {
        return tokenTable[tokenId];
    }

    export enum TokenClass {
        Punctuation,
        Keyword,
        Operator,
        Comment,
        Whitespace,
        Identifier,
        NumberLiteral,
        StringLiteral,
        RegExpLiteral,
    }

    export class SavedToken {
        constructor (public tok: Token, public minChar: number, public limChar: number) { }
    }

    export class Token {
        constructor (public tokenId: TokenID) {
        }

        public toString() {
            return "token: " + this.tokenId + " " + this.getText() + " (" + (<any>TokenID)._map[this.tokenId] + ")";
        }

        public print(line: number, outfile) {
            outfile.WriteLine(this.toString() + ",on line" + line);
        }

        public getText(): string {
            return tokenTable[this.tokenId].text;
        }

        public classification(): TokenClass {
            if (this.tokenId <= TokenID.LimKeyword) {
                return TokenClass.Keyword;
            }
            else {
                var tokenInfo = lookupToken(this.tokenId);
                if (tokenInfo != undefined) {
                    if ((tokenInfo.unopNodeType != NodeType.None) ||
                        (tokenInfo.binopNodeType != NodeType.None)) {
                        return TokenClass.Operator;
                    }
                }
            }

            return TokenClass.Punctuation;
        }
    }
}