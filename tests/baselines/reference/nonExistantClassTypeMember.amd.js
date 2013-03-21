define(["require", "exports"], function(require, exports) {
    function foo() {
        var a = Events.AdminSavedChanges;
    }
    var Events = (function () {
        function Events() { }
        Events.NodeClick = "NodeClick";
        return Events;
    })();
    exports.Events = Events;    
})