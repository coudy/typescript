//// [privacyTopLevelAmbientExternalModuleImportWithoutExport_require.js]

//// [privacyTopLevelAmbientExternalModuleImportWithoutExport_require2.js]
//// [privacyTopLevelAmbientExternalModuleImportWithoutExport_core.js]
///<reference path='privacyTopLevelAmbientExternalModuleImportWithoutExport_require.ts'/>
///<reference path='privacyTopLevelAmbientExternalModuleImportWithoutExport_require2.ts'/>
define(["require", "exports", "mi_private", "mu_private", "mi_public"], function(require, exports, im_private_mi_private, im_private_mu_private, im_private_mi_public) {
    
    
    
    

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
