declare module "Q" {
  export = T;

  class T<X> { }
}

import q = require("Q");

class M extends q<string> { }
