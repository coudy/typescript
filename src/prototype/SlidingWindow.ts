///<reference path='References.ts' />

class SlidingWindow {
    // A window of items that has been read in from the underlying source.
    private window: any[] = [];

    // The number of valid items in window.
    private windowCount: number = 0;

    // The *absolute* index in the *full* array of items the *window* array starts at.  i.e.
    // if there were 100 items, and window contains tokens [70, 80), then this value would be
    // 70.
    private windowAbsoluteStartIndex: number = 0;

    // The index in the window array that we're at. i.e. if there 100 items and 
    // window contains tokens [70, 80), and we're on item 75, then this value would be '5'.
    // Note: it is not absolute.  It is relative to the start of the window.
    private currentRelativeItemIndex: number = 0;

    // The number of outstanding rewind points there are.  As long as there is at least one 
    // outstanding rewind point, we will not advance the start of the window array past
    // item marked by the first rewind point.
    private outstandingRewindPoints: number = 0;

    // If there are any outstanding rewind points, this is index in the full array of items
    // that the first rewind point points to.  If this is not -1, then we will not shift the
    // start of the items array past this point.
    private firstRewindAbsoluteIndex: number = -1;

    private rewindPoints: any[] = [];

    // The default value to return when there are no more items left in the window.
    private defaultValue: any;

    constructor(defaultValue: any) {
        this.defaultValue = defaultValue;
    }

    private getRewindPoint(): any {
        // Find the absolute index of this rewind point.  i.e. it's the index as if we had an 
        // array containing *all* tokens.  
        var absoluteIndex = this.windowAbsoluteStartIndex + this.currentRelativeItemIndex;
        if (this.outstandingRewindPoints === 0) {
            // If this is the first rewind point, then store off this index.  We will ensure that
            // we never shift the window past this point.
            this.firstRewindAbsoluteIndex = absoluteIndex;
        }

        this.outstandingRewindPoints++;
        var rewindPoint = this.rewindPoints.length === 0 ? {} : this.rewindPoints.pop();
        rewindPoint.rewindPoints = this.outstandingRewindPoints;
        rewindPoint.absoluteIndex = absoluteIndex;
        this.storeAdditionalRewindData(rewindPoint);

        return rewindPoint;
        // return new ParserRewindPoint(this.outstandingRewindPoints, absoluteIndex, this.previousToken, this.isInStrictMode);
    }

    private storeAdditionalRewindData(rewindPoint: any): void {
        throw Errors.notYetImplemented();
    }

    private rewind(rewindPoint: any): void {
        // Ensure that these are rewound in the right order.
        Debug.assert(this.outstandingRewindPoints === rewindPoint.resetCount);

        // The rewind point shows which absolute item we want to rewind to.  Get the relative 
        // index in the actual array that we want to point to.
        var relativeIndex = rewindPoint.absoluteIndex - this.windowAbsoluteStartIndex;

        // Make sure we haven't screwed anything up.
        Debug.assert(relativeIndex >= 0 && relativeIndex < this.windowCount);

        // Set ourselves back to that point.
        this.currentRelativeItemIndex = relativeIndex;

        this.restoreState(rewindPoint);

        // Clear out the current token.  We can retrieve it now from the tokenWindow.
        // Restore the previous token and strict mode setting that we were at when this rewind
        // point was created.
        //this._currentToken = null;
        //this.previousToken = point.previousToken;
        //this.isInStrictMode = point.isInStrictMode;
    }

    private restoreState(rewindPoint: any) {
        throw Errors.notYetImplemented();
    }

    private releaseRewindPoint(rewindPoint: any): void {
        // Ensure that these are released in the right order.
        Debug.assert(this.outstandingRewindPoints == rewindPoint.resetCount);

        this.outstandingRewindPoints--;
        if (this.outstandingRewindPoints == 0) {
            // If we just released the last outstanding rewind point, then we no longer need to 
            // 'fix' the token window so it can't move forward.  Set the index to -1 so that we
            // can shift things over the next time we read past the end of the array.
            this.firstRewindAbsoluteIndex = -1;
        }

        this.rewindPoints.push(rewindPoint);
    }

    public currentItem(): any {
        if (this.currentRelativeItemIndex >= this.windowCount) {
            if (!this.addMoreItemsToWindow()) {
                return this.defaultValue;
            }
        }

        return this.window[this.currentRelativeItemIndex];
    }

    private addMoreItemsToWindow(): bool {
        Debug.assert(this.currentRelativeItemIndex >= this.windowCount);

        if (this.isPastSourceEnd()) {
            return false;
        }

        // First, make room for the new items.
        this.tryShiftOrGrowTokenWindow();

        var spaceAvailable = this.window.length - this.windowCount;
        this.fetchMoreItems(this.windowAbsoluteStartIndex + this.windowCount, this.window, this.windowCount, spaceAvailable);
        return true;
    }

    private fetchMoreItems(sourceIndex: number, window: any[], destinationIndex: number, count: number) {
        throw Errors.notYetImplemented();
    }

    private isPastSourceEnd(): bool {
        throw Errors.notYetImplemented();
    }

    private tryShiftOrGrowTokenWindow(): void {
        Debug.assert(this.currentRelativeItemIndex >= this.windowCount);

        // We want to shift if our current item is past the halfway point of the current item window.
        var currentIndexIsPastWindowHalfwayPoint = this.currentRelativeItemIndex > (this.window.length >> 1);

        // However, we can only shift if we have no outstanding rewind points.  Or, if we have an 
        // outstanding rewind point, that it points to some point after the start of the window.
        var isAllowedToShift = 
            this.firstRewindAbsoluteIndex === -1 ||
            this.firstRewindAbsoluteIndex > this.windowAbsoluteStartIndex;

        if (currentIndexIsPastWindowHalfwayPoint && isAllowedToShift) {
            // Figure out where we're going to start shifting from. If we have no oustanding rewind 
            // points, then we'll start shifting over all the items starting from the current 
            // token we're point out.  Otherwise, we'll shift starting from the first item that 
            // the rewind point is pointing at.
            // 
            // We'll call that point 'N' from now on. 
            var shiftStartIndex = this.firstRewindAbsoluteIndex === -1
                ? this.currentRelativeItemIndex 
                : this.firstRewindAbsoluteIndex - this.windowAbsoluteStartIndex;

            // We have to shift the number of elements between the start index and the number of 
            // items in the window.
            var shiftCount = this.windowCount - shiftStartIndex;

            Debug.assert(shiftStartIndex > 0);
            Debug.assert(shiftCount > 0);
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
            this.window[this.window.length * 2 - 1] = this.defaultValue;
        }
    }
}