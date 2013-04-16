/// <reference path='FourSlash.ts' />
////module MemoryAnalyzer {
////    export module Foo.Charting { }
////    /**/

goTo.marker();
edit.insert("}");
verify.smartIndentLevelIs(0);
