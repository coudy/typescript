enum Constants {
    // 2^30-1
    Max31BitInteger = 1073741823,
    Min31BitInteger = -1073741824,

    // Masks that we use place information about trivia into a single int.
    // The first two flags mark bools that tell us if the trivia contains a comment or a newline.
    // The last flag masks off the part of the int that tells us the length.  It allows us to have
    // up to 63MB of leading or trailing trivia *per* token, and that seems like more than enough.
    // We also have a few more leading bits if we need them.  However, i do believe that the 
    // runtime does use at least one of those bits to mark if a number can be an int or if it needs
    // to be stored in something larger.  So be careful about using them.
    TriviaNewLineMask = 0x08000000, //  0000 1000 0000 0000 0000 0000 0000 0000
    TriviaCommentMask = 0x04000000, //  0000 0100 0000 0000 0000 0000 0000 0000
    TriviaLengthMask =  0x03FFFFFF, //  0000 0011 1111 1111 1111 1111 1111 1111
}