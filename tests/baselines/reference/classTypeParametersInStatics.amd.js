var Editor;
(function (Editor) {
    var List = (function () {
        function List(isHead, data) {
            this.isHead = isHead;
            this.data = data;
        }
        List.MakeHead = function MakeHead() {
            var entry = new List(true, null);
            entry.prev = entry;
            entry.next = entry;
            return entry;
        };
        List.MakeHead2 = function MakeHead2() {
            var entry = new List(true, null);
            entry.prev = entry;
            entry.next = entry;
            return entry;
        };
        List.MakeHead3 = function MakeHead3() {
            var entry = new List(true, null);
            entry.prev = entry;
            entry.next = entry;
            return entry;
        };
        return List;
    })();
    Editor.List = List;    
})(Editor || (Editor = {}));