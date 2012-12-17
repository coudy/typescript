///<reference path='SyntaxNode.ts' />
///<reference path='ISyntaxList.ts' />
///<reference path='ISeparatedSyntaxList.ts' />
///<reference path='SeparatedSyntaxList.ts' />
///<reference path='SyntaxList.ts' />

class SourceUnitSyntax extends SyntaxNode {
    private _moduleElements: ISyntaxList;
    private _endOfFileToken: ISyntaxToken;

    constructor(moduleElements: ISyntaxList,
                endOfFileToken: ISyntaxToken) {
        super();

        if (moduleElements === null) { throw Errors.argumentNull('moduleElements'); }
        if (endOfFileToken.kind() !== SyntaxKind.EndOfFileToken) { throw Errors.argument('endOfFileToken'); }

        this._moduleElements = moduleElements;
        this._endOfFileToken = endOfFileToken;
    }

    public static create(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return new SourceUnitSyntax(SyntaxList.empty, endOfFileToken);
    }

    public static create1(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return new SourceUnitSyntax(
            SyntaxList.empty,
            endOfFileToken);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSourceUnit(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SourceUnit;
    }

    public isMissing(): bool {
        if (!this._moduleElements.isMissing()) { return false; }
        if (!this._endOfFileToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._moduleElements.firstToken()) !== null) { return token; }
        return this._endOfFileToken;
    }

    public lastToken(): ISyntaxToken {
        return this._endOfFileToken;
    }

    public moduleElements(): ISyntaxList {
        return this._moduleElements;
    }

    public endOfFileToken(): ISyntaxToken {
        return this._endOfFileToken;
    }

