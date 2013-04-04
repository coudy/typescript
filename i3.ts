interface I3333 { one?: number; }; 
var x = {one: 1};
var y: {one: number};
var i: I3333;

i = x;
x = i;

i = y;
y = i;

x = y;
y = x;