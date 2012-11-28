var JSON2 = {
};
((function () {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if(typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
        };
        var strProto = String.prototype;
        var numProto = Number.prototype;
        numProto.JSON = strProto.JSON = (Boolean).prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
'\b': '\\b',
'\t': '\\t',
'\n': '\\n',
'\f': '\\f',
'\r': '\\r',
'"': '\\"',
'\\': '\\\\'    }, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k = null, v, length, mind = gap, partial, value = holder[key];
        if(value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if(typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch(typeof value) {
            case 'string': {
                return quote(value);

            }
            case 'number': {
                return isFinite(value) ? String(value) : 'null';

            }
            case 'boolean':
            case 'null': {
                return String(value);

            }
            case 'object': {
                if(!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if(Object.prototype.toString.apply(value, []) === '[object Array]') {
                    length = value.length;
                    for(i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if(rep && typeof rep === 'object') {
                    length = rep.length;
                    for(i = 0; i < length; i += 1) {
                        if(typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if(v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for(k in value) {
                        if(Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if(v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;

            }
        }
    }
    if(typeof JSON2.stringify !== 'function') {
        JSON2.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if(typeof space === 'number') {
                for(i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else {
                if(typeof space === 'string') {
                    indent = space;
                }
            }
            rep = replacer;
            if(replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            });
        };
    }
    if(typeof JSON2.parse !== 'function') {
        JSON2.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k = null, v, value = holder[key];
                if(value && typeof value === 'object') {
                    for(k in value) {
                        if(Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if(v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if(cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
})());
var CharacterCodes = (function () {
    function CharacterCodes() { }
    CharacterCodes.nullCharacter = 0;
    CharacterCodes.newLine = "\n".charCodeAt(0);
    CharacterCodes.carriageReturn = "\r".charCodeAt(0);
    CharacterCodes.nextLine = '\u0085'.charCodeAt(0);
    CharacterCodes.lineSeparator = '\u2028'.charCodeAt(0);
    CharacterCodes.paragraphSeparator = '\u2029'.charCodeAt(0);
    CharacterCodes.space = " ".charCodeAt(0);
    CharacterCodes._ = "_".charCodeAt(0);
    CharacterCodes.$ = "$".charCodeAt(0);
    CharacterCodes._0 = "0".charCodeAt(0);
    CharacterCodes._9 = "9".charCodeAt(0);
    CharacterCodes.a = "a".charCodeAt(0);
    CharacterCodes.b = "b".charCodeAt(0);
    CharacterCodes.e = "e".charCodeAt(0);
    CharacterCodes.f = "f".charCodeAt(0);
    CharacterCodes.h = "h".charCodeAt(0);
    CharacterCodes.n = "n".charCodeAt(0);
    CharacterCodes.r = "r".charCodeAt(0);
    CharacterCodes.t = "t".charCodeAt(0);
    CharacterCodes.u = "u".charCodeAt(0);
    CharacterCodes.v = "v".charCodeAt(0);
    CharacterCodes.x = "x".charCodeAt(0);
    CharacterCodes.z = "z".charCodeAt(0);
    CharacterCodes.A = "A".charCodeAt(0);
    CharacterCodes.E = "E".charCodeAt(0);
    CharacterCodes.F = "F".charCodeAt(0);
    CharacterCodes.X = "X".charCodeAt(0);
    CharacterCodes.Z = "Z".charCodeAt(0);
    CharacterCodes.ampersand = "&".charCodeAt(0);
    CharacterCodes.asterisk = "*".charCodeAt(0);
    CharacterCodes.backslash = "\\".charCodeAt(0);
    CharacterCodes.bar = "|".charCodeAt(0);
    CharacterCodes.caret = "^".charCodeAt(0);
    CharacterCodes.closeBrace = "}".charCodeAt(0);
    CharacterCodes.closeBracket = "]".charCodeAt(0);
    CharacterCodes.closeParen = ")".charCodeAt(0);
    CharacterCodes.colon = ":".charCodeAt(0);
    CharacterCodes.comma = ",".charCodeAt(0);
    CharacterCodes.dot = ".".charCodeAt(0);
    CharacterCodes.doubleQuote = '"'.charCodeAt(0);
    CharacterCodes.equals = "=".charCodeAt(0);
    CharacterCodes.exclamation = "!".charCodeAt(0);
    CharacterCodes.greaterThan = ">".charCodeAt(0);
    CharacterCodes.lessThan = "<".charCodeAt(0);
    CharacterCodes.minus = "-".charCodeAt(0);
    CharacterCodes.openBrace = "{".charCodeAt(0);
    CharacterCodes.openBracket = "[".charCodeAt(0);
    CharacterCodes.openParen = "(".charCodeAt(0);
    CharacterCodes.percent = "%".charCodeAt(0);
    CharacterCodes.plus = "+".charCodeAt(0);
    CharacterCodes.question = "?".charCodeAt(0);
    CharacterCodes.semicolon = ";".charCodeAt(0);
    CharacterCodes.singleQuote = "'".charCodeAt(0);
    CharacterCodes.slash = "/".charCodeAt(0);
    CharacterCodes.tilde = "~".charCodeAt(0);
    CharacterCodes.backspace = "\b".charCodeAt(0);
    CharacterCodes.formFeed = "\f".charCodeAt(0);
    CharacterCodes.nonBreakingSpace = "\u00A0".charCodeAt(0);
    CharacterCodes.byteOrderMark = "\uFEFF".charCodeAt(0);
    CharacterCodes.tab = "\t".charCodeAt(0);
    CharacterCodes.verticalTab = 11;
    return CharacterCodes;
})();
var CharacterInfo = (function () {
    function CharacterInfo() { }
    CharacterInfo.isDecimalDigit = function isDecimalDigit(c) {
        return c >= CharacterCodes._0 && c <= CharacterCodes._9;
    }
    CharacterInfo.isHexDigit = function isHexDigit(c) {
        return CharacterInfo.isDecimalDigit(c) || (c >= CharacterCodes.A && c <= CharacterCodes.F) || (c >= CharacterCodes.a && c <= CharacterCodes.f);
    }
    CharacterInfo.hexValue = function hexValue(c) {
        Debug.assert(CharacterInfo.isHexDigit(c));
        return CharacterInfo.isDecimalDigit(c) ? (c - CharacterCodes._0) : (c >= CharacterCodes.A && c <= CharacterCodes.F) ? c - CharacterCodes.A + 10 : c - CharacterCodes.a + 10;
    }
    return CharacterInfo;
})();
var Constants = (function () {
    function Constants() { }
    Constants.MaxInteger = 4294967295;
    return Constants;
})();
var Debug = (function () {
    function Debug() { }
    Debug.assert = function assert(expression) {
        if(!expression) {
            throw new Error("Debug Failure. False expression.");
        }
    }
    return Debug;
})();
var DiagnosticCode;
(function (DiagnosticCode) {
    DiagnosticCode._map = [];
    DiagnosticCode.Unrecognized_escape_sequence = 0;
    DiagnosticCode.Unexpected_character_0 = 1;
    DiagnosticCode.Missing_closing_quote_character = 2;
    DiagnosticCode.Identifier_expected = 3;
    DiagnosticCode._0_keyword_expected = 4;
    DiagnosticCode._0_expected = 5;
    DiagnosticCode.Identifier_expected__0_is_a_keyword = 6;
    DiagnosticCode.AutomaticSemicolonInsertionNotAllowed = 7;
})(DiagnosticCode || (DiagnosticCode = {}));
var DiagnosticMessages = (function () {
    function DiagnosticMessages() { }
    DiagnosticMessages.codeToFormatString = [];
    DiagnosticMessages.initializeStaticData = function initializeStaticData() {
        if(DiagnosticMessages.codeToFormatString.length == 0) {
            DiagnosticMessages.codeToFormatString[DiagnosticCode.Unrecognized_escape_sequence] = "Unrecognized escape sequence.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode.Unexpected_character_0] = "Unexpected character '{0}'.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode.Missing_closing_quote_character] = "Missing close quote character.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode.Identifier_expected] = "Identifier expected.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode._0_keyword_expected] = "'{0}' keyword expected.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode._0_expected] = "'{0}' expected.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode.Identifier_expected__0_is_a_keyword] = "Identifier expected; '{0}' is a keyword.";
            DiagnosticMessages.codeToFormatString[DiagnosticCode.AutomaticSemicolonInsertionNotAllowed] = "Automatic semicolon insertion not allowed.";
        }
    }
    DiagnosticMessages.getFormatString = function getFormatString(code) {
        DiagnosticMessages.initializeStaticData();
        return DiagnosticMessages.codeToFormatString[code];
    }
    DiagnosticMessages.getDiagnosticMessage = function getDiagnosticMessage(code, args) {
        var formatString = DiagnosticMessages.getFormatString(code);
        var result = formatString.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined' ? args[num] : match;
        });
        return result;
    }
    return DiagnosticMessages;
})();
var DiagnosticInfo = (function () {
    function DiagnosticInfo(diagnosticCode) {
        var arguments = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            arguments[_i] = arguments[_i + 1];
        }
        this._diagnosticCode = 0;
        this.arguments = null;
        this._diagnosticCode = diagnosticCode;
        this.arguments = arguments;
    }
    DiagnosticInfo.prototype.diagnosticCode = function () {
        return this._diagnosticCode;
    };
    DiagnosticInfo.prototype.additionalLocations = function () {
        return [];
    };
    DiagnosticInfo.prototype.getMessage = function () {
        return DiagnosticMessages.getDiagnosticMessage(this._diagnosticCode, this.arguments);
    };
    return DiagnosticInfo;
})();

var Environment = (function () {
    function getWindowsScriptHostEnvironment() {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var streamObjectPool = [];
        function getStreamObject() {
            if(streamObjectPool.length > 0) {
                return streamObjectPool.pop();
            } else {
                return new ActiveXObject("ADODB.Stream");
            }
        }
        function releaseStreamObject(obj) {
            streamObjectPool.push(obj);
        }
        var args = [];
        for(var i = 0; i < WScript.Arguments.length; i++) {
            args[i] = WScript.Arguments.Item(i);
        }
        return {
            readFile: function (path) {
                try  {
                    var streamObj = getStreamObject();
                    streamObj.Open();
                    streamObj.Type = 2;
                    streamObj.Charset = 'x-ansi';
                    streamObj.LoadFromFile(path);
                    var bomChar = streamObj.ReadText(2);
                    streamObj.Position = 0;
                    if((bomChar.charCodeAt(0) === 254 && bomChar.charCodeAt(1) === 255) || (bomChar.charCodeAt(0) === 255 && bomChar.charCodeAt(1) === 254)) {
                        streamObj.Charset = 'unicode';
                    } else {
                        if(bomChar.charCodeAt(0) === 239 && bomChar.charCodeAt(1) === 187) {
                            streamObj.Charset = 'utf-8';
                        }
                    }
                    var str = streamObj.ReadText(-1);
                    streamObj.Close();
                    releaseStreamObject(streamObj);
                    return str;
                } catch (err) {
                    throw new Error("Error reading file \"" + path + "\": " + err.message);
                }
            },
            writeFile: function (path, contents) {
                var file = this.createFile(path);
                file.Write(contents);
                file.Close();
            },
            fileExists: function (path) {
                return fso.FileExists(path);
            },
            deleteFile: function (path) {
                if(fso.FileExists(path)) {
                    fso.DeleteFile(path, true);
                }
            },
            directoryExists: function (path) {
                return fso.FolderExists(path);
            },
            listFiles: function (path, spec, options) {
                options = options || {
                };
                function filesInFolder(folder, root) {
                    var paths = [];
                    var fc;
                    if(options.recursive) {
                        fc = new Enumerator(folder.subfolders);
                        for(; !fc.atEnd(); fc.moveNext()) {
                            paths = paths.concat(filesInFolder(fc.item(), root + "\\" + fc.item().Name));
                        }
                    }
                    fc = new Enumerator(folder.files);
                    for(; !fc.atEnd(); fc.moveNext()) {
                        if(!spec || fc.item().Name.match(spec)) {
                            paths.push(root + "\\" + fc.item().Name);
                        }
                    }
                    return paths;
                }
                var folder = fso.GetFolder(path);
                var paths = [];
                return filesInFolder(folder, path);
            },
            createFile: function (path, useUTF8) {
                try  {
                    var streamObj = getStreamObject();
                    streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
                    streamObj.Open();
                    return {
                        Write: function (str) {
                            streamObj.WriteText(str, 0);
                        },
                        WriteLine: function (str) {
                            streamObj.WriteText(str, 1);
                        },
                        Close: function () {
                            streamObj.SaveToFile(path, 2);
                            streamObj.Close();
                            releaseStreamObject(streamObj);
                        }
                    };
                } catch (ex) {
                    WScript.StdErr.WriteLine("Couldn't write to file '" + path + "'");
                    throw ex;
                }
            },
            arguments: args,
            standardOut: WScript.StdOut
        };
    }
    ; ;
    if(typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    } else {
        return null;
    }
})();
var Errors = (function () {
    function Errors() { }
    Errors.argument = function argument(argument) {
        return new Error("Invalid argument: " + argument + ".");
    }
    Errors.argumentOutOfRange = function argumentOutOfRange(argument) {
        return new Error("Argument out of range: " + argument + ".");
    }
    Errors.argumentNull = function argumentNull(argument) {
        return new Error("Argument null: " + argument + ".");
    }
    Errors.abstract = function abstract() {
        return new Error("Operation not implemented properly by subclass.");
    }
    Errors.notYetImplemented = function notYetImplemented() {
        return new Error("Not yet implemented.");
    }
    Errors.invalidOperation = function invalidOperation() {
        return new Error("Invalid operation.");
    }
    return Errors;
})();
var Contract = (function () {
    function Contract() { }
    Contract.requires = function requires(expression) {
        if(!expression) {
            throw new Error("Contract violated. False expression.");
        }
    }
    Contract.throwIfFalse = function throwIfFalse(expression) {
        if(!expression) {
            throw new Error("Contract violated. False expression.");
        }
    }
    Contract.throwIfNull = function throwIfNull(value) {
        if(value === null) {
            throw new Error("Contract violated. Null value.");
        }
    }
    return Contract;
})();
var IntegerUtilities = (function () {
    function IntegerUtilities() { }
    IntegerUtilities.integerDivide = function integerDivide(numerator, denominator) {
        return (numerator / denominator) >> 0;
    }
    return IntegerUtilities;
})();
var LanguageVersion;
(function (LanguageVersion) {
    LanguageVersion._map = [];
    LanguageVersion._map[0] = "EcmaScript3";
    LanguageVersion.EcmaScript3 = 0;
    LanguageVersion._map[1] = "EcmaScript5";
    LanguageVersion.EcmaScript5 = 1;
})(LanguageVersion || (LanguageVersion = {}));
var LinePosition = (function () {
    function LinePosition(line, character) {
        this._line = 0;
        this._character = 0;
        if(line < 0) {
            throw Errors.argumentOutOfRange("line");
        }
        if(character < 0) {
            throw Errors.argumentOutOfRange("character");
        }
        this._line = line;
        this._character = character;
    }
    LinePosition.prototype.line = function () {
        return this._line;
    };
    LinePosition.prototype.character = function () {
        return this._character;
    };
    return LinePosition;
})();
var MathPrototype = (function () {
    function MathPrototype() { }
    MathPrototype.max = function max(a, b) {
        return a >= b ? a : b;
    }
    MathPrototype.min = function min(a, b) {
        return a <= b ? a : b;
    }
    return MathPrototype;
})();
var ParseOptions = (function () {
    function ParseOptions(allowAutomaticSemicolonInsertion) {
        if (typeof allowAutomaticSemicolonInsertion === "undefined") { allowAutomaticSemicolonInsertion = true; }
        this._allowAutomaticSemicolonInsertion = allowAutomaticSemicolonInsertion;
    }
    ParseOptions.prototype.allowAutomaticSemicolonInsertion = function () {
        return this._allowAutomaticSemicolonInsertion;
    };
    return ParseOptions;
})();
var ParserResetPoint = (function () {
    function ParserResetPoint(resetCount, position, previousToken, isInStrictMode) {
        this.resetCount = resetCount;
        this.position = position;
        this.previousToken = previousToken;
        this.isInStrictMode = isInStrictMode;
    }
    return ParserResetPoint;
})();
var ParserExpressionPrecedence;
(function (ParserExpressionPrecedence) {
    ParserExpressionPrecedence._map = [];
    ParserExpressionPrecedence.CommaExpressionPrecedence = 1;
    ParserExpressionPrecedence.AssignmentExpressionPrecedence = 2;
    ParserExpressionPrecedence.ConditionalExpressionPrecedence = 3;
    ParserExpressionPrecedence.ArrowFunctionPrecedence = 4;
    ParserExpressionPrecedence.LogicalOrExpressionPrecedence = 5;
    ParserExpressionPrecedence.LogicalAndExpressionPrecedence = 6;
    ParserExpressionPrecedence.BitwiseOrExpressionPrecedence = 7;
    ParserExpressionPrecedence.BitwiseExclusiveOrExpressionPrecedence = 8;
    ParserExpressionPrecedence.BitwiseAndExpressionPrecedence = 9;
    ParserExpressionPrecedence.EqualityExpressionPrecedence = 10;
    ParserExpressionPrecedence.RelationalExpressionPrecedence = 11;
    ParserExpressionPrecedence.ShiftExpressionPrecdence = 12;
    ParserExpressionPrecedence.AdditiveExpressionPrecedence = 13;
    ParserExpressionPrecedence.MultiplicativeExpressionPrecedence = 14;
    ParserExpressionPrecedence.UnaryExpressionPrecedence = 15;
})(ParserExpressionPrecedence || (ParserExpressionPrecedence = {}));
var Parser = (function () {
    function Parser(scanner, oldTree, changes, options) {
        this.scanner = null;
        this.oldTree = null;
        this._currentToken = null;
        this.scannedTokens = [];
        this.previousToken = null;
        this.firstToken = 0;
        this.tokenOffset = 0;
        this.tokenCount = 0;
        this.resetCount = 0;
        this.resetStart = 0;
        this.options = null;
        this.scanner = scanner;
        this.oldTree = oldTree;
        this.options = options || new ParseOptions();
    }
    Parser.prototype.isIncremental = function () {
        return this.oldTree != null;
    };
    Parser.prototype.preScan = function () {
        var size = MathPrototype.min(4096, MathPrototype.max(32, this.scanner.text().length() / 2));
        var tokens = this.scannedTokens = ArrayUtilities.createArray(size);
        var scanner = this.scanner;
        for(var i = 0; i < size; i++) {
            var token = scanner.scan();
            this.addScannedToken(token);
            if(token.kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
        }
    };
    Parser.prototype.getResetPoint = function () {
        var pos = this.firstToken + this.tokenOffset;
        if(this.resetCount === 0) {
            this.resetStart = pos;
        }
        this.resetCount++;
        return new ParserResetPoint(this.resetCount, pos, this.previousToken, this.isInStrictMode);
    };
    Parser.prototype.reset = function (point) {
        var offset = point.position - this.firstToken;
        Debug.assert(offset >= 0 && offset < this.tokenCount);
        this.tokenOffset = offset;
        this._currentToken = null;
        this.previousToken = point.previousToken;
        this.isInStrictMode = point.isInStrictMode;
    };
    Parser.prototype.release = function (point) {
        Debug.assert(this.resetCount == point.resetCount);
        this.resetCount--;
        if(this.resetCount == 0) {
            this.resetStart = -1;
        }
    };
    Parser.prototype.currentToken = function () {
        var result = this._currentToken;
        if(result === null) {
            result = this.fetchCurrentToken();
            this._currentToken = result;
        }
        return result;
    };
    Parser.prototype.fetchCurrentToken = function () {
        if(this.tokenOffset >= this.tokenCount) {
            this.addNewToken();
        }
        return this.scannedTokens[this.tokenOffset];
    };
    Parser.prototype.addNewToken = function () {
        this.addScannedToken(this.scanner.scan());
    };
    Parser.prototype.addScannedToken = function (token) {
        Debug.assert(token !== null);
        if(this.tokenCount >= this.scannedTokens.length) {
            this.tryShiftScannedTokens();
        }
        this.scannedTokens[this.tokenCount] = token;
        this.tokenCount++;
    };
    Parser.prototype.tryShiftScannedTokens = function () {
        if(this.tokenOffset > (this.scannedTokens.length >> 1) && (this.resetStart == -1 || this.resetStart > this.firstToken)) {
            var shiftOffset = (this.resetStart == -1) ? this.tokenOffset : this.resetStart - this.firstToken;
            var shiftCount = this.tokenCount - shiftOffset;
            Debug.assert(shiftOffset > 0);
            if(shiftCount > 0) {
                ArrayUtilities.copy(this.scannedTokens, shiftOffset, this.scannedTokens, 0, shiftCount);
            }
            this.firstToken += shiftOffset;
            this.tokenCount -= shiftOffset;
            this.tokenOffset -= shiftOffset;
        } else {
            this.scannedTokens[this.scannedTokens.length * 2 - 1] = null;
        }
    };
    Parser.prototype.peekTokenN = function (n) {
        Debug.assert(n >= 0);
        while(this.tokenOffset + n >= this.tokenCount) {
            this.addNewToken();
        }
        return this.scannedTokens[this.tokenOffset + n];
    };
    Parser.prototype.eatAnyToken = function () {
        var token = this.currentToken();
        this.moveToNextToken();
        return token;
    };
    Parser.prototype.moveToNextToken = function () {
        this.previousToken = this._currentToken;
        this._currentToken = null;
        this.tokenOffset++;
    };
    Parser.prototype.canEatAutomaticSemicolon = function () {
        var token = this.currentToken();
        if(token.kind() === SyntaxKind.EndOfFileToken) {
            return true;
        }
        if(token.kind() === SyntaxKind.CloseBraceToken) {
            return true;
        }
        if(this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
            return true;
        }
        return false;
    };
    Parser.prototype.canEatExplicitOrAutomaticSemicolon = function () {
        var token = this.currentToken();
        if(token.kind() === SyntaxKind.SemicolonToken) {
            return true;
        }
        return this.canEatAutomaticSemicolon();
    };
    Parser.prototype.eatExplicitOrAutomaticSemicolon = function () {
        var token = this.currentToken();
        if(token.kind() === SyntaxKind.SemicolonToken) {
            return this.eatToken(SyntaxKind.SemicolonToken);
        }
        if(this.canEatAutomaticSemicolon()) {
            var semicolonToken = SyntaxToken.createEmptyToken(SyntaxKind.SemicolonToken);
            if(!this.options.allowAutomaticSemicolonInsertion()) {
                semicolonToken = this.withAdditionalDiagnostics(semicolonToken, new DiagnosticInfo(DiagnosticCode.AutomaticSemicolonInsertionNotAllowed));
            }
            return semicolonToken;
        }
        return this.eatToken(SyntaxKind.SemicolonToken);
    };
    Parser.prototype.eatToken = function (kind) {
        Debug.assert(SyntaxFacts.isTokenKind(kind));
        var token = this.currentToken();
        if(token.kind() === kind) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(kind, token.kind());
    };
    Parser.prototype.eatKeyword = function (kind) {
        Debug.assert(SyntaxFacts.isTokenKind(kind));
        var token = this.currentToken();
        if(token.keywordKind() === kind) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(kind, token.kind());
    };
    Parser.prototype.eatIdentifierNameToken = function () {
        var token = this.currentToken();
        if(token.kind() === SyntaxKind.IdentifierNameToken) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.kind());
    };
    Parser.prototype.eatIdentifierToken = function () {
        var token = this.currentToken();
        if(token.kind() === SyntaxKind.IdentifierNameToken) {
            if(this.isKeyword(token.keywordKind())) {
                return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.keywordKind());
            }
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(SyntaxKind.IdentifierNameToken, token.kind());
    };
    Parser.prototype.isIdentifier = function (token) {
        return token.kind() === SyntaxKind.IdentifierNameToken && !this.isKeyword(token.keywordKind());
    };
    Parser.prototype.tokenIsKeyword = function (token, kind) {
        return token.keywordKind() === kind && this.isKeyword(kind);
    };
    Parser.prototype.isKeyword = function (kind) {
        if(SyntaxFacts.isStandardKeyword(kind) || SyntaxFacts.isFutureReservedKeyword(kind)) {
            return true;
        }
        if(this.isInStrictMode && SyntaxFacts.isFutureReservedStrictKeyword(kind)) {
            return true;
        }
        return false;
    };
    Parser.prototype.createMissingToken = function (expected, actual) {
        var token = SyntaxToken.createEmptyToken(expected);
        token = this.withAdditionalDiagnostics(token, this.getExpectedTokenDiagnosticInfo(expected, actual));
        return token;
    };
    Parser.prototype.eatTokenWithPrejudice = function (kind) {
        var token = this.currentToken();
        Debug.assert(SyntaxFacts.isTokenKind(kind));
        if(token.kind() !== kind) {
            token = this.withAdditionalDiagnostics(token, this.getExpectedTokenDiagnosticInfo(kind, token.kind()));
        }
        this.moveToNextToken();
        return token;
    };
    Parser.prototype.getExpectedTokenDiagnosticInfo = function (expected, actual) {
        var span = this.getDiagnosticSpanForMissingToken();
        var offset = span.start();
        var width = span.length();
        if(expected === SyntaxKind.IdentifierNameToken) {
            if(SyntaxFacts.isAnyKeyword(actual)) {
                return new SyntaxDiagnosticInfo(offset, width, DiagnosticCode.Identifier_expected__0_is_a_keyword, SyntaxFacts.getText(actual));
            } else {
                return new SyntaxDiagnosticInfo(offset, width, DiagnosticCode.Identifier_expected);
            }
        }
        if(SyntaxFacts.isAnyPunctuation(expected)) {
            return new SyntaxDiagnosticInfo(offset, width, DiagnosticCode._0_expected, SyntaxFacts.getText(expected));
        }
        throw Errors.notYetImplemented();
    };
    Parser.prototype.getDiagnosticSpanForMissingToken = function () {
        var token = this.currentToken();
        return new TextSpan(token.start(), token.width());
    };
    Parser.prototype.withAdditionalDiagnostics = function (token) {
        var diagnostics = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            diagnostics[_i] = arguments[_i + 1];
        }
        throw Errors.notYetImplemented();
    };
    Parser.prototype.getPrecedence = function (expressionKind) {
        switch(expressionKind) {
            case SyntaxKind.CommaExpression: {
                return ParserExpressionPrecedence.CommaExpressionPrecedence;

            }
            case SyntaxKind.AssignmentExpression:
            case SyntaxKind.AddAssignmentExpression:
            case SyntaxKind.SubtractAssignmentExpression:
            case SyntaxKind.MultiplyAssignmentExpression:
            case SyntaxKind.DivideAssignmentExpression:
            case SyntaxKind.ModuloAssignmentExpression:
            case SyntaxKind.AndAssignmentExpression:
            case SyntaxKind.ExclusiveOrAssignmentExpression:
            case SyntaxKind.OrAssignmentExpression:
            case SyntaxKind.LeftShiftAssignmentExpression:
            case SyntaxKind.SignedRightShiftAssignmentExpression:
            case SyntaxKind.UnsignedRightShiftAssignmentExpression: {
                return ParserExpressionPrecedence.AssignmentExpressionPrecedence;

            }
            case SyntaxKind.ConditionalExpression: {
                return ParserExpressionPrecedence.ConditionalExpressionPrecedence;

            }
            case SyntaxKind.LogicalOrExpression: {
                return ParserExpressionPrecedence.LogicalOrExpressionPrecedence;

            }
            case SyntaxKind.LogicalAndExpression: {
                return ParserExpressionPrecedence.LogicalAndExpressionPrecedence;

            }
            case SyntaxKind.BitwiseOrExpression: {
                return ParserExpressionPrecedence.BitwiseOrExpressionPrecedence;

            }
            case SyntaxKind.BitwiseExclusiveOrExpression: {
                return ParserExpressionPrecedence.BitwiseExclusiveOrExpressionPrecedence;

            }
            case SyntaxKind.BitwiseAndExpression: {
                return ParserExpressionPrecedence.BitwiseAndExpressionPrecedence;

            }
            case SyntaxKind.EqualsWithTypeConversionExpression:
            case SyntaxKind.NotEqualsWithTypeConversionExpression:
            case SyntaxKind.EqualsExpression:
            case SyntaxKind.NotEqualsExpression: {
                return ParserExpressionPrecedence.EqualityExpressionPrecedence;

            }
            case SyntaxKind.LessThanExpression:
            case SyntaxKind.GreaterThanExpression:
            case SyntaxKind.LessThanOrEqualExpression:
            case SyntaxKind.GreaterThanOrEqualExpression:
            case SyntaxKind.InstanceOfExpression:
            case SyntaxKind.InExpression: {
                return ParserExpressionPrecedence.RelationalExpressionPrecedence;

            }
            case SyntaxKind.LeftShiftExpression:
            case SyntaxKind.SignedRightShiftExpression:
            case SyntaxKind.UnsignedRightShiftExpression: {
                return ParserExpressionPrecedence.ShiftExpressionPrecdence;

            }
            case SyntaxKind.AddExpression:
            case SyntaxKind.SubtractExpression: {
                return ParserExpressionPrecedence.AdditiveExpressionPrecedence;

            }
            case SyntaxKind.MultiplyExpression:
            case SyntaxKind.DivideExpression:
            case SyntaxKind.ModuloExpression: {
                return ParserExpressionPrecedence.MultiplicativeExpressionPrecedence;

            }
            case SyntaxKind.PlusExpression:
            case SyntaxKind.NegateExpression:
            case SyntaxKind.BitwiseNotExpression:
            case SyntaxKind.LogicalNotExpression:
            case SyntaxKind.DeleteExpression:
            case SyntaxKind.TypeOfExpression:
            case SyntaxKind.VoidExpression:
            case SyntaxKind.PreIncrementExpression:
            case SyntaxKind.PreDecrementExpression: {
                return ParserExpressionPrecedence.UnaryExpressionPrecedence;

            }
        }
        throw Errors.invalidOperation();
    };
    Parser.prototype.parseSourceUnit = function () {
        var moduleElements = [];
        while(this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            var moduleElement = this.parseModuleElement();
            moduleElements.push(moduleElement);
        }
        return new SourceUnitSyntax(SyntaxNodeList.create(moduleElements), this.currentToken());
    };
    Parser.prototype.parseModuleElement = function () {
        if(this.isImportDeclaration()) {
            return this.parseImportDeclaration();
        } else {
            if(this.isModuleDeclaration()) {
                return this.parseModuleDeclaration();
            } else {
                if(this.isInterfaceDeclaration()) {
                    return this.parseInterfaceDeclaration();
                } else {
                    if(this.isClassDeclaration()) {
                        return this.parseClassDeclaration();
                    } else {
                        if(this.isEnumDeclaration()) {
                            return this.parseEnumDeclaration();
                        } else {
                            return this.parseStatement(true);
                        }
                    }
                }
            }
        }
    };
    Parser.prototype.isImportDeclaration = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ImportKeyword && this.peekTokenN(1).kind() === SyntaxKind.IdentifierNameToken && this.peekTokenN(2).kind() === SyntaxKind.EqualsToken;
    };
    Parser.prototype.parseImportDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ImportKeyword);
        var importKeyword = this.eatKeyword(SyntaxKind.ImportKeyword);
        var identifier = this.eatIdentifierToken();
        var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
        var moduleReference = this.parseModuleReference();
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
    };
    Parser.prototype.parseModuleReference = function () {
        if(this.isExternalModuleReference()) {
            return this.parseExternalModuleReference();
        } else {
            this.parseModuleNameModuleReference();
        }
    };
    Parser.prototype.isExternalModuleReference = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ModuleKeyword && this.peekTokenN(1).kind() === SyntaxKind.OpenParenToken;
    };
    Parser.prototype.parseExternalModuleReference = function () {
        throw Errors.notYetImplemented();
    };
    Parser.prototype.parseModuleNameModuleReference = function () {
        var name = this.parseName();
        return new ModuleNameModuleReference(name);
    };
    Parser.prototype.parseIdentifierName = function () {
        var identifierName = this.eatIdentifierNameToken();
        return new IdentifierNameSyntax(identifierName);
    };
    Parser.prototype.isName = function () {
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.parseName = function () {
        var isIdentifier = this.currentToken().kind() === SyntaxKind.IdentifierNameToken;
        var identifier = this.eatIdentifierToken();
        var identifierName = new IdentifierNameSyntax(identifier);
        var current = identifierName;
        while(isIdentifier && this.currentToken().kind() === SyntaxKind.DotToken) {
            var dotToken = this.eatToken(SyntaxKind.DotToken);
            isIdentifier = this.currentToken().kind() === SyntaxKind.IdentifierNameToken;
            identifier = this.eatIdentifierToken();
            identifierName = new IdentifierNameSyntax(identifier);
            current = new QualifiedNameSyntax(current, dotToken, identifierName);
        }
        return current;
    };
    Parser.prototype.isEnumDeclaration = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword && this.peekTokenN(1).keywordKind() === SyntaxKind.EnumKeyword) {
            return true;
        }
        return this.currentToken().keywordKind() === SyntaxKind.EnumKeyword && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseEnumDeclaration = function () {
        Debug.assert(this.isEnumDeclaration());
        var exportKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }
        var enumKeyword = this.eatKeyword(SyntaxKind.EnumKeyword);
        var identifier = this.eatIdentifierToken();
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var variableDeclarators = null;
        if(!openBraceToken.isMissing()) {
            while(true) {
                if(this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }
                var variableDeclarator = this.parseVariableDeclarator(true);
                variableDeclarators = variableDeclarators || [];
                variableDeclarators.push(variableDeclarator);
                if(this.currentToken().kind() === SyntaxKind.CommaToken) {
                    var commaToken = this.eatToken(SyntaxKind.CommaToken);
                    variableDeclarators.push(commaToken);
                    continue;
                }
                break;
            }
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, SeparatedSyntaxList.create(variableDeclarators), closeBraceToken);
    };
    Parser.prototype.isClassDeclaration = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword && this.peekTokenN(1).keywordKind() === SyntaxKind.ClassKeyword) {
            return true;
        }
        return this.currentToken().keywordKind() === SyntaxKind.ClassKeyword && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseClassDeclaration = function () {
        Debug.assert(this.isClassDeclaration());
        var exportKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }
        var classKeyword = this.eatKeyword(SyntaxKind.ClassKeyword);
        var identifier = this.eatIdentifierToken();
        var extendsClause = null;
        if(this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }
        var implementsClause = null;
        if(this.isImplementsClause()) {
            implementsClause = this.parseImplementsClause();
        }
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var classElements = null;
        if(!openBraceToken.isMissing()) {
            while(true) {
                if(this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }
                var classElement = this.parseClassElement();
                classElements = classElements || [];
                classElements.push(classElement);
            }
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ClassDeclarationSyntax(exportKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, SyntaxNodeList.create(classElements), closeBraceToken);
    };
    Parser.prototype.isConstructorDeclaration = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ConstructorKeyword;
    };
    Parser.prototype.isMemberFunctionDeclaration = function () {
        var resetPoint = this.getResetPoint();
        try  {
            if(this.currentToken().keywordKind() === SyntaxKind.PublicKeyword || this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
                this.eatAnyToken();
            }
            return this.isFunctionSignature();
        }finally {
            this.reset(resetPoint);
            this.release(resetPoint);
        }
    };
    Parser.prototype.isMemberAccessorDeclaration = function () {
        var resetPoint = this.getResetPoint();
        try  {
            if(this.currentToken().keywordKind() === SyntaxKind.PublicKeyword || this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() !== SyntaxKind.GetKeyword && this.currentToken().keywordKind() !== SyntaxKind.SetKeyword) {
                return false;
            }
            this.eatAnyToken();
            return this.isIdentifier(this.currentToken());
        }finally {
            this.reset(resetPoint);
            this.release(resetPoint);
        }
    };
    Parser.prototype.isMemberVariableDeclaration = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.PublicKeyword || this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            return true;
        }
        if(this.currentToken().keywordKind() === SyntaxKind.StaticKeyword) {
            return true;
        }
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.isMemberDeclaration = function () {
        return this.isMemberFunctionDeclaration() || this.isMemberAccessorDeclaration() || this.isMemberVariableDeclaration();
    };
    Parser.prototype.isClassElement = function () {
        return this.isConstructorDeclaration() || this.isMemberDeclaration();
    };
    Parser.prototype.parseConstructorDeclaration = function () {
        Debug.assert(this.isConstructorDeclaration());
        var constructorKeyword = this.eatKeyword(SyntaxKind.ConstructorKeyword);
        var parameterList = this.parseParameterList();
        var semicolonToken = null;
        var block = null;
        if(this.isBlock()) {
            block = this.parseBlock(true);
        } else {
            semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        }
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
    };
    Parser.prototype.parseMemberFunctionDeclaration = function () {
        Debug.assert(this.isMemberFunctionDeclaration());
        var publicOrPrivateKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.PublicKeyword || this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = null;
        if(this.currentToken().kind() === SyntaxKind.StaticKeyword) {
            staticKeyword = this.eatToken(SyntaxKind.StaticKeyword);
        }
        var functionSignature = this.parseFunctionSignature();
        var block = null;
        var semicolon = null;
        if(this.isBlock()) {
            block = this.parseBlock(true);
        } else {
            semicolon = this.eatExplicitOrAutomaticSemicolon();
        }
        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolon);
    };
    Parser.prototype.parseMemberAccessorDeclaration = function () {
        throw Errors.notYetImplemented();
    };
    Parser.prototype.parseMemberVariableDeclaration = function () {
        Debug.assert(this.isMemberVariableDeclaration());
        var publicOrPrivateKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.PublicKeyword || this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = null;
        if(this.currentToken().kind() === SyntaxKind.StaticKeyword) {
            staticKeyword = this.eatToken(SyntaxKind.StaticKeyword);
        }
        var variableDeclarator = this.parseVariableDeclarator(true);
        var semicolon = this.eatExplicitOrAutomaticSemicolon();
        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolon);
    };
    Parser.prototype.parseMemberDeclaration = function () {
        Debug.assert(this.isMemberDeclaration());
        if(this.isMemberFunctionDeclaration()) {
            return this.parseMemberFunctionDeclaration();
        } else {
            if(this.isMemberAccessorDeclaration()) {
                return this.parseMemberAccessorDeclaration();
            } else {
                if(this.isMemberVariableDeclaration()) {
                    return this.parseMemberVariableDeclaration();
                } else {
                    throw Errors.invalidOperation();
                }
            }
        }
    };
    Parser.prototype.parseClassElement = function () {
        Debug.assert(this.isClassElement());
        if(this.isConstructorDeclaration()) {
            return this.parseConstructorDeclaration();
        } else {
            if(this.isMemberDeclaration()) {
                return this.parseMemberDeclaration();
            } else {
                throw Errors.invalidOperation();
            }
        }
    };
    Parser.prototype.isFunctionDeclaration = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.FunctionKeyword) {
            return true;
        }
        return this.currentToken().keywordKind() === SyntaxKind.ExportKeyword && this.peekTokenN(1).keywordKind() === SyntaxKind.FunctionKeyword;
    };
    Parser.prototype.parseFunctionDeclaration = function () {
        Debug.assert(this.isFunctionDeclaration());
        var exportKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }
        var functionKeyword = this.eatKeyword(SyntaxKind.FunctionKeyword);
        var functionSignature = this.parseFunctionSignature();
        var semicolonToken = null;
        var block = null;
        if(this.isBlock()) {
            block = this.parseBlock(true);
        } else {
            semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        }
        return new FunctionDeclarationSyntax(exportKeyword, functionKeyword, functionSignature, block, semicolonToken);
    };
    Parser.prototype.isModuleDeclaration = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword && this.peekTokenN(1).keywordKind() === SyntaxKind.ModuleKeyword) {
            return true;
        }
        if(this.currentToken().keywordKind() === SyntaxKind.ModuleKeyword) {
            var token1 = this.peekTokenN(1);
            if(token1.kind() === SyntaxKind.OpenBraceToken) {
                return true;
            }
            if(token1.kind() === SyntaxKind.IdentifierNameToken) {
                var token2 = this.peekTokenN(2);
                if(token2.kind() === SyntaxKind.OpenBraceToken) {
                    return true;
                }
                if(token2.kind() === SyntaxKind.DotToken) {
                    return true;
                }
            }
        }
        return false;
    };
    Parser.prototype.parseModuleDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ModuleKeyword || this.currentToken().keywordKind() === SyntaxKind.ExportKeyword);
        var exportKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }
        var moduleKeyword = this.eatKeyword(SyntaxKind.ModuleKeyword);
        var moduleName = null;
        if(this.currentToken().kind() !== SyntaxKind.OpenBraceToken) {
            moduleName = this.parseName();
        }
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var moduleElements = null;
        if(!openBraceToken.isMissing()) {
            while(this.currentToken().kind() !== SyntaxKind.CloseBraceToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
                var element = this.parseModuleElement();
                moduleElements = moduleElements || [];
                moduleElements.push(element);
            }
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ModuleDeclarationSyntax(exportKeyword, moduleKeyword, moduleName, openBraceToken, SyntaxNodeList.create(moduleElements), closeBraceToken);
    };
    Parser.prototype.isInterfaceDeclaration = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword && this.peekTokenN(1).keywordKind() === SyntaxKind.InterfaceKeyword) {
            return true;
        }
        return this.currentToken().keywordKind() === SyntaxKind.InterfaceKeyword && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseInterfaceDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword || this.currentToken().keywordKind() === SyntaxKind.InterfaceKeyword);
        var exportKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }
        var interfaceKeyword = this.eatKeyword(SyntaxKind.InterfaceKeyword);
        var identifier = this.eatIdentifierToken();
        var extendsClause = null;
        if(this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }
        var objectType = this.parseObjectType();
        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, objectType);
    };
    Parser.prototype.parseObjectType = function () {
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var typeMembers = null;
        if(!openBraceToken.isMissing()) {
            while(true) {
                if(this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }
                var typeMember = this.parseTypeMember();
                typeMembers = typeMembers || [];
                typeMembers.push(typeMember);
                if(this.currentToken().kind() === SyntaxKind.SemicolonToken) {
                    var semicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
                    typeMembers.push(semicolonToken);
                } else {
                    break;
                }
            }
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ObjectTypeSyntax(openBraceToken, SeparatedSyntaxList.create(typeMembers), closeBraceToken);
    };
    Parser.prototype.parseTypeMember = function () {
        if(this.isCallSignature()) {
            return this.parseCallSignature();
        } else {
            if(this.isConstructSignature()) {
                return this.parseConstructSignature();
            } else {
                if(this.isIndexSignature()) {
                    return this.parseIndexSignature();
                } else {
                    if(this.isFunctionSignature()) {
                        return this.parseFunctionSignature();
                    } else {
                        if(this.isPropertySignature()) {
                            return this.parsePropertySignature();
                        } else {
                            throw Errors.notYetImplemented();
                        }
                    }
                }
            }
        }
    };
    Parser.prototype.parseConstructSignature = function () {
        throw Errors.notYetImplemented();
    };
    Parser.prototype.parseIndexSignature = function () {
        throw Errors.notYetImplemented();
    };
    Parser.prototype.parseFunctionSignature = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.IdentifierNameToken);
        var identifier = this.eatIdentifierToken();
        var questionToken = null;
        if(this.currentToken().kind() === SyntaxKind.QuestionToken) {
            questionToken = this.eatToken(SyntaxKind.QuestionToken);
        }
        var parameterList = this.parseParameterList();
        var typeAnnotation = null;
        if(this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }
        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
    };
    Parser.prototype.parsePropertySignature = function () {
        Debug.assert(this.isPropertySignature());
        var identifier = this.eatIdentifierToken();
        var questionToken = null;
        if(this.currentToken().kind() === SyntaxKind.QuestionToken) {
            questionToken = this.eatToken(SyntaxKind.QuestionToken);
        }
        var typeAnnotation = null;
        if(this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }
        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    };
    Parser.prototype.isCallSignature = function () {
        return this.currentToken().kind() === SyntaxKind.OpenParenToken;
    };
    Parser.prototype.isConstructSignature = function () {
        return this.currentToken().keywordKind() === SyntaxKind.NewKeyword;
    };
    Parser.prototype.isIndexSignature = function () {
        return this.currentToken().kind() === SyntaxKind.OpenBracketToken;
    };
    Parser.prototype.isFunctionSignature = function () {
        if(this.isIdentifier(this.currentToken())) {
            if(this.peekTokenN(1).kind() === SyntaxKind.OpenParenToken) {
                return true;
            }
            if(this.peekTokenN(1).kind() === SyntaxKind.QuestionToken && this.peekTokenN(2).kind() === SyntaxKind.OpenParenToken) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.isPropertySignature = function () {
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.isExtendsClause = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ExtendsKeyword;
    };
    Parser.prototype.parseExtendsClause = function () {
        throw Errors.notYetImplemented();
    };
    Parser.prototype.isImplementsClause = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ImplementsKeyword;
    };
    Parser.prototype.parseImplementsClause = function () {
        Debug.assert(this.isImplementsClause());
        var implementsKeyword = this.eatKeyword(SyntaxKind.ImplementsKeyword);
        var typeNames = [];
        var typeName = this.parseName();
        typeNames.push(typeName);
        while(true) {
            if(this.currentToken().kind() === SyntaxKind.CommaToken) {
                typeNames.push(this.eatToken(SyntaxKind.CommaToken));
                typeName = this.parseName();
                typeNames.push(typeName);
            }
            break;
        }
        return new ImplementsClauseSyntax(implementsKeyword, SeparatedSyntaxList.create(typeNames));
    };
    Parser.prototype.parseStatement = function (allowFunctionDeclaration) {
        if(this.isVariableStatement()) {
            return this.parseVariableStatement();
        } else {
            if(allowFunctionDeclaration && this.isFunctionDeclaration()) {
                return this.parseFunctionDeclaration();
            } else {
                if(this.isIfStatement()) {
                    return this.parseIfStatement();
                } else {
                    if(this.isBlock()) {
                        return this.parseBlock(false);
                    } else {
                        if(this.isExpressionStatement()) {
                            return this.parseExpressionStatement();
                        } else {
                            if(this.isReturnStatement()) {
                                return this.parseReturnStatement();
                            } else {
                                if(this.isSwitchStatement()) {
                                    return this.parseSwitchStatement();
                                } else {
                                    if(this.isBreakStatement()) {
                                        return this.parseBreakStatement();
                                    } else {
                                        if(this.isForOrForInStatement()) {
                                            return this.parseForOrForInStatement();
                                        } else {
                                            throw Errors.notYetImplemented();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    Parser.prototype.isForOrForInStatement = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ForKeyword;
    };
    Parser.prototype.parseForOrForInStatement = function () {
        Debug.assert(this.isForOrForInStatement());
        var forKeyword = this.eatKeyword(SyntaxKind.ForKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var currentToken = this.currentToken();
        if(currentToken.keywordKind() === SyntaxKind.VarKeyword) {
            return this.parseForOrForInStatementWithVariableDeclaration(forKeyword, openParenToken);
        } else {
            if(currentToken.kind() === SyntaxKind.SemicolonToken) {
                return this.parseForStatement(forKeyword, openParenToken);
            } else {
                return this.parseForOrForInStatementWithInitializer(forKeyword, openParenToken);
            }
        }
    };
    Parser.prototype.parseForOrForInStatementWithVariableDeclaration = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === SyntaxKind.ForKeyword && openParenToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.VarKeyword);
        var variableDeclaration = this.parseVariableDeclaration(false);
        if(this.currentToken().keywordKind() === SyntaxKind.InKeyword) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
        }
        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
    };
    Parser.prototype.parseForInStatementWithVariableDeclarationOrInitializer = function (forKeyword, openParenToken, variableDeclaration, initializer) {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.InKeyword);
        var inKeyword = this.eatKeyword(SyntaxKind.InKeyword);
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(false);
        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, inKeyword, expression, closeParenToken, statement);
    };
    Parser.prototype.parseForOrForInStatementWithInitializer = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === SyntaxKind.ForKeyword && openParenToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind() === SyntaxKind.OpenParenToken);
        var initializer = this.parseExpression(false);
        if(this.currentToken().keywordKind() === SyntaxKind.InKeyword) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        } else {
            return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        }
    };
    Parser.prototype.parseForStatement = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === SyntaxKind.ForKeyword && openParenToken.kind() === SyntaxKind.OpenParenToken);
        Debug.assert(this.previousToken.kind() === SyntaxKind.OpenParenToken);
        var initializer = null;
        if(this.currentToken().kind() !== SyntaxKind.SemicolonToken && this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            initializer = this.parseExpression(false);
        }
        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
    };
    Parser.prototype.parseForStatementWithVariableDeclarationOrInitializer = function (forKeyword, openParenToken, variableDeclaration, initializer) {
        var firstSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
        var condition = null;
        if(this.currentToken().kind() !== SyntaxKind.SemicolonToken && this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            condition = this.parseExpression(true);
        }
        var secondSemicolonToken = this.eatToken(SyntaxKind.SemicolonToken);
        var incrementor = null;
        if(this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            incrementor = this.parseExpression(true);
        }
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(false);
        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
    };
    Parser.prototype.isBreakStatement = function () {
        return this.currentToken().keywordKind() === SyntaxKind.BreakKeyword;
    };
    Parser.prototype.parseBreakStatement = function () {
        Debug.assert(this.isBreakStatement());
        var breakKeyword = this.eatKeyword(SyntaxKind.BreakKeyword);
        var identifier = null;
        if(!this.canEatExplicitOrAutomaticSemicolon()) {
            if(this.isIdentifier(this.currentToken())) {
                identifier = this.eatIdentifierToken();
            }
        }
        var semicolon = this.eatExplicitOrAutomaticSemicolon();
        return new BreakStatementSyntax(breakKeyword, identifier, semicolon);
    };
    Parser.prototype.isSwitchStatement = function () {
        return this.currentToken().keywordKind() === SyntaxKind.SwitchKeyword;
    };
    Parser.prototype.parseSwitchStatement = function () {
        Debug.assert(this.isSwitchStatement());
        var switchKeyword = this.eatKeyword(SyntaxKind.SwitchKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var switchClauses = null;
        if(!openBraceToken.isMissing()) {
            while(true) {
                if(this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }
                if(this.isSwitchClause()) {
                    var switchClause = this.parseSwitchClause();
                    switchClauses = switchClauses || [];
                    switchClauses.push(switchClause);
                } else {
                    break;
                }
            }
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, SyntaxNodeList.create(switchClauses), closeBraceToken);
    };
    Parser.prototype.isCaseSwitchClause = function () {
        return this.currentToken().keywordKind() === SyntaxKind.CaseKeyword;
    };
    Parser.prototype.isDefaultSwitchClause = function () {
        return this.currentToken().keywordKind() === SyntaxKind.DefaultKeyword;
    };
    Parser.prototype.isSwitchClause = function () {
        return this.isCaseSwitchClause() || this.isDefaultSwitchClause();
    };
    Parser.prototype.parseSwitchClause = function () {
        Debug.assert(this.isSwitchClause());
        if(this.isCaseSwitchClause()) {
            return this.parseCaseSwitchClause();
        } else {
            if(this.isDefaultSwitchClause()) {
                return this.parseDefaultSwitchClause();
            } else {
                throw Errors.invalidOperation();
            }
        }
    };
    Parser.prototype.parseCaseSwitchClause = function () {
        Debug.assert(this.isCaseSwitchClause());
        var caseKeyword = this.eatKeyword(SyntaxKind.CaseKeyword);
        var expression = null;
        if(this.currentToken().kind() !== SyntaxKind.ColonToken) {
            expression = this.parseExpression(true);
        }
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statements = this.parseSwitchClauseStatements();
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    };
    Parser.prototype.parseDefaultSwitchClause = function () {
        Debug.assert(this.isDefaultSwitchClause());
        var defaultKeyword = this.eatKeyword(SyntaxKind.DefaultKeyword);
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var statements = this.parseSwitchClauseStatements();
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
    };
    Parser.prototype.parseSwitchClauseStatements = function () {
        var statements = null;
        while(true) {
            if(this.isSwitchClause() || this.currentToken().kind() == SyntaxKind.EndOfFileToken || this.currentToken().kind() === SyntaxKind.CloseBraceToken) {
                break;
            }
            var statement = this.parseStatement(false);
            statements = statements || [];
            statements.push(statement);
        }
        return SyntaxNodeList.create(statements);
    };
    Parser.prototype.isReturnStatement = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ReturnKeyword;
    };
    Parser.prototype.parseReturnStatement = function () {
        Debug.assert(this.isReturnStatement());
        var returnKeyword = this.eatKeyword(SyntaxKind.ReturnKeyword);
        var expression = null;
        if(!this.canEatExplicitOrAutomaticSemicolon()) {
            expression = this.parseExpression(true);
        }
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
    };
    Parser.prototype.isExpressionStatement = function () {
        var currentToken = this.currentToken();
        var kind = currentToken.kind();
        var keywordKind = currentToken.keywordKind();
        switch(kind) {
            case SyntaxKind.NumericLiteral:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.RegularExpressionLiteral: {
                return true;

            }
            case SyntaxKind.OpenBracketToken:
            case SyntaxKind.OpenParenToken: {
                return true;

            }
            case SyntaxKind.PlusPlusToken:
            case SyntaxKind.MinusMinusToken:
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.TildeToken:
            case SyntaxKind.ExclamationToken: {
                return true;

            }
        }
        switch(keywordKind) {
            case SyntaxKind.ThisKeyword:
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
            case SyntaxKind.NullKeyword: {
                return true;

            }
            case SyntaxKind.NewKeyword: {
                return true;

            }
            case SyntaxKind.DeleteKeyword:
            case SyntaxKind.VoidKeyword:
            case SyntaxKind.TypeOfKeyword: {
                return true;

            }
        }
        if(this.isIdentifier(this.currentToken())) {
            return true;
        }
        return false;
    };
    Parser.prototype.parseExpressionStatement = function () {
        var expression = this.parseExpression(true);
        var semicolon = this.eatExplicitOrAutomaticSemicolon();
        return new ExpressionStatementSyntax(expression, semicolon);
    };
    Parser.prototype.isIfStatement = function () {
        return this.currentToken().keywordKind() === SyntaxKind.IfKeyword;
    };
    Parser.prototype.parseIfStatement = function () {
        Debug.assert(this.isIfStatement());
        var ifKeyword = this.eatKeyword(SyntaxKind.IfKeyword);
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var statement = this.parseStatement(false);
        var elseClause = null;
        if(this.isElseClause()) {
            elseClause = this.parseElseClause();
        }
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
    };
    Parser.prototype.isElseClause = function () {
        return this.currentToken().keywordKind() === SyntaxKind.ElseKeyword;
    };
    Parser.prototype.parseElseClause = function () {
        Debug.assert(this.isElseClause());
        var elseKeyword = this.eatKeyword(SyntaxKind.ElseKeyword);
        var statement = this.parseStatement(false);
        return new ElseClauseSyntax(elseKeyword, statement);
    };
    Parser.prototype.isVariableStatement = function () {
        if(this.currentToken().keywordKind() === SyntaxKind.VarKeyword) {
            return true;
        }
        return this.currentToken().keywordKind() === SyntaxKind.ExportKeyword && this.peekTokenN(1).keywordKind() === SyntaxKind.VarKeyword;
    };
    Parser.prototype.parseVariableStatement = function () {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword || this.currentToken().keywordKind() === SyntaxKind.VarKeyword);
        var exportKeyword = null;
        if(this.currentToken().keywordKind() === SyntaxKind.ExportKeyword) {
            exportKeyword = this.eatKeyword(SyntaxKind.ExportKeyword);
        }
        var variableDeclaration = this.parseVariableDeclaration(true);
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon();
        return new VariableStatementSyntax(exportKeyword, variableDeclaration, semicolonToken);
    };
    Parser.prototype.parseVariableDeclaration = function (allowIn) {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.VarKeyword);
        var varKeyword = this.eatKeyword(SyntaxKind.VarKeyword);
        var variableDeclarators = [];
        var variableDeclarator = this.parseVariableDeclarator(allowIn);
        variableDeclarators.push(variableDeclarator);
        while(true) {
            if(this.currentToken().kind() !== SyntaxKind.CommaToken) {
                break;
            }
            var commaToken = this.eatToken(SyntaxKind.CommaToken);
            variableDeclarators.push(commaToken);
            variableDeclarator = this.parseVariableDeclarator(allowIn);
            variableDeclarators.push(variableDeclarator);
        }
        return new VariableDeclarationSyntax(varKeyword, SeparatedSyntaxList.create(variableDeclarators));
    };
    Parser.prototype.parseVariableDeclarator = function (allowIn) {
        var identifier = this.eatIdentifierToken();
        var equalsValueClause = null;
        var typeAnnotation = null;
        if(!identifier.isMissing()) {
            if(this.isTypeAnnotation()) {
                typeAnnotation = this.parseTypeAnnotation();
            }
            if(this.isEqualsValueClause()) {
                equalsValueClause = this.parseEqualsValuesClause(allowIn);
            }
        }
        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
    };
    Parser.prototype.isEqualsValueClause = function () {
        return this.currentToken().kind() === SyntaxKind.EqualsToken;
    };
    Parser.prototype.parseEqualsValuesClause = function (allowIn) {
        Debug.assert(this.isEqualsValueClause());
        var equalsToken = this.eatToken(SyntaxKind.EqualsToken);
        var value = this.parseAssignmentExpression(allowIn);
        return new EqualsValueClauseSyntax(equalsToken, value);
    };
    Parser.prototype.parseExpression = function (allowIn) {
        return this.parseSubExpression(0, allowIn);
    };
    Parser.prototype.parseAssignmentExpression = function (allowIn) {
        return this.parseSubExpression(ParserExpressionPrecedence.AssignmentExpressionPrecedence, allowIn);
    };
    Parser.prototype.parseUnaryExpression = function () {
        var currentTokenKind = this.currentToken().kind();
        if(SyntaxFacts.isPrefixUnaryExpressionOperatorToken(currentTokenKind)) {
            var operatorKind = SyntaxFacts.getPrefixUnaryExpression(currentTokenKind);
            var operatorToken = this.eatAnyToken();
            var operand = this.parseUnaryExpression();
            return new PrefixUnaryExpressionSyntax(operatorKind, operatorToken, operand);
        } else {
            return this.parseTerm(true, false);
        }
    };
    Parser.prototype.parseSubExpression = function (precedence, allowIn) {
        var leftOperand = this.parseUnaryExpression();
        leftOperand = this.parseBinaryExpressions(precedence, allowIn, leftOperand);
        leftOperand = this.parseConditionalExpression(precedence, allowIn, leftOperand);
        return leftOperand;
    };
    Parser.prototype.parseConditionalExpression = function (precedence, allowIn, leftOperand) {
        var currentTokenKind = this.currentToken().kind();
        if(currentTokenKind === SyntaxKind.QuestionToken && precedence <= ParserExpressionPrecedence.ConditionalExpressionPrecedence) {
            var questionToken = this.eatToken(SyntaxKind.QuestionToken);
            var whenTrueExpression = this.parseAssignmentExpression(allowIn);
            var colon = this.eatToken(SyntaxKind.ColonToken);
            var whenFalseExpression = this.parseAssignmentExpression(allowIn);
            leftOperand = new ConditionalExpressionSyntax(leftOperand, questionToken, whenTrueExpression, colon, whenFalseExpression);
        }
        return leftOperand;
    };
    Parser.prototype.parseBinaryExpressions = function (precedence, allowIn, leftOperand) {
        while(true) {
            var currentTokenKind = this.currentToken().kind();
            var currentTokenKeywordKind = this.currentToken().keywordKind();
            if(currentTokenKeywordKind === SyntaxKind.InstanceOfKeyword || currentTokenKeywordKind === SyntaxKind.InKeyword) {
                currentTokenKind = currentTokenKeywordKind;
            }
            if(!SyntaxFacts.isBinaryExpressionOperatorToken(currentTokenKind)) {
                break;
            }
            if(currentTokenKind === SyntaxKind.InKeyword && !allowIn) {
                break;
            }
            var binaryExpressionKind = SyntaxFacts.getBinaryExpressionFromOperatorToken(currentTokenKind);
            var newPrecedence = this.getPrecedence(binaryExpressionKind);
            Debug.assert(newPrecedence > 0);
            if(newPrecedence < precedence) {
                break;
            }
            if(newPrecedence == precedence && !this.isRightAssociative(binaryExpressionKind)) {
                break;
            }
            var operatorToken = this.eatAnyToken();
            leftOperand = new BinaryExpressionSyntax(binaryExpressionKind, leftOperand, operatorToken, this.parseSubExpression(newPrecedence, allowIn));
        }
        return leftOperand;
    };
    Parser.prototype.isRightAssociative = function (expressionKind) {
        switch(expressionKind) {
            case SyntaxKind.AssignmentExpression:
            case SyntaxKind.AddAssignmentExpression:
            case SyntaxKind.SubtractAssignmentExpression:
            case SyntaxKind.MultiplyAssignmentExpression:
            case SyntaxKind.DivideAssignmentExpression:
            case SyntaxKind.ModuloAssignmentExpression:
            case SyntaxKind.AndAssignmentExpression:
            case SyntaxKind.ExclusiveOrAssignmentExpression:
            case SyntaxKind.OrAssignmentExpression:
            case SyntaxKind.LeftShiftAssignmentExpression:
            case SyntaxKind.SignedRightShiftAssignmentExpression:
            case SyntaxKind.UnsignedRightShiftAssignmentExpression: {
                return true;

            }
            default: {
                return false;

            }
        }
    };
    Parser.prototype.parseTerm = function (allowInvocation, allowType) {
        var term = this.parseTermWorker(allowType);
        if(term.isMissing()) {
            return term;
        }
        return this.parsePostFixExpression(term, allowInvocation);
    };
    Parser.prototype.parsePostFixExpression = function (expression, allowInvocation) {
        Debug.assert(expression !== null);
        while(true) {
            var currentTokenKind = this.currentToken().kind();
            switch(currentTokenKind) {
                case SyntaxKind.OpenParenToken: {
                    if(!allowInvocation) {
                        return expression;
                    }
                    expression = new InvocationExpressionSyntax(expression, this.parseArgumentList());
                    break;

                }
                case SyntaxKind.OpenBracketToken: {
                    expression = this.parseElementAccessExpression(expression);
                    break;

                }
                case SyntaxKind.PlusPlusToken:
                case SyntaxKind.MinusMinusToken: {
                    if(this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
                        return expression;
                    }
                    expression = new PostfixUnaryExpressionSyntax(SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken(currentTokenKind), expression, this.eatAnyToken());
                    break;

                }
                case SyntaxKind.DotToken: {
                    expression = new MemberAccessExpressionSyntax(expression, this.eatToken(SyntaxKind.DotToken), this.parseIdentifierName());
                    break;

                }
                default: {
                    return expression;

                }
            }
        }
    };
    Parser.prototype.isArgumentList = function () {
        return this.currentToken().kind() === SyntaxKind.OpenParenToken;
    };
    Parser.prototype.parseArgumentList = function () {
        Debug.assert(this.isArgumentList());
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var arguments = null;
        if(this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
            var argument = this.parseAssignmentExpression(true);
            arguments = [];
            arguments.push(argument);
        }
        while(true) {
            if(this.currentToken().kind() === SyntaxKind.CloseParenToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
            if(this.currentToken().kind() == SyntaxKind.CommaToken) {
                var commaToken = this.eatToken(SyntaxKind.CommaToken);
                arguments = arguments == null ? [] : arguments;
                arguments.push(commaToken);
                var argument = this.parseAssignmentExpression(true);
                arguments.push(argument);
            } else {
                break;
            }
        }
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        return new ArgumentListSyntax(openParenToken, SeparatedSyntaxList.create(arguments), closeParenToken);
    };
    Parser.prototype.parseElementAccessExpression = function (expression) {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBracketToken);
        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
        var argumentExpression = this.parseExpression(true);
        var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);
        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    };
    Parser.prototype.parseTermWorker = function (allowType) {
        var currentToken = this.currentToken();
        if(allowType && this.isType()) {
            return this.parseType();
        }
        if(this.isIdentifier(currentToken)) {
            var identifier = this.eatIdentifierToken();
            return new IdentifierNameSyntax(identifier);
        }
        var currentTokenKind = currentToken.kind();
        var currentTokenKeywordKind = currentToken.keywordKind();
        switch(currentTokenKeywordKind) {
            case SyntaxKind.ThisKeyword: {
                return this.parseThisExpression();

            }
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword: {
                return this.parseLiteralExpression(SyntaxKind.BooleanLiteralExpression);

            }
            case SyntaxKind.NullKeyword: {
                return this.parseLiteralExpression(SyntaxKind.NullLiteralExpression);

            }
            case SyntaxKind.NewKeyword: {
                return this.parseObjectCreationExpression();

            }
        }
        switch(currentTokenKind) {
            case SyntaxKind.NumericLiteral: {
                return this.parseLiteralExpression(SyntaxKind.NumericLiteralExpression);

            }
            case SyntaxKind.RegularExpressionLiteral: {
                return this.parseLiteralExpression(SyntaxKind.RegularExpressionLiteralExpression);

            }
            case SyntaxKind.StringLiteral: {
                return this.parseLiteralExpression(SyntaxKind.StringLiteralExpression);

            }
            case SyntaxKind.OpenBracketToken: {
                return this.parseArrayLiteralExpression();

            }
            case SyntaxKind.OpenBraceToken: {
                return this.parseObjectLiteralExpression();

            }
            case SyntaxKind.OpenParenToken: {
                return this.parseParenthesizedOrLambdaExpression();

            }
            case SyntaxKind.LessThanToken: {
                return this.parseCastExpression();

            }
        }
        if(true) {
            throw Errors.notYetImplemented();
        }
        return new IdentifierNameSyntax(this.eatIdentifierToken());
    };
    Parser.prototype.parseCastExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.LessThanToken);
        var lessThanToken = this.eatToken(SyntaxKind.LessThanToken);
        var type = this.parseType();
        var greaterThanToken = this.eatToken(SyntaxKind.GreaterThanToken);
        var expression = this.parseUnaryExpression();
        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    };
    Parser.prototype.parseObjectCreationExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.NewKeyword);
        var newKeyword = this.eatKeyword(SyntaxKind.NewKeyword);
        var expression = this.parseTerm(false, true);
        var argumentList = null;
        if(this.isArgumentList()) {
            argumentList = this.parseArgumentList();
        }
        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    };
    Parser.prototype.parseParenthesizedOrLambdaExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        var result = this.tryParseArrowFunctionExpression();
        if(result !== null) {
            return result;
        }
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    };
    Parser.prototype.tryParseArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        if(this.isDefinitelyArrowFunctionExpression()) {
            return this.parseParenthesizedArrowFunctionExpression(false);
        }
        if(this.isDefinitelyParenthesizedExpression()) {
            return null;
        }
        var resetPoint = this.getResetPoint();
        try  {
            var arrowFunction = this.parseParenthesizedArrowFunctionExpression(true);
            if(arrowFunction === null) {
                this.reset(resetPoint);
            }
            return arrowFunction;
        }finally {
            this.release(resetPoint);
        }
    };
    Parser.prototype.isDefinitelyParenthesizedExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        var token1 = this.peekTokenN(1);
        var token2 = this.peekTokenN(2);
        if(token1.kind() === SyntaxKind.CloseParenToken) {
            return false;
        }
        if(!this.isIdentifier(token1)) {
            return true;
        }
        if(token1.kind() === SyntaxKind.IdentifierNameToken) {
            if(token2.kind() == SyntaxKind.DotToken) {
                return true;
            }
            if(SyntaxFacts.isBinaryExpressionOperatorToken(token2.kind()) && token2.kind() !== SyntaxKind.CommaToken) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.parseParenthesizedArrowFunctionExpression = function (requireArrow) {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        var callSignature = this.parseCallSignature();
        if(requireArrow && this.currentToken().kind() !== SyntaxKind.EqualsGreaterThanToken) {
            return null;
        }
        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var body = null;
        if(this.isBlock()) {
            body = this.parseBlock(false);
        } else {
            body = this.parseAssignmentExpression(true);
        }
        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
    };
    Parser.prototype.isBlock = function () {
        return this.currentToken().kind() === SyntaxKind.OpenBraceToken;
    };
    Parser.prototype.isDefinitelyArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        var token0 = this.currentToken();
        var token1 = this.peekTokenN(1);
        var token2 = this.peekTokenN(2);
        var token3 = this.peekTokenN(3);
        if(token1.kind() === SyntaxKind.CloseParenToken) {
            return true;
        }
        if(this.isIdentifier(token1)) {
            if(token2.kind() === SyntaxKind.ColonToken) {
                return true;
            } else {
                if(token2.kind() === SyntaxKind.QuestionToken) {
                    if(token3.kind() === SyntaxKind.ColonToken) {
                        return true;
                    } else {
                        if(token3.kind() === SyntaxKind.CommaExpression) {
                            return true;
                        } else {
                            if(token3.kind() === SyntaxKind.CloseParenToken) {
                            }
                        }
                    }
                } else {
                    if(token2.kind() === SyntaxKind.CloseParenToken) {
                        if(token3.kind() === SyntaxKind.EqualsGreaterThanToken) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    Parser.prototype.parseObjectLiteralExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBraceToken);
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var propertyAssignments = null;
        while(true) {
            if(this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
            if(this.isPropertyAssignment()) {
                var propertyAssignment = this.parsePropertyAssignment();
                propertyAssignments = propertyAssignments || [];
                propertyAssignments.push(propertyAssignment);
                if(this.currentToken().kind() === SyntaxKind.CommaToken) {
                    var commaToken = this.eatToken(SyntaxKind.CommaToken);
                    propertyAssignments.push(commaToken);
                    continue;
                }
            }
            break;
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new ObjectLiteralExpressionSyntax(openBraceToken, SeparatedSyntaxList.create(propertyAssignments), closeBraceToken);
    };
    Parser.prototype.parsePropertyAssignment = function () {
        Debug.assert(this.isPropertyAssignment());
        if(this.isGetAccessorPropertyAssignment()) {
            return this.parseGetAccessorPropertyAssignment();
        } else {
            if(this.isSetAccessorPropertyAssignment()) {
                return this.parseSetAccessorPropertyAssignment();
            } else {
                if(this.isSimplePropertyAssignment()) {
                    return this.parseSimplePropertyAssignment();
                } else {
                    throw Errors.invalidOperation();
                }
            }
        }
    };
    Parser.prototype.isPropertyAssignment = function () {
        return this.isGetAccessorPropertyAssignment() || this.isSetAccessorPropertyAssignment() || this.isSimplePropertyAssignment();
    };
    Parser.prototype.isGetAccessorPropertyAssignment = function () {
        return this.currentToken().keywordKind() === SyntaxKind.GetKeyword && this.isPropertyName(this.peekTokenN(1));
    };
    Parser.prototype.parseGetAccessorPropertyAssignment = function () {
        Debug.assert(this.isGetAccessorPropertyAssignment());
        var getKeyword = this.eatKeyword(SyntaxKind.GetKeyword);
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var block = this.parseBlock(true);
        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
    };
    Parser.prototype.isSetAccessorPropertyAssignment = function () {
        return this.currentToken().keywordKind() === SyntaxKind.SetKeyword && this.isPropertyName(this.peekTokenN(1));
    };
    Parser.prototype.parseSetAccessorPropertyAssignment = function () {
        Debug.assert(this.isSetAccessorPropertyAssignment());
        var setKeyword = this.eatKeyword(SyntaxKind.SetKeyword);
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var parameterName = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        var block = this.parseBlock(true);
        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
    };
    Parser.prototype.isSimplePropertyAssignment = function () {
        return this.isPropertyName(this.currentToken());
    };
    Parser.prototype.parseSimplePropertyAssignment = function () {
        Debug.assert(this.isSimplePropertyAssignment());
        var propertyName = this.eatAnyToken();
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var expression = this.parseAssignmentExpression(true);
        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    };
    Parser.prototype.isPropertyName = function (token) {
        switch(token.kind()) {
            case SyntaxKind.IdentifierNameToken:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.NumericLiteral: {
                return true;

            }
            default: {
                return false;

            }
        }
    };
    Parser.prototype.parseArrayLiteralExpression = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBracketToken);
        var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
        var expressions = null;
        var addOmittedExpression = true;
        while(true) {
            var currentTokenKind = this.currentToken().kind();
            if(currentTokenKind === SyntaxKind.CloseBracketToken || currentTokenKind === SyntaxKind.EndOfFileToken) {
                break;
            }
            if(this.currentToken().kind() === SyntaxKind.CommaToken) {
                expressions = expressions || [];
                if(addOmittedExpression) {
                    expressions.push(new OmittedExpressionSyntax());
                }
                expressions.push(this.eatToken(SyntaxKind.CommaToken));
                addOmittedExpression = true;
                continue;
            }
            var expression = this.parseAssignmentExpression(true);
            if(expression.isMissing()) {
                break;
            }
            expressions = expressions || [];
            expressions.push(expression);
            addOmittedExpression = false;
            currentTokenKind = this.currentToken().kind();
            if(currentTokenKind !== SyntaxKind.CloseBracketToken && currentTokenKind !== SyntaxKind.CommaToken) {
                break;
            }
        }
        var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);
        return new ArrayLiteralExpressionSyntax(openBracketToken, SeparatedSyntaxList.create(expressions), closeBracketToken);
    };
    Parser.prototype.parseLiteralExpression = function (expressionKind) {
        var literal = this.eatAnyToken();
        return new LiteralExpressionSyntax(expressionKind, literal);
    };
    Parser.prototype.parseThisExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === SyntaxKind.ThisKeyword);
        var thisKeyword = this.eatKeyword(SyntaxKind.ThisKeyword);
        return new ThisExpressionSyntax(thisKeyword);
    };
    Parser.prototype.parseBlock = function (allowFunctionDeclaration) {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenBraceToken);
        var openBraceToken = this.eatToken(SyntaxKind.OpenBraceToken);
        var statements = null;
        while(true) {
            if(this.currentToken().kind() === SyntaxKind.CloseBraceToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
            var statement = this.parseStatement(allowFunctionDeclaration);
            statements = statements || [];
            statements.push(statement);
        }
        var closeBraceToken = this.eatToken(SyntaxKind.CloseBraceToken);
        return new BlockSyntax(openBraceToken, SyntaxNodeList.create(statements), closeBraceToken);
    };
    Parser.prototype.parseCallSignature = function () {
        Debug.assert(this.currentToken().kind() === SyntaxKind.OpenParenToken);
        var parameterList = this.parseParameterList();
        var typeAnnotation = null;
        if(this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }
        return new CallSignatureSyntax(parameterList, typeAnnotation);
    };
    Parser.prototype.parseParameterList = function () {
        var openParenToken = this.eatToken(SyntaxKind.OpenParenToken);
        var parameters = null;
        if(!openParenToken.isMissing()) {
            if(this.currentToken().kind() !== SyntaxKind.CloseParenToken && this.currentToken().kind() !== SyntaxKind.EndOfFileToken) {
                var parameter = this.parseParameter();
                parameters = [];
                parameters.push(parameter);
            }
            while(true) {
                if(this.currentToken().kind() === SyntaxKind.CloseParenToken || this.currentToken().kind() === SyntaxKind.EndOfFileToken) {
                    break;
                }
                if(this.currentToken().kind() == SyntaxKind.CommaToken) {
                    var commaToken = this.eatToken(SyntaxKind.CommaToken);
                    parameters = parameters == null ? [] : parameters;
                    parameters.push(commaToken);
                    var parameter = this.parseParameter();
                    parameters.push(parameter);
                } else {
                    break;
                }
            }
        }
        var closeParenToken = this.eatToken(SyntaxKind.CloseParenToken);
        return new ParameterListSyntax(openParenToken, SeparatedSyntaxList.create(parameters), closeParenToken);
    };
    Parser.prototype.isTypeAnnotation = function () {
        return this.currentToken().kind() === SyntaxKind.ColonToken;
    };
    Parser.prototype.parseTypeAnnotation = function () {
        Debug.assert(this.isTypeAnnotation());
        var colonToken = this.eatToken(SyntaxKind.ColonToken);
        var type = this.parseType();
        return new TypeAnnotationSyntax(colonToken, type);
    };
    Parser.prototype.isType = function () {
        return this.isPredefinedType() || this.isTypeLiteral() || this.isName();
    };
    Parser.prototype.parseType = function () {
        var type = this.parseNonArrayType();
        while(this.currentToken().kind() === SyntaxKind.OpenBracketToken) {
            var openBracketToken = this.eatToken(SyntaxKind.OpenBracketToken);
            var closeBracketToken = this.eatToken(SyntaxKind.CloseBracketToken);
            type = new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
        }
        return type;
    };
    Parser.prototype.parseNonArrayType = function () {
        if(this.isPredefinedType()) {
            return this.parsePredefinedType();
        } else {
            if(this.isTypeLiteral()) {
                return this.parseTypeLiteral();
            } else {
                return this.parseName();
            }
        }
    };
    Parser.prototype.parseTypeLiteral = function () {
        Debug.assert(this.isTypeLiteral());
        if(this.isObjectType()) {
            return this.parseObjectType();
        } else {
            if(this.isFunctionType()) {
                return this.parseFunctionType();
            } else {
                if(this.isConstructorType()) {
                    return this.parseConstructorType();
                } else {
                    throw Errors.invalidOperation();
                }
            }
        }
    };
    Parser.prototype.parseFunctionType = function () {
        Debug.assert(this.isFunctionType());
        var parameterList = this.parseParameterList();
        var equalsGreaterThanToken = this.eatToken(SyntaxKind.EqualsGreaterThanToken);
        var returnType = this.parseType();
        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, returnType);
    };
    Parser.prototype.parseConstructorType = function () {
        throw Errors.notYetImplemented();
    };
    Parser.prototype.isTypeLiteral = function () {
        return this.isObjectType() || this.isFunctionType() || this.isConstructorType();
    };
    Parser.prototype.isObjectType = function () {
        return this.currentToken().kind() === SyntaxKind.OpenBraceToken;
    };
    Parser.prototype.isFunctionType = function () {
        return this.currentToken().kind() === SyntaxKind.OpenParenToken;
    };
    Parser.prototype.isConstructorType = function () {
        return this.currentToken().keywordKind() === SyntaxKind.NewKeyword;
    };
    Parser.prototype.parsePredefinedType = function () {
        Debug.assert(this.isPredefinedType());
        var keyword = this.eatAnyToken();
        return new PredefinedTypeSyntax(keyword);
    };
    Parser.prototype.isPredefinedType = function () {
        switch(this.currentToken().keywordKind()) {
            case SyntaxKind.AnyKeyword:
            case SyntaxKind.NumberKeyword:
            case SyntaxKind.BoolKeyword:
            case SyntaxKind.StringKeyword:
            case SyntaxKind.VoidKeyword: {
                return true;

            }
        }
        return false;
    };
    Parser.prototype.parseParameter = function () {
        var dotDotDotToken = null;
        if(this.currentToken().kind() === SyntaxKind.DotDotDotToken) {
            dotDotDotToken = this.eatToken(SyntaxKind.DotDotDotToken);
        }
        var publicOrPrivateToken = null;
        if(this.currentToken().keywordKind() === SyntaxKind.PublicKeyword || this.currentToken().keywordKind() === SyntaxKind.PrivateKeyword) {
            publicOrPrivateToken = this.eatAnyToken();
        }
        var identifier = this.eatIdentifierToken();
        var questionToken = null;
        if(this.currentToken().kind() === SyntaxKind.QuestionToken) {
            questionToken = this.eatToken(SyntaxKind.QuestionToken);
        }
        var typeAnnotation = null;
        if(this.isTypeAnnotation()) {
            typeAnnotation = this.parseTypeAnnotation();
        }
        var equalsValueClause = null;
        if(this.isEqualsValueClause()) {
            equalsValueClause = this.parseEqualsValuesClause(true);
        }
        return new ParameterSyntax(dotDotDotToken, publicOrPrivateToken, identifier, questionToken, typeAnnotation, equalsValueClause);
    };
    return Parser;
})();
var ScannerTokenInfo = (function () {
    function ScannerTokenInfo() { }
    return ScannerTokenInfo;
})();
var ScannerTriviaInfo = (function () {
    function ScannerTriviaInfo() { }
    return ScannerTriviaInfo;
})();
var Scanner = (function () {
    function Scanner(text, languageVersion, stringTable) {
        this._text = null;
        this.builder = [];
        this.identifierBuffer = [];
        this.identifierLength = 0;
        this.stringTable = null;
        this.errors = [];
        this.textWindow = null;
        this.previousTokenKind = SyntaxKind.None;
        this.tokenInfo = new ScannerTokenInfo();
        this.leadingTriviaInfo = new ScannerTriviaInfo();
        this.trailingTriviaInfo = new ScannerTriviaInfo();
        Contract.throwIfNull(stringTable);
        this._text = text;
        this.identifierBuffer = ArrayUtilities.createArray(32);
        this.stringTable = stringTable;
        this.textWindow = new SlidingTextWindow(text, stringTable);
        this.languageVersion = languageVersion;
    }
    Scanner.create = function create(text, languageVersion) {
        return new Scanner(text, languageVersion, new StringTable());
    }
    Scanner.prototype.text = function () {
        return this._text;
    };
    Scanner.prototype.addComplexDiagnosticInfo = function (position, width, code) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 3); _i++) {
            args[_i] = arguments[_i + 3];
        }
        this.addDiagnosticInfo(this.makeComplexDiagnosticInfo(position, width, code, args));
    };
    Scanner.prototype.addSimpleDiagnosticInfo = function (code) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        this.addDiagnosticInfo(this.makeSimpleDiagnosticInfo(code, args));
    };
    Scanner.prototype.addDiagnosticInfo = function (error) {
        if(this.errors === null) {
            this.errors = [];
        }
        this.errors.push(error);
    };
    Scanner.prototype.makeComplexDiagnosticInfo = function (position, width, code) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 3); _i++) {
            args[_i] = arguments[_i + 3];
        }
        var offset = position >= this.textWindow.startPosition() ? position - this.textWindow.startPosition() : position;
        return new SyntaxDiagnosticInfo(offset, width, code, args);
    };
    Scanner.prototype.makeSimpleDiagnosticInfo = function (code, args) {
        return SyntaxDiagnosticInfo.create(code, args);
    };
    Scanner.prototype.scan = function () {
        if(this.errors.length > 0) {
            this.errors = [];
        }
        var start = this.textWindow.position();
        this.scanTriviaInfo(this.textWindow.position() > 0, false, this.leadingTriviaInfo);
        this.scanSyntaxToken();
        this.scanTriviaInfo(true, true, this.trailingTriviaInfo);
        this.previousTokenKind = this.tokenInfo.Kind;
        return this.createToken(start);
    };
    Scanner.prototype.createToken = function (start) {
        return SyntaxToken.create(start, this.leadingTriviaInfo, this.tokenInfo, this.trailingTriviaInfo, this.errors.length == 0 ? null : this.errors);
    };
    Scanner.prototype.scanTriviaInfo = function (afterFirstToken, isTrailing, triviaInfo) {
        this.textWindow.start();
        triviaInfo.Width = 0;
        triviaInfo.HasComment = false;
        triviaInfo.HasNewLine = false;
        while(true) {
            var ch = this.textWindow.peekCharAtPosition();
            switch(ch) {
                case CharacterCodes.space:
                case CharacterCodes.tab:
                case CharacterCodes.verticalTab:
                case CharacterCodes.formFeed:
                case CharacterCodes.nonBreakingSpace:
                case CharacterCodes.byteOrderMark: {
                    this.textWindow.advanceChar1();
                    triviaInfo.Width++;
                    continue;

                }
            }
            if(ch === CharacterCodes.slash) {
                var ch2 = this.textWindow.peekCharN(1);
                if(ch2 === CharacterCodes.slash) {
                    this.textWindow.advanceChar1();
                    this.textWindow.advanceChar1();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;
                    this.scanSingleLineCommentTrivia(triviaInfo);
                    continue;
                }
                if(ch2 === CharacterCodes.asterisk) {
                    this.textWindow.advanceChar1();
                    this.textWindow.advanceChar1();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;
                    this.scanMultiLineCommentTrivia(triviaInfo);
                    continue;
                }
                return;
            }
            if(this.isNewLineCharacter(ch)) {
                triviaInfo.HasNewLine = true;
                if(ch === CharacterCodes.carriageReturn) {
                    this.textWindow.advanceChar1();
                    triviaInfo.Width++;
                }
                ch = this.textWindow.peekCharAtPosition();
                if(ch === CharacterCodes.newLine) {
                    this.textWindow.advanceChar1();
                    triviaInfo.Width++;
                }
                if(isTrailing) {
                    return;
                }
                continue;
            }
            return;
        }
    };
    Scanner.prototype.isNewLineCharacter = function (ch) {
        return ch === CharacterCodes.carriageReturn || ch === CharacterCodes.newLine;
    };
    Scanner.prototype.scanSingleLineCommentTrivia = function (triviaInfo) {
        while(true) {
            var ch = this.textWindow.peekCharAtPosition();
            if(this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                return;
            }
            this.textWindow.advanceChar1();
            triviaInfo.Width++;
        }
    };
    Scanner.prototype.scanMultiLineCommentTrivia = function (triviaInfo) {
        while(true) {
            var ch = this.textWindow.peekCharAtPosition();
            if(ch === CharacterCodes.nullCharacter) {
                return;
            }
            if(ch === CharacterCodes.asterisk && this.textWindow.peekCharN(1) === CharacterCodes.slash) {
                this.textWindow.advanceChar1();
                this.textWindow.advanceChar1();
                triviaInfo.Width += 2;
                return;
            }
            this.textWindow.advanceChar1();
            triviaInfo.Width++;
        }
    };
    Scanner.prototype.scanSyntaxToken = function () {
        this.textWindow.start();
        this.tokenInfo.Kind = SyntaxKind.None;
        this.tokenInfo.KeywordKind = SyntaxKind.None;
        this.tokenInfo.Text = null;
        this.tokenInfo.HasUnicodeEscapeSequence = false;
        var character = this.textWindow.peekCharAtPosition();
        switch(character) {
            case CharacterCodes.doubleQuote:
            case CharacterCodes.singleQuote: {
                this.scanStringLiteral();
                return;

            }
            case CharacterCodes.slash: {
                this.scanSlashToken();
                return;

            }
            case CharacterCodes.dot: {
                this.scanDotToken();
                return;

            }
            case CharacterCodes.minus: {
                this.scanMinusToken();
                return;

            }
            case CharacterCodes.exclamation: {
                this.scanExclamationToken();
                return;

            }
            case CharacterCodes.equals: {
                this.scanEqualsToken();
                return;

            }
            case CharacterCodes.bar: {
                this.scanBarToken();
                return;

            }
            case CharacterCodes.asterisk: {
                this.scanAsteriskToken();
                return;

            }
            case CharacterCodes.plus: {
                this.scanPlusToken();
                return;

            }
            case CharacterCodes.percent: {
                this.scanPercentToken();
                return;

            }
            case CharacterCodes.ampersand: {
                this.scanAmpersandToken();
                return;

            }
            case CharacterCodes.caret: {
                this.scanCaretToken();
                return;

            }
            case CharacterCodes.lessThan: {
                this.scanLessThanToken();
                return;

            }
            case CharacterCodes.greaterThan: {
                this.scanGreaterThanToken();
                return;

            }
            case CharacterCodes.comma: {
                this.advanceAndSetTokenKind(SyntaxKind.CommaToken);
                return;

            }
            case CharacterCodes.colon: {
                this.advanceAndSetTokenKind(SyntaxKind.ColonToken);
                return;

            }
            case CharacterCodes.semicolon: {
                this.advanceAndSetTokenKind(SyntaxKind.SemicolonToken);
                return;

            }
            case CharacterCodes.tilde: {
                this.advanceAndSetTokenKind(SyntaxKind.TildeToken);
                return;

            }
            case CharacterCodes.openParen: {
                this.advanceAndSetTokenKind(SyntaxKind.OpenParenToken);
                return;

            }
            case CharacterCodes.closeParen: {
                this.advanceAndSetTokenKind(SyntaxKind.CloseParenToken);
                return;

            }
            case CharacterCodes.openBrace: {
                this.advanceAndSetTokenKind(SyntaxKind.OpenBraceToken);
                return;

            }
            case CharacterCodes.closeBrace: {
                this.advanceAndSetTokenKind(SyntaxKind.CloseBraceToken);
                return;

            }
            case CharacterCodes.openBracket: {
                this.advanceAndSetTokenKind(SyntaxKind.OpenBracketToken);
                return;

            }
            case CharacterCodes.closeBracket: {
                this.advanceAndSetTokenKind(SyntaxKind.CloseBracketToken);
                return;

            }
            case CharacterCodes.question: {
                this.advanceAndSetTokenKind(SyntaxKind.QuestionToken);
                return;

            }
            case CharacterCodes.nullCharacter: {
                this.tokenInfo.Kind = SyntaxKind.EndOfFileToken;
                this.tokenInfo.Text = "";
                return;

            }
        }
        if(character >= CharacterCodes.a && character <= CharacterCodes.z) {
            this.scanIdentifierOrKeyword();
            return;
        }
        if(this.isIdentifierStart(character)) {
            this.scanIdentifier();
            return;
        }
        if(this.isNumericLiteralStart(character)) {
            this.scanNumericLiteral();
            return;
        }
        this.scanDefaultCharacter(character, false);
    };
    Scanner.prototype.scanNumericLiteral = function () {
        if(this.isHexNumericLiteral()) {
            this.scanHexNumericLiteral();
        } else {
            this.scanDecimalNumericLiteral();
        }
    };
    Scanner.prototype.scanDecimalNumericLiteral = function () {
        while(CharacterInfo.isDecimalDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.dot) {
            this.textWindow.advanceChar1();
        }
        while(CharacterInfo.isDecimalDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }
        var ch = this.textWindow.peekCharAtPosition();
        if(ch === CharacterCodes.e || ch === CharacterCodes.E) {
            this.textWindow.advanceChar1();
        }
        ch = this.textWindow.peekCharAtPosition();
        if(ch === CharacterCodes.minus || ch === CharacterCodes.plus) {
            this.textWindow.advanceChar1();
        }
        while(CharacterInfo.isDecimalDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }
        this.tokenInfo.Text = this.textWindow.getText(false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    };
    Scanner.prototype.scanHexNumericLiteral = function () {
        Debug.assert(this.isHexNumericLiteral());
        this.textWindow.advanceChar1();
        this.textWindow.advanceChar1();
        while(CharacterInfo.isHexDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }
        this.tokenInfo.Text = this.textWindow.getText(false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    };
    Scanner.prototype.isHexNumericLiteral = function () {
        if(this.textWindow.peekCharAtPosition() === CharacterCodes._0) {
            var ch = this.textWindow.peekCharN(1);
            return ch === CharacterCodes.x || ch === CharacterCodes.X;
        }
        return false;
    };
    Scanner.prototype.isNumericLiteralStart = function (ch) {
        if(CharacterInfo.isDecimalDigit(ch)) {
            return true;
        }
        return this.isDotPrefixedNumericLiteral();
    };
    Scanner.prototype.scanIdentifier = function () {
        while(this.isIdentifierPart()) {
            this.tokenInfo.HasUnicodeEscapeSequence = this.tokenInfo.HasUnicodeEscapeSequence || this.isUnicodeEscape();
            this.scanCharOrUnicodeEscape(this.errors);
        }
        this.tokenInfo.Text = this.textWindow.getText(true);
        this.tokenInfo.Kind = SyntaxKind.IdentifierNameToken;
    };
    Scanner.prototype.isIdentifierStart_Fast = function (character) {
        if((character >= CharacterCodes.a && character <= CharacterCodes.z) || (character >= CharacterCodes.A && character <= CharacterCodes.Z) || character === CharacterCodes._ || character === CharacterCodes.$) {
            return true;
        }
        return false;
    };
    Scanner.prototype.isIdentifierStart_Slow = function () {
        var ch = this.peekCharOrUnicodeEscape();
        return Unicode.isIdentifierStart(ch, this.languageVersion);
    };
    Scanner.prototype.isIdentifierStart = function (character) {
        return this.isIdentifierStart_Fast(character) || this.isIdentifierStart_Slow();
    };
    Scanner.prototype.isIdentifierPart_Fast = function () {
        var character = this.textWindow.peekCharAtPosition();
        if(this.isIdentifierStart_Fast(character)) {
            return true;
        }
        return character >= CharacterCodes._0 && character <= CharacterCodes._9;
    };
    Scanner.prototype.isIdentifierPart_Slow = function () {
        if(this.isIdentifierStart_Slow()) {
            return true;
        }
        var ch = this.peekCharOrUnicodeEscape();
        return Unicode.isIdentifierPart(ch, this.languageVersion);
    };
    Scanner.prototype.isIdentifierPart = function () {
        return this.isIdentifierPart_Fast() || this.isIdentifierPart_Slow();
    };
    Scanner.prototype.scanIdentifierOrKeyword = function () {
        this.scanIdentifier();
        if(this.tokenInfo.HasUnicodeEscapeSequence) {
            return;
        }
        var kind = SyntaxFacts.getTokenKind(this.tokenInfo.Text);
        if(kind != SyntaxKind.None) {
            this.tokenInfo.KeywordKind = kind;
        }
    };
    Scanner.prototype.advanceAndSetTokenKind = function (kind) {
        this.textWindow.advanceChar1();
        this.tokenInfo.Kind = kind;
    };
    Scanner.prototype.scanGreaterThanToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanEqualsToken;
        } else {
            if(character === CharacterCodes.greaterThan) {
                this.scanGreaterThanGreaterThanToken();
            } else {
                this.tokenInfo.Kind = SyntaxKind.GreaterThanToken;
            }
        }
    };
    Scanner.prototype.scanGreaterThanGreaterThanToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanEqualsToken;
        } else {
            if(character === CharacterCodes.greaterThan) {
                this.scanGreaterThanGreaterThanGreaterThanToken();
            } else {
                this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanToken;
            }
        }
    };
    Scanner.prototype.scanGreaterThanGreaterThanGreaterThanToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
        } else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
        }
    };
    Scanner.prototype.scanLessThanToken = function () {
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.LessThanEqualsToken;
        } else {
            if(this.textWindow.peekCharAtPosition() === CharacterCodes.lessThan) {
                this.textWindow.advanceChar1();
                if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
                    this.textWindow.advanceChar1();
                    this.tokenInfo.Kind = SyntaxKind.LessThanLessThanEqualsToken;
                } else {
                    this.tokenInfo.Kind = SyntaxKind.LessThanLessThanToken;
                }
            } else {
                this.tokenInfo.Kind = SyntaxKind.LessThanToken;
            }
        }
    };
    Scanner.prototype.scanBarToken = function () {
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.BarEqualsToken;
        } else {
            if(this.textWindow.peekCharAtPosition() === CharacterCodes.bar) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.BarBarToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.BarToken;
            }
        }
    };
    Scanner.prototype.scanCaretToken = function () {
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.CaretEqualsToken;
        } else {
            this.tokenInfo.Kind = SyntaxKind.CaretToken;
        }
    };
    Scanner.prototype.scanAmpersandToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.AmpersandEqualsToken;
        } else {
            if(this.textWindow.peekCharAtPosition() === CharacterCodes.ampersand) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.AmpersandAmpersandToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.AmpersandToken;
            }
        }
    };
    Scanner.prototype.scanPercentToken = function () {
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.PercentEqualsToken;
        } else {
            this.tokenInfo.Kind = SyntaxKind.PercentToken;
        }
    };
    Scanner.prototype.scanMinusToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.MinusEqualsToken;
        } else {
            if(character === CharacterCodes.minus) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.MinusMinusToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.MinusToken;
            }
        }
    };
    Scanner.prototype.scanPlusToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.PlusEqualsToken;
        } else {
            if(character === CharacterCodes.plus) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.PlusPlusToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.PlusToken;
            }
        }
    };
    Scanner.prototype.scanAsteriskToken = function () {
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.AsteriskEqualsToken;
        } else {
            this.tokenInfo.Kind = SyntaxKind.AsteriskToken;
        }
    };
    Scanner.prototype.scanEqualsToken = function () {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if(character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsEqualsToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsToken;
            }
        } else {
            if(character === CharacterCodes.greaterThan) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.EqualsGreaterThanToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.EqualsToken;
            }
        }
    };
    Scanner.prototype.isDotPrefixedNumericLiteral = function () {
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.dot) {
            var ch = this.textWindow.peekCharN(1);
            return CharacterInfo.isDecimalDigit(ch);
        }
        return false;
    };
    Scanner.prototype.scanDotToken = function () {
        if(this.isDotPrefixedNumericLiteral()) {
            this.scanNumericLiteral();
            return;
        }
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.dot && this.textWindow.peekCharN(1) === CharacterCodes.dot) {
            this.textWindow.advanceChar1();
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.DotDotDotToken;
        } else {
            this.tokenInfo.Kind = SyntaxKind.DotToken;
        }
    };
    Scanner.prototype.scanSlashToken = function () {
        if(this.tryScanRegularExpressionToken()) {
            return;
        }
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.SlashEqualsToken;
        } else {
            this.tokenInfo.Kind = SyntaxKind.SlashToken;
        }
    };
    Scanner.prototype.tryScanRegularExpressionToken = function () {
        switch(this.previousTokenKind) {
            case SyntaxKind.IdentifierNameToken:
            case SyntaxKind.StringLiteral:
            case SyntaxKind.RegularExpressionLiteral:
            case SyntaxKind.ThisKeyword:
            case SyntaxKind.PlusPlusToken:
            case SyntaxKind.MinusMinusToken:
            case SyntaxKind.CloseParenToken:
            case SyntaxKind.CloseBracketToken:
            case SyntaxKind.CloseBraceToken:
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword: {
                return false;

            }
        }
        Debug.assert(this.textWindow.peekCharAtPosition() === CharacterCodes.slash);
        var start = this.textWindow.position();
        this.textWindow.advanceChar1();
        var skipNextSlash = false;
        while(true) {
            var ch = this.textWindow.peekCharAtPosition();
            if(this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                this.textWindow.reset(start);
                return false;
            }
            this.textWindow.advanceChar1();
            if(!skipNextSlash && ch === CharacterCodes.slash) {
                break;
            } else {
                if(!skipNextSlash && ch === CharacterCodes.backslash) {
                    skipNextSlash = true;
                    continue;
                }
            }
            skipNextSlash = false;
        }
        while(this.isIdentifierPart()) {
            this.scanCharOrUnicodeEscape(this.errors);
        }
        this.tokenInfo.Kind = SyntaxKind.RegularExpressionLiteral;
        this.tokenInfo.Text = this.textWindow.getText(false);
        return true;
    };
    Scanner.prototype.scanExclamationToken = function () {
        this.textWindow.advanceChar1();
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            if(this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
                this.textWindow.advanceChar1();
                this.tokenInfo.Kind = SyntaxKind.ExclamationEqualsEqualsToken;
            } else {
                this.tokenInfo.Kind = SyntaxKind.ExclamationEqualsToken;
            }
        } else {
            this.tokenInfo.Kind = SyntaxKind.ExclamationToken;
        }
    };
    Scanner.prototype.scanDefaultCharacter = function (character, isEscaped) {
        this.textWindow.advanceChar1();
        this.tokenInfo.Text = this.textWindow.getText(true);
        this.tokenInfo.Kind = SyntaxKind.ErrorToken;
        this.addSimpleDiagnosticInfo(DiagnosticCode.Unexpected_character_0, this.tokenInfo.Text);
    };
    Scanner.prototype.scanEscapeSequence = function () {
        var start = this.textWindow.position();
        var ch = this.textWindow.peekCharAtPosition();
        this.textWindow.advanceChar1();
        Debug.assert(ch === CharacterCodes.backslash);
        ch = this.textWindow.peekCharAtPosition();
        this.textWindow.advanceChar1();
        switch(ch) {
            case CharacterCodes.singleQuote:
            case CharacterCodes.doubleQuote:
            case CharacterCodes.backslash: {
                return ch;

            }
            case CharacterCodes._0: {
                return CharacterCodes.nullCharacter;

            }
            case CharacterCodes.b: {
                return CharacterCodes.backspace;

            }
            case CharacterCodes.f: {
                return CharacterCodes.formFeed;

            }
            case CharacterCodes.n: {
                return CharacterCodes.newLine;

            }
            case CharacterCodes.r: {
                return CharacterCodes.carriageReturn;

            }
            case CharacterCodes.t: {
                return CharacterCodes.tab;

            }
            case CharacterCodes.v: {
                return CharacterCodes.verticalTab;

            }
            case CharacterCodes.x:
            case CharacterCodes.u: {
                this.textWindow.reset(start);
                return this.scanUnicodeOrHexEscape(this.errors);

            }
            default: {
                this.addComplexDiagnosticInfo(start, this.textWindow.position() - start, DiagnosticCode.Unrecognized_escape_sequence);
                return ch;

            }
        }
    };
    Scanner.prototype.scanStringLiteral = function () {
        var quoteCharacter = this.textWindow.peekCharAtPosition();
        Debug.assert(quoteCharacter === CharacterCodes.singleQuote || quoteCharacter === CharacterCodes.doubleQuote);
        this.textWindow.advanceChar1();
        while(true) {
            var ch = this.textWindow.peekCharAtPosition();
            if(ch === CharacterCodes.backslash) {
                ch = this.scanEscapeSequence();
            } else {
                if(ch === quoteCharacter) {
                    this.textWindow.advanceChar1();
                    break;
                } else {
                    if(ch === CharacterCodes.nullCharacter) {
                        this.addSimpleDiagnosticInfo(DiagnosticCode.Missing_closing_quote_character);
                        break;
                    } else {
                        this.textWindow.advanceChar1();
                    }
                }
            }
        }
        this.tokenInfo.Text = this.textWindow.getText(true);
        this.tokenInfo.Kind = SyntaxKind.StringLiteral;
    };
    Scanner.prototype.isUnicodeOrHexEscape = function () {
        return this.isUnicodeEscape() || this.isHexEscape();
    };
    Scanner.prototype.isUnicodeEscape = function () {
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if(ch2 === CharacterCodes.u) {
                return true;
            }
        }
        return false;
    };
    Scanner.prototype.isHexEscape = function () {
        if(this.textWindow.peekCharAtPosition() === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if(ch2 === CharacterCodes.h) {
                return true;
            }
        }
        return false;
    };
    Scanner.prototype.peekCharOrUnicodeOrHexEscape = function () {
        if(this.isUnicodeOrHexEscape()) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return this.textWindow.peekCharAtPosition();
        }
    };
    Scanner.prototype.peekCharOrUnicodeEscape = function () {
        if(this.isUnicodeEscape()) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return this.textWindow.peekCharAtPosition();
        }
    };
    Scanner.prototype.peekUnicodeOrHexEscape = function () {
        var position = this.textWindow.position();
        var ch = this.scanUnicodeOrHexEscape(null);
        this.textWindow.reset(position);
        return ch;
    };
    Scanner.prototype.scanCharOrUnicodeEscape = function (errors) {
        var ch = this.textWindow.peekCharAtPosition();
        if(ch === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if(ch2 === CharacterCodes.u) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }
        this.textWindow.advanceChar1();
        return ch;
    };
    Scanner.prototype.scanCharOrUnicodeOrHexEscape = function (errors) {
        var ch = this.textWindow.peekCharAtPosition();
        if(ch === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if(ch2 === CharacterCodes.u || ch2 === CharacterCodes.h) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }
        this.textWindow.advanceChar1();
        return ch;
    };
    Scanner.prototype.scanUnicodeOrHexEscape = function (errors) {
        var start = this.textWindow.position();
        var character = this.textWindow.peekCharAtPosition();
        Debug.assert(character === CharacterCodes.backslash);
        this.textWindow.advanceChar1();
        character = this.textWindow.peekCharAtPosition();
        Debug.assert(character === CharacterCodes.u || character === CharacterCodes.h);
        var intChar = 0;
        this.textWindow.advanceChar1();
        var count = character === CharacterCodes.u ? 4 : 2;
        for(var i = 0; i < count; i++) {
            var ch2 = this.textWindow.peekCharAtPosition();
            if(!CharacterInfo.isHexDigit(ch2)) {
                if(errors !== null) {
                    var info = this.createIllegalEscapeDiagnostic(start);
                    errors.push(info);
                }
                break;
            }
            intChar = (intChar << 4) + CharacterInfo.hexValue(ch2);
            this.textWindow.advanceChar1();
        }
        return intChar;
    };
    Scanner.prototype.createIllegalEscapeDiagnostic = function (start) {
        return new SyntaxDiagnosticInfo(start - this.textWindow.startPosition(), this.textWindow.position() - start, DiagnosticCode.Unrecognized_escape_sequence);
    };
    return Scanner;
})();
var SeparatedSyntaxList = (function () {
    function SeparatedSyntaxList() { }
    SeparatedSyntaxList.empty = {
        toJSON: function (key) {
            return [];
        },
        count: function () {
            return 0;
        },
        syntaxNodeCount: function () {
            return 0;
        },
        separatorCount: function () {
            return 0;
        },
        itemAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        },
        syntaxNodeAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        },
        separatorAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        }
    };
    SeparatedSyntaxList.toJSON = function toJSON(list) {
        var result = [];
        for(var i = 0; i < list.count(); i++) {
            result.push(list.itemAt(i));
        }
        return result;
    }
    SeparatedSyntaxList.create = function create(nodes) {
        if(nodes === null || nodes.length === 0) {
            return SeparatedSyntaxList.empty;
        }
        for(var i = 0; i < nodes.length; i++) {
            var item = nodes[i];
            if(i % 2 === 0) {
                Debug.assert(!SyntaxFacts.isTokenKind(item.kind()));
            } else {
                Debug.assert(SyntaxFacts.isTokenKind(item.kind()));
            }
        }
        if(nodes.length === 1) {
            var item = nodes[0];
            var list;
            list = {
                toJSON: function (key) {
                    return SeparatedSyntaxList.toJSON(list);
                },
                count: function () {
                    return 1;
                },
                syntaxNodeCount: function () {
                    return 1;
                },
                separatorCount: function () {
                    return 0;
                },
                itemAt: function (index) {
                    if(index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }
                    return item;
                },
                syntaxNodeAt: function (index) {
                    if(index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }
                    return item;
                },
                separatorAt: function (index) {
                    throw Errors.argumentOutOfRange("index");
                }
            };
            return list;
        }
        var list;
        list = {
            toJSON: function (key) {
                return SeparatedSyntaxList.toJSON(list);
            },
            count: function () {
                return nodes.length;
            },
            syntaxNodeCount: function () {
                return IntegerUtilities.integerDivide(nodes.length + 1, 2);
            },
            separatorCount: function () {
                return IntegerUtilities.integerDivide(nodes.length, 2);
            },
            itemAt: function (index) {
                if(index < 0 || index >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }
                return nodes[index];
            },
            syntaxNodeAt: function (index) {
                var value = index * 2;
                if(value < 0 || value >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }
                return nodes[value];
            },
            separatorAt: function (index) {
                var value = index * 2 + 1;
                if(value < 0 || value >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }
                return nodes[value];
            }
        };
        return list;
    }
    return SeparatedSyntaxList;
})();
var SlidingTextWindow = (function () {
    function SlidingTextWindow(text, stringTable) {
        this.DefaultWindowLength = 2048;
        this.text = null;
        this._characterWindowStart = 0;
        this.basis = 0;
        this.offset = 0;
        this.characterWindow = null;
        this._characterWindowCount = 0;
        this.stringTable = null;
        Debug.assert(stringTable !== null);
        this.text = text;
        this.stringTable = stringTable;
        this.characterWindow = ArrayUtilities.createArray(this.DefaultWindowLength);
        Debug.assert(this.characterWindow !== null);
    }
    SlidingTextWindow.prototype.position = function () {
        return this.offset + this.basis;
    };
    SlidingTextWindow.prototype.startPosition = function () {
        return this._characterWindowStart + this.basis;
    };
    SlidingTextWindow.prototype.start = function () {
        this._characterWindowStart = this.offset;
    };
    SlidingTextWindow.prototype.reset = function (position) {
        var relative = position - this.basis;
        if(relative >= 0 && relative <= this._characterWindowCount) {
            this.offset = relative;
        } else {
            var amountToRead = MathPrototype.min(this.text.length(), position + this.characterWindow.length) - position;
            amountToRead = MathPrototype.max(amountToRead, 0);
            if(amountToRead > 0) {
                this.text.copyTo(position, this.characterWindow, 0, amountToRead);
            }
            this._characterWindowStart = 0;
            this.offset = 0;
            this.basis = position;
            this._characterWindowCount = amountToRead;
        }
    };
    SlidingTextWindow.prototype.moreChars = function () {
        if(this.offset >= this._characterWindowCount) {
            if(this.offset + this.basis >= this.text.length()) {
                return false;
            }
            if(this._characterWindowStart > (this._characterWindowCount >> 2)) {
                ArrayUtilities.copy(this.characterWindow, this._characterWindowStart, this.characterWindow, 0, this._characterWindowCount - this._characterWindowStart);
                this._characterWindowCount -= this._characterWindowStart;
                this.offset -= this._characterWindowStart;
                this.basis += this._characterWindowStart;
                this._characterWindowStart = 0;
            }
            if(this._characterWindowCount >= this.characterWindow.length) {
                this.characterWindow[this.characterWindow.length * 2 - 1] = CharacterCodes.nullCharacter;
            }
            var amountToRead = MathPrototype.min(this.text.length() - (this.basis + this._characterWindowCount), this.characterWindow.length - this._characterWindowCount);
            this.text.copyTo(this.basis + this._characterWindowCount, this.characterWindow, this._characterWindowCount, amountToRead);
            this._characterWindowCount += amountToRead;
            return amountToRead > 0;
        }
        return true;
    };
    SlidingTextWindow.prototype.advanceChar1 = function () {
        this.offset++;
    };
    SlidingTextWindow.prototype.advanceCharN = function (n) {
        this.offset += n;
    };
    SlidingTextWindow.prototype.peekCharAtPosition = function () {
        if(this.offset >= this._characterWindowCount) {
            if(!this.moreChars()) {
                return CharacterCodes.nullCharacter;
            }
        }
        return this.characterWindow[this.offset];
    };
    SlidingTextWindow.prototype.peekCharN = function (delta) {
        var position = this.position();
        this.advanceCharN(delta);
        var ch = this.peekCharAtPosition();
        this.reset(position);
        return ch;
    };
    SlidingTextWindow.prototype.internCharArray = function (array, start, length) {
        return this.stringTable.addCharArray(array, start, length);
    };
    SlidingTextWindow.prototype.getText = function (intern) {
        var width = this.offset - this._characterWindowStart;
        return this.getSubstringText(this.startPosition(), width, intern);
    };
    SlidingTextWindow.prototype.getSubstringText = function (position, length, intern) {
        var offset = position - this.basis;
        if(intern) {
            return this.internCharArray(this.characterWindow, offset, length);
        } else {
            return StringUtilities.fromCharCodeArray(this.characterWindow.slice(offset, offset + length));
        }
    };
    return SlidingTextWindow;
})();
var TextBase = (function () {
    function TextBase() {
        this.lazyLineStarts = null;
        this.linebreakInfo = new LinebreakInfo(0, 0);
        this.lastLineFoundForPosition = null;
    }
    TextBase.prototype.length = function () {
        throw Errors.abstract();
    };
    TextBase.prototype.charCodeAt = function (position) {
        throw Errors.abstract();
    };
    TextBase.prototype.checkSubSpan = function (span) {
        if(span.start() < 0 || span.start() > this.length() || span.end() > this.length()) {
            throw Errors.argumentOutOfRange("span");
        }
    };
    TextBase.prototype.toString = function (span) {
        if (typeof span === "undefined") { span = null; }
        throw Errors.abstract();
    };
    TextBase.prototype.getSubText = function (span) {
        this.checkSubSpan(span);
        return new SubText(this, span);
    };
    TextBase.prototype.copyTo = function (sourceIndex, destination, destinationIndex, count) {
        throw Errors.abstract();
    };
    TextBase.prototype.lineCount = function () {
        return this.lineStarts().length;
    };
    TextBase.prototype.lines = function () {
        var lines = [];
        var length = this.lineCount();
        for(var i = 0; i < length; ++i) {
            lines[i] = this.getLineFromLineNumber(i);
        }
        return lines;
    };
    TextBase.prototype.lineStarts = function () {
        if(this.lazyLineStarts === null) {
            this.lazyLineStarts = this.parseLineStarts();
        }
        return this.lazyLineStarts;
    };
    TextBase.prototype.getLineFromLineNumber = function (lineNumber) {
        var lineStarts = this.lineStarts();
        if(lineNumber < 0 || lineNumber >= lineStarts.length) {
            throw Errors.argumentOutOfRange("lineNumber");
        }
        var first = lineStarts[lineNumber];
        if(lineNumber === lineStarts.length - 1) {
            return new TextLine(this, new TextSpan(first, this.length() - first), 0, lineNumber);
        } else {
            TextUtilities.getStartAndLengthOfLineBreakEndingAt(this, lineStarts[lineNumber + 1] - 1, this.linebreakInfo);
            return new TextLine(this, new TextSpan(first, this.linebreakInfo.startPosition - first), this.linebreakInfo.length, lineNumber);
        }
    };
    TextBase.prototype.getLineFromPosition = function (position) {
        var lastFound = this.lastLineFoundForPosition;
        if(lastFound !== null && lastFound.start() <= position && lastFound.endIncludingLineBreak() > position) {
            return lastFound;
        }
        var lineNumber = this.getLineNumberFromPosition(position);
        var result = this.getLineFromLineNumber(lineNumber);
        this.lastLineFoundForPosition = result;
        return result;
    };
    TextBase.prototype.getLineNumberFromPosition = function (position) {
        if(position < 0 || position > this.length()) {
            throw Errors.argumentOutOfRange("position");
        }
        if(position === this.length()) {
            return this.lineCount() - 1;
        }
        var lineNumber = ArrayUtilities.binarySearch(this.lineStarts(), position);
        if(lineNumber < 0) {
            lineNumber = (~lineNumber) - 1;
        }
        return lineNumber;
    };
    TextBase.prototype.getLinePosition = function (position) {
        if(position < 0 || position > this.length()) {
            throw Errors.argumentOutOfRange("position");
        }
        var lineNumber = this.getLineNumberFromPosition(position);
        return new LinePosition(lineNumber, position - this.lineStarts()[lineNumber]);
    };
    TextBase.prototype.parseLineStarts = function () {
        var length = this.length();
        if(0 === this.length()) {
            var result = [];
            result.push(0);
            return result;
        }
        var position = 0;
        var index = 0;
        var arrayBuilder = [];
        var lineNumber = 0;
        while(index < length) {
            var c = this.charCodeAt(0);
            var lineBreakLength;
            if(c > CharacterCodes.carriageReturn && c <= 127) {
                index++;
                continue;
            } else {
                if(c === CharacterCodes.carriageReturn && index + 1 < length && this.charCodeAt(index + 1) === CharacterCodes.newLine) {
                    lineBreakLength = 2;
                } else {
                    if(c === CharacterCodes.newLine) {
                        lineBreakLength = 1;
                    } else {
                        lineBreakLength = TextUtilities.getLengthOfLineBreak(this, index);
                    }
                }
            }
            if(0 == lineBreakLength) {
                index++;
            } else {
                arrayBuilder.push(position);
                index += lineBreakLength;
                position = index;
                lineNumber++;
            }
        }
        arrayBuilder.push(position);
        return arrayBuilder;
    };
    return TextBase;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SubText = (function (_super) {
    __extends(SubText, _super);
    function SubText(text, span) {
        _super.call(this);
        this.text = null;
        this.span = null;
        if(text === null) {
            throw Errors.argumentNull("text");
        }
        if(span.start() < 0 || span.start() >= text.length() || span.end() < 0 || span.end() > text.length()) {
            throw Errors.argument("span");
        }
        this.text = text;
        this.span = span;
    }
    SubText.prototype.length = function () {
        return this.span.length();
    };
    SubText.prototype.charCodeAt = function (position) {
        if(position < 0 || position > this.length()) {
            throw Errors.argumentOutOfRange("position");
        }
        return this.text.charCodeAt(this.span.start() + position);
    };
    SubText.prototype.getSubText = function (span) {
        this.checkSubSpan(span);
        return new SubText(this.text, this.getCompositeSpan(span.start(), span.length()));
    };
    SubText.prototype.copyTo = function (sourceIndex, destination, destinationIndex, count) {
        var span = this.getCompositeSpan(sourceIndex, count);
        this.text.copyTo(span.start(), destination, destinationIndex, span.length());
    };
    SubText.prototype.getCompositeSpan = function (start, length) {
        var compositeStart = MathPrototype.min(this.text.length(), this.span.start() + start);
        var compositeEnd = MathPrototype.min(this.text.length(), compositeStart + length);
        return new TextSpan(compositeStart, compositeEnd - compositeStart);
    };
    return SubText;
})(TextBase);
var StringTableEntry = (function () {
    function StringTableEntry(text, hashCode, next) {
        this.Text = text;
        this.HashCode = hashCode;
        this.Next = next;
    }
    return StringTableEntry;
})();
var StringTable = (function () {
    function StringTable(mask, nested) {
        if (typeof mask === "undefined") { mask = 31; }
        if (typeof nested === "undefined") { nested = null; }
        this.nested = null;
        this.entries = [];
        this.mask = mask;
        this.entries = ArrayUtilities.createArray(mask + 1);
        this.nested = nested;
    }
    StringTable.prototype.addString = function (key) {
        var hashCode = StringTable.computeStringHashCode(key);
        if(this.nested !== null) {
            var exist = this.nested.findStringEntry(key, hashCode);
            if(exist !== null) {
                return exist.Text;
            }
        }
        var entry = this.findStringEntry(key, hashCode);
        if(entry !== null) {
            return entry.Text;
        }
        return this.addEntry(key, hashCode);
    };
    StringTable.prototype.findStringEntry = function (key, hashCode) {
        for(var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if(e.HashCode === hashCode && e.Text === key) {
                return e;
            }
        }
        return null;
    };
    StringTable.prototype.addSubstring = function (text, keyStart, keyLength) {
        var hashCode = StringTable.computeSubstringHashCode(text, keyStart, keyLength);
        if(this.nested !== null) {
            var exist = this.nested.findSubstringEntry(text, keyStart, keyLength, hashCode);
            if(exist !== null) {
                return exist.Text;
            }
        }
        var entry = this.findSubstringEntry(text, keyStart, keyLength, hashCode);
        if(entry !== null) {
            return entry.Text;
        }
        return this.addEntry(text.substr(keyStart, keyLength), hashCode);
    };
    StringTable.prototype.findSubstringEntry = function (text, keyStart, keyLength, hashCode) {
        for(var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if(e.HashCode === hashCode && StringTable.textSubstringEquals(e.Text, text, keyStart, keyLength)) {
                return e;
            }
        }
        return null;
    };
    StringTable.prototype.addCharArray = function (key, start, len) {
        var hashCode = StringTable.computeCharArrayHashCode(key, start, len);
        if(this.nested !== null) {
            var exist = this.nested.findCharArrayEntry(key, start, len, hashCode);
            if(exist !== null) {
                return exist.Text;
            }
        }
        var entry = this.findCharArrayEntry(key, start, len, hashCode);
        if(entry !== null) {
            return entry.Text;
        }
        var slice = key.slice(start, start + len);
        return this.addEntry(StringUtilities.fromCharCodeArray(slice), hashCode);
    };
    StringTable.prototype.findCharArrayEntry = function (key, start, len, hashCode) {
        for(var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if(e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                return e;
            }
        }
        return null;
    };
    StringTable.prototype.addChar = function (key) {
        var hashCode = StringTable.computeCharHashCode(key);
        if(this.nested !== null) {
            var exist = this.nested.findCharEntry(key, hashCode);
            if(exist !== null) {
                return exist.Text;
            }
        }
        var entry = this.findCharEntry(key, hashCode);
        if(entry !== null) {
            return entry.Text;
        }
        return this.addEntry(String.fromCharCode(key), hashCode);
    };
    StringTable.prototype.findCharEntry = function (key, hashCode) {
        for(var e = this.entries[hashCode & this.mask]; e !== null; e = e.Next) {
            if(e.HashCode === hashCode && e.Text.length === 1 && e.Text.charCodeAt(0) === key) {
                return e;
            }
        }
        return null;
    };
    StringTable.FNV_BASE = 2166136261;
    StringTable.FNV_PRIME = 16777619;
    StringTable.computeStringHashCode = function computeStringHashCode(key) {
        var hashCode = StringTable.FNV_BASE;
        for(var i = 0; i < key.length; i++) {
            hashCode = (hashCode ^ key[i]) * StringTable.FNV_PRIME;
        }
        return hashCode;
    }
    StringTable.computeSubstringHashCode = function computeSubstringHashCode(text, keyStart, keyLength) {
        var hashCode = StringTable.FNV_BASE;
        var end = keyStart + keyLength;
        for(var i = keyStart; i < end; i++) {
            hashCode = (hashCode ^ text.charCodeAt(i)) * StringTable.FNV_PRIME;
        }
        return hashCode;
    }
    StringTable.computeCharHashCode = function computeCharHashCode(ch) {
        var hashCode = StringTable.FNV_BASE;
        hashCode = (hashCode ^ ch) * StringTable.FNV_PRIME;
        return hashCode;
    }
    StringTable.computeCharArrayHashCode = function computeCharArrayHashCode(text, start, len) {
        var hashCode = StringTable.FNV_BASE;
        var end = start + len;
        for(var i = start; i < end; i++) {
            hashCode = (hashCode ^ text[i]) * StringTable.FNV_PRIME;
        }
        return hashCode;
    }
    StringTable.prototype.addEntry = function (text, hashCode) {
        var index = hashCode & this.mask;
        var e = new StringTableEntry(text, hashCode, this.entries[index]);
        this.entries[index] = e;
        if(this.count++ === this.mask) {
            this.grow();
        }
        return e.Text;
    };
    StringTable.prototype.grow = function () {
        var newMask = this.mask * 2 + 1;
        var oldEntries = this.entries;
        var newEntries = ArrayUtilities.createArray(newMask + 1);
        for(var i = 0; i < oldEntries.length; i++) {
            var e = oldEntries[i];
            while(e !== null) {
                var newIndex = e.HashCode & newMask;
                var tmp = e.Next;
                e.Next = newEntries[newIndex];
                newEntries[newIndex] = e;
                e = tmp;
            }
        }
        this.entries = newEntries;
        this.mask = newMask;
    };
    StringTable.textSubstringEquals = function textSubstringEquals(array, text, start, length) {
        if(array.length !== length) {
            return false;
        }
        for(var i = 0; i < array.length; i++) {
            if(array.charCodeAt(i) !== text.charCodeAt(start + i)) {
                return false;
            }
        }
        return true;
    }
    StringTable.textCharArrayEquals = function textCharArrayEquals(array, text, start, length) {
        return array.length === length && StringTable.textEqualsCore(array, text, start);
    }
    StringTable.textEqualsCore = function textEqualsCore(array, text, start) {
        var s = start;
        for(var i = 0; i < array.length; i++) {
            if(array.charCodeAt(i) !== text[s]) {
                return false;
            }
            s++;
        }
        return true;
    }
    return StringTable;
})();
var StringText = (function (_super) {
    __extends(StringText, _super);
    function StringText(data) {
        _super.call(this);
        this.source = null;
        if(data === null) {
            throw Errors.argumentNull("data");
        }
        this.source = data;
    }
    StringText.prototype.length = function () {
        return this.source.length;
    };
    StringText.prototype.getCharCodeAt = function (position) {
        if(position < 0 || position >= this.source.length) {
            throw Errors.argumentOutOfRange("position");
        }
        return this.source.charCodeAt(position);
    };
    StringText.prototype.toString = function (span) {
        if (typeof span === "undefined") { span = null; }
        if(span === null) {
            span = new TextSpan(0, this.length());
        }
        this.checkSubSpan(span);
        if(span.start() == 0 && span.length() == this.length()) {
            return this.source;
        }
        return this.source.substr(span.start(), span.length());
    };
    StringText.prototype.copyTo = function (sourceIndex, destination, destinationIndex, count) {
        for(var i = 0; i < count; i++) {
            destination[destinationIndex + i] = this.source.charCodeAt(sourceIndex + i);
        }
    };
    return StringText;
})(TextBase);
var StringUtilities = (function () {
    function StringUtilities() { }
    StringUtilities.fromCharCodeArray = function fromCharCodeArray(array) {
        return String.fromCharCode.apply(null, array);
    }
    StringUtilities.endsWith = function endsWith(string, value) {
        return string.substring(string.length - value.length, string.length) === value;
    }
    return StringUtilities;
})();
var SyntaxDiagnosticInfo = (function (_super) {
    __extends(SyntaxDiagnosticInfo, _super);
    function SyntaxDiagnosticInfo(offset, width, code) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 3); _i++) {
            args[_i] = arguments[_i + 3];
        }
        _super.call(this, code, args);
        this._offset = 0;
        this._width = 0;
        if(width < 0) {
            throw Errors.argumentOutOfRange("width");
        }
        this._offset = offset;
        this._width = width;
    }
    SyntaxDiagnosticInfo.create = function create(code) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        return new SyntaxDiagnosticInfo(0, 0, code, args);
    }
    return SyntaxDiagnosticInfo;
})(DiagnosticInfo);
var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind._map = [];
    SyntaxKind._map[0] = "None";
    SyntaxKind.None = 0;
    SyntaxKind._map[1] = "WhitespaceTrivia";
    SyntaxKind.WhitespaceTrivia = 1;
    SyntaxKind._map[2] = "NewLineTrivia";
    SyntaxKind.NewLineTrivia = 2;
    SyntaxKind._map[3] = "MultiLineCommentTrivia";
    SyntaxKind.MultiLineCommentTrivia = 3;
    SyntaxKind._map[4] = "SingleLineCommentTrivia";
    SyntaxKind.SingleLineCommentTrivia = 4;
    SyntaxKind._map[5] = "IdentifierNameToken";
    SyntaxKind.IdentifierNameToken = 5;
    SyntaxKind._map[6] = "RegularExpressionLiteral";
    SyntaxKind.RegularExpressionLiteral = 6;
    SyntaxKind._map[7] = "NumericLiteral";
    SyntaxKind.NumericLiteral = 7;
    SyntaxKind._map[8] = "StringLiteral";
    SyntaxKind.StringLiteral = 8;
    SyntaxKind._map[9] = "BreakKeyword";
    SyntaxKind.BreakKeyword = 9;
    SyntaxKind._map[10] = "CaseKeyword";
    SyntaxKind.CaseKeyword = 10;
    SyntaxKind._map[11] = "CatchKeyword";
    SyntaxKind.CatchKeyword = 11;
    SyntaxKind._map[12] = "ContinueKeyword";
    SyntaxKind.ContinueKeyword = 12;
    SyntaxKind._map[13] = "DebuggerKeyword";
    SyntaxKind.DebuggerKeyword = 13;
    SyntaxKind._map[14] = "DefaultKeyword";
    SyntaxKind.DefaultKeyword = 14;
    SyntaxKind._map[15] = "DeleteKeyword";
    SyntaxKind.DeleteKeyword = 15;
    SyntaxKind._map[16] = "DoKeyword";
    SyntaxKind.DoKeyword = 16;
    SyntaxKind._map[17] = "ElseKeyword";
    SyntaxKind.ElseKeyword = 17;
    SyntaxKind._map[18] = "FalseKeyword";
    SyntaxKind.FalseKeyword = 18;
    SyntaxKind._map[19] = "FinallyKeyword";
    SyntaxKind.FinallyKeyword = 19;
    SyntaxKind._map[20] = "ForKeyword";
    SyntaxKind.ForKeyword = 20;
    SyntaxKind._map[21] = "FunctionKeyword";
    SyntaxKind.FunctionKeyword = 21;
    SyntaxKind._map[22] = "IfKeyword";
    SyntaxKind.IfKeyword = 22;
    SyntaxKind._map[23] = "InKeyword";
    SyntaxKind.InKeyword = 23;
    SyntaxKind._map[24] = "InstanceOfKeyword";
    SyntaxKind.InstanceOfKeyword = 24;
    SyntaxKind._map[25] = "NewKeyword";
    SyntaxKind.NewKeyword = 25;
    SyntaxKind._map[26] = "NullKeyword";
    SyntaxKind.NullKeyword = 26;
    SyntaxKind._map[27] = "ReturnKeyword";
    SyntaxKind.ReturnKeyword = 27;
    SyntaxKind._map[28] = "SwitchKeyword";
    SyntaxKind.SwitchKeyword = 28;
    SyntaxKind._map[29] = "ThisKeyword";
    SyntaxKind.ThisKeyword = 29;
    SyntaxKind._map[30] = "ThrowKeyword";
    SyntaxKind.ThrowKeyword = 30;
    SyntaxKind._map[31] = "TrueKeyword";
    SyntaxKind.TrueKeyword = 31;
    SyntaxKind._map[32] = "TryKeyword";
    SyntaxKind.TryKeyword = 32;
    SyntaxKind._map[33] = "TypeOfKeyword";
    SyntaxKind.TypeOfKeyword = 33;
    SyntaxKind._map[34] = "VarKeyword";
    SyntaxKind.VarKeyword = 34;
    SyntaxKind._map[35] = "VoidKeyword";
    SyntaxKind.VoidKeyword = 35;
    SyntaxKind._map[36] = "WhileKeyword";
    SyntaxKind.WhileKeyword = 36;
    SyntaxKind._map[37] = "WithKeyword";
    SyntaxKind.WithKeyword = 37;
    SyntaxKind._map[38] = "ClassKeyword";
    SyntaxKind.ClassKeyword = 38;
    SyntaxKind._map[39] = "ConstKeyword";
    SyntaxKind.ConstKeyword = 39;
    SyntaxKind._map[40] = "EnumKeyword";
    SyntaxKind.EnumKeyword = 40;
    SyntaxKind._map[41] = "ExportKeyword";
    SyntaxKind.ExportKeyword = 41;
    SyntaxKind._map[42] = "ExtendsKeyword";
    SyntaxKind.ExtendsKeyword = 42;
    SyntaxKind._map[43] = "ImportKeyword";
    SyntaxKind.ImportKeyword = 43;
    SyntaxKind._map[44] = "SuperKeyword";
    SyntaxKind.SuperKeyword = 44;
    SyntaxKind._map[45] = "ImplementsKeyword";
    SyntaxKind.ImplementsKeyword = 45;
    SyntaxKind._map[46] = "InterfaceKeyword";
    SyntaxKind.InterfaceKeyword = 46;
    SyntaxKind._map[47] = "LetKeyword";
    SyntaxKind.LetKeyword = 47;
    SyntaxKind._map[48] = "PackageKeyword";
    SyntaxKind.PackageKeyword = 48;
    SyntaxKind._map[49] = "PrivateKeyword";
    SyntaxKind.PrivateKeyword = 49;
    SyntaxKind._map[50] = "ProtectedKeyword";
    SyntaxKind.ProtectedKeyword = 50;
    SyntaxKind._map[51] = "PublicKeyword";
    SyntaxKind.PublicKeyword = 51;
    SyntaxKind._map[52] = "StaticKeyword";
    SyntaxKind.StaticKeyword = 52;
    SyntaxKind._map[53] = "YieldKeyword";
    SyntaxKind.YieldKeyword = 53;
    SyntaxKind._map[54] = "AnyKeyword";
    SyntaxKind.AnyKeyword = 54;
    SyntaxKind._map[55] = "BoolKeyword";
    SyntaxKind.BoolKeyword = 55;
    SyntaxKind._map[56] = "NumberKeyword";
    SyntaxKind.NumberKeyword = 56;
    SyntaxKind._map[57] = "StringKeyword";
    SyntaxKind.StringKeyword = 57;
    SyntaxKind._map[58] = "ConstructorKeyword";
    SyntaxKind.ConstructorKeyword = 58;
    SyntaxKind._map[59] = "ModuleKeyword";
    SyntaxKind.ModuleKeyword = 59;
    SyntaxKind._map[60] = "GetKeyword";
    SyntaxKind.GetKeyword = 60;
    SyntaxKind._map[61] = "SetKeyword";
    SyntaxKind.SetKeyword = 61;
    SyntaxKind._map[62] = "OpenBraceToken";
    SyntaxKind.OpenBraceToken = 62;
    SyntaxKind._map[63] = "CloseBraceToken";
    SyntaxKind.CloseBraceToken = 63;
    SyntaxKind._map[64] = "OpenParenToken";
    SyntaxKind.OpenParenToken = 64;
    SyntaxKind._map[65] = "CloseParenToken";
    SyntaxKind.CloseParenToken = 65;
    SyntaxKind._map[66] = "OpenBracketToken";
    SyntaxKind.OpenBracketToken = 66;
    SyntaxKind._map[67] = "CloseBracketToken";
    SyntaxKind.CloseBracketToken = 67;
    SyntaxKind._map[68] = "DotToken";
    SyntaxKind.DotToken = 68;
    SyntaxKind._map[69] = "DotDotDotToken";
    SyntaxKind.DotDotDotToken = 69;
    SyntaxKind._map[70] = "SemicolonToken";
    SyntaxKind.SemicolonToken = 70;
    SyntaxKind._map[71] = "CommaToken";
    SyntaxKind.CommaToken = 71;
    SyntaxKind._map[72] = "LessThanToken";
    SyntaxKind.LessThanToken = 72;
    SyntaxKind._map[73] = "GreaterThanToken";
    SyntaxKind.GreaterThanToken = 73;
    SyntaxKind._map[74] = "LessThanEqualsToken";
    SyntaxKind.LessThanEqualsToken = 74;
    SyntaxKind._map[75] = "GreaterThanEqualsToken";
    SyntaxKind.GreaterThanEqualsToken = 75;
    SyntaxKind._map[76] = "EqualsEqualsToken";
    SyntaxKind.EqualsEqualsToken = 76;
    SyntaxKind._map[77] = "EqualsGreaterThanToken";
    SyntaxKind.EqualsGreaterThanToken = 77;
    SyntaxKind._map[78] = "ExclamationEqualsToken";
    SyntaxKind.ExclamationEqualsToken = 78;
    SyntaxKind._map[79] = "EqualsEqualsEqualsToken";
    SyntaxKind.EqualsEqualsEqualsToken = 79;
    SyntaxKind._map[80] = "ExclamationEqualsEqualsToken";
    SyntaxKind.ExclamationEqualsEqualsToken = 80;
    SyntaxKind._map[81] = "PlusToken";
    SyntaxKind.PlusToken = 81;
    SyntaxKind._map[82] = "MinusToken";
    SyntaxKind.MinusToken = 82;
    SyntaxKind._map[83] = "AsteriskToken";
    SyntaxKind.AsteriskToken = 83;
    SyntaxKind._map[84] = "PercentToken";
    SyntaxKind.PercentToken = 84;
    SyntaxKind._map[85] = "PlusPlusToken";
    SyntaxKind.PlusPlusToken = 85;
    SyntaxKind._map[86] = "MinusMinusToken";
    SyntaxKind.MinusMinusToken = 86;
    SyntaxKind._map[87] = "LessThanLessThanToken";
    SyntaxKind.LessThanLessThanToken = 87;
    SyntaxKind._map[88] = "GreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanToken = 88;
    SyntaxKind._map[89] = "GreaterThanGreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 89;
    SyntaxKind._map[90] = "AmpersandToken";
    SyntaxKind.AmpersandToken = 90;
    SyntaxKind._map[91] = "BarToken";
    SyntaxKind.BarToken = 91;
    SyntaxKind._map[92] = "CaretToken";
    SyntaxKind.CaretToken = 92;
    SyntaxKind._map[93] = "ExclamationToken";
    SyntaxKind.ExclamationToken = 93;
    SyntaxKind._map[94] = "TildeToken";
    SyntaxKind.TildeToken = 94;
    SyntaxKind._map[95] = "AmpersandAmpersandToken";
    SyntaxKind.AmpersandAmpersandToken = 95;
    SyntaxKind._map[96] = "BarBarToken";
    SyntaxKind.BarBarToken = 96;
    SyntaxKind._map[97] = "QuestionToken";
    SyntaxKind.QuestionToken = 97;
    SyntaxKind._map[98] = "ColonToken";
    SyntaxKind.ColonToken = 98;
    SyntaxKind._map[99] = "EqualsToken";
    SyntaxKind.EqualsToken = 99;
    SyntaxKind._map[100] = "PlusEqualsToken";
    SyntaxKind.PlusEqualsToken = 100;
    SyntaxKind._map[101] = "MinusEqualsToken";
    SyntaxKind.MinusEqualsToken = 101;
    SyntaxKind._map[102] = "AsteriskEqualsToken";
    SyntaxKind.AsteriskEqualsToken = 102;
    SyntaxKind._map[103] = "PercentEqualsToken";
    SyntaxKind.PercentEqualsToken = 103;
    SyntaxKind._map[104] = "LessThanLessThanEqualsToken";
    SyntaxKind.LessThanLessThanEqualsToken = 104;
    SyntaxKind._map[105] = "GreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanEqualsToken = 105;
    SyntaxKind._map[106] = "GreaterThanGreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 106;
    SyntaxKind._map[107] = "AmpersandEqualsToken";
    SyntaxKind.AmpersandEqualsToken = 107;
    SyntaxKind._map[108] = "BarEqualsToken";
    SyntaxKind.BarEqualsToken = 108;
    SyntaxKind._map[109] = "CaretEqualsToken";
    SyntaxKind.CaretEqualsToken = 109;
    SyntaxKind._map[110] = "SlashToken";
    SyntaxKind.SlashToken = 110;
    SyntaxKind._map[111] = "SlashEqualsToken";
    SyntaxKind.SlashEqualsToken = 111;
    SyntaxKind._map[112] = "ErrorToken";
    SyntaxKind.ErrorToken = 112;
    SyntaxKind._map[113] = "EndOfFileToken";
    SyntaxKind.EndOfFileToken = 113;
    SyntaxKind._map[114] = "SourceUnit";
    SyntaxKind.SourceUnit = 114;
    SyntaxKind._map[115] = "IdentifierName";
    SyntaxKind.IdentifierName = 115;
    SyntaxKind._map[116] = "QualifiedName";
    SyntaxKind.QualifiedName = 116;
    SyntaxKind._map[117] = "ObjectType";
    SyntaxKind.ObjectType = 117;
    SyntaxKind._map[118] = "PredefinedType";
    SyntaxKind.PredefinedType = 118;
    SyntaxKind._map[119] = "FunctionType";
    SyntaxKind.FunctionType = 119;
    SyntaxKind._map[120] = "ArrayType";
    SyntaxKind.ArrayType = 120;
    SyntaxKind._map[121] = "InterfaceDeclaration";
    SyntaxKind.InterfaceDeclaration = 121;
    SyntaxKind._map[122] = "FunctionDeclaration";
    SyntaxKind.FunctionDeclaration = 122;
    SyntaxKind._map[123] = "ModuleDeclaration";
    SyntaxKind.ModuleDeclaration = 123;
    SyntaxKind._map[124] = "ClassDeclaration";
    SyntaxKind.ClassDeclaration = 124;
    SyntaxKind._map[125] = "EnumDeclaration";
    SyntaxKind.EnumDeclaration = 125;
    SyntaxKind._map[126] = "MemberFunctionDeclaration";
    SyntaxKind.MemberFunctionDeclaration = 126;
    SyntaxKind._map[127] = "ConstructorDeclaration";
    SyntaxKind.ConstructorDeclaration = 127;
    SyntaxKind._map[128] = "Block";
    SyntaxKind.Block = 128;
    SyntaxKind._map[129] = "IfStatement";
    SyntaxKind.IfStatement = 129;
    SyntaxKind._map[130] = "VariableStatement";
    SyntaxKind.VariableStatement = 130;
    SyntaxKind._map[131] = "ExpressionStatement";
    SyntaxKind.ExpressionStatement = 131;
    SyntaxKind._map[132] = "ReturnStatement";
    SyntaxKind.ReturnStatement = 132;
    SyntaxKind._map[133] = "SwitchStatement";
    SyntaxKind.SwitchStatement = 133;
    SyntaxKind._map[134] = "BreakStatement";
    SyntaxKind.BreakStatement = 134;
    SyntaxKind._map[135] = "ForStatement";
    SyntaxKind.ForStatement = 135;
    SyntaxKind._map[136] = "ForInStatement";
    SyntaxKind.ForInStatement = 136;
    SyntaxKind._map[137] = "PlusExpression";
    SyntaxKind.PlusExpression = 137;
    SyntaxKind._map[138] = "NegateExpression";
    SyntaxKind.NegateExpression = 138;
    SyntaxKind._map[139] = "BitwiseNotExpression";
    SyntaxKind.BitwiseNotExpression = 139;
    SyntaxKind._map[140] = "LogicalNotExpression";
    SyntaxKind.LogicalNotExpression = 140;
    SyntaxKind._map[141] = "PreIncrementExpression";
    SyntaxKind.PreIncrementExpression = 141;
    SyntaxKind._map[142] = "PreDecrementExpression";
    SyntaxKind.PreDecrementExpression = 142;
    SyntaxKind._map[143] = "DeleteExpression";
    SyntaxKind.DeleteExpression = 143;
    SyntaxKind._map[144] = "TypeOfExpression";
    SyntaxKind.TypeOfExpression = 144;
    SyntaxKind._map[145] = "VoidExpression";
    SyntaxKind.VoidExpression = 145;
    SyntaxKind._map[146] = "BooleanLiteralExpression";
    SyntaxKind.BooleanLiteralExpression = 146;
    SyntaxKind._map[147] = "NullLiteralExpression";
    SyntaxKind.NullLiteralExpression = 147;
    SyntaxKind._map[148] = "NumericLiteralExpression";
    SyntaxKind.NumericLiteralExpression = 148;
    SyntaxKind._map[149] = "RegularExpressionLiteralExpression";
    SyntaxKind.RegularExpressionLiteralExpression = 149;
    SyntaxKind._map[150] = "StringLiteralExpression";
    SyntaxKind.StringLiteralExpression = 150;
    SyntaxKind._map[151] = "CommaExpression";
    SyntaxKind.CommaExpression = 151;
    SyntaxKind._map[152] = "AssignmentExpression";
    SyntaxKind.AssignmentExpression = 152;
    SyntaxKind._map[153] = "AddAssignmentExpression";
    SyntaxKind.AddAssignmentExpression = 153;
    SyntaxKind._map[154] = "SubtractAssignmentExpression";
    SyntaxKind.SubtractAssignmentExpression = 154;
    SyntaxKind._map[155] = "MultiplyAssignmentExpression";
    SyntaxKind.MultiplyAssignmentExpression = 155;
    SyntaxKind._map[156] = "DivideAssignmentExpression";
    SyntaxKind.DivideAssignmentExpression = 156;
    SyntaxKind._map[157] = "ModuloAssignmentExpression";
    SyntaxKind.ModuloAssignmentExpression = 157;
    SyntaxKind._map[158] = "AndAssignmentExpression";
    SyntaxKind.AndAssignmentExpression = 158;
    SyntaxKind._map[159] = "ExclusiveOrAssignmentExpression";
    SyntaxKind.ExclusiveOrAssignmentExpression = 159;
    SyntaxKind._map[160] = "OrAssignmentExpression";
    SyntaxKind.OrAssignmentExpression = 160;
    SyntaxKind._map[161] = "LeftShiftAssignmentExpression";
    SyntaxKind.LeftShiftAssignmentExpression = 161;
    SyntaxKind._map[162] = "SignedRightShiftAssignmentExpression";
    SyntaxKind.SignedRightShiftAssignmentExpression = 162;
    SyntaxKind._map[163] = "UnsignedRightShiftAssignmentExpression";
    SyntaxKind.UnsignedRightShiftAssignmentExpression = 163;
    SyntaxKind._map[164] = "ConditionalExpression";
    SyntaxKind.ConditionalExpression = 164;
    SyntaxKind._map[165] = "LogicalOrExpression";
    SyntaxKind.LogicalOrExpression = 165;
    SyntaxKind._map[166] = "LogicalAndExpression";
    SyntaxKind.LogicalAndExpression = 166;
    SyntaxKind._map[167] = "BitwiseOrExpression";
    SyntaxKind.BitwiseOrExpression = 167;
    SyntaxKind._map[168] = "BitwiseExclusiveOrExpression";
    SyntaxKind.BitwiseExclusiveOrExpression = 168;
    SyntaxKind._map[169] = "BitwiseAndExpression";
    SyntaxKind.BitwiseAndExpression = 169;
    SyntaxKind._map[170] = "EqualsWithTypeConversionExpression";
    SyntaxKind.EqualsWithTypeConversionExpression = 170;
    SyntaxKind._map[171] = "NotEqualsWithTypeConversionExpression";
    SyntaxKind.NotEqualsWithTypeConversionExpression = 171;
    SyntaxKind._map[172] = "EqualsExpression";
    SyntaxKind.EqualsExpression = 172;
    SyntaxKind._map[173] = "NotEqualsExpression";
    SyntaxKind.NotEqualsExpression = 173;
    SyntaxKind._map[174] = "LessThanExpression";
    SyntaxKind.LessThanExpression = 174;
    SyntaxKind._map[175] = "GreaterThanExpression";
    SyntaxKind.GreaterThanExpression = 175;
    SyntaxKind._map[176] = "LessThanOrEqualExpression";
    SyntaxKind.LessThanOrEqualExpression = 176;
    SyntaxKind._map[177] = "GreaterThanOrEqualExpression";
    SyntaxKind.GreaterThanOrEqualExpression = 177;
    SyntaxKind._map[178] = "InstanceOfExpression";
    SyntaxKind.InstanceOfExpression = 178;
    SyntaxKind._map[179] = "InExpression";
    SyntaxKind.InExpression = 179;
    SyntaxKind._map[180] = "LeftShiftExpression";
    SyntaxKind.LeftShiftExpression = 180;
    SyntaxKind._map[181] = "SignedRightShiftExpression";
    SyntaxKind.SignedRightShiftExpression = 181;
    SyntaxKind._map[182] = "UnsignedRightShiftExpression";
    SyntaxKind.UnsignedRightShiftExpression = 182;
    SyntaxKind._map[183] = "MultiplyExpression";
    SyntaxKind.MultiplyExpression = 183;
    SyntaxKind._map[184] = "DivideExpression";
    SyntaxKind.DivideExpression = 184;
    SyntaxKind._map[185] = "ModuloExpression";
    SyntaxKind.ModuloExpression = 185;
    SyntaxKind._map[186] = "AddExpression";
    SyntaxKind.AddExpression = 186;
    SyntaxKind._map[187] = "SubtractExpression";
    SyntaxKind.SubtractExpression = 187;
    SyntaxKind._map[188] = "PostIncrementExpression";
    SyntaxKind.PostIncrementExpression = 188;
    SyntaxKind._map[189] = "PostDecrementExpression";
    SyntaxKind.PostDecrementExpression = 189;
    SyntaxKind._map[190] = "MemberAccessExpression";
    SyntaxKind.MemberAccessExpression = 190;
    SyntaxKind._map[191] = "InvocationExpression";
    SyntaxKind.InvocationExpression = 191;
    SyntaxKind._map[192] = "ThisExpression";
    SyntaxKind.ThisExpression = 192;
    SyntaxKind._map[193] = "ArrayLiteralExpression";
    SyntaxKind.ArrayLiteralExpression = 193;
    SyntaxKind._map[194] = "ObjectLiteralExpression";
    SyntaxKind.ObjectLiteralExpression = 194;
    SyntaxKind._map[195] = "ObjectCreationExpression";
    SyntaxKind.ObjectCreationExpression = 195;
    SyntaxKind._map[196] = "ParenthesizedExpression";
    SyntaxKind.ParenthesizedExpression = 196;
    SyntaxKind._map[197] = "ParenthesizedArrowFunctionExpression";
    SyntaxKind.ParenthesizedArrowFunctionExpression = 197;
    SyntaxKind._map[198] = "CastExpression";
    SyntaxKind.CastExpression = 198;
    SyntaxKind._map[199] = "ElementAccessExpression";
    SyntaxKind.ElementAccessExpression = 199;
    SyntaxKind._map[200] = "VariableDeclaration";
    SyntaxKind.VariableDeclaration = 200;
    SyntaxKind._map[201] = "VariableDeclarator";
    SyntaxKind.VariableDeclarator = 201;
    SyntaxKind._map[202] = "ParameterList";
    SyntaxKind.ParameterList = 202;
    SyntaxKind._map[203] = "ArgumentList";
    SyntaxKind.ArgumentList = 203;
    SyntaxKind._map[204] = "ImplementsClause";
    SyntaxKind.ImplementsClause = 204;
    SyntaxKind._map[205] = "EqualsValueClause";
    SyntaxKind.EqualsValueClause = 205;
    SyntaxKind._map[206] = "CaseSwitchClause";
    SyntaxKind.CaseSwitchClause = 206;
    SyntaxKind._map[207] = "DefaultSwitchClause";
    SyntaxKind.DefaultSwitchClause = 207;
    SyntaxKind._map[208] = "ElseClause";
    SyntaxKind.ElseClause = 208;
    SyntaxKind._map[209] = "Parameter";
    SyntaxKind.Parameter = 209;
    SyntaxKind._map[210] = "FunctionSignature";
    SyntaxKind.FunctionSignature = 210;
    SyntaxKind._map[211] = "CallSignature";
    SyntaxKind.CallSignature = 211;
    SyntaxKind._map[212] = "TypeAnnotation";
    SyntaxKind.TypeAnnotation = 212;
    SyntaxKind._map[213] = "SimplePropertyAssignment";
    SyntaxKind.SimplePropertyAssignment = 213;
    SyntaxKind.FirstStandardKeyword = SyntaxKind.BreakKeyword;
    SyntaxKind.LastStandardKeyword = SyntaxKind.WithKeyword;
    SyntaxKind.FirstFutureReservedKeyword = SyntaxKind.ClassKeyword;
    SyntaxKind.LastFutureReservedKeyword = SyntaxKind.SuperKeyword;
    SyntaxKind.FirstFutureReservedStrictKeyword = SyntaxKind.ImplementsKeyword;
    SyntaxKind.LastFutureReservedStrictKeyword = SyntaxKind.YieldKeyword;
    SyntaxKind.FirstKeyword = SyntaxKind.FirstStandardKeyword;
    SyntaxKind.LastKeyword = SyntaxKind.LastFutureReservedStrictKeyword;
    SyntaxKind.FirstToken = SyntaxKind.IdentifierNameToken;
    SyntaxKind.LastToken = SyntaxKind.EndOfFileToken;
    SyntaxKind.FirstPunctuation = SyntaxKind.OpenBraceToken;
    SyntaxKind.LastPunctuation = SyntaxKind.SlashEqualsToken;
})(SyntaxKind || (SyntaxKind = {}));
var SyntaxFacts = (function () {
    function SyntaxFacts() { }
    SyntaxFacts.textToKeywordKind = {
        "break": SyntaxKind.BreakKeyword,
        "case": SyntaxKind.CaseKeyword,
        "catch": SyntaxKind.CatchKeyword,
        "class": SyntaxKind.ClassKeyword,
        "continue": SyntaxKind.ContinueKeyword,
        "const": SyntaxKind.ConstKeyword,
        "constructor": SyntaxKind.ConstructorKeyword,
        "debugger": SyntaxKind.DebuggerKeyword,
        "default": SyntaxKind.DefaultKeyword,
        "delete": SyntaxKind.DeleteKeyword,
        "do": SyntaxKind.DoKeyword,
        "else": SyntaxKind.ElseKeyword,
        "enum": SyntaxKind.EnumKeyword,
        "export": SyntaxKind.ExportKeyword,
        "extends": SyntaxKind.ExtendsKeyword,
        "false": SyntaxKind.FalseKeyword,
        "finally": SyntaxKind.FinallyKeyword,
        "for": SyntaxKind.ForKeyword,
        "function": SyntaxKind.FunctionKeyword,
        "get": SyntaxKind.GetKeyword,
        "if": SyntaxKind.IfKeyword,
        "implements": SyntaxKind.ImplementsKeyword,
        "import": SyntaxKind.ImportKeyword,
        "in": SyntaxKind.InKeyword,
        "instanceof": SyntaxKind.InstanceOfKeyword,
        "interface": SyntaxKind.InterfaceKeyword,
        "let": SyntaxKind.LetKeyword,
        "module": SyntaxKind.ModuleKeyword,
        "new": SyntaxKind.NewKeyword,
        "null": SyntaxKind.NullKeyword,
        "package": SyntaxKind.PackageKeyword,
        "private": SyntaxKind.PrivateKeyword,
        "protected": SyntaxKind.ProtectedKeyword,
        "public": SyntaxKind.PublicKeyword,
        "return": SyntaxKind.ReturnKeyword,
        "set": SyntaxKind.SetKeyword,
        "static": SyntaxKind.StaticKeyword,
        "super": SyntaxKind.SuperKeyword,
        "switch": SyntaxKind.SwitchKeyword,
        "this": SyntaxKind.ThisKeyword,
        "throw": SyntaxKind.ThrowKeyword,
        "true": SyntaxKind.TrueKeyword,
        "try": SyntaxKind.TryKeyword,
        "typeof": SyntaxKind.TypeOfKeyword,
        "var": SyntaxKind.VarKeyword,
        "void": SyntaxKind.VoidKeyword,
        "while": SyntaxKind.WhileKeyword,
        "with": SyntaxKind.WithKeyword,
        "yield": SyntaxKind.YieldKeyword,
        "{": SyntaxKind.OpenBraceToken,
        "}": SyntaxKind.CloseBraceToken,
        "(": SyntaxKind.OpenParenToken,
        ")": SyntaxKind.CloseParenToken,
        "[": SyntaxKind.OpenBracketToken,
        "]": SyntaxKind.CloseBracketToken,
        ".": SyntaxKind.DotToken,
        "...": SyntaxKind.DotDotDotToken,
        ";": SyntaxKind.SemicolonToken,
        ",": SyntaxKind.CommaToken,
        "<": SyntaxKind.LessThanToken,
        ">": SyntaxKind.GreaterThanToken,
        "<=": SyntaxKind.LessThanEqualsToken,
        ">=": SyntaxKind.GreaterThanEqualsToken,
        "==": SyntaxKind.EqualsEqualsToken,
        "=>": SyntaxKind.EqualsGreaterThanToken,
        "!=": SyntaxKind.ExclamationEqualsToken,
        "===": SyntaxKind.EqualsEqualsEqualsToken,
        "!==": SyntaxKind.ExclamationEqualsEqualsToken,
        "+": SyntaxKind.PlusToken,
        "-": SyntaxKind.MinusToken,
        "*": SyntaxKind.AsteriskToken,
        "%": SyntaxKind.PercentToken,
        "++": SyntaxKind.PlusPlusToken,
        "--": SyntaxKind.MinusMinusToken,
        "<<": SyntaxKind.LessThanLessThanToken,
        ">>": SyntaxKind.GreaterThanGreaterThanToken,
        ">>>": SyntaxKind.GreaterThanGreaterThanGreaterThanToken,
        "&": SyntaxKind.AmpersandToken,
        "|": SyntaxKind.BarToken,
        "^": SyntaxKind.CaretToken,
        "!": SyntaxKind.ExclamationToken,
        "~": SyntaxKind.TildeToken,
        "&&": SyntaxKind.AmpersandAmpersandToken,
        "||": SyntaxKind.BarBarToken,
        "?": SyntaxKind.QuestionToken,
        ":": SyntaxKind.ColonToken,
        "=": SyntaxKind.EqualsToken,
        "+=": SyntaxKind.PlusEqualsToken,
        "-=": SyntaxKind.MinusEqualsToken,
        "*=": SyntaxKind.AsteriskEqualsToken,
        "%=": SyntaxKind.PercentEqualsToken,
        "<<=": SyntaxKind.LessThanLessThanEqualsToken,
        ">>=": SyntaxKind.GreaterThanGreaterThanEqualsToken,
        ">>>=": SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
        "&=": SyntaxKind.AmpersandEqualsToken,
        "|=": SyntaxKind.BarEqualsToken,
        "^=": SyntaxKind.CaretEqualsToken,
        "/": SyntaxKind.SlashToken,
        "/=": SyntaxKind.SlashEqualsToken
    };
    SyntaxFacts.kindToText = [];
    SyntaxFacts.initializeStaticData = function initializeStaticData() {
        if(SyntaxFacts.kindToText.length == 0) {
            for(var name in SyntaxFacts.textToKeywordKind) {
                if(SyntaxFacts.textToKeywordKind.hasOwnProperty(name)) {
                    Debug.assert(SyntaxFacts.kindToText[SyntaxFacts.textToKeywordKind[name]] === undefined);
                    SyntaxFacts.kindToText[SyntaxFacts.textToKeywordKind[name]] = name;
                }
            }
        }
    }
    SyntaxFacts.getTokenKind = function getTokenKind(text) {
        if(SyntaxFacts.textToKeywordKind.hasOwnProperty(text)) {
            return SyntaxFacts.textToKeywordKind[text];
        }
        return SyntaxKind.None;
    }
    SyntaxFacts.getText = function getText(kind) {
        SyntaxFacts.initializeStaticData();
        var result = SyntaxFacts.kindToText[kind];
        return result !== undefined ? result : null;
    }
    SyntaxFacts.isTokenKind = function isTokenKind(kind) {
        return kind >= SyntaxKind.FirstToken && kind <= SyntaxKind.LastToken;
    }
    SyntaxFacts.isAnyKeyword = function isAnyKeyword(kind) {
        return kind >= SyntaxKind.FirstKeyword && kind <= SyntaxKind.LastKeyword;
    }
    SyntaxFacts.isStandardKeyword = function isStandardKeyword(kind) {
        return kind >= SyntaxKind.FirstStandardKeyword && kind <= SyntaxKind.LastStandardKeyword;
    }
    SyntaxFacts.isFutureReservedKeyword = function isFutureReservedKeyword(kind) {
        return kind >= SyntaxKind.FirstFutureReservedKeyword && kind <= SyntaxKind.LastFutureReservedKeyword;
    }
    SyntaxFacts.isFutureReservedStrictKeyword = function isFutureReservedStrictKeyword(kind) {
        return kind >= SyntaxKind.FirstFutureReservedStrictKeyword && kind <= SyntaxKind.LastFutureReservedStrictKeyword;
    }
    SyntaxFacts.isAnyPunctuation = function isAnyPunctuation(kind) {
        return kind >= SyntaxKind.FirstPunctuation && kind <= SyntaxKind.LastPunctuation;
    }
    SyntaxFacts.isPrefixUnaryExpressionOperatorToken = function isPrefixUnaryExpressionOperatorToken(tokenKind) {
        return SyntaxFacts.getPrefixUnaryExpression(tokenKind) != SyntaxKind.None;
    }
    SyntaxFacts.getPrefixUnaryExpression = function getPrefixUnaryExpression(tokenKind) {
        switch(tokenKind) {
            case SyntaxKind.PlusToken: {
                return SyntaxKind.PlusExpression;

            }
            case SyntaxKind.MinusToken: {
                return SyntaxKind.NegateExpression;

            }
            case SyntaxKind.TildeToken: {
                return SyntaxKind.BitwiseNotExpression;

            }
            case SyntaxKind.ExclamationToken: {
                return SyntaxKind.LogicalNotExpression;

            }
            case SyntaxKind.PlusPlusToken: {
                return SyntaxKind.PreIncrementExpression;

            }
            case SyntaxKind.MinusMinusToken: {
                return SyntaxKind.PreDecrementExpression;

            }
            case SyntaxKind.DeleteKeyword: {
                return SyntaxKind.DeleteExpression;

            }
            case SyntaxKind.TypeOfKeyword: {
                return SyntaxKind.TypeOfExpression;

            }
            case SyntaxKind.VoidKeyword: {
                return SyntaxKind.VoidExpression;

            }
            default: {
                return SyntaxKind.None;

            }
        }
    }
    SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case SyntaxKind.PlusPlusToken: {
                return SyntaxKind.PostIncrementExpression;

            }
            case SyntaxKind.MinusMinusToken: {
                return SyntaxKind.PostDecrementExpression;

            }
            default: {
                return SyntaxKind.None;

            }
        }
    }
    SyntaxFacts.isBinaryExpressionOperatorToken = function isBinaryExpressionOperatorToken(tokenKind) {
        return SyntaxFacts.getBinaryExpressionFromOperatorToken(tokenKind) !== SyntaxKind.None;
    }
    SyntaxFacts.getBinaryExpressionFromOperatorToken = function getBinaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case SyntaxKind.AsteriskToken: {
                return SyntaxKind.MultiplyExpression;

            }
            case SyntaxKind.SlashToken: {
                return SyntaxKind.DivideExpression;

            }
            case SyntaxKind.PercentToken: {
                return SyntaxKind.ModuloExpression;

            }
            case SyntaxKind.PlusToken: {
                return SyntaxKind.AddExpression;

            }
            case SyntaxKind.MinusToken: {
                return SyntaxKind.SubtractExpression;

            }
            case SyntaxKind.LessThanLessThanToken: {
                return SyntaxKind.LeftShiftExpression;

            }
            case SyntaxKind.GreaterThanGreaterThanToken: {
                return SyntaxKind.SignedRightShiftExpression;

            }
            case SyntaxKind.GreaterThanGreaterThanGreaterThanToken: {
                return SyntaxKind.UnsignedRightShiftExpression;

            }
            case SyntaxKind.LessThanToken: {
                return SyntaxKind.LessThanExpression;

            }
            case SyntaxKind.GreaterThanToken: {
                return SyntaxKind.GreaterThanExpression;

            }
            case SyntaxKind.LessThanEqualsToken: {
                return SyntaxKind.LessThanOrEqualExpression;

            }
            case SyntaxKind.GreaterThanEqualsToken: {
                return SyntaxKind.GreaterThanOrEqualExpression;

            }
            case SyntaxKind.InstanceOfKeyword: {
                return SyntaxKind.InstanceOfExpression;

            }
            case SyntaxKind.InKeyword: {
                return SyntaxKind.InExpression;

            }
            case SyntaxKind.EqualsEqualsToken: {
                return SyntaxKind.EqualsWithTypeConversionExpression;

            }
            case SyntaxKind.ExclamationEqualsToken: {
                return SyntaxKind.NotEqualsWithTypeConversionExpression;

            }
            case SyntaxKind.EqualsEqualsEqualsToken: {
                return SyntaxKind.EqualsExpression;

            }
            case SyntaxKind.ExclamationEqualsEqualsToken: {
                return SyntaxKind.NotEqualsExpression;

            }
            case SyntaxKind.AmpersandToken: {
                return SyntaxKind.BitwiseAndExpression;

            }
            case SyntaxKind.CaretToken: {
                return SyntaxKind.BitwiseExclusiveOrExpression;

            }
            case SyntaxKind.BarToken: {
                return SyntaxKind.BitwiseOrExpression;

            }
            case SyntaxKind.AmpersandAmpersandToken: {
                return SyntaxKind.LogicalAndExpression;

            }
            case SyntaxKind.BarBarToken: {
                return SyntaxKind.LogicalOrExpression;

            }
            case SyntaxKind.BarEqualsToken: {
                return SyntaxKind.OrAssignmentExpression;

            }
            case SyntaxKind.AmpersandEqualsToken: {
                return SyntaxKind.AndAssignmentExpression;

            }
            case SyntaxKind.CaretEqualsToken: {
                return SyntaxKind.ExclusiveOrAssignmentExpression;

            }
            case SyntaxKind.LessThanLessThanEqualsToken: {
                return SyntaxKind.LeftShiftAssignmentExpression;

            }
            case SyntaxKind.GreaterThanGreaterThanEqualsToken: {
                return SyntaxKind.SignedRightShiftAssignmentExpression;

            }
            case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken: {
                return SyntaxKind.UnsignedRightShiftAssignmentExpression;

            }
            case SyntaxKind.PlusEqualsToken: {
                return SyntaxKind.AddAssignmentExpression;

            }
            case SyntaxKind.MinusEqualsToken: {
                return SyntaxKind.SubtractAssignmentExpression;

            }
            case SyntaxKind.AsteriskEqualsToken: {
                return SyntaxKind.MultiplyAssignmentExpression;

            }
            case SyntaxKind.SlashEqualsToken: {
                return SyntaxKind.DivideAssignmentExpression;

            }
            case SyntaxKind.PercentEqualsToken: {
                return SyntaxKind.ModuloAssignmentExpression;

            }
            case SyntaxKind.EqualsToken: {
                return SyntaxKind.AssignmentExpression;

            }
            case SyntaxKind.CommaToken: {
                return SyntaxKind.CommaExpression;

            }
            default: {
                return SyntaxKind.None;

            }
        }
    }
    return SyntaxFacts;
})();
var SyntaxNode = (function () {
    function SyntaxNode() { }
    SyntaxNode.prototype.kind = function () {
        throw Errors.abstract();
    };
    SyntaxNode.prototype.isMissing = function () {
        return false;
    };
    SyntaxNode.prototype.toJSON = function (key) {
        var result = {
            kind: (SyntaxKind)._map[this.kind()]
        };
        for(var name in this) {
            var value = this[name];
            if(value && typeof value === 'object') {
                result[name] = value;
            }
        }
        return result;
    };
    return SyntaxNode;
})();
var SyntaxNodeList = (function () {
    function SyntaxNodeList() { }
    SyntaxNodeList.toJSON = function toJSON(list) {
        var result = [];
        for(var i = 0; i < list.count(); i++) {
            result.push(list.syntaxNodeAt(i));
        }
        return result;
    }
    SyntaxNodeList.empty = {
        toJSON: function (key) {
            return [];
        },
        count: function () {
            return 0;
        },
        syntaxNodeAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        }
    };
    SyntaxNodeList.create = function create(nodes) {
        if(nodes === null || nodes.length === 0) {
            return SyntaxNodeList.empty;
        }
        if(nodes.length === 1) {
            var item = nodes[0];
            var list;
            list = {
                toJSON: function (key) {
                    return SyntaxNodeList.toJSON(list);
                },
                count: function () {
                    return 1;
                },
                syntaxNodeAt: function (index) {
                    if(index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }
                    return item;
                }
            };
            return list;
        }
        var list;
        list = {
            toJSON: function (key) {
                return SyntaxNodeList.toJSON(list);
            },
            count: function () {
                return nodes.length;
            },
            syntaxNodeAt: function (index) {
                if(index < 0 || index >= nodes.length) {
                    throw Errors.argumentOutOfRange("index");
                }
                return nodes[index];
            }
        };
        return list;
    }
    return SyntaxNodeList;
})();
var SourceUnitSyntax = (function (_super) {
    __extends(SourceUnitSyntax, _super);
    function SourceUnitSyntax(moduleElements, endOfFileToken) {
        _super.call(this);
        if(moduleElements === null) {
            throw Errors.argumentNull("moduleElements");
        }
        if(endOfFileToken.kind() !== SyntaxKind.EndOfFileToken) {
            throw Errors.argument("endOfFileToken");
        }
        this._moduleElements = moduleElements;
        this._endOfFileToken = endOfFileToken;
    }
    SourceUnitSyntax.prototype.kind = function () {
        return SyntaxKind.SourceUnit;
    };
    SourceUnitSyntax.prototype.moduleElements = function () {
        return this._moduleElements;
    };
    SourceUnitSyntax.prototype.endOfFileToken = function () {
        return this._endOfFileToken;
    };
    return SourceUnitSyntax;
})(SyntaxNode);
var ModuleElementSyntax = (function (_super) {
    __extends(ModuleElementSyntax, _super);
    function ModuleElementSyntax() {
        _super.apply(this, arguments);

    }
    return ModuleElementSyntax;
})(SyntaxNode);
var ModuleReferenceSyntax = (function (_super) {
    __extends(ModuleReferenceSyntax, _super);
    function ModuleReferenceSyntax() {
        _super.apply(this, arguments);

    }
    return ModuleReferenceSyntax;
})(SyntaxNode);
var ExternalModuleReferenceSyntax = (function (_super) {
    __extends(ExternalModuleReferenceSyntax, _super);
    function ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken) {
        _super.call(this);
        if(moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) {
            throw Errors.argument("moduleKeyword");
        }
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(stringLiteral.kind() !== SyntaxKind.StringLiteral) {
            throw Errors.argument("stringLiteral");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
    }
    ExternalModuleReferenceSyntax.prototype.moduleKeyword = function () {
        return this._moduleKeyword;
    };
    ExternalModuleReferenceSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    ExternalModuleReferenceSyntax.prototype.stringLiteral = function () {
        return this._stringLiteral;
    };
    ExternalModuleReferenceSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    return ExternalModuleReferenceSyntax;
})(ModuleReferenceSyntax);
var ModuleNameModuleReference = (function (_super) {
    __extends(ModuleNameModuleReference, _super);
    function ModuleNameModuleReference(moduleName) {
        _super.call(this);
        if(moduleName === null) {
            throw Errors.argumentNull("moduleName");
        }
        this._moduleName = moduleName;
    }
    ModuleNameModuleReference.prototype.moduleName = function () {
        return this._moduleName;
    };
    return ModuleNameModuleReference;
})(ModuleReferenceSyntax);
var ImportDeclarationSyntax = (function (_super) {
    __extends(ImportDeclarationSyntax, _super);
    function ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken) {
        _super.call(this);
        if(importKeyword.kind() !== SyntaxKind.ImportKeyword) {
            throw Errors.argument("importKeyword");
        }
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(equalsToken.kind() !== SyntaxKind.EqualsToken) {
            throw Errors.argument("equalsToken");
        }
        if(moduleReference === null) {
            throw Errors.argumentNull("moduleReference");
        }
        if(semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }
    ImportDeclarationSyntax.prototype.importKeyword = function () {
        return this._importKeyword;
    };
    ImportDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    ImportDeclarationSyntax.prototype.equalsTokens = function () {
        return this._equalsToken;
    };
    ImportDeclarationSyntax.prototype.moduleReference = function () {
        return this._moduleReference;
    };
    ImportDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return ImportDeclarationSyntax;
})(ModuleElementSyntax);
var ClassDeclarationSyntax = (function (_super) {
    __extends(ClassDeclarationSyntax, _super);
    function ClassDeclarationSyntax(exportKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken) {
        _super.call(this);
        if(exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }
        if(classKeyword.keywordKind() !== SyntaxKind.ClassKeyword) {
            throw Errors.argument("classKeyword");
        }
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(classElements === null) {
            throw Errors.argumentNull("classElements");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._exportKeyword = exportKeyword;
        this._classKeyword = classKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._implementsClause = implementsClause;
        this._openBraceToken = openBraceToken;
        this._classElements = classElements;
        this._closeBraceToken = closeBraceToken;
    }
    ClassDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.ClassDeclaration;
    };
    ClassDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    ClassDeclarationSyntax.prototype.classKeyword = function () {
        return this._classKeyword;
    };
    ClassDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    ClassDeclarationSyntax.prototype.extendsClause = function () {
        return this._extendsClause;
    };
    ClassDeclarationSyntax.prototype.implementsClause = function () {
        return this._implementsClause;
    };
    ClassDeclarationSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    ClassDeclarationSyntax.prototype.classElements = function () {
        return this._classElements;
    };
    ClassDeclarationSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return ClassDeclarationSyntax;
})(ModuleElementSyntax);
var InterfaceDeclarationSyntax = (function (_super) {
    __extends(InterfaceDeclarationSyntax, _super);
    function InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body) {
        _super.call(this);
        if(exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }
        if(interfaceKeyword.keywordKind() !== SyntaxKind.InterfaceKeyword) {
            throw Errors.argument("interfaceKeyword");
        }
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(body === null) {
            throw Errors.argumentNull("body");
        }
        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._body = body;
    }
    InterfaceDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.InterfaceDeclaration;
    };
    InterfaceDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    InterfaceDeclarationSyntax.prototype.interfaceKeyword = function () {
        return this._interfaceKeyword;
    };
    InterfaceDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    InterfaceDeclarationSyntax.prototype.extendsClause = function () {
        return this._extendsClause;
    };
    InterfaceDeclarationSyntax.prototype.body = function () {
        return this._body;
    };
    return InterfaceDeclarationSyntax;
})(ModuleElementSyntax);
var ExtendsClauseSyntax = (function (_super) {
    __extends(ExtendsClauseSyntax, _super);
    function ExtendsClauseSyntax(extendsKeyword, typeNames) {
        _super.call(this);
        if(extendsKeyword.keywordKind() !== SyntaxKind.ExtendsKeyword) {
            throw Errors.argument("extendsKeyword");
        }
        if(typeNames === null) {
            throw Errors.argumentNull("typeNames");
        }
        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
    }
    ExtendsClauseSyntax.prototype.extendsKeyword = function () {
        return this._extendsKeyword;
    };
    ExtendsClauseSyntax.prototype.typeNames = function () {
        return this._typeNames;
    };
    return ExtendsClauseSyntax;
})(SyntaxNode);
var ImplementsClauseSyntax = (function (_super) {
    __extends(ImplementsClauseSyntax, _super);
    function ImplementsClauseSyntax(implementsKeyword, typeNames) {
        _super.call(this);
        if(implementsKeyword.keywordKind() !== SyntaxKind.ImplementsKeyword) {
            throw Errors.argument("extendsKimplementsKeywordeyword");
        }
        if(typeNames === null) {
            throw Errors.argumentNull("typeNames");
        }
        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
    }
    ImplementsClauseSyntax.prototype.kind = function () {
        return SyntaxKind.ImplementsClause;
    };
    ImplementsClauseSyntax.prototype.implementsKeyword = function () {
        return this._implementsKeyword;
    };
    ImplementsClauseSyntax.prototype.typeNames = function () {
        return this._typeNames;
    };
    return ImplementsClauseSyntax;
})(SyntaxNode);
var ModuleDeclarationSyntax = (function (_super) {
    __extends(ModuleDeclarationSyntax, _super);
    function ModuleDeclarationSyntax(exportKeyword, moduleKeyword, moduleName, openBraceToken, moduleElements, closeBraceToken) {
        _super.call(this);
        if(exportKeyword != null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }
        if(moduleKeyword.keywordKind() !== SyntaxKind.ModuleKeyword) {
            throw Errors.argument("moduleKeyword");
        }
        if(moduleName === null) {
            throw Errors.argumentNull("moduleName");
        }
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(moduleElements === null) {
            throw Errors.argumentNull("moduleElements");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._moduleKeyword = moduleKeyword;
        this._moduleName = moduleName;
        this._openBraceToken = openBraceToken;
        this._moduleElements = moduleElements;
        this._closeBraceToken = closeBraceToken;
    }
    ModuleDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.ModuleDeclaration;
    };
    ModuleDeclarationSyntax.prototype.moduleKeyword = function () {
        return this._moduleKeyword;
    };
    ModuleDeclarationSyntax.prototype.moduleName = function () {
        return this._moduleName;
    };
    ModuleDeclarationSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    ModuleDeclarationSyntax.prototype.moduleElements = function () {
        return this._moduleElements;
    };
    ModuleDeclarationSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return ModuleDeclarationSyntax;
})(ModuleElementSyntax);
var StatementSyntax = (function (_super) {
    __extends(StatementSyntax, _super);
    function StatementSyntax() {
        _super.apply(this, arguments);

    }
    return StatementSyntax;
})(ModuleElementSyntax);
var FunctionDeclarationSyntax = (function (_super) {
    __extends(FunctionDeclarationSyntax, _super);
    function FunctionDeclarationSyntax(exportKeyword, functionKeyword, functionSignature, block, semicolonToken) {
        _super.call(this);
        if(exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }
        if(functionKeyword.keywordKind() !== SyntaxKind.FunctionKeyword) {
            throw Errors.argument("functionKeyword");
        }
        if(functionSignature === null) {
            throw Errors.argumentNull("functionSignature");
        }
        if(semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._exportKeyword = exportKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._semicolonToken = semicolonToken;
        this._block = block;
    }
    FunctionDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.FunctionDeclaration;
    };
    FunctionDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    FunctionDeclarationSyntax.prototype.functionKeyword = function () {
        return this._functionKeyword;
    };
    FunctionDeclarationSyntax.prototype.functionSignature = function () {
        return this._functionSignature;
    };
    FunctionDeclarationSyntax.prototype.block = function () {
        return this._block;
    };
    FunctionDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return FunctionDeclarationSyntax;
})(StatementSyntax);
var VariableStatementSyntax = (function (_super) {
    __extends(VariableStatementSyntax, _super);
    function VariableStatementSyntax(exportKeyword, variableDeclaration, semicolonToken) {
        _super.call(this);
        if(exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }
        if(variableDeclaration === null) {
            throw Errors.argumentNull("variableDeclaration");
        }
        if(semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._exportKeyword = exportKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }
    VariableStatementSyntax.prototype.kind = function () {
        return SyntaxKind.VariableStatement;
    };
    VariableStatementSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    VariableStatementSyntax.prototype.variableDeclaration = function () {
        return this._variableDeclaration;
    };
    VariableStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return VariableStatementSyntax;
})(StatementSyntax);
var ExpressionSyntax = (function (_super) {
    __extends(ExpressionSyntax, _super);
    function ExpressionSyntax() {
        _super.apply(this, arguments);

    }
    return ExpressionSyntax;
})(SyntaxNode);
var UnaryExpressionSyntax = (function (_super) {
    __extends(UnaryExpressionSyntax, _super);
    function UnaryExpressionSyntax() {
        _super.apply(this, arguments);

    }
    return UnaryExpressionSyntax;
})(ExpressionSyntax);
var VariableDeclarationSyntax = (function (_super) {
    __extends(VariableDeclarationSyntax, _super);
    function VariableDeclarationSyntax(varKeyword, variableDeclarators) {
        _super.call(this);
        if(varKeyword.keywordKind() !== SyntaxKind.VarKeyword) {
            throw Errors.argument("varKeyword");
        }
        if(variableDeclarators === null) {
            throw Errors.argumentNull("variableDeclarators");
        }
        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
    }
    VariableDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.VariableDeclaration;
    };
    VariableDeclarationSyntax.prototype.varKeyword = function () {
        return this._varKeyword;
    };
    VariableDeclarationSyntax.prototype.variableDeclarators = function () {
        return this._variableDeclarators;
    };
    return VariableDeclarationSyntax;
})(SyntaxNode);
var VariableDeclaratorSyntax = (function (_super) {
    __extends(VariableDeclaratorSyntax, _super);
    function VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause) {
        _super.call(this);
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }
    VariableDeclaratorSyntax.prototype.kind = function () {
        return SyntaxKind.VariableDeclarator;
    };
    VariableDeclaratorSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    VariableDeclaratorSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    VariableDeclaratorSyntax.prototype.equalsValueClause = function () {
        return this._equalsValueClause;
    };
    return VariableDeclaratorSyntax;
})(SyntaxNode);
var EqualsValueClauseSyntax = (function (_super) {
    __extends(EqualsValueClauseSyntax, _super);
    function EqualsValueClauseSyntax(equalsToken, value) {
        _super.call(this);
        if(equalsToken.kind() !== SyntaxKind.EqualsToken) {
            throw Errors.argument("equalsToken");
        }
        this._equalsToken = equalsToken;
        this._value = value;
    }
    EqualsValueClauseSyntax.prototype.kind = function () {
        return SyntaxKind.EqualsValueClause;
    };
    EqualsValueClauseSyntax.prototype.equalsValue = function () {
        return this._equalsToken;
    };
    EqualsValueClauseSyntax.prototype.value = function () {
        return this._value;
    };
    return EqualsValueClauseSyntax;
})(SyntaxNode);
var PrefixUnaryExpressionSyntax = (function (_super) {
    __extends(PrefixUnaryExpressionSyntax, _super);
    function PrefixUnaryExpressionSyntax(kind, operatorToken, operand) {
        _super.call(this);
        this._kind = SyntaxKind.None;
        if(operand === null) {
            throw Errors.argumentNull("operand");
        }
        this._kind = kind;
        this._operatorToken = operatorToken;
        this._operand = operand;
    }
    PrefixUnaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    PrefixUnaryExpressionSyntax.prototype.operatorToken = function () {
        return this._operatorToken;
    };
    PrefixUnaryExpressionSyntax.prototype.operand = function () {
        return this._operand;
    };
    return PrefixUnaryExpressionSyntax;
})(UnaryExpressionSyntax);
var ThisExpressionSyntax = (function (_super) {
    __extends(ThisExpressionSyntax, _super);
    function ThisExpressionSyntax(thisKeyword) {
        _super.call(this);
        if(thisKeyword.keywordKind() !== SyntaxKind.ThisKeyword) {
            throw Errors.argument("thisKeyword");
        }
        this._thisKeyword = thisKeyword;
    }
    ThisExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ThisExpression;
    };
    ThisExpressionSyntax.prototype.thisKeyword = function () {
        return this._thisKeyword;
    };
    return ThisExpressionSyntax;
})(UnaryExpressionSyntax);
var LiteralExpressionSyntax = (function (_super) {
    __extends(LiteralExpressionSyntax, _super);
    function LiteralExpressionSyntax(kind, literalToken) {
        _super.call(this);
        this._kind = SyntaxKind.None;
        this._kind = kind;
        this._literalToken = literalToken;
    }
    LiteralExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    LiteralExpressionSyntax.prototype.literalToken = function () {
        return this._literalToken;
    };
    return LiteralExpressionSyntax;
})(UnaryExpressionSyntax);
var ArrayLiteralExpressionSyntax = (function (_super) {
    __extends(ArrayLiteralExpressionSyntax, _super);
    function ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken) {
        _super.call(this);
        if(openBracketToken.kind() !== SyntaxKind.OpenBracketToken) {
            throw Errors.argument("openBracketToken");
        }
        if(expressions === null) {
            throw Errors.argumentNull("expressions");
        }
        if(closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) {
            throw Errors.argument("closeBracketToken");
        }
        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
    }
    ArrayLiteralExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ArrayLiteralExpression;
    };
    ArrayLiteralExpressionSyntax.prototype.openBracketToken = function () {
        return this._openBracketToken;
    };
    ArrayLiteralExpressionSyntax.prototype.expressions = function () {
        return this._expressions;
    };
    ArrayLiteralExpressionSyntax.prototype.closeBracketToken = function () {
        return this._closeBracketToken;
    };
    return ArrayLiteralExpressionSyntax;
})(UnaryExpressionSyntax);
var OmittedExpressionSyntax = (function (_super) {
    __extends(OmittedExpressionSyntax, _super);
    function OmittedExpressionSyntax() {
        _super.call(this);
    }
    return OmittedExpressionSyntax;
})(ExpressionSyntax);
var ParenthesizedExpressionSyntax = (function (_super) {
    __extends(ParenthesizedExpressionSyntax, _super);
    function ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken) {
        _super.call(this);
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
    }
    ParenthesizedExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ParenthesizedExpression;
    };
    ParenthesizedExpressionSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    ParenthesizedExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    ParenthesizedExpressionSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    return ParenthesizedExpressionSyntax;
})(UnaryExpressionSyntax);
var ArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ArrowFunctionExpressionSyntax, _super);
    function ArrowFunctionExpressionSyntax(equalsGreaterThanToken, body) {
        _super.call(this);
        if(equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) {
            throw Errors.argument("equalsGreaterThanToken");
        }
        if(body === null) {
            throw Errors.argumentNull("body");
        }
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }
    ArrowFunctionExpressionSyntax.prototype.equalsGreaterThanToken = function () {
        return this._equalsGreaterThanToken;
    };
    ArrowFunctionExpressionSyntax.prototype.body = function () {
        return this._body;
    };
    return ArrowFunctionExpressionSyntax;
})(UnaryExpressionSyntax);
var TypeSyntax = (function (_super) {
    __extends(TypeSyntax, _super);
    function TypeSyntax() {
        _super.apply(this, arguments);

    }
    return TypeSyntax;
})(UnaryExpressionSyntax);
var NameSyntax = (function (_super) {
    __extends(NameSyntax, _super);
    function NameSyntax() {
        _super.apply(this, arguments);

    }
    return NameSyntax;
})(TypeSyntax);
var IdentifierNameSyntax = (function (_super) {
    __extends(IdentifierNameSyntax, _super);
    function IdentifierNameSyntax(identifier) {
        _super.call(this);
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        this._identifier = identifier;
    }
    IdentifierNameSyntax.prototype.kind = function () {
        return SyntaxKind.IdentifierName;
    };
    IdentifierNameSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    IdentifierNameSyntax.prototype.isMissing = function () {
        return this.identifier().isMissing();
    };
    return IdentifierNameSyntax;
})(NameSyntax);
var QualifiedNameSyntax = (function (_super) {
    __extends(QualifiedNameSyntax, _super);
    function QualifiedNameSyntax(left, dotToken, right) {
        _super.call(this);
        if(left === null) {
            throw Errors.argumentNull("left");
        }
        if(dotToken.kind() !== SyntaxKind.DotToken) {
            throw Errors.argument("dotToken");
        }
        if(right === null) {
            throw Errors.argumentNull("right");
        }
        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
    }
    QualifiedNameSyntax.prototype.left = function () {
        return this._left;
    };
    QualifiedNameSyntax.prototype.dotToken = function () {
        return this._dotToken;
    };
    QualifiedNameSyntax.prototype.right = function () {
        return this._right;
    };
    return QualifiedNameSyntax;
})(NameSyntax);
var ConstructorTypeSyntax = (function (_super) {
    __extends(ConstructorTypeSyntax, _super);
    function ConstructorTypeSyntax() {
        _super.apply(this, arguments);

    }
    return ConstructorTypeSyntax;
})(TypeSyntax);
var FunctionTypeSyntax = (function (_super) {
    __extends(FunctionTypeSyntax, _super);
    function FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type) {
        _super.call(this);
        if(parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }
        if(equalsGreaterThanToken.kind() !== SyntaxKind.EqualsGreaterThanToken) {
            throw Errors.argument("equalsGreaterThanToken");
        }
        if(type === null) {
            throw Errors.argumentNull("type");
        }
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }
    FunctionTypeSyntax.prototype.kind = function () {
        return SyntaxKind.FunctionType;
    };
    FunctionTypeSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    FunctionTypeSyntax.prototype.equalsGreaterThanToken = function () {
        return this._equalsGreaterThanToken;
    };
    FunctionTypeSyntax.prototype.type = function () {
        return this._type;
    };
    return FunctionTypeSyntax;
})(TypeSyntax);
var ObjectTypeSyntax = (function (_super) {
    __extends(ObjectTypeSyntax, _super);
    function ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken) {
        _super.call(this);
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(typeMembers === null) {
            throw Errors.argumentNull("typeMembers");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
    }
    ObjectTypeSyntax.prototype.kind = function () {
        return SyntaxKind.ObjectType;
    };
    ObjectTypeSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    ObjectTypeSyntax.prototype.typeMembers = function () {
        return this._typeMembers;
    };
    ObjectTypeSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return ObjectTypeSyntax;
})(TypeSyntax);
var ArrayTypeSyntax = (function (_super) {
    __extends(ArrayTypeSyntax, _super);
    function ArrayTypeSyntax(type, openBracketToken, closeBracketToken) {
        _super.call(this);
        if(openBracketToken.kind() !== SyntaxKind.OpenBracketToken) {
            throw Errors.argument("openBracketToken");
        }
        if(closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) {
            throw Errors.argument("closeBracketToken");
        }
        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
    }
    ArrayTypeSyntax.prototype.kind = function () {
        return SyntaxKind.ArrayType;
    };
    ArrayTypeSyntax.prototype.type = function () {
        return this._type;
    };
    ArrayTypeSyntax.prototype.openBracketToken = function () {
        return this._openBracketToken;
    };
    ArrayTypeSyntax.prototype.closeBracketToken = function () {
        return this._closeBracketToken;
    };
    return ArrayTypeSyntax;
})(TypeSyntax);
var PredefinedTypeSyntax = (function (_super) {
    __extends(PredefinedTypeSyntax, _super);
    function PredefinedTypeSyntax(keyword) {
        _super.call(this);
        this._keyword = keyword;
    }
    PredefinedTypeSyntax.prototype.kind = function () {
        return SyntaxKind.PredefinedType;
    };
    PredefinedTypeSyntax.prototype.keyword = function () {
        return this._keyword;
    };
    return PredefinedTypeSyntax;
})(TypeSyntax);
var TypeAnnotationSyntax = (function (_super) {
    __extends(TypeAnnotationSyntax, _super);
    function TypeAnnotationSyntax(colonToken, type) {
        _super.call(this);
        if(colonToken.kind() !== SyntaxKind.ColonToken) {
            throw Errors.argument("colonToken");
        }
        if(type === null) {
            throw Errors.argumentNull("type");
        }
        this._colonToken = colonToken;
        this._type = type;
    }
    TypeAnnotationSyntax.prototype.kind = function () {
        return SyntaxKind.TypeAnnotation;
    };
    TypeAnnotationSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    TypeAnnotationSyntax.prototype.type = function () {
        return this._type;
    };
    return TypeAnnotationSyntax;
})(SyntaxNode);
var ParenthesizedArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ParenthesizedArrowFunctionExpressionSyntax, _super);
    function ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body) {
        _super.call(this, equalsGreaterThanToken, body);
        if(callSignature === null) {
            throw Errors.argumentNull("callSignature");
        }
        this._callSignature = callSignature;
    }
    ParenthesizedArrowFunctionExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ParenthesizedArrowFunctionExpression;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.callSignature = function () {
        return this._callSignature;
    };
    return ParenthesizedArrowFunctionExpressionSyntax;
})(ArrowFunctionExpressionSyntax);
var BlockSyntax = (function (_super) {
    __extends(BlockSyntax, _super);
    function BlockSyntax(openBraceToken, statements, closeBraceToken) {
        _super.call(this);
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(statements === null) {
            throw Errors.argumentNull("statements");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._openBraceToken = openBraceToken;
        this._statements = statements;
        this._closeBraceToken = closeBraceToken;
    }
    BlockSyntax.prototype.kind = function () {
        return SyntaxKind.Block;
    };
    BlockSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    BlockSyntax.prototype.statements = function () {
        return this._statements;
    };
    BlockSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return BlockSyntax;
})(StatementSyntax);
var ParameterSyntax = (function (_super) {
    __extends(ParameterSyntax, _super);
    function ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause) {
        _super.call(this);
        if(dotDotDotToken != null && dotDotDotToken.kind() !== SyntaxKind.DotDotDotToken) {
            throw Errors.argument("dotDotDotToken");
        }
        if(publicOrPrivateKeyword != null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) {
            throw Errors.argument("publicOrPrivateKeyword");
        }
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(questionToken != null && questionToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("questionToken");
        }
        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnontation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }
    ParameterSyntax.prototype.kind = function () {
        return SyntaxKind.Parameter;
    };
    ParameterSyntax.prototype.dotDotDotToken = function () {
        return this._dotDotDotToken;
    };
    ParameterSyntax.prototype.publicOrPrivateKeyword = function () {
        return this._publicOrPrivateKeyword;
    };
    ParameterSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    ParameterSyntax.prototype.questionToken = function () {
        return this._questionToken;
    };
    ParameterSyntax.prototype.typeAnnotation = function () {
        return this._typeAnontation;
    };
    ParameterSyntax.prototype.equalsValueClause = function () {
        return this._equalsValueClause;
    };
    return ParameterSyntax;
})(SyntaxNode);
var MemberAccessExpressionSyntax = (function (_super) {
    __extends(MemberAccessExpressionSyntax, _super);
    function MemberAccessExpressionSyntax(expression, dotToken, identifierName) {
        _super.call(this);
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        if(dotToken.kind() !== SyntaxKind.DotToken) {
            throw Errors.argument("dotToken");
        }
        if(identifierName === null) {
            throw Errors.argumentNull("identifierName");
        }
        this._expression = expression;
        this._dotToken = dotToken;
        this._identifierName = identifierName;
    }
    MemberAccessExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.MemberAccessExpression;
    };
    MemberAccessExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    MemberAccessExpressionSyntax.prototype.dotToken = function () {
        return this._dotToken;
    };
    MemberAccessExpressionSyntax.prototype.identifierName = function () {
        return this._identifierName;
    };
    return MemberAccessExpressionSyntax;
})(UnaryExpressionSyntax);
var PostfixUnaryExpressionSyntax = (function (_super) {
    __extends(PostfixUnaryExpressionSyntax, _super);
    function PostfixUnaryExpressionSyntax(kind, operand, operatorToken) {
        _super.call(this);
        this._kind = SyntaxKind.None;
        if(kind !== SyntaxKind.PostIncrementExpression && kind !== SyntaxKind.PostDecrementExpression) {
            throw Errors.argument("kind");
        }
        if(operand === null) {
            throw Errors.argumentNull("operand");
        }
        if(operatorToken.kind() !== SyntaxKind.PlusPlusToken && operatorToken.kind() !== SyntaxKind.MinusMinusToken) {
            throw Errors.argument("operatorToken");
        }
        this._kind = kind;
        this._operand = operand;
        this._operatorToken = operatorToken;
    }
    PostfixUnaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    PostfixUnaryExpressionSyntax.prototype.operand = function () {
        return this._operand;
    };
    PostfixUnaryExpressionSyntax.prototype.operatorToken = function () {
        return this._operatorToken;
    };
    return PostfixUnaryExpressionSyntax;
})(UnaryExpressionSyntax);
var ElementAccessExpressionSyntax = (function (_super) {
    __extends(ElementAccessExpressionSyntax, _super);
    function ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken) {
        _super.call(this);
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        if(openBracketToken.kind() !== SyntaxKind.OpenBracketToken) {
            throw Errors.argument("openBracketToken");
        }
        if(argumentExpression === null) {
            throw Errors.argumentNull("argumentExpression");
        }
        if(closeBracketToken.kind() !== SyntaxKind.CloseBracketToken) {
            throw Errors.argument("closeBracketToken");
        }
        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
    }
    ElementAccessExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ElementAccessExpression;
    };
    ElementAccessExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    ElementAccessExpressionSyntax.prototype.openBracketToken = function () {
        return this._openBracketToken;
    };
    ElementAccessExpressionSyntax.prototype.argumentExpression = function () {
        return this._argumentExpression;
    };
    ElementAccessExpressionSyntax.prototype.closeBracketToken = function () {
        return this._closeBracketToken;
    };
    return ElementAccessExpressionSyntax;
})(UnaryExpressionSyntax);
var InvocationExpressionSyntax = (function (_super) {
    __extends(InvocationExpressionSyntax, _super);
    function InvocationExpressionSyntax(expression, argumentList) {
        _super.call(this);
        if(expression === null) {
            throw Errors.argument("expression");
        }
        if(argumentList === null) {
            throw Errors.argument("argumentList");
        }
        this._expression = expression;
        this._argumentList = argumentList;
    }
    InvocationExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.InvocationExpression;
    };
    InvocationExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    InvocationExpressionSyntax.prototype.argumentList = function () {
        return this._argumentList;
    };
    return InvocationExpressionSyntax;
})(UnaryExpressionSyntax);
var ArgumentListSyntax = (function (_super) {
    __extends(ArgumentListSyntax, _super);
    function ArgumentListSyntax(openParenToken, arguments, closeParenToken) {
        _super.call(this);
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(arguments === null) {
            throw Errors.argumentNull("arguments");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
    }
    ArgumentListSyntax.prototype.kind = function () {
        return SyntaxKind.ArgumentList;
    };
    ArgumentListSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    ArgumentListSyntax.prototype.arguments = function () {
        return this._arguments;
    };
    ArgumentListSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    return ArgumentListSyntax;
})(SyntaxNode);
var BinaryExpressionSyntax = (function (_super) {
    __extends(BinaryExpressionSyntax, _super);
    function BinaryExpressionSyntax(kind, left, operatorToken, right) {
        _super.call(this);
        this._kind = SyntaxKind.None;
        if(left === null) {
            throw Errors.argumentNull("left");
        }
        if(right === null) {
            throw Errors.argumentNull("right");
        }
        this._kind = kind;
        this._left = left;
        this._operatorToken = operatorToken;
        this._right = right;
    }
    BinaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    BinaryExpressionSyntax.prototype.left = function () {
        return this._left;
    };
    BinaryExpressionSyntax.prototype.operatorToken = function () {
        return this._operatorToken;
    };
    BinaryExpressionSyntax.prototype.right = function () {
        return this._right;
    };
    return BinaryExpressionSyntax;
})(ExpressionSyntax);
var ConditionalExpressionSyntax = (function (_super) {
    __extends(ConditionalExpressionSyntax, _super);
    function ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse) {
        _super.call(this);
        if(condition === null) {
            throw Errors.argumentNull("condition");
        }
        if(questionToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("questionToken");
        }
        if(whenTrue === null) {
            throw Errors.argumentNull("whenTrue");
        }
        if(colonToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("colonToken");
        }
        if(whenFalse === null) {
            throw Errors.argumentNull("whenFalse");
        }
        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
    }
    ConditionalExpressionSyntax.prototype.condition = function () {
        return this._condition;
    };
    ConditionalExpressionSyntax.prototype.questionToken = function () {
        return this._questionToken;
    };
    ConditionalExpressionSyntax.prototype.whenTrue = function () {
        return this._whenTrue;
    };
    ConditionalExpressionSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    ConditionalExpressionSyntax.prototype.whenFalse = function () {
        return this._whenFalse;
    };
    return ConditionalExpressionSyntax;
})(ExpressionSyntax);
var TypeMemberSyntax = (function (_super) {
    __extends(TypeMemberSyntax, _super);
    function TypeMemberSyntax() {
        _super.apply(this, arguments);

    }
    return TypeMemberSyntax;
})(SyntaxNode);
var ConstructSignatureSyntax = (function (_super) {
    __extends(ConstructSignatureSyntax, _super);
    function ConstructSignatureSyntax() {
        _super.apply(this, arguments);

    }
    return ConstructSignatureSyntax;
})(TypeMemberSyntax);
var FunctionSignatureSyntax = (function (_super) {
    __extends(FunctionSignatureSyntax, _super);
    function FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation) {
        _super.call(this);
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(questionToken !== null && questionToken.kind() !== SyntaxKind.QuestionToken) {
            throw Errors.argument("questionToken");
        }
        if(parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }
    FunctionSignatureSyntax.prototype.kind = function () {
        return SyntaxKind.FunctionSignature;
    };
    FunctionSignatureSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    FunctionSignatureSyntax.prototype.questionToken = function () {
        return this._questionToken;
    };
    FunctionSignatureSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    FunctionSignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    return FunctionSignatureSyntax;
})(TypeMemberSyntax);
var IndexSignatureSyntax = (function (_super) {
    __extends(IndexSignatureSyntax, _super);
    function IndexSignatureSyntax() {
        _super.apply(this, arguments);

    }
    return IndexSignatureSyntax;
})(TypeMemberSyntax);
var PropertySignatureSyntax = (function (_super) {
    __extends(PropertySignatureSyntax, _super);
    function PropertySignatureSyntax(identifier, questionToken, typeAnnotation) {
        _super.call(this);
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
    }
    PropertySignatureSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    PropertySignatureSyntax.prototype.questionToken = function () {
        return this._questionToken;
    };
    PropertySignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    return PropertySignatureSyntax;
})(TypeMemberSyntax);
var ParameterListSyntax = (function (_super) {
    __extends(ParameterListSyntax, _super);
    function ParameterListSyntax(openParenToken, parameters, closeParenToken) {
        _super.call(this);
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(parameters === null) {
            throw Errors.argumentNull("parameters");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        this._openParenToken = openParenToken;
        this._parameters = parameters;
        this._closeParenToken = closeParenToken;
    }
    ParameterListSyntax.prototype.kind = function () {
        return SyntaxKind.ParameterList;
    };
    ParameterListSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    ParameterListSyntax.prototype.parameters = function () {
        return this._parameters;
    };
    ParameterListSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    return ParameterListSyntax;
})(SyntaxNode);
var CallSignatureSyntax = (function (_super) {
    __extends(CallSignatureSyntax, _super);
    function CallSignatureSyntax(parameterList, typeAnnotation) {
        _super.call(this);
        if(parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }
    CallSignatureSyntax.prototype.kind = function () {
        return SyntaxKind.CallSignature;
    };
    CallSignatureSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    CallSignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    return CallSignatureSyntax;
})(TypeMemberSyntax);
var ElseClauseSyntax = (function (_super) {
    __extends(ElseClauseSyntax, _super);
    function ElseClauseSyntax(elseKeyword, statement) {
        _super.call(this);
        if(elseKeyword.keywordKind() !== SyntaxKind.ElseKeyword) {
            throw Errors.argument("elseKeyword");
        }
        if(statement === null) {
            throw Errors.argumentNull("statement");
        }
        this._elseKeyword = elseKeyword;
        this._statement = statement;
    }
    ElseClauseSyntax.prototype.kind = function () {
        return SyntaxKind.ElseClause;
    };
    ElseClauseSyntax.prototype.elseKeyword = function () {
        return this._elseKeyword;
    };
    ElseClauseSyntax.prototype.statement = function () {
        return this._statement;
    };
    return ElseClauseSyntax;
})(SyntaxNode);
var IfStatementSyntax = (function (_super) {
    __extends(IfStatementSyntax, _super);
    function IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause) {
        _super.call(this);
        if(ifKeyword.keywordKind() !== SyntaxKind.IfKeyword) {
            throw Errors.argument("ifKeyword");
        }
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(condition === null) {
            throw Errors.argumentNull("condition");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        if(statement === null) {
            throw Errors.argumentNull("statement");
        }
        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
    }
    IfStatementSyntax.prototype.kind = function () {
        return SyntaxKind.IfStatement;
    };
    IfStatementSyntax.prototype.ifKeyword = function () {
        return this._ifKeyword;
    };
    IfStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    IfStatementSyntax.prototype.condition = function () {
        return this._condition;
    };
    IfStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    IfStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    IfStatementSyntax.prototype.elseClause = function () {
        return this._elseClause;
    };
    return IfStatementSyntax;
})(StatementSyntax);
var ExpressionStatementSyntax = (function (_super) {
    __extends(ExpressionStatementSyntax, _super);
    function ExpressionStatementSyntax(expression, semicolonToken) {
        _super.call(this);
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        if(semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }
    ExpressionStatementSyntax.prototype.kind = function () {
        return SyntaxKind.ExpressionStatement;
    };
    ExpressionStatementSyntax.prototype.expression = function () {
        return this._expression;
    };
    ExpressionStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return ExpressionStatementSyntax;
})(StatementSyntax);
var ClassElementSyntax = (function (_super) {
    __extends(ClassElementSyntax, _super);
    function ClassElementSyntax() {
        _super.apply(this, arguments);

    }
    return ClassElementSyntax;
})(SyntaxNode);
var ConstructorDeclarationSyntax = (function (_super) {
    __extends(ConstructorDeclarationSyntax, _super);
    function ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken) {
        _super.call(this);
        if(constructorKeyword.keywordKind() !== SyntaxKind.ConstructorKeyword) {
            throw Errors.argument("constructorKeyword");
        }
        if(parameterList === null) {
            throw Errors.argumentNull("parameterList");
        }
        if(semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("SemicolonToken");
        }
        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    ConstructorDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.ConstructorDeclaration;
    };
    ConstructorDeclarationSyntax.prototype.constructorKeyword = function () {
        return this._constructorKeyword;
    };
    ConstructorDeclarationSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    ConstructorDeclarationSyntax.prototype.block = function () {
        return this._block;
    };
    ConstructorDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return ConstructorDeclarationSyntax;
})(ClassElementSyntax);
var MemberDeclarationSyntax = (function (_super) {
    __extends(MemberDeclarationSyntax, _super);
    function MemberDeclarationSyntax(publicOrPrivateKeyword, staticKeyword) {
        _super.call(this);
        if(publicOrPrivateKeyword !== null && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PublicKeyword && publicOrPrivateKeyword.keywordKind() !== SyntaxKind.PrivateKeyword) {
            throw Errors.argument("publicOrPrivateKeyword");
        }
        if(staticKeyword !== null && staticKeyword.keywordKind() !== SyntaxKind.StaticKeyword) {
            throw Errors.argument("staticKeyword");
        }
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
    }
    MemberDeclarationSyntax.prototype.publicOrPrivateKeyword = function () {
        return this._publicOrPrivateKeyword;
    };
    MemberDeclarationSyntax.prototype.staticKeyword = function () {
        return this._staticKeyword;
    };
    return MemberDeclarationSyntax;
})(ClassElementSyntax);
var MemberFunctionDeclarationSyntax = (function (_super) {
    __extends(MemberFunctionDeclarationSyntax, _super);
    function MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword);
        if(functionSignature === null) {
            throw Errors.argumentNull("functionSignature");
        }
        if(semicolonToken !== null && semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    MemberFunctionDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.MemberFunctionDeclaration;
    };
    MemberFunctionDeclarationSyntax.prototype.functionSignature = function () {
        return this._functionSignature;
    };
    MemberFunctionDeclarationSyntax.prototype.block = function () {
        return this._block;
    };
    MemberFunctionDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return MemberFunctionDeclarationSyntax;
})(MemberDeclarationSyntax);
var MemberAccessorDeclarationSyntax = (function (_super) {
    __extends(MemberAccessorDeclarationSyntax, _super);
    function MemberAccessorDeclarationSyntax() {
        _super.apply(this, arguments);

    }
    return MemberAccessorDeclarationSyntax;
})(MemberDeclarationSyntax);
var MemberVariableDeclarationSyntax = (function (_super) {
    __extends(MemberVariableDeclarationSyntax, _super);
    function MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword);
        if(variableDeclarator === null) {
            throw Errors.argumentNull("variableDeclarator");
        }
        if(semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }
    MemberVariableDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.MemberFunctionDeclaration;
    };
    MemberVariableDeclarationSyntax.prototype.variableDeclarator = function () {
        return this._variableDeclarator;
    };
    MemberVariableDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return MemberVariableDeclarationSyntax;
})(MemberDeclarationSyntax);
var ReturnStatementSyntax = (function (_super) {
    __extends(ReturnStatementSyntax, _super);
    function ReturnStatementSyntax(returnKeyword, expression, semicolonToken) {
        _super.call(this);
        if(returnKeyword.keywordKind() !== SyntaxKind.ReturnKeyword) {
            throw Errors.argument("returnKeyword");
        }
        if(semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._returnKeyword = returnKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }
    ReturnStatementSyntax.prototype.kind = function () {
        return SyntaxKind.ReturnStatement;
    };
    ReturnStatementSyntax.prototype.returnKeyword = function () {
        return this._returnKeyword;
    };
    ReturnStatementSyntax.prototype.expression = function () {
        return this._expression;
    };
    ReturnStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return ReturnStatementSyntax;
})(StatementSyntax);
var ObjectCreationExpressionSyntax = (function (_super) {
    __extends(ObjectCreationExpressionSyntax, _super);
    function ObjectCreationExpressionSyntax(newKeyword, expression, argumentList) {
        _super.call(this);
        if(newKeyword.keywordKind() !== SyntaxKind.NewKeyword) {
            throw Errors.argument("newKeyword");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
    }
    ObjectCreationExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ObjectCreationExpression;
    };
    ObjectCreationExpressionSyntax.prototype.newKeyword = function () {
        return this._newKeyword;
    };
    ObjectCreationExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    ObjectCreationExpressionSyntax.prototype.argumentList = function () {
        return this._argumentList;
    };
    return ObjectCreationExpressionSyntax;
})(UnaryExpressionSyntax);
var SwitchStatementSyntax = (function (_super) {
    __extends(SwitchStatementSyntax, _super);
    function SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, caseClauses, closeBraceToken) {
        _super.call(this);
        if(switchKeyword.keywordKind() !== SyntaxKind.SwitchKeyword) {
            throw Errors.argument("switchKeyword");
        }
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(caseClauses === null) {
            throw Errors.argumentNull("caseClauses");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._switchKeyword = switchKeyword;
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._openBraceToken = openBraceToken;
        this._caseClauses = caseClauses;
        this._closeBraceToken = closeBraceToken;
    }
    SwitchStatementSyntax.prototype.kind = function () {
        return SyntaxKind.SwitchStatement;
    };
    SwitchStatementSyntax.prototype.switchKeyword = function () {
        return this._switchKeyword;
    };
    SwitchStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    SwitchStatementSyntax.prototype.expression = function () {
        return this._expression;
    };
    SwitchStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    SwitchStatementSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    SwitchStatementSyntax.prototype.caseClauses = function () {
        return this._caseClauses;
    };
    SwitchStatementSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return SwitchStatementSyntax;
})(StatementSyntax);
var SwitchClauseSyntax = (function (_super) {
    __extends(SwitchClauseSyntax, _super);
    function SwitchClauseSyntax(colonToken, statements) {
        _super.call(this);
        if(colonToken.kind() !== SyntaxKind.ColonToken) {
            throw Errors.argument("colonToken");
        }
        if(statements === null) {
            throw Errors.argumentNull("statements");
        }
        this._colonToken = colonToken;
        this._statements = statements;
    }
    SwitchClauseSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    SwitchClauseSyntax.prototype.statements = function () {
        return this._statements;
    };
    return SwitchClauseSyntax;
})(SyntaxNode);
var CaseSwitchClauseSyntax = (function (_super) {
    __extends(CaseSwitchClauseSyntax, _super);
    function CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements) {
        _super.call(this, colonToken, statements);
        if(caseKeyword.keywordKind() !== SyntaxKind.CaseKeyword) {
            throw Errors.argument("caseKeyword");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        this._caseKeyword = caseKeyword;
        this._expression = expression;
    }
    CaseSwitchClauseSyntax.prototype.kind = function () {
        return SyntaxKind.CaseSwitchClause;
    };
    CaseSwitchClauseSyntax.prototype.caseKeyword = function () {
        return this._caseKeyword;
    };
    CaseSwitchClauseSyntax.prototype.expression = function () {
        return this._expression;
    };
    return CaseSwitchClauseSyntax;
})(SwitchClauseSyntax);
var DefaultSwitchClauseSyntax = (function (_super) {
    __extends(DefaultSwitchClauseSyntax, _super);
    function DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements) {
        _super.call(this, colonToken, statements);
        if(defaultKeyword.keywordKind() !== SyntaxKind.DefaultKeyword) {
            throw Errors.argument("defaultKeyword");
        }
        this._defaultKeyword = defaultKeyword;
    }
    DefaultSwitchClauseSyntax.prototype.kind = function () {
        return SyntaxKind.DefaultSwitchClause;
    };
    DefaultSwitchClauseSyntax.prototype.defaultKeyword = function () {
        return this._defaultKeyword;
    };
    return DefaultSwitchClauseSyntax;
})(SwitchClauseSyntax);
var BreakStatementSyntax = (function (_super) {
    __extends(BreakStatementSyntax, _super);
    function BreakStatementSyntax(breakKeyword, identifier, semicolonToken) {
        _super.call(this);
        if(breakKeyword.keywordKind() !== SyntaxKind.BreakKeyword) {
            throw Errors.argument("breakKeyword");
        }
        if(identifier !== null && identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(semicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("semicolonToken");
        }
        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }
    BreakStatementSyntax.prototype.kind = function () {
        return SyntaxKind.BreakStatement;
    };
    BreakStatementSyntax.prototype.breakKeyword = function () {
        return this._breakKeyword;
    };
    BreakStatementSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    BreakStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return BreakStatementSyntax;
})(StatementSyntax);
var BaseForStatementSyntax = (function (_super) {
    __extends(BaseForStatementSyntax, _super);
    function BaseForStatementSyntax(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement) {
        _super.call(this);
        if(forKeyword.keywordKind() !== SyntaxKind.ForKeyword) {
            throw Errors.argument("forKeyword");
        }
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        if(statement === null) {
            throw Errors.argumentNull("statement");
        }
        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }
    BaseForStatementSyntax.prototype.forKeyword = function () {
        return this._forKeyword;
    };
    BaseForStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    BaseForStatementSyntax.prototype.variableDeclaration = function () {
        return this._variableDeclaration;
    };
    BaseForStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    BaseForStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    return BaseForStatementSyntax;
})(StatementSyntax);
var ForStatementSyntax = (function (_super) {
    __extends(ForStatementSyntax, _super);
    function ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
        _super.call(this, forKeyword, openParenToken, variableDeclaration, closeParenToken, statement);
        if(firstSemicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("firstSemicolonToken");
        }
        if(secondSemicolonToken.kind() !== SyntaxKind.SemicolonToken) {
            throw Errors.argument("secondSemicolonToken");
        }
        this._initializer = initializer;
        this._firstSemicolonToken = firstSemicolonToken;
        this._condition = condition;
        this._secondSemicolonToken = secondSemicolonToken;
        this._incrementor = incrementor;
    }
    ForStatementSyntax.prototype.kind = function () {
        return SyntaxKind.ForStatement;
    };
    ForStatementSyntax.prototype.initializer = function () {
        return this._initializer;
    };
    ForStatementSyntax.prototype.firstSemicolonToken = function () {
        return this._firstSemicolonToken;
    };
    ForStatementSyntax.prototype.condition = function () {
        return this._condition;
    };
    ForStatementSyntax.prototype.secondSemicolonToken = function () {
        return this._secondSemicolonToken;
    };
    ForStatementSyntax.prototype.incrementor = function () {
        return this._incrementor;
    };
    return ForStatementSyntax;
})(BaseForStatementSyntax);
var ForInStatementSyntax = (function (_super) {
    __extends(ForInStatementSyntax, _super);
    function ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement) {
        _super.call(this, forKeyword, openParenToken, variableDeclaration, closeParenToken, statement);
        if(inKeyword.keywordKind() !== SyntaxKind.InKeyword) {
            throw Errors.argument("inKeyword");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        this._left = left;
        this._inKeyword = inKeyword;
        this._expression = expression;
    }
    ForInStatementSyntax.prototype.kind = function () {
        return SyntaxKind.ForInStatement;
    };
    ForInStatementSyntax.prototype.left = function () {
        return this._left;
    };
    ForInStatementSyntax.prototype.inKeyword = function () {
        return this._inKeyword;
    };
    ForInStatementSyntax.prototype.expression = function () {
        return this._expression;
    };
    return ForInStatementSyntax;
})(BaseForStatementSyntax);
var EnumDeclarationSyntax = (function (_super) {
    __extends(EnumDeclarationSyntax, _super);
    function EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken) {
        _super.call(this);
        if(exportKeyword !== null && exportKeyword.keywordKind() !== SyntaxKind.ExportKeyword) {
            throw Errors.argument("exportKeyword");
        }
        if(enumKeyword.keywordKind() !== SyntaxKind.EnumKeyword) {
            throw Errors.argument("enumKeyword");
        }
        if(identifier.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("identifier");
        }
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(variableDeclarators === null) {
            throw Errors.argumentNull("variableDeclarators");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._exportKeyword = exportKeyword;
        this._enumKeyword = enumKeyword;
        this._identifier = identifier;
        this._openBraceToken = openBraceToken;
        this._variableDeclarators = variableDeclarators;
        this._closeBraceToken = closeBraceToken;
    }
    EnumDeclarationSyntax.prototype.kind = function () {
        return SyntaxKind.EnumDeclaration;
    };
    EnumDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    EnumDeclarationSyntax.prototype.enumKeyword = function () {
        return this._enumKeyword;
    };
    EnumDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    EnumDeclarationSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    EnumDeclarationSyntax.prototype.variableDeclarators = function () {
        return this._variableDeclarators;
    };
    EnumDeclarationSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return EnumDeclarationSyntax;
})(ModuleElementSyntax);
var CastExpressionSyntax = (function (_super) {
    __extends(CastExpressionSyntax, _super);
    function CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression) {
        _super.call(this);
        if(lessThanToken.kind() !== SyntaxKind.LessThanToken) {
            throw Errors.argument("lessThanToken");
        }
        if(type === null) {
            throw Errors.argumentNull("null");
        }
        if(greaterThanToken.kind() !== SyntaxKind.GreaterThanToken) {
            throw Errors.argument("greaterThanToken");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
    }
    CastExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.CastExpression;
    };
    CastExpressionSyntax.prototype.lessThanToken = function () {
        return this._lessThanToken;
    };
    CastExpressionSyntax.prototype.type = function () {
        return this._type;
    };
    CastExpressionSyntax.prototype.greaterThanToken = function () {
        return this._greaterThanToken;
    };
    CastExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    return CastExpressionSyntax;
})(UnaryExpressionSyntax);
var ObjectLiteralExpressionSyntax = (function (_super) {
    __extends(ObjectLiteralExpressionSyntax, _super);
    function ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken) {
        _super.call(this);
        if(openBraceToken.kind() !== SyntaxKind.OpenBraceToken) {
            throw Errors.argument("openBraceToken");
        }
        if(propertyAssignments === null) {
            throw Errors.argument("propertyAssignments");
        }
        if(closeBraceToken.kind() !== SyntaxKind.CloseBraceToken) {
            throw Errors.argument("closeBraceToken");
        }
        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
    }
    ObjectLiteralExpressionSyntax.prototype.kind = function () {
        return SyntaxKind.ObjectLiteralExpression;
    };
    ObjectLiteralExpressionSyntax.prototype.openBraceToken = function () {
        return this._openBraceToken;
    };
    ObjectLiteralExpressionSyntax.prototype.propertyAssignments = function () {
        return this._propertyAssignments;
    };
    ObjectLiteralExpressionSyntax.prototype.closeBraceToken = function () {
        return this._closeBraceToken;
    };
    return ObjectLiteralExpressionSyntax;
})(UnaryExpressionSyntax);
var PropertyAssignmentSyntax = (function (_super) {
    __extends(PropertyAssignmentSyntax, _super);
    function PropertyAssignmentSyntax(propertyName) {
        _super.call(this);
        if(propertyName.kind() !== SyntaxKind.IdentifierNameToken && propertyName.kind() !== SyntaxKind.StringLiteral && propertyName.kind() !== SyntaxKind.NumericLiteral) {
            throw Errors.argument("propertyName");
        }
        this._propertyName = propertyName;
    }
    PropertyAssignmentSyntax.prototype.propertyName = function () {
        return this._propertyName;
    };
    return PropertyAssignmentSyntax;
})(SyntaxNode);
var SimplePropertyAssignmentSyntax = (function (_super) {
    __extends(SimplePropertyAssignmentSyntax, _super);
    function SimplePropertyAssignmentSyntax(propertyName, colonToken, expression) {
        _super.call(this, propertyName);
        if(colonToken.kind() !== SyntaxKind.ColonToken) {
            throw Errors.argument("colonToken");
        }
        if(expression === null) {
            throw Errors.argumentNull("expression");
        }
        this._colonToken = colonToken;
        this._expression = expression;
    }
    SimplePropertyAssignmentSyntax.prototype.kind = function () {
        return SyntaxKind.SimplePropertyAssignment;
    };
    SimplePropertyAssignmentSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    SimplePropertyAssignmentSyntax.prototype.expression = function () {
        return this._expression;
    };
    return SimplePropertyAssignmentSyntax;
})(PropertyAssignmentSyntax);
var AccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(AccessorPropertyAssignmentSyntax, _super);
    function AccessorPropertyAssignmentSyntax(propertyName, openParenToken, closeParenToken, block) {
        _super.call(this, propertyName);
        if(openParenToken.kind() !== SyntaxKind.OpenParenToken) {
            throw Errors.argument("openParenToken");
        }
        if(closeParenToken.kind() !== SyntaxKind.CloseParenToken) {
            throw Errors.argument("closeParenToken");
        }
        if(block === null) {
            throw Errors.argumentNull("block");
        }
        this._openParenToken = openParenToken;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }
    AccessorPropertyAssignmentSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    AccessorPropertyAssignmentSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    AccessorPropertyAssignmentSyntax.prototype.block = function () {
        return this._block;
    };
    return AccessorPropertyAssignmentSyntax;
})(PropertyAssignmentSyntax);
var GetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(GetAccessorPropertyAssignmentSyntax, _super);
    function GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block) {
        _super.call(this, propertyName, openParenToken, closeParenToken, block);
        if(getKeyword.keywordKind() !== SyntaxKind.GetKeyword) {
            throw Errors.argument("getKeyword");
        }
        this._getKeyword = getKeyword;
    }
    GetAccessorPropertyAssignmentSyntax.prototype.getKeyword = function () {
        return this._getKeyword;
    };
    return GetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var SetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(SetAccessorPropertyAssignmentSyntax, _super);
    function SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
        _super.call(this, propertyName, openParenToken, closeParenToken, block);
        if(setKeyword.keywordKind() !== SyntaxKind.SetKeyword) {
            throw Errors.argument("setKeyword");
        }
        if(parameterName.kind() !== SyntaxKind.IdentifierNameToken) {
            throw Errors.argument("parameterName");
        }
        this._setKeyword = setKeyword;
        this._parameterName = parameterName;
    }
    SetAccessorPropertyAssignmentSyntax.prototype.setKeyword = function () {
        return this._setKeyword;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.parameterName = function () {
        return this._parameterName;
    };
    return SetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var SyntaxToken = (function () {
    function SyntaxToken() { }
    SyntaxToken.create = function create(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo, diagnostics) {
        return SyntaxToken.createStandardToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo, diagnostics);
    }
    SyntaxToken.toJSON = function toJSON(token) {
        var result = {
            kind: (SyntaxKind)._map[token.kind()]
        };
        if(token.keywordKind() != SyntaxKind.None) {
            result.keywordKind = (SyntaxKind)._map[token.keywordKind()];
        }
        result.start = token.start();
        if(token.fullStart() != token.start()) {
            result.fullStart = token.fullStart();
        }
        result.width = token.width();
        if(token.fullWidth() != token.width()) {
            result.fullWidth = token.fullWidth();
        }
        if(token.isMissing()) {
            result.isMissing = true;
        }
        result.text = token.text();
        if(token.value() !== null) {
            result.value() = token.value;
        }
        if(token.valueText() !== null) {
            result.valueText = token.valueText();
        }
        if(token.hasLeadingTrivia()) {
            result.hasLeadingTrivia = true;
        }
        if(token.hasLeadingCommentTrivia()) {
            result.hasLeadingCommentTrivia = true;
        }
        if(token.hasLeadingNewLineTrivia()) {
            result.hasLeadingNewLineTrivia = true;
        }
        if(token.hasTrailingTrivia()) {
            result.hasTrailingTrivia = true;
        }
        if(token.hasTrailingCommentTrivia()) {
            result.hasTrailingCommentTrivia = true;
        }
        if(token.hasTrailingNewLineTrivia()) {
            result.hasTrailingNewLineTrivia = true;
        }
        var diagnostics = token.diagnostics();
        if(diagnostics && diagnostics.length > 0) {
            result.diagnostics = diagnostics;
        }
        return result;
    }
    SyntaxToken.createStandardToken = function createStandardToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo, diagnostics) {
        var kind = tokenInfo.Kind;
        var keywordKind = tokenInfo.KeywordKind;
        var text = tokenInfo.Text == null ? SyntaxFacts.getText(kind) : tokenInfo.Text;
        Contract.throwIfNull(text);
        var leadingWidth = leadingTriviaInfo.Width;
        var trailingWidth = trailingTriviaInfo.Width;
        var leadingComment = leadingTriviaInfo.HasComment;
        var trailingComment = trailingTriviaInfo.HasComment;
        var leadingNewLine = leadingTriviaInfo.HasNewLine;
        var trailingNewLine = trailingTriviaInfo.HasNewLine;
        var token = null;
        token = {
            toJSON: function (key) {
                return SyntaxToken.toJSON(token);
            },
            kind: function () {
                return kind;
            },
            keywordKind: function () {
                return keywordKind;
            },
            fullStart: function () {
                return fullStart;
            },
            fullWidth: function () {
                return leadingWidth + text.length + trailingWidth;
            },
            start: function () {
                return fullStart + leadingWidth;
            },
            width: function () {
                return text.length;
            },
            isMissing: function () {
                return false;
            },
            text: function () {
                return text;
            },
            fullText: function (itext) {
                return itext.toString(new TextSpan(fullStart, leadingWidth)) + text + itext.toString(new TextSpan(fullStart + leadingWidth + text.length, trailingWidth));
            },
            value: function () {
                return null;
            },
            valueText: function () {
                return null;
            },
            diagnostics: function () {
                return diagnostics;
            },
            hasLeadingTrivia: function () {
                return leadingWidth > 0;
            },
            hasLeadingCommentTrivia: function () {
                return leadingComment;
            },
            hasLeadingNewLineTrivia: function () {
                return leadingNewLine;
            },
            hasTrailingTrivia: function () {
                return trailingWidth > 0;
            },
            hasTrailingCommentTrivia: function () {
                return trailingComment;
            },
            hasTrailingNewLineTrivia: function () {
                return trailingNewLine;
            },
            leadingTrivia: function (text) {
                throw Errors.notYetImplemented();
            },
            trailingTrivia: function (text) {
                throw Errors.notYetImplemented();
            }
        };
        return token;
    }
    SyntaxToken.createEmptyToken = function createEmptyToken(kind) {
        var token;
        token = {
            toJSON: function (key) {
                return SyntaxToken.toJSON(token);
            },
            kind: function () {
                return kind;
            },
            keywordKind: function () {
                return SyntaxKind.None;
            },
            fullStart: function () {
                return 0;
            },
            fullWidth: function () {
                return 0;
            },
            start: function () {
                return 0;
            },
            width: function () {
                return 0;
            },
            isMissing: function () {
                return true;
            },
            text: function () {
                return "";
            },
            fullText: function (itext) {
                return "";
            },
            value: function () {
                return null;
            },
            valueText: function () {
                return "";
            },
            diagnostics: function () {
                return [];
            },
            hasLeadingTrivia: function () {
                return false;
            },
            hasLeadingCommentTrivia: function () {
                return false;
            },
            hasLeadingNewLineTrivia: function () {
                return false;
            },
            hasTrailingTrivia: function () {
                return false;
            },
            hasTrailingCommentTrivia: function () {
                return false;
            },
            hasTrailingNewLineTrivia: function () {
                return false;
            },
            leadingTrivia: function (text) {
                return SyntaxTriviaList.empty;
            },
            trailingTrivia: function (text) {
                return SyntaxTriviaList.empty;
            }
        };
        return token;
    }
    return SyntaxToken;
})();
var SyntaxTree = (function () {
    function SyntaxTree() { }
    return SyntaxTree;
})();
var SyntaxTriviaList = (function () {
    function SyntaxTriviaList() { }
    SyntaxTriviaList.empty = {
        count: function () {
            return 0;
        },
        syntaxTriviaAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        }
    };
    SyntaxTriviaList.create = function create() {
        var trivia = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            trivia[_i] = arguments[_i + 0];
        }
        if(trivia === null || trivia.length === 0) {
            return SyntaxTriviaList.empty;
        }
        if(trivia.length === 1) {
            var item = trivia[0];
            return {
                count: function () {
                    return 1;
                },
                syntaxTriviaAt: function (index) {
                    if(index !== 0) {
                        throw Errors.argumentOutOfRange("index");
                    }
                    return item;
                }
            };
        }
        return {
            count: function () {
                return trivia.length;
            },
            syntaxTriviaAt: function (index) {
                if(index < 0 || index >= trivia.length) {
                    throw Errors.argumentOutOfRange("index");
                }
                return trivia[index];
            }
        };
    }
    return SyntaxTriviaList;
})();
var TextChangeRange = (function () {
    function TextChangeRange(span, newLength) {
        this._span = null;
        this._newLength = 0;
        if(newLength < 0) {
            throw Errors.argumentOutOfRange("newLength");
        }
        this._span = span;
        this._newLength = newLength;
    }
    TextChangeRange.prototype.span = function () {
        return this._span;
    };
    TextChangeRange.prototype.newLength = function () {
        return this._newLength;
    };
    TextChangeRange.collapse = function collapse(changes) {
        var diff = 0;
        var start = Constants.MaxInteger;
        var end = 0;
        for(var i = 0; i < changes.length; i++) {
            var change = changes[i];
            diff += change.newLength() - change.span().length();
            if(change.span().start() < start) {
                start = change.span().start();
            }
            if(change.span().end() > end) {
                end = change.span().end();
            }
        }
        if(start > end) {
            return null;
        }
        var combined = TextSpan.fromBounds(start, end);
        var newLen = combined.length() + diff;
        return new TextChangeRange(combined, newLen);
    }
    return TextChangeRange;
})();
var TextLine = (function () {
    function TextLine(text, body, lineBreakLength, lineNumber) {
        this._text = null;
        this._textSpan = null;
        Contract.throwIfNull(text);
        Contract.throwIfFalse(lineBreakLength >= 0);
        Contract.requires(lineNumber >= 0);
        this._text = text;
        this._textSpan = body;
        this._lineBreakLength = lineBreakLength;
        this._lineNumber = lineNumber;
    }
    TextLine.prototype.start = function () {
        return this._textSpan.start();
    };
    TextLine.prototype.end = function () {
        return this._textSpan.end();
    };
    TextLine.prototype.endIncludingLineBreak = function () {
        return this.end() + this._lineBreakLength;
    };
    TextLine.prototype.extent = function () {
        return this._textSpan;
    };
    TextLine.prototype.extentIncludingLineBreak = function () {
        return TextSpan.fromBounds(this.start(), this.endIncludingLineBreak());
    };
    TextLine.prototype.toString = function () {
        return this._text.toString(this._textSpan);
    };
    TextLine.prototype.lineNumber = function () {
        return this._lineNumber;
    };
    return TextLine;
})();
var TextSpan = (function () {
    function TextSpan(start, length) {
        this._start = 0;
        this._length = 0;
        if(start < 0) {
            Errors.argument("start");
        }
        if(start + length < start) {
            throw new Error("length");
        }
        this._start = start;
        this._length = length;
    }
    TextSpan.prototype.start = function () {
        return this._start;
    };
    TextSpan.prototype.length = function () {
        return this._length;
    };
    TextSpan.prototype.end = function () {
        return this._start + this._length;
    };
    TextSpan.prototype.isEmpty = function () {
        return this._length == 0;
    };
    TextSpan.prototype.containsPosition = function (position) {
        return position >= this._start && position < this.end();
    };
    TextSpan.prototype.containsTextSpan = function (span) {
        return span._start >= this._start && span.end() <= this.end();
    };
    TextSpan.prototype.overlapsWith = function (span) {
        var overlapStart = MathPrototype.max(this._start, span._start);
        var overlapEnd = MathPrototype.min(this.end(), span.end());
        return overlapStart < overlapEnd;
    };
    TextSpan.prototype.overlap = function (span) {
        var overlapStart = MathPrototype.max(this._start, span._start);
        var overlapEnd = MathPrototype.min(this.end(), span.end());
        if(overlapStart < overlapEnd) {
            return TextSpan.fromBounds(overlapStart, overlapEnd);
        }
        return null;
    };
    TextSpan.prototype.intersectsWithTextSpan = function (span) {
        return span._start <= this.end() && span.end() >= this._start;
    };
    TextSpan.prototype.intersectsWithPosition = function (position) {
        return position <= this.end() && position >= this._start;
    };
    TextSpan.prototype.intersection = function (span) {
        var intersectStart = MathPrototype.max(this._start, span._start);
        var intersectEnd = MathPrototype.min(this.end(), span.end());
        if(intersectStart <= intersectEnd) {
            return TextSpan.fromBounds(intersectStart, intersectEnd);
        }
        return null;
    };
    TextSpan.fromBounds = function fromBounds(start, end) {
        Contract.requires(start >= 0);
        Contract.requires(end - start >= 0);
        return new TextSpan(start, end - start);
    }
    return TextSpan;
})();
var LinebreakInfo = (function () {
    function LinebreakInfo(startPosition, length) {
        this.startPosition = startPosition;
        this.length = length;
    }
    return LinebreakInfo;
})();
var TextUtilities = (function () {
    function TextUtilities() { }
    TextUtilities.getStartAndLengthOfLineBreakEndingAt = function getStartAndLengthOfLineBreakEndingAt(text, index, info) {
        var c = text.charCodeAt(index);
        if(c === CharacterCodes.newLine) {
            if(index > 0 && text.charCodeAt(index - 1) === CharacterCodes.carriageReturn) {
                info.startPosition = index - 1;
                info.length = 2;
            } else {
                info.startPosition = index;
                info.length = 1;
            }
        } else {
            if(TextUtilities.isAnyLineBreakCharacter(c)) {
                info.startPosition = index;
                info.length = 1;
            } else {
                info.startPosition = index + 1;
                info.length = 0;
            }
        }
    }
    TextUtilities.isAnyLineBreakCharacter = function isAnyLineBreakCharacter(c) {
        return c === CharacterCodes.newLine || c === CharacterCodes.carriageReturn || c === CharacterCodes.nextLine || c === CharacterCodes.lineSeparator || c === CharacterCodes.paragraphSeparator;
    }
    TextUtilities.getLengthOfLineBreak = function getLengthOfLineBreak(text, index) {
        var c = text.charCodeAt(index);
        if(c > CharacterCodes.carriageReturn && c <= 127) {
            return 0;
        }
        return this.getLengthOfLineBreakSlow(text, index, c);
    }
    TextUtilities.getLengthOfLineBreakSlow = function getLengthOfLineBreakSlow(text, index, c) {
        if(c === CharacterCodes.carriageReturn) {
            var next = index + 1;
            return (next < text.length()) && CharacterCodes.newLine === text.charCodeAt(next) ? 2 : 1;
        } else {
            if(TextUtilities.isAnyLineBreakCharacter(c)) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    return TextUtilities;
})();
var Unicode = (function () {
    function Unicode() { }
    Unicode.unicodeES3IdentifierStart = [
        170, 
        170, 
        181, 
        181, 
        186, 
        186, 
        192, 
        214, 
        216, 
        246, 
        248, 
        543, 
        546, 
        563, 
        592, 
        685, 
        688, 
        696, 
        699, 
        705, 
        720, 
        721, 
        736, 
        740, 
        750, 
        750, 
        890, 
        890, 
        902, 
        902, 
        904, 
        906, 
        908, 
        908, 
        910, 
        929, 
        931, 
        974, 
        976, 
        983, 
        986, 
        1011, 
        1024, 
        1153, 
        1164, 
        1220, 
        1223, 
        1224, 
        1227, 
        1228, 
        1232, 
        1269, 
        1272, 
        1273, 
        1329, 
        1366, 
        1369, 
        1369, 
        1377, 
        1415, 
        1488, 
        1514, 
        1520, 
        1522, 
        1569, 
        1594, 
        1600, 
        1610, 
        1649, 
        1747, 
        1749, 
        1749, 
        1765, 
        1766, 
        1786, 
        1788, 
        1808, 
        1808, 
        1810, 
        1836, 
        1920, 
        1957, 
        2309, 
        2361, 
        2365, 
        2365, 
        2384, 
        2384, 
        2392, 
        2401, 
        2437, 
        2444, 
        2447, 
        2448, 
        2451, 
        2472, 
        2474, 
        2480, 
        2482, 
        2482, 
        2486, 
        2489, 
        2524, 
        2525, 
        2527, 
        2529, 
        2544, 
        2545, 
        2565, 
        2570, 
        2575, 
        2576, 
        2579, 
        2600, 
        2602, 
        2608, 
        2610, 
        2611, 
        2613, 
        2614, 
        2616, 
        2617, 
        2649, 
        2652, 
        2654, 
        2654, 
        2674, 
        2676, 
        2693, 
        2699, 
        2701, 
        2701, 
        2703, 
        2705, 
        2707, 
        2728, 
        2730, 
        2736, 
        2738, 
        2739, 
        2741, 
        2745, 
        2749, 
        2749, 
        2768, 
        2768, 
        2784, 
        2784, 
        2821, 
        2828, 
        2831, 
        2832, 
        2835, 
        2856, 
        2858, 
        2864, 
        2866, 
        2867, 
        2870, 
        2873, 
        2877, 
        2877, 
        2908, 
        2909, 
        2911, 
        2913, 
        2949, 
        2954, 
        2958, 
        2960, 
        2962, 
        2965, 
        2969, 
        2970, 
        2972, 
        2972, 
        2974, 
        2975, 
        2979, 
        2980, 
        2984, 
        2986, 
        2990, 
        2997, 
        2999, 
        3001, 
        3077, 
        3084, 
        3086, 
        3088, 
        3090, 
        3112, 
        3114, 
        3123, 
        3125, 
        3129, 
        3168, 
        3169, 
        3205, 
        3212, 
        3214, 
        3216, 
        3218, 
        3240, 
        3242, 
        3251, 
        3253, 
        3257, 
        3294, 
        3294, 
        3296, 
        3297, 
        3333, 
        3340, 
        3342, 
        3344, 
        3346, 
        3368, 
        3370, 
        3385, 
        3424, 
        3425, 
        3461, 
        3478, 
        3482, 
        3505, 
        3507, 
        3515, 
        3517, 
        3517, 
        3520, 
        3526, 
        3585, 
        3632, 
        3634, 
        3635, 
        3648, 
        3654, 
        3713, 
        3714, 
        3716, 
        3716, 
        3719, 
        3720, 
        3722, 
        3722, 
        3725, 
        3725, 
        3732, 
        3735, 
        3737, 
        3743, 
        3745, 
        3747, 
        3749, 
        3749, 
        3751, 
        3751, 
        3754, 
        3755, 
        3757, 
        3760, 
        3762, 
        3763, 
        3773, 
        3773, 
        3776, 
        3780, 
        3782, 
        3782, 
        3804, 
        3805, 
        3840, 
        3840, 
        3904, 
        3911, 
        3913, 
        3946, 
        3976, 
        3979, 
        4096, 
        4129, 
        4131, 
        4135, 
        4137, 
        4138, 
        4176, 
        4181, 
        4256, 
        4293, 
        4304, 
        4342, 
        4352, 
        4441, 
        4447, 
        4514, 
        4520, 
        4601, 
        4608, 
        4614, 
        4616, 
        4678, 
        4680, 
        4680, 
        4682, 
        4685, 
        4688, 
        4694, 
        4696, 
        4696, 
        4698, 
        4701, 
        4704, 
        4742, 
        4744, 
        4744, 
        4746, 
        4749, 
        4752, 
        4782, 
        4784, 
        4784, 
        4786, 
        4789, 
        4792, 
        4798, 
        4800, 
        4800, 
        4802, 
        4805, 
        4808, 
        4814, 
        4816, 
        4822, 
        4824, 
        4846, 
        4848, 
        4878, 
        4880, 
        4880, 
        4882, 
        4885, 
        4888, 
        4894, 
        4896, 
        4934, 
        4936, 
        4954, 
        5024, 
        5108, 
        5121, 
        5740, 
        5743, 
        5750, 
        5761, 
        5786, 
        5792, 
        5866, 
        6016, 
        6067, 
        6176, 
        6263, 
        6272, 
        6312, 
        7680, 
        7835, 
        7840, 
        7929, 
        7936, 
        7957, 
        7960, 
        7965, 
        7968, 
        8005, 
        8008, 
        8013, 
        8016, 
        8023, 
        8025, 
        8025, 
        8027, 
        8027, 
        8029, 
        8029, 
        8031, 
        8061, 
        8064, 
        8116, 
        8118, 
        8124, 
        8126, 
        8126, 
        8130, 
        8132, 
        8134, 
        8140, 
        8144, 
        8147, 
        8150, 
        8155, 
        8160, 
        8172, 
        8178, 
        8180, 
        8182, 
        8188, 
        8319, 
        8319, 
        8450, 
        8450, 
        8455, 
        8455, 
        8458, 
        8467, 
        8469, 
        8469, 
        8473, 
        8477, 
        8484, 
        8484, 
        8486, 
        8486, 
        8488, 
        8488, 
        8490, 
        8493, 
        8495, 
        8497, 
        8499, 
        8505, 
        8544, 
        8579, 
        12293, 
        12295, 
        12321, 
        12329, 
        12337, 
        12341, 
        12344, 
        12346, 
        12353, 
        12436, 
        12445, 
        12446, 
        12449, 
        12538, 
        12540, 
        12542, 
        12549, 
        12588, 
        12593, 
        12686, 
        12704, 
        12727, 
        13312, 
        13312, 
        19893, 
        19893, 
        19968, 
        19968, 
        40869, 
        40869, 
        40960, 
        42124, 
        44032, 
        44032, 
        55203, 
        55203, 
        63744, 
        64045, 
        64256, 
        64262, 
        64275, 
        64279, 
        64285, 
        64285, 
        64287, 
        64296, 
        64298, 
        64310, 
        64312, 
        64316, 
        64318, 
        64318, 
        64320, 
        64321, 
        64323, 
        64324, 
        64326, 
        64433, 
        64467, 
        64829, 
        64848, 
        64911, 
        64914, 
        64967, 
        65008, 
        65019, 
        65136, 
        65138, 
        65140, 
        65140, 
        65142, 
        65276, 
        65313, 
        65338, 
        65345, 
        65370, 
        65382, 
        65470, 
        65474, 
        65479, 
        65482, 
        65487, 
        65490, 
        65495, 
        65498, 
        65500
    ];
    Unicode.unicodeES3IdentifierPart = [
        768, 
        846, 
        864, 
        866, 
        1155, 
        1158, 
        1425, 
        1441, 
        1443, 
        1465, 
        1467, 
        1469, 
        1471, 
        1471, 
        1473, 
        1474, 
        1476, 
        1476, 
        1611, 
        1621, 
        1632, 
        1641, 
        1648, 
        1648, 
        1750, 
        1756, 
        1759, 
        1764, 
        1767, 
        1768, 
        1770, 
        1773, 
        1776, 
        1785, 
        1809, 
        1809, 
        1840, 
        1866, 
        1958, 
        1968, 
        2305, 
        2307, 
        2364, 
        2364, 
        2366, 
        2381, 
        2385, 
        2388, 
        2402, 
        2403, 
        2406, 
        2415, 
        2433, 
        2435, 
        2492, 
        2492, 
        2494, 
        2500, 
        2503, 
        2504, 
        2507, 
        2509, 
        2519, 
        2519, 
        2530, 
        2531, 
        2534, 
        2543, 
        2562, 
        2562, 
        2620, 
        2620, 
        2622, 
        2626, 
        2631, 
        2632, 
        2635, 
        2637, 
        2662, 
        2673, 
        2689, 
        2691, 
        2748, 
        2748, 
        2750, 
        2757, 
        2759, 
        2761, 
        2763, 
        2765, 
        2790, 
        2799, 
        2817, 
        2819, 
        2876, 
        2876, 
        2878, 
        2883, 
        2887, 
        2888, 
        2891, 
        2893, 
        2902, 
        2903, 
        2918, 
        2927, 
        2946, 
        2947, 
        3006, 
        3010, 
        3014, 
        3016, 
        3018, 
        3021, 
        3031, 
        3031, 
        3047, 
        3055, 
        3073, 
        3075, 
        3134, 
        3140, 
        3142, 
        3144, 
        3146, 
        3149, 
        3157, 
        3158, 
        3174, 
        3183, 
        3202, 
        3203, 
        3262, 
        3268, 
        3270, 
        3272, 
        3274, 
        3277, 
        3285, 
        3286, 
        3302, 
        3311, 
        3330, 
        3331, 
        3390, 
        3395, 
        3398, 
        3400, 
        3402, 
        3405, 
        3415, 
        3415, 
        3430, 
        3439, 
        3458, 
        3459, 
        3530, 
        3530, 
        3535, 
        3540, 
        3542, 
        3542, 
        3544, 
        3551, 
        3570, 
        3571, 
        3633, 
        3633, 
        3636, 
        3642, 
        3655, 
        3662, 
        3664, 
        3673, 
        3761, 
        3761, 
        3764, 
        3769, 
        3771, 
        3772, 
        3784, 
        3789, 
        3792, 
        3801, 
        3864, 
        3865, 
        3872, 
        3881, 
        3893, 
        3893, 
        3895, 
        3895, 
        3897, 
        3897, 
        3902, 
        3903, 
        3953, 
        3972, 
        3974, 
        3975, 
        3984, 
        3991, 
        3993, 
        4028, 
        4038, 
        4038, 
        4140, 
        4146, 
        4150, 
        4153, 
        4160, 
        4169, 
        4182, 
        4185, 
        4969, 
        4977, 
        6068, 
        6099, 
        6112, 
        6121, 
        6160, 
        6169, 
        6313, 
        6313, 
        8255, 
        8256, 
        8400, 
        8412, 
        8417, 
        8417, 
        12330, 
        12335, 
        12441, 
        12442, 
        12539, 
        12539, 
        64286, 
        64286, 
        65056, 
        65059, 
        65075, 
        65076, 
        65101, 
        65103, 
        65296, 
        65305, 
        65343, 
        65343, 
        65381, 
        65381
    ];
    Unicode.unicodeES5IdentifierStart = [
        170, 
        170, 
        181, 
        181, 
        186, 
        186, 
        192, 
        214, 
        216, 
        246, 
        248, 
        705, 
        710, 
        721, 
        736, 
        740, 
        748, 
        748, 
        750, 
        750, 
        880, 
        884, 
        886, 
        887, 
        890, 
        893, 
        902, 
        902, 
        904, 
        906, 
        908, 
        908, 
        910, 
        929, 
        931, 
        1013, 
        1015, 
        1153, 
        1162, 
        1319, 
        1329, 
        1366, 
        1369, 
        1369, 
        1377, 
        1415, 
        1488, 
        1514, 
        1520, 
        1522, 
        1568, 
        1610, 
        1646, 
        1647, 
        1649, 
        1747, 
        1749, 
        1749, 
        1765, 
        1766, 
        1774, 
        1775, 
        1786, 
        1788, 
        1791, 
        1791, 
        1808, 
        1808, 
        1810, 
        1839, 
        1869, 
        1957, 
        1969, 
        1969, 
        1994, 
        2026, 
        2036, 
        2037, 
        2042, 
        2042, 
        2048, 
        2069, 
        2074, 
        2074, 
        2084, 
        2084, 
        2088, 
        2088, 
        2112, 
        2136, 
        2208, 
        2208, 
        2210, 
        2220, 
        2308, 
        2361, 
        2365, 
        2365, 
        2384, 
        2384, 
        2392, 
        2401, 
        2417, 
        2423, 
        2425, 
        2431, 
        2437, 
        2444, 
        2447, 
        2448, 
        2451, 
        2472, 
        2474, 
        2480, 
        2482, 
        2482, 
        2486, 
        2489, 
        2493, 
        2493, 
        2510, 
        2510, 
        2524, 
        2525, 
        2527, 
        2529, 
        2544, 
        2545, 
        2565, 
        2570, 
        2575, 
        2576, 
        2579, 
        2600, 
        2602, 
        2608, 
        2610, 
        2611, 
        2613, 
        2614, 
        2616, 
        2617, 
        2649, 
        2652, 
        2654, 
        2654, 
        2674, 
        2676, 
        2693, 
        2701, 
        2703, 
        2705, 
        2707, 
        2728, 
        2730, 
        2736, 
        2738, 
        2739, 
        2741, 
        2745, 
        2749, 
        2749, 
        2768, 
        2768, 
        2784, 
        2785, 
        2821, 
        2828, 
        2831, 
        2832, 
        2835, 
        2856, 
        2858, 
        2864, 
        2866, 
        2867, 
        2869, 
        2873, 
        2877, 
        2877, 
        2908, 
        2909, 
        2911, 
        2913, 
        2929, 
        2929, 
        2947, 
        2947, 
        2949, 
        2954, 
        2958, 
        2960, 
        2962, 
        2965, 
        2969, 
        2970, 
        2972, 
        2972, 
        2974, 
        2975, 
        2979, 
        2980, 
        2984, 
        2986, 
        2990, 
        3001, 
        3024, 
        3024, 
        3077, 
        3084, 
        3086, 
        3088, 
        3090, 
        3112, 
        3114, 
        3123, 
        3125, 
        3129, 
        3133, 
        3133, 
        3160, 
        3161, 
        3168, 
        3169, 
        3205, 
        3212, 
        3214, 
        3216, 
        3218, 
        3240, 
        3242, 
        3251, 
        3253, 
        3257, 
        3261, 
        3261, 
        3294, 
        3294, 
        3296, 
        3297, 
        3313, 
        3314, 
        3333, 
        3340, 
        3342, 
        3344, 
        3346, 
        3386, 
        3389, 
        3389, 
        3406, 
        3406, 
        3424, 
        3425, 
        3450, 
        3455, 
        3461, 
        3478, 
        3482, 
        3505, 
        3507, 
        3515, 
        3517, 
        3517, 
        3520, 
        3526, 
        3585, 
        3632, 
        3634, 
        3635, 
        3648, 
        3654, 
        3713, 
        3714, 
        3716, 
        3716, 
        3719, 
        3720, 
        3722, 
        3722, 
        3725, 
        3725, 
        3732, 
        3735, 
        3737, 
        3743, 
        3745, 
        3747, 
        3749, 
        3749, 
        3751, 
        3751, 
        3754, 
        3755, 
        3757, 
        3760, 
        3762, 
        3763, 
        3773, 
        3773, 
        3776, 
        3780, 
        3782, 
        3782, 
        3804, 
        3807, 
        3840, 
        3840, 
        3904, 
        3911, 
        3913, 
        3948, 
        3976, 
        3980, 
        4096, 
        4138, 
        4159, 
        4159, 
        4176, 
        4181, 
        4186, 
        4189, 
        4193, 
        4193, 
        4197, 
        4198, 
        4206, 
        4208, 
        4213, 
        4225, 
        4238, 
        4238, 
        4256, 
        4293, 
        4295, 
        4295, 
        4301, 
        4301, 
        4304, 
        4346, 
        4348, 
        4680, 
        4682, 
        4685, 
        4688, 
        4694, 
        4696, 
        4696, 
        4698, 
        4701, 
        4704, 
        4744, 
        4746, 
        4749, 
        4752, 
        4784, 
        4786, 
        4789, 
        4792, 
        4798, 
        4800, 
        4800, 
        4802, 
        4805, 
        4808, 
        4822, 
        4824, 
        4880, 
        4882, 
        4885, 
        4888, 
        4954, 
        4992, 
        5007, 
        5024, 
        5108, 
        5121, 
        5740, 
        5743, 
        5759, 
        5761, 
        5786, 
        5792, 
        5866, 
        5870, 
        5872, 
        5888, 
        5900, 
        5902, 
        5905, 
        5920, 
        5937, 
        5952, 
        5969, 
        5984, 
        5996, 
        5998, 
        6000, 
        6016, 
        6067, 
        6103, 
        6103, 
        6108, 
        6108, 
        6176, 
        6263, 
        6272, 
        6312, 
        6314, 
        6314, 
        6320, 
        6389, 
        6400, 
        6428, 
        6480, 
        6509, 
        6512, 
        6516, 
        6528, 
        6571, 
        6593, 
        6599, 
        6656, 
        6678, 
        6688, 
        6740, 
        6823, 
        6823, 
        6917, 
        6963, 
        6981, 
        6987, 
        7043, 
        7072, 
        7086, 
        7087, 
        7098, 
        7141, 
        7168, 
        7203, 
        7245, 
        7247, 
        7258, 
        7293, 
        7401, 
        7404, 
        7406, 
        7409, 
        7413, 
        7414, 
        7424, 
        7615, 
        7680, 
        7957, 
        7960, 
        7965, 
        7968, 
        8005, 
        8008, 
        8013, 
        8016, 
        8023, 
        8025, 
        8025, 
        8027, 
        8027, 
        8029, 
        8029, 
        8031, 
        8061, 
        8064, 
        8116, 
        8118, 
        8124, 
        8126, 
        8126, 
        8130, 
        8132, 
        8134, 
        8140, 
        8144, 
        8147, 
        8150, 
        8155, 
        8160, 
        8172, 
        8178, 
        8180, 
        8182, 
        8188, 
        8305, 
        8305, 
        8319, 
        8319, 
        8336, 
        8348, 
        8450, 
        8450, 
        8455, 
        8455, 
        8458, 
        8467, 
        8469, 
        8469, 
        8473, 
        8477, 
        8484, 
        8484, 
        8486, 
        8486, 
        8488, 
        8488, 
        8490, 
        8493, 
        8495, 
        8505, 
        8508, 
        8511, 
        8517, 
        8521, 
        8526, 
        8526, 
        8544, 
        8584, 
        11264, 
        11310, 
        11312, 
        11358, 
        11360, 
        11492, 
        11499, 
        11502, 
        11506, 
        11507, 
        11520, 
        11557, 
        11559, 
        11559, 
        11565, 
        11565, 
        11568, 
        11623, 
        11631, 
        11631, 
        11648, 
        11670, 
        11680, 
        11686, 
        11688, 
        11694, 
        11696, 
        11702, 
        11704, 
        11710, 
        11712, 
        11718, 
        11720, 
        11726, 
        11728, 
        11734, 
        11736, 
        11742, 
        11823, 
        11823, 
        12293, 
        12295, 
        12321, 
        12329, 
        12337, 
        12341, 
        12344, 
        12348, 
        12353, 
        12438, 
        12445, 
        12447, 
        12449, 
        12538, 
        12540, 
        12543, 
        12549, 
        12589, 
        12593, 
        12686, 
        12704, 
        12730, 
        12784, 
        12799, 
        13312, 
        13312, 
        19893, 
        19893, 
        19968, 
        19968, 
        40908, 
        40908, 
        40960, 
        42124, 
        42192, 
        42237, 
        42240, 
        42508, 
        42512, 
        42527, 
        42538, 
        42539, 
        42560, 
        42606, 
        42623, 
        42647, 
        42656, 
        42735, 
        42775, 
        42783, 
        42786, 
        42888, 
        42891, 
        42894, 
        42896, 
        42899, 
        42912, 
        42922, 
        43000, 
        43009, 
        43011, 
        43013, 
        43015, 
        43018, 
        43020, 
        43042, 
        43072, 
        43123, 
        43138, 
        43187, 
        43250, 
        43255, 
        43259, 
        43259, 
        43274, 
        43301, 
        43312, 
        43334, 
        43360, 
        43388, 
        43396, 
        43442, 
        43471, 
        43471, 
        43520, 
        43560, 
        43584, 
        43586, 
        43588, 
        43595, 
        43616, 
        43638, 
        43642, 
        43642, 
        43648, 
        43695, 
        43697, 
        43697, 
        43701, 
        43702, 
        43705, 
        43709, 
        43712, 
        43712, 
        43714, 
        43714, 
        43739, 
        43741, 
        43744, 
        43754, 
        43762, 
        43764, 
        43777, 
        43782, 
        43785, 
        43790, 
        43793, 
        43798, 
        43808, 
        43814, 
        43816, 
        43822, 
        43968, 
        44002, 
        44032, 
        44032, 
        55203, 
        55203, 
        55216, 
        55238, 
        55243, 
        55291, 
        63744, 
        64109, 
        64112, 
        64217, 
        64256, 
        64262, 
        64275, 
        64279, 
        64285, 
        64285, 
        64287, 
        64296, 
        64298, 
        64310, 
        64312, 
        64316, 
        64318, 
        64318, 
        64320, 
        64321, 
        64323, 
        64324, 
        64326, 
        64433, 
        64467, 
        64829, 
        64848, 
        64911, 
        64914, 
        64967, 
        65008, 
        65019, 
        65136, 
        65140, 
        65142, 
        65276, 
        65313, 
        65338, 
        65345, 
        65370, 
        65382, 
        65470, 
        65474, 
        65479, 
        65482, 
        65487, 
        65490, 
        65495, 
        65498, 
        65500
    ];
    Unicode.unicodeES5IdentifierPart = [
        768, 
        879, 
        1155, 
        1159, 
        1425, 
        1469, 
        1471, 
        1471, 
        1473, 
        1474, 
        1476, 
        1477, 
        1479, 
        1479, 
        1552, 
        1562, 
        1611, 
        1641, 
        1648, 
        1648, 
        1750, 
        1756, 
        1759, 
        1764, 
        1767, 
        1768, 
        1770, 
        1773, 
        1776, 
        1785, 
        1809, 
        1809, 
        1840, 
        1866, 
        1958, 
        1968, 
        1984, 
        1993, 
        2027, 
        2035, 
        2070, 
        2073, 
        2075, 
        2083, 
        2085, 
        2087, 
        2089, 
        2093, 
        2137, 
        2139, 
        2276, 
        2302, 
        2304, 
        2307, 
        2362, 
        2364, 
        2366, 
        2383, 
        2385, 
        2391, 
        2402, 
        2403, 
        2406, 
        2415, 
        2433, 
        2435, 
        2492, 
        2492, 
        2494, 
        2500, 
        2503, 
        2504, 
        2507, 
        2509, 
        2519, 
        2519, 
        2530, 
        2531, 
        2534, 
        2543, 
        2561, 
        2563, 
        2620, 
        2620, 
        2622, 
        2626, 
        2631, 
        2632, 
        2635, 
        2637, 
        2641, 
        2641, 
        2662, 
        2673, 
        2677, 
        2677, 
        2689, 
        2691, 
        2748, 
        2748, 
        2750, 
        2757, 
        2759, 
        2761, 
        2763, 
        2765, 
        2786, 
        2787, 
        2790, 
        2799, 
        2817, 
        2819, 
        2876, 
        2876, 
        2878, 
        2884, 
        2887, 
        2888, 
        2891, 
        2893, 
        2902, 
        2903, 
        2914, 
        2915, 
        2918, 
        2927, 
        2946, 
        2946, 
        3006, 
        3010, 
        3014, 
        3016, 
        3018, 
        3021, 
        3031, 
        3031, 
        3046, 
        3055, 
        3073, 
        3075, 
        3134, 
        3140, 
        3142, 
        3144, 
        3146, 
        3149, 
        3157, 
        3158, 
        3170, 
        3171, 
        3174, 
        3183, 
        3202, 
        3203, 
        3260, 
        3260, 
        3262, 
        3268, 
        3270, 
        3272, 
        3274, 
        3277, 
        3285, 
        3286, 
        3298, 
        3299, 
        3302, 
        3311, 
        3330, 
        3331, 
        3390, 
        3396, 
        3398, 
        3400, 
        3402, 
        3405, 
        3415, 
        3415, 
        3426, 
        3427, 
        3430, 
        3439, 
        3458, 
        3459, 
        3530, 
        3530, 
        3535, 
        3540, 
        3542, 
        3542, 
        3544, 
        3551, 
        3570, 
        3571, 
        3633, 
        3633, 
        3636, 
        3642, 
        3655, 
        3662, 
        3664, 
        3673, 
        3761, 
        3761, 
        3764, 
        3769, 
        3771, 
        3772, 
        3784, 
        3789, 
        3792, 
        3801, 
        3864, 
        3865, 
        3872, 
        3881, 
        3893, 
        3893, 
        3895, 
        3895, 
        3897, 
        3897, 
        3902, 
        3903, 
        3953, 
        3972, 
        3974, 
        3975, 
        3981, 
        3991, 
        3993, 
        4028, 
        4038, 
        4038, 
        4139, 
        4158, 
        4160, 
        4169, 
        4182, 
        4185, 
        4190, 
        4192, 
        4194, 
        4196, 
        4199, 
        4205, 
        4209, 
        4212, 
        4226, 
        4237, 
        4239, 
        4253, 
        4957, 
        4959, 
        5906, 
        5908, 
        5938, 
        5940, 
        5970, 
        5971, 
        6002, 
        6003, 
        6068, 
        6099, 
        6109, 
        6109, 
        6112, 
        6121, 
        6155, 
        6157, 
        6160, 
        6169, 
        6313, 
        6313, 
        6432, 
        6443, 
        6448, 
        6459, 
        6470, 
        6479, 
        6576, 
        6592, 
        6600, 
        6601, 
        6608, 
        6617, 
        6679, 
        6683, 
        6741, 
        6750, 
        6752, 
        6780, 
        6783, 
        6793, 
        6800, 
        6809, 
        6912, 
        6916, 
        6964, 
        6980, 
        6992, 
        7001, 
        7019, 
        7027, 
        7040, 
        7042, 
        7073, 
        7085, 
        7088, 
        7097, 
        7142, 
        7155, 
        7204, 
        7223, 
        7232, 
        7241, 
        7248, 
        7257, 
        7376, 
        7378, 
        7380, 
        7400, 
        7405, 
        7405, 
        7410, 
        7412, 
        7616, 
        7654, 
        7676, 
        7679, 
        8204, 
        8205, 
        8255, 
        8256, 
        8276, 
        8276, 
        8400, 
        8412, 
        8417, 
        8417, 
        8421, 
        8432, 
        11503, 
        11505, 
        11647, 
        11647, 
        11744, 
        11775, 
        12330, 
        12335, 
        12441, 
        12442, 
        42528, 
        42537, 
        42607, 
        42607, 
        42612, 
        42621, 
        42655, 
        42655, 
        42736, 
        42737, 
        43010, 
        43010, 
        43014, 
        43014, 
        43019, 
        43019, 
        43043, 
        43047, 
        43136, 
        43137, 
        43188, 
        43204, 
        43216, 
        43225, 
        43232, 
        43249, 
        43264, 
        43273, 
        43302, 
        43309, 
        43335, 
        43347, 
        43392, 
        43395, 
        43443, 
        43456, 
        43472, 
        43481, 
        43561, 
        43574, 
        43587, 
        43587, 
        43596, 
        43597, 
        43600, 
        43609, 
        43643, 
        43643, 
        43696, 
        43696, 
        43698, 
        43700, 
        43703, 
        43704, 
        43710, 
        43711, 
        43713, 
        43713, 
        43755, 
        43759, 
        43765, 
        43766, 
        44003, 
        44010, 
        44012, 
        44013, 
        44016, 
        44025, 
        64286, 
        64286, 
        65024, 
        65039, 
        65056, 
        65062, 
        65075, 
        65076, 
        65101, 
        65103, 
        65296, 
        65305, 
        65343, 
        65343
    ];
    Unicode.lookupInUnicodeMap = function lookupInUnicodeMap(code, map) {
        if(code < map[0]) {
            return false;
        }
        var lo = 0;
        var hi = map.length;
        var mid;
        while(lo + 1 < hi) {
            mid = lo + (hi - lo) / 2;
            mid -= mid % 2;
            if(map[mid] <= code && code <= map[mid + 1]) {
                return true;
            }
            if(code < map[mid]) {
                hi = mid;
            } else {
                lo = mid + 2;
            }
        }
        return false;
    }
    Unicode.isIdentifierStart = function isIdentifierStart(code, languageVersion) {
        if(languageVersion === LanguageVersion.EcmaScript3) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES3IdentifierStart);
        } else {
            if(languageVersion === LanguageVersion.EcmaScript5) {
                return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES5IdentifierStart);
            } else {
                throw Errors.argumentOutOfRange("languageVersion");
            }
        }
    }
    Unicode.isIdentifierPart = function isIdentifierPart(code, languageVersion) {
        if(languageVersion === LanguageVersion.EcmaScript3) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES3IdentifierPart);
        } else {
            if(languageVersion === LanguageVersion.EcmaScript5) {
                return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES5IdentifierPart);
            } else {
                throw Errors.argumentOutOfRange("languageVersion");
            }
        }
    }
    return Unicode;
})();
var ArrayUtilities = (function () {
    function ArrayUtilities() { }
    ArrayUtilities.binarySearch = function binarySearch(array, value) {
        var low = 0;
        var high = array.length - 1;
        while(low <= high) {
            var middle = low + ((high - low) >> 1);
            var midValue = array[middle];
            if(midValue === value) {
                return middle;
            } else {
                if(midValue > value) {
                    high = middle - 1;
                } else {
                    low = middle + 1;
                }
            }
        }
        return ~low;
    }
    ArrayUtilities.createArray = function createArray(length) {
        var result = [];
        for(var i = 0; i < length; i++) {
            result.push(null);
        }
        return result;
    }
    ArrayUtilities.copy = function copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
        for(var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    }
    return ArrayUtilities;
})();
var Program = (function () {
    function Program() { }
    Program.prototype.runAllTests = function (environment) {
        var _this = this;
        environment.standardOut.WriteLine("");
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript5", function (filePath) {
            return _this.runScannerTest(environment, filePath, LanguageVersion.EcmaScript5);
        });
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript3", function (filePath) {
            return _this.runScannerTest(environment, filePath, LanguageVersion.EcmaScript3);
        });
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript5", function (filePath) {
            return _this.runParserTest(environment, filePath, LanguageVersion.EcmaScript5);
        });
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript3", function (filePath) {
            return _this.runParserTest(environment, filePath, LanguageVersion.EcmaScript3);
        });
        environment.standardOut.WriteLine("");
    };
    Program.prototype.runTests = function (environment, path, action) {
        var testFiles = environment.listFiles(path);
        for(var index in testFiles) {
            var filePath = testFiles[index];
            action(filePath);
        }
    };
    Program.prototype.runParserTest = function (environment, filePath, languageVersion) {
        if(!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }
        environment.standardOut.WriteLine("Testing Parser: " + filePath);
        var contents = environment.readFile(filePath);
        var text = new StringText(contents);
        var scanner = Scanner.create(text, languageVersion);
        var parser = new Parser(scanner);
        var sourceUnit = parser.parseSourceUnit();
        var actualResult = JSON2.stringify(sourceUnit, null, 4);
        var expectedFile = filePath + ".expected";
        var actualFile = filePath + ".actual";
        var expectedResult = environment.readFile(expectedFile);
        if(expectedResult !== actualResult) {
            environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
            environment.writeFile(actualFile, actualResult);
        }
    };
    Program.prototype.runScannerTest = function (environment, filePath, languageVersion) {
        if(!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }
        environment.standardOut.WriteLine("Testing Scanner: " + filePath);
        var contents = environment.readFile(filePath);
        var text = new StringText(contents);
        var scanner = Scanner.create(text, languageVersion);
        var tokens = [];
        while(true) {
            var token = scanner.scan();
            tokens.push(token);
            if(token.kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
        }
        var actualResult = JSON2.stringify(tokens, null, 4);
        var expectedFile = filePath + ".expected";
        var actualFile = filePath + ".actual";
        var expectedResult = environment.readFile(expectedFile);
        if(expectedResult !== actualResult) {
            environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
            environment.writeFile(actualFile, actualResult);
        }
    };
    Program.prototype.run = function (environment) {
        if(true) {
            for(var index in environment.arguments) {
                var filePath = environment.arguments[index];
                environment.standardOut.WriteLine("Parsing: " + filePath);
                this.runParser(environment, environment.readFile(filePath), filePath);
            }
        }
        for(var index in environment.arguments) {
            var filePath = environment.arguments[index];
            environment.standardOut.WriteLine("Tokenizing: " + filePath);
            this.runScanner(environment, environment.readFile(filePath));
        }
    };
    Program.prototype.runParser = function (environment, contents, filePath) {
        var text = new StringText(contents);
        var scanner = Scanner.create(text, LanguageVersion.EcmaScript5);
        var parser = new Parser(scanner);
        if(StringUtilities.endsWith(filePath, ".ts")) {
            var unit = parser.parseSourceUnit();
            var json = JSON2.stringify(unit);
        } else {
            environment.standardOut.WriteLine("skipping unknown file file.");
        }
    };
    Program.prototype.runScanner = function (environment, contents) {
        var text = new StringText(contents);
        var scanner = Scanner.create(text, LanguageVersion.EcmaScript5);
        var tokens = [];
        var textArray = [];
        while(true) {
            var token = scanner.scan();
            tokens.push(token);
            if(token.kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
            if(token.diagnostics()) {
                throw new Error("Error parsing!");
            }
            var tokenText = token.text();
            var tokenFullText = token.fullText(text);
            textArray.push(tokenFullText);
            if(tokenFullText.substr(token.start() - token.fullStart(), token.width()) !== tokenText) {
                throw new Error("Token invariant broken!");
            }
        }
        environment.standardOut.WriteLine("Token Count: " + tokens.length);
        var fullText = textArray.join("");
        if(contents !== fullText) {
            throw new Error("Full text didn't match!");
        }
    };
    return Program;
})();
var program = new Program();
program.runAllTests(Environment);
program.run(Environment);
