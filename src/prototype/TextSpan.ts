///<reference path='Contract.ts' />

class TextSpan {
    private _start: number = 0;
    private _length: number = 0;

    /// <summary>
    /// Creates a TextSpan instance beginning with the position Start and having the Length
    /// specified with length.
    /// </summary>
    constructor(start: number, length: number) {
        if (start < 0) {
            Errors.argument("start");
        }

        if (start + length < start) {
            throw new Error("length");
        }

        this._start = start;
        this._length = length;
    }

    start(): number {
        return this._start;
    }

    length(): number {
        return this._length;
    }

    end(): number {
        return this._start + this._length;
    }

    isEmpty(): bool {
        return this._length === 0;
    }

    /// <summary>
    /// Determines whether the position lies within the span.
    /// </summary>
    /// <param name="position">
    /// The position to check.
    /// </param>
    /// <returns>
    /// <c>true</c> if the position is greater than or equal to Start and strictly less 
    /// than End, otherwise <c>false</c>.
    /// </returns>
    public containsPosition(position: number): bool {
        return position >= this._start && position < this.end();
    }

    /// <summary>
    /// Determines whether <paramref name="span"/> falls completely within this span.
    /// </summary>
    /// <param name="span">
    /// The span to check.
    /// </param>
    /// <returns>
    /// <c>true</c> if the specified span falls completely within this span, otherwise <c>false</c>.
    /// </returns>
    public containsTextSpan(span: TextSpan): bool {
        return span._start >= this._start && span.end() <= this.end();
    }

    /// <summary>
    /// Determines whether <paramref name="span"/> overlaps this span. Two spans are considered to overlap 
    /// if they have positions in common and neither is empty. Empty spans do not overlap with any 
    /// other span.
    /// </summary>
    /// <param name="span">
    /// The span to check.
    /// </param>
    /// <returns>
    /// <c>true</c> if the spans overlap, otherwise <c>false</c>.
    /// </returns>
    public overlapsWith(span: TextSpan): bool {
        var overlapStart = MathPrototype.max(this._start, span._start);
        var overlapEnd = MathPrototype.min(this.end(), span.end());

        return overlapStart < overlapEnd;
    }

    /// <summary>
    /// Returns the overlap with the given span, or null if there is no overlap.
    /// </summary>
    /// <param name="span">
    /// The span to check.
    /// </param>
    /// <returns>
    /// The overlap of the spans, or null if the overlap is empty.
    /// </returns>
    public overlap(span: TextSpan): TextSpan {
        var overlapStart = MathPrototype.max(this._start, span._start);
        var overlapEnd = MathPrototype.min(this.end(), span.end());

        if (overlapStart < overlapEnd)
        {
            return TextSpan.fromBounds(overlapStart, overlapEnd);
        }

        return null;
    }

    /// <summary>
    /// Determines whether <paramref name="span"/> intersects this span. Two spans are considered to 
    /// intersect if they have positions in common or the end of one span 
    /// coincides with the start of the other span.
    /// </summary>
    /// <param name="span">
    /// The span to check.
    /// </param>
    /// <returns>
    /// <c>true</c> if the spans intersect, otherwise <c>false</c>.
    /// </returns>
    public intersectsWithTextSpan(span: TextSpan): bool {
        return span._start <= this.end() && span.end() >= this._start;
    }

    /// <summary>
    /// Determines whether <paramref name="position"/> intersects this span. 
    /// A position is considered to intersect if it is between the start and
    /// end positions (inclusive) of this span.
    /// </summary>
    /// <param name="position">
    /// The position to check.
    /// </param>
    /// <returns>
    /// <c>true</c> if the position intersects, otherwise <c>false</c>.
    /// </returns>
    public intersectsWithPosition(position: number): bool {
        return position <= this.end() && position >= this._start;
    }

    /// <summary>
    /// Returns the intersection with the given span, or null if there is no intersection.
    /// </summary>
    /// <param name="span">
    /// The span to check.
    /// </param>
    /// <returns>
    /// The intersection of the spans, or null if the intersection is empty.
    /// </returns>
    public intersection(span: TextSpan): TextSpan {
        var intersectStart = MathPrototype.max(this._start, span._start);
        var intersectEnd = MathPrototype.min(this.end(), span.end());

        if (intersectStart <= intersectEnd) {
            return TextSpan.fromBounds(intersectStart, intersectEnd);
        }

        return null;
    }

    /// <summary>
    /// Creates a new <see cref="T:TextSpan"/> from <param name="start" /> and <param
    /// name="end"/> positions as opposed to a position and length.
    /// </summary>
    public static fromBounds(start: number, end: number): TextSpan {
        Contract.requires(start >= 0);
        Contract.requires(end - start >= 0);
        return new TextSpan(start, end - start);
    }
}