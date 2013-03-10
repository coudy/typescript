interface IDiagnostic {
    start(): number;
    length(): number;
    message(): string;
}