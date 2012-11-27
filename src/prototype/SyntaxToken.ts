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
        return {
            diagnostics: token.diagnostics(),
            fullStart: token.fullStart(),
            fullWidth: token.fullWidth(),
            hasLeadingTrivia: token.hasLeadingTrivia(),
            hasLeadingCommentTrivia: token.hasLeadingCommentTrivia(),
            hasLeadingNewLineTrivia: token.hasLeadingNewLineTrivia(),
            hasTrailingTrivia: token.hasTrailingTrivia(),
            hasTrailingCommentTrivia: token.hasTrailingComentTrivia(),
            hasTrailingNewLineTrivia: token.hasTrailingNewLineTrivia(),
            isMissing: token.isMissing(),
            keywordKind: (<any>SyntaxKind)._map[token.keywordKind()],
            kind: (<any>SyntaxKind)._map[token.kind()],
            start: token.start(),
            text: token.text(),
            value: token.value(),
            valueText: token.valueText(),
            width: token.width()
        };
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
            hasTrailingComentTrivia: () => trailingComment,
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
            hasTrailingComentTrivia: () => false,
            hasTrailingNewLineTrivia: () => false,
            leadingTrivia: (text: IText): ISyntaxTriviaList => SyntaxTriviaList.empty,
            trailingTrivia: (text: IText): ISyntaxTriviaList => SyntaxTriviaList.empty,
        };

        return token;
    }
}