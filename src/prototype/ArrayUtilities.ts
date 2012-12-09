///<reference path='References.ts' />

class ArrayUtilities {
    public static isArray(value: any): bool {
        return Object.prototype.toString.apply(value, []) === '[object Array]';
    }

    public static sum(array: any[], func: (v: any) => number): number {
        var result = 0;

        for (var i = 0, n = array.length; i < n; i++) {
            result += func(array[i]);
        }

        return result;
    }

    public static any(array: any[], func: (v: any) => bool): bool {
        for (var i = 0, n = array.length; i < n; i++) {
            if (func(array[i])) {
                return true;
            }
        }

        return false;
    }

    public static binarySearch(array: number[], value: number): number {
        var low = 0;
        var high = array.length - 1;

        while (low <= high) {
            var middle = low + ((high - low) >> 1);
            var midValue = array[middle];

            if (midValue === value) {
                return middle;
            }
            else if (midValue > value) {
                high = middle - 1;
            }
            else {
                low = middle + 1;
            }
        }

        return ~low;
    }

    public static createArray(length: number, defaultvalue = null): any[] {
        // return new Array(length);
        var result = [];
        for (var i = 0; i < length; i++) {
            result.push(defaultvalue);
        }

        return result;
    }

    public static grow(array: any[], length: number, defaultValue: any): void {
        var count = length - array.length;
        for (var i = 0; i < count; i++) {
            array.push(defaultValue);
        }
    }

    public static copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void {
        for (var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    }
}