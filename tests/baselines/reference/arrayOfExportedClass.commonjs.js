

var Road = (function () {
    function Road() {
    }
    Road.prototype.AddCars = function (cars) {
        this.cars = cars;
    };
    return Road;
})();


module.exports = Road;

