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

module TypeScript.Formatting {
    export class MultipleTokenIndenter extends IndentationTrackingWalker {
        private _edits: TextEditInfo[] = [];
        public options: FormattingOptions;

        constructor(textSpan: TextSpan, sourceUnit: SourceUnitSyntax, snapshot: ITextSnapshot, indentFirstToken: bool, options: FormattingOptions) {
            super(textSpan, sourceUnit, snapshot, indentFirstToken);

            this.options = options;
        }

        public indentToken(token: ISyntaxToken, indentationLevel: number, commentIndentationLevel: number): void {
            // Ignore generated tokens
            if (token.fullWidth() === 0) {
                return;
            }

            // If we have any skipped tokens as children, do not process this node for indentation or formatting
            if (this.parent().hasSkippedOrMissingTokenChild()) {
                return;
            }

            // Be strict, and only consider nodes that fall inside the span. This avoids indenting a multiline string
            // on enter at the end of, as the whole token was not included in the span
            var tokenSpan = new TextSpan(this.position() + token.leadingTriviaWidth(), token.width());
            if (!this.textSpan().containsTextSpan(tokenSpan)) {
                return;
            }

            // Compute an indentation string for this token
            var indentationAmount = indentationLevel * this.options.indentSpaces;
            var indentationString = Indentation.indentationString(indentationAmount, this.options);

            var commentIndentationAmount = commentIndentationLevel * this.options.indentSpaces;
            var commentIndentationString = Indentation.indentationString(commentIndentationAmount, this.options);

            // Record any needed indentation edits
            this.recordIndentationEditsForToken(token, indentationString, commentIndentationString);
        }

        public edits(): TextEditInfo[]{
            return this._edits;
        }

        public recordEdit(position: number, length: number, replaceWith: string): void {
            this._edits.push(new TextEditInfo(position, length, replaceWith));
        }

        private recordIndentationEditsForToken(token: ISyntaxToken, indentationString: string, commentIndentationString: string) {
            var position = this.position();
            var indentNextTokenOrTrivia = true;

            // Process any leading trivia if any
            var triviaList = token.leadingTrivia();
            if (triviaList) {
                for (var i = 0, length = triviaList.count(); i < length; i++) {
                    var trivia = triviaList.syntaxTriviaAt(i);

                    switch (trivia.kind()) {
                        case SyntaxKind.MultiLineCommentTrivia:
                            // If the multiline comment spans multiple lines, we need to add the right indent amount to
                            // each successive line segment as well.
                            if (indentNextTokenOrTrivia) {
                                this.recordIndentationEditsForMultiLineComment(trivia, position, commentIndentationString);
                                indentNextTokenOrTrivia = false;
                            }
                            break;

                        case SyntaxKind.SingleLineCommentTrivia:
                        case SyntaxKind.SkippedTextTrivia:
                            if (indentNextTokenOrTrivia) {
                                this.recordIndentationEditsForSingleLineOrSkippedText(trivia, position, commentIndentationString);
                                indentNextTokenOrTrivia = false;
                            }
                            break;

                        case SyntaxKind.WhitespaceTrivia:
                            if (indentNextTokenOrTrivia) {
                                var isLastTrivia = (i + 1 == length);
                                if (isLastTrivia) {
                                    // this is the white space trivia preceeding the token text, use it to indent the token
                                    this.recordIndentationEditsForWhitespace(trivia, position, indentationString);
                                } 
                                
                                indentNextTokenOrTrivia = false;
                            }
                            break;

                        case SyntaxKind.NewLineTrivia:
                            // We hit a newline processing the trivia.  We need to add the indentation to the 
                            // next line as well.  Note: don't bother indenting the newline itself.  This will 
                            // just insert ugly whitespace that most users probably will not want.
                            indentNextTokenOrTrivia = true;
                            break;

                        default:
                            throw Errors.invalidOperation();
                    }

                    position += trivia.fullWidth();
                }

            }

            if (token.kind() !== SyntaxKind.EndOfFileToken && indentNextTokenOrTrivia) {
                // If the last trivia item was a new line, or no trivia items were encounterd record the 
                // indentation edit at the token position
                if (indentationString.length > 0) {
                    this.recordEdit(position, 0, indentationString);
                }
            }
        }

        private recordIndentationEditsForSingleLineOrSkippedText(trivia: ISyntaxTrivia, fullStart: number, indentationString: string): void {
            // Record the edit
            if (indentationString.length > 0) {
                this.recordEdit(fullStart, 0, indentationString);
            }
        }

        private recordIndentationEditsForWhitespace(trivia: ISyntaxTrivia, fullStart: number, indentationString: string): void {
            var text = trivia.fullText();

            // Check if the current indentation matches the desired indentation or not
            if (indentationString === text) {
                return;
            }

            // Record the edit 
            this.recordEdit(fullStart, text.length, indentationString);
        }

        private recordIndentationEditsForMultiLineComment(trivia: ISyntaxTrivia, fullStart: number, indentationString: string): void {
            // If the multiline comment spans multiple lines, we need to add the right indent amount to
            // each successive line segment as well.
            var position = fullStart;
            var segments = Syntax.splitMultiLineCommentTriviaIntoMultipleLines(trivia);

            for (var i = 1; i < segments.length; i++) {
                var segment = segments[i];
                this.recordIndentationEditsForSegment(segment, position, indentationString);
                position += segment.length;
            }
        }

        private recordIndentationEditsForSegment(segment: string, fullStart: number, indentationString: string): void {
            // Find the position of the first non whitespace character in the segment.
            var firstNonWhitespacePosition = Indentation.firstNonWhitespacePosition(segment);

            if (firstNonWhitespacePosition < segment.length &&
                CharacterInfo.isLineTerminator(segment.charCodeAt(firstNonWhitespacePosition))) {

                // If this segment was just a newline, then don't bother indenting it.  That will just
                // leave the user with an ugly indent in their output that they probably do not want.
                return;
            }

            // Check if the current indentation matches the desired indentation or not
            if (indentationString === segment.substring(0, firstNonWhitespacePosition)) {
                return;
            }

            // Record the edit 
            this.recordEdit(fullStart, firstNonWhitespacePosition, indentationString);
        }
    }
}