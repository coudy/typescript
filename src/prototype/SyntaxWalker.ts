///<reference path='ISyntaxToken.ts' />

class SyntaxWalker {
    public visitElement(element) {
        if (element.isToken()) {
            this.visitToken(<ISyntaxToken>element);
        }
        else if (element.isNode()) {
            this.visitNode(<SyntaxNode>element);
        }
        else if (element.isList()) {
            this.visitList(element);
        }
        else if (element.isSeparatedList()) {
            this.visitSeparatedList(element);
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    public visitToken(token: ISyntaxToken): void {
    }

    public visitNode(node: SyntaxNode): void {
        for (var i = 0, n = node.slotCount(); i < n; i++) {
            var element = node.elementAtSlot(i);
            
            if (element !== null) {
                this.visitElement(element);
            }
        }
    }

    public visitList(list: ISyntaxList): void {
        for (var i = 0, n = list.count(); i < n; i++) {
            this.visitElement(list.itemAt(i));
        }
    }

    public visitSeparatedList(list: ISeparatedSyntaxList): void {
        for (var i = 0, n = list.itemAndSeparatorCount(); i < n; i++) {
            var item = list.itemOrSeparatorAt(i);
            this.visitElement(item);
        }
    }
}