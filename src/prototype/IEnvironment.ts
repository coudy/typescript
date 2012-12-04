///<reference path='References.ts' />

interface IEnvironment {
    readFile(path: string, charSet?: string): string;
    writeFile(path: string, contents: string, useUTF8?: bool): void;
    deleteFile(path: string): void;
    fileExists(path: string): bool;
    directoryExists(path: string): bool;
    listFiles(path: string, re?: RegExp, options?: { recursive?: bool; }): string[];

    arguments: string[];
    standardOut: ITextWriter;
}