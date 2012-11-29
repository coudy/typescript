///<reference path='References.ts' />

class ParserResetPoint {
    constructor (public resetCount: number,
                 public position: number,
                 public previousToken: ISyntaxToken,
                 public isInStrictMode: bool) {
    }
}


// The precedence of expressions in typescript.  While we're parsing an expression, we will 
// continue to consume and form new trees, if the precedence is greater than our current
// precedence.  For example, if we have: a + b * c, we will first parse 'a' with precedence 0. We
// will then see the + with precedence 13.  13 is greater than 0 so we will decide to create a 
// binary expression with the result of parsing the sub expression "b * c".  We'll then parse the 
// term 'b' (passing in precedence 13).  We will then see the * with precedence 14.  14 is greater
// than 13, so we will create a binary expression from "b" and "c", return that, and join it with 
// "a" producing:
//
//      +
//     / \
//    a   *
//       / \
//      b   c
//
// If we instead had: "a * b + c", we would first parser 'a' with precedence 0.  We would then see 
// the * with precedence 14.  14 is greater than 0 so we will decide to create a binary expression
// with the result of parsing the sub expression "b + c".  We'll then parse the term 'b' (passing in
// precedence 14).  We will then see the + with precedence 13.  13 is less than 14, so we won't 
// continue parsing subexpressions and will just return the expression 'b'.  The caller will join 
// that into "a * b" (and will be back at precedence 0). It will then see the + with precedence 11.
// 11 is greater than 0 so it will parse the sub expression and make a binary expression out of it
// producing:
//
//        +
//       / \
//      *   c
//     / \
//    a   b

enum ParserExpressionPrecedence {
    // Intuitively, commas have the lowest precedence.  "a || b, c" is "(a || b), c", not
    // "a || (b, c)"
    CommaExpressionPrecedence = 1,

    AssignmentExpressionPrecedence = 2,

    ConditionalExpressionPrecedence = 3,

    // REVIEW: Should ArrowFunctions have higher, lower, or the same precedence as ternary?
    ArrowFunctionPrecedence = 4,

    LogicalOrExpressionPrecedence = 5,
    LogicalAndExpressionPrecedence = 6,
    BitwiseOrExpressionPrecedence = 7,
    BitwiseExclusiveOrExpressionPrecedence = 8,
    BitwiseAndExpressionPrecedence = 9,
    EqualityExpressionPrecedence = 10,
    RelationalExpressionPrecedence = 11,
    ShiftExpressionPrecdence = 12,
    AdditiveExpressionPrecedence = 13,
    MultiplicativeExpressionPrecedence = 14,

    // Intuitively, unary expressions have the highest precedence.  After all, if you have:
    //   !foo || bar
    //
    // Then you have "(!foo) || bar", not "!(foo || bar)"
    UnaryExpressionPrecedence= 15,
}

class Parser {
    private scanner: Scanner = null;
    private oldTree: SyntaxTree = null;

    private _currentToken: ISyntaxToken = null;
    private scannedTokens: ISyntaxToken[] = [];
    private previousToken: ISyntaxToken = null;

    private firstToken: number = 0;
    private tokenOffset: number = 0;

    private isInStrictMode: bool;
    private tokenCount: number = 0;
    private resetCount: number = 0;
    private resetStart: number = 0;

    private options: ParseOptions = null;

    constructor(
        scanner: Scanner,
        oldTree?: SyntaxTree,
        changes?: TextChangeRange[],
        options?: ParseOptions) {

        this.scanner = scanner;
        this.oldTree = oldTree;
        this.options = options || new ParseOptions();
    }

    private isIncremental(): bool {
        return this.oldTree != null;
    }

    private preScan(): void {
        var size = MathPrototype.min(4096, MathPrototype.max(32, this.scanner.text().length() / 2));
        var tokens: SyntaxToken[] = this.scannedTokens = ArrayUtilities.createArray(size);
        var scanner = this.scanner;

        for (var i = 0; i < size; i++) {
            var token = scanner.scan();
            this.addScannedToken(token);

            if (token.kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
        }
    }

    private getResetPoint(): ParserResetPoint {
        var pos = this.firstToken + this.tokenOffset;
        if (this.resetCount === 0) {
            this.resetStart = pos; // low water mark
        }

        this.resetCount++;
        return new ParserResetPoint(this.resetCount, pos, this.previousToken, this.isInStrictMode);
    }

    private reset(point: ParserResetPoint): void {
        var offset = point.position - this.firstToken;
        Debug.assert(offset >= 0 && offset < this.tokenCount);
        this.tokenOffset = offset;

        this._currentToken = null;
        this.previousToken = point.previousToken;
        this.isInStrictMode = point.isInStrictMode;
    }

    private release(point: ParserResetPoint): void {
        Debug.assert(this.resetCount == point.resetCount);
        this.resetCount--;
        if (this.resetCount == 0) {
            this.resetStart = -1;
        }
    }

    private currentToken(): ISyntaxToken {
        var result = this._currentToken;

        if (result === null) {
            result = this.fetchCurrentToken();
            this._currentToken = result;
        }

        return result;
    }

    private fetchCurrentToken(): ISyntaxToken {
        if (this.tokenOffset >= this.tokenCount) {
            this.addNewToken();
        }

        return this.scannedTokens[this.tokenOffset];
    }

    private addNewToken(): void {
        this.addScannedToken(this.scanner.scan());
    }

    private addScannedToken(token: ISyntaxToken): void {
        Debug.assert(token !== null);
        if (this.tokenCount >= this.scannedTokens.length) {
            this.tryShiftScannedTokens();
        }

        this.scannedTokens[this.tokenCount] = token;
        this.tokenCount++;
    }

    private tryShiftScannedTokens(): void {
        // shift tokens to left if we are far to the right
        // don't shift if reset points have fixed locked tge starting point at the token in the window
        if (this.tokenOffset > (this.scannedTokens.length >> 1)
            && (this.resetStart == -1 || this.resetStart > this.firstToken)) {
            var shiftOffset = (this.resetStart == -1) ? this.tokenOffset : this.resetStart - this.firstToken;
            var shiftCount = this.tokenCount - shiftOffset;
            Debug.assert(shiftOffset > 0);
            if (shiftCount > 0) {
                ArrayUtilities.copy(this.scannedTokens, shiftOffset, this.scannedTokens, 0, shiftCount);
            }

            this.firstToken += shiftOffset;
            this.tokenCount -= shiftOffset;
            this.tokenOffset -= shiftOffset;
        }
        else {
            // Grow the exisitng array.
            this.scannedTokens[this.scannedTokens.length * 2 - 1] = null;
        }
    }

    private peekTokenN(n: number): ISyntaxToken {
        Debug.assert(n >= 0);
        while (this.tokenOffset + n >= this.tokenCount) {
            this.addNewToken();
        }

        return this.scannedTokens[this.tokenOffset + n];
    }

    //this method is called very frequently
    //we should keep it simple so that it can be inlined.
    private eatAnyToken(): ISyntaxToken {
        var token = this.currentToken();
        this.moveToNextToken();
        return token;
    }

    private moveToNextToken(): void {
        this.previousToken = this._currentToken;
        this._currentToken = null;

        this.tokenOffset++;
    }

    private canEatAutomaticSemicolon(): bool {
        var token = this.currentToken();

        // An automatic semicolon is always allowed if we're at the end of the file.
        if (token.kind() === SyntaxKind.EndOfFileToken) {
            return true;
        }

        // Or if the next token is a close brace (regardless of which line it is on).
        if (token.kind() === SyntaxKind.CloseBraceToken) {
            return true;
        }

        // It is also allowed if there is a newline between the last token seen and the next one.
        if (this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
            return true;
        }

        return false;
    }

    private canEatExplicitOrAutomaticSemicolon(): bool {
        var token = this.currentToken();

        if (token.kind() === SyntaxKind.SemicolonToken) {
            return true;
        }

        return this.canEatAutomaticSemicolon();
    }

    private eatExplicitOrAutomaticSemicolon(): ISyntaxToken {
        var token = this.currentToken();

        // If we see a semicolon, then we can definitely eat it.
        if (token.kind() === SyntaxKind.SemicolonToken) {
            return this.eatToken(SyntaxKind.SemicolonToken);
        }

        // Check if an automatic semicolon could go here.  If so, synthesize one.  However, if the
        // user has the option set to error on automatic semicolons, then add an error to that
        // token as well.
        if (this.canEatAutomaticSemicolon()) {
            var semicolonToken = SyntaxToken.createEmptyToken(SyntaxKind.SemicolonToken);

            if (!this.options.allowAutomaticSemicolonInsertion()) {
                semicolonToken = this.withAdditionalDiagnostics(semicolonToken, new DiagnosticInfo(DiagnosticCode.AutomaticSemicolonInsertionNotAllowed)); 
            }

            return semicolonToken;
        }

        // No semicolon could be consumed here at all.  Just call the standard eating function
        // so we get the token and the error for it.
        return this.eatToken(SyntaxKind.SemicolonToken);
    }

    //this method is called very frequently
    //we should keep it simple so that it can be inlined.
    private eatToken(kind: SyntaxKind): ISyntaxToken {
        Debug.assert(SyntaxFacts.isTokenKind(kind))

        var token = this.currentToken();
        if (token.kind() === kind) {
            this.moveToNextToken();
            return token;
        }

        //slow part of EatToken(SyntaxKind kind)
        return this.createMissingToken(kind, token.kind());
    }

    private eatKeyword(kind: SyntaxKind): ISyntaxToken {
        Debug.assert(SyntaxFacts.isTokenKind(kind))

        var token = this.currentToken();
        if (token.keywordKind() === kind) {
            this.moveToNextToken();
            return token;
        }

        //slow part of EatToken(SyntaxKind kind)
        return this.createMissingToken(kind, token.kind());
    }

    // This method should be called when the grammar calls for on *IdentifierName* and not an
    // *Identifier*.
    private eatIdentifierNameToken(): ISyntaxToken {
        var token = this.currentToken();
        if (token.kind() === SyntaxKind.IdentifierNameToken) {
            this.moveToNextToken();
            return token;
        }

        return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.kind());
    }

    // This method should be called when the grammar calls for on *Identifier* and not an
    // *IdentifierName*.
    private eatIdentifierToken(): ISyntaxToken {
        var token = this.currentToken();
        if (token.kind() === SyntaxKind.IdentifierNameToken) {
            if (this.isKeyword(token.keywordKind())) {
                return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.keywordKind());
            }

            this.moveToNextToken();
            return token;
        }

