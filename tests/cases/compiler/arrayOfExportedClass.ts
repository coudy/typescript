declare module 'Car' {
    class Car {

    }

    export = Car;
}

import Car = require('Car');

class Road {

    public cars: Car[];

    public AddCars(cars: Car[]) {

        this.cars = cars;
    }
}

export = Road;
