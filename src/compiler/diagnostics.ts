//﻿
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='typescript.ts' />

module TypeScript {
    export module CompilerDiagnostics {
        export var debug = false;
        export interface IDiagnosticWriter {
            Alert(output: string): void;
        }

        export var diagnosticWriter: IDiagnosticWriter = null;

        export var analysisPass: number = 0;

        export function Alert(output: string) {
            if (diagnosticWriter) {
                diagnosticWriter.Alert(output);
            }
        }

        export function debugPrint(s: string) {
            if (debug) {
                Alert(s);
            }
        }

        export function assert(condition: boolean, s: string) {
            if (debug) {
                if (!condition) {
                    Alert(s);
                }
            }
        }

    }

    export interface ILogger {
        information(): boolean;
        debug(): boolean;
        warning(): boolean;
        error(): boolean;
        fatal(): boolean;
        log(s: string): void;
    }

    export class NullLogger implements ILogger {
        public information(): boolean { return false; }
        public debug(): boolean { return false; }
        public warning(): boolean { return false; }
        public error(): boolean { return false; }
        public fatal(): boolean { return false; }
        public log(s: string): void {
        }
    }

    export function timeFunction(logger: ILogger, funcDescription: string, func: () =>any): any {
        var start = (new Date()).getTime();
        var result = func();
        var end = (new Date()).getTime();
        logger.log(funcDescription + " completed in " + (end - start) + " msec");
        return result;
    }

    // TODO: Just use JSON.stringify here.
    export function stringToLiteral(value: string, length: number): string {
        var result = "";

        var addChar = (index: number) => {
            var ch = value.charCodeAt(index);
            switch (ch) {
                case 0x09: // tab
                    result += "\\t";
                    break;
                case 0x0a: // line feed
                    result += "\\n";
                    break;
                case 0x0b: // vertical tab
                    result += "\\v";
                    break;
                case 0x0c: // form feed
                    result += "\\f";
                    break;
                case 0x0d: // carriage return
                    result += "\\r";
                    break;
                case 0x22:  // double quote
                    result += "\\\"";
                    break;
                case 0x27: // single quote
                    result += "\\\'";
                    break;
                case 0x5c: // Backslash
                    result += "\\";
                    break;
                default:
                    result += value.charAt(index);
            }
        }

        var tooLong = (value.length > length);
        if (tooLong) {
            var mid = length >> 1;
            for (var i = 0; i < mid; i++) addChar(i);
            result += "(...)";
            for (var i = value.length - mid; i < value.length; i++) addChar(i);
        }
        else {
            length = value.length;
            for (var i = 0; i < length; i++) addChar(i);
        }
        return result;
    }
}
