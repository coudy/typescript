///<reference path='SyntaxTree.ts' />

interface ILocation {
    syntaxTree(): SyntaxTree;
    textSpan(): TextSpan;
}