// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />
///<reference path='..\Core\HashTable.ts' />
///<reference path='..\Syntax\ISyntaxElement.ts' />

module TypeScript {

    export module PullHelpers {
        export interface SignatureInfoForFuncDecl {
            signature: PullSignatureSymbol;
            allSignatures: PullSignatureSymbol[];
        }

        export function getSignatureForFuncDecl(funcDecl: FunctionDeclaration, semanticInfoChain: SemanticInfoChain, unitPath: string) {
            var funcSymbol = semanticInfoChain.getSymbolForAST(funcDecl, unitPath);
            var result: SignatureInfoForFuncDecl = { signature: null, allSignatures: null };
            if (funcSymbol.isSignature()) {
                result.signature = <PullSignatureSymbol>funcSymbol;
                result.allSignatures = [<PullSignatureSymbol>funcSymbol];
                return result;
            }
            var funcTypeSymbol = funcSymbol.getType();
            var signatures: PullSignatureSymbol[];
            if (funcDecl.isConstructor || funcDecl.isConstructMember()) {
                signatures = funcTypeSymbol.getConstructSignatures();
            } else if (funcDecl.isIndexerMember()) {
                signatures = funcTypeSymbol.getIndexSignatures();
            } else {
                signatures = funcTypeSymbol.getCallSignatures();
            }
            for (var i = 0; i < signatures.length; i++) {
                var signatureDecl = signatures[i].getDeclarations()[0];
                var signatureAST = semanticInfoChain.getASTForDecl(signatureDecl);
                if (signatureAST == funcDecl) {
                    result.signature = signatures[i];
                    result.allSignatures = signatures;
                    return result;
                }
            }

            return null;
        }

        export function getAccessorSymbol(getterOrSetter: FunctionDeclaration, semanticInfoChain: SemanticInfoChain, unitPath: string) {
            var getterOrSetterSymbol = semanticInfoChain.getSymbolForAST(getterOrSetter, unitPath);
            var linkKind: SymbolLinkKind;
            if (hasFlag(getterOrSetter.getFunctionFlags(), FunctionFlags.GetAccessor)) {
                linkKind = SymbolLinkKind.GetterFunction;
            } else {
                linkKind = SymbolLinkKind.SetterFunction;
            }

            var accessorSymbolLinks = getterOrSetterSymbol.findIncomingLinks((psl) => psl.kind == linkKind);
            if (accessorSymbolLinks.length) {
                return <PullAccessorSymbol>accessorSymbolLinks[0].start;
            }

            return null;
        }

        export function getGetterAndSetterFunction(funcDecl: FunctionDeclaration, semanticInfoChain: SemanticInfoChain, unitPath: string): { getter: FunctionDeclaration; setter: FunctionDeclaration; } {
            var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, semanticInfoChain, unitPath);
            var result: { getter: FunctionDeclaration; setter: FunctionDeclaration; } = {
                getter: null,
                setter: null
            };
            var getter = accessorSymbol.getGetter();
            if (getter) {
                var getterDecl = getter.getDeclarations()[0];
                result.getter = <FunctionDeclaration>semanticInfoChain.getASTForDecl(getterDecl);
            }
            var setter = accessorSymbol.getSetter();
            if (setter) {
                var setterDecl = setter.getDeclarations()[0];
                result.setter = <FunctionDeclaration>semanticInfoChain.getASTForDecl(setterDecl);
            }

            return result;
        }
    }
}