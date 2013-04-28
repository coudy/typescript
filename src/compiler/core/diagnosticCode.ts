///<reference path='references.ts' />

module TypeScript {
    export enum DiagnosticCode {
        error_TS_0__1,
        warning_TS_0__1,

        // Syntactic diagnostics.
        Unrecognized_escape_sequence,
        Unexpected_character_0,
        Missing_closing_quote_character,
        Identifier_expected,
        _0_keyword_expected,
        _0_expected,
        Identifier_expected__0__is_a_keyword,
        Automatic_semicolon_insertion_not_allowed,
        Unexpected_token__0_expected,
        Trailing_separator_not_allowed,
        _StarSlash__expected,
        _public_or_private_modifier_must_precede__static_,
        Unexpected_token_,
        A_catch_clause_variable_cannot_have_a_type_annotation,
        Rest_parameter_must_be_last_in_list,
        Parameter_cannot_have_question_mark_and_initializer,
        Required_parameter_cannot_follow_optional_parameter,
        Index_signatures_cannot_have_rest_parameters,
        Index_signature_parameter_cannot_have_accessibility_modifierss,
        Index_signature_parameter_cannot_have_a_question_mark,
        Index_signature_parameter_cannot_have_an_initializer,
        Index_signature_must_have_a_type_annotation,
        Index_signature_parameter_must_have_a_type_annotation,
        Index_signature_parameter_type_must_be__string__or__number_,
        _extends__clause_already_seen,
        _extends__clause_must_precede__implements__clause,
        Class_can_only_extend_single_type,
        _implements__clause_already_seen,
        Accessibility_modifier_already_seen,
        _0__modifier_must_precede__1__modifier,
        _0__modifier_already_seen,
        _0__modifier_cannot_appear_on_a_class_element,
        Interface_declaration_cannot_have__implements__clause,
        _super__invocation_cannot_have_type_arguments,
        Non_ambient_modules_cannot_use_quoted_names,
        Statements_are_not_allowed_in_ambient_contexts,
        Implementations_are_not_allowed_in_ambient_contexts,
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context,
        Initializers_are_not_allowed_in_ambient_contexts,
        Overload_and_ambient_signatures_cannot_specify_parameter_properties,
        Function_implementation_expected,
        Constructor_implementation_expected,
        Function_overload_name_must_be__0_,
        _0__modifier_cannot_appear_on_a_module_element,
        _declare__modifier_cannot_appear_on_an_interface_declaration,
        _declare__modifier_required_for_top_level_element,
        _set__accessor_must_have_only_one_parameter,
        _set__accessor_parameter_cannot_have_accessibility_modifier,
        _set__accessor_parameter_cannot_be_optional,
        _set__accessor_parameter_cannot_have_initializer,
        _set__accessor_cannot_have_rest_parameter,
        _get__accessor_cannot_have_parameters,
        Rest_parameter_cannot_be_optional,
        Rest_parameter_cannot_have_initializer,
        Modifiers_cannot_appear_here,
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher,
        Class_name_cannot_be__0_,
        Interface_name_cannot_be__0_,
        Enum_name_cannot_be__0_,
        Module_name_cannot_be__0_,




        // Semantic diagnostics.
        Duplicate_identifier__0_,
        The_name__0__does_not_exist_in_the_current_scope,
        The_name__0__does_not_refer_to_a_value,
        Keyword__super__can_only_be_used_inside_a_class_instance_method,
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer,
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__,
        Value_of_type__0__is_not_callable,
        Value_of_type__0__is_not_newable,
        Value_of_type__0__is_not_indexable_by_type__1_,
        Operator__0__cannot_be_applied_to_types__1__and__2_,
        Operator__0__cannot_be_applied_to_types__1__and__2__3,
        Cannot_convert__0__to__1_,
        Cannot_convert__0__to__1__NL__2,
        Expected_var__class__interface__or_module,
        Operator__0__cannot_be_applied_to_type__1_,
        Getter__0__already_declared,
        Setter__0__already_declared,
        Accessor_cannot_have_type_parameters,
        Exported_class__0__extends_private_class__1_,
        Exported_class__0__implements_private_interface__1_,
        Exported_interface__0__extends_private_interface__1_,
        Exported_class__0__extends_class_from_inaccessible_module__1_,
        Exported_class__0__implements_interface_from_inaccessible_module__1_,
        Exported_interface__0__extends_interface_from_inaccessible_module__1_,
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_,
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_,
        Property__0__of__exported_interface_has_or_is_using_private_type__1_,
        Exported_variable__0__has_or_is_using_private_type__1_,
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_,
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_,
        Property__0__of__exported_interface_is_using_inaccessible_module__1_,
        Exported_variable__0__is_using_inaccessible_module__1_,
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_,
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_,
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_exported_function_has_or_is_using_private_type__0_,
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_exported_function_is_using_inaccessible_module__0_,
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead,
        A_parameter_list_must_follow_a_generic_type_argument_list______expected,
        Multiple_constructor_implementations_are_not_allowed,
        Unable_to_resolve_external_module__0_,
        Module_cannot_be_aliased_to_a_non_module_type,
        A_class_may_only_extend_another_class,
        A_class_may_only_implement_another_class_or_interface,
        An_interface_may_only_extend_another_class_or_interface,
        An_interface_cannot_implement_another_type,
        Unable_to_resolve_type,
        Unable_to_resolve_type_of__0_,
        Unable_to_resolve_type_parameter_constraint,
        Type_parameter_constraint_cannot_be_a_primitive_type,
        Supplied_parameters_do_not_match_any_signature_of_call_target,
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0,
        Invalid__new__expression,
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type,
        Could_not_select_overload_for__new__expression,
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_,
        Could_not_select_overload_for__call__expression,
        Unable_to_invoke_type_with_no_call_signatures,
        Calls_to__super__are_only_valid_inside_a_class,
        Generic_type__0__requires_1_type_argument_s_,
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_,
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements,
        Could_not_find_enclosing_symbol_for_dotted_name__0_,
        The_property__0__does_not_exist_on_value_of_type__1__,
        Could_not_find_symbol__0_,
        _get__and__set__accessor_must_have_the_same_type,
        _this__cannot_be_referenced_in_current_location,
        Use_of_deprecated__bool__type__Use__boolean__instead,

