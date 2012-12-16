///<reference path='TextBase.ts' />

/// <summary>
/// An IText that represents a subrange of another IText.
/// </summary>
class SubText extends TextBase {
    private text: IText = null;
    private span: TextSpan = null;

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