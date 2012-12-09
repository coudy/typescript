///<reference path='References.ts' />

enum CharacterCodes {
    nullCharacter = 0,
    maxAsciiCharacter = 127,

    lineFeed            = 10,       // \n
    carriageReturn      = 13,       // \r
    nextLine            = 0x0085,
    lineSeparator       = 0x2028,
    paragraphSeparator  = 0x2029,
    space               = 32,       // " "

    nonBreakingSpace    = 0x00A0,   //

    _ = 95,
    $ = 36,

    _0 = 48,
    _9 = 57,

    a = 97,
    b = 98,
    e = 101,
    f = 102,
    n = 110,
    r = 114,
    t = 116,
    u = 117,
    v = 118,
    x = 120,
    z = 122,

    A = 65,
    E = 69,
    F = 70,
    X = 88,
    Z = 90,

    ampersand = 38,             // &
    asterisk = 42,              // *
    backslash = 92,             // \
    bar = 124,                  // |
    caret = 94,                 // ^
    closeBrace = 125,           // }
    closeBracket = 93,          // ]
    closeParen = 41,            // )
    colon = 58,                 // : 
    comma = 44,                 // ,
    dot = 46,                   // .
    doubleQuote = 34,           // "
    equals = 61,                // =
    exclamation = 33,           // !
    greaterThan = 62,           // >
    lessThan = 60,              // <
    minus = 45,                 // -
    openBrace = 123,            // {
    openBracket = 91,           // [
    openParen = 40,             // (
    percent = 37,               // %
    plus = 43,                  // +
    question = 63,              // ?
    semicolon = 59,             // ;
    singleQuote = 39,           // '
    slash = 47,                 // /
    tilde = 126,                // ~

    backspace = 8,              // \b
    formFeed = 12,              // \f
    byteOrderMark = 0xFEFF,
    tab = 9,                    // \t
    verticalTab = 11,           // \v
}