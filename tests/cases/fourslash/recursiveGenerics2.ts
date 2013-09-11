/// <reference path="fourslash.ts" />

//// class S18<B, B, A, B> extends S18<A[], { S19: A; (): A }[]> { }
//// /**/

goTo.marker();
// Bug 773653: Stack overflow
// edit.insert('(new S18()).S18 = 0;');
