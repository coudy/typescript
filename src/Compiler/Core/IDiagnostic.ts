///<reference path='References.ts' />

module TypeScript {
    export interface IDiagnostic {
        fileName(): string;
        start(): number;
        length(): number;
        message(): string;
    }

     export class Diagnostic implements IDiagnostic {
        private _fileName: string;
        private _start: number;
        private _length: number;
        private _message: string;

        constructor(start: number, length: number, fileName: string, message: string) {
            this._fileName = fileName;
            this._start = start;
            this._length = length;
            this._message = message;
        }

        public fileName(): string {
            return this._fileName;
        }

        public start(): number {
            return this._start;
        }

        public length(): number {
            return this._length;
        }

        public message(): string {
            return this._message;
        }
    }
}