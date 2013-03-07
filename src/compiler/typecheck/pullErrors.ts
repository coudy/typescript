// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    // pull errors are declared at a specific offset from a given decl
    // adjustedOffset is set when the error is added to a decl

    export interface SemanticError {
        length: number;
        filename: string;
        message: string;

        adjustOffset(pos: number): void;
        getOffset(): number;
    }

    export class PullError implements SemanticError {
        private adjustedOffset: number;

        constructor(private offset: number, public length: number, public filename: string, public message: string) {
            this.adjustedOffset = offset;
        }

        public adjustOffset(pos: number) {
            this.adjustedOffset = this.offset + pos;
        }

        public getOffset() {
            return this.adjustedOffset;
        }
    }

    export function getErrorsFromEnclosingDecl(enclosingDecl: PullDecl, errors: SemanticError[]) {
        var declErrors = enclosingDecl.getErrors();

        if (declErrors) {
            for (var i = 0; i < declErrors.length; i++) {
                errors[errors.length] = declErrors[i];
            }
        }

        var childDecls = enclosingDecl.getChildDecls();

        for (var i = 0; i < childDecls.length; i++) {
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
                getZeroBasedSourceLineColFromMap(this.lineCol, error.getOffset(), locationInfo.lineMap);

                this.textWriter.Write(locationInfo.filename + "(" + (this.lineCol.line + 1) + "," + this.lineCol.col + "): ");
            }
            else {
                this.textWriter.Write(error.filename + "(0,0): ");
            }

            this.textWriter.WriteLine(error.message);
        }

        public reportErrors(errors: SemanticError[]) {
            for (var i = 0; i < errors.length; i++) {
                this.reportError(errors[i]);
            }
        }
    }
}