    public update(moduleElements: ISyntaxList,
                  endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        if (this._moduleElements === moduleElements && this._endOfFileToken === endOfFileToken) {
            return this;
        }

        return new SourceUnitSyntax(moduleElements, endOfFileToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SourceUnitSyntax {
        return <SourceUnitSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SourceUnitSyntax {
        return <SourceUnitSyntax>super.withTrailingTrivia(trivia);
    }

    public withModuleElements(moduleElements: ISyntaxList): SourceUnitSyntax {
        return this.update(moduleElements, this._endOfFileToken);
    }

    public withModuleElement(moduleElement: ModuleElementSyntax): SourceUnitSyntax {
        return this.withModuleElements(SyntaxList.create([moduleElement]));
    }

    public withEndOfFileToken(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return this.update(this._moduleElements, endOfFileToken);
    }

    private collectTextElements(elements: string[]): void {
        this._moduleElements.collectTextElements(elements);
        this._endOfFileToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._moduleElements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ModuleElementSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleElementSyntax {
        return <ModuleElementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleElementSyntax {
        return <ModuleElementSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class ModuleReferenceSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleReferenceSyntax {
        return <ModuleReferenceSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleReferenceSyntax {
        return <ModuleReferenceSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ExternalModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _stringLiteral: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;

    constructor(moduleKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                stringLiteral: ISyntaxToken,
                closeParenToken: ISyntaxToken) {
        super();

        if (moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) { throw Errors.argument('moduleKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (stringLiteral.kind() !== SyntaxKind.StringLiteral) { throw Errors.argument('stringLiteral'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
    }

    public static create1(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax {
        return new ExternalModuleReferenceSyntax(
            SyntaxToken.create(SyntaxKind.ModuleKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            stringLiteral,
            SyntaxToken.create(SyntaxKind.CloseParenToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExternalModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExternalModuleReference;
    }

    public isMissing(): bool {
        if (!this._moduleKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._stringLiteral.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._moduleKeyword.width() > 0) { return this._moduleKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._stringLiteral.width() > 0) { return this._stringLiteral; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._stringLiteral.width() > 0) { return this._stringLiteral; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._moduleKeyword.width() > 0) { return this._moduleKeyword; }
        return null;
    }

    public moduleKeyword(): ISyntaxToken {
        return this._moduleKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public stringLiteral(): ISyntaxToken {
        return this._stringLiteral;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public update(moduleKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  stringLiteral: ISyntaxToken,
                  closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
        if (this._moduleKeyword === moduleKeyword && this._openParenToken === openParenToken && this._stringLiteral === stringLiteral && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExternalModuleReferenceSyntax {
        return <ExternalModuleReferenceSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExternalModuleReferenceSyntax {
        return <ExternalModuleReferenceSyntax>super.withTrailingTrivia(trivia);
    }

    public withModuleKeyword(moduleKeyword: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(moduleKeyword, this._openParenToken, this._stringLiteral, this._closeParenToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(this._moduleKeyword, openParenToken, this._stringLiteral, this._closeParenToken);
    }

    public withStringLiteral(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(this._moduleKeyword, this._openParenToken, stringLiteral, this._closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax {
        return this.update(this._moduleKeyword, this._openParenToken, this._stringLiteral, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        this._moduleKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._stringLiteral.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ModuleNameModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleName: NameSyntax;

    constructor(moduleName: NameSyntax) {
        super();

        if (moduleName === null) { throw Errors.argumentNull('moduleName'); }

        this._moduleName = moduleName;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitModuleNameModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleNameModuleReference;
    }

    public isMissing(): bool {
        if (!this._moduleName.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._moduleName.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._moduleName.lastToken()) !== null) { return token; }
        return null;
    }

    public moduleName(): NameSyntax {
        return this._moduleName;
    }

    private update(moduleName: NameSyntax): ModuleNameModuleReferenceSyntax {
        if (this._moduleName === moduleName) {
            return this;
        }

        return new ModuleNameModuleReferenceSyntax(moduleName);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleNameModuleReferenceSyntax {
        return <ModuleNameModuleReferenceSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleNameModuleReferenceSyntax {
        return <ModuleNameModuleReferenceSyntax>super.withTrailingTrivia(trivia);
    }

    public withModuleName(moduleName: NameSyntax): ModuleNameModuleReferenceSyntax {
        return this.update(moduleName);
    }

    private collectTextElements(elements: string[]): void {
        this._moduleName.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ImportDeclarationSyntax extends ModuleElementSyntax {
    private _importKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _equalsToken: ISyntaxToken;
    private _moduleReference: ModuleReferenceSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(importKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                equalsToken: ISyntaxToken,
                moduleReference: ModuleReferenceSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (moduleReference === null) { throw Errors.argumentNull('moduleReference'); }
        if (importKeyword.keywordKind() !== SyntaxKind.ImportKeyword) { throw Errors.argument('importKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (equalsToken.kind() !== SyntaxKind.EqualsToken) { throw Errors.argument('equalsToken'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }

    public static create1(identifier: ISyntaxToken,
                          moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax {
        return new ImportDeclarationSyntax(
            SyntaxToken.create(SyntaxKind.ImportKeyword),
            identifier,
            SyntaxToken.create(SyntaxKind.EqualsToken),
            moduleReference,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitImportDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImportDeclaration;
    }

    public isMissing(): bool {
        if (!this._importKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (!this._equalsToken.isMissing()) { return false; }
        if (!this._moduleReference.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._importKeyword.width() > 0) { return this._importKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._equalsToken.width() > 0) { return this._equalsToken; }
        if ((token = this._moduleReference.firstToken()) !== null) { return token; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if ((token = this._moduleReference.lastToken()) !== null) { return token; }
        if (this._equalsToken.width() > 0) { return this._equalsToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._importKeyword.width() > 0) { return this._importKeyword; }
        return null;
    }

    public importKeyword(): ISyntaxToken {
        return this._importKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public equalsToken(): ISyntaxToken {
        return this._equalsToken;
    }

    public moduleReference(): ModuleReferenceSyntax {
        return this._moduleReference;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(importKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  equalsToken: ISyntaxToken,
                  moduleReference: ModuleReferenceSyntax,
                  semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
        if (this._importKeyword === importKeyword && this._identifier === identifier && this._equalsToken === equalsToken && this._moduleReference === moduleReference && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ImportDeclarationSyntax {
        return <ImportDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ImportDeclarationSyntax {
        return <ImportDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withImportKeyword(importKeyword: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(importKeyword, this._identifier, this._equalsToken, this._moduleReference, this._semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(this._importKeyword, identifier, this._equalsToken, this._moduleReference, this._semicolonToken);
    }

    public withEqualsToken(equalsToken: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(this._importKeyword, this._identifier, equalsToken, this._moduleReference, this._semicolonToken);
    }

    public withModuleReference(moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax {
        return this.update(this._importKeyword, this._identifier, this._equalsToken, moduleReference, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ImportDeclarationSyntax {
        return this.update(this._importKeyword, this._identifier, this._equalsToken, this._moduleReference, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._importKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._equalsToken.collectTextElements(elements);
        this._moduleReference.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ClassDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _classKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _extendsClause: ExtendsClauseSyntax;
    private _implementsClause: ImplementsClauseSyntax;
    private _openBraceToken: ISyntaxToken;
    private _classElements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                classKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                extendsClause: ExtendsClauseSyntax,
                implementsClause: ImplementsClauseSyntax,
                openBraceToken: ISyntaxToken,
                classElements: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (classElements === null) { throw Errors.argumentNull('classElements'); }
        if (exportKeyword !== null) {
            if (exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        }
        if (declareKeyword !== null) {
            if (declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        }
        if (classKeyword.keywordKind() !== SyntaxKind.ClassKeyword) { throw Errors.argument('classKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._classKeyword = classKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._implementsClause = implementsClause;
        this._openBraceToken = openBraceToken;
        this._classElements = classElements;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(classKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return new ClassDeclarationSyntax(null, null, classKeyword, identifier, null, null, openBraceToken, SyntaxList.empty, closeBraceToken);
    }

    public static create1(identifier: ISyntaxToken): ClassDeclarationSyntax {
        return new ClassDeclarationSyntax(
            null,
            null,
            SyntaxToken.create(SyntaxKind.ClassKeyword),
            identifier,
            null,
            null,
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitClassDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ClassDeclaration;
    }

    public isMissing(): bool {
        if (this._exportKeyword !== null && !this._exportKeyword.isMissing()) { return false; }
        if (this._declareKeyword !== null && !this._declareKeyword.isMissing()) { return false; }
        if (!this._classKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (this._extendsClause !== null && !this._extendsClause.isMissing()) { return false; }
        if (this._implementsClause !== null && !this._implementsClause.isMissing()) { return false; }
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._classElements.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._classKeyword.width() > 0) { return this._classKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._extendsClause !== null && (token = this._extendsClause.firstToken()) !== null) { return token; }
        if (this._implementsClause !== null && (token = this._implementsClause.firstToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._classElements.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._classElements.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if (this._implementsClause !== null && (token = this._implementsClause.lastToken()) !== null) { return token; }
        if (this._extendsClause !== null && (token = this._extendsClause.lastToken()) !== null) { return token; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._classKeyword.width() > 0) { return this._classKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        return null;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public classKeyword(): ISyntaxToken {
        return this._classKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public extendsClause(): ExtendsClauseSyntax {
        return this._extendsClause;
    }

    public implementsClause(): ImplementsClauseSyntax {
        return this._implementsClause;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public classElements(): ISyntaxList {
        return this._classElements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  classKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  extendsClause: ExtendsClauseSyntax,
                  implementsClause: ImplementsClauseSyntax,
                  openBraceToken: ISyntaxToken,
                  classElements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._classKeyword === classKeyword && this._identifier === identifier && this._extendsClause === extendsClause && this._implementsClause === implementsClause && this._openBraceToken === openBraceToken && this._classElements === classElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax {
        return <ClassDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax {
        return <ClassDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, declareKeyword, this._classKeyword, this._identifier, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withClassKeyword(classKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, classKeyword, this._identifier, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, identifier, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withExtendsClause(extendsClause: ExtendsClauseSyntax): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withImplementsClause(implementsClause: ImplementsClauseSyntax): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._extendsClause, implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._extendsClause, this._implementsClause, openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withClassElements(classElements: ISyntaxList): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._extendsClause, this._implementsClause, this._openBraceToken, classElements, this._closeBraceToken);
    }

    public withClassElement(classElement: ClassElementSyntax): ClassDeclarationSyntax {
        return this.withClassElements(SyntaxList.create([classElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._classKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        if (this._extendsClause !== null) { this._extendsClause.collectTextElements(elements); }
        if (this._implementsClause !== null) { this._implementsClause.collectTextElements(elements); }
        this._openBraceToken.collectTextElements(elements);
        this._classElements.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class InterfaceDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _interfaceKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _extendsClause: ExtendsClauseSyntax;
    private _body: ObjectTypeSyntax;

    constructor(exportKeyword: ISyntaxToken,
                interfaceKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                extendsClause: ExtendsClauseSyntax,
                body: ObjectTypeSyntax) {
        super();

        if (body === null) { throw Errors.argumentNull('body'); }
        if (exportKeyword !== null) {
            if (exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        }
        if (interfaceKeyword.keywordKind() !== SyntaxKind.InterfaceKeyword) { throw Errors.argument('interfaceKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._body = body;
    }

    public static create(interfaceKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        return new InterfaceDeclarationSyntax(null, interfaceKeyword, identifier, null, body);
    }

    public static create1(identifier: ISyntaxToken): InterfaceDeclarationSyntax {
        return new InterfaceDeclarationSyntax(
            null,
            SyntaxToken.create(SyntaxKind.InterfaceKeyword),
            identifier,
            null,
            ObjectTypeSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitInterfaceDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InterfaceDeclaration;
    }

    public isMissing(): bool {
        if (this._exportKeyword !== null && !this._exportKeyword.isMissing()) { return false; }
        if (!this._interfaceKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (this._extendsClause !== null && !this._extendsClause.isMissing()) { return false; }
        if (!this._body.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        if (this._interfaceKeyword.width() > 0) { return this._interfaceKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._extendsClause !== null && (token = this._extendsClause.firstToken()) !== null) { return token; }
        if ((token = this._body.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._body.lastToken()) !== null) { return token; }
        if (this._extendsClause !== null && (token = this._extendsClause.lastToken()) !== null) { return token; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._interfaceKeyword.width() > 0) { return this._interfaceKeyword; }
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        return null;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public interfaceKeyword(): ISyntaxToken {
        return this._interfaceKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public extendsClause(): ExtendsClauseSyntax {
        return this._extendsClause;
    }

    public body(): ObjectTypeSyntax {
        return this._body;
    }

    public update(exportKeyword: ISyntaxToken,
                  interfaceKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  extendsClause: ExtendsClauseSyntax,
                  body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._interfaceKeyword === interfaceKeyword && this._identifier === identifier && this._extendsClause === extendsClause && this._body === body) {
            return this;
        }

        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax {
        return <InterfaceDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax {
        return <InterfaceDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(exportKeyword, this._interfaceKeyword, this._identifier, this._extendsClause, this._body);
    }

    public withInterfaceKeyword(interfaceKeyword: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, interfaceKeyword, this._identifier, this._extendsClause, this._body);
    }

    public withIdentifier(identifier: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, identifier, this._extendsClause, this._body);
    }

    public withExtendsClause(extendsClause: ExtendsClauseSyntax): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, this._identifier, extendsClause, this._body);
    }

    public withBody(body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, this._identifier, this._extendsClause, body);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        this._interfaceKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        if (this._extendsClause !== null) { this._extendsClause.collectTextElements(elements); }
        this._body.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ExtendsClauseSyntax extends SyntaxNode {
    private _extendsKeyword: ISyntaxToken;
    private _typeNames: ISeparatedSyntaxList;

    constructor(extendsKeyword: ISyntaxToken,
                typeNames: ISeparatedSyntaxList) {
        super();

        if (typeNames === null) { throw Errors.argumentNull('typeNames'); }
        if (extendsKeyword.keywordKind() !== SyntaxKind.ExtendsKeyword) { throw Errors.argument('extendsKeyword'); }

        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
    }

    public static create1(typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        return new ExtendsClauseSyntax(
            SyntaxToken.create(SyntaxKind.ExtendsKeyword),
            typeNames);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExtendsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExtendsClause;
    }

    public isMissing(): bool {
        if (!this._extendsKeyword.isMissing()) { return false; }
        if (!this._typeNames.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._extendsKeyword.width() > 0) { return this._extendsKeyword; }
        if ((token = this._typeNames.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._typeNames.lastToken()) !== null) { return token; }
        if (this._extendsKeyword.width() > 0) { return this._extendsKeyword; }
        return null;
    }

    public extendsKeyword(): ISyntaxToken {
        return this._extendsKeyword;
    }

    public typeNames(): ISeparatedSyntaxList {
        return this._typeNames;
    }

    public update(extendsKeyword: ISyntaxToken,
                  typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        if (this._extendsKeyword === extendsKeyword && this._typeNames === typeNames) {
            return this;
        }

        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExtendsClauseSyntax {
        return <ExtendsClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExtendsClauseSyntax {
        return <ExtendsClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withExtendsKeyword(extendsKeyword: ISyntaxToken): ExtendsClauseSyntax {
        return this.update(extendsKeyword, this._typeNames);
    }

    public withTypeNames(typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        return this.update(this._extendsKeyword, typeNames);
    }

    public withTypeName(typeName: NameSyntax): ExtendsClauseSyntax {
        return this.withTypeNames(SeparatedSyntaxList.create([typeName]));
    }

    private collectTextElements(elements: string[]): void {
        this._extendsKeyword.collectTextElements(elements);
        this._typeNames.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ImplementsClauseSyntax extends SyntaxNode {
    private _implementsKeyword: ISyntaxToken;
    private _typeNames: ISeparatedSyntaxList;

    constructor(implementsKeyword: ISyntaxToken,
                typeNames: ISeparatedSyntaxList) {
        super();

        if (typeNames === null) { throw Errors.argumentNull('typeNames'); }
        if (implementsKeyword.keywordKind() !== SyntaxKind.ImplementsKeyword) { throw Errors.argument('implementsKeyword'); }

        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
    }

    public static create1(typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        return new ImplementsClauseSyntax(
            SyntaxToken.create(SyntaxKind.ImplementsKeyword),
            typeNames);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitImplementsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImplementsClause;
    }

    public isMissing(): bool {
        if (!this._implementsKeyword.isMissing()) { return false; }
        if (!this._typeNames.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._implementsKeyword.width() > 0) { return this._implementsKeyword; }
        if ((token = this._typeNames.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._typeNames.lastToken()) !== null) { return token; }
        if (this._implementsKeyword.width() > 0) { return this._implementsKeyword; }
        return null;
    }

    public implementsKeyword(): ISyntaxToken {
        return this._implementsKeyword;
    }

    public typeNames(): ISeparatedSyntaxList {
        return this._typeNames;
    }

    public update(implementsKeyword: ISyntaxToken,
                  typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        if (this._implementsKeyword === implementsKeyword && this._typeNames === typeNames) {
            return this;
        }

        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ImplementsClauseSyntax {
        return <ImplementsClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ImplementsClauseSyntax {
        return <ImplementsClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withImplementsKeyword(implementsKeyword: ISyntaxToken): ImplementsClauseSyntax {
        return this.update(implementsKeyword, this._typeNames);
    }

    public withTypeNames(typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        return this.update(this._implementsKeyword, typeNames);
    }

    public withTypeName(typeName: NameSyntax): ImplementsClauseSyntax {
        return this.withTypeNames(SeparatedSyntaxList.create([typeName]));
    }

    private collectTextElements(elements: string[]): void {
        this._implementsKeyword.collectTextElements(elements);
        this._typeNames.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ModuleDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _moduleKeyword: ISyntaxToken;
    private _moduleName: NameSyntax;
    private _stringLiteral: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _moduleElements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                moduleKeyword: ISyntaxToken,
                moduleName: NameSyntax,
                stringLiteral: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                moduleElements: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (moduleElements === null) { throw Errors.argumentNull('moduleElements'); }
        if (exportKeyword !== null) {
            if (exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        }
        if (declareKeyword !== null) {
            if (declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        }
        if (moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) { throw Errors.argument('moduleKeyword'); }
        if (stringLiteral !== null) {
            if (stringLiteral.kind() !== SyntaxKind.StringLiteral) { throw Errors.argument('stringLiteral'); }
        }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._moduleKeyword = moduleKeyword;
        this._moduleName = moduleName;
        this._stringLiteral = stringLiteral;
        this._openBraceToken = openBraceToken;
        this._moduleElements = moduleElements;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(moduleKeyword: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return new ModuleDeclarationSyntax(null, null, moduleKeyword, null, null, openBraceToken, SyntaxList.empty, closeBraceToken);
    }

    public static create1(): ModuleDeclarationSyntax {
        return new ModuleDeclarationSyntax(
            null,
            null,
            SyntaxToken.create(SyntaxKind.ModuleKeyword),
            null,
            null,
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitModuleDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleDeclaration;
    }

    public isMissing(): bool {
        if (this._exportKeyword !== null && !this._exportKeyword.isMissing()) { return false; }
        if (this._declareKeyword !== null && !this._declareKeyword.isMissing()) { return false; }
        if (!this._moduleKeyword.isMissing()) { return false; }
        if (this._moduleName !== null && !this._moduleName.isMissing()) { return false; }
        if (this._stringLiteral !== null && !this._stringLiteral.isMissing()) { return false; }
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._moduleElements.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._moduleKeyword.width() > 0) { return this._moduleKeyword; }
        if (this._moduleName !== null && (token = this._moduleName.firstToken()) !== null) { return token; }
        if (this._stringLiteral !== null && this._stringLiteral.width() > 0) { return this._stringLiteral; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._moduleElements.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._moduleElements.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if (this._stringLiteral !== null && this._stringLiteral.width() > 0) { return this._stringLiteral; }
        if (this._moduleName !== null && (token = this._moduleName.lastToken()) !== null) { return token; }
        if (this._moduleKeyword.width() > 0) { return this._moduleKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        return null;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public moduleKeyword(): ISyntaxToken {
        return this._moduleKeyword;
    }

    public moduleName(): NameSyntax {
        return this._moduleName;
    }

    public stringLiteral(): ISyntaxToken {
        return this._stringLiteral;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public moduleElements(): ISyntaxList {
        return this._moduleElements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  moduleKeyword: ISyntaxToken,
                  moduleName: NameSyntax,
                  stringLiteral: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  moduleElements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._moduleKeyword === moduleKeyword && this._moduleName === moduleName && this._stringLiteral === stringLiteral && this._openBraceToken === openBraceToken && this._moduleElements === moduleElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleDeclarationSyntax {
        return <ModuleDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleDeclarationSyntax {
        return <ModuleDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, this._closeBraceToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, this._closeBraceToken);
    }

    public withModuleKeyword(moduleKeyword: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, this._closeBraceToken);
    }

    public withModuleName(moduleName: NameSyntax): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, this._closeBraceToken);
    }

    public withStringLiteral(stringLiteral: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, stringLiteral, this._openBraceToken, this._moduleElements, this._closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, openBraceToken, this._moduleElements, this._closeBraceToken);
    }

    public withModuleElements(moduleElements: ISyntaxList): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, moduleElements, this._closeBraceToken);
    }

    public withModuleElement(moduleElement: ModuleElementSyntax): ModuleDeclarationSyntax {
        return this.withModuleElements(SyntaxList.create([moduleElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._moduleKeyword.collectTextElements(elements);
        if (this._moduleName !== null) { this._moduleName.collectTextElements(elements); }
        if (this._stringLiteral !== null) { this._stringLiteral.collectTextElements(elements); }
        this._openBraceToken.collectTextElements(elements);
        this._moduleElements.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class StatementSyntax extends ModuleElementSyntax {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): StatementSyntax {
        return <StatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): StatementSyntax {
        return <StatementSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class FunctionDeclarationSyntax extends StatementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _functionKeyword: ISyntaxToken;
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                functionKeyword: ISyntaxToken,
                functionSignature: FunctionSignatureSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (functionSignature === null) { throw Errors.argumentNull('functionSignature'); }
        if (exportKeyword !== null) {
            if (exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        }
        if (declareKeyword !== null) {
            if (declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        }
        if (functionKeyword.keywordKind() !== SyntaxKind.FunctionKeyword) { throw Errors.argument('functionKeyword'); }
        if (semicolonToken !== null) {
            if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }
        }

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public static create(functionKeyword: ISyntaxToken,
                         functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return new FunctionDeclarationSyntax(null, null, functionKeyword, functionSignature, null, null);
    }

    public static create1(functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return new FunctionDeclarationSyntax(
            null,
            null,
            SyntaxToken.create(SyntaxKind.FunctionKeyword),
            functionSignature,
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionDeclaration;
    }

    public isMissing(): bool {
        if (this._exportKeyword !== null && !this._exportKeyword.isMissing()) { return false; }
        if (this._declareKeyword !== null && !this._declareKeyword.isMissing()) { return false; }
        if (!this._functionKeyword.isMissing()) { return false; }
        if (!this._functionSignature.isMissing()) { return false; }
        if (this._block !== null && !this._block.isMissing()) { return false; }
        if (this._semicolonToken !== null && !this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._functionKeyword.width() > 0) { return this._functionKeyword; }
        if ((token = this._functionSignature.firstToken()) !== null) { return token; }
        if (this._block !== null && (token = this._block.firstToken()) !== null) { return token; }
        if (this._semicolonToken !== null && this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken !== null && this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._block !== null && (token = this._block.lastToken()) !== null) { return token; }
        if ((token = this._functionSignature.lastToken()) !== null) { return token; }
        if (this._functionKeyword.width() > 0) { return this._functionKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        return null;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public functionKeyword(): ISyntaxToken {
        return this._functionKeyword;
    }

    public functionSignature(): FunctionSignatureSyntax {
        return this._functionSignature;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  functionKeyword: ISyntaxToken,
                  functionSignature: FunctionSignatureSyntax,
                  block: BlockSyntax,
                  semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._functionKeyword === functionKeyword && this._functionSignature === functionSignature && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionDeclarationSyntax {
        return <FunctionDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionDeclarationSyntax {
        return <FunctionDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(exportKeyword, this._declareKeyword, this._functionKeyword, this._functionSignature, this._block, this._semicolonToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(this._exportKeyword, declareKeyword, this._functionKeyword, this._functionSignature, this._block, this._semicolonToken);
    }

    public withFunctionKeyword(functionKeyword: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, functionKeyword, this._functionSignature, this._block, this._semicolonToken);
    }

    public withFunctionSignature(functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._functionKeyword, functionSignature, this._block, this._semicolonToken);
    }

    public withBlock(block: BlockSyntax): FunctionDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._functionKeyword, this._functionSignature, block, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): FunctionDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._functionKeyword, this._functionSignature, this._block, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._functionKeyword.collectTextElements(elements);
        this._functionSignature.collectTextElements(elements);
        if (this._block !== null) { this._block.collectTextElements(elements); }
        if (this._semicolonToken !== null) { this._semicolonToken.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._exportKeyword !== null) { return true; }
        if (this._declareKeyword !== null) { return true; }
        if (this._functionSignature.isTypeScriptSpecific()) { return true; }
        if (this._block !== null && this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VariableStatementSyntax extends StatementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (variableDeclaration === null) { throw Errors.argumentNull('variableDeclaration'); }
        if (exportKeyword !== null) {
            if (exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        }
        if (declareKeyword !== null) {
            if (declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }

    public static create(variableDeclaration: VariableDeclarationSyntax,
                         semicolonToken: ISyntaxToken): VariableStatementSyntax {
        return new VariableStatementSyntax(null, null, variableDeclaration, semicolonToken);
    }

    public static create1(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax {
        return new VariableStatementSyntax(
            null,
            null,
            variableDeclaration,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableStatement;
    }

    public isMissing(): bool {
        if (this._exportKeyword !== null && !this._exportKeyword.isMissing()) { return false; }
        if (this._declareKeyword !== null && !this._declareKeyword.isMissing()) { return false; }
        if (!this._variableDeclaration.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if ((token = this._variableDeclaration.firstToken()) !== null) { return token; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if ((token = this._variableDeclaration.lastToken()) !== null) { return token; }
        if (this._declareKeyword !== null && this._declareKeyword.width() > 0) { return this._declareKeyword; }
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        return null;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public declareKeyword(): ISyntaxToken {
        return this._declareKeyword;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(exportKeyword: ISyntaxToken,
                  declareKeyword: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  semicolonToken: ISyntaxToken): VariableStatementSyntax {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._variableDeclaration === variableDeclaration && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VariableStatementSyntax {
        return <VariableStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VariableStatementSyntax {
        return <VariableStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): VariableStatementSyntax {
        return this.update(exportKeyword, this._declareKeyword, this._variableDeclaration, this._semicolonToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): VariableStatementSyntax {
        return this.update(this._exportKeyword, declareKeyword, this._variableDeclaration, this._semicolonToken);
    }

    public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, variableDeclaration, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): VariableStatementSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._variableDeclaration, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._variableDeclaration.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._exportKeyword !== null) { return true; }
        if (this._declareKeyword !== null) { return true; }
        if (this._variableDeclaration.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ExpressionSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExpressionSyntax {
        return <ExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExpressionSyntax {
        return <ExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class UnaryExpressionSyntax extends ExpressionSyntax {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): UnaryExpressionSyntax {
        return <UnaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): UnaryExpressionSyntax {
        return <UnaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class VariableDeclarationSyntax extends SyntaxNode {
    private _varKeyword: ISyntaxToken;
    private _variableDeclarators: ISeparatedSyntaxList;

    constructor(varKeyword: ISyntaxToken,
                variableDeclarators: ISeparatedSyntaxList) {
        super();

        if (variableDeclarators === null) { throw Errors.argumentNull('variableDeclarators'); }
        if (varKeyword.keywordKind() !== SyntaxKind.VarKeyword) { throw Errors.argument('varKeyword'); }

        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
    }

    public static create1(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        return new VariableDeclarationSyntax(
            SyntaxToken.create(SyntaxKind.VarKeyword),
            variableDeclarators);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclaration;
    }

    public isMissing(): bool {
        if (!this._varKeyword.isMissing()) { return false; }
        if (!this._variableDeclarators.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._varKeyword.width() > 0) { return this._varKeyword; }
        if ((token = this._variableDeclarators.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._variableDeclarators.lastToken()) !== null) { return token; }
        if (this._varKeyword.width() > 0) { return this._varKeyword; }
        return null;
    }

    public varKeyword(): ISyntaxToken {
        return this._varKeyword;
    }

    public variableDeclarators(): ISeparatedSyntaxList {
        return this._variableDeclarators;
    }

    public update(varKeyword: ISyntaxToken,
                  variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        if (this._varKeyword === varKeyword && this._variableDeclarators === variableDeclarators) {
            return this;
        }

        return new VariableDeclarationSyntax(varKeyword, variableDeclarators);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VariableDeclarationSyntax {
        return <VariableDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VariableDeclarationSyntax {
        return <VariableDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withVarKeyword(varKeyword: ISyntaxToken): VariableDeclarationSyntax {
        return this.update(varKeyword, this._variableDeclarators);
    }

    public withVariableDeclarators(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        return this.update(this._varKeyword, variableDeclarators);
    }

    public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): VariableDeclarationSyntax {
        return this.withVariableDeclarators(SeparatedSyntaxList.create([variableDeclarator]));
    }

    private collectTextElements(elements: string[]): void {
        this._varKeyword.collectTextElements(elements);
        this._variableDeclarators.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._variableDeclarators.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VariableDeclaratorSyntax extends SyntaxNode {
    private _identifier: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _equalsValueClause: EqualsValueClauseSyntax;

    constructor(identifier: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax,
                equalsValueClause: EqualsValueClauseSyntax) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }

    public static create(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return new VariableDeclaratorSyntax(identifier, null, null);
    }

    public static create1(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return new VariableDeclaratorSyntax(
            identifier,
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableDeclarator(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclarator;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        if (this._equalsValueClause !== null && !this._equalsValueClause.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        if (this._equalsValueClause !== null && (token = this._equalsValueClause.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._equalsValueClause !== null && (token = this._equalsValueClause.lastToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public equalsValueClause(): EqualsValueClauseSyntax {
        return this._equalsValueClause;
    }

    public update(identifier: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax,
                  equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
        if (this._identifier === identifier && this._typeAnnotation === typeAnnotation && this._equalsValueClause === equalsValueClause) {
            return this;
        }

        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VariableDeclaratorSyntax {
        return <VariableDeclaratorSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VariableDeclaratorSyntax {
        return <VariableDeclaratorSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return this.update(identifier, this._typeAnnotation, this._equalsValueClause);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): VariableDeclaratorSyntax {
        return this.update(this._identifier, typeAnnotation, this._equalsValueClause);
    }

    public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax {
        return this.update(this._identifier, this._typeAnnotation, equalsValueClause);
    }

    private collectTextElements(elements: string[]): void {
        this._identifier.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
        if (this._equalsValueClause !== null) { this._equalsValueClause.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._typeAnnotation !== null) { return true; }
        if (this._equalsValueClause !== null && this._equalsValueClause.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class EqualsValueClauseSyntax extends SyntaxNode {
    private _equalsToken: ISyntaxToken;
    private _value: ExpressionSyntax;

    constructor(equalsToken: ISyntaxToken,
                value: ExpressionSyntax) {
        super();

        if (value === null) { throw Errors.argumentNull('value'); }
        if (equalsToken.kind() !== SyntaxKind.EqualsToken) { throw Errors.argument('equalsToken'); }

        this._equalsToken = equalsToken;
        this._value = value;
    }

    public static create1(value: ExpressionSyntax): EqualsValueClauseSyntax {
        return new EqualsValueClauseSyntax(
            SyntaxToken.create(SyntaxKind.EqualsToken),
            value);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEqualsValueClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EqualsValueClause;
    }

    public isMissing(): bool {
        if (!this._equalsToken.isMissing()) { return false; }
        if (!this._value.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._equalsToken.width() > 0) { return this._equalsToken; }
        if ((token = this._value.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._value.lastToken()) !== null) { return token; }
        if (this._equalsToken.width() > 0) { return this._equalsToken; }
        return null;
    }

    public equalsToken(): ISyntaxToken {
        return this._equalsToken;
    }

    public value(): ExpressionSyntax {
        return this._value;
    }

    public update(equalsToken: ISyntaxToken,
                  value: ExpressionSyntax): EqualsValueClauseSyntax {
        if (this._equalsToken === equalsToken && this._value === value) {
            return this;
        }

        return new EqualsValueClauseSyntax(equalsToken, value);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): EqualsValueClauseSyntax {
        return <EqualsValueClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): EqualsValueClauseSyntax {
        return <EqualsValueClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withEqualsToken(equalsToken: ISyntaxToken): EqualsValueClauseSyntax {
        return this.update(equalsToken, this._value);
    }

    public withValue(value: ExpressionSyntax): EqualsValueClauseSyntax {
        return this.update(this._equalsToken, value);
    }

    private collectTextElements(elements: string[]): void {
        this._equalsToken.collectTextElements(elements);
        this._value.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._value.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class PrefixUnaryExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _operatorToken: ISyntaxToken;
    private _operand: UnaryExpressionSyntax;

    constructor(kind: SyntaxKind,
                operatorToken: ISyntaxToken,
                operand: UnaryExpressionSyntax) {
        super();

        if (kind === null) { throw Errors.argumentNull('kind'); }
        if (operand === null) { throw Errors.argumentNull('operand'); }
        switch (operatorToken.kind()) {
            case SyntaxKind.PlusPlusToken:
            case SyntaxKind.MinusMinusToken:
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.TildeToken:
            case SyntaxKind.ExclamationToken:
                break;
            default:
                throw Errors.argument('operatorToken');
        }

        this._kind = kind;
        this._operatorToken = operatorToken;
        this._operand = operand;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPrefixUnaryExpression(this);
    }

    public isMissing(): bool {
        if (!this._operatorToken.isMissing()) { return false; }
        if (!this._operand.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._operatorToken.width() > 0) { return this._operatorToken; }
        if ((token = this._operand.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._operand.lastToken()) !== null) { return token; }
        if (this._operatorToken.width() > 0) { return this._operatorToken; }
        return null;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public operand(): UnaryExpressionSyntax {
        return this._operand;
    }

    public update(kind: SyntaxKind,
                  operatorToken: ISyntaxToken,
                  operand: UnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        if (this._kind === kind && this._operatorToken === operatorToken && this._operand === operand) {
            return this;
        }

        return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PrefixUnaryExpressionSyntax {
        return <PrefixUnaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PrefixUnaryExpressionSyntax {
        return <PrefixUnaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): PrefixUnaryExpressionSyntax {
        return this.update(kind, this._operatorToken, this._operand);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, operatorToken, this._operand);
    }

    public withOperand(operand: UnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, this._operatorToken, operand);
    }

    private collectTextElements(elements: string[]): void {
        this._operatorToken.collectTextElements(elements);
        this._operand.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._operand.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ThisExpressionSyntax extends UnaryExpressionSyntax {
    private _thisKeyword: ISyntaxToken;

    constructor(thisKeyword: ISyntaxToken) {
        super();

        if (thisKeyword.keywordKind() !== SyntaxKind.ThisKeyword) { throw Errors.argument('thisKeyword'); }

        this._thisKeyword = thisKeyword;
    }

    public static create1(): ThisExpressionSyntax {
        return new ThisExpressionSyntax(
            SyntaxToken.create(SyntaxKind.ThisKeyword));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitThisExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThisExpression;
    }

    public isMissing(): bool {
        if (!this._thisKeyword.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._thisKeyword.width() > 0) { return this._thisKeyword; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._thisKeyword.width() > 0) { return this._thisKeyword; }
        return null;
    }

    public thisKeyword(): ISyntaxToken {
        return this._thisKeyword;
    }

    private update(thisKeyword: ISyntaxToken): ThisExpressionSyntax {
        if (this._thisKeyword === thisKeyword) {
            return this;
        }

        return new ThisExpressionSyntax(thisKeyword);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ThisExpressionSyntax {
        return <ThisExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ThisExpressionSyntax {
        return <ThisExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withThisKeyword(thisKeyword: ISyntaxToken): ThisExpressionSyntax {
        return this.update(thisKeyword);
    }

    private collectTextElements(elements: string[]): void {
        this._thisKeyword.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class LiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _literalToken: ISyntaxToken;

    constructor(kind: SyntaxKind,
                literalToken: ISyntaxToken) {
        super();

        if (kind === null) { throw Errors.argumentNull('kind'); }
        switch (literalToken.kind()) {
            case SyntaxKind.RegularExpressionLiteral:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.NumericLiteral:
                break;
            case SyntaxKind.IdentifierNameToken:
                switch (literalToken.keywordKind()) {
                    case SyntaxKind.FalseKeyword:
                    case SyntaxKind.TrueKeyword:
                    case SyntaxKind.NullKeyword:
                        break;
                    default:
                        throw Errors.argument('literalToken');
                }
                break;
            default:
                throw Errors.argument('literalToken');
        }

        this._kind = kind;
        this._literalToken = literalToken;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitLiteralExpression(this);
    }

    public isMissing(): bool {
        if (!this._literalToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._literalToken.width() > 0) { return this._literalToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._literalToken.width() > 0) { return this._literalToken; }
        return null;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public literalToken(): ISyntaxToken {
        return this._literalToken;
    }

    public update(kind: SyntaxKind,
                  literalToken: ISyntaxToken): LiteralExpressionSyntax {
        if (this._kind === kind && this._literalToken === literalToken) {
            return this;
        }

        return new LiteralExpressionSyntax(kind, literalToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): LiteralExpressionSyntax {
        return <LiteralExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): LiteralExpressionSyntax {
        return <LiteralExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): LiteralExpressionSyntax {
        return this.update(kind, this._literalToken);
    }

    public withLiteralToken(literalToken: ISyntaxToken): LiteralExpressionSyntax {
        return this.update(this._kind, literalToken);
    }

    private collectTextElements(elements: string[]): void {
        this._literalToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class ArrayLiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _openBracketToken: ISyntaxToken;
    private _expressions: ISeparatedSyntaxList;
    private _closeBracketToken: ISyntaxToken;

    constructor(openBracketToken: ISyntaxToken,
                expressions: ISeparatedSyntaxList,
                closeBracketToken: ISyntaxToken) {
        super();

        if (expressions === null) { throw Errors.argumentNull('expressions'); }
        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) { throw Errors.argument('openBracketToken'); }
        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) { throw Errors.argument('closeBracketToken'); }

        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
    }

    public static create(openBracketToken: ISyntaxToken,
                         closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return new ArrayLiteralExpressionSyntax(openBracketToken, SeparatedSyntaxList.empty, closeBracketToken);
    }

    public static create1(): ArrayLiteralExpressionSyntax {
        return new ArrayLiteralExpressionSyntax(
            SyntaxToken.create(SyntaxKind.OpenBracketToken),
            SeparatedSyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBracketToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArrayLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayLiteralExpression;
    }

    public isMissing(): bool {
        if (!this._openBracketToken.isMissing()) { return false; }
        if (!this._expressions.isMissing()) { return false; }
        if (!this._closeBracketToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        if ((token = this._expressions.firstToken()) !== null) { return token; }
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        if ((token = this._expressions.lastToken()) !== null) { return token; }
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        return null;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public expressions(): ISeparatedSyntaxList {
        return this._expressions;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public update(openBracketToken: ISyntaxToken,
                  expressions: ISeparatedSyntaxList,
                  closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        if (this._openBracketToken === openBracketToken && this._expressions === expressions && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayLiteralExpressionSyntax {
        return <ArrayLiteralExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayLiteralExpressionSyntax {
        return <ArrayLiteralExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(openBracketToken, this._expressions, this._closeBracketToken);
    }

    public withExpressions(expressions: ISeparatedSyntaxList): ArrayLiteralExpressionSyntax {
        return this.update(this._openBracketToken, expressions, this._closeBracketToken);
    }

    public withExpression(expression: ExpressionSyntax): ArrayLiteralExpressionSyntax {
        return this.withExpressions(SeparatedSyntaxList.create([expression]));
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(this._openBracketToken, this._expressions, closeBracketToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openBracketToken.collectTextElements(elements);
        this._expressions.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expressions.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class OmittedExpressionSyntax extends ExpressionSyntax {
    constructor() {
        super();
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitOmittedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.OmittedExpression;
    }

    public isMissing(): bool {
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        return null;
    }

    private update(): OmittedExpressionSyntax {
        return this;
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): OmittedExpressionSyntax {
        return <OmittedExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): OmittedExpressionSyntax {
        return <OmittedExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    private collectTextElements(elements: string[]): void {
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class ParenthesizedExpressionSyntax extends UnaryExpressionSyntax {
    private _openParenToken: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
    }

    public static create1(expression: ExpressionSyntax): ParenthesizedExpressionSyntax {
        return new ParenthesizedExpressionSyntax(
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            expression,
            SyntaxToken.create(SyntaxKind.CloseParenToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParenthesizedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedExpression;
    }

    public isMissing(): bool {
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        return null;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public update(openParenToken: ISyntaxToken,
                  expression: ExpressionSyntax,
                  closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        if (this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParenthesizedExpressionSyntax {
        return <ParenthesizedExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParenthesizedExpressionSyntax {
        return <ParenthesizedExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        return this.update(openParenToken, this._expression, this._closeParenToken);
    }

    public withExpression(expression: ExpressionSyntax): ParenthesizedExpressionSyntax {
        return this.update(this._openParenToken, expression, this._closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        return this.update(this._openParenToken, this._expression, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openParenToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ArrowFunctionExpressionSyntax extends UnaryExpressionSyntax {
    constructor() {
        super();
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public body(): SyntaxNode {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrowFunctionExpressionSyntax {
        return <ArrowFunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrowFunctionExpressionSyntax {
        return <ArrowFunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class SimpleArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
    private _identifier: ISyntaxToken;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _body: SyntaxNode;

    constructor(identifier: ISyntaxToken,
                equalsGreaterThanToken: ISyntaxToken,
                body: SyntaxNode) {
        super();

        if (body === null) { throw Errors.argumentNull('body'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) { throw Errors.argument('equalsGreaterThanToken'); }

        this._identifier = identifier;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public static create1(identifier: ISyntaxToken,
                          body: SyntaxNode): SimpleArrowFunctionExpressionSyntax {
        return new SimpleArrowFunctionExpressionSyntax(
            identifier,
            SyntaxToken.create(SyntaxKind.EqualsGreaterThanToken),
            body);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSimpleArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimpleArrowFunctionExpression;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        if (!this._equalsGreaterThanToken.isMissing()) { return false; }
        if (!this._body.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._body.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._body.lastToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): SyntaxNode {
        return this._body;
    }

    public update(identifier: ISyntaxToken,
                  equalsGreaterThanToken: ISyntaxToken,
                  body: SyntaxNode): SimpleArrowFunctionExpressionSyntax {
        if (this._identifier === identifier && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }

        return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax {
        return <SimpleArrowFunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax {
        return <SimpleArrowFunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): SimpleArrowFunctionExpressionSyntax {
        return this.update(identifier, this._equalsGreaterThanToken, this._body);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): SimpleArrowFunctionExpressionSyntax {
        return this.update(this._identifier, equalsGreaterThanToken, this._body);
    }

    public withBody(body: SyntaxNode): SimpleArrowFunctionExpressionSyntax {
        return this.update(this._identifier, this._equalsGreaterThanToken, body);
    }

    private collectTextElements(elements: string[]): void {
        this._identifier.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._body.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ParenthesizedArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
    private _callSignature: CallSignatureSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _body: SyntaxNode;

    constructor(callSignature: CallSignatureSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                body: SyntaxNode) {
        super();

        if (callSignature === null) { throw Errors.argumentNull('callSignature'); }
        if (body === null) { throw Errors.argumentNull('body'); }
        if (equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) { throw Errors.argument('equalsGreaterThanToken'); }

        this._callSignature = callSignature;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public static create1(body: SyntaxNode): ParenthesizedArrowFunctionExpressionSyntax {
        return new ParenthesizedArrowFunctionExpressionSyntax(
            CallSignatureSyntax.create1(),
            SyntaxToken.create(SyntaxKind.EqualsGreaterThanToken),
            body);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParenthesizedArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedArrowFunctionExpression;
    }

    public isMissing(): bool {
        if (!this._callSignature.isMissing()) { return false; }
        if (!this._equalsGreaterThanToken.isMissing()) { return false; }
        if (!this._body.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._callSignature.firstToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._body.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._body.lastToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._callSignature.lastToken()) !== null) { return token; }
        return null;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): SyntaxNode {
        return this._body;
    }

    public update(callSignature: CallSignatureSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  body: SyntaxNode): ParenthesizedArrowFunctionExpressionSyntax {
        if (this._callSignature === callSignature && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }

        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax {
        return <ParenthesizedArrowFunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax {
        return <ParenthesizedArrowFunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(callSignature, this._equalsGreaterThanToken, this._body);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(this._callSignature, equalsGreaterThanToken, this._body);
    }

    public withBody(body: SyntaxNode): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(this._callSignature, this._equalsGreaterThanToken, body);
    }

    private collectTextElements(elements: string[]): void {
        this._callSignature.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._body.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class TypeSyntax extends UnaryExpressionSyntax {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeSyntax {
        return <TypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeSyntax {
        return <TypeSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class NameSyntax extends TypeSyntax {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): NameSyntax {
        return <NameSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): NameSyntax {
        return <NameSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class IdentifierNameSyntax extends NameSyntax {
    private _identifier: ISyntaxToken;

    constructor(identifier: ISyntaxToken) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._identifier = identifier;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIdentifierName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IdentifierName;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    private update(identifier: ISyntaxToken): IdentifierNameSyntax {
        if (this._identifier === identifier) {
            return this;
        }

        return new IdentifierNameSyntax(identifier);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IdentifierNameSyntax {
        return <IdentifierNameSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IdentifierNameSyntax {
        return <IdentifierNameSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): IdentifierNameSyntax {
        return this.update(identifier);
    }

    private collectTextElements(elements: string[]): void {
        this._identifier.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class QualifiedNameSyntax extends NameSyntax {
    private _left: NameSyntax;
    private _dotToken: ISyntaxToken;
    private _right: IdentifierNameSyntax;

    constructor(left: NameSyntax,
                dotToken: ISyntaxToken,
                right: IdentifierNameSyntax) {
        super();

        if (left === null) { throw Errors.argumentNull('left'); }
        if (right === null) { throw Errors.argumentNull('right'); }
        if (dotToken.kind() !== SyntaxKind.DotToken) { throw Errors.argument('dotToken'); }

        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
    }

    public static create1(left: NameSyntax,
                          right: IdentifierNameSyntax): QualifiedNameSyntax {
        return new QualifiedNameSyntax(
            left,
            SyntaxToken.create(SyntaxKind.DotToken),
            right);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitQualifiedName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.QualifiedName;
    }

    public isMissing(): bool {
        if (!this._left.isMissing()) { return false; }
        if (!this._dotToken.isMissing()) { return false; }
        if (!this._right.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._left.firstToken()) !== null) { return token; }
        if (this._dotToken.width() > 0) { return this._dotToken; }
        if ((token = this._right.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._right.lastToken()) !== null) { return token; }
        if (this._dotToken.width() > 0) { return this._dotToken; }
        if ((token = this._left.lastToken()) !== null) { return token; }
        return null;
    }

    public left(): NameSyntax {
        return this._left;
    }

    public dotToken(): ISyntaxToken {
        return this._dotToken;
    }

    public right(): IdentifierNameSyntax {
        return this._right;
    }

    public update(left: NameSyntax,
                  dotToken: ISyntaxToken,
                  right: IdentifierNameSyntax): QualifiedNameSyntax {
        if (this._left === left && this._dotToken === dotToken && this._right === right) {
            return this;
        }

        return new QualifiedNameSyntax(left, dotToken, right);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax {
        return <QualifiedNameSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax {
        return <QualifiedNameSyntax>super.withTrailingTrivia(trivia);
    }

    public withLeft(left: NameSyntax): QualifiedNameSyntax {
        return this.update(left, this._dotToken, this._right);
    }

    public withDotToken(dotToken: ISyntaxToken): QualifiedNameSyntax {
        return this.update(this._left, dotToken, this._right);
    }

    public withRight(right: IdentifierNameSyntax): QualifiedNameSyntax {
        return this.update(this._left, this._dotToken, right);
    }

    private collectTextElements(elements: string[]): void {
        this._left.collectTextElements(elements);
        this._dotToken.collectTextElements(elements);
        this._right.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._left.isTypeScriptSpecific()) { return true; }
        if (this._right.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ConstructorTypeSyntax extends TypeSyntax {
    private _newKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(newKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (type === null) { throw Errors.argumentNull('type'); }
        if (newKeyword.keywordKind() !== SyntaxKind.NewKeyword) { throw Errors.argument('newKeyword'); }
        if (equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) { throw Errors.argument('equalsGreaterThanToken'); }

        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }

    public static create1(type: TypeSyntax): ConstructorTypeSyntax {
        return new ConstructorTypeSyntax(
            SyntaxToken.create(SyntaxKind.NewKeyword),
            ParameterListSyntax.create1(),
            SyntaxToken.create(SyntaxKind.EqualsGreaterThanToken),
            type);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructorType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorType;
    }

    public isMissing(): bool {
        if (!this._newKeyword.isMissing()) { return false; }
        if (!this._parameterList.isMissing()) { return false; }
        if (!this._equalsGreaterThanToken.isMissing()) { return false; }
        if (!this._type.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._newKeyword.width() > 0) { return this._newKeyword; }
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._type.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._type.lastToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        if (this._newKeyword.width() > 0) { return this._newKeyword; }
        return null;
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public update(newKeyword: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  type: TypeSyntax): ConstructorTypeSyntax {
        if (this._newKeyword === newKeyword && this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }

        return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax {
        return <ConstructorTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax {
        return <ConstructorTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ConstructorTypeSyntax {
        return this.update(newKeyword, this._parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withParameterList(parameterList: ParameterListSyntax): ConstructorTypeSyntax {
        return this.update(this._newKeyword, parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ConstructorTypeSyntax {
        return this.update(this._newKeyword, this._parameterList, equalsGreaterThanToken, this._type);
    }

    public withType(type: TypeSyntax): ConstructorTypeSyntax {
        return this.update(this._newKeyword, this._parameterList, this._equalsGreaterThanToken, type);
    }

    private collectTextElements(elements: string[]): void {
        this._newKeyword.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class FunctionTypeSyntax extends TypeSyntax {
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (type === null) { throw Errors.argumentNull('type'); }
        if (equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) { throw Errors.argument('equalsGreaterThanToken'); }

        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }

    public static create1(type: TypeSyntax): FunctionTypeSyntax {
        return new FunctionTypeSyntax(
            ParameterListSyntax.create1(),
            SyntaxToken.create(SyntaxKind.EqualsGreaterThanToken),
            type);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionType;
    }

    public isMissing(): bool {
        if (!this._parameterList.isMissing()) { return false; }
        if (!this._equalsGreaterThanToken.isMissing()) { return false; }
        if (!this._type.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._type.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._type.lastToken()) !== null) { return token; }
        if (this._equalsGreaterThanToken.width() > 0) { return this._equalsGreaterThanToken; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        return null;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public update(parameterList: ParameterListSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  type: TypeSyntax): FunctionTypeSyntax {
        if (this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }

        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax {
        return <FunctionTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax {
        return <FunctionTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withParameterList(parameterList: ParameterListSyntax): FunctionTypeSyntax {
        return this.update(parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): FunctionTypeSyntax {
        return this.update(this._parameterList, equalsGreaterThanToken, this._type);
    }

    public withType(type: TypeSyntax): FunctionTypeSyntax {
        return this.update(this._parameterList, this._equalsGreaterThanToken, type);
    }

    private collectTextElements(elements: string[]): void {
        this._parameterList.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ObjectTypeSyntax extends TypeSyntax {
    private _openBraceToken: ISyntaxToken;
    private _typeMembers: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                typeMembers: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (typeMembers === null) { throw Errors.argumentNull('typeMembers'); }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return new ObjectTypeSyntax(openBraceToken, SeparatedSyntaxList.empty, closeBraceToken);
    }

    public static create1(): ObjectTypeSyntax {
        return new ObjectTypeSyntax(
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SeparatedSyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectType;
    }

    public isMissing(): bool {
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._typeMembers.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._typeMembers.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._typeMembers.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        return null;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public typeMembers(): ISeparatedSyntaxList {
        return this._typeMembers;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(openBraceToken: ISyntaxToken,
                  typeMembers: ISeparatedSyntaxList,
                  closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        if (this._openBraceToken === openBraceToken && this._typeMembers === typeMembers && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectTypeSyntax {
        return <ObjectTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectTypeSyntax {
        return <ObjectTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(openBraceToken, this._typeMembers, this._closeBraceToken);
    }

    public withTypeMembers(typeMembers: ISeparatedSyntaxList): ObjectTypeSyntax {
        return this.update(this._openBraceToken, typeMembers, this._closeBraceToken);
    }

    public withTypeMember(typeMember: TypeMemberSyntax): ObjectTypeSyntax {
        return this.withTypeMembers(SeparatedSyntaxList.create([typeMember]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(this._openBraceToken, this._typeMembers, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openBraceToken.collectTextElements(elements);
        this._typeMembers.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ArrayTypeSyntax extends TypeSyntax {
    private _type: TypeSyntax;
    private _openBracketToken: ISyntaxToken;
    private _closeBracketToken: ISyntaxToken;

    constructor(type: TypeSyntax,
                openBracketToken: ISyntaxToken,
                closeBracketToken: ISyntaxToken) {
        super();

        if (type === null) { throw Errors.argumentNull('type'); }
        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) { throw Errors.argument('openBracketToken'); }
        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) { throw Errors.argument('closeBracketToken'); }

        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
    }

    public static create1(type: TypeSyntax): ArrayTypeSyntax {
        return new ArrayTypeSyntax(
            type,
            SyntaxToken.create(SyntaxKind.OpenBracketToken),
            SyntaxToken.create(SyntaxKind.CloseBracketToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArrayType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayType;
    }

    public isMissing(): bool {
        if (!this._type.isMissing()) { return false; }
        if (!this._openBracketToken.isMissing()) { return false; }
        if (!this._closeBracketToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._type.firstToken()) !== null) { return token; }
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        if ((token = this._type.lastToken()) !== null) { return token; }
        return null;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public update(type: TypeSyntax,
                  openBracketToken: ISyntaxToken,
                  closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
        if (this._type === type && this._openBracketToken === openBracketToken && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax {
        return <ArrayTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax {
        return <ArrayTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withType(type: TypeSyntax): ArrayTypeSyntax {
        return this.update(type, this._openBracketToken, this._closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayTypeSyntax {
        return this.update(this._type, openBracketToken, this._closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
        return this.update(this._type, this._openBracketToken, closeBracketToken);
    }

    private collectTextElements(elements: string[]): void {
        this._type.collectTextElements(elements);
        this._openBracketToken.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class PredefinedTypeSyntax extends TypeSyntax {
    private _keyword: ISyntaxToken;

    constructor(keyword: ISyntaxToken) {
        super();

        switch (keyword.keywordKind()) {
            case SyntaxKind.AnyKeyword:
            case SyntaxKind.BoolKeyword:
            case SyntaxKind.NumberKeyword:
            case SyntaxKind.StringKeyword:
            case SyntaxKind.VoidKeyword:
                break;
            default:
                throw Errors.argument('keyword');
        }

        this._keyword = keyword;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPredefinedType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PredefinedType;
    }

    public isMissing(): bool {
        if (!this._keyword.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._keyword.width() > 0) { return this._keyword; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._keyword.width() > 0) { return this._keyword; }
        return null;
    }

    public keyword(): ISyntaxToken {
        return this._keyword;
    }

    private update(keyword: ISyntaxToken): PredefinedTypeSyntax {
        if (this._keyword === keyword) {
            return this;
        }

        return new PredefinedTypeSyntax(keyword);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PredefinedTypeSyntax {
        return <PredefinedTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PredefinedTypeSyntax {
        return <PredefinedTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withKeyword(keyword: ISyntaxToken): PredefinedTypeSyntax {
        return this.update(keyword);
    }

    private collectTextElements(elements: string[]): void {
        this._keyword.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class TypeAnnotationSyntax extends SyntaxNode {
    private _colonToken: ISyntaxToken;
    private _type: TypeSyntax;

    constructor(colonToken: ISyntaxToken,
                type: TypeSyntax) {
        super();

        if (type === null) { throw Errors.argumentNull('type'); }
        if (colonToken.kind() !== SyntaxKind.ColonToken) { throw Errors.argument('colonToken'); }

        this._colonToken = colonToken;
        this._type = type;
    }

    public static create1(type: TypeSyntax): TypeAnnotationSyntax {
        return new TypeAnnotationSyntax(
            SyntaxToken.create(SyntaxKind.ColonToken),
            type);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeAnnotation(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeAnnotation;
    }

    public isMissing(): bool {
        if (!this._colonToken.isMissing()) { return false; }
        if (!this._type.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._type.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._type.lastToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        return null;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public update(colonToken: ISyntaxToken,
                  type: TypeSyntax): TypeAnnotationSyntax {
        if (this._colonToken === colonToken && this._type === type) {
            return this;
        }

        return new TypeAnnotationSyntax(colonToken, type);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeAnnotationSyntax {
        return <TypeAnnotationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeAnnotationSyntax {
        return <TypeAnnotationSyntax>super.withTrailingTrivia(trivia);
    }

    public withColonToken(colonToken: ISyntaxToken): TypeAnnotationSyntax {
        return this.update(colonToken, this._type);
    }

    public withType(type: TypeSyntax): TypeAnnotationSyntax {
        return this.update(this._colonToken, type);
    }

    private collectTextElements(elements: string[]): void {
        this._colonToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class BlockSyntax extends StatementSyntax {
    private _openBraceToken: ISyntaxToken;
    private _statements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                statements: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (statements === null) { throw Errors.argumentNull('statements'); }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._openBraceToken = openBraceToken;
        this._statements = statements;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): BlockSyntax {
        return new BlockSyntax(openBraceToken, SyntaxList.empty, closeBraceToken);
    }

    public static create1(): BlockSyntax {
        return new BlockSyntax(
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBlock(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Block;
    }

    public isMissing(): bool {
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._statements.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._statements.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._statements.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        return null;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(openBraceToken: ISyntaxToken,
                  statements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): BlockSyntax {
        if (this._openBraceToken === openBraceToken && this._statements === statements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new BlockSyntax(openBraceToken, statements, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BlockSyntax {
        return <BlockSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BlockSyntax {
        return <BlockSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(openBraceToken, this._statements, this._closeBraceToken);
    }

    public withStatements(statements: ISyntaxList): BlockSyntax {
        return this.update(this._openBraceToken, statements, this._closeBraceToken);
    }

    public withStatement(statement: StatementSyntax): BlockSyntax {
        return this.withStatements(SyntaxList.create([statement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(this._openBraceToken, this._statements, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openBraceToken.collectTextElements(elements);
        this._statements.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ParameterSyntax extends SyntaxNode {
    private _dotDotDotToken: ISyntaxToken;
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _equalsValueClause: EqualsValueClauseSyntax;

    constructor(dotDotDotToken: ISyntaxToken,
                publicOrPrivateKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax,
                equalsValueClause: EqualsValueClauseSyntax) {
        super();

        if (dotDotDotToken !== null) {
            if (dotDotDotToken.kind() !== SyntaxKind.DotDotDotToken) { throw Errors.argument('dotDotDotToken'); }
        }
        if (publicOrPrivateKeyword !== null) {
            if (publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (questionToken !== null) {
            if (questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }
        }

        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }

    public static create(identifier: ISyntaxToken): ParameterSyntax {
        return new ParameterSyntax(null, null, identifier, null, null, null);
    }

    public static create1(identifier: ISyntaxToken): ParameterSyntax {
        return new ParameterSyntax(
            null,
            null,
            identifier,
            null,
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParameter(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Parameter;
    }

    public isMissing(): bool {
        if (this._dotDotDotToken !== null && !this._dotDotDotToken.isMissing()) { return false; }
        if (this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (this._questionToken !== null && !this._questionToken.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        if (this._equalsValueClause !== null && !this._equalsValueClause.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._dotDotDotToken !== null && this._dotDotDotToken.width() > 0) { return this._dotDotDotToken; }
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._questionToken !== null && this._questionToken.width() > 0) { return this._questionToken; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        if (this._equalsValueClause !== null && (token = this._equalsValueClause.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._equalsValueClause !== null && (token = this._equalsValueClause.lastToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if (this._questionToken !== null && this._questionToken.width() > 0) { return this._questionToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        if (this._dotDotDotToken !== null && this._dotDotDotToken.width() > 0) { return this._dotDotDotToken; }
        return null;
    }

    public dotDotDotToken(): ISyntaxToken {
        return this._dotDotDotToken;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public equalsValueClause(): EqualsValueClauseSyntax {
        return this._equalsValueClause;
    }

    public update(dotDotDotToken: ISyntaxToken,
                  publicOrPrivateKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax,
                  equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
        if (this._dotDotDotToken === dotDotDotToken && this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._identifier === identifier && this._questionToken === questionToken && this._typeAnnotation === typeAnnotation && this._equalsValueClause === equalsValueClause) {
            return this;
        }

        return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParameterSyntax {
        return <ParameterSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParameterSyntax {
        return <ParameterSyntax>super.withTrailingTrivia(trivia);
    }

    public withDotDotDotToken(dotDotDotToken: ISyntaxToken): ParameterSyntax {
        return this.update(dotDotDotToken, this._publicOrPrivateKeyword, this._identifier, this._questionToken, this._typeAnnotation, this._equalsValueClause);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): ParameterSyntax {
        return this.update(this._dotDotDotToken, publicOrPrivateKeyword, this._identifier, this._questionToken, this._typeAnnotation, this._equalsValueClause);
    }

    public withIdentifier(identifier: ISyntaxToken): ParameterSyntax {
        return this.update(this._dotDotDotToken, this._publicOrPrivateKeyword, identifier, this._questionToken, this._typeAnnotation, this._equalsValueClause);
    }

    public withQuestionToken(questionToken: ISyntaxToken): ParameterSyntax {
        return this.update(this._dotDotDotToken, this._publicOrPrivateKeyword, this._identifier, questionToken, this._typeAnnotation, this._equalsValueClause);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): ParameterSyntax {
        return this.update(this._dotDotDotToken, this._publicOrPrivateKeyword, this._identifier, this._questionToken, typeAnnotation, this._equalsValueClause);
    }

    public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax {
        return this.update(this._dotDotDotToken, this._publicOrPrivateKeyword, this._identifier, this._questionToken, this._typeAnnotation, equalsValueClause);
    }

    private collectTextElements(elements: string[]): void {
        if (this._dotDotDotToken !== null) { this._dotDotDotToken.collectTextElements(elements); }
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        this._identifier.collectTextElements(elements);
        if (this._questionToken !== null) { this._questionToken.collectTextElements(elements); }
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
        if (this._equalsValueClause !== null) { this._equalsValueClause.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._dotDotDotToken !== null) { return true; }
        if (this._publicOrPrivateKeyword !== null) { return true; }
        if (this._questionToken !== null) { return true; }
        if (this._typeAnnotation !== null) { return true; }
        if (this._equalsValueClause !== null) { return true; }
        return false;
    }
}

class MemberAccessExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _dotToken: ISyntaxToken;
    private _identifierName: IdentifierNameSyntax;

    constructor(expression: ExpressionSyntax,
                dotToken: ISyntaxToken,
                identifierName: IdentifierNameSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (identifierName === null) { throw Errors.argumentNull('identifierName'); }
        if (dotToken.kind() !== SyntaxKind.DotToken) { throw Errors.argument('dotToken'); }

        this._expression = expression;
        this._dotToken = dotToken;
        this._identifierName = identifierName;
    }

    public static create1(expression: ExpressionSyntax,
                          identifierName: IdentifierNameSyntax): MemberAccessExpressionSyntax {
        return new MemberAccessExpressionSyntax(
            expression,
            SyntaxToken.create(SyntaxKind.DotToken),
            identifierName);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberAccessExpression;
    }

    public isMissing(): bool {
        if (!this._expression.isMissing()) { return false; }
        if (!this._dotToken.isMissing()) { return false; }
        if (!this._identifierName.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._dotToken.width() > 0) { return this._dotToken; }
        if ((token = this._identifierName.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._identifierName.lastToken()) !== null) { return token; }
        if (this._dotToken.width() > 0) { return this._dotToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        return null;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public dotToken(): ISyntaxToken {
        return this._dotToken;
    }

    public identifierName(): IdentifierNameSyntax {
        return this._identifierName;
    }

    public update(expression: ExpressionSyntax,
                  dotToken: ISyntaxToken,
                  identifierName: IdentifierNameSyntax): MemberAccessExpressionSyntax {
        if (this._expression === expression && this._dotToken === dotToken && this._identifierName === identifierName) {
            return this;
        }

        return new MemberAccessExpressionSyntax(expression, dotToken, identifierName);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax {
        return <MemberAccessExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax {
        return <MemberAccessExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: ExpressionSyntax): MemberAccessExpressionSyntax {
        return this.update(expression, this._dotToken, this._identifierName);
    }

    public withDotToken(dotToken: ISyntaxToken): MemberAccessExpressionSyntax {
        return this.update(this._expression, dotToken, this._identifierName);
    }

    public withIdentifierName(identifierName: IdentifierNameSyntax): MemberAccessExpressionSyntax {
        return this.update(this._expression, this._dotToken, identifierName);
    }

    private collectTextElements(elements: string[]): void {
        this._expression.collectTextElements(elements);
        this._dotToken.collectTextElements(elements);
        this._identifierName.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._identifierName.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class PostfixUnaryExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _operand: ExpressionSyntax;
    private _operatorToken: ISyntaxToken;

    constructor(kind: SyntaxKind,
                operand: ExpressionSyntax,
                operatorToken: ISyntaxToken) {
        super();

        if (kind === null) { throw Errors.argumentNull('kind'); }
        if (operand === null) { throw Errors.argumentNull('operand'); }
        if (operatorToken.kind() !== SyntaxKind.PlusPlusToken && operatorToken.kind() !== SyntaxKind.MinusMinusToken) { throw Errors.argument('operatorToken'); }

        this._kind = kind;
        this._operand = operand;
        this._operatorToken = operatorToken;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPostfixUnaryExpression(this);
    }

    public isMissing(): bool {
        if (!this._operand.isMissing()) { return false; }
        if (!this._operatorToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._operand.firstToken()) !== null) { return token; }
        if (this._operatorToken.width() > 0) { return this._operatorToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._operatorToken.width() > 0) { return this._operatorToken; }
        if ((token = this._operand.lastToken()) !== null) { return token; }
        return null;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public operand(): ExpressionSyntax {
        return this._operand;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public update(kind: SyntaxKind,
                  operand: ExpressionSyntax,
                  operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        if (this._kind === kind && this._operand === operand && this._operatorToken === operatorToken) {
            return this;
        }

        return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PostfixUnaryExpressionSyntax {
        return <PostfixUnaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PostfixUnaryExpressionSyntax {
        return <PostfixUnaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): PostfixUnaryExpressionSyntax {
        return this.update(kind, this._operand, this._operatorToken);
    }

    public withOperand(operand: ExpressionSyntax): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, operand, this._operatorToken);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, this._operand, operatorToken);
    }

    private collectTextElements(elements: string[]): void {
        this._operand.collectTextElements(elements);
        this._operatorToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._operand.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ElementAccessExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _openBracketToken: ISyntaxToken;
    private _argumentExpression: ExpressionSyntax;
    private _closeBracketToken: ISyntaxToken;

    constructor(expression: ExpressionSyntax,
                openBracketToken: ISyntaxToken,
                argumentExpression: ExpressionSyntax,
                closeBracketToken: ISyntaxToken) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (argumentExpression === null) { throw Errors.argumentNull('argumentExpression'); }
        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) { throw Errors.argument('openBracketToken'); }
        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) { throw Errors.argument('closeBracketToken'); }

        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
    }

    public static create1(expression: ExpressionSyntax,
                          argumentExpression: ExpressionSyntax): ElementAccessExpressionSyntax {
        return new ElementAccessExpressionSyntax(
            expression,
            SyntaxToken.create(SyntaxKind.OpenBracketToken),
            argumentExpression,
            SyntaxToken.create(SyntaxKind.CloseBracketToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitElementAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElementAccessExpression;
    }

    public isMissing(): bool {
        if (!this._expression.isMissing()) { return false; }
        if (!this._openBracketToken.isMissing()) { return false; }
        if (!this._argumentExpression.isMissing()) { return false; }
        if (!this._closeBracketToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        if ((token = this._argumentExpression.firstToken()) !== null) { return token; }
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        if ((token = this._argumentExpression.lastToken()) !== null) { return token; }
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        return null;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public argumentExpression(): ExpressionSyntax {
        return this._argumentExpression;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public update(expression: ExpressionSyntax,
                  openBracketToken: ISyntaxToken,
                  argumentExpression: ExpressionSyntax,
                  closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        if (this._expression === expression && this._openBracketToken === openBracketToken && this._argumentExpression === argumentExpression && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax {
        return <ElementAccessExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax {
        return <ElementAccessExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: ExpressionSyntax): ElementAccessExpressionSyntax {
        return this.update(expression, this._openBracketToken, this._argumentExpression, this._closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        return this.update(this._expression, openBracketToken, this._argumentExpression, this._closeBracketToken);
    }

    public withArgumentExpression(argumentExpression: ExpressionSyntax): ElementAccessExpressionSyntax {
        return this.update(this._expression, this._openBracketToken, argumentExpression, this._closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        return this.update(this._expression, this._openBracketToken, this._argumentExpression, closeBracketToken);
    }

    private collectTextElements(elements: string[]): void {
        this._expression.collectTextElements(elements);
        this._openBracketToken.collectTextElements(elements);
        this._argumentExpression.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._argumentExpression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class InvocationExpressionSyntax extends UnaryExpressionSyntax {
    private _expression: ExpressionSyntax;
    private _argumentList: ArgumentListSyntax;

    constructor(expression: ExpressionSyntax,
                argumentList: ArgumentListSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (argumentList === null) { throw Errors.argumentNull('argumentList'); }

        this._expression = expression;
        this._argumentList = argumentList;
    }

    public static create1(expression: ExpressionSyntax): InvocationExpressionSyntax {
        return new InvocationExpressionSyntax(
            expression,
            ArgumentListSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitInvocationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InvocationExpression;
    }

    public isMissing(): bool {
        if (!this._expression.isMissing()) { return false; }
        if (!this._argumentList.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if ((token = this._argumentList.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._argumentList.lastToken()) !== null) { return token; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        return null;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }

    public update(expression: ExpressionSyntax,
                  argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        if (this._expression === expression && this._argumentList === argumentList) {
            return this;
        }

        return new InvocationExpressionSyntax(expression, argumentList);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax {
        return <InvocationExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax {
        return <InvocationExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: ExpressionSyntax): InvocationExpressionSyntax {
        return this.update(expression, this._argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        return this.update(this._expression, argumentList);
    }

    private collectTextElements(elements: string[]): void {
        this._expression.collectTextElements(elements);
        this._argumentList.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._argumentList.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ArgumentListSyntax extends SyntaxNode {
    private _openParenToken: ISyntaxToken;
    private _arguments: ISeparatedSyntaxList;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                arguments: ISeparatedSyntaxList,
                closeParenToken: ISyntaxToken) {
        super();

        if (arguments === null) { throw Errors.argumentNull('arguments'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
    }

    public static create(openParenToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return new ArgumentListSyntax(openParenToken, SeparatedSyntaxList.empty, closeParenToken);
    }

    public static create1(): ArgumentListSyntax {
        return new ArgumentListSyntax(
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            SeparatedSyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseParenToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArgumentList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArgumentList;
    }

    public isMissing(): bool {
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._arguments.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._arguments.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._arguments.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        return null;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public arguments(): ISeparatedSyntaxList {
        return this._arguments;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public update(openParenToken: ISyntaxToken,
                  _arguments: ISeparatedSyntaxList,
                  closeParenToken: ISyntaxToken): ArgumentListSyntax {
        if (this._openParenToken === openParenToken && this._arguments === _arguments && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ArgumentListSyntax(openParenToken, _arguments, closeParenToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax {
        return <ArgumentListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax {
        return <ArgumentListSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(openParenToken, this._arguments, this._closeParenToken);
    }

    public withArguments(_arguments: ISeparatedSyntaxList): ArgumentListSyntax {
        return this.update(this._openParenToken, _arguments, this._closeParenToken);
    }

    public withArgument(_argument: ExpressionSyntax): ArgumentListSyntax {
        return this.withArguments(SeparatedSyntaxList.create([_argument]));
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(this._openParenToken, this._arguments, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openParenToken.collectTextElements(elements);
        this._arguments.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._arguments.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class BinaryExpressionSyntax extends ExpressionSyntax {
    private _kind: SyntaxKind;
    private _left: ExpressionSyntax;
    private _operatorToken: ISyntaxToken;
    private _right: ExpressionSyntax;

    constructor(kind: SyntaxKind,
                left: ExpressionSyntax,
                operatorToken: ISyntaxToken,
                right: ExpressionSyntax) {
        super();

        if (kind === null) { throw Errors.argumentNull('kind'); }
        if (left === null) { throw Errors.argumentNull('left'); }
        if (right === null) { throw Errors.argumentNull('right'); }
        switch (operatorToken.kind()) {
            case SyntaxKind.AsteriskToken:
            case SyntaxKind.SlashToken:
            case SyntaxKind.PercentToken:
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.LessThanLessThanToken:
            case SyntaxKind.GreaterThanGreaterThanToken:
            case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
            case SyntaxKind.LessThanToken:
            case SyntaxKind.GreaterThanToken:
            case SyntaxKind.LessThanEqualsToken:
            case SyntaxKind.GreaterThanEqualsToken:
            case SyntaxKind.EqualsEqualsToken:
            case SyntaxKind.ExclamationEqualsToken:
            case SyntaxKind.EqualsEqualsEqualsToken:
            case SyntaxKind.ExclamationEqualsEqualsToken:
            case SyntaxKind.AmpersandToken:
            case SyntaxKind.CaretToken:
            case SyntaxKind.BarToken:
            case SyntaxKind.AmpersandAmpersandToken:
            case SyntaxKind.BarBarToken:
            case SyntaxKind.BarEqualsToken:
            case SyntaxKind.AmpersandEqualsToken:
            case SyntaxKind.CaretEqualsToken:
            case SyntaxKind.LessThanLessThanEqualsToken:
            case SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
            case SyntaxKind.PlusEqualsToken:
            case SyntaxKind.MinusEqualsToken:
            case SyntaxKind.AsteriskEqualsToken:
            case SyntaxKind.SlashEqualsToken:
            case SyntaxKind.PercentEqualsToken:
            case SyntaxKind.EqualsToken:
            case SyntaxKind.CommaToken:
                break;
            case SyntaxKind.IdentifierNameToken:
                if (operatorToken.keywordKind() !== SyntaxKind.InstanceOfKeyword && operatorToken.keywordKind() !== SyntaxKind.InKeyword) { throw Errors.argument('operatorToken'); }
                break;
            default:
                throw Errors.argument('operatorToken');
        }

        this._kind = kind;
        this._left = left;
        this._operatorToken = operatorToken;
        this._right = right;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBinaryExpression(this);
    }

    public isMissing(): bool {
        if (!this._left.isMissing()) { return false; }
        if (!this._operatorToken.isMissing()) { return false; }
        if (!this._right.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._left.firstToken()) !== null) { return token; }
        if (this._operatorToken.width() > 0) { return this._operatorToken; }
        if ((token = this._right.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._right.lastToken()) !== null) { return token; }
        if (this._operatorToken.width() > 0) { return this._operatorToken; }
        if ((token = this._left.lastToken()) !== null) { return token; }
        return null;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public left(): ExpressionSyntax {
        return this._left;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public right(): ExpressionSyntax {
        return this._right;
    }

    public update(kind: SyntaxKind,
                  left: ExpressionSyntax,
                  operatorToken: ISyntaxToken,
                  right: ExpressionSyntax): BinaryExpressionSyntax {
        if (this._kind === kind && this._left === left && this._operatorToken === operatorToken && this._right === right) {
            return this;
        }

        return new BinaryExpressionSyntax(kind, left, operatorToken, right);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BinaryExpressionSyntax {
        return <BinaryExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BinaryExpressionSyntax {
        return <BinaryExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withKind(kind: SyntaxKind): BinaryExpressionSyntax {
        return this.update(kind, this._left, this._operatorToken, this._right);
    }

    public withLeft(left: ExpressionSyntax): BinaryExpressionSyntax {
        return this.update(this._kind, left, this._operatorToken, this._right);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): BinaryExpressionSyntax {
        return this.update(this._kind, this._left, operatorToken, this._right);
    }

    public withRight(right: ExpressionSyntax): BinaryExpressionSyntax {
        return this.update(this._kind, this._left, this._operatorToken, right);
    }

    private collectTextElements(elements: string[]): void {
        this._left.collectTextElements(elements);
        this._operatorToken.collectTextElements(elements);
        this._right.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._left.isTypeScriptSpecific()) { return true; }
        if (this._right.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ConditionalExpressionSyntax extends ExpressionSyntax {
    private _condition: ExpressionSyntax;
    private _questionToken: ISyntaxToken;
    private _whenTrue: ExpressionSyntax;
    private _colonToken: ISyntaxToken;
    private _whenFalse: ExpressionSyntax;

    constructor(condition: ExpressionSyntax,
                questionToken: ISyntaxToken,
                whenTrue: ExpressionSyntax,
                colonToken: ISyntaxToken,
                whenFalse: ExpressionSyntax) {
        super();

        if (condition === null) { throw Errors.argumentNull('condition'); }
        if (whenTrue === null) { throw Errors.argumentNull('whenTrue'); }
        if (whenFalse === null) { throw Errors.argumentNull('whenFalse'); }
        if (questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }
        if (colonToken.kind() !== SyntaxKind.ColonToken) { throw Errors.argument('colonToken'); }

        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
    }

    public static create1(condition: ExpressionSyntax,
                          whenTrue: ExpressionSyntax,
                          whenFalse: ExpressionSyntax): ConditionalExpressionSyntax {
        return new ConditionalExpressionSyntax(
            condition,
            SyntaxToken.create(SyntaxKind.QuestionToken),
            whenTrue,
            SyntaxToken.create(SyntaxKind.ColonToken),
            whenFalse);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConditionalExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConditionalExpression;
    }

    public isMissing(): bool {
        if (!this._condition.isMissing()) { return false; }
        if (!this._questionToken.isMissing()) { return false; }
        if (!this._whenTrue.isMissing()) { return false; }
        if (!this._colonToken.isMissing()) { return false; }
        if (!this._whenFalse.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._condition.firstToken()) !== null) { return token; }
        if (this._questionToken.width() > 0) { return this._questionToken; }
        if ((token = this._whenTrue.firstToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._whenFalse.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._whenFalse.lastToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._whenTrue.lastToken()) !== null) { return token; }
        if (this._questionToken.width() > 0) { return this._questionToken; }
        if ((token = this._condition.lastToken()) !== null) { return token; }
        return null;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public whenTrue(): ExpressionSyntax {
        return this._whenTrue;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public whenFalse(): ExpressionSyntax {
        return this._whenFalse;
    }

    public update(condition: ExpressionSyntax,
                  questionToken: ISyntaxToken,
                  whenTrue: ExpressionSyntax,
                  colonToken: ISyntaxToken,
                  whenFalse: ExpressionSyntax): ConditionalExpressionSyntax {
        if (this._condition === condition && this._questionToken === questionToken && this._whenTrue === whenTrue && this._colonToken === colonToken && this._whenFalse === whenFalse) {
            return this;
        }

        return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax {
        return <ConditionalExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax {
        return <ConditionalExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withCondition(condition: ExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(condition, this._questionToken, this._whenTrue, this._colonToken, this._whenFalse);
    }

    public withQuestionToken(questionToken: ISyntaxToken): ConditionalExpressionSyntax {
        return this.update(this._condition, questionToken, this._whenTrue, this._colonToken, this._whenFalse);
    }

    public withWhenTrue(whenTrue: ExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(this._condition, this._questionToken, whenTrue, this._colonToken, this._whenFalse);
    }

    public withColonToken(colonToken: ISyntaxToken): ConditionalExpressionSyntax {
        return this.update(this._condition, this._questionToken, this._whenTrue, colonToken, this._whenFalse);
    }

    public withWhenFalse(whenFalse: ExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(this._condition, this._questionToken, this._whenTrue, this._colonToken, whenFalse);
    }

    private collectTextElements(elements: string[]): void {
        this._condition.collectTextElements(elements);
        this._questionToken.collectTextElements(elements);
        this._whenTrue.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._whenFalse.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._whenTrue.isTypeScriptSpecific()) { return true; }
        if (this._whenFalse.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class TypeMemberSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeMemberSyntax {
        return <TypeMemberSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeMemberSyntax {
        return <TypeMemberSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ConstructSignatureSyntax extends TypeMemberSyntax {
    private _newKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(newKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (newKeyword.keywordKind() !== SyntaxKind.NewKeyword) { throw Errors.argument('newKeyword'); }

        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(newKeyword: ISyntaxToken,
                         parameterList: ParameterListSyntax): ConstructSignatureSyntax {
        return new ConstructSignatureSyntax(newKeyword, parameterList, null);
    }

    public static create1(): ConstructSignatureSyntax {
        return new ConstructSignatureSyntax(
            SyntaxToken.create(SyntaxKind.NewKeyword),
            ParameterListSyntax.create1(),
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructSignature;
    }

    public isMissing(): bool {
        if (!this._newKeyword.isMissing()) { return false; }
        if (!this._parameterList.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._newKeyword.width() > 0) { return this._newKeyword; }
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        if (this._newKeyword.width() > 0) { return this._newKeyword; }
        return null;
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(newKeyword: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax {
        if (this._newKeyword === newKeyword && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax {
        return <ConstructSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax {
        return <ConstructSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ConstructSignatureSyntax {
        return this.update(newKeyword, this._parameterList, this._typeAnnotation);
    }

    public withParameterList(parameterList: ParameterListSyntax): ConstructSignatureSyntax {
        return this.update(this._newKeyword, parameterList, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): ConstructSignatureSyntax {
        return this.update(this._newKeyword, this._parameterList, typeAnnotation);
    }

    private collectTextElements(elements: string[]): void {
        this._newKeyword.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class FunctionSignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (questionToken !== null) {
            if (questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }
        }

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(identifier: ISyntaxToken,
                         parameterList: ParameterListSyntax): FunctionSignatureSyntax {
        return new FunctionSignatureSyntax(identifier, null, parameterList, null);
    }

    public static create1(identifier: ISyntaxToken): FunctionSignatureSyntax {
        return new FunctionSignatureSyntax(
            identifier,
            null,
            ParameterListSyntax.create1(),
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionSignature;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        if (this._questionToken !== null && !this._questionToken.isMissing()) { return false; }
        if (!this._parameterList.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._questionToken !== null && this._questionToken.width() > 0) { return this._questionToken; }
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        if (this._questionToken !== null && this._questionToken.width() > 0) { return this._questionToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax {
        if (this._identifier === identifier && this._questionToken === questionToken && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionSignatureSyntax {
        return <FunctionSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionSignatureSyntax {
        return <FunctionSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): FunctionSignatureSyntax {
        return this.update(identifier, this._questionToken, this._parameterList, this._typeAnnotation);
    }

    public withQuestionToken(questionToken: ISyntaxToken): FunctionSignatureSyntax {
        return this.update(this._identifier, questionToken, this._parameterList, this._typeAnnotation);
    }

    public withParameterList(parameterList: ParameterListSyntax): FunctionSignatureSyntax {
        return this.update(this._identifier, this._questionToken, parameterList, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): FunctionSignatureSyntax {
        return this.update(this._identifier, this._questionToken, this._parameterList, typeAnnotation);
    }

    private collectTextElements(elements: string[]): void {
        this._identifier.collectTextElements(elements);
        if (this._questionToken !== null) { this._questionToken.collectTextElements(elements); }
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._parameterList.isTypeScriptSpecific()) { return true; }
        if (this._typeAnnotation !== null && this._typeAnnotation.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class IndexSignatureSyntax extends TypeMemberSyntax {
    private _openBracketToken: ISyntaxToken;
    private _parameter: ParameterSyntax;
    private _closeBracketToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(openBracketToken: ISyntaxToken,
                parameter: ParameterSyntax,
                closeBracketToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (parameter === null) { throw Errors.argumentNull('parameter'); }
        if (openBracketToken.kind() !== SyntaxKind.OpenBracketToken) { throw Errors.argument('openBracketToken'); }
        if (closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) { throw Errors.argument('closeBracketToken'); }

        this._openBracketToken = openBracketToken;
        this._parameter = parameter;
        this._closeBracketToken = closeBracketToken;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(openBracketToken: ISyntaxToken,
                         parameter: ParameterSyntax,
                         closeBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, null);
    }

    public static create1(parameter: ParameterSyntax): IndexSignatureSyntax {
        return new IndexSignatureSyntax(
            SyntaxToken.create(SyntaxKind.OpenBracketToken),
            parameter,
            SyntaxToken.create(SyntaxKind.CloseBracketToken),
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIndexSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IndexSignature;
    }

    public isMissing(): bool {
        if (!this._openBracketToken.isMissing()) { return false; }
        if (!this._parameter.isMissing()) { return false; }
        if (!this._closeBracketToken.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        if ((token = this._parameter.firstToken()) !== null) { return token; }
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if (this._closeBracketToken.width() > 0) { return this._closeBracketToken; }
        if ((token = this._parameter.lastToken()) !== null) { return token; }
        if (this._openBracketToken.width() > 0) { return this._openBracketToken; }
        return null;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public parameter(): ParameterSyntax {
        return this._parameter;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(openBracketToken: ISyntaxToken,
                  parameter: ParameterSyntax,
                  closeBracketToken: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
        if (this._openBracketToken === openBracketToken && this._parameter === parameter && this._closeBracketToken === closeBracketToken && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IndexSignatureSyntax {
        return <IndexSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IndexSignatureSyntax {
        return <IndexSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return this.update(openBracketToken, this._parameter, this._closeBracketToken, this._typeAnnotation);
    }

    public withParameter(parameter: ParameterSyntax): IndexSignatureSyntax {
        return this.update(this._openBracketToken, parameter, this._closeBracketToken, this._typeAnnotation);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return this.update(this._openBracketToken, this._parameter, closeBracketToken, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax {
        return this.update(this._openBracketToken, this._parameter, this._closeBracketToken, typeAnnotation);
    }

    private collectTextElements(elements: string[]): void {
        this._openBracketToken.collectTextElements(elements);
        this._parameter.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class PropertySignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (questionToken !== null) {
            if (questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }
        }

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(identifier: ISyntaxToken): PropertySignatureSyntax {
        return new PropertySignatureSyntax(identifier, null, null);
    }

    public static create1(identifier: ISyntaxToken): PropertySignatureSyntax {
        return new PropertySignatureSyntax(
            identifier,
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPropertySignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PropertySignature;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        if (this._questionToken !== null && !this._questionToken.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._questionToken !== null && this._questionToken.width() > 0) { return this._questionToken; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if (this._questionToken !== null && this._questionToken.width() > 0) { return this._questionToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
        if (this._identifier === identifier && this._questionToken === questionToken && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PropertySignatureSyntax {
        return <PropertySignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PropertySignatureSyntax {
        return <PropertySignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): PropertySignatureSyntax {
        return this.update(identifier, this._questionToken, this._typeAnnotation);
    }

    public withQuestionToken(questionToken: ISyntaxToken): PropertySignatureSyntax {
        return this.update(this._identifier, questionToken, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax {
        return this.update(this._identifier, this._questionToken, typeAnnotation);
    }

    private collectTextElements(elements: string[]): void {
        this._identifier.collectTextElements(elements);
        if (this._questionToken !== null) { this._questionToken.collectTextElements(elements); }
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ParameterListSyntax extends SyntaxNode {
    private _openParenToken: ISyntaxToken;
    private _parameters: ISeparatedSyntaxList;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                parameters: ISeparatedSyntaxList,
                closeParenToken: ISyntaxToken) {
        super();

        if (parameters === null) { throw Errors.argumentNull('parameters'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._openParenToken = openParenToken;
        this._parameters = parameters;
        this._closeParenToken = closeParenToken;
    }

    public static create(openParenToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken): ParameterListSyntax {
        return new ParameterListSyntax(openParenToken, SeparatedSyntaxList.empty, closeParenToken);
    }

    public static create1(): ParameterListSyntax {
        return new ParameterListSyntax(
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            SeparatedSyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseParenToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParameterList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParameterList;
    }

    public isMissing(): bool {
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._parameters.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._parameters.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._parameters.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        return null;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public parameters(): ISeparatedSyntaxList {
        return this._parameters;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public update(openParenToken: ISyntaxToken,
                  parameters: ISeparatedSyntaxList,
                  closeParenToken: ISyntaxToken): ParameterListSyntax {
        if (this._openParenToken === openParenToken && this._parameters === parameters && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ParameterListSyntax {
        return <ParameterListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ParameterListSyntax {
        return <ParameterListSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(openParenToken, this._parameters, this._closeParenToken);
    }

    public withParameters(parameters: ISeparatedSyntaxList): ParameterListSyntax {
        return this.update(this._openParenToken, parameters, this._closeParenToken);
    }

    public withParameter(parameter: ParameterSyntax): ParameterListSyntax {
        return this.withParameters(SeparatedSyntaxList.create([parameter]));
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(this._openParenToken, this._parameters, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openParenToken.collectTextElements(elements);
        this._parameters.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._parameters.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class CallSignatureSyntax extends TypeMemberSyntax {
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }

        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return new CallSignatureSyntax(parameterList, null);
    }

    public static create1(): CallSignatureSyntax {
        return new CallSignatureSyntax(
            ParameterListSyntax.create1(),
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCallSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CallSignature;
    }

    public isMissing(): bool {
        if (!this._parameterList.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        return null;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        if (this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new CallSignatureSyntax(parameterList, typeAnnotation);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax {
        return <CallSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax {
        return <CallSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return this.update(parameterList, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        return this.update(this._parameterList, typeAnnotation);
    }

    private collectTextElements(elements: string[]): void {
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._parameterList.isTypeScriptSpecific()) { return true; }
        if (this._typeAnnotation !== null) { return true; }
        return false;
    }
}

class ElseClauseSyntax extends SyntaxNode {
    private _elseKeyword: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(elseKeyword: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (elseKeyword.keywordKind() !== SyntaxKind.ElseKeyword) { throw Errors.argument('elseKeyword'); }

        this._elseKeyword = elseKeyword;
        this._statement = statement;
    }

    public static create1(statement: StatementSyntax): ElseClauseSyntax {
        return new ElseClauseSyntax(
            SyntaxToken.create(SyntaxKind.ElseKeyword),
            statement);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitElseClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElseClause;
    }

    public isMissing(): bool {
        if (!this._elseKeyword.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._elseKeyword.width() > 0) { return this._elseKeyword; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._elseKeyword.width() > 0) { return this._elseKeyword; }
        return null;
    }

    public elseKeyword(): ISyntaxToken {
        return this._elseKeyword;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(elseKeyword: ISyntaxToken,
                  statement: StatementSyntax): ElseClauseSyntax {
        if (this._elseKeyword === elseKeyword && this._statement === statement) {
            return this;
        }

        return new ElseClauseSyntax(elseKeyword, statement);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ElseClauseSyntax {
        return <ElseClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ElseClauseSyntax {
        return <ElseClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withElseKeyword(elseKeyword: ISyntaxToken): ElseClauseSyntax {
        return this.update(elseKeyword, this._statement);
    }

    public withStatement(statement: StatementSyntax): ElseClauseSyntax {
        return this.update(this._elseKeyword, statement);
    }

    private collectTextElements(elements: string[]): void {
        this._elseKeyword.collectTextElements(elements);
        this._statement.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class IfStatementSyntax extends StatementSyntax {
    private _ifKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;
    private _elseClause: ElseClauseSyntax;

    constructor(ifKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax,
                elseClause: ElseClauseSyntax) {
        super();

        if (condition === null) { throw Errors.argumentNull('condition'); }
        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (ifKeyword.keywordKind() !== SyntaxKind.IfKeyword) { throw Errors.argument('ifKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
    }

    public static create(ifKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         condition: ExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         statement: StatementSyntax): IfStatementSyntax {
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, null);
    }

    public static create1(condition: ExpressionSyntax,
                          statement: StatementSyntax): IfStatementSyntax {
        return new IfStatementSyntax(
            SyntaxToken.create(SyntaxKind.IfKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            condition,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            statement,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIfStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IfStatement;
    }

    public isMissing(): bool {
        if (!this._ifKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._condition.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        if (this._elseClause !== null && !this._elseClause.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._ifKeyword.width() > 0) { return this._ifKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._condition.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        if (this._elseClause !== null && (token = this._elseClause.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._elseClause !== null && (token = this._elseClause.lastToken()) !== null) { return token; }
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._condition.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._ifKeyword.width() > 0) { return this._ifKeyword; }
        return null;
    }

    public ifKeyword(): ISyntaxToken {
        return this._ifKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public elseClause(): ElseClauseSyntax {
        return this._elseClause;
    }

    public update(ifKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: StatementSyntax,
                  elseClause: ElseClauseSyntax): IfStatementSyntax {
        if (this._ifKeyword === ifKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement && this._elseClause === elseClause) {
            return this;
        }

        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IfStatementSyntax {
        return <IfStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IfStatementSyntax {
        return <IfStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withIfKeyword(ifKeyword: ISyntaxToken): IfStatementSyntax {
        return this.update(ifKeyword, this._openParenToken, this._condition, this._closeParenToken, this._statement, this._elseClause);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): IfStatementSyntax {
        return this.update(this._ifKeyword, openParenToken, this._condition, this._closeParenToken, this._statement, this._elseClause);
    }

    public withCondition(condition: ExpressionSyntax): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, condition, this._closeParenToken, this._statement, this._elseClause);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, this._condition, closeParenToken, this._statement, this._elseClause);
    }

    public withStatement(statement: StatementSyntax): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, this._condition, this._closeParenToken, statement, this._elseClause);
    }

    public withElseClause(elseClause: ElseClauseSyntax): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, this._condition, this._closeParenToken, this._statement, elseClause);
    }

    private collectTextElements(elements: string[]): void {
        this._ifKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
        if (this._elseClause !== null) { this._elseClause.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        if (this._elseClause !== null && this._elseClause.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ExpressionStatementSyntax extends StatementSyntax {
    private _expression: ExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(expression: ExpressionSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public static create1(expression: ExpressionSyntax): ExpressionStatementSyntax {
        return new ExpressionStatementSyntax(
            expression,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExpressionStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExpressionStatement;
    }

    public isMissing(): bool {
        if (!this._expression.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        return null;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(expression: ExpressionSyntax,
                  semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        if (this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ExpressionStatementSyntax(expression, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax {
        return <ExpressionStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax {
        return <ExpressionStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: ExpressionSyntax): ExpressionStatementSyntax {
        return this.update(expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        return this.update(this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._expression.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ClassElementSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ClassElementSyntax {
        return <ClassElementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ClassElementSyntax {
        return <ClassElementSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ConstructorDeclarationSyntax extends ClassElementSyntax {
    private _constructorKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(constructorKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (constructorKeyword.keywordKind() !== SyntaxKind.ConstructorKeyword) { throw Errors.argument('constructorKeyword'); }
        if (semicolonToken !== null) {
            if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }
        }

        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public static create(constructorKeyword: ISyntaxToken,
                         parameterList: ParameterListSyntax): ConstructorDeclarationSyntax {
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, null, null);
    }

    public static create1(): ConstructorDeclarationSyntax {
        return new ConstructorDeclarationSyntax(
            SyntaxToken.create(SyntaxKind.ConstructorKeyword),
            ParameterListSyntax.create1(),
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorDeclaration;
    }

    public isMissing(): bool {
        if (!this._constructorKeyword.isMissing()) { return false; }
        if (!this._parameterList.isMissing()) { return false; }
        if (this._block !== null && !this._block.isMissing()) { return false; }
        if (this._semicolonToken !== null && !this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._constructorKeyword.width() > 0) { return this._constructorKeyword; }
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._block !== null && (token = this._block.firstToken()) !== null) { return token; }
        if (this._semicolonToken !== null && this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken !== null && this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._block !== null && (token = this._block.lastToken()) !== null) { return token; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        if (this._constructorKeyword.width() > 0) { return this._constructorKeyword; }
        return null;
    }

    public constructorKeyword(): ISyntaxToken {
        return this._constructorKeyword;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(constructorKeyword: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  block: BlockSyntax,
                  semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
        if (this._constructorKeyword === constructorKeyword && this._parameterList === parameterList && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorDeclarationSyntax {
        return <ConstructorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorDeclarationSyntax {
        return <ConstructorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withConstructorKeyword(constructorKeyword: ISyntaxToken): ConstructorDeclarationSyntax {
        return this.update(constructorKeyword, this._parameterList, this._block, this._semicolonToken);
    }

    public withParameterList(parameterList: ParameterListSyntax): ConstructorDeclarationSyntax {
        return this.update(this._constructorKeyword, parameterList, this._block, this._semicolonToken);
    }

    public withBlock(block: BlockSyntax): ConstructorDeclarationSyntax {
        return this.update(this._constructorKeyword, this._parameterList, block, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax {
        return this.update(this._constructorKeyword, this._parameterList, this._block, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._constructorKeyword.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        if (this._block !== null) { this._block.collectTextElements(elements); }
        if (this._semicolonToken !== null) { this._semicolonToken.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberDeclarationSyntax extends ClassElementSyntax {
    constructor() {
        super();
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        throw Errors.abstract();
    }

    public staticKeyword(): ISyntaxToken {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberDeclarationSyntax {
        return <MemberDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberDeclarationSyntax {
        return <MemberDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberFunctionDeclarationSyntax extends MemberDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                functionSignature: FunctionSignatureSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (functionSignature === null) { throw Errors.argumentNull('functionSignature'); }
        if (publicOrPrivateKeyword !== null) {
            if (publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        }
        if (staticKeyword !== null) {
            if (staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        }
        if (semicolonToken !== null) {
            if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }
        }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public static create(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return new MemberFunctionDeclarationSyntax(null, null, functionSignature, null, null);
    }

    public static create1(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return new MemberFunctionDeclarationSyntax(
            null,
            null,
            functionSignature,
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
    }

    public isMissing(): bool {
        if (this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) { return false; }
        if (this._staticKeyword !== null && !this._staticKeyword.isMissing()) { return false; }
        if (!this._functionSignature.isMissing()) { return false; }
        if (this._block !== null && !this._block.isMissing()) { return false; }
        if (this._semicolonToken !== null && !this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if ((token = this._functionSignature.firstToken()) !== null) { return token; }
        if (this._block !== null && (token = this._block.firstToken()) !== null) { return token; }
        if (this._semicolonToken !== null && this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken !== null && this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._block !== null && (token = this._block.lastToken()) !== null) { return token; }
        if ((token = this._functionSignature.lastToken()) !== null) { return token; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        return null;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public functionSignature(): FunctionSignatureSyntax {
        return this._functionSignature;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  functionSignature: FunctionSignatureSyntax,
                  block: BlockSyntax,
                  semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._functionSignature === functionSignature && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberFunctionDeclarationSyntax {
        return <MemberFunctionDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberFunctionDeclarationSyntax {
        return <MemberFunctionDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): MemberFunctionDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this._staticKeyword, this._functionSignature, this._block, this._semicolonToken);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): MemberFunctionDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, staticKeyword, this._functionSignature, this._block, this._semicolonToken);
    }

    public withFunctionSignature(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, functionSignature, this._block, this._semicolonToken);
    }

    public withBlock(block: BlockSyntax): MemberFunctionDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._functionSignature, block, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._functionSignature, this._block, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._functionSignature.collectTextElements(elements);
        if (this._block !== null) { this._block.collectTextElements(elements); }
        if (this._semicolonToken !== null) { this._semicolonToken.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberAccessorDeclarationSyntax extends MemberDeclarationSyntax {
    constructor() {
        super();
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        throw Errors.abstract();
    }

    public staticKeyword(): ISyntaxToken {
        throw Errors.abstract();
    }

    public identifier(): ISyntaxToken {
        throw Errors.abstract();
    }

    public parameterList(): ParameterListSyntax {
        throw Errors.abstract();
    }

    public block(): BlockSyntax {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberAccessorDeclarationSyntax {
        return <MemberAccessorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberAccessorDeclarationSyntax {
        return <MemberAccessorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class GetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _getKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _block: BlockSyntax;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                getKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax,
                block: BlockSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (block === null) { throw Errors.argumentNull('block'); }
        if (publicOrPrivateKeyword !== null) {
            if (publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        }
        if (staticKeyword !== null) {
            if (staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        }
        if (getKeyword.keywordKind() !== SyntaxKind.GetKeyword) { throw Errors.argument('getKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._getKeyword = getKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
        this._block = block;
    }

    public static create(getKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         parameterList: ParameterListSyntax,
                         block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
        return new GetMemberAccessorDeclarationSyntax(null, null, getKeyword, identifier, parameterList, null, block);
    }

    public static create1(identifier: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return new GetMemberAccessorDeclarationSyntax(
            null,
            null,
            SyntaxToken.create(SyntaxKind.GetKeyword),
            identifier,
            ParameterListSyntax.create1(),
            null,
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetMemberAccessorDeclaration;
    }

    public isMissing(): bool {
        if (this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) { return false; }
        if (this._staticKeyword !== null && !this._staticKeyword.isMissing()) { return false; }
        if (!this._getKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (!this._parameterList.isMissing()) { return false; }
        if (this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if (this._getKeyword.width() > 0) { return this._getKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.firstToken()) !== null) { return token; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if (this._typeAnnotation !== null && (token = this._typeAnnotation.lastToken()) !== null) { return token; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._getKeyword.width() > 0) { return this._getKeyword; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        return null;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public getKeyword(): ISyntaxToken {
        return this._getKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  getKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax,
                  block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._getKeyword === getKeyword && this._identifier === identifier && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation && this._block === block) {
            return this;
        }

        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): GetMemberAccessorDeclarationSyntax {
        return <GetMemberAccessorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): GetMemberAccessorDeclarationSyntax {
        return <GetMemberAccessorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this._staticKeyword, this._getKeyword, this._identifier, this._parameterList, this._typeAnnotation, this._block);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, staticKeyword, this._getKeyword, this._identifier, this._parameterList, this._typeAnnotation, this._block);
    }

    public withGetKeyword(getKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, getKeyword, this._identifier, this._parameterList, this._typeAnnotation, this._block);
    }

    public withIdentifier(identifier: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._getKeyword, identifier, this._parameterList, this._typeAnnotation, this._block);
    }

    public withParameterList(parameterList: ParameterListSyntax): GetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._getKeyword, this._identifier, parameterList, this._typeAnnotation, this._block);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): GetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._getKeyword, this._identifier, this._parameterList, typeAnnotation, this._block);
    }

    public withBlock(block: BlockSyntax): GetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._getKeyword, this._identifier, this._parameterList, this._typeAnnotation, block);
    }

    private collectTextElements(elements: string[]): void {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._getKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class SetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _setKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _block: BlockSyntax;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                setKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                parameterList: ParameterListSyntax,
                block: BlockSyntax) {
        super();

        if (parameterList === null) { throw Errors.argumentNull('parameterList'); }
        if (block === null) { throw Errors.argumentNull('block'); }
        if (publicOrPrivateKeyword !== null) {
            if (publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        }
        if (staticKeyword !== null) {
            if (staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        }
        if (setKeyword.keywordKind() !== SyntaxKind.SetKeyword) { throw Errors.argument('setKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._setKeyword = setKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._block = block;
    }

    public static create(setKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         parameterList: ParameterListSyntax,
                         block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
        return new SetMemberAccessorDeclarationSyntax(null, null, setKeyword, identifier, parameterList, block);
    }

    public static create1(identifier: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return new SetMemberAccessorDeclarationSyntax(
            null,
            null,
            SyntaxToken.create(SyntaxKind.SetKeyword),
            identifier,
            ParameterListSyntax.create1(),
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetMemberAccessorDeclaration;
    }

    public isMissing(): bool {
        if (this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) { return false; }
        if (this._staticKeyword !== null && !this._staticKeyword.isMissing()) { return false; }
        if (!this._setKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (!this._parameterList.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if (this._setKeyword.width() > 0) { return this._setKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if ((token = this._parameterList.firstToken()) !== null) { return token; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if ((token = this._parameterList.lastToken()) !== null) { return token; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._setKeyword.width() > 0) { return this._setKeyword; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        return null;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public setKeyword(): ISyntaxToken {
        return this._setKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  setKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  parameterList: ParameterListSyntax,
                  block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._setKeyword === setKeyword && this._identifier === identifier && this._parameterList === parameterList && this._block === block) {
            return this;
        }

        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SetMemberAccessorDeclarationSyntax {
        return <SetMemberAccessorDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SetMemberAccessorDeclarationSyntax {
        return <SetMemberAccessorDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this._staticKeyword, this._setKeyword, this._identifier, this._parameterList, this._block);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, staticKeyword, this._setKeyword, this._identifier, this._parameterList, this._block);
    }

    public withSetKeyword(setKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, setKeyword, this._identifier, this._parameterList, this._block);
    }

    public withIdentifier(identifier: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._setKeyword, identifier, this._parameterList, this._block);
    }

    public withParameterList(parameterList: ParameterListSyntax): SetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._setKeyword, this._identifier, parameterList, this._block);
    }

    public withBlock(block: BlockSyntax): SetMemberAccessorDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._setKeyword, this._identifier, this._parameterList, block);
    }

    private collectTextElements(elements: string[]): void {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._setKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class MemberVariableDeclarationSyntax extends MemberDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _variableDeclarator: VariableDeclaratorSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                variableDeclarator: VariableDeclaratorSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (variableDeclarator === null) { throw Errors.argumentNull('variableDeclarator'); }
        if (publicOrPrivateKeyword !== null) {
            if (publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        }
        if (staticKeyword !== null) {
            if (staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }

    public static create(variableDeclarator: VariableDeclaratorSyntax,
                         semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        return new MemberVariableDeclarationSyntax(null, null, variableDeclarator, semicolonToken);
    }

    public static create1(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax {
        return new MemberVariableDeclarationSyntax(
            null,
            null,
            variableDeclarator,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberVariableDeclaration;
    }

    public isMissing(): bool {
        if (this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) { return false; }
        if (this._staticKeyword !== null && !this._staticKeyword.isMissing()) { return false; }
        if (!this._variableDeclarator.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if ((token = this._variableDeclarator.firstToken()) !== null) { return token; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if ((token = this._variableDeclarator.lastToken()) !== null) { return token; }
        if (this._staticKeyword !== null && this._staticKeyword.width() > 0) { return this._staticKeyword; }
        if (this._publicOrPrivateKeyword !== null && this._publicOrPrivateKeyword.width() > 0) { return this._publicOrPrivateKeyword; }
        return null;
    }

    public publicOrPrivateKeyword(): ISyntaxToken {
        return this._publicOrPrivateKeyword;
    }

    public staticKeyword(): ISyntaxToken {
        return this._staticKeyword;
    }

    public variableDeclarator(): VariableDeclaratorSyntax {
        return this._variableDeclarator;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(publicOrPrivateKeyword: ISyntaxToken,
                  staticKeyword: ISyntaxToken,
                  variableDeclarator: VariableDeclaratorSyntax,
                  semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._variableDeclarator === variableDeclarator && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberVariableDeclarationSyntax {
        return <MemberVariableDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberVariableDeclarationSyntax {
        return <MemberVariableDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withPublicOrPrivateKeyword(publicOrPrivateKeyword: ISyntaxToken): MemberVariableDeclarationSyntax {
        return this.update(publicOrPrivateKeyword, this._staticKeyword, this._variableDeclarator, this._semicolonToken);
    }

    public withStaticKeyword(staticKeyword: ISyntaxToken): MemberVariableDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, staticKeyword, this._variableDeclarator, this._semicolonToken);
    }

    public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, variableDeclarator, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        return this.update(this._publicOrPrivateKeyword, this._staticKeyword, this._variableDeclarator, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._variableDeclarator.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ThrowStatementSyntax extends StatementSyntax {
    private _throwKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(throwKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (throwKeyword.keywordKind() !== SyntaxKind.ThrowKeyword) { throw Errors.argument('throwKeyword'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._throwKeyword = throwKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public static create1(expression: ExpressionSyntax): ThrowStatementSyntax {
        return new ThrowStatementSyntax(
            SyntaxToken.create(SyntaxKind.ThrowKeyword),
            expression,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitThrowStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThrowStatement;
    }

    public isMissing(): bool {
        if (!this._throwKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._throwKeyword.width() > 0) { return this._throwKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._throwKeyword.width() > 0) { return this._throwKeyword; }
        return null;
    }

    public throwKeyword(): ISyntaxToken {
        return this._throwKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(throwKeyword: ISyntaxToken,
                  expression: ExpressionSyntax,
                  semicolonToken: ISyntaxToken): ThrowStatementSyntax {
        if (this._throwKeyword === throwKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ThrowStatementSyntax {
        return <ThrowStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ThrowStatementSyntax {
        return <ThrowStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withThrowKeyword(throwKeyword: ISyntaxToken): ThrowStatementSyntax {
        return this.update(throwKeyword, this._expression, this._semicolonToken);
    }

    public withExpression(expression: ExpressionSyntax): ThrowStatementSyntax {
        return this.update(this._throwKeyword, expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ThrowStatementSyntax {
        return this.update(this._throwKeyword, this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._throwKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ReturnStatementSyntax extends StatementSyntax {
    private _returnKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(returnKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                semicolonToken: ISyntaxToken) {
        super();

        if (returnKeyword.keywordKind() !== SyntaxKind.ReturnKeyword) { throw Errors.argument('returnKeyword'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._returnKeyword = returnKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public static create(returnKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        return new ReturnStatementSyntax(returnKeyword, null, semicolonToken);
    }

    public static create1(): ReturnStatementSyntax {
        return new ReturnStatementSyntax(
            SyntaxToken.create(SyntaxKind.ReturnKeyword),
            null,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitReturnStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ReturnStatement;
    }

    public isMissing(): bool {
        if (!this._returnKeyword.isMissing()) { return false; }
        if (this._expression !== null && !this._expression.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._returnKeyword.width() > 0) { return this._returnKeyword; }
        if (this._expression !== null && (token = this._expression.firstToken()) !== null) { return token; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._expression !== null && (token = this._expression.lastToken()) !== null) { return token; }
        if (this._returnKeyword.width() > 0) { return this._returnKeyword; }
        return null;
    }

    public returnKeyword(): ISyntaxToken {
        return this._returnKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(returnKeyword: ISyntaxToken,
                  expression: ExpressionSyntax,
                  semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        if (this._returnKeyword === returnKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ReturnStatementSyntax {
        return <ReturnStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ReturnStatementSyntax {
        return <ReturnStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withReturnKeyword(returnKeyword: ISyntaxToken): ReturnStatementSyntax {
        return this.update(returnKeyword, this._expression, this._semicolonToken);
    }

    public withExpression(expression: ExpressionSyntax): ReturnStatementSyntax {
        return this.update(this._returnKeyword, expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        return this.update(this._returnKeyword, this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._returnKeyword.collectTextElements(elements);
        if (this._expression !== null) { this._expression.collectTextElements(elements); }
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression !== null && this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ObjectCreationExpressionSyntax extends UnaryExpressionSyntax {
    private _newKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _argumentList: ArgumentListSyntax;

    constructor(newKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                argumentList: ArgumentListSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (newKeyword.keywordKind() !== SyntaxKind.NewKeyword) { throw Errors.argument('newKeyword'); }

        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
    }

    public static create(newKeyword: ISyntaxToken,
                         expression: ExpressionSyntax): ObjectCreationExpressionSyntax {
        return new ObjectCreationExpressionSyntax(newKeyword, expression, null);
    }

    public static create1(expression: ExpressionSyntax): ObjectCreationExpressionSyntax {
        return new ObjectCreationExpressionSyntax(
            SyntaxToken.create(SyntaxKind.NewKeyword),
            expression,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectCreationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectCreationExpression;
    }

    public isMissing(): bool {
        if (!this._newKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        if (this._argumentList !== null && !this._argumentList.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._newKeyword.width() > 0) { return this._newKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._argumentList !== null && (token = this._argumentList.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._argumentList !== null && (token = this._argumentList.lastToken()) !== null) { return token; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._newKeyword.width() > 0) { return this._newKeyword; }
        return null;
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }

    public update(newKeyword: ISyntaxToken,
                  expression: ExpressionSyntax,
                  argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
        if (this._newKeyword === newKeyword && this._expression === expression && this._argumentList === argumentList) {
            return this;
        }

        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectCreationExpressionSyntax {
        return <ObjectCreationExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectCreationExpressionSyntax {
        return <ObjectCreationExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ObjectCreationExpressionSyntax {
        return this.update(newKeyword, this._expression, this._argumentList);
    }

    public withExpression(expression: ExpressionSyntax): ObjectCreationExpressionSyntax {
        return this.update(this._newKeyword, expression, this._argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
        return this.update(this._newKeyword, this._expression, argumentList);
    }

    private collectTextElements(elements: string[]): void {
        this._newKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        if (this._argumentList !== null) { this._argumentList.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._argumentList !== null && this._argumentList.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class SwitchStatementSyntax extends StatementSyntax {
    private _switchKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _switchClauses: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(switchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                switchClauses: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (switchClauses === null) { throw Errors.argumentNull('switchClauses'); }
        if (switchKeyword.keywordKind() !== SyntaxKind.SwitchKeyword) { throw Errors.argument('switchKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._switchKeyword = switchKeyword;
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._openBraceToken = openBraceToken;
        this._switchClauses = switchClauses;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(switchKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         expression: ExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, SyntaxList.empty, closeBraceToken);
    }

    public static create1(expression: ExpressionSyntax): SwitchStatementSyntax {
        return new SwitchStatementSyntax(
            SyntaxToken.create(SyntaxKind.SwitchKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            expression,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSwitchStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SwitchStatement;
    }

    public isMissing(): bool {
        if (!this._switchKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._switchClauses.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._switchKeyword.width() > 0) { return this._switchKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._switchClauses.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._switchClauses.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._switchKeyword.width() > 0) { return this._switchKeyword; }
        return null;
    }

    public switchKeyword(): ISyntaxToken {
        return this._switchKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public switchClauses(): ISyntaxList {
        return this._switchClauses;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(switchKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  expression: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  switchClauses: ISyntaxList,
                  closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        if (this._switchKeyword === switchKeyword && this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken && this._openBraceToken === openBraceToken && this._switchClauses === switchClauses && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SwitchStatementSyntax {
        return <SwitchStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SwitchStatementSyntax {
        return <SwitchStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withSwitchKeyword(switchKeyword: ISyntaxToken): SwitchStatementSyntax {
        return this.update(switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._switchClauses, this._closeBraceToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._switchClauses, this._closeBraceToken);
    }

    public withExpression(expression: ExpressionSyntax): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, expression, this._closeParenToken, this._openBraceToken, this._switchClauses, this._closeBraceToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, closeParenToken, this._openBraceToken, this._switchClauses, this._closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, openBraceToken, this._switchClauses, this._closeBraceToken);
    }

    public withSwitchClauses(switchClauses: ISyntaxList): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, switchClauses, this._closeBraceToken);
    }

    public withSwitchClause(switchClause: SwitchClauseSyntax): SwitchStatementSyntax {
        return this.withSwitchClauses(SyntaxList.create([switchClause]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._switchClauses, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        this._switchKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._openBraceToken.collectTextElements(elements);
        this._switchClauses.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._switchClauses.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class SwitchClauseSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public colonToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public statements(): ISyntaxList {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SwitchClauseSyntax {
        return <SwitchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SwitchClauseSyntax {
        return <SwitchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class CaseSwitchClauseSyntax extends SwitchClauseSyntax {
    private _caseKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxList;

    constructor(caseKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                colonToken: ISyntaxToken,
                statements: ISyntaxList) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (statements === null) { throw Errors.argumentNull('statements'); }
        if (caseKeyword.keywordKind() !== SyntaxKind.CaseKeyword) { throw Errors.argument('caseKeyword'); }
        if (colonToken.kind() !== SyntaxKind.ColonToken) { throw Errors.argument('colonToken'); }

        this._caseKeyword = caseKeyword;
        this._expression = expression;
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public static create(caseKeyword: ISyntaxToken,
                         expression: ExpressionSyntax,
                         colonToken: ISyntaxToken): CaseSwitchClauseSyntax {
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, SyntaxList.empty);
    }

    public static create1(expression: ExpressionSyntax): CaseSwitchClauseSyntax {
        return new CaseSwitchClauseSyntax(
            SyntaxToken.create(SyntaxKind.CaseKeyword),
            expression,
            SyntaxToken.create(SyntaxKind.ColonToken),
            SyntaxList.empty);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCaseSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CaseSwitchClause;
    }

    public isMissing(): bool {
        if (!this._caseKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        if (!this._colonToken.isMissing()) { return false; }
        if (!this._statements.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._caseKeyword.width() > 0) { return this._caseKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._statements.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statements.lastToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._caseKeyword.width() > 0) { return this._caseKeyword; }
        return null;
    }

    public caseKeyword(): ISyntaxToken {
        return this._caseKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }

    public update(caseKeyword: ISyntaxToken,
                  expression: ExpressionSyntax,
                  colonToken: ISyntaxToken,
                  statements: ISyntaxList): CaseSwitchClauseSyntax {
        if (this._caseKeyword === caseKeyword && this._expression === expression && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }

        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CaseSwitchClauseSyntax {
        return <CaseSwitchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CaseSwitchClauseSyntax {
        return <CaseSwitchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withCaseKeyword(caseKeyword: ISyntaxToken): CaseSwitchClauseSyntax {
        return this.update(caseKeyword, this._expression, this._colonToken, this._statements);
    }

    public withExpression(expression: ExpressionSyntax): CaseSwitchClauseSyntax {
        return this.update(this._caseKeyword, expression, this._colonToken, this._statements);
    }

    public withColonToken(colonToken: ISyntaxToken): CaseSwitchClauseSyntax {
        return this.update(this._caseKeyword, this._expression, colonToken, this._statements);
    }

    public withStatements(statements: ISyntaxList): CaseSwitchClauseSyntax {
        return this.update(this._caseKeyword, this._expression, this._colonToken, statements);
    }

    public withStatement(statement: StatementSyntax): CaseSwitchClauseSyntax {
        return this.withStatements(SyntaxList.create([statement]));
    }

    private collectTextElements(elements: string[]): void {
        this._caseKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._statements.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._statements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DefaultSwitchClauseSyntax extends SwitchClauseSyntax {
    private _defaultKeyword: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxList;

    constructor(defaultKeyword: ISyntaxToken,
                colonToken: ISyntaxToken,
                statements: ISyntaxList) {
        super();

        if (statements === null) { throw Errors.argumentNull('statements'); }
        if (defaultKeyword.keywordKind() !== SyntaxKind.DefaultKeyword) { throw Errors.argument('defaultKeyword'); }
        if (colonToken.kind() !== SyntaxKind.ColonToken) { throw Errors.argument('colonToken'); }

        this._defaultKeyword = defaultKeyword;
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public static create(defaultKeyword: ISyntaxToken,
                         colonToken: ISyntaxToken): DefaultSwitchClauseSyntax {
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, SyntaxList.empty);
    }

    public static create1(): DefaultSwitchClauseSyntax {
        return new DefaultSwitchClauseSyntax(
            SyntaxToken.create(SyntaxKind.DefaultKeyword),
            SyntaxToken.create(SyntaxKind.ColonToken),
            SyntaxList.empty);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDefaultSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DefaultSwitchClause;
    }

    public isMissing(): bool {
        if (!this._defaultKeyword.isMissing()) { return false; }
        if (!this._colonToken.isMissing()) { return false; }
        if (!this._statements.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._defaultKeyword.width() > 0) { return this._defaultKeyword; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._statements.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statements.lastToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if (this._defaultKeyword.width() > 0) { return this._defaultKeyword; }
        return null;
    }

    public defaultKeyword(): ISyntaxToken {
        return this._defaultKeyword;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }

    public update(defaultKeyword: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  statements: ISyntaxList): DefaultSwitchClauseSyntax {
        if (this._defaultKeyword === defaultKeyword && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }

        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DefaultSwitchClauseSyntax {
        return <DefaultSwitchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DefaultSwitchClauseSyntax {
        return <DefaultSwitchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withDefaultKeyword(defaultKeyword: ISyntaxToken): DefaultSwitchClauseSyntax {
        return this.update(defaultKeyword, this._colonToken, this._statements);
    }

    public withColonToken(colonToken: ISyntaxToken): DefaultSwitchClauseSyntax {
        return this.update(this._defaultKeyword, colonToken, this._statements);
    }

    public withStatements(statements: ISyntaxList): DefaultSwitchClauseSyntax {
        return this.update(this._defaultKeyword, this._colonToken, statements);
    }

    public withStatement(statement: StatementSyntax): DefaultSwitchClauseSyntax {
        return this.withStatements(SyntaxList.create([statement]));
    }

    private collectTextElements(elements: string[]): void {
        this._defaultKeyword.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._statements.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statements.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class BreakStatementSyntax extends StatementSyntax {
    private _breakKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(breakKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        if (breakKeyword.keywordKind() !== SyntaxKind.BreakKeyword) { throw Errors.argument('breakKeyword'); }
        if (identifier !== null) {
            if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }

    public static create(breakKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): BreakStatementSyntax {
        return new BreakStatementSyntax(breakKeyword, null, semicolonToken);
    }

    public static create1(): BreakStatementSyntax {
        return new BreakStatementSyntax(
            SyntaxToken.create(SyntaxKind.BreakKeyword),
            null,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBreakStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.BreakStatement;
    }

    public isMissing(): bool {
        if (!this._breakKeyword.isMissing()) { return false; }
        if (this._identifier !== null && !this._identifier.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._breakKeyword.width() > 0) { return this._breakKeyword; }
        if (this._identifier !== null && this._identifier.width() > 0) { return this._identifier; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._identifier !== null && this._identifier.width() > 0) { return this._identifier; }
        if (this._breakKeyword.width() > 0) { return this._breakKeyword; }
        return null;
    }

    public breakKeyword(): ISyntaxToken {
        return this._breakKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(breakKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  semicolonToken: ISyntaxToken): BreakStatementSyntax {
        if (this._breakKeyword === breakKeyword && this._identifier === identifier && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BreakStatementSyntax {
        return <BreakStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BreakStatementSyntax {
        return <BreakStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withBreakKeyword(breakKeyword: ISyntaxToken): BreakStatementSyntax {
        return this.update(breakKeyword, this._identifier, this._semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): BreakStatementSyntax {
        return this.update(this._breakKeyword, identifier, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): BreakStatementSyntax {
        return this.update(this._breakKeyword, this._identifier, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._breakKeyword.collectTextElements(elements);
        if (this._identifier !== null) { this._identifier.collectTextElements(elements); }
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class ContinueStatementSyntax extends StatementSyntax {
    private _continueKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(continueKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        if (continueKeyword.keywordKind() !== SyntaxKind.ContinueKeyword) { throw Errors.argument('continueKeyword'); }
        if (identifier !== null) {
            if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._continueKeyword = continueKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }

    public static create(continueKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        return new ContinueStatementSyntax(continueKeyword, null, semicolonToken);
    }

    public static create1(): ContinueStatementSyntax {
        return new ContinueStatementSyntax(
            SyntaxToken.create(SyntaxKind.ContinueKeyword),
            null,
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitContinueStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ContinueStatement;
    }

    public isMissing(): bool {
        if (!this._continueKeyword.isMissing()) { return false; }
        if (this._identifier !== null && !this._identifier.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._continueKeyword.width() > 0) { return this._continueKeyword; }
        if (this._identifier !== null && this._identifier.width() > 0) { return this._identifier; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._identifier !== null && this._identifier.width() > 0) { return this._identifier; }
        if (this._continueKeyword.width() > 0) { return this._continueKeyword; }
        return null;
    }

    public continueKeyword(): ISyntaxToken {
        return this._continueKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(continueKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        if (this._continueKeyword === continueKeyword && this._identifier === identifier && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ContinueStatementSyntax {
        return <ContinueStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ContinueStatementSyntax {
        return <ContinueStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withContinueKeyword(continueKeyword: ISyntaxToken): ContinueStatementSyntax {
        return this.update(continueKeyword, this._identifier, this._semicolonToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ContinueStatementSyntax {
        return this.update(this._continueKeyword, identifier, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        return this.update(this._continueKeyword, this._identifier, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._continueKeyword.collectTextElements(elements);
        if (this._identifier !== null) { this._identifier.collectTextElements(elements); }
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class IterationStatementSyntax extends StatementSyntax {
    constructor() {
        super();
    }

    public openParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public closeParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public statement(): StatementSyntax {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): IterationStatementSyntax {
        return <IterationStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): IterationStatementSyntax {
        return <IterationStatementSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class BaseForStatementSyntax extends IterationStatementSyntax {
    constructor() {
        super();
    }

    public forKeyword(): ISyntaxToken {
        throw Errors.abstract();
    }

    public openParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        throw Errors.abstract();
    }

    public closeParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public statement(): StatementSyntax {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): BaseForStatementSyntax {
        return <BaseForStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): BaseForStatementSyntax {
        return <BaseForStatementSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class ForStatementSyntax extends BaseForStatementSyntax {
    private _forKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _initializer: ExpressionSyntax;
    private _firstSemicolonToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _secondSemicolonToken: ISyntaxToken;
    private _incrementor: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                initializer: ExpressionSyntax,
                firstSemicolonToken: ISyntaxToken,
                condition: ExpressionSyntax,
                secondSemicolonToken: ISyntaxToken,
                incrementor: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (forKeyword.keywordKind() !== SyntaxKind.ForKeyword) { throw Errors.argument('forKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (firstSemicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('firstSemicolonToken'); }
        if (secondSemicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('secondSemicolonToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._initializer = initializer;
        this._firstSemicolonToken = firstSemicolonToken;
        this._condition = condition;
        this._secondSemicolonToken = secondSemicolonToken;
        this._incrementor = incrementor;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public static create(forKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         firstSemicolonToken: ISyntaxToken,
                         secondSemicolonToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken,
                         statement: StatementSyntax): ForStatementSyntax {
        return new ForStatementSyntax(forKeyword, openParenToken, null, null, firstSemicolonToken, null, secondSemicolonToken, null, closeParenToken, statement);
    }

    public static create1(statement: StatementSyntax): ForStatementSyntax {
        return new ForStatementSyntax(
            SyntaxToken.create(SyntaxKind.ForKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            null,
            null,
            SyntaxToken.create(SyntaxKind.SemicolonToken),
            null,
            SyntaxToken.create(SyntaxKind.SemicolonToken),
            null,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            statement);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitForStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForStatement;
    }

    public isMissing(): bool {
        if (!this._forKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (this._variableDeclaration !== null && !this._variableDeclaration.isMissing()) { return false; }
        if (this._initializer !== null && !this._initializer.isMissing()) { return false; }
        if (!this._firstSemicolonToken.isMissing()) { return false; }
        if (this._condition !== null && !this._condition.isMissing()) { return false; }
        if (!this._secondSemicolonToken.isMissing()) { return false; }
        if (this._incrementor !== null && !this._incrementor.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._forKeyword.width() > 0) { return this._forKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._variableDeclaration !== null && (token = this._variableDeclaration.firstToken()) !== null) { return token; }
        if (this._initializer !== null && (token = this._initializer.firstToken()) !== null) { return token; }
        if (this._firstSemicolonToken.width() > 0) { return this._firstSemicolonToken; }
        if (this._condition !== null && (token = this._condition.firstToken()) !== null) { return token; }
        if (this._secondSemicolonToken.width() > 0) { return this._secondSemicolonToken; }
        if (this._incrementor !== null && (token = this._incrementor.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._incrementor !== null && (token = this._incrementor.lastToken()) !== null) { return token; }
        if (this._secondSemicolonToken.width() > 0) { return this._secondSemicolonToken; }
        if (this._condition !== null && (token = this._condition.lastToken()) !== null) { return token; }
        if (this._firstSemicolonToken.width() > 0) { return this._firstSemicolonToken; }
        if (this._initializer !== null && (token = this._initializer.lastToken()) !== null) { return token; }
        if (this._variableDeclaration !== null && (token = this._variableDeclaration.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._forKeyword.width() > 0) { return this._forKeyword; }
        return null;
    }

    public forKeyword(): ISyntaxToken {
        return this._forKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public initializer(): ExpressionSyntax {
        return this._initializer;
    }

    public firstSemicolonToken(): ISyntaxToken {
        return this._firstSemicolonToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public secondSemicolonToken(): ISyntaxToken {
        return this._secondSemicolonToken;
    }

    public incrementor(): ExpressionSyntax {
        return this._incrementor;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(forKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  initializer: ExpressionSyntax,
                  firstSemicolonToken: ISyntaxToken,
                  condition: ExpressionSyntax,
                  secondSemicolonToken: ISyntaxToken,
                  incrementor: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: StatementSyntax): ForStatementSyntax {
        if (this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._initializer === initializer && this._firstSemicolonToken === firstSemicolonToken && this._condition === condition && this._secondSemicolonToken === secondSemicolonToken && this._incrementor === incrementor && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ForStatementSyntax {
        return <ForStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ForStatementSyntax {
        return <ForStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withForKeyword(forKeyword: ISyntaxToken): ForStatementSyntax {
        return this.update(forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withInitializer(initializer: ExpressionSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withFirstSemicolonToken(firstSemicolonToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withCondition(condition: ExpressionSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withSecondSemicolonToken(secondSemicolonToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withIncrementor(incrementor: ExpressionSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, incrementor, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, closeParenToken, this._statement);
    }

    public withStatement(statement: StatementSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        this._forKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        if (this._variableDeclaration !== null) { this._variableDeclaration.collectTextElements(elements); }
        if (this._initializer !== null) { this._initializer.collectTextElements(elements); }
        this._firstSemicolonToken.collectTextElements(elements);
        if (this._condition !== null) { this._condition.collectTextElements(elements); }
        this._secondSemicolonToken.collectTextElements(elements);
        if (this._incrementor !== null) { this._incrementor.collectTextElements(elements); }
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._variableDeclaration !== null && this._variableDeclaration.isTypeScriptSpecific()) { return true; }
        if (this._initializer !== null && this._initializer.isTypeScriptSpecific()) { return true; }
        if (this._condition !== null && this._condition.isTypeScriptSpecific()) { return true; }
        if (this._incrementor !== null && this._incrementor.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class ForInStatementSyntax extends BaseForStatementSyntax {
    private _forKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _left: ExpressionSyntax;
    private _inKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                left: ExpressionSyntax,
                inKeyword: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (forKeyword.keywordKind() !== SyntaxKind.ForKeyword) { throw Errors.argument('forKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (inKeyword.keywordKind() !== SyntaxKind.InKeyword) { throw Errors.argument('inKeyword'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._left = left;
        this._inKeyword = inKeyword;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public static create(forKeyword: ISyntaxToken,
                         openParenToken: ISyntaxToken,
                         inKeyword: ISyntaxToken,
                         expression: ExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         statement: StatementSyntax): ForInStatementSyntax {
        return new ForInStatementSyntax(forKeyword, openParenToken, null, null, inKeyword, expression, closeParenToken, statement);
    }

    public static create1(expression: ExpressionSyntax,
                          statement: StatementSyntax): ForInStatementSyntax {
        return new ForInStatementSyntax(
            SyntaxToken.create(SyntaxKind.ForKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            null,
            null,
            SyntaxToken.create(SyntaxKind.InKeyword),
            expression,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            statement);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitForInStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForInStatement;
    }

    public isMissing(): bool {
        if (!this._forKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (this._variableDeclaration !== null && !this._variableDeclaration.isMissing()) { return false; }
        if (this._left !== null && !this._left.isMissing()) { return false; }
        if (!this._inKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._forKeyword.width() > 0) { return this._forKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._variableDeclaration !== null && (token = this._variableDeclaration.firstToken()) !== null) { return token; }
        if (this._left !== null && (token = this._left.firstToken()) !== null) { return token; }
        if (this._inKeyword.width() > 0) { return this._inKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._inKeyword.width() > 0) { return this._inKeyword; }
        if (this._left !== null && (token = this._left.lastToken()) !== null) { return token; }
        if (this._variableDeclaration !== null && (token = this._variableDeclaration.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._forKeyword.width() > 0) { return this._forKeyword; }
        return null;
    }

    public forKeyword(): ISyntaxToken {
        return this._forKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public variableDeclaration(): VariableDeclarationSyntax {
        return this._variableDeclaration;
    }

    public left(): ExpressionSyntax {
        return this._left;
    }

    public inKeyword(): ISyntaxToken {
        return this._inKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(forKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  left: ExpressionSyntax,
                  inKeyword: ISyntaxToken,
                  expression: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: StatementSyntax): ForInStatementSyntax {
        if (this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._left === left && this._inKeyword === inKeyword && this._expression === expression && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ForInStatementSyntax {
        return <ForInStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ForInStatementSyntax {
        return <ForInStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withForKeyword(forKeyword: ISyntaxToken): ForInStatementSyntax {
        return this.update(forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ForInStatementSyntax {
        return this.update(this._forKeyword, openParenToken, this._variableDeclaration, this._left, this._inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, variableDeclaration, this._left, this._inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withLeft(left: ExpressionSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, left, this._inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withInKeyword(inKeyword: ISyntaxToken): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withExpression(expression: ExpressionSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, expression, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, this._expression, closeParenToken, this._statement);
    }

    public withStatement(statement: StatementSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, this._expression, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        this._forKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        if (this._variableDeclaration !== null) { this._variableDeclaration.collectTextElements(elements); }
        if (this._left !== null) { this._left.collectTextElements(elements); }
        this._inKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._variableDeclaration !== null && this._variableDeclaration.isTypeScriptSpecific()) { return true; }
        if (this._left !== null && this._left.isTypeScriptSpecific()) { return true; }
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class WhileStatementSyntax extends IterationStatementSyntax {
    private _whileKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (condition === null) { throw Errors.argumentNull('condition'); }
        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (whileKeyword.keywordKind() !== SyntaxKind.WhileKeyword) { throw Errors.argument('whileKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public static create1(condition: ExpressionSyntax,
                          statement: StatementSyntax): WhileStatementSyntax {
        return new WhileStatementSyntax(
            SyntaxToken.create(SyntaxKind.WhileKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            condition,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            statement);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitWhileStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WhileStatement;
    }

    public isMissing(): bool {
        if (!this._whileKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._condition.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._whileKeyword.width() > 0) { return this._whileKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._condition.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._condition.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._whileKeyword.width() > 0) { return this._whileKeyword; }
        return null;
    }

    public whileKeyword(): ISyntaxToken {
        return this._whileKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(whileKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: StatementSyntax): WhileStatementSyntax {
        if (this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): WhileStatementSyntax {
        return <WhileStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): WhileStatementSyntax {
        return <WhileStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withWhileKeyword(whileKeyword: ISyntaxToken): WhileStatementSyntax {
        return this.update(whileKeyword, this._openParenToken, this._condition, this._closeParenToken, this._statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): WhileStatementSyntax {
        return this.update(this._whileKeyword, openParenToken, this._condition, this._closeParenToken, this._statement);
    }

    public withCondition(condition: ExpressionSyntax): WhileStatementSyntax {
        return this.update(this._whileKeyword, this._openParenToken, condition, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): WhileStatementSyntax {
        return this.update(this._whileKeyword, this._openParenToken, this._condition, closeParenToken, this._statement);
    }

    public withStatement(statement: StatementSyntax): WhileStatementSyntax {
        return this.update(this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        this._whileKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class WithStatementSyntax extends StatementSyntax {
    private _withKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(withKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (condition === null) { throw Errors.argumentNull('condition'); }
        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (withKeyword.keywordKind() !== SyntaxKind.WithKeyword) { throw Errors.argument('withKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._withKeyword = withKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public static create1(condition: ExpressionSyntax,
                          statement: StatementSyntax): WithStatementSyntax {
        return new WithStatementSyntax(
            SyntaxToken.create(SyntaxKind.WithKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            condition,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            statement);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitWithStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WithStatement;
    }

    public isMissing(): bool {
        if (!this._withKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._condition.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._withKeyword.width() > 0) { return this._withKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._condition.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._condition.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._withKeyword.width() > 0) { return this._withKeyword; }
        return null;
    }

    public withKeyword(): ISyntaxToken {
        return this._withKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(withKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: StatementSyntax): WithStatementSyntax {
        if (this._withKeyword === withKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): WithStatementSyntax {
        return <WithStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): WithStatementSyntax {
        return <WithStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withWithKeyword(withKeyword: ISyntaxToken): WithStatementSyntax {
        return this.update(withKeyword, this._openParenToken, this._condition, this._closeParenToken, this._statement);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): WithStatementSyntax {
        return this.update(this._withKeyword, openParenToken, this._condition, this._closeParenToken, this._statement);
    }

    public withCondition(condition: ExpressionSyntax): WithStatementSyntax {
        return this.update(this._withKeyword, this._openParenToken, condition, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): WithStatementSyntax {
        return this.update(this._withKeyword, this._openParenToken, this._condition, closeParenToken, this._statement);
    }

    public withStatement(statement: StatementSyntax): WithStatementSyntax {
        return this.update(this._withKeyword, this._openParenToken, this._condition, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        this._withKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class EnumDeclarationSyntax extends ModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _enumKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _variableDeclarators: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                enumKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                variableDeclarators: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (variableDeclarators === null) { throw Errors.argumentNull('variableDeclarators'); }
        if (exportKeyword !== null) {
            if (exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        }
        if (enumKeyword.keywordKind() !== SyntaxKind.EnumKeyword) { throw Errors.argument('enumKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._exportKeyword = exportKeyword;
        this._enumKeyword = enumKeyword;
        this._identifier = identifier;
        this._openBraceToken = openBraceToken;
        this._variableDeclarators = variableDeclarators;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(enumKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return new EnumDeclarationSyntax(null, enumKeyword, identifier, openBraceToken, SeparatedSyntaxList.empty, closeBraceToken);
    }

    public static create1(identifier: ISyntaxToken): EnumDeclarationSyntax {
        return new EnumDeclarationSyntax(
            null,
            SyntaxToken.create(SyntaxKind.EnumKeyword),
            identifier,
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SeparatedSyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEnumDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EnumDeclaration;
    }

    public isMissing(): bool {
        if (this._exportKeyword !== null && !this._exportKeyword.isMissing()) { return false; }
        if (!this._enumKeyword.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._variableDeclarators.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        if (this._enumKeyword.width() > 0) { return this._enumKeyword; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._variableDeclarators.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._variableDeclarators.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._enumKeyword.width() > 0) { return this._enumKeyword; }
        if (this._exportKeyword !== null && this._exportKeyword.width() > 0) { return this._exportKeyword; }
        return null;
    }

    public exportKeyword(): ISyntaxToken {
        return this._exportKeyword;
    }

    public enumKeyword(): ISyntaxToken {
        return this._enumKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public variableDeclarators(): ISeparatedSyntaxList {
        return this._variableDeclarators;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(exportKeyword: ISyntaxToken,
                  enumKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  variableDeclarators: ISeparatedSyntaxList,
                  closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._enumKeyword === enumKeyword && this._identifier === identifier && this._openBraceToken === openBraceToken && this._variableDeclarators === variableDeclarators && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): EnumDeclarationSyntax {
        return <EnumDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): EnumDeclarationSyntax {
        return <EnumDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(exportKeyword, this._enumKeyword, this._identifier, this._openBraceToken, this._variableDeclarators, this._closeBraceToken);
    }

    public withEnumKeyword(enumKeyword: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, enumKeyword, this._identifier, this._openBraceToken, this._variableDeclarators, this._closeBraceToken);
    }

    public withIdentifier(identifier: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, this._enumKeyword, identifier, this._openBraceToken, this._variableDeclarators, this._closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, this._enumKeyword, this._identifier, openBraceToken, this._variableDeclarators, this._closeBraceToken);
    }

    public withVariableDeclarators(variableDeclarators: ISeparatedSyntaxList): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, this._enumKeyword, this._identifier, this._openBraceToken, variableDeclarators, this._closeBraceToken);
    }

    public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): EnumDeclarationSyntax {
        return this.withVariableDeclarators(SeparatedSyntaxList.create([variableDeclarator]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, this._enumKeyword, this._identifier, this._openBraceToken, this._variableDeclarators, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        this._enumKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._openBraceToken.collectTextElements(elements);
        this._variableDeclarators.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class CastExpressionSyntax extends UnaryExpressionSyntax {
    private _lessThanToken: ISyntaxToken;
    private _type: TypeSyntax;
    private _greaterThanToken: ISyntaxToken;
    private _expression: UnaryExpressionSyntax;

    constructor(lessThanToken: ISyntaxToken,
                type: TypeSyntax,
                greaterThanToken: ISyntaxToken,
                expression: UnaryExpressionSyntax) {
        super();

        if (type === null) { throw Errors.argumentNull('type'); }
        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (lessThanToken.kind() !== SyntaxKind.LessThanToken) { throw Errors.argument('lessThanToken'); }
        if (greaterThanToken.kind() !== SyntaxKind.GreaterThanToken) { throw Errors.argument('greaterThanToken'); }

        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
    }

    public static create1(type: TypeSyntax,
                          expression: UnaryExpressionSyntax): CastExpressionSyntax {
        return new CastExpressionSyntax(
            SyntaxToken.create(SyntaxKind.LessThanToken),
            type,
            SyntaxToken.create(SyntaxKind.GreaterThanToken),
            expression);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCastExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CastExpression;
    }

    public isMissing(): bool {
        if (!this._lessThanToken.isMissing()) { return false; }
        if (!this._type.isMissing()) { return false; }
        if (!this._greaterThanToken.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._lessThanToken.width() > 0) { return this._lessThanToken; }
        if ((token = this._type.firstToken()) !== null) { return token; }
        if (this._greaterThanToken.width() > 0) { return this._greaterThanToken; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._greaterThanToken.width() > 0) { return this._greaterThanToken; }
        if ((token = this._type.lastToken()) !== null) { return token; }
        if (this._lessThanToken.width() > 0) { return this._lessThanToken; }
        return null;
    }

    public lessThanToken(): ISyntaxToken {
        return this._lessThanToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public greaterThanToken(): ISyntaxToken {
        return this._greaterThanToken;
    }

    public expression(): UnaryExpressionSyntax {
        return this._expression;
    }

    public update(lessThanToken: ISyntaxToken,
                  type: TypeSyntax,
                  greaterThanToken: ISyntaxToken,
                  expression: UnaryExpressionSyntax): CastExpressionSyntax {
        if (this._lessThanToken === lessThanToken && this._type === type && this._greaterThanToken === greaterThanToken && this._expression === expression) {
            return this;
        }

        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CastExpressionSyntax {
        return <CastExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CastExpressionSyntax {
        return <CastExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withLessThanToken(lessThanToken: ISyntaxToken): CastExpressionSyntax {
        return this.update(lessThanToken, this._type, this._greaterThanToken, this._expression);
    }

    public withType(type: TypeSyntax): CastExpressionSyntax {
        return this.update(this._lessThanToken, type, this._greaterThanToken, this._expression);
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): CastExpressionSyntax {
        return this.update(this._lessThanToken, this._type, greaterThanToken, this._expression);
    }

    public withExpression(expression: UnaryExpressionSyntax): CastExpressionSyntax {
        return this.update(this._lessThanToken, this._type, this._greaterThanToken, expression);
    }

    private collectTextElements(elements: string[]): void {
        this._lessThanToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
        this._greaterThanToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ObjectLiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _openBraceToken: ISyntaxToken;
    private _propertyAssignments: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                propertyAssignments: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (propertyAssignments === null) { throw Errors.argumentNull('propertyAssignments'); }
        if (openBraceToken.kind() !== SyntaxKind.OpenBraceToken) { throw Errors.argument('openBraceToken'); }
        if (closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) { throw Errors.argument('closeBraceToken'); }

        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return new ObjectLiteralExpressionSyntax(openBraceToken, SeparatedSyntaxList.empty, closeBraceToken);
    }

    public static create1(): ObjectLiteralExpressionSyntax {
        return new ObjectLiteralExpressionSyntax(
            SyntaxToken.create(SyntaxKind.OpenBraceToken),
            SeparatedSyntaxList.empty,
            SyntaxToken.create(SyntaxKind.CloseBraceToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectLiteralExpression;
    }

    public isMissing(): bool {
        if (!this._openBraceToken.isMissing()) { return false; }
        if (!this._propertyAssignments.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        if ((token = this._propertyAssignments.firstToken()) !== null) { return token; }
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._closeBraceToken.width() > 0) { return this._closeBraceToken; }
        if ((token = this._propertyAssignments.lastToken()) !== null) { return token; }
        if (this._openBraceToken.width() > 0) { return this._openBraceToken; }
        return null;
    }

    public openBraceToken(): ISyntaxToken {
        return this._openBraceToken;
    }

    public propertyAssignments(): ISeparatedSyntaxList {
        return this._propertyAssignments;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(openBraceToken: ISyntaxToken,
                  propertyAssignments: ISeparatedSyntaxList,
                  closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        if (this._openBraceToken === openBraceToken && this._propertyAssignments === propertyAssignments && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectLiteralExpressionSyntax {
        return <ObjectLiteralExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectLiteralExpressionSyntax {
        return <ObjectLiteralExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(openBraceToken, this._propertyAssignments, this._closeBraceToken);
    }

    public withPropertyAssignments(propertyAssignments: ISeparatedSyntaxList): ObjectLiteralExpressionSyntax {
        return this.update(this._openBraceToken, propertyAssignments, this._closeBraceToken);
    }

    public withPropertyAssignment(propertyAssignment: PropertyAssignmentSyntax): ObjectLiteralExpressionSyntax {
        return this.withPropertyAssignments(SeparatedSyntaxList.create([propertyAssignment]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(this._openBraceToken, this._propertyAssignments, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        this._openBraceToken.collectTextElements(elements);
        this._propertyAssignments.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._propertyAssignments.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class PropertyAssignmentSyntax extends SyntaxNode {
    constructor() {
        super();
    }

    public propertyName(): ISyntaxToken {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): PropertyAssignmentSyntax {
        return <PropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): PropertyAssignmentSyntax {
        return <PropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class SimplePropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    private _propertyName: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(propertyName: ISyntaxToken,
                colonToken: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        switch (propertyName.kind()) {
            case SyntaxKind.IdentifierNameToken:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.NumericLiteral:
                break;
            default:
                throw Errors.argument('propertyName');
        }
        if (colonToken.kind() !== SyntaxKind.ColonToken) { throw Errors.argument('colonToken'); }

        this._propertyName = propertyName;
        this._colonToken = colonToken;
        this._expression = expression;
    }

    public static create1(propertyName: ISyntaxToken,
                          expression: ExpressionSyntax): SimplePropertyAssignmentSyntax {
        return new SimplePropertyAssignmentSyntax(
            propertyName,
            SyntaxToken.create(SyntaxKind.ColonToken),
            expression);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSimplePropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimplePropertyAssignment;
    }

    public isMissing(): bool {
        if (!this._propertyName.isMissing()) { return false; }
        if (!this._colonToken.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._propertyName.width() > 0) { return this._propertyName; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if (this._propertyName.width() > 0) { return this._propertyName; }
        return null;
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(propertyName: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  expression: ExpressionSyntax): SimplePropertyAssignmentSyntax {
        if (this._propertyName === propertyName && this._colonToken === colonToken && this._expression === expression) {
            return this;
        }

        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SimplePropertyAssignmentSyntax {
        return <SimplePropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SimplePropertyAssignmentSyntax {
        return <SimplePropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withPropertyName(propertyName: ISyntaxToken): SimplePropertyAssignmentSyntax {
        return this.update(propertyName, this._colonToken, this._expression);
    }

    public withColonToken(colonToken: ISyntaxToken): SimplePropertyAssignmentSyntax {
        return this.update(this._propertyName, colonToken, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): SimplePropertyAssignmentSyntax {
        return this.update(this._propertyName, this._colonToken, expression);
    }

    private collectTextElements(elements: string[]): void {
        this._propertyName.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    constructor() {
        super();
    }

    public propertyName(): ISyntaxToken {
        throw Errors.abstract();
    }

    public openParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public closeParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public block(): BlockSyntax {
        throw Errors.abstract();
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): AccessorPropertyAssignmentSyntax {
        return <AccessorPropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): AccessorPropertyAssignmentSyntax {
        return <AccessorPropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class GetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
    private _getKeyword: ISyntaxToken;
    private _propertyName: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(getKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super();

        if (block === null) { throw Errors.argumentNull('block'); }
        if (getKeyword.keywordKind() !== SyntaxKind.GetKeyword) { throw Errors.argument('getKeyword'); }
        if (propertyName.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('propertyName'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._getKeyword = getKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public static create1(propertyName: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return new GetAccessorPropertyAssignmentSyntax(
            SyntaxToken.create(SyntaxKind.GetKeyword),
            propertyName,
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetAccessorPropertyAssignment;
    }

    public isMissing(): bool {
        if (!this._getKeyword.isMissing()) { return false; }
        if (!this._propertyName.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._getKeyword.width() > 0) { return this._getKeyword; }
        if (this._propertyName.width() > 0) { return this._propertyName; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._propertyName.width() > 0) { return this._propertyName; }
        if (this._getKeyword.width() > 0) { return this._getKeyword; }
        return null;
    }

    public getKeyword(): ISyntaxToken {
        return this._getKeyword;
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(getKeyword: ISyntaxToken,
                  propertyName: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  closeParenToken: ISyntaxToken,
                  block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
        if (this._getKeyword === getKeyword && this._propertyName === propertyName && this._openParenToken === openParenToken && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }

        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): GetAccessorPropertyAssignmentSyntax {
        return <GetAccessorPropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): GetAccessorPropertyAssignmentSyntax {
        return <GetAccessorPropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withGetKeyword(getKeyword: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(getKeyword, this._propertyName, this._openParenToken, this._closeParenToken, this._block);
    }

    public withPropertyName(propertyName: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(this._getKeyword, propertyName, this._openParenToken, this._closeParenToken, this._block);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(this._getKeyword, this._propertyName, openParenToken, this._closeParenToken, this._block);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return this.update(this._getKeyword, this._propertyName, this._openParenToken, closeParenToken, this._block);
    }

    public withBlock(block: BlockSyntax): GetAccessorPropertyAssignmentSyntax {
        return this.update(this._getKeyword, this._propertyName, this._openParenToken, this._closeParenToken, block);
    }

    private collectTextElements(elements: string[]): void {
        this._getKeyword.collectTextElements(elements);
        this._propertyName.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class SetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
    private _setKeyword: ISyntaxToken;
    private _propertyName: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _parameterName: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(setKeyword: ISyntaxToken,
                propertyName: ISyntaxToken,
                openParenToken: ISyntaxToken,
                parameterName: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super();

        if (block === null) { throw Errors.argumentNull('block'); }
        if (setKeyword.keywordKind() !== SyntaxKind.SetKeyword) { throw Errors.argument('setKeyword'); }
        if (propertyName.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('propertyName'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (parameterName.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('parameterName'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._setKeyword = setKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._parameterName = parameterName;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public static create1(propertyName: ISyntaxToken,
                          parameterName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return new SetAccessorPropertyAssignmentSyntax(
            SyntaxToken.create(SyntaxKind.SetKeyword),
            propertyName,
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            parameterName,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetAccessorPropertyAssignment;
    }

    public isMissing(): bool {
        if (!this._setKeyword.isMissing()) { return false; }
        if (!this._propertyName.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._parameterName.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._setKeyword.width() > 0) { return this._setKeyword; }
        if (this._propertyName.width() > 0) { return this._propertyName; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._parameterName.width() > 0) { return this._parameterName; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._parameterName.width() > 0) { return this._parameterName; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._propertyName.width() > 0) { return this._propertyName; }
        if (this._setKeyword.width() > 0) { return this._setKeyword; }
        return null;
    }

    public setKeyword(): ISyntaxToken {
        return this._setKeyword;
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public parameterName(): ISyntaxToken {
        return this._parameterName;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(setKeyword: ISyntaxToken,
                  propertyName: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  parameterName: ISyntaxToken,
                  closeParenToken: ISyntaxToken,
                  block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
        if (this._setKeyword === setKeyword && this._propertyName === propertyName && this._openParenToken === openParenToken && this._parameterName === parameterName && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }

        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SetAccessorPropertyAssignmentSyntax {
        return <SetAccessorPropertyAssignmentSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SetAccessorPropertyAssignmentSyntax {
        return <SetAccessorPropertyAssignmentSyntax>super.withTrailingTrivia(trivia);
    }

    public withSetKeyword(setKeyword: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(setKeyword, this._propertyName, this._openParenToken, this._parameterName, this._closeParenToken, this._block);
    }

    public withPropertyName(propertyName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this._setKeyword, propertyName, this._openParenToken, this._parameterName, this._closeParenToken, this._block);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this._setKeyword, this._propertyName, openParenToken, this._parameterName, this._closeParenToken, this._block);
    }

    public withParameterName(parameterName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this._setKeyword, this._propertyName, this._openParenToken, parameterName, this._closeParenToken, this._block);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return this.update(this._setKeyword, this._propertyName, this._openParenToken, this._parameterName, closeParenToken, this._block);
    }

    public withBlock(block: BlockSyntax): SetAccessorPropertyAssignmentSyntax {
        return this.update(this._setKeyword, this._propertyName, this._openParenToken, this._parameterName, this._closeParenToken, block);
    }

    private collectTextElements(elements: string[]): void {
        this._setKeyword.collectTextElements(elements);
        this._propertyName.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._parameterName.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class FunctionExpressionSyntax extends UnaryExpressionSyntax {
    private _functionKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _callSignature: CallSignatureSyntax;
    private _block: BlockSyntax;

    constructor(functionKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                callSignature: CallSignatureSyntax,
                block: BlockSyntax) {
        super();

        if (callSignature === null) { throw Errors.argumentNull('callSignature'); }
        if (block === null) { throw Errors.argumentNull('block'); }
        if (functionKeyword.keywordKind() !== SyntaxKind.FunctionKeyword) { throw Errors.argument('functionKeyword'); }
        if (identifier !== null) {
            if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        }

        this._functionKeyword = functionKeyword;
        this._identifier = identifier;
        this._callSignature = callSignature;
        this._block = block;
    }

    public static create(functionKeyword: ISyntaxToken,
                         callSignature: CallSignatureSyntax,
                         block: BlockSyntax): FunctionExpressionSyntax {
        return new FunctionExpressionSyntax(functionKeyword, null, callSignature, block);
    }

    public static create1(): FunctionExpressionSyntax {
        return new FunctionExpressionSyntax(
            SyntaxToken.create(SyntaxKind.FunctionKeyword),
            null,
            CallSignatureSyntax.create1(),
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionExpression;
    }

    public isMissing(): bool {
        if (!this._functionKeyword.isMissing()) { return false; }
        if (this._identifier !== null && !this._identifier.isMissing()) { return false; }
        if (!this._callSignature.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._functionKeyword.width() > 0) { return this._functionKeyword; }
        if (this._identifier !== null && this._identifier.width() > 0) { return this._identifier; }
        if ((token = this._callSignature.firstToken()) !== null) { return token; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if ((token = this._callSignature.lastToken()) !== null) { return token; }
        if (this._identifier !== null && this._identifier.width() > 0) { return this._identifier; }
        if (this._functionKeyword.width() > 0) { return this._functionKeyword; }
        return null;
    }

    public functionKeyword(): ISyntaxToken {
        return this._functionKeyword;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(functionKeyword: ISyntaxToken,
                  identifier: ISyntaxToken,
                  callSignature: CallSignatureSyntax,
                  block: BlockSyntax): FunctionExpressionSyntax {
        if (this._functionKeyword === functionKeyword && this._identifier === identifier && this._callSignature === callSignature && this._block === block) {
            return this;
        }

        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionExpressionSyntax {
        return <FunctionExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionExpressionSyntax {
        return <FunctionExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withFunctionKeyword(functionKeyword: ISyntaxToken): FunctionExpressionSyntax {
        return this.update(functionKeyword, this._identifier, this._callSignature, this._block);
    }

    public withIdentifier(identifier: ISyntaxToken): FunctionExpressionSyntax {
        return this.update(this._functionKeyword, identifier, this._callSignature, this._block);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): FunctionExpressionSyntax {
        return this.update(this._functionKeyword, this._identifier, callSignature, this._block);
    }

    public withBlock(block: BlockSyntax): FunctionExpressionSyntax {
        return this.update(this._functionKeyword, this._identifier, this._callSignature, block);
    }

    private collectTextElements(elements: string[]): void {
        this._functionKeyword.collectTextElements(elements);
        if (this._identifier !== null) { this._identifier.collectTextElements(elements); }
        this._callSignature.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._callSignature.isTypeScriptSpecific()) { return true; }
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class EmptyStatementSyntax extends StatementSyntax {
    private _semicolonToken: ISyntaxToken;

    constructor(semicolonToken: ISyntaxToken) {
        super();

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._semicolonToken = semicolonToken;
    }

    public static create1(): EmptyStatementSyntax {
        return new EmptyStatementSyntax(
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEmptyStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EmptyStatement;
    }

    public isMissing(): bool {
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    private update(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
        if (this._semicolonToken === semicolonToken) {
            return this;
        }

        return new EmptyStatementSyntax(semicolonToken);
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

    private collectTextElements(elements: string[]): void {
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}

class SuperExpressionSyntax extends UnaryExpressionSyntax {
    private _superKeyword: ISyntaxToken;

    constructor(superKeyword: ISyntaxToken) {
        super();

        if (superKeyword.keywordKind() !== SyntaxKind.SuperKeyword) { throw Errors.argument('superKeyword'); }

        this._superKeyword = superKeyword;
    }

    public static create1(): SuperExpressionSyntax {
        return new SuperExpressionSyntax(
            SyntaxToken.create(SyntaxKind.SuperKeyword));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSuperExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SuperExpression;
    }

    public isMissing(): bool {
        if (!this._superKeyword.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._superKeyword.width() > 0) { return this._superKeyword; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._superKeyword.width() > 0) { return this._superKeyword; }
        return null;
    }

    public superKeyword(): ISyntaxToken {
        return this._superKeyword;
    }

    private update(superKeyword: ISyntaxToken): SuperExpressionSyntax {
        if (this._superKeyword === superKeyword) {
            return this;
        }

        return new SuperExpressionSyntax(superKeyword);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SuperExpressionSyntax {
        return <SuperExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SuperExpressionSyntax {
        return <SuperExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withSuperKeyword(superKeyword: ISyntaxToken): SuperExpressionSyntax {
        return this.update(superKeyword);
    }

    private collectTextElements(elements: string[]): void {
        this._superKeyword.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class TryStatementSyntax extends StatementSyntax {
    private _tryKeyword: ISyntaxToken;
    private _block: BlockSyntax;
    private _catchClause: CatchClauseSyntax;
    private _finallyClause: FinallyClauseSyntax;

    constructor(tryKeyword: ISyntaxToken,
                block: BlockSyntax,
                catchClause: CatchClauseSyntax,
                finallyClause: FinallyClauseSyntax) {
        super();

        if (block === null) { throw Errors.argumentNull('block'); }
        if (tryKeyword.keywordKind() !== SyntaxKind.TryKeyword) { throw Errors.argument('tryKeyword'); }

        this._tryKeyword = tryKeyword;
        this._block = block;
        this._catchClause = catchClause;
        this._finallyClause = finallyClause;
    }

    public static create(tryKeyword: ISyntaxToken,
                         block: BlockSyntax): TryStatementSyntax {
        return new TryStatementSyntax(tryKeyword, block, null, null);
    }

    public static create1(): TryStatementSyntax {
        return new TryStatementSyntax(
            SyntaxToken.create(SyntaxKind.TryKeyword),
            BlockSyntax.create1(),
            null,
            null);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTryStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TryStatement;
    }

    public isMissing(): bool {
        if (!this._tryKeyword.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        if (this._catchClause !== null && !this._catchClause.isMissing()) { return false; }
        if (this._finallyClause !== null && !this._finallyClause.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._tryKeyword.width() > 0) { return this._tryKeyword; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        if (this._catchClause !== null && (token = this._catchClause.firstToken()) !== null) { return token; }
        if (this._finallyClause !== null && (token = this._finallyClause.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._finallyClause !== null && (token = this._finallyClause.lastToken()) !== null) { return token; }
        if (this._catchClause !== null && (token = this._catchClause.lastToken()) !== null) { return token; }
        if ((token = this._block.lastToken()) !== null) { return token; }
        if (this._tryKeyword.width() > 0) { return this._tryKeyword; }
        return null;
    }

    public tryKeyword(): ISyntaxToken {
        return this._tryKeyword;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public catchClause(): CatchClauseSyntax {
        return this._catchClause;
    }

    public finallyClause(): FinallyClauseSyntax {
        return this._finallyClause;
    }

    public update(tryKeyword: ISyntaxToken,
                  block: BlockSyntax,
                  catchClause: CatchClauseSyntax,
                  finallyClause: FinallyClauseSyntax): TryStatementSyntax {
        if (this._tryKeyword === tryKeyword && this._block === block && this._catchClause === catchClause && this._finallyClause === finallyClause) {
            return this;
        }

        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TryStatementSyntax {
        return <TryStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TryStatementSyntax {
        return <TryStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withTryKeyword(tryKeyword: ISyntaxToken): TryStatementSyntax {
        return this.update(tryKeyword, this._block, this._catchClause, this._finallyClause);
    }

    public withBlock(block: BlockSyntax): TryStatementSyntax {
        return this.update(this._tryKeyword, block, this._catchClause, this._finallyClause);
    }

    public withCatchClause(catchClause: CatchClauseSyntax): TryStatementSyntax {
        return this.update(this._tryKeyword, this._block, catchClause, this._finallyClause);
    }

    public withFinallyClause(finallyClause: FinallyClauseSyntax): TryStatementSyntax {
        return this.update(this._tryKeyword, this._block, this._catchClause, finallyClause);
    }

    private collectTextElements(elements: string[]): void {
        this._tryKeyword.collectTextElements(elements);
        this._block.collectTextElements(elements);
        if (this._catchClause !== null) { this._catchClause.collectTextElements(elements); }
        if (this._finallyClause !== null) { this._finallyClause.collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        if (this._catchClause !== null && this._catchClause.isTypeScriptSpecific()) { return true; }
        if (this._finallyClause !== null && this._finallyClause.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class CatchClauseSyntax extends SyntaxNode {
    private _catchKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _closeParenToken: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(catchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                identifier: ISyntaxToken,
                closeParenToken: ISyntaxToken,
                block: BlockSyntax) {
        super();

        if (block === null) { throw Errors.argumentNull('block'); }
        if (catchKeyword.keywordKind() !== SyntaxKind.CatchKeyword) { throw Errors.argument('catchKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }

        this._catchKeyword = catchKeyword;
        this._openParenToken = openParenToken;
        this._identifier = identifier;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public static create1(identifier: ISyntaxToken): CatchClauseSyntax {
        return new CatchClauseSyntax(
            SyntaxToken.create(SyntaxKind.CatchKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            identifier,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCatchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CatchClause;
    }

    public isMissing(): bool {
        if (!this._catchKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._identifier.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._catchKeyword.width() > 0) { return this._catchKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._catchKeyword.width() > 0) { return this._catchKeyword; }
        return null;
    }

    public catchKeyword(): ISyntaxToken {
        return this._catchKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(catchKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  identifier: ISyntaxToken,
                  closeParenToken: ISyntaxToken,
                  block: BlockSyntax): CatchClauseSyntax {
        if (this._catchKeyword === catchKeyword && this._openParenToken === openParenToken && this._identifier === identifier && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }

        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CatchClauseSyntax {
        return <CatchClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CatchClauseSyntax {
        return <CatchClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withCatchKeyword(catchKeyword: ISyntaxToken): CatchClauseSyntax {
        return this.update(catchKeyword, this._openParenToken, this._identifier, this._closeParenToken, this._block);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): CatchClauseSyntax {
        return this.update(this._catchKeyword, openParenToken, this._identifier, this._closeParenToken, this._block);
    }

    public withIdentifier(identifier: ISyntaxToken): CatchClauseSyntax {
        return this.update(this._catchKeyword, this._openParenToken, identifier, this._closeParenToken, this._block);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): CatchClauseSyntax {
        return this.update(this._catchKeyword, this._openParenToken, this._identifier, closeParenToken, this._block);
    }

    public withBlock(block: BlockSyntax): CatchClauseSyntax {
        return this.update(this._catchKeyword, this._openParenToken, this._identifier, this._closeParenToken, block);
    }

    private collectTextElements(elements: string[]): void {
        this._catchKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class FinallyClauseSyntax extends SyntaxNode {
    private _finallyKeyword: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(finallyKeyword: ISyntaxToken,
                block: BlockSyntax) {
        super();

        if (block === null) { throw Errors.argumentNull('block'); }
        if (finallyKeyword.keywordKind() !== SyntaxKind.FinallyKeyword) { throw Errors.argument('finallyKeyword'); }

        this._finallyKeyword = finallyKeyword;
        this._block = block;
    }

    public static create1(): FinallyClauseSyntax {
        return new FinallyClauseSyntax(
            SyntaxToken.create(SyntaxKind.FinallyKeyword),
            BlockSyntax.create1());
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFinallyClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FinallyClause;
    }

    public isMissing(): bool {
        if (!this._finallyKeyword.isMissing()) { return false; }
        if (!this._block.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._finallyKeyword.width() > 0) { return this._finallyKeyword; }
        if ((token = this._block.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._block.lastToken()) !== null) { return token; }
        if (this._finallyKeyword.width() > 0) { return this._finallyKeyword; }
        return null;
    }

    public finallyKeyword(): ISyntaxToken {
        return this._finallyKeyword;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(finallyKeyword: ISyntaxToken,
                  block: BlockSyntax): FinallyClauseSyntax {
        if (this._finallyKeyword === finallyKeyword && this._block === block) {
            return this;
        }

        return new FinallyClauseSyntax(finallyKeyword, block);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FinallyClauseSyntax {
        return <FinallyClauseSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FinallyClauseSyntax {
        return <FinallyClauseSyntax>super.withTrailingTrivia(trivia);
    }

    public withFinallyKeyword(finallyKeyword: ISyntaxToken): FinallyClauseSyntax {
        return this.update(finallyKeyword, this._block);
    }

    public withBlock(block: BlockSyntax): FinallyClauseSyntax {
        return this.update(this._finallyKeyword, block);
    }

    private collectTextElements(elements: string[]): void {
        this._finallyKeyword.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class LabeledStatement extends StatementSyntax {
    private _identifier: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _statement: StatementSyntax;

    constructor(identifier: ISyntaxToken,
                colonToken: ISyntaxToken,
                statement: StatementSyntax) {
        super();

        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (colonToken.kind() !== SyntaxKind.ColonToken) { throw Errors.argument('colonToken'); }

        this._identifier = identifier;
        this._colonToken = colonToken;
        this._statement = statement;
    }

    public static create1(identifier: ISyntaxToken,
                          statement: StatementSyntax): LabeledStatement {
        return new LabeledStatement(
            identifier,
            SyntaxToken.create(SyntaxKind.ColonToken),
            statement);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitLabeledStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.LabeledStatement;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        if (!this._colonToken.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._identifier.width() > 0) { return this._identifier; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._colonToken.width() > 0) { return this._colonToken; }
        if (this._identifier.width() > 0) { return this._identifier; }
        return null;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(identifier: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  statement: StatementSyntax): LabeledStatement {
        if (this._identifier === identifier && this._colonToken === colonToken && this._statement === statement) {
            return this;
        }

        return new LabeledStatement(identifier, colonToken, statement);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): LabeledStatement {
        return <LabeledStatement>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): LabeledStatement {
        return <LabeledStatement>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): LabeledStatement {
        return this.update(identifier, this._colonToken, this._statement);
    }

    public withColonToken(colonToken: ISyntaxToken): LabeledStatement {
        return this.update(this._identifier, colonToken, this._statement);
    }

    public withStatement(statement: StatementSyntax): LabeledStatement {
        return this.update(this._identifier, this._colonToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        this._identifier.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DoStatementSyntax extends IterationStatementSyntax {
    private _doKeyword: ISyntaxToken;
    private _statement: StatementSyntax;
    private _whileKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(doKeyword: ISyntaxToken,
                statement: StatementSyntax,
                whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        if (statement === null) { throw Errors.argumentNull('statement'); }
        if (condition === null) { throw Errors.argumentNull('condition'); }
        if (doKeyword.keywordKind() !== SyntaxKind.DoKeyword) { throw Errors.argument('doKeyword'); }
        if (whileKeyword.keywordKind() !== SyntaxKind.WhileKeyword) { throw Errors.argument('whileKeyword'); }
        if (openParenToken.kind() !== SyntaxKind.OpenParenToken) { throw Errors.argument('openParenToken'); }
        if (closeParenToken.kind() !== SyntaxKind.CloseParenToken) { throw Errors.argument('closeParenToken'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._doKeyword = doKeyword;
        this._statement = statement;
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._semicolonToken = semicolonToken;
    }

    public static create1(statement: StatementSyntax,
                          condition: ExpressionSyntax): DoStatementSyntax {
        return new DoStatementSyntax(
            SyntaxToken.create(SyntaxKind.DoKeyword),
            statement,
            SyntaxToken.create(SyntaxKind.WhileKeyword),
            SyntaxToken.create(SyntaxKind.OpenParenToken),
            condition,
            SyntaxToken.create(SyntaxKind.CloseParenToken),
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDoStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DoStatement;
    }

    public isMissing(): bool {
        if (!this._doKeyword.isMissing()) { return false; }
        if (!this._statement.isMissing()) { return false; }
        if (!this._whileKeyword.isMissing()) { return false; }
        if (!this._openParenToken.isMissing()) { return false; }
        if (!this._condition.isMissing()) { return false; }
        if (!this._closeParenToken.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._doKeyword.width() > 0) { return this._doKeyword; }
        if ((token = this._statement.firstToken()) !== null) { return token; }
        if (this._whileKeyword.width() > 0) { return this._whileKeyword; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if ((token = this._condition.firstToken()) !== null) { return token; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._closeParenToken.width() > 0) { return this._closeParenToken; }
        if ((token = this._condition.lastToken()) !== null) { return token; }
        if (this._openParenToken.width() > 0) { return this._openParenToken; }
        if (this._whileKeyword.width() > 0) { return this._whileKeyword; }
        if ((token = this._statement.lastToken()) !== null) { return token; }
        if (this._doKeyword.width() > 0) { return this._doKeyword; }
        return null;
    }

    public doKeyword(): ISyntaxToken {
        return this._doKeyword;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public whileKeyword(): ISyntaxToken {
        return this._whileKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): ExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(doKeyword: ISyntaxToken,
                  statement: StatementSyntax,
                  whileKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  semicolonToken: ISyntaxToken): DoStatementSyntax {
        if (this._doKeyword === doKeyword && this._statement === statement && this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DoStatementSyntax {
        return <DoStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DoStatementSyntax {
        return <DoStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withDoKeyword(doKeyword: ISyntaxToken): DoStatementSyntax {
        return this.update(doKeyword, this._statement, this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withStatement(statement: StatementSyntax): DoStatementSyntax {
        return this.update(this._doKeyword, statement, this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withWhileKeyword(whileKeyword: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, whileKeyword, this._openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withCondition(condition: ExpressionSyntax): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, this._openParenToken, condition, this._closeParenToken, this._semicolonToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, this._openParenToken, this._condition, closeParenToken, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._doKeyword.collectTextElements(elements);
        this._statement.collectTextElements(elements);
        this._whileKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statement.isTypeScriptSpecific()) { return true; }
        if (this._condition.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class TypeOfExpressionSyntax extends UnaryExpressionSyntax {
    private _typeOfKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(typeOfKeyword: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (typeOfKeyword.keywordKind() !== SyntaxKind.TypeOfKeyword) { throw Errors.argument('typeOfKeyword'); }

        this._typeOfKeyword = typeOfKeyword;
        this._expression = expression;
    }

    public static create1(expression: ExpressionSyntax): TypeOfExpressionSyntax {
        return new TypeOfExpressionSyntax(
            SyntaxToken.create(SyntaxKind.TypeOfKeyword),
            expression);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeOfExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeOfExpression;
    }

    public isMissing(): bool {
        if (!this._typeOfKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._typeOfKeyword.width() > 0) { return this._typeOfKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._typeOfKeyword.width() > 0) { return this._typeOfKeyword; }
        return null;
    }

    public typeOfKeyword(): ISyntaxToken {
        return this._typeOfKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(typeOfKeyword: ISyntaxToken,
                  expression: ExpressionSyntax): TypeOfExpressionSyntax {
        if (this._typeOfKeyword === typeOfKeyword && this._expression === expression) {
            return this;
        }

        return new TypeOfExpressionSyntax(typeOfKeyword, expression);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeOfExpressionSyntax {
        return <TypeOfExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeOfExpressionSyntax {
        return <TypeOfExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeOfKeyword(typeOfKeyword: ISyntaxToken): TypeOfExpressionSyntax {
        return this.update(typeOfKeyword, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): TypeOfExpressionSyntax {
        return this.update(this._typeOfKeyword, expression);
    }

    private collectTextElements(elements: string[]): void {
        this._typeOfKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DeleteExpressionSyntax extends UnaryExpressionSyntax {
    private _deleteKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(deleteKeyword: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (deleteKeyword.keywordKind() !== SyntaxKind.DeleteKeyword) { throw Errors.argument('deleteKeyword'); }

        this._deleteKeyword = deleteKeyword;
        this._expression = expression;
    }

    public static create1(expression: ExpressionSyntax): DeleteExpressionSyntax {
        return new DeleteExpressionSyntax(
            SyntaxToken.create(SyntaxKind.DeleteKeyword),
            expression);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDeleteExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DeleteExpression;
    }

    public isMissing(): bool {
        if (!this._deleteKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._deleteKeyword.width() > 0) { return this._deleteKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._deleteKeyword.width() > 0) { return this._deleteKeyword; }
        return null;
    }

    public deleteKeyword(): ISyntaxToken {
        return this._deleteKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(deleteKeyword: ISyntaxToken,
                  expression: ExpressionSyntax): DeleteExpressionSyntax {
        if (this._deleteKeyword === deleteKeyword && this._expression === expression) {
            return this;
        }

        return new DeleteExpressionSyntax(deleteKeyword, expression);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DeleteExpressionSyntax {
        return <DeleteExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DeleteExpressionSyntax {
        return <DeleteExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withDeleteKeyword(deleteKeyword: ISyntaxToken): DeleteExpressionSyntax {
        return this.update(deleteKeyword, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): DeleteExpressionSyntax {
        return this.update(this._deleteKeyword, expression);
    }

    private collectTextElements(elements: string[]): void {
        this._deleteKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class VoidExpressionSyntax extends UnaryExpressionSyntax {
    private _voidKeyword: ISyntaxToken;
    private _expression: ExpressionSyntax;

    constructor(voidKeyword: ISyntaxToken,
                expression: ExpressionSyntax) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (voidKeyword.keywordKind() !== SyntaxKind.VoidKeyword) { throw Errors.argument('voidKeyword'); }

        this._voidKeyword = voidKeyword;
        this._expression = expression;
    }

    public static create1(expression: ExpressionSyntax): VoidExpressionSyntax {
        return new VoidExpressionSyntax(
            SyntaxToken.create(SyntaxKind.VoidKeyword),
            expression);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVoidExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VoidExpression;
    }

    public isMissing(): bool {
        if (!this._voidKeyword.isMissing()) { return false; }
        if (!this._expression.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._voidKeyword.width() > 0) { return this._voidKeyword; }
        if ((token = this._expression.firstToken()) !== null) { return token; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if ((token = this._expression.lastToken()) !== null) { return token; }
        if (this._voidKeyword.width() > 0) { return this._voidKeyword; }
        return null;
    }

    public voidKeyword(): ISyntaxToken {
        return this._voidKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(voidKeyword: ISyntaxToken,
                  expression: ExpressionSyntax): VoidExpressionSyntax {
        if (this._voidKeyword === voidKeyword && this._expression === expression) {
            return this;
        }

        return new VoidExpressionSyntax(voidKeyword, expression);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): VoidExpressionSyntax {
        return <VoidExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): VoidExpressionSyntax {
        return <VoidExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withVoidKeyword(voidKeyword: ISyntaxToken): VoidExpressionSyntax {
        return this.update(voidKeyword, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): VoidExpressionSyntax {
        return this.update(this._voidKeyword, expression);
    }

    private collectTextElements(elements: string[]): void {
        this._voidKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }
}

class DebuggerStatementSyntax extends StatementSyntax {
    private _debuggerKeyword: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(debuggerKeyword: ISyntaxToken,
                semicolonToken: ISyntaxToken) {
        super();

        if (debuggerKeyword.keywordKind() !== SyntaxKind.DebuggerKeyword) { throw Errors.argument('debuggerKeyword'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._debuggerKeyword = debuggerKeyword;
        this._semicolonToken = semicolonToken;
    }

    public static create1(): DebuggerStatementSyntax {
        return new DebuggerStatementSyntax(
            SyntaxToken.create(SyntaxKind.DebuggerKeyword),
            SyntaxToken.create(SyntaxKind.SemicolonToken));
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDebuggerStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DebuggerStatement;
    }

    public isMissing(): bool {
        if (!this._debuggerKeyword.isMissing()) { return false; }
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public firstToken(): ISyntaxToken {
        var token = null;
        if (this._debuggerKeyword.width() > 0) { return this._debuggerKeyword; }
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        return null;
    }

    public lastToken(): ISyntaxToken {
        var token = null;
        if (this._semicolonToken.width() > 0) { return this._semicolonToken; }
        if (this._debuggerKeyword.width() > 0) { return this._debuggerKeyword; }
        return null;
    }

    public debuggerKeyword(): ISyntaxToken {
        return this._debuggerKeyword;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(debuggerKeyword: ISyntaxToken,
                  semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
        if (this._debuggerKeyword === debuggerKeyword && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): DebuggerStatementSyntax {
        return <DebuggerStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): DebuggerStatementSyntax {
        return <DebuggerStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withDebuggerKeyword(debuggerKeyword: ISyntaxToken): DebuggerStatementSyntax {
        return this.update(debuggerKeyword, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
        return this.update(this._debuggerKeyword, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        this._debuggerKeyword.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }
}