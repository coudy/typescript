// bug 755717: Cannot use array of imported class / interface when using single export

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
