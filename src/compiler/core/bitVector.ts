///<reference path='references.ts'/>

module TypeScript {
    export interface IBitVector {
        // Returns true if the bit at this index is set.  False otherwise.
        isSet(index: number): boolean;

        // Sets the value at this specified bit.
        setBit(index: number, value: boolean): void;

        // Releases the bit vector, allowing its resources to be used by another BitVector.
        // This instance cannot be used after it is released.
        release(): void;
    }

    export module BitVector {
        var pool: BitVectorImpl[] = [];
        enum Constants {
            MaxBitsPerNumber = 16
        }

        class BitVectorImpl implements IBitVector {
            public isReleased = false;
            private bits: number[] = [];

            public isSet(index: number): boolean {
                Debug.assert(!this.isReleased, "Should not use a released bitvector");
                var arrayIndex = (index / Constants.MaxBitsPerNumber) >>> 0;
                var value = this.bits[arrayIndex];
                if (value === undefined) {
                    return false;
                }

                var bitIndex = index % Constants.MaxBitsPerNumber;
                return hasFlag(value, 1 << bitIndex);
            }

            public setBit(index: number, bitValue: boolean): void {
                Debug.assert(!this.isReleased, "Should not use a released bitvector");
                var arrayIndex = (index / Constants.MaxBitsPerNumber) >>> 0;
                var value = this.bits[arrayIndex];
                if (value === undefined) {
                    if (bitValue) {
                        value = 0;
                    }
                    else {
                        // They're trying to set a bit to false that we don't even have an entry 
                        // for.  We can bail out quickly here.
                        return;
                    }
                }

                var bitIndex = index % Constants.MaxBitsPerNumber;
                if (bitValue) {
                    value = value | (1 << bitIndex);
                }
                else {
                    value = value & ~(1 << bitIndex);
                }
                this.bits[arrayIndex] = value;
            }

            public release() {
                Debug.assert(!this.isReleased, "Should not use a released bitvector");
                this.isReleased = true;
                this.bits.length = 0;
                pool.push(this);
            }
        }

        export function getVector(): IBitVector {
            if (pool.length === 0) {
                return new BitVectorImpl();
            }

            var vector = pool.pop();
            vector.isReleased = false;

            return vector;
        }
    }
}