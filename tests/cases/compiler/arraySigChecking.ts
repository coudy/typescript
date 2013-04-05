declare module M {
	interface iBar { t: any; }
	interface iFoo extends iBar {
		s:any;
	}

	class cFoo {
		t:any;
	}

	var foo: { [index: any]; }; // expect an error here
}

interface myInt {
    voidFn(): void;
}
var myVar: myInt;
var strArray: string[] = [myVar.voidFn()];

//Bug 17543: 3d array accepting 2d array members
var myArray: number[][][];
myArray = [[1, 2]];

// regression for 604980
function isEmpty(l: { length: number })
{
    return l.length === 0;
}

isEmpty([]);
isEmpty(new Array(3));
isEmpty(new Array<string>(3));
isEmpty(['a']);
