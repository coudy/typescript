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

///<reference path='typescriptServices.ts' />

module Services {
    var noRegexTable: bool[] = [];
    noRegexTable[TypeScript.SyntaxKind.IdentifierName] = true;
    noRegexTable[TypeScript.SyntaxKind.StringLiteral] = true;
    noRegexTable[TypeScript.SyntaxKind.NumericLiteral] = true;
    noRegexTable[TypeScript.SyntaxKind.RegularExpressionLiteral] = true;
    noRegexTable[TypeScript.SyntaxKind.ThisKeyword] = true;
    noRegexTable[TypeScript.SyntaxKind.PlusPlusToken] = true;
    noRegexTable[TypeScript.SyntaxKind.MinusMinusToken] = true;
    noRegexTable[TypeScript.SyntaxKind.CloseParenToken] = true;
    noRegexTable[TypeScript.SyntaxKind.CloseBracketToken] = true;
    noRegexTable[TypeScript.SyntaxKind.CloseBraceToken] = true;
    noRegexTable[TypeScript.SyntaxKind.TrueKeyword] = true;
    noRegexTable[TypeScript.SyntaxKind.FalseKeyword] = true;

    export class Classifier {
        private scanner: TypeScript.Scanner1;
        private characterWindow: number[] = TypeScript.ArrayUtilities.createArray(2048, 0);
        private diagnostics: TypeScript.SyntaxDiagnostic[] = [];

        constructor(public host: IClassifierHost) {
        }

        /// COLORIZATION
        public getClassificationsForLine(text: string, lexState: TypeScript.LexState): ClassificationResult {
            var result = new ClassificationResult();
            var scanner = new TypeScript.Scanner1("", TypeScript.SimpleText.fromString(text), TypeScript.LanguageVersion.EcmaScript5, this.characterWindow);

            if (this.checkForContinuedToken(text, lexState, result)) {
                return result;
            }

            var lastTokenKind = TypeScript.SyntaxKind.None;

            while (true) {
                this.diagnostics.length = 0;
                var token = scanner.scan(this.diagnostics, !noRegexTable[lastTokenKind]);
                lastTokenKind = token.tokenKind;

                this.processToken(text, token, result);
            }

            return result;
        }

        private processToken(text: string, token: TypeScript.ISyntaxToken, result: ClassificationResult): void {
            this.processTriviaList(text, token.leadingTrivia(), result);
            this.addResult(text, result, token.width(), token.tokenKind);
            this.processTriviaList(text, token.trailingTrivia(), result);

            if (this.scanner.absoluteIndex() === text.length) {
                // We're at the end.
                if (this.diagnostics.length > 0) {
                    if (this.diagnostics[this.diagnostics.length - 1].diagnosticCode() === TypeScript.DiagnosticCode._StarSlash__expected) {
                        result.finalLexState = TypeScript.LexState.InMultilineComment;
                        return;
                    }

                    if (this.diagnostics[this.diagnostics.length - 1].diagnosticCode() === TypeScript.DiagnosticCode.Missing_closing_quote_character) {
                        var quoteChar = token.text().charCodeAt(0);
                        result.finalLexState = quoteChar === TypeScript.CharacterCodes.doubleQuote
                            ? TypeScript.LexState.InMultilineDoubleQuoteString
                            : TypeScript.LexState.InMultilineSingleQuoteString;
                    }
                }
            }
        }

        private processTriviaList(text, triviaList: TypeScript.ISyntaxTriviaList, result: ClassificationResult): void {
            for (var i = 0, n = triviaList.count(); i < n; i++) {
                var trivia = triviaList.syntaxTriviaAt(i);
                this.addResult(text, result, trivia.fullWidth(), trivia.kind());
            }
        }

        private addResult(text: string, result: ClassificationResult, length: number, kind: TypeScript.SyntaxKind): void {
            if (length > 0) {
                result.entries.push(new ClassificationInfo(length, this.classFromKind(kind)));
            }
        }

