///<reference path='..\Core\Constants.ts' />
///<reference path='TextSpan.ts' />

module TypeScript {
    export class TextChangeRange {
        private _span: TextSpan;
        private _newLength: number;

        /// <summary>
        /// Initializes a new instance of <see cref="T:TextChangeRange"/>.
        /// </summary>
        /// <param name="span"></param>
        /// <param name="newLength"></param>
        constructor(span: TextSpan, newLength: number) {
            if (newLength < 0) {
                throw Errors.argumentOutOfRange("newLength");
            }

            this._span = span;
            this._newLength = newLength;
        }

        /// <summary>
        /// The span of text before the edit which is being changed
        /// </summary>
        public span(): TextSpan {
            return this._span;
        }

        /// <summary>
        /// Width of the span after the edit.  A 0 here would represent a delete
        /// </summary>
        public newLength(): number {
            return this._newLength;
        }

        public newSpan(): TextSpan {
            return new TextSpan(this.span().start(), this.newLength());
        }

        public static collapse(changes: TextChangeRange[]): TextChangeRange {
            var diff = 0;
            var start = Constants.Max31BitInteger;
            var end = 0;

            // TODO: we are assuming that changes are normalized. That is currently not guaranteed,
            // but changes that we get from IDE are normalized. Idealy changes should come in a kind
            // of normalized change collection instead of IEnumerable to really guarantee that they
            // are normalized.
            for (var i = 0; i < changes.length; i++) {
                var change = changes[i];
                diff += change.newLength() - change.span().length();

                if (change.span().start() < start) {
                    start = change.span().start();
                }

                if (change.span().end() > end) {
                    end = change.span().end();
                }
            }

            if (start > end) {
                return null;
            }

            var combined = TextSpan.fromBounds(start, end);
            var newLen = combined.length() + diff;

            return new TextChangeRange(combined, newLen);
        }
    }
}