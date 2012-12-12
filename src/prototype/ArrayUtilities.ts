///<reference path='Errors.ts' />

class ArrayUtilities {
    public static isArray(value: any): bool {
        return Object.prototype.toString.apply(value, []) === '[object Array]';
    }

    public static last(array: any[]) {
        if (array.length === 0) {
            throw Errors.argumentOutOfRange('array');
        }

        return array[array.length - 1];
    }

    public static firstOrDefault(array: any[], func: (v: any) => bool): any {
        for (var i = 0, n = array.length; i < n; i++) {
            var value = array[i];
            if (func(value)) {
                return value;
            }
        }

        return null;
    }

    public static sum(array: any[], func: (v: any) => number): number {
        var result = 0;

        for (var i = 0, n = array.length; i < n; i++) {
            result += func(array[i]);
        }

        return result;
    }

    public static select(values: any[], func: (v: any) => any): any[] {
        var result = [];

        for (var i = 0; i < values.length; i++) {
            result.push(func(values[i]));
        }

        return result;
    }

    public static where(values: any[], func: (v: any) => bool): any[] {
        var result = [];

        for (var i = 0; i < values.length; i++) {
            if (func(values[i])) {
                result.push(values[i]);
            }
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

    public static all(array: any[], func: (v: any) => bool): bool {
        for (var i = 0, n = array.length; i < n; i++) {
            if (!func(array[i])) {
                return false;
            }
        }

        return true;
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