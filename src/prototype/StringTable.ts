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
    // private nested: StringTable = null;

    private entries: StringTableEntry[] = [];
    private count: number = 0;
    private mask: number;

    constructor(mask: number = 255, nested: StringTable = null) {
        this.mask = mask;
        this.entries = ArrayUtilities.createArray(mask + 1);

        // nested table is supposed to be freezed and readonly.
        // this.nested = nested;
    }

    public addCharArray(key: number[], start: number, len: number): string {
        var hashCode = StringTable.computeCharArrayHashCode(key, start, len);

        //if (this.nested !== null) {
        //    var exist = this.nested.findCharArrayEntry(key, start, len, hashCode);
        //    if (exist !== null) {
        //        return exist.Text;
        //    }
        //}

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

    // This table uses FNV1a as a string hash
    private static FNV_BASE = 2166136261;
    private static FNV_PRIME = 16777619;

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
        if (this.count === this.mask) {
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
        this.dumpStats();

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

        this.dumpStats();
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