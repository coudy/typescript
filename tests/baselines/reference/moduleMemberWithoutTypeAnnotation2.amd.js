var TypeScript;
(function (TypeScript) {
    (function (CompilerDiagnostics) {
        CompilerDiagnostics.diagnosticWriter = null;

        function Alert(output) {
            if (CompilerDiagnostics.diagnosticWriter) {
                CompilerDiagnostics.diagnosticWriter.Alert(output);
            }
        }
        CompilerDiagnostics.Alert = Alert;
    })(TypeScript.CompilerDiagnostics || (TypeScript.CompilerDiagnostics = {}));
    var CompilerDiagnostics = TypeScript.CompilerDiagnostics;
})(TypeScript || (TypeScript = {}));
