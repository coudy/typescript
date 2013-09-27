function callb(lam: (l: number) => void);
function callb(lam: (n: string) => void);
function callb(a) { }

callb((a) => { a.length; }); // Error, we picked the first overload and errored when type checking the lambda body
callb((a) => a.length); // Error, we picked the first overload even though it had a provisional error accessing a.length.