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
///<reference path='..\harness\external\json2.ts' />

module TypeScript {

    export var LexEOF = (-1);

    export var LexCodeNWL = 0x0A;
    export var LexCodeRET = 0x0D;
    export var LexCodeLS = 0x2028;
    export var LexCodePS = 0x2029;
    export var LexCodeTAB = 0x09;
    export var LexCodeVTAB = 0x0B;
    export var LexCode_e = 'e'.charCodeAt(0);
    export var LexCode_E = 'E'.charCodeAt(0);
    export var LexCode_x = 'x'.charCodeAt(0);
    export var LexCode_X = 'X'.charCodeAt(0);
    export var LexCode_a = 'a'.charCodeAt(0);
    export var LexCode_A = 'A'.charCodeAt(0);
    export var LexCode_f = 'f'.charCodeAt(0);
    export var LexCode_F = 'F'.charCodeAt(0);

    export var LexCode_g = 'g'.charCodeAt(0);
    export var LexCode_m = 'm'.charCodeAt(0);
    export var LexCode_i = 'i'.charCodeAt(0);

    export var LexCode_u = 'u'.charCodeAt(0);

    export var LexCode_0 = '0'.charCodeAt(0);
    export var LexCode_9 = '9'.charCodeAt(0);
    export var LexCode_8 = '8'.charCodeAt(0);
    export var LexCode_7 = '7'.charCodeAt(0);

    export var LexCodeBSL = '\\'.charCodeAt(0);
    export var LexCodeSHP = '#'.charCodeAt(0);
    export var LexCodeBNG = '!'.charCodeAt(0);
    export var LexCodeQUO = '"'.charCodeAt(0);
    export var LexCodeAPO = '\''.charCodeAt(0);
    export var LexCodePCT = '%'.charCodeAt(0);
    export var LexCodeAMP = '&'.charCodeAt(0);
    export var LexCodeLPR = '('.charCodeAt(0);
    export var LexCodeRPR = ')'.charCodeAt(0);
    export var LexCodePLS = '+'.charCodeAt(0);
    export var LexCodeMIN = '-'.charCodeAt(0);
    export var LexCodeMUL = '*'.charCodeAt(0);
    export var LexCodeSLH = '/'.charCodeAt(0);
    export var LexCodeXOR = '^'.charCodeAt(0);
    export var LexCodeCMA = ','.charCodeAt(0);
    export var LexCodeDOT = '.'.charCodeAt(0);
    export var LexCodeLT = '<'.charCodeAt(0);
    export var LexCodeEQ = '='.charCodeAt(0);
    export var LexCodeGT = '>'.charCodeAt(0);
    export var LexCodeQUE = '?'.charCodeAt(0);
    export var LexCodeLBR = '['.charCodeAt(0);
    export var LexCodeRBR = ']'.charCodeAt(0);
    export var LexCodeUSC = '_'.charCodeAt(0);
    export var LexCodeLC = '{'.charCodeAt(0);
    export var LexCodeRC = '}'.charCodeAt(0);
    export var LexCodeBAR = '|'.charCodeAt(0);
    export var LexCodeTIL = '~'.charCodeAt(0);
    export var LexCodeCOL = ':'.charCodeAt(0);
    export var LexCodeSMC = ';'.charCodeAt(0);
    export var LexCodeUnderscore = '_'.charCodeAt(0);
    export var LexCodeDollar = '$'.charCodeAt(0);
    export var LexCodeSpace = 32;
    export var LexCodeAtSign = '@'.charCodeAt(0);
    export var LexCodeASCIIChars = 128;

    export enum LexState {
        Start,
        InMultilineComment,
        InMultilineSingleQuoteString,
        InMultilineDoubleQuoteString,
    }
}