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

        Accessibility_modifier_must_precede__static__modifier: {
            category: DiagnosticCategory.Error,
            message: "Accessibility modifier must precede 'static' modifier.",
            code: 1029
        },

        _static__modifier_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'static' modifier already seen.",
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
            message: "Functoin overload name must be '{0}'.",
            code: 1043
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
            message: "Cannot convert '{0}' to '{1}': {2}",
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
    };
}