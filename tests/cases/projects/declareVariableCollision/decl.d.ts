// bug 535531: duplicate identifier error reported for "import" declarations in separate files

module A
{

    declare export class MyRoot { }

    export module B
    {
        declare export class MyClass{ }
    }
}