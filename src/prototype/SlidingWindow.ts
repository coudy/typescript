///<reference path='References.ts' />

interface IRewindPoint {
    absoluteIndex: number;
}

class SlidingWindow {
    // A window of items that has been read in from the underlying source.
    public window: any[] = [];

    // The number of valid items in window.
    private windowCount: number = 0;

    // The *absolute* index in the *full* array of items the *window* array starts at.  i.e.
    // if there were 100 items, and window contains tokens [70, 80), then this value would be
    // 70.
    public windowAbsoluteStartIndex: number = 0;

    // The index in the window array that we're at. i.e. if there 100 items and 
    // window contains tokens [70, 80), and we're on item 75, then this value would be '5'.
    // Note: it is not absolute.  It is relative to the start of the window.
    private currentRelativeItemIndex: number = 0;

    // The number of pinned points there are.  As long as there is at least one  pinned point, we 
    // will not advance the start of the window array past the item marked by that pin point.
    private pinCount: number = 0;

    // If there are any outstanding rewind points, this is index in the full array of items
    // that the first rewind point points to.  If this is not -1, then we will not shift the
    // start of the items array past this point.
    private firstPinnedAbsoluteIndex: number = -1;

    private pool: IRewindPoint[] = [];
    private poolCount = 0;

    // The default value to return when there are no more items left in the window.
    private defaultValue: any;

    private sourceLength: number;

    constructor(defaultWindowSize: number, defaultValue: any, sourceLength = -1) {
        this.defaultValue = defaultValue;
        this.window = ArrayUtilities.createArray(defaultWindowSize, defaultValue);
        this.sourceLength = sourceLength;
    }

    private storeAdditionalRewindState(rewindPoint: IRewindPoint): void {
    }

    private restoreStateFromRewindPoint(rewindPoint: IRewindPoint): void {
    }

    private fetchMoreItems(sourceIndex: number, window: any[], destinationIndex: number, spaceAvailable: number): number {
        throw Errors.notYetImplemented();
    }

    private addMoreItemsToWindow(): bool {
        if (this.sourceLength >= 0 && this.absoluteIndex() >= this.sourceLength) {
            return false;
        }

        // First, make room for the new items if we're out of room.
        if (this.windowCount >= this.window.length) {
            this.tryShiftOrGrowTokenWindow();
        }

        var spaceAvailable = this.window.length - this.windowCount;
        var amountFetched = this.fetchMoreItems(this.windowAbsoluteStartIndex + this.windowCount, this.window, this.windowCount, spaceAvailable);

        // Assert disabled because it is actually expensive enugh to affect perf.

        this.windowCount += amountFetched;
        return amountFetched > 0;
    }

    private tryShiftOrGrowTokenWindow(): void {
        // We want to shift if our current item is past the halfway point of the current item window.
        var currentIndexIsPastWindowHalfwayPoint = this.currentRelativeItemIndex > (this.window.length >>> 1);

        // However, we can only shift if we have no outstanding rewind points.  Or, if we have an 
        // outstanding rewind point, that it points to some point after the start of the window.
        var isAllowedToShift = 
            this.firstPinnedAbsoluteIndex === -1 ||
            this.firstPinnedAbsoluteIndex > this.windowAbsoluteStartIndex;

        if (currentIndexIsPastWindowHalfwayPoint && isAllowedToShift) {
            // Figure out where we're going to start shifting from. If we have no oustanding rewind 
            // points, then we'll start shifting over all the items starting from the current 
            // token we're point out.  Otherwise, we'll shift starting from the first item that 
            // the rewind point is pointing at.
            // 
            // We'll call that point 'N' from now on. 
            var shiftStartIndex = this.firstPinnedAbsoluteIndex === -1
                ? this.currentRelativeItemIndex 
                : this.firstPinnedAbsoluteIndex - this.windowAbsoluteStartIndex;

            // We have to shift the number of elements between the start index and the number of 
            // items in the window.
            var shiftCount = this.windowCount - shiftStartIndex;

            Debug.assert(shiftStartIndex > 0);
            if (shiftCount > 0) {
                ArrayUtilities.copy(this.window, shiftStartIndex, this.window, 0, shiftCount);
            }

            // The window has now moved over to the right by N.
            this.windowAbsoluteStartIndex += shiftStartIndex;

            // The number of valid items in the window has now decreased by N.
            this.windowCount -= shiftStartIndex;

            // The current item now starts further to the left in the window.
            this.currentRelativeItemIndex -= shiftStartIndex;
        }
        else {
            // Grow the exisitng array.
            // this.window[this.window.length * 2 - 1] = this.defaultValue;
            ArrayUtilities.grow(this.window, this.window.length * 2, this.defaultValue);
        }
    }

