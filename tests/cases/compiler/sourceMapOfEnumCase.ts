// @sourcemap: true
enum EnumNumbers
{

    one = 1,
    two,
    three,
    ten = 10
}

function foo(a: { a: number; }) {

    switch (a.a) {
        case EnumNumbers.one:
            WScript.Echo(a);
            break;

        case EnumNumbers.two:
            WScript.Echo("Hello this is 2");
            break;

        case EnumNumbers.three:
            WScript.Echo("This is 1");
            break;

        case EnumNumbers.ten:
            WScript.Echo("Case of 10");

        default:
            WScript.Echo("Default:" + a);
            break;
    }

}

foo({ a: 1 });
foo({ a: 2 });
foo({ a: 3 });
foo({ a: 10 });
foo({ a: 14 });