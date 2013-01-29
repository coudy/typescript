///<reference path='ISemanticModel.ts' />
///<reference path='Location.ts' />

module SymbolDisplay {
    /// <summary>
    /// Specifies the options for whether types are qualified when displayed in the description of a symbol.
    /// </summary>
    export enum TypeQualificationStyle {
        /// <summary>
        /// e.g. Class1
        /// </summary>
        NameOnly,

        /// <summary>
        /// ParentClass.NestedClass
        /// </summary>
        NameAndContainingModules,
    }

    export enum GenericsOptions {
        /// <summary>
        /// Omit generics entirely.
        /// </summary>
        None = 0,

        /// <summary>
        /// Type parameters. e.g. "Foo&lt;T&gt;".
        /// </summary>
        IncludeTypeParameters = 1 << 0,

        /// <summary>
        /// Type parameter constraints.  e.g. "<T extends Foo>".
        /// </summary>
        IncludeTypeConstraints = 1 << 1,
    }

    /// <summary>
    /// Specifies the options for how members are displayed in the description of a symbol.
    /// </summary>
    export enum MemberOptions {
        /// <summary>
        /// Display only the name of the member.
        /// </summary>
        None = 0,

        /// <summary>
        /// Include the (return) type of the method/field/property.
        /// </summary>
        IncludeType = 1 << 0,

        /// <summary>
        /// Include modifiers.  e.g. "static"
        /// </summary>
        IncludeModifiers = 1 << 1,

        /// <summary>
        /// Include accessibility.  e.g. "public"
        /// </summary>
        IncludeAccessibility = 1 << 2,

        /// <summary>
        /// Include method/indexer parameters.  (See ParameterFlags for fine-grained settings.)
        /// </summary>
        IncludeParameters = 1 << 4,

        /// <summary>
        /// Include the name of the containing type.
        /// </summary>
        IncludeContainingType = 1 << 5,

        /// <summary>
        /// Include the value of the member if is a constant.
        /// </summary>
        IncludeConstantValue = 1 << 6,
    }

    /// <summary>
    /// Specifies the options for how parameters are displayed in the description of a symbol.
    /// </summary>
    export enum ParameterOptions {
        /// <summary>
        /// If MemberFlags.IncludeParameters is set, but this value is used, then only the parentheses will be shown
        /// (e.g. M()).
        /// </summary>
        None = 0,

        /// <summary>
        /// Include the params/public/.../etc. parameters.
        /// </summary>
        IncludeModifiers = 1 << 1,

        /// <summary>
        /// Include the parameter type.
        /// </summary>
        IncludeType = 1 << 2,

        /// <summary>
        /// Include the parameter name.
        /// </summary>
        IncludeName = 1 << 3,

        /// <summary>
        /// Include the parameter default value.
        /// </summary>
        IncludeDefaultValue = 1 << 4,
    }

    /// <summary>
    /// Specifies the options for how property/event accessors are displayed in the description of a symbol.
    /// </summary>
    export enum AccessorStyle {
        /// <summary>
        /// Only show the name of the property (formatted using MemberFlags).
        /// </summary>
        NameOnly,

        /// <summary>
        /// Show the getter and/or setter of the property.
        /// </summary>
        ShowAccessors,
    }

    /// <summary>
    /// Specifies the options for how locals are displayed in the description of a symbol.
    /// </summary>
    export enum LocalOptions {
        /// <summary>
        /// Only show the name of the local. (e.g. "x").
        /// </summary>
        None = 0,

        /// <summary>
        /// Include the type of the local. (e.g. "x : number").
        /// </summary>
        IncludeType = 1 << 0,

        /// <summary>
        /// Include the value of the local if is a constant. (e.g. "x : number = 1").
        /// </summary>
        IncludeConstantValue = 1 << 1,
    }

    /// <summary>
    /// Specifies the options for whether the type's kind should be displayed in the description of a symbol.
    /// </summary>
    export enum KindOptions {
        /// <summary>
        /// None
        /// </summary>
        None = 0,

        /// <summary>
        /// Use the type's kind.  e.g. "class M1.C1" instead of "M1.C1"
        /// </summary>
        IncludeKind = 1 << 0,
    }

    export class Format {
        /// <summary>
        /// Determines how types are qualified (e.g. Nested vs Containing.Nested vs Namespace.Containing.Nested).
        /// </summary>
        private _typeQualificationStyle: TypeQualificationStyle;

        /// <summary>
        /// Determines how generics (on types and methods) should be described (i.e. level of detail).
        /// </summary>
        private _genericsOptions: GenericsOptions;

        /// <summary>
        /// Formatting options that apply to fields, properties, and methods.
        /// </summary>
        private _memberOptions: MemberOptions;

        /// <summary>
        /// Formatting options that apply to method and indexer parameters (i.e. level of detail).
        /// </summary>
        private _parameterOptions: ParameterOptions;

        /// <summary>
        /// Determines how properties are displayed. "Prop" vs "Prop { get; set; }"
        /// </summary>
        private _accessorStyle: AccessorStyle;

        /// <summary>
        /// Determines how local variables are displayed.
        /// </summary>
        private _localOptions: LocalOptions;

