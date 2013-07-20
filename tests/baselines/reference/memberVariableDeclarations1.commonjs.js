// from spec
var Employee = (function () {
    function Employee() {
        this.retired = false;
        this.manager = null;
        this.reports = [];
    }
    return Employee;
})();

var Employee2 = (function () {
    function Employee2() {
        this.retired = false;
        this.manager = null;
        this.reports = [];
    }
    return Employee2;
})();

var e1;
var e2;
e1 = e2;
e2 = e1;
