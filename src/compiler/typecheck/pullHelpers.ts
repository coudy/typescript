// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {

    export module PullHelpers {
        export interface SignatureInfoForFuncDecl {
            signature: PullSignatureSymbol;
            allSignatures: PullSignatureSymbol[];
        }

        export function getSignatureForFuncDecl(funcDecl: FunctionDeclaration, semanticInfo: SemanticInfo) {
            var funcSymbol = semanticInfo.getSymbolAndDiagnosticsForAST(funcDecl).symbol;
            var functionDecl = semanticInfo.getDeclForAST(funcDecl);
            var functionSignature: PullSignatureSymbol = null;
            var typeSymbolWithAllSignatures: PullTypeSymbol = null;
            if (funcSymbol.isSignature()) {
                functionSignature = <PullSignatureSymbol>funcSymbol;
                var parent = functionDecl.getParentDecl();
                typeSymbolWithAllSignatures = parent.getSymbol().getType();                
            } else {
                functionSignature = functionDecl.getSignatureSymbol();
                typeSymbolWithAllSignatures = funcSymbol.getType();
            }
            var signatures: PullSignatureSymbol[];
            if (funcDecl.isConstructor || funcDecl.isConstructMember()) {
                signatures = typeSymbolWithAllSignatures.getConstructSignatures();
            } else if (funcDecl.isIndexerMember()) {
                signatures = typeSymbolWithAllSignatures.getIndexSignatures();
            } else {
                signatures = typeSymbolWithAllSignatures.getCallSignatures();
            }
            return {
                signature: functionSignature,
                allSignatures: signatures
            };
        }

        export function getAccessorSymbol(getterOrSetter: FunctionDeclaration, semanticInfoChain: SemanticInfoChain, unitPath: string) {
            var getterOrSetterSymbol = semanticInfoChain.getSymbolAndDiagnosticsForAST(getterOrSetter, unitPath).symbol;
            var linkKind: SymbolLinkKind;
            if (hasFlag(getterOrSetter.getFunctionFlags(), FunctionFlags.GetAccessor)) {
                linkKind = SymbolLinkKind.GetterFunction;
            } else {
                linkKind = SymbolLinkKind.SetterFunction;
            }

            var accessorSymbolLinks = getterOrSetterSymbol.findIncomingLinks((psl) => psl.kind === linkKind);
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

        export function symbolIsEnum(source: PullSymbol) {
            return source && ((source.getKind() & (PullElementKind.Enum | PullElementKind.EnumMember)) || source.hasFlag(PullElementFlags.InitializedEnum));
        }
    }
}