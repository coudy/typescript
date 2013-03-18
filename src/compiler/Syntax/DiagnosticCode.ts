module TypeScript {
    export enum DiagnosticCode {
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
        _public_or_private_modifier_must_precede__static_,
        Unexpected_token_,
    }

    export class DiagnosticMessages1 {
        private static codeToFormatString: string[] = [];
        private static initializeStaticData(): void {
            if (DiagnosticMessages1.codeToFormatString.length === 0) {
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Unrecognized_escape_sequence] = "Unrecognized escape sequence.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Unexpected_character_0] = "Unexpected character {0}.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Missing_closing_quote_character] = "Missing close quote character.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Identifier_expected] = "Identifier expected.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode._0_keyword_expected] = "'{0}' keyword expected.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode._0_expected] = "'{0}' expected.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Identifier_expected__0_is_a_keyword] = "Identifier expected; '{0}' is a keyword.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Automatic_semicolon_insertion_not_allowed] = "Automatic semicolon insertion not allowed.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Unexpected_token__0_expected] = "Unexpected token; '{0}' expected.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Trailing_separator_not_allowed] = "Trailing separator not allowed.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode._StarSlash__expected] = "'*/' expected.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode._public_or_private_modifier_must_precede__static_] = "'public' or 'private' modifier must precede 'static'.";
                DiagnosticMessages1.codeToFormatString[DiagnosticCode.Unexpected_token_] = "Unexpected token.";
            }
        }

        private static getFormatString(code: DiagnosticCode): string {
            DiagnosticMessages1.initializeStaticData();
            return DiagnosticMessages1.codeToFormatString[code];
        }

        public static getDiagnosticMessage(code: DiagnosticCode, args: any[]): string {
            var formatString = DiagnosticMessages1.getFormatString(code);

            var result = formatString.replace(/{(\d+)}/g, function (match, num) {
                return typeof args[num] !== 'undefined'
                    ? args[num]
                    : match;
            });

            return result;
        }
    }
}