        private classFromKind(kind: TypeScript.SyntaxKind) {
            if (TypeScript.SyntaxFacts.isAnyKeyword(kind)) {
                return TypeScript.TokenClass.Keyword;
            }
            else if (TypeScript.SyntaxFacts.isBinaryExpressionOperatorToken(kind) ||
                     TypeScript.SyntaxFacts.isPrefixUnaryExpressionOperatorToken(kind)) {
                return TypeScript.TokenClass.Operator;
            }
            else if (TypeScript.SyntaxFacts.isAnyPunctuation(kind)) {
                return TypeScript.TokenClass.Punctuation;
            }

            switch (kind) {
                case TypeScript.SyntaxKind.WhitespaceTrivia:
                    return TypeScript.TokenClass.Whitespace;
                case TypeScript.SyntaxKind.MultiLineCommentTrivia:
                case TypeScript.SyntaxKind.SingleLineCommentTrivia:
                    return TypeScript.TokenClass.Comment;
                case TypeScript.SyntaxKind.NumericLiteral:
                    return TypeScript.TokenClass.NumberLiteral;
                case TypeScript.SyntaxKind.StringLiteral:
                    return TypeScript.TokenClass.StringLiteral;
                case TypeScript.SyntaxKind.RegularExpressionLiteral:
                    return TypeScript.TokenClass.RegExpLiteral;
                case TypeScript.SyntaxKind.IdentifierName:
                default:
                    return TypeScript.TokenClass.Identifier;
            }
        }

        private checkForContinuedToken(text: string, lexState: TypeScript.LexState, result: ClassificationResult): bool {
            if (lexState === TypeScript.LexState.InMultilineComment) {
                return this.handleMultilineComment(text, lexState, result);
            }
            else if (lexState === TypeScript.LexState.InMultilineDoubleQuoteString ||
                     lexState === TypeScript.LexState.InMultilineSingleQuoteString) {
                return this.handleMultilineString(text, lexState, result);
            }
            else {
                return false;
            }
        }

        private handleMultilineComment(text: string, lexState: TypeScript.LexState, result: ClassificationResult): bool {
            var index = text.indexOf("*/");
            if (index >= 0) {
                var commentEnd = index + "*/".length;
                this.scanner.setAbsoluteIndex(commentEnd);
                result.entries.push(new ClassificationInfo(commentEnd, TypeScript.TokenClass.Comment));
                return false;
            }
            else {
                // Comment didn't end.
                result.entries.push(new ClassificationInfo(text.length, TypeScript.TokenClass.Comment));
                result.finalLexState = TypeScript.LexState.InMultilineComment;
                return true;
            }
        }

        private handleMultilineString(text: string, lexState: TypeScript.LexState, result: ClassificationResult): bool {
            var endChar = lexState === TypeScript.LexState.InMultilineDoubleQuoteString
                ? TypeScript.CharacterCodes.doubleQuote
                : TypeScript.CharacterCodes.singleQuote;

            var seenBackslash = true;
            for (var i = 0, n = text.length; i < n; i++) {
                if (seenBackslash) {
                    // Ignore this character.
                    seenBackslash = false;
                    continue;
                }

                var ch = text.charCodeAt(i);
                if (ch === TypeScript.CharacterCodes.backslash) {
                    seenBackslash = true;
                    continue;
                }

                if (ch === endChar) {
                    var stringEnd = i + 1;
                    this.scanner.setAbsoluteIndex(stringEnd);
                    result.entries.push(new ClassificationInfo(stringEnd, TypeScript.TokenClass.StringLiteral));
                    return false;
                }
            }

            this.scanner.setAbsoluteIndex(text.length);
            result.entries.push(new ClassificationInfo(
                text.length,
                TypeScript.TokenClass.StringLiteral));

            // We didn't see an terminator.  If the line ends with \ then we're still in 
            // teh string literal.  Otherwise, we're done.
            if (seenBackslash) {
                result.finalLexState = lexState;
            }
            else {
                result.finalLexState = TypeScript.LexState.Start;
            }

            return true;
        }
    }

    export interface IClassifierHost extends TypeScript.ILogger {
    }

    export class ClassificationResult {
        public finalLexState: TypeScript.LexState = TypeScript.LexState.Start;
        public entries: ClassificationInfo[] = [];

        constructor() {
        }
    }

    export class ClassificationInfo {
        constructor(public length: number, public classification: TypeScript.TokenClass) {
        }
    }
}
