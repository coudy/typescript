//@disallowimplicitany: true
// these should be errors
class GetAndSet {
    getAndSet = null;             // error at "getAndSet"
    public get haveGetAndSet() {  // error at "haveGetAndSet"
        return this.getAndSet;
    }
    
    // this shouldn't be an error
    public set haveGetAndSet(value) {  // error at "value"
        this.getAndSet = value;
    }
}

class SetterOnly {
    public set haveOnlySet(newXValue) {  // error at "haveOnlySet, newXValue"
    }
}

class GetterOnly {
    public get haveOnlyGet() {  // error at "haveOnlyGet"
        return null;
    }
}