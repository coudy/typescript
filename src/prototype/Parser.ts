///<reference path='References.ts' />

interface IParserRewindPoint extends IRewindPoint {
    previousToken: ISyntaxToken;
    isInStrictMode: bool;
    diagnosticsCount: number;
    skippedTokensCount: number;
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

// The current state of the parser wrt to list parsing.  The way to read these is as:
// CurrentProduction_SubList.  i.e. "Block_Statements" means "we're parsing a Block, and we're 
// currently parsing list of statements within it".  This is used by the list parsing mechanism
// to both the elements of the lists, and recover from errors we encounter when we run into 
// unexpected code.
// 
// For example, when we are in ArgumentList_Arguments, we will continue trying to consume code as 
// long as "isArgument" is true.  If we run into a token for which "isArgument" is not true we will
// do the following:
//
// If the token is a StopToken for ArgumentList_Arguments then we will stop parsing the list of 
// arguments with no error.
//
// Otherwise, we *do* report an error for this unexpected token.
//
// We then will attempt error recovery.  Error recovery will walk up the list of states we're in 
// seeing if the token is a stop token for that construct *or* could start another element within
// what construct.  For example, if the unexpected token was '}' then that would be a stop token
// for Block_Statements.  Alternatively, if the unexpected token was 'return', then that would be
// a start token for the next statment in Block_Statements.
// 
// If either of those cases are true, We will then return *without* consuming  that token. 
// (Remember, we've already reported an error).  Now we're just letting the higher up parse 
// constructs eventually try to consume that token.
//
// If none of the higher up states consider this a stop or start token, then we will simply consume
// the token and add it to our list of 'skipped tokens'.  We will then repeat the above algorithm
// until we resynchronize at some point.
enum ListParsingState {
    SourceUnit_ModuleElements = 1 << 0,
    ClassDeclaration_ClassElements = 1 << 1,
    ModuleDeclaration_ModuleElements = 1 << 2,
    SwitchStatement_SwitchClauses = 1 << 3,
    SwitchClause_Statements = 1 << 4,
    Block_Statements_AllowFunctionDeclarations = 1 << 5,
    Block_Statements_DisallowFunctionDeclarations = 1 << 6,
    EnumDeclaration_VariableDeclarators = 1 << 7,
    ObjectType_TypeMembers = 1 << 8,
    ExtendsOrImplementsClause_TypeNameList = 1 << 9,
    VariableDeclaration_VariableDeclarators_AllowIn = 1 << 10,
    VariableDeclaration_VariableDeclarators_DisallowIn = 1 << 11,
    ArgumentList_AssignmentExpressions = 1 << 12,
    ObjectLiteralExpression_PropertyAssignments = 1 << 13,
    ArrayLiteralExpression_AssignmentExpressions = 1 << 14,
    ParameterList_Parameters = 1 << 15,

    FirstListParsingState = SourceUnit_ModuleElements,
    LastListParsingState = ParameterList_Parameters,
}

class Parser extends SlidingWindow {
    // The scanner we're pulling tokens from.
    private scanner: Scanner;

    // The previous version of the syntax tree that was parsed.  Used for incremental parsing if it
    // is provided.
    private oldTree: SyntaxTree;

    // Parsing options.
    private options: ParseOptions = null;

    // Current state of the parser.  If we need to rewind we will store and reset these values as
    // appropriate.

    // The current token the parser is examining.  If it is null it needs to be fetched from the 
    // scanner.
    private _currentToken: ISyntaxToken = null;

    // The previous token to the current token.  Set when we advance to the next token.
    private previousToken: ISyntaxToken = null;

    // Whether or not we are in strict parsing mode.  All that changes in strict parsing mode is
    // that some tokens that would be considered identifiers may be considered keywords.
    private isInStrictMode: bool;

    private skippedTokens: ISyntaxToken[] = [];
    private diagnostics: SyntaxDiagnostic[] = [];
    private listParsingState: ListParsingState = 0;

    constructor(
        scanner: Scanner,
        oldTree?: SyntaxTree,
        changes?: TextChangeRange[],
        options?: ParseOptions) {
        super(32, null);

        this.scanner = scanner;

        this.oldTree = oldTree;
        this.options = options || new ParseOptions();
    }

    private isIncremental(): bool {
        return this.oldTree !== null;
    }

    public storeAdditionalRewindState(rewindPoint: IParserRewindPoint): void {
        rewindPoint.previousToken = this.previousToken;
        rewindPoint.isInStrictMode = this.isInStrictMode;
        rewindPoint.diagnosticsCount = this.diagnostics.length;
        rewindPoint.skippedTokensCount = this.skippedTokens.length;
    }

    public restoreStateFromRewindPoint(rewindPoint: IParserRewindPoint): void {
        this._currentToken = null;
        this.previousToken = rewindPoint.previousToken;
        this.isInStrictMode = rewindPoint.isInStrictMode;
        this.diagnostics.length = rewindPoint.diagnosticsCount;
        this.skippedTokens.length = rewindPoint.skippedTokensCount;
    }

    public fetchMoreItems(sourceIndex: number, window: any[], destinationIndex: number, spaceAvailable: number): number {
        // Assert disabled because it is actually expensive enugh to affect perf.
        // Debug.assert(spaceAvailable > 0);
        window[destinationIndex] = this.scanner.scan();
        return 1;
    }

    private currentToken(): ISyntaxToken {
        var result = this._currentToken;

        if (result === null) {
            result = this.currentItem();
            this._currentToken = result;
        }

        return result;
    }

    private peekTokenN(n: number): ISyntaxToken {
        return this.peekItemN(n);
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

        this.moveToNextItem();
    }

