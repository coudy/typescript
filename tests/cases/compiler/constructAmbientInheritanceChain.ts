declare class base {
}
declare class abc extends base {
    foo: xyz;
}
declare class xyz extends abc {
}

var bar = new xyz(); // was Invalid 'new' expression.