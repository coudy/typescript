/// <reference path='fourslash.ts' />

////var objectLiteral = { n: 5, s: "", f: (a: number, b: string) => "" };
////objectLiteral.f(/*objectLiteral1*/4, /*objectLiteral2*/"");

goTo.marker('objectLiteral1');
verify.currentSignatureHelpReturnTypeIs("string");
verify.currentParameterHelpArgumentNameIs("a");
verify.currentParameterHelpType("number");
goTo.marker('objectLiteral2');
verify.currentParameterHelpArgumentNameIs("b");
verify.currentParameterHelpType("string");