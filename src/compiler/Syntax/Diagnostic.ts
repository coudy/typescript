///<reference path='References.ts' />

module TypeScript {
    export class Diagnostic1 {
        private _diagnosticCode: DiagnosticCode;
        private _arguments: any[];

        constructor(diagnosticCode: DiagnosticCode, arguments: any[]) {
            this._diagnosticCode = diagnosticCode;
            this._arguments = (arguments && arguments.length > 0) ? arguments : null;
        }

        /// <summary>
        /// The error code, as an integer.
        /// </summary>
        public diagnosticCode(): DiagnosticCode {
            return this._diagnosticCode;
        }

        /// <summary>
        /// If a derived class has additional information about other referenced symbols, it can
        /// expose the locations of those symbols in a general way, so they can be reported along
        /// with the error.
        /// </summary>
        public additionalLocations(): Location[] {
            return [];
        }

        /// <summary>
        /// Get the text of the message in the given language.
        /// </summary>
        public message(): string {
            return getDiagnosticMessage(this._diagnosticCode, this._arguments);
        }

        public static equals(diagnostic1: Diagnostic1, diagnostic2: Diagnostic1): boolean {
            return diagnostic1._diagnosticCode === diagnostic2._diagnosticCode &&
                   ArrayUtilities.sequenceEquals(diagnostic1._arguments, diagnostic2._arguments, (v1, v2) => v1 === v2);
        }
    }

    function getLargestIndex(diagnostic: string): number {
        var largest = -1;
        var stringComponents = diagnostic.split("_");

        for (var i = 0; i < stringComponents.length; i++) {
            var val = parseInt(stringComponents[i]);
            if (!isNaN(val) && val > largest) {
                largest = val;
            }
        }

        return largest;
    }

    export function getDiagnosticMessage(diagnosticType: DiagnosticCode, args: any[]): string {
        var diagnosticName: string = (<any>DiagnosticCode)._map[diagnosticType];

        var diagnostic = <DiagnosticInfo>diagnosticMessages[diagnosticName];
        
        var actualCount = args ? args.length : 0;
        if (!diagnostic) {
            throw new Error("Invalid diagnostic");
        }
        else {
            // We have a string like "foo_0_bar_1".  We want to find the largest integer there.
            // (i.e.'1').  We then need one more arg than that to be correct.
            var expectedCount = 1 + getLargestIndex(diagnosticName);

            if (expectedCount !== actualCount) {
                throw new Error("Expected " + expectedCount + " arguments to diagnostic, got " + actualCount + " instead");
            }
        }

        var diagnosticMessage = diagnostic.message.replace(/{({(\d+)})?TB}/g, function (match, p1, num) {
            var tabChar = getDiagnosticMessage(DiagnosticCode.tab, null);
            var result = tabChar;
            if (num && args[num]) {
                for (var i = 1; i < <number>args[num]; i++) {
                    result += tabChar;
                }
            }

            return result;
        } );
        

        diagnosticMessage = diagnosticMessage.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined'
            ? args[num]
            : match;
        } );
        
        diagnosticMessage = diagnosticMessage.replace(/{(NL)}/g, function (match) {
            return getDiagnosticMessage(DiagnosticCode.newLine, null);
        } );

        var message: string;
        if (diagnostic.category == DiagnosticCategory.Error) {
            message = getDiagnosticMessage(DiagnosticCode.error_TS_0__1, [diagnostic.code, diagnosticMessage]);
        } else if (diagnostic.category == DiagnosticCategory.Warning) {
            message = getDiagnosticMessage(DiagnosticCode.warning_TS_0__1, [diagnostic.code, diagnosticMessage]);
        } else {
            message = diagnosticMessage;
        }

        return message;
    }
}