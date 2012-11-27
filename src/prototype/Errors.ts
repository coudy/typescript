///<reference path='References.ts' />

class Errors {
    public static argument(argument: string): Error {
        return new Error("Invalid argument: " + argument + ".");
    }

    public static argumentOutOfRange(argument: string): Error {
        return new Error("Argument out of range: " + argument + ".");
    }

    public static argumentNull(argument: string): Error {
        return new Error("Argument null: " + argument + ".");
    }

    public static abstract(): Error {
        return new Error("Operation not implemented properly by subclass.");
    }

    public static notYetImplemented(): Error {
        return new Error("Not yet implemented.");
    }
}