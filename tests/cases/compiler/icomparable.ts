    interface IComparable<T> {
       compareTo(other: T);
    }

    declare function sort<U extends IComparable>(items: U[]): U[];

    interface StringComparable extends IComparable<string> {
    }

    var sc: StringComparable[];

    var x = sort(sc);