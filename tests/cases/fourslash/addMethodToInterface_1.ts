/// <reference path="../fourslash.ts" />

//// interface Comparable<T> {
//// }
//// interface Comparer {
//// }
//// var max2: Comparer = (x, y) => { return (x.compareTo(y) > 0) ? x : y };
//// var maxResult = max2(1);

edit.disableFormatting();
diagnostics.validateTypesAtPositions(59,114,74,76,84);

////   1: interface Comparable<T> {
////    :  |->-> go here
////   2: }
////   3: interface Comparer {
goTo.position(26);

////   1: interface Comparable<T> {
////    :  |->-> insert "    compareTo(): number;\n"
////   2: }
////   3: interface Comparer {
edit.insert("    compareTo(): number;\n");
diagnostics.validateTypesAtPositions(168,84,53,118,22);
