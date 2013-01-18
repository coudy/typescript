/// <reference path='SyntaxRewriter.generated.ts' />
/// <reference path='SlidingWindow.ts' />

/// <reference path='ParseOptions.ts' />
/// <reference path='Scanner.ts' />
/// <reference path='Strings.ts' />
/// <reference path='SyntaxFactory.generated.ts' />
/// <reference path='SyntaxTree.ts' />
/// <reference path='SyntaxTriviaList.ts' />
/// <reference path='TextChangeRange.ts' />

module Parser {
    // Information the parser needs to effectively rewind.
    interface IParserRewindPoint {
        // Information used by normal parser source.
        previousToken: ISyntaxToken;
        absolutePosition: number;
        slidingWindowIndex: number;

        // Information used by the incremental parser source.
        oldSourceUnitCursorIndex: number;
        changeDelta: number;
        changeRange: TextChangeRange;

        // Information used by the parser itself.

        // As we speculatively parser, we may build up diagnostics and skipped tokens.  When we    
        // rewind we want to 'forget' that information.  In order to do that we store the count
        // of diagnostics and skipped tokens when we start speculating, and we reset to that
        // count when we're done.  That way the speculative parse does not affect any further
        // results.
        diagnosticsCount: number;
        skippedTokensCount: number;

        // For debug purposes only, we also track the following information. They help us assert 
        // that we're not doing anything unexpected.

        // Rewind points should work like a stack.  The first rewind point given out should be the
        // last one released.  By keeping track of the count of points out when this was created, 
        // we can ensure that invariant was preserved.
        pinCount: number;

        // isInStrictMode and listParsingState should not have to be tracked by a rewind point.
        // Because they are naturally mutated and restored based on the normal stack movement of 
        // the parser, they should automatically return to whatever value they had to begin with
        // if the parser decides to rewind or not.  However, to ensure that this is true, we track
        // these variables and check if they have the same value when we're rewinding/releasing.
        isInStrictMode: bool;
        listParsingState: ListParsingState;
    }

    // The precedence of expressions in typescript.  While we're parsing an expression, we will 
    // continue to consume and form new trees if the precedence is greater than our current
    // precedence.  For example, if we have: a + b * c, we will first parse 'a' with precedence 0. 
    // We will then see the + with precedence 13.  13 is greater than 0 so we will decide to create
    // a binary expression with the result of parsing the sub expression "b * c".  We'll then parse
    // the term 'b' (passing in precedence 13).  We will then see the * with precedence 14.  14 is
    // greater than 13, so we will create a binary expression from "b" and "c", return that, and 
    // join it with "a" producing:
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
    enum ExpressionPrecedence {
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
        UnaryExpressionPrecedence = 15,
    }

    // The current state of the parser wrt to list parsing.  The way to read these is as:
    // CurrentProduction_SubList.  i.e. "Block_Statements" means "we're parsing a Block, and we're 
    // currently parsing list of statements within it".  This is used by the list parsing mechanism
    // to parse the elements of the lists, and recover from errors we encounter when we run into 
    // unexpected code.
    // 
    // For example, when we are in ArgumentList_Arguments, we will continue trying to consume code 
    // as long as "isArgument" is true.  If we run into a token for which "isArgument" is not true 
    // we will do the following:
    //
    // If the token is a StopToken for ArgumentList_Arguments (like ")" ) then we will stop parsing
    // the list of arguments with no error.
    //
    // Otherwise, we *do* report an error for this unexpected token, and then enter error recovery 
    // mode to decide how to try to recover from this unexpected token.
    //
    // Error recovery will walk up the list of states we're in seeing if the token is a stop token
    // for that construct *or* could start another element within what construct.  For example, if
    // the unexpected token was '}' then that would be a stop token for Block_Statements. 
    // Alternatively, if the unexpected token was 'return', then that would be a start token for 
    // the next statment in Block_Statements.
    // 
    // If either of those cases are true, We will then return *without* consuming  that token. 
    // (Remember, we've already reported an error).  Now we're just letting the higher up parse 
    // constructs eventually try to consume that token.
    //
    // If none of the higher up states consider this a stop or start token, then we will simply 
    // consume the token and add it to our list of 'skipped tokens'.  We will then repeat the 
    // above algorithm until we resynchronize at some point.
    enum ListParsingState {
        SourceUnit_ModuleElements = 1 << 0,
        ClassDeclaration_ClassElements = 1 << 1,
        ModuleDeclaration_ModuleElements = 1 << 2,
        SwitchStatement_SwitchClauses = 1 << 3,
        SwitchClause_Statements = 1 << 4,
        Block_Statements = 1 << 5,
        EnumDeclaration_VariableDeclarators = 1 << 7,
        ObjectType_TypeMembers = 1 << 8,
        ExtendsOrImplementsClause_TypeNameList = 1 << 9,
        VariableDeclaration_VariableDeclarators_AllowIn = 1 << 10,
        VariableDeclaration_VariableDeclarators_DisallowIn = 1 << 11,
        ArgumentList_AssignmentExpressions = 1 << 12,
        ObjectLiteralExpression_PropertyAssignments = 1 << 13,
        ArrayLiteralExpression_AssignmentExpressions = 1 << 14,
        ParameterList_Parameters = 1 << 15,
        TypeArgumentList_Types = 1 << 16,
        TypeParameterList_TypeParameters = 1 << 17,

        FirstListParsingState = SourceUnit_ModuleElements,
        LastListParsingState = TypeArgumentList_Types,
    }

    // Information we collect in the parser when we skip a token.
    interface SkippedToken {
        // The token we skipped.
        skippedToken: ISyntaxToken;

        // The token that we will attach the skipped token to.  Can be null in the case where we 
        // haven't seen a single token yet.  In that case, the skipped token will be added to the
        // first token in the tree.
        owningToken: ISyntaxToken;
    }

    // Helper class to take the tokens that we've skipped over and attach them as 'SkippedText' 
    // trivia to the token that preceded them (or to the first token in the file if no token 
    // preceded them).
    class SkippedTokensAdder extends SyntaxRewriter {
        private skippedTokens: SkippedToken[];

        constructor(skippedTokens: SkippedToken[]) {
            super();

            this.skippedTokens = skippedTokens;
        }

        private visitNode(node: SyntaxNode): SyntaxNode {
            if (this.skippedTokens.length === 0) {
                return node;
            }

            return super.visitNode(node);
        }

        private visitList(list: ISyntaxList): ISyntaxList {
            if (this.skippedTokens.length === 0) {
                return list;
            }

            return super.visitList(list);
        }

        private visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {
            if (this.skippedTokens.length === 0) {
                return list;
            }

            return super.visitSeparatedList(list);
        }

        private visitToken(token: ISyntaxToken): ISyntaxToken {
            if (this.skippedTokens.length === 0) {
                return token;
            }

            var currentOwner = null;

            // First check for skipped tokens at the beginning the document.  These will get attached
            // to the first token we run into.
            var leadingTrivia: ISyntaxTrivia[] = null;
            while (this.skippedTokens.length > 0 &&
                   this.skippedTokens[0].owningToken === currentOwner) {
                leadingTrivia = leadingTrivia || [];

                var skippedToken = this.skippedTokens.shift().skippedToken;
                this.addSkippedTokenTo(skippedToken, leadingTrivia);

                currentOwner = skippedToken;
            }

            if (leadingTrivia !== null) {
                // Note: add the existing trivia *after* the skipped tokens.
                this.addTriviaTo(token.leadingTrivia(), leadingTrivia);
            }

            // Now find the skipped tokens that were assigned to this token.  Consume skipped tokens
            // as long as they belong to this token (or to a skipped token that follows it).
            currentOwner = token;

            var trailingTrivia: ISyntaxTrivia[] = null;
            while (this.skippedTokens.length > 0 &&
                   this.skippedTokens[0].owningToken === currentOwner) {
                // Initialize the list of trailing trivia to the trailing trivia of the token if it
                // has any.  This way any skipped tokens will go after the existing trivia.
                trailingTrivia = trailingTrivia || token.trailingTrivia().toArray();

                var skippedToken = this.skippedTokens.shift().skippedToken;
                this.addSkippedTokenTo(skippedToken, trailingTrivia);

                // Update currentToken.  That way if the next skipped token has it as the owner,
                // then we'll consume that as well.
                currentOwner = skippedToken;
            }

            var result = token;

            if (leadingTrivia !== null) {
                result = result.withLeadingTrivia(Syntax.triviaList(leadingTrivia));
            }

            if (trailingTrivia !== null) {
                result = result.withTrailingTrivia(Syntax.triviaList(trailingTrivia));
            }

            return result;
        }

        private addTriviaTo(list: ISyntaxTriviaList, array: ISyntaxTrivia[]): void {
            for (var i = 0, n = list.count(); i < n; i++) {
                array.push(list.syntaxTriviaAt(i));
            }
        }

        private addSkippedTokenTo(skippedToken: ISyntaxToken, array: ISyntaxTrivia[]): void {
            // Debug.assert(skippedToken.text().length > 0);

            // first, add the leading trivia of the skipped token to the array
            this.addTriviaTo(skippedToken.leadingTrivia(), array);

            // now, add the text of the token as skipped text to the trivia array.
            array.push(Syntax.trivia(SyntaxKind.SkippedTextTrivia, skippedToken.text()));

            // Finally, add the trailing trivia of the skipped token to the trivia array.
            this.addTriviaTo(skippedToken.trailingTrivia(), array);
        }
    }

    // Allows one to easily move over a syntax tree.  Used during incremental parsing to move over
    // the previously parsed tree to provide nodes and tokens that can be reused when parsing the
    // updated text.
    class SyntaxCursor {
        private _elements: ISyntaxElement[] = [];
        private _index: number = 0;
        private _pinCount: number = 0;

        constructor(sourceUnit: SourceUnitSyntax) {
            sourceUnit.insertChildrenInto(this._elements, 0);
        }

        public isFinished(): bool {
            return this._index === this._elements.length;
        }

        public currentElement(): ISyntaxElement {
            if (this.isFinished()) {
                return null;
            }

            return this._elements[this._index];
        }

        public currentNode(): SyntaxNode {
            var element = this.currentElement();
            return element !== null && element.isNode() ? <SyntaxNode>element : null;
        }

        public moveToFirstChild() {
            if (this.isFinished()) {
                return;
            }

            var element = this._elements[this._index];
            if (element.isToken()) {
                // If we're already on a token, there's nothing to do.
                return;
            }

            // Otherwise, break the node we're pointing at into its children.  We'll then be 
            // pointing at the first child
            var node = <SyntaxNode>element;

            // Remove the item that we're pointing at.
            this._elements.splice(this._index, 1);

            // And add its children into the position it was at.
            node.insertChildrenInto(this._elements, this._index);
        }

        public moveToNextSibling() {
            if (this.isFinished()) {
                return;
            }

            if (this._pinCount > 0) {
                // If we're currently pinned, then just move our index forward.  We'll then be 
                // pointing at the next sibling.
                this._index++;
                return;
            }

            // if we're not pinned, we better be pointed at the first item in the list.
            // Debug.assert(this._index === 0);

            // Just shift ourselves over so we forget the current element we're pointing at and 
            // we're pointing at the next slibing.
            this._elements.shift();
        }

        public getAndPinCursorIndex(): number {
            this._pinCount++;
            return this._index;
        }

        public releaseAndUnpinCursorIndex(index: number) {
            // this._index = index;

            // Debug.assert(this._pinCount > 0);
            this._pinCount--;
            if (this._pinCount === 0) {
                // The first pin was given out at index 0.  So we better be back at index 0.
                // Debug.assert(this._index === 0);
            }
        }

        public rewindToPinnedCursorIndex(index: number): void {
            // Debug.assert(index >= 0 && index <= this._elements.length);
            // Debug.assert(this._pinCount > 0);
            this._index = index;
        }

        public pinCount(): number {
            return this._pinCount;
        }

        private moveToFirstToken(): void {
            var element: ISyntaxElement;

            while (!this.isFinished()) {
                var element = this.currentElement();
                if (element.isNode()) {
                    this.moveToFirstChild();
                    continue;
                }

                // Debug.assert(element.isToken());
                return;
            }
        }

        public currentToken(): ISyntaxToken {
            this.moveToFirstToken();
            if (this.isFinished()) {
                return null;
            }

            var element = this.currentElement();

            // Debug.assert(element.isToken());
            return <ISyntaxToken>element;
        }

        public peekToken(n: number): ISyntaxToken {
            this.moveToFirstToken();
            var pin = this.getAndPinCursorIndex();
            try {
                for (var i = 0; i < n; i++) {
                    this.moveToNextSibling();
                    this.moveToFirstToken();
                }

                return this.currentToken();
            }
            finally {
                this.rewindToPinnedCursorIndex(pin);
                this.releaseAndUnpinCursorIndex(pin);
            }
        }
    }
    
    // Interface that represents the source that the parser pulls tokens from.  Essentially, this 
    // is the interface that the parser needs an underlying scanner to provide.  This allows us to
    // separate out "what" the parser does with the tokens it retrieves versus "how" it obtains
    // the tokens.  i.e. all the logic for parsing language constructs sits in ParserImpl, while 
    // all the logic for retrieving tokens sits in individual IParserSources.
    //
    // By separating out this interface, we also make incremental parsing much easier.  Instead of
    // having the parser directly sit on top of the scanner, we sit it on this abstraction.  Then
    // in incremental scenarios, we can use the IncrementalParserSource to pull tokens (or even 
    // full nodes) from the previous tree when possible.  Of course, we'll still end up using a 
    // scanner for new text.  But that can all happen inside the source, with none of the logic in
    // the parser having to be aware of it.
    //
    // In general terms, a parser source represents a position within a text.  At that position, 
    // one can ask for the 'currentToken' that the source is pointing at.  The 'previousToken' that
    // precedes this token (generally used for automatic semicolon insertion, and other minor 
    // parsing decisions).  Then, once the parser consumes that token it can ask the source to
    // 'moveToNextToken'.
    //
    // Additional special abilities include:
    //  1) Being able to peek an arbitrary number of tokens ahead efficiently.
    //  2) Being able to retrieve fully parsed nodes from the source, not just tokens. This happens
    //     in incremental scenarios when the source is certain that the node is completley safe to
    //     reuse.
    //  3) Being able to get a 'rewind point' to the current location.  This allows the parser to
    //     speculatively parse as much as it wants, and then reset itself back to that point, 
    //     ensuring that no state changes that occurred after getting the 'rewing point' are 
    //     observable.
    //  4) Being able to reinterpret the current token being pointed at as a regular expression 
    //     token.  This is necessary as the scanner does not have enough information to correctly
    //     distinguish "/" or "/=" as divide tokens, versus "/..../" as a regex token.  If the 
    //     parser sees a "/" in a place where a divide is not allowed, but a regex would be, then
    //     it can call into the source and ask if a regex token could be returned instead.  The 
    //     sources are smart enough to do that and not be affected by any additional work they may
    //     have done when they originally scanned that token.
    interface IParserSource {
        // The absolute index that the current token starts at.  'currentToken' and 'currentNode'
        // have their fullStart at this position.  previousToken has it's fullEnd at this position.
        absolutePosition(): number;

        // The token that comes before the 'currentToken' that hte source is pointing at. Initially
        // null. 
        previousToken(): ISyntaxToken;

        // The current syntax node the source is pointing at.  Only available in incremental settings.
        // The source can point at a node if that node doesn't intersect any of the text changes in
        // the file, and doesn't contain certain unacceptable constructs.  For example, if the node
        // contains skipped text, then it will not be reused.
        currentNode(): SyntaxNode;

        // The current token the source is pointing at.
        currentToken(): ISyntaxToken;

        // The current token reinterpretted as a regex token.  This must only be called when the 
        // source is pointing at a "/" or "/=" token. 
        currentTokenAllowingRegularExpression(): ISyntaxToken;

        // Peek any number of tokens ahead from the current location in source.  peekToken(0) is
        // equivalent to 'currentToken', peekToken(1) is the next token, peekToken(2) the token
        // after that, etc.  If the caller peeks past the end of the text, then EndOfFile tokens
        // will be returned.
        peekToken(n: number): ISyntaxToken;

        // Called to move the source to the next node or token once the parser has consumed the 
        // current one.
        moveToNextNode(): void;
        moveToNextToken(): void;

        // Gets a rewind point that the parser can use to move back to after it speculatively 
        // parses something.  The source guarantees that if the parser calls 'rewind' with that 
        // point that it will be mostly in the same state that it was in when 'getRewindPoint'
        // was called.  i.e. calling currentToken, peekToken, tokenDiagnostics, etc. will result
        // in the same values.  One allowed exemption to this is 'currentNode'.  If a rewind point
        // is requested and rewound, then getting the currentNode may not be possible.  However,
        // as this is purely a performance optimization, it will not affect correctness.
        //
        // Note: that rewind points are not free (but they should also not be too expensive).  So
        // they should be used judiciously.  While a rewind point is held by the parser, the source
        // is not free to do things that it would normally do.  For example, it cannot throw away
        // tokens that it has scanned on or after the rewind point as it must keep them alive for
        // the parser to move back to.
        //
        // Rewind points also work in a stack fashion.  The first rewind point given out must be
        // the last rewind point released.  Do not release them out of order, or bad things can 
        // happen.
        //
        // Do *NOT* forget to release a rewind point.  Always put them in a finally block to ensure
        // that they are released.  If they are not released, things will still work, you will just
        // consume far more memory than necessary.
        getRewindPoint(): IParserRewindPoint;

        // Rewinds the source to the position and state it was at when this rewind point was created.
        // This does not need to be called if the parser decides it does not need to rewind.  For 
        // example, the parser may speculatively parse out a lambda expression when it sees something
        // ambiguous like "(a = b, c = ...".  If it succeeds parsing that as a lambda, then it will
        // just return that result.  However, if it fails *then* it will rewind and try it again as
        // a parenthesized expression.  
        rewind(rewindPoint: IParserRewindPoint): void;

        // Called when the parser is done speculative parsing and no longer needs the rewind point.
        // Must be called for every rewing point retrived.
        releaseRewindPoint(rewindPoint: IParserRewindPoint): void;

        // Retrieves the diagnostics generated while the source was producing nodes or tokens. 
        // Should generally only be called after the document has been completely parsed.
        tokenDiagnostics(): SyntaxDiagnostic[];
    }

    // Parser source used in batch scenarios.  Directly calls into an underlying text scanner and
    // supports none of the functionality to reuse nodes.  Good for when you just want want to do
    // a single parse of a file.
    class NormalParserSource implements IParserSource {
        // The sliding window that we store tokens in.
        private slidingWindow: SlidingWindow;

        // The scanner we're pulling tokens from.
        private scanner: Scanner;

        // The previous token to the current token.  Set when we advance to the next token.
        private _previousToken: ISyntaxToken = null;

        // The absolute position we're at in the text we're reading from.
        private _absolutePosition: number = 0;

        // The diagnostics we get while scanning.  Note: this never gets rewound when we do a normal
        // rewind.  That's because rewinding doesn't affect the tokens created.  It only affects where
        // in the token stream we're pointing at.  However, it will get modified if we we decide to
        // reparse a / or /= as a regular expression.
        private _tokenDiagnostics: SyntaxDiagnostic[] = [];

        // Pool of rewind points we give out if the parser needs one.
        private rewindPointPool: IParserRewindPoint[] = [];
        private rewindPointPoolCount = 0;

        constructor(text: IText,
                    languageVersion: LanguageVersion,
                    stringTable: Collections.StringTable) {
            this.slidingWindow = new SlidingWindow(this, /*defaultWindowSize:*/ 32, null);
            this.scanner = new Scanner(text, languageVersion, stringTable);
        }

