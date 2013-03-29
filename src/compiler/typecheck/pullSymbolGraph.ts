// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.

///<reference path='..\typescript.ts' />

module TypeScript {
    export var linkID = 0; // PULLTODO: Prune these if not in use

    export class IListItem {
        public next: IListItem = null;
        public prev: IListItem = null;

        constructor(public value: any) { }
    }

    export class LinkList {
        public head: IListItem = null;
        public last: IListItem = null;
        public length = 0;

        public addItem(item: any) {
            if (!this.head) {
                this.head = new IListItem(item);
                this.last = this.head;
            }
            else {
                this.last.next = new IListItem(item);
                this.last.next.prev = this.last;
                this.last = this.last.next;
            }

            this.length++;
        }

        // PULLTODO: Register callbacks for caching
        public find(p: (rn: any) => bool) {
            var node = this.head;
            var vals: any[] = [];

            while (node) {

                if (p(node.value)) {
                    vals[vals.length] = node.value;
                }
                node = node.next;
            }

            return vals;
        }

        public remove(p: (item: any) => bool) {
            var node = this.head;
            var prev: IListItem = null;
            var next: IListItem = null;

            while (node) {

                if (p(node.value)) {

                    if (node == this.head) {

                        if (this.last == this.head) {
                            this.last = null;
                        }

                        this.head = this.head.next;

                        if (this.head) {
                            this.head.prev = null;
                        }
                    }
                    else {
                        prev = node.prev;
                        next = node.next;

                        if (prev) {
                            prev.next = next;
                        }
                        if (next) {
                            next.prev = prev;
                        }

                        if (node == this.last) {
                            this.last = prev;
                        }
                    }

                    this.length--;
                }
                node = node.next;
            }
        }

        public update(map: (item: any, context: any) => void , context: any) {
            var node = this.head;

            while (node) {
                map(node.value, context);

                node = node.next;
            }
        }
    }

    export class PullSymbolLink {
        public id = linkID++;
        public data: any;
        constructor(public start: PullSymbol, public end: PullSymbol, public kind: SymbolLinkKind) { }
    }

    export enum GraphUpdateKind {
        NoUpdate,

        SymbolRemoved,
        SymbolAdded,

        TypeChanged,
    }

    export class PullSymbolUpdate {

        constructor(public updateKind: GraphUpdateKind, public symbolToUpdate: PullSymbol, public updater: PullSymbolGraphUpdater) { }

    }

    export var updateVersion = 0;

    export class PullSymbolGraphUpdater {

        constructor(public semanticInfoChain: SemanticInfoChain) { }

        public removeDecl(declToRemove: PullDecl) {
            var declSymbol = declToRemove.getSymbol();

            if (declSymbol) {
                declSymbol.removeDeclaration(declToRemove);

                var decls = declSymbol.getDeclarations();

                if (!decls.length) {
                    this.removeSymbol(declSymbol);
                }
                else {
                    var childDecls = declToRemove.getChildDecls();

                    for (var i = 0; i < childDecls.length; i++) {
                        this.removeDecl(childDecls[i]);
                    }
                }

                this.semanticInfoChain.removeSymbolFromCache(declSymbol);
            }

            // if we're removing a class, enum, etc., remove the implicit
            // value decl as well
            var valDecl = declToRemove.getValueDecl();

            if (valDecl) {
                this.removeDecl(valDecl);
            }

            updateVersion++;
        }

        public addDecl(declToAdd: PullDecl) {
            // the decl has been bound to a symbol already, so we just need to trigger an update

            var symbolToAdd = declToAdd.getSymbol();

            this.addSymbol(symbolToAdd);

            updateVersion++;
        }

        // for now, remove all links - later on, see what happens if we leave stuff 'dangling'
        public removeSymbol(symbolToRemove: PullSymbol) {

            if (symbolToRemove.removeUpdateVersion == updateVersion) {
                return;
            }

            symbolToRemove.removeUpdateVersion = updateVersion;

            symbolToRemove.updateOutgoingLinks(propagateRemovalToOutgoingLinks, new PullSymbolUpdate(GraphUpdateKind.SymbolRemoved, symbolToRemove, this));

            symbolToRemove.updateIncomingLinks(propagateRemovalToIncomingLinks, new PullSymbolUpdate(GraphUpdateKind.SymbolRemoved, symbolToRemove, this));

            symbolToRemove.unsetContainer();

            this.semanticInfoChain.removeSymbolFromCache(symbolToRemove);

            var container = symbolToRemove.getContainer();

            if (container) {
                container.removeMember(symbolToRemove);
                this.semanticInfoChain.removeSymbolFromCache(symbolToRemove);
            }

            if (symbolToRemove.isAccessor()) {
                var getterSymbol = (<PullAccessorSymbol>symbolToRemove).getGetter();
                var setterSymbol = (<PullAccessorSymbol>symbolToRemove).getSetter();

                if (getterSymbol) {
                    this.removeSymbol(getterSymbol);
                }

                if (setterSymbol) {
                    this.removeSymbol(setterSymbol);
                }
            }

            symbolToRemove.removeAllLinks();
        }

