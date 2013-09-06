//@module: commonjs
// @Filename: arrayOfExportedClass_0.ts
declare module 'Car' {
    class Car {

    }

    export = Car;
}

// @Filename: arrayOfExportedClass_1.ts
///<reference path='arrayOfExportedClass_0.ts'/>
import Car = require('Car');

class Road {

    public cars: Car[];

    public AddCars(cars: Car[]) {

        this.cars = cars;
    }
}

export = Road;