        private currentNode(): SyntaxNode {
            // The normal parser source never returns nodes.  They're only returned by the 
            // incremental parser source.
            return null;
        }

        private moveToNextNode(): void {
            // Should never get called.
            throw Errors.invalidOperation();
        }

        public absolutePosition() {
            return this._absolutePosition;
        }

        public previousToken(): ISyntaxToken {
            return this._previousToken;
        }

        public tokenDiagnostics(): SyntaxDiagnostic[] {
            return this._tokenDiagnostics;
        }

        private getOrCreateRewindPoint(): IParserRewindPoint {
            if (this.rewindPointPoolCount === 0) {
                return <IParserRewindPoint>{};
            }

            this.rewindPointPoolCount--;
            var result = this.rewindPointPool[this.rewindPointPoolCount];
            this.rewindPointPool[this.rewindPointPoolCount] = null;
            return result;
        }

        public getRewindPoint(): IParserRewindPoint {
            var slidingWindowIndex = this.slidingWindow.getAndPinAbsoluteIndex();

            var rewindPoint = this.getOrCreateRewindPoint();

            rewindPoint.slidingWindowIndex = slidingWindowIndex;
            rewindPoint.previousToken = this._previousToken;
            rewindPoint.absolutePosition = this._absolutePosition;

            rewindPoint.pinCount = this.slidingWindow.pinCount();

            return rewindPoint;
        }

        public isPinned(): bool {
            return this.slidingWindow.pinCount() > 0;
        }

        public rewind(rewindPoint: IParserRewindPoint): void {
            this.slidingWindow.rewindToPinnedIndex(rewindPoint.slidingWindowIndex);

            this._previousToken = rewindPoint.previousToken;
            this._absolutePosition = rewindPoint.absolutePosition;
        }

        public releaseRewindPoint(rewindPoint: IParserRewindPoint): void {
            // Debug.assert(this.slidingWindow.pinCount() === rewindPoint.pinCount);
            this.slidingWindow.releaseAndUnpinAbsoluteIndex((<any>rewindPoint).absoluteIndex);

            this.rewindPointPool[this.rewindPointPoolCount] = rewindPoint;
            this.rewindPointPoolCount++;
        }

        private fetchMoreItems(allowRegularExpression: bool, sourceIndex: number, window: any[], destinationIndex: number, spaceAvailable: number): number {
            // Assert disabled because it is actually expensive enugh to affect perf.
            // // Debug.assert(spaceAvailable > 0);
            window[destinationIndex] = this.scanner.scan(this._tokenDiagnostics, allowRegularExpression);
            return 1;
        }

        public peekToken(n: number): ISyntaxToken {
            return this.slidingWindow.peekItemN(n);
        }

        public moveToNextToken(): void {
            var currentToken = this.currentToken();
            this._absolutePosition += currentToken.fullWidth();
            this._previousToken = currentToken;

            this.slidingWindow.moveToNextItem();
        }

        public currentToken(): ISyntaxToken {
            return this.slidingWindow.currentItem(/*allowRegularExpression:*/ false);
        }

        private removeDiagnosticsOnOrAfterPosition(position: number): void {
            // walk backwards, removing any diagnostics that came after the the current token's
            // full start position.
            var tokenDiagnosticsLength = this._tokenDiagnostics.length;
            while (tokenDiagnosticsLength > 0) {
                var diagnostic = this._tokenDiagnostics[tokenDiagnosticsLength - 1];
                if (diagnostic.position() >= position) {
                    tokenDiagnosticsLength--;
                }
                else {
                    break;
                }
            }

            this._tokenDiagnostics.length = tokenDiagnosticsLength;
        }

        public resetToPosition(absolutePosition: number, previousToken: ISyntaxToken): void {
            this._absolutePosition = absolutePosition;
            this._previousToken = previousToken;

            // First, remove any diagnostics that came after this position.
            this.removeDiagnosticsOnOrAfterPosition(absolutePosition);

            // Now, tell our sliding window to throw away all tokens after this position as well.
            this.slidingWindow.disgardAllItemsFromCurrentIndexOnwards();

            // Now tell the scanner to reset its position to this position as well.  That way
            // when we try to scan the next item, we'll be at the right location.
            this.scanner.setAbsoluteIndex(absolutePosition);
        }

        public currentTokenAllowingRegularExpression(): ISyntaxToken {
            // We better be on a divide token right now.
            // Debug.assert(SyntaxFacts.isAnyDivideToken(this.currentToken().tokenKind));

            // First, we're going to rewind all our data to the point where this / or /= token started.
            // That's because if it does turn out to be a regular expression, then any tokens or token 
            // diagnostics we produced after the original / may no longer be valid.  This would actually
            // be a  fairly expected case.  For example, if you had:  / ... gibberish ... /, we may have 
            // produced several diagnostics in the process of scanning the tokens after the first / as
            // they may not have been legal javascript okens.
            //
            // We also need to remove all the tokens we've gotten from the slash and onwards.  They may
            // not have been what the scanner would have produced if it decides that this is actually
            // a regular expresion.
            this.resetToPosition(this._absolutePosition, this._previousToken);

            // Now actually fetch the token again from the scanner. This time let it know that it
            // can scan it as a regex token if it wants to.
            var token = this.slidingWindow.currentItem(/*allowRegularExpression:*/ true);

            // We have better gotten some sort of regex token.  Otherwise, something *very* wrong has
            // occurred.
            // Debug.assert(SyntaxFacts.isAnyDivideOrRegularExpressionToken(token.tokenKind));

            return token;
        }
    }

    // Parser source used in incremental scenarios. This parser source wraps an old tree, text 
    // change and new text, and uses all three to provide nodes and tokens to the parser.  In
    // general, nodes from the old tree are returned as long as they do not intersect with the text 
    // change.  Then, once the text change is reached, tokens from the old tree are returned as 
    // long as they do not intersect with the text change.  Then, the text that is actually changed
    // will be scanned using a normal scanner.  Then, once the new text is scanned, the source will
    // attempt to sync back up with nodes or tokens that started where the new tokens end. Once it
    // can do that, then all subsequent data will come from teh original text.
    //
    // This allows for an enormous amount of tree reuse in common scenarios.  Situations that 
    // prevent this level of reuse include substantially destructive operations like introducing
    // "/*" without a "*/" nearby to terminate the comment.
    class IncrementalParserSource implements IParserSource {
        // The underlying parser source that we will use to scan tokens from any new text, or any 
        // tokens from the old tree that we decide we can't use for any reason.  We will also 
        // continue scanning tokens from this source until we've decided that we're resynchronized
        // and can read in subsequent data from the old tree.
        //
        // This parser source also keeps track of the absolute position in the text that we're in,
        // the previous token, and any token diagnostics produced.  That way we dont' have to track
        // that ourselves.
        private _normalParserSource: NormalParserSource;

        // The range of text in the *original* text that was changed, and the new length of it after
        // the change.
        private _changeRange: TextChangeRange;

        // This number represents how our position in the old tree relates to the position we're 
        // pointing at in the new text.  If it is 0 then our positions are in sync and we can read
        // nodes or tokens from the old tree.  If it is non-zero, then our positions are not in 
        // sync and we cannot use nodes or tokens from the old tree.
        //
        // Now, changeDelta could be negative or positive.  Negative means 'the position we're at
        // in the original tree is behind the position we're at in the text'.  In this case we 
        // keep throwing out old nodes or tokens (and thus move forward in the original tree) until
        // changeDelta becomes 0 again or positive.  If it becomes 0 then we are resynched and can
        // read nodes or tokesn from the tree.
        //
        // If changeDelta is positive, that means the current node or token we're pointing at in 
        // the old tree is at a further ahead position than the position we're pointing at in the
        // new text.  In this case we have no choice but to scan tokens from teh new text.  We will
        // continue to do so until, again, changeDelta becomes 0 and we've resynced, or change delta
        // becomes negative and we need to skip nodes or tokes in the original tree.
        private _changeDelta: number = 0;

        // The cursor we use to navigate through and retrieve nodes and tokens from the old tree.
        private _oldSourceUnitCursor: SyntaxCursor;

        constructor(oldSourceUnit: SourceUnitSyntax,
                    changeRanges: TextChangeRange[],
                    newText: IText,
                    languageVersion: LanguageVersion,
                    stringTable: Collections.StringTable) {
            this._oldSourceUnitCursor = new SyntaxCursor(oldSourceUnit);

            // In general supporting multiple individual edits is just not that important.  So we 
            // just collapse this all down to a single range to make the code here easier.  The only
            // time this could be problematic would be if the user made a ton of discontinuous edits.
            // For example, doing a column select on a *large* section of a code.  If this is a 
            // problem, we can always update this code to handle multiple changes.
            this._changeRange = IncrementalParserSource.extendToAffectedRange(
                TextChangeRange.collapse(changeRanges),
                oldSourceUnit);

            // The old tree's length, plus whatever length change was caused by the edit better 
            // equal the new text's length!
            // Debug.assert((oldSourceUnit.fullWidth() - this._changeRange.span().length() + this._changeRange.newLength()) === newText.length());

            // Set up a scanner so that we can scan tokens out of the new text.
            this._normalParserSource = new NormalParserSource(newText, languageVersion, stringTable);
        }

        private static extendToAffectedRange(changeRange:TextChangeRange,
                                             sourceUnit: SourceUnitSyntax): TextChangeRange {
            // Consider the following code:
            //      void foo() { /; }
            //
            // If the text changes with an insertion of / just before the semicolon then we end up with:
            //      void foo() { //; }
            //
            // If we were to just use the changeRange a is, then we would not rescan the { token 
            // (as it does not intersect hte actual original change range).  Because an edit may
            // change the token touching it, we actually need to look back *at least* one token so
            // that the prior token sees that change.  
            //
            // Note: i believe (outside of regex tokens) max lookahead is just one token for 
            // TypeScript.  However, if this turns out to be wrong, we may have to increase how much
            // futher we look back. 
            //
            // Note: lookahead handling for regex characters is handled specially in during 
            // incremental parsing, and does not need to be handled here.

            if (true) {
                //return changeRange;
            }

            var maxLookahead = 1;

            var start = changeRange.span().start();
            // var syntaxInformationMap = SyntaxInformationMap.create(sourceUnit);

            // the first iteration aligns us with the change start. subsequent iteration move us to
            // the left by maxLookahead tokens.  We only need to do this as long as we're not at the
            // start of the tree.
            for (var i = 0; start > 0 && i <= maxLookahead; i++)
            {
                var tokenAndFullStart = sourceUnit.findToken(start);
                var token = tokenAndFullStart.token;
                // Debug.assert(token.tokenKind !== SyntaxKind.None);
                // Debug.assert(token.fullWidth() > 0);

                var position = tokenAndFullStart.fullStart;

                start = MathPrototype.max(0, position - 1);
            }

            var finalSpan = TextSpan.fromBounds(start, changeRange.span().end());
            var finalLength = changeRange.newLength() + (changeRange.span().start() - start);
            return new TextChangeRange(finalSpan, finalLength);
        }

        public absolutePosition() {
            return this._normalParserSource.absolutePosition();
        }

        public previousToken() {
            return this._normalParserSource.previousToken();
        }

        private tokenDiagnostics(): SyntaxDiagnostic[] {
            return this._normalParserSource.tokenDiagnostics();
        }

        private getRewindPoint(): IParserRewindPoint {
            // Get a rewind point for our new text reader and for our old source unit cursor.
            var rewindPoint = this._normalParserSource.getRewindPoint();
            var oldSourceUnitCursorIndex = this._oldSourceUnitCursor.getAndPinCursorIndex();

            // Store where we were when the rewind point was created.
            rewindPoint.changeDelta = this._changeDelta;
            rewindPoint.changeRange = this._changeRange;
            rewindPoint.oldSourceUnitCursorIndex = oldSourceUnitCursorIndex;

            // Debug.assert(rewindPoint.pinCount === this._oldSourceUnitCursor.pinCount());

            return rewindPoint;
        }

        private rewind(rewindPoint: IParserRewindPoint): void {
            // Restore our state to the values when the rewind point was created.
            this._changeRange = rewindPoint.changeRange;
            this._changeDelta = rewindPoint.changeDelta;
            this._oldSourceUnitCursor.rewindToPinnedCursorIndex(rewindPoint.oldSourceUnitCursorIndex);

            this._normalParserSource.rewind(rewindPoint);
        }

        private releaseRewindPoint(rewindPoint: IParserRewindPoint): void {
            // Release both the new text reader and the old text cursor.
            this._oldSourceUnitCursor.releaseAndUnpinCursorIndex(rewindPoint.oldSourceUnitCursorIndex);
            this._normalParserSource.releaseRewindPoint(rewindPoint);
        }

        private canReadFromOldSourceUnit() {
            // If we're currently pinned, then do not want to touch the cursor.  If we end up 
            // reading from the old source unit, we'll try to then set the position of the normal
            // parser source.  Doing is unsupported while the underlying source is pinned.
            if (this._normalParserSource.isPinned()) {
                return false;
            }

            // First, try to sync up with the new text if we're behind.
            this.syncCursorToNewTextIfBehind();

            // Now, if we're synced up *and* we're not currently pinned in the new text scanner,
            // then we can read a node from the cursor.  If we're pinned in the scanner then we
            // can't read a node from the cursor because we will mess up the pinned scanner when
            // we try to move it forward past this node.
            return this._changeDelta === 0 &&
                   !this._oldSourceUnitCursor.isFinished();
        }
        
        public currentNode(): SyntaxNode {
            if (this.canReadFromOldSourceUnit()) {
                // Try to read a node.  If we can't then our caller will call back in and just try
                // to get a token.
                return this.tryGetNodeFromOldSourceUnit();
            }

            // Either we were ahead of the old text, or we were pinned.  No node can be read here.
            return null;
        }

        public currentToken(): ISyntaxToken {
            if (this.canReadFromOldSourceUnit()) {
                var token = this.tryGetTokenFromOldSourceUnit();
                if (token !== null) {
                    return token;
                }
            }

            // Either we couldn't read from the old source unit, or we weren't able to successfully
            // get a token from it.  In this case we need to read a token from the underlying text.
            return this._normalParserSource.currentToken();
        }

        public currentTokenAllowingRegularExpression(): ISyntaxToken {
            // Just delegate to the underlying source to handle this.
            return this._normalParserSource.currentTokenAllowingRegularExpression();
        }

        private syncCursorToNewTextIfBehind() {
            while (true) {
                if (this._oldSourceUnitCursor.isFinished()) {
                    // Can't sync up if the cursor is finished.
                    break;
                }

                if (this._changeDelta >= 0) {
                    // Nothing to do if we're synced up or ahead of the text.
                    break;
                }

                // We're behind in the original tree.  Throw out a node or token in an attempt to 
                // catch up to the position we're at in the new text.

                var currentElement = this._oldSourceUnitCursor.currentElement();

                // If we're pointing at a node, and that node's width is less than our delta,
                // then we can just skip that node.  Otherwise, if we're pointing at a node
                // whose width is greater than the delta, then crumble it and try again.
                // Otherwise, we must be pointing at a token.  Just skip it and try again.
                    
                if (currentElement.isNode() && (currentElement.fullWidth() > Math.abs(this._changeDelta))) {
                    // We were pointing at a node whose width was more than changeDelta.  Crumble the 
                    // node and try again.  Note: we haven't changed changeDelta.  So the callers loop
                    // will just repeat this until we get to a node or token that we can skip over.
                    this._oldSourceUnitCursor.moveToFirstChild();
                }
                else {
                    this._oldSourceUnitCursor.moveToNextSibling();

                    // Get our change delta closer to 0 as we skip past this item.
                    this._changeDelta += currentElement.fullWidth();

                    // If this was a node, then our changeDelta is 0 or negative.  If this was a 
                    // token, then we could still be negative (and we have to read another token),
                    // we could be zero (we're done), or we could be positive (we've moved ahead
                    // of the new text).  Only if we're negative will we continue looping.
                }
            }

            // At this point, we must be either:
            //   a) done with the cursor
            //   b) (ideally) caught up to the new text position.
            //   c) ahead of the new text position.
            // In case 'b' we can try to reuse a node from teh old tree.
            // Debug.assert(this._oldSourceUnitCursor.isFinished() || this._changeDelta >= 0);
        }

        private intersectsWithChangeRangeSpan(start: number, length: number) {
            return this._changeRange !== null && this._changeRange.span().intersectsWith(start, length);
        }

        private tryGetNodeFromOldSourceUnit(): SyntaxNode {
            // Debug.assert(this.canReadFromOldSourceUnit());

            // Keep moving the cursor down to the first node that is safe to return.  A node is 
            // safe to return if:
            //  a) it does not intersect the changed text.
            //  b) it does not contain skipped text.
            //  c) it does not have any zero width tokens in it.
            //  d) it does not have a regex token in it.
            //
            // TODO: we should also only be able to get a node if we're in the same 'strict' 
            // context we were in when we parsed the node.
            while (true) {
                var node = this._oldSourceUnitCursor.currentNode();
                if (node === null) {
                    // Couldn't even read a node, nothing to return.
                    return null;
                }

                if (!this.intersectsWithChangeRangeSpan(this.absolutePosition(), node.fullWidth())) {
                    // Didn't intersect with the change range.
                    if (!node.hasSkippedText() &&
                        !node.hasZeroWidthToken() &&
                        !node.hasRegularExpressionToken()) {

                        // Didn't contain anything that would make it unusable.  Awesome.  This is
                        // a node we can reuse.
                        return node;
                    }
                }

                // We couldn't use currentNode. Try to move to its first child (in case that's a 
                // node).  If it is we can try using that.  Otherwise we'll just bail out in the
                // next iteration of the loop.
                this._oldSourceUnitCursor.moveToFirstChild();
            }
        }

        private canReuseTokenFromOldSourceUnit(position: number, token: ISyntaxToken): bool {
            // A token is safe to return if:
            //  a) it does not intersect the changed text.
            //  b) it does not contain skipped text.
            //  c) it is not zero width.
            //  d) it is not a regex token.
            //
            // NOTE: It is safe to get a token regardless of what our strict context was/is.  That's 
            // because the strict context doesn't change what tokens are scanned, only how the 
            // parser reacts to them.

            if (token !== null) {
                if (!this.intersectsWithChangeRangeSpan(position, token.fullWidth())) {
                    // Didn't intersect with the change range.
                    if (!token.hasSkippedText() &&
                        token.width() > 0 &&
                        !SyntaxFacts.isAnyDivideOrRegularExpressionToken(token.tokenKind)) {

                        // Didn't contain anything that would make it unusable.  Awesome.  This is
                        // a token we can reuse.
                        return true;
                    }
                }
            }

            return false;
        }

        private tryGetTokenFromOldSourceUnit(): ISyntaxToken {
            // Debug.assert(this.canReadFromOldSourceUnit());

            // get the current token that the cursor is pointing at.
            var token = this._oldSourceUnitCursor.currentToken();

            return this.canReuseTokenFromOldSourceUnit(this.absolutePosition(), token) 
                ? token : null;
        }

        public peekToken(n: number): ISyntaxToken {
            if (this.canReadFromOldSourceUnit()) {
                var token = this.tryPeekTokenFromOldSourceUnit(n);
                if (token !== null) {
                    return token;
                }
            }

            // Couldn't peek this far in the old tree.  Get the token from the new text.
            return this._normalParserSource.peekToken(n);
        }

