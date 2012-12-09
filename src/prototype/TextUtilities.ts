///<reference path='References.ts' />

class LinebreakInfo {
    constructor (public startPosition: number, public length: number) {
    }
}

class TextUtilities {
    /// <summary>
    /// Return startLineBreak = index-1, lengthLineBreak = 2   if there is a \r\n at index-1
    /// Return startLineBreak = index,   lengthLineBreak = 1   if there is a 1-char newline at index
    /// Return startLineBreak = index+1, lengthLineBreak = 0   if there is no newline at index.
    /// </summary>
    public static getStartAndLengthOfLineBreakEndingAt(
        text: IText, index: number, info: LinebreakInfo): void {

        var c = text.charCodeAt(index);
        if (c === CharacterCodes.lineFeed) {
            if (index > 0 && text.charCodeAt(index - 1) === CharacterCodes.carriageReturn) {
                // "\r\n" is the only 2-character line break.
                info.startPosition = index - 1;
                info.length = 2;
            }
            else {
                info.startPosition = index;
                info.length = 1;
            }
        }
        else if (isAnyLineBreakCharacter(c)) {
            info.startPosition = index;
            info.length = 1;
        }
        else {
            info.startPosition = index + 1;
            info.length = 0;
        }
    }

    private static isAnyLineBreakCharacter(c: number): bool {
        return c === CharacterCodes.lineFeed ||
               c === CharacterCodes.carriageReturn ||
               c === CharacterCodes.nextLine ||
               c === CharacterCodes.lineSeparator ||
               c === CharacterCodes.paragraphSeparator;
    }

    private static getLengthOfLineBreak(text: IText, index: number): number {
        var c = text.charCodeAt(index);

        // common case - ASCII & not a line break
        if (c > CharacterCodes.carriageReturn && c <= 127) {
            return 0;
        }

        return this.getLengthOfLineBreakSlow(text, index, c);
    }

    private static getLengthOfLineBreakSlow(text: IText, index: number, c: number): number {
        if (c === CharacterCodes.carriageReturn) {
            var next = index + 1;
            return (next < text.length()) && CharacterCodes.lineFeed === text.charCodeAt(next) ? 2 : 1;
        }
        else if (isAnyLineBreakCharacter(c)) {
            return 1;
        }
        else {
            return 0;
        }
    }
}