        public addSymbol(symbolToAdd: PullSymbol) {

            if (symbolToAdd.addUpdateVersion == updateVersion) {
                return;
            }

            symbolToAdd.addUpdateVersion = updateVersion;

            symbolToAdd.updateOutgoingLinks(propagateAdditionToOutgoingLinks, new PullSymbolUpdate(GraphUpdateKind.SymbolAdded, symbolToAdd, this));

            symbolToAdd.updateIncomingLinks(propagateAdditionToIncomingLinks, new PullSymbolUpdate(GraphUpdateKind.SymbolAdded, symbolToAdd, this));

        }

        public invalidateType(symbolWhoseTypeChanged: PullSymbol) {
            if (!symbolWhoseTypeChanged) {
                return;
            }

            if (symbolWhoseTypeChanged.isPrimitive()) {
                return;
            }

            if (symbolWhoseTypeChanged.typeChangeUpdateVersion == updateVersion) {
                return;
            }

            symbolWhoseTypeChanged.typeChangeUpdateVersion = updateVersion;

            symbolWhoseTypeChanged.updateOutgoingLinks(propagateChangedTypeToOutgoingLinks, new PullSymbolUpdate(GraphUpdateKind.TypeChanged, symbolWhoseTypeChanged, this));

            symbolWhoseTypeChanged.updateIncomingLinks(propagateChangedTypeToIncomingLinks, new PullSymbolUpdate(GraphUpdateKind.TypeChanged, symbolWhoseTypeChanged, this));

            symbolWhoseTypeChanged.invalidate();

        }
    }

