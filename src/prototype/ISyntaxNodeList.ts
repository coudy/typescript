///<reference path='References.ts' />

interface ISyntaxList/*<T>*/ {
    count(): number;
    syntaxNodeAt(index: number): SyntaxNode;
}