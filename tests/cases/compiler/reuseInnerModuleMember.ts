declare module 'foo' { }

declare module bar {

  interface alpha {}

}
 
import f = module('foo');

module bar {

  var x: alpha;

}
