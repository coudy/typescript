//// [arrayOfExportedClass_0.js]
//// [arrayOfExportedClass_1.js]
///<reference path='arrayOfExportedClass_0.ts'/>
var Car = require('Car');

var Road = (function () {
    function Road() {
    }
    Road.prototype.AddCars = function (cars) {
        this.cars = cars;
    };
    return Road;
})();


module.exports = Road;

