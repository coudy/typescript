/// <reference path='fourslash.ts'/>

////interface Foo {
////    /*inInterface*/
////    x: number;
////    /*afterProperty*/
////    foo(): number;
////    /*afterMethod*/
////}
/////*afterInterface*/

var markAndSmartIndentLevelPair = <{ marker: string; smartIndentLevel: number; }[]>[
    { marker: 'inInterface', smartIndentLevel: 1 },
    { marker: 'afterProperty', smartIndentLevel: 1 },
    { marker: 'afterMethod', smartIndentLevel: 1 },
    { marker: 'afterInterface', smartIndentLevel: 0 },
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