///<reference path='References.ts' />

module TypeScript {
    export interface IDiagnosticMessages {
        error_TS_0__1: DiagnosticInfo;
        warning_TS_0__1: DiagnosticInfo;

        // Syntactic diagnostics.
        Unrecognized_escape_sequence: DiagnosticInfo;
        Unexpected_character_0: DiagnosticInfo;
        Missing_closing_quote_character: DiagnosticInfo;
        Identifier_expected: DiagnosticInfo;
        _0_keyword_expected: DiagnosticInfo;
        _0_expected: DiagnosticInfo;
        Identifier_expected__0_is_a_keyword: DiagnosticInfo;
        Automatic_semicolon_insertion_not_allowed: DiagnosticInfo;
        Unexpected_token__0_expected: DiagnosticInfo;
        Trailing_separator_not_allowed: DiagnosticInfo;
        _StarSlash__expected: DiagnosticInfo;
        _public_or_private_modifier_must_precede__static_: DiagnosticInfo;
        Unexpected_token_: DiagnosticInfo;
        A_catch_clause_variable_cannot_have_a_type_annotation: DiagnosticInfo;
        Rest_parameter_must_be_last_in_list: DiagnosticInfo;
        Parameter_cannot_have_question_mark_and_initializer: DiagnosticInfo;
        Required_parameter_cannot_follow_optional_parameter: DiagnosticInfo;
        Index_signatures_cannot_have_rest_parameters: DiagnosticInfo;
        Index_signature_parameter_cannot_have_accessibility_modifiers: DiagnosticInfo;
        Index_signature_parameter_cannot_have_a_question_mark: DiagnosticInfo;
        Index_signature_parameter_cannot_have_an_initializer: DiagnosticInfo;
        Index_signature_must_have_a_type_annotation: DiagnosticInfo;
        Index_signature_parameter_must_have_a_type_annotation: DiagnosticInfo;
        Index_signature_parameter_type_must_be__string__or__number_: DiagnosticInfo;
        _extends__clause_already_seen: DiagnosticInfo;
        _extends__clause_must_precede__implements__clause: DiagnosticInfo;
        Class_can_only_extend_single_type: DiagnosticInfo;
        _implements__clause_already_seen: DiagnosticInfo;
        Accessibility_modifier_already_seen: DiagnosticInfo;
        _0__modifier_must_precede__1__modifier: DiagnosticInfo;
        _0__modifier_already_seen: DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_class_element: DiagnosticInfo;
        Interface_declaration_cannot_have__implements__clause: DiagnosticInfo;
        Enum_element_must_have_initializer: DiagnosticInfo;
        _super__invocation_cannot_have_type_arguments: DiagnosticInfo;
        Non_ambient_modules_cannot_use_quoted_names: DiagnosticInfo;
        Statements_are_not_allowed_in_ambient_contexts: DiagnosticInfo;
        Implementations_are_not_allowed_in_ambient_contexts: DiagnosticInfo;
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: DiagnosticInfo;
        Initializers_are_not_allowed_in_ambient_contexts: DiagnosticInfo;
        Overload_and_ambient_signatures_cannot_specify_parameter_properties: DiagnosticInfo;
        Function_implementation_expected: DiagnosticInfo;
        Constructor_implementation_expected: DiagnosticInfo;
        Function_overload_name_must_be__0_: DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_module_element: DiagnosticInfo;
        _declare__modifier_cannot_appear_on_an_interface_declaration: DiagnosticInfo;
        _declare__modifier_required_for_top_level_element: DiagnosticInfo;
        Rest_parameter_cannot_be_optional: DiagnosticInfo;
        Rest_parameter_cannot_have_initializer: DiagnosticInfo;
        _set__accessor_parameter_cannot_have_accessibility_modifier: DiagnosticInfo;
        _set__accessor_parameter_cannot_be_optional: DiagnosticInfo;
        _set__accessor_parameter_cannot_have_initializer: DiagnosticInfo;
        _set__accessor_cannot_have_rest_parameter: DiagnosticInfo;
        _get__accessor_cannot_have_parameters: DiagnosticInfo;






        // Semantic diagnostics.
        Duplicate_identifier__0_: DiagnosticInfo;
        The_name__0__does_not_exist_in_the_current_scope: DiagnosticInfo;
        The_name__0__does_not_refer_to_a_value: DiagnosticInfo;
        Keyword__super__can_only_be_used_inside_a_class_instance_method: DiagnosticInfo;
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: DiagnosticInfo;
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: DiagnosticInfo;
        Value_of_type__0__is_not_callable: DiagnosticInfo;
        Value_of_type__0__is_not_newable: DiagnosticInfo;
        Value_of_type__0__is_not_indexable_by_type__1_: DiagnosticInfo;
        Operator__0__cannot_be_applied_to_types__1__and__2_: DiagnosticInfo;
        Operator__0__cannot_be_applied_to_types__1__and__2__3: DiagnosticInfo;
        Cannot_convert__0__to__1_: DiagnosticInfo;
        Cannot_convert__0__to__1___2: DiagnosticInfo;
        Expected_var__class__interface__or_module: DiagnosticInfo;
        Operator__0__cannot_be_applied_to_type__1_: DiagnosticInfo;
        Getter__0__already_declared: DiagnosticInfo;
        Setter__0__already_declared: DiagnosticInfo;
        Accessor_may_not_take_type_parameters: DiagnosticInfo;
        _set__accessor_must_have_only_one_parameter: DiagnosticInfo;
        Use_of_deprecated__bool__type__Use__boolean__instead: DiagnosticInfo;



