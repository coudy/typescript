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

module Services {

    class ForwardBranceMatchingWalker extends TextSpanWalker {
        private openBraceCount = 0;
        public closingBracePosition: TextSpan = null;

        constructor(span: TextSpan, private bracePosition: number, private openningBraceKind: SyntaxKind, private closingBraceKind: SyntaxKind) {
            super(span);
        }
        
        public visitToken(token: ISyntaxToken): void {
            var tokenStart = this.position() + token.leadingTriviaWidth();
            if (tokenStart > this.bracePosition) {
                if (token.kind() === this.closingBraceKind && token.fullWidth() > 0) {
                    if (this.openBraceCount === 0) {
                        this.closingBracePosition = new TextSpan(tokenStart, token.width());
                    }
                    this.openBraceCount--;
                } else if (token.kind() === this.openningBraceKind && token.fullWidth() > 0) {
                    this.openBraceCount++;
                }
            }
            super.visitToken(token);
        }

        public visitNode(node: SyntaxNode): void {
            if (this.closingBracePosition !== null) {
                // Found a matching brace
                return;
            }
            super.visitNode(node);
        }

        public static getMatchingCloseBrace(node: SourceUnitSyntax, bracePosition: number, openningBraceKind: SyntaxKind, closingBraceKind: SyntaxKind): TextSpan {
            var forwardBranceMatchingWalker = new ForwardBranceMatchingWalker(new TextSpan(bracePosition, node.fullWidth()), bracePosition, openningBraceKind, closingBraceKind);
            node.accept(forwardBranceMatchingWalker);
            return forwardBranceMatchingWalker.closingBracePosition;
        }
    }

    class BackwardBranceMatchingWalker extends TextSpanWalker {
        public openBracePositions: TextSpan[] = [];

        constructor(span: TextSpan, private bracePosition: number, private openningBraceKind: SyntaxKind, private closingBraceKind: SyntaxKind) {
            super(span);
        }

        public visitToken(token: ISyntaxToken): void {
            var tokenStart = this.position() + token.leadingTriviaWidth();
            if (tokenStart < this.bracePosition) {
                if (token.kind() === this.openningBraceKind && token.fullWidth() > 0) {
                    this.openBracePositions.push(new TextSpan(tokenStart, token.width()));
                } else if (token.kind() === this.closingBraceKind && token.fullWidth() > 0) {
                    this.openBracePositions.pop();
                }
            }
            super.visitToken(token);
        }

        public static getMatchingOpenBrace(node: SourceUnitSyntax, bracePosition: number, openningBraceKind: SyntaxKind, closingBraceKind: SyntaxKind): TextSpan {
            var backwardBranceMatchingWalker = new BackwardBranceMatchingWalker(new TextSpan(0, bracePosition), bracePosition, openningBraceKind, closingBraceKind);
            node.accept(backwardBranceMatchingWalker);
            return backwardBranceMatchingWalker.openBracePositions.pop();
        }
    }

    export class BraceMatchingManager {
        
        constructor(private syntaxTree: SyntaxTree) {
        }

        // Given a script name and position in the script, return a pair of text range if the 
        // position corresponds to a "brace matchin" characters (e.g. "{" or "(", etc.)
        // If the position is not on any range, return "null".
        public getBraceMatchingAtPosition(position: number): TextRange[] {

            var openBraceKinds = [SyntaxKind.OpenBraceToken, SyntaxKind.OpenParenToken, SyntaxKind.OpenBracketToken];
            var closeBraceKinds = [SyntaxKind.CloseBraceToken, SyntaxKind.CloseParenToken, SyntaxKind.CloseBracketToken];

            var result = new TextRange[]();

            // Check if the current token is an open brace
            var findTokenResult = this.syntaxTree.sourceUnit().findToken(position);
            if (findTokenResult.token.fullWidth() > 0) {
                var openBraceKindIndex = openBraceKinds.indexOf(findTokenResult.token.kind());
                if (openBraceKindIndex >= 0) {
                    var bracePosition = findTokenResult.fullStart + findTokenResult.token.leadingTriviaWidth();
                    if (bracePosition == position) {
                        var closeBracePosition = ForwardBranceMatchingWalker.getMatchingCloseBrace(this.syntaxTree.sourceUnit(), position, openBraceKinds[openBraceKindIndex], closeBraceKinds[openBraceKindIndex]);
                        if (closeBracePosition) {
                            var range1 = new TextRange(position, position + 1);
                            var range2 = new TextRange(closeBracePosition.start(), closeBracePosition.end());
                            result.push(range1, range2);
                        }
                    }
                }
            }

            // Check if the current token to the left is a close brace
            if (findTokenResult.fullStart > position - 1) {
                findTokenResult = this.syntaxTree.sourceUnit().findTokenOnLeft(position);
            }
            if (findTokenResult.token.fullWidth() > 0) {
                var closeBraceKindIndex = closeBraceKinds.indexOf(findTokenResult.token.kind());
                if (closeBraceKindIndex >= 0) {
                    var bracePosition = findTokenResult.fullStart + findTokenResult.token.leadingTriviaWidth();
                    if (bracePosition == (position - 1)) {
                        var openBracePosition = BackwardBranceMatchingWalker.getMatchingOpenBrace(this.syntaxTree.sourceUnit(), position - 1, openBraceKinds[closeBraceKindIndex], closeBraceKinds[closeBraceKindIndex]);
                        if (openBracePosition) {
                            var range1 = new TextRange(position - 1, position);
                            var range2 = new TextRange(openBracePosition.start(), openBracePosition.end());
                            result.push(range1, range2);
                        }
                    }
                }
            }
            return result;
        }
    }
}
