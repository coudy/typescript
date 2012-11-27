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

//enum ParserTerminatorState
//{
//    EndOfFile = 0,
//    IsPossibleModuleElementStartOrStop = 1 << 3,
//}

//        private enum TerminatorState
//        {
//            IsNamespaceMemberStartOrStop = 1 << 0,
//            IsAttributeDeclarationTerminator = 1 << 1,
//            IsPossibleAggregateClauseStartOrStop = 1 << 2,
//            IsEndOfReturnType = 1 << 4,
//            IsEndOfParameterList = 1 << 5,
//            IsEndOfFieldDeclaration = 1 << 6,
//            IsPossibleEndOfVariableDeclaration = 1 << 7,
//            IsEndOfTypeArgumentList = 1 << 8,
//            IsPossibleStatementStartOrStop = 1 << 9,
//            IsEndOfFixedStatement = 1 << 10,
//            IsEndOfTryBlock = 1 << 11,
//            IsEndOfCatchClause = 1 << 12,
//            IsEndOfCatchBlock = 1 << 13,
//            IsEndOfDoWhileExpression = 1 << 14,
//            IsEndOfForStatementArgument = 1 << 15,
//            IsEndOfDeclarationClause = 1 << 16,
//            IsEndOfArgumentList = 1 << 17,
//            IsSwitchSectionStart = 1 << 18,
//            IsEndOfTypeParameterList = 1 << 19,
//            IsEndOfMethodSignature = 1 << 20,
//            IsEndOfNameInExplicitInterface = 1 << 21,
//        }

        //private const int LastTerminatorState = (int)TerminatorState.IsEndOfNameInExplicitInterface;

        //private TerminatorState termState;

class Parser {
    private scanner: Scanner = null;
    private oldTree: SyntaxTree = null;
    // private cancellationToken: CancellationToken = null;

    //private Blender firstBlender;
    //private BlendedNode currentNode;
    //private BlendedNode[] blendedTokens;
    private _currentToken: ISyntaxToken = null;
    private scannedTokens: ISyntaxToken[] = [];
    private previousToken: ISyntaxToken = null;

    private firstToken: number = 0;
    private tokenOffset: number = 0;

    private isInStrictMode: bool;
    private tokenCount: number = 0;
    private resetCount: number = 0;
    private resetStart: number = 0;

    constructor (
        scanner: Scanner,
        oldTree: SyntaxTree,
        changes: TextChangeRange[]/*,
            CancellationToken cancellationToken = default(CancellationToken)*/) {
        this.scanner = scanner;

        // this.cancellationToken = cancellationToken;

        this.oldTree = oldTree;

        //this.currentNode = default(BlendedNode);
        //if (this.isIncremental()) {
        //    this.firstBlender = new Blender(lexer, this.oldTree != null ? this.oldTree.GetRoot(cancellationToken) : null, changes);
        //    this.blendedTokens = new BlendedNode[32];
        //}
        //else {
        //    this.firstBlender = default(Blender);
        //    this.lexedTokens = new ArrayElement<SyntaxToken>[32];
        //}
    }

    private isIncremental(): bool {
        return this.oldTree != null;
    }

