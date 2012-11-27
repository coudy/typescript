///<reference path='References.ts' />

class TextBase implements IText {
    /// <summary>
    /// The line start position of each line.
    /// </summary>
    private lazyLineStarts: number[] = null;

    /// <summary>
    /// The length of the text represented by <see cref="T:StringText"/>.
    /// </summary>
    public length(): number {
        throw Errors.abstract();
    }

    /// <summary>
    /// Returns a character at given position.
    /// </summary>
    /// <param name="position">The position to get the character from.</param>
    /// <returns>The character.</returns>
    /// <exception cref="T:ArgumentOutOfRangeException">When position is negative or 
    /// greater than <see cref="T:"/> length.</exception>
    public charCodeAt(position: number): number {
        throw Errors.abstract();
    }

    checkSubSpan(span: TextSpan): void {
        if (span.start() < 0 || span.start() > this.length() || span.end() > this.length()) {
            throw Errors.argumentOutOfRange("span");
        }
    }

    /// <summary>
    /// Provides a string representation of the StringText located within given span.
    /// </summary>
    /// <exception cref="T:ArgumentOutOfRangeException">When given span is outside of the text range.</exception>
    public toString(span?: TextSpan = null): string {
        throw Errors.abstract();
    }

    public getSubText(span: TextSpan): IText {
        this.checkSubSpan(span);

        return new SubText(this, span);
    }

    /// <summary>
    /// Copy a range of characters from this IText to a destination array.
    /// </summary>
    public copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void {
        throw Errors.abstract();
    }

    /// <summary>
    /// The length of the text represented by <see cref="T:StringText"/>.
    /// </summary>
    public lineCount(): number {
        return this.lineStarts().length;
    }

    /// <summary>
    /// The sequence of lines represented by <see cref="T:StringText"/>.
    /// </summary>
    public lines(): ITextLine[] {
        var lines: ITextLine[] = [];

        var length = this.lineCount();
        for (var i = 0; i < length; ++i) {
            lines[i] = this.getLineFromLineNumber(i);
        }

        return lines;
    }

    private lineStarts(): number[] {
        if (this.lazyLineStarts === null) {
            this.lazyLineStarts = this.parseLineStarts();
        }

        return this.lazyLineStarts;
    }

    private linebreakInfo = new LinebreakInfo(0, 0);
    public getLineFromLineNumber(lineNumber: number): ITextLine {
        var lineStarts = this.lineStarts();

        if (lineNumber < 0 || lineNumber >= lineStarts.length) {
            throw Errors.argumentOutOfRange("lineNumber");
        }

        var first = lineStarts[lineNumber];
        if (lineNumber === lineStarts.length - 1) {
            return new TextLine(this, new TextSpan(first, this.length() - first), 0, lineNumber);
        }
        else {
            TextUtilities.getStartAndLengthOfLineBreakEndingAt(this, lineStarts[lineNumber + 1] - 1, this.linebreakInfo);
            return new TextLine(this, new TextSpan(first, this.linebreakInfo.startPosition - first), this.linebreakInfo.length, lineNumber);
        }

    }

    private lastLineFoundForPosition: ITextLine = null;
    public getLineFromPosition(position: number): ITextLine {
        // After asking about a location on a particular line
        // it is common to ask about other position in the same line again.
        // try to see if this is the case.
        var lastFound = this.lastLineFoundForPosition;
        if (lastFound !== null &&
            lastFound.start() <= position &&
            lastFound.endIncludingLineBreak() > position) {
            return lastFound;
        }

        var lineNumber = this.getLineNumberFromPosition(position);

        var result = this.getLineFromLineNumber(lineNumber);
        this.lastLineFoundForPosition = result;
        return result;
    }

    public getLineNumberFromPosition(position: number): number {
        if (position < 0 || position > this.length()) {
            throw Errors.argumentOutOfRange("position");
        }

        if (position === this.length()) {
            // this can happen when the user tried to get the line of items
            // that are at the absolute end of this text (i.e. the EndOfLine
            // token, or missing tokens that are at the end of the text).
            // In this case, we want the last line in the text.
            return this.lineCount() - 1;
        }

        // Binary search to find the right line
        var lineNumber = ArrayUtilities.binarySearch(this.lineStarts(), position);
        if (lineNumber < 0) {
            lineNumber = (~lineNumber) - 1;
        }

        return lineNumber;
    }

    public getLinePosition(position: number): LinePosition {
        if (position < 0 || position > this.length()) {
            throw Errors.argumentOutOfRange("position");
        }

        var lineNumber = this.getLineNumberFromPosition(position);

        return new LinePosition(lineNumber, position - this.lineStarts()[lineNumber]);
    }

    private parseLineStarts(): number[] {
        var length = this.length();

        // Corner case check
        if (0 === this.length()) {
            var result: number[] = [];
            result.push(0);
            return result;
        }

        var position = 0;
        var index = 0;
        var arrayBuilder: number[] = [];
        var lineNumber = 0;

        // The following loop goes through every character in the text. It is highly
        // performance critical, and thus inlines knowledge about common line breaks
        // and non-line breaks.
        while (index < length) {
            var c = this.charCodeAt(0);
            var lineBreakLength;

            // common case - ASCII & not a line break
            if (c > CharacterCodes.carriageReturn && c <= 127) {
                index++;
                continue;
            }
            else if (c === CharacterCodes.carriageReturn && index + 1 < length && this.charCodeAt(index + 1) === CharacterCodes.newLine) {
                lineBreakLength = 2;
            }
            else if (c === CharacterCodes.newLine) {
                lineBreakLength = 1;
            }
            else {
                lineBreakLength = TextUtilities.getLengthOfLineBreak(this, index);
            }

            if (0 == lineBreakLength) {
                index++;
            }
            else {
                arrayBuilder.push(position);
                index += lineBreakLength;
                position = index;
                lineNumber++;
            }
        }

        // Create a start for the final line.  
        arrayBuilder.push(position);

        return arrayBuilder;
    }
}