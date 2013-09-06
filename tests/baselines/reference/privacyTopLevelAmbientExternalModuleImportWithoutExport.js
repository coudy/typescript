//// [privacyTopLevelAmbientExternalModuleImportWithoutExport_require.js]

//// [privacyTopLevelAmbientExternalModuleImportWithoutExport_require2.js]
//// [privacyTopLevelAmbientExternalModuleImportWithoutExport_core.js]
///<reference path='privacyTopLevelAmbientExternalModuleImportWithoutExport_require.ts'/>
///<reference path='privacyTopLevelAmbientExternalModuleImportWithoutExport_require2.ts'/>
define(["require", "exports", "mi_private", "mu_private", "mi_public"], function(require, exports, __im_private_mi_private__, __im_private_mu_private__, __im_private_mi_public__) {
    // Privacy errors - importing private elements
    var im_private_mi_private = "mi_private";
    var im_private_mu_private = "mu_private";
    var im_private_mi_public = __im_private_mi_public__;
    

    // Usage of privacy error imports
    var privateUse_im_private_mi_private = new im_private_mi_private.c_private();
    exports.publicUse_im_private_mi_private = new im_private_mi_private.c_private();
    var privateUse_im_private_mu_private = new im_private_mu_private.c_private();
    exports.publicUse_im_private_mu_private = new im_private_mu_private.c_private();
    var privateUse_im_private_mi_public = new im_private_mi_public.c_public();
    exports.publicUse_im_private_mi_public = new im_private_mi_public.c_public();
    var privateUse_im_private_mi_public = new im_private_mi_public.c_public();
    exports.publicUse_im_private_mi_public = new im_private_mi_public.c_public();
});
