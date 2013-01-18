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
            DiagnosticMessages.codeToFormatString[1 /* Unexpected_character_0 */ ] = "Unexpected character '{0}'.";
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
            readFile: function (path, charSet) {
                if (typeof charSet === "undefined") { charSet = 'x-ansi'; }
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
                            streamObj.Charset = charSet;
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
        NormalSeparatedSyntaxList.prototype.toJSON = function (key) {
            return this.nodes;
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
    SlidingWindow.prototype.fetchMoreItems = function (sourceIndex, window, destinationIndex, spaceAvailable) {
        throw Errors.notYetImplemented();
    };
    SlidingWindow.prototype.addMoreItemsToWindow = function () {
        if(this.sourceLength >= 0 && this.absoluteIndex() >= this.sourceLength) {
            return false;
        }
        if(this.windowCount >= this.window.length) {
            this.tryShiftOrGrowTokenWindow();
        }
        var spaceAvailable = this.window.length - this.windowCount;
        var amountFetched = this.fetchMoreItems(this.windowAbsoluteStartIndex + this.windowCount, this.window, this.windowCount, spaceAvailable);
        this.windowCount += amountFetched;
        return true;
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
    SlidingWindow.prototype.currentItem = function () {
        if(this.currentRelativeItemIndex >= this.windowCount) {
            if(!this.addMoreItemsToWindow()) {
                return this.defaultValue;
            }
        }
        return this.window[this.currentRelativeItemIndex];
    };
    SlidingWindow.prototype.peekItemN = function (n) {
        while(this.currentRelativeItemIndex + n >= this.windowCount) {
            if(!this.addMoreItemsToWindow()) {
                return this.defaultValue;
            }
        }
        return this.window[this.currentRelativeItemIndex + n];
    };
    SlidingWindow.prototype.moveToNextItem = function () {
        this.currentRelativeItemIndex++;
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
    Parser.prototype.fetchMoreItems = function (sourceIndex, window, destinationIndex, spaceAvailable) {
        window[destinationIndex] = this.scanner.scan(this.tokenDiagnostics);
        return 1;
    };
    Parser.prototype.currentToken = function () {
        var result = this._currentToken;
        if(result === null) {
            result = this.currentItem();
            this._currentToken = result;
        }
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
        if(token.kind === 114 /* EndOfFileToken */ ) {
            return true;
        }
        if(token.kind === 64 /* CloseBraceToken */ ) {
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
        if(token.kind === 71 /* SemicolonToken */ ) {
            return true;
        }
        return this.canEatAutomaticSemicolon(allowWithoutNewline);
    };
    Parser.prototype.eatExplicitOrAutomaticSemicolon = function (allowWithoutNewline) {
        var token = this.currentToken();
        if(token.kind === 71 /* SemicolonToken */ ) {
            return this.eatToken(71 /* SemicolonToken */ );
        }
        if(this.canEatAutomaticSemicolon(allowWithoutNewline)) {
            var semicolonToken = SyntaxTokenFactory.createEmptyToken(this.previousToken.end(), 71 /* SemicolonToken */ , 0 /* None */ );
            if(!this.options.allowAutomaticSemicolonInsertion()) {
                this.addDiagnostic(new SyntaxDiagnostic(this.previousToken.end(), 0, 7 /* Automatic_semicolon_insertion_not_allowed */ , null));
            }
            return semicolonToken;
        }
        return this.eatToken(71 /* SemicolonToken */ );
    };
    Parser.prototype.eatToken = function (kind) {
        var token = this.currentToken();
        if(token.kind === kind) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(kind, 0 /* None */ , token);
    };
    Parser.prototype.tryEatToken = function (kind) {
        if(this.currentToken().kind === kind) {
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
        return this.createMissingToken(5 /* IdentifierNameToken */ , kind, token);
    };
    Parser.prototype.eatIdentifierNameToken = function () {
        var token = this.currentToken();
        if(token.kind === 5 /* IdentifierNameToken */ ) {
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(5 /* IdentifierNameToken */ , 0 /* None */ , token);
    };
    Parser.prototype.eatIdentifierToken = function () {
        var token = this.currentToken();
        if(token.kind === 5 /* IdentifierNameToken */ ) {
            if(this.isKeyword(token.keywordKind())) {
                return this.createMissingToken(5 /* IdentifierNameToken */ , 0 /* None */ , token);
            }
            this.moveToNextToken();
            return token;
        }
        return this.createMissingToken(5 /* IdentifierNameToken */ , 0 /* None */ , token);
    };
    Parser.prototype.isIdentifier = function (token) {
        return token.kind === 5 /* IdentifierNameToken */  && !this.isKeyword(token.keywordKind());
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
        return SyntaxTokenFactory.createEmptyToken(diagnostic.position(), expectedKind, expectedKeywordKind);
    };
    Parser.prototype.getExpectedTokenDiagnostic = function (expectedKind, expectedKeywordKind, actual) {
        var token = this.currentToken();
        if(expectedKind === 5 /* IdentifierNameToken */ ) {
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
            case 165 /* CommaExpression */ : {
                return 1 /* CommaExpressionPrecedence */ ;

            }
            case 166 /* AssignmentExpression */ :
            case 167 /* AddAssignmentExpression */ :
            case 168 /* SubtractAssignmentExpression */ :
            case 169 /* MultiplyAssignmentExpression */ :
            case 170 /* DivideAssignmentExpression */ :
            case 171 /* ModuloAssignmentExpression */ :
            case 172 /* AndAssignmentExpression */ :
            case 173 /* ExclusiveOrAssignmentExpression */ :
            case 174 /* OrAssignmentExpression */ :
            case 175 /* LeftShiftAssignmentExpression */ :
            case 176 /* SignedRightShiftAssignmentExpression */ :
            case 177 /* UnsignedRightShiftAssignmentExpression */ : {
                return 2 /* AssignmentExpressionPrecedence */ ;

            }
            case 178 /* ConditionalExpression */ : {
                return 3 /* ConditionalExpressionPrecedence */ ;

            }
            case 179 /* LogicalOrExpression */ : {
                return 5 /* LogicalOrExpressionPrecedence */ ;

            }
            case 180 /* LogicalAndExpression */ : {
                return 6 /* LogicalAndExpressionPrecedence */ ;

            }
            case 181 /* BitwiseOrExpression */ : {
                return 7 /* BitwiseOrExpressionPrecedence */ ;

            }
            case 182 /* BitwiseExclusiveOrExpression */ : {
                return 8 /* BitwiseExclusiveOrExpressionPrecedence */ ;

            }
            case 183 /* BitwiseAndExpression */ : {
                return 9 /* BitwiseAndExpressionPrecedence */ ;

            }
            case 184 /* EqualsWithTypeConversionExpression */ :
            case 185 /* NotEqualsWithTypeConversionExpression */ :
            case 186 /* EqualsExpression */ :
            case 187 /* NotEqualsExpression */ : {
                return 10 /* EqualityExpressionPrecedence */ ;

            }
            case 188 /* LessThanExpression */ :
            case 189 /* GreaterThanExpression */ :
            case 190 /* LessThanOrEqualExpression */ :
            case 191 /* GreaterThanOrEqualExpression */ :
            case 192 /* InstanceOfExpression */ :
            case 193 /* InExpression */ : {
                return 11 /* RelationalExpressionPrecedence */ ;

            }
            case 194 /* LeftShiftExpression */ :
            case 195 /* SignedRightShiftExpression */ :
            case 196 /* UnsignedRightShiftExpression */ : {
                return 12 /* ShiftExpressionPrecdence */ ;

            }
            case 200 /* AddExpression */ :
            case 201 /* SubtractExpression */ : {
                return 13 /* AdditiveExpressionPrecedence */ ;

            }
            case 197 /* MultiplyExpression */ :
            case 198 /* DivideExpression */ :
            case 199 /* ModuloExpression */ : {
                return 14 /* MultiplicativeExpressionPrecedence */ ;

            }
            case 151 /* PlusExpression */ :
            case 152 /* NegateExpression */ :
            case 153 /* BitwiseNotExpression */ :
            case 154 /* LogicalNotExpression */ :
            case 157 /* DeleteExpression */ :
            case 158 /* TypeOfExpression */ :
            case 159 /* VoidExpression */ :
            case 155 /* PreIncrementExpression */ :
            case 156 /* PreDecrementExpression */ : {
                return 15 /* UnaryExpressionPrecedence */ ;

            }
        }
        throw Errors.invalidOperation();
    }
    Parser.isDirectivePrologueElement = function isDirectivePrologueElement(node) {
        if(node.kind() === 136 /* ExpressionStatement */ ) {
            var expressionStatement = node;
            var expression = expressionStatement.expression();
            if(expression.kind() === 164 /* StringLiteralExpression */ ) {
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
        return this.currentToken().keywordKind() === 43 /* ImportKeyword */  && this.peekTokenN(1).kind === 5 /* IdentifierNameToken */  && this.peekTokenN(2).kind === 100 /* EqualsToken */ ;
    };
    Parser.prototype.parseImportDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === 43 /* ImportKeyword */ );
        var importKeyword = this.eatKeyword(43 /* ImportKeyword */ );
        var identifier = this.eatIdentifierToken();
        var equalsToken = this.eatToken(100 /* EqualsToken */ );
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
        return this.currentToken().keywordKind() === 59 /* ModuleKeyword */  && this.peekTokenN(1).kind === 65 /* OpenParenToken */ ;
    };
    Parser.prototype.parseExternalModuleReference = function () {
        Debug.assert(this.isExternalModuleReference());
        var moduleKeyword = this.eatKeyword(59 /* ModuleKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var stringLiteral = this.eatToken(8 /* StringLiteral */ );
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken);
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
        var isIdentifier = this.currentToken().kind === 5 /* IdentifierNameToken */ ;
        var identifier = this.eatIdentifierToken();
        var identifierName = new IdentifierNameSyntax(identifier);
        var current = identifierName;
        while(isIdentifier && this.currentToken().kind === 69 /* DotToken */ ) {
            var dotToken = this.eatToken(69 /* DotToken */ );
            isIdentifier = this.currentToken().kind === 5 /* IdentifierNameToken */ ;
            identifier = this.eatIdentifierToken();
            identifierName = new IdentifierNameSyntax(identifier);
            current = new QualifiedNameSyntax(current, dotToken, identifierName);
        }
        return current;
    };
    Parser.prototype.isEnumDeclaration = function () {
        if(this.currentToken().keywordKind() === 41 /* ExportKeyword */  && this.peekTokenN(1).keywordKind() === 40 /* EnumKeyword */ ) {
            return true;
        }
        return this.currentToken().keywordKind() === 40 /* EnumKeyword */  && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseEnumDeclaration = function () {
        Debug.assert(this.isEnumDeclaration());
        var exportKeyword = this.tryEatKeyword(41 /* ExportKeyword */ );
        var enumKeyword = this.eatKeyword(40 /* EnumKeyword */ );
        var identifier = this.eatIdentifierToken();
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var variableDeclarators = SeparatedSyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            variableDeclarators = this.parseSeparatedSyntaxList(128 /* EnumDeclaration_VariableDeclarators */ );
        }
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken);
    };
    Parser.prototype.isClassDeclaration = function () {
        var token0 = this.currentToken();
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 41 /* ExportKeyword */  && token1.keywordKind() === 38 /* ClassKeyword */ ) {
            return true;
        }
        if(token0.keywordKind() === 57 /* DeclareKeyword */  && token1.keywordKind() === 38 /* ClassKeyword */ ) {
            return true;
        }
        return token0.keywordKind() === 38 /* ClassKeyword */  && this.isIdentifier(token1);
    };
    Parser.prototype.parseClassDeclaration = function () {
        Debug.assert(this.isClassDeclaration());
        var exportKeyword = this.tryEatKeyword(41 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(57 /* DeclareKeyword */ );
        var classKeyword = this.eatKeyword(38 /* ClassKeyword */ );
        var identifier = this.eatIdentifierToken();
        var extendsClause = null;
        if(this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }
        var implementsClause = null;
        if(this.isImplementsClause()) {
            implementsClause = this.parseImplementsClause();
        }
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var classElements = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            classElements = this.parseSyntaxList(2 /* ClassDeclaration_ClassElements */ );
        }
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken);
    };
    Parser.prototype.isConstructorDeclaration = function () {
        return this.currentToken().keywordKind() === 56 /* ConstructorKeyword */ ;
    };
    Parser.prototype.isMemberAccessorDeclaration = function () {
        var rewindPoint = this.getRewindPoint();
        try  {
            if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() === 52 /* StaticKeyword */ ) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() !== 58 /* GetKeyword */  && this.currentToken().keywordKind() !== 61 /* SetKeyword */ ) {
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
        if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = this.tryEatKeyword(52 /* StaticKeyword */ );
        if(this.currentToken().keywordKind() === 58 /* GetKeyword */ ) {
            return this.parseGetMemberAccessorDeclaration(publicOrPrivateKeyword, staticKeyword);
        } else {
            if(this.currentToken().keywordKind() === 61 /* SetKeyword */ ) {
                return this.parseSetMemberAccessorDeclaration(publicOrPrivateKeyword, staticKeyword);
            } else {
                throw Errors.invalidOperation();
            }
        }
    };
    Parser.prototype.parseGetMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword) {
        Debug.assert(this.currentToken().keywordKind() === 58 /* GetKeyword */ );
        var getKeyword = this.eatKeyword(58 /* GetKeyword */ );
        var identifier = this.eatIdentifierToken();
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        var block = this.parseBlock();
        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block);
    };
    Parser.prototype.parseSetMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword) {
        Debug.assert(this.currentToken().keywordKind() === 61 /* SetKeyword */ );
        var setKeyword = this.eatKeyword(61 /* SetKeyword */ );
        var identifier = this.eatIdentifierToken();
        var parameterList = this.parseParameterList();
        var block = this.parseBlock();
        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block);
    };
    Parser.prototype.isMemberVariableDeclaration = function () {
        if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
            return true;
        }
        if(this.currentToken().keywordKind() === 52 /* StaticKeyword */ ) {
            return true;
        }
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.isClassElement = function () {
        return this.isConstructorDeclaration() || this.isMemberFunctionDeclaration() || this.isMemberAccessorDeclaration() || this.isMemberVariableDeclaration();
    };
    Parser.prototype.parseConstructorDeclaration = function () {
        Debug.assert(this.isConstructorDeclaration());
        var constructorKeyword = this.eatKeyword(56 /* ConstructorKeyword */ );
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
            if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
                this.eatAnyToken();
            }
            if(this.currentToken().keywordKind() === 52 /* StaticKeyword */ ) {
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
        if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = this.tryEatKeyword(52 /* StaticKeyword */ );
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
        if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
            publicOrPrivateKeyword = this.eatAnyToken();
        }
        var staticKeyword = this.tryEatKeyword(52 /* StaticKeyword */ );
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
        if(token0.keywordKind() === 21 /* FunctionKeyword */ ) {
            return true;
        }
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 41 /* ExportKeyword */  && token1.keywordKind() === 21 /* FunctionKeyword */ ) {
            return true;
        }
        return token0.keywordKind() === 57 /* DeclareKeyword */  && token1.keywordKind() === 21 /* FunctionKeyword */ ;
    };
    Parser.prototype.parseFunctionDeclaration = function () {
        Debug.assert(this.isFunctionDeclaration());
        var exportKeyword = this.tryEatKeyword(41 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(57 /* DeclareKeyword */ );
        var functionKeyword = this.eatKeyword(21 /* FunctionKeyword */ );
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
        if(token0.keywordKind() === 41 /* ExportKeyword */  && token1.keywordKind() === 59 /* ModuleKeyword */ ) {
            return true;
        }
        if(token0.keywordKind() === 57 /* DeclareKeyword */  && token1.keywordKind() === 59 /* ModuleKeyword */ ) {
            return true;
        }
        if(token0.keywordKind() === 59 /* ModuleKeyword */ ) {
            if(token1.kind === 63 /* OpenBraceToken */ ) {
                return true;
            }
            if(token1.kind === 5 /* IdentifierNameToken */ ) {
                var token2 = this.peekTokenN(2);
                if(token2.kind === 63 /* OpenBraceToken */ ) {
                    return true;
                }
                if(token2.kind === 69 /* DotToken */ ) {
                    return true;
                }
            }
        }
        return false;
    };
    Parser.prototype.parseModuleDeclaration = function () {
        Debug.assert(this.isModuleDeclaration());
        var exportKeyword = this.tryEatKeyword(41 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(57 /* DeclareKeyword */ );
        var moduleKeyword = this.eatKeyword(59 /* ModuleKeyword */ );
        var moduleName = null;
        var stringLiteral = null;
        if(this.isName()) {
            moduleName = this.parseName();
        } else {
            if(this.currentToken().kind === 8 /* StringLiteral */ ) {
                stringLiteral = this.eatToken(8 /* StringLiteral */ );
            }
        }
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var moduleElements = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            moduleElements = this.parseSyntaxList(4 /* ModuleDeclaration_ModuleElements */ );
        }
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken);
    };
    Parser.prototype.isInterfaceDeclaration = function () {
        if(this.currentToken().keywordKind() === 41 /* ExportKeyword */  && this.peekTokenN(1).keywordKind() === 46 /* InterfaceKeyword */ ) {
            return true;
        }
        return this.currentToken().keywordKind() === 46 /* InterfaceKeyword */  && this.isIdentifier(this.peekTokenN(1));
    };
    Parser.prototype.parseInterfaceDeclaration = function () {
        Debug.assert(this.currentToken().keywordKind() === 41 /* ExportKeyword */  || this.currentToken().keywordKind() === 46 /* InterfaceKeyword */ );
        var exportKeyword = this.tryEatKeyword(41 /* ExportKeyword */ );
        var interfaceKeyword = this.eatKeyword(46 /* InterfaceKeyword */ );
        var identifier = this.eatIdentifierToken();
        var extendsClause = null;
        if(this.isExtendsClause()) {
            extendsClause = this.parseExtendsClause();
        }
        var objectType = this.parseObjectType();
        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, extendsClause, objectType);
    };
    Parser.prototype.parseObjectType = function () {
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var typeMembers = SeparatedSyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            typeMembers = this.parseSeparatedSyntaxList(256 /* ObjectType_TypeMembers */ );
        }
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
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
        var newKeyword = this.eatKeyword(25 /* NewKeyword */ );
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation);
    };
    Parser.prototype.parseIndexSignature = function () {
        Debug.assert(this.isIndexSignature());
        var openBracketToken = this.eatToken(67 /* OpenBracketToken */ );
        var parameter = this.parseParameter();
        var closeBracketToken = this.eatToken(68 /* CloseBracketToken */ );
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation);
    };
    Parser.prototype.parseFunctionSignature = function () {
        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(98 /* QuestionToken */ );
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation);
    };
    Parser.prototype.parsePropertySignature = function () {
        Debug.assert(this.isPropertySignature());
        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(98 /* QuestionToken */ );
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation);
    };
    Parser.prototype.isCallSignature = function () {
        return this.currentToken().kind === 65 /* OpenParenToken */ ;
    };
    Parser.prototype.isConstructSignature = function () {
        return this.currentToken().keywordKind() === 25 /* NewKeyword */ ;
    };
    Parser.prototype.isIndexSignature = function () {
        return this.currentToken().kind === 67 /* OpenBracketToken */ ;
    };
    Parser.prototype.isFunctionSignature = function () {
        if(this.isIdentifier(this.currentToken())) {
            if(this.peekTokenN(1).kind === 65 /* OpenParenToken */ ) {
                return true;
            }
            if(this.peekTokenN(1).kind === 98 /* QuestionToken */  && this.peekTokenN(2).kind === 65 /* OpenParenToken */ ) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.isPropertySignature = function () {
        return this.isIdentifier(this.currentToken());
    };
    Parser.prototype.isExtendsClause = function () {
        return this.currentToken().keywordKind() === 42 /* ExtendsKeyword */ ;
    };
    Parser.prototype.parseExtendsClause = function () {
        Debug.assert(this.isExtendsClause());
        var extendsKeyword = this.eatKeyword(42 /* ExtendsKeyword */ );
        var typeNames = this.parseSeparatedSyntaxList(512 /* ExtendsOrImplementsClause_TypeNameList */ );
        return new ExtendsClauseSyntax(extendsKeyword, typeNames);
    };
    Parser.prototype.isImplementsClause = function () {
        return this.currentToken().keywordKind() === 45 /* ImplementsKeyword */ ;
    };
    Parser.prototype.parseImplementsClause = function () {
        Debug.assert(this.isImplementsClause());
        var implementsKeyword = this.eatKeyword(45 /* ImplementsKeyword */ );
        var typeNames = this.parseSeparatedSyntaxList(512 /* ExtendsOrImplementsClause_TypeNameList */ );
        return new ImplementsClauseSyntax(implementsKeyword, typeNames);
    };
    Parser.prototype.isStatement = function (allowFunctionDeclaration) {
        switch(this.currentToken().keywordKind()) {
            case 51 /* PublicKeyword */ :
            case 49 /* PrivateKeyword */ :
            case 52 /* StaticKeyword */ : {
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
        return this.currentToken().keywordKind() === 13 /* DebuggerKeyword */ ;
    };
    Parser.prototype.parseDebuggerStatement = function () {
        Debug.assert(this.isDebuggerStatement());
        var debuggerKeyword = this.eatKeyword(13 /* DebuggerKeyword */ );
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken);
    };
    Parser.prototype.isDoStatement = function () {
        return this.currentToken().keywordKind() === 16 /* DoKeyword */ ;
    };
    Parser.prototype.parseDoStatement = function () {
        Debug.assert(this.isDoStatement());
        var doKeyword = this.eatKeyword(16 /* DoKeyword */ );
        var statement = this.parseStatement(false);
        var whileKeyword = this.eatKeyword(36 /* WhileKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(true);
        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken);
    };
    Parser.prototype.isLabeledStatement = function () {
        return this.isIdentifier(this.currentToken()) && this.peekTokenN(1).kind === 99 /* ColonToken */ ;
    };
    Parser.prototype.parseLabeledStatement = function () {
        Debug.assert(this.isLabeledStatement());
        var identifier = this.eatIdentifierToken();
        var colonToken = this.eatToken(99 /* ColonToken */ );
        var statement = this.parseStatement(false);
        return new LabeledStatement(identifier, colonToken, statement);
    };
    Parser.prototype.isTryStatement = function () {
        return this.currentToken().keywordKind() === 32 /* TryKeyword */ ;
    };
    Parser.prototype.parseTryStatement = function () {
        Debug.assert(this.isTryStatement());
        var tryKeyword = this.eatKeyword(32 /* TryKeyword */ );
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
        return this.currentToken().keywordKind() === 11 /* CatchKeyword */ ;
    };
    Parser.prototype.parseCatchClause = function () {
        Debug.assert(this.isCatchClause());
        var catchKeyword = this.eatKeyword(11 /* CatchKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var identifier = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var block = this.parseBlock();
        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block);
    };
    Parser.prototype.isFinallyClause = function () {
        return this.currentToken().keywordKind() === 19 /* FinallyKeyword */ ;
    };
    Parser.prototype.parseFinallyClause = function () {
        Debug.assert(this.isFinallyClause());
        var finallyKeyword = this.eatKeyword(19 /* FinallyKeyword */ );
        var block = this.parseBlock();
        return new FinallyClauseSyntax(finallyKeyword, block);
    };
    Parser.prototype.isWithStatement = function () {
        return this.currentToken().keywordKind() === 37 /* WithKeyword */ ;
    };
    Parser.prototype.parseWithStatement = function () {
        Debug.assert(this.isWithStatement());
        var withKeyword = this.eatKeyword(37 /* WithKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement);
    };
    Parser.prototype.isWhileStatement = function () {
        return this.currentToken().keywordKind() === 36 /* WhileKeyword */ ;
    };
    Parser.prototype.parseWhileStatement = function () {
        Debug.assert(this.isWhileStatement());
        var whileKeyword = this.eatKeyword(36 /* WhileKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement);
    };
    Parser.prototype.isEmptyStatement = function () {
        return this.currentToken().kind === 71 /* SemicolonToken */ ;
    };
    Parser.prototype.parseEmptyStatement = function () {
        Debug.assert(this.isEmptyStatement());
        var semicolonToken = this.eatToken(71 /* SemicolonToken */ );
        return new EmptyStatementSyntax(semicolonToken);
    };
    Parser.prototype.isForOrForInStatement = function () {
        return this.currentToken().keywordKind() === 20 /* ForKeyword */ ;
    };
    Parser.prototype.parseForOrForInStatement = function () {
        Debug.assert(this.isForOrForInStatement());
        var forKeyword = this.eatKeyword(20 /* ForKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var currentToken = this.currentToken();
        if(currentToken.keywordKind() === 34 /* VarKeyword */ ) {
            return this.parseForOrForInStatementWithVariableDeclaration(forKeyword, openParenToken);
        } else {
            if(currentToken.kind === 71 /* SemicolonToken */ ) {
                return this.parseForStatement(forKeyword, openParenToken);
            } else {
                return this.parseForOrForInStatementWithInitializer(forKeyword, openParenToken);
            }
        }
    };
    Parser.prototype.parseForOrForInStatementWithVariableDeclaration = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === 20 /* ForKeyword */  && openParenToken.kind === 65 /* OpenParenToken */ );
        Debug.assert(this.currentToken().keywordKind() === 34 /* VarKeyword */ );
        var variableDeclaration = this.parseVariableDeclaration(false);
        if(this.currentToken().keywordKind() === 23 /* InKeyword */ ) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
        }
        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, variableDeclaration, null);
    };
    Parser.prototype.parseForInStatementWithVariableDeclarationOrInitializer = function (forKeyword, openParenToken, variableDeclaration, initializer) {
        Debug.assert(this.currentToken().keywordKind() === 23 /* InKeyword */ );
        var inKeyword = this.eatKeyword(23 /* InKeyword */ );
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, inKeyword, expression, closeParenToken, statement);
    };
    Parser.prototype.parseForOrForInStatementWithInitializer = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === 20 /* ForKeyword */  && openParenToken.kind === 65 /* OpenParenToken */ );
        var initializer = this.parseExpression(false);
        if(this.currentToken().keywordKind() === 23 /* InKeyword */ ) {
            return this.parseForInStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        } else {
            return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
        }
    };
    Parser.prototype.parseForStatement = function (forKeyword, openParenToken) {
        Debug.assert(forKeyword.keywordKind() === 20 /* ForKeyword */  && openParenToken.kind === 65 /* OpenParenToken */ );
        var initializer = null;
        if(this.currentToken().kind !== 71 /* SemicolonToken */  && this.currentToken().kind !== 66 /* CloseParenToken */  && this.currentToken().kind !== 114 /* EndOfFileToken */ ) {
            initializer = this.parseExpression(false);
        }
        return this.parseForStatementWithVariableDeclarationOrInitializer(forKeyword, openParenToken, null, initializer);
    };
    Parser.prototype.parseForStatementWithVariableDeclarationOrInitializer = function (forKeyword, openParenToken, variableDeclaration, initializer) {
        var firstSemicolonToken = this.eatToken(71 /* SemicolonToken */ );
        var condition = null;
        if(this.currentToken().kind !== 71 /* SemicolonToken */  && this.currentToken().kind !== 66 /* CloseParenToken */  && this.currentToken().kind !== 114 /* EndOfFileToken */ ) {
            condition = this.parseExpression(true);
        }
        var secondSemicolonToken = this.eatToken(71 /* SemicolonToken */ );
        var incrementor = null;
        if(this.currentToken().kind !== 66 /* CloseParenToken */  && this.currentToken().kind !== 114 /* EndOfFileToken */ ) {
            incrementor = this.parseExpression(true);
        }
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement);
    };
    Parser.prototype.isBreakStatement = function () {
        return this.currentToken().keywordKind() === 9 /* BreakKeyword */ ;
    };
    Parser.prototype.parseBreakStatement = function () {
        Debug.assert(this.isBreakStatement());
        var breakKeyword = this.eatKeyword(9 /* BreakKeyword */ );
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
        return this.currentToken().keywordKind() === 12 /* ContinueKeyword */ ;
    };
    Parser.prototype.parseContinueStatement = function () {
        Debug.assert(this.isContinueStatement());
        var continueKeyword = this.eatKeyword(12 /* ContinueKeyword */ );
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
        return this.currentToken().keywordKind() === 28 /* SwitchKeyword */ ;
    };
    Parser.prototype.parseSwitchStatement = function () {
        Debug.assert(this.isSwitchStatement());
        var switchKeyword = this.eatKeyword(28 /* SwitchKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var switchClauses = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            switchClauses = this.parseSyntaxList(8 /* SwitchStatement_SwitchClauses */ );
        }
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken);
    };
    Parser.prototype.isCaseSwitchClause = function () {
        return this.currentToken().keywordKind() === 10 /* CaseKeyword */ ;
    };
    Parser.prototype.isDefaultSwitchClause = function () {
        return this.currentToken().keywordKind() === 14 /* DefaultKeyword */ ;
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
        var caseKeyword = this.eatKeyword(10 /* CaseKeyword */ );
        var expression = this.parseExpression(true);
        var colonToken = this.eatToken(99 /* ColonToken */ );
        var statements = this.parseSyntaxList(16 /* SwitchClause_Statements */ );
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements);
    };
    Parser.prototype.parseDefaultSwitchClause = function () {
        Debug.assert(this.isDefaultSwitchClause());
        var defaultKeyword = this.eatKeyword(14 /* DefaultKeyword */ );
        var colonToken = this.eatToken(99 /* ColonToken */ );
        var statements = this.parseSyntaxList(16 /* SwitchClause_Statements */ );
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements);
    };
    Parser.prototype.isThrowStatement = function () {
        return this.currentToken().keywordKind() === 30 /* ThrowKeyword */ ;
    };
    Parser.prototype.parseThrowStatement = function () {
        Debug.assert(this.isThrowStatement());
        var throwKeyword = this.eatKeyword(30 /* ThrowKeyword */ );
        var expression = null;
        if(this.canEatExplicitOrAutomaticSemicolon(false)) {
            var token = this.createMissingToken(5 /* IdentifierNameToken */ , 0 /* None */ , null);
            expression = new IdentifierNameSyntax(token);
        } else {
            expression = this.parseExpression(true);
        }
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken);
    };
    Parser.prototype.isReturnStatement = function () {
        return this.currentToken().keywordKind() === 27 /* ReturnKeyword */ ;
    };
    Parser.prototype.parseReturnStatement = function () {
        Debug.assert(this.isReturnStatement());
        var returnKeyword = this.eatKeyword(27 /* ReturnKeyword */ );
        var expression = null;
        if(!this.canEatExplicitOrAutomaticSemicolon(false)) {
            expression = this.parseExpression(true);
        }
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken);
    };
    Parser.prototype.isExpressionStatement = function () {
        var currentToken = this.currentToken();
        var kind = currentToken.kind;
        if(kind === 63 /* OpenBraceToken */ ) {
            return false;
        }
        var keywordKind = currentToken.keywordKind();
        if(keywordKind === 21 /* FunctionKeyword */ ) {
            return false;
        }
        return this.isExpression();
    };
    Parser.prototype.isAssignmentOrOmittedExpression = function () {
        if(this.currentToken().kind === 72 /* CommaToken */ ) {
            return true;
        }
        return this.isExpression();
    };
    Parser.prototype.parseAssignmentOrOmittedExpression = function () {
        Debug.assert(this.isAssignmentOrOmittedExpression());
        if(this.currentToken().kind === 72 /* CommaToken */ ) {
            return new OmittedExpressionSyntax();
        }
        return this.parseAssignmentExpression(true);
    };
    Parser.prototype.isExpression = function () {
        var currentToken = this.currentToken();
        var kind = currentToken.kind;
        switch(kind) {
            case 7 /* NumericLiteral */ :
            case 8 /* StringLiteral */ :
            case 6 /* RegularExpressionLiteral */ : {
                return true;

            }
            case 67 /* OpenBracketToken */ :
            case 65 /* OpenParenToken */ : {
                return true;

            }
            case 73 /* LessThanToken */ : {
                return true;

            }
            case 86 /* PlusPlusToken */ :
            case 87 /* MinusMinusToken */ :
            case 82 /* PlusToken */ :
            case 83 /* MinusToken */ :
            case 95 /* TildeToken */ :
            case 94 /* ExclamationToken */ : {
                return true;

            }
            case 63 /* OpenBraceToken */ : {
                return true;

            }
        }
        var keywordKind = currentToken.keywordKind();
        switch(keywordKind) {
            case 44 /* SuperKeyword */ :
            case 29 /* ThisKeyword */ :
            case 31 /* TrueKeyword */ :
            case 18 /* FalseKeyword */ :
            case 26 /* NullKeyword */ : {
                return true;

            }
            case 25 /* NewKeyword */ : {
                return true;

            }
            case 15 /* DeleteKeyword */ :
            case 35 /* VoidKeyword */ :
            case 33 /* TypeOfKeyword */ : {
                return true;

            }
            case 21 /* FunctionKeyword */ : {
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
        return this.currentToken().keywordKind() === 22 /* IfKeyword */ ;
    };
    Parser.prototype.parseIfStatement = function () {
        Debug.assert(this.isIfStatement());
        var ifKeyword = this.eatKeyword(22 /* IfKeyword */ );
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var condition = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var statement = this.parseStatement(false);
        var elseClause = null;
        if(this.isElseClause()) {
            elseClause = this.parseElseClause();
        }
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause);
    };
    Parser.prototype.isElseClause = function () {
        return this.currentToken().keywordKind() === 17 /* ElseKeyword */ ;
    };
    Parser.prototype.parseElseClause = function () {
        Debug.assert(this.isElseClause());
        var elseKeyword = this.eatKeyword(17 /* ElseKeyword */ );
        var statement = this.parseStatement(false);
        return new ElseClauseSyntax(elseKeyword, statement);
    };
    Parser.prototype.isVariableStatement = function () {
        var token0 = this.currentToken();
        if(token0.keywordKind() === 34 /* VarKeyword */ ) {
            return true;
        }
        var token1 = this.peekTokenN(1);
        if(token0.keywordKind() === 41 /* ExportKeyword */  && token1.keywordKind() === 34 /* VarKeyword */ ) {
            return true;
        }
        return token0.keywordKind() === 57 /* DeclareKeyword */  && token1.keywordKind() === 34 /* VarKeyword */ ;
    };
    Parser.prototype.parseVariableStatement = function () {
        Debug.assert(this.isVariableStatement());
        var exportKeyword = this.tryEatKeyword(41 /* ExportKeyword */ );
        var declareKeyword = this.tryEatKeyword(57 /* DeclareKeyword */ );
        var variableDeclaration = this.parseVariableDeclaration(true);
        var semicolonToken = this.eatExplicitOrAutomaticSemicolon(false);
        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken);
    };
    Parser.prototype.parseVariableDeclaration = function (allowIn) {
        Debug.assert(this.currentToken().keywordKind() === 34 /* VarKeyword */ );
        var varKeyword = this.eatKeyword(34 /* VarKeyword */ );
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
        return this.currentToken().kind === 100 /* EqualsToken */ ;
    };
    Parser.prototype.parseEqualsValuesClause = function (allowIn) {
        Debug.assert(this.isEqualsValueClause());
        var equalsToken = this.eatToken(100 /* EqualsToken */ );
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
        var currentTokenKind = this.currentToken().kind;
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
        var currentTokenKind = this.currentToken().kind;
        if(currentTokenKind === 98 /* QuestionToken */  && precedence <= 3 /* ConditionalExpressionPrecedence */ ) {
            var questionToken = this.eatToken(98 /* QuestionToken */ );
            var whenTrueExpression = this.parseAssignmentExpression(allowIn);
            var colon = this.eatToken(99 /* ColonToken */ );
            var whenFalseExpression = this.parseAssignmentExpression(allowIn);
            leftOperand = new ConditionalExpressionSyntax(leftOperand, questionToken, whenTrueExpression, colon, whenFalseExpression);
        }
        return leftOperand;
    };
    Parser.prototype.parseBinaryExpressions = function (precedence, allowIn, leftOperand) {
        while(true) {
            var currentTokenKind = this.currentToken().kind;
            var currentTokenKeywordKind = this.currentToken().keywordKind();
            if(currentTokenKeywordKind === 24 /* InstanceOfKeyword */  || currentTokenKeywordKind === 23 /* InKeyword */ ) {
                currentTokenKind = currentTokenKeywordKind;
            }
            if(!SyntaxFacts.isBinaryExpressionOperatorToken(currentTokenKind)) {
                break;
            }
            if(currentTokenKind === 23 /* InKeyword */  && !allowIn) {
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
        }
        return leftOperand;
    };
    Parser.prototype.isRightAssociative = function (expressionKind) {
        switch(expressionKind) {
            case 166 /* AssignmentExpression */ :
            case 167 /* AddAssignmentExpression */ :
            case 168 /* SubtractAssignmentExpression */ :
            case 169 /* MultiplyAssignmentExpression */ :
            case 170 /* DivideAssignmentExpression */ :
            case 171 /* ModuloAssignmentExpression */ :
            case 172 /* AndAssignmentExpression */ :
            case 173 /* ExclusiveOrAssignmentExpression */ :
            case 174 /* OrAssignmentExpression */ :
            case 175 /* LeftShiftAssignmentExpression */ :
            case 176 /* SignedRightShiftAssignmentExpression */ :
            case 177 /* UnsignedRightShiftAssignmentExpression */ : {
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
            var currentTokenKind = this.currentToken().kind;
            switch(currentTokenKind) {
                case 65 /* OpenParenToken */ : {
                    if(!allowInvocation) {
                        return expression;
                    }
                    expression = new InvocationExpressionSyntax(expression, this.parseArgumentList());
                    break;

                }
                case 67 /* OpenBracketToken */ : {
                    expression = this.parseElementAccessExpression(expression);
                    break;

                }
                case 86 /* PlusPlusToken */ :
                case 87 /* MinusMinusToken */ : {
                    if(this.previousToken !== null && this.previousToken.hasTrailingNewLineTrivia()) {
                        return expression;
                    }
                    expression = new PostfixUnaryExpressionSyntax(SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken(currentTokenKind), expression, this.eatAnyToken());
                    break;

                }
                case 69 /* DotToken */ : {
                    expression = new MemberAccessExpressionSyntax(expression, this.eatToken(69 /* DotToken */ ), this.parseIdentifierName());
                    break;

                }
                default: {
                    return expression;

                }
            }
        }
    };
    Parser.prototype.isArgumentList = function () {
        return this.currentToken().kind === 65 /* OpenParenToken */ ;
    };
    Parser.prototype.parseArgumentList = function () {
        Debug.assert(this.isArgumentList());
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var arguments = this.parseSeparatedSyntaxList(4096 /* ArgumentList_AssignmentExpressions */ );
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        return new ArgumentListSyntax(openParenToken, arguments, closeParenToken);
    };
    Parser.prototype.parseElementAccessExpression = function (expression) {
        Debug.assert(this.currentToken().kind === 67 /* OpenBracketToken */ );
        var openBracketToken = this.eatToken(67 /* OpenBracketToken */ );
        var argumentExpression = this.parseExpression(true);
        var closeBracketToken = this.eatToken(68 /* CloseBracketToken */ );
        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken);
    };
    Parser.prototype.parseTermWorker = function (insideObjectCreation) {
        var currentToken = this.currentToken();
        if(insideObjectCreation) {
            if(this.isType(false, false)) {
                return this.parseType(true);
            }
        }
        if(this.isIdentifier(currentToken)) {
            if(this.isSimpleArrowFunctionExpression()) {
                return this.parseSimpleArrowFunctionExpression();
            } else {
                var identifier = this.eatIdentifierToken();
                return new IdentifierNameSyntax(identifier);
            }
        }
        var currentTokenKind = currentToken.kind;
        var currentTokenKeywordKind = currentToken.keywordKind();
        switch(currentTokenKeywordKind) {
            case 29 /* ThisKeyword */ : {
                return this.parseThisExpression();

            }
            case 31 /* TrueKeyword */ :
            case 18 /* FalseKeyword */ : {
                return this.parseLiteralExpression(160 /* BooleanLiteralExpression */ );

            }
            case 26 /* NullKeyword */ : {
                return this.parseLiteralExpression(161 /* NullLiteralExpression */ );

            }
            case 25 /* NewKeyword */ : {
                return this.parseObjectCreationExpression();

            }
            case 21 /* FunctionKeyword */ : {
                return this.parseFunctionExpression();

            }
            case 44 /* SuperKeyword */ : {
                return this.parseSuperExpression();

            }
            case 33 /* TypeOfKeyword */ : {
                return this.parseTypeOfExpression();

            }
            case 15 /* DeleteKeyword */ : {
                return this.parseDeleteExpression();

            }
            case 35 /* VoidKeyword */ : {
                return this.parseVoidExpression();

            }
        }
        switch(currentTokenKind) {
            case 7 /* NumericLiteral */ : {
                return this.parseLiteralExpression(162 /* NumericLiteralExpression */ );

            }
            case 6 /* RegularExpressionLiteral */ : {
                return this.parseLiteralExpression(163 /* RegularExpressionLiteralExpression */ );

            }
            case 8 /* StringLiteral */ : {
                return this.parseLiteralExpression(164 /* StringLiteralExpression */ );

            }
            case 67 /* OpenBracketToken */ : {
                return this.parseArrayLiteralExpression();

            }
            case 63 /* OpenBraceToken */ : {
                return this.parseObjectLiteralExpression();

            }
            case 65 /* OpenParenToken */ : {
                return this.parseParenthesizedOrArrowFunctionExpression();

            }
            case 73 /* LessThanToken */ : {
                return this.parseCastExpression();

            }
        }
        return new IdentifierNameSyntax(this.eatIdentifierToken());
    };
    Parser.prototype.parseTypeOfExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 33 /* TypeOfKeyword */ );
        var typeOfKeyword = this.eatKeyword(33 /* TypeOfKeyword */ );
        var expression = this.parseUnaryExpression();
        return new TypeOfExpressionSyntax(typeOfKeyword, expression);
    };
    Parser.prototype.parseDeleteExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 15 /* DeleteKeyword */ );
        var deleteKeyword = this.eatKeyword(15 /* DeleteKeyword */ );
        var expression = this.parseUnaryExpression();
        return new DeleteExpressionSyntax(deleteKeyword, expression);
    };
    Parser.prototype.parseVoidExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 35 /* VoidKeyword */ );
        var voidKeyword = this.eatKeyword(35 /* VoidKeyword */ );
        var expression = this.parseUnaryExpression();
        return new VoidExpressionSyntax(voidKeyword, expression);
    };
    Parser.prototype.parseSuperExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 44 /* SuperKeyword */ );
        var superKeyword = this.eatKeyword(44 /* SuperKeyword */ );
        return new SuperExpressionSyntax(superKeyword);
    };
    Parser.prototype.parseFunctionExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 21 /* FunctionKeyword */ );
        var functionKeyword = this.eatKeyword(21 /* FunctionKeyword */ );
        var identifier = null;
        if(this.isIdentifier(this.currentToken())) {
            identifier = this.eatIdentifierToken();
        }
        var callSignature = this.parseCallSignature();
        var block = this.parseBlock();
        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block);
    };
    Parser.prototype.parseCastExpression = function () {
        Debug.assert(this.currentToken().kind === 73 /* LessThanToken */ );
        var lessThanToken = this.eatToken(73 /* LessThanToken */ );
        var type = this.parseType(false);
        var greaterThanToken = this.eatToken(74 /* GreaterThanToken */ );
        var expression = this.parseUnaryExpression();
        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression);
    };
    Parser.prototype.parseObjectCreationExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 25 /* NewKeyword */ );
        var newKeyword = this.eatKeyword(25 /* NewKeyword */ );
        var expression = this.parseTerm(false, true);
        var argumentList = null;
        if(this.isArgumentList()) {
            argumentList = this.parseArgumentList();
        }
        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList);
    };
    Parser.prototype.parseParenthesizedOrArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().kind === 65 /* OpenParenToken */ );
        var result = this.tryParseArrowFunctionExpression();
        if(result !== null) {
            return result;
        }
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var expression = this.parseExpression(true);
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken);
    };
    Parser.prototype.tryParseArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().kind === 65 /* OpenParenToken */ );
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
        Debug.assert(this.currentToken().kind === 65 /* OpenParenToken */ );
        var callSignature = this.parseCallSignature();
        if(requireArrow && this.currentToken().kind !== 78 /* EqualsGreaterThanToken */ ) {
            return null;
        }
        var equalsGreaterThanToken = this.eatToken(78 /* EqualsGreaterThanToken */ );
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
        return this.isIdentifier(this.currentToken()) && this.peekTokenN(1).kind === 78 /* EqualsGreaterThanToken */ ;
    };
    Parser.prototype.parseSimpleArrowFunctionExpression = function () {
        Debug.assert(this.isSimpleArrowFunctionExpression());
        var identifier = this.eatIdentifierToken();
        var equalsGreaterThanToken = this.eatToken(78 /* EqualsGreaterThanToken */ );
        var body = this.parseArrowFunctionBody();
        return new SimpleArrowFunctionExpression(identifier, equalsGreaterThanToken, body);
    };
    Parser.prototype.isBlock = function () {
        return this.currentToken().kind === 63 /* OpenBraceToken */ ;
    };
    Parser.prototype.isDefinitelyArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().kind === 65 /* OpenParenToken */ );
        var token1 = this.peekTokenN(1);
        if(token1.kind === 66 /* CloseParenToken */ ) {
            return true;
        }
        if(token1.kind === 70 /* DotDotDotToken */ ) {
            return true;
        }
        if(!this.isIdentifier(token1)) {
            return false;
        }
        var token2 = this.peekTokenN(2);
        if(token2.kind === 99 /* ColonToken */ ) {
            return true;
        }
        var token3 = this.peekTokenN(3);
        if(token2.kind === 98 /* QuestionToken */ ) {
            if(token3.kind === 99 /* ColonToken */  || token3.kind === 66 /* CloseParenToken */  || token3.kind === 72 /* CommaToken */ ) {
                return true;
            }
        }
        if(token2.kind === 66 /* CloseParenToken */ ) {
            if(token3.kind === 78 /* EqualsGreaterThanToken */ ) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.isPossiblyArrowFunctionExpression = function () {
        Debug.assert(this.currentToken().kind === 65 /* OpenParenToken */ );
        var token1 = this.peekTokenN(1);
        if(!this.isIdentifier(token1)) {
            return false;
        }
        var token2 = this.peekTokenN(2);
        if(token2.kind === 100 /* EqualsToken */ ) {
            return true;
        }
        if(token2.kind === 72 /* CommaToken */ ) {
            return true;
        }
        if(token2.kind === 66 /* CloseParenToken */ ) {
            var token3 = this.peekTokenN(3);
            if(token3.kind === 99 /* ColonToken */ ) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.parseObjectLiteralExpression = function () {
        Debug.assert(this.currentToken().kind === 63 /* OpenBraceToken */ );
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var propertyAssignments = this.parseSeparatedSyntaxList(8192 /* ObjectLiteralExpression_PropertyAssignments */ );
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
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
        return this.currentToken().keywordKind() === 58 /* GetKeyword */  && this.isPropertyName(this.peekTokenN(1), false);
    };
    Parser.prototype.parseGetAccessorPropertyAssignment = function () {
        Debug.assert(this.isGetAccessorPropertyAssignment());
        var getKeyword = this.eatKeyword(58 /* GetKeyword */ );
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var block = this.parseBlock();
        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block);
    };
    Parser.prototype.isSetAccessorPropertyAssignment = function () {
        return this.currentToken().keywordKind() === 61 /* SetKeyword */  && this.isPropertyName(this.peekTokenN(1), false);
    };
    Parser.prototype.parseSetAccessorPropertyAssignment = function () {
        Debug.assert(this.isSetAccessorPropertyAssignment());
        var setKeyword = this.eatKeyword(61 /* SetKeyword */ );
        var propertyName = this.eatAnyToken();
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var parameterName = this.eatIdentifierToken();
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        var block = this.parseBlock();
        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block);
    };
    Parser.prototype.isSimplePropertyAssignment = function (inErrorRecovery) {
        return this.isPropertyName(this.currentToken(), inErrorRecovery);
    };
    Parser.prototype.parseSimplePropertyAssignment = function () {
        Debug.assert(this.isSimplePropertyAssignment(false));
        var propertyName = this.eatAnyToken();
        var colonToken = this.eatToken(99 /* ColonToken */ );
        var expression = this.parseAssignmentExpression(true);
        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression);
    };
    Parser.prototype.isPropertyName = function (token, inErrorRecovery) {
        switch(token.kind) {
            case 5 /* IdentifierNameToken */ : {
                if(inErrorRecovery) {
                    return !this.isKeyword(token.keywordKind());
                } else {
                    return true;
                }

            }
            case 8 /* StringLiteral */ :
            case 7 /* NumericLiteral */ : {
                return true;

            }
            default: {
                return false;

            }
        }
    };
    Parser.prototype.parseArrayLiteralExpression = function () {
        Debug.assert(this.currentToken().kind === 67 /* OpenBracketToken */ );
        var openBracketToken = this.eatToken(67 /* OpenBracketToken */ );
        var expressions = this.parseSeparatedSyntaxList(16384 /* ArrayLiteralExpression_AssignmentExpressions */ );
        var closeBracketToken = this.eatToken(68 /* CloseBracketToken */ );
        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken);
    };
    Parser.prototype.parseLiteralExpression = function (expressionKind) {
        var literal = this.eatAnyToken();
        return new LiteralExpressionSyntax(expressionKind, literal);
    };
    Parser.prototype.parseThisExpression = function () {
        Debug.assert(this.currentToken().keywordKind() === 29 /* ThisKeyword */ );
        var thisKeyword = this.eatKeyword(29 /* ThisKeyword */ );
        return new ThisExpressionSyntax(thisKeyword);
    };
    Parser.prototype.parseBlock = function () {
        var openBraceToken = this.eatToken(63 /* OpenBraceToken */ );
        var statements = SyntaxList.empty;
        if(!openBraceToken.isMissing()) {
            var savedIsInStrictMode = this.isInStrictMode;
            statements = this.parseSyntaxList(32 /* Block_Statements */ , Parser.updateStrictModeState);
            this.isInStrictMode = savedIsInStrictMode;
        }
        var closeBraceToken = this.eatToken(64 /* CloseBraceToken */ );
        return new BlockSyntax(openBraceToken, statements, closeBraceToken);
    };
    Parser.prototype.parseCallSignature = function () {
        var parameterList = this.parseParameterList();
        var typeAnnotation = this.parseOptionalTypeAnnotation();
        return new CallSignatureSyntax(parameterList, typeAnnotation);
    };
    Parser.prototype.parseParameterList = function () {
        var openParenToken = this.eatToken(65 /* OpenParenToken */ );
        var parameters = SeparatedSyntaxList.empty;
        if(!openParenToken.isMissing()) {
            parameters = this.parseSeparatedSyntaxList(32768 /* ParameterList_Parameters */ );
        }
        var closeParenToken = this.eatToken(66 /* CloseParenToken */ );
        return new ParameterListSyntax(openParenToken, parameters, closeParenToken);
    };
    Parser.prototype.isTypeAnnotation = function () {
        return this.currentToken().kind === 99 /* ColonToken */ ;
    };
    Parser.prototype.parseOptionalTypeAnnotation = function () {
        return this.isTypeAnnotation() ? this.parseTypeAnnotation() : null;
    };
    Parser.prototype.parseTypeAnnotation = function () {
        Debug.assert(this.isTypeAnnotation());
        var colonToken = this.eatToken(99 /* ColonToken */ );
        var type = this.parseType(false);
        return new TypeAnnotationSyntax(colonToken, type);
    };
    Parser.prototype.isType = function (allowFunctionType, allowConstructorType) {
        return this.isPredefinedType() || this.isTypeLiteral(allowFunctionType, allowConstructorType) || this.isName();
    };
    Parser.prototype.parseType = function (requireCompleteArraySuffix) {
        var type = this.parseNonArrayType();
        while(this.currentToken().kind === 67 /* OpenBracketToken */ ) {
            if(requireCompleteArraySuffix && this.peekTokenN(1).kind !== 68 /* CloseBracketToken */ ) {
                break;
            }
            var openBracketToken = this.eatToken(67 /* OpenBracketToken */ );
            var closeBracketToken = this.eatToken(68 /* CloseBracketToken */ );
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
        var equalsGreaterThanToken = this.eatToken(78 /* EqualsGreaterThanToken */ );
        var returnType = this.parseType(false);
        return new FunctionTypeSyntax(parameterList, equalsGreaterThanToken, returnType);
    };
    Parser.prototype.parseConstructorType = function () {
        Debug.assert(this.isConstructorType());
        var newKeyword = this.eatKeyword(25 /* NewKeyword */ );
        var parameterList = this.parseParameterList();
        var equalsGreaterThanToken = this.eatToken(78 /* EqualsGreaterThanToken */ );
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
        return this.currentToken().kind === 63 /* OpenBraceToken */ ;
    };
    Parser.prototype.isFunctionType = function () {
        return this.currentToken().kind === 65 /* OpenParenToken */ ;
    };
    Parser.prototype.isConstructorType = function () {
        return this.currentToken().keywordKind() === 25 /* NewKeyword */ ;
    };
    Parser.prototype.parsePredefinedType = function () {
        Debug.assert(this.isPredefinedType());
        var keyword = this.eatAnyToken();
        return new PredefinedTypeSyntax(keyword);
    };
    Parser.prototype.isPredefinedType = function () {
        switch(this.currentToken().keywordKind()) {
            case 54 /* AnyKeyword */ :
            case 60 /* NumberKeyword */ :
            case 55 /* BoolKeyword */ :
            case 62 /* StringKeyword */ :
            case 35 /* VoidKeyword */ : {
                return true;

            }
        }
        return false;
    };
    Parser.prototype.isParameter = function () {
        var token = this.currentToken();
        if(token.kind === 70 /* DotDotDotToken */ ) {
            return true;
        }
        if(token.keywordKind() === 51 /* PublicKeyword */  || token.keywordKind() === 49 /* PrivateKeyword */ ) {
            return true;
        }
        return this.isIdentifier(token);
    };
    Parser.prototype.parseParameter = function () {
        var dotDotDotToken = this.tryEatToken(70 /* DotDotDotToken */ );
        var publicOrPrivateToken = null;
        if(this.currentToken().keywordKind() === 51 /* PublicKeyword */  || this.currentToken().keywordKind() === 49 /* PrivateKeyword */ ) {
            publicOrPrivateToken = this.eatAnyToken();
        }
        var identifier = this.eatIdentifierToken();
        var questionToken = this.tryEatToken(98 /* QuestionToken */ );
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
        return this.isExpectedListTerminator(currentListType, itemCount) || this.currentToken().kind === 114 /* EndOfFileToken */ ;
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
                if(this.currentToken().kind !== separatorKind) {
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
                return 72 /* CommaToken */ ;

            }
            case 256 /* ObjectType_TypeMembers */ : {
                return 71 /* SemicolonToken */ ;

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
        return this.currentToken().kind === 114 /* EndOfFileToken */ ;
    };
    Parser.prototype.isExpectedEnumDeclaration_VariableDeclaratorsTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedModuleDeclaration_ModuleElementsTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedObjectType_TypeMembersTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedObjectLiteralExpression_PropertyAssignmentsTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedLiteralExpression_AssignmentExpressionsTerminator = function () {
        return this.currentToken().kind === 68 /* CloseBracketToken */ ;
    };
    Parser.prototype.isExpectedParameterList_ParametersTerminator = function () {
        var token = this.currentToken();
        if(token.kind === 66 /* CloseParenToken */ ) {
            return true;
        }
        if(token.kind === 63 /* OpenBraceToken */ ) {
            return true;
        }
        if(token.kind === 78 /* EqualsGreaterThanToken */ ) {
            return true;
        }
        return false;
    };
    Parser.prototype.isExpectedVariableDeclaration_VariableDeclarators_DisallowInTerminator = function () {
        if(this.currentToken().kind === 71 /* SemicolonToken */  || this.currentToken().kind === 66 /* CloseParenToken */ ) {
            return true;
        }
        if(this.currentToken().keywordKind() === 23 /* InKeyword */ ) {
            return true;
        }
        return false;
    };
    Parser.prototype.isExpectedVariableDeclaration_VariableDeclarators_AllowInTerminator = function (itemCount) {
        if(this.previousToken.kind === 72 /* CommaToken */ ) {
            return false;
        }
        return itemCount > 0 && this.canEatExplicitOrAutomaticSemicolon(false);
    };
    Parser.prototype.isExpectedExtendsOrImplementsClause_TypeNameListTerminator = function () {
        if(this.currentToken().keywordKind() === 42 /* ExtendsKeyword */  || this.currentToken().keywordKind() === 45 /* ImplementsKeyword */ ) {
            return true;
        }
        if(this.currentToken().kind === 63 /* OpenBraceToken */  || this.currentToken().kind === 64 /* CloseBraceToken */ ) {
            return true;
        }
        return false;
    };
    Parser.prototype.isExpectedArgumentList_AssignmentExpressionsTerminator = function () {
        return this.currentToken().kind === 66 /* CloseParenToken */ ;
    };
    Parser.prototype.isExpectedClassDeclaration_ClassElementsTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedSwitchStatement_SwitchClausesTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
    };
    Parser.prototype.isExpectedSwitchClause_StatementsTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */  || this.isSwitchClause();
    };
    Parser.prototype.isExpectedBlock_StatementsTerminator = function () {
        return this.currentToken().kind === 64 /* CloseBraceToken */ ;
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
                return this.isStatement(false);

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
        this.previousTokenKind = 0 /* None */ ;
        this.previousTokenKeywordKind = 0 /* None */ ;
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
    Scanner.prototype.fetchMoreItems = function (sourceIndex, window, destinationIndex, spaceAvailable) {
        var charactersRemaining = this.text.length() - sourceIndex;
        var amountToRead = MathPrototype.min(charactersRemaining, spaceAvailable);
        this.text.copyTo(sourceIndex, window, destinationIndex, amountToRead);
        return amountToRead;
    };
    Scanner.prototype.scan = function (diagnostics) {
        var start = this.absoluteIndex();
        var leadingTriviaInfo = this.scanTriviaInfo(diagnostics, false);
        this.scanSyntaxToken(diagnostics);
        var trailingTriviaInfo = this.scanTriviaInfo(diagnostics, true);
        this.previousTokenKind = this.tokenInfo.Kind;
        this.previousTokenKeywordKind = this.tokenInfo.KeywordKind;
        return SyntaxTokenFactory.create(start, leadingTriviaInfo, this.tokenInfo, trailingTriviaInfo);
    };
    Scanner.prototype.scanTriviaInfo = function (diagnostics, isTrailing) {
        var width = 0;
        var hasComment = false;
        var hasNewLine = false;
        while(true) {
            var ch = this.currentItem();
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
            var ch = this.currentItem();
            if(this.isNewLineCharacter(ch) || ch === 0 /* nullCharacter */ ) {
                return width;
            }
            this.moveToNextItem();
            width++;
        }
    };
    Scanner.prototype.scanMultiLineCommentTrivia = function (diagnostics) {
        var width = 0;
        while(true) {
            var ch = this.currentItem();
            if(ch === 0 /* nullCharacter */ ) {
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
        if(ch === 13 /* carriageReturn */  && this.currentItem() === 10 /* newLine */ ) {
            this.moveToNextItem();
            return 2;
        } else {
            return 1;
        }
    };
    Scanner.prototype.scanSyntaxToken = function (diagnostics) {
        this.tokenInfo.Kind = 0 /* None */ ;
        this.tokenInfo.KeywordKind = 0 /* None */ ;
        this.tokenInfo.Text = null;
        this.tokenInfo.Value = null;
        var character = this.currentItem();
        switch(character) {
            case 34 /* doubleQuote */ :
            case 39 /* singleQuote */ : {
                return this.scanStringLiteral(diagnostics);

            }
            case 47 /* slash */ : {
                return this.scanSlashToken();

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
                return this.advanceAndSetTokenKind(72 /* CommaToken */ );

            }
            case 58 /* colon */ : {
                return this.advanceAndSetTokenKind(99 /* ColonToken */ );

            }
            case 59 /* semicolon */ : {
                return this.advanceAndSetTokenKind(71 /* SemicolonToken */ );

            }
            case 126 /* tilde */ : {
                return this.advanceAndSetTokenKind(95 /* TildeToken */ );

            }
            case 40 /* openParen */ : {
                return this.advanceAndSetTokenKind(65 /* OpenParenToken */ );

            }
            case 41 /* closeParen */ : {
                return this.advanceAndSetTokenKind(66 /* CloseParenToken */ );

            }
            case 123 /* openBrace */ : {
                return this.advanceAndSetTokenKind(63 /* OpenBraceToken */ );

            }
            case 125 /* closeBrace */ : {
                return this.advanceAndSetTokenKind(64 /* CloseBraceToken */ );

            }
            case 91 /* openBracket */ : {
                return this.advanceAndSetTokenKind(67 /* OpenBracketToken */ );

            }
            case 93 /* closeBracket */ : {
                return this.advanceAndSetTokenKind(68 /* CloseBracketToken */ );

            }
            case 63 /* question */ : {
                return this.advanceAndSetTokenKind(98 /* QuestionToken */ );

            }
            case 0 /* nullCharacter */ : {
                this.tokenInfo.Kind = 114 /* EndOfFileToken */ ;
                this.tokenInfo.Text = "";
                return;

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
            var character = this.currentItem();
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
                    this.tokenInfo.Kind = 5 /* IdentifierNameToken */ ;
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
        this.tokenInfo.Kind = 5 /* IdentifierNameToken */ ;
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
        while(CharacterInfo.isDecimalDigit(this.currentItem())) {
            this.moveToNextItem();
        }
        if(this.currentItem() === 46 /* dot */ ) {
            this.moveToNextItem();
        }
        while(CharacterInfo.isDecimalDigit(this.currentItem())) {
            this.moveToNextItem();
        }
        var ch = this.currentItem();
        if(ch === 101 /* e */  || ch === 69 /* E */ ) {
            this.moveToNextItem();
            ch = this.currentItem();
            if(ch === 45 /* minus */  || ch === 43 /* plus */ ) {
                if(CharacterInfo.isDecimalDigit(this.peekItemN(1))) {
                    this.moveToNextItem();
                }
            }
        }
        while(CharacterInfo.isDecimalDigit(this.currentItem())) {
            this.moveToNextItem();
        }
        var endIndex = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(startIndex, endIndex, false);
        this.tokenInfo.Kind = 7 /* NumericLiteral */ ;
    };
    Scanner.prototype.scanHexNumericLiteral = function (start) {
        Debug.assert(this.isHexNumericLiteral());
        this.moveToNextItem();
        this.moveToNextItem();
        while(CharacterInfo.isHexDigit(this.currentItem())) {
            this.moveToNextItem();
        }
        var end = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(start, end, false);
        this.tokenInfo.Kind = 7 /* NumericLiteral */ ;
    };
    Scanner.prototype.isHexNumericLiteral = function () {
        if(this.currentItem() === 48 /* _0 */ ) {
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
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 76 /* GreaterThanEqualsToken */ ;
        } else {
            if(character === 62 /* greaterThan */ ) {
                this.scanGreaterThanGreaterThanToken();
            } else {
                this.tokenInfo.Kind = 74 /* GreaterThanToken */ ;
            }
        }
    };
    Scanner.prototype.scanGreaterThanGreaterThanToken = function () {
        this.moveToNextItem();
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 106 /* GreaterThanGreaterThanEqualsToken */ ;
        } else {
            if(character === 62 /* greaterThan */ ) {
                this.scanGreaterThanGreaterThanGreaterThanToken();
            } else {
                this.tokenInfo.Kind = 89 /* GreaterThanGreaterThanToken */ ;
            }
        }
    };
    Scanner.prototype.scanGreaterThanGreaterThanGreaterThanToken = function () {
        this.moveToNextItem();
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 107 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 90 /* GreaterThanGreaterThanGreaterThanToken */ ;
        }
    };
    Scanner.prototype.scanLessThanToken = function () {
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 75 /* LessThanEqualsToken */ ;
        } else {
            if(this.currentItem() === 60 /* lessThan */ ) {
                this.moveToNextItem();
                if(this.currentItem() === 61 /* equals */ ) {
                    this.moveToNextItem();
                    this.tokenInfo.Kind = 105 /* LessThanLessThanEqualsToken */ ;
                } else {
                    this.tokenInfo.Kind = 88 /* LessThanLessThanToken */ ;
                }
            } else {
                this.tokenInfo.Kind = 73 /* LessThanToken */ ;
            }
        }
    };
    Scanner.prototype.scanBarToken = function () {
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 109 /* BarEqualsToken */ ;
        } else {
            if(this.currentItem() === 124 /* bar */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 97 /* BarBarToken */ ;
            } else {
                this.tokenInfo.Kind = 92 /* BarToken */ ;
            }
        }
    };
    Scanner.prototype.scanCaretToken = function () {
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 110 /* CaretEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 93 /* CaretToken */ ;
        }
    };
    Scanner.prototype.scanAmpersandToken = function () {
        this.moveToNextItem();
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 108 /* AmpersandEqualsToken */ ;
        } else {
            if(this.currentItem() === 38 /* ampersand */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 96 /* AmpersandAmpersandToken */ ;
            } else {
                this.tokenInfo.Kind = 91 /* AmpersandToken */ ;
            }
        }
    };
    Scanner.prototype.scanPercentToken = function () {
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 104 /* PercentEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 85 /* PercentToken */ ;
        }
    };
    Scanner.prototype.scanMinusToken = function () {
        this.moveToNextItem();
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 102 /* MinusEqualsToken */ ;
        } else {
            if(character === 45 /* minus */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 87 /* MinusMinusToken */ ;
            } else {
                this.tokenInfo.Kind = 83 /* MinusToken */ ;
            }
        }
    };
    Scanner.prototype.scanPlusToken = function () {
        this.moveToNextItem();
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 101 /* PlusEqualsToken */ ;
        } else {
            if(character === 43 /* plus */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 86 /* PlusPlusToken */ ;
            } else {
                this.tokenInfo.Kind = 82 /* PlusToken */ ;
            }
        }
    };
    Scanner.prototype.scanAsteriskToken = function () {
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 103 /* AsteriskEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 84 /* AsteriskToken */ ;
        }
    };
    Scanner.prototype.scanEqualsToken = function () {
        this.moveToNextItem();
        var character = this.currentItem();
        if(character === 61 /* equals */ ) {
            this.moveToNextItem();
            if(this.currentItem() === 61 /* equals */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 80 /* EqualsEqualsEqualsToken */ ;
            } else {
                this.tokenInfo.Kind = 77 /* EqualsEqualsToken */ ;
            }
        } else {
            if(character === 62 /* greaterThan */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 78 /* EqualsGreaterThanToken */ ;
            } else {
                this.tokenInfo.Kind = 100 /* EqualsToken */ ;
            }
        }
    };
    Scanner.prototype.isDotPrefixedNumericLiteral = function () {
        if(this.currentItem() === 46 /* dot */ ) {
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
        if(this.currentItem() === 46 /* dot */  && this.peekItemN(1) === 46 /* dot */ ) {
            this.moveToNextItem();
            this.moveToNextItem();
            this.tokenInfo.Kind = 70 /* DotDotDotToken */ ;
        } else {
            this.tokenInfo.Kind = 69 /* DotToken */ ;
        }
    };
    Scanner.prototype.scanSlashToken = function () {
        if(this.tryScanRegularExpressionToken()) {
            return;
        }
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            this.tokenInfo.Kind = 112 /* SlashEqualsToken */ ;
        } else {
            this.tokenInfo.Kind = 111 /* SlashToken */ ;
        }
    };
    Scanner.prototype.tryScanRegularExpressionToken = function () {
        switch(this.previousTokenKind) {
            case 5 /* IdentifierNameToken */ : {
                if(this.previousTokenKeywordKind === 0 /* None */ ) {
                    return false;
                }
                break;

            }
            case 8 /* StringLiteral */ :
            case 7 /* NumericLiteral */ :
            case 6 /* RegularExpressionLiteral */ :
            case 86 /* PlusPlusToken */ :
            case 87 /* MinusMinusToken */ :
            case 66 /* CloseParenToken */ :
            case 68 /* CloseBracketToken */ :
            case 64 /* CloseBraceToken */ : {
                return false;

            }
        }
        switch(this.previousTokenKeywordKind) {
            case 29 /* ThisKeyword */ :
            case 31 /* TrueKeyword */ :
            case 18 /* FalseKeyword */ : {
                return false;

            }
        }
        Debug.assert(this.currentItem() === 47 /* slash */ );
        var startIndex = this.getAndPinAbsoluteIndex();
        try  {
            this.moveToNextItem();
            var skipNextSlash = false;
            while(true) {
                var ch = this.currentItem();
                if(this.isNewLineCharacter(ch) || ch === 0 /* nullCharacter */ ) {
                    this.rewindToPinnedIndex(startIndex);
                    return false;
                }
                this.moveToNextItem();
                if(!skipNextSlash && ch === 47 /* slash */ ) {
                    break;
                } else {
                    if(!skipNextSlash && ch === 92 /* backslash */ ) {
                        skipNextSlash = true;
                        continue;
                    }
                }
                skipNextSlash = false;
            }
            while(Scanner.isIdentifierPartCharacter[this.currentItem()]) {
                this.moveToNextItem();
            }
            var endIndex = this.absoluteIndex();
            this.tokenInfo.Kind = 6 /* RegularExpressionLiteral */ ;
            this.tokenInfo.Text = this.substring(startIndex, endIndex, false);
            return true;
        }finally {
            this.releaseAndUnpinAbsoluteIndex(startIndex);
        }
    };
    Scanner.prototype.scanExclamationToken = function () {
        this.moveToNextItem();
        if(this.currentItem() === 61 /* equals */ ) {
            this.moveToNextItem();
            if(this.currentItem() === 61 /* equals */ ) {
                this.moveToNextItem();
                this.tokenInfo.Kind = 81 /* ExclamationEqualsEqualsToken */ ;
            } else {
                this.tokenInfo.Kind = 79 /* ExclamationEqualsToken */ ;
            }
        } else {
            this.tokenInfo.Kind = 94 /* ExclamationToken */ ;
        }
    };
    Scanner.prototype.scanDefaultCharacter = function (character, diagnostics) {
        var position = this.absoluteIndex();
        this.moveToNextItem();
        this.tokenInfo.Text = String.fromCharCode(character);
        this.tokenInfo.Kind = 113 /* ErrorToken */ ;
        diagnostics.push(new SyntaxDiagnostic(position, 1, 1 /* Unexpected_character_0 */ , [
            this.tokenInfo.Text
        ]));
    };
    Scanner.prototype.skipEscapeSequence = function (diagnostics) {
        Debug.assert(this.currentItem() === 92 /* backslash */ );
        var rewindPoint = this.getRewindPoint();
        try  {
            this.moveToNextItem();
            var ch = this.currentItem();
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
                    if(this.currentItem() === 10 /* newLine */ ) {
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
        var quoteCharacter = this.currentItem();
        Debug.assert(quoteCharacter === 39 /* singleQuote */  || quoteCharacter === 34 /* doubleQuote */ );
        var startIndex = this.getAndPinAbsoluteIndex();
        this.moveToNextItem();
        while(true) {
            var ch = this.currentItem();
            if(ch === 92 /* backslash */ ) {
                this.skipEscapeSequence(diagnostics);
            } else {
                if(ch === quoteCharacter) {
                    this.moveToNextItem();
                    break;
                } else {
                    if(this.isNewLineCharacter(ch) || ch === 0 /* nullCharacter */ ) {
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
        this.tokenInfo.Kind = 8 /* StringLiteral */ ;
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
        var character = this.currentItem();
        if(this.isUnicodeOrHexEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return character;
        }
    };
    Scanner.prototype.peekCharOrUnicodeEscape = function () {
        var character = this.currentItem();
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
        var ch = this.currentItem();
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
        var ch = this.currentItem();
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
        var character = this.currentItem();
        Debug.assert(character === 92 /* backslash */ );
        this.moveToNextItem();
        character = this.currentItem();
        Debug.assert(character === 117 /* u */  || character === 120 /* x */ );
        var intChar = 0;
        this.moveToNextItem();
        var count = character === 117 /* u */  ? 4 : 2;
        for(var i = 0; i < count; i++) {
            var ch2 = this.currentItem();
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
            var c = this.charCodeAt(0);
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
    StringText.prototype.getCharCodeAt = function (position) {
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
    SyntaxKind._map[56] = "ConstructorKeyword";
    SyntaxKind.ConstructorKeyword = 56;
    SyntaxKind._map[57] = "DeclareKeyword";
    SyntaxKind.DeclareKeyword = 57;
    SyntaxKind._map[58] = "GetKeyword";
    SyntaxKind.GetKeyword = 58;
    SyntaxKind._map[59] = "ModuleKeyword";
    SyntaxKind.ModuleKeyword = 59;
    SyntaxKind._map[60] = "NumberKeyword";
    SyntaxKind.NumberKeyword = 60;
    SyntaxKind._map[61] = "SetKeyword";
    SyntaxKind.SetKeyword = 61;
    SyntaxKind._map[62] = "StringKeyword";
    SyntaxKind.StringKeyword = 62;
    SyntaxKind._map[63] = "OpenBraceToken";
    SyntaxKind.OpenBraceToken = 63;
    SyntaxKind._map[64] = "CloseBraceToken";
    SyntaxKind.CloseBraceToken = 64;
    SyntaxKind._map[65] = "OpenParenToken";
    SyntaxKind.OpenParenToken = 65;
    SyntaxKind._map[66] = "CloseParenToken";
    SyntaxKind.CloseParenToken = 66;
    SyntaxKind._map[67] = "OpenBracketToken";
    SyntaxKind.OpenBracketToken = 67;
    SyntaxKind._map[68] = "CloseBracketToken";
    SyntaxKind.CloseBracketToken = 68;
    SyntaxKind._map[69] = "DotToken";
    SyntaxKind.DotToken = 69;
    SyntaxKind._map[70] = "DotDotDotToken";
    SyntaxKind.DotDotDotToken = 70;
    SyntaxKind._map[71] = "SemicolonToken";
    SyntaxKind.SemicolonToken = 71;
    SyntaxKind._map[72] = "CommaToken";
    SyntaxKind.CommaToken = 72;
    SyntaxKind._map[73] = "LessThanToken";
    SyntaxKind.LessThanToken = 73;
    SyntaxKind._map[74] = "GreaterThanToken";
    SyntaxKind.GreaterThanToken = 74;
    SyntaxKind._map[75] = "LessThanEqualsToken";
    SyntaxKind.LessThanEqualsToken = 75;
    SyntaxKind._map[76] = "GreaterThanEqualsToken";
    SyntaxKind.GreaterThanEqualsToken = 76;
    SyntaxKind._map[77] = "EqualsEqualsToken";
    SyntaxKind.EqualsEqualsToken = 77;
    SyntaxKind._map[78] = "EqualsGreaterThanToken";
    SyntaxKind.EqualsGreaterThanToken = 78;
    SyntaxKind._map[79] = "ExclamationEqualsToken";
    SyntaxKind.ExclamationEqualsToken = 79;
    SyntaxKind._map[80] = "EqualsEqualsEqualsToken";
    SyntaxKind.EqualsEqualsEqualsToken = 80;
    SyntaxKind._map[81] = "ExclamationEqualsEqualsToken";
    SyntaxKind.ExclamationEqualsEqualsToken = 81;
    SyntaxKind._map[82] = "PlusToken";
    SyntaxKind.PlusToken = 82;
    SyntaxKind._map[83] = "MinusToken";
    SyntaxKind.MinusToken = 83;
    SyntaxKind._map[84] = "AsteriskToken";
    SyntaxKind.AsteriskToken = 84;
    SyntaxKind._map[85] = "PercentToken";
    SyntaxKind.PercentToken = 85;
    SyntaxKind._map[86] = "PlusPlusToken";
    SyntaxKind.PlusPlusToken = 86;
    SyntaxKind._map[87] = "MinusMinusToken";
    SyntaxKind.MinusMinusToken = 87;
    SyntaxKind._map[88] = "LessThanLessThanToken";
    SyntaxKind.LessThanLessThanToken = 88;
    SyntaxKind._map[89] = "GreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanToken = 89;
    SyntaxKind._map[90] = "GreaterThanGreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 90;
    SyntaxKind._map[91] = "AmpersandToken";
    SyntaxKind.AmpersandToken = 91;
    SyntaxKind._map[92] = "BarToken";
    SyntaxKind.BarToken = 92;
    SyntaxKind._map[93] = "CaretToken";
    SyntaxKind.CaretToken = 93;
    SyntaxKind._map[94] = "ExclamationToken";
    SyntaxKind.ExclamationToken = 94;
    SyntaxKind._map[95] = "TildeToken";
    SyntaxKind.TildeToken = 95;
    SyntaxKind._map[96] = "AmpersandAmpersandToken";
    SyntaxKind.AmpersandAmpersandToken = 96;
    SyntaxKind._map[97] = "BarBarToken";
    SyntaxKind.BarBarToken = 97;
    SyntaxKind._map[98] = "QuestionToken";
    SyntaxKind.QuestionToken = 98;
    SyntaxKind._map[99] = "ColonToken";
    SyntaxKind.ColonToken = 99;
    SyntaxKind._map[100] = "EqualsToken";
    SyntaxKind.EqualsToken = 100;
    SyntaxKind._map[101] = "PlusEqualsToken";
    SyntaxKind.PlusEqualsToken = 101;
    SyntaxKind._map[102] = "MinusEqualsToken";
    SyntaxKind.MinusEqualsToken = 102;
    SyntaxKind._map[103] = "AsteriskEqualsToken";
    SyntaxKind.AsteriskEqualsToken = 103;
    SyntaxKind._map[104] = "PercentEqualsToken";
    SyntaxKind.PercentEqualsToken = 104;
    SyntaxKind._map[105] = "LessThanLessThanEqualsToken";
    SyntaxKind.LessThanLessThanEqualsToken = 105;
    SyntaxKind._map[106] = "GreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanEqualsToken = 106;
    SyntaxKind._map[107] = "GreaterThanGreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 107;
    SyntaxKind._map[108] = "AmpersandEqualsToken";
    SyntaxKind.AmpersandEqualsToken = 108;
    SyntaxKind._map[109] = "BarEqualsToken";
    SyntaxKind.BarEqualsToken = 109;
    SyntaxKind._map[110] = "CaretEqualsToken";
    SyntaxKind.CaretEqualsToken = 110;
    SyntaxKind._map[111] = "SlashToken";
    SyntaxKind.SlashToken = 111;
    SyntaxKind._map[112] = "SlashEqualsToken";
    SyntaxKind.SlashEqualsToken = 112;
    SyntaxKind._map[113] = "ErrorToken";
    SyntaxKind.ErrorToken = 113;
    SyntaxKind._map[114] = "EndOfFileToken";
    SyntaxKind.EndOfFileToken = 114;
    SyntaxKind._map[115] = "SourceUnit";
    SyntaxKind.SourceUnit = 115;
    SyntaxKind._map[116] = "IdentifierName";
    SyntaxKind.IdentifierName = 116;
    SyntaxKind._map[117] = "QualifiedName";
    SyntaxKind.QualifiedName = 117;
    SyntaxKind._map[118] = "ObjectType";
    SyntaxKind.ObjectType = 118;
    SyntaxKind._map[119] = "PredefinedType";
    SyntaxKind.PredefinedType = 119;
    SyntaxKind._map[120] = "FunctionType";
    SyntaxKind.FunctionType = 120;
    SyntaxKind._map[121] = "ArrayType";
    SyntaxKind.ArrayType = 121;
    SyntaxKind._map[122] = "ConstructorType";
    SyntaxKind.ConstructorType = 122;
    SyntaxKind._map[123] = "InterfaceDeclaration";
    SyntaxKind.InterfaceDeclaration = 123;
    SyntaxKind._map[124] = "FunctionDeclaration";
    SyntaxKind.FunctionDeclaration = 124;
    SyntaxKind._map[125] = "ModuleDeclaration";
    SyntaxKind.ModuleDeclaration = 125;
    SyntaxKind._map[126] = "ClassDeclaration";
    SyntaxKind.ClassDeclaration = 126;
    SyntaxKind._map[127] = "EnumDeclaration";
    SyntaxKind.EnumDeclaration = 127;
    SyntaxKind._map[128] = "ImportDeclaration";
    SyntaxKind.ImportDeclaration = 128;
    SyntaxKind._map[129] = "MemberFunctionDeclaration";
    SyntaxKind.MemberFunctionDeclaration = 129;
    SyntaxKind._map[130] = "ConstructorDeclaration";
    SyntaxKind.ConstructorDeclaration = 130;
    SyntaxKind._map[131] = "GetMemberAccessorDeclaration";
    SyntaxKind.GetMemberAccessorDeclaration = 131;
    SyntaxKind._map[132] = "SetMemberAccessorDeclaration";
    SyntaxKind.SetMemberAccessorDeclaration = 132;
    SyntaxKind._map[133] = "Block";
    SyntaxKind.Block = 133;
    SyntaxKind._map[134] = "IfStatement";
    SyntaxKind.IfStatement = 134;
    SyntaxKind._map[135] = "VariableStatement";
    SyntaxKind.VariableStatement = 135;
    SyntaxKind._map[136] = "ExpressionStatement";
    SyntaxKind.ExpressionStatement = 136;
    SyntaxKind._map[137] = "ReturnStatement";
    SyntaxKind.ReturnStatement = 137;
    SyntaxKind._map[138] = "SwitchStatement";
    SyntaxKind.SwitchStatement = 138;
    SyntaxKind._map[139] = "BreakStatement";
    SyntaxKind.BreakStatement = 139;
    SyntaxKind._map[140] = "ContinueStatement";
    SyntaxKind.ContinueStatement = 140;
    SyntaxKind._map[141] = "ForStatement";
    SyntaxKind.ForStatement = 141;
    SyntaxKind._map[142] = "ForInStatement";
    SyntaxKind.ForInStatement = 142;
    SyntaxKind._map[143] = "EmptyStatement";
    SyntaxKind.EmptyStatement = 143;
    SyntaxKind._map[144] = "ThrowStatement";
    SyntaxKind.ThrowStatement = 144;
    SyntaxKind._map[145] = "WhileStatement";
    SyntaxKind.WhileStatement = 145;
    SyntaxKind._map[146] = "TryStatement";
    SyntaxKind.TryStatement = 146;
    SyntaxKind._map[147] = "LabeledStatement";
    SyntaxKind.LabeledStatement = 147;
    SyntaxKind._map[148] = "DoStatement";
    SyntaxKind.DoStatement = 148;
    SyntaxKind._map[149] = "DebuggerStatement";
    SyntaxKind.DebuggerStatement = 149;
    SyntaxKind._map[150] = "WithStatement";
    SyntaxKind.WithStatement = 150;
    SyntaxKind._map[151] = "PlusExpression";
    SyntaxKind.PlusExpression = 151;
    SyntaxKind._map[152] = "NegateExpression";
    SyntaxKind.NegateExpression = 152;
    SyntaxKind._map[153] = "BitwiseNotExpression";
    SyntaxKind.BitwiseNotExpression = 153;
    SyntaxKind._map[154] = "LogicalNotExpression";
    SyntaxKind.LogicalNotExpression = 154;
    SyntaxKind._map[155] = "PreIncrementExpression";
    SyntaxKind.PreIncrementExpression = 155;
    SyntaxKind._map[156] = "PreDecrementExpression";
    SyntaxKind.PreDecrementExpression = 156;
    SyntaxKind._map[157] = "DeleteExpression";
    SyntaxKind.DeleteExpression = 157;
    SyntaxKind._map[158] = "TypeOfExpression";
    SyntaxKind.TypeOfExpression = 158;
    SyntaxKind._map[159] = "VoidExpression";
    SyntaxKind.VoidExpression = 159;
    SyntaxKind._map[160] = "BooleanLiteralExpression";
    SyntaxKind.BooleanLiteralExpression = 160;
    SyntaxKind._map[161] = "NullLiteralExpression";
    SyntaxKind.NullLiteralExpression = 161;
    SyntaxKind._map[162] = "NumericLiteralExpression";
    SyntaxKind.NumericLiteralExpression = 162;
    SyntaxKind._map[163] = "RegularExpressionLiteralExpression";
    SyntaxKind.RegularExpressionLiteralExpression = 163;
    SyntaxKind._map[164] = "StringLiteralExpression";
    SyntaxKind.StringLiteralExpression = 164;
    SyntaxKind._map[165] = "CommaExpression";
    SyntaxKind.CommaExpression = 165;
    SyntaxKind._map[166] = "AssignmentExpression";
    SyntaxKind.AssignmentExpression = 166;
    SyntaxKind._map[167] = "AddAssignmentExpression";
    SyntaxKind.AddAssignmentExpression = 167;
    SyntaxKind._map[168] = "SubtractAssignmentExpression";
    SyntaxKind.SubtractAssignmentExpression = 168;
    SyntaxKind._map[169] = "MultiplyAssignmentExpression";
    SyntaxKind.MultiplyAssignmentExpression = 169;
    SyntaxKind._map[170] = "DivideAssignmentExpression";
    SyntaxKind.DivideAssignmentExpression = 170;
    SyntaxKind._map[171] = "ModuloAssignmentExpression";
    SyntaxKind.ModuloAssignmentExpression = 171;
    SyntaxKind._map[172] = "AndAssignmentExpression";
    SyntaxKind.AndAssignmentExpression = 172;
    SyntaxKind._map[173] = "ExclusiveOrAssignmentExpression";
    SyntaxKind.ExclusiveOrAssignmentExpression = 173;
    SyntaxKind._map[174] = "OrAssignmentExpression";
    SyntaxKind.OrAssignmentExpression = 174;
    SyntaxKind._map[175] = "LeftShiftAssignmentExpression";
    SyntaxKind.LeftShiftAssignmentExpression = 175;
    SyntaxKind._map[176] = "SignedRightShiftAssignmentExpression";
    SyntaxKind.SignedRightShiftAssignmentExpression = 176;
    SyntaxKind._map[177] = "UnsignedRightShiftAssignmentExpression";
    SyntaxKind.UnsignedRightShiftAssignmentExpression = 177;
    SyntaxKind._map[178] = "ConditionalExpression";
    SyntaxKind.ConditionalExpression = 178;
    SyntaxKind._map[179] = "LogicalOrExpression";
    SyntaxKind.LogicalOrExpression = 179;
    SyntaxKind._map[180] = "LogicalAndExpression";
    SyntaxKind.LogicalAndExpression = 180;
    SyntaxKind._map[181] = "BitwiseOrExpression";
    SyntaxKind.BitwiseOrExpression = 181;
    SyntaxKind._map[182] = "BitwiseExclusiveOrExpression";
    SyntaxKind.BitwiseExclusiveOrExpression = 182;
    SyntaxKind._map[183] = "BitwiseAndExpression";
    SyntaxKind.BitwiseAndExpression = 183;
    SyntaxKind._map[184] = "EqualsWithTypeConversionExpression";
    SyntaxKind.EqualsWithTypeConversionExpression = 184;
    SyntaxKind._map[185] = "NotEqualsWithTypeConversionExpression";
    SyntaxKind.NotEqualsWithTypeConversionExpression = 185;
    SyntaxKind._map[186] = "EqualsExpression";
    SyntaxKind.EqualsExpression = 186;
    SyntaxKind._map[187] = "NotEqualsExpression";
    SyntaxKind.NotEqualsExpression = 187;
    SyntaxKind._map[188] = "LessThanExpression";
    SyntaxKind.LessThanExpression = 188;
    SyntaxKind._map[189] = "GreaterThanExpression";
    SyntaxKind.GreaterThanExpression = 189;
    SyntaxKind._map[190] = "LessThanOrEqualExpression";
    SyntaxKind.LessThanOrEqualExpression = 190;
    SyntaxKind._map[191] = "GreaterThanOrEqualExpression";
    SyntaxKind.GreaterThanOrEqualExpression = 191;
    SyntaxKind._map[192] = "InstanceOfExpression";
    SyntaxKind.InstanceOfExpression = 192;
    SyntaxKind._map[193] = "InExpression";
    SyntaxKind.InExpression = 193;
    SyntaxKind._map[194] = "LeftShiftExpression";
    SyntaxKind.LeftShiftExpression = 194;
    SyntaxKind._map[195] = "SignedRightShiftExpression";
    SyntaxKind.SignedRightShiftExpression = 195;
    SyntaxKind._map[196] = "UnsignedRightShiftExpression";
    SyntaxKind.UnsignedRightShiftExpression = 196;
    SyntaxKind._map[197] = "MultiplyExpression";
    SyntaxKind.MultiplyExpression = 197;
    SyntaxKind._map[198] = "DivideExpression";
    SyntaxKind.DivideExpression = 198;
    SyntaxKind._map[199] = "ModuloExpression";
    SyntaxKind.ModuloExpression = 199;
    SyntaxKind._map[200] = "AddExpression";
    SyntaxKind.AddExpression = 200;
    SyntaxKind._map[201] = "SubtractExpression";
    SyntaxKind.SubtractExpression = 201;
    SyntaxKind._map[202] = "PostIncrementExpression";
    SyntaxKind.PostIncrementExpression = 202;
    SyntaxKind._map[203] = "PostDecrementExpression";
    SyntaxKind.PostDecrementExpression = 203;
    SyntaxKind._map[204] = "MemberAccessExpression";
    SyntaxKind.MemberAccessExpression = 204;
    SyntaxKind._map[205] = "InvocationExpression";
    SyntaxKind.InvocationExpression = 205;
    SyntaxKind._map[206] = "ThisExpression";
    SyntaxKind.ThisExpression = 206;
    SyntaxKind._map[207] = "ArrayLiteralExpression";
    SyntaxKind.ArrayLiteralExpression = 207;
    SyntaxKind._map[208] = "ObjectLiteralExpression";
    SyntaxKind.ObjectLiteralExpression = 208;
    SyntaxKind._map[209] = "ObjectCreationExpression";
    SyntaxKind.ObjectCreationExpression = 209;
    SyntaxKind._map[210] = "ParenthesizedExpression";
    SyntaxKind.ParenthesizedExpression = 210;
    SyntaxKind._map[211] = "ParenthesizedArrowFunctionExpression";
    SyntaxKind.ParenthesizedArrowFunctionExpression = 211;
    SyntaxKind._map[212] = "SimpleArrowFunctionExpression";
    SyntaxKind.SimpleArrowFunctionExpression = 212;
    SyntaxKind._map[213] = "CastExpression";
    SyntaxKind.CastExpression = 213;
    SyntaxKind._map[214] = "ElementAccessExpression";
    SyntaxKind.ElementAccessExpression = 214;
    SyntaxKind._map[215] = "FunctionExpression";
    SyntaxKind.FunctionExpression = 215;
    SyntaxKind._map[216] = "SuperExpression";
    SyntaxKind.SuperExpression = 216;
    SyntaxKind._map[217] = "OmittedExpression";
    SyntaxKind.OmittedExpression = 217;
    SyntaxKind._map[218] = "VariableDeclaration";
    SyntaxKind.VariableDeclaration = 218;
    SyntaxKind._map[219] = "VariableDeclarator";
    SyntaxKind.VariableDeclarator = 219;
    SyntaxKind._map[220] = "ParameterList";
    SyntaxKind.ParameterList = 220;
    SyntaxKind._map[221] = "ArgumentList";
    SyntaxKind.ArgumentList = 221;
    SyntaxKind._map[222] = "ImplementsClause";
    SyntaxKind.ImplementsClause = 222;
    SyntaxKind._map[223] = "ExtendsClause";
    SyntaxKind.ExtendsClause = 223;
    SyntaxKind._map[224] = "EqualsValueClause";
    SyntaxKind.EqualsValueClause = 224;
    SyntaxKind._map[225] = "CaseSwitchClause";
    SyntaxKind.CaseSwitchClause = 225;
    SyntaxKind._map[226] = "DefaultSwitchClause";
    SyntaxKind.DefaultSwitchClause = 226;
    SyntaxKind._map[227] = "ElseClause";
    SyntaxKind.ElseClause = 227;
    SyntaxKind._map[228] = "CatchClause";
    SyntaxKind.CatchClause = 228;
    SyntaxKind._map[229] = "FinallyClause";
    SyntaxKind.FinallyClause = 229;
    SyntaxKind._map[230] = "PropertySignature";
    SyntaxKind.PropertySignature = 230;
    SyntaxKind._map[231] = "CallSignature";
    SyntaxKind.CallSignature = 231;
    SyntaxKind._map[232] = "ConstructSignature";
    SyntaxKind.ConstructSignature = 232;
    SyntaxKind._map[233] = "IndexSignature";
    SyntaxKind.IndexSignature = 233;
    SyntaxKind._map[234] = "FunctionSignature";
    SyntaxKind.FunctionSignature = 234;
    SyntaxKind._map[235] = "Parameter";
    SyntaxKind.Parameter = 235;
    SyntaxKind._map[236] = "TypeAnnotation";
    SyntaxKind.TypeAnnotation = 236;
    SyntaxKind._map[237] = "SimplePropertyAssignment";
    SyntaxKind.SimplePropertyAssignment = 237;
    SyntaxKind._map[238] = "ExternalModuleReference";
    SyntaxKind.ExternalModuleReference = 238;
    SyntaxKind._map[239] = "GetAccessorPropertyAssignment";
    SyntaxKind.GetAccessorPropertyAssignment = 239;
    SyntaxKind._map[240] = "SetAccessorPropertyAssignment";
    SyntaxKind.SetAccessorPropertyAssignment = 240;
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
        "any": 54 /* AnyKeyword */ ,
        "bool": 55 /* BoolKeyword */ ,
        "break": 9 /* BreakKeyword */ ,
        "case": 10 /* CaseKeyword */ ,
        "catch": 11 /* CatchKeyword */ ,
        "class": 38 /* ClassKeyword */ ,
        "continue": 12 /* ContinueKeyword */ ,
        "const": 39 /* ConstKeyword */ ,
        "constructor": 56 /* ConstructorKeyword */ ,
        "debugger": 13 /* DebuggerKeyword */ ,
        "declare": 57 /* DeclareKeyword */ ,
        "default": 14 /* DefaultKeyword */ ,
        "delete": 15 /* DeleteKeyword */ ,
        "do": 16 /* DoKeyword */ ,
        "else": 17 /* ElseKeyword */ ,
        "enum": 40 /* EnumKeyword */ ,
        "export": 41 /* ExportKeyword */ ,
        "extends": 42 /* ExtendsKeyword */ ,
        "false": 18 /* FalseKeyword */ ,
        "finally": 19 /* FinallyKeyword */ ,
        "for": 20 /* ForKeyword */ ,
        "function": 21 /* FunctionKeyword */ ,
        "get": 58 /* GetKeyword */ ,
        "if": 22 /* IfKeyword */ ,
        "implements": 45 /* ImplementsKeyword */ ,
        "import": 43 /* ImportKeyword */ ,
        "in": 23 /* InKeyword */ ,
        "instanceof": 24 /* InstanceOfKeyword */ ,
        "interface": 46 /* InterfaceKeyword */ ,
        "let": 47 /* LetKeyword */ ,
        "module": 59 /* ModuleKeyword */ ,
        "new": 25 /* NewKeyword */ ,
        "null": 26 /* NullKeyword */ ,
        "number": 60 /* NumberKeyword */ ,
        "package": 48 /* PackageKeyword */ ,
        "private": 49 /* PrivateKeyword */ ,
        "protected": 50 /* ProtectedKeyword */ ,
        "public": 51 /* PublicKeyword */ ,
        "return": 27 /* ReturnKeyword */ ,
        "set": 61 /* SetKeyword */ ,
        "static": 52 /* StaticKeyword */ ,
        "string": 62 /* StringKeyword */ ,
        "super": 44 /* SuperKeyword */ ,
        "switch": 28 /* SwitchKeyword */ ,
        "this": 29 /* ThisKeyword */ ,
        "throw": 30 /* ThrowKeyword */ ,
        "true": 31 /* TrueKeyword */ ,
        "try": 32 /* TryKeyword */ ,
        "typeof": 33 /* TypeOfKeyword */ ,
        "var": 34 /* VarKeyword */ ,
        "void": 35 /* VoidKeyword */ ,
        "while": 36 /* WhileKeyword */ ,
        "with": 37 /* WithKeyword */ ,
        "yield": 53 /* YieldKeyword */ ,
        "{": 63 /* OpenBraceToken */ ,
        "}": 64 /* CloseBraceToken */ ,
        "(": 65 /* OpenParenToken */ ,
        ")": 66 /* CloseParenToken */ ,
        "[": 67 /* OpenBracketToken */ ,
        "]": 68 /* CloseBracketToken */ ,
        ".": 69 /* DotToken */ ,
        "...": 70 /* DotDotDotToken */ ,
        ";": 71 /* SemicolonToken */ ,
        ",": 72 /* CommaToken */ ,
        "<": 73 /* LessThanToken */ ,
        ">": 74 /* GreaterThanToken */ ,
        "<=": 75 /* LessThanEqualsToken */ ,
        ">=": 76 /* GreaterThanEqualsToken */ ,
        "==": 77 /* EqualsEqualsToken */ ,
        "=>": 78 /* EqualsGreaterThanToken */ ,
        "!=": 79 /* ExclamationEqualsToken */ ,
        "===": 80 /* EqualsEqualsEqualsToken */ ,
        "!==": 81 /* ExclamationEqualsEqualsToken */ ,
        "+": 82 /* PlusToken */ ,
        "-": 83 /* MinusToken */ ,
        "*": 84 /* AsteriskToken */ ,
        "%": 85 /* PercentToken */ ,
        "++": 86 /* PlusPlusToken */ ,
        "--": 87 /* MinusMinusToken */ ,
        "<<": 88 /* LessThanLessThanToken */ ,
        ">>": 89 /* GreaterThanGreaterThanToken */ ,
        ">>>": 90 /* GreaterThanGreaterThanGreaterThanToken */ ,
        "&": 91 /* AmpersandToken */ ,
        "|": 92 /* BarToken */ ,
        "^": 93 /* CaretToken */ ,
        "!": 94 /* ExclamationToken */ ,
        "~": 95 /* TildeToken */ ,
        "&&": 96 /* AmpersandAmpersandToken */ ,
        "||": 97 /* BarBarToken */ ,
        "?": 98 /* QuestionToken */ ,
        ":": 99 /* ColonToken */ ,
        "=": 100 /* EqualsToken */ ,
        "+=": 101 /* PlusEqualsToken */ ,
        "-=": 102 /* MinusEqualsToken */ ,
        "*=": 103 /* AsteriskEqualsToken */ ,
        "%=": 104 /* PercentEqualsToken */ ,
        "<<=": 105 /* LessThanLessThanEqualsToken */ ,
        ">>=": 106 /* GreaterThanGreaterThanEqualsToken */ ,
        ">>>=": 107 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ,
        "&=": 108 /* AmpersandEqualsToken */ ,
        "|=": 109 /* BarEqualsToken */ ,
        "^=": 110 /* CaretEqualsToken */ ,
        "/": 111 /* SlashToken */ ,
        "/=": 112 /* SlashEqualsToken */ 
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
            case 82 /* PlusToken */ : {
                return 151 /* PlusExpression */ ;

            }
            case 83 /* MinusToken */ : {
                return 152 /* NegateExpression */ ;

            }
            case 95 /* TildeToken */ : {
                return 153 /* BitwiseNotExpression */ ;

            }
            case 94 /* ExclamationToken */ : {
                return 154 /* LogicalNotExpression */ ;

            }
            case 86 /* PlusPlusToken */ : {
                return 155 /* PreIncrementExpression */ ;

            }
            case 87 /* MinusMinusToken */ : {
                return 156 /* PreDecrementExpression */ ;

            }
            case 15 /* DeleteKeyword */ : {
                return 157 /* DeleteExpression */ ;

            }
            case 33 /* TypeOfKeyword */ : {
                return 158 /* TypeOfExpression */ ;

            }
            case 35 /* VoidKeyword */ : {
                return 159 /* VoidExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 86 /* PlusPlusToken */ : {
                return 202 /* PostIncrementExpression */ ;

            }
            case 87 /* MinusMinusToken */ : {
                return 203 /* PostDecrementExpression */ ;

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
            case 84 /* AsteriskToken */ : {
                return 197 /* MultiplyExpression */ ;

            }
            case 111 /* SlashToken */ : {
                return 198 /* DivideExpression */ ;

            }
            case 85 /* PercentToken */ : {
                return 199 /* ModuloExpression */ ;

            }
            case 82 /* PlusToken */ : {
                return 200 /* AddExpression */ ;

            }
            case 83 /* MinusToken */ : {
                return 201 /* SubtractExpression */ ;

            }
            case 88 /* LessThanLessThanToken */ : {
                return 194 /* LeftShiftExpression */ ;

            }
            case 89 /* GreaterThanGreaterThanToken */ : {
                return 195 /* SignedRightShiftExpression */ ;

            }
            case 90 /* GreaterThanGreaterThanGreaterThanToken */ : {
                return 196 /* UnsignedRightShiftExpression */ ;

            }
            case 73 /* LessThanToken */ : {
                return 188 /* LessThanExpression */ ;

            }
            case 74 /* GreaterThanToken */ : {
                return 189 /* GreaterThanExpression */ ;

            }
            case 75 /* LessThanEqualsToken */ : {
                return 190 /* LessThanOrEqualExpression */ ;

            }
            case 76 /* GreaterThanEqualsToken */ : {
                return 191 /* GreaterThanOrEqualExpression */ ;

            }
            case 24 /* InstanceOfKeyword */ : {
                return 192 /* InstanceOfExpression */ ;

            }
            case 23 /* InKeyword */ : {
                return 193 /* InExpression */ ;

            }
            case 77 /* EqualsEqualsToken */ : {
                return 184 /* EqualsWithTypeConversionExpression */ ;

            }
            case 79 /* ExclamationEqualsToken */ : {
                return 185 /* NotEqualsWithTypeConversionExpression */ ;

            }
            case 80 /* EqualsEqualsEqualsToken */ : {
                return 186 /* EqualsExpression */ ;

            }
            case 81 /* ExclamationEqualsEqualsToken */ : {
                return 187 /* NotEqualsExpression */ ;

            }
            case 91 /* AmpersandToken */ : {
                return 183 /* BitwiseAndExpression */ ;

            }
            case 93 /* CaretToken */ : {
                return 182 /* BitwiseExclusiveOrExpression */ ;

            }
            case 92 /* BarToken */ : {
                return 181 /* BitwiseOrExpression */ ;

            }
            case 96 /* AmpersandAmpersandToken */ : {
                return 180 /* LogicalAndExpression */ ;

            }
            case 97 /* BarBarToken */ : {
                return 179 /* LogicalOrExpression */ ;

            }
            case 109 /* BarEqualsToken */ : {
                return 174 /* OrAssignmentExpression */ ;

            }
            case 108 /* AmpersandEqualsToken */ : {
                return 172 /* AndAssignmentExpression */ ;

            }
            case 110 /* CaretEqualsToken */ : {
                return 173 /* ExclusiveOrAssignmentExpression */ ;

            }
            case 105 /* LessThanLessThanEqualsToken */ : {
                return 175 /* LeftShiftAssignmentExpression */ ;

            }
            case 106 /* GreaterThanGreaterThanEqualsToken */ : {
                return 176 /* SignedRightShiftAssignmentExpression */ ;

            }
            case 107 /* GreaterThanGreaterThanGreaterThanEqualsToken */ : {
                return 177 /* UnsignedRightShiftAssignmentExpression */ ;

            }
            case 101 /* PlusEqualsToken */ : {
                return 167 /* AddAssignmentExpression */ ;

            }
            case 102 /* MinusEqualsToken */ : {
                return 168 /* SubtractAssignmentExpression */ ;

            }
            case 103 /* AsteriskEqualsToken */ : {
                return 169 /* MultiplyAssignmentExpression */ ;

            }
            case 112 /* SlashEqualsToken */ : {
                return 170 /* DivideAssignmentExpression */ ;

            }
            case 104 /* PercentEqualsToken */ : {
                return 171 /* ModuloAssignmentExpression */ ;

            }
            case 100 /* EqualsToken */ : {
                return 166 /* AssignmentExpression */ ;

            }
            case 72 /* CommaToken */ : {
                return 165 /* CommaExpression */ ;

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
var SyntaxList;
(function (SyntaxList) {
    var EmptySyntaxList = (function () {
        function EmptySyntaxList() { }
        EmptySyntaxList.prototype.toJSON = function (key) {
            return [];
        };
        EmptySyntaxList.prototype.count = function () {
            return 0;
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
    SourceUnitSyntax.prototype.kind = function () {
        return 115 /* SourceUnit */ ;
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
        this._moduleKeyword = moduleKeyword;
        this._openParenToken = openParenToken;
        this._stringLiteral = stringLiteral;
        this._closeParenToken = closeParenToken;
    }
    ExternalModuleReferenceSyntax.prototype.kind = function () {
        return 238 /* ExternalModuleReference */ ;
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
    return ExternalModuleReferenceSyntax;
})(ModuleReferenceSyntax);
var ModuleNameModuleReference = (function (_super) {
    __extends(ModuleNameModuleReference, _super);
    function ModuleNameModuleReference(moduleName) {
        _super.call(this);
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
        this._importKeyword = importKeyword;
        this._identifier = identifier;
        this._equalsToken = equalsToken;
        this._moduleReference = moduleReference;
        this._semicolonToken = semicolonToken;
    }
    ImportDeclarationSyntax.prototype.kind = function () {
        return 128 /* ImportDeclaration */ ;
    };
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
    ClassDeclarationSyntax.prototype.kind = function () {
        return 126 /* ClassDeclaration */ ;
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
    InterfaceDeclarationSyntax.prototype.kind = function () {
        return 123 /* InterfaceDeclaration */ ;
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
        this._extendsKeyword = extendsKeyword;
        this._typeNames = typeNames;
    }
    ExtendsClauseSyntax.prototype.kind = function () {
        return 223 /* ExtendsClause */ ;
    };
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
        this._implementsKeyword = implementsKeyword;
        this._typeNames = typeNames;
    }
    ImplementsClauseSyntax.prototype.kind = function () {
        return 222 /* ImplementsClause */ ;
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
    function ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken) {
        _super.call(this);
        this._moduleKeyword = moduleKeyword;
        this._declareKeyword = declareKeyword;
        this._moduleName = moduleName;
        this._openBraceToken = openBraceToken;
        this._moduleElements = moduleElements;
        this._closeBraceToken = closeBraceToken;
    }
    ModuleDeclarationSyntax.prototype.kind = function () {
        return 125 /* ModuleDeclaration */ ;
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
    function FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken) {
        _super.call(this);
        this._exportKeyword = exportKeyword;
        this._declareKeyword = declareKeyword;
        this._functionKeyword = functionKeyword;
        this._functionSignature = functionSignature;
        this._semicolonToken = semicolonToken;
        this._block = block;
    }
    FunctionDeclarationSyntax.prototype.kind = function () {
        return 124 /* FunctionDeclaration */ ;
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
    VariableStatementSyntax.prototype.kind = function () {
        return 135 /* VariableStatement */ ;
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
        this._varKeyword = varKeyword;
        this._variableDeclarators = variableDeclarators;
    }
    VariableDeclarationSyntax.prototype.kind = function () {
        return 218 /* VariableDeclaration */ ;
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
        this._identifier = identifier;
        this._typeAnnotation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }
    VariableDeclaratorSyntax.prototype.kind = function () {
        return 219 /* VariableDeclarator */ ;
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
        this._equalsToken = equalsToken;
        this._value = value;
    }
    EqualsValueClauseSyntax.prototype.kind = function () {
        return 224 /* EqualsValueClause */ ;
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
        this._kind = 0 /* None */ ;
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
        this._thisKeyword = thisKeyword;
    }
    ThisExpressionSyntax.prototype.kind = function () {
        return 206 /* ThisExpression */ ;
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
        this._kind = 0 /* None */ ;
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
        this._openBracketToken = openBracketToken;
        this._expressions = expressions;
        this._closeBracketToken = closeBracketToken;
    }
    ArrayLiteralExpressionSyntax.prototype.kind = function () {
        return 207 /* ArrayLiteralExpression */ ;
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
    OmittedExpressionSyntax.prototype.kind = function () {
        return 217 /* OmittedExpression */ ;
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
    ParenthesizedExpressionSyntax.prototype.kind = function () {
        return 210 /* ParenthesizedExpression */ ;
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
var SimpleArrowFunctionExpression = (function (_super) {
    __extends(SimpleArrowFunctionExpression, _super);
    function SimpleArrowFunctionExpression(identifier, equalsGreaterThanToken, body) {
        _super.call(this, equalsGreaterThanToken, body);
        this._identifier = identifier;
    }
    SimpleArrowFunctionExpression.prototype.kind = function () {
        return 212 /* SimpleArrowFunctionExpression */ ;
    };
    SimpleArrowFunctionExpression.prototype.identifier = function () {
        return this._identifier;
    };
    return SimpleArrowFunctionExpression;
})(ArrowFunctionExpressionSyntax);
var ParenthesizedArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ParenthesizedArrowFunctionExpressionSyntax, _super);
    function ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body) {
        _super.call(this, equalsGreaterThanToken, body);
        this._callSignature = callSignature;
    }
    ParenthesizedArrowFunctionExpressionSyntax.prototype.kind = function () {
        return 211 /* ParenthesizedArrowFunctionExpression */ ;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.callSignature = function () {
        return this._callSignature;
    };
    return ParenthesizedArrowFunctionExpressionSyntax;
})(ArrowFunctionExpressionSyntax);
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
        this._identifier = identifier;
    }
    IdentifierNameSyntax.prototype.kind = function () {
        return 116 /* IdentifierName */ ;
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
        this._left = left;
        this._dotToken = dotToken;
        this._right = right;
    }
    QualifiedNameSyntax.prototype.kind = function () {
        return 117 /* QualifiedName */ ;
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
    ConstructorTypeSyntax.prototype.kind = function () {
        return 122 /* ConstructorType */ ;
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
    FunctionTypeSyntax.prototype.kind = function () {
        return 120 /* FunctionType */ ;
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
        this._openBraceToken = openBraceToken;
        this._typeMembers = typeMembers;
        this._closeBraceToken = closeBraceToken;
    }
    ObjectTypeSyntax.prototype.kind = function () {
        return 118 /* ObjectType */ ;
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
        this._type = type;
        this._openBracketToken = openBracketToken;
        this._closeBracketToken = closeBracketToken;
    }
    ArrayTypeSyntax.prototype.kind = function () {
        return 121 /* ArrayType */ ;
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
        return 119 /* PredefinedType */ ;
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
        this._colonToken = colonToken;
        this._type = type;
    }
    TypeAnnotationSyntax.prototype.kind = function () {
        return 236 /* TypeAnnotation */ ;
    };
    TypeAnnotationSyntax.prototype.colonToken = function () {
        return this._colonToken;
    };
    TypeAnnotationSyntax.prototype.type = function () {
        return this._type;
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
    BlockSyntax.prototype.kind = function () {
        return 133 /* Block */ ;
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
        this._dotDotDotToken = dotDotDotToken;
        this._publicOrPrivateKeyword = publicOrPrivateKeyword;
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._typeAnontation = typeAnnotation;
        this._equalsValueClause = equalsValueClause;
    }
    ParameterSyntax.prototype.kind = function () {
        return 235 /* Parameter */ ;
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
        this._expression = expression;
        this._dotToken = dotToken;
        this._identifierName = identifierName;
    }
    MemberAccessExpressionSyntax.prototype.kind = function () {
        return 204 /* MemberAccessExpression */ ;
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
        this._kind = 0 /* None */ ;
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
        this._expression = expression;
        this._openBracketToken = openBracketToken;
        this._argumentExpression = argumentExpression;
        this._closeBracketToken = closeBracketToken;
    }
    ElementAccessExpressionSyntax.prototype.kind = function () {
        return 214 /* ElementAccessExpression */ ;
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
        this._expression = expression;
        this._argumentList = argumentList;
    }
    InvocationExpressionSyntax.prototype.kind = function () {
        return 205 /* InvocationExpression */ ;
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
        this._openParenToken = openParenToken;
        this._arguments = arguments;
        this._closeParenToken = closeParenToken;
    }
    ArgumentListSyntax.prototype.kind = function () {
        return 221 /* ArgumentList */ ;
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
        this._kind = 0 /* None */ ;
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
        this._condition = condition;
        this._questionToken = questionToken;
        this._whenTrue = whenTrue;
        this._colonToken = colonToken;
        this._whenFalse = whenFalse;
    }
    ConditionalExpressionSyntax.prototype.kind = function () {
        return 178 /* ConditionalExpression */ ;
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
    return ConditionalExpressionSyntax;
})(ExpressionSyntax);
var TypeMemberSyntax = (function (_super) {
    __extends(TypeMemberSyntax, _super);
    function TypeMemberSyntax(typeAnnotation) {
        _super.call(this);
        this._typeAnnotation = typeAnnotation;
    }
    TypeMemberSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    return TypeMemberSyntax;
})(SyntaxNode);
var ConstructSignatureSyntax = (function (_super) {
    __extends(ConstructSignatureSyntax, _super);
    function ConstructSignatureSyntax(newKeyword, parameterList, typeAnnotation) {
        _super.call(this, typeAnnotation);
        this._newKeyword = newKeyword;
        this._parameterList = parameterList;
    }
    ConstructSignatureSyntax.prototype.kind = function () {
        return 232 /* ConstructSignature */ ;
    };
    ConstructSignatureSyntax.prototype.newKeyword = function () {
        return this._newKeyword;
    };
    ConstructSignatureSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    return ConstructSignatureSyntax;
})(TypeMemberSyntax);
var FunctionSignatureSyntax = (function (_super) {
    __extends(FunctionSignatureSyntax, _super);
    function FunctionSignatureSyntax(identifier, questionToken, parameterList, typeAnnotation) {
        _super.call(this, typeAnnotation);
        this._identifier = identifier;
        this._questionToken = questionToken;
        this._parameterList = parameterList;
    }
    FunctionSignatureSyntax.prototype.kind = function () {
        return 234 /* FunctionSignature */ ;
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
    return FunctionSignatureSyntax;
})(TypeMemberSyntax);
var IndexSignatureSyntax = (function (_super) {
    __extends(IndexSignatureSyntax, _super);
    function IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation) {
        _super.call(this, typeAnnotation);
        this._openBracketToken = openBracketToken;
        this._parameter = parameter;
        this._closeBracketToken = closeBracketToken;
    }
    IndexSignatureSyntax.prototype.kind = function () {
        return 233 /* IndexSignature */ ;
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
    return IndexSignatureSyntax;
})(TypeMemberSyntax);
var PropertySignatureSyntax = (function (_super) {
    __extends(PropertySignatureSyntax, _super);
    function PropertySignatureSyntax(identifier, questionToken, typeAnnotation) {
        _super.call(this, typeAnnotation);
        this._identifier = identifier;
        this._questionToken = questionToken;
    }
    PropertySignatureSyntax.prototype.kind = function () {
        return 230 /* PropertySignature */ ;
    };
    PropertySignatureSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    PropertySignatureSyntax.prototype.questionToken = function () {
        return this._questionToken;
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
    ParameterListSyntax.prototype.kind = function () {
        return 220 /* ParameterList */ ;
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
        _super.call(this, typeAnnotation);
        this._parameterList = parameterList;
    }
    CallSignatureSyntax.prototype.kind = function () {
        return 231 /* CallSignature */ ;
    };
    CallSignatureSyntax.prototype.parameterList = function () {
        return this._parameterList;
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
    ElseClauseSyntax.prototype.kind = function () {
        return 227 /* ElseClause */ ;
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
        this._ifKeyword = ifKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._statement = statement;
        this._elseClause = elseClause;
    }
    IfStatementSyntax.prototype.kind = function () {
        return 134 /* IfStatement */ ;
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
        this._expression = expression;
        this._semicolonToken = semicolonToken;
    }
    ExpressionStatementSyntax.prototype.kind = function () {
        return 136 /* ExpressionStatement */ ;
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
        this._constructorKeyword = constructorKeyword;
        this._parameterList = parameterList;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    ConstructorDeclarationSyntax.prototype.kind = function () {
        return 130 /* ConstructorDeclaration */ ;
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
        this._functionSignature = functionSignature;
        this._block = block;
        this._semicolonToken = semicolonToken;
    }
    MemberFunctionDeclarationSyntax.prototype.kind = function () {
        return 129 /* MemberFunctionDeclaration */ ;
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
    function MemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword);
        this._identifier = identifier;
        this._parameterList = parameterList;
        this._block = block;
    }
    MemberAccessorDeclarationSyntax.prototype.identifier = function () {
        return this._identifier;
    };
    MemberAccessorDeclarationSyntax.prototype.parameterList = function () {
        return this._parameterList;
    };
    MemberAccessorDeclarationSyntax.prototype.block = function () {
        return this._block;
    };
    return MemberAccessorDeclarationSyntax;
})(MemberDeclarationSyntax);
var GetMemberAccessorDeclarationSyntax = (function (_super) {
    __extends(GetMemberAccessorDeclarationSyntax, _super);
    function GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block);
        this._getKeyword = getKeyword;
        this._typeAnnotation = typeAnnotation;
    }
    GetMemberAccessorDeclarationSyntax.prototype.kind = function () {
        return 131 /* GetMemberAccessorDeclaration */ ;
    };
    GetMemberAccessorDeclarationSyntax.prototype.getKeyword = function () {
        return this._getKeyword;
    };
    GetMemberAccessorDeclarationSyntax.prototype.typeAnnotation = function () {
        return this._typeAnnotation;
    };
    return GetMemberAccessorDeclarationSyntax;
})(MemberAccessorDeclarationSyntax);
var SetMemberAccessorDeclarationSyntax = (function (_super) {
    __extends(SetMemberAccessorDeclarationSyntax, _super);
    function SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block);
        this._setKeyword = setKeyword;
    }
    SetMemberAccessorDeclarationSyntax.prototype.kind = function () {
        return 132 /* SetMemberAccessorDeclaration */ ;
    };
    SetMemberAccessorDeclarationSyntax.prototype.setKeyword = function () {
        return this._setKeyword;
    };
    return SetMemberAccessorDeclarationSyntax;
})(MemberAccessorDeclarationSyntax);
var MemberVariableDeclarationSyntax = (function (_super) {
    __extends(MemberVariableDeclarationSyntax, _super);
    function MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword);
        this._variableDeclarator = variableDeclarator;
        this._semicolonToken = semicolonToken;
    }
    MemberVariableDeclarationSyntax.prototype.kind = function () {
        return 129 /* MemberFunctionDeclaration */ ;
    };
    MemberVariableDeclarationSyntax.prototype.variableDeclarator = function () {
        return this._variableDeclarator;
    };
    MemberVariableDeclarationSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
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
    ThrowStatementSyntax.prototype.kind = function () {
        return 144 /* ThrowStatement */ ;
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
    ReturnStatementSyntax.prototype.kind = function () {
        return 137 /* ReturnStatement */ ;
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
        this._newKeyword = newKeyword;
        this._expression = expression;
        this._argumentList = argumentList;
    }
    ObjectCreationExpressionSyntax.prototype.kind = function () {
        return 209 /* ObjectCreationExpression */ ;
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
        this._switchKeyword = switchKeyword;
        this._openParenToken = openParenToken;
        this._expression = expression;
        this._closeParenToken = closeParenToken;
        this._openBraceToken = openBraceToken;
        this._caseClauses = caseClauses;
        this._closeBraceToken = closeBraceToken;
    }
    SwitchStatementSyntax.prototype.kind = function () {
        return 138 /* SwitchStatement */ ;
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
        this._caseKeyword = caseKeyword;
        this._expression = expression;
    }
    CaseSwitchClauseSyntax.prototype.kind = function () {
        return 225 /* CaseSwitchClause */ ;
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
        this._defaultKeyword = defaultKeyword;
    }
    DefaultSwitchClauseSyntax.prototype.kind = function () {
        return 226 /* DefaultSwitchClause */ ;
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
        this._breakKeyword = breakKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }
    BreakStatementSyntax.prototype.kind = function () {
        return 139 /* BreakStatement */ ;
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
var ContinueStatementSyntax = (function (_super) {
    __extends(ContinueStatementSyntax, _super);
    function ContinueStatementSyntax(continueKeyword, identifier, semicolonToken) {
        _super.call(this);
        this._continueKeyword = continueKeyword;
        this._identifier = identifier;
        this._semicolonToken = semicolonToken;
    }
    ContinueStatementSyntax.prototype.kind = function () {
        return 140 /* ContinueStatement */ ;
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
    return ContinueStatementSyntax;
})(StatementSyntax);
var IterationStatementSyntax = (function (_super) {
    __extends(IterationStatementSyntax, _super);
    function IterationStatementSyntax(statement) {
        _super.call(this);
        this._statement = statement;
    }
    IterationStatementSyntax.prototype.statement = function () {
        return this._statement;
    };
    return IterationStatementSyntax;
})(StatementSyntax);
var BaseForStatementSyntax = (function (_super) {
    __extends(BaseForStatementSyntax, _super);
    function BaseForStatementSyntax(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement) {
        _super.call(this, statement);
        this._forKeyword = forKeyword;
        this._openParenToken = openParenToken;
        this._variableDeclaration = variableDeclaration;
        this._closeParenToken = closeParenToken;
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
    return BaseForStatementSyntax;
})(IterationStatementSyntax);
var ForStatementSyntax = (function (_super) {
    __extends(ForStatementSyntax, _super);
    function ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
        _super.call(this, forKeyword, openParenToken, variableDeclaration, closeParenToken, statement);
        this._initializer = initializer;
        this._firstSemicolonToken = firstSemicolonToken;
        this._condition = condition;
        this._secondSemicolonToken = secondSemicolonToken;
        this._incrementor = incrementor;
    }
    ForStatementSyntax.prototype.kind = function () {
        return 141 /* ForStatement */ ;
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
        this._left = left;
        this._inKeyword = inKeyword;
        this._expression = expression;
    }
    ForInStatementSyntax.prototype.kind = function () {
        return 142 /* ForInStatement */ ;
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
var WhileStatementSyntax = (function (_super) {
    __extends(WhileStatementSyntax, _super);
    function WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement) {
        _super.call(this, statement);
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
    }
    WhileStatementSyntax.prototype.kind = function () {
        return 145 /* WhileStatement */ ;
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
    WithStatementSyntax.prototype.kind = function () {
        return 150 /* WithStatement */ ;
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
    EnumDeclarationSyntax.prototype.kind = function () {
        return 127 /* EnumDeclaration */ ;
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
        this._lessThanToken = lessThanToken;
        this._type = type;
        this._greaterThanToken = greaterThanToken;
        this._expression = expression;
    }
    CastExpressionSyntax.prototype.kind = function () {
        return 213 /* CastExpression */ ;
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
        this._openBraceToken = openBraceToken;
        this._propertyAssignments = propertyAssignments;
        this._closeBraceToken = closeBraceToken;
    }
    ObjectLiteralExpressionSyntax.prototype.kind = function () {
        return 208 /* ObjectLiteralExpression */ ;
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
        this._colonToken = colonToken;
        this._expression = expression;
    }
    SimplePropertyAssignmentSyntax.prototype.kind = function () {
        return 237 /* SimplePropertyAssignment */ ;
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
        this._getKeyword = getKeyword;
    }
    GetAccessorPropertyAssignmentSyntax.prototype.kind = function () {
        return 239 /* GetAccessorPropertyAssignment */ ;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.getKeyword = function () {
        return this._getKeyword;
    };
    return GetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var SetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(SetAccessorPropertyAssignmentSyntax, _super);
    function SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
        _super.call(this, propertyName, openParenToken, closeParenToken, block);
        this._setKeyword = setKeyword;
        this._parameterName = parameterName;
    }
    SetAccessorPropertyAssignmentSyntax.prototype.kind = function () {
        return 240 /* SetAccessorPropertyAssignment */ ;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.setKeyword = function () {
        return this._setKeyword;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.parameterName = function () {
        return this._parameterName;
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
    FunctionExpressionSyntax.prototype.kind = function () {
        return 215 /* FunctionExpression */ ;
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
    return FunctionExpressionSyntax;
})(UnaryExpressionSyntax);
var EmptyStatementSyntax = (function (_super) {
    __extends(EmptyStatementSyntax, _super);
    function EmptyStatementSyntax(semicolonToken) {
        _super.call(this);
        this._semicolonToken = semicolonToken;
    }
    EmptyStatementSyntax.prototype.kind = function () {
        return 143 /* EmptyStatement */ ;
    };
    EmptyStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return EmptyStatementSyntax;
})(StatementSyntax);
var SuperExpressionSyntax = (function (_super) {
    __extends(SuperExpressionSyntax, _super);
    function SuperExpressionSyntax(superKeyword) {
        _super.call(this);
        this._superKeyword = superKeyword;
    }
    SuperExpressionSyntax.prototype.kind = function () {
        return 216 /* SuperExpression */ ;
    };
    SuperExpressionSyntax.prototype.superKeyword = function () {
        return this._superKeyword;
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
    TryStatementSyntax.prototype.kind = function () {
        return 146 /* TryStatement */ ;
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
    CatchClauseSyntax.prototype.kind = function () {
        return 228 /* CatchClause */ ;
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
    return CatchClauseSyntax;
})(SyntaxNode);
var FinallyClauseSyntax = (function (_super) {
    __extends(FinallyClauseSyntax, _super);
    function FinallyClauseSyntax(finallyKeyword, block) {
        _super.call(this);
        this._finallyKeyword = finallyKeyword;
        this._block = block;
    }
    FinallyClauseSyntax.prototype.kind = function () {
        return 229 /* FinallyClause */ ;
    };
    FinallyClauseSyntax.prototype.finallyKeyword = function () {
        return this._finallyKeyword;
    };
    FinallyClauseSyntax.prototype.block = function () {
        return this._block;
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
    LabeledStatement.prototype.kind = function () {
        return 147 /* LabeledStatement */ ;
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
    return LabeledStatement;
})(StatementSyntax);
var DoStatementSyntax = (function (_super) {
    __extends(DoStatementSyntax, _super);
    function DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken) {
        _super.call(this, statement);
        this._doKeyword = doKeyword;
        this._whileKeyword = whileKeyword;
        this._openParenToken = openParenToken;
        this._condition = condition;
        this._closeParenToken = closeParenToken;
        this._semicolonToken = semicolonToken;
    }
    DoStatementSyntax.prototype.kind = function () {
        return 148 /* DoStatement */ ;
    };
    DoStatementSyntax.prototype.doKeyword = function () {
        return this._doKeyword;
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
    return DoStatementSyntax;
})(IterationStatementSyntax);
var TypeOfExpressionSyntax = (function (_super) {
    __extends(TypeOfExpressionSyntax, _super);
    function TypeOfExpressionSyntax(typeOfKeyword, expression) {
        _super.call(this);
        this._typeOfKeyword = typeOfKeyword;
        this._expression = expression;
    }
    TypeOfExpressionSyntax.prototype.kind = function () {
        return 158 /* TypeOfExpression */ ;
    };
    TypeOfExpressionSyntax.prototype.typeOfKeyword = function () {
        return this._typeOfKeyword;
    };
    TypeOfExpressionSyntax.prototype.expression = function () {
        return this._expression;
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
    DeleteExpressionSyntax.prototype.kind = function () {
        return 157 /* DeleteExpression */ ;
    };
    DeleteExpressionSyntax.prototype.deleteKeyword = function () {
        return this._deleteKeyword;
    };
    DeleteExpressionSyntax.prototype.expression = function () {
        return this._expression;
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
    VoidExpressionSyntax.prototype.kind = function () {
        return 159 /* VoidExpression */ ;
    };
    VoidExpressionSyntax.prototype.voidKeyword = function () {
        return this._voidKeyword;
    };
    VoidExpressionSyntax.prototype.expression = function () {
        return this._expression;
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
    DebuggerStatementSyntax.prototype.kind = function () {
        return 149 /* DebuggerStatement */ ;
    };
    DebuggerStatementSyntax.prototype.debuggerKeyword = function () {
        return this._debuggerKeyword;
    };
    DebuggerStatementSyntax.prototype.semicolonToken = function () {
        return this._semicolonToken;
    };
    return DebuggerStatementSyntax;
})(StatementSyntax);
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
            kind: (SyntaxKind)._map[token.kind]
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
            this.kind = kind;
            this._keywordKind = keywordKind;
        }
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
            this.kind = kind;
            this._fullStart = fullStart;
        }
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
            return SyntaxFacts.getText(this.kind);
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }
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
            return SyntaxFacts.getText(this.kind);
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
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
            return SyntaxFacts.getText(this.kind);
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
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
            return SyntaxFacts.getText(this.kind);
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
            this.kind = 5 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
        }
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
            this.kind = 5 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }
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
            this.kind = 5 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
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
            this.kind = 5 /* IdentifierNameToken */ ;
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._value = value;
        }
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._value = value;
        }
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._value = value;
        }
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
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._value = value;
        }
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
var negative262ExpectedResults = {
    'Sbp_12.5_A9_T3.js': false,
    'Sbp_12.6.1_A13_T3.js': false,
    'Sbp_12.6.2_A13_T3.js': false,
    'Sbp_12.6.4_A13_T3.js': false,
    'Sbp_7.8.4_A6.1_T4.js': false,
    'Sbp_7.8.4_A6.2_T1.js': false,
    'Sbp_7.8.4_A6.2_T2.js': false,
    'Sbp_A1_T1.js': true,
    'Sbp_A2_T1.js': true,
    'Sbp_A2_T2.js': true,
    'Sbp_A3_T1.js': true,
    'Sbp_A3_T2.js': true,
    'Sbp_A4_T1.js': true,
    'Sbp_A4_T2.js': true,
    'Sbp_A5_T1.js': true,
    'Sbp_A5_T2.js': true,
    'S7.2_A5_T1.js': false,
    'S7.2_A5_T2.js': false,
    'S7.2_A5_T3.js': false,
    'S7.2_A5_T4.js': false,
    'S7.2_A5_T5.js': false,
    'S7.3_A2.1_T1.js': true,
    'S7.3_A2.1_T2.js': false,
    'S7.3_A2.2_T1.js': true,
    'S7.3_A2.2_T2.js': false,
    'S7.3_A2.3.js': true,
    'S7.3_A2.4.js': true,
    'S7.3_A3.1_T1.js': true,
    'S7.3_A3.1_T2.js': true,
    'S7.3_A3.1_T3.js': false,
    'S7.3_A3.2_T1.js': true,
    'S7.3_A3.2_T2.js': true,
    'S7.3_A3.2_T3.js': false,
    'S7.3_A3.3_T1.js': true,
    'S7.3_A3.3_T2.js': true,
    'S7.3_A3.4_T1.js': true,
    'S7.3_A3.4_T2.js': true,
    'S7.3_A6_T1.js': false,
    'S7.3_A6_T2.js': false,
    'S7.3_A6_T3.js': false,
    'S7.3_A6_T4.js': false,
    'S7.4_A2_T2.js': false,
    'S7.4_A3.js': false,
    'S7.4_A4_T1.js': false,
    'S7.4_A4_T4.js': false,
    'S7.6.1.1_A1.1.js': false,
    'S7.6.1.1_A1.10.js': false,
    'S7.6.1.1_A1.11.js': false,
    'S7.6.1.1_A1.12.js': false,
    'S7.6.1.1_A1.13.js': false,
    'S7.6.1.1_A1.14.js': false,
    'S7.6.1.1_A1.15.js': false,
    'S7.6.1.1_A1.16.js': false,
    'S7.6.1.1_A1.17.js': false,
    'S7.6.1.1_A1.18.js': true,
    'S7.6.1.1_A1.19.js': false,
    'S7.6.1.1_A1.2.js': false,
    'S7.6.1.1_A1.20.js': false,
    'S7.6.1.1_A1.21.js': false,
    'S7.6.1.1_A1.22.js': false,
    'S7.6.1.1_A1.23.js': false,
    'S7.6.1.1_A1.24.js': false,
    'S7.6.1.1_A1.25.js': false,
    'S7.6.1.1_A1.3.js': false,
    'S7.6.1.1_A1.4.js': false,
    'S7.6.1.1_A1.5.js': false,
    'S7.6.1.1_A1.6.js': false,
    'S7.6.1.1_A1.7.js': false,
    'S7.6.1.1_A1.8.js': false,
    'S7.6.1.1_A1.9.js': false,
    'S7.6.1.2_A1.10.js': false,
    'S7.6.1.2_A1.11.js': false,
    'S7.6.1.2_A1.15.js': false,
    'S7.6.1.2_A1.16.js': false,
    'S7.6.1.2_A1.18.js': false,
    'S7.6.1.2_A1.21.js': false,
    'S7.6.1.2_A1.22.js': false,
    'S7.6.1.2_A1.23.js': false,
    'S7.6.1.2_A1.24.js': false,
    'S7.6.1.2_A1.26.js': false,
    'S7.6.1.2_A1.27.js': false,
    'S7.6.1.2_A1.5.js': false,
    'S7.6.1.2_A1.6.js': false,
    'S7.6.1.2_A1.7.js': false,
    'S7.6.1.2_A1.9.js': false,
    '7.6.1.2-1gs.js': false,
    'S7.6.1_A1.1.js': true,
    'S7.6.1_A1.2.js': true,
    'S7.6.1_A1.3.js': true,
    'S7.7_A2_T1.js': false,
    'S7.7_A2_T10.js': false,
    'S7.7_A2_T2.js': false,
    'S7.7_A2_T3.js': false,
    'S7.7_A2_T4.js': false,
    'S7.7_A2_T5.js': false,
    'S7.7_A2_T6.js': false,
    'S7.7_A2_T7.js': false,
    'S7.7_A2_T8.js': false,
    'S7.7_A2_T9.js': false,
    '7.8.3-1gs.js': true,
    '7.8.3-2gs.js': true,
    '7.8.3-3gs.js': true,
    'S7.8.3_A4.1_T1.js': true,
    'S7.8.3_A4.1_T2.js': true,
    'S7.8.3_A4.1_T3.js': true,
    'S7.8.3_A4.1_T4.js': true,
    'S7.8.3_A4.1_T5.js': true,
    'S7.8.3_A4.1_T6.js': true,
    'S7.8.3_A4.1_T7.js': true,
    'S7.8.3_A4.1_T8.js': true,
    'S7.8.3_A6.1_T1.js': false,
    'S7.8.3_A6.1_T2.js': false,
    'S7.8.3_A6.2_T1.js': false,
    'S7.8.3_A6.2_T2.js': false,
    '7.8.4-1gs.js': true,
    'S7.8.4_A1.1_T1.js': false,
    'S7.8.4_A1.1_T2.js': false,
    'S7.8.4_A1.2_T1.js': false,
    'S7.8.4_A1.2_T2.js': false,
    'S7.8.4_A3.1_T1.js': false,
    'S7.8.4_A3.1_T2.js': false,
    'S7.8.4_A3.2_T1.js': false,
    'S7.8.4_A3.2_T2.js': false,
    'S7.8.4_A4.3_T1.js': true,
    'S7.8.4_A4.3_T2.js': true,
    'S7.8.4_A7.1_T4.js': false,
    'S7.8.4_A7.2_T1.js': false,
    'S7.8.4_A7.2_T2.js': false,
    'S7.8.4_A7.2_T3.js': false,
    'S7.8.4_A7.2_T4.js': false,
    'S7.8.4_A7.2_T5.js': false,
    'S7.8.4_A7.2_T6.js': false,
    '7.8.5-1gs.js': false,
    'S7.8.5_A1.2_T1.js': false,
    'S7.8.5_A1.2_T2.js': false,
    'S7.8.5_A1.2_T3.js': false,
    'S7.8.5_A1.2_T4.js': false,
    'S7.8.5_A1.3_T1.js': false,
    'S7.8.5_A1.3_T3.js': false,
    'S7.8.5_A1.5_T1.js': false,
    'S7.8.5_A1.5_T3.js': false,
    'S7.8.5_A2.2_T1.js': false,
    'S7.8.5_A2.2_T2.js': false,
    'S7.8.5_A2.3_T1.js': false,
    'S7.8.5_A2.3_T3.js': false,
    'S7.8.5_A2.5_T1.js': false,
    'S7.8.5_A2.5_T3.js': false,
    'S7.9.2_A1_T1.js': false,
    'S7.9.2_A1_T3.js': false,
    'S7.9.2_A1_T6.js': false,
    'S7.9_A10_T2.js': false,
    'S7.9_A10_T4.js': false,
    'S7.9_A10_T6.js': false,
    'S7.9_A10_T8.js': false,
    'S7.9_A11_T4.js': false,
    'S7.9_A11_T8.js': false,
    'S7.9_A4.js': false,
    'S7.9_A5.1_T1.js': false,
    'S7.9_A5.3_T1.js': false,
    'S7.9_A5.7_T1.js': true,
    'S7.9_A6.2_T1.js': false,
    'S7.9_A6.2_T10.js': false,
    'S7.9_A6.2_T2.js': false,
    'S7.9_A6.2_T3.js': false,
    'S7.9_A6.2_T4.js': false,
    'S7.9_A6.2_T5.js': false,
    'S7.9_A6.2_T6.js': false,
    'S7.9_A6.2_T7.js': false,
    'S7.9_A6.2_T8.js': false,
    'S7.9_A6.2_T9.js': false,
    'S7.9_A6.3_T1.js': false,
    'S7.9_A6.3_T2.js': false,
    'S7.9_A6.3_T3.js': false,
    'S7.9_A6.3_T4.js': false,
    'S7.9_A6.3_T5.js': false,
    'S7.9_A6.3_T6.js': false,
    'S7.9_A6.3_T7.js': false,
    'S7.9_A6.4_T1.js': false,
    'S7.9_A6.4_T2.js': false,
    'S7.9_A7_T7.js': true,
    'S7.9_A9_T6.js': false,
    'S7.9_A9_T7.js': false,
    'S7.9_A9_T8.js': false,
    'S8.2_A2.js': false,
    'S8.3_A2.1.js': true,
    'S8.3_A2.2.js': true,
    'S8.4_A13_T1.js': false,
    'S8.4_A13_T2.js': false,
    'S8.4_A13_T3.js': false,
    'S8.4_A14_T1.js': false,
    'S8.4_A14_T2.js': false,
    'S8.4_A14_T3.js': false,
    'S8.4_A7.1.js': true,
    'S8.4_A7.2.js': true,
    'S8.4_A7.3.js': true,
    'S8.4_A7.4.js': true,
    'S8.6.2_A7.js': true,
    '8.7.2-3-a-1gs.js': true,
    '8.7.2-3-a-2gs.js': true,
    'S8.7.2_A1_T1.js': true,
    'S8.7.2_A1_T2.js': true,
    '10.1.1-2gs.js': false,
    '10.1.1-5gs.js': false,
    '10.1.1-8gs.js': false,
    '10.4.2.1-1gs.js': true,
    '10.5-1gs.js': true,
    '10.6-2gs.js': true,
    'S11.1.1_A1.js': true,
    '11.1.5-1gs.js': true,
    '11.1.5-2gs.js': true,
    '11.13.1-4-28gs.js': true,
    '11.13.1-4-29gs.js': true,
    'S11.13.1_A2.1_T3.js': true,
    '11.13.2-6-1gs.js': true,
    'S11.13.2_A2.2_T1.js': true,
    'S11.13.2_A2.2_T10.js': true,
    'S11.13.2_A2.2_T11.js': true,
    'S11.13.2_A2.2_T2.js': true,
    'S11.13.2_A2.2_T3.js': true,
    'S11.13.2_A2.2_T4.js': true,
    'S11.13.2_A2.2_T5.js': true,
    'S11.13.2_A2.2_T6.js': true,
    'S11.13.2_A2.2_T7.js': true,
    'S11.13.2_A2.2_T8.js': true,
    'S11.13.2_A2.2_T9.js': true,
    'S11.2.4_A1.3_T1.js': false,
    '11.3.1-2-1gs.js': true,
    'S11.3.1_A1.1_T1.js': true,
    'S11.3.1_A1.1_T2.js': true,
    'S11.3.1_A1.1_T3.js': true,
    'S11.3.1_A1.1_T4.js': true,
    'S11.3.1_A2.1_T3.js': true,
    'S11.3.2_A1.1_T1.js': true,
    'S11.3.2_A1.1_T2.js': true,
    'S11.3.2_A1.1_T3.js': true,
    'S11.3.2_A1.1_T4.js': true,
    'S11.3.2_A2.1_T3.js': true,
    '11.4.1-5-a-5gs.js': true,
    'S11.4.2_A2_T2.js': true,
    'S11.4.4_A2.1_T3.js': true,
    '11.4.5-2-2gs.js': true,
    'S11.4.5_A2.1_T3.js': true,
    'S12.1_A4_T1.js': false,
    'S12.1_A4_T2.js': false,
    '12.10.1-11gs.js': true,
    'S12.11_A2_T1.js': true,
    'S12.11_A3_T1.js': false,
    'S12.11_A3_T2.js': false,
    'S12.11_A3_T3.js': false,
    'S12.11_A3_T4.js': false,
    'S12.11_A3_T5.js': false,
    'S12.13_A1.js': true,
    '12.14.1-1gs.js': true,
    'S12.14_A16_T1.js': false,
    'S12.14_A16_T10.js': false,
    'S12.14_A16_T11.js': false,
    'S12.14_A16_T12.js': false,
    'S12.14_A16_T13.js': false,
    'S12.14_A16_T14.js': false,
    'S12.14_A16_T15.js': false,
    'S12.14_A16_T2.js': false,
    'S12.14_A16_T3.js': false,
    'S12.14_A16_T4.js': false,
    'S12.14_A16_T5.js': false,
    'S12.14_A16_T6.js': false,
    'S12.14_A16_T7.js': false,
    'S12.14_A16_T8.js': false,
    'S12.14_A16_T9.js': false,
    '12.2.1-1gs.js': true,
    '12.2.1-4gs.js': true,
    'S12.2_A8_T1.js': false,
    'S12.2_A8_T2.js': false,
    'S12.2_A8_T3.js': false,
    'S12.2_A8_T4.js': false,
    'S12.2_A8_T5.js': false,
    'S12.2_A8_T6.js': false,
    'S12.2_A8_T7.js': false,
    'S12.2_A8_T8.js': false,
    'S12.4_A1.js': false,
    'S12.5_A11.js': false,
    'S12.5_A2.js': true,
    'S12.5_A6_T1.js': false,
    'S12.5_A6_T2.js': false,
    'S12.5_A8.js': false,
    'S12.6.1_A12.js': false,
    'S12.6.1_A15.js': false,
    'S12.6.1_A6_T1.js': false,
    'S12.6.1_A6_T2.js': false,
    'S12.6.1_A6_T3.js': false,
    'S12.6.1_A6_T4.js': false,
    'S12.6.1_A6_T5.js': false,
    'S12.6.1_A6_T6.js': false,
    'S12.6.2_A15.js': false,
    'S12.6.2_A6_T1.js': false,
    'S12.6.2_A6_T2.js': false,
    'S12.6.2_A6_T3.js': false,
    'S12.6.2_A6_T4.js': false,
    'S12.6.2_A6_T5.js': false,
    'S12.6.2_A6_T6.js': false,
    'S12.6.3_A11.1_T3.js': true,
    'S12.6.3_A11_T3.js': true,
    'S12.6.3_A12.1_T3.js': true,
    'S12.6.3_A12_T3.js': true,
    'S12.6.3_A4.1.js': false,
    'S12.6.3_A4_T1.js': false,
    'S12.6.3_A4_T2.js': false,
    'S12.6.3_A7.1_T1.js': false,
    'S12.6.3_A7.1_T2.js': false,
    'S12.6.3_A7_T1.js': false,
    'S12.6.3_A7_T2.js': false,
    'S12.6.3_A8.1_T1.js': false,
    'S12.6.3_A8.1_T2.js': false,
    'S12.6.3_A8.1_T3.js': false,
    'S12.6.3_A8_T1.js': false,
    'S12.6.3_A8_T2.js': false,
    'S12.6.3_A8_T3.js': false,
    'S12.6.4_A15.js': false,
    'S12.7_A1_T1.js': true,
    'S12.7_A1_T2.js': true,
    'S12.7_A1_T3.js': true,
    'S12.7_A1_T4.js': true,
    'S12.7_A5_T1.js': true,
    'S12.7_A5_T2.js': true,
    'S12.7_A5_T3.js': true,
    'S12.7_A6.js': true,
    'S12.7_A8_T1.js': true,
    'S12.7_A8_T2.js': true,
    'S12.8_A1_T1.js': true,
    'S12.8_A1_T2.js': true,
    'S12.8_A1_T3.js': true,
    'S12.8_A1_T4.js': true,
    'S12.8_A5_T1.js': true,
    'S12.8_A5_T2.js': true,
    'S12.8_A5_T3.js': true,
    'S12.8_A6.js': true,
    'S12.8_A8_T1.js': true,
    'S12.8_A8_T2.js': true,
    'S12.9_A1_T1.js': true,
    'S12.9_A1_T10.js': true,
    'S12.9_A1_T2.js': true,
    'S12.9_A1_T3.js': true,
    'S12.9_A1_T4.js': true,
    'S12.9_A1_T5.js': true,
    'S12.9_A1_T6.js': true,
    'S12.9_A1_T7.js': true,
    'S12.9_A1_T8.js': true,
    'S12.9_A1_T9.js': true,
    '13.0_4-17gs.js': true,
    '13.0_4-5gs.js': true,
    'S13_A7_T3.js': false,
    '13.1-13gs.js': true,
    '13.1-1gs.js': true,
    '13.1-4gs.js': true,
    '13.1-5gs.js': true,
    '13.1-8gs.js': true,
    '13.2-19-b-3gs.js': true,
    '14.1-4gs.js': true,
    '14.1-5gs.js': true,
    'S15.1.2.1_A2_T2.js': true,
    'S15.1_A1_T1.js': true,
    'S15.1_A1_T2.js': true,
    'S15.1_A2_T1.js': true,
    'S15.2.4.3_A12.js': true,
    'S15.2.4.3_A13.js': true,
    'S15.2.4.4_A12.js': true,
    'S15.2.4.4_A13.js': true,
    'S15.2.4.4_A14.js': true,
    'S15.2.4.4_A15.js': true,
    'S15.2.4.5_A12.js': true,
    'S15.2.4.5_A13.js': true,
    'S15.2.4.6_A12.js': true,
    'S15.2.4.6_A13.js': true,
    'S15.2.4.7_A12.js': true,
    'S15.2.4.7_A13.js': true,
    '15.3.2.1-10-4gs.js': true,
    '15.3.2.1-10-6gs.js': true,
    'S15.3.4.2_A12.js': true,
    'S15.3.4.2_A13.js': true,
    'S15.3.4.2_A14.js': true,
    'S15.3.4.2_A15.js': true,
    'S15.3.4.2_A16.js': true,
    'S15.3.4.3_A13.js': true,
    'S15.3.4.3_A14.js': true,
    'S15.3.4.3_A15.js': true,
    'S15.3.4.4_A13.js': true,
    'S15.3.4.4_A14.js': true,
    'S15.3.4.4_A15.js': true,
    'S15.3.4.5_A1.js': true,
    'S15.3.4.5_A13.js': true,
    'S15.3.4.5_A14.js': true,
    'S15.3.4.5_A15.js': true,
    'S15.3.4.5_A2.js': true,
    '15.3.5.4_2-10gs.js': true,
    '15.3.5.4_2-11gs.js': true,
    '15.3.5.4_2-13gs.js': true,
    '15.3.5.4_2-15gs.js': true,
    '15.3.5.4_2-16gs.js': true,
    '15.3.5.4_2-17gs.js': true,
    '15.3.5.4_2-18gs.js': true,
    '15.3.5.4_2-19gs.js': true,
    '15.3.5.4_2-1gs.js': true,
    '15.3.5.4_2-20gs.js': true,
    '15.3.5.4_2-21gs.js': true,
    '15.3.5.4_2-22gs.js': true,
    '15.3.5.4_2-23gs.js': true,
    '15.3.5.4_2-24gs.js': true,
    '15.3.5.4_2-25gs.js': true,
    '15.3.5.4_2-26gs.js': true,
    '15.3.5.4_2-27gs.js': true,
    '15.3.5.4_2-28gs.js': true,
    '15.3.5.4_2-29gs.js': true,
    '15.3.5.4_2-2gs.js': true,
    '15.3.5.4_2-30gs.js': true,
    '15.3.5.4_2-31gs.js': true,
    '15.3.5.4_2-32gs.js': true,
    '15.3.5.4_2-33gs.js': true,
    '15.3.5.4_2-34gs.js': true,
    '15.3.5.4_2-35gs.js': true,
    '15.3.5.4_2-36gs.js': true,
    '15.3.5.4_2-37gs.js': true,
    '15.3.5.4_2-38gs.js': true,
    '15.3.5.4_2-39gs.js': true,
    '15.3.5.4_2-3gs.js': true,
    '15.3.5.4_2-40gs.js': true,
    '15.3.5.4_2-41gs.js': true,
    '15.3.5.4_2-42gs.js': true,
    '15.3.5.4_2-43gs.js': true,
    '15.3.5.4_2-44gs.js': true,
    '15.3.5.4_2-45gs.js': true,
    '15.3.5.4_2-46gs.js': true,
    '15.3.5.4_2-47gs.js': true,
    '15.3.5.4_2-48gs.js': true,
    '15.3.5.4_2-49gs.js': true,
    '15.3.5.4_2-4gs.js': true,
    '15.3.5.4_2-50gs.js': true,
    '15.3.5.4_2-51gs.js': true,
    '15.3.5.4_2-52gs.js': true,
    '15.3.5.4_2-53gs.js': true,
    '15.3.5.4_2-54gs.js': true,
    '15.3.5.4_2-55gs.js': true,
    '15.3.5.4_2-56gs.js': true,
    '15.3.5.4_2-57gs.js': true,
    '15.3.5.4_2-58gs.js': true,
    '15.3.5.4_2-59gs.js': true,
    '15.3.5.4_2-5gs.js': true,
    '15.3.5.4_2-60gs.js': true,
    '15.3.5.4_2-61gs.js': true,
    '15.3.5.4_2-62gs.js': true,
    '15.3.5.4_2-63gs.js': true,
    '15.3.5.4_2-64gs.js': true,
    '15.3.5.4_2-65gs.js': true,
    '15.3.5.4_2-66gs.js': true,
    '15.3.5.4_2-67gs.js': true,
    '15.3.5.4_2-68gs.js': true,
    '15.3.5.4_2-69gs.js': true,
    '15.3.5.4_2-6gs.js': true,
    '15.3.5.4_2-70gs.js': true,
    '15.3.5.4_2-71gs.js': true,
    '15.3.5.4_2-72gs.js': true,
    '15.3.5.4_2-73gs.js': true,
    '15.3.5.4_2-74gs.js': true,
    '15.3.5.4_2-7gs.js': true,
    '15.3.5.4_2-8gs.js': true,
    '15.3.5.4_2-94gs.js': true,
    '15.3.5.4_2-95gs.js': true,
    '15.3.5.4_2-96gs.js': true,
    '15.3.5.4_2-97gs.js': true,
    '15.3.5.4_2-9gs.js': true,
    '15.3.5-1gs.js': true,
    '15.3.5-2gs.js': true
};
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
var Program = (function () {
    function Program(environment) {
        this.environment = environment;
    }
    Program.prototype.run = function () {
        if(this.environment.arguments.length !== 3) {
            this.environment.standardOut.WriteLine("Usage: tsc.exe --out <out_file> <in_file>");
            return;
        }
        var inputFile = this.environment.arguments[2];
        var outputFile = this.environment.arguments[1];
        var contents = this.environment.readFile(inputFile, 'utf-8');
        var parser = new Parser(new Scanner(new StringText(contents), 1 /* EcmaScript5 */ , new StringTable()));
        var syntaxTree = parser.parseSyntaxTree();
        var diagnostics = syntaxTree.diagnostics();
        if(diagnostics.length) {
            this.environment.standardOut.WriteLine("Error parsing: " + inputFile);
            this.environment.writeFile(outputFile, "", false);
        } else {
            this.environment.writeFile(outputFile, contents, true);
        }
    };
    return Program;
})();
var program = new Program(Environment);
program.run();