        //Privacy error related diagnostics
        Exported_class__0__extends_private_class__1_: DiagnosticInfo;
        Exported_class__0__implements_private_interface__1_: DiagnosticInfo;
        Exported_interface__0__extends_private_interface__1_: DiagnosticInfo;
        Exported_class__0__extends_class_from_inaccessible_module__1_: DiagnosticInfo;
        Exported_class__0__implements_interface_from_inaccessible_module__1_: DiagnosticInfo;
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: DiagnosticInfo;
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Exported_variable__0__has_or_is_using_private_type__1_: DiagnosticInfo;
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Exported_variable__0__is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: DiagnosticInfo;
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_exported_function_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;



        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: DiagnosticInfo;
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: DiagnosticInfo;
        Multiple_constructor_implementations_are_not_allowed: DiagnosticInfo;
        Unable_to_resolve_external_module__0_: DiagnosticInfo;
        Module_cannot_be_aliased_to_a_non_module_type: DiagnosticInfo;
        A_class_may_only_extend_another_class: DiagnosticInfo;
        A_class_may_only_implement_another_class_or_interface: DiagnosticInfo;
        An_interface_may_only_extend_another_class_or_interface: DiagnosticInfo;
        An_interface_may_not_implement_another_type: DiagnosticInfo;
        Unable_to_resolve_type: DiagnosticInfo;
        Unable_to_resolve_type_of__0_: DiagnosticInfo;
        Unable_to_resolve_type_parameter_constraint: DiagnosticInfo;
        Type_parameter_constraint_may_not_be_a_primitive_type: DiagnosticInfo;
        Supplied_parameters_do_not_match_any_signature_of_call_target: DiagnosticInfo;
        Supplied_parameters_do_not_match_any_signature_of_call_target___0: DiagnosticInfo;
        Invalid__new__expression: DiagnosticInfo;
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: DiagnosticInfo;
        Could_not_select_overload_for__new__expression: DiagnosticInfo;
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: DiagnosticInfo;
        Could_not_select_overload_for__call__expression: DiagnosticInfo;
        Unable_to_invoke_type_with_no_call_signatures: DiagnosticInfo;
        Calls_to__super__are_only_valid_inside_a_class: DiagnosticInfo;
        Generic_type__0__requires_1_type_argument_s_: DiagnosticInfo;
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: DiagnosticInfo;
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: DiagnosticInfo;
        Could_not_find_enclosing_symbol_for_dotted_name__0_: DiagnosticInfo;
        Could_not_find_dotted_name__0_: DiagnosticInfo;
        Could_not_find_symbol__0_: DiagnosticInfo;
        _get__and__set__accessor_must_have_the_same_type: DiagnosticInfo;
        _this__may_not_be_referenced_in_current_location: DiagnosticInfo;
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: DiagnosticInfo;
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: DiagnosticInfo;
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: DiagnosticInfo;
        _super__may_not_be_referenced_in_non_derived_classes: DiagnosticInfo;
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties: DiagnosticInfo;
        Constructors_for_derived_classes_must_contain_a__super__call: DiagnosticInfo;
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: DiagnosticInfo;
        _0_1__is_inaccessible: DiagnosticInfo;
        _this__cannot_be_referenced_within_module_bodies: DiagnosticInfo;
        _this__must_only_be_used_inside_a_function_or_script_context: DiagnosticInfo;
        VarArgs_must_be_array_types: DiagnosticInfo;
        Invalid__addition__expression___types_do_not_agree: DiagnosticInfo;
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: DiagnosticInfo;
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: DiagnosticInfo;
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type: DiagnosticInfo;
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation: DiagnosticInfo;
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_: DiagnosticInfo;
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter: DiagnosticInfo;
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_: DiagnosticInfo;
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: DiagnosticInfo;
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: DiagnosticInfo;
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type: DiagnosticInfo;
        Setters_may_not_return_a_value: DiagnosticInfo;
        Tried_to_set_variable_type_to_uninitialized_module_type: DiagnosticInfo;
        Tried_to_set_variable_type_to_uninitialized_module_type__0__: DiagnosticInfo;
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression: DiagnosticInfo;
        Getters_must_return_a_value: DiagnosticInfo;
        Getter_and_setter_accessors_do_not_agree_in_visibility: DiagnosticInfo;
        Invalid_left_hand_side_of_assignment_expression: DiagnosticInfo;
        Function_declared_a_non_void_return_type__but_has_no_return_expression: DiagnosticInfo;
        Cannot_resolve_return_type_reference: DiagnosticInfo;
        Constructors_cannot_have_a_return_type_of__void_: DiagnosticInfo;
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: DiagnosticInfo;
    }
}