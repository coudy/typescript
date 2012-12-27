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

    private static withDelete(text: IText, start: number, length: number): { text: IText; textChangeRange: TextChangeRange; } {
        return IncrementalParserTests.withChange(text, start, length, "");
    }

    private static reusedElements(oldNode: SourceUnitSyntax, newNode: SourceUnitSyntax): number {
        var allOldElements = SyntaxElementsCollector.collectElements(oldNode);
        var allNewElements = SyntaxElementsCollector.collectElements(newNode);

        return ArrayUtilities.where(allOldElements, 
            v => ArrayUtilities.contains(allNewElements, v)).length;
    }

    // NOTE: 'reusedElements' is the expected count of elements reused from the old tree to the new
    // tree.  It may change as we tweak the parser.  If the count increases then that should always
    // be a good thing.  If it decreases, that's not great (less reusability), but that may be 
    // unavoidable.  If it does decrease an investigation 
    private static compareTrees(oldText: IText, newText: IText, textChangeRange: TextChangeRange, reusedElements: number): void {
        var oldTree = Parser.parse(oldText, LanguageVersion.EcmaScript5, stringTable);
        
        var newTree = Parser.parse(newText, LanguageVersion.EcmaScript5, stringTable);
        var incrementalNewTree = Parser.incrementalParse(
            oldTree.sourceUnit(), [textChangeRange], newText, LanguageVersion.EcmaScript5, stringTable);
        
        // We should get the same tree when doign a full or incremental parse.
        Debug.assert(newTree.structuralEquals(incrementalNewTree));
        
        // There should be no reused nodes between two trees that are fully parsed.
        Debug.assert(IncrementalParserTests.reusedElements(oldTree.sourceUnit(), newTree.sourceUnit()) === 0);
        Debug.assert(IncrementalParserTests.reusedElements(oldTree.sourceUnit(), incrementalNewTree.sourceUnit()) === reusedElements);
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

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 32);
    }

    public static testIncremental2() {
        var source = "class C {\r\n";
        source += "    public foo1() { }\r\n";
        source += "    public foo2() {\r\n";
        source += "        return 1 + 1;\r\n";
        source += "    }\r\n";
        source += "    public foo3() { }\r\n";
        source += "}"

        var index = source.indexOf("+ 1");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withDelete(oldText, index, 3);

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 29);
    }

    public static testIncrementalRegex1() {
        var source = "class C { public foo1() { /; } public foo2() { return 1;} public foo3() { } }";

        var semicolonIndex = source.indexOf(";}");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, semicolonIndex, "/");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 21);
    }

    public static testIncrementalComment1() {
        var source = "class C { public foo1() { /; } public foo2() { return 1; } public foo3() { } }";

        var semicolonIndex = source.indexOf(";");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, semicolonIndex, "/");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 7);
    }

    public static testIncrementalComment2() {
        var source = "class C { public foo1() { /; } public foo2() { return 1; } public foo3() { } }";

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, 0, "//");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 0);
    }

    public static testIncrementalComment3() {
        var source = "//class C { public foo1() { /; } public foo2() { return 1; } public foo3() { } }";

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withDelete(oldText, 0, 2);

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 0);
    }

    public static testIncrementalComment4() {
        var source = "class C { public foo1() { /; } public foo2() { */ return 1; } public foo3() { } }";
        
        var index = source.indexOf(";");
        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, index, "*");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 22);
    }

    public static testParameter1() {
        // Should be able to reuse all the parameters.
        var source = "class C {\r\n";
        source += "    public foo2(a, b, c, d) {\r\n";
        source += "        return 1;\r\n";
        source += "    }\r\n";
        source += "}"

        var semicolonIndex = source.indexOf(";");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, semicolonIndex, " + 1");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 23);
    }

    public static testTypeMember1() {
        // Should be able to reuse most of the type members.
        var source = "interface I { a: number; b: string; (c): d; new (e): f; g(): h }";

        var index = source.indexOf(": string");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withInsert(oldText, index, "?");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 41);
    }

    public static testVariableDeclarator1() {
        // Should be able to reuse most of the variable declarators.
        var source = "enum E { a = 1, b = 1 << 1, c = 3, e = 4, f = 5, g = 7, h = 8, i = 9, j = 10 }";

        var index = source.indexOf("<<");

        var oldText = TextFactory.create(source);
        var newTextAndChange = IncrementalParserTests.withChange(oldText, index, 2, "+");

        IncrementalParserTests.compareTrees(oldText, newTextAndChange.text, newTextAndChange.textChangeRange, 53);
    }
}