        private tryPeekTokenFromOldSourceUnit(n: number): ISyntaxToken {
            // Debug.assert(this.canReadFromOldSourceUnit());

            // In order to peek the 'nth' token we need all the tokens up to that point.  That way
            // we know we know position that the nth token is at.  The position is necessary so 
            // that we can test if this token (or any that precede it cross the change range).
            var currentPosition = this.absolutePosition();
            for (var i = 0; i < n; i++) {
                var interimToken = this._oldSourceUnitCursor.peekToken(i);
                if (!this.canReuseTokenFromOldSourceUnit(currentPosition, interimToken)) {
                    return null;
                }

                currentPosition += interimToken.fullWidth();
            }

            var token = this._oldSourceUnitCursor.peekToken(n);
            return this.canReuseTokenFromOldSourceUnit(currentPosition, token) 
                ? token : null;
        }

        private moveToNextNode(): void {
            // A node could have only come from the old source unit cursor.  Update it and our 
            // current state.
            // Debug.assert(this._changeDelta === 0);

            // Get the current node we were pointing at, and move to the next element.
            var currentElement = this._oldSourceUnitCursor.currentElement();
            var currentNode = this._oldSourceUnitCursor.currentNode();

            // We better still be pointing at the node.
            // Debug.assert(currentElement === currentNode);
            this._oldSourceUnitCursor.moveToNextSibling();

            // Update the underlying source with where it should now be currently pointing, and 
            // what the previous token is before that position.
            var absolutePosition = this.absolutePosition() + currentNode.fullWidth();
            var previousToken = currentNode.lastToken();
            this._normalParserSource.resetToPosition(absolutePosition, previousToken);

            // Debug.assert(previousToken !== null);
            // Debug.assert(previousToken.width() > 0);

            if (this._changeRange !== null) {
                // If we still have a change range, then this node must have ended before the 
                // change range starts.  Thus, we don't need to call 'skipPastChanges'.
                // Debug.assert(this.absolutePosition() < this._changeRange.span().start());
            }
        }

        private moveToNextToken(): void {
            // This token may have come from the old source unit, or from the new text.  Handle
            // both accordingly.
            var currentToken = this.currentToken();

            if (this._oldSourceUnitCursor.currentToken() === currentToken) {
                // The token came from the old source unit.  So our tree and text must be in sync.
                // Debug.assert(this._changeDelta === 0);

                // Move the cursor past this token.
                this._oldSourceUnitCursor.moveToNextSibling();

                // Debug.assert(!this._normalParserSource.isPinned());
                
                // Update the underlying source with where it should now be currently pointing, and 
                // what the previous token is before that position.  We don't need to do this when
                // the token came from the new text as the source will automatically be placed in
                // the right position.
                var absolutePosition = this.absolutePosition() + currentToken.fullWidth();
                var previousToken = currentToken;
                this._normalParserSource.resetToPosition(absolutePosition, previousToken);

                // Debug.assert(previousToken !== null);
                // Debug.assert(previousToken.width() > 0);

                if (this._changeRange !== null) {
                    // If we still have a change range, then this token must have ended before the 
                    // change range starts.  Thus, we don't need to call 'skipPastChanges'.
                    // Debug.assert(this.absolutePosition() < this._changeRange.span().start());
                }
            }
            else {
                // the token came from the new text.  We have to update our delta appropriately.
                this._changeDelta -= currentToken.fullWidth();

                // Move our underlying source forward.
                this._normalParserSource.moveToNextToken();

                // Because we read a token from the new text, we may have moved ourselves past the
                // change range.  If we did, then we may also have to update our change delta to
                // compensate for the length change between the old and new text.
                if (this._changeRange !== null) {
                    // var changeEndInNewText = this._changeRange.span().start() + this._changeRange.newLength();
                    if (this.absolutePosition() > this._changeRange.span().end()) {
                        this._changeDelta += this._changeRange.newLength() - this._changeRange.span().length();
                        this._changeRange = null;
                    }
                }
            }
        }
    }

    // Contains the actual logic to parse typescript/javascript.  This is the code that generally
    // represents the logic necessary to handle all the language grammar constructs.  When the 
    // language changes, this should generally only be the place necessary to fix up.
    class ParserImpl {
        // Underlying source where we pull nodes and tokens from.
        private source: IParserSource;

        // Parsing options.
        private options: ParseOptions;

        // TODO: do we need to store/restore this when speculative parsing?  I don't think so.  The
        // parsing logic already handles storing/restoring this and should work properly even if we're
        // speculative parsing.
        private listParsingState: ListParsingState = 0;

        // Whether or not we are in strict parsing mode.  All that changes in strict parsing mode is
        // that some tokens that would be considered identifiers may be considered keywords.  When 
        // rewinding, we need to store and restore this as the mode may have changed.
        //
        // TODO: do we need to store/restore this when speculative parsing?  I don't think so.  The
        // parsing logic already handles storing/restoring this and should work properly even if we're
        // speculative parsing.
        private isInStrictMode: bool = false;

        // Current state of the parser.  If we need to rewind we will store and reset these values as
        // appropriate.

        // Tokens we've decided to skip because they couldn't fit into the current production.  Any
        // tokens that are skipped when speculative parsing need to removed when rewinding.  To do this
        // we store the count of skipped tokens when we start speculative parsing.  And if we rewind,
        // we restore this to the same count that we started at.
        private skippedTokens: SkippedToken[] = [];

        // Diagnostics created when parsing invalid code.  Any diagnosics created when speculative 
        // parsing need to removed when rewinding.  To do this we store the count of diagnostics when 
        // we start speculative parsing.  And if we rewind, we restore this to the same count that we 
        // started at.
        private diagnostics: SyntaxDiagnostic[] = [];

        private factory: Syntax.IFactory = Syntax.normalModeFactory;

        constructor(source: IParserSource, options?: ParseOptions) {
            this.source = source;
            this.options = options;
        }

        private getRewindPoint(): IParserRewindPoint {
            var rewindPoint = this.source.getRewindPoint();

            rewindPoint.diagnosticsCount = this.diagnostics.length;
            rewindPoint.skippedTokensCount = this.skippedTokens.length;

            // Values we keep around for debug asserting purposes.
            rewindPoint.isInStrictMode = this.isInStrictMode;
            rewindPoint.listParsingState = this.listParsingState;

            return rewindPoint;
        }

        private rewind(rewindPoint: IParserRewindPoint): void {
            this.source.rewind(rewindPoint);

            this.diagnostics.length = rewindPoint.diagnosticsCount;
            this.skippedTokens.length = rewindPoint.skippedTokensCount;
        }

        private releaseRewindPoint(rewindPoint: IParserRewindPoint): void {
            // Debug.assert(this.listParsingState === rewindPoint.listParsingState);
            // Debug.assert(this.isInStrictMode === rewindPoint.isInStrictMode);

            this.source.releaseRewindPoint(rewindPoint);
        }

        private currentTokenStart(): number {
            return this.source.absolutePosition() + this.currentToken().leadingTriviaWidth();
        }

        private previousTokenStart(): number {
            if (this.previousToken() === null) {
                return 0;
            }

            return this.source.absolutePosition() -
                   this.previousToken().fullWidth() +
                   this.previousToken().leadingTriviaWidth();
        }

        private previousTokenEnd(): number {
            if (this.previousToken() === null) {
                return 0;
            }

            return this.previousTokenStart() + this.previousToken().width();
        }

        private currentNode(): SyntaxNode {
            var node = this.source.currentNode();

            // We can only reuse a node if it was parsed under the same strict mode that we're 
            // currently in.  i.e. if we originally parsed a node in non-strict mode, but then
            // the user added 'using strict' at hte top of the file, then we can't use that node
            // again as the presense of strict mode may cause us to parse the tokens in the file
            // differetly.
            //
            // Note: we *can* reuse tokens when the strict mode changes.  That's because tokens
            // are unaffected by strict mode.  It's just the parser will decide what to do with it
            // differently depending on what mode it is in.
            if (node === null || node.parsedInStrictMode() !== this.isInStrictMode) {
                return null;
            }

            return node;
        }

        private currentToken(): ISyntaxToken {
            return this.source.currentToken();
        }

        private currentTokenAllowingRegularExpression(): ISyntaxToken {
            return this.source.currentTokenAllowingRegularExpression();
        }

        private peekToken(n: number): ISyntaxToken {
            return this.source.peekToken(n);
        }

        private eatAnyToken(): ISyntaxToken {
            var token = this.currentToken();
            this.moveToNextToken();
            return token;
        }

        private moveToNextToken(): void {
            this.source.moveToNextToken();
        }

        private previousToken(): ISyntaxToken {
            return this.source.previousToken();
        }

        private eatNode(): SyntaxNode {
            var node = this.source.currentNode();
            this.source.moveToNextNode();
            return node;
        }

        //this method is called very frequently
        //we should keep it simple so that it can be inlined.
        private eatToken(kind: SyntaxKind): ISyntaxToken {
            // Assert disabled because it is actually expensive enugh to affect perf.
            // // Debug.assert(SyntaxFacts.isTokenKind(kind))

            var token = this.currentToken();
            if (token.tokenKind === kind) {
                this.moveToNextToken();
                return token;
            }

            //slow part of EatToken(SyntaxKind kind)
            return this.createMissingToken(kind, token);
        }

        // Eats the token if it is there.  Otherwise does nothing.  Will not report errors.
        private tryEatToken(kind: SyntaxKind): ISyntaxToken {
            if (this.currentToken().tokenKind === kind) {
                return this.eatToken(kind);
            }

            return null;
        }

        // Eats the keyword if it is there.  Otherwise does nothing.  Will not report errors.
        private tryEatKeyword(kind: SyntaxKind): ISyntaxToken {
            if (this.currentToken().tokenKind === kind) {
                return this.eatKeyword(kind);
            }

            return null;
        }

        private eatKeyword(kind: SyntaxKind): ISyntaxToken {
            // Debug.assert(SyntaxFacts.isTokenKind(kind))

            var token = this.currentToken();
            if (token.tokenKind === kind) {
                this.moveToNextToken();
                return token;
            }

            //slow part of EatToken(SyntaxKind kind)
            return this.createMissingToken(kind, token);
        }

        // An identifier name is basically any word, even if that work is a reserved keyword.  so 
        // both 'foo' and 'return' are identifier names.  Note: a word is always an identifier or 
        // not regardless of the state of the parser.
        private static isIdentifierName(token: ISyntaxToken): bool {
            return SyntaxFacts.isIdentifierName(token.tokenKind);
        }

        // An identifier is basically any word, unless it is a reserved keyword.  so 'foo' is an 
        // identifier and 'return' is not.  Note: a word may or may not be an identifier depending 
        // on the state of the parser.  For example, 'yield' is an identifier *unless* the parser 
        // is in strict mode.
        private isIdentifier(token: ISyntaxToken): bool {
            var tokenKind = token.tokenKind;

            if (tokenKind === SyntaxKind.IdentifierName) {
                return true;
            }

            // Keywords are only identifiers if they're FutureReservedStrictWords and we're in 
            // strict mode.  *Or* if it's a typescript 'keyword'. 
            if (tokenKind >= SyntaxKind.FirstFutureReservedStrictKeyword) {
                if (tokenKind <= SyntaxKind.LastFutureReservedStrictKeyword) {
                    // Could be a keyword or identifier.  It's an identifier if we're not in strict
                    // mode.
                    return !this.isInStrictMode;
                }
                
                // If it's typescript keyword, then it's actually a javascript identifier.
                return tokenKind <= SyntaxKind.LastTypeScriptKeyword;
            }

            // Anything else is not an identifier.
            return false;
        }

        // This method should be called when the grammar calls for an *IdentifierName* and not an
        // *Identifier*.
        private eatIdentifierNameToken(): ISyntaxToken {
            var token = this.currentToken();
            if (ParserImpl.isIdentifierName(token)) {
                this.moveToNextToken();
                return token;
            }

            return this.createMissingToken(SyntaxKind.IdentifierName, token);
        }

        // This method should be called when the grammar calls for an *Identifier* and not an
        // *IdentifierName*.
        private eatIdentifierToken(): ISyntaxToken {
            var token = this.currentToken();
            if (this.isIdentifier(token)) {
                this.moveToNextToken();
                return token;
            }

            return this.createMissingToken(SyntaxKind.IdentifierName, token);
        }

        private canEatAutomaticSemicolon(allowWithoutNewLine: bool): bool {
            var token = this.currentToken();

            // An automatic semicolon is always allowed if we're at the end of the file.
            if (token.tokenKind === SyntaxKind.EndOfFileToken) {
                return true;
            }

            // Or if the next token is a close brace (regardless of which line it is on).
            if (token.tokenKind === SyntaxKind.CloseBraceToken) {
                return true;
            }

            if (allowWithoutNewLine) {
                return true;
            }

            // It is also allowed if there is a newline between the last token seen and the next one.
            if (this.previousToken() !== null && this.previousToken().hasTrailingNewLine()) {
                return true;
            }

            return false;
        }

        private canEatExplicitOrAutomaticSemicolon(allowWithoutNewline: bool): bool {
            var token = this.currentToken();

            if (token.tokenKind === SyntaxKind.SemicolonToken) {
                return true;
            }

            return this.canEatAutomaticSemicolon(allowWithoutNewline);
        }

        private eatExplicitOrAutomaticSemicolon(allowWithoutNewline: bool): ISyntaxToken {
            var token = this.currentToken();

            // If we see a semicolon, then we can definitely eat it.
            if (token.tokenKind === SyntaxKind.SemicolonToken) {
                return this.eatToken(SyntaxKind.SemicolonToken);
            }

            // Check if an automatic semicolon could go here.  If so, synthesize one.  However, if the
            // user has the option set to error on automatic semicolons, then add an error to that
            // token as well.
            if (this.canEatAutomaticSemicolon(allowWithoutNewline)) {
                // Note: the missing token needs to go between real tokens.  So we place it at the 
                // fullstart of the current token.
                var semicolonToken = Syntax.emptyToken(SyntaxKind.SemicolonToken);

                if (!this.options.allowAutomaticSemicolonInsertion()) {
                    // Report the missing semicolon at the end of the *previous* token.

                    this.addDiagnostic(
                        new SyntaxDiagnostic(this.previousTokenEnd(), 0, DiagnosticCode.Automatic_semicolon_insertion_not_allowed, null));
                }

                return semicolonToken;
            }

            // No semicolon could be consumed here at all.  Just call the standard eating function
            // so we get the token and the error for it.
            return this.eatToken(SyntaxKind.SemicolonToken);
        }

        private isKeyword(kind: SyntaxKind): bool {
            if (kind >= SyntaxKind.FirstKeyword) {
                if (kind <= SyntaxKind.LastFutureReservedKeyword) {
                    return true;
                }

                if (this.isInStrictMode) {
                    return kind <= SyntaxKind.LastFutureReservedStrictKeyword;
                }
            }

            return false;
        }

        private createMissingToken(expectedKind: SyntaxKind, actual: ISyntaxToken): ISyntaxToken {
            var diagnostic = this.getExpectedTokenDiagnostic(expectedKind, actual);
            this.addDiagnostic(diagnostic);

            // The missing token will be at the full start of the current token.  That way empty tokens
            // will always be between real tokens and not inside an actual token.
            return Syntax.emptyToken(expectedKind);
        }

        private getExpectedTokenDiagnostic(expectedKind: SyntaxKind, actual: ISyntaxToken): SyntaxDiagnostic {
            var token = this.currentToken();

            // They wanted something specific, just report that that token was missing.
            if (SyntaxFacts.isAnyKeyword(expectedKind) || SyntaxFacts.isAnyPunctuation(expectedKind)) {
                return new SyntaxDiagnostic(this.currentTokenStart(), token.width(), DiagnosticCode._0_expected, [SyntaxFacts.getText(expectedKind)]);
            }
            else {
                // They wanted an identifier.

                // If the user supplied a keyword, give them a specialized message.
                if (actual !== null && SyntaxFacts.isAnyKeyword(actual.tokenKind)) {
                    return new SyntaxDiagnostic(this.currentTokenStart(), token.width(), DiagnosticCode.Identifier_expected__0_is_a_keyword, [SyntaxFacts.getText(actual.tokenKind)]);
                }
                else {
                    // Otherwise just report that an identifier was expected.
                    return new SyntaxDiagnostic(this.currentTokenStart(), token.width(), DiagnosticCode.Identifier_expected, null);
                }
            }

            // throw Errors.notYetImplemented();
        }

        private static getPrecedence(expressionKind: SyntaxKind): ExpressionPrecedence {
            switch (expressionKind) {
                case SyntaxKind.CommaExpression:
                    return ExpressionPrecedence.CommaExpressionPrecedence;

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
                    return ExpressionPrecedence.AssignmentExpressionPrecedence;

                case SyntaxKind.ConditionalExpression:
                    return ExpressionPrecedence.ConditionalExpressionPrecedence;

                case SyntaxKind.LogicalOrExpression:
                    return ExpressionPrecedence.LogicalOrExpressionPrecedence;

                case SyntaxKind.LogicalAndExpression:
                    return ExpressionPrecedence.LogicalAndExpressionPrecedence;

                case SyntaxKind.BitwiseOrExpression:
                    return ExpressionPrecedence.BitwiseOrExpressionPrecedence;

                case SyntaxKind.BitwiseExclusiveOrExpression:
                    return ExpressionPrecedence.BitwiseExclusiveOrExpressionPrecedence;

                case SyntaxKind.BitwiseAndExpression:
                    return ExpressionPrecedence.BitwiseAndExpressionPrecedence;

                case SyntaxKind.EqualsWithTypeConversionExpression:
                case SyntaxKind.NotEqualsWithTypeConversionExpression:
                case SyntaxKind.EqualsExpression:
                case SyntaxKind.NotEqualsExpression:
                    return ExpressionPrecedence.EqualityExpressionPrecedence;

                case SyntaxKind.LessThanExpression:
                case SyntaxKind.GreaterThanExpression:
                case SyntaxKind.LessThanOrEqualExpression:
                case SyntaxKind.GreaterThanOrEqualExpression:
                case SyntaxKind.InstanceOfExpression:
                case SyntaxKind.InExpression:
                    return ExpressionPrecedence.RelationalExpressionPrecedence;

                case SyntaxKind.LeftShiftExpression:
                case SyntaxKind.SignedRightShiftExpression:
                case SyntaxKind.UnsignedRightShiftExpression:
                    return ExpressionPrecedence.ShiftExpressionPrecdence;

                case SyntaxKind.AddExpression:
                case SyntaxKind.SubtractExpression:
                    return ExpressionPrecedence.AdditiveExpressionPrecedence;

                case SyntaxKind.MultiplyExpression:
                case SyntaxKind.DivideExpression:
                case SyntaxKind.ModuloExpression:
                    return ExpressionPrecedence.MultiplicativeExpressionPrecedence;

                case SyntaxKind.PlusExpression:
                case SyntaxKind.NegateExpression:
                case SyntaxKind.BitwiseNotExpression:
                case SyntaxKind.LogicalNotExpression:
                case SyntaxKind.DeleteExpression:
                case SyntaxKind.TypeOfExpression:
                case SyntaxKind.VoidExpression:
                case SyntaxKind.PreIncrementExpression:
                case SyntaxKind.PreDecrementExpression:
                    return ExpressionPrecedence.UnaryExpressionPrecedence;
            }

            throw Errors.invalidOperation();
        }

        private static isDirectivePrologueElement(node: SyntaxNode): bool {
            if (node.kind() === SyntaxKind.ExpressionStatement) {
                var expressionStatement = <ExpressionStatementSyntax>node;
                var expression = expressionStatement.expression();

                if (expression.kind() === SyntaxKind.StringLiteral) {
                    return true;
                }
            }

            return false
        }

