// bug 755717: Cannot use array of imported class / interface when using single export
define(["require", "exports"], function(require, exports) {
    

    var Road = (function () {
        function Road() {
        }
        Road.prototype.AddCars = function (cars) {
            this.cars = cars;
        };
        return Road;
    })();

    
    return Road;
});
