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
        TriviaFullWidthShift = 2,       //  1111 1111 1111 1111 1111 1111 1111 1100

        // Masks that we use to place information about a node into a single int.  The first bit tells
        // us if the node is incrementally reusable. the node is incrementally reusable if it does not
        // containe any skipped tokens, zero width tokens, regex tokens in it ("/", "/=" or "/.../"), 
        // and contains no tokens that were parser generated.
        //
        // The next bit lets us know if the nodes was parsed in a strict context or node.  A node can
        // only be used by the incremental parser if it is parsed in the same strict context as before.
        // last masks off the part of the int
        //
        // The width of the node is stored in the remainder of the int.  This allows us up to 1GB
        // for a node by using all 30 bits.  However, in the common case, we'll use less than 30 bits
        // for the width.  Thus, the info will be stored in a single int in chakra.
        //
        // If we need more space, we can always merge the first 3 bits into a single bit:
        // 'canBeIncrementallyReused'.  That will allow us up to 1023MB for a single node.
        NodeIncrementallyReusableMask = 0x00000001, // 0000 0000 0000 0000 0000 0000 0000 0001
        NodeParsedInStrictModeMask = 0x00000002,    // 0000 0000 0000 0000 0000 0000 0000 0010
        NodeFullWidthShift = 2,                     // 1111 1111 1111 1111 1111 1111 1111 1100
    }
}