        private static isUseStrictDirective(node: SyntaxNode) {
            var expressionStatement = <ExpressionStatementSyntax>node;
            var stringLiteral = <ISyntaxToken>expressionStatement.expression();

            var text = stringLiteral.text();
            return text === '"use strict"' || text === "'use strict'";
        }

        public parseSyntaxTree(): SyntaxTree {
            var sourceUnit = this.parseSourceUnit();

            var allDiagnostics = this.source.tokenDiagnostics().concat(this.diagnostics);
            allDiagnostics.sort((a: SyntaxDiagnostic, b: SyntaxDiagnostic) => a.position() - b.position());

            sourceUnit = this.addSkippedTokensTo(sourceUnit);

            return new SyntaxTree(sourceUnit, allDiagnostics);
        }

        private addSkippedTokensTo(sourceUnit: SourceUnitSyntax): SourceUnitSyntax {
            if (this.skippedTokens.length === 0) {
                // No skipped tokens, nothing to do.
                return sourceUnit;
            }

            return sourceUnit.accept(new SkippedTokensAdder(this.skippedTokens));
        }

        private setStrictMode(isInStrictMode: bool) {
            this.isInStrictMode = isInStrictMode;
            this.factory = isInStrictMode ? Syntax.strictModeFactory : Syntax.normalModeFactory;
        }

        private parseSourceUnit(): SourceUnitSyntax {
            // Note: technically we don't need to save and restore this here.  After all, this the top
            // level parsing entrypoint.  So it will always start as false and be reset to false when the
            // loop ends.  However, for sake of symmetry and consistancy we do this.
            var savedIsInStrictMode = this.isInStrictMode;
            var moduleElements = this.parseSyntaxList(ListParsingState.SourceUnit_ModuleElements, ParserImpl.updateStrictModeState);
            this.setStrictMode(savedIsInStrictMode);

            return this.factory.sourceUnit(moduleElements, this.currentToken());
        }

        private static updateStrictModeState(parser: ParserImpl, items: any[]): void {
            if (!parser.isInStrictMode) {
                // Check if all the items are directive prologue elements.
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (!ParserImpl.isDirectivePrologueElement(item)) {
                        return;
                    }
                }

                parser.setStrictMode(ParserImpl.isUseStrictDirective(items[items.length - 1]));
            }
        }

        private isModuleElement(): bool {
            if (this.currentNode() !== null && this.currentNode().isModuleElement()) {
                return true;
            }

            return this.isImportDeclaration() ||
                   this.isModuleDeclaration() ||
                   this.isInterfaceDeclaration() ||
                   this.isClassDeclaration() ||
                   this.isEnumDeclaration() ||
                   this.isStatement();
        }
        
        private parseModuleElement(): IModuleElementSyntax {
            if (this.currentNode() !== null && this.currentNode().isModuleElement()) {
                return <IModuleElementSyntax>this.eatNode();
            }

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
            else if (this.isStatement()) {
                return this.parseStatement();
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
            return this.currentToken().tokenKind === SyntaxKind.ImportKeyword &&
                   ParserImpl.isIdentifierName(this.peekToken(1)) && 
                   this.peekToken(2).tokenKind === SyntaxKind.EqualsToken;
        }

        private parseImportDeclaration(): ImportDeclarationSyntax {
            // Debug.assert(this.isImportDeclaration());

            var importKeyword = this.eatKeyword(SyntaxKind.ImportKeyword);
            var identifier = this.eatIdentifierToken();
            var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
            var moduleReference = this.parseModuleReference();
            var semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.importDeclaration(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
        }

        private parseModuleReference(): ModuleReferenceSyntax {
            if (this.isExternalModuleReference()) {
                return this.parseExternalModuleReference();
            }
            else {
                return this.parseModuleNameModuleReference();
            }
        }

        private isExternalModuleReference(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ModuleKeyword &&
                   this.peekToken(1).tokenKind === SyntaxKind.OpenParenToken;
        }

        private parseExternalModuleReference(): ExternalModuleReferenceSyntax {
            // Debug.assert(this.isExternalModuleReference());

            var moduleKeyword = this.eatKeyword(SyntaxKind.ModuleKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var stringLiteral = this.eatToken(SyntaxKind.StringLiteral);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

            return this.factory.externalModuleReference(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
        }

        private parseModuleNameModuleReference(): ModuleNameModuleReferenceSyntax {
            var name = this.parseName();
            return this.factory.moduleNameModuleReference(name);
        }

        // NOTE: This will allow all identifier names.  Even the ones that are keywords.
        private parseIdentifierName(): INameSyntax {
            var identifierName = this.eatIdentifierNameToken();
            return identifierName;
        }

        private isName(): bool {
            return this.isIdentifier(this.currentToken());
        }

        private tryParseTypeArgumentList(inExpression: bool): TypeArgumentListSyntax {
            if (this.currentToken().kind() !== SyntaxKind.LessThanToken) {
                return null;
            }

            var rewindPoint = this.getRewindPoint();
            try {
                // We've seen a '<'.  Try to parse it out as a type argument list.
                var lessThanToken = this.eatToken(SyntaxKind.LessThanToken);
                var typeArguments = this.parseSeparatedSyntaxList(ListParsingState.TypeArgumentList_Types);
                var greaterThanToken = this.eatToken(SyntaxKind.GreaterThanToken);

                if (inExpression) {
                    // We're in a context where '<' could be the start of a type argument list, or part
                    // of an arithmetic expression.  We'll presume it's the latter unless we see the '>'
                    // and a following token that guarantees that it's supposed to be a type argument list.
                    if (greaterThanToken.fullWidth() === 0 || !this.canFollowTypeArgumentListInExpression(this.currentToken().kind())) {
                        this.rewind(rewindPoint);
                        return null;
                    }
                }

                return this.factory.typeArgumentList(lessThanToken, typeArguments, greaterThanToken);
            }
            finally {
                this.releaseRewindPoint(rewindPoint);
            }
        }

        private canFollowTypeArgumentListInExpression(kind: SyntaxKind): bool {
            switch (kind) {
                case SyntaxKind.OpenParenToken:                 // foo<x>(   
                case SyntaxKind.DotToken:                       // foo<x>.
                    // These two cases are the only cases where this token can legally follow a
                    // type argument list.  So we definitely want to treat this as a type arg list.

                case SyntaxKind.CloseParenToken:                // foo<x>)
                case SyntaxKind.CloseBracketToken:              // foo<x>]
                case SyntaxKind.ColonToken:                     // foo<x>:
                case SyntaxKind.SemicolonToken:                 // foo<x>;
                case SyntaxKind.CommaToken:                     // foo<x>,
                case SyntaxKind.QuestionToken:                  // foo<x>?
                case SyntaxKind.EqualsEqualsToken:              // foo<x> ==
                case SyntaxKind.EqualsEqualsEqualsToken:        // foo<x> ===
                case SyntaxKind.ExclamationEqualsToken:         // foo<x> !=
                case SyntaxKind.ExclamationEqualsEqualsToken:   // foo<x> !==
                case SyntaxKind.AmpersandAmpersandToken:        // foo<x> &&
                case SyntaxKind.BarBarToken:                    // foo<x> ||
                case SyntaxKind.CaretToken:                     // foo<x> ^
                case SyntaxKind.AmpersandToken:                 // foo<x> &
                case SyntaxKind.BarToken:                       // foo<x> |
                case SyntaxKind.CloseBraceToken:                // foo<x> }
                case SyntaxKind.EndOfFileToken:                 // foo<x>
                    // these cases can't legally follow a type arg list.  However, they're not legal 
                    // expressions either.  The user is probably in the middle of a generic type. So
                    // treat it as such.
                    return true;

                default:
                    // Anything else treat as an expression.
                    return false;
            }
        }

        private parseSimpleName(inExpression: bool): ISimpleNameSyntax {
            var identifier = this.eatIdentifierToken();
            if (identifier.fullWidth() === 0) {
                return identifier;
            }

            var typeArgumentList = this.tryParseTypeArgumentList(inExpression);
            if (typeArgumentList === null) {
                return identifier;
            }

            return this.factory.genericName(identifier, typeArgumentList);
        }

        private parseName(): INameSyntax {
            var isIdentifierName = ParserImpl.isIdentifierName(this.currentToken());

            var current: INameSyntax = this.parseSimpleName(/*inExpression: */ false);

            while (isIdentifierName && this.currentToken().tokenKind === SyntaxKind.DotToken) {
                var dotToken = this.eatToken(SyntaxKind.DotToken);

                isIdentifierName = ParserImpl.isIdentifierName(this.currentToken());
                var simpleName = this.parseSimpleName(/*inExpression: */ false);

                current = this.factory.qualifiedName(current, dotToken, simpleName);
            }

            return current;
        }

        private isEnumDeclaration(): bool {
            if (this.currentToken().tokenKind === SyntaxKind.ExportKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.EnumKeyword) {
                return true;
            }

            return this.currentToken().tokenKind === SyntaxKind.EnumKeyword &&
                   this.isIdentifier(this.peekToken(1));
        }

        private parseEnumDeclaration(): EnumDeclarationSyntax {
            // Debug.assert(this.isEnumDeclaration());

            var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
            var enumKeyword = this.eatKeyword(SyntaxKind.EnumKeyword);
            var identifier = this.eatIdentifierToken();

            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
            var variableDeclarators: ISeparatedSyntaxList = Syntax.emptySeparatedList;

            if (openBraceToken.width() > 0) {
                variableDeclarators = this.parseSeparatedSyntaxList(ListParsingState.EnumDeclaration_VariableDeclarators);
            }

            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

            return this.factory.enumDeclaration(exportKeyword, enumKeyword, identifier,
                openBraceToken, variableDeclarators, closeBraceToken);
        }

        private isClassDeclaration(): bool {
            var token0 = this.currentToken();

            if (token0.tokenKind === SyntaxKind.ExportKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.ClassKeyword) {
                return true;
            }

            if (token0.tokenKind === SyntaxKind.DeclareKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.ClassKeyword) {
                return true;
            }

            return token0.tokenKind === SyntaxKind.ClassKeyword &&
                   this.isIdentifier(this.peekToken(1));
        }

        private parseClassDeclaration(): ClassDeclarationSyntax {
            // Debug.assert(this.isClassDeclaration());

            var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
            var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);

            var classKeyword = this.eatKeyword(SyntaxKind.ClassKeyword);
            var identifier = this.eatIdentifierToken();
            var typeParameterList = this.parseOptionalTypeParameterList();

            var extendsClause: ExtendsClauseSyntax = null;
            if (this.isExtendsClause()) {
                extendsClause = this.parseExtendsClause();
            }

            var implementsClause: ImplementsClauseSyntax = null;
            if (this.isImplementsClause()) {
                implementsClause = this.parseImplementsClause();
            }

            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
            var classElements: ISyntaxList = Syntax.emptyList;

            if (openBraceToken.width() > 0) {
                classElements = this.parseSyntaxList(ListParsingState.ClassDeclaration_ClassElements);
            }

            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
            return this.factory.classDeclaration(
                exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause,
                implementsClause, openBraceToken, classElements, closeBraceToken);
        }

        private isConstructorDeclaration(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ConstructorKeyword;
        }

        private isMemberAccessorDeclaration(): bool {
            var index = 0;

            if (this.currentToken().tokenKind === SyntaxKind.PublicKeyword ||
                this.currentToken().tokenKind === SyntaxKind.PrivateKeyword) {
                index++;
            }

            if (this.peekToken(index).tokenKind === SyntaxKind.StaticKeyword) {
                index++;
            }

            if (this.peekToken(index).tokenKind !== SyntaxKind.GetKeyword &&
                this.peekToken(index).tokenKind !== SyntaxKind.SetKeyword) {
                return false;
            }

            index++;
            return this.isIdentifier(this.peekToken(index));
        }

        private parseMemberAccessorDeclaration(): MemberAccessorDeclarationSyntax {
            // Debug.assert(this.isMemberAccessorDeclaration());

            var publicOrPrivateKeyword: ISyntaxToken = null;
            if (this.currentToken().tokenKind === SyntaxKind.PublicKeyword ||
                this.currentToken().tokenKind === SyntaxKind.PrivateKeyword) {
                publicOrPrivateKeyword = this.eatAnyToken();
            }

            var staticKeyword = this.tryEatKeyword(SyntaxKind.StaticKeyword);

            if (this.currentToken().tokenKind === SyntaxKind.GetKeyword) {
                return this.parseGetMemberAccessorDeclaration(publicOrPrivateKeyword, staticKeyword);
            }
            else if (this.currentToken().tokenKind === SyntaxKind.SetKeyword) {
                return this.parseSetMemberAccessorDeclaration(publicOrPrivateKeyword, staticKeyword);
            }
            else {
                throw Errors.invalidOperation();
            }
        }

        private parseGetMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken,
                                                  staticKeyword: ISyntaxToken): GetMemberAccessorDeclarationSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.GetKeyword);

            var getKeyword = this.eatKeyword(SyntaxKind.GetKeyword);
            var identifier = this.eatIdentifierToken();
            var parameterList = this.parseParameterList();
            var typeAnnotation = this.parseOptionalTypeAnnotation();
            var block = this.parseBlock();

            return this.factory.getMemberAccessorDeclaration(
                publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
        }

        private parseSetMemberAccessorDeclaration(publicOrPrivateKeyword: ISyntaxToken,
                                                  staticKeyword: ISyntaxToken): SetMemberAccessorDeclarationSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.SetKeyword);

            var setKeyword = this.eatKeyword(SyntaxKind.SetKeyword);
            var identifier = this.eatIdentifierToken();
            var parameterList = this.parseParameterList();
            var block = this.parseBlock();

            return this.factory.setMemberAccessorDeclaration(
                publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
        }

        private isMemberVariableDeclaration(): bool {
            var index = 0;

            if (this.currentToken().tokenKind === SyntaxKind.PublicKeyword ||
                this.currentToken().tokenKind === SyntaxKind.PrivateKeyword) {
                index++;

                // ERROR RECOVERY: 
                // If we're following by an close curly or EOF, then consider this the start of a
                // variable declaration.
                if (this.peekToken(index).tokenKind === SyntaxKind.CloseBraceToken ||
                    this.peekToken(index).tokenKind === SyntaxKind.EndOfFileToken) {
                    return true;
                }
            }

            if (this.peekToken(index).tokenKind === SyntaxKind.StaticKeyword) {
                index++;

                // ERROR RECOVERY: 
                // If we're following by an close curly or EOF, then consider this the start of a
                // variable declaration.
                if (this.peekToken(index).tokenKind === SyntaxKind.CloseBraceToken ||
                    this.peekToken(index).tokenKind === SyntaxKind.EndOfFileToken) {
                    return true;
                }
            }

            return this.isIdentifier(this.peekToken(index));
        }

        private isClassElement(): bool {
            if (this.currentNode() !== null && this.currentNode().isClassElement()) {
                return true;
            }

            // Note: the order of these calls is important.  Specifically, isMemberVariableDeclaration
            // checks for a subset of the conditions of the previous two calls.
            return this.isConstructorDeclaration() ||
                   this.isMemberFunctionDeclaration() ||
                   this.isMemberAccessorDeclaration() ||
                   this.isMemberVariableDeclaration();
        }

        private parseConstructorDeclaration(): ConstructorDeclarationSyntax {
            // Debug.assert(this.isConstructorDeclaration());

            var constructorKeyword = this.eatKeyword(SyntaxKind.ConstructorKeyword);
            var parameterList = this.parseParameterList();

            var semicolonToken: ISyntaxToken = null;
            var block: BlockSyntax = null;

            if (this.isBlock()) {
                block = this.parseBlock();
            }
            else {
                semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);
            }

