///<reference path='References.ts' />

module TypeScript {
    export interface IDiagnostic {
        start(): number;
        length(): number;
        message(): string;
    }
}