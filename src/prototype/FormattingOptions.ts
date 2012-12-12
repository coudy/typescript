///<reference path='References.ts' />

class FormattingOptions {
    constructor(public useTabs: bool,
                public spacesPerTab: number,
                public indentSpaces: number) {
    }

    public static defaultOptions = new FormattingOptions(/*useTabs:*/ false, /*spacesPerTab:*/ 4, /*indentSpaces:*/ 4);
}