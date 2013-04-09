interface IEnvironment {
    readFile(path: string, useUTF8?: boolean): string;
    writeFile(path: string, contents: string, useUTF8?: boolean): void;
    deleteFile(path: string): void;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    listFiles(path: string, re?: RegExp, options?: { recursive?: boolean; }): string[];

    arguments: string[];
    standardOut: ITextWriter;

    currentDirectory(): string;
}