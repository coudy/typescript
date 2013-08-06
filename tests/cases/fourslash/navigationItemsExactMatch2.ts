/// <reference path="fourslash.ts"/>
// @Filename: navigationItemsContainsNoAnonymousFunctions_0.ts
/////*file1*/
////module Shapes {
////    class Point {
////        private origin = 0.0;
////        private distanceFromOrigin = 0.0;
////
////        get distance(): number {
////            return 0;
////        }
////    }
////}
////
////var point = new Shapes.Point();

var searchValue = "point origin, distance";
var notFoundSearchValue = "square box";

goTo.marker("file1");
verify.navigationItemsListCount(3, searchValue, "exact");
verify.navigationItemsListCount(1, searchValue, "prefix");
verify.navigationItemsListCount(0, searchValue, "substring");

verify.navigationItemsListCount(0, notFoundSearchValue, "exact");
verify.navigationItemsListCount(0, notFoundSearchValue, "prefix");
verify.navigationItemsListCount(0, notFoundSearchValue, "substring");