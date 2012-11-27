///<reference path='References.ts' />

enum DiagnosticCode {
    Unrecognized_escape_sequence = 0,
    Unexpected_character_0 = 1,
    Missing_closing_quote_character = 2,
    Identifier_expected = 3,
    _0_keyword_expected = 4,
    _0_expected = 5,
    Identifier_expected__0_is_a_keyword = 6,
}

class DiagnosticMessages {
    private static codeToFormatString: string[] = [];
    private static initializeStaticData(): void {
        if (codeToFormatString.length == 0) {
            codeToFormatString[DiagnosticCode.Unrecognized_escape_sequence] = "Unrecognized escape sequence.";
            codeToFormatString[DiagnosticCode.Unexpected_character_0] = "Unexpected character '{0}'.";
            codeToFormatString[DiagnosticCode.Missing_closing_quote_character] = "Missing close quote character.";
            codeToFormatString[DiagnosticCode.Identifier_expected] = "Identifier expected.";
            codeToFormatString[DiagnosticCode._0_keyword_expected] = "'{0}' keyword expected.";
            codeToFormatString[DiagnosticCode._0_expected] = "'{0}' expected.";
            codeToFormatString[DiagnosticCode.Identifier_expected__0_is_a_keyword] = "Identifier expected; '{0}' is a keyword.";
        }
    }

    private static getFormatString(code: DiagnosticCode): string {
        initializeStaticData();
        return codeToFormatString[code];
    }

    public static getDiagnosticMessage(code: DiagnosticCode, args: any[]): string {
        var formatString = getFormatString(code);

        var result = formatString.replace(/{(\d+)}/g, function(match, num) { 
            return typeof args[num] !== 'undefined'
                ? args[num]
                : match;
        });

        return result;
    }
}