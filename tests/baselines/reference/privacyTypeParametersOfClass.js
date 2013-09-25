var privateClass = (function () {
    function privateClass() {
    }
    return privateClass;
})();

var publicClass = (function () {
    function publicClass() {
    }
    return publicClass;
})();
exports.publicClass = publicClass;

// TypeParameter_0_of_exported_class_1_has_or_is_using_private_type_2
var publicClassWithPrivateTypeParameters = (function () {
    function publicClassWithPrivateTypeParameters() {
    }
    return publicClassWithPrivateTypeParameters;
})();
exports.publicClassWithPrivateTypeParameters = publicClassWithPrivateTypeParameters;

var publicClassWithPublicTypeParameters = (function () {
    function publicClassWithPublicTypeParameters() {
    }
    return publicClassWithPublicTypeParameters;
})();
exports.publicClassWithPublicTypeParameters = publicClassWithPublicTypeParameters;

var privateClassWithPrivateTypeParameters = (function () {
    function privateClassWithPrivateTypeParameters() {
    }
    return privateClassWithPrivateTypeParameters;
})();

var privateClassWithPublicTypeParameters = (function () {
    function privateClassWithPublicTypeParameters() {
    }
    return privateClassWithPublicTypeParameters;
})();

