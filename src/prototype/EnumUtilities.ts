module EnumUtilities {
    export function hasFlag(value: number, flag: number) {
        return (value & flag) === flag;
    }
}