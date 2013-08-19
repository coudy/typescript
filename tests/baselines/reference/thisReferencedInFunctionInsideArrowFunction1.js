var foo = function (dummy) {
};
function test() {
    foo(function () {
        return function () {
            return this;
        };
    });
}
