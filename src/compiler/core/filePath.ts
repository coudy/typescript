module TypeScript {
    export class FilePath {
        public normalizedPath: string;

        constructor(public hostPath: string) {
            this.normalizedPath = switchToForwardSlashes(hostPath);
        }

        public compareTo(filePath: FilePath): number {
            if (this.hostPath < filePath.hostPath) {
                return -1;
            }
            else if (this.hostPath > filePath.hostPath) {
                return 1;
            }
            else {
                return 0;
            }
        }

        public equals(filePath: FilePath): boolean {
            return this.normalizedPath === filePath.normalizedPath &&
                this.hostPath === filePath.hostPath;
        }

        public getDeclareFilePath(): FilePath {
            return this.isTSFile() ? this.changePathToDTS() : this.changePathToDTS();
        }

        public changePathToDTS(): FilePath {
            return new FilePath(trimModName(stripQuotes(this.hostPath)) + ".d.ts";
        }

        public isJSFile(): boolean {
            return isFileOfExtension(this.hostPath, ".js");
        }

        public isTSFile(): boolean {
            return isFileOfExtension(this.hostPath, ".ts");
        }

        public isDTSFile() {
            return isFileOfExtension(this.hostPath, ".d.ts");
        }
    }

    function isFileOfExtension(fname: string, ext: string) {
        var invariantFname = fname.toLocaleUpperCase();
        var invariantExt = ext.toLocaleUpperCase();
        var extLength = invariantExt.length;
        return invariantFname.length > extLength && invariantFname.substring(invariantFname.length - extLength, invariantFname.length) === invariantExt;
    }

    var switchToForwardSlashesRegEx = /\\/g;
    function switchToForwardSlashes(path: string): string {
        return path.replace(switchToForwardSlashesRegEx, "/");
    }
}