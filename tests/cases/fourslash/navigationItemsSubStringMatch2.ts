/// <reference path="fourslash.ts"/>
// @Filename: navigationItemsContainsNoAnonymousFunctions_0.ts
/////*file1*/
////module Shapes {
////    export class Point {
////        private originPointAttheHorizon = 0.0;
////
////        get distanceFromOrigin(): number {
////            return 0;
////        }
////    }
////}
////
////var myPointThatIJustInitiated = new Shapes.Point();

var searchValue = "distance Horizon INITIATED";
var notFoundSearchValue = "mPointThatIJustInitiated wrongKeyWord";

goTo.marker("file1");
verify.navigationItemsListCount(0, searchValue, "exact");
verify.navigationItemsListCount(2, searchValue, "substring");
verify.navigationItemsListCount(1, searchValue, "prefix");

verify.navigationItemsListCount(0, notFoundSearchValue, "exact");
verify.navigationItemsListCount(0, notFoundSearchValue, "prefix");
verify.navigationItemsListCount(0, notFoundSearchValue, "substring");