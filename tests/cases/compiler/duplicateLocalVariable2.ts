
//import FileManager = module('filemanager');
//import App = module('app');

declare var FileManager: any;
declare var App: any;

export class TestCase {
    constructor (public name: string, public test: ()=>bool, public errorMessageRegEx?: string) {
    }
}
export class TestRunner { 
    private tests: TestCase[] = [];

    static arrayCompare(arg1: any[], arg2: any[]): bool {
        return (arg1.every(function (val, index) { return val === arg2[index] }));
    }

    public addTest(test: TestCase) {
        this.tests.push(test);
    }
}

export var tests: TestRunner = (function () {
    var testRunner = new TestRunner();

    testRunner.addTest(new TestCase("Check UTF8 encoding",
        function () {
            var fb = new FileManager.FileBuffer(20);
            fb.writeUtf8Bom();
            var chars = [0x0054, 0x00E8, 0x1D23, 0x2020, 0x000D, 0x000A];
            for (var i in chars) {
                fb.writeUtf8CodePoint(chars[i]);
            }
            fb.index = 0;
            var bytes = [];
            for (var i = 0; i < 14; i++) {
                bytes.push(fb.readByte());
            }
            var expected = [0xEF, 0xBB, 0xBF, 0x54, 0xC3, 0xA8, 0xE1, 0xB4, 0xA3, 0xE2, 0x80, 0xA0, 0x0D, 0x0A];
            return TestRunner.arrayCompare(bytes, expected);
        }));

    return testRunner;
})();