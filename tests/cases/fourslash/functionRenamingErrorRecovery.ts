/// <reference path="fourslash.ts" />

////class Foo { public bar/*1*//*2*/() { } }

goTo.marker("1");
edit.backspace(3);
edit.insert("Pizza");
verify.currentLineContentIs("class Foo { public Pizza() { } }");
verify.errorDoesNotExistAfterMarker("2");