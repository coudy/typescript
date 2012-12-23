///<reference path='..\ArrayUtilities.ts' />
///<reference path='..\Parser.ts' />
///<reference path='..\StringTable.ts' />
///<reference path='..\StringUtilities.ts' />
///<reference path='..\TextChangeRange.ts' />
///<reference path='..\TextFactory.ts' />

class SyntaxElementsCollector extends SyntaxWalker {
    private elements: ISyntaxElement[] = [];

    private visitNode(node: SyntaxNode) {
        this.elements.push(node);
        super.visitNode(node);
    }

    private visitToken(token: ISyntaxToken) {
        this.elements.push(token);
    }

    public static collectElements(node: SourceUnitSyntax): ISyntaxElement[] {
        var collector = new SyntaxElementsCollector();
        node.accept(collector);
        return collector.elements;
    }
}

class IncrementalParserTests {
    private static stringTable = Collections.createStringTable();

    public static runAllTests() {
        for (var name in IncrementalParserTests) {
            if (IncrementalParserTests.hasOwnProperty(name) && StringUtilities.startsWith(name, "test")) {
                IncrementalParserTests[name]();
            }
        }
    }

    private static withChange(text: IText, start: number, length: number, newText: string): { text: IText; textChangeRange: TextChangeRange; } {
        var contents = text.toString();
        var newContents = contents.substr(0, start) + newText + contents.substring(start + length);

        return { text: TextFactory.create(newContents), textChangeRange: new TextChangeRange(new TextSpan(start, length), newText.length) }
    }

    private static withInsert(text: IText, start: number, newText: string): { text: IText; textChangeRange: TextChangeRange; } {
        return IncrementalParserTests.withChange(text, start, 0, newText);
    }

    private static reusedElements(oldNode: SourceUnitSyntax, newNode: SourceUnitSyntax): number {
        var allOldElements = SyntaxElementsCollector.collectElements(oldNode);
        var allNewElements = SyntaxElementsCollector.collectElements(newNode);

        return ArrayUtilities.where(allOldElements, 
            v => ArrayUtilities.contains(allNewElements, v)).length;
    }

    private static compareTrees(oldText: IText, newText: IText, textChangeRange: TextChangeRange, reusedNodes: number): void {
        var oldTree = Parser.parse(oldText, LanguageVersion.EcmaScript5, stringTable);
        
        var newTree = Parser.parse(newText, LanguageVersion.EcmaScript5, stringTable);
        var incrementalNewTree = Parser.incrementalParse(
            oldTree.sourceUnit(), [textChangeRange], newText, LanguageVersion.EcmaScript5, stringTable);
        
        Debug.assert(ArrayUtilities.sequenceEquals(newTree.diagnostics(), incrementalNewTree.diagnostics(), SyntaxDiagnostic.equals));
        Debug.assert(newTree.sourceUnit().structuralEquals(incrementalNewTree.sourceUnit()));
        
        Debug.assert(IncrementalParserTests.reusedElements(oldTree.sourceUnit(), newTree.sourceUnit()) === 0);
        Debug.assert(IncrementalParserTests.reusedElements(oldTree.sourceUnit(), incrementalNewTree.sourceUnit()) === reusedNodes);
    }

    public static testIncremental1() {
        var source = "class C {\r\n";
        source += "    public foo1() { }\r\n";
        source += "    public foo2() {\r\n";
        source += "        return 1;\r\n";
        source += "    }\r\n";
        source += "    public foo3() { }\r\n";
        source += "}"

        var semicolonIndex = source.indexOf(";");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, semicolonIndex, " + 1");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 1);
    }
}