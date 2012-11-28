///<reference path='References.ts' />

class SyntaxFacts {
    private static textToKeywordKind: any = {
        "break": SyntaxKind.BreakKeyword,
        "case": SyntaxKind.CaseKeyword,
        "catch": SyntaxKind.CatchKeyword,
        "class": SyntaxKind.ClassKeyword,
        "continue": SyntaxKind.ContinueKeyword,
        "const": SyntaxKind.ConstKeyword,
        "constructor": SyntaxKind.ConstructorKeyword,
        "debugger": SyntaxKind.DebuggerKeyword,
        "default": SyntaxKind.DefaultKeyword,
        "delete": SyntaxKind.DeleteKeyword,
        "do": SyntaxKind.DoKeyword,
        "else": SyntaxKind.ElseKeyword,
        "enum": SyntaxKind.EnumKeyword,
        "export": SyntaxKind.ExportKeyword,
        "extends": SyntaxKind.ExtendsKeyword,
        "false": SyntaxKind.FalseKeyword,
        "finally": SyntaxKind.FinallyKeyword,
        "for": SyntaxKind.ForKeyword,
        "function": SyntaxKind.FunctionKeyword,
        "get": SyntaxKind.GetKeyword,
        "if": SyntaxKind.IfKeyword,
        "implements": SyntaxKind.ImplementsKeyword,
        "import": SyntaxKind.ImportKeyword,
        "in": SyntaxKind.InKeyword,
        "instanceof": SyntaxKind.InstanceOfKeyword,
        "interface": SyntaxKind.InterfaceKeyword,
        "let": SyntaxKind.LetKeyword,
        "module": SyntaxKind.ModuleKeyword,
        "new": SyntaxKind.NewKeyword,
        "null": SyntaxKind.NullKeyword,
        "package": SyntaxKind.PackageKeyword,
        "private": SyntaxKind.PrivateKeyword,
        "protected": SyntaxKind.ProtectedKeyword,
        "public": SyntaxKind.PublicKeyword,
        "return": SyntaxKind.ReturnKeyword,
        "set": SyntaxKind.SetKeyword,
        "static": SyntaxKind.StaticKeyword,
        "super": SyntaxKind.SuperKeyword,
        "switch": SyntaxKind.SwitchKeyword,
        "this": SyntaxKind.ThisKeyword,
        "throw": SyntaxKind.ThrowKeyword,
        "true": SyntaxKind.TrueKeyword,
        "try": SyntaxKind.TryKeyword,
        "typeof": SyntaxKind.TypeOfKeyword,
        "var": SyntaxKind.VarKeyword,
        "void": SyntaxKind.VoidKeyword,
        "while": SyntaxKind.WhileKeyword,
        "with": SyntaxKind.WithKeyword,
        "yield": SyntaxKind.YieldKeyword,

        "{": SyntaxKind.OpenBraceToken,
        "}": SyntaxKind.CloseBraceToken,
        "(": SyntaxKind.OpenParenToken,
        ")": SyntaxKind.CloseParenToken,
        "[": SyntaxKind.OpenBracketToken,
        "]": SyntaxKind.CloseBracketToken,
        ".": SyntaxKind.DotToken,
        "...": SyntaxKind.DotDotDotToken,
        ";": SyntaxKind.SemicolonToken,
        ",": SyntaxKind.CommaToken,
        "<": SyntaxKind.LessThanToken,
        ">": SyntaxKind.GreaterThanToken,
        "<=": SyntaxKind.LessThanEqualsToken,
        ">=": SyntaxKind.GreaterThanEqualsToken,
        "==": SyntaxKind.EqualsEqualsToken,
        "=>": SyntaxKind.EqualsGreaterThanToken,
        "!=": SyntaxKind.ExclamationEqualsToken,
        "===": SyntaxKind.EqualsEqualsEqualsToken,
        "!==": SyntaxKind.ExclamationEqualsEqualsToken,
        "+": SyntaxKind.PlusToken,
        "-": SyntaxKind.MinusToken,
        "*": SyntaxKind.AsteriskToken,
        "%": SyntaxKind.PercentToken,
        "++": SyntaxKind.PlusPlusToken,
        "--": SyntaxKind.MinusMinusToken,
        "<<": SyntaxKind.LessThanLessThanToken,
        ">>": SyntaxKind.GreaterThanGreaterThanToken,
        ">>>": SyntaxKind.GreaterThanGreaterThanGreaterThanToken,
        "&": SyntaxKind.AmpersandToken,
        "|": SyntaxKind.BarToken,
        "^": SyntaxKind.CaretToken,
        "!": SyntaxKind.ExclamationToken,
        "~": SyntaxKind.TildeToken,
        "&&": SyntaxKind.AmpersandAmpersandToken,
        "||": SyntaxKind.BarBarToken,
        "?": SyntaxKind.QuestionToken,
        ":": SyntaxKind.ColonToken,
        "=": SyntaxKind.EqualsToken,
        "+=": SyntaxKind.PlusEqualsToken,
        "-=": SyntaxKind.MinusEqualsToken,
        "*=": SyntaxKind.AsteriskEqualsToken,
        "%=": SyntaxKind.PercentEqualsToken,
        "<<=": SyntaxKind.LessThanLessThanEqualsToken,
        ">>=": SyntaxKind.GreaterThanGreaterThanEqualsToken,
        ">>>=": SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
        "&=": SyntaxKind.AmpersandEqualsToken,
        "|=": SyntaxKind.BarEqualsToken,
        "^=": SyntaxKind.CaretEqualsToken,
        "/": SyntaxKind.SlashToken,
        "/=": SyntaxKind.SlashEqualsToken,
    };

