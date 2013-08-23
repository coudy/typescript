class I {
    [x: string]: Date
}

class I2 extends I {
}

var i: I;
// BUG 766334
//var r: string = i[1]; // error: numeric indexer returns the type of the string indexer

var i2: I2;
// BUG 766334
//var r2: string = i2[1]; // error: numeric indexer returns the type of the string indexere