        Class__0__is_recursively_referenced_as_a_base_type_of_itself,
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself,
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class,
        _super__cannot_be_referenced_in_non_derived_classes,
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties,
        Constructors_for_derived_classes_must_contain_a__super__call,
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors,
        _0_1__is_inaccessible,
        _this__cannot_be_referenced_within_module_bodies,
        _this__must_only_be_used_inside_a_function_or_script_context,
        Invalid__addition__expression___types_do_not_agree,
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type,
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type,
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type,
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation,
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_,
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter,
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_,
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter,
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter,
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type,
        Setters_cannot_return_a_value,
        Tried_to_set_variable_type_to_uninitialized_module_type,
        Tried_to_set_variable_type_to_uninitialized_module_type__0__,
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression,
        Getters_must_return_a_value,
        Getter_and_setter_accessors_do_not_agree_in_visibility,
        Invalid_left_hand_side_of_assignment_expression,
        Function_declared_a_non_void_return_type__but_has_no_return_expression,
        Cannot_resolve_return_type_reference,
        Constructors_cannot_have_a_return_type_of__void_ ,
        Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_ ,
        All_symbols_within_a__with__block_will_be_resolved_to__any__,
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module,
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2,
        Class__0__declares_class__1__but_does_not_implement_it__NL__2,
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer,
        _this__cannot_be_referenced_in_initializers_in_a_class_body,
        Class__0__cannot_extend_class__1__NL__2,
        Interface__0__cannot_extend_class__1__NL__2,
        Interface__0__cannot_extend_interface__1__NL__2,
        Duplicate_overload_signature_for__0_,
        Duplicate_constructor_overload_signature,
        Duplicate_overload_call_signature,
        Duplicate_overload_construct_signature,
        Overload_signature_is_not_compatible_with_function_definition,
        Overload_signature_is_not_compatible_with_function_definition__NL__0,
        Overload_signatures_must_all_be_public_or_private,
        Overload_signatures_must_all_be_exported_or_local,
        Overload_signatures_must_all_be_ambient_or_non_ambient,
        Overload_signatures_must_all_be_optional_or_required,
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature,
        _this__cannot_be_referenced_in_constructor_arguments,
        Static_member_cannot_be_accessed_off_an_instance_variable,
        Instance_member_cannot_be_accessed_off_a_class,
        Untyped_function_calls_may_not_accept_type_arguments,
        Non_generic_functions_may_not_accept_type_arguments,
        A_generic_type_may_not_reference_itself_with_its_own_type_parameters,
        Static_methods_cannot_reference_class_type_parameters,
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___,
        Rest_parameters_must_be_array_types,
        Overload_signature_implementation_cannot_use_specialized_type,

        // Extra information that is used as part of other error message
        Type__0__is_missing_property__1__from_type__2_,
        Types_of_property__0__of_types__1__and__2__are_incompatible,
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3,
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_,
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_,
        Types__0__and__1__define_property__2__as_private,
        Call_signatures_of_types__0__and__1__are_incompatible,
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Type__0__requires_a_call_signature__but_Type__1__lacks_one,
        Construct_signatures_of_types__0__and__1__are_incompatible,
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one,
        Index_signatures_of_types__0__and__1__are_incompatible,
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Call_signature_expects__0__or_fewer_parameters,
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_,
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function,
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function,
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor,
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property,
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible,
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3,


        //Batch compiler diagnostics
        Current_host_does_not_support__w_atch_option,
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation,
        Module_code_generation__0__not_supported___Using_default__1__code_generation,
        Could_not_find_file___0_,
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed,
        A_file_cannot_have_a_reference_itself,
        Cannot_resolve_referenced_file___0_,
        Cannot_resolve_imported_file___0_,
        Cannot_find_the_common_subdirectory_path_for_the_input_files,
        Cannot_compile_dynamic_modules_when_emitting_into_single_file,
        Emit_Error__0,
    }
}

