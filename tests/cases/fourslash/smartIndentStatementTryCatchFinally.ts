/// <reference path='fourslash.ts'/>

////function tryCatch() {
////    /*beforeTry1*/
////    try {
////        /*insideTry1*/
////    }
////    /*beforeCatch1*/
////    catch (err) {
////        /*insideCatch1*/
////    }
////    /*afterCatch1*/
////}
////
////function tryFinally() {
////    /*beforeTry2*/
////    try {
////        /*insideTry2*/
////    }
////    /*beforeFinally2*/
////    finally {
////        /*insideFinally2*/
////    }
////    /*afterFinally2*/
////}
////
////function tryCatchFinally() {
////    /*beforeTry3*/
////    try {
////        /*insideTry3*/
////    }
////    /*beforeCatch3*/
////    catch (err) {
////        /*insideCatch3*/
////    }
////    /*beforeFinally3*/
////    finally {
////        /*insideFinally3*/
////    }
////    /*afterFinally3*/
////}

var markAndSmartIndentLevelPair = <{ marker: string; smartIndentLevel: number; }[]>[
    { marker: 'beforeTry1', smartIndentLevel: 1 },
    { marker: 'insideTry1', smartIndentLevel: 2 },
    { marker: 'beforeCatch1', smartIndentLevel: 1 },
    { marker: 'insideCatch1', smartIndentLevel: 2 },
    { marker: 'afterCatch1', smartIndentLevel: 1 },
    { marker: 'beforeTry2', smartIndentLevel: 1 },
    { marker: 'insideTry2', smartIndentLevel: 2 },
    { marker: 'beforeFinally2', smartIndentLevel: 1 },
    { marker: 'insideFinally2', smartIndentLevel: 2 },
    { marker: 'afterFinally2', smartIndentLevel: 1 },
    { marker: 'beforeTry3', smartIndentLevel: 1 },
    { marker: 'insideTry3', smartIndentLevel: 2 },
    { marker: 'beforeCatch3', smartIndentLevel: 1 },
    { marker: 'insideCatch3', smartIndentLevel: 2 },
    { marker: 'beforeFinally3', smartIndentLevel: 1 },
    { marker: 'insideFinally3', smartIndentLevel: 2 },
    { marker: 'afterFinally3', smartIndentLevel: 1 },
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