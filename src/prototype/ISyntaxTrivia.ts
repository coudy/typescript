///<reference path='References.ts' />

interface ISyntaxTrivia {
    syntaxKind(): SyntaxKind;

    fullStart(): number;
    fullWidth(): number;

    fullText(text: IText): string;
}