//﻿
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

///<reference path='typescriptServices.ts' />
///<reference path='..\prototype\SyntaxWalker.generated.ts' />

module Services {
    export class SyntaxNodeSerializer extends SyntaxWalker {
        private position: number = 0;
        private level: number = 0;
        public serializedAST: string = "";

        public visitToken(token: ISyntaxToken): void {
            this.position += token.fullWidth();
            super.visitToken(token);
        }

        public visitNode(node: SyntaxNode): void {
            this.logNode(node);
            this.level++;
            super.visitNode(node);
            this.level--;
        }

        public getNodeKindName(node: SyntaxNode): string {
            return (<any>SyntaxKind)._map[node.kind()];
        }


        public getNodeName(node: any): string {
            return node.identifier && node.identifier() ? node.identifier().value() : null;
        }

        private logNode(node: SyntaxNode) {
            var start = this.position + node.leadingTriviaWidth();
            var end = this.position + node.leadingTriviaWidth() + node.width();
            var name = this.getNodeName(node);
            var indent = this.level * 2;

            var msg = this.addPadding("", indent, "| ", true);

            msg = msg.concat("+ " + this.getNodeKindName(node));
            if (name) {
                msg = msg.concat(" " + name);
            }
            msg = this.addPadding(msg, 70, " ", false);

            msg = msg.concat("[" + this.addPadding(start.toString(), 1, " ", true) + ", " + this.addPadding(end.toString(), 1, " ", true) + "]");

            msg = msg.concat("\r\n");

            this.serializedAST += msg;
        }

        private addPadding(s: string, targetLength: number, paddingString: string, leftPadding: bool): string {
            var result = (leftPadding ? "" : s);
            for (var i = s.length; i < targetLength; i++) {
                result = result + paddingString;
            }
            result = result + (leftPadding ? s : "");
            return result;
        }

        public static serialize(node: SyntaxNode): string {
            var serializer = new SyntaxNodeSerializer();
            node.accept(serializer);
            return serializer.serializedAST;
        }
    }
}