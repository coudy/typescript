// @Filename: modulesImportedForTypeArgumentPosition_0.ts
export interface M2C { }

// @Filename: modulesImportedForTypeArgumentPosition_1.ts
/**This is on import declaration*/
import M2 = require("modulesImportedForTypeArgumentPosition_0");
class C1<T>{ }
class Test1 extends C1<M2.M2C> {
}
