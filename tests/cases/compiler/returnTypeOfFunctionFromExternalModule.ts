// @Filename: system.d.ts
export interface ValueCallback {
    (value: any): any;
}

export interface EventCallback {
    (value: any): void;
}

export interface ErrorCallback {
    (error: any): any;
}

export interface ProgressCallback {
    (progress: any): any;
}

export interface CancelCallback {
    (): void;
}

export interface Promise {
    then(success?: ValueCallback, error?: ErrorCallback, progress?: ProgressCallback): Promise;
    done(success?: ValueCallback, error?: ErrorCallback, progress?: ProgressCallback): void;
    cancel(): void;
}

export declare var Promise: {
    prototype: Promise;
    as(value: any): Promise;
}


// @Filename: test.ts
import system = module('system');

function foo(): void {
    var p: system.Promise;
    p = system.Promise.as(10);
}
function bar(): system.Promise {
}
