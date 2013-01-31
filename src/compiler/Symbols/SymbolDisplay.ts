///<reference path='..\Core\EnumUtilities.ts' />
///<reference path='ISemanticModel.ts' />
///<reference path='..\Syntax\Location.ts' />

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

    export enum TypeOptions {
        None = 0,
        InlineAnonymousTypes = 1 << 0,
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

        private _typeOptions: TypeOptions;

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
                    typeOptions: TypeOptions = TypeOptions.None,
                    genericsOptions: GenericsOptions = GenericsOptions.None,
                    memberOptions: MemberOptions = MemberOptions.None,
                    parameterOptions: ParameterOptions = ParameterOptions.None,
                    accessorStyle: AccessorStyle = AccessorStyle.NameOnly,
                    localOptions: LocalOptions = LocalOptions.None,
                    kindOptions: KindOptions = KindOptions.None) {
            this._typeQualificationStyle = typeQualificationStyle;
            this._typeOptions = typeOptions;
            this._genericsOptions = genericsOptions;
            this._memberOptions = memberOptions;
            this._parameterOptions = parameterOptions;
            this._accessorStyle = accessorStyle;
            this._localOptions = localOptions;
            this._kindOptions = kindOptions;
        }

        public typeQualificationStyle(): TypeQualificationStyle {
            return this._typeQualificationStyle;
        }

        public typeOptions(): TypeOptions {
            return this._typeOptions;
        }

        public genericsOptions(): GenericsOptions {
            return this._genericsOptions;
        }

        public memberOptions(): MemberOptions {
            return this._memberOptions;
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
            TypeOptions.InlineAnonymousTypes,
            GenericsOptions.IncludeTypeParameters,
            MemberOptions.IncludeParameters | MemberOptions.IncludeContainingType,
            ParameterOptions.IncludeModifiers | ParameterOptions.IncludeType,
            AccessorStyle.NameOnly);

    /// <summary>
    /// Fully qualified name format.
    /// </summary>
    //export var fullyQualifiedFormat: Format =
    //    new Format(
    //        TypeQualificationStyle.NameAndContainingModules,
    //        GenericsOptions.IncludeTypeParameters);

    /// <summary>
    /// Format used by default when asking to minimally qualify a symbol.
    /// </summary>
    export var minimallyQualifiedFormat: Format =
        new Format(
            TypeQualificationStyle.NameOnly,
            TypeOptions.None,
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

        var result: Part[] = [];
        symbol.accept(new Visitor(format, location, semanticModel, minimal, result));
        return result;
    }

    class Visitor implements ISymbolVisitor {
        private location: ILocation;
        private semanticModel: ISemanticModel;
        private format: Format;
        private builder: Part[];
        private isFirstSymbolVisited: bool;
        private minimal: bool;

        private notFirstVisitor: Visitor;

        constructor(format: Format,
            location: ILocation,
            semanticModel: ISemanticModel,
            minimal: bool,
            builder: Part[],
            isFirstSymbolVisited: bool = true) {
            this.location = location;
            this.semanticModel = semanticModel;

            this.format = format;
            this.minimal = minimal;
            this.builder = builder;
            this.isFirstSymbolVisited = isFirstSymbolVisited;

            if (isFirstSymbolVisited) {
                this.notFirstVisitor = new Visitor(format, location, semanticModel, minimal, builder, !isFirstSymbolVisited);
            }
            else {
                this.notFirstVisitor = this;
            }
        }

        private addKeyword(kind: SyntaxKind): void {
            this.builder.push(new Part(PartKind.Keyword, SyntaxFacts.getText(kind), null));
        }

        private addPunctuation(kind: SyntaxKind): void {
            this.builder.push(new Part(PartKind.Punctuation, SyntaxFacts.getText(kind), null));
        }

        private addSpace(): void {
            this.builder.push(new Part(PartKind.Keyword, " ", null));
        }

        private visitArrayType(symbol: IArrayTypeSymbol): void {
            var underlyingNonArrayType = symbol.elementType();
            while (underlyingNonArrayType.kind() === SymbolKind.ArrayType) {
                underlyingNonArrayType = (<IArrayTypeSymbol>underlyingNonArrayType).elementType();
            }

            underlyingNonArrayType.accept(this.notFirstVisitor);

            var arrayType = symbol;
            while (arrayType != null) {
                this.addArrayRank(arrayType);

                if (arrayType.elementType().kind() !== SymbolKind.ArrayType) {
                    break;
                }

                arrayType = <IArrayTypeSymbol>arrayType.elementType();
            }
        }

        private addArrayRank(symbol: IArrayTypeSymbol): void {
            this.addPunctuation(SyntaxKind.OpenBracketToken);

            for (var i = 0; i < symbol.rank() - 1; i++) {
                this.addPunctuation(SyntaxKind.CommaToken);
            }

            this.addPunctuation(SyntaxKind.CloseBracketToken);
        }

        private visitTypeParameter(symbol: ITypeParameterSymbol): void {
            this.builder.push(new Part(PartKind.TypeParameterName, symbol.name(), symbol));
        }

        private visitObjectType(symbol: IObjectTypeSymbol): void {
            if (this.minimal) {
                this.minimallyQualify(symbol);
                return;
            }

            this.addTypeKind(symbol);

            var containingModule = symbol.containingModule();
            if (this.shouldVisitModule(containingModule)) {
                containingModule.accept(this.notFirstVisitor);
                this.addPunctuation(SyntaxKind.DotToken);
            }

            this.addNameAndTypeArgumentsOrParameters(symbol);
        }

        private addTypeKind(symbol: ITypeSymbol): void {
            if (this.isFirstSymbolVisited) {
                var kindKeyword = this.getKindKeyword(symbol.typeKind());
                if (kindKeyword !== SyntaxKind.None) {
                    this.addKeyword(kindKeyword);
                    this.addSpace();
                }
            }
        }

        private getKindKeyword(typeKind: TypeKind): SyntaxKind {
            switch (typeKind) {
                case TypeKind.Class:
                    return SyntaxKind.ClassKeyword;
                case TypeKind.Enum:
                    return SyntaxKind.EnumKeyword;
                case TypeKind.Interface:
                    return SyntaxKind.InterfaceKeyword;
                default:
                    return SyntaxKind.None;
            }
        }

        private shouldVisitModule(moduleSymbol: IModuleSymbol): bool {
            if (this.format.typeQualificationStyle() !== TypeQualificationStyle.NameAndContainingModules) {
                return false;
            }

            return !moduleSymbol.isGlobalModule();
        }

        private addNameAndTypeArgumentsOrParameters(symbol: IObjectTypeSymbol): void {
            if (symbol.isAnonymous()) {
                this.addAnonymousTypeName(symbol);
                return;
            }

            var symbolName = symbol.name();
            var partKind = this.getPartKind(symbol);

            this.builder.push(new Part(partKind, symbolName, symbol));

            if (symbol.arity() > 0 && EnumUtilities.hasFlag(this.format.genericsOptions(), GenericsOptions.IncludeTypeParameters)) {
                this.addTypeArguments(symbol.typeArguments());
            }
        }

        private addAnonymousTypeName(symbol: IObjectTypeSymbol): void {
            if (EnumUtilities.hasFlag(this.format.typeOptions(), TypeOptions.InlineAnonymousTypes)) {
                this.addPunctuation(SyntaxKind.OpenBraceToken);
                this.addSpace();

                for (var i = 0, n = symbol.childCount(); i < n; i++) {
                    if (i > 0) {
                        this.addPunctuation(SyntaxKind.SemicolonToken);
                        this.addSpace();
                    }

                    symbol.childAt(i).accept(this.notFirstVisitor);
                }

                this.addPunctuation(SyntaxKind.CloseBraceToken);
            }
            else {
                // Note: higher up level services will determine how to display this.

                var name = "<anonymous type>";
                this.builder.push(new Part(PartKind.ClassName, name, symbol));
            }
        }

        private getPartKind(symbol: IObjectTypeSymbol): PartKind {
            switch (symbol.typeKind()) {
                case TypeKind.Class:
                    return PartKind.ClassName;
                case TypeKind.Enum:
                    return PartKind.EnumName;
                case TypeKind.Interface:
                    return PartKind.InterfaceName;
                default:
                    throw Errors.invalidOperation();
            }
        }

        private addTypeArguments(typeArguments: ITypeSymbol[]): void {
            if (typeArguments.length > 0 && EnumUtilities.hasFlag(this.format.genericsOptions(), GenericsOptions.IncludeTypeParameters)) {
                this.addPunctuation(SyntaxKind.LessThanToken);

                for (var i = 0, n = typeArguments.length; i < n; i++) {
                    var typeArg = typeArguments[i];

                    if (i > 0) {
                        this.addPunctuation(SyntaxKind.CommaToken);
                        this.addSpace();
                    }

                    typeArg.accept(this.notFirstVisitor);

                    if (typeArg.kind() === SymbolKind.TypeParameter) {
                        var typeParam = <ITypeParameterSymbol>typeArg;
                        this.addTypeParameterConstraint(typeParam);
                    }
                }

                this.addPunctuation(SyntaxKind.GreaterThanToken);
            }
        }

        private addTypeParameterConstraint(typeParameter: ITypeParameterSymbol): void {
            if (this.isFirstSymbolVisited && typeParameter.constraintType() !== null &&
                EnumUtilities.hasFlag(this.format.genericsOptions(), GenericsOptions.IncludeTypeConstraints)) {
                this.addSpace();
                this.addKeyword(SyntaxKind.ExtendsKeyword);
                this.addSpace();
                typeParameter.constraintType().accept(this.notFirstVisitor);
            }
        }

        private minimallyQualify(symbol: IObjectTypeSymbol): void {
            // We first start by trying to bind just our name and type arguments.  If they bind to
            // the symbol that we were constructed from, then we have our minimal name. Otherwise,
            // we get the minimal name of our parent, add a dot, and then add ourselves.
            if (!symbol.isAnonymous()) {
                if (!this.nameBoundSuccessfullyToSameSymbol(symbol)) {
                    // Just the name alone didn't bind properly.  Add our minimally qualified parent (if
                    // we have one), a dot, and then our name.
                    if (this.shouldVisitModule(symbol.containingModule())) {
                        symbol.containingModule().accept(this.notFirstVisitor);
                        this.addPunctuation(SyntaxKind.DotToken);
                    }
                }
            }

            this.addNameAndTypeArgumentsOrParameters(symbol);
        }

        private nameBoundSuccessfullyToSameSymbol(symbol: IObjectTypeSymbol): bool {
            var normalSymbols = this.semanticModel.lookupSymbols(
                this.location.textSpan().start(),
                /*container:*/ null,
                /*name:*/ symbol.name(),
                /*arity: */symbol.arity(),
                /*options: */ this.getMinimallyQualifyLookupOptions());

            if (normalSymbols.length === 1) {
                // Binding normally ended up with the right symbol.  We can definitely use hte
                // simplified name.
                if (normalSymbols[0].Equals(symbol.originalDefinition())) {
                    return true;
                }
            }

            return false;
        }

        private getMinimallyQualifyLookupOptions(): LookupOptions {
            var token = this.location.syntaxTree().sourceUnit().findToken(this.location.textSpan().start());

            return Syntax.isInModuleOrTypeContext(token)
                ? LookupOptions.ModulesOrTypesOnly
                : LookupOptions.Default;
        }

        private visitVariable(symbol: IVariableSymbol): void {
            this.addAccessibilityIfRequired(symbol);
            this.addMemberModifiersIfRequired(symbol);

            if (EnumUtilities.hasFlag(this.format.memberOptions(), MemberOptions.IncludeContainingType)) {
                symbol.containingType().accept(this.notFirstVisitor);
                this.addPunctuation(SyntaxKind.DotToken);
            }

            this.builder.push(new Part(PartKind.FieldName, symbol.name(), symbol));

            if (EnumUtilities.hasFlag(this.format.memberOptions(), MemberOptions.IncludeType) && this.isFirstSymbolVisited) {
                this.addPunctuation(SyntaxKind.ColonToken);
                this.addSpace();
                symbol.type().accept(this.notFirstVisitor);
            }


            if (this.isFirstSymbolVisited &&
                EnumUtilities.hasFlag(this.format.memberOptions(), MemberOptions.IncludeConstantValue) &&
                symbol.hasValue() &&
                this.canAddConstant(symbol.type(), symbol.value())) {
                this.addSpace();
                this.addPunctuation(SyntaxKind.EqualsToken);
                this.addSpace();
                this.addValue(symbol.type(), symbol.value());
            }
        }

        private canAddConstant(type: ITypeSymbol, value: any): bool {
            if (type.typeKind() === TypeKind.Enum) {
                return true;
            }

            if (value === null) {
                return true;
            }

            return typeof value === 'number' ||
                   typeof value === 'string';
        }

        private addAccessibilityIfRequired(symbol: ISymbol): void {
            var containingType = symbol.containingType();

            if (EnumUtilities.hasFlag(this.format.memberOptions(), MemberOptions.IncludeAccessibility) &&
                (containingType === null || containingType.typeKind() !== TypeKind.Interface)) {
                switch (symbol.accessibility()) {
                    case Accessibility.Private:
                        this.addKeyword(SyntaxKind.PrivateKeyword);
                        this.addSpace();
                        break;
                    case Accessibility.Public:
                        this.addKeyword(SyntaxKind.PublicKeyword);
                        this.addSpace();
                        break;
                }
            }
        }

        private addMemberModifiersIfRequired(symbol: ISymbol): void {
            var containingType = symbol.containingType();
            if (EnumUtilities.hasFlag(this.format.memberOptions(), MemberOptions.IncludeModifiers) &&
                (containingType == null || containingType.typeKind() !== TypeKind.Interface)) {

                if (symbol.isStatic()) {
                    this.addKeyword(SyntaxKind.StaticKeyword);
                    this.addSpace();
                }
            }
        }

        private addValue(type: ITypeSymbol, value: any): void {
            if (value != null) {
                this.addNonNullValue(type, value);
            }
            else {
                this.addKeyword(SyntaxKind.NullKeyword);
            }
        }

        private addNonNullValue(type: ITypeSymbol, value: any): void {
            if (type.typeKind() === TypeKind.Enum) {
                this.addEnumConstantValue(<IObjectTypeSymbol> type, value);
            }
            else {
                this.addLiteralValue(value);
            }
        }

        private addEnumConstantValue(enumType: IObjectTypeSymbol, value: any): void {
            // TODO: better enum presentation.
            this.addLiteralValue(value);
        }

        private addLiteralValue(value: any): void {
            var stringified = JSON2.stringify(value);
            this.builder.push(new Part(typeof value === 'number' ? PartKind.NumericLiteral : PartKind.StringLiteral,
                stringified, null));
        }
    }
}