var Editor;
(function (Editor) {
    var List = (function () {
        function List(isHead, data) {
            this.isHead = isHead;
            this.data = data;
        }
        List.MakeHead = function MakeHead() {
            var entry = new List(true, null);
            return entry;
        };
        return List;
    })();
    Editor.List = List;    
})(Editor || (Editor = {}));