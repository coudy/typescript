/// <reference path='fourslash.ts'/>

////function Foo() {
////    var x;
////    switch (x) {
////        /*insideStatement*/
////    }
////    /*afterStatement*/
////    switch (x) {
////        /*insideStatement2*/
////        case 1:
////            /*insideCase*/
////            break;
////        /*afterBreak*/
////    }
////    /*afterStatement2*/
////}

var markAndSmartIndentLevelPair = <{ marker: string; smartIndentLevel: number; }[]>[
    { marker: 'insideStatement', smartIndentLevel: 2 },
    { marker: 'afterStatement', smartIndentLevel: 1 },
    { marker: 'insideStatement2', smartIndentLevel: 2 },
    { marker: 'insideCase', smartIndentLevel: 3 },
    { marker: 'afterBreak', smartIndentLevel: 2 },
    { marker: 'afterStatement2', smartIndentLevel: 1 },
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