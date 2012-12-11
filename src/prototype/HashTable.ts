///<reference path='References.ts' />

class HashTableEntry {
    constructor(public Key: any,
                public Value: any,
                public HashCode: number,
                public Next: HashTableEntry) {
    }
}

class HashTable {
    private entries: HashTableEntry[] = [];
    private count: number = 0;
    private hash: (k: any) => number;
    private equals: (k1: any, k2: any) => bool;

    constructor(capacity: number = 256, hash: (k: any) => number = null, equals: (k1: any, k2: any) => bool = null) {
        var size = Hash.getPrime(capacity);
        this.hash = hash;
        this.equals = equals;
        this.entries = ArrayUtilities.createArray(size);
    }

    public add(key: any, value: any) {
        // Compute the hash for this key.  Also ensure that it's non negative.
        var hashCode = this.hash === null
            ? key.hashCode()
            : this.hash(key);

        hashCode = hashCode % 0x7FFFFFFF;

        var entry = this.findEntry(key, hashCode);
        if (entry !== null) {
            entry.Value = value;
            return;
        }

        return this.addEntry(key, value, hashCode);
    }

    private findEntry(key: any, hashCode: number): HashTableEntry {
        for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
            if (e.HashCode === hashCode) {
                var equals = this.equals === null
                    ? key === e.Key
                    : this.equals(key, e.Key);

                if (equals) {
                    return e;
                }
            }
        }

        return null;
    }

    private addEntry(key: any, value: any, hashCode: number): any {
        var index = hashCode %  this.entries.length;

        var e = new HashTableEntry(key, value, hashCode, this.entries[index]);

        this.entries[index] = e;
        if (this.count === this.entries.length) {
            this.grow();
        }

        this.count++;
        return e.Key;
    }

    private dumpStats() {
        var standardOut = Environment.standardOut;
        
        standardOut.WriteLine("----------------------")
        standardOut.WriteLine("Hash table stats");
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
        var newEntries: HashTableEntry[] = ArrayUtilities.createArray(newSize);

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
}