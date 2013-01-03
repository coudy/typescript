var Debug = (function () {
    function Debug() { }
    Debug.assert = function assert(expression) {
        if(!expression) {
            throw new Error("Debug Failure. False expression.");
        }
    }
    return Debug;
})();
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
    ArrayUtilities.sequenceEquals = function sequenceEquals(array1, array2, equals) {
        if(array1 === array2) {
            return true;
        }
        if(array1 === null || array2 === null) {
            return false;
        }
        if(array1.length !== array2.length) {
            return false;
        }
        for(var i = 0, n = array1.length; i < n; i++) {
            if(!equals(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    }
    ArrayUtilities.contains = function contains(array, value) {
        for(var i = 0; i < array.length; i++) {
            if(array[i] === value) {
                return true;
            }
        }
        return false;
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
    ArrayUtilities.whereNotNull = function whereNotNull(array) {
        var result = [];
        for(var i = 0; i < array.length; i++) {
            var value = array[i];
            if(value !== null) {
                result.push(value);
            }
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
                        if(buffer[1] === 255) {
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
                        if(buffer[1] === 254) {
                            return buffer.toString("ucs2", 2);
                        }
                        break;

                    }
                    case 239: {
                        if(buffer[1] === 187) {
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
    SyntaxKind._map[120] = "QualifiedName";
    SyntaxKind.QualifiedName = 120;
    SyntaxKind._map[121] = "ObjectType";
    SyntaxKind.ObjectType = 121;
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
    SyntaxKind._map[136] = "PropertySignature";
    SyntaxKind.PropertySignature = 136;
    SyntaxKind._map[137] = "CallSignature";
    SyntaxKind.CallSignature = 137;
    SyntaxKind._map[138] = "ConstructSignature";
    SyntaxKind.ConstructSignature = 138;
    SyntaxKind._map[139] = "IndexSignature";
    SyntaxKind.IndexSignature = 139;
    SyntaxKind._map[140] = "FunctionSignature";
    SyntaxKind.FunctionSignature = 140;
    SyntaxKind._map[141] = "Block";
    SyntaxKind.Block = 141;
    SyntaxKind._map[142] = "IfStatement";
    SyntaxKind.IfStatement = 142;
    SyntaxKind._map[143] = "VariableStatement";
    SyntaxKind.VariableStatement = 143;
    SyntaxKind._map[144] = "ExpressionStatement";
    SyntaxKind.ExpressionStatement = 144;
    SyntaxKind._map[145] = "ReturnStatement";
    SyntaxKind.ReturnStatement = 145;
    SyntaxKind._map[146] = "SwitchStatement";
    SyntaxKind.SwitchStatement = 146;
    SyntaxKind._map[147] = "BreakStatement";
    SyntaxKind.BreakStatement = 147;
    SyntaxKind._map[148] = "ContinueStatement";
    SyntaxKind.ContinueStatement = 148;
    SyntaxKind._map[149] = "ForStatement";
    SyntaxKind.ForStatement = 149;
    SyntaxKind._map[150] = "ForInStatement";
    SyntaxKind.ForInStatement = 150;
    SyntaxKind._map[151] = "EmptyStatement";
    SyntaxKind.EmptyStatement = 151;
    SyntaxKind._map[152] = "ThrowStatement";
    SyntaxKind.ThrowStatement = 152;
    SyntaxKind._map[153] = "WhileStatement";
    SyntaxKind.WhileStatement = 153;
    SyntaxKind._map[154] = "TryStatement";
    SyntaxKind.TryStatement = 154;
    SyntaxKind._map[155] = "LabeledStatement";
    SyntaxKind.LabeledStatement = 155;
    SyntaxKind._map[156] = "DoStatement";
    SyntaxKind.DoStatement = 156;
    SyntaxKind._map[157] = "DebuggerStatement";
    SyntaxKind.DebuggerStatement = 157;
    SyntaxKind._map[158] = "WithStatement";
    SyntaxKind.WithStatement = 158;
    SyntaxKind._map[159] = "PlusExpression";
    SyntaxKind.PlusExpression = 159;
    SyntaxKind._map[160] = "NegateExpression";
    SyntaxKind.NegateExpression = 160;
    SyntaxKind._map[161] = "BitwiseNotExpression";
    SyntaxKind.BitwiseNotExpression = 161;
    SyntaxKind._map[162] = "LogicalNotExpression";
    SyntaxKind.LogicalNotExpression = 162;
    SyntaxKind._map[163] = "PreIncrementExpression";
    SyntaxKind.PreIncrementExpression = 163;
    SyntaxKind._map[164] = "PreDecrementExpression";
    SyntaxKind.PreDecrementExpression = 164;
    SyntaxKind._map[165] = "DeleteExpression";
    SyntaxKind.DeleteExpression = 165;
    SyntaxKind._map[166] = "TypeOfExpression";
    SyntaxKind.TypeOfExpression = 166;
    SyntaxKind._map[167] = "VoidExpression";
    SyntaxKind.VoidExpression = 167;
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
    SyntaxKind._map[209] = "ArrayLiteralExpression";
    SyntaxKind.ArrayLiteralExpression = 209;
    SyntaxKind._map[210] = "ObjectLiteralExpression";
    SyntaxKind.ObjectLiteralExpression = 210;
    SyntaxKind._map[211] = "ObjectCreationExpression";
    SyntaxKind.ObjectCreationExpression = 211;
    SyntaxKind._map[212] = "ParenthesizedExpression";
    SyntaxKind.ParenthesizedExpression = 212;
    SyntaxKind._map[213] = "ParenthesizedArrowFunctionExpression";
    SyntaxKind.ParenthesizedArrowFunctionExpression = 213;
    SyntaxKind._map[214] = "SimpleArrowFunctionExpression";
    SyntaxKind.SimpleArrowFunctionExpression = 214;
    SyntaxKind._map[215] = "CastExpression";
    SyntaxKind.CastExpression = 215;
    SyntaxKind._map[216] = "ElementAccessExpression";
    SyntaxKind.ElementAccessExpression = 216;
    SyntaxKind._map[217] = "FunctionExpression";
    SyntaxKind.FunctionExpression = 217;
    SyntaxKind._map[218] = "OmittedExpression";
    SyntaxKind.OmittedExpression = 218;
    SyntaxKind._map[219] = "VariableDeclaration";
    SyntaxKind.VariableDeclaration = 219;
    SyntaxKind._map[220] = "VariableDeclarator";
    SyntaxKind.VariableDeclarator = 220;
    SyntaxKind._map[221] = "ParameterList";
    SyntaxKind.ParameterList = 221;
    SyntaxKind._map[222] = "ArgumentList";
    SyntaxKind.ArgumentList = 222;
    SyntaxKind._map[223] = "ImplementsClause";
    SyntaxKind.ImplementsClause = 223;
    SyntaxKind._map[224] = "ExtendsClause";
    SyntaxKind.ExtendsClause = 224;
    SyntaxKind._map[225] = "EqualsValueClause";
    SyntaxKind.EqualsValueClause = 225;
    SyntaxKind._map[226] = "CaseSwitchClause";
    SyntaxKind.CaseSwitchClause = 226;
    SyntaxKind._map[227] = "DefaultSwitchClause";
    SyntaxKind.DefaultSwitchClause = 227;
    SyntaxKind._map[228] = "ElseClause";
    SyntaxKind.ElseClause = 228;
    SyntaxKind._map[229] = "CatchClause";
    SyntaxKind.CatchClause = 229;
    SyntaxKind._map[230] = "FinallyClause";
    SyntaxKind.FinallyClause = 230;
    SyntaxKind._map[231] = "Parameter";
    SyntaxKind.Parameter = 231;
    SyntaxKind._map[232] = "TypeAnnotation";
    SyntaxKind.TypeAnnotation = 232;
    SyntaxKind._map[233] = "SimplePropertyAssignment";
    SyntaxKind.SimplePropertyAssignment = 233;
    SyntaxKind._map[234] = "ExternalModuleReference";
    SyntaxKind.ExternalModuleReference = 234;
    SyntaxKind._map[235] = "ModuleNameModuleReference";
    SyntaxKind.ModuleNameModuleReference = 235;
    SyntaxKind._map[236] = "GetAccessorPropertyAssignment";
    SyntaxKind.GetAccessorPropertyAssignment = 236;
    SyntaxKind._map[237] = "SetAccessorPropertyAssignment";
    SyntaxKind.SetAccessorPropertyAssignment = 237;
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
var SyntaxFacts;
(function (SyntaxFacts) {
    var textToKeywordKind = {
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
    var kindToText = [];
    for(var name in textToKeywordKind) {
        if(textToKeywordKind.hasOwnProperty(name)) {
            Debug.assert(kindToText[textToKeywordKind[name]] === undefined);
            kindToText[textToKeywordKind[name]] = name;
        }
    }
    kindToText[60 /* ConstructorKeyword */ ] = "constructor";
    function getTokenKind(text) {
        if(textToKeywordKind.hasOwnProperty(text)) {
            return textToKeywordKind[text];
        }
        return 0 /* None */ ;
    }
    SyntaxFacts.getTokenKind = getTokenKind;
    function getText(kind) {
        var result = kindToText[kind];
        return result !== undefined ? result : null;
    }
    SyntaxFacts.getText = getText;
    function isTokenKind(kind) {
        return kind >= SyntaxKind.FirstToken && kind <= SyntaxKind.LastToken;
    }
    SyntaxFacts.isTokenKind = isTokenKind;
    function isAnyKeyword(kind) {
        return kind >= SyntaxKind.FirstKeyword && kind <= SyntaxKind.LastKeyword;
    }
    SyntaxFacts.isAnyKeyword = isAnyKeyword;
    function isStandardKeyword(kind) {
        return kind >= SyntaxKind.FirstStandardKeyword && kind <= SyntaxKind.LastStandardKeyword;
    }
    SyntaxFacts.isStandardKeyword = isStandardKeyword;
    function isFutureReservedKeyword(kind) {
        return kind >= SyntaxKind.FirstFutureReservedKeyword && kind <= SyntaxKind.LastFutureReservedKeyword;
    }
    SyntaxFacts.isFutureReservedKeyword = isFutureReservedKeyword;
    function isFutureReservedStrictKeyword(kind) {
        return kind >= SyntaxKind.FirstFutureReservedStrictKeyword && kind <= SyntaxKind.LastFutureReservedStrictKeyword;
    }
    SyntaxFacts.isFutureReservedStrictKeyword = isFutureReservedStrictKeyword;
    function isAnyPunctuation(kind) {
        return kind >= SyntaxKind.FirstPunctuation && kind <= SyntaxKind.LastPunctuation;
    }
    SyntaxFacts.isAnyPunctuation = isAnyPunctuation;
    function isPrefixUnaryExpressionOperatorToken(tokenKind) {
        return getPrefixUnaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */ ;
    }
    SyntaxFacts.isPrefixUnaryExpressionOperatorToken = isPrefixUnaryExpressionOperatorToken;
    function isBinaryExpressionOperatorToken(tokenKind) {
        return getBinaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */ ;
    }
    SyntaxFacts.isBinaryExpressionOperatorToken = isBinaryExpressionOperatorToken;
    function getPrefixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 86 /* PlusToken */ : {
                return 159 /* PlusExpression */ ;

            }
            case 87 /* MinusToken */ : {
                return 160 /* NegateExpression */ ;

            }
            case 99 /* TildeToken */ : {
                return 161 /* BitwiseNotExpression */ ;

            }
            case 98 /* ExclamationToken */ : {
                return 162 /* LogicalNotExpression */ ;

            }
            case 90 /* PlusPlusToken */ : {
                return 163 /* PreIncrementExpression */ ;

            }
            case 91 /* MinusMinusToken */ : {
                return 164 /* PreDecrementExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.getPrefixUnaryExpressionFromOperatorToken = getPrefixUnaryExpressionFromOperatorToken;
    function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 90 /* PlusPlusToken */ : {
                return 205 /* PostIncrementExpression */ ;

            }
            case 91 /* MinusMinusToken */ : {
                return 206 /* PostDecrementExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = getPostfixUnaryExpressionFromOperatorToken;
    function getBinaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 88 /* AsteriskToken */ : {
                return 200 /* MultiplyExpression */ ;

            }
            case 115 /* SlashToken */ : {
                return 201 /* DivideExpression */ ;

            }
            case 89 /* PercentToken */ : {
                return 202 /* ModuloExpression */ ;

            }
            case 86 /* PlusToken */ : {
                return 203 /* AddExpression */ ;

            }
            case 87 /* MinusToken */ : {
                return 204 /* SubtractExpression */ ;

            }
            case 92 /* LessThanLessThanToken */ : {
                return 197 /* LeftShiftExpression */ ;

            }
            case 93 /* GreaterThanGreaterThanToken */ : {
                return 198 /* SignedRightShiftExpression */ ;

            }
            case 94 /* GreaterThanGreaterThanGreaterThanToken */ : {
                return 199 /* UnsignedRightShiftExpression */ ;

            }
            case 77 /* LessThanToken */ : {
                return 191 /* LessThanExpression */ ;

            }
            case 78 /* GreaterThanToken */ : {
                return 192 /* GreaterThanExpression */ ;

            }
            case 79 /* LessThanEqualsToken */ : {
                return 193 /* LessThanOrEqualExpression */ ;

            }
            case 80 /* GreaterThanEqualsToken */ : {
                return 194 /* GreaterThanOrEqualExpression */ ;

            }
            case 28 /* InstanceOfKeyword */ : {
                return 195 /* InstanceOfExpression */ ;

            }
            case 27 /* InKeyword */ : {
                return 196 /* InExpression */ ;

            }
            case 81 /* EqualsEqualsToken */ : {
                return 187 /* EqualsWithTypeConversionExpression */ ;

            }
            case 83 /* ExclamationEqualsToken */ : {
                return 188 /* NotEqualsWithTypeConversionExpression */ ;

            }
            case 84 /* EqualsEqualsEqualsToken */ : {
                return 189 /* EqualsExpression */ ;

            }
            case 85 /* ExclamationEqualsEqualsToken */ : {
                return 190 /* NotEqualsExpression */ ;

            }
            case 95 /* AmpersandToken */ : {
                return 186 /* BitwiseAndExpression */ ;

            }
            case 97 /* CaretToken */ : {
                return 185 /* BitwiseExclusiveOrExpression */ ;

            }
            case 96 /* BarToken */ : {
                return 184 /* BitwiseOrExpression */ ;

            }
            case 100 /* AmpersandAmpersandToken */ : {
                return 183 /* LogicalAndExpression */ ;

            }
            case 101 /* BarBarToken */ : {
                return 182 /* LogicalOrExpression */ ;

            }
            case 113 /* BarEqualsToken */ : {
                return 177 /* OrAssignmentExpression */ ;

            }
            case 112 /* AmpersandEqualsToken */ : {
                return 175 /* AndAssignmentExpression */ ;

            }
            case 114 /* CaretEqualsToken */ : {
                return 176 /* ExclusiveOrAssignmentExpression */ ;

            }
            case 109 /* LessThanLessThanEqualsToken */ : {
                return 178 /* LeftShiftAssignmentExpression */ ;

            }
            case 110 /* GreaterThanGreaterThanEqualsToken */ : {
                return 179 /* SignedRightShiftAssignmentExpression */ ;

            }
            case 111 /* GreaterThanGreaterThanGreaterThanEqualsToken */ : {
                return 180 /* UnsignedRightShiftAssignmentExpression */ ;

            }
            case 105 /* PlusEqualsToken */ : {
                return 170 /* AddAssignmentExpression */ ;

            }
            case 106 /* MinusEqualsToken */ : {
                return 171 /* SubtractAssignmentExpression */ ;

            }
            case 107 /* AsteriskEqualsToken */ : {
                return 172 /* MultiplyAssignmentExpression */ ;

            }
            case 116 /* SlashEqualsToken */ : {
                return 173 /* DivideAssignmentExpression */ ;

            }
            case 108 /* PercentEqualsToken */ : {
                return 174 /* ModuloAssignmentExpression */ ;

            }
            case 104 /* EqualsToken */ : {
                return 169 /* AssignmentExpression */ ;

            }
            case 76 /* CommaToken */ : {
                return 168 /* CommaExpression */ ;

            }
            default: {
                return 0 /* None */ ;

            }
        }
    }
    SyntaxFacts.getBinaryExpressionFromOperatorToken = getBinaryExpressionFromOperatorToken;
    function isAnyDivideToken(kind) {
        switch(kind) {
            case 115 /* SlashToken */ :
            case 116 /* SlashEqualsToken */ : {
                return true;

            }
            default: {
                return false;

            }
        }
    }
    SyntaxFacts.isAnyDivideToken = isAnyDivideToken;
    function isAnyDivideOrRegularExpressionToken(kind) {
        switch(kind) {
            case 115 /* SlashToken */ :
            case 116 /* SlashEqualsToken */ :
            case 10 /* RegularExpressionLiteral */ : {
                return true;

            }
            default: {
                return false;

            }
        }
    }
    SyntaxFacts.isAnyDivideOrRegularExpressionToken = isAnyDivideOrRegularExpressionToken;
})(SyntaxFacts || (SyntaxFacts = {}));
var argumentChecks = false;
var interfaces = {
    IMemberDeclarationSyntax: "IClassElementSyntax",
    IStatementSyntax: "IModuleElementSyntax",
    INameSyntax: "ITypeSyntax",
    ITypeSyntax: "IUnaryExpressionSyntax",
    IUnaryExpressionSyntax: "IExpressionSyntax"
};
var definitions = [
    {
        name: 'SourceUnitSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'moduleElements',
                isList: true,
                elementType: 'IModuleElementSyntax'
            }, 
            {
                name: 'endOfFileToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'ModuleReferenceSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleReferenceSyntax'
        ],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
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
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            {
                name: 'moduleName',
                type: 'INameSyntax'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ImportDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleElementSyntax'
        ],
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
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ClassDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleElementSyntax'
        ],
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
                isList: true,
                elementType: "IClassElementSyntax"
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'InterfaceDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleElementSyntax'
        ],
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
        ],
        isTypeScriptSpecific: true
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
                isSeparatedList: true,
                requiresAtLeastOneItem: true,
                elementType: "INameSyntax"
            }
        ],
        isTypeScriptSpecific: true
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
                isSeparatedList: true,
                requiresAtLeastOneItem: true,
                elementType: "INameSyntax"
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ModuleDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleElementSyntax'
        ],
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
                type: 'INameSyntax',
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
                isList: true,
                elementType: 'IModuleElementSyntax'
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'FunctionDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true,
                isTypeScriptSpecific: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true,
                isTypeScriptSpecific: true
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'exportKeyword',
                isToken: true,
                isOptional: true,
                isTypeScriptSpecific: true
            }, 
            {
                name: 'declareKeyword',
                isToken: true,
                isOptional: true,
                isTypeScriptSpecific: true
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
        name: 'VariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'varKeyword',
                isToken: true
            }, 
            {
                name: 'variableDeclarators',
                isSeparatedList: true,
                requiresAtLeastOneItem: true,
                elementType: "VariableDeclaratorSyntax"
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
                isOptional: true,
                isTypeScriptSpecific: true
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
                type: 'IExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'PrefixUnaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
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
                type: 'IUnaryExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'ArrayLiteralExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'expressions',
                isSeparatedList: true,
                elementType: 'IExpressionSyntax'
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'OmittedExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IExpressionSyntax'
        ],
        children: []
    }, 
    {
        name: 'ParenthesizedExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
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
                type: 'ISyntaxNodeOrToken'
            }
        ],
        isTypeScriptSpecific: true
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
                type: 'ISyntaxNodeOrToken'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'QualifiedNameSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'INameSyntax'
        ],
        children: [
            {
                name: 'left',
                type: 'INameSyntax'
            }, 
            {
                name: 'dotToken',
                isToken: true
            }, 
            {
                name: 'right',
                isToken: true,
                tokenKinds: [
                    'IdentifierNameToken'
                ]
            }
        ]
    }, 
    {
        name: 'ConstructorTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeSyntax'
        ],
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
                type: 'ITypeSyntax'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'FunctionTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeSyntax'
        ],
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
                type: 'ITypeSyntax'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ObjectTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeSyntax'
        ],
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'typeMembers',
                isSeparatedList: true,
                elementType: "TypeMemberSyntax"
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ArrayTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeSyntax'
        ],
        children: [
            {
                name: 'type',
                type: 'ITypeSyntax'
            }, 
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
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
                type: 'ITypeSyntax'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'BlockSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true,
                elementType: 'IStatementSyntax'
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
                isOptional: true,
                isTypeScriptSpecific: true
            }, 
            {
                name: 'publicOrPrivateKeyword',
                isToken: true,
                isOptional: true,
                tokenKinds: [
                    "PublicKeyword", 
                    "PrivateKeyword"
                ],
                isTypeScriptSpecific: true
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
                isOptional: true,
                isTypeScriptSpecific: true
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true,
                isTypeScriptSpecific: true
            }, 
            {
                name: 'equalsValueClause',
                type: 'EqualsValueClauseSyntax',
                isOptional: true,
                isTypeScriptSpecific: true
            }
        ]
    }, 
    {
        name: 'MemberAccessExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'dotToken',
                isToken: true
            }, 
            {
                name: 'identifierName',
                isToken: true,
                tokenKinds: [
                    'IdentifierNameToken'
                ]
            }
        ]
    }, 
    {
        name: 'PostfixUnaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'operand',
                type: 'IExpressionSyntax'
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'openBracketToken',
                isToken: true
            }, 
            {
                name: 'argumentExpression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'closeBracketToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'InvocationExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'expression',
                type: 'IExpressionSyntax'
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
                isSeparatedList: true,
                elementType: 'IExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'BinaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IExpressionSyntax'
        ],
        children: [
            {
                name: 'kind',
                type: 'SyntaxKind'
            }, 
            {
                name: 'left',
                type: 'IExpressionSyntax'
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
                type: 'IExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'ConditionalExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IExpressionSyntax'
        ],
        children: [
            {
                name: 'condition',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'questionToken',
                isToken: true
            }, 
            {
                name: 'whenTrue',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'whenFalse',
                type: 'IExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'TypeMemberSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeMemberSyntax'
        ],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
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
        ],
        isTypeScriptSpecific: true
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
                isOptional: true,
                itTypeScriptSpecific: true
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
        ],
        isTypeScriptSpecific: true
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
        ],
        isTypeScriptSpecific: true
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
                isSeparatedList: true,
                elementType: "ParameterSyntax"
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
                isOptional: true,
                isTypeScriptSpecific: true
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
                type: 'IStatementSyntax'
            }
        ]
    }, 
    {
        name: 'IfStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'IStatementSyntax'
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'ConstructorDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IClassElementSyntax'
        ],
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
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'MemberFunctionDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IMemberDeclarationSyntax'
        ],
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
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'MemberAccessorDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IMemberDeclarationSyntax'
        ],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
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
        ],
        isTypeScriptSpecific: true
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
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IMemberDeclarationSyntax'
        ],
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
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ThrowStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'throwKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'semicolonToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'ReturnStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'returnKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax',
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
                type: 'IExpressionSyntax'
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
                name: 'switchClauses',
                isList: true,
                elementType: "SwitchClauseSyntax"
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
        interfaces: [
            'ISwitchClauseSyntax'
        ],
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
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'colonToken',
                isToken: true
            }, 
            {
                name: 'statements',
                isList: true,
                elementType: 'IStatementSyntax'
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
                isList: true,
                elementType: 'IStatementSyntax'
            }
        ]
    }, 
    {
        name: 'BreakStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
                type: 'IExpressionSyntax',
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
                type: 'IExpressionSyntax',
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
                type: 'IExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'IStatementSyntax'
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
                type: 'IExpressionSyntax',
                isOptional: true
            }, 
            {
                name: 'inKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'IStatementSyntax'
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
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'IStatementSyntax'
            }
        ]
    }, 
    {
        name: 'WithStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
                type: 'IExpressionSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }, 
            {
                name: 'statement',
                type: 'IStatementSyntax'
            }
        ]
    }, 
    {
        name: 'EnumDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleElementSyntax'
        ],
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
                isSeparatedList: true,
                elementType: "VariableDeclaratorSyntax"
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'CastExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'lessThanToken',
                isToken: true
            }, 
            {
                name: 'type',
                type: 'ITypeSyntax'
            }, 
            {
                name: 'greaterThanToken',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IUnaryExpressionSyntax'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ObjectLiteralExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'propertyAssignments',
                isSeparatedList: true,
                elementType: "PropertyAssignmentSyntax"
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
                type: 'IExpressionSyntax'
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'semicolonToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'TryStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
                type: 'IStatementSyntax'
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
                type: 'IStatementSyntax'
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
                type: 'IExpressionSyntax'
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
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'typeOfKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'DeleteExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'deleteKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'VoidExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IUnaryExpressionSyntax'
        ],
        children: [
            {
                name: 'voidKeyword',
                isToken: true
            }, 
            {
                name: 'expression',
                type: 'IExpressionSyntax'
            }
        ]
    }, 
    {
        name: 'DebuggerStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
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
function getStringWithoutSuffix(definition) {
    if(StringUtilities.endsWith(definition, "Syntax")) {
        return definition.substring(0, definition.length - "Syntax".length);
    }
    return definition;
}
function getNameWithoutSuffix(definition) {
    return getStringWithoutSuffix(definition.name);
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
            result += child.name + ".tokenKind !== SyntaxKind." + tokenKind;
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
        result += indent + "        switch (" + child.name + ".tokenKind) {\r\n";
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
function tokenKinds(child) {
    return child.tokenKinds ? child.tokenKinds : [
        pascalCase(child.name)
    ];
}
function generateKindCheck(child) {
    var indent = "";
    var result = "";
    if(child.isOptional) {
        indent = "    ";
        result += "        if (" + child.name + " !== null) {\r\n";
    }
    var kinds = tokenKinds(child);
    if(kinds.length <= 2) {
        result += generateIfKindCheck(child, kinds, indent);
    } else {
        result += generateSwitchKindCheck(child, kinds, indent);
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
    if(definition.isAbstract) {
    }
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
function isOptional(child) {
    if(child.isOptional) {
        return true;
    }
    if(child.isList && !child.requiresAtLeastOneItem) {
        return true;
    }
    if(child.isSeparatedList && !child.requiresAtLeastOneItem) {
        return true;
    }
    return false;
}
function generateFactory1Method(definition) {
    var mandatoryChildren = ArrayUtilities.where(definition.children, function (c) {
        return !isOptional(c);
    });
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
        if(!isOptional(child)) {
            result += child.name;
        } else {
            if(child.isList) {
                result += "Syntax.emptyList";
            } else {
                if(child.isSeparatedList) {
                    result += "Syntax.emptySeparatedList";
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
function isKeywordOrPunctuation(kind) {
    if(StringUtilities.endsWith(kind, "Keyword")) {
        return true;
    }
    if(StringUtilities.endsWith(kind, "Token") && kind !== "IdentifierNameToken" && kind !== "EndOfFileToken") {
        return true;
    }
    return false;
}
function isDefaultConstructable(definition) {
    if(definition === null || definition.isAbstract) {
        return false;
    }
    for(var i = 0; i < definition.children.length; i++) {
        if(isMandatory(definition.children[i])) {
            return false;
        }
    }
    return true;
}
function isMandatory(child) {
    if(isOptional(child)) {
        return false;
    }
    if(child.type === "SyntaxKind" || child.isList || child.isSeparatedList) {
        return true;
    }
    if(child.isToken) {
        var kinds = tokenKinds(child);
        var isFixed = kinds.length === 1 && isKeywordOrPunctuation(kinds[0]);
        return !isFixed;
    }
    return !isDefaultConstructable(memberDefinitionType(child));
}
function generateFactory2Method(definition) {
    var mandatoryChildren = ArrayUtilities.where(definition.children, isMandatory);
    if(mandatoryChildren.length === definition.children.length) {
        return "";
    }
    var result = "\r\n    public static create1(";
    for(var i = 0; i < mandatoryChildren.length; i++) {
        var child = mandatoryChildren[i];
        result += child.name + ": " + getType(child);
        if(i < mandatoryChildren.length - 1) {
            result += ",\r\n                          ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(i > 0) {
            result += ",";
        }
        if(isMandatory(child)) {
            result += "\r\n            " + child.name;
        } else {
            if(child.isList) {
                result += "\r\n            Syntax.emptyList";
            } else {
                if(child.isSeparatedList) {
                    result += "\r\n            Syntax.emptySeparatedList";
                } else {
                    if(isOptional(child)) {
                        result += "\r\n            null";
                    } else {
                        if(child.isToken) {
                            result += "\r\n            Syntax.token(SyntaxKind." + tokenKinds(child)[0] + ")";
                        } else {
                            result += "\r\n            " + child.type + ".create1()";
                        }
                    }
                }
            }
        }
    }
    result += ");\r\n";
    result += "    }\r\n";
    return result;
}
function generateFactoryMethod(definition) {
    return generateFactory1Method(definition) + generateFactory2Method(definition);
}
function generateAcceptMethods(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateIsMethod(definition) {
    var result = "";
    if(definition.interfaces) {
        var ifaces = definition.interfaces.slice(0);
        for(var i = 0; i < ifaces.length; i++) {
            var current = ifaces[i];
            while(current !== undefined) {
                if(!ArrayUtilities.contains(ifaces, current)) {
                    ifaces.push(current);
                }
                current = interfaces[current];
            }
        }
        for(var i = 0; i < ifaces.length; i++) {
            var type = ifaces[i];
            type = getStringWithoutSuffix(type);
            if(isInterface(type)) {
                type = type.substr(1);
            }
            result += "\r\n";
            result += "    private is" + type + "(): bool {\r\n";
            result += "        return true;\r\n";
            result += "    }\r\n";
        }
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
function generateFirstTokenMethod(definition) {
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
function generateLastTokenMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public lastToken(): ISyntaxToken {\r\n";
        if(definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        var token = null;\r\n";
            for(var i = definition.children.length - 1; i >= 0; i--) {
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
                    result += "(token = " + getPropertyAccess(child) + ".lastToken()) !== null";
                    result += ") { return token; }\r\n";
                }
            }
            result += "        return null;\r\n";
        }
        result += "    }\r\n";
    }
    return result;
}
function generateInsertChildrenIntoMethod(definition) {
    var result = "";
    if(!definition.isAbstract) {
        result += "\r\n";
        result += "    public insertChildrenInto(array: ISyntaxElement[], index: number) {\r\n";
        for(var i = definition.children.length - 1; i >= 0; i--) {
            var child = definition.children[i];
            if(child.type === "SyntaxKind") {
                continue;
            }
            if(child.isList || child.isSeparatedList) {
                result += "        " + getPropertyAccess(child) + ".insertChildrenInto(array, index);\r\n";
            } else {
                if(child.isOptional) {
                    result += "        if (" + getPropertyAccess(child) + " !== null) { array.splice(index, 0, " + getPropertyAccess(child) + "); }\r\n";
                } else {
                    result += "        array.splice(index, 0, " + getPropertyAccess(child) + ");\r\n";
                }
            }
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
function memberDefinitionType(child) {
    Debug.assert(child.type !== undefined);
    return ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === child.type;
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
    if(child.isList || child.isSeparatedList) {
        if(StringUtilities.endsWith(child.name, "s")) {
            var pascalName = pascalCase(child.name);
            pascalName = pascalName.substring(0, pascalName.length - 1);
            var argName = getSafeName(child);
            argName = argName.substring(0, argName.length - 1);
            result += "\r\n";
            result += "    public with" + pascalName + "(" + argName + ": " + child.elementType + "): " + definition.name + " {\r\n";
            result += "        return this.with" + pascalCase(child.name) + "(";
            if(child.isList) {
                result += "Syntax.list([" + argName + "])";
            } else {
                result += "Syntax.separatedList([" + argName + "])";
            }
            result += ");\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateWithMethods(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += generateWithMethod(definition, child);
    }
    return result;
}
function generateTriviaMethods(definition) {
    var result = "\r\n";
    result += "    public withLeadingTrivia(trivia: ISyntaxTriviaList): " + definition.name + " {\r\n";
    result += "        return <" + definition.name + ">super.withLeadingTrivia(trivia);\r\n";
    result += "    }\r\n\r\n";
    result += "    public withTrailingTrivia(trivia: ISyntaxTriviaList): " + definition.name + " {\r\n";
    result += "        return <" + definition.name + ">super.withTrailingTrivia(trivia);\r\n";
    result += "    }\r\n";
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
    result += "): " + definition.name + " {\r\n";
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
function generateIsTypeScriptSpecificMethod(definition) {
    var result = "\r\n    private isTypeScriptSpecific(): bool {\r\n";
    if(definition.isTypeScriptSpecific) {
        result += "        return true;\r\n";
    } else {
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if(child.type === "SyntaxKind") {
                continue;
            }
            if(child.isTypeScriptSpecific) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { return true; }\r\n";
                continue;
            }
            if(child.isToken) {
                continue;
            }
            if(child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null && " + getPropertyAccess(child) + ".isTypeScriptSpecific()) { return true; }\r\n";
            } else {
                result += "        if (" + getPropertyAccess(child) + ".isTypeScriptSpecific()) { return true; }\r\n";
            }
        }
        result += "        return false;\r\n";
    }
    result += "    }\r\n";
    return result;
}
function couldBeRegularExpressionToken(child) {
    var kinds = tokenKinds(child);
    return ArrayUtilities.contains(kinds, "SlashToken") || ArrayUtilities.contains(kinds, "SlashEqualsToken") || ArrayUtilities.contains(kinds, "RegularExpressionLiteral");
}
function generateComputeDataMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private computeData(): number {\r\n";
    result += "        var fullWidth = 0;\r\n";
    result += "        var childWidth = 0;\r\n";
    result += "        var hasSkippedText = false;\r\n";
    result += "        var hasZeroWidthToken = " + (definition.children.length === 0) + ";\r\n";
    result += "        var hasRegularExpressionToken = false;\r\n";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child.type === "SyntaxKind") {
            continue;
        }
        var indent = "";
        if(child.isOptional) {
            result += "\r\n        if (" + getPropertyAccess(child) + " !== null) {\r\n";
            indent = "    ";
        } else {
            result += "\r\n";
        }
        result += indent + "        childWidth = " + getPropertyAccess(child) + ".fullWidth();\r\n";
        result += indent + "        fullWidth += childWidth;\r\n";
        result += indent + "        hasSkippedText = hasSkippedText || " + getPropertyAccess(child) + ".hasSkippedText();\r\n";
        if(child.isToken) {
            result += indent + "        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);\r\n";
            if(couldBeRegularExpressionToken(child)) {
                result += indent + "        hasRegularExpressionToken = hasRegularExpressionToken || SyntaxFacts.isAnyDivideOrRegularExpressionToken(" + getPropertyAccess(child) + ".tokenKind);\r\n";
            }
        } else {
            result += indent + "        hasZeroWidthToken = hasZeroWidthToken || " + getPropertyAccess(child) + ".hasZeroWidthToken();\r\n";
            result += indent + "        hasRegularExpressionToken = hasRegularExpressionToken || " + getPropertyAccess(child) + ".hasRegularExpressionToken();\r\n";
        }
        if(child.isOptional) {
            result += "        }\r\n";
        }
    }
    result += "\r\n        return (fullWidth << Constants.NodeFullWidthShift)";
    result += "\r\n             | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)";
    result += "\r\n             | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)";
    result += "\r\n             | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);\r\n";
    result += "    }\r\n";
    return result;
}
function generateStructuralEqualsMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private structuralEquals(node: SyntaxNode): bool {\r\n";
    result += "        if (this === node) { return true; }\r\n";
    result += "        if (node === null) { return false; }\r\n";
    result += "        if (this.kind() !== node.kind()) { return false; }\r\n";
    result += "        var other = <" + definition.name + ">node;\r\n";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child.type !== "SyntaxKind") {
            if(child.isList) {
                result += "        if (!Syntax.listStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else {
                if(child.isSeparatedList) {
                    result += "        if (!Syntax.separatedListStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
                } else {
                    if(child.isToken) {
                        result += "        if (!Syntax.tokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
                    } else {
                        if(isNodeOrToken(child)) {
                            result += "        if (!Syntax.nodeOrTokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
                        } else {
                            result += "        if (!Syntax.nodeStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
                        }
                    }
                }
            }
        }
    }
    result += "        return true;\r\n";
    result += "    }\r\n";
    return result;
}
function generateFindTokenInternalMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {\r\n";
    if(definition.children.length > 0) {
        result += "        Debug.assert(position >= 0 && position < this.fullWidth());\r\n";
        result += "        var childWidth = 0;\r\n";
    }
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child.type === "SyntaxKind") {
            continue;
        }
        var indent = "";
        if(child.isOptional) {
            result += "\r\n        if (" + getPropertyAccess(child) + " !== null) {\r\n";
            indent = "    ";
        } else {
            result += "\r\n";
        }
        result += indent + "        childWidth = " + getPropertyAccess(child) + ".fullWidth();\r\n";
        result += indent + "        if (position < childWidth) { ";
        if(child.isToken) {
            result += "return { token: " + getPropertyAccess(child) + ", fullStart: fullStart }; }\r\n";
        } else {
            result += "return (<any>" + getPropertyAccess(child) + ").findTokenInternal(position, fullStart); }\r\n";
        }
        result += indent + "        position -= childWidth;\r\n";
        result += indent + "        fullStart += childWidth;\r\n";
        if(child.isOptional) {
            result += "        }\r\n";
        }
    }
    if(definition.children.length > 0) {
        result += "\r\n";
    }
    result += "        throw Errors.invalidOperation();\r\n";
    result += "    }\r\n";
    return result;
}
function generateCollectTextElementsMethod(definition) {
    if(definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private collectTextElements(elements: string[]): void {\r\n";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if(child.type === "SyntaxKind") {
            continue;
        }
        if(child.isOptional) {
            result += "        if (" + getPropertyAccess(child) + " !== null) { (<any>" + getPropertyAccess(child) + ").collectTextElements(elements); }\r\n";
        } else {
            result += "        (<any>" + getPropertyAccess(child) + ").collectTextElements(elements);\r\n";
        }
    }
    result += "    }\r\n";
    return result;
}
function generateNode(definition) {
    var result = "class " + definition.name + " extends " + definition.baseType;
    if(definition.interfaces) {
        result += " implements " + definition.interfaces.join(", ");
    }
    result += " {\r\n";
    hasKind = false;
    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateFactoryMethod(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateIsMethod(definition);
    result += generateFirstTokenMethod(definition);
    result += generateLastTokenMethod(definition);
    result += generateInsertChildrenIntoMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);
    result += generateTriviaMethods(definition);
    result += generateWithMethods(definition);
    result += generateCollectTextElementsMethod(definition);
    result += generateIsTypeScriptSpecificMethod(definition);
    result += generateComputeDataMethod(definition);
    result += generateFindTokenInternalMethod(definition);
    result += generateStructuralEqualsMethod(definition);
    result += "}";
    return result;
}
function generateNodes() {
    var result = "///<reference path='SyntaxNode.ts' />\r\n";
    result += "///<reference path='ISyntaxList.ts' />\r\n";
    result += "///<reference path='ISeparatedSyntaxList.ts' />\r\n";
    result += "///<reference path='SeparatedSyntaxList.ts' />\r\n";
    result += "///<reference path='SyntaxList.ts' />\r\n";
    result += "///<reference path='SyntaxToken.ts' />\r\n";
    result += "///<reference path='Syntax.ts' />";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        result += "\r\n\r\n";
        result += generateNode(definition);
    }
    return result;
}
function isInterface(name) {
    return name.substr(0, 1) === "I" && name.substr(1, 1).toUpperCase() === name.substr(1, 1);
}
function isNodeOrToken(child) {
    return child.type && isInterface(child.type);
}
function generateRewriter() {
    var result = "";
    result += "class SyntaxRewriter implements ISyntaxVisitor {\r\n" + "    public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" + "        return token;\r\n" + "    }\r\n" + "\r\n" + "    public visitNode(node: SyntaxNode): SyntaxNode {\r\n" + "        return node.accept(this);\r\n" + "    }\r\n" + "\r\n" + "    public visitNodeOrToken(node: ISyntaxNodeOrToken): ISyntaxNodeOrToken {\r\n" + "        return node.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>node) : this.visitNode(<SyntaxNode>node);\r\n" + "    }\r\n" + "\r\n" + "    public visitList(list: ISyntaxList): ISyntaxList {\r\n" + "        var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "            var item = list.itemAt(i);\r\n" + "            var newItem = this.visitNodeOrToken(item);\r\n" + "\r\n" + "            if (item !== newItem && newItems === null) {\r\n" + "                newItems = [];\r\n" + "                for (var j = 0; j < i; j++) {\r\n" + "                    newItems.push(list.itemAt(j));\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            if (newItems) {\r\n" + "                newItems.push(newItem);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        Debug.assert(newItems === null || newItems.length === list.count());\r\n" + "        return newItems === null ? list : Syntax.list(newItems);\r\n" + "    }\r\n" + "\r\n" + "    public visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" + "        var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "        for (var i = 0, n = list.itemAndSeparatorCount(); i < n; i++) {\r\n" + "            var item = list.itemOrSeparatorAt(i);\r\n" + "            var newItem = item.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" + "\r\n" + "            if (item !== newItem && newItems === null) {\r\n" + "                newItems = [];\r\n" + "                for (var j = 0; j < i; j++) {\r\n" + "                    newItems.push(list.itemOrSeparatorAt(j));\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            if (newItems) {\r\n" + "                newItems.push(newItem);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        Debug.assert(newItems === null || newItems.length === list.itemAndSeparatorCount());\r\n" + "        return newItems === null ? list : Syntax.separatedList(newItems);\r\n" + "    }\r\n";
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
            if(child.isOptional) {
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
                            if(isNodeOrToken(child)) {
                                result += "<" + child.type + ">this.visitNodeOrToken(node." + child.name + "())";
                            } else {
                                result += "<" + child.type + ">this.visitNode(node." + child.name + "())";
                            }
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
        result += "        private _fullStart: number;\r\n";
    }
    result += "        public tokenKind: SyntaxKind;\r\n";
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
        result += "        constructor(sourceText: IText, fullStart: number,";
    } else {
        result += "        constructor(";
    }
    result += "kind: SyntaxKind";
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
        result += "            this._fullStart = fullStart;\r\n";
    }
    result += "            this.tokenKind = kind;\r\n";
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
        result += "                this._fullStart,\r\n";
    }
    result += "                this.tokenKind";
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
    result += "        public isNode(): bool { return false; }\r\n" + "        public isToken(): bool { return true; }\r\n" + "        public isTrivia(): bool { return false; }\r\n" + "        public isList(): bool { return false; }\r\n" + "        public isSeparatedList(): bool { return false; }\r\n" + "        public isTriviaList(): bool { return false; }\r\n\r\n";
    result += "        public kind(): SyntaxKind { return this.tokenKind; }\r\n";
    var leadingTriviaWidth = leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0";
    var trailingTriviaWidth = trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0";
    if(leading && trailing) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else {
        if(leading) {
            result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width(); }\r\n";
        } else {
            if(trailing) {
                result += "        public fullWidth(): number { return this.width() + " + trailingTriviaWidth + "; }\r\n";
            } else {
                result += "        public fullWidth(): number { return this.width(); }\r\n";
            }
        }
    }
    if(needsSourcetext) {
        if(leading) {
            result += "        private start(): number { return this._fullStart + " + leadingTriviaWidth + "; }\r\n";
        } else {
            result += "        private start(): number { return this._fullStart; }\r\n";
        }
        result += "        private end(): number { return this.start() + this.width(); }\r\n\r\n";
    }
    if(isPunctuation || isKeyword) {
        result += "        public width(): number { return this.text().length; }\r\n";
    } else {
        result += "        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }\r\n";
    }
    if(isPunctuation || isKeyword) {
        result += "        public text(): string { return SyntaxFacts.getText(this.tokenKind); }\r\n";
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
    result += "        public hasLeadingComment(): bool { return " + (leading ? "hasTriviaComment(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingNewLine(): bool { return " + (leading ? "hasTriviaNewLine(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingSkippedText(): bool { return false; }\r\n";
    result += "        public leadingTriviaWidth(): number { return " + (leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public leadingTrivia(): ISyntaxTriviaList { return " + (leading ? "Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasTrailingTrivia(): bool { return " + (trailing ? "true" : "false") + "; }\r\n";
    result += "        public hasTrailingComment(): bool { return " + (trailing ? "hasTriviaComment(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingNewLine(): bool { return " + (trailing ? "hasTriviaNewLine(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingSkippedText(): bool { return false; }\r\n";
    result += "        public trailingTriviaWidth(): number { return " + (trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public trailingTrivia(): ISyntaxTriviaList { return " + (trailing ? "Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasSkippedText(): bool { return false; }\r\n";
    result += "        public toJSON(key) { return tokenToJSON(this); }\r\n" + "        private firstToken() { return this; }\r\n" + "        private lastToken() { return this; }\r\n" + "        private isTypeScriptSpecific() { return false; }\r\n" + "        private hasZeroWidthToken() { return false; }\r\n" + "        private accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }\r\n" + "        private hasRegularExpressionToken() { return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.kind()); }\r\n" + "        private realize(): ISyntaxToken { return realize(this); }\r\n" + "        private collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }\r\n\r\n";
    result += "        private findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {\r\n" + "            return { token: this, fullStart: fullStart };\r\n" + "        }\r\n\r\n";
    result += "        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withLeadingTrivia(leadingTrivia);\r\n" + "        }\r\n" + "\r\n" + "        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withTrailingTrivia(trailingTrivia);\r\n" + "        }\r\n";
    result += "    }\r\n";
    return result;
}
function generateTokens() {
    var result = "///<reference path='ISyntaxToken.ts' />\r\n" + "///<reference path='IText.ts' />\r\n" + "///<reference path='SyntaxToken.ts' />\r\n" + "\r\n" + "module Syntax {\r\n";
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
    result += "    function collectTokenTextElements(token: ISyntaxToken, elements: string[]): void {\r\n" + "        (<any>token.leadingTrivia()).collectTextElements(elements);\r\n" + "        elements.push(token.text());\r\n" + "        (<any>token.trailingTrivia()).collectTextElements(elements);\r\n" + "    }\r\n" + "\r\n" + "    function fixedWidthToken(sourceText: IText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new FixedWidthTokenWithNoTrivia(kind);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    function variableWidthToken(sourceText: IText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, width);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, width, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    export function tokenFromText(text: IText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "        if (SyntaxFacts.isAnyPunctuation(kind) || SyntaxFacts.isAnyKeyword(kind)) {\r\n" + "            return fixedWidthToken(text, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return variableWidthToken(text, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n\r\n";
    result += "    function getTriviaWidth(value: number): number {\r\n" + "        return value >>> Constants.TriviaFullWidthShift;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaComment(value: number): bool {\r\n" + "        return (value & Constants.TriviaCommentMask) !== 0;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaNewLine(value: number): bool {\r\n" + "        return (value & Constants.TriviaNewLineMask) !== 0;\r\n" + "    }\r\n";
    result += "}";
    return result;
}
function generateWalker() {
    var result = "";
    result += "///<reference path='SyntaxVisitor.generated.ts' />\r\n" + "\r\n" + "class SyntaxWalker implements ISyntaxVisitor {\r\n" + "    public visitToken(token: ISyntaxToken): void {\r\n" + "    }\r\n" + "\r\n" + "    public visitNode(node: SyntaxNode): void {\r\n" + "        node.accept(this);\r\n" + "    }\r\n" + "\r\n" + "    public visitNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "        if (nodeOrToken.isToken()) { \r\n" + "            this.visitToken(<ISyntaxToken>nodeOrToken);\r\n" + "        }\r\n" + "        else {\r\n" + "            this.visitNode(<SyntaxNode>nodeOrToken);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    private visitOptionalToken(token: ISyntaxToken): void {\r\n" + "        if (token === null) {\r\n" + "            return;\r\n" + "        }\r\n" + "\r\n" + "        this.visitToken(token);\r\n" + "    }\r\n" + "\r\n" + "    public visitOptionalNode(node: SyntaxNode): void {\r\n" + "        if (node === null) {\r\n" + "            return;\r\n" + "        }\r\n" + "\r\n" + "        this.visitNode(node);\r\n" + "    }\r\n" + "\r\n" + "    public visitOptionalNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "        if (nodeOrToken === null) {\r\n" + "            return;\r\n" + "        }\r\n" + "\r\n" + "        this.visitNodeOrToken(nodeOrToken);\r\n" + "    }\r\n" + "\r\n" + "    public visitList(list: ISyntaxList): void {\r\n" + "        for (var i = 0, n = list.count(); i < n; i++) {\r\n" + "           this.visitNodeOrToken(list.itemAt(i));\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    public visitSeparatedList(list: ISeparatedSyntaxList): void {\r\n" + "        for (var i = 0, n = list.itemAndSeparatorCount(); i < n; i++) {\r\n" + "            var item = list.itemOrSeparatorAt(i);\r\n" + "            this.visitNodeOrToken(item);\r\n" + "        }\r\n" + "    }\r\n";
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
                        if(isNodeOrToken(child)) {
                            if(child.isOptional) {
                                result += "        this.visitOptionalNodeOrToken(node." + child.name + "());\r\n";
                            } else {
                                result += "        this.visitNodeOrToken(node." + child.name + "());\r\n";
                            }
                        } else {
                            if(child.type !== "SyntaxKind") {
                                if(child.isOptional) {
                                    result += "        this.visitOptionalNode(node." + child.name + "());\r\n";
                                } else {
                                    result += "        this.visitNode(node." + child.name + "());\r\n";
                                }
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
    var result = "///<reference path='CharacterCodes.ts' />\r\n" + "///<reference path='SyntaxKind.ts' />\r\n" + "\r\n" + "class ScannerUtilities {\r\n";
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
function generateVisitor() {
    var result = "";
    result += "///<reference path='SyntaxNodes.generated.ts' />\r\n\r\n";
    result += "interface ISyntaxVisitor {\r\n";
    result += "    visitToken(token: ISyntaxToken): any;\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(!definition.isAbstract) {
            result += "    visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any;\r\n";
        }
    }
    result += "}\r\n\r\n";
    result += "class SyntaxVisitor implements ISyntaxVisitor {\r\n";
    result += "    public defaultVisit(node: ISyntaxNodeOrToken): any {\r\n";
    result += "        return null;\r\n";
    result += "    }\r\n";
    result += "\r\n";
    result += "    private visitToken(token: ISyntaxToken): any {\r\n";
    result += "        return this.defaultVisit(token);\r\n";
    result += "    }\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if(!definition.isAbstract) {
            result += "\r\n    private visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
            result += "        return this.defaultVisit(node);\r\n";
            result += "    }\r\n";
        }
    }
    result += "}";
    return result;
}
var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
var tokens = generateTokens();
var walker = generateWalker();
var scannerUtilities = generateScannerUtilities();
var visitor = generateVisitor();
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxNodes.generated.ts", syntaxNodes, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxRewriter.generated.ts", rewriter, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxToken.generated.ts", tokens, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxWalker.generated.ts", walker, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\ScannerUtilities.generated.ts", scannerUtilities, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxVisitor.generated.ts", visitor, true);
