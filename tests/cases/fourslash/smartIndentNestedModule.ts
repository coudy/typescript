/// <reference path='fourslash.ts'/>

////module Foo {
////    module Foo2 {
////        /*inNestedModule*/
////        function f() {
////        }
////        /*afterFunction*/
////        var x: number;
////        /*afterVariable*/
////    }
////    /*afterNestedModule*/
////}

var markAndSmartIndentLevelPair = <{ marker: string; smartIndentLevel: number; }[]>[
    { marker: 'inNestedModule', smartIndentLevel: 2 },
    { marker: 'afterFunction', smartIndentLevel: 2 },
    { marker: 'afterVariable', smartIndentLevel: 2 },
    { marker: 'afterNestedModule', smartIndentLevel: 1 },
];

markAndSmartIndentLevelPair.forEach(function (pair)
{
    goTo.marker(pair.marker);
    try
    {
        verify.smartIndentLevelIs(pair.smartIndentLevel);
    }
    catch (e)
    {
        throw new Error(e.message + ' at marker: ' + pair.marker);
    }
} );