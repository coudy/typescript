// @Filename: strings.ts
var exports;
export function format(value: string, ...args: any[]): string {
    return "";
}

declare export function bind(value: string, ...args: any[]): string;
exports.bind = format;

// @Filename: test.ts
import strings = module('strings');
strings.bind('Provider returned error: {0}', 30);
