/// <reference path="fourslash.ts"/>

////class DataHandler {
////    dataArray: Uint8Array;
////    loadData(filename) {
////        var xmlReq = new XMLHttpRequest();
////        xmlReq.open("GET", "/" + filename, true);
////        xmlReq.responseType = "arraybuffer";
////        xmlReq.onload = function(xmlEvent) {
////            /*local*/
////            this./*this*/;
////        }
////    }
////}

// Disable incremental update validation to avoid having a full type check running after the edit.
edit.disableIncrementalUpdateValidation();

goTo.marker("local");
edit.insertLine("");
verify.completionListContains("xmlEvent");

goTo.marker("this");
verify.completionListIsEmpty();