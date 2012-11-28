///<reference path='References.ts' />

class SyntaxToken {
    public static create(fullStart: number,
                         leadingTriviaInfo: ScannerTriviaInfo,
                         tokenInfo: ScannerTokenInfo,
                         trailingTriviaInfo: ScannerTriviaInfo,
                         diagnostics: DiagnosticInfo[]): ISyntaxToken {
        // TODO: use a more efficient implementation for when there is no trivia, or the kind is
        // one of the well known types.

        return createStandardToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo, diagnostics);
    }

    public static toJSON(token: ISyntaxToken) {
        var result: any = {
            kind: (<any>SyntaxKind)._map[token.kind()]
        };

        if (token.keywordKind() != SyntaxKind.None) {
            result.keywordKind = (<any>SyntaxKind)._map[token.keywordKind()];
        }

        result.start = token.start();
        if (token.fullStart() != token.start()) {
            result.fullStart = token.fullStart();
        }

        result.width = token.width();
        if (token.fullWidth() != token.width()) {
            result.fullWidth = token.fullWidth();
        }

        if (token.isMissing()) {
            result.isMissing = true;
        }

        result.text = token.text();

        if (token.value() !== null) {
            result.value() = token.value;
        }

        if (token.valueText() !== null) {
            result.valueText = token.valueText();
        }

        if (token.hasLeadingTrivia()) {
            result.hasLeadingTrivia = true;
        }

        if (token.hasLeadingCommentTrivia()) {
            result.hasLeadingCommentTrivia = true;
        }

        if (token.hasLeadingNewLineTrivia()) {
            result.hasLeadingNewLineTrivia = true;
        }

        if (token.hasTrailingTrivia()) {
            result.hasTrailingTrivia = true;
        }

        if (token.hasTrailingCommentTrivia()) {
            result.hasTrailingCommentTrivia = true;
        }

        if (token.hasTrailingNewLineTrivia()) {
            result.hasTrailingNewLineTrivia = true;
        }

        var diagnostics = token.diagnostics();
        if (diagnostics && diagnostics.length > 0) {
            result.diagnostics = diagnostics;
        }

        return result;
    }

    public static createStandardToken(fullStart: number,
                                      leadingTriviaInfo: ScannerTriviaInfo,
                                      tokenInfo: ScannerTokenInfo,
                                      trailingTriviaInfo: ScannerTriviaInfo,
                                      diagnostics: DiagnosticInfo[]): ISyntaxToken {
        var kind = tokenInfo.Kind;
        var keywordKind = tokenInfo.KeywordKind;
        var text = tokenInfo.Text == null ? SyntaxFacts.getText(kind) : tokenInfo.Text;
        Contract.throwIfNull(text);
        var leadingWidth = leadingTriviaInfo.Width;
        var trailingWidth = trailingTriviaInfo.Width;

        var leadingComment = leadingTriviaInfo.HasComment;
        var trailingComment = trailingTriviaInfo.HasComment;

        var leadingNewLine = leadingTriviaInfo.HasNewLine;
        var trailingNewLine = trailingTriviaInfo.HasNewLine;

        var token: ISyntaxToken = null;
        token = {
            toJSON:(key) => SyntaxToken.toJSON(token),
            kind: () => kind,
            keywordKind: () => keywordKind,
            fullStart: () => fullStart,
            fullWidth: () => leadingWidth + text.length + trailingWidth,
            start: () => fullStart + leadingWidth,
            width: () => text.length,
            isMissing: () => false,
            text: () => text,
            fullText: (itext: IText): string => {
                return itext.toString(new TextSpan(fullStart, leadingWidth)) +
                       text +
                       itext.toString(new TextSpan(fullStart + leadingWidth + text.length, trailingWidth));
            },
            value: () => {
                // TODO: return proper value here.
                return null;
            },
            valueText: () => {
                // TODO: return proper value here.
                return null;
            },
            diagnostics: () => diagnostics,
            hasLeadingTrivia: () => leadingWidth > 0,
            hasLeadingCommentTrivia: () => leadingComment,
            hasLeadingNewLineTrivia: () => leadingNewLine,
            hasTrailingTrivia: () => trailingWidth > 0,
            hasTrailingCommentTrivia: () => trailingComment,
            hasTrailingNewLineTrivia: () => trailingNewLine,
            leadingTrivia: (text: IText): ISyntaxTriviaList => {
                throw Errors.notYetImplemented();
            },
            trailingTrivia: (text: IText): ISyntaxTriviaList => {
                throw Errors.notYetImplemented();
            },
        };

        return token;
    }

    // TODO: This needs to take in the proper position.
    public static createEmptyToken(kind: SyntaxKind): ISyntaxToken {
        var token: ISyntaxToken;
        token = {
            toJSON:(key) => SyntaxToken.toJSON(token),
            kind: () => kind,
            keywordKind: () => SyntaxKind.None,
            fullStart: () => 0,
            fullWidth: () => 0,
            start: () => 0,
            width: () => 0,
            isMissing: () => true,
            text: () => "",
            fullText: (itext: IText): string => "",
            value: () => null,
            valueText: () => "",
            diagnostics: () => [],
            hasLeadingTrivia: () => false,
            hasLeadingCommentTrivia: () => false,
            hasLeadingNewLineTrivia: () => false,
            hasTrailingTrivia: () => false,
            hasTrailingCommentTrivia: () => false,
            hasTrailingNewLineTrivia: () => false,
            leadingTrivia: (text: IText): ISyntaxTriviaList => SyntaxTriviaList.empty,
            trailingTrivia: (text: IText): ISyntaxTriviaList => SyntaxTriviaList.empty,
        };

        return token;
    }
}