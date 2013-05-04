interface Utils {
   fold<T, S>(c: Array<T>, folder?: (s: S, t: T) => T, init?: S): T;
}

Utils.fold(); // error
Utils.fold(null); // no error
Utils.fold(null, null); // no error
Utils.fold(null, null, null); // error: Unable to invoke type with no call signatures
