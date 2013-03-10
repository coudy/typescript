///<reference path='SyntaxNode.ts' />
///<reference path='ISyntaxList.ts' />
///<reference path='ISeparatedSyntaxList.ts' />
///<reference path='SeparatedSyntaxList.ts' />
///<reference path='SyntaxList.ts' />
///<reference path='SyntaxToken.ts' />
///<reference path='Syntax.ts' />

class SourceUnitSyntax extends SyntaxNode {

    constructor(public moduleElements: ISyntaxList,
                public endOfFileToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSourceUnit(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SourceUnit;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.moduleElements;
            case 1: return this.endOfFileToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(moduleElements: ISyntaxList,
                  endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        if (this.moduleElements === moduleElements && this.endOfFileToken === endOfFileToken) {
            return this;
        }

        return new SourceUnitSyntax(moduleElements, endOfFileToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return new SourceUnitSyntax(Syntax.emptyList, endOfFileToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return new SourceUnitSyntax(Syntax.emptyList, endOfFileToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SourceUnitSyntax {
        return <SourceUnitSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SourceUnitSyntax {
        return <SourceUnitSyntax>super.withTrailingTrivia(trivia);
    }

    public withModuleElements(moduleElements: ISyntaxList): SourceUnitSyntax {
        return this.update(moduleElements, this.endOfFileToken);
    }

    public withModuleElement(moduleElement: IModuleElementSyntax): SourceUnitSyntax {
        return this.withModuleElements(Syntax.list([moduleElement]));
    }

    public withEndOfFileToken(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return this.update(this.moduleElements, endOfFileToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.moduleElements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ModuleReferenceSyntax extends SyntaxNode implements IModuleReferenceSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    private isModuleReference(): bool {
        return true;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleReferenceSyntax {
        return <ModuleReferenceSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleReferenceSyntax {
        return <ModuleReferenceSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ExternalModuleReferenceSyntax extends ModuleReferenceSyntax {

    constructor(public moduleKeyword: ISyntaxToken,
                public openParenToken: ISyntaxToken,
                public stringLiteral: ISyntaxToken,
                public closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExternalModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExternalModuleReference;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.moduleKeyword;
            case 1: return this.openParenToken;
            case 2: return this.stringLiteral;
            case 3: return this.closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(moduleKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  stringLiteral: ISyntaxToken,
                  closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
        if (this.moduleKeyword === moduleKeyword && this.openParenToken === openParenToken && this.stringLiteral === stringLiteral && this.closeParenToken === closeParenToken) {
            return this;
        }

        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax {
        return new ExternalModuleReferenceSyntax(Syntax.token(SyntaxKind.ModuleKeyword), Syntax.token(SyntaxKind.OpenParenToken), stringLiteral, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExternalModuleReferenceSyntax {
        return <ExternalModuleReferenceSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExternalModuleReferenceSyntax {
        return <ExternalModuleReferenceSyntax>super.withTrailingTrivia(trivia);
    }

    public withModuleKeyword(moduleKeyword: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(moduleKeyword, this.openParenToken, this.stringLiteral, this.closeParenToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(this.moduleKeyword, openParenToken, this.stringLiteral, this.closeParenToken);
    }

    public withStringLiteral(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(this.moduleKeyword, this.openParenToken, stringLiteral, this.closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(this.moduleKeyword, this.openParenToken, this.stringLiteral, closeParenToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ModuleNameModuleReferenceSyntax extends ModuleReferenceSyntax {

    constructor(public moduleName: INameSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitModuleNameModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleNameModuleReference;
    }

    public childCount(): number {
        return 1;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.moduleName;
            default: throw Errors.invalidOperation();
        }
    }

    public update(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
        if (this.moduleName === moduleName) {
            return this;
        }

        return new ModuleNameModuleReferenceSyntax(moduleName, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleNameModuleReferenceSyntax {
        return <ModuleNameModuleReferenceSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleNameModuleReferenceSyntax {
        return <ModuleNameModuleReferenceSyntax>super.withTrailingTrivia(trivia);
    }

    public withModuleName(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
        return this.update(moduleName);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ImportDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {

    constructor(public importKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public equalsToken: ISyntaxToken,
                public moduleReference: ModuleReferenceSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitImportDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImportDeclaration;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.importKeyword;
            case 1: return this.identifier;
            case 2: return this.equalsToken;
            case 3: return this.moduleReference;
            case 4: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(importKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  equalsToken: ISyntaxToken,
                  moduleReference: ModuleReferenceSyntax,
                  semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
        if (this.importKeyword === importKeyword && this.identifier === identifier && this.equalsToken === equalsToken && this.moduleReference === moduleReference && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(identifier: ISyntaxToken,
                          moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax {
        return new ImportDeclarationSyntax(Syntax.token(SyntaxKind.ImportKeyword), identifier, Syntax.token(SyntaxKind.EqualsToken), moduleReference, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ImportDeclarationSyntax {
        return <ImportDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ImportDeclarationSyntax {
        return <ImportDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withImportKeyword(importKeyword: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(importKeyword, this.identifier, this.equalsToken, this.moduleReference, this.semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(this.importKeyword, identifier, this.equalsToken, this.moduleReference, this.semicolonToken);
    }

    public withEqualsToken(equalsToken: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(this.importKeyword, this.identifier, equalsToken, this.moduleReference, this.semicolonToken);
    }

    public withModuleReference(moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax {
        return this.update(this.importKeyword, this.identifier, this.equalsToken, moduleReference, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(this.importKeyword, this.identifier, this.equalsToken, this.moduleReference, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ExportAssignmentSyntax extends SyntaxNode implements IModuleElementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public equalsToken: ISyntaxToken,
                public identifier: ISyntaxToken,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExportAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExportAssignment;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.equalsToken;
            case 2: return this.identifier;
            case 3: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  equalsToken: ISyntaxToken,
                  identifier: ISyntaxToken,
                  semicolonToken: ISyntaxToken): ExportAssignmentSyntax {
        if (this.exportKeyword === exportKeyword && this.equalsToken === equalsToken && this.identifier === identifier && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ExportAssignmentSyntax(exportKeyword, equalsToken, identifier, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(identifier: ISyntaxToken): ExportAssignmentSyntax {
        return new ExportAssignmentSyntax(Syntax.token(SyntaxKind.ExportKeyword), Syntax.token(SyntaxKind.EqualsToken), identifier, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExportAssignmentSyntax {
        return <ExportAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExportAssignmentSyntax {
        return <ExportAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): ExportAssignmentSyntax {
        return this.update(exportKeyword, this.equalsToken, this.identifier, this.semicolonToken);
    }

    public withEqualsToken(equalsToken: ISyntaxToken): ExportAssignmentSyntax {
        return this.update(this.exportKeyword, equalsToken, this.identifier, this.semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ExportAssignmentSyntax {
        return this.update(this.exportKeyword, this.equalsToken, identifier, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ExportAssignmentSyntax {
        return this.update(this.exportKeyword, this.equalsToken, this.identifier, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ClassDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public declareKeyword: ISyntaxToken,
                public classKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public typeParameterList: TypeParameterListSyntax,
                public extendsClause: ExtendsClauseSyntax,
                public implementsClause: ImplementsClauseSyntax,
                public openBraceToken: ISyntaxToken,
                public classElements: ISyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitClassDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ClassDeclaration;
    }

    public childCount(): number {
        return 10;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.declareKeyword;
            case 2: return this.classKeyword;
            case 3: return this.identifier;
            case 4: return this.typeParameterList;
            case 5: return this.extendsClause;
            case 6: return this.implementsClause;
            case 7: return this.openBraceToken;
            case 8: return this.classElements;
            case 9: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  classKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  typeParameterList: TypeParameterListSyntax,
                  extendsClause: ExtendsClauseSyntax,
                  implementsClause: ImplementsClauseSyntax,
                  openBraceToken: ISyntaxToken,
                  classElements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        if (this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.classKeyword === classKeyword && this.identifier === identifier && this.typeParameterList === typeParameterList && this.extendsClause === extendsClause && this.implementsClause === implementsClause && this.openBraceToken === openBraceToken && this.classElements === classElements && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(classKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return new ClassDeclarationSyntax(null, null, classKeyword, identifier, null, null, null, openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): ClassDeclarationSyntax {
        return new ClassDeclarationSyntax(null, null, Syntax.token(SyntaxKind.ClassKeyword), identifier, null, null, null, Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax {
        return <ClassDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax {
        return <ClassDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withClassKeyword(classKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, classKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, identifier, this.typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withExtendsClause(extendsClause: ExtendsClauseSyntax): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, extendsClause, this.implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withImplementsClause(implementsClause: ImplementsClauseSyntax): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, this.extendsClause, implementsClause, this.openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.implementsClause, openBraceToken, this.classElements, this.closeBraceToken);
    }

    public withClassElements(classElements: ISyntaxList): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, classElements, this.closeBraceToken);
    }

    public withClassElement(classElement: IClassElementSyntax): ClassDeclarationSyntax {
        return this.withClassElements(Syntax.list([classElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.classKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.implementsClause, this.openBraceToken, this.classElements, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class InterfaceDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public interfaceKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public typeParameterList: TypeParameterListSyntax,
                public extendsClause: ExtendsClauseSyntax,
                public body: ObjectTypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitInterfaceDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InterfaceDeclaration;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.interfaceKeyword;
            case 2: return this.identifier;
            case 3: return this.typeParameterList;
            case 4: return this.extendsClause;
            case 5: return this.body;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  interfaceKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  typeParameterList: TypeParameterListSyntax,
                  extendsClause: ExtendsClauseSyntax,
                  body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        if (this.exportKeyword === exportKeyword && this.interfaceKeyword === interfaceKeyword && this.identifier === identifier && this.typeParameterList === typeParameterList && this.extendsClause === extendsClause && this.body === body) {
            return this;
        }

        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(interfaceKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        return new InterfaceDeclarationSyntax(null, interfaceKeyword, identifier, null, null, body, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): InterfaceDeclarationSyntax {
        return new InterfaceDeclarationSyntax(null, Syntax.token(SyntaxKind.InterfaceKeyword), identifier, null, null, ObjectTypeSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax {
        return <InterfaceDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax {
        return <InterfaceDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(exportKeyword, this.interfaceKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.body);
    }

    public withInterfaceKeyword(interfaceKeyword: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(this.exportKeyword, interfaceKeyword, this.identifier, this.typeParameterList, this.extendsClause, this.body);
    }

    public withIdentifier(identifier: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(this.exportKeyword, this.interfaceKeyword, identifier, this.typeParameterList, this.extendsClause, this.body);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): InterfaceDeclarationSyntax {
        return this.update(this.exportKeyword, this.interfaceKeyword, this.identifier, typeParameterList, this.extendsClause, this.body);
    }

    public withExtendsClause(extendsClause: ExtendsClauseSyntax): InterfaceDeclarationSyntax {
        return this.update(this.exportKeyword, this.interfaceKeyword, this.identifier, this.typeParameterList, extendsClause, this.body);
    }

    public withBody(body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        return this.update(this.exportKeyword, this.interfaceKeyword, this.identifier, this.typeParameterList, this.extendsClause, body);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ExtendsClauseSyntax extends SyntaxNode {

    constructor(public extendsKeyword: ISyntaxToken,
                public typeNames: ISeparatedSyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExtendsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExtendsClause;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.extendsKeyword;
            case 1: return this.typeNames;
            default: throw Errors.invalidOperation();
        }
    }

    public update(extendsKeyword: ISyntaxToken,
                  typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        if (this.extendsKeyword === extendsKeyword && this.typeNames === typeNames) {
            return this;
        }

        return new ExtendsClauseSyntax(extendsKeyword, typeNames, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        return new ExtendsClauseSyntax(Syntax.token(SyntaxKind.ExtendsKeyword), typeNames, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExtendsClauseSyntax {
        return <ExtendsClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExtendsClauseSyntax {
        return <ExtendsClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withExtendsKeyword(extendsKeyword: ISyntaxToken): ExtendsClauseSyntax {
        return this.update(extendsKeyword, this.typeNames);
    }

    public withTypeNames(typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        return this.update(this.extendsKeyword, typeNames);
    }

    public withTypeName(typeName: INameSyntax): ExtendsClauseSyntax {
        return this.withTypeNames(Syntax.separatedList([typeName]));
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ImplementsClauseSyntax extends SyntaxNode {

    constructor(public implementsKeyword: ISyntaxToken,
                public typeNames: ISeparatedSyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitImplementsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImplementsClause;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.implementsKeyword;
            case 1: return this.typeNames;
            default: throw Errors.invalidOperation();
        }
    }

    public update(implementsKeyword: ISyntaxToken,
                  typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        if (this.implementsKeyword === implementsKeyword && this.typeNames === typeNames) {
            return this;
        }

        return new ImplementsClauseSyntax(implementsKeyword, typeNames, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        return new ImplementsClauseSyntax(Syntax.token(SyntaxKind.ImplementsKeyword), typeNames, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ImplementsClauseSyntax {
        return <ImplementsClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ImplementsClauseSyntax {
        return <ImplementsClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withImplementsKeyword(implementsKeyword: ISyntaxToken): ImplementsClauseSyntax {
        return this.update(implementsKeyword, this.typeNames);
    }

    public withTypeNames(typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        return this.update(this.implementsKeyword, typeNames);
    }

    public withTypeName(typeName: INameSyntax): ImplementsClauseSyntax {
        return this.withTypeNames(Syntax.separatedList([typeName]));
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ModuleDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public declareKeyword: ISyntaxToken,
                public moduleKeyword: ISyntaxToken,
                public moduleName: INameSyntax,
                public stringLiteral: ISyntaxToken,
                public openBraceToken: ISyntaxToken,
                public moduleElements: ISyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitModuleDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleDeclaration;
    }

    public childCount(): number {
        return 8;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.declareKeyword;
            case 2: return this.moduleKeyword;
            case 3: return this.moduleName;
            case 4: return this.stringLiteral;
            case 5: return this.openBraceToken;
            case 6: return this.moduleElements;
            case 7: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  moduleKeyword: ISyntaxToken,
                  moduleName: INameSyntax,
                  stringLiteral: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  moduleElements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        if (this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.moduleKeyword === moduleKeyword && this.moduleName === moduleName && this.stringLiteral === stringLiteral && this.openBraceToken === openBraceToken && this.moduleElements === moduleElements && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(moduleKeyword: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return new ModuleDeclarationSyntax(null, null, moduleKeyword, null, null, openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ModuleDeclarationSyntax {
        return new ModuleDeclarationSyntax(null, null, Syntax.token(SyntaxKind.ModuleKeyword), null, null, Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleDeclarationSyntax {
        return <ModuleDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleDeclarationSyntax {
        return <ModuleDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(exportKeyword, this.declareKeyword, this.moduleKeyword, this.moduleName, this.stringLiteral, this.openBraceToken, this.moduleElements, this.closeBraceToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, declareKeyword, this.moduleKeyword, this.moduleName, this.stringLiteral, this.openBraceToken, this.moduleElements, this.closeBraceToken);
    }

    public withModuleKeyword(moduleKeyword: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, moduleKeyword, this.moduleName, this.stringLiteral, this.openBraceToken, this.moduleElements, this.closeBraceToken);
    }

    public withModuleName(moduleName: INameSyntax): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.moduleKeyword, moduleName, this.stringLiteral, this.openBraceToken, this.moduleElements, this.closeBraceToken);
    }

    public withStringLiteral(stringLiteral: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.moduleKeyword, this.moduleName, stringLiteral, this.openBraceToken, this.moduleElements, this.closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.moduleKeyword, this.moduleName, this.stringLiteral, openBraceToken, this.moduleElements, this.closeBraceToken);
    }

    public withModuleElements(moduleElements: ISyntaxList): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.moduleKeyword, this.moduleName, this.stringLiteral, this.openBraceToken, moduleElements, this.closeBraceToken);
    }

    public withModuleElement(moduleElement: IModuleElementSyntax): ModuleDeclarationSyntax {
        return this.withModuleElements(Syntax.list([moduleElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.moduleKeyword, this.moduleName, this.stringLiteral, this.openBraceToken, this.moduleElements, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class FunctionDeclarationSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public declareKeyword: ISyntaxToken,
                public functionKeyword: ISyntaxToken,
                public functionSignature: FunctionSignatureSyntax,
                public block: BlockSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionDeclaration;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.declareKeyword;
            case 2: return this.functionKeyword;
            case 3: return this.functionSignature;
            case 4: return this.block;
            case 5: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  functionKeyword: ISyntaxToken,
                  functionSignature: FunctionSignatureSyntax,
                  block: BlockSyntax,
                  semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
        if (this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.functionKeyword === functionKeyword && this.functionSignature === functionSignature && this.block === block && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(functionKeyword: ISyntaxToken,
                         functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return new FunctionDeclarationSyntax(null, null, functionKeyword, functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return new FunctionDeclarationSyntax(null, null, Syntax.token(SyntaxKind.FunctionKeyword), functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionDeclarationSyntax {
        return <FunctionDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionDeclarationSyntax {
        return <FunctionDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(exportKeyword, this.declareKeyword, this.functionKeyword, this.functionSignature, this.block, this.semicolonToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(this.exportKeyword, declareKeyword, this.functionKeyword, this.functionSignature, this.block, this.semicolonToken);
    }

    public withFunctionKeyword(functionKeyword: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, functionKeyword, this.functionSignature, this.block, this.semicolonToken);
    }

    public withFunctionSignature(functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.functionKeyword, functionSignature, this.block, this.semicolonToken);
    }

    public withBlock(block: BlockSyntax): FunctionDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.functionKeyword, this.functionSignature, block, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.functionKeyword, this.functionSignature, this.block, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.exportKeyword !== null) { return true; }
        if (this.declareKeyword !== null) { return true; }
        if (this.functionSignature.isTypeScriptSpecific()) { return true; }
        if (this.block !== null && this.block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VariableStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public declareKeyword: ISyntaxToken,
                public variableDeclaration: VariableDeclarationSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableStatement;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.declareKeyword;
            case 2: return this.variableDeclaration;
            case 3: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  semicolonToken: ISyntaxToken): VariableStatementSyntax {
        if (this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.variableDeclaration === variableDeclaration && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(variableDeclaration: VariableDeclarationSyntax,
                         semicolonToken: ISyntaxToken): VariableStatementSyntax {
        return new VariableStatementSyntax(null, null, variableDeclaration, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax {
        return new VariableStatementSyntax(null, null, variableDeclaration, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VariableStatementSyntax {
        return <VariableStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VariableStatementSyntax {
        return <VariableStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): VariableStatementSyntax {
        return this.update(exportKeyword, this.declareKeyword, this.variableDeclaration, this.semicolonToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): VariableStatementSyntax {
        return this.update(this.exportKeyword, declareKeyword, this.variableDeclaration, this.semicolonToken);
    }

    public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, variableDeclaration, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): VariableStatementSyntax {
        return this.update(this.exportKeyword, this.declareKeyword, this.variableDeclaration, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.exportKeyword !== null) { return true; }
        if (this.declareKeyword !== null) { return true; }
        if (this.variableDeclaration.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VariableDeclarationSyntax extends SyntaxNode {

    constructor(public varKeyword: ISyntaxToken,
                public variableDeclarators: ISeparatedSyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclaration;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.varKeyword;
            case 1: return this.variableDeclarators;
            default: throw Errors.invalidOperation();
        }
    }

    public update(varKeyword: ISyntaxToken,
                  variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        if (this.varKeyword === varKeyword && this.variableDeclarators === variableDeclarators) {
            return this;
        }

        return new VariableDeclarationSyntax(varKeyword, variableDeclarators, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        return new VariableDeclarationSyntax(Syntax.token(SyntaxKind.VarKeyword), variableDeclarators, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VariableDeclarationSyntax {
        return <VariableDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VariableDeclarationSyntax {
        return <VariableDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withVarKeyword(varKeyword: ISyntaxToken): VariableDeclarationSyntax {
        return this.update(varKeyword, this.variableDeclarators);
    }

    public withVariableDeclarators(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        return this.update(this.varKeyword, variableDeclarators);
    }

    public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): VariableDeclarationSyntax {
        return this.withVariableDeclarators(Syntax.separatedList([variableDeclarator]));
    }

    public isTypeScriptSpecific(): bool {
        if (this.variableDeclarators.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VariableDeclaratorSyntax extends SyntaxNode implements IEnumElementSyntax {

    constructor(public identifier: ISyntaxToken,
                public typeAnnotation: TypeAnnotationSyntax,
                public equalsValueClause: EqualsValueClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableDeclarator(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclarator;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.typeAnnotation;
            case 2: return this.equalsValueClause;
            default: throw Errors.invalidOperation();
        }
    }

    private isEnumElement(): bool {
        return true;
    }

    public update(identifier: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax,
                  equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
        if (this.identifier === identifier && this.typeAnnotation === typeAnnotation && this.equalsValueClause === equalsValueClause) {
            return this;
        }

        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return new VariableDeclaratorSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return new VariableDeclaratorSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VariableDeclaratorSyntax {
        return <VariableDeclaratorSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VariableDeclaratorSyntax {
        return <VariableDeclaratorSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return this.update(identifier, this.typeAnnotation, this.equalsValueClause);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): VariableDeclaratorSyntax {
        return this.update(this.identifier, typeAnnotation, this.equalsValueClause);
    }

    public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
        return this.update(this.identifier, this.typeAnnotation, equalsValueClause);
    }

    public isTypeScriptSpecific(): bool {
        if (this.typeAnnotation !== null) { return true; }
        if (this.equalsValueClause !== null && this.equalsValueClause.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class EqualsValueClauseSyntax extends SyntaxNode {

    constructor(public equalsToken: ISyntaxToken,
                public value: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEqualsValueClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EqualsValueClause;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.equalsToken;
            case 1: return this.value;
            default: throw Errors.invalidOperation();
        }
    }

    public update(equalsToken: ISyntaxToken,
                  value: IExpressionSyntax): EqualsValueClauseSyntax {
        if (this.equalsToken === equalsToken && this.value === value) {
            return this;
        }

        return new EqualsValueClauseSyntax(equalsToken, value, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(value: IExpressionSyntax): EqualsValueClauseSyntax {
        return new EqualsValueClauseSyntax(Syntax.token(SyntaxKind.EqualsToken), value, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): EqualsValueClauseSyntax {
        return <EqualsValueClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): EqualsValueClauseSyntax {
        return <EqualsValueClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withEqualsToken(equalsToken: ISyntaxToken): EqualsValueClauseSyntax {
        return this.update(equalsToken, this.value);
    }

    public withValue(value: IExpressionSyntax): EqualsValueClauseSyntax {
        return this.update(this.equalsToken, value);
    }

    public isTypeScriptSpecific(): bool {
        if (this.value.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ColonValueClauseSyntax extends SyntaxNode {

    constructor(public colonToken: ISyntaxToken,
                public value: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitColonValueClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ColonValueClause;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.colonToken;
            case 1: return this.value;
            default: throw Errors.invalidOperation();
        }
    }

    public update(colonToken: ISyntaxToken,
                  value: IExpressionSyntax): ColonValueClauseSyntax {
        if (this.colonToken === colonToken && this.value === value) {
            return this;
        }

        return new ColonValueClauseSyntax(colonToken, value, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(value: IExpressionSyntax): ColonValueClauseSyntax {
        return new ColonValueClauseSyntax(Syntax.token(SyntaxKind.ColonToken), value, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ColonValueClauseSyntax {
        return <ColonValueClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ColonValueClauseSyntax {
        return <ColonValueClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withColonToken(colonToken: ISyntaxToken): ColonValueClauseSyntax {
        return this.update(colonToken, this.value);
    }

    public withValue(value: IExpressionSyntax): ColonValueClauseSyntax {
        return this.update(this.colonToken, value);
    }

    public isTypeScriptSpecific(): bool {
        if (this.value.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class PrefixUnaryExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _kind: SyntaxKind;

    constructor(kind: SyntaxKind,
                public operatorToken: ISyntaxToken,
                public operand: IUnaryExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

        this._kind = kind;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPrefixUnaryExpression(this);
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.operatorToken;
            case 1: return this.operand;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public update(kind: SyntaxKind,
                  operatorToken: ISyntaxToken,
                  operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        if (this._kind === kind && this.operatorToken === operatorToken && this.operand === operand) {
            return this;
        }

        return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PrefixUnaryExpressionSyntax {
        return <PrefixUnaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PrefixUnaryExpressionSyntax {
        return <PrefixUnaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): PrefixUnaryExpressionSyntax {
        return this.update(kind, this.operatorToken, this.operand);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, operatorToken, this.operand);
    }

    public withOperand(operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, this.operatorToken, operand);
    }

    public isTypeScriptSpecific(): bool {
        if (this.operand.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ArrayLiteralExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public openBracketToken: ISyntaxToken,
                public expressions: ISeparatedSyntaxList,
                public closeBracketToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArrayLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayLiteralExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openBracketToken;
            case 1: return this.expressions;
            case 2: return this.closeBracketToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(openBracketToken: ISyntaxToken,
                  expressions: ISeparatedSyntaxList,
                  closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        if (this.openBracketToken === openBracketToken && this.expressions === expressions && this.closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openBracketToken: ISyntaxToken,
                         closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return new ArrayLiteralExpressionSyntax(openBracketToken, Syntax.emptySeparatedList, closeBracketToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ArrayLiteralExpressionSyntax {
        return new ArrayLiteralExpressionSyntax(Syntax.token(SyntaxKind.OpenBracketToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBracketToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayLiteralExpressionSyntax {
        return <ArrayLiteralExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayLiteralExpressionSyntax {
        return <ArrayLiteralExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(openBracketToken, this.expressions, this.closeBracketToken);
    }

    public withExpressions(expressions: ISeparatedSyntaxList): ArrayLiteralExpressionSyntax {
        return this.update(this.openBracketToken, expressions, this.closeBracketToken);
    }

    public withExpression(expression: IExpressionSyntax): ArrayLiteralExpressionSyntax {
        return this.withExpressions(Syntax.separatedList([expression]));
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(this.openBracketToken, this.expressions, closeBracketToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expressions.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class OmittedExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitOmittedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.OmittedExpression;
    }

    public childCount(): number {
        return 0;
    }

    public childAt(slot: number): ISyntaxElement {
        throw Errors.invalidOperation();
    }

    private isExpression(): bool {
        return true;
    }

    public update(): OmittedExpressionSyntax {
        return this;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): OmittedExpressionSyntax {
        return <OmittedExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): OmittedExpressionSyntax {
        return <OmittedExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class ParenthesizedExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public openParenToken: ISyntaxToken,
                public expression: IExpressionSyntax,
                public closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParenthesizedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openParenToken;
            case 1: return this.expression;
            case 2: return this.closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(openParenToken: ISyntaxToken,
                  expression: IExpressionSyntax,
                  closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        if (this.openParenToken === openParenToken && this.expression === expression && this.closeParenToken === closeParenToken) {
            return this;
        }

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): ParenthesizedExpressionSyntax {
        return new ParenthesizedExpressionSyntax(Syntax.token(SyntaxKind.OpenParenToken), expression, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParenthesizedExpressionSyntax {
        return <ParenthesizedExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParenthesizedExpressionSyntax {
        return <ParenthesizedExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        return this.update(openParenToken, this.expression, this.closeParenToken);
    }

    public withExpression(expression: IExpressionSyntax): ParenthesizedExpressionSyntax {
        return this.update(this.openParenToken, expression, this.closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        return this.update(this.openParenToken, this.expression, closeParenToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ArrowFunctionExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    constructor(public equalsGreaterThanToken: ISyntaxToken,
                public body: ISyntaxNodeOrToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrowFunctionExpressionSyntax {
        return <ArrowFunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrowFunctionExpressionSyntax {
        return <ArrowFunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class SimpleArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {

    constructor(public identifier: ISyntaxToken,
                equalsGreaterThanToken: ISyntaxToken,
                body: ISyntaxNodeOrToken,
                parsedInStrictMode: bool) {
        super(equalsGreaterThanToken, body, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSimpleArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimpleArrowFunctionExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.equalsGreaterThanToken;
            case 2: return this.body;
            default: throw Errors.invalidOperation();
        }
    }

    public update(identifier: ISyntaxToken,
                  equalsGreaterThanToken: ISyntaxToken,
                  body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
        if (this.identifier === identifier && this.equalsGreaterThanToken === equalsGreaterThanToken && this.body === body) {
            return this;
        }

        return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(identifier: ISyntaxToken,
                          body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
        return new SimpleArrowFunctionExpressionSyntax(identifier, Syntax.token(SyntaxKind.EqualsGreaterThanToken), body, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax {
        return <SimpleArrowFunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax {
        return <SimpleArrowFunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): SimpleArrowFunctionExpressionSyntax {
        return this.update(identifier, this.equalsGreaterThanToken, this.body);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): SimpleArrowFunctionExpressionSyntax {
        return this.update(this.identifier, equalsGreaterThanToken, this.body);
    }

    public withBody(body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
        return this.update(this.identifier, this.equalsGreaterThanToken, body);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ParenthesizedArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {

    constructor(public callSignature: CallSignatureSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                body: ISyntaxNodeOrToken,
                parsedInStrictMode: bool) {
        super(equalsGreaterThanToken, body, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParenthesizedArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedArrowFunctionExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.callSignature;
            case 1: return this.equalsGreaterThanToken;
            case 2: return this.body;
            default: throw Errors.invalidOperation();
        }
    }

    public update(callSignature: CallSignatureSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
        if (this.callSignature === callSignature && this.equalsGreaterThanToken === equalsGreaterThanToken && this.body === body) {
            return this;
        }

        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
        return new ParenthesizedArrowFunctionExpressionSyntax(CallSignatureSyntax.create1(), Syntax.token(SyntaxKind.EqualsGreaterThanToken), body, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax {
        return <ParenthesizedArrowFunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax {
        return <ParenthesizedArrowFunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(callSignature, this.equalsGreaterThanToken, this.body);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(this.callSignature, equalsGreaterThanToken, this.body);
    }

    public withBody(body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(this.callSignature, this.equalsGreaterThanToken, body);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class QualifiedNameSyntax extends SyntaxNode implements INameSyntax {

    constructor(public left: INameSyntax,
                public dotToken: ISyntaxToken,
                public right: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitQualifiedName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.QualifiedName;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.left;
            case 1: return this.dotToken;
            case 2: return this.right;
            default: throw Errors.invalidOperation();
        }
    }

    private isName(): bool {
        return true;
    }

    private isType(): bool {
        return true;
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(left: INameSyntax,
                  dotToken: ISyntaxToken,
                  right: ISyntaxToken): QualifiedNameSyntax {
        if (this.left === left && this.dotToken === dotToken && this.right === right) {
            return this;
        }

        return new QualifiedNameSyntax(left, dotToken, right, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(left: INameSyntax,
                          right: ISyntaxToken): QualifiedNameSyntax {
        return new QualifiedNameSyntax(left, Syntax.token(SyntaxKind.DotToken), right, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax {
        return <QualifiedNameSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax {
        return <QualifiedNameSyntax>super.withTrailingTrivia(trivia);
    }

    public withLeft(left: INameSyntax): QualifiedNameSyntax {
        return this.update(left, this.dotToken, this.right);
    }

    public withDotToken(dotToken: ISyntaxToken): QualifiedNameSyntax {
        return this.update(this.left, dotToken, this.right);
    }

    public withRight(right: ISyntaxToken): QualifiedNameSyntax {
        return this.update(this.left, this.dotToken, right);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class TypeArgumentListSyntax extends SyntaxNode {

    constructor(public lessThanToken: ISyntaxToken,
                public typeArguments: ISeparatedSyntaxList,
                public greaterThanToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeArgumentList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeArgumentList;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.lessThanToken;
            case 1: return this.typeArguments;
            case 2: return this.greaterThanToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(lessThanToken: ISyntaxToken,
                  typeArguments: ISeparatedSyntaxList,
                  greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
        if (this.lessThanToken === lessThanToken && this.typeArguments === typeArguments && this.greaterThanToken === greaterThanToken) {
            return this;
        }

        return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(lessThanToken: ISyntaxToken,
                         greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
        return new TypeArgumentListSyntax(lessThanToken, Syntax.emptySeparatedList, greaterThanToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): TypeArgumentListSyntax {
        return new TypeArgumentListSyntax(Syntax.token(SyntaxKind.LessThanToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.GreaterThanToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeArgumentListSyntax {
        return <TypeArgumentListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeArgumentListSyntax {
        return <TypeArgumentListSyntax>super.withTrailingTrivia(trivia);
    }

    public withLessThanToken(lessThanToken: ISyntaxToken): TypeArgumentListSyntax {
        return this.update(lessThanToken, this.typeArguments, this.greaterThanToken);
    }

    public withTypeArguments(typeArguments: ISeparatedSyntaxList): TypeArgumentListSyntax {
        return this.update(this.lessThanToken, typeArguments, this.greaterThanToken);
    }

    public withTypeArgument(typeArgument: ITypeSyntax): TypeArgumentListSyntax {
        return this.withTypeArguments(Syntax.separatedList([typeArgument]));
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
        return this.update(this.lessThanToken, this.typeArguments, greaterThanToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ConstructorTypeSyntax extends SyntaxNode implements ITypeSyntax {

    constructor(public newKeyword: ISyntaxToken,
                public typeParameterList: TypeParameterListSyntax,
                public parameterList: ParameterListSyntax,
                public equalsGreaterThanToken: ISyntaxToken,
                public type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructorType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorType;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.newKeyword;
            case 1: return this.typeParameterList;
            case 2: return this.parameterList;
            case 3: return this.equalsGreaterThanToken;
            case 4: return this.type;
            default: throw Errors.invalidOperation();
        }
    }

    private isType(): bool {
        return true;
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(newKeyword: ISyntaxToken,
                  typeParameterList: TypeParameterListSyntax,
                  parameterList: ParameterListSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  type: ITypeSyntax): ConstructorTypeSyntax {
        if (this.newKeyword === newKeyword && this.typeParameterList === typeParameterList && this.parameterList === parameterList && this.equalsGreaterThanToken === equalsGreaterThanToken && this.type === type) {
            return this;
        }

        return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(newKeyword: ISyntaxToken,
                         parameterList: ParameterListSyntax,
                         equalsGreaterThanToken: ISyntaxToken,
                         type: ITypeSyntax): ConstructorTypeSyntax {
        return new ConstructorTypeSyntax(newKeyword, null, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
    }

    public static create1(type: ITypeSyntax): ConstructorTypeSyntax {
        return new ConstructorTypeSyntax(Syntax.token(SyntaxKind.NewKeyword), null, ParameterListSyntax.create1(), Syntax.token(SyntaxKind.EqualsGreaterThanToken), type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax {
        return <ConstructorTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax {
        return <ConstructorTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ConstructorTypeSyntax {
        return this.update(newKeyword, this.typeParameterList, this.parameterList, this.equalsGreaterThanToken, this.type);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ConstructorTypeSyntax {
        return this.update(this.newKeyword, typeParameterList, this.parameterList, this.equalsGreaterThanToken, this.type);
    }

    public withParameterList(parameterList: ParameterListSyntax): ConstructorTypeSyntax {
        return this.update(this.newKeyword, this.typeParameterList, parameterList, this.equalsGreaterThanToken, this.type);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ConstructorTypeSyntax {
        return this.update(this.newKeyword, this.typeParameterList, this.parameterList, equalsGreaterThanToken, this.type);
    }

    public withType(type: ITypeSyntax): ConstructorTypeSyntax {
        return this.update(this.newKeyword, this.typeParameterList, this.parameterList, this.equalsGreaterThanToken, type);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class FunctionTypeSyntax extends SyntaxNode implements ITypeSyntax {

    constructor(public typeParameterList: TypeParameterListSyntax,
                public parameterList: ParameterListSyntax,
                public equalsGreaterThanToken: ISyntaxToken,
                public type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionType;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.typeParameterList;
            case 1: return this.parameterList;
            case 2: return this.equalsGreaterThanToken;
            case 3: return this.type;
            default: throw Errors.invalidOperation();
        }
    }

    private isType(): bool {
        return true;
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(typeParameterList: TypeParameterListSyntax,
                  parameterList: ParameterListSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  type: ITypeSyntax): FunctionTypeSyntax {
        if (this.typeParameterList === typeParameterList && this.parameterList === parameterList && this.equalsGreaterThanToken === equalsGreaterThanToken && this.type === type) {
            return this;
        }

        return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(parameterList: ParameterListSyntax,
                         equalsGreaterThanToken: ISyntaxToken,
                         type: ITypeSyntax): FunctionTypeSyntax {
        return new FunctionTypeSyntax(null, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
    }

    public static create1(type: ITypeSyntax): FunctionTypeSyntax {
        return new FunctionTypeSyntax(null, ParameterListSyntax.create1(), Syntax.token(SyntaxKind.EqualsGreaterThanToken), type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax {
        return <FunctionTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax {
        return <FunctionTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): FunctionTypeSyntax {
        return this.update(typeParameterList, this.parameterList, this.equalsGreaterThanToken, this.type);
    }

    public withParameterList(parameterList: ParameterListSyntax): FunctionTypeSyntax {
        return this.update(this.typeParameterList, parameterList, this.equalsGreaterThanToken, this.type);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): FunctionTypeSyntax {
        return this.update(this.typeParameterList, this.parameterList, equalsGreaterThanToken, this.type);
    }

    public withType(type: ITypeSyntax): FunctionTypeSyntax {
        return this.update(this.typeParameterList, this.parameterList, this.equalsGreaterThanToken, type);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ObjectTypeSyntax extends SyntaxNode implements ITypeSyntax {

    constructor(public openBraceToken: ISyntaxToken,
                public typeMembers: ISeparatedSyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectType;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openBraceToken;
            case 1: return this.typeMembers;
            case 2: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isType(): bool {
        return true;
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(openBraceToken: ISyntaxToken,
                  typeMembers: ISeparatedSyntaxList,
                  closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        if (this.openBraceToken === openBraceToken && this.typeMembers === typeMembers && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return new ObjectTypeSyntax(openBraceToken, Syntax.emptySeparatedList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ObjectTypeSyntax {
        return new ObjectTypeSyntax(Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectTypeSyntax {
        return <ObjectTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectTypeSyntax {
        return <ObjectTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(openBraceToken, this.typeMembers, this.closeBraceToken);
    }

    public withTypeMembers(typeMembers: ISeparatedSyntaxList): ObjectTypeSyntax {
        return this.update(this.openBraceToken, typeMembers, this.closeBraceToken);
    }

    public withTypeMember(typeMember: TypeMemberSyntax): ObjectTypeSyntax {
        return this.withTypeMembers(Syntax.separatedList([typeMember]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(this.openBraceToken, this.typeMembers, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ArrayTypeSyntax extends SyntaxNode implements ITypeSyntax {

    constructor(public type: ITypeSyntax,
                public openBracketToken: ISyntaxToken,
                public closeBracketToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArrayType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayType;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.type;
            case 1: return this.openBracketToken;
            case 2: return this.closeBracketToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isType(): bool {
        return true;
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(type: ITypeSyntax,
                  openBracketToken: ISyntaxToken,
                  closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
        if (this.type === type && this.openBracketToken === openBracketToken && this.closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(type: ITypeSyntax): ArrayTypeSyntax {
        return new ArrayTypeSyntax(type, Syntax.token(SyntaxKind.OpenBracketToken), Syntax.token(SyntaxKind.CloseBracketToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax {
        return <ArrayTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax {
        return <ArrayTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withType(type: ITypeSyntax): ArrayTypeSyntax {
        return this.update(type, this.openBracketToken, this.closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayTypeSyntax {
        return this.update(this.type, openBracketToken, this.closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
        return this.update(this.type, this.openBracketToken, closeBracketToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class GenericTypeSyntax extends SyntaxNode implements ITypeSyntax {

    constructor(public name: INameSyntax,
                public typeArgumentList: TypeArgumentListSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGenericType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GenericType;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.name;
            case 1: return this.typeArgumentList;
            default: throw Errors.invalidOperation();
        }
    }

    private isType(): bool {
        return true;
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(name: INameSyntax,
                  typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax {
        if (this.name === name && this.typeArgumentList === typeArgumentList) {
            return this;
        }

        return new GenericTypeSyntax(name, typeArgumentList, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(name: INameSyntax): GenericTypeSyntax {
        return new GenericTypeSyntax(name, TypeArgumentListSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): GenericTypeSyntax {
        return <GenericTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): GenericTypeSyntax {
        return <GenericTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withName(name: INameSyntax): GenericTypeSyntax {
        return this.update(name, this.typeArgumentList);
    }

    public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax {
        return this.update(this.name, typeArgumentList);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class TypeAnnotationSyntax extends SyntaxNode {

    constructor(public colonToken: ISyntaxToken,
                public type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeAnnotation(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeAnnotation;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.colonToken;
            case 1: return this.type;
            default: throw Errors.invalidOperation();
        }
    }

    public update(colonToken: ISyntaxToken,
                  type: ITypeSyntax): TypeAnnotationSyntax {
        if (this.colonToken === colonToken && this.type === type) {
            return this;
        }

        return new TypeAnnotationSyntax(colonToken, type, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(type: ITypeSyntax): TypeAnnotationSyntax {
        return new TypeAnnotationSyntax(Syntax.token(SyntaxKind.ColonToken), type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeAnnotationSyntax {
        return <TypeAnnotationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeAnnotationSyntax {
        return <TypeAnnotationSyntax>super.withTrailingTrivia(trivia);
    }

    public withColonToken(colonToken: ISyntaxToken): TypeAnnotationSyntax {
        return this.update(colonToken, this.type);
    }

    public withType(type: ITypeSyntax): TypeAnnotationSyntax {
        return this.update(this.colonToken, type);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class BlockSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public openBraceToken: ISyntaxToken,
                public statements: ISyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBlock(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Block;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openBraceToken;
            case 1: return this.statements;
            case 2: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(openBraceToken: ISyntaxToken,
                  statements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): BlockSyntax {
        if (this.openBraceToken === openBraceToken && this.statements === statements && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new BlockSyntax(openBraceToken, statements, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): BlockSyntax {
        return new BlockSyntax(openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): BlockSyntax {
        return new BlockSyntax(Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BlockSyntax {
        return <BlockSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BlockSyntax {
        return <BlockSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(openBraceToken, this.statements, this.closeBraceToken);
    }

    public withStatements(statements: ISyntaxList): BlockSyntax {
        return this.update(this.openBraceToken, statements, this.closeBraceToken);
    }

    public withStatement(statement: IStatementSyntax): BlockSyntax {
        return this.withStatements(Syntax.list([statement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(this.openBraceToken, this.statements, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.statements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ParameterSyntax extends SyntaxNode {

    constructor(public dotDotDotToken: ISyntaxToken,
                public publicOrPrivateKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public questionToken: ISyntaxToken,
                public typeAnnotation: TypeAnnotationSyntax,
                public equalsValueClause: EqualsValueClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParameter(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Parameter;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.dotDotDotToken;
            case 1: return this.publicOrPrivateKeyword;
            case 2: return this.identifier;
            case 3: return this.questionToken;
            case 4: return this.typeAnnotation;
            case 5: return this.equalsValueClause;
            default: throw Errors.invalidOperation();
        }
    }

    public update(dotDotDotToken: ISyntaxToken,
                  publicOrPrivateKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax,
                  equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
        if (this.dotDotDotToken === dotDotDotToken && this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.identifier === identifier && this.questionToken === questionToken && this.typeAnnotation === typeAnnotation && this.equalsValueClause === equalsValueClause) {
            return this;
        }

        return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(identifier: ISyntaxToken): ParameterSyntax {
        return new ParameterSyntax(null, null, identifier, null, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): ParameterSyntax {
        return new ParameterSyntax(null, null, identifier, null, null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParameterSyntax {
        return <ParameterSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParameterSyntax {
        return <ParameterSyntax>super.withTrailingTrivia(trivia);
    }

    public withDotDotDotToken(dotDotDotToken: ISyntaxToken): ParameterSyntax {
        return this.update(dotDotDotToken, this.publicOrPrivateKeyword, this.identifier, this.questionToken, this.typeAnnotation, this.equalsValueClause);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): ParameterSyntax {
        return this.update(this.dotDotDotToken, publicOrPrivateKeyword, this.identifier, this.questionToken, this.typeAnnotation, this.equalsValueClause);
    }

    public withIdentifier(identifier: ISyntaxToken): ParameterSyntax {
        return this.update(this.dotDotDotToken, this.publicOrPrivateKeyword, identifier, this.questionToken, this.typeAnnotation, this.equalsValueClause);
    }

    public withQuestionToken(questionToken: ISyntaxToken): ParameterSyntax {
        return this.update(this.dotDotDotToken, this.publicOrPrivateKeyword, this.identifier, questionToken, this.typeAnnotation, this.equalsValueClause);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): ParameterSyntax {
        return this.update(this.dotDotDotToken, this.publicOrPrivateKeyword, this.identifier, this.questionToken, typeAnnotation, this.equalsValueClause);
    }

    public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
        return this.update(this.dotDotDotToken, this.publicOrPrivateKeyword, this.identifier, this.questionToken, this.typeAnnotation, equalsValueClause);
    }

    public isTypeScriptSpecific(): bool {
        if (this.dotDotDotToken !== null) { return true; }
        if (this.publicOrPrivateKeyword !== null) { return true; }
        if (this.questionToken !== null) { return true; }
        if (this.typeAnnotation !== null) { return true; }
        if (this.equalsValueClause !== null) { return true; }
        return false;
    }
}

class MemberAccessExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public expression: IExpressionSyntax,
                public dotToken: ISyntaxToken,
                public name: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberAccessExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.expression;
            case 1: return this.dotToken;
            case 2: return this.name;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(expression: IExpressionSyntax,
                  dotToken: ISyntaxToken,
                  name: ISyntaxToken): MemberAccessExpressionSyntax {
        if (this.expression === expression && this.dotToken === dotToken && this.name === name) {
            return this;
        }

        return new MemberAccessExpressionSyntax(expression, dotToken, name, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax,
                          name: ISyntaxToken): MemberAccessExpressionSyntax {
        return new MemberAccessExpressionSyntax(expression, Syntax.token(SyntaxKind.DotToken), name, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax {
        return <MemberAccessExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax {
        return <MemberAccessExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): MemberAccessExpressionSyntax {
        return this.update(expression, this.dotToken, this.name);
    }

    public withDotToken(dotToken: ISyntaxToken): MemberAccessExpressionSyntax {
        return this.update(this.expression, dotToken, this.name);
    }

    public withName(name: ISyntaxToken): MemberAccessExpressionSyntax {
        return this.update(this.expression, this.dotToken, name);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class PostfixUnaryExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _kind: SyntaxKind;

    constructor(kind: SyntaxKind,
                public operand: IExpressionSyntax,
                public operatorToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

        this._kind = kind;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPostfixUnaryExpression(this);
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.operand;
            case 1: return this.operatorToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public update(kind: SyntaxKind,
                  operand: IExpressionSyntax,
                  operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        if (this._kind === kind && this.operand === operand && this.operatorToken === operatorToken) {
            return this;
        }

        return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PostfixUnaryExpressionSyntax {
        return <PostfixUnaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PostfixUnaryExpressionSyntax {
        return <PostfixUnaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): PostfixUnaryExpressionSyntax {
        return this.update(kind, this.operand, this.operatorToken);
    }

    public withOperand(operand: IExpressionSyntax): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, operand, this.operatorToken);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, this.operand, operatorToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.operand.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ElementAccessExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public expression: IExpressionSyntax,
                public openBracketToken: ISyntaxToken,
                public argumentExpression: IExpressionSyntax,
                public closeBracketToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitElementAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElementAccessExpression;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.expression;
            case 1: return this.openBracketToken;
            case 2: return this.argumentExpression;
            case 3: return this.closeBracketToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(expression: IExpressionSyntax,
                  openBracketToken: ISyntaxToken,
                  argumentExpression: IExpressionSyntax,
                  closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        if (this.expression === expression && this.openBracketToken === openBracketToken && this.argumentExpression === argumentExpression && this.closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax,
                          argumentExpression: IExpressionSyntax): ElementAccessExpressionSyntax {
        return new ElementAccessExpressionSyntax(expression, Syntax.token(SyntaxKind.OpenBracketToken), argumentExpression, Syntax.token(SyntaxKind.CloseBracketToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax {
        return <ElementAccessExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax {
        return <ElementAccessExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): ElementAccessExpressionSyntax {
        return this.update(expression, this.openBracketToken, this.argumentExpression, this.closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        return this.update(this.expression, openBracketToken, this.argumentExpression, this.closeBracketToken);
    }

    public withArgumentExpression(argumentExpression: IExpressionSyntax): ElementAccessExpressionSyntax {
        return this.update(this.expression, this.openBracketToken, argumentExpression, this.closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        return this.update(this.expression, this.openBracketToken, this.argumentExpression, closeBracketToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        if (this.argumentExpression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class InvocationExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public expression: IExpressionSyntax,
                public argumentList: ArgumentListSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitInvocationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InvocationExpression;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.expression;
            case 1: return this.argumentList;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(expression: IExpressionSyntax,
                  argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        if (this.expression === expression && this.argumentList === argumentList) {
            return this;
        }

        return new InvocationExpressionSyntax(expression, argumentList, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): InvocationExpressionSyntax {
        return new InvocationExpressionSyntax(expression, ArgumentListSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax {
        return <InvocationExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax {
        return <InvocationExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): InvocationExpressionSyntax {
        return this.update(expression, this.argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        return this.update(this.expression, argumentList);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        if (this.argumentList.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ArgumentListSyntax extends SyntaxNode {

    constructor(public typeArgumentList: TypeArgumentListSyntax,
                public openParenToken: ISyntaxToken,
                public arguments: ISeparatedSyntaxList,
                public closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArgumentList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArgumentList;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.typeArgumentList;
            case 1: return this.openParenToken;
            case 2: return this.arguments;
            case 3: return this.closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(typeArgumentList: TypeArgumentListSyntax,
                  openParenToken: ISyntaxToken,
                  _arguments: ISeparatedSyntaxList,
                  closeParenToken: ISyntaxToken): ArgumentListSyntax {
        if (this.typeArgumentList === typeArgumentList && this.openParenToken === openParenToken && this.arguments === _arguments && this.closeParenToken === closeParenToken) {
            return this;
        }

        return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openParenToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return new ArgumentListSyntax(null, openParenToken, Syntax.emptySeparatedList, closeParenToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ArgumentListSyntax {
        return new ArgumentListSyntax(null, Syntax.token(SyntaxKind.OpenParenToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax {
        return <ArgumentListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax {
        return <ArgumentListSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): ArgumentListSyntax {
        return this.update(typeArgumentList, this.openParenToken, this.arguments, this.closeParenToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(this.typeArgumentList, openParenToken, this.arguments, this.closeParenToken);
    }

    public withArguments(_arguments: ISeparatedSyntaxList): ArgumentListSyntax {
        return this.update(this.typeArgumentList, this.openParenToken, _arguments, this.closeParenToken);
    }

    public withArgument(_argument: IExpressionSyntax): ArgumentListSyntax {
        return this.withArguments(Syntax.separatedList([_argument]));
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(this.typeArgumentList, this.openParenToken, this.arguments, closeParenToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.typeArgumentList !== null && this.typeArgumentList.isTypeScriptSpecific()) { return true; }
        if (this.arguments.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class BinaryExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
    private _kind: SyntaxKind;

    constructor(kind: SyntaxKind,
                public left: IExpressionSyntax,
                public operatorToken: ISyntaxToken,
                public right: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

        this._kind = kind;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBinaryExpression(this);
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.left;
            case 1: return this.operatorToken;
            case 2: return this.right;
            default: throw Errors.invalidOperation();
        }
    }

    private isExpression(): bool {
        return true;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public update(kind: SyntaxKind,
                  left: IExpressionSyntax,
                  operatorToken: ISyntaxToken,
                  right: IExpressionSyntax): BinaryExpressionSyntax {
        if (this._kind === kind && this.left === left && this.operatorToken === operatorToken && this.right === right) {
            return this;
        }

        return new BinaryExpressionSyntax(kind, left, operatorToken, right, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BinaryExpressionSyntax {
        return <BinaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BinaryExpressionSyntax {
        return <BinaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): BinaryExpressionSyntax {
        return this.update(kind, this.left, this.operatorToken, this.right);
    }

    public withLeft(left: IExpressionSyntax): BinaryExpressionSyntax {
        return this.update(this._kind, left, this.operatorToken, this.right);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): BinaryExpressionSyntax {
        return this.update(this._kind, this.left, operatorToken, this.right);
    }

    public withRight(right: IExpressionSyntax): BinaryExpressionSyntax {
        return this.update(this._kind, this.left, this.operatorToken, right);
    }

    public isTypeScriptSpecific(): bool {
        if (this.left.isTypeScriptSpecific()) { return true; }
        if (this.right.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ConditionalExpressionSyntax extends SyntaxNode implements IExpressionSyntax {

    constructor(public condition: IExpressionSyntax,
                public questionToken: ISyntaxToken,
                public whenTrue: IExpressionSyntax,
                public colonToken: ISyntaxToken,
                public whenFalse: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConditionalExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConditionalExpression;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.condition;
            case 1: return this.questionToken;
            case 2: return this.whenTrue;
            case 3: return this.colonToken;
            case 4: return this.whenFalse;
            default: throw Errors.invalidOperation();
        }
    }

    private isExpression(): bool {
        return true;
    }

    public update(condition: IExpressionSyntax,
                  questionToken: ISyntaxToken,
                  whenTrue: IExpressionSyntax,
                  colonToken: ISyntaxToken,
                  whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
        if (this.condition === condition && this.questionToken === questionToken && this.whenTrue === whenTrue && this.colonToken === colonToken && this.whenFalse === whenFalse) {
            return this;
        }

        return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(condition: IExpressionSyntax,
                          whenTrue: IExpressionSyntax,
                          whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
        return new ConditionalExpressionSyntax(condition, Syntax.token(SyntaxKind.QuestionToken), whenTrue, Syntax.token(SyntaxKind.ColonToken), whenFalse, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax {
        return <ConditionalExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax {
        return <ConditionalExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withCondition(condition: IExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(condition, this.questionToken, this.whenTrue, this.colonToken, this.whenFalse);
    }

    public withQuestionToken(questionToken: ISyntaxToken): ConditionalExpressionSyntax {
        return this.update(this.condition, questionToken, this.whenTrue, this.colonToken, this.whenFalse);
    }

    public withWhenTrue(whenTrue: IExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(this.condition, this.questionToken, whenTrue, this.colonToken, this.whenFalse);
    }

    public withColonToken(colonToken: ISyntaxToken): ConditionalExpressionSyntax {
        return this.update(this.condition, this.questionToken, this.whenTrue, colonToken, this.whenFalse);
    }

    public withWhenFalse(whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(this.condition, this.questionToken, this.whenTrue, this.colonToken, whenFalse);
    }

    public isTypeScriptSpecific(): bool {
        if (this.condition.isTypeScriptSpecific()) { return true; }
        if (this.whenTrue.isTypeScriptSpecific()) { return true; }
        if (this.whenFalse.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class TypeMemberSyntax extends SyntaxNode implements ITypeMemberSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    private isTypeMember(): bool {
        return true;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeMemberSyntax {
        return <TypeMemberSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeMemberSyntax {
        return <TypeMemberSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ConstructSignatureSyntax extends TypeMemberSyntax {

    constructor(public newKeyword: ISyntaxToken,
                public callSignature: CallSignatureSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructSignature;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.newKeyword;
            case 1: return this.callSignature;
            default: throw Errors.invalidOperation();
        }
    }

    public update(newKeyword: ISyntaxToken,
                  callSignature: CallSignatureSyntax): ConstructSignatureSyntax {
        if (this.newKeyword === newKeyword && this.callSignature === callSignature) {
            return this;
        }

        return new ConstructSignatureSyntax(newKeyword, callSignature, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(): ConstructSignatureSyntax {
        return new ConstructSignatureSyntax(Syntax.token(SyntaxKind.NewKeyword), CallSignatureSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax {
        return <ConstructSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax {
        return <ConstructSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ConstructSignatureSyntax {
        return this.update(newKeyword, this.callSignature);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): ConstructSignatureSyntax {
        return this.update(this.newKeyword, callSignature);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class FunctionSignatureSyntax extends TypeMemberSyntax {

    constructor(public identifier: ISyntaxToken,
                public questionToken: ISyntaxToken,
                public callSignature: CallSignatureSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionSignature;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.questionToken;
            case 2: return this.callSignature;
            default: throw Errors.invalidOperation();
        }
    }

    public update(identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
        if (this.identifier === identifier && this.questionToken === questionToken && this.callSignature === callSignature) {
            return this;
        }

        return new FunctionSignatureSyntax(identifier, questionToken, callSignature, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(identifier: ISyntaxToken,
                         callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
        return new FunctionSignatureSyntax(identifier, null, callSignature, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): FunctionSignatureSyntax {
        return new FunctionSignatureSyntax(identifier, null, CallSignatureSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionSignatureSyntax {
        return <FunctionSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionSignatureSyntax {
        return <FunctionSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): FunctionSignatureSyntax {
        return this.update(identifier, this.questionToken, this.callSignature);
    }

    public withQuestionToken(questionToken: ISyntaxToken): FunctionSignatureSyntax {
        return this.update(this.identifier, questionToken, this.callSignature);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
        return this.update(this.identifier, this.questionToken, callSignature);
    }

    public isTypeScriptSpecific(): bool {
        if (this.callSignature.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class IndexSignatureSyntax extends TypeMemberSyntax {

    constructor(public openBracketToken: ISyntaxToken,
                public parameter: ParameterSyntax,
                public closeBracketToken: ISyntaxToken,
                public typeAnnotation: TypeAnnotationSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIndexSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IndexSignature;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openBracketToken;
            case 1: return this.parameter;
            case 2: return this.closeBracketToken;
            case 3: return this.typeAnnotation;
            default: throw Errors.invalidOperation();
        }
    }

    public update(openBracketToken: ISyntaxToken,
                  parameter: ParameterSyntax,
                  closeBracketToken: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
        if (this.openBracketToken === openBracketToken && this.parameter === parameter && this.closeBracketToken === closeBracketToken && this.typeAnnotation === typeAnnotation) {
            return this;
        }

        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openBracketToken: ISyntaxToken,
                         parameter: ParameterSyntax,
                         closeBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(parameter: ParameterSyntax): IndexSignatureSyntax {
        return new IndexSignatureSyntax(Syntax.token(SyntaxKind.OpenBracketToken), parameter, Syntax.token(SyntaxKind.CloseBracketToken), null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IndexSignatureSyntax {
        return <IndexSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IndexSignatureSyntax {
        return <IndexSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return this.update(openBracketToken, this.parameter, this.closeBracketToken, this.typeAnnotation);
    }

    public withParameter(parameter: ParameterSyntax): IndexSignatureSyntax {
        return this.update(this.openBracketToken, parameter, this.closeBracketToken, this.typeAnnotation);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return this.update(this.openBracketToken, this.parameter, closeBracketToken, this.typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
        return this.update(this.openBracketToken, this.parameter, this.closeBracketToken, typeAnnotation);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class PropertySignatureSyntax extends TypeMemberSyntax {

    constructor(public identifier: ISyntaxToken,
                public questionToken: ISyntaxToken,
                public typeAnnotation: TypeAnnotationSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPropertySignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PropertySignature;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.questionToken;
            case 2: return this.typeAnnotation;
            default: throw Errors.invalidOperation();
        }
    }

    public update(identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
        if (this.identifier === identifier && this.questionToken === questionToken && this.typeAnnotation === typeAnnotation) {
            return this;
        }

        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(identifier: ISyntaxToken): PropertySignatureSyntax {
        return new PropertySignatureSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): PropertySignatureSyntax {
        return new PropertySignatureSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PropertySignatureSyntax {
        return <PropertySignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PropertySignatureSyntax {
        return <PropertySignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): PropertySignatureSyntax {
        return this.update(identifier, this.questionToken, this.typeAnnotation);
    }

    public withQuestionToken(questionToken: ISyntaxToken): PropertySignatureSyntax {
        return this.update(this.identifier, questionToken, this.typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
        return this.update(this.identifier, this.questionToken, typeAnnotation);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ParameterListSyntax extends SyntaxNode {

    constructor(public openParenToken: ISyntaxToken,
                public parameters: ISeparatedSyntaxList,
                public closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParameterList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParameterList;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openParenToken;
            case 1: return this.parameters;
            case 2: return this.closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(openParenToken: ISyntaxToken,
                  parameters: ISeparatedSyntaxList,
                  closeParenToken: ISyntaxToken): ParameterListSyntax {
        if (this.openParenToken === openParenToken && this.parameters === parameters && this.closeParenToken === closeParenToken) {
            return this;
        }

        return new ParameterListSyntax(openParenToken, parameters, closeParenToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openParenToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken): ParameterListSyntax {
        return new ParameterListSyntax(openParenToken, Syntax.emptySeparatedList, closeParenToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ParameterListSyntax {
        return new ParameterListSyntax(Syntax.token(SyntaxKind.OpenParenToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParameterListSyntax {
        return <ParameterListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParameterListSyntax {
        return <ParameterListSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(openParenToken, this.parameters, this.closeParenToken);
    }

    public withParameters(parameters: ISeparatedSyntaxList): ParameterListSyntax {
        return this.update(this.openParenToken, parameters, this.closeParenToken);
    }

    public withParameter(parameter: ParameterSyntax): ParameterListSyntax {
        return this.withParameters(Syntax.separatedList([parameter]));
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(this.openParenToken, this.parameters, closeParenToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.parameters.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class CallSignatureSyntax extends TypeMemberSyntax {

    constructor(public typeParameterList: TypeParameterListSyntax,
                public parameterList: ParameterListSyntax,
                public typeAnnotation: TypeAnnotationSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCallSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CallSignature;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.typeParameterList;
            case 1: return this.parameterList;
            case 2: return this.typeAnnotation;
            default: throw Errors.invalidOperation();
        }
    }

    public update(typeParameterList: TypeParameterListSyntax,
                  parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        if (this.typeParameterList === typeParameterList && this.parameterList === parameterList && this.typeAnnotation === typeAnnotation) {
            return this;
        }

        return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return new CallSignatureSyntax(null, parameterList, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): CallSignatureSyntax {
        return new CallSignatureSyntax(null, ParameterListSyntax.create1(), null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax {
        return <CallSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax {
        return <CallSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): CallSignatureSyntax {
        return this.update(typeParameterList, this.parameterList, this.typeAnnotation);
    }

    public withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return this.update(this.typeParameterList, parameterList, this.typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        return this.update(this.typeParameterList, this.parameterList, typeAnnotation);
    }

    public isTypeScriptSpecific(): bool {
        if (this.typeParameterList !== null) { return true; }
        if (this.parameterList.isTypeScriptSpecific()) { return true; }
        if (this.typeAnnotation !== null) { return true; }
        return false;
    }
}

class TypeParameterListSyntax extends SyntaxNode {

    constructor(public lessThanToken: ISyntaxToken,
                public typeParameters: ISeparatedSyntaxList,
                public greaterThanToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeParameterList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeParameterList;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.lessThanToken;
            case 1: return this.typeParameters;
            case 2: return this.greaterThanToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(lessThanToken: ISyntaxToken,
                  typeParameters: ISeparatedSyntaxList,
                  greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
        if (this.lessThanToken === lessThanToken && this.typeParameters === typeParameters && this.greaterThanToken === greaterThanToken) {
            return this;
        }

        return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(lessThanToken: ISyntaxToken,
                         greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
        return new TypeParameterListSyntax(lessThanToken, Syntax.emptySeparatedList, greaterThanToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): TypeParameterListSyntax {
        return new TypeParameterListSyntax(Syntax.token(SyntaxKind.LessThanToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.GreaterThanToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeParameterListSyntax {
        return <TypeParameterListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeParameterListSyntax {
        return <TypeParameterListSyntax>super.withTrailingTrivia(trivia);
    }

    public withLessThanToken(lessThanToken: ISyntaxToken): TypeParameterListSyntax {
        return this.update(lessThanToken, this.typeParameters, this.greaterThanToken);
    }

    public withTypeParameters(typeParameters: ISeparatedSyntaxList): TypeParameterListSyntax {
        return this.update(this.lessThanToken, typeParameters, this.greaterThanToken);
    }

    public withTypeParameter(typeParameter: TypeParameterSyntax): TypeParameterListSyntax {
        return this.withTypeParameters(Syntax.separatedList([typeParameter]));
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
        return this.update(this.lessThanToken, this.typeParameters, greaterThanToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class TypeParameterSyntax extends SyntaxNode {

    constructor(public identifier: ISyntaxToken,
                public constraint: ConstraintSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeParameter(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeParameter;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.constraint;
            default: throw Errors.invalidOperation();
        }
    }

    public update(identifier: ISyntaxToken,
                  constraint: ConstraintSyntax): TypeParameterSyntax {
        if (this.identifier === identifier && this.constraint === constraint) {
            return this;
        }

        return new TypeParameterSyntax(identifier, constraint, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(identifier: ISyntaxToken): TypeParameterSyntax {
        return new TypeParameterSyntax(identifier, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): TypeParameterSyntax {
        return new TypeParameterSyntax(identifier, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeParameterSyntax {
        return <TypeParameterSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeParameterSyntax {
        return <TypeParameterSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): TypeParameterSyntax {
        return this.update(identifier, this.constraint);
    }

    public withConstraint(constraint: ConstraintSyntax): TypeParameterSyntax {
        return this.update(this.identifier, constraint);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ConstraintSyntax extends SyntaxNode {

    constructor(public extendsKeyword: ISyntaxToken,
                public type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstraint(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Constraint;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.extendsKeyword;
            case 1: return this.type;
            default: throw Errors.invalidOperation();
        }
    }

    public update(extendsKeyword: ISyntaxToken,
                  type: ITypeSyntax): ConstraintSyntax {
        if (this.extendsKeyword === extendsKeyword && this.type === type) {
            return this;
        }

        return new ConstraintSyntax(extendsKeyword, type, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(type: ITypeSyntax): ConstraintSyntax {
        return new ConstraintSyntax(Syntax.token(SyntaxKind.ExtendsKeyword), type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstraintSyntax {
        return <ConstraintSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstraintSyntax {
        return <ConstraintSyntax>super.withTrailingTrivia(trivia);
    }

    public withExtendsKeyword(extendsKeyword: ISyntaxToken): ConstraintSyntax {
        return this.update(extendsKeyword, this.type);
    }

    public withType(type: ITypeSyntax): ConstraintSyntax {
        return this.update(this.extendsKeyword, type);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ElseClauseSyntax extends SyntaxNode {

    constructor(public elseKeyword: ISyntaxToken,
                public statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitElseClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElseClause;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.elseKeyword;
            case 1: return this.statement;
            default: throw Errors.invalidOperation();
        }
    }

    public update(elseKeyword: ISyntaxToken,
                  statement: IStatementSyntax): ElseClauseSyntax {
        if (this.elseKeyword === elseKeyword && this.statement === statement) {
            return this;
        }

        return new ElseClauseSyntax(elseKeyword, statement, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(statement: IStatementSyntax): ElseClauseSyntax {
        return new ElseClauseSyntax(Syntax.token(SyntaxKind.ElseKeyword), statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ElseClauseSyntax {
        return <ElseClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ElseClauseSyntax {
        return <ElseClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withElseKeyword(elseKeyword: ISyntaxToken): ElseClauseSyntax {
        return this.update(elseKeyword, this.statement);
    }

    public withStatement(statement: IStatementSyntax): ElseClauseSyntax {
        return this.update(this.elseKeyword, statement);
    }

    public isTypeScriptSpecific(): bool {
        if (this.statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class IfStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public ifKeyword: ISyntaxToken,
                public openParenToken: ISyntaxToken,
                public condition: IExpressionSyntax,
                public closeParenToken: ISyntaxToken,
                public statement: IStatementSyntax,
                public elseClause: ElseClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIfStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IfStatement;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.ifKeyword;
            case 1: return this.openParenToken;
            case 2: return this.condition;
            case 3: return this.closeParenToken;
            case 4: return this.statement;
            case 5: return this.elseClause;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(ifKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax,
                  elseClause: ElseClauseSyntax): IfStatementSyntax {
        if (this.ifKeyword === ifKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.statement === statement && this.elseClause === elseClause) {
            return this;
        }

        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(ifKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         condition: IExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         statement: IStatementSyntax): IfStatementSyntax {
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(condition: IExpressionSyntax,
                          statement: IStatementSyntax): IfStatementSyntax {
        return new IfStatementSyntax(Syntax.token(SyntaxKind.IfKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), statement, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IfStatementSyntax {
        return <IfStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IfStatementSyntax {
        return <IfStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withIfKeyword(ifKeyword: ISyntaxToken): IfStatementSyntax {
        return this.update(ifKeyword, this.openParenToken, this.condition, this.closeParenToken, this.statement, this.elseClause);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): IfStatementSyntax {
        return this.update(this.ifKeyword, openParenToken, this.condition, this.closeParenToken, this.statement, this.elseClause);
    }

    public withCondition(condition: IExpressionSyntax): IfStatementSyntax {
        return this.update(this.ifKeyword, this.openParenToken, condition, this.closeParenToken, this.statement, this.elseClause);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): IfStatementSyntax {
        return this.update(this.ifKeyword, this.openParenToken, this.condition, closeParenToken, this.statement, this.elseClause);
    }

    public withStatement(statement: IStatementSyntax): IfStatementSyntax {
        return this.update(this.ifKeyword, this.openParenToken, this.condition, this.closeParenToken, statement, this.elseClause);
    }

    public withElseClause(elseClause: ElseClauseSyntax): IfStatementSyntax {
        return this.update(this.ifKeyword, this.openParenToken, this.condition, this.closeParenToken, this.statement, elseClause);
    }

    public isTypeScriptSpecific(): bool {
        if (this.condition.isTypeScriptSpecific()) { return true; }
        if (this.statement.isTypeScriptSpecific()) { return true; }
        if (this.elseClause !== null && this.elseClause.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ExpressionStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public expression: IExpressionSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExpressionStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExpressionStatement;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.expression;
            case 1: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(expression: IExpressionSyntax,
                  semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        if (this.expression === expression && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ExpressionStatementSyntax(expression, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): ExpressionStatementSyntax {
        return new ExpressionStatementSyntax(expression, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax {
        return <ExpressionStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax {
        return <ExpressionStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): ExpressionStatementSyntax {
        return this.update(expression, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        return this.update(this.expression, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ConstructorDeclarationSyntax extends SyntaxNode implements IClassElementSyntax {

    constructor(public constructorKeyword: ISyntaxToken,
                public parameterList: ParameterListSyntax,
                public block: BlockSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorDeclaration;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.constructorKeyword;
            case 1: return this.parameterList;
            case 2: return this.block;
            case 3: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isClassElement(): bool {
        return true;
    }

    public update(constructorKeyword: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  block: BlockSyntax,
                  semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
        if (this.constructorKeyword === constructorKeyword && this.parameterList === parameterList && this.block === block && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(constructorKeyword: ISyntaxToken,
                         parameterList: ParameterListSyntax): ConstructorDeclarationSyntax {
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ConstructorDeclarationSyntax {
        return new ConstructorDeclarationSyntax(Syntax.token(SyntaxKind.ConstructorKeyword), ParameterListSyntax.create1(), null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorDeclarationSyntax {
        return <ConstructorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorDeclarationSyntax {
        return <ConstructorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withConstructorKeyword(constructorKeyword: ISyntaxToken): ConstructorDeclarationSyntax {
        return this.update(constructorKeyword, this.parameterList, this.block, this.semicolonToken);
    }

    public withParameterList(parameterList: ParameterListSyntax): ConstructorDeclarationSyntax {
        return this.update(this.constructorKeyword, parameterList, this.block, this.semicolonToken);
    }

    public withBlock(block: BlockSyntax): ConstructorDeclarationSyntax {
        return this.update(this.constructorKeyword, this.parameterList, block, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
        return this.update(this.constructorKeyword, this.parameterList, this.block, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberFunctionDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {

    constructor(public publicOrPrivateKeyword: ISyntaxToken,
                public staticKeyword: ISyntaxToken,
                public functionSignature: FunctionSignatureSyntax,
                public block: BlockSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.publicOrPrivateKeyword;
            case 1: return this.staticKeyword;
            case 2: return this.functionSignature;
            case 3: return this.block;
            case 4: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isMemberDeclaration(): bool {
        return true;
    }

    private isClassElement(): bool {
        return true;
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  functionSignature: FunctionSignatureSyntax,
                  block: BlockSyntax,
                  semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
        if (this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.functionSignature === functionSignature && this.block === block && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return new MemberFunctionDeclarationSyntax(null, null, functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return new MemberFunctionDeclarationSyntax(null, null, functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberFunctionDeclarationSyntax {
        return <MemberFunctionDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberFunctionDeclarationSyntax {
        return <MemberFunctionDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): MemberFunctionDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this.staticKeyword, this.functionSignature, this.block, this.semicolonToken);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): MemberFunctionDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, staticKeyword, this.functionSignature, this.block, this.semicolonToken);
    }

    public withFunctionSignature(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, functionSignature, this.block, this.semicolonToken);
    }

    public withBlock(block: BlockSyntax): MemberFunctionDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.functionSignature, block, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.functionSignature, this.block, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberAccessorDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {
    constructor(public publicOrPrivateKeyword: ISyntaxToken,
                public staticKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public parameterList: ParameterListSyntax,
                public block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    private isMemberDeclaration(): bool {
        return true;
    }

    private isClassElement(): bool {
        return true;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberAccessorDeclarationSyntax {
        return <MemberAccessorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberAccessorDeclarationSyntax {
        return <MemberAccessorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class GetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                public getKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                parameterList: ParameterListSyntax,
                public typeAnnotation: TypeAnnotationSyntax,
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetMemberAccessorDeclaration;
    }

    public childCount(): number {
        return 7;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.publicOrPrivateKeyword;
            case 1: return this.staticKeyword;
            case 2: return this.getKeyword;
            case 3: return this.identifier;
            case 4: return this.parameterList;
            case 5: return this.typeAnnotation;
            case 6: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  getKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax,
                  block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
        if (this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.getKeyword === getKeyword && this.identifier === identifier && this.parameterList === parameterList && this.typeAnnotation === typeAnnotation && this.block === block) {
            return this;
        }

        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(getKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         parameterList: ParameterListSyntax,
                         block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
        return new GetMemberAccessorDeclarationSyntax(null, null, getKeyword, identifier, parameterList, null, block, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return new GetMemberAccessorDeclarationSyntax(null, null, Syntax.token(SyntaxKind.GetKeyword), identifier, ParameterListSyntax.create1(), null, BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): GetMemberAccessorDeclarationSyntax {
        return <GetMemberAccessorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): GetMemberAccessorDeclarationSyntax {
        return <GetMemberAccessorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this.staticKeyword, this.getKeyword, this.identifier, this.parameterList, this.typeAnnotation, this.block);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, staticKeyword, this.getKeyword, this.identifier, this.parameterList, this.typeAnnotation, this.block);
    }

    public withGetKeyword(getKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, getKeyword, this.identifier, this.parameterList, this.typeAnnotation, this.block);
    }

    public withIdentifier(identifier: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.getKeyword, identifier, this.parameterList, this.typeAnnotation, this.block);
    }

    public withParameterList(parameterList: ParameterListSyntax): GetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.getKeyword, this.identifier, parameterList, this.typeAnnotation, this.block);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): GetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.getKeyword, this.identifier, this.parameterList, typeAnnotation, this.block);
    }

    public withBlock(block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.getKeyword, this.identifier, this.parameterList, this.typeAnnotation, block);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class SetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                public setKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                parameterList: ParameterListSyntax,
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetMemberAccessorDeclaration;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.publicOrPrivateKeyword;
            case 1: return this.staticKeyword;
            case 2: return this.setKeyword;
            case 3: return this.identifier;
            case 4: return this.parameterList;
            case 5: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  setKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
        if (this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.setKeyword === setKeyword && this.identifier === identifier && this.parameterList === parameterList && this.block === block) {
            return this;
        }

        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(setKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         parameterList: ParameterListSyntax,
                         block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
        return new SetMemberAccessorDeclarationSyntax(null, null, setKeyword, identifier, parameterList, block, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return new SetMemberAccessorDeclarationSyntax(null, null, Syntax.token(SyntaxKind.SetKeyword), identifier, ParameterListSyntax.create1(), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SetMemberAccessorDeclarationSyntax {
        return <SetMemberAccessorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SetMemberAccessorDeclarationSyntax {
        return <SetMemberAccessorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this.staticKeyword, this.setKeyword, this.identifier, this.parameterList, this.block);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, staticKeyword, this.setKeyword, this.identifier, this.parameterList, this.block);
    }

    public withSetKeyword(setKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, setKeyword, this.identifier, this.parameterList, this.block);
    }

    public withIdentifier(identifier: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.setKeyword, identifier, this.parameterList, this.block);
    }

    public withParameterList(parameterList: ParameterListSyntax): SetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.setKeyword, this.identifier, parameterList, this.block);
    }

    public withBlock(block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.setKeyword, this.identifier, this.parameterList, block);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberVariableDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {

    constructor(public publicOrPrivateKeyword: ISyntaxToken,
                public staticKeyword: ISyntaxToken,
                public variableDeclarator: VariableDeclaratorSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberVariableDeclaration;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.publicOrPrivateKeyword;
            case 1: return this.staticKeyword;
            case 2: return this.variableDeclarator;
            case 3: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isMemberDeclaration(): bool {
        return true;
    }

    private isClassElement(): bool {
        return true;
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  variableDeclarator: VariableDeclaratorSyntax,
                  semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        if (this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.variableDeclarator === variableDeclarator && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(variableDeclarator: VariableDeclaratorSyntax,
                         semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        return new MemberVariableDeclarationSyntax(null, null, variableDeclarator, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax {
        return new MemberVariableDeclarationSyntax(null, null, variableDeclarator, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberVariableDeclarationSyntax {
        return <MemberVariableDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberVariableDeclarationSyntax {
        return <MemberVariableDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): MemberVariableDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this.staticKeyword, this.variableDeclarator, this.semicolonToken);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): MemberVariableDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, staticKeyword, this.variableDeclarator, this.semicolonToken);
    }

    public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, variableDeclarator, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        return this.update(this.publicOrPrivateKeyword, this.staticKeyword, this.variableDeclarator, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ThrowStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public throwKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitThrowStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThrowStatement;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.throwKeyword;
            case 1: return this.expression;
            case 2: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(throwKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  semicolonToken: ISyntaxToken): ThrowStatementSyntax {
        if (this.throwKeyword === throwKeyword && this.expression === expression && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): ThrowStatementSyntax {
        return new ThrowStatementSyntax(Syntax.token(SyntaxKind.ThrowKeyword), expression, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ThrowStatementSyntax {
        return <ThrowStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ThrowStatementSyntax {
        return <ThrowStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withThrowKeyword(throwKeyword: ISyntaxToken): ThrowStatementSyntax {
        return this.update(throwKeyword, this.expression, this.semicolonToken);
    }

    public withExpression(expression: IExpressionSyntax): ThrowStatementSyntax {
        return this.update(this.throwKeyword, expression, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ThrowStatementSyntax {
        return this.update(this.throwKeyword, this.expression, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ReturnStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public returnKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitReturnStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ReturnStatement;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.returnKeyword;
            case 1: return this.expression;
            case 2: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(returnKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        if (this.returnKeyword === returnKeyword && this.expression === expression && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(returnKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        return new ReturnStatementSyntax(returnKeyword, null, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ReturnStatementSyntax {
        return new ReturnStatementSyntax(Syntax.token(SyntaxKind.ReturnKeyword), null, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ReturnStatementSyntax {
        return <ReturnStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ReturnStatementSyntax {
        return <ReturnStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withReturnKeyword(returnKeyword: ISyntaxToken): ReturnStatementSyntax {
        return this.update(returnKeyword, this.expression, this.semicolonToken);
    }

    public withExpression(expression: IExpressionSyntax): ReturnStatementSyntax {
        return this.update(this.returnKeyword, expression, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        return this.update(this.returnKeyword, this.expression, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression !== null && this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ObjectCreationExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public newKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                public argumentList: ArgumentListSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectCreationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectCreationExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.newKeyword;
            case 1: return this.expression;
            case 2: return this.argumentList;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(newKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
        if (this.newKeyword === newKeyword && this.expression === expression && this.argumentList === argumentList) {
            return this;
        }

        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(newKeyword: ISyntaxToken,
                         expression: IExpressionSyntax): ObjectCreationExpressionSyntax {
        return new ObjectCreationExpressionSyntax(newKeyword, expression, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax): ObjectCreationExpressionSyntax {
        return new ObjectCreationExpressionSyntax(Syntax.token(SyntaxKind.NewKeyword), expression, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectCreationExpressionSyntax {
        return <ObjectCreationExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectCreationExpressionSyntax {
        return <ObjectCreationExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ObjectCreationExpressionSyntax {
        return this.update(newKeyword, this.expression, this.argumentList);
    }

    public withExpression(expression: IExpressionSyntax): ObjectCreationExpressionSyntax {
        return this.update(this.newKeyword, expression, this.argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
        return this.update(this.newKeyword, this.expression, argumentList);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        if (this.argumentList !== null && this.argumentList.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class SwitchStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public switchKeyword: ISyntaxToken,
                public openParenToken: ISyntaxToken,
                public expression: IExpressionSyntax,
                public closeParenToken: ISyntaxToken,
                public openBraceToken: ISyntaxToken,
                public switchClauses: ISyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSwitchStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SwitchStatement;
    }

    public childCount(): number {
        return 7;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.switchKeyword;
            case 1: return this.openParenToken;
            case 2: return this.expression;
            case 3: return this.closeParenToken;
            case 4: return this.openBraceToken;
            case 5: return this.switchClauses;
            case 6: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(switchKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  expression: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  switchClauses: ISyntaxList,
                  closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        if (this.switchKeyword === switchKeyword && this.openParenToken === openParenToken && this.expression === expression && this.closeParenToken === closeParenToken && this.openBraceToken === openBraceToken && this.switchClauses === switchClauses && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(switchKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         expression: IExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax): SwitchStatementSyntax {
        return new SwitchStatementSyntax(Syntax.token(SyntaxKind.SwitchKeyword), Syntax.token(SyntaxKind.OpenParenToken), expression, Syntax.token(SyntaxKind.CloseParenToken), Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SwitchStatementSyntax {
        return <SwitchStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SwitchStatementSyntax {
        return <SwitchStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withSwitchKeyword(switchKeyword: ISyntaxToken): SwitchStatementSyntax {
        return this.update(switchKeyword, this.openParenToken, this.expression, this.closeParenToken, this.openBraceToken, this.switchClauses, this.closeBraceToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this.switchKeyword, openParenToken, this.expression, this.closeParenToken, this.openBraceToken, this.switchClauses, this.closeBraceToken);
    }

    public withExpression(expression: IExpressionSyntax): SwitchStatementSyntax {
        return this.update(this.switchKeyword, this.openParenToken, expression, this.closeParenToken, this.openBraceToken, this.switchClauses, this.closeBraceToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this.switchKeyword, this.openParenToken, this.expression, closeParenToken, this.openBraceToken, this.switchClauses, this.closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this.switchKeyword, this.openParenToken, this.expression, this.closeParenToken, openBraceToken, this.switchClauses, this.closeBraceToken);
    }

    public withSwitchClauses(switchClauses: ISyntaxList): SwitchStatementSyntax {
        return this.update(this.switchKeyword, this.openParenToken, this.expression, this.closeParenToken, this.openBraceToken, switchClauses, this.closeBraceToken);
    }

    public withSwitchClause(switchClause: SwitchClauseSyntax): SwitchStatementSyntax {
        return this.withSwitchClauses(Syntax.list([switchClause]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this.switchKeyword, this.openParenToken, this.expression, this.closeParenToken, this.openBraceToken, this.switchClauses, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        if (this.switchClauses.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class SwitchClauseSyntax extends SyntaxNode implements ISwitchClauseSyntax {
    constructor(public colonToken: ISyntaxToken,
                public statements: ISyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    private isSwitchClause(): bool {
        return true;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SwitchClauseSyntax {
        return <SwitchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SwitchClauseSyntax {
        return <SwitchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class CaseSwitchClauseSyntax extends SwitchClauseSyntax {

    constructor(public caseKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                colonToken: ISyntaxToken,
                statements: ISyntaxList,
                parsedInStrictMode: bool) {
        super(colonToken, statements, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCaseSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CaseSwitchClause;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.caseKeyword;
            case 1: return this.expression;
            case 2: return this.colonToken;
            case 3: return this.statements;
            default: throw Errors.invalidOperation();
        }
    }

    public update(caseKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  colonToken: ISyntaxToken,
                  statements: ISyntaxList): CaseSwitchClauseSyntax {
        if (this.caseKeyword === caseKeyword && this.expression === expression && this.colonToken === colonToken && this.statements === statements) {
            return this;
        }

        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(caseKeyword: ISyntaxToken,
                         expression: IExpressionSyntax,
                         colonToken: ISyntaxToken): CaseSwitchClauseSyntax {
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax): CaseSwitchClauseSyntax {
        return new CaseSwitchClauseSyntax(Syntax.token(SyntaxKind.CaseKeyword), expression, Syntax.token(SyntaxKind.ColonToken), Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CaseSwitchClauseSyntax {
        return <CaseSwitchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CaseSwitchClauseSyntax {
        return <CaseSwitchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withCaseKeyword(caseKeyword: ISyntaxToken): CaseSwitchClauseSyntax {
        return this.update(caseKeyword, this.expression, this.colonToken, this.statements);
    }

    public withExpression(expression: IExpressionSyntax): CaseSwitchClauseSyntax {
        return this.update(this.caseKeyword, expression, this.colonToken, this.statements);
    }

    public withColonToken(colonToken: ISyntaxToken): CaseSwitchClauseSyntax {
        return this.update(this.caseKeyword, this.expression, colonToken, this.statements);
    }

    public withStatements(statements: ISyntaxList): CaseSwitchClauseSyntax {
        return this.update(this.caseKeyword, this.expression, this.colonToken, statements);
    }

    public withStatement(statement: IStatementSyntax): CaseSwitchClauseSyntax {
        return this.withStatements(Syntax.list([statement]));
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        if (this.statements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DefaultSwitchClauseSyntax extends SwitchClauseSyntax {

    constructor(public defaultKeyword: ISyntaxToken,
                colonToken: ISyntaxToken,
                statements: ISyntaxList,
                parsedInStrictMode: bool) {
        super(colonToken, statements, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDefaultSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DefaultSwitchClause;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.defaultKeyword;
            case 1: return this.colonToken;
            case 2: return this.statements;
            default: throw Errors.invalidOperation();
        }
    }

    public update(defaultKeyword: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  statements: ISyntaxList): DefaultSwitchClauseSyntax {
        if (this.defaultKeyword === defaultKeyword && this.colonToken === colonToken && this.statements === statements) {
            return this;
        }

        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(defaultKeyword: ISyntaxToken,
                         colonToken: ISyntaxToken): DefaultSwitchClauseSyntax {
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public static create1(): DefaultSwitchClauseSyntax {
        return new DefaultSwitchClauseSyntax(Syntax.token(SyntaxKind.DefaultKeyword), Syntax.token(SyntaxKind.ColonToken), Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DefaultSwitchClauseSyntax {
        return <DefaultSwitchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DefaultSwitchClauseSyntax {
        return <DefaultSwitchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withDefaultKeyword(defaultKeyword: ISyntaxToken): DefaultSwitchClauseSyntax {
        return this.update(defaultKeyword, this.colonToken, this.statements);
    }

    public withColonToken(colonToken: ISyntaxToken): DefaultSwitchClauseSyntax {
        return this.update(this.defaultKeyword, colonToken, this.statements);
    }

    public withStatements(statements: ISyntaxList): DefaultSwitchClauseSyntax {
        return this.update(this.defaultKeyword, this.colonToken, statements);
    }

    public withStatement(statement: IStatementSyntax): DefaultSwitchClauseSyntax {
        return this.withStatements(Syntax.list([statement]));
    }

    public isTypeScriptSpecific(): bool {
        if (this.statements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class BreakStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public breakKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBreakStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.BreakStatement;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.breakKeyword;
            case 1: return this.identifier;
            case 2: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(breakKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  semicolonToken: ISyntaxToken): BreakStatementSyntax {
        if (this.breakKeyword === breakKeyword && this.identifier === identifier && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(breakKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): BreakStatementSyntax {
        return new BreakStatementSyntax(breakKeyword, null, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): BreakStatementSyntax {
        return new BreakStatementSyntax(Syntax.token(SyntaxKind.BreakKeyword), null, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BreakStatementSyntax {
        return <BreakStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BreakStatementSyntax {
        return <BreakStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withBreakKeyword(breakKeyword: ISyntaxToken): BreakStatementSyntax {
        return this.update(breakKeyword, this.identifier, this.semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): BreakStatementSyntax {
        return this.update(this.breakKeyword, identifier, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): BreakStatementSyntax {
        return this.update(this.breakKeyword, this.identifier, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class ContinueStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public continueKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitContinueStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ContinueStatement;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.continueKeyword;
            case 1: return this.identifier;
            case 2: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(continueKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        if (this.continueKeyword === continueKeyword && this.identifier === identifier && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(continueKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        return new ContinueStatementSyntax(continueKeyword, null, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ContinueStatementSyntax {
        return new ContinueStatementSyntax(Syntax.token(SyntaxKind.ContinueKeyword), null, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ContinueStatementSyntax {
        return <ContinueStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ContinueStatementSyntax {
        return <ContinueStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withContinueKeyword(continueKeyword: ISyntaxToken): ContinueStatementSyntax {
        return this.update(continueKeyword, this.identifier, this.semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ContinueStatementSyntax {
        return this.update(this.continueKeyword, identifier, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        return this.update(this.continueKeyword, this.identifier, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class IterationStatementSyntax extends SyntaxNode implements IStatementSyntax {
    constructor(public openParenToken: ISyntaxToken,
                public closeParenToken: ISyntaxToken,
                public statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IterationStatementSyntax {
        return <IterationStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IterationStatementSyntax {
        return <IterationStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class BaseForStatementSyntax extends IterationStatementSyntax {
    constructor(public forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                public variableDeclaration: VariableDeclarationSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(openParenToken, closeParenToken, statement, parsedInStrictMode); 
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BaseForStatementSyntax {
        return <BaseForStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BaseForStatementSyntax {
        return <BaseForStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class ForStatementSyntax extends BaseForStatementSyntax {

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                public initializer: IExpressionSyntax,
                public firstSemicolonToken: ISyntaxToken,
                public condition: IExpressionSyntax,
                public secondSemicolonToken: ISyntaxToken,
                public incrementor: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitForStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForStatement;
    }

    public childCount(): number {
        return 10;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.forKeyword;
            case 1: return this.openParenToken;
            case 2: return this.variableDeclaration;
            case 3: return this.initializer;
            case 4: return this.firstSemicolonToken;
            case 5: return this.condition;
            case 6: return this.secondSemicolonToken;
            case 7: return this.incrementor;
            case 8: return this.closeParenToken;
            case 9: return this.statement;
            default: throw Errors.invalidOperation();
        }
    }

    public update(forKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  initializer: IExpressionSyntax,
                  firstSemicolonToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  secondSemicolonToken: ISyntaxToken,
                  incrementor: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): ForStatementSyntax {
        if (this.forKeyword === forKeyword && this.openParenToken === openParenToken && this.variableDeclaration === variableDeclaration && this.initializer === initializer && this.firstSemicolonToken === firstSemicolonToken && this.condition === condition && this.secondSemicolonToken === secondSemicolonToken && this.incrementor === incrementor && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }

        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(forKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         firstSemicolonToken: ISyntaxToken,
                         secondSemicolonToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken,
                         statement: IStatementSyntax): ForStatementSyntax {
        return new ForStatementSyntax(forKeyword, openParenToken, null, null, firstSemicolonToken, null, secondSemicolonToken, null, closeParenToken, statement, /*parsedInStrictMode:*/ false);
    }

    public static create1(statement: IStatementSyntax): ForStatementSyntax {
        return new ForStatementSyntax(Syntax.token(SyntaxKind.ForKeyword), Syntax.token(SyntaxKind.OpenParenToken), null, null, Syntax.token(SyntaxKind.SemicolonToken), null, Syntax.token(SyntaxKind.SemicolonToken), null, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ForStatementSyntax {
        return <ForStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ForStatementSyntax {
        return <ForStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withForKeyword(forKeyword: ISyntaxToken): ForStatementSyntax {
        return this.update(forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this.forKeyword, openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withInitializer(initializer: IExpressionSyntax): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withFirstSemicolonToken(firstSemicolonToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withCondition(condition: IExpressionSyntax): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withSecondSemicolonToken(secondSemicolonToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, secondSemicolonToken, this.incrementor, this.closeParenToken, this.statement);
    }

    public withIncrementor(incrementor: IExpressionSyntax): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, incrementor, this.closeParenToken, this.statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, closeParenToken, this.statement);
    }

    public withStatement(statement: IStatementSyntax): ForStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.initializer, this.firstSemicolonToken, this.condition, this.secondSemicolonToken, this.incrementor, this.closeParenToken, statement);
    }

    public isTypeScriptSpecific(): bool {
        if (this.variableDeclaration !== null && this.variableDeclaration.isTypeScriptSpecific()) { return true; }
        if (this.initializer !== null && this.initializer.isTypeScriptSpecific()) { return true; }
        if (this.condition !== null && this.condition.isTypeScriptSpecific()) { return true; }
        if (this.incrementor !== null && this.incrementor.isTypeScriptSpecific()) { return true; }
        if (this.statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ForInStatementSyntax extends BaseForStatementSyntax {

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                public left: IExpressionSyntax,
                public inKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitForInStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForInStatement;
    }

    public childCount(): number {
        return 8;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.forKeyword;
            case 1: return this.openParenToken;
            case 2: return this.variableDeclaration;
            case 3: return this.left;
            case 4: return this.inKeyword;
            case 5: return this.expression;
            case 6: return this.closeParenToken;
            case 7: return this.statement;
            default: throw Errors.invalidOperation();
        }
    }

    public update(forKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  left: IExpressionSyntax,
                  inKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): ForInStatementSyntax {
        if (this.forKeyword === forKeyword && this.openParenToken === openParenToken && this.variableDeclaration === variableDeclaration && this.left === left && this.inKeyword === inKeyword && this.expression === expression && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }

        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(forKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         inKeyword: ISyntaxToken,
                         expression: IExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         statement: IStatementSyntax): ForInStatementSyntax {
        return new ForInStatementSyntax(forKeyword, openParenToken, null, null, inKeyword, expression, closeParenToken, statement, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax,
                          statement: IStatementSyntax): ForInStatementSyntax {
        return new ForInStatementSyntax(Syntax.token(SyntaxKind.ForKeyword), Syntax.token(SyntaxKind.OpenParenToken), null, null, Syntax.token(SyntaxKind.InKeyword), expression, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ForInStatementSyntax {
        return <ForInStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ForInStatementSyntax {
        return <ForInStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withForKeyword(forKeyword: ISyntaxToken): ForInStatementSyntax {
        return this.update(forKeyword, this.openParenToken, this.variableDeclaration, this.left, this.inKeyword, this.expression, this.closeParenToken, this.statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ForInStatementSyntax {
        return this.update(this.forKeyword, openParenToken, this.variableDeclaration, this.left, this.inKeyword, this.expression, this.closeParenToken, this.statement);
    }

    public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForInStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, variableDeclaration, this.left, this.inKeyword, this.expression, this.closeParenToken, this.statement);
    }

    public withLeft(left: IExpressionSyntax): ForInStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, left, this.inKeyword, this.expression, this.closeParenToken, this.statement);
    }

    public withInKeyword(inKeyword: ISyntaxToken): ForInStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.left, inKeyword, this.expression, this.closeParenToken, this.statement);
    }

    public withExpression(expression: IExpressionSyntax): ForInStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.left, this.inKeyword, expression, this.closeParenToken, this.statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ForInStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.left, this.inKeyword, this.expression, closeParenToken, this.statement);
    }

    public withStatement(statement: IStatementSyntax): ForInStatementSyntax {
        return this.update(this.forKeyword, this.openParenToken, this.variableDeclaration, this.left, this.inKeyword, this.expression, this.closeParenToken, statement);
    }

    public isTypeScriptSpecific(): bool {
        if (this.variableDeclaration !== null && this.variableDeclaration.isTypeScriptSpecific()) { return true; }
        if (this.left !== null && this.left.isTypeScriptSpecific()) { return true; }
        if (this.expression.isTypeScriptSpecific()) { return true; }
        if (this.statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class WhileStatementSyntax extends IterationStatementSyntax {

    constructor(public whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                public condition: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(openParenToken, closeParenToken, statement, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitWhileStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WhileStatement;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.whileKeyword;
            case 1: return this.openParenToken;
            case 2: return this.condition;
            case 3: return this.closeParenToken;
            case 4: return this.statement;
            default: throw Errors.invalidOperation();
        }
    }

    public update(whileKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): WhileStatementSyntax {
        if (this.whileKeyword === whileKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }

        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(condition: IExpressionSyntax,
                          statement: IStatementSyntax): WhileStatementSyntax {
        return new WhileStatementSyntax(Syntax.token(SyntaxKind.WhileKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): WhileStatementSyntax {
        return <WhileStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): WhileStatementSyntax {
        return <WhileStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withWhileKeyword(whileKeyword: ISyntaxToken): WhileStatementSyntax {
        return this.update(whileKeyword, this.openParenToken, this.condition, this.closeParenToken, this.statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): WhileStatementSyntax {
        return this.update(this.whileKeyword, openParenToken, this.condition, this.closeParenToken, this.statement);
    }

    public withCondition(condition: IExpressionSyntax): WhileStatementSyntax {
        return this.update(this.whileKeyword, this.openParenToken, condition, this.closeParenToken, this.statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): WhileStatementSyntax {
        return this.update(this.whileKeyword, this.openParenToken, this.condition, closeParenToken, this.statement);
    }

    public withStatement(statement: IStatementSyntax): WhileStatementSyntax {
        return this.update(this.whileKeyword, this.openParenToken, this.condition, this.closeParenToken, statement);
    }

    public isTypeScriptSpecific(): bool {
        if (this.condition.isTypeScriptSpecific()) { return true; }
        if (this.statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class WithStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public withKeyword: ISyntaxToken,
                public openParenToken: ISyntaxToken,
                public condition: IExpressionSyntax,
                public closeParenToken: ISyntaxToken,
                public statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitWithStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WithStatement;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.withKeyword;
            case 1: return this.openParenToken;
            case 2: return this.condition;
            case 3: return this.closeParenToken;
            case 4: return this.statement;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(withKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): WithStatementSyntax {
        if (this.withKeyword === withKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }

        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(condition: IExpressionSyntax,
                          statement: IStatementSyntax): WithStatementSyntax {
        return new WithStatementSyntax(Syntax.token(SyntaxKind.WithKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): WithStatementSyntax {
        return <WithStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): WithStatementSyntax {
        return <WithStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withWithKeyword(withKeyword: ISyntaxToken): WithStatementSyntax {
        return this.update(withKeyword, this.openParenToken, this.condition, this.closeParenToken, this.statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): WithStatementSyntax {
        return this.update(this.withKeyword, openParenToken, this.condition, this.closeParenToken, this.statement);
    }

    public withCondition(condition: IExpressionSyntax): WithStatementSyntax {
        return this.update(this.withKeyword, this.openParenToken, condition, this.closeParenToken, this.statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): WithStatementSyntax {
        return this.update(this.withKeyword, this.openParenToken, this.condition, closeParenToken, this.statement);
    }

    public withStatement(statement: IStatementSyntax): WithStatementSyntax {
        return this.update(this.withKeyword, this.openParenToken, this.condition, this.closeParenToken, statement);
    }

    public isTypeScriptSpecific(): bool {
        if (this.condition.isTypeScriptSpecific()) { return true; }
        if (this.statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class EnumDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {

    constructor(public exportKeyword: ISyntaxToken,
                public enumKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public openBraceToken: ISyntaxToken,
                public enumElements: ISeparatedSyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEnumDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EnumDeclaration;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.exportKeyword;
            case 1: return this.enumKeyword;
            case 2: return this.identifier;
            case 3: return this.openBraceToken;
            case 4: return this.enumElements;
            case 5: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(exportKeyword: ISyntaxToken,
                  enumKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  enumElements: ISeparatedSyntaxList,
                  closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        if (this.exportKeyword === exportKeyword && this.enumKeyword === enumKeyword && this.identifier === identifier && this.openBraceToken === openBraceToken && this.enumElements === enumElements && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, enumElements, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(enumKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return new EnumDeclarationSyntax(null, enumKeyword, identifier, openBraceToken, Syntax.emptySeparatedList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): EnumDeclarationSyntax {
        return new EnumDeclarationSyntax(null, Syntax.token(SyntaxKind.EnumKeyword), identifier, Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): EnumDeclarationSyntax {
        return <EnumDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): EnumDeclarationSyntax {
        return <EnumDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(exportKeyword, this.enumKeyword, this.identifier, this.openBraceToken, this.enumElements, this.closeBraceToken);
    }

    public withEnumKeyword(enumKeyword: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this.exportKeyword, enumKeyword, this.identifier, this.openBraceToken, this.enumElements, this.closeBraceToken);
    }

    public withIdentifier(identifier: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this.exportKeyword, this.enumKeyword, identifier, this.openBraceToken, this.enumElements, this.closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this.exportKeyword, this.enumKeyword, this.identifier, openBraceToken, this.enumElements, this.closeBraceToken);
    }

    public withEnumElements(enumElements: ISeparatedSyntaxList): EnumDeclarationSyntax {
        return this.update(this.exportKeyword, this.enumKeyword, this.identifier, this.openBraceToken, enumElements, this.closeBraceToken);
    }

    public withEnumElement(enumElement: IEnumElementSyntax): EnumDeclarationSyntax {
        return this.withEnumElements(Syntax.separatedList([enumElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this.exportKeyword, this.enumKeyword, this.identifier, this.openBraceToken, this.enumElements, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class EnumElementSyntax extends SyntaxNode implements IEnumElementSyntax {

    constructor(public identifier: ISyntaxToken,
                public stringLiteral: ISyntaxToken,
                public colonValueClause: ColonValueClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEnumElement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EnumElement;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.stringLiteral;
            case 2: return this.colonValueClause;
            default: throw Errors.invalidOperation();
        }
    }

    private isEnumElement(): bool {
        return true;
    }

    public update(identifier: ISyntaxToken,
                  stringLiteral: ISyntaxToken,
                  colonValueClause: ColonValueClauseSyntax): EnumElementSyntax {
        if (this.identifier === identifier && this.stringLiteral === stringLiteral && this.colonValueClause === colonValueClause) {
            return this;
        }

        return new EnumElementSyntax(identifier, stringLiteral, colonValueClause, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(): EnumElementSyntax {
        return new EnumElementSyntax(null, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): EnumElementSyntax {
        return new EnumElementSyntax(null, null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): EnumElementSyntax {
        return <EnumElementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): EnumElementSyntax {
        return <EnumElementSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): EnumElementSyntax {
        return this.update(identifier, this.stringLiteral, this.colonValueClause);
    }

    public withStringLiteral(stringLiteral: ISyntaxToken): EnumElementSyntax {
        return this.update(this.identifier, stringLiteral, this.colonValueClause);
    }

    public withColonValueClause(colonValueClause: ColonValueClauseSyntax): EnumElementSyntax {
        return this.update(this.identifier, this.stringLiteral, colonValueClause);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class CastExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public lessThanToken: ISyntaxToken,
                public type: ITypeSyntax,
                public greaterThanToken: ISyntaxToken,
                public expression: IUnaryExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCastExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CastExpression;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.lessThanToken;
            case 1: return this.type;
            case 2: return this.greaterThanToken;
            case 3: return this.expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(lessThanToken: ISyntaxToken,
                  type: ITypeSyntax,
                  greaterThanToken: ISyntaxToken,
                  expression: IUnaryExpressionSyntax): CastExpressionSyntax {
        if (this.lessThanToken === lessThanToken && this.type === type && this.greaterThanToken === greaterThanToken && this.expression === expression) {
            return this;
        }

        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(type: ITypeSyntax,
                          expression: IUnaryExpressionSyntax): CastExpressionSyntax {
        return new CastExpressionSyntax(Syntax.token(SyntaxKind.LessThanToken), type, Syntax.token(SyntaxKind.GreaterThanToken), expression, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CastExpressionSyntax {
        return <CastExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CastExpressionSyntax {
        return <CastExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withLessThanToken(lessThanToken: ISyntaxToken): CastExpressionSyntax {
        return this.update(lessThanToken, this.type, this.greaterThanToken, this.expression);
    }

    public withType(type: ITypeSyntax): CastExpressionSyntax {
        return this.update(this.lessThanToken, type, this.greaterThanToken, this.expression);
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): CastExpressionSyntax {
        return this.update(this.lessThanToken, this.type, greaterThanToken, this.expression);
    }

    public withExpression(expression: IUnaryExpressionSyntax): CastExpressionSyntax {
        return this.update(this.lessThanToken, this.type, this.greaterThanToken, expression);
    }

    public isTypeScriptSpecific(): bool {
        return true;
    }
}

class ObjectLiteralExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public openBraceToken: ISyntaxToken,
                public propertyAssignments: ISeparatedSyntaxList,
                public closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectLiteralExpression;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.openBraceToken;
            case 1: return this.propertyAssignments;
            case 2: return this.closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(openBraceToken: ISyntaxToken,
                  propertyAssignments: ISeparatedSyntaxList,
                  closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        if (this.openBraceToken === openBraceToken && this.propertyAssignments === propertyAssignments && this.closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return new ObjectLiteralExpressionSyntax(openBraceToken, Syntax.emptySeparatedList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ObjectLiteralExpressionSyntax {
        return new ObjectLiteralExpressionSyntax(Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectLiteralExpressionSyntax {
        return <ObjectLiteralExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectLiteralExpressionSyntax {
        return <ObjectLiteralExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(openBraceToken, this.propertyAssignments, this.closeBraceToken);
    }

    public withPropertyAssignments(propertyAssignments: ISeparatedSyntaxList): ObjectLiteralExpressionSyntax {
        return this.update(this.openBraceToken, propertyAssignments, this.closeBraceToken);
    }

    public withPropertyAssignment(propertyAssignment: PropertyAssignmentSyntax): ObjectLiteralExpressionSyntax {
        return this.withPropertyAssignments(Syntax.separatedList([propertyAssignment]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(this.openBraceToken, this.propertyAssignments, closeBraceToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.propertyAssignments.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class PropertyAssignmentSyntax extends SyntaxNode {
    constructor(public propertyName: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PropertyAssignmentSyntax {
        return <PropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PropertyAssignmentSyntax {
        return <PropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class SimplePropertyAssignmentSyntax extends PropertyAssignmentSyntax {

    constructor(propertyName: ISyntaxToken,
                public colonToken: ISyntaxToken,
                public expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(propertyName, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSimplePropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimplePropertyAssignment;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.propertyName;
            case 1: return this.colonToken;
            case 2: return this.expression;
            default: throw Errors.invalidOperation();
        }
    }

    public update(propertyName: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
        if (this.propertyName === propertyName && this.colonToken === colonToken && this.expression === expression) {
            return this;
        }

        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(propertyName: ISyntaxToken,
                          expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
        return new SimplePropertyAssignmentSyntax(propertyName, Syntax.token(SyntaxKind.ColonToken), expression, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SimplePropertyAssignmentSyntax {
        return <SimplePropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SimplePropertyAssignmentSyntax {
        return <SimplePropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withPropertyName(propertyName: ISyntaxToken): SimplePropertyAssignmentSyntax {
        return this.update(propertyName, this.colonToken, this.expression);
    }

    public withColonToken(colonToken: ISyntaxToken): SimplePropertyAssignmentSyntax {
        return this.update(this.propertyName, colonToken, this.expression);
    }

    public withExpression(expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
        return this.update(this.propertyName, this.colonToken, expression);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    constructor(propertyName: ISyntaxToken,
                public openParenToken: ISyntaxToken,
                public closeParenToken: ISyntaxToken,
                public block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(propertyName, parsedInStrictMode); 
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): AccessorPropertyAssignmentSyntax {
        return <AccessorPropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): AccessorPropertyAssignmentSyntax {
        return <AccessorPropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class GetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {

    constructor(public getKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(propertyName, openParenToken, closeParenToken, block, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetAccessorPropertyAssignment;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.getKeyword;
            case 1: return this.propertyName;
            case 2: return this.openParenToken;
            case 3: return this.closeParenToken;
            case 4: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    public update(getKeyword: ISyntaxToken,
                  propertyName: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  closeParenToken: ISyntaxToken,
                  block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
        if (this.getKeyword === getKeyword && this.propertyName === propertyName && this.openParenToken === openParenToken && this.closeParenToken === closeParenToken && this.block === block) {
            return this;
        }

        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(propertyName: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return new GetAccessorPropertyAssignmentSyntax(Syntax.token(SyntaxKind.GetKeyword), propertyName, Syntax.token(SyntaxKind.OpenParenToken), Syntax.token(SyntaxKind.CloseParenToken), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): GetAccessorPropertyAssignmentSyntax {
        return <GetAccessorPropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): GetAccessorPropertyAssignmentSyntax {
        return <GetAccessorPropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withGetKeyword(getKeyword: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(getKeyword, this.propertyName, this.openParenToken, this.closeParenToken, this.block);
    }

    public withPropertyName(propertyName: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(this.getKeyword, propertyName, this.openParenToken, this.closeParenToken, this.block);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(this.getKeyword, this.propertyName, openParenToken, this.closeParenToken, this.block);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(this.getKeyword, this.propertyName, this.openParenToken, closeParenToken, this.block);
    }

    public withBlock(block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
        return this.update(this.getKeyword, this.propertyName, this.openParenToken, this.closeParenToken, block);
    }

    public isTypeScriptSpecific(): bool {
        if (this.block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class SetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {

    constructor(public setKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                public parameterName: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(propertyName, openParenToken, closeParenToken, block, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetAccessorPropertyAssignment;
    }

    public childCount(): number {
        return 6;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.setKeyword;
            case 1: return this.propertyName;
            case 2: return this.openParenToken;
            case 3: return this.parameterName;
            case 4: return this.closeParenToken;
            case 5: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    public update(setKeyword: ISyntaxToken,
                  propertyName: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  parameterName: ISyntaxToken,
                  closeParenToken: ISyntaxToken,
                  block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
        if (this.setKeyword === setKeyword && this.propertyName === propertyName && this.openParenToken === openParenToken && this.parameterName === parameterName && this.closeParenToken === closeParenToken && this.block === block) {
            return this;
        }

        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(propertyName: ISyntaxToken,
                          parameterName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return new SetAccessorPropertyAssignmentSyntax(Syntax.token(SyntaxKind.SetKeyword), propertyName, Syntax.token(SyntaxKind.OpenParenToken), parameterName, Syntax.token(SyntaxKind.CloseParenToken), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SetAccessorPropertyAssignmentSyntax {
        return <SetAccessorPropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SetAccessorPropertyAssignmentSyntax {
        return <SetAccessorPropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withSetKeyword(setKeyword: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(setKeyword, this.propertyName, this.openParenToken, this.parameterName, this.closeParenToken, this.block);
    }

    public withPropertyName(propertyName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this.setKeyword, propertyName, this.openParenToken, this.parameterName, this.closeParenToken, this.block);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this.setKeyword, this.propertyName, openParenToken, this.parameterName, this.closeParenToken, this.block);
    }

    public withParameterName(parameterName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this.setKeyword, this.propertyName, this.openParenToken, parameterName, this.closeParenToken, this.block);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this.setKeyword, this.propertyName, this.openParenToken, this.parameterName, closeParenToken, this.block);
    }

    public withBlock(block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
        return this.update(this.setKeyword, this.propertyName, this.openParenToken, this.parameterName, this.closeParenToken, block);
    }

    public isTypeScriptSpecific(): bool {
        if (this.block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class FunctionExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public functionKeyword: ISyntaxToken,
                public identifier: ISyntaxToken,
                public callSignature: CallSignatureSyntax,
                public block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionExpression;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.functionKeyword;
            case 1: return this.identifier;
            case 2: return this.callSignature;
            case 3: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(functionKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  callSignature: CallSignatureSyntax,
                  block: BlockSyntax): FunctionExpressionSyntax {
        if (this.functionKeyword === functionKeyword && this.identifier === identifier && this.callSignature === callSignature && this.block === block) {
            return this;
        }

        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(functionKeyword: ISyntaxToken,
                         callSignature: CallSignatureSyntax,
                         block: BlockSyntax): FunctionExpressionSyntax {
        return new FunctionExpressionSyntax(functionKeyword, null, callSignature, block, /*parsedInStrictMode:*/ false);
    }

    public static create1(): FunctionExpressionSyntax {
        return new FunctionExpressionSyntax(Syntax.token(SyntaxKind.FunctionKeyword), null, CallSignatureSyntax.create1(), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionExpressionSyntax {
        return <FunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionExpressionSyntax {
        return <FunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withFunctionKeyword(functionKeyword: ISyntaxToken): FunctionExpressionSyntax {
        return this.update(functionKeyword, this.identifier, this.callSignature, this.block);
    }

    public withIdentifier(identifier: ISyntaxToken): FunctionExpressionSyntax {
        return this.update(this.functionKeyword, identifier, this.callSignature, this.block);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): FunctionExpressionSyntax {
        return this.update(this.functionKeyword, this.identifier, callSignature, this.block);
    }

    public withBlock(block: BlockSyntax): FunctionExpressionSyntax {
        return this.update(this.functionKeyword, this.identifier, this.callSignature, block);
    }

    public isTypeScriptSpecific(): bool {
        if (this.callSignature.isTypeScriptSpecific()) { return true; }
        if (this.block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class EmptyStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEmptyStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EmptyStatement;
    }

    public childCount(): number {
        return 1;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
        if (this.semicolonToken === semicolonToken) {
            return this;
        }

        return new EmptyStatementSyntax(semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(): EmptyStatementSyntax {
        return new EmptyStatementSyntax(Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): EmptyStatementSyntax {
        return <EmptyStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): EmptyStatementSyntax {
        return <EmptyStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
        return this.update(semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}

class TryStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public tryKeyword: ISyntaxToken,
                public block: BlockSyntax,
                public catchClause: CatchClauseSyntax,
                public finallyClause: FinallyClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTryStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TryStatement;
    }

    public childCount(): number {
        return 4;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.tryKeyword;
            case 1: return this.block;
            case 2: return this.catchClause;
            case 3: return this.finallyClause;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(tryKeyword: ISyntaxToken,
                  block: BlockSyntax,
                  catchClause: CatchClauseSyntax,
                  finallyClause: FinallyClauseSyntax): TryStatementSyntax {
        if (this.tryKeyword === tryKeyword && this.block === block && this.catchClause === catchClause && this.finallyClause === finallyClause) {
            return this;
        }

        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create(tryKeyword: ISyntaxToken,
                         block: BlockSyntax): TryStatementSyntax {
        return new TryStatementSyntax(tryKeyword, block, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): TryStatementSyntax {
        return new TryStatementSyntax(Syntax.token(SyntaxKind.TryKeyword), BlockSyntax.create1(), null, null, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TryStatementSyntax {
        return <TryStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TryStatementSyntax {
        return <TryStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withTryKeyword(tryKeyword: ISyntaxToken): TryStatementSyntax {
        return this.update(tryKeyword, this.block, this.catchClause, this.finallyClause);
    }

    public withBlock(block: BlockSyntax): TryStatementSyntax {
        return this.update(this.tryKeyword, block, this.catchClause, this.finallyClause);
    }

    public withCatchClause(catchClause: CatchClauseSyntax): TryStatementSyntax {
        return this.update(this.tryKeyword, this.block, catchClause, this.finallyClause);
    }

    public withFinallyClause(finallyClause: FinallyClauseSyntax): TryStatementSyntax {
        return this.update(this.tryKeyword, this.block, this.catchClause, finallyClause);
    }

    public isTypeScriptSpecific(): bool {
        if (this.block.isTypeScriptSpecific()) { return true; }
        if (this.catchClause !== null && this.catchClause.isTypeScriptSpecific()) { return true; }
        if (this.finallyClause !== null && this.finallyClause.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class CatchClauseSyntax extends SyntaxNode {

    constructor(public catchKeyword: ISyntaxToken,
                public openParenToken: ISyntaxToken,
                public identifier: ISyntaxToken,
                public closeParenToken: ISyntaxToken,
                public block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCatchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CatchClause;
    }

    public childCount(): number {
        return 5;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.catchKeyword;
            case 1: return this.openParenToken;
            case 2: return this.identifier;
            case 3: return this.closeParenToken;
            case 4: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    public update(catchKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  identifier: ISyntaxToken,
                  closeParenToken: ISyntaxToken,
                  block: BlockSyntax): CatchClauseSyntax {
        if (this.catchKeyword === catchKeyword && this.openParenToken === openParenToken && this.identifier === identifier && this.closeParenToken === closeParenToken && this.block === block) {
            return this;
        }

        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(identifier: ISyntaxToken): CatchClauseSyntax {
        return new CatchClauseSyntax(Syntax.token(SyntaxKind.CatchKeyword), Syntax.token(SyntaxKind.OpenParenToken), identifier, Syntax.token(SyntaxKind.CloseParenToken), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CatchClauseSyntax {
        return <CatchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CatchClauseSyntax {
        return <CatchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withCatchKeyword(catchKeyword: ISyntaxToken): CatchClauseSyntax {
        return this.update(catchKeyword, this.openParenToken, this.identifier, this.closeParenToken, this.block);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): CatchClauseSyntax {
        return this.update(this.catchKeyword, openParenToken, this.identifier, this.closeParenToken, this.block);
    }

    public withIdentifier(identifier: ISyntaxToken): CatchClauseSyntax {
        return this.update(this.catchKeyword, this.openParenToken, identifier, this.closeParenToken, this.block);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): CatchClauseSyntax {
        return this.update(this.catchKeyword, this.openParenToken, this.identifier, closeParenToken, this.block);
    }

    public withBlock(block: BlockSyntax): CatchClauseSyntax {
        return this.update(this.catchKeyword, this.openParenToken, this.identifier, this.closeParenToken, block);
    }

    public isTypeScriptSpecific(): bool {
        if (this.block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class FinallyClauseSyntax extends SyntaxNode {

    constructor(public finallyKeyword: ISyntaxToken,
                public block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFinallyClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FinallyClause;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.finallyKeyword;
            case 1: return this.block;
            default: throw Errors.invalidOperation();
        }
    }

    public update(finallyKeyword: ISyntaxToken,
                  block: BlockSyntax): FinallyClauseSyntax {
        if (this.finallyKeyword === finallyKeyword && this.block === block) {
            return this;
        }

        return new FinallyClauseSyntax(finallyKeyword, block, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(): FinallyClauseSyntax {
        return new FinallyClauseSyntax(Syntax.token(SyntaxKind.FinallyKeyword), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FinallyClauseSyntax {
        return <FinallyClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FinallyClauseSyntax {
        return <FinallyClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withFinallyKeyword(finallyKeyword: ISyntaxToken): FinallyClauseSyntax {
        return this.update(finallyKeyword, this.block);
    }

    public withBlock(block: BlockSyntax): FinallyClauseSyntax {
        return this.update(this.finallyKeyword, block);
    }

    public isTypeScriptSpecific(): bool {
        if (this.block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class LabeledStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public identifier: ISyntaxToken,
                public colonToken: ISyntaxToken,
                public statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitLabeledStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.LabeledStatement;
    }

    public childCount(): number {
        return 3;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.identifier;
            case 1: return this.colonToken;
            case 2: return this.statement;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(identifier: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  statement: IStatementSyntax): LabeledStatementSyntax {
        if (this.identifier === identifier && this.colonToken === colonToken && this.statement === statement) {
            return this;
        }

        return new LabeledStatementSyntax(identifier, colonToken, statement, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(identifier: ISyntaxToken,
                          statement: IStatementSyntax): LabeledStatementSyntax {
        return new LabeledStatementSyntax(identifier, Syntax.token(SyntaxKind.ColonToken), statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): LabeledStatementSyntax {
        return <LabeledStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): LabeledStatementSyntax {
        return <LabeledStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): LabeledStatementSyntax {
        return this.update(identifier, this.colonToken, this.statement);
    }

    public withColonToken(colonToken: ISyntaxToken): LabeledStatementSyntax {
        return this.update(this.identifier, colonToken, this.statement);
    }

    public withStatement(statement: IStatementSyntax): LabeledStatementSyntax {
        return this.update(this.identifier, this.colonToken, statement);
    }

    public isTypeScriptSpecific(): bool {
        if (this.statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DoStatementSyntax extends IterationStatementSyntax {

    constructor(public doKeyword: ISyntaxToken,
                statement: IStatementSyntax,
                public whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                public condition: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(openParenToken, closeParenToken, statement, parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDoStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DoStatement;
    }

    public childCount(): number {
        return 7;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.doKeyword;
            case 1: return this.statement;
            case 2: return this.whileKeyword;
            case 3: return this.openParenToken;
            case 4: return this.condition;
            case 5: return this.closeParenToken;
            case 6: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    public update(doKeyword: ISyntaxToken,
                  statement: IStatementSyntax,
                  whileKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  semicolonToken: ISyntaxToken): DoStatementSyntax {
        if (this.doKeyword === doKeyword && this.statement === statement && this.whileKeyword === whileKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(statement: IStatementSyntax,
                          condition: IExpressionSyntax): DoStatementSyntax {
        return new DoStatementSyntax(Syntax.token(SyntaxKind.DoKeyword), statement, Syntax.token(SyntaxKind.WhileKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DoStatementSyntax {
        return <DoStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DoStatementSyntax {
        return <DoStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withDoKeyword(doKeyword: ISyntaxToken): DoStatementSyntax {
        return this.update(doKeyword, this.statement, this.whileKeyword, this.openParenToken, this.condition, this.closeParenToken, this.semicolonToken);
    }

    public withStatement(statement: IStatementSyntax): DoStatementSyntax {
        return this.update(this.doKeyword, statement, this.whileKeyword, this.openParenToken, this.condition, this.closeParenToken, this.semicolonToken);
    }

    public withWhileKeyword(whileKeyword: ISyntaxToken): DoStatementSyntax {
        return this.update(this.doKeyword, this.statement, whileKeyword, this.openParenToken, this.condition, this.closeParenToken, this.semicolonToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this.doKeyword, this.statement, this.whileKeyword, openParenToken, this.condition, this.closeParenToken, this.semicolonToken);
    }

    public withCondition(condition: IExpressionSyntax): DoStatementSyntax {
        return this.update(this.doKeyword, this.statement, this.whileKeyword, this.openParenToken, condition, this.closeParenToken, this.semicolonToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this.doKeyword, this.statement, this.whileKeyword, this.openParenToken, this.condition, closeParenToken, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this.doKeyword, this.statement, this.whileKeyword, this.openParenToken, this.condition, this.closeParenToken, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        if (this.statement.isTypeScriptSpecific()) { return true; }
        if (this.condition.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class TypeOfExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public typeOfKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeOfExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeOfExpression;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.typeOfKeyword;
            case 1: return this.expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(typeOfKeyword: ISyntaxToken,
                  expression: IExpressionSyntax): TypeOfExpressionSyntax {
        if (this.typeOfKeyword === typeOfKeyword && this.expression === expression) {
            return this;
        }

        return new TypeOfExpressionSyntax(typeOfKeyword, expression, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): TypeOfExpressionSyntax {
        return new TypeOfExpressionSyntax(Syntax.token(SyntaxKind.TypeOfKeyword), expression, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeOfExpressionSyntax {
        return <TypeOfExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeOfExpressionSyntax {
        return <TypeOfExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeOfKeyword(typeOfKeyword: ISyntaxToken): TypeOfExpressionSyntax {
        return this.update(typeOfKeyword, this.expression);
    }

    public withExpression(expression: IExpressionSyntax): TypeOfExpressionSyntax {
        return this.update(this.typeOfKeyword, expression);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DeleteExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public deleteKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDeleteExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DeleteExpression;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.deleteKeyword;
            case 1: return this.expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(deleteKeyword: ISyntaxToken,
                  expression: IExpressionSyntax): DeleteExpressionSyntax {
        if (this.deleteKeyword === deleteKeyword && this.expression === expression) {
            return this;
        }

        return new DeleteExpressionSyntax(deleteKeyword, expression, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): DeleteExpressionSyntax {
        return new DeleteExpressionSyntax(Syntax.token(SyntaxKind.DeleteKeyword), expression, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DeleteExpressionSyntax {
        return <DeleteExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DeleteExpressionSyntax {
        return <DeleteExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withDeleteKeyword(deleteKeyword: ISyntaxToken): DeleteExpressionSyntax {
        return this.update(deleteKeyword, this.expression);
    }

    public withExpression(expression: IExpressionSyntax): DeleteExpressionSyntax {
        return this.update(this.deleteKeyword, expression);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VoidExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {

    constructor(public voidKeyword: ISyntaxToken,
                public expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVoidExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VoidExpression;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.voidKeyword;
            case 1: return this.expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public update(voidKeyword: ISyntaxToken,
                  expression: IExpressionSyntax): VoidExpressionSyntax {
        if (this.voidKeyword === voidKeyword && this.expression === expression) {
            return this;
        }

        return new VoidExpressionSyntax(voidKeyword, expression, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(expression: IExpressionSyntax): VoidExpressionSyntax {
        return new VoidExpressionSyntax(Syntax.token(SyntaxKind.VoidKeyword), expression, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VoidExpressionSyntax {
        return <VoidExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VoidExpressionSyntax {
        return <VoidExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withVoidKeyword(voidKeyword: ISyntaxToken): VoidExpressionSyntax {
        return this.update(voidKeyword, this.expression);
    }

    public withExpression(expression: IExpressionSyntax): VoidExpressionSyntax {
        return this.update(this.voidKeyword, expression);
    }

    public isTypeScriptSpecific(): bool {
        if (this.expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DebuggerStatementSyntax extends SyntaxNode implements IStatementSyntax {

    constructor(public debuggerKeyword: ISyntaxToken,
                public semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode); 

    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDebuggerStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DebuggerStatement;
    }

    public childCount(): number {
        return 2;
    }

    public childAt(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this.debuggerKeyword;
            case 1: return this.semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public update(debuggerKeyword: ISyntaxToken,
                  semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
        if (this.debuggerKeyword === debuggerKeyword && this.semicolonToken === semicolonToken) {
            return this;
        }

        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, /*parsedInStrictMode:*/ this.parsedInStrictMode());
    }

    public static create1(): DebuggerStatementSyntax {
        return new DebuggerStatementSyntax(Syntax.token(SyntaxKind.DebuggerKeyword), Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DebuggerStatementSyntax {
        return <DebuggerStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DebuggerStatementSyntax {
        return <DebuggerStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withDebuggerKeyword(debuggerKeyword: ISyntaxToken): DebuggerStatementSyntax {
        return this.update(debuggerKeyword, this.semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
        return this.update(this.debuggerKeyword, semicolonToken);
    }

    public isTypeScriptSpecific(): bool {
        return false;
    }
}