    private static kindToText: string[] = [];
    private static initializeStaticData() {
        if (SyntaxFacts.kindToText.length == 0) {
            for (var name in SyntaxFacts.textToKeywordKind) {
                if (SyntaxFacts.textToKeywordKind.hasOwnProperty(name)) {
                    Debug.assert(kindToText[SyntaxFacts.textToKeywordKind[name]] === undefined);
                    kindToText[SyntaxFacts.textToKeywordKind[name]] = name;
                }
            }
        }
    }

    public static getTokenKind(text: string): SyntaxKind {
        if (SyntaxFacts.textToKeywordKind.hasOwnProperty(text)) {
            return SyntaxFacts.textToKeywordKind[text];
        }

        return SyntaxKind.None;
    }

    public static getText(kind: SyntaxKind): string {
        SyntaxFacts.initializeStaticData();
        var result = SyntaxFacts.kindToText[kind];
        return result !== undefined ? result : null;
    }

    public static isTokenKind(kind: SyntaxKind): bool {
        return kind >= SyntaxKind.FirstToken && kind <= SyntaxKind.LastToken;
    }

    public static isAnyKeyword(kind: SyntaxKind): bool {
        return kind >= SyntaxKind.FirstKeyword && kind <= SyntaxKind.LastKeyword;
    }

    public static isStandardKeyword(kind: SyntaxKind): bool {
        return kind >= SyntaxKind.FirstStandardKeyword && kind <= SyntaxKind.LastStandardKeyword;
    }

    public static isFutureReservedKeyword(kind: SyntaxKind): bool {
        return kind >= SyntaxKind.FirstFutureReservedKeyword && kind <= SyntaxKind.LastFutureReservedKeyword;
    }

    public static isFutureReservedStrictKeyword(kind: SyntaxKind): bool {
        return kind >= SyntaxKind.FirstFutureReservedStrictKeyword && kind <= SyntaxKind.LastFutureReservedStrictKeyword;
    }

    public static isAnyPunctuation(kind: SyntaxKind): bool {
        return kind >= SyntaxKind.FirstPunctuation && kind <= SyntaxKind.LastPunctuation;
    }

    public static isPrefixUnaryExpressionOperatorToken(tokenKind: SyntaxKind): bool {
        return getPrefixUnaryExpression(tokenKind) != SyntaxKind.None;
    }

    public static getPrefixUnaryExpression(tokenKind: SyntaxKind): SyntaxKind {
        switch (tokenKind) {
            case SyntaxKind.PlusToken:
                return SyntaxKind.PlusExpression;
            case SyntaxKind.MinusToken:
                return SyntaxKind.NegateExpression;
            case SyntaxKind.TildeToken:
                return SyntaxKind.BitwiseNotExpression;
            case SyntaxKind.ExclamationToken:
                return SyntaxKind.LogicalNotExpression;
            case SyntaxKind.PlusPlusToken:
                return SyntaxKind.PreIncrementExpression;
            case SyntaxKind.MinusMinusToken:
                return SyntaxKind.PreDecrementExpression;
            case SyntaxKind.DeleteKeyword:
                return SyntaxKind.DeleteExpression;
            case SyntaxKind.TypeOfKeyword:
                return SyntaxKind.TypeOfExpression;
            case SyntaxKind.VoidKeyword:
                return SyntaxKind.VoidExpression;
            default:
                return SyntaxKind.None;
        }
    }

