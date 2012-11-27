///<reference path='References.ts' />

interface IEnvironment {
    readFile(path: string): string;
    writeFile(path: string, contents: string): void;
    // createFile(path: string, useUTF8?: bool): ITextWriter;
    deleteFile(path: string): void;
    // dir(path: string, re?: RegExp, options?: { recursive?: bool; }): string[];
    fileExists(path: string): bool;
    directoryExists(path: string): bool;
    // createDirectory(path: string): void;

    // resolvePath(path: string): string;
    // dirName(path: string): string;
    // findFile(rootPath: string, partialFilePath: string): IResolvedFile;
    // print(str: string): void;
    // printLine(str: string): void;
    arguments: string[];
    // stderr: ITextWriter;
    standardOut: ITextWriter;
    // watchFiles(files: string[], callback: () => void ): bool;
    // run(source: string, filename: string): void;
    // getExecutingFilePath(): string;
    // quit(exitCode?: number);
}