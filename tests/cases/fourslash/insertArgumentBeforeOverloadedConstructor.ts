/// <reference path="fourslash.ts" />

//// alert(/**/100);
//// 
//// class OverloadedMonster {
////     constructor();
////     constructor(name) { }
//// }

goTo.marker();
// Bug 674612: AST divergence when inserting an arugment in a function call preceding a class with an overloaded constructor
// edit.insert("'1', ");