    public static getPostfixUnaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind {
        switch (tokenKind) {
            case SyntaxKind.PlusPlusToken:
                return SyntaxKind.PostIncrementExpression;
            case SyntaxKind.MinusMinusToken:
                return SyntaxKind.PostDecrementExpression;
            default:
                return SyntaxKind.None;
        }
    }

    public static isBinaryExpressionOperatorToken(tokenKind: SyntaxKind): bool {
        return getBinaryExpressionFromOperatorToken(tokenKind) !== SyntaxKind.None;
    }

    public static getBinaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind {
        switch (tokenKind) {
            case SyntaxKind.AsteriskToken:
                return SyntaxKind.MultiplyExpression;

            case SyntaxKind.SlashToken:
                return SyntaxKind.DivideExpression;

            case SyntaxKind.PercentToken:
                return SyntaxKind.ModuloExpression;

            case SyntaxKind.PlusToken:
                return SyntaxKind.AddExpression;

            case SyntaxKind.MinusToken:
                return SyntaxKind.SubtractExpression;

            case SyntaxKind.LessThanLessThanToken:
                return SyntaxKind.LeftShiftExpression;

            case SyntaxKind.GreaterThanGreaterThanToken:
                return SyntaxKind.SignedRightShiftExpression;

            case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                return SyntaxKind.UnsignedRightShiftExpression;

            case SyntaxKind.LessThanToken:
                return SyntaxKind.LessThanExpression;

            case SyntaxKind.GreaterThanToken:
                return SyntaxKind.GreaterThanExpression;

            case SyntaxKind.LessThanEqualsToken:
                return SyntaxKind.LessThanOrEqualExpression;

            case SyntaxKind.GreaterThanEqualsToken:
                return SyntaxKind.GreaterThanOrEqualExpression;

            case SyntaxKind.InstanceOfKeyword:
                return SyntaxKind.InstanceOfExpression;

            case SyntaxKind.InKeyword:
                return SyntaxKind.InExpression;

            case SyntaxKind.EqualsEqualsToken:
                return SyntaxKind.EqualsWithTypeConversionExpression;

            case SyntaxKind.ExclamationEqualsToken:
                return SyntaxKind.NotEqualsWithTypeConversionExpression;

            case SyntaxKind.EqualsEqualsEqualsToken:
                return SyntaxKind.EqualsExpression;

            case SyntaxKind.ExclamationEqualsEqualsToken:
                return SyntaxKind.NotEqualsExpression;

            case SyntaxKind.AmpersandToken:
                return SyntaxKind.BitwiseAndExpression;

            case SyntaxKind.CaretToken:
                return SyntaxKind.BitwiseExclusiveOrExpression;

            case SyntaxKind.BarToken:
                return SyntaxKind.BitwiseOrExpression;

            case SyntaxKind.AmpersandAmpersandToken:
                return SyntaxKind.LogicalAndExpression;

            case SyntaxKind.BarBarToken:
                return SyntaxKind.LogicalOrExpression;

            case SyntaxKind.BarEqualsToken:
                return SyntaxKind.OrAssignmentExpression;

            case SyntaxKind.AmpersandEqualsToken:
                return SyntaxKind.AndAssignmentExpression;

            case SyntaxKind.CaretEqualsToken:
                return SyntaxKind.ExclusiveOrAssignmentExpression;

            case SyntaxKind.LessThanLessThanEqualsToken:
                return SyntaxKind.LeftShiftAssignmentExpression;

            case SyntaxKind.GreaterThanGreaterThanEqualsToken:
                return SyntaxKind.SignedRightShiftAssignmentExpression;

            case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                return SyntaxKind.UnsignedRightShiftAssignmentExpression;

            case SyntaxKind.PlusEqualsToken:
                return SyntaxKind.AddAssignmentExpression;

            case SyntaxKind.MinusEqualsToken:
                return SyntaxKind.SubtractAssignmentExpression;

            case SyntaxKind.AsteriskEqualsToken:
                return SyntaxKind.MultiplyAssignmentExpression;

            case SyntaxKind.SlashEqualsToken:
                return SyntaxKind.DivideAssignmentExpression;

            case SyntaxKind.PercentEqualsToken:
                return SyntaxKind.ModuloAssignmentExpression;

            case SyntaxKind.EqualsToken:
                return SyntaxKind.AssignmentExpression;

            case SyntaxKind.CommaToken:
                return SyntaxKind.CommaExpression;

            default:
                return SyntaxKind.None;
        }
    }
}