///<reference path='SyntaxTree.ts' />
///<reference path='ICancellationToken.ts' />
///<reference path='ISemanticModel.ts' />
///<reference path='ISymbol.ts' />

interface ICompilation {
    /// <summary>
    /// Gets the syntax trees (parsed from source code) that this compilation was created with.
    /// </summary>
    syntaxTrees(): SyntaxTree[];

    getSemanticModel(syntaxTree: SyntaxTree): ISemanticModel;

    addSyntaxTrees(...syntaxTrees: SyntaxTree[]): void;

    removeSyntaxTrees(...syntaxTrees: SyntaxTree[]): void;

    replaceSyntaxTree(oldSyntaxTree: SyntaxTree, newSyntaxTree: SyntaxTree): void;

    containsSyntaxTree(syntaxTree: SyntaxTree): bool;

    globalModule(): IModuleSymbol;

    anyType(): IObjectType;

    numberType(): IObjectType;

    stringType(): IObjectType;

    /// <summary>
    /// Gets all the diagnostics for the compilation, including syntax, declaration, and
    /// binding. Does not include any diagnostics that might be produced during emit.
    /// </summary>
    getDiagnostics(cancellationToken: ICancellationToken): Diagnostic[];

    // TODO: add parameters here to control emitting.
    emit(): void;
}