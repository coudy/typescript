///<reference path='References.ts' />

interface ISyntaxTrivia extends ISyntaxElement {
    fullStart(): number;
    fullWidth(): number;

    fullText(text: IText): string;
}