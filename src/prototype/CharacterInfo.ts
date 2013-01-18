///<reference path='CharacterCodes.ts' />
///<reference path='Debug.ts' />

class CharacterInfo {
    public static isDecimalDigit(c: number): bool {
        return c >= CharacterCodes._0 && c <= CharacterCodes._9;
    }

    public static isHexDigit(c: number): bool {
        return isDecimalDigit(c) ||
               (c >= CharacterCodes.A && c <= CharacterCodes.F) ||
               (c >= CharacterCodes.a && c <= CharacterCodes.f);
    }

    public static hexValue(c: number): number {
        Debug.assert(isHexDigit(c));
        return isDecimalDigit(c)
            ? (c - CharacterCodes._0)
            : (c >= CharacterCodes.A && c <= CharacterCodes.F)
                ? c - CharacterCodes.A + 10
                : c - CharacterCodes.a + 10;
    }

    public static isWhitespace(ch: number): bool {
        switch (ch) {
            case CharacterCodes.space:
            case CharacterCodes.tab:
            case CharacterCodes.verticalTab:
            case CharacterCodes.formFeed:
            case CharacterCodes.nonBreakingSpace:
            case CharacterCodes.byteOrderMark:
                return true;
        }

        return false;
    }

    public static isLineTerminator(ch: number): bool {
        switch (ch) {
            case CharacterCodes.carriageReturn:
            case CharacterCodes.lineFeed:
            case CharacterCodes.paragraphSeparator:
            case CharacterCodes.lineSeparator:
                return true;
        }

        return false;
    }
}