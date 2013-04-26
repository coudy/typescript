declare module 'base' {
    export class Super { }
}

import foo = module('base');
class Sub extends foo.Super { }