        /// <summary>
        /// Formatting options that apply to types.
        /// </summary>
        private _kindOptions: KindOptions;

        constructor(typeQualificationStyle: TypeQualificationStyle = TypeQualificationStyle.NameOnly,
                    genericsOptions: GenericsOptions = GenericsOptions.None,
                    memberOptions: MemberOptions = MemberOptions.None,
                    parameterOptions: ParameterOptions = ParameterOptions.None,
                    accessorStyle: AccessorStyle = AccessorStyle.NameOnly,
                    localOptions: LocalOptions = LocalOptions.None,
                    kindOptions: KindOptions = KindOptions.None) {
            this._typeQualificationStyle = typeQualificationStyle;
            this._genericsOptions = genericsOptions;
            this._memberOptions = memberOptions;
            this._parameterOptions = parameterOptions;
            this._accessorStyle = accessorStyle;
            this._localOptions = localOptions;
            this._kindOptions = kindOptions;
        }
    }

    export enum PartKind {
        ClassName,
        EnumName,
        ErrorTypeName,
        FieldName,
        InterfaceName,
        Keyword,
        LineBreak,
        NumericLiteral,
        StringLiteral,
        LocalName,
        MethodName,
        ModuleName,
        Operator,
        ParameterName,
        PropertyName,
        Punctuation,
        Space,
        Text,
        TypeParameterName,
    }

    export class Part {
        private _kind: PartKind;
        private _text: string;
        private _symbol: ISymbol;

        constructor(kind: PartKind, text: string, symbol: ISymbol = null) {
            this._kind = kind;
            this._text = text;
            this._symbol = symbol;
        }

        public kind(): PartKind {
            return this._kind;
        }

        public text(): string {
            return this._text;
        }

        public symbol(): ISymbol {
            return this._symbol;
        }
    }

    export var errorMessageFormat: Format =
        new Format(
            TypeQualificationStyle.NameAndContainingModules,
            GenericsOptions.IncludeTypeParameters,
            MemberOptions.IncludeParameters | MemberOptions.IncludeContainingType,
            ParameterOptions.IncludeModifiers | ParameterOptions.IncludeType,
            AccessorStyle.NameOnly);

    /// <summary>
    /// Fully qualified name format.
    /// </summary>
    export var fullyQualifiedFormat: Format =
        new Format(
            TypeQualificationStyle.NameAndContainingModules,
            GenericsOptions.IncludeTypeParameters);

    /// <summary>
    /// Format used by default when asking to minimally qualify a symbol.
    /// </summary>
    export var minimallyQualifiedFormat: Format =
        new Format(
            TypeQualificationStyle.NameOnly,
            GenericsOptions.IncludeTypeParameters,
            MemberOptions.IncludeParameters | MemberOptions.IncludeType | MemberOptions.IncludeContainingType,
            ParameterOptions.IncludeName | ParameterOptions.IncludeType | ParameterOptions.IncludeModifiers | ParameterOptions.IncludeDefaultValue,
            AccessorStyle.NameOnly,
            LocalOptions.IncludeType);

    /// <summary>
    /// Convert a symbol to an array of string parts, each of which has a kind. Useful for
    /// colorizing the display string.
    /// </summary>
    /// <param name="symbol">Symbol to be displayed.</param>
    /// <param name="format">Formatting rules - null implies
    /// Format.ErrorMessageFormat.</param>
    /// <returns>A read-only array of string parts.</returns>
    export function toDisplayParts(symbol: ISymbol, format: Format = null): Part[] {
        // null indicates the default format (as in IFormattable.ToString)
        format = format || errorMessageFormat;
        return toDisplayPartsWorker(
                symbol, /*location:*/ null, /*semanticModel:*/ null, format, /*minimal:*/ false);
    }

    /// <summary>
    /// Convert a symbol to an array of string parts, each of which has a kind. May be tailored
    /// to a specific location in the source code. Useful for colorizing the display string.
    /// </summary>
    /// <param name="symbol">Symbol to be displayed.</param>
    /// <param name="location">A location in the source code (context).</param>
    /// <param name="semanticModel">Binding information (for determining names appropriate to
    /// the context).</param>
    /// <param name="format">Formatting rules - null implies
    /// Format.MinimallyQualifiedFormat.</param>
    /// <returns>A read-only array of string parts.</returns>
    export function toMinimalDisplayParts(symbol: ISymbol,
        location: ILocation,
        semanticModel: ISemanticModel,
        format: Format = null): Part[] {
        format = format || minimallyQualifiedFormat;
        return toDisplayPartsWorker(symbol, location, semanticModel, format, /*minimal:*/ true);
    }

    function toDisplayPartsWorker(symbol: ISymbol,
        location: ILocation,
        semanticModel: ISemanticModel,
        format: Format,
        minimal: bool): Part[] {
        if (minimal) {
            if (location == null) {
                // TODO(cyrusn): Localize
                throw Errors.argument("location", "Location must be provided in order to provide minimal type qualification.");
            }

            if (semanticModel == null) {
                // TODO(cyrusn): Localize
                throw Errors.argument("semanticModel", "Semantic model must be provided in order to provide minimal type qualification.");
            }
        }

        return null;
    }
}