    export function propagateRemovalToOutgoingLinks(link: PullSymbolLink, update: PullSymbolUpdate) {

        var symbolToRemove = update.symbolToUpdate;
        var affectedSymbol = link.end;

        // carry out the update based on the update kind, the affected symbol kind and the relationship
        if (link.kind == SymbolLinkKind.TypedAs) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.ContextuallyTypedAs) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.ProvidesInferredType) {

            // if another type infers its type from this one, unset the link
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameter) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.TypeArgument) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.TypeParameterSpecializedTo) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.SpecializedTo) {
            update.updater.removeSymbol(affectedSymbol);
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeConstraint) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.ArrayOf) {

            // shouldn't affect the other type - we'd remove the parent type as an
            // incoming link
        }
        else if (link.kind == SymbolLinkKind.PublicMember) {
            update.updater.removeSymbol(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PrivateMember) {
            update.updater.removeSymbol(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ConstructorMethod) {
            //update.updater.removeSymbol(affectedSymbol);
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Aliases) {
            // PULLTODO
        }
        else if (link.kind == SymbolLinkKind.ContainedBy) {
            (<PullTypeSymbol>affectedSymbol).removeMember(symbolToRemove);
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Extends) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.Implements) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.Parameter) {
            update.updater.removeSymbol(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ReturnType) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.CallSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ConstructSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.IndexSignature) {
            update.updater.invalidateType(affectedSymbol);
        }

        symbolToRemove.removeOutgoingLink(link);
    }

    export function propagateRemovalToIncomingLinks(link: PullSymbolLink, update: PullSymbolUpdate) {
        var symbolToRemove = update.symbolToUpdate;
        var affectedSymbol = link.start;

        // carry out the update based on the update kind, the affected symbol kind and the relationship
        if (link.kind == SymbolLinkKind.TypedAs) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ContextuallyTypedAs) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ProvidesInferredType) {
            // no action...
        }
        else if (link.kind == SymbolLinkKind.TypeParameter) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeArgument) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameterSpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.SpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeConstraint) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayType) {
            update.updater.removeSymbol(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayOf) {
            update.updater.removeSymbol(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PublicMember) {
            (<PullTypeSymbol>affectedSymbol).removeMember(symbolToRemove);
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PrivateMember) {
            (<PullTypeSymbol>affectedSymbol).removeMember(symbolToRemove);
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ConstructorMethod) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Aliases) {
            // PULLTODO
        }
        else if (link.kind == SymbolLinkKind.ContainedBy) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Extends) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Implements) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Parameter) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ReturnType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.CallSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ConstructSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.IndexSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
    }

    export function propagateAdditionToOutgoingLinks(link: PullSymbolLink, update: PullSymbolUpdate) {

        var symbolToAdd = update.symbolToUpdate;
        var affectedSymbol = link.end;

        // carry out the update based on the update kind, the affected symbol kind and the relationship
        if (link.kind == SymbolLinkKind.TypedAs) {
        }
        else if (link.kind == SymbolLinkKind.ContextuallyTypedAs) {
        }
        else if (link.kind == SymbolLinkKind.ProvidesInferredType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameter) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeArgument) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameterSpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.SpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeConstraint) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayOf) {
            // how could this happen?
            //update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PublicMember) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PrivateMember) {
            // Don't invalidate the type in this case - we only care about
            // public properties
        }
        else if (link.kind == SymbolLinkKind.ConstructorMethod) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Aliases) {
            // PULLTODO
        }
        else if (link.kind == SymbolLinkKind.ContainedBy) {
            // Don't invalidate the type in this case - we only care about
            // public properties
        }
        else if (link.kind == SymbolLinkKind.Extends) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Implements) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Parameter) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ReturnType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.CallSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ConstructSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.IndexSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
    }

    export function propagateAdditionToIncomingLinks(link: PullSymbolLink, update: PullSymbolUpdate) {
        var symbolToAdd = update.symbolToUpdate;
        var affectedSymbol = link.start;

        // carry out the update based on the update kind, the affected symbol kind and the relationship
        if (link.kind == SymbolLinkKind.TypedAs) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ContextuallyTypedAs) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ProvidesInferredType) {
            //update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameter) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeArgument) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameterSpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.SpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeConstraint) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayOf) {
            // shouldn't change anything...
        }
        else if (link.kind == SymbolLinkKind.PublicMember) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PrivateMember) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ConstructorMethod) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Aliases) {
            // PULLTODO
        }
        else if (link.kind == SymbolLinkKind.ContainedBy) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Extends) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Implements) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Parameter) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ReturnType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.CallSignature) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ConstructSignature) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.IndexSignature) {
            // do nothing...
        }
    }

    export function propagateChangedTypeToOutgoingLinks(link: PullSymbolLink, update: PullSymbolUpdate) {
        var symbolWhoseTypeChanged = update.symbolToUpdate;
        var affectedSymbol = link.end;

        // carry out the update based on the update kind, the affected symbol kind and the relationship
        if (link.kind == SymbolLinkKind.TypedAs) {
            //update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ContextuallyTypedAs) {
            //update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ProvidesInferredType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameter) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeArgument) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameterSpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.SpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeConstraint) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayOf) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.PublicMember) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PrivateMember) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ConstructorMethod) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Aliases) {
            // PULLTODO
        }
        else if (link.kind == SymbolLinkKind.ContainedBy) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Extends) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Implements) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Parameter) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ReturnType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.CallSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ConstructSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.IndexSignature) {
            update.updater.invalidateType(affectedSymbol);
        }
    }

    export function propagateChangedTypeToIncomingLinks(link: PullSymbolLink, update: PullSymbolUpdate) {
        var symbolWhoseTypeChanged = update.symbolToUpdate;
        var affectedSymbol = link.start;

        // carry out the update based on the update kind, the affected symbol kind and the relationship
        if (link.kind == SymbolLinkKind.TypedAs) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ContextuallyTypedAs) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ProvidesInferredType) {
            //update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameter) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeArgument) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeParameterSpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.SpecializedTo) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.TypeConstraint) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.ArrayOf) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.PublicMember) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.PrivateMember) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ConstructorMethod) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Aliases) {
            // PULLTODO
        }
        else if (link.kind == SymbolLinkKind.ContainedBy) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.Extends) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Implements) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.Parameter) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ReturnType) {
            update.updater.invalidateType(affectedSymbol);
        }
        else if (link.kind == SymbolLinkKind.CallSignature) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.ConstructSignature) {
            // do nothing...
        }
        else if (link.kind == SymbolLinkKind.IndexSignature) {
            // do nothing...
        }
    }
}