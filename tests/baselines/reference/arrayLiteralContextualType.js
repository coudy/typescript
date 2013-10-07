var Giraffe = (function () {
    function Giraffe() {
        this.name = "Giraffe";
        this.neckLength = "3m";
    }
    return Giraffe;
})();

var Elephant = (function () {
    function Elephant() {
        this.name = "Elephant";
        this.trunkDiameter = "20cm";
    }
    return Elephant;
})();

function foo(animals) {
}
function bar(animals) {
}

foo([
    new Giraffe(),
    new Elephant()
]);
bar([
    new Giraffe(),
    new Elephant()
]);

var arr = [new Giraffe(), new Elephant()];
foo(arr);
bar(arr); // Error because of no contextual type
