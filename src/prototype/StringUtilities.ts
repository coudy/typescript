///<reference path='References.ts' />

class StringUtilities {
    public static fromCharCodeArray(array: number[]): string {
        return String.fromCharCode.apply(null, array);
    }

    public static endsWith(string: string, value: string): bool {
        return string.substring(string.length - value.length, string.length) === value;
    }
}