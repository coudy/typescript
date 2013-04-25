/// <reference path="fourslash.ts" />

//// public break;
//// /**/

goTo.marker();
// Bug 673655: exception in incremental update when file contains "public break;" at top-level
edit.insert(' ');
