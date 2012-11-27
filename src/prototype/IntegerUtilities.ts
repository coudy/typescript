///<reference path='References.ts' />

class IntegerUtilities {
    public static integerDivide(numerator: number, denominator: number): number {
        return (numerator / denominator) >> 0;
    }
}