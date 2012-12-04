///<reference path='References.ts' />

enum DiagnosticCode {
    Unrecognized_escape_sequence,
    Unexpected_character_0,
    Missing_closing_quote_character,
    Identifier_expected,
    _0_keyword_expected,
    _0_expected,
    Identifier_expected__0_is_a_keyword,
    Automatic_semicolon_insertion_not_allowed,
    Unexpected_token__0_expected,
    Trailing_separator_not_allowed,
    _StarSlash__expected,
}

class DiagnosticMessages {
    private static codeToFormatString: string[] = [];
    private static initializeStaticData(): void {
        if (codeToFormatString.length === 0) {
            codeToFormatString[DiagnosticCode.Unrecognized_escape_sequence] = "Unrecognized escape sequence.";
            codeToFormatString[DiagnosticCode.Unexpected_character_0] = "Unexpected character '{0}'.";
            codeToFormatString[DiagnosticCode.Missing_closing_quote_character] = "Missing close quote character.";
            codeToFormatString[DiagnosticCode.Identifier_expected] = "Identifier expected.";
            codeToFormatString[DiagnosticCode._0_keyword_expected] = "'{0}' keyword expected.";
            codeToFormatString[DiagnosticCode._0_expected] = "'{0}' expected.";
            codeToFormatString[DiagnosticCode.Identifier_expected__0_is_a_keyword] = "Identifier expected; '{0}' is a keyword.";
            codeToFormatString[DiagnosticCode.Automatic_semicolon_insertion_not_allowed] = "Automatic semicolon insertion not allowed.";
            codeToFormatString[DiagnosticCode.Unexpected_token__0_expected] = "Unexpected token; '{0}' expected.";
            codeToFormatString[DiagnosticCode.Trailing_separator_not_allowed] = "Trailing separator not allowed.";
            codeToFormatString[DiagnosticCode._StarSlash__expected] = "'*/' expected.";
        }
    }

    private static getFormatString(code: DiagnosticCode): string {
        initializeStaticData();
        return codeToFormatString[code];
    }

    public static getDiagnosticMessage(code: DiagnosticCode, args: any[]): string {
        var formatString = getFormatString(code);

        var result = formatString.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined'
                ? args[num]
                : match;
        });

        return result;
    }
}