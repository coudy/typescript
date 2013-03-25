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

        public static equals(diagnostic1: Diagnostic1, diagnostic2: Diagnostic1): bool {
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

        if (!diagnostic) {
            throw new Error("Invalid diagnostic");
        }
        else {
            // We have a string like "foo_0_bar_1".  We want to find the largest integer there.
            // (i.e.'1').  We then need one more arg than that to be correct.
            var expectedCount = 1 + getLargestIndex(diagnosticName);
            var actualCount = args ? args.length : 0;

            if (expectedCount !== actualCount) {
                throw new Error("Expected " + expectedCount + " arguments to diagnostic, got " + actualCount + " instead");
            }
        }

        var diagnosticMessage = diagnostic.message.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined'
                ? args[num]
                : match;
        });

        var message: string;

        if (diagnosticType != DiagnosticCode.error_TS_0__1 && diagnosticType != DiagnosticCode.warning_TS_0__1) {
            var errorOrWarning = diagnostic.category == DiagnosticCategory.Error ?
                                    DiagnosticCode.error_TS_0__1 :
                                    DiagnosticCode.warning_TS_0__1;

            message = getDiagnosticMessage(errorOrWarning, [diagnostic.code, diagnosticMessage]);
        }
        else {
            message = diagnosticMessage;
        }

        return message;
    }
}