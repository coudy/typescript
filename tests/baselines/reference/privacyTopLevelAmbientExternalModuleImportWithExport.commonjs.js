// private elements




// Privacy errors - importing private elements
var im_public_mi_private = require("mi_private");
exports.im_public_mi_private = im_public_mi_private;
var im_public_mu_private = require("mu_private");
exports.im_public_mu_private = im_public_mu_private;
var im_public_mi_public = require("mi_public");
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

