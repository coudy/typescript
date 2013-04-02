interface I5<T> extends I5<T> {
    foo():void;
} 

interface i8<T> extends i9<T> { } 
interface i9<T> extends i8<T> { } 
