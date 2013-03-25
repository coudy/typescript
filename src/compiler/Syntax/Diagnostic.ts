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
}