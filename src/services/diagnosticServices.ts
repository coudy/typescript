///<reference path='languageService.ts'/>

module Services {

    export interface ILanguageServicesDiagnostics {
        log(content: string): void;
    }

    export interface ICompilerDiagnostics {
        logNewCompilerUnit(scriptId: string, unitIndex: number): void;
        logUpdatedCompilerUnit(scriptId: string, unitIndex: number, editRange: TypeScript.ScriptEditRange): void;
        isLoggingEdits(): bool;
    }

    export class CompilerDiagnostics implements ICompilerDiagnostics {

        private openEditTag: string = "<Edit>";
        private closeEditTag: string = "<Edit/>";

        constructor(private logger: Services.ILanguageServiceHost) { }

        public logNewCompilerUnit(scriptId: string, unitIndex: number) {
            var sourceText = this.logger.getScriptSourceText(unitIndex, 0, this.logger.getScriptSourceLength(unitIndex));
            if (scriptId.indexOf(".d.ts") === -1) {
                this.logger.getDiagnosticsObject().log("//=New=\\\\" + '\r\n' +
                                                       "scriptId: " + scriptId + '\r\n' +
                                                       this.openEditTag + sourceText + this.closeEditTag + '\r\n' +
                                                       "\\\\=====//" + '\r\n');
            }
        }

        public logUpdatedCompilerUnit(scriptId: string, unitIndex: number, editRange: TypeScript.ScriptEditRange) {
            var sourceText = this.logger.getScriptSourceText(unitIndex, editRange.minChar, editRange.limChar + editRange.delta);
            this.logger.getDiagnosticsObject().log("//=Update=\\\\" + '\r\n' +
                                                   "scriptId: " + scriptId + '\r\n' +
                                                   editRange + '\r\n' +
                                                   this.openEditTag + sourceText + this.closeEditTag + '\r\n' +
                                                   "\\\\=====//" + '\r\n');
        }

        public isLoggingEdits(): bool {
            return (this.logger.getDiagnosticsObject() !== null);
        }

    }

    export class DiagnosticService implements Services.ILanguageService {

        private internal: Services.ILanguageService;
        private host: Services.ILanguageServiceHost;
        private diagnostics: Services.ILanguageServicesDiagnostics;

        constructor(internal: Services.ILanguageService) {
            this.internal = internal;
            this.host = internal.host;
            this.diagnostics = this.host.getDiagnosticsObject();
        }

        private writeFile(content: string): void {
            this.diagnostics.log(content);
        }

        public refresh(): void {

            this.writeFile("refresh: "+"\n");
            this.internal.refresh();

        }

        public logAST(fileName: string): void {

            var args = "fileName: " + this.stringify(fileName);
            this.writeFile("logAST: " + args+"\n");

            this.internal.logAST(fileName);

        }

        public logSyntaxAST(fileName: string): void {

            var args = "fileName: " + this.stringify(fileName);
            this.writeFile("logSyntaxAST: " + args+"\n");

            this.internal.logSyntaxAST(fileName);

        }

