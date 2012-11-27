///<reference path='References.ts' />

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