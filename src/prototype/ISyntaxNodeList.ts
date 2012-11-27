///<reference path='References.ts' />

interface ISyntaxNodeList/*<T>*/ {
    count(): number;
    syntaxNodeAt(index: number): SyntaxNode;
}