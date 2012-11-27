///<reference path='References.ts' />

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
    constructor (data: string) {
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
    public getCharCodeAt(position: number): number {
        if (position < 0 || position >= this.source.length) {
            throw Errors.argumentOutOfRange("position");
        }

        return this.source.charCodeAt(position);
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

        if (span.start() == 0 && span.length() == this.length()) {
            return this.source;
        }

        return this.source.substr(span.start(), span.length());
    }

    public copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void {
        for (var i = 0; i < count; i++) {
            destination[destinationIndex + i] = this.source.charCodeAt(sourceIndex + i);
        }
    }
}