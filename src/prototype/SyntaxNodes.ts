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
        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        if (declareKeyword !== null && declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
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
        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        if (interfaceKeyword.keywordKind() !== SyntaxKind.InterfaceKeyword) { throw Errors.argument('interfaceKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._body = body;
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
        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        if (declareKeyword !== null && declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        if (moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) { throw Errors.argument('moduleKeyword'); }
        if (stringLiteral !== null && stringLiteral.kind() !== SyntaxKind.StringLiteral) { throw Errors.argument('stringLiteral'); }
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
        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        if (declareKeyword !== null && declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        if (functionKeyword.keywordKind() !== SyntaxKind.FunctionKeyword) { throw Errors.argument('functionKeyword'); }
        if (semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
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
        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
        if (declareKeyword !== null && declareKeyword.keywordKind() !== SyntaxKind.DeclareKeyword) { throw Errors.argument('declareKeyword'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
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
        if (operatorToken.kind() !== SyntaxKind.PlusPlusToken && operatorToken.kind() !== SyntaxKind.MinusMinusToken && operatorToken.kind() !== SyntaxKind.PlusToken && operatorToken.kind() !== SyntaxKind.MinusToken && operatorToken.kind() !== SyntaxKind.TildeToken && operatorToken.kind() !== SyntaxKind.ExclamationToken) { throw Errors.argument('operatorToken'); }

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
}

class LiteralExpressionSyntax extends UnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _literalToken: ISyntaxToken;

    constructor(kind: SyntaxKind,
                literalToken: ISyntaxToken) {
        super();

        if (kind === null) { throw Errors.argumentNull('kind'); }
        if (literalToken.kind() !== SyntaxKind.RegularExpressionLiteral && literalToken.kind() !== SyntaxKind.StringLiteral && literalToken.kind() !== SyntaxKind.NumericLiteral && literalToken.keywordKind() !== SyntaxKind.FalseKeyword && literalToken.keywordKind() !== SyntaxKind.TrueKeyword && literalToken.keywordKind() !== SyntaxKind.NullKeyword) { throw Errors.argument('literalToken'); }

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
}

class PredefinedTypeSyntax extends TypeSyntax {
    private _keyword: ISyntaxToken;

    constructor(keyword: ISyntaxToken) {
        super();

        if (keyword.keywordKind() !== SyntaxKind.AnyKeyword && keyword.keywordKind() !== SyntaxKind.BoolKeyword && keyword.keywordKind() !== SyntaxKind.NumberKeyword && keyword.keywordKind() !== SyntaxKind.StringKeyword && keyword.keywordKind() !== SyntaxKind.VoidKeyword) { throw Errors.argument('keyword'); }

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

        if (dotDotDotToken !== null && dotDotDotToken.kind() !== SyntaxKind.DotDotDotToken) { throw Errors.argument('dotDotDotToken'); }
        if (publicOrPrivateKeyword !== null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (questionToken !== null && questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }

        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
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
        if (operatorToken.kind() !== SyntaxKind.AsteriskToken && operatorToken.kind() !== SyntaxKind.SlashToken && operatorToken.kind() !== SyntaxKind.PercentToken && operatorToken.kind() !== SyntaxKind.PlusToken && operatorToken.kind() !== SyntaxKind.MinusToken && operatorToken.kind() !== SyntaxKind.LessThanLessThanToken && operatorToken.kind() !== SyntaxKind.GreaterThanGreaterThanToken && operatorToken.kind() !== SyntaxKind.GreaterThanGreaterThanGreaterThanToken && operatorToken.kind() !== SyntaxKind.LessThanToken && operatorToken.kind() !== SyntaxKind.GreaterThanToken && operatorToken.kind() !== SyntaxKind.LessThanEqualsToken && operatorToken.kind() !== SyntaxKind.GreaterThanEqualsToken && operatorToken.keywordKind() !== SyntaxKind.InstanceOfKeyword && operatorToken.keywordKind() !== SyntaxKind.InKeyword && operatorToken.kind() !== SyntaxKind.EqualsEqualsToken && operatorToken.kind() !== SyntaxKind.ExclamationEqualsToken && operatorToken.kind() !== SyntaxKind.EqualsEqualsEqualsToken && operatorToken.kind() !== SyntaxKind.ExclamationEqualsEqualsToken && operatorToken.kind() !== SyntaxKind.AmpersandToken && operatorToken.kind() !== SyntaxKind.CaretToken && operatorToken.kind() !== SyntaxKind.BarToken && operatorToken.kind() !== SyntaxKind.AmpersandAmpersandToken && operatorToken.kind() !== SyntaxKind.BarBarToken && operatorToken.kind() !== SyntaxKind.BarEqualsToken && operatorToken.kind() !== SyntaxKind.AmpersandEqualsToken && operatorToken.kind() !== SyntaxKind.CaretEqualsToken && operatorToken.kind() !== SyntaxKind.LessThanLessThanEqualsToken && operatorToken.kind() !== SyntaxKind.GreaterThanGreaterThanEqualsToken && operatorToken.kind() !== SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken && operatorToken.kind() !== SyntaxKind.PlusEqualsToken && operatorToken.kind() !== SyntaxKind.MinusEqualsToken && operatorToken.kind() !== SyntaxKind.AsteriskEqualsToken && operatorToken.kind() !== SyntaxKind.SlashEqualsToken && operatorToken.kind() !== SyntaxKind.PercentEqualsToken && operatorToken.kind() !== SyntaxKind.EqualsToken && operatorToken.kind() !== SyntaxKind.CommaToken) { throw Errors.argument('operatorToken'); }

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
        if (questionToken !== null && questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
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
        if (questionToken !== null && questionToken.kind() !== SyntaxKind.QuestionToken) { throw Errors.argument('questionToken'); }

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
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
        if (semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
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
        if (publicOrPrivateKeyword !== null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        if (staticKeyword !== null && staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        if (semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
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
        if (publicOrPrivateKeyword !== null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        if (staticKeyword !== null && staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
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
        if (publicOrPrivateKeyword !== null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        if (staticKeyword !== null && staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        if (setKeyword.keywordKind() !== SyntaxKind.SetKeyword) { throw Errors.argument('setKeyword'); }
        if (identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._setKeyword = setKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._block = block;
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
        if (publicOrPrivateKeyword !== null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) { throw Errors.argument('publicOrPrivateKeyword'); }
        if (staticKeyword !== null && staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) { throw Errors.argument('staticKeyword'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
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
        if (identifier !== null && identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
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
        if (identifier !== null && identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }
        if (semicolonToken.kind() !== SyntaxKind.SemicolonToken) { throw Errors.argument('semicolonToken'); }

        this._continueKeyword = continueKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
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
        if (exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) { throw Errors.argument('exportKeyword'); }
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
        if (propertyName.kind() !== SyntaxKind.IdentifierNameToken && propertyName.kind() !== SyntaxKind.StringLiteral && propertyName.kind() !== SyntaxKind.NumericLiteral) { throw Errors.argument('propertyName'); }
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
        if (identifier !== null && identifier.kind() !== SyntaxKind.IdentifierNameToken) { throw Errors.argument('identifier'); }

        this._functionKeyword = functionKeyword;
        this._identifier = identifier;
        this._callSignature = callSignature;
        this._block = block;
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
}