        return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.kind());
    }

    private isIdentifier(token: ISyntaxToken): bool {
        return token.kind() === SyntaxKind.IdentifierNameToken && !this.isKeyword(token.keywordKind());
    }

    private tokenIsKeyword(token: ISyntaxToken, kind: SyntaxKind): bool {
        return token.keywordKind() === kind &&
               this.isKeyword(kind);
    }

    private isKeyword(kind: SyntaxKind): bool {
        if (SyntaxFacts.isStandardKeyword(kind) ||
            SyntaxFacts.isFutureReservedKeyword(kind)) {
            return true;
        }

        if (this.isInStrictMode && SyntaxFacts.isFutureReservedStrictKeyword(kind)) {
            return true;
        }

        return false;
    }

    private createMissingToken(expected: SyntaxKind, actual: SyntaxKind): ISyntaxToken {
        var token = SyntaxToken.createEmptyToken(expected);
        token = this.withAdditionalDiagnostics(token, this.getExpectedTokenDiagnosticInfo(expected, actual));
        return token;
    }

    private eatTokenWithPrejudice(kind: SyntaxKind): ISyntaxToken {
        var token = this.currentToken();

        Debug.assert(SyntaxFacts.isTokenKind(kind));
        if (token.kind() !== kind) {
            token = this.withAdditionalDiagnostics(token, this.getExpectedTokenDiagnosticInfo(kind, token.kind()));
        }

        this.moveToNextToken();
        return token;
    }

    private getExpectedTokenDiagnosticInfo(expected: SyntaxKind, actual: SyntaxKind): DiagnosticInfo {
        var span = this.getDiagnosticSpanForMissingToken();
        var offset = span.start();
        var width = span.length();

        if (expected === SyntaxKind.IdentifierNameToken) {
            if (SyntaxFacts.isAnyKeyword(actual)) {
                return new SyntaxDiagnosticInfo(offset, width, DiagnosticCode.Identifier_expected__0_is_a_keyword, SyntaxFacts.getText(actual));
            }
            else {
                return new SyntaxDiagnosticInfo(offset, width, DiagnosticCode.Identifier_expected);
            }
        }

        if (SyntaxFacts.isAnyPunctuation(expected)) {
            return new SyntaxDiagnosticInfo(offset, width, DiagnosticCode._0_expected, SyntaxFacts.getText(expected));
        }

        throw Errors.notYetImplemented();
    }

    private getDiagnosticSpanForMissingToken(): TextSpan {
        // If the previous token has a trailing EndOfLineTrivia,
        // the missing token diagnostic position is moved to the
        // end of line containing the previous token and
        // its width is set to zero.
        // Otherwise the diagnostic offset and width is set
        // to the corresponding values of the current token

        //var trivia = this.prevTokenTrailingTrivia;
        //if (trivia != null)
        //{
        //    SyntaxList<SyntaxNode> triviaList = new SyntaxList<SyntaxNode>(trivia);
        //    bool prevTokenHasEndOfLineTrivia = triviaList.Any(SyntaxKind.EndOfLineTrivia);
        //    if (prevTokenHasEndOfLineTrivia)
        //    {
        //        offset = -trivia.FullWidth;
        //        width = 0;
        //        return;
        //    }
        //}

        var token = this.currentToken();
        return new TextSpan(token.start(), token.width());
    }

    private withAdditionalDiagnostics(token: ISyntaxToken, ...diagnostics: DiagnosticInfo[]): ISyntaxToken {
        // return node.WithDiagnostics(node.GetDiagnostics().Concat(diagnostics).ToArray());
        throw Errors.notYetImplemented();
    }

    private getPrecedence(expressionKind: SyntaxKind): ParserExpressionPrecedence {
        switch (expressionKind) {
            case SyntaxKind.CommaExpression:
                return ParserExpressionPrecedence.CommaExpressionPrecedence;

            case SyntaxKind.AssignmentExpression:
            case SyntaxKind.AddAssignmentExpression:
            case SyntaxKind.SubtractAssignmentExpression:
            case SyntaxKind.MultiplyAssignmentExpression:
            case SyntaxKind.DivideAssignmentExpression:
            case SyntaxKind.ModuloAssignmentExpression:
            case SyntaxKind.AndAssignmentExpression:
            case SyntaxKind.ExclusiveOrAssignmentExpression:
            case SyntaxKind.OrAssignmentExpression:
            case SyntaxKind.LeftShiftAssignmentExpression:
            case SyntaxKind.SignedRightShiftAssignmentExpression:
            case SyntaxKind.UnsignedRightShiftAssignmentExpression:
                return ParserExpressionPrecedence.AssignmentExpressionPrecedence;

            case SyntaxKind.ConditionalExpression:
                return ParserExpressionPrecedence.ConditionalExpressionPrecedence;

            case SyntaxKind.LogicalOrExpression:
                return ParserExpressionPrecedence.LogicalOrExpressionPrecedence;

            case SyntaxKind.LogicalAndExpression:
                return ParserExpressionPrecedence.LogicalAndExpressionPrecedence;

            case SyntaxKind.BitwiseOrExpression:
                return ParserExpressionPrecedence.BitwiseOrExpressionPrecedence;

            case SyntaxKind.BitwiseExclusiveOrExpression:
                return ParserExpressionPrecedence.BitwiseExclusiveOrExpressionPrecedence;

            case SyntaxKind.BitwiseAndExpression:
                return ParserExpressionPrecedence.BitwiseAndExpressionPrecedence;

            case SyntaxKind.EqualsWithTypeConversionExpression:
            case SyntaxKind.NotEqualsWithTypeConversionExpression:
            case SyntaxKind.EqualsExpression:
            case SyntaxKind.NotEqualsExpression:
                return ParserExpressionPrecedence.EqualityExpressionPrecedence;

            case SyntaxKind.LessThanExpression:
            case SyntaxKind.GreaterThanExpression:
            case SyntaxKind.LessThanOrEqualExpression:
            case SyntaxKind.GreaterThanOrEqualExpression:
            case SyntaxKind.InstanceOfExpression:
            case SyntaxKind.InExpression:
                return ParserExpressionPrecedence.RelationalExpressionPrecedence;

            case SyntaxKind.LeftShiftExpression:
            case SyntaxKind.SignedRightShiftExpression:
            case SyntaxKind.UnsignedRightShiftExpression:
                return ParserExpressionPrecedence.ShiftExpressionPrecdence;

            case SyntaxKind.AddExpression:
            case SyntaxKind.SubtractExpression:
                return ParserExpressionPrecedence.AdditiveExpressionPrecedence;

            case SyntaxKind.MultiplyExpression:
            case SyntaxKind.DivideExpression:
            case SyntaxKind.ModuloExpression:
                return ParserExpressionPrecedence.MultiplicativeExpressionPrecedence;

            case SyntaxKind.PlusExpression:
            case SyntaxKind.NegateExpression:
            case SyntaxKind.BitwiseNotExpression:
            case SyntaxKind.LogicalNotExpression:
            case SyntaxKind.DeleteExpression:
            case SyntaxKind.TypeOfExpression:
            case SyntaxKind.VoidExpression:
            case SyntaxKind.PreIncrementExpression:
            case SyntaxKind.PreDecrementExpression:
                return ParserExpressionPrecedence.UnaryExpressionPrecedence;
        }

        throw Errors.invalidOperation();
    }

    public parseSourceUnit(): SourceUnitSyntax {
        var moduleElements: ModuleElementSyntax[] = [];

        while (this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            var moduleElement = this.parseModuleElement();
            moduleElements.push(moduleElement);
        }

        return new SourceUnitSyntax(SyntaxNodeList.create(moduleElements), this.currentToken());
    }

    private parseModuleElement(): ModuleElementSyntax {
        if (this.isImportDeclaration()) {
            return this.parseImportDeclaration();
        }
        else if (this.isModuleDeclaration()) {
            return this.parseModuleDeclaration();
        }
        else if (this.isInterfaceDeclaration()) {
            return this.parseInterfaceDeclaration();
        }
        else if (this.isClassDeclaration()) {
            return this.parseClassDeclaration();
        }
        else if (this.isEnumDeclaration()) {
            return this.parseEnumDeclaration();
        }
        else {
            return this.parseStatement(/*allowFunctionDeclaration:*/ true);
        }
    }

    private isImportDeclaration(): bool {
        // REVIEW: because 'import' is not a javascript keyword, we need to make sure that this is 
        // an actual import declaration.  As such, i check for "import id =" as that shouldn't 
        // match any other legal javascript construct.  However, we need to verify that this is
        // actually the case.
        return this.currentToken().keywordKind() === SyntaxKind.ImportKeyword &&
               this.peekTokenN(1).kind() === SyntaxKind.IdentifierNameToken &&
               this.peekTokenN(2).kind() === SyntaxKind.EqualsToken;
    }

    private parseImportDeclaration(): ImportDeclarationSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ImportKeyword);

        var importKeyword = this.eatKeyword(SyntaxKind.ImportKeyword);
        var identifier = this.eatIdentifierToken();
        var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
        var moduleReference = this.parseModuleReference();
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();

        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
    }

    private parseModuleReference(): ModuleReferenceSyntax {
        if (this.isExternalModuleReference()) {
            return this.parseExternalModuleReference();
        }
        else {
            this.parseModuleNameModuleReference();
        }
    }

    private isExternalModuleReference(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ModuleKeyword &&
               this.peekTokenN(1).kind() === SyntaxKind.OpenParenToken;
    }

    private parseExternalModuleReference(): ExternalModuleReferenceSyntax {
        throw Errors.notYetImplemented();
    }

    private parseModuleNameModuleReference(): ModuleNameModuleReference {
        var name = this.parseName();
        return new ModuleNameModuleReference(name);
    }

    // NOTE: This will allow all identifier names.  Even the ones that are keywords.
    private parseIdentifierName(): IdentifierNameSyntax {
        var identifierName = this.eatIdentifierNameToken();
        return new IdentifierNameSyntax(identifierName);
    }

    private isName(): bool {
        return this.isIdentifier(this.currentToken());
    }

    private parseName(): NameSyntax {
        var isIdentifier = this.currentToken().kind() === SyntaxKind.IdentifierNameToken;
        var identifier = this.eatIdentifierToken();
        var identifierName = new IdentifierNameSyntax(identifier);

        var current: NameSyntax = identifierName;

        while (isIdentifier && this.currentToken().kind() === SyntaxKind.DotToken) {
            var dotToken = this.eatToken(SyntaxKind.DotToken);

            isIdentifier = this.currentToken().kind() === SyntaxKind.IdentifierNameToken;
            identifier = this.eatIdentifierToken();
            identifierName = new IdentifierNameSyntax(identifier);

            current = new QualifiedNameSyntax(current, dotToken, identifierName);
        }

        return current;
    }

    private isEnumDeclaration(): bool {
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword &&
            this.peekTokenN(1).keywordKind() === SyntaxKind.EnumKeyword) {
            return true;
        }

        return this.currentToken().keywordKind() === SyntaxKind.EnumKeyword &&
               this.isIdentifier(this.peekTokenN(1));
    }

    private parseEnumDeclaration(): EnumDeclarationSyntax {
        Debug.assert(this.isEnumDeclaration());

        var exportKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }

        var enumKeyword = this.eatKeyword(SyntaxKind.EnumKeyword);
        var identifier = this.eatIdentifierToken();

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var variableDeclarators: any[] = null;

        if (!openBraceToken.isMissing()) {
            while (true) {
                if (this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }

                var variableDeclarator = this.parseVariableDeclarator(/*allowIn:*/ true);

                variableDeclarators = variableDeclarators || [];
                variableDeclarators.push(variableDeclarator);

                if (this.currentToken().kind() === SyntaxKind.CommaToken) {
                    var commaToken = this.eatToken(SyntaxKind.CommaToken);
                    variableDeclarators.push(commaToken);
                    continue;
                }

                // TODO: error recovery.
                break;
            }
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier,
            openBraceToken, SeparatedSyntaxList.create(variableDeclarators), closeBraceToken);
    }

    private isClassDeclaration(): bool {
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword &&
            this.peekTokenN(1).keywordKind() === SyntaxKind.ClassKeyword) {
            return true;
        }

        return this.currentToken().keywordKind() === SyntaxKind.ClassKeyword &&
               this.isIdentifier(this.peekTokenN(1));
    }

    private parseClassDeclaration(): ClassDeclarationSyntax {
        Debug.assert(this.isClassDeclaration());

        var exportKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }

        var classKeyword = this.eatKeyword(SyntaxKind.ClassKeyword);
        var identifier = this.eatIdentifierToken();

        var extendsClause: ExtendsClauseSyntax = null;
        if (this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }

        var implementsClause: ImplementsClauseSyntax = null;
        if (this.isImplementsClause()) {
            implementsClause = this.parseImplementsClause();
        }

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var classElements: ClassElementSyntax[] = null;
        if (!openBraceToken.isMissing()) {
            while (true) {
                if (this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }

                var classElement = this.parseClassElement();

                classElements = classElements || [];
                classElements.push(classElement);
            }
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ClassDeclarationSyntax(
            exportKeyword, classKeyword, identifier, extendsClause, implementsClause,
            openBraceToken, SyntaxNodeList.create(classElements), closeBraceToken);
    }

    private isConstructorDeclaration(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ConstructorKeyword;
    }

    private isMemberFunctionDeclaration(): bool {
        var resetPoint = this.getResetPoint();
        try {
            if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
                this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
                this.eatAnyToken();
            }

            if (this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
                this.eatAnyToken();
            }

            return this.isFunctionSignature();
        }
        finally {
            this.reset(resetPoint);
            this.release(resetPoint);
        }
    }

    private isMemberAccessorDeclaration(): bool {
        var resetPoint = this.getResetPoint();
        try {
            if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
                this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
                this.eatAnyToken();
            }

            if (this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
                this.eatAnyToken();
            }

            if (this.currentToken().keywordKind() !== SyntaxKind.GetKeyword &&
                this.currentToken().keywordKind() !== SyntaxKind.SetKeyword) {
                return false;
            }

            this.eatAnyToken();
            return this.isIdentifier(this.currentToken());
        }
        finally {
            this.reset(resetPoint);
            this.release(resetPoint);
        }
    }

    private isMemberVariableDeclaration(): bool {
        if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
            this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            return true;
        }

        if (this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
            return true;
        }

        return this.isIdentifier(this.currentToken());
    }

    private isMemberDeclaration(): bool {
        // Note: the order of these calls is important.  Specifically, isMemberVariableDeclaration
        // checks for a subset of the conditions of the other two.
        return this.isMemberFunctionDeclaration() ||
               this.isMemberAccessorDeclaration() ||
               this.isMemberVariableDeclaration();
    }

    private isClassElement(): bool {
        return this.isConstructorDeclaration() || this.isMemberDeclaration();
    }

    private parseConstructorDeclaration(): ConstructorDeclarationSyntax {
        Debug.assert(this.isConstructorDeclaration());

        var constructorKeyword = this.eatKeyword(SyntaxKind.ConstructorKeyword);
        var parameterList = this.parseParameterList();

        var semicolonToken: ISyntaxToken = null;
        var block: BlockSyntax = null;

        if (this.isBlock()) {
            block = this.parseBlock(/*allowFunctionDeclaration:*/ true);
        }
        else {
            semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        }

        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
    }

    private parseMemberFunctionDeclaration(): MemberFunctionDeclarationSyntax {
        Debug.assert(this.isMemberFunctionDeclaration());
        var publicOrPrivateKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
            this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }

        var staticKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
            staticKeyword = this.eatKeyword(SyntaxKind.StaticKeyword);
        }

        var functionSignature = this.parseFunctionSignature();

        var block: BlockSyntax = null;
        var semicolon: ISyntaxToken = null;

        if (this.isBlock()) {
            block = this.parseBlock(/*allowFunctionDeclaration:*/ true);
        }
        else {
            semicolon = this.eatExplicitOrAutomaticSemicolon();
        }

        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolon);
    }

    private parseMemberAccessorDeclaration(): MemberAccessorDeclarationSyntax {
        throw Errors.notYetImplemented();
    }

    private parseMemberVariableDeclaration(): MemberVariableDeclarationSyntax {
        Debug.assert(this.isMemberVariableDeclaration());

        var publicOrPrivateKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
            this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }

        var staticKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
            staticKeyword = this.eatKeyword(SyntaxKind.StaticKeyword);
        }

        var variableDeclarator = this.parseVariableDeclarator(/*allowIn:*/ true);
        var semicolon = this.eatExplicitOrAutomaticSemicolon();

        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolon);
    }

    private parseMemberDeclaration(): MemberDeclarationSyntax {
        Debug.assert(this.isMemberDeclaration());
        if (this.isMemberFunctionDeclaration()) {
            return this.parseMemberFunctionDeclaration();
        }
        else if (this.isMemberAccessorDeclaration()) {
            return this.parseMemberAccessorDeclaration();
        }
        else if (this.isMemberVariableDeclaration()) {
            return this.parseMemberVariableDeclaration();
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private parseClassElement(): ClassElementSyntax {
        Debug.assert(this.isClassElement());
        if (this.isConstructorDeclaration()) {
            return this.parseConstructorDeclaration();
        }
        else if (this.isMemberDeclaration()) {
            return this.parseMemberDeclaration();
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private isFunctionDeclaration(): bool {
        if (this.currentToken().keywordKind() === SyntaxKind.FunctionKeyword) {
            return true;
        }

        return this.currentToken().keywordKind() === SyntaxKind.ExportKeyword &&
               this.peekTokenN(1).keywordKind() === SyntaxKind.FunctionKeyword;
    }

    private parseFunctionDeclaration(): FunctionDeclarationSyntax {
        Debug.assert(this.isFunctionDeclaration());

        var exportKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }

        var functionKeyword = this.eatKeyword(SyntaxKind.FunctionKeyword);
        var functionSignature = this.parseFunctionSignature();

        var semicolonToken: ISyntaxToken = null;
        var block: BlockSyntax = null;

        if (this.isBlock()) {
            block = this.parseBlock(/*allowFunctionDeclaration:*/ true);
        }
        else {
            semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        }

        return new FunctionDeclarationSyntax(exportKeyword, functionKeyword, functionSignature, block, semicolonToken);
    }

    private isModuleDeclaration(): bool {
        // export module
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword &&
            this.peekTokenN(1).keywordKind() === SyntaxKind.ModuleKeyword) {

            return true;
        }

        // Module is not a javascript keyword.  So we need to use a bit of lookahead here to ensure
        // that we're actually looking at a module construct and not some javascript expression.
        if (this.currentToken().keywordKind() === SyntaxKind.ModuleKeyword) {
            var token1 = this.peekTokenN(1);

            // module {
            if (token1.kind() === SyntaxKind.OpenBraceToken) {
                return true;
            }

            if (token1.kind() === SyntaxKind.IdentifierNameToken) {
                var token2 = this.peekTokenN(2);

                // module id {
                if (token2.kind() === SyntaxKind.OpenBraceToken) {
                    return true;
                }

                // module id.
                if (token2.kind() === SyntaxKind.DotToken) {
                    return true;
                }
            }
        }

        return false;
    }

    private parseModuleDeclaration(): ModuleDeclarationSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ModuleKeyword ||
                     this.currentToken().keywordKind() === SyntaxKind.ExportKeyword);

        var exportKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }

        var moduleKeyword = this.eatKeyword(SyntaxKind.ModuleKeyword);
        var moduleName: NameSyntax = null;

        if (this.currentToken().kind() !== SyntaxKind.OpenBraceToken) {
            moduleName = this.parseName();
        }

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

        var moduleElements: ModuleElementSyntax[] = null;
        if (!openBraceToken.isMissing()) {
            while (this.currentToken().kind() !== SyntaxKind.CloseBraceToken &&
                   this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
                var element = this.parseModuleElement();

                moduleElements = moduleElements || [];
                moduleElements.push(element);
            }
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new ModuleDeclarationSyntax(
            exportKeyword, moduleKeyword, moduleName, openBraceToken, SyntaxNodeList.create(moduleElements), closeBraceToken);
    }

    private isInterfaceDeclaration(): bool {
        // export interface
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword &&
            this.peekTokenN(1).keywordKind() === SyntaxKind.InterfaceKeyword) {
            return true
        }

        // interface foo
        return this.currentToken().keywordKind() === SyntaxKind.InterfaceKeyword &&
               this.isIdentifier(this.peekTokenN(1));
    }

    private parseInterfaceDeclaration(): InterfaceDeclarationSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword ||
                     this.currentToken().keywordKind() === SyntaxKind.InterfaceKeyword);

        var exportKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }

        var interfaceKeyword = this.eatKeyword(SyntaxKind.InterfaceKeyword);
        var identifier = this.eatIdentifierToken();

        var extendsClause: ExtendsClauseSyntax = null;
        if (this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }

        var objectType = this.parseObjectType();
        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, objectType);
    }

    private parseObjectType(): ObjectTypeSyntax {
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

        var typeMembers: any[] = null;
        if (!openBraceToken.isMissing()) {
            while (true) {
                if (this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }

                var typeMember = this.parseTypeMember();
                typeMembers = typeMembers || [];
                typeMembers.push(typeMember);

                // TODO: Should we do automatic semicolon insertion here?
                if (this.currentToken().kind() === SyntaxKind.SemicolonToken) {
                    var semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
                    typeMembers.push(semicolonToken);
                }
                else {
                    // TODO: Add error recovery.
                    break;
                }
            }
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ObjectTypeSyntax(openBraceToken, SeparatedSyntaxList.create(typeMembers), closeBraceToken);
    }

    private parseTypeMember(): TypeMemberSyntax {
        if (this.isCallSignature()) {
            return this.parseCallSignature();
        }
        else if (this.isConstructSignature()) {
            return this.parseConstructSignature();
        }
        else if (this.isIndexSignature()) {
            return this.parseIndexSignature();
        }
        else if (this.isFunctionSignature()) {
            // Note: it is important that isFunctionSignature is called before isPropertySignature.
            return this.parseFunctionSignature();
        }
        else if (this.isPropertySignature()) {
            return this.parsePropertySignature();
        }
        else {
            throw Errors.notYetImplemented();
        }
    }

    private parseConstructSignature(): ConstructSignatureSyntax {
        throw Errors.notYetImplemented();
    }

    private parseIndexSignature(): IndexSignatureSyntax {
        throw Errors.notYetImplemented();
    }

    private parseFunctionSignature(): FunctionSignatureSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.IdentifierNameToken);

        var identifier = this.eatIdentifierToken();
        var questionToken: ISyntaxToken = null;
        if (this.currentToken().kind() === SyntaxKind.QuestionToken) {
            questionToken = this.eatToken(SyntaxKind.QuestionToken);
        }

        var parameterList = this.parseParameterList();
        var typeAnnotation: TypeAnnotationSyntax = null;

        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
    }

    private parsePropertySignature(): PropertySignatureSyntax {
        Debug.assert(this.isPropertySignature());

        var identifier = this.eatIdentifierToken();
        
        var questionToken: ISyntaxToken = null;
        if (this.currentToken().kind() === SyntaxKind.QuestionToken) {
            questionToken = this.eatToken(SyntaxKind.QuestionToken);
        }

        var typeAnnotation: TypeAnnotationSyntax = null;
        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    }

    private isCallSignature(): bool {
        return this.currentToken().kind() === SyntaxKind.OpenParenToken;
    }

    private isConstructSignature(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.NewKeyword;
    }

    private isIndexSignature(): bool {
        return this.currentToken().kind() === SyntaxKind.OpenBracketToken;
    }

    private isFunctionSignature(): bool {
        if (this.isIdentifier(this.currentToken())) {
            // id(
            if (this.peekTokenN(1).kind() === SyntaxKind.OpenParenToken) {
                return true;
            }

            // id?(
            if (this.peekTokenN(1).kind() === SyntaxKind.QuestionToken &&
                this.peekTokenN(2).kind() === SyntaxKind.OpenParenToken) {
                return true;
            }
        }

        return false;
    }

    private isPropertySignature(): bool {
        // Note: identifiers also start function signatures.  So it's important that we call this
        // after we calll isFunctionSignature.
        return this.isIdentifier(this.currentToken());
    }

    private isExtendsClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ExtendsKeyword;
    }

    private parseExtendsClause(): ExtendsClauseSyntax {
        Debug.assert(this.isExtendsClause());

        var extendsKeyword = this.eatKeyword(SyntaxKind.ExtendsKeyword);
        var typeNames = this.parseTypeNameList();

        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    }

    private isImplementsClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ImplementsKeyword;
    }

    private parseImplementsClause(): ImplementsClauseSyntax {
        Debug.assert(this.isImplementsClause());

        var implementsKeyword = this.eatKeyword(SyntaxKind.ImplementsKeyword);
        var typeNames = this.parseTypeNameList();

        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    }

    private parseTypeNameList(): ISeparatedSyntaxList {
        var typeNames: any[] = [];

        var typeName = this.parseName();
        typeNames.push(typeName);

        while (true) {
            if (this.currentToken().kind() === SyntaxKind.CommaToken) {
                typeNames.push(this.eatToken(SyntaxKind.CommaToken));

                typeName = this.parseName();
                typeNames.push(typeName);
            }

            // TODO: error recovery.
            break;
        }

        return SeparatedSyntaxList.create(typeNames);
    }

    private parseStatement(allowFunctionDeclaration: bool): StatementSyntax {
        if (this.isVariableStatement()) {
            return this.parseVariableStatement();
        }
        else if (this.isLabeledStatement()) {
            return this.parseLabeledStatement();
        }
        else if (allowFunctionDeclaration && this.isFunctionDeclaration()) {
            return this.parseFunctionDeclaration();
        }
        else if (this.isIfStatement()) {
            return this.parseIfStatement();
        }
        else if (this.isBlock()) {
            return this.parseBlock(/*allowFunctionDeclaration:*/ false);
        }
        else if (this.isExpressionStatement()) {
            return this.parseExpressionStatement();
        }
        else if (this.isReturnStatement()) {
            return this.parseReturnStatement();
        }
        else if (this.isSwitchStatement()) {
            return this.parseSwitchStatement();
        }
        else if (this.isThrowStatement()) {
            return this.parseThrowStatement();
        }
        else if (this.isBreakStatement()) {
            return this.parseBreakStatement();
        }
        else if (this.isContinueStatement()) {
            return this.parseContinueStatement();
        }
        else if (this.isForOrForInStatement()) {
            return this.parseForOrForInStatement();
        }
        else if (this.isEmptyStatement()) {
            return this.parseEmptyStatement();
        }
        else if (this.isWhileStatement()) {
            return this.parseWhileStatement();
        }
        else if (this.isDoStatement()) {
            return this.parseDoStatement();
        }
        else if (this.isTryStatement()) {
            return this.parseTryStatement();
        }
        else {
            throw Errors.notYetImplemented();
        }
    }

    private isDoStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.DoKeyword;
    }

    private parseDoStatement(): DoStatementSyntax {
        Debug.assert(this.isDoStatement());

        var doKeyword = this.eatKeyword(SyntaxKind.DoKeyword);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);
        var whileKeyword = this.eatKeyword(SyntaxKind.WhileKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var condition = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();

        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
    }

    private isLabeledStatement(): bool {
        return this.isIdentifier(this.currentToken()) && this.peekTokenN(1).kind() === SyntaxKind.ColonToken;
    }

    private parseLabeledStatement(): LabeledStatement {
        Debug.assert(this.isLabeledStatement());
        
        var identifier = this.eatIdentifierToken();
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);
        
        return new LabeledStatement(identifier, colonToken, statement);
    }

    private isTryStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.TryKeyword;
    }

    private parseTryStatement(): TryStatementSyntax {
        Debug.assert(this.isTryStatement());

        var tryKeyword = this.eatKeyword(SyntaxKind.TryKeyword);
        var block = this.parseBlock(/*allowFunctionDeclaration:*/ false);

        var catchClause: CatchClauseSyntax = null;
        if (this.isCatchClause()) {
            catchClause = this.parseCatchClause();
        }

        var finallyClause: FinallyClauseSyntax = null;
        if (this.isFinallyClause()) {
            finallyClause = this.parseFinallyClause();
        }

        // TODO: Report error if both catch and finally clauses are missing.
        // (Alternatively, report that at semantic checking time).

        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause);
    }

    private isCatchClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.CatchKeyword;
    }

    private parseCatchClause(): CatchClauseSyntax {
        Debug.assert(this.isCatchClause());

        var catchKeyword = this.eatKeyword(SyntaxKind.CatchKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var identifier = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var block = this.parseBlock(/*allowFunctionDeclaration:*/ false);

        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
    }

    private isFinallyClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.FinallyKeyword;
    }

    private parseFinallyClause(): FinallyClauseSyntax {
        Debug.assert(this.isFinallyClause());

        var finallyKeyword = this.eatKeyword(SyntaxKind.FinallyKeyword);
        var block = this.parseBlock(/*allowFunctionDeclaration:*/ false);

        return new FinallyClauseSyntax(finallyKeyword, block);
    }

    private isWhileStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.WhileKeyword;
    }

    private parseWhileStatement(): WhileStatementSyntax {
        Debug.assert(this.isWhileStatement());

        var whileKeyword = this.eatKeyword(SyntaxKind.WhileKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var condition = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);

        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
    }

    private isEmptyStatement(): bool {
        return this.currentToken().kind() === SyntaxKind.SemicolonToken;
    }

    private parseEmptyStatement(): EmptyStatementSyntax {
        Debug.assert(this.isEmptyStatement());

        var semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
        return new EmptyStatementSyntax(semicolonToken);
    }

    private isForOrForInStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ForKeyword;
    }

    private parseForOrForInStatement(): BaseForStatementSyntax {
        Debug.assert(this.isForOrForInStatement());

        var forKeyword = this.eatKeyword(SyntaxKind.ForKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        
        var currentToken = this.currentToken();
        if (currentToken.keywordKind() === SyntaxKind.VarKeyword) {
            // for ( var VariableDeclarationListNoIn; Expressionopt ; Expressionopt ) Statement
            // for ( var VariableDeclarationNoIn in Expression ) Statement
            return this.parseForOrForInStatementWithVariableDeclaration(forKeyword, openParenToken);
        }
        else if (currentToken.kind() === SyntaxKind.SemicolonToken) {
            // for ( ; Expressionopt ; Expressionopt ) Statement
            return this.parseForStatement(forKeyword, openParenToken);
        }
        else {
            // for ( ExpressionNoInopt; Expressionopt ; Expressionopt ) Statement
            // for ( LeftHandSideExpression in Expression ) Statement
            return this.parseForOrForInStatementWithInitializer(forKeyword, openParenToken);
        }
    }

    private parseForOrForInStatementWithVariableDeclaration(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken): BaseForStatementSyntax {
        Debug.assert(forKeyword.keywordKind() === SyntaxKind.ForKeyword &&
                     openParenToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.VarKeyword);

        // for ( var VariableDeclarationListNoIn; Expressionopt ; Expressionopt ) Statement
        // for ( var VariableDeclarationNoIn in Expression ) Statement

        var variableDeclaration = this.parseVariableDeclaration(/*allowIn:*/ false);

        if (this.currentToken().keywordKind() === SyntaxKind.InKeyword) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
        }

        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
    }

    private parseForInStatementWithVariableDeclarationOrInitializer(forKeyword: ISyntaxToken,
                                                                    openParenToken: ISyntaxToken,
                                                                    variableDeclaration: VariableDeclarationSyntax,
                                                                    initializer: ExpressionSyntax): ForInStatementSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.InKeyword);

        // for ( var VariableDeclarationNoIn in Expression ) Statement
        var inKeyword = this.eatKeyword(SyntaxKind.InKeyword);
        var expression = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);

        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration,
            initializer, inKeyword, expression, closeParenToken, statement);
    }

    private parseForOrForInStatementWithInitializer(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken): BaseForStatementSyntax {
        Debug.assert(forKeyword.keywordKind() === SyntaxKind.ForKeyword &&
                     openParenToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind() === SyntaxKind.OpenParenToken);
        
        // for ( ExpressionNoInopt; Expressionopt ; Expressionopt ) Statement
        // for ( LeftHandSideExpression in Expression ) Statement

        var initializer = this.parseExpression(/*allowIn:*/ false);
        if (this.currentToken().keywordKind() === SyntaxKind.InKeyword) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        }
        else {
            return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        }
    }

    private parseForStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken): ForStatementSyntax {
        Debug.assert(forKeyword.keywordKind() === SyntaxKind.ForKeyword &&
                     openParenToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind() === SyntaxKind.OpenParenToken);

        // for ( ExpressionNoInopt; Expressionopt ; Expressionopt ) Statement
        var initializer: ExpressionSyntax = null;

        if (this.currentToken().kind() !== SyntaxKind.SemicolonToken &&
            this.currentToken().kind() !== SyntaxKind.CloseParenToken &&
            this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            initializer = this.parseExpression(/*allowIn:*/ false);
        }

        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
    }

    private parseForStatementWithVariableDeclarationOrInitializer(forKeyword: ISyntaxToken,
                                                                  openParenToken: ISyntaxToken,
                                                                  variableDeclaration: VariableDeclarationSyntax,
                                                                  initializer: ExpressionSyntax): ForStatementSyntax {
        
        var firstSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

        var condition: ExpressionSyntax = null;
        if (this.currentToken().kind() !== SyntaxKind.SemicolonToken &&
            this.currentToken().kind() !== SyntaxKind.CloseParenToken &&
            this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            condition = this.parseExpression(/*allowIn:*/ true);
        }

        var secondSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

        var incrementor: ExpressionSyntax = null;
        if (this.currentToken().kind() !== SyntaxKind.CloseParenToken &&
            this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            incrementor = this.parseExpression(/*allowIn:*/ true);
        }

        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);

        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, 
            firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
    }

    private isBreakStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.BreakKeyword;
    }

    private parseBreakStatement(): BreakStatementSyntax {
        Debug.assert(this.isBreakStatement());

        var breakKeyword = this.eatKeyword(SyntaxKind.BreakKeyword);

        // If there is no newline after the break keyword, then we can consume an optional 
        // identifier.
        var identifier: ISyntaxToken = null;
        if (!this.canEatExplicitOrAutomaticSemicolon()) {
            if (this.isIdentifier(this.currentToken())) {
                identifier = this.eatIdentifierToken();
            }
        }

        var semicolon = this.eatExplicitOrAutomaticSemicolon();
        return new BreakStatementSyntax(breakKeyword, identifier, semicolon);
    }

    private isContinueStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ContinueKeyword;
    }

    private parseContinueStatement(): ContinueStatementSyntax {
        Debug.assert(this.isContinueStatement());

        var continueKeyword = this.eatKeyword(SyntaxKind.ContinueKeyword);

        // If there is no newline after the break keyword, then we can consume an optional 
        // identifier.
        var identifier: ISyntaxToken = null;
        if (!this.canEatExplicitOrAutomaticSemicolon()) {
            if (this.isIdentifier(this.currentToken())) {
                identifier = this.eatIdentifierToken();
            }
        }

        var semicolon = this.eatExplicitOrAutomaticSemicolon();
        return new ContinueStatementSyntax(continueKeyword, identifier, semicolon);
    }

    private isSwitchStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.SwitchKeyword;
    }

    private parseSwitchStatement() {
        Debug.assert(this.isSwitchStatement());
        
        var switchKeyword = this.eatKeyword(SyntaxKind.SwitchKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var expression = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

        var switchClauses: SwitchClauseSyntax[] = null;
        if (!openBraceToken.isMissing()) {
            while (true) {
                if (this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }

                if (this.isSwitchClause()) {
                    var switchClause = this.parseSwitchClause();

                    switchClauses = switchClauses || [];
                    switchClauses.push(switchClause);
                }
                else {
                    // TODO: Error tolerance.
                    break;
                }
            }
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken,
            openBraceToken, SyntaxNodeList.create(switchClauses), closeBraceToken);
    }

    private isCaseSwitchClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.CaseKeyword;
    }

    private isDefaultSwitchClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.DefaultKeyword;
    }

    private isSwitchClause(): bool {
        return this.isCaseSwitchClause() || this.isDefaultSwitchClause();
    }

    private parseSwitchClause(): SwitchClauseSyntax {
        Debug.assert(this.isSwitchClause());
        if (this.isCaseSwitchClause()) {
            return this.parseCaseSwitchClause();
        }
        else if (this.isDefaultSwitchClause()) {
            return this.parseDefaultSwitchClause();
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private parseCaseSwitchClause(): CaseSwitchClauseSyntax {
        Debug.assert(this.isCaseSwitchClause());

        var caseKeyword = this.eatKeyword(SyntaxKind.CaseKeyword);
        var expression: ExpressionSyntax = null;
        if (this.currentToken().kind() !== SyntaxKind.ColonToken) {
            expression = this.parseExpression(/*allowIn:*/ true);
        }

        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statements = this.parseSwitchClauseStatements();

        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    }

    private parseDefaultSwitchClause(): DefaultSwitchClauseSyntax {
        Debug.assert(this.isDefaultSwitchClause());

        var defaultKeyword = this.eatKeyword(SyntaxKind.DefaultKeyword);
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statements = this.parseSwitchClauseStatements();

        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
    }

    private parseSwitchClauseStatements(): ISyntaxNodeList {
        var statements: StatementSyntax[] = null;

        while (true) {
            if (this.isSwitchClause() || this.currentToken().kind() == SyntaxKind.EndOfFileToken || this.currentToken().kind() === SyntaxKind.CloseBraceToken) {
                break;
            }

            var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);
            statements = statements || [];
            statements.push(statement);

            // TODO: error recovery.
        }

        return SyntaxNodeList.create(statements);
    }

    private isThrowStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ThrowKeyword;
    }

    private parseThrowStatement(): ThrowStatementSyntax {
        Debug.assert(this.isThrowStatement());

        var throwKeyword = this.eatKeyword(SyntaxKind.ThrowKeyword);

        var expression: ExpressionSyntax = null;
        if (this.canEatExplicitOrAutomaticSemicolon()) {
            // Because of automatic semicolon insertion, we need to report error if this 
            // throw could be terminated with a semicolon.  Note: we can't call 'parseExpression'
            // directly as that might consume an expression on the following line.  
            var token = this.createMissingToken(SyntaxKind.IdentifierNameToken, SyntaxKind.None);
            expression = new IdentifierNameSyntax(token);
        }
        else {
            expression = this.parseExpression(/*allowIn:*/ true);
        }
        
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();

        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
    }

    private isReturnStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ReturnKeyword;
    }

    private parseReturnStatement(): ReturnStatementSyntax {
        Debug.assert(this.isReturnStatement());

        var returnKeyword = this.eatKeyword(SyntaxKind.ReturnKeyword);

        var expression: ExpressionSyntax = null;
        if (!this.canEatExplicitOrAutomaticSemicolon()) {
            expression = this.parseExpression(/*allowIn:*/ true);
        }
        
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();

        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
    }

    private isExpressionStatement(): bool {
        // This is nearly the full 'first-set' for the expression statement.  The only tokens 
        // removed are the '{' and 'function' tokens as specified by the grammar.

        var currentToken = this.currentToken();
        var kind = currentToken.kind();
        var keywordKind = currentToken.keywordKind();

        switch (kind) {
            case SyntaxKind.NumericLiteral:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.RegularExpressionLiteral:
                return true;

            case SyntaxKind.OpenBracketToken: // For array literals.
            case SyntaxKind.OpenParenToken: // For parenthesized expressions
                return true;

            // Prefix unary expressions.
            case SyntaxKind.PlusPlusToken:
            case SyntaxKind.MinusMinusToken:
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.TildeToken:
            case SyntaxKind.ExclamationToken:
                return true;
        }

        switch (keywordKind) {
            case SyntaxKind.SuperKeyword:
            case SyntaxKind.ThisKeyword:
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
            case SyntaxKind.NullKeyword:
                return true;

            case SyntaxKind.NewKeyword: // For object creation expressions.
                return true;

            // Prefix unary expressions
            case SyntaxKind.DeleteKeyword:
            case SyntaxKind.VoidKeyword:
            case SyntaxKind.TypeOfKeyword:
                return true;
        }

        if (this.isIdentifier(this.currentToken())) {
            return true;
        }

        return false;
    }

    private parseExpressionStatement(): ExpressionStatementSyntax {
        var expression = this.parseExpression(/*allowIn:*/ true);

        var semicolon = this.eatExplicitOrAutomaticSemicolon();

        return new ExpressionStatementSyntax(expression, semicolon);
    }

    private isIfStatement(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.IfKeyword;
    }

    private parseIfStatement(): IfStatementSyntax {
        Debug.assert(this.isIfStatement());

        var ifKeyword = this.eatKeyword(SyntaxKind.IfKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var condition = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);

        var elseClause: ElseClauseSyntax = null;
        if (this.isElseClause()) {
            elseClause = this.parseElseClause();
        }

        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
    }

    private isElseClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ElseKeyword;
    }

    private parseElseClause(): ElseClauseSyntax {
        Debug.assert(this.isElseClause());

        var elseKeyword = this.eatKeyword(SyntaxKind.ElseKeyword);
        var statement = this.parseStatement(/*allowFunctionDeclaration:*/ false);

        return new ElseClauseSyntax(elseKeyword, statement);
    }

    private isVariableStatement(): bool {
        if (this.currentToken().keywordKind() === SyntaxKind.VarKeyword) {
            return true;
        }

        return this.currentToken().keywordKind() === SyntaxKind.ExportKeyword &&
               this.peekTokenN(1).keywordKind() === SyntaxKind.VarKeyword;
    }

    private parseVariableStatement(): VariableStatementSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword ||
                     this.currentToken().keywordKind() === SyntaxKind.VarKeyword);

        var exportKeyword: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }

        var variableDeclaration = this.parseVariableDeclaration(/*allowIn:*/ true);
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();

        return new VariableStatementSyntax(exportKeyword, variableDeclaration, semicolonToken);
    }

    private parseVariableDeclaration(allowIn: bool): VariableDeclarationSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.VarKeyword);
        var varKeyword = this.eatKeyword(SyntaxKind.VarKeyword);

        var variableDeclarators = [];

        var variableDeclarator = this.parseVariableDeclarator(allowIn);
        variableDeclarators.push(variableDeclarator);

        while (true) {
            if (this.currentToken().kind() !== SyntaxKind.CommaToken) {
                break;
            }

            var commaToken = this.eatToken(SyntaxKind.CommaToken);
            variableDeclarators.push(commaToken);

            variableDeclarator = this.parseVariableDeclarator(allowIn);
            variableDeclarators.push(variableDeclarator);
        }

        return new VariableDeclarationSyntax(varKeyword, SeparatedSyntaxList.create(variableDeclarators));
    }

    private parseVariableDeclarator(allowIn: bool): VariableDeclaratorSyntax {
        var identifier = this.eatIdentifierToken();
        var equalsValueClause: EqualsValueClauseSyntax = null;
        var typeAnnotation: TypeAnnotationSyntax = null;

        if (!identifier.isMissing()) {
            if (this.isTypeAnnotation()) {
                typeAnnotation = this.parseTypeAnnotation();
            }

            if (this.isEqualsValueClause()) {
                equalsValueClause = this.parseEqualsValuesClause(allowIn);
            }
        }

        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
    }

    private isEqualsValueClause(): bool {
        return this.currentToken().kind() === SyntaxKind.EqualsToken;
    }

    private parseEqualsValuesClause(allowIn: bool): EqualsValueClauseSyntax {
        Debug.assert(this.isEqualsValueClause());

        var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
        var value = this.parseAssignmentExpression(allowIn);

        return new EqualsValueClauseSyntax(equalsToken, value);
    }

    private parseExpression(allowIn: bool): ExpressionSyntax {
        return this.parseSubExpression(0, allowIn);
    }

    // Called when you need to parse an expression, but you do not want to allow 'CommaExpressions'.
    // i.e. if you have "var a = 1, b = 2" then when we parse '1' we want to parse with higher 
    // precedence than 'comma'.  Otherwise we'll get: "var a = (1, (b = 2))", instead of
    // "var a = (1), b = (2)");
    private parseAssignmentExpression(allowIn: bool): ExpressionSyntax {
        return this.parseSubExpression(ParserExpressionPrecedence.AssignmentExpressionPrecedence, allowIn);
    }

    private parseUnaryExpression(): UnaryExpressionSyntax {
        var currentTokenKind = this.currentToken().kind();
        if (SyntaxFacts.isPrefixUnaryExpressionOperatorToken(currentTokenKind)) {
            var operatorKind = SyntaxFacts.getPrefixUnaryExpression(currentTokenKind);

            var operatorToken = this.eatAnyToken();

            var operand = this.parseUnaryExpression(); 
            return new PrefixUnaryExpressionSyntax(operatorKind, operatorToken, operand);
        }
        else {
            return this.parseTerm(/*allowInvocation*/ true, /*allowType:*/ false);
        }
    }

    private parseSubExpression(precedence: ParserExpressionPrecedence, allowIn: bool): ExpressionSyntax {
        // Because unary expression have the highest precedence, we can always parse one, regardless 
        // of what precedence was passed in.
        var leftOperand: ExpressionSyntax = this.parseUnaryExpression();
        leftOperand = this.parseBinaryExpressions(precedence, allowIn, leftOperand);
        leftOperand = this.parseConditionalExpression(precedence, allowIn, leftOperand);

        return leftOperand;
    }

    private parseConditionalExpression(precedence: number, allowIn: bool, leftOperand: ExpressionSyntax): ExpressionSyntax {
        // Only consume this as a ternary expression if our precedence is higher than the ternary 
        // level.  i.e. if we have "!f ? a : b" then we would not want to 
        // consume the "?" as part of "f" because the precedence of "!" is far too high.  However,
        // if we have: "x = f ? a : b", then we would want to consume the "?" as part of "f".
        //
        // Note: if we have "m = f ? x ? y : z : b, then we do want the second "?" to go with 

        var currentTokenKind = this.currentToken().kind();
        if (currentTokenKind === SyntaxKind.QuestionToken && precedence <= ParserExpressionPrecedence.ConditionalExpressionPrecedence) {
            var questionToken = this.eatToken(SyntaxKind.QuestionToken);

            var whenTrueExpression = this.parseAssignmentExpression(allowIn);
            var colon = this.eatToken(SyntaxKind.ColonToken);

            var whenFalseExpression = this.parseAssignmentExpression(allowIn);
            leftOperand = new ConditionalExpressionSyntax(leftOperand, questionToken, whenTrueExpression, colon, whenFalseExpression);
        }

        return leftOperand;
    }

    private parseBinaryExpressions(precedence: number, allowIn: bool, leftOperand: ExpressionSyntax): ExpressionSyntax {
        while (true) {
            // We either have a binary operator here, or we're finished.
            var currentTokenKind = this.currentToken().kind();
            var currentTokenKeywordKind = this.currentToken().keywordKind();

            if (currentTokenKeywordKind === SyntaxKind.InstanceOfKeyword || currentTokenKeywordKind === SyntaxKind.InKeyword) {
                currentTokenKind = currentTokenKeywordKind;
            }

            if (!SyntaxFacts.isBinaryExpressionOperatorToken(currentTokenKind)) {
                break;
            }

            // also, if it's the 'in' operator, only allow if our caller allows it.
            if (currentTokenKind === SyntaxKind.InKeyword && !allowIn) {
                break;
            }

            var binaryExpressionKind = SyntaxFacts.getBinaryExpressionFromOperatorToken(currentTokenKind);
            var newPrecedence = this.getPrecedence(binaryExpressionKind);

                  // All binary operators must have precedence > 0!
            Debug.assert(newPrecedence > 0);

            // Check the precedence to see if we should "take" this operator
            if (newPrecedence < precedence) {
                break;
            }

            // Same precedence, but not right-associative -- deal with this higher up in our stack "later"
            if (newPrecedence == precedence && !this.isRightAssociative(binaryExpressionKind)) {
                break;
            }

            // Precedence is okay, so we'll "take" this operator.
            var operatorToken = this.eatAnyToken();
            leftOperand = new BinaryExpressionSyntax(binaryExpressionKind, leftOperand, operatorToken, this.parseSubExpression(newPrecedence, allowIn));
        }

        return leftOperand;
    }

    private isRightAssociative(expressionKind: SyntaxKind): bool {
        switch (expressionKind) {
            case SyntaxKind.AssignmentExpression:
            case SyntaxKind.AddAssignmentExpression:
            case SyntaxKind.SubtractAssignmentExpression:
            case SyntaxKind.MultiplyAssignmentExpression:
            case SyntaxKind.DivideAssignmentExpression:
            case SyntaxKind.ModuloAssignmentExpression:
            case SyntaxKind.AndAssignmentExpression:
            case SyntaxKind.ExclusiveOrAssignmentExpression:
            case SyntaxKind.OrAssignmentExpression:
            case SyntaxKind.LeftShiftAssignmentExpression:
            case SyntaxKind.SignedRightShiftAssignmentExpression:
            case SyntaxKind.UnsignedRightShiftAssignmentExpression:
                return true;
            default:
                return false;
        }
    }

    private parseTerm(allowInvocation: bool, allowType: bool): UnaryExpressionSyntax {
        var term = this.parseTermWorker(allowType);
        if (term.isMissing()) {
            return term;
        }

        return this.parsePostFixExpression(term, allowInvocation);
    }

    private parsePostFixExpression(expression: UnaryExpressionSyntax, allowInvocation: bool): UnaryExpressionSyntax {
        Debug.assert(expression !== null);

        while (true) {
            var currentTokenKind = this.currentToken().kind();
            switch (currentTokenKind) {
                case SyntaxKind.OpenParenToken:
                    if (!allowInvocation) {
                        return expression;
                    }

                    expression = new InvocationExpressionSyntax(expression, this.parseArgumentList());
                    break;

                case SyntaxKind.OpenBracketToken:
                    expression = this.parseElementAccessExpression(expression);
                    break;

                case SyntaxKind.PlusPlusToken:
                case SyntaxKind.MinusMinusToken:
                    // Because of automatic semicolon insertion, we should only consume the ++ or -- 
                    // if it is on the same line as the previous token.
                    if (this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
                        return expression;
                    }

                    expression = new PostfixUnaryExpressionSyntax(
                        SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken(currentTokenKind), expression, this.eatAnyToken());
                    break;

                case SyntaxKind.DotToken:
                    expression = new MemberAccessExpressionSyntax(
                        expression, this.eatToken(SyntaxKind.DotToken), this.parseIdentifierName());
                    break;

                default:
                    return expression;
            }
        }
    }

    private isArgumentList(): bool {
        return this.currentToken().kind() === SyntaxKind.OpenParenToken;
    }

    private parseArgumentList(): ArgumentListSyntax { 
        Debug.assert(this.isArgumentList());

        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);

        var arguments: any[] = null;

        if (this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            var argument = this.parseAssignmentExpression(/*allowIn:*/ true);
            arguments = [];
            arguments.push(argument);
        }

        while (true) {
            if (this.currentToken().kind() === SyntaxKind.CloseParenToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }

            if (this.currentToken().kind() == SyntaxKind.CommaToken) {
                var commaToken = this.eatToken(SyntaxKind.CommaToken);

                arguments = arguments == null ? [] : arguments;
                arguments.push(commaToken);

                var argument = this.parseAssignmentExpression(/*allowIn:*/ true);
                arguments.push(argument);
            }
            else {
                // TODO: add error tolerance here.
                break;
            }
        }

        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        return new ArgumentListSyntax(openParenToken, SeparatedSyntaxList.create(arguments), closeParenToken);
    }

    private parseElementAccessExpression(expression: ExpressionSyntax): ElementAccessExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBracketToken);

        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
        var argumentExpression = this.parseExpression(/*allowIn:*/ true);
        var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    }

    private parseTermWorker(allowType: bool): UnaryExpressionSyntax {
        var currentToken = this.currentToken();

        if (allowType && this.isType()) {
            return this.parseType();
        }

        if (this.isIdentifier(currentToken)) {
            var identifier = this.eatIdentifierToken();
            return new IdentifierNameSyntax(identifier);
        }

        var currentTokenKind = currentToken.kind();
        var currentTokenKeywordKind = currentToken.keywordKind();
        switch (currentTokenKeywordKind) {
            case SyntaxKind.ThisKeyword:
                return this.parseThisExpression();

            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
                return this.parseLiteralExpression(SyntaxKind.BooleanLiteralExpression);

            case SyntaxKind.NullKeyword:
                return this.parseLiteralExpression(SyntaxKind.NullLiteralExpression);

            case SyntaxKind.NewKeyword:
                return this.parseObjectCreationExpression();

            case SyntaxKind.FunctionKeyword:
                return this.parseFunctionExpression();

            case SyntaxKind.SuperKeyword:
                return this.parseSuperExpression();
        }

        switch (currentTokenKind) {
            case SyntaxKind.NumericLiteral:
                return this.parseLiteralExpression(SyntaxKind.NumericLiteralExpression);

            case SyntaxKind.RegularExpressionLiteral:
                return this.parseLiteralExpression(SyntaxKind.RegularExpressionLiteralExpression);

            case SyntaxKind.StringLiteral:
                return this.parseLiteralExpression(SyntaxKind.StringLiteralExpression);

            case SyntaxKind.OpenBracketToken:
                return this.parseArrayLiteralExpression();

            case SyntaxKind.OpenBraceToken:
                return this.parseObjectLiteralExpression();

            case SyntaxKind.OpenParenToken:
                return this.parseParenthesizedOrLambdaExpression();

            case SyntaxKind.LessThanToken:
                return this.parseCastExpression();
        }

        // Parse out a missing name here once code for all cases has been included.
        if (true) {
            throw Errors.notYetImplemented();
        }

        // Nothing else worked, just try to consume an identifier so we report an error.
        return new IdentifierNameSyntax(this.eatIdentifierToken());
    }

    private parseSuperExpression(): SuperExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.SuperKeyword);
        
        var superKeyword = this.eatKeyword(SyntaxKind.SuperKeyword);
        return new SuperExpressionSyntax(superKeyword);
    }

    private parseFunctionExpression(): FunctionExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.FunctionKeyword);

        var functionKeyword = this.eatKeyword(SyntaxKind.FunctionKeyword);
        var identifier: ISyntaxToken = null;
        
        if (this.isIdentifier(this.currentToken())) {
            identifier = this.eatIdentifierToken();
        }

        var callSignature = this.parseCallSignature();
        var block = this.parseBlock(/*allowFunctionDeclaration:*/ true);

        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
    }

    private parseCastExpression(): CastExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.LessThanToken);

        var lessThanToken = this.eatToken(SyntaxKind.LessThanToken);
        var type = this.parseType();
        var greaterThanToken = this.eatToken(SyntaxKind.GreaterThanToken);
        var expression = this.parseUnaryExpression();

        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    }

    private parseObjectCreationExpression(): ObjectCreationExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.NewKeyword);
        var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);

        // While parsing the sub term we don't want to allow invocations to be parsed.  that's because
        // we want "new Foo()" to parse as "new Foo()" (one node), not "new (Foo())".
        var expression = this.parseTerm(/*allowInvocation:*/ false, /*allowType:*/ true);

        var argumentList: ArgumentListSyntax = null;
        if (this.isArgumentList()) {
            argumentList = this.parseArgumentList();
        }

        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    }

    private parseParenthesizedOrLambdaExpression(): UnaryExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

            var result = this.tryParseArrowFunctionExpression();
            if (result !== null) {
                return result;
            }

        // Doesn't look like a lambda, so parse this as a parenthesized expression.
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var expression = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    }

    private tryParseArrowFunctionExpression(): ArrowFunctionExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

        // Because arrow functions and parenthesized expressions look similar, we have to check far
        // enough ahead to be sure we've actually got an arrow function.

        // First, check for things that definitely have enough information to let us know it's an
        // arrow function.

        if (this.isDefinitelyArrowFunctionExpression()) {
            return this.parseParenthesizedArrowFunctionExpression(/*requiresArrow:*/ false);
        }

        // Now, look for cases where we're sure it's not an arrow function.  This will help save us
        // a costly parse.
        if (this.isDefinitelyParenthesizedExpression()) {
            return null;
        }

        // Then, try to actually parse it as a lambda, and only return if we see an => 
        var resetPoint = this.getResetPoint();
        try {
            var arrowFunction = this.parseParenthesizedArrowFunctionExpression(/*requiresArrow:*/ true);
            if (arrowFunction === null) {
                this.reset(resetPoint);
            }
            return arrowFunction;
        }
        finally {
            this.release(resetPoint);
        }
    }

    private isDefinitelyParenthesizedExpression(): bool {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        var token1 = this.peekTokenN(1);
        var token2 = this.peekTokenN(2);
        var token3 = this.peekTokenN(3);

        if (token1.kind() === SyntaxKind.CloseParenToken) {
            // ()
            // Not definitely a parenthesized expression.
            return false;
        }

        if (!this.isIdentifier(token1)) {
            // (+
            // (++
            // (null
            // etc.
            //
            // Since a parenthesized arrow function must start with "()" or "(id", we know we must
            // have a parenthesized expressoin here instead.
            return true;
        }

        if (token1.kind() === SyntaxKind.IdentifierNameToken) {
            // (id
            // Could still be an arrow function.  Look a bit more.

            if (token2.kind() === SyntaxKind.DotToken ||
                token2.kind() === SyntaxKind.OpenParenToken) {
                // (id.
                // (id(
                // Definitely a parenthesized expression.
                return true;
            }

            if (SyntaxFacts.isBinaryExpressionOperatorToken(token2.kind()) && 
                token2.kind() !== SyntaxKind.CommaToken) {
                // (id +
                // (id <
                //
                // but not: (id, 
                //
                // etc.
                // Definitely a parenthesized expression of some sort.
                return true;
            }

            if (token2.kind() === SyntaxKind.QuestionToken) {
                // (id?
                //
                // In order to be a arrow function it would need to be:
                //
                // (id?:
                // (id?)
                // (id?,
                //
                // Anything else, and it must be a parenthesized expression.

                if (token3.kind() !== SyntaxKind.ColonToken &&
                    token3.kind() !== SyntaxKind.CloseParenToken &&
                    token3.kind() !== SyntaxKind.CommaToken) {
                    // Definitely a parenthesized expression.
                    return true;
                }
            }
        }

        // TODO: Add more cases if you're sure that there is enough information to know not to 
        // parse this as an arrow function.

        return false;
    }

    private parseParenthesizedArrowFunctionExpression(requireArrow: bool): ParenthesizedArrowFunctionExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

        var callSignature = this.parseCallSignature();

        if (requireArrow && this.currentToken().kind() !== SyntaxKind.EqualsGreaterThanToken) {
            return null;
        }

        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var body: SyntaxNode = null;

        if (this.isBlock()) {
            body = this.parseBlock(/*allowFunctionDeclaration:*/ false);
        }
        else {
            body = this.parseAssignmentExpression(/*allowIn:*/ true); 
        }

        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
    }

    private isBlock(): bool {
        return this.currentToken().kind() === SyntaxKind.OpenBraceToken;
    }

    private isDefinitelyArrowFunctionExpression(): bool {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

        var token0 = this.currentToken();
        var token1 = this.peekTokenN(1);
        var token2 = this.peekTokenN(2);
        var token3 = this.peekTokenN(3);

        if (token1.kind() === SyntaxKind.CloseParenToken) {
            // ()
            // Definitely not a parenthesized expression. And could be a lambda.
            return true;
        }

        if (this.isIdentifier(token1)) {
            // (id
            // Could be a parenthesized expression or a lambda

            // NOTE:
            // (id, 
            // Could be a parenthesized expression with a comma expression in it.

            if (token2.kind() === SyntaxKind.ColonToken) {
                // (id:
                // Definitely not a parenthesized expression. possibly a lambda.
                return true;
            }
            else if (token2.kind() === SyntaxKind.QuestionToken) {
                // (id?
                // Could be a parenthesized ternary.
                if (token3.kind() === SyntaxKind.ColonToken) {
                    // (id?:
                    // Definitely a lambda.
                    return true;
                }
                else if (token3.kind() === SyntaxKind.CommaExpression) {
                    // (id?,
                    // Definitely a lambda.
                    return true;
                }
                else if (token3.kind() === SyntaxKind.CloseParenToken) {
                    // (id?)
                    // Definitely a lambda.
                }
            }
            else if (token2.kind() === SyntaxKind.CloseParenToken) {
                // (id)
                // Could be a parenthesized expression or a lambda

                // (id):
                //
                // Looks like a lambda.  However, there is a potential ambiguity here.  We could have:
                //
                //  var v = (id): type =>
                //
                // or we could have:
                //
                //  var v = true ? (id) : type;

                if (token3.kind() === SyntaxKind.EqualsGreaterThanToken) {
                    // (id) =>
                    // definitely a lambda.
                    return true;
                }
            }
        }

        // TODO: Add more cases if you're sure that there is enough information to know to 
        // parse this as an arrow function.  Note: be very careful here.

        // Anything else wasn't clear enough.  Try to parse the expression as a lambda and bail out
        // if we fail.
        return false;
    }

    private parseObjectLiteralExpression(): ObjectLiteralExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBraceToken);

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var propertyAssignments: any[] = null;

        while (true) {
            if (this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }

            if (this.isPropertyAssignment()) {
                var propertyAssignment = this.parsePropertyAssignment();

                propertyAssignments = propertyAssignments || [];
                propertyAssignments.push(propertyAssignment);

                if (this.currentToken().kind() === SyntaxKind.CommaToken) {
                    var commaToken = this.eatToken(SyntaxKind.CommaToken);
                    propertyAssignments.push(commaToken);
                    continue;
                }
            }

            // TODO: error recovery
            break;
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ObjectLiteralExpressionSyntax(
            openBraceToken, SeparatedSyntaxList.create(propertyAssignments), closeBraceToken);
    }

    private parsePropertyAssignment(): PropertyAssignmentSyntax {
        Debug.assert(this.isPropertyAssignment());
        if (this.isGetAccessorPropertyAssignment()) {
            return this.parseGetAccessorPropertyAssignment();
        }
        else if (this.isSetAccessorPropertyAssignment()) {
            return this.parseSetAccessorPropertyAssignment();
        }
        else if (this.isSimplePropertyAssignment()) {
            return this.parseSimplePropertyAssignment();
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private isPropertyAssignment(): bool {
        return this.isGetAccessorPropertyAssignment() ||
               this.isSetAccessorPropertyAssignment() ||
               this.isSimplePropertyAssignment();
    }

    private isGetAccessorPropertyAssignment(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.GetKeyword &&
               this.isPropertyName(this.peekTokenN(1));
    }

    private parseGetAccessorPropertyAssignment(): GetAccessorPropertyAssignmentSyntax {
        Debug.assert(this.isGetAccessorPropertyAssignment());

        var getKeyword = this.eatKeyword(SyntaxKind.GetKeyword);
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var block = this.parseBlock(/*allowFunctionDeclaration:*/ true);

        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
    }

    private isSetAccessorPropertyAssignment(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.SetKeyword &&
               this.isPropertyName(this.peekTokenN(1));
    }

    private parseSetAccessorPropertyAssignment(): SetAccessorPropertyAssignmentSyntax {
        Debug.assert(this.isSetAccessorPropertyAssignment());

        var setKeyword = this.eatKeyword(SyntaxKind.SetKeyword);
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var parameterName = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var block = this.parseBlock(/*allowFunctionDeclaration:*/ true);

        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
    }

    private isSimplePropertyAssignment(): bool {
        return this.isPropertyName(this.currentToken());
    }

    private parseSimplePropertyAssignment(): SimplePropertyAssignmentSyntax {
        Debug.assert(this.isSimplePropertyAssignment());

        var propertyName = this.eatAnyToken();
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var expression = this.parseAssignmentExpression(/*allowIn:*/ true);

        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    }

    private isPropertyName(token: ISyntaxToken): bool {
        // NOTE: we do *not* want to check "this.isIdentifier" here.  Any IdentifierNameToken is 
        // allowed here, even reserved words like keywords.
        switch (token.kind()) {
            case SyntaxKind.IdentifierNameToken:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.NumericLiteral:
                return true;

            default:
                return false;
        }
    }

    private parseArrayLiteralExpression(): ArrayLiteralExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBracketToken);
        
        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);

        var expressions: any[] = null;

        var addOmittedExpression = true;
        while (true) {
            var currentTokenKind = this.currentToken().kind();
            if (currentTokenKind === SyntaxKind.CloseBracketToken || currentTokenKind === SyntaxKind.EndOfFileToken) {
                break;
            }

            if (this.currentToken().kind() === SyntaxKind.CommaToken) {
                expressions = expressions || []; 

                if (addOmittedExpression) {
                    expressions.push(new OmittedExpressionSyntax());
                }

                expressions.push(this.eatToken(SyntaxKind.CommaToken));
                addOmittedExpression = true;
                continue;
            }

            // TODO: Properly do error recovery hre.
            var expression = this.parseAssignmentExpression(/*allowIn:*/ true);
            if (expression.isMissing()) {
                break;
            }
            
            expressions = expressions || []; 
            expressions.push(expression);
            addOmittedExpression = false;

            currentTokenKind = this.currentToken().kind();
            if (currentTokenKind !== SyntaxKind.CloseBracketToken && currentTokenKind !== SyntaxKind.CommaToken) {
                break;
            }
        }

        var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

        return new ArrayLiteralExpressionSyntax(openBracketToken, SeparatedSyntaxList.create(expressions), closeBracketToken);
    }

    private parseLiteralExpression(expressionKind: SyntaxKind): LiteralExpressionSyntax {
        // TODO: add appropriate asserts here.
        var literal = this.eatAnyToken();
        return new LiteralExpressionSyntax(expressionKind, literal);
    }

    private parseThisExpression(): ThisExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ThisKeyword);
        var thisKeyword = this.eatKeyword(SyntaxKind.ThisKeyword);
        return new ThisExpressionSyntax(thisKeyword);
    }

    private parseBlock(allowFunctionDeclaration: bool): BlockSyntax {
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

        var statements: StatementSyntax[] = null;

        if (!openBraceToken.isMissing()) {
            while (true) {
                if (this.currentToken().kind() === SyntaxKind.CloseBraceToken ||
                    this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }

                // REVIEW: add error tolerance here.
                var statement = this.parseStatement(allowFunctionDeclaration);

                statements = statements || [];
                statements.push(statement);
            }
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new BlockSyntax(openBraceToken, SyntaxNodeList.create(statements), closeBraceToken);
    }

    private parseCallSignature(): CallSignatureSyntax {
        var parameterList = this.parseParameterList();
        var typeAnnotation: TypeAnnotationSyntax = null;
        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        return new CallSignatureSyntax(parameterList, typeAnnotation);
    }

    private parseParameterList(): ParameterListSyntax {
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);

        var parameters: any[] = null;

        if (!openParenToken.isMissing()) {
            if (this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
                var parameter = this.parseParameter();
                parameters = [];
                parameters.push(parameter);
            }

            while (true) {
                if (this.currentToken().kind() === SyntaxKind.CloseParenToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }

                if (this.currentToken().kind() == SyntaxKind.CommaToken) {
                    var commaToken = this.eatToken(SyntaxKind.CommaToken);

                    parameters = parameters == null ? [] : parameters;
                    parameters.push(commaToken);

                    var parameter = this.parseParameter();
                    parameters.push(parameter);
                }
                else {
                    // TODO: add error tolerance here.
                    break;
                }
            }
        }

        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        return new ParameterListSyntax(openParenToken, SeparatedSyntaxList.create(parameters), closeParenToken);
    }

    private isTypeAnnotation(): bool {
        return this.currentToken().kind() === SyntaxKind.ColonToken;
    }

    private parseTypeAnnotation(): TypeAnnotationSyntax {
        Debug.assert(this.isTypeAnnotation());

        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var type = this.parseType();

        return new TypeAnnotationSyntax(colonToken, type);
    }

    private isType(): bool {
        return this.isPredefinedType() ||
               this.isTypeLiteral() ||
               this.isName();
    }

    private parseType(): TypeSyntax {
        var type = this.parseNonArrayType();

        while (this.currentToken().kind() === SyntaxKind.OpenBracketToken) {
            var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
            var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

            type = new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
        }

        return type;
    }

    private parseNonArrayType(): TypeSyntax {
        if (this.isPredefinedType()) {
            return this.parsePredefinedType();
        }
        else if (this.isTypeLiteral()) {
            return this.parseTypeLiteral();
        }
        else {
            return this.parseName();
        }
    }

    private parseTypeLiteral(): TypeSyntax {
        Debug.assert(this.isTypeLiteral());
        if (this.isObjectType()) {
            return this.parseObjectType();
        }
        else if (this.isFunctionType()) {
            return this.parseFunctionType();
        }
        else if (this.isConstructorType()) {
            return this.parseConstructorType();
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private parseFunctionType(): FunctionTypeSyntax {
        Debug.assert(this.isFunctionType());

        var parameterList = this.parseParameterList();
        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var returnType = this.parseType();

        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, returnType);
    }

    private parseConstructorType(): ConstructorTypeSyntax {
        throw Errors.notYetImplemented();
    }

    private isTypeLiteral(): bool {
        return this.isObjectType() ||
               this.isFunctionType() ||
               this.isConstructorType();
    }

    private isObjectType(): bool {
        return this.currentToken().kind() === SyntaxKind.OpenBraceToken;
    }

    private isFunctionType(): bool {
        return this.currentToken().kind() === SyntaxKind.OpenParenToken;
    }

    private isConstructorType(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.NewKeyword;
    }

    private parsePredefinedType(): PredefinedTypeSyntax {
        Debug.assert(this.isPredefinedType());
        var keyword = this.eatAnyToken();
        return new PredefinedTypeSyntax(keyword);
    }

    private isPredefinedType(): bool {
        switch (this.currentToken().keywordKind()) {
            case SyntaxKind.AnyKeyword:
            case SyntaxKind.NumberKeyword:
            case SyntaxKind.BoolKeyword:
            case SyntaxKind.StringKeyword:
            case SyntaxKind.VoidKeyword:
                return true;
        }

        return false;
    }

    private parseParameter(): ParameterSyntax {
        var dotDotDotToken: ISyntaxToken = null;
        if (this.currentToken().kind() === SyntaxKind.DotDotDotToken) {
            dotDotDotToken = this.eatToken(SyntaxKind.DotDotDotToken);
        }

        var publicOrPrivateToken: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
            this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateToken = this.eatAnyToken();
        }

        var identifier = this.eatIdentifierToken();

        var questionToken: ISyntaxToken = null;
        if (this.currentToken().kind() === SyntaxKind.QuestionToken) {
            questionToken = this.eatToken(SyntaxKind.QuestionToken);
        }

        var typeAnnotation: TypeAnnotationSyntax = null;
        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        var equalsValueClause: EqualsValueClauseSyntax = null;
        if (this.isEqualsValueClause()) {
            equalsValueClause = this.parseEqualsValuesClause(/*allowIn:*/ true);
        }

        return new ParameterSyntax(dotDotDotToken, publicOrPrivateToken, identifier, questionToken, typeAnnotation, equalsValueClause);
    }
}