            return this.factory.constructorDeclaration(constructorKeyword, parameterList, block, semicolonToken);
        }

        private isMemberFunctionDeclaration(): bool {
            var index = 0;

            var token0KeywordKind = this.currentToken().tokenKind;
            if (token0KeywordKind === SyntaxKind.PublicKeyword ||
                token0KeywordKind === SyntaxKind.PrivateKeyword) {
                index++;
            }

            if (this.peekToken(index).tokenKind === SyntaxKind.StaticKeyword) {
                index++;
            }

            return this.isFunctionSignature(index);
        }

        private parseMemberFunctionDeclaration(): MemberFunctionDeclarationSyntax {
            // Debug.assert(this.isMemberFunctionDeclaration());

            var publicOrPrivateKeyword: ISyntaxToken = null;
            if (this.currentToken().tokenKind === SyntaxKind.PublicKeyword ||
                this.currentToken().tokenKind === SyntaxKind.PrivateKeyword) {
                publicOrPrivateKeyword = this.eatAnyToken();
            }

            var staticKeyword = this.tryEatKeyword(SyntaxKind.StaticKeyword);
            var functionSignature = this.parseFunctionSignature();

            var block: BlockSyntax = null;
            var semicolon: ISyntaxToken = null;

            if (this.isBlock()) {
                block = this.parseBlock();
            }
            else {
                semicolon = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);
            }

            return this.factory.memberFunctionDeclaration(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolon);
        }

        private parseMemberVariableDeclaration(): MemberVariableDeclarationSyntax {
            // Debug.assert(this.isMemberVariableDeclaration());

            var publicOrPrivateKeyword: ISyntaxToken = null;
            if (this.currentToken().tokenKind === SyntaxKind.PublicKeyword ||
                this.currentToken().tokenKind === SyntaxKind.PrivateKeyword) {
                publicOrPrivateKeyword = this.eatAnyToken();
            }

            var staticKeyword = this.tryEatKeyword(SyntaxKind.StaticKeyword);
            var variableDeclarator = this.parseVariableDeclarator(/*allowIn:*/ true);
            var semicolon = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.memberVariableDeclaration(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolon);
        }

        private parseClassElement(): IClassElementSyntax {
            // Debug.assert(this.isClassElement());

            if (this.currentNode() !== null && this.currentNode().isClassElement()) {
                return <IClassElementSyntax>this.eatNode();
            }

            if (this.isConstructorDeclaration()) {
                return this.parseConstructorDeclaration();
            }
            else if (this.isMemberFunctionDeclaration()) {
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

        private isFunctionDeclaration(): bool {
            var token0KeywordKind = this.currentToken().tokenKind;
            if (token0KeywordKind === SyntaxKind.FunctionKeyword) {
                return true;
            }

            if (token0KeywordKind === SyntaxKind.ExportKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.FunctionKeyword) {
                return true;
            }

            return token0KeywordKind === SyntaxKind.DeclareKeyword &&
                   this.peekToken(1).tokenKind === SyntaxKind.FunctionKeyword;
        }

        private parseFunctionDeclaration(): FunctionDeclarationSyntax {
            // Debug.assert(this.isFunctionDeclaration());

            var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
            var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);

            var functionKeyword = this.eatKeyword(SyntaxKind.FunctionKeyword);
            var functionSignature = this.parseFunctionSignature();

            var semicolonToken: ISyntaxToken = null;
            var block: BlockSyntax = null;

            if (this.isBlock()) {
                block = this.parseBlock();
            }
            else {
                semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);
            }

            return this.factory.functionDeclaration(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
        }

        private isModuleDeclaration(): bool {
            var token0 = this.currentToken();

            // export module
            if (token0.tokenKind === SyntaxKind.ExportKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.ModuleKeyword) {
                return true;
            }

            // declare module
            if (token0.tokenKind === SyntaxKind.DeclareKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.ModuleKeyword) {
                return true;
            }

            // Module is not a javascript keyword.  So we need to use a bit of lookahead here to ensure
            // that we're actually looking at a module construct and not some javascript expression.
            if (token0.tokenKind === SyntaxKind.ModuleKeyword) {
                // module {
                var token1 = this.peekToken(1);
                if (token1.tokenKind === SyntaxKind.OpenBraceToken) {
                    return true;
                }

                if (ParserImpl.isIdentifierName(token1)) {
                    var token2 = this.peekToken(2);

                    // module id {
                    if (token2.tokenKind === SyntaxKind.OpenBraceToken) {
                        return true;
                    }

                    // module id.
                    if (token2.tokenKind === SyntaxKind.DotToken) {
                        return true;
                    }
                }
            }

            return false;
        }

        private parseModuleDeclaration(): ModuleDeclarationSyntax {
            // Debug.assert(this.isModuleDeclaration());

            var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
            var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);
            var moduleKeyword = this.eatKeyword(SyntaxKind.ModuleKeyword);

            var moduleName: INameSyntax = null;
            var stringLiteral: ISyntaxToken = null;
            if (this.isName()) {
                moduleName = this.parseName();
            }
            else if (this.currentToken().tokenKind === SyntaxKind.StringLiteral) {
                stringLiteral = this.eatToken(SyntaxKind.StringLiteral);
            }

            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

            var moduleElements: ISyntaxList = Syntax.emptyList;
            if (openBraceToken.width() > 0) {
                moduleElements = this.parseSyntaxList(ListParsingState.ModuleDeclaration_ModuleElements);
            }

            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

            return this.factory.moduleDeclaration(
                exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral,
                openBraceToken, moduleElements, closeBraceToken);
        }

        private isInterfaceDeclaration(): bool {
            // export interface
            if (this.currentToken().tokenKind === SyntaxKind.ExportKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.InterfaceKeyword) {
                return true
            }

            // interface foo
            return this.currentToken().tokenKind === SyntaxKind.InterfaceKeyword &&
                   this.isIdentifier(this.peekToken(1));
        }

        private parseInterfaceDeclaration(): InterfaceDeclarationSyntax {
            // Debug.assert(this.isInterfaceDeclaration());

            var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
            var interfaceKeyword = this.eatKeyword(SyntaxKind.InterfaceKeyword);
            var identifier = this.eatIdentifierToken();
            var typeParameterList = this.parseOptionalTypeParameterList();

            var extendsClause: ExtendsClauseSyntax = null;
            if (this.isExtendsClause()) {
                extendsClause = this.parseExtendsClause();
            }

            var objectType = this.parseObjectType();
            return this.factory.interfaceDeclaration(
                exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, objectType);
        }

        private parseObjectType(): ObjectTypeSyntax {
            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

            var typeMembers: ISeparatedSyntaxList = Syntax.emptySeparatedList;
            if (openBraceToken.width() > 0) {
                typeMembers = this.parseSeparatedSyntaxList(ListParsingState.ObjectType_TypeMembers);
            }

            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
            return this.factory.objectType(openBraceToken, typeMembers, closeBraceToken);
        }

        private isTypeMember(): bool {
            if (this.currentNode() !== null && this.currentNode().isTypeMember()) {
                return true;
            }

            return this.isCallSignature() ||
                   this.isConstructSignature() ||
                   this.isIndexSignature() ||
                   this.isFunctionSignature(/*tokenIndex:*/ 0) ||
                   this.isPropertySignature();
        }

        private parseTypeMember(): TypeMemberSyntax {
            if (this.currentNode() !== null && this.currentNode().isTypeMember()) {
                return <TypeMemberSyntax>this.eatNode();
            }

            if (this.isCallSignature()) {
                return this.parseCallSignature();
            }
            else if (this.isConstructSignature()) {
                return this.parseConstructSignature();
            }
            else if (this.isIndexSignature()) {
                return this.parseIndexSignature();
            }
            else if (this.isFunctionSignature(/*tokenIndex:*/ 0)) {
                // Note: it is important that isFunctionSignature is called before isPropertySignature.
                // isPropertySignature checks for a subset of isFunctionSignature.
                return this.parseFunctionSignature();
            }
            else if (this.isPropertySignature()) {
                return this.parsePropertySignature();
            }
            else {
                throw Errors.invalidOperation();
            }
        }

        private parseConstructSignature(): ConstructSignatureSyntax {
            // Debug.assert(this.isConstructSignature());

            var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);
            var typeParameterList = this.parseOptionalTypeParameterList();
            var parameterList = this.parseParameterList();
            var typeAnnotation = this.parseOptionalTypeAnnotation();

            return this.factory.constructSignature(newKeyword, typeParameterList, parameterList, typeAnnotation);
        }

        private parseIndexSignature(): IndexSignatureSyntax {
            // Debug.assert(this.isIndexSignature());

            var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
            var parameter = this.parseParameter();
            var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);
            var typeAnnotation = this.parseOptionalTypeAnnotation();

            return this.factory.indexSignature(openBracketToken, parameter, closeBracketToken, typeAnnotation);
        }

        private parseFunctionSignature(): FunctionSignatureSyntax {
            var identifier = this.eatIdentifierToken();
            var questionToken = this.tryEatToken(SyntaxKind.QuestionToken);

            var parameterList = this.parseParameterList();
            var typeAnnotation = this.parseOptionalTypeAnnotation();

            return this.factory.functionSignature(identifier, questionToken, parameterList, typeAnnotation);
        }

        private parsePropertySignature(): PropertySignatureSyntax {
            // Debug.assert(this.isPropertySignature());

            var identifier = this.eatIdentifierToken();
            var questionToken = this.tryEatToken(SyntaxKind.QuestionToken);
            var typeAnnotation = this.parseOptionalTypeAnnotation();

            return this.factory.propertySignature(identifier, questionToken, typeAnnotation);
        }

        private isCallSignature(): bool {
            var tokenKind = this.currentToken().tokenKind;
            return tokenKind === SyntaxKind.OpenParenToken || tokenKind == SyntaxKind.LessThanToken;
        }

        private isConstructSignature(): bool {
            return this.currentToken().tokenKind === SyntaxKind.NewKeyword;
        }

        private isIndexSignature(): bool {
            return this.currentToken().tokenKind === SyntaxKind.OpenBracketToken;
        }

        private isFunctionSignature(tokenIndex: number): bool {
            if (this.isIdentifier(this.peekToken(tokenIndex))) {
                // id(
                if (this.peekToken(tokenIndex + 1).tokenKind === SyntaxKind.OpenParenToken) {
                    return true;
                }

                // id?(
                if (this.peekToken(tokenIndex + 1).tokenKind === SyntaxKind.QuestionToken &&
                    this.peekToken(tokenIndex + 2).tokenKind === SyntaxKind.OpenParenToken) {
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
            return this.currentToken().tokenKind === SyntaxKind.ExtendsKeyword;
        }

        private parseExtendsClause(): ExtendsClauseSyntax {
            // Debug.assert(this.isExtendsClause());

            var extendsKeyword = this.eatKeyword(SyntaxKind.ExtendsKeyword);
            var typeNames = this.parseSeparatedSyntaxList(ListParsingState.ExtendsOrImplementsClause_TypeNameList);

            return this.factory.extendsClause(extendsKeyword, typeNames);
        }

        private isImplementsClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ImplementsKeyword;
        }

        private parseImplementsClause(): ImplementsClauseSyntax {
            // Debug.assert(this.isImplementsClause());

            var implementsKeyword = this.eatKeyword(SyntaxKind.ImplementsKeyword);
            var typeNames = this.parseSeparatedSyntaxList(ListParsingState.ExtendsOrImplementsClause_TypeNameList);

            return this.factory.implementsClause(implementsKeyword, typeNames);
        }

        private isStatement(): bool {
            if (this.currentNode() !== null && this.currentNode().isStatement()) {
                return true;
            }

            // ERROR RECOVERY
            switch (this.currentToken().tokenKind) {
                case SyntaxKind.PublicKeyword:
                case SyntaxKind.PrivateKeyword:
                case SyntaxKind.StaticKeyword:
                    // None of hte above are actually keywords.  And they might show up in a real
                    // statement (i.e. "public();").  However, if we can determine that they're
                    // parsable as a ClassElement then don't consider them a statement.  Note:
                    //
                    // It should not be possible for any class element that starts with public, private
                    // or static to be parsed as a statement.  So this is safe to do.
                    if (this.isClassElement()) {
                        return false;
                    }
            }

            return this.isVariableStatement() ||
                   this.isLabeledStatement() ||
                   this.isFunctionDeclaration() ||
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
                   this.isWithStatement() ||
                   this.isDoStatement() ||
                   this.isTryStatement() ||
                   this.isDebuggerStatement();
        }

        private parseStatement(): IStatementSyntax {
            if (this.currentNode() !== null && this.currentNode().isStatement()) {
                return <IStatementSyntax>this.eatNode();
            }

            if (this.isVariableStatement()) {
                return this.parseVariableStatement();
            }
            else if (this.isLabeledStatement()) {
                return this.parseLabeledStatement();
            }
            else if (this.isFunctionDeclaration()) {
                return this.parseFunctionDeclaration();
            }
            else if (this.isIfStatement()) {
                return this.parseIfStatement();
            }
            else if (this.isBlock()) {
                return this.parseBlock();
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
            else if (this.isWithStatement()) {
                return this.parseWithStatement();
            }
            else if (this.isDoStatement()) {
                return this.parseDoStatement();
            }
            else if (this.isTryStatement()) {
                return this.parseTryStatement();
            }
            else if (this.isDebuggerStatement()) {
                return this.parseDebuggerStatement();
            }
            else {
                // Fall back to parsing this as expression statement.
                return this.parseExpressionStatement();
            }
        }

        private isDebuggerStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.DebuggerKeyword;
        }

        private parseDebuggerStatement(): DebuggerStatementSyntax {
            // Debug.assert(this.isDebuggerStatement());

            var debuggerKeyword = this.eatKeyword(SyntaxKind.DebuggerKeyword);
            var semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.debuggerStatement(debuggerKeyword, semicolonToken);
        }

        private isDoStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.DoKeyword;
        }

        private parseDoStatement(): DoStatementSyntax {
            // Debug.assert(this.isDoStatement());

            var doKeyword = this.eatKeyword(SyntaxKind.DoKeyword);
            var statement = this.parseStatement();
            var whileKeyword = this.eatKeyword(SyntaxKind.WhileKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var condition = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

            // From: https://mail.mozilla.org/pipermail/es-discuss/2011-August/016188.html
            // 157 min --- All allen at wirfs-brock.com CONF --- "do{;}while(false)false" prohibited in 
            // spec but allowed in consensus reality. Approved -- this is the de-facto standard whereby
            //  do;while(0)x will have a semicolon inserted before x.
            var semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ true);

            return this.factory.doStatement(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
        }

        private isLabeledStatement(): bool {
            return this.isIdentifier(this.currentToken()) && this.peekToken(1).tokenKind === SyntaxKind.ColonToken;
        }

        private parseLabeledStatement(): LabeledStatementSyntax {
            // Debug.assert(this.isLabeledStatement());

            var identifier = this.eatIdentifierToken();
            var colonToken = this.eatToken(SyntaxKind.ColonToken);
            var statement = this.parseStatement();

            return this.factory.labeledStatement(identifier, colonToken, statement);
        }

        private isTryStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.TryKeyword;
        }

        private parseTryStatement(): TryStatementSyntax {
            // Debug.assert(this.isTryStatement());

            var tryKeyword = this.eatKeyword(SyntaxKind.TryKeyword);
            var block = this.parseBlock();

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

            return this.factory.tryStatement(tryKeyword, block, catchClause, finallyClause);
        }

        private isCatchClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CatchKeyword;
        }

        private parseCatchClause(): CatchClauseSyntax {
            // Debug.assert(this.isCatchClause());

            var catchKeyword = this.eatKeyword(SyntaxKind.CatchKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var identifier = this.eatIdentifierToken();
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var block = this.parseBlock();

            return this.factory.catchClause(catchKeyword, openParenToken, identifier, closeParenToken, block);
        }

        private isFinallyClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.FinallyKeyword;
        }

        private parseFinallyClause(): FinallyClauseSyntax {
            // Debug.assert(this.isFinallyClause());

            var finallyKeyword = this.eatKeyword(SyntaxKind.FinallyKeyword);
            var block = this.parseBlock();

            return this.factory.finallyClause(finallyKeyword, block);
        }

        private isWithStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.WithKeyword;
        }

        private parseWithStatement(): WithStatementSyntax {
            // Debug.assert(this.isWithStatement());

            var withKeyword = this.eatKeyword(SyntaxKind.WithKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var condition = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var statement = this.parseStatement();

            return this.factory.withStatement(withKeyword, openParenToken, condition, closeParenToken, statement);
        }

        private isWhileStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.WhileKeyword;
        }

        private parseWhileStatement(): WhileStatementSyntax {
            // Debug.assert(this.isWhileStatement());

            var whileKeyword = this.eatKeyword(SyntaxKind.WhileKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var condition = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var statement = this.parseStatement();

            return this.factory.whileStatement(whileKeyword, openParenToken, condition, closeParenToken, statement);
        }

        private isEmptyStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.SemicolonToken;
        }

        private parseEmptyStatement(): EmptyStatementSyntax {
            // Debug.assert(this.isEmptyStatement());

            var semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
            return this.factory.emptyStatement(semicolonToken);
        }

        private isForOrForInStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ForKeyword;
        }

        private parseForOrForInStatement(): BaseForStatementSyntax {
            // Debug.assert(this.isForOrForInStatement());

            var forKeyword = this.eatKeyword(SyntaxKind.ForKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);

            var currentToken = this.currentToken();
            if (currentToken.tokenKind === SyntaxKind.VarKeyword) {
                // for ( var VariableDeclarationListNoIn; Expressionopt ; Expressionopt ) Statement
                // for ( var VariableDeclarationNoIn in Expression ) Statement
                return this.parseForOrForInStatementWithVariableDeclaration(forKeyword, openParenToken);
            }
            else if (currentToken.tokenKind === SyntaxKind.SemicolonToken) {
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
            // Debug.assert(forKeyword.tokenKind === SyntaxKind.ForKeyword && openParenToken.tokenKind === SyntaxKind.OpenParenToken);
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.VarKeyword);

            // for ( var VariableDeclarationListNoIn; Expressionopt ; Expressionopt ) Statement
            // for ( var VariableDeclarationNoIn in Expression ) Statement

            var variableDeclaration = this.parseVariableDeclaration(/*allowIn:*/ false);

            if (this.currentToken().tokenKind === SyntaxKind.InKeyword) {
                return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
            }

            return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
        }

        private parseForInStatementWithVariableDeclarationOrInitializer(
                forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                initializer: IExpressionSyntax): ForInStatementSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.InKeyword);

            // for ( var VariableDeclarationNoIn in Expression ) Statement
            var inKeyword = this.eatKeyword(SyntaxKind.InKeyword);
            var expression = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var statement = this.parseStatement();

            return this.factory.forInStatement(forKeyword, openParenToken, variableDeclaration,
                initializer, inKeyword, expression, closeParenToken, statement);
        }

        private parseForOrForInStatementWithInitializer(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken): BaseForStatementSyntax {
            // Debug.assert(forKeyword.tokenKind === SyntaxKind.ForKeyword && openParenToken.tokenKind === SyntaxKind.OpenParenToken);

            // for ( ExpressionNoInopt; Expressionopt ; Expressionopt ) Statement
            // for ( LeftHandSideExpression in Expression ) Statement

            var initializer = this.parseExpression(/*allowIn:*/ false);
            if (this.currentToken().tokenKind === SyntaxKind.InKeyword) {
                return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
            }
            else {
                return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
            }
        }

        private parseForStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken): ForStatementSyntax {
            // Debug.assert(forKeyword.tokenKind === SyntaxKind.ForKeyword && openParenToken.tokenKind === SyntaxKind.OpenParenToken);

            // for ( ExpressionNoInopt; Expressionopt ; Expressionopt ) Statement
            var initializer: IExpressionSyntax = null;

            if (this.currentToken().tokenKind !== SyntaxKind.SemicolonToken &&
                this.currentToken().tokenKind !== SyntaxKind.CloseParenToken &&
                this.currentToken().tokenKind !== SyntaxKind.EndOfFileToken) {
                initializer = this.parseExpression(/*allowIn:*/ false);
            }

            return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        }

        private parseForStatementWithVariableDeclarationOrInitializer(
                forKeyword: ISyntaxToken,
                openParenToken: ISyntaxToken,
                variableDeclaration: VariableDeclarationSyntax,
                initializer: IExpressionSyntax): ForStatementSyntax {
            var firstSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

            var condition: IExpressionSyntax = null;
            if (this.currentToken().tokenKind !== SyntaxKind.SemicolonToken &&
                this.currentToken().tokenKind !== SyntaxKind.CloseParenToken &&
                this.currentToken().tokenKind !== SyntaxKind.EndOfFileToken) {
                condition = this.parseExpression(/*allowIn:*/ true);
            }

            var secondSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);

            var incrementor: IExpressionSyntax = null;
            if (this.currentToken().tokenKind !== SyntaxKind.CloseParenToken &&
                this.currentToken().tokenKind !== SyntaxKind.EndOfFileToken) {
                incrementor = this.parseExpression(/*allowIn:*/ true);
            }

            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var statement = this.parseStatement();

            return this.factory.forStatement(forKeyword, openParenToken, variableDeclaration, initializer,
                firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
        }

        private isBreakStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.BreakKeyword;
        }

        private parseBreakStatement(): BreakStatementSyntax {
            // Debug.assert(this.isBreakStatement());

            var breakKeyword = this.eatKeyword(SyntaxKind.BreakKeyword);

            // If there is no newline after the break keyword, then we can consume an optional 
            // identifier.
            var identifier: ISyntaxToken = null;
            if (!this.canEatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false)) {
                if (this.isIdentifier(this.currentToken())) {
                    identifier = this.eatIdentifierToken();
                }
            }

            var semicolon = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);
            return this.factory.breakStatement(breakKeyword, identifier, semicolon);
        }

        private isContinueStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ContinueKeyword;
        }

        private parseContinueStatement(): ContinueStatementSyntax {
            // Debug.assert(this.isContinueStatement());

            var continueKeyword = this.eatKeyword(SyntaxKind.ContinueKeyword);

            // If there is no newline after the break keyword, then we can consume an optional 
            // identifier.
            var identifier: ISyntaxToken = null;
            if (!this.canEatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false)) {
                if (this.isIdentifier(this.currentToken())) {
                    identifier = this.eatIdentifierToken();
                }
            }

            var semicolon = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);
            return this.factory.continueStatement(continueKeyword, identifier, semicolon);
        }

        private isSwitchStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.SwitchKeyword;
        }

        private parseSwitchStatement() {
            // Debug.assert(this.isSwitchStatement());

            var switchKeyword = this.eatKeyword(SyntaxKind.SwitchKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var expression = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

            var switchClauses: ISyntaxList = Syntax.emptyList;
            if (openBraceToken.width() > 0) {
                switchClauses = this.parseSyntaxList(ListParsingState.SwitchStatement_SwitchClauses);
            }

            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
            return this.factory.switchStatement(switchKeyword, openParenToken, expression,
                closeParenToken, openBraceToken, switchClauses, closeBraceToken);
        }

        private isCaseSwitchClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CaseKeyword;
        }

        private isDefaultSwitchClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.DefaultKeyword;
        }

        private isSwitchClause(): bool {
            if (this.currentNode() !== null && this.currentNode().isSwitchClause()) {
                return true;
            }

            return this.isCaseSwitchClause() || this.isDefaultSwitchClause();
        }

        private parseSwitchClause(): SwitchClauseSyntax {
            // Debug.assert(this.isSwitchClause());
            if (this.currentNode() !== null && this.currentNode().isSwitchClause()) {
                return <SwitchClauseSyntax>this.eatNode();
            }

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
            // Debug.assert(this.isCaseSwitchClause());

            var caseKeyword = this.eatKeyword(SyntaxKind.CaseKeyword);
            var expression = this.parseExpression(/*allowIn:*/ true);
            var colonToken = this.eatToken(SyntaxKind.ColonToken);
            var statements = this.parseSyntaxList(ListParsingState.SwitchClause_Statements);

            return this.factory.caseSwitchClause(caseKeyword, expression, colonToken, statements);
        }

        private parseDefaultSwitchClause(): DefaultSwitchClauseSyntax {
            // Debug.assert(this.isDefaultSwitchClause());

            var defaultKeyword = this.eatKeyword(SyntaxKind.DefaultKeyword);
            var colonToken = this.eatToken(SyntaxKind.ColonToken);
            var statements = this.parseSyntaxList(ListParsingState.SwitchClause_Statements);

            return this.factory.defaultSwitchClause(defaultKeyword, colonToken, statements);
        }

        private isThrowStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ThrowKeyword;
        }

        private parseThrowStatement(): ThrowStatementSyntax {
            // Debug.assert(this.isThrowStatement());

            var throwKeyword = this.eatKeyword(SyntaxKind.ThrowKeyword);

            var expression: IExpressionSyntax = null;
            if (this.canEatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false)) {
                // Because of automatic semicolon insertion, we need to report error if this 
                // throw could be terminated with a semicolon.  Note: we can't call 'parseExpression'
                // directly as that might consume an expression on the following line.  
                var token = this.createMissingToken(SyntaxKind.IdentifierName, null);
                expression = token;
            }
            else {
                expression = this.parseExpression(/*allowIn:*/ true);
            }

            var semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.throwStatement(throwKeyword, expression, semicolonToken);
        }

        private isReturnStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ReturnKeyword;
        }

        private parseReturnStatement(): ReturnStatementSyntax {
            // Debug.assert(this.isReturnStatement());

            var returnKeyword = this.eatKeyword(SyntaxKind.ReturnKeyword);

            var expression: IExpressionSyntax = null;
            if (!this.canEatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false)) {
                expression = this.parseExpression(/*allowIn:*/ true);
            }

            var semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.returnStatement(returnKeyword, expression, semicolonToken);
        }

        private isExpressionStatement(): bool {
            // As per the gramar, neither { nor 'function' can start an expression statement.
            var currentToken = this.currentToken();

            var kind = currentToken.tokenKind;
            if (kind === SyntaxKind.OpenBraceToken || kind === SyntaxKind.FunctionKeyword) {
                return false;
            }

            return this.isExpression();
        }

        private isAssignmentOrOmittedExpression(): bool {
            if (this.currentToken().tokenKind === SyntaxKind.CommaToken) {
                return true;
            }

            return this.isExpression();
        }

        private parseAssignmentOrOmittedExpression(): IExpressionSyntax {
            // Debug.assert(this.isAssignmentOrOmittedExpression());

            if (this.currentToken().tokenKind === SyntaxKind.CommaToken) {
                return this.factory.omittedExpression();
            }

            return this.parseAssignmentExpression(/*allowIn:*/ true);
        }

        private isExpression(): bool {
            var currentToken = this.currentToken();
            var kind = currentToken.tokenKind;

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

                // ERROR TOLERANCE:
                // If we see a => then we know the user was probably trying to type in an arrow 
                // function.  So allow this as the start of an expression, knowing that when we 
                // actually try to parse it we'll report the missing identifier.
                case SyntaxKind.EqualsGreaterThanToken:
                    return true;

                case SyntaxKind.SlashToken:
                case SyntaxKind.SlashEqualsToken:
                    // Note: if we see a / or /= token then we always consider this an expression.  Why?
                    // Well, either that / or /= is actually a regular expression, in which case we're 
                    // definitely an expression.  Or, it's actually a divide.  In which case, we *still*
                    // want to think of ourself as an expression.  "But wait", you say.  '/' doesn't
                    // start an expression.  That's true.  BUt like the above check for =>, for error
                    // tolerance, we will consider ourselves in an expression.  We'll then parse out an
                    // missing identifier and then will consume the / token naturally as a binary 
                    // expression.
                    return true;

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

            var semicolon = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.expressionStatement(expression, semicolon);
        }

        private isIfStatement(): bool {
            return this.currentToken().tokenKind === SyntaxKind.IfKeyword;
        }

        private parseIfStatement(): IfStatementSyntax {
            // Debug.assert(this.isIfStatement());

            var ifKeyword = this.eatKeyword(SyntaxKind.IfKeyword);
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var condition = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var statement = this.parseStatement();

            var elseClause: ElseClauseSyntax = null;
            if (this.isElseClause()) {
                elseClause = this.parseElseClause();
            }

            return this.factory.ifStatement(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
        }

        private isElseClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ElseKeyword;
        }

        private parseElseClause(): ElseClauseSyntax {
            // Debug.assert(this.isElseClause());

            var elseKeyword = this.eatKeyword(SyntaxKind.ElseKeyword);
            var statement = this.parseStatement();

            return this.factory.elseClause(elseKeyword, statement);
        }

        private isVariableStatement(): bool {
            var token0KeywordKind = this.currentToken().tokenKind;
            if (token0KeywordKind === SyntaxKind.VarKeyword) {
                return true;
            }

            if (token0KeywordKind === SyntaxKind.ExportKeyword &&
                this.peekToken(1).tokenKind === SyntaxKind.VarKeyword) {
                return true;
            }

            return token0KeywordKind === SyntaxKind.DeclareKeyword &&
                   this.peekToken(1).tokenKind === SyntaxKind.VarKeyword;
        }

        private parseVariableStatement(): VariableStatementSyntax {
            // Debug.assert(this.isVariableStatement());

            var exportKeyword = this.tryEatKeyword(SyntaxKind.ExportKeyword);
            var declareKeyword = this.tryEatKeyword(SyntaxKind.DeclareKeyword);

            var variableDeclaration = this.parseVariableDeclaration(/*allowIn:*/ true);
            var semicolonToken = this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);

            return this.factory.variableStatement(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
        }

        private parseVariableDeclaration(allowIn: bool): VariableDeclarationSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.VarKeyword);
            var varKeyword = this.eatKeyword(SyntaxKind.VarKeyword);

            var listParsingState = allowIn
                ? ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn
                : ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn;

            var variableDeclarators = this.parseSeparatedSyntaxList(listParsingState);
            return this.factory.variableDeclaration(varKeyword, variableDeclarators);
        }

        private isVariableDeclarator(): bool {
            if (this.currentNode() !== null && this.currentNode().kind() === SyntaxKind.VariableDeclarator) {
                return true;
            }

            return this.isIdentifier(this.currentToken());
        }

        private parseVariableDeclarator(allowIn: bool): VariableDeclaratorSyntax {
            if (this.currentNode() !== null && this.currentNode().kind() === SyntaxKind.VariableDeclarator) {
                return <VariableDeclaratorSyntax>this.eatNode();
            }

            var identifier = this.eatIdentifierToken();
            var equalsValueClause: EqualsValueClauseSyntax = null;
            var typeAnnotation: TypeAnnotationSyntax = null;

            if (identifier.width() > 0) {
                typeAnnotation = this.parseOptionalTypeAnnotation();

                if (this.isEqualsValueClause()) {
                    equalsValueClause = this.parseEqualsValuesClause(allowIn);
                }
            }

            return this.factory.variableDeclarator(identifier, typeAnnotation, equalsValueClause);
        }

        private isEqualsValueClause(): bool {
            return this.currentToken().tokenKind === SyntaxKind.EqualsToken;
        }

        private parseEqualsValuesClause(allowIn: bool): EqualsValueClauseSyntax {
            // Debug.assert(this.isEqualsValueClause());

            var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
            var value = this.parseAssignmentExpression(allowIn);

            return this.factory.equalsValueClause(equalsToken, value);
        }

        private parseExpression(allowIn: bool): IExpressionSyntax {
            return this.parseSubExpression(0, allowIn);
        }

        // Called when you need to parse an expression, but you do not want to allow 'CommaExpressions'.
        // i.e. if you have "var a = 1, b = 2" then when we parse '1' we want to parse with higher 
        // precedence than 'comma'.  Otherwise we'll get: "var a = (1, (b = 2))", instead of
        // "var a = (1), b = (2)");
        private parseAssignmentExpression(allowIn: bool): IExpressionSyntax {
            return this.parseSubExpression(ExpressionPrecedence.AssignmentExpressionPrecedence, allowIn);
        }

        private parseUnaryExpression(): IUnaryExpressionSyntax {
            var currentTokenKind = this.currentToken().tokenKind;
            if (SyntaxFacts.isPrefixUnaryExpressionOperatorToken(currentTokenKind)) {
                var operatorKind = SyntaxFacts.getPrefixUnaryExpressionFromOperatorToken(currentTokenKind);

                var operatorToken = this.eatAnyToken();

                var operand = this.parseUnaryExpression();
                return this.factory.prefixUnaryExpression(operatorKind, operatorToken, operand);
            }
            else {
                return this.parseTerm(/*allowInvocation*/ true, /*insideObjectCreation:*/ false);
            }
        }

        private parseSubExpression(precedence: ExpressionPrecedence, allowIn: bool): IExpressionSyntax {
            // Because unary expression have the highest precedence, we can always parse one, regardless 
            // of what precedence was passed in.
            var leftOperand: IExpressionSyntax = this.parseUnaryExpression();
            leftOperand = this.parseBinaryOrConditionalExpressions(precedence, allowIn, leftOperand);

            return leftOperand;
        }

        private parseBinaryOrConditionalExpressions(precedence: number, allowIn: bool, leftOperand: IExpressionSyntax): IExpressionSyntax {
            while (true) {
                // We either have a binary operator here, or we're finished.
                var currentTokenKind = this.currentToken().tokenKind;
                var currentTokenKeywordKind = this.currentToken().tokenKind;

                if (currentTokenKeywordKind === SyntaxKind.InstanceOfKeyword || currentTokenKeywordKind === SyntaxKind.InKeyword) {
                    currentTokenKind = currentTokenKeywordKind;
                }

                // Check for binary expressions.
                if (SyntaxFacts.isBinaryExpressionOperatorToken(currentTokenKind)) {
                    // also, if it's the 'in' operator, only allow if our caller allows it.
                    if (currentTokenKind === SyntaxKind.InKeyword && !allowIn) {
                        break;
                    }

                    var binaryExpressionKind = SyntaxFacts.getBinaryExpressionFromOperatorToken(currentTokenKind);
                    var newPrecedence = ParserImpl.getPrecedence(binaryExpressionKind);

                    // All binary operators must have precedence > 0!
                    // Debug.assert(newPrecedence > 0);

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
                    leftOperand = this.factory.binaryExpression(binaryExpressionKind, leftOperand, operatorToken, this.parseSubExpression(newPrecedence, allowIn));
                    continue;
                }

                // Now check for conditional expression.
                // Only consume this as a ternary expression if our precedence is higher than the ternary 
                // level.  i.e. if we have "!f ? a : b" then we would not want to 
                // consume the "?" as part of "f" because the precedence of "!" is far too high.  However,
                // if we have: "x = f ? a : b", then we would want to consume the "?" as part of "f".
                //
                // Note: if we have "m = f ? x ? y : z : b, then we do want the second "?" to go with 'x'.
                if (currentTokenKind === SyntaxKind.QuestionToken && precedence <= ExpressionPrecedence.ConditionalExpressionPrecedence) {
                    var questionToken = this.eatToken(SyntaxKind.QuestionToken);

                    var whenTrueExpression = this.parseAssignmentExpression(allowIn);
                    var colon = this.eatToken(SyntaxKind.ColonToken);

                    var whenFalseExpression = this.parseAssignmentExpression(allowIn);
                    leftOperand = this.factory.conditionalExpression(leftOperand, questionToken, whenTrueExpression, colon, whenFalseExpression);
                    continue;
                }

                // Not binary or ternary.  Nothing more to consume here.
                break;
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

        private parseTerm(allowInvocation: bool, insideObjectCreation: bool): IUnaryExpressionSyntax {
            // NOTE: allowInvocation and insideObjectCreation are always the negation of the other.
            // We could remove one of them and just use the other.  However, i think this is much
            // easier to read and understand in this form.

            var term = this.parseTermWorker(insideObjectCreation);
            if (term === null) {
                // Nothing else worked, just try to consume an identifier so we report an error.
                return this.eatIdentifierToken();
            }

            return this.parsePostFixExpression(term, allowInvocation);
        }

        private parsePostFixExpression(expression: IUnaryExpressionSyntax, allowInvocation: bool): IUnaryExpressionSyntax {
            while (true) {
                var currentTokenKind = this.currentToken().tokenKind;
                switch (currentTokenKind) {
                    case SyntaxKind.OpenParenToken:
                        if (!allowInvocation) {
                            return expression;
                        }

                        expression = this.factory.invocationExpression(expression, this.parseArgumentList());
                        break;

                    case SyntaxKind.OpenBracketToken:
                        expression = this.parseElementAccessExpression(expression);
                        break;

                    case SyntaxKind.PlusPlusToken:
                    case SyntaxKind.MinusMinusToken:
                        // Because of automatic semicolon insertion, we should only consume the ++ or -- 
                        // if it is on the same line as the previous token.
                        if (this.previousToken() !== null && this.previousToken().hasTrailingNewLine()) {
                            return expression;
                        }

                        expression = this.factory.postfixUnaryExpression(
                            SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken(currentTokenKind), expression, this.eatAnyToken());
                        break;

                    case SyntaxKind.DotToken:
                        expression = this.factory.memberAccessExpression(
                            expression, this.eatToken(SyntaxKind.DotToken), this.eatIdentifierNameToken());
                        break;

                    default:
                        return expression;
                }
            }
        }

        private isArgumentList(): bool {
            return this.currentToken().tokenKind === SyntaxKind.OpenParenToken;
        }

        private parseArgumentList(): ArgumentListSyntax {
            // Debug.assert(this.isArgumentList());

            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var arguments = this.parseSeparatedSyntaxList(ListParsingState.ArgumentList_AssignmentExpressions);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

            return this.factory.argumentList(openParenToken, arguments, closeParenToken);
        }

        private parseElementAccessExpression(expression: IExpressionSyntax): ElementAccessExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenBracketToken);

            var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
            var argumentExpression = this.parseExpression(/*allowIn:*/ true);
            var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

            return this.factory.elementAccessExpression(expression, openBracketToken, argumentExpression, closeBracketToken);
        }

        private parseTermWorker(insideObjectCreation: bool): IUnaryExpressionSyntax {
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

            // ERROR RECOVERY TWEAK:
            // If we see a standalone => try to parse it as an arrow function as that's likely what
            // the user intended to write.
            if (currentToken.tokenKind === SyntaxKind.EqualsGreaterThanToken) {
                return this.parseSimpleArrowFunctionExpression();
            }

            if (this.isIdentifier(currentToken)) {
                if (this.isSimpleArrowFunctionExpression()) {
                    return this.parseSimpleArrowFunctionExpression();
                }
                else {
                    var identifier = this.eatIdentifierToken();
                    return identifier;
                }
            }

            var currentTokenKind = currentToken.tokenKind;
            var currentTokenKeywordKind = currentToken.tokenKind;
            switch (currentTokenKeywordKind) {
                case SyntaxKind.ThisKeyword:
                    return this.parseThisExpression();

                case SyntaxKind.TrueKeyword:
                case SyntaxKind.FalseKeyword:
                    return this.parseLiteralExpression();

                case SyntaxKind.NullKeyword:
                    return this.parseLiteralExpression();

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

                case SyntaxKind.VoidKeyword:
                    return this.parseVoidExpression();
            }

            switch (currentTokenKind) {
                case SyntaxKind.NumericLiteral:
                    return this.parseLiteralExpression();

                case SyntaxKind.RegularExpressionLiteral:
                    return this.parseLiteralExpression();

                case SyntaxKind.StringLiteral:
                    return this.parseLiteralExpression();

                case SyntaxKind.OpenBracketToken:
                    return this.parseArrayLiteralExpression();

                case SyntaxKind.OpenBraceToken:
                    return this.parseObjectLiteralExpression();

                case SyntaxKind.OpenParenToken:
                    return this.parseParenthesizedOrArrowFunctionExpression();

                case SyntaxKind.LessThanToken:
                    return this.parseCastExpression();

                case SyntaxKind.SlashToken:
                case SyntaxKind.SlashEqualsToken:
                    // If we see a standalone / or /= and we're expecting a term, then try to reparse
                    // it as a regular expression.  If we succeed, then return that.  Otherwise, fall
                    // back and just return a missing identifier as usual.  We'll then form a binary
                    // expression out of of the / as usual.
                    var result = this.tryReparseDivideAsRegularExpression();
                    if (result !== null) {
                        return result;
                    }
                    break;
            }

            // Wasn't able to parse this as a term. 
            return null;
        }

        private tryReparseDivideAsRegularExpression(): IUnaryExpressionSyntax {
            // If we see a / or /= token, then that may actually be the start of a regex in certain 
            // contexts.

            var currentToken = this.currentToken();
            // Debug.assert(SyntaxFacts.isAnyDivideToken(currentToken.tokenKind));

            // There are several contexts where we could never see a regex.  Don't even bother 
            // reinterpretting the / in these contexts.
            if (this.previousToken() !== null) {
                var previousTokenKind = this.previousToken().tokenKind;
                switch (previousTokenKind) {
                    case SyntaxKind.IdentifierName:
                        // Regular expressions can't follow identifiers.
                        return null;

                    // Regexs also can't follow certain keywords:
                    case SyntaxKind.ThisKeyword:
                    case SyntaxKind.TrueKeyword:
                    case SyntaxKind.FalseKeyword:
                        return null;

                    // A regular expression could follow other keywords.  i.e. "return /blah/;"
                    // TODO: be more specific about the keywords that a regex could follow.

                    case SyntaxKind.StringLiteral:
                    case SyntaxKind.NumericLiteral:
                    case SyntaxKind.RegularExpressionLiteral:
                    case SyntaxKind.PlusPlusToken:
                    case SyntaxKind.MinusMinusToken:
                    case SyntaxKind.CloseBracketToken:
                    case SyntaxKind.CloseBraceToken:
                        // A regular expression can't follow any of these.  It must be a divide. Note: this
                        // list *may* be incorrect (especially in the context of typescript).  We need to
                        // carefully review it.
                        return null;

                    // case SyntaxKind.CloseParenToken:
                    // It is tempting to say that if we have a slash after a close paren that it can't be 
                    // a regular expression.  after all, the normal case where we see that is "(1 + 2) / 3".
                    // However, it can appear in legal code.  Specifically:
                    //
                    //      for (...)
                    //          /regex/.Stuff...
                    //
                    // So we have to see if we can get a regular expression in that case.
                }
            }

            // Ok, from our quick lexical check, this could be a place where a regular expression could
            // go.  Now we have to do a bunch of work.  Ask the source to retrive the token at the 
            // current position again.  But this time allow it to retrieve it as a regular expression.
            currentToken = this.currentTokenAllowingRegularExpression();

            // Note: we *must* have gotten a /, /= or regular expression.  Or else something went *very*
            // wrong with our logic above.
            // Debug.assert(SyntaxFacts.isAnyDivideOrRegularExpressionToken(currentToken.tokenKind));

            if (currentToken.tokenKind === SyntaxKind.SlashToken || currentToken.tokenKind === SyntaxKind.SlashEqualsToken) {
                // Still came back as a / or /=.   This is not a regular expression literal.
                return null;
            }
            else if (currentToken.tokenKind === SyntaxKind.RegularExpressionLiteral) {
                return this.parseLiteralExpression();
            }
            else {
                // Something *very* wrong happened.  This is an internal parser fault that we need 
                // to figure out and fix.
                throw Errors.invalidOperation();
            }
        }

        private parseTypeOfExpression(): TypeOfExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.TypeOfKeyword);

            var typeOfKeyword = this.eatKeyword(SyntaxKind.TypeOfKeyword);
            var expression = this.parseUnaryExpression();

            return this.factory.typeOfExpression(typeOfKeyword, expression);
        }

        private parseDeleteExpression(): DeleteExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.DeleteKeyword);

            var deleteKeyword = this.eatKeyword(SyntaxKind.DeleteKeyword);
            var expression = this.parseUnaryExpression();

            return this.factory.deleteExpression(deleteKeyword, expression);
        }

        private parseVoidExpression(): VoidExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.VoidKeyword);

            var voidKeyword = this.eatKeyword(SyntaxKind.VoidKeyword);
            var expression = this.parseUnaryExpression();

            return this.factory.voidExpression(voidKeyword, expression);
        }

        private parseSuperExpression(): IUnaryExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.SuperKeyword);

            var superKeyword = this.eatKeyword(SyntaxKind.SuperKeyword);
            return superKeyword;
        }

        private parseFunctionExpression(): FunctionExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.FunctionKeyword);

            var functionKeyword = this.eatKeyword(SyntaxKind.FunctionKeyword);
            var identifier: ISyntaxToken = null;

            if (this.isIdentifier(this.currentToken())) {
                identifier = this.eatIdentifierToken();
            }

            var callSignature = this.parseCallSignature();
            var block = this.parseBlock();

            return this.factory.functionExpression(functionKeyword, identifier, callSignature, block);
        }

        private parseCastExpression(): CastExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.LessThanToken);

            var lessThanToken = this.eatToken(SyntaxKind.LessThanToken);
            var type = this.parseType(/*requireCompleteArraySuffix:*/ false);
            var greaterThanToken = this.eatToken(SyntaxKind.GreaterThanToken);
            var expression = this.parseUnaryExpression();

            return this.factory.castExpression(lessThanToken, type, greaterThanToken, expression);
        }

        private parseObjectCreationExpression(): ObjectCreationExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.NewKeyword);
            var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);

            // While parsing the sub term we don't want to allow invocations to be parsed.  that's because
            // we want "new Foo()" to parse as "new Foo()" (one node), not "new (Foo())".
            var expression = this.parseTerm(/*allowInvocation:*/ false, /*insideObjectCreation:*/ true);

            var argumentList: ArgumentListSyntax = null;
            if (this.isArgumentList()) {
                argumentList = this.parseArgumentList();
            }

            return this.factory.objectCreationExpression(newKeyword, expression, argumentList);
        }

        private parseParenthesizedOrArrowFunctionExpression(): IUnaryExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenParenToken);

            var result = this.tryParseArrowFunctionExpression();
            if (result !== null) {
                return result;
            }

            // Doesn't look like an arrow function, so parse this as a parenthesized expression.
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var expression = this.parseExpression(/*allowIn:*/ true);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);

            return this.factory.parenthesizedExpression(openParenToken, expression, closeParenToken);
        }

        private tryParseArrowFunctionExpression(): ArrowFunctionExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenParenToken);

            // Because arrow functions and parenthesized expressions look similar, we have to check far
            // enough ahead to be sure we've actually got an arrow function. For example, both nodes can
            // start with:
            //    (a = b, c = d, ..., e = f).
            //So we effectively need infinite lookahead to decide which node we're in.
            //
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
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenParenToken);

            var callSignature = this.parseCallSignature();

            if (requireArrow && this.currentToken().tokenKind !== SyntaxKind.EqualsGreaterThanToken) {
                return null;
            }

            var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
            var body = this.parseArrowFunctionBody();

            return this.factory.parenthesizedArrowFunctionExpression(callSignature, equalsGreaterThanToken, body);
        }

        private parseArrowFunctionBody(): ISyntaxNodeOrToken {
            if (this.isBlock()) {
                return this.parseBlock();
            }
            else {
                return this.parseAssignmentExpression(/*allowIn:*/ true);
            }
        }

        private isSimpleArrowFunctionExpression(): bool {
            // ERROR RECOVERY TWEAK:
            if (this.currentToken().tokenKind === SyntaxKind.EqualsGreaterThanToken) {
                return true;
            }

            return this.isIdentifier(this.currentToken()) &&
                   this.peekToken(1).tokenKind === SyntaxKind.EqualsGreaterThanToken;
        }

        private parseSimpleArrowFunctionExpression(): SimpleArrowFunctionExpressionSyntax {
            // Debug.assert(this.isSimpleArrowFunctionExpression());

            var identifier = this.eatIdentifierToken();
            var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
            var body = this.parseArrowFunctionBody();

            return this.factory.simpleArrowFunctionExpression(
                identifier, equalsGreaterThanToken, body);
        }

        private isBlock(): bool {
            return this.currentToken().tokenKind === SyntaxKind.OpenBraceToken;
        }

        private isDefinitelyArrowFunctionExpression(): bool {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenParenToken);

            var token1 = this.peekToken(1);

            if (token1.tokenKind === SyntaxKind.CloseParenToken) {
                // ()
                // Definitely an arrow function.  Could never be a parenthesized expression.
                return true;
            }

            if (token1.tokenKind === SyntaxKind.DotDotDotToken) {
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
            var token2 = this.peekToken(2);
            if (token2.tokenKind === SyntaxKind.ColonToken) {
                // (id:
                // Definitely an arrow function.  Could never be a parenthesized expression.
                return true;
            }

            var token3 = this.peekToken(3);
            if (token2.tokenKind === SyntaxKind.QuestionToken) {
                // (id?
                // Could be an arrow function, or a parenthesized conditional expression.

                // Check for the things that could only be arrow functions.
                if (token3.tokenKind === SyntaxKind.ColonToken ||
                    token3.tokenKind === SyntaxKind.CloseParenToken ||
                    token3.tokenKind === SyntaxKind.CommaToken) {
                    // (id?:
                    // (id?)
                    // (id?,
                    // These are the only cases where this could be an arrow function.
                    // And none of them can be parenthesized expression.
                    return true;
                }
            }

            if (token2.tokenKind === SyntaxKind.CloseParenToken) {
                // (id)
                // Could be an arrow function, or a parenthesized conditional expression.

                if (token3.tokenKind === SyntaxKind.EqualsGreaterThanToken) {
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
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenParenToken);

            var token1 = this.peekToken(1);

            if (!this.isIdentifier(token1)) {
                // All other arrow functions must start with (id
                // so this is definitely not an arrow function.
                return false;
            }

            var token2 = this.peekToken(2);
            if (token2.tokenKind === SyntaxKind.EqualsToken) {
                // (id =
                //
                // This *could* be an arrow function.  i.e. (id = 0) => { }
                // Or it could be a parenthesized expression.  So we'll have to actually
                // try to parse it.
                return true;
            }

            if (token2.tokenKind === SyntaxKind.CommaToken) {
                // (id,

                // This *could* be an arrow function.  i.e. (id, id2) => { }
                // Or it could be a parenthesized expression (as javascript supports
                // the comma operator).  So we'll have to actually try to parse it.
                return true;
            }

            if (token2.tokenKind === SyntaxKind.CloseParenToken) {
                // (id)

                var token3 = this.peekToken(3);
                if (token3.tokenKind === SyntaxKind.ColonToken) {
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
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenBraceToken);

            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
            var propertyAssignments = this.parseSeparatedSyntaxList(ListParsingState.ObjectLiteralExpression_PropertyAssignments);
            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

            return this.factory.objectLiteralExpression(
                openBraceToken, propertyAssignments, closeBraceToken);
        }

        private parsePropertyAssignment(): PropertyAssignmentSyntax {
            // Debug.assert(this.isPropertyAssignment(/*inErrorRecovery:*/ false));
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
            return this.currentToken().tokenKind === SyntaxKind.GetKeyword &&
                   this.isPropertyName(this.peekToken(1), /*inErrorRecovery:*/ false);
        }

        private parseGetAccessorPropertyAssignment(): GetAccessorPropertyAssignmentSyntax {
            // Debug.assert(this.isGetAccessorPropertyAssignment());

            var getKeyword = this.eatKeyword(SyntaxKind.GetKeyword);
            var propertyName = this.eatAnyToken();
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var block = this.parseBlock();

            return this.factory.getAccessorPropertyAssignment(getKeyword, propertyName, openParenToken, closeParenToken, block);
        }

        private isSetAccessorPropertyAssignment(): bool {
            return this.currentToken().tokenKind === SyntaxKind.SetKeyword &&
                   this.isPropertyName(this.peekToken(1), /*inErrorRecovery:*/ false);
        }

        private parseSetAccessorPropertyAssignment(): SetAccessorPropertyAssignmentSyntax {
            // Debug.assert(this.isSetAccessorPropertyAssignment());

            var setKeyword = this.eatKeyword(SyntaxKind.SetKeyword);
            var propertyName = this.eatAnyToken();
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var parameterName = this.eatIdentifierToken();
            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            var block = this.parseBlock();

            return this.factory.setAccessorPropertyAssignment(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
        }

        private isSimplePropertyAssignment(inErrorRecovery: bool): bool {
            return this.isPropertyName(this.currentToken(), inErrorRecovery);
        }

        private parseSimplePropertyAssignment(): SimplePropertyAssignmentSyntax {
            // Debug.assert(this.isSimplePropertyAssignment(/*inErrorRecovery:*/ false));

            var propertyName = this.eatAnyToken();
            var colonToken = this.eatToken(SyntaxKind.ColonToken);
            var expression = this.parseAssignmentExpression(/*allowIn:*/ true);

            return this.factory.simplePropertyAssignment(propertyName, colonToken, expression);
        }

        private isPropertyName(token: ISyntaxToken, inErrorRecovery: bool): bool {
            // NOTE: we do *not* want to check "this.isIdentifier" here.  Any IdentifierName is 
            // allowed here, even reserved words like keywords.
            if (ParserImpl.isIdentifierName(token)) {
                // Except: if we're in error recovery, then we don't want to consider keywords. 
                // After all, if we have:
                //
                //      { a: 1
                //      return
                //
                // we don't want consider 'return' to be the next property in the object literal.
                if (inErrorRecovery) {
                    return this.isIdentifier(token);
                }
                else {
                    return true;
                }
            }

            switch (token.tokenKind) {
                case SyntaxKind.StringLiteral:
                case SyntaxKind.NumericLiteral:
                    return true;

                default:
                    return false;
            }
        }

        private parseArrayLiteralExpression(): ArrayLiteralExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.OpenBracketToken);

            var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
            var expressions = this.parseSeparatedSyntaxList(ListParsingState.ArrayLiteralExpression_AssignmentExpressions);
            var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

            return this.factory.arrayLiteralExpression(openBracketToken, expressions, closeBracketToken);
        }

        private parseLiteralExpression(): IUnaryExpressionSyntax {
            // TODO: add appropriate asserts here.
            return this.eatAnyToken();
        }

        private parseThisExpression(): IUnaryExpressionSyntax {
            // Debug.assert(this.currentToken().tokenKind === SyntaxKind.ThisKeyword);
            var thisKeyword = this.eatKeyword(SyntaxKind.ThisKeyword);
            return thisKeyword;
        }

        private parseBlock(): BlockSyntax {
            var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);

            var statements: ISyntaxList = Syntax.emptyList;

            if (openBraceToken.width() > 0) {
                var savedIsInStrictMode = this.isInStrictMode;
                statements = this.parseSyntaxList(ListParsingState.Block_Statements, ParserImpl.updateStrictModeState);
                this.setStrictMode(savedIsInStrictMode);
            }

            var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);

            return this.factory.block(openBraceToken, statements, closeBraceToken);
        }

        private parseCallSignature(): CallSignatureSyntax {
            var typeParameterList = this.parseOptionalTypeParameterList();
            var parameterList = this.parseParameterList();
            var typeAnnotation = this.parseOptionalTypeAnnotation();

            return this.factory.callSignature(typeParameterList, parameterList, typeAnnotation);
        }

        private parseOptionalTypeParameterList(): TypeParameterListSyntax {
            if (this.currentToken().tokenKind !== SyntaxKind.LessThanToken) {
                return null;
            }

            var lessThanToken = this.eatToken(SyntaxKind.LessThanToken);
            var typeParameterList = this.parseSeparatedSyntaxList(ListParsingState.TypeParameterList_TypeParameters);
            var greaterThanToken = this.eatToken(SyntaxKind.GreaterThanToken);

            return this.factory.typeParameterList(lessThanToken, typeParameterList, greaterThanToken);
        }

        private isTypeParameter(): bool {
            return this.isIdentifier(this.currentToken());
        }
        
        private parseTypeParameter(): TypeParameterSyntax {
            // Debug.assert(this.isTypeParameter());
            var identifier = this.eatIdentifierToken();
            var constraint = this.parseOptionalConstraint();

            return this.factory.typeParameter(identifier, constraint);
        }

        private parseOptionalConstraint(): ConstraintSyntax {
            if (this.currentToken().kind() !== SyntaxKind.ExtendsKeyword) {
                return null;
            }

            var extendsKeyword = this.eatKeyword(SyntaxKind.ExtendsKeyword);
            var type = this.parseType(/*requireCompleteArraySuffix:*/ false);

            return this.factory.constraint(extendsKeyword, type);
        }

        private parseParameterList(): ParameterListSyntax {
            var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
            var parameters: ISeparatedSyntaxList = Syntax.emptySeparatedList;

            if (openParenToken.width() > 0) {
                parameters = this.parseSeparatedSyntaxList(ListParsingState.ParameterList_Parameters);
            }

            var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
            return this.factory.parameterList(openParenToken, parameters, closeParenToken);
        }

        private isTypeAnnotation(): bool {
            return this.currentToken().tokenKind === SyntaxKind.ColonToken;
        }

        private parseOptionalTypeAnnotation(): TypeAnnotationSyntax {
            return this.isTypeAnnotation()
                ? this.parseTypeAnnotation()
                : null;
        }

        private parseTypeAnnotation(): TypeAnnotationSyntax {
            // Debug.assert(this.isTypeAnnotation());

            var colonToken = this.eatToken(SyntaxKind.ColonToken);
            var type = this.parseType(/*requireCompleteArraySuffix:*/ false);

            return this.factory.typeAnnotation(colonToken, type);
        }

        private isType(allowFunctionType: bool, allowConstructorType: bool): bool {
            return this.isPredefinedType() ||
                   this.isTypeLiteral(allowFunctionType, allowConstructorType) ||
                   this.isName();
        }

        private parseType(requireCompleteArraySuffix: bool): ITypeSyntax {
            var type = this.parseNonArrayType();

            while (this.currentToken().tokenKind === SyntaxKind.OpenBracketToken) {
                if (requireCompleteArraySuffix && this.peekToken(1).tokenKind !== SyntaxKind.CloseBracketToken) {
                    break;
                }

                var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
                var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);

                type = this.factory.arrayType(type, openBracketToken, closeBracketToken);
            }

            return type;
        }

        private parseNonArrayType(): ITypeSyntax {
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

        private parseTypeLiteral(): ITypeSyntax {
            // Debug.assert(this.isTypeLiteral(/*allowFunctionType:*/ true, /*allowConstructorType:*/ true));
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
            // Debug.assert(this.isFunctionType());

            var typeParameterList = this.parseOptionalTypeParameterList();
            var parameterList = this.parseParameterList();
            var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
            var returnType = this.parseType(/*requireCompleteArraySuffix:*/ false);

            return this.factory.functionType(typeParameterList, parameterList, equalsGreaterThanToken, returnType);
        }

        private parseConstructorType(): ConstructorTypeSyntax {
            // Debug.assert(this.isConstructorType());

            var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);
            var parameterList = this.parseParameterList();
            var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
            var type = this.parseType(/*requreCompleteArraySuffix:*/ false);

            return this.factory.constructorType(newKeyword, null, parameterList, equalsGreaterThanToken, type);
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
            return this.currentToken().tokenKind === SyntaxKind.OpenBraceToken;
        }

        private isFunctionType(): bool {
            var tokenKind = this.currentToken().tokenKind;
            return tokenKind === SyntaxKind.OpenParenToken || tokenKind === SyntaxKind.LessThanToken;
        }

        private isConstructorType(): bool {
            return this.currentToken().tokenKind === SyntaxKind.NewKeyword;
        }

        private parsePredefinedType(): ITypeSyntax {
            // Debug.assert(this.isPredefinedType());
            var keyword = this.eatAnyToken();
            return keyword;
        }

        private isPredefinedType(): bool {
            switch (this.currentToken().tokenKind) {
                case SyntaxKind.AnyKeyword:
                case SyntaxKind.NumberKeyword:
                case SyntaxKind.BooleanKeyword:
                case SyntaxKind.BoolKeyword:
                case SyntaxKind.StringKeyword:
                case SyntaxKind.VoidKeyword:
                    return true;
            }

            return false;
        }

        private isParameter(): bool {
            if (this.currentNode() !== null && this.currentNode().kind() === SyntaxKind.Parameter) {
                return true;
            }

            var token = this.currentToken();
            if (token.tokenKind === SyntaxKind.DotDotDotToken) {
                return true;
            }

            if (token.tokenKind === SyntaxKind.PublicKeyword ||
                token.tokenKind === SyntaxKind.PrivateKeyword) {
                return true;
            }

            return this.isIdentifier(token);
        }

        private parseParameter(): ParameterSyntax {
            if (this.currentNode() !== null && this.currentNode().kind() === SyntaxKind.Parameter) {
                return <ParameterSyntax>this.eatNode();
            }

            var dotDotDotToken = this.tryEatToken(SyntaxKind.DotDotDotToken);

            var publicOrPrivateToken: ISyntaxToken = null;
            if (this.currentToken().tokenKind === SyntaxKind.PublicKeyword ||
                this.currentToken().tokenKind === SyntaxKind.PrivateKeyword) {
                publicOrPrivateToken = this.eatAnyToken();
            }

            var identifier = this.eatIdentifierToken();
            var questionToken = this.tryEatToken(SyntaxKind.QuestionToken);
            var typeAnnotation = this.parseOptionalTypeAnnotation();

            var equalsValueClause: EqualsValueClauseSyntax = null;
            if (this.isEqualsValueClause()) {
                equalsValueClause = this.parseEqualsValuesClause(/*allowIn:*/ true);
            }

            return this.factory.parameter(
                dotDotDotToken, publicOrPrivateToken, identifier, questionToken, typeAnnotation, equalsValueClause);
        }

        private parseSyntaxList(currentListType: ListParsingState,
                                processItems: (parser: ParserImpl, items: any[]) => void = null): ISyntaxList {
            var savedListParsingState = this.listParsingState;
            this.listParsingState |= currentListType;

            var result = this.parseSyntaxListWorker(currentListType, processItems);

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
        private abortParsingListOrMoveToNextToken(currentListType: ListParsingState, itemCount: number): bool {
            // Ok.  We're at a token that is not a terminator for the list and wasn't the start of 
            // an item in the list. Definitely report an error for this token.
            this.reportUnexpectedTokenDiagnostic(currentListType);

            // Now, check if the token is a terminator for one our parent lists, or the start of an
            // item in one of our parent lists.  If so, we won't want to consume the token.  We've 
            // already reported the error, so just return to our caller so that a higher up 
            // production can consume it.
            for (var state = ListParsingState.LastListParsingState;
                 state >= ListParsingState.FirstListParsingState;
                 state >>= 1) {

                if ((this.listParsingState & state) !== 0) {
                    if (this.isExpectedListTerminator(state, itemCount) || this.isExpectedListItem(state, /*inErrorRecovery:*/ true)) {
                        // Abort parsing this list.
                        return true;
                    }
                }
            }

            // Otherwise, if none of the lists we're in can capture this token, then we need to 
            // unilaterally skip it.  Note: we've already reported an error above.
            var token = this.currentToken();
            this.skippedTokens.push({ skippedToken: token, owningToken: this.previousToken() });

            // Consume this token and move onto the next item in the list.
            this.moveToNextToken();

            // Continue parsing this list.
            return false;
        }

        private tryParseExpectedListItem(currentListType: ListParsingState,
                                         inErrorRecovery: bool,
                                         items: ISyntaxElement[],
                                         processItems: (parser: ParserImpl, items: any[]) => void ): any[] {
            if (this.isExpectedListItem(currentListType, inErrorRecovery)) {
                var item = this.parseExpectedListItem(currentListType);
                // Debug.assert(item !== null);

                items = items || [];
                items.push(item);

                if (processItems !== null) {
                    processItems(this, items);
                }
            }

            return items;
        }

        private listIsTerminated(currentListType: ListParsingState, itemCount: number): bool {
            return this.isExpectedListTerminator(currentListType, itemCount) ||
                   this.currentToken().tokenKind === SyntaxKind.EndOfFileToken;
        }

        private parseSyntaxListWorker(currentListType: ListParsingState,
                                      processItems: (parser: ParserImpl, items: any[]) => void ): ISyntaxList {
            var items: SyntaxNode[] = null;

            while (true) {
                // Try to parse an item of the list.  If we fail then decide if we need to abort or 
                // continue parsing.
                var oldItemsCount = items === null ? 0 : items.length;
                items = this.tryParseExpectedListItem(currentListType, /*inErrorRecovery:*/ false, items, processItems);

                var newItemsCount = items === null ? 0 : items.length;
                if (newItemsCount === oldItemsCount) {
                    // We weren't able to parse out a list element.

                    // That may have been because the list is complete.  In that case, break out 
                    // and return the items we were able parse.
                    if (this.listIsTerminated(currentListType, newItemsCount)) {
                        break
                    }

                    // List wasn't complete and we didn't get an item.  Figure out if we should bail out
                    // or skip a token and continue.
                    var abort = this.abortParsingListOrMoveToNextToken(currentListType, newItemsCount);
                    if (abort) {
                        break;
                    }
                }

                // We either parsed an element.  Or we failed to, but weren't at the end of the list
                // and didn't want to abort. Continue parsing elements.
            }

            return Syntax.list(items);
        }

        private parseSeparatedSyntaxListWorker(currentListType: ListParsingState): ISeparatedSyntaxList {
            var items: ISyntaxNodeOrToken[] = null;

            var allowAutomaticSemicolonInsertion = this.allowsAutomaticSemicolonInsertion(currentListType);
            var separatorKind = this.separatorKind(currentListType);

            var inErrorRecovery = false;
            var listWasTerminated = false;
            while (true) {
                // Try to parse an item of the list.  If we fail then decide if we need to abort or 
                // continue parsing.
                var oldItemsCount = items === null ? 0 : items.length;
                // Debug.assert(oldItemsCount % 2 === 0);
                items = this.tryParseExpectedListItem(currentListType, inErrorRecovery, items, null);
                
                var newItemsCount = items === null ? 0 : items.length;
                if (newItemsCount === oldItemsCount) {
                    // We weren't able to parse out a list element.
                    // Debug.assert(items === null || items.length % 2 === 0);
                    
                    // That may have been because the list is complete.  In that case, break out 
                    // and return the items we were able parse.
                    if (this.listIsTerminated(currentListType, newItemsCount)) {
                        listWasTerminated = true;
                        break;
                    }
                    
                    // List wasn't complete and we didn't get an item.  Figure out if we should bail out
                    // or skip a token and continue.
                    var abort = this.abortParsingListOrMoveToNextToken(currentListType, oldItemsCount);
                    if (abort) {
                        break;
                    }
                    else {
                        // We just skipped a token.  We're now in error recovery mode.
                        inErrorRecovery = true;
                        continue;
                    }
                }

                // Debug.assert(newItemsCount % 2 === 1);

                // We were able to successfully parse out a list item.  So we're no longer in error
                // recovery.
                inErrorRecovery = false;

                // Now, we have to see if we have a separator or not.  If we do have a separator
                // we've got to consume it and continue trying to parse list items.
                if (this.currentToken().tokenKind === separatorKind) {
                    // Consume the last separator and continue parsing list elements.
                    items.push(this.eatToken(separatorKind));
                    continue;
                }

                // We didn't see the expected separator.  There are two reasons this might happen.
                // First, we may actually be at the end of the list.  If we are, then we're done
                // parsing list elements.  
                if (this.listIsTerminated(currentListType, newItemsCount)) {
                    listWasTerminated = true;
                    break;
                }

                // Otherwise, it might be a case where we can parse out an implicit semicolon.

                // Note: it's important that we check this *after* the check above for
                // 'listIsTerminated'.  Consider the following case:
                //
                //      {
                //          a       // <-- just finished parsing 'a'
                //      }
                //
                // Automatic semicolon insertion rules state: "When, as the program is parsed from
                // left to right, a token (called the offending token) is encountered that is not 
                // allowed by any production of the grammar".  So we should only ever insert a 
                // semicolon if we couldn't consume something normally.  in the above case, we can
                // consume the '}' just fine.  So ASI doesn't apply.

                if (allowAutomaticSemicolonInsertion && this.canEatAutomaticSemicolon(/*allowWithoutNewline:*/ false)) {
                    items.push(this.eatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false));
                    // Debug.assert(items.length % 2 === 0);
                    continue;
                }

                // We weren't at the end of the list.  And thre was no separator we could parse out.
                // Try parse the separator we expected, and continue parsing more list elements.
                // This time mark that we're in error recovery mode though.
                //
                // Note: trying to eat this token will emit the appropriate diagnostic.
                items.push(this.eatToken(separatorKind));

                // Now that we're in 'error recovery' mode we cantweak some parsing rules as 
                // appropriate.  For example, if we have:
                //
                //      var v = { a
                //      return
                //
                // Then we'll be missing the comma.  As such, we want to parse 'return' in a less
                // tolerant manner.  Normally 'return' could be a property in an object literal.
                // However, in error recovery mode, we do *not* want it to be.
                //
                // Continue trying to parse out list elements.
                inErrorRecovery = true;
            }

            // Now that we're done parsing, ensure the list is properly formed.
            var allowTrailingSeparator = this.allowsTrailingSeparator(currentListType);
            var requiresAtLeastOneItem = this.requiresAtLeastOneItem(currentListType);

            // If this list requires at least one argument, then report an error if we haven't 
            // gotten any.
            if (requiresAtLeastOneItem && items === null) {
                this.reportUnexpectedTokenDiagnostic(currentListType);
            }
            else {
                // If the list ended with a trailing separator, and that's not allowed, then report
                // an error for it.  Only do this if the list was successfully terminated.  We don't
                // want to report multiple errors if we're missing the closing terminator and we 
                // have a trailing separator.
                if (listWasTerminated &&
                    !allowTrailingSeparator &&
                    items !== null &&
                    items.length % 2 === 0 &&
                    items[items.length - 1] === this.previousToken()) {

                    this.addDiagnostic(new SyntaxDiagnostic(
                        this.previousTokenStart(), this.previousToken().width(), DiagnosticCode.Trailing_separator_not_allowed, null));
                }
            }

            return Syntax.separatedList(items);
        }

        private allowsTrailingSeparator(currentListType: ListParsingState): bool {
            switch (currentListType) {
                case ListParsingState.EnumDeclaration_VariableDeclarators:
                case ListParsingState.ObjectType_TypeMembers:
                case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                    return true;

                case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                case ListParsingState.ArgumentList_AssignmentExpressions:
                case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
                case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                case ListParsingState.ParameterList_Parameters:
                    // TODO: It would be great to allow trailing separators for parameters.
                case ListParsingState.TypeArgumentList_Types:
                case ListParsingState.TypeParameterList_TypeParameters:
                    return false;

                case ListParsingState.SourceUnit_ModuleElements:
                case ListParsingState.ClassDeclaration_ClassElements:
                case ListParsingState.ModuleDeclaration_ModuleElements:
                case ListParsingState.SwitchStatement_SwitchClauses:
                case ListParsingState.SwitchClause_Statements:
                case ListParsingState.Block_Statements:
                default:
                    throw Errors.notYetImplemented();
            }
        }

        private requiresAtLeastOneItem(currentListType: ListParsingState): bool {
            switch (currentListType) {
                case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
                case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                case ListParsingState.TypeArgumentList_Types:
                case ListParsingState.TypeParameterList_TypeParameters:
                    return true;

                case ListParsingState.ObjectType_TypeMembers:
                case ListParsingState.EnumDeclaration_VariableDeclarators:
                case ListParsingState.ArgumentList_AssignmentExpressions:
                case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                case ListParsingState.ParameterList_Parameters:
                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                    return false;

                case ListParsingState.SourceUnit_ModuleElements:
                case ListParsingState.ClassDeclaration_ClassElements:
                case ListParsingState.ModuleDeclaration_ModuleElements:
                case ListParsingState.SwitchStatement_SwitchClauses:
                case ListParsingState.SwitchClause_Statements:
                case ListParsingState.Block_Statements:
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
                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                case ListParsingState.TypeArgumentList_Types:
                case ListParsingState.TypeParameterList_TypeParameters:
                    return false;

                case ListParsingState.SourceUnit_ModuleElements:
                case ListParsingState.ClassDeclaration_ClassElements:
                case ListParsingState.ModuleDeclaration_ModuleElements:
                case ListParsingState.SwitchStatement_SwitchClauses:
                case ListParsingState.SwitchClause_Statements:
                case ListParsingState.Block_Statements:
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
                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                case ListParsingState.TypeArgumentList_Types:
                case ListParsingState.TypeParameterList_TypeParameters:
                    return SyntaxKind.CommaToken;

                case ListParsingState.ObjectType_TypeMembers:
                    return SyntaxKind.SemicolonToken;

                case ListParsingState.SourceUnit_ModuleElements:
                case ListParsingState.ClassDeclaration_ClassElements:
                case ListParsingState.ModuleDeclaration_ModuleElements:
                case ListParsingState.SwitchStatement_SwitchClauses:
                case ListParsingState.SwitchClause_Statements:
                case ListParsingState.Block_Statements:
                default:
                    throw Errors.notYetImplemented();
            }
        }

        private reportUnexpectedTokenDiagnostic(listType: ListParsingState): void {
            var token = this.currentToken();

            var diagnostic = new SyntaxDiagnostic(
                this.currentTokenStart(), token.width(), DiagnosticCode.Unexpected_token__0_expected, [this.getExpectedListElementType(listType)]);
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

        private isExpectedListTerminator(currentListType: ListParsingState, itemCount: number): bool {
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

                case ListParsingState.Block_Statements:
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
                    return this.isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator(itemCount);

                case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                    return this.isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator();

                case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                    return this.isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator();

                case ListParsingState.ParameterList_Parameters:
                    return this.isExpectedParameterList_ParametersTerminator();

                case ListParsingState.TypeArgumentList_Types:
                    return this.isExpectedTypeArgumentList_TypesTerminator();

                case ListParsingState.TypeParameterList_TypeParameters:
                    return this.isExpectedTypeParameterList_TypeParametersTerminator();

                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                    return this.isExpectedLiteralExpression_AssignmentExpressionsTerminator();

                default:
                    throw Errors.invalidOperation();
            }
        }

        private isExpectedSourceUnit_ModuleElementsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.EndOfFileToken;
        }

        private isExpectedEnumDeclaration_VariableDeclaratorsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExpectedModuleDeclaration_ModuleElementsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExpectedObjectType_TypeMembersTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExpectedLiteralExpression_AssignmentExpressionsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBracketToken;
        }

        private isExpectedTypeArgumentList_TypesTerminator(): bool {
            var token = this.currentToken();
            if (token.tokenKind === SyntaxKind.GreaterThanToken) {
                return true;
            }

            // If we're at a token that can follow the type argument list, then we'll also consider
            // the list terminated.
            if (this.canFollowTypeArgumentListInExpression(token.tokenKind)) {
                return true;
            }

            // TODO: add more cases as necessary for error tolerance.
            return false;
        }

        private isExpectedTypeParameterList_TypeParametersTerminator(): bool {
            var token = this.currentToken();
            if (token.tokenKind === SyntaxKind.GreaterThanToken) {
                return true;
            }

            // These commonly follow type parameter lists.
            if (token.tokenKind === SyntaxKind.OpenParenToken ||
                token.tokenKind === SyntaxKind.OpenBraceToken ||
                token.tokenKind === SyntaxKind.ExtendsKeyword ||
                token.tokenKind === SyntaxKind.ImplementsKeyword) {
                return true;
            }

            // TODO: add more cases as necessary for error tolerance.
            return false;
        }

        private isExpectedParameterList_ParametersTerminator(): bool {
            var token = this.currentToken();
            if (token.tokenKind === SyntaxKind.CloseParenToken) {
                return true;
            }

            // We may also see a { in an error case.  i.e.:
            // function (a, b, c  {
            if (token.tokenKind === SyntaxKind.OpenBraceToken) {
                return true;
            }

            // We may also see a => in an error case.  i.e.:
            // (f: number => { ... }
            if (token.tokenKind === SyntaxKind.EqualsGreaterThanToken) {
                return true;
            }

            return false;
        }

        private isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator(): bool {
            // This is the case when we're parsing variable declarations in a for/for-in statement.
            if (this.currentToken().tokenKind === SyntaxKind.SemicolonToken ||
                this.currentToken().tokenKind === SyntaxKind.CloseParenToken) {
                return true;
            }

            if (this.currentToken().tokenKind === SyntaxKind.InKeyword) {
                return true;
            }

            return false;
        }

        private isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator(itemCount: number): bool {
            //// This is the case when we're parsing variable declarations in a variable statement.

            // If we just parsed a comma, then we can't terminate this list.  i.e.:
            //      var a = bar, // <-- just consumed the comma
            //          b = baz;
            if (this.previousToken().tokenKind === SyntaxKind.CommaToken) {
                return false;
            }

            // ERROR RECOVERY TWEAK:
            // For better error recovery, if we see a => then we just stop immediately.  We've got an
            // arrow function here and it's going to be veyr unlikely that we'll resynchronize and get
            // another variable declaration.
            if (this.currentToken().tokenKind === SyntaxKind.EqualsGreaterThanToken) {
                return true;
            }

            // We're done when we can eat a semicolon and we've parsed at least one item.
            return itemCount > 0 && this.canEatExplicitOrAutomaticSemicolon(/*allowWithoutNewline:*/ false);
        }

        private isExpectedExtendsOrImplementsClause_TypeNameListTerminator(): bool {
            if (this.currentToken().tokenKind === SyntaxKind.ExtendsKeyword ||
                this.currentToken().tokenKind === SyntaxKind.ImplementsKeyword) {
                return true;
            }

            if (this.currentToken().tokenKind === SyntaxKind.OpenBraceToken ||
                this.currentToken().tokenKind === SyntaxKind.CloseBraceToken) {
                return true;
            }

            return false;
        }

        private isExpectedArgumentList_AssignmentExpressionsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseParenToken;
        }

        private isExpectedClassDeclaration_ClassElementsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExpectedSwitchStatement_SwitchClausesTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExpectedSwitchClause_StatementsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken ||
                   this.isSwitchClause();
        }

        private isExpectedBlock_StatementsTerminator(): bool {
            return this.currentToken().tokenKind === SyntaxKind.CloseBraceToken;
        }

        private isExtendsOrImplementsClause(): bool {
            if (this.currentToken().tokenKind === SyntaxKind.ImplementsKeyword ||
                this.currentToken().tokenKind === SyntaxKind.ExtendsKeyword) {

                return this.isIdentifier(this.peekToken(1));
            }

            return false;
        }

        private isExtendsOrImplementsClauseTypeName(): bool {
            if (this.isName()) {
                // We want to make sure that the "extends" in "extends foo" or the "implements" in
                // "implements foo" is not considered a type name.
                return !this.isExtendsOrImplementsClause();
            }

            return false;
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
                    return this.isStatement();

                case ListParsingState.Block_Statements:
                    return this.isStatement();

                case ListParsingState.EnumDeclaration_VariableDeclarators:
                case ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn:
                case ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn:
                    return this.isVariableDeclarator();

                case ListParsingState.ObjectType_TypeMembers:
                    return this.isTypeMember();

                case ListParsingState.ArgumentList_AssignmentExpressions:
                    return this.isExpression();

                case ListParsingState.ExtendsOrImplementsClause_TypeNameList:
                    return this.isExtendsOrImplementsClauseTypeName();

                case ListParsingState.ObjectLiteralExpression_PropertyAssignments:
                    return this.isPropertyAssignment(inErrorRecovery);

                case ListParsingState.ParameterList_Parameters:
                    return this.isParameter();

                case ListParsingState.TypeArgumentList_Types:
                    return this.isType(/*allowFunctionType:*/ true, /*allowConstructorType:*/ true);

                case ListParsingState.TypeParameterList_TypeParameters:
                    return this.isTypeParameter();

                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                    return this.isAssignmentOrOmittedExpression();

                default:
                    throw Errors.invalidOperation();
            }
        }

        private parseExpectedListItem(currentListType: ListParsingState): ISyntaxNodeOrToken {
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
                    return this.parseStatement();

                case ListParsingState.Block_Statements:
                    return this.parseStatement();

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
                    return this.parseAssignmentOrOmittedExpression();

                case ListParsingState.ParameterList_Parameters:
                    return this.parseParameter();

                case ListParsingState.TypeArgumentList_Types:
                    return this.parseType(/*requireCompleteArraySuffix:*/ false);

                case ListParsingState.TypeParameterList_TypeParameters:
                    return this.parseTypeParameter();

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

                case ListParsingState.Block_Statements:
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

                case ListParsingState.TypeArgumentList_Types:
                    return Strings.type;

                case ListParsingState.TypeParameterList_TypeParameters:
                    return Strings.type_parameter;

                case ListParsingState.ArrayLiteralExpression_AssignmentExpressions:
                    return Strings.expression;

                default:
                    throw Errors.invalidOperation();
            }
        }
    }

    export function parse(text: IText,
                          languageVersion: LanguageVersion = LanguageVersion.EcmaScript5,
                          stringTable: Collections.StringTable = null,
                          options?: ParseOptions = null): SyntaxTree {
        var source = new NormalParserSource(text, languageVersion, stringTable);
        options = options || new ParseOptions();

        return new ParserImpl(source, options).parseSyntaxTree();
    }

    export function incrementalParse(oldSourceUnit: SourceUnitSyntax,
                                     textChangeRanges: TextChangeRange[],
                                     newText: IText,
                                     languageVersion: LanguageVersion = LanguageVersion.EcmaScript5,
                                     stringTable: Collections.StringTable = null,
                                     options?: ParseOptions = null): SyntaxTree {
        var source = new IncrementalParserSource(
            oldSourceUnit, textChangeRanges, newText, languageVersion, stringTable);
        options = options || new ParseOptions();

        return new ParserImpl(source, options).parseSyntaxTree();
    }
}