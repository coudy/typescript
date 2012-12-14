var Errors = (function () {
    function Errors() { }
    Errors.argument = function argument(argument, message) {
        return new Error("Invalid argument: " + argument + "." + (message ? (" " + message) : ""));
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
    Errors.invalidOperation = function invalidOperation(message) {
        return new Error(message ? ("Invalid operation: " + message) : "Invalid operation.");
    }
    return Errors;
})();
var ArrayUtilities = (function () {
    function ArrayUtilities() { }
    ArrayUtilities.isArray = function isArray(value) {
        return Object.prototype.toString.apply(value, []) === '[object Array]';
    }
    ArrayUtilities.groupBy = function groupBy(array, func) {
        var result = {
        };
        for(var i = 0, n = array.length; i < n; i++) {
            var v = array[i];
            var k = func(v);
            var list = result[k] || [];
            list.push(v);
            result[k] = list;
        }
        return result;
    }
    ArrayUtilities.min = function min(array, func) {
        Debug.assert(array.length > 0);
        var min = func(array[0]);
        for(var i = 1; i < array.length; i++) {
            var next = func(array[i]);
            if(next < min) {
                min = next;
            }
        }
        return min;
    }
    ArrayUtilities.max = function max(array, func) {
        Debug.assert(array.length > 0);
        var max = func(array[0]);
        for(var i = 1; i < array.length; i++) {
            var next = func(array[i]);
            if(next > max) {
                max = next;
            }
        }
        return max;
    }
    ArrayUtilities.last = function last(array) {
        if(array.length === 0) {
            throw Errors.argumentOutOfRange('array');
        }
        return array[array.length - 1];
    }
    ArrayUtilities.firstOrDefault = function firstOrDefault(array, func) {
        for(var i = 0, n = array.length; i < n; i++) {
            var value = array[i];
            if(func(value)) {
                return value;
            }
        }
        return null;
    }
    ArrayUtilities.sum = function sum(array, func) {
        var result = 0;
        for(var i = 0, n = array.length; i < n; i++) {
            result += func(array[i]);
        }
        return result;
    }
    ArrayUtilities.select = function select(values, func) {
        var result = [];
        for(var i = 0; i < values.length; i++) {
            result.push(func(values[i]));
        }
        return result;
    }
    ArrayUtilities.where = function where(values, func) {
        var result = [];
        for(var i = 0; i < values.length; i++) {
            if(func(values[i])) {
                result.push(values[i]);
            }
        }
        return result;
    }
    ArrayUtilities.any = function any(array, func) {
        for(var i = 0, n = array.length; i < n; i++) {
            if(func(array[i])) {
                return true;
            }
        }
        return false;
    }
    ArrayUtilities.all = function all(array, func) {
        for(var i = 0, n = array.length; i < n; i++) {
            if(!func(array[i])) {
                return false;
            }
        }
        return true;
    }
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
    StringUtilities.copyTo = function copyTo(source, sourceIndex, destination, destinationIndex, count) {
        for(var i = 0; i < count; i++) {
            destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
        }
    }
    StringUtilities.repeat = function repeat(value, count) {
        return Array(count + 1).join(value);
    }
    return StringUtilities;
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
var SyntaxFacts = (function () {
    function SyntaxFacts() { }
    SyntaxFacts.textToKeywordKind = {
        "any": 58 /* AnyKeyword */ ,
        "bool": 59 /* BoolKeyword */ ,
        "break": 13 /* BreakKeyword */ ,
        "case": 14 /* CaseKeyword */ ,
        "catch": 15 /* CatchKeyword */ ,
        "class": 42 /* ClassKeyword */ ,
        "continue": 16 /* ContinueKeyword */ ,
        "const": 43 /* ConstKeyword */ ,
        "constructor": 60 /* ConstructorKeyword */ ,
        "debugger": 17 /* DebuggerKeyword */ ,
        "declare": 61 /* DeclareKeyword */ ,
        "default": 18 /* DefaultKeyword */ ,
        "delete": 19 /* DeleteKeyword */ ,
        "do": 20 /* DoKeyword */ ,
        "else": 21 /* ElseKeyword */ ,
        "enum": 44 /* EnumKeyword */ ,
        "export": 45 /* ExportKeyword */ ,
        "extends": 46 /* ExtendsKeyword */ ,
        "false": 22 /* FalseKeyword */ ,
        "finally": 23 /* FinallyKeyword */ ,
        "for": 24 /* ForKeyword */ ,
        "function": 25 /* FunctionKeyword */ ,
        "get": 62 /* GetKeyword */ ,
        "if": 26 /* IfKeyword */ ,
        "implements": 49 /* ImplementsKeyword */ ,
        "import": 47 /* ImportKeyword */ ,
        "in": 27 /* InKeyword */ ,
        "instanceof": 28 /* InstanceOfKeyword */ ,
        "interface": 50 /* InterfaceKeyword */ ,
        "let": 51 /* LetKeyword */ ,
        "module": 63 /* ModuleKeyword */ ,
        "new": 29 /* NewKeyword */ ,
        "null": 30 /* NullKeyword */ ,
        "number": 64 /* NumberKeyword */ ,
        "package": 52 /* PackageKeyword */ ,
        "private": 53 /* PrivateKeyword */ ,
        "protected": 54 /* ProtectedKeyword */ ,
        "public": 55 /* PublicKeyword */ ,
        "return": 31 /* ReturnKeyword */ ,
        "set": 65 /* SetKeyword */ ,
        "static": 56 /* StaticKeyword */ ,
        "string": 66 /* StringKeyword */ ,
        "super": 48 /* SuperKeyword */ ,
        "switch": 32 /* SwitchKeyword */ ,
        "this": 33 /* ThisKeyword */ ,
        "throw": 34 /* ThrowKeyword */ ,
        "true": 35 /* TrueKeyword */ ,
        "try": 36 /* TryKeyword */ ,
        "typeof": 37 /* TypeOfKeyword */ ,
        "var": 38 /* VarKeyword */ ,
        "void": 39 /* VoidKeyword */ ,
        "while": 40 /* WhileKeyword */ ,
        "with": 41 /* WithKeyword */ ,
        "yield": 57 /* YieldKeyword */ ,
        "{": 67 /* OpenBraceToken */ ,
        "}": 68 /* CloseBraceToken */ ,
        "(": 69 /* OpenParenToken */ ,
        ")": 70 /* CloseParenToken */ ,
        "[": 71 /* OpenBracketToken */ ,
        "]": 72 /* CloseBracketToken */ ,
        ".": 73 /* DotToken */ ,
        "...": 74 /* DotDotDotToken */ ,
        ";": 75 /* SemicolonToken */ ,
        ",": 76 /* CommaToken */ ,
        "<": 77 /* LessThanToken */ ,
        ">": 78 /* GreaterThanToken */ ,
        "<=": 79 /* LessThanEqualsToken */ ,
        ">=": 80 /* GreaterThanEqualsToken */ ,
        "==": 81 /* EqualsEqualsToken */ ,
        "=>": 82 /* EqualsGreaterThanToken */ ,
        "!=": 83 /* ExclamationEqualsToken */ ,
        "===": 84 /* EqualsEqualsEqualsToken */ ,
        "!==": 85 /* ExclamationEqualsEqualsToken */ ,
        "+": 86 /* PlusToken */ ,
        "-": 87 /* MinusToken */ ,
        "*": 88 /* AsteriskToken */ ,
        "%": 89 /* PercentToken */ ,
        "++": 90 /* PlusPlusToken */ ,
        "--": 91 /* MinusMinusToken */ ,
        "<<": 92 /* LessThanLessThanToken */ ,
        ">>": 93 /* GreaterThanGreaterThanToken */ ,
        ">>>": 94 /* GreaterThanGreaterThanGreaterThanToken */ ,
        "&": 95 /* AmpersandToken */ ,
        "|": 96 /* BarToken */ ,
        "^": 97 /* CaretToken */ ,
        "!": 98 /* ExclamationToken */ ,
        "~": 99 /* TildeToken */ ,
        "&&": 100 /* AmpersandAmpersandToken */ ,
        "||": 101 /* BarBarToken */ ,
        "?": 102 /* QuestionToken */ ,
        ":": 103 /* ColonToken */ ,
        "=": 104 /* EqualsToken */ ,
        "+=": 105 /* PlusEqualsToken */ ,
        "-=": 106 /* MinusEqualsToken */ ,
        "*=": 107 /* AsteriskEqualsToken */ ,
        "%=": 108 /* PercentEqualsToken */ ,
        "<<=": 109 /* LessThanLessThanEqualsToken */ ,
        ">>=": 110 /* GreaterThanGreaterThanEqualsToken */ ,
        ">>>=": 111 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ,
        "&=": 112 /* AmpersandEqualsToken */ ,
        "|=": 113 /* BarEqualsToken */ ,
        "^=": 114 /* CaretEqualsToken */ ,
        "/": 115 /* SlashToken */ ,
        "/=": 116 /* SlashEqualsToken */ 
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
            SyntaxFacts.kindToText[60 /* ConstructorKeyword */ ] = "constructor";
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
            case 86 /* PlusToken */ : {
                return 156 /* PlusExpression */ ;

            }
            case 87 /* MinusToken */ : {
                return 157 /* NegateExpression */ ;

            }
            case 99 /* TildeToken */ : {
                return 158 /* BitwiseNotExpression */ ;

            }
            case 98 /* ExclamationToken */ : {
                return 159 /* LogicalNotExpression */ ;

            }
            case 90 /* PlusPlusToken */ : {
                return 160 /* PreIncrementExpression */ ;

            }
            case 91 /* MinusMinusToken */ : {
                return 161 /* PreDecrementExpression */ ;

            }
            case 19 /* DeleteKeyword */ : {
                return 162 /* DeleteExpression */ ;

            }
            case 37 /* TypeOfKeyword */ : {
                return 163 /* TypeOfExpression */ ;

            }
            case 39 /* VoidKeyword */ : {
                return 164 /* VoidExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 90 /* PlusPlusToken */ : {
                return 207 /* PostIncrementExpression */ ;

            }
            case 91 /* MinusMinusToken */ : {
                return 208 /* PostDecrementExpression */ ;

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
            case 88 /* AsteriskToken */ : {
                return 202 /* MultiplyExpression */ ;

            }
            case 115 /* SlashToken */ : {
                return 203 /* DivideExpression */ ;

            }
            case 89 /* PercentToken */ : {
                return 204 /* ModuloExpression */ ;

            }
            case 86 /* PlusToken */ : {
                return 205 /* AddExpression */ ;

            }
            case 87 /* MinusToken */ : {
                return 206 /* SubtractExpression */ ;

            }
            case 92 /* LessThanLessThanToken */ : {
                return 199 /* LeftShiftExpression */ ;

            }
            case 93 /* GreaterThanGreaterThanToken */ : {
                return 200 /* SignedRightShiftExpression */ ;

            }
            case 94 /* GreaterThanGreaterThanGreaterThanToken */ : {
                return 201 /* UnsignedRightShiftExpression */ ;

            }
            case 77 /* LessThanToken */ : {
                return 193 /* LessThanExpression */ ;

            }
            case 78 /* GreaterThanToken */ : {
                return 194 /* GreaterThanExpression */ ;

            }
            case 79 /* LessThanEqualsToken */ : {
                return 195 /* LessThanOrEqualExpression */ ;

            }
            case 80 /* GreaterThanEqualsToken */ : {
                return 196 /* GreaterThanOrEqualExpression */ ;

            }
            case 28 /* InstanceOfKeyword */ : {
                return 197 /* InstanceOfExpression */ ;

            }
            case 27 /* InKeyword */ : {
                return 198 /* InExpression */ ;

            }
            case 81 /* EqualsEqualsToken */ : {
                return 189 /* EqualsWithTypeConversionExpression */ ;

            }
            case 83 /* ExclamationEqualsToken */ : {
                return 190 /* NotEqualsWithTypeConversionExpression */ ;

            }
            case 84 /* EqualsEqualsEqualsToken */ : {
                return 191 /* EqualsExpression */ ;

            }
            case 85 /* ExclamationEqualsEqualsToken */ : {
                return 192 /* NotEqualsExpression */ ;

            }
            case 95 /* AmpersandToken */ : {
                return 188 /* BitwiseAndExpression */ ;

            }
            case 97 /* CaretToken */ : {
                return 187 /* BitwiseExclusiveOrExpression */ ;

            }
            case 96 /* BarToken */ : {
                return 186 /* BitwiseOrExpression */ ;

            }
            case 100 /* AmpersandAmpersandToken */ : {
                return 185 /* LogicalAndExpression */ ;

            }
            case 101 /* BarBarToken */ : {
                return 184 /* LogicalOrExpression */ ;

            }
            case 113 /* BarEqualsToken */ : {
                return 179 /* OrAssignmentExpression */ ;

            }
            case 112 /* AmpersandEqualsToken */ : {
                return 177 /* AndAssignmentExpression */ ;

            }
            case 114 /* CaretEqualsToken */ : {
                return 178 /* ExclusiveOrAssignmentExpression */ ;

            }
            case 109 /* LessThanLessThanEqualsToken */ : {
                return 180 /* LeftShiftAssignmentExpression */ ;

            }
            case 110 /* GreaterThanGreaterThanEqualsToken */ : {
                return 181 /* SignedRightShiftAssignmentExpression */ ;

            }
            case 111 /* GreaterThanGreaterThanGreaterThanEqualsToken */ : {
                return 182 /* UnsignedRightShiftAssignmentExpression */ ;

            }
            case 105 /* PlusEqualsToken */ : {
                return 172 /* AddAssignmentExpression */ ;

            }
            case 106 /* MinusEqualsToken */ : {
                return 173 /* SubtractAssignmentExpression */ ;

            }
            case 107 /* AsteriskEqualsToken */ : {
                return 174 /* MultiplyAssignmentExpression */ ;

            }
            case 116 /* SlashEqualsToken */ : {
                return 175 /* DivideAssignmentExpression */ ;

            }
            case 108 /* PercentEqualsToken */ : {
                return 176 /* ModuloAssignmentExpression */ ;

            }
            case 104 /* EqualsToken */ : {
                return 171 /* AssignmentExpression */ ;

            }
            case 76 /* CommaToken */ : {
                return 170 /* CommaExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    return SyntaxFacts;
})();
var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind._map = [];
    SyntaxKind._map[0] = "None";
    SyntaxKind.None = 0;
    SyntaxKind._map[1] = "List";
    SyntaxKind.List = 1;
    SyntaxKind._map[2] = "SeparatedList";
    SyntaxKind.SeparatedList = 2;
    SyntaxKind._map[3] = "TriviaList";
    SyntaxKind.TriviaList = 3;
    SyntaxKind._map[4] = "WhitespaceTrivia";
    SyntaxKind.WhitespaceTrivia = 4;
    SyntaxKind._map[5] = "NewLineTrivia";
    SyntaxKind.NewLineTrivia = 5;
    SyntaxKind._map[6] = "MultiLineCommentTrivia";
    SyntaxKind.MultiLineCommentTrivia = 6;
    SyntaxKind._map[7] = "SingleLineCommentTrivia";
    SyntaxKind.SingleLineCommentTrivia = 7;
    SyntaxKind._map[8] = "SkippedTextTrivia";
    SyntaxKind.SkippedTextTrivia = 8;
    SyntaxKind._map[9] = "IdentifierNameToken";
    SyntaxKind.IdentifierNameToken = 9;
    SyntaxKind._map[10] = "RegularExpressionLiteral";
    SyntaxKind.RegularExpressionLiteral = 10;
    SyntaxKind._map[11] = "NumericLiteral";
    SyntaxKind.NumericLiteral = 11;
    SyntaxKind._map[12] = "StringLiteral";
    SyntaxKind.StringLiteral = 12;
    SyntaxKind._map[13] = "BreakKeyword";
    SyntaxKind.BreakKeyword = 13;
    SyntaxKind._map[14] = "CaseKeyword";
    SyntaxKind.CaseKeyword = 14;
    SyntaxKind._map[15] = "CatchKeyword";
    SyntaxKind.CatchKeyword = 15;
    SyntaxKind._map[16] = "ContinueKeyword";
    SyntaxKind.ContinueKeyword = 16;
    SyntaxKind._map[17] = "DebuggerKeyword";
    SyntaxKind.DebuggerKeyword = 17;
    SyntaxKind._map[18] = "DefaultKeyword";
    SyntaxKind.DefaultKeyword = 18;
    SyntaxKind._map[19] = "DeleteKeyword";
    SyntaxKind.DeleteKeyword = 19;
    SyntaxKind._map[20] = "DoKeyword";
    SyntaxKind.DoKeyword = 20;
    SyntaxKind._map[21] = "ElseKeyword";
    SyntaxKind.ElseKeyword = 21;
    SyntaxKind._map[22] = "FalseKeyword";
    SyntaxKind.FalseKeyword = 22;
    SyntaxKind._map[23] = "FinallyKeyword";
    SyntaxKind.FinallyKeyword = 23;
    SyntaxKind._map[24] = "ForKeyword";
    SyntaxKind.ForKeyword = 24;
    SyntaxKind._map[25] = "FunctionKeyword";
    SyntaxKind.FunctionKeyword = 25;
    SyntaxKind._map[26] = "IfKeyword";
    SyntaxKind.IfKeyword = 26;
    SyntaxKind._map[27] = "InKeyword";
    SyntaxKind.InKeyword = 27;
    SyntaxKind._map[28] = "InstanceOfKeyword";
    SyntaxKind.InstanceOfKeyword = 28;
    SyntaxKind._map[29] = "NewKeyword";
    SyntaxKind.NewKeyword = 29;
    SyntaxKind._map[30] = "NullKeyword";
    SyntaxKind.NullKeyword = 30;
    SyntaxKind._map[31] = "ReturnKeyword";
    SyntaxKind.ReturnKeyword = 31;
    SyntaxKind._map[32] = "SwitchKeyword";
    SyntaxKind.SwitchKeyword = 32;
    SyntaxKind._map[33] = "ThisKeyword";
    SyntaxKind.ThisKeyword = 33;
    SyntaxKind._map[34] = "ThrowKeyword";
    SyntaxKind.ThrowKeyword = 34;
    SyntaxKind._map[35] = "TrueKeyword";
    SyntaxKind.TrueKeyword = 35;
    SyntaxKind._map[36] = "TryKeyword";
    SyntaxKind.TryKeyword = 36;
    SyntaxKind._map[37] = "TypeOfKeyword";
    SyntaxKind.TypeOfKeyword = 37;
    SyntaxKind._map[38] = "VarKeyword";
    SyntaxKind.VarKeyword = 38;
    SyntaxKind._map[39] = "VoidKeyword";
    SyntaxKind.VoidKeyword = 39;
    SyntaxKind._map[40] = "WhileKeyword";
    SyntaxKind.WhileKeyword = 40;
    SyntaxKind._map[41] = "WithKeyword";
    SyntaxKind.WithKeyword = 41;
    SyntaxKind._map[42] = "ClassKeyword";
    SyntaxKind.ClassKeyword = 42;
    SyntaxKind._map[43] = "ConstKeyword";
    SyntaxKind.ConstKeyword = 43;
    SyntaxKind._map[44] = "EnumKeyword";
    SyntaxKind.EnumKeyword = 44;
    SyntaxKind._map[45] = "ExportKeyword";
    SyntaxKind.ExportKeyword = 45;
    SyntaxKind._map[46] = "ExtendsKeyword";
    SyntaxKind.ExtendsKeyword = 46;
    SyntaxKind._map[47] = "ImportKeyword";
    SyntaxKind.ImportKeyword = 47;
    SyntaxKind._map[48] = "SuperKeyword";
    SyntaxKind.SuperKeyword = 48;
    SyntaxKind._map[49] = "ImplementsKeyword";
    SyntaxKind.ImplementsKeyword = 49;
    SyntaxKind._map[50] = "InterfaceKeyword";
    SyntaxKind.InterfaceKeyword = 50;
    SyntaxKind._map[51] = "LetKeyword";
    SyntaxKind.LetKeyword = 51;
    SyntaxKind._map[52] = "PackageKeyword";
    SyntaxKind.PackageKeyword = 52;
    SyntaxKind._map[53] = "PrivateKeyword";
    SyntaxKind.PrivateKeyword = 53;
    SyntaxKind._map[54] = "ProtectedKeyword";
    SyntaxKind.ProtectedKeyword = 54;
    SyntaxKind._map[55] = "PublicKeyword";
    SyntaxKind.PublicKeyword = 55;
    SyntaxKind._map[56] = "StaticKeyword";
    SyntaxKind.StaticKeyword = 56;
    SyntaxKind._map[57] = "YieldKeyword";
    SyntaxKind.YieldKeyword = 57;
    SyntaxKind._map[58] = "AnyKeyword";
    SyntaxKind.AnyKeyword = 58;
    SyntaxKind._map[59] = "BoolKeyword";
    SyntaxKind.BoolKeyword = 59;
    SyntaxKind._map[60] = "ConstructorKeyword";
    SyntaxKind.ConstructorKeyword = 60;
    SyntaxKind._map[61] = "DeclareKeyword";
    SyntaxKind.DeclareKeyword = 61;
    SyntaxKind._map[62] = "GetKeyword";
    SyntaxKind.GetKeyword = 62;
    SyntaxKind._map[63] = "ModuleKeyword";
    SyntaxKind.ModuleKeyword = 63;
    SyntaxKind._map[64] = "NumberKeyword";
    SyntaxKind.NumberKeyword = 64;
    SyntaxKind._map[65] = "SetKeyword";
    SyntaxKind.SetKeyword = 65;
    SyntaxKind._map[66] = "StringKeyword";
    SyntaxKind.StringKeyword = 66;
    SyntaxKind._map[67] = "OpenBraceToken";
    SyntaxKind.OpenBraceToken = 67;
    SyntaxKind._map[68] = "CloseBraceToken";
    SyntaxKind.CloseBraceToken = 68;
    SyntaxKind._map[69] = "OpenParenToken";
    SyntaxKind.OpenParenToken = 69;
    SyntaxKind._map[70] = "CloseParenToken";
    SyntaxKind.CloseParenToken = 70;
    SyntaxKind._map[71] = "OpenBracketToken";
    SyntaxKind.OpenBracketToken = 71;
    SyntaxKind._map[72] = "CloseBracketToken";
    SyntaxKind.CloseBracketToken = 72;
    SyntaxKind._map[73] = "DotToken";
    SyntaxKind.DotToken = 73;
    SyntaxKind._map[74] = "DotDotDotToken";
    SyntaxKind.DotDotDotToken = 74;
    SyntaxKind._map[75] = "SemicolonToken";
    SyntaxKind.SemicolonToken = 75;
    SyntaxKind._map[76] = "CommaToken";
    SyntaxKind.CommaToken = 76;
    SyntaxKind._map[77] = "LessThanToken";
    SyntaxKind.LessThanToken = 77;
    SyntaxKind._map[78] = "GreaterThanToken";
    SyntaxKind.GreaterThanToken = 78;
    SyntaxKind._map[79] = "LessThanEqualsToken";
    SyntaxKind.LessThanEqualsToken = 79;
    SyntaxKind._map[80] = "GreaterThanEqualsToken";
    SyntaxKind.GreaterThanEqualsToken = 80;
    SyntaxKind._map[81] = "EqualsEqualsToken";
    SyntaxKind.EqualsEqualsToken = 81;
    SyntaxKind._map[82] = "EqualsGreaterThanToken";
    SyntaxKind.EqualsGreaterThanToken = 82;
    SyntaxKind._map[83] = "ExclamationEqualsToken";
    SyntaxKind.ExclamationEqualsToken = 83;
    SyntaxKind._map[84] = "EqualsEqualsEqualsToken";
    SyntaxKind.EqualsEqualsEqualsToken = 84;
    SyntaxKind._map[85] = "ExclamationEqualsEqualsToken";
    SyntaxKind.ExclamationEqualsEqualsToken = 85;
    SyntaxKind._map[86] = "PlusToken";
    SyntaxKind.PlusToken = 86;
    SyntaxKind._map[87] = "MinusToken";
    SyntaxKind.MinusToken = 87;
    SyntaxKind._map[88] = "AsteriskToken";
    SyntaxKind.AsteriskToken = 88;
    SyntaxKind._map[89] = "PercentToken";
    SyntaxKind.PercentToken = 89;
    SyntaxKind._map[90] = "PlusPlusToken";
    SyntaxKind.PlusPlusToken = 90;
    SyntaxKind._map[91] = "MinusMinusToken";
    SyntaxKind.MinusMinusToken = 91;
    SyntaxKind._map[92] = "LessThanLessThanToken";
    SyntaxKind.LessThanLessThanToken = 92;
    SyntaxKind._map[93] = "GreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanToken = 93;
    SyntaxKind._map[94] = "GreaterThanGreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 94;
    SyntaxKind._map[95] = "AmpersandToken";
    SyntaxKind.AmpersandToken = 95;
    SyntaxKind._map[96] = "BarToken";
    SyntaxKind.BarToken = 96;
    SyntaxKind._map[97] = "CaretToken";
    SyntaxKind.CaretToken = 97;
    SyntaxKind._map[98] = "ExclamationToken";
    SyntaxKind.ExclamationToken = 98;
    SyntaxKind._map[99] = "TildeToken";
    SyntaxKind.TildeToken = 99;
    SyntaxKind._map[100] = "AmpersandAmpersandToken";
    SyntaxKind.AmpersandAmpersandToken = 100;
    SyntaxKind._map[101] = "BarBarToken";
    SyntaxKind.BarBarToken = 101;
    SyntaxKind._map[102] = "QuestionToken";
    SyntaxKind.QuestionToken = 102;
    SyntaxKind._map[103] = "ColonToken";
    SyntaxKind.ColonToken = 103;
    SyntaxKind._map[104] = "EqualsToken";
    SyntaxKind.EqualsToken = 104;
    SyntaxKind._map[105] = "PlusEqualsToken";
    SyntaxKind.PlusEqualsToken = 105;
    SyntaxKind._map[106] = "MinusEqualsToken";
    SyntaxKind.MinusEqualsToken = 106;
    SyntaxKind._map[107] = "AsteriskEqualsToken";
    SyntaxKind.AsteriskEqualsToken = 107;
    SyntaxKind._map[108] = "PercentEqualsToken";
    SyntaxKind.PercentEqualsToken = 108;
    SyntaxKind._map[109] = "LessThanLessThanEqualsToken";
    SyntaxKind.LessThanLessThanEqualsToken = 109;
    SyntaxKind._map[110] = "GreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanEqualsToken = 110;
    SyntaxKind._map[111] = "GreaterThanGreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 111;
    SyntaxKind._map[112] = "AmpersandEqualsToken";
    SyntaxKind.AmpersandEqualsToken = 112;
    SyntaxKind._map[113] = "BarEqualsToken";
    SyntaxKind.BarEqualsToken = 113;
    SyntaxKind._map[114] = "CaretEqualsToken";
    SyntaxKind.CaretEqualsToken = 114;
    SyntaxKind._map[115] = "SlashToken";
    SyntaxKind.SlashToken = 115;
    SyntaxKind._map[116] = "SlashEqualsToken";
    SyntaxKind.SlashEqualsToken = 116;
    SyntaxKind._map[117] = "ErrorToken";
    SyntaxKind.ErrorToken = 117;
    SyntaxKind._map[118] = "EndOfFileToken";
    SyntaxKind.EndOfFileToken = 118;
    SyntaxKind._map[119] = "SourceUnit";
    SyntaxKind.SourceUnit = 119;
    SyntaxKind._map[120] = "IdentifierName";
    SyntaxKind.IdentifierName = 120;
    SyntaxKind._map[121] = "QualifiedName";
    SyntaxKind.QualifiedName = 121;
    SyntaxKind._map[122] = "ObjectType";
    SyntaxKind.ObjectType = 122;
    SyntaxKind._map[123] = "PredefinedType";
    SyntaxKind.PredefinedType = 123;
    SyntaxKind._map[124] = "FunctionType";
    SyntaxKind.FunctionType = 124;
    SyntaxKind._map[125] = "ArrayType";
    SyntaxKind.ArrayType = 125;
    SyntaxKind._map[126] = "ConstructorType";
    SyntaxKind.ConstructorType = 126;
    SyntaxKind._map[127] = "InterfaceDeclaration";
    SyntaxKind.InterfaceDeclaration = 127;
    SyntaxKind._map[128] = "FunctionDeclaration";
    SyntaxKind.FunctionDeclaration = 128;
    SyntaxKind._map[129] = "ModuleDeclaration";
    SyntaxKind.ModuleDeclaration = 129;
    SyntaxKind._map[130] = "ClassDeclaration";
    SyntaxKind.ClassDeclaration = 130;
    SyntaxKind._map[131] = "EnumDeclaration";
    SyntaxKind.EnumDeclaration = 131;
    SyntaxKind._map[132] = "ImportDeclaration";
    SyntaxKind.ImportDeclaration = 132;
    SyntaxKind._map[133] = "MemberFunctionDeclaration";
    SyntaxKind.MemberFunctionDeclaration = 133;
    SyntaxKind._map[134] = "MemberVariableDeclaration";
    SyntaxKind.MemberVariableDeclaration = 134;
    SyntaxKind._map[135] = "ConstructorDeclaration";
    SyntaxKind.ConstructorDeclaration = 135;
    SyntaxKind._map[136] = "GetMemberAccessorDeclaration";
    SyntaxKind.GetMemberAccessorDeclaration = 136;
    SyntaxKind._map[137] = "SetMemberAccessorDeclaration";
    SyntaxKind.SetMemberAccessorDeclaration = 137;
    SyntaxKind._map[138] = "Block";
    SyntaxKind.Block = 138;
    SyntaxKind._map[139] = "IfStatement";
    SyntaxKind.IfStatement = 139;
    SyntaxKind._map[140] = "VariableStatement";
    SyntaxKind.VariableStatement = 140;
    SyntaxKind._map[141] = "ExpressionStatement";
    SyntaxKind.ExpressionStatement = 141;
    SyntaxKind._map[142] = "ReturnStatement";
    SyntaxKind.ReturnStatement = 142;
    SyntaxKind._map[143] = "SwitchStatement";
    SyntaxKind.SwitchStatement = 143;
    SyntaxKind._map[144] = "BreakStatement";
    SyntaxKind.BreakStatement = 144;
    SyntaxKind._map[145] = "ContinueStatement";
    SyntaxKind.ContinueStatement = 145;
    SyntaxKind._map[146] = "ForStatement";
    SyntaxKind.ForStatement = 146;
    SyntaxKind._map[147] = "ForInStatement";
    SyntaxKind.ForInStatement = 147;
    SyntaxKind._map[148] = "EmptyStatement";
    SyntaxKind.EmptyStatement = 148;
    SyntaxKind._map[149] = "ThrowStatement";
    SyntaxKind.ThrowStatement = 149;
    SyntaxKind._map[150] = "WhileStatement";
    SyntaxKind.WhileStatement = 150;
    SyntaxKind._map[151] = "TryStatement";
    SyntaxKind.TryStatement = 151;
    SyntaxKind._map[152] = "LabeledStatement";
    SyntaxKind.LabeledStatement = 152;
    SyntaxKind._map[153] = "DoStatement";
    SyntaxKind.DoStatement = 153;
    SyntaxKind._map[154] = "DebuggerStatement";
    SyntaxKind.DebuggerStatement = 154;
    SyntaxKind._map[155] = "WithStatement";
    SyntaxKind.WithStatement = 155;
    SyntaxKind._map[156] = "PlusExpression";
    SyntaxKind.PlusExpression = 156;
    SyntaxKind._map[157] = "NegateExpression";
    SyntaxKind.NegateExpression = 157;
    SyntaxKind._map[158] = "BitwiseNotExpression";
    SyntaxKind.BitwiseNotExpression = 158;
    SyntaxKind._map[159] = "LogicalNotExpression";
    SyntaxKind.LogicalNotExpression = 159;
    SyntaxKind._map[160] = "PreIncrementExpression";
    SyntaxKind.PreIncrementExpression = 160;
    SyntaxKind._map[161] = "PreDecrementExpression";
    SyntaxKind.PreDecrementExpression = 161;
    SyntaxKind._map[162] = "DeleteExpression";
    SyntaxKind.DeleteExpression = 162;
    SyntaxKind._map[163] = "TypeOfExpression";
    SyntaxKind.TypeOfExpression = 163;
    SyntaxKind._map[164] = "VoidExpression";
    SyntaxKind.VoidExpression = 164;
    SyntaxKind._map[165] = "BooleanLiteralExpression";
    SyntaxKind.BooleanLiteralExpression = 165;
    SyntaxKind._map[166] = "NullLiteralExpression";
    SyntaxKind.NullLiteralExpression = 166;
    SyntaxKind._map[167] = "NumericLiteralExpression";
    SyntaxKind.NumericLiteralExpression = 167;
    SyntaxKind._map[168] = "RegularExpressionLiteralExpression";
    SyntaxKind.RegularExpressionLiteralExpression = 168;
    SyntaxKind._map[169] = "StringLiteralExpression";
    SyntaxKind.StringLiteralExpression = 169;
    SyntaxKind._map[170] = "CommaExpression";
    SyntaxKind.CommaExpression = 170;
    SyntaxKind._map[171] = "AssignmentExpression";
    SyntaxKind.AssignmentExpression = 171;
    SyntaxKind._map[172] = "AddAssignmentExpression";
    SyntaxKind.AddAssignmentExpression = 172;
    SyntaxKind._map[173] = "SubtractAssignmentExpression";
    SyntaxKind.SubtractAssignmentExpression = 173;
    SyntaxKind._map[174] = "MultiplyAssignmentExpression";
    SyntaxKind.MultiplyAssignmentExpression = 174;
    SyntaxKind._map[175] = "DivideAssignmentExpression";
    SyntaxKind.DivideAssignmentExpression = 175;
    SyntaxKind._map[176] = "ModuloAssignmentExpression";
    SyntaxKind.ModuloAssignmentExpression = 176;
    SyntaxKind._map[177] = "AndAssignmentExpression";
    SyntaxKind.AndAssignmentExpression = 177;
    SyntaxKind._map[178] = "ExclusiveOrAssignmentExpression";
    SyntaxKind.ExclusiveOrAssignmentExpression = 178;
    SyntaxKind._map[179] = "OrAssignmentExpression";
    SyntaxKind.OrAssignmentExpression = 179;
    SyntaxKind._map[180] = "LeftShiftAssignmentExpression";
    SyntaxKind.LeftShiftAssignmentExpression = 180;
    SyntaxKind._map[181] = "SignedRightShiftAssignmentExpression";
    SyntaxKind.SignedRightShiftAssignmentExpression = 181;
    SyntaxKind._map[182] = "UnsignedRightShiftAssignmentExpression";
    SyntaxKind.UnsignedRightShiftAssignmentExpression = 182;
    SyntaxKind._map[183] = "ConditionalExpression";
    SyntaxKind.ConditionalExpression = 183;
    SyntaxKind._map[184] = "LogicalOrExpression";
    SyntaxKind.LogicalOrExpression = 184;
    SyntaxKind._map[185] = "LogicalAndExpression";
    SyntaxKind.LogicalAndExpression = 185;
    SyntaxKind._map[186] = "BitwiseOrExpression";
    SyntaxKind.BitwiseOrExpression = 186;
    SyntaxKind._map[187] = "BitwiseExclusiveOrExpression";
    SyntaxKind.BitwiseExclusiveOrExpression = 187;
    SyntaxKind._map[188] = "BitwiseAndExpression";
    SyntaxKind.BitwiseAndExpression = 188;
    SyntaxKind._map[189] = "EqualsWithTypeConversionExpression";
    SyntaxKind.EqualsWithTypeConversionExpression = 189;
    SyntaxKind._map[190] = "NotEqualsWithTypeConversionExpression";
    SyntaxKind.NotEqualsWithTypeConversionExpression = 190;
    SyntaxKind._map[191] = "EqualsExpression";
    SyntaxKind.EqualsExpression = 191;
    SyntaxKind._map[192] = "NotEqualsExpression";
    SyntaxKind.NotEqualsExpression = 192;
    SyntaxKind._map[193] = "LessThanExpression";
    SyntaxKind.LessThanExpression = 193;
    SyntaxKind._map[194] = "GreaterThanExpression";
    SyntaxKind.GreaterThanExpression = 194;
    SyntaxKind._map[195] = "LessThanOrEqualExpression";
    SyntaxKind.LessThanOrEqualExpression = 195;
    SyntaxKind._map[196] = "GreaterThanOrEqualExpression";
    SyntaxKind.GreaterThanOrEqualExpression = 196;
    SyntaxKind._map[197] = "InstanceOfExpression";
    SyntaxKind.InstanceOfExpression = 197;
    SyntaxKind._map[198] = "InExpression";
    SyntaxKind.InExpression = 198;
    SyntaxKind._map[199] = "LeftShiftExpression";
    SyntaxKind.LeftShiftExpression = 199;
    SyntaxKind._map[200] = "SignedRightShiftExpression";
    SyntaxKind.SignedRightShiftExpression = 200;
    SyntaxKind._map[201] = "UnsignedRightShiftExpression";
    SyntaxKind.UnsignedRightShiftExpression = 201;
    SyntaxKind._map[202] = "MultiplyExpression";
    SyntaxKind.MultiplyExpression = 202;
    SyntaxKind._map[203] = "DivideExpression";
    SyntaxKind.DivideExpression = 203;
    SyntaxKind._map[204] = "ModuloExpression";
    SyntaxKind.ModuloExpression = 204;
    SyntaxKind._map[205] = "AddExpression";
    SyntaxKind.AddExpression = 205;
    SyntaxKind._map[206] = "SubtractExpression";
    SyntaxKind.SubtractExpression = 206;
    SyntaxKind._map[207] = "PostIncrementExpression";
    SyntaxKind.PostIncrementExpression = 207;
    SyntaxKind._map[208] = "PostDecrementExpression";
    SyntaxKind.PostDecrementExpression = 208;
    SyntaxKind._map[209] = "MemberAccessExpression";
    SyntaxKind.MemberAccessExpression = 209;
    SyntaxKind._map[210] = "InvocationExpression";
    SyntaxKind.InvocationExpression = 210;
    SyntaxKind._map[211] = "ThisExpression";
    SyntaxKind.ThisExpression = 211;
    SyntaxKind._map[212] = "ArrayLiteralExpression";
    SyntaxKind.ArrayLiteralExpression = 212;
    SyntaxKind._map[213] = "ObjectLiteralExpression";
    SyntaxKind.ObjectLiteralExpression = 213;
    SyntaxKind._map[214] = "ObjectCreationExpression";
    SyntaxKind.ObjectCreationExpression = 214;
    SyntaxKind._map[215] = "ParenthesizedExpression";
    SyntaxKind.ParenthesizedExpression = 215;
    SyntaxKind._map[216] = "ParenthesizedArrowFunctionExpression";
    SyntaxKind.ParenthesizedArrowFunctionExpression = 216;
    SyntaxKind._map[217] = "SimpleArrowFunctionExpression";
    SyntaxKind.SimpleArrowFunctionExpression = 217;
    SyntaxKind._map[218] = "CastExpression";
    SyntaxKind.CastExpression = 218;
    SyntaxKind._map[219] = "ElementAccessExpression";
    SyntaxKind.ElementAccessExpression = 219;
    SyntaxKind._map[220] = "FunctionExpression";
    SyntaxKind.FunctionExpression = 220;
    SyntaxKind._map[221] = "SuperExpression";
    SyntaxKind.SuperExpression = 221;
    SyntaxKind._map[222] = "OmittedExpression";
    SyntaxKind.OmittedExpression = 222;
    SyntaxKind._map[223] = "VariableDeclaration";
    SyntaxKind.VariableDeclaration = 223;
    SyntaxKind._map[224] = "VariableDeclarator";
    SyntaxKind.VariableDeclarator = 224;
    SyntaxKind._map[225] = "ParameterList";
    SyntaxKind.ParameterList = 225;
    SyntaxKind._map[226] = "ArgumentList";
    SyntaxKind.ArgumentList = 226;
    SyntaxKind._map[227] = "ImplementsClause";
    SyntaxKind.ImplementsClause = 227;
    SyntaxKind._map[228] = "ExtendsClause";
    SyntaxKind.ExtendsClause = 228;
    SyntaxKind._map[229] = "EqualsValueClause";
    SyntaxKind.EqualsValueClause = 229;
    SyntaxKind._map[230] = "CaseSwitchClause";
    SyntaxKind.CaseSwitchClause = 230;
    SyntaxKind._map[231] = "DefaultSwitchClause";
    SyntaxKind.DefaultSwitchClause = 231;
    SyntaxKind._map[232] = "ElseClause";
    SyntaxKind.ElseClause = 232;
    SyntaxKind._map[233] = "CatchClause";
    SyntaxKind.CatchClause = 233;
    SyntaxKind._map[234] = "FinallyClause";
    SyntaxKind.FinallyClause = 234;
    SyntaxKind._map[235] = "PropertySignature";
    SyntaxKind.PropertySignature = 235;
    SyntaxKind._map[236] = "CallSignature";
    SyntaxKind.CallSignature = 236;
    SyntaxKind._map[237] = "ConstructSignature";
    SyntaxKind.ConstructSignature = 237;
    SyntaxKind._map[238] = "IndexSignature";
    SyntaxKind.IndexSignature = 238;
    SyntaxKind._map[239] = "FunctionSignature";
    SyntaxKind.FunctionSignature = 239;
    SyntaxKind._map[240] = "Parameter";
    SyntaxKind.Parameter = 240;
    SyntaxKind._map[241] = "TypeAnnotation";
    SyntaxKind.TypeAnnotation = 241;
    SyntaxKind._map[242] = "SimplePropertyAssignment";
    SyntaxKind.SimplePropertyAssignment = 242;
    SyntaxKind._map[243] = "ExternalModuleReference";
    SyntaxKind.ExternalModuleReference = 243;
    SyntaxKind._map[244] = "ModuleNameModuleReference";
    SyntaxKind.ModuleNameModuleReference = 244;
    SyntaxKind._map[245] = "GetAccessorPropertyAssignment";
    SyntaxKind.GetAccessorPropertyAssignment = 245;
    SyntaxKind._map[246] = "SetAccessorPropertyAssignment";
    SyntaxKind.SetAccessorPropertyAssignment = 246;
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
var argumentChecks = false;
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
            }
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
            }
        ]
    }, 
    {
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            {
                name: 'moduleName',
                type: 'NameSyntax'
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
        ]
    }, 
    {
        name: 'ThisExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'thisKeyword',
                isToken: true
            }
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
            }
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
            }
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
            }
        ]
    }, 
    {
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        isAbstract: true,
        children: []
    }, 
    {
        name: 'SimpleArrowFunctionExpressionSyntax',
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
        ]
    }, 
    {
        name: 'EmptyStatementSyntax',
        baseType: 'StatementSyntax',
        children: [
            {
                name: 'semicolonToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'SuperExpressionSyntax',
        baseType: 'UnaryExpressionSyntax',
        children: [
            {
                name: 'superKeyword',
                isToken: true
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
        ]
    }
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
function pascalCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1);
}
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
    result += indent + "                throw Errors.argument('" + child.name + "');\r\n";
    return result;
}
function generateSwitchKindCheck(child, tokenKinds, indent) {
    if(tokenKinds.length === 0) {
        return "";
    }
    var result = "";
    var keywords = ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("Keyword") >= 0;
    });
    var tokens = ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("Keyword") < 0;
    });
    if(tokens.length === 0) {
        if(keywords.length <= 2) {
            return generateIfKindCheck(child, keywords, indent);
        } else {
            result += indent + "        switch (" + child.name + ".keywordKind()) {\r\n";
            result += generateSwitchCases(keywords, indent);
        }
    } else {
        result += indent + "        switch (" + child.name + ".kind()) {\r\n";
        result += generateSwitchCases(tokens, indent);
        if(keywords.length > 0) {
            result += generateSwitchCase("IdentifierNameToken", indent);
            result += generateSwitchKindCheck(child, keywords, indent + "        ");
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
        pascalCase(child.name)
    ];
    if(tokenKinds.length <= 2) {
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
        result += child.name + ": " + getType(child);
        if(i < definition.children.length - 1) {
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
        result += "        " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
    }
    result += "    }\r\n";
    return result;
}
function isMandatory(child) {
    return !child.isOptional && !child.isList && !child.isSeparatedList;
}
function generateFactoryMethod(definition) {
    var mandatoryChildren = ArrayUtilities.where(definition.children, isMandatory);
    if(mandatoryChildren.length === definition.children.length) {
        return "";
    }
    var result = "\r\n    public static create(";
    for(var i = 0; i < mandatoryChildren.length; i++) {
        var child = mandatoryChildren[i];
        result += child.name + ": " + getType(child);
        if(i < mandatoryChildren.length - 1) {
            result += ",\r\n                         ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(i > 0) {
            result += ", ";
        }
        if(isMandatory(child)) {
            result += child.name;
        } else {
            if(child.isList) {
                result += "SyntaxList.empty";
            } else {
                if(child.isSeparatedList) {
                    result += "SeparatedSyntaxList.empty";
                } else {
                    result += "null";
                }
            }
        }
    }
    result += ");\r\n";
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
function generateFirstMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public firstToken(): ISyntaxToken {\r\n";
        result += "        var token = null;\r\n";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(getType(child) === "SyntaxKind") {
                continue;
            }
            if(child.name === "endOfFileToken") {
                continue;
            }
            result += "        if (";
            if(child.isOptional) {
                result += getPropertyAccess(child) + " !== null && ";
            }
            if(child.isToken) {
                result += getPropertyAccess(child) + ".width() > 0";
                result += ") { return " + getPropertyAccess(child) + "; }\r\n";
            } else {
                result += "(token = " + getPropertyAccess(child) + ".firstToken()) !== null";
                result += ") { return token; }\r\n";
            }
        }
        if(definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        return null;\r\n";
        }
        result += "    }\r\n";
    }
    return result;
}
function baseType(definition) {
    return ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === definition.baseType;
    });
}
function derivesFrom(def1, def2) {
    var current = def1;
    while(current !== null) {
        var base = baseType(current);
        if(base === def2) {
            return true;
        }
        current = base;
    }
    return false;
}
function contains(definition, child) {
    return ArrayUtilities.any(definition.children, function (c) {
        return c.name === child.name && c.isList === child.isList && c.isSeparatedList === child.isSeparatedList && c.isToken === child.isToken && c.type === child.type;
    });
}
function generateAccessors(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += "\r\n";
        result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
        result += "        return " + getPropertyAccess(child) + ";\r\n";
        result += "    }\r\n";
    }
    if(definition.isAbstract) {
        var subclasses = ArrayUtilities.where(definitions, function (d) {
            return !d.isAbstract && derivesFrom(d, definition);
        });
        if(subclasses.length > 0) {
            var firstSubclass = subclasses[0];
            for(var i = 0; i < firstSubclass.children.length; i++) {
                var child = firstSubclass.children[i];
                if(ArrayUtilities.all(subclasses, function (s) {
                    return contains(s, child);
                })) {
                    result += "\r\n";
                    result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
                    result += "        throw Errors.abstract();\r\n";
                    result += "    }\r\n";
                }
            }
        }
    }
    return result;
}
function generateWithMethod(definition, child) {
    var result = "";
    result += "\r\n";
    result += "    public with" + pascalCase(child.name) + "(" + getSafeName(child) + ": " + getType(child) + "): " + definition.name + " {\r\n";
    result += "        return this.update(";
    for(var i = 0; i < definition.children.length; i++) {
        if(i > 0) {
            result += ", ";
        }
        if(definition.children[i] === child) {
            result += getSafeName(child);
        } else {
            result += getPropertyAccess(definition.children[i]);
        }
    }
    result += ");\r\n";
    result += "    }\r\n";
    return result;
}
function generateWithMethods(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += this.generateWithMethod(definition, child);
    }
    return result;
}
function generateUpdateMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "";
    result += "\r\n";
    if(definition.children.length <= 1) {
        result += "    private ";
    } else {
        result += "    public ";
    }
    result += "update(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += getSafeName(child) + ": " + getType(child);
        if(i < definition.children.length - 1) {
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
function generateCollectTextElements(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private collectTextElements(elements: string[]) {\r\n";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child.type === "SyntaxKind") {
            continue;
        }
        if(child.isOptional) {
            result += "        if (" + getPropertyAccess(child) + " !== null) { " + getPropertyAccess(child) + ".collectTextElements(elements); }\r\n";
        } else {
            result += "        " + getPropertyAccess(child) + ".collectTextElements(elements);\r\n";
        }
    }
    result += "    }\r\n";
    return result;
}
function generateNode(definition) {
    var result = "class " + definition.name + " extends " + definition.baseType + " {\r\n";
    hasKind = false;
    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateFactoryMethod(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateIsMissingMethod(definition);
    result += generateFirstMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);
    result += generateWithMethods(definition);
    result += generateCollectTextElements(definition);
    result += "}";
    return result;
}
function generateNodes() {
    var result = "///<reference path='References.ts' />";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        result += "\r\n\r\n";
        result += generateNode(definition);
    }
    return result;
}
function generateRewriter() {
    var result = "";
    result += "///<reference path='References.ts' />\r\n" + "\r\n" + "class SyntaxRewriter implements ISyntaxVisitor1 {\r\n" + "    public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" + "        return token;\r\n" + "    }\r\n" + "\r\n" + "    public visitNode(node: SyntaxNode): SyntaxNode {\r\n" + "        return node === null ? null : node.accept1(this);\r\n" + "    }\r\n" + "\r\n" + "    public visitList(list: ISyntaxList): ISyntaxList {\r\n" + "        var newItems: SyntaxNode[] = null;\r\n" + "\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "            var item = list.syntaxNodeAt(i);\r\n" + "            var newItem = <SyntaxNode>item.accept1(this);\r\n" + "\r\n" + "            if (item !== newItem && newItems === null) {\r\n" + "                newItems = [];\r\n" + "                for (var j = 0; j < i; j++) {\r\n" + "                    newItems.push(list.syntaxNodeAt(j));\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            if (newItems) {\r\n" + "                newItems.push(newItem);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        Debug.assert(newItems === null || newItems.length === list.count());\r\n" + "        return newItems === null ? list : SyntaxList.create(newItems);\r\n" + "    }\r\n" + "\r\n" + "    public visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" + "        var newItems: any[] = null;\r\n" + "\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "            var item = list.itemAt(i);\r\n" + "            var newItem = item.isToken() ? <ISyntaxElement>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" + "\r\n" + "            if (item !== newItem && newItems === null) {\r\n" + "                newItems = [];\r\n" + "                for (var j = 0; j < i; j++) {\r\n" + "                    newItems.push(list.itemAt(j));\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            if (newItems) {\r\n" + "                newItems.push(newItem);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        Debug.assert(newItems === null || newItems.length === list.count());\r\n" + "        return newItems === null ? list : SeparatedSyntaxList.create(newItems);\r\n" + "    }\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "    public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
        if(definition.children.length === 0) {
            result += "        return node;\r\n";
            result += "    }\r\n";
            continue;
        }
        if(definition.children.length === 1) {
            result += "        return node.with" + pascalCase(definition.children[0].name) + "(\r\n";
        } else {
            result += "        return node.update(\r\n";
        }
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
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
            if(j < definition.children.length - 1) {
                result += ",\r\n";
            }
        }
        result += ");\r\n";
        result += "    }\r\n";
    }
    result += "}";
    return result;
}
function generateToken(isPunctuation, isKeyword, leading, trailing) {
    var isFixedWidth = isPunctuation || isKeyword;
    var isVariableWidth = !isFixedWidth;
    var hasAnyTrivia = leading || trailing;
    var result = "    class ";
    var needsSourcetext = hasAnyTrivia || isVariableWidth;
    var className = isKeyword ? "Keyword" : isPunctuation ? "FixedWidthToken" : "VariableWidthToken";
    className += leading && trailing ? "WithLeadingAndTrailingTrivia" : leading && !trailing ? "WithLeadingTrivia" : !leading && trailing ? "WithTrailingTrivia" : "WithNoTrivia";
    result += className;
    result += " implements ISyntaxToken {\r\n";
    if(needsSourcetext) {
        result += "        private _sourceText: IText;\r\n";
    }
    result += "        public tokenKind: SyntaxKind;\r\n";
    if(isKeyword) {
        result += "        private _keywordKind: SyntaxKind;\r\n";
    }
    result += "        private _fullStart: number;\r\n";
    if(leading) {
        result += "        private _leadingTriviaInfo: number;\r\n";
    }
    if(isVariableWidth) {
        result += "        private _textOrWidth: any;\r\n";
        result += "        private _value: any = null;\r\n";
    }
    if(trailing) {
        result += "        private _trailingTriviaInfo: number;\r\n";
    }
    result += "\r\n";
    if(needsSourcetext) {
        result += "        constructor(sourceText: IText, ";
    } else {
        result += "        constructor(";
    }
    if(isKeyword) {
        result += "keywordKind: SyntaxKind";
    } else {
        result += "kind: SyntaxKind";
    }
    result += ", fullStart: number";
    if(leading) {
        result += ", leadingTriviaInfo: number";
    }
    if(isVariableWidth) {
        result += ", textOrWidth: any";
    }
    if(trailing) {
        result += ", trailingTriviaInfo: number";
    }
    result += ") {\r\n";
    if(needsSourcetext) {
        result += "            this._sourceText = sourceText;\r\n";
    }
    if(isKeyword) {
        result += "            this.tokenKind = SyntaxKind.IdentifierNameToken;\r\n";
        result += "            this._keywordKind = keywordKind;\r\n";
    } else {
        result += "            this.tokenKind = kind;\r\n";
    }
    result += "            this._fullStart = fullStart;\r\n";
    if(leading) {
        result += "            this._leadingTriviaInfo = leadingTriviaInfo;\r\n";
    }
    if(isVariableWidth) {
        result += "            this._textOrWidth = textOrWidth;\r\n";
    }
    if(trailing) {
        result += "            this._trailingTriviaInfo = trailingTriviaInfo;\r\n";
    }
    result += "        }\r\n\r\n";
    result += "        public clone(): ISyntaxToken {\r\n";
    result += "            return new " + className + "(\r\n";
    if(needsSourcetext) {
        result += "                this._sourceText,\r\n";
    }
    if(isKeyword) {
        result += "                this._keywordKind,\r\n";
    } else {
        result += "                this.tokenKind,\r\n";
    }
    result += "                this._fullStart";
    if(leading) {
        result += ",\r\n                this._leadingTriviaInfo";
    }
    if(isVariableWidth) {
        result += ",\r\n                this._textOrWidth";
    }
    if(trailing) {
        result += ",\r\n                this._trailingTriviaInfo";
    }
    result += ");\r\n";
    result += "        }\r\n\r\n";
    result += "        public isToken(): bool { return true; }\r\n" + "        public isNode(): bool { return false; }\r\n" + "        public isList(): bool { return false; }\r\n" + "        public isSeparatedList(): bool { return false; }\r\n" + "        public isTrivia(): bool { return false; }\r\n" + "        public isTriviaList(): bool { return false; }\r\n" + "        public isMissing(): bool { return false; }\r\n\r\n";
    if(isKeyword) {
        result += "        public kind(): SyntaxKind { return SyntaxKind.IdentifierNameToken; }\r\n";
        result += "        public keywordKind(): SyntaxKind { return this._keywordKind; }\r\n\r\n";
    } else {
        result += "        public kind(): SyntaxKind { return this.tokenKind; }\r\n";
        result += "        public keywordKind(): SyntaxKind { return SyntaxKind.None; }\r\n\r\n";
    }
    var leadingTriviaLength = leading ? "getTriviaLength(this._leadingTriviaInfo)" : "0";
    var trailingTriviaLength = trailing ? "getTriviaLength(this._trailingTriviaInfo)" : "0";
    if(leading && trailing) {
        result += "        public fullWidth(): number { return " + leadingTriviaLength + " + this.width() + " + trailingTriviaLength + "; }\r\n";
        result += "        private start(): number { return this._fullStart + " + leadingTriviaLength + "; }\r\n";
    } else {
        if(leading) {
            result += "        public fullWidth(): number { return " + leadingTriviaLength + " + this.width(); }\r\n";
            result += "        private start(): number { return this._fullStart + " + leadingTriviaLength + "; }\r\n";
        } else {
            if(trailing) {
                result += "        public fullWidth(): number { return this.width() + " + trailingTriviaLength + "; }\r\n";
                result += "        private start(): number { return this._fullStart; }\r\n";
            } else {
                result += "        public fullWidth(): number { return this.width(); }\r\n";
                result += "        private start(): number { return this._fullStart; }\r\n";
            }
        }
    }
    if(isPunctuation || isKeyword) {
        result += "        public width(): number { return this.text().length; }\r\n";
    } else {
        result += "        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }\r\n";
    }
    result += "        private end(): number { return this.start() + this.width(); }\r\n\r\n";
    if(isPunctuation) {
        result += "        public text(): string { return SyntaxFacts.getText(this.tokenKind); }\r\n";
    } else {
        if(isKeyword) {
            result += "        public text(): string { return SyntaxFacts.getText(this._keywordKind); }\r\n";
        } else {
            result += "\r\n";
            result += "        public text(): string {\r\n";
            result += "            if (typeof this._textOrWidth === 'number') {\r\n";
            result += "                this._textOrWidth = this._sourceText.substr(\r\n";
            result += "                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierNameToken);\r\n";
            result += "            }\r\n";
            result += "\r\n";
            result += "            return this._textOrWidth;\r\n";
            result += "        }\r\n\r\n";
        }
    }
    if(needsSourcetext) {
        result += "        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }\r\n\r\n";
    } else {
        result += "        public fullText(): string { return this.text(); }\r\n\r\n";
    }
    if(isPunctuation) {
        result += "        public value(): any { return null; }\r\n";
    } else {
        if(isKeyword) {
            result += "        public value(): any { return null; }\r\n";
        } else {
            result += "        public value(): any { return this._value || (this._value = value(this)); }\r\n";
        }
    }
    result += "        public hasLeadingTrivia(): bool { return " + (leading ? "true" : "false") + "; }\r\n";
    result += "        public hasLeadingCommentTrivia(): bool { return " + (leading ? "hasTriviaComment(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingNewLineTrivia(): bool { return " + (leading ? "hasTriviaNewLine(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public leadingTriviaWidth(): number { return " + (leading ? "getTriviaLength(this._leadingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public leadingTrivia(): ISyntaxTriviaList { return " + (leading ? "Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false)" : "SyntaxTriviaList.empty") + "; }\r\n\r\n";
    result += "        public hasTrailingTrivia(): bool { return " + (trailing ? "true" : "false") + "; }\r\n";
    result += "        public hasTrailingCommentTrivia(): bool { return " + (trailing ? "hasTriviaComment(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingNewLineTrivia(): bool { return " + (trailing ? "hasTriviaNewLine(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public trailingTriviaWidth(): number { return " + (trailing ? "getTriviaLength(this._trailingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public trailingTrivia(): ISyntaxTriviaList { return " + (trailing ? "Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true)" : "SyntaxTriviaList.empty") + "; }\r\n\r\n";
    result += "        public toJSON(key) { return toJSON(this); }\r\n" + "        public realize(): ISyntaxToken { return realize(this); }\r\n" + "        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }\r\n\r\n";
    result += "        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withLeadingTrivia(leadingTrivia);\r\n" + "        }\r\n" + "\r\n" + "        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withTrailingTrivia(trailingTrivia);\r\n" + "        }\r\n";
    result += "    }\r\n";
    return result;
}
function generateTokens() {
    var result = "///<reference path='References.ts' />\r\n" + "\r\n" + "module SyntaxToken {\r\n";
    result += generateToken(false, false, false, false);
    result += "\r\n";
    result += generateToken(false, false, true, false);
    result += "\r\n";
    result += generateToken(false, false, false, true);
    result += "\r\n";
    result += generateToken(false, false, true, true);
    result += "\r\n";
    result += generateToken(true, false, false, false);
    result += "\r\n";
    result += generateToken(true, false, true, false);
    result += "\r\n";
    result += generateToken(true, false, false, true);
    result += "\r\n";
    result += generateToken(true, false, true, true);
    result += "\r\n";
    result += generateToken(false, true, false, false);
    result += "\r\n";
    result += generateToken(false, true, true, false);
    result += "\r\n";
    result += generateToken(false, true, false, true);
    result += "\r\n";
    result += generateToken(false, true, true, true);
    result += "\r\n\r\n";
    result += "    function createFixedWidthToken(sourceText: IText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new FixedWidthTokenWithNoTrivia(kind, fullStart);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new FixedWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new FixedWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    function createVariableWidthToken(sourceText: IText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new VariableWidthTokenWithNoTrivia(sourceText, kind, fullStart, width);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new VariableWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, width, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new VariableWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, width);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    function createKeyword(sourceText: IText, fullStart: number,\r\n" + "        keywordKind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new KeywordWithNoTrivia(keywordKind, fullStart);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new KeywordWithTrailingTrivia(sourceText, keywordKind, fullStart, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new KeywordWithLeadingTrivia(sourceText, keywordKind, fullStart, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new KeywordWithLeadingAndTrailingTrivia(sourceText, keywordKind, fullStart, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    export function create(text: IText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "        if (SyntaxFacts.isAnyPunctuation(kind)) {\r\n" + "            return createFixedWidthToken(text, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "        else if (SyntaxFacts.isAnyKeyword(kind)) {\r\n" + "            return createKeyword(text, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return createVariableWidthToken(text, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n\r\n";
    result += "    function getTriviaLength(value: number) {\r\n" + "        return value & Constants.TriviaLengthMask;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaComment(value: number): bool {\r\n" + "        return (value & Constants.TriviaCommentMask) !== 0;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaNewLine(value: number): bool {\r\n" + "        return (value & Constants.TriviaNewLineMask) !== 0;\r\n" + "    }\r\n";
    result += "}";
    return result;
}
function generateWalker() {
    var result = "";
    result += "///<reference path='References.ts' />\r\n" + "\r\n" + "class SyntaxWalker implements ISyntaxVisitor {\r\n" + "    public visitToken(token: ISyntaxToken): void {\r\n" + "    }\r\n" + "\r\n" + "    private visitOptionalToken(token: ISyntaxToken): void {\r\n" + "        if (token === null) {\r\n" + "            return;\r\n" + "        }\r\n" + "\r\n" + "        this.visitToken(token);\r\n" + "    }\r\n" + "\r\n" + "    public visitOptionalNode(node: SyntaxNode): void {\r\n" + "        if (node === null) {\r\n" + "            return;\r\n" + "        }\r\n" + "\r\n" + "        node.accept1(this);\r\n" + "    }\r\n" + "\r\n" + "    public visitList(list: ISyntaxList): void {\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "           list.syntaxNodeAt(i).accept(this);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    public visitSeparatedList(list: ISeparatedSyntaxList): void {\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "            var item = list.itemAt(i);\r\n" + "            if (item.isToken()) {\r\n" + "                this.visitToken(<ISyntaxToken>item);\r\n" + "            }\r\n" + "            else {\r\n" + "                (<SyntaxNode>item).accept(this);\r\n" + "            }\r\n" + "        }\r\n" + "    }\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "    public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): void {\r\n";
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            if(child.isToken) {
                if(child.isOptional) {
                    result += "        this.visitOptionalToken(node." + child.name + "());\r\n";
                } else {
                    result += "        this.visitToken(node." + child.name + "());\r\n";
                }
            } else {
                if(child.isList) {
                    result += "        this.visitList(node." + child.name + "());\r\n";
                } else {
                    if(child.isSeparatedList) {
                        result += "        this.visitSeparatedList(node." + child.name + "());\r\n";
                    } else {
                        if(child.type !== "SyntaxKind") {
                            if(child.isOptional) {
                                result += "        this.visitOptionalNode(node." + child.name + "());\r\n";
                            } else {
                                result += "        node." + child.name + "().accept(this);\r\n";
                            }
                        }
                    }
                }
            }
        }
        result += "    }\r\n";
    }
    result += "}";
    return result;
}
function generateKeywordCondition(keywords, currentCharacter, indent) {
    var length = keywords[0].text.length;
    var result = "";
    if(keywords.length === 1) {
        var keyword = keywords[0];
        if(currentCharacter === length) {
            return indent + "return SyntaxKind." + (SyntaxKind)._map[keyword.kind] + ";\r\n";
        }
        var keywordText = keywords[0].text;
        var result = indent + "return (";
        for(var i = currentCharacter; i < length; i++) {
            if(i > currentCharacter) {
                result += " && ";
            }
            var index = i === 0 ? "startIndex" : ("startIndex + " + i);
            result += "array[" + index + "] === CharacterCodes." + keywordText.substr(i, 1);
        }
        result += ") ? SyntaxKind." + (SyntaxKind)._map[keyword.kind] + " : SyntaxKind.IdentifierNameToken;\r\n";
    } else {
        var index = currentCharacter === 0 ? "startIndex" : ("startIndex + " + currentCharacter);
        result += indent + "switch(array[" + index + "]) {\r\n";
        var groupedKeywords = ArrayUtilities.groupBy(keywords, function (k) {
            return k.text.substr(currentCharacter, 1);
        });
        for(var c in groupedKeywords) {
            if(groupedKeywords.hasOwnProperty(c)) {
                result += indent + "case CharacterCodes." + c + ":\r\n";
                result += indent + "    // " + ArrayUtilities.select(groupedKeywords[c], function (k) {
                    return k.text;
                }).join(", ") + "\r\n";
                result += generateKeywordCondition(groupedKeywords[c], currentCharacter + 1, indent + "    ");
            }
        }
        result += indent + "default:\r\n";
        result += indent + "    return SyntaxKind.IdentifierNameToken;\r\n";
        result += indent + "}\r\n\r\n";
    }
    return result;
}
function generateScannerUtilities() {
    var result = "///<reference path='References.ts' />\r\n" + "\r\n" + "class ScannerUtilities {\r\n";
    var keywords = [];
    for(var i = SyntaxKind.FirstKeyword; i <= SyntaxKind.LastKeyword; i++) {
        keywords.push({
            kind: i,
            text: SyntaxFacts.getText(i)
        });
    }
    result += "    public static identifierKind(array: number[], startIndex: number, length: number): SyntaxKind {\r\n";
    var minTokenLength = ArrayUtilities.min(keywords, function (k) {
        return k.text.length;
    });
    var maxTokenLength = ArrayUtilities.max(keywords, function (k) {
        return k.text.length;
    });
    result += "        switch (length) {\r\n";
    for(var i = minTokenLength; i <= maxTokenLength; i++) {
        var keywordsOfLengthI = ArrayUtilities.where(keywords, function (k) {
            return k.text.length === i;
        });
        if(keywordsOfLengthI.length > 0) {
            result += "        case " + i + ":\r\n";
            result += "            // " + ArrayUtilities.select(keywordsOfLengthI, function (k) {
                return k.text;
            }).join(", ") + "\r\n";
            result += generateKeywordCondition(keywordsOfLengthI, 0, "            ");
        }
    }
    result += "        default:\r\n";
    result += "            return SyntaxKind.IdentifierNameToken;\r\n";
    result += "        }\r\n";
    result += "    }\r\n";
    result += "}";
    return result;
}
var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
var tokens = generateTokens();
var walker = generateWalker();
var scannerUtilities = generateScannerUtilities();
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxNodes.generated.ts", syntaxNodes, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxRewriter.generated.ts", rewriter, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxToken.generated.ts", tokens, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxWalker.generated.ts", walker, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\ScannerUtilities.generated.ts", scannerUtilities, true);
