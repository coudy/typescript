///<reference path='References.ts' />

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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSourceUnit(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public moduleElements(): ISyntaxList {
        return this._moduleElements;
    }

    public endOfFileToken(): ISyntaxToken {
        return this._endOfFileToken;
    }

    public update(moduleElements: ISyntaxList,
                  endOfFileToken: ISyntaxToken) {
        if (this._moduleElements === moduleElements && this._endOfFileToken === endOfFileToken) {
            return this;
        }

        return new SourceUnitSyntax(moduleElements, endOfFileToken);
    }

    public withModuleElements(moduleElements: ISyntaxList): SourceUnitSyntax {
        return this.update(moduleElements, this._endOfFileToken);
    }

    public withEndOfFileToken(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return this.update(this._moduleElements, endOfFileToken);
    }

    private collectTextElements(elements: string[]) {
        this._moduleElements.collectTextElements(elements);
        this._endOfFileToken.collectTextElements(elements);
    }
}

class ModuleElementSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class ModuleReferenceSyntax extends SyntaxNode {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitExternalModuleReference(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeParenToken: ISyntaxToken) {
        if (this._moduleKeyword === moduleKeyword && this._openParenToken === openParenToken && this._stringLiteral === stringLiteral && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
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

    private collectTextElements(elements: string[]) {
        this._moduleKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._stringLiteral.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
    }
}

class ModuleNameModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleName: NameSyntax;

    constructor(moduleName: NameSyntax) {
        super();

        if (moduleName === null) { throw Errors.argumentNull('moduleName'); }

        this._moduleName = moduleName;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitModuleNameModuleReference(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitModuleNameModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleNameModuleReference;
    }

    public isMissing(): bool {
        if (!this._moduleName.isMissing()) { return false; }
        return true;
    }

    public moduleName(): NameSyntax {
        return this._moduleName;
    }

    public update(moduleName: NameSyntax) {
        if (this._moduleName === moduleName) {
            return this;
        }

        return new ModuleNameModuleReferenceSyntax(moduleName);
    }

    public withModuleName(moduleName: NameSyntax): ModuleNameModuleReferenceSyntax {
        return this.update(moduleName);
    }

    private collectTextElements(elements: string[]) {
        this._moduleName.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitImportDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._importKeyword === importKeyword && this._identifier === identifier && this._equalsToken === equalsToken && this._moduleReference === moduleReference && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._importKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._equalsToken.collectTextElements(elements);
        this._moduleReference.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitClassDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBraceToken: ISyntaxToken) {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._classKeyword === classKeyword && this._identifier === identifier && this._extendsClause === extendsClause && this._implementsClause === implementsClause && this._openBraceToken === openBraceToken && this._classElements === classElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken);
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

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitInterfaceDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  body: ObjectTypeSyntax) {
        if (this._exportKeyword === exportKeyword && this._interfaceKeyword === interfaceKeyword && this._identifier === identifier && this._extendsClause === extendsClause && this._body === body) {
            return this;
        }

        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body);
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

