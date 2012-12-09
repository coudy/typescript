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
    ArrayUtilities.createArray = function createArray(length, defaultvalue) {
        if (typeof defaultvalue === "undefined") { defaultvalue = null; }
        var result = [];
        for(var i = 0; i < length; i++) {
            result.push(defaultvalue);
        }
        return result;
    }
    ArrayUtilities.grow = function grow(array, length, defaultValue) {
        var count = length - array.length;
        for(var i = 0; i < count; i++) {
            array.push(defaultValue);
        }
    }
    ArrayUtilities.copy = function copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
        for(var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    }
    return ArrayUtilities;
})();
var CharacterCodes;
(function (CharacterCodes) {
    CharacterCodes._map = [];
    CharacterCodes.nullCharacter = 0;
    CharacterCodes.maxAsciiCharacter = 127;
    CharacterCodes.newLine = 10;
    CharacterCodes.carriageReturn = 13;
    CharacterCodes.nextLine = 133;
    CharacterCodes.lineSeparator = 8232;
    CharacterCodes.paragraphSeparator = 8233;
    CharacterCodes.space = 32;
    CharacterCodes.nonBreakingSpace = 160;
    CharacterCodes._ = 95;
    CharacterCodes.$ = 36;
    CharacterCodes._0 = 48;
    CharacterCodes._9 = 57;
    CharacterCodes.a = 97;
    CharacterCodes.b = 98;
    CharacterCodes.e = 101;
    CharacterCodes.f = 102;
    CharacterCodes.n = 110;
    CharacterCodes.r = 114;
    CharacterCodes.t = 116;
    CharacterCodes.u = 117;
    CharacterCodes.v = 118;
    CharacterCodes.x = 120;
    CharacterCodes.z = 122;
    CharacterCodes.A = 65;
    CharacterCodes.E = 69;
    CharacterCodes.F = 70;
    CharacterCodes.X = 88;
    CharacterCodes.Z = 90;
    CharacterCodes.ampersand = 38;
    CharacterCodes.asterisk = 42;
    CharacterCodes.backslash = 92;
    CharacterCodes.bar = 124;
    CharacterCodes.caret = 94;
    CharacterCodes.closeBrace = 125;
    CharacterCodes.closeBracket = 93;
    CharacterCodes.closeParen = 41;
    CharacterCodes.colon = 58;
    CharacterCodes.comma = 44;
    CharacterCodes.dot = 46;
    CharacterCodes.doubleQuote = 34;
    CharacterCodes.equals = 61;
    CharacterCodes.exclamation = 33;
    CharacterCodes.greaterThan = 62;
    CharacterCodes.lessThan = 60;
    CharacterCodes.minus = 45;
    CharacterCodes.openBrace = 123;
    CharacterCodes.openBracket = 91;
    CharacterCodes.openParen = 40;
    CharacterCodes.percent = 37;
    CharacterCodes.plus = 43;
    CharacterCodes.question = 63;
    CharacterCodes.semicolon = 59;
    CharacterCodes.singleQuote = 39;
    CharacterCodes.slash = 47;
    CharacterCodes.tilde = 126;
    CharacterCodes.backspace = 8;
    CharacterCodes.formFeed = 12;
    CharacterCodes.byteOrderMark = 65279;
    CharacterCodes.tab = 9;
    CharacterCodes.verticalTab = 11;
})(CharacterCodes || (CharacterCodes = {}));
var CharacterInfo = (function () {
    function CharacterInfo() { }
    CharacterInfo.isDecimalDigit = function isDecimalDigit(c) {
        return c >= 48 /* _0 */  && c <= 57 /* _9 */ ;
    }
    CharacterInfo.isHexDigit = function isHexDigit(c) {
        return CharacterInfo.isDecimalDigit(c) || (c >= 65 /* A */  && c <= 70 /* F */ ) || (c >= 97 /* a */  && c <= 102 /* f */ );
    }
    CharacterInfo.hexValue = function hexValue(c) {
        Debug.assert(CharacterInfo.isHexDigit(c));
        return CharacterInfo.isDecimalDigit(c) ? (c - 48 /* _0 */ ) : (c >= 65 /* A */  && c <= 70 /* F */ ) ? c - 65 /* A */  + 10 : c - 97 /* a */  + 10;
    }
    return CharacterInfo;
})();
var Constants;
(function (Constants) {
    Constants._map = [];
    Constants.MaxInteger = 4294967295;
    Constants.TriviaNewLineMask = 134217728;
    Constants.TriviaCommentMask = 67108864;
    Constants.TriviaLengthMask = 67108863;
})(Constants || (Constants = {}));
var Debug = (function () {
    function Debug() { }
    Debug.assert = function assert(expression) {
        if(!expression) {
            throw new Error("Debug Failure. False expression.");
        }
    }
    return Debug;
})();
var Diagnostic = (function () {
    function Diagnostic(diagnosticCode, arguments) {
        this._diagnosticCode = 0;
        this._arguments = null;
        this._diagnosticCode = diagnosticCode;
        this._arguments = (arguments && arguments.length > 0) ? arguments : null;
    }
    Diagnostic.prototype.diagnosticCode = function () {
        return this._diagnosticCode;
    };
    Diagnostic.prototype.additionalLocations = function () {
        return [];
    };
    Diagnostic.prototype.message = function () {
        return DiagnosticMessages.getDiagnosticMessage(this._diagnosticCode, this._arguments);
    };
    return Diagnostic;
})();
var DiagnosticCode;
(function (DiagnosticCode) {
    DiagnosticCode._map = [];
    DiagnosticCode._map[0] = "Unrecognized_escape_sequence";
    DiagnosticCode.Unrecognized_escape_sequence = 0;
    DiagnosticCode._map[1] = "Unexpected_character_0";
    DiagnosticCode.Unexpected_character_0 = 1;
    DiagnosticCode._map[2] = "Missing_closing_quote_character";
    DiagnosticCode.Missing_closing_quote_character = 2;
    DiagnosticCode._map[3] = "Identifier_expected";
    DiagnosticCode.Identifier_expected = 3;
    DiagnosticCode._map[4] = "_0_keyword_expected";
    DiagnosticCode._0_keyword_expected = 4;
    DiagnosticCode._map[5] = "_0_expected";
    DiagnosticCode._0_expected = 5;
    DiagnosticCode._map[6] = "Identifier_expected__0_is_a_keyword";
    DiagnosticCode.Identifier_expected__0_is_a_keyword = 6;
    DiagnosticCode._map[7] = "Automatic_semicolon_insertion_not_allowed";
    DiagnosticCode.Automatic_semicolon_insertion_not_allowed = 7;
    DiagnosticCode._map[8] = "Unexpected_token__0_expected";
    DiagnosticCode.Unexpected_token__0_expected = 8;
    DiagnosticCode._map[9] = "Trailing_separator_not_allowed";
    DiagnosticCode.Trailing_separator_not_allowed = 9;
    DiagnosticCode._map[10] = "_StarSlash__expected";
    DiagnosticCode._StarSlash__expected = 10;
})(DiagnosticCode || (DiagnosticCode = {}));
var DiagnosticMessages = (function () {
    function DiagnosticMessages() { }
    DiagnosticMessages.codeToFormatString = [];
    DiagnosticMessages.initializeStaticData = function initializeStaticData() {
        if(DiagnosticMessages.codeToFormatString.length === 0) {
            DiagnosticMessages.codeToFormatString[0 /* Unrecognized_escape_sequence */ ] = "Unrecognized escape sequence.";
            DiagnosticMessages.codeToFormatString[1 /* Unexpected_character_0 */ ] = "Unexpected character {0}.";
            DiagnosticMessages.codeToFormatString[2 /* Missing_closing_quote_character */ ] = "Missing close quote character.";
            DiagnosticMessages.codeToFormatString[3 /* Identifier_expected */ ] = "Identifier expected.";
            DiagnosticMessages.codeToFormatString[4 /* _0_keyword_expected */ ] = "'{0}' keyword expected.";
            DiagnosticMessages.codeToFormatString[5 /* _0_expected */ ] = "'{0}' expected.";
            DiagnosticMessages.codeToFormatString[6 /* Identifier_expected__0_is_a_keyword */ ] = "Identifier expected; '{0}' is a keyword.";
            DiagnosticMessages.codeToFormatString[7 /* Automatic_semicolon_insertion_not_allowed */ ] = "Automatic semicolon insertion not allowed.";
            DiagnosticMessages.codeToFormatString[8 /* Unexpected_token__0_expected */ ] = "Unexpected token; '{0}' expected.";
            DiagnosticMessages.codeToFormatString[9 /* Trailing_separator_not_allowed */ ] = "Trailing separator not allowed.";
            DiagnosticMessages.codeToFormatString[10 /* _StarSlash__expected */ ] = "'*/' expected.";
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
var Emitter = (function () {
    function Emitter(syntaxOnly) {
        this.syntaxOnly = syntaxOnly;
    }
    Emitter.prototype.emit = function (input) {
        return null;
    };
    return Emitter;
})();

var Environment = (function () {
    function getWindowsScriptHostEnvironment() {
        try  {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
        } catch (e) {
            return null;
        }
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
            readFile: function (path, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
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
                        } else {
                            streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
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
            writeFile: function (path, contents, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                var file = this.createFile(path, useUTF8);
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
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
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
    function getNodeEnvironment() {
        var _fs = require('fs');
        var _path = require('path');
        var _module = require('module');
        return {
            readFile: function (file, useUTF8) {
                var buffer = _fs.readFileSync(file);
                switch(buffer[0]) {
                    case 254: {
                        if(buffer[1] == 255) {
                            var i = 0;
                            while((i + 1) < buffer.length) {
                                var temp = buffer[i];
                                buffer[i] = buffer[i + 1];
                                buffer[i + 1] = temp;
                                i += 2;
                            }
                            return buffer.toString("ucs2", 2);
                        }
                        break;

                    }
                    case 255: {
                        if(buffer[1] == 254) {
                            return buffer.toString("ucs2", 2);
                        }
                        break;

                    }
                    case 239: {
                        if(buffer[1] == 187) {
                            return buffer.toString("utf8", 3);
                        }

                    }
                }
                return useUTF8 ? buffer.toString("utf8", 0) : buffer.toString();
            },
            writeFile: function (path, contents, useUTF) {
                if(useUTF) {
                    _fs.writeFileSync(path, contents, "utf8");
                } else {
                    _fs.writeFileSync(path, contents);
                }
            },
            fileExists: function (path) {
                return _fs.existsSync(path);
            },
            deleteFile: function (path) {
                try  {
                    _fs.unlinkSync(path);
                } catch (e) {
                }
            },
            directoryExists: function (path) {
                return _fs.existsSync(path) && _fs.lstatSync(path).isDirectory();
            },
            listFiles: function dir(path, spec, options) {
                options = options || {
                };
                function filesInFolder(folder) {
                    var paths = [];
                    var files = _fs.readdirSync(folder);
                    for(var i = 0; i < files.length; i++) {
                        var stat = _fs.statSync(folder + "\\" + files[i]);
                        if(options.recursive && stat.isDirectory()) {
                            paths = paths.concat(filesInFolder(folder + "\\" + files[i]));
                        } else {
                            if(stat.isFile() && (!spec || files[i].match(spec))) {
                                paths.push(folder + "\\" + files[i]);
                            }
                        }
                    }
                    return paths;
                }
                return filesInFolder(path);
            },
            createFile: function (path, useUTF8) {
                function mkdirRecursiveSync(path) {
                    var stats = _fs.statSync(path);
                    if(stats.isFile()) {
                        throw "\"" + path + "\" exists but isn't a directory.";
                    } else {
                        if(stats.isDirectory()) {
                            return;
                        } else {
                            mkdirRecursiveSync(_path.dirname(path));
                            _fs.mkdirSync(path, 509);
                        }
                    }
                }
                mkdirRecursiveSync(_path.dirname(path));
                var fd = _fs.openSync(path, 'w');
                return {
                    Write: function (str) {
                        _fs.writeSync(fd, str);
                    },
                    WriteLine: function (str) {
                        _fs.writeSync(fd, str + '\r\n');
                    },
                    Close: function () {
                        _fs.closeSync(fd);
                        fd = null;
                    }
                };
            },
            arguments: process.argv.slice(2),
            standardOut: {
                Write: function (str) {
                    process.stdout.write(str);
                },
                WriteLine: function (str) {
                    process.stdout.write(str + '\n');
                },
                Close: function () {
                }
            }
        };
    }
    ; ;
    if(typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    } else {
        if(typeof require === "function") {
            return getNodeEnvironment();
        } else {
            return null;
        }
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
var Hash = (function () {
    function Hash() { }
    Hash.FNV_BASE = 2166136261;
    Hash.FNV_PRIME = 16777619;
    Hash.computeFnv1aCharArrayHashCode = function computeFnv1aCharArrayHashCode(text, start, len) {
        var hashCode = Hash.FNV_BASE;
        var end = start + len;
        for(var i = start; i < end; i++) {
            hashCode = (hashCode ^ text[i]) * Hash.FNV_PRIME;
        }
        return hashCode;
    }
    Hash.computeMurmur2CharArrayHashCode = function computeMurmur2CharArrayHashCode(key, start, len) {
        var m = 1540483477;
        var r = 24;
        var numberOfCharsLeft = len;
        var h = (0 ^ numberOfCharsLeft);
        var index = start;
        while(numberOfCharsLeft >= 2) {
            var c1 = key[index];
            var c2 = key[index + 1];
            var k = c1 | (c2 << 16);
            k *= m;
            k ^= k >> r;
            k *= m;
            h *= m;
            h ^= k;
            index += 2;
            numberOfCharsLeft -= 2;
        }
        if(numberOfCharsLeft == 1) {
            h ^= key[index];
            h *= m;
        }
        h ^= h >> 13;
        h *= m;
        h ^= h >> 15;
        return h;
    }
    Hash.primes = [
        3, 
        7, 
        11, 
        17, 
        23, 
        29, 
        37, 
        47, 
        59, 
        71, 
        89, 
        107, 
        131, 
        163, 
        197, 
        239, 
        293, 
        353, 
        431, 
        521, 
        631, 
        761, 
        919, 
        1103, 
        1327, 
        1597, 
        1931, 
        2333, 
        2801, 
        3371, 
        4049, 
        4861, 
        5839, 
        7013, 
        8419, 
        10103, 
        12143, 
        14591, 
        17519, 
        21023, 
        25229, 
        30293, 
        36353, 
        43627, 
        52361, 
        62851, 
        75431, 
        90523, 
        108631, 
        130363, 
        156437, 
        187751, 
        225307, 
        270371, 
        324449, 
        389357, 
        467237, 
        560689, 
        672827, 
        807403, 
        968897, 
        1162687, 
        1395263, 
        1674319, 
        2009191, 
        2411033, 
        2893249, 
        3471899, 
        4166287, 
        4999559, 
        5999471, 
        7199369
    ];
    Hash.getPrime = function getPrime(min) {
        for(var i = 0; i < Hash.primes.length; i++) {
            var num = Hash.primes[i];
            if(num >= min) {
                return num;
            }
        }
        throw Errors.notYetImplemented();
    }
    Hash.expandPrime = function expandPrime(oldSize) {
        var num = oldSize << 1;
        if(num > 2146435069 && 2146435069 > oldSize) {
            return 2146435069;
        }
        return Hash.getPrime(num);
    }
    return Hash;
})();
var IntegerUtilities = (function () {
    function IntegerUtilities() { }
    IntegerUtilities.integerDivide = function integerDivide(numerator, denominator) {
        return (numerator / denominator) >> 0;
    }
    return IntegerUtilities;
})();
var DefaultSyntaxVisitor = (function () {
    function DefaultSyntaxVisitor() { }
    DefaultSyntaxVisitor.prototype.defaultVisit = function (node) {
    };
    DefaultSyntaxVisitor.prototype.visitSourceUnit = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitExternalModuleReference = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitModuleNameModuleReference = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitImportDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitClassDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitInterfaceDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitExtendsClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitImplementsClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitModuleDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitFunctionDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitVariableStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitVariableDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitVariableDeclarator = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitEqualsValueClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitPrefixUnaryExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitThisExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitLiteralExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitArrayLiteralExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitOmittedExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitParenthesizedExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitSimpleArrowFunctionExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitIdentifierName = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitQualifiedName = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitConstructorType = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitFunctionType = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitObjectType = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitArrayType = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitPredefinedType = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitTypeAnnotation = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitBlock = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitParameter = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitMemberAccessExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitPostfixUnaryExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitElementAccessExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitInvocationExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitArgumentList = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitBinaryExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitConditionalExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitConstructSignature = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitFunctionSignature = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitIndexSignature = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitPropertySignature = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitParameterList = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitCallSignature = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitElseClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitIfStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitExpressionStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitConstructorDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitMemberFunctionDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitGetMemberAccessorDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitSetMemberAccessorDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitMemberVariableDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitThrowStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitReturnStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitObjectCreationExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitSwitchStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitCaseSwitchClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitDefaultSwitchClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitBreakStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitContinueStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitForStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitForInStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitWhileStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitWithStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitEnumDeclaration = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitCastExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitObjectLiteralExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitSimplePropertyAssignment = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitGetAccessorPropertyAssignment = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitSetAccessorPropertyAssignment = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitFunctionExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitEmptyStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitSuperExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitTryStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitCatchClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitFinallyClause = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitLabeledStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitDoStatement = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitTypeOfExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitDeleteExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitVoidExpression = function (node) {
        this.defaultVisit(node);
    };
    DefaultSyntaxVisitor.prototype.visitDebuggerStatement = function (node) {
        this.defaultVisit(node);
    };
    return DefaultSyntaxVisitor;
})();
var DefaultSyntaxVisitor1 = (function () {
    function DefaultSyntaxVisitor1() { }
    DefaultSyntaxVisitor1.prototype.defaultVisit = function (node) {
        return null;
    };
    DefaultSyntaxVisitor1.prototype.visitSourceUnit = function (node) {
        return null;
    };
    DefaultSyntaxVisitor1.prototype.visitExternalModuleReference = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitModuleNameModuleReference = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitImportDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitClassDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitInterfaceDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitExtendsClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitImplementsClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitModuleDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitFunctionDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitVariableStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitVariableDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitVariableDeclarator = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitEqualsValueClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitPrefixUnaryExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitThisExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitLiteralExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitArrayLiteralExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitOmittedExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitParenthesizedExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitSimpleArrowFunctionExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitIdentifierName = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitQualifiedName = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitConstructorType = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitFunctionType = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitObjectType = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitArrayType = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitPredefinedType = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitTypeAnnotation = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitBlock = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitParameter = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitMemberAccessExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitPostfixUnaryExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitElementAccessExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitInvocationExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitArgumentList = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitBinaryExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitConditionalExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitConstructSignature = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitFunctionSignature = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitIndexSignature = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitPropertySignature = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitParameterList = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitCallSignature = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitElseClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitIfStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitExpressionStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitConstructorDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitMemberFunctionDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitGetMemberAccessorDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitSetMemberAccessorDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitMemberVariableDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitThrowStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitReturnStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitObjectCreationExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitSwitchStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitCaseSwitchClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitDefaultSwitchClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitBreakStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitContinueStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitForStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitForInStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitWhileStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitWithStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitEnumDeclaration = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitCastExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitObjectLiteralExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitSimplePropertyAssignment = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitGetAccessorPropertyAssignment = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitSetAccessorPropertyAssignment = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitFunctionExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitEmptyStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitSuperExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitTryStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitCatchClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitFinallyClause = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitLabeledStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitDoStatement = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitTypeOfExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitDeleteExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitVoidExpression = function (node) {
        return this.defaultVisit(node);
    };
    DefaultSyntaxVisitor1.prototype.visitDebuggerStatement = function (node) {
        return this.defaultVisit(node);
    };
    return DefaultSyntaxVisitor1;
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
var SeparatedSyntaxList;
(function (SeparatedSyntaxList) {
    var EmptySeparatedSyntaxList = (function () {
        function EmptySeparatedSyntaxList() { }
        EmptySeparatedSyntaxList.prototype.isToken = function () {
            return false;
        };
        EmptySeparatedSyntaxList.prototype.isNode = function () {
            return false;
        };
        EmptySeparatedSyntaxList.prototype.isList = function () {
            return false;
        };
        EmptySeparatedSyntaxList.prototype.isSeparatedList = function () {
            return true;
        };
        EmptySeparatedSyntaxList.prototype.kind = function () {
            return 2 /* SeparatedList */ ;
        };
        EmptySeparatedSyntaxList.prototype.isMissing = function () {
            return true;
        };
        EmptySeparatedSyntaxList.prototype.toJSON = function (key) {
            return [];
        };
        EmptySeparatedSyntaxList.prototype.count = function () {
            return 0;
        };
        EmptySeparatedSyntaxList.prototype.syntaxNodeCount = function () {
            return 0;
        };
        EmptySeparatedSyntaxList.prototype.separatorCount = function () {
            return 0;
        };
        EmptySeparatedSyntaxList.prototype.itemAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        EmptySeparatedSyntaxList.prototype.syntaxNodeAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        EmptySeparatedSyntaxList.prototype.separatorAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        return EmptySeparatedSyntaxList;
    })();    
    var SingletonSeparatedSyntaxList = (function () {
        function SingletonSeparatedSyntaxList(item) {
            this.item = item;
        }
        SingletonSeparatedSyntaxList.prototype.toJSON = function (key) {
            return [
                this.item
            ];
        };
        SingletonSeparatedSyntaxList.prototype.isToken = function () {
            return false;
        };
        SingletonSeparatedSyntaxList.prototype.isNode = function () {
            return false;
        };
        SingletonSeparatedSyntaxList.prototype.isList = function () {
            return false;
        };
        SingletonSeparatedSyntaxList.prototype.isSeparatedList = function () {
            return true;
        };
        SingletonSeparatedSyntaxList.prototype.kind = function () {
            return 2 /* SeparatedList */ ;
        };
        SingletonSeparatedSyntaxList.prototype.isMissing = function () {
            return this.item.isMissing();
        };
        SingletonSeparatedSyntaxList.prototype.count = function () {
            return 1;
        };
        SingletonSeparatedSyntaxList.prototype.syntaxNodeCount = function () {
            return 1;
        };
        SingletonSeparatedSyntaxList.prototype.separatorCount = function () {
            return 0;
        };
        SingletonSeparatedSyntaxList.prototype.itemAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.item;
        };
        SingletonSeparatedSyntaxList.prototype.syntaxNodeAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.item;
        };
        SingletonSeparatedSyntaxList.prototype.separatorAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        return SingletonSeparatedSyntaxList;
    })();    
    var NormalSeparatedSyntaxList = (function () {
        function NormalSeparatedSyntaxList(nodes) {
            this.nodes = nodes;
        }
        NormalSeparatedSyntaxList.prototype.isToken = function () {
            return false;
        };
        NormalSeparatedSyntaxList.prototype.isNode = function () {
            return false;
        };
        NormalSeparatedSyntaxList.prototype.isList = function () {
            return false;
        };
        NormalSeparatedSyntaxList.prototype.isSeparatedList = function () {
            return true;
        };
        NormalSeparatedSyntaxList.prototype.kind = function () {
            return 2 /* SeparatedList */ ;
        };
        NormalSeparatedSyntaxList.prototype.toJSON = function (key) {
            return this.nodes;
        };
        NormalSeparatedSyntaxList.prototype.isMissing = function () {
            for(var i = 0, n = this.nodes.length; i < n; i++) {
                if(!this.nodes[i].isMissing()) {
                    return false;
                }
            }
            return true;
        };
        NormalSeparatedSyntaxList.prototype.count = function () {
            return this.nodes.length;
        };
        NormalSeparatedSyntaxList.prototype.syntaxNodeCount = function () {
            return IntegerUtilities.integerDivide(this.nodes.length + 1, 2);
        };
        NormalSeparatedSyntaxList.prototype.separatorCount = function () {
            return IntegerUtilities.integerDivide(this.nodes.length, 2);
        };
        NormalSeparatedSyntaxList.prototype.itemAt = function (index) {
            if(index < 0 || index >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.nodes[index];
        };
        NormalSeparatedSyntaxList.prototype.syntaxNodeAt = function (index) {
            var value = index * 2;
            if(value < 0 || value >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.nodes[value];
        };
        NormalSeparatedSyntaxList.prototype.separatorAt = function (index) {
            var value = index * 2 + 1;
            if(value < 0 || value >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.nodes[value];
        };
        return NormalSeparatedSyntaxList;
    })();    
    SeparatedSyntaxList.empty = new EmptySeparatedSyntaxList();
    function create(nodes) {
        if(nodes === null || nodes.length === 0) {
            return SeparatedSyntaxList.empty;
        }
        if(nodes.length === 1) {
            return new SingletonSeparatedSyntaxList(nodes[0]);
        }
        return new NormalSeparatedSyntaxList(nodes);
    }
    SeparatedSyntaxList.create = create;
})(SeparatedSyntaxList || (SeparatedSyntaxList = {}));
var SlidingWindow = (function () {
    function SlidingWindow(defaultWindowSize, defaultValue, sourceLength) {
        if (typeof sourceLength === "undefined") { sourceLength = -1; }
        this.window = [];
        this.windowCount = 0;
        this.windowAbsoluteStartIndex = 0;
        this.currentRelativeItemIndex = 0;
        this.pinCount = 0;
        this.firstPinnedAbsoluteIndex = -1;
        this.pool = [];
        this.poolCount = 0;
        this.defaultValue = defaultValue;
        this.window = ArrayUtilities.createArray(defaultWindowSize, defaultValue);
        this.sourceLength = sourceLength;
    }
    SlidingWindow.prototype.storeAdditionalRewindState = function (rewindPoint) {
    };
    SlidingWindow.prototype.restoreStateFromRewindPoint = function (rewindPoint) {
    };
    SlidingWindow.prototype.fetchMoreItems = function (argument, sourceIndex, window, destinationIndex, spaceAvailable) {
        throw Errors.notYetImplemented();
    };
    SlidingWindow.prototype.windowAbsoluteEndIndex = function () {
        return this.windowAbsoluteStartIndex + this.windowCount;
    };
    SlidingWindow.prototype.addMoreItemsToWindow = function (argument) {
        if(this.sourceLength >= 0 && this.absoluteIndex() >= this.sourceLength) {
            return false;
        }
        if(this.windowCount >= this.window.length) {
            this.tryShiftOrGrowTokenWindow();
        }
        var spaceAvailable = this.window.length - this.windowCount;
        var amountFetched = this.fetchMoreItems(argument, this.windowAbsoluteEndIndex(), this.window, this.windowCount, spaceAvailable);
        this.windowCount += amountFetched;
        return amountFetched > 0;
    };
    SlidingWindow.prototype.tryShiftOrGrowTokenWindow = function () {
        var currentIndexIsPastWindowHalfwayPoint = this.currentRelativeItemIndex > (this.window.length >>> 1);
        var isAllowedToShift = this.firstPinnedAbsoluteIndex === -1 || this.firstPinnedAbsoluteIndex > this.windowAbsoluteStartIndex;
        if(currentIndexIsPastWindowHalfwayPoint && isAllowedToShift) {
            var shiftStartIndex = this.firstPinnedAbsoluteIndex === -1 ? this.currentRelativeItemIndex : this.firstPinnedAbsoluteIndex - this.windowAbsoluteStartIndex;
            var shiftCount = this.windowCount - shiftStartIndex;
            Debug.assert(shiftStartIndex > 0);
            if(shiftCount > 0) {
                ArrayUtilities.copy(this.window, shiftStartIndex, this.window, 0, shiftCount);
            }
            this.windowAbsoluteStartIndex += shiftStartIndex;
            this.windowCount -= shiftStartIndex;
            this.currentRelativeItemIndex -= shiftStartIndex;
        } else {
            ArrayUtilities.grow(this.window, this.window.length * 2, this.defaultValue);
        }
    };
    SlidingWindow.prototype.absoluteIndex = function () {
        return this.windowAbsoluteStartIndex + this.currentRelativeItemIndex;
    };
    SlidingWindow.prototype.isAtEndOfSource = function () {
        return this.absoluteIndex() >= this.sourceLength;
    };
    SlidingWindow.prototype.getAndPinAbsoluteIndex = function () {
        var absoluteIndex = this.absoluteIndex();
        if(this.pinCount === 0) {
            this.firstPinnedAbsoluteIndex = absoluteIndex;
        }
        this.pinCount++;
        return absoluteIndex;
    };
    SlidingWindow.prototype.releaseAndUnpinAbsoluteIndex = function (absoluteIndex) {
        this.pinCount--;
        if(this.pinCount === 0) {
            this.firstPinnedAbsoluteIndex = -1;
        }
    };
    SlidingWindow.prototype.getRewindPoint = function () {
        var absoluteIndex = this.getAndPinAbsoluteIndex();
        var rewindPoint = this.poolCount === 0 ? {
        } : this.pop();
        rewindPoint.absoluteIndex = absoluteIndex;
        this.storeAdditionalRewindState(rewindPoint);
        return rewindPoint;
    };
    SlidingWindow.prototype.pop = function () {
        this.poolCount--;
        var result = this.pool[this.poolCount];
        this.pool[this.poolCount] = null;
        return result;
    };
    SlidingWindow.prototype.rewindToPinnedIndex = function (absoluteIndex) {
        var relativeIndex = absoluteIndex - this.windowAbsoluteStartIndex;
        Debug.assert(relativeIndex >= 0 && relativeIndex < this.windowCount);
        this.currentRelativeItemIndex = relativeIndex;
    };
    SlidingWindow.prototype.rewind = function (rewindPoint) {
        this.rewindToPinnedIndex(rewindPoint.absoluteIndex);
        this.restoreStateFromRewindPoint(rewindPoint);
    };
    SlidingWindow.prototype.releaseRewindPoint = function (rewindPoint) {
        this.releaseAndUnpinAbsoluteIndex(rewindPoint.absoluteIndex);
        this.pool[this.poolCount] = rewindPoint;
        this.poolCount++;
    };
    SlidingWindow.prototype.currentItem = function (argument) {
        if(this.currentRelativeItemIndex >= this.windowCount) {
            if(!this.addMoreItemsToWindow(argument)) {
                return this.defaultValue;
            }
        }
        return this.window[this.currentRelativeItemIndex];
    };
    SlidingWindow.prototype.peekItemN = function (n) {
        while(this.currentRelativeItemIndex + n >= this.windowCount) {
            if(!this.addMoreItemsToWindow(null)) {
                return this.defaultValue;
            }
        }
        return this.window[this.currentRelativeItemIndex + n];
    };
    SlidingWindow.prototype.moveToNextItem = function () {
        this.currentRelativeItemIndex++;
    };
    SlidingWindow.prototype.disgardAllItemsFromCurrentIndexOnwards = function () {
        this.windowCount = this.currentRelativeItemIndex;
    };
    SlidingWindow.prototype.setAbsoluteIndex = function (absoluteIndex) {
        Debug.assert(this.pinCount === 0);
        if(absoluteIndex >= this.windowAbsoluteStartIndex && absoluteIndex < this.windowAbsoluteEndIndex()) {
            this.currentRelativeItemIndex = (absoluteIndex - this.windowAbsoluteStartIndex);
        } else {
            this.windowAbsoluteStartIndex = absoluteIndex;
            this.windowCount = 0;
            this.currentRelativeItemIndex = 0;
        }
    };
    return SlidingWindow;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var ListParsingState;
(function (ListParsingState) {
    ListParsingState._map = [];
    ListParsingState.SourceUnit_ModuleElements = 1 << 0;
    ListParsingState.ClassDeclaration_ClassElements = 1 << 1;
    ListParsingState.ModuleDeclaration_ModuleElements = 1 << 2;
    ListParsingState.SwitchStatement_SwitchClauses = 1 << 3;
    ListParsingState.SwitchClause_Statements = 1 << 4;
    ListParsingState.Block_Statements = 1 << 5;
    ListParsingState.EnumDeclaration_VariableDeclarators = 1 << 7;
    ListParsingState.ObjectType_TypeMembers = 1 << 8;
    ListParsingState.ExtendsOrImplementsClause_TypeNameList = 1 << 9;
    ListParsingState.VariableDeclaration_VariableDeclarators_AllowIn = 1 << 10;
    ListParsingState.VariableDeclaration_VariableDeclarators_DisallowIn = 1 << 11;
    ListParsingState.ArgumentList_AssignmentExpressions = 1 << 12;
    ListParsingState.ObjectLiteralExpression_PropertyAssignments = 1 << 13;
    ListParsingState.ArrayLiteralExpression_AssignmentExpressions = 1 << 14;
    ListParsingState.ParameterList_Parameters = 1 << 15;
    ListParsingState.FirstListParsingState = ListParsingState.SourceUnit_ModuleElements;
    ListParsingState.LastListParsingState = ListParsingState.ParameterList_Parameters;
})(ListParsingState || (ListParsingState = {}));
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser(scanner, oldTree, changes, options) {
        _super.call(this, 32, null);
        this.options = null;
        this._currentToken = null;
        this.previousToken = null;
        this.tokenDiagnostics = [];
        this.listParsingState = 0;
        this.isInStrictMode = false;
        this.skippedTokens = [];
        this.diagnostics = [];
        this.scanner = scanner;
        this.oldTree = oldTree;
        this.options = options || new ParseOptions();
    }
    Parser.prototype.isIncremental = function () {
        return this.oldTree !== null;
    };
    Parser.prototype.storeAdditionalRewindState = function (rewindPoint) {
        rewindPoint.previousToken = this.previousToken;
        rewindPoint.isInStrictMode = this.isInStrictMode;
        rewindPoint.diagnosticsCount = this.diagnostics.length;
        rewindPoint.skippedTokensCount = this.skippedTokens.length;
    };
    Parser.prototype.restoreStateFromRewindPoint = function (rewindPoint) {
        this._currentToken = null;
        this.previousToken = rewindPoint.previousToken;
        this.isInStrictMode = rewindPoint.isInStrictMode;
        this.diagnostics.length = rewindPoint.diagnosticsCount;
        this.skippedTokens.length = rewindPoint.skippedTokensCount;
    };
    Parser.prototype.fetchMoreItems = function (argument, sourceIndex, window, destinationIndex, spaceAvailable) {
        window[destinationIndex] = this.scanner.scan(this.tokenDiagnostics, argument);
        return 1;
    };
    Parser.prototype.currentToken = function () {
        var result = this._currentToken;
        if(result === null) {
            result = this.currentItem(false);
            this._currentToken = result;
        }
        return result;
    };
    Parser.prototype.currentTokenAllowingRegularExpression = function () {
        Debug.assert(this._currentToken === null);
        var result = this.currentItem(true);
        this._currentToken = result;
        return result;
    };
    Parser.prototype.peekTokenN = function (n) {
        return this.peekItemN(n);
    };
    Parser.prototype.eatAnyToken = function () {
        var token = this.currentToken();
        this.moveToNextToken();
        return token;
    };
    Parser.prototype.moveToNextToken = function () {
        this.previousToken = this._currentToken;
        this._currentToken = null;
        this.moveToNextItem();
    };
    Parser.prototype.canEatAutomaticSemicolon = function (allowWithoutNewLine) {
        var token = this.currentToken();
        if(token.tokenKind === 116 /* EndOfFileToken */ ) {
            return true;
        }
        if(token.tokenKind === 66 /* CloseBraceToken */ ) {
            return true;
        }
        if(allowWithoutNewLine) {
            return true;
        }
        if(this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
            return true;
        }
        return false;
    };
    Parser.prototype.canEatExplicitOrAutomaticSemicolon = function (allowWithoutNewline) {
        var token = this.currentToken();
        if(token.tokenKind === 73 /* SemicolonToken */ ) {
            return true;
        }
        return this.canEatAutomaticSemicolon(allowWithoutNewline);
    };
    Parser.prototype.eatExplicitOrAutomaticSemicolon = function (allowWithoutNewline) {
        var token = this.currentToken();
        if(token.tokenKind === 73 /* SemicolonToken */ ) {
            return this.eatToken(73 /* SemicolonToken */ );
        }
        if(this.canEatAutomaticSemicolon(allowWithoutNewline)) {
            var semicolonToken = SyntaxTokenFactory.createEmptyToken(this.currentToken().fullStart(), 73 /* SemicolonToken */ , 0 /* None */ );
            if(!this.options.allowAutomaticSemicolonInsertion()) {
                this.addDiagnostic(new SyntaxDiagnostic(this.previousToken.end(), 0, 7 /* Automatic_semicolon_insertion_not_allowed */ , null));
            }
            return semicolonToken;
        }
        return this.eatToken(73 /* SemicolonToken */ );
    };
    Parser.prototype.eatToken = function (kind) {
        var token = this.currentToken();
        if(token.tokenKind === kind) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(kind, 0 /* None */ , token);
    };
    Parser.prototype.tryEatToken = function (kind) {
        if(this.currentToken().tokenKind === kind) {
            return this.eatToken(kind);
        }
        return null;
    };
    Parser.prototype.tryEatKeyword = function (kind) {
        if(this.currentToken().keywordKind() === kind) {
            return this.eatKeyword(kind);
        }
        return null;
    };
    Parser.prototype.eatKeyword = function (kind) {
        Debug.assert(SyntaxFacts.isTokenKind(kind));
        var token = this.currentToken();
        if(token.keywordKind() === kind) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(7 /* IdentifierNameToken */ , kind, token);
    };
    Parser.prototype.eatIdentifierNameToken = function () {
        var token = this.currentToken();
        if(token.tokenKind === 7 /* IdentifierNameToken */ ) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(7 /* IdentifierNameToken */ , 0 /* None */ , token);
    };
    Parser.prototype.eatIdentifierToken = function () {
        var token = this.currentToken();
        if(token.tokenKind === 7 /* IdentifierNameToken */ ) {
            if(this.isKeyword(token.keywordKind())) {
                return this.createMissingToken(7 /* IdentifierNameToken */ , 0 /* None */ , token);
            }
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(7 /* IdentifierNameToken */ , 0 /* None */ , token);
    };
    Parser.prototype.isIdentifier = function (token) {
        return token.tokenKind === 7 /* IdentifierNameToken */  && !this.isKeyword(token.keywordKind());
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
    Parser.prototype.createMissingToken = function (expectedKind, expectedKeywordKind, actual) {
        var diagnostic = this.getExpectedTokenDiagnostic(expectedKind, expectedKeywordKind, actual);
        this.addDiagnostic(diagnostic);
        return SyntaxTokenFactory.createEmptyToken(this.currentToken().fullStart(), expectedKind, expectedKeywordKind);
    };
    Parser.prototype.getExpectedTokenDiagnostic = function (expectedKind, expectedKeywordKind, actual) {
        var token = this.currentToken();
        if(expectedKind === 7 /* IdentifierNameToken */ ) {
            if(SyntaxFacts.isAnyKeyword(expectedKeywordKind)) {
                return new SyntaxDiagnostic(token.start(), token.width(), 5 /* _0_expected */ , [
                    SyntaxFacts.getText(expectedKeywordKind)
                ]);
            } else {
                if(actual !== null && SyntaxFacts.isAnyKeyword(actual.keywordKind())) {
                    return new SyntaxDiagnostic(token.start(), token.width(), 6 /* Identifier_expected__0_is_a_keyword */ , [
                        SyntaxFacts.getText(actual.keywordKind())
                    ]);
                } else {
                    return new SyntaxDiagnostic(token.start(), token.width(), 3 /* Identifier_expected */ , null);
                }
            }
        }
        if(SyntaxFacts.isAnyPunctuation(expectedKind)) {
            return new SyntaxDiagnostic(token.start(), token.width(), 5 /* _0_expected */ , [
                SyntaxFacts.getText(expectedKind)
            ]);
        }
        throw Errors.notYetImplemented();
    };
    Parser.getPrecedence = function getPrecedence(expressionKind) {
        switch(expressionKind) {
            case 168 /* CommaExpression */ : {
                return 1 /* CommaExpressionPrecedence */ ;

            }
            case 169 /* AssignmentExpression */ :
            case 170 /* AddAssignmentExpression */ :
            case 171 /* SubtractAssignmentExpression */ :
            case 172 /* MultiplyAssignmentExpression */ :
            case 173 /* DivideAssignmentExpression */ :
            case 174 /* ModuloAssignmentExpression */ :
            case 175 /* AndAssignmentExpression */ :
            case 176 /* ExclusiveOrAssignmentExpression */ :
            case 177 /* OrAssignmentExpression */ :
            case 178 /* LeftShiftAssignmentExpression */ :
            case 179 /* SignedRightShiftAssignmentExpression */ :
            case 180 /* UnsignedRightShiftAssignmentExpression */ : {
                return 2 /* AssignmentExpressionPrecedence */ ;

            }
            case 181 /* ConditionalExpression */ : {
                return 3 /* ConditionalExpressionPrecedence */ ;

            }
            case 182 /* LogicalOrExpression */ : {
                return 5 /* LogicalOrExpressionPrecedence */ ;

            }
            case 183 /* LogicalAndExpression */ : {
                return 6 /* LogicalAndExpressionPrecedence */ ;

            }
            case 184 /* BitwiseOrExpression */ : {
                return 7 /* BitwiseOrExpressionPrecedence */ ;

            }
            case 185 /* BitwiseExclusiveOrExpression */ : {
                return 8 /* BitwiseExclusiveOrExpressionPrecedence */ ;

            }
            case 186 /* BitwiseAndExpression */ : {
                return 9 /* BitwiseAndExpressionPrecedence */ ;

            }
            case 187 /* EqualsWithTypeConversionExpression */ :
            case 188 /* NotEqualsWithTypeConversionExpression */ :
            case 189 /* EqualsExpression */ :
            case 190 /* NotEqualsExpression */ : {
                return 10 /* EqualityExpressionPrecedence */ ;

            }
            case 191 /* LessThanExpression */ :
            case 192 /* GreaterThanExpression */ :
            case 193 /* LessThanOrEqualExpression */ :
            case 194 /* GreaterThanOrEqualExpression */ :
            case 195 /* InstanceOfExpression */ :
            case 196 /* InExpression */ : {
                return 11 /* RelationalExpressionPrecedence */ ;

            }
            case 197 /* LeftShiftExpression */ :
            case 198 /* SignedRightShiftExpression */ :
            case 199 /* UnsignedRightShiftExpression */ : {
                return 12 /* ShiftExpressionPrecdence */ ;

            }
            case 203 /* AddExpression */ :
            case 204 /* SubtractExpression */ : {
                return 13 /* AdditiveExpressionPrecedence */ ;

            }
            case 200 /* MultiplyExpression */ :
            case 201 /* DivideExpression */ :
            case 202 /* ModuloExpression */ : {
                return 14 /* MultiplicativeExpressionPrecedence */ ;

            }
            case 154 /* PlusExpression */ :
            case 155 /* NegateExpression */ :
            case 156 /* BitwiseNotExpression */ :
            case 157 /* LogicalNotExpression */ :
            case 160 /* DeleteExpression */ :
            case 161 /* TypeOfExpression */ :
            case 162 /* VoidExpression */ :
            case 158 /* PreIncrementExpression */ :
            case 159 /* PreDecrementExpression */ : {
                return 15 /* UnaryExpressionPrecedence */ ;

            }
        }
        throw Errors.invalidOperation();
    }
    Parser.isDirectivePrologueElement = function isDirectivePrologueElement(node) {
        if(node.kind() === 139 /* ExpressionStatement */ ) {
            var expressionStatement = node;
            var expression = expressionStatement.expression();
            if(expression.kind() === 167 /* StringLiteralExpression */ ) {
                return true;
            }
        }
        return false;
    }
    Parser.isUseStrictDirective = function isUseStrictDirective(node) {
        var expressionStatement = node;
        var expression = expressionStatement.expression();
        var stringLiteralExpression = expression;
        var stringLiteral = stringLiteralExpression.literalToken();
        var text = stringLiteral.text();
        return text === '"use strict"' || text === "'use strict'";
    }
    Parser.prototype.parseSyntaxTree = function () {
        var sourceUnit = this.parseSourceUnit();
        var allDiagnostics = this.tokenDiagnostics.concat(this.diagnostics);
        allDiagnostics.sort(function (a, b) {
            return a.position() - b.position();
        });
        this.skippedTokens.sort(function (a, b) {
            return a.fullStart() - b.fullStart();
        });
        return new SyntaxTree(sourceUnit, this.skippedTokens, allDiagnostics);
    };
    Parser.prototype.parseSourceUnit = function () {
        var savedIsInStrictMode = this.isInStrictMode;
        var moduleElements = this.parseSyntaxList(1 /* SourceUnit_ModuleElements */ , Parser.updateStrictModeState);
        this.isInStrictMode = savedIsInStrictMode;
        return new SourceUnitSyntax(moduleElements, this.currentToken());
    };
    Parser.updateStrictModeState = function updateStrictModeState(parser, items) {
        if(!parser.isInStrictMode) {
            for(var i = 0; i < items.length; i++) {
                var item = items[i];
                if(!Parser.isDirectivePrologueElement(item)) {
                    return;
                }
            }
            parser.isInStrictMode = Parser.isUseStrictDirective(items[items.length - 1]);
        }
    }
    Parser.prototype.isModuleElement = function () {
        return this.isImportDeclaration() || this.isModuleDeclaration() || this.isInterfaceDeclaration() || this.isClassDeclaration() || this.isEnumDeclaration() || this.isStatement(true);
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
                            if(this.isStatement(true)) {
                                return this.parseStatement(true);
                            } else {
                                throw Errors.invalidOperation();
                            }
                        }
                    }
                }
            }
        }
    };
    Parser.prototype.isImportDeclaration = function () {
        return this.currentToken().keywordKind() === 45 /* ImportKeyword */  && this.peekTokenN(1).tokenKind === 7 /* IdentifierNameToken */  && this.peekTokenN(2).tokenKind === 102 /* EqualsToken */ ;
    };
    Parser.prototype.parseImportDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === 45 /* ImportKeyword */ );
        var importKeyword = this.eatKeyword(45 /* ImportKeyword */ );
        var identifier = this.eatIdentifierToken();
        var equalsToken = this.eatToken(102 /* EqualsToken */ );
        var moduleReference = this.parseModuleReference();
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
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
        return this.currentToken().keywordKind() === 61 /* ModuleKeyword */  && this.peekTokenN(1).tokenKind === 67 /* OpenParenToken */ ;
    };
    Parser.prototype.parseExternalModuleReference = function () {
        Debug.assert(this.isExternalModuleReference());
        var moduleKeyword = this.eatKeyword(61 /* ModuleKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var stringLiteral = this.eatToken(10 /* StringLiteral */ );
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
    };
    Parser.prototype.parseModuleNameModuleReference = function () {
        var name = this.parseName();
        return new ModuleNameModuleReferenceSyntax(name);
    };
    Parser.prototype.parseIdentifierName = function () {
        var identifierName = this.eatIdentifierNameToken();
        return new IdentifierNameSyntax(identifierName);
    };
    Parser.prototype.isName = function () {
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.parseName = function () {
        var isIdentifier = this.currentToken().tokenKind === 7 /* IdentifierNameToken */ ;
        var identifier = this.eatIdentifierToken();
        var identifierName = new IdentifierNameSyntax(identifier);
        var current = identifierName;
        while(isIdentifier && this.currentToken().tokenKind === 71 /* DotToken */ ) {
            var dotToken = this.eatToken(71 /* DotToken */ );
            isIdentifier = this.currentToken().tokenKind === 7 /* IdentifierNameToken */ ;
            identifier = this.eatIdentifierToken();
            identifierName = new IdentifierNameSyntax(identifier);
            current = new QualifiedNameSyntax(current, dotToken, identifierName);
        }
        return current;
    };
    Parser.prototype.isEnumDeclaration = function () {
        if(this.currentToken().keywordKind() === 43 /* ExportKeyword */  && this.peekTokenN(1).keywordKind() === 42 /* EnumKeyword */ ) {
            return true;
        }
        return this.currentToken().keywordKind() === 42 /* EnumKeyword */  && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseEnumDeclaration = function () {
        Debug.assert(this.isEnumDeclaration());
        var exportKeyword = this.tryEatKeyword(43 /* ExportKeyword */ );
        var enumKeyword = this.eatKeyword(42 /* EnumKeyword */ );
        var identifier = this.eatIdentifierToken();
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var variableDeclarators = SeparatedSyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            variableDeclarators = this.parseSeparatedSyntaxList(128 /* EnumDeclaration_VariableDeclarators */ );
        }
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken);
    };
    Parser.prototype.isClassDeclaration = function () {
        var token0 = this.currentToken();
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 43 /* ExportKeyword */  && token1.keywordKind() === 40 /* ClassKeyword */ ) {
            return true;
        }
        if(token0.keywordKind() === 59 /* DeclareKeyword */  && token1.keywordKind() === 40 /* ClassKeyword */ ) {
            return true;
        }
        return token0.keywordKind() === 40 /* ClassKeyword */  && this.isIdentifier(token1);
    };
    Parser.prototype.parseClassDeclaration = function () {
        Debug.assert(this.isClassDeclaration());
        var exportKeyword = this.tryEatKeyword(43 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(59 /* DeclareKeyword */ );
        var classKeyword = this.eatKeyword(40 /* ClassKeyword */ );
        var identifier = this.eatIdentifierToken();
        var extendsClause = null;
        if(this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }
        var implementsClause = null;
        if(this.isImplementsClause()) {
            implementsClause = this.parseImplementsClause();
        }
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var classElements = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            classElements = this.parseSyntaxList(2 /* ClassDeclaration_ClassElements */ );
        }
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken);
    };
    Parser.prototype.isConstructorDeclaration = function () {
        return this.currentToken().keywordKind() === 58 /* ConstructorKeyword */ ;
    };
    Parser.prototype.isMemberAccessorDeclaration = function () {
        var rewindPoint = this.getRewindPoint();
        try  {
            if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() === 54 /* StaticKeyword */ ) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() !== 60 /* GetKeyword */  && this.currentToken().keywordKind() !== 63 /* SetKeyword */ ) {
                return false;
            }
            this.eatAnyToken();
            return this.isIdentifier(this.currentToken());
        }finally {
            this.rewind(rewindPoint);
            this.releaseRewindPoint(rewindPoint);
        }
    };
    Parser.prototype.parseMemberAccessorDeclaration = function () {
        Debug.assert(this.isMemberAccessorDeclaration());
        var publicOrPrivateKeyword = null;
        if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = this.tryEatKeyword(54 /* StaticKeyword */ );
        if(this.currentToken().keywordKind() === 60 /* GetKeyword */ ) {
            return this.parseGetMemberAccessorDeclaration(publicOrPrivateKeyword, staticKeyword);
        } else {
            if(this.currentToken().keywordKind() === 63 /* SetKeyword */ ) {
                return this.parseSetMemberAccessorDeclaration(publicOrPrivateKeyword, staticKeyword);
            } else {
                throw Errors.invalidOperation();
            }
        }
    };
    Parser.prototype.parseGetMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword) {
        Debug.assert(this.currentToken().keywordKind() === 60 /* GetKeyword */ );
        var getKeyword = this.eatKeyword(60 /* GetKeyword */ );
        var identifier = this.eatIdentifierToken();
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        var block = this.parseBlock();
        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
    };
    Parser.prototype.parseSetMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword) {
        Debug.assert(this.currentToken().keywordKind() === 63 /* SetKeyword */ );
        var setKeyword = this.eatKeyword(63 /* SetKeyword */ );
        var identifier = this.eatIdentifierToken();
        var parameterList = this.parseParameterList();
        var block = this.parseBlock();
        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
    };
    Parser.prototype.isMemberVariableDeclaration = function () {
        var rewindPoint = this.getRewindPoint();
        try  {
            if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
                this.eatAnyToken();
                if(this.currentToken().tokenKind === 66 /* CloseBraceToken */  || this.currentToken().tokenKind === 116 /* EndOfFileToken */ ) {
                    return true;
                }
            }
            if(this.currentToken().keywordKind() === 54 /* StaticKeyword */ ) {
                this.eatAnyToken();
                if(this.currentToken().tokenKind === 66 /* CloseBraceToken */  || this.currentToken().tokenKind === 116 /* EndOfFileToken */ ) {
                    return true;
                }
            }
            return this.isVariableDeclarator();
        }finally {
            this.rewind(rewindPoint);
            this.releaseRewindPoint(rewindPoint);
        }
    };
    Parser.prototype.isClassElement = function () {
        return this.isConstructorDeclaration() || this.isMemberFunctionDeclaration() || this.isMemberAccessorDeclaration() || this.isMemberVariableDeclaration();
    };
    Parser.prototype.parseConstructorDeclaration = function () {
        Debug.assert(this.isConstructorDeclaration());
        var constructorKeyword = this.eatKeyword(58 /* ConstructorKeyword */ );
        var parameterList = this.parseParameterList();
        var semicolonToken = null;
        var block = null;
        if(this.isBlock()) {
            block = this.parseBlock();
        } else {
            semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        }
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
    };
    Parser.prototype.isMemberFunctionDeclaration = function () {
        var rewindPoint = this.getRewindPoint();
        try  {
            if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() === 54 /* StaticKeyword */ ) {
                this.eatAnyToken();
            }
            return this.isFunctionSignature();
        }finally {
            this.rewind(rewindPoint);
            this.releaseRewindPoint(rewindPoint);
        }
    };
    Parser.prototype.parseMemberFunctionDeclaration = function () {
        Debug.assert(this.isMemberFunctionDeclaration());
        var publicOrPrivateKeyword = null;
        if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = this.tryEatKeyword(54 /* StaticKeyword */ );
        var functionSignature = this.parseFunctionSignature();
        var block = null;
        var semicolon = null;
        if(this.isBlock()) {
            block = this.parseBlock();
        } else {
            semicolon = this.eatExplicitOrAutomaticSemicolon(false);
        }
        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolon);
    };
    Parser.prototype.parseMemberVariableDeclaration = function () {
        Debug.assert(this.isMemberVariableDeclaration());
        var publicOrPrivateKeyword = null;
        if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = this.tryEatKeyword(54 /* StaticKeyword */ );
        var variableDeclarator = this.parseVariableDeclarator(true);
        var semicolon = this.eatExplicitOrAutomaticSemicolon(false);
        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolon);
    };
    Parser.prototype.parseClassElement = function () {
        Debug.assert(this.isClassElement());
        if(this.isConstructorDeclaration()) {
            return this.parseConstructorDeclaration();
        } else {
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
        }
    };
    Parser.prototype.isFunctionDeclaration = function () {
        var token0 = this.currentToken();
        if(token0.keywordKind() === 23 /* FunctionKeyword */ ) {
            return true;
        }
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 43 /* ExportKeyword */  && token1.keywordKind() === 23 /* FunctionKeyword */ ) {
            return true;
        }
        return token0.keywordKind() === 59 /* DeclareKeyword */  && token1.keywordKind() === 23 /* FunctionKeyword */ ;
    };
    Parser.prototype.parseFunctionDeclaration = function () {
        Debug.assert(this.isFunctionDeclaration());
        var exportKeyword = this.tryEatKeyword(43 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(59 /* DeclareKeyword */ );
        var functionKeyword = this.eatKeyword(23 /* FunctionKeyword */ );
        var functionSignature = this.parseFunctionSignature();
        var semicolonToken = null;
        var block = null;
        if(this.isBlock()) {
            block = this.parseBlock();
        } else {
            semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        }
        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
    };
    Parser.prototype.isModuleDeclaration = function () {
        var token0 = this.currentToken();
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 43 /* ExportKeyword */  && token1.keywordKind() === 61 /* ModuleKeyword */ ) {
            return true;
        }
        if(token0.keywordKind() === 59 /* DeclareKeyword */  && token1.keywordKind() === 61 /* ModuleKeyword */ ) {
            return true;
        }
        if(token0.keywordKind() === 61 /* ModuleKeyword */ ) {
            if(token1.tokenKind === 65 /* OpenBraceToken */ ) {
                return true;
            }
            if(token1.tokenKind === 7 /* IdentifierNameToken */ ) {
                var token2 = this.peekTokenN(2);
                if(token2.tokenKind === 65 /* OpenBraceToken */ ) {
                    return true;
                }
                if(token2.tokenKind === 71 /* DotToken */ ) {
                    return true;
                }
            }
        }
        return false;
    };
    Parser.prototype.parseModuleDeclaration = function () {
        Debug.assert(this.isModuleDeclaration());
        var exportKeyword = this.tryEatKeyword(43 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(59 /* DeclareKeyword */ );
        var moduleKeyword = this.eatKeyword(61 /* ModuleKeyword */ );
        var moduleName = null;
        var stringLiteral = null;
        if(this.isName()) {
            moduleName = this.parseName();
        } else {
            if(this.currentToken().tokenKind === 10 /* StringLiteral */ ) {
                stringLiteral = this.eatToken(10 /* StringLiteral */ );
            }
        }
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var moduleElements = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            moduleElements = this.parseSyntaxList(4 /* ModuleDeclaration_ModuleElements */ );
        }
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken);
    };
    Parser.prototype.isInterfaceDeclaration = function () {
        if(this.currentToken().keywordKind() === 43 /* ExportKeyword */  && this.peekTokenN(1).keywordKind() === 48 /* InterfaceKeyword */ ) {
            return true;
        }
        return this.currentToken().keywordKind() === 48 /* InterfaceKeyword */  && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseInterfaceDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === 43 /* ExportKeyword */  || this.currentToken().keywordKind() === 48 /* InterfaceKeyword */ );
        var exportKeyword = this.tryEatKeyword(43 /* ExportKeyword */ );
        var interfaceKeyword = this.eatKeyword(48 /* InterfaceKeyword */ );
        var identifier = this.eatIdentifierToken();
        var extendsClause = null;
        if(this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }
        var objectType = this.parseObjectType();
        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, objectType);
    };
    Parser.prototype.parseObjectType = function () {
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var typeMembers = SeparatedSyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            typeMembers = this.parseSeparatedSyntaxList(256 /* ObjectType_TypeMembers */ );
        }
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken);
    };
    Parser.prototype.isTypeMember = function () {
        return this.isCallSignature() || this.isConstructSignature() || this.isIndexSignature() || this.isFunctionSignature() || this.isPropertySignature();
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
                            throw Errors.invalidOperation();
                        }
                    }
                }
            }
        }
    };
    Parser.prototype.parseConstructSignature = function () {
        Debug.assert(this.isConstructSignature());
        var newKeyword = this.eatKeyword(27 /* NewKeyword */ );
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
    };
    Parser.prototype.parseIndexSignature = function () {
        Debug.assert(this.isIndexSignature());
        var openBracketToken = this.eatToken(69 /* OpenBracketToken */ );
        var parameter = this.parseParameter();
        var closeBracketToken = this.eatToken(70 /* CloseBracketToken */ );
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
    };
    Parser.prototype.parseFunctionSignature = function () {
        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(100 /* QuestionToken */ );
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
    };
    Parser.prototype.parsePropertySignature = function () {
        Debug.assert(this.isPropertySignature());
        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(100 /* QuestionToken */ );
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    };
    Parser.prototype.isCallSignature = function () {
        return this.currentToken().tokenKind === 67 /* OpenParenToken */ ;
    };
    Parser.prototype.isConstructSignature = function () {
        return this.currentToken().keywordKind() === 27 /* NewKeyword */ ;
    };
    Parser.prototype.isIndexSignature = function () {
        return this.currentToken().tokenKind === 69 /* OpenBracketToken */ ;
    };
    Parser.prototype.isFunctionSignature = function () {
        if(this.isIdentifier(this.currentToken())) {
            if(this.peekTokenN(1).tokenKind === 67 /* OpenParenToken */ ) {
                return true;
            }
            if(this.peekTokenN(1).tokenKind === 100 /* QuestionToken */  && this.peekTokenN(2).tokenKind === 67 /* OpenParenToken */ ) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.isPropertySignature = function () {
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.isExtendsClause = function () {
        return this.currentToken().keywordKind() === 44 /* ExtendsKeyword */ ;
    };
    Parser.prototype.parseExtendsClause = function () {
        Debug.assert(this.isExtendsClause());
        var extendsKeyword = this.eatKeyword(44 /* ExtendsKeyword */ );
        var typeNames = this.parseSeparatedSyntaxList(512 /* ExtendsOrImplementsClause_TypeNameList */ );
        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    };
    Parser.prototype.isImplementsClause = function () {
        return this.currentToken().keywordKind() === 47 /* ImplementsKeyword */ ;
    };
    Parser.prototype.parseImplementsClause = function () {
        Debug.assert(this.isImplementsClause());
        var implementsKeyword = this.eatKeyword(47 /* ImplementsKeyword */ );
        var typeNames = this.parseSeparatedSyntaxList(512 /* ExtendsOrImplementsClause_TypeNameList */ );
        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    };
    Parser.prototype.isStatement = function (allowFunctionDeclaration) {
        switch(this.currentToken().keywordKind()) {
            case 53 /* PublicKeyword */ :
            case 51 /* PrivateKeyword */ :
            case 54 /* StaticKeyword */ : {
                if(this.isClassElement()) {
                    return false;
                }

            }
        }
        return this.isVariableStatement() || this.isLabeledStatement() || (allowFunctionDeclaration && this.isFunctionDeclaration()) || this.isIfStatement() || this.isBlock() || this.isExpressionStatement() || this.isReturnStatement() || this.isSwitchStatement() || this.isThrowStatement() || this.isBreakStatement() || this.isContinueStatement() || this.isForOrForInStatement() || this.isEmptyStatement() || this.isWhileStatement() || this.isWithStatement() || this.isDoStatement() || this.isTryStatement() || this.isDebuggerStatement();
    };
    Parser.prototype.parseStatement = function (allowFunctionDeclaration) {
        if(this.isVariableStatement()) {
            return this.parseVariableStatement();
        } else {
            if(this.isLabeledStatement()) {
                return this.parseLabeledStatement();
            } else {
                if(allowFunctionDeclaration && this.isFunctionDeclaration()) {
                    return this.parseFunctionDeclaration();
                } else {
                    if(this.isIfStatement()) {
                        return this.parseIfStatement();
                    } else {
                        if(this.isBlock()) {
                            return this.parseBlock();
                        } else {
                            if(this.isReturnStatement()) {
                                return this.parseReturnStatement();
                            } else {
                                if(this.isSwitchStatement()) {
                                    return this.parseSwitchStatement();
                                } else {
                                    if(this.isThrowStatement()) {
                                        return this.parseThrowStatement();
                                    } else {
                                        if(this.isBreakStatement()) {
                                            return this.parseBreakStatement();
                                        } else {
                                            if(this.isContinueStatement()) {
                                                return this.parseContinueStatement();
                                            } else {
                                                if(this.isForOrForInStatement()) {
                                                    return this.parseForOrForInStatement();
                                                } else {
                                                    if(this.isEmptyStatement()) {
                                                        return this.parseEmptyStatement();
                                                    } else {
                                                        if(this.isWhileStatement()) {
                                                            return this.parseWhileStatement();
                                                        } else {
                                                            if(this.isWithStatement()) {
                                                                return this.parseWithStatement();
                                                            } else {
                                                                if(this.isDoStatement()) {
                                                                    return this.parseDoStatement();
                                                                } else {
                                                                    if(this.isTryStatement()) {
                                                                        return this.parseTryStatement();
                                                                    } else {
                                                                        if(this.isDebuggerStatement()) {
                                                                            return this.parseDebuggerStatement();
                                                                        } else {
                                                                            return this.parseExpressionStatement();
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
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
    Parser.prototype.isDebuggerStatement = function () {
        return this.currentToken().keywordKind() === 15 /* DebuggerKeyword */ ;
    };
    Parser.prototype.parseDebuggerStatement = function () {
        Debug.assert(this.isDebuggerStatement());
        var debuggerKeyword = this.eatKeyword(15 /* DebuggerKeyword */ );
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken);
    };
    Parser.prototype.isDoStatement = function () {
        return this.currentToken().keywordKind() === 18 /* DoKeyword */ ;
    };
    Parser.prototype.parseDoStatement = function () {
        Debug.assert(this.isDoStatement());
        var doKeyword = this.eatKeyword(18 /* DoKeyword */ );
        var statement = this.parseStatement(false);
        var whileKeyword = this.eatKeyword(38 /* WhileKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(true);
        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
    };
    Parser.prototype.isLabeledStatement = function () {
        return this.isIdentifier(this.currentToken()) && this.peekTokenN(1).tokenKind === 101 /* ColonToken */ ;
    };
    Parser.prototype.parseLabeledStatement = function () {
        Debug.assert(this.isLabeledStatement());
        var identifier = this.eatIdentifierToken();
        var colonToken = this.eatToken(101 /* ColonToken */ );
        var statement = this.parseStatement(false);
        return new LabeledStatement(identifier, colonToken, statement);
    };
    Parser.prototype.isTryStatement = function () {
        return this.currentToken().keywordKind() === 34 /* TryKeyword */ ;
    };
    Parser.prototype.parseTryStatement = function () {
        Debug.assert(this.isTryStatement());
        var tryKeyword = this.eatKeyword(34 /* TryKeyword */ );
        var block = this.parseBlock();
        var catchClause = null;
        if(this.isCatchClause()) {
            catchClause = this.parseCatchClause();
        }
        var finallyClause = null;
        if(this.isFinallyClause()) {
            finallyClause = this.parseFinallyClause();
        }
        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause);
    };
    Parser.prototype.isCatchClause = function () {
        return this.currentToken().keywordKind() === 13 /* CatchKeyword */ ;
    };
    Parser.prototype.parseCatchClause = function () {
        Debug.assert(this.isCatchClause());
        var catchKeyword = this.eatKeyword(13 /* CatchKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var identifier = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var block = this.parseBlock();
        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
    };
    Parser.prototype.isFinallyClause = function () {
        return this.currentToken().keywordKind() === 21 /* FinallyKeyword */ ;
    };
    Parser.prototype.parseFinallyClause = function () {
        Debug.assert(this.isFinallyClause());
        var finallyKeyword = this.eatKeyword(21 /* FinallyKeyword */ );
        var block = this.parseBlock();
        return new FinallyClauseSyntax(finallyKeyword, block);
    };
    Parser.prototype.isWithStatement = function () {
        return this.currentToken().keywordKind() === 39 /* WithKeyword */ ;
    };
    Parser.prototype.parseWithStatement = function () {
        Debug.assert(this.isWithStatement());
        var withKeyword = this.eatKeyword(39 /* WithKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement);
    };
    Parser.prototype.isWhileStatement = function () {
        return this.currentToken().keywordKind() === 38 /* WhileKeyword */ ;
    };
    Parser.prototype.parseWhileStatement = function () {
        Debug.assert(this.isWhileStatement());
        var whileKeyword = this.eatKeyword(38 /* WhileKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
    };
    Parser.prototype.isEmptyStatement = function () {
        return this.currentToken().tokenKind === 73 /* SemicolonToken */ ;
    };
    Parser.prototype.parseEmptyStatement = function () {
        Debug.assert(this.isEmptyStatement());
        var semicolonToken = this.eatToken(73 /* SemicolonToken */ );
        return new EmptyStatementSyntax(semicolonToken);
    };
    Parser.prototype.isForOrForInStatement = function () {
        return this.currentToken().keywordKind() === 22 /* ForKeyword */ ;
    };
    Parser.prototype.parseForOrForInStatement = function () {
        Debug.assert(this.isForOrForInStatement());
        var forKeyword = this.eatKeyword(22 /* ForKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var currentToken = this.currentToken();
        if(currentToken.keywordKind() === 36 /* VarKeyword */ ) {
            return this.parseForOrForInStatementWithVariableDeclaration(forKeyword, openParenToken);
        } else {
            if(currentToken.tokenKind === 73 /* SemicolonToken */ ) {
                return this.parseForStatement(forKeyword, openParenToken);
            } else {
                return this.parseForOrForInStatementWithInitializer(forKeyword, openParenToken);
            }
        }
    };
    Parser.prototype.parseForOrForInStatementWithVariableDeclaration = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === 22 /* ForKeyword */  && openParenToken.tokenKind === 67 /* OpenParenToken */ );
        Debug.assert(this.currentToken().keywordKind() === 36 /* VarKeyword */ );
        var variableDeclaration = this.parseVariableDeclaration(false);
        if(this.currentToken().keywordKind() === 25 /* InKeyword */ ) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
        }
        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
    };
    Parser.prototype.parseForInStatementWithVariableDeclarationOrInitializer = function (forKeyword, openParenToken, variableDeclaration, initializer) {
        Debug.assert(this.currentToken().keywordKind() === 25 /* InKeyword */ );
        var inKeyword = this.eatKeyword(25 /* InKeyword */ );
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, inKeyword, expression, closeParenToken, statement);
    };
    Parser.prototype.parseForOrForInStatementWithInitializer = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === 22 /* ForKeyword */  && openParenToken.tokenKind === 67 /* OpenParenToken */ );
        var initializer = this.parseExpression(false);
        if(this.currentToken().keywordKind() === 25 /* InKeyword */ ) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        } else {
            return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        }
    };
    Parser.prototype.parseForStatement = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === 22 /* ForKeyword */  && openParenToken.tokenKind === 67 /* OpenParenToken */ );
        var initializer = null;
        if(this.currentToken().tokenKind !== 73 /* SemicolonToken */  && this.currentToken().tokenKind !== 68 /* CloseParenToken */  && this.currentToken().tokenKind !== 116 /* EndOfFileToken */ ) {
            initializer = this.parseExpression(false);
        }
        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
    };
    Parser.prototype.parseForStatementWithVariableDeclarationOrInitializer = function (forKeyword, openParenToken, variableDeclaration, initializer) {
        var firstSemicolonToken = this.eatToken(73 /* SemicolonToken */ );
        var condition = null;
        if(this.currentToken().tokenKind !== 73 /* SemicolonToken */  && this.currentToken().tokenKind !== 68 /* CloseParenToken */  && this.currentToken().tokenKind !== 116 /* EndOfFileToken */ ) {
            condition = this.parseExpression(true);
        }
        var secondSemicolonToken = this.eatToken(73 /* SemicolonToken */ );
        var incrementor = null;
        if(this.currentToken().tokenKind !== 68 /* CloseParenToken */  && this.currentToken().tokenKind !== 116 /* EndOfFileToken */ ) {
            incrementor = this.parseExpression(true);
        }
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
    };
    Parser.prototype.isBreakStatement = function () {
        return this.currentToken().keywordKind() === 11 /* BreakKeyword */ ;
    };
    Parser.prototype.parseBreakStatement = function () {
        Debug.assert(this.isBreakStatement());
        var breakKeyword = this.eatKeyword(11 /* BreakKeyword */ );
        var identifier = null;
        if(!this.canEatExplicitOrAutomaticSemicolon(false)) {
            if(this.isIdentifier(this.currentToken())) {
                identifier = this.eatIdentifierToken();
            }
        }
        var semicolon = this.eatExplicitOrAutomaticSemicolon(false);
        return new BreakStatementSyntax(breakKeyword, identifier, semicolon);
    };
    Parser.prototype.isContinueStatement = function () {
        return this.currentToken().keywordKind() === 14 /* ContinueKeyword */ ;
    };
    Parser.prototype.parseContinueStatement = function () {
        Debug.assert(this.isContinueStatement());
        var continueKeyword = this.eatKeyword(14 /* ContinueKeyword */ );
        var identifier = null;
        if(!this.canEatExplicitOrAutomaticSemicolon(false)) {
            if(this.isIdentifier(this.currentToken())) {
                identifier = this.eatIdentifierToken();
            }
        }
        var semicolon = this.eatExplicitOrAutomaticSemicolon(false);
        return new ContinueStatementSyntax(continueKeyword, identifier, semicolon);
    };
    Parser.prototype.isSwitchStatement = function () {
        return this.currentToken().keywordKind() === 30 /* SwitchKeyword */ ;
    };
    Parser.prototype.parseSwitchStatement = function () {
        Debug.assert(this.isSwitchStatement());
        var switchKeyword = this.eatKeyword(30 /* SwitchKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var switchClauses = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            switchClauses = this.parseSyntaxList(8 /* SwitchStatement_SwitchClauses */ );
        }
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken);
    };
    Parser.prototype.isCaseSwitchClause = function () {
        return this.currentToken().keywordKind() === 12 /* CaseKeyword */ ;
    };
    Parser.prototype.isDefaultSwitchClause = function () {
        return this.currentToken().keywordKind() === 16 /* DefaultKeyword */ ;
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
        var caseKeyword = this.eatKeyword(12 /* CaseKeyword */ );
        var expression = this.parseExpression(true);
        var colonToken = this.eatToken(101 /* ColonToken */ );
        var statements = this.parseSyntaxList(16 /* SwitchClause_Statements */ );
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    };
    Parser.prototype.parseDefaultSwitchClause = function () {
        Debug.assert(this.isDefaultSwitchClause());
        var defaultKeyword = this.eatKeyword(16 /* DefaultKeyword */ );
        var colonToken = this.eatToken(101 /* ColonToken */ );
        var statements = this.parseSyntaxList(16 /* SwitchClause_Statements */ );
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
    };
    Parser.prototype.isThrowStatement = function () {
        return this.currentToken().keywordKind() === 32 /* ThrowKeyword */ ;
    };
    Parser.prototype.parseThrowStatement = function () {
        Debug.assert(this.isThrowStatement());
        var throwKeyword = this.eatKeyword(32 /* ThrowKeyword */ );
        var expression = null;
        if(this.canEatExplicitOrAutomaticSemicolon(false)) {
            var token = this.createMissingToken(7 /* IdentifierNameToken */ , 0 /* None */ , null);
            expression = new IdentifierNameSyntax(token);
        } else {
            expression = this.parseExpression(true);
        }
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
    };
    Parser.prototype.isReturnStatement = function () {
        return this.currentToken().keywordKind() === 29 /* ReturnKeyword */ ;
    };
    Parser.prototype.parseReturnStatement = function () {
        Debug.assert(this.isReturnStatement());
        var returnKeyword = this.eatKeyword(29 /* ReturnKeyword */ );
        var expression = null;
        if(!this.canEatExplicitOrAutomaticSemicolon(false)) {
            expression = this.parseExpression(true);
        }
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
    };
    Parser.prototype.isExpressionStatement = function () {
        var currentToken = this.currentToken();
        var kind = currentToken.tokenKind;
        if(kind === 65 /* OpenBraceToken */ ) {
            return false;
        }
        var keywordKind = currentToken.keywordKind();
        if(keywordKind === 23 /* FunctionKeyword */ ) {
            return false;
        }
        return this.isExpression();
    };
    Parser.prototype.isAssignmentOrOmittedExpression = function () {
        if(this.currentToken().tokenKind === 74 /* CommaToken */ ) {
            return true;
        }
        return this.isExpression();
    };
    Parser.prototype.parseAssignmentOrOmittedExpression = function () {
        Debug.assert(this.isAssignmentOrOmittedExpression());
        if(this.currentToken().tokenKind === 74 /* CommaToken */ ) {
            return new OmittedExpressionSyntax();
        }
        return this.parseAssignmentExpression(true);
    };
    Parser.prototype.isExpression = function () {
        var currentToken = this.currentToken();
        var kind = currentToken.tokenKind;
        switch(kind) {
            case 9 /* NumericLiteral */ :
            case 10 /* StringLiteral */ :
            case 8 /* RegularExpressionLiteral */ : {
                return true;

            }
            case 69 /* OpenBracketToken */ :
            case 67 /* OpenParenToken */ : {
                return true;

            }
            case 75 /* LessThanToken */ : {
                return true;

            }
            case 88 /* PlusPlusToken */ :
            case 89 /* MinusMinusToken */ :
            case 84 /* PlusToken */ :
            case 85 /* MinusToken */ :
            case 97 /* TildeToken */ :
            case 96 /* ExclamationToken */ : {
                return true;

            }
            case 65 /* OpenBraceToken */ : {
                return true;

            }
            case 80 /* EqualsGreaterThanToken */ : {
                return true;

            }
            case 113 /* SlashToken */ :
            case 114 /* SlashEqualsToken */ : {
                return true;

            }
        }
        var keywordKind = currentToken.keywordKind();
        switch(keywordKind) {
            case 46 /* SuperKeyword */ :
            case 31 /* ThisKeyword */ :
            case 33 /* TrueKeyword */ :
            case 20 /* FalseKeyword */ :
            case 28 /* NullKeyword */ : {
                return true;

            }
            case 27 /* NewKeyword */ : {
                return true;

            }
            case 17 /* DeleteKeyword */ :
            case 37 /* VoidKeyword */ :
            case 35 /* TypeOfKeyword */ : {
                return true;

            }
            case 23 /* FunctionKeyword */ : {
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
        var semicolon = this.eatExplicitOrAutomaticSemicolon(false);
        return new ExpressionStatementSyntax(expression, semicolon);
    };
    Parser.prototype.isIfStatement = function () {
        return this.currentToken().keywordKind() === 24 /* IfKeyword */ ;
    };
    Parser.prototype.parseIfStatement = function () {
        Debug.assert(this.isIfStatement());
        var ifKeyword = this.eatKeyword(24 /* IfKeyword */ );
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        var elseClause = null;
        if(this.isElseClause()) {
            elseClause = this.parseElseClause();
        }
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
    };
    Parser.prototype.isElseClause = function () {
        return this.currentToken().keywordKind() === 19 /* ElseKeyword */ ;
    };
    Parser.prototype.parseElseClause = function () {
        Debug.assert(this.isElseClause());
        var elseKeyword = this.eatKeyword(19 /* ElseKeyword */ );
        var statement = this.parseStatement(false);
        return new ElseClauseSyntax(elseKeyword, statement);
    };
    Parser.prototype.isVariableStatement = function () {
        var token0 = this.currentToken();
        if(token0.keywordKind() === 36 /* VarKeyword */ ) {
            return true;
        }
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 43 /* ExportKeyword */  && token1.keywordKind() === 36 /* VarKeyword */ ) {
            return true;
        }
        return token0.keywordKind() === 59 /* DeclareKeyword */  && token1.keywordKind() === 36 /* VarKeyword */ ;
    };
    Parser.prototype.parseVariableStatement = function () {
        Debug.assert(this.isVariableStatement());
        var exportKeyword = this.tryEatKeyword(43 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(59 /* DeclareKeyword */ );
        var variableDeclaration = this.parseVariableDeclaration(true);
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
    };
    Parser.prototype.parseVariableDeclaration = function (allowIn) {
        Debug.assert(this.currentToken().keywordKind() === 36 /* VarKeyword */ );
        var varKeyword = this.eatKeyword(36 /* VarKeyword */ );
        var listParsingState = allowIn ? 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */  : 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ ;
        var variableDeclarators = this.parseSeparatedSyntaxList(listParsingState);
        return new VariableDeclarationSyntax(varKeyword, variableDeclarators);
    };
    Parser.prototype.isVariableDeclarator = function () {
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.parseVariableDeclarator = function (allowIn) {
        var identifier = this.eatIdentifierToken();
        var equalsValueClause = null;
        var typeAnnotation = null;
        if(!identifier.isMissing()) {
            typeAnnotation = this.parseOptionalTypeAnnotation();
            if(this.isEqualsValueClause()) {
                equalsValueClause = this.parseEqualsValuesClause(allowIn);
            }
        }
        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
    };
    Parser.prototype.isEqualsValueClause = function () {
        return this.currentToken().tokenKind === 102 /* EqualsToken */ ;
    };
    Parser.prototype.parseEqualsValuesClause = function (allowIn) {
        Debug.assert(this.isEqualsValueClause());
        var equalsToken = this.eatToken(102 /* EqualsToken */ );
        var value = this.parseAssignmentExpression(allowIn);
        return new EqualsValueClauseSyntax(equalsToken, value);
    };
    Parser.prototype.parseExpression = function (allowIn) {
        return this.parseSubExpression(0, allowIn);
    };
    Parser.prototype.parseAssignmentExpression = function (allowIn) {
        return this.parseSubExpression(2 /* AssignmentExpressionPrecedence */ , allowIn);
    };
    Parser.prototype.parseUnaryExpression = function () {
        var currentTokenKind = this.currentToken().tokenKind;
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
        leftOperand = this.parseBinaryOrConditionalExpressions(precedence, allowIn, leftOperand);
        return leftOperand;
    };
    Parser.prototype.parseBinaryOrConditionalExpressions = function (precedence, allowIn, leftOperand) {
        while(true) {
            var currentTokenKind = this.currentToken().tokenKind;
            var currentTokenKeywordKind = this.currentToken().keywordKind();
            if(currentTokenKeywordKind === 26 /* InstanceOfKeyword */  || currentTokenKeywordKind === 25 /* InKeyword */ ) {
                currentTokenKind = currentTokenKeywordKind;
            }
            if(SyntaxFacts.isBinaryExpressionOperatorToken(currentTokenKind)) {
                if(currentTokenKind === 25 /* InKeyword */  && !allowIn) {
                    break;
                }
                var binaryExpressionKind = SyntaxFacts.getBinaryExpressionFromOperatorToken(currentTokenKind);
                var newPrecedence = Parser.getPrecedence(binaryExpressionKind);
                Debug.assert(newPrecedence > 0);
                if(newPrecedence < precedence) {
                    break;
                }
                if(newPrecedence === precedence && !this.isRightAssociative(binaryExpressionKind)) {
                    break;
                }
                var operatorToken = this.eatAnyToken();
                leftOperand = new BinaryExpressionSyntax(binaryExpressionKind, leftOperand, operatorToken, this.parseSubExpression(newPrecedence, allowIn));
                continue;
            }
            if(currentTokenKind === 100 /* QuestionToken */  && precedence <= 3 /* ConditionalExpressionPrecedence */ ) {
                var questionToken = this.eatToken(100 /* QuestionToken */ );
                var whenTrueExpression = this.parseAssignmentExpression(allowIn);
                var colon = this.eatToken(101 /* ColonToken */ );
                var whenFalseExpression = this.parseAssignmentExpression(allowIn);
                leftOperand = new ConditionalExpressionSyntax(leftOperand, questionToken, whenTrueExpression, colon, whenFalseExpression);
                continue;
            }
            break;
        }
        return leftOperand;
    };
    Parser.prototype.isRightAssociative = function (expressionKind) {
        switch(expressionKind) {
            case 169 /* AssignmentExpression */ :
            case 170 /* AddAssignmentExpression */ :
            case 171 /* SubtractAssignmentExpression */ :
            case 172 /* MultiplyAssignmentExpression */ :
            case 173 /* DivideAssignmentExpression */ :
            case 174 /* ModuloAssignmentExpression */ :
            case 175 /* AndAssignmentExpression */ :
            case 176 /* ExclusiveOrAssignmentExpression */ :
            case 177 /* OrAssignmentExpression */ :
            case 178 /* LeftShiftAssignmentExpression */ :
            case 179 /* SignedRightShiftAssignmentExpression */ :
            case 180 /* UnsignedRightShiftAssignmentExpression */ : {
                return true;

            }
            default: {
                return false;

            }
        }
    };
    Parser.prototype.parseTerm = function (allowInvocation, insideObjectCreation) {
        var term = this.parseTermWorker(insideObjectCreation);
        if(term.isMissing()) {
            return term;
        }
        return this.parsePostFixExpression(term, allowInvocation);
    };
    Parser.prototype.parsePostFixExpression = function (expression, allowInvocation) {
        Debug.assert(expression !== null);
        while(true) {
            var currentTokenKind = this.currentToken().tokenKind;
            switch(currentTokenKind) {
                case 67 /* OpenParenToken */ : {
                    if(!allowInvocation) {
                        return expression;
                    }
                    expression = new InvocationExpressionSyntax(expression, this.parseArgumentList());
                    break;

                }
                case 69 /* OpenBracketToken */ : {
                    expression = this.parseElementAccessExpression(expression);
                    break;

                }
                case 88 /* PlusPlusToken */ :
                case 89 /* MinusMinusToken */ : {
                    if(this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
                        return expression;
                    }
                    expression = new PostfixUnaryExpressionSyntax(SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken(currentTokenKind), expression, this.eatAnyToken());
                    break;

                }
                case 71 /* DotToken */ : {
                    expression = new MemberAccessExpressionSyntax(expression, this.eatToken(71 /* DotToken */ ), this.parseIdentifierName());
                    break;

                }
                default: {
                    return expression;

                }
            }
        }
    };
    Parser.prototype.isArgumentList = function () {
        return this.currentToken().tokenKind === 67 /* OpenParenToken */ ;
    };
    Parser.prototype.parseArgumentList = function () {
        Debug.assert(this.isArgumentList());
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var arguments = this.parseSeparatedSyntaxList(4096 /* ArgumentList_AssignmentExpressions */ );
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        return new ArgumentListSyntax(openParenToken, arguments, closeParenToken);
    };
    Parser.prototype.parseElementAccessExpression = function (expression) {
        Debug.assert(this.currentToken().tokenKind === 69 /* OpenBracketToken */ );
        var openBracketToken = this.eatToken(69 /* OpenBracketToken */ );
        var argumentExpression = this.parseExpression(true);
        var closeBracketToken = this.eatToken(70 /* CloseBracketToken */ );
        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    };
    Parser.prototype.parseTermWorker = function (insideObjectCreation) {
        var currentToken = this.currentToken();
        if(insideObjectCreation) {
            if(this.isType(false, false)) {
                return this.parseType(true);
            }
        }
        if(currentToken.tokenKind === 80 /* EqualsGreaterThanToken */ ) {
            return this.parseSimpleArrowFunctionExpression();
        }
        if(this.isIdentifier(currentToken)) {
            if(this.isSimpleArrowFunctionExpression()) {
                return this.parseSimpleArrowFunctionExpression();
            } else {
                var identifier = this.eatIdentifierToken();
                return new IdentifierNameSyntax(identifier);
            }
        }
        var currentTokenKind = currentToken.tokenKind;
        var currentTokenKeywordKind = currentToken.keywordKind();
        switch(currentTokenKeywordKind) {
            case 31 /* ThisKeyword */ : {
                return this.parseThisExpression();

            }
            case 33 /* TrueKeyword */ :
            case 20 /* FalseKeyword */ : {
                return this.parseLiteralExpression(163 /* BooleanLiteralExpression */ );

            }
            case 28 /* NullKeyword */ : {
                return this.parseLiteralExpression(164 /* NullLiteralExpression */ );

            }
            case 27 /* NewKeyword */ : {
                return this.parseObjectCreationExpression();

            }
            case 23 /* FunctionKeyword */ : {
                return this.parseFunctionExpression();

            }
            case 46 /* SuperKeyword */ : {
                return this.parseSuperExpression();

            }
            case 35 /* TypeOfKeyword */ : {
                return this.parseTypeOfExpression();

            }
            case 17 /* DeleteKeyword */ : {
                return this.parseDeleteExpression();

            }
            case 37 /* VoidKeyword */ : {
                return this.parseVoidExpression();

            }
        }
        switch(currentTokenKind) {
            case 9 /* NumericLiteral */ : {
                return this.parseLiteralExpression(165 /* NumericLiteralExpression */ );

            }
            case 8 /* RegularExpressionLiteral */ : {
                return this.parseLiteralExpression(166 /* RegularExpressionLiteralExpression */ );

            }
            case 10 /* StringLiteral */ : {
                return this.parseLiteralExpression(167 /* StringLiteralExpression */ );

            }
            case 69 /* OpenBracketToken */ : {
                return this.parseArrayLiteralExpression();

            }
            case 65 /* OpenBraceToken */ : {
                return this.parseObjectLiteralExpression();

            }
            case 67 /* OpenParenToken */ : {
                return this.parseParenthesizedOrArrowFunctionExpression();

            }
            case 75 /* LessThanToken */ : {
                return this.parseCastExpression();

            }
            case 113 /* SlashToken */ :
            case 114 /* SlashEqualsToken */ : {
                var result = this.tryReparseDivideAsRegularExpression();
                if(result !== null) {
                    return result;
                }
                break;

            }
        }
        return new IdentifierNameSyntax(this.eatIdentifierToken());
    };
    Parser.prototype.tryReparseDivideAsRegularExpression = function () {
        var currentToken = this.currentToken();
        var currentTokenKind = currentToken.tokenKind;
        Debug.assert(currentTokenKind === 113 /* SlashToken */  || currentTokenKind === 114 /* SlashEqualsToken */ );
        if(this.previousToken !== null) {
            var previousTokenKind = this.previousToken.tokenKind;
            switch(previousTokenKind) {
                case 7 /* IdentifierNameToken */ : {
                    var previousTokenKeywordKind = this.previousToken.keywordKind();
                    if(previousTokenKeywordKind === 0 /* None */  || previousTokenKeywordKind === 31 /* ThisKeyword */  || previousTokenKeywordKind === 33 /* TrueKeyword */  || previousTokenKeywordKind === 20 /* FalseKeyword */ ) {
                        return null;
                    }
                    break;

                }
                case 10 /* StringLiteral */ :
                case 9 /* NumericLiteral */ :
                case 8 /* RegularExpressionLiteral */ :
                case 88 /* PlusPlusToken */ :
                case 89 /* MinusMinusToken */ :
                case 70 /* CloseBracketToken */ :
                case 66 /* CloseBraceToken */ : {
                    return null;

                }
            }
        }
        var slashTokenFullStart = currentToken.fullStart();
        var tokenDiagnosticsLength = this.tokenDiagnostics.length;
        while(tokenDiagnosticsLength > 0) {
            var diagnostic = this.tokenDiagnostics[tokenDiagnosticsLength - 1];
            if(diagnostic.position() >= slashTokenFullStart) {
                tokenDiagnosticsLength--;
            } else {
                break;
            }
        }
        this.tokenDiagnostics.length = tokenDiagnosticsLength;
        this.disgardAllItemsFromCurrentIndexOnwards();
        this._currentToken = null;
        this.scanner.setAbsoluteIndex(slashTokenFullStart);
        currentToken = this.currentTokenAllowingRegularExpression();
        Debug.assert(currentToken.tokenKind === 113 /* SlashToken */  || currentToken.tokenKind === 114 /* SlashEqualsToken */  || currentToken.tokenKind === 8 /* RegularExpressionLiteral */ );
        if(currentToken.tokenKind === 113 /* SlashToken */  || currentToken.tokenKind === 114 /* SlashEqualsToken */ ) {
            return null;
        } else {
            if(currentToken.tokenKind === 8 /* RegularExpressionLiteral */ ) {
                return this.parseLiteralExpression(166 /* RegularExpressionLiteralExpression */ );
            } else {
                throw Errors.invalidOperation();
            }
        }
    };
    Parser.prototype.parseTypeOfExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 35 /* TypeOfKeyword */ );
        var typeOfKeyword = this.eatKeyword(35 /* TypeOfKeyword */ );
        var expression = this.parseUnaryExpression();
        return new TypeOfExpressionSyntax(typeOfKeyword, expression);
    };
    Parser.prototype.parseDeleteExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 17 /* DeleteKeyword */ );
        var deleteKeyword = this.eatKeyword(17 /* DeleteKeyword */ );
        var expression = this.parseUnaryExpression();
        return new DeleteExpressionSyntax(deleteKeyword, expression);
    };
    Parser.prototype.parseVoidExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 37 /* VoidKeyword */ );
        var voidKeyword = this.eatKeyword(37 /* VoidKeyword */ );
        var expression = this.parseUnaryExpression();
        return new VoidExpressionSyntax(voidKeyword, expression);
    };
    Parser.prototype.parseSuperExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 46 /* SuperKeyword */ );
        var superKeyword = this.eatKeyword(46 /* SuperKeyword */ );
        return new SuperExpressionSyntax(superKeyword);
    };
    Parser.prototype.parseFunctionExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 23 /* FunctionKeyword */ );
        var functionKeyword = this.eatKeyword(23 /* FunctionKeyword */ );
        var identifier = null;
        if(this.isIdentifier(this.currentToken())) {
            identifier = this.eatIdentifierToken();
        }
        var callSignature = this.parseCallSignature();
        var block = this.parseBlock();
        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
    };
    Parser.prototype.parseCastExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 75 /* LessThanToken */ );
        var lessThanToken = this.eatToken(75 /* LessThanToken */ );
        var type = this.parseType(false);
        var greaterThanToken = this.eatToken(76 /* GreaterThanToken */ );
        var expression = this.parseUnaryExpression();
        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    };
    Parser.prototype.parseObjectCreationExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 27 /* NewKeyword */ );
        var newKeyword = this.eatKeyword(27 /* NewKeyword */ );
        var expression = this.parseTerm(false, true);
        var argumentList = null;
        if(this.isArgumentList()) {
            argumentList = this.parseArgumentList();
        }
        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    };
    Parser.prototype.parseParenthesizedOrArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 67 /* OpenParenToken */ );
        var result = this.tryParseArrowFunctionExpression();
        if(result !== null) {
            return result;
        }
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    };
    Parser.prototype.tryParseArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 67 /* OpenParenToken */ );
        if(this.isDefinitelyArrowFunctionExpression()) {
            return this.parseParenthesizedArrowFunctionExpression(false);
        }
        if(!this.isPossiblyArrowFunctionExpression()) {
            return null;
        }
        var rewindPoint = this.getRewindPoint();
        try  {
            var arrowFunction = this.parseParenthesizedArrowFunctionExpression(true);
            if(arrowFunction === null) {
                this.rewind(rewindPoint);
            }
            return arrowFunction;
        }finally {
            this.releaseRewindPoint(rewindPoint);
        }
    };
    Parser.prototype.parseParenthesizedArrowFunctionExpression = function (requireArrow) {
        Debug.assert(this.currentToken().tokenKind === 67 /* OpenParenToken */ );
        var callSignature = this.parseCallSignature();
        if(requireArrow && this.currentToken().tokenKind !== 80 /* EqualsGreaterThanToken */ ) {
            return null;
        }
        var equalsGreaterThanToken = this.eatToken(80 /* EqualsGreaterThanToken */ );
        var body = this.parseArrowFunctionBody();
        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
    };
    Parser.prototype.parseArrowFunctionBody = function () {
        if(this.isBlock()) {
            return this.parseBlock();
        } else {
            return this.parseAssignmentExpression(true);
        }
    };
    Parser.prototype.isSimpleArrowFunctionExpression = function () {
        if(this.currentToken().tokenKind === 80 /* EqualsGreaterThanToken */ ) {
            return true;
        }
        return this.isIdentifier(this.currentToken()) && this.peekTokenN(1).tokenKind === 80 /* EqualsGreaterThanToken */ ;
    };
    Parser.prototype.parseSimpleArrowFunctionExpression = function () {
        Debug.assert(this.isSimpleArrowFunctionExpression());
        var identifier = this.eatIdentifierToken();
        var equalsGreaterThanToken = this.eatToken(80 /* EqualsGreaterThanToken */ );
        var body = this.parseArrowFunctionBody();
        return new SimpleArrowFunctionExpression(identifier, equalsGreaterThanToken, body);
    };
    Parser.prototype.isBlock = function () {
        return this.currentToken().tokenKind === 65 /* OpenBraceToken */ ;
    };
    Parser.prototype.isDefinitelyArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 67 /* OpenParenToken */ );
        var token1 = this.peekTokenN(1);
        if(token1.tokenKind === 68 /* CloseParenToken */ ) {
            return true;
        }
        if(token1.tokenKind === 72 /* DotDotDotToken */ ) {
            return true;
        }
        if(!this.isIdentifier(token1)) {
            return false;
        }
        var token2 = this.peekTokenN(2);
        if(token2.tokenKind === 101 /* ColonToken */ ) {
            return true;
        }
        var token3 = this.peekTokenN(3);
        if(token2.tokenKind === 100 /* QuestionToken */ ) {
            if(token3.tokenKind === 101 /* ColonToken */  || token3.tokenKind === 68 /* CloseParenToken */  || token3.tokenKind === 74 /* CommaToken */ ) {
                return true;
            }
        }
        if(token2.tokenKind === 68 /* CloseParenToken */ ) {
            if(token3.tokenKind === 80 /* EqualsGreaterThanToken */ ) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.isPossiblyArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 67 /* OpenParenToken */ );
        var token1 = this.peekTokenN(1);
        if(!this.isIdentifier(token1)) {
            return false;
        }
        var token2 = this.peekTokenN(2);
        if(token2.tokenKind === 102 /* EqualsToken */ ) {
            return true;
        }
        if(token2.tokenKind === 74 /* CommaToken */ ) {
            return true;
        }
        if(token2.tokenKind === 68 /* CloseParenToken */ ) {
            var token3 = this.peekTokenN(3);
            if(token3.tokenKind === 101 /* ColonToken */ ) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.parseObjectLiteralExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 65 /* OpenBraceToken */ );
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var propertyAssignments = this.parseSeparatedSyntaxList(8192 /* ObjectLiteralExpression_PropertyAssignments */ );
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken);
    };
    Parser.prototype.parsePropertyAssignment = function () {
        Debug.assert(this.isPropertyAssignment(false));
        if(this.isGetAccessorPropertyAssignment()) {
            return this.parseGetAccessorPropertyAssignment();
        } else {
            if(this.isSetAccessorPropertyAssignment()) {
                return this.parseSetAccessorPropertyAssignment();
            } else {
                if(this.isSimplePropertyAssignment(false)) {
                    return this.parseSimplePropertyAssignment();
                } else {
                    throw Errors.invalidOperation();
                }
            }
        }
    };
    Parser.prototype.isPropertyAssignment = function (inErrorRecovery) {
        return this.isGetAccessorPropertyAssignment() || this.isSetAccessorPropertyAssignment() || this.isSimplePropertyAssignment(inErrorRecovery);
    };
    Parser.prototype.isGetAccessorPropertyAssignment = function () {
        return this.currentToken().keywordKind() === 60 /* GetKeyword */  && this.isPropertyName(this.peekTokenN(1), false);
    };
    Parser.prototype.parseGetAccessorPropertyAssignment = function () {
        Debug.assert(this.isGetAccessorPropertyAssignment());
        var getKeyword = this.eatKeyword(60 /* GetKeyword */ );
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var block = this.parseBlock();
        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
    };
    Parser.prototype.isSetAccessorPropertyAssignment = function () {
        return this.currentToken().keywordKind() === 63 /* SetKeyword */  && this.isPropertyName(this.peekTokenN(1), false);
    };
    Parser.prototype.parseSetAccessorPropertyAssignment = function () {
        Debug.assert(this.isSetAccessorPropertyAssignment());
        var setKeyword = this.eatKeyword(63 /* SetKeyword */ );
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var parameterName = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        var block = this.parseBlock();
        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
    };
    Parser.prototype.isSimplePropertyAssignment = function (inErrorRecovery) {
        return this.isPropertyName(this.currentToken(), inErrorRecovery);
    };
    Parser.prototype.parseSimplePropertyAssignment = function () {
        Debug.assert(this.isSimplePropertyAssignment(false));
        var propertyName = this.eatAnyToken();
        var colonToken = this.eatToken(101 /* ColonToken */ );
        var expression = this.parseAssignmentExpression(true);
        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    };
    Parser.prototype.isPropertyName = function (token, inErrorRecovery) {
        switch(token.tokenKind) {
            case 7 /* IdentifierNameToken */ : {
                if(inErrorRecovery) {
                    return !this.isKeyword(token.keywordKind());
                } else {
                    return true;
                }

            }
            case 10 /* StringLiteral */ :
            case 9 /* NumericLiteral */ : {
                return true;

            }
            default: {
                return false;

            }
        }
    };
    Parser.prototype.parseArrayLiteralExpression = function () {
        Debug.assert(this.currentToken().tokenKind === 69 /* OpenBracketToken */ );
        var openBracketToken = this.eatToken(69 /* OpenBracketToken */ );
        var expressions = this.parseSeparatedSyntaxList(16384 /* ArrayLiteralExpression_AssignmentExpressions */ );
        var closeBracketToken = this.eatToken(70 /* CloseBracketToken */ );
        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken);
    };
    Parser.prototype.parseLiteralExpression = function (expressionKind) {
        var literal = this.eatAnyToken();
        return new LiteralExpressionSyntax(expressionKind, literal);
    };
    Parser.prototype.parseThisExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 31 /* ThisKeyword */ );
        var thisKeyword = this.eatKeyword(31 /* ThisKeyword */ );
        return new ThisExpressionSyntax(thisKeyword);
    };
    Parser.prototype.parseBlock = function () {
        var openBraceToken = this.eatToken(65 /* OpenBraceToken */ );
        var statements = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            var savedIsInStrictMode = this.isInStrictMode;
            statements = this.parseSyntaxList(32 /* Block_Statements */ , Parser.updateStrictModeState);
            this.isInStrictMode = savedIsInStrictMode;
        }
        var closeBraceToken = this.eatToken(66 /* CloseBraceToken */ );
        return new BlockSyntax(openBraceToken, statements, closeBraceToken);
    };
    Parser.prototype.parseCallSignature = function () {
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new CallSignatureSyntax(parameterList, typeAnnotation);
    };
    Parser.prototype.parseParameterList = function () {
        var openParenToken = this.eatToken(67 /* OpenParenToken */ );
        var parameters = SeparatedSyntaxList.empty;
        if(!openParenToken.isMissing()) {
            parameters = this.parseSeparatedSyntaxList(32768 /* ParameterList_Parameters */ );
        }
        var closeParenToken = this.eatToken(68 /* CloseParenToken */ );
        return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
    };
    Parser.prototype.isTypeAnnotation = function () {
        return this.currentToken().tokenKind === 101 /* ColonToken */ ;
    };
    Parser.prototype.parseOptionalTypeAnnotation = function () {
        return this.isTypeAnnotation() ? this.parseTypeAnnotation() : null;
    };
    Parser.prototype.parseTypeAnnotation = function () {
        Debug.assert(this.isTypeAnnotation());
        var colonToken = this.eatToken(101 /* ColonToken */ );
        var type = this.parseType(false);
        return new TypeAnnotationSyntax(colonToken, type);
    };
    Parser.prototype.isType = function (allowFunctionType, allowConstructorType) {
        return this.isPredefinedType() || this.isTypeLiteral(allowFunctionType, allowConstructorType) || this.isName();
    };
    Parser.prototype.parseType = function (requireCompleteArraySuffix) {
        var type = this.parseNonArrayType();
        while(this.currentToken().tokenKind === 69 /* OpenBracketToken */ ) {
            if(requireCompleteArraySuffix && this.peekTokenN(1).tokenKind !== 70 /* CloseBracketToken */ ) {
                break;
            }
            var openBracketToken = this.eatToken(69 /* OpenBracketToken */ );
            var closeBracketToken = this.eatToken(70 /* CloseBracketToken */ );
            type = new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
        }
        return type;
    };
    Parser.prototype.parseNonArrayType = function () {
        if(this.isPredefinedType()) {
            return this.parsePredefinedType();
        } else {
            if(this.isTypeLiteral(true, true)) {
                return this.parseTypeLiteral();
            } else {
                return this.parseName();
            }
        }
    };
    Parser.prototype.parseTypeLiteral = function () {
        Debug.assert(this.isTypeLiteral(true, true));
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
        var equalsGreaterThanToken = this.eatToken(80 /* EqualsGreaterThanToken */ );
        var returnType = this.parseType(false);
        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, returnType);
    };
    Parser.prototype.parseConstructorType = function () {
        Debug.assert(this.isConstructorType());
        var newKeyword = this.eatKeyword(27 /* NewKeyword */ );
        var parameterList = this.parseParameterList();
        var equalsGreaterThanToken = this.eatToken(80 /* EqualsGreaterThanToken */ );
        var type = this.parseType(false);
        return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type);
    };
    Parser.prototype.isTypeLiteral = function (allowFunctionType, allowConstructorType) {
        if(this.isObjectType()) {
            return true;
        }
        if(allowFunctionType && this.isFunctionType()) {
            return true;
        }
        if(allowConstructorType && this.isConstructorType()) {
            return true;
        }
        return false;
    };
    Parser.prototype.isObjectType = function () {
        return this.currentToken().tokenKind === 65 /* OpenBraceToken */ ;
    };
    Parser.prototype.isFunctionType = function () {
        return this.currentToken().tokenKind === 67 /* OpenParenToken */ ;
    };
    Parser.prototype.isConstructorType = function () {
        return this.currentToken().keywordKind() === 27 /* NewKeyword */ ;
    };
    Parser.prototype.parsePredefinedType = function () {
        Debug.assert(this.isPredefinedType());
        var keyword = this.eatAnyToken();
        return new PredefinedTypeSyntax(keyword);
    };
    Parser.prototype.isPredefinedType = function () {
        switch(this.currentToken().keywordKind()) {
            case 56 /* AnyKeyword */ :
            case 62 /* NumberKeyword */ :
            case 57 /* BoolKeyword */ :
            case 64 /* StringKeyword */ :
            case 37 /* VoidKeyword */ : {
                return true;

            }
        }
        return false;
    };
    Parser.prototype.isParameter = function () {
        var token = this.currentToken();
        if(token.tokenKind === 72 /* DotDotDotToken */ ) {
            return true;
        }
        if(token.keywordKind() === 53 /* PublicKeyword */  || token.keywordKind() === 51 /* PrivateKeyword */ ) {
            return true;
        }
        return this.isIdentifier(token);
    };
    Parser.prototype.parseParameter = function () {
        var dotDotDotToken = this.tryEatToken(72 /* DotDotDotToken */ );
        var publicOrPrivateToken = null;
        if(this.currentToken().keywordKind() === 53 /* PublicKeyword */  || this.currentToken().keywordKind() === 51 /* PrivateKeyword */ ) {
            publicOrPrivateToken = this.eatAnyToken();
        }
        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(100 /* QuestionToken */ );
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        var equalsValueClause = null;
        if(this.isEqualsValueClause()) {
            equalsValueClause = this.parseEqualsValuesClause(true);
        }
        return new ParameterSyntax(dotDotDotToken, publicOrPrivateToken, identifier, questionToken, typeAnnotation, equalsValueClause);
    };
    Parser.prototype.parseSyntaxList = function (currentListType, processItems) {
        if (typeof processItems === "undefined") { processItems = null; }
        var savedListParsingState = this.listParsingState;
        this.listParsingState |= currentListType;
        var result = this.parseSyntaxListWorker(currentListType, processItems);
        this.listParsingState = savedListParsingState;
        return result;
    };
    Parser.prototype.parseSeparatedSyntaxList = function (currentListType) {
        var savedListParsingState = this.listParsingState;
        this.listParsingState |= currentListType;
        var result = this.parseSeparatedSyntaxListWorker(currentListType);
        this.listParsingState = savedListParsingState;
        return result;
    };
    Parser.prototype.abortParsingListOrMoveToNextToken = function (currentListType, itemCount) {
        this.reportUnexpectedTokenDiagnostic(currentListType);
        for(var state = ListParsingState.LastListParsingState; state >= ListParsingState.FirstListParsingState; state >>= 1) {
            if((this.listParsingState & state) !== 0) {
                if(this.isExpectedListTerminator(state, itemCount) || this.isExpectedListItem(state, true)) {
                    return true;
                }
            }
        }
        var token = this.currentToken();
        this.skippedTokens.push(token);
        this.moveToNextToken();
        return false;
    };
    Parser.prototype.tryParseExpectedListItem = function (currentListType, inErrorRecovery, items, processItems) {
        if(this.isExpectedListItem(currentListType, inErrorRecovery)) {
            var item = this.parseExpectedListItem(currentListType);
            Debug.assert(item !== null);
            items = items || [];
            items.push(item);
            if(processItems !== null) {
                processItems(this, items);
            }
        }
        return items;
    };
    Parser.prototype.listIsTerminated = function (currentListType, itemCount) {
        return this.isExpectedListTerminator(currentListType, itemCount) || this.currentToken().tokenKind === 116 /* EndOfFileToken */ ;
    };
    Parser.prototype.parseSyntaxListWorker = function (currentListType, processItems) {
        var items = null;
        while(true) {
            var itemsCount = items === null ? 0 : items.length;
            if(this.listIsTerminated(currentListType, itemsCount)) {
                break;
            }
            items = this.tryParseExpectedListItem(currentListType, false, items, processItems);
            if(items !== null && items.length > itemsCount) {
                continue;
            }
            var abort = this.abortParsingListOrMoveToNextToken(currentListType, itemsCount);
            if(abort) {
                break;
            }
        }
        return SyntaxList.create(items);
    };
    Parser.prototype.parseSeparatedSyntaxListWorker = function (currentListType) {
        var items = null;
        var allowTrailingSeparator = this.allowsTrailingSeparator(currentListType);
        var allowAutomaticSemicolonInsertion = this.allowsAutomaticSemicolonInsertion(currentListType);
        var requiresAtLeastOneItem = this.requiresAtLeastOneItem(currentListType);
        var separatorKind = this.separatorKind(currentListType);
        var lastSeparator = null;
        var inErrorRecovery = false;
        while(true) {
            var itemsCount = items === null ? 0 : items.length;
            if(this.listIsTerminated(currentListType, itemsCount)) {
                if(lastSeparator !== null && !allowTrailingSeparator && !lastSeparator.isMissing()) {
                    this.addDiagnostic(new SyntaxDiagnostic(lastSeparator.start(), lastSeparator.width(), 9 /* Trailing_separator_not_allowed */ , null));
                }
                break;
            }
            items = this.tryParseExpectedListItem(currentListType, inErrorRecovery, items, null);
            inErrorRecovery = false;
            if(items !== null && items.length > itemsCount) {
                if(this.currentToken().tokenKind !== separatorKind) {
                    if(this.listIsTerminated(currentListType, items.length)) {
                        break;
                    }
                    if(allowAutomaticSemicolonInsertion && this.canEatAutomaticSemicolon(false)) {
                        lastSeparator = this.eatExplicitOrAutomaticSemicolon(false);
                        items.push(lastSeparator);
                        continue;
                    }
                }
                lastSeparator = this.eatToken(separatorKind);
                items.push(lastSeparator);
                inErrorRecovery = lastSeparator.isMissing();
                continue;
            }
            var abort = this.abortParsingListOrMoveToNextToken(currentListType, itemsCount);
            if(abort) {
                break;
            }
        }
        if(requiresAtLeastOneItem && (items === null || items.length === 0)) {
            this.reportUnexpectedTokenDiagnostic(currentListType);
        }
        return SeparatedSyntaxList.create(items);
    };
    Parser.prototype.allowsTrailingSeparator = function (currentListType) {
        switch(currentListType) {
            case 128 /* EnumDeclaration_VariableDeclarators */ :
            case 256 /* ObjectType_TypeMembers */ :
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ :
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return true;

            }
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ :
            case 4096 /* ArgumentList_AssignmentExpressions */ :
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ :
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ :
            case 32768 /* ParameterList_Parameters */ : {
                return false;

            }
            case 1 /* SourceUnit_ModuleElements */ :
            case 2 /* ClassDeclaration_ClassElements */ :
            case 4 /* ModuleDeclaration_ModuleElements */ :
            case 8 /* SwitchStatement_SwitchClauses */ :
            case 16 /* SwitchClause_Statements */ :
            case 32 /* Block_Statements */ :
            default: {
                throw Errors.notYetImplemented();

            }
        }
    };
    Parser.prototype.requiresAtLeastOneItem = function (currentListType) {
        switch(currentListType) {
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ :
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ :
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ : {
                return true;

            }
            case 256 /* ObjectType_TypeMembers */ :
            case 128 /* EnumDeclaration_VariableDeclarators */ :
            case 4096 /* ArgumentList_AssignmentExpressions */ :
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ :
            case 32768 /* ParameterList_Parameters */ :
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return false;

            }
            case 1 /* SourceUnit_ModuleElements */ :
            case 2 /* ClassDeclaration_ClassElements */ :
            case 4 /* ModuleDeclaration_ModuleElements */ :
            case 8 /* SwitchStatement_SwitchClauses */ :
            case 16 /* SwitchClause_Statements */ :
            case 32 /* Block_Statements */ :
            default: {
                throw Errors.notYetImplemented();

            }
        }
    };
    Parser.prototype.allowsAutomaticSemicolonInsertion = function (currentListType) {
        switch(currentListType) {
            case 256 /* ObjectType_TypeMembers */ : {
                return true;

            }
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ :
            case 128 /* EnumDeclaration_VariableDeclarators */ :
            case 4096 /* ArgumentList_AssignmentExpressions */ :
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ :
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ :
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ :
            case 32768 /* ParameterList_Parameters */ :
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return false;

            }
            case 1 /* SourceUnit_ModuleElements */ :
            case 2 /* ClassDeclaration_ClassElements */ :
            case 4 /* ModuleDeclaration_ModuleElements */ :
            case 8 /* SwitchStatement_SwitchClauses */ :
            case 16 /* SwitchClause_Statements */ :
            case 32 /* Block_Statements */ :
            default: {
                throw Errors.notYetImplemented();

            }
        }
    };
    Parser.prototype.separatorKind = function (currentListType) {
        switch(currentListType) {
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ :
            case 4096 /* ArgumentList_AssignmentExpressions */ :
            case 128 /* EnumDeclaration_VariableDeclarators */ :
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ :
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ :
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ :
            case 32768 /* ParameterList_Parameters */ :
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return 74 /* CommaToken */ ;

            }
            case 256 /* ObjectType_TypeMembers */ : {
                return 73 /* SemicolonToken */ ;

            }
            case 1 /* SourceUnit_ModuleElements */ :
            case 2 /* ClassDeclaration_ClassElements */ :
            case 4 /* ModuleDeclaration_ModuleElements */ :
            case 8 /* SwitchStatement_SwitchClauses */ :
            case 16 /* SwitchClause_Statements */ :
            case 32 /* Block_Statements */ :
            default: {
                throw Errors.notYetImplemented();

            }
        }
    };
    Parser.prototype.existingDiagnosticAtPosition = function (position) {
        return this.diagnostics.length > 0 && this.diagnostics[this.diagnostics.length - 1].position() === position;
    };
    Parser.prototype.reportUnexpectedTokenDiagnostic = function (listType) {
        var token = this.currentToken();
        var diagnostic = new SyntaxDiagnostic(token.start(), token.width(), 8 /* Unexpected_token__0_expected */ , [
            this.getExpectedListElementType(listType)
        ]);
        this.addDiagnostic(diagnostic);
    };
    Parser.prototype.addDiagnostic = function (diagnostic) {
        if(this.diagnostics.length > 0 && this.diagnostics[this.diagnostics.length - 1].position() === diagnostic.position()) {
            return;
        }
        this.diagnostics.push(diagnostic);
    };
    Parser.prototype.isExpectedListTerminator = function (currentListType, itemCount) {
        switch(currentListType) {
            case 1 /* SourceUnit_ModuleElements */ : {
                return this.isExpectedSourceUnit_ModuleElementsTerminator();

            }
            case 2 /* ClassDeclaration_ClassElements */ : {
                return this.isExpectedClassDeclaration_ClassElementsTerminator();

            }
            case 4 /* ModuleDeclaration_ModuleElements */ : {
                return this.isExpectedModuleDeclaration_ModuleElementsTerminator();

            }
            case 8 /* SwitchStatement_SwitchClauses */ : {
                return this.isExpectedSwitchStatement_SwitchClausesTerminator();

            }
            case 16 /* SwitchClause_Statements */ : {
                return this.isExpectedSwitchClause_StatementsTerminator();

            }
            case 32 /* Block_Statements */ : {
                return this.isExpectedBlock_StatementsTerminator();

            }
            case 128 /* EnumDeclaration_VariableDeclarators */ : {
                return this.isExpectedEnumDeclaration_VariableDeclaratorsTerminator();

            }
            case 256 /* ObjectType_TypeMembers */ : {
                return this.isExpectedObjectType_TypeMembersTerminator();

            }
            case 4096 /* ArgumentList_AssignmentExpressions */ : {
                return this.isExpectedArgumentList_AssignmentExpressionsTerminator();

            }
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ : {
                return this.isExpectedExtendsOrImplementsClause_TypeNameListTerminator();

            }
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ : {
                return this.isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator(itemCount);

            }
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ : {
                return this.isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator();

            }
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ : {
                return this.isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator();

            }
            case 32768 /* ParameterList_Parameters */ : {
                return this.isExpectedParameterList_ParametersTerminator();

            }
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return this.isExpectedLiteralExpression_AssignmentExpressionsTerminator();

            }
            default: {
                throw Errors.invalidOperation();

            }
        }
    };
    Parser.prototype.isExpectedSourceUnit_ModuleElementsTerminator = function () {
        return this.currentToken().tokenKind === 116 /* EndOfFileToken */ ;
    };
    Parser.prototype.isExpectedEnumDeclaration_VariableDeclaratorsTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedModuleDeclaration_ModuleElementsTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedObjectType_TypeMembersTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedLiteralExpression_AssignmentExpressionsTerminator = function () {
        return this.currentToken().tokenKind === 70 /* CloseBracketToken */ ;
    };
    Parser.prototype.isExpectedParameterList_ParametersTerminator = function () {
        var token = this.currentToken();
        if(token.tokenKind === 68 /* CloseParenToken */ ) {
            return true;
        }
        if(token.tokenKind === 65 /* OpenBraceToken */ ) {
            return true;
        }
        if(token.tokenKind === 80 /* EqualsGreaterThanToken */ ) {
            return true;
        }
        return false;
    };
    Parser.prototype.isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator = function () {
        if(this.currentToken().tokenKind === 73 /* SemicolonToken */  || this.currentToken().tokenKind === 68 /* CloseParenToken */ ) {
            return true;
        }
        if(this.currentToken().keywordKind() === 25 /* InKeyword */ ) {
            return true;
        }
        return false;
    };
    Parser.prototype.isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator = function (itemCount) {
        if(this.previousToken.tokenKind === 74 /* CommaToken */ ) {
            return false;
        }
        if(this.currentToken().tokenKind === 80 /* EqualsGreaterThanToken */ ) {
            return true;
        }
        return itemCount > 0 && this.canEatExplicitOrAutomaticSemicolon(false);
    };
    Parser.prototype.isExpectedExtendsOrImplementsClause_TypeNameListTerminator = function () {
        if(this.currentToken().keywordKind() === 44 /* ExtendsKeyword */  || this.currentToken().keywordKind() === 47 /* ImplementsKeyword */ ) {
            return true;
        }
        if(this.currentToken().tokenKind === 65 /* OpenBraceToken */  || this.currentToken().tokenKind === 66 /* CloseBraceToken */ ) {
            return true;
        }
        return false;
    };
    Parser.prototype.isExpectedArgumentList_AssignmentExpressionsTerminator = function () {
        return this.currentToken().tokenKind === 68 /* CloseParenToken */ ;
    };
    Parser.prototype.isExpectedClassDeclaration_ClassElementsTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedSwitchStatement_SwitchClausesTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedSwitchClause_StatementsTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */  || this.isSwitchClause();
    };
    Parser.prototype.isExpectedBlock_StatementsTerminator = function () {
        return this.currentToken().tokenKind === 66 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedListItem = function (currentListType, inErrorRecovery) {
        switch(currentListType) {
            case 1 /* SourceUnit_ModuleElements */ : {
                return this.isModuleElement();

            }
            case 2 /* ClassDeclaration_ClassElements */ : {
                return this.isClassElement();

            }
            case 4 /* ModuleDeclaration_ModuleElements */ : {
                return this.isModuleElement();

            }
            case 8 /* SwitchStatement_SwitchClauses */ : {
                return this.isSwitchClause();

            }
            case 16 /* SwitchClause_Statements */ : {
                return this.isStatement(true);

            }
            case 32 /* Block_Statements */ : {
                return this.isStatement(true);

            }
            case 128 /* EnumDeclaration_VariableDeclarators */ :
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ :
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ : {
                return this.isVariableDeclarator();

            }
            case 256 /* ObjectType_TypeMembers */ : {
                return this.isTypeMember();

            }
            case 4096 /* ArgumentList_AssignmentExpressions */ : {
                return this.isExpression();

            }
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ : {
                return this.isName();

            }
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ : {
                return this.isPropertyAssignment(inErrorRecovery);

            }
            case 32768 /* ParameterList_Parameters */ : {
                return this.isParameter();

            }
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return this.isAssignmentOrOmittedExpression();

            }
            default: {
                throw Errors.invalidOperation();

            }
        }
    };
    Parser.prototype.parseExpectedListItem = function (currentListType) {
        switch(currentListType) {
            case 1 /* SourceUnit_ModuleElements */ : {
                return this.parseModuleElement();

            }
            case 2 /* ClassDeclaration_ClassElements */ : {
                return this.parseClassElement();

            }
            case 4 /* ModuleDeclaration_ModuleElements */ : {
                return this.parseModuleElement();

            }
            case 8 /* SwitchStatement_SwitchClauses */ : {
                return this.parseSwitchClause();

            }
            case 16 /* SwitchClause_Statements */ : {
                return this.parseStatement(false);

            }
            case 32 /* Block_Statements */ : {
                return this.parseStatement(true);

            }
            case 128 /* EnumDeclaration_VariableDeclarators */ : {
                return this.parseVariableDeclarator(true);

            }
            case 256 /* ObjectType_TypeMembers */ : {
                return this.parseTypeMember();

            }
            case 4096 /* ArgumentList_AssignmentExpressions */ : {
                return this.parseAssignmentExpression(true);

            }
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ : {
                return this.parseName();

            }
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ : {
                return this.parseVariableDeclarator(true);

            }
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ : {
                return this.parseVariableDeclarator(false);

            }
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ : {
                return this.parsePropertyAssignment();

            }
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return this.parseAssignmentOrOmittedExpression();

            }
            case 32768 /* ParameterList_Parameters */ : {
                return this.parseParameter();

            }
            default: {
                throw Errors.invalidOperation();

            }
        }
    };
    Parser.prototype.getExpectedListElementType = function (currentListType) {
        switch(currentListType) {
            case 1 /* SourceUnit_ModuleElements */ : {
                return Strings.module__class__interface__enum__import_or_statement;

            }
            case 2 /* ClassDeclaration_ClassElements */ : {
                return Strings.constructor__function__accessor_or_variable;

            }
            case 4 /* ModuleDeclaration_ModuleElements */ : {
                return Strings.module__class__interface__enum__import_or_statement;

            }
            case 8 /* SwitchStatement_SwitchClauses */ : {
                return Strings.case_or_default_clause;

            }
            case 16 /* SwitchClause_Statements */ : {
                return Strings.statement;

            }
            case 32 /* Block_Statements */ : {
                return Strings.statement;

            }
            case 1024 /* VariableDeclaration_VariableDeclarators_AllowIn */ :
            case 2048 /* VariableDeclaration_VariableDeclarators_DisallowIn */ :
            case 128 /* EnumDeclaration_VariableDeclarators */ : {
                return Strings.identifier;

            }
            case 256 /* ObjectType_TypeMembers */ : {
                return Strings.call__construct__index__property_or_function_signature;

            }
            case 4096 /* ArgumentList_AssignmentExpressions */ : {
                return Strings.expression;

            }
            case 512 /* ExtendsOrImplementsClause_TypeNameList */ : {
                return Strings.type_name;

            }
            case 8192 /* ObjectLiteralExpression_PropertyAssignments */ : {
                return Strings.property_or_accessor;

            }
            case 32768 /* ParameterList_Parameters */ : {
                return Strings.parameter;

            }
            case 16384 /* ArrayLiteralExpression_AssignmentExpressions */ : {
                return Strings.expression;

            }
            default: {
                throw Errors.invalidOperation();

            }
        }
    };
    return Parser;
})(SlidingWindow);
var ScannerTokenInfo = (function () {
    function ScannerTokenInfo() { }
    return ScannerTokenInfo;
})();
var Scanner = (function (_super) {
    __extends(Scanner, _super);
    function Scanner(text, languageVersion, stringTable) {
        _super.call(this, 2048, 0, text.length());
        this.text = null;
        this.tokenInfo = new ScannerTokenInfo();
        Scanner.initializeStaticData();
        this.text = text;
        this.stringTable = stringTable;
        this.languageVersion = languageVersion;
    }
    Scanner.isKeywordStartCharacter = [];
    Scanner.isIdentifierStartCharacter = [];
    Scanner.isIdentifierPartCharacter = [];
    Scanner.isNumericLiteralStart = [];
    Scanner.initializeStaticData = function initializeStaticData() {
        if(Scanner.isKeywordStartCharacter.length === 0) {
            Scanner.isKeywordStartCharacter = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            Scanner.isIdentifierStartCharacter = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            Scanner.isIdentifierPartCharacter = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            Scanner.isNumericLiteralStart = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            for(var character = 0; character < 127 /* maxAsciiCharacter */ ; character++) {
                if(character >= 97 /* a */  && character <= 122 /* z */ ) {
                    Scanner.isIdentifierStartCharacter[character] = true;
                    Scanner.isIdentifierPartCharacter[character] = true;
                } else {
                    if((character >= 65 /* A */  && character <= 90 /* Z */ ) || character === 95 /* _ */  || character === 36 /* $ */ ) {
                        Scanner.isIdentifierStartCharacter[character] = true;
                        Scanner.isIdentifierPartCharacter[character] = true;
                    } else {
                        if(character >= 48 /* _0 */  && character <= 57 /* _9 */ ) {
                            Scanner.isIdentifierPartCharacter[character] = true;
                            Scanner.isNumericLiteralStart[character] = true;
                        }
                    }
                }
            }
            Scanner.isNumericLiteralStart[46 /* dot */ ] = true;
            for(var keywordKind = SyntaxKind.FirstKeyword; keywordKind <= SyntaxKind.LastKeyword; keywordKind++) {
                var keyword = SyntaxFacts.getText(keywordKind);
                Scanner.isKeywordStartCharacter[keyword.charCodeAt(0)] = true;
            }
        }
    }
    Scanner.create = function create(text, languageVersion) {
        return new Scanner(text, languageVersion, new StringTable());
    }
    Scanner.prototype.fetchMoreItems = function (argument, sourceIndex, window, destinationIndex, spaceAvailable) {
        var charactersRemaining = this.text.length() - sourceIndex;
        var amountToRead = MathPrototype.min(charactersRemaining, spaceAvailable);
        this.text.copyTo(sourceIndex, window, destinationIndex, amountToRead);
        return amountToRead;
    };
    Scanner.prototype.currentCharCode = function () {
        return this.currentItem(null);
    };
    Scanner.prototype.scan = function (diagnostics, allowRegularExpression) {
        var fullStart = this.absoluteIndex();
        var leadingTriviaInfo = this.scanTriviaInfo(diagnostics, false);
        this.scanSyntaxToken(diagnostics, allowRegularExpression);
        var trailingTriviaInfo = this.scanTriviaInfo(diagnostics, true);
        return SyntaxTokenFactory.create(fullStart, leadingTriviaInfo, this.tokenInfo, trailingTriviaInfo);
    };
    Scanner.prototype.scanTriviaInfo = function (diagnostics, isTrailing) {
        var width = 0;
        var hasComment = false;
        var hasNewLine = false;
        while(true) {
            var ch = this.currentCharCode();
            switch(ch) {
                case 32 /* space */ :
                case 9 /* tab */ :
                case 11 /* verticalTab */ :
                case 12 /* formFeed */ :
                case 160 /* nonBreakingSpace */ :
                case 65279 /* byteOrderMark */ : {
                    this.moveToNextItem();
                    width++;
                    continue;

                }
                case 47 /* slash */ : {
                    var ch2 = this.peekItemN(1);
                    if(ch2 === 47 /* slash */ ) {
                        this.moveToNextItem();
                        this.moveToNextItem();
                        hasComment = true;
                        width += 2 + this.scanSingleLineCommentTrivia();
                        continue;
                    }
                    if(ch2 === 42 /* asterisk */ ) {
                        this.moveToNextItem();
                        this.moveToNextItem();
                        hasComment = true;
                        width += 2 + this.scanMultiLineCommentTrivia(diagnostics);
                        continue;
                    }
                    break;

                }
                case 13 /* carriageReturn */ :
                case 10 /* newLine */ :
                case 8233 /* paragraphSeparator */ :
                case 8232 /* lineSeparator */ : {
                    hasNewLine = true;
                    width += this.scanLineTerminatorSequence(ch);
                    if(!isTrailing) {
                        continue;
                    }
                    break;

                }
            }
            return width | (hasComment ? 67108864 /* TriviaCommentMask */  : 0) | (hasNewLine ? 134217728 /* TriviaNewLineMask */  : 0);
        }
    };
    Scanner.prototype.isNewLineCharacter = function (ch) {
        switch(ch) {
            case 13 /* carriageReturn */ :
            case 10 /* newLine */ :
            case 8233 /* paragraphSeparator */ :
            case 8232 /* lineSeparator */ : {
                return true;

            }
            default: {
                return false;

            }
        }
    };
    Scanner.prototype.scanSingleLineCommentTrivia = function () {
        var width = 0;
        while(true) {
            var ch = this.currentCharCode();
            if(this.isNewLineCharacter(ch) || this.isAtEndOfSource()) {
                return width;
            }
            this.moveToNextItem();
            width++;
        }
    };
    Scanner.prototype.scanMultiLineCommentTrivia = function (diagnostics) {
        var width = 0;
        while(true) {
            var ch = this.currentCharCode();
            if(this.isAtEndOfSource()) {
                diagnostics.push(new SyntaxDiagnostic(this.absoluteIndex(), 0, 10 /* _StarSlash__expected */ , null));
                return width;
            }
            if(ch === 42 /* asterisk */  && this.peekItemN(1) === 47 /* slash */ ) {
                this.moveToNextItem();
                this.moveToNextItem();
                width += 2;
                return width;
            }
            this.moveToNextItem();
            width++;
        }
    };
    Scanner.prototype.scanLineTerminatorSequence = function (ch) {
        this.moveToNextItem();
        if(ch === 13 /* carriageReturn */  && this.currentCharCode() === 10 /* newLine */ ) {
            this.moveToNextItem();
            return 2;
        } else {
            return 1;
        }
    };
    Scanner.prototype.scanSyntaxToken = function (diagnostics, allowRegularExpression) {
        this.tokenInfo.Kind = 0 /* None */ ;
        this.tokenInfo.KeywordKind = 0 /* None */ ;
        this.tokenInfo.Text = null;
        this.tokenInfo.Value = null;
        if(this.isAtEndOfSource()) {
            this.tokenInfo.Kind = 116 /* EndOfFileToken */ ;
            this.tokenInfo.Text = "";
            return;
        }
        var character = this.currentCharCode();
        switch(character) {
            case 34 /* doubleQuote */ :
            case 39 /* singleQuote */ : {
                return this.scanStringLiteral(diagnostics);

            }
            case 47 /* slash */ : {
                return this.scanSlashToken(allowRegularExpression);

            }
            case 46 /* dot */ : {
                return this.scanDotToken();

            }
            case 45 /* minus */ : {
                return this.scanMinusToken();

            }
            case 33 /* exclamation */ : {
                return this.scanExclamationToken();

            }
            case 61 /* equals */ : {
                return this.scanEqualsToken();

            }
            case 124 /* bar */ : {
                return this.scanBarToken();

            }
            case 42 /* asterisk */ : {
                return this.scanAsteriskToken();

            }
            case 43 /* plus */ : {
                return this.scanPlusToken();

            }
            case 37 /* percent */ : {
                return this.scanPercentToken();

            }
            case 38 /* ampersand */ : {
                return this.scanAmpersandToken();

            }
            case 94 /* caret */ : {
                return this.scanCaretToken();

            }
            case 60 /* lessThan */ : {
                return this.scanLessThanToken();

            }
            case 62 /* greaterThan */ : {
                return this.scanGreaterThanToken();

            }
            case 44 /* comma */ : {
                return this.advanceAndSetTokenKind(74 /* CommaToken */ );

            }
            case 58 /* colon */ : {
                return this.advanceAndSetTokenKind(101 /* ColonToken */ );

            }
            case 59 /* semicolon */ : {
                return this.advanceAndSetTokenKind(73 /* SemicolonToken */ );

            }
            case 126 /* tilde */ : {
                return this.advanceAndSetTokenKind(97 /* TildeToken */ );

            }
            case 40 /* openParen */ : {
                return this.advanceAndSetTokenKind(67 /* OpenParenToken */ );

            }
            case 41 /* closeParen */ : {
                return this.advanceAndSetTokenKind(68 /* CloseParenToken */ );

            }
            case 123 /* openBrace */ : {
                return this.advanceAndSetTokenKind(65 /* OpenBraceToken */ );

            }
            case 125 /* closeBrace */ : {
                return this.advanceAndSetTokenKind(66 /* CloseBraceToken */ );

            }
            case 91 /* openBracket */ : {
                return this.advanceAndSetTokenKind(69 /* OpenBracketToken */ );

            }
            case 93 /* closeBracket */ : {
                return this.advanceAndSetTokenKind(70 /* CloseBracketToken */ );

            }
            case 63 /* question */ : {
                return this.advanceAndSetTokenKind(100 /* QuestionToken */ );

            }
        }
        if(Scanner.isNumericLiteralStart[character]) {
            this.scanNumericLiteral();
            return;
        }
        if(Scanner.isIdentifierStartCharacter[character]) {
            if(this.tryFastScanIdentifierOrKeyword(character)) {
                return;
            }
        }
        if(this.isIdentifierStart(this.peekCharOrUnicodeEscape())) {
            this.slowScanIdentifier(diagnostics);
            return;
        }
        this.scanDefaultCharacter(character, diagnostics);
    };
    Scanner.prototype.isIdentifierStart = function (interpretedChar) {
        if(Scanner.isIdentifierStartCharacter[interpretedChar]) {
            return true;
        }
        return interpretedChar > 127 /* maxAsciiCharacter */  && Unicode.isIdentifierStart(interpretedChar, this.languageVersion);
    };
    Scanner.prototype.isIdentifierPart = function (interpretedChar) {
        if(Scanner.isIdentifierPartCharacter[interpretedChar]) {
            return true;
        }
        return interpretedChar > 127 /* maxAsciiCharacter */  && Unicode.isIdentifierPart(interpretedChar, this.languageVersion);
    };
    Scanner.prototype.tryFastScanIdentifierOrKeyword = function (firstCharacter) {
        var startIndex = this.getAndPinAbsoluteIndex();
        while(true) {
            var character = this.currentCharCode();
            if(Scanner.isIdentifierPartCharacter[character]) {
                this.moveToNextItem();
            } else {
                if(character === 92 /* backslash */  || character > 127 /* maxAsciiCharacter */ ) {
                    this.rewindToPinnedIndex(startIndex);
                    this.releaseAndUnpinAbsoluteIndex(startIndex);
                    return false;
                } else {
                    var endIndex = this.absoluteIndex();
                    this.tokenInfo.Text = this.substring(startIndex, endIndex, true);
                    this.tokenInfo.Kind = 7 /* IdentifierNameToken */ ;
                    if(Scanner.isKeywordStartCharacter[firstCharacter]) {
                        this.tokenInfo.KeywordKind = SyntaxFacts.getTokenKind(this.tokenInfo.Text);
                    }
                    if(this.tokenInfo.KeywordKind === 0 /* None */ ) {
                        this.tokenInfo.Value = this.tokenInfo.Text;
                    }
                    this.releaseAndUnpinAbsoluteIndex(startIndex);
                    return true;
                }
            }
        }
    };
    Scanner.prototype.slowScanIdentifier = function (diagnostics) {
        var startIndex = this.getAndPinAbsoluteIndex();
        do {
            this.scanCharOrUnicodeEscape(diagnostics);
        }while(this.isIdentifierPart(this.peekCharOrUnicodeEscape()))
        var endIndex = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(startIndex, endIndex, true);
        this.tokenInfo.Kind = 7 /* IdentifierNameToken */ ;
        this.releaseAndUnpinAbsoluteIndex(startIndex);
    };
    Scanner.prototype.scanNumericLiteral = function () {
        var startIndex = this.getAndPinAbsoluteIndex();
        if(this.isHexNumericLiteral()) {
            this.scanHexNumericLiteral(startIndex);
        } else {
            this.scanDecimalNumericLiteral(startIndex);
        }
        this.releaseAndUnpinAbsoluteIndex(startIndex);
    };
    Scanner.prototype.scanDecimalNumericLiteral = function (startIndex) {
        while(CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }
        if(this.currentCharCode() === 46 /* dot */ ) {
            this.moveToNextItem();
        }
        while(CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }
        var ch = this.currentCharCode();
        if(ch === 101 /* e */  || ch === 69 /* E */ ) {
            this.moveToNextItem();
            ch = this.currentCharCode();
            if(ch === 45 /* minus */  || ch === 43 /* plus */ ) {
                if(CharacterInfo.isDecimalDigit(this.peekItemN(1))) {
                    this.moveToNextItem();
                }
            }
        }
        while(CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }
        var endIndex = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(startIndex, endIndex, false);
        this.tokenInfo.Kind = 9 /* NumericLiteral */ ;
    };
    Scanner.prototype.scanHexNumericLiteral = function (start) {
        Debug.assert(this.isHexNumericLiteral());
        this.moveToNextItem();
        this.moveToNextItem();
        while(CharacterInfo.isHexDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }
        var end = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(start, end, false);
        this.tokenInfo.Kind = 9 /* NumericLiteral */ ;
    };
    Scanner.prototype.isHexNumericLiteral = function () {
        if(this.currentCharCode() === 48 /* _0 */ ) {
            var ch = this.peekItemN(1);
            if(ch === 120 /* x */  || ch === 88 /* X */ ) {
                ch = this.peekItemN(2);
                return CharacterInfo.isHexDigit(ch);
            }
        }
        return false;
    };
    Scanner.prototype.advanceAndSetTokenKind = function (kind) {
        this.moveToNextItem();
        this.tokenInfo.Kind = kind;
    };
    Scanner.prototype.scanGreaterThanToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 78 /* GreaterThanEqualsToken */ ;
        } else {
            if(character === 62 /* greaterThan */ ) {
                this.scanGreaterThanGreaterThanToken();
            } else {
                this.tokenInfo.Kind = 76 /* GreaterThanToken */ ;
            }
        }
    };
    Scanner.prototype.scanGreaterThanGreaterThanToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 108 /* GreaterThanGreaterThanEqualsToken */ ;
        } else {
            if(character === 62 /* greaterThan */ ) {
                this.scanGreaterThanGreaterThanGreaterThanToken();
            } else {
                this.tokenInfo.Kind = 91 /* GreaterThanGreaterThanToken */ ;
            }
        }
    };
    Scanner.prototype.scanGreaterThanGreaterThanGreaterThanToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 109 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 92 /* GreaterThanGreaterThanGreaterThanToken */ ;
        }
    };
    Scanner.prototype.scanLessThanToken = function () {
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 77 /* LessThanEqualsToken */ ;
        } else {
            if(this.currentCharCode() === 60 /* lessThan */ ) {
                this.moveToNextItem();
                if(this.currentCharCode() === 61 /* equals */ ) {
                    this.moveToNextItem();
                    this.tokenInfo.Kind = 107 /* LessThanLessThanEqualsToken */ ;
                } else {
                    this.tokenInfo.Kind = 90 /* LessThanLessThanToken */ ;
                }
            } else {
                this.tokenInfo.Kind = 75 /* LessThanToken */ ;
            }
        }
    };
    Scanner.prototype.scanBarToken = function () {
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 111 /* BarEqualsToken */ ;
        } else {
            if(this.currentCharCode() === 124 /* bar */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 99 /* BarBarToken */ ;
            } else {
                this.tokenInfo.Kind = 94 /* BarToken */ ;
            }
        }
    };
    Scanner.prototype.scanCaretToken = function () {
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 112 /* CaretEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 95 /* CaretToken */ ;
        }
    };
    Scanner.prototype.scanAmpersandToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 110 /* AmpersandEqualsToken */ ;
        } else {
            if(this.currentCharCode() === 38 /* ampersand */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 98 /* AmpersandAmpersandToken */ ;
            } else {
                this.tokenInfo.Kind = 93 /* AmpersandToken */ ;
            }
        }
    };
    Scanner.prototype.scanPercentToken = function () {
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 106 /* PercentEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 87 /* PercentToken */ ;
        }
    };
    Scanner.prototype.scanMinusToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 104 /* MinusEqualsToken */ ;
        } else {
            if(character === 45 /* minus */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 89 /* MinusMinusToken */ ;
            } else {
                this.tokenInfo.Kind = 85 /* MinusToken */ ;
            }
        }
    };
    Scanner.prototype.scanPlusToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 103 /* PlusEqualsToken */ ;
        } else {
            if(character === 43 /* plus */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 88 /* PlusPlusToken */ ;
            } else {
                this.tokenInfo.Kind = 84 /* PlusToken */ ;
            }
        }
    };
    Scanner.prototype.scanAsteriskToken = function () {
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 105 /* AsteriskEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 86 /* AsteriskToken */ ;
        }
    };
    Scanner.prototype.scanEqualsToken = function () {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            if(this.currentCharCode() === 61 /* equals */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 82 /* EqualsEqualsEqualsToken */ ;
            } else {
                this.tokenInfo.Kind = 79 /* EqualsEqualsToken */ ;
            }
        } else {
            if(character === 62 /* greaterThan */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 80 /* EqualsGreaterThanToken */ ;
            } else {
                this.tokenInfo.Kind = 102 /* EqualsToken */ ;
            }
        }
    };
    Scanner.prototype.isDotPrefixedNumericLiteral = function () {
        if(this.currentCharCode() === 46 /* dot */ ) {
            var ch = this.peekItemN(1);
            return CharacterInfo.isDecimalDigit(ch);
        }
        return false;
    };
    Scanner.prototype.scanDotToken = function () {
        if(this.isDotPrefixedNumericLiteral()) {
            this.scanNumericLiteral();
            return;
        }
        this.moveToNextItem();
        if(this.currentCharCode() === 46 /* dot */  && this.peekItemN(1) === 46 /* dot */ ) {
            this.moveToNextItem();
            this.moveToNextItem();
            this.tokenInfo.Kind = 72 /* DotDotDotToken */ ;
        } else {
            this.tokenInfo.Kind = 71 /* DotToken */ ;
        }
    };
    Scanner.prototype.scanSlashToken = function (allowRegularExpression) {
        if(allowRegularExpression && this.tryScanRegularExpressionToken()) {
            return;
        }
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 114 /* SlashEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 113 /* SlashToken */ ;
        }
    };
    Scanner.prototype.tryScanRegularExpressionToken = function () {
        Debug.assert(this.currentCharCode() === 47 /* slash */ );
        var startIndex = this.getAndPinAbsoluteIndex();
        try  {
            this.moveToNextItem();
            var inEscape = false;
            var inCharacterClass = false;
            while(true) {
                var ch = this.currentCharCode();
                if(this.isNewLineCharacter(ch) || this.isAtEndOfSource()) {
                    this.rewindToPinnedIndex(startIndex);
                    return false;
                }
                this.moveToNextItem();
                if(inEscape) {
                    inEscape = false;
                    continue;
                }
                switch(ch) {
                    case 92 /* backslash */ : {
                        inEscape = true;
                        continue;

                    }
                    case 91 /* openBracket */ : {
                        inCharacterClass = true;
                        continue;

                    }
                    case 93 /* closeBracket */ : {
                        inCharacterClass = false;
                        continue;

                    }
                    case 47 /* slash */ : {
                        if(inCharacterClass) {
                            continue;
                        }
                        break;

                    }
                    default: {
                        continue;

                    }
                }
                break;
            }
            while(Scanner.isIdentifierPartCharacter[this.currentCharCode()]) {
                this.moveToNextItem();
            }
            var endIndex = this.absoluteIndex();
            this.tokenInfo.Kind = 8 /* RegularExpressionLiteral */ ;
            this.tokenInfo.Text = this.substring(startIndex, endIndex, false);
            return true;
        }finally {
            this.releaseAndUnpinAbsoluteIndex(startIndex);
        }
    };
    Scanner.prototype.scanExclamationToken = function () {
        this.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.moveToNextItem();
            if(this.currentCharCode() === 61 /* equals */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 83 /* ExclamationEqualsEqualsToken */ ;
            } else {
                this.tokenInfo.Kind = 81 /* ExclamationEqualsToken */ ;
            }
        } else {
            this.tokenInfo.Kind = 96 /* ExclamationToken */ ;
        }
    };
    Scanner.prototype.scanDefaultCharacter = function (character, diagnostics) {
        var position = this.absoluteIndex();
        this.moveToNextItem();
        this.tokenInfo.Text = String.fromCharCode(character);
        this.tokenInfo.Kind = 115 /* ErrorToken */ ;
        var messageText = this.getErrorMessageText(this.tokenInfo.Text);
        diagnostics.push(new SyntaxDiagnostic(position, 1, 1 /* Unexpected_character_0 */ , [
            messageText
        ]));
    };
    Scanner.prototype.getErrorMessageText = function (text) {
        if(text === "\\") {
            return '"\\"';
        }
        return JSON2.stringify(text);
    };
    Scanner.prototype.skipEscapeSequence = function (diagnostics) {
        Debug.assert(this.currentCharCode() === 92 /* backslash */ );
        var rewindPoint = this.getRewindPoint();
        try  {
            this.moveToNextItem();
            var ch = this.currentCharCode();
            this.moveToNextItem();
            switch(ch) {
                case 39 /* singleQuote */ :
                case 34 /* doubleQuote */ :
                case 92 /* backslash */ : {
                    return;

                }
                case 48 /* _0 */ : {
                    return;

                }
                case 98 /* b */ : {
                    return;

                }
                case 102 /* f */ : {
                    return;

                }
                case 110 /* n */ : {
                    return;

                }
                case 114 /* r */ : {
                    return;

                }
                case 116 /* t */ : {
                    return;

                }
                case 118 /* v */ : {
                    return;

                }
                case 120 /* x */ :
                case 117 /* u */ : {
                    this.rewind(rewindPoint);
                    var value = this.scanUnicodeOrHexEscape(diagnostics);
                    return;

                }
                case 13 /* carriageReturn */ : {
                    if(this.currentCharCode() === 10 /* newLine */ ) {
                        this.moveToNextItem();
                    }
                    return;

                }
                case 10 /* newLine */ :
                case 8233 /* paragraphSeparator */ :
                case 8232 /* lineSeparator */ : {
                    return;

                }
                default: {
                    return;

                }
            }
        }finally {
            this.releaseRewindPoint(rewindPoint);
        }
    };
    Scanner.prototype.scanStringLiteral = function (diagnostics) {
        var quoteCharacter = this.currentCharCode();
        Debug.assert(quoteCharacter === 39 /* singleQuote */  || quoteCharacter === 34 /* doubleQuote */ );
        var startIndex = this.getAndPinAbsoluteIndex();
        this.moveToNextItem();
        while(true) {
            var ch = this.currentCharCode();
            if(ch === 92 /* backslash */ ) {
                this.skipEscapeSequence(diagnostics);
            } else {
                if(ch === quoteCharacter) {
                    this.moveToNextItem();
                    break;
                } else {
                    if(this.isNewLineCharacter(ch) || this.isAtEndOfSource()) {
                        diagnostics.push(new SyntaxDiagnostic(this.absoluteIndex(), 1, 2 /* Missing_closing_quote_character */ , null));
                        break;
                    } else {
                        this.moveToNextItem();
                    }
                }
            }
        }
        var endIndex = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(startIndex, endIndex, true);
        this.tokenInfo.Kind = 10 /* StringLiteral */ ;
        this.releaseAndUnpinAbsoluteIndex(startIndex);
    };
    Scanner.prototype.isUnicodeOrHexEscape = function (character) {
        return this.isUnicodeEscape(character) || this.isHexEscape(character);
    };
    Scanner.prototype.isUnicodeEscape = function (character) {
        if(character === 92 /* backslash */ ) {
            var ch2 = this.peekItemN(1);
            if(ch2 === 117 /* u */ ) {
                return true;
            }
        }
        return false;
    };
    Scanner.prototype.isHexEscape = function (character) {
        if(character === 92 /* backslash */ ) {
            var ch2 = this.peekItemN(1);
            if(ch2 === 120 /* x */ ) {
                return true;
            }
        }
        return false;
    };
    Scanner.prototype.peekCharOrUnicodeOrHexEscape = function () {
        var character = this.currentCharCode();
        if(this.isUnicodeOrHexEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return character;
        }
    };
    Scanner.prototype.peekCharOrUnicodeEscape = function () {
        var character = this.currentCharCode();
        if(this.isUnicodeEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return character;
        }
    };
    Scanner.prototype.peekUnicodeOrHexEscape = function () {
        var rewindPoint = this.getRewindPoint();
        var ch = this.scanUnicodeOrHexEscape(null);
        this.rewind(rewindPoint);
        this.releaseRewindPoint(rewindPoint);
        return ch;
    };
    Scanner.prototype.scanCharOrUnicodeEscape = function (errors) {
        var ch = this.currentCharCode();
        if(ch === 92 /* backslash */ ) {
            var ch2 = this.peekItemN(1);
            if(ch2 === 117 /* u */ ) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }
        this.moveToNextItem();
        return ch;
    };
    Scanner.prototype.scanCharOrUnicodeOrHexEscape = function (errors) {
        var ch = this.currentCharCode();
        if(ch === 92 /* backslash */ ) {
            var ch2 = this.peekItemN(1);
            if(ch2 === 117 /* u */  || ch2 === 120 /* x */ ) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }
        this.moveToNextItem();
        return ch;
    };
    Scanner.prototype.scanUnicodeOrHexEscape = function (errors) {
        var start = this.absoluteIndex();
        var character = this.currentCharCode();
        Debug.assert(character === 92 /* backslash */ );
        this.moveToNextItem();
        character = this.currentCharCode();
        Debug.assert(character === 117 /* u */  || character === 120 /* x */ );
        var intChar = 0;
        this.moveToNextItem();
        var count = character === 117 /* u */  ? 4 : 2;
        for(var i = 0; i < count; i++) {
            var ch2 = this.currentCharCode();
            if(!CharacterInfo.isHexDigit(ch2)) {
                if(errors !== null) {
                    var end = this.absoluteIndex();
                    var info = this.createIllegalEscapeDiagnostic(start, end);
                    errors.push(info);
                }
                break;
            }
            intChar = (intChar << 4) + CharacterInfo.hexValue(ch2);
            this.moveToNextItem();
        }
        return intChar;
    };
    Scanner.prototype.substring = function (start, end, intern) {
        var length = end - start;
        var offset = start - this.windowAbsoluteStartIndex;
        if(intern) {
            return this.stringTable.addCharArray(this.window, offset, length);
        } else {
            return StringUtilities.fromCharCodeArray(this.window.slice(offset, offset + length));
        }
    };
    Scanner.prototype.createIllegalEscapeDiagnostic = function (start, end) {
        return new SyntaxDiagnostic(start, end - start, 0 /* Unrecognized_escape_sequence */ , null);
    };
    return Scanner;
})(SlidingWindow);
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
    TextBase.prototype.substr = function (start, length) {
        throw Errors.abstract();
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
            var c = this.charCodeAt(index);
            var lineBreakLength;
            if(c > 13 /* carriageReturn */  && c <= 127) {
                index++;
                continue;
            } else {
                if(c === 13 /* carriageReturn */  && index + 1 < length && this.charCodeAt(index + 1) === 10 /* newLine */ ) {
                    lineBreakLength = 2;
                } else {
                    if(c === 10 /* newLine */ ) {
                        lineBreakLength = 1;
                    } else {
                        lineBreakLength = TextUtilities.getLengthOfLineBreak(this, index);
                    }
                }
            }
            if(0 === lineBreakLength) {
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
var Strings = (function () {
    function Strings() { }
    Strings.module__class__interface__enum__import_or_statement = "module, class, interface, enum, import or statement";
    Strings.constructor__function__accessor_or_variable = "constructor, function, accessor or variable";
    Strings.statement = "statement";
    Strings.case_or_default_clause = "case or default clause";
    Strings.identifier = "identifier";
    Strings.call__construct__index__property_or_function_signature = "call, construct, index, property or function signature";
    Strings.expression = "expression";
    Strings.type_name = "type name";
    Strings.property_or_accessor = "property or accessor";
    Strings.parameter = "parameter";
    return Strings;
})();
var StringTableEntry = (function () {
    function StringTableEntry(text, hashCode, next) {
        this.Text = text;
        this.HashCode = hashCode;
        this.Next = next;
    }
    return StringTableEntry;
})();
var StringTable = (function () {
    function StringTable(capacity, nested) {
        if (typeof capacity === "undefined") { capacity = 256; }
        if (typeof nested === "undefined") { nested = null; }
        this.entries = [];
        this.count = 0;
        var size = Hash.getPrime(capacity);
        this.entries = ArrayUtilities.createArray(size);
    }
    StringTable.prototype.addCharArray = function (key, start, len) {
        var hashCode = Hash.computeMurmur2CharArrayHashCode(key, start, len) % 2147483647;
        var entry = this.findCharArrayEntry(key, start, len, hashCode);
        if(entry !== null) {
            return entry.Text;
        }
        var slice = key.slice(start, start + len);
        return this.addEntry(StringUtilities.fromCharCodeArray(slice), hashCode);
    };
    StringTable.prototype.findCharArrayEntry = function (key, start, len, hashCode) {
        for(var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
            if(e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                return e;
            }
        }
        return null;
    };
    StringTable.prototype.addEntry = function (text, hashCode) {
        var index = hashCode % this.entries.length;
        var e = new StringTableEntry(text, hashCode, this.entries[index]);
        this.entries[index] = e;
        if(this.count === this.entries.length) {
            this.grow();
        }
        this.count++;
        return e.Text;
    };
    StringTable.prototype.dumpStats = function () {
        var standardOut = Environment.standardOut;
        standardOut.WriteLine("----------------------");
        standardOut.WriteLine("String table stats");
        standardOut.WriteLine("Count            : " + this.count);
        standardOut.WriteLine("Entries Length   : " + this.entries.length);
        var occupiedSlots = 0;
        for(var i = 0; i < this.entries.length; i++) {
            if(this.entries[i] !== null) {
                occupiedSlots++;
            }
        }
        standardOut.WriteLine("Occupied slots   : " + occupiedSlots);
        standardOut.WriteLine("Avg Length/Slot  : " + (this.count / occupiedSlots));
        standardOut.WriteLine("----------------------");
    };
    StringTable.prototype.grow = function () {
        var newSize = Hash.expandPrime(this.entries.length);
        var oldEntries = this.entries;
        var newEntries = ArrayUtilities.createArray(newSize);
        this.entries = newEntries;
        for(var i = 0; i < oldEntries.length; i++) {
            var e = oldEntries[i];
            while(e !== null) {
                var newIndex = e.HashCode % newSize;
                var tmp = e.Next;
                e.Next = newEntries[newIndex];
                newEntries[newIndex] = e;
                e = tmp;
            }
        }
    };
    StringTable.textCharArrayEquals = function textCharArrayEquals(text, array, start, length) {
        if(text.length !== length) {
            return false;
        }
        var s = start;
        for(var i = 0; i < text.length; i++) {
            if(text.charCodeAt(i) !== array[s]) {
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
    StringText.prototype.charCodeAt = function (position) {
        if(position < 0 || position >= this.source.length) {
            throw Errors.argumentOutOfRange("position");
        }
        return this.source.charCodeAt(position);
    };
    StringText.prototype.substr = function (start, length) {
        return this.source.substr(start, length);
    };
    StringText.prototype.toString = function (span) {
        if (typeof span === "undefined") { span = null; }
        if(span === null) {
            span = new TextSpan(0, this.length());
        }
        this.checkSubSpan(span);
        if(span.start() === 0 && span.length() === this.length()) {
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
    StringUtilities.startsWith = function startsWith(string, value) {
        return string.substr(0, value.length) === value;
    }
    return StringUtilities;
})();
var SyntaxDiagnostic = (function (_super) {
    __extends(SyntaxDiagnostic, _super);
    function SyntaxDiagnostic(position, width, code, args) {
        _super.call(this, code, args);
        if(width < 0) {
            throw Errors.argumentOutOfRange("width");
        }
        this._position = position;
        this._width = width;
    }
    SyntaxDiagnostic.prototype.toJSON = function (key) {
        var result = {
        };
        result._position = this._position;
        result._width = this._width;
        result._diagnosticCode = (DiagnosticCode)._map[this.diagnosticCode()];
        var arguments = (this)._arguments;
        if(arguments && arguments.length > 0) {
            result._arguments = arguments;
        }
        return result;
    };
    SyntaxDiagnostic.prototype.position = function () {
        return this._position;
    };
    SyntaxDiagnostic.prototype.width = function () {
        return this._width;
    };
    return SyntaxDiagnostic;
})(Diagnostic);
var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind._map = [];
    SyntaxKind._map[0] = "None";
    SyntaxKind.None = 0;
    SyntaxKind._map[1] = "List";
    SyntaxKind.List = 1;
    SyntaxKind._map[2] = "SeparatedList";
    SyntaxKind.SeparatedList = 2;
    SyntaxKind._map[3] = "WhitespaceTrivia";
    SyntaxKind.WhitespaceTrivia = 3;
    SyntaxKind._map[4] = "NewLineTrivia";
    SyntaxKind.NewLineTrivia = 4;
    SyntaxKind._map[5] = "MultiLineCommentTrivia";
    SyntaxKind.MultiLineCommentTrivia = 5;
    SyntaxKind._map[6] = "SingleLineCommentTrivia";
    SyntaxKind.SingleLineCommentTrivia = 6;
    SyntaxKind._map[7] = "IdentifierNameToken";
    SyntaxKind.IdentifierNameToken = 7;
    SyntaxKind._map[8] = "RegularExpressionLiteral";
    SyntaxKind.RegularExpressionLiteral = 8;
    SyntaxKind._map[9] = "NumericLiteral";
    SyntaxKind.NumericLiteral = 9;
    SyntaxKind._map[10] = "StringLiteral";
    SyntaxKind.StringLiteral = 10;
    SyntaxKind._map[11] = "BreakKeyword";
    SyntaxKind.BreakKeyword = 11;
    SyntaxKind._map[12] = "CaseKeyword";
    SyntaxKind.CaseKeyword = 12;
    SyntaxKind._map[13] = "CatchKeyword";
    SyntaxKind.CatchKeyword = 13;
    SyntaxKind._map[14] = "ContinueKeyword";
    SyntaxKind.ContinueKeyword = 14;
    SyntaxKind._map[15] = "DebuggerKeyword";
    SyntaxKind.DebuggerKeyword = 15;
    SyntaxKind._map[16] = "DefaultKeyword";
    SyntaxKind.DefaultKeyword = 16;
    SyntaxKind._map[17] = "DeleteKeyword";
    SyntaxKind.DeleteKeyword = 17;
    SyntaxKind._map[18] = "DoKeyword";
    SyntaxKind.DoKeyword = 18;
    SyntaxKind._map[19] = "ElseKeyword";
    SyntaxKind.ElseKeyword = 19;
    SyntaxKind._map[20] = "FalseKeyword";
    SyntaxKind.FalseKeyword = 20;
    SyntaxKind._map[21] = "FinallyKeyword";
    SyntaxKind.FinallyKeyword = 21;
    SyntaxKind._map[22] = "ForKeyword";
    SyntaxKind.ForKeyword = 22;
    SyntaxKind._map[23] = "FunctionKeyword";
    SyntaxKind.FunctionKeyword = 23;
    SyntaxKind._map[24] = "IfKeyword";
    SyntaxKind.IfKeyword = 24;
    SyntaxKind._map[25] = "InKeyword";
    SyntaxKind.InKeyword = 25;
    SyntaxKind._map[26] = "InstanceOfKeyword";
    SyntaxKind.InstanceOfKeyword = 26;
    SyntaxKind._map[27] = "NewKeyword";
    SyntaxKind.NewKeyword = 27;
    SyntaxKind._map[28] = "NullKeyword";
    SyntaxKind.NullKeyword = 28;
    SyntaxKind._map[29] = "ReturnKeyword";
    SyntaxKind.ReturnKeyword = 29;
    SyntaxKind._map[30] = "SwitchKeyword";
    SyntaxKind.SwitchKeyword = 30;
    SyntaxKind._map[31] = "ThisKeyword";
    SyntaxKind.ThisKeyword = 31;
    SyntaxKind._map[32] = "ThrowKeyword";
    SyntaxKind.ThrowKeyword = 32;
    SyntaxKind._map[33] = "TrueKeyword";
    SyntaxKind.TrueKeyword = 33;
    SyntaxKind._map[34] = "TryKeyword";
    SyntaxKind.TryKeyword = 34;
    SyntaxKind._map[35] = "TypeOfKeyword";
    SyntaxKind.TypeOfKeyword = 35;
    SyntaxKind._map[36] = "VarKeyword";
    SyntaxKind.VarKeyword = 36;
    SyntaxKind._map[37] = "VoidKeyword";
    SyntaxKind.VoidKeyword = 37;
    SyntaxKind._map[38] = "WhileKeyword";
    SyntaxKind.WhileKeyword = 38;
    SyntaxKind._map[39] = "WithKeyword";
    SyntaxKind.WithKeyword = 39;
    SyntaxKind._map[40] = "ClassKeyword";
    SyntaxKind.ClassKeyword = 40;
    SyntaxKind._map[41] = "ConstKeyword";
    SyntaxKind.ConstKeyword = 41;
    SyntaxKind._map[42] = "EnumKeyword";
    SyntaxKind.EnumKeyword = 42;
    SyntaxKind._map[43] = "ExportKeyword";
    SyntaxKind.ExportKeyword = 43;
    SyntaxKind._map[44] = "ExtendsKeyword";
    SyntaxKind.ExtendsKeyword = 44;
    SyntaxKind._map[45] = "ImportKeyword";
    SyntaxKind.ImportKeyword = 45;
    SyntaxKind._map[46] = "SuperKeyword";
    SyntaxKind.SuperKeyword = 46;
    SyntaxKind._map[47] = "ImplementsKeyword";
    SyntaxKind.ImplementsKeyword = 47;
    SyntaxKind._map[48] = "InterfaceKeyword";
    SyntaxKind.InterfaceKeyword = 48;
    SyntaxKind._map[49] = "LetKeyword";
    SyntaxKind.LetKeyword = 49;
    SyntaxKind._map[50] = "PackageKeyword";
    SyntaxKind.PackageKeyword = 50;
    SyntaxKind._map[51] = "PrivateKeyword";
    SyntaxKind.PrivateKeyword = 51;
    SyntaxKind._map[52] = "ProtectedKeyword";
    SyntaxKind.ProtectedKeyword = 52;
    SyntaxKind._map[53] = "PublicKeyword";
    SyntaxKind.PublicKeyword = 53;
    SyntaxKind._map[54] = "StaticKeyword";
    SyntaxKind.StaticKeyword = 54;
    SyntaxKind._map[55] = "YieldKeyword";
    SyntaxKind.YieldKeyword = 55;
    SyntaxKind._map[56] = "AnyKeyword";
    SyntaxKind.AnyKeyword = 56;
    SyntaxKind._map[57] = "BoolKeyword";
    SyntaxKind.BoolKeyword = 57;
    SyntaxKind._map[58] = "ConstructorKeyword";
    SyntaxKind.ConstructorKeyword = 58;
    SyntaxKind._map[59] = "DeclareKeyword";
    SyntaxKind.DeclareKeyword = 59;
    SyntaxKind._map[60] = "GetKeyword";
    SyntaxKind.GetKeyword = 60;
    SyntaxKind._map[61] = "ModuleKeyword";
    SyntaxKind.ModuleKeyword = 61;
    SyntaxKind._map[62] = "NumberKeyword";
    SyntaxKind.NumberKeyword = 62;
    SyntaxKind._map[63] = "SetKeyword";
    SyntaxKind.SetKeyword = 63;
    SyntaxKind._map[64] = "StringKeyword";
    SyntaxKind.StringKeyword = 64;
    SyntaxKind._map[65] = "OpenBraceToken";
    SyntaxKind.OpenBraceToken = 65;
    SyntaxKind._map[66] = "CloseBraceToken";
    SyntaxKind.CloseBraceToken = 66;
    SyntaxKind._map[67] = "OpenParenToken";
    SyntaxKind.OpenParenToken = 67;
    SyntaxKind._map[68] = "CloseParenToken";
    SyntaxKind.CloseParenToken = 68;
    SyntaxKind._map[69] = "OpenBracketToken";
    SyntaxKind.OpenBracketToken = 69;
    SyntaxKind._map[70] = "CloseBracketToken";
    SyntaxKind.CloseBracketToken = 70;
    SyntaxKind._map[71] = "DotToken";
    SyntaxKind.DotToken = 71;
    SyntaxKind._map[72] = "DotDotDotToken";
    SyntaxKind.DotDotDotToken = 72;
    SyntaxKind._map[73] = "SemicolonToken";
    SyntaxKind.SemicolonToken = 73;
    SyntaxKind._map[74] = "CommaToken";
    SyntaxKind.CommaToken = 74;
    SyntaxKind._map[75] = "LessThanToken";
    SyntaxKind.LessThanToken = 75;
    SyntaxKind._map[76] = "GreaterThanToken";
    SyntaxKind.GreaterThanToken = 76;
    SyntaxKind._map[77] = "LessThanEqualsToken";
    SyntaxKind.LessThanEqualsToken = 77;
    SyntaxKind._map[78] = "GreaterThanEqualsToken";
    SyntaxKind.GreaterThanEqualsToken = 78;
    SyntaxKind._map[79] = "EqualsEqualsToken";
    SyntaxKind.EqualsEqualsToken = 79;
    SyntaxKind._map[80] = "EqualsGreaterThanToken";
    SyntaxKind.EqualsGreaterThanToken = 80;
    SyntaxKind._map[81] = "ExclamationEqualsToken";
    SyntaxKind.ExclamationEqualsToken = 81;
    SyntaxKind._map[82] = "EqualsEqualsEqualsToken";
    SyntaxKind.EqualsEqualsEqualsToken = 82;
    SyntaxKind._map[83] = "ExclamationEqualsEqualsToken";
    SyntaxKind.ExclamationEqualsEqualsToken = 83;
    SyntaxKind._map[84] = "PlusToken";
    SyntaxKind.PlusToken = 84;
    SyntaxKind._map[85] = "MinusToken";
    SyntaxKind.MinusToken = 85;
    SyntaxKind._map[86] = "AsteriskToken";
    SyntaxKind.AsteriskToken = 86;
    SyntaxKind._map[87] = "PercentToken";
    SyntaxKind.PercentToken = 87;
    SyntaxKind._map[88] = "PlusPlusToken";
    SyntaxKind.PlusPlusToken = 88;
    SyntaxKind._map[89] = "MinusMinusToken";
    SyntaxKind.MinusMinusToken = 89;
    SyntaxKind._map[90] = "LessThanLessThanToken";
    SyntaxKind.LessThanLessThanToken = 90;
    SyntaxKind._map[91] = "GreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanToken = 91;
    SyntaxKind._map[92] = "GreaterThanGreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 92;
    SyntaxKind._map[93] = "AmpersandToken";
    SyntaxKind.AmpersandToken = 93;
    SyntaxKind._map[94] = "BarToken";
    SyntaxKind.BarToken = 94;
    SyntaxKind._map[95] = "CaretToken";
    SyntaxKind.CaretToken = 95;
    SyntaxKind._map[96] = "ExclamationToken";
    SyntaxKind.ExclamationToken = 96;
    SyntaxKind._map[97] = "TildeToken";
    SyntaxKind.TildeToken = 97;
    SyntaxKind._map[98] = "AmpersandAmpersandToken";
    SyntaxKind.AmpersandAmpersandToken = 98;
    SyntaxKind._map[99] = "BarBarToken";
    SyntaxKind.BarBarToken = 99;
    SyntaxKind._map[100] = "QuestionToken";
    SyntaxKind.QuestionToken = 100;
    SyntaxKind._map[101] = "ColonToken";
    SyntaxKind.ColonToken = 101;
    SyntaxKind._map[102] = "EqualsToken";
    SyntaxKind.EqualsToken = 102;
    SyntaxKind._map[103] = "PlusEqualsToken";
    SyntaxKind.PlusEqualsToken = 103;
    SyntaxKind._map[104] = "MinusEqualsToken";
    SyntaxKind.MinusEqualsToken = 104;
    SyntaxKind._map[105] = "AsteriskEqualsToken";
    SyntaxKind.AsteriskEqualsToken = 105;
    SyntaxKind._map[106] = "PercentEqualsToken";
    SyntaxKind.PercentEqualsToken = 106;
    SyntaxKind._map[107] = "LessThanLessThanEqualsToken";
    SyntaxKind.LessThanLessThanEqualsToken = 107;
    SyntaxKind._map[108] = "GreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanEqualsToken = 108;
    SyntaxKind._map[109] = "GreaterThanGreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 109;
    SyntaxKind._map[110] = "AmpersandEqualsToken";
    SyntaxKind.AmpersandEqualsToken = 110;
    SyntaxKind._map[111] = "BarEqualsToken";
    SyntaxKind.BarEqualsToken = 111;
    SyntaxKind._map[112] = "CaretEqualsToken";
    SyntaxKind.CaretEqualsToken = 112;
    SyntaxKind._map[113] = "SlashToken";
    SyntaxKind.SlashToken = 113;
    SyntaxKind._map[114] = "SlashEqualsToken";
    SyntaxKind.SlashEqualsToken = 114;
    SyntaxKind._map[115] = "ErrorToken";
    SyntaxKind.ErrorToken = 115;
    SyntaxKind._map[116] = "EndOfFileToken";
    SyntaxKind.EndOfFileToken = 116;
    SyntaxKind._map[117] = "SourceUnit";
    SyntaxKind.SourceUnit = 117;
    SyntaxKind._map[118] = "IdentifierName";
    SyntaxKind.IdentifierName = 118;
    SyntaxKind._map[119] = "QualifiedName";
    SyntaxKind.QualifiedName = 119;
    SyntaxKind._map[120] = "ObjectType";
    SyntaxKind.ObjectType = 120;
    SyntaxKind._map[121] = "PredefinedType";
    SyntaxKind.PredefinedType = 121;
    SyntaxKind._map[122] = "FunctionType";
    SyntaxKind.FunctionType = 122;
    SyntaxKind._map[123] = "ArrayType";
    SyntaxKind.ArrayType = 123;
    SyntaxKind._map[124] = "ConstructorType";
    SyntaxKind.ConstructorType = 124;
    SyntaxKind._map[125] = "InterfaceDeclaration";
    SyntaxKind.InterfaceDeclaration = 125;
    SyntaxKind._map[126] = "FunctionDeclaration";
    SyntaxKind.FunctionDeclaration = 126;
    SyntaxKind._map[127] = "ModuleDeclaration";
    SyntaxKind.ModuleDeclaration = 127;
    SyntaxKind._map[128] = "ClassDeclaration";
    SyntaxKind.ClassDeclaration = 128;
    SyntaxKind._map[129] = "EnumDeclaration";
    SyntaxKind.EnumDeclaration = 129;
    SyntaxKind._map[130] = "ImportDeclaration";
    SyntaxKind.ImportDeclaration = 130;
    SyntaxKind._map[131] = "MemberFunctionDeclaration";
    SyntaxKind.MemberFunctionDeclaration = 131;
    SyntaxKind._map[132] = "MemberVariableDeclaration";
    SyntaxKind.MemberVariableDeclaration = 132;
    SyntaxKind._map[133] = "ConstructorDeclaration";
    SyntaxKind.ConstructorDeclaration = 133;
    SyntaxKind._map[134] = "GetMemberAccessorDeclaration";
    SyntaxKind.GetMemberAccessorDeclaration = 134;
    SyntaxKind._map[135] = "SetMemberAccessorDeclaration";
    SyntaxKind.SetMemberAccessorDeclaration = 135;
    SyntaxKind._map[136] = "Block";
    SyntaxKind.Block = 136;
    SyntaxKind._map[137] = "IfStatement";
    SyntaxKind.IfStatement = 137;
    SyntaxKind._map[138] = "VariableStatement";
    SyntaxKind.VariableStatement = 138;
    SyntaxKind._map[139] = "ExpressionStatement";
    SyntaxKind.ExpressionStatement = 139;
    SyntaxKind._map[140] = "ReturnStatement";
    SyntaxKind.ReturnStatement = 140;
    SyntaxKind._map[141] = "SwitchStatement";
    SyntaxKind.SwitchStatement = 141;
    SyntaxKind._map[142] = "BreakStatement";
    SyntaxKind.BreakStatement = 142;
    SyntaxKind._map[143] = "ContinueStatement";
    SyntaxKind.ContinueStatement = 143;
    SyntaxKind._map[144] = "ForStatement";
    SyntaxKind.ForStatement = 144;
    SyntaxKind._map[145] = "ForInStatement";
    SyntaxKind.ForInStatement = 145;
    SyntaxKind._map[146] = "EmptyStatement";
    SyntaxKind.EmptyStatement = 146;
    SyntaxKind._map[147] = "ThrowStatement";
    SyntaxKind.ThrowStatement = 147;
    SyntaxKind._map[148] = "WhileStatement";
    SyntaxKind.WhileStatement = 148;
    SyntaxKind._map[149] = "TryStatement";
    SyntaxKind.TryStatement = 149;
    SyntaxKind._map[150] = "LabeledStatement";
    SyntaxKind.LabeledStatement = 150;
    SyntaxKind._map[151] = "DoStatement";
    SyntaxKind.DoStatement = 151;
    SyntaxKind._map[152] = "DebuggerStatement";
    SyntaxKind.DebuggerStatement = 152;
    SyntaxKind._map[153] = "WithStatement";
    SyntaxKind.WithStatement = 153;
    SyntaxKind._map[154] = "PlusExpression";
    SyntaxKind.PlusExpression = 154;
    SyntaxKind._map[155] = "NegateExpression";
    SyntaxKind.NegateExpression = 155;
    SyntaxKind._map[156] = "BitwiseNotExpression";
    SyntaxKind.BitwiseNotExpression = 156;
    SyntaxKind._map[157] = "LogicalNotExpression";
    SyntaxKind.LogicalNotExpression = 157;
    SyntaxKind._map[158] = "PreIncrementExpression";
    SyntaxKind.PreIncrementExpression = 158;
    SyntaxKind._map[159] = "PreDecrementExpression";
    SyntaxKind.PreDecrementExpression = 159;
    SyntaxKind._map[160] = "DeleteExpression";
    SyntaxKind.DeleteExpression = 160;
    SyntaxKind._map[161] = "TypeOfExpression";
    SyntaxKind.TypeOfExpression = 161;
    SyntaxKind._map[162] = "VoidExpression";
    SyntaxKind.VoidExpression = 162;
    SyntaxKind._map[163] = "BooleanLiteralExpression";
    SyntaxKind.BooleanLiteralExpression = 163;
    SyntaxKind._map[164] = "NullLiteralExpression";
    SyntaxKind.NullLiteralExpression = 164;
    SyntaxKind._map[165] = "NumericLiteralExpression";
    SyntaxKind.NumericLiteralExpression = 165;
    SyntaxKind._map[166] = "RegularExpressionLiteralExpression";
    SyntaxKind.RegularExpressionLiteralExpression = 166;
    SyntaxKind._map[167] = "StringLiteralExpression";
    SyntaxKind.StringLiteralExpression = 167;
    SyntaxKind._map[168] = "CommaExpression";
    SyntaxKind.CommaExpression = 168;
    SyntaxKind._map[169] = "AssignmentExpression";
    SyntaxKind.AssignmentExpression = 169;
    SyntaxKind._map[170] = "AddAssignmentExpression";
    SyntaxKind.AddAssignmentExpression = 170;
    SyntaxKind._map[171] = "SubtractAssignmentExpression";
    SyntaxKind.SubtractAssignmentExpression = 171;
    SyntaxKind._map[172] = "MultiplyAssignmentExpression";
    SyntaxKind.MultiplyAssignmentExpression = 172;
    SyntaxKind._map[173] = "DivideAssignmentExpression";
    SyntaxKind.DivideAssignmentExpression = 173;
    SyntaxKind._map[174] = "ModuloAssignmentExpression";
    SyntaxKind.ModuloAssignmentExpression = 174;
    SyntaxKind._map[175] = "AndAssignmentExpression";
    SyntaxKind.AndAssignmentExpression = 175;
    SyntaxKind._map[176] = "ExclusiveOrAssignmentExpression";
    SyntaxKind.ExclusiveOrAssignmentExpression = 176;
    SyntaxKind._map[177] = "OrAssignmentExpression";
    SyntaxKind.OrAssignmentExpression = 177;
    SyntaxKind._map[178] = "LeftShiftAssignmentExpression";
    SyntaxKind.LeftShiftAssignmentExpression = 178;
    SyntaxKind._map[179] = "SignedRightShiftAssignmentExpression";
    SyntaxKind.SignedRightShiftAssignmentExpression = 179;
    SyntaxKind._map[180] = "UnsignedRightShiftAssignmentExpression";
    SyntaxKind.UnsignedRightShiftAssignmentExpression = 180;
    SyntaxKind._map[181] = "ConditionalExpression";
    SyntaxKind.ConditionalExpression = 181;
    SyntaxKind._map[182] = "LogicalOrExpression";
    SyntaxKind.LogicalOrExpression = 182;
    SyntaxKind._map[183] = "LogicalAndExpression";
    SyntaxKind.LogicalAndExpression = 183;
    SyntaxKind._map[184] = "BitwiseOrExpression";
    SyntaxKind.BitwiseOrExpression = 184;
    SyntaxKind._map[185] = "BitwiseExclusiveOrExpression";
    SyntaxKind.BitwiseExclusiveOrExpression = 185;
    SyntaxKind._map[186] = "BitwiseAndExpression";
    SyntaxKind.BitwiseAndExpression = 186;
    SyntaxKind._map[187] = "EqualsWithTypeConversionExpression";
    SyntaxKind.EqualsWithTypeConversionExpression = 187;
    SyntaxKind._map[188] = "NotEqualsWithTypeConversionExpression";
    SyntaxKind.NotEqualsWithTypeConversionExpression = 188;
    SyntaxKind._map[189] = "EqualsExpression";
    SyntaxKind.EqualsExpression = 189;
    SyntaxKind._map[190] = "NotEqualsExpression";
    SyntaxKind.NotEqualsExpression = 190;
    SyntaxKind._map[191] = "LessThanExpression";
    SyntaxKind.LessThanExpression = 191;
    SyntaxKind._map[192] = "GreaterThanExpression";
    SyntaxKind.GreaterThanExpression = 192;
    SyntaxKind._map[193] = "LessThanOrEqualExpression";
    SyntaxKind.LessThanOrEqualExpression = 193;
    SyntaxKind._map[194] = "GreaterThanOrEqualExpression";
    SyntaxKind.GreaterThanOrEqualExpression = 194;
    SyntaxKind._map[195] = "InstanceOfExpression";
    SyntaxKind.InstanceOfExpression = 195;
    SyntaxKind._map[196] = "InExpression";
    SyntaxKind.InExpression = 196;
    SyntaxKind._map[197] = "LeftShiftExpression";
    SyntaxKind.LeftShiftExpression = 197;
    SyntaxKind._map[198] = "SignedRightShiftExpression";
    SyntaxKind.SignedRightShiftExpression = 198;
    SyntaxKind._map[199] = "UnsignedRightShiftExpression";
    SyntaxKind.UnsignedRightShiftExpression = 199;
    SyntaxKind._map[200] = "MultiplyExpression";
    SyntaxKind.MultiplyExpression = 200;
    SyntaxKind._map[201] = "DivideExpression";
    SyntaxKind.DivideExpression = 201;
    SyntaxKind._map[202] = "ModuloExpression";
    SyntaxKind.ModuloExpression = 202;
    SyntaxKind._map[203] = "AddExpression";
    SyntaxKind.AddExpression = 203;
    SyntaxKind._map[204] = "SubtractExpression";
    SyntaxKind.SubtractExpression = 204;
    SyntaxKind._map[205] = "PostIncrementExpression";
    SyntaxKind.PostIncrementExpression = 205;
    SyntaxKind._map[206] = "PostDecrementExpression";
    SyntaxKind.PostDecrementExpression = 206;
    SyntaxKind._map[207] = "MemberAccessExpression";
    SyntaxKind.MemberAccessExpression = 207;
    SyntaxKind._map[208] = "InvocationExpression";
    SyntaxKind.InvocationExpression = 208;
    SyntaxKind._map[209] = "ThisExpression";
    SyntaxKind.ThisExpression = 209;
    SyntaxKind._map[210] = "ArrayLiteralExpression";
    SyntaxKind.ArrayLiteralExpression = 210;
    SyntaxKind._map[211] = "ObjectLiteralExpression";
    SyntaxKind.ObjectLiteralExpression = 211;
    SyntaxKind._map[212] = "ObjectCreationExpression";
    SyntaxKind.ObjectCreationExpression = 212;
    SyntaxKind._map[213] = "ParenthesizedExpression";
    SyntaxKind.ParenthesizedExpression = 213;
    SyntaxKind._map[214] = "ParenthesizedArrowFunctionExpression";
    SyntaxKind.ParenthesizedArrowFunctionExpression = 214;
    SyntaxKind._map[215] = "SimpleArrowFunctionExpression";
    SyntaxKind.SimpleArrowFunctionExpression = 215;
    SyntaxKind._map[216] = "CastExpression";
    SyntaxKind.CastExpression = 216;
    SyntaxKind._map[217] = "ElementAccessExpression";
    SyntaxKind.ElementAccessExpression = 217;
    SyntaxKind._map[218] = "FunctionExpression";
    SyntaxKind.FunctionExpression = 218;
    SyntaxKind._map[219] = "SuperExpression";
    SyntaxKind.SuperExpression = 219;
    SyntaxKind._map[220] = "OmittedExpression";
    SyntaxKind.OmittedExpression = 220;
    SyntaxKind._map[221] = "VariableDeclaration";
    SyntaxKind.VariableDeclaration = 221;
    SyntaxKind._map[222] = "VariableDeclarator";
    SyntaxKind.VariableDeclarator = 222;
    SyntaxKind._map[223] = "ParameterList";
    SyntaxKind.ParameterList = 223;
    SyntaxKind._map[224] = "ArgumentList";
    SyntaxKind.ArgumentList = 224;
    SyntaxKind._map[225] = "ImplementsClause";
    SyntaxKind.ImplementsClause = 225;
    SyntaxKind._map[226] = "ExtendsClause";
    SyntaxKind.ExtendsClause = 226;
    SyntaxKind._map[227] = "EqualsValueClause";
    SyntaxKind.EqualsValueClause = 227;
    SyntaxKind._map[228] = "CaseSwitchClause";
    SyntaxKind.CaseSwitchClause = 228;
    SyntaxKind._map[229] = "DefaultSwitchClause";
    SyntaxKind.DefaultSwitchClause = 229;
    SyntaxKind._map[230] = "ElseClause";
    SyntaxKind.ElseClause = 230;
    SyntaxKind._map[231] = "CatchClause";
    SyntaxKind.CatchClause = 231;
    SyntaxKind._map[232] = "FinallyClause";
    SyntaxKind.FinallyClause = 232;
    SyntaxKind._map[233] = "PropertySignature";
    SyntaxKind.PropertySignature = 233;
    SyntaxKind._map[234] = "CallSignature";
    SyntaxKind.CallSignature = 234;
    SyntaxKind._map[235] = "ConstructSignature";
    SyntaxKind.ConstructSignature = 235;
    SyntaxKind._map[236] = "IndexSignature";
    SyntaxKind.IndexSignature = 236;
    SyntaxKind._map[237] = "FunctionSignature";
    SyntaxKind.FunctionSignature = 237;
    SyntaxKind._map[238] = "Parameter";
    SyntaxKind.Parameter = 238;
    SyntaxKind._map[239] = "TypeAnnotation";
    SyntaxKind.TypeAnnotation = 239;
    SyntaxKind._map[240] = "SimplePropertyAssignment";
    SyntaxKind.SimplePropertyAssignment = 240;
    SyntaxKind._map[241] = "ExternalModuleReference";
    SyntaxKind.ExternalModuleReference = 241;
    SyntaxKind._map[242] = "ModuleNameModuleReference";
    SyntaxKind.ModuleNameModuleReference = 242;
    SyntaxKind._map[243] = "GetAccessorPropertyAssignment";
    SyntaxKind.GetAccessorPropertyAssignment = 243;
    SyntaxKind._map[244] = "SetAccessorPropertyAssignment";
    SyntaxKind.SetAccessorPropertyAssignment = 244;
    SyntaxKind.FirstStandardKeyword = SyntaxKind.BreakKeyword;
    SyntaxKind.LastStandardKeyword = SyntaxKind.WithKeyword;
    SyntaxKind.FirstFutureReservedKeyword = SyntaxKind.ClassKeyword;
    SyntaxKind.LastFutureReservedKeyword = SyntaxKind.SuperKeyword;
    SyntaxKind.FirstFutureReservedStrictKeyword = SyntaxKind.ImplementsKeyword;
    SyntaxKind.LastFutureReservedStrictKeyword = SyntaxKind.YieldKeyword;
    SyntaxKind.FirstTypeScriptKeyword = SyntaxKind.AnyKeyword;
    SyntaxKind.LastTypeScriptKeyword = SyntaxKind.StringKeyword;
    SyntaxKind.FirstKeyword = SyntaxKind.FirstStandardKeyword;
    SyntaxKind.LastKeyword = SyntaxKind.LastTypeScriptKeyword;
    SyntaxKind.FirstToken = SyntaxKind.IdentifierNameToken;
    SyntaxKind.LastToken = SyntaxKind.EndOfFileToken;
    SyntaxKind.FirstPunctuation = SyntaxKind.OpenBraceToken;
    SyntaxKind.LastPunctuation = SyntaxKind.SlashEqualsToken;
})(SyntaxKind || (SyntaxKind = {}));
var SyntaxFacts = (function () {
    function SyntaxFacts() { }
    SyntaxFacts.textToKeywordKind = {
        "any": 56 /* AnyKeyword */ ,
        "bool": 57 /* BoolKeyword */ ,
        "break": 11 /* BreakKeyword */ ,
        "case": 12 /* CaseKeyword */ ,
        "catch": 13 /* CatchKeyword */ ,
        "class": 40 /* ClassKeyword */ ,
        "continue": 14 /* ContinueKeyword */ ,
        "const": 41 /* ConstKeyword */ ,
        "constructor": 58 /* ConstructorKeyword */ ,
        "debugger": 15 /* DebuggerKeyword */ ,
        "declare": 59 /* DeclareKeyword */ ,
        "default": 16 /* DefaultKeyword */ ,
        "delete": 17 /* DeleteKeyword */ ,
        "do": 18 /* DoKeyword */ ,
        "else": 19 /* ElseKeyword */ ,
        "enum": 42 /* EnumKeyword */ ,
        "export": 43 /* ExportKeyword */ ,
        "extends": 44 /* ExtendsKeyword */ ,
        "false": 20 /* FalseKeyword */ ,
        "finally": 21 /* FinallyKeyword */ ,
        "for": 22 /* ForKeyword */ ,
        "function": 23 /* FunctionKeyword */ ,
        "get": 60 /* GetKeyword */ ,
        "if": 24 /* IfKeyword */ ,
        "implements": 47 /* ImplementsKeyword */ ,
        "import": 45 /* ImportKeyword */ ,
        "in": 25 /* InKeyword */ ,
        "instanceof": 26 /* InstanceOfKeyword */ ,
        "interface": 48 /* InterfaceKeyword */ ,
        "let": 49 /* LetKeyword */ ,
        "module": 61 /* ModuleKeyword */ ,
        "new": 27 /* NewKeyword */ ,
        "null": 28 /* NullKeyword */ ,
        "number": 62 /* NumberKeyword */ ,
        "package": 50 /* PackageKeyword */ ,
        "private": 51 /* PrivateKeyword */ ,
        "protected": 52 /* ProtectedKeyword */ ,
        "public": 53 /* PublicKeyword */ ,
        "return": 29 /* ReturnKeyword */ ,
        "set": 63 /* SetKeyword */ ,
        "static": 54 /* StaticKeyword */ ,
        "string": 64 /* StringKeyword */ ,
        "super": 46 /* SuperKeyword */ ,
        "switch": 30 /* SwitchKeyword */ ,
        "this": 31 /* ThisKeyword */ ,
        "throw": 32 /* ThrowKeyword */ ,
        "true": 33 /* TrueKeyword */ ,
        "try": 34 /* TryKeyword */ ,
        "typeof": 35 /* TypeOfKeyword */ ,
        "var": 36 /* VarKeyword */ ,
        "void": 37 /* VoidKeyword */ ,
        "while": 38 /* WhileKeyword */ ,
        "with": 39 /* WithKeyword */ ,
        "yield": 55 /* YieldKeyword */ ,
        "{": 65 /* OpenBraceToken */ ,
        "}": 66 /* CloseBraceToken */ ,
        "(": 67 /* OpenParenToken */ ,
        ")": 68 /* CloseParenToken */ ,
        "[": 69 /* OpenBracketToken */ ,
        "]": 70 /* CloseBracketToken */ ,
        ".": 71 /* DotToken */ ,
        "...": 72 /* DotDotDotToken */ ,
        ";": 73 /* SemicolonToken */ ,
        ",": 74 /* CommaToken */ ,
        "<": 75 /* LessThanToken */ ,
        ">": 76 /* GreaterThanToken */ ,
        "<=": 77 /* LessThanEqualsToken */ ,
        ">=": 78 /* GreaterThanEqualsToken */ ,
        "==": 79 /* EqualsEqualsToken */ ,
        "=>": 80 /* EqualsGreaterThanToken */ ,
        "!=": 81 /* ExclamationEqualsToken */ ,
        "===": 82 /* EqualsEqualsEqualsToken */ ,
        "!==": 83 /* ExclamationEqualsEqualsToken */ ,
        "+": 84 /* PlusToken */ ,
        "-": 85 /* MinusToken */ ,
        "*": 86 /* AsteriskToken */ ,
        "%": 87 /* PercentToken */ ,
        "++": 88 /* PlusPlusToken */ ,
        "--": 89 /* MinusMinusToken */ ,
        "<<": 90 /* LessThanLessThanToken */ ,
        ">>": 91 /* GreaterThanGreaterThanToken */ ,
        ">>>": 92 /* GreaterThanGreaterThanGreaterThanToken */ ,
        "&": 93 /* AmpersandToken */ ,
        "|": 94 /* BarToken */ ,
        "^": 95 /* CaretToken */ ,
        "!": 96 /* ExclamationToken */ ,
        "~": 97 /* TildeToken */ ,
        "&&": 98 /* AmpersandAmpersandToken */ ,
        "||": 99 /* BarBarToken */ ,
        "?": 100 /* QuestionToken */ ,
        ":": 101 /* ColonToken */ ,
        "=": 102 /* EqualsToken */ ,
        "+=": 103 /* PlusEqualsToken */ ,
        "-=": 104 /* MinusEqualsToken */ ,
        "*=": 105 /* AsteriskEqualsToken */ ,
        "%=": 106 /* PercentEqualsToken */ ,
        "<<=": 107 /* LessThanLessThanEqualsToken */ ,
        ">>=": 108 /* GreaterThanGreaterThanEqualsToken */ ,
        ">>>=": 109 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ,
        "&=": 110 /* AmpersandEqualsToken */ ,
        "|=": 111 /* BarEqualsToken */ ,
        "^=": 112 /* CaretEqualsToken */ ,
        "/": 113 /* SlashToken */ ,
        "/=": 114 /* SlashEqualsToken */ 
    };
    SyntaxFacts.kindToText = [];
    SyntaxFacts.initializeStaticData = function initializeStaticData() {
        if(SyntaxFacts.kindToText.length === 0) {
            for(var name in SyntaxFacts.textToKeywordKind) {
                if(SyntaxFacts.textToKeywordKind.hasOwnProperty(name)) {
                    Debug.assert(SyntaxFacts.kindToText[SyntaxFacts.textToKeywordKind[name]] === undefined);
                    SyntaxFacts.kindToText[SyntaxFacts.textToKeywordKind[name]] = name;
                }
            }
            SyntaxFacts.kindToText[58 /* ConstructorKeyword */ ] = "constructor";
        }
    }
    SyntaxFacts.getTokenKind = function getTokenKind(text) {
        if(SyntaxFacts.textToKeywordKind.hasOwnProperty(text)) {
            return SyntaxFacts.textToKeywordKind[text];
        }
        return 0 /* None */ ;
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
        return SyntaxFacts.getPrefixUnaryExpression(tokenKind) !== 0 /* None */ ;
    }
    SyntaxFacts.getPrefixUnaryExpression = function getPrefixUnaryExpression(tokenKind) {
        switch(tokenKind) {
            case 84 /* PlusToken */ : {
                return 154 /* PlusExpression */ ;

            }
            case 85 /* MinusToken */ : {
                return 155 /* NegateExpression */ ;

            }
            case 97 /* TildeToken */ : {
                return 156 /* BitwiseNotExpression */ ;

            }
            case 96 /* ExclamationToken */ : {
                return 157 /* LogicalNotExpression */ ;

            }
            case 88 /* PlusPlusToken */ : {
                return 158 /* PreIncrementExpression */ ;

            }
            case 89 /* MinusMinusToken */ : {
                return 159 /* PreDecrementExpression */ ;

            }
            case 17 /* DeleteKeyword */ : {
                return 160 /* DeleteExpression */ ;

            }
            case 35 /* TypeOfKeyword */ : {
                return 161 /* TypeOfExpression */ ;

            }
            case 37 /* VoidKeyword */ : {
                return 162 /* VoidExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 88 /* PlusPlusToken */ : {
                return 205 /* PostIncrementExpression */ ;

            }
            case 89 /* MinusMinusToken */ : {
                return 206 /* PostDecrementExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.isBinaryExpressionOperatorToken = function isBinaryExpressionOperatorToken(tokenKind) {
        return SyntaxFacts.getBinaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */ ;
    }
    SyntaxFacts.getBinaryExpressionFromOperatorToken = function getBinaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 86 /* AsteriskToken */ : {
                return 200 /* MultiplyExpression */ ;

            }
            case 113 /* SlashToken */ : {
                return 201 /* DivideExpression */ ;

            }
            case 87 /* PercentToken */ : {
                return 202 /* ModuloExpression */ ;

            }
            case 84 /* PlusToken */ : {
                return 203 /* AddExpression */ ;

            }
            case 85 /* MinusToken */ : {
                return 204 /* SubtractExpression */ ;

            }
            case 90 /* LessThanLessThanToken */ : {
                return 197 /* LeftShiftExpression */ ;

            }
            case 91 /* GreaterThanGreaterThanToken */ : {
                return 198 /* SignedRightShiftExpression */ ;

            }
            case 92 /* GreaterThanGreaterThanGreaterThanToken */ : {
                return 199 /* UnsignedRightShiftExpression */ ;

            }
            case 75 /* LessThanToken */ : {
                return 191 /* LessThanExpression */ ;

            }
            case 76 /* GreaterThanToken */ : {
                return 192 /* GreaterThanExpression */ ;

            }
            case 77 /* LessThanEqualsToken */ : {
                return 193 /* LessThanOrEqualExpression */ ;

            }
            case 78 /* GreaterThanEqualsToken */ : {
                return 194 /* GreaterThanOrEqualExpression */ ;

            }
            case 26 /* InstanceOfKeyword */ : {
                return 195 /* InstanceOfExpression */ ;

            }
            case 25 /* InKeyword */ : {
                return 196 /* InExpression */ ;

            }
            case 79 /* EqualsEqualsToken */ : {
                return 187 /* EqualsWithTypeConversionExpression */ ;

            }
            case 81 /* ExclamationEqualsToken */ : {
                return 188 /* NotEqualsWithTypeConversionExpression */ ;

            }
            case 82 /* EqualsEqualsEqualsToken */ : {
                return 189 /* EqualsExpression */ ;

            }
            case 83 /* ExclamationEqualsEqualsToken */ : {
                return 190 /* NotEqualsExpression */ ;

            }
            case 93 /* AmpersandToken */ : {
                return 186 /* BitwiseAndExpression */ ;

            }
            case 95 /* CaretToken */ : {
                return 185 /* BitwiseExclusiveOrExpression */ ;

            }
            case 94 /* BarToken */ : {
                return 184 /* BitwiseOrExpression */ ;

            }
            case 98 /* AmpersandAmpersandToken */ : {
                return 183 /* LogicalAndExpression */ ;

            }
            case 99 /* BarBarToken */ : {
                return 182 /* LogicalOrExpression */ ;

            }
            case 111 /* BarEqualsToken */ : {
                return 177 /* OrAssignmentExpression */ ;

            }
            case 110 /* AmpersandEqualsToken */ : {
                return 175 /* AndAssignmentExpression */ ;

            }
            case 112 /* CaretEqualsToken */ : {
                return 176 /* ExclusiveOrAssignmentExpression */ ;

            }
            case 107 /* LessThanLessThanEqualsToken */ : {
                return 178 /* LeftShiftAssignmentExpression */ ;

            }
            case 108 /* GreaterThanGreaterThanEqualsToken */ : {
                return 179 /* SignedRightShiftAssignmentExpression */ ;

            }
            case 109 /* GreaterThanGreaterThanGreaterThanEqualsToken */ : {
                return 180 /* UnsignedRightShiftAssignmentExpression */ ;

            }
            case 103 /* PlusEqualsToken */ : {
                return 170 /* AddAssignmentExpression */ ;

            }
            case 104 /* MinusEqualsToken */ : {
                return 171 /* SubtractAssignmentExpression */ ;

            }
            case 105 /* AsteriskEqualsToken */ : {
                return 172 /* MultiplyAssignmentExpression */ ;

            }
            case 114 /* SlashEqualsToken */ : {
                return 173 /* DivideAssignmentExpression */ ;

            }
            case 106 /* PercentEqualsToken */ : {
                return 174 /* ModuloAssignmentExpression */ ;

            }
            case 102 /* EqualsToken */ : {
                return 169 /* AssignmentExpression */ ;

            }
            case 74 /* CommaToken */ : {
                return 168 /* CommaExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    return SyntaxFacts;
})();
var SyntaxNode = (function () {
    function SyntaxNode() { }
    SyntaxNode.prototype.isToken = function () {
        return false;
    };
    SyntaxNode.prototype.isNode = function () {
        return true;
    };
    SyntaxNode.prototype.isList = function () {
        return false;
    };
    SyntaxNode.prototype.isSeparatedList = function () {
        return false;
    };
    SyntaxNode.prototype.kind = function () {
        throw Errors.abstract();
    };
    SyntaxNode.prototype.isMissing = function () {
        throw Errors.abstract();
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
    SyntaxNode.prototype.accept = function (visitor) {
        throw Errors.abstract();
    };
    SyntaxNode.prototype.accept1 = function (visitor) {
        throw Errors.abstract();
    };
    return SyntaxNode;
})();
var SyntaxList;
(function (SyntaxList) {
    var EmptySyntaxList = (function () {
        function EmptySyntaxList() { }
        EmptySyntaxList.prototype.isToken = function () {
            return false;
        };
        EmptySyntaxList.prototype.isNode = function () {
            return false;
        };
        EmptySyntaxList.prototype.isList = function () {
            return true;
        };
        EmptySyntaxList.prototype.isSeparatedList = function () {
            return false;
        };
        EmptySyntaxList.prototype.kind = function () {
            return 1 /* List */ ;
        };
        EmptySyntaxList.prototype.toJSON = function (key) {
            return [];
        };
        EmptySyntaxList.prototype.count = function () {
            return 0;
        };
        EmptySyntaxList.prototype.isMissing = function () {
            return true;
        };
        EmptySyntaxList.prototype.syntaxNodeAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        return EmptySyntaxList;
    })();    
    SyntaxList.empty = new EmptySyntaxList();
    var SingletonSyntaxList = (function () {
        function SingletonSyntaxList(item) {
            this._item = item;
        }
        SingletonSyntaxList.prototype.isToken = function () {
            return false;
        };
        SingletonSyntaxList.prototype.isNode = function () {
            return false;
        };
        SingletonSyntaxList.prototype.isList = function () {
            return true;
        };
        SingletonSyntaxList.prototype.isSeparatedList = function () {
            return false;
        };
        SingletonSyntaxList.prototype.kind = function () {
            return 1 /* List */ ;
        };
        SingletonSyntaxList.prototype.isMissing = function () {
            return this._item.isMissing();
        };
        SingletonSyntaxList.prototype.toJSON = function (key) {
            return [
                this._item
            ];
        };
        SingletonSyntaxList.prototype.count = function () {
            return 1;
        };
        SingletonSyntaxList.prototype.syntaxNodeAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this._item;
        };
        return SingletonSyntaxList;
    })();    
    var NormalSyntaxList = (function () {
        function NormalSyntaxList(nodes) {
            this.nodes = nodes;
        }
        NormalSyntaxList.prototype.isToken = function () {
            return false;
        };
        NormalSyntaxList.prototype.isNode = function () {
            return false;
        };
        NormalSyntaxList.prototype.isList = function () {
            return true;
        };
        NormalSyntaxList.prototype.isSeparatedList = function () {
            return false;
        };
        NormalSyntaxList.prototype.kind = function () {
            return 1 /* List */ ;
        };
        NormalSyntaxList.prototype.isMissing = function () {
            for(var i = 0, n = this.nodes.length; i < n; i++) {
                if(!this.nodes[i].isMissing()) {
                    return false;
                }
            }
            return true;
        };
        NormalSyntaxList.prototype.toJSON = function (key) {
            return this.nodes;
        };
        NormalSyntaxList.prototype.count = function () {
            return this.nodes.length;
        };
        NormalSyntaxList.prototype.syntaxNodeAt = function (index) {
            if(index < 0 || index >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.nodes[index];
        };
        return NormalSyntaxList;
    })();    
    function create(nodes) {
        if(nodes === null || nodes.length === 0) {
            return SyntaxList.empty;
        }
        if(nodes.length === 1) {
            var item = nodes[0];
            return new SingletonSyntaxList(item);
        }
        return new NormalSyntaxList(nodes);
    }
    SyntaxList.create = create;
})(SyntaxList || (SyntaxList = {}));
var SourceUnitSyntax = (function (_super) {
    __extends(SourceUnitSyntax, _super);
    function SourceUnitSyntax(moduleElements, endOfFileToken) {
        _super.call(this);
        this._moduleElements = moduleElements;
        this._endOfFileToken = endOfFileToken;
    }
    SourceUnitSyntax.prototype.accept = function (visitor) {
        visitor.visitSourceUnit(this);
    };
    SourceUnitSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitSourceUnit(this);
    };
    SourceUnitSyntax.prototype.kind = function () {
        return 117 /* SourceUnit */ ;
    };
    SourceUnitSyntax.prototype.isMissing = function () {
        if(!this._moduleElements.isMissing()) {
            return false;
        }
        if(!this._endOfFileToken.isMissing()) {
            return false;
        }
        return true;
    };
    SourceUnitSyntax.prototype.moduleElements = function () {
        return this._moduleElements;
    };
    SourceUnitSyntax.prototype.endOfFileToken = function () {
        return this._endOfFileToken;
    };
    SourceUnitSyntax.prototype.update = function (moduleElements, endOfFileToken) {
        if(this._moduleElements === moduleElements && this._endOfFileToken === endOfFileToken) {
            return this;
        }
        return new SourceUnitSyntax(moduleElements, endOfFileToken);
    };
    return SourceUnitSyntax;
})(SyntaxNode);
var ModuleElementSyntax = (function (_super) {
    __extends(ModuleElementSyntax, _super);
    function ModuleElementSyntax() {
        _super.call(this);
    }
    return ModuleElementSyntax;
})(SyntaxNode);
var ModuleReferenceSyntax = (function (_super) {
    __extends(ModuleReferenceSyntax, _super);
    function ModuleReferenceSyntax() {
        _super.call(this);
    }
    return ModuleReferenceSyntax;
})(SyntaxNode);
var ExternalModuleReferenceSyntax = (function (_super) {
    __extends(ExternalModuleReferenceSyntax, _super);
    function ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken) {
        _super.call(this);
        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
    }
    ExternalModuleReferenceSyntax.prototype.accept = function (visitor) {
        visitor.visitExternalModuleReference(this);
    };
    ExternalModuleReferenceSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitExternalModuleReference(this);
    };
    ExternalModuleReferenceSyntax.prototype.kind = function () {
        return 241 /* ExternalModuleReference */ ;
    };
    ExternalModuleReferenceSyntax.prototype.isMissing = function () {
        if(!this._moduleKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._stringLiteral.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        return true;
    };
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
    ExternalModuleReferenceSyntax.prototype.update = function (moduleKeyword, openParenToken, stringLiteral, closeParenToken) {
        if(this._moduleKeyword === moduleKeyword && this._openParenToken === openParenToken && this._stringLiteral === stringLiteral && this._closeParenToken === closeParenToken) {
            return this;
        }
        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
    };
    return ExternalModuleReferenceSyntax;
})(ModuleReferenceSyntax);
var ModuleNameModuleReferenceSyntax = (function (_super) {
    __extends(ModuleNameModuleReferenceSyntax, _super);
    function ModuleNameModuleReferenceSyntax(moduleName) {
        _super.call(this);
        this._moduleName = moduleName;
    }
    ModuleNameModuleReferenceSyntax.prototype.accept = function (visitor) {
        visitor.visitModuleNameModuleReference(this);
    };
    ModuleNameModuleReferenceSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitModuleNameModuleReference(this);
    };
    ModuleNameModuleReferenceSyntax.prototype.kind = function () {
        return 242 /* ModuleNameModuleReference */ ;
    };
    ModuleNameModuleReferenceSyntax.prototype.isMissing = function () {
        if(!this._moduleName.isMissing()) {
            return false;
        }
        return true;
    };
    ModuleNameModuleReferenceSyntax.prototype.moduleName = function () {
        return this._moduleName;
    };
    ModuleNameModuleReferenceSyntax.prototype.update = function (moduleName) {
        if(this._moduleName === moduleName) {
            return this;
        }
        return new ModuleNameModuleReferenceSyntax(moduleName);
    };
    return ModuleNameModuleReferenceSyntax;
})(ModuleReferenceSyntax);
var ImportDeclarationSyntax = (function (_super) {
    __extends(ImportDeclarationSyntax, _super);
    function ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken) {
        _super.call(this);
        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }
    ImportDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitImportDeclaration(this);
    };
    ImportDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitImportDeclaration(this);
    };
    ImportDeclarationSyntax.prototype.kind = function () {
        return 130 /* ImportDeclaration */ ;
    };
    ImportDeclarationSyntax.prototype.isMissing = function () {
        if(!this._importKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._equalsToken.isMissing()) {
            return false;
        }
        if(!this._moduleReference.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    ImportDeclarationSyntax.prototype.importKeyword = function () {
        return this._importKeyword;
    };
    ImportDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    ImportDeclarationSyntax.prototype.equalsToken = function () {
        return this._equalsToken;
    };
    ImportDeclarationSyntax.prototype.moduleReference = function () {
        return this._moduleReference;
    };
    ImportDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    ImportDeclarationSyntax.prototype.update = function (importKeyword, identifier, equalsToken, moduleReference, semicolonToken) {
        if(this._importKeyword === importKeyword && this._identifier === identifier && this._equalsToken === equalsToken && this._moduleReference === moduleReference && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken);
    };
    return ImportDeclarationSyntax;
})(ModuleElementSyntax);
var ClassDeclarationSyntax = (function (_super) {
    __extends(ClassDeclarationSyntax, _super);
    function ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._classKeyword = classKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._implementsClause = implementsClause;
        this._openBraceToken = openBraceToken;
        this._classElements = classElements;
        this._closeBraceToken = closeBraceToken;
    }
    ClassDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitClassDeclaration(this);
    };
    ClassDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitClassDeclaration(this);
    };
    ClassDeclarationSyntax.prototype.kind = function () {
        return 128 /* ClassDeclaration */ ;
    };
    ClassDeclarationSyntax.prototype.isMissing = function () {
        if(this._exportKeyword !== null && !this._exportKeyword.isMissing()) {
            return false;
        }
        if(this._declareKeyword !== null && !this._declareKeyword.isMissing()) {
            return false;
        }
        if(!this._classKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(this._extendsClause !== null && !this._extendsClause.isMissing()) {
            return false;
        }
        if(this._implementsClause !== null && !this._implementsClause.isMissing()) {
            return false;
        }
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._classElements.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
    };
    ClassDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    ClassDeclarationSyntax.prototype.declareKeyword = function () {
        return this._declareKeyword;
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
    ClassDeclarationSyntax.prototype.update = function (exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken) {
        if(this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._classKeyword === classKeyword && this._identifier === identifier && this._extendsClause === extendsClause && this._implementsClause === implementsClause && this._openBraceToken === openBraceToken && this._classElements === classElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken);
    };
    return ClassDeclarationSyntax;
})(ModuleElementSyntax);
var InterfaceDeclarationSyntax = (function (_super) {
    __extends(InterfaceDeclarationSyntax, _super);
    function InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._interfaceKeyword = interfaceKeyword;
        this._identifier = identifier;
        this._extendsClause = extendsClause;
        this._body = body;
    }
    InterfaceDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitInterfaceDeclaration(this);
    };
    InterfaceDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitInterfaceDeclaration(this);
    };
    InterfaceDeclarationSyntax.prototype.kind = function () {
        return 125 /* InterfaceDeclaration */ ;
    };
    InterfaceDeclarationSyntax.prototype.isMissing = function () {
        if(this._exportKeyword !== null && !this._exportKeyword.isMissing()) {
            return false;
        }
        if(!this._interfaceKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(this._extendsClause !== null && !this._extendsClause.isMissing()) {
            return false;
        }
        if(!this._body.isMissing()) {
            return false;
        }
        return true;
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
    InterfaceDeclarationSyntax.prototype.update = function (exportKeyword, interfaceKeyword, identifier, extendsClause, body) {
        if(this._exportKeyword === exportKeyword && this._interfaceKeyword === interfaceKeyword && this._identifier === identifier && this._extendsClause === extendsClause && this._body === body) {
            return this;
        }
        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, body);
    };
    return InterfaceDeclarationSyntax;
})(ModuleElementSyntax);
var ExtendsClauseSyntax = (function (_super) {
    __extends(ExtendsClauseSyntax, _super);
    function ExtendsClauseSyntax(extendsKeyword, typeNames) {
        _super.call(this);
        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
    }
    ExtendsClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitExtendsClause(this);
    };
    ExtendsClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitExtendsClause(this);
    };
    ExtendsClauseSyntax.prototype.kind = function () {
        return 226 /* ExtendsClause */ ;
    };
    ExtendsClauseSyntax.prototype.isMissing = function () {
        if(!this._extendsKeyword.isMissing()) {
            return false;
        }
        if(!this._typeNames.isMissing()) {
            return false;
        }
        return true;
    };
    ExtendsClauseSyntax.prototype.extendsKeyword = function () {
        return this._extendsKeyword;
    };
    ExtendsClauseSyntax.prototype.typeNames = function () {
        return this._typeNames;
    };
    ExtendsClauseSyntax.prototype.update = function (extendsKeyword, typeNames) {
        if(this._extendsKeyword === extendsKeyword && this._typeNames === typeNames) {
            return this;
        }
        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    };
    return ExtendsClauseSyntax;
})(SyntaxNode);
var ImplementsClauseSyntax = (function (_super) {
    __extends(ImplementsClauseSyntax, _super);
    function ImplementsClauseSyntax(implementsKeyword, typeNames) {
        _super.call(this);
        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
    }
    ImplementsClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitImplementsClause(this);
    };
    ImplementsClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitImplementsClause(this);
    };
    ImplementsClauseSyntax.prototype.kind = function () {
        return 225 /* ImplementsClause */ ;
    };
    ImplementsClauseSyntax.prototype.isMissing = function () {
        if(!this._implementsKeyword.isMissing()) {
            return false;
        }
        if(!this._typeNames.isMissing()) {
            return false;
        }
        return true;
    };
    ImplementsClauseSyntax.prototype.implementsKeyword = function () {
        return this._implementsKeyword;
    };
    ImplementsClauseSyntax.prototype.typeNames = function () {
        return this._typeNames;
    };
    ImplementsClauseSyntax.prototype.update = function (implementsKeyword, typeNames) {
        if(this._implementsKeyword === implementsKeyword && this._typeNames === typeNames) {
            return this;
        }
        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    };
    return ImplementsClauseSyntax;
})(SyntaxNode);
var ModuleDeclarationSyntax = (function (_super) {
    __extends(ModuleDeclarationSyntax, _super);
    function ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._moduleKeyword = moduleKeyword;
        this._moduleName = moduleName;
        this._stringLiteral = stringLiteral;
        this._openBraceToken = openBraceToken;
        this._moduleElements = moduleElements;
        this._closeBraceToken = closeBraceToken;
    }
    ModuleDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitModuleDeclaration(this);
    };
    ModuleDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitModuleDeclaration(this);
    };
    ModuleDeclarationSyntax.prototype.kind = function () {
        return 127 /* ModuleDeclaration */ ;
    };
    ModuleDeclarationSyntax.prototype.isMissing = function () {
        if(this._exportKeyword !== null && !this._exportKeyword.isMissing()) {
            return false;
        }
        if(this._declareKeyword !== null && !this._declareKeyword.isMissing()) {
            return false;
        }
        if(!this._moduleKeyword.isMissing()) {
            return false;
        }
        if(this._moduleName !== null && !this._moduleName.isMissing()) {
            return false;
        }
        if(this._stringLiteral !== null && !this._stringLiteral.isMissing()) {
            return false;
        }
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._moduleElements.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
    };
    ModuleDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    ModuleDeclarationSyntax.prototype.declareKeyword = function () {
        return this._declareKeyword;
    };
    ModuleDeclarationSyntax.prototype.moduleKeyword = function () {
        return this._moduleKeyword;
    };
    ModuleDeclarationSyntax.prototype.moduleName = function () {
        return this._moduleName;
    };
    ModuleDeclarationSyntax.prototype.stringLiteral = function () {
        return this._stringLiteral;
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
    ModuleDeclarationSyntax.prototype.update = function (exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken) {
        if(this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._moduleKeyword === moduleKeyword && this._moduleName === moduleName && this._stringLiteral === stringLiteral && this._openBraceToken === openBraceToken && this._moduleElements === moduleElements && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken);
    };
    return ModuleDeclarationSyntax;
})(ModuleElementSyntax);
var StatementSyntax = (function (_super) {
    __extends(StatementSyntax, _super);
    function StatementSyntax() {
        _super.call(this);
    }
    return StatementSyntax;
})(ModuleElementSyntax);
var FunctionDeclarationSyntax = (function (_super) {
    __extends(FunctionDeclarationSyntax, _super);
    function FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    FunctionDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitFunctionDeclaration(this);
    };
    FunctionDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitFunctionDeclaration(this);
    };
    FunctionDeclarationSyntax.prototype.kind = function () {
        return 126 /* FunctionDeclaration */ ;
    };
    FunctionDeclarationSyntax.prototype.isMissing = function () {
        if(this._exportKeyword !== null && !this._exportKeyword.isMissing()) {
            return false;
        }
        if(this._declareKeyword !== null && !this._declareKeyword.isMissing()) {
            return false;
        }
        if(!this._functionKeyword.isMissing()) {
            return false;
        }
        if(!this._functionSignature.isMissing()) {
            return false;
        }
        if(this._block !== null && !this._block.isMissing()) {
            return false;
        }
        if(this._semicolonToken !== null && !this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    FunctionDeclarationSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    FunctionDeclarationSyntax.prototype.declareKeyword = function () {
        return this._declareKeyword;
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
    FunctionDeclarationSyntax.prototype.update = function (exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken) {
        if(this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._functionKeyword === functionKeyword && this._functionSignature === functionSignature && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken);
    };
    return FunctionDeclarationSyntax;
})(StatementSyntax);
var VariableStatementSyntax = (function (_super) {
    __extends(VariableStatementSyntax, _super);
    function VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._variableDeclaration = variableDeclaration;
        this._semicolonToken = semicolonToken;
    }
    VariableStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitVariableStatement(this);
    };
    VariableStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitVariableStatement(this);
    };
    VariableStatementSyntax.prototype.kind = function () {
        return 138 /* VariableStatement */ ;
    };
    VariableStatementSyntax.prototype.isMissing = function () {
        if(this._exportKeyword !== null && !this._exportKeyword.isMissing()) {
            return false;
        }
        if(this._declareKeyword !== null && !this._declareKeyword.isMissing()) {
            return false;
        }
        if(!this._variableDeclaration.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    VariableStatementSyntax.prototype.exportKeyword = function () {
        return this._exportKeyword;
    };
    VariableStatementSyntax.prototype.declareKeyword = function () {
        return this._declareKeyword;
    };
    VariableStatementSyntax.prototype.variableDeclaration = function () {
        return this._variableDeclaration;
    };
    VariableStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    VariableStatementSyntax.prototype.update = function (exportKeyword, declareKeyword, variableDeclaration, semicolonToken) {
        if(this._exportKeyword === exportKeyword && this._declareKeyword === declareKeyword && this._variableDeclaration === variableDeclaration && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
    };
    return VariableStatementSyntax;
})(StatementSyntax);
var ExpressionSyntax = (function (_super) {
    __extends(ExpressionSyntax, _super);
    function ExpressionSyntax() {
        _super.call(this);
    }
    return ExpressionSyntax;
})(SyntaxNode);
var UnaryExpressionSyntax = (function (_super) {
    __extends(UnaryExpressionSyntax, _super);
    function UnaryExpressionSyntax() {
        _super.call(this);
    }
    return UnaryExpressionSyntax;
})(ExpressionSyntax);
var VariableDeclarationSyntax = (function (_super) {
    __extends(VariableDeclarationSyntax, _super);
    function VariableDeclarationSyntax(varKeyword, variableDeclarators) {
        _super.call(this);
        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
    }
    VariableDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitVariableDeclaration(this);
    };
    VariableDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitVariableDeclaration(this);
    };
    VariableDeclarationSyntax.prototype.kind = function () {
        return 221 /* VariableDeclaration */ ;
    };
    VariableDeclarationSyntax.prototype.isMissing = function () {
        if(!this._varKeyword.isMissing()) {
            return false;
        }
        if(!this._variableDeclarators.isMissing()) {
            return false;
        }
        return true;
    };
    VariableDeclarationSyntax.prototype.varKeyword = function () {
        return this._varKeyword;
    };
    VariableDeclarationSyntax.prototype.variableDeclarators = function () {
        return this._variableDeclarators;
    };
    VariableDeclarationSyntax.prototype.update = function (varKeyword, variableDeclarators) {
        if(this._varKeyword === varKeyword && this._variableDeclarators === variableDeclarators) {
            return this;
        }
        return new VariableDeclarationSyntax(varKeyword, variableDeclarators);
    };
    return VariableDeclarationSyntax;
})(SyntaxNode);
var VariableDeclaratorSyntax = (function (_super) {
    __extends(VariableDeclaratorSyntax, _super);
    function VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause) {
        _super.call(this);
        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }
    VariableDeclaratorSyntax.prototype.accept = function (visitor) {
        visitor.visitVariableDeclarator(this);
    };
    VariableDeclaratorSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitVariableDeclarator(this);
    };
    VariableDeclaratorSyntax.prototype.kind = function () {
        return 222 /* VariableDeclarator */ ;
    };
    VariableDeclaratorSyntax.prototype.isMissing = function () {
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        if(this._equalsValueClause !== null && !this._equalsValueClause.isMissing()) {
            return false;
        }
        return true;
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
    VariableDeclaratorSyntax.prototype.update = function (identifier, typeAnnotation, equalsValueClause) {
        if(this._identifier === identifier && this._typeAnnotation === typeAnnotation && this._equalsValueClause === equalsValueClause) {
            return this;
        }
        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause);
    };
    return VariableDeclaratorSyntax;
})(SyntaxNode);
var EqualsValueClauseSyntax = (function (_super) {
    __extends(EqualsValueClauseSyntax, _super);
    function EqualsValueClauseSyntax(equalsToken, value) {
        _super.call(this);
        this._equalsToken = equalsToken;
        this._value = value;
    }
    EqualsValueClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitEqualsValueClause(this);
    };
    EqualsValueClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitEqualsValueClause(this);
    };
    EqualsValueClauseSyntax.prototype.kind = function () {
        return 227 /* EqualsValueClause */ ;
    };
    EqualsValueClauseSyntax.prototype.isMissing = function () {
        if(!this._equalsToken.isMissing()) {
            return false;
        }
        if(!this._value.isMissing()) {
            return false;
        }
        return true;
    };
    EqualsValueClauseSyntax.prototype.equalsToken = function () {
        return this._equalsToken;
    };
    EqualsValueClauseSyntax.prototype.value = function () {
        return this._value;
    };
    EqualsValueClauseSyntax.prototype.update = function (equalsToken, value) {
        if(this._equalsToken === equalsToken && this._value === value) {
            return this;
        }
        return new EqualsValueClauseSyntax(equalsToken, value);
    };
    return EqualsValueClauseSyntax;
})(SyntaxNode);
var PrefixUnaryExpressionSyntax = (function (_super) {
    __extends(PrefixUnaryExpressionSyntax, _super);
    function PrefixUnaryExpressionSyntax(kind, operatorToken, operand) {
        _super.call(this);
        this._kind = kind;
        this._operatorToken = operatorToken;
        this._operand = operand;
    }
    PrefixUnaryExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitPrefixUnaryExpression(this);
    };
    PrefixUnaryExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitPrefixUnaryExpression(this);
    };
    PrefixUnaryExpressionSyntax.prototype.isMissing = function () {
        if(!this._operatorToken.isMissing()) {
            return false;
        }
        if(!this._operand.isMissing()) {
            return false;
        }
        return true;
    };
    PrefixUnaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    PrefixUnaryExpressionSyntax.prototype.operatorToken = function () {
        return this._operatorToken;
    };
    PrefixUnaryExpressionSyntax.prototype.operand = function () {
        return this._operand;
    };
    PrefixUnaryExpressionSyntax.prototype.update = function (kind, operatorToken, operand) {
        if(this._kind === kind && this._operatorToken === operatorToken && this._operand === operand) {
            return this;
        }
        return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand);
    };
    return PrefixUnaryExpressionSyntax;
})(UnaryExpressionSyntax);
var ThisExpressionSyntax = (function (_super) {
    __extends(ThisExpressionSyntax, _super);
    function ThisExpressionSyntax(thisKeyword) {
        _super.call(this);
        this._thisKeyword = thisKeyword;
    }
    ThisExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitThisExpression(this);
    };
    ThisExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitThisExpression(this);
    };
    ThisExpressionSyntax.prototype.kind = function () {
        return 209 /* ThisExpression */ ;
    };
    ThisExpressionSyntax.prototype.isMissing = function () {
        if(!this._thisKeyword.isMissing()) {
            return false;
        }
        return true;
    };
    ThisExpressionSyntax.prototype.thisKeyword = function () {
        return this._thisKeyword;
    };
    ThisExpressionSyntax.prototype.update = function (thisKeyword) {
        if(this._thisKeyword === thisKeyword) {
            return this;
        }
        return new ThisExpressionSyntax(thisKeyword);
    };
    return ThisExpressionSyntax;
})(UnaryExpressionSyntax);
var LiteralExpressionSyntax = (function (_super) {
    __extends(LiteralExpressionSyntax, _super);
    function LiteralExpressionSyntax(kind, literalToken) {
        _super.call(this);
        this._kind = kind;
        this._literalToken = literalToken;
    }
    LiteralExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitLiteralExpression(this);
    };
    LiteralExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitLiteralExpression(this);
    };
    LiteralExpressionSyntax.prototype.isMissing = function () {
        if(!this._literalToken.isMissing()) {
            return false;
        }
        return true;
    };
    LiteralExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    LiteralExpressionSyntax.prototype.literalToken = function () {
        return this._literalToken;
    };
    LiteralExpressionSyntax.prototype.update = function (kind, literalToken) {
        if(this._kind === kind && this._literalToken === literalToken) {
            return this;
        }
        return new LiteralExpressionSyntax(kind, literalToken);
    };
    return LiteralExpressionSyntax;
})(UnaryExpressionSyntax);
var ArrayLiteralExpressionSyntax = (function (_super) {
    __extends(ArrayLiteralExpressionSyntax, _super);
    function ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken) {
        _super.call(this);
        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
    }
    ArrayLiteralExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitArrayLiteralExpression(this);
    };
    ArrayLiteralExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitArrayLiteralExpression(this);
    };
    ArrayLiteralExpressionSyntax.prototype.kind = function () {
        return 210 /* ArrayLiteralExpression */ ;
    };
    ArrayLiteralExpressionSyntax.prototype.isMissing = function () {
        if(!this._openBracketToken.isMissing()) {
            return false;
        }
        if(!this._expressions.isMissing()) {
            return false;
        }
        if(!this._closeBracketToken.isMissing()) {
            return false;
        }
        return true;
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
    ArrayLiteralExpressionSyntax.prototype.update = function (openBracketToken, expressions, closeBracketToken) {
        if(this._openBracketToken === openBracketToken && this._expressions === expressions && this._closeBracketToken === closeBracketToken) {
            return this;
        }
        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken);
    };
    return ArrayLiteralExpressionSyntax;
})(UnaryExpressionSyntax);
var OmittedExpressionSyntax = (function (_super) {
    __extends(OmittedExpressionSyntax, _super);
    function OmittedExpressionSyntax() {
        _super.call(this);
    }
    OmittedExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitOmittedExpression(this);
    };
    OmittedExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitOmittedExpression(this);
    };
    OmittedExpressionSyntax.prototype.kind = function () {
        return 220 /* OmittedExpression */ ;
    };
    OmittedExpressionSyntax.prototype.isMissing = function () {
        return true;
    };
    OmittedExpressionSyntax.prototype.update = function () {
        return this;
    };
    return OmittedExpressionSyntax;
})(ExpressionSyntax);
var ParenthesizedExpressionSyntax = (function (_super) {
    __extends(ParenthesizedExpressionSyntax, _super);
    function ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken) {
        _super.call(this);
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
    }
    ParenthesizedExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitParenthesizedExpression(this);
    };
    ParenthesizedExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitParenthesizedExpression(this);
    };
    ParenthesizedExpressionSyntax.prototype.kind = function () {
        return 213 /* ParenthesizedExpression */ ;
    };
    ParenthesizedExpressionSyntax.prototype.isMissing = function () {
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        return true;
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
    ParenthesizedExpressionSyntax.prototype.update = function (openParenToken, expression, closeParenToken) {
        if(this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken) {
            return this;
        }
        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    };
    return ParenthesizedExpressionSyntax;
})(UnaryExpressionSyntax);
var ArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ArrowFunctionExpressionSyntax, _super);
    function ArrowFunctionExpressionSyntax() {
        _super.call(this);
    }
    return ArrowFunctionExpressionSyntax;
})(UnaryExpressionSyntax);
var SimpleArrowFunctionExpression = (function (_super) {
    __extends(SimpleArrowFunctionExpression, _super);
    function SimpleArrowFunctionExpression(identifier, equalsGreaterThanToken, body) {
        _super.call(this);
        this._identifier = identifier;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }
    SimpleArrowFunctionExpression.prototype.accept = function (visitor) {
        visitor.visitSimpleArrowFunctionExpression(this);
    };
    SimpleArrowFunctionExpression.prototype.accept1 = function (visitor) {
        return visitor.visitSimpleArrowFunctionExpression(this);
    };
    SimpleArrowFunctionExpression.prototype.kind = function () {
        return 215 /* SimpleArrowFunctionExpression */ ;
    };
    SimpleArrowFunctionExpression.prototype.isMissing = function () {
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._equalsGreaterThanToken.isMissing()) {
            return false;
        }
        if(!this._body.isMissing()) {
            return false;
        }
        return true;
    };
    SimpleArrowFunctionExpression.prototype.identifier = function () {
        return this._identifier;
    };
    SimpleArrowFunctionExpression.prototype.equalsGreaterThanToken = function () {
        return this._equalsGreaterThanToken;
    };
    SimpleArrowFunctionExpression.prototype.body = function () {
        return this._body;
    };
    SimpleArrowFunctionExpression.prototype.update = function (identifier, equalsGreaterThanToken, body) {
        if(this._identifier === identifier && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }
        return new SimpleArrowFunctionExpression(identifier, equalsGreaterThanToken, body);
    };
    return SimpleArrowFunctionExpression;
})(ArrowFunctionExpressionSyntax);
var ParenthesizedArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ParenthesizedArrowFunctionExpressionSyntax, _super);
    function ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body) {
        _super.call(this);
        this._callSignature = callSignature;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._body = body;
    }
    ParenthesizedArrowFunctionExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitParenthesizedArrowFunctionExpression(this);
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitParenthesizedArrowFunctionExpression(this);
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.kind = function () {
        return 214 /* ParenthesizedArrowFunctionExpression */ ;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.isMissing = function () {
        if(!this._callSignature.isMissing()) {
            return false;
        }
        if(!this._equalsGreaterThanToken.isMissing()) {
            return false;
        }
        if(!this._body.isMissing()) {
            return false;
        }
        return true;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.callSignature = function () {
        return this._callSignature;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.equalsGreaterThanToken = function () {
        return this._equalsGreaterThanToken;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.body = function () {
        return this._body;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.update = function (callSignature, equalsGreaterThanToken, body) {
        if(this._callSignature === callSignature && this._equalsGreaterThanToken === equalsGreaterThanToken && this._body === body) {
            return this;
        }
        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body);
    };
    return ParenthesizedArrowFunctionExpressionSyntax;
})(ArrowFunctionExpressionSyntax);
var TypeSyntax = (function (_super) {
    __extends(TypeSyntax, _super);
    function TypeSyntax() {
        _super.call(this);
    }
    return TypeSyntax;
})(UnaryExpressionSyntax);
var NameSyntax = (function (_super) {
    __extends(NameSyntax, _super);
    function NameSyntax() {
        _super.call(this);
    }
    return NameSyntax;
})(TypeSyntax);
var IdentifierNameSyntax = (function (_super) {
    __extends(IdentifierNameSyntax, _super);
    function IdentifierNameSyntax(identifier) {
        _super.call(this);
        this._identifier = identifier;
    }
    IdentifierNameSyntax.prototype.accept = function (visitor) {
        visitor.visitIdentifierName(this);
    };
    IdentifierNameSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitIdentifierName(this);
    };
    IdentifierNameSyntax.prototype.kind = function () {
        return 118 /* IdentifierName */ ;
    };
    IdentifierNameSyntax.prototype.isMissing = function () {
        if(!this._identifier.isMissing()) {
            return false;
        }
        return true;
    };
    IdentifierNameSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    IdentifierNameSyntax.prototype.update = function (identifier) {
        if(this._identifier === identifier) {
            return this;
        }
        return new IdentifierNameSyntax(identifier);
    };
    return IdentifierNameSyntax;
})(NameSyntax);
var QualifiedNameSyntax = (function (_super) {
    __extends(QualifiedNameSyntax, _super);
    function QualifiedNameSyntax(left, dotToken, right) {
        _super.call(this);
        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
    }
    QualifiedNameSyntax.prototype.accept = function (visitor) {
        visitor.visitQualifiedName(this);
    };
    QualifiedNameSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitQualifiedName(this);
    };
    QualifiedNameSyntax.prototype.kind = function () {
        return 119 /* QualifiedName */ ;
    };
    QualifiedNameSyntax.prototype.isMissing = function () {
        if(!this._left.isMissing()) {
            return false;
        }
        if(!this._dotToken.isMissing()) {
            return false;
        }
        if(!this._right.isMissing()) {
            return false;
        }
        return true;
    };
    QualifiedNameSyntax.prototype.left = function () {
        return this._left;
    };
    QualifiedNameSyntax.prototype.dotToken = function () {
        return this._dotToken;
    };
    QualifiedNameSyntax.prototype.right = function () {
        return this._right;
    };
    QualifiedNameSyntax.prototype.update = function (left, dotToken, right) {
        if(this._left === left && this._dotToken === dotToken && this._right === right) {
            return this;
        }
        return new QualifiedNameSyntax(left, dotToken, right);
    };
    return QualifiedNameSyntax;
})(NameSyntax);
var ConstructorTypeSyntax = (function (_super) {
    __extends(ConstructorTypeSyntax, _super);
    function ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type) {
        _super.call(this);
        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }
    ConstructorTypeSyntax.prototype.accept = function (visitor) {
        visitor.visitConstructorType(this);
    };
    ConstructorTypeSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitConstructorType(this);
    };
    ConstructorTypeSyntax.prototype.kind = function () {
        return 124 /* ConstructorType */ ;
    };
    ConstructorTypeSyntax.prototype.isMissing = function () {
        if(!this._newKeyword.isMissing()) {
            return false;
        }
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(!this._equalsGreaterThanToken.isMissing()) {
            return false;
        }
        if(!this._type.isMissing()) {
            return false;
        }
        return true;
    };
    ConstructorTypeSyntax.prototype.newKeyword = function () {
        return this._newKeyword;
    };
    ConstructorTypeSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    ConstructorTypeSyntax.prototype.equalsGreaterThanToken = function () {
        return this._equalsGreaterThanToken;
    };
    ConstructorTypeSyntax.prototype.type = function () {
        return this._type;
    };
    ConstructorTypeSyntax.prototype.update = function (newKeyword, parameterList, equalsGreaterThanToken, type) {
        if(this._newKeyword === newKeyword && this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }
        return new ConstructorTypeSyntax(newKeyword, parameterList, equalsGreaterThanToken, type);
    };
    return ConstructorTypeSyntax;
})(TypeSyntax);
var FunctionTypeSyntax = (function (_super) {
    __extends(FunctionTypeSyntax, _super);
    function FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type) {
        _super.call(this);
        this._parameterList = parameterList;
        this._equalsGreaterThanToken = equalsGreaterThanToken;
        this._type = type;
    }
    FunctionTypeSyntax.prototype.accept = function (visitor) {
        visitor.visitFunctionType(this);
    };
    FunctionTypeSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitFunctionType(this);
    };
    FunctionTypeSyntax.prototype.kind = function () {
        return 122 /* FunctionType */ ;
    };
    FunctionTypeSyntax.prototype.isMissing = function () {
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(!this._equalsGreaterThanToken.isMissing()) {
            return false;
        }
        if(!this._type.isMissing()) {
            return false;
        }
        return true;
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
    FunctionTypeSyntax.prototype.update = function (parameterList, equalsGreaterThanToken, type) {
        if(this._parameterList === parameterList && this._equalsGreaterThanToken === equalsGreaterThanToken && this._type === type) {
            return this;
        }
        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, type);
    };
    return FunctionTypeSyntax;
})(TypeSyntax);
var ObjectTypeSyntax = (function (_super) {
    __extends(ObjectTypeSyntax, _super);
    function ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken) {
        _super.call(this);
        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
    }
    ObjectTypeSyntax.prototype.accept = function (visitor) {
        visitor.visitObjectType(this);
    };
    ObjectTypeSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitObjectType(this);
    };
    ObjectTypeSyntax.prototype.kind = function () {
        return 120 /* ObjectType */ ;
    };
    ObjectTypeSyntax.prototype.isMissing = function () {
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._typeMembers.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
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
    ObjectTypeSyntax.prototype.update = function (openBraceToken, typeMembers, closeBraceToken) {
        if(this._openBraceToken === openBraceToken && this._typeMembers === typeMembers && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken);
    };
    return ObjectTypeSyntax;
})(TypeSyntax);
var ArrayTypeSyntax = (function (_super) {
    __extends(ArrayTypeSyntax, _super);
    function ArrayTypeSyntax(type, openBracketToken, closeBracketToken) {
        _super.call(this);
        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
    }
    ArrayTypeSyntax.prototype.accept = function (visitor) {
        visitor.visitArrayType(this);
    };
    ArrayTypeSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitArrayType(this);
    };
    ArrayTypeSyntax.prototype.kind = function () {
        return 123 /* ArrayType */ ;
    };
    ArrayTypeSyntax.prototype.isMissing = function () {
        if(!this._type.isMissing()) {
            return false;
        }
        if(!this._openBracketToken.isMissing()) {
            return false;
        }
        if(!this._closeBracketToken.isMissing()) {
            return false;
        }
        return true;
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
    ArrayTypeSyntax.prototype.update = function (type, openBracketToken, closeBracketToken) {
        if(this._type === type && this._openBracketToken === openBracketToken && this._closeBracketToken === closeBracketToken) {
            return this;
        }
        return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken);
    };
    return ArrayTypeSyntax;
})(TypeSyntax);
var PredefinedTypeSyntax = (function (_super) {
    __extends(PredefinedTypeSyntax, _super);
    function PredefinedTypeSyntax(keyword) {
        _super.call(this);
        this._keyword = keyword;
    }
    PredefinedTypeSyntax.prototype.accept = function (visitor) {
        visitor.visitPredefinedType(this);
    };
    PredefinedTypeSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitPredefinedType(this);
    };
    PredefinedTypeSyntax.prototype.kind = function () {
        return 121 /* PredefinedType */ ;
    };
    PredefinedTypeSyntax.prototype.isMissing = function () {
        if(!this._keyword.isMissing()) {
            return false;
        }
        return true;
    };
    PredefinedTypeSyntax.prototype.keyword = function () {
        return this._keyword;
    };
    PredefinedTypeSyntax.prototype.update = function (keyword) {
        if(this._keyword === keyword) {
            return this;
        }
        return new PredefinedTypeSyntax(keyword);
    };
    return PredefinedTypeSyntax;
})(TypeSyntax);
var TypeAnnotationSyntax = (function (_super) {
    __extends(TypeAnnotationSyntax, _super);
    function TypeAnnotationSyntax(colonToken, type) {
        _super.call(this);
        this._colonToken = colonToken;
        this._type = type;
    }
    TypeAnnotationSyntax.prototype.accept = function (visitor) {
        visitor.visitTypeAnnotation(this);
    };
    TypeAnnotationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitTypeAnnotation(this);
    };
    TypeAnnotationSyntax.prototype.kind = function () {
        return 239 /* TypeAnnotation */ ;
    };
    TypeAnnotationSyntax.prototype.isMissing = function () {
        if(!this._colonToken.isMissing()) {
            return false;
        }
        if(!this._type.isMissing()) {
            return false;
        }
        return true;
    };
    TypeAnnotationSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    TypeAnnotationSyntax.prototype.type = function () {
        return this._type;
    };
    TypeAnnotationSyntax.prototype.update = function (colonToken, type) {
        if(this._colonToken === colonToken && this._type === type) {
            return this;
        }
        return new TypeAnnotationSyntax(colonToken, type);
    };
    return TypeAnnotationSyntax;
})(SyntaxNode);
var BlockSyntax = (function (_super) {
    __extends(BlockSyntax, _super);
    function BlockSyntax(openBraceToken, statements, closeBraceToken) {
        _super.call(this);
        this._openBraceToken = openBraceToken;
        this._statements = statements;
        this._closeBraceToken = closeBraceToken;
    }
    BlockSyntax.prototype.accept = function (visitor) {
        visitor.visitBlock(this);
    };
    BlockSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitBlock(this);
    };
    BlockSyntax.prototype.kind = function () {
        return 136 /* Block */ ;
    };
    BlockSyntax.prototype.isMissing = function () {
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._statements.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
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
    BlockSyntax.prototype.update = function (openBraceToken, statements, closeBraceToken) {
        if(this._openBraceToken === openBraceToken && this._statements === statements && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new BlockSyntax(openBraceToken, statements, closeBraceToken);
    };
    return BlockSyntax;
})(StatementSyntax);
var ParameterSyntax = (function (_super) {
    __extends(ParameterSyntax, _super);
    function ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause) {
        _super.call(this);
        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }
    ParameterSyntax.prototype.accept = function (visitor) {
        visitor.visitParameter(this);
    };
    ParameterSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitParameter(this);
    };
    ParameterSyntax.prototype.kind = function () {
        return 238 /* Parameter */ ;
    };
    ParameterSyntax.prototype.isMissing = function () {
        if(this._dotDotDotToken !== null && !this._dotDotDotToken.isMissing()) {
            return false;
        }
        if(this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(this._questionToken !== null && !this._questionToken.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        if(this._equalsValueClause !== null && !this._equalsValueClause.isMissing()) {
            return false;
        }
        return true;
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
        return this._typeAnnotation;
    };
    ParameterSyntax.prototype.equalsValueClause = function () {
        return this._equalsValueClause;
    };
    ParameterSyntax.prototype.update = function (dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause) {
        if(this._dotDotDotToken === dotDotDotToken && this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._identifier === identifier && this._questionToken === questionToken && this._typeAnnotation === typeAnnotation && this._equalsValueClause === equalsValueClause) {
            return this;
        }
        return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause);
    };
    return ParameterSyntax;
})(SyntaxNode);
var MemberAccessExpressionSyntax = (function (_super) {
    __extends(MemberAccessExpressionSyntax, _super);
    function MemberAccessExpressionSyntax(expression, dotToken, identifierName) {
        _super.call(this);
        this._expression = expression;
        this._dotToken = dotToken;
        this._identifierName = identifierName;
    }
    MemberAccessExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitMemberAccessExpression(this);
    };
    MemberAccessExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitMemberAccessExpression(this);
    };
    MemberAccessExpressionSyntax.prototype.kind = function () {
        return 207 /* MemberAccessExpression */ ;
    };
    MemberAccessExpressionSyntax.prototype.isMissing = function () {
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._dotToken.isMissing()) {
            return false;
        }
        if(!this._identifierName.isMissing()) {
            return false;
        }
        return true;
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
    MemberAccessExpressionSyntax.prototype.update = function (expression, dotToken, identifierName) {
        if(this._expression === expression && this._dotToken === dotToken && this._identifierName === identifierName) {
            return this;
        }
        return new MemberAccessExpressionSyntax(expression, dotToken, identifierName);
    };
    return MemberAccessExpressionSyntax;
})(UnaryExpressionSyntax);
var PostfixUnaryExpressionSyntax = (function (_super) {
    __extends(PostfixUnaryExpressionSyntax, _super);
    function PostfixUnaryExpressionSyntax(kind, operand, operatorToken) {
        _super.call(this);
        this._kind = kind;
        this._operand = operand;
        this._operatorToken = operatorToken;
    }
    PostfixUnaryExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitPostfixUnaryExpression(this);
    };
    PostfixUnaryExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitPostfixUnaryExpression(this);
    };
    PostfixUnaryExpressionSyntax.prototype.isMissing = function () {
        if(!this._operand.isMissing()) {
            return false;
        }
        if(!this._operatorToken.isMissing()) {
            return false;
        }
        return true;
    };
    PostfixUnaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    PostfixUnaryExpressionSyntax.prototype.operand = function () {
        return this._operand;
    };
    PostfixUnaryExpressionSyntax.prototype.operatorToken = function () {
        return this._operatorToken;
    };
    PostfixUnaryExpressionSyntax.prototype.update = function (kind, operand, operatorToken) {
        if(this._kind === kind && this._operand === operand && this._operatorToken === operatorToken) {
            return this;
        }
        return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken);
    };
    return PostfixUnaryExpressionSyntax;
})(UnaryExpressionSyntax);
var ElementAccessExpressionSyntax = (function (_super) {
    __extends(ElementAccessExpressionSyntax, _super);
    function ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken) {
        _super.call(this);
        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
    }
    ElementAccessExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitElementAccessExpression(this);
    };
    ElementAccessExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitElementAccessExpression(this);
    };
    ElementAccessExpressionSyntax.prototype.kind = function () {
        return 217 /* ElementAccessExpression */ ;
    };
    ElementAccessExpressionSyntax.prototype.isMissing = function () {
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._openBracketToken.isMissing()) {
            return false;
        }
        if(!this._argumentExpression.isMissing()) {
            return false;
        }
        if(!this._closeBracketToken.isMissing()) {
            return false;
        }
        return true;
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
    ElementAccessExpressionSyntax.prototype.update = function (expression, openBracketToken, argumentExpression, closeBracketToken) {
        if(this._expression === expression && this._openBracketToken === openBracketToken && this._argumentExpression === argumentExpression && this._closeBracketToken === closeBracketToken) {
            return this;
        }
        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    };
    return ElementAccessExpressionSyntax;
})(UnaryExpressionSyntax);
var InvocationExpressionSyntax = (function (_super) {
    __extends(InvocationExpressionSyntax, _super);
    function InvocationExpressionSyntax(expression, argumentList) {
        _super.call(this);
        this._expression = expression;
        this._argumentList = argumentList;
    }
    InvocationExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitInvocationExpression(this);
    };
    InvocationExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitInvocationExpression(this);
    };
    InvocationExpressionSyntax.prototype.kind = function () {
        return 208 /* InvocationExpression */ ;
    };
    InvocationExpressionSyntax.prototype.isMissing = function () {
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._argumentList.isMissing()) {
            return false;
        }
        return true;
    };
    InvocationExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    InvocationExpressionSyntax.prototype.argumentList = function () {
        return this._argumentList;
    };
    InvocationExpressionSyntax.prototype.update = function (expression, argumentList) {
        if(this._expression === expression && this._argumentList === argumentList) {
            return this;
        }
        return new InvocationExpressionSyntax(expression, argumentList);
    };
    return InvocationExpressionSyntax;
})(UnaryExpressionSyntax);
var ArgumentListSyntax = (function (_super) {
    __extends(ArgumentListSyntax, _super);
    function ArgumentListSyntax(openParenToken, arguments, closeParenToken) {
        _super.call(this);
        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
    }
    ArgumentListSyntax.prototype.accept = function (visitor) {
        visitor.visitArgumentList(this);
    };
    ArgumentListSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitArgumentList(this);
    };
    ArgumentListSyntax.prototype.kind = function () {
        return 224 /* ArgumentList */ ;
    };
    ArgumentListSyntax.prototype.isMissing = function () {
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._arguments.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        return true;
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
    ArgumentListSyntax.prototype.update = function (openParenToken, _arguments, closeParenToken) {
        if(this._openParenToken === openParenToken && this._arguments === _arguments && this._closeParenToken === closeParenToken) {
            return this;
        }
        return new ArgumentListSyntax(openParenToken, _arguments, closeParenToken);
    };
    return ArgumentListSyntax;
})(SyntaxNode);
var BinaryExpressionSyntax = (function (_super) {
    __extends(BinaryExpressionSyntax, _super);
    function BinaryExpressionSyntax(kind, left, operatorToken, right) {
        _super.call(this);
        this._kind = kind;
        this._left = left;
        this._operatorToken = operatorToken;
        this._right = right;
    }
    BinaryExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitBinaryExpression(this);
    };
    BinaryExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitBinaryExpression(this);
    };
    BinaryExpressionSyntax.prototype.isMissing = function () {
        if(!this._left.isMissing()) {
            return false;
        }
        if(!this._operatorToken.isMissing()) {
            return false;
        }
        if(!this._right.isMissing()) {
            return false;
        }
        return true;
    };
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
    BinaryExpressionSyntax.prototype.update = function (kind, left, operatorToken, right) {
        if(this._kind === kind && this._left === left && this._operatorToken === operatorToken && this._right === right) {
            return this;
        }
        return new BinaryExpressionSyntax(kind, left, operatorToken, right);
    };
    return BinaryExpressionSyntax;
})(ExpressionSyntax);
var ConditionalExpressionSyntax = (function (_super) {
    __extends(ConditionalExpressionSyntax, _super);
    function ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse) {
        _super.call(this);
        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
    }
    ConditionalExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitConditionalExpression(this);
    };
    ConditionalExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitConditionalExpression(this);
    };
    ConditionalExpressionSyntax.prototype.kind = function () {
        return 181 /* ConditionalExpression */ ;
    };
    ConditionalExpressionSyntax.prototype.isMissing = function () {
        if(!this._condition.isMissing()) {
            return false;
        }
        if(!this._questionToken.isMissing()) {
            return false;
        }
        if(!this._whenTrue.isMissing()) {
            return false;
        }
        if(!this._colonToken.isMissing()) {
            return false;
        }
        if(!this._whenFalse.isMissing()) {
            return false;
        }
        return true;
    };
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
    ConditionalExpressionSyntax.prototype.update = function (condition, questionToken, whenTrue, colonToken, whenFalse) {
        if(this._condition === condition && this._questionToken === questionToken && this._whenTrue === whenTrue && this._colonToken === colonToken && this._whenFalse === whenFalse) {
            return this;
        }
        return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse);
    };
    return ConditionalExpressionSyntax;
})(ExpressionSyntax);
var TypeMemberSyntax = (function (_super) {
    __extends(TypeMemberSyntax, _super);
    function TypeMemberSyntax() {
        _super.call(this);
    }
    return TypeMemberSyntax;
})(SyntaxNode);
var ConstructSignatureSyntax = (function (_super) {
    __extends(ConstructSignatureSyntax, _super);
    function ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation) {
        _super.call(this);
        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }
    ConstructSignatureSyntax.prototype.accept = function (visitor) {
        visitor.visitConstructSignature(this);
    };
    ConstructSignatureSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitConstructSignature(this);
    };
    ConstructSignatureSyntax.prototype.kind = function () {
        return 235 /* ConstructSignature */ ;
    };
    ConstructSignatureSyntax.prototype.isMissing = function () {
        if(!this._newKeyword.isMissing()) {
            return false;
        }
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        return true;
    };
    ConstructSignatureSyntax.prototype.newKeyword = function () {
        return this._newKeyword;
    };
    ConstructSignatureSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    ConstructSignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    ConstructSignatureSyntax.prototype.update = function (newKeyword, parameterList, typeAnnotation) {
        if(this._newKeyword === newKeyword && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }
        return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
    };
    return ConstructSignatureSyntax;
})(TypeMemberSyntax);
var FunctionSignatureSyntax = (function (_super) {
    __extends(FunctionSignatureSyntax, _super);
    function FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation) {
        _super.call(this);
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }
    FunctionSignatureSyntax.prototype.accept = function (visitor) {
        visitor.visitFunctionSignature(this);
    };
    FunctionSignatureSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitFunctionSignature(this);
    };
    FunctionSignatureSyntax.prototype.kind = function () {
        return 237 /* FunctionSignature */ ;
    };
    FunctionSignatureSyntax.prototype.isMissing = function () {
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(this._questionToken !== null && !this._questionToken.isMissing()) {
            return false;
        }
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        return true;
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
    FunctionSignatureSyntax.prototype.update = function (identifier, questionToken, parameterList, typeAnnotation) {
        if(this._identifier === identifier && this._questionToken === questionToken && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }
        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
    };
    return FunctionSignatureSyntax;
})(TypeMemberSyntax);
var IndexSignatureSyntax = (function (_super) {
    __extends(IndexSignatureSyntax, _super);
    function IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation) {
        _super.call(this);
        this._openBracketToken = openBracketToken;
        this._parameter = parameter;
        this._closeBracketToken = closeBracketToken;
        this._typeAnnotation = typeAnnotation;
    }
    IndexSignatureSyntax.prototype.accept = function (visitor) {
        visitor.visitIndexSignature(this);
    };
    IndexSignatureSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitIndexSignature(this);
    };
    IndexSignatureSyntax.prototype.kind = function () {
        return 236 /* IndexSignature */ ;
    };
    IndexSignatureSyntax.prototype.isMissing = function () {
        if(!this._openBracketToken.isMissing()) {
            return false;
        }
        if(!this._parameter.isMissing()) {
            return false;
        }
        if(!this._closeBracketToken.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        return true;
    };
    IndexSignatureSyntax.prototype.openBracketToken = function () {
        return this._openBracketToken;
    };
    IndexSignatureSyntax.prototype.parameter = function () {
        return this._parameter;
    };
    IndexSignatureSyntax.prototype.closeBracketToken = function () {
        return this._closeBracketToken;
    };
    IndexSignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    IndexSignatureSyntax.prototype.update = function (openBracketToken, parameter, closeBracketToken, typeAnnotation) {
        if(this._openBracketToken === openBracketToken && this._parameter === parameter && this._closeBracketToken === closeBracketToken && this._typeAnnotation === typeAnnotation) {
            return this;
        }
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
    };
    return IndexSignatureSyntax;
})(TypeMemberSyntax);
var PropertySignatureSyntax = (function (_super) {
    __extends(PropertySignatureSyntax, _super);
    function PropertySignatureSyntax(identifier, questionToken, typeAnnotation) {
        _super.call(this);
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnnotation = typeAnnotation;
    }
    PropertySignatureSyntax.prototype.accept = function (visitor) {
        visitor.visitPropertySignature(this);
    };
    PropertySignatureSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitPropertySignature(this);
    };
    PropertySignatureSyntax.prototype.kind = function () {
        return 233 /* PropertySignature */ ;
    };
    PropertySignatureSyntax.prototype.isMissing = function () {
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(this._questionToken !== null && !this._questionToken.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        return true;
    };
    PropertySignatureSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    PropertySignatureSyntax.prototype.questionToken = function () {
        return this._questionToken;
    };
    PropertySignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    PropertySignatureSyntax.prototype.update = function (identifier, questionToken, typeAnnotation) {
        if(this._identifier === identifier && this._questionToken === questionToken && this._typeAnnotation === typeAnnotation) {
            return this;
        }
        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    };
    return PropertySignatureSyntax;
})(TypeMemberSyntax);
var ParameterListSyntax = (function (_super) {
    __extends(ParameterListSyntax, _super);
    function ParameterListSyntax(openParenToken, parameters, closeParenToken) {
        _super.call(this);
        this._openParenToken = openParenToken;
        this._parameters = parameters;
        this._closeParenToken = closeParenToken;
    }
    ParameterListSyntax.prototype.accept = function (visitor) {
        visitor.visitParameterList(this);
    };
    ParameterListSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitParameterList(this);
    };
    ParameterListSyntax.prototype.kind = function () {
        return 223 /* ParameterList */ ;
    };
    ParameterListSyntax.prototype.isMissing = function () {
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._parameters.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        return true;
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
    ParameterListSyntax.prototype.update = function (openParenToken, parameters, closeParenToken) {
        if(this._openParenToken === openParenToken && this._parameters === parameters && this._closeParenToken === closeParenToken) {
            return this;
        }
        return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
    };
    return ParameterListSyntax;
})(SyntaxNode);
var CallSignatureSyntax = (function (_super) {
    __extends(CallSignatureSyntax, _super);
    function CallSignatureSyntax(parameterList, typeAnnotation) {
        _super.call(this);
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
    }
    CallSignatureSyntax.prototype.accept = function (visitor) {
        visitor.visitCallSignature(this);
    };
    CallSignatureSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitCallSignature(this);
    };
    CallSignatureSyntax.prototype.kind = function () {
        return 234 /* CallSignature */ ;
    };
    CallSignatureSyntax.prototype.isMissing = function () {
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        return true;
    };
    CallSignatureSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    CallSignatureSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    CallSignatureSyntax.prototype.update = function (parameterList, typeAnnotation) {
        if(this._parameterList === parameterList && this._typeAnnotation === typeAnnotation) {
            return this;
        }
        return new CallSignatureSyntax(parameterList, typeAnnotation);
    };
    return CallSignatureSyntax;
})(TypeMemberSyntax);
var ElseClauseSyntax = (function (_super) {
    __extends(ElseClauseSyntax, _super);
    function ElseClauseSyntax(elseKeyword, statement) {
        _super.call(this);
        this._elseKeyword = elseKeyword;
        this._statement = statement;
    }
    ElseClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitElseClause(this);
    };
    ElseClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitElseClause(this);
    };
    ElseClauseSyntax.prototype.kind = function () {
        return 230 /* ElseClause */ ;
    };
    ElseClauseSyntax.prototype.isMissing = function () {
        if(!this._elseKeyword.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        return true;
    };
    ElseClauseSyntax.prototype.elseKeyword = function () {
        return this._elseKeyword;
    };
    ElseClauseSyntax.prototype.statement = function () {
        return this._statement;
    };
    ElseClauseSyntax.prototype.update = function (elseKeyword, statement) {
        if(this._elseKeyword === elseKeyword && this._statement === statement) {
            return this;
        }
        return new ElseClauseSyntax(elseKeyword, statement);
    };
    return ElseClauseSyntax;
})(SyntaxNode);
var IfStatementSyntax = (function (_super) {
    __extends(IfStatementSyntax, _super);
    function IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause) {
        _super.call(this);
        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
    }
    IfStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitIfStatement(this);
    };
    IfStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitIfStatement(this);
    };
    IfStatementSyntax.prototype.kind = function () {
        return 137 /* IfStatement */ ;
    };
    IfStatementSyntax.prototype.isMissing = function () {
        if(!this._ifKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._condition.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        if(this._elseClause !== null && !this._elseClause.isMissing()) {
            return false;
        }
        return true;
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
    IfStatementSyntax.prototype.update = function (ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause) {
        if(this._ifKeyword === ifKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement && this._elseClause === elseClause) {
            return this;
        }
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
    };
    return IfStatementSyntax;
})(StatementSyntax);
var ExpressionStatementSyntax = (function (_super) {
    __extends(ExpressionStatementSyntax, _super);
    function ExpressionStatementSyntax(expression, semicolonToken) {
        _super.call(this);
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }
    ExpressionStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitExpressionStatement(this);
    };
    ExpressionStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitExpressionStatement(this);
    };
    ExpressionStatementSyntax.prototype.kind = function () {
        return 139 /* ExpressionStatement */ ;
    };
    ExpressionStatementSyntax.prototype.isMissing = function () {
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    ExpressionStatementSyntax.prototype.expression = function () {
        return this._expression;
    };
    ExpressionStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    ExpressionStatementSyntax.prototype.update = function (expression, semicolonToken) {
        if(this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new ExpressionStatementSyntax(expression, semicolonToken);
    };
    return ExpressionStatementSyntax;
})(StatementSyntax);
var ClassElementSyntax = (function (_super) {
    __extends(ClassElementSyntax, _super);
    function ClassElementSyntax() {
        _super.call(this);
    }
    return ClassElementSyntax;
})(SyntaxNode);
var ConstructorDeclarationSyntax = (function (_super) {
    __extends(ConstructorDeclarationSyntax, _super);
    function ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken) {
        _super.call(this);
        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    ConstructorDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitConstructorDeclaration(this);
    };
    ConstructorDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitConstructorDeclaration(this);
    };
    ConstructorDeclarationSyntax.prototype.kind = function () {
        return 133 /* ConstructorDeclaration */ ;
    };
    ConstructorDeclarationSyntax.prototype.isMissing = function () {
        if(!this._constructorKeyword.isMissing()) {
            return false;
        }
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(this._block !== null && !this._block.isMissing()) {
            return false;
        }
        if(this._semicolonToken !== null && !this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
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
    ConstructorDeclarationSyntax.prototype.update = function (constructorKeyword, parameterList, block, semicolonToken) {
        if(this._constructorKeyword === constructorKeyword && this._parameterList === parameterList && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken);
    };
    return ConstructorDeclarationSyntax;
})(ClassElementSyntax);
var MemberDeclarationSyntax = (function (_super) {
    __extends(MemberDeclarationSyntax, _super);
    function MemberDeclarationSyntax() {
        _super.call(this);
    }
    return MemberDeclarationSyntax;
})(ClassElementSyntax);
var MemberFunctionDeclarationSyntax = (function (_super) {
    __extends(MemberFunctionDeclarationSyntax, _super);
    function MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken) {
        _super.call(this);
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    MemberFunctionDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitMemberFunctionDeclaration(this);
    };
    MemberFunctionDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitMemberFunctionDeclaration(this);
    };
    MemberFunctionDeclarationSyntax.prototype.kind = function () {
        return 131 /* MemberFunctionDeclaration */ ;
    };
    MemberFunctionDeclarationSyntax.prototype.isMissing = function () {
        if(this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) {
            return false;
        }
        if(this._staticKeyword !== null && !this._staticKeyword.isMissing()) {
            return false;
        }
        if(!this._functionSignature.isMissing()) {
            return false;
        }
        if(this._block !== null && !this._block.isMissing()) {
            return false;
        }
        if(this._semicolonToken !== null && !this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    MemberFunctionDeclarationSyntax.prototype.publicOrPrivateKeyword = function () {
        return this._publicOrPrivateKeyword;
    };
    MemberFunctionDeclarationSyntax.prototype.staticKeyword = function () {
        return this._staticKeyword;
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
    MemberFunctionDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken) {
        if(this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._functionSignature === functionSignature && this._block === block && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken);
    };
    return MemberFunctionDeclarationSyntax;
})(MemberDeclarationSyntax);
var MemberAccessorDeclarationSyntax = (function (_super) {
    __extends(MemberAccessorDeclarationSyntax, _super);
    function MemberAccessorDeclarationSyntax() {
        _super.call(this);
    }
    return MemberAccessorDeclarationSyntax;
})(MemberDeclarationSyntax);
var GetMemberAccessorDeclarationSyntax = (function (_super) {
    __extends(GetMemberAccessorDeclarationSyntax, _super);
    function GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block) {
        _super.call(this);
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._getKeyword = getKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._typeAnnotation = typeAnnotation;
        this._block = block;
    }
    GetMemberAccessorDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitGetMemberAccessorDeclaration(this);
    };
    GetMemberAccessorDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitGetMemberAccessorDeclaration(this);
    };
    GetMemberAccessorDeclarationSyntax.prototype.kind = function () {
        return 134 /* GetMemberAccessorDeclaration */ ;
    };
    GetMemberAccessorDeclarationSyntax.prototype.isMissing = function () {
        if(this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) {
            return false;
        }
        if(this._staticKeyword !== null && !this._staticKeyword.isMissing()) {
            return false;
        }
        if(!this._getKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(this._typeAnnotation !== null && !this._typeAnnotation.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    GetMemberAccessorDeclarationSyntax.prototype.publicOrPrivateKeyword = function () {
        return this._publicOrPrivateKeyword;
    };
    GetMemberAccessorDeclarationSyntax.prototype.staticKeyword = function () {
        return this._staticKeyword;
    };
    GetMemberAccessorDeclarationSyntax.prototype.getKeyword = function () {
        return this._getKeyword;
    };
    GetMemberAccessorDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    GetMemberAccessorDeclarationSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    GetMemberAccessorDeclarationSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    GetMemberAccessorDeclarationSyntax.prototype.block = function () {
        return this._block;
    };
    GetMemberAccessorDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block) {
        if(this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._getKeyword === getKeyword && this._identifier === identifier && this._parameterList === parameterList && this._typeAnnotation === typeAnnotation && this._block === block) {
            return this;
        }
        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
    };
    return GetMemberAccessorDeclarationSyntax;
})(MemberAccessorDeclarationSyntax);
var SetMemberAccessorDeclarationSyntax = (function (_super) {
    __extends(SetMemberAccessorDeclarationSyntax, _super);
    function SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block) {
        _super.call(this);
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._setKeyword = setKeyword;
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._block = block;
    }
    SetMemberAccessorDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitSetMemberAccessorDeclaration(this);
    };
    SetMemberAccessorDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitSetMemberAccessorDeclaration(this);
    };
    SetMemberAccessorDeclarationSyntax.prototype.kind = function () {
        return 135 /* SetMemberAccessorDeclaration */ ;
    };
    SetMemberAccessorDeclarationSyntax.prototype.isMissing = function () {
        if(this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) {
            return false;
        }
        if(this._staticKeyword !== null && !this._staticKeyword.isMissing()) {
            return false;
        }
        if(!this._setKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._parameterList.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    SetMemberAccessorDeclarationSyntax.prototype.publicOrPrivateKeyword = function () {
        return this._publicOrPrivateKeyword;
    };
    SetMemberAccessorDeclarationSyntax.prototype.staticKeyword = function () {
        return this._staticKeyword;
    };
    SetMemberAccessorDeclarationSyntax.prototype.setKeyword = function () {
        return this._setKeyword;
    };
    SetMemberAccessorDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    SetMemberAccessorDeclarationSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    SetMemberAccessorDeclarationSyntax.prototype.block = function () {
        return this._block;
    };
    SetMemberAccessorDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block) {
        if(this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._setKeyword === setKeyword && this._identifier === identifier && this._parameterList === parameterList && this._block === block) {
            return this;
        }
        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
    };
    return SetMemberAccessorDeclarationSyntax;
})(MemberAccessorDeclarationSyntax);
var MemberVariableDeclarationSyntax = (function (_super) {
    __extends(MemberVariableDeclarationSyntax, _super);
    function MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
        _super.call(this);
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._staticKeyword = staticKeyword;
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }
    MemberVariableDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitMemberVariableDeclaration(this);
    };
    MemberVariableDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitMemberVariableDeclaration(this);
    };
    MemberVariableDeclarationSyntax.prototype.kind = function () {
        return 132 /* MemberVariableDeclaration */ ;
    };
    MemberVariableDeclarationSyntax.prototype.isMissing = function () {
        if(this._publicOrPrivateKeyword !== null && !this._publicOrPrivateKeyword.isMissing()) {
            return false;
        }
        if(this._staticKeyword !== null && !this._staticKeyword.isMissing()) {
            return false;
        }
        if(!this._variableDeclarator.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    MemberVariableDeclarationSyntax.prototype.publicOrPrivateKeyword = function () {
        return this._publicOrPrivateKeyword;
    };
    MemberVariableDeclarationSyntax.prototype.staticKeyword = function () {
        return this._staticKeyword;
    };
    MemberVariableDeclarationSyntax.prototype.variableDeclarator = function () {
        return this._variableDeclarator;
    };
    MemberVariableDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    MemberVariableDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
        if(this._publicOrPrivateKeyword === publicOrPrivateKeyword && this._staticKeyword === staticKeyword && this._variableDeclarator === variableDeclarator && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken);
    };
    return MemberVariableDeclarationSyntax;
})(MemberDeclarationSyntax);
var ThrowStatementSyntax = (function (_super) {
    __extends(ThrowStatementSyntax, _super);
    function ThrowStatementSyntax(throwKeyword, expression, semicolonToken) {
        _super.call(this);
        this._throwKeyword = throwKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }
    ThrowStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitThrowStatement(this);
    };
    ThrowStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitThrowStatement(this);
    };
    ThrowStatementSyntax.prototype.kind = function () {
        return 147 /* ThrowStatement */ ;
    };
    ThrowStatementSyntax.prototype.isMissing = function () {
        if(!this._throwKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    ThrowStatementSyntax.prototype.throwKeyword = function () {
        return this._throwKeyword;
    };
    ThrowStatementSyntax.prototype.expression = function () {
        return this._expression;
    };
    ThrowStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    ThrowStatementSyntax.prototype.update = function (throwKeyword, expression, semicolonToken) {
        if(this._throwKeyword === throwKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
    };
    return ThrowStatementSyntax;
})(StatementSyntax);
var ReturnStatementSyntax = (function (_super) {
    __extends(ReturnStatementSyntax, _super);
    function ReturnStatementSyntax(returnKeyword, expression, semicolonToken) {
        _super.call(this);
        this._returnKeyword = returnKeyword;
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }
    ReturnStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitReturnStatement(this);
    };
    ReturnStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitReturnStatement(this);
    };
    ReturnStatementSyntax.prototype.kind = function () {
        return 140 /* ReturnStatement */ ;
    };
    ReturnStatementSyntax.prototype.isMissing = function () {
        if(!this._returnKeyword.isMissing()) {
            return false;
        }
        if(this._expression !== null && !this._expression.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
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
    ReturnStatementSyntax.prototype.update = function (returnKeyword, expression, semicolonToken) {
        if(this._returnKeyword === returnKeyword && this._expression === expression && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
    };
    return ReturnStatementSyntax;
})(StatementSyntax);
var ObjectCreationExpressionSyntax = (function (_super) {
    __extends(ObjectCreationExpressionSyntax, _super);
    function ObjectCreationExpressionSyntax(newKeyword, expression, argumentList) {
        _super.call(this);
        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
    }
    ObjectCreationExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitObjectCreationExpression(this);
    };
    ObjectCreationExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitObjectCreationExpression(this);
    };
    ObjectCreationExpressionSyntax.prototype.kind = function () {
        return 212 /* ObjectCreationExpression */ ;
    };
    ObjectCreationExpressionSyntax.prototype.isMissing = function () {
        if(!this._newKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        if(this._argumentList !== null && !this._argumentList.isMissing()) {
            return false;
        }
        return true;
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
    ObjectCreationExpressionSyntax.prototype.update = function (newKeyword, expression, argumentList) {
        if(this._newKeyword === newKeyword && this._expression === expression && this._argumentList === argumentList) {
            return this;
        }
        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    };
    return ObjectCreationExpressionSyntax;
})(UnaryExpressionSyntax);
var SwitchStatementSyntax = (function (_super) {
    __extends(SwitchStatementSyntax, _super);
    function SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, caseClauses, closeBraceToken) {
        _super.call(this);
        this._switchKeyword = switchKeyword;
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._openBraceToken = openBraceToken;
        this._caseClauses = caseClauses;
        this._closeBraceToken = closeBraceToken;
    }
    SwitchStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitSwitchStatement(this);
    };
    SwitchStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitSwitchStatement(this);
    };
    SwitchStatementSyntax.prototype.kind = function () {
        return 141 /* SwitchStatement */ ;
    };
    SwitchStatementSyntax.prototype.isMissing = function () {
        if(!this._switchKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._caseClauses.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
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
    SwitchStatementSyntax.prototype.update = function (switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, caseClauses, closeBraceToken) {
        if(this._switchKeyword === switchKeyword && this._openParenToken === openParenToken && this._expression === expression && this._closeParenToken === closeParenToken && this._openBraceToken === openBraceToken && this._caseClauses === caseClauses && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, caseClauses, closeBraceToken);
    };
    return SwitchStatementSyntax;
})(StatementSyntax);
var SwitchClauseSyntax = (function (_super) {
    __extends(SwitchClauseSyntax, _super);
    function SwitchClauseSyntax() {
        _super.call(this);
    }
    return SwitchClauseSyntax;
})(SyntaxNode);
var CaseSwitchClauseSyntax = (function (_super) {
    __extends(CaseSwitchClauseSyntax, _super);
    function CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements) {
        _super.call(this);
        this._caseKeyword = caseKeyword;
        this._expression = expression;
        this._colonToken = colonToken;
        this._statements = statements;
    }
    CaseSwitchClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitCaseSwitchClause(this);
    };
    CaseSwitchClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitCaseSwitchClause(this);
    };
    CaseSwitchClauseSyntax.prototype.kind = function () {
        return 228 /* CaseSwitchClause */ ;
    };
    CaseSwitchClauseSyntax.prototype.isMissing = function () {
        if(!this._caseKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._colonToken.isMissing()) {
            return false;
        }
        if(!this._statements.isMissing()) {
            return false;
        }
        return true;
    };
    CaseSwitchClauseSyntax.prototype.caseKeyword = function () {
        return this._caseKeyword;
    };
    CaseSwitchClauseSyntax.prototype.expression = function () {
        return this._expression;
    };
    CaseSwitchClauseSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    CaseSwitchClauseSyntax.prototype.statements = function () {
        return this._statements;
    };
    CaseSwitchClauseSyntax.prototype.update = function (caseKeyword, expression, colonToken, statements) {
        if(this._caseKeyword === caseKeyword && this._expression === expression && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    };
    return CaseSwitchClauseSyntax;
})(SwitchClauseSyntax);
var DefaultSwitchClauseSyntax = (function (_super) {
    __extends(DefaultSwitchClauseSyntax, _super);
    function DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements) {
        _super.call(this);
        this._defaultKeyword = defaultKeyword;
        this._colonToken = colonToken;
        this._statements = statements;
    }
    DefaultSwitchClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitDefaultSwitchClause(this);
    };
    DefaultSwitchClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitDefaultSwitchClause(this);
    };
    DefaultSwitchClauseSyntax.prototype.kind = function () {
        return 229 /* DefaultSwitchClause */ ;
    };
    DefaultSwitchClauseSyntax.prototype.isMissing = function () {
        if(!this._defaultKeyword.isMissing()) {
            return false;
        }
        if(!this._colonToken.isMissing()) {
            return false;
        }
        if(!this._statements.isMissing()) {
            return false;
        }
        return true;
    };
    DefaultSwitchClauseSyntax.prototype.defaultKeyword = function () {
        return this._defaultKeyword;
    };
    DefaultSwitchClauseSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    DefaultSwitchClauseSyntax.prototype.statements = function () {
        return this._statements;
    };
    DefaultSwitchClauseSyntax.prototype.update = function (defaultKeyword, colonToken, statements) {
        if(this._defaultKeyword === defaultKeyword && this._colonToken === colonToken && this._statements === statements) {
            return this;
        }
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
    };
    return DefaultSwitchClauseSyntax;
})(SwitchClauseSyntax);
var BreakStatementSyntax = (function (_super) {
    __extends(BreakStatementSyntax, _super);
    function BreakStatementSyntax(breakKeyword, identifier, semicolonToken) {
        _super.call(this);
        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }
    BreakStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitBreakStatement(this);
    };
    BreakStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitBreakStatement(this);
    };
    BreakStatementSyntax.prototype.kind = function () {
        return 142 /* BreakStatement */ ;
    };
    BreakStatementSyntax.prototype.isMissing = function () {
        if(!this._breakKeyword.isMissing()) {
            return false;
        }
        if(this._identifier !== null && !this._identifier.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
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
    BreakStatementSyntax.prototype.update = function (breakKeyword, identifier, semicolonToken) {
        if(this._breakKeyword === breakKeyword && this._identifier === identifier && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken);
    };
    return BreakStatementSyntax;
})(StatementSyntax);
var ContinueStatementSyntax = (function (_super) {
    __extends(ContinueStatementSyntax, _super);
    function ContinueStatementSyntax(continueKeyword, identifier, semicolonToken) {
        _super.call(this);
        this._continueKeyword = continueKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }
    ContinueStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitContinueStatement(this);
    };
    ContinueStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitContinueStatement(this);
    };
    ContinueStatementSyntax.prototype.kind = function () {
        return 143 /* ContinueStatement */ ;
    };
    ContinueStatementSyntax.prototype.isMissing = function () {
        if(!this._continueKeyword.isMissing()) {
            return false;
        }
        if(this._identifier !== null && !this._identifier.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    ContinueStatementSyntax.prototype.continueKeyword = function () {
        return this._continueKeyword;
    };
    ContinueStatementSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    ContinueStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    ContinueStatementSyntax.prototype.update = function (continueKeyword, identifier, semicolonToken) {
        if(this._continueKeyword === continueKeyword && this._identifier === identifier && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken);
    };
    return ContinueStatementSyntax;
})(StatementSyntax);
var IterationStatementSyntax = (function (_super) {
    __extends(IterationStatementSyntax, _super);
    function IterationStatementSyntax() {
        _super.call(this);
    }
    return IterationStatementSyntax;
})(StatementSyntax);
var BaseForStatementSyntax = (function (_super) {
    __extends(BaseForStatementSyntax, _super);
    function BaseForStatementSyntax() {
        _super.call(this);
    }
    return BaseForStatementSyntax;
})(IterationStatementSyntax);
var ForStatementSyntax = (function (_super) {
    __extends(ForStatementSyntax, _super);
    function ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
        _super.call(this);
        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._initializer = initializer;
        this._firstSemicolonToken = firstSemicolonToken;
        this._condition = condition;
        this._secondSemicolonToken = secondSemicolonToken;
        this._incrementor = incrementor;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }
    ForStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitForStatement(this);
    };
    ForStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitForStatement(this);
    };
    ForStatementSyntax.prototype.kind = function () {
        return 144 /* ForStatement */ ;
    };
    ForStatementSyntax.prototype.isMissing = function () {
        if(!this._forKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(this._variableDeclaration !== null && !this._variableDeclaration.isMissing()) {
            return false;
        }
        if(this._initializer !== null && !this._initializer.isMissing()) {
            return false;
        }
        if(!this._firstSemicolonToken.isMissing()) {
            return false;
        }
        if(this._condition !== null && !this._condition.isMissing()) {
            return false;
        }
        if(!this._secondSemicolonToken.isMissing()) {
            return false;
        }
        if(this._incrementor !== null && !this._incrementor.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        return true;
    };
    ForStatementSyntax.prototype.forKeyword = function () {
        return this._forKeyword;
    };
    ForStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    ForStatementSyntax.prototype.variableDeclaration = function () {
        return this._variableDeclaration;
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
    ForStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    ForStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    ForStatementSyntax.prototype.update = function (forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
        if(this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._initializer === initializer && this._firstSemicolonToken === firstSemicolonToken && this._condition === condition && this._secondSemicolonToken === secondSemicolonToken && this._incrementor === incrementor && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }
        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
    };
    return ForStatementSyntax;
})(BaseForStatementSyntax);
var ForInStatementSyntax = (function (_super) {
    __extends(ForInStatementSyntax, _super);
    function ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement) {
        _super.call(this);
        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._left = left;
        this._inKeyword = inKeyword;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }
    ForInStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitForInStatement(this);
    };
    ForInStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitForInStatement(this);
    };
    ForInStatementSyntax.prototype.kind = function () {
        return 145 /* ForInStatement */ ;
    };
    ForInStatementSyntax.prototype.isMissing = function () {
        if(!this._forKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(this._variableDeclaration !== null && !this._variableDeclaration.isMissing()) {
            return false;
        }
        if(this._left !== null && !this._left.isMissing()) {
            return false;
        }
        if(!this._inKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        return true;
    };
    ForInStatementSyntax.prototype.forKeyword = function () {
        return this._forKeyword;
    };
    ForInStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    ForInStatementSyntax.prototype.variableDeclaration = function () {
        return this._variableDeclaration;
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
    ForInStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    ForInStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    ForInStatementSyntax.prototype.update = function (forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement) {
        if(this._forKeyword === forKeyword && this._openParenToken === openParenToken && this._variableDeclaration === variableDeclaration && this._left === left && this._inKeyword === inKeyword && this._expression === expression && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }
        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement);
    };
    return ForInStatementSyntax;
})(BaseForStatementSyntax);
var WhileStatementSyntax = (function (_super) {
    __extends(WhileStatementSyntax, _super);
    function WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement) {
        _super.call(this);
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }
    WhileStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitWhileStatement(this);
    };
    WhileStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitWhileStatement(this);
    };
    WhileStatementSyntax.prototype.kind = function () {
        return 148 /* WhileStatement */ ;
    };
    WhileStatementSyntax.prototype.isMissing = function () {
        if(!this._whileKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._condition.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        return true;
    };
    WhileStatementSyntax.prototype.whileKeyword = function () {
        return this._whileKeyword;
    };
    WhileStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    WhileStatementSyntax.prototype.condition = function () {
        return this._condition;
    };
    WhileStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    WhileStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    WhileStatementSyntax.prototype.update = function (whileKeyword, openParenToken, condition, closeParenToken, statement) {
        if(this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }
        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
    };
    return WhileStatementSyntax;
})(IterationStatementSyntax);
var WithStatementSyntax = (function (_super) {
    __extends(WithStatementSyntax, _super);
    function WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement) {
        _super.call(this);
        this._withKeyword = withKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
    }
    WithStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitWithStatement(this);
    };
    WithStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitWithStatement(this);
    };
    WithStatementSyntax.prototype.kind = function () {
        return 153 /* WithStatement */ ;
    };
    WithStatementSyntax.prototype.isMissing = function () {
        if(!this._withKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._condition.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        return true;
    };
    WithStatementSyntax.prototype.withKeyword = function () {
        return this._withKeyword;
    };
    WithStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    WithStatementSyntax.prototype.condition = function () {
        return this._condition;
    };
    WithStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    WithStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    WithStatementSyntax.prototype.update = function (withKeyword, openParenToken, condition, closeParenToken, statement) {
        if(this._withKeyword === withKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._statement === statement) {
            return this;
        }
        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement);
    };
    return WithStatementSyntax;
})(StatementSyntax);
var EnumDeclarationSyntax = (function (_super) {
    __extends(EnumDeclarationSyntax, _super);
    function EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._enumKeyword = enumKeyword;
        this._identifier = identifier;
        this._openBraceToken = openBraceToken;
        this._variableDeclarators = variableDeclarators;
        this._closeBraceToken = closeBraceToken;
    }
    EnumDeclarationSyntax.prototype.accept = function (visitor) {
        visitor.visitEnumDeclaration(this);
    };
    EnumDeclarationSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitEnumDeclaration(this);
    };
    EnumDeclarationSyntax.prototype.kind = function () {
        return 129 /* EnumDeclaration */ ;
    };
    EnumDeclarationSyntax.prototype.isMissing = function () {
        if(this._exportKeyword !== null && !this._exportKeyword.isMissing()) {
            return false;
        }
        if(!this._enumKeyword.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._variableDeclarators.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
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
    EnumDeclarationSyntax.prototype.update = function (exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken) {
        if(this._exportKeyword === exportKeyword && this._enumKeyword === enumKeyword && this._identifier === identifier && this._openBraceToken === openBraceToken && this._variableDeclarators === variableDeclarators && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken);
    };
    return EnumDeclarationSyntax;
})(ModuleElementSyntax);
var CastExpressionSyntax = (function (_super) {
    __extends(CastExpressionSyntax, _super);
    function CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression) {
        _super.call(this);
        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
    }
    CastExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitCastExpression(this);
    };
    CastExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitCastExpression(this);
    };
    CastExpressionSyntax.prototype.kind = function () {
        return 216 /* CastExpression */ ;
    };
    CastExpressionSyntax.prototype.isMissing = function () {
        if(!this._lessThanToken.isMissing()) {
            return false;
        }
        if(!this._type.isMissing()) {
            return false;
        }
        if(!this._greaterThanToken.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        return true;
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
    CastExpressionSyntax.prototype.update = function (lessThanToken, type, greaterThanToken, expression) {
        if(this._lessThanToken === lessThanToken && this._type === type && this._greaterThanToken === greaterThanToken && this._expression === expression) {
            return this;
        }
        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    };
    return CastExpressionSyntax;
})(UnaryExpressionSyntax);
var ObjectLiteralExpressionSyntax = (function (_super) {
    __extends(ObjectLiteralExpressionSyntax, _super);
    function ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken) {
        _super.call(this);
        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
    }
    ObjectLiteralExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitObjectLiteralExpression(this);
    };
    ObjectLiteralExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitObjectLiteralExpression(this);
    };
    ObjectLiteralExpressionSyntax.prototype.kind = function () {
        return 211 /* ObjectLiteralExpression */ ;
    };
    ObjectLiteralExpressionSyntax.prototype.isMissing = function () {
        if(!this._openBraceToken.isMissing()) {
            return false;
        }
        if(!this._propertyAssignments.isMissing()) {
            return false;
        }
        if(!this._closeBraceToken.isMissing()) {
            return false;
        }
        return true;
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
    ObjectLiteralExpressionSyntax.prototype.update = function (openBraceToken, propertyAssignments, closeBraceToken) {
        if(this._openBraceToken === openBraceToken && this._propertyAssignments === propertyAssignments && this._closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken);
    };
    return ObjectLiteralExpressionSyntax;
})(UnaryExpressionSyntax);
var PropertyAssignmentSyntax = (function (_super) {
    __extends(PropertyAssignmentSyntax, _super);
    function PropertyAssignmentSyntax() {
        _super.call(this);
    }
    return PropertyAssignmentSyntax;
})(SyntaxNode);
var SimplePropertyAssignmentSyntax = (function (_super) {
    __extends(SimplePropertyAssignmentSyntax, _super);
    function SimplePropertyAssignmentSyntax(propertyName, colonToken, expression) {
        _super.call(this);
        this._propertyName = propertyName;
        this._colonToken = colonToken;
        this._expression = expression;
    }
    SimplePropertyAssignmentSyntax.prototype.accept = function (visitor) {
        visitor.visitSimplePropertyAssignment(this);
    };
    SimplePropertyAssignmentSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitSimplePropertyAssignment(this);
    };
    SimplePropertyAssignmentSyntax.prototype.kind = function () {
        return 240 /* SimplePropertyAssignment */ ;
    };
    SimplePropertyAssignmentSyntax.prototype.isMissing = function () {
        if(!this._propertyName.isMissing()) {
            return false;
        }
        if(!this._colonToken.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        return true;
    };
    SimplePropertyAssignmentSyntax.prototype.propertyName = function () {
        return this._propertyName;
    };
    SimplePropertyAssignmentSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    SimplePropertyAssignmentSyntax.prototype.expression = function () {
        return this._expression;
    };
    SimplePropertyAssignmentSyntax.prototype.update = function (propertyName, colonToken, expression) {
        if(this._propertyName === propertyName && this._colonToken === colonToken && this._expression === expression) {
            return this;
        }
        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    };
    return SimplePropertyAssignmentSyntax;
})(PropertyAssignmentSyntax);
var AccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(AccessorPropertyAssignmentSyntax, _super);
    function AccessorPropertyAssignmentSyntax() {
        _super.call(this);
    }
    return AccessorPropertyAssignmentSyntax;
})(PropertyAssignmentSyntax);
var GetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(GetAccessorPropertyAssignmentSyntax, _super);
    function GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block) {
        _super.call(this);
        this._getKeyword = getKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }
    GetAccessorPropertyAssignmentSyntax.prototype.accept = function (visitor) {
        visitor.visitGetAccessorPropertyAssignment(this);
    };
    GetAccessorPropertyAssignmentSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitGetAccessorPropertyAssignment(this);
    };
    GetAccessorPropertyAssignmentSyntax.prototype.kind = function () {
        return 243 /* GetAccessorPropertyAssignment */ ;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.isMissing = function () {
        if(!this._getKeyword.isMissing()) {
            return false;
        }
        if(!this._propertyName.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.getKeyword = function () {
        return this._getKeyword;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.propertyName = function () {
        return this._propertyName;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.block = function () {
        return this._block;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.update = function (getKeyword, propertyName, openParenToken, closeParenToken, block) {
        if(this._getKeyword === getKeyword && this._propertyName === propertyName && this._openParenToken === openParenToken && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }
        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
    };
    return GetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var SetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(SetAccessorPropertyAssignmentSyntax, _super);
    function SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
        _super.call(this);
        this._setKeyword = setKeyword;
        this._propertyName = propertyName;
        this._openParenToken = openParenToken;
        this._parameterName = parameterName;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }
    SetAccessorPropertyAssignmentSyntax.prototype.accept = function (visitor) {
        visitor.visitSetAccessorPropertyAssignment(this);
    };
    SetAccessorPropertyAssignmentSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitSetAccessorPropertyAssignment(this);
    };
    SetAccessorPropertyAssignmentSyntax.prototype.kind = function () {
        return 244 /* SetAccessorPropertyAssignment */ ;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.isMissing = function () {
        if(!this._setKeyword.isMissing()) {
            return false;
        }
        if(!this._propertyName.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._parameterName.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.setKeyword = function () {
        return this._setKeyword;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.propertyName = function () {
        return this._propertyName;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.parameterName = function () {
        return this._parameterName;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.block = function () {
        return this._block;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.update = function (setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
        if(this._setKeyword === setKeyword && this._propertyName === propertyName && this._openParenToken === openParenToken && this._parameterName === parameterName && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }
        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
    };
    return SetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var FunctionExpressionSyntax = (function (_super) {
    __extends(FunctionExpressionSyntax, _super);
    function FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block) {
        _super.call(this);
        this._functionKeyword = functionKeyword;
        this._identifier = identifier;
        this._callSignature = callSignature;
        this._block = block;
    }
    FunctionExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitFunctionExpression(this);
    };
    FunctionExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitFunctionExpression(this);
    };
    FunctionExpressionSyntax.prototype.kind = function () {
        return 218 /* FunctionExpression */ ;
    };
    FunctionExpressionSyntax.prototype.isMissing = function () {
        if(!this._functionKeyword.isMissing()) {
            return false;
        }
        if(this._identifier !== null && !this._identifier.isMissing()) {
            return false;
        }
        if(!this._callSignature.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    FunctionExpressionSyntax.prototype.functionKeyword = function () {
        return this._functionKeyword;
    };
    FunctionExpressionSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    FunctionExpressionSyntax.prototype.callSignature = function () {
        return this._callSignature;
    };
    FunctionExpressionSyntax.prototype.block = function () {
        return this._block;
    };
    FunctionExpressionSyntax.prototype.update = function (functionKeyword, identifier, callSignature, block) {
        if(this._functionKeyword === functionKeyword && this._identifier === identifier && this._callSignature === callSignature && this._block === block) {
            return this;
        }
        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
    };
    return FunctionExpressionSyntax;
})(UnaryExpressionSyntax);
var EmptyStatementSyntax = (function (_super) {
    __extends(EmptyStatementSyntax, _super);
    function EmptyStatementSyntax(semicolonToken) {
        _super.call(this);
        this._semicolonToken = semicolonToken;
    }
    EmptyStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitEmptyStatement(this);
    };
    EmptyStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitEmptyStatement(this);
    };
    EmptyStatementSyntax.prototype.kind = function () {
        return 146 /* EmptyStatement */ ;
    };
    EmptyStatementSyntax.prototype.isMissing = function () {
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    EmptyStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    EmptyStatementSyntax.prototype.update = function (semicolonToken) {
        if(this._semicolonToken === semicolonToken) {
            return this;
        }
        return new EmptyStatementSyntax(semicolonToken);
    };
    return EmptyStatementSyntax;
})(StatementSyntax);
var SuperExpressionSyntax = (function (_super) {
    __extends(SuperExpressionSyntax, _super);
    function SuperExpressionSyntax(superKeyword) {
        _super.call(this);
        this._superKeyword = superKeyword;
    }
    SuperExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitSuperExpression(this);
    };
    SuperExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitSuperExpression(this);
    };
    SuperExpressionSyntax.prototype.kind = function () {
        return 219 /* SuperExpression */ ;
    };
    SuperExpressionSyntax.prototype.isMissing = function () {
        if(!this._superKeyword.isMissing()) {
            return false;
        }
        return true;
    };
    SuperExpressionSyntax.prototype.superKeyword = function () {
        return this._superKeyword;
    };
    SuperExpressionSyntax.prototype.update = function (superKeyword) {
        if(this._superKeyword === superKeyword) {
            return this;
        }
        return new SuperExpressionSyntax(superKeyword);
    };
    return SuperExpressionSyntax;
})(UnaryExpressionSyntax);
var TryStatementSyntax = (function (_super) {
    __extends(TryStatementSyntax, _super);
    function TryStatementSyntax(tryKeyword, block, catchClause, finallyClause) {
        _super.call(this);
        this._tryKeyword = tryKeyword;
        this._block = block;
        this._catchClause = catchClause;
        this._finallyClause = finallyClause;
    }
    TryStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitTryStatement(this);
    };
    TryStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitTryStatement(this);
    };
    TryStatementSyntax.prototype.kind = function () {
        return 149 /* TryStatement */ ;
    };
    TryStatementSyntax.prototype.isMissing = function () {
        if(!this._tryKeyword.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        if(this._catchClause !== null && !this._catchClause.isMissing()) {
            return false;
        }
        if(this._finallyClause !== null && !this._finallyClause.isMissing()) {
            return false;
        }
        return true;
    };
    TryStatementSyntax.prototype.tryKeyword = function () {
        return this._tryKeyword;
    };
    TryStatementSyntax.prototype.block = function () {
        return this._block;
    };
    TryStatementSyntax.prototype.catchClause = function () {
        return this._catchClause;
    };
    TryStatementSyntax.prototype.finallyClause = function () {
        return this._finallyClause;
    };
    TryStatementSyntax.prototype.update = function (tryKeyword, block, catchClause, finallyClause) {
        if(this._tryKeyword === tryKeyword && this._block === block && this._catchClause === catchClause && this._finallyClause === finallyClause) {
            return this;
        }
        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause);
    };
    return TryStatementSyntax;
})(StatementSyntax);
var CatchClauseSyntax = (function (_super) {
    __extends(CatchClauseSyntax, _super);
    function CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block) {
        _super.call(this);
        this._catchKeyword = catchKeyword;
        this._openParenToken = openParenToken;
        this._identifier = identifier;
        this._closeParenToken = closeParenToken;
        this._block = block;
    }
    CatchClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitCatchClause(this);
    };
    CatchClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitCatchClause(this);
    };
    CatchClauseSyntax.prototype.kind = function () {
        return 231 /* CatchClause */ ;
    };
    CatchClauseSyntax.prototype.isMissing = function () {
        if(!this._catchKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    CatchClauseSyntax.prototype.catchKeyword = function () {
        return this._catchKeyword;
    };
    CatchClauseSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    CatchClauseSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    CatchClauseSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    CatchClauseSyntax.prototype.block = function () {
        return this._block;
    };
    CatchClauseSyntax.prototype.update = function (catchKeyword, openParenToken, identifier, closeParenToken, block) {
        if(this._catchKeyword === catchKeyword && this._openParenToken === openParenToken && this._identifier === identifier && this._closeParenToken === closeParenToken && this._block === block) {
            return this;
        }
        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
    };
    return CatchClauseSyntax;
})(SyntaxNode);
var FinallyClauseSyntax = (function (_super) {
    __extends(FinallyClauseSyntax, _super);
    function FinallyClauseSyntax(finallyKeyword, block) {
        _super.call(this);
        this._finallyKeyword = finallyKeyword;
        this._block = block;
    }
    FinallyClauseSyntax.prototype.accept = function (visitor) {
        visitor.visitFinallyClause(this);
    };
    FinallyClauseSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitFinallyClause(this);
    };
    FinallyClauseSyntax.prototype.kind = function () {
        return 232 /* FinallyClause */ ;
    };
    FinallyClauseSyntax.prototype.isMissing = function () {
        if(!this._finallyKeyword.isMissing()) {
            return false;
        }
        if(!this._block.isMissing()) {
            return false;
        }
        return true;
    };
    FinallyClauseSyntax.prototype.finallyKeyword = function () {
        return this._finallyKeyword;
    };
    FinallyClauseSyntax.prototype.block = function () {
        return this._block;
    };
    FinallyClauseSyntax.prototype.update = function (finallyKeyword, block) {
        if(this._finallyKeyword === finallyKeyword && this._block === block) {
            return this;
        }
        return new FinallyClauseSyntax(finallyKeyword, block);
    };
    return FinallyClauseSyntax;
})(SyntaxNode);
var LabeledStatement = (function (_super) {
    __extends(LabeledStatement, _super);
    function LabeledStatement(identifier, colonToken, statement) {
        _super.call(this);
        this._identifier = identifier;
        this._colonToken = colonToken;
        this._statement = statement;
    }
    LabeledStatement.prototype.accept = function (visitor) {
        visitor.visitLabeledStatement(this);
    };
    LabeledStatement.prototype.accept1 = function (visitor) {
        return visitor.visitLabeledStatement(this);
    };
    LabeledStatement.prototype.kind = function () {
        return 150 /* LabeledStatement */ ;
    };
    LabeledStatement.prototype.isMissing = function () {
        if(!this._identifier.isMissing()) {
            return false;
        }
        if(!this._colonToken.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        return true;
    };
    LabeledStatement.prototype.identifier = function () {
        return this._identifier;
    };
    LabeledStatement.prototype.colonToken = function () {
        return this._colonToken;
    };
    LabeledStatement.prototype.statement = function () {
        return this._statement;
    };
    LabeledStatement.prototype.update = function (identifier, colonToken, statement) {
        if(this._identifier === identifier && this._colonToken === colonToken && this._statement === statement) {
            return this;
        }
        return new LabeledStatement(identifier, colonToken, statement);
    };
    return LabeledStatement;
})(StatementSyntax);
var DoStatementSyntax = (function (_super) {
    __extends(DoStatementSyntax, _super);
    function DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken) {
        _super.call(this);
        this._doKeyword = doKeyword;
        this._statement = statement;
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._semicolonToken = semicolonToken;
    }
    DoStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitDoStatement(this);
    };
    DoStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitDoStatement(this);
    };
    DoStatementSyntax.prototype.kind = function () {
        return 151 /* DoStatement */ ;
    };
    DoStatementSyntax.prototype.isMissing = function () {
        if(!this._doKeyword.isMissing()) {
            return false;
        }
        if(!this._statement.isMissing()) {
            return false;
        }
        if(!this._whileKeyword.isMissing()) {
            return false;
        }
        if(!this._openParenToken.isMissing()) {
            return false;
        }
        if(!this._condition.isMissing()) {
            return false;
        }
        if(!this._closeParenToken.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    DoStatementSyntax.prototype.doKeyword = function () {
        return this._doKeyword;
    };
    DoStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    DoStatementSyntax.prototype.whileKeyword = function () {
        return this._whileKeyword;
    };
    DoStatementSyntax.prototype.openParenToken = function () {
        return this._openParenToken;
    };
    DoStatementSyntax.prototype.condition = function () {
        return this._condition;
    };
    DoStatementSyntax.prototype.closeParenToken = function () {
        return this._closeParenToken;
    };
    DoStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    DoStatementSyntax.prototype.update = function (doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken) {
        if(this._doKeyword === doKeyword && this._statement === statement && this._whileKeyword === whileKeyword && this._openParenToken === openParenToken && this._condition === condition && this._closeParenToken === closeParenToken && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
    };
    return DoStatementSyntax;
})(IterationStatementSyntax);
var TypeOfExpressionSyntax = (function (_super) {
    __extends(TypeOfExpressionSyntax, _super);
    function TypeOfExpressionSyntax(typeOfKeyword, expression) {
        _super.call(this);
        this._typeOfKeyword = typeOfKeyword;
        this._expression = expression;
    }
    TypeOfExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitTypeOfExpression(this);
    };
    TypeOfExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitTypeOfExpression(this);
    };
    TypeOfExpressionSyntax.prototype.kind = function () {
        return 161 /* TypeOfExpression */ ;
    };
    TypeOfExpressionSyntax.prototype.isMissing = function () {
        if(!this._typeOfKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        return true;
    };
    TypeOfExpressionSyntax.prototype.typeOfKeyword = function () {
        return this._typeOfKeyword;
    };
    TypeOfExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    TypeOfExpressionSyntax.prototype.update = function (typeOfKeyword, expression) {
        if(this._typeOfKeyword === typeOfKeyword && this._expression === expression) {
            return this;
        }
        return new TypeOfExpressionSyntax(typeOfKeyword, expression);
    };
    return TypeOfExpressionSyntax;
})(UnaryExpressionSyntax);
var DeleteExpressionSyntax = (function (_super) {
    __extends(DeleteExpressionSyntax, _super);
    function DeleteExpressionSyntax(deleteKeyword, expression) {
        _super.call(this);
        this._deleteKeyword = deleteKeyword;
        this._expression = expression;
    }
    DeleteExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitDeleteExpression(this);
    };
    DeleteExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitDeleteExpression(this);
    };
    DeleteExpressionSyntax.prototype.kind = function () {
        return 160 /* DeleteExpression */ ;
    };
    DeleteExpressionSyntax.prototype.isMissing = function () {
        if(!this._deleteKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        return true;
    };
    DeleteExpressionSyntax.prototype.deleteKeyword = function () {
        return this._deleteKeyword;
    };
    DeleteExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    DeleteExpressionSyntax.prototype.update = function (deleteKeyword, expression) {
        if(this._deleteKeyword === deleteKeyword && this._expression === expression) {
            return this;
        }
        return new DeleteExpressionSyntax(deleteKeyword, expression);
    };
    return DeleteExpressionSyntax;
})(UnaryExpressionSyntax);
var VoidExpressionSyntax = (function (_super) {
    __extends(VoidExpressionSyntax, _super);
    function VoidExpressionSyntax(voidKeyword, expression) {
        _super.call(this);
        this._voidKeyword = voidKeyword;
        this._expression = expression;
    }
    VoidExpressionSyntax.prototype.accept = function (visitor) {
        visitor.visitVoidExpression(this);
    };
    VoidExpressionSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitVoidExpression(this);
    };
    VoidExpressionSyntax.prototype.kind = function () {
        return 162 /* VoidExpression */ ;
    };
    VoidExpressionSyntax.prototype.isMissing = function () {
        if(!this._voidKeyword.isMissing()) {
            return false;
        }
        if(!this._expression.isMissing()) {
            return false;
        }
        return true;
    };
    VoidExpressionSyntax.prototype.voidKeyword = function () {
        return this._voidKeyword;
    };
    VoidExpressionSyntax.prototype.expression = function () {
        return this._expression;
    };
    VoidExpressionSyntax.prototype.update = function (voidKeyword, expression) {
        if(this._voidKeyword === voidKeyword && this._expression === expression) {
            return this;
        }
        return new VoidExpressionSyntax(voidKeyword, expression);
    };
    return VoidExpressionSyntax;
})(UnaryExpressionSyntax);
var DebuggerStatementSyntax = (function (_super) {
    __extends(DebuggerStatementSyntax, _super);
    function DebuggerStatementSyntax(debuggerKeyword, semicolonToken) {
        _super.call(this);
        this._debuggerKeyword = debuggerKeyword;
        this._semicolonToken = semicolonToken;
    }
    DebuggerStatementSyntax.prototype.accept = function (visitor) {
        visitor.visitDebuggerStatement(this);
    };
    DebuggerStatementSyntax.prototype.accept1 = function (visitor) {
        return visitor.visitDebuggerStatement(this);
    };
    DebuggerStatementSyntax.prototype.kind = function () {
        return 152 /* DebuggerStatement */ ;
    };
    DebuggerStatementSyntax.prototype.isMissing = function () {
        if(!this._debuggerKeyword.isMissing()) {
            return false;
        }
        if(!this._semicolonToken.isMissing()) {
            return false;
        }
        return true;
    };
    DebuggerStatementSyntax.prototype.debuggerKeyword = function () {
        return this._debuggerKeyword;
    };
    DebuggerStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    DebuggerStatementSyntax.prototype.update = function (debuggerKeyword, semicolonToken) {
        if(this._debuggerKeyword === debuggerKeyword && this._semicolonToken === semicolonToken) {
            return this;
        }
        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken);
    };
    return DebuggerStatementSyntax;
})(StatementSyntax);
var SyntaxRewriter = (function () {
    function SyntaxRewriter() { }
    SyntaxRewriter.prototype.visitToken = function (token) {
        return token;
    };
    SyntaxRewriter.prototype.visitNode = function (node) {
        return node === null ? null : node.accept1(this);
    };
    SyntaxRewriter.prototype.visitList = function (list) {
        var newItems = null;
        for(var i = 0, n = list.count(); i < n; i++) {
            var item = list.syntaxNodeAt(i);
            var newItem = item.accept1(this);
            if(item !== newItem && newItems === null) {
                newItems = [];
                for(var j = 0; j < i; j++) {
                    newItems.push(list.syntaxNodeAt(j));
                }
            }
            if(newItems) {
                newItems.push(newItem);
            }
        }
        Debug.assert(newItems === null || newItems.length === list.count());
        return newItems === null ? list : SyntaxList.create(newItems);
    };
    SyntaxRewriter.prototype.visitSeparatedList = function (list) {
        var newItems = null;
        for(var i = 0, n = list.count(); i < n; i++) {
            var item = list.itemAt(i);
            var newItem = item.isToken() ? this.visitToken(item) : this.visitNode(item);
            if(item !== newItem && newItems === null) {
                newItems = [];
                for(var j = 0; j < i; j++) {
                    newItems.push(list.itemAt(j));
                }
            }
            if(newItems) {
                newItems.push(newItem);
            }
        }
        Debug.assert(newItems === null || newItems.length === list.count());
        return newItems === null ? list : SeparatedSyntaxList.create(newItems);
    };
    SyntaxRewriter.prototype.visitSourceUnit = function (node) {
        return node.update(this.visitList(node.moduleElements()), this.visitToken(node.endOfFileToken()));
    };
    SyntaxRewriter.prototype.visitExternalModuleReference = function (node) {
        return node.update(this.visitToken(node.moduleKeyword()), this.visitToken(node.openParenToken()), this.visitToken(node.stringLiteral()), this.visitToken(node.closeParenToken()));
    };
    SyntaxRewriter.prototype.visitModuleNameModuleReference = function (node) {
        return node.update(this.visitNode(node.moduleName()));
    };
    SyntaxRewriter.prototype.visitImportDeclaration = function (node) {
        return node.update(this.visitToken(node.importKeyword()), this.visitToken(node.identifier()), this.visitToken(node.equalsToken()), this.visitNode(node.moduleReference()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitClassDeclaration = function (node) {
        return node.update(node.exportKeyword() === null ? null : this.visitToken(node.exportKeyword()), node.declareKeyword() === null ? null : this.visitToken(node.declareKeyword()), this.visitToken(node.classKeyword()), this.visitToken(node.identifier()), this.visitNode(node.extendsClause()), this.visitNode(node.implementsClause()), this.visitToken(node.openBraceToken()), this.visitList(node.classElements()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitInterfaceDeclaration = function (node) {
        return node.update(node.exportKeyword() === null ? null : this.visitToken(node.exportKeyword()), this.visitToken(node.interfaceKeyword()), this.visitToken(node.identifier()), this.visitNode(node.extendsClause()), this.visitNode(node.body()));
    };
    SyntaxRewriter.prototype.visitExtendsClause = function (node) {
        return node.update(this.visitToken(node.extendsKeyword()), this.visitSeparatedList(node.typeNames()));
    };
    SyntaxRewriter.prototype.visitImplementsClause = function (node) {
        return node.update(this.visitToken(node.implementsKeyword()), this.visitSeparatedList(node.typeNames()));
    };
    SyntaxRewriter.prototype.visitModuleDeclaration = function (node) {
        return node.update(node.exportKeyword() === null ? null : this.visitToken(node.exportKeyword()), node.declareKeyword() === null ? null : this.visitToken(node.declareKeyword()), this.visitToken(node.moduleKeyword()), this.visitNode(node.moduleName()), node.stringLiteral() === null ? null : this.visitToken(node.stringLiteral()), this.visitToken(node.openBraceToken()), this.visitList(node.moduleElements()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitFunctionDeclaration = function (node) {
        return node.update(node.exportKeyword() === null ? null : this.visitToken(node.exportKeyword()), node.declareKeyword() === null ? null : this.visitToken(node.declareKeyword()), this.visitToken(node.functionKeyword()), this.visitNode(node.functionSignature()), this.visitNode(node.block()), node.semicolonToken() === null ? null : this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitVariableStatement = function (node) {
        return node.update(node.exportKeyword() === null ? null : this.visitToken(node.exportKeyword()), node.declareKeyword() === null ? null : this.visitToken(node.declareKeyword()), this.visitNode(node.variableDeclaration()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitVariableDeclaration = function (node) {
        return node.update(this.visitToken(node.varKeyword()), this.visitSeparatedList(node.variableDeclarators()));
    };
    SyntaxRewriter.prototype.visitVariableDeclarator = function (node) {
        return node.update(this.visitToken(node.identifier()), this.visitNode(node.typeAnnotation()), this.visitNode(node.equalsValueClause()));
    };
    SyntaxRewriter.prototype.visitEqualsValueClause = function (node) {
        return node.update(this.visitToken(node.equalsToken()), this.visitNode(node.value()));
    };
    SyntaxRewriter.prototype.visitPrefixUnaryExpression = function (node) {
        return node.update(node.kind(), this.visitToken(node.operatorToken()), this.visitNode(node.operand()));
    };
    SyntaxRewriter.prototype.visitThisExpression = function (node) {
        return node.update(this.visitToken(node.thisKeyword()));
    };
    SyntaxRewriter.prototype.visitLiteralExpression = function (node) {
        return node.update(node.kind(), this.visitToken(node.literalToken()));
    };
    SyntaxRewriter.prototype.visitArrayLiteralExpression = function (node) {
        return node.update(this.visitToken(node.openBracketToken()), this.visitSeparatedList(node.expressions()), this.visitToken(node.closeBracketToken()));
    };
    SyntaxRewriter.prototype.visitOmittedExpression = function (node) {
        return node.update();
    };
    SyntaxRewriter.prototype.visitParenthesizedExpression = function (node) {
        return node.update(this.visitToken(node.openParenToken()), this.visitNode(node.expression()), this.visitToken(node.closeParenToken()));
    };
    SyntaxRewriter.prototype.visitSimpleArrowFunctionExpression = function (node) {
        return node.update(this.visitToken(node.identifier()), this.visitToken(node.equalsGreaterThanToken()), this.visitNode(node.body()));
    };
    SyntaxRewriter.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        return node.update(this.visitNode(node.callSignature()), this.visitToken(node.equalsGreaterThanToken()), this.visitNode(node.body()));
    };
    SyntaxRewriter.prototype.visitIdentifierName = function (node) {
        return node.update(this.visitToken(node.identifier()));
    };
    SyntaxRewriter.prototype.visitQualifiedName = function (node) {
        return node.update(this.visitNode(node.left()), this.visitToken(node.dotToken()), this.visitNode(node.right()));
    };
    SyntaxRewriter.prototype.visitConstructorType = function (node) {
        return node.update(this.visitToken(node.newKeyword()), this.visitNode(node.parameterList()), this.visitToken(node.equalsGreaterThanToken()), this.visitNode(node.type()));
    };
    SyntaxRewriter.prototype.visitFunctionType = function (node) {
        return node.update(this.visitNode(node.parameterList()), this.visitToken(node.equalsGreaterThanToken()), this.visitNode(node.type()));
    };
    SyntaxRewriter.prototype.visitObjectType = function (node) {
        return node.update(this.visitToken(node.openBraceToken()), this.visitSeparatedList(node.typeMembers()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitArrayType = function (node) {
        return node.update(this.visitNode(node.type()), this.visitToken(node.openBracketToken()), this.visitToken(node.closeBracketToken()));
    };
    SyntaxRewriter.prototype.visitPredefinedType = function (node) {
        return node.update(this.visitToken(node.keyword()));
    };
    SyntaxRewriter.prototype.visitTypeAnnotation = function (node) {
        return node.update(this.visitToken(node.colonToken()), this.visitNode(node.type()));
    };
    SyntaxRewriter.prototype.visitBlock = function (node) {
        return node.update(this.visitToken(node.openBraceToken()), this.visitList(node.statements()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitParameter = function (node) {
        return node.update(node.dotDotDotToken() === null ? null : this.visitToken(node.dotDotDotToken()), node.publicOrPrivateKeyword() === null ? null : this.visitToken(node.publicOrPrivateKeyword()), this.visitToken(node.identifier()), node.questionToken() === null ? null : this.visitToken(node.questionToken()), this.visitNode(node.typeAnnotation()), this.visitNode(node.equalsValueClause()));
    };
    SyntaxRewriter.prototype.visitMemberAccessExpression = function (node) {
        return node.update(this.visitNode(node.expression()), this.visitToken(node.dotToken()), this.visitNode(node.identifierName()));
    };
    SyntaxRewriter.prototype.visitPostfixUnaryExpression = function (node) {
        return node.update(node.kind(), this.visitNode(node.operand()), this.visitToken(node.operatorToken()));
    };
    SyntaxRewriter.prototype.visitElementAccessExpression = function (node) {
        return node.update(this.visitNode(node.expression()), this.visitToken(node.openBracketToken()), this.visitNode(node.argumentExpression()), this.visitToken(node.closeBracketToken()));
    };
    SyntaxRewriter.prototype.visitInvocationExpression = function (node) {
        return node.update(this.visitNode(node.expression()), this.visitNode(node.argumentList()));
    };
    SyntaxRewriter.prototype.visitArgumentList = function (node) {
        return node.update(this.visitToken(node.openParenToken()), this.visitSeparatedList(node.arguments()), this.visitToken(node.closeParenToken()));
    };
    SyntaxRewriter.prototype.visitBinaryExpression = function (node) {
        return node.update(node.kind(), this.visitNode(node.left()), this.visitToken(node.operatorToken()), this.visitNode(node.right()));
    };
    SyntaxRewriter.prototype.visitConditionalExpression = function (node) {
        return node.update(this.visitNode(node.condition()), this.visitToken(node.questionToken()), this.visitNode(node.whenTrue()), this.visitToken(node.colonToken()), this.visitNode(node.whenFalse()));
    };
    SyntaxRewriter.prototype.visitConstructSignature = function (node) {
        return node.update(this.visitToken(node.newKeyword()), this.visitNode(node.parameterList()), this.visitNode(node.typeAnnotation()));
    };
    SyntaxRewriter.prototype.visitFunctionSignature = function (node) {
        return node.update(this.visitToken(node.identifier()), node.questionToken() === null ? null : this.visitToken(node.questionToken()), this.visitNode(node.parameterList()), this.visitNode(node.typeAnnotation()));
    };
    SyntaxRewriter.prototype.visitIndexSignature = function (node) {
        return node.update(this.visitToken(node.openBracketToken()), this.visitNode(node.parameter()), this.visitToken(node.closeBracketToken()), this.visitNode(node.typeAnnotation()));
    };
    SyntaxRewriter.prototype.visitPropertySignature = function (node) {
        return node.update(this.visitToken(node.identifier()), node.questionToken() === null ? null : this.visitToken(node.questionToken()), this.visitNode(node.typeAnnotation()));
    };
    SyntaxRewriter.prototype.visitParameterList = function (node) {
        return node.update(this.visitToken(node.openParenToken()), this.visitSeparatedList(node.parameters()), this.visitToken(node.closeParenToken()));
    };
    SyntaxRewriter.prototype.visitCallSignature = function (node) {
        return node.update(this.visitNode(node.parameterList()), this.visitNode(node.typeAnnotation()));
    };
    SyntaxRewriter.prototype.visitElseClause = function (node) {
        return node.update(this.visitToken(node.elseKeyword()), this.visitNode(node.statement()));
    };
    SyntaxRewriter.prototype.visitIfStatement = function (node) {
        return node.update(this.visitToken(node.ifKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.condition()), this.visitToken(node.closeParenToken()), this.visitNode(node.statement()), this.visitNode(node.elseClause()));
    };
    SyntaxRewriter.prototype.visitExpressionStatement = function (node) {
        return node.update(this.visitNode(node.expression()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitConstructorDeclaration = function (node) {
        return node.update(this.visitToken(node.constructorKeyword()), this.visitNode(node.parameterList()), this.visitNode(node.block()), node.semicolonToken() === null ? null : this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitMemberFunctionDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword() === null ? null : this.visitToken(node.publicOrPrivateKeyword()), node.staticKeyword() === null ? null : this.visitToken(node.staticKeyword()), this.visitNode(node.functionSignature()), this.visitNode(node.block()), node.semicolonToken() === null ? null : this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitGetMemberAccessorDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword() === null ? null : this.visitToken(node.publicOrPrivateKeyword()), node.staticKeyword() === null ? null : this.visitToken(node.staticKeyword()), this.visitToken(node.getKeyword()), this.visitToken(node.identifier()), this.visitNode(node.parameterList()), this.visitNode(node.typeAnnotation()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitSetMemberAccessorDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword() === null ? null : this.visitToken(node.publicOrPrivateKeyword()), node.staticKeyword() === null ? null : this.visitToken(node.staticKeyword()), this.visitToken(node.setKeyword()), this.visitToken(node.identifier()), this.visitNode(node.parameterList()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitMemberVariableDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword() === null ? null : this.visitToken(node.publicOrPrivateKeyword()), node.staticKeyword() === null ? null : this.visitToken(node.staticKeyword()), this.visitNode(node.variableDeclarator()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitThrowStatement = function (node) {
        return node.update(this.visitToken(node.throwKeyword()), this.visitNode(node.expression()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitReturnStatement = function (node) {
        return node.update(this.visitToken(node.returnKeyword()), this.visitNode(node.expression()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitObjectCreationExpression = function (node) {
        return node.update(this.visitToken(node.newKeyword()), this.visitNode(node.expression()), this.visitNode(node.argumentList()));
    };
    SyntaxRewriter.prototype.visitSwitchStatement = function (node) {
        return node.update(this.visitToken(node.switchKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.expression()), this.visitToken(node.closeParenToken()), this.visitToken(node.openBraceToken()), this.visitList(node.caseClauses()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitCaseSwitchClause = function (node) {
        return node.update(this.visitToken(node.caseKeyword()), this.visitNode(node.expression()), this.visitToken(node.colonToken()), this.visitList(node.statements()));
    };
    SyntaxRewriter.prototype.visitDefaultSwitchClause = function (node) {
        return node.update(this.visitToken(node.defaultKeyword()), this.visitToken(node.colonToken()), this.visitList(node.statements()));
    };
    SyntaxRewriter.prototype.visitBreakStatement = function (node) {
        return node.update(this.visitToken(node.breakKeyword()), node.identifier() === null ? null : this.visitToken(node.identifier()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitContinueStatement = function (node) {
        return node.update(this.visitToken(node.continueKeyword()), node.identifier() === null ? null : this.visitToken(node.identifier()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitForStatement = function (node) {
        return node.update(this.visitToken(node.forKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.variableDeclaration()), this.visitNode(node.initializer()), this.visitToken(node.firstSemicolonToken()), this.visitNode(node.condition()), this.visitToken(node.secondSemicolonToken()), this.visitNode(node.incrementor()), this.visitToken(node.closeParenToken()), this.visitNode(node.statement()));
    };
    SyntaxRewriter.prototype.visitForInStatement = function (node) {
        return node.update(this.visitToken(node.forKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.variableDeclaration()), this.visitNode(node.left()), this.visitToken(node.inKeyword()), this.visitNode(node.expression()), this.visitToken(node.closeParenToken()), this.visitNode(node.statement()));
    };
    SyntaxRewriter.prototype.visitWhileStatement = function (node) {
        return node.update(this.visitToken(node.whileKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.condition()), this.visitToken(node.closeParenToken()), this.visitNode(node.statement()));
    };
    SyntaxRewriter.prototype.visitWithStatement = function (node) {
        return node.update(this.visitToken(node.withKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.condition()), this.visitToken(node.closeParenToken()), this.visitNode(node.statement()));
    };
    SyntaxRewriter.prototype.visitEnumDeclaration = function (node) {
        return node.update(node.exportKeyword() === null ? null : this.visitToken(node.exportKeyword()), this.visitToken(node.enumKeyword()), this.visitToken(node.identifier()), this.visitToken(node.openBraceToken()), this.visitSeparatedList(node.variableDeclarators()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitCastExpression = function (node) {
        return node.update(this.visitToken(node.lessThanToken()), this.visitNode(node.type()), this.visitToken(node.greaterThanToken()), this.visitNode(node.expression()));
    };
    SyntaxRewriter.prototype.visitObjectLiteralExpression = function (node) {
        return node.update(this.visitToken(node.openBraceToken()), this.visitSeparatedList(node.propertyAssignments()), this.visitToken(node.closeBraceToken()));
    };
    SyntaxRewriter.prototype.visitSimplePropertyAssignment = function (node) {
        return node.update(this.visitToken(node.propertyName()), this.visitToken(node.colonToken()), this.visitNode(node.expression()));
    };
    SyntaxRewriter.prototype.visitGetAccessorPropertyAssignment = function (node) {
        return node.update(this.visitToken(node.getKeyword()), this.visitToken(node.propertyName()), this.visitToken(node.openParenToken()), this.visitToken(node.closeParenToken()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitSetAccessorPropertyAssignment = function (node) {
        return node.update(this.visitToken(node.setKeyword()), this.visitToken(node.propertyName()), this.visitToken(node.openParenToken()), this.visitToken(node.parameterName()), this.visitToken(node.closeParenToken()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitFunctionExpression = function (node) {
        return node.update(this.visitToken(node.functionKeyword()), node.identifier() === null ? null : this.visitToken(node.identifier()), this.visitNode(node.callSignature()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitEmptyStatement = function (node) {
        return node.update(this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitSuperExpression = function (node) {
        return node.update(this.visitToken(node.superKeyword()));
    };
    SyntaxRewriter.prototype.visitTryStatement = function (node) {
        return node.update(this.visitToken(node.tryKeyword()), this.visitNode(node.block()), this.visitNode(node.catchClause()), this.visitNode(node.finallyClause()));
    };
    SyntaxRewriter.prototype.visitCatchClause = function (node) {
        return node.update(this.visitToken(node.catchKeyword()), this.visitToken(node.openParenToken()), this.visitToken(node.identifier()), this.visitToken(node.closeParenToken()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitFinallyClause = function (node) {
        return node.update(this.visitToken(node.finallyKeyword()), this.visitNode(node.block()));
    };
    SyntaxRewriter.prototype.visitLabeledStatement = function (node) {
        return node.update(this.visitToken(node.identifier()), this.visitToken(node.colonToken()), this.visitNode(node.statement()));
    };
    SyntaxRewriter.prototype.visitDoStatement = function (node) {
        return node.update(this.visitToken(node.doKeyword()), this.visitNode(node.statement()), this.visitToken(node.whileKeyword()), this.visitToken(node.openParenToken()), this.visitNode(node.condition()), this.visitToken(node.closeParenToken()), this.visitToken(node.semicolonToken()));
    };
    SyntaxRewriter.prototype.visitTypeOfExpression = function (node) {
        return node.update(this.visitToken(node.typeOfKeyword()), this.visitNode(node.expression()));
    };
    SyntaxRewriter.prototype.visitDeleteExpression = function (node) {
        return node.update(this.visitToken(node.deleteKeyword()), this.visitNode(node.expression()));
    };
    SyntaxRewriter.prototype.visitVoidExpression = function (node) {
        return node.update(this.visitToken(node.voidKeyword()), this.visitNode(node.expression()));
    };
    SyntaxRewriter.prototype.visitDebuggerStatement = function (node) {
        return node.update(this.visitToken(node.debuggerKeyword()), this.visitToken(node.semicolonToken()));
    };
    return SyntaxRewriter;
})();
var SyntaxTokenFactory;
(function (SyntaxTokenFactory) {
    function getTriviaLength(value) {
        return value & 67108863 /* TriviaLengthMask */ ;
    }
    function hasTriviaComment(value) {
        return (value & 67108864 /* TriviaCommentMask */ ) !== 0;
    }
    function hasTriviaNewLine(value) {
        return (value & 134217728 /* TriviaNewLineMask */ ) !== 0;
    }
    function fullEnd(token) {
        return token.fullStart() + token.fullWidth();
    }
    function end(token) {
        return token.start() + token.width();
    }
    function toJSON(token) {
        var result = {
            kind: (SyntaxKind)._map[token.tokenKind]
        };
        if(token.keywordKind() !== 0 /* None */ ) {
            result.keywordKind = (SyntaxKind)._map[token.keywordKind()];
        }
        result.start = token.start();
        if(token.fullStart() !== token.start()) {
            result.fullStart = token.fullStart();
        }
        result.width = token.width();
        if(token.fullWidth() !== token.width()) {
            result.fullWidth = token.fullWidth();
        }
        if(token.isMissing()) {
            result.isMissing = true;
        }
        result.text = token.text();
        if(token.value() !== null) {
            result.value = token.value;
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
        return result;
    }
    function toValueString(token) {
        var value = token.value();
        return value === null ? null : typeof value === 'string' ? value : value.toString();
    }
    var EmptyToken = (function () {
        function EmptyToken(fullStart, kind, keywordKind) {
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._keywordKind = keywordKind;
        }
        EmptyToken.prototype.isToken = function () {
            return true;
        };
        EmptyToken.prototype.isNode = function () {
            return false;
        };
        EmptyToken.prototype.isList = function () {
            return false;
        };
        EmptyToken.prototype.isSeparatedList = function () {
            return false;
        };
        EmptyToken.prototype.kind = function () {
            return this.tokenKind;
        };
        EmptyToken.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        EmptyToken.prototype.keywordKind = function () {
            return this._keywordKind;
        };
        EmptyToken.prototype.fullStart = function () {
            return this._fullStart;
        };
        EmptyToken.prototype.fullWidth = function () {
            return 0;
        };
        EmptyToken.prototype.start = function () {
            return this._fullStart;
        };
        EmptyToken.prototype.width = function () {
            return 0;
        };
        EmptyToken.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        EmptyToken.prototype.end = function () {
            return end(this);
        };
        EmptyToken.prototype.isMissing = function () {
            return true;
        };
        EmptyToken.prototype.text = function () {
            return "";
        };
        EmptyToken.prototype.fullText = function (itext) {
            return "";
        };
        EmptyToken.prototype.value = function () {
            return null;
        };
        EmptyToken.prototype.valueText = function () {
            return toValueString(this);
        };
        EmptyToken.prototype.hasLeadingTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasTrailingTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        EmptyToken.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        EmptyToken.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return EmptyToken;
    })();    
    var FixedWidthTokenWithNoTrivia = (function () {
        function FixedWidthTokenWithNoTrivia(kind, fullStart) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
        }
        FixedWidthTokenWithNoTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithNoTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithNoTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        FixedWidthTokenWithNoTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthTokenWithNoTrivia.prototype.fullWidth = function () {
            return this.width();
        };
        FixedWidthTokenWithNoTrivia.prototype.start = function () {
            return this.fullStart();
        };
        FixedWidthTokenWithNoTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithNoTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithNoTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithNoTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.fullText = function (text) {
            return this.text();
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        FixedWidthTokenWithNoTrivia.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return FixedWidthTokenWithNoTrivia;
    })();    
    var FixedWidthTokenWithLeadingTrivia = (function () {
        function FixedWidthTokenWithLeadingTrivia(kind, fullStart, leadingTriviaInfo) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }
        FixedWidthTokenWithLeadingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.fullWidth = function () {
            return getTriviaLength(this._leadingTriviaInfo) + this.width();
        };
        FixedWidthTokenWithLeadingTrivia.prototype.start = function () {
            return this.fullStart() + getTriviaLength(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.leadingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return FixedWidthTokenWithLeadingTrivia;
    })();    
    var FixedWidthTokenWithTrailingTrivia = (function () {
        function FixedWidthTokenWithTrailingTrivia(kind, fullStart, trailingTriviaInfo) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        FixedWidthTokenWithTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.fullWidth = function () {
            return this.width() + getTriviaLength(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.start = function () {
            return this.fullStart();
        };
        FixedWidthTokenWithTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.trailingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        return FixedWidthTokenWithTrailingTrivia;
    })();    
    var FixedWidthTokenWithLeadingAndTrailingTrivia = (function () {
        function FixedWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, leadingTriviaInfo, trailingTriviaInfo) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.fullWidth = function () {
            return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.start = function () {
            return this.fullStart() + getTriviaLength(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.leadingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.trailingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        return FixedWidthTokenWithLeadingAndTrailingTrivia;
    })();    
    var FixedWidthKeywordWithNoTrivia = (function () {
        function FixedWidthKeywordWithNoTrivia(kind, fullStart) {
            this.tokenKind = 7 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
        }
        FixedWidthKeywordWithNoTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthKeywordWithNoTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.kind = function () {
            return 7 /* IdentifierNameToken */ ;
        };
        FixedWidthKeywordWithNoTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthKeywordWithNoTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.keywordKind = function () {
            return this._keywordKind;
        };
        FixedWidthKeywordWithNoTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthKeywordWithNoTrivia.prototype.fullWidth = function () {
            return this.width();
        };
        FixedWidthKeywordWithNoTrivia.prototype.start = function () {
            return this.fullStart();
        };
        FixedWidthKeywordWithNoTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthKeywordWithNoTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthKeywordWithNoTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthKeywordWithNoTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this._keywordKind);
        };
        FixedWidthKeywordWithNoTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthKeywordWithNoTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthKeywordWithNoTrivia.prototype.fullText = function (text) {
            return this.text();
        };
        FixedWidthKeywordWithNoTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithNoTrivia.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        FixedWidthKeywordWithNoTrivia.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return FixedWidthKeywordWithNoTrivia;
    })();    
    var FixedWidthKeywordWithLeadingTrivia = (function () {
        function FixedWidthKeywordWithLeadingTrivia(kind, fullStart, leadingTriviaInfo) {
            this.tokenKind = 7 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }
        FixedWidthKeywordWithLeadingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.kind = function () {
            return 7 /* IdentifierNameToken */ ;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.keywordKind = function () {
            return this._keywordKind;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.fullWidth = function () {
            return getTriviaLength(this._leadingTriviaInfo) + this.width();
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.start = function () {
            return this.fullStart() + getTriviaLength(this._leadingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this._keywordKind);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.leadingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingTrivia.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return FixedWidthKeywordWithLeadingTrivia;
    })();    
    var FixedWidthKeywordWithTrailingTrivia = (function () {
        function FixedWidthKeywordWithTrailingTrivia(kind, fullStart, trailingTriviaInfo) {
            this.tokenKind = 7 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        FixedWidthKeywordWithTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.kind = function () {
            return 7 /* IdentifierNameToken */ ;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.keywordKind = function () {
            return this._keywordKind;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.fullWidth = function () {
            return this.width() + getTriviaLength(this._trailingTriviaInfo);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.start = function () {
            return this.fullStart();
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this._keywordKind);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        FixedWidthKeywordWithTrailingTrivia.prototype.trailingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        return FixedWidthKeywordWithTrailingTrivia;
    })();    
    var FixedWidthKeywordWithLeadingAndTrailingTrivia = (function () {
        function FixedWidthKeywordWithLeadingAndTrailingTrivia(kind, fullStart, leadingTriviaInfo, trailingTriviaInfo) {
            this.tokenKind = 7 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.kind = function () {
            return 7 /* IdentifierNameToken */ ;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.isMissing = function () {
            return false;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.keywordKind = function () {
            return this._keywordKind;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.fullWidth = function () {
            return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.start = function () {
            return this.fullStart() + getTriviaLength(this._leadingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.end = function () {
            return end(this);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this._keywordKind);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.leadingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        FixedWidthKeywordWithLeadingAndTrailingTrivia.prototype.trailingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        return FixedWidthKeywordWithLeadingAndTrailingTrivia;
    })();    
    var VariableWidthTokenWithNoTrivia = (function () {
        function VariableWidthTokenWithNoTrivia(kind, fullStart, text, value) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._value = value;
        }
        VariableWidthTokenWithNoTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithNoTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithNoTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.isMissing = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        VariableWidthTokenWithNoTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        VariableWidthTokenWithNoTrivia.prototype.fullWidth = function () {
            return this.width();
        };
        VariableWidthTokenWithNoTrivia.prototype.start = function () {
            return this.fullStart();
        };
        VariableWidthTokenWithNoTrivia.prototype.width = function () {
            return this.text().length;
        };
        VariableWidthTokenWithNoTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.end = function () {
            return end(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.text = function () {
            return this._text;
        };
        VariableWidthTokenWithNoTrivia.prototype.value = function () {
            return this._value;
        };
        VariableWidthTokenWithNoTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.fullText = function (text) {
            return this.text();
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        VariableWidthTokenWithNoTrivia.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return VariableWidthTokenWithNoTrivia;
    })();    
    var VariableWidthTokenWithLeadingTrivia = (function () {
        function VariableWidthTokenWithLeadingTrivia(kind, fullStart, text, leadingTriviaInfo, value) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._value = value;
        }
        VariableWidthTokenWithLeadingTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isMissing = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.fullWidth = function () {
            return getTriviaLength(this._leadingTriviaInfo) + this.width();
        };
        VariableWidthTokenWithLeadingTrivia.prototype.start = function () {
            return this.fullStart() + getTriviaLength(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.width = function () {
            return this.text().length;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.end = function () {
            return end(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.text = function () {
            return this._text;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.value = function () {
            return this._value;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.leadingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.trailingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        return VariableWidthTokenWithLeadingTrivia;
    })();    
    var VariableWidthTokenWithTrailingTrivia = (function () {
        function VariableWidthTokenWithTrailingTrivia(kind, fullStart, text, trailingTriviaInfo, value) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._value = value;
        }
        VariableWidthTokenWithTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isMissing = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.fullWidth = function () {
            return this.width() + getTriviaLength(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.start = function () {
            return this.fullStart();
        };
        VariableWidthTokenWithTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.end = function () {
            return end(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.text = function () {
            return this._text;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.value = function () {
            return this._value;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.leadingTrivia = function (text) {
            return SyntaxTriviaList.empty;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.trailingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        return VariableWidthTokenWithTrailingTrivia;
    })();    
    var VariableWidthTokenWithLeadingAndTrailingTrivia = (function () {
        function VariableWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, text, leadingTriviaInfo, trailingTriviaInfo, value) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._value = value;
        }
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.toJSON = function (key) {
            return toJSON(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isMissing = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.keywordKind = function () {
            return 0 /* None */ ;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.fullStart = function () {
            return this._fullStart;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.fullWidth = function () {
            return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.start = function () {
            return this.fullStart() + getTriviaLength(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.fullEnd = function () {
            return fullEnd(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.end = function () {
            return end(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.text = function () {
            return this._text;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.value = function () {
            return this._value;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.valueText = function () {
            return toValueString(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.fullText = function (text) {
            return text.substr(this.fullStart(), this.fullWidth());
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingCommentTrivia = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingNewLineTrivia = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.leadingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingCommentTrivia = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingNewLineTrivia = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.trailingTrivia = function (text) {
            throw Errors.notYetImplemented();
        };
        return VariableWidthTokenWithLeadingAndTrailingTrivia;
    })();    
    function createFixedWidthToken(fullStart, leadingTriviaInfo, kind, trailingTriviaInfo) {
        if(leadingTriviaInfo === 0) {
            if(trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithNoTrivia(kind, fullStart);
            } else {
                return new FixedWidthTokenWithTrailingTrivia(kind, fullStart, trailingTriviaInfo);
            }
        } else {
            if(trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithLeadingTrivia(kind, fullStart, leadingTriviaInfo);
            } else {
                return new FixedWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
            }
        }
    }
    function createVariableWidthToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo) {
        var kind = tokenInfo.Kind;
        var text = tokenInfo.Text === null ? SyntaxFacts.getText(kind) : tokenInfo.Text;
        if(leadingTriviaInfo === 0) {
            if(trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithNoTrivia(kind, fullStart, text, tokenInfo.Value);
            } else {
                return new VariableWidthTokenWithTrailingTrivia(kind, fullStart, text, trailingTriviaInfo, tokenInfo.Value);
            }
        } else {
            if(trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithLeadingTrivia(kind, fullStart, text, leadingTriviaInfo, tokenInfo.Value);
            } else {
                return new VariableWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, text, leadingTriviaInfo, trailingTriviaInfo, tokenInfo.Value);
            }
        }
    }
    function createFixedWidthKeyword(fullStart, leadingTriviaInfo, keywordKind, trailingTriviaInfo) {
        if(leadingTriviaInfo === 0) {
            if(trailingTriviaInfo === 0) {
                return new FixedWidthKeywordWithNoTrivia(keywordKind, fullStart);
            } else {
                return new FixedWidthKeywordWithTrailingTrivia(keywordKind, fullStart, trailingTriviaInfo);
            }
        } else {
            if(trailingTriviaInfo === 0) {
                return new FixedWidthKeywordWithLeadingTrivia(keywordKind, fullStart, leadingTriviaInfo);
            } else {
                return new FixedWidthKeywordWithLeadingAndTrailingTrivia(keywordKind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
            }
        }
    }
    function create(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo) {
        if(SyntaxFacts.isAnyPunctuation(tokenInfo.Kind)) {
            return createFixedWidthToken(fullStart, leadingTriviaInfo, tokenInfo.Kind, trailingTriviaInfo);
        } else {
            if(SyntaxFacts.isAnyKeyword(tokenInfo.KeywordKind)) {
                return createFixedWidthKeyword(fullStart, leadingTriviaInfo, tokenInfo.KeywordKind, trailingTriviaInfo);
            } else {
                return createVariableWidthToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo);
            }
        }
    }
    SyntaxTokenFactory.create = create;
    function createEmptyToken(fullStart, kind, keywordKind) {
        return new EmptyToken(fullStart, kind, keywordKind);
    }
    SyntaxTokenFactory.createEmptyToken = createEmptyToken;
})(SyntaxTokenFactory || (SyntaxTokenFactory = {}));
var SyntaxTree = (function () {
    function SyntaxTree(sourceUnit, skippedTokens, diagnostics) {
        this._sourceUnit = sourceUnit;
        this._skippedTokens = skippedTokens;
        this._diagnostics = diagnostics;
    }
    SyntaxTree.prototype.toJSON = function (key) {
        var result = {
        };
        if(this._skippedTokens.length > 0) {
            result._skippedTokens = this._skippedTokens;
        }
        if(this._diagnostics.length > 0) {
            result._diagnostics = this._diagnostics;
        }
        result._sourceUnit = this._sourceUnit;
        return result;
    };
    SyntaxTree.prototype.sourceUnit = function () {
        return this._sourceUnit;
    };
    SyntaxTree.prototype.skippedTokens = function () {
        return this._skippedTokens;
    };
    SyntaxTree.prototype.diagnostics = function () {
        return this._diagnostics;
    };
    SyntaxTree.prototype.findToken = function (position) {
        if(position < 0 || position > this._sourceUnit.endOfFileToken().end()) {
            throw Errors.argumentOutOfRange("position");
        }
        return null;
    };
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
var SyntaxWalker = (function () {
    function SyntaxWalker() { }
    SyntaxWalker.prototype.visitToken = function (token) {
    };
    SyntaxWalker.prototype.visit = function (element) {
        if(element === null) {
            return;
        }
        if(element.isToken()) {
            this.visitToken(element);
        } else {
            if(element.isNode()) {
                (element).accept(this);
            } else {
                if(element.isList()) {
                    var list = element;
                    for(var i = 0, n = list.count(); i < n; i++) {
                        this.visit(list.syntaxNodeAt(i));
                    }
                } else {
                    if(element.isSeparatedList()) {
                        var separatedList = element;
                        for(var i = 0, n = separatedList.count(); i < n; i++) {
                            this.visit(separatedList.itemAt(i));
                        }
                    } else {
                        throw Errors.invalidOperation();
                    }
                }
            }
        }
    };
    SyntaxWalker.prototype.visitSourceUnit = function (node) {
        this.visit(node.moduleElements());
        this.visit(node.endOfFileToken());
    };
    SyntaxWalker.prototype.visitExternalModuleReference = function (node) {
        this.visit(node.moduleKeyword());
        this.visit(node.openParenToken());
        this.visit(node.stringLiteral());
        this.visit(node.closeParenToken());
    };
    SyntaxWalker.prototype.visitModuleNameModuleReference = function (node) {
        this.visit(node.moduleName());
    };
    SyntaxWalker.prototype.visitImportDeclaration = function (node) {
        this.visit(node.importKeyword());
        this.visit(node.identifier());
        this.visit(node.equalsToken());
        this.visit(node.moduleReference());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitClassDeclaration = function (node) {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.classKeyword());
        this.visit(node.identifier());
        this.visit(node.extendsClause());
        this.visit(node.implementsClause());
        this.visit(node.openBraceToken());
        this.visit(node.classElements());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitInterfaceDeclaration = function (node) {
        this.visit(node.exportKeyword());
        this.visit(node.interfaceKeyword());
        this.visit(node.identifier());
        this.visit(node.extendsClause());
        this.visit(node.body());
    };
    SyntaxWalker.prototype.visitExtendsClause = function (node) {
        this.visit(node.extendsKeyword());
        this.visit(node.typeNames());
    };
    SyntaxWalker.prototype.visitImplementsClause = function (node) {
        this.visit(node.implementsKeyword());
        this.visit(node.typeNames());
    };
    SyntaxWalker.prototype.visitModuleDeclaration = function (node) {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.moduleKeyword());
        this.visit(node.moduleName());
        this.visit(node.stringLiteral());
        this.visit(node.openBraceToken());
        this.visit(node.moduleElements());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitFunctionDeclaration = function (node) {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.functionKeyword());
        this.visit(node.functionSignature());
        this.visit(node.block());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitVariableStatement = function (node) {
        this.visit(node.exportKeyword());
        this.visit(node.declareKeyword());
        this.visit(node.variableDeclaration());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitVariableDeclaration = function (node) {
        this.visit(node.varKeyword());
        this.visit(node.variableDeclarators());
    };
    SyntaxWalker.prototype.visitVariableDeclarator = function (node) {
        this.visit(node.identifier());
        this.visit(node.typeAnnotation());
        this.visit(node.equalsValueClause());
    };
    SyntaxWalker.prototype.visitEqualsValueClause = function (node) {
        this.visit(node.equalsToken());
        this.visit(node.value());
    };
    SyntaxWalker.prototype.visitPrefixUnaryExpression = function (node) {
        this.visit(node.operatorToken());
        this.visit(node.operand());
    };
    SyntaxWalker.prototype.visitThisExpression = function (node) {
        this.visit(node.thisKeyword());
    };
    SyntaxWalker.prototype.visitLiteralExpression = function (node) {
        this.visit(node.literalToken());
    };
    SyntaxWalker.prototype.visitArrayLiteralExpression = function (node) {
        this.visit(node.openBracketToken());
        this.visit(node.expressions());
        this.visit(node.closeBracketToken());
    };
    SyntaxWalker.prototype.visitOmittedExpression = function (node) {
    };
    SyntaxWalker.prototype.visitParenthesizedExpression = function (node) {
        this.visit(node.openParenToken());
        this.visit(node.expression());
        this.visit(node.closeParenToken());
    };
    SyntaxWalker.prototype.visitSimpleArrowFunctionExpression = function (node) {
        this.visit(node.identifier());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.body());
    };
    SyntaxWalker.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        this.visit(node.callSignature());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.body());
    };
    SyntaxWalker.prototype.visitIdentifierName = function (node) {
        this.visit(node.identifier());
    };
    SyntaxWalker.prototype.visitQualifiedName = function (node) {
        this.visit(node.left());
        this.visit(node.dotToken());
        this.visit(node.right());
    };
    SyntaxWalker.prototype.visitConstructorType = function (node) {
        this.visit(node.newKeyword());
        this.visit(node.parameterList());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.type());
    };
    SyntaxWalker.prototype.visitFunctionType = function (node) {
        this.visit(node.parameterList());
        this.visit(node.equalsGreaterThanToken());
        this.visit(node.type());
    };
    SyntaxWalker.prototype.visitObjectType = function (node) {
        this.visit(node.openBraceToken());
        this.visit(node.typeMembers());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitArrayType = function (node) {
        this.visit(node.type());
        this.visit(node.openBracketToken());
        this.visit(node.closeBracketToken());
    };
    SyntaxWalker.prototype.visitPredefinedType = function (node) {
        this.visit(node.keyword());
    };
    SyntaxWalker.prototype.visitTypeAnnotation = function (node) {
        this.visit(node.colonToken());
        this.visit(node.type());
    };
    SyntaxWalker.prototype.visitBlock = function (node) {
        this.visit(node.openBraceToken());
        this.visit(node.statements());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitParameter = function (node) {
        this.visit(node.dotDotDotToken());
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.identifier());
        this.visit(node.questionToken());
        this.visit(node.typeAnnotation());
        this.visit(node.equalsValueClause());
    };
    SyntaxWalker.prototype.visitMemberAccessExpression = function (node) {
        this.visit(node.expression());
        this.visit(node.dotToken());
        this.visit(node.identifierName());
    };
    SyntaxWalker.prototype.visitPostfixUnaryExpression = function (node) {
        this.visit(node.operand());
        this.visit(node.operatorToken());
    };
    SyntaxWalker.prototype.visitElementAccessExpression = function (node) {
        this.visit(node.expression());
        this.visit(node.openBracketToken());
        this.visit(node.argumentExpression());
        this.visit(node.closeBracketToken());
    };
    SyntaxWalker.prototype.visitInvocationExpression = function (node) {
        this.visit(node.expression());
        this.visit(node.argumentList());
    };
    SyntaxWalker.prototype.visitArgumentList = function (node) {
        this.visit(node.openParenToken());
        this.visit(node.arguments());
        this.visit(node.closeParenToken());
    };
    SyntaxWalker.prototype.visitBinaryExpression = function (node) {
        this.visit(node.left());
        this.visit(node.operatorToken());
        this.visit(node.right());
    };
    SyntaxWalker.prototype.visitConditionalExpression = function (node) {
        this.visit(node.condition());
        this.visit(node.questionToken());
        this.visit(node.whenTrue());
        this.visit(node.colonToken());
        this.visit(node.whenFalse());
    };
    SyntaxWalker.prototype.visitConstructSignature = function (node) {
        this.visit(node.newKeyword());
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
    };
    SyntaxWalker.prototype.visitFunctionSignature = function (node) {
        this.visit(node.identifier());
        this.visit(node.questionToken());
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
    };
    SyntaxWalker.prototype.visitIndexSignature = function (node) {
        this.visit(node.openBracketToken());
        this.visit(node.parameter());
        this.visit(node.closeBracketToken());
        this.visit(node.typeAnnotation());
    };
    SyntaxWalker.prototype.visitPropertySignature = function (node) {
        this.visit(node.identifier());
        this.visit(node.questionToken());
        this.visit(node.typeAnnotation());
    };
    SyntaxWalker.prototype.visitParameterList = function (node) {
        this.visit(node.openParenToken());
        this.visit(node.parameters());
        this.visit(node.closeParenToken());
    };
    SyntaxWalker.prototype.visitCallSignature = function (node) {
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
    };
    SyntaxWalker.prototype.visitElseClause = function (node) {
        this.visit(node.elseKeyword());
        this.visit(node.statement());
    };
    SyntaxWalker.prototype.visitIfStatement = function (node) {
        this.visit(node.ifKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
        this.visit(node.elseClause());
    };
    SyntaxWalker.prototype.visitExpressionStatement = function (node) {
        this.visit(node.expression());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitConstructorDeclaration = function (node) {
        this.visit(node.constructorKeyword());
        this.visit(node.parameterList());
        this.visit(node.block());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitMemberFunctionDeclaration = function (node) {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.functionSignature());
        this.visit(node.block());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitGetMemberAccessorDeclaration = function (node) {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.getKeyword());
        this.visit(node.identifier());
        this.visit(node.parameterList());
        this.visit(node.typeAnnotation());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitSetMemberAccessorDeclaration = function (node) {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.setKeyword());
        this.visit(node.identifier());
        this.visit(node.parameterList());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitMemberVariableDeclaration = function (node) {
        this.visit(node.publicOrPrivateKeyword());
        this.visit(node.staticKeyword());
        this.visit(node.variableDeclarator());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitThrowStatement = function (node) {
        this.visit(node.throwKeyword());
        this.visit(node.expression());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitReturnStatement = function (node) {
        this.visit(node.returnKeyword());
        this.visit(node.expression());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitObjectCreationExpression = function (node) {
        this.visit(node.newKeyword());
        this.visit(node.expression());
        this.visit(node.argumentList());
    };
    SyntaxWalker.prototype.visitSwitchStatement = function (node) {
        this.visit(node.switchKeyword());
        this.visit(node.openParenToken());
        this.visit(node.expression());
        this.visit(node.closeParenToken());
        this.visit(node.openBraceToken());
        this.visit(node.caseClauses());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitCaseSwitchClause = function (node) {
        this.visit(node.caseKeyword());
        this.visit(node.expression());
        this.visit(node.colonToken());
        this.visit(node.statements());
    };
    SyntaxWalker.prototype.visitDefaultSwitchClause = function (node) {
        this.visit(node.defaultKeyword());
        this.visit(node.colonToken());
        this.visit(node.statements());
    };
    SyntaxWalker.prototype.visitBreakStatement = function (node) {
        this.visit(node.breakKeyword());
        this.visit(node.identifier());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitContinueStatement = function (node) {
        this.visit(node.continueKeyword());
        this.visit(node.identifier());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitForStatement = function (node) {
        this.visit(node.forKeyword());
        this.visit(node.openParenToken());
        this.visit(node.variableDeclaration());
        this.visit(node.initializer());
        this.visit(node.firstSemicolonToken());
        this.visit(node.condition());
        this.visit(node.secondSemicolonToken());
        this.visit(node.incrementor());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    };
    SyntaxWalker.prototype.visitForInStatement = function (node) {
        this.visit(node.forKeyword());
        this.visit(node.openParenToken());
        this.visit(node.variableDeclaration());
        this.visit(node.left());
        this.visit(node.inKeyword());
        this.visit(node.expression());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    };
    SyntaxWalker.prototype.visitWhileStatement = function (node) {
        this.visit(node.whileKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    };
    SyntaxWalker.prototype.visitWithStatement = function (node) {
        this.visit(node.withKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.statement());
    };
    SyntaxWalker.prototype.visitEnumDeclaration = function (node) {
        this.visit(node.exportKeyword());
        this.visit(node.enumKeyword());
        this.visit(node.identifier());
        this.visit(node.openBraceToken());
        this.visit(node.variableDeclarators());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitCastExpression = function (node) {
        this.visit(node.lessThanToken());
        this.visit(node.type());
        this.visit(node.greaterThanToken());
        this.visit(node.expression());
    };
    SyntaxWalker.prototype.visitObjectLiteralExpression = function (node) {
        this.visit(node.openBraceToken());
        this.visit(node.propertyAssignments());
        this.visit(node.closeBraceToken());
    };
    SyntaxWalker.prototype.visitSimplePropertyAssignment = function (node) {
        this.visit(node.propertyName());
        this.visit(node.colonToken());
        this.visit(node.expression());
    };
    SyntaxWalker.prototype.visitGetAccessorPropertyAssignment = function (node) {
        this.visit(node.getKeyword());
        this.visit(node.propertyName());
        this.visit(node.openParenToken());
        this.visit(node.closeParenToken());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitSetAccessorPropertyAssignment = function (node) {
        this.visit(node.setKeyword());
        this.visit(node.propertyName());
        this.visit(node.openParenToken());
        this.visit(node.parameterName());
        this.visit(node.closeParenToken());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitFunctionExpression = function (node) {
        this.visit(node.functionKeyword());
        this.visit(node.identifier());
        this.visit(node.callSignature());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitEmptyStatement = function (node) {
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitSuperExpression = function (node) {
        this.visit(node.superKeyword());
    };
    SyntaxWalker.prototype.visitTryStatement = function (node) {
        this.visit(node.tryKeyword());
        this.visit(node.block());
        this.visit(node.catchClause());
        this.visit(node.finallyClause());
    };
    SyntaxWalker.prototype.visitCatchClause = function (node) {
        this.visit(node.catchKeyword());
        this.visit(node.openParenToken());
        this.visit(node.identifier());
        this.visit(node.closeParenToken());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitFinallyClause = function (node) {
        this.visit(node.finallyKeyword());
        this.visit(node.block());
    };
    SyntaxWalker.prototype.visitLabeledStatement = function (node) {
        this.visit(node.identifier());
        this.visit(node.colonToken());
        this.visit(node.statement());
    };
    SyntaxWalker.prototype.visitDoStatement = function (node) {
        this.visit(node.doKeyword());
        this.visit(node.statement());
        this.visit(node.whileKeyword());
        this.visit(node.openParenToken());
        this.visit(node.condition());
        this.visit(node.closeParenToken());
        this.visit(node.semicolonToken());
    };
    SyntaxWalker.prototype.visitTypeOfExpression = function (node) {
        this.visit(node.typeOfKeyword());
        this.visit(node.expression());
    };
    SyntaxWalker.prototype.visitDeleteExpression = function (node) {
        this.visit(node.deleteKeyword());
        this.visit(node.expression());
    };
    SyntaxWalker.prototype.visitVoidExpression = function (node) {
        this.visit(node.voidKeyword());
        this.visit(node.expression());
    };
    SyntaxWalker.prototype.visitDebuggerStatement = function (node) {
        this.visit(node.debuggerKeyword());
        this.visit(node.semicolonToken());
    };
    return SyntaxWalker;
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
        var start = 4294967295 /* MaxInteger */ ;
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
        return this._length === 0;
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
        if(c === 10 /* newLine */ ) {
            if(index > 0 && text.charCodeAt(index - 1) === 13 /* carriageReturn */ ) {
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
        return c === 10 /* newLine */  || c === 13 /* carriageReturn */  || c === 133 /* nextLine */  || c === 8232 /* lineSeparator */  || c === 8233 /* paragraphSeparator */ ;
    }
    TextUtilities.getLengthOfLineBreak = function getLengthOfLineBreak(text, index) {
        var c = text.charCodeAt(index);
        if(c > 13 /* carriageReturn */  && c <= 127) {
            return 0;
        }
        return this.getLengthOfLineBreakSlow(text, index, c);
    }
    TextUtilities.getLengthOfLineBreakSlow = function getLengthOfLineBreakSlow(text, index, c) {
        if(c === 13 /* carriageReturn */ ) {
            var next = index + 1;
            return (next < text.length()) && 10 /* newLine */  === text.charCodeAt(next) ? 2 : 1;
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
        if(languageVersion === 0 /* EcmaScript3 */ ) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES3IdentifierStart);
        } else {
            if(languageVersion === 1 /* EcmaScript5 */ ) {
                return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES5IdentifierStart);
            } else {
                throw Errors.argumentOutOfRange("languageVersion");
            }
        }
    }
    Unicode.isIdentifierPart = function isIdentifierPart(code, languageVersion) {
        if(languageVersion === 0 /* EcmaScript3 */ ) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES3IdentifierPart);
        } else {
            if(languageVersion === 1 /* EcmaScript5 */ ) {
                return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES5IdentifierPart);
            } else {
                throw Errors.argumentOutOfRange("languageVersion");
            }
        }
    }
    return Unicode;
})();
var argumentChecks = true;
var definitions = [
    {
        name: 'SourceUnitSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'moduleElements',
                isList: true
            }, 
            {
                name: 'endOfFileToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ModuleElementSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ModuleReferenceSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ExternalModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            {
                name: 'moduleKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'stringLiteral',
                isToken: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            {
                name: 'moduleName',
                type: 'NameSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ImportDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'importKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'equalsToken',
                isToken: true
            }, 
            {
                name: 'moduleReference',
                type: 'ModuleReferenceSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ClassDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'classKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'extendsClause',
                type: 'ExtendsClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'implementsClause',
                type: 'ImplementsClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'classElements',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'InterfaceDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'interfaceKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'extendsClause',
                type: 'ExtendsClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'body',
                type: 'ObjectTypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ExtendsClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'extendsKeyword',
                isToken: true
            }, 
            {
                name: 'typeNames',
                isSeparatedList: true
            }, 
            
        ]
    }, 
    {
        name: 'ImplementsClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'implementsKeyword',
                isToken: true
            }, 
            {
                name: 'typeNames',
                isSeparatedList: true
            }, 
            
        ]
    }, 
    {
        name: 'ModuleDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'moduleKeyword',
                isToken: true
            }, 
            {
                name: 'moduleName',
                type: 'NameSyntax',
                isOptional: true
            }, 
            {
                name: 'stringLiteral',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'moduleElements',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'StatementSyntax',
        baseType: 'ModuleElementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'FunctionDeclarationSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'functionKeyword',
                isToken: true
            }, 
            {
                name: 'functionSignature',
                type: 'FunctionSignatureSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true,
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'VariableStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'variableDeclaration',
                type: 'VariableDeclarationSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ExpressionSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'UnaryExpressionSyntax',
        baseType: 'ExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'VariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'varKeyword',
                isToken: true
            }, 
            {
                name: 'variableDeclarators',
                isSeparatedList: true
            }, 
            
        ]
    }, 
    {
        name: 'VariableDeclaratorSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            {
                name: 'equalsValueClause',
                type: 'EqualsValueClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'EqualsValueClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'equalsToken',
                isToken: true
            }, 
            {
                name: 'value',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'PrefixUnaryExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'operatorToken',
                isToken: true,
                tokenKinds: [
                    "PlusPlusToken", 
                    "MinusMinusToken", 
                    "PlusToken", 
                    "MinusToken", 
                    "TildeToken", 
                    "ExclamationToken"
                ]
            }, 
            {
                name: 'operand',
                type: 'UnaryExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ThisExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'thisKeyword',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'LiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'literalToken',
                isToken: true,
                tokenKinds: [
                    "RegularExpressionLiteral", 
                    "StringLiteral", 
                    "NumericLiteral", 
                    "FalseKeyword", 
                    "TrueKeyword", 
                    "NullKeyword"
                ]
            }, 
            
        ]
    }, 
    {
        name: 'ArrayLiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'expressions',
                isSeparatedList: true
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'OmittedExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: []
    }, 
    {
        name: 'ParenthesizedExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'SimpleArrowFunctionExpression',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'body',
                type: 'SyntaxNode'
            }, 
            
        ]
    }, 
    {
        name: 'ParenthesizedArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'body',
                type: 'SyntaxNode'
            }, 
            
        ]
    }, 
    {
        name: 'TypeSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'NameSyntax',
        baseType: 'TypeSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'IdentifierNameSyntax',
        baseType: 'NameSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            
        ]
    }, 
    {
        name: 'QualifiedNameSyntax',
        baseType: 'NameSyntax',
        children: [
            {
                name: 'left',
                type: 'NameSyntax'
            }, 
            {
                name: 'dotToken',
                isToken: true
            }, 
            {
                name: 'right',
                type: 'IdentifierNameSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ConstructorTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'FunctionTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'equalsGreaterThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ObjectTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'typeMembers',
                isSeparatedList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ArrayTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'PredefinedTypeSyntax',
        baseType: 'TypeSyntax',
        children: [
            {
                name: 'keyword',
                isToken: true,
                tokenKinds: [
                    "AnyKeyword", 
                    "BoolKeyword", 
                    "NumberKeyword", 
                    "StringKeyword", 
                    "VoidKeyword"
                ]
            }, 
            
        ]
    }, 
    {
        name: 'TypeAnnotationSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'BlockSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'dotDotDotToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "PublicKeyword", 
                    "PrivateKeyword"
                ]
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            {
                name: 'equalsValueClause',
                type: 'EqualsValueClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'MemberAccessExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'dotToken',
                isToken: true
            }, 
            {
                name: 'identifierName',
                type: 'IdentifierNameSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'PostfixUnaryExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'operand',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'operatorToken',
                isToken: true,
                tokenKinds: [
                    "PlusPlusToken", 
                    "MinusMinusToken"
                ]
            }, 
            
        ]
    }, 
    {
        name: 'ElementAccessExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'argumentExpression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'InvocationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'argumentList',
                type: 'ArgumentListSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'arguments',
                isSeparatedList: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'BinaryExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'left',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'operatorToken',
                isToken: true,
                tokenKinds: [
                    "AsteriskToken", 
                    "SlashToken", 
                    "PercentToken", 
                    "PlusToken", 
                    "MinusToken", 
                    "LessThanLessThanToken", 
                    "GreaterThanGreaterThanToken", 
                    "GreaterThanGreaterThanGreaterThanToken", 
                    "LessThanToken", 
                    "GreaterThanToken", 
                    "LessThanEqualsToken", 
                    "GreaterThanEqualsToken", 
                    "InstanceOfKeyword", 
                    "InKeyword", 
                    "EqualsEqualsToken", 
                    "ExclamationEqualsToken", 
                    "EqualsEqualsEqualsToken", 
                    "ExclamationEqualsEqualsToken", 
                    "AmpersandToken", 
                    "CaretToken", 
                    "BarToken", 
                    "AmpersandAmpersandToken", 
                    "BarBarToken", 
                    "BarEqualsToken", 
                    "AmpersandEqualsToken", 
                    "CaretEqualsToken", 
                    "LessThanLessThanEqualsToken", 
                    "GreaterThanGreaterThanEqualsToken", 
                    "GreaterThanGreaterThanGreaterThanEqualsToken", 
                    "PlusEqualsToken", 
                    "MinusEqualsToken", 
                    "AsteriskEqualsToken", 
                    "SlashEqualsToken", 
                    "PercentEqualsToken", 
                    "EqualsToken", 
                    "CommaToken"
                ]
            }, 
            {
                name: 'right',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ConditionalExpressionSyntax',
        baseType: 'ExpressionSyntax',
        children: [
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'questionToken',
                isToken: true
            }, 
            {
                name: 'whenTrue',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'whenFalse',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'TypeMemberSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ConstructSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'FunctionSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'IndexSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'parameter',
                type: 'ParameterSyntax'
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'PropertySignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'ParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'parameters',
                isSeparatedList: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'CallSignatureSyntax',
        baseType: 'TypeMemberSyntax',
        children: [
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'ElseClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'elseKeyword',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'IfStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'ifKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            {
                name: 'elseClause',
                type: 'ElseClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'ExpressionStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ClassElementSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ConstructorDeclarationSyntax',
        baseType: 'ClassElementSyntax',
        children: [
            {
                name: 'constructorKeyword',
                isToken: true
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true,
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'MemberDeclarationSyntax',
        baseType: 'ClassElementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'MemberFunctionDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "PublicKeyword", 
                    "PrivateKeyword"
                ]
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'functionSignature',
                type: 'FunctionSignatureSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true,
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'MemberAccessorDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'GetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "PublicKeyword", 
                    "PrivateKeyword"
                ]
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'getKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'SetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "PublicKeyword", 
                    "PrivateKeyword"
                ]
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'setKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'parameterList',
                type: 'ParameterListSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'MemberDeclarationSyntax',
        children: [
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "PublicKeyword", 
                    "PrivateKeyword"
                ]
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'variableDeclarator',
                type: 'VariableDeclaratorSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ThrowStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'throwKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ReturnStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'returnKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ObjectCreationExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'argumentList',
                type: 'ArgumentListSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'SwitchStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'switchKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'caseClauses',
                isList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'SwitchClauseSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'CaseSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            {
                name: 'caseKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true
            }, 
            
        ]
    }, 
    {
        name: 'DefaultSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            {
                name: 'defaultKeyword',
                isToken: true
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true
            }, 
            
        ]
    }, 
    {
        name: 'BreakStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'breakKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'ContinueStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'continueKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'IterationStatementSyntax',
        baseType: 'StatementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'BaseForStatementSyntax',
        baseType: 'IterationStatementSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'ForStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            {
                name: 'forKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'variableDeclaration',
                type: 'VariableDeclarationSyntax',
                isOptional: true
            }, 
            {
                name: 'initializer',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'firstSemicolonToken',
                isToken: true,
                tokenKinds: [
                    "SemicolonToken"
                ]
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'secondSemicolonToken',
                isToken: true,
                tokenKinds: [
                    "SemicolonToken"
                ]
            }, 
            {
                name: 'incrementor',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ForInStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            {
                name: 'forKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'variableDeclaration',
                type: 'VariableDeclarationSyntax',
                isOptional: true
            }, 
            {
                name: 'left',
                type: 'ExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'inKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'WhileStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            {
                name: 'whileKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'WithStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'withKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'EnumDeclarationSyntax',
        baseType: 'ModuleElementSyntax',
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'enumKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'variableDeclarators',
                isSeparatedList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'CastExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'lessThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'TypeSyntax'
            }, 
            {
                name: 'greaterThanToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'UnaryExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'ObjectLiteralExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'propertyAssignments',
                isSeparatedList: true
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'PropertyAssignmentSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'SimplePropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            {
                name: 'propertyName',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken", 
                    "StringLiteral", 
                    "NumericLiteral"
                ]
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'AccessorPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'GetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            {
                name: 'getKeyword',
                isToken: true
            }, 
            {
                name: 'propertyName',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'SetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            {
                name: 'setKeyword',
                isToken: true
            }, 
            {
                name: 'propertyName',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'parameterName',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'FunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'functionKeyword',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'EmptyStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'SuperExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'superKeyword',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'TryStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'tryKeyword',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            {
                name: 'catchClause',
                type: 'CatchClauseSyntax',
                isOptional: true
            }, 
            {
                name: 'finallyClause',
                type: 'FinallyClauseSyntax',
                isOptional: true
            }, 
            
        ]
    }, 
    {
        name: 'CatchClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'catchKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'FinallyClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'finallyKeyword',
                isToken: true
            }, 
            {
                name: 'block',
                type: 'BlockSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'LabeledStatement',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    "IdentifierNameToken"
                ]
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'DoStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            {
                name: 'doKeyword',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'StatementSyntax'
            }, 
            {
                name: 'whileKeyword',
                isToken: true
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'condition',
                type: 'ExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    {
        name: 'TypeOfExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'typeOfKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'DeleteExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'deleteKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'VoidExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'voidKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'ExpressionSyntax'
            }, 
            
        ]
    }, 
    {
        name: 'DebuggerStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'debuggerKeyword',
                isToken: true
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }, 
            
        ]
    }, 
    
];
function endsWith(string, value) {
    return string.substring(string.length - value.length, string.length) === value;
}
function getNameWithoutSuffix(definition) {
    var name = definition.name;
    if(endsWith(name, "Syntax")) {
        return name.substring(0, name.length - "Syntax".length);
    }
    return name;
}
function getType(child) {
    if(child.isToken) {
        return "ISyntaxToken";
    } else {
        if(child.isSeparatedList) {
            return "ISeparatedSyntaxList";
        } else {
            if(child.isList) {
                return "ISyntaxList";
            } else {
                return child.type;
            }
        }
    }
}
var hasKind = false;
function getSafeName(child) {
    if(child.name === "arguments") {
        return "_" + child.name;
    }
    return child.name;
}
function getPropertyAccess(child) {
    return "this._" + child.name;
}
function generateProperties(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += "    private _" + child.name + ": " + getType(child) + ";\r\n";
        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }
    if(definition.children.length > 0) {
        result += "\r\n";
    }
    return result;
}
function generateNullChecks(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        if(!child.isOptional && !child.isToken) {
            result += "        if (" + child.name + " === null) { throw Errors.argumentNull('" + child.name + "'); }\r\n";
        }
    }
    return result;
}
function generateIfKindCheck(child, tokenKinds, indent) {
    var result = "";
    result += indent + "        if (";
    for(var j = 0; j < tokenKinds.length; j++) {
        var tokenKind = tokenKinds[j];
        var isKeyword = tokenKind.indexOf("Keyword") >= 0;
        if(j > 0) {
            result += " && ";
        }
        if(isKeyword) {
            result += child.name + ".keywordKind() !== SyntaxKind." + tokenKind;
        } else {
            result += child.name + ".kind() !== SyntaxKind." + tokenKind;
        }
    }
    result += ") { throw Errors.argument('" + child.name + "'); }\r\n";
    return result;
}
function generateSwitchCase(tokenKind, indent) {
    return indent + "            case SyntaxKind." + tokenKind + ":\r\n";
}
function generateBreakStatement(indent) {
    return indent + "                break;\r\n";
}
function generateSwitchCases(tokenKinds, indent) {
    var result = "";
    for(var j = 0; j < tokenKinds.length; j++) {
        var tokenKind = tokenKinds[j];
        result += generateSwitchCase(tokenKind, indent);
    }
    if(tokenKinds.length > 0) {
        result += generateBreakStatement(indent);
    }
    return result;
}
function generateDefaultCase(child, indent) {
    var result = "";
    result += indent + "            default:\r\n";
    result += indent + "                throw Errors.argument('" + child.name + "');";
    return result;
}
function generateSwitchKindCheck(child, tokenKinds, indent) {
    if(tokenKinds.length === 0) {
        return "";
    }
    var result = "";
    var keywords = tokenKinds.filter(function (v, i, a) {
        return v.indexOf("Keyword") >= 0;
    }, null);
    var tokens = tokenKinds.filter(function (v, i, a) {
        return v.indexOf("Keyword") == 0;
    }, null);
    if(tokens.length === 0) {
        if(keywords.length <= 2) {
            result += generateIfKindCheck(child, keywords, indent);
        } else {
            result += indent + "        switch (" + child.name + ".keywordKind()) {\r\n";
            result += generateSwitchCases(keywords, indent);
        }
    } else {
        result += indent + "        switch (" + child.name + ".kind()) {\r\n";
        result += generateSwitchCases(tokens, indent);
        if(keywords.length > 0) {
            result += generateSwitchCase("IdentifierNameToken", indent);
            result += generateSwitchKindCheck(child, keywords, indent + "    ");
            result += generateBreakStatement(indent);
        }
    }
    result += generateDefaultCase(child, indent);
    result += indent + "        }\r\n";
    return result;
}
function generateKindCheck(child) {
    var indent = "";
    var result = "";
    if(child.isOptional) {
        indent = "    ";
        result += "        if (" + child.name + " !== null) {\r\n";
    }
    var tokenKinds = child.tokenKinds ? child.tokenKinds : [
        child.name.substr(0, 1).toUpperCase() + child.name.substr(1)
    ];
    if(true) {
        result += generateIfKindCheck(child, tokenKinds, indent);
    } else {
        result += generateSwitchKindCheck(child, tokenKinds, indent);
    }
    if(child.isOptional) {
        result += "        }\r\n";
    }
    return result;
}
function generateKindChecks(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        if(child.isToken) {
            result += generateKindCheck(child);
        }
    }
    return result;
}
function generateArgumentChecks(definition) {
    var result = "";
    if(argumentChecks) {
        result += generateNullChecks(definition);
        result += generateKindChecks(definition);
        if(definition.children.length > 0) {
            result += "\r\n";
        }
    }
    return result;
}
function generateConstructor(definition) {
    var result = "";
    result += "    constructor(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += child.name + ": " + getType(child);
        if(i < definition.children.length - 2) {
            result += ",\r\n                ";
        }
    }
    result += ") {\r\n";
    result += "        super();\r\n";
    if(definition.children.length > 0) {
        result += "\r\n";
    }
    result += generateArgumentChecks(definition);
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += "        " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
    }
    result += "    }\r\n";
    return result;
}
function generateAcceptMethods(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): void {\r\n";
        result += "        visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
        result += "\r\n";
        result += "    public accept1(visitor: ISyntaxVisitor1): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateKindMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        if(!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateIsMissingMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public isMissing(): bool {\r\n";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child === undefined) {
                continue;
            }
            if(getType(child) === "SyntaxKind") {
                continue;
            }
            if(child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null && !" + getPropertyAccess(child) + ".isMissing()) { return false; }\r\n";
            } else {
                result += "        if (!" + getPropertyAccess(child) + ".isMissing()) { return false; }\r\n";
            }
        }
        result += "        return true;\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateAccessors(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += "\r\n";
        result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
        result += "        return " + getPropertyAccess(child) + ";\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateUpdateMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "";
    result += "\r\n";
    result += "    public update(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child === undefined) {
            continue;
        }
        result += getSafeName(child) + ": " + getType(child);
        if(i < definition.children.length - 2) {
            result += ",\r\n                  ";
        }
    }
    result += ") {\r\n";
    if(definition.children.length === 0) {
        result += "        return this;\r\n";
    } else {
        result += "        if (";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child === undefined) {
                continue;
            }
            if(i !== 0) {
                result += " && ";
            }
            result += getPropertyAccess(child) + " === " + getSafeName(child);
        }
        result += ") {\r\n";
        result += "            return this;\r\n";
        result += "        }\r\n\r\n";
        result += "        return new " + definition.name + "(";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child === undefined) {
                continue;
            }
            if(i !== 0) {
                result += ", ";
            }
            result += getSafeName(child);
        }
        result += ");\r\n";
    }
    result += "    }\r\n";
    return result;
}
function generateNode(definition) {
    var result = "class " + definition.name + " extends " + definition.baseType + " {\r\n";
    hasKind = false;
    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateIsMissingMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);
    result += "}";
    return result;
}
function generateNodes() {
    var result = "///<reference path='References.ts' />";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(definition === undefined) {
            continue;
        }
        result += "\r\n\r\n";
        result += generateNode(definition);
    }
    return result;
}
function generateRewriter() {
    var result = "";
    result += "///<reference path='References.ts' />\r\n" + "\r\n" + "class SyntaxRewriter implements ISyntaxVisitor1 {\r\n" + "    public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" + "        return token;\r\n" + "    }\r\n" + "\r\n" + "    private visitNode(node: SyntaxNode): SyntaxNode {\r\n" + "        return node === null ? null : node.accept1(this);\r\n" + "    }\r\n" + "\r\n" + "    private visitList(list: ISyntaxList): ISyntaxList {\r\n" + "        var newItems: SyntaxNode[] = null;\r\n" + "\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "            var item = list.syntaxNodeAt(i);\r\n" + "            var newItem = <SyntaxNode>item.accept1(this);\r\n" + "\r\n" + "            if (item !== newItem && newItems === null) {\r\n" + "                newItems = [];\r\n" + "                for (var j = 0; j < i; j++) {\r\n" + "                    newItems.push(list.syntaxNodeAt(j));\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            if (newItems) {\r\n" + "                newItems.push(newItem);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        Debug.assert(newItems === null || newItems.length === list.count());\r\n" + "        return newItems === null ? list : SyntaxList.create(newItems);\r\n" + "    }\r\n" + "\r\n" + "    private visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" + "        var newItems: any[] = null;\r\n" + "\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "            var item = list.itemAt(i);\r\n" + "            var newItem = item.isToken() ? <ISyntaxElement>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" + "\r\n" + "            if (item !== newItem && newItems === null) {\r\n" + "                newItems = [];\r\n" + "                for (var j = 0; j < i; j++) {\r\n" + "                    newItems.push(list.itemAt(j));\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            if (newItems) {\r\n" + "                newItems.push(newItem);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        Debug.assert(newItems === null || newItems.length === list.count());\r\n" + "        return newItems === null ? list : SeparatedSyntaxList.create(newItems);\r\n" + "    }\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(definition === undefined) {
            continue;
        }
        if(definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "    public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
        result += "        return node.update(\r\n";
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            if(child === undefined) {
                continue;
            }
            result += "            ";
            if(child.isOptional && child.isToken) {
                result += "node." + child.name + "() === null ? null : ";
            }
            if(child.isToken) {
                result += "this.visitToken(node." + child.name + "())";
            } else {
                if(child.isList) {
                    result += "this.visitList(node." + child.name + "())";
                } else {
                    if(child.isSeparatedList) {
                        result += "this.visitSeparatedList(node." + child.name + "())";
                    } else {
                        if(child.type === "SyntaxKind") {
                            result += "node.kind()";
                        } else {
                            result += "<" + child.type + ">this.visitNode(node." + child.name + "())";
                        }
                    }
                }
            }
            if(j < definition.children.length - 2) {
                result += ",\r\n";
            }
        }
        result += ");\r\n";
        result += "    }\r\n";
    }
    result += "}";
    return result;
}
var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxNodes.ts", syntaxNodes, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxRewriter.ts", rewriter, true);
