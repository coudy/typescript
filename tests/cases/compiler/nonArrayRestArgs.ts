function foo(...rest: number) {
	var x: string = rest[0]; // should error
	return x;
}