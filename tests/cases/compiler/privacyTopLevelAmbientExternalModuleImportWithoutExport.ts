//@module: amd

// @Filename: privacyTopLevelAmbientExternalModuleImportWithoutExport_require.ts
// Public elements
declare module "mi_public" {
    export class c_public {
    }
}
declare module "mu_public" {
    export class c_public {
    }
}


// @Filename: privacyTopLevelAmbientExternalModuleImportWithoutExport_require2.ts
// private elements
// Export - Error ambient modules allowed only in global
export declare module "mi_private" {
    export class c_private {
    }
}
export declare module "mu_private" {
    export class c_private {
    }
}


// @Filename: privacyTopLevelAmbientExternalModuleImportWithoutExport_core.ts
///<reference path='privacyTopLevelAmbientExternalModuleImportWithoutExport_require.ts'/>
///<reference path='privacyTopLevelAmbientExternalModuleImportWithoutExport_require2.ts'/>

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
