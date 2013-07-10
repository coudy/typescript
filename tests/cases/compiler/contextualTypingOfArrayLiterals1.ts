interface I {
   [x: number]: Date;
}

// BUG 733715
var x3: I = [new Date(), 1]; 
var r2 = x3[1]; 
r2.getDate(); 
