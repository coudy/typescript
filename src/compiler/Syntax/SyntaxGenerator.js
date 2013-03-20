var TypeScript;
(function (TypeScript) {
    var Debug = (function () {
        function Debug() { }
        Debug.assert = function assert(expression, message) {
            if (!expression) {
                throw new Error("Debug Failure. False expression." + (message ? message : ""));
            }
        };
        return Debug;
    })();
    TypeScript.Debug = Debug;    
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Errors = (function () {
        function Errors() { }
        Errors.argument = function argument(argument, message) {
            return new Error("Invalid argument: " + argument + "." + (message ? (" " + message) : ""));
        };
        Errors.argumentOutOfRange = function argumentOutOfRange(argument) {
            return new Error("Argument out of range: " + argument + ".");
        };
        Errors.argumentNull = function argumentNull(argument) {
            return new Error("Argument null: " + argument + ".");
        };
        Errors.abstract = function abstract() {
            return new Error("Operation not implemented properly by subclass.");
        };
        Errors.notYetImplemented = function notYetImplemented() {
            return new Error("Not yet implemented.");
        };
        Errors.invalidOperation = function invalidOperation(message) {
            return new Error(message ? ("Invalid operation: " + message) : "Invalid operation.");
        };
        return Errors;
    })();
    TypeScript.Errors = Errors;    
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var ArrayUtilities = (function () {
        function ArrayUtilities() { }
        ArrayUtilities.isArray = function isArray(value) {
            return Object.prototype.toString.apply(value, []) === '[object Array]';
        };
        ArrayUtilities.sequenceEquals = function sequenceEquals(array1, array2, equals) {
            if (array1 === array2) {
                return true;
            }
            if (array1 === null || array2 === null) {
                return false;
            }
            if (array1.length !== array2.length) {
                return false;
            }
            for(var i = 0, n = array1.length; i < n; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }
            return true;
        };
        ArrayUtilities.contains = function contains(array, value) {
            for(var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
            return false;
        };
        ArrayUtilities.groupBy = function groupBy(array, func) {
            var result = {};
            for(var i = 0, n = array.length; i < n; i++) {
                var v = array[i];
                var k = func(v);
                var list = result[k] || [];
                list.push(v);
                result[k] = list;
            }
            return result;
        };
        ArrayUtilities.min = function min(array, func) {
            var min = func(array[0]);
            for(var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next < min) {
                    min = next;
                }
            }
            return min;
        };
        ArrayUtilities.max = function max(array, func) {
            var max = func(array[0]);
            for(var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next > max) {
                    max = next;
                }
            }
            return max;
        };
        ArrayUtilities.last = function last(array) {
            if (array.length === 0) {
                throw TypeScript.Errors.argumentOutOfRange('array');
            }
            return array[array.length - 1];
        };
        ArrayUtilities.firstOrDefault = function firstOrDefault(array, func) {
            for(var i = 0, n = array.length; i < n; i++) {
                var value = array[i];
                if (func(value)) {
                    return value;
                }
            }
            return null;
        };
        ArrayUtilities.sum = function sum(array, func) {
            var result = 0;
            for(var i = 0, n = array.length; i < n; i++) {
                result += func(array[i]);
            }
            return result;
        };
        ArrayUtilities.whereNotNull = function whereNotNull(array) {
            var result = [];
            for(var i = 0; i < array.length; i++) {
                var value = array[i];
                if (value !== null) {
                    result.push(value);
                }
            }
            return result;
        };
        ArrayUtilities.select = function select(values, func) {
            var result = [];
            for(var i = 0; i < values.length; i++) {
                result.push(func(values[i]));
            }
            return result;
        };
        ArrayUtilities.where = function where(values, func) {
            var result = [];
            for(var i = 0; i < values.length; i++) {
                if (func(values[i])) {
                    result.push(values[i]);
                }
            }
            return result;
        };
        ArrayUtilities.any = function any(array, func) {
            for(var i = 0, n = array.length; i < n; i++) {
                if (func(array[i])) {
                    return true;
                }
            }
            return false;
        };
        ArrayUtilities.all = function all(array, func) {
            for(var i = 0, n = array.length; i < n; i++) {
                if (!func(array[i])) {
                    return false;
                }
            }
            return true;
        };
        ArrayUtilities.binarySearch = function binarySearch(array, value) {
            var low = 0;
            var high = array.length - 1;
            while(low <= high) {
                var middle = low + ((high - low) >> 1);
                var midValue = array[middle];
                if (midValue === value) {
                    return middle;
                } else if (midValue > value) {
                    high = middle - 1;
                } else {
                    low = middle + 1;
                }
            }
            return ~low;
        };
        ArrayUtilities.createArray = function createArray(length, defaultvalue) {
            var result = [];
            for(var i = 0; i < length; i++) {
                result.push(defaultvalue);
            }
            return result;
        };
        ArrayUtilities.grow = function grow(array, length, defaultValue) {
            var count = length - array.length;
            for(var i = 0; i < count; i++) {
                array.push(defaultValue);
            }
        };
        ArrayUtilities.copy = function copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
            for(var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        };
        return ArrayUtilities;
    })();
    TypeScript.ArrayUtilities = ArrayUtilities;    
})(TypeScript || (TypeScript = {}));
var Environment = (function () {
    function getWindowsScriptHostEnvironment() {
        try  {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
        } catch (e) {
            return null;
        }
        var streamObjectPool = [];
        function getStreamObject() {
            if (streamObjectPool.length > 0) {
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
            currentDirectory: function () {
                return (WScript).CreateObject("WScript.Shell").CurrentDirectory;
            },
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
                    if ((bomChar.charCodeAt(0) === 0xFE && bomChar.charCodeAt(1) === 0xFF) || (bomChar.charCodeAt(0) === 0xFF && bomChar.charCodeAt(1) === 0xFE)) {
                        streamObj.Charset = 'unicode';
                    } else if (bomChar.charCodeAt(0) === 0xEF && bomChar.charCodeAt(1) === 0xBB) {
                        streamObj.Charset = 'utf-8';
                    } else {
                        streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
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
                if (fso.FileExists(path)) {
                    fso.DeleteFile(path, true);
                }
            },
            directoryExists: function (path) {
                return fso.FolderExists(path);
            },
            listFiles: function (path, spec, options) {
                options = options || {};
                function filesInFolder(folder, root) {
                    var paths = [];
                    var fc;
                    if (options.recursive) {
                        fc = new Enumerator(folder.subfolders);
                        for(; !fc.atEnd(); fc.moveNext()) {
                            paths = paths.concat(filesInFolder(fc.item(), root + "\\" + fc.item().Name));
                        }
                    }
                    fc = new Enumerator(folder.files);
                    for(; !fc.atEnd(); fc.moveNext()) {
                        if (!spec || fc.item().Name.match(spec)) {
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
    ;
    function getNodeEnvironment() {
        var _fs = require('fs');
        var _path = require('path');
        var _module = require('module');
        return {
            currentDirectory: function () {
                return (process).cwd();
            },
            readFile: function (file, useUTF8) {
                var buffer = _fs.readFileSync(file);
                switch(buffer[0]) {
                    case 0xFE:
                        if (buffer[1] === 0xFF) {
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
                    case 0xFF:
                        if (buffer[1] === 0xFE) {
                            return buffer.toString("ucs2", 2);
                        }
                        break;
                    case 0xEF:
                        if (buffer[1] === 0xBB) {
                            return buffer.toString("utf8", 3);
                        }
                }
                return useUTF8 ? buffer.toString("utf8", 0) : buffer.toString();
            },
            writeFile: function (path, contents, useUTF) {
                if (useUTF) {
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
                options = options || {};
                function filesInFolder(folder) {
                    var paths = [];
                    var files = _fs.readdirSync(folder);
                    for(var i = 0; i < files.length; i++) {
                        var stat = _fs.statSync(folder + "\\" + files[i]);
                        if (options.recursive && stat.isDirectory()) {
                            paths = paths.concat(filesInFolder(folder + "\\" + files[i]));
                        } else if (stat.isFile() && (!spec || files[i].match(spec))) {
                            paths.push(folder + "\\" + files[i]);
                        }
                    }
                    return paths;
                }
                return filesInFolder(path);
            },
            createFile: function (path, useUTF8) {
                function mkdirRecursiveSync(path) {
                    var stats = _fs.statSync(path);
                    if (stats.isFile()) {
                        throw "\"" + path + "\" exists but isn't a directory.";
                    } else if (stats.isDirectory()) {
                        return;
                    } else {
                        mkdirRecursiveSync(_path.dirname(path));
                        _fs.mkdirSync(path, 0775);
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
    ;
    if (typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    } else if (typeof require === "function") {
        return getNodeEnvironment();
    } else {
        return null;
    }
})();
var TypeScript;
(function (TypeScript) {
    var StringUtilities = (function () {
        function StringUtilities() { }
        StringUtilities.fromCharCodeArray = function fromCharCodeArray(array) {
            return String.fromCharCode.apply(null, array);
        };
        StringUtilities.endsWith = function endsWith(string, value) {
            return string.substring(string.length - value.length, string.length) === value;
        };
        StringUtilities.startsWith = function startsWith(string, value) {
            return string.substr(0, value.length) === value;
        };
        StringUtilities.copyTo = function copyTo(source, sourceIndex, destination, destinationIndex, count) {
            for(var i = 0; i < count; i++) {
                destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
            }
        };
        StringUtilities.repeat = function repeat(value, count) {
            return Array(count + 1).join(value);
        };
        return StringUtilities;
    })();
    TypeScript.StringUtilities = StringUtilities;    
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
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
        SyntaxKind._map[9] = "ErrorToken";
        SyntaxKind.ErrorToken = 9;
        SyntaxKind._map[10] = "EndOfFileToken";
        SyntaxKind.EndOfFileToken = 10;
        SyntaxKind._map[11] = "IdentifierName";
        SyntaxKind.IdentifierName = 11;
        SyntaxKind._map[12] = "RegularExpressionLiteral";
        SyntaxKind.RegularExpressionLiteral = 12;
        SyntaxKind._map[13] = "NumericLiteral";
        SyntaxKind.NumericLiteral = 13;
        SyntaxKind._map[14] = "StringLiteral";
        SyntaxKind.StringLiteral = 14;
        SyntaxKind._map[15] = "BreakKeyword";
        SyntaxKind.BreakKeyword = 15;
        SyntaxKind._map[16] = "CaseKeyword";
        SyntaxKind.CaseKeyword = 16;
        SyntaxKind._map[17] = "CatchKeyword";
        SyntaxKind.CatchKeyword = 17;
        SyntaxKind._map[18] = "ContinueKeyword";
        SyntaxKind.ContinueKeyword = 18;
        SyntaxKind._map[19] = "DebuggerKeyword";
        SyntaxKind.DebuggerKeyword = 19;
        SyntaxKind._map[20] = "DefaultKeyword";
        SyntaxKind.DefaultKeyword = 20;
        SyntaxKind._map[21] = "DeleteKeyword";
        SyntaxKind.DeleteKeyword = 21;
        SyntaxKind._map[22] = "DoKeyword";
        SyntaxKind.DoKeyword = 22;
        SyntaxKind._map[23] = "ElseKeyword";
        SyntaxKind.ElseKeyword = 23;
        SyntaxKind._map[24] = "FalseKeyword";
        SyntaxKind.FalseKeyword = 24;
        SyntaxKind._map[25] = "FinallyKeyword";
        SyntaxKind.FinallyKeyword = 25;
        SyntaxKind._map[26] = "ForKeyword";
        SyntaxKind.ForKeyword = 26;
        SyntaxKind._map[27] = "FunctionKeyword";
        SyntaxKind.FunctionKeyword = 27;
        SyntaxKind._map[28] = "IfKeyword";
        SyntaxKind.IfKeyword = 28;
        SyntaxKind._map[29] = "InKeyword";
        SyntaxKind.InKeyword = 29;
        SyntaxKind._map[30] = "InstanceOfKeyword";
        SyntaxKind.InstanceOfKeyword = 30;
        SyntaxKind._map[31] = "NewKeyword";
        SyntaxKind.NewKeyword = 31;
        SyntaxKind._map[32] = "NullKeyword";
        SyntaxKind.NullKeyword = 32;
        SyntaxKind._map[33] = "ReturnKeyword";
        SyntaxKind.ReturnKeyword = 33;
        SyntaxKind._map[34] = "SwitchKeyword";
        SyntaxKind.SwitchKeyword = 34;
        SyntaxKind._map[35] = "ThisKeyword";
        SyntaxKind.ThisKeyword = 35;
        SyntaxKind._map[36] = "ThrowKeyword";
        SyntaxKind.ThrowKeyword = 36;
        SyntaxKind._map[37] = "TrueKeyword";
        SyntaxKind.TrueKeyword = 37;
        SyntaxKind._map[38] = "TryKeyword";
        SyntaxKind.TryKeyword = 38;
        SyntaxKind._map[39] = "TypeOfKeyword";
        SyntaxKind.TypeOfKeyword = 39;
        SyntaxKind._map[40] = "VarKeyword";
        SyntaxKind.VarKeyword = 40;
        SyntaxKind._map[41] = "VoidKeyword";
        SyntaxKind.VoidKeyword = 41;
        SyntaxKind._map[42] = "WhileKeyword";
        SyntaxKind.WhileKeyword = 42;
        SyntaxKind._map[43] = "WithKeyword";
        SyntaxKind.WithKeyword = 43;
        SyntaxKind._map[44] = "ClassKeyword";
        SyntaxKind.ClassKeyword = 44;
        SyntaxKind._map[45] = "ConstKeyword";
        SyntaxKind.ConstKeyword = 45;
        SyntaxKind._map[46] = "EnumKeyword";
        SyntaxKind.EnumKeyword = 46;
        SyntaxKind._map[47] = "ExportKeyword";
        SyntaxKind.ExportKeyword = 47;
        SyntaxKind._map[48] = "ExtendsKeyword";
        SyntaxKind.ExtendsKeyword = 48;
        SyntaxKind._map[49] = "ImportKeyword";
        SyntaxKind.ImportKeyword = 49;
        SyntaxKind._map[50] = "SuperKeyword";
        SyntaxKind.SuperKeyword = 50;
        SyntaxKind._map[51] = "ImplementsKeyword";
        SyntaxKind.ImplementsKeyword = 51;
        SyntaxKind._map[52] = "InterfaceKeyword";
        SyntaxKind.InterfaceKeyword = 52;
        SyntaxKind._map[53] = "LetKeyword";
        SyntaxKind.LetKeyword = 53;
        SyntaxKind._map[54] = "PackageKeyword";
        SyntaxKind.PackageKeyword = 54;
        SyntaxKind._map[55] = "PrivateKeyword";
        SyntaxKind.PrivateKeyword = 55;
        SyntaxKind._map[56] = "ProtectedKeyword";
        SyntaxKind.ProtectedKeyword = 56;
        SyntaxKind._map[57] = "PublicKeyword";
        SyntaxKind.PublicKeyword = 57;
        SyntaxKind._map[58] = "StaticKeyword";
        SyntaxKind.StaticKeyword = 58;
        SyntaxKind._map[59] = "YieldKeyword";
        SyntaxKind.YieldKeyword = 59;
        SyntaxKind._map[60] = "AnyKeyword";
        SyntaxKind.AnyKeyword = 60;
        SyntaxKind._map[61] = "BooleanKeyword";
        SyntaxKind.BooleanKeyword = 61;
        SyntaxKind._map[62] = "BoolKeyword";
        SyntaxKind.BoolKeyword = 62;
        SyntaxKind._map[63] = "ConstructorKeyword";
        SyntaxKind.ConstructorKeyword = 63;
        SyntaxKind._map[64] = "DeclareKeyword";
        SyntaxKind.DeclareKeyword = 64;
        SyntaxKind._map[65] = "GetKeyword";
        SyntaxKind.GetKeyword = 65;
        SyntaxKind._map[66] = "ModuleKeyword";
        SyntaxKind.ModuleKeyword = 66;
        SyntaxKind._map[67] = "NumberKeyword";
        SyntaxKind.NumberKeyword = 67;
        SyntaxKind._map[68] = "SetKeyword";
        SyntaxKind.SetKeyword = 68;
        SyntaxKind._map[69] = "StringKeyword";
        SyntaxKind.StringKeyword = 69;
        SyntaxKind._map[70] = "OpenBraceToken";
        SyntaxKind.OpenBraceToken = 70;
        SyntaxKind._map[71] = "CloseBraceToken";
        SyntaxKind.CloseBraceToken = 71;
        SyntaxKind._map[72] = "OpenParenToken";
        SyntaxKind.OpenParenToken = 72;
        SyntaxKind._map[73] = "CloseParenToken";
        SyntaxKind.CloseParenToken = 73;
        SyntaxKind._map[74] = "OpenBracketToken";
        SyntaxKind.OpenBracketToken = 74;
        SyntaxKind._map[75] = "CloseBracketToken";
        SyntaxKind.CloseBracketToken = 75;
        SyntaxKind._map[76] = "DotToken";
        SyntaxKind.DotToken = 76;
        SyntaxKind._map[77] = "DotDotDotToken";
        SyntaxKind.DotDotDotToken = 77;
        SyntaxKind._map[78] = "SemicolonToken";
        SyntaxKind.SemicolonToken = 78;
        SyntaxKind._map[79] = "CommaToken";
        SyntaxKind.CommaToken = 79;
        SyntaxKind._map[80] = "LessThanToken";
        SyntaxKind.LessThanToken = 80;
        SyntaxKind._map[81] = "GreaterThanToken";
        SyntaxKind.GreaterThanToken = 81;
        SyntaxKind._map[82] = "LessThanEqualsToken";
        SyntaxKind.LessThanEqualsToken = 82;
        SyntaxKind._map[83] = "GreaterThanEqualsToken";
        SyntaxKind.GreaterThanEqualsToken = 83;
        SyntaxKind._map[84] = "EqualsEqualsToken";
        SyntaxKind.EqualsEqualsToken = 84;
        SyntaxKind._map[85] = "EqualsGreaterThanToken";
        SyntaxKind.EqualsGreaterThanToken = 85;
        SyntaxKind._map[86] = "ExclamationEqualsToken";
        SyntaxKind.ExclamationEqualsToken = 86;
        SyntaxKind._map[87] = "EqualsEqualsEqualsToken";
        SyntaxKind.EqualsEqualsEqualsToken = 87;
        SyntaxKind._map[88] = "ExclamationEqualsEqualsToken";
        SyntaxKind.ExclamationEqualsEqualsToken = 88;
        SyntaxKind._map[89] = "PlusToken";
        SyntaxKind.PlusToken = 89;
        SyntaxKind._map[90] = "MinusToken";
        SyntaxKind.MinusToken = 90;
        SyntaxKind._map[91] = "AsteriskToken";
        SyntaxKind.AsteriskToken = 91;
        SyntaxKind._map[92] = "PercentToken";
        SyntaxKind.PercentToken = 92;
        SyntaxKind._map[93] = "PlusPlusToken";
        SyntaxKind.PlusPlusToken = 93;
        SyntaxKind._map[94] = "MinusMinusToken";
        SyntaxKind.MinusMinusToken = 94;
        SyntaxKind._map[95] = "LessThanLessThanToken";
        SyntaxKind.LessThanLessThanToken = 95;
        SyntaxKind._map[96] = "GreaterThanGreaterThanToken";
        SyntaxKind.GreaterThanGreaterThanToken = 96;
        SyntaxKind._map[97] = "GreaterThanGreaterThanGreaterThanToken";
        SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 97;
        SyntaxKind._map[98] = "AmpersandToken";
        SyntaxKind.AmpersandToken = 98;
        SyntaxKind._map[99] = "BarToken";
        SyntaxKind.BarToken = 99;
        SyntaxKind._map[100] = "CaretToken";
        SyntaxKind.CaretToken = 100;
        SyntaxKind._map[101] = "ExclamationToken";
        SyntaxKind.ExclamationToken = 101;
        SyntaxKind._map[102] = "TildeToken";
        SyntaxKind.TildeToken = 102;
        SyntaxKind._map[103] = "AmpersandAmpersandToken";
        SyntaxKind.AmpersandAmpersandToken = 103;
        SyntaxKind._map[104] = "BarBarToken";
        SyntaxKind.BarBarToken = 104;
        SyntaxKind._map[105] = "QuestionToken";
        SyntaxKind.QuestionToken = 105;
        SyntaxKind._map[106] = "ColonToken";
        SyntaxKind.ColonToken = 106;
        SyntaxKind._map[107] = "EqualsToken";
        SyntaxKind.EqualsToken = 107;
        SyntaxKind._map[108] = "PlusEqualsToken";
        SyntaxKind.PlusEqualsToken = 108;
        SyntaxKind._map[109] = "MinusEqualsToken";
        SyntaxKind.MinusEqualsToken = 109;
        SyntaxKind._map[110] = "AsteriskEqualsToken";
        SyntaxKind.AsteriskEqualsToken = 110;
        SyntaxKind._map[111] = "PercentEqualsToken";
        SyntaxKind.PercentEqualsToken = 111;
        SyntaxKind._map[112] = "LessThanLessThanEqualsToken";
        SyntaxKind.LessThanLessThanEqualsToken = 112;
        SyntaxKind._map[113] = "GreaterThanGreaterThanEqualsToken";
        SyntaxKind.GreaterThanGreaterThanEqualsToken = 113;
        SyntaxKind._map[114] = "GreaterThanGreaterThanGreaterThanEqualsToken";
        SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 114;
        SyntaxKind._map[115] = "AmpersandEqualsToken";
        SyntaxKind.AmpersandEqualsToken = 115;
        SyntaxKind._map[116] = "BarEqualsToken";
        SyntaxKind.BarEqualsToken = 116;
        SyntaxKind._map[117] = "CaretEqualsToken";
        SyntaxKind.CaretEqualsToken = 117;
        SyntaxKind._map[118] = "SlashToken";
        SyntaxKind.SlashToken = 118;
        SyntaxKind._map[119] = "SlashEqualsToken";
        SyntaxKind.SlashEqualsToken = 119;
        SyntaxKind._map[120] = "SourceUnit";
        SyntaxKind.SourceUnit = 120;
        SyntaxKind._map[121] = "QualifiedName";
        SyntaxKind.QualifiedName = 121;
        SyntaxKind._map[122] = "ObjectType";
        SyntaxKind.ObjectType = 122;
        SyntaxKind._map[123] = "FunctionType";
        SyntaxKind.FunctionType = 123;
        SyntaxKind._map[124] = "ArrayType";
        SyntaxKind.ArrayType = 124;
        SyntaxKind._map[125] = "ConstructorType";
        SyntaxKind.ConstructorType = 125;
        SyntaxKind._map[126] = "GenericType";
        SyntaxKind.GenericType = 126;
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
        SyntaxKind._map[133] = "ExportAssignment";
        SyntaxKind.ExportAssignment = 133;
        SyntaxKind._map[134] = "MemberFunctionDeclaration";
        SyntaxKind.MemberFunctionDeclaration = 134;
        SyntaxKind._map[135] = "MemberVariableDeclaration";
        SyntaxKind.MemberVariableDeclaration = 135;
        SyntaxKind._map[136] = "ConstructorDeclaration";
        SyntaxKind.ConstructorDeclaration = 136;
        SyntaxKind._map[137] = "GetMemberAccessorDeclaration";
        SyntaxKind.GetMemberAccessorDeclaration = 137;
        SyntaxKind._map[138] = "SetMemberAccessorDeclaration";
        SyntaxKind.SetMemberAccessorDeclaration = 138;
        SyntaxKind._map[139] = "PropertySignature";
        SyntaxKind.PropertySignature = 139;
        SyntaxKind._map[140] = "CallSignature";
        SyntaxKind.CallSignature = 140;
        SyntaxKind._map[141] = "ConstructSignature";
        SyntaxKind.ConstructSignature = 141;
        SyntaxKind._map[142] = "IndexSignature";
        SyntaxKind.IndexSignature = 142;
        SyntaxKind._map[143] = "MethodSignature";
        SyntaxKind.MethodSignature = 143;
        SyntaxKind._map[144] = "Block";
        SyntaxKind.Block = 144;
        SyntaxKind._map[145] = "IfStatement";
        SyntaxKind.IfStatement = 145;
        SyntaxKind._map[146] = "VariableStatement";
        SyntaxKind.VariableStatement = 146;
        SyntaxKind._map[147] = "ExpressionStatement";
        SyntaxKind.ExpressionStatement = 147;
        SyntaxKind._map[148] = "ReturnStatement";
        SyntaxKind.ReturnStatement = 148;
        SyntaxKind._map[149] = "SwitchStatement";
        SyntaxKind.SwitchStatement = 149;
        SyntaxKind._map[150] = "BreakStatement";
        SyntaxKind.BreakStatement = 150;
        SyntaxKind._map[151] = "ContinueStatement";
        SyntaxKind.ContinueStatement = 151;
        SyntaxKind._map[152] = "ForStatement";
        SyntaxKind.ForStatement = 152;
        SyntaxKind._map[153] = "ForInStatement";
        SyntaxKind.ForInStatement = 153;
        SyntaxKind._map[154] = "EmptyStatement";
        SyntaxKind.EmptyStatement = 154;
        SyntaxKind._map[155] = "ThrowStatement";
        SyntaxKind.ThrowStatement = 155;
        SyntaxKind._map[156] = "WhileStatement";
        SyntaxKind.WhileStatement = 156;
        SyntaxKind._map[157] = "TryStatement";
        SyntaxKind.TryStatement = 157;
        SyntaxKind._map[158] = "LabeledStatement";
        SyntaxKind.LabeledStatement = 158;
        SyntaxKind._map[159] = "DoStatement";
        SyntaxKind.DoStatement = 159;
        SyntaxKind._map[160] = "DebuggerStatement";
        SyntaxKind.DebuggerStatement = 160;
        SyntaxKind._map[161] = "WithStatement";
        SyntaxKind.WithStatement = 161;
        SyntaxKind._map[162] = "PlusExpression";
        SyntaxKind.PlusExpression = 162;
        SyntaxKind._map[163] = "NegateExpression";
        SyntaxKind.NegateExpression = 163;
        SyntaxKind._map[164] = "BitwiseNotExpression";
        SyntaxKind.BitwiseNotExpression = 164;
        SyntaxKind._map[165] = "LogicalNotExpression";
        SyntaxKind.LogicalNotExpression = 165;
        SyntaxKind._map[166] = "PreIncrementExpression";
        SyntaxKind.PreIncrementExpression = 166;
        SyntaxKind._map[167] = "PreDecrementExpression";
        SyntaxKind.PreDecrementExpression = 167;
        SyntaxKind._map[168] = "DeleteExpression";
        SyntaxKind.DeleteExpression = 168;
        SyntaxKind._map[169] = "TypeOfExpression";
        SyntaxKind.TypeOfExpression = 169;
        SyntaxKind._map[170] = "VoidExpression";
        SyntaxKind.VoidExpression = 170;
        SyntaxKind._map[171] = "CommaExpression";
        SyntaxKind.CommaExpression = 171;
        SyntaxKind._map[172] = "AssignmentExpression";
        SyntaxKind.AssignmentExpression = 172;
        SyntaxKind._map[173] = "AddAssignmentExpression";
        SyntaxKind.AddAssignmentExpression = 173;
        SyntaxKind._map[174] = "SubtractAssignmentExpression";
        SyntaxKind.SubtractAssignmentExpression = 174;
        SyntaxKind._map[175] = "MultiplyAssignmentExpression";
        SyntaxKind.MultiplyAssignmentExpression = 175;
        SyntaxKind._map[176] = "DivideAssignmentExpression";
        SyntaxKind.DivideAssignmentExpression = 176;
        SyntaxKind._map[177] = "ModuloAssignmentExpression";
        SyntaxKind.ModuloAssignmentExpression = 177;
        SyntaxKind._map[178] = "AndAssignmentExpression";
        SyntaxKind.AndAssignmentExpression = 178;
        SyntaxKind._map[179] = "ExclusiveOrAssignmentExpression";
        SyntaxKind.ExclusiveOrAssignmentExpression = 179;
        SyntaxKind._map[180] = "OrAssignmentExpression";
        SyntaxKind.OrAssignmentExpression = 180;
        SyntaxKind._map[181] = "LeftShiftAssignmentExpression";
        SyntaxKind.LeftShiftAssignmentExpression = 181;
        SyntaxKind._map[182] = "SignedRightShiftAssignmentExpression";
        SyntaxKind.SignedRightShiftAssignmentExpression = 182;
        SyntaxKind._map[183] = "UnsignedRightShiftAssignmentExpression";
        SyntaxKind.UnsignedRightShiftAssignmentExpression = 183;
        SyntaxKind._map[184] = "ConditionalExpression";
        SyntaxKind.ConditionalExpression = 184;
        SyntaxKind._map[185] = "LogicalOrExpression";
        SyntaxKind.LogicalOrExpression = 185;
        SyntaxKind._map[186] = "LogicalAndExpression";
        SyntaxKind.LogicalAndExpression = 186;
        SyntaxKind._map[187] = "BitwiseOrExpression";
        SyntaxKind.BitwiseOrExpression = 187;
        SyntaxKind._map[188] = "BitwiseExclusiveOrExpression";
        SyntaxKind.BitwiseExclusiveOrExpression = 188;
        SyntaxKind._map[189] = "BitwiseAndExpression";
        SyntaxKind.BitwiseAndExpression = 189;
        SyntaxKind._map[190] = "EqualsWithTypeConversionExpression";
        SyntaxKind.EqualsWithTypeConversionExpression = 190;
        SyntaxKind._map[191] = "NotEqualsWithTypeConversionExpression";
        SyntaxKind.NotEqualsWithTypeConversionExpression = 191;
        SyntaxKind._map[192] = "EqualsExpression";
        SyntaxKind.EqualsExpression = 192;
        SyntaxKind._map[193] = "NotEqualsExpression";
        SyntaxKind.NotEqualsExpression = 193;
        SyntaxKind._map[194] = "LessThanExpression";
        SyntaxKind.LessThanExpression = 194;
        SyntaxKind._map[195] = "GreaterThanExpression";
        SyntaxKind.GreaterThanExpression = 195;
        SyntaxKind._map[196] = "LessThanOrEqualExpression";
        SyntaxKind.LessThanOrEqualExpression = 196;
        SyntaxKind._map[197] = "GreaterThanOrEqualExpression";
        SyntaxKind.GreaterThanOrEqualExpression = 197;
        SyntaxKind._map[198] = "InstanceOfExpression";
        SyntaxKind.InstanceOfExpression = 198;
        SyntaxKind._map[199] = "InExpression";
        SyntaxKind.InExpression = 199;
        SyntaxKind._map[200] = "LeftShiftExpression";
        SyntaxKind.LeftShiftExpression = 200;
        SyntaxKind._map[201] = "SignedRightShiftExpression";
        SyntaxKind.SignedRightShiftExpression = 201;
        SyntaxKind._map[202] = "UnsignedRightShiftExpression";
        SyntaxKind.UnsignedRightShiftExpression = 202;
        SyntaxKind._map[203] = "MultiplyExpression";
        SyntaxKind.MultiplyExpression = 203;
        SyntaxKind._map[204] = "DivideExpression";
        SyntaxKind.DivideExpression = 204;
        SyntaxKind._map[205] = "ModuloExpression";
        SyntaxKind.ModuloExpression = 205;
        SyntaxKind._map[206] = "AddExpression";
        SyntaxKind.AddExpression = 206;
        SyntaxKind._map[207] = "SubtractExpression";
        SyntaxKind.SubtractExpression = 207;
        SyntaxKind._map[208] = "PostIncrementExpression";
        SyntaxKind.PostIncrementExpression = 208;
        SyntaxKind._map[209] = "PostDecrementExpression";
        SyntaxKind.PostDecrementExpression = 209;
        SyntaxKind._map[210] = "MemberAccessExpression";
        SyntaxKind.MemberAccessExpression = 210;
        SyntaxKind._map[211] = "InvocationExpression";
        SyntaxKind.InvocationExpression = 211;
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
        SyntaxKind._map[221] = "OmittedExpression";
        SyntaxKind.OmittedExpression = 221;
        SyntaxKind._map[222] = "VariableDeclaration";
        SyntaxKind.VariableDeclaration = 222;
        SyntaxKind._map[223] = "VariableDeclarator";
        SyntaxKind.VariableDeclarator = 223;
        SyntaxKind._map[224] = "ArgumentList";
        SyntaxKind.ArgumentList = 224;
        SyntaxKind._map[225] = "ParameterList";
        SyntaxKind.ParameterList = 225;
        SyntaxKind._map[226] = "TypeArgumentList";
        SyntaxKind.TypeArgumentList = 226;
        SyntaxKind._map[227] = "TypeParameterList";
        SyntaxKind.TypeParameterList = 227;
        SyntaxKind._map[228] = "ImplementsClause";
        SyntaxKind.ImplementsClause = 228;
        SyntaxKind._map[229] = "ExtendsClause";
        SyntaxKind.ExtendsClause = 229;
        SyntaxKind._map[230] = "ColonValueClause";
        SyntaxKind.ColonValueClause = 230;
        SyntaxKind._map[231] = "EqualsValueClause";
        SyntaxKind.EqualsValueClause = 231;
        SyntaxKind._map[232] = "CaseSwitchClause";
        SyntaxKind.CaseSwitchClause = 232;
        SyntaxKind._map[233] = "DefaultSwitchClause";
        SyntaxKind.DefaultSwitchClause = 233;
        SyntaxKind._map[234] = "ElseClause";
        SyntaxKind.ElseClause = 234;
        SyntaxKind._map[235] = "CatchClause";
        SyntaxKind.CatchClause = 235;
        SyntaxKind._map[236] = "FinallyClause";
        SyntaxKind.FinallyClause = 236;
        SyntaxKind._map[237] = "TypeParameter";
        SyntaxKind.TypeParameter = 237;
        SyntaxKind._map[238] = "Constraint";
        SyntaxKind.Constraint = 238;
        SyntaxKind._map[239] = "Parameter";
        SyntaxKind.Parameter = 239;
        SyntaxKind._map[240] = "EnumElement";
        SyntaxKind.EnumElement = 240;
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
        SyntaxKind.FirstToken = SyntaxKind.ErrorToken;
        SyntaxKind.LastToken = SyntaxKind.SlashEqualsToken;
        SyntaxKind.FirstPunctuation = SyntaxKind.OpenBraceToken;
        SyntaxKind.LastPunctuation = SyntaxKind.SlashEqualsToken;
        SyntaxKind.FirstFixedWidth = SyntaxKind.FirstKeyword;
        SyntaxKind.LastFixedWidth = SyntaxKind.LastPunctuation;
    })(TypeScript.SyntaxKind || (TypeScript.SyntaxKind = {}));
    var SyntaxKind = TypeScript.SyntaxKind;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (SyntaxFacts) {
        var textToKeywordKind = {
            "any": 60 /* AnyKeyword */ ,
            "bool": 62 /* BoolKeyword */ ,
            "boolean": 61 /* BooleanKeyword */ ,
            "break": 15 /* BreakKeyword */ ,
            "case": 16 /* CaseKeyword */ ,
            "catch": 17 /* CatchKeyword */ ,
            "class": 44 /* ClassKeyword */ ,
            "continue": 18 /* ContinueKeyword */ ,
            "const": 45 /* ConstKeyword */ ,
            "constructor": 63 /* ConstructorKeyword */ ,
            "debugger": 19 /* DebuggerKeyword */ ,
            "declare": 64 /* DeclareKeyword */ ,
            "default": 20 /* DefaultKeyword */ ,
            "delete": 21 /* DeleteKeyword */ ,
            "do": 22 /* DoKeyword */ ,
            "else": 23 /* ElseKeyword */ ,
            "enum": 46 /* EnumKeyword */ ,
            "export": 47 /* ExportKeyword */ ,
            "extends": 48 /* ExtendsKeyword */ ,
            "false": 24 /* FalseKeyword */ ,
            "finally": 25 /* FinallyKeyword */ ,
            "for": 26 /* ForKeyword */ ,
            "function": 27 /* FunctionKeyword */ ,
            "get": 65 /* GetKeyword */ ,
            "if": 28 /* IfKeyword */ ,
            "implements": 51 /* ImplementsKeyword */ ,
            "import": 49 /* ImportKeyword */ ,
            "in": 29 /* InKeyword */ ,
            "instanceof": 30 /* InstanceOfKeyword */ ,
            "interface": 52 /* InterfaceKeyword */ ,
            "let": 53 /* LetKeyword */ ,
            "module": 66 /* ModuleKeyword */ ,
            "new": 31 /* NewKeyword */ ,
            "null": 32 /* NullKeyword */ ,
            "number": 67 /* NumberKeyword */ ,
            "package": 54 /* PackageKeyword */ ,
            "private": 55 /* PrivateKeyword */ ,
            "protected": 56 /* ProtectedKeyword */ ,
            "public": 57 /* PublicKeyword */ ,
            "return": 33 /* ReturnKeyword */ ,
            "set": 68 /* SetKeyword */ ,
            "static": 58 /* StaticKeyword */ ,
            "string": 69 /* StringKeyword */ ,
            "super": 50 /* SuperKeyword */ ,
            "switch": 34 /* SwitchKeyword */ ,
            "this": 35 /* ThisKeyword */ ,
            "throw": 36 /* ThrowKeyword */ ,
            "true": 37 /* TrueKeyword */ ,
            "try": 38 /* TryKeyword */ ,
            "typeof": 39 /* TypeOfKeyword */ ,
            "var": 40 /* VarKeyword */ ,
            "void": 41 /* VoidKeyword */ ,
            "while": 42 /* WhileKeyword */ ,
            "with": 43 /* WithKeyword */ ,
            "yield": 59 /* YieldKeyword */ ,
            "{": 70 /* OpenBraceToken */ ,
            "}": 71 /* CloseBraceToken */ ,
            "(": 72 /* OpenParenToken */ ,
            ")": 73 /* CloseParenToken */ ,
            "[": 74 /* OpenBracketToken */ ,
            "]": 75 /* CloseBracketToken */ ,
            ".": 76 /* DotToken */ ,
            "...": 77 /* DotDotDotToken */ ,
            ";": 78 /* SemicolonToken */ ,
            ",": 79 /* CommaToken */ ,
            "<": 80 /* LessThanToken */ ,
            ">": 81 /* GreaterThanToken */ ,
            "<=": 82 /* LessThanEqualsToken */ ,
            ">=": 83 /* GreaterThanEqualsToken */ ,
            "==": 84 /* EqualsEqualsToken */ ,
            "=>": 85 /* EqualsGreaterThanToken */ ,
            "!=": 86 /* ExclamationEqualsToken */ ,
            "===": 87 /* EqualsEqualsEqualsToken */ ,
            "!==": 88 /* ExclamationEqualsEqualsToken */ ,
            "+": 89 /* PlusToken */ ,
            "-": 90 /* MinusToken */ ,
            "*": 91 /* AsteriskToken */ ,
            "%": 92 /* PercentToken */ ,
            "++": 93 /* PlusPlusToken */ ,
            "--": 94 /* MinusMinusToken */ ,
            "<<": 95 /* LessThanLessThanToken */ ,
            ">>": 96 /* GreaterThanGreaterThanToken */ ,
            ">>>": 97 /* GreaterThanGreaterThanGreaterThanToken */ ,
            "&": 98 /* AmpersandToken */ ,
            "|": 99 /* BarToken */ ,
            "^": 100 /* CaretToken */ ,
            "!": 101 /* ExclamationToken */ ,
            "~": 102 /* TildeToken */ ,
            "&&": 103 /* AmpersandAmpersandToken */ ,
            "||": 104 /* BarBarToken */ ,
            "?": 105 /* QuestionToken */ ,
            ":": 106 /* ColonToken */ ,
            "=": 107 /* EqualsToken */ ,
            "+=": 108 /* PlusEqualsToken */ ,
            "-=": 109 /* MinusEqualsToken */ ,
            "*=": 110 /* AsteriskEqualsToken */ ,
            "%=": 111 /* PercentEqualsToken */ ,
            "<<=": 112 /* LessThanLessThanEqualsToken */ ,
            ">>=": 113 /* GreaterThanGreaterThanEqualsToken */ ,
            ">>>=": 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ,
            "&=": 115 /* AmpersandEqualsToken */ ,
            "|=": 116 /* BarEqualsToken */ ,
            "^=": 117 /* CaretEqualsToken */ ,
            "/": 118 /* SlashToken */ ,
            "/=": 119 /* SlashEqualsToken */ 
        };
        var kindToText = [];
        for(var name in textToKeywordKind) {
            if (textToKeywordKind.hasOwnProperty(name)) {
                kindToText[textToKeywordKind[name]] = name;
            }
        }
        kindToText[63 /* ConstructorKeyword */ ] = "constructor";
        function getTokenKind(text) {
            if (textToKeywordKind.hasOwnProperty(text)) {
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
            return kind >= 9 /* FirstToken */  && kind <= 119 /* LastToken */ ;
        }
        SyntaxFacts.isTokenKind = isTokenKind;
        function isAnyKeyword(kind) {
            return kind >= 15 /* FirstKeyword */  && kind <= 69 /* LastKeyword */ ;
        }
        SyntaxFacts.isAnyKeyword = isAnyKeyword;
        function isStandardKeyword(kind) {
            return kind >= 15 /* FirstStandardKeyword */  && kind <= 43 /* LastStandardKeyword */ ;
        }
        SyntaxFacts.isStandardKeyword = isStandardKeyword;
        function isFutureReservedKeyword(kind) {
            return kind >= 44 /* FirstFutureReservedKeyword */  && kind <= 50 /* LastFutureReservedKeyword */ ;
        }
        SyntaxFacts.isFutureReservedKeyword = isFutureReservedKeyword;
        function isFutureReservedStrictKeyword(kind) {
            return kind >= 51 /* FirstFutureReservedStrictKeyword */  && kind <= 59 /* LastFutureReservedStrictKeyword */ ;
        }
        SyntaxFacts.isFutureReservedStrictKeyword = isFutureReservedStrictKeyword;
        function isAnyPunctuation(kind) {
            return kind >= 70 /* FirstPunctuation */  && kind <= 119 /* LastPunctuation */ ;
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
                case 89 /* PlusToken */ :
                    return 162 /* PlusExpression */ ;
                case 90 /* MinusToken */ :
                    return 163 /* NegateExpression */ ;
                case 102 /* TildeToken */ :
                    return 164 /* BitwiseNotExpression */ ;
                case 101 /* ExclamationToken */ :
                    return 165 /* LogicalNotExpression */ ;
                case 93 /* PlusPlusToken */ :
                    return 166 /* PreIncrementExpression */ ;
                case 94 /* MinusMinusToken */ :
                    return 167 /* PreDecrementExpression */ ;
                default:
                    return 0 /* None */ ;
            }
        }
        SyntaxFacts.getPrefixUnaryExpressionFromOperatorToken = getPrefixUnaryExpressionFromOperatorToken;
        function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
            switch(tokenKind) {
                case 93 /* PlusPlusToken */ :
                    return 208 /* PostIncrementExpression */ ;
                case 94 /* MinusMinusToken */ :
                    return 209 /* PostDecrementExpression */ ;
                default:
                    return 0 /* None */ ;
            }
        }
        SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = getPostfixUnaryExpressionFromOperatorToken;
        function getBinaryExpressionFromOperatorToken(tokenKind) {
            switch(tokenKind) {
                case 91 /* AsteriskToken */ :
                    return 203 /* MultiplyExpression */ ;
                case 118 /* SlashToken */ :
                    return 204 /* DivideExpression */ ;
                case 92 /* PercentToken */ :
                    return 205 /* ModuloExpression */ ;
                case 89 /* PlusToken */ :
                    return 206 /* AddExpression */ ;
                case 90 /* MinusToken */ :
                    return 207 /* SubtractExpression */ ;
                case 95 /* LessThanLessThanToken */ :
                    return 200 /* LeftShiftExpression */ ;
                case 96 /* GreaterThanGreaterThanToken */ :
                    return 201 /* SignedRightShiftExpression */ ;
                case 97 /* GreaterThanGreaterThanGreaterThanToken */ :
                    return 202 /* UnsignedRightShiftExpression */ ;
                case 80 /* LessThanToken */ :
                    return 194 /* LessThanExpression */ ;
                case 81 /* GreaterThanToken */ :
                    return 195 /* GreaterThanExpression */ ;
                case 82 /* LessThanEqualsToken */ :
                    return 196 /* LessThanOrEqualExpression */ ;
                case 83 /* GreaterThanEqualsToken */ :
                    return 197 /* GreaterThanOrEqualExpression */ ;
                case 30 /* InstanceOfKeyword */ :
                    return 198 /* InstanceOfExpression */ ;
                case 29 /* InKeyword */ :
                    return 199 /* InExpression */ ;
                case 84 /* EqualsEqualsToken */ :
                    return 190 /* EqualsWithTypeConversionExpression */ ;
                case 86 /* ExclamationEqualsToken */ :
                    return 191 /* NotEqualsWithTypeConversionExpression */ ;
                case 87 /* EqualsEqualsEqualsToken */ :
                    return 192 /* EqualsExpression */ ;
                case 88 /* ExclamationEqualsEqualsToken */ :
                    return 193 /* NotEqualsExpression */ ;
                case 98 /* AmpersandToken */ :
                    return 189 /* BitwiseAndExpression */ ;
                case 100 /* CaretToken */ :
                    return 188 /* BitwiseExclusiveOrExpression */ ;
                case 99 /* BarToken */ :
                    return 187 /* BitwiseOrExpression */ ;
                case 103 /* AmpersandAmpersandToken */ :
                    return 186 /* LogicalAndExpression */ ;
                case 104 /* BarBarToken */ :
                    return 185 /* LogicalOrExpression */ ;
                case 116 /* BarEqualsToken */ :
                    return 180 /* OrAssignmentExpression */ ;
                case 115 /* AmpersandEqualsToken */ :
                    return 178 /* AndAssignmentExpression */ ;
                case 117 /* CaretEqualsToken */ :
                    return 179 /* ExclusiveOrAssignmentExpression */ ;
                case 112 /* LessThanLessThanEqualsToken */ :
                    return 181 /* LeftShiftAssignmentExpression */ ;
                case 113 /* GreaterThanGreaterThanEqualsToken */ :
                    return 182 /* SignedRightShiftAssignmentExpression */ ;
                case 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */ :
                    return 183 /* UnsignedRightShiftAssignmentExpression */ ;
                case 108 /* PlusEqualsToken */ :
                    return 173 /* AddAssignmentExpression */ ;
                case 109 /* MinusEqualsToken */ :
                    return 174 /* SubtractAssignmentExpression */ ;
                case 110 /* AsteriskEqualsToken */ :
                    return 175 /* MultiplyAssignmentExpression */ ;
                case 119 /* SlashEqualsToken */ :
                    return 176 /* DivideAssignmentExpression */ ;
                case 111 /* PercentEqualsToken */ :
                    return 177 /* ModuloAssignmentExpression */ ;
                case 107 /* EqualsToken */ :
                    return 172 /* AssignmentExpression */ ;
                case 79 /* CommaToken */ :
                    return 171 /* CommaExpression */ ;
                default:
                    return 0 /* None */ ;
            }
        }
        SyntaxFacts.getBinaryExpressionFromOperatorToken = getBinaryExpressionFromOperatorToken;
        function isAnyDivideToken(kind) {
            switch(kind) {
                case 118 /* SlashToken */ :
                case 119 /* SlashEqualsToken */ :
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isAnyDivideToken = isAnyDivideToken;
        function isAnyDivideOrRegularExpressionToken(kind) {
            switch(kind) {
                case 118 /* SlashToken */ :
                case 119 /* SlashEqualsToken */ :
                case 12 /* RegularExpressionLiteral */ :
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isAnyDivideOrRegularExpressionToken = isAnyDivideOrRegularExpressionToken;
        function isParserGenerated(kind) {
            switch(kind) {
                case 96 /* GreaterThanGreaterThanToken */ :
                case 97 /* GreaterThanGreaterThanGreaterThanToken */ :
                case 83 /* GreaterThanEqualsToken */ :
                case 113 /* GreaterThanGreaterThanEqualsToken */ :
                case 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */ :
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isParserGenerated = isParserGenerated;
        function isAnyBinaryExpression(kind) {
            switch(kind) {
                case 171 /* CommaExpression */ :
                case 172 /* AssignmentExpression */ :
                case 173 /* AddAssignmentExpression */ :
                case 174 /* SubtractAssignmentExpression */ :
                case 175 /* MultiplyAssignmentExpression */ :
                case 176 /* DivideAssignmentExpression */ :
                case 177 /* ModuloAssignmentExpression */ :
                case 178 /* AndAssignmentExpression */ :
                case 179 /* ExclusiveOrAssignmentExpression */ :
                case 180 /* OrAssignmentExpression */ :
                case 181 /* LeftShiftAssignmentExpression */ :
                case 182 /* SignedRightShiftAssignmentExpression */ :
                case 183 /* UnsignedRightShiftAssignmentExpression */ :
                case 185 /* LogicalOrExpression */ :
                case 186 /* LogicalAndExpression */ :
                case 187 /* BitwiseOrExpression */ :
                case 188 /* BitwiseExclusiveOrExpression */ :
                case 189 /* BitwiseAndExpression */ :
                case 190 /* EqualsWithTypeConversionExpression */ :
                case 191 /* NotEqualsWithTypeConversionExpression */ :
                case 192 /* EqualsExpression */ :
                case 193 /* NotEqualsExpression */ :
                case 194 /* LessThanExpression */ :
                case 195 /* GreaterThanExpression */ :
                case 196 /* LessThanOrEqualExpression */ :
                case 197 /* GreaterThanOrEqualExpression */ :
                case 198 /* InstanceOfExpression */ :
                case 199 /* InExpression */ :
                case 200 /* LeftShiftExpression */ :
                case 201 /* SignedRightShiftExpression */ :
                case 202 /* UnsignedRightShiftExpression */ :
                case 203 /* MultiplyExpression */ :
                case 204 /* DivideExpression */ :
                case 205 /* ModuloExpression */ :
                case 206 /* AddExpression */ :
                case 207 /* SubtractExpression */ :
                    return true;
            }
            return false;
        }
        SyntaxFacts.isAnyBinaryExpression = isAnyBinaryExpression;
    })(TypeScript.SyntaxFacts || (TypeScript.SyntaxFacts = {}));
    var SyntaxFacts = TypeScript.SyntaxFacts;
})(TypeScript || (TypeScript = {}));
var argumentChecks = false;
var forPrettyPrinter = false;
var interfaces = {
    IMemberDeclarationSyntax: 'IClassElementSyntax',
    IStatementSyntax: 'IModuleElementSyntax',
    INameSyntax: 'ITypeSyntax',
    ITypeSyntax: 'IUnaryExpressionSyntax',
    IUnaryExpressionSyntax: 'IExpressionSyntax'
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
                    'IdentifierName'
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
        name: 'ExportAssignmentSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IModuleElementSyntax'
        ],
        children: [
            {
                name: 'exportKeyword',
                isToken: true
            }, 
            {
                name: 'equalsToken',
                isToken: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
                ]
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
                    'IdentifierName'
                ]
            }, 
            {
                name: 'typeParameterList',
                type: 'TypeParameterListSyntax',
                isOptional: true
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
                elementType: 'IClassElementSyntax'
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
                    'IdentifierName'
                ]
            }, 
            {
                name: 'typeParameterList',
                type: 'TypeParameterListSyntax',
                isOptional: true
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
                elementType: 'INameSyntax'
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
                elementType: 'INameSyntax'
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
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
                ]
            }, 
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
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
                elementType: 'VariableDeclaratorSyntax'
            }
        ]
    }, 
    {
        name: 'VariableDeclaratorSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IEnumElementSyntax'
        ],
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
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
        name: 'ColonValueClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'colonToken',
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
                    'PlusPlusToken', 
                    'MinusMinusToken', 
                    'PlusToken', 
                    'MinusToken', 
                    'TildeToken', 
                    'ExclamationToken'
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
                    'IdentifierName'
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
                    'IdentifierName'
                ]
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'TypeArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'lessThanToken',
                isToken: true
            }, 
            {
                name: 'typeArguments',
                isSeparatedList: true,
                elementType: 'ITypeSyntax'
            }, 
            {
                name: 'greaterThanToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
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
                name: 'typeParameterList',
                type: 'TypeParameterListSyntax',
                isOptional: true
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
                name: 'typeParameterList',
                type: 'TypeParameterListSyntax',
                isOptional: true
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
                elementType: 'ITypeMemberSyntax'
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
        name: 'GenericTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeSyntax'
        ],
        children: [
            {
                name: 'name',
                type: 'INameSyntax'
            }, 
            {
                name: 'typeArgumentList',
                type: 'TypeArgumentListSyntax'
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
                    'PublicKeyword', 
                    'PrivateKeyword'
                ],
                isTypeScriptSpecific: true
            }, 
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
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
                name: 'name',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
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
                    'PlusPlusToken', 
                    'MinusMinusToken'
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
                name: 'typeArgumentList',
                type: 'TypeArgumentListSyntax',
                isOptional: true
            }, 
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
                    'AsteriskToken', 
                    'SlashToken', 
                    'PercentToken', 
                    'PlusToken', 
                    'MinusToken', 
                    'LessThanLessThanToken', 
                    'GreaterThanGreaterThanToken', 
                    'GreaterThanGreaterThanGreaterThanToken', 
                    'LessThanToken', 
                    'GreaterThanToken', 
                    'LessThanEqualsToken', 
                    'GreaterThanEqualsToken', 
                    'InstanceOfKeyword', 
                    'InKeyword', 
                    'EqualsEqualsToken', 
                    'ExclamationEqualsToken', 
                    'EqualsEqualsEqualsToken', 
                    'ExclamationEqualsEqualsToken', 
                    'AmpersandToken', 
                    'CaretToken', 
                    'BarToken', 
                    'AmpersandAmpersandToken', 
                    'BarBarToken', 
                    'BarEqualsToken', 
                    'AmpersandEqualsToken', 
                    'CaretEqualsToken', 
                    'LessThanLessThanEqualsToken', 
                    'GreaterThanGreaterThanEqualsToken', 
                    'GreaterThanGreaterThanGreaterThanEqualsToken', 
                    'PlusEqualsToken', 
                    'MinusEqualsToken', 
                    'AsteriskEqualsToken', 
                    'SlashEqualsToken', 
                    'PercentEqualsToken', 
                    'EqualsToken', 
                    'CommaToken'
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
        name: 'ConstructSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeMemberSyntax'
        ],
        children: [
            {
                name: 'newKeyword',
                isToken: true
            }, 
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'MethodSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeMemberSyntax'
        ],
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
                ]
            }, 
            {
                name: 'questionToken',
                isToken: true,
                isOptional: true,
                itTypeScriptSpecific: true
            }, 
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
            }
        ]
    }, 
    {
        name: 'IndexSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeMemberSyntax'
        ],
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
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeMemberSyntax'
        ],
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
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
        name: 'CallSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'ITypeMemberSyntax'
        ],
        children: [
            {
                name: 'typeParameterList',
                type: 'TypeParameterListSyntax',
                isOptional: true,
                isTypeScriptSpecific: true
            }, 
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
                elementType: 'ParameterSyntax'
            }, 
            {
                name: 'closeParenToken',
                isToken: true
            }
        ]
    }, 
    {
        name: 'TypeParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'lessThanToken',
                isToken: true
            }, 
            {
                name: 'typeParameters',
                isSeparatedList: true,
                elementType: 'TypeParameterSyntax'
            }, 
            {
                name: 'greaterThanToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'TypeParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
                ]
            }, 
            {
                name: 'constraint',
                type: 'ConstraintSyntax',
                isOptional: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'ConstraintSyntax',
        baseType: 'SyntaxNode',
        children: [
            {
                name: 'extendsKeyword',
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
                    'PublicKeyword', 
                    'PrivateKeyword'
                ]
            }, 
            {
                name: 'staticKeyword',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'propertyName',
                isToken: true,
                tokenKinds: [
                    'IdentifierName', 
                    'StringLiteral', 
                    'NumericLiteral'
                ]
            }, 
            {
                name: 'callSignature',
                type: 'CallSignatureSyntax'
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
                    'PublicKeyword', 
                    'PrivateKeyword'
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
                    'IdentifierName'
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
                    'PublicKeyword', 
                    'PrivateKeyword'
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
                    'IdentifierName'
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
                    'PublicKeyword', 
                    'PrivateKeyword'
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
                elementType: 'SwitchClauseSyntax'
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
                    'IdentifierName'
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
                    'IdentifierName'
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
                    'SemicolonToken'
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
                    'SemicolonToken'
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
                    'IdentifierName'
                ]
            }, 
            {
                name: 'openBraceToken',
                isToken: true
            }, 
            {
                name: 'enumElements',
                isSeparatedList: true,
                elementType: 'IEnumElementSyntax'
            }, 
            {
                name: 'closeBraceToken',
                isToken: true
            }
        ],
        isTypeScriptSpecific: true
    }, 
    {
        name: 'EnumElementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IEnumElementSyntax'
        ],
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
                ],
                isOptional: true
            }, 
            {
                name: 'stringLiteral',
                isToken: true,
                isOptional: true
            }, 
            {
                name: 'colonValueClause',
                type: 'ColonValueClauseSyntax',
                isOptional: true
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
                elementType: 'PropertyAssignmentSyntax'
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
                    'IdentifierName', 
                    'StringLiteral', 
                    'NumericLiteral'
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
                    'IdentifierName'
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
                    'IdentifierName'
                ]
            }, 
            {
                name: 'openParenToken',
                isToken: true
            }, 
            {
                name: 'parameter',
                type: 'ParameterSyntax'
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
                    'IdentifierName'
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
                    'IdentifierName'
                ]
            }, 
            {
                name: 'typeAnnotation',
                type: 'TypeAnnotationSyntax',
                isOptional: true,
                isTypeScriptSpecified: true
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
        name: 'LabeledStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: [
            'IStatementSyntax'
        ],
        children: [
            {
                name: 'identifier',
                isToken: true,
                tokenKinds: [
                    'IdentifierName'
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
    if (TypeScript.StringUtilities.endsWith(definition, "Syntax")) {
        return definition.substring(0, definition.length - "Syntax".length);
    }
    return definition;
}
function getNameWithoutSuffix(definition) {
    return getStringWithoutSuffix(definition.name);
}
function getType(child) {
    if (child.isToken) {
        return "ISyntaxToken";
    } else if (child.isSeparatedList) {
        return "ISeparatedSyntaxList";
    } else if (child.isList) {
        return "ISyntaxList";
    } else {
        return child.type;
    }
}
var hasKind = false;
function pascalCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1);
}
function camelCase(value) {
    return value.substr(0, 1).toLowerCase() + value.substr(1);
}
function getSafeName(child) {
    if (child.name === "arguments") {
        return "_" + child.name;
    }
    return child.name;
}
function getPropertyAccess(child) {
    if (child.type === "SyntaxKind") {
        return "this._kind";
    }
    return "this." + child.name;
}
function generateProperties(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (getType(child) === "SyntaxKind") {
            result += "    private _" + child.name + ": " + getType(child) + ";\r\n";
        }
        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }
    if (definition.children.length > 0) {
        result += "\r\n";
    }
    return result;
}
function generateNullChecks(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (!child.isOptional && !child.isToken) {
            result += "        if (" + child.name + " === null) { throw Errors.argumentNull('" + child.name + "'); }\r\n";
        }
    }
    return result;
}
function generateIfKindCheck(child, tokenKinds, indent) {
    var result = "";
    result += indent + "        if (";
    for(var j = 0; j < tokenKinds.length; j++) {
        if (j > 0) {
            result += " && ";
        }
        var tokenKind = tokenKinds[j];
        if (tokenKind === "IdentifierName") {
            result += "!SyntaxFacts.isIdentifierName(" + child.name + ".tokenKind)";
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
    if (tokenKinds.length > 0) {
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
    if (tokenKinds.length === 0) {
        return "";
    }
    var result = "";
    var identifierName = TypeScript.ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("IdentifierName") >= 0;
    });
    var notIdentifierName = TypeScript.ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("IdentifierName") < 0;
    });
    if (identifierName.length > 0) {
        result += indent + "        if (!SyntaxFacts.isIdentifierName(" + child.name + ".tokenKind)) {\r\n";
        if (notIdentifierName.length === 0) {
            result += indent + "            throw Errors.argument('" + child.name + "');\r\n";
            result += indent + "        }\r\n";
            return result;
        }
        indent += "    ";
    }
    if (notIdentifierName.length <= 2) {
        result += generateIfKindCheck(child, notIdentifierName, indent);
    } else if (notIdentifierName.length > 2) {
        result += indent + "        switch (" + child.name + ".tokenKind) {\r\n";
        result += generateSwitchCases(notIdentifierName, indent);
        result += generateDefaultCase(child, indent);
        result += indent + "        }\r\n";
    }
    if (identifierName.length > 0) {
        result += indent + "    }\r\n";
    }
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
    if (child.isOptional) {
        indent = "    ";
        result += "        if (" + child.name + " !== null) {\r\n";
    }
    var kinds = tokenKinds(child);
    if (kinds.length <= 2) {
        result += generateIfKindCheck(child, kinds, indent);
    } else {
        result += generateSwitchKindCheck(child, kinds, indent);
    }
    if (child.isOptional) {
        result += "        }\r\n";
    }
    return result;
}
function generateKindChecks(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.isToken) {
            result += generateKindCheck(child);
        }
    }
    return result;
}
function generateArgumentChecks(definition) {
    var result = "";
    if (argumentChecks) {
        result += generateNullChecks(definition);
        result += generateKindChecks(definition);
        if (definition.children.length > 0) {
            result += "\r\n";
        }
    }
    return result;
}
function generateConstructor(definition) {
    if (definition.isAbstract) {
    }
    var base = baseType(definition);
    var subchildren = childrenInAllSubclasses(definition);
    var baseSubchildren = childrenInAllSubclasses(base);
    var baseSubchildrenNames = TypeScript.ArrayUtilities.select(baseSubchildren, function (c) {
        return c.name;
    });
    var result = "";
    result += "    constructor(";
    var children = definition.children;
    if (subchildren.length > 0) {
        children = subchildren;
    }
    for(var i = 0; i < children.length; i++) {
        var child = children[i];
        if (getType(child) !== "SyntaxKind" && !TypeScript.ArrayUtilities.contains(baseSubchildrenNames, child.name)) {
            result += "public ";
        }
        result += child.name + ": " + getType(child);
        result += ",\r\n                ";
    }
    result += "parsedInStrictMode: bool) {\r\n";
    result += "        super(";
    for(var i = 0; i < baseSubchildrenNames.length; i++) {
        result += baseSubchildrenNames[i] + ", ";
    }
    result += "parsedInStrictMode); \r\n";
    if (definition.children.length > 0) {
        result += "\r\n";
    }
    result += generateArgumentChecks(definition);
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.type === "SyntaxKind") {
            result += "        " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
        }
    }
    result += "    }\r\n";
    return result;
}
function isOptional(child) {
    if (child.isOptional) {
        return true;
    }
    if (child.isList && !child.requiresAtLeastOneItem) {
        return true;
    }
    if (child.isSeparatedList && !child.requiresAtLeastOneItem) {
        return true;
    }
    return false;
}
function generateFactory1Method(definition) {
    var mandatoryChildren = TypeScript.ArrayUtilities.where(definition.children, function (c) {
        return !isOptional(c);
    });
    if (mandatoryChildren.length === definition.children.length) {
        return "";
    }
    var result = "\r\n    public static create(";
    for(var i = 0; i < mandatoryChildren.length; i++) {
        var child = mandatoryChildren[i];
        result += child.name + ": " + getType(child);
        if (i < mandatoryChildren.length - 1) {
            result += ",\r\n                         ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (!isOptional(child)) {
            result += child.name;
        } else if (child.isList) {
            result += "Syntax.emptyList";
        } else if (child.isSeparatedList) {
            result += "Syntax.emptySeparatedList";
        } else {
            result += "null";
        }
        result += ", ";
    }
    result += "/*parsedInStrictMode:*/ false);\r\n";
    result += "    }\r\n";
    return result;
}
function isKeywordOrPunctuation(kind) {
    if (TypeScript.StringUtilities.endsWith(kind, "Keyword")) {
        return true;
    }
    if (TypeScript.StringUtilities.endsWith(kind, "Token") && kind !== "IdentifierName" && kind !== "EndOfFileToken") {
        return true;
    }
    return false;
}
function isDefaultConstructable(definition) {
    if (definition === null || definition.isAbstract) {
        return false;
    }
    for(var i = 0; i < definition.children.length; i++) {
        if (isMandatory(definition.children[i])) {
            return false;
        }
    }
    return true;
}
function isMandatory(child) {
    if (isOptional(child)) {
        return false;
    }
    if (child.type === "SyntaxKind" || child.isList || child.isSeparatedList) {
        return true;
    }
    if (child.isToken) {
        var kinds = tokenKinds(child);
        var isFixed = kinds.length === 1 && isKeywordOrPunctuation(kinds[0]);
        return !isFixed;
    }
    return !isDefaultConstructable(memberDefinitionType(child));
}
function generateFactory2Method(definition) {
    var mandatoryChildren = TypeScript.ArrayUtilities.where(definition.children, isMandatory);
    if (mandatoryChildren.length === definition.children.length) {
        return "";
    }
    var result = "\r\n    public static create1(";
    for(var i = 0; i < mandatoryChildren.length; i++) {
        var child = mandatoryChildren[i];
        result += child.name + ": " + getType(child);
        if (i < mandatoryChildren.length - 1) {
            result += ",\r\n                          ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (isMandatory(child)) {
            result += child.name;
        } else if (child.isList) {
            result += "Syntax.emptyList";
        } else if (child.isSeparatedList) {
            result += "Syntax.emptySeparatedList";
        } else if (isOptional(child)) {
            result += "null";
        } else if (child.isToken) {
            result += "Syntax.token(SyntaxKind." + tokenKinds(child)[0] + ")";
        } else {
            result += child.type + ".create1()";
        }
        result += ", ";
    }
    result += "/*parsedInStrictMode:*/ false);\r\n";
    result += "    }\r\n";
    return result;
}
function generateFactoryMethod(definition) {
    return generateFactory1Method(definition) + generateFactory2Method(definition);
}
function generateAcceptMethods(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateIsMethod(definition) {
    var result = "";
    if (definition.interfaces) {
        var ifaces = definition.interfaces.slice(0);
        for(var i = 0; i < ifaces.length; i++) {
            var current = ifaces[i];
            while(current !== undefined) {
                if (!TypeScript.ArrayUtilities.contains(ifaces, current)) {
                    ifaces.push(current);
                }
                current = interfaces[current];
            }
        }
        for(var i = 0; i < ifaces.length; i++) {
            var type = ifaces[i];
            type = getStringWithoutSuffix(type);
            if (isInterface(type)) {
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
    if (!definition.isAbstract) {
        if (!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateSlotMethods(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public childCount(): number {\r\n";
        var slotCount = hasKind ? (definition.children.length - 1) : definition.children.length;
        result += "        return " + slotCount + ";\r\n";
        result += "    }\r\n\r\n";
        result += "    public childAt(slot: number): ISyntaxElement {\r\n";
        if (slotCount === 0) {
            result += "        throw Errors.invalidOperation();\r\n";
        } else {
            result += "        switch (slot) {\r\n";
            var index = 0;
            for(var i = 0; i < definition.children.length; i++) {
                var child = definition.children[i];
                if (child.type === "SyntaxKind") {
                    continue;
                }
                result += "            case " + index + ": return this." + definition.children[i].name + ";\r\n";
                index++;
            }
            result += "            default: throw Errors.invalidOperation();\r\n";
            result += "        }\r\n";
        }
        result += "    }\r\n";
    }
    return result;
}
function generateFirstTokenMethod(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public firstToken(): ISyntaxToken {\r\n";
        result += "        var token = null;\r\n";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if (getType(child) === "SyntaxKind") {
                continue;
            }
            if (child.name === "endOfFileToken") {
                continue;
            }
            result += "        if (";
            if (child.isOptional) {
                result += getPropertyAccess(child) + " !== null && ";
            }
            if (child.isToken) {
                result += getPropertyAccess(child) + ".width() > 0";
                result += ") { return " + getPropertyAccess(child) + "; }\r\n";
            } else {
                result += "(token = " + getPropertyAccess(child) + ".firstToken()) !== null";
                result += ") { return token; }\r\n";
            }
        }
        if (definition.name === "SourceUnitSyntax") {
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
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public lastToken(): ISyntaxToken {\r\n";
        if (definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        var token = null;\r\n";
            for(var i = definition.children.length - 1; i >= 0; i--) {
                var child = definition.children[i];
                if (getType(child) === "SyntaxKind") {
                    continue;
                }
                if (child.name === "endOfFileToken") {
                    continue;
                }
                result += "        if (";
                if (child.isOptional) {
                    result += getPropertyAccess(child) + " !== null && ";
                }
                if (child.isToken) {
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
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public insertChildrenInto(array: ISyntaxElement[], index: number) {\r\n";
        for(var i = definition.children.length - 1; i >= 0; i--) {
            var child = definition.children[i];
            if (child.type === "SyntaxKind") {
                continue;
            }
            if (child.isList || child.isSeparatedList) {
                result += "        " + getPropertyAccess(child) + ".insertChildrenInto(array, index);\r\n";
            } else if (child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { array.splice(index, 0, " + getPropertyAccess(child) + "); }\r\n";
            } else {
                result += "        array.splice(index, 0, " + getPropertyAccess(child) + ");\r\n";
            }
        }
        result += "    }\r\n";
    }
    return result;
}
function baseType(definition) {
    return TypeScript.ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === definition.baseType;
    });
}
function memberDefinitionType(child) {
    return TypeScript.ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === child.type;
    });
}
function derivesFrom(def1, def2) {
    var current = def1;
    while(current !== null) {
        var base = baseType(current);
        if (base === def2) {
            return true;
        }
        current = base;
    }
    return false;
}
function contains(definition, child) {
    return TypeScript.ArrayUtilities.any(definition.children, function (c) {
        return c.name === child.name && c.isList === child.isList && c.isSeparatedList === child.isSeparatedList && c.isToken === child.isToken && c.type === child.type;
    });
}
function childrenInAllSubclasses(definition) {
    var result = [];
    if (definition !== null && definition.isAbstract) {
        var subclasses = TypeScript.ArrayUtilities.where(definitions, function (d) {
            return !d.isAbstract && derivesFrom(d, definition);
        });
        if (subclasses.length > 0) {
            var firstSubclass = subclasses[0];
            for(var i = 0; i < firstSubclass.children.length; i++) {
                var child = firstSubclass.children[i];
                if (TypeScript.ArrayUtilities.all(subclasses, function (s) {
                    return contains(s, child);
                })) {
                    result.push(child);
                }
            }
        }
    }
    return result;
}
function generateAccessors(definition) {
    var result = "";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.type === "SyntaxKind") {
            result += "\r\n";
            result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
            result += "        return " + getPropertyAccess(child) + ";\r\n";
            result += "    }\r\n";
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
        if (i > 0) {
            result += ", ";
        }
        if (definition.children[i] === child) {
            result += getSafeName(child);
        } else {
            result += getPropertyAccess(definition.children[i]);
        }
    }
    result += ");\r\n";
    result += "    }\r\n";
    if (child.isList || child.isSeparatedList) {
        if (TypeScript.StringUtilities.endsWith(child.name, "s")) {
            var pascalName = pascalCase(child.name);
            pascalName = pascalName.substring(0, pascalName.length - 1);
            var argName = getSafeName(child);
            argName = argName.substring(0, argName.length - 1);
            result += "\r\n";
            result += "    public with" + pascalName + "(" + argName + ": " + child.elementType + "): " + definition.name + " {\r\n";
            result += "        return this.with" + pascalCase(child.name) + "(";
            if (child.isList) {
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
    if (definition.isAbstract) {
        return "";
    }
    var result = "";
    result += "\r\n";
    result += "    public ";
    result += "update(";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += getSafeName(child) + ": " + getType(child);
        if (i < definition.children.length - 1) {
            result += ",\r\n                  ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    if (definition.children.length === 0) {
        result += "        return this;\r\n";
    } else {
        result += "        if (";
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if (i !== 0) {
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
            result += getSafeName(child);
            result += ", ";
        }
        result += "/*parsedInStrictMode:*/ this.parsedInStrictMode());\r\n";
    }
    result += "    }\r\n";
    return result;
}
function generateIsTypeScriptSpecificMethod(definition) {
    var result = "\r\n    public isTypeScriptSpecific(): bool {\r\n";
    if (definition.isTypeScriptSpecific) {
        result += "        return true;\r\n";
    } else {
        for(var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if (child.type === "SyntaxKind") {
                continue;
            }
            if (child.isTypeScriptSpecific) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { return true; }\r\n";
                continue;
            }
            if (child.isToken) {
                continue;
            }
            if (child.isOptional) {
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
    return TypeScript.ArrayUtilities.contains(kinds, "SlashToken") || TypeScript.ArrayUtilities.contains(kinds, "SlashEqualsToken") || TypeScript.ArrayUtilities.contains(kinds, "RegularExpressionLiteral");
}
function generateComputeDataMethod(definition) {
    if (definition.isAbstract) {
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
        if (child.type === "SyntaxKind") {
            continue;
        }
        var indent = "";
        if (child.isOptional) {
            result += "\r\n        if (" + getPropertyAccess(child) + " !== null) {\r\n";
            indent = "    ";
        } else {
            result += "\r\n";
        }
        result += indent + "        childWidth = " + getPropertyAccess(child) + ".fullWidth();\r\n";
        result += indent + "        fullWidth += childWidth;\r\n";
        result += indent + "        hasSkippedText = hasSkippedText || " + getPropertyAccess(child) + ".hasSkippedText();\r\n";
        if (child.isToken) {
            result += indent + "        hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);\r\n";
            if (couldBeRegularExpressionToken(child)) {
                result += indent + "        hasRegularExpressionToken = hasRegularExpressionToken || SyntaxFacts.isAnyDivideOrRegularExpressionToken(" + getPropertyAccess(child) + ".tokenKind);\r\n";
            }
        } else {
            result += indent + "        hasZeroWidthToken = hasZeroWidthToken || " + getPropertyAccess(child) + ".hasZeroWidthToken();\r\n";
            result += indent + "        hasRegularExpressionToken = hasRegularExpressionToken || " + getPropertyAccess(child) + ".hasRegularExpressionToken();\r\n";
        }
        if (child.isOptional) {
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
    if (definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private structuralEquals(node: SyntaxNode): bool {\r\n";
    result += "        if (this === node) { return true; }\r\n";
    result += "        if (node === null) { return false; }\r\n";
    result += "        if (this.kind() !== node.kind()) { return false; }\r\n";
    result += "        var other = <" + definition.name + ">node;\r\n";
    for(var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.type !== "SyntaxKind") {
            if (child.isList) {
                result += "        if (!Syntax.listStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (child.isSeparatedList) {
                result += "        if (!Syntax.separatedListStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (child.isToken) {
                result += "        if (!Syntax.tokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (isNodeOrToken(child)) {
                result += "        if (!Syntax.nodeOrTokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else {
                result += "        if (!Syntax.nodeStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            }
        }
    }
    result += "        return true;\r\n";
    result += "    }\r\n";
    return result;
}
function generateNode(definition) {
    var result = "    export class " + definition.name + " extends " + definition.baseType;
    if (definition.interfaces) {
        result += " implements " + definition.interfaces.join(", ");
    }
    result += " {\r\n";
    hasKind = false;
    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateSlotMethods(definition);
    result += generateIsMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);
    if (!forPrettyPrinter) {
        result += generateFactoryMethod(definition);
        result += generateTriviaMethods(definition);
        result += generateWithMethods(definition);
        result += generateIsTypeScriptSpecificMethod(definition);
    }
    result += "    }";
    return result;
}
function generateNodes() {
    var result = "///<reference path='SyntaxNode.ts' />\r\n";
    result += "///<reference path='ISyntaxList.ts' />\r\n";
    result += "///<reference path='ISeparatedSyntaxList.ts' />\r\n";
    result += "///<reference path='SeparatedSyntaxList.ts' />\r\n";
    result += "///<reference path='SyntaxList.ts' />\r\n";
    result += "///<reference path='SyntaxToken.ts' />\r\n";
    result += "///<reference path='Syntax.ts' />\r\n\r\n";
    result += "module TypeScript {\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (i > 0) {
            result += "\r\n\r\n";
        }
        result += generateNode(definition);
    }
    result += "\r\n}";
    return result;
}
function isInterface(name) {
    return name.substr(0, 1) === "I" && name.substr(1, 1).toUpperCase() === name.substr(1, 1);
}
function isNodeOrToken(child) {
    return child.type && isInterface(child.type);
}
function generateRewriter() {
    var result = "///<reference path='SyntaxVisitor.generated.ts' />\r\n";
    result = "";
    result += "///<reference path='ISyntaxNodeOrToken.ts' />\r\n";
    result += "\r\nmodule TypeScript {\r\n" + "    export class SyntaxRewriter implements ISyntaxVisitor {\r\n" + "        public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" + "            return token;\r\n" + "        }\r\n" + "\r\n" + "        public visitNode(node: SyntaxNode): SyntaxNode {\r\n" + "            return node.accept(this);\r\n" + "        }\r\n" + "\r\n" + "        public visitNodeOrToken(node: ISyntaxNodeOrToken): ISyntaxNodeOrToken {\r\n" + "            return node.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>node) : this.visitNode(<SyntaxNode>node);\r\n" + "        }\r\n" + "\r\n" + "        public visitList(list: ISyntaxList): ISyntaxList {\r\n" + "            var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                var newItem = this.visitNodeOrToken(item);\r\n" + "\r\n" + "                if (item !== newItem && newItems === null) {\r\n" + "                    newItems = [];\r\n" + "                    for (var j = 0; j < i; j++) {\r\n" + "                        newItems.push(list.childAt(j));\r\n" + "                    }\r\n" + "                }\r\n" + "\r\n" + "                if (newItems) {\r\n" + "                    newItems.push(newItem);\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            // Debug.assert(newItems === null || newItems.length === list.childCount());\r\n" + "            return newItems === null ? list : Syntax.list(newItems);\r\n" + "        }\r\n" + "\r\n" + "        public visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" + "            var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                var newItem = item.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" + "\r\n" + "                if (item !== newItem && newItems === null) {\r\n" + "                    newItems = [];\r\n" + "                    for (var j = 0; j < i; j++) {\r\n" + "                        newItems.push(list.childAt(j));\r\n" + "                    }\r\n" + "                }\r\n" + "\r\n" + "                if (newItems) {\r\n" + "                    newItems.push(newItem);\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            // Debug.assert(newItems === null || newItems.length === list.childCount());\r\n" + "            return newItems === null ? list : Syntax.separatedList(newItems);\r\n" + "        }\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
        if (definition.children.length === 0) {
            result += "            return node;\r\n";
            result += "        }\r\n";
            continue;
        }
        result += "            return node.update(\r\n";
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            result += "                ";
            if (child.isOptional) {
                result += "node." + child.name + " === null ? null : ";
            }
            if (child.isToken) {
                result += "this.visitToken(node." + child.name + ")";
            } else if (child.isList) {
                result += "this.visitList(node." + child.name + ")";
            } else if (child.isSeparatedList) {
                result += "this.visitSeparatedList(node." + child.name + ")";
            } else if (child.type === "SyntaxKind") {
                result += "node.kind()";
            } else if (isNodeOrToken(child)) {
                result += "<" + child.type + ">this.visitNodeOrToken(node." + child.name + ")";
            } else {
                result += "<" + child.type + ">this.visitNode(node." + child.name + ")";
            }
            if (j < definition.children.length - 1) {
                result += ",\r\n";
            }
        }
        result += ");\r\n";
        result += "        }\r\n";
    }
    result += "    }";
    result += "\r\n}";
    return result;
}
function generateToken(isFixedWidth, leading, trailing) {
    var isVariableWidth = !isFixedWidth;
    var hasAnyTrivia = leading || trailing;
    var result = "    export class ";
    var needsSourcetext = hasAnyTrivia || isVariableWidth;
    var className = isFixedWidth ? "FixedWidthToken" : "VariableWidthToken";
    className += leading && trailing ? "WithLeadingAndTrailingTrivia" : leading && !trailing ? "WithLeadingTrivia" : !leading && trailing ? "WithTrailingTrivia" : "WithNoTrivia";
    result += className;
    result += " implements ISyntaxToken {\r\n";
    if (needsSourcetext) {
        result += "        private _sourceText: ISimpleText;\r\n";
        result += "        private _fullStart: number;\r\n";
    }
    result += "        public tokenKind: SyntaxKind;\r\n";
    if (leading) {
        result += "        private _leadingTriviaInfo: number;\r\n";
    }
    if (isVariableWidth) {
        result += "        private _textOrWidth: any;\r\n";
        result += "        private _value: any = null;\r\n";
    }
    if (trailing) {
        result += "        private _trailingTriviaInfo: number;\r\n";
    }
    result += "\r\n";
    if (needsSourcetext) {
        result += "        constructor(sourceText: ISimpleText, fullStart: number,";
    } else {
        result += "        constructor(";
    }
    result += "kind: SyntaxKind";
    if (leading) {
        result += ", leadingTriviaInfo: number";
    }
    if (isVariableWidth) {
        result += ", textOrWidth: any";
    }
    if (trailing) {
        result += ", trailingTriviaInfo: number";
    }
    result += ") {\r\n";
    if (needsSourcetext) {
        result += "            this._sourceText = sourceText;\r\n";
        result += "            this._fullStart = fullStart;\r\n";
    }
    result += "            this.tokenKind = kind;\r\n";
    if (leading) {
        result += "            this._leadingTriviaInfo = leadingTriviaInfo;\r\n";
    }
    if (isVariableWidth) {
        result += "            this._textOrWidth = textOrWidth;\r\n";
    }
    if (trailing) {
        result += "            this._trailingTriviaInfo = trailingTriviaInfo;\r\n";
    }
    result += "        }\r\n\r\n";
    result += "        public clone(): ISyntaxToken {\r\n";
    result += "            return new " + className + "(\r\n";
    if (needsSourcetext) {
        result += "                this._sourceText,\r\n";
        result += "                this._fullStart,\r\n";
    }
    result += "                this.tokenKind";
    if (leading) {
        result += ",\r\n                this._leadingTriviaInfo";
    }
    if (isVariableWidth) {
        result += ",\r\n                this._textOrWidth";
    }
    if (trailing) {
        result += ",\r\n                this._trailingTriviaInfo";
    }
    result += ");\r\n";
    result += "        }\r\n\r\n";
    result += "        public isNode(): bool { return false; }\r\n" + "        public isToken(): bool { return true; }\r\n" + "        public isList(): bool { return false; }\r\n" + "        public isSeparatedList(): bool { return false; }\r\n\r\n";
    result += "        public kind(): SyntaxKind { return this.tokenKind; }\r\n\r\n";
    result += "        public childCount(): number { return 0; }\r\n";
    result += "        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }\r\n\r\n";
    var leadingTriviaWidth = leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0";
    var trailingTriviaWidth = trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0";
    if (leading && trailing) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else if (leading) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width(); }\r\n";
    } else if (trailing) {
        result += "        public fullWidth(): number { return this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else {
        result += "        public fullWidth(): number { return this.width(); }\r\n";
    }
    if (needsSourcetext) {
        if (leading) {
            result += "        private start(): number { return this._fullStart + " + leadingTriviaWidth + "; }\r\n";
        } else {
            result += "        private start(): number { return this._fullStart; }\r\n";
        }
        result += "        private end(): number { return this.start() + this.width(); }\r\n\r\n";
    }
    if (isFixedWidth) {
        result += "        public width(): number { return this.text().length; }\r\n";
    } else {
        result += "        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }\r\n";
    }
    if (isFixedWidth) {
        result += "        public text(): string { return SyntaxFacts.getText(this.tokenKind); }\r\n";
    } else {
        result += "\r\n";
        result += "        public text(): string {\r\n";
        result += "            if (typeof this._textOrWidth === 'number') {\r\n";
        result += "                this._textOrWidth = this._sourceText.substr(\r\n";
        result += "                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);\r\n";
        result += "            }\r\n";
        result += "\r\n";
        result += "            return this._textOrWidth;\r\n";
        result += "        }\r\n\r\n";
    }
    if (needsSourcetext) {
        result += "        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }\r\n\r\n";
    } else {
        result += "        public fullText(): string { return this.text(); }\r\n\r\n";
    }
    if (isFixedWidth) {
        result += "        public value(): any { return null; }\r\n";
    } else {
        result += "        public value(): any { return this._value || (this._value = value(this)); }\r\n";
    }
    result += "        public hasLeadingTrivia(): bool { return " + (leading ? "true" : "false") + "; }\r\n";
    result += "        public hasLeadingComment(): bool { return " + (leading ? "hasTriviaComment(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingNewLine(): bool { return " + (leading ? "hasTriviaNewLine(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingSkippedText(): bool { return false; }\r\n";
    result += "        public leadingTriviaWidth(): number { return " + (leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public leadingTrivia(): ISyntaxTriviaList { return " + (leading ? "Scanner1.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasTrailingTrivia(): bool { return " + (trailing ? "true" : "false") + "; }\r\n";
    result += "        public hasTrailingComment(): bool { return " + (trailing ? "hasTriviaComment(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingNewLine(): bool { return " + (trailing ? "hasTriviaNewLine(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingSkippedText(): bool { return false; }\r\n";
    result += "        public trailingTriviaWidth(): number { return " + (trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public trailingTrivia(): ISyntaxTriviaList { return " + (trailing ? "Scanner1.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasSkippedText(): bool { return false; }\r\n";
    result += "        public toJSON(key) { return tokenToJSON(this); }\r\n" + "        public firstToken(): ISyntaxToken { return this; }\r\n" + "        public lastToken(): ISyntaxToken { return this; }\r\n" + "        public isTypeScriptSpecific(): bool { return false; }\r\n" + "        public hasZeroWidthToken(): bool { return this.fullWidth() === 0; }\r\n" + "        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }\r\n" + "        public hasRegularExpressionToken(): bool { return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }\r\n" + "        private realize(): ISyntaxToken { return realizeToken(this); }\r\n" + "        private collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }\r\n\r\n";
    result += "        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {\r\n" + "            return new PositionedToken(parent, this, fullStart);\r\n" + "        }\r\n\r\n";
    result += "        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withLeadingTrivia(leadingTrivia);\r\n" + "        }\r\n" + "\r\n" + "        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withTrailingTrivia(trailingTrivia);\r\n" + "        }\r\n";
    result += "    }\r\n";
    return result;
}
function generateTokens() {
    var result = "///<reference path='ISyntaxToken.ts' />\r\n" + "///<reference path='..\\Text\\IText.ts' />\r\n" + "///<reference path='SyntaxToken.ts' />\r\n" + "\r\n" + "module TypeScript.Syntax {\r\n";
    result += generateToken(false, false, false);
    result += "\r\n";
    result += generateToken(false, true, false);
    result += "\r\n";
    result += generateToken(false, false, true);
    result += "\r\n";
    result += generateToken(false, true, true);
    result += "\r\n";
    result += generateToken(true, false, false);
    result += "\r\n";
    result += generateToken(true, true, false);
    result += "\r\n";
    result += generateToken(true, false, true);
    result += "\r\n";
    result += generateToken(true, true, true);
    result += "\r\n";
    result += "    function collectTokenTextElements(token: ISyntaxToken, elements: string[]): void {\r\n" + "        token.leadingTrivia().collectTextElements(elements);\r\n" + "        elements.push(token.text());\r\n" + "        token.trailingTrivia().collectTextElements(elements);\r\n" + "    }\r\n" + "\r\n" + "    export function fixedWidthToken(sourceText: ISimpleText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new FixedWidthTokenWithNoTrivia(kind);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    export function variableWidthToken(sourceText: ISimpleText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, width);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, width, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n\r\n";
    result += "    function getTriviaWidth(value: number): number {\r\n" + "        return value >>> SyntaxConstants.TriviaFullWidthShift;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaComment(value: number): bool {\r\n" + "        return (value & SyntaxConstants.TriviaCommentMask) !== 0;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaNewLine(value: number): bool {\r\n" + "        return (value & SyntaxConstants.TriviaNewLineMask) !== 0;\r\n" + "    }\r\n";
    result += "}";
    return result;
}
function generateWalker() {
    var result = "";
    result += "///<reference path='SyntaxVisitor.generated.ts' />\r\n" + "\r\n" + "module TypeScript {\r\n" + "    export class SyntaxWalker implements ISyntaxVisitor {\r\n" + "        public visitToken(token: ISyntaxToken): void {\r\n" + "        }\r\n" + "\r\n" + "        public visitNode(node: SyntaxNode): void {\r\n" + "            node.accept(this);\r\n" + "        }\r\n" + "\r\n" + "        public visitNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "            if (nodeOrToken.isToken()) { \r\n" + "                this.visitToken(<ISyntaxToken>nodeOrToken);\r\n" + "            }\r\n" + "            else {\r\n" + "                this.visitNode(<SyntaxNode>nodeOrToken);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        private visitOptionalToken(token: ISyntaxToken): void {\r\n" + "            if (token === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitToken(token);\r\n" + "        }\r\n" + "\r\n" + "        public visitOptionalNode(node: SyntaxNode): void {\r\n" + "            if (node === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitNode(node);\r\n" + "        }\r\n" + "\r\n" + "        public visitOptionalNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "            if (nodeOrToken === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitNodeOrToken(nodeOrToken);\r\n" + "        }\r\n" + "\r\n" + "        public visitList(list: ISyntaxList): void {\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "               this.visitNodeOrToken(list.childAt(i));\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        public visitSeparatedList(list: ISeparatedSyntaxList): void {\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                this.visitNodeOrToken(item);\r\n" + "            }\r\n" + "        }\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): void {\r\n";
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            if (child.isToken) {
                if (child.isOptional) {
                    result += "            this.visitOptionalToken(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitToken(node." + child.name + ");\r\n";
                }
            } else if (child.isList) {
                result += "            this.visitList(node." + child.name + ");\r\n";
            } else if (child.isSeparatedList) {
                result += "            this.visitSeparatedList(node." + child.name + ");\r\n";
            } else if (isNodeOrToken(child)) {
                if (child.isOptional) {
                    result += "            this.visitOptionalNodeOrToken(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitNodeOrToken(node." + child.name + ");\r\n";
                }
            } else if (child.type !== "SyntaxKind") {
                if (child.isOptional) {
                    result += "            this.visitOptionalNode(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitNode(node." + child.name + ");\r\n";
                }
            }
        }
        result += "        }\r\n";
    }
    result += "    }";
    result += "\r\n}";
    return result;
}
function generateKeywordCondition(keywords, currentCharacter, indent) {
    var length = keywords[0].text.length;
    var result = "";
    if (keywords.length === 1) {
        var keyword = keywords[0];
        if (currentCharacter === length) {
            return indent + "return SyntaxKind." + (TypeScript.SyntaxKind)._map[keyword.kind] + ";\r\n";
        }
        var keywordText = keywords[0].text;
        var result = indent + "return (";
        for(var i = currentCharacter; i < length; i++) {
            if (i > currentCharacter) {
                result += " && ";
            }
            var index = i === 0 ? "startIndex" : ("startIndex + " + i);
            result += "array[" + index + "] === CharacterCodes." + keywordText.substr(i, 1);
        }
        result += ") ? SyntaxKind." + (TypeScript.SyntaxKind)._map[keyword.kind] + " : SyntaxKind.IdentifierName;\r\n";
    } else {
        var index = currentCharacter === 0 ? "startIndex" : ("startIndex + " + currentCharacter);
        result += indent + "switch(array[" + index + "]) {\r\n";
        var groupedKeywords = TypeScript.ArrayUtilities.groupBy(keywords, function (k) {
            return k.text.substr(currentCharacter, 1);
        });
        for(var c in groupedKeywords) {
            if (groupedKeywords.hasOwnProperty(c)) {
                result += indent + "case CharacterCodes." + c + ":\r\n";
                result += indent + "    // " + TypeScript.ArrayUtilities.select(groupedKeywords[c], function (k) {
                    return k.text;
                }).join(", ") + "\r\n";
                result += generateKeywordCondition(groupedKeywords[c], currentCharacter + 1, indent + "    ");
            }
        }
        result += indent + "default:\r\n";
        result += indent + "    return SyntaxKind.IdentifierName;\r\n";
        result += indent + "}\r\n\r\n";
    }
    return result;
}
function generateScannerUtilities() {
    var result = "///<reference path='..\\Text\\CharacterCodes.ts' />\r\n" + "///<reference path='SyntaxKind.ts' />\r\n" + "\r\n" + "module TypeScript {\r\n" + "    export class ScannerUtilities {\r\n";
    var keywords = [];
    for(var i = 15 /* FirstKeyword */ ; i <= 69 /* LastKeyword */ ; i++) {
        keywords.push({
            kind: i,
            text: TypeScript.SyntaxFacts.getText(i)
        });
    }
    result += "        public static identifierKind(array: number[], startIndex: number, length: number): SyntaxKind {\r\n";
    var minTokenLength = TypeScript.ArrayUtilities.min(keywords, function (k) {
        return k.text.length;
    });
    var maxTokenLength = TypeScript.ArrayUtilities.max(keywords, function (k) {
        return k.text.length;
    });
    result += "            switch (length) {\r\n";
    for(var i = minTokenLength; i <= maxTokenLength; i++) {
        var keywordsOfLengthI = TypeScript.ArrayUtilities.where(keywords, function (k) {
            return k.text.length === i;
        });
        if (keywordsOfLengthI.length > 0) {
            result += "            case " + i + ":\r\n";
            result += "                // " + TypeScript.ArrayUtilities.select(keywordsOfLengthI, function (k) {
                return k.text;
            }).join(", ") + "\r\n";
            result += generateKeywordCondition(keywordsOfLengthI, 0, "            ");
        }
    }
    result += "            default:\r\n";
    result += "                return SyntaxKind.IdentifierName;\r\n";
    result += "            }\r\n";
    result += "        }\r\n";
    result += "    }\r\n";
    result += "}";
    return result;
}
function generateVisitor() {
    var result = "";
    result += "///<reference path='SyntaxNodes.generated.ts' />\r\n\r\n";
    result += "module TypeScript {\r\n";
    result += "    export interface ISyntaxVisitor {\r\n";
    result += "        visitToken(token: ISyntaxToken): any;\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (!definition.isAbstract) {
            result += "        visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any;\r\n";
        }
    }
    result += "    }\r\n\r\n";
    if (!forPrettyPrinter) {
        result += "    export class SyntaxVisitor implements ISyntaxVisitor {\r\n";
        result += "        public defaultVisit(node: ISyntaxNodeOrToken): any {\r\n";
        result += "            return null;\r\n";
        result += "        }\r\n";
        result += "\r\n";
        result += "        private visitToken(token: ISyntaxToken): any {\r\n";
        result += "            return this.defaultVisit(token);\r\n";
        result += "        }\r\n";
        for(var i = 0; i < definitions.length; i++) {
            var definition = definitions[i];
            if (!definition.isAbstract) {
                result += "\r\n        private visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
                result += "            return this.defaultVisit(node);\r\n";
                result += "        }\r\n";
            }
        }
        result += "    }";
    }
    result += "\r\n}";
    return result;
}
function generateFactory() {
    var result = "///<reference path='ISyntaxList.ts' />\r\n";
    result += "\r\nmodule TypeScript.Syntax {\r\n";
    result += "    export interface IFactory {\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";
        for(var j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }
            var child = definition.children[j];
            result += child.name + ": " + getType(child);
        }
        result += "): " + definition.name + ";\r\n";
    }
    result += "    }\r\n\r\n";
    result += "    class NormalModeFactory implements IFactory {\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";
        for(var j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }
            var child = definition.children[j];
            result += getSafeName(child) + ": " + getType(child);
        }
        result += "): " + definition.name + " {\r\n";
        result += "            return new " + definition.name + "(";
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            result += getSafeName(child);
            result += ", ";
        }
        result += "/*parsedInStrictMode:*/ false);\r\n";
        result += "        }\r\n";
    }
    result += "    }\r\n\r\n";
    result += "    class StrictModeFactory implements IFactory {\r\n";
    for(var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";
        for(var j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }
            var child = definition.children[j];
            result += getSafeName(child) + ": " + getType(child);
        }
        result += "): " + definition.name + " {\r\n";
        result += "            return new " + definition.name + "(";
        for(var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            result += getSafeName(child);
            result += ", ";
        }
        result += "/*parsedInStrictMode:*/ true);\r\n";
        result += "        }\r\n";
    }
    result += "    }\r\n\r\n";
    result += "    export var normalModeFactory: IFactory = new NormalModeFactory();\r\n";
    result += "    export var strictModeFactory: IFactory = new StrictModeFactory();\r\n";
    result += "}";
    return result;
}
var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
var tokens = generateTokens();
var walker = generateWalker();
var scannerUtilities = generateScannerUtilities();
var visitor = generateVisitor();
var factory = generateFactory();
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\SyntaxNodes.generated.ts", syntaxNodes, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\SyntaxRewriter.generated.ts", rewriter, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\SyntaxToken.generated.ts", tokens, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\SyntaxWalker.generated.ts", walker, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\ScannerUtilities.generated.ts", scannerUtilities, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\SyntaxVisitor.generated.ts", visitor, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\Syntax\\SyntaxFactory.generated.ts", factory, true);
