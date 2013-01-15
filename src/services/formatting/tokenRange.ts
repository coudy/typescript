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

///<reference path='formatting.ts' />


module Formatting {
    export module Shared {
        export interface ITokenAccess {
            GetTokens(): List_AuthorTokenKind;
            Contains(token: AuthorTokenKind): bool;
        }

        export class TokenRangeAccess implements ITokenAccess {
            private tokens: List_AuthorTokenKind;

            constructor(from: AuthorTokenKind, to: AuthorTokenKind, except: AuthorTokenKind[]) {
                this.tokens = new List_AuthorTokenKind();
                for (var token = from; token <= to; token++) {
                    if (except.indexOf(token) < 0) {
                        this.tokens.add(token);
                    }
                }
            }

            public GetTokens(): List_AuthorTokenKind {
                return this.tokens;
            }

            public Contains(token: AuthorTokenKind): bool {
                return this.tokens.contains(token);
            }


            public toString(): string {
                return "[tokenRangeStart=" + (<any>AuthorTokenKind)._map[this.tokens.get(0)] + "," +
                 "tokenRangeEnd=" + (<any>AuthorTokenKind)._map[this.tokens.get(this.tokens.count()-1)] + "]";
            }
        }

        export class TokenValuesAccess implements ITokenAccess {
            private tokens: List_AuthorTokenKind;

            constructor(tks: AuthorTokenKind[]) {
                this.tokens = new List_AuthorTokenKind();
                this.tokens.addAll(tks);
            }

            public GetTokens(): List_AuthorTokenKind {
                return this.tokens;
            }

            public Contains(token: AuthorTokenKind): bool {
                return this.GetTokens().contains(token);
            }
        }

        export class TokenSingleValueAccess implements ITokenAccess {
            constructor(public token: AuthorTokenKind) {
            }

            public GetTokens(): List_AuthorTokenKind {
                var result = new List_AuthorTokenKind();
                result.add(this.token);
                return result;
            }

            public Contains(tokenValue: AuthorTokenKind): bool {
                return tokenValue == this.token;
            }

            public toString(): string {
                return "[singleTokenKind=" + (<any>AuthorTokenKind)._map[this.token] + "]";
            }
        }

        export class TokenAllAccess implements ITokenAccess {
            public GetTokens(): List_AuthorTokenKind {
                var result = new List_AuthorTokenKind();
                for (var token = AuthorTokenKind.atkEnd; token < AuthorTokenKind.Length; token++) {
                    result.add(token);
                }
                return result;
            }

            public Contains(tokenValue: AuthorTokenKind): bool {
                return true;
            }

            public toString(): string {
                return "[allTokens]";
            }
        }

        export class TokenRange {
            constructor(public tokenAccess: ITokenAccess) {
            }

            static FromToken(token: AuthorTokenKind): TokenRange {
                return new TokenRange(new TokenSingleValueAccess(token));
            }

            static FromTokens(tokens: AuthorTokenKind[]): TokenRange {
                return new TokenRange(new TokenValuesAccess(tokens));
            }

            static FromRange(f: AuthorTokenKind, to: AuthorTokenKind, except: AuthorTokenKind[] = []): TokenRange {
                return new TokenRange(new TokenRangeAccess(f, to, except));
            }

            static AllTokens(): TokenRange {
                return new TokenRange(new TokenAllAccess());
            }

            public GetTokens(): List_AuthorTokenKind {
                return this.tokenAccess.GetTokens();
            }

            public Contains(token: AuthorTokenKind): bool {
                return this.tokenAccess.Contains(token);
            }

            public toString(): string {
                return this.tokenAccess.toString();
            }

            static Any: TokenRange = AllTokens();
            static Keywords = TokenRange.FromRange(AuthorTokenKind.atkBreak, AuthorTokenKind.atkWith);
            static Operators = TokenRange.FromRange(AuthorTokenKind.atkSColon, AuthorTokenKind.atkScope);
            static BinaryOperators = TokenRange.FromRange(AuthorTokenKind.atkArrow, AuthorTokenKind.atkPct);
            static BinaryKeywordOperators = TokenRange.FromTokens([AuthorTokenKind.atkIn, AuthorTokenKind.atkInstanceof]);
            static ReservedKeywords = TokenRange.FromRange(AuthorTokenKind.atkImplements, AuthorTokenKind.atkYield);
            static UnaryPrefixOperators = TokenRange.FromTokens([AuthorTokenKind.atkAdd, AuthorTokenKind.atkSub, AuthorTokenKind.atkTilde, AuthorTokenKind.atkBang]);
            static UnaryPrefixExpressions = TokenRange.FromTokens([AuthorTokenKind.atkNumber, AuthorTokenKind.atkIdentifier, AuthorTokenKind.atkLParen, AuthorTokenKind.atkLBrack, AuthorTokenKind.atkLCurly, AuthorTokenKind.atkThis, AuthorTokenKind.atkNew]);
            static UnaryPreincrementExpressions = TokenRange.FromTokens([AuthorTokenKind.atkIdentifier, AuthorTokenKind.atkLParen, AuthorTokenKind.atkThis, AuthorTokenKind.atkNew]);
            static UnaryPostincrementExpressions = TokenRange.FromTokens([AuthorTokenKind.atkIdentifier, AuthorTokenKind.atkRParen, AuthorTokenKind.atkRBrack, AuthorTokenKind.atkNew]);
            static UnaryPredecrementExpressions = TokenRange.FromTokens([AuthorTokenKind.atkIdentifier, AuthorTokenKind.atkLParen, AuthorTokenKind.atkThis, AuthorTokenKind.atkNew]);
            static UnaryPostdecrementExpressions = TokenRange.FromTokens([AuthorTokenKind.atkIdentifier, AuthorTokenKind.atkRParen, AuthorTokenKind.atkRBrack, AuthorTokenKind.atkNew]);
        }
    }
}
