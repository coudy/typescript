/// <reference path='fourslash.ts'/>

////enum Foo3 {
////    /*inEnum*/
////    val1,
////    /*afterVariable*/
////    val2,
////    /*afterSecondVariable*/
////}
/////*afterEnum*/

var markAndSmartIndentLevelPair = <{ marker: string; smartIndentLevel: number; }[]>[
    { marker: 'inEnum', smartIndentLevel: 1 },
    { marker: 'afterVariable', smartIndentLevel: 1 },
    { marker: 'afterSecondVariable', smartIndentLevel: 1 },
    { marker: 'afterEnum', smartIndentLevel: 0 },
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