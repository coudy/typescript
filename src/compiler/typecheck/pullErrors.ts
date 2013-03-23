// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />
///<reference path='..\Core\IDiagnostic.ts' />

module TypeScript {

    // pull errors are declared at a specific offset from a given decl
    // adjustedOffset is set when the error is added to a decl

    export class PullDiagnostic implements IDiagnostic {
        private _originalStart: number;
        private _fileName: string;
        private _start: number;
        private _length: number;
        private _message: string;

        constructor(start: number, length: number, fileName: string, message: string) {
            this._originalStart = start;
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

        public adjustOffset(pos: number) {
            this._start = this._originalStart + pos;
        }
    }

    export function getDiagnosticsFromEnclosingDecl(enclosingDecl: PullDecl, errors: IDiagnostic[]) {
        var declErrors = enclosingDecl.getDiagnostics();
        var i = 0;

        if (declErrors) {
            for (i = 0; i < declErrors.length; i++) {
                errors[errors.length] = declErrors[i];
            }
        }

        var childDecls = enclosingDecl.getChildDecls();

        for (i = 0; i < childDecls.length; i++) {
            getDiagnosticsFromEnclosingDecl(childDecls[i], errors);
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

        public reportDiagnostic(error: IDiagnostic, lineMap: LineMap = null) {
            this.hasErrors = true;

            if (lineMap === null) {
                var locationInfo = this.locationInfoCache[error.fileName()];
                if (locationInfo && locationInfo.lineMap) {
                    lineMap = locationInfo.lineMap;
                }
            }

            if (lineMap) {
                lineMap.fillLineAndCharacterFromPosition(error.start(), this.lineCol);

                this.textWriter.Write(error.fileName() + "(" + (this.lineCol.line + 1) + "," + this.lineCol.character + "): ");
            }
            else {
                this.textWriter.Write(error.fileName() + "(0,0): ");
            }

            this.textWriter.WriteLine(error.message());
        }

        public reportDiagnostics(errors: IDiagnostic[], lineMap: LineMap = null) {
            for (var i = 0; i < errors.length; i++) {
                this.reportDiagnostic(errors[i], lineMap);
            }
        }
    }
}