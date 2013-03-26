///<reference path='References.ts' />

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
        Identifier_expected__0_is_a_keyword,
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
        Cannot_convert__0__to__1___2,
        Expected_var__class__interface__or_module,
        Operator__0__cannot_be_applied_to_type__1_,
        Getter__0__already_declared,
        Setter__0__already_declared,
        Accessor_may_not_take_type_parameters,
    }
}