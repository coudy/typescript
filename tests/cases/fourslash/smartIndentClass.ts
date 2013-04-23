/// <reference path='fourslash.ts'/>

////class Bar {
////    /*insideClass*/
////    private foo: string = "";
////    /*afterProperty*/
////    private f() {
////        var a: any[] = [[1, 2], [3, 4], 5];
////        /*insideMethod*/
////        return ((1 + 1));
////    }
////    /*afterMethod*/
////    private f2() {
////        if (true) { } { };
////    }
////}
/////*afterClass*/

var markAndSmartIndentLevelPair = <{ marker: string; smartIndentLevel: number; }[]>[
    { marker: 'insideClass', smartIndentLevel: 1 },
    { marker: 'afterProperty', smartIndentLevel: 1 },
    { marker: 'insideMethod', smartIndentLevel: 2 },
    { marker: 'afterMethod', smartIndentLevel: 1 },
    { marker: 'afterClass', smartIndentLevel: 0 },
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