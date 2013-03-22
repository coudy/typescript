///<reference path='References.ts' />

module TypeScript {
    export enum SyntaxConstants {
        // Masks that we use to place information about trivia into a single int. The first two flags 
        // mark bools that tell us if the trivia contains a comment or a newline. The width of the 
        // trivia is then stored in the rest of the int.  This allows trivia of nearly any length.
        // However, nearly all of the time the trivia will be less than 511MB, and will fit into 31
        // bits (which will only be stored a a single 32bit int in chakra).
        TriviaNewLineMask = 0x00000001, //  0000 0000 0000 0000 0000 0000 0000 0001
        TriviaCommentMask = 0x00000002, //  0000 0100 0000 0000 0000 0000 0000 0010
        TriviaFullWidthShift = 2,          //  1111 1111 1111 1111 1111 1111 1111 1100

        // Masks that we use to place information about a node into a single int.  The first three tell
        // us if the node either contained any skipped tokens, or if it had any zero width tokens 
        // anywhere within it, or if it had a regex token in it ("/", "/=" or "/.../").  If it does, 
        // then we cannot be reused by the incremental parser.
        //
        // The next bit lets us know if the nodes was parsed in a strict context or node.  A node can
        // only be used by the incremental parser if it is parsed in the same strict context as before.
        // last masks off the part of the int
        //
        // The width of the node is stored in the remainder of the int.  This allows us up to 255 MB
        // for a node by using all 28 bits.  However, in the common case, we'll use less than 28 bits
        // for the width.  Thus, the info will be stored in a single int in chakra.
        //
        // If we need more space, we can always merge the first 3 bits into a single bit:
        // 'canBeIncrementallyReused'.  That will allow us up to 1023MB for a single node.
        NodeSkippedTextMask = 0x00000001, // 0000 0000 0000 0000 0000 0000 0000 0001
        NodeZeroWidthTokenMask = 0x00000002, // 0000 0000 0000 0000 0000 0000 0000 0010
        NodeRegularExpressionTokenMask = 0x00000004, // 0000 0000 0000 0000 0000 0000 0000 0100
        NodeParsedInStrictModeMask = 0x00000008, // 0000 0000 0000 0000 0000 0000 0000 1000
        NodeFullWidthShift = 4,          // 1111 1111 1111 1111 1111 1111 1111 0000
    }
}