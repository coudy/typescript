var TypeScript;
(function (TypeScript) {
    var ArrayUtilities = (function () {
        function ArrayUtilities() {
        }
        ArrayUtilities.isArray = function (value) {
            return Object.prototype.toString.apply(value, []) === '[object Array]';
        };
        ArrayUtilities.sequenceEquals = function (array1, array2, equals) {
            if (array1 === array2) {
                return true;
            }
            if (array1 === null || array2 === null) {
                return false;
            }
            if (array1.length !== array2.length) {
                return false;
            }
            for (var i = 0, n = array1.length; i < n; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }
            return true;
        };
        ArrayUtilities.contains = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
            return false;
        };
        ArrayUtilities.groupBy = function (array, func) {
            var result = {};
            for (var i = 0, n = array.length; i < n; i++) {
                var v = array[i];
                var k = func(v);
                var list = result[k] || [];
                list.push(v);
                result[k] = list;
            }
            return result;
        };
        ArrayUtilities.min = function (array, func) {
            var min = func(array[0]);
            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next < min) {
                    min = next;
                }
            }
            return min;
        };
        ArrayUtilities.max = function (array, func) {
            var max = func(array[0]);
            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next > max) {
                    max = next;
                }
            }
            return max;
        };
        ArrayUtilities.last = function (array) {
            if (array.length === 0) {
                throw TypeScript.Errors.argumentOutOfRange('array');
            }
            return array[array.length - 1];
        };
        ArrayUtilities.firstOrDefault = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                var value = array[i];
                if (func(value)) {
                    return value;
                }
            }
            return null;
        };
        ArrayUtilities.sum = function (array, func) {
            var result = 0;
            for (var i = 0, n = array.length; i < n; i++) {
                result += func(array[i]);
            }
            return result;
        };
        ArrayUtilities.whereNotNull = function (array) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                if (value !== null) {
                    result.push(value);
                }
            }
            return result;
        };
        ArrayUtilities.select = function (values, func) {
            var result = [];
            for (var i = 0; i < values.length; i++) {
                result.push(func(values[i]));
            }
            return result;
        };
        ArrayUtilities.where = function (values, func) {
            var result = [];
            for (var i = 0; i < values.length; i++) {
                if (func(values[i])) {
                    result.push(values[i]);
                }
            }
            return result;
        };
        ArrayUtilities.any = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (func(array[i])) {
                    return true;
                }
            }
            return false;
        };
        ArrayUtilities.all = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (!func(array[i])) {
                    return false;
                }
            }
            return true;
        };
        ArrayUtilities.binarySearch = function (array, value) {
            var low = 0;
            var high = array.length - 1;
            while (low <= high) {
                var middle = low + ((high - low) >> 1);
                var midValue = array[middle];
                if (midValue === value) {
                    return middle;
                } else if (midValue > value) {
                    high = middle - 1;
                } else {
                    low = middle + 1;
                }
            }
            return ~low;
        };
        ArrayUtilities.createArray = function (length, defaultvalue) {
            var result = [];
            for (var i = 0; i < length; i++) {
                result.push(defaultvalue);
            }
            return result;
        };
        ArrayUtilities.grow = function (array, length, defaultValue) {
            var count = length - array.length;
            for (var i = 0; i < count; i++) {
                array.push(defaultValue);
            }
        };
        ArrayUtilities.copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
            for (var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        };
        return ArrayUtilities;
    })();
    TypeScript.ArrayUtilities = ArrayUtilities;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (Constants) {
        Constants._map = [];
        Constants.Max31BitInteger = 1073741823;
        Constants.Min31BitInteger = -1073741824;
    })(TypeScript.Constants || (TypeScript.Constants = {}));
    var Constants = TypeScript.Constants;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Contract = (function () {
        function Contract() {
        }
        Contract.requires = function (expression) {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        };
        Contract.throwIfFalse = function (expression) {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        };
        Contract.throwIfNull = function (value) {
            if (value === null) {
                throw new Error("Contract violated. Null value.");
            }
        };
        return Contract;
    })();
    TypeScript.Contract = Contract;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Debug = (function () {
        function Debug() {
        }
        Debug.assert = function (expression, message) {
            if (!expression) {
                throw new Error("Debug Failure. False expression: " + (message ? message : ""));
            }
        };
        return Debug;
    })();
    TypeScript.Debug = Debug;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (DiagnosticCategory) {
        DiagnosticCategory._map = [];
        DiagnosticCategory._map[0] = "Warning";
        DiagnosticCategory.Warning = 0;
        DiagnosticCategory._map[1] = "Error";
        DiagnosticCategory.Error = 1;
        DiagnosticCategory._map[2] = "NoPrefix";
        DiagnosticCategory.NoPrefix = 2;
    })(TypeScript.DiagnosticCategory || (TypeScript.DiagnosticCategory = {}));
    var DiagnosticCategory = TypeScript.DiagnosticCategory;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (DiagnosticCode) {
        DiagnosticCode._map = [];
        DiagnosticCode._map[0] = "error_TS_0__1";
        DiagnosticCode.error_TS_0__1 = 0;
        DiagnosticCode._map[1] = "warning_TS_0__1";
        DiagnosticCode.warning_TS_0__1 = 1;
        DiagnosticCode._map[2] = "_0__NL__1_TB__2";
        DiagnosticCode._0__NL__1_TB__2 = 2;
        DiagnosticCode._map[3] = "_0_TB__1";
        DiagnosticCode._0_TB__1 = 3;
        DiagnosticCode._map[4] = "Unrecognized_escape_sequence";
        DiagnosticCode.Unrecognized_escape_sequence = 4;
        DiagnosticCode._map[5] = "Unexpected_character_0";
        DiagnosticCode.Unexpected_character_0 = 5;
        DiagnosticCode._map[6] = "Missing_closing_quote_character";
        DiagnosticCode.Missing_closing_quote_character = 6;
        DiagnosticCode._map[7] = "Identifier_expected";
        DiagnosticCode.Identifier_expected = 7;
        DiagnosticCode._map[8] = "_0_keyword_expected";
        DiagnosticCode._0_keyword_expected = 8;
        DiagnosticCode._map[9] = "_0_expected";
        DiagnosticCode._0_expected = 9;
        DiagnosticCode._map[10] = "Identifier_expected__0__is_a_keyword";
        DiagnosticCode.Identifier_expected__0__is_a_keyword = 10;
        DiagnosticCode._map[11] = "Automatic_semicolon_insertion_not_allowed";
        DiagnosticCode.Automatic_semicolon_insertion_not_allowed = 11;
        DiagnosticCode._map[12] = "Unexpected_token__0_expected";
        DiagnosticCode.Unexpected_token__0_expected = 12;
        DiagnosticCode._map[13] = "Trailing_separator_not_allowed";
        DiagnosticCode.Trailing_separator_not_allowed = 13;
        DiagnosticCode._map[14] = "_StarSlash__expected";
        DiagnosticCode._StarSlash__expected = 14;
        DiagnosticCode._map[15] = "_public_or_private_modifier_must_precede__static_";
        DiagnosticCode._public_or_private_modifier_must_precede__static_ = 15;
        DiagnosticCode._map[16] = "Unexpected_token_";
        DiagnosticCode.Unexpected_token_ = 16;
        DiagnosticCode._map[17] = "A_catch_clause_variable_cannot_have_a_type_annotation";
        DiagnosticCode.A_catch_clause_variable_cannot_have_a_type_annotation = 17;
        DiagnosticCode._map[18] = "Rest_parameter_must_be_last_in_list";
        DiagnosticCode.Rest_parameter_must_be_last_in_list = 18;
        DiagnosticCode._map[19] = "Parameter_cannot_have_question_mark_and_initializer";
        DiagnosticCode.Parameter_cannot_have_question_mark_and_initializer = 19;
        DiagnosticCode._map[20] = "Required_parameter_cannot_follow_optional_parameter";
        DiagnosticCode.Required_parameter_cannot_follow_optional_parameter = 20;
        DiagnosticCode._map[21] = "Index_signatures_cannot_have_rest_parameters";
        DiagnosticCode.Index_signatures_cannot_have_rest_parameters = 21;
        DiagnosticCode._map[22] = "Index_signature_parameter_cannot_have_accessibility_modifierss";
        DiagnosticCode.Index_signature_parameter_cannot_have_accessibility_modifierss = 22;
        DiagnosticCode._map[23] = "Index_signature_parameter_cannot_have_a_question_mark";
        DiagnosticCode.Index_signature_parameter_cannot_have_a_question_mark = 23;
        DiagnosticCode._map[24] = "Index_signature_parameter_cannot_have_an_initializer";
        DiagnosticCode.Index_signature_parameter_cannot_have_an_initializer = 24;
        DiagnosticCode._map[25] = "Index_signature_must_have_a_type_annotation";
        DiagnosticCode.Index_signature_must_have_a_type_annotation = 25;
        DiagnosticCode._map[26] = "Index_signature_parameter_must_have_a_type_annotation";
        DiagnosticCode.Index_signature_parameter_must_have_a_type_annotation = 26;
        DiagnosticCode._map[27] = "Index_signature_parameter_type_must_be__string__or__number_";
        DiagnosticCode.Index_signature_parameter_type_must_be__string__or__number_ = 27;
        DiagnosticCode._map[28] = "_extends__clause_already_seen";
        DiagnosticCode._extends__clause_already_seen = 28;
        DiagnosticCode._map[29] = "_extends__clause_must_precede__implements__clause";
        DiagnosticCode._extends__clause_must_precede__implements__clause = 29;
        DiagnosticCode._map[30] = "Class_can_only_extend_single_type";
        DiagnosticCode.Class_can_only_extend_single_type = 30;
        DiagnosticCode._map[31] = "_implements__clause_already_seen";
        DiagnosticCode._implements__clause_already_seen = 31;
        DiagnosticCode._map[32] = "Accessibility_modifier_already_seen";
        DiagnosticCode.Accessibility_modifier_already_seen = 32;
        DiagnosticCode._map[33] = "_0__modifier_must_precede__1__modifier";
        DiagnosticCode._0__modifier_must_precede__1__modifier = 33;
        DiagnosticCode._map[34] = "_0__modifier_already_seen";
        DiagnosticCode._0__modifier_already_seen = 34;
        DiagnosticCode._map[35] = "_0__modifier_cannot_appear_on_a_class_element";
        DiagnosticCode._0__modifier_cannot_appear_on_a_class_element = 35;
        DiagnosticCode._map[36] = "Interface_declaration_cannot_have__implements__clause";
        DiagnosticCode.Interface_declaration_cannot_have__implements__clause = 36;
        DiagnosticCode._map[37] = "Enum_element_must_have_initializer";
        DiagnosticCode.Enum_element_must_have_initializer = 37;
        DiagnosticCode._map[38] = "_super__invocation_cannot_have_type_arguments";
        DiagnosticCode._super__invocation_cannot_have_type_arguments = 38;
        DiagnosticCode._map[39] = "Non_ambient_modules_cannot_use_quoted_names";
        DiagnosticCode.Non_ambient_modules_cannot_use_quoted_names = 39;
        DiagnosticCode._map[40] = "Statements_are_not_allowed_in_ambient_contexts";
        DiagnosticCode.Statements_are_not_allowed_in_ambient_contexts = 40;
        DiagnosticCode._map[41] = "Implementations_are_not_allowed_in_ambient_contexts";
        DiagnosticCode.Implementations_are_not_allowed_in_ambient_contexts = 41;
        DiagnosticCode._map[42] = "_declare__modifier_not_allowed_for_code_already_in_an_ambient_context";
        DiagnosticCode._declare__modifier_not_allowed_for_code_already_in_an_ambient_context = 42;
        DiagnosticCode._map[43] = "Initializers_are_not_allowed_in_ambient_contexts";
        DiagnosticCode.Initializers_are_not_allowed_in_ambient_contexts = 43;
        DiagnosticCode._map[44] = "Overload_and_ambient_signatures_cannot_specify_parameter_properties";
        DiagnosticCode.Overload_and_ambient_signatures_cannot_specify_parameter_properties = 44;
        DiagnosticCode._map[45] = "Function_implementation_expected";
        DiagnosticCode.Function_implementation_expected = 45;
        DiagnosticCode._map[46] = "Constructor_implementation_expected";
        DiagnosticCode.Constructor_implementation_expected = 46;
        DiagnosticCode._map[47] = "Function_overload_name_must_be__0_";
        DiagnosticCode.Function_overload_name_must_be__0_ = 47;
        DiagnosticCode._map[48] = "_0__modifier_cannot_appear_on_a_module_element";
        DiagnosticCode._0__modifier_cannot_appear_on_a_module_element = 48;
        DiagnosticCode._map[49] = "_declare__modifier_cannot_appear_on_an_interface_declaration";
        DiagnosticCode._declare__modifier_cannot_appear_on_an_interface_declaration = 49;
        DiagnosticCode._map[50] = "_declare__modifier_required_for_top_level_element";
        DiagnosticCode._declare__modifier_required_for_top_level_element = 50;
        DiagnosticCode._map[51] = "_set__accessor_must_have_only_one_parameter";
        DiagnosticCode._set__accessor_must_have_only_one_parameter = 51;
        DiagnosticCode._map[52] = "_set__accessor_parameter_cannot_have_accessibility_modifier";
        DiagnosticCode._set__accessor_parameter_cannot_have_accessibility_modifier = 52;
        DiagnosticCode._map[53] = "_set__accessor_parameter_cannot_be_optional";
        DiagnosticCode._set__accessor_parameter_cannot_be_optional = 53;
        DiagnosticCode._map[54] = "_set__accessor_parameter_cannot_have_initializer";
        DiagnosticCode._set__accessor_parameter_cannot_have_initializer = 54;
        DiagnosticCode._map[55] = "_set__accessor_cannot_have_rest_parameter";
        DiagnosticCode._set__accessor_cannot_have_rest_parameter = 55;
        DiagnosticCode._map[56] = "_get__accessor_cannot_have_parameters";
        DiagnosticCode._get__accessor_cannot_have_parameters = 56;
        DiagnosticCode._map[57] = "Rest_parameter_cannot_be_optional";
        DiagnosticCode.Rest_parameter_cannot_be_optional = 57;
        DiagnosticCode._map[58] = "Rest_parameter_cannot_have_initializer";
        DiagnosticCode.Rest_parameter_cannot_have_initializer = 58;
        DiagnosticCode._map[59] = "Modifiers_cannot_appear_here";
        DiagnosticCode.Modifiers_cannot_appear_here = 59;
        DiagnosticCode._map[60] = "Accessors_are_only_available_when_targeting_EcmaScript5_and_higher";
        DiagnosticCode.Accessors_are_only_available_when_targeting_EcmaScript5_and_higher = 60;
        DiagnosticCode._map[61] = "A_generic_type_may_not_reference_itself_with_its_own_type_parameters";
        DiagnosticCode.A_generic_type_may_not_reference_itself_with_its_own_type_parameters = 61;
        DiagnosticCode._map[62] = "Duplicate_identifier__0_";
        DiagnosticCode.Duplicate_identifier__0_ = 62;
        DiagnosticCode._map[63] = "The_name__0__does_not_exist_in_the_current_scope";
        DiagnosticCode.The_name__0__does_not_exist_in_the_current_scope = 63;
        DiagnosticCode._map[64] = "The_name__0__does_not_refer_to_a_value";
        DiagnosticCode.The_name__0__does_not_refer_to_a_value = 64;
        DiagnosticCode._map[65] = "Keyword__super__can_only_be_used_inside_a_class_instance_method";
        DiagnosticCode.Keyword__super__can_only_be_used_inside_a_class_instance_method = 65;
        DiagnosticCode._map[66] = "The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer";
        DiagnosticCode.The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer = 66;
        DiagnosticCode._map[67] = "Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__";
        DiagnosticCode.Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__ = 67;
        DiagnosticCode._map[68] = "Value_of_type__0__is_not_callable";
        DiagnosticCode.Value_of_type__0__is_not_callable = 68;
        DiagnosticCode._map[69] = "Value_of_type__0__is_not_newable";
        DiagnosticCode.Value_of_type__0__is_not_newable = 69;
        DiagnosticCode._map[70] = "Value_of_type__0__is_not_indexable_by_type__1_";
        DiagnosticCode.Value_of_type__0__is_not_indexable_by_type__1_ = 70;
        DiagnosticCode._map[71] = "Operator__0__cannot_be_applied_to_types__1__and__2_";
        DiagnosticCode.Operator__0__cannot_be_applied_to_types__1__and__2_ = 71;
        DiagnosticCode._map[72] = "Operator__0__cannot_be_applied_to_types__1__and__2__3";
        DiagnosticCode.Operator__0__cannot_be_applied_to_types__1__and__2__3 = 72;
        DiagnosticCode._map[73] = "Cannot_convert__0__to__1_";
        DiagnosticCode.Cannot_convert__0__to__1_ = 73;
        DiagnosticCode._map[74] = "Cannot_convert__0__to__1__NL__2";
        DiagnosticCode.Cannot_convert__0__to__1__NL__2 = 74;
        DiagnosticCode._map[75] = "Expected_var__class__interface__or_module";
        DiagnosticCode.Expected_var__class__interface__or_module = 75;
        DiagnosticCode._map[76] = "Operator__0__cannot_be_applied_to_type__1_";
        DiagnosticCode.Operator__0__cannot_be_applied_to_type__1_ = 76;
        DiagnosticCode._map[77] = "Getter__0__already_declared";
        DiagnosticCode.Getter__0__already_declared = 77;
        DiagnosticCode._map[78] = "Setter__0__already_declared";
        DiagnosticCode.Setter__0__already_declared = 78;
        DiagnosticCode._map[79] = "Accessor_cannot_have_type_parameters";
        DiagnosticCode.Accessor_cannot_have_type_parameters = 79;
        DiagnosticCode._map[80] = "Exported_class__0__extends_private_class__1_";
        DiagnosticCode.Exported_class__0__extends_private_class__1_ = 80;
        DiagnosticCode._map[81] = "Exported_class__0__implements_private_interface__1_";
        DiagnosticCode.Exported_class__0__implements_private_interface__1_ = 81;
        DiagnosticCode._map[82] = "Exported_interface__0__extends_private_interface__1_";
        DiagnosticCode.Exported_interface__0__extends_private_interface__1_ = 82;
        DiagnosticCode._map[83] = "Exported_class__0__extends_class_from_inaccessible_module__1_";
        DiagnosticCode.Exported_class__0__extends_class_from_inaccessible_module__1_ = 83;
        DiagnosticCode._map[84] = "Exported_class__0__implements_interface_from_inaccessible_module__1_";
        DiagnosticCode.Exported_class__0__implements_interface_from_inaccessible_module__1_ = 84;
        DiagnosticCode._map[85] = "Exported_interface__0__extends_interface_from_inaccessible_module__1_";
        DiagnosticCode.Exported_interface__0__extends_interface_from_inaccessible_module__1_ = 85;
        DiagnosticCode._map[86] = "Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_ = 86;
        DiagnosticCode._map[87] = "Public_property__0__of__exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Public_property__0__of__exported_class_has_or_is_using_private_type__1_ = 87;
        DiagnosticCode._map[88] = "Property__0__of__exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode.Property__0__of__exported_interface_has_or_is_using_private_type__1_ = 88;
        DiagnosticCode._map[89] = "Exported_variable__0__has_or_is_using_private_type__1_";
        DiagnosticCode.Exported_variable__0__has_or_is_using_private_type__1_ = 89;
        DiagnosticCode._map[90] = "Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_ = 90;
        DiagnosticCode._map[91] = "Public_property__0__of__exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Public_property__0__of__exported_class_is_using_inaccessible_module__1_ = 91;
        DiagnosticCode._map[92] = "Property__0__of__exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode.Property__0__of__exported_interface_is_using_inaccessible_module__1_ = 92;
        DiagnosticCode._map[93] = "Exported_variable__0__is_using_inaccessible_module__1_";
        DiagnosticCode.Exported_variable__0__is_using_inaccessible_module__1_ = 93;
        DiagnosticCode._map[94] = "Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_ = 94;
        DiagnosticCode._map[95] = "Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_ = 95;
        DiagnosticCode._map[96] = "Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_ = 96;
        DiagnosticCode._map[97] = "Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_ = 97;
        DiagnosticCode._map[98] = "Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_ = 98;
        DiagnosticCode._map[99] = "Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_ = 99;
        DiagnosticCode._map[100] = "Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_ = 100;
        DiagnosticCode._map[101] = "Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_ = 101;
        DiagnosticCode._map[102] = "Parameter__0__of_exported_function_has_or_is_using_private_type__1_";
        DiagnosticCode.Parameter__0__of_exported_function_has_or_is_using_private_type__1_ = 102;
        DiagnosticCode._map[103] = "Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_ = 103;
        DiagnosticCode._map[104] = "Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_ = 104;
        DiagnosticCode._map[105] = "Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_ = 105;
        DiagnosticCode._map[106] = "Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_ = 106;
        DiagnosticCode._map[107] = "Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_ = 107;
        DiagnosticCode._map[108] = "Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_ = 108;
        DiagnosticCode._map[109] = "Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_ = 109;
        DiagnosticCode._map[110] = "Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_ = 110;
        DiagnosticCode._map[111] = "Parameter__0__of_exported_function_is_using_inaccessible_module__1_";
        DiagnosticCode.Parameter__0__of_exported_function_is_using_inaccessible_module__1_ = 111;
        DiagnosticCode._map[112] = "Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_ = 112;
        DiagnosticCode._map[113] = "Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_ = 113;
        DiagnosticCode._map[114] = "Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_ = 114;
        DiagnosticCode._map[115] = "Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_ = 115;
        DiagnosticCode._map[116] = "Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_ = 116;
        DiagnosticCode._map[117] = "Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_ = 117;
        DiagnosticCode._map[118] = "Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_ = 118;
        DiagnosticCode._map[119] = "Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_ = 119;
        DiagnosticCode._map[120] = "Return_type_of_exported_function_has_or_is_using_private_type__0_";
        DiagnosticCode.Return_type_of_exported_function_has_or_is_using_private_type__0_ = 120;
        DiagnosticCode._map[121] = "Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_ = 121;
        DiagnosticCode._map[122] = "Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_ = 122;
        DiagnosticCode._map[123] = "Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_ = 123;
        DiagnosticCode._map[124] = "Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_ = 124;
        DiagnosticCode._map[125] = "Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_ = 125;
        DiagnosticCode._map[126] = "Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_ = 126;
        DiagnosticCode._map[127] = "Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_ = 127;
        DiagnosticCode._map[128] = "Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_ = 128;
        DiagnosticCode._map[129] = "Return_type_of_exported_function_is_using_inaccessible_module__0_";
        DiagnosticCode.Return_type_of_exported_function_is_using_inaccessible_module__0_ = 129;
        DiagnosticCode._map[130] = "_new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead";
        DiagnosticCode._new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead = 130;
        DiagnosticCode._map[131] = "A_parameter_list_must_follow_a_generic_type_argument_list______expected";
        DiagnosticCode.A_parameter_list_must_follow_a_generic_type_argument_list______expected = 131;
        DiagnosticCode._map[132] = "Multiple_constructor_implementations_are_not_allowed";
        DiagnosticCode.Multiple_constructor_implementations_are_not_allowed = 132;
        DiagnosticCode._map[133] = "Unable_to_resolve_external_module__0_";
        DiagnosticCode.Unable_to_resolve_external_module__0_ = 133;
        DiagnosticCode._map[134] = "Module_cannot_be_aliased_to_a_non_module_type";
        DiagnosticCode.Module_cannot_be_aliased_to_a_non_module_type = 134;
        DiagnosticCode._map[135] = "A_class_may_only_extend_another_class";
        DiagnosticCode.A_class_may_only_extend_another_class = 135;
        DiagnosticCode._map[136] = "A_class_may_only_implement_another_class_or_interface";
        DiagnosticCode.A_class_may_only_implement_another_class_or_interface = 136;
        DiagnosticCode._map[137] = "An_interface_may_only_extend_another_class_or_interface";
        DiagnosticCode.An_interface_may_only_extend_another_class_or_interface = 137;
        DiagnosticCode._map[138] = "An_interface_cannot_implement_another_type";
        DiagnosticCode.An_interface_cannot_implement_another_type = 138;
        DiagnosticCode._map[139] = "Unable_to_resolve_type";
        DiagnosticCode.Unable_to_resolve_type = 139;
        DiagnosticCode._map[140] = "Unable_to_resolve_type_of__0_";
        DiagnosticCode.Unable_to_resolve_type_of__0_ = 140;
        DiagnosticCode._map[141] = "Unable_to_resolve_type_parameter_constraint";
        DiagnosticCode.Unable_to_resolve_type_parameter_constraint = 141;
        DiagnosticCode._map[142] = "Type_parameter_constraint_cannot_be_a_primitive_type";
        DiagnosticCode.Type_parameter_constraint_cannot_be_a_primitive_type = 142;
        DiagnosticCode._map[143] = "Supplied_parameters_do_not_match_any_signature_of_call_target";
        DiagnosticCode.Supplied_parameters_do_not_match_any_signature_of_call_target = 143;
        DiagnosticCode._map[144] = "Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0";
        DiagnosticCode.Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0 = 144;
        DiagnosticCode._map[145] = "Invalid__new__expression";
        DiagnosticCode.Invalid__new__expression = 145;
        DiagnosticCode._map[146] = "Call_signatures_used_in_a__new__expression_must_have_a__void__return_type";
        DiagnosticCode.Call_signatures_used_in_a__new__expression_must_have_a__void__return_type = 146;
        DiagnosticCode._map[147] = "Could_not_select_overload_for__new__expression";
        DiagnosticCode.Could_not_select_overload_for__new__expression = 147;
        DiagnosticCode._map[148] = "Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_";
        DiagnosticCode.Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_ = 148;
        DiagnosticCode._map[149] = "Could_not_select_overload_for__call__expression";
        DiagnosticCode.Could_not_select_overload_for__call__expression = 149;
        DiagnosticCode._map[150] = "Unable_to_invoke_type_with_no_call_signatures";
        DiagnosticCode.Unable_to_invoke_type_with_no_call_signatures = 150;
        DiagnosticCode._map[151] = "Calls_to__super__are_only_valid_inside_a_class";
        DiagnosticCode.Calls_to__super__are_only_valid_inside_a_class = 151;
        DiagnosticCode._map[152] = "Generic_type__0__requires_1_type_argument_s_";
        DiagnosticCode.Generic_type__0__requires_1_type_argument_s_ = 152;
        DiagnosticCode._map[153] = "Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_";
        DiagnosticCode.Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_ = 153;
        DiagnosticCode._map[154] = "Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements";
        DiagnosticCode.Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements = 154;
        DiagnosticCode._map[155] = "Could_not_find_enclosing_symbol_for_dotted_name__0_";
        DiagnosticCode.Could_not_find_enclosing_symbol_for_dotted_name__0_ = 155;
        DiagnosticCode._map[156] = "The_property__0__does_not_exist_on_value_of_type__1__";
        DiagnosticCode.The_property__0__does_not_exist_on_value_of_type__1__ = 156;
        DiagnosticCode._map[157] = "Could_not_find_symbol__0_";
        DiagnosticCode.Could_not_find_symbol__0_ = 157;
        DiagnosticCode._map[158] = "_get__and__set__accessor_must_have_the_same_type";
        DiagnosticCode._get__and__set__accessor_must_have_the_same_type = 158;
        DiagnosticCode._map[159] = "_this__cannot_be_referenced_in_current_location";
        DiagnosticCode._this__cannot_be_referenced_in_current_location = 159;
        DiagnosticCode._map[160] = "Use_of_deprecated__bool__type__Use__boolean__instead";
        DiagnosticCode.Use_of_deprecated__bool__type__Use__boolean__instead = 160;
        DiagnosticCode._map[161] = "Class__0__is_recursively_referenced_as_a_base_type_of_itself";
        DiagnosticCode.Class__0__is_recursively_referenced_as_a_base_type_of_itself = 161;
        DiagnosticCode._map[162] = "Interface__0__is_recursively_referenced_as_a_base_type_of_itself";
        DiagnosticCode.Interface__0__is_recursively_referenced_as_a_base_type_of_itself = 162;
        DiagnosticCode._map[163] = "_super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class";
        DiagnosticCode._super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class = 163;
        DiagnosticCode._map[164] = "_super__cannot_be_referenced_in_non_derived_classes";
        DiagnosticCode._super__cannot_be_referenced_in_non_derived_classes = 164;
        DiagnosticCode._map[165] = "A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties";
        DiagnosticCode.A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties = 165;
        DiagnosticCode._map[166] = "Constructors_for_derived_classes_must_contain_a__super__call";
        DiagnosticCode.Constructors_for_derived_classes_must_contain_a__super__call = 166;
        DiagnosticCode._map[167] = "Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors";
        DiagnosticCode.Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors = 167;
        DiagnosticCode._map[168] = "_0_1__is_inaccessible";
        DiagnosticCode._0_1__is_inaccessible = 168;
        DiagnosticCode._map[169] = "_this__cannot_be_referenced_within_module_bodies";
        DiagnosticCode._this__cannot_be_referenced_within_module_bodies = 169;
        DiagnosticCode._map[170] = "_this__must_only_be_used_inside_a_function_or_script_context";
        DiagnosticCode._this__must_only_be_used_inside_a_function_or_script_context = 170;
        DiagnosticCode._map[171] = "Invalid__addition__expression___types_do_not_agree";
        DiagnosticCode.Invalid__addition__expression___types_do_not_agree = 171;
        DiagnosticCode._map[172] = "The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type";
        DiagnosticCode.The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type = 172;
        DiagnosticCode._map[173] = "The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type";
        DiagnosticCode.The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type = 173;
        DiagnosticCode._map[174] = "The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type";
        DiagnosticCode.The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type = 174;
        DiagnosticCode._map[175] = "Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation";
        DiagnosticCode.Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation = 175;
        DiagnosticCode._map[176] = "Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_";
        DiagnosticCode.Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_ = 176;
        DiagnosticCode._map[177] = "The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter";
        DiagnosticCode.The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter = 177;
        DiagnosticCode._map[178] = "The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_";
        DiagnosticCode.The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_ = 178;
        DiagnosticCode._map[179] = "The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter";
        DiagnosticCode.The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter = 179;
        DiagnosticCode._map[180] = "The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter";
        DiagnosticCode.The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter = 180;
        DiagnosticCode._map[181] = "The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type";
        DiagnosticCode.The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type = 181;
        DiagnosticCode._map[182] = "Setters_cannot_return_a_value";
        DiagnosticCode.Setters_cannot_return_a_value = 182;
        DiagnosticCode._map[183] = "Tried_to_set_variable_type_to_uninitialized_module_type";
        DiagnosticCode.Tried_to_set_variable_type_to_uninitialized_module_type = 183;
        DiagnosticCode._map[184] = "Tried_to_set_variable_type_to_uninitialized_module_type__0__";
        DiagnosticCode.Tried_to_set_variable_type_to_uninitialized_module_type__0__ = 184;
        DiagnosticCode._map[185] = "Function__0__declared_a_non_void_return_type__but_has_no_return_expression";
        DiagnosticCode.Function__0__declared_a_non_void_return_type__but_has_no_return_expression = 185;
        DiagnosticCode._map[186] = "Getters_must_return_a_value";
        DiagnosticCode.Getters_must_return_a_value = 186;
        DiagnosticCode._map[187] = "Getter_and_setter_accessors_do_not_agree_in_visibility";
        DiagnosticCode.Getter_and_setter_accessors_do_not_agree_in_visibility = 187;
        DiagnosticCode._map[188] = "Invalid_left_hand_side_of_assignment_expression";
        DiagnosticCode.Invalid_left_hand_side_of_assignment_expression = 188;
        DiagnosticCode._map[189] = "Function_declared_a_non_void_return_type__but_has_no_return_expression";
        DiagnosticCode.Function_declared_a_non_void_return_type__but_has_no_return_expression = 189;
        DiagnosticCode._map[190] = "Cannot_resolve_return_type_reference";
        DiagnosticCode.Cannot_resolve_return_type_reference = 190;
        DiagnosticCode._map[191] = "Constructors_cannot_have_a_return_type_of__void_";
        DiagnosticCode.Constructors_cannot_have_a_return_type_of__void_ = 191;
        DiagnosticCode._map[192] = "Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_";
        DiagnosticCode.Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_ = 192;
        DiagnosticCode._map[193] = "All_symbols_within_a__with__block_will_be_resolved_to__any__";
        DiagnosticCode.All_symbols_within_a__with__block_will_be_resolved_to__any__ = 193;
        DiagnosticCode._map[194] = "Import_declarations_in_an_internal_module_cannot_reference_an_external_module";
        DiagnosticCode.Import_declarations_in_an_internal_module_cannot_reference_an_external_module = 194;
        DiagnosticCode._map[195] = "Class__0__declares_interface__1__but_does_not_implement_it__NL__2";
        DiagnosticCode.Class__0__declares_interface__1__but_does_not_implement_it__NL__2 = 195;
        DiagnosticCode._map[196] = "Class__0__declares_class__1__but_does_not_implement_it__NL__2";
        DiagnosticCode.Class__0__declares_class__1__but_does_not_implement_it__NL__2 = 196;
        DiagnosticCode._map[197] = "The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer";
        DiagnosticCode.The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer = 197;
        DiagnosticCode._map[198] = "_this__cannot_be_referenced_in_initializers_in_a_class_body";
        DiagnosticCode._this__cannot_be_referenced_in_initializers_in_a_class_body = 198;
        DiagnosticCode._map[199] = "Class__0__cannot_extend_class__1__NL__2";
        DiagnosticCode.Class__0__cannot_extend_class__1__NL__2 = 199;
        DiagnosticCode._map[200] = "Interface__0__cannot_extend_class__1__NL__2";
        DiagnosticCode.Interface__0__cannot_extend_class__1__NL__2 = 200;
        DiagnosticCode._map[201] = "Interface__0__cannot_extend_interface__1__NL__2";
        DiagnosticCode.Interface__0__cannot_extend_interface__1__NL__2 = 201;
        DiagnosticCode._map[202] = "Duplicate_overload_signature_for__0_";
        DiagnosticCode.Duplicate_overload_signature_for__0_ = 202;
        DiagnosticCode._map[203] = "Duplicate_constructor_overload_signature";
        DiagnosticCode.Duplicate_constructor_overload_signature = 203;
        DiagnosticCode._map[204] = "Duplicate_overload_call_signature";
        DiagnosticCode.Duplicate_overload_call_signature = 204;
        DiagnosticCode._map[205] = "Duplicate_overload_construct_signature";
        DiagnosticCode.Duplicate_overload_construct_signature = 205;
        DiagnosticCode._map[206] = "Overload_signature_is_not_compatible_with_function_definition";
        DiagnosticCode.Overload_signature_is_not_compatible_with_function_definition = 206;
        DiagnosticCode._map[207] = "Overload_signature_is_not_compatible_with_function_definition__NL__0";
        DiagnosticCode.Overload_signature_is_not_compatible_with_function_definition__NL__0 = 207;
        DiagnosticCode._map[208] = "Overload_signatures_must_all_be_public_or_private";
        DiagnosticCode.Overload_signatures_must_all_be_public_or_private = 208;
        DiagnosticCode._map[209] = "Overload_signatures_must_all_be_exported_or_local";
        DiagnosticCode.Overload_signatures_must_all_be_exported_or_local = 209;
        DiagnosticCode._map[210] = "Overload_signatures_must_all_be_ambient_or_non_ambient";
        DiagnosticCode.Overload_signatures_must_all_be_ambient_or_non_ambient = 210;
        DiagnosticCode._map[211] = "Overload_signatures_must_all_be_optional_or_required";
        DiagnosticCode.Overload_signatures_must_all_be_optional_or_required = 211;
        DiagnosticCode._map[212] = "Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature";
        DiagnosticCode.Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature = 212;
        DiagnosticCode._map[213] = "_this__cannot_be_referenced_in_constructor_arguments";
        DiagnosticCode._this__cannot_be_referenced_in_constructor_arguments = 213;
        DiagnosticCode._map[214] = "Static_member_cannot_be_accessed_off_an_instance_variable";
        DiagnosticCode.Static_member_cannot_be_accessed_off_an_instance_variable = 214;
        DiagnosticCode._map[215] = "Instance_member_cannot_be_accessed_off_a_class";
        DiagnosticCode.Instance_member_cannot_be_accessed_off_a_class = 215;
        DiagnosticCode._map[216] = "Untyped_function_calls_may_not_accept_type_arguments";
        DiagnosticCode.Untyped_function_calls_may_not_accept_type_arguments = 216;
        DiagnosticCode._map[217] = "Non_generic_functions_may_not_accept_type_arguments";
        DiagnosticCode.Non_generic_functions_may_not_accept_type_arguments = 217;
        DiagnosticCode._map[218] = "Static_methods_cannot_reference_class_type_parameters";
        DiagnosticCode.Static_methods_cannot_reference_class_type_parameters = 218;
        DiagnosticCode._map[219] = "Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___";
        DiagnosticCode.Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___ = 219;
        DiagnosticCode._map[220] = "Rest_parameters_must_be_array_types";
        DiagnosticCode.Rest_parameters_must_be_array_types = 220;
        DiagnosticCode._map[221] = "Type__0__is_missing_property__1__from_type__2_";
        DiagnosticCode.Type__0__is_missing_property__1__from_type__2_ = 221;
        DiagnosticCode._map[222] = "Types_of_property__0__of_types__1__and__2__are_incompatible";
        DiagnosticCode.Types_of_property__0__of_types__1__and__2__are_incompatible = 222;
        DiagnosticCode._map[223] = "Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3";
        DiagnosticCode.Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3 = 223;
        DiagnosticCode._map[224] = "Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_";
        DiagnosticCode.Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_ = 224;
        DiagnosticCode._map[225] = "Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_";
        DiagnosticCode.Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_ = 225;
        DiagnosticCode._map[226] = "Types__0__and__1__define_property__2__as_private";
        DiagnosticCode.Types__0__and__1__define_property__2__as_private = 226;
        DiagnosticCode._map[227] = "Call_signatures_of_types__0__and__1__are_incompatible";
        DiagnosticCode.Call_signatures_of_types__0__and__1__are_incompatible = 227;
        DiagnosticCode._map[228] = "Call_signatures_of_types__0__and__1__are_incompatible__NL__2";
        DiagnosticCode.Call_signatures_of_types__0__and__1__are_incompatible__NL__2 = 228;
        DiagnosticCode._map[229] = "Type__0__requires_a_call_signature__but_Type__1__lacks_one";
        DiagnosticCode.Type__0__requires_a_call_signature__but_Type__1__lacks_one = 229;
        DiagnosticCode._map[230] = "Construct_signatures_of_types__0__and__1__are_incompatible";
        DiagnosticCode.Construct_signatures_of_types__0__and__1__are_incompatible = 230;
        DiagnosticCode._map[231] = "Construct_signatures_of_types__0__and__1__are_incompatible__NL__2";
        DiagnosticCode.Construct_signatures_of_types__0__and__1__are_incompatible__NL__2 = 231;
        DiagnosticCode._map[232] = "Type__0__requires_a_construct_signature__but_Type__1__lacks_one";
        DiagnosticCode.Type__0__requires_a_construct_signature__but_Type__1__lacks_one = 232;
        DiagnosticCode._map[233] = "Index_signatures_of_types__0__and__1__are_incompatible";
        DiagnosticCode.Index_signatures_of_types__0__and__1__are_incompatible = 233;
        DiagnosticCode._map[234] = "Index_signatures_of_types__0__and__1__are_incompatible__NL__2";
        DiagnosticCode.Index_signatures_of_types__0__and__1__are_incompatible__NL__2 = 234;
        DiagnosticCode._map[235] = "Call_signature_expects__0__or_fewer_parameters";
        DiagnosticCode.Call_signature_expects__0__or_fewer_parameters = 235;
        DiagnosticCode._map[236] = "Could_not_apply_type__0__to_argument__1__which_is_of_type__2_";
        DiagnosticCode.Could_not_apply_type__0__to_argument__1__which_is_of_type__2_ = 236;
        DiagnosticCode._map[237] = "Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function";
        DiagnosticCode.Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function = 237;
        DiagnosticCode._map[238] = "Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function";
        DiagnosticCode.Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function = 238;
        DiagnosticCode._map[239] = "Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor";
        DiagnosticCode.Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor = 239;
        DiagnosticCode._map[240] = "Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property";
        DiagnosticCode.Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property = 240;
        DiagnosticCode._map[241] = "Types_of_static_property__0__of_class__1__and_class__2__are_incompatible";
        DiagnosticCode.Types_of_static_property__0__of_class__1__and_class__2__are_incompatible = 241;
        DiagnosticCode._map[242] = "Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3";
        DiagnosticCode.Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3 = 242;
        DiagnosticCode._map[243] = "Current_host_does_not_support__w_atch_option";
        DiagnosticCode.Current_host_does_not_support__w_atch_option = 243;
        DiagnosticCode._map[244] = "ECMAScript_target_version__0__not_supported___Using_default__1__code_generation";
        DiagnosticCode.ECMAScript_target_version__0__not_supported___Using_default__1__code_generation = 244;
        DiagnosticCode._map[245] = "Module_code_generation__0__not_supported___Using_default__1__code_generation";
        DiagnosticCode.Module_code_generation__0__not_supported___Using_default__1__code_generation = 245;
        DiagnosticCode._map[246] = "Could_not_find_file___0_";
        DiagnosticCode.Could_not_find_file___0_ = 246;
        DiagnosticCode._map[247] = "Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed";
        DiagnosticCode.Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed = 247;
        DiagnosticCode._map[248] = "A_file_cannot_have_a_reference_itself";
        DiagnosticCode.A_file_cannot_have_a_reference_itself = 248;
        DiagnosticCode._map[249] = "Cannot_resolve_referenced_file___0_";
        DiagnosticCode.Cannot_resolve_referenced_file___0_ = 249;
        DiagnosticCode._map[250] = "Cannot_resolve_imported_file___0_";
        DiagnosticCode.Cannot_resolve_imported_file___0_ = 250;
    })(TypeScript.DiagnosticCode || (TypeScript.DiagnosticCode = {}));
    var DiagnosticCode = TypeScript.DiagnosticCode;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    TypeScript.diagnosticMessages = {
        error_TS_0__1: {
            category: 2 /* NoPrefix */,
            message: "error TS{0}: {1}",
            code: 0
        },
        warning_TS_0__1: {
            category: 2 /* NoPrefix */,
            message: "warning TS{0}: {1}",
            code: 1
        },
        _0__NL__1_TB__2: {
            category: 2 /* NoPrefix */,
            message: "{0}{NL}{{1}TB}{2}",
            code: 21
        },
        _0_TB__1: {
            category: 2 /* NoPrefix */,
            message: "{{0}TB}{1}",
            code: 22
        },
        Unrecognized_escape_sequence: {
            category: 1 /* Error */,
            message: "Unrecognized escape sequence.",
            code: 1000
        },
        Unexpected_character_0: {
            category: 1 /* Error */,
            message: "Unexpected character {0}.",
            code: 1001
        },
        Missing_closing_quote_character: {
            category: 1 /* Error */,
            message: "Missing close quote character.",
            code: 1002
        },
        Identifier_expected: {
            category: 1 /* Error */,
            message: "Identifier expected.",
            code: 1003
        },
        _0_keyword_expected: {
            category: 1 /* Error */,
            message: "'{0}' keyword expected.",
            code: 1004
        },
        _0_expected: {
            category: 1 /* Error */,
            message: "'{0}' expected.",
            code: 1005
        },
        Identifier_expected__0__is_a_keyword: {
            category: 1 /* Error */,
            message: "Identifier expected; '{0}' is a keyword.",
            code: 1006
        },
        Automatic_semicolon_insertion_not_allowed: {
            category: 1 /* Error */,
            message: "Automatic semicolon insertion not allowed.",
            code: 1007
        },
        Unexpected_token__0_expected: {
            category: 1 /* Error */,
            message: "Unexpected token; '{0}' expected.",
            code: 1008
        },
        Trailing_separator_not_allowed: {
            category: 1 /* Error */,
            message: "Trailing separator not allowed.",
            code: 1009
        },
        _StarSlash__expected: {
            category: 1 /* Error */,
            message: "'*/' expected.",
            code: 1010
        },
        _public_or_private_modifier_must_precede__static_: {
            category: 1 /* Error */,
            message: "'public' or 'private' modifier must precede 'static'.",
            code: 1011
        },
        Unexpected_token_: {
            category: 1 /* Error */,
            message: "Unexpected token.",
            code: 1012
        },
        A_catch_clause_variable_cannot_have_a_type_annotation: {
            category: 1 /* Error */,
            message: "A catch clause variable cannot have a type annotation.",
            code: 1013
        },
        Rest_parameter_must_be_last_in_list: {
            category: 1 /* Error */,
            message: "Rest parameter must be last in list.",
            code: 1014
        },
        Parameter_cannot_have_question_mark_and_initializer: {
            category: 1 /* Error */,
            message: "Parameter cannot have question mark and initializer.",
            code: 1015
        },
        Required_parameter_cannot_follow_optional_parameter: {
            category: 1 /* Error */,
            message: "required parameter cannot follow optional parameter.",
            code: 1016
        },
        Index_signatures_cannot_have_rest_parameters: {
            category: 1 /* Error */,
            message: "Index signatures cannot have rest parameters.",
            code: 1017
        },
        Index_signature_parameter_cannot_have_accessibility_modifiers: {
            category: 1 /* Error */,
            message: "Index signature parameter cannot have accessibility modifiers.",
            code: 1018
        },
        Index_signature_parameter_cannot_have_a_question_mark: {
            category: 1 /* Error */,
            message: "Index signature parameter cannot have a question mark.",
            code: 1019
        },
        Index_signature_parameter_cannot_have_an_initializer: {
            category: 1 /* Error */,
            message: "Index signature parameter cannot have an initializer.",
            code: 1020
        },
        Index_signature_must_have_a_type_annotation: {
            category: 1 /* Error */,
            message: "Index signature must have a type annotation.",
            code: 1021
        },
        Index_signature_parameter_must_have_a_type_annotation: {
            category: 1 /* Error */,
            message: "Index signature parameter must have a type annotation.",
            code: 1022
        },
        Index_signature_parameter_type_must_be__string__or__number_: {
            category: 1 /* Error */,
            message: "Index signature parameter type must be 'string' or 'number'.",
            code: 1023
        },
        _extends__clause_already_seen: {
            category: 1 /* Error */,
            message: "'extends' clause already seen.",
            code: 1024
        },
        _extends__clause_must_precede__implements__clause: {
            category: 1 /* Error */,
            message: "'extends' clause must precede 'implements' clause.",
            code: 1025
        },
        Class_can_only_extend_single_type: {
            category: 1 /* Error */,
            message: "Class can only extend single type.",
            code: 1026
        },
        _implements__clause_already_seen: {
            category: 1 /* Error */,
            message: "'implements' clause already seen.",
            code: 1027
        },
        Accessibility_modifier_already_seen: {
            category: 1 /* Error */,
            message: "Accessibility modifier already seen.",
            code: 1028
        },
        _0__modifier_must_precede__1__modifier: {
            category: 1 /* Error */,
            message: "'{0}' modifier must precede '{1}' modifier.",
            code: 1029
        },
        _0__modifier_already_seen: {
            category: 1 /* Error */,
            message: "'{0}' modifier already seen.",
            code: 1030
        },
        _0__modifier_cannot_appear_on_a_class_element: {
            category: 1 /* Error */,
            message: "'{0}' modifier cannot appear on a class element.",
            code: 1031
        },
        Interface_declaration_cannot_have__implements__clause: {
            category: 1 /* Error */,
            message: "Interface declaration cannot have 'implements' clause.",
            code: 1032
        },
        Enum_element_must_have_initializer: {
            category: 1 /* Error */,
            message: "Enum element must have initializer.",
            code: 1033
        },
        _super__invocation_cannot_have_type_arguments: {
            category: 1 /* Error */,
            message: "'super' invocation cannot have type arguments.",
            code: 1034
        },
        Non_ambient_modules_cannot_use_quoted_names: {
            category: 1 /* Error */,
            message: "Non ambient modules cannot use quoted names.",
            code: 1035
        },
        Statements_are_not_allowed_in_ambient_contexts: {
            category: 1 /* Error */,
            message: "Statements are not allowed in ambient contexts.",
            code: 1036
        },
        Implementations_are_not_allowed_in_ambient_contexts: {
            category: 1 /* Error */,
            message: "Implementations are not allowed in ambient contexts.",
            code: 1037
        },
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: {
            category: 1 /* Error */,
            message: "'declare' modifier not allowed for code already in an ambient context.",
            code: 1038
        },
        Initializers_are_not_allowed_in_ambient_contexts: {
            category: 1 /* Error */,
            message: "Initializers are not allowed in ambient contexts.",
            code: 1039
        },
        Overload_and_ambient_signatures_cannot_specify_parameter_properties: {
            category: 1 /* Error */,
            message: "Overload and ambient signatures cannot specify parameter properties.",
            code: 1040
        },
        Function_implementation_expected: {
            category: 1 /* Error */,
            message: "Function implementation expected.",
            code: 1041
        },
        Constructor_implementation_expected: {
            category: 1 /* Error */,
            message: "Constructor implementation expected.",
            code: 1042
        },
        Function_overload_name_must_be__0_: {
            category: 1 /* Error */,
            message: "Function overload name must be '{0}'.",
            code: 1043
        },
        _0__modifier_cannot_appear_on_a_module_element: {
            category: 1 /* Error */,
            message: "'{0}' modifier cannot appear on a module element.",
            code: 1044
        },
        _declare__modifier_cannot_appear_on_an_interface_declaration: {
            category: 1 /* Error */,
            message: "'declare' modifier cannot appear on an interface declaration.",
            code: 1045
        },
        _declare__modifier_required_for_top_level_element: {
            category: 1 /* Error */,
            message: "'declare' modifier required for top level element.",
            code: 1046
        },
        Rest_parameter_cannot_be_optional: {
            category: 1 /* Error */,
            message: "Rest parameter cannot be optional.",
            code: 1047
        },
        Rest_parameter_cannot_have_initializer: {
            category: 1 /* Error */,
            message: "Rest parameter cannot have initializer.",
            code: 1048
        },
        _set__accessor_must_have_only_one_parameter: {
            category: 1 /* Error */,
            message: "'set' accessor must have one and only one parameter.",
            code: 1049
        },
        _set__accessor_parameter_cannot_have_accessibility_modifier: {
            category: 1 /* Error */,
            message: "'set' accessor parameter cannot have accessibility modifier.",
            code: 1050
        },
        _set__accessor_parameter_cannot_be_optional: {
            category: 1 /* Error */,
            message: "'set' accessor parameter cannot be optional.",
            code: 1051
        },
        _set__accessor_parameter_cannot_have_initializer: {
            category: 1 /* Error */,
            message: "'set' accessor parameter cannot have initializer.",
            code: 1052
        },
        _set__accessor_cannot_have_rest_parameter: {
            category: 1 /* Error */,
            message: "'set' accessor cannot have rest parameter.",
            code: 1053
        },
        _get__accessor_cannot_have_parameters: {
            category: 1 /* Error */,
            message: "'get' accessor cannot have parameters.",
            code: 1054
        },
        Modifiers_cannot_appear_here: {
            category: 1 /* Error */,
            message: "Modifiers cannot appear here.",
            code: 1055
        },
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher: {
            category: 1 /* Error */,
            message: "Accessors are only when targeting EcmaScript5 and higher.",
            code: 1056
        },
        Duplicate_identifier__0_: {
            category: 1 /* Error */,
            message: "Duplicate identifier '{0}'.",
            code: 2000
        },
        The_name__0__does_not_exist_in_the_current_scope: {
            category: 1 /* Error */,
            message: "The name '{0}' does not exist in the current scope.",
            code: 2001
        },
        The_name__0__does_not_refer_to_a_value: {
            category: 1 /* Error */,
            message: "The name '{0}' does not refer to a value.",
            code: 2002
        },
        Keyword__super__can_only_be_used_inside_a_class_instance_method: {
            category: 1 /* Error */,
            message: "Keyword 'super' can only be used inside a class instance method.",
            code: 2003
        },
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: {
            category: 1 /* Error */,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer.",
            code: 2004
        },
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2005
        },
        Value_of_type__0__is_not_callable: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not callable.",
            code: 2006
        },
        Value_of_type__0__is_not_newable: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not newable.",
            code: 2007
        },
        Value_of_type__0__is_not_indexable_by_type__1_: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not indexable by type '{1}'.",
            code: 2008
        },
        Operator__0__cannot_be_applied_to_types__1__and__2_: {
            category: 1 /* Error */,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
            code: 2009
        },
        Operator__0__cannot_be_applied_to_types__1__and__2__3: {
            category: 1 /* Error */,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 2010
        },
        Cannot_convert__0__to__1_: {
            category: 1 /* Error */,
            message: "Cannot convert '{0}' to '{1}'.",
            code: 2011
        },
        Cannot_convert__0__to__1__NL__2: {
            category: 1 /* Error */,
            message: "Cannot convert '{0}' to '{1}':{NL}{2}",
            code: 2012
        },
        Expected_var__class__interface__or_module: {
            category: 1 /* Error */,
            message: "Expected var, class, interface, or module.",
            code: 2013
        },
        Operator__0__cannot_be_applied_to_type__1_: {
            category: 1 /* Error */,
            message: "Operator '{0}' cannot be applied to type '{1}'.",
            code: 2014
        },
        Getter__0__already_declared: {
            category: 1 /* Error */,
            message: "Getter '{0}' already declared.",
            code: 2015
        },
        Setter__0__already_declared: {
            category: 1 /* Error */,
            message: "Setter '{0}' already declared.",
            code: 2016
        },
        Accessor_cannot_have_type_parameters: {
            category: 1 /* Error */,
            message: "Accessors cannot have type parameters.",
            code: 2017
        },
        Exported_class__0__extends_private_class__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' extends private class '{1}'.",
            code: 2018
        },
        Exported_class__0__implements_private_interface__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' implements private interface '{1}'.",
            code: 2019
        },
        Exported_interface__0__extends_private_interface__1_: {
            category: 1 /* Error */,
            message: "Exported interface '{0}' extends private interface '{1}'.",
            code: 2020
        },
        Exported_class__0__extends_class_from_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' extends class from inaccessible module {1}.",
            code: 2021
        },
        Exported_class__0__implements_interface_from_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' implements interface from inaccessible module {1}.",
            code: 2022
        },
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported interface '{0}' extends interface from inaccessible module {1}.",
            code: 2023
        },
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Public static property '{0}' of exported class has or is using private type '{1}'.",
            code: 2024
        },
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Public property '{0}' of exported class has or is using private type '{1}'.",
            code: 2025
        },
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Property '{0}' of exported interface has or is using private type '{1}'.",
            code: 2026
        },
        Exported_variable__0__has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Exported variable '{0}' has or is using private type '{1}'.",
            code: 2027
        },
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Public static property '{0}' of exported class is using inaccessible module {1}.",
            code: 2028
        },
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Public property '{0}' of exported class is using inaccessible module {1}.",
            code: 2029
        },
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Property '{0}' of exported interface is using inaccessible module {1}.",
            code: 2030
        },
        Exported_variable__0__is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported variable '{0}' is using inaccessible module {1}.",
            code: 2031
        },
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.",
            code: 2032
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.",
            code: 2033
        },
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.",
            code: 2034
        },
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.",
            code: 2035
        },
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.",
            code: 2036
        },
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.",
            code: 2037
        },
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public method from exported class has or is using private type '{1}'.",
            code: 2038
        },
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of method from exported interface has or is using private type '{1}'.",
            code: 2039
        },
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of exported function has or is using private type '{1}'.",
            code: 2040
        },
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.",
            code: 2041
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.",
            code: 2042
        },
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.",
            code: 2043
        },
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.",
            code: 2044
        },
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}",
            code: 2045
        },
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.",
            code: 2046
        },
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public method from exported class is using inaccessible module {1}.",
            code: 2047
        },
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of method from exported interface is using inaccessible module {1}.",
            code: 2048
        },
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of exported function is using inaccessible module {1}.",
            code: 2049
        },
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public static property getter from exported class has or is using private type '{0}'.",
            code: 2050
        },
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public property getter from exported class has or is using private type '{0}'.",
            code: 2051
        },
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of constructor signature from exported interface has or is using private type '{0}'.",
            code: 2052
        },
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of call signature from exported interface has or is using private type '{0}'.",
            code: 2053
        },
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of index signature from exported interface has or is using private type '{0}'.",
            code: 2054
        },
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public static method from exported class has or is using private type '{0}'.",
            code: 2055
        },
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public method from exported class has or is using private type '{0}'.",
            code: 2056
        },
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of method from exported interface has or is using private type '{0}'.",
            code: 2057
        },
        Return_type_of_exported_function_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of exported function has or is using private type '{0}'.",
            code: 2058
        },
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public static property getter from exported class is using inaccessible module {0}.",
            code: 2059
        },
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public property getter from exported class is using inaccessible module {0}.",
            code: 2060
        },
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of constructor signature from exported interface is using inaccessible module {0}.",
            code: 2061
        },
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of call signature from exported interface is using inaccessible module {0}.",
            code: 2062
        },
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of index signature from exported interface is using inaccessible module {0}.",
            code: 2063
        },
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public static method from exported class is using inaccessible module {0}.",
            code: 2064
        },
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public method from exported class is using inaccessible module {0}.",
            code: 2065
        },
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of method from exported interface is using inaccessible module {0}.",
            code: 2066
        },
        Return_type_of_exported_function_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of exported function is using inaccessible module {0}.",
            code: 2067
        },
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: {
            category: 1 /* Error */,
            message: "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.",
            code: 2068
        },
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: {
            category: 1 /* Error */,
            message: "A parameter list must follow a generic type argument list. '(' expected.",
            code: 2069
        },
        Multiple_constructor_implementations_are_not_allowed: {
            category: 1 /* Error */,
            message: "Multiple constructor implementations are not allowed.",
            code: 2070
        },
        Unable_to_resolve_external_module__0_: {
            category: 1 /* Error */,
            message: "Unable to resolve external module '{0}'.",
            code: 2071
        },
        Module_cannot_be_aliased_to_a_non_module_type: {
            category: 1 /* Error */,
            message: "Module cannot be aliased to a non-module type.",
            code: 2072
        },
        A_class_may_only_extend_another_class: {
            category: 1 /* Error */,
            message: "A class may only extend another class.",
            code: 2073
        },
        A_class_may_only_implement_another_class_or_interface: {
            category: 1 /* Error */,
            message: "A class may only implement another class or interface.",
            code: 2074
        },
        An_interface_may_only_extend_another_class_or_interface: {
            category: 1 /* Error */,
            message: "An interface may only extend another class or interface.",
            code: 2075
        },
        An_interface_cannot_implement_another_type: {
            category: 1 /* Error */,
            message: "An interface cannot implement another type.",
            code: 2076
        },
        Unable_to_resolve_type: {
            category: 1 /* Error */,
            message: "Unable to resolve type.",
            code: 2077
        },
        Unable_to_resolve_type_of__0_: {
            category: 1 /* Error */,
            message: "Unable to resolve type of '{0}'.",
            code: 2078
        },
        Unable_to_resolve_type_parameter_constraint: {
            category: 1 /* Error */,
            message: "Unable to resolve type parameter constraint.",
            code: 2079
        },
        Type_parameter_constraint_cannot_be_a_primitive_type: {
            category: 1 /* Error */,
            message: "Type parameter constraint cannot be a primitive type.",
            code: 2080
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target: {
            category: 1 /* Error */,
            message: "Supplied parameters do not match any signature of call target.",
            code: 2081
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0: {
            category: 1 /* Error */,
            message: "Supplied parameters do not match any signature of call target:{NL}{0}",
            code: 2082
        },
        Invalid__new__expression: {
            category: 1 /* Error */,
            message: "Invalid 'new' expression.",
            code: 2083
        },
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: {
            category: 1 /* Error */,
            message: "Call sigantures used in a 'new' expression must have a 'void' return type.",
            code: 2084
        },
        Could_not_select_overload_for__new__expression: {
            category: 1 /* Error */,
            message: "Could not select overload for 'new' expression.",
            code: 2085
        },
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: {
            category: 1 /* Error */,
            message: "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.",
            code: 2086
        },
        Could_not_select_overload_for__call__expression: {
            category: 1 /* Error */,
            message: "Could not select overload for 'call' expression.",
            code: 2087
        },
        Unable_to_invoke_type_with_no_call_signatures: {
            category: 1 /* Error */,
            message: "Unable to invoke type with no call signatures.",
            code: 2088
        },
        Calls_to__super__are_only_valid_inside_a_class: {
            category: 1 /* Error */,
            message: "Calls to 'super' are only valid inside a class.",
            code: 2089
        },
        Generic_type__0__requires_1_type_argument_s_: {
            category: 1 /* Error */,
            message: "Generic type '{0}' requires {1} type argument(s).",
            code: 2090
        },
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: {
            category: 1 /* Error */,
            message: "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.",
            code: 2091
        },
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: {
            category: 1 /* Error */,
            message: "Type of array literal cannot be determined. Best common type could not be found for array elements.",
            code: 2092
        },
        Could_not_find_enclosing_symbol_for_dotted_name__0_: {
            category: 1 /* Error */,
            message: "Could not find enclosing symbol for dotted name '{0}'.",
            code: 2093
        },
        The_property__0__does_not_exist_on_value_of_type__1__: {
            category: 1 /* Error */,
            message: "The property '{0}' does not exist on value of type '{1}'.",
            code: 2094
        },
        Could_not_find_symbol__0_: {
            category: 1 /* Error */,
            message: "Could not find symbol '{0}'.",
            code: 2095
        },
        _get__and__set__accessor_must_have_the_same_type: {
            category: 1 /* Error */,
            message: "'get' and 'set' accessor must have the same type.",
            code: 2096
        },
        _this__cannot_be_referenced_in_current_location: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced in current location.",
            code: 2097
        },
        Use_of_deprecated__bool__type__Use__boolean__instead: {
            category: 0 /* Warning */,
            message: "Use of deprecated type 'bool'. Use 'boolean' instead.",
            code: 2098
        },
        Static_methods_cannot_reference_class_type_parameters: {
            category: 1 /* Error */,
            message: "Static methods cannot reference class type parameters.",
            code: 2099
        },
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: 1 /* Error */,
            message: "Class '{0}' is recursively referenced as a base type of itself.",
            code: 2100
        },
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: 1 /* Error */,
            message: "Interface '{0}' is recursively referenced as a base type of itself.",
            code: 2101
        },
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: {
            category: 1 /* Error */,
            message: "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.",
            code: 2102
        },
        _super__cannot_be_referenced_in_non_derived_classes: {
            category: 1 /* Error */,
            message: "'super' cannot be referenced in non-derived classes.",
            code: 2103
        },
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties: {
            category: 1 /* Error */,
            message: "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.",
            code: 2104
        },
        Constructors_for_derived_classes_must_contain_a__super__call: {
            category: 1 /* Error */,
            message: "Constructors for derived classes must contain a 'super' call.",
            code: 2105
        },
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: {
            category: 1 /* Error */,
            message: "Super calls are not permitted outside constructors or in local functions inside constructors.",
            code: 2106
        },
        _0_1__is_inaccessible: {
            category: 1 /* Error */,
            message: "'{0}.{1}' is inaccessible.",
            code: 2107
        },
        _this__cannot_be_referenced_within_module_bodies: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced within module bodies.",
            code: 2108
        },
        _this__must_only_be_used_inside_a_function_or_script_context: {
            category: 1 /* Error */,
            message: "'this' must only be used inside a function or script context.",
            code: 2109
        },
        Invalid__addition__expression___types_do_not_agree: {
            category: 1 /* Error */,
            message: "Invalid '+' expression - types do not agree.",
            code: 2111
        },
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: {
            category: 1 /* Error */,
            message: "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
            code: 2112
        },
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: {
            category: 1 /* Error */,
            message: "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
            code: 2113
        },
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type: {
            category: 1 /* Error */,
            message: "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.",
            code: 2114
        },
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation: {
            category: 1 /* Error */,
            message: "Variable declarations for for/in expressions cannot contain a type annotation.",
            code: 2115
        },
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_: {
            category: 1 /* Error */,
            message: "Variable declarations for for/in expressions must be of types 'string' or 'any'.",
            code: 2116
        },
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter: {
            category: 1 /* Error */,
            message: "The right operand of a for/in expression must be of type 'any', an object type or a type parameter.",
            code: 2117
        },
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_: {
            category: 1 /* Error */,
            message: "The left-hand side of an 'in' expression must be of types 'string' or 'any'.",
            code: 2118
        },
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: {
            category: 1 /* Error */,
            message: "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.",
            code: 2119
        },
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: {
            category: 1 /* Error */,
            message: "The left-hand side of an 'instanceOf' expression must be of type 'any', an object type or a type parameter.",
            code: 2120
        },
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type: {
            category: 1 /* Error */,
            message: "The right-hand side of an 'instanceOf' expression must be of type 'any' or a subtype of the 'Function' interface type.",
            code: 2121
        },
        Setters_cannot_return_a_value: {
            category: 1 /* Error */,
            message: "Setters cannot return a value.",
            code: 2122
        },
        Tried_to_set_variable_type_to_uninitialized_module_type: {
            category: 1 /* Error */,
            message: "Tried to set variable type to uninitialized module type.",
            code: 2123
        },
        Tried_to_set_variable_type_to_uninitialized_module_type__0__: {
            category: 1 /* Error */,
            message: "Tried to set variable type to uninitialized module type '{0}'.",
            code: 2124
        },
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression: {
            category: 1 /* Error */,
            message: "Function {0} declared a non-void return type, but has no return expression.",
            code: 2125
        },
        Getters_must_return_a_value: {
            category: 1 /* Error */,
            message: "Getters must return a value.",
            code: 2126
        },
        Getter_and_setter_accessors_do_not_agree_in_visibility: {
            category: 1 /* Error */,
            message: "Getter and setter accessors do not agree in visibility.",
            code: 2127
        },
        Invalid_left_hand_side_of_assignment_expression: {
            category: 1 /* Error */,
            message: "Invalid left-hand side of assignment expression.",
            code: 2130
        },
        Function_declared_a_non_void_return_type__but_has_no_return_expression: {
            category: 1 /* Error */,
            message: "Function declared a non-void return type, but has no return expression.",
            code: 2131
        },
        Cannot_resolve_return_type_reference: {
            category: 1 /* Error */,
            message: "Cannot resolve return type reference.",
            code: 2132
        },
        Constructors_cannot_have_a_return_type_of__void_: {
            category: 1 /* Error */,
            message: "Constructors cannot have a return type of 'void'.",
            code: 2133
        },
        Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_: {
            category: 1 /* Error */,
            message: "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'",
            code: 2134
        },
        All_symbols_within_a__with__block_will_be_resolved_to__any__: {
            category: 1 /* Error */,
            message: "All symbols within a with block will be resolved to 'any'.",
            code: 2135
        },
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: {
            category: 1 /* Error */,
            message: "Import declarations in an internal module cannot reference an external module.",
            code: 2136
        },
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2: {
            category: 1 /* Error */,
            message: "Class {0} declares interface {1} but does not implement it:{NL}{2}",
            code: 2137
        },
        Class__0__declares_class__1__but_does_not_implement_it__NL__2: {
            category: 1 /* Error */,
            message: "Class {0} declares class {1} as an implemented interface but does not implement it:{NL}{2}",
            code: 2138
        },
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer: {
            category: 1 /* Error */,
            message: "The operand of an increment or decrement operator must be a variable, property or indexer.",
            code: 2139
        },
        _this__cannot_be_referenced_in_initializers_in_a_class_body: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced in initializers in a class body.",
            code: 2140
        },
        Class__0__cannot_extend_class__1__NL__2: {
            category: 1 /* Error */,
            message: "Class '{0}' cannot extend class '{1}':{NL}{2}",
            code: 2141
        },
        Interface__0__cannot_extend_class__1__NL__2: {
            category: 1 /* Error */,
            message: "Interface '{0}' cannot extend class '{1}':{NL}{2}",
            code: 2142
        },
        Interface__0__cannot_extend_interface__1__NL__2: {
            category: 1 /* Error */,
            message: "Interface '{0}' cannot extend interface '{1}':{NL}{2}",
            code: 2143
        },
        Duplicate_overload_signature_for__0_: {
            category: 1 /* Error */,
            message: "Duplicate overload signature for '{0}'.",
            code: 2144
        },
        Duplicate_constructor_overload_signature: {
            category: 1 /* Error */,
            message: "Duplicate constructor overload signature.",
            code: 2145
        },
        Duplicate_overload_call_signature: {
            category: 1 /* Error */,
            message: "Duplicate overload call signature.",
            code: 2146
        },
        Duplicate_overload_construct_signature: {
            category: 1 /* Error */,
            message: "Duplicate overload construct signature.",
            code: 2147
        },
        Overload_signature_is_not_compatible_with_function_definition: {
            category: 1 /* Error */,
            message: "Overload signature is not compatible with function definition.",
            code: 2148
        },
        Overload_signature_is_not_compatible_with_function_definition__NL__0: {
            category: 1 /* Error */,
            message: "Overload signature is not compatible with function definition:{NL}{0}",
            code: 2149
        },
        Overload_signatures_must_all_be_public_or_private: {
            category: 1 /* Error */,
            message: "Overload signatures must all be public or private.",
            code: 2150
        },
        Overload_signatures_must_all_be_exported_or_local: {
            category: 1 /* Error */,
            message: "Overload signatures must all be exported or local.",
            code: 2151
        },
        Overload_signatures_must_all_be_ambient_or_non_ambient: {
            category: 1 /* Error */,
            message: "Overload signatures must all be ambient or non-ambient.",
            code: 2152
        },
        Overload_signatures_must_all_be_optional_or_required: {
            category: 1 /* Error */,
            message: "Overload signatures must all be optional or required.",
            code: 2153
        },
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: {
            category: 1 /* Error */,
            message: "Specialized overload signature is not subtype of any non-specialized signature.",
            code: 2154
        },
        _this__cannot_be_referenced_in_constructor_arguments: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced in constructor arguments.",
            code: 2155
        },
        Static_member_cannot_be_accessed_off_an_instance_variable: {
            category: 1 /* Error */,
            message: "Static member cannot be accessed off an instance variable.",
            code: 2156
        },
        Instance_member_cannot_be_accessed_off_a_class: {
            category: 1 /* Error */,
            message: "Instance member cannot be accessed off a class.",
            code: 2157
        },
        Untyped_function_calls_may_not_accept_type_arguments: {
            category: 1 /* Error */,
            message: "Untyped function calls may not accept type arguments.",
            code: 2158
        },
        Non_generic_functions_may_not_accept_type_arguments: {
            category: 1 /* Error */,
            message: "Non-generic functions may not accept type arguments.",
            code: 2159
        },
        A_generic_type_may_not_reference_itself_with_its_own_type_parameters: {
            category: 1 /* Error */,
            message: "A generic type may not reference itself with its own type parameters",
            code: 2160
        },
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2161
        },
        Rest_parameters_must_be_array_types: {
            category: 1 /* Error */,
            message: "Rest parameters must be array types",
            code: 2162
        },
        Type__0__is_missing_property__1__from_type__2_: {
            category: 2 /* NoPrefix */,
            message: "Type '{0}' is missing property '{1}' from type '{2}'.",
            code: 4000
        },
        Types_of_property__0__of_types__1__and__2__are_incompatible: {
            category: 2 /* NoPrefix */,
            message: "Types of property '{0}' of types '{1}' and '{2}' are incompatible.",
            code: 4001
        },
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3: {
            category: 2 /* NoPrefix */,
            message: "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}",
            code: 4002
        },
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_: {
            category: 2 /* NoPrefix */,
            message: "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.",
            code: 4003
        },
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_: {
            category: 2 /* NoPrefix */,
            message: "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.",
            code: 4004
        },
        Types__0__and__1__define_property__2__as_private: {
            category: 2 /* NoPrefix */,
            message: "Types '{0}' and '{1}' define property '{2}' as private.",
            code: 4005
        },
        Call_signatures_of_types__0__and__1__are_incompatible: {
            category: 2 /* NoPrefix */,
            message: "Call signatures of types '{0}' and '{1}' are incompatible.",
            code: 4006
        },
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: 2 /* NoPrefix */,
            message: "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 4007
        },
        Type__0__requires_a_call_signature__but_Type__1__lacks_one: {
            category: 2 /* NoPrefix */,
            message: "Type '{0}' requires a call signature, but type '{1}' lacks one.",
            code: 4008
        },
        Construct_signatures_of_types__0__and__1__are_incompatible: {
            category: 2 /* NoPrefix */,
            message: "Construct signatures of types '{0}' and '{1}' are incompatible.",
            code: 4009
        },
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: 2 /* NoPrefix */,
            message: "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 40010
        },
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one: {
            category: 2 /* NoPrefix */,
            message: "Type '{0}' requires a construct signature, but type '{1}' lacks one.",
            code: 4011
        },
        Index_signatures_of_types__0__and__1__are_incompatible: {
            category: 2 /* NoPrefix */,
            message: "Index signatures of types '{0}' and '{1}' are incompatible.",
            code: 4012
        },
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: 2 /* NoPrefix */,
            message: "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 4013
        },
        Call_signature_expects__0__or_fewer_parameters: {
            category: 2 /* NoPrefix */,
            message: "Call signature expects {0} or fewer parameters.",
            code: 4014
        },
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_: {
            category: 2 /* NoPrefix */,
            message: "Could not apply type'{0}' to argument {1} which is of type '{2}'.",
            code: 4015
        },
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function: {
            category: 2 /* NoPrefix */,
            message: "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.",
            code: 4016
        },
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function: {
            category: 2 /* NoPrefix */,
            message: "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.",
            code: 4017
        },
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor: {
            category: 2 /* NoPrefix */,
            message: "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.",
            code: 4018
        },
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property: {
            category: 2 /* NoPrefix */,
            message: "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.",
            code: 4019
        },
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible: {
            category: 2 /* NoPrefix */,
            message: "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.",
            code: 4020
        },
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3: {
            category: 2 /* NoPrefix */,
            message: "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}",
            code: 4021
        },
        Current_host_does_not_support__w_atch_option: {
            category: 1 /* Error */,
            message: "Current host does not support -w[atch] option.",
            code: 5001
        },
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation: {
            category: 0 /* Warning */,
            message: "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.",
            code: 5002
        },
        Module_code_generation__0__not_supported___Using_default__1__code_generation: {
            category: 0 /* Warning */,
            message: "Module code generation '{0}' not supported.  Using default '{1}' code generation.",
            code: 5003
        },
        Could_not_find_file___0_: {
            category: 1 /* Error */,
            message: "Could not find file: '{0}'.",
            code: 5004
        },
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed: {
            category: 1 /* Error */,
            message: "Unknown extension for file: '{0}'. Only .ts and .d.ts extensions are allowed.",
            code: 5005
        },
        A_file_cannot_have_a_reference_itself: {
            category: 1 /* Error */,
            message: "A file cannot have a reference itself.",
            code: 5006
        },
        Cannot_resolve_referenced_file___0_: {
            category: 1 /* Error */,
            message: "Cannot resolve referenced file: '{0}'.",
            code: 5007
        },
        Cannot_resolve_imported_file___0_: {
            category: 1 /* Error */,
            message: "Cannot resolve imported file: '{0}'.",
            code: 5008
        }
    };
    var seenCodes = [];
    for (var name in TypeScript.diagnosticMessages) {
        if (TypeScript.diagnosticMessages.hasOwnProperty(name)) {
            var diagnosticMessage = TypeScript.diagnosticMessages[name];
            var value = seenCodes[diagnosticMessage.code];
            if (value) {
                throw new Error("Duplicate diagnostic code: " + diagnosticMessage.code);
            }
            seenCodes[diagnosticMessage.code] = diagnosticMessage;
        }
    }
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Errors = (function () {
        function Errors() {
        }
        Errors.argument = function (argument, message) {
            return new Error("Invalid argument: " + argument + "." + (message ? (" " + message) : ""));
        };
        Errors.argumentOutOfRange = function (argument) {
            return new Error("Argument out of range: " + argument + ".");
        };
        Errors.argumentNull = function (argument) {
            return new Error("Argument null: " + argument + ".");
        };
        Errors.abstract = function () {
            return new Error("Operation not implemented properly by subclass.");
        };
        Errors.notYetImplemented = function () {
            return new Error("Not yet implemented.");
        };
        Errors.invalidOperation = function (message) {
            return new Error(message ? ("Invalid operation: " + message) : "Invalid operation.");
        };
        return Errors;
    })();
    TypeScript.Errors = Errors;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Hash = (function () {
        function Hash() {
        }
        Hash.computeFnv1aCharArrayHashCode = function (text, start, len) {
            var hashCode = Hash.FNV_BASE;
            var end = start + len;
            for (var i = start; i < end; i++) {
                hashCode = (hashCode ^ text[i]) * Hash.FNV_PRIME;
            }
            return hashCode;
        };
        Hash.computeSimple31BitCharArrayHashCode = function (key, start, len) {
            var hash = 0;
            for (var i = 0; i < len; i++) {
                var ch = key[start + i];
                hash = (((hash << 5) + hash) + ch) | 0;
            }
            return hash & 0x7FFFFFFF;
        };
        Hash.computeSimple31BitStringHashCode = function (key) {
            var hash = 0;
            var start = 0;
            var len = key.length;
            for (var i = 0; i < len; i++) {
                var ch = key.charCodeAt(start + i);
                hash = (((hash << 5) + hash) + ch) | 0;
            }
            return hash & 0x7FFFFFFF;
        };
        Hash.computeMurmur2CharArrayHashCode = function (key, start, len) {
            var m = 0x5bd1e995;
            var r = 24;
            var numberOfCharsLeft = len;
            var h = (0 ^ numberOfCharsLeft);
            var index = start;
            while (numberOfCharsLeft >= 2) {
                var c1 = key[index];
                var c2 = key[index + 1];
                var k = c1 | (c2 << 16);
                k *= m;
                k ^= k >> r;
                k *= m;
                h *= m;
                h ^= k;
                index += 2;
                numberOfCharsLeft -= 2;
            }
            if (numberOfCharsLeft === 1) {
                h ^= key[index];
                h *= m;
            }
            h ^= h >> 13;
            h *= m;
            h ^= h >> 15;
            return h;
        };
        Hash.computeMurmur2StringHashCode = function (key) {
            var m = 0x5bd1e995;
            var r = 24;
            var start = 0;
            var len = key.length;
            var numberOfCharsLeft = len;
            var h = (0 ^ numberOfCharsLeft);
            var index = start;
            while (numberOfCharsLeft >= 2) {
                var c1 = key.charCodeAt(index);
                var c2 = key.charCodeAt(index + 1);
                var k = c1 | (c2 << 16);
                k *= m;
                k ^= k >> r;
                k *= m;
                h *= m;
                h ^= k;
                index += 2;
                numberOfCharsLeft -= 2;
            }
            if (numberOfCharsLeft === 1) {
                h ^= key.charCodeAt(index);
                h *= m;
            }
            h ^= h >> 13;
            h *= m;
            h ^= h >> 15;
            return h;
        };
        Hash.getPrime = function (min) {
            for (var i = 0; i < Hash.primes.length; i++) {
                var num = Hash.primes[i];
                if (num >= min) {
                    return num;
                }
            }
            throw TypeScript.Errors.notYetImplemented();
        };
        Hash.expandPrime = function (oldSize) {
            var num = oldSize << 1;
            if (num > 2146435069 && 2146435069 > oldSize) {
                return 2146435069;
            }
            return Hash.getPrime(num);
        };
        Hash.combine = function (value, currentHash) {
            return (((currentHash << 5) + currentHash) + value) & 0x7FFFFFFF;
        };
        Hash.FNV_BASE = 2166136261;
        Hash.FNV_PRIME = 16777619;
        Hash.primes = [
            3,
            7,
            11,
            17,
            23,
            29,
            37,
            47,
            59,
            71,
            89,
            107,
            131,
            163,
            197,
            239,
            293,
            353,
            431,
            521,
            631,
            761,
            919,
            1103,
            1327,
            1597,
            1931,
            2333,
            2801,
            3371,
            4049,
            4861,
            5839,
            7013,
            8419,
            10103,
            12143,
            14591,
            17519,
            21023,
            25229,
            30293,
            36353,
            43627,
            52361,
            62851,
            75431,
            90523,
            108631,
            130363,
            156437,
            187751,
            225307,
            270371,
            324449,
            389357,
            467237,
            560689,
            672827,
            807403,
            968897,
            1162687,
            1395263,
            1674319,
            2009191,
            2411033,
            2893249,
            3471899,
            4166287,
            4999559,
            5999471,
            7199369
        ];
        return Hash;
    })();
    TypeScript.Hash = Hash;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (Collections) {
        Collections.DefaultHashTableCapacity = 256;
        var HashTableEntry = (function () {
            function HashTableEntry(Key, Value, HashCode, Next) {
                this.Key = Key;
                this.Value = Value;
                this.HashCode = HashCode;
                this.Next = Next;
            }
            return HashTableEntry;
        })();
        var HashTable = (function () {
            function HashTable(capacity, hash, equals) {
                this.hash = hash;
                this.equals = equals;
                this.entries = [];
                this.count = 0;
                var size = TypeScript.Hash.getPrime(capacity);
                this.hash = hash;
                this.equals = equals;
                this.entries = TypeScript.ArrayUtilities.createArray(size, null);
            }
            HashTable.prototype.set = function (key, value) {
                this.addOrSet(key, value, false);
            };
            HashTable.prototype.add = function (key, value) {
                this.addOrSet(key, value, true);
            };
            HashTable.prototype.containsKey = function (key) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);
                return entry !== null;
            };
            HashTable.prototype.get = function (key) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);
                return entry === null ? null : entry.Value;
            };
            HashTable.prototype.computeHashCode = function (key) {
                var hashCode = this.hash === null ? key.hashCode() : this.hash(key);
                hashCode = hashCode & 0x7FFFFFFF;
                TypeScript.Debug.assert(hashCode > 0);
                return hashCode;
            };
            HashTable.prototype.addOrSet = function (key, value, throwOnExistingEntry) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);
                if (entry !== null) {
                    if (throwOnExistingEntry) {
                        throw TypeScript.Errors.argument('key', 'Key was already in table.');
                    }
                    entry.Key = key;
                    entry.Value = value;
                    return;
                }
                return this.addEntry(key, value, hashCode);
            };
            HashTable.prototype.findEntry = function (key, hashCode) {
                for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                    if (e.HashCode === hashCode) {
                        var equals = this.equals === null ? key === e.Key : this.equals(key, e.Key);
                        if (equals) {
                            return e;
                        }
                    }
                }
                return null;
            };
            HashTable.prototype.addEntry = function (key, value, hashCode) {
                var index = hashCode % this.entries.length;
                var e = new HashTableEntry(key, value, hashCode, this.entries[index]);
                this.entries[index] = e;
                if (this.count === this.entries.length) {
                    this.grow();
                }
                this.count++;
                return e.Key;
            };
            HashTable.prototype.grow = function () {
                var newSize = TypeScript.Hash.expandPrime(this.entries.length);
                var oldEntries = this.entries;
                var newEntries = TypeScript.ArrayUtilities.createArray(newSize, null);
                this.entries = newEntries;
                for (var i = 0; i < oldEntries.length; i++) {
                    var e = oldEntries[i];
                    while (e !== null) {
                        var newIndex = e.HashCode % newSize;
                        var tmp = e.Next;
                        e.Next = newEntries[newIndex];
                        newEntries[newIndex] = e;
                        e = tmp;
                    }
                }
            };
            return HashTable;
        })();
        Collections.HashTable = HashTable;
        function createHashTable(capacity, hash, equals) {
            if (typeof capacity === "undefined") { capacity = Collections.DefaultHashTableCapacity; }
            if (typeof hash === "undefined") { hash = null; }
            if (typeof equals === "undefined") { equals = null; }
            return new HashTable(capacity, hash, equals);
        }
        Collections.createHashTable = createHashTable;
        var currentHashCode = 1;
        function identityHashCode(value) {
            if (value.__hash === undefined) {
                value.__hash = currentHashCode;
                currentHashCode++;
            }
            return value.__hash;
        }
        Collections.identityHashCode = identityHashCode;
    })(TypeScript.Collections || (TypeScript.Collections = {}));
    var Collections = TypeScript.Collections;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Diagnostic = (function () {
        function Diagnostic(start, length, fileName, message) {
            this._fileName = fileName;
            this._start = start;
            this._length = length;
            this._message = message;
        }
        Diagnostic.prototype.fileName = function () {
            return this._fileName;
        };
        Diagnostic.prototype.start = function () {
            return this._start;
        };
        Diagnostic.prototype.length = function () {
            return this._length;
        };
        Diagnostic.prototype.message = function () {
            return this._message;
        };
        return Diagnostic;
    })();
    TypeScript.Diagnostic = Diagnostic;
})(TypeScript || (TypeScript = {}));
var Environment = (function () {
    function getWindowsScriptHostEnvironment() {
        try  {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
        } catch (e) {
            return null;
        }
        var streamObjectPool = [];
        function getStreamObject() {
            if (streamObjectPool.length > 0) {
                return streamObjectPool.pop();
            } else {
                return new ActiveXObject("ADODB.Stream");
            }
        }
        function releaseStreamObject(obj) {
            streamObjectPool.push(obj);
        }
        var args = [];
        for (var i = 0; i < WScript.Arguments.length; i++) {
            args[i] = WScript.Arguments.Item(i);
        }
        return {
            currentDirectory: function () {
                return (WScript).CreateObject("WScript.Shell").CurrentDirectory;
            },
            readFile: function (path, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                try  {
                    var streamObj = getStreamObject();
                    streamObj.Open();
                    streamObj.Type = 2;
                    streamObj.Charset = 'x-ansi';
                    streamObj.LoadFromFile(path);
                    var bomChar = streamObj.ReadText(2);
                    streamObj.Position = 0;
                    if ((bomChar.charCodeAt(0) === 0xFE && bomChar.charCodeAt(1) === 0xFF) || (bomChar.charCodeAt(0) === 0xFF && bomChar.charCodeAt(1) === 0xFE)) {
                        streamObj.Charset = 'unicode';
                    } else if (bomChar.charCodeAt(0) === 0xEF && bomChar.charCodeAt(1) === 0xBB) {
                        streamObj.Charset = 'utf-8';
                    } else {
                        streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
                    }
                    var str = streamObj.ReadText(-1);
                    streamObj.Close();
                    releaseStreamObject(streamObj);
                    return str;
                } catch (err) {
                    throw new Error("Error reading file \"" + path + "\": " + err.message);
                }
            },
            writeFile: function (path, contents, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                var file = this.createFile(path, useUTF8);
                file.Write(contents);
                file.Close();
            },
            fileExists: function (path) {
                return fso.FileExists(path);
            },
            deleteFile: function (path) {
                if (fso.FileExists(path)) {
                    fso.DeleteFile(path, true);
                }
            },
            directoryExists: function (path) {
                return fso.FolderExists(path);
            },
            listFiles: function (path, spec, options) {
                options = options || {};
                function filesInFolder(folder, root) {
                    var paths = [];
                    var fc;
                    if (options.recursive) {
                        fc = new Enumerator(folder.subfolders);
                        for (; !fc.atEnd(); fc.moveNext()) {
                            paths = paths.concat(filesInFolder(fc.item(), root + "/" + fc.item().Name));
                        }
                    }
                    fc = new Enumerator(folder.files);
                    for (; !fc.atEnd(); fc.moveNext()) {
                        if (!spec || fc.item().Name.match(spec)) {
                            paths.push(root + "/" + fc.item().Name);
                        }
                    }
                    return paths;
                }
                var folder = fso.GetFolder(path);
                var paths = [];
                return filesInFolder(folder, path);
            },
            createFile: function (path, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                try  {
                    var streamObj = getStreamObject();
                    streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
                    streamObj.Open();
                    return {
                        Write: function (str) {
                            streamObj.WriteText(str, 0);
                        },
                        WriteLine: function (str) {
                            streamObj.WriteText(str, 1);
                        },
                        Close: function () {
                            streamObj.SaveToFile(path, 2);
                            streamObj.Close();
                            releaseStreamObject(streamObj);
                        }
                    };
                } catch (ex) {
                    WScript.StdErr.WriteLine("Couldn't write to file '" + path + "'");
                    throw ex;
                }
            },
            arguments: args,
            standardOut: WScript.StdOut
        };
    }
    ;
    function getNodeEnvironment() {
        var _fs = require('fs');
        var _path = require('path');
        var _module = require('module');
        return {
            currentDirectory: function () {
                return (process).cwd();
            },
            readFile: function (file, useUTF8) {
                var buffer = _fs.readFileSync(file);
                switch (buffer[0]) {
                    case 0xFE:
                        if (buffer[1] === 0xFF) {
                            var i = 0;
                            while ((i + 1) < buffer.length) {
                                var temp = buffer[i];
                                buffer[i] = buffer[i + 1];
                                buffer[i + 1] = temp;
                                i += 2;
                            }
                            return buffer.toString("ucs2", 2);
                        }
                        break;
                    case 0xFF:
                        if (buffer[1] === 0xFE) {
                            return buffer.toString("ucs2", 2);
                        }
                        break;
                    case 0xEF:
                        if (buffer[1] === 0xBB) {
                            return buffer.toString("utf8", 3);
                        }
                }
                return useUTF8 ? buffer.toString("utf8", 0) : buffer.toString();
            },
            writeFile: function (path, contents, useUTF) {
                if (useUTF) {
                    _fs.writeFileSync(path, contents, "utf8");
                } else {
                    _fs.writeFileSync(path, contents);
                }
            },
            fileExists: function (path) {
                return _fs.existsSync(path);
            },
            deleteFile: function (path) {
                try  {
                    _fs.unlinkSync(path);
                } catch (e) {
                }
            },
            directoryExists: function (path) {
                return _fs.existsSync(path) && _fs.lstatSync(path).isDirectory();
            },
            listFiles: function dir(path, spec, options) {
                options = options || {};
                function filesInFolder(folder) {
                    var paths = [];
                    var files = _fs.readdirSync(folder);
                    for (var i = 0; i < files.length; i++) {
                        var stat = _fs.statSync(folder + "/" + files[i]);
                        if (options.recursive && stat.isDirectory()) {
                            paths = paths.concat(filesInFolder(folder + "/" + files[i]));
                        } else if (stat.isFile() && (!spec || files[i].match(spec))) {
                            paths.push(folder + "/" + files[i]);
                        }
                    }
                    return paths;
                }
                return filesInFolder(path);
            },
            createFile: function (path, useUTF8) {
                function mkdirRecursiveSync(path) {
                    var stats = _fs.statSync(path);
                    if (stats.isFile()) {
                        throw "\"" + path + "\" exists but isn't a directory.";
                    } else if (stats.isDirectory()) {
                        return;
                    } else {
                        mkdirRecursiveSync(_path.dirname(path));
                        _fs.mkdirSync(path, 0775);
                    }
                }
                mkdirRecursiveSync(_path.dirname(path));
                var fd = _fs.openSync(path, 'w');
                return {
                    Write: function (str) {
                        _fs.writeSync(fd, str);
                    },
                    WriteLine: function (str) {
                        _fs.writeSync(fd, str + '\r\n');
                    },
                    Close: function () {
                        _fs.closeSync(fd);
                        fd = null;
                    }
                };
            },
            arguments: process.argv.slice(2),
            standardOut: {
                Write: function (str) {
                    process.stdout.write(str);
                },
                WriteLine: function (str) {
                    process.stdout.write(str + '\n');
                },
                Close: function () {
                }
            }
        };
    }
    ;
    if (typeof WScript !== "undefined" && typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    } else if (typeof require === "function") {
        return getNodeEnvironment();
    } else {
        return null;
    }
})();
var TypeScript;
(function (TypeScript) {
    var IntegerUtilities = (function () {
        function IntegerUtilities() {
        }
        IntegerUtilities.integerDivide = function (numerator, denominator) {
            return (numerator / denominator) >> 0;
        };
        IntegerUtilities.integerMultiplyLow32Bits = function (n1, n2) {
            var n1Low16 = n1 & 0x0000ffff;
            var n1High16 = n1 >>> 16;
            var n2Low16 = n2 & 0x0000ffff;
            var n2High16 = n2 >>> 16;
            var resultLow32 = (((n1 & 0xffff0000) * n2) >>> 0) + (((n1 & 0x0000ffff) * n2) >>> 0) >>> 0;
            return resultLow32;
        };
        IntegerUtilities.integerMultiplyHigh32Bits = function (n1, n2) {
            var n1Low16 = n1 & 0x0000ffff;
            var n1High16 = n1 >>> 16;
            var n2Low16 = n2 & 0x0000ffff;
            var n2High16 = n2 >>> 16;
            var resultHigh32 = n1High16 * n2High16 + ((((n1Low16 * n2Low16) >>> 17) + n1Low16 * n2High16) >>> 15);
            return resultHigh32;
        };
        return IntegerUtilities;
    })();
    TypeScript.IntegerUtilities = IntegerUtilities;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var MathPrototype = (function () {
        function MathPrototype() {
        }
        MathPrototype.max = function (a, b) {
            return a >= b ? a : b;
        };
        MathPrototype.min = function (a, b) {
            return a <= b ? a : b;
        };
        return MathPrototype;
    })();
    TypeScript.MathPrototype = MathPrototype;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (Collections) {
        Collections.DefaultStringTableCapacity = 256;
        var StringTableEntry = (function () {
            function StringTableEntry(Text, HashCode, Next) {
                this.Text = Text;
                this.HashCode = HashCode;
                this.Next = Next;
            }
            return StringTableEntry;
        })();
        var StringTable = (function () {
            function StringTable(capacity) {
                this.entries = [];
                this.count = 0;
                var size = TypeScript.Hash.getPrime(capacity);
                this.entries = TypeScript.ArrayUtilities.createArray(size, null);
            }
            StringTable.prototype.addCharArray = function (key, start, len) {
                var hashCode = TypeScript.Hash.computeSimple31BitCharArrayHashCode(key, start, len) & 0x7FFFFFFF;
                var entry = this.findCharArrayEntry(key, start, len, hashCode);
                if (entry !== null) {
                    return entry.Text;
                }
                var slice = key.slice(start, start + len);
                return this.addEntry(TypeScript.StringUtilities.fromCharCodeArray(slice), hashCode);
            };
            StringTable.prototype.findCharArrayEntry = function (key, start, len, hashCode) {
                for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                    if (e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                        return e;
                    }
                }
                return null;
            };
            StringTable.prototype.addEntry = function (text, hashCode) {
                var index = hashCode % this.entries.length;
                var e = new StringTableEntry(text, hashCode, this.entries[index]);
                this.entries[index] = e;
                if (this.count === this.entries.length) {
                    this.grow();
                }
                this.count++;
                return e.Text;
            };
            StringTable.prototype.grow = function () {
                var newSize = TypeScript.Hash.expandPrime(this.entries.length);
                var oldEntries = this.entries;
                var newEntries = TypeScript.ArrayUtilities.createArray(newSize, null);
                this.entries = newEntries;
                for (var i = 0; i < oldEntries.length; i++) {
                    var e = oldEntries[i];
                    while (e !== null) {
                        var newIndex = e.HashCode % newSize;
                        var tmp = e.Next;
                        e.Next = newEntries[newIndex];
                        newEntries[newIndex] = e;
                        e = tmp;
                    }
                }
            };
            StringTable.textCharArrayEquals = function (text, array, start, length) {
                if (text.length !== length) {
                    return false;
                }
                var s = start;
                for (var i = 0; i < length; i++) {
                    if (text.charCodeAt(i) !== array[s]) {
                        return false;
                    }
                    s++;
                }
                return true;
            };
            return StringTable;
        })();
        Collections.StringTable = StringTable;
        Collections.DefaultStringTable = new StringTable(Collections.DefaultStringTableCapacity);
    })(TypeScript.Collections || (TypeScript.Collections = {}));
    var Collections = TypeScript.Collections;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var StringUtilities = (function () {
        function StringUtilities() {
        }
        StringUtilities.fromCharCodeArray = function (array) {
            return String.fromCharCode.apply(null, array);
        };
        StringUtilities.endsWith = function (string, value) {
            return string.substring(string.length - value.length, string.length) === value;
        };
        StringUtilities.startsWith = function (string, value) {
            return string.substr(0, value.length) === value;
        };
        StringUtilities.copyTo = function (source, sourceIndex, destination, destinationIndex, count) {
            for (var i = 0; i < count; i++) {
                destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
            }
        };
        StringUtilities.repeat = function (value, count) {
            return Array(count + 1).join(value);
        };
        StringUtilities.stringEquals = function (val1, val2) {
            return val1 === val2;
        };
        return StringUtilities;
    })();
    TypeScript.StringUtilities = StringUtilities;
})(TypeScript || (TypeScript = {}));
var global = Function("return this").call(null);
var TypeScript;
(function (TypeScript) {
    var Clock;
    (function (Clock) {
        Clock.now;
        Clock.resolution;
        if (typeof WScript !== "undefined" && typeof global['WScript'].InitializeProjection !== "undefined") {
            global['WScript'].InitializeProjection();
            Clock.now = function () {
                return TestUtilities.QueryPerformanceCounter();
            };
            Clock.resolution = TestUtilities.QueryPerformanceFrequency();
        } else {
            Clock.now = function () {
                return Date.now();
            };
            Clock.resolution = 1000;
        }
    })(Clock || (Clock = {}));
    var Timer = (function () {
        function Timer() {
            this.time = 0;
        }
        Timer.prototype.start = function () {
            this.time = 0;
            this.startTime = Clock.now();
        };
        Timer.prototype.end = function () {
            this.time = (Clock.now() - this.startTime);
        };
        return Timer;
    })();
    TypeScript.Timer = Timer;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (SyntaxKind) {
        SyntaxKind._map = [];
        SyntaxKind._map[0] = "None";
        SyntaxKind.None = 0;
        SyntaxKind._map[1] = "List";
        SyntaxKind.List = 1;
        SyntaxKind._map[2] = "SeparatedList";
        SyntaxKind.SeparatedList = 2;
        SyntaxKind._map[3] = "TriviaList";
        SyntaxKind.TriviaList = 3;
        SyntaxKind._map[4] = "WhitespaceTrivia";
        SyntaxKind.WhitespaceTrivia = 4;
        SyntaxKind._map[5] = "NewLineTrivia";
        SyntaxKind.NewLineTrivia = 5;
        SyntaxKind._map[6] = "MultiLineCommentTrivia";
        SyntaxKind.MultiLineCommentTrivia = 6;
        SyntaxKind._map[7] = "SingleLineCommentTrivia";
        SyntaxKind.SingleLineCommentTrivia = 7;
        SyntaxKind._map[8] = "SkippedTokenTrivia";
        SyntaxKind.SkippedTokenTrivia = 8;
        SyntaxKind._map[9] = "ErrorToken";
        SyntaxKind.ErrorToken = 9;
        SyntaxKind._map[10] = "EndOfFileToken";
        SyntaxKind.EndOfFileToken = 10;
        SyntaxKind._map[11] = "IdentifierName";
        SyntaxKind.IdentifierName = 11;
        SyntaxKind._map[12] = "RegularExpressionLiteral";
        SyntaxKind.RegularExpressionLiteral = 12;
        SyntaxKind._map[13] = "NumericLiteral";
        SyntaxKind.NumericLiteral = 13;
        SyntaxKind._map[14] = "StringLiteral";
        SyntaxKind.StringLiteral = 14;
        SyntaxKind._map[15] = "BreakKeyword";
        SyntaxKind.BreakKeyword = 15;
        SyntaxKind._map[16] = "CaseKeyword";
        SyntaxKind.CaseKeyword = 16;
        SyntaxKind._map[17] = "CatchKeyword";
        SyntaxKind.CatchKeyword = 17;
        SyntaxKind._map[18] = "ContinueKeyword";
        SyntaxKind.ContinueKeyword = 18;
        SyntaxKind._map[19] = "DebuggerKeyword";
        SyntaxKind.DebuggerKeyword = 19;
        SyntaxKind._map[20] = "DefaultKeyword";
        SyntaxKind.DefaultKeyword = 20;
        SyntaxKind._map[21] = "DeleteKeyword";
        SyntaxKind.DeleteKeyword = 21;
        SyntaxKind._map[22] = "DoKeyword";
        SyntaxKind.DoKeyword = 22;
        SyntaxKind._map[23] = "ElseKeyword";
        SyntaxKind.ElseKeyword = 23;
        SyntaxKind._map[24] = "FalseKeyword";
        SyntaxKind.FalseKeyword = 24;
        SyntaxKind._map[25] = "FinallyKeyword";
        SyntaxKind.FinallyKeyword = 25;
        SyntaxKind._map[26] = "ForKeyword";
        SyntaxKind.ForKeyword = 26;
        SyntaxKind._map[27] = "FunctionKeyword";
        SyntaxKind.FunctionKeyword = 27;
        SyntaxKind._map[28] = "IfKeyword";
        SyntaxKind.IfKeyword = 28;
        SyntaxKind._map[29] = "InKeyword";
        SyntaxKind.InKeyword = 29;
        SyntaxKind._map[30] = "InstanceOfKeyword";
        SyntaxKind.InstanceOfKeyword = 30;
        SyntaxKind._map[31] = "NewKeyword";
        SyntaxKind.NewKeyword = 31;
        SyntaxKind._map[32] = "NullKeyword";
        SyntaxKind.NullKeyword = 32;
        SyntaxKind._map[33] = "ReturnKeyword";
        SyntaxKind.ReturnKeyword = 33;
        SyntaxKind._map[34] = "SwitchKeyword";
        SyntaxKind.SwitchKeyword = 34;
        SyntaxKind._map[35] = "ThisKeyword";
        SyntaxKind.ThisKeyword = 35;
        SyntaxKind._map[36] = "ThrowKeyword";
        SyntaxKind.ThrowKeyword = 36;
        SyntaxKind._map[37] = "TrueKeyword";
        SyntaxKind.TrueKeyword = 37;
        SyntaxKind._map[38] = "TryKeyword";
        SyntaxKind.TryKeyword = 38;
        SyntaxKind._map[39] = "TypeOfKeyword";
        SyntaxKind.TypeOfKeyword = 39;
        SyntaxKind._map[40] = "VarKeyword";
        SyntaxKind.VarKeyword = 40;
        SyntaxKind._map[41] = "VoidKeyword";
        SyntaxKind.VoidKeyword = 41;
        SyntaxKind._map[42] = "WhileKeyword";
        SyntaxKind.WhileKeyword = 42;
        SyntaxKind._map[43] = "WithKeyword";
        SyntaxKind.WithKeyword = 43;
        SyntaxKind._map[44] = "ClassKeyword";
        SyntaxKind.ClassKeyword = 44;
        SyntaxKind._map[45] = "ConstKeyword";
        SyntaxKind.ConstKeyword = 45;
        SyntaxKind._map[46] = "EnumKeyword";
        SyntaxKind.EnumKeyword = 46;
        SyntaxKind._map[47] = "ExportKeyword";
        SyntaxKind.ExportKeyword = 47;
        SyntaxKind._map[48] = "ExtendsKeyword";
        SyntaxKind.ExtendsKeyword = 48;
        SyntaxKind._map[49] = "ImportKeyword";
        SyntaxKind.ImportKeyword = 49;
        SyntaxKind._map[50] = "SuperKeyword";
        SyntaxKind.SuperKeyword = 50;
        SyntaxKind._map[51] = "ImplementsKeyword";
        SyntaxKind.ImplementsKeyword = 51;
        SyntaxKind._map[52] = "InterfaceKeyword";
        SyntaxKind.InterfaceKeyword = 52;
        SyntaxKind._map[53] = "LetKeyword";
        SyntaxKind.LetKeyword = 53;
        SyntaxKind._map[54] = "PackageKeyword";
        SyntaxKind.PackageKeyword = 54;
        SyntaxKind._map[55] = "PrivateKeyword";
        SyntaxKind.PrivateKeyword = 55;
        SyntaxKind._map[56] = "ProtectedKeyword";
        SyntaxKind.ProtectedKeyword = 56;
        SyntaxKind._map[57] = "PublicKeyword";
        SyntaxKind.PublicKeyword = 57;
        SyntaxKind._map[58] = "StaticKeyword";
        SyntaxKind.StaticKeyword = 58;
        SyntaxKind._map[59] = "YieldKeyword";
        SyntaxKind.YieldKeyword = 59;
        SyntaxKind._map[60] = "AnyKeyword";
        SyntaxKind.AnyKeyword = 60;
        SyntaxKind._map[61] = "BooleanKeyword";
        SyntaxKind.BooleanKeyword = 61;
        SyntaxKind._map[62] = "BoolKeyword";
        SyntaxKind.BoolKeyword = 62;
        SyntaxKind._map[63] = "ConstructorKeyword";
        SyntaxKind.ConstructorKeyword = 63;
        SyntaxKind._map[64] = "DeclareKeyword";
        SyntaxKind.DeclareKeyword = 64;
        SyntaxKind._map[65] = "GetKeyword";
        SyntaxKind.GetKeyword = 65;
        SyntaxKind._map[66] = "ModuleKeyword";
        SyntaxKind.ModuleKeyword = 66;
        SyntaxKind._map[67] = "NumberKeyword";
        SyntaxKind.NumberKeyword = 67;
        SyntaxKind._map[68] = "SetKeyword";
        SyntaxKind.SetKeyword = 68;
        SyntaxKind._map[69] = "StringKeyword";
        SyntaxKind.StringKeyword = 69;
        SyntaxKind._map[70] = "OpenBraceToken";
        SyntaxKind.OpenBraceToken = 70;
        SyntaxKind._map[71] = "CloseBraceToken";
        SyntaxKind.CloseBraceToken = 71;
        SyntaxKind._map[72] = "OpenParenToken";
        SyntaxKind.OpenParenToken = 72;
        SyntaxKind._map[73] = "CloseParenToken";
        SyntaxKind.CloseParenToken = 73;
        SyntaxKind._map[74] = "OpenBracketToken";
        SyntaxKind.OpenBracketToken = 74;
        SyntaxKind._map[75] = "CloseBracketToken";
        SyntaxKind.CloseBracketToken = 75;
        SyntaxKind._map[76] = "DotToken";
        SyntaxKind.DotToken = 76;
        SyntaxKind._map[77] = "DotDotDotToken";
        SyntaxKind.DotDotDotToken = 77;
        SyntaxKind._map[78] = "SemicolonToken";
        SyntaxKind.SemicolonToken = 78;
        SyntaxKind._map[79] = "CommaToken";
        SyntaxKind.CommaToken = 79;
        SyntaxKind._map[80] = "LessThanToken";
        SyntaxKind.LessThanToken = 80;
        SyntaxKind._map[81] = "GreaterThanToken";
        SyntaxKind.GreaterThanToken = 81;
        SyntaxKind._map[82] = "LessThanEqualsToken";
        SyntaxKind.LessThanEqualsToken = 82;
        SyntaxKind._map[83] = "GreaterThanEqualsToken";
        SyntaxKind.GreaterThanEqualsToken = 83;
        SyntaxKind._map[84] = "EqualsEqualsToken";
        SyntaxKind.EqualsEqualsToken = 84;
        SyntaxKind._map[85] = "EqualsGreaterThanToken";
        SyntaxKind.EqualsGreaterThanToken = 85;
        SyntaxKind._map[86] = "ExclamationEqualsToken";
        SyntaxKind.ExclamationEqualsToken = 86;
        SyntaxKind._map[87] = "EqualsEqualsEqualsToken";
        SyntaxKind.EqualsEqualsEqualsToken = 87;
        SyntaxKind._map[88] = "ExclamationEqualsEqualsToken";
        SyntaxKind.ExclamationEqualsEqualsToken = 88;
        SyntaxKind._map[89] = "PlusToken";
        SyntaxKind.PlusToken = 89;
        SyntaxKind._map[90] = "MinusToken";
        SyntaxKind.MinusToken = 90;
        SyntaxKind._map[91] = "AsteriskToken";
        SyntaxKind.AsteriskToken = 91;
        SyntaxKind._map[92] = "PercentToken";
        SyntaxKind.PercentToken = 92;
        SyntaxKind._map[93] = "PlusPlusToken";
        SyntaxKind.PlusPlusToken = 93;
        SyntaxKind._map[94] = "MinusMinusToken";
        SyntaxKind.MinusMinusToken = 94;
        SyntaxKind._map[95] = "LessThanLessThanToken";
        SyntaxKind.LessThanLessThanToken = 95;
        SyntaxKind._map[96] = "GreaterThanGreaterThanToken";
        SyntaxKind.GreaterThanGreaterThanToken = 96;
        SyntaxKind._map[97] = "GreaterThanGreaterThanGreaterThanToken";
        SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 97;
        SyntaxKind._map[98] = "AmpersandToken";
        SyntaxKind.AmpersandToken = 98;
        SyntaxKind._map[99] = "BarToken";
        SyntaxKind.BarToken = 99;
        SyntaxKind._map[100] = "CaretToken";
        SyntaxKind.CaretToken = 100;
        SyntaxKind._map[101] = "ExclamationToken";
        SyntaxKind.ExclamationToken = 101;
        SyntaxKind._map[102] = "TildeToken";
        SyntaxKind.TildeToken = 102;
        SyntaxKind._map[103] = "AmpersandAmpersandToken";
        SyntaxKind.AmpersandAmpersandToken = 103;
        SyntaxKind._map[104] = "BarBarToken";
        SyntaxKind.BarBarToken = 104;
        SyntaxKind._map[105] = "QuestionToken";
        SyntaxKind.QuestionToken = 105;
        SyntaxKind._map[106] = "ColonToken";
        SyntaxKind.ColonToken = 106;
        SyntaxKind._map[107] = "EqualsToken";
        SyntaxKind.EqualsToken = 107;
        SyntaxKind._map[108] = "PlusEqualsToken";
        SyntaxKind.PlusEqualsToken = 108;
        SyntaxKind._map[109] = "MinusEqualsToken";
        SyntaxKind.MinusEqualsToken = 109;
        SyntaxKind._map[110] = "AsteriskEqualsToken";
        SyntaxKind.AsteriskEqualsToken = 110;
        SyntaxKind._map[111] = "PercentEqualsToken";
        SyntaxKind.PercentEqualsToken = 111;
        SyntaxKind._map[112] = "LessThanLessThanEqualsToken";
        SyntaxKind.LessThanLessThanEqualsToken = 112;
        SyntaxKind._map[113] = "GreaterThanGreaterThanEqualsToken";
        SyntaxKind.GreaterThanGreaterThanEqualsToken = 113;
        SyntaxKind._map[114] = "GreaterThanGreaterThanGreaterThanEqualsToken";
        SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 114;
        SyntaxKind._map[115] = "AmpersandEqualsToken";
        SyntaxKind.AmpersandEqualsToken = 115;
        SyntaxKind._map[116] = "BarEqualsToken";
        SyntaxKind.BarEqualsToken = 116;
        SyntaxKind._map[117] = "CaretEqualsToken";
        SyntaxKind.CaretEqualsToken = 117;
        SyntaxKind._map[118] = "SlashToken";
        SyntaxKind.SlashToken = 118;
        SyntaxKind._map[119] = "SlashEqualsToken";
        SyntaxKind.SlashEqualsToken = 119;
        SyntaxKind._map[120] = "SourceUnit";
        SyntaxKind.SourceUnit = 120;
        SyntaxKind._map[121] = "QualifiedName";
        SyntaxKind.QualifiedName = 121;
        SyntaxKind._map[122] = "ObjectType";
        SyntaxKind.ObjectType = 122;
        SyntaxKind._map[123] = "FunctionType";
        SyntaxKind.FunctionType = 123;
        SyntaxKind._map[124] = "ArrayType";
        SyntaxKind.ArrayType = 124;
        SyntaxKind._map[125] = "ConstructorType";
        SyntaxKind.ConstructorType = 125;
        SyntaxKind._map[126] = "GenericType";
        SyntaxKind.GenericType = 126;
        SyntaxKind._map[127] = "InterfaceDeclaration";
        SyntaxKind.InterfaceDeclaration = 127;
        SyntaxKind._map[128] = "FunctionDeclaration";
        SyntaxKind.FunctionDeclaration = 128;
        SyntaxKind._map[129] = "ModuleDeclaration";
        SyntaxKind.ModuleDeclaration = 129;
        SyntaxKind._map[130] = "ClassDeclaration";
        SyntaxKind.ClassDeclaration = 130;
        SyntaxKind._map[131] = "EnumDeclaration";
        SyntaxKind.EnumDeclaration = 131;
        SyntaxKind._map[132] = "ImportDeclaration";
        SyntaxKind.ImportDeclaration = 132;
        SyntaxKind._map[133] = "ExportAssignment";
        SyntaxKind.ExportAssignment = 133;
        SyntaxKind._map[134] = "MemberFunctionDeclaration";
        SyntaxKind.MemberFunctionDeclaration = 134;
        SyntaxKind._map[135] = "MemberVariableDeclaration";
        SyntaxKind.MemberVariableDeclaration = 135;
        SyntaxKind._map[136] = "ConstructorDeclaration";
        SyntaxKind.ConstructorDeclaration = 136;
        SyntaxKind._map[137] = "GetMemberAccessorDeclaration";
        SyntaxKind.GetMemberAccessorDeclaration = 137;
        SyntaxKind._map[138] = "SetMemberAccessorDeclaration";
        SyntaxKind.SetMemberAccessorDeclaration = 138;
        SyntaxKind._map[139] = "PropertySignature";
        SyntaxKind.PropertySignature = 139;
        SyntaxKind._map[140] = "CallSignature";
        SyntaxKind.CallSignature = 140;
        SyntaxKind._map[141] = "ConstructSignature";
        SyntaxKind.ConstructSignature = 141;
        SyntaxKind._map[142] = "IndexSignature";
        SyntaxKind.IndexSignature = 142;
        SyntaxKind._map[143] = "MethodSignature";
        SyntaxKind.MethodSignature = 143;
        SyntaxKind._map[144] = "Block";
        SyntaxKind.Block = 144;
        SyntaxKind._map[145] = "IfStatement";
        SyntaxKind.IfStatement = 145;
        SyntaxKind._map[146] = "VariableStatement";
        SyntaxKind.VariableStatement = 146;
        SyntaxKind._map[147] = "ExpressionStatement";
        SyntaxKind.ExpressionStatement = 147;
        SyntaxKind._map[148] = "ReturnStatement";
        SyntaxKind.ReturnStatement = 148;
        SyntaxKind._map[149] = "SwitchStatement";
        SyntaxKind.SwitchStatement = 149;
        SyntaxKind._map[150] = "BreakStatement";
        SyntaxKind.BreakStatement = 150;
        SyntaxKind._map[151] = "ContinueStatement";
        SyntaxKind.ContinueStatement = 151;
        SyntaxKind._map[152] = "ForStatement";
        SyntaxKind.ForStatement = 152;
        SyntaxKind._map[153] = "ForInStatement";
        SyntaxKind.ForInStatement = 153;
        SyntaxKind._map[154] = "EmptyStatement";
        SyntaxKind.EmptyStatement = 154;
        SyntaxKind._map[155] = "ThrowStatement";
        SyntaxKind.ThrowStatement = 155;
        SyntaxKind._map[156] = "WhileStatement";
        SyntaxKind.WhileStatement = 156;
        SyntaxKind._map[157] = "TryStatement";
        SyntaxKind.TryStatement = 157;
        SyntaxKind._map[158] = "LabeledStatement";
        SyntaxKind.LabeledStatement = 158;
        SyntaxKind._map[159] = "DoStatement";
        SyntaxKind.DoStatement = 159;
        SyntaxKind._map[160] = "DebuggerStatement";
        SyntaxKind.DebuggerStatement = 160;
        SyntaxKind._map[161] = "WithStatement";
        SyntaxKind.WithStatement = 161;
        SyntaxKind._map[162] = "PlusExpression";
        SyntaxKind.PlusExpression = 162;
        SyntaxKind._map[163] = "NegateExpression";
        SyntaxKind.NegateExpression = 163;
        SyntaxKind._map[164] = "BitwiseNotExpression";
        SyntaxKind.BitwiseNotExpression = 164;
        SyntaxKind._map[165] = "LogicalNotExpression";
        SyntaxKind.LogicalNotExpression = 165;
        SyntaxKind._map[166] = "PreIncrementExpression";
        SyntaxKind.PreIncrementExpression = 166;
        SyntaxKind._map[167] = "PreDecrementExpression";
        SyntaxKind.PreDecrementExpression = 167;
        SyntaxKind._map[168] = "DeleteExpression";
        SyntaxKind.DeleteExpression = 168;
        SyntaxKind._map[169] = "TypeOfExpression";
        SyntaxKind.TypeOfExpression = 169;
        SyntaxKind._map[170] = "VoidExpression";
        SyntaxKind.VoidExpression = 170;
        SyntaxKind._map[171] = "CommaExpression";
        SyntaxKind.CommaExpression = 171;
        SyntaxKind._map[172] = "AssignmentExpression";
        SyntaxKind.AssignmentExpression = 172;
        SyntaxKind._map[173] = "AddAssignmentExpression";
        SyntaxKind.AddAssignmentExpression = 173;
        SyntaxKind._map[174] = "SubtractAssignmentExpression";
        SyntaxKind.SubtractAssignmentExpression = 174;
        SyntaxKind._map[175] = "MultiplyAssignmentExpression";
        SyntaxKind.MultiplyAssignmentExpression = 175;
        SyntaxKind._map[176] = "DivideAssignmentExpression";
        SyntaxKind.DivideAssignmentExpression = 176;
        SyntaxKind._map[177] = "ModuloAssignmentExpression";
        SyntaxKind.ModuloAssignmentExpression = 177;
        SyntaxKind._map[178] = "AndAssignmentExpression";
        SyntaxKind.AndAssignmentExpression = 178;
        SyntaxKind._map[179] = "ExclusiveOrAssignmentExpression";
        SyntaxKind.ExclusiveOrAssignmentExpression = 179;
        SyntaxKind._map[180] = "OrAssignmentExpression";
        SyntaxKind.OrAssignmentExpression = 180;
        SyntaxKind._map[181] = "LeftShiftAssignmentExpression";
        SyntaxKind.LeftShiftAssignmentExpression = 181;
        SyntaxKind._map[182] = "SignedRightShiftAssignmentExpression";
        SyntaxKind.SignedRightShiftAssignmentExpression = 182;
        SyntaxKind._map[183] = "UnsignedRightShiftAssignmentExpression";
        SyntaxKind.UnsignedRightShiftAssignmentExpression = 183;
        SyntaxKind._map[184] = "ConditionalExpression";
        SyntaxKind.ConditionalExpression = 184;
        SyntaxKind._map[185] = "LogicalOrExpression";
        SyntaxKind.LogicalOrExpression = 185;
        SyntaxKind._map[186] = "LogicalAndExpression";
        SyntaxKind.LogicalAndExpression = 186;
        SyntaxKind._map[187] = "BitwiseOrExpression";
        SyntaxKind.BitwiseOrExpression = 187;
        SyntaxKind._map[188] = "BitwiseExclusiveOrExpression";
        SyntaxKind.BitwiseExclusiveOrExpression = 188;
        SyntaxKind._map[189] = "BitwiseAndExpression";
        SyntaxKind.BitwiseAndExpression = 189;
        SyntaxKind._map[190] = "EqualsWithTypeConversionExpression";
        SyntaxKind.EqualsWithTypeConversionExpression = 190;
        SyntaxKind._map[191] = "NotEqualsWithTypeConversionExpression";
        SyntaxKind.NotEqualsWithTypeConversionExpression = 191;
        SyntaxKind._map[192] = "EqualsExpression";
        SyntaxKind.EqualsExpression = 192;
        SyntaxKind._map[193] = "NotEqualsExpression";
        SyntaxKind.NotEqualsExpression = 193;
        SyntaxKind._map[194] = "LessThanExpression";
        SyntaxKind.LessThanExpression = 194;
        SyntaxKind._map[195] = "GreaterThanExpression";
        SyntaxKind.GreaterThanExpression = 195;
        SyntaxKind._map[196] = "LessThanOrEqualExpression";
        SyntaxKind.LessThanOrEqualExpression = 196;
        SyntaxKind._map[197] = "GreaterThanOrEqualExpression";
        SyntaxKind.GreaterThanOrEqualExpression = 197;
        SyntaxKind._map[198] = "InstanceOfExpression";
        SyntaxKind.InstanceOfExpression = 198;
        SyntaxKind._map[199] = "InExpression";
        SyntaxKind.InExpression = 199;
        SyntaxKind._map[200] = "LeftShiftExpression";
        SyntaxKind.LeftShiftExpression = 200;
        SyntaxKind._map[201] = "SignedRightShiftExpression";
        SyntaxKind.SignedRightShiftExpression = 201;
        SyntaxKind._map[202] = "UnsignedRightShiftExpression";
        SyntaxKind.UnsignedRightShiftExpression = 202;
        SyntaxKind._map[203] = "MultiplyExpression";
        SyntaxKind.MultiplyExpression = 203;
        SyntaxKind._map[204] = "DivideExpression";
        SyntaxKind.DivideExpression = 204;
        SyntaxKind._map[205] = "ModuloExpression";
        SyntaxKind.ModuloExpression = 205;
        SyntaxKind._map[206] = "AddExpression";
        SyntaxKind.AddExpression = 206;
        SyntaxKind._map[207] = "SubtractExpression";
        SyntaxKind.SubtractExpression = 207;
        SyntaxKind._map[208] = "PostIncrementExpression";
        SyntaxKind.PostIncrementExpression = 208;
        SyntaxKind._map[209] = "PostDecrementExpression";
        SyntaxKind.PostDecrementExpression = 209;
        SyntaxKind._map[210] = "MemberAccessExpression";
        SyntaxKind.MemberAccessExpression = 210;
        SyntaxKind._map[211] = "InvocationExpression";
        SyntaxKind.InvocationExpression = 211;
        SyntaxKind._map[212] = "ArrayLiteralExpression";
        SyntaxKind.ArrayLiteralExpression = 212;
        SyntaxKind._map[213] = "ObjectLiteralExpression";
        SyntaxKind.ObjectLiteralExpression = 213;
        SyntaxKind._map[214] = "ObjectCreationExpression";
        SyntaxKind.ObjectCreationExpression = 214;
        SyntaxKind._map[215] = "ParenthesizedExpression";
        SyntaxKind.ParenthesizedExpression = 215;
        SyntaxKind._map[216] = "ParenthesizedArrowFunctionExpression";
        SyntaxKind.ParenthesizedArrowFunctionExpression = 216;
        SyntaxKind._map[217] = "SimpleArrowFunctionExpression";
        SyntaxKind.SimpleArrowFunctionExpression = 217;
        SyntaxKind._map[218] = "CastExpression";
        SyntaxKind.CastExpression = 218;
        SyntaxKind._map[219] = "ElementAccessExpression";
        SyntaxKind.ElementAccessExpression = 219;
        SyntaxKind._map[220] = "FunctionExpression";
        SyntaxKind.FunctionExpression = 220;
        SyntaxKind._map[221] = "OmittedExpression";
        SyntaxKind.OmittedExpression = 221;
        SyntaxKind._map[222] = "VariableDeclaration";
        SyntaxKind.VariableDeclaration = 222;
        SyntaxKind._map[223] = "VariableDeclarator";
        SyntaxKind.VariableDeclarator = 223;
        SyntaxKind._map[224] = "ArgumentList";
        SyntaxKind.ArgumentList = 224;
        SyntaxKind._map[225] = "ParameterList";
        SyntaxKind.ParameterList = 225;
        SyntaxKind._map[226] = "TypeArgumentList";
        SyntaxKind.TypeArgumentList = 226;
        SyntaxKind._map[227] = "TypeParameterList";
        SyntaxKind.TypeParameterList = 227;
        SyntaxKind._map[228] = "HeritageClause";
        SyntaxKind.HeritageClause = 228;
        SyntaxKind._map[229] = "EqualsValueClause";
        SyntaxKind.EqualsValueClause = 229;
        SyntaxKind._map[230] = "CaseSwitchClause";
        SyntaxKind.CaseSwitchClause = 230;
        SyntaxKind._map[231] = "DefaultSwitchClause";
        SyntaxKind.DefaultSwitchClause = 231;
        SyntaxKind._map[232] = "ElseClause";
        SyntaxKind.ElseClause = 232;
        SyntaxKind._map[233] = "CatchClause";
        SyntaxKind.CatchClause = 233;
        SyntaxKind._map[234] = "FinallyClause";
        SyntaxKind.FinallyClause = 234;
        SyntaxKind._map[235] = "TypeParameter";
        SyntaxKind.TypeParameter = 235;
        SyntaxKind._map[236] = "Constraint";
        SyntaxKind.Constraint = 236;
        SyntaxKind._map[237] = "SimplePropertyAssignment";
        SyntaxKind.SimplePropertyAssignment = 237;
        SyntaxKind._map[238] = "GetAccessorPropertyAssignment";
        SyntaxKind.GetAccessorPropertyAssignment = 238;
        SyntaxKind._map[239] = "SetAccessorPropertyAssignment";
        SyntaxKind.SetAccessorPropertyAssignment = 239;
        SyntaxKind._map[240] = "FunctionPropertyAssignment";
        SyntaxKind.FunctionPropertyAssignment = 240;
        SyntaxKind._map[241] = "Parameter";
        SyntaxKind.Parameter = 241;
        SyntaxKind._map[242] = "EnumElement";
        SyntaxKind.EnumElement = 242;
        SyntaxKind._map[243] = "TypeAnnotation";
        SyntaxKind.TypeAnnotation = 243;
        SyntaxKind._map[244] = "ExternalModuleReference";
        SyntaxKind.ExternalModuleReference = 244;
        SyntaxKind._map[245] = "ModuleNameModuleReference";
        SyntaxKind.ModuleNameModuleReference = 245;
        SyntaxKind.FirstStandardKeyword = SyntaxKind.BreakKeyword;
        SyntaxKind.LastStandardKeyword = SyntaxKind.WithKeyword;
        SyntaxKind.FirstFutureReservedKeyword = SyntaxKind.ClassKeyword;
        SyntaxKind.LastFutureReservedKeyword = SyntaxKind.SuperKeyword;
        SyntaxKind.FirstFutureReservedStrictKeyword = SyntaxKind.ImplementsKeyword;
        SyntaxKind.LastFutureReservedStrictKeyword = SyntaxKind.YieldKeyword;
        SyntaxKind.FirstTypeScriptKeyword = SyntaxKind.AnyKeyword;
        SyntaxKind.LastTypeScriptKeyword = SyntaxKind.StringKeyword;
        SyntaxKind.FirstKeyword = SyntaxKind.FirstStandardKeyword;
        SyntaxKind.LastKeyword = SyntaxKind.LastTypeScriptKeyword;
        SyntaxKind.FirstToken = SyntaxKind.ErrorToken;
        SyntaxKind.LastToken = SyntaxKind.SlashEqualsToken;
        SyntaxKind.FirstPunctuation = SyntaxKind.OpenBraceToken;
        SyntaxKind.LastPunctuation = SyntaxKind.SlashEqualsToken;
        SyntaxKind.FirstFixedWidth = SyntaxKind.FirstKeyword;
        SyntaxKind.LastFixedWidth = SyntaxKind.LastPunctuation;
    })(TypeScript.SyntaxKind || (TypeScript.SyntaxKind = {}));
    var SyntaxKind = TypeScript.SyntaxKind;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (SyntaxFacts) {
        var textToKeywordKind = {
            "any": 60 /* AnyKeyword */,
            "bool": 62 /* BoolKeyword */,
            "boolean": 61 /* BooleanKeyword */,
            "break": 15 /* BreakKeyword */,
            "case": 16 /* CaseKeyword */,
            "catch": 17 /* CatchKeyword */,
            "class": 44 /* ClassKeyword */,
            "continue": 18 /* ContinueKeyword */,
            "const": 45 /* ConstKeyword */,
            "constructor": 63 /* ConstructorKeyword */,
            "debugger": 19 /* DebuggerKeyword */,
            "declare": 64 /* DeclareKeyword */,
            "default": 20 /* DefaultKeyword */,
            "delete": 21 /* DeleteKeyword */,
            "do": 22 /* DoKeyword */,
            "else": 23 /* ElseKeyword */,
            "enum": 46 /* EnumKeyword */,
            "export": 47 /* ExportKeyword */,
            "extends": 48 /* ExtendsKeyword */,
            "false": 24 /* FalseKeyword */,
            "finally": 25 /* FinallyKeyword */,
            "for": 26 /* ForKeyword */,
            "function": 27 /* FunctionKeyword */,
            "get": 65 /* GetKeyword */,
            "if": 28 /* IfKeyword */,
            "implements": 51 /* ImplementsKeyword */,
            "import": 49 /* ImportKeyword */,
            "in": 29 /* InKeyword */,
            "instanceof": 30 /* InstanceOfKeyword */,
            "interface": 52 /* InterfaceKeyword */,
            "let": 53 /* LetKeyword */,
            "module": 66 /* ModuleKeyword */,
            "new": 31 /* NewKeyword */,
            "null": 32 /* NullKeyword */,
            "number": 67 /* NumberKeyword */,
            "package": 54 /* PackageKeyword */,
            "private": 55 /* PrivateKeyword */,
            "protected": 56 /* ProtectedKeyword */,
            "public": 57 /* PublicKeyword */,
            "return": 33 /* ReturnKeyword */,
            "set": 68 /* SetKeyword */,
            "static": 58 /* StaticKeyword */,
            "string": 69 /* StringKeyword */,
            "super": 50 /* SuperKeyword */,
            "switch": 34 /* SwitchKeyword */,
            "this": 35 /* ThisKeyword */,
            "throw": 36 /* ThrowKeyword */,
            "true": 37 /* TrueKeyword */,
            "try": 38 /* TryKeyword */,
            "typeof": 39 /* TypeOfKeyword */,
            "var": 40 /* VarKeyword */,
            "void": 41 /* VoidKeyword */,
            "while": 42 /* WhileKeyword */,
            "with": 43 /* WithKeyword */,
            "yield": 59 /* YieldKeyword */,
            "{": 70 /* OpenBraceToken */,
            "}": 71 /* CloseBraceToken */,
            "(": 72 /* OpenParenToken */,
            ")": 73 /* CloseParenToken */,
            "[": 74 /* OpenBracketToken */,
            "]": 75 /* CloseBracketToken */,
            ".": 76 /* DotToken */,
            "...": 77 /* DotDotDotToken */,
            ";": 78 /* SemicolonToken */,
            ",": 79 /* CommaToken */,
            "<": 80 /* LessThanToken */,
            ">": 81 /* GreaterThanToken */,
            "<=": 82 /* LessThanEqualsToken */,
            ">=": 83 /* GreaterThanEqualsToken */,
            "==": 84 /* EqualsEqualsToken */,
            "=>": 85 /* EqualsGreaterThanToken */,
            "!=": 86 /* ExclamationEqualsToken */,
            "===": 87 /* EqualsEqualsEqualsToken */,
            "!==": 88 /* ExclamationEqualsEqualsToken */,
            "+": 89 /* PlusToken */,
            "-": 90 /* MinusToken */,
            "*": 91 /* AsteriskToken */,
            "%": 92 /* PercentToken */,
            "++": 93 /* PlusPlusToken */,
            "--": 94 /* MinusMinusToken */,
            "<<": 95 /* LessThanLessThanToken */,
            ">>": 96 /* GreaterThanGreaterThanToken */,
            ">>>": 97 /* GreaterThanGreaterThanGreaterThanToken */,
            "&": 98 /* AmpersandToken */,
            "|": 99 /* BarToken */,
            "^": 100 /* CaretToken */,
            "!": 101 /* ExclamationToken */,
            "~": 102 /* TildeToken */,
            "&&": 103 /* AmpersandAmpersandToken */,
            "||": 104 /* BarBarToken */,
            "?": 105 /* QuestionToken */,
            ":": 106 /* ColonToken */,
            "=": 107 /* EqualsToken */,
            "+=": 108 /* PlusEqualsToken */,
            "-=": 109 /* MinusEqualsToken */,
            "*=": 110 /* AsteriskEqualsToken */,
            "%=": 111 /* PercentEqualsToken */,
            "<<=": 112 /* LessThanLessThanEqualsToken */,
            ">>=": 113 /* GreaterThanGreaterThanEqualsToken */,
            ">>>=": 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */,
            "&=": 115 /* AmpersandEqualsToken */,
            "|=": 116 /* BarEqualsToken */,
            "^=": 117 /* CaretEqualsToken */,
            "/": 118 /* SlashToken */,
            "/=": 119 /* SlashEqualsToken */
        };
        var kindToText = [];
        for (var name in textToKeywordKind) {
            if (textToKeywordKind.hasOwnProperty(name)) {
                kindToText[textToKeywordKind[name]] = name;
            }
        }
        kindToText[63 /* ConstructorKeyword */] = "constructor";
        function getTokenKind(text) {
            if (textToKeywordKind.hasOwnProperty(text)) {
                return textToKeywordKind[text];
            }
            return 0 /* None */;
        }
        SyntaxFacts.getTokenKind = getTokenKind;
        function getText(kind) {
            var result = kindToText[kind];
            return result !== undefined ? result : null;
        }
        SyntaxFacts.getText = getText;
        function isTokenKind(kind) {
            return kind >= 9 /* FirstToken */ && kind <= 119 /* LastToken */;
        }
        SyntaxFacts.isTokenKind = isTokenKind;
        function isAnyKeyword(kind) {
            return kind >= TypeScript.SyntaxKind.FirstKeyword && kind <= TypeScript.SyntaxKind.LastKeyword;
        }
        SyntaxFacts.isAnyKeyword = isAnyKeyword;
        function isStandardKeyword(kind) {
            return kind >= 15 /* FirstStandardKeyword */ && kind <= 43 /* LastStandardKeyword */;
        }
        SyntaxFacts.isStandardKeyword = isStandardKeyword;
        function isFutureReservedKeyword(kind) {
            return kind >= 44 /* FirstFutureReservedKeyword */ && kind <= 50 /* LastFutureReservedKeyword */;
        }
        SyntaxFacts.isFutureReservedKeyword = isFutureReservedKeyword;
        function isFutureReservedStrictKeyword(kind) {
            return kind >= 51 /* FirstFutureReservedStrictKeyword */ && kind <= 59 /* LastFutureReservedStrictKeyword */;
        }
        SyntaxFacts.isFutureReservedStrictKeyword = isFutureReservedStrictKeyword;
        function isAnyPunctuation(kind) {
            return kind >= 70 /* FirstPunctuation */ && kind <= 119 /* LastPunctuation */;
        }
        SyntaxFacts.isAnyPunctuation = isAnyPunctuation;
        function isPrefixUnaryExpressionOperatorToken(tokenKind) {
            return getPrefixUnaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */;
        }
        SyntaxFacts.isPrefixUnaryExpressionOperatorToken = isPrefixUnaryExpressionOperatorToken;
        function isBinaryExpressionOperatorToken(tokenKind) {
            return getBinaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */;
        }
        SyntaxFacts.isBinaryExpressionOperatorToken = isBinaryExpressionOperatorToken;
        function getPrefixUnaryExpressionFromOperatorToken(tokenKind) {
            switch (tokenKind) {
                case 89 /* PlusToken */:
                    return 162 /* PlusExpression */;
                case 90 /* MinusToken */:
                    return 163 /* NegateExpression */;
                case 102 /* TildeToken */:
                    return 164 /* BitwiseNotExpression */;
                case 101 /* ExclamationToken */:
                    return 165 /* LogicalNotExpression */;
                case 93 /* PlusPlusToken */:
                    return 166 /* PreIncrementExpression */;
                case 94 /* MinusMinusToken */:
                    return 167 /* PreDecrementExpression */;
                default:
                    return 0 /* None */;
            }
        }
        SyntaxFacts.getPrefixUnaryExpressionFromOperatorToken = getPrefixUnaryExpressionFromOperatorToken;
        function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
            switch (tokenKind) {
                case 93 /* PlusPlusToken */:
                    return 208 /* PostIncrementExpression */;
                case 94 /* MinusMinusToken */:
                    return 209 /* PostDecrementExpression */;
                default:
                    return 0 /* None */;
            }
        }
        SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = getPostfixUnaryExpressionFromOperatorToken;
        function getBinaryExpressionFromOperatorToken(tokenKind) {
            switch (tokenKind) {
                case 91 /* AsteriskToken */:
                    return 203 /* MultiplyExpression */;
                case 118 /* SlashToken */:
                    return 204 /* DivideExpression */;
                case 92 /* PercentToken */:
                    return 205 /* ModuloExpression */;
                case 89 /* PlusToken */:
                    return 206 /* AddExpression */;
                case 90 /* MinusToken */:
                    return 207 /* SubtractExpression */;
                case 95 /* LessThanLessThanToken */:
                    return 200 /* LeftShiftExpression */;
                case 96 /* GreaterThanGreaterThanToken */:
                    return 201 /* SignedRightShiftExpression */;
                case 97 /* GreaterThanGreaterThanGreaterThanToken */:
                    return 202 /* UnsignedRightShiftExpression */;
                case 80 /* LessThanToken */:
                    return 194 /* LessThanExpression */;
                case 81 /* GreaterThanToken */:
                    return 195 /* GreaterThanExpression */;
                case 82 /* LessThanEqualsToken */:
                    return 196 /* LessThanOrEqualExpression */;
                case 83 /* GreaterThanEqualsToken */:
                    return 197 /* GreaterThanOrEqualExpression */;
                case 30 /* InstanceOfKeyword */:
                    return 198 /* InstanceOfExpression */;
                case 29 /* InKeyword */:
                    return 199 /* InExpression */;
                case 84 /* EqualsEqualsToken */:
                    return 190 /* EqualsWithTypeConversionExpression */;
                case 86 /* ExclamationEqualsToken */:
                    return 191 /* NotEqualsWithTypeConversionExpression */;
                case 87 /* EqualsEqualsEqualsToken */:
                    return 192 /* EqualsExpression */;
                case 88 /* ExclamationEqualsEqualsToken */:
                    return 193 /* NotEqualsExpression */;
                case 98 /* AmpersandToken */:
                    return 189 /* BitwiseAndExpression */;
                case 100 /* CaretToken */:
                    return 188 /* BitwiseExclusiveOrExpression */;
                case 99 /* BarToken */:
                    return 187 /* BitwiseOrExpression */;
                case 103 /* AmpersandAmpersandToken */:
                    return 186 /* LogicalAndExpression */;
                case 104 /* BarBarToken */:
                    return 185 /* LogicalOrExpression */;
                case 116 /* BarEqualsToken */:
                    return 180 /* OrAssignmentExpression */;
                case 115 /* AmpersandEqualsToken */:
                    return 178 /* AndAssignmentExpression */;
                case 117 /* CaretEqualsToken */:
                    return 179 /* ExclusiveOrAssignmentExpression */;
                case 112 /* LessThanLessThanEqualsToken */:
                    return 181 /* LeftShiftAssignmentExpression */;
                case 113 /* GreaterThanGreaterThanEqualsToken */:
                    return 182 /* SignedRightShiftAssignmentExpression */;
                case 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
                    return 183 /* UnsignedRightShiftAssignmentExpression */;
                case 108 /* PlusEqualsToken */:
                    return 173 /* AddAssignmentExpression */;
                case 109 /* MinusEqualsToken */:
                    return 174 /* SubtractAssignmentExpression */;
                case 110 /* AsteriskEqualsToken */:
                    return 175 /* MultiplyAssignmentExpression */;
                case 119 /* SlashEqualsToken */:
                    return 176 /* DivideAssignmentExpression */;
                case 111 /* PercentEqualsToken */:
                    return 177 /* ModuloAssignmentExpression */;
                case 107 /* EqualsToken */:
                    return 172 /* AssignmentExpression */;
                case 79 /* CommaToken */:
                    return 171 /* CommaExpression */;
                default:
                    return 0 /* None */;
            }
        }
        SyntaxFacts.getBinaryExpressionFromOperatorToken = getBinaryExpressionFromOperatorToken;
        function isAnyDivideToken(kind) {
            switch (kind) {
                case 118 /* SlashToken */:
                case 119 /* SlashEqualsToken */:
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isAnyDivideToken = isAnyDivideToken;
        function isAnyDivideOrRegularExpressionToken(kind) {
            switch (kind) {
                case 118 /* SlashToken */:
                case 119 /* SlashEqualsToken */:
                case 12 /* RegularExpressionLiteral */:
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isAnyDivideOrRegularExpressionToken = isAnyDivideOrRegularExpressionToken;
        function isParserGenerated(kind) {
            switch (kind) {
                case 96 /* GreaterThanGreaterThanToken */:
                case 97 /* GreaterThanGreaterThanGreaterThanToken */:
                case 83 /* GreaterThanEqualsToken */:
                case 113 /* GreaterThanGreaterThanEqualsToken */:
                case 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isParserGenerated = isParserGenerated;
        function isAnyBinaryExpression(kind) {
            switch (kind) {
                case 171 /* CommaExpression */:
                case 172 /* AssignmentExpression */:
                case 173 /* AddAssignmentExpression */:
                case 174 /* SubtractAssignmentExpression */:
                case 175 /* MultiplyAssignmentExpression */:
                case 176 /* DivideAssignmentExpression */:
                case 177 /* ModuloAssignmentExpression */:
                case 178 /* AndAssignmentExpression */:
                case 179 /* ExclusiveOrAssignmentExpression */:
                case 180 /* OrAssignmentExpression */:
                case 181 /* LeftShiftAssignmentExpression */:
                case 182 /* SignedRightShiftAssignmentExpression */:
                case 183 /* UnsignedRightShiftAssignmentExpression */:
                case 185 /* LogicalOrExpression */:
                case 186 /* LogicalAndExpression */:
                case 187 /* BitwiseOrExpression */:
                case 188 /* BitwiseExclusiveOrExpression */:
                case 189 /* BitwiseAndExpression */:
                case 190 /* EqualsWithTypeConversionExpression */:
                case 191 /* NotEqualsWithTypeConversionExpression */:
                case 192 /* EqualsExpression */:
                case 193 /* NotEqualsExpression */:
                case 194 /* LessThanExpression */:
                case 195 /* GreaterThanExpression */:
                case 196 /* LessThanOrEqualExpression */:
                case 197 /* GreaterThanOrEqualExpression */:
                case 198 /* InstanceOfExpression */:
                case 199 /* InExpression */:
                case 200 /* LeftShiftExpression */:
                case 201 /* SignedRightShiftExpression */:
                case 202 /* UnsignedRightShiftExpression */:
                case 203 /* MultiplyExpression */:
                case 204 /* DivideExpression */:
                case 205 /* ModuloExpression */:
                case 206 /* AddExpression */:
                case 207 /* SubtractExpression */:
                    return true;
            }
            return false;
        }
        SyntaxFacts.isAnyBinaryExpression = isAnyBinaryExpression;
    })(TypeScript.SyntaxFacts || (TypeScript.SyntaxFacts = {}));
    var SyntaxFacts = TypeScript.SyntaxFacts;
})(TypeScript || (TypeScript = {}));
var argumentChecks = false;
var forPrettyPrinter = false;
var interfaces = {
    IMemberDeclarationSyntax: 'IClassElementSyntax',
    IStatementSyntax: 'IModuleElementSyntax',
    INameSyntax: 'ITypeSyntax',
    ITypeSyntax: 'IUnaryExpressionSyntax',
    IUnaryExpressionSyntax: 'IExpressionSyntax'
};
var definitions = [
    {
        name: 'SourceUnitSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'moduleElements', isList: true, elementType: 'IModuleElementSyntax' },
            { name: 'endOfFileToken', isToken: true }
        ]
    },
    {
        name: 'ModuleReferenceSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleReferenceSyntax'],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
    },
    {
        name: 'ExternalModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            { name: 'moduleKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'stringLiteral', isToken: true },
            { name: 'closeParenToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            { name: 'moduleName', type: 'INameSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ImportDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'importKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'equalsToken', isToken: true },
            { name: 'moduleReference', type: 'ModuleReferenceSyntax' },
            { name: 'semicolonToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ExportAssignmentSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'exportKeyword', isToken: true },
            { name: 'equalsToken', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'semicolonToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ClassDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'classKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'heritageClauses', isList: true, elementType: 'HeritageClauseSyntax' },
            { name: 'openBraceToken', isToken: true },
            { name: 'classElements', isList: true, elementType: 'IClassElementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'InterfaceDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'interfaceKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'heritageClauses', isList: true, elementType: 'HeritageClauseSyntax' },
            { name: 'body', type: 'ObjectTypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'HeritageClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'extendsOrImplementsKeyword', isToken: true, tokenKinds: ['ExtendsKeyword', 'ImplementsKeyword'] },
            { name: 'typeNames', isSeparatedList: true, requiresAtLeastOneItem: true, elementType: 'INameSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ModuleDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'moduleKeyword', isToken: true },
            { name: 'moduleName', type: 'INameSyntax', isOptional: true },
            { name: 'stringLiteral', isToken: true, isOptional: true },
            { name: 'openBraceToken', isToken: true },
            { name: 'moduleElements', isList: true, elementType: 'IModuleElementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'FunctionDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'functionKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true, isOptional: true }
        ]
    },
    {
        name: 'VariableStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'variableDeclaration', type: 'VariableDeclarationSyntax' },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'VariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'varKeyword', isToken: true },
            { name: 'variableDeclarators', isSeparatedList: true, requiresAtLeastOneItem: true, elementType: 'VariableDeclaratorSyntax' }
        ]
    },
    {
        name: 'VariableDeclaratorSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecific: true },
            { name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'EqualsValueClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'equalsToken', isToken: true },
            { name: 'value', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'PrefixUnaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'kind', type: 'SyntaxKind' },
            { name: 'operatorToken', isToken: true, tokenKinds: ['PlusPlusToken', 'MinusMinusToken', 'PlusToken', 'MinusToken', 'TildeToken', 'ExclamationToken'] },
            { name: 'operand', type: 'IUnaryExpressionSyntax' }
        ]
    },
    {
        name: 'ArrayLiteralExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'openBracketToken', isToken: true },
            { name: 'expressions', isSeparatedList: true, elementType: 'IExpressionSyntax' },
            { name: 'closeBracketToken', isToken: true }
        ]
    },
    {
        name: 'OmittedExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IExpressionSyntax'],
        children: []
    },
    {
        name: 'ParenthesizedExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'openParenToken', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true }
        ]
    },
    {
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
    },
    {
        name: 'SimpleArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'body', type: 'ISyntaxNodeOrToken' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ParenthesizedArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'body', type: 'ISyntaxNodeOrToken' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'QualifiedNameSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['INameSyntax'],
        children: [
            { name: 'left', type: 'INameSyntax' },
            { name: 'dotToken', isToken: true },
            { name: 'right', isToken: true, tokenKinds: ['IdentifierName'] }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'TypeArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'lessThanToken', isToken: true },
            { name: 'typeArguments', isSeparatedList: true, elementType: 'ITypeSyntax' },
            { name: 'greaterThanToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ConstructorTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'newKeyword', isToken: true },
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'FunctionTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ObjectTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'openBraceToken', isToken: true },
            { name: 'typeMembers', isSeparatedList: true, elementType: 'ITypeMemberSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ArrayTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'type', type: 'ITypeSyntax' },
            { name: 'openBracketToken', isToken: true },
            { name: 'closeBracketToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'GenericTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'name', type: 'INameSyntax' },
            { name: 'typeArgumentList', type: 'TypeArgumentListSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'TypeAnnotationSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'colonToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'BlockSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'openBraceToken', isToken: true },
            { name: 'statements', isList: true, elementType: 'IStatementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ]
    },
    {
        name: 'ParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'dotDotDotToken', isToken: true, isOptional: true, isTypeScriptSpecific: true },
            { name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ['PublicKeyword', 'PrivateKeyword'], isTypeScriptSpecific: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'questionToken', isToken: true, isOptional: true, isTypeScriptSpecific: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecific: true },
            { name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true, isTypeScriptSpecific: true }
        ]
    },
    {
        name: 'MemberAccessExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'dotToken', isToken: true },
            { name: 'name', isToken: true, tokenKinds: ['IdentifierName'] }
        ]
    },
    {
        name: 'PostfixUnaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'kind', type: 'SyntaxKind' },
            { name: 'operand', type: 'IExpressionSyntax' },
            { name: 'operatorToken', isToken: true, tokenKinds: ['PlusPlusToken', 'MinusMinusToken'] }
        ]
    },
    {
        name: 'ElementAccessExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'openBracketToken', isToken: true },
            { name: 'argumentExpression', type: 'IExpressionSyntax' },
            { name: 'closeBracketToken', isToken: true }
        ]
    },
    {
        name: 'InvocationExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'argumentList', type: 'ArgumentListSyntax' }
        ]
    },
    {
        name: 'ArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'typeArgumentList', type: 'TypeArgumentListSyntax', isOptional: true },
            { name: 'openParenToken', isToken: true },
            { name: 'arguments', isSeparatedList: true, elementType: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true }
        ]
    },
    {
        name: 'BinaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IExpressionSyntax'],
        children: [
            { name: 'kind', type: 'SyntaxKind' },
            { name: 'left', type: 'IExpressionSyntax' },
            {
                name: 'operatorToken',
                isToken: true,
                tokenKinds: [
                    'AsteriskToken',
                    'SlashToken',
                    'PercentToken',
                    'PlusToken',
                    'MinusToken',
                    'LessThanLessThanToken',
                    'GreaterThanGreaterThanToken',
                    'GreaterThanGreaterThanGreaterThanToken',
                    'LessThanToken',
                    'GreaterThanToken',
                    'LessThanEqualsToken',
                    'GreaterThanEqualsToken',
                    'InstanceOfKeyword',
                    'InKeyword',
                    'EqualsEqualsToken',
                    'ExclamationEqualsToken',
                    'EqualsEqualsEqualsToken',
                    'ExclamationEqualsEqualsToken',
                    'AmpersandToken',
                    'CaretToken',
                    'BarToken',
                    'AmpersandAmpersandToken',
                    'BarBarToken',
                    'BarEqualsToken',
                    'AmpersandEqualsToken',
                    'CaretEqualsToken',
                    'LessThanLessThanEqualsToken',
                    'GreaterThanGreaterThanEqualsToken',
                    'GreaterThanGreaterThanGreaterThanEqualsToken',
                    'PlusEqualsToken',
                    'MinusEqualsToken',
                    'AsteriskEqualsToken',
                    'SlashEqualsToken',
                    'PercentEqualsToken',
                    'EqualsToken',
                    'CommaToken'
                ]
            },
            { name: 'right', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'ConditionalExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IExpressionSyntax'],
        children: [
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'questionToken', isToken: true },
            { name: 'whenTrue', type: 'IExpressionSyntax' },
            { name: 'colonToken', isToken: true },
            { name: 'whenFalse', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'ConstructSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'newKeyword', isToken: true },
            { name: 'callSignature', type: 'CallSignatureSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MethodSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'questionToken', isToken: true, isOptional: true, itTypeScriptSpecific: true },
            { name: 'callSignature', type: 'CallSignatureSyntax' }
        ]
    },
    {
        name: 'IndexSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax', 'IClassElementSyntax'],
        children: [
            { name: 'openBracketToken', isToken: true },
            { name: 'parameter', type: 'ParameterSyntax' },
            { name: 'closeBracketToken', isToken: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'PropertySignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'questionToken', isToken: true, isOptional: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'CallSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true, isTypeScriptSpecific: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecific: true }
        ]
    },
    {
        name: 'ParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'openParenToken', isToken: true },
            { name: 'parameters', isSeparatedList: true, elementType: 'ParameterSyntax' },
            { name: 'closeParenToken', isToken: true }
        ]
    },
    {
        name: 'TypeParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'lessThanToken', isToken: true },
            { name: 'typeParameters', isSeparatedList: true, elementType: 'TypeParameterSyntax' },
            { name: 'greaterThanToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'TypeParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'constraint', type: 'ConstraintSyntax', isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ConstraintSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'extendsKeyword', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ElseClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'elseKeyword', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'IfStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'ifKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' },
            { name: 'elseClause', type: 'ElseClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'ExpressionStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ConstructorDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IClassElementSyntax'],
        children: [
            { name: 'constructorKeyword', isToken: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'block', type: 'BlockSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true, isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MemberFunctionDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IMemberDeclarationSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true, isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MemberAccessorDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IMemberDeclarationSyntax'],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
    },
    {
        name: 'GetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'getKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            { name: 'block', type: 'BlockSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'SetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'setKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'block', type: 'BlockSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IMemberDeclarationSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'variableDeclarator', type: 'VariableDeclaratorSyntax' },
            { name: 'semicolonToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ThrowStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'throwKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ReturnStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'returnKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ObjectCreationExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'newKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'argumentList', type: 'ArgumentListSyntax', isOptional: true }
        ]
    },
    {
        name: 'SwitchStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'switchKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'openBraceToken', isToken: true },
            { name: 'switchClauses', isList: true, elementType: 'SwitchClauseSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ]
    },
    {
        name: 'SwitchClauseSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ISwitchClauseSyntax'],
        isAbstract: true,
        children: []
    },
    {
        name: 'CaseSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            { name: 'caseKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'colonToken', isToken: true },
            { name: 'statements', isList: true, elementType: 'IStatementSyntax' }
        ]
    },
    {
        name: 'DefaultSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            { name: 'defaultKeyword', isToken: true },
            { name: 'colonToken', isToken: true },
            { name: 'statements', isList: true, elementType: 'IStatementSyntax' }
        ]
    },
    {
        name: 'BreakStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'breakKeyword', isToken: true },
            { name: 'identifier', isToken: true, isOptional: true, tokenKinds: ['IdentifierName'] },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ContinueStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'continueKeyword', isToken: true },
            { name: 'identifier', isToken: true, isOptional: true, tokenKinds: ['IdentifierName'] },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'IterationStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        isAbstract: true,
        children: []
    },
    {
        name: 'BaseForStatementSyntax',
        baseType: 'IterationStatementSyntax',
        isAbstract: true,
        children: []
    },
    {
        name: 'ForStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            { name: 'forKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'variableDeclaration', type: 'VariableDeclarationSyntax', isOptional: true },
            { name: 'initializer', type: 'IExpressionSyntax', isOptional: true },
            { name: 'firstSemicolonToken', isToken: true, tokenKinds: ['SemicolonToken'] },
            { name: 'condition', type: 'IExpressionSyntax', isOptional: true },
            { name: 'secondSemicolonToken', isToken: true, tokenKinds: ['SemicolonToken'] },
            { name: 'incrementor', type: 'IExpressionSyntax', isOptional: true },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'ForInStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            { name: 'forKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'variableDeclaration', type: 'VariableDeclarationSyntax', isOptional: true },
            { name: 'left', type: 'IExpressionSyntax', isOptional: true },
            { name: 'inKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'WhileStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            { name: 'whileKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'WithStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'withKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'EnumDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'enumKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'openBraceToken', isToken: true },
            { name: 'enumElements', isSeparatedList: true, elementType: 'EnumElementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'EnumElementSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'CastExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'lessThanToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' },
            { name: 'greaterThanToken', isToken: true },
            { name: 'expression', type: 'IUnaryExpressionSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ObjectLiteralExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'openBraceToken', isToken: true },
            { name: 'propertyAssignments', isSeparatedList: true, elementType: 'PropertyAssignmentSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ]
    },
    {
        name: 'PropertyAssignmentSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    {
        name: 'SimplePropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'colonToken', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'FunctionPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'AccessorPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        isAbstract: true,
        children: []
    },
    {
        name: 'GetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            { name: 'getKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'openParenToken', isToken: true },
            { name: 'closeParenToken', isToken: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'SetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            { name: 'setKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'openParenToken', isToken: true },
            { name: 'parameter', type: 'ParameterSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'FunctionExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'functionKeyword', isToken: true },
            { name: 'identifier', isToken: true, isOptional: true, tokenKinds: ['IdentifierName'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'EmptyStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'TryStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'tryKeyword', isToken: true },
            { name: 'block', type: 'BlockSyntax' },
            { name: 'catchClause', type: 'CatchClauseSyntax', isOptional: true },
            { name: 'finallyClause', type: 'FinallyClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'CatchClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'catchKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecified: true },
            { name: 'closeParenToken', isToken: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'FinallyClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'finallyKeyword', isToken: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'LabeledStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'colonToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'DoStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            { name: 'doKeyword', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' },
            { name: 'whileKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'TypeOfExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'typeOfKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'DeleteExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'deleteKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'VoidExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'voidKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'DebuggerStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'debuggerKeyword', isToken: true },
            { name: 'semicolonToken', isToken: true }
        ]
    }
];
function getStringWithoutSuffix(definition) {
    if (TypeScript.StringUtilities.endsWith(definition, "Syntax")) {
        return definition.substring(0, definition.length - "Syntax".length);
    }
    return definition;
}
function getNameWithoutSuffix(definition) {
    return getStringWithoutSuffix(definition.name);
}
function getType(child) {
    if (child.isToken) {
        return "ISyntaxToken";
    } else if (child.isSeparatedList) {
        return "ISeparatedSyntaxList";
    } else if (child.isList) {
        return "ISyntaxList";
    } else {
        return child.type;
    }
}
var hasKind = false;
function pascalCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1);
}
function camelCase(value) {
    return value.substr(0, 1).toLowerCase() + value.substr(1);
}
function getSafeName(child) {
    if (child.name === "arguments") {
        return "_" + child.name;
    }
    return child.name;
}
function getPropertyAccess(child) {
    if (child.type === "SyntaxKind") {
        return "this._kind";
    }
    return "this." + child.name;
}
function generateProperties(definition) {
    var result = "";
    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (getType(child) === "SyntaxKind") {
            result += "    private _" + child.name + ": " + getType(child) + ";\r\n";
        }
        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }
    if (definition.children.length > 0) {
        result += "\r\n";
    }
    return result;
}
function generateNullChecks(definition) {
    var result = "";
    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (!child.isOptional && !child.isToken) {
            result += "        if (" + child.name + " === null) { throw Errors.argumentNull('" + child.name + "'); }\r\n";
        }
    }
    return result;
}
function generateIfKindCheck(child, tokenKinds, indent) {
    var result = "";
    result += indent + "        if (";
    for (var j = 0; j < tokenKinds.length; j++) {
        if (j > 0) {
            result += " && ";
        }
        var tokenKind = tokenKinds[j];
        if (tokenKind === "IdentifierName") {
            result += "!SyntaxFacts.isIdentifierName(" + child.name + ".tokenKind)";
        } else {
            result += child.name + ".tokenKind !== SyntaxKind." + tokenKind;
        }
    }
    result += ") { throw Errors.argument('" + child.name + "'); }\r\n";
    return result;
}
function generateSwitchCase(tokenKind, indent) {
    return indent + "            case SyntaxKind." + tokenKind + ":\r\n";
}
function generateBreakStatement(indent) {
    return indent + "                break;\r\n";
}
function generateSwitchCases(tokenKinds, indent) {
    var result = "";
    for (var j = 0; j < tokenKinds.length; j++) {
        var tokenKind = tokenKinds[j];
        result += generateSwitchCase(tokenKind, indent);
    }
    if (tokenKinds.length > 0) {
        result += generateBreakStatement(indent);
    }
    return result;
}
function generateDefaultCase(child, indent) {
    var result = "";
    result += indent + "            default:\r\n";
    result += indent + "                throw Errors.argument('" + child.name + "');\r\n";
    return result;
}
function generateSwitchKindCheck(child, tokenKinds, indent) {
    if (tokenKinds.length === 0) {
        return "";
    }
    var result = "";
    var identifierName = TypeScript.ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("IdentifierName") >= 0;
    });
    var notIdentifierName = TypeScript.ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("IdentifierName") < 0;
    });
    if (identifierName.length > 0) {
        result += indent + "        if (!SyntaxFacts.isIdentifierName(" + child.name + ".tokenKind)) {\r\n";
        if (notIdentifierName.length === 0) {
            result += indent + "            throw Errors.argument('" + child.name + "');\r\n";
            result += indent + "        }\r\n";
            return result;
        }
        indent += "    ";
    }
    if (notIdentifierName.length <= 2) {
        result += generateIfKindCheck(child, notIdentifierName, indent);
    } else if (notIdentifierName.length > 2) {
        result += indent + "        switch (" + child.name + ".tokenKind) {\r\n";
        result += generateSwitchCases(notIdentifierName, indent);
        result += generateDefaultCase(child, indent);
        result += indent + "        }\r\n";
    }
    if (identifierName.length > 0) {
        result += indent + "    }\r\n";
    }
    return result;
}
function tokenKinds(child) {
    return child.tokenKinds ? child.tokenKinds : [pascalCase(child.name)];
}
function generateKindCheck(child) {
    var indent = "";
    var result = "";
    if (child.isOptional) {
        indent = "    ";
        result += "        if (" + child.name + " !== null) {\r\n";
    }
    var kinds = tokenKinds(child);
    if (kinds.length <= 2) {
        result += generateIfKindCheck(child, kinds, indent);
    } else {
        result += generateSwitchKindCheck(child, kinds, indent);
    }
    if (child.isOptional) {
        result += "        }\r\n";
    }
    return result;
}
function generateKindChecks(definition) {
    var result = "";
    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.isToken) {
            result += generateKindCheck(child);
        }
    }
    return result;
}
function generateArgumentChecks(definition) {
    var result = "";
    if (argumentChecks) {
        result += generateNullChecks(definition);
        result += generateKindChecks(definition);
        if (definition.children.length > 0) {
            result += "\r\n";
        }
    }
    return result;
}
function generateConstructor(definition) {
    if (definition.isAbstract) {
    }
    var i;
    var child;
    var base = baseType(definition);
    var subchildren = childrenInAllSubclasses(definition);
    var baseSubchildren = childrenInAllSubclasses(base);
    var baseSubchildrenNames = TypeScript.ArrayUtilities.select(baseSubchildren, function (c) {
        return c.name;
    });
    var result = "";
    result += "        constructor(";
    var children = definition.children;
    if (subchildren.length > 0) {
        children = subchildren;
    }
    for (i = 0; i < children.length; i++) {
        child = children[i];
        if (getType(child) !== "SyntaxKind" && !TypeScript.ArrayUtilities.contains(baseSubchildrenNames, child.name)) {
            result += "public ";
        }
        result += child.name + ": " + getType(child);
        result += ",\r\n                    ";
    }
    result += "parsedInStrictMode: boolean) {\r\n";
    result += "            super(";
    for (i = 0; i < baseSubchildrenNames.length; i++) {
        result += baseSubchildrenNames[i] + ", ";
    }
    result += "parsedInStrictMode); \r\n";
    if (definition.children.length > 0) {
        result += "\r\n";
    }
    result += generateArgumentChecks(definition);
    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];
        if (child.type === "SyntaxKind") {
            result += "            " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
        }
    }
    result += "        }\r\n";
    return result;
}
function isOptional(child) {
    if (child.isOptional) {
        return true;
    }
    if (child.isList && !child.requiresAtLeastOneItem) {
        return true;
    }
    if (child.isSeparatedList && !child.requiresAtLeastOneItem) {
        return true;
    }
    return false;
}
function generateFactory1Method(definition) {
    var mandatoryChildren = TypeScript.ArrayUtilities.where(definition.children, function (c) {
        return !isOptional(c);
    });
    if (mandatoryChildren.length === definition.children.length) {
        return "";
    }
    var result = "\r\n    public static create(";
    var i;
    var child;
    for (i = 0; i < mandatoryChildren.length; i++) {
        child = mandatoryChildren[i];
        result += child.name + ": " + getType(child);
        if (i < mandatoryChildren.length - 1) {
            result += ",\r\n                         ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";
    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];
        if (!isOptional(child)) {
            result += child.name;
        } else if (child.isList) {
            result += "Syntax.emptyList";
        } else if (child.isSeparatedList) {
            result += "Syntax.emptySeparatedList";
        } else {
            result += "null";
        }
        result += ", ";
    }
    result += "/*parsedInStrictMode:*/ false);\r\n";
    result += "    }\r\n";
    return result;
}
function isKeywordOrPunctuation(kind) {
    if (TypeScript.StringUtilities.endsWith(kind, "Keyword")) {
        return true;
    }
    if (TypeScript.StringUtilities.endsWith(kind, "Token") && kind !== "IdentifierName" && kind !== "EndOfFileToken") {
        return true;
    }
    return false;
}
function isDefaultConstructable(definition) {
    if (definition === null || definition.isAbstract) {
        return false;
    }
    for (var i = 0; i < definition.children.length; i++) {
        if (isMandatory(definition.children[i])) {
            return false;
        }
    }
    return true;
}
function isMandatory(child) {
    if (isOptional(child)) {
        return false;
    }
    if (child.type === "SyntaxKind" || child.isList || child.isSeparatedList) {
        return true;
    }
    if (child.isToken) {
        var kinds = tokenKinds(child);
        var isFixed = kinds.length === 1 && isKeywordOrPunctuation(kinds[0]);
        return !isFixed;
    }
    return !isDefaultConstructable(memberDefinitionType(child));
}
function generateFactory2Method(definition) {
    var mandatoryChildren = TypeScript.ArrayUtilities.where(definition.children, isMandatory);
    if (mandatoryChildren.length === definition.children.length) {
        return "";
    }
    var i;
    var child;
    var result = "\r\n    public static create1(";
    for (i = 0; i < mandatoryChildren.length; i++) {
        child = mandatoryChildren[i];
        result += child.name + ": " + getType(child);
        if (i < mandatoryChildren.length - 1) {
            result += ",\r\n                          ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";
    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];
        if (isMandatory(child)) {
            result += child.name;
        } else if (child.isList) {
            result += "Syntax.emptyList";
        } else if (child.isSeparatedList) {
            result += "Syntax.emptySeparatedList";
        } else if (isOptional(child)) {
            result += "null";
        } else if (child.isToken) {
            result += "Syntax.token(SyntaxKind." + tokenKinds(child)[0] + ")";
        } else {
            result += child.type + ".create1()";
        }
        result += ", ";
    }
    result += "/*parsedInStrictMode:*/ false);\r\n";
    result += "    }\r\n";
    return result;
}
function generateFactoryMethod(definition) {
    return generateFactory1Method(definition) + generateFactory2Method(definition);
}
function generateAcceptMethods(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
    }
    return result;
}
function generateIsMethod(definition) {
    var result = "";
    if (definition.interfaces) {
        var ifaces = definition.interfaces.slice(0);
        var i;
        for (i = 0; i < ifaces.length; i++) {
            var current = ifaces[i];
            while (current !== undefined) {
                if (!TypeScript.ArrayUtilities.contains(ifaces, current)) {
                    ifaces.push(current);
                }
                current = interfaces[current];
            }
        }
        for (i = 0; i < ifaces.length; i++) {
            var type = ifaces[i];
            type = getStringWithoutSuffix(type);
            if (isInterface(type)) {
                type = type.substr(1);
            }
            result += "\r\n";
            result += "    public is" + type + "(): boolean {\r\n";
            result += "        return true;\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateKindMethod(definition) {
    var result = "";
    if (!definition.isAbstract) {
        if (!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateSlotMethods(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public childCount(): number {\r\n";
        var slotCount = hasKind ? (definition.children.length - 1) : definition.children.length;
        result += "        return " + slotCount + ";\r\n";
        result += "    }\r\n\r\n";
        result += "    public childAt(slot: number): ISyntaxElement {\r\n";
        if (slotCount === 0) {
            result += "        throw Errors.invalidOperation();\r\n";
        } else {
            result += "        switch (slot) {\r\n";
            var index = 0;
            for (var i = 0; i < definition.children.length; i++) {
                var child = definition.children[i];
                if (child.type === "SyntaxKind") {
                    continue;
                }
                result += "            case " + index + ": return this." + definition.children[i].name + ";\r\n";
                index++;
            }
            result += "            default: throw Errors.invalidOperation();\r\n";
            result += "        }\r\n";
        }
        result += "    }\r\n";
    }
    return result;
}
function generateFirstTokenMethod(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public firstToken(): ISyntaxToken {\r\n";
        result += "        var token = null;\r\n";
        for (var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if (getType(child) === "SyntaxKind") {
                continue;
            }
            if (child.name === "endOfFileToken") {
                continue;
            }
            result += "        if (";
            if (child.isOptional) {
                result += getPropertyAccess(child) + " !== null && ";
            }
            if (child.isToken) {
                result += getPropertyAccess(child) + ".width() > 0";
                result += ") { return " + getPropertyAccess(child) + "; }\r\n";
            } else {
                result += "(token = " + getPropertyAccess(child) + ".firstToken()) !== null";
                result += ") { return token; }\r\n";
            }
        }
        if (definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        return null;\r\n";
        }
        result += "    }\r\n";
    }
    return result;
}
function generateLastTokenMethod(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public lastToken(): ISyntaxToken {\r\n";
        if (definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        var token = null;\r\n";
            for (var i = definition.children.length - 1; i >= 0; i--) {
                var child = definition.children[i];
                if (getType(child) === "SyntaxKind") {
                    continue;
                }
                if (child.name === "endOfFileToken") {
                    continue;
                }
                result += "        if (";
                if (child.isOptional) {
                    result += getPropertyAccess(child) + " !== null && ";
                }
                if (child.isToken) {
                    result += getPropertyAccess(child) + ".width() > 0";
                    result += ") { return " + getPropertyAccess(child) + "; }\r\n";
                } else {
                    result += "(token = " + getPropertyAccess(child) + ".lastToken()) !== null";
                    result += ") { return token; }\r\n";
                }
            }
            result += "        return null;\r\n";
        }
        result += "    }\r\n";
    }
    return result;
}
function generateInsertChildrenIntoMethod(definition) {
    var result = "";
    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public insertChildrenInto(array: ISyntaxElement[], index: number) {\r\n";
        for (var i = definition.children.length - 1; i >= 0; i--) {
            var child = definition.children[i];
            if (child.type === "SyntaxKind") {
                continue;
            }
            if (child.isList || child.isSeparatedList) {
                result += "        " + getPropertyAccess(child) + ".insertChildrenInto(array, index);\r\n";
            } else if (child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { array.splice(index, 0, " + getPropertyAccess(child) + "); }\r\n";
            } else {
                result += "        array.splice(index, 0, " + getPropertyAccess(child) + ");\r\n";
            }
        }
        result += "    }\r\n";
    }
    return result;
}
function baseType(definition) {
    return TypeScript.ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === definition.baseType;
    });
}
function memberDefinitionType(child) {
    return TypeScript.ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === child.type;
    });
}
function derivesFrom(def1, def2) {
    var current = def1;
    while (current !== null) {
        var base = baseType(current);
        if (base === def2) {
            return true;
        }
        current = base;
    }
    return false;
}
function contains(definition, child) {
    return TypeScript.ArrayUtilities.any(definition.children, function (c) {
        return c.name === child.name && c.isList === child.isList && c.isSeparatedList === child.isSeparatedList && c.isToken === child.isToken && c.type === child.type;
    });
}
function childrenInAllSubclasses(definition) {
    var result = [];
    if (definition !== null && definition.isAbstract) {
        var subclasses = TypeScript.ArrayUtilities.where(definitions, function (d) {
            return !d.isAbstract && derivesFrom(d, definition);
        });
        if (subclasses.length > 0) {
            var firstSubclass = subclasses[0];
            for (var i = 0; i < firstSubclass.children.length; i++) {
                var child = firstSubclass.children[i];
                if (TypeScript.ArrayUtilities.all(subclasses, function (s) {
                    return contains(s, child);
                })) {
                    result.push(child);
                }
            }
        }
    }
    return result;
}
function generateAccessors(definition) {
    var result = "";
    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.type === "SyntaxKind") {
            result += "\r\n";
            result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
            result += "        return " + getPropertyAccess(child) + ";\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateWithMethod(definition, child) {
    var result = "";
    result += "\r\n";
    result += "    public with" + pascalCase(child.name) + "(" + getSafeName(child) + ": " + getType(child) + "): " + definition.name + " {\r\n";
    result += "        return this.update(";
    for (var i = 0; i < definition.children.length; i++) {
        if (i > 0) {
            result += ", ";
        }
        if (definition.children[i] === child) {
            result += getSafeName(child);
        } else {
            result += getPropertyAccess(definition.children[i]);
        }
    }
    result += ");\r\n";
    result += "    }\r\n";
    if (child.isList || child.isSeparatedList) {
        if (TypeScript.StringUtilities.endsWith(child.name, "s")) {
            var pascalName = pascalCase(child.name);
            pascalName = pascalName.substring(0, pascalName.length - 1);
            var argName = getSafeName(child);
            argName = argName.substring(0, argName.length - 1);
            result += "\r\n";
            result += "    public with" + pascalName + "(" + argName + ": " + child.elementType + "): " + definition.name + " {\r\n";
            result += "        return this.with" + pascalCase(child.name) + "(";
            if (child.isList) {
                result += "Syntax.list([" + argName + "])";
            } else {
                result += "Syntax.separatedList([" + argName + "])";
            }
            result += ");\r\n";
            result += "    }\r\n";
        }
    }
    return result;
}
function generateWithMethods(definition) {
    var result = "";
    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += generateWithMethod(definition, child);
    }
    return result;
}
function generateTriviaMethods(definition) {
    var result = "\r\n";
    result += "    public withLeadingTrivia(trivia: ISyntaxTriviaList): " + definition.name + " {\r\n";
    result += "        return <" + definition.name + ">super.withLeadingTrivia(trivia);\r\n";
    result += "    }\r\n\r\n";
    result += "    public withTrailingTrivia(trivia: ISyntaxTriviaList): " + definition.name + " {\r\n";
    result += "        return <" + definition.name + ">super.withTrailingTrivia(trivia);\r\n";
    result += "    }\r\n";
    return result;
}
function generateUpdateMethod(definition) {
    if (definition.isAbstract) {
        return "";
    }
    var result = "";
    result += "\r\n";
    result += "    public ";
    result += "update(";
    var i;
    var child;
    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];
        result += getSafeName(child) + ": " + getType(child);
        if (i < definition.children.length - 1) {
            result += ",\r\n                  ";
        }
    }
    result += "): " + definition.name + " {\r\n";
    if (definition.children.length === 0) {
        result += "        return this;\r\n";
    } else {
        result += "        if (";
        for (i = 0; i < definition.children.length; i++) {
            child = definition.children[i];
            if (i !== 0) {
                result += " && ";
            }
            result += getPropertyAccess(child) + " === " + getSafeName(child);
        }
        result += ") {\r\n";
        result += "            return this;\r\n";
        result += "        }\r\n\r\n";
        result += "        return new " + definition.name + "(";
        for (i = 0; i < definition.children.length; i++) {
            child = definition.children[i];
            result += getSafeName(child);
            result += ", ";
        }
        result += "/*parsedInStrictMode:*/ this.parsedInStrictMode());\r\n";
    }
    result += "    }\r\n";
    return result;
}
function generateIsTypeScriptSpecificMethod(definition) {
    var result = "\r\n    public isTypeScriptSpecific(): boolean {\r\n";
    if (definition.isTypeScriptSpecific) {
        result += "        return true;\r\n";
    } else {
        for (var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];
            if (child.type === "SyntaxKind") {
                continue;
            }
            if (child.isTypeScriptSpecific) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { return true; }\r\n";
                continue;
            }
            if (child.isToken) {
                continue;
            }
            if (child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null && " + getPropertyAccess(child) + ".isTypeScriptSpecific()) { return true; }\r\n";
            } else {
                result += "        if (" + getPropertyAccess(child) + ".isTypeScriptSpecific()) { return true; }\r\n";
            }
        }
        result += "        return false;\r\n";
    }
    result += "    }\r\n";
    return result;
}
function couldBeRegularExpressionToken(child) {
    var kinds = tokenKinds(child);
    return TypeScript.ArrayUtilities.contains(kinds, "SlashToken") || TypeScript.ArrayUtilities.contains(kinds, "SlashEqualsToken") || TypeScript.ArrayUtilities.contains(kinds, "RegularExpressionLiteral");
}
function generateStructuralEqualsMethod(definition) {
    if (definition.isAbstract) {
        return "";
    }
    var result = "\r\n    private structuralEquals(node: SyntaxNode): boolean {\r\n";
    result += "        if (this === node) { return true; }\r\n";
    result += "        if (node === null) { return false; }\r\n";
    result += "        if (this.kind() !== node.kind()) { return false; }\r\n";
    result += "        var other = <" + definition.name + ">node;\r\n";
    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        if (child.type !== "SyntaxKind") {
            if (child.isList) {
                result += "        if (!Syntax.listStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (child.isSeparatedList) {
                result += "        if (!Syntax.separatedListStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (child.isToken) {
                result += "        if (!Syntax.tokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (isNodeOrToken(child)) {
                result += "        if (!Syntax.nodeOrTokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else {
                result += "        if (!Syntax.nodeStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            }
        }
    }
    result += "        return true;\r\n";
    result += "    }\r\n";
    return result;
}
function generateNode(definition) {
    var result = "    export class " + definition.name + " extends " + definition.baseType;
    if (definition.interfaces) {
        result += " implements " + definition.interfaces.join(", ");
    }
    result += " {\r\n";
    hasKind = false;
    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateSlotMethods(definition);
    result += generateIsMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);
    if (!forPrettyPrinter) {
        result += generateFactoryMethod(definition);
        result += generateTriviaMethods(definition);
        result += generateWithMethods(definition);
        result += generateIsTypeScriptSpecificMethod(definition);
    }
    result += "    }";
    return result;
}
function generateNodes() {
    var result = "///<reference path='references.ts' />\r\n\r\n";
    result += "module TypeScript {\r\n";
    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (i > 0) {
            result += "\r\n\r\n";
        }
        result += generateNode(definition);
    }
    result += "\r\n}";
    return result;
}
function isInterface(name) {
    return name.substr(0, 1) === "I" && name.substr(1, 1).toUpperCase() === name.substr(1, 1);
}
function isNodeOrToken(child) {
    return child.type && isInterface(child.type);
}
function generateRewriter() {
    var result = "///<reference path='references.ts' />\r\n\r\n";
    result += "module TypeScript {\r\n" + "    export class SyntaxRewriter implements ISyntaxVisitor {\r\n" + "        public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" + "            return token;\r\n" + "        }\r\n" + "\r\n" + "        public visitNode(node: SyntaxNode): SyntaxNode {\r\n" + "            return node.accept(this);\r\n" + "        }\r\n" + "\r\n" + "        public visitNodeOrToken(node: ISyntaxNodeOrToken): ISyntaxNodeOrToken {\r\n" + "            return node.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>node) : this.visitNode(<SyntaxNode>node);\r\n" + "        }\r\n" + "\r\n" + "        public visitList(list: ISyntaxList): ISyntaxList {\r\n" + "            var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                var newItem = this.visitNodeOrToken(item);\r\n" + "\r\n" + "                if (item !== newItem && newItems === null) {\r\n" + "                    newItems = [];\r\n" + "                    for (var j = 0; j < i; j++) {\r\n" + "                        newItems.push(list.childAt(j));\r\n" + "                    }\r\n" + "                }\r\n" + "\r\n" + "                if (newItems) {\r\n" + "                    newItems.push(newItem);\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            // Debug.assert(newItems === null || newItems.length === list.childCount());\r\n" + "            return newItems === null ? list : Syntax.list(newItems);\r\n" + "        }\r\n" + "\r\n" + "        public visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" + "            var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                var newItem = item.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" + "\r\n" + "                if (item !== newItem && newItems === null) {\r\n" + "                    newItems = [];\r\n" + "                    for (var j = 0; j < i; j++) {\r\n" + "                        newItems.push(list.childAt(j));\r\n" + "                    }\r\n" + "                }\r\n" + "\r\n" + "                if (newItems) {\r\n" + "                    newItems.push(newItem);\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            // Debug.assert(newItems === null || newItems.length === list.childCount());\r\n" + "            return newItems === null ? list : Syntax.separatedList(newItems);\r\n" + "        }\r\n";
    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
        if (definition.children.length === 0) {
            result += "            return node;\r\n";
            result += "        }\r\n";
            continue;
        }
        result += "            return node.update(\r\n";
        for (var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            result += "                ";
            if (child.isOptional) {
                result += "node." + child.name + " === null ? null : ";
            }
            if (child.isToken) {
                result += "this.visitToken(node." + child.name + ")";
            } else if (child.isList) {
                result += "this.visitList(node." + child.name + ")";
            } else if (child.isSeparatedList) {
                result += "this.visitSeparatedList(node." + child.name + ")";
            } else if (child.type === "SyntaxKind") {
                result += "node.kind()";
            } else if (isNodeOrToken(child)) {
                result += "<" + child.type + ">this.visitNodeOrToken(node." + child.name + ")";
            } else {
                result += "<" + child.type + ">this.visitNode(node." + child.name + ")";
            }
            if (j < definition.children.length - 1) {
                result += ",\r\n";
            }
        }
        result += ");\r\n";
        result += "        }\r\n";
    }
    result += "    }";
    result += "\r\n}";
    return result;
}
function generateToken(isFixedWidth, leading, trailing) {
    var isVariableWidth = !isFixedWidth;
    var hasAnyTrivia = leading || trailing;
    var result = "    export class ";
    var needsSourcetext = hasAnyTrivia || isVariableWidth;
    var className = isFixedWidth ? "FixedWidthToken" : "VariableWidthToken";
    className += leading && trailing ? "WithLeadingAndTrailingTrivia" : leading && !trailing ? "WithLeadingTrivia" : !leading && trailing ? "WithTrailingTrivia" : "WithNoTrivia";
    result += className;
    result += " implements ISyntaxToken {\r\n";
    if (needsSourcetext) {
        result += "        private _sourceText: ISimpleText;\r\n";
        result += "        private _fullStart: number;\r\n";
    }
    result += "        public tokenKind: SyntaxKind;\r\n";
    if (leading) {
        result += "        private _leadingTriviaInfo: number;\r\n";
    }
    if (isVariableWidth) {
        result += "        private _textOrWidth: any;\r\n";
    }
    if (trailing) {
        result += "        private _trailingTriviaInfo: number;\r\n";
    }
    result += "\r\n";
    if (needsSourcetext) {
        result += "        constructor(sourceText: ISimpleText, fullStart: number,";
    } else {
        result += "        constructor(";
    }
    result += "kind: SyntaxKind";
    if (leading) {
        result += ", leadingTriviaInfo: number";
    }
    if (isVariableWidth) {
        result += ", textOrWidth: any";
    }
    if (trailing) {
        result += ", trailingTriviaInfo: number";
    }
    result += ") {\r\n";
    if (needsSourcetext) {
        result += "            this._sourceText = sourceText;\r\n";
        result += "            this._fullStart = fullStart;\r\n";
    }
    result += "            this.tokenKind = kind;\r\n";
    if (leading) {
        result += "            this._leadingTriviaInfo = leadingTriviaInfo;\r\n";
    }
    if (isVariableWidth) {
        result += "            this._textOrWidth = textOrWidth;\r\n";
    }
    if (trailing) {
        result += "            this._trailingTriviaInfo = trailingTriviaInfo;\r\n";
    }
    result += "        }\r\n\r\n";
    result += "        public clone(): ISyntaxToken {\r\n";
    result += "            return new " + className + "(\r\n";
    if (needsSourcetext) {
        result += "                this._sourceText,\r\n";
        result += "                this._fullStart,\r\n";
    }
    result += "                this.tokenKind";
    if (leading) {
        result += ",\r\n                this._leadingTriviaInfo";
    }
    if (isVariableWidth) {
        result += ",\r\n                this._textOrWidth";
    }
    if (trailing) {
        result += ",\r\n                this._trailingTriviaInfo";
    }
    result += ");\r\n";
    result += "        }\r\n\r\n";
    result += "        public isNode(): boolean { return false; }\r\n" + "        public isToken(): boolean { return true; }\r\n" + "        public isList(): boolean { return false; }\r\n" + "        public isSeparatedList(): boolean { return false; }\r\n\r\n";
    result += "        public kind(): SyntaxKind { return this.tokenKind; }\r\n\r\n";
    result += "        public childCount(): number { return 0; }\r\n";
    result += "        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }\r\n\r\n";
    var leadingTriviaWidth = leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0";
    var trailingTriviaWidth = trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0";
    if (leading && trailing) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else if (leading) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width(); }\r\n";
    } else if (trailing) {
        result += "        public fullWidth(): number { return this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else {
        result += "        public fullWidth(): number { return this.width(); }\r\n";
    }
    if (needsSourcetext) {
        if (leading) {
            result += "        private start(): number { return this._fullStart + " + leadingTriviaWidth + "; }\r\n";
        } else {
            result += "        private start(): number { return this._fullStart; }\r\n";
        }
        result += "        private end(): number { return this.start() + this.width(); }\r\n\r\n";
    }
    if (isFixedWidth) {
        result += "        public width(): number { return this.text().length; }\r\n";
    } else {
        result += "        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }\r\n";
    }
    if (isFixedWidth) {
        result += "        public text(): string { return SyntaxFacts.getText(this.tokenKind); }\r\n";
    } else {
        result += "\r\n";
        result += "        public text(): string {\r\n";
        result += "            if (typeof this._textOrWidth === 'number') {\r\n";
        result += "                this._textOrWidth = this._sourceText.substr(\r\n";
        result += "                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);\r\n";
        result += "            }\r\n";
        result += "\r\n";
        result += "            return this._textOrWidth;\r\n";
        result += "        }\r\n\r\n";
    }
    if (needsSourcetext) {
        result += "        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }\r\n\r\n";
    } else {
        result += "        public fullText(): string { return this.text(); }\r\n\r\n";
    }
    if (isFixedWidth) {
        result += "        public value(): any { return value(this); }\r\n";
        result += "        public valueText(): string { return valueText(this); }\r\n";
    } else {
        result += "        public value(): any {\r\n" + "            if ((<any>this)._value === undefined) {\r\n" + "                (<any>this)._value = value(this);\r\n" + "            }\r\n" + "\r\n" + "            return (<any>this)._value;\r\n" + "        }\r\n\r\n";
        result += "        public valueText(): string {\r\n" + "            if ((<any>this)._valueText === undefined) {\r\n" + "                (<any>this)._valueText = valueText(this);\r\n" + "            }\r\n" + "\r\n" + "            return (<any>this)._valueText;\r\n" + "        }\r\n\r\n";
    }
    result += "        public hasLeadingTrivia(): boolean { return " + (leading ? "true" : "false") + "; }\r\n";
    result += "        public hasLeadingComment(): boolean { return " + (leading ? "hasTriviaComment(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingNewLine(): boolean { return " + (leading ? "hasTriviaNewLine(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingSkippedText(): boolean { return false; }\r\n";
    result += "        public leadingTriviaWidth(): number { return " + (leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public leadingTrivia(): ISyntaxTriviaList { return " + (leading ? "Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasTrailingTrivia(): boolean { return " + (trailing ? "true" : "false") + "; }\r\n";
    result += "        public hasTrailingComment(): boolean { return " + (trailing ? "hasTriviaComment(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingNewLine(): boolean { return " + (trailing ? "hasTriviaNewLine(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingSkippedText(): boolean { return false; }\r\n";
    result += "        public trailingTriviaWidth(): number { return " + (trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public trailingTrivia(): ISyntaxTriviaList { return " + (trailing ? "Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasSkippedToken(): boolean { return false; }\r\n";
    result += "        public toJSON(key) { return tokenToJSON(this); }\r\n" + "        public firstToken(): ISyntaxToken { return this; }\r\n" + "        public lastToken(): ISyntaxToken { return this; }\r\n" + "        public isTypeScriptSpecific(): boolean { return false; }\r\n" + "        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }\r\n" + "        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }\r\n" + "        private realize(): ISyntaxToken { return realizeToken(this); }\r\n" + "        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }\r\n\r\n";
    result += "        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {\r\n" + "            return new PositionedToken(parent, this, fullStart);\r\n" + "        }\r\n\r\n";
    result += "        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withLeadingTrivia(leadingTrivia);\r\n" + "        }\r\n" + "\r\n" + "        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withTrailingTrivia(trailingTrivia);\r\n" + "        }\r\n";
    result += "    }\r\n";
    return result;
}
function generateTokens() {
    var result = "///<reference path='references.ts' />\r\n" + "\r\n" + "module TypeScript.Syntax {\r\n";
    result += generateToken(false, false, false);
    result += "\r\n";
    result += generateToken(false, true, false);
    result += "\r\n";
    result += generateToken(false, false, true);
    result += "\r\n";
    result += generateToken(false, true, true);
    result += "\r\n";
    result += generateToken(true, false, false);
    result += "\r\n";
    result += generateToken(true, true, false);
    result += "\r\n";
    result += generateToken(true, false, true);
    result += "\r\n";
    result += generateToken(true, true, true);
    result += "\r\n";
    result += "    function collectTokenTextElements(token: ISyntaxToken, elements: string[]): void {\r\n" + "        token.leadingTrivia().collectTextElements(elements);\r\n" + "        elements.push(token.text());\r\n" + "        token.trailingTrivia().collectTextElements(elements);\r\n" + "    }\r\n" + "\r\n" + "    export function fixedWidthToken(sourceText: ISimpleText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new FixedWidthTokenWithNoTrivia(kind);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    export function variableWidthToken(sourceText: ISimpleText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, width);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, width, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n\r\n";
    result += "    function getTriviaWidth(value: number): number {\r\n" + "        return value >>> SyntaxConstants.TriviaFullWidthShift;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaComment(value: number): boolean {\r\n" + "        return (value & SyntaxConstants.TriviaCommentMask) !== 0;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaNewLine(value: number): boolean {\r\n" + "        return (value & SyntaxConstants.TriviaNewLineMask) !== 0;\r\n" + "    }\r\n";
    result += "}";
    return result;
}
function generateWalker() {
    var result = "";
    result += "///<reference path='references.ts' />\r\n" + "\r\n" + "module TypeScript {\r\n" + "    export class SyntaxWalker implements ISyntaxVisitor {\r\n" + "        public visitToken(token: ISyntaxToken): void {\r\n" + "        }\r\n" + "\r\n" + "        public visitNode(node: SyntaxNode): void {\r\n" + "            node.accept(this);\r\n" + "        }\r\n" + "\r\n" + "        public visitNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "            if (nodeOrToken.isToken()) { \r\n" + "                this.visitToken(<ISyntaxToken>nodeOrToken);\r\n" + "            }\r\n" + "            else {\r\n" + "                this.visitNode(<SyntaxNode>nodeOrToken);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        private visitOptionalToken(token: ISyntaxToken): void {\r\n" + "            if (token === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitToken(token);\r\n" + "        }\r\n" + "\r\n" + "        public visitOptionalNode(node: SyntaxNode): void {\r\n" + "            if (node === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitNode(node);\r\n" + "        }\r\n" + "\r\n" + "        public visitOptionalNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "            if (nodeOrToken === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitNodeOrToken(nodeOrToken);\r\n" + "        }\r\n" + "\r\n" + "        public visitList(list: ISyntaxList): void {\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "               this.visitNodeOrToken(list.childAt(i));\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        public visitSeparatedList(list: ISeparatedSyntaxList): void {\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                this.visitNodeOrToken(item);\r\n" + "            }\r\n" + "        }\r\n";
    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "\r\n";
        result += "        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): void {\r\n";
        for (var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];
            if (child.isToken) {
                if (child.isOptional) {
                    result += "            this.visitOptionalToken(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitToken(node." + child.name + ");\r\n";
                }
            } else if (child.isList) {
                result += "            this.visitList(node." + child.name + ");\r\n";
            } else if (child.isSeparatedList) {
                result += "            this.visitSeparatedList(node." + child.name + ");\r\n";
            } else if (isNodeOrToken(child)) {
                if (child.isOptional) {
                    result += "            this.visitOptionalNodeOrToken(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitNodeOrToken(node." + child.name + ");\r\n";
                }
            } else if (child.type !== "SyntaxKind") {
                if (child.isOptional) {
                    result += "            this.visitOptionalNode(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitNode(node." + child.name + ");\r\n";
                }
            }
        }
        result += "        }\r\n";
    }
    result += "    }";
    result += "\r\n}";
    return result;
}
function generateKeywordCondition(keywords, currentCharacter, indent) {
    var length = keywords[0].text.length;
    var result = "";
    var index;
    if (keywords.length === 1) {
        var keyword = keywords[0];
        if (currentCharacter === length) {
            return indent + "return SyntaxKind." + (TypeScript.SyntaxKind)._map[keyword.kind] + ";\r\n";
        }
        var keywordText = keywords[0].text;
        result = indent + "return (";
        for (var i = currentCharacter; i < length; i++) {
            if (i > currentCharacter) {
                result += " && ";
            }
            index = i === 0 ? "startIndex" : ("startIndex + " + i);
            result += "array[" + index + "] === CharacterCodes." + keywordText.substr(i, 1);
        }
        result += ") ? SyntaxKind." + (TypeScript.SyntaxKind)._map[keyword.kind] + " : SyntaxKind.IdentifierName;\r\n";
    } else {
        index = currentCharacter === 0 ? "startIndex" : ("startIndex + " + currentCharacter);
        result += indent + "switch(array[" + index + "]) {\r\n";
        var groupedKeywords = TypeScript.ArrayUtilities.groupBy(keywords, function (k) {
            return k.text.substr(currentCharacter, 1);
        });
        for (var c in groupedKeywords) {
            if (groupedKeywords.hasOwnProperty(c)) {
                result += indent + "case CharacterCodes." + c + ":\r\n";
                result += indent + "    // " + TypeScript.ArrayUtilities.select(groupedKeywords[c], function (k) {
                    return k.text;
                }).join(", ") + "\r\n";
                result += generateKeywordCondition(groupedKeywords[c], currentCharacter + 1, indent + "    ");
            }
        }
        result += indent + "default:\r\n";
        result += indent + "    return SyntaxKind.IdentifierName;\r\n";
        result += indent + "}\r\n\r\n";
    }
    return result;
}
function generateScannerUtilities() {
    var result = "///<reference path='references.ts' />\r\n" + "\r\n" + "module TypeScript {\r\n" + "    export class ScannerUtilities {\r\n";
    var i;
    var keywords = [];
    for (i = TypeScript.SyntaxKind.FirstKeyword; i <= TypeScript.SyntaxKind.LastKeyword; i++) {
        keywords.push({ kind: i, text: TypeScript.SyntaxFacts.getText(i) });
    }
    result += "        public static identifierKind(array: number[], startIndex: number, length: number): SyntaxKind {\r\n";
    var minTokenLength = TypeScript.ArrayUtilities.min(keywords, function (k) {
        return k.text.length;
    });
    var maxTokenLength = TypeScript.ArrayUtilities.max(keywords, function (k) {
        return k.text.length;
    });
    result += "            switch (length) {\r\n";
    for (i = minTokenLength; i <= maxTokenLength; i++) {
        var keywordsOfLengthI = TypeScript.ArrayUtilities.where(keywords, function (k) {
            return k.text.length === i;
        });
        if (keywordsOfLengthI.length > 0) {
            result += "            case " + i + ":\r\n";
            result += "                // " + TypeScript.ArrayUtilities.select(keywordsOfLengthI, function (k) {
                return k.text;
            }).join(", ") + "\r\n";
            result += generateKeywordCondition(keywordsOfLengthI, 0, "            ");
        }
    }
    result += "            default:\r\n";
    result += "                return SyntaxKind.IdentifierName;\r\n";
    result += "            }\r\n";
    result += "        }\r\n";
    result += "    }\r\n";
    result += "}";
    return result;
}
function generateVisitor() {
    var i;
    var definition;
    var result = "";
    result += "///<reference path='references.ts' />\r\n\r\n";
    result += "module TypeScript {\r\n";
    result += "    export interface ISyntaxVisitor {\r\n";
    result += "        visitToken(token: ISyntaxToken): any;\r\n";
    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (!definition.isAbstract) {
            result += "        visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any;\r\n";
        }
    }
    result += "    }\r\n\r\n";
    if (!forPrettyPrinter) {
        result += "    export class SyntaxVisitor implements ISyntaxVisitor {\r\n";
        result += "        public defaultVisit(node: ISyntaxNodeOrToken): any {\r\n";
        result += "            return null;\r\n";
        result += "        }\r\n";
        result += "\r\n";
        result += "        public visitToken(token: ISyntaxToken): any {\r\n";
        result += "            return this.defaultVisit(token);\r\n";
        result += "        }\r\n";
        for (i = 0; i < definitions.length; i++) {
            definition = definitions[i];
            if (!definition.isAbstract) {
                result += "\r\n        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
                result += "            return this.defaultVisit(node);\r\n";
                result += "        }\r\n";
            }
        }
        result += "    }";
    }
    result += "\r\n}";
    return result;
}
function generateFactory() {
    var result = "///<reference path='references.ts' />\r\n";
    result += "\r\nmodule TypeScript.Syntax {\r\n";
    result += "    export interface IFactory {\r\n";
    var i;
    var j;
    var definition;
    var child;
    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";
        for (j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }
            child = definition.children[j];
            result += child.name + ": " + getType(child);
        }
        result += "): " + definition.name + ";\r\n";
    }
    result += "    }\r\n\r\n";
    result += "    export class NormalModeFactory implements IFactory {\r\n";
    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";
        for (j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }
            child = definition.children[j];
            result += getSafeName(child) + ": " + getType(child);
        }
        result += "): " + definition.name + " {\r\n";
        result += "            return new " + definition.name + "(";
        for (j = 0; j < definition.children.length; j++) {
            child = definition.children[j];
            result += getSafeName(child);
            result += ", ";
        }
        result += "/*parsedInStrictMode:*/ false);\r\n";
        result += "        }\r\n";
    }
    result += "    }\r\n\r\n";
    result += "    export class StrictModeFactory implements IFactory {\r\n";
    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";
        for (j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }
            child = definition.children[j];
            result += getSafeName(child) + ": " + getType(child);
        }
        result += "): " + definition.name + " {\r\n";
        result += "            return new " + definition.name + "(";
        for (j = 0; j < definition.children.length; j++) {
            child = definition.children[j];
            result += getSafeName(child);
            result += ", ";
        }
        result += "/*parsedInStrictMode:*/ true);\r\n";
        result += "        }\r\n";
    }
    result += "    }\r\n\r\n";
    result += "    export var normalModeFactory: IFactory = new NormalModeFactory();\r\n";
    result += "    export var strictModeFactory: IFactory = new StrictModeFactory();\r\n";
    result += "}";
    return result;
}
var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
var tokens = generateTokens();
var walker = generateWalker();
var scannerUtilities = generateScannerUtilities();
var visitor = generateVisitor();
var factory = generateFactory();
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/syntaxNodes.generated.ts", syntaxNodes, true);
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/syntaxRewriter.generated.ts", rewriter, true);
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/syntaxToken.generated.ts", tokens, true);
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/syntaxWalker.generated.ts", walker, true);
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/scannerUtilities.generated.ts", scannerUtilities, true);
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/syntaxVisitor.generated.ts", visitor, true);
Environment.writeFile(Environment.currentDirectory() + "/src/compiler/syntax/syntaxFactory.generated.ts", factory, true);
