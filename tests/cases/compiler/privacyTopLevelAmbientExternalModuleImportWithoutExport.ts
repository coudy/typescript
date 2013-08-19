//@module: amd
// private elements
declare module "mi_private" {
    export class c_private {
    }
}
declare module "mu_private" {
    export class c_private {
    }
}

// Public elements
export declare module "mi_public" {
    export class c_public {
    }
}
export declare module "mu_public" {
    export class c_public {
    }
}

// Privacy errors - importing private elements
import im_private_mi_private = require("mi_private");
import im_private_mu_private = require("mu_private");
import im_private_mi_public = require("mi_public");
import im_private_mu_public = require("mu_public");

// Usage of privacy error imports
var privateUse_im_private_mi_private = new im_private_mi_private.c_private();
export var publicUse_im_private_mi_private = new im_private_mi_private.c_private();
var privateUse_im_private_mu_private = new im_private_mu_private.c_private();
export var publicUse_im_private_mu_private = new im_private_mu_private.c_private();
var privateUse_im_private_mi_public = new im_private_mi_public.c_public();
export var publicUse_im_private_mi_public = new im_private_mi_public.c_public();
var privateUse_im_private_mi_public = new im_private_mi_public.c_public();
export var publicUse_im_private_mi_public = new im_private_mi_public.c_public();
