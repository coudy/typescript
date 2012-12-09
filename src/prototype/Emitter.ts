///<reference path='References.ts' />

class Emitter extends SyntaxRewriter {
    private syntaxOnly: bool;
    private indentation: number = 0;

    constructor(syntaxOnly: bool) {
        super();

        this.syntaxOnly = syntaxOnly;
    }

    public emit(input: SourceUnitSyntax): SourceUnitSyntax {
        return input.accept1(this);
    }

    private visitSourceUnit(node: SourceUnitSyntax): SourceUnitSyntax {
        var moduleElements: ModuleElementSyntax[] = [];

        for (var i = 0, n = node.moduleElements().count(); i < n; i++) {
            var moduleElement = node.moduleElements()[i];

            var converted = moduleElement.accept1(this);
            if (ArrayUtilities.isArray(converted)) {
                moduleElements.push.apply(moduleElements, converted);
            }
            else {
                moduleElements.push(converted);
            }
        }

        return new SourceUnitSyntax(SyntaxList.create(moduleElements), node.endOfFileToken());
    }

    private static leftmostName(name: NameSyntax): IdentifierNameSyntax {
        if (name.kind() === SyntaxKind.IdentifierName) {
            return <IdentifierNameSyntax>name;
        }
        else if (name.kind() === SyntaxKind.QualifiedName) {
            return Emitter.leftmostName((<QualifiedNameSyntax>name).left());
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private visitModuleDeclaration(node: ModuleDeclarationSyntax): StatementSyntax[] {
        var result: StatementSyntax[] = [];
        
        // TODO: Handle the case where this is a dotted name.  Note: existing typescript transpiler
        // does not seem to handle this.
        var identifierName = Emitter.leftmostName(node.moduleName());

        //var variableStatement = new VariableStatementSyntax(
        //    /*exportKeyword:*/ null,
        //    /*declareKeyword:*/ null,
        //    new VariableDeclarationSyntax(
        //        SyntaxTokenFactory.createElastic(SyntaxKind.VarKeyword),
        //        SeparatedSyntaxList.create(
        //            [new VariableDeclaratorSyntax(identifierName.identifier(), null, null)])),
        //    SyntaxTokenFactory.createElastic(SyntaxKind.SemicolonToken));

        return result;
    }
}