    private canEatAutomaticSemicolon(): bool {
        var token = this.currentToken();

        // An automatic semicolon is always allowed if we're at the end of the file.
        if (token.kind === SyntaxKind.EndOfFileToken) {
            return true;
        }

        // Or if the next token is a close brace (regardless of which line it is on).
        if (token.kind === SyntaxKind.CloseBraceToken) {
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

        if (token.kind === SyntaxKind.SemicolonToken) {
            return true;
        }

        return this.canEatAutomaticSemicolon();
    }

    private eatExplicitOrAutomaticSemicolon(): ISyntaxToken {
        var token = this.currentToken();

        // If we see a semicolon, then we can definitely eat it.
        if (token.kind === SyntaxKind.SemicolonToken) {
            return this.eatToken(SyntaxKind.SemicolonToken);
        }

        // Check if an automatic semicolon could go here.  If so, synthesize one.  However, if the
        // user has the option set to error on automatic semicolons, then add an error to that
        // token as well.
        if (this.canEatAutomaticSemicolon()) {
            var semicolonToken = SyntaxTokenFactory.createEmptyToken(this.previousToken.end(), SyntaxKind.SemicolonToken, SyntaxKind.None);

            if (!this.options.allowAutomaticSemicolonInsertion()) {
                // Report the missing semicolon at the end of the *previous* token.

                this.addDiagnostic(
                    new SyntaxDiagnostic(this.previousToken.end(), 0, DiagnosticCode.AutomaticSemicolonInsertionNotAllowed, null)); 
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
        // Assert disabled because it is actually expensive enugh to affect perf.
        // Debug.assert(SyntaxFacts.isTokenKind(kind))

        var token = this.currentToken();
        if (token.kind === kind) {
            this.moveToNextToken();
            return token;
        }

        //slow part of EatToken(SyntaxKind kind)
        return this.createMissingToken(kind, SyntaxKind.None, token);
    }

    // Eats the token if it is there.  Otherwise does nothing.  Will not report errors.
    private tryEatToken(kind: SyntaxKind): ISyntaxToken {
         if (this.currentToken().kind === kind) {
            return this.eatToken(kind);
        }

         return null;
    }

    // Eats the keyword if it is there.  Otherwise does nothing.  Will not report errors.
    private tryEatKeyword(kind: SyntaxKind): ISyntaxToken {
         if (this.currentToken().keywordKind() === kind) {
            return this.eatKeyword(kind);
        }

         return null;
    }

    private eatKeyword(kind: SyntaxKind): ISyntaxToken {
        Debug.assert(SyntaxFacts.isTokenKind(kind))

        var token = this.currentToken();
        if (token.keywordKind() === kind) {
            this.moveToNextToken();
            return token;
        }

        //slow part of EatToken(SyntaxKind kind)
        return this.createMissingToken(SyntaxKind.IdentifierNameToken, kind, token);
    }

    // This method should be called when the grammar calls for on *IdentifierName* and not an
    // *Identifier*.
    private eatIdentifierNameToken(): ISyntaxToken {
        var token = this.currentToken();
        if (token.kind === SyntaxKind.IdentifierNameToken) {
            this.moveToNextToken();
            return token;
        }

        return this.createMissingToken(SyntaxKind.IdentifierNameToken, SyntaxKind.None, token);
    }

    // This method should be called when the grammar calls for on *Identifier* and not an
    // *IdentifierName*.
    private eatIdentifierToken(): ISyntaxToken {
        var token = this.currentToken();
        if (token.kind === SyntaxKind.IdentifierNameToken) {
            if (this.isKeyword(token.keywordKind())) {
                return this.createMissingToken(SyntaxKind.IdentifierNameToken, SyntaxKind.None, token);
            }

            this.moveToNextToken();
            return token;
        }

        return this.createMissingToken(SyntaxKind.IdentifierNameToken, SyntaxKind.None, token);
    }

    private isIdentifier(token: ISyntaxToken): bool {
        return token.kind === SyntaxKind.IdentifierNameToken && !this.isKeyword(token.keywordKind());
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

    private createMissingToken(expectedKind: SyntaxKind, expectedKeywordKind: SyntaxKind, actual: ISyntaxToken): ISyntaxToken {
        var diagnostic = this.getExpectedTokenDiagnostic(expectedKind, expectedKeywordKind, actual);
        this.addDiagnostic(diagnostic);

        return SyntaxTokenFactory.createEmptyToken(diagnostic.position(), expectedKind, expectedKeywordKind);
    }

    private getExpectedTokenDiagnostic(expectedKind: SyntaxKind, expectedKeywordKind: SyntaxKind, actual: ISyntaxToken): SyntaxDiagnostic {
        var token = this.currentToken();

        if (expectedKind === SyntaxKind.IdentifierNameToken) {
            if (SyntaxFacts.isAnyKeyword(expectedKeywordKind)) {
                // They wanted a keyword, just report that that keyword was missing.
                return new SyntaxDiagnostic(token.start(), token.width(), DiagnosticCode._0_expected, [SyntaxFacts.getText(expectedKeywordKind)]);
            }
            else {
                // They wanted a real identifier.

                // If the user supplied a keyword, give them a specialized message.
                if (actual !== null && SyntaxFacts.isAnyKeyword(actual.keywordKind())) {
                    return new SyntaxDiagnostic(token.start(), token.width(), DiagnosticCode.Identifier_expected__0_is_a_keyword, [SyntaxFacts.getText(actual.keywordKind())]);
                }
                else {
                    // Otherwise just report that an identifier was expected.
                    return new SyntaxDiagnostic(token.start(), token.width(), DiagnosticCode.Identifier_expected, null);
                }
            }
        }

        if (SyntaxFacts.isAnyPunctuation(expectedKind)) {
            return new SyntaxDiagnostic(token.start(), token.width(), DiagnosticCode._0_expected, [SyntaxFacts.getText(expectedKind)]);
        }

        throw Errors.notYetImplemented();
    }

    private static getPrecedence(expressionKind: SyntaxKind): ParserExpressionPrecedence {
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

    private static isUseStrictDirective(node: SyntaxNode) {
        if (node.kind() === SyntaxKind.ExpressionStatement) {
            var expressionStatement = <ExpressionStatementSyntax>node;
            var expression = expressionStatement.expression();

            if (expression.kind() === SyntaxKind.StringLiteralExpression) {
                var stringLiteralExpression = <LiteralExpressionSyntax>expression;
                var stringLiteral = stringLiteralExpression.literalToken();

                var text = stringLiteral.text();
                return text === '"use strict"' || text === "'use strict'";
            }
        }

        return false;
    }

    public parseSyntaxTree(): SyntaxTree {
        var sourceUnit = this.parseSourceUnit();
        return new SyntaxTree(sourceUnit, this.skippedTokens, this.diagnostics);
    }

    private parseSourceUnit(): SourceUnitSyntax {
        // Note: technically we don't need to save and restore this here.  After all, this the top
        // level parsing entrypoint.  So it will always start as false and be reset to false when the
        // loop ends.  However, for sake of symmetry and consistancy we do this.
        var savedIsInStrictMode = this.isInStrictMode;
        var moduleElements = this.parseSyntaxList(ListParsingState.SourceUnit_ModuleElements, this.updateStrictModeState);
        this.isInStrictMode = savedIsInStrictMode;

        return new SourceUnitSyntax(moduleElements, this.currentToken());
    }

    private updateStrictModeState(moduleElement: ModuleElementSyntax): void {
        if (!this.isInStrictMode) {
            this.isInStrictMode = Parser.isUseStrictDirective(moduleElement);
        }
    }

    private isModuleElement(): bool {
        return this.isImportDeclaration() ||
               this.isModuleDeclaration() ||
               this.isInterfaceDeclaration() ||
               this.isClassDeclaration() ||
               this.isEnumDeclaration() ||
               this.isStatement(/*allowFunctionDeclaration:*/ true);
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
        else if (this.isStatement(/*allowFunctionDeclaration:*/ true)) {
            return this.parseStatement(/*allowFunctionDeclaration:*/ true);
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private isImportDeclaration(): bool {
        // REVIEW: because 'import' is not a javascript keyword, we need to make sure that this is 
        // an actual import declaration.  As such, i check for "import id =" as that shouldn't 
        // match any other legal javascript construct.  However, we need to verify that this is
        // actually the case.
        return this.currentToken().keywordKind() === SyntaxKind.ImportKeyword &&
               this.peekTokenN(1).kind === SyntaxKind.IdentifierNameToken &&
               this.peekTokenN(2).kind === SyntaxKind.EqualsToken;
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
               this.peekTokenN(1).kind === SyntaxKind.OpenParenToken;
    }

    private parseExternalModuleReference(): ExternalModuleReferenceSyntax {
        Debug.assert(this.isExternalModuleReference());

        var moduleKeyword = this.eatKeyword(SyntaxKind.ModuleKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var stringLiteral = this.eatToken(SyntaxKind.StringLiteral);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
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
        var isIdentifier = this.currentToken().kind === SyntaxKind.IdentifierNameToken;
        var identifier = this.eatIdentifierToken();
        var identifierName = new IdentifierNameSyntax(identifier);

        var current: NameSyntax = identifierName;

        while (isIdentifier && this.currentToken().kind === SyntaxKind.DotToken) {
            var dotToken = this.eatToken(SyntaxKind.DotToken);

            isIdentifier = this.currentToken().kind === SyntaxKind.IdentifierNameToken;
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

        var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
        var enumKeyword = this.eatKeyword(SyntaxKind.EnumKeyword);
        var identifier = this.eatIdentifierToken();

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var variableDeclarators: ISeparatedSyntaxList = SeparatedSyntaxList.empty;

        if (!openBraceToken.isMissing()) {
            variableDeclarators = this.parseSeparatedSyntaxList(ListParsingState.EnumDeclaration_VariableDeclarators);
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier,
            openBraceToken, variableDeclarators, closeBraceToken);
    }

    private isClassDeclaration(): bool {
        var token0 = this.currentToken();

        var token1 = this.peekTokenN(1);
        if (token0.keywordKind() === SyntaxKind.ExportKeyword &&
            token1.keywordKind() === SyntaxKind.ClassKeyword) {
            return true;
        }

        if (token0.keywordKind() === SyntaxKind.DeclareKeyword &&
            token1.keywordKind() === SyntaxKind.ClassKeyword) {
            return true;
        }

        return token0.keywordKind() === SyntaxKind.ClassKeyword &&
               this.isIdentifier(token1);
    }

    private parseClassDeclaration(): ClassDeclarationSyntax {
        Debug.assert(this.isClassDeclaration());

        var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
        var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);

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
        var classElements: ISyntaxList = SyntaxList.empty;

        if (!openBraceToken.isMissing()) {
            classElements = this.parseSyntaxList(ListParsingState.ClassDeclaration_ClassElements);
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ClassDeclarationSyntax(
            exportKeyword, declareKeyword, classKeyword, identifier, extendsClause,
            implementsClause, openBraceToken, classElements, closeBraceToken);
    }

    private isConstructorDeclaration(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ConstructorKeyword;
    }

    private isMemberFunctionDeclaration(): bool {
        var rewindPoint = this.getRewindPoint();
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
            this.rewind(rewindPoint);
            this.releaseRewindPoint(rewindPoint);
        }
    }

    private isMemberAccessorDeclaration(): bool {
        var rewindPoint = this.getRewindPoint();
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
            this.rewind(rewindPoint);
            this.releaseRewindPoint(rewindPoint);
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

        var staticKeyword = this.tryEatKeyword(SyntaxKind.StaticKeyword);
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

        var staticKeyword = this.tryEatKeyword(SyntaxKind.StaticKeyword);
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
        var token0 = this.currentToken();
        if (token0.keywordKind() === SyntaxKind.FunctionKeyword) {
            return true;
        }

        var token1 = this.peekTokenN(1);
        if (token0.keywordKind() === SyntaxKind.ExportKeyword &&
            token1.keywordKind() === SyntaxKind.FunctionKeyword) {
            return true;
        }

        return token0.keywordKind() === SyntaxKind.DeclareKeyword &&
               token1.keywordKind() === SyntaxKind.FunctionKeyword;
    }

    private parseFunctionDeclaration(): FunctionDeclarationSyntax {
        Debug.assert(this.isFunctionDeclaration());

        var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
        var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);

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

        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
    }

    private isModuleDeclaration(): bool {
        var token0 = this.currentToken();
        var token1 = this.peekTokenN(1);

        // export module
        if (token0.keywordKind() === SyntaxKind.ExportKeyword &&
            token1.keywordKind() === SyntaxKind.ModuleKeyword) {
            return true;
        }

        // declare module
        if (token0.keywordKind() === SyntaxKind.DeclareKeyword &&
            token1.keywordKind() === SyntaxKind.ModuleKeyword) {
            return true;
        }

        // Module is not a javascript keyword.  So we need to use a bit of lookahead here to ensure
        // that we're actually looking at a module construct and not some javascript expression.
        if (token0.keywordKind() === SyntaxKind.ModuleKeyword) {
            // module {
            if (token1.kind === SyntaxKind.OpenBraceToken) {
                return true;
            }

            if (token1.kind === SyntaxKind.IdentifierNameToken) {
                var token2 = this.peekTokenN(2);

                // module id {
                if (token2.kind === SyntaxKind.OpenBraceToken) {
                    return true;
                }

                // module id.
                if (token2.kind === SyntaxKind.DotToken) {
                    return true;
                }
            }
        }

        return false;
    }

    private parseModuleDeclaration(): ModuleDeclarationSyntax {
        Debug.assert(this.isModuleDeclaration());

        var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
        var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);
        var moduleKeyword = this.eatKeyword(SyntaxKind.ModuleKeyword);

        var moduleName: NameSyntax = null;
        var stringLiteral: ISyntaxToken = null;
        if (this.isName()) {
            moduleName = this.parseName();
        }
        else if (this.currentToken().kind === SyntaxKind.StringLiteral) {
            stringLiteral = this.eatToken(SyntaxKind.StringLiteral);
        }

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

        var moduleElements: ISyntaxList = SyntaxList.empty;
        if (!openBraceToken.isMissing()) {
            moduleElements = this.parseSyntaxList(ListParsingState.ModuleDeclaration_ModuleElements);
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new ModuleDeclarationSyntax(
            exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral,
            openBraceToken, moduleElements, closeBraceToken);
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

        var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
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

        var typeMembers: ISeparatedSyntaxList = SeparatedSyntaxList.empty;
        if (!openBraceToken.isMissing()) {
            typeMembers = this.parseSeparatedSyntaxList(ListParsingState.ObjectType_TypeMembers);
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken);
    }

    private isTypeMember(): bool {
        return this.isCallSignature() ||
               this.isConstructSignature() ||
               this.isIndexSignature() ||
               this.isFunctionSignature() ||
               this.isPropertySignature();
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
        Debug.assert(this.isConstructSignature());

        var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);
        var parameterList = this.parseParameterList();
        var typeAnnotation: TypeAnnotationSyntax = null;

        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
    }

    private parseIndexSignature(): IndexSignatureSyntax {
        Debug.assert(this.isIndexSignature());

        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
        var parameter = this.parseParameter();
        var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

        var typeAnnotation: TypeAnnotationSyntax = null;
        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
    }

    private parseFunctionSignature(): FunctionSignatureSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.IdentifierNameToken);

        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(SyntaxKind.QuestionToken);

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
        var questionToken = this.tryEatToken(SyntaxKind.QuestionToken);

        var typeAnnotation: TypeAnnotationSyntax = null;
        if (this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }

        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    }

    private isCallSignature(): bool {
        return this.currentToken().kind === SyntaxKind.OpenParenToken;
    }

    private isConstructSignature(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.NewKeyword;
    }

    private isIndexSignature(): bool {
        return this.currentToken().kind === SyntaxKind.OpenBracketToken;
    }

    private isFunctionSignature(): bool {
        if (this.isIdentifier(this.currentToken())) {
            // id(
            if (this.peekTokenN(1).kind === SyntaxKind.OpenParenToken) {
                return true;
            }

            // id?(
            if (this.peekTokenN(1).kind === SyntaxKind.QuestionToken &&
                this.peekTokenN(2).kind === SyntaxKind.OpenParenToken) {
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
        var typeNames = this.parseSeparatedSyntaxList(ListParsingState.ExtendsOrImplementsClause_TypeNameList);

        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    }

    private isImplementsClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ImplementsKeyword;
    }

    private parseImplementsClause(): ImplementsClauseSyntax {
        Debug.assert(this.isImplementsClause());

        var implementsKeyword = this.eatKeyword(SyntaxKind.ImplementsKeyword);
        var typeNames = this.parseSeparatedSyntaxList(ListParsingState.ExtendsOrImplementsClause_TypeNameList);

        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    }

    private isStatement(allowFunctionDeclaration: bool): bool {
        switch (this.currentToken().keywordKind()) {
            case SyntaxKind.PublicKeyword:
            case SyntaxKind.PrivateKeyword:
            case SyntaxKind.StaticKeyword:
                // None of hte above are actually keywords.  And they might show up in a real
                // statement (i.e. "public();").  However, if we can determine that they're
                // parsable as a ClassElement then don't consider them a statement.  Note:
                //
                // It should not be possible for any class element that starts with public, private
                // or static to be parsed as a statement.  So this is save to do.
                if (this.isClassElement()) {
                    return false;
                }
        }

        return this.isVariableStatement() ||
               this.isLabeledStatement() ||
               (allowFunctionDeclaration && this.isFunctionDeclaration()) ||
               this.isIfStatement() ||
               this.isBlock() ||
               this.isExpressionStatement() ||
               this.isReturnStatement() ||
               this.isSwitchStatement() ||
               this.isThrowStatement() ||
               this.isBreakStatement() ||
               this.isContinueStatement() ||
               this.isForOrForInStatement() ||
               this.isEmptyStatement() ||
               this.isWhileStatement() ||
               this.isDoStatement() ||
               this.isTryStatement();
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
        return this.isIdentifier(this.currentToken()) && this.peekTokenN(1).kind === SyntaxKind.ColonToken;
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
        return this.currentToken().kind === SyntaxKind.SemicolonToken;
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
        else if (currentToken.kind === SyntaxKind.SemicolonToken) {
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
                     openParenToken.kind === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind === SyntaxKind.OpenParenToken);
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
                     openParenToken.kind === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind === SyntaxKind.OpenParenToken);
        
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
                     openParenToken.kind === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind === SyntaxKind.OpenParenToken);

        // for ( ExpressionNoInopt; Expressionopt ; Expressionopt ) Statement
        var initializer: ExpressionSyntax = null;

        if (this.currentToken().kind !== SyntaxKind.SemicolonToken &&
            this.currentToken().kind !== SyntaxKind.CloseParenToken &&
            this.currentToken().kind !== SyntaxKind.EndOfFileToken) {
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
        if (this.currentToken().kind !== SyntaxKind.SemicolonToken &&
            this.currentToken().kind !== SyntaxKind.CloseParenToken &&
            this.currentToken().kind !== SyntaxKind.EndOfFileToken) {
            condition = this.parseExpression(/*allowIn:*/ true);
        }

        var secondSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

        var incrementor: ExpressionSyntax = null;
        if (this.currentToken().kind !== SyntaxKind.CloseParenToken &&
            this.currentToken().kind !== SyntaxKind.EndOfFileToken) {
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

        var switchClauses: ISyntaxList = SyntaxList.empty;
        if (!openBraceToken.isMissing()) {
            switchClauses = this.parseSyntaxList(ListParsingState.SwitchStatement_SwitchClauses);
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, 
            closeParenToken, openBraceToken, switchClauses, closeBraceToken);
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
        if (this.currentToken().kind !== SyntaxKind.ColonToken) {
            expression = this.parseExpression(/*allowIn:*/ true);
        }

        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statements = this.parseSyntaxList(ListParsingState.SwitchClause_Statements);

        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    }

    private parseDefaultSwitchClause(): DefaultSwitchClauseSyntax {
        Debug.assert(this.isDefaultSwitchClause());

        var defaultKeyword = this.eatKeyword(SyntaxKind.DefaultKeyword);
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statements = this.parseSyntaxList(ListParsingState.SwitchClause_Statements);

        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
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
            var token = this.createMissingToken(SyntaxKind.IdentifierNameToken, SyntaxKind.None, null);
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
        // As per the gramar, neither { nor 'function' can start an expression statement.
        var currentToken = this.currentToken();
        var kind = currentToken.kind;
        if (kind === SyntaxKind.OpenBraceToken) {
            return false;
        }

        var keywordKind = currentToken.keywordKind();
        if (keywordKind === SyntaxKind.FunctionKeyword) {
            return false;
        }

        return this.isExpression();
    }

    private isExpression(): bool {
        var currentToken = this.currentToken();
        var kind = currentToken.kind;

        switch (kind) {
            case SyntaxKind.NumericLiteral:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.RegularExpressionLiteral:
                return true;

            case SyntaxKind.OpenBracketToken: // For array literals.
            case SyntaxKind.OpenParenToken: // For parenthesized expressions
                return true;

            case SyntaxKind.LessThanToken: // For cast expressions.
                return true;

            // Prefix unary expressions.
            case SyntaxKind.PlusPlusToken:
            case SyntaxKind.MinusMinusToken:
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.TildeToken:
            case SyntaxKind.ExclamationToken:
                return true;

            case SyntaxKind.OpenBraceToken: // For object type literal expressions.
                return true;
        }

        var keywordKind = currentToken.keywordKind();
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

            // For function expressions.
            case SyntaxKind.FunctionKeyword:
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
        var token0 = this.currentToken();
        if (token0.keywordKind() === SyntaxKind.VarKeyword) {
            return true;
        }

        var token1 = this.peekTokenN(1);
        if (token0.keywordKind() === SyntaxKind.ExportKeyword &&
            token1.keywordKind() === SyntaxKind.VarKeyword) {
            return true;
        }

        return token0.keywordKind() === SyntaxKind.DeclareKeyword &&
               token1.keywordKind() === SyntaxKind.VarKeyword;
    }

    private parseVariableStatement(): VariableStatementSyntax {
        Debug.assert(this.isVariableStatement());

        var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
        var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);

        var variableDeclaration = this.parseVariableDeclaration(/*allowIn:*/ true);
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();

        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
    }

    private parseVariableDeclaration(allowIn: bool): VariableDeclarationSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.VarKeyword);
        var varKeyword = this.eatKeyword(SyntaxKind.VarKeyword);

        var listParsingState = allowIn 
            ? ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn
            : ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn;

        var variableDeclarators = this.parseSeparatedSyntaxList(listParsingState);
        return new VariableDeclarationSyntax(varKeyword, variableDeclarators);
    }

    private isVariableDeclarator(): bool {
        return this.isIdentifier(this.currentToken());
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
        return this.currentToken().kind === SyntaxKind.EqualsToken;
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
        var currentTokenKind = this.currentToken().kind;
        if (SyntaxFacts.isPrefixUnaryExpressionOperatorToken(currentTokenKind)) {
            var operatorKind = SyntaxFacts.getPrefixUnaryExpression(currentTokenKind);

            var operatorToken = this.eatAnyToken();

            var operand = this.parseUnaryExpression(); 
            return new PrefixUnaryExpressionSyntax(operatorKind, operatorToken, operand);
        }
        else {
            return this.parseTerm(/*allowInvocation*/ true, /*insideObjectCreation:*/ false);
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

        var currentTokenKind = this.currentToken().kind;
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
            var currentTokenKind = this.currentToken().kind;
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
            var newPrecedence = Parser.getPrecedence(binaryExpressionKind);

                  // All binary operators must have precedence > 0!
            Debug.assert(newPrecedence > 0);

            // Check the precedence to see if we should "take" this operator
            if (newPrecedence < precedence) {
                break;
            }

            // Same precedence, but not right-associative -- deal with this higher up in our stack "later"
            if (newPrecedence === precedence && !this.isRightAssociative(binaryExpressionKind)) {
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

    private parseTerm(allowInvocation: bool, insideObjectCreation: bool): UnaryExpressionSyntax {
        // NOTE: allowInvocation and insideObjectCreation are always the negation of the other.
        // We could remove one of them and just use the other.  However, i think this is much
        // easier to read and understand in this form.

        var term = this.parseTermWorker(insideObjectCreation);
        if (term.isMissing()) {
            return term;
        }

        return this.parsePostFixExpression(term, allowInvocation);
    }

    private parsePostFixExpression(expression: UnaryExpressionSyntax, allowInvocation: bool): UnaryExpressionSyntax {
        Debug.assert(expression !== null);

        while (true) {
            var currentTokenKind = this.currentToken().kind;
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
        return this.currentToken().kind === SyntaxKind.OpenParenToken;
    }

    private parseArgumentList(): ArgumentListSyntax { 
        Debug.assert(this.isArgumentList());

        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var arguments = this.parseSeparatedSyntaxList(ListParsingState.ArgumentList_AssignmentExpressions);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

        return new ArgumentListSyntax(openParenToken, arguments, closeParenToken);
    }

    private parseElementAccessExpression(expression: ExpressionSyntax): ElementAccessExpressionSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenBracketToken);

        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
        var argumentExpression = this.parseExpression(/*allowIn:*/ true);
        var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    }

    private parseTermWorker(insideObjectCreation: bool): UnaryExpressionSyntax {
        var currentToken = this.currentToken();

        if (insideObjectCreation) {
            // Note: if we have "new (expr..." then we want to parse that as "new (parenthesized expr)"
            // not as "new FunctionType".  This is because "new FunctionType" would look like:
            //
            //      new (Paramters) => type
            //
            // And this is just too confusing.  Plus, it is easy to work around.  They can just type:
            // "new { (Parameters): type }" instead
            //
            // Also, we disallow a ConstructorType inside an object creation expression.  Otherwise
            // we'd end up allowing: 
            //
            //      new new (Parameters) => Type.
            //
            // And this is just too confusing.  Plus, it is easy to work around.  They can just type:
            // "new { new (Parameters): ReturnType }" instead.

            if (this.isType(/*allowFunctionType:*/ false, /*allowConstructorType:*/ false)) {
                // There's a lot of ambiguity in the language between typescript arrays, and javascript
                // indexing.  For example, you can say: "new Foo[]".  In which case that new's up a foo 
                // array.  Or you can say "new Foo[i]".  which accesses the i'th element of Foo and calls
                // the construct operator on it. So, in this case, if we're parsing a 'new', we do allow
                // seeing brackets, but only if they're *complete*.  
                return this.parseType(/*requireCompleteArraySuffix:*/ true);
            }
        }

        if (this.isIdentifier(currentToken)) {
            if (this.isSimpleArrowFunctionExpression()) {
                return this.parseSimpleArrowFunctionExpression();
            }
            else {
                var identifier = this.eatIdentifierToken();
                return new IdentifierNameSyntax(identifier);
            }
        }

        var currentTokenKind = currentToken.kind;
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

            case SyntaxKind.TypeOfKeyword:
                return this.parseTypeOfExpression();

            case SyntaxKind.DeleteKeyword:
                return this.parseDeleteExpression();
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
                return this.parseParenthesizedOrArrowFunctionExpression();

            case SyntaxKind.LessThanToken:
                return this.parseCastExpression();
        }

        // Nothing else worked, just try to consume an identifier so we report an error.
        return new IdentifierNameSyntax(this.eatIdentifierToken());
    }

    private parseTypeOfExpression(): TypeOfExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.TypeOfKeyword);

        var typeOfKeyword = this.eatKeyword(SyntaxKind.TypeOfKeyword);
        var expression = this.parseUnaryExpression();

        return new TypeOfExpressionSyntax(typeOfKeyword, expression);
    }

    private parseDeleteExpression(): DeleteExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.DeleteKeyword);

