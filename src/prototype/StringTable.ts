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
    private entries: StringTableEntry[] = [];
    private count: number = 0;

    constructor(capacity: number = 256, nested: StringTable = null) {
        var size = Hash.getPrime(capacity);
        this.entries = ArrayUtilities.createArray(size);
    }

    public addCharArray(key: number[], start: number, len: number): string {
        // Compute the hash for this key.  Also ensure that it's non negative.
        var hashCode = Hash.computeMurmur2CharArrayHashCode(key, start, len) % 0x7FFFFFFF;

        var entry = this.findCharArrayEntry(key, start, len, hashCode);
        if (entry !== null) {
            return entry.Text;
        }

        var slice: number[] = key.slice(start, start + len);
        return this.addEntry(StringUtilities.fromCharCodeArray(slice), hashCode);
    }

    private findCharArrayEntry(key: number[], start: number, len: number, hashCode: number): StringTableEntry {
        for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
            if (e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                return e;
            }
        }

        return null;
    }

    private addEntry(text: string, hashCode: number): string {
        var index = hashCode %  this.entries.length;

        var e = new StringTableEntry(text, hashCode, this.entries[index]);

        this.entries[index] = e;
        if (this.count === this.entries.length) {
            this.grow();
        }

        this.count++;
        return e.Text;
    }

    private dumpStats() {
        var standardOut = Environment.standardOut;
        
        standardOut.WriteLine("----------------------")
        standardOut.WriteLine("String table stats");
        standardOut.WriteLine("Count            : " + this.count);
        standardOut.WriteLine("Entries Length   : " + this.entries.length);

        var occupiedSlots = 0;
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i] !== null) {
                occupiedSlots++;
            }
        }
        
        standardOut.WriteLine("Occupied slots   : " + occupiedSlots);
        standardOut.WriteLine("Avg Length/Slot  : " + (this.count / occupiedSlots));
        standardOut.WriteLine("----------------------");
    }
    
    private grow(): void {
        // this.dumpStats();

        var newSize = Hash.expandPrime(this.entries.length);

        var oldEntries = this.entries;
        var newEntries: StringTableEntry[] = ArrayUtilities.createArray(newSize);

        this.entries = newEntries;

        for (var i = 0; i < oldEntries.length; i++) {
            var e = oldEntries[i];
            while (e !== null) {
                var newIndex = e.HashCode % newSize;
                var tmp = e.Next;
                e.Next = newEntries[newIndex];
                newEntries[newIndex] = e;
                e = tmp;
            }
        }

        // this.dumpStats();
    }

    private static textCharArrayEquals(text: string, array: number[], start: number, length: number): bool {
        if (text.length !== length) {
            return false;
        }

        // use array.Length to eliminate the rangecheck
        var s = start;
        for (var i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) !== array[s]) {
                return false;
            }

            s++;
        }

        return true;
    }
}