    private preScan(): void {
        var size = MathPrototype.min(4096, MathPrototype.max(32, this.scanner.text().length() / 2));
        var tokens: SyntaxToken[] = this.scannedTokens = ArrayUtilities.createArray(size);
        var scanner = this.scanner;

        for (var i = 0; i < size; i++) {
            // this.cancellationToken.ThrowIfCancellationRequested();
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
        //this.currentToken = default(SyntaxToken);
        //this.currentNode = default(BlendedNode);
        this.previousToken = point.previousToken;
        this.isInStrictMode = point.isInStrictMode;

        //if (this.blendedTokens != null)
        //{
        //    // look forward for slots not holding a token
        //    for (int i = this.tokenOffset; i < this.tokenCount; i++)
        //    {
        //        if (this.blendedTokens[i].Token == null)
        //        {
        //            // forget anything after and including any slot not holding a token
        //            this.tokenCount = i;
        //            break;
        //        }
        //    }
        //}
    }

    private release(point: ParserResetPoint): void {
        Debug.assert(this.resetCount == point.resetCount);
        this.resetCount--;
        if (this.resetCount == 0) {
            this.resetStart = -1;
        }
    }

    //private currentNode(): SyntaxNode {
    //    // we will fail anyways. Assert is just to catch that earlier.
    //    Debug.assert(this.blendedTokens != null);

    //    //PERF: currentNode is a BlendedNode, which is a fairly large struct.
    //    // the following code tries not to pull the whole struct into a local
    //    // we only need .Node
    //    var node = this.currentNode.Node;
    //    if (node != null)
    //    {
    //        return node;
    //    }

    //    this.ReadCurrentNode();
    //    return this.currentNode.Node;
    //}

    //private currentNodeKind(): SyntaxKind {
    //    get
    //    {
    //        var cn = this.CurrentNode;
    //        return cn != null ? cn.Kind : SyntaxKind.None;
    //    }
    //}

    //private void ReadCurrentNode()
    //{
    //    if (this.tokenOffset == 0)
    //    {
    //        this.currentNode = this.firstBlender.ReadNode(this.mode);
    //    }
    //    else
    //    {
    //        this.currentNode = this.blendedTokens[this.tokenOffset - 1].Blender.ReadNode(this.mode);
    //    }
    //}

    //protected SyntaxNode EatNode()
    //{
    //    // we will fail anyways. Assert is just to catch that earlier.
    //    Debug.Assert(this.blendedTokens != null);

    //    // remember result
    //    var result = CurrentNode.Green;

    //    // store possible non-token in token sequence 
    //    if (this.tokenOffset >= this.blendedTokens.Length)
    //    {
    //        this.AddTokenSlot();
    //    }

    //    this.blendedTokens[this.tokenOffset++] = this.currentNode;
    //    this.tokenCount = this.tokenOffset; // forget anything after this slot

    //    // erase current state
    //    this.currentNode = default(BlendedNode);
    //    this.currentToken = default(SyntaxToken);

    //    return result;
    //}

    private currentToken(): ISyntaxToken {
        //PERF: unlike BlendedNode, currentToken is a reference
        // we want to localize it to avoid extra memory loads
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

        //if (this.blendedTokens != null)
        //{
        //    return this.blendedTokens[this.tokenOffset].Token;
        //}
        //else
        //{
        return this.scannedTokens[this.tokenOffset];
        //}
    }

    private addNewToken(): void {
        //if (this.blendedTokens != null)
        //{
        //    if (this.tokenCount > 0)
        //    {
        //        this.AddToken(this.blendedTokens[this.tokenCount - 1].Blender.ReadToken(this.mode));
        //    }
        //    else
        //    {
        //        if (this.currentNode.Token != null)
        //        {
        //            this.AddToken(this.currentNode);
        //        }
        //        else
        //        {
        //            this.AddToken(this.firstBlender.ReadToken(this.mode));
        //        }
        //    }
        //}
        //else
        //{
        this.addScannedToken(this.scanner.scan());
        //}
    }

    // adds token to end of current token array
    //private void AddToken(BlendedNode tokenResult)
    //{
    //    Debug.Assert(tokenResult.Token != null);
    //    if (this.tokenCount >= this.blendedTokens.Length)
    //    {
    //        this.AddTokenSlot();
    //    }

    //    this.blendedTokens[this.tokenCount] = tokenResult;
    //    this.tokenCount++;
    //}

    private addScannedToken(token: ISyntaxToken): void {
        Debug.assert(token !== null);
        if (this.tokenCount >= this.scannedTokens.length) {
            this.tryShiftScannedTokens();
        }

        this.scannedTokens[this.tokenCount] = token;
        this.tokenCount++;
    }

    //private void AddTokenSlot()
    //{
    //    // shift tokens to left if we are far to the right
    //    // don't shift if reset points have fixed locked tge starting point at the token in the window
    //    if (this.tokenOffset > (this.blendedTokens.Length >> 1)
    //        && (this.resetStart == -1 || this.resetStart > this.firstToken))
    //    {
    //        int shiftOffset = (this.resetStart == -1) ? this.tokenOffset : this.resetStart - this.firstToken;
    //        int shiftCount = this.tokenCount - shiftOffset;
    //        Debug.Assert(shiftOffset > 0);
    //        this.firstBlender = this.blendedTokens[shiftOffset - 1].Blender;
    //        if (shiftCount > 0)
    //        {
    //            Array.Copy(this.blendedTokens, shiftOffset, this.blendedTokens, 0, shiftCount);
    //        }

    //        this.firstToken += shiftOffset;
    //        this.tokenCount -= shiftOffset;
    //        this.tokenOffset -= shiftOffset;
    //    }
    //    else
    //    {
    //        var tmp = new BlendedNode[this.blendedTokens.Length * 2];
    //        Array.Copy(this.blendedTokens, tmp, this.blendedTokens.Length);
    //        this.blendedTokens = tmp;
    //    }
    //}

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

        //if (this.blendedTokens != null) {
        //    return this.blendedTokens[this.tokenOffset + n].Token;
        //}
        //else {
        return this.scannedTokens[this.tokenOffset + n];
        //}
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

        //if (this.blendedTokens != null) {
        //    this.currentNode = null; 
        //}

        this.tokenOffset++;
    }

