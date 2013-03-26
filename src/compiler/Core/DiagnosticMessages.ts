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
            code: 100
        },

        Unexpected_character_0: {
            category: DiagnosticCategory.Error,
            message: "Unexpected character {0}.",
            code: 101
        },

        Missing_closing_quote_character: {
            category: DiagnosticCategory.Error,
            message: "Missing close quote character.",
            code: 102
        },

        Identifier_expected: {
            category: DiagnosticCategory.Error,
            message: "Identifier expected.",
            code: 103
        },

        _0_keyword_expected: {
            category: DiagnosticCategory.Error,
            message: "'{0}' keyword expected.",
            code: 104
        },

        _0_expected: {
            category: DiagnosticCategory.Error,
            message: "'{0}' expected.",
            code: 105
        },

        Identifier_expected__0_is_a_keyword: {
            category: DiagnosticCategory.Error,
            message: "Identifier expected; '{0}' is a keyword.",
            code: 106
        },

        Automatic_semicolon_insertion_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Automatic semicolon insertion not allowed.",
            code: 107
        },

        Unexpected_token__0_expected: {
            category: DiagnosticCategory.Error,
            message: "Unexpected token; '{0}' expected.",
            code: 108
        },

        Trailing_separator_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Trailing separator not allowed.",
            code: 109
        },

        _StarSlash__expected: {
            category: DiagnosticCategory.Error,
            message: "'*/' expected.",
            code: 110
        },

        _public_or_private_modifier_must_precede__static_: {
            category: DiagnosticCategory.Error,
            message: "'public' or 'private' modifier must precede 'static'.",
            code: 111
        },

        Unexpected_token_: {
            category: DiagnosticCategory.Error,
            message: "Unexpected token.",
            code: 112
        },

        A_catch_clause_variable_cannot_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "A catch clause variable cannot have a type annotation.",
            code: 113
        },

        Rest_parameter_must_be_last_in_list: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter must be last in list.",
            code: 114
        },

        Parameter_cannot_have_question_mark_and_initializer: {
            category: DiagnosticCategory.Error,
            message: "Parameter cannot have question mark and initializer.",
            code: 115
        },

        Required_parameter_cannot_follow_optional_parameter: {
            category: DiagnosticCategory.Error,
            message: "required parameter cannot follow optional parameter.",
            code: 116
        },

        Index_signatures_cannot_have_rest_parameters: {
            category: DiagnosticCategory.Error,
            message: "Index signatures cannot have rest parameters.",
            code: 117
        },

        Index_signature_parameter_cannot_have_accessibility_modifiers: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have accessibility modifiers.",
            code: 118
        },

        Index_signature_parameter_cannot_have_a_question_mark: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have a question mark.",
            code: 119
        },

        Index_signature_parameter_cannot_have_an_initializer: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have an initializer.",
            code: 120
        },

        Index_signature_must_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Index signature must have a type annotation.",
            code: 121
        },

        Index_signature_parameter_must_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter must have a type annotation.",
            code: 122
        },

        Index_signature_parameter_type_must_be__string__or__number_: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter type must be 'string' or 'number'.",
            code: 123
        },

        _extends__clause_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'extends' clause already seen.",
            code: 124
        },

        _extends__clause_must_precede__implements__clause: {
            category: DiagnosticCategory.Error,
            message: "'extends' clause must precede 'implements' clause.",
            code: 125
        },

        Class_can_only_extend_single_type: {
            category: DiagnosticCategory.Error,
            message: "Class can only extend single type.",
            code: 126
        },

        _implements__clause_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'implements' clause already seen.",
            code: 127
        },






        // Semantic errors start at 200.
        Duplicate_identifier__0_: {
            category: DiagnosticCategory.Error,
            message: "Duplicate identifier '{0}'.",
            code: 200
        },

        The_name__0__does_not_exist_in_the_current_scope: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not exist in the current scope.",
            code: 201
        },

        The_name__0__does_not_refer_to_a_value: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not refer to a value.",
            code: 202
        },

        Keyword__super__can_only_be_used_inside_a_class_instance_method: {
            category: DiagnosticCategory.Error,
            message: "Keyword 'super' can only be used inside a class instance method.",
            code: 203
        },

        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer.",
            code: 204
        },

        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 205
        },

        Value_of_type__0__is_not_callable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable.",
            code: 206
        },

        Value_of_type__0__is_not_newable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not newable.",
            code: 207
        },

        Value_of_type__0__is_not_indexable_by_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not indexable by type '{1}'.",
            code: 208
        },

        Operator__0__cannot_be_applied_to_types__1__and__2_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
            code: 209
        },

        Operator__0__cannot_be_applied_to_types__1__and__2__3: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 210
        },

        Cannot_convert__0__to__1_: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}'.",
            code: 211
        },

        Cannot_convert__0__to__1___2: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}': {2}",
            code: 212
        },

        Expected_var__class__interface__or_module: {
            category: DiagnosticCategory.Error,
            message: "Expected var, class, interface, or module.",
            code: 213
        },

        Operator__0__cannot_be_applied_to_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to type '{1}'.",
            code: 214
        },

        Getter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Getter '{0}' already declared.",
            code: 215
        },

        Setter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Setter '{0}' already declared.",
            code: 216
        },

        Accessor_may_not_take_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "Accessors may not take type parameters.",
            code: 217
        },
    };
}