declare class Enumerator {
    public atEnd(): bool;
    public moveNext();
    public item(): any;
    constructor (o: any);
}
