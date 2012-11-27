///<reference path='References.ts' />

class SlidingTextWindow {
    private DefaultWindowLength: number = 2048;

    // Underlying text that we're streaming over.
    private text: IText = null;

    private _characterWindowStart: number = 0; // start of current lexeme within chars buffer

    // The position within text that the characterWindow is starting at.
    private basis: number = 0;

    // Offset we're currently at in _characterWindow.
    private offset: number = 0;
    private characterWindow: number[] = null; // moveable window of chars from source text
    private _characterWindowCount: number = 0; // # of valid characters in _characterWindow
    private stringTable: StringTable = null;

    constructor (text: IText, stringTable: StringTable) {
        Debug.assert(stringTable !== null);
        this.text = text;
        this.stringTable = stringTable;

        this.characterWindow = ArrayUtilities.createArray(this.DefaultWindowLength);

        Debug.assert(this.characterWindow !== null);
    }

    public position(): number {
        return this.offset + this.basis;
    }

    public startPosition(): number {
        return this._characterWindowStart + this.basis;
    }

    public start(): void {
        this._characterWindowStart = this.offset;
    }

    public reset(position: number): void {
        // if position is within already read character range then just use what we have
        var relative = position - this.basis;
        if (relative >= 0 && relative <= this._characterWindowCount) {
            this.offset = relative;
        }
        else {
            // we need to reread text buffer
            var amountToRead = MathPrototype.min(this.text.length(), position + this.characterWindow.length) - position;
            amountToRead = MathPrototype.max(amountToRead, 0);
            if (amountToRead > 0) {
                this.text.copyTo(position, this.characterWindow, 0, amountToRead);
            }

            this._characterWindowStart = 0;
            this.offset = 0;
            this.basis = position;
            this._characterWindowCount = amountToRead;
        }
    }

    private moreChars(): bool {
        if (this.offset >= this._characterWindowCount) {
            if (this.offset + this.basis >= this.text.length()) {
                return false;
            }

            // if we are sufficiently into the char buffer, then shift chars to the left
            if (this._characterWindowStart > (this._characterWindowCount >> 2)) {
                ArrayUtilities.copy(this.characterWindow, this._characterWindowStart, this.characterWindow, 0, this._characterWindowCount - this._characterWindowStart);
                this._characterWindowCount -= this._characterWindowStart;
                this.offset -= this._characterWindowStart;
                this.basis += this._characterWindowStart;
                this._characterWindowStart = 0;
            }

            if (this._characterWindowCount >= this.characterWindow.length) {
                // grow char array, since we need more contiguous space
                this.characterWindow[this.characterWindow.length * 2 - 1] = CharacterCodes.nullCharacter;
            }

            var amountToRead = MathPrototype.min(this.text.length() - (this.basis + this._characterWindowCount), this.characterWindow.length - this._characterWindowCount);
            this.text.copyTo(this.basis + this._characterWindowCount, this.characterWindow, this._characterWindowCount, amountToRead);
            this._characterWindowCount += amountToRead;
            return amountToRead > 0;
        }

        return true;
    }

    public advanceChar1(): void {
        this.offset++;
    }

    public advanceCharN(n: number): void {
        this.offset += n;
    }

    public peekCharAtPosition(): number {
        if (this.offset >= this._characterWindowCount) {
            if (!this.moreChars()) {
                return CharacterCodes.nullCharacter;
            }
        }

        return this.characterWindow[this.offset];
    }

    public peekCharN(delta: number): number {
        var position = this.position();

        this.advanceCharN(delta);
        var ch = this.peekCharAtPosition();

        this.reset(position);
        return ch;
    }

    private internCharArray(array: number[], start: number, length: number): string {
        return this.stringTable.addCharArray(array, start, length);
    }

    public getText(intern: bool): string {
        var width = this.offset - this._characterWindowStart;
        return this.getSubstringText(this.startPosition(), width, intern);
    }

    private getSubstringText(position: number, length: number, intern: bool): string {
        var offset = position - this.basis;
        if (intern) {
            return this.internCharArray(this.characterWindow, offset, length);
        }
        else {
            return StringUtilities.fromCharCodeArray(this.characterWindow.slice(offset, offset + length));
        }
    }
}