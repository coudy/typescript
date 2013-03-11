// Welcome to the FourSlash syntax guide!

// A line in the source text is indicated by four slashes (////)
// Tip: Hit Ctrl-K Ctrl-C Ctrl-K Ctrl-C to prefix-slash any selected block of text in Visual Studio
//// This is a line in the source text!
// Files are terminated by any entirely blank line (e.g.
// interspersed //-initiated comments are allowed)

// You can indicate a 'marker' with /**/
//// function./**/
// ... goTo.marker();

// Optionally, markers may have names:
//// function.go(/*1*/x, /*2*/y);
// goTo.marker('1');
// Marker names may consist of any alphanumeric characters

// File metadata must occur directly before the first line of source text
// and is indicated by an @ symbol:
// @Filename: lib.d.ts
//// this is the first line of my file

// Global options may appear anywhere
// @Module: Node
// @Target: ES5

// In the imperative section, you can write any valid TypeScript code. If
// you need help finding a something in Intellisense, you can
// type 'fs.' as an alternate way of accessing the top-level objects
// (e.g. 'fs.goTo.eof();')

module FourSlashInterface {
    declare var FourSlash;

    export interface Marker {
        fileName: string;
        position: number;
        data?: any;
    }

    export interface Range {
        fileName: string;
        start: number;
        end: number;
    }

    export interface TextSpan {
        start: number;
        end: number;
    }

    export class test {
        public markers(): Marker[] {
            return FourSlash.currentTestState.getMarkers();
        }

        public ranges(): Range[] {
            return FourSlash.currentTestState.getRanges();
        }
    }

    export class goTo {
        // Moves the caret to the specified marker,
        // or the anonymous marker ('/**/') if no name
        // is given
        public marker(name?: string) {
            FourSlash.currentTestState.goToMarker(name);
        }

        public bof() {
            FourSlash.currentTestState.goToBOF();
        }

        public eof() {
            FourSlash.currentTestState.goToEOF();
        }

        public definition() {
            FourSlash.currentTestState.goToDefinition();
        }

        public position(pos: number) {
            FourSlash.currentTestState.goToPosition(pos);
        }

        // Opens a file, given either its index as it
        // appears in the test source, or its filename
        // as specified in the test metadata
        public file(index: number);
        public file(name: string);
        public file(indexOrName: any) {
            FourSlash.currentTestState.openFile(indexOrName);
        }
    }

    export class verifyNegatable {
        public not: verifyNegatable;

        constructor (private negative ?= false) {
            if (!negative) {
                this.not = new verifyNegatable(true);
            }
        }

        // Verifies the member list contains the specified symbol. The
        // member list is brought up if necessary
        public memberListContains(symbol: string, type?: string, docComment?: string, fullSymbolName?: string, kind?: string) {
            if (this.negative) {
                FourSlash.currentTestState.verifyMemberListDoesNotContain(symbol);
            } else {
                FourSlash.currentTestState.verifyMemberListContains(symbol, type, docComment, fullSymbolName, kind);
            }
        }

        // Verifies the completion list contains the specified symbol. The
        // completion list is brought up if necessary
        public completionListContains(symbol: string, type?: string, docComment?: string, fullSymbolName?: string, kind?: string) {
            if (this.negative) {
                FourSlash.currentTestState.verifyCompletionListDoesNotContain(symbol);
            } else {
                FourSlash.currentTestState.verifyCompletionListContains(symbol, type, docComment, fullSymbolName, kind);
            }
        }

        public completionListIsEmpty() {
            FourSlash.currentTestState.verifyCompletionListIsEmpty(this.negative);
        }

        public memberListIsEmpty() {
            FourSlash.currentTestState.verifyMemberListIsEmpty(this.negative);
        }

        public currentParameterIsVariable() {
            FourSlash.currentTestState.verifyCurrentParameterIsVariable(!this.negative);
        }

        public signatureHelpPresent() {
            FourSlash.currentTestState.verifySignatureHelpPresent(!this.negative);
        }

        public errorExistsBetweenMarkers(startMarker: string, endMarker: string) {
            FourSlash.currentTestState.verifyErrorExistsBetweenMarkers(startMarker, endMarker, !this.negative);
        }

        public errorExistsAfterMarker(markerName? = "") {
            FourSlash.currentTestState.verifyErrorExistsAfterMarker(markerName, !this.negative, true);
        }

        public errorExistsBeforeMarker(markerName? = "") {
            FourSlash.currentTestState.verifyErrorExistsAfterMarker(markerName, !this.negative, false);
        }

        public quickInfoIs(typeName: string, docComment?: string, symbolName?: string, kind?: string) {
            FourSlash.currentTestState.verifyQuickInfo(typeName, this.negative, docComment, symbolName, kind);
        }

    }

    export class verify extends verifyNegatable {

        public caretAtMarker(markerName?: string) {
            FourSlash.currentTestState.verifyCaretAtMarker(markerName);
        }

        public smartIndentLevelIs(numberOfTabs: number) {
            FourSlash.currentTestState.verifySmartIndentLevel(numberOfTabs);
        }

