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
        public find(p: (rn: any) => boolean) {
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

        public remove(p: (item: any) => boolean) {
            var node = this.head;
            var prev: IListItem = null;
            var next: IListItem = null;

            while (node) {

                if (p(node.value)) {

                    if (node === this.head) {

                        if (this.last === this.head) {
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

                        if (node === this.last) {
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
}