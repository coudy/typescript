



exports.x;
exports.x.a;


////[declFileExportAssignmentOfGenericInterface_0.d.ts]
interface Foo<T> {
    a: string;
}
export = Foo;

////[declFileExportAssignmentOfGenericInterface_1.d.ts]
import a = require('declFileExportAssignmentOfGenericInterface_0');
export declare var x: a<a<string>>;
