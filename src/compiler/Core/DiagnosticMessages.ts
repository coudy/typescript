///<reference path='References.ts' />

module TypeScript {
    export var diagnosticMessages: IDiagnosticMessages = {
        error_TS_0__1: {
            category: DiagnosticCategory.Error,
            message: "error TS{0}: {1}",
            code: 0
        },

        warning_TS_0__1: {
            category: DiagnosticCategory.Warning,
            message: "warning TS{0}: {1}",
            code: 1
        },

        // Syntactic errors start at 100.
        Unrecognized_escape_sequence: {
            category: DiagnosticCategory.Error,
            message: "Unrecognized escape sequence.",
            code: 1000
        },

        Unexpected_character_0: {
            category: DiagnosticCategory.Error,
            message: "Unexpected character {0}.",
            code: 1001
        },

        Missing_closing_quote_character: {
            category: DiagnosticCategory.Error,
            message: "Missing close quote character.",
            code: 1002
        },

        Identifier_expected: {
            category: DiagnosticCategory.Error,
            message: "Identifier expected.",
            code: 1003
        },

        _0_keyword_expected: {
            category: DiagnosticCategory.Error,
            message: "'{0}' keyword expected.",
            code: 1004
        },

        _0_expected: {
            category: DiagnosticCategory.Error,
            message: "'{0}' expected.",
            code: 1005
        },

        Identifier_expected__0_is_a_keyword: {
            category: DiagnosticCategory.Error,
            message: "Identifier expected; '{0}' is a keyword.",
            code: 1006
        },

        Automatic_semicolon_insertion_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Automatic semicolon insertion not allowed.",
            code: 1007
        },

        Unexpected_token__0_expected: {
            category: DiagnosticCategory.Error,
            message: "Unexpected token; '{0}' expected.",
            code: 1008
        },

