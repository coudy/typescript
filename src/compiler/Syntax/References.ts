///<reference path='..\Text\References.ts' />

///<reference path='..\..\harness\external\json2stringify.ts' />
///<reference path='CharacterInfo.ts' />
///<reference path='Constants.ts' />
///<reference path='Diagnostic.ts' />
///<reference path='DiagnosticCode.ts' />
///<reference path='FormattingOptions.ts' />
///<reference path='Indentation.ts' />
///<reference path='ISeparatedSyntaxList.ts' />
///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxList.ts' />
///<reference path='ISyntaxNodeOrToken.ts' />
///<reference path='ISyntaxToken.ts' />
///<reference path='ISyntaxTrivia.ts' />
///<reference path='ISyntaxTriviaList.ts' />
///<reference path='LanguageVersion.ts' />
///<reference path='ParseOptions.ts' />
///<reference path='PositionedElement.ts' />
///<reference path='Scanner.ts' />
///<reference path='ScannerUtilities.generated.ts' />
///<reference path='SeparatedSyntaxList.ts' />
///<reference path='SlidingWindow.ts' />
///<reference path='Strings.ts' />
///<reference path='Syntax.ts' />
///<reference path='SyntaxDiagnostic.ts' />
///<reference path='SyntaxFactory.generated.ts' />
///<reference path='SyntaxFacts.ts' />
///<reference path='SyntaxFacts2.ts' />
///<reference path='SyntaxKind.ts' />
///<reference path='SyntaxList.ts' />
///<reference path='SyntaxNode.ts' />
///<reference path='SyntaxNodes.generated.ts' />
///<reference path='SyntaxRewriter.generated.ts' />

// SyntaxDedenter depends on SyntaxRewriter
///<reference path='SyntaxDedenter.ts' />
// SyntaxIndenter depends on SyntaxRewriter
///<reference path='SyntaxIndenter.ts' />

///<reference path='SyntaxToken.generated.ts' />
///<reference path='SyntaxToken.ts' />
///<reference path='SyntaxTokenReplacer.ts' />
///<reference path='SyntaxTree.ts' />
///<reference path='SyntaxTrivia.ts' />
///<reference path='SyntaxTriviaList.ts' />
///<reference path='SyntaxUtilities.ts' />
///<reference path='SyntaxVisitor.generated.ts' />
///<reference path='SyntaxWalker.generated.ts' />

// PositionTrackingWalker depends on SyntaxWalker
///<reference path='PositionTrackingWalker.ts' />

// SyntaxInformationMap depends on SyntaxWalker
///<reference path='SyntaxInformationMap.ts' />

// SyntaxInformationMap depends on SyntaxWalker
///<reference path='SyntaxNodeInvariantsChecker.ts' />

// DepthLimitedWalker depends on PositionTrackingWalker
///<reference path='DepthLimitedWalker.ts' />

// Parser depends on PositionTrackingWalker
///<reference path='Parser.ts' />

///<reference path='TextSpanWalker.ts' />
///<reference path='Unicode.ts' />
