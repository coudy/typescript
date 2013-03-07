///<reference path='..\Core\ArrayUtilities.ts' />
///<reference path='..\Core\Errors.ts' />
///<reference path='LinePosition.ts' />
///<reference path='TextUtilities.ts' />

interface ILineMap {
    lineStarts(): number[];
    lineCount(): number;
    getLineNumberFromPosition(position: number): number;
    getLinePosition(position: number): LinePosition;
}

class LineMap implements ILineMap {
    public static empty = new LineMap([0], 0);

    constructor(private _lineStarts: number[], private length: number) {
    }

    public toJSON(key) {
        return { lineStarts: this._lineStarts, length: this.length };
    }

    public equals(other: LineMap): bool {
        return this.length === other.length &&
               ArrayUtilities.sequenceEquals(this.lineStarts(), other.lineStarts(), (v1, v2) => v1 === v2);
    }

    public lineStarts(): number[]{
        return this._lineStarts;
    }

    public lineCount(): number {
        return this.lineStarts().length;
    }

    public getLineNumberFromPosition(position: number): number {
        if (position < 0 || position > this.length) {
            throw Errors.argumentOutOfRange("position");
        }

        if (position === this.length) {
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
        if (position < 0 || position > this.length) {
            throw Errors.argumentOutOfRange("position");
        }

        var lineNumber = this.getLineNumberFromPosition(position);

        return new LinePosition(lineNumber, position - this.lineStarts()[lineNumber]);
    }

    public static createFrom(text: ISimpleText): LineMap {
        var lineStarts = TextUtilities.parseLineStarts(text);

        return new LineMap(lineStarts, text.length());
    }
}