// private elements




// Privacy errors - importing private elements
var im_private_mi_private = require("mi_private");
var im_private_mu_private = require("mu_private");
var im_private_mi_public = require("mi_public");


// Usage of privacy error imports
var privateUse_im_private_mi_private = new im_private_mi_private.c_private();
exports.publicUse_im_private_mi_private = new im_private_mi_private.c_private();
var privateUse_im_private_mu_private = new im_private_mu_private.c_private();
exports.publicUse_im_private_mu_private = new im_private_mu_private.c_private();
var privateUse_im_private_mi_public = new im_private_mi_public.c_public();
exports.publicUse_im_private_mi_public = new im_private_mi_public.c_public();
var privateUse_im_private_mi_public = new im_private_mi_public.c_public();
exports.publicUse_im_private_mi_public = new im_private_mi_public.c_public();

