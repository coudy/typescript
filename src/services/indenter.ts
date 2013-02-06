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

module Services {
    export class Indenter {
        static public getIndentation(node: SourceUnitSyntax, soruceText: TypeScript.ISourceText, position: number, editorOptions: Services.EditorOptions): number {
            
            var indentation = 0;
            var currentToken = node.findToken(position);
            var currentNode: PositionedElement = currentToken;

            if (currentToken.token().kind() === SyntaxKind.EndOfFileToken) {
                // Ignore EOF tokens, pick the one before it
                currentNode = currentToken.previousToken();
            } else if (Indenter.belongsToBracket(soruceText, currentToken, position)) {
                // Let braces and brackets take the indentation of thier parents
                currentNode = currentToken.parent();
            }

            if (currentNode === null) {
                return indentation;
            }

            var currentElement = currentNode.element();
            var parent = currentNode.parent();

            while (parent !== null) {
                // Skip nodes that start at the position, these will have the indentation level of thier parent
                if (parent.fullStart() !== currentNode.fullStart()) {
                    if (Indenter.isInContainerNode(parent.element(), currentElement)) {
                        indentation += editorOptions.IndentSize;
                    } else {
                        var listIndentation = Indenter.getCustomListIndentation(parent.element(), currentElement);
                        if (listIndentation !== -1) {
                            // Found a list node with special indentation, If the list items span multiple lines, we want 
                            // to use the user-specified indentation; return.
                            return indentation + listIndentation;
                        }
                    }
                }
                currentNode = parent;
                currentElement = parent.element();
                parent = parent.parent();
            }
            
            return indentation;
        }

        private static belongsToBracket(sourceText: TypeScript.ISourceText, token: PositionedToken, position: number): bool {
            switch (token.token().kind()) {
                case SyntaxKind.OpenBraceToken:
                case SyntaxKind.CloseBraceToken:
                case SyntaxKind.OpenParenToken:
                case SyntaxKind.CloseParenToken:
                case SyntaxKind.OpenBracketToken:
                case SyntaxKind.CloseBracketToken:
                    // the current token is a bracket, check if the current position is separated from it by a new line
                    if (position < token.start()) {
                        var text = sourceText.getText(position, token.start());
                        for(var i = 0; i< text.length; i++){
                            if (CharacterInfo.isLineTerminator(text.charCodeAt(i))) {
                                return false;
                            }    
                        }
                    }
                    return true;
            }
            return false;
        }

        private static isInContainerNode(parent: ISyntaxElement, element: ISyntaxElement): bool {
            switch (parent.kind()) {
                case SyntaxKind.ClassDeclaration:
                case SyntaxKind.ModuleDeclaration:
                case SyntaxKind.EnumDeclaration:
                case SyntaxKind.ImportDeclaration:
                case SyntaxKind.Block:
                case SyntaxKind.SwitchStatement:
                case SyntaxKind.CaseSwitchClause:
                case SyntaxKind.DefaultSwitchClause:
                    return true;

                case SyntaxKind.ObjectType:
                    return true;

                case SyntaxKind.InterfaceDeclaration:
                    return element.kind() !== SyntaxKind.ObjectType;

                case SyntaxKind.FunctionDeclaration:
                case SyntaxKind.MemberFunctionDeclaration:
                case SyntaxKind.GetMemberAccessorDeclaration:
                case SyntaxKind.SetMemberAccessorDeclaration:
                case SyntaxKind.GetAccessorPropertyAssignment:
                case SyntaxKind.SetAccessorPropertyAssignment:
                case SyntaxKind.FunctionExpression:
                case SyntaxKind.CatchClause:
                case SyntaxKind.FinallyClause:
                case SyntaxKind.FunctionDeclaration:
                case SyntaxKind.ConstructorDeclaration:
                case SyntaxKind.ForStatement:
                case SyntaxKind.ForInStatement:
                case SyntaxKind.WhileStatement:
                case SyntaxKind.DoStatement:
                case SyntaxKind.WithStatement:
                case SyntaxKind.IfStatement:
                case SyntaxKind.ElseClause:
                    // The block has already been conted before, ignore the container node
                    return element.kind() !== SyntaxKind.Block;

                case SyntaxKind.TryStatement:
                    // If inside the try body, the block element will take care of the indentation
                    // If not, we do not want to indent, as the next token would probally be catch or finally
                    // and we want these on the same indentation level.
                    return false;
                default:
                    return parent.isNode() && (<SyntaxNode>parent).isStatement();
            }
        }

        private static getCustomListIndentation(list: ISyntaxElement, element: ISyntaxElement): number {
            switch (list.kind()) {
                case SyntaxKind.SeparatedList:
                    // If it is the first in the list, let it have its parents indentation; no custom indentation here.
                    for (var i = 0, n = list.childCount(); i < n ; i++) {
                        var child = list.childAt(i);
                        if (child !== null && child === element)
                            return Indenter.getListItemIndentation(list, i - 1);
                    }
                    break;

                case SyntaxKind.ArgumentList:
                    // The separated list has been handled in the previous case, this is just if we are after
                    // the last element of the list, we want to get the indentation of the last element of the list
                    var argumentList = <ArgumentListSyntax> list;
                    var arguments = argumentList.arguments;
                    if (arguments !== null && argumentList.closeParenToken === element) {
                        return Indenter.getListItemIndentation(arguments, arguments.childCount() - 1);
                    }
                    break;

                case SyntaxKind.ParameterList:
                    // The separated list has been handled in the previous case, this is just if we are after
                    // the last element of the list, we want to get the indentation of the last element of the list
                    var parameterList = <ParameterListSyntax> list;
                    var parameters = parameterList.parameters;
                    if (parameters !== null && parameterList.closeParenToken === element) {
                        return Indenter.getListItemIndentation(parameters, parameters.childCount() - 1);
                    }
                    break;

                case SyntaxKind.TypeArgumentList:
                    // The separated list has been handled in the previous case, this is just if we are after
                    // the last element of the list, we want to get the indentation of the last element of the list
                    var typeArgumentList = <TypeArgumentListSyntax> list;
                    var typeArguments = typeArgumentList.typeArguments;
                    if (typeArguments !== null && typeArgumentList.greaterThanToken === element) {
                        return Indenter.getListItemIndentation(typeArguments, typeArguments.childCount() - 1);
                    }
                    break;

                case SyntaxKind.TypeParameterList:
                    // The separated list has been handled in the previous case, this is just if we are after
                    // the last element of the list, we want to get the indentation of the last element of the list
                    var typeParameterList = <TypeParameterListSyntax> list;
                    var typeParameters = typeParameterList.typeParameters;
                    if (typeParameters !== null && typeParameterList.greaterThanToken === element) {
                        return Indenter.getListItemIndentation(typeParameters, typeParameters.childCount() - 1);
                    }
                    break;
            }
            return -1;
        }

        private static getListItemIndentation(list: ISyntaxElement, elementIndex: number): number {
            for (var i = elementIndex; i > 0 ; i--) {
                var child = list.childAt(i);
                var previousChild = list.childAt(i - 1);
                if ((child !== null && child.leadingTrivia().hasNewLine()) ||
                    (previousChild !== null && previousChild.trailingTrivia().hasNewLine())) {

                    // TODO: get the trivia after new line
                    return child.leadingTriviaWidth();
                }
            }
            return -1;
        }
    }
}
