// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export enum PullDeclEdit {
        NoChanges,
        DeclAdded,
        DeclRemoved,
        DeclChanged,
    }

    export class PullDeclDiff {
        constructor(public oldDecl: PullDecl, public newDecl: PullDecl, public kind: PullDeclEdit) {
        }
    }

    export class PullDeclDiffer {
        private differences: PullDeclDiff[] = [];

        constructor(private oldSemanticInfo: SemanticInfo,
                    private newSemanticInfo: SemanticInfo) {
        }

        public static diffDecls(oldDecl: PullDecl,
                                oldSemanticInfo: SemanticInfo,
                                newDecl: PullDecl,
                                newSemanticInfo: SemanticInfo): PullDeclDiff[]{
            var declDiffer = new PullDeclDiffer(oldSemanticInfo, newSemanticInfo);
            declDiffer.diff(oldDecl, newDecl);
            return declDiffer.differences;
        }

        // For now, just check for there/not there - we'll invalidate the inference symbols anyway
        // next up, we'll want to use this data to find the decl that changed
        private diff(oldDecl: PullDecl, newDecl: PullDecl): void {
            Debug.assert(oldDecl.getName() === newDecl.getName());
            Debug.assert(oldDecl.getKind() === newDecl.getKind());

            var oldAST = this.oldSemanticInfo.getASTForDecl(oldDecl);
            var newAST = this.newSemanticInfo.getASTForDecl(newDecl);
            Debug.assert(oldAST !== undefined);
            Debug.assert(newAST !== undefined);

            // If the AST's are the same, then there's nothing we need to do.
            if (oldAST === newAST) {
                return;
            }

            // Not the same ast, walk this decl and find all the differences.
            this.diff1(oldDecl, newDecl, oldAST, newAST, oldDecl.childDeclTypeCache, newDecl.childDeclTypeCache);
            this.diff1(oldDecl, newDecl, oldAST, newAST, oldDecl.childDeclTypeParameterCache, newDecl.childDeclTypeParameterCache);
            this.diff1(oldDecl, newDecl, oldAST, newAST, oldDecl.childDeclValueCache, newDecl.childDeclValueCache);
        }

        private static emptyDeclArray: PullDecl[] = [];

        private diff1(oldDecl: PullDecl,
                      newDecl: PullDecl,
                      oldAST: AST,
                      newAST: AST,
                      oldNameToDecls: any,
                      newNameToDecls: any): void {
            var i = 0;
            var n = 0;
            var oldChildrenOfName: PullDecl[];
            var newChildrenOfName: PullDecl[];
            var oldChild: PullDecl;
            var newChild: PullDecl;
            var name: string;

            // The old decl and new decl have names mapping to lists of children with that name.  
            // For each name we can have the following cases:
            //
            //      name -> [oldDeclChild1,      ...,           oldDeclChild_n]
            //      name -> [newDeclChild1, ..., newDeclChild_j]
            //
            //  or
            //
            //      name -> [oldDeclChild1, ..., oldDeclChild_n]
            //      name -> [newDeclChild1, ..., newDeclChild_j]
            //
            //  or
            //
            //      name -> [oldDeclChild1, ..., oldDeclChild_n]
            //      name -> [newDeclChild1,      ...,           newDeclChild_j]
            //
            //
            // i.e. n > j, n == j, n < j.
            //
            // For the first case, we we check all the child decls from 0 to j in the old list and 
            // the new list.  Anything past j is a decl we've removed.
            //
            // For the last case, we check all the child decls from 0 to n in the old list and the
            // new list.  Anything past that is an added decl.

            // We have to iterate over both collections as each may have names the other does not
            // know about.  
            //
            // First, use the names the old decl knows about. 
            for (name in oldNameToDecls) {
                oldChildrenOfName = oldNameToDecls[name] || PullDeclDiffer.emptyDeclArray;
                newChildrenOfName = newNameToDecls[name] || PullDeclDiffer.emptyDeclArray;

                for (i = 0, n = oldChildrenOfName.length; i < n; i++) {
                    oldChild = oldChildrenOfName[i];

                    if (i < newChildrenOfName.length) {
                        // Both the old decl and new decl have a child of this name.  If they're
                        // the same type, check them for differences.  Otherwise, consider this
                        // a remove/add.
                        newChild = newChildrenOfName[i];

                        if (oldChild.getKind() === newChild.getKind()) {
                            this.diff(oldChild, newChildrenOfName[i]);
                        }
                        else {
                            this.differences.push(new PullDeclDiff(oldChild, null, PullDeclEdit.DeclRemoved));
                            this.differences.push(new PullDeclDiff(oldDecl, newChild, PullDeclEdit.DeclAdded));
                        }
                    }
                    else {
                        // Child was removed.
                        this.differences.push(new PullDeclDiff(oldChild, null, PullDeclEdit.DeclRemoved));
                    }
                }
            }

            // Now use the names the new decl knows about.  
            for (name in newNameToDecls) {
                oldChildrenOfName = oldNameToDecls[name] || PullDeclDiffer.emptyDeclArray;
                newChildrenOfName = newNameToDecls[name] || PullDeclDiffer.emptyDeclArray;

                // If the old decl also knew about this name, then we would have taken care of this 
                // name in the loop above.  So, start iterating *after* all the children of the 
                // old decl.  
                for (i = oldChildrenOfName.length, n = newChildrenOfName.length; i < n; i++) {
                    newChild = newChildrenOfName[i];
                    this.differences.push(new PullDeclDiff(oldDecl, newChild, PullDeclEdit.DeclAdded));
                }
            }

            if (!this.isEquivalent(oldAST, newAST)) {
                this.differences.push(new PullDeclDiff(oldDecl, newDecl, PullDeclEdit.DeclChanged));
            }
        }

        private isEquivalent(oldAST: AST, newAST: AST): bool {
            Debug.assert(oldAST !== null);
            Debug.assert(newAST !== null);
            Debug.assert(oldAST !== newAST);

            //if (oldAST === undefined || newAST === undefined) {
            //    Debug.assert(oldAST === newAST);
            //    return true;
            //}

            if (oldAST.nodeType !== newAST.nodeType ||
                oldAST.getFlags() !== newAST.getFlags()) {
                return false;
            }

            switch (oldAST.nodeType) {
                case NodeType.ImportDeclaration:
                    return this.importDeclarationIsEquivalent(<ImportDeclaration>oldAST, <ImportDeclaration>newAST);
                case NodeType.ModuleDeclaration:
                    return this.moduleDeclarationIsEquivalent(<ModuleDeclaration>oldAST, <ModuleDeclaration>newAST);
                case NodeType.ClassDeclaration:
                    return this.classDeclarationIsEquivalent(<ClassDeclaration>oldAST, <ClassDeclaration>newAST);
                case NodeType.InterfaceDeclaration:
                    return this.interfaceDeclarationIsEquivalent(<InterfaceDeclaration>oldAST, <InterfaceDeclaration>newAST);
                case NodeType.ArgDecl:
                    return this.argumentDeclarationIsEquivalent(<ArgDecl>oldAST, <ArgDecl>newAST);
                case NodeType.VarDecl:
                    return this.variableDeclarationIsEquivalent(<VarDecl>oldAST, <VarDecl>newAST);
                case NodeType.TypeParameter:
                    return this.typeParameterIsEquivalent(<TypeParameter>oldAST, <TypeParameter>newAST);
                case NodeType.FuncDecl:
                    return this.functionDeclarationIsEquivalent(<FuncDecl>oldAST, <FuncDecl>newAST);
                case NodeType.Script:
                    return this.scriptIsEquivalent(<Script>oldAST, <Script>newAST);
                default:
                    throw Errors.invalidOperation();
            }
        }

        private importDeclarationIsEquivalent(decl1: ImportDeclaration, decl2: ImportDeclaration): bool {
            return structuralEqualsNotIncludingPosition(decl1.alias, decl2.alias);
        }

        private typeDeclarationIsEquivalent(decl1: TypeDeclaration, decl2: TypeDeclaration): bool {
            return decl1.getVarFlags() === decl2.getVarFlags() &&
                   structuralEqualsNotIncludingPosition(decl1.typeParameters, decl2.typeParameters) &&
                   structuralEqualsNotIncludingPosition(decl1.extendsList, decl2.extendsList) &&
                   structuralEqualsNotIncludingPosition(decl1.implementsList, decl2.implementsList);
        }

        private classDeclarationIsEquivalent(decl1: ClassDeclaration, decl2: ClassDeclaration): bool {
            return this.typeDeclarationIsEquivalent(decl1, decl2);
        }

        private interfaceDeclarationIsEquivalent(decl1: InterfaceDeclaration, decl2: InterfaceDeclaration): bool {
            return this.typeDeclarationIsEquivalent(decl1, decl2);
        }

        private typeParameterIsEquivalent(decl1: TypeParameter, decl2: TypeParameter): bool {
            return structuralEqualsNotIncludingPosition(decl1.constraint, decl2.constraint);
        }

        private boundDeclarationIsEquivalent(decl1: BoundDecl, decl2: BoundDecl): bool {
            if (decl1.getVarFlags() === decl2.getVarFlags() &&
                structuralEqualsNotIncludingPosition(decl1.typeExpr, decl2.typeExpr)) {

                // So far they're structurally equivalent.  However, in teh case where the decls 
                // don't have a specified type annotation, we have to look further.  Specifically,
                // we have to check if the initializers are the same as well. If they're not, 
                // then the type of the decl may have changed.
                if (decl1.typeExpr === null) {
                    return structuralEqualsNotIncludingPosition(decl1.init, decl2.init);
                }
                else {
                    return true;
                }
            }

            return false;
        }

        private argumentDeclarationIsEquivalent(decl1: ArgDecl, decl2: ArgDecl): bool {
            return this.boundDeclarationIsEquivalent(decl1, decl2) &&
                   decl1.isOptional === decl2.isOptional;
        }

        private variableDeclarationIsEquivalent(decl1: VarDecl, decl2: VarDecl): bool {
            return this.boundDeclarationIsEquivalent(decl1, decl2);
        }

        private baseFunctionDeclarationIsEquivalent(decl1: FuncDecl, decl2: FuncDecl, ignoreReturnType: bool): bool {
            if (decl1.hint === decl2.hint &&
                decl1.getFunctionFlags() === decl2.getFunctionFlags() &&
                decl1.variableArgList === decl2.variableArgList &&
                decl1.isConstructor === decl2.isConstructor &&
                structuralEqualsNotIncludingPosition(decl1.returnTypeAnnotation, decl2.returnTypeAnnotation) &&
                structuralEqualsNotIncludingPosition(decl1.typeArguments, decl2.typeArguments) &&
                structuralEqualsNotIncludingPosition(decl1.arguments, decl2.arguments)) {

                // So far they're structurally equivalent.  However, in teh case where the 
                // functions don't have a specified return type annotation, we have to look
                // further.  Specifically, we have to check if the bodies are the same as well.
                // If they're not, then the return type of the function may have changed.
                if (!ignoreReturnType && decl1.returnTypeAnnotation === null) {
                    return structuralEqualsNotIncludingPosition(decl1.bod, decl2.bod);
                }
                else {
                    return true;
                }
            }

            return false;
        }

        private functionDeclarationIsEquivalent(decl1: FuncDecl, decl2: FuncDecl): bool {
            return this.baseFunctionDeclarationIsEquivalent(decl1, decl2, /*ignoreReturnType:*/ false);
        }

        private scriptIsEquivalent(decl1: Script, decl2: Script): bool {
            // TODO: should we check Script.referencedFiles here?  I don't think we need to.  
            // After all, if that changes, then the LS will just tear us down and start over again,
            // so we won't be comparing decls anyways.
            return this.baseFunctionDeclarationIsEquivalent(decl1, decl2, /*ignoreReturnType:*/ true);
        }

        private moduleDeclarationIsEquivalent(decl1: ModuleDeclaration, decl2: ModuleDeclaration): bool {
            return decl1.getModuleFlags() === decl2.getModuleFlags() &&
                   decl2.prettyName === decl2.prettyName &&
                   ArrayUtilities.sequenceEquals(decl1.amdDependencies, decl2.amdDependencies, StringUtilities.stringEquals);
        }
    }
}