declare module process {
    export var argv: string[];
    export var platform: string;
    export function on(event: string, handler: (any) => void ): void;
    export module stdout {
        export function write(str: string);
        export function on(event: string, action: () => void );
    }
    export module stderr {
        export function write(str: string);
        export function on(event: string, action: () => void);
    }
    export module mainModule {
        export var filename: string;
    }
    export function exit(exitCode?: number);
}