module TypeScript {
    export var NewDiagnosticMessageInformationMap = {
        "error TS{0}: {1}": {
            category: DiagnosticCategory.NoPrefix,
            code: 0
        },
        "warning TS{0}: {1}": {
            category: DiagnosticCategory.NoPrefix,
            code: 1
        },
        "Unrecognized escape sequence.": {
            category: DiagnosticCategory.Error,
            code: 1000
        },
        "Unexpected character {0}.": {
            category: DiagnosticCategory.Error,
            code: 1001
        },
        "Missing close quote character.": {
            category: DiagnosticCategory.Error,
            code: 1002
        },
        "Identifier expected.": {
            category: DiagnosticCategory.Error,
            code: 1003
        },
        "'{0}' keyword expected.": {
            category: DiagnosticCategory.Error,
            code: 1004
        },
        "'{0}' expected.": {
            category: DiagnosticCategory.Error,
            code: 1005
        },
        "Identifier expected; '{0}' is a keyword.": {
            category: DiagnosticCategory.Error,
            code: 1006
        },
        "Automatic semicolon insertion not allowed.": {
            category: DiagnosticCategory.Error,
            code: 1007
        },
        "Unexpected token; '{0}' expected.": {
            category: DiagnosticCategory.Error,
            code: 1008
        },
        "Trailing separator not allowed.": {
            category: DiagnosticCategory.Error,
            code: 1009
        },
        "'*/' expected.": {
            category: DiagnosticCategory.Error,
            code: 1010
        },
        "'public' or 'private' modifier must precede 'static'.": {
            category: DiagnosticCategory.Error,
            code: 1011
        },
        "Unexpected token.": {
            category: DiagnosticCategory.Error,
            code: 1012
        },
        "A catch clause variable cannot have a type annotation.": {
            category: DiagnosticCategory.Error,
            code: 1013
        },
        "Rest parameter must be last in list.": {
            category: DiagnosticCategory.Error,
            code: 1014
        },
        "Parameter cannot have question mark and initializer.": {
            category: DiagnosticCategory.Error,
            code: 1015
        },
        "required parameter cannot follow optional parameter.": {
            category: DiagnosticCategory.Error,
            code: 1016
        },
        "Index signatures cannot have rest parameters.": {
            category: DiagnosticCategory.Error,
            code: 1017
        },
        "Index signature parameter cannot have accessibility modifiers.": {
            category: DiagnosticCategory.Error,
            code: 1018
        },
        "Index signature parameter cannot have a question mark.": {
            category: DiagnosticCategory.Error,
            code: 1019
        },
        "Index signature parameter cannot have an initializer.": {
            category: DiagnosticCategory.Error,
            code: 1020
        },
        "Index signature must have a type annotation.": {
            category: DiagnosticCategory.Error,
            code: 1021
        },
        "Index signature parameter must have a type annotation.": {
            category: DiagnosticCategory.Error,
            code: 1022
        },
        "Index signature parameter type must be 'string' or 'number'.": {
            category: DiagnosticCategory.Error,
            code: 1023
        },
        "'extends' clause already seen.": {
            category: DiagnosticCategory.Error,
            code: 1024
        },
        "'extends' clause must precede 'implements' clause.": {
            category: DiagnosticCategory.Error,
            code: 1025
        },
        "Class can only extend single type.": {
            category: DiagnosticCategory.Error,
            code: 1026
        },
        "'implements' clause already seen.": {
            category: DiagnosticCategory.Error,
            code: 1027
        },
        "Accessibility modifier already seen.": {
            category: DiagnosticCategory.Error,
            code: 1028
        },
        "'{0}' modifier must precede '{1}' modifier.": {
            category: DiagnosticCategory.Error,
            code: 1029
        },
        "'{0}' modifier already seen.": {
            category: DiagnosticCategory.Error,
            code: 1030
        },
        "'{0}' modifier cannot appear on a class element.": {
            category: DiagnosticCategory.Error,
            code: 1031
        },
        "Interface declaration cannot have 'implements' clause.": {
            category: DiagnosticCategory.Error,
            code: 1032
        },
        "'super' invocation cannot have type arguments.": {
            category: DiagnosticCategory.Error,
            code: 1034
        },
        "Non ambient modules cannot use quoted names.": {
            category: DiagnosticCategory.Error,
            code: 1035
        },
        "Statements are not allowed in ambient contexts.": {
            category: DiagnosticCategory.Error,
            code: 1036
        },
        "Implementations are not allowed in ambient contexts.": {
            category: DiagnosticCategory.Error,
            code: 1037
        },
        "'declare' modifier not allowed for code already in an ambient context.": {
            category: DiagnosticCategory.Error,
            code: 1038
        },
        "Initializers are not allowed in ambient contexts.": {
            category: DiagnosticCategory.Error,
            code: 1039
        },
        "Overload and ambient signatures cannot specify parameter properties.": {
            category: DiagnosticCategory.Error,
            code: 1040
        },
        "Function implementation expected.": {
            category: DiagnosticCategory.Error,
            code: 1041
        },
        "Constructor implementation expected.": {
            category: DiagnosticCategory.Error,
            code: 1042
        },
        "Function overload name must be '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 1043
        },
        "'{0}' modifier cannot appear on a module element.": {
            category: DiagnosticCategory.Error,
            code: 1044
        },
        "'declare' modifier cannot appear on an interface declaration.": {
            category: DiagnosticCategory.Error,
            code: 1045
        },
        "'declare' modifier required for top level element.": {
            category: DiagnosticCategory.Error,
            code: 1046
        },
        "Rest parameter cannot be optional.": {
            category: DiagnosticCategory.Error,
            code: 1047
        },
        "Rest parameter cannot have initializer.": {
            category: DiagnosticCategory.Error,
            code: 1048
        },
        "'set' accessor must have one and only one parameter.": {
            category: DiagnosticCategory.Error,
            code: 1049
        },
        "'set' accessor parameter cannot have accessibility modifier.": {
            category: DiagnosticCategory.Error,
            code: 1050
        },
        "'set' accessor parameter cannot be optional.": {
            category: DiagnosticCategory.Error,
            code: 1051
        },
        "'set' accessor parameter cannot have initializer.": {
            category: DiagnosticCategory.Error,
            code: 1052
        },
        "'set' accessor cannot have rest parameter.": {
            category: DiagnosticCategory.Error,
            code: 1053
        },
        "'get' accessor cannot have parameters.": {
            category: DiagnosticCategory.Error,
            code: 1054
        },
        "Modifiers cannot appear here.": {
            category: DiagnosticCategory.Error,
            code: 1055
        },
        "Accessors are only when targeting EcmaScript5 and higher.": {
            category: DiagnosticCategory.Error,
            code: 1056
        },
        "Class name cannot be '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 1057
        },
        "Interface name cannot be '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 1058
        },
        "Enum name cannot be '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 1059
        },
        "Module name cannot be '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 1060
        },
        "Duplicate identifier '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2000
        },
        "The name '{0}' does not exist in the current scope.": {
            category: DiagnosticCategory.Error,
            code: 2001
        },
        "The name '{0}' does not refer to a value.": {
            category: DiagnosticCategory.Error,
            code: 2002
        },
        "Keyword 'super' can only be used inside a class instance method.": {
            category: DiagnosticCategory.Error,
            code: 2003
        },
        "The left-hand side of an assignment expression must be a variable, property or indexer.": {
            category: DiagnosticCategory.Error,
            code: 2004
        },
        "Value of type '{0}' is not callable. Did you mean to include 'new'?": {
            category: DiagnosticCategory.Error,
            code: 2161
        },
        "Value of type '{0}' is not callable.": {
            category: DiagnosticCategory.Error,
            code: 2006
        },
        "Value of type '{0}' is not newable.": {
            category: DiagnosticCategory.Error,
            code: 2007
        },
        "Value of type '{0}' is not indexable by type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2008
        },
        "Operator '{0}' cannot be applied to types '{1}' and '{2}'.": {
            category: DiagnosticCategory.Error,
            code: 2009
        },
        "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}": {
            category: DiagnosticCategory.Error,
            code: 2010
        },
        "Cannot convert '{0}' to '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2011
        },
        "Cannot convert '{0}' to '{1}':{NL}{2}": {
            category: DiagnosticCategory.Error,
            code: 2012
        },
        "Expected var, class, interface, or module.": {
            category: DiagnosticCategory.Error,
            code: 2013
        },
        "Operator '{0}' cannot be applied to type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2014
        },
        "Getter '{0}' already declared.": {
            category: DiagnosticCategory.Error,
            code: 2015
        },
        "Setter '{0}' already declared.": {
            category: DiagnosticCategory.Error,
            code: 2016
        },
        "Accessors cannot have type parameters.": {
            category: DiagnosticCategory.Error,
            code: 2017
        },
        "Exported class '{0}' extends private class '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2018
        },
        "Exported class '{0}' implements private interface '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2019
        },
        "Exported interface '{0}' extends private interface '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2020
        },
        "Exported class '{0}' extends class from inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2021
        },
        "Exported class '{0}' implements interface from inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2022
        },
        "Exported interface '{0}' extends interface from inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2023
        },
        "Public static property '{0}' of exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2024
        },
        "Public property '{0}' of exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2025
        },
        "Property '{0}' of exported interface has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2026
        },
        "Exported variable '{0}' has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2027
        },
        "Public static property '{0}' of exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2028
        },
        "Public property '{0}' of exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2029
        },
        "Property '{0}' of exported interface is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2030
        },
        "Exported variable '{0}' is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2031
        },
        "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2032
        },
        "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2033
        },
        "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2034
        },
        "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2035
        },
        "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2036
        },
        "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2037
        },
        "Parameter '{0}' of public method from exported class has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2038
        },
        "Parameter '{0}' of method from exported interface has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2039
        },
        "Parameter '{0}' of exported function has or is using private type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2040
        },
        "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2041
        },
        "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2042
        },
        "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2043
        },
        "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2044
        },
        "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}": {
            category: DiagnosticCategory.Error,
            code: 2045
        },
        "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2046
        },
        "Parameter '{0}' of public method from exported class is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2047
        },
        "Parameter '{0}' of method from exported interface is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2048
        },
        "Parameter '{0}' of exported function is using inaccessible module {1}.": {
            category: DiagnosticCategory.Error,
            code: 2049
        },
        "Return type of public static property getter from exported class has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2050
        },
        "Return type of public property getter from exported class has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2051
        },
        "Return type of constructor signature from exported interface has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2052
        },
        "Return type of call signature from exported interface has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2053
        },
        "Return type of index signature from exported interface has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2054
        },
        "Return type of public static method from exported class has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2055
        },
        "Return type of public method from exported class has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2056
        },
        "Return type of method from exported interface has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2057
        },
        "Return type of exported function has or is using private type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2058
        },
        "Return type of public static property getter from exported class is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2059
        },
        "Return type of public property getter from exported class is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2060
        },
        "Return type of constructor signature from exported interface is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2061
        },
        "Return type of call signature from exported interface is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2062
        },
        "Return type of index signature from exported interface is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2063
        },
        "Return type of public static method from exported class is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2064
        },
        "Return type of public method from exported class is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2065
        },
        "Return type of method from exported interface is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2066
        },
        "Return type of exported function is using inaccessible module {0}.": {
            category: DiagnosticCategory.Error,
            code: 2067
        },
        "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.": {
            category: DiagnosticCategory.Error,
            code: 2068
        },
        "A parameter list must follow a generic type argument list. '(' expected.": {
            category: DiagnosticCategory.Error,
            code: 2069
        },
        "Multiple constructor implementations are not allowed.": {
            category: DiagnosticCategory.Error,
            code: 2070
        },
        "Unable to resolve external module '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2071
        },
        "Module cannot be aliased to a non-module type.": {
            category: DiagnosticCategory.Error,
            code: 2072
        },
        "A class may only extend another class.": {
            category: DiagnosticCategory.Error,
            code: 2073
        },
        "A class may only implement another class or interface.": {
            category: DiagnosticCategory.Error,
            code: 2074
        },
        "An interface may only extend another class or interface.": {
            category: DiagnosticCategory.Error,
            code: 2075
        },
        "An interface cannot implement another type.": {
            category: DiagnosticCategory.Error,
            code: 2076
        },
        "Unable to resolve type.": {
            category: DiagnosticCategory.Error,
            code: 2077
        },
        "Unable to resolve type of '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2078
        },
        "Unable to resolve type parameter constraint.": {
            category: DiagnosticCategory.Error,
            code: 2079
        },
        "Type parameter constraint cannot be a primitive type.": {
            category: DiagnosticCategory.Error,
            code: 2080
        },
        "Supplied parameters do not match any signature of call target.": {
            category: DiagnosticCategory.Error,
            code: 2081
        },
        "Supplied parameters do not match any signature of call target:{NL}{0}": {
            category: DiagnosticCategory.Error,
            code: 2082
        },
        "Invalid 'new' expression.": {
            category: DiagnosticCategory.Error,
            code: 2083
        },
        "Call sigantures used in a 'new' expression must have a 'void' return type.": {
            category: DiagnosticCategory.Error,
            code: 2084
        },
        "Could not select overload for 'new' expression.": {
            category: DiagnosticCategory.Error,
            code: 2085
        },
        "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.": {
            category: DiagnosticCategory.Error,
            code: 2086
        },
        "Could not select overload for 'call' expression.": {
            category: DiagnosticCategory.Error,
            code: 2087
        },
        "Unable to invoke type with no call signatures.": {
            category: DiagnosticCategory.Error,
            code: 2088
        },
        "Calls to 'super' are only valid inside a class.": {
            category: DiagnosticCategory.Error,
            code: 2089
        },
        "Generic type '{0}' requires {1} type argument(s).": {
            category: DiagnosticCategory.Error,
            code: 2090
        },
        "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2091
        },
        "Type of array literal cannot be determined. Best common type could not be found for array elements.": {
            category: DiagnosticCategory.Error,
            code: 2092
        },
        "Could not find enclosing symbol for dotted name '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2093
        },
        "The property '{0}' does not exist on value of type '{1}'.": {
            category: DiagnosticCategory.Error,
            code: 2094
        },
        "Could not find symbol '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2095
        },
        "'get' and 'set' accessor must have the same type.": {
            category: DiagnosticCategory.Error,
            code: 2096
        },
        "'this' cannot be referenced in current location.": {
            category: DiagnosticCategory.Error,
            code: 2097
        },
        "Use of deprecated type 'bool'. Use 'boolean' instead.": {
            category: DiagnosticCategory.Warning,
            code: 2098
        },
        "Static methods cannot reference class type parameters.": {
            category: DiagnosticCategory.Error,
            code: 2099
        },
        "Class '{0}' is recursively referenced as a base type of itself.": {
            category: DiagnosticCategory.Error,
            code: 2100
        },
        "Interface '{0}' is recursively referenced as a base type of itself.": {
            category: DiagnosticCategory.Error,
            code: 2101
        },
        "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.": {
            category: DiagnosticCategory.Error,
            code: 2102
        },
        "'super' cannot be referenced in non-derived classes.": {
            category: DiagnosticCategory.Error,
            code: 2103
        },
        "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.": {
            category: DiagnosticCategory.Error,
            code: 2104
        },
        "Constructors for derived classes must contain a 'super' call.": {
            category: DiagnosticCategory.Error,
            code: 2105
        },
        "Super calls are not permitted outside constructors or in local functions inside constructors.": {
            category: DiagnosticCategory.Error,
            code: 2106
        },
        "'{0}.{1}' is inaccessible.": {
            category: DiagnosticCategory.Error,
            code: 2107
        },
        "'this' cannot be referenced within module bodies.": {
            category: DiagnosticCategory.Error,
            code: 2108
        },
        "'this' must only be used inside a function or script context.": {
            category: DiagnosticCategory.Error,
            code: 2109
        },
        "Invalid '+' expression - types not known to support the addition operator.": {
            category: DiagnosticCategory.Error,
            code: 2111
        },
        "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.": {
            category: DiagnosticCategory.Error,
            code: 2112
        },
        "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.": {
            category: DiagnosticCategory.Error,
            code: 2113
        },
        "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.": {
            category: DiagnosticCategory.Error,
            code: 2114
        },
        "Variable declarations for for/in expressions cannot contain a type annotation.": {
            category: DiagnosticCategory.Error,
            code: 2115
        },
        "Variable declarations for for/in expressions must be of types 'string' or 'any'.": {
            category: DiagnosticCategory.Error,
            code: 2116
        },
        "The right operand of a for/in expression must be of type 'any', an object type or a type parameter.": {
            category: DiagnosticCategory.Error,
            code: 2117
        },
        "The left-hand side of an 'in' expression must be of types 'string' or 'any'.": {
            category: DiagnosticCategory.Error,
            code: 2118
        },
        "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.": {
            category: DiagnosticCategory.Error,
            code: 2119
        },
        "The left-hand side of an 'instanceOf' expression must be of type 'any', an object type or a type parameter.": {
            category: DiagnosticCategory.Error,
            code: 2120
        },
        "The right-hand side of an 'instanceOf' expression must be of type 'any' or a subtype of the 'Function' interface type.": {
            category: DiagnosticCategory.Error,
            code: 2121
        },
        "Setters cannot return a value.": {
            category: DiagnosticCategory.Error,
            code: 2122
        },
        "Tried to set variable type to uninitialized module type.": {
            category: DiagnosticCategory.Error,
            code: 2123
        },
        "Tried to set variable type to uninitialized module type '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2124
        },
        "Function {0} declared a non-void return type, but has no return expression.": {
            category: DiagnosticCategory.Error,
            code: 2125
        },
        "Getters must return a value.": {
            category: DiagnosticCategory.Error,
            code: 2126
        },
        "Getter and setter accessors do not agree in visibility.": {
            category: DiagnosticCategory.Error,
            code: 2127
        },
        "Invalid left-hand side of assignment expression.": {
            category: DiagnosticCategory.Error,
            code: 2130
        },
        "Function declared a non-void return type, but has no return expression.": {
            category: DiagnosticCategory.Error,
            code: 2131
        },
        "Cannot resolve return type reference.": {
            category: DiagnosticCategory.Error,
            code: 2132
        },
        "Constructors cannot have a return type of 'void'.": {
            category: DiagnosticCategory.Error,
            code: 2133
        },
        "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'": {
            category: DiagnosticCategory.Error,
            code: 2134
        },
        "All symbols within a with block will be resolved to 'any'.": {
            category: DiagnosticCategory.Error,
            code: 2135
        },
        "Import declarations in an internal module cannot reference an external module.": {
            category: DiagnosticCategory.Error,
            code: 2136
        },
        "Class {0} declares interface {1} but does not implement it:{NL}{2}": {
            category: DiagnosticCategory.Error,
            code: 2137
        },
        "Class {0} declares class {1} as an implemented interface but does not implement it:{NL}{2}": {
            category: DiagnosticCategory.Error,
            code: 2138
        },
        "The operand of an increment or decrement operator must be a variable, property or indexer.": {
            category: DiagnosticCategory.Error,
            code: 2139
        },
        "'this' cannot be referenced in initializers in a class body.": {
            category: DiagnosticCategory.Error,
            code: 2140
        },
        "Class '{0}' cannot extend class '{1}':{NL}{2}": {
            category: DiagnosticCategory.Error,
            code: 2141
        },
        "Interface '{0}' cannot extend class '{1}':{NL}{2}": {
            category: DiagnosticCategory.Error,
            code: 2142
        },
        "Interface '{0}' cannot extend interface '{1}':{NL}{2}": {
            category: DiagnosticCategory.Error,
            code: 2143
        },
        "Duplicate overload signature for '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 2144
        },
        "Duplicate constructor overload signature.": {
            category: DiagnosticCategory.Error,
            code: 2145
        },
        "Duplicate overload call signature.": {
            category: DiagnosticCategory.Error,
            code: 2146
        },
        "Duplicate overload construct signature.": {
            category: DiagnosticCategory.Error,
            code: 2147
        },
        "Overload signature is not compatible with function definition.": {
            category: DiagnosticCategory.Error,
            code: 2148
        },
        "Overload signature is not compatible with function definition:{NL}{0}": {
            category: DiagnosticCategory.Error,
            code: 2149
        },
        "Overload signatures must all be public or private.": {
            category: DiagnosticCategory.Error,
            code: 2150
        },
        "Overload signatures must all be exported or local.": {
            category: DiagnosticCategory.Error,
            code: 2151
        },
        "Overload signatures must all be ambient or non-ambient.": {
            category: DiagnosticCategory.Error,
            code: 2152
        },
        "Overload signatures must all be optional or required.": {
            category: DiagnosticCategory.Error,
            code: 2153
        },
        "Specialized overload signature is not subtype of any non-specialized signature.": {
            category: DiagnosticCategory.Error,
            code: 2154
        },
        "'this' cannot be referenced in constructor arguments.": {
            category: DiagnosticCategory.Error,
            code: 2155
        },
        "Static member cannot be accessed off an instance variable.": {
            category: DiagnosticCategory.Error,
            code: 2156
        },
        "Instance member cannot be accessed off a class.": {
            category: DiagnosticCategory.Error,
            code: 2157
        },
        "Untyped function calls may not accept type arguments.": {
            category: DiagnosticCategory.Error,
            code: 2158
        },
        "Non-generic functions may not accept type arguments.": {
            category: DiagnosticCategory.Error,
            code: 2159
        },
        "A generic type may not reference itself with its own type parameters.": {
            category: DiagnosticCategory.Error,
            code: 2160
        },
        "Rest parameters must be array types.": {
            category: DiagnosticCategory.Error,
            code: 2162
        },
        "Overload signature implementation cannot use specialized type.": {
            category: DiagnosticCategory.Error,
            code: 2163
        },
        "Type '{0}' is missing property '{1}' from type '{2}'.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4000
        },
        "Types of property '{0}' of types '{1}' and '{2}' are incompatible.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4001
        },
        "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}": {
            category: DiagnosticCategory.NoPrefix,
            code: 4002
        },
        "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4003
        },
        "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4004
        },
        "Types '{0}' and '{1}' define property '{2}' as private.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4005
        },
        "Call signatures of types '{0}' and '{1}' are incompatible.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4006
        },
        "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": {
            category: DiagnosticCategory.NoPrefix,
            code: 4007
        },
        "Type '{0}' requires a call signature, but type '{1}' lacks one.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4008
        },
        "Construct signatures of types '{0}' and '{1}' are incompatible.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4009
        },
        "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": {
            category: DiagnosticCategory.NoPrefix,
            code: 40010
        },
        "Type '{0}' requires a construct signature, but type '{1}' lacks one.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4011
        },
        "Index signatures of types '{0}' and '{1}' are incompatible.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4012
        },
        "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": {
            category: DiagnosticCategory.NoPrefix,
            code: 4013
        },
        "Call signature expects {0} or fewer parameters.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4014
        },
        "Could not apply type'{0}' to argument {1} which is of type '{2}'.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4015
        },
        "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4016
        },
        "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4017
        },
        "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4018
        },
        "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4019
        },
        "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.": {
            category: DiagnosticCategory.NoPrefix,
            code: 4020
        },
        "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}": {
            category: DiagnosticCategory.NoPrefix,
            code: 4021
        },
        "Current host does not support -w[atch] option.": {
            category: DiagnosticCategory.Error,
            code: 5001
        },
        "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.": {
            category: DiagnosticCategory.Warning,
            code: 5002
        },
        "Module code generation '{0}' not supported.  Using default '{1}' code generation.": {
            category: DiagnosticCategory.Warning,
            code: 5003
        },
        "Could not find file: '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 5004
        },
        "Unknown extension for file: '{0}'. Only .ts and .d.ts extensions are allowed.": {
            category: DiagnosticCategory.Error,
            code: 5005
        },
        "A file cannot have a reference itself.": {
            category: DiagnosticCategory.Error,
            code: 5006
        },
        "Cannot resolve referenced file: '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 5007
        },
        "Cannot resolve imported file: '{0}'.": {
            category: DiagnosticCategory.Error,
            code: 5008
        },
        "Cannot find the common subdirectory path for the input files": {
            category: DiagnosticCategory.Error,
            code: 5009
        },
        "Cannot compile dynamic modules when emitting into single file": {
            category: DiagnosticCategory.Error,
            code: 5010
        },
        "Emit Error: {0}.": {
            category: DiagnosticCategory.Error,
            code: 5011
        }
    };

    export var EN_US_DiagnosticMessages = {
        "error TS{0}: {1}": "error TS{0}: {1}",
        "warning TS{0}: {1}": "warning TS{0}: {1}",
        "Unrecognized escape sequence.": "Unrecognized escape sequence.",
        "Unexpected character {0}.": "Unexpected character {0}.",
        "Missing close quote character.": "Missing close quote character.",
        "Identifier expected.": "Identifier expected.",
        "'{0}' keyword expected.": "'{0}' keyword expected.",
        "'{0}' expected.": "'{0}' expected.",
        "Identifier expected; '{0}' is a keyword.": "Identifier expected; '{0}' is a keyword.",
        "Automatic semicolon insertion not allowed.": "Automatic semicolon insertion not allowed.",
        "Unexpected token; '{0}' expected.": "Unexpected token; '{0}' expected.",
        "Trailing separator not allowed.": "Trailing separator not allowed.",
        "'*/' expected.": "'*/' expected.",
        "'public' or 'private' modifier must precede 'static'.": "'public' or 'private' modifier must precede 'static'.",
        "Unexpected token.": "Unexpected token.",
        "A catch clause variable cannot have a type annotation.": "A catch clause variable cannot have a type annotation.",
        "Rest parameter must be last in list.": "Rest parameter must be last in list.",
        "Parameter cannot have question mark and initializer.": "Parameter cannot have question mark and initializer.",
        "required parameter cannot follow optional parameter.": "required parameter cannot follow optional parameter.",
        "Index signatures cannot have rest parameters.": "Index signatures cannot have rest parameters.",
        "Index signature parameter cannot have accessibility modifiers.": "Index signature parameter cannot have accessibility modifiers.",
        "Index signature parameter cannot have a question mark.": "Index signature parameter cannot have a question mark.",
        "Index signature parameter cannot have an initializer.": "Index signature parameter cannot have an initializer.",
        "Index signature must have a type annotation.": "Index signature must have a type annotation.",
        "Index signature parameter must have a type annotation.": "Index signature parameter must have a type annotation.",
        "Index signature parameter type must be 'string' or 'number'.": "Index signature parameter type must be 'string' or 'number'.",
        "'extends' clause already seen.": "'extends' clause already seen.",
        "'extends' clause must precede 'implements' clause.": "'extends' clause must precede 'implements' clause.",
        "Class can only extend single type.": "Class can only extend single type.",
        "'implements' clause already seen.": "'implements' clause already seen.",
        "Accessibility modifier already seen.": "Accessibility modifier already seen.",
        "'{0}' modifier must precede '{1}' modifier.": "'{0}' modifier must precede '{1}' modifier.",
        "'{0}' modifier already seen.": "'{0}' modifier already seen.",
        "'{0}' modifier cannot appear on a class element.": "'{0}' modifier cannot appear on a class element.",
        "Interface declaration cannot have 'implements' clause.": "Interface declaration cannot have 'implements' clause.",
        "'super' invocation cannot have type arguments.": "'super' invocation cannot have type arguments.",
        "Non ambient modules cannot use quoted names.": "Non ambient modules cannot use quoted names.",
        "Statements are not allowed in ambient contexts.": "Statements are not allowed in ambient contexts.",
        "Implementations are not allowed in ambient contexts.": "Implementations are not allowed in ambient contexts.",
        "'declare' modifier not allowed for code already in an ambient context.": "'declare' modifier not allowed for code already in an ambient context.",
        "Initializers are not allowed in ambient contexts.": "Initializers are not allowed in ambient contexts.",
        "Overload and ambient signatures cannot specify parameter properties.": "Overload and ambient signatures cannot specify parameter properties.",
        "Function implementation expected.": "Function implementation expected.",
        "Constructor implementation expected.": "Constructor implementation expected.",
        "Function overload name must be '{0}'.": "Function overload name must be '{0}'.",
        "'{0}' modifier cannot appear on a module element.": "'{0}' modifier cannot appear on a module element.",
        "'declare' modifier cannot appear on an interface declaration.": "'declare' modifier cannot appear on an interface declaration.",
        "'declare' modifier required for top level element.": "'declare' modifier required for top level element.",
        "Rest parameter cannot be optional.": "Rest parameter cannot be optional.",
        "Rest parameter cannot have initializer.": "Rest parameter cannot have initializer.",
        "'set' accessor must have one and only one parameter.": "'set' accessor must have one and only one parameter.",
        "'set' accessor parameter cannot have accessibility modifier.": "'set' accessor parameter cannot have accessibility modifier.",
        "'set' accessor parameter cannot be optional.": "'set' accessor parameter cannot be optional.",
        "'set' accessor parameter cannot have initializer.": "'set' accessor parameter cannot have initializer.",
        "'set' accessor cannot have rest parameter.": "'set' accessor cannot have rest parameter.",
        "'get' accessor cannot have parameters.": "'get' accessor cannot have parameters.",
        "Modifiers cannot appear here.": "Modifiers cannot appear here.",
        "Accessors are only when targeting EcmaScript5 and higher.": "Accessors are only when targeting EcmaScript5 and higher.",
        "Class name cannot be '{0}'.": "Class name cannot be '{0}'.",
        "Interface name cannot be '{0}'.": "Interface name cannot be '{0}'.",
        "Enum name cannot be '{0}'.": "Enum name cannot be '{0}'.",
        "Module name cannot be '{0}'.": "Module name cannot be '{0}'.",
        "Duplicate identifier '{0}'.": "Duplicate identifier '{0}'.",
        "The name '{0}' does not exist in the current scope.": "The name '{0}' does not exist in the current scope.",
        "The name '{0}' does not refer to a value.": "The name '{0}' does not refer to a value.",
        "Keyword 'super' can only be used inside a class instance method.": "Keyword 'super' can only be used inside a class instance method.",
        "The left-hand side of an assignment expression must be a variable, property or indexer.": "The left-hand side of an assignment expression must be a variable, property or indexer.",
        "Value of type '{0}' is not callable. Did you mean to include 'new'?": "Value of type '{0}' is not callable. Did you mean to include 'new'?",
        "Value of type '{0}' is not callable.": "Value of type '{0}' is not callable.",
        "Value of type '{0}' is not newable.": "Value of type '{0}' is not newable.",
        "Value of type '{0}' is not indexable by type '{1}'.": "Value of type '{0}' is not indexable by type '{1}'.",
        "Operator '{0}' cannot be applied to types '{1}' and '{2}'.": "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
        "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}": "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
        "Cannot convert '{0}' to '{1}'.": "Cannot convert '{0}' to '{1}'.",
        "Cannot convert '{0}' to '{1}':{NL}{2}": "Cannot convert '{0}' to '{1}':{NL}{2}",
        "Expected var, class, interface, or module.": "Expected var, class, interface, or module.",
        "Operator '{0}' cannot be applied to type '{1}'.": "Operator '{0}' cannot be applied to type '{1}'.",
        "Getter '{0}' already declared.": "Getter '{0}' already declared.",
        "Setter '{0}' already declared.": "Setter '{0}' already declared.",
        "Accessors cannot have type parameters.": "Accessors cannot have type parameters.",
        "Exported class '{0}' extends private class '{1}'.": "Exported class '{0}' extends private class '{1}'.",
        "Exported class '{0}' implements private interface '{1}'.": "Exported class '{0}' implements private interface '{1}'.",
        "Exported interface '{0}' extends private interface '{1}'.": "Exported interface '{0}' extends private interface '{1}'.",
        "Exported class '{0}' extends class from inaccessible module {1}.": "Exported class '{0}' extends class from inaccessible module {1}.",
        "Exported class '{0}' implements interface from inaccessible module {1}.": "Exported class '{0}' implements interface from inaccessible module {1}.",
        "Exported interface '{0}' extends interface from inaccessible module {1}.": "Exported interface '{0}' extends interface from inaccessible module {1}.",
        "Public static property '{0}' of exported class has or is using private type '{1}'.": "Public static property '{0}' of exported class has or is using private type '{1}'.",
        "Public property '{0}' of exported class has or is using private type '{1}'.": "Public property '{0}' of exported class has or is using private type '{1}'.",
        "Property '{0}' of exported interface has or is using private type '{1}'.": "Property '{0}' of exported interface has or is using private type '{1}'.",
        "Exported variable '{0}' has or is using private type '{1}'.": "Exported variable '{0}' has or is using private type '{1}'.",
        "Public static property '{0}' of exported class is using inaccessible module {1}.": "Public static property '{0}' of exported class is using inaccessible module {1}.",
        "Public property '{0}' of exported class is using inaccessible module {1}.": "Public property '{0}' of exported class is using inaccessible module {1}.",
        "Property '{0}' of exported interface is using inaccessible module {1}.": "Property '{0}' of exported interface is using inaccessible module {1}.",
        "Exported variable '{0}' is using inaccessible module {1}.": "Exported variable '{0}' is using inaccessible module {1}.",
        "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.": "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.",
        "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.": "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.",
        "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.": "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.",
        "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.": "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.",
        "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.": "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.",
        "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.": "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.",
        "Parameter '{0}' of public method from exported class has or is using private type '{1}'.": "Parameter '{0}' of public method from exported class has or is using private type '{1}'.",
        "Parameter '{0}' of method from exported interface has or is using private type '{1}'.": "Parameter '{0}' of method from exported interface has or is using private type '{1}'.",
        "Parameter '{0}' of exported function has or is using private type '{1}'.": "Parameter '{0}' of exported function has or is using private type '{1}'.",
        "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.": "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.",
        "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.": "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.",
        "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.": "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.",
        "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.": "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.",
        "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}": "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}",
        "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.": "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.",
        "Parameter '{0}' of public method from exported class is using inaccessible module {1}.": "Parameter '{0}' of public method from exported class is using inaccessible module {1}.",
        "Parameter '{0}' of method from exported interface is using inaccessible module {1}.": "Parameter '{0}' of method from exported interface is using inaccessible module {1}.",
        "Parameter '{0}' of exported function is using inaccessible module {1}.": "Parameter '{0}' of exported function is using inaccessible module {1}.",
        "Return type of public static property getter from exported class has or is using private type '{0}'.": "Return type of public static property getter from exported class has or is using private type '{0}'.",
        "Return type of public property getter from exported class has or is using private type '{0}'.": "Return type of public property getter from exported class has or is using private type '{0}'.",
        "Return type of constructor signature from exported interface has or is using private type '{0}'.": "Return type of constructor signature from exported interface has or is using private type '{0}'.",
        "Return type of call signature from exported interface has or is using private type '{0}'.": "Return type of call signature from exported interface has or is using private type '{0}'.",
        "Return type of index signature from exported interface has or is using private type '{0}'.": "Return type of index signature from exported interface has or is using private type '{0}'.",
        "Return type of public static method from exported class has or is using private type '{0}'.": "Return type of public static method from exported class has or is using private type '{0}'.",
        "Return type of public method from exported class has or is using private type '{0}'.": "Return type of public method from exported class has or is using private type '{0}'.",
        "Return type of method from exported interface has or is using private type '{0}'.": "Return type of method from exported interface has or is using private type '{0}'.",
        "Return type of exported function has or is using private type '{0}'.": "Return type of exported function has or is using private type '{0}'.",
        "Return type of public static property getter from exported class is using inaccessible module {0}.": "Return type of public static property getter from exported class is using inaccessible module {0}.",
        "Return type of public property getter from exported class is using inaccessible module {0}.": "Return type of public property getter from exported class is using inaccessible module {0}.",
        "Return type of constructor signature from exported interface is using inaccessible module {0}.": "Return type of constructor signature from exported interface is using inaccessible module {0}.",
        "Return type of call signature from exported interface is using inaccessible module {0}.": "Return type of call signature from exported interface is using inaccessible module {0}.",
        "Return type of index signature from exported interface is using inaccessible module {0}.": "Return type of index signature from exported interface is using inaccessible module {0}.",
        "Return type of public static method from exported class is using inaccessible module {0}.": "Return type of public static method from exported class is using inaccessible module {0}.",
        "Return type of public method from exported class is using inaccessible module {0}.": "Return type of public method from exported class is using inaccessible module {0}.",
        "Return type of method from exported interface is using inaccessible module {0}.": "Return type of method from exported interface is using inaccessible module {0}.",
        "Return type of exported function is using inaccessible module {0}.": "Return type of exported function is using inaccessible module {0}.",
        "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.": "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.",
        "A parameter list must follow a generic type argument list. '(' expected.": "A parameter list must follow a generic type argument list. '(' expected.",
        "Multiple constructor implementations are not allowed.": "Multiple constructor implementations are not allowed.",
        "Unable to resolve external module '{0}'.": "Unable to resolve external module '{0}'.",
        "Module cannot be aliased to a non-module type.": "Module cannot be aliased to a non-module type.",
        "A class may only extend another class.": "A class may only extend another class.",
        "A class may only implement another class or interface.": "A class may only implement another class or interface.",
        "An interface may only extend another class or interface.": "An interface may only extend another class or interface.",
        "An interface cannot implement another type.": "An interface cannot implement another type.",
        "Unable to resolve type.": "Unable to resolve type.",
        "Unable to resolve type of '{0}'.": "Unable to resolve type of '{0}'.",
        "Unable to resolve type parameter constraint.": "Unable to resolve type parameter constraint.",
        "Type parameter constraint cannot be a primitive type.": "Type parameter constraint cannot be a primitive type.",
        "Supplied parameters do not match any signature of call target.": "Supplied parameters do not match any signature of call target.",
        "Supplied parameters do not match any signature of call target:{NL}{0}": "Supplied parameters do not match any signature of call target:{NL}{0}",
        "Invalid 'new' expression.": "Invalid 'new' expression.",
        "Call sigantures used in a 'new' expression must have a 'void' return type.": "Call sigantures used in a 'new' expression must have a 'void' return type.",
        "Could not select overload for 'new' expression.": "Could not select overload for 'new' expression.",
        "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.": "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.",
        "Could not select overload for 'call' expression.": "Could not select overload for 'call' expression.",
        "Unable to invoke type with no call signatures.": "Unable to invoke type with no call signatures.",
        "Calls to 'super' are only valid inside a class.": "Calls to 'super' are only valid inside a class.",
        "Generic type '{0}' requires {1} type argument(s).": "Generic type '{0}' requires {1} type argument(s).",
        "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.": "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.",
        "Type of array literal cannot be determined. Best common type could not be found for array elements.": "Type of array literal cannot be determined. Best common type could not be found for array elements.",
        "Could not find enclosing symbol for dotted name '{0}'.": "Could not find enclosing symbol for dotted name '{0}'.",
        "The property '{0}' does not exist on value of type '{1}'.": "The property '{0}' does not exist on value of type '{1}'.",
        "Could not find symbol '{0}'.": "Could not find symbol '{0}'.",
        "'get' and 'set' accessor must have the same type.": "'get' and 'set' accessor must have the same type.",
        "'this' cannot be referenced in current location.": "'this' cannot be referenced in current location.",
        "Use of deprecated type 'bool'. Use 'boolean' instead.": "Use of deprecated type 'bool'. Use 'boolean' instead.",
        "Static methods cannot reference class type parameters.": "Static methods cannot reference class type parameters.",
        "Class '{0}' is recursively referenced as a base type of itself.": "Class '{0}' is recursively referenced as a base type of itself.",
        "Interface '{0}' is recursively referenced as a base type of itself.": "Interface '{0}' is recursively referenced as a base type of itself.",
        "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.": "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.",
        "'super' cannot be referenced in non-derived classes.": "'super' cannot be referenced in non-derived classes.",
        "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.": "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.",
        "Constructors for derived classes must contain a 'super' call.": "Constructors for derived classes must contain a 'super' call.",
        "Super calls are not permitted outside constructors or in local functions inside constructors.": "Super calls are not permitted outside constructors or in local functions inside constructors.",
        "'{0}.{1}' is inaccessible.": "'{0}.{1}' is inaccessible.",
        "'this' cannot be referenced within module bodies.": "'this' cannot be referenced within module bodies.",
        "'this' must only be used inside a function or script context.": "'this' must only be used inside a function or script context.",
        "Invalid '+' expression - types not known to support the addition operator.": "Invalid '+' expression - types not known to support the addition operator.",
        "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.": "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
        "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.": "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
        "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.": "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.",
        "Variable declarations for for/in expressions cannot contain a type annotation.": "Variable declarations for for/in expressions cannot contain a type annotation.",
        "Variable declarations for for/in expressions must be of types 'string' or 'any'.": "Variable declarations for for/in expressions must be of types 'string' or 'any'.",
        "The right operand of a for/in expression must be of type 'any', an object type or a type parameter.": "The right operand of a for/in expression must be of type 'any', an object type or a type parameter.",
        "The left-hand side of an 'in' expression must be of types 'string' or 'any'.": "The left-hand side of an 'in' expression must be of types 'string' or 'any'.",
        "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.": "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.",
        "The left-hand side of an 'instanceOf' expression must be of type 'any', an object type or a type parameter.": "The left-hand side of an 'instanceOf' expression must be of type 'any', an object type or a type parameter.",
        "The right-hand side of an 'instanceOf' expression must be of type 'any' or a subtype of the 'Function' interface type.": "The right-hand side of an 'instanceOf' expression must be of type 'any' or a subtype of the 'Function' interface type.",
        "Setters cannot return a value.": "Setters cannot return a value.",
        "Tried to set variable type to uninitialized module type.": "Tried to set variable type to uninitialized module type.",
        "Tried to set variable type to uninitialized module type '{0}'.": "Tried to set variable type to uninitialized module type '{0}'.",
        "Function {0} declared a non-void return type, but has no return expression.": "Function {0} declared a non-void return type, but has no return expression.",
        "Getters must return a value.": "Getters must return a value.",
        "Getter and setter accessors do not agree in visibility.": "Getter and setter accessors do not agree in visibility.",
        "Invalid left-hand side of assignment expression.": "Invalid left-hand side of assignment expression.",
        "Function declared a non-void return type, but has no return expression.": "Function declared a non-void return type, but has no return expression.",
        "Cannot resolve return type reference.": "Cannot resolve return type reference.",
        "Constructors cannot have a return type of 'void'.": "Constructors cannot have a return type of 'void'.",
        "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'": "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'",
        "All symbols within a with block will be resolved to 'any'.": "All symbols within a with block will be resolved to 'any'.",
        "Import declarations in an internal module cannot reference an external module.": "Import declarations in an internal module cannot reference an external module.",
        "Class {0} declares interface {1} but does not implement it:{NL}{2}": "Class {0} declares interface {1} but does not implement it:{NL}{2}",
        "Class {0} declares class {1} as an implemented interface but does not implement it:{NL}{2}": "Class {0} declares class {1} as an implemented interface but does not implement it:{NL}{2}",
        "The operand of an increment or decrement operator must be a variable, property or indexer.": "The operand of an increment or decrement operator must be a variable, property or indexer.",
        "'this' cannot be referenced in initializers in a class body.": "'this' cannot be referenced in initializers in a class body.",
        "Class '{0}' cannot extend class '{1}':{NL}{2}": "Class '{0}' cannot extend class '{1}':{NL}{2}",
        "Interface '{0}' cannot extend class '{1}':{NL}{2}": "Interface '{0}' cannot extend class '{1}':{NL}{2}",
        "Interface '{0}' cannot extend interface '{1}':{NL}{2}": "Interface '{0}' cannot extend interface '{1}':{NL}{2}",
        "Duplicate overload signature for '{0}'.": "Duplicate overload signature for '{0}'.",
        "Duplicate constructor overload signature.": "Duplicate constructor overload signature.",
        "Duplicate overload call signature.": "Duplicate overload call signature.",
        "Duplicate overload construct signature.": "Duplicate overload construct signature.",
        "Overload signature is not compatible with function definition.": "Overload signature is not compatible with function definition.",
        "Overload signature is not compatible with function definition:{NL}{0}": "Overload signature is not compatible with function definition:{NL}{0}",
        "Overload signatures must all be public or private.": "Overload signatures must all be public or private.",
        "Overload signatures must all be exported or local.": "Overload signatures must all be exported or local.",
        "Overload signatures must all be ambient or non-ambient.": "Overload signatures must all be ambient or non-ambient.",
        "Overload signatures must all be optional or required.": "Overload signatures must all be optional or required.",
        "Specialized overload signature is not subtype of any non-specialized signature.": "Specialized overload signature is not subtype of any non-specialized signature.",
        "'this' cannot be referenced in constructor arguments.": "'this' cannot be referenced in constructor arguments.",
        "Static member cannot be accessed off an instance variable.": "Static member cannot be accessed off an instance variable.",
        "Instance member cannot be accessed off a class.": "Instance member cannot be accessed off a class.",
        "Untyped function calls may not accept type arguments.": "Untyped function calls may not accept type arguments.",
        "Non-generic functions may not accept type arguments.": "Non-generic functions may not accept type arguments.",
        "A generic type may not reference itself with its own type parameters.": "A generic type may not reference itself with its own type parameters.",
        "Rest parameters must be array types.": "Rest parameters must be array types.",
        "Overload signature implementation cannot use specialized type.": "Overload signature implementation cannot use specialized type.",
        "Type '{0}' is missing property '{1}' from type '{2}'.": "Type '{0}' is missing property '{1}' from type '{2}'.",
        "Types of property '{0}' of types '{1}' and '{2}' are incompatible.": "Types of property '{0}' of types '{1}' and '{2}' are incompatible.",
        "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}": "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}",
        "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.": "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.",
        "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.": "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.",
        "Types '{0}' and '{1}' define property '{2}' as private.": "Types '{0}' and '{1}' define property '{2}' as private.",
        "Call signatures of types '{0}' and '{1}' are incompatible.": "Call signatures of types '{0}' and '{1}' are incompatible.",
        "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
        "Type '{0}' requires a call signature, but type '{1}' lacks one.": "Type '{0}' requires a call signature, but type '{1}' lacks one.",
        "Construct signatures of types '{0}' and '{1}' are incompatible.": "Construct signatures of types '{0}' and '{1}' are incompatible.",
        "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
        "Type '{0}' requires a construct signature, but type '{1}' lacks one.": "Type '{0}' requires a construct signature, but type '{1}' lacks one.",
        "Index signatures of types '{0}' and '{1}' are incompatible.": "Index signatures of types '{0}' and '{1}' are incompatible.",
        "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
        "Call signature expects {0} or fewer parameters.": "Call signature expects {0} or fewer parameters.",
        "Could not apply type'{0}' to argument {1} which is of type '{2}'.": "Could not apply type'{0}' to argument {1} which is of type '{2}'.",
        "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.": "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.",
        "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.": "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.",
        "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.": "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.",
        "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.": "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.",
        "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.": "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.",
        "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}": "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}",
        "Current host does not support -w[atch] option.": "Current host does not support -w[atch] option.",
        "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.": "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.",
        "Module code generation '{0}' not supported.  Using default '{1}' code generation.": "Module code generation '{0}' not supported.  Using default '{1}' code generation.",
        "Could not find file: '{0}'.": "Could not find file: '{0}'.",
        "Unknown extension for file: '{0}'. Only .ts and .d.ts extensions are allowed.": "Unknown extension for file: '{0}'. Only .ts and .d.ts extensions are allowed.",
        "A file cannot have a reference itself.": "A file cannot have a reference itself.",
        "Cannot resolve referenced file: '{0}'.": "Cannot resolve referenced file: '{0}'.",
        "Cannot resolve imported file: '{0}'.": "Cannot resolve imported file: '{0}'.",
        "Cannot find the common subdirectory path for the input files": "Cannot find the common subdirectory path for the input files",
        "Cannot compile dynamic modules when emitting into single file": "Cannot compile dynamic modules when emitting into single file",
        "Emit Error: {0}.": "Emit Error: {0}."
    };

    export var GlobalDiagnosticMessages = EN_US_DiagnosticMessages;
}