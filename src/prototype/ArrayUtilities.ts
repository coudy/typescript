///<reference path='References.ts' />

class ArrayUtilities {
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

    public static createArray(length: number): any[] {
        var result = [];
        for (var i = 0; i < length; i++) {
            result.push(null);
        }

        return result;
    }

    public static copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void {
        for (var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    }
}