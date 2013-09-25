class privateClass {
}

export class publicClass {
}

// TypeParameter_0_of_exported_interface_1_has_or_is_using_private_type_2
export interface publicInterfaceWithPrivateTypeParameters<T extends privateClass> {
}

export interface publicInterfaceWithPublicTypeParameters<T extends publicClass> {
}

interface privateInterfaceWithPrivateTypeParameters<T extends privateClass> {
}

interface privateInterfaceWithPublicTypeParameters<T extends publicClass> {
}