/// <reference path="fourslash.ts"/>

/////// Module
////{| "itemName": "Shapes", "kind": "module", "parentName": "" |}module Shapes {
////
////    // Class
////    {| "itemName": "Point", "kind": "class", "parentName": "Shapes" |}export class Point {
////        // Instance member
////        {| "itemName": "originPointAttheHorizon", "kind": "property", "parentName": "Shapes.Point", "matchKind": "exact"|}private originPointAttheHorizon = 0.0;
////
////        // Getter
////        {| "itemName": "distanceFromOrigin", "kind": "getter", "parentName": "Shapes.Point", "matchKind": "exact" |}get distanceFromOrigin(): number { return 0; }
////
////    }
////}
////
////// Local variables
////{| "itemName": "myPointThatIJustInitiated", "kind": "var", "parentName": "", "matchKind": "exact"|}var myPointThatIJustInitiated = new Shapes.Point();

//// Testing for substring matching of navigationItems
var searchValue = "distance Horizon INITIATED";

test.markers().forEach((marker) => {
    if (marker.data) {
        verify.navigationItemsListContains(marker.data.itemName, marker.data.kind, searchValue, marker.fileName, marker.data.parentName);
    }
});