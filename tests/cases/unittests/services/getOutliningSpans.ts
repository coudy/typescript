///<reference path='_project.ts'/>

interface IOutliningTest {
    name: string;
    contents: string;
    instance: number;
}

describe('getOutliningSpans', function() {
    debugger;

    var __typescriptLS = new Harness.TypeScriptLS();

    function runTest(test: IOutliningTest) {
        function getLocation(text: string, char: string, occurance = 0) {
            var index = -1;
            var count = 0;

            do {
                index = text.indexOf(char, index);
                if (count == occurance) {
                    return index;
                }
                count++;
                index++;
            } while (index >= 0);
            return -1;
        }

        function regionStart(text: string, occurance = 0) {
            return getLocation(text, '{', occurance);
        }

        function regionEnd(text: string, occurance = 0) {
            var location = getLocation(text, '}', occurance);
            if (location >= 0)
                location += 1;
            return location;
        }

        // setup the test
        __typescriptLS.addScript(test.name, test.contents);
        var __ls = __typescriptLS.getLanguageService();

        // run it
        var result = __ls.pullLanguageService.getOutliningSpans(test.name);

        // verify results
        assert.notNull(result);

        var expectedResultsCount = test.instance + 1;
        var openingCurlyCount = test.instance;
        var closingCurlyCount = result.length - test.instance - 1;

        assert.is(result.length >= expectedResultsCount, "Expected to have at least " + expectedResultsCount + " results, but got " + result.length);
        assert.equal(regionStart(test.contents, openingCurlyCount), result[test.instance].start());
        assert.equal(regionEnd(test.contents, closingCurlyCount) , result[test.instance].end());
    }
    
    describe("test cases for Outlining Spans", function() {
        it("outlining for class declarionion", function() {
            runTest({
                name: "classDeclarationFileName.ts",
                contents: "class ClassFoo {\r\n}",
                instance: 0
            });
        });

        it("outlining for interface declarionion", function() {
            runTest({
                name: "interfaceDeclarationFileName.ts",
                contents: "interface IFoo {\r\n }",
                instance: 0
            });
        });

        it("outlining for module declarionion", function() {
            runTest({
                name: "moduleDeclarationFileName.ts",
                contents: "module moduleFoo {\r\n }",
                instance: 0
            });
        });

        it("outlining for enum declarionion", function() {
            runTest({
                name: "enumDeclarationFileName.ts",
                contents: "enum enumFoo {\r\n }",
                instance: 0
            });
        });

        it("outlining for function declarionion", function() {
            runTest({
                name: "functionDeclarationFileName.ts",
                contents: "function functionFoo () {\r\n return 0; \r\n }",
                instance: 0
            });
        });

        it("outlining for method declarionion", function() {
            runTest({
                name: "methodDeclarationFileName.ts",
                contents: "\
class C { \r\n \
    public foo(): number { \r\n \
        return 0; \r\n\
    }\r\n \
}",
                instance: 1
            });
        });


        it("outlining for constructor declarionion", function() {
            runTest({
                name: "constructorDeclarationFileName.ts",
                contents: "\
class D { \r\n \
   constructor() { \r\n \
   }\r\n \
}",
                instance: 1
            });
        });

        it("outlining for getter declarionion", function() {
            runTest({
                name: "getterDeclarationFileName.ts",
                contents: "\
class E { \r\n \
  public get X() { \r\n \
    return 1; \r\n \
  }\r\n \
}",
                instance: 1
            });
        });

        it("outlining for setter declarionion", function() {
            runTest({
                name: "setterDeclarationFileName.ts",
                contents: "\
class E { \r\n \
 public set X(v: number) { \r\n \
 }\r\n \
}",
                instance: 1
            });
        });

        it("outlining for class declarionion with trivia", function() {
            runTest({
                name: "classDeclarationWithTriviaFileName.ts",
                contents: "\
class ClassFooWithTrivia /*  some comments */ \
/* more trivia */ {\r\n \
/*some trailing trivia */} /* even more */",
                instance: 0
            });
        });
    });
});
