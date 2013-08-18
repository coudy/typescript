define(["require", "exports", "mi_private", "mu_private", "mi_public"], function(require, exports, __im_public_mi_private__, __im_public_mu_private__, __im_public_mi_public__) {
    // private elements
    

    // Public elements
    

    // Privacy errors - importing private elements
    var im_public_mi_private = __im_public_mi_private__;
    exports.im_public_mi_private = im_public_mi_private;
    var im_public_mu_private = __im_public_mu_private__;
    exports.im_public_mu_private = im_public_mu_private;
    var im_public_mi_public = __im_public_mi_public__;
    exports.im_public_mi_public = im_public_mi_public;
    

    // Usage of privacy error imports
    var privateUse_im_public_mi_private = new exports.im_public_mi_private.c_private();
    exports.publicUse_im_public_mi_private = new exports.im_public_mi_private.c_private();
    var privateUse_im_public_mu_private = new exports.im_public_mu_private.c_private();
    exports.publicUse_im_public_mu_private = new exports.im_public_mu_private.c_private();
    var privateUse_im_public_mi_public = new exports.im_public_mi_public.c_public();
    exports.publicUse_im_public_mi_public = new exports.im_public_mi_public.c_public();
    var privateUse_im_public_mi_public = new exports.im_public_mi_public.c_public();
    exports.publicUse_im_public_mi_public = new exports.im_public_mi_public.c_public();
});
