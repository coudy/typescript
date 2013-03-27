
    interface IComparable<T> {
       compareTo(other: T);
    }

    declare function sort<U extends IComparable<U>>(items: U[]): U[];

    interface StringComparable {
    	compareTo(other: string);
    }

    var sc: StringComparable[];

    var x = sort(sc);