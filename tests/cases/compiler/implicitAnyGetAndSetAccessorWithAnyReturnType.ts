//@disallowimplicitany: true
// these should be errors
class C {
    nullMember = null;         // error at "nullMember"
    public get NullMember() {  // error at "NullMember"
        return this.nullMember;
    }
    
    // this shouldn't be an error
    public set NullMember(value) {
        this.nullMember = value;
    }
}