        public textAtCaretIs(text: string) {
            FourSlash.currentTestState.verifyTextAtCaretIs(text);
        }

        public currentLineContentIs(text: string) {
            FourSlash.currentTestState.verifyCurrentLineContent(text);
        }

        public currentParameterHelpArgumentNameIs(name: string) {
            FourSlash.currentTestState.verifyCurrentParameterHelpName(name);
        }

        public currentParameterHelpArgumentDocCommentIs(docComment: string) {
            FourSlash.currentTestState.verifyCurrentParameterHelpDocComment(docComment);
        }

        public currentSignatureHelpReturnTypeIs(returnTypeName: string) {
            FourSlash.currentTestState.verifyCurrentSignatureHelpReturnType(returnTypeName);
        }

        public currentSignatureHelpDocCommentIs(docComment: string) {
            FourSlash.currentTestState.verifyCurrentSignatureHelpDocComment(docComment);
        }

        public currentSignatureHelpCountIs(expected: number) {
            FourSlash.currentTestState.verifyCurrentSignatureHelpCount(expected);
        }

        public currentParameterHelpType(expected: string) {
            FourSlash.currentTestState.verifyCurrentParameterHelpType(expected);
        }

        public currentSignatureParamterCountIs(expected: number) {
            FourSlash.currentTestState.verifyCurrentSignatureHelpParameterCount(expected);
        }

        public numberOfErrorsInCurrentFile(expected: number) {
            FourSlash.currentTestState.verifyNumberOfErrorsInCurrentFile(expected);
        }

        public baselineCurrentFileBreakpointLocations() {
            FourSlash.currentTestState.baselineCurrentFileBreakpointLocations();
        }

        public nameOrDottedNameSpanTextIs(text: string) {
            FourSlash.currentTestState.verifyCurrentNameOrDottedNameSpanText(text);
        }

        public outliningSpansInCurrentFile(spans: TextSpan[]) {
            FourSlash.currentTestState.verifyOutliningSpans(spans);
        }

        public matchingBracePositionInCurrentFile(bracePosition: number, expectedMatchPosition: number) {
            FourSlash.currentTestState.verifyMatchingBracePosition(bracePosition, expectedMatchPosition);
        }
    
        public noMatchingBracePositionInCurrentFile(bracePosition: number) {
            FourSlash.currentTestState.verifyNoMatchingBracePosition(bracePosition);
        }

        public indentationLevelAtPositionIs(position: number, numberOfTabs: number) {
            FourSlash.currentTestState.verifyIndentationLevelAtPosition(position, numberOfTabs);
        }

        public indentationLevelIs(numberOfTabs: number) {
            FourSlash.currentTestState.verifyIndentationLevelAtCurrentPosition(numberOfTabs);
        }
    }
    
    export class edit {
        public backspace(count?: number) {
            FourSlash.currentTestState.deleteCharBehindMarker(count);
        }

        public delete(count?: number) {
            FourSlash.currentTestState.deleteChar(count);
        }

        public insert(text: string) {
            this.insertLines(text);
        }

        public insertLine(text: string) {
            this.insertLines(text + '\n');
        }

        public insertLines(...lines: string[]) {
            FourSlash.currentTestState.type(lines.join('\n'));
        }

        public moveRight(count?: number) {
            FourSlash.currentTestState.moveCaretRight(count);
        }
    }

    export class debug {
        public printCurrentParameterHelp() {
            FourSlash.currentTestState.printCurrentParameterHelp();
        }

        public printCurrentFileState() {
            FourSlash.currentTestState.printCurrentFileState();
        }

        public printCurrentFileStateWithWhitepsace() {
            FourSlash.currentTestState.printCurrentFileState(true);
        }

        public printCurrentQuickInfo() {
            FourSlash.currentTestState.printCurrentQuickInfo();
        }

        public printCurrentSignatureHelp() {
            FourSlash.currentTestState.printCurrentSignatureHelp();
        }

        public printMemberListMembers() { 
            FourSlash.currentTestState.printMemberListMembers();
        }

        public printCompletionListMembers() {
            FourSlash.currentTestState.printCompletionListMembers();
         }

        public printBreakpointLocation(pos: number) {
            FourSlash.currentTestState.printBreakpointLocation(pos);
        }
    }

    export class format {
        public document() {
            FourSlash.currentTestState.formatDocument();
        }
    }
}

module fs {
    export var test = new FourSlashInterface.test();
    export var goTo = new FourSlashInterface.goTo();
    export var verify = new FourSlashInterface.verify();
    export var edit = new FourSlashInterface.edit();
    export var debug = new FourSlashInterface.debug();
    export var format = new FourSlashInterface.format();
}

var test = new FourSlashInterface.test();
var goTo = new FourSlashInterface.goTo();
var verify = new FourSlashInterface.verify();
var edit = new FourSlashInterface.edit();
var debug = new FourSlashInterface.debug();
var format = new FourSlashInterface.format();
