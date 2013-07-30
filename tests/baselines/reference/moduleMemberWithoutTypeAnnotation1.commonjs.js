var TypeScript;
(function (TypeScript) {
    (function (Parser) {
        var SyntaxCursor = (function () {
            function SyntaxCursor() {
            }
            SyntaxCursor.prototype.currentNode = function () {
                return null;
            };
            return SyntaxCursor;
        })();
    })(TypeScript.Parser || (TypeScript.Parser = {}));
    var Parser = TypeScript.Parser;
})(TypeScript || (TypeScript = {}));

var TypeScript;
(function (TypeScript) {
    ;
    ;

    var PositionedElement = (function () {
        function PositionedElement() {
        }
        PositionedElement.prototype.childIndex = function (child) {
            return TypeScript.Syntax.childIndex();
        };
        return PositionedElement;
    })();
    TypeScript.PositionedElement = PositionedElement;

    var PositionedToken = (function () {
        function PositionedToken(parent, token, fullStart) {
        }
        return PositionedToken;
    })();
    TypeScript.PositionedToken = PositionedToken;
})(TypeScript || (TypeScript = {}));

var TypeScript;
(function (TypeScript) {
    var SyntaxNode = (function () {
        function SyntaxNode() {
        }
        SyntaxNode.prototype.findToken = function (position, includeSkippedTokens) {
            if (typeof includeSkippedTokens === "undefined") { includeSkippedTokens = false; }
            var positionedToken = this.findTokenInternal(null, position, 0);
            return null;
        };
        SyntaxNode.prototype.findTokenInternal = function (x, y, z) {
            return null;
        };
        return SyntaxNode;
    })();
    TypeScript.SyntaxNode = SyntaxNode;
})(TypeScript || (TypeScript = {}));

var TypeScript;
(function (TypeScript) {
    (function (Syntax) {
        function childIndex() {
        }
        Syntax.childIndex = childIndex;

        var VariableWidthTokenWithTrailingTrivia = (function () {
            function VariableWidthTokenWithTrailingTrivia() {
            }
            VariableWidthTokenWithTrailingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
                return new TypeScript.PositionedToken(parent, this, fullStart);
            };
            return VariableWidthTokenWithTrailingTrivia;
        })();
        Syntax.VariableWidthTokenWithTrailingTrivia = VariableWidthTokenWithTrailingTrivia;
    })(TypeScript.Syntax || (TypeScript.Syntax = {}));
    var Syntax = TypeScript.Syntax;
})(TypeScript || (TypeScript = {}));
