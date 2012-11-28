///<reference path='References.ts' />

declare class Enumerator {
    public atEnd(): bool;
    public moveNext();
    public item(): any;
    constructor (o: any);
}

var Environment = (function () {

    // Create an IO object for use inside WindowsScriptHost hosts
    // Depends on WSCript and FileSystemObject
    function getWindowsScriptHostEnvironment(): IEnvironment {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var streamObjectPool = [];

        function getStreamObject(): any {
            if (streamObjectPool.length > 0) {
                return streamObjectPool.pop();
            } else {
                return new ActiveXObject("ADODB.Stream");
            }
        }

        function releaseStreamObject(obj: any) {
            streamObjectPool.push(obj);
        }

        var args = [];
        for (var i = 0; i < WScript.Arguments.length; i++) {
            args[i] = WScript.Arguments.Item(i);
        }

        return {
            readFile: function (path) {
                try {
                    var streamObj = getStreamObject();
                    streamObj.Open();
                    streamObj.Type = 2; // Text data
                    streamObj.Charset = 'x-ansi'; // Assume we are reading ansi text
                    streamObj.LoadFromFile(path);
                    var bomChar = streamObj.ReadText(2); // Read the BOM char
                    streamObj.Position = 0; // Position has to be at 0 before changing the encoding
                    if ((bomChar.charCodeAt(0) === 0xFE && bomChar.charCodeAt(1) === 0xFF)
                        || (bomChar.charCodeAt(0) === 0xFF && bomChar.charCodeAt(1) === 0xFE)) {
                        streamObj.Charset = 'unicode';
                    } else if (bomChar.charCodeAt(0) === 0xEF && bomChar.charCodeAt(1) === 0xBB) {
                        streamObj.Charset = 'utf-8';
                    }

                // Read the whole file
                    var str = streamObj.ReadText(-1 /* read from the current position to EOS */);
                    streamObj.Close();
                    releaseStreamObject(streamObj);
                    return <string>str;
                }
                catch (err) {
                    throw new Error("Error reading file \"" + path + "\": " + err.message);
                }
            },

            writeFile: function (path, contents) {
                var file = this.createFile(path);
                file.Write(contents);
                file.Close();
            },

            fileExists: function (path: string): bool {
                return fso.FileExists(path);
            },

            deleteFile: function (path: string): void {
                if (fso.FileExists(path)) {
                    fso.DeleteFile(path, true); // true: delete read-only files
                }
            },

            directoryExists: function (path) {
                return <bool>fso.FolderExists(path);
            },

            listFiles: function(path, spec?, options?) {
                options = options || <{ recursive?: bool; }>{};
                function filesInFolder(folder, root): string[]{
                    var paths = [];
                    var fc: Enumerator;

                    if (options.recursive) {
                        fc = new Enumerator(folder.subfolders);

                        for (; !fc.atEnd() ; fc.moveNext()) {
                            paths = paths.concat(filesInFolder(fc.item(), root + "\\" + fc.item().Name));
                        }
                    }

                    fc = new Enumerator(folder.files);

                    for (; !fc.atEnd() ; fc.moveNext()) {
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
            
            createFile: function (path, useUTF8?) {
                try {
                    var streamObj = getStreamObject();
                    streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
                    streamObj.Open();
                    return {
                        Write: function (str) { streamObj.WriteText(str, 0); },
                        WriteLine: function (str) { streamObj.WriteText(str, 1); },
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

            arguments: <string[]>args,

            standardOut: WScript.StdOut,
        }
    };

    if (typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    }
    else {
        return null; // Unsupported host
    }
})();
