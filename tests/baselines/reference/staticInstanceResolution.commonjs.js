var Comment = (function () {
    function Comment() { }
    Comment.prototype.getDocCommentText = function () {
    };
    Comment.getDocCommentText = function getDocCommentText(comments) {
        comments[0].getDocCommentText();
        var c;
        c.getDocCommentText();
    };
    return Comment;
})();