        Trailing_separator_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Trailing separator not allowed.",
            code: 1009
        },

        _StarSlash__expected: {
            category: DiagnosticCategory.Error,
            message: "'*/' expected.",
            code: 1010
        },

        _public_or_private_modifier_must_precede__static_: {
            category: DiagnosticCategory.Error,
            message: "'public' or 'private' modifier must precede 'static'.",
            code: 1011
        },

        Unexpected_token_: {
            category: DiagnosticCategory.Error,
            message: "Unexpected token.",
            code: 1012
        },

        A_catch_clause_variable_cannot_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "A catch clause variable cannot have a type annotation.",
            code: 1013
        },

        Rest_parameter_must_be_last_in_list: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter must be last in list.",
            code: 1014
        },

        Parameter_cannot_have_question_mark_and_initializer: {
            category: DiagnosticCategory.Error,
            message: "Parameter cannot have question mark and initializer.",
            code: 1015
        },

        Required_parameter_cannot_follow_optional_parameter: {
            category: DiagnosticCategory.Error,
            message: "required parameter cannot follow optional parameter.",
            code: 1016
        },

        Index_signatures_cannot_have_rest_parameters: {
            category: DiagnosticCategory.Error,
            message: "Index signatures cannot have rest parameters.",
            code: 1017
        },

        Index_signature_parameter_cannot_have_accessibility_modifiers: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have accessibility modifiers.",
            code: 1018
        },

        Index_signature_parameter_cannot_have_a_question_mark: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have a question mark.",
            code: 1019
        },

        Index_signature_parameter_cannot_have_an_initializer: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have an initializer.",
            code: 1020
        },

        Index_signature_must_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Index signature must have a type annotation.",
            code: 1021
        },

        Index_signature_parameter_must_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter must have a type annotation.",
            code: 1022
        },

        Index_signature_parameter_type_must_be__string__or__number_: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter type must be 'string' or 'number'.",
            code: 1023
        },

        _extends__clause_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'extends' clause already seen.",
            code: 1024
        },

        _extends__clause_must_precede__implements__clause: {
            category: DiagnosticCategory.Error,
            message: "'extends' clause must precede 'implements' clause.",
            code: 1025
        },

        Class_can_only_extend_single_type: {
            category: DiagnosticCategory.Error,
            message: "Class can only extend single type.",
            code: 1026
        },

        _implements__clause_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'implements' clause already seen.",
            code: 1027
        },

        Accessibility_modifier_already_seen: {
            category: DiagnosticCategory.Error,
            message: "Accessibility modifier already seen.",
            code: 1028
        },

        _0__modifier_must_precede__1__modifier: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier must precede '{1}' modifier.",
            code: 1029
        },

        _0__modifier_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier already seen.",
            code: 1030
        },

        _0__modifier_cannot_appear_on_a_class_element: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier cannot appear on a class element.",
            code: 1031
        },

        Interface_declaration_cannot_have__implements__clause: {
            category: DiagnosticCategory.Error,
            message: "Interface declaration cannot have 'implements' clause.",
            code: 1032
        },

        Enum_element_must_have_initializer: {
            category: DiagnosticCategory.Error,
            message: "Enum element must have initializer.",
            code: 1033
        },

        _super__invocation_cannot_have_type_arguments: {
            category: DiagnosticCategory.Error,
            message: "'super' invocation cannot have type arguments.",
            code: 1034
        },

        Non_ambient_modules_cannot_use_quoted_names: {
            category: DiagnosticCategory.Error,
            message: "Non ambient modules cannot use quoted names.",
            code: 1035
        },

        Statements_are_not_allowed_in_ambient_contexts: {
            category: DiagnosticCategory.Error,
            message: "Statements are not allowed in ambient contexts.",
            code: 1036
        },

        Implementations_are_not_allowed_in_ambient_contexts: {
            category: DiagnosticCategory.Error,
            message: "Implementations are not allowed in ambient contexts.",
            code: 1037
        },

        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: {
            category: DiagnosticCategory.Error,
            message: "'declare' modifier not allowed for code already in an ambient context.",
            code: 1038
        },

        Initializers_are_not_allowed_in_ambient_contexts: {
            category: DiagnosticCategory.Error,
            message: "Initializers are not allowed in ambient contexts.",
            code: 1039
        },

        Overload_and_ambient_signatures_cannot_specify_parameter_properties: {
            category: DiagnosticCategory.Error,
            message: "Overload and ambient signatures cannot specify parameter properties.",
            code: 1040
        },

        Function_implementation_expected: {
            category: DiagnosticCategory.Error,
            message: "Function implementation expected.",
            code: 1041
        },

        Constructor_implementation_expected: {
            category: DiagnosticCategory.Error,
            message: "Constructor implementation expected.",
            code: 1042
        },

        Function_overload_name_must_be__0_: {
            category: DiagnosticCategory.Error,
            message: "Function overload name must be '{0}'.",
            code: 1043
        },

        _0__modifier_cannot_appear_on_a_module_element: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier cannot appear on a module element.",
            code: 1044
        },

        _declare__modifier_cannot_appear_on_an_interface_declaration: {
            category: DiagnosticCategory.Error,
            message: "'declare' modifier cannot appear on an interface declaration.",
            code: 1045
        },

        _declare__modifier_required_for_top_level_element: {
            category: DiagnosticCategory.Error,
            message: "'declare' modifier required for top level element.",
            code: 1046
        },

        Rest_parameter_cannot_be_optional: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter cannot be optional.",
            code: 1047
        },

        Rest_parameter_cannot_have_initializer: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter cannot have initializer.",
            code: 1048
        },

        _set__accessor_must_have_only_one_parameter: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor must have one and only one parameter.",
            code: 1049
        },

        _set__accessor_parameter_cannot_have_accessibility_modifier: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor parameter cannot have accessibility modifier.",
            code: 1050
        },

        _set__accessor_parameter_cannot_be_optional: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor parameter cannot be optional.",
            code: 1051
        },

        _set__accessor_parameter_cannot_have_initializer: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor parameter cannot have initializer.",
            code: 1052
        },

        _set__accessor_cannot_have_rest_parameter: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor cannot have rest parameter.",
            code: 1053
        },

        _get__accessor_cannot_have_parameters: {
            category: DiagnosticCategory.Error,
            message: "'get' accessor cannot have parameters.",
            code: 1054
        },










        // Semantic errors start at 200.
        Duplicate_identifier__0_: {
            category: DiagnosticCategory.Error,
            message: "Duplicate identifier '{0}'.",
            code: 2000
        },

        The_name__0__does_not_exist_in_the_current_scope: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not exist in the current scope.",
            code: 2001
        },

        The_name__0__does_not_refer_to_a_value: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not refer to a value.",
            code: 2002
        },

        Keyword__super__can_only_be_used_inside_a_class_instance_method: {
            category: DiagnosticCategory.Error,
            message: "Keyword 'super' can only be used inside a class instance method.",
            code: 2003
        },

        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer.",
            code: 2004
        },

        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2005
        },

        Value_of_type__0__is_not_callable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable.",
            code: 2006
        },

        Value_of_type__0__is_not_newable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not newable.",
            code: 2007
        },

        Value_of_type__0__is_not_indexable_by_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not indexable by type '{1}'.",
            code: 2008
        },

        Operator__0__cannot_be_applied_to_types__1__and__2_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
            code: 2009
        },

        Operator__0__cannot_be_applied_to_types__1__and__2__3: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 2010
        },

        Cannot_convert__0__to__1_: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}'.",
            code: 2011
        },

        Cannot_convert__0__to__1___2: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}': {2}.",
            code: 2012
        },

        Expected_var__class__interface__or_module: {
            category: DiagnosticCategory.Error,
            message: "Expected var, class, interface, or module.",
            code: 2013
        },

        Operator__0__cannot_be_applied_to_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to type '{1}'.",
            code: 2014
        },

        Getter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Getter '{0}' already declared.",
            code: 2015
        },

        Setter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Setter '{0}' already declared.",
            code: 2016
        },

        Accessor_may_not_take_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "Accessors may not take type parameters.",
            code: 2017
        },

        Exported_class__0__extends_private_class__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' extends private class '{1}'.",
            code: 2018
        },
        Exported_class__0__implements_private_interface__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' implements private interface '{1}'.",
            code: 2019
        },
        Exported_interface__0__extends_private_interface__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported interface '{0}' extends private interface '{1}'.",
            code: 2020
        },
        Exported_class__0__extends_class_from_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' extends class from inaccessible module {1}.",
            code: 2021
        },
        Exported_class__0__implements_interface_from_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' implements interface from inaccessible module {1}.",
            code: 2022
        },
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported interface '{0}' extends interface from inaccessible module {1}.",
            code: 2023
        },
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Public static property '{0}' of exported class has or is using private type '{1}'.",
            code: 2024
        },
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Public property '{0}' of exported class has or is using private type '{1}'.",
            code: 2025
        },
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Property '{0}' of exported interface has or is using private type '{1}'.",
            code: 2026
        },
        Exported_variable__0__has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported variable '{0}' has or is using private type '{1}'.",
            code: 2027
        },
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Public static property '{0}' of exported class is using inaccessible module {1}.",
            code: 2028
        },
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Public property '{0}' of exported class is using inaccessible module {1}.",
            code: 2029
        },
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Property '{0}' of exported interface is using inaccessible module {1}.",
            code: 2030
        },
        Exported_variable__0__is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported variable '{0}' is using inaccessible module {1}.",
            code: 2031
        },
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.",
            code: 2032
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.",
            code: 2033
        },
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.",
            code: 2034
        },
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.",
            code: 2035
        },
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.",
            code: 2036
        },
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.",
            code: 2037
        },
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public method from exported class has or is using private type '{1}'.",
            code: 2038
        },
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of method from exported interface has or is using private type '{1}'.",
            code: 2039
        },
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of exported function has or is using private type '{1}'.",
            code: 2040
        },
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.",
            code: 2041
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.",
            code: 2042
        },
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.",
            code: 2043
        },
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.",
            code: 2044
        },
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}",
            code: 2045
        },
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.",
            code: 2046
        },
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public method from exported class is using inaccessible module {1}.",
            code: 2047
        },
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of method from exported interface is using inaccessible module {1}.",
            code: 2048
        },
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of exported function is using inaccessible module {1}.",
            code: 2049
        },
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static property getter from exported class has or is using private type '{0}'.",
            code: 2050
        },
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public property getter from exported class has or is using private type '{0}'.",
            code: 2051
        },
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of constructor signature from exported interface has or is using private type '{0}'.",
            code: 2052
        },
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of call signature from exported interface has or is using private type '{0}'.",
            code: 2053
        },
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of index signature from exported interface has or is using private type '{0}'.",
            code: 2054
        },
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static method from exported class has or is using private type '{0}'.",
            code: 2055
        },
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public method from exported class has or is using private type '{0}'.",
            code: 2056
        },
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of method from exported interface has or is using private type '{0}'.",
            code: 2057
        },
        Return_type_of_exported_function_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of exported function has or is using private type '{0}'.",
            code: 2058
        },
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static property getter from exported class is using inaccessible module {0}.",
            code: 2059
        },
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public property getter from exported class is using inaccessible module {0}.",
            code: 2060
        },
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of constructor signature from exported interface is using inaccessible module {0}.",
            code: 2061
        },
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of call signature from exported interface is using inaccessible module {0}.",
            code: 2062
        },
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of index signature from exported interface is using inaccessible module {0}.",
            code: 2063
        },
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static method from exported class is using inaccessible module {0}.",
            code: 2064
        },
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public method from exported class is using inaccessible module {0}.",
            code: 2065
        },
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of method from exported interface is using inaccessible module {0}.",
            code: 2066
        },
        Return_type_of_exported_function_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of exported function is using inaccessible module {0}.",
            code: 2067
        },
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: {
            category: DiagnosticCategory.Error,
            message: "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.",
            code: 2068
        },
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: {
            category: DiagnosticCategory.Error,
            message: "A parameter list must follow a generic type argument list. '(' expected.",
            code: 2069
        },
        Multiple_constructor_implementations_are_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Multiple constructor implementations are not allowed.",
            code: 2070
        },
        Unable_to_resolve_external_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve external module '{0}'.",
            code: 2071
        },
        Module_cannot_be_aliased_to_a_non_module_type: {
            category: DiagnosticCategory.Error,
            message: "Module cannot be aliased to a non-module type.",
            code: 2072
        },
        A_class_may_only_extend_another_class: {
            category: DiagnosticCategory.Error,
            message: "A class may only extend another class.",
            code: 2073
        },
        A_class_may_only_implement_another_class_or_interface: {
            category: DiagnosticCategory.Error,
            message: "A class may only implement another class or interface.",
            code: 2074
        },
        An_interface_may_only_extend_another_class_or_interface: {
            category: DiagnosticCategory.Error,
            message: "An interface may only extend another class or interface.",
            code: 2075
        },
        An_interface_may_not_implement_another_type: {
            category: DiagnosticCategory.Error,
            message: "An interface may not implement another type.",
            code: 2076
        },
        Unable_to_resolve_type: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve type.",
            code: 2077
        },
        Unable_to_resolve_type_of__0_: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve type of '{0}'.",
            code: 2078
        },
        Unable_to_resolve_type_parameter_constraint: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve type parameter constraint.",
            code: 2079
        },
        Type_parameter_constraint_may_not_be_a_primitive_type: {
            category: DiagnosticCategory.Error,
            message: "Type parameter constraint may not be a primitive type.",
            code: 2080
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target: {
            category: DiagnosticCategory.Error,
            message: "Supplied parameters do not match any signature of call target.",
            code: 2081
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target___0: {
            category: DiagnosticCategory.Error,
            message: "Supplied parameters do not match any signature of call target:\r\n\t{0}",
            code: 2082
        },
        Invalid__new__expression: {
            category: DiagnosticCategory.Error,
            message: "Invalid 'new' expression.",
            code: 2083
        },
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: {
            category: DiagnosticCategory.Error,
            message: "Call sigantures used in a 'new' expression must have a 'void' return type.",
            code: 2084
        },
        Could_not_select_overload_for__new__expression: {
            category: DiagnosticCategory.Error,
            message: "Could not select overload for 'new' expression.",
            code: 2085
        },
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: {
            category: DiagnosticCategory.Error,
            message: "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.",
            code: 2086
        },
        Could_not_select_overload_for__call__expression: {
            category: DiagnosticCategory.Error,
            message: "Could not select overload for 'call' expression.",
            code: 2087
        },
        Unable_to_invoke_type_with_no_call_signatures: {
            category: DiagnosticCategory.Error,
            message: "Unable to invoke type with no call signatures.",
            code: 2088
        },
        Calls_to__super__are_only_valid_inside_a_class: {
            category: DiagnosticCategory.Error,
            message: "Calls to 'super' are only valid inside a class.",
            code: 2089
        },
        Generic_type__0__requires_1_type_argument_s_: {
            category: DiagnosticCategory.Error,
            message: "Generic type '{0}' requires {1} type argument(s).",
            code: 2090
        },
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: {
            category: DiagnosticCategory.Error,
            message: "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.",
            code: 2091
        },
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: {
            category: DiagnosticCategory.Error,
            message: "Type of array literal cannot be determined. Best common type could not be found for array elements.",
            code: 2092
        },
        Could_not_find_enclosing_symbol_for_dotted_name__0_: {
            category: DiagnosticCategory.Error,
            message: "Could not find enclosing symbol for dotted name '{0}'.",
            code: 2093
        },
        Could_not_find_dotted_name__0_: {
            category: DiagnosticCategory.Error,
            message: "Could not find dotted name '{0}'.",
            code: 2094
        },
        Could_not_find_symbol__0_: {
            category: DiagnosticCategory.Error,
            message: "Could not find symbol '{0}'.",
            code: 2095
        },
        _get__and__set__accessor_must_have_the_same_type: {
            category: DiagnosticCategory.Error,
            message: "'get' and 'set' accessor must have the same type.",
            code: 2096
        },
        _this__may_not_be_referenced_in_current_location: {
            category: DiagnosticCategory.Error,
            message: "'this' may not be referenced in current location.",
            code: 2097
        },
        Use_of_deprecated_bool_type: {
            category: DiagnosticCategory.Warning,
            message: "Use of deprecated type 'bool'. Use 'boolean' instead.",
            code: 2098
        },
        Static_methods_may_not_reference_class_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "Static methods may not reference class type parameters.",
            code: 2099
        },
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: DiagnosticCategory.Error,
            message: "Class '{0}' is recursively referenced as a base type of itself.",
            code: 2100
        },
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: DiagnosticCategory.Error,
            message: "Interface '{0}' is recursively referenced as a base type of itself.",
            code: 2101
        },
        Super_property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: {
            category: DiagnosticCategory.Error,
            message: "Super property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.",
            code: 2102
        },
        _super__may_not_be_referenced_in_non_derived_classes: {
            category: DiagnosticCategory.Error,
            message: "'super' may not be referenced in non-derived classes.",
            code: 2103
        },
        If_a_derived_class_contains_initialized_properties_or_constructor_parameter_properties___the_first_statement_in_the_constructor_body_must_be_a_call_to_the_super_constructor: {
            category: DiagnosticCategory.Error,
            message: "If a derived class contains initialized properties or constructor parameter properties, the first statement in the constructor body must be a call to the super constructor.",
            code: 2104
        },
        Constructors_for_derived_classes_must_contain_a_call_to_the_class_s__super__constructor: {
            category: DiagnosticCategory.Error,
            message: "Constructors for derived classes must contain a call to the class's 'super' constructor.",
            code: 2105
        },
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: {
            category: DiagnosticCategory.Error,
            message: "Super calls are not permitted outside constructors or in local functions inside constructors.",
            code: 2106
        },
        _0_1__is_inaccessible: {
            category: DiagnosticCategory.Error,
            message: "'{0}.{1}' is inaccessible.",
            code: 2107
        },
    };

    var seenCodes = [];
    for (var name in diagnosticMessages) {
        if (diagnosticMessages.hasOwnProperty(name)) {
            var diagnosticMessage = <DiagnosticInfo>diagnosticMessages[name];
            var value = seenCodes[diagnosticMessage.code];
            if (value) {
                throw new Error("Duplicate diagnostic code: " + diagnosticMessage.code);
            }

            seenCodes[diagnosticMessage.code] = diagnosticMessage;
        }
    }
}