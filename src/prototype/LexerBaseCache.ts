///<reference path='References.ts' />

class BaseScannerCache {
    private strings: StringTable = new StringTable();

    constructor (strings?: StringTable) {
        this.strings = strings;
    }

    public internString(text: string): string {
        return this.strings.addString(text);
    }

    //public Intern(StringBuilder text): string 
    //{
    //    return this.strings.Add(text);
    //}

    public internCharArray(array: number[], start: number, length: number): string {
        return this.strings.addCharArray(array, start, length);
    }
}