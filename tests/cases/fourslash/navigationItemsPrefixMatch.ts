/// <reference path="fourslash.ts"/>

/////// Module
////{| "itemName": "Shapes", "kind": "module", "parentName": "" |}module Shapes {
////
////    // Class
////    {| "itemName": "Point", "kind": "class", "parentName": "Shapes" |}export class Point {
////        // Instance member
////        {| "itemName": "origin", "kind": "property", "parentName": "Shapes.Point", "matchKind": "prefix"|}private originality = 0.0;
////
////        {| "itemName": "distanceFromOrigin", "kind": "property", "parentName": "Shapes.Point", "matchKind": "prefix"|}private distanceFromOrig = 0.0;
////
////        // Getter
////        {| "itemName": "distance", "kind": "getter", "parentName": "Shapes.Point", "matchKind": "prefix" |}get distanceFarFarAway(): number { return 0; }
////    }
////}
////
////// Local variables
////{| "itemName": "point", "kind": "var", "parentName": "", "matchKind": "prefix"  |}var pointsSquareBox = new Shapes.Point();

//// Testing for exact matching of navigationItems
var searchValue = "origin distance points";

test.markers().forEach((marker) => {
    if (marker.data) {
        verify.navigationItemsListContains(marker.data.itemName, marker.data.kind, searchValue, marker.data.matchKind, marker.fileName, marker.data.parentName);
    }
});