    //this method is called very frequently
    //we should keep it simple so that it can be inlined.
    private eatToken(kind: SyntaxKind, reportError?: bool = true): ISyntaxToken {
        Debug.assert(SyntaxFacts.isTokenKind(kind))

        var token = this.currentToken();
        if (token.kind() === kind) {
            this.moveToNextToken();
            return token;
        }

        //slow part of EatToken(SyntaxKind kind)
        return this.createMissingToken(kind, token.kind(), /*reportError: */ reportError);
    }

    private eatKeyword(kind: SyntaxKind, reportError?: bool = true): ISyntaxToken {
        Debug.assert(SyntaxFacts.isTokenKind(kind))

        var token = this.currentToken();
        if (token.keywordKind() === kind) {
            this.moveToNextToken();
            return token;
        }

        //slow part of EatToken(SyntaxKind kind)
        return this.createMissingToken(kind, token.kind(), /*reportError: */ reportError);
    }
    
    // This method should be called when the grammar calls for on *IdentifierName* and not an
    // *Identifier*.
    private eatIdentifierNameToken(reportError?: bool = true): ISyntaxToken {
        var token = this.currentToken();
        if (token.kind() === SyntaxKind.IdentifierNameToken) {
            this.moveToNextToken();
            return token;
        }

        return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.kind(), /*reportError: */ reportError);
    }

    // This method should be called when the grammar calls for on *Identifier* and not an
    // *IdentifierName*.
    private eatIdentifierToken(reportError?: bool = true): ISyntaxToken {
        var token = this.currentToken();
        if (token.kind() === SyntaxKind.IdentifierNameToken) {
            if (this.isKeyword(token.keywordKind())) {
                return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.keywordKind(), /*reportError: */ reportError);
            }

            this.moveToNextToken();
            return token;
        }

        return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.kind(), /*reportError: */ reportError);
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

    private createMissingToken(expected: SyntaxKind, actual: SyntaxKind, reportError: bool): ISyntaxToken {
        var token = SyntaxToken.createEmptyToken(expected);
        if (reportError) {
            token = this.withAdditionalDiagnostics(token, this.getExpectedTokenDiagnosticInfo(expected, actual));
        }

        return token;
    }

    //private SyntaxToken CreateMissingToken(SyntaxKind expected, ErrorCode code, bool reportError)
    //{
    //    // should we eat the current ParseToken's leading trivia?
    //    var token = Syntax.MissingToken(expected);
    //    if (reportError)
    //    {
    //        token = AddError(token, code);
    //    }

    //    return token;
    //}

    //protected SyntaxToken EatToken(SyntaxKind kind, bool reportError)
    //{
    //    if (reportError)
    //    {
    //        return EatToken(kind);
    //    }

    //    Debug.Assert(kind.IsAnyToken());
    //    if (this.CurrentToken.Kind != kind)
    //    {
    //        return Syntax.MissingToken(kind);
    //    }
    //    else
    //    {
    //        return this.EatToken();
    //    }
    //}

    //protected SyntaxToken EatToken(SyntaxKind kind, ErrorCode code, bool reportError = true)
    //{
    //    Debug.Assert(kind.IsAnyToken());
    //    if (this.CurrentToken.Kind != kind)
    //    {
    //        return CreateMissingToken(kind, code, reportError);
    //    }
    //    else
    //    {
    //        return this.EatToken();
    //    }
    //}

    private eatTokenWithPrejudice(kind: SyntaxKind): ISyntaxToken {
        var token = this.currentToken();

        Debug.assert(SyntaxFacts.isTokenKind(kind));
        if (token.kind() !== kind) {
            token = this.withAdditionalDiagnostics(token, this.getExpectedTokenDiagnosticInfo(kind, token.kind()));
        }

        this.moveToNextToken();
        return token;
    }

    //protected SyntaxToken EatTokenWithPrejudice(ErrorCode errorCode, params object[] args)
    //{
    //    var token = this.EatToken();
    //    token = WithAdditionalDiagnostics(token, MakeError(token.LeadingWidth, token.Width, errorCode, args));
    //    return token;
    //}

    //protected SyntaxToken EatContextualToken(SyntaxKind kind, ErrorCode code, bool reportError = true)
    //{
    //    Debug.Assert(kind.IsAnyToken());

    //    if (this.CurrentToken.ContextualKind != kind)
    //    {
    //        return CreateMissingToken(kind, code, reportError);
    //    }
    //    else
    //    {
    //        return ConvertToKeyword(this.EatToken());
    //    }
    //}

    //protected SyntaxToken EatContextualToken(SyntaxKind kind, bool reportError = true)
    //{
    //    Debug.Assert(kind.IsAnyToken());

    //    var contextualKind = this.CurrentToken.ContextualKind;
    //    if (contextualKind != kind)
    //    {
    //        return CreateMissingToken(kind, contextualKind, reportError);                
    //    }
    //    else
    //    {
    //        return ConvertToKeyword(this.EatToken());
    //    }
    //}

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

    //protected virtual SyntaxDiagnosticInfo GetExpectedTokenError(SyntaxKind expected, SyntaxKind actual)
    //{
    //    int offset, width;
    //    this.GetDiagnosticSpanForMissingToken(out offset, out width);

    //    return this.GetExpectedTokenError(expected, actual, offset, width);
    //}

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

    //protected TNode AddError<TNode>(TNode node, ErrorCode code, params object[] args) where TNode : SyntaxNode
    //{
    //    if (node.IsMissing)
    //    {
    //        int offset, width;
    //        this.GetDiagnosticSpanForMissingToken(out offset, out width);

    //        return WithAdditionalDiagnostics(node, MakeError(offset, width, code, args));
    //    }

    //    return WithAdditionalDiagnostics(node, MakeError(node, code, args));
    //}

    //protected TNode AddError<TNode>(TNode node, int offset, int length, ErrorCode code, params object[] args) where TNode : SyntaxNode
    //{
    //    return WithAdditionalDiagnostics(node, MakeError(offset, length, code, args));
    //}

    //protected TNode AddError<TNode>(TNode node, SyntaxNode location, ErrorCode code, params object[] args) where TNode : SyntaxNode
    //{
    //    // assumes non-terminals will at most appear once in sub-tree
    //    int offset;
    //    FindOffset(node, location, out offset);
    //    return WithAdditionalDiagnostics(node, MakeError(offset, location.Width, code, args));
    //}

    //protected TNode AddErrorToFirstToken<TNode>(TNode node, ErrorCode code, params object[] args) where TNode : SyntaxNode
    //{
    //    var firstToken = node.GetFirstToken(true);
    //    return WithAdditionalDiagnostics(node, MakeError(0, firstToken.Width, code, args));
    //}

    //protected TNode AddErrorToLastToken<TNode>(TNode node, ErrorCode code, params object[] args) where TNode : SyntaxNode
    //{
    //    var lastToken = node.GetLastToken();
    //    var offset = node.FullWidth; //advance to end of entire node
    //    var width = 0;
    //    if (lastToken != null) //will be null if all tokens are missing
    //    {
    //        offset -= lastToken.FullWidth; //rewind past last token
    //        offset += lastToken.LeadingWidth; //advance past last token leading trivia - now at start of last token
    //        width += lastToken.Width;
    //    }
    //    return WithAdditionalDiagnostics(node, MakeError(offset, width, code, args));
    //}

    //protected static SyntaxDiagnosticInfo MakeError(int offset, int width, ErrorCode code, params object[] args)
    //{
    //    return new SyntaxDiagnosticInfo(offset, width, code, args);
    //}

    //protected static SyntaxDiagnosticInfo MakeError(SyntaxNode node, ErrorCode code, params object[] args)
    //{
    //    return new SyntaxDiagnosticInfo(node.LeadingWidth, node.Width, code, args);
    //}

    //protected static SyntaxDiagnosticInfo MakeError(ErrorCode code, params object[] args)
    //{
    //    return new SyntaxDiagnosticInfo(code, args);
    //}

    //protected TNode AddLeadingSkippedSyntax<TNode>(TNode node, SyntaxNode skippedSyntax) where TNode : SyntaxNode
    //{
    //    var oldToken = node as SyntaxToken ?? node.GetFirstToken(includeZeroWidth: true);
    //    var newToken = AddSkippedSyntax(oldToken, skippedSyntax, trailing: false);
    //    return SyntaxFirstTokenReplacer.Replace(node, oldToken, newToken, skippedSyntax.FullWidth);
    //}

    //protected TNode AddTrailingSkippedSyntax<TNode>(TNode node, SyntaxNode skippedSyntax) where TNode : SyntaxNode
    //{
    //    var token = node as SyntaxToken;
    //    if (token != null)
    //    {
    //        return (TNode)(object)AddSkippedSyntax(token, skippedSyntax, trailing: true);
    //    }
    //    else
    //    {
    //        var lastToken = node.GetLastToken(includeZeroWidth: true);
    //        var newToken = AddSkippedSyntax(lastToken, skippedSyntax, trailing: true);
    //        return SyntaxLastTokenReplacer.Replace(node, newToken);
    //    }
    //}

    /// <summary>
    /// Converts skippedSyntax node into tokens and adds these as trivia on the target token.
    /// Also adds the first error (in depth-first preorder) found in the skipped syntax tree to the target token.
    /// </summary>
    //internal SyntaxToken AddSkippedSyntax(SyntaxToken target, SyntaxNode skippedSyntax, bool trailing)
    //{
    //    var builder = new SyntaxListBuilder(4);

    //    // the error in we'll attach to the node
    //    SyntaxDiagnosticInfo diagnostic = null;

    //    // the position of the error within the skipedSyntax node full tree
    //    int diagnosticOffset = 0;

    //    int currentOffset = 0;
    //    foreach (var node in skippedSyntax.EnumerateNodes())
    //    {
    //        SyntaxToken token = node as SyntaxToken;
    //        if (token != null)
    //        {
    //            builder.Add(token.GetLeadingTrivia());

    //            if (token.Width > 0)
    //            {
    //                // separate trivia from the tokens
    //                SyntaxToken tk = token.WithLeadingTrivia(null).WithTrailingTrivia(null);

    //                // adjust relative offsets of diagnostics attached to the token:
    //                int leadingWidth = token.LeadingWidth;
    //                if (leadingWidth > 0)
    //                {
    //                    var tokenDiagnostics = tk.GetDiagnostics();
    //                    for (int i = 0; i < tokenDiagnostics.Length; i++)
    //                    {
    //                        var d = (SyntaxDiagnosticInfo)tokenDiagnostics[i];
    //                        tokenDiagnostics[i] = new SyntaxDiagnosticInfo(d.Offset - leadingWidth, d.Width, (ErrorCode)d.Code, d.Arguments);
    //                    }
    //                }

    //                builder.Add(Syntax.SkippedTokensTrivia(tk));
    //            }
    //            else
    //            {
    //                // do not create zero-width structured trivia, GetStructure doesn't work well for them
    //                var existing = (SyntaxDiagnosticInfo)token.GetDiagnostics().FirstOrDefault();
    //                if (existing != null)
    //                {
    //                    diagnostic = existing;
    //                    diagnosticOffset = currentOffset;
    //                }
    //            }
    //            builder.Add(token.GetTrailingTrivia());

    //            currentOffset += token.FullWidth;
    //        }
    //        else if (node.ContainsDiagnostics && diagnostic == null)
    //        {
    //            // only propagate the first error to reduce noise:
    //            var existing = (SyntaxDiagnosticInfo)node.GetDiagnostics().FirstOrDefault();
    //            if (existing != null)
    //            {
    //                diagnostic = existing;
    //                diagnosticOffset = currentOffset;
    //            }
    //        }
    //    }

    //    int triviaWidth = currentOffset;
    //    var trivia = builder.ToListNode();

    //    // total width of everything preceding the added trivia
    //    int triviaOffset;
    //    if (trailing)
    //    {
    //        var trailingTrivia = target.GetTrailingTrivia();
    //        triviaOffset = target.FullWidth; //added trivia is full width (before addition)
    //        target = target.WithTrailingTrivia(SyntaxList.Concat(trailingTrivia, trivia));
    //    }
    //    else
    //    {
    //        // Since we're adding triviaWidth before the token, we have to add that much to
    //        // the offset of each of its diagnostics.
    //        if (triviaWidth > 0)
    //        {
    //            var targetDiagnostics = target.GetDiagnostics();
    //            for (int i = 0; i < targetDiagnostics.Length; i++)
    //            {
    //                var d = (SyntaxDiagnosticInfo)targetDiagnostics[i];
    //                targetDiagnostics[i] = new SyntaxDiagnosticInfo(d.Offset + triviaWidth, d.Width, (ErrorCode)d.Code, d.Arguments);
    //            }
    //        }

    //        var leadingTrivia = target.GetLeadingTrivia();
    //        target = target.WithLeadingTrivia(SyntaxList.Concat(trivia, leadingTrivia));
    //        triviaOffset = 0; //added trivia is first, so offset is zero
    //    }

    //    if (diagnostic != null)
    //    {
    //        int newOffset = triviaOffset + diagnosticOffset + diagnostic.Offset;

    //        target = WithAdditionalDiagnostics(target, 
    //            new SyntaxDiagnosticInfo(newOffset, diagnostic.Width, (ErrorCode)diagnostic.Code, diagnostic.Arguments)
    //        );
    //    }

    //    return target;
    //}

    /// <summary>
    /// This function searches for the given location node within the subtree rooted at root node. 
    /// If it finds it, the function computes the offset span of that child node within the root and returns true, 
    /// otherwise it returns false.
    /// </summary>
    /// <param name="root">Root node</param>
    /// <param name="location">Node to search in the subtree rooted at root node</param>
    /// <param name="offset">Offset of the location node within the subtree rooted at child</param>
    /// <returns></returns>
    //private bool FindOffset(SyntaxNode root, SyntaxNode location, out int offset)
    //{            
    //    int currentOffset = 0;
    //    offset = 0;
    //    if (root != null)
    //    {                
    //        for (int i = 0, n = root.SlotCount; i < n; i++)
    //        {
    //            var child = root.GetSlot(i);                    
    //            if (child == null)
    //            {
    //                // ignore null slots
    //                continue;
    //            }

    //            // check if the child node is the location node
    //            if (child == location)
    //            {
    //                // Found the location node in the subtree
    //                // Initialize offset with the offset of the location node within its parent
    //                // and walk up the stack of recursive calls adding the offset of each node
    //                // within its parent
    //                offset = currentOffset;
    //                return true;
    //            }

    //            // search for the location node in the subtree rooted at child node
    //            if (this.FindOffset(child, location, out offset))
    //            {
    //                // Found the location node in child's subtree
    //                // Add the offset of child node within its parent to offset
    //                // and continue walking up the stack
    //                offset += child.LeadingWidth + currentOffset;
    //                return true;
    //            }

    //            // We didn't find the location node in the subtree rooted at child
    //            // Move on to the next child
    //            currentOffset += child.FullWidth;
    //        }
    //    }

    //    // We didn't find the location node within the subtree rooted at root node
    //    return false;
    //}

    //protected SyntaxToken ConvertToKeyword(SyntaxToken token)
    //{
    //    if (token.Kind != token.ContextualKind)
    //    {
    //        var kw = token.IsMissing
    //                ? Syntax.MissingToken(token.LeadingTrivia.Node, token.ContextualKind, token.TrailingTrivia.Node)
    //                : Syntax.Token(token.LeadingTrivia.Node, token.ContextualKind, token.TrailingTrivia.Node);
    //        var d = token.GetDiagnostics();
    //        if (d != null && d.Length > 0)
    //        {
    //            kw = kw.WithDiagnostics(d);
    //        }

    //        return kw;
    //    }

    //    return token;
    //}

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

        throw Errors.notYetImplemented();
    }

    public parseSourceUnit(): SourceUnitSyntax {
        var moduleElements: ModuleElementSyntax[] = [];

        while (this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            var moduleElement = this.parseModuleElement();
            moduleElements.push(moduleElement);
        }

        return new SourceUnitSyntax(SyntaxNodeList.create(moduleElements), this.currentToken());
    }

    //public parseDeclarationSourceUnit(): DeclarationSourceUnitSyntax {
    //    if (true) {
    //        throw Errors.notYetImplemented();
    //    }

    //    return null;
    //}

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
        var semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

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

    private isClassDeclaration(): bool {
        return this.tokenIsKeyword(this.currentToken(), SyntaxKind.ClassKeyword) &&
               this.isIdentifier(this.peekTokenN(1));
    }

    private parseClassDeclaration(): ClassDeclarationSyntax {
        throw Errors.notYetImplemented();
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
        if (this.currentToken().kind() === SyntaxKind.SemicolonToken) {
            semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
        }
        else if (this.isBlock()) {
            block = this.parseBlock(/*allowFunctionDeclaration:*/ true);
        }
        else {
            throw Errors.notYetImplemented();
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
                
                moduleElements = moduleElements === null ? [] : moduleElements;
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
                typeMembers = typeMembers === null ? [] : typeMembers;
                typeMembers.push(typeMember);

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
        throw Errors.notYetImplemented();
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

    private parseExtendsClause(): ExtendsClauseSyntax {
        throw Errors.notYetImplemented();
    }

    private isExtendsClause(): bool {
        return this.currentToken().keywordKind() === SyntaxKind.ExtendsKeyword;
    }

    private parseStatement(allowFunctionDeclaration: bool): StatementSyntax {
        if (this.isVariableStatement()) {
            return this.parseVariableStatement();
        }
        else if (allowFunctionDeclaration && this.isFunctionDeclaration()) {
            return this.parseFunctionDeclaration();
        }
        else if (this.isIfStatement()) {
            return this.parseIfStatement();
        }
        else {
            throw Errors.notYetImplemented();
        }
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
        return this.currentToken().kind() === SyntaxKind.ElseKeyword;
    }

    private parseElseClause(): ElseClauseSyntax {
        throw Errors.notYetImplemented();
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

        var varKeyword = this.eatKeyword(SyntaxKind.VarKeyword);

        var variableDeclarations = [];

        var variableDeclaration = this.parseVariableDeclaration();
        variableDeclarations.push(variableDeclaration);

        while (true) {
            if (this.currentToken().kind() === SyntaxKind.CommaToken) {
                var commaToken = this.eatToken(SyntaxKind.CommaToken);
                variableDeclarations.push(commaToken);

                variableDeclaration = this.parseVariableDeclaration();
                variableDeclarations.push(variableDeclaration);
                continue;
            }

            if (this.currentToken().kind() === SyntaxKind.SemicolonToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }

            // TODO: Add appropriate error recovery here.  Consume tokens until we reach a 
            // semicolon or comma.  For now, just bail out.
            break;
        }

        var semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

        return new VariableStatementSyntax(exportKeyword, varKeyword, SeparatedSyntaxList.create(variableDeclarations), semicolonToken);
    }

    private parseVariableDeclaration(): VariableDeclarationSyntax {
        var identifier = this.eatIdentifierToken();
        var equalsValueClause: EqualsValueClauseSyntax = null;
        var typeAnnotation: TypeAnnotationSyntax = null;

        if (!identifier.isMissing()) {
            if (this.isTypeAnnotation()) {
                typeAnnotation = this.parseTypeAnnotation();
            }

            if (this.isEqualsValueClause()) {
                equalsValueClause = this.parseEqualsValuesClause();
            }
        }

        return new VariableDeclarationSyntax(identifier, typeAnnotation, equalsValueClause);
    }

    private isEqualsValueClause(): bool {
        return this.currentToken().kind() === SyntaxKind.EqualsToken;
    }

    private parseEqualsValuesClause(): EqualsValueClauseSyntax {
        Debug.assert(this.isEqualsValueClause());

        var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
        var value = this.parseAssignmentExpression(/*allowIn:*/ true);

        return new EqualsValueClauseSyntax(equalsToken, value);
    }

    private parseExpression(allowIn: bool): ExpressionSyntax {
        return this.parseSubExpression(0, allowIn);
    }

    private parseAssignmentExpression(allowIn: bool): ExpressionSyntax {
        return this.parseSubExpression(ParserExpressionPrecedence.AssignmentExpressionPrecedence, allowIn);
    }

    private parseSubExpression(precedence: ParserExpressionPrecedence, allowIn: bool): ExpressionSyntax {
        var leftOperand: ExpressionSyntax = null;

        var currentTokenKind = this.currentToken().kind();
        if (SyntaxFacts.isPrefixUnaryExpressionOperatorToken(currentTokenKind)) {
            var operatorKind = SyntaxFacts.getPrefixUnaryExpression(currentTokenKind);

            var operatorToken = this.eatAnyToken();

            // Note: we don't actuall have to pass 'allowIn' here.  Any unary expression has such
            // high precedence that we'd never actually consume an 'in' expression if we saw one.
            // i.e. if we had "!f in bar", that would be parsed as "(!f) in bar" not "!(f in bar)".
            // However, we need to pass something, so we just pass this along.
            var operand = this.parseSubExpression(this.getPrecedence(operatorKind), allowIn);
            leftOperand = new PrefixUnaryExpressionSyntax(operatorKind, operatorToken, operand);
        }
        else {
            leftOperand = this.parseTerm(precedence);
        }

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

    private parseTerm(precedence: number): ExpressionSyntax {
        var term = this.parseTermWorker(precedence);
        if (term.isMissing()) {
            return term;
        }

        return this.parsePostFixExpression(term);
    }

    private parsePostFixExpression(expression: ExpressionSyntax): ExpressionSyntax {
        Debug.assert(expression !== null);

        while (true) {
            var currentTokenKind = this.currentToken().kind();
            switch (currentTokenKind) {
                case SyntaxKind.OpenParenToken:
                    expression = new InvocationExpressionSyntax(expression, this.parseArgumentList());
                    break;

                case SyntaxKind.OpenBracketToken:
                    expression = this.parseElementAccessExpression(expression);
                    break;

                case SyntaxKind.PlusPlusToken:
                case SyntaxKind.MinusMinusToken:
                    // TODO: verify there is no newline between the previous token and the current one.
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

    private parseArgumentList(): ArgumentListSyntax { 
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

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

    private parseTermWorker(precedence: number): ExpressionSyntax {
        var currentToken = this.currentToken();

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

            case SyntaxKind.OpenParenToken:
                return this.parseParenthesizedOrLambdaExpression(precedence);
        }

        // Parse out a missing name here once code for all cases has been included.
        if (true) {
            throw Errors.notYetImplemented();
        }

        // Nothing else worked, just try to consume an identifier so we report an error.
        return new IdentifierNameSyntax(this.eatIdentifierToken());
    }

    private parseParenthesizedOrLambdaExpression(precedence: number): ExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

            var result = this.tryParseArrowFunctionExpression(precedence);
            if (result !== null) {
                return result;
            }

        // Doesn't look like a lambda, so parse this as a parenthesized expression.
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var expression = this.parseExpression(/*allowIn:*/ true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    }

    private tryParseArrowFunctionExpression(precedence: ParserExpressionPrecedence): ArrowFunctionExpressionSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

        // Because arrow functions and parenthesized expressions look similar, we have to check far
        // enough ahead to be sure we've actually got an arrow function.

        //if (this.previousToken == null) {
        //    return false;
        //}

        //// Note: this list may not be exhaustive.  For example, 
        //switch (this.previousToken.kind()) {
        //    case SyntaxKind.OpenParenToken:         // foo(() => {})
        //    case SyntaxKind.CommaToken:             // foo(x, () => {})
        //    case SyntaxKind.EqualsToken:            // var foo = () => {}
        //    case SyntaxKind.ColonToken:             // var x = { foo: () => {} }
        //    case SyntaxKind.ReturnKeyword:          // return () => { }
        //    case SyntaxKind.EqualsGreaterThanToken: // var x = () => () => { }
        //        break;
        //    default:
        //        return false;
        //}

        // First, check for things that definitely have enough information to let us know it's an
        // arrow function. Then, try to actually parse it as a lambda, and only return if we see
        // an => 

        if (this.isDefinitelyArrowFunctionExpression()) {
            return this.parseParenthesizedArrowFunctionExpression(/*requiresArrow:*/ false);
        }

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

        // Anything else wasn't clear enough.  Try to parse the expression as a lambda and bail out
        // if we fail.
        return false;
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
                expressions = expressions === null ? [] : expressions;

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
            
            expressions = expressions === null ? [] : expressions;
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
        var thisKeyword = this.eatToken(SyntaxKind.ThisKeyword);
        return new ThisExpressionSyntax(thisKeyword);
    }

    private parseBlock(allowFunctionDeclaration: bool): BlockSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBraceToken);

        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

        var statements: StatementSyntax[] = null;

        while (true) {
            if (this.currentToken().kind() === SyntaxKind.CloseBraceToken || 
                this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }

            // REVIEW: add error tolerance here.
            var statement = this.parseStatement(allowFunctionDeclaration);
            statements.push(statement);
        }

        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

        return new BlockSyntax(openBraceToken, SyntaxNodeList.create(statements), closeBraceToken);
    }

    private parseCallSignature(): CallSignatureSyntax {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);

        var parameterList = this.parseParameterList();
        var returnTypeAnnotation: TypeAnnotationSyntax = null;
        if (this.isTypeAnnotation()) {
            returnTypeAnnotation = this.parseTypeAnnotation();
        }

        return new CallSignatureSyntax(parameterList, returnTypeAnnotation);
    }

    private parseParameterList(): ParameterListSyntax {
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);

        var parameters: any[] = null;

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
            throw Errors.notYetImplemented();
        }
    }

    private parseFunctionType(): FunctionTypeSyntax {
        throw Errors.notYetImplemented();
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
        if (this.currentToken().kind() === SyntaxKind.PublicKeyword ||
            this.currentToken().kind() === SyntaxKind.PrivateKeyword) {
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
            equalsValueClause = this.parseEqualsValuesClause();
        }

        return new ParameterSyntax(dotDotDotToken, publicOrPrivateToken, identifier, questionToken, typeAnnotation, equalsValueClause);
    }
}