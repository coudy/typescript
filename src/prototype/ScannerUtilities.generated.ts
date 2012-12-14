///<reference path='References.ts' />

class ScannerUtilities {
    public static identifierKind(array: number[], startIndex: number, length: number): SyntaxKind {
        switch (length) {
        case 2:
            // do, if, in
            switch(array[startIndex]) {
            case CharacterCodes.d:
                // do
                return (array[startIndex + 1] === CharacterCodes.o) ? SyntaxKind.DoKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.i:
                // if, in
                switch(array[startIndex + 1]) {
                case CharacterCodes.f:
                    // if
                    return SyntaxKind.IfKeyword;
                case CharacterCodes.n:
                    // in
                    return SyntaxKind.InKeyword;
                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 3:
            // for, new, try, var, let, any, get, set
            switch(array[startIndex]) {
            case CharacterCodes.f:
                // for
                return (array[startIndex + 1] === CharacterCodes.o && array[startIndex + 2] === CharacterCodes.r) ? SyntaxKind.ForKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.n:
                // new
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.w) ? SyntaxKind.NewKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.t:
                // try
                return (array[startIndex + 1] === CharacterCodes.r && array[startIndex + 2] === CharacterCodes.y) ? SyntaxKind.TryKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.v:
                // var
                return (array[startIndex + 1] === CharacterCodes.a && array[startIndex + 2] === CharacterCodes.r) ? SyntaxKind.VarKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.l:
                // let
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.t) ? SyntaxKind.LetKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.a:
                // any
                return (array[startIndex + 1] === CharacterCodes.n && array[startIndex + 2] === CharacterCodes.y) ? SyntaxKind.AnyKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.g:
                // get
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.t) ? SyntaxKind.GetKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.s:
                // set
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.t) ? SyntaxKind.SetKeyword : SyntaxKind.IdentifierNameToken;
            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 4:
            // case, else, null, this, true, void, with, enum, bool
            switch(array[startIndex]) {
            case CharacterCodes.c:
                // case
                return (array[startIndex + 1] === CharacterCodes.a && array[startIndex + 2] === CharacterCodes.s && array[startIndex + 3] === CharacterCodes.e) ? SyntaxKind.CaseKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.e:
                // else, enum
                switch(array[startIndex + 1]) {
                case CharacterCodes.l:
                    // else
                    return (array[startIndex + 2] === CharacterCodes.s && array[startIndex + 3] === CharacterCodes.e) ? SyntaxKind.ElseKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.n:
                    // enum
                    return (array[startIndex + 2] === CharacterCodes.u && array[startIndex + 3] === CharacterCodes.m) ? SyntaxKind.EnumKeyword : SyntaxKind.IdentifierNameToken;
                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            case CharacterCodes.n:
                // null
                return (array[startIndex + 1] === CharacterCodes.u && array[startIndex + 2] === CharacterCodes.l && array[startIndex + 3] === CharacterCodes.l) ? SyntaxKind.NullKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.t:
                // this, true
                switch(array[startIndex + 1]) {
                case CharacterCodes.h:
                    // this
                    return (array[startIndex + 2] === CharacterCodes.i && array[startIndex + 3] === CharacterCodes.s) ? SyntaxKind.ThisKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.r:
                    // true
                    return (array[startIndex + 2] === CharacterCodes.u && array[startIndex + 3] === CharacterCodes.e) ? SyntaxKind.TrueKeyword : SyntaxKind.IdentifierNameToken;
                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            case CharacterCodes.v:
                // void
                return (array[startIndex + 1] === CharacterCodes.o && array[startIndex + 2] === CharacterCodes.i && array[startIndex + 3] === CharacterCodes.d) ? SyntaxKind.VoidKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.w:
                // with
                return (array[startIndex + 1] === CharacterCodes.i && array[startIndex + 2] === CharacterCodes.t && array[startIndex + 3] === CharacterCodes.h) ? SyntaxKind.WithKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.b:
                // bool
                return (array[startIndex + 1] === CharacterCodes.o && array[startIndex + 2] === CharacterCodes.o && array[startIndex + 3] === CharacterCodes.l) ? SyntaxKind.BoolKeyword : SyntaxKind.IdentifierNameToken;
            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 5:
            // break, catch, false, throw, while, class, const, super, yield
            switch(array[startIndex]) {
            case CharacterCodes.b:
                // break
                return (array[startIndex + 1] === CharacterCodes.r && array[startIndex + 2] === CharacterCodes.e && array[startIndex + 3] === CharacterCodes.a && array[startIndex + 4] === CharacterCodes.k) ? SyntaxKind.BreakKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.c:
                // catch, class, const
                switch(array[startIndex + 1]) {
                case CharacterCodes.a:
                    // catch
                    return (array[startIndex + 2] === CharacterCodes.t && array[startIndex + 3] === CharacterCodes.c && array[startIndex + 4] === CharacterCodes.h) ? SyntaxKind.CatchKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.l:
                    // class
                    return (array[startIndex + 2] === CharacterCodes.a && array[startIndex + 3] === CharacterCodes.s && array[startIndex + 4] === CharacterCodes.s) ? SyntaxKind.ClassKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.o:
                    // const
                    return (array[startIndex + 2] === CharacterCodes.n && array[startIndex + 3] === CharacterCodes.s && array[startIndex + 4] === CharacterCodes.t) ? SyntaxKind.ConstKeyword : SyntaxKind.IdentifierNameToken;
                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            case CharacterCodes.f:
                // false
                return (array[startIndex + 1] === CharacterCodes.a && array[startIndex + 2] === CharacterCodes.l && array[startIndex + 3] === CharacterCodes.s && array[startIndex + 4] === CharacterCodes.e) ? SyntaxKind.FalseKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.t:
                // throw
                return (array[startIndex + 1] === CharacterCodes.h && array[startIndex + 2] === CharacterCodes.r && array[startIndex + 3] === CharacterCodes.o && array[startIndex + 4] === CharacterCodes.w) ? SyntaxKind.ThrowKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.w:
                // while
                return (array[startIndex + 1] === CharacterCodes.h && array[startIndex + 2] === CharacterCodes.i && array[startIndex + 3] === CharacterCodes.l && array[startIndex + 4] === CharacterCodes.e) ? SyntaxKind.WhileKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.s:
                // super
                return (array[startIndex + 1] === CharacterCodes.u && array[startIndex + 2] === CharacterCodes.p && array[startIndex + 3] === CharacterCodes.e && array[startIndex + 4] === CharacterCodes.r) ? SyntaxKind.SuperKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.y:
                // yield
                return (array[startIndex + 1] === CharacterCodes.i && array[startIndex + 2] === CharacterCodes.e && array[startIndex + 3] === CharacterCodes.l && array[startIndex + 4] === CharacterCodes.d) ? SyntaxKind.YieldKeyword : SyntaxKind.IdentifierNameToken;
            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 6:
            // delete, return, switch, typeof, export, import, public, static, module, number, string
            switch(array[startIndex]) {
            case CharacterCodes.d:
                // delete
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.l && array[startIndex + 3] === CharacterCodes.e && array[startIndex + 4] === CharacterCodes.t && array[startIndex + 5] === CharacterCodes.e) ? SyntaxKind.DeleteKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.r:
                // return
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.t && array[startIndex + 3] === CharacterCodes.u && array[startIndex + 4] === CharacterCodes.r && array[startIndex + 5] === CharacterCodes.n) ? SyntaxKind.ReturnKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.s:
                // switch, static, string
                switch(array[startIndex + 1]) {
                case CharacterCodes.w:
                    // switch
                    return (array[startIndex + 2] === CharacterCodes.i && array[startIndex + 3] === CharacterCodes.t && array[startIndex + 4] === CharacterCodes.c && array[startIndex + 5] === CharacterCodes.h) ? SyntaxKind.SwitchKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.t:
                    // static, string
                    switch(array[startIndex + 2]) {
                    case CharacterCodes.a:
                        // static
                        return (array[startIndex + 3] === CharacterCodes.t && array[startIndex + 4] === CharacterCodes.i && array[startIndex + 5] === CharacterCodes.c) ? SyntaxKind.StaticKeyword : SyntaxKind.IdentifierNameToken;
                    case CharacterCodes.r:
                        // string
                        return (array[startIndex + 3] === CharacterCodes.i && array[startIndex + 4] === CharacterCodes.n && array[startIndex + 5] === CharacterCodes.g) ? SyntaxKind.StringKeyword : SyntaxKind.IdentifierNameToken;
                    default:
                        return SyntaxKind.IdentifierNameToken;
                    }

                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            case CharacterCodes.t:
                // typeof
                return (array[startIndex + 1] === CharacterCodes.y && array[startIndex + 2] === CharacterCodes.p && array[startIndex + 3] === CharacterCodes.e && array[startIndex + 4] === CharacterCodes.o && array[startIndex + 5] === CharacterCodes.f) ? SyntaxKind.TypeOfKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.e:
                // export
                return (array[startIndex + 1] === CharacterCodes.x && array[startIndex + 2] === CharacterCodes.p && array[startIndex + 3] === CharacterCodes.o && array[startIndex + 4] === CharacterCodes.r && array[startIndex + 5] === CharacterCodes.t) ? SyntaxKind.ExportKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.i:
                // import
                return (array[startIndex + 1] === CharacterCodes.m && array[startIndex + 2] === CharacterCodes.p && array[startIndex + 3] === CharacterCodes.o && array[startIndex + 4] === CharacterCodes.r && array[startIndex + 5] === CharacterCodes.t) ? SyntaxKind.ImportKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.p:
                // public
                return (array[startIndex + 1] === CharacterCodes.u && array[startIndex + 2] === CharacterCodes.b && array[startIndex + 3] === CharacterCodes.l && array[startIndex + 4] === CharacterCodes.i && array[startIndex + 5] === CharacterCodes.c) ? SyntaxKind.PublicKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.m:
                // module
                return (array[startIndex + 1] === CharacterCodes.o && array[startIndex + 2] === CharacterCodes.d && array[startIndex + 3] === CharacterCodes.u && array[startIndex + 4] === CharacterCodes.l && array[startIndex + 5] === CharacterCodes.e) ? SyntaxKind.ModuleKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.n:
                // number
                return (array[startIndex + 1] === CharacterCodes.u && array[startIndex + 2] === CharacterCodes.m && array[startIndex + 3] === CharacterCodes.b && array[startIndex + 4] === CharacterCodes.e && array[startIndex + 5] === CharacterCodes.r) ? SyntaxKind.NumberKeyword : SyntaxKind.IdentifierNameToken;
            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 7:
            // default, finally, extends, package, private, declare
            switch(array[startIndex]) {
            case CharacterCodes.d:
                // default, declare
                switch(array[startIndex + 1]) {
                case CharacterCodes.e:
                    // default, declare
                    switch(array[startIndex + 2]) {
                    case CharacterCodes.f:
                        // default
                        return (array[startIndex + 3] === CharacterCodes.a && array[startIndex + 4] === CharacterCodes.u && array[startIndex + 5] === CharacterCodes.l && array[startIndex + 6] === CharacterCodes.t) ? SyntaxKind.DefaultKeyword : SyntaxKind.IdentifierNameToken;
                    case CharacterCodes.c:
                        // declare
                        return (array[startIndex + 3] === CharacterCodes.l && array[startIndex + 4] === CharacterCodes.a && array[startIndex + 5] === CharacterCodes.r && array[startIndex + 6] === CharacterCodes.e) ? SyntaxKind.DeclareKeyword : SyntaxKind.IdentifierNameToken;
                    default:
                        return SyntaxKind.IdentifierNameToken;
                    }

                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            case CharacterCodes.f:
                // finally
                return (array[startIndex + 1] === CharacterCodes.i && array[startIndex + 2] === CharacterCodes.n && array[startIndex + 3] === CharacterCodes.a && array[startIndex + 4] === CharacterCodes.l && array[startIndex + 5] === CharacterCodes.l && array[startIndex + 6] === CharacterCodes.y) ? SyntaxKind.FinallyKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.e:
                // extends
                return (array[startIndex + 1] === CharacterCodes.x && array[startIndex + 2] === CharacterCodes.t && array[startIndex + 3] === CharacterCodes.e && array[startIndex + 4] === CharacterCodes.n && array[startIndex + 5] === CharacterCodes.d && array[startIndex + 6] === CharacterCodes.s) ? SyntaxKind.ExtendsKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.p:
                // package, private
                switch(array[startIndex + 1]) {
                case CharacterCodes.a:
                    // package
                    return (array[startIndex + 2] === CharacterCodes.c && array[startIndex + 3] === CharacterCodes.k && array[startIndex + 4] === CharacterCodes.a && array[startIndex + 5] === CharacterCodes.g && array[startIndex + 6] === CharacterCodes.e) ? SyntaxKind.PackageKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.r:
                    // private
                    return (array[startIndex + 2] === CharacterCodes.i && array[startIndex + 3] === CharacterCodes.v && array[startIndex + 4] === CharacterCodes.a && array[startIndex + 5] === CharacterCodes.t && array[startIndex + 6] === CharacterCodes.e) ? SyntaxKind.PrivateKeyword : SyntaxKind.IdentifierNameToken;
                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 8:
            // continue, debugger, function
            switch(array[startIndex]) {
            case CharacterCodes.c:
                // continue
                return (array[startIndex + 1] === CharacterCodes.o && array[startIndex + 2] === CharacterCodes.n && array[startIndex + 3] === CharacterCodes.t && array[startIndex + 4] === CharacterCodes.i && array[startIndex + 5] === CharacterCodes.n && array[startIndex + 6] === CharacterCodes.u && array[startIndex + 7] === CharacterCodes.e) ? SyntaxKind.ContinueKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.d:
                // debugger
                return (array[startIndex + 1] === CharacterCodes.e && array[startIndex + 2] === CharacterCodes.b && array[startIndex + 3] === CharacterCodes.u && array[startIndex + 4] === CharacterCodes.g && array[startIndex + 5] === CharacterCodes.g && array[startIndex + 6] === CharacterCodes.e && array[startIndex + 7] === CharacterCodes.r) ? SyntaxKind.DebuggerKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.f:
                // function
                return (array[startIndex + 1] === CharacterCodes.u && array[startIndex + 2] === CharacterCodes.n && array[startIndex + 3] === CharacterCodes.c && array[startIndex + 4] === CharacterCodes.t && array[startIndex + 5] === CharacterCodes.i && array[startIndex + 6] === CharacterCodes.o && array[startIndex + 7] === CharacterCodes.n) ? SyntaxKind.FunctionKeyword : SyntaxKind.IdentifierNameToken;
            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 9:
            // interface, protected
            switch(array[startIndex]) {
            case CharacterCodes.i:
                // interface
                return (array[startIndex + 1] === CharacterCodes.n && array[startIndex + 2] === CharacterCodes.t && array[startIndex + 3] === CharacterCodes.e && array[startIndex + 4] === CharacterCodes.r && array[startIndex + 5] === CharacterCodes.f && array[startIndex + 6] === CharacterCodes.a && array[startIndex + 7] === CharacterCodes.c && array[startIndex + 8] === CharacterCodes.e) ? SyntaxKind.InterfaceKeyword : SyntaxKind.IdentifierNameToken;
            case CharacterCodes.p:
                // protected
                return (array[startIndex + 1] === CharacterCodes.r && array[startIndex + 2] === CharacterCodes.o && array[startIndex + 3] === CharacterCodes.t && array[startIndex + 4] === CharacterCodes.e && array[startIndex + 5] === CharacterCodes.c && array[startIndex + 6] === CharacterCodes.t && array[startIndex + 7] === CharacterCodes.e && array[startIndex + 8] === CharacterCodes.d) ? SyntaxKind.ProtectedKeyword : SyntaxKind.IdentifierNameToken;
            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 10:
            // instanceof, implements
            switch(array[startIndex]) {
            case CharacterCodes.i:
                // instanceof, implements
                switch(array[startIndex + 1]) {
                case CharacterCodes.n:
                    // instanceof
                    return (array[startIndex + 2] === CharacterCodes.s && array[startIndex + 3] === CharacterCodes.t && array[startIndex + 4] === CharacterCodes.a && array[startIndex + 5] === CharacterCodes.n && array[startIndex + 6] === CharacterCodes.c && array[startIndex + 7] === CharacterCodes.e && array[startIndex + 8] === CharacterCodes.o && array[startIndex + 9] === CharacterCodes.f) ? SyntaxKind.InstanceOfKeyword : SyntaxKind.IdentifierNameToken;
                case CharacterCodes.m:
                    // implements
                    return (array[startIndex + 2] === CharacterCodes.p && array[startIndex + 3] === CharacterCodes.l && array[startIndex + 4] === CharacterCodes.e && array[startIndex + 5] === CharacterCodes.m && array[startIndex + 6] === CharacterCodes.e && array[startIndex + 7] === CharacterCodes.n && array[startIndex + 8] === CharacterCodes.t && array[startIndex + 9] === CharacterCodes.s) ? SyntaxKind.ImplementsKeyword : SyntaxKind.IdentifierNameToken;
                default:
                    return SyntaxKind.IdentifierNameToken;
                }

            default:
                return SyntaxKind.IdentifierNameToken;
            }

        case 11:
            // constructor
            return (array[startIndex] === CharacterCodes.c && array[startIndex + 1] === CharacterCodes.o && array[startIndex + 2] === CharacterCodes.n && array[startIndex + 3] === CharacterCodes.s && array[startIndex + 4] === CharacterCodes.t && array[startIndex + 5] === CharacterCodes.r && array[startIndex + 6] === CharacterCodes.u && array[startIndex + 7] === CharacterCodes.c && array[startIndex + 8] === CharacterCodes.t && array[startIndex + 9] === CharacterCodes.o && array[startIndex + 10] === CharacterCodes.r) ? SyntaxKind.ConstructorKeyword : SyntaxKind.IdentifierNameToken;
        default:
            return SyntaxKind.IdentifierNameToken;
        }
    }
}