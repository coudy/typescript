///<reference path='SyntaxNode.ts' />
///<reference path='ISyntaxList.ts' />
///<reference path='ISeparatedSyntaxList.ts' />
///<reference path='SeparatedSyntaxList.ts' />
///<reference path='SyntaxList.ts' />
///<reference path='SyntaxToken.ts' />
///<reference path='Syntax.ts' />

class SourceUnitSyntax extends SyntaxNode {
    private _moduleElements: ISyntaxList;
    private _endOfFileToken: ISyntaxToken;

    constructor(moduleElements: ISyntaxList,
                endOfFileToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._moduleElements = moduleElements;
        this._endOfFileToken = endOfFileToken;
    }

    public static create(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return new SourceUnitSyntax(Syntax.emptyList, endOfFileToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return new SourceUnitSyntax(Syntax.emptyList, endOfFileToken, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSourceUnit(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SourceUnit;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._moduleElements;
            case 1: return this._endOfFileToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._endOfFileToken);
        this._moduleElements.insertChildrenInto(array, index);
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

        return new SourceUnitSyntax(moduleElements, endOfFileToken, /*parsedInStrictMode:*/ false);
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

    public withModuleElement(moduleElement: IModuleElementSyntax): SourceUnitSyntax {
        return this.withModuleElements(Syntax.list([moduleElement]));
    }

    public withEndOfFileToken(endOfFileToken: ISyntaxToken): SourceUnitSyntax {
        return this.update(this._moduleElements, endOfFileToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._moduleElements).collectTextElements(elements);
        (<any>this._endOfFileToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._moduleElements.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._moduleElements.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._moduleElements.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._moduleElements.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._moduleElements.hasRegularExpressionToken();

        childWidth = this._endOfFileToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._endOfFileToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._moduleElements.fullWidth();
        if (position < childWidth) { return (<any>this._moduleElements).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._endOfFileToken.fullWidth();
        if (position < childWidth) { return { token: this._endOfFileToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <SourceUnitSyntax>node;
        if (!Syntax.listStructuralEquals(this._moduleElements, other._moduleElements)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._endOfFileToken, other._endOfFileToken)) { return false; }
        return true;
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
                closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
    }

    public static create1(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax {
        return new ExternalModuleReferenceSyntax(Syntax.token(SyntaxKind.ModuleKeyword), Syntax.token(SyntaxKind.OpenParenToken), stringLiteral, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExternalModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExternalModuleReference;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._moduleKeyword;
            case 1: return this._openParenToken;
            case 2: return this._stringLiteral;
            case 3: return this._closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._stringLiteral);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._moduleKeyword);
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

        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._moduleKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._stringLiteral).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._moduleKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._moduleKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._stringLiteral.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._stringLiteral.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._moduleKeyword.fullWidth();
        if (position < childWidth) { return { token: this._moduleKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._stringLiteral.fullWidth();
        if (position < childWidth) { return { token: this._stringLiteral, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ExternalModuleReferenceSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._moduleKeyword, other._moduleKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._stringLiteral, other._stringLiteral)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        return true;
    }
}

class ModuleNameModuleReferenceSyntax extends ModuleReferenceSyntax {
    private _moduleName: INameSyntax;

    constructor(moduleName: INameSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._moduleName = moduleName;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitModuleNameModuleReference(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleNameModuleReference;
    }

    private slotCount(): number {
        return 1;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._moduleName;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._moduleName);
    }

    public moduleName(): INameSyntax {
        return this._moduleName;
    }

    private update(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax {
        if (this._moduleName === moduleName) {
            return this;
        }

        return new ModuleNameModuleReferenceSyntax(moduleName, /*parsedInStrictMode:*/ false);
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

    private collectTextElements(elements: string[]): void {
        (<any>this._moduleName).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._moduleName.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._moduleName.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._moduleName.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._moduleName.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._moduleName.fullWidth();
        if (position < childWidth) { return (<any>this._moduleName).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ModuleNameModuleReferenceSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._moduleName, other._moduleName)) { return false; }
        return true;
    }
}

class ImportDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
    private _importKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _equalsToken: ISyntaxToken;
    private _moduleReference: ModuleReferenceSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(importKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                equalsToken: ISyntaxToken,
                moduleReference: ModuleReferenceSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }

    public static create1(identifier: ISyntaxToken,
                          moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax {
        return new ImportDeclarationSyntax(Syntax.token(SyntaxKind.ImportKeyword), identifier, Syntax.token(SyntaxKind.EqualsToken), moduleReference, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitImportDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImportDeclaration;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._importKeyword;
            case 1: return this._identifier;
            case 2: return this._equalsToken;
            case 3: return this._moduleReference;
            case 4: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._moduleReference);
        array.splice(index, 0, this._equalsToken);
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._importKeyword);
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

        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._importKeyword).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._equalsToken).collectTextElements(elements);
        (<any>this._moduleReference).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._importKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._importKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._equalsToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._equalsToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._moduleReference.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._moduleReference.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._moduleReference.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._moduleReference.hasRegularExpressionToken();

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._importKeyword.fullWidth();
        if (position < childWidth) { return { token: this._importKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._equalsToken.fullWidth();
        if (position < childWidth) { return { token: this._equalsToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._moduleReference.fullWidth();
        if (position < childWidth) { return (<any>this._moduleReference).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ImportDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._importKeyword, other._importKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._equalsToken, other._equalsToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._moduleReference, other._moduleReference)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class ClassDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _classKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _typeParameterList: TypeParameterListSyntax;
    private _extendsClause: ExtendsClauseSyntax;
    private _implementsClause: ImplementsClauseSyntax;
    private _openBraceToken: ISyntaxToken;
    private _classElements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                classKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                typeParameterList: TypeParameterListSyntax,
                extendsClause: ExtendsClauseSyntax,
                implementsClause: ImplementsClauseSyntax,
                openBraceToken: ISyntaxToken,
                classElements: ISyntaxList,
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._classKeyword = classKeyword;
        this._identifier = identifier;
        this._typeParameterList = typeParameterList;
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
        return new ClassDeclarationSyntax(null, null, classKeyword, identifier, null, null, null, openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): ClassDeclarationSyntax {
        return new ClassDeclarationSyntax(null, null, Syntax.token(SyntaxKind.ClassKeyword), identifier, null, null, null, Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitClassDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ClassDeclaration;
    }

    private slotCount(): number {
        return 10;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._exportKeyword;
            case 1: return this._declareKeyword;
            case 2: return this._classKeyword;
            case 3: return this._identifier;
            case 4: return this._typeParameterList;
            case 5: return this._extendsClause;
            case 6: return this._implementsClause;
            case 7: return this._openBraceToken;
            case 8: return this._classElements;
            case 9: return this._closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._classElements.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
        if (this._implementsClause !== null) { array.splice(index, 0, this._implementsClause); }
        if (this._extendsClause !== null) { array.splice(index, 0, this._extendsClause); }
        if (this._typeParameterList !== null) { array.splice(index, 0, this._typeParameterList); }
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._classKeyword);
        if (this._declareKeyword !== null) { array.splice(index, 0, this._declareKeyword); }
        if (this._exportKeyword !== null) { array.splice(index, 0, this._exportKeyword); }
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

    public typeParameterList(): TypeParameterListSyntax {
        return this._typeParameterList;
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
                  typeParameterList: TypeParameterListSyntax,
                  extendsClause: ExtendsClauseSyntax,
                  implementsClause: ImplementsClauseSyntax,
                  openBraceToken: ISyntaxToken,
                  classElements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._classKeyword === classKeyword && this._identifier === identifier && this._typeParameterList === typeParameterList && this._extendsClause === extendsClause && this._implementsClause === implementsClause && this._openBraceToken === openBraceToken && this._classElements === classElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax {
        return <ClassDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax {
        return <ClassDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withDeclareKeyword(declareKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withClassKeyword(classKeyword: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, classKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withIdentifier(identifier: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, identifier, this._typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withExtendsClause(extendsClause: ExtendsClauseSyntax): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, extendsClause, this._implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withImplementsClause(implementsClause: ImplementsClauseSyntax): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, this._extendsClause, implementsClause, this._openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withOpenBraceToken(openBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._implementsClause, openBraceToken, this._classElements, this._closeBraceToken);
    }

    public withClassElements(classElements: ISyntaxList): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, classElements, this._closeBraceToken);
    }

    public withClassElement(classElement: IClassElementSyntax): ClassDeclarationSyntax {
        return this.withClassElements(Syntax.list([classElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ClassDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._classKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._implementsClause, this._openBraceToken, this._classElements, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { (<any>this._exportKeyword).collectTextElements(elements); }
        if (this._declareKeyword !== null) { (<any>this._declareKeyword).collectTextElements(elements); }
        (<any>this._classKeyword).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        if (this._typeParameterList !== null) { (<any>this._typeParameterList).collectTextElements(elements); }
        if (this._extendsClause !== null) { (<any>this._extendsClause).collectTextElements(elements); }
        if (this._implementsClause !== null) { (<any>this._implementsClause).collectTextElements(elements); }
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._classElements).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._exportKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._declareKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._classKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._classKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeParameterList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeParameterList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeParameterList.hasRegularExpressionToken();
        }

        if (this._extendsClause !== null) {
            childWidth = this._extendsClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._extendsClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._extendsClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._extendsClause.hasRegularExpressionToken();
        }

        if (this._implementsClause !== null) {
            childWidth = this._implementsClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._implementsClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._implementsClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._implementsClause.hasRegularExpressionToken();
        }

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._classElements.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._classElements.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._classElements.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._classElements.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            if (position < childWidth) { return { token: this._exportKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            if (position < childWidth) { return { token: this._declareKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._classKeyword.fullWidth();
        if (position < childWidth) { return { token: this._classKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            if (position < childWidth) { return (<any>this._typeParameterList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._extendsClause !== null) {
            childWidth = this._extendsClause.fullWidth();
            if (position < childWidth) { return (<any>this._extendsClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._implementsClause !== null) {
            childWidth = this._implementsClause.fullWidth();
            if (position < childWidth) { return (<any>this._implementsClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._classElements.fullWidth();
        if (position < childWidth) { return (<any>this._classElements).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ClassDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._exportKeyword, other._exportKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._declareKeyword, other._declareKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._classKeyword, other._classKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeParameterList, other._typeParameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._extendsClause, other._extendsClause)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._implementsClause, other._implementsClause)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.listStructuralEquals(this._classElements, other._classElements)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
    }
}

class InterfaceDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _interfaceKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _typeParameterList: TypeParameterListSyntax;
    private _extendsClause: ExtendsClauseSyntax;
    private _body: ObjectTypeSyntax;

    constructor(exportKeyword: ISyntaxToken,
                interfaceKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                typeParameterList: TypeParameterListSyntax,
                extendsClause: ExtendsClauseSyntax,
                body: ObjectTypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._typeParameterList = typeParameterList;
        this._extendsClause = extendsClause;
        this._body = body;
    }

    public static create(interfaceKeyword: ISyntaxToken,
                         identifier: ISyntaxToken,
                         body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        return new InterfaceDeclarationSyntax(null, interfaceKeyword, identifier, null, null, body, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): InterfaceDeclarationSyntax {
        return new InterfaceDeclarationSyntax(null, Syntax.token(SyntaxKind.InterfaceKeyword), identifier, null, null, ObjectTypeSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitInterfaceDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InterfaceDeclaration;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._exportKeyword;
            case 1: return this._interfaceKeyword;
            case 2: return this._identifier;
            case 3: return this._typeParameterList;
            case 4: return this._extendsClause;
            case 5: return this._body;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._body);
        if (this._extendsClause !== null) { array.splice(index, 0, this._extendsClause); }
        if (this._typeParameterList !== null) { array.splice(index, 0, this._typeParameterList); }
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._interfaceKeyword);
        if (this._exportKeyword !== null) { array.splice(index, 0, this._exportKeyword); }
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

    public typeParameterList(): TypeParameterListSyntax {
        return this._typeParameterList;
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
                  typeParameterList: TypeParameterListSyntax,
                  extendsClause: ExtendsClauseSyntax,
                  body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._interfaceKeyword === interfaceKeyword && this._identifier === identifier && this._typeParameterList === typeParameterList && this._extendsClause === extendsClause && this._body === body) {
            return this;
        }

        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax {
        return <InterfaceDeclarationSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax {
        return <InterfaceDeclarationSyntax>super.withTrailingTrivia(trivia);
    }

    public withExportKeyword(exportKeyword: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(exportKeyword, this._interfaceKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._body);
    }

    public withInterfaceKeyword(interfaceKeyword: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, interfaceKeyword, this._identifier, this._typeParameterList, this._extendsClause, this._body);
    }

    public withIdentifier(identifier: ISyntaxToken): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, identifier, this._typeParameterList, this._extendsClause, this._body);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, this._identifier, typeParameterList, this._extendsClause, this._body);
    }

    public withExtendsClause(extendsClause: ExtendsClauseSyntax): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, this._identifier, this._typeParameterList, extendsClause, this._body);
    }

    public withBody(body: ObjectTypeSyntax): InterfaceDeclarationSyntax {
        return this.update(this._exportKeyword, this._interfaceKeyword, this._identifier, this._typeParameterList, this._extendsClause, body);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { (<any>this._exportKeyword).collectTextElements(elements); }
        (<any>this._interfaceKeyword).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        if (this._typeParameterList !== null) { (<any>this._typeParameterList).collectTextElements(elements); }
        if (this._extendsClause !== null) { (<any>this._extendsClause).collectTextElements(elements); }
        (<any>this._body).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._exportKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._interfaceKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._interfaceKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeParameterList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeParameterList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeParameterList.hasRegularExpressionToken();
        }

        if (this._extendsClause !== null) {
            childWidth = this._extendsClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._extendsClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._extendsClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._extendsClause.hasRegularExpressionToken();
        }

        childWidth = this._body.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._body.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._body.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._body.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            if (position < childWidth) { return { token: this._exportKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._interfaceKeyword.fullWidth();
        if (position < childWidth) { return { token: this._interfaceKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            if (position < childWidth) { return (<any>this._typeParameterList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._extendsClause !== null) {
            childWidth = this._extendsClause.fullWidth();
            if (position < childWidth) { return (<any>this._extendsClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._body.fullWidth();
        if (position < childWidth) { return (<any>this._body).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <InterfaceDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._exportKeyword, other._exportKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._interfaceKeyword, other._interfaceKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeParameterList, other._typeParameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._extendsClause, other._extendsClause)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._body, other._body)) { return false; }
        return true;
    }
}

class ExtendsClauseSyntax extends SyntaxNode {
    private _extendsKeyword: ISyntaxToken;
    private _typeNames: ISeparatedSyntaxList;

    constructor(extendsKeyword: ISyntaxToken,
                typeNames: ISeparatedSyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
    }

    public static create1(typeNames: ISeparatedSyntaxList): ExtendsClauseSyntax {
        return new ExtendsClauseSyntax(Syntax.token(SyntaxKind.ExtendsKeyword), typeNames, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExtendsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExtendsClause;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._extendsKeyword;
            case 1: return this._typeNames;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        this._typeNames.insertChildrenInto(array, index);
        array.splice(index, 0, this._extendsKeyword);
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

        return new ExtendsClauseSyntax(extendsKeyword, typeNames, /*parsedInStrictMode:*/ false);
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

    public withTypeName(typeName: INameSyntax): ExtendsClauseSyntax {
        return this.withTypeNames(Syntax.separatedList([typeName]));
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._extendsKeyword).collectTextElements(elements);
        (<any>this._typeNames).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._extendsKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._extendsKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._typeNames.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeNames.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._typeNames.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._typeNames.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._extendsKeyword.fullWidth();
        if (position < childWidth) { return { token: this._extendsKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._typeNames.fullWidth();
        if (position < childWidth) { return (<any>this._typeNames).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ExtendsClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._extendsKeyword, other._extendsKeyword)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._typeNames, other._typeNames)) { return false; }
        return true;
    }
}

class ImplementsClauseSyntax extends SyntaxNode {
    private _implementsKeyword: ISyntaxToken;
    private _typeNames: ISeparatedSyntaxList;

    constructor(implementsKeyword: ISyntaxToken,
                typeNames: ISeparatedSyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
    }

    public static create1(typeNames: ISeparatedSyntaxList): ImplementsClauseSyntax {
        return new ImplementsClauseSyntax(Syntax.token(SyntaxKind.ImplementsKeyword), typeNames, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitImplementsClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ImplementsClause;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._implementsKeyword;
            case 1: return this._typeNames;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        this._typeNames.insertChildrenInto(array, index);
        array.splice(index, 0, this._implementsKeyword);
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

        return new ImplementsClauseSyntax(implementsKeyword, typeNames, /*parsedInStrictMode:*/ false);
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

    public withTypeName(typeName: INameSyntax): ImplementsClauseSyntax {
        return this.withTypeNames(Syntax.separatedList([typeName]));
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._implementsKeyword).collectTextElements(elements);
        (<any>this._typeNames).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._implementsKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._implementsKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._typeNames.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeNames.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._typeNames.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._typeNames.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._implementsKeyword.fullWidth();
        if (position < childWidth) { return { token: this._implementsKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._typeNames.fullWidth();
        if (position < childWidth) { return (<any>this._typeNames).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ImplementsClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._implementsKeyword, other._implementsKeyword)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._typeNames, other._typeNames)) { return false; }
        return true;
    }
}

class ModuleDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _moduleKeyword: ISyntaxToken;
    private _moduleName: INameSyntax;
    private _stringLiteral: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _moduleElements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                moduleKeyword: ISyntaxToken,
                moduleName: INameSyntax,
                stringLiteral: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                moduleElements: ISyntaxList,
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
        return new ModuleDeclarationSyntax(null, null, moduleKeyword, null, null, openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ModuleDeclarationSyntax {
        return new ModuleDeclarationSyntax(null, null, Syntax.token(SyntaxKind.ModuleKeyword), null, null, Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitModuleDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ModuleDeclaration;
    }

    private slotCount(): number {
        return 8;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._exportKeyword;
            case 1: return this._declareKeyword;
            case 2: return this._moduleKeyword;
            case 3: return this._moduleName;
            case 4: return this._stringLiteral;
            case 5: return this._openBraceToken;
            case 6: return this._moduleElements;
            case 7: return this._closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._moduleElements.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
        if (this._stringLiteral !== null) { array.splice(index, 0, this._stringLiteral); }
        if (this._moduleName !== null) { array.splice(index, 0, this._moduleName); }
        array.splice(index, 0, this._moduleKeyword);
        if (this._declareKeyword !== null) { array.splice(index, 0, this._declareKeyword); }
        if (this._exportKeyword !== null) { array.splice(index, 0, this._exportKeyword); }
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

    public moduleName(): INameSyntax {
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
                  moduleName: INameSyntax,
                  stringLiteral: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  moduleElements: ISyntaxList,
                  closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        if (this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._moduleKeyword === moduleKeyword && this._moduleName === moduleName && this._stringLiteral === stringLiteral && this._openBraceToken === openBraceToken && this._moduleElements === moduleElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, /*parsedInStrictMode:*/ false);
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

    public withModuleName(moduleName: INameSyntax): ModuleDeclarationSyntax {
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

    public withModuleElement(moduleElement: IModuleElementSyntax): ModuleDeclarationSyntax {
        return this.withModuleElements(Syntax.list([moduleElement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax {
        return this.update(this._exportKeyword, this._declareKeyword, this._moduleKeyword, this._moduleName, this._stringLiteral, this._openBraceToken, this._moduleElements, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { (<any>this._exportKeyword).collectTextElements(elements); }
        if (this._declareKeyword !== null) { (<any>this._declareKeyword).collectTextElements(elements); }
        (<any>this._moduleKeyword).collectTextElements(elements);
        if (this._moduleName !== null) { (<any>this._moduleName).collectTextElements(elements); }
        if (this._stringLiteral !== null) { (<any>this._stringLiteral).collectTextElements(elements); }
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._moduleElements).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._exportKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._declareKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._moduleKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._moduleKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._moduleName !== null) {
            childWidth = this._moduleName.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._moduleName.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._moduleName.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._moduleName.hasRegularExpressionToken();
        }

        if (this._stringLiteral !== null) {
            childWidth = this._stringLiteral.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._stringLiteral.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._moduleElements.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._moduleElements.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._moduleElements.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._moduleElements.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            if (position < childWidth) { return { token: this._exportKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            if (position < childWidth) { return { token: this._declareKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._moduleKeyword.fullWidth();
        if (position < childWidth) { return { token: this._moduleKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._moduleName !== null) {
            childWidth = this._moduleName.fullWidth();
            if (position < childWidth) { return (<any>this._moduleName).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._stringLiteral !== null) {
            childWidth = this._stringLiteral.fullWidth();
            if (position < childWidth) { return { token: this._stringLiteral, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._moduleElements.fullWidth();
        if (position < childWidth) { return (<any>this._moduleElements).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ModuleDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._exportKeyword, other._exportKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._declareKeyword, other._declareKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._moduleKeyword, other._moduleKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._moduleName, other._moduleName)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._stringLiteral, other._stringLiteral)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.listStructuralEquals(this._moduleElements, other._moduleElements)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
    }
}

class FunctionDeclarationSyntax extends SyntaxNode implements IStatementSyntax {
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
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public static create(functionKeyword: ISyntaxToken,
                         functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return new FunctionDeclarationSyntax(null, null, functionKeyword, functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(functionSignature: FunctionSignatureSyntax): FunctionDeclarationSyntax {
        return new FunctionDeclarationSyntax(null, null, Syntax.token(SyntaxKind.FunctionKeyword), functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionDeclaration;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._exportKeyword;
            case 1: return this._declareKeyword;
            case 2: return this._functionKeyword;
            case 3: return this._functionSignature;
            case 4: return this._block;
            case 5: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._semicolonToken !== null) { array.splice(index, 0, this._semicolonToken); }
        if (this._block !== null) { array.splice(index, 0, this._block); }
        array.splice(index, 0, this._functionSignature);
        array.splice(index, 0, this._functionKeyword);
        if (this._declareKeyword !== null) { array.splice(index, 0, this._declareKeyword); }
        if (this._exportKeyword !== null) { array.splice(index, 0, this._exportKeyword); }
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

        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ false);
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
        if (this._exportKeyword !== null) { (<any>this._exportKeyword).collectTextElements(elements); }
        if (this._declareKeyword !== null) { (<any>this._declareKeyword).collectTextElements(elements); }
        (<any>this._functionKeyword).collectTextElements(elements);
        (<any>this._functionSignature).collectTextElements(elements);
        if (this._block !== null) { (<any>this._block).collectTextElements(elements); }
        if (this._semicolonToken !== null) { (<any>this._semicolonToken).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._exportKeyword !== null) { return true; }
        if (this._declareKeyword !== null) { return true; }
        if (this._functionSignature.isTypeScriptSpecific()) { return true; }
        if (this._block !== null && this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._exportKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._declareKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._functionKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._functionKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._functionSignature.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._functionSignature.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._functionSignature.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._functionSignature.hasRegularExpressionToken();

        if (this._block !== null) {
            childWidth = this._block.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._block.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();
        }

        if (this._semicolonToken !== null) {
            childWidth = this._semicolonToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            if (position < childWidth) { return { token: this._exportKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            if (position < childWidth) { return { token: this._declareKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._functionKeyword.fullWidth();
        if (position < childWidth) { return { token: this._functionKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._functionSignature.fullWidth();
        if (position < childWidth) { return (<any>this._functionSignature).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._block !== null) {
            childWidth = this._block.fullWidth();
            if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._semicolonToken !== null) {
            childWidth = this._semicolonToken.fullWidth();
            if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <FunctionDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._exportKeyword, other._exportKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._declareKeyword, other._declareKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._functionKeyword, other._functionKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._functionSignature, other._functionSignature)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class VariableStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _exportKeyword: ISyntaxToken;
    private _declareKeyword: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(exportKeyword: ISyntaxToken,
                declareKeyword: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }

    public static create(variableDeclaration: VariableDeclarationSyntax,
                         semicolonToken: ISyntaxToken): VariableStatementSyntax {
        return new VariableStatementSyntax(null, null, variableDeclaration, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax {
        return new VariableStatementSyntax(null, null, variableDeclaration, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableStatement;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._exportKeyword;
            case 1: return this._declareKeyword;
            case 2: return this._variableDeclaration;
            case 3: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._variableDeclaration);
        if (this._declareKeyword !== null) { array.splice(index, 0, this._declareKeyword); }
        if (this._exportKeyword !== null) { array.splice(index, 0, this._exportKeyword); }
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

        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, /*parsedInStrictMode:*/ false);
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
        if (this._exportKeyword !== null) { (<any>this._exportKeyword).collectTextElements(elements); }
        if (this._declareKeyword !== null) { (<any>this._declareKeyword).collectTextElements(elements); }
        (<any>this._variableDeclaration).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._exportKeyword !== null) { return true; }
        if (this._declareKeyword !== null) { return true; }
        if (this._variableDeclaration.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._exportKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._declareKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._variableDeclaration.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._variableDeclaration.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._variableDeclaration.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._variableDeclaration.hasRegularExpressionToken();

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            if (position < childWidth) { return { token: this._exportKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._declareKeyword !== null) {
            childWidth = this._declareKeyword.fullWidth();
            if (position < childWidth) { return { token: this._declareKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._variableDeclaration.fullWidth();
        if (position < childWidth) { return (<any>this._variableDeclaration).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <VariableStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._exportKeyword, other._exportKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._declareKeyword, other._declareKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._variableDeclaration, other._variableDeclaration)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class VariableDeclarationSyntax extends SyntaxNode {
    private _varKeyword: ISyntaxToken;
    private _variableDeclarators: ISeparatedSyntaxList;

    constructor(varKeyword: ISyntaxToken,
                variableDeclarators: ISeparatedSyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
    }

    public static create1(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax {
        return new VariableDeclarationSyntax(Syntax.token(SyntaxKind.VarKeyword), variableDeclarators, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclaration;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._varKeyword;
            case 1: return this._variableDeclarators;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        this._variableDeclarators.insertChildrenInto(array, index);
        array.splice(index, 0, this._varKeyword);
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

        return new VariableDeclarationSyntax(varKeyword, variableDeclarators, /*parsedInStrictMode:*/ false);
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
        return this.withVariableDeclarators(Syntax.separatedList([variableDeclarator]));
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._varKeyword).collectTextElements(elements);
        (<any>this._variableDeclarators).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._variableDeclarators.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._varKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._varKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._variableDeclarators.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._variableDeclarators.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._variableDeclarators.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._variableDeclarators.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._varKeyword.fullWidth();
        if (position < childWidth) { return { token: this._varKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._variableDeclarators.fullWidth();
        if (position < childWidth) { return (<any>this._variableDeclarators).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <VariableDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._varKeyword, other._varKeyword)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._variableDeclarators, other._variableDeclarators)) { return false; }
        return true;
    }
}

class VariableDeclaratorSyntax extends SyntaxNode {
    private _identifier: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;
    private _equalsValueClause: EqualsValueClauseSyntax;

    constructor(identifier: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax,
                equalsValueClause: EqualsValueClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }

    public static create(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return new VariableDeclaratorSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): VariableDeclaratorSyntax {
        return new VariableDeclaratorSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVariableDeclarator(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VariableDeclarator;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._identifier;
            case 1: return this._typeAnnotation;
            case 2: return this._equalsValueClause;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._equalsValueClause !== null) { array.splice(index, 0, this._equalsValueClause); }
        if (this._typeAnnotation !== null) { array.splice(index, 0, this._typeAnnotation); }
        array.splice(index, 0, this._identifier);
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

        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ false);
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
        (<any>this._identifier).collectTextElements(elements);
        if (this._typeAnnotation !== null) { (<any>this._typeAnnotation).collectTextElements(elements); }
        if (this._equalsValueClause !== null) { (<any>this._equalsValueClause).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._typeAnnotation !== null) { return true; }
        if (this._equalsValueClause !== null && this._equalsValueClause.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeAnnotation.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeAnnotation.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeAnnotation.hasRegularExpressionToken();
        }

        if (this._equalsValueClause !== null) {
            childWidth = this._equalsValueClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._equalsValueClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._equalsValueClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._equalsValueClause.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            if (position < childWidth) { return (<any>this._typeAnnotation).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._equalsValueClause !== null) {
            childWidth = this._equalsValueClause.fullWidth();
            if (position < childWidth) { return (<any>this._equalsValueClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <VariableDeclaratorSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeAnnotation, other._typeAnnotation)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._equalsValueClause, other._equalsValueClause)) { return false; }
        return true;
    }
}

class EqualsValueClauseSyntax extends SyntaxNode {
    private _equalsToken: ISyntaxToken;
    private _value: IExpressionSyntax;

    constructor(equalsToken: ISyntaxToken,
                value: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._equalsToken = equalsToken;
        this._value = value;
    }

    public static create1(value: IExpressionSyntax): EqualsValueClauseSyntax {
        return new EqualsValueClauseSyntax(Syntax.token(SyntaxKind.EqualsToken), value, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEqualsValueClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EqualsValueClause;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._equalsToken;
            case 1: return this._value;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._value);
        array.splice(index, 0, this._equalsToken);
    }

    public equalsToken(): ISyntaxToken {
        return this._equalsToken;
    }

    public value(): IExpressionSyntax {
        return this._value;
    }

    public update(equalsToken: ISyntaxToken,
                  value: IExpressionSyntax): EqualsValueClauseSyntax {
        if (this._equalsToken === equalsToken && this._value === value) {
            return this;
        }

        return new EqualsValueClauseSyntax(equalsToken, value, /*parsedInStrictMode:*/ false);
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

    public withValue(value: IExpressionSyntax): EqualsValueClauseSyntax {
        return this.update(this._equalsToken, value);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._equalsToken).collectTextElements(elements);
        (<any>this._value).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._value.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._equalsToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._equalsToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._value.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._value.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._value.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._value.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._equalsToken.fullWidth();
        if (position < childWidth) { return { token: this._equalsToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._value.fullWidth();
        if (position < childWidth) { return (<any>this._value).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <EqualsValueClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._equalsToken, other._equalsToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._value, other._value)) { return false; }
        return true;
    }
}

class PrefixUnaryExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _operatorToken: ISyntaxToken;
    private _operand: IUnaryExpressionSyntax;

    constructor(kind: SyntaxKind,
                operatorToken: ISyntaxToken,
                operand: IUnaryExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._kind = kind;
        this._operatorToken = operatorToken;
        this._operand = operand;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPrefixUnaryExpression(this);
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._operatorToken;
            case 1: return this._operand;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._operand);
        array.splice(index, 0, this._operatorToken);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public operand(): IUnaryExpressionSyntax {
        return this._operand;
    }

    public update(kind: SyntaxKind,
                  operatorToken: ISyntaxToken,
                  operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        if (this._kind === kind && this._operatorToken === operatorToken && this._operand === operand) {
            return this;
        }

        return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, /*parsedInStrictMode:*/ false);
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

    public withOperand(operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax {
        return this.update(this._kind, this._operatorToken, operand);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._operatorToken).collectTextElements(elements);
        (<any>this._operand).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._operand.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._operatorToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._operatorToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._operand.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._operand.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._operand.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._operand.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._operatorToken.fullWidth();
        if (position < childWidth) { return { token: this._operatorToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._operand.fullWidth();
        if (position < childWidth) { return (<any>this._operand).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <PrefixUnaryExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._operatorToken, other._operatorToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._operand, other._operand)) { return false; }
        return true;
    }
}

class ArrayLiteralExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _openBracketToken: ISyntaxToken;
    private _expressions: ISeparatedSyntaxList;
    private _closeBracketToken: ISyntaxToken;

    constructor(openBracketToken: ISyntaxToken,
                expressions: ISeparatedSyntaxList,
                closeBracketToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
    }

    public static create(openBracketToken: ISyntaxToken,
                         closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return new ArrayLiteralExpressionSyntax(openBracketToken, Syntax.emptySeparatedList, closeBracketToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ArrayLiteralExpressionSyntax {
        return new ArrayLiteralExpressionSyntax(Syntax.token(SyntaxKind.OpenBracketToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBracketToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArrayLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayLiteralExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openBracketToken;
            case 1: return this._expressions;
            case 2: return this._closeBracketToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBracketToken);
        this._expressions.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBracketToken);
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

        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): ArrayLiteralExpressionSyntax {
        return this.withExpressions(Syntax.separatedList([expression]));
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax {
        return this.update(this._openBracketToken, this._expressions, closeBracketToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._openBracketToken).collectTextElements(elements);
        (<any>this._expressions).collectTextElements(elements);
        (<any>this._closeBracketToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expressions.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expressions.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expressions.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expressions.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expressions.hasRegularExpressionToken();

        childWidth = this._closeBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._openBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expressions.fullWidth();
        if (position < childWidth) { return (<any>this._expressions).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ArrayLiteralExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openBracketToken, other._openBracketToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._expressions, other._expressions)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBracketToken, other._closeBracketToken)) { return false; }
        return true;
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

    private slotCount(): number {
        return 0;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        throw Errors.invalidOperation();
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
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

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = true;
        var hasRegularExpressionToken = false;

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <OmittedExpressionSyntax>node;
        return true;
    }
}

class ParenthesizedExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _openParenToken: ISyntaxToken;
    private _expression: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                expression: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
    }

    public static create1(expression: IExpressionSyntax): ParenthesizedExpressionSyntax {
        return new ParenthesizedExpressionSyntax(Syntax.token(SyntaxKind.OpenParenToken), expression, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParenthesizedExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openParenToken;
            case 1: return this._expression;
            case 2: return this._closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._openParenToken);
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public update(openParenToken: ISyntaxToken,
                  expression: IExpressionSyntax,
                  closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        if (this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): ParenthesizedExpressionSyntax {
        return this.update(this._openParenToken, expression, this._closeParenToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax {
        return this.update(this._openParenToken, this._expression, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ParenthesizedExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        return true;
    }
}

class ArrowFunctionExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public body(): ISyntaxNodeOrToken {
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
    private _body: ISyntaxNodeOrToken;

    constructor(identifier: ISyntaxToken,
                equalsGreaterThanToken: ISyntaxToken,
                body: ISyntaxNodeOrToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._identifier = identifier;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public static create1(identifier: ISyntaxToken,
                          body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
        return new SimpleArrowFunctionExpressionSyntax(identifier, Syntax.token(SyntaxKind.EqualsGreaterThanToken), body, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSimpleArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimpleArrowFunctionExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._identifier;
            case 1: return this._equalsGreaterThanToken;
            case 2: return this._body;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._body);
        array.splice(index, 0, this._equalsGreaterThanToken);
        array.splice(index, 0, this._identifier);
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): ISyntaxNodeOrToken {
        return this._body;
    }

    public update(identifier: ISyntaxToken,
                  equalsGreaterThanToken: ISyntaxToken,
                  body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
        if (this._identifier === identifier && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }

        return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ false);
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

    public withBody(body: ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax {
        return this.update(this._identifier, this._equalsGreaterThanToken, body);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._equalsGreaterThanToken).collectTextElements(elements);
        (<any>this._body).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._equalsGreaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._equalsGreaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._body.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._body.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._body.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._body.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._equalsGreaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._equalsGreaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._body.fullWidth();
        if (position < childWidth) { return (<any>this._body).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <SimpleArrowFunctionExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._equalsGreaterThanToken, other._equalsGreaterThanToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._body, other._body)) { return false; }
        return true;
    }
}

class ParenthesizedArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
    private _callSignature: CallSignatureSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _body: ISyntaxNodeOrToken;

    constructor(callSignature: CallSignatureSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                body: ISyntaxNodeOrToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._callSignature = callSignature;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }

    public static create1(body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
        return new ParenthesizedArrowFunctionExpressionSyntax(CallSignatureSyntax.create1(), Syntax.token(SyntaxKind.EqualsGreaterThanToken), body, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParenthesizedArrowFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParenthesizedArrowFunctionExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._callSignature;
            case 1: return this._equalsGreaterThanToken;
            case 2: return this._body;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._body);
        array.splice(index, 0, this._equalsGreaterThanToken);
        array.splice(index, 0, this._callSignature);
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public body(): ISyntaxNodeOrToken {
        return this._body;
    }

    public update(callSignature: CallSignatureSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
        if (this._callSignature === callSignature && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }

        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, /*parsedInStrictMode:*/ false);
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

    public withBody(body: ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax {
        return this.update(this._callSignature, this._equalsGreaterThanToken, body);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._callSignature).collectTextElements(elements);
        (<any>this._equalsGreaterThanToken).collectTextElements(elements);
        (<any>this._body).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._callSignature.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._callSignature.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._callSignature.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._callSignature.hasRegularExpressionToken();

        childWidth = this._equalsGreaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._equalsGreaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._body.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._body.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._body.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._body.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._callSignature.fullWidth();
        if (position < childWidth) { return (<any>this._callSignature).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._equalsGreaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._equalsGreaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._body.fullWidth();
        if (position < childWidth) { return (<any>this._body).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ParenthesizedArrowFunctionExpressionSyntax>node;
        if (!Syntax.nodeStructuralEquals(this._callSignature, other._callSignature)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._equalsGreaterThanToken, other._equalsGreaterThanToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._body, other._body)) { return false; }
        return true;
    }
}

class QualifiedNameSyntax extends SyntaxNode implements INameSyntax {
    private _left: INameSyntax;
    private _dotToken: ISyntaxToken;
    private _right: ISyntaxToken;

    constructor(left: INameSyntax,
                dotToken: ISyntaxToken,
                right: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
    }

    public static create1(left: INameSyntax,
                          right: ISyntaxToken): QualifiedNameSyntax {
        return new QualifiedNameSyntax(left, Syntax.token(SyntaxKind.DotToken), right, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitQualifiedName(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.QualifiedName;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._left;
            case 1: return this._dotToken;
            case 2: return this._right;
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

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._right);
        array.splice(index, 0, this._dotToken);
        array.splice(index, 0, this._left);
    }

    public left(): INameSyntax {
        return this._left;
    }

    public dotToken(): ISyntaxToken {
        return this._dotToken;
    }

    public right(): ISyntaxToken {
        return this._right;
    }

    public update(left: INameSyntax,
                  dotToken: ISyntaxToken,
                  right: ISyntaxToken): QualifiedNameSyntax {
        if (this._left === left && this._dotToken === dotToken && this._right === right) {
            return this;
        }

        return new QualifiedNameSyntax(left, dotToken, right, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax {
        return <QualifiedNameSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax {
        return <QualifiedNameSyntax>super.withTrailingTrivia(trivia);
    }

    public withLeft(left: INameSyntax): QualifiedNameSyntax {
        return this.update(left, this._dotToken, this._right);
    }

    public withDotToken(dotToken: ISyntaxToken): QualifiedNameSyntax {
        return this.update(this._left, dotToken, this._right);
    }

    public withRight(right: ISyntaxToken): QualifiedNameSyntax {
        return this.update(this._left, this._dotToken, right);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._left).collectTextElements(elements);
        (<any>this._dotToken).collectTextElements(elements);
        (<any>this._right).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._left.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._left.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._left.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._left.hasRegularExpressionToken();

        childWidth = this._dotToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._dotToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._right.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._right.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._left.fullWidth();
        if (position < childWidth) { return (<any>this._left).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._dotToken.fullWidth();
        if (position < childWidth) { return { token: this._dotToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._right.fullWidth();
        if (position < childWidth) { return { token: this._right, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <QualifiedNameSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._left, other._left)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._dotToken, other._dotToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._right, other._right)) { return false; }
        return true;
    }
}

class TypeArgumentListSyntax extends SyntaxNode {
    private _lessThanToken: ISyntaxToken;
    private _typeArguments: ISeparatedSyntaxList;
    private _greaterThanToken: ISyntaxToken;

    constructor(lessThanToken: ISyntaxToken,
                typeArguments: ISeparatedSyntaxList,
                greaterThanToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._lessThanToken = lessThanToken;
        this._typeArguments = typeArguments;
        this._greaterThanToken = greaterThanToken;
    }

    public static create(lessThanToken: ISyntaxToken,
                         greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
        return new TypeArgumentListSyntax(lessThanToken, Syntax.emptySeparatedList, greaterThanToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): TypeArgumentListSyntax {
        return new TypeArgumentListSyntax(Syntax.token(SyntaxKind.LessThanToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.GreaterThanToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeArgumentList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeArgumentList;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._lessThanToken;
            case 1: return this._typeArguments;
            case 2: return this._greaterThanToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._greaterThanToken);
        this._typeArguments.insertChildrenInto(array, index);
        array.splice(index, 0, this._lessThanToken);
    }

    public lessThanToken(): ISyntaxToken {
        return this._lessThanToken;
    }

    public typeArguments(): ISeparatedSyntaxList {
        return this._typeArguments;
    }

    public greaterThanToken(): ISyntaxToken {
        return this._greaterThanToken;
    }

    public update(lessThanToken: ISyntaxToken,
                  typeArguments: ISeparatedSyntaxList,
                  greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
        if (this._lessThanToken === lessThanToken && this._typeArguments === typeArguments && this._greaterThanToken === greaterThanToken) {
            return this;
        }

        return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeArgumentListSyntax {
        return <TypeArgumentListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeArgumentListSyntax {
        return <TypeArgumentListSyntax>super.withTrailingTrivia(trivia);
    }

    public withLessThanToken(lessThanToken: ISyntaxToken): TypeArgumentListSyntax {
        return this.update(lessThanToken, this._typeArguments, this._greaterThanToken);
    }

    public withTypeArguments(typeArguments: ISeparatedSyntaxList): TypeArgumentListSyntax {
        return this.update(this._lessThanToken, typeArguments, this._greaterThanToken);
    }

    public withTypeArgument(typeArgument: ITypeSyntax): TypeArgumentListSyntax {
        return this.withTypeArguments(Syntax.separatedList([typeArgument]));
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): TypeArgumentListSyntax {
        return this.update(this._lessThanToken, this._typeArguments, greaterThanToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._lessThanToken).collectTextElements(elements);
        (<any>this._typeArguments).collectTextElements(elements);
        (<any>this._greaterThanToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._lessThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._lessThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._typeArguments.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeArguments.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._typeArguments.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._typeArguments.hasRegularExpressionToken();

        childWidth = this._greaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._greaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._lessThanToken.fullWidth();
        if (position < childWidth) { return { token: this._lessThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._typeArguments.fullWidth();
        if (position < childWidth) { return (<any>this._typeArguments).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._greaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._greaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <TypeArgumentListSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._lessThanToken, other._lessThanToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._typeArguments, other._typeArguments)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._greaterThanToken, other._greaterThanToken)) { return false; }
        return true;
    }
}

class ConstructorTypeSyntax extends SyntaxNode implements ITypeSyntax {
    private _newKeyword: ISyntaxToken;
    private _typeParameterList: TypeParameterListSyntax;
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: ITypeSyntax;

    constructor(newKeyword: ISyntaxToken,
                typeParameterList: TypeParameterListSyntax,
                parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._newKeyword = newKeyword;
        this._typeParameterList = typeParameterList;
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
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

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructorType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorType;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._newKeyword;
            case 1: return this._typeParameterList;
            case 2: return this._parameterList;
            case 3: return this._equalsGreaterThanToken;
            case 4: return this._type;
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

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._type);
        array.splice(index, 0, this._equalsGreaterThanToken);
        array.splice(index, 0, this._parameterList);
        if (this._typeParameterList !== null) { array.splice(index, 0, this._typeParameterList); }
        array.splice(index, 0, this._newKeyword);
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public typeParameterList(): TypeParameterListSyntax {
        return this._typeParameterList;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public type(): ITypeSyntax {
        return this._type;
    }

    public update(newKeyword: ISyntaxToken,
                  typeParameterList: TypeParameterListSyntax,
                  parameterList: ParameterListSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  type: ITypeSyntax): ConstructorTypeSyntax {
        if (this._newKeyword === newKeyword && this._typeParameterList === typeParameterList && this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }

        return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax {
        return <ConstructorTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax {
        return <ConstructorTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ConstructorTypeSyntax {
        return this.update(newKeyword, this._typeParameterList, this._parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ConstructorTypeSyntax {
        return this.update(this._newKeyword, typeParameterList, this._parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withParameterList(parameterList: ParameterListSyntax): ConstructorTypeSyntax {
        return this.update(this._newKeyword, this._typeParameterList, parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ConstructorTypeSyntax {
        return this.update(this._newKeyword, this._typeParameterList, this._parameterList, equalsGreaterThanToken, this._type);
    }

    public withType(type: ITypeSyntax): ConstructorTypeSyntax {
        return this.update(this._newKeyword, this._typeParameterList, this._parameterList, this._equalsGreaterThanToken, type);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._newKeyword).collectTextElements(elements);
        if (this._typeParameterList !== null) { (<any>this._typeParameterList).collectTextElements(elements); }
        (<any>this._parameterList).collectTextElements(elements);
        (<any>this._equalsGreaterThanToken).collectTextElements(elements);
        (<any>this._type).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._newKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._newKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeParameterList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeParameterList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeParameterList.hasRegularExpressionToken();
        }

        childWidth = this._parameterList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameterList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameterList.hasRegularExpressionToken();

        childWidth = this._equalsGreaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._equalsGreaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._type.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._type.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._type.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._type.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._newKeyword.fullWidth();
        if (position < childWidth) { return { token: this._newKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            if (position < childWidth) { return (<any>this._typeParameterList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._parameterList.fullWidth();
        if (position < childWidth) { return (<any>this._parameterList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._equalsGreaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._equalsGreaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._type.fullWidth();
        if (position < childWidth) { return (<any>this._type).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ConstructorTypeSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._newKeyword, other._newKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeParameterList, other._typeParameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameterList, other._parameterList)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._equalsGreaterThanToken, other._equalsGreaterThanToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._type, other._type)) { return false; }
        return true;
    }
}

class FunctionTypeSyntax extends SyntaxNode implements ITypeSyntax {
    private _typeParameterList: TypeParameterListSyntax;
    private _parameterList: ParameterListSyntax;
    private _equalsGreaterThanToken: ISyntaxToken;
    private _type: ITypeSyntax;

    constructor(typeParameterList: TypeParameterListSyntax,
                parameterList: ParameterListSyntax,
                equalsGreaterThanToken: ISyntaxToken,
                type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._typeParameterList = typeParameterList;
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }

    public static create(parameterList: ParameterListSyntax,
                         equalsGreaterThanToken: ISyntaxToken,
                         type: ITypeSyntax): FunctionTypeSyntax {
        return new FunctionTypeSyntax(null, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
    }

    public static create1(type: ITypeSyntax): FunctionTypeSyntax {
        return new FunctionTypeSyntax(null, ParameterListSyntax.create1(), Syntax.token(SyntaxKind.EqualsGreaterThanToken), type, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionType;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._typeParameterList;
            case 1: return this._parameterList;
            case 2: return this._equalsGreaterThanToken;
            case 3: return this._type;
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

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._type);
        array.splice(index, 0, this._equalsGreaterThanToken);
        array.splice(index, 0, this._parameterList);
        if (this._typeParameterList !== null) { array.splice(index, 0, this._typeParameterList); }
    }

    public typeParameterList(): TypeParameterListSyntax {
        return this._typeParameterList;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public equalsGreaterThanToken(): ISyntaxToken {
        return this._equalsGreaterThanToken;
    }

    public type(): ITypeSyntax {
        return this._type;
    }

    public update(typeParameterList: TypeParameterListSyntax,
                  parameterList: ParameterListSyntax,
                  equalsGreaterThanToken: ISyntaxToken,
                  type: ITypeSyntax): FunctionTypeSyntax {
        if (this._typeParameterList === typeParameterList && this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }

        return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax {
        return <FunctionTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax {
        return <FunctionTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): FunctionTypeSyntax {
        return this.update(typeParameterList, this._parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withParameterList(parameterList: ParameterListSyntax): FunctionTypeSyntax {
        return this.update(this._typeParameterList, parameterList, this._equalsGreaterThanToken, this._type);
    }

    public withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): FunctionTypeSyntax {
        return this.update(this._typeParameterList, this._parameterList, equalsGreaterThanToken, this._type);
    }

    public withType(type: ITypeSyntax): FunctionTypeSyntax {
        return this.update(this._typeParameterList, this._parameterList, this._equalsGreaterThanToken, type);
    }

    private collectTextElements(elements: string[]): void {
        if (this._typeParameterList !== null) { (<any>this._typeParameterList).collectTextElements(elements); }
        (<any>this._parameterList).collectTextElements(elements);
        (<any>this._equalsGreaterThanToken).collectTextElements(elements);
        (<any>this._type).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeParameterList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeParameterList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeParameterList.hasRegularExpressionToken();
        }

        childWidth = this._parameterList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameterList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameterList.hasRegularExpressionToken();

        childWidth = this._equalsGreaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._equalsGreaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._type.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._type.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._type.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._type.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            if (position < childWidth) { return (<any>this._typeParameterList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._parameterList.fullWidth();
        if (position < childWidth) { return (<any>this._parameterList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._equalsGreaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._equalsGreaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._type.fullWidth();
        if (position < childWidth) { return (<any>this._type).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <FunctionTypeSyntax>node;
        if (!Syntax.nodeStructuralEquals(this._typeParameterList, other._typeParameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameterList, other._parameterList)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._equalsGreaterThanToken, other._equalsGreaterThanToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._type, other._type)) { return false; }
        return true;
    }
}

class ObjectTypeSyntax extends SyntaxNode implements ITypeSyntax {
    private _openBraceToken: ISyntaxToken;
    private _typeMembers: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                typeMembers: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return new ObjectTypeSyntax(openBraceToken, Syntax.emptySeparatedList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ObjectTypeSyntax {
        return new ObjectTypeSyntax(Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectType;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openBraceToken;
            case 1: return this._typeMembers;
            case 2: return this._closeBraceToken;
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

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._typeMembers.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
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

        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, /*parsedInStrictMode:*/ false);
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
        return this.withTypeMembers(Syntax.separatedList([typeMember]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectTypeSyntax {
        return this.update(this._openBraceToken, this._typeMembers, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._typeMembers).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._typeMembers.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeMembers.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._typeMembers.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._typeMembers.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._typeMembers.fullWidth();
        if (position < childWidth) { return (<any>this._typeMembers).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ObjectTypeSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._typeMembers, other._typeMembers)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
    }
}

class ArrayTypeSyntax extends SyntaxNode implements ITypeSyntax {
    private _type: ITypeSyntax;
    private _openBracketToken: ISyntaxToken;
    private _closeBracketToken: ISyntaxToken;

    constructor(type: ITypeSyntax,
                openBracketToken: ISyntaxToken,
                closeBracketToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
    }

    public static create1(type: ITypeSyntax): ArrayTypeSyntax {
        return new ArrayTypeSyntax(type, Syntax.token(SyntaxKind.OpenBracketToken), Syntax.token(SyntaxKind.CloseBracketToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArrayType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArrayType;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._type;
            case 1: return this._openBracketToken;
            case 2: return this._closeBracketToken;
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

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBracketToken);
        array.splice(index, 0, this._openBracketToken);
        array.splice(index, 0, this._type);
    }

    public type(): ITypeSyntax {
        return this._type;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public update(type: ITypeSyntax,
                  openBracketToken: ISyntaxToken,
                  closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
        if (this._type === type && this._openBracketToken === openBracketToken && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax {
        return <ArrayTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax {
        return <ArrayTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withType(type: ITypeSyntax): ArrayTypeSyntax {
        return this.update(type, this._openBracketToken, this._closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayTypeSyntax {
        return this.update(this._type, openBracketToken, this._closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayTypeSyntax {
        return this.update(this._type, this._openBracketToken, closeBracketToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._type).collectTextElements(elements);
        (<any>this._openBracketToken).collectTextElements(elements);
        (<any>this._closeBracketToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._type.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._type.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._type.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._type.hasRegularExpressionToken();

        childWidth = this._openBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._closeBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._type.fullWidth();
        if (position < childWidth) { return (<any>this._type).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._openBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ArrayTypeSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._type, other._type)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openBracketToken, other._openBracketToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBracketToken, other._closeBracketToken)) { return false; }
        return true;
    }
}

class GenericTypeSyntax extends SyntaxNode implements ITypeSyntax {
    private _name: INameSyntax;
    private _typeArgumentList: TypeArgumentListSyntax;

    constructor(name: INameSyntax,
                typeArgumentList: TypeArgumentListSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._name = name;
        this._typeArgumentList = typeArgumentList;
    }

    public static create1(name: INameSyntax): GenericTypeSyntax {
        return new GenericTypeSyntax(name, TypeArgumentListSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGenericType(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GenericType;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._name;
            case 1: return this._typeArgumentList;
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

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._typeArgumentList);
        array.splice(index, 0, this._name);
    }

    public name(): INameSyntax {
        return this._name;
    }

    public typeArgumentList(): TypeArgumentListSyntax {
        return this._typeArgumentList;
    }

    public update(name: INameSyntax,
                  typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax {
        if (this._name === name && this._typeArgumentList === typeArgumentList) {
            return this;
        }

        return new GenericTypeSyntax(name, typeArgumentList, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): GenericTypeSyntax {
        return <GenericTypeSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): GenericTypeSyntax {
        return <GenericTypeSyntax>super.withTrailingTrivia(trivia);
    }

    public withName(name: INameSyntax): GenericTypeSyntax {
        return this.update(name, this._typeArgumentList);
    }

    public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax {
        return this.update(this._name, typeArgumentList);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._name).collectTextElements(elements);
        (<any>this._typeArgumentList).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._name.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._name.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._name.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._name.hasRegularExpressionToken();

        childWidth = this._typeArgumentList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeArgumentList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._typeArgumentList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._typeArgumentList.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._name.fullWidth();
        if (position < childWidth) { return (<any>this._name).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._typeArgumentList.fullWidth();
        if (position < childWidth) { return (<any>this._typeArgumentList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <GenericTypeSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._name, other._name)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeArgumentList, other._typeArgumentList)) { return false; }
        return true;
    }
}

class TypeAnnotationSyntax extends SyntaxNode {
    private _colonToken: ISyntaxToken;
    private _type: ITypeSyntax;

    constructor(colonToken: ISyntaxToken,
                type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._colonToken = colonToken;
        this._type = type;
    }

    public static create1(type: ITypeSyntax): TypeAnnotationSyntax {
        return new TypeAnnotationSyntax(Syntax.token(SyntaxKind.ColonToken), type, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeAnnotation(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeAnnotation;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._colonToken;
            case 1: return this._type;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._type);
        array.splice(index, 0, this._colonToken);
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public type(): ITypeSyntax {
        return this._type;
    }

    public update(colonToken: ISyntaxToken,
                  type: ITypeSyntax): TypeAnnotationSyntax {
        if (this._colonToken === colonToken && this._type === type) {
            return this;
        }

        return new TypeAnnotationSyntax(colonToken, type, /*parsedInStrictMode:*/ false);
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

    public withType(type: ITypeSyntax): TypeAnnotationSyntax {
        return this.update(this._colonToken, type);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._colonToken).collectTextElements(elements);
        (<any>this._type).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._colonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._colonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._type.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._type.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._type.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._type.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._colonToken.fullWidth();
        if (position < childWidth) { return { token: this._colonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._type.fullWidth();
        if (position < childWidth) { return (<any>this._type).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <TypeAnnotationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._colonToken, other._colonToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._type, other._type)) { return false; }
        return true;
    }
}

class BlockSyntax extends SyntaxNode implements IStatementSyntax {
    private _openBraceToken: ISyntaxToken;
    private _statements: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                statements: ISyntaxList,
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openBraceToken = openBraceToken;
        this._statements = statements;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): BlockSyntax {
        return new BlockSyntax(openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): BlockSyntax {
        return new BlockSyntax(Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBlock(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Block;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openBraceToken;
            case 1: return this._statements;
            case 2: return this._closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._statements.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
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

        return new BlockSyntax(openBraceToken, statements, closeBraceToken, /*parsedInStrictMode:*/ false);
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

    public withStatement(statement: IStatementSyntax): BlockSyntax {
        return this.withStatements(Syntax.list([statement]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): BlockSyntax {
        return this.update(this._openBraceToken, this._statements, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._statements).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statements.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statements.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statements.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statements.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statements.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statements.fullWidth();
        if (position < childWidth) { return (<any>this._statements).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <BlockSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.listStructuralEquals(this._statements, other._statements)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
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
                equalsValueClause: EqualsValueClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }

    public static create(identifier: ISyntaxToken): ParameterSyntax {
        return new ParameterSyntax(null, null, identifier, null, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): ParameterSyntax {
        return new ParameterSyntax(null, null, identifier, null, null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParameter(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Parameter;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._dotDotDotToken;
            case 1: return this._publicOrPrivateKeyword;
            case 2: return this._identifier;
            case 3: return this._questionToken;
            case 4: return this._typeAnnotation;
            case 5: return this._equalsValueClause;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._equalsValueClause !== null) { array.splice(index, 0, this._equalsValueClause); }
        if (this._typeAnnotation !== null) { array.splice(index, 0, this._typeAnnotation); }
        if (this._questionToken !== null) { array.splice(index, 0, this._questionToken); }
        array.splice(index, 0, this._identifier);
        if (this._publicOrPrivateKeyword !== null) { array.splice(index, 0, this._publicOrPrivateKeyword); }
        if (this._dotDotDotToken !== null) { array.splice(index, 0, this._dotDotDotToken); }
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

        return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, /*parsedInStrictMode:*/ false);
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
        if (this._dotDotDotToken !== null) { (<any>this._dotDotDotToken).collectTextElements(elements); }
        if (this._publicOrPrivateKeyword !== null) { (<any>this._publicOrPrivateKeyword).collectTextElements(elements); }
        (<any>this._identifier).collectTextElements(elements);
        if (this._questionToken !== null) { (<any>this._questionToken).collectTextElements(elements); }
        if (this._typeAnnotation !== null) { (<any>this._typeAnnotation).collectTextElements(elements); }
        if (this._equalsValueClause !== null) { (<any>this._equalsValueClause).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._dotDotDotToken !== null) { return true; }
        if (this._publicOrPrivateKeyword !== null) { return true; }
        if (this._questionToken !== null) { return true; }
        if (this._typeAnnotation !== null) { return true; }
        if (this._equalsValueClause !== null) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._dotDotDotToken !== null) {
            childWidth = this._dotDotDotToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._dotDotDotToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._publicOrPrivateKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._questionToken !== null) {
            childWidth = this._questionToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._questionToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeAnnotation.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeAnnotation.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeAnnotation.hasRegularExpressionToken();
        }

        if (this._equalsValueClause !== null) {
            childWidth = this._equalsValueClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._equalsValueClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._equalsValueClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._equalsValueClause.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._dotDotDotToken !== null) {
            childWidth = this._dotDotDotToken.fullWidth();
            if (position < childWidth) { return { token: this._dotDotDotToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            if (position < childWidth) { return { token: this._publicOrPrivateKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._questionToken !== null) {
            childWidth = this._questionToken.fullWidth();
            if (position < childWidth) { return { token: this._questionToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            if (position < childWidth) { return (<any>this._typeAnnotation).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._equalsValueClause !== null) {
            childWidth = this._equalsValueClause.fullWidth();
            if (position < childWidth) { return (<any>this._equalsValueClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ParameterSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._dotDotDotToken, other._dotDotDotToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._publicOrPrivateKeyword, other._publicOrPrivateKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._questionToken, other._questionToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeAnnotation, other._typeAnnotation)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._equalsValueClause, other._equalsValueClause)) { return false; }
        return true;
    }
}

class MemberAccessExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _expression: IExpressionSyntax;
    private _dotToken: ISyntaxToken;
    private _name: ISyntaxToken;

    constructor(expression: IExpressionSyntax,
                dotToken: ISyntaxToken,
                name: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._expression = expression;
        this._dotToken = dotToken;
        this._name = name;
    }

    public static create1(expression: IExpressionSyntax,
                          name: ISyntaxToken): MemberAccessExpressionSyntax {
        return new MemberAccessExpressionSyntax(expression, Syntax.token(SyntaxKind.DotToken), name, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberAccessExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._expression;
            case 1: return this._dotToken;
            case 2: return this._name;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._name);
        array.splice(index, 0, this._dotToken);
        array.splice(index, 0, this._expression);
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public dotToken(): ISyntaxToken {
        return this._dotToken;
    }

    public name(): ISyntaxToken {
        return this._name;
    }

    public update(expression: IExpressionSyntax,
                  dotToken: ISyntaxToken,
                  name: ISyntaxToken): MemberAccessExpressionSyntax {
        if (this._expression === expression && this._dotToken === dotToken && this._name === name) {
            return this;
        }

        return new MemberAccessExpressionSyntax(expression, dotToken, name, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax {
        return <MemberAccessExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax {
        return <MemberAccessExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): MemberAccessExpressionSyntax {
        return this.update(expression, this._dotToken, this._name);
    }

    public withDotToken(dotToken: ISyntaxToken): MemberAccessExpressionSyntax {
        return this.update(this._expression, dotToken, this._name);
    }

    public withName(name: ISyntaxToken): MemberAccessExpressionSyntax {
        return this.update(this._expression, this._dotToken, name);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._expression).collectTextElements(elements);
        (<any>this._dotToken).collectTextElements(elements);
        (<any>this._name).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._dotToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._dotToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._name.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._name.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._dotToken.fullWidth();
        if (position < childWidth) { return { token: this._dotToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._name.fullWidth();
        if (position < childWidth) { return { token: this._name, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <MemberAccessExpressionSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._dotToken, other._dotToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._name, other._name)) { return false; }
        return true;
    }
}

class PostfixUnaryExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _kind: SyntaxKind;
    private _operand: IExpressionSyntax;
    private _operatorToken: ISyntaxToken;

    constructor(kind: SyntaxKind,
                operand: IExpressionSyntax,
                operatorToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._kind = kind;
        this._operand = operand;
        this._operatorToken = operatorToken;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPostfixUnaryExpression(this);
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._operand;
            case 1: return this._operatorToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._operatorToken);
        array.splice(index, 0, this._operand);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public operand(): IExpressionSyntax {
        return this._operand;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public update(kind: SyntaxKind,
                  operand: IExpressionSyntax,
                  operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        if (this._kind === kind && this._operand === operand && this._operatorToken === operatorToken) {
            return this;
        }

        return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, /*parsedInStrictMode:*/ false);
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

    public withOperand(operand: IExpressionSyntax): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, operand, this._operatorToken);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax {
        return this.update(this._kind, this._operand, operatorToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._operand).collectTextElements(elements);
        (<any>this._operatorToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._operand.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._operand.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._operand.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._operand.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._operand.hasRegularExpressionToken();

        childWidth = this._operatorToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._operatorToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._operand.fullWidth();
        if (position < childWidth) { return (<any>this._operand).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._operatorToken.fullWidth();
        if (position < childWidth) { return { token: this._operatorToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <PostfixUnaryExpressionSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._operand, other._operand)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._operatorToken, other._operatorToken)) { return false; }
        return true;
    }
}

class ElementAccessExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _expression: IExpressionSyntax;
    private _openBracketToken: ISyntaxToken;
    private _argumentExpression: IExpressionSyntax;
    private _closeBracketToken: ISyntaxToken;

    constructor(expression: IExpressionSyntax,
                openBracketToken: ISyntaxToken,
                argumentExpression: IExpressionSyntax,
                closeBracketToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
    }

    public static create1(expression: IExpressionSyntax,
                          argumentExpression: IExpressionSyntax): ElementAccessExpressionSyntax {
        return new ElementAccessExpressionSyntax(expression, Syntax.token(SyntaxKind.OpenBracketToken), argumentExpression, Syntax.token(SyntaxKind.CloseBracketToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitElementAccessExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElementAccessExpression;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._expression;
            case 1: return this._openBracketToken;
            case 2: return this._argumentExpression;
            case 3: return this._closeBracketToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBracketToken);
        array.splice(index, 0, this._argumentExpression);
        array.splice(index, 0, this._openBracketToken);
        array.splice(index, 0, this._expression);
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public openBracketToken(): ISyntaxToken {
        return this._openBracketToken;
    }

    public argumentExpression(): IExpressionSyntax {
        return this._argumentExpression;
    }

    public closeBracketToken(): ISyntaxToken {
        return this._closeBracketToken;
    }

    public update(expression: IExpressionSyntax,
                  openBracketToken: ISyntaxToken,
                  argumentExpression: IExpressionSyntax,
                  closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        if (this._expression === expression && this._openBracketToken === openBracketToken && this._argumentExpression === argumentExpression && this._closeBracketToken === closeBracketToken) {
            return this;
        }

        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax {
        return <ElementAccessExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax {
        return <ElementAccessExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): ElementAccessExpressionSyntax {
        return this.update(expression, this._openBracketToken, this._argumentExpression, this._closeBracketToken);
    }

    public withOpenBracketToken(openBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        return this.update(this._expression, openBracketToken, this._argumentExpression, this._closeBracketToken);
    }

    public withArgumentExpression(argumentExpression: IExpressionSyntax): ElementAccessExpressionSyntax {
        return this.update(this._expression, this._openBracketToken, argumentExpression, this._closeBracketToken);
    }

    public withCloseBracketToken(closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax {
        return this.update(this._expression, this._openBracketToken, this._argumentExpression, closeBracketToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._expression).collectTextElements(elements);
        (<any>this._openBracketToken).collectTextElements(elements);
        (<any>this._argumentExpression).collectTextElements(elements);
        (<any>this._closeBracketToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._argumentExpression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._openBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._argumentExpression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._argumentExpression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._argumentExpression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._argumentExpression.hasRegularExpressionToken();

        childWidth = this._closeBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._openBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._argumentExpression.fullWidth();
        if (position < childWidth) { return (<any>this._argumentExpression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ElementAccessExpressionSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openBracketToken, other._openBracketToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._argumentExpression, other._argumentExpression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBracketToken, other._closeBracketToken)) { return false; }
        return true;
    }
}

class InvocationExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _expression: IExpressionSyntax;
    private _argumentList: ArgumentListSyntax;

    constructor(expression: IExpressionSyntax,
                argumentList: ArgumentListSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._expression = expression;
        this._argumentList = argumentList;
    }

    public static create1(expression: IExpressionSyntax): InvocationExpressionSyntax {
        return new InvocationExpressionSyntax(expression, ArgumentListSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitInvocationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.InvocationExpression;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._expression;
            case 1: return this._argumentList;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._argumentList);
        array.splice(index, 0, this._expression);
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }

    public update(expression: IExpressionSyntax,
                  argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        if (this._expression === expression && this._argumentList === argumentList) {
            return this;
        }

        return new InvocationExpressionSyntax(expression, argumentList, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax {
        return <InvocationExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax {
        return <InvocationExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): InvocationExpressionSyntax {
        return this.update(expression, this._argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax {
        return this.update(this._expression, argumentList);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._expression).collectTextElements(elements);
        (<any>this._argumentList).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._argumentList.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._argumentList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._argumentList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._argumentList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._argumentList.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._argumentList.fullWidth();
        if (position < childWidth) { return (<any>this._argumentList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <InvocationExpressionSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._argumentList, other._argumentList)) { return false; }
        return true;
    }
}

class ArgumentListSyntax extends SyntaxNode {
    private _typeArgumentList: TypeArgumentListSyntax;
    private _openParenToken: ISyntaxToken;
    private _arguments: ISeparatedSyntaxList;
    private _closeParenToken: ISyntaxToken;

    constructor(typeArgumentList: TypeArgumentListSyntax,
                openParenToken: ISyntaxToken,
                arguments: ISeparatedSyntaxList,
                closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._typeArgumentList = typeArgumentList;
        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
    }

    public static create(openParenToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return new ArgumentListSyntax(null, openParenToken, Syntax.emptySeparatedList, closeParenToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ArgumentListSyntax {
        return new ArgumentListSyntax(null, Syntax.token(SyntaxKind.OpenParenToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitArgumentList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ArgumentList;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._typeArgumentList;
            case 1: return this._openParenToken;
            case 2: return this._arguments;
            case 3: return this._closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeParenToken);
        this._arguments.insertChildrenInto(array, index);
        array.splice(index, 0, this._openParenToken);
        if (this._typeArgumentList !== null) { array.splice(index, 0, this._typeArgumentList); }
    }

    public typeArgumentList(): TypeArgumentListSyntax {
        return this._typeArgumentList;
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

    public update(typeArgumentList: TypeArgumentListSyntax,
                  openParenToken: ISyntaxToken,
                  _arguments: ISeparatedSyntaxList,
                  closeParenToken: ISyntaxToken): ArgumentListSyntax {
        if (this._typeArgumentList === typeArgumentList && this._openParenToken === openParenToken && this._arguments === _arguments && this._closeParenToken === closeParenToken) {
            return this;
        }

        return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax {
        return <ArgumentListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax {
        return <ArgumentListSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): ArgumentListSyntax {
        return this.update(typeArgumentList, this._openParenToken, this._arguments, this._closeParenToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(this._typeArgumentList, openParenToken, this._arguments, this._closeParenToken);
    }

    public withArguments(_arguments: ISeparatedSyntaxList): ArgumentListSyntax {
        return this.update(this._typeArgumentList, this._openParenToken, _arguments, this._closeParenToken);
    }

    public withArgument(_argument: IExpressionSyntax): ArgumentListSyntax {
        return this.withArguments(Syntax.separatedList([_argument]));
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ArgumentListSyntax {
        return this.update(this._typeArgumentList, this._openParenToken, this._arguments, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._typeArgumentList !== null) { (<any>this._typeArgumentList).collectTextElements(elements); }
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._arguments).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._typeArgumentList !== null && this._typeArgumentList.isTypeScriptSpecific()) { return true; }
        if (this._arguments.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._typeArgumentList !== null) {
            childWidth = this._typeArgumentList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeArgumentList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeArgumentList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeArgumentList.hasRegularExpressionToken();
        }

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._arguments.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._arguments.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._arguments.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._arguments.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._typeArgumentList !== null) {
            childWidth = this._typeArgumentList.fullWidth();
            if (position < childWidth) { return (<any>this._typeArgumentList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._arguments.fullWidth();
        if (position < childWidth) { return (<any>this._arguments).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ArgumentListSyntax>node;
        if (!Syntax.nodeStructuralEquals(this._typeArgumentList, other._typeArgumentList)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._arguments, other._arguments)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        return true;
    }
}

class BinaryExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
    private _kind: SyntaxKind;
    private _left: IExpressionSyntax;
    private _operatorToken: ISyntaxToken;
    private _right: IExpressionSyntax;

    constructor(kind: SyntaxKind,
                left: IExpressionSyntax,
                operatorToken: ISyntaxToken,
                right: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._kind = kind;
        this._left = left;
        this._operatorToken = operatorToken;
        this._right = right;
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBinaryExpression(this);
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._left;
            case 1: return this._operatorToken;
            case 2: return this._right;
            default: throw Errors.invalidOperation();
        }
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._right);
        array.splice(index, 0, this._operatorToken);
        array.splice(index, 0, this._left);
    }

    public kind(): SyntaxKind {
        return this._kind;
    }

    public left(): IExpressionSyntax {
        return this._left;
    }

    public operatorToken(): ISyntaxToken {
        return this._operatorToken;
    }

    public right(): IExpressionSyntax {
        return this._right;
    }

    public update(kind: SyntaxKind,
                  left: IExpressionSyntax,
                  operatorToken: ISyntaxToken,
                  right: IExpressionSyntax): BinaryExpressionSyntax {
        if (this._kind === kind && this._left === left && this._operatorToken === operatorToken && this._right === right) {
            return this;
        }

        return new BinaryExpressionSyntax(kind, left, operatorToken, right, /*parsedInStrictMode:*/ false);
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

    public withLeft(left: IExpressionSyntax): BinaryExpressionSyntax {
        return this.update(this._kind, left, this._operatorToken, this._right);
    }

    public withOperatorToken(operatorToken: ISyntaxToken): BinaryExpressionSyntax {
        return this.update(this._kind, this._left, operatorToken, this._right);
    }

    public withRight(right: IExpressionSyntax): BinaryExpressionSyntax {
        return this.update(this._kind, this._left, this._operatorToken, right);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._left).collectTextElements(elements);
        (<any>this._operatorToken).collectTextElements(elements);
        (<any>this._right).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._left.isTypeScriptSpecific()) { return true; }
        if (this._right.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._left.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._left.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._left.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._left.hasRegularExpressionToken();

        childWidth = this._operatorToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._operatorToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        hasRegularExpressionToken = hasRegularExpressionToken || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this._operatorToken.tokenKind);

        childWidth = this._right.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._right.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._right.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._right.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._left.fullWidth();
        if (position < childWidth) { return (<any>this._left).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._operatorToken.fullWidth();
        if (position < childWidth) { return { token: this._operatorToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._right.fullWidth();
        if (position < childWidth) { return (<any>this._right).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <BinaryExpressionSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._left, other._left)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._operatorToken, other._operatorToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._right, other._right)) { return false; }
        return true;
    }
}

class ConditionalExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
    private _condition: IExpressionSyntax;
    private _questionToken: ISyntaxToken;
    private _whenTrue: IExpressionSyntax;
    private _colonToken: ISyntaxToken;
    private _whenFalse: IExpressionSyntax;

    constructor(condition: IExpressionSyntax,
                questionToken: ISyntaxToken,
                whenTrue: IExpressionSyntax,
                colonToken: ISyntaxToken,
                whenFalse: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
    }

    public static create1(condition: IExpressionSyntax,
                          whenTrue: IExpressionSyntax,
                          whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
        return new ConditionalExpressionSyntax(condition, Syntax.token(SyntaxKind.QuestionToken), whenTrue, Syntax.token(SyntaxKind.ColonToken), whenFalse, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConditionalExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConditionalExpression;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._condition;
            case 1: return this._questionToken;
            case 2: return this._whenTrue;
            case 3: return this._colonToken;
            case 4: return this._whenFalse;
            default: throw Errors.invalidOperation();
        }
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._whenFalse);
        array.splice(index, 0, this._colonToken);
        array.splice(index, 0, this._whenTrue);
        array.splice(index, 0, this._questionToken);
        array.splice(index, 0, this._condition);
    }

    public condition(): IExpressionSyntax {
        return this._condition;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public whenTrue(): IExpressionSyntax {
        return this._whenTrue;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public whenFalse(): IExpressionSyntax {
        return this._whenFalse;
    }

    public update(condition: IExpressionSyntax,
                  questionToken: ISyntaxToken,
                  whenTrue: IExpressionSyntax,
                  colonToken: ISyntaxToken,
                  whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
        if (this._condition === condition && this._questionToken === questionToken && this._whenTrue === whenTrue && this._colonToken === colonToken && this._whenFalse === whenFalse) {
            return this;
        }

        return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax {
        return <ConditionalExpressionSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax {
        return <ConditionalExpressionSyntax>super.withTrailingTrivia(trivia);
    }

    public withCondition(condition: IExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(condition, this._questionToken, this._whenTrue, this._colonToken, this._whenFalse);
    }

    public withQuestionToken(questionToken: ISyntaxToken): ConditionalExpressionSyntax {
        return this.update(this._condition, questionToken, this._whenTrue, this._colonToken, this._whenFalse);
    }

    public withWhenTrue(whenTrue: IExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(this._condition, this._questionToken, whenTrue, this._colonToken, this._whenFalse);
    }

    public withColonToken(colonToken: ISyntaxToken): ConditionalExpressionSyntax {
        return this.update(this._condition, this._questionToken, this._whenTrue, colonToken, this._whenFalse);
    }

    public withWhenFalse(whenFalse: IExpressionSyntax): ConditionalExpressionSyntax {
        return this.update(this._condition, this._questionToken, this._whenTrue, this._colonToken, whenFalse);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._condition).collectTextElements(elements);
        (<any>this._questionToken).collectTextElements(elements);
        (<any>this._whenTrue).collectTextElements(elements);
        (<any>this._colonToken).collectTextElements(elements);
        (<any>this._whenFalse).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._whenTrue.isTypeScriptSpecific()) { return true; }
        if (this._whenFalse.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._condition.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._condition.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._condition.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._condition.hasRegularExpressionToken();

        childWidth = this._questionToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._questionToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._whenTrue.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._whenTrue.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._whenTrue.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._whenTrue.hasRegularExpressionToken();

        childWidth = this._colonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._colonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._whenFalse.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._whenFalse.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._whenFalse.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._whenFalse.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._condition.fullWidth();
        if (position < childWidth) { return (<any>this._condition).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._questionToken.fullWidth();
        if (position < childWidth) { return { token: this._questionToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._whenTrue.fullWidth();
        if (position < childWidth) { return (<any>this._whenTrue).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._colonToken.fullWidth();
        if (position < childWidth) { return { token: this._colonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._whenFalse.fullWidth();
        if (position < childWidth) { return (<any>this._whenFalse).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ConditionalExpressionSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._condition, other._condition)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._questionToken, other._questionToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._whenTrue, other._whenTrue)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._colonToken, other._colonToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._whenFalse, other._whenFalse)) { return false; }
        return true;
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

    private isTypeScriptSpecific(): bool {
        return true;
    }
}

class ConstructSignatureSyntax extends TypeMemberSyntax {
    private _newKeyword: ISyntaxToken;
    private _callSignature: CallSignatureSyntax;

    constructor(newKeyword: ISyntaxToken,
                callSignature: CallSignatureSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._newKeyword = newKeyword;
        this._callSignature = callSignature;
    }

    public static create1(): ConstructSignatureSyntax {
        return new ConstructSignatureSyntax(Syntax.token(SyntaxKind.NewKeyword), CallSignatureSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructSignature;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._newKeyword;
            case 1: return this._callSignature;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._callSignature);
        array.splice(index, 0, this._newKeyword);
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public update(newKeyword: ISyntaxToken,
                  callSignature: CallSignatureSyntax): ConstructSignatureSyntax {
        if (this._newKeyword === newKeyword && this._callSignature === callSignature) {
            return this;
        }

        return new ConstructSignatureSyntax(newKeyword, callSignature, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax {
        return <ConstructSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax {
        return <ConstructSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withNewKeyword(newKeyword: ISyntaxToken): ConstructSignatureSyntax {
        return this.update(newKeyword, this._callSignature);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): ConstructSignatureSyntax {
        return this.update(this._newKeyword, callSignature);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._newKeyword).collectTextElements(elements);
        (<any>this._callSignature).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._newKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._newKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._callSignature.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._callSignature.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._callSignature.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._callSignature.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._newKeyword.fullWidth();
        if (position < childWidth) { return { token: this._newKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._callSignature.fullWidth();
        if (position < childWidth) { return (<any>this._callSignature).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ConstructSignatureSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._newKeyword, other._newKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._callSignature, other._callSignature)) { return false; }
        return true;
    }
}

class FunctionSignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _callSignature: CallSignatureSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                callSignature: CallSignatureSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._callSignature = callSignature;
    }

    public static create(identifier: ISyntaxToken,
                         callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
        return new FunctionSignatureSyntax(identifier, null, callSignature, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): FunctionSignatureSyntax {
        return new FunctionSignatureSyntax(identifier, null, CallSignatureSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionSignature;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._identifier;
            case 1: return this._questionToken;
            case 2: return this._callSignature;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._callSignature);
        if (this._questionToken !== null) { array.splice(index, 0, this._questionToken); }
        array.splice(index, 0, this._identifier);
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public questionToken(): ISyntaxToken {
        return this._questionToken;
    }

    public callSignature(): CallSignatureSyntax {
        return this._callSignature;
    }

    public update(identifier: ISyntaxToken,
                  questionToken: ISyntaxToken,
                  callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
        if (this._identifier === identifier && this._questionToken === questionToken && this._callSignature === callSignature) {
            return this;
        }

        return new FunctionSignatureSyntax(identifier, questionToken, callSignature, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionSignatureSyntax {
        return <FunctionSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionSignatureSyntax {
        return <FunctionSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): FunctionSignatureSyntax {
        return this.update(identifier, this._questionToken, this._callSignature);
    }

    public withQuestionToken(questionToken: ISyntaxToken): FunctionSignatureSyntax {
        return this.update(this._identifier, questionToken, this._callSignature);
    }

    public withCallSignature(callSignature: CallSignatureSyntax): FunctionSignatureSyntax {
        return this.update(this._identifier, this._questionToken, callSignature);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._identifier).collectTextElements(elements);
        if (this._questionToken !== null) { (<any>this._questionToken).collectTextElements(elements); }
        (<any>this._callSignature).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._callSignature.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._questionToken !== null) {
            childWidth = this._questionToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._questionToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._callSignature.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._callSignature.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._callSignature.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._callSignature.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._questionToken !== null) {
            childWidth = this._questionToken.fullWidth();
            if (position < childWidth) { return { token: this._questionToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._callSignature.fullWidth();
        if (position < childWidth) { return (<any>this._callSignature).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <FunctionSignatureSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._questionToken, other._questionToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._callSignature, other._callSignature)) { return false; }
        return true;
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
                typeAnnotation: TypeAnnotationSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openBracketToken = openBracketToken;
        this._parameter = parameter;
        this._closeBracketToken = closeBracketToken;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(openBracketToken: ISyntaxToken,
                         parameter: ParameterSyntax,
                         closeBracketToken: ISyntaxToken): IndexSignatureSyntax {
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(parameter: ParameterSyntax): IndexSignatureSyntax {
        return new IndexSignatureSyntax(Syntax.token(SyntaxKind.OpenBracketToken), parameter, Syntax.token(SyntaxKind.CloseBracketToken), null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIndexSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IndexSignature;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openBracketToken;
            case 1: return this._parameter;
            case 2: return this._closeBracketToken;
            case 3: return this._typeAnnotation;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._typeAnnotation !== null) { array.splice(index, 0, this._typeAnnotation); }
        array.splice(index, 0, this._closeBracketToken);
        array.splice(index, 0, this._parameter);
        array.splice(index, 0, this._openBracketToken);
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

        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, /*parsedInStrictMode:*/ false);
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
        (<any>this._openBracketToken).collectTextElements(elements);
        (<any>this._parameter).collectTextElements(elements);
        (<any>this._closeBracketToken).collectTextElements(elements);
        if (this._typeAnnotation !== null) { (<any>this._typeAnnotation).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._parameter.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameter.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameter.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameter.hasRegularExpressionToken();

        childWidth = this._closeBracketToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBracketToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeAnnotation.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeAnnotation.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeAnnotation.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._openBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._parameter.fullWidth();
        if (position < childWidth) { return (<any>this._parameter).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBracketToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBracketToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            if (position < childWidth) { return (<any>this._typeAnnotation).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <IndexSignatureSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openBracketToken, other._openBracketToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameter, other._parameter)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBracketToken, other._closeBracketToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeAnnotation, other._typeAnnotation)) { return false; }
        return true;
    }
}

class PropertySignatureSyntax extends TypeMemberSyntax {
    private _identifier: ISyntaxToken;
    private _questionToken: ISyntaxToken;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(identifier: ISyntaxToken,
                questionToken: ISyntaxToken,
                typeAnnotation: TypeAnnotationSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(identifier: ISyntaxToken): PropertySignatureSyntax {
        return new PropertySignatureSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): PropertySignatureSyntax {
        return new PropertySignatureSyntax(identifier, null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitPropertySignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.PropertySignature;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._identifier;
            case 1: return this._questionToken;
            case 2: return this._typeAnnotation;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._typeAnnotation !== null) { array.splice(index, 0, this._typeAnnotation); }
        if (this._questionToken !== null) { array.splice(index, 0, this._questionToken); }
        array.splice(index, 0, this._identifier);
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

        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, /*parsedInStrictMode:*/ false);
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
        (<any>this._identifier).collectTextElements(elements);
        if (this._questionToken !== null) { (<any>this._questionToken).collectTextElements(elements); }
        if (this._typeAnnotation !== null) { (<any>this._typeAnnotation).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._questionToken !== null) {
            childWidth = this._questionToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._questionToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeAnnotation.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeAnnotation.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeAnnotation.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._questionToken !== null) {
            childWidth = this._questionToken.fullWidth();
            if (position < childWidth) { return { token: this._questionToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            if (position < childWidth) { return (<any>this._typeAnnotation).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <PropertySignatureSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._questionToken, other._questionToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeAnnotation, other._typeAnnotation)) { return false; }
        return true;
    }
}

class ParameterListSyntax extends SyntaxNode {
    private _openParenToken: ISyntaxToken;
    private _parameters: ISeparatedSyntaxList;
    private _closeParenToken: ISyntaxToken;

    constructor(openParenToken: ISyntaxToken,
                parameters: ISeparatedSyntaxList,
                closeParenToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openParenToken = openParenToken;
        this._parameters = parameters;
        this._closeParenToken = closeParenToken;
    }

    public static create(openParenToken: ISyntaxToken,
                         closeParenToken: ISyntaxToken): ParameterListSyntax {
        return new ParameterListSyntax(openParenToken, Syntax.emptySeparatedList, closeParenToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ParameterListSyntax {
        return new ParameterListSyntax(Syntax.token(SyntaxKind.OpenParenToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseParenToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitParameterList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ParameterList;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openParenToken;
            case 1: return this._parameters;
            case 2: return this._closeParenToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeParenToken);
        this._parameters.insertChildrenInto(array, index);
        array.splice(index, 0, this._openParenToken);
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

        return new ParameterListSyntax(openParenToken, parameters, closeParenToken, /*parsedInStrictMode:*/ false);
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
        return this.withParameters(Syntax.separatedList([parameter]));
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ParameterListSyntax {
        return this.update(this._openParenToken, this._parameters, closeParenToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._parameters).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._parameters.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._parameters.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameters.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameters.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameters.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._parameters.fullWidth();
        if (position < childWidth) { return (<any>this._parameters).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ParameterListSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._parameters, other._parameters)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        return true;
    }
}

class CallSignatureSyntax extends TypeMemberSyntax {
    private _typeParameterList: TypeParameterListSyntax;
    private _parameterList: ParameterListSyntax;
    private _typeAnnotation: TypeAnnotationSyntax;

    constructor(typeParameterList: TypeParameterListSyntax,
                parameterList: ParameterListSyntax,
                typeAnnotation: TypeAnnotationSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._typeParameterList = typeParameterList;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }

    public static create(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return new CallSignatureSyntax(null, parameterList, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): CallSignatureSyntax {
        return new CallSignatureSyntax(null, ParameterListSyntax.create1(), null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCallSignature(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CallSignature;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._typeParameterList;
            case 1: return this._parameterList;
            case 2: return this._typeAnnotation;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._typeAnnotation !== null) { array.splice(index, 0, this._typeAnnotation); }
        array.splice(index, 0, this._parameterList);
        if (this._typeParameterList !== null) { array.splice(index, 0, this._typeParameterList); }
    }

    public typeParameterList(): TypeParameterListSyntax {
        return this._typeParameterList;
    }

    public parameterList(): ParameterListSyntax {
        return this._parameterList;
    }

    public typeAnnotation(): TypeAnnotationSyntax {
        return this._typeAnnotation;
    }

    public update(typeParameterList: TypeParameterListSyntax,
                  parameterList: ParameterListSyntax,
                  typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        if (this._typeParameterList === typeParameterList && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }

        return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax {
        return <CallSignatureSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax {
        return <CallSignatureSyntax>super.withTrailingTrivia(trivia);
    }

    public withTypeParameterList(typeParameterList: TypeParameterListSyntax): CallSignatureSyntax {
        return this.update(typeParameterList, this._parameterList, this._typeAnnotation);
    }

    public withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax {
        return this.update(this._typeParameterList, parameterList, this._typeAnnotation);
    }

    public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax {
        return this.update(this._typeParameterList, this._parameterList, typeAnnotation);
    }

    private collectTextElements(elements: string[]): void {
        if (this._typeParameterList !== null) { (<any>this._typeParameterList).collectTextElements(elements); }
        (<any>this._parameterList).collectTextElements(elements);
        if (this._typeAnnotation !== null) { (<any>this._typeAnnotation).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._typeParameterList !== null) { return true; }
        if (this._parameterList.isTypeScriptSpecific()) { return true; }
        if (this._typeAnnotation !== null) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeParameterList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeParameterList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeParameterList.hasRegularExpressionToken();
        }

        childWidth = this._parameterList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameterList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameterList.hasRegularExpressionToken();

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeAnnotation.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeAnnotation.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeAnnotation.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._typeParameterList !== null) {
            childWidth = this._typeParameterList.fullWidth();
            if (position < childWidth) { return (<any>this._typeParameterList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._parameterList.fullWidth();
        if (position < childWidth) { return (<any>this._parameterList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            if (position < childWidth) { return (<any>this._typeAnnotation).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <CallSignatureSyntax>node;
        if (!Syntax.nodeStructuralEquals(this._typeParameterList, other._typeParameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameterList, other._parameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeAnnotation, other._typeAnnotation)) { return false; }
        return true;
    }
}

class TypeParameterListSyntax extends SyntaxNode {
    private _lessThanToken: ISyntaxToken;
    private _typeParameters: ISeparatedSyntaxList;
    private _greaterThanToken: ISyntaxToken;

    constructor(lessThanToken: ISyntaxToken,
                typeParameters: ISeparatedSyntaxList,
                greaterThanToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._lessThanToken = lessThanToken;
        this._typeParameters = typeParameters;
        this._greaterThanToken = greaterThanToken;
    }

    public static create(lessThanToken: ISyntaxToken,
                         greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
        return new TypeParameterListSyntax(lessThanToken, Syntax.emptySeparatedList, greaterThanToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): TypeParameterListSyntax {
        return new TypeParameterListSyntax(Syntax.token(SyntaxKind.LessThanToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.GreaterThanToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeParameterList(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeParameterList;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._lessThanToken;
            case 1: return this._typeParameters;
            case 2: return this._greaterThanToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._greaterThanToken);
        this._typeParameters.insertChildrenInto(array, index);
        array.splice(index, 0, this._lessThanToken);
    }

    public lessThanToken(): ISyntaxToken {
        return this._lessThanToken;
    }

    public typeParameters(): ISeparatedSyntaxList {
        return this._typeParameters;
    }

    public greaterThanToken(): ISyntaxToken {
        return this._greaterThanToken;
    }

    public update(lessThanToken: ISyntaxToken,
                  typeParameters: ISeparatedSyntaxList,
                  greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
        if (this._lessThanToken === lessThanToken && this._typeParameters === typeParameters && this._greaterThanToken === greaterThanToken) {
            return this;
        }

        return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeParameterListSyntax {
        return <TypeParameterListSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeParameterListSyntax {
        return <TypeParameterListSyntax>super.withTrailingTrivia(trivia);
    }

    public withLessThanToken(lessThanToken: ISyntaxToken): TypeParameterListSyntax {
        return this.update(lessThanToken, this._typeParameters, this._greaterThanToken);
    }

    public withTypeParameters(typeParameters: ISeparatedSyntaxList): TypeParameterListSyntax {
        return this.update(this._lessThanToken, typeParameters, this._greaterThanToken);
    }

    public withTypeParameter(typeParameter: TypeParameterSyntax): TypeParameterListSyntax {
        return this.withTypeParameters(Syntax.separatedList([typeParameter]));
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): TypeParameterListSyntax {
        return this.update(this._lessThanToken, this._typeParameters, greaterThanToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._lessThanToken).collectTextElements(elements);
        (<any>this._typeParameters).collectTextElements(elements);
        (<any>this._greaterThanToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._lessThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._lessThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._typeParameters.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeParameters.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._typeParameters.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._typeParameters.hasRegularExpressionToken();

        childWidth = this._greaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._greaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._lessThanToken.fullWidth();
        if (position < childWidth) { return { token: this._lessThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._typeParameters.fullWidth();
        if (position < childWidth) { return (<any>this._typeParameters).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._greaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._greaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <TypeParameterListSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._lessThanToken, other._lessThanToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._typeParameters, other._typeParameters)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._greaterThanToken, other._greaterThanToken)) { return false; }
        return true;
    }
}

class TypeParameterSyntax extends SyntaxNode {
    private _identifier: ISyntaxToken;
    private _constraint: ConstraintSyntax;

    constructor(identifier: ISyntaxToken,
                constraint: ConstraintSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._identifier = identifier;
        this._constraint = constraint;
    }

    public static create(identifier: ISyntaxToken): TypeParameterSyntax {
        return new TypeParameterSyntax(identifier, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): TypeParameterSyntax {
        return new TypeParameterSyntax(identifier, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeParameter(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeParameter;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._identifier;
            case 1: return this._constraint;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._constraint !== null) { array.splice(index, 0, this._constraint); }
        array.splice(index, 0, this._identifier);
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public constraint(): ConstraintSyntax {
        return this._constraint;
    }

    public update(identifier: ISyntaxToken,
                  constraint: ConstraintSyntax): TypeParameterSyntax {
        if (this._identifier === identifier && this._constraint === constraint) {
            return this;
        }

        return new TypeParameterSyntax(identifier, constraint, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): TypeParameterSyntax {
        return <TypeParameterSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): TypeParameterSyntax {
        return <TypeParameterSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): TypeParameterSyntax {
        return this.update(identifier, this._constraint);
    }

    public withConstraint(constraint: ConstraintSyntax): TypeParameterSyntax {
        return this.update(this._identifier, constraint);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._identifier).collectTextElements(elements);
        if (this._constraint !== null) { (<any>this._constraint).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._constraint !== null) {
            childWidth = this._constraint.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._constraint.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._constraint.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._constraint.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._constraint !== null) {
            childWidth = this._constraint.fullWidth();
            if (position < childWidth) { return (<any>this._constraint).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <TypeParameterSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._constraint, other._constraint)) { return false; }
        return true;
    }
}

class ConstraintSyntax extends SyntaxNode {
    private _extendsKeyword: ISyntaxToken;
    private _type: ITypeSyntax;

    constructor(extendsKeyword: ISyntaxToken,
                type: ITypeSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._extendsKeyword = extendsKeyword;
        this._type = type;
    }

    public static create1(type: ITypeSyntax): ConstraintSyntax {
        return new ConstraintSyntax(Syntax.token(SyntaxKind.ExtendsKeyword), type, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstraint(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.Constraint;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._extendsKeyword;
            case 1: return this._type;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._type);
        array.splice(index, 0, this._extendsKeyword);
    }

    public extendsKeyword(): ISyntaxToken {
        return this._extendsKeyword;
    }

    public type(): ITypeSyntax {
        return this._type;
    }

    public update(extendsKeyword: ISyntaxToken,
                  type: ITypeSyntax): ConstraintSyntax {
        if (this._extendsKeyword === extendsKeyword && this._type === type) {
            return this;
        }

        return new ConstraintSyntax(extendsKeyword, type, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ConstraintSyntax {
        return <ConstraintSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ConstraintSyntax {
        return <ConstraintSyntax>super.withTrailingTrivia(trivia);
    }

    public withExtendsKeyword(extendsKeyword: ISyntaxToken): ConstraintSyntax {
        return this.update(extendsKeyword, this._type);
    }

    public withType(type: ITypeSyntax): ConstraintSyntax {
        return this.update(this._extendsKeyword, type);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._extendsKeyword).collectTextElements(elements);
        (<any>this._type).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._extendsKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._extendsKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._type.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._type.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._type.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._type.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._extendsKeyword.fullWidth();
        if (position < childWidth) { return { token: this._extendsKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._type.fullWidth();
        if (position < childWidth) { return (<any>this._type).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ConstraintSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._extendsKeyword, other._extendsKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._type, other._type)) { return false; }
        return true;
    }
}

class ElseClauseSyntax extends SyntaxNode {
    private _elseKeyword: ISyntaxToken;
    private _statement: IStatementSyntax;

    constructor(elseKeyword: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._elseKeyword = elseKeyword;
        this._statement = statement;
    }

    public static create1(statement: IStatementSyntax): ElseClauseSyntax {
        return new ElseClauseSyntax(Syntax.token(SyntaxKind.ElseKeyword), statement, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitElseClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ElseClause;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._elseKeyword;
            case 1: return this._statement;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._elseKeyword);
    }

    public elseKeyword(): ISyntaxToken {
        return this._elseKeyword;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public update(elseKeyword: ISyntaxToken,
                  statement: IStatementSyntax): ElseClauseSyntax {
        if (this._elseKeyword === elseKeyword && this._statement === statement) {
            return this;
        }

        return new ElseClauseSyntax(elseKeyword, statement, /*parsedInStrictMode:*/ false);
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

    public withStatement(statement: IStatementSyntax): ElseClauseSyntax {
        return this.update(this._elseKeyword, statement);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._elseKeyword).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._elseKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._elseKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._elseKeyword.fullWidth();
        if (position < childWidth) { return { token: this._elseKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ElseClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._elseKeyword, other._elseKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        return true;
    }
}

class IfStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _ifKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: IStatementSyntax;
    private _elseClause: ElseClauseSyntax;

    constructor(ifKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                elseClause: ElseClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
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

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitIfStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.IfStatement;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._ifKeyword;
            case 1: return this._openParenToken;
            case 2: return this._condition;
            case 3: return this._closeParenToken;
            case 4: return this._statement;
            case 5: return this._elseClause;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._elseClause !== null) { array.splice(index, 0, this._elseClause); }
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._condition);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._ifKeyword);
    }

    public ifKeyword(): ISyntaxToken {
        return this._ifKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): IExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public elseClause(): ElseClauseSyntax {
        return this._elseClause;
    }

    public update(ifKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax,
                  elseClause: ElseClauseSyntax): IfStatementSyntax {
        if (this._ifKeyword === ifKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement && this._elseClause === elseClause) {
            return this;
        }

        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, /*parsedInStrictMode:*/ false);
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

    public withCondition(condition: IExpressionSyntax): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, condition, this._closeParenToken, this._statement, this._elseClause);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, this._condition, closeParenToken, this._statement, this._elseClause);
    }

    public withStatement(statement: IStatementSyntax): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, this._condition, this._closeParenToken, statement, this._elseClause);
    }

    public withElseClause(elseClause: ElseClauseSyntax): IfStatementSyntax {
        return this.update(this._ifKeyword, this._openParenToken, this._condition, this._closeParenToken, this._statement, elseClause);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._ifKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._condition).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
        if (this._elseClause !== null) { (<any>this._elseClause).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        if (this._elseClause !== null && this._elseClause.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._ifKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._ifKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._condition.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._condition.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._condition.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._condition.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        if (this._elseClause !== null) {
            childWidth = this._elseClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._elseClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._elseClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._elseClause.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._ifKeyword.fullWidth();
        if (position < childWidth) { return { token: this._ifKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._condition.fullWidth();
        if (position < childWidth) { return (<any>this._condition).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._elseClause !== null) {
            childWidth = this._elseClause.fullWidth();
            if (position < childWidth) { return (<any>this._elseClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <IfStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._ifKeyword, other._ifKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._condition, other._condition)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._elseClause, other._elseClause)) { return false; }
        return true;
    }
}

class ExpressionStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _expression: IExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(expression: IExpressionSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public static create1(expression: IExpressionSyntax): ExpressionStatementSyntax {
        return new ExpressionStatementSyntax(expression, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitExpressionStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ExpressionStatement;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._expression;
            case 1: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._expression);
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(expression: IExpressionSyntax,
                  semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        if (this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ExpressionStatementSyntax(expression, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax {
        return <ExpressionStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax {
        return <ExpressionStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withExpression(expression: IExpressionSyntax): ExpressionStatementSyntax {
        return this.update(expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ExpressionStatementSyntax {
        return this.update(this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._expression).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ExpressionStatementSyntax>node;
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class ConstructorDeclarationSyntax extends SyntaxNode implements IClassElementSyntax {
    private _constructorKeyword: ISyntaxToken;
    private _parameterList: ParameterListSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(constructorKeyword: ISyntaxToken,
                parameterList: ParameterListSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public static create(constructorKeyword: ISyntaxToken,
                         parameterList: ParameterListSyntax): ConstructorDeclarationSyntax {
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ConstructorDeclarationSyntax {
        return new ConstructorDeclarationSyntax(Syntax.token(SyntaxKind.ConstructorKeyword), ParameterListSyntax.create1(), null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitConstructorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ConstructorDeclaration;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._constructorKeyword;
            case 1: return this._parameterList;
            case 2: return this._block;
            case 3: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isClassElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._semicolonToken !== null) { array.splice(index, 0, this._semicolonToken); }
        if (this._block !== null) { array.splice(index, 0, this._block); }
        array.splice(index, 0, this._parameterList);
        array.splice(index, 0, this._constructorKeyword);
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

        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._constructorKeyword).collectTextElements(elements);
        (<any>this._parameterList).collectTextElements(elements);
        if (this._block !== null) { (<any>this._block).collectTextElements(elements); }
        if (this._semicolonToken !== null) { (<any>this._semicolonToken).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._constructorKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._constructorKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._parameterList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameterList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameterList.hasRegularExpressionToken();

        if (this._block !== null) {
            childWidth = this._block.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._block.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();
        }

        if (this._semicolonToken !== null) {
            childWidth = this._semicolonToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._constructorKeyword.fullWidth();
        if (position < childWidth) { return { token: this._constructorKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._parameterList.fullWidth();
        if (position < childWidth) { return (<any>this._parameterList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._block !== null) {
            childWidth = this._block.fullWidth();
            if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._semicolonToken !== null) {
            childWidth = this._semicolonToken.fullWidth();
            if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ConstructorDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._constructorKeyword, other._constructorKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameterList, other._parameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class MemberFunctionDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _functionSignature: FunctionSignatureSyntax;
    private _block: BlockSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                functionSignature: FunctionSignatureSyntax,
                block: BlockSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }

    public static create(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return new MemberFunctionDeclarationSyntax(null, null, functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(functionSignature: FunctionSignatureSyntax): MemberFunctionDeclarationSyntax {
        return new MemberFunctionDeclarationSyntax(null, null, functionSignature, null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberFunctionDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberFunctionDeclaration;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._publicOrPrivateKeyword;
            case 1: return this._staticKeyword;
            case 2: return this._functionSignature;
            case 3: return this._block;
            case 4: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isMemberDeclaration(): bool {
        return true;
    }

    private isClassElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._semicolonToken !== null) { array.splice(index, 0, this._semicolonToken); }
        if (this._block !== null) { array.splice(index, 0, this._block); }
        array.splice(index, 0, this._functionSignature);
        if (this._staticKeyword !== null) { array.splice(index, 0, this._staticKeyword); }
        if (this._publicOrPrivateKeyword !== null) { array.splice(index, 0, this._publicOrPrivateKeyword); }
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

        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, /*parsedInStrictMode:*/ false);
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
        if (this._publicOrPrivateKeyword !== null) { (<any>this._publicOrPrivateKeyword).collectTextElements(elements); }
        if (this._staticKeyword !== null) { (<any>this._staticKeyword).collectTextElements(elements); }
        (<any>this._functionSignature).collectTextElements(elements);
        if (this._block !== null) { (<any>this._block).collectTextElements(elements); }
        if (this._semicolonToken !== null) { (<any>this._semicolonToken).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._publicOrPrivateKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._staticKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._functionSignature.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._functionSignature.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._functionSignature.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._functionSignature.hasRegularExpressionToken();

        if (this._block !== null) {
            childWidth = this._block.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._block.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();
        }

        if (this._semicolonToken !== null) {
            childWidth = this._semicolonToken.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            if (position < childWidth) { return { token: this._publicOrPrivateKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            if (position < childWidth) { return { token: this._staticKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._functionSignature.fullWidth();
        if (position < childWidth) { return (<any>this._functionSignature).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._block !== null) {
            childWidth = this._block.fullWidth();
            if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._semicolonToken !== null) {
            childWidth = this._semicolonToken.fullWidth();
            if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <MemberFunctionDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._publicOrPrivateKeyword, other._publicOrPrivateKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._staticKeyword, other._staticKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._functionSignature, other._functionSignature)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class MemberAccessorDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
    }

    private isMemberDeclaration(): bool {
        return true;
    }

    private isClassElement(): bool {
        return true;
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
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
        return new GetMemberAccessorDeclarationSyntax(null, null, getKeyword, identifier, parameterList, null, block, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
        return new GetMemberAccessorDeclarationSyntax(null, null, Syntax.token(SyntaxKind.GetKeyword), identifier, ParameterListSyntax.create1(), null, BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetMemberAccessorDeclaration;
    }

    private slotCount(): number {
        return 7;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._publicOrPrivateKeyword;
            case 1: return this._staticKeyword;
            case 2: return this._getKeyword;
            case 3: return this._identifier;
            case 4: return this._parameterList;
            case 5: return this._typeAnnotation;
            case 6: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        if (this._typeAnnotation !== null) { array.splice(index, 0, this._typeAnnotation); }
        array.splice(index, 0, this._parameterList);
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._getKeyword);
        if (this._staticKeyword !== null) { array.splice(index, 0, this._staticKeyword); }
        if (this._publicOrPrivateKeyword !== null) { array.splice(index, 0, this._publicOrPrivateKeyword); }
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

        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, /*parsedInStrictMode:*/ false);
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
        if (this._publicOrPrivateKeyword !== null) { (<any>this._publicOrPrivateKeyword).collectTextElements(elements); }
        if (this._staticKeyword !== null) { (<any>this._staticKeyword).collectTextElements(elements); }
        (<any>this._getKeyword).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._parameterList).collectTextElements(elements);
        if (this._typeAnnotation !== null) { (<any>this._typeAnnotation).collectTextElements(elements); }
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._publicOrPrivateKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._staticKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._getKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._getKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._parameterList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameterList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameterList.hasRegularExpressionToken();

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._typeAnnotation.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._typeAnnotation.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._typeAnnotation.hasRegularExpressionToken();
        }

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            if (position < childWidth) { return { token: this._publicOrPrivateKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            if (position < childWidth) { return { token: this._staticKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._getKeyword.fullWidth();
        if (position < childWidth) { return { token: this._getKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._parameterList.fullWidth();
        if (position < childWidth) { return (<any>this._parameterList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._typeAnnotation !== null) {
            childWidth = this._typeAnnotation.fullWidth();
            if (position < childWidth) { return (<any>this._typeAnnotation).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <GetMemberAccessorDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._publicOrPrivateKeyword, other._publicOrPrivateKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._staticKeyword, other._staticKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._getKeyword, other._getKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameterList, other._parameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._typeAnnotation, other._typeAnnotation)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
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
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
        return new SetMemberAccessorDeclarationSyntax(null, null, setKeyword, identifier, parameterList, block, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
        return new SetMemberAccessorDeclarationSyntax(null, null, Syntax.token(SyntaxKind.SetKeyword), identifier, ParameterListSyntax.create1(), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSetMemberAccessorDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetMemberAccessorDeclaration;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._publicOrPrivateKeyword;
            case 1: return this._staticKeyword;
            case 2: return this._setKeyword;
            case 3: return this._identifier;
            case 4: return this._parameterList;
            case 5: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._parameterList);
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._setKeyword);
        if (this._staticKeyword !== null) { array.splice(index, 0, this._staticKeyword); }
        if (this._publicOrPrivateKeyword !== null) { array.splice(index, 0, this._publicOrPrivateKeyword); }
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

        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, /*parsedInStrictMode:*/ false);
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
        if (this._publicOrPrivateKeyword !== null) { (<any>this._publicOrPrivateKeyword).collectTextElements(elements); }
        if (this._staticKeyword !== null) { (<any>this._staticKeyword).collectTextElements(elements); }
        (<any>this._setKeyword).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._parameterList).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._publicOrPrivateKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._staticKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._setKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._setKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._parameterList.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterList.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._parameterList.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._parameterList.hasRegularExpressionToken();

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            if (position < childWidth) { return { token: this._publicOrPrivateKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            if (position < childWidth) { return { token: this._staticKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._setKeyword.fullWidth();
        if (position < childWidth) { return { token: this._setKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._parameterList.fullWidth();
        if (position < childWidth) { return (<any>this._parameterList).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <SetMemberAccessorDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._publicOrPrivateKeyword, other._publicOrPrivateKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._staticKeyword, other._staticKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._setKeyword, other._setKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._parameterList, other._parameterList)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        return true;
    }
}

class MemberVariableDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {
    private _publicOrPrivateKeyword: ISyntaxToken;
    private _staticKeyword: ISyntaxToken;
    private _variableDeclarator: VariableDeclaratorSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(publicOrPrivateKeyword: ISyntaxToken,
                staticKeyword: ISyntaxToken,
                variableDeclarator: VariableDeclaratorSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }

    public static create(variableDeclarator: VariableDeclaratorSyntax,
                         semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax {
        return new MemberVariableDeclarationSyntax(null, null, variableDeclarator, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax {
        return new MemberVariableDeclarationSyntax(null, null, variableDeclarator, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitMemberVariableDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.MemberVariableDeclaration;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._publicOrPrivateKeyword;
            case 1: return this._staticKeyword;
            case 2: return this._variableDeclarator;
            case 3: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isMemberDeclaration(): bool {
        return true;
    }

    private isClassElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._variableDeclarator);
        if (this._staticKeyword !== null) { array.splice(index, 0, this._staticKeyword); }
        if (this._publicOrPrivateKeyword !== null) { array.splice(index, 0, this._publicOrPrivateKeyword); }
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

        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, /*parsedInStrictMode:*/ false);
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
        if (this._publicOrPrivateKeyword !== null) { (<any>this._publicOrPrivateKeyword).collectTextElements(elements); }
        if (this._staticKeyword !== null) { (<any>this._staticKeyword).collectTextElements(elements); }
        (<any>this._variableDeclarator).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._publicOrPrivateKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._staticKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._variableDeclarator.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._variableDeclarator.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._variableDeclarator.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._variableDeclarator.hasRegularExpressionToken();

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._publicOrPrivateKeyword !== null) {
            childWidth = this._publicOrPrivateKeyword.fullWidth();
            if (position < childWidth) { return { token: this._publicOrPrivateKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._staticKeyword !== null) {
            childWidth = this._staticKeyword.fullWidth();
            if (position < childWidth) { return { token: this._staticKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._variableDeclarator.fullWidth();
        if (position < childWidth) { return (<any>this._variableDeclarator).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <MemberVariableDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._publicOrPrivateKeyword, other._publicOrPrivateKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._staticKeyword, other._staticKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._variableDeclarator, other._variableDeclarator)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class ThrowStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _throwKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(throwKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._throwKeyword = throwKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public static create1(expression: IExpressionSyntax): ThrowStatementSyntax {
        return new ThrowStatementSyntax(Syntax.token(SyntaxKind.ThrowKeyword), expression, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitThrowStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ThrowStatement;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._throwKeyword;
            case 1: return this._expression;
            case 2: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._throwKeyword);
    }

    public throwKeyword(): ISyntaxToken {
        return this._throwKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(throwKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  semicolonToken: ISyntaxToken): ThrowStatementSyntax {
        if (this._throwKeyword === throwKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): ThrowStatementSyntax {
        return this.update(this._throwKeyword, expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ThrowStatementSyntax {
        return this.update(this._throwKeyword, this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._throwKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._throwKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._throwKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._throwKeyword.fullWidth();
        if (position < childWidth) { return { token: this._throwKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ThrowStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._throwKeyword, other._throwKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class ReturnStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _returnKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;
    private _semicolonToken: ISyntaxToken;

    constructor(returnKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._returnKeyword = returnKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }

    public static create(returnKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        return new ReturnStatementSyntax(returnKeyword, null, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ReturnStatementSyntax {
        return new ReturnStatementSyntax(Syntax.token(SyntaxKind.ReturnKeyword), null, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitReturnStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ReturnStatement;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._returnKeyword;
            case 1: return this._expression;
            case 2: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        if (this._expression !== null) { array.splice(index, 0, this._expression); }
        array.splice(index, 0, this._returnKeyword);
    }

    public returnKeyword(): ISyntaxToken {
        return this._returnKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(returnKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        if (this._returnKeyword === returnKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): ReturnStatementSyntax {
        return this.update(this._returnKeyword, expression, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): ReturnStatementSyntax {
        return this.update(this._returnKeyword, this._expression, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._returnKeyword).collectTextElements(elements);
        if (this._expression !== null) { (<any>this._expression).collectTextElements(elements); }
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression !== null && this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._returnKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._returnKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._expression !== null) {
            childWidth = this._expression.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();
        }

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._returnKeyword.fullWidth();
        if (position < childWidth) { return { token: this._returnKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._expression !== null) {
            childWidth = this._expression.fullWidth();
            if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ReturnStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._returnKeyword, other._returnKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class ObjectCreationExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _newKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;
    private _argumentList: ArgumentListSyntax;

    constructor(newKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                argumentList: ArgumentListSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
    }

    public static create(newKeyword: ISyntaxToken,
                         expression: IExpressionSyntax): ObjectCreationExpressionSyntax {
        return new ObjectCreationExpressionSyntax(newKeyword, expression, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax): ObjectCreationExpressionSyntax {
        return new ObjectCreationExpressionSyntax(Syntax.token(SyntaxKind.NewKeyword), expression, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectCreationExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectCreationExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._newKeyword;
            case 1: return this._expression;
            case 2: return this._argumentList;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._argumentList !== null) { array.splice(index, 0, this._argumentList); }
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._newKeyword);
    }

    public newKeyword(): ISyntaxToken {
        return this._newKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public argumentList(): ArgumentListSyntax {
        return this._argumentList;
    }

    public update(newKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
        if (this._newKeyword === newKeyword && this._expression === expression && this._argumentList === argumentList) {
            return this;
        }

        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): ObjectCreationExpressionSyntax {
        return this.update(this._newKeyword, expression, this._argumentList);
    }

    public withArgumentList(argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax {
        return this.update(this._newKeyword, this._expression, argumentList);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._newKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
        if (this._argumentList !== null) { (<any>this._argumentList).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._argumentList !== null && this._argumentList.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._newKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._newKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        if (this._argumentList !== null) {
            childWidth = this._argumentList.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._argumentList.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._argumentList.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._argumentList.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._newKeyword.fullWidth();
        if (position < childWidth) { return { token: this._newKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._argumentList !== null) {
            childWidth = this._argumentList.fullWidth();
            if (position < childWidth) { return (<any>this._argumentList).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ObjectCreationExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._newKeyword, other._newKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._argumentList, other._argumentList)) { return false; }
        return true;
    }
}

class SwitchStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _switchKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _expression: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _openBraceToken: ISyntaxToken;
    private _switchClauses: ISyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(switchKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                expression: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                openBraceToken: ISyntaxToken,
                switchClauses: ISyntaxList,
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
                         expression: IExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, Syntax.emptyList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax): SwitchStatementSyntax {
        return new SwitchStatementSyntax(Syntax.token(SyntaxKind.SwitchKeyword), Syntax.token(SyntaxKind.OpenParenToken), expression, Syntax.token(SyntaxKind.CloseParenToken), Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptyList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSwitchStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SwitchStatement;
    }

    private slotCount(): number {
        return 7;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._switchKeyword;
            case 1: return this._openParenToken;
            case 2: return this._expression;
            case 3: return this._closeParenToken;
            case 4: return this._openBraceToken;
            case 5: return this._switchClauses;
            case 6: return this._closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._switchClauses.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._switchKeyword);
    }

    public switchKeyword(): ISyntaxToken {
        return this._switchKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public expression(): IExpressionSyntax {
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
                  expression: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  openBraceToken: ISyntaxToken,
                  switchClauses: ISyntaxList,
                  closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        if (this._switchKeyword === switchKeyword && this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken && this._openBraceToken === openBraceToken && this._switchClauses === switchClauses && this._closeBraceToken === closeBraceToken) {
            return this;
        }

        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): SwitchStatementSyntax {
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
        return this.withSwitchClauses(Syntax.list([switchClause]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): SwitchStatementSyntax {
        return this.update(this._switchKeyword, this._openParenToken, this._expression, this._closeParenToken, this._openBraceToken, this._switchClauses, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._switchKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._switchClauses).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._switchClauses.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._switchKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._switchKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._switchClauses.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._switchClauses.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._switchClauses.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._switchClauses.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._switchKeyword.fullWidth();
        if (position < childWidth) { return { token: this._switchKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._switchClauses.fullWidth();
        if (position < childWidth) { return (<any>this._switchClauses).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <SwitchStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._switchKeyword, other._switchKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.listStructuralEquals(this._switchClauses, other._switchClauses)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
    }
}

class SwitchClauseSyntax extends SyntaxNode implements ISwitchClauseSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
    }

    private isSwitchClause(): bool {
        return true;
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
    private _expression: IExpressionSyntax;
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxList;

    constructor(caseKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                colonToken: ISyntaxToken,
                statements: ISyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._caseKeyword = caseKeyword;
        this._expression = expression;
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public static create(caseKeyword: ISyntaxToken,
                         expression: IExpressionSyntax,
                         colonToken: ISyntaxToken): CaseSwitchClauseSyntax {
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax): CaseSwitchClauseSyntax {
        return new CaseSwitchClauseSyntax(Syntax.token(SyntaxKind.CaseKeyword), expression, Syntax.token(SyntaxKind.ColonToken), Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCaseSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CaseSwitchClause;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._caseKeyword;
            case 1: return this._expression;
            case 2: return this._colonToken;
            case 3: return this._statements;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        this._statements.insertChildrenInto(array, index);
        array.splice(index, 0, this._colonToken);
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._caseKeyword);
    }

    public caseKeyword(): ISyntaxToken {
        return this._caseKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statements(): ISyntaxList {
        return this._statements;
    }

    public update(caseKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  colonToken: ISyntaxToken,
                  statements: ISyntaxList): CaseSwitchClauseSyntax {
        if (this._caseKeyword === caseKeyword && this._expression === expression && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }

        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): CaseSwitchClauseSyntax {
        return this.update(this._caseKeyword, expression, this._colonToken, this._statements);
    }

    public withColonToken(colonToken: ISyntaxToken): CaseSwitchClauseSyntax {
        return this.update(this._caseKeyword, this._expression, colonToken, this._statements);
    }

    public withStatements(statements: ISyntaxList): CaseSwitchClauseSyntax {
        return this.update(this._caseKeyword, this._expression, this._colonToken, statements);
    }

    public withStatement(statement: IStatementSyntax): CaseSwitchClauseSyntax {
        return this.withStatements(Syntax.list([statement]));
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._caseKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
        (<any>this._colonToken).collectTextElements(elements);
        (<any>this._statements).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._statements.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._caseKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._caseKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._colonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._colonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statements.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statements.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statements.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statements.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._caseKeyword.fullWidth();
        if (position < childWidth) { return { token: this._caseKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._colonToken.fullWidth();
        if (position < childWidth) { return { token: this._colonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statements.fullWidth();
        if (position < childWidth) { return (<any>this._statements).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <CaseSwitchClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._caseKeyword, other._caseKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._colonToken, other._colonToken)) { return false; }
        if (!Syntax.listStructuralEquals(this._statements, other._statements)) { return false; }
        return true;
    }
}

class DefaultSwitchClauseSyntax extends SwitchClauseSyntax {
    private _defaultKeyword: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _statements: ISyntaxList;

    constructor(defaultKeyword: ISyntaxToken,
                colonToken: ISyntaxToken,
                statements: ISyntaxList,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._defaultKeyword = defaultKeyword;
        this._colonToken = colonToken;
        this._statements = statements;
    }

    public static create(defaultKeyword: ISyntaxToken,
                         colonToken: ISyntaxToken): DefaultSwitchClauseSyntax {
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public static create1(): DefaultSwitchClauseSyntax {
        return new DefaultSwitchClauseSyntax(Syntax.token(SyntaxKind.DefaultKeyword), Syntax.token(SyntaxKind.ColonToken), Syntax.emptyList, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDefaultSwitchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DefaultSwitchClause;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._defaultKeyword;
            case 1: return this._colonToken;
            case 2: return this._statements;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        this._statements.insertChildrenInto(array, index);
        array.splice(index, 0, this._colonToken);
        array.splice(index, 0, this._defaultKeyword);
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

        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, /*parsedInStrictMode:*/ false);
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

    public withStatement(statement: IStatementSyntax): DefaultSwitchClauseSyntax {
        return this.withStatements(Syntax.list([statement]));
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._defaultKeyword).collectTextElements(elements);
        (<any>this._colonToken).collectTextElements(elements);
        (<any>this._statements).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statements.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._defaultKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._defaultKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._colonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._colonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statements.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statements.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statements.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statements.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._defaultKeyword.fullWidth();
        if (position < childWidth) { return { token: this._defaultKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._colonToken.fullWidth();
        if (position < childWidth) { return { token: this._colonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statements.fullWidth();
        if (position < childWidth) { return (<any>this._statements).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <DefaultSwitchClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._defaultKeyword, other._defaultKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._colonToken, other._colonToken)) { return false; }
        if (!Syntax.listStructuralEquals(this._statements, other._statements)) { return false; }
        return true;
    }
}

class BreakStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _breakKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(breakKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }

    public static create(breakKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): BreakStatementSyntax {
        return new BreakStatementSyntax(breakKeyword, null, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): BreakStatementSyntax {
        return new BreakStatementSyntax(Syntax.token(SyntaxKind.BreakKeyword), null, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitBreakStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.BreakStatement;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._breakKeyword;
            case 1: return this._identifier;
            case 2: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        if (this._identifier !== null) { array.splice(index, 0, this._identifier); }
        array.splice(index, 0, this._breakKeyword);
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

        return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._breakKeyword).collectTextElements(elements);
        if (this._identifier !== null) { (<any>this._identifier).collectTextElements(elements); }
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._breakKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._breakKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._identifier !== null) {
            childWidth = this._identifier.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._breakKeyword.fullWidth();
        if (position < childWidth) { return { token: this._breakKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._identifier !== null) {
            childWidth = this._identifier.fullWidth();
            if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <BreakStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._breakKeyword, other._breakKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class ContinueStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _continueKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(continueKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._continueKeyword = continueKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }

    public static create(continueKeyword: ISyntaxToken,
                         semicolonToken: ISyntaxToken): ContinueStatementSyntax {
        return new ContinueStatementSyntax(continueKeyword, null, semicolonToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ContinueStatementSyntax {
        return new ContinueStatementSyntax(Syntax.token(SyntaxKind.ContinueKeyword), null, Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitContinueStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ContinueStatement;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._continueKeyword;
            case 1: return this._identifier;
            case 2: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        if (this._identifier !== null) { array.splice(index, 0, this._identifier); }
        array.splice(index, 0, this._continueKeyword);
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

        return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._continueKeyword).collectTextElements(elements);
        if (this._identifier !== null) { (<any>this._identifier).collectTextElements(elements); }
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._continueKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._continueKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._identifier !== null) {
            childWidth = this._identifier.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._continueKeyword.fullWidth();
        if (position < childWidth) { return { token: this._continueKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._identifier !== null) {
            childWidth = this._identifier.fullWidth();
            if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ContinueStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._continueKeyword, other._continueKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class IterationStatementSyntax extends SyntaxNode implements IStatementSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public openParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public closeParenToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    public statement(): IStatementSyntax {
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
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
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

    public statement(): IStatementSyntax {
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
    private _initializer: IExpressionSyntax;
    private _firstSemicolonToken: ISyntaxToken;
    private _condition: IExpressionSyntax;
    private _secondSemicolonToken: ISyntaxToken;
    private _incrementor: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: IStatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                initializer: IExpressionSyntax,
                firstSemicolonToken: ISyntaxToken,
                condition: IExpressionSyntax,
                secondSemicolonToken: ISyntaxToken,
                incrementor: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
                         statement: IStatementSyntax): ForStatementSyntax {
        return new ForStatementSyntax(forKeyword, openParenToken, null, null, firstSemicolonToken, null, secondSemicolonToken, null, closeParenToken, statement, /*parsedInStrictMode:*/ false);
    }

    public static create1(statement: IStatementSyntax): ForStatementSyntax {
        return new ForStatementSyntax(Syntax.token(SyntaxKind.ForKeyword), Syntax.token(SyntaxKind.OpenParenToken), null, null, Syntax.token(SyntaxKind.SemicolonToken), null, Syntax.token(SyntaxKind.SemicolonToken), null, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitForStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForStatement;
    }

    private slotCount(): number {
        return 10;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._forKeyword;
            case 1: return this._openParenToken;
            case 2: return this._variableDeclaration;
            case 3: return this._initializer;
            case 4: return this._firstSemicolonToken;
            case 5: return this._condition;
            case 6: return this._secondSemicolonToken;
            case 7: return this._incrementor;
            case 8: return this._closeParenToken;
            case 9: return this._statement;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._closeParenToken);
        if (this._incrementor !== null) { array.splice(index, 0, this._incrementor); }
        array.splice(index, 0, this._secondSemicolonToken);
        if (this._condition !== null) { array.splice(index, 0, this._condition); }
        array.splice(index, 0, this._firstSemicolonToken);
        if (this._initializer !== null) { array.splice(index, 0, this._initializer); }
        if (this._variableDeclaration !== null) { array.splice(index, 0, this._variableDeclaration); }
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._forKeyword);
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

    public initializer(): IExpressionSyntax {
        return this._initializer;
    }

    public firstSemicolonToken(): ISyntaxToken {
        return this._firstSemicolonToken;
    }

    public condition(): IExpressionSyntax {
        return this._condition;
    }

    public secondSemicolonToken(): ISyntaxToken {
        return this._secondSemicolonToken;
    }

    public incrementor(): IExpressionSyntax {
        return this._incrementor;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): IStatementSyntax {
        return this._statement;
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
        if (this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._initializer === initializer && this._firstSemicolonToken === firstSemicolonToken && this._condition === condition && this._secondSemicolonToken === secondSemicolonToken && this._incrementor === incrementor && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, /*parsedInStrictMode:*/ false);
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

    public withInitializer(initializer: IExpressionSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withFirstSemicolonToken(firstSemicolonToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withCondition(condition: IExpressionSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withSecondSemicolonToken(secondSemicolonToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, secondSemicolonToken, this._incrementor, this._closeParenToken, this._statement);
    }

    public withIncrementor(incrementor: IExpressionSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, incrementor, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, closeParenToken, this._statement);
    }

    public withStatement(statement: IStatementSyntax): ForStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._initializer, this._firstSemicolonToken, this._condition, this._secondSemicolonToken, this._incrementor, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._forKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        if (this._variableDeclaration !== null) { (<any>this._variableDeclaration).collectTextElements(elements); }
        if (this._initializer !== null) { (<any>this._initializer).collectTextElements(elements); }
        (<any>this._firstSemicolonToken).collectTextElements(elements);
        if (this._condition !== null) { (<any>this._condition).collectTextElements(elements); }
        (<any>this._secondSemicolonToken).collectTextElements(elements);
        if (this._incrementor !== null) { (<any>this._incrementor).collectTextElements(elements); }
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._variableDeclaration !== null && this._variableDeclaration.isTypeScriptSpecific()) { return true; }
        if (this._initializer !== null && this._initializer.isTypeScriptSpecific()) { return true; }
        if (this._condition !== null && this._condition.isTypeScriptSpecific()) { return true; }
        if (this._incrementor !== null && this._incrementor.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._forKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._forKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._variableDeclaration !== null) {
            childWidth = this._variableDeclaration.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._variableDeclaration.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._variableDeclaration.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._variableDeclaration.hasRegularExpressionToken();
        }

        if (this._initializer !== null) {
            childWidth = this._initializer.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._initializer.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._initializer.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._initializer.hasRegularExpressionToken();
        }

        childWidth = this._firstSemicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._firstSemicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._condition !== null) {
            childWidth = this._condition.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._condition.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._condition.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._condition.hasRegularExpressionToken();
        }

        childWidth = this._secondSemicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._secondSemicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._incrementor !== null) {
            childWidth = this._incrementor.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._incrementor.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._incrementor.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._incrementor.hasRegularExpressionToken();
        }

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._forKeyword.fullWidth();
        if (position < childWidth) { return { token: this._forKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._variableDeclaration !== null) {
            childWidth = this._variableDeclaration.fullWidth();
            if (position < childWidth) { return (<any>this._variableDeclaration).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._initializer !== null) {
            childWidth = this._initializer.fullWidth();
            if (position < childWidth) { return (<any>this._initializer).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._firstSemicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._firstSemicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._condition !== null) {
            childWidth = this._condition.fullWidth();
            if (position < childWidth) { return (<any>this._condition).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._secondSemicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._secondSemicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._incrementor !== null) {
            childWidth = this._incrementor.fullWidth();
            if (position < childWidth) { return (<any>this._incrementor).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ForStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._forKeyword, other._forKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._variableDeclaration, other._variableDeclaration)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._initializer, other._initializer)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._firstSemicolonToken, other._firstSemicolonToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._condition, other._condition)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._secondSemicolonToken, other._secondSemicolonToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._incrementor, other._incrementor)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        return true;
    }
}

class ForInStatementSyntax extends BaseForStatementSyntax {
    private _forKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _variableDeclaration: VariableDeclarationSyntax;
    private _left: IExpressionSyntax;
    private _inKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: IStatementSyntax;

    constructor(forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                left: IExpressionSyntax,
                inKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
                         expression: IExpressionSyntax,
                         closeParenToken: ISyntaxToken,
                         statement: IStatementSyntax): ForInStatementSyntax {
        return new ForInStatementSyntax(forKeyword, openParenToken, null, null, inKeyword, expression, closeParenToken, statement, /*parsedInStrictMode:*/ false);
    }

    public static create1(expression: IExpressionSyntax,
                          statement: IStatementSyntax): ForInStatementSyntax {
        return new ForInStatementSyntax(Syntax.token(SyntaxKind.ForKeyword), Syntax.token(SyntaxKind.OpenParenToken), null, null, Syntax.token(SyntaxKind.InKeyword), expression, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitForInStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ForInStatement;
    }

    private slotCount(): number {
        return 8;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._forKeyword;
            case 1: return this._openParenToken;
            case 2: return this._variableDeclaration;
            case 3: return this._left;
            case 4: return this._inKeyword;
            case 5: return this._expression;
            case 6: return this._closeParenToken;
            case 7: return this._statement;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._inKeyword);
        if (this._left !== null) { array.splice(index, 0, this._left); }
        if (this._variableDeclaration !== null) { array.splice(index, 0, this._variableDeclaration); }
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._forKeyword);
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

    public left(): IExpressionSyntax {
        return this._left;
    }

    public inKeyword(): ISyntaxToken {
        return this._inKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public update(forKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  variableDeclaration: VariableDeclarationSyntax,
                  left: IExpressionSyntax,
                  inKeyword: ISyntaxToken,
                  expression: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): ForInStatementSyntax {
        if (this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._left === left && this._inKeyword === inKeyword && this._expression === expression && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, /*parsedInStrictMode:*/ false);
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

    public withLeft(left: IExpressionSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, left, this._inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withInKeyword(inKeyword: ISyntaxToken): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, inKeyword, this._expression, this._closeParenToken, this._statement);
    }

    public withExpression(expression: IExpressionSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, expression, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, this._expression, closeParenToken, this._statement);
    }

    public withStatement(statement: IStatementSyntax): ForInStatementSyntax {
        return this.update(this._forKeyword, this._openParenToken, this._variableDeclaration, this._left, this._inKeyword, this._expression, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._forKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        if (this._variableDeclaration !== null) { (<any>this._variableDeclaration).collectTextElements(elements); }
        if (this._left !== null) { (<any>this._left).collectTextElements(elements); }
        (<any>this._inKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._variableDeclaration !== null && this._variableDeclaration.isTypeScriptSpecific()) { return true; }
        if (this._left !== null && this._left.isTypeScriptSpecific()) { return true; }
        if (this._expression.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._forKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._forKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._variableDeclaration !== null) {
            childWidth = this._variableDeclaration.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._variableDeclaration.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._variableDeclaration.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._variableDeclaration.hasRegularExpressionToken();
        }

        if (this._left !== null) {
            childWidth = this._left.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._left.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._left.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._left.hasRegularExpressionToken();
        }

        childWidth = this._inKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._inKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._forKeyword.fullWidth();
        if (position < childWidth) { return { token: this._forKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._variableDeclaration !== null) {
            childWidth = this._variableDeclaration.fullWidth();
            if (position < childWidth) { return (<any>this._variableDeclaration).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._left !== null) {
            childWidth = this._left.fullWidth();
            if (position < childWidth) { return (<any>this._left).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._inKeyword.fullWidth();
        if (position < childWidth) { return { token: this._inKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ForInStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._forKeyword, other._forKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._variableDeclaration, other._variableDeclaration)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._left, other._left)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._inKeyword, other._inKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        return true;
    }
}

class WhileStatementSyntax extends IterationStatementSyntax {
    private _whileKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: IStatementSyntax;

    constructor(whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public static create1(condition: IExpressionSyntax,
                          statement: IStatementSyntax): WhileStatementSyntax {
        return new WhileStatementSyntax(Syntax.token(SyntaxKind.WhileKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitWhileStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WhileStatement;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._whileKeyword;
            case 1: return this._openParenToken;
            case 2: return this._condition;
            case 3: return this._closeParenToken;
            case 4: return this._statement;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._condition);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._whileKeyword);
    }

    public whileKeyword(): ISyntaxToken {
        return this._whileKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): IExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public update(whileKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): WhileStatementSyntax {
        if (this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ false);
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

    public withCondition(condition: IExpressionSyntax): WhileStatementSyntax {
        return this.update(this._whileKeyword, this._openParenToken, condition, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): WhileStatementSyntax {
        return this.update(this._whileKeyword, this._openParenToken, this._condition, closeParenToken, this._statement);
    }

    public withStatement(statement: IStatementSyntax): WhileStatementSyntax {
        return this.update(this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._whileKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._condition).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._whileKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._whileKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._condition.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._condition.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._condition.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._condition.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._whileKeyword.fullWidth();
        if (position < childWidth) { return { token: this._whileKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._condition.fullWidth();
        if (position < childWidth) { return (<any>this._condition).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <WhileStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._whileKeyword, other._whileKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._condition, other._condition)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        return true;
    }
}

class WithStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _withKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _statement: IStatementSyntax;

    constructor(withKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._withKeyword = withKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }

    public static create1(condition: IExpressionSyntax,
                          statement: IStatementSyntax): WithStatementSyntax {
        return new WithStatementSyntax(Syntax.token(SyntaxKind.WithKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), statement, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitWithStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.WithStatement;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._withKeyword;
            case 1: return this._openParenToken;
            case 2: return this._condition;
            case 3: return this._closeParenToken;
            case 4: return this._statement;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._condition);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._withKeyword);
    }

    public withKeyword(): ISyntaxToken {
        return this._withKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): IExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public update(withKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  statement: IStatementSyntax): WithStatementSyntax {
        if (this._withKeyword === withKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }

        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, /*parsedInStrictMode:*/ false);
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

    public withCondition(condition: IExpressionSyntax): WithStatementSyntax {
        return this.update(this._withKeyword, this._openParenToken, condition, this._closeParenToken, this._statement);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): WithStatementSyntax {
        return this.update(this._withKeyword, this._openParenToken, this._condition, closeParenToken, this._statement);
    }

    public withStatement(statement: IStatementSyntax): WithStatementSyntax {
        return this.update(this._withKeyword, this._openParenToken, this._condition, this._closeParenToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._withKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._condition).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._condition.isTypeScriptSpecific()) { return true; }
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._withKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._withKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._condition.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._condition.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._condition.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._condition.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._withKeyword.fullWidth();
        if (position < childWidth) { return { token: this._withKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._condition.fullWidth();
        if (position < childWidth) { return (<any>this._condition).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <WithStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._withKeyword, other._withKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._condition, other._condition)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        return true;
    }
}

class EnumDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
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
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

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
        return new EnumDeclarationSyntax(null, enumKeyword, identifier, openBraceToken, Syntax.emptySeparatedList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(identifier: ISyntaxToken): EnumDeclarationSyntax {
        return new EnumDeclarationSyntax(null, Syntax.token(SyntaxKind.EnumKeyword), identifier, Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEnumDeclaration(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EnumDeclaration;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._exportKeyword;
            case 1: return this._enumKeyword;
            case 2: return this._identifier;
            case 3: return this._openBraceToken;
            case 4: return this._variableDeclarators;
            case 5: return this._closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._variableDeclarators.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._enumKeyword);
        if (this._exportKeyword !== null) { array.splice(index, 0, this._exportKeyword); }
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

        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, /*parsedInStrictMode:*/ false);
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
        return this.withVariableDeclarators(Syntax.separatedList([variableDeclarator]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): EnumDeclarationSyntax {
        return this.update(this._exportKeyword, this._enumKeyword, this._identifier, this._openBraceToken, this._variableDeclarators, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        if (this._exportKeyword !== null) { (<any>this._exportKeyword).collectTextElements(elements); }
        (<any>this._enumKeyword).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._variableDeclarators).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._exportKeyword.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._enumKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._enumKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._variableDeclarators.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._variableDeclarators.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._variableDeclarators.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._variableDeclarators.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        if (this._exportKeyword !== null) {
            childWidth = this._exportKeyword.fullWidth();
            if (position < childWidth) { return { token: this._exportKeyword, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._enumKeyword.fullWidth();
        if (position < childWidth) { return { token: this._enumKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._variableDeclarators.fullWidth();
        if (position < childWidth) { return (<any>this._variableDeclarators).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <EnumDeclarationSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._exportKeyword, other._exportKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._enumKeyword, other._enumKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._variableDeclarators, other._variableDeclarators)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
    }
}

class CastExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _lessThanToken: ISyntaxToken;
    private _type: ITypeSyntax;
    private _greaterThanToken: ISyntaxToken;
    private _expression: IUnaryExpressionSyntax;

    constructor(lessThanToken: ISyntaxToken,
                type: ITypeSyntax,
                greaterThanToken: ISyntaxToken,
                expression: IUnaryExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
    }

    public static create1(type: ITypeSyntax,
                          expression: IUnaryExpressionSyntax): CastExpressionSyntax {
        return new CastExpressionSyntax(Syntax.token(SyntaxKind.LessThanToken), type, Syntax.token(SyntaxKind.GreaterThanToken), expression, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCastExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CastExpression;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._lessThanToken;
            case 1: return this._type;
            case 2: return this._greaterThanToken;
            case 3: return this._expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._greaterThanToken);
        array.splice(index, 0, this._type);
        array.splice(index, 0, this._lessThanToken);
    }

    public lessThanToken(): ISyntaxToken {
        return this._lessThanToken;
    }

    public type(): ITypeSyntax {
        return this._type;
    }

    public greaterThanToken(): ISyntaxToken {
        return this._greaterThanToken;
    }

    public expression(): IUnaryExpressionSyntax {
        return this._expression;
    }

    public update(lessThanToken: ISyntaxToken,
                  type: ITypeSyntax,
                  greaterThanToken: ISyntaxToken,
                  expression: IUnaryExpressionSyntax): CastExpressionSyntax {
        if (this._lessThanToken === lessThanToken && this._type === type && this._greaterThanToken === greaterThanToken && this._expression === expression) {
            return this;
        }

        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, /*parsedInStrictMode:*/ false);
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

    public withType(type: ITypeSyntax): CastExpressionSyntax {
        return this.update(this._lessThanToken, type, this._greaterThanToken, this._expression);
    }

    public withGreaterThanToken(greaterThanToken: ISyntaxToken): CastExpressionSyntax {
        return this.update(this._lessThanToken, this._type, greaterThanToken, this._expression);
    }

    public withExpression(expression: IUnaryExpressionSyntax): CastExpressionSyntax {
        return this.update(this._lessThanToken, this._type, this._greaterThanToken, expression);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._lessThanToken).collectTextElements(elements);
        (<any>this._type).collectTextElements(elements);
        (<any>this._greaterThanToken).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return true;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._lessThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._lessThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._type.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._type.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._type.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._type.hasRegularExpressionToken();

        childWidth = this._greaterThanToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._greaterThanToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._lessThanToken.fullWidth();
        if (position < childWidth) { return { token: this._lessThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._type.fullWidth();
        if (position < childWidth) { return (<any>this._type).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._greaterThanToken.fullWidth();
        if (position < childWidth) { return { token: this._greaterThanToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <CastExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._lessThanToken, other._lessThanToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._type, other._type)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._greaterThanToken, other._greaterThanToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        return true;
    }
}

class ObjectLiteralExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _openBraceToken: ISyntaxToken;
    private _propertyAssignments: ISeparatedSyntaxList;
    private _closeBraceToken: ISyntaxToken;

    constructor(openBraceToken: ISyntaxToken,
                propertyAssignments: ISeparatedSyntaxList,
                closeBraceToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
    }

    public static create(openBraceToken: ISyntaxToken,
                         closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return new ObjectLiteralExpressionSyntax(openBraceToken, Syntax.emptySeparatedList, closeBraceToken, /*parsedInStrictMode:*/ false);
    }

    public static create1(): ObjectLiteralExpressionSyntax {
        return new ObjectLiteralExpressionSyntax(Syntax.token(SyntaxKind.OpenBraceToken), Syntax.emptySeparatedList, Syntax.token(SyntaxKind.CloseBraceToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitObjectLiteralExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.ObjectLiteralExpression;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._openBraceToken;
            case 1: return this._propertyAssignments;
            case 2: return this._closeBraceToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._closeBraceToken);
        this._propertyAssignments.insertChildrenInto(array, index);
        array.splice(index, 0, this._openBraceToken);
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

        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, /*parsedInStrictMode:*/ false);
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
        return this.withPropertyAssignments(Syntax.separatedList([propertyAssignment]));
    }

    public withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax {
        return this.update(this._openBraceToken, this._propertyAssignments, closeBraceToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._openBraceToken).collectTextElements(elements);
        (<any>this._propertyAssignments).collectTextElements(elements);
        (<any>this._closeBraceToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._propertyAssignments.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._openBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._propertyAssignments.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._propertyAssignments.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._propertyAssignments.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._propertyAssignments.hasRegularExpressionToken();

        childWidth = this._closeBraceToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeBraceToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._openBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._openBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._propertyAssignments.fullWidth();
        if (position < childWidth) { return (<any>this._propertyAssignments).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeBraceToken.fullWidth();
        if (position < childWidth) { return { token: this._closeBraceToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <ObjectLiteralExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._openBraceToken, other._openBraceToken)) { return false; }
        if (!Syntax.separatedListStructuralEquals(this._propertyAssignments, other._propertyAssignments)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeBraceToken, other._closeBraceToken)) { return false; }
        return true;
    }
}

class PropertyAssignmentSyntax extends SyntaxNode {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
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
    private _expression: IExpressionSyntax;

    constructor(propertyName: ISyntaxToken,
                colonToken: ISyntaxToken,
                expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._propertyName = propertyName;
        this._colonToken = colonToken;
        this._expression = expression;
    }

    public static create1(propertyName: ISyntaxToken,
                          expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
        return new SimplePropertyAssignmentSyntax(propertyName, Syntax.token(SyntaxKind.ColonToken), expression, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSimplePropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SimplePropertyAssignment;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._propertyName;
            case 1: return this._colonToken;
            case 2: return this._expression;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._colonToken);
        array.splice(index, 0, this._propertyName);
    }

    public propertyName(): ISyntaxToken {
        return this._propertyName;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public update(propertyName: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
        if (this._propertyName === propertyName && this._colonToken === colonToken && this._expression === expression) {
            return this;
        }

        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): SimplePropertyAssignmentSyntax {
        return this.update(this._propertyName, this._colonToken, expression);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._propertyName).collectTextElements(elements);
        (<any>this._colonToken).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._propertyName.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._propertyName.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._colonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._colonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._propertyName.fullWidth();
        if (position < childWidth) { return { token: this._propertyName, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._colonToken.fullWidth();
        if (position < childWidth) { return { token: this._colonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <SimplePropertyAssignmentSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._propertyName, other._propertyName)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._colonToken, other._colonToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        return true;
    }
}

class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
    constructor(parsedInStrictMode: bool) {
        super(parsedInStrictMode);
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
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._getKeyword = getKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public static create1(propertyName: ISyntaxToken): GetAccessorPropertyAssignmentSyntax {
        return new GetAccessorPropertyAssignmentSyntax(Syntax.token(SyntaxKind.GetKeyword), propertyName, Syntax.token(SyntaxKind.OpenParenToken), Syntax.token(SyntaxKind.CloseParenToken), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitGetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.GetAccessorPropertyAssignment;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._getKeyword;
            case 1: return this._propertyName;
            case 2: return this._openParenToken;
            case 3: return this._closeParenToken;
            case 4: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._propertyName);
        array.splice(index, 0, this._getKeyword);
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

        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, /*parsedInStrictMode:*/ false);
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
        (<any>this._getKeyword).collectTextElements(elements);
        (<any>this._propertyName).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._getKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._getKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._propertyName.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._propertyName.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._getKeyword.fullWidth();
        if (position < childWidth) { return { token: this._getKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._propertyName.fullWidth();
        if (position < childWidth) { return { token: this._propertyName, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <GetAccessorPropertyAssignmentSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._getKeyword, other._getKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._propertyName, other._propertyName)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        return true;
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
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._setKeyword = setKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._parameterName = parameterName;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public static create1(propertyName: ISyntaxToken,
                          parameterName: ISyntaxToken): SetAccessorPropertyAssignmentSyntax {
        return new SetAccessorPropertyAssignmentSyntax(Syntax.token(SyntaxKind.SetKeyword), propertyName, Syntax.token(SyntaxKind.OpenParenToken), parameterName, Syntax.token(SyntaxKind.CloseParenToken), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitSetAccessorPropertyAssignment(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.SetAccessorPropertyAssignment;
    }

    private slotCount(): number {
        return 6;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._setKeyword;
            case 1: return this._propertyName;
            case 2: return this._openParenToken;
            case 3: return this._parameterName;
            case 4: return this._closeParenToken;
            case 5: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._parameterName);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._propertyName);
        array.splice(index, 0, this._setKeyword);
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

        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, /*parsedInStrictMode:*/ false);
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
        (<any>this._setKeyword).collectTextElements(elements);
        (<any>this._propertyName).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._parameterName).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._setKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._setKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._propertyName.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._propertyName.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._parameterName.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._parameterName.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._setKeyword.fullWidth();
        if (position < childWidth) { return { token: this._setKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._propertyName.fullWidth();
        if (position < childWidth) { return { token: this._propertyName, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._parameterName.fullWidth();
        if (position < childWidth) { return { token: this._parameterName, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <SetAccessorPropertyAssignmentSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._setKeyword, other._setKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._propertyName, other._propertyName)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._parameterName, other._parameterName)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        return true;
    }
}

class FunctionExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _functionKeyword: ISyntaxToken;
    private _identifier: ISyntaxToken;
    private _callSignature: CallSignatureSyntax;
    private _block: BlockSyntax;

    constructor(functionKeyword: ISyntaxToken,
                identifier: ISyntaxToken,
                callSignature: CallSignatureSyntax,
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._functionKeyword = functionKeyword;
        this._identifier = identifier;
        this._callSignature = callSignature;
        this._block = block;
    }

    public static create(functionKeyword: ISyntaxToken,
                         callSignature: CallSignatureSyntax,
                         block: BlockSyntax): FunctionExpressionSyntax {
        return new FunctionExpressionSyntax(functionKeyword, null, callSignature, block, /*parsedInStrictMode:*/ false);
    }

    public static create1(): FunctionExpressionSyntax {
        return new FunctionExpressionSyntax(Syntax.token(SyntaxKind.FunctionKeyword), null, CallSignatureSyntax.create1(), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFunctionExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FunctionExpression;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._functionKeyword;
            case 1: return this._identifier;
            case 2: return this._callSignature;
            case 3: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._callSignature);
        if (this._identifier !== null) { array.splice(index, 0, this._identifier); }
        array.splice(index, 0, this._functionKeyword);
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

        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, /*parsedInStrictMode:*/ false);
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
        (<any>this._functionKeyword).collectTextElements(elements);
        if (this._identifier !== null) { (<any>this._identifier).collectTextElements(elements); }
        (<any>this._callSignature).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._callSignature.isTypeScriptSpecific()) { return true; }
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._functionKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._functionKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        if (this._identifier !== null) {
            childWidth = this._identifier.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
        }

        childWidth = this._callSignature.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._callSignature.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._callSignature.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._callSignature.hasRegularExpressionToken();

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._functionKeyword.fullWidth();
        if (position < childWidth) { return { token: this._functionKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        if (this._identifier !== null) {
            childWidth = this._identifier.fullWidth();
            if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
            position -= childWidth;
            fullStart += childWidth;
        }

        childWidth = this._callSignature.fullWidth();
        if (position < childWidth) { return (<any>this._callSignature).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <FunctionExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._functionKeyword, other._functionKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._callSignature, other._callSignature)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        return true;
    }
}

class EmptyStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _semicolonToken: ISyntaxToken;

    constructor(semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._semicolonToken = semicolonToken;
    }

    public static create1(): EmptyStatementSyntax {
        return new EmptyStatementSyntax(Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitEmptyStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.EmptyStatement;
    }

    private slotCount(): number {
        return 1;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    private update(semicolonToken: ISyntaxToken): EmptyStatementSyntax {
        if (this._semicolonToken === semicolonToken) {
            return this;
        }

        return new EmptyStatementSyntax(semicolonToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <EmptyStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class TryStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _tryKeyword: ISyntaxToken;
    private _block: BlockSyntax;
    private _catchClause: CatchClauseSyntax;
    private _finallyClause: FinallyClauseSyntax;

    constructor(tryKeyword: ISyntaxToken,
                block: BlockSyntax,
                catchClause: CatchClauseSyntax,
                finallyClause: FinallyClauseSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._tryKeyword = tryKeyword;
        this._block = block;
        this._catchClause = catchClause;
        this._finallyClause = finallyClause;
    }

    public static create(tryKeyword: ISyntaxToken,
                         block: BlockSyntax): TryStatementSyntax {
        return new TryStatementSyntax(tryKeyword, block, null, null, /*parsedInStrictMode:*/ false);
    }

    public static create1(): TryStatementSyntax {
        return new TryStatementSyntax(Syntax.token(SyntaxKind.TryKeyword), BlockSyntax.create1(), null, null, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTryStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TryStatement;
    }

    private slotCount(): number {
        return 4;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._tryKeyword;
            case 1: return this._block;
            case 2: return this._catchClause;
            case 3: return this._finallyClause;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        if (this._finallyClause !== null) { array.splice(index, 0, this._finallyClause); }
        if (this._catchClause !== null) { array.splice(index, 0, this._catchClause); }
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._tryKeyword);
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

        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, /*parsedInStrictMode:*/ false);
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
        (<any>this._tryKeyword).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
        if (this._catchClause !== null) { (<any>this._catchClause).collectTextElements(elements); }
        if (this._finallyClause !== null) { (<any>this._finallyClause).collectTextElements(elements); }
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        if (this._catchClause !== null && this._catchClause.isTypeScriptSpecific()) { return true; }
        if (this._finallyClause !== null && this._finallyClause.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._tryKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._tryKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        if (this._catchClause !== null) {
            childWidth = this._catchClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._catchClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._catchClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._catchClause.hasRegularExpressionToken();
        }

        if (this._finallyClause !== null) {
            childWidth = this._finallyClause.fullWidth();
            fullWidth += childWidth;
            hasSkippedText = hasSkippedText || this._finallyClause.hasSkippedText();
            hasZeroWidthToken = hasZeroWidthToken || this._finallyClause.hasZeroWidthToken();
            hasRegularExpressionToken = hasRegularExpressionToken || this._finallyClause.hasRegularExpressionToken();
        }

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._tryKeyword.fullWidth();
        if (position < childWidth) { return { token: this._tryKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        if (this._catchClause !== null) {
            childWidth = this._catchClause.fullWidth();
            if (position < childWidth) { return (<any>this._catchClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        if (this._finallyClause !== null) {
            childWidth = this._finallyClause.fullWidth();
            if (position < childWidth) { return (<any>this._finallyClause).findTokenInternal(position, fullStart); }
            position -= childWidth;
            fullStart += childWidth;
        }

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <TryStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._tryKeyword, other._tryKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._catchClause, other._catchClause)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._finallyClause, other._finallyClause)) { return false; }
        return true;
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
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._catchKeyword = catchKeyword;
        this._openParenToken = openParenToken;
        this._identifier = identifier;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }

    public static create1(identifier: ISyntaxToken): CatchClauseSyntax {
        return new CatchClauseSyntax(Syntax.token(SyntaxKind.CatchKeyword), Syntax.token(SyntaxKind.OpenParenToken), identifier, Syntax.token(SyntaxKind.CloseParenToken), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitCatchClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.CatchClause;
    }

    private slotCount(): number {
        return 5;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._catchKeyword;
            case 1: return this._openParenToken;
            case 2: return this._identifier;
            case 3: return this._closeParenToken;
            case 4: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._identifier);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._catchKeyword);
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

        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, /*parsedInStrictMode:*/ false);
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
        (<any>this._catchKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._catchKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._catchKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._catchKeyword.fullWidth();
        if (position < childWidth) { return { token: this._catchKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <CatchClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._catchKeyword, other._catchKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        return true;
    }
}

class FinallyClauseSyntax extends SyntaxNode {
    private _finallyKeyword: ISyntaxToken;
    private _block: BlockSyntax;

    constructor(finallyKeyword: ISyntaxToken,
                block: BlockSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._finallyKeyword = finallyKeyword;
        this._block = block;
    }

    public static create1(): FinallyClauseSyntax {
        return new FinallyClauseSyntax(Syntax.token(SyntaxKind.FinallyKeyword), BlockSyntax.create1(), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitFinallyClause(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.FinallyClause;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._finallyKeyword;
            case 1: return this._block;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._block);
        array.splice(index, 0, this._finallyKeyword);
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

        return new FinallyClauseSyntax(finallyKeyword, block, /*parsedInStrictMode:*/ false);
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
        (<any>this._finallyKeyword).collectTextElements(elements);
        (<any>this._block).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._block.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._finallyKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._finallyKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._block.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._block.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._block.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._block.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._finallyKeyword.fullWidth();
        if (position < childWidth) { return { token: this._finallyKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._block.fullWidth();
        if (position < childWidth) { return (<any>this._block).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <FinallyClauseSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._finallyKeyword, other._finallyKeyword)) { return false; }
        if (!Syntax.nodeStructuralEquals(this._block, other._block)) { return false; }
        return true;
    }
}

class LabeledStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _identifier: ISyntaxToken;
    private _colonToken: ISyntaxToken;
    private _statement: IStatementSyntax;

    constructor(identifier: ISyntaxToken,
                colonToken: ISyntaxToken,
                statement: IStatementSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._identifier = identifier;
        this._colonToken = colonToken;
        this._statement = statement;
    }

    public static create1(identifier: ISyntaxToken,
                          statement: IStatementSyntax): LabeledStatementSyntax {
        return new LabeledStatementSyntax(identifier, Syntax.token(SyntaxKind.ColonToken), statement, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitLabeledStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.LabeledStatement;
    }

    private slotCount(): number {
        return 3;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._identifier;
            case 1: return this._colonToken;
            case 2: return this._statement;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._colonToken);
        array.splice(index, 0, this._identifier);
    }

    public identifier(): ISyntaxToken {
        return this._identifier;
    }

    public colonToken(): ISyntaxToken {
        return this._colonToken;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public update(identifier: ISyntaxToken,
                  colonToken: ISyntaxToken,
                  statement: IStatementSyntax): LabeledStatementSyntax {
        if (this._identifier === identifier && this._colonToken === colonToken && this._statement === statement) {
            return this;
        }

        return new LabeledStatementSyntax(identifier, colonToken, statement, /*parsedInStrictMode:*/ false);
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): LabeledStatementSyntax {
        return <LabeledStatementSyntax>super.withLeadingTrivia(trivia);
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): LabeledStatementSyntax {
        return <LabeledStatementSyntax>super.withTrailingTrivia(trivia);
    }

    public withIdentifier(identifier: ISyntaxToken): LabeledStatementSyntax {
        return this.update(identifier, this._colonToken, this._statement);
    }

    public withColonToken(colonToken: ISyntaxToken): LabeledStatementSyntax {
        return this.update(this._identifier, colonToken, this._statement);
    }

    public withStatement(statement: IStatementSyntax): LabeledStatementSyntax {
        return this.update(this._identifier, this._colonToken, statement);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._identifier).collectTextElements(elements);
        (<any>this._colonToken).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statement.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._identifier.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._identifier.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._colonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._colonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._identifier.fullWidth();
        if (position < childWidth) { return { token: this._identifier, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._colonToken.fullWidth();
        if (position < childWidth) { return { token: this._colonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <LabeledStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._identifier, other._identifier)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._colonToken, other._colonToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        return true;
    }
}

class DoStatementSyntax extends IterationStatementSyntax {
    private _doKeyword: ISyntaxToken;
    private _statement: IStatementSyntax;
    private _whileKeyword: ISyntaxToken;
    private _openParenToken: ISyntaxToken;
    private _condition: IExpressionSyntax;
    private _closeParenToken: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(doKeyword: ISyntaxToken,
                statement: IStatementSyntax,
                whileKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                condition: IExpressionSyntax,
                closeParenToken: ISyntaxToken,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._doKeyword = doKeyword;
        this._statement = statement;
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._semicolonToken = semicolonToken;
    }

    public static create1(statement: IStatementSyntax,
                          condition: IExpressionSyntax): DoStatementSyntax {
        return new DoStatementSyntax(Syntax.token(SyntaxKind.DoKeyword), statement, Syntax.token(SyntaxKind.WhileKeyword), Syntax.token(SyntaxKind.OpenParenToken), condition, Syntax.token(SyntaxKind.CloseParenToken), Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDoStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DoStatement;
    }

    private slotCount(): number {
        return 7;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._doKeyword;
            case 1: return this._statement;
            case 2: return this._whileKeyword;
            case 3: return this._openParenToken;
            case 4: return this._condition;
            case 5: return this._closeParenToken;
            case 6: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._closeParenToken);
        array.splice(index, 0, this._condition);
        array.splice(index, 0, this._openParenToken);
        array.splice(index, 0, this._whileKeyword);
        array.splice(index, 0, this._statement);
        array.splice(index, 0, this._doKeyword);
    }

    public doKeyword(): ISyntaxToken {
        return this._doKeyword;
    }

    public statement(): IStatementSyntax {
        return this._statement;
    }

    public whileKeyword(): ISyntaxToken {
        return this._whileKeyword;
    }

    public openParenToken(): ISyntaxToken {
        return this._openParenToken;
    }

    public condition(): IExpressionSyntax {
        return this._condition;
    }

    public closeParenToken(): ISyntaxToken {
        return this._closeParenToken;
    }

    public semicolonToken(): ISyntaxToken {
        return this._semicolonToken;
    }

    public update(doKeyword: ISyntaxToken,
                  statement: IStatementSyntax,
                  whileKeyword: ISyntaxToken,
                  openParenToken: ISyntaxToken,
                  condition: IExpressionSyntax,
                  closeParenToken: ISyntaxToken,
                  semicolonToken: ISyntaxToken): DoStatementSyntax {
        if (this._doKeyword === doKeyword && this._statement === statement && this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._semicolonToken === semicolonToken) {
            return this;
        }

        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, /*parsedInStrictMode:*/ false);
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

    public withStatement(statement: IStatementSyntax): DoStatementSyntax {
        return this.update(this._doKeyword, statement, this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withWhileKeyword(whileKeyword: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, whileKeyword, this._openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withOpenParenToken(openParenToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, openParenToken, this._condition, this._closeParenToken, this._semicolonToken);
    }

    public withCondition(condition: IExpressionSyntax): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, this._openParenToken, condition, this._closeParenToken, this._semicolonToken);
    }

    public withCloseParenToken(closeParenToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, this._openParenToken, this._condition, closeParenToken, this._semicolonToken);
    }

    public withSemicolonToken(semicolonToken: ISyntaxToken): DoStatementSyntax {
        return this.update(this._doKeyword, this._statement, this._whileKeyword, this._openParenToken, this._condition, this._closeParenToken, semicolonToken);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._doKeyword).collectTextElements(elements);
        (<any>this._statement).collectTextElements(elements);
        (<any>this._whileKeyword).collectTextElements(elements);
        (<any>this._openParenToken).collectTextElements(elements);
        (<any>this._condition).collectTextElements(elements);
        (<any>this._closeParenToken).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._statement.isTypeScriptSpecific()) { return true; }
        if (this._condition.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._doKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._doKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._statement.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._statement.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._statement.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._statement.hasRegularExpressionToken();

        childWidth = this._whileKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._whileKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._openParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._openParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._condition.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._condition.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._condition.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._condition.hasRegularExpressionToken();

        childWidth = this._closeParenToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._closeParenToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._doKeyword.fullWidth();
        if (position < childWidth) { return { token: this._doKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._statement.fullWidth();
        if (position < childWidth) { return (<any>this._statement).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._whileKeyword.fullWidth();
        if (position < childWidth) { return { token: this._whileKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._openParenToken.fullWidth();
        if (position < childWidth) { return { token: this._openParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._condition.fullWidth();
        if (position < childWidth) { return (<any>this._condition).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._closeParenToken.fullWidth();
        if (position < childWidth) { return { token: this._closeParenToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <DoStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._doKeyword, other._doKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._statement, other._statement)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._whileKeyword, other._whileKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._openParenToken, other._openParenToken)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._condition, other._condition)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._closeParenToken, other._closeParenToken)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}

class TypeOfExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _typeOfKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;

    constructor(typeOfKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._typeOfKeyword = typeOfKeyword;
        this._expression = expression;
    }

    public static create1(expression: IExpressionSyntax): TypeOfExpressionSyntax {
        return new TypeOfExpressionSyntax(Syntax.token(SyntaxKind.TypeOfKeyword), expression, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitTypeOfExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.TypeOfExpression;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._typeOfKeyword;
            case 1: return this._expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._typeOfKeyword);
    }

    public typeOfKeyword(): ISyntaxToken {
        return this._typeOfKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public update(typeOfKeyword: ISyntaxToken,
                  expression: IExpressionSyntax): TypeOfExpressionSyntax {
        if (this._typeOfKeyword === typeOfKeyword && this._expression === expression) {
            return this;
        }

        return new TypeOfExpressionSyntax(typeOfKeyword, expression, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): TypeOfExpressionSyntax {
        return this.update(this._typeOfKeyword, expression);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._typeOfKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._typeOfKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._typeOfKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._typeOfKeyword.fullWidth();
        if (position < childWidth) { return { token: this._typeOfKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <TypeOfExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._typeOfKeyword, other._typeOfKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        return true;
    }
}

class DeleteExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _deleteKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;

    constructor(deleteKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._deleteKeyword = deleteKeyword;
        this._expression = expression;
    }

    public static create1(expression: IExpressionSyntax): DeleteExpressionSyntax {
        return new DeleteExpressionSyntax(Syntax.token(SyntaxKind.DeleteKeyword), expression, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDeleteExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DeleteExpression;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._deleteKeyword;
            case 1: return this._expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._deleteKeyword);
    }

    public deleteKeyword(): ISyntaxToken {
        return this._deleteKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public update(deleteKeyword: ISyntaxToken,
                  expression: IExpressionSyntax): DeleteExpressionSyntax {
        if (this._deleteKeyword === deleteKeyword && this._expression === expression) {
            return this;
        }

        return new DeleteExpressionSyntax(deleteKeyword, expression, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): DeleteExpressionSyntax {
        return this.update(this._deleteKeyword, expression);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._deleteKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._deleteKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._deleteKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._deleteKeyword.fullWidth();
        if (position < childWidth) { return { token: this._deleteKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <DeleteExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._deleteKeyword, other._deleteKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        return true;
    }
}

class VoidExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
    private _voidKeyword: ISyntaxToken;
    private _expression: IExpressionSyntax;

    constructor(voidKeyword: ISyntaxToken,
                expression: IExpressionSyntax,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._voidKeyword = voidKeyword;
        this._expression = expression;
    }

    public static create1(expression: IExpressionSyntax): VoidExpressionSyntax {
        return new VoidExpressionSyntax(Syntax.token(SyntaxKind.VoidKeyword), expression, /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitVoidExpression(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.VoidExpression;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._voidKeyword;
            case 1: return this._expression;
            default: throw Errors.invalidOperation();
        }
    }

    private isUnaryExpression(): bool {
        return true;
    }

    private isExpression(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._expression);
        array.splice(index, 0, this._voidKeyword);
    }

    public voidKeyword(): ISyntaxToken {
        return this._voidKeyword;
    }

    public expression(): IExpressionSyntax {
        return this._expression;
    }

    public update(voidKeyword: ISyntaxToken,
                  expression: IExpressionSyntax): VoidExpressionSyntax {
        if (this._voidKeyword === voidKeyword && this._expression === expression) {
            return this;
        }

        return new VoidExpressionSyntax(voidKeyword, expression, /*parsedInStrictMode:*/ false);
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

    public withExpression(expression: IExpressionSyntax): VoidExpressionSyntax {
        return this.update(this._voidKeyword, expression);
    }

    private collectTextElements(elements: string[]): void {
        (<any>this._voidKeyword).collectTextElements(elements);
        (<any>this._expression).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        if (this._expression.isTypeScriptSpecific()) { return true; }
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._voidKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._voidKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._expression.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._expression.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || this._expression.hasZeroWidthToken();
        hasRegularExpressionToken = hasRegularExpressionToken || this._expression.hasRegularExpressionToken();

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._voidKeyword.fullWidth();
        if (position < childWidth) { return { token: this._voidKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._expression.fullWidth();
        if (position < childWidth) { return (<any>this._expression).findTokenInternal(position, fullStart); }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <VoidExpressionSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._voidKeyword, other._voidKeyword)) { return false; }
        if (!Syntax.nodeOrTokenStructuralEquals(this._expression, other._expression)) { return false; }
        return true;
    }
}

class DebuggerStatementSyntax extends SyntaxNode implements IStatementSyntax {
    private _debuggerKeyword: ISyntaxToken;
    private _semicolonToken: ISyntaxToken;

    constructor(debuggerKeyword: ISyntaxToken,
                semicolonToken: ISyntaxToken,
                parsedInStrictMode: bool) {
        super(parsedInStrictMode);

        this._debuggerKeyword = debuggerKeyword;
        this._semicolonToken = semicolonToken;
    }

    public static create1(): DebuggerStatementSyntax {
        return new DebuggerStatementSyntax(Syntax.token(SyntaxKind.DebuggerKeyword), Syntax.token(SyntaxKind.SemicolonToken), /*parsedInStrictMode:*/ false);
    }

    public accept(visitor: ISyntaxVisitor): any {
        return visitor.visitDebuggerStatement(this);
    }

    public kind(): SyntaxKind {
        return SyntaxKind.DebuggerStatement;
    }

    private slotCount(): number {
        return 2;
    }

    private elementAtSlot(slot: number): ISyntaxElement {
        switch (slot) {
            case 0: return this._debuggerKeyword;
            case 1: return this._semicolonToken;
            default: throw Errors.invalidOperation();
        }
    }

    private isStatement(): bool {
        return true;
    }

    private isModuleElement(): bool {
        return true;
    }

    public insertChildrenInto(array: ISyntaxElement[], index: number) {
        array.splice(index, 0, this._semicolonToken);
        array.splice(index, 0, this._debuggerKeyword);
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

        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, /*parsedInStrictMode:*/ false);
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
        (<any>this._debuggerKeyword).collectTextElements(elements);
        (<any>this._semicolonToken).collectTextElements(elements);
    }

    private isTypeScriptSpecific(): bool {
        return false;
    }

    private computeData(): number {
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = false;
        var hasRegularExpressionToken = false;

        childWidth = this._debuggerKeyword.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._debuggerKeyword.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        childWidth = this._semicolonToken.fullWidth();
        fullWidth += childWidth;
        hasSkippedText = hasSkippedText || this._semicolonToken.hasSkippedText();
        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

        return (fullWidth << Constants.NodeFullWidthShift)
             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
    }

    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
        Debug.assert(position >= 0 && position < this.fullWidth());
        var childWidth = 0;

        childWidth = this._debuggerKeyword.fullWidth();
        if (position < childWidth) { return { token: this._debuggerKeyword, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        childWidth = this._semicolonToken.fullWidth();
        if (position < childWidth) { return { token: this._semicolonToken, fullStart: fullStart }; }
        position -= childWidth;
        fullStart += childWidth;

        throw Errors.invalidOperation();
    }

    private structuralEquals(node: SyntaxNode): bool {
        if (this === node) { return true; }
        if (node === null) { return false; }
        if (this.kind() !== node.kind()) { return false; }
        var other = <DebuggerStatementSyntax>node;
        if (!Syntax.tokenStructuralEquals(this._debuggerKeyword, other._debuggerKeyword)) { return false; }
        if (!Syntax.tokenStructuralEquals(this._semicolonToken, other._semicolonToken)) { return false; }
        return true;
    }
}