///<reference path='References.ts' />

interface ISeparatedSyntaxList {
    count();
    itemAt(index: number): any;

    syntaxNodeCount();
    syntaxNodeAt(index: number): any;

    separatorCount();
    separatorAt(index: number): ISyntaxToken;
}