// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />
///<reference path='..\Core\IDiagnostic.ts' />

module TypeScript {

    // pull errors are declared at a specific offset from a given decl
    // adjustedOffset is set when the error is added to a decl

    export interface SemanticError extends IDiagnostic {
        fileName: string;
        adjustOffset(pos: number): void;
    }

    export class PullError implements SemanticError {
        private _originalStart: number;
        private _start: number;
        private _length: number;
        private _message: string;

        constructor(start: number, length: number, public fileName: string, message: string) {
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
        public lineCol = { line: 0, character: 0 };
        public locationInfoCache: any = {};
        public hasErrors = false;

        constructor(public textWriter: ITextWriter) {
        }

        public setUnits(fileNameToLocationInfo: TypeScript.StringHashTable) {
            this.locationInfoCache = {};

            var fileNames = fileNameToLocationInfo.getAllKeys();
            for (var i = 0; i < fileNames.length; i++) {
                var fileName = fileNames[i];
                this.locationInfoCache[fileName] = fileNameToLocationInfo.lookup(fileName);
            }
        }

        private reportError(error: SemanticError) {
            var locationInfo = this.locationInfoCache[error.fileName];

            if (locationInfo && locationInfo.lineMap) {
                locationInfo.lineMap.fillLineAndCharacterFromPosition(error.start(), this.lineCol);

                this.textWriter.Write(locationInfo.fileName + "(" + (this.lineCol.line + 1) + "," + this.lineCol.character + "): ");
            }
            else {
                this.textWriter.Write(error.fileName + "(0,0): ");
            }

            this.textWriter.WriteLine(error.message());
        }

        public reportErrors(errors: SemanticError[]) {
            for (var i = 0; i < errors.length; i++) {
                this.reportError(errors[i]);
                this.hasErrors = true;
            }
        }
    }
}