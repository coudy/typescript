//
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

///<reference path='typescript.ts' />

module TypeScript {
    export function max(a: number, b: number): number {
        return a >= b ? a : b;
    }

    export function min(a: number, b: number): number {
        return a <= b ? a : b;
    }

    export function isValidAstNode(ast: TypeScript.IASTSpan): boolean {
        if (!ast)
            return false;

        if (ast.minChar === -1 || ast.limChar === -1)
            return false;

        return true;
    }

    ///
    /// Return the AST containing "position"
    ///
    export function getAstAtPosition(script: TypeScript.AST, pos: number, useTrailingTriviaAsLimChar: boolean, forceInclusive: boolean): AST {
        var top: AST = null;

        var pre = function (cur: TypeScript.AST, walker: IAstWalker) {
            if (isValidAstNode(cur)) {
                var isInvalid1 = cur.nodeType() === NodeType.ExpressionStatement && cur.getLength() === 0;

                if (isInvalid1) {
                    walker.options.goChildren = false;
                }
                else {
                    // Add "cur" to the stack if it contains our position
                    // For "identifier" nodes, we need a special case: A position equal to "limChar" is
                    // valid, since the position corresponds to a caret position (in between characters)
                    // For example:
                    //  bar
                    //  0123
                    // If "position === 3", the caret is at the "right" of the "r" character, which should be considered valid
                    var inclusive =
                        forceInclusive ||
                        cur.nodeType() === TypeScript.NodeType.Name ||
                        cur.nodeType() === TypeScript.NodeType.MemberAccessExpression ||
                        cur.nodeType() === TypeScript.NodeType.TypeRef ||
                        cur.nodeType() === TypeScript.NodeType.VariableDeclaration ||
                        cur.nodeType() === TypeScript.NodeType.VariableDeclarator ||
                        cur.nodeType() === TypeScript.NodeType.InvocationExpression ||
                        pos === script.limChar + script.trailingTriviaWidth; // Special "EOF" case

                    var minChar = cur.minChar;
                    var limChar = cur.limChar + (useTrailingTriviaAsLimChar ? cur.trailingTriviaWidth : 0) + (inclusive ? 1 : 0);
                    if (pos >= minChar && pos < limChar) {

                        // Ignore empty lists
                        if (cur.nodeType() !== TypeScript.NodeType.List || cur.limChar > cur.minChar) {
                            // TODO: Since AST is sometimes not correct wrt to position, only add "cur" if it's better
                            //       than top of the stack.
                            if (top === null) {
                                top = cur;
                            }
                            else if (cur.minChar >= top.minChar &&
                                (cur.limChar + (useTrailingTriviaAsLimChar ? cur.trailingTriviaWidth : 0)) <= (top.limChar + (useTrailingTriviaAsLimChar ? top.trailingTriviaWidth : 0))) {
                                // this new node appears to be better than the one we're 
                                // storing.  Make this the new node.

                                // However, If the current top is a missing identifier, we 
                                // don't want to replace it with another missing identifier.
                                // We want to return the first missing identifier found in a
                                // depth first walk of  the tree.
                                if (top.getLength() !== 0 || cur.getLength() !== 0) {
                                    top = cur;
                                }
                            }
                        }
                    }

                    // Don't go further down the tree if pos is outside of [minChar, limChar]
                    walker.options.goChildren = (minChar <= pos && pos <= limChar);
                }
            }
        };

        TypeScript.getAstWalkerFactory().walk(script, pre);
        return top;
    }
}
