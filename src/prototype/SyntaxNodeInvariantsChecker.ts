///<reference path='References.ts' />

// A debug class that we use to make sure a syntax node is valid.  Currently, this simply verifies
// that the same token does not appear in the tree multiple times.  This is important for 
// subsystems that want to map between tokens and positions.  If a token shows up multiple times in
// the node, then it will not have a unique position, previous token, etc. etc. and that can screw
// many algorithms.  For this reason, when generating trees, it is important that nodes that are 
// reused are cloned before insertion.
class SyntaxNodeInvariantsChecker extends SyntaxWalker {
    public static checkInvariants(node: SyntaxNode): void {
        node.accept(new SyntaxNodeInvariantsChecker());
    }
}