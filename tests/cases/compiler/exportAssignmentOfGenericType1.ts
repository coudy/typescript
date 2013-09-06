//@module: amd
// @Filename: exportAssignmentOfGenericType1_0.ts
declare module "Q" {
  export = T;

  class T<X> { }
}

// @Filename: exportAssignmentOfGenericType1_1.ts
///<reference path='exportAssignmentOfGenericType1_0.ts'/>
import q = require("Q");

class M extends q<string> { }
