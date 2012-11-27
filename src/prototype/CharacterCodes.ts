class CharacterCodes {
    public static nullCharacter: number = 0;

    public static newLine: number = "\n".charCodeAt(0);
    public static carriageReturn: number = "\r".charCodeAt(0);
    public static nextLine: number = '\u0085'.charCodeAt(0);
    public static lineSeparator: number = '\u2028'.charCodeAt(0);
    public static paragraphSeparator: number = '\u2029'.charCodeAt(0);
    public static space: number = " ".charCodeAt(0);

    public static _: number = "_".charCodeAt(0);
    public static $: number = "$".charCodeAt(0);

    public static _0: number = "0".charCodeAt(0);
    public static _9: number = "9".charCodeAt(0);
    
    public static a: number = "a".charCodeAt(0);
    public static b: number = "b".charCodeAt(0);
    public static e: number = "e".charCodeAt(0);
    public static f: number = "f".charCodeAt(0);
    public static h: number = "h".charCodeAt(0);
    public static n: number = "n".charCodeAt(0);
    public static r: number = "r".charCodeAt(0);
    public static t: number = "t".charCodeAt(0);
    public static u: number = "u".charCodeAt(0);
    public static v: number = "v".charCodeAt(0);
    public static x: number = "x".charCodeAt(0);
    public static z: number = "z".charCodeAt(0);
    
    public static A: number = "A".charCodeAt(0);
    public static E: number = "E".charCodeAt(0);
    public static F: number = "F".charCodeAt(0);
    public static X: number = "X".charCodeAt(0);
    public static Z: number = "Z".charCodeAt(0);
    
    public static ampersand: number = "&".charCodeAt(0);
    public static asterisk: number = "*".charCodeAt(0);
    public static backslash: number = "\\".charCodeAt(0);
    public static bar: number = "|".charCodeAt(0);
    public static caret: number = "^".charCodeAt(0);
    public static closeBrace: number = "}".charCodeAt(0);
    public static closeBracket: number = "]".charCodeAt(0);
    public static closeParen: number = ")".charCodeAt(0);
    public static colon: number = ":".charCodeAt(0);
    public static comma: number = ",".charCodeAt(0);
    public static dot: number = ".".charCodeAt(0);
    public static doubleQuote: number = '"'.charCodeAt(0);
    public static equals: number = "=".charCodeAt(0);
    public static exclamation: number = "!".charCodeAt(0);
    public static greaterThan: number = ">".charCodeAt(0);
    public static lessThan: number = "<".charCodeAt(0);
    public static minus: number = "-".charCodeAt(0);
    public static openBrace: number = "{".charCodeAt(0);
    public static openBracket: number = "[".charCodeAt(0);
    public static openParen: number = "(".charCodeAt(0);
    public static percent: number = "%".charCodeAt(0);
    public static plus: number = "+".charCodeAt(0);
    public static question: number = "?".charCodeAt(0);
    public static semicolon: number = ";".charCodeAt(0);
    public static singleQuote: number = "'".charCodeAt(0);
    public static slash: number = "/".charCodeAt(0);
    public static tilde: number = "~".charCodeAt(0);

    public static backspace: number = "\b".charCodeAt(0);
    public static formFeed: number = "\f".charCodeAt(0);
    public static nonBreakingSpace: number = "\u00A0".charCodeAt(0);
    public static byteOrderMark = "\uFEFF".charCodeAt(0);
    public static tab: number = "\t".charCodeAt(0);
    public static verticalTab: number = 11; // For some reason "\v".charCodeAt(0) doesn't work.
}