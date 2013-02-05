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
///<reference path='..\prototype\DepthLimitedWalker.ts' />

module Services {
    export class OutliningElementsCollector extends DepthLimitedWalker {
        // The maximum depth for collecting spans; this will cause us to miss deeply nested function/modules spans, 
        // but will guarantee performance will not be closely tied to tree depth.
        private static MaximumDepth: number = 10;

        private elements: TextSpan[] = [];
        private position: number = 0;

        constructor() {
            super(OutliningElementsCollector.MaximumDepth);
        }

        public visitToken(token: ISyntaxToken): void {
            this.position += token.fullWidth();
        }

        public visitClassDeclaration(node: ClassDeclarationSyntax): void {
            this.addOutlineRange(node, node.openBraceToken(), node.closeBraceToken());
            super.visitClassDeclaration(node);
        }

        public visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void {
            this.addOutlineRange(node, node.body(), node.body());
            super.visitInterfaceDeclaration(node);
        }

        public visitModuleDeclaration(node: ModuleDeclarationSyntax): void {
            this.addOutlineRange(node, node.openBraceToken(), node.closeBraceToken());
            super.visitModuleDeclaration(node);
        }

        public visitEnumDeclaration(node: EnumDeclarationSyntax): void {
            this.addOutlineRange(node, node.openBraceToken(), node.closeBraceToken());
            super.visitEnumDeclaration(node);
        }

        public visitFunctionDeclaration(node: FunctionDeclarationSyntax): void {
            this.addOutlineRange(node, node.block(), node.block());
            super.visitFunctionDeclaration(node);
        }

        public visitFunctionExpression(node: FunctionExpressionSyntax): void {
            this.addOutlineRange(node, node.block(), node.block());
            super.visitFunctionExpression(node);
        }

        public visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void {
            this.addOutlineRange(node, node.block(), node.block());
            super.visitConstructorDeclaration(node);
        }

        public visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {
            this.addOutlineRange(node, node.block(), node.block());
            super.visitMemberFunctionDeclaration(node);
        }

        public visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
            this.addOutlineRange(node, node.block(), node.block());
            super.visitGetMemberAccessorDeclaration(node);
        }

        public visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
            this.addOutlineRange(node, node.block(), node.block());
            super.visitSetMemberAccessorDeclaration(node);
        }

        private addOutlineRange(node: SyntaxNode, startElement: ISyntaxNodeOrToken, endElement: ISyntaxNodeOrToken) {
            if (startElement && endElement) {
                // Compute the position
                var start = this.position + Syntax.childOffset(node, startElement);
                var end = this.position + Syntax.childOffset(node, endElement) + endElement.leadingTriviaWidth() + endElement.width();

                // Push the new range
                this.elements.push(TextSpan.fromBounds(start, end));
            }
        }

        public static collectElements(node: SourceUnitSyntax): TextSpan[] {
            var collector = new OutliningElementsCollector();
            node.accept(collector);
            return collector.elements;
        }
    }
}
