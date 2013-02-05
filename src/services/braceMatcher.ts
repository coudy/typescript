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
///<reference path='..\prototype\TextSpanWalker.ts' />
///<reference path='..\prototype\SyntaxUtilities.ts' />

module Services {
    export class BraceMatcher {

        // Given a script name and position in the script, return a pair of text range if the 
        // position corresponds to a "brace matchin" characters (e.g. "{" or "(", etc.)
        // If the position is not on any range, return an empty set.
        public static getMatchSpans(syntaxTree: SyntaxTree, position: number): TextSpan[] {
            var result: TextSpan[] = [];

            var currentToken = syntaxTree.sourceUnit().findToken(position);

            getMatchingCloseBrace(currentToken, position, result);
            getMatchingOpenBrace(currentToken, position, result);

            return result;
        }

        private static getMatchingCloseBrace(currentToken: PositionedToken, position: number, result: TextSpan[]) {
            if (currentToken.start() === position) {
                var closingBraceKind = getMatchingCloseBraceTokenKind(currentToken);
                if (closingBraceKind !== null) {
                    var parentElement = currentToken.parentElement();
                    var currentPosition = currentToken.parent().start();
                    for (var i = 0, n = parentElement.childCount(); i < n; i++) {
                        var element = parentElement.childAt(i);
                        if (element !== null && element.fullWidth() > 0) {
                            if (element.kind() === closingBraceKind) {
                                var range1 = new TextSpan(position, currentToken.token().width());
                                var range2 = new TextSpan(currentPosition + element.leadingTriviaWidth(), element.width());
                                result.push(range1, range2);
                                break;
                            }

                            currentPosition += element.fullWidth();
                        }
                    }
                }
            }
        }

        private static getMatchingOpenBrace(currentToken: PositionedToken, position: number, result: TextSpan[]) {
            // Check if the current token to the left is a close brace
            if (currentToken.fullStart() === position) {
                currentToken = currentToken.previousToken();
            }

            if (currentToken.start() === (position - 1)) {
                var openBraceKind = getMatchingOpenBraceTokenKind(currentToken);
                if (openBraceKind !== null) {
                    var parentElement = currentToken.parentElement();
                    var currentPosition = currentToken.parent().fullStart() + parentElement.fullWidth();
                    for (var i = parentElement.childCount() - 1 ; i >= 0; i--) {
                        var element = parentElement.childAt(i);
                        if (element !== null && element.fullWidth() > 0) {
                            if (element.kind() === openBraceKind) {
                                var range1 = new TextSpan(position - 1, currentToken.token().width());
                                var range2 = new TextSpan(currentPosition - element.trailingTriviaWidth() - element.width(), element.width());
                                result.push(range1, range2);
                                break;
                            }

                            currentPosition -= element.fullWidth();
                        }
                    }
                }
            }
        }

        private static getMatchingCloseBraceTokenKind(positionedElement: PositionedElement): SyntaxKind {
            var element = positionedElement !== null && positionedElement.element();
            switch (element.kind()) {
                case SyntaxKind.OpenBraceToken:
                    return SyntaxKind.CloseBraceToken
                case SyntaxKind.OpenParenToken:
                    return SyntaxKind.CloseParenToken;
                case SyntaxKind.OpenBracketToken:
                    return SyntaxKind.CloseBracketToken;
                case SyntaxKind.LessThanToken:
                    return SyntaxUtilities.isAngleBracket(positionedElement) ? SyntaxKind.GreaterThanToken : null;
            }
            return null;
        }

        private static getMatchingOpenBraceTokenKind(positionedElement: PositionedElement): SyntaxKind {
            var element = positionedElement !== null && positionedElement.element();
            switch (element.kind()) {
                case SyntaxKind.CloseBraceToken:
                    return SyntaxKind.OpenBraceToken
                case SyntaxKind.CloseParenToken:
                    return SyntaxKind.OpenParenToken;
                case SyntaxKind.CloseBracketToken:
                    return SyntaxKind.OpenBracketToken;
                case SyntaxKind.GreaterThanToken:
                    return SyntaxUtilities.isAngleBracket(positionedElement) ? SyntaxKind.LessThanToken : null;
            }
            return null;
        }
    }
}
