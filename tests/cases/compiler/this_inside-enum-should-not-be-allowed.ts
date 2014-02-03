module MyLibrary {
    export class Point {
        static X = 0;
        // Y previously caused a runtime error, 
        // becuase Point was not assigned to module MyLibrary when initialized
        static Y = MyLibrary.Point.X;
    }
}
module Mod2 {
    export module MyLibrary {
        export class Point {
            static X = 0;
            static Y = MyLibrary.Point.X;
        }

        var m = Mod2.MyLibrary.Point.X;
    }
}
