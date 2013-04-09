module Editor {
    export class List<T> {

        constructor(public isHead: bool, public data: T) {
        }

        static MakeHead(): List<T> {
            var entry: List<T> = new List<T>(true, null);
            return entry;
        }
    }
}