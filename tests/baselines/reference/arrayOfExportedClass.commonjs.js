// bug 755717: Cannot use array of imported class / interface when using single export


var Road = (function () {
    function Road() {
    }
    Road.prototype.AddCars = function (cars) {
        this.cars = cars;
    };
    return Road;
})();


module.exports = Road;

