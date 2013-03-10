// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />
///<reference path='..\Core\IDiagnostic.ts' />

module TypeScript {

    // pull errors are declared at a specific offset from a given decl
    // adjustedOffset is set when the error is added to a decl

    export interface SemanticError extends IDiagnostic {
        filename: string;
        adjustOffset(pos: number): void;
    }

    export class PullError implements SemanticError {
        private _originalStart: number;
        private _start: number;
        private _length: number;
        private _message: string;

        constructor(start: number, length: number, public filename: string, message: string) {
            this._originalStart = start;
            this._start = start;
            this._length = length;
            this._message = message;
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

        public adjustOffset(pos: number) {
            this._start = this._originalStart + pos;
        }
    }

    export function getErrorsFromEnclosingDecl(enclosingDecl: PullDecl, errors: SemanticError[]) {
        var declErrors = enclosingDecl.getErrors();
        var i = 0;

        if (declErrors) {
            for (i = 0; i < declErrors.length; i++) {
                errors[errors.length] = declErrors[i];
            }
        }

        var childDecls = enclosingDecl.getChildDecls();

        for (i = 0; i < childDecls.length; i++) {
            getErrorsFromEnclosingDecl(childDecls[i], errors);
        }
    }

    export class PullErrorReporter {
        public lineCol = { line: 0, col: 0 };
        public locationInfoCache: any = {};

        constructor(public textWriter: ITextWriter) {
        }

        public setUnits(units: LocationInfo[]) {
            this.locationInfoCache = {};

            for (var i = 0; i < units.length; i++) {
                this.locationInfoCache[units[i].filename] = units[i];
            }
        }

        public reportError(error: SemanticError) {
            var locationInfo = this.locationInfoCache[error.filename];

            if (locationInfo && locationInfo.lineMap) {
                getZeroBasedSourceLineColFromMap(this.lineCol, error.start(), locationInfo.lineMap);

                this.textWriter.Write(locationInfo.filename + "(" + (this.lineCol.line + 1) + "," + this.lineCol.col + "): ");
            }
            else {
                this.textWriter.Write(error.filename + "(0,0): ");
            }

            this.textWriter.WriteLine(error.message());
        }

        public reportErrors(errors: SemanticError[]) {
            for (var i = 0; i < errors.length; i++) {
                this.reportError(errors[i]);
            }
        }
    }
}