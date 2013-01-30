///<reference path='..\Core\ArrayUtilities.ts' />
///<reference path='CharacterCodes.ts' />
///<reference path='IText.ts' />
///<reference path='..\Core\StringUtilities.ts' />
///<reference path='..\Core\StringTable.ts' />

module TextFactory {
    function getLengthOfLineBreakSlow(text: IText, index: number, c: number): number {
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

    function getLengthOfLineBreak(text: IText, index: number): number {
        var c = text.charCodeAt(index);

        // common case - ASCII & not a line break
        if (c > CharacterCodes.carriageReturn && c <= 127) {
            return 0;
        }

        return getLengthOfLineBreakSlow(text, index, c);
    }

    function isAnyLineBreakCharacter(c: number): bool {
        return c === CharacterCodes.lineFeed ||
               c === CharacterCodes.carriageReturn ||
               c === CharacterCodes.nextLine ||
               c === CharacterCodes.lineSeparator ||
               c === CharacterCodes.paragraphSeparator;
    }

    /// <summary>
    /// Return startLineBreak = index-1, lengthLineBreak = 2   if there is a \r\n at index-1
    /// Return startLineBreak = index,   lengthLineBreak = 1   if there is a 1-char newline at index
    /// Return startLineBreak = index+1, lengthLineBreak = 0   if there is no newline at index.
    /// </summary>
    function getStartAndLengthOfLineBreakEndingAt(
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

    class LinebreakInfo {
        constructor(public startPosition: number,
                     public length: number) {
        }
    }

    class TextLine implements ITextLine {
        private _text: IText = null;
        private _textSpan: TextSpan = null;
        private _lineBreakLength: number;
        private _lineNumber: number;

        constructor(text: IText, body: TextSpan, lineBreakLength: number, lineNumber: number) {
            Contract.throwIfNull(text);
            Contract.throwIfFalse(lineBreakLength >= 0);
            Contract.requires(lineNumber >= 0);
            this._text = text;
            this._textSpan = body;
            this._lineBreakLength = lineBreakLength;
            this._lineNumber = lineNumber;
        }

        public start(): number {
            return this._textSpan.start();
        }

        public end(): number {
            return this._textSpan.end();
        }

        public endIncludingLineBreak(): number {
            return this.end() + this._lineBreakLength;
        }

        public extent(): TextSpan {
            return this._textSpan;
        }

        public extentIncludingLineBreak(): TextSpan {
            return TextSpan.fromBounds(this.start(), this.endIncludingLineBreak());
        }

        public toString(): string {
            return this._text.toString(this._textSpan);
        }

        public lineNumber(): number {
            return this._lineNumber;
        }
    }

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

        public subText(span: TextSpan): IText {
            this.checkSubSpan(span);

            return new SubText(this, span);
        }

        public substr(start: number, length: number, intern: bool): string {
            throw Errors.abstract();
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
                getStartAndLengthOfLineBreakEndingAt(this, lineStarts[lineNumber + 1] - 1, this.linebreakInfo);
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
                var c = this.charCodeAt(index);
                var lineBreakLength;

                // common case - ASCII & not a line break
                if (c > CharacterCodes.carriageReturn && c <= 127) {
                    index++;
                    continue;
                }
                else if (c === CharacterCodes.carriageReturn && index + 1 < length && this.charCodeAt(index + 1) === CharacterCodes.lineFeed) {
                    lineBreakLength = 2;
                }
                else if (c === CharacterCodes.lineFeed) {
                    lineBreakLength = 1;
                }
                else {
                    lineBreakLength = getLengthOfLineBreak(this, index);
                }

                if (0 === lineBreakLength) {
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

    /// <summary>
    /// An IText that represents a subrange of another IText.
    /// </summary>
    class SubText extends TextBase {
        private text: IText;
        private span: TextSpan;

        constructor(text: IText, span: TextSpan) {
            super();

            if (text === null) {
                throw Errors.argumentNull("text");
            }

            if (span.start() < 0 ||
                span.start() >= text.length() ||
                 span.end() < 0 ||
                 span.end() > text.length()) {
                throw Errors.argument("span");
            }

            this.text = text;
            this.span = span;
        }

        public length(): number {
            return this.span.length();
        }

        public charCodeAt(position: number): number {
            if (position < 0 || position > this.length()) {
                throw Errors.argumentOutOfRange("position");
            }

            return this.text.charCodeAt(this.span.start() + position);
        }

        public subText(span: TextSpan): IText {
            this.checkSubSpan(span);

            return new SubText(this.text, this.getCompositeSpan(span.start(), span.length()));
        }

        public copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void {
            var span = this.getCompositeSpan(sourceIndex, count);
            this.text.copyTo(span.start(), destination, destinationIndex, span.length());
        }

        private getCompositeSpan(start: number, length: number): TextSpan {
            var compositeStart = MathPrototype.min(this.text.length(), this.span.start() + start);
            var compositeEnd = MathPrototype.min(this.text.length(), compositeStart + length);
            return new TextSpan(compositeStart, compositeEnd - compositeStart);
        }
    }

    /// <summary>
    /// Implementation of IText based on a <see cref="T:System.String"/> input
    /// </summary>
    class StringText extends TextBase {
        /// <summary>
        /// Underlying string on which this IText instance is based
        /// </summary>
        private source: string = null;

        /// <summary>
        /// Initializes an instance of <see cref="T:StringText"/> with provided data.
        /// </summary>
        constructor(data: string) {
            super();

            if (data === null) {
                throw Errors.argumentNull("data");
            }

            this.source = data;
        }

        /// <summary>
        /// The length of the text represented by <see cref="T:StringText"/>.
        /// </summary>
        public length(): number {
            return this.source.length;
        }

        /// <summary>
        /// Returns a character at given position.
        /// </summary>
        /// <param name="position">The position to get the character from.</param>
        /// <returns>The character.</returns>
        /// <exception cref="T:ArgumentOutOfRangeException">When position is negative or 
        /// greater than <see cref="T:"/> length.</exception>
        public charCodeAt(position: number): number {
            if (position < 0 || position >= this.source.length) {
                throw Errors.argumentOutOfRange("position");
            }

            return this.source.charCodeAt(position);
        }

        public substr(start: number, length: number, intern: bool) {
            return this.source.substr(start, length);
        }

        /// <summary>
        /// Provides a string representation of the StringText located within given span.
        /// </summary>
        /// <exception cref="T:ArgumentOutOfRangeException">When given span is outside of the text range.</exception>
        public toString(span?: TextSpan = null): string {
            if (span === null) {
                span = new TextSpan(0, this.length());
            }

            this.checkSubSpan(span);

            if (span.start() === 0 && span.length() === this.length()) {
                return this.source;
            }

            return this.source.substr(span.start(), span.length());
        }

        public copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void {
            StringUtilities.copyTo(this.source, sourceIndex, destination, destinationIndex, count);
        }
    }

    var stringTable = Collections.createStringTable();



    /// <summary>
    /// An IText that represents a subrange of another IText.
    /// </summary>
    class SimpleSubText implements ISimpleText {
        private text: ISimpleText = null;
        private span: TextSpan = null;

        constructor(text: ISimpleText, span: TextSpan) {
            if (text === null) {
                throw Errors.argumentNull("text");
            }

            if (span.start() < 0 ||
                span.start() >= text.length() ||
                 span.end() < 0 ||
                 span.end() > text.length()) {
                throw Errors.argument("span");
            }

            this.text = text;
            this.span = span;
        }

        private checkSubSpan(span: TextSpan): void {
            if (span.start() < 0 || span.start() > this.length() || span.end() > this.length()) {
                throw Errors.argumentOutOfRange("span");
            }
        }

        public length(): number {
            return this.span.length();
        }

        public subText(span: TextSpan): ISimpleText {
            this.checkSubSpan(span);

            return new SimpleSubText(this.text, this.getCompositeSpan(span.start(), span.length()));
        }

        public copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void {
            var span = this.getCompositeSpan(sourceIndex, count);
            this.text.copyTo(span.start(), destination, destinationIndex, span.length());
        }

        public substr(start: number, length: number, intern: bool): string {
            var span = this.getCompositeSpan(start, length);
            return this.text.substr(span.start(), span.length(), intern);
        }

        private getCompositeSpan(start: number, length: number): TextSpan {
            var compositeStart = MathPrototype.min(this.text.length(), this.span.start() + start);
            var compositeEnd = MathPrototype.min(this.text.length(), compositeStart + length);
            return new TextSpan(compositeStart, compositeEnd - compositeStart);
        }
    }

    class SimpleStringText implements ISimpleText {
        constructor(private value: string) {
        }

        public length(): number {
            return this.value.length;
        }

        public copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void {
            StringUtilities.copyTo(this.value, sourceIndex, destination, destinationIndex, count);
        }

        public substr(start: number, length: number, intern: bool): string {
            if (intern) {
                var array = ArrayUtilities.createArray(length, 0);
                this.copyTo(start, array, 0, length);
                return stringTable.addCharArray(array, 0, length);
            }

            return this.value.substr(start, length);
        }

        public subText(span: TextSpan): ISimpleText {
            return new SimpleSubText(this, span);
        }
    }

    export function createText(value: string): IText {
        return new StringText(value);
    }

    export function createSimpleText(value: string): ISimpleText {
        return new SimpleStringText(value);
    }

    export function createSimpleSubText(text: ISimpleText, span: TextSpan): ISimpleText {
        return new SimpleSubText(text, span);
    }
}