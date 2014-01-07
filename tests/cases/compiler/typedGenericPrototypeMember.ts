class List<T> {
   add(item: T) { }
}

List.prototype.add("abc"); // Valid because parameter has type {}
