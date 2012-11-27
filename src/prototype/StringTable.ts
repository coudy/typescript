///<reference path='References.ts' />

class StringTableEntry {
    public Text: string;
    public HashCode: number;
    public Next: StringTableEntry;

    constructor(text: string, hashCode: number, next: StringTableEntry)
    {
        this.Text = text;
        this.HashCode = hashCode;
        this.Next = next;
    }
}

class StringTable {
    private nested: StringTable = null;

    private entries: StringTableEntry[] = [];
    private count: number;
    private mask: number;

    constructor(mask: number = 31, nested: StringTable = null) {
        this.mask = mask;
        this.entries = ArrayUtilities.createArray(mask + 1);

        // nested table is supposed to be freezed and readonly.
        this.nested = nested;
    }

    public addString(key: string): string {
        var hashCode = StringTable.computeStringHashCode(key);

        if (this.nested !== null) {
            var exist = this.nested.findStringEntry(key, hashCode);
            if (exist !== null) {
                return exist.Text;
            }
        }

        var entry = this.findStringEntry(key, hashCode);
        if (entry !== null) {
            return entry.Text;
        }

        return this.addEntry(key, hashCode);
    }

    private findStringEntry(key: string, hashCode: number): StringTableEntry {
        for (var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if (e.HashCode === hashCode && e.Text === key) {
                return e;
            }
        }

        return null;
    }

    public addSubstring(text: string, keyStart: number, keyLength: number): string {
        var hashCode = StringTable.computeSubstringHashCode(text, keyStart, keyLength);

        if (this.nested !== null) {
            var exist = this.nested.findSubstringEntry(text, keyStart, keyLength, hashCode);
            if (exist !== null) {
                return exist.Text;
            }
        }

        var entry = this.findSubstringEntry(text, keyStart, keyLength, hashCode);
        if (entry !== null) {
            return entry.Text;
        }

        return this.addEntry(text.substr(keyStart, keyLength), hashCode);
    }

    private findSubstringEntry(text: string, keyStart: number, keyLength: number, hashCode: number): StringTableEntry {
        for (var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if (e.HashCode === hashCode && StringTable.textSubstringEquals(e.Text, text, keyStart, keyLength)) {
                return e;
            }
        }

        return null;
    }

    public addCharArray(key: number[], start: number, len: number): string {
        var hashCode = StringTable.computeCharArrayHashCode(key, start, len);

        if (this.nested !== null) {
            var exist = this.nested.findCharArrayEntry(key, start, len, hashCode);
            if (exist !== null) {
                return exist.Text;
            }
        }

        var entry = this.findCharArrayEntry(key, start, len, hashCode);
        if (entry !== null) {
            return entry.Text;
        }

        var slice: number[] = key.slice(start, start + len);
        return this.addEntry(StringUtilities.fromCharCodeArray(slice), hashCode);
    }

    private findCharArrayEntry(key: number[], start: number, len: number, hashCode: number): StringTableEntry {
        for (var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if (e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                return e;
            }
        }

        return null;
    }

    public addChar(key: number): string {
        var hashCode = StringTable.computeCharHashCode(key);

        if (this.nested !== null) {
            var exist = this.nested.findCharEntry(key, hashCode);
            if (exist !== null) {
                return exist.Text;
            }
        }

        var entry = this.findCharEntry(key, hashCode);
        if (entry !== null) {
            return entry.Text;
        }

        return this.addEntry(String.fromCharCode(key), hashCode);
    }

    private findCharEntry(key: number, hashCode: number): StringTableEntry {
        for (var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if (e.HashCode === hashCode && e.Text.length === 1 && e.Text.charCodeAt(0) === key) {
                return e;
            }
        }

        return null;
    }

    // This table uses FNV1a as a string hash
    private static FNV_BASE = 2166136261;
    private static FNV_PRIME = 16777619;

    private static computeStringHashCode(key: string): number {
        var hashCode = FNV_BASE;

        for (var i = 0; i < key.length; i++) {
            hashCode = (hashCode ^ key[i]) * FNV_PRIME;
        }

        return hashCode;
    }

    private static computeSubstringHashCode(text: string, keyStart: number, keyLength: number): number {
        var hashCode = FNV_BASE;
        var end = keyStart + keyLength;

        for (var i = keyStart; i < end; i++) {
            hashCode = (hashCode ^ text.charCodeAt(i)) * FNV_PRIME;
        }

        return hashCode;
    }

    private static computeCharHashCode(ch: number): number {
        var hashCode = FNV_BASE;
        hashCode = (hashCode ^ ch) * FNV_PRIME;

        return hashCode;
    }

    private static computeCharArrayHashCode(text: number[], start: number, len: number): number {
        var hashCode = FNV_BASE;
        var end = start + len;

        for (var i = start; i < end; i++) {
            hashCode = (hashCode ^ text[i]) * FNV_PRIME;
        }

        return hashCode;
    }

    private addEntry(text: string, hashCode: number): string {
        var index = hashCode & this.mask;
        var e = new StringTableEntry(text, hashCode, this.entries[index]);

        this.entries[index] = e;
        if (this.count++ === this.mask) {
            this.grow();
        }

        return e.Text;
    }

    private grow(): void {
        var newMask = this.mask * 2 + 1;
        var oldEntries = this.entries;
        var newEntries: StringTableEntry[] = ArrayUtilities.createArray(newMask + 1);

        // use oldEntries.Length to eliminate the rangecheck            
        for (var i = 0; i < oldEntries.length; i++) {
            var e = oldEntries[i];
            while (e !== null) {
                var newIndex = e.HashCode & newMask;
                var tmp = e.Next;
                e.Next = newEntries[newIndex];
                newEntries[newIndex] = e;
                e = tmp;
            }
        }

        this.entries = newEntries;
        this.mask = newMask;
    }

    private static textSubstringEquals(array: string, text: string, start: number, length: number): bool {
        if (array.length !== length) {
            return false;
        }

        // use array.Length to eliminate the rangecheck
        for (var i = 0; i < array.length; i++) {
            if (array.charCodeAt(i) !== text.charCodeAt(start + i)) {
                return false;
            }
        }

        return true;
    }

    private static textCharArrayEquals(array: string, text: number[], start: number, length: number): bool {
        return array.length === length && textEqualsCore(array, text, start);
    }

    private static textEqualsCore(array: string, text: number[], start: number): bool {
        // use array.Length to eliminate the rangecheck
        var s = start;
        for (var i = 0; i < array.length; i++) {
            if (array.charCodeAt(i) !== text[s]) {
                return false;
            }

            s++;
        }

        return true;
    }
}