    public absoluteIndex(): number {
        return this.windowAbsoluteStartIndex + this.currentRelativeItemIndex;
    }

    public getAndPinAbsoluteIndex(): number {
        // Find the absolute index of this pin point.  i.e. it's the index as if we had an 
        // array containing *all* tokens.  
        var absoluteIndex = this.absoluteIndex();
        if (this.pinCount === 0) {
            // If this is the first pinned point, then store off this index.  We will ensure that
            // we never shift the window past this point.
            this.firstPinnedAbsoluteIndex = absoluteIndex;
        }

        this.pinCount++;
        return absoluteIndex;
    }

    public releaseAndUnpinAbsoluteIndex(absoluteIndex: number) {
        this.pinCount--;
        if (this.pinCount === 0) {
            // If we just released the last outstanding pin, then we no longer need to 'fix' the 
            // token window so it can't move forward.  Set the index to -1 so that we can shift 
            // things over the next time we read past the end of the array.
            this.firstPinnedAbsoluteIndex = -1;
        }

    }

    public getRewindPoint(): any {
        // Find the absolute index of this rewind point.  i.e. it's the index as if we had an 
        // array containing *all* tokens.  
        var absoluteIndex = this.getAndPinAbsoluteIndex();

        var rewindPoint = this.poolCount === 0
            ? <IRewindPoint>{}
            : this.pop();

        rewindPoint.absoluteIndex = absoluteIndex;

        this.storeAdditionalRewindState(rewindPoint);

        return rewindPoint;
    }

    private pop(): IRewindPoint {
        this.poolCount--;
        var result = this.pool[this.poolCount];
        this.pool[this.poolCount] = null;
        return result;
    }

    public rewindToPinnedIndex(absoluteIndex: number): void {
        // The rewind point shows which absolute item we want to rewind to.  Get the relative 
        // index in the actual array that we want to point to.
        var relativeIndex = absoluteIndex - this.windowAbsoluteStartIndex;

        // Make sure we haven't screwed anything up.
        Debug.assert(relativeIndex >= 0 && relativeIndex < this.windowCount);

        // Set ourselves back to that point.
        this.currentRelativeItemIndex = relativeIndex;
    }

    public rewind(rewindPoint: IRewindPoint): void {
        this.rewindToPinnedIndex(rewindPoint.absoluteIndex);
        this.restoreStateFromRewindPoint(rewindPoint);
    }

    public releaseRewindPoint(rewindPoint: IRewindPoint): void {
        this.releaseAndUnpinAbsoluteIndex(rewindPoint.absoluteIndex);

        // this.rewindPoints.push(rewindPoint);
        this.pool[this.poolCount] = rewindPoint;
        this.poolCount++;
    }

    public currentItem(): any {
        if (this.currentRelativeItemIndex >= this.windowCount) {
            if (!this.addMoreItemsToWindow()) {
                return this.defaultValue;
            }
        }

        return this.window[this.currentRelativeItemIndex];
    }

    public peekItemN(n: number): any {
        // Assert disabled because it is actually expensive enugh to affect perf.
        // Debug.assert(n >= 0);
        while (this.currentRelativeItemIndex + n >= this.windowCount) {
            if (!this.addMoreItemsToWindow()) {
                return this.defaultValue;
            }
        }
        
        return this.window[this.currentRelativeItemIndex + n];
    }

    public moveToNextItem(): void {
        this.currentRelativeItemIndex++;
    }
}