interface InterfaceWithMultipleTypars<T, T> { // should error
	bar(): void;
}

interface InterfaceWithSomeTypars<T> { // should not error
	bar(): void;
}

interface InterfaceWithSomeTypars<T, T> { // should error
	bar2(): void;
}