        public getErrors(maxCount: number): TypeScript.ErrorEntry[]{

            var args = "maxCount: " + this.stringify(maxCount);
            var result = this.internal.getErrors(maxCount);

            this.writeFile("getErrors: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }
        
        public getScriptAST(fileName: string): TypeScript.Script {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getScriptAST(fileName);

            this.writeFile("getScriptAST: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getScriptErrors(fileName: string, maxCount: number): TypeScript.ErrorEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " maxCount: " + this.stringify(maxCount);
            var result = this.internal.getScriptErrors(fileName, maxCount);

            this.writeFile("getScriptErrors: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getCompletionsAtPosition(fileName: string, pos: number, isMemberCompletion: bool): Services.CompletionInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos) + " isMemberCompletion: " + this.stringify(isMemberCompletion);
            var result = this.internal.getCompletionsAtPosition(fileName, pos, isMemberCompletion);

            this.writeFile("getCompletionsAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getTypeAtPosition(fileName: string, pos: number): Services.TypeInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getTypeAtPosition(fileName, pos);

            this.writeFile("getTypeAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): Services.SpanInfo {

            var args = "fileName: " + this.stringify(fileName) + " startPos: " + this.stringify(startPos) + " endPos: " + this.stringify(endPos);
            var result = this.internal.getNameOrDottedNameSpan(fileName, startPos, endPos);

            this.writeFile("getNameOrDottedNameSpan: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getBreakpointStatementAtPosition(fileName: string, pos: number): Services.SpanInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getBreakpointStatementAtPosition(fileName, pos);

            this.writeFile("getBreakpointStatementAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getSignatureAtPosition(fileName: string, pos: number): Services.SignatureInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getSignatureAtPosition(fileName, pos);

            this.writeFile("getSignatureAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getDefinitionAtPosition(fileName: string, pos: number): Services.DefinitionInfo {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getDefinitionAtPosition(fileName, pos);

            this.writeFile("getDefinitionAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getReferencesAtPosition(fileName: string, pos: number): Services.ReferenceEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getReferencesAtPosition(fileName, pos);

            this.writeFile("getReferencesAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getOccurrencesAtPosition(fileName: string, pos: number): Services.ReferenceEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getOccurrencesAtPosition(fileName, pos);

            this.writeFile("getOccurrencesAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getImplementorsAtPosition(fileName: string, pos: number): Services.ReferenceEntry[] {

            var args = "fileName: " + this.stringify(fileName) + " pos: " + this.stringify(pos);
            var result = this.internal.getImplementorsAtPosition(fileName, pos);

            this.writeFile("getImplementorsAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getNavigateToItems(searchValue: string): Services.NavigateToItem[] {

            var args = "searchValue: " + this.stringify(searchValue);
            var result = this.internal.getNavigateToItems(searchValue);

            this.writeFile("getNavigateToItems: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getScriptLexicalStructure(fileName: string): Services.NavigateToItem[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getScriptLexicalStructure(fileName);

            this.writeFile("getScriptLexicalStructure: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getOutliningRegions(fileName: string): Services.NavigateToItem[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getOutliningRegions(fileName);

            this.writeFile("getOutliningRegions: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getScriptSyntaxAST(fileName: string): Services.ScriptSyntaxAST {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getScriptSyntaxAST(fileName);

            this.writeFile("getScriptSyntaxAST: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " minChar: " + this.stringify(minChar) + " limChar: " + this.stringify(limChar) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsForRange(fileName, minChar, limChar, options);

            this.writeFile("getFormattingEditsForRange: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " minChar: " + this.stringify(minChar) + " limChar: " + this.stringify(limChar) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsForDocument(fileName, minChar, limChar, options);

            this.writeFile("getFormattingEditsForDocument: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " minChar: " + this.stringify(minChar) + " limChar: " + this.stringify(limChar) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsOnPaste(fileName, minChar, limChar, options);

            this.writeFile("getFormattingEditsOnPaste: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: Services.FormatCodeOptions): Services.TextEdit[] {

            var args = "fileName: " + this.stringify(fileName) + " position: " + this.stringify(position) + " key: " + this.stringify(key) + " options: " + this.stringify(options);
            var result = this.internal.getFormattingEditsAfterKeystroke(fileName, position, key, options);

            this.writeFile("getFormattingEditsAfterKeystroke: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getBraceMatchingAtPosition(fileName: string, position: number): Services.TextRange[] {

            var args = "fileName: " + this.stringify(fileName) + " position: " + this.stringify(position);
            var result = this.internal.getBraceMatchingAtPosition(fileName, position);

            this.writeFile("getBraceMatchingAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getSmartIndentAtLineNumber(fileName: string, lineNumber: number, options: Services.EditorOptions): number {

            var args = "fileName: " + this.stringify(fileName) + " lineNumber: " + this.stringify(lineNumber) + " options: " + this.stringify(options);
            var result = this.internal.getSmartIndentAtLineNumber(fileName, lineNumber, options);

            this.writeFile("getSmartIndentAtLineNumber: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getAstPathToPosition(script: TypeScript.AST, pos: number, options: TypeScript.GetAstPathOptions): TypeScript.AstPath {

            var args = "script: " + this.stringify(script) + " pos: " + this.stringify(pos) + " options: " + this.stringify(options);
            var result = this.internal.getAstPathToPosition(script, pos, options);

            this.writeFile("getAstPathToPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getIdentifierPathToPosition(script: TypeScript.AST, pos: number): TypeScript.AstPath {

            var args = "script: " + this.stringify(script) + " pos: " + this.stringify(pos);
            var result = this.internal.getIdentifierPathToPosition(script, pos);

            this.writeFile("getIdentifierPathToPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getSymbolAtPosition(script: TypeScript.AST, pos: number): TypeScript.Symbol {

            var args = "script: " + this.stringify(script) + " pos: " + this.stringify(pos);
            var result = this.internal.getSymbolAtPosition(script, pos);

            this.writeFile("getSymbolAtPosition: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getSymbolTree(): Services.ISymbolTree {

            var result = this.internal.getSymbolTree();

            this.writeFile("getSymbolTree: " + " result: " + this.stringify(result) + "\n");

            return result;

        }

        
        public getEmitOutput(fileName: string): Services.IOutputFile[] {

            var args = "fileName: " + this.stringify(fileName);
            var result = this.internal.getEmitOutput(fileName);

            this.writeFile("getEmitOutput: " + args + " result: " + this.stringify(result) + "\n");

            return result;

        }

        private stringify(object: any): string {

            var returnString: string = "";

            if (typeof object === 'string') {
                returnString = "\"" + object.toString().replace("\n", "\\n") + "\"";
            } else if (typeof object === 'number') {
                returnString = object.toString();
            } else if (typeof object === 'boolean') {
                returnString = object;
            } else if (typeof object !== 'function') {
                var properties = [];

                for (var key in object) {
                    if (object.hasOwnProperty(key) && typeof object[key] !== 'function') {
                        properties.push(key);
                    }
                }

                for (var i = 0; i < properties.length; i++) {
                    var key = properties[i];
                    properties[i] = (typeof object[key] !== 'undefined' ? key + ": " + this.stringify(object[key]) : this.stringify(key));
                }

                returnString = "{ " + properties.toString() + " }";
            }

            return returnString;

        }

    }

}
