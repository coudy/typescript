export class Collection<TItem extends CollectionItem> {
    _itemsByKey: { [key: string]: TItem; };
}

export class List extends Collection<ListItem>{
    Bar() {
        // BUG 712326
        //var oldItem: ListItem = this._itemsByKey[""];
    }
}

export class CollectionItem {}

export class ListItem extends CollectionItem {
    __isNew: boolean;
}
