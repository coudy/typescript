///<reference path='references.ts' />

module TypeScript {
    export interface IBitMatrix {
        // Returns true if the bit at the specified indices is set.  False otherwise.
        isSet(x: number, y: number): boolean;

        // Sets the value at this specified indices.
        setBit(x: number, y: number, value: boolean): void;

        // Releases the bit matrix, allowing its resources to be used by another matrix.
        // This instance cannot be used after it is released.
        release(): void;
    }

    export module BitMatrix {
        var pool: BitMatrixImpl[] = [];

        class BitMatrixImpl implements IBitMatrix {
            public isReleased = false;
            private vectors: IBitVector[] = [];

            public isSet(x: number, y: number): boolean {
                Debug.assert(!this.isReleased, "Should not use a released bitvector");
                var vector = this.vectors[x];
                if (!vector) {
                    return false;
                }

                return vector.isSet(y);
            }

            public setBit(x: number, y: number, value: boolean): void {
                Debug.assert(!this.isReleased, "Should not use a released bitvector");
                var vector = this.vectors[x];
                if (!vector) {
                    vector = BitVector.getVector();
                    this.vectors[x] = vector;
                }

                vector.setBit(y, value);
            }

            public release() {
                Debug.assert(!this.isReleased, "Should not use a released bitvector");
                this.isReleased = true;

                // Release all the vectors back.
                for (var name in this.vectors) {
                    if (this.vectors.hasOwnProperty(name)) {
                        var vector = this.vectors[name];
                        vector.release();
                    }
                }

                this.vectors.length = 0;
                pool.push(this);
            }
        }

        export function getMatrix(): IBitMatrix {
            if (pool.length === 0) {
                return new BitMatrixImpl();
            }

            var matrix = pool.pop();
            matrix.isReleased = false;

            return matrix;
        }
    }
}