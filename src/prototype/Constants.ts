enum Constants {
    // 2^30-1
    Max31BitInteger = 1073741823,
    Min31BitInteger = -1073741824,

    // Masks that we use to place information about trivia into a single int.
    // The first two flags mark bools that tell us if the trivia contains a comment or a newline.
    // The last flag masks off the part of the int that tells us the width.  It allows us to have
    // up to 63MB of leading or trailing trivia *per* token, and that seems like more than enough.
    // We also have a few more leading bits if we need them.  Do *not* use bit 32 as that will 
    // force chakra to use more htan 32 bits to store this value.
    TriviaNewLineMask = 0x08000000, //  0000 1000 0000 0000 0000 0000 0000 0000
    TriviaCommentMask = 0x04000000, //  0000 0100 0000 0000 0000 0000 0000 0000
    TriviaWidthMask =   0x03FFFFFF, //  0000 0011 1111 1111 1111 1111 1111 1111

    // Masks that we use to place information about a node into a single int.  The first two tell
    // us if the node either contained any skipped tokens, or if it had any zero width tokens 
    // anywhere within it.  If it does, then we cannot be reused by the incremental parser.  The 
    // last masks off the part of the int that tells us the full width of the node.  It allows us
    // to have up to 511MB for a single node, and that seems like more than enough.  Do *not* use 
    // bit 32 as that will force chakra to use more htan 32 bits to store this value.
    NodeSkippedTextMask =    0x40000000, // 0100 0000 0000 0000 0000 0000 0000 0000
    NodeZeroWidthTokenMask = 0x20000000, // 0010 0000 0000 0000 0000 0000 0000 0000
    NodeFullWidthMask =      0x1FFFFFFF, // 0001 1111 1111 1111 1111 1111 1111 1111
}