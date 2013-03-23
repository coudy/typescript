///<reference path='References.ts' />

module TypeScript {
    export interface IDiagnostic {
        fileName(): string;
        start(): number;
        length(): number;
        message(): string;
    }
}