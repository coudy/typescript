
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
    var result = "    class ";
    var className = isKeyword ? "Keyword" : isPunctuation ? "FixedWidthToken" : "VariableWidthToken";
    className += leading && trailing ? "WithLeadingAndTrailingTrivia" : leading && !trailing ? "WithLeadingTrivia" : !leading && trailing ? "WithTrailingTrivia" : "WithNoTrivia";
    result += className;
    result += " implements ISyntaxToken {\r\n";
    result += "        private _sourceText: IText;\r\n";
    result += "        public tokenKind: SyntaxKind;\r\n";
    if(isKeyword) {
        result += "        private _keywordKind: SyntaxKind;\r\n";
    }
    result += "        private _fullStart: number;\r\n";
    if(leading) {
        result += "        private _leadingTriviaInfo: number;\r\n";
    }
    if(!isFixedWidth) {
        result += "        private _text: string;\r\n";
        result += "        private _value: any;\r\n";
    }
    if(trailing) {
        result += "        private _trailingTriviaInfo: number;\r\n";
    }
    result += "\r\n";
    result += "        constructor(sourceText: IText";
    if(isKeyword) {
        result += ", keywordKind: SyntaxKind";
    } else {
        result += ", kind: SyntaxKind";
    }
    result += ", fullStart: number";
    if(leading) {
        result += ", leadingTriviaInfo: number";
    }
    if(!isFixedWidth) {
        result += ", text: string, value: any";
    }
    if(trailing) {
        result += ", trailingTriviaInfo: number";
    }
    result += ") {\r\n";
    result += "            this._sourceText = sourceText;\r\n";
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
    if(!isFixedWidth) {
        result += "            this._text = text;\r\n";
        result += "            this._value = value;\r\n";
    }
    if(trailing) {
        result += "            this._trailingTriviaInfo = trailingTriviaInfo;\r\n";
    }
    result += "        }\r\n\r\n";
    result += "        public clone(): ISyntaxToken {\r\n";
    result += "            return new " + className + "(\r\n";
    result += "                this._sourceText,\r\n";
    if(isKeyword) {
        result += "                this._keywordKind,\r\n";
    } else {
        result += "                this.tokenKind,\r\n";
    }
    result += "                this._fullStart";
    if(leading) {
        result += ",\r\n                this._leadingTriviaInfo";
    }
    if(!isFixedWidth) {
        result += ",\r\n                this._text";
        result += ",\r\n                this._value";
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
    result += "        public width(): number { return this.text().length; }\r\n";
    result += "        private end(): number { return this.start() + this.width(); }\r\n\r\n";
    if(isPunctuation) {
        result += "        public text(): string { return SyntaxFacts.getText(this.tokenKind); }\r\n";
    } else {
        if(isKeyword) {
            result += "        public text(): string { return SyntaxFacts.getText(this._keywordKind); }\r\n";
        } else {
            result += "        public text(): string { return this._text; }\r\n";
        }
    }
    result += "        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }\r\n\r\n";
    if(isFixedWidth) {
        result += "        public value(): any { return null; }\r\n";
        result += "        public valueText(): string { return null; }\r\n\r\n";
    } else {
        result += "        public value(): any { return value(this, this._value); }\r\n";
        result += "        public valueText(): string { return valueText(this); }\r\n\r\n";
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
    result += "    function createFixedWidthToken(sourceText: IText, fullStart: number,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new FixedWidthTokenWithNoTrivia(sourceText, kind, fullStart);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new FixedWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new FixedWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    function createVariableWidthToken(sourceText: IText, fullStart: number,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        tokenInfo: ScannerTokenInfo,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        var kind = tokenInfo.Kind;\r\n" + "        // var text = tokenInfo.Text === null ? SyntaxFacts.getText(kind) : tokenInfo.Text;\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new VariableWidthTokenWithNoTrivia(sourceText, kind, fullStart, tokenInfo.Text, tokenInfo.Value);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new VariableWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, tokenInfo.Text, tokenInfo.Value, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new VariableWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, tokenInfo.Text, tokenInfo.Value);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, tokenInfo.Text, tokenInfo.Value, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    function createKeyword(sourceText: IText, fullStart: number,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        keywordKind: SyntaxKind,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new KeywordWithNoTrivia(sourceText, keywordKind, fullStart);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new KeywordWithTrailingTrivia(sourceText, keywordKind, fullStart, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new KeywordWithLeadingTrivia(sourceText, keywordKind, fullStart, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new KeywordWithLeadingAndTrailingTrivia(sourceText, keywordKind, fullStart, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    export function create(text: IText, fullStart: number,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        tokenInfo: ScannerTokenInfo,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "        if (SyntaxFacts.isAnyPunctuation(tokenInfo.Kind)) {\r\n" + "            return createFixedWidthToken(text, fullStart, leadingTriviaInfo, tokenInfo.Kind, trailingTriviaInfo);\r\n" + "        }\r\n" + "        else if (SyntaxFacts.isAnyKeyword(tokenInfo.KeywordKind)) {\r\n" + "            return createKeyword(text, fullStart, leadingTriviaInfo, tokenInfo.KeywordKind, trailingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return createVariableWidthToken(text, fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n\r\n";
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
var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
var tokens = generateTokens();
var walker = generateWalker();
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxNodes.ts", syntaxNodes, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxRewriter.ts", rewriter, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxToken.generated.ts", tokens, true);
Environment.writeFile("C:\\fidelity\\src\\prototype\\SyntaxWalker.ts", walker, true);
