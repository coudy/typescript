//// [declFileForInterfaceWithRestParams.js]


////[declFileForInterfaceWithRestParams.d.ts]
interface I {
    foo(...x: any[]): any[];
    foo2(a: number, ...x: any[]): any[];
    foo3(b: string, ...x: string[]): string[];
}