        var deleteKeyword = this.eatKeyword(SyntaxKind.DeleteKeyword);
        var expression = this.parseUnaryExpression();

        return new DeleteExpressionSyntax(deleteKeyword, expression);
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
        Debug.assert(this.currentToken().kind === SyntaxKind.LessThanToken);

        var lessThanToken = this.eatToken(SyntaxKind.LessThanToken);
        var type = this.parseType(/*requireCompleteArraySuffix:*/ false);
        var greaterThanToken = this.eatToken(SyntaxKind.GreaterThanToken);
        var expression = this.parseUnaryExpression();

        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    }

    private parseObjectCreationExpression(): ObjectCreationExpressionSyntax {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.NewKeyword);
        var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);

        // While parsing the sub term we don't want to allow invocations to be parsed.  that's because
        // we want "new Foo()" to parse as "new Foo()" (one node), not "new (Foo())".
        var expression = this.parseTerm(/*allowInvocation:*/ false, /*insideObjectCreation:*/ true);

        var argumentList: ArgumentListSyntax = null;
        if (this.isArgumentList()) {
            argumentList = this.parseArgumentList();
        }

        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    }

    private parseParenthesizedOrArrowFunctionExpression(): UnaryExpressionSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenParenToken);

            var result = this.tryParseArrowFunctionExpression();
            if (result !== null) {
                return result;
            }

        // Doesn't look like an arrow function, so parse this as a parenthesized expression.
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var expression = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    }

    private tryParseArrowFunctionExpression(): ArrowFunctionExpressionSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenParenToken);

        // Because arrow functions and parenthesized expressions look similar, we have to check far
        // enough ahead to be sure we've actually got an arrow function.

        // First, check for things that definitely have enough information to let us know it's an
        // arrow function.

        if (this.isDefinitelyArrowFunctionExpression()) {
            return this.parseParenthesizedArrowFunctionExpression(/*requiresArrow:*/ false);
        }

        // Now, look for cases where we're sure it's not an arrow function.  This will help save us
        // a costly parse.
        if (!this.isPossiblyArrowFunctionExpression()) {
            return null;
        }

        // Then, try to actually parse it as a arrow function, and only return if we see an => 
        var rewindPoint = this.getRewindPoint();
        try {
            var arrowFunction = this.parseParenthesizedArrowFunctionExpression(/*requiresArrow:*/ true);
            if (arrowFunction === null) {
                this.rewind(rewindPoint);
            }
            return arrowFunction;
        }
        finally {
            this.releaseRewindPoint(rewindPoint);
        }
    }

    private parseParenthesizedArrowFunctionExpression(requireArrow: bool): ParenthesizedArrowFunctionExpressionSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenParenToken);

        var callSignature = this.parseCallSignature();

        if (requireArrow && this.currentToken().kind !== SyntaxKind.EqualsGreaterThanToken) {
            return null;
        }

        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var body = this.parseArrowFunctionBody();

        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
    }

    private parseArrowFunctionBody(): SyntaxNode {
        if (this.isBlock()) {
            // TODO: The spec says that function declarations are not allowed.  However, we have some
            // code that uses them.  So we allow them here.
            return this.parseBlock(/*allowFunctionDeclaration:*/ true);
        }
        else {
            return this.parseAssignmentExpression(/*allowIn:*/ true); 
        }
    }

    private isSimpleArrowFunctionExpression(): bool {
        return this.isIdentifier(this.currentToken()) && 
               this.peekTokenN(1).kind === SyntaxKind.EqualsGreaterThanToken;
    }

    private parseSimpleArrowFunctionExpression(): SimpleArrowFunctionExpression {
        Debug.assert(this.isSimpleArrowFunctionExpression());

        var identifier = this.eatIdentifierToken();
        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var body = this.parseArrowFunctionBody();

        return new SimpleArrowFunctionExpression(
            identifier, equalsGreaterThanToken, body);
    }

    private isBlock(): bool {
        return this.currentToken().kind === SyntaxKind.OpenBraceToken;
    }

    private isDefinitelyArrowFunctionExpression(): bool {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenParenToken);
        
        var token1 = this.peekTokenN(1);
        
        if (token1.kind === SyntaxKind.CloseParenToken) {
            // ()
            // Definitely an arrow function.  Could never be a parenthesized expression.
            return true;
        }

        if (token1.kind === SyntaxKind.DotDotDotToken) {
            // (...
            // Definitely an arrow function.  Could never be a parenthesized expression.
            return true;
        }

        if (!this.isIdentifier(token1)) {
            // All other arrow functions must start with (id
            // so this is definitely not an arrow function.
            return false;
        }

        // (id
        //
        // Lots of options here.  Check for things that make us certain it's an
        // arrow function.
        var token2 = this.peekTokenN(2);
        if (token2.kind === SyntaxKind.ColonToken) {
            // (id:
            // Definitely an arrow function.  Could never be a parenthesized expression.
            return true;
        }

        var token3 = this.peekTokenN(3);
        if (token2.kind === SyntaxKind.QuestionToken) {
            // (id?
            // Could be an arrow function, or a parenthesized conditional expression.

            // Check for the things that could only be arrow functions.
            if (token3.kind === SyntaxKind.ColonToken ||
                token3.kind === SyntaxKind.CloseParenToken ||
                token3.kind === SyntaxKind.CommaToken) {
                // (id?:
                // (id?)
                // (id?,
                // These are the only cases where this could be an arrow function.
                // And none of them can be parenthesized expression.
                return true;
            }
        }

        if (token2.kind === SyntaxKind.CloseParenToken) {
            // (id)
            // Could be an arrow function, or a parenthesized conditional expression.

            if (token3.kind === SyntaxKind.EqualsGreaterThanToken) {
                // (id) =>
                // Definitely an arrow function.  Could not be a parenthesized expression.
                return true;
            }

            // Note: "(id):" *looks* like it could be an arrow function.  However, it could
            // show up in:  "foo ? (id): 
            // So we can't return true here for that case.
        }

        // TODO: Add more cases if you're sure that there is enough information to know to 
        // parse this as an arrow function.  Note: be very careful here.

        // Anything else wasn't clear enough.  Try to parse the expression as an arrow function and bail out
        // if we fail.
        return false;
    }

    private isPossiblyArrowFunctionExpression(): bool {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenParenToken);
        
        var token1 = this.peekTokenN(1);

        if (!this.isIdentifier(token1)) {
            // All other arrow functions must start with (id
            // so this is definitely not an arrow function.
            return false;
        }

        var token2 = this.peekTokenN(2);
        if (token2.kind === SyntaxKind.EqualsToken) {
            // (id =
            //
            // This *could* be an arrow function.  i.e. (id = 0) => { }
            // Or it could be a parenthesized expression.  So we'll have to actually
            // try to parse it.
            return true;
        }

        if (token2.kind === SyntaxKind.CommaToken) {
            // (id,

            // This *could* be an arrow function.  i.e. (id, id2) => { }
            // Or it could be a parenthesized expression (as javascript supports
            // the comma operator).  So we'll have to actually try to parse it.
            return true;
        }

        if (token2.kind === SyntaxKind.CloseParenToken) {
            // (id)
            
            var token3 = this.peekTokenN(3);
            if (token3.kind === SyntaxKind.ColonToken) {
                // (id):
                //
                // This could be an arrow function. i.e. (id): number => { }
                // Or it could be parenthesized exprssion: foo ? (id) :
                // So we'll have to actually try to parse it.
                return true;
            }
        }

        // Nothing else could be an arrow function.
        return false;
    }

    private parseObjectLiteralExpression(): ObjectLiteralExpressionSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenBraceToken);

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var propertyAssignments = this.parseSeparatedSyntaxList(ListParsingState.ObjectLiteralExpression_PropertyAssignments);
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new ObjectLiteralExpressionSyntax(
            openBraceToken, propertyAssignments, closeBraceToken);
    }

    private parsePropertyAssignment(): PropertyAssignmentSyntax {
        Debug.assert(this.isPropertyAssignment(/*inErrorRecovery:*/ false));
        if (this.isGetAccessorPropertyAssignment()) {
            return this.parseGetAccessorPropertyAssignment();
        }
        else if (this.isSetAccessorPropertyAssignment()) {
            return this.parseSetAccessorPropertyAssignment();
        }
        else if (this.isSimplePropertyAssignment(/*inErrorRecovery:*/ false)) {
            return this.parseSimplePropertyAssignment();
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    private isPropertyAssignment(inErrorRecovery: bool): bool {
        return this.isGetAccessorPropertyAssignment() ||
               this.isSetAccessorPropertyAssignment() ||
               this.isSimplePropertyAssignment(inErrorRecovery);
    }

    private isGetAccessorPropertyAssignment(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.GetKeyword &&
               this.isPropertyName(this.peekTokenN(1), /*inErrorRecovery:*/ false);
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
               this.isPropertyName(this.peekTokenN(1), /*inErrorRecovery:*/ false);
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

    private isSimplePropertyAssignment(inErrorRecovery: bool): bool {
        return this.isPropertyName(this.currentToken(), inErrorRecovery);
    }

    private parseSimplePropertyAssignment(): SimplePropertyAssignmentSyntax {
        Debug.assert(this.isSimplePropertyAssignment(/*inErrorRecovery:*/ false));

        var propertyName = this.eatAnyToken();
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var expression = this.parseAssignmentExpression(/*allowIn:*/ true);

        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    }

    private isPropertyName(token: ISyntaxToken, inErrorRecovery: bool): bool {
        // NOTE: we do *not* want to check "this.isIdentifier" here.  Any IdentifierNameToken is 
        // allowed here, even reserved words like keywords.
        switch (token.kind) {
            case SyntaxKind.IdentifierNameToken:
                // Except: if we're in error recovery, then we don't want to consider keywords. 
                // After all, if we have:
                //
                //      { a: 1
                //      return
                //
                // we don't want consider 'return' to be the next property in the object literal.
                if (inErrorRecovery) {
                    return !this.isKeyword(token.keywordKind());
                }
                else {
                    return true;
                }

            case SyntaxKind.StringLiteral:
            case SyntaxKind.NumericLiteral:
                return true;

            default:
                return false;
        }
    }

    private parseArrayLiteralExpression(): ArrayLiteralExpressionSyntax {
        Debug.assert(this.currentToken().kind === SyntaxKind.OpenBracketToken);
        
        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);

        var expressions: any[] = null;

        var addOmittedExpression = true;
        while (true) {
            var currentTokenKind = this.currentToken().kind;
            if (currentTokenKind === SyntaxKind.CloseBracketToken || currentTokenKind === SyntaxKind.EndOfFileToken) {
                break;
            }

            if (this.currentToken().kind === SyntaxKind.CommaToken) {
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

            currentTokenKind = this.currentToken().kind;
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

        var statements: ISyntaxList = SyntaxList.empty;

        if (!openBraceToken.isMissing()) {
            var savedIsInStrictMode = this.isInStrictMode;
            var listParsingMode = allowFunctionDeclaration
                ? ListParsingState.Block_Statements_AllowFunctionDeclarations
                : ListParsingState.Block_Statements_DisallowFunctionDeclarations;
            statements = this.parseSyntaxList(listParsingMode, this.updateStrictModeState);
            this.isInStrictMode = savedIsInStrictMode;
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new BlockSyntax(openBraceToken, statements, closeBraceToken);
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
        var parameters: ISeparatedSyntaxList = SeparatedSyntaxList.empty;
        
        if (!openParenToken.isMissing()) {
            parameters = this.parseSeparatedSyntaxList(ListParsingState.ParameterList_Parameters);
        }

        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
    }

    private isTypeAnnotation(): bool {
        return this.currentToken().kind === SyntaxKind.ColonToken;
    }

    private parseTypeAnnotation(): TypeAnnotationSyntax {
        Debug.assert(this.isTypeAnnotation());

        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var type = this.parseType(/*requireCompleteArraySuffix:*/ false);

        return new TypeAnnotationSyntax(colonToken, type);
    }

    private isType(allowFunctionType: bool, allowConstructorType: bool): bool {
        return this.isPredefinedType() ||
               this.isTypeLiteral(allowFunctionType, allowConstructorType) ||
               this.isName();
    }

    private parseType(requireCompleteArraySuffix: bool): TypeSyntax {
        var type = this.parseNonArrayType();

        while (this.currentToken().kind === SyntaxKind.OpenBracketToken) {
            if (requireCompleteArraySuffix && this.peekTokenN(1).kind !== SyntaxKind.CloseBracketToken) {
                break;
            }

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
        else if (this.isTypeLiteral(/*allowFunctionType:*/ true, /*allowConstructorType:*/ true)) {
            return this.parseTypeLiteral();
        }
        else {
            return this.parseName();
        }
    }

    private parseTypeLiteral(): TypeSyntax {
        Debug.assert(this.isTypeLiteral(/*allowFunctionType:*/ true, /*allowConstructorType:*/ true));
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
        var returnType = this.parseType(/*requireCompleteArraySuffix:*/ false);

        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, returnType);
    }

    private parseConstructorType(): ConstructorTypeSyntax {
        Debug.assert(this.isConstructorType());

        var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);
        var parameterList = this.parseParameterList();
        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var type = this.parseType(/*requreCompleteArraySuffix:*/ false);

        return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type);
    }

    private isTypeLiteral(allowFunctionType: bool, allowConstructorType: bool): bool {
        if (this.isObjectType()) {
            return true;
        }

        if (allowFunctionType && this.isFunctionType()) {
            return true;
        }

        if (allowConstructorType && this.isConstructorType()) {
            return true;
        }

        return false;
    }

    private isObjectType(): bool {
        return this.currentToken().kind === SyntaxKind.OpenBraceToken;
    }

    private isFunctionType(): bool {
        return this.currentToken().kind === SyntaxKind.OpenParenToken;
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

    private isParameter(): bool {
        var token = this.currentToken();
        if (token.kind === SyntaxKind.DotDotDotToken) {
            return true;
        }

        if (token.keywordKind() === SyntaxKind.PublicKeyword ||
            token.keywordKind() === SyntaxKind.PrivateKeyword) {
            return true;
        }

        return this.isIdentifier(token);
    }

    private parseParameter(): ParameterSyntax {
        var dotDotDotToken = this.tryEatToken(SyntaxKind.DotDotDotToken);

        var publicOrPrivateToken: ISyntaxToken = null;
        if (this.currentToken().keywordKind() === SyntaxKind.PublicKeyword ||
            this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateToken = this.eatAnyToken();
        }

        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(SyntaxKind.QuestionToken);

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

    private parseSyntaxList(currentListType: ListParsingState, processItem: (item: any) => void = null): ISyntaxList {
        var savedListParsingState = this.listParsingState;
        this.listParsingState |= currentListType;

        var result = this.parseSyntaxListWorker(currentListType, processItem);

        this.listParsingState = savedListParsingState;

        return result;
    }

    private parseSeparatedSyntaxList(currentListType: ListParsingState): ISeparatedSyntaxList {
        var savedListParsingState = this.listParsingState;
        this.listParsingState |= currentListType;

        var result = this.parseSeparatedSyntaxListWorker(currentListType);

        this.listParsingState = savedListParsingState;

        return result;
    }

    // Returns true if we should abort parsing the list.
    private abortParsingListOrMoveToNextToken(currentListType: ListParsingState): bool {
        // Ok.  It wasn't a terminator and it wasn't the start of an item in the list. 
        // Definitely report an error for this token.
        this.reportUnexpectedTokenDiagnostic(currentListType);

        // Now, check if the token is the end of one our parent lists, or the start of an item 
        // in one of our parent lists.  If so, we won't want to consume the token.  We've 
        // already reported the error, so just return to our caller so that a higher up 
        // production can consume it.
        for (var state = ListParsingState.LastListParsingState;
             state >= ListParsingState.FirstListParsingState;
             state >>= 1) {

            if ((this.listParsingState & state) !== 0) {
                if (this.isExpectedListTerminator(state) || this.isExpectedListItem(state, /*inErrorRecovery:*/ true)) {
                    return true;
                }
            }
        }

        // Otherwise, if none of the lists we're in can capture this token, then we need to 
        // unilaterally skip it.  Note: we've already reported the error.
        var token = this.currentToken();
        this.skippedTokens.push(token);

        // Consume this token and move onto the next item in the list.
        this.moveToNextToken();
        return false;
    }

    private tryParseExpectedListItem(currentListType: ListParsingState,
                                     inErrorRecovery: bool,
                                     items: any[],
                                     processItem: (item: any) => void): any[] {
        if (this.isExpectedListItem(currentListType, inErrorRecovery)) {
            var item = this.parseExpectedListItem(currentListType);
            Debug.assert(item !== null);

            items = items || [];
            items.push(item);

            if (processItem !== null) {
                processItem(item);
            }
        }

        return items;
    }

    private listIsTerminated(currentListType: ListParsingState): bool {
        return this.isExpectedListTerminator(currentListType) || this.currentToken().kind === SyntaxKind.EndOfFileToken;
    }

    private parseSyntaxListWorker(currentListType: ListParsingState, processItem: (item: any) => void): ISyntaxList {
        var items: any[] = null;

        while (true) {
            // First check ifthe list is complete already.  If so, we're done.  Also, if we see an 
            // EOF then definitely stop.  We'll report the error higher when our caller tries to
            // consume the next token.
            if (this.listIsTerminated(currentListType)) {
                break
            }

            // Try to parse an item of the list.  If we fail then decide if we need to abort or 
            // continue parsing.
            var itemsLength = items === null ? 0 : items.length;
            items = this.tryParseExpectedListItem(currentListType, /*inErrorRecovery:*/ false, items, processItem);
            if (items !== null && items.length > itemsLength) {
                continue;
            }

            var abort = this.abortParsingListOrMoveToNextToken(currentListType);
            if (abort) {
                break;
            }

            // Continue parsing the list.
        }

        return SyntaxList.create(items);
    }

    private parseSeparatedSyntaxListWorker(currentListType: ListParsingState): ISeparatedSyntaxList {
        var items: any[] = null;

        var allowTrailingSeparator = this.allowsTrailingSeparator(currentListType);
        var allowAutomaticSemicolonInsertion = this.allowsAutomaticSemicolonInsertion(currentListType);
        var requiresAtLeastOneItem = this.requiresAtLeastOneItem(currentListType);
        var separatorKind = this.separatorKind(currentListType);

        var lastSeparator: ISyntaxToken = null;
        var inErrorRecovery = false;
        while (true) {
            if (this.listIsTerminated(currentListType)) {
                // We've reached the end of the list.  If there was a last separator and we don't 
                // allow trailing separators, then report an error.  But don't report an error if
                // the separator is missing.  We'll have already reported it.
                if (lastSeparator !== null && !allowTrailingSeparator && !lastSeparator.isMissing()) {
                    this.addDiagnostic(new SyntaxDiagnostic(
                        lastSeparator.start(), lastSeparator.width(), DiagnosticCode.Trailing_separator_not_allowed, null));
                }

                break;
            }

            var itemsLength = items === null ? 0 : items.length;
            items = this.tryParseExpectedListItem(currentListType, inErrorRecovery, items, null);
            inErrorRecovery = false;
            
            if (items !== null && items.length > itemsLength) {
                // We got an item and added it to our list.  If the next token is an explicit 
                // separator, then add it to the list.

                if (this.currentToken().kind !== separatorKind) {
                    // We didn't see a separator.  There could be a few reasons for this.  First, 
                    // we're at the terminator of the list and we're supposed to stop.  Or, second, 
                    // the list allows for automatic semicolon insertion and we can east one here.

                    // Note: this order is important.  Say we have:
                    //      {
                    //          a       // <-- just finished parsing 'a'
                    //      }
                    //
                    // Automatic semicolon insertion rules state: "When, as the program is parsed from
                    // left to right, a token (called the offending token) is encountered that is not 
                    // allowed by any production of the grammar".  So we should only ever insert a 
                    // semicolon if we couldn't consume something normally.  in the above case, we can
                    // consume the '}' just fine.  So ASI doesn't apply.

                    if (this.listIsTerminated(currentListType)) {
                        // The list is done.  Return what we've got now.
                        break;
                    }

                    if (allowAutomaticSemicolonInsertion && this.canEatAutomaticSemicolon()) {
                        lastSeparator = this.eatExplicitOrAutomaticSemicolon();
                        items.push(lastSeparator);
                        continue;
                    }
                }

                // We're either at a real separator already that we should parse out.  Or we weren't
                // at one, but none of our fallback cases worked.  However, the list still requires
                // a separator, so we need to parse it an error version here.

                // Consume the last separator and continue.
                lastSeparator = this.eatToken(separatorKind);
                items.push(lastSeparator);
                
                // Mark if we actually successfully consumed the separator or not.  If not then 
                // we're in 'error recovery' mode and we make tweak some parsing rules as 
                // appropriate.  For example, if we have:
                //
                //      var v = { a
                //      return
                //
                // Then we'll be missing the comma.  As such, we want to parse 'return' in a less
                // tolerant manner.  Normally 'return' could be a property in an object literal.
                // However, in error recovery mode, we do *not* want it to be.
                inErrorRecovery = lastSeparator.isMissing();
                continue;
            }

            // We failed to parse an item.  Decide if we need to abort, or move to the next token.
            var abort = this.abortParsingListOrMoveToNextToken(currentListType);
            if (abort) {
                break;
            }
        }

        // If this list requires at least one argument, then report an error if we haven't gotten
        // any.
        if (requiresAtLeastOneItem && (items === null || items.length === 0)) {
            this.reportUnexpectedTokenDiagnostic(currentListType);
        }

        return SeparatedSyntaxList.create(items);
    }

    private allowsTrailingSeparator(currentListType: ListParsingState): bool {
        switch (currentListType) {
            case ListParsingState.EnumDeclaration_VariableDeclarators:
            case ListParsingState.ObjectType_TypeMembers:
            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                return true;
            
            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
            case ListParsingState.ArgumentList_AssignmentExpressions:
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
            case ListParsingState.ParameterList_Parameters:
                // TODO: It would be great to allow trailing separators for parameters.
                return false;

            case ListParsingState.SourceUnit_ModuleElements:
            case ListParsingState.ClassDeclaration_ClassElements:
            case ListParsingState.ModuleDeclaration_ModuleElements:
            case ListParsingState.SwitchStatement_SwitchClauses:
            case ListParsingState.SwitchClause_Statements:
            case ListParsingState.Block_Statements_AllowFunctionDeclarations:
            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
            default:
                throw Errors.notYetImplemented();
        }
    }

    private requiresAtLeastOneItem(currentListType: ListParsingState): bool {
        switch (currentListType) {
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                return true;
            
            case ListParsingState.ObjectType_TypeMembers:
            case ListParsingState.EnumDeclaration_VariableDeclarators:
            case ListParsingState.ArgumentList_AssignmentExpressions:
            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
            case ListParsingState.ParameterList_Parameters:
                return false;

            case ListParsingState.SourceUnit_ModuleElements:
            case ListParsingState.ClassDeclaration_ClassElements:
            case ListParsingState.ModuleDeclaration_ModuleElements:
            case ListParsingState.SwitchStatement_SwitchClauses:
            case ListParsingState.SwitchClause_Statements:
            case ListParsingState.Block_Statements_AllowFunctionDeclarations:
            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
            default:
                throw Errors.notYetImplemented();
        }
    }

    private allowsAutomaticSemicolonInsertion(currentListType: ListParsingState): bool {
        switch (currentListType) {
            case ListParsingState.ObjectType_TypeMembers:
                return true;
            
            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
            case ListParsingState.EnumDeclaration_VariableDeclarators:
            case ListParsingState.ArgumentList_AssignmentExpressions:
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
            case ListParsingState.ParameterList_Parameters:
                return false;

            case ListParsingState.SourceUnit_ModuleElements:
            case ListParsingState.ClassDeclaration_ClassElements:
            case ListParsingState.ModuleDeclaration_ModuleElements:
            case ListParsingState.SwitchStatement_SwitchClauses:
            case ListParsingState.SwitchClause_Statements:
            case ListParsingState.Block_Statements_AllowFunctionDeclarations:
            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
            default:
                throw Errors.notYetImplemented();
        }
    }

    private separatorKind(currentListType: ListParsingState): SyntaxKind {
        switch (currentListType) {
            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
            case ListParsingState.ArgumentList_AssignmentExpressions:
            case ListParsingState.EnumDeclaration_VariableDeclarators:
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
            case ListParsingState.ParameterList_Parameters:
                return SyntaxKind.CommaToken;

            case ListParsingState.ObjectType_TypeMembers:
                return SyntaxKind.SemicolonToken;

            case ListParsingState.SourceUnit_ModuleElements:
            case ListParsingState.ClassDeclaration_ClassElements:
            case ListParsingState.ModuleDeclaration_ModuleElements:
            case ListParsingState.SwitchStatement_SwitchClauses:
            case ListParsingState.SwitchClause_Statements:
            case ListParsingState.Block_Statements_AllowFunctionDeclarations:
            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
            default:
                throw Errors.notYetImplemented();
        }
    }

    private existingDiagnosticAtPosition(position: number): bool {
        return this.diagnostics.length > 0 &&
            this.diagnostics[this.diagnostics.length - 1].position() === position;
    }

    private reportUnexpectedTokenDiagnostic(listType: ListParsingState): void {
        var token = this.currentToken();

        var diagnostic = new SyntaxDiagnostic(
            token.start(), token.width(), DiagnosticCode.Unexpected_token__0_expected, [this.getExpectedListElementType(listType)]);
        this.addDiagnostic(diagnostic);
    }

    private addDiagnostic(diagnostic: SyntaxDiagnostic): void {
        // Except: if we already have a diagnostic for this position, don't report another one.
        if (this.diagnostics.length > 0 &&
            this.diagnostics[this.diagnostics.length - 1].position() === diagnostic.position()) {
            return;
        }

        this.diagnostics.push(diagnostic);
    }

    private isExpectedListTerminator(currentListType: ListParsingState): bool {
        switch (currentListType) {
            case ListParsingState.SourceUnit_ModuleElements:
                return this.isExpectedSourceUnit_ModuleElementsTerminator();

            case ListParsingState.ClassDeclaration_ClassElements:
                return this.isExpectedClassDeclaration_ClassElementsTerminator();

            case ListParsingState.ModuleDeclaration_ModuleElements:
                return this.isExpectedModuleDeclaration_ModuleElementsTerminator();

            case ListParsingState.SwitchStatement_SwitchClauses:
                return this.isExpectedSwitchStatement_SwitchClausesTerminator();

            case ListParsingState.SwitchClause_Statements:
                return this.isExpectedSwitchClause_StatementsTerminator();

            case ListParsingState.Block_Statements_AllowFunctionDeclarations:     // Fall through
            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
                return this.isExpectedBlock_StatementsTerminator();

            case ListParsingState.EnumDeclaration_VariableDeclarators:
                return this.isExpectedEnumDeclaration_VariableDeclaratorsTerminator();

            case ListParsingState.ObjectType_TypeMembers:
                return this.isExpectedObjectType_TypeMembersTerminator();
            
            case ListParsingState.ArgumentList_AssignmentExpressions:
                return this.isExpectedArgumentList_AssignmentExpressionsTerminator();

            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                return this.isExpectedExtendsOrImplementsClause_TypeNameListTerminator();
            
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
                return this.isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator();

            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                return this.isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator();

            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                return this.isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator();
            
            case ListParsingState.ParameterList_Parameters:
                return this.isExpectedParameterList_ParametersTerminator();

            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                throw Errors.notYetImplemented();
            default:
                throw Errors.invalidOperation();
        }
    }

    private isExpectedSourceUnit_ModuleElementsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.EndOfFileToken;
    }

    private isExpectedEnumDeclaration_VariableDeclaratorsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedModuleDeclaration_ModuleElementsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedObjectType_TypeMembersTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedParameterList_ParametersTerminator(): bool {
        var token = this.currentToken();
        if (token.kind === SyntaxKind.CloseParenToken) {
            return true;
        }

        // We may also see a { in an error case.  i.e.:
        // function (a, b, c  {
        if (token.kind === SyntaxKind.OpenBraceToken) {
            return true;
        }

        // We may also see a => in an error case.  i.e.:
        // (f: number => { ... }
        if (token.kind === SyntaxKind.EqualsGreaterThanToken) {
            return true;
        }

        return false;
    }

    private isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator(): bool {
        // This is the case when we're parsing variable declarations in a for/for-in statement.
        if (this.currentToken().kind === SyntaxKind.SemicolonToken ||
            this.currentToken().kind === SyntaxKind.CloseParenToken) {
            return true;
        }

        if (this.currentToken().keywordKind() === SyntaxKind.InKeyword) {
            return true;
        }

        return false;
    }

    private isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator(): bool {
        //// This is the case when we're parsing variable declarations in a variable statement.

        // If we just parsed a comma, then we can't terminate this list.  i.e.:
        //      var a = bar, // <-- just consumed the  comma
        //          b = baz;
        if (this.previousToken.kind === SyntaxKind.CommaToken) {
            return false;
        }

        // We're done when we can eat a semicolon.
        return this.canEatExplicitOrAutomaticSemicolon();
    }

    private isExpectedExtendsOrImplementsClause_TypeNameListTerminator(): bool {
        if (this.currentToken().keywordKind() === SyntaxKind.ExtendsKeyword ||
            this.currentToken().keywordKind() === SyntaxKind.ImplementsKeyword) {
            return true;
        }

        if (this.currentToken().kind === SyntaxKind.OpenBraceToken ||
            this.currentToken().kind === SyntaxKind.CloseBraceToken) {
            return true;
        }

        return false;
    }

    private isExpectedArgumentList_AssignmentExpressionsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseParenToken;
    }

    private isExpectedClassDeclaration_ClassElementsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedSwitchStatement_SwitchClausesTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedSwitchClause_StatementsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken ||
               this.isSwitchClause();
    }

    private isExpectedBlock_StatementsTerminator(): bool {
        return this.currentToken().kind === SyntaxKind.CloseBraceToken;
    }

    private isExpectedListItem(currentListType: ListParsingState, inErrorRecovery: bool): any {
        switch (currentListType) {
            case ListParsingState.SourceUnit_ModuleElements:
                return this.isModuleElement();

            case ListParsingState.ClassDeclaration_ClassElements:
                return this.isClassElement();

            case ListParsingState.ModuleDeclaration_ModuleElements:
                return this.isModuleElement();

            case ListParsingState.SwitchStatement_SwitchClauses:
                return this.isSwitchClause();

            case ListParsingState.SwitchClause_Statements:
                return this.isStatement(/*allowFunctionDeclaration:*/ false);
            
            case ListParsingState.Block_Statements_AllowFunctionDeclarations:
                return this.isStatement(/*allowFunctionDeclaration:*/ true);

            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
                return this.isStatement(/*allowFunctionDeclaration:*/ false);

            case ListParsingState.EnumDeclaration_VariableDeclarators:
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                return this.isVariableDeclarator();

            case ListParsingState.ObjectType_TypeMembers:
                return this.isTypeMember();

            case ListParsingState.ArgumentList_AssignmentExpressions:
                return this.isExpression();

            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                return this.isName();
            
            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                return this.isPropertyAssignment(inErrorRecovery);
            
            case ListParsingState.ParameterList_Parameters:
                return this.isParameter();

            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                throw Errors.notYetImplemented();
            default:
                throw Errors.invalidOperation();
        }
    }

    private parseExpectedListItem(currentListType: ListParsingState): any {
        switch (currentListType) {
            case ListParsingState.SourceUnit_ModuleElements:
                return this.parseModuleElement();

            case ListParsingState.ClassDeclaration_ClassElements:
                return this.parseClassElement();

            case ListParsingState.ModuleDeclaration_ModuleElements:
                return this.parseModuleElement();

            case ListParsingState.SwitchStatement_SwitchClauses:
                return this.parseSwitchClause();

            case ListParsingState.SwitchClause_Statements:
                return this.parseStatement(/*allowFunctionDeclaration:*/ false);

            case ListParsingState.Block_Statements_AllowFunctionDeclarations:
                return this.parseStatement(/*allowFunctionDeclaration:*/ true);

            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
                return this.parseStatement(/*allowFunctionDeclaration:*/ false);

            case ListParsingState.EnumDeclaration_VariableDeclarators:
                return this.parseVariableDeclarator(/*allowIn:*/ true);
            
            case ListParsingState.ObjectType_TypeMembers:
                return this.parseTypeMember();
            
            case ListParsingState.ArgumentList_AssignmentExpressions:
                return this.parseAssignmentExpression(/*allowIn:*/ true);

            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                return this.parseName();

            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
                return this.parseVariableDeclarator(/*allowIn:*/ true);

            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                return this.parseVariableDeclarator(/*allowIn:*/ false);

            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                return this.parsePropertyAssignment();

            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                throw Errors.notYetImplemented();

            case ListParsingState.ParameterList_Parameters:
                return this.parseParameter();

            default:
                throw Errors.invalidOperation();
        }
    }

    private getExpectedListElementType(currentListType: ListParsingState): string {
        switch (currentListType) {
            case ListParsingState.SourceUnit_ModuleElements:
                return Strings.module__class__interface__enum__import_or_statement;

            case ListParsingState.ClassDeclaration_ClassElements:
                return Strings.constructor__function__accessor_or_variable;

            case ListParsingState.ModuleDeclaration_ModuleElements:
                return Strings.module__class__interface__enum__import_or_statement;

            case ListParsingState.SwitchStatement_SwitchClauses:
                return Strings.case_or_default_clause;

            case ListParsingState.SwitchClause_Statements:
                return Strings.statement;

            case ListParsingState.Block_Statements_AllowFunctionDeclarations:     // Fall through.
            case ListParsingState.Block_Statements_DisallowFunctionDeclarations:
                return Strings.statement;
            
            case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
            case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
            case ListParsingState.EnumDeclaration_VariableDeclarators:
                return Strings.identifier;

            case ListParsingState.ObjectType_TypeMembers:
                return Strings.call__construct__index__property_or_function_signature;

            case ListParsingState.ArgumentList_AssignmentExpressions:
                return Strings.expression;

            case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                return Strings.type_name;

            case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                return Strings.property_or_accessor;

            case ListParsingState.ParameterList_Parameters:
                return Strings.parameter;

            case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                throw Errors.notYetImplemented();
            default:
                throw Errors.invalidOperation();
        }
    }
}