    private collectTextElements(elements: string[]) {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        this._interfaceKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        if (this._extendsClause !== null) { this._extendsClause.collectTextElements(elements); }
        this._body.collectTextElements(elements);
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

    public static create(extendsKeyword: ISyntaxToken): ExtendsClauseSyntax {
        return new ExtendsClauseSyntax(extendsKeyword, SeparatedSyntaxList.empty);
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitExtendsClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public extendsKeyword(): ISyntaxToken {
        return this._extendsKeyword;
    }

    public typeNames(): ISeparatedSyntaxList {
        return this._typeNames;
    }

    public update(extendsKeyword: ISyntaxToken,
                  typeNames: ISeparatedSyntaxList) {
        if (this._extendsKeyword === extendsKeyword && this._typeNames === typeNames) {
            return this;
        }

        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    }

    public withExtendsKeyword(extendsKeyword: ISyntaxToken): ExtendsClauseSyntax {
        return this.update(extendsKeyword, this._typeNames);
    }

    public withTypeNames(typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        return this.update(this._extendsKeyword, typeNames);
    }

    private collectTextElements(elements: string[]) {
        this._extendsKeyword.collectTextElements(elements);
        this._typeNames.collectTextElements(elements);
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

    public static create(implementsKeyword: ISyntaxToken): ImplementsClauseSyntax {
        return new ImplementsClauseSyntax(implementsKeyword, SeparatedSyntaxList.empty);
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitImplementsClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public implementsKeyword(): ISyntaxToken {
        return this._implementsKeyword;
    }

    public typeNames(): ISeparatedSyntaxList {
        return this._typeNames;
    }

    public update(implementsKeyword: ISyntaxToken,
                  typeNames: ISeparatedSyntaxList) {
        if (this._implementsKeyword === implementsKeyword && this._typeNames === typeNames) {
            return this;
        }

        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    }

    public withImplementsKeyword(implementsKeyword: ISyntaxToken): ImplementsClauseSyntax {
        return this.update(implementsKeyword, this._typeNames);
    }

    public withTypeNames(typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        return this.update(this._implementsKeyword, typeNames);
    }

    private collectTextElements(elements: string[]) {
        this._implementsKeyword.collectTextElements(elements);
        this._typeNames.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitModuleDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBraceToken: ISyntaxToken) {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._moduleKeyword === moduleKeyword && this._moduleName === moduleName && this._stringLiteral === stringLiteral && this._openBraceToken === openBraceToken && this._moduleElements === moduleElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken);
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

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._moduleKeyword.collectTextElements(elements);
        if (this._moduleName !== null) { this._moduleName.collectTextElements(elements); }
        if (this._stringLiteral !== null) { this._stringLiteral.collectTextElements(elements); }
        this._openBraceToken.collectTextElements(elements);
        this._moduleElements.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }
}

class StatementSyntax extends ModuleElementSyntax {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._functionKeyword === functionKeyword && this._functionSignature === functionSignature && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._functionKeyword.collectTextElements(elements);
        this._functionSignature.collectTextElements(elements);
        if (this._block !== null) { this._block.collectTextElements(elements); }
        if (this._semicolonToken !== null) { this._semicolonToken.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVariableStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._variableDeclaration === variableDeclaration && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        if (this._declareKeyword !== null) { this._declareKeyword.collectTextElements(elements); }
        this._variableDeclaration.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }
}

class ExpressionSyntax extends SyntaxNode {
    constructor() {
        super();
    }
}

class UnaryExpressionSyntax extends ExpressionSyntax {
    constructor() {
        super();
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

    public static create(varKeyword: ISyntaxToken): VariableDeclarationSyntax {
        return new VariableDeclarationSyntax(varKeyword, SeparatedSyntaxList.empty);
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVariableDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public varKeyword(): ISyntaxToken {
        return this._varKeyword;
    }

    public variableDeclarators(): ISeparatedSyntaxList {
        return this._variableDeclarators;
    }

    public update(varKeyword: ISyntaxToken,
                  variableDeclarators: ISeparatedSyntaxList) {
        if (this._varKeyword === varKeyword && this._variableDeclarators === variableDeclarators) {
            return this;
        }

        return new VariableDeclarationSyntax(varKeyword, variableDeclarators);
    }

    public withVarKeyword(varKeyword: ISyntaxToken): VariableDeclarationSyntax {
        return this.update(varKeyword, this._variableDeclarators);
    }

    public withVariableDeclarators(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        return this.update(this._varKeyword, variableDeclarators);
    }

    private collectTextElements(elements: string[]) {
        this._varKeyword.collectTextElements(elements);
        this._variableDeclarators.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVariableDeclarator(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  equalsValueClause: EqualsValueClauseSyntax) {
        if (this._identifier === identifier && this._typeAnnotation === typeAnnotation && this._equalsValueClause === equalsValueClause) {
            return this;
        }

        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
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

    private collectTextElements(elements: string[]) {
        this._identifier.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
        if (this._equalsValueClause !== null) { this._equalsValueClause.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitEqualsValueClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public equalsToken(): ISyntaxToken {
        return this._equalsToken;
    }

    public value(): ExpressionSyntax {
        return this._value;
    }

    public update(equalsToken: ISyntaxToken,
                  value: ExpressionSyntax) {
        if (this._equalsToken === equalsToken && this._value === value) {
            return this;
        }

        return new EqualsValueClauseSyntax(equalsToken, value);
    }

    public withEqualsToken(equalsToken: ISyntaxToken): EqualsValueClauseSyntax {
        return this.update(equalsToken, this._value);
    }

    public withValue(value: ExpressionSyntax): EqualsValueClauseSyntax {
        return this.update(this._equalsToken, value);
    }

    private collectTextElements(elements: string[]) {
        this._equalsToken.collectTextElements(elements);
        this._value.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPrefixUnaryExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPrefixUnaryExpression(this);
    }

    public isMissing(): bool {
        if (!this._operatorToken.isMissing()) { return false; }
        if (!this._operand.isMissing()) { return false; }
        return true;
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
                  operand: UnaryExpressionSyntax) {
        if (this._kind === kind && this._operatorToken === operatorToken && this._operand === operand) {
            return this;
        }

        return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, operatorToken, this._operand);
    }

    public withOperand(operand: UnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, this._operatorToken, operand);
    }

    private collectTextElements(elements: string[]) {
        this._operatorToken.collectTextElements(elements);
        this._operand.collectTextElements(elements);
    }
}

class ThisExpressionSyntax extends UnaryExpressionSyntax {
    private _thisKeyword: ISyntaxToken;

    constructor(thisKeyword: ISyntaxToken) {
        super();

        if (thisKeyword.keywordKind() !== SyntaxKind.ThisKeyword) { throw Errors.argument('thisKeyword'); }

        this._thisKeyword = thisKeyword;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitThisExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitThisExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThisExpression;
    }

    public isMissing(): bool {
        if (!this._thisKeyword.isMissing()) { return false; }
        return true;
    }

    public thisKeyword(): ISyntaxToken {
        return this._thisKeyword;
    }

    public update(thisKeyword: ISyntaxToken) {
        if (this._thisKeyword === thisKeyword) {
            return this;
        }

        return new ThisExpressionSyntax(thisKeyword);
    }

    public withThisKeyword(thisKeyword: ISyntaxToken): ThisExpressionSyntax {
        return this.update(thisKeyword);
    }

    private collectTextElements(elements: string[]) {
        this._thisKeyword.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitLiteralExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitLiteralExpression(this);
    }

    public isMissing(): bool {
        if (!this._literalToken.isMissing()) { return false; }
        return true;
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public literalToken(): ISyntaxToken {
        return this._literalToken;
    }

    public update(kind: SyntaxKind,
                  literalToken: ISyntaxToken) {
        if (this._kind === kind && this._literalToken === literalToken) {
            return this;
        }

        return new LiteralExpressionSyntax(kind, literalToken);
    }

    public withLiteralToken(literalToken: ISyntaxToken): LiteralExpressionSyntax {
        return this.update(this._kind, literalToken);
    }

    private collectTextElements(elements: string[]) {
        this._literalToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitArrayLiteralExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBracketToken: ISyntaxToken) {
        if (this._openBracketToken === openBracketToken && this._expressions === expressions && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(openBracketToken, this._expressions, this._closeBracketToken);
    }

    public withExpressions(expressions: ISeparatedSyntaxList): ArrayLiteralExpressionSyntax {
        return this.update(this._openBracketToken, expressions, this._closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(this._openBracketToken, this._expressions, closeBracketToken);
    }

    private collectTextElements(elements: string[]) {
        this._openBracketToken.collectTextElements(elements);
        this._expressions.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
    }
}

class OmittedExpressionSyntax extends ExpressionSyntax {
    constructor() {
        super();
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitOmittedExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitOmittedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.OmittedExpression;
    }

    public isMissing(): bool {
        return true;
    }

    public update() {
        return this;
    }

    private collectTextElements(elements: string[]) {
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParenthesizedExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeParenToken: ISyntaxToken) {
        if (this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
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

    private collectTextElements(elements: string[]) {
        this._openParenToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
    }
}

class ArrowFunctionExpressionSyntax extends UnaryExpressionSyntax {
    constructor() {
        super();
    }
}

class SimpleArrowFunctionExpression extends ArrowFunctionExpressionSyntax {
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSimpleArrowFunctionExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  body: SyntaxNode) {
        if (this._identifier === identifier && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }

        return new SimpleArrowFunctionExpression(identifier, equalsGreaterThanToken, body);
    }

    public withIdentifier(identifier: ISyntaxToken): SimpleArrowFunctionExpression {
        return this.update(identifier, this._equalsGreaterThanToken, this._body);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): SimpleArrowFunctionExpression {
        return this.update(this._identifier, equalsGreaterThanToken, this._body);
    }

    public withBody(body: SyntaxNode): SimpleArrowFunctionExpression {
        return this.update(this._identifier, this._equalsGreaterThanToken, body);
    }

    private collectTextElements(elements: string[]) {
        this._identifier.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._body.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParenthesizedArrowFunctionExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  body: SyntaxNode) {
        if (this._callSignature === callSignature && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }

        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
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

    private collectTextElements(elements: string[]) {
        this._callSignature.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._body.collectTextElements(elements);
    }
}

class TypeSyntax extends UnaryExpressionSyntax {
    constructor() {
        super();
    }
}

class NameSyntax extends TypeSyntax {
    constructor() {
        super();
    }
}

class IdentifierNameSyntax extends NameSyntax {
    private _identifier: ISyntaxToken;

    constructor(identifier: ISyntaxToken) {
        super();

        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._identifier = identifier;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitIdentifierName(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitIdentifierName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IdentifierName;
    }

    public isMissing(): bool {
        if (!this._identifier.isMissing()) { return false; }
        return true;
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public update(identifier: ISyntaxToken) {
        if (this._identifier === identifier) {
            return this;
        }

        return new IdentifierNameSyntax(identifier);
    }

    public withIdentifier(identifier: ISyntaxToken): IdentifierNameSyntax {
        return this.update(identifier);
    }

    private collectTextElements(elements: string[]) {
        this._identifier.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitQualifiedName(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  right: IdentifierNameSyntax) {
        if (this._left === left && this._dotToken === dotToken && this._right === right) {
            return this;
        }

        return new QualifiedNameSyntax(left, dotToken, right);
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

    private collectTextElements(elements: string[]) {
        this._left.collectTextElements(elements);
        this._dotToken.collectTextElements(elements);
        this._right.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConstructorType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  type: TypeSyntax) {
        if (this._newKeyword === newKeyword && this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }

        return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type);
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

    private collectTextElements(elements: string[]) {
        this._newKeyword.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  type: TypeSyntax) {
        if (this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }

        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type);
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

    private collectTextElements(elements: string[]) {
        this._parameterList.collectTextElements(elements);
        this._equalsGreaterThanToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitObjectType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBraceToken: ISyntaxToken) {
        if (this._openBraceToken === openBraceToken && this._typeMembers === typeMembers && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(openBraceToken, this._typeMembers, this._closeBraceToken);
    }

    public withTypeMembers(typeMembers: ISeparatedSyntaxList): ObjectTypeSyntax {
        return this.update(this._openBraceToken, typeMembers, this._closeBraceToken);
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(this._openBraceToken, this._typeMembers, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
        this._openBraceToken.collectTextElements(elements);
        this._typeMembers.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitArrayType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBracketToken: ISyntaxToken) {
        if (this._type === type && this._openBracketToken === openBracketToken && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
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

    private collectTextElements(elements: string[]) {
        this._type.collectTextElements(elements);
        this._openBracketToken.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPredefinedType(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPredefinedType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PredefinedType;
    }

    public isMissing(): bool {
        if (!this._keyword.isMissing()) { return false; }
        return true;
    }

    public keyword(): ISyntaxToken {
        return this._keyword;
    }

    public update(keyword: ISyntaxToken) {
        if (this._keyword === keyword) {
            return this;
        }

        return new PredefinedTypeSyntax(keyword);
    }

    public withKeyword(keyword: ISyntaxToken): PredefinedTypeSyntax {
        return this.update(keyword);
    }

    private collectTextElements(elements: string[]) {
        this._keyword.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitTypeAnnotation(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public type(): TypeSyntax {
        return this._type;
    }

    public update(colonToken: ISyntaxToken,
                  type: TypeSyntax) {
        if (this._colonToken === colonToken && this._type === type) {
            return this;
        }

        return new TypeAnnotationSyntax(colonToken, type);
    }

    public withColonToken(colonToken: ISyntaxToken): TypeAnnotationSyntax {
        return this.update(colonToken, this._type);
    }

    public withType(type: TypeSyntax): TypeAnnotationSyntax {
        return this.update(this._colonToken, type);
    }

    private collectTextElements(elements: string[]) {
        this._colonToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitBlock(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBraceToken: ISyntaxToken) {
        if (this._openBraceToken === openBraceToken && this._statements === statements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new BlockSyntax(openBraceToken, statements, closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(openBraceToken, this._statements, this._closeBraceToken);
    }

    public withStatements(statements: ISyntaxList): BlockSyntax {
        return this.update(this._openBraceToken, statements, this._closeBraceToken);
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(this._openBraceToken, this._statements, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
        this._openBraceToken.collectTextElements(elements);
        this._statements.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParameter(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  equalsValueClause: EqualsValueClauseSyntax) {
        if (this._dotDotDotToken === dotDotDotToken && this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._identifier === identifier && this._questionToken === questionToken && this._typeAnnotation === typeAnnotation && this._equalsValueClause === equalsValueClause) {
            return this;
        }

        return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause);
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

    private collectTextElements(elements: string[]) {
        if (this._dotDotDotToken !== null) { this._dotDotDotToken.collectTextElements(elements); }
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        this._identifier.collectTextElements(elements);
        if (this._questionToken !== null) { this._questionToken.collectTextElements(elements); }
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
        if (this._equalsValueClause !== null) { this._equalsValueClause.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitMemberAccessExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  identifierName: IdentifierNameSyntax) {
        if (this._expression === expression && this._dotToken === dotToken && this._identifierName === identifierName) {
            return this;
        }

        return new MemberAccessExpressionSyntax(expression, dotToken, identifierName);
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

    private collectTextElements(elements: string[]) {
        this._expression.collectTextElements(elements);
        this._dotToken.collectTextElements(elements);
        this._identifierName.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPostfixUnaryExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitPostfixUnaryExpression(this);
    }

    public isMissing(): bool {
        if (!this._operand.isMissing()) { return false; }
        if (!this._operatorToken.isMissing()) { return false; }
        return true;
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
                  operatorToken: ISyntaxToken) {
        if (this._kind === kind && this._operand === operand && this._operatorToken === operatorToken) {
            return this;
        }

        return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken);
    }

    public withOperand(operand: ExpressionSyntax): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, operand, this._operatorToken);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, this._operand, operatorToken);
    }

    private collectTextElements(elements: string[]) {
        this._operand.collectTextElements(elements);
        this._operatorToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitElementAccessExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBracketToken: ISyntaxToken) {
        if (this._expression === expression && this._openBracketToken === openBracketToken && this._argumentExpression === argumentExpression && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
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

    private collectTextElements(elements: string[]) {
        this._expression.collectTextElements(elements);
        this._openBracketToken.collectTextElements(elements);
        this._argumentExpression.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitInvocationExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }

    public update(expression: ExpressionSyntax,
                  argumentList: ArgumentListSyntax) {
        if (this._expression === expression && this._argumentList === argumentList) {
            return this;
        }

        return new InvocationExpressionSyntax(expression, argumentList);
    }

    public withExpression(expression: ExpressionSyntax): InvocationExpressionSyntax {
        return this.update(expression, this._argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        return this.update(this._expression, argumentList);
    }

    private collectTextElements(elements: string[]) {
        this._expression.collectTextElements(elements);
        this._argumentList.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitArgumentList(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeParenToken: ISyntaxToken) {
        if (this._openParenToken === openParenToken && this._arguments === _arguments && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ArgumentListSyntax(openParenToken, _arguments, closeParenToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(openParenToken, this._arguments, this._closeParenToken);
    }

    public withArguments(_arguments: ISeparatedSyntaxList): ArgumentListSyntax {
        return this.update(this._openParenToken, _arguments, this._closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(this._openParenToken, this._arguments, closeParenToken);
    }

    private collectTextElements(elements: string[]) {
        this._openParenToken.collectTextElements(elements);
        this._arguments.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitBinaryExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitBinaryExpression(this);
    }

    public isMissing(): bool {
        if (!this._left.isMissing()) { return false; }
        if (!this._operatorToken.isMissing()) { return false; }
        if (!this._right.isMissing()) { return false; }
        return true;
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
                  right: ExpressionSyntax) {
        if (this._kind === kind && this._left === left && this._operatorToken === operatorToken && this._right === right) {
            return this;
        }

        return new BinaryExpressionSyntax(kind, left, operatorToken, right);
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

    private collectTextElements(elements: string[]) {
        this._left.collectTextElements(elements);
        this._operatorToken.collectTextElements(elements);
        this._right.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConditionalExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  whenFalse: ExpressionSyntax) {
        if (this._condition === condition && this._questionToken === questionToken && this._whenTrue === whenTrue && this._colonToken === colonToken && this._whenFalse === whenFalse) {
            return this;
        }

        return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse);
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

    private collectTextElements(elements: string[]) {
        this._condition.collectTextElements(elements);
        this._questionToken.collectTextElements(elements);
        this._whenTrue.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._whenFalse.collectTextElements(elements);
    }
}

class TypeMemberSyntax extends SyntaxNode {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConstructSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  typeAnnotation: TypeAnnotationSyntax) {
        if (this._newKeyword === newKeyword && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
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

    private collectTextElements(elements: string[]) {
        this._newKeyword.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  typeAnnotation: TypeAnnotationSyntax) {
        if (this._identifier === identifier && this._questionToken === questionToken && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
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

    private collectTextElements(elements: string[]) {
        this._identifier.collectTextElements(elements);
        if (this._questionToken !== null) { this._questionToken.collectTextElements(elements); }
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitIndexSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  typeAnnotation: TypeAnnotationSyntax) {
        if (this._openBracketToken === openBracketToken && this._parameter === parameter && this._closeBracketToken === closeBracketToken && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
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

    private collectTextElements(elements: string[]) {
        this._openBracketToken.collectTextElements(elements);
        this._parameter.collectTextElements(elements);
        this._closeBracketToken.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitPropertySignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  typeAnnotation: TypeAnnotationSyntax) {
        if (this._identifier === identifier && this._questionToken === questionToken && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
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

    private collectTextElements(elements: string[]) {
        this._identifier.collectTextElements(elements);
        if (this._questionToken !== null) { this._questionToken.collectTextElements(elements); }
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitParameterList(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeParenToken: ISyntaxToken) {
        if (this._openParenToken === openParenToken && this._parameters === parameters && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(openParenToken, this._parameters, this._closeParenToken);
    }

    public withParameters(parameters: ISeparatedSyntaxList): ParameterListSyntax {
        return this.update(this._openParenToken, parameters, this._closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(this._openParenToken, this._parameters, closeParenToken);
    }

    private collectTextElements(elements: string[]) {
        this._openParenToken.collectTextElements(elements);
        this._parameters.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCallSignature(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax) {
        if (this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new CallSignatureSyntax(parameterList, typeAnnotation);
    }

    public withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return this.update(parameterList, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        return this.update(this._parameterList, typeAnnotation);
    }

    private collectTextElements(elements: string[]) {
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitElseClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public elseKeyword(): ISyntaxToken {
        return this._elseKeyword;
    }

    public statement(): StatementSyntax {
        return this._statement;
    }

    public update(elseKeyword: ISyntaxToken,
                  statement: StatementSyntax) {
        if (this._elseKeyword === elseKeyword && this._statement === statement) {
            return this;
        }

        return new ElseClauseSyntax(elseKeyword, statement);
    }

    public withElseKeyword(elseKeyword: ISyntaxToken): ElseClauseSyntax {
        return this.update(elseKeyword, this._statement);
    }

    public withStatement(statement: StatementSyntax): ElseClauseSyntax {
        return this.update(this._elseKeyword, statement);
    }

    private collectTextElements(elements: string[]) {
        this._elseKeyword.collectTextElements(elements);
        this._statement.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitIfStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  elseClause: ElseClauseSyntax) {
        if (this._ifKeyword === ifKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement && this._elseClause === elseClause) {
            return this;
        }

        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
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

    private collectTextElements(elements: string[]) {
        this._ifKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
        if (this._elseClause !== null) { this._elseClause.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitExpressionStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(expression: ExpressionSyntax,
                  semicolonToken: ISyntaxToken) {
        if (this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ExpressionStatementSyntax(expression, semicolonToken);
    }

    public withExpression(expression: ExpressionSyntax): ExpressionStatementSyntax {
        return this.update(expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        return this.update(this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]) {
        this._expression.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }
}

class ClassElementSyntax extends SyntaxNode {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitConstructorDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._constructorKeyword === constructorKeyword && this._parameterList === parameterList && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._constructorKeyword.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        if (this._block !== null) { this._block.collectTextElements(elements); }
        if (this._semicolonToken !== null) { this._semicolonToken.collectTextElements(elements); }
    }
}

class MemberDeclarationSyntax extends ClassElementSyntax {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitMemberFunctionDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._functionSignature === functionSignature && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._functionSignature.collectTextElements(elements);
        if (this._block !== null) { this._block.collectTextElements(elements); }
        if (this._semicolonToken !== null) { this._semicolonToken.collectTextElements(elements); }
    }
}

class MemberAccessorDeclarationSyntax extends MemberDeclarationSyntax {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitGetMemberAccessorDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  block: BlockSyntax) {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._getKeyword === getKeyword && this._identifier === identifier && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation && this._block === block) {
            return this;
        }

        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
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

    private collectTextElements(elements: string[]) {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._getKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        if (this._typeAnnotation !== null) { this._typeAnnotation.collectTextElements(elements); }
        this._block.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSetMemberAccessorDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  block: BlockSyntax) {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._setKeyword === setKeyword && this._identifier === identifier && this._parameterList === parameterList && this._block === block) {
            return this;
        }

        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
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

    private collectTextElements(elements: string[]) {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._setKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._parameterList.collectTextElements(elements);
        this._block.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitMemberVariableDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._variableDeclarator === variableDeclarator && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        if (this._publicOrPrivateKeyword !== null) { this._publicOrPrivateKeyword.collectTextElements(elements); }
        if (this._staticKeyword !== null) { this._staticKeyword.collectTextElements(elements); }
        this._variableDeclarator.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitThrowStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._throwKeyword === throwKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._throwKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitReturnStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._returnKeyword === returnKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._returnKeyword.collectTextElements(elements);
        if (this._expression !== null) { this._expression.collectTextElements(elements); }
        this._semicolonToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitObjectCreationExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  argumentList: ArgumentListSyntax) {
        if (this._newKeyword === newKeyword && this._expression === expression && this._argumentList === argumentList) {
            return this;
        }

        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
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

    private collectTextElements(elements: string[]) {
        this._newKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        if (this._argumentList !== null) { this._argumentList.collectTextElements(elements); }
    }
}

class SwitchStatementSyntax extends StatementSyntax {
    private _switchKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _expression: ExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _caseClauses: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(switchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                expression: ExpressionSyntax,
                closeParenToken: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                caseClauses: ISyntaxList,
                closeBraceToken: ISyntaxToken) {
        super();

        if (expression === null) { throw Errors.argumentNull('expression'); }
        if (caseClauses === null) { throw Errors.argumentNull('caseClauses'); }
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
        this._caseClauses = caseClauses;
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSwitchStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
        if (!this._caseClauses.isMissing()) { return false; }
        if (!this._closeBraceToken.isMissing()) { return false; }
        return true;
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

    public caseClauses(): ISyntaxList {
        return this._caseClauses;
    }

    public closeBraceToken(): ISyntaxToken {
        return this._closeBraceToken;
    }

    public update(switchKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  expression: ExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  caseClauses: ISyntaxList,
                  closeBraceToken: ISyntaxToken) {
        if (this._switchKeyword === switchKeyword && this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken && this._openBraceToken === openBraceToken && this._caseClauses === caseClauses && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, caseClauses, closeBraceToken);
    }

    public withSwitchKeyword(switchKeyword: ISyntaxToken): SwitchStatementSyntax {
        return this.update(switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._caseClauses, this._closeBraceToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._caseClauses, this._closeBraceToken);
    }

    public withExpression(expression: ExpressionSyntax): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, expression, this._closeParenToken, this._openBraceToken, this._caseClauses, this._closeBraceToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, closeParenToken, this._openBraceToken, this._caseClauses, this._closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, openBraceToken, this._caseClauses, this._closeBraceToken);
    }

    public withCaseClauses(caseClauses: ISyntaxList): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, caseClauses, this._closeBraceToken);
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._caseClauses, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
        this._switchKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._openBraceToken.collectTextElements(elements);
        this._caseClauses.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }
}

class SwitchClauseSyntax extends SyntaxNode {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCaseSwitchClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statements: ISyntaxList) {
        if (this._caseKeyword === caseKeyword && this._expression === expression && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }

        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
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

    private collectTextElements(elements: string[]) {
        this._caseKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._statements.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDefaultSwitchClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statements: ISyntaxList) {
        if (this._defaultKeyword === defaultKeyword && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }

        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
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

    private collectTextElements(elements: string[]) {
        this._defaultKeyword.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._statements.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitBreakStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._breakKeyword === breakKeyword && this._identifier === identifier && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._breakKeyword.collectTextElements(elements);
        if (this._identifier !== null) { this._identifier.collectTextElements(elements); }
        this._semicolonToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitContinueStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._continueKeyword === continueKeyword && this._identifier === identifier && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._continueKeyword.collectTextElements(elements);
        if (this._identifier !== null) { this._identifier.collectTextElements(elements); }
        this._semicolonToken.collectTextElements(elements);
    }
}

class IterationStatementSyntax extends StatementSyntax {
    constructor() {
        super();
    }
}

class BaseForStatementSyntax extends IterationStatementSyntax {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitForStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statement: StatementSyntax) {
        if (this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._initializer === initializer && this._firstSemicolonToken === firstSemicolonToken && this._condition === condition && this._secondSemicolonToken === secondSemicolonToken && this._incrementor === incrementor && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
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

    private collectTextElements(elements: string[]) {
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitForInStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statement: StatementSyntax) {
        if (this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._left === left && this._inKeyword === inKeyword && this._expression === expression && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement);
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

    private collectTextElements(elements: string[]) {
        this._forKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        if (this._variableDeclaration !== null) { this._variableDeclaration.collectTextElements(elements); }
        if (this._left !== null) { this._left.collectTextElements(elements); }
        this._inKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitWhileStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statement: StatementSyntax) {
        if (this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
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

    private collectTextElements(elements: string[]) {
        this._whileKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitWithStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statement: StatementSyntax) {
        if (this._withKeyword === withKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement);
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

    private collectTextElements(elements: string[]) {
        this._withKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitEnumDeclaration(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBraceToken: ISyntaxToken) {
        if (this._exportKeyword === exportKeyword && this._enumKeyword === enumKeyword && this._identifier === identifier && this._openBraceToken === openBraceToken && this._variableDeclarators === variableDeclarators && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken);
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

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, this._enumKeyword, this._identifier, this._openBraceToken, this._variableDeclarators, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
        if (this._exportKeyword !== null) { this._exportKeyword.collectTextElements(elements); }
        this._enumKeyword.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._openBraceToken.collectTextElements(elements);
        this._variableDeclarators.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCastExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  expression: UnaryExpressionSyntax) {
        if (this._lessThanToken === lessThanToken && this._type === type && this._greaterThanToken === greaterThanToken && this._expression === expression) {
            return this;
        }

        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
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

    private collectTextElements(elements: string[]) {
        this._lessThanToken.collectTextElements(elements);
        this._type.collectTextElements(elements);
        this._greaterThanToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitObjectLiteralExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  closeBraceToken: ISyntaxToken) {
        if (this._openBraceToken === openBraceToken && this._propertyAssignments === propertyAssignments && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(openBraceToken, this._propertyAssignments, this._closeBraceToken);
    }

    public withPropertyAssignments(propertyAssignments: ISeparatedSyntaxList): ObjectLiteralExpressionSyntax {
        return this.update(this._openBraceToken, propertyAssignments, this._closeBraceToken);
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(this._openBraceToken, this._propertyAssignments, closeBraceToken);
    }

    private collectTextElements(elements: string[]) {
        this._openBraceToken.collectTextElements(elements);
        this._propertyAssignments.collectTextElements(elements);
        this._closeBraceToken.collectTextElements(elements);
    }
}

class PropertyAssignmentSyntax extends SyntaxNode {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSimplePropertyAssignment(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  expression: ExpressionSyntax) {
        if (this._propertyName === propertyName && this._colonToken === colonToken && this._expression === expression) {
            return this;
        }

        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
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

    private collectTextElements(elements: string[]) {
        this._propertyName.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._expression.collectTextElements(elements);
    }
}

class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    constructor() {
        super();
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitGetAccessorPropertyAssignment(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  block: BlockSyntax) {
        if (this._getKeyword === getKeyword && this._propertyName === propertyName && this._openParenToken === openParenToken && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }

        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
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

    private collectTextElements(elements: string[]) {
        this._getKeyword.collectTextElements(elements);
        this._propertyName.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._block.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSetAccessorPropertyAssignment(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  block: BlockSyntax) {
        if (this._setKeyword === setKeyword && this._propertyName === propertyName && this._openParenToken === openParenToken && this._parameterName === parameterName && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }

        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
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

    private collectTextElements(elements: string[]) {
        this._setKeyword.collectTextElements(elements);
        this._propertyName.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._parameterName.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._block.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFunctionExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  block: BlockSyntax) {
        if (this._functionKeyword === functionKeyword && this._identifier === identifier && this._callSignature === callSignature && this._block === block) {
            return this;
        }

        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
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

    private collectTextElements(elements: string[]) {
        this._functionKeyword.collectTextElements(elements);
        if (this._identifier !== null) { this._identifier.collectTextElements(elements); }
        this._callSignature.collectTextElements(elements);
        this._block.collectTextElements(elements);
    }
}

class EmptyStatementSyntax extends StatementSyntax {
    private _semicolonToken: ISyntaxToken;

    constructor(semicolonToken: ISyntaxToken) {
        super();

        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._semicolonToken = semicolonToken;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitEmptyStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitEmptyStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EmptyStatement;
    }

    public isMissing(): bool {
        if (!this._semicolonToken.isMissing()) { return false; }
        return true;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(semicolonToken: ISyntaxToken) {
        if (this._semicolonToken === semicolonToken) {
            return this;
        }

        return new EmptyStatementSyntax(semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
        return this.update(semicolonToken);
    }

    private collectTextElements(elements: string[]) {
        this._semicolonToken.collectTextElements(elements);
    }
}

class SuperExpressionSyntax extends UnaryExpressionSyntax {
    private _superKeyword: ISyntaxToken;

    constructor(superKeyword: ISyntaxToken) {
        super();

        if (superKeyword.keywordKind() !== SyntaxKind.SuperKeyword) { throw Errors.argument('superKeyword'); }

        this._superKeyword = superKeyword;
    }

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitSuperExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
        return visitor.visitSuperExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SuperExpression;
    }

    public isMissing(): bool {
        if (!this._superKeyword.isMissing()) { return false; }
        return true;
    }

    public superKeyword(): ISyntaxToken {
        return this._superKeyword;
    }

    public update(superKeyword: ISyntaxToken) {
        if (this._superKeyword === superKeyword) {
            return this;
        }

        return new SuperExpressionSyntax(superKeyword);
    }

    public withSuperKeyword(superKeyword: ISyntaxToken): SuperExpressionSyntax {
        return this.update(superKeyword);
    }

    private collectTextElements(elements: string[]) {
        this._superKeyword.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitTryStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  finallyClause: FinallyClauseSyntax) {
        if (this._tryKeyword === tryKeyword && this._block === block && this._catchClause === catchClause && this._finallyClause === finallyClause) {
            return this;
        }

        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause);
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

    private collectTextElements(elements: string[]) {
        this._tryKeyword.collectTextElements(elements);
        this._block.collectTextElements(elements);
        if (this._catchClause !== null) { this._catchClause.collectTextElements(elements); }
        if (this._finallyClause !== null) { this._finallyClause.collectTextElements(elements); }
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitCatchClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  block: BlockSyntax) {
        if (this._catchKeyword === catchKeyword && this._openParenToken === openParenToken && this._identifier === identifier && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }

        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
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

    private collectTextElements(elements: string[]) {
        this._catchKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._identifier.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._block.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitFinallyClause(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public finallyKeyword(): ISyntaxToken {
        return this._finallyKeyword;
    }

    public block(): BlockSyntax {
        return this._block;
    }

    public update(finallyKeyword: ISyntaxToken,
                  block: BlockSyntax) {
        if (this._finallyKeyword === finallyKeyword && this._block === block) {
            return this;
        }

        return new FinallyClauseSyntax(finallyKeyword, block);
    }

    public withFinallyKeyword(finallyKeyword: ISyntaxToken): FinallyClauseSyntax {
        return this.update(finallyKeyword, this._block);
    }

    public withBlock(block: BlockSyntax): FinallyClauseSyntax {
        return this.update(this._finallyKeyword, block);
    }

    private collectTextElements(elements: string[]) {
        this._finallyKeyword.collectTextElements(elements);
        this._block.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitLabeledStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  statement: StatementSyntax) {
        if (this._identifier === identifier && this._colonToken === colonToken && this._statement === statement) {
            return this;
        }

        return new LabeledStatement(identifier, colonToken, statement);
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

    private collectTextElements(elements: string[]) {
        this._identifier.collectTextElements(elements);
        this._colonToken.collectTextElements(elements);
        this._statement.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDoStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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
                  semicolonToken: ISyntaxToken) {
        if (this._doKeyword === doKeyword && this._statement === statement && this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
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

    private collectTextElements(elements: string[]) {
        this._doKeyword.collectTextElements(elements);
        this._statement.collectTextElements(elements);
        this._whileKeyword.collectTextElements(elements);
        this._openParenToken.collectTextElements(elements);
        this._condition.collectTextElements(elements);
        this._closeParenToken.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitTypeOfExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public typeOfKeyword(): ISyntaxToken {
        return this._typeOfKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(typeOfKeyword: ISyntaxToken,
                  expression: ExpressionSyntax) {
        if (this._typeOfKeyword === typeOfKeyword && this._expression === expression) {
            return this;
        }

        return new TypeOfExpressionSyntax(typeOfKeyword, expression);
    }

    public withTypeOfKeyword(typeOfKeyword: ISyntaxToken): TypeOfExpressionSyntax {
        return this.update(typeOfKeyword, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): TypeOfExpressionSyntax {
        return this.update(this._typeOfKeyword, expression);
    }

    private collectTextElements(elements: string[]) {
        this._typeOfKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDeleteExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public deleteKeyword(): ISyntaxToken {
        return this._deleteKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(deleteKeyword: ISyntaxToken,
                  expression: ExpressionSyntax) {
        if (this._deleteKeyword === deleteKeyword && this._expression === expression) {
            return this;
        }

        return new DeleteExpressionSyntax(deleteKeyword, expression);
    }

    public withDeleteKeyword(deleteKeyword: ISyntaxToken): DeleteExpressionSyntax {
        return this.update(deleteKeyword, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): DeleteExpressionSyntax {
        return this.update(this._deleteKeyword, expression);
    }

    private collectTextElements(elements: string[]) {
        this._deleteKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitVoidExpression(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public voidKeyword(): ISyntaxToken {
        return this._voidKeyword;
    }

    public expression(): ExpressionSyntax {
        return this._expression;
    }

    public update(voidKeyword: ISyntaxToken,
                  expression: ExpressionSyntax) {
        if (this._voidKeyword === voidKeyword && this._expression === expression) {
            return this;
        }

        return new VoidExpressionSyntax(voidKeyword, expression);
    }

    public withVoidKeyword(voidKeyword: ISyntaxToken): VoidExpressionSyntax {
        return this.update(voidKeyword, this._expression);
    }

    public withExpression(expression: ExpressionSyntax): VoidExpressionSyntax {
        return this.update(this._voidKeyword, expression);
    }

    private collectTextElements(elements: string[]) {
        this._voidKeyword.collectTextElements(elements);
        this._expression.collectTextElements(elements);
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

    public accept(visitor: ISyntaxVisitor): void {
        visitor.visitDebuggerStatement(this);
    }

    public accept1(visitor: ISyntaxVisitor1): any {
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

    public debuggerKeyword(): ISyntaxToken {
        return this._debuggerKeyword;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(debuggerKeyword: ISyntaxToken,
                  semicolonToken: ISyntaxToken) {
        if (this._debuggerKeyword === debuggerKeyword && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken);
    }

    public withDebuggerKeyword(debuggerKeyword: ISyntaxToken): DebuggerStatementSyntax {
        return this.update(debuggerKeyword, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): DebuggerStatementSyntax {
        return this.update(this._debuggerKeyword, semicolonToken);
    }

    private collectTextElements(elements: string[]) {
        this._debuggerKeyword.collectTextElements(elements);
        this._semicolonToken.collectTextElements(elements);
    }
}