class privateClass {
}

export class publicClass {
}

// TypeParameter_0_of_exported_class_1_has_or_is_using_private_type_2
export class publicClassWithPrivateTypeParameters<T extends privateClass> {
}

export class publicClassWithPublicTypeParameters<T extends publicClass> {
}

class privateClassWithPrivateTypeParameters<T extends privateClass> {
}

class privateClassWithPublicTypeParameters<T extends publicClass> {
}