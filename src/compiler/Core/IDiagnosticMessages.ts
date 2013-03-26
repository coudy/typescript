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
        Accessibility_modifier_must_precede__static__modifier: DiagnosticInfo;
        _static__modifier_already_seen: DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_class_element: DiagnosticInfo;



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
    }
}