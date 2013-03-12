///<reference path='..\..\..\..\src\harness\harness.ts'/>

describe("Assignment compatibility", function() {
    var typeFactory = new Harness.Compiler.TypeFactory();
    var any     = typeFactory.any;
    var number  = typeFactory.number;
    var string  = typeFactory.string;
    var bool    = typeFactory.bool;

    var nullType = typeFactory.get('var obj = null', 'obj');
    var undefinedType = typeFactory.get('var obj = undefined', 'obj');
    var anyArray = typeFactory.get('var arr = []', 'arr');
    var someFunction = typeFactory.get('function f() {}', 'f');
    var someObject   = typeFactory.get('var obj = {one: 1}', 'obj');
    var someClass = typeFactory.get('class Foo {};', 'Foo');
    var someInstance = typeFactory.get('class Foo2 {}; var f = new Foo2();', 'f'); // TODO: Foo2 because of a compiler bug

    var AnythingBasic = [any, number, string, bool, anyArray, someFunction, someObject, someClass, someInstance];
    function AnythingBasicBut(these: any[]) {
        return AnythingBasic.filter(x => !these.some(y => x === y));
    }

    describe("undefined type", function () {
        it("is assignment compatible with everything", function () {
            undefinedType.assertAssignmentCompatibleWith(AnythingBasic);
        });
    });

    describe("null type", function () {
        var these = [undefinedType];
        it("is assignment compatible with everything but undefined", function () {
            nullType.assertAssignmentCompatibleWith(AnythingBasicBut(these));
        });
        // TODO: can't represent void/undefined propertly with this system? TypeFactory makes them any?
        //it("is not assignment compatible with undefined", function () {
        //    nullType.assertNotAssignmentCompatibleWith(these);
        //});
    });

    describe("any type", function() {
        it("is assignment compatible with everything", function () {
            any.assertAssignmentCompatibleWith(AnythingBasic);
        });
    });

    describe("number type", function () {
        var these = [any, number];
        it("is assignment compatible with any and number", function() {
            number.assertAssignmentCompatibleWith(these);
        });

        it("is not assignment compatible with anything else", function () {
            number.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
        });
    });

    describe("bool type", function () {
        var these = [any, bool];
        it("is assignment compatible with any and bool", function() {
            bool.assertAssignmentCompatibleWith(these);
        });

        it("is not assignment compatible with anything else", function () {
            bool.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
        });
    });

    describe("string type", function () {
        var these = [any, string];
        it("is assignment compatible with any and string", function() {
            string.assertAssignmentCompatibleWith(these);
        });

        it("is not assignment compatible with anything else", function () {
            string.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
        });
    });


    describe("array type", function () {
        var boolArray   = typeFactory.get('var arr_bool : bool[]', 'arr_bool');
        var numberArray = typeFactory.get('var arr_number : number[]', 'arr_number');
        var stringArray = typeFactory.get('var arr_string : string[]', 'arr_string');
        var funcArray   = typeFactory.get('var f : () => void = null; var arr_func = [f];', 'arr_func');
        var objectArray = typeFactory.get('var o = {one: 1}; var arr_obj = [o];', 'arr_obj'); 
        var instanceArray = typeFactory.get('class Foo { public p  = 0;}; var arr_Foo : Foo[];', 'arr_Foo');
        var classArray = typeFactory.get('class Foo { public p = 0; }; var arr_Foo2 = [new Foo()]', 'arr_Foo2');

        var AnyArrayType = [anyArray, boolArray, numberArray, stringArray, funcArray, objectArray, instanceArray, classArray];
        function AnyArrayTypeBut(these: any[]) {
            return AnyArrayType.filter(x => !these.some(y => x === y));
        }

        describe("any[]", function() {
            it("is assignment compatible with any and all arrays", function () {
                anyArray.assertAssignmentCompatibleWith(AnyArrayType);
            });

            it("is not assignment compatible with anything else", function () {
                anyArray.assertNotAssignmentCompatibleWith(AnythingBasicBut([any, anyArray]));
            });
        });

        describe("bool[]", function () {
            var these = [any, boolArray, anyArray];
            it("is assignment compatible with any, any arrays, and bool arrays", function() {
                boolArray.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function() {
                boolArray.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
                boolArray.assertNotAssignmentCompatibleWith(AnyArrayTypeBut(these));
            });
        });

        describe("number[]", function () {
            var these = [any, numberArray, anyArray];
            it("is assignment compatible with any, any arrays, and number arrays", function() {
                numberArray.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function() {
                numberArray.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
                numberArray.assertNotAssignmentCompatibleWith(AnyArrayTypeBut(these));
            });
        });

        describe("string[]", function () {
            var these = [any, stringArray, anyArray];
            it("is assignment compatible with any, any arrays, and string arrays", function() {
                stringArray.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function() {
                stringArray.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
                stringArray.assertNotAssignmentCompatibleWith(AnyArrayTypeBut(these));
            });
        });
    });

    describe("Objects", function () {
        var emptyObj = typeFactory.get('var a = {};', 'a');
        var emptySig = typeFactory.get('var a:{};', 'a');

        var singleNumObj1 = typeFactory.get('var obj = {one: 1}', 'obj');
        var singleNumObj2 = typeFactory.get('var obj = {two: 1}', 'obj');
        var singleNumSig = typeFactory.get('var a:{one:number;};', 'a')
        var singleNumSig2 = typeFactory.get('var a:{two:number;};', 'a')

        var singleStringObj1 = typeFactory.get('var obj = {one: "1"}', 'obj');
        var singleStringObj2 = typeFactory.get('var obj = {two: "1"}', 'obj');
        var singleStringSig = typeFactory.get('var a:{one:string;};', 'a');
        var singleStringSig2 = typeFactory.get('var a:{two:string;};', 'a');

        var singleBoolObj1 = typeFactory.get('var obj = {one: true}', 'obj');
        var singleBoolObj2 = typeFactory.get('var obj = {two: true}', 'obj');
        var singleBoolSig = typeFactory.get('var a:{one:bool;};', 'a');

        var singleAnyArrayObj1 = typeFactory.get('var obj = {one: <any[]>[1]}', 'obj');
        var singleAnyArrayObj2 = typeFactory.get('var obj = {two: <any[]>[1]}', 'obj');
        var singleAnyArraySig = typeFactory.get('var a:{one:any[];};', 'a');

        var singleNumArrayObj1 = typeFactory.get('var obj = {one: [1]}', 'obj');
        var singleNumArrayObj2 = typeFactory.get('var obj = {two: [1]}', 'obj');
        var singleNumArraySig = typeFactory.get('var a:{one:number[];};', 'a');

        var singleStringArrayObj1 = typeFactory.get('var obj = {one: ["1"]}', 'obj');
        var singleStringArrayObj2 = typeFactory.get('var obj = {two: ["1"]}', 'obj');
        var singleStringArraySig = typeFactory.get('var a:{one:string[];};', 'a');

        var singleBoolArrayObj1 = typeFactory.get('var obj = {one: [true]}', 'obj');
        var singleBoolArrayObj2 = typeFactory.get('var obj = {two: [true]}', 'obj');
        var singleBoolArraySig = typeFactory.get('var a:{one:bool[];};', 'a');

        var callObjString = typeFactory.get('var obj = function (a: string) { return a; };', 'obj');
        var callSigString = typeFactory.get('var obj: { (a:string):string;}', 'obj');

        var callObjNum = typeFactory.get('var obj = function (a: number) { return a; };', 'obj');
        var callSigNum = typeFactory.get('var obj: { (a:number):number;}', 'obj');

        var indexerSigNum = typeFactory.get('var a:{[index:number];};', 'a');
        var indexerSigString = typeFactory.get('var a:{[index:string];};', 'a');

        var constructorSigNum = typeFactory.get('var a:{ new (param: number); };', 'a');
        var constructorSigString = typeFactory.get('var a:{ new (param: string); };', 'a');

        var AnyInstances = [emptyObj, singleNumObj1, singleNumObj2, singleStringObj1, singleStringObj2, singleBoolObj1, singleBoolObj2, singleAnyArrayObj1, singleAnyArrayObj2, singleNumArrayObj1, singleNumArrayObj2, singleStringArrayObj1, singleStringArrayObj2, singleBoolArrayObj1, singleBoolArrayObj2, callObjString];
        var AnySig = [emptySig, singleNumSig, singleNumSig2, singleStringSig, singleStringSig2, singleBoolSig, singleAnyArraySig, singleNumArraySig, singleStringArraySig, singleBoolArraySig, callSigString, callSigNum, indexerSigNum, indexerSigString, constructorSigNum, constructorSigString];
        var AnyLiterals = AnyInstances.concat(AnySig);

        function AnyLiteralsBut(these: any[]) {
            return AnyLiterals.filter(x => !these.some(y => x === y));
        } 

        describe("Object literal with 1 number property", function () {
            // TODO: see 622966 for why indexerSigString is included here
            var these = [emptyObj, singleNumObj1, emptySig, singleNumSig, indexerSigString];
            it("is assignment compatible with", function () {
                singleNumObj1.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function () {
                singleNumObj1.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
            });

            // TODO: see 622966 for why indexerSigString is included here
            var these2 = [emptyObj, singleNumObj2, emptySig, singleNumSig2, indexerSigString];
            it("is assignment compatible with", function () {
                singleNumObj2.assertAssignmentCompatibleWith(these2);
            });

            it("is not assignment compatible with anything else", function () {
                singleNumObj2.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
            });
        });

        describe("Object literal with 1 string property", function () {
            // TODO: see 622966 for why indexerSigString is included here
            var these = [emptyObj, singleStringObj1, emptySig, singleStringSig, indexerSigString];
            it("is assignment compatible with", function () {
                singleStringObj1.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function () {
                singleStringObj1.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
            });

            // TODO: see 622966 for why indexerSigString is included here
            var these2 = [emptyObj, singleStringObj2, emptySig, singleStringSig2, indexerSigString];
            it("is assignment compatible with", function () {
                singleStringObj2.assertAssignmentCompatibleWith(these2);
            });

            it("is not assignment compatible with anything else", function () {
                singleStringObj2.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
            });
        });

        describe("Callable properties", function () {
            // TODO: see 622966 for why indexerSigString is included here
            var these = [callObjString, callSigString, emptySig, emptyObj, indexerSigString];
            //var these = [emptyObj, singleNumObj1, singleNumObj2, indexerNumSig, constructorNumSig];
            it("Properties assignment compatible types", function () {
                callSigString.assertAssignmentCompatibleWith(these);
            });
            it("Properties not assignment compatible types", function () {
                callSigString.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
            });
        });

        var classWithPublic = typeFactory.get('class Foo1 { constructor(public one: number) {} }; var x1 = new Foo1(1);', 'x1');
        var classWithTwoPublic = typeFactory.get('class Foo2 { constructor(public one: number, public two: string) {} }; var x2 = new Foo2(1, "a");', 'x2');
        var classWithOptional = typeFactory.get('class Foo3 { constructor(public one?: number) {} }; var x3 = new Foo3();', 'x3');
        var classWithPublicAndOptional = typeFactory.get('class Foo4 { constructor(public one: number, public two?: string) {} }; var x4 = new Foo4(1);', 'x4');
        var classWithPrivate = typeFactory.get('class Foo5 { constructor(private one: number) {} }; var x5 = new Foo5(1);', 'x5');
        var classWithTwoPrivate = typeFactory.get('class Foo6 { constructor(private one: number, private two: string) {} }; var x6 = new Foo6(1, "a");', 'x6');
        var classWithPublicPrivate = typeFactory.get('class Foo7 { constructor(public one: number, private two: string) {} }; var x7 = new Foo7(1, "a");', 'x7');

        var interfaceOne = typeFactory.get('interface I1 { one: number; }; var obj1: I1 = { one: 1 };', 'obj1');
        var interfaceTwo = typeFactory.get('interface I2 { one: number; two: string; }; var obj2: I2 = { one: 1, two: "a" };', 'obj2');
        var interfaceWithOptional = typeFactory.get('interface I3 { one?: number; }; var obj3: I3 = { };', 'obj3');
        var interfaceWithPublicAndOptional = typeFactory.get('interface I4 { one: number; two?: string; }; var obj4: I4 = { one: 1 };', 'obj4');

        var AnyClass = [classWithPublic, classWithTwoPublic, classWithOptional, classWithPublicAndOptional, classWithPrivate, classWithTwoPrivate, classWithPublicPrivate];
        var AnyInterface = [interfaceOne, interfaceTwo, interfaceWithOptional, interfaceWithPublicAndOptional];
        var AnyObject = AnyClass.concat(AnyInterface);
        function AnyObjectBut(these: any[]) {
            return AnyObject.filter(x => !these.some(y => x === y));
        }

        describe("Classes with properties 1", function () {
            var these = [emptyObj, emptySig, classWithOptional, classWithPublicAndOptional, interfaceOne, interfaceWithOptional, interfaceWithPublicAndOptional];
            it("Class with public property assignable to", function () {
                classWithPublic.assertAssignmentCompatibleWith(these);
            });
            it("Class with public property not assignable to", function () {
                //classWithPublic.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
                classWithPublic.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, classWithPublicAndOptional, interfaceOne, interfaceTwo, interfaceWithOptional, interfaceWithPublicAndOptional];
            it("Class with public properties assignable to", function () {
                classWithTwoPublic.assertAssignmentCompatibleWith(these2);
            });
            it("Class with public properties not assignable to", function () {
                //classWithTwoPublic.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
                classWithTwoPublic.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, interfaceWithOptional, interfaceWithOptional];
            it("Class with optional property assignable to", function () {
                classWithOptional.assertAssignmentCompatibleWith(these3);
            });
            it("Class with optional property not assignable to", function () {
                //classWithOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these3));
                classWithOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });

            var these4 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic];
            it("Class with public and optional property assignable to", function () {
                classWithPublicAndOptional.assertAssignmentCompatibleWith(these4);
            });
            it("Class with public and optional property not assignable to", function () {
                //classWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these4));
                classWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these4));
            });

            var these5 = [emptyObj, emptySig, interfaceWithOptional, classWithPrivate];
            it("Class with private property assignable to", function () {
                classWithPrivate.assertAssignmentCompatibleWith(these5);
            });
            it("Class with private property not assignable to", function () {
                //classWithPrivate.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these5));
                classWithPrivate.assertNotAssignmentCompatibleWith(AnyObjectBut(these5));
            });

            var these6 = [emptyObj, emptySig, interfaceWithOptional, classWithTwoPrivate];
            it("Class with two private properties assignable to", function () {
                classWithTwoPrivate.assertAssignmentCompatibleWith(these6);
            });
            it("Class with two private properties not assignable to", function () {
                //classWithTwoPrivate.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these6));
                classWithTwoPrivate.assertNotAssignmentCompatibleWith(AnyObjectBut(these6));
            });

            var these7 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicPrivate];
            it("Class with public and private properties assignable to", function () {
                classWithPublicPrivate.assertAssignmentCompatibleWith(these7);
            });
            it("Class with public and private properties not assignable to", function () {
                //classWithPublicPrivate.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these7));
                classWithPublicPrivate.assertNotAssignmentCompatibleWith(AnyObjectBut(these7));
            });
        });

        describe("Interfaces", function () {
            var these = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithTwoPublic, classWithPublicAndOptional, interfaceWithPublicAndOptional];
            it("Interface with public property assignable to", function () {
                interfaceOne.assertAssignmentCompatibleWith(these);
            });
            it("Interface with public property not assignable to", function () {
                //interfaceOne.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
                interfaceOne.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, interfaceWithPublicAndOptional, classWithTwoPublic, interfaceTwo];
            it("Interface with public properties assignable to", function () {
                interfaceTwo.assertAssignmentCompatibleWith(these2);
            });
            it("Interface with public properties not assignable to", function () {
                //interfaceTwo.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
                interfaceTwo.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional];
            it("Interface with public property assignable to", function () {
                interfaceWithOptional.assertAssignmentCompatibleWith(these3);
            });
            it("Interface with public property not assignable to", function () {
                //interfaceWithOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these3));
                interfaceWithOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });

            var these4 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithTwoPublic, classWithPublicAndOptional, interfaceWithPublicAndOptional];
            it("Interface with public and optional property assignable to", function () {
                interfaceWithPublicAndOptional.assertAssignmentCompatibleWith(these4);
            });
            it("Interface with public and optional property not assignable to", function () {
                //interfaceWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these4));
                interfaceWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these4));
            });
        });
    });
});

describe("Generics assignment compatibility", function () {
    var typeFactory = new Harness.Compiler.TypeFactory();
    var any = typeFactory.any;
    var number = typeFactory.number;
    var string = typeFactory.string;
    var bool = typeFactory.bool;

    var nullType = typeFactory.get('var obj = null', 'obj');
    var undefinedType = typeFactory.get('var obj = undefined', 'obj');
    var anyArray = typeFactory.get('var arr: Array<any> = []', 'arr');
    var someFunction = typeFactory.get('function f<T>() {}', 'f');
    // TODO generic equivalent?
    //var someObject = typeFactory.get('var obj = {one: 1}', 'obj');
    var someObject = typeFactory.get('var obj = {one: 1}', 'obj');
    var someClass = typeFactory.get('class Foo<T> {};', 'Foo');
    var someInstance = typeFactory.get('class Foo2<T> {}; var f = new Foo2();', 'f'); // TODO: Foo2 because of a compiler bug

    var AnythingBasic = [any, number, string, bool, anyArray, someFunction, someObject, someClass, someInstance];
    function AnythingBasicBut(these: any[]) {
        return AnythingBasic.filter(x => !these.some(y => x === y));
    }

    describe("undefined type", function () {
        it("is assignment compatible with everything", function () {
            undefinedType.assertAssignmentCompatibleWith(AnythingBasic);
        });
    });

    describe("null type", function () {
        var these = [undefinedType];
        it("is assignment compatible with everything but undefined", function () {
            nullType.assertAssignmentCompatibleWith(AnythingBasicBut(these));
        });
        // TODO: can't represent void/undefined propertly with this system? TypeFactory makes them any?
        //it("is not assignment compatible with undefined", function () {
        //    nullType.assertNotAssignmentCompatibleWith(these);
        //});
    });

    describe("any type", function () {
        it("is assignment compatible with everything", function () {
            any.assertAssignmentCompatibleWith(AnythingBasic);
        });
    });

    describe("array type", function () {
        var boolArray = typeFactory.get('var arr : bool[]', 'arr');
        var numberArray = typeFactory.get('var arr : number[]', 'arr');
        var stringArray = typeFactory.get('var arr : string[]', 'arr');
        // TODO: specialized generic functions
        var funcArray = typeFactory.get('var f : () => void = null; var arr = [f];', 'arr');
        var objectArray = typeFactory.get('var o = {one: 1}; var arr = [o];', 'arr');
        // TODO: non-any versions
        var instanceArray = typeFactory.get('class Foo<T> {}; var arr : Foo[];', 'arr');
        var classArray = typeFactory.get('class Foo<T> {}; var arr = [new Foo()]', 'arr');

        var AnyArrayType = [anyArray, boolArray, numberArray, stringArray, funcArray, objectArray, instanceArray, classArray];
        function AnyArrayTypeBut(these: any[]) {
            return AnyArrayType.filter(x => !these.some(y => x === y));
        }

        describe("any[]", function () {
            it("is assignment compatible with any and all arrays", function () {
                anyArray.assertAssignmentCompatibleWith(AnyArrayType);
            });

            it("is not assignment compatible with anything else", function () {
                anyArray.assertNotAssignmentCompatibleWith(AnythingBasicBut([any, anyArray]));
            });
        });

        describe("bool[]", function () {
            var these = [any, boolArray, anyArray];
            it("is assignment compatible with any, any arrays, and bool arrays", function () {
                boolArray.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function () {
                boolArray.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
                boolArray.assertNotAssignmentCompatibleWith(AnyArrayTypeBut(these));
            });
        });

        describe("number[]", function () {
            var these = [any, numberArray, anyArray];
            it("is assignment compatible with any, any arrays, and number arrays", function () {
                numberArray.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function () {
                numberArray.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
                numberArray.assertNotAssignmentCompatibleWith(AnyArrayTypeBut(these));
            });
        });

        describe("string[]", function () {
            var these = [any, stringArray, anyArray];
            it("is assignment compatible with any, any arrays, and string arrays", function () {
                stringArray.assertAssignmentCompatibleWith(these);
            });

            it("is not assignment compatible with anything else", function () {
                stringArray.assertNotAssignmentCompatibleWith(AnythingBasicBut(these));
                stringArray.assertNotAssignmentCompatibleWith(AnyArrayTypeBut(these));
            });
        });
    });

    describe("Objects", function () {
        var emptyObj = typeFactory.get('var a = {};', 'a');
        var emptySig = typeFactory.get('var a:{};', 'a');

        var singleNumObj1 = typeFactory.get('var obj = {one: 1}', 'obj');
        var singleNumObj2 = typeFactory.get('var obj = {two: 1}', 'obj');
        var singleNumSig = typeFactory.get('var a:{one:number;};', 'a')
        var singleNumSig2 = typeFactory.get('var a:{two:number;};', 'a')

        var singleStringObj1 = typeFactory.get('var obj = {one: "1"}', 'obj');
        var singleStringObj2 = typeFactory.get('var obj = {two: "1"}', 'obj');
        var singleStringSig = typeFactory.get('var a:{one:string;};', 'a');
        var singleStringSig2 = typeFactory.get('var a:{two:string;};', 'a');

        var singleBoolObj1 = typeFactory.get('var obj = {one: true}', 'obj');
        var singleBoolObj2 = typeFactory.get('var obj = {two: true}', 'obj');
        var singleBoolSig = typeFactory.get('var a:{one:bool;};', 'a');

        var singleAnyArrayObj1 = typeFactory.get('var obj = {one: <any[]>[1]}', 'obj');
        var singleAnyArrayObj2 = typeFactory.get('var obj = {two: <any[]>[1]}', 'obj');
        var singleAnyArraySig = typeFactory.get('var a:{one:any[];};', 'a');

        var singleNumArrayObj1 = typeFactory.get('var obj = {one: [1]}', 'obj');
        var singleNumArrayObj2 = typeFactory.get('var obj = {two: [1]}', 'obj');
        var singleNumArraySig = typeFactory.get('var a:{one:number[];};', 'a');

        var singleStringArrayObj1 = typeFactory.get('var obj = {one: ["1"]}', 'obj');
        var singleStringArrayObj2 = typeFactory.get('var obj = {two: ["1"]}', 'obj');
        var singleStringArraySig = typeFactory.get('var a:{one:string[];};', 'a');

        var singleBoolArrayObj1 = typeFactory.get('var obj = {one: [true]}', 'obj');
        var singleBoolArrayObj2 = typeFactory.get('var obj = {two: [true]}', 'obj');
        var singleBoolArraySig = typeFactory.get('var a:{one:bool[];};', 'a');

        var callObjString = typeFactory.get('var obj = function (a: string) { return a; };', 'obj');
        var callSigString = typeFactory.get('var obj: { (a:string):string;}', 'obj');

        var callObjNum = typeFactory.get('var obj = function (a: number) { return a; };', 'obj');
        var callSigNum = typeFactory.get('var obj: { (a:number):number;}', 'obj');

        //var callObjGeneric = typeFactory.get('var obj = function<T>(a: T, b: T) { return a; };', 'obj');
        var callSigGeneric = typeFactory.get('var obj: { <T>(x: T, y: T) : T; };', 'obj');

        //var callObjGenericTwoTypeArgs = typeFactory.get('var obj = function<T,U>(a: T, b: U) { return a; };', 'obj');
        var callSigGenericTwoTypeArgs = typeFactory.get('var obj: { <T,U>(x: T, y: U) : T; };', 'obj');

        var classC = 'class C { private aproperty = 1; } ';
        //var callObjGenericTwoDifferentTypeArgs = typeFactory.get(classC + 'var obj = function<T,U extends C>(a: T, b: U) { return a; };', 'obj');
        var callSigGenericTwoDifferentTypeArgs = typeFactory.get(classC + 'var obj: { <T,U extends C>(x: T, y: U) : T; };', 'obj');

        //var callObjGenericCallableProperty = typeFactory.get('var obj = { one: function<T>(a: T, b: T) { return a; } };', 'obj');
        // TODO: shouldn't this work?
        //var callSigGenericCallableProperty = typeFactory.get('var obj: { one: <T>(x: T, y: T) => T; }', 'obj');

        var indexerSigNum = typeFactory.get('var a:{[index:number];};', 'a');
        var indexerSigString = typeFactory.get('var a:{[index:string];};', 'a');

        var constructorSigNum = typeFactory.get('var a:{ new (param: number); };', 'a');
        var constructorSigString = typeFactory.get('var a:{ new (param: string); };', 'a');

        var AnyInstances = [emptyObj, singleNumObj1, singleNumObj2, singleStringObj1, singleStringObj2, singleBoolObj1, singleBoolObj2, singleAnyArrayObj1, singleAnyArrayObj2, singleNumArrayObj1, singleNumArrayObj2, singleStringArrayObj1, singleStringArrayObj2, singleBoolArrayObj1, singleBoolArrayObj2, callObjString];
        var AnySig = [emptySig, singleNumSig, singleNumSig2, singleStringSig, singleStringSig2, singleBoolSig, singleAnyArraySig, singleNumArraySig, singleStringArraySig, singleBoolArraySig, callSigString, callSigNum, indexerSigNum, indexerSigString, constructorSigNum, constructorSigString];
        var AnyLiterals = AnyInstances.concat(AnySig);

        function AnyLiteralsBut(these: any[]) {
            return AnyLiterals.filter(x => !these.some(y => x === y));
        }

        var classWithPublic = typeFactory.get('export class Foo1<T> { constructor(public one: T) {} }; var x = new Foo1(1);', 'x');
        var classWithTwoPublic = typeFactory.get('export class Foo2<T,U> { constructor(public one: T, public two: U) {} }; var x = new Foo2(1, "a");', 'x');
        var classWithOptional = typeFactory.get('export class Foo3<T> { constructor(public one?: T) {} }; var x = new Foo3();', 'x');
        var classWithPublicAndOptional = typeFactory.get('export class Foo4<T,U> { constructor(public one: T, public two?: U) {} }; var x = new Foo4(1);', 'x');
        var classWithPrivate = typeFactory.get('export class Foo5<T> { constructor(private one: T) {} }; var x = new Foo5(1);', 'x');
        var classWithTwoPrivate = typeFactory.get('export class Foo6<T> { constructor(private one: T, private two: T) {} }; var x = new Foo6(1, "a");', 'x');
        var classWithPublicPrivate = typeFactory.get('export class Foo7<T,U> { constructor(public one: T, private two: U) {} }; var x = new Foo7(1, "a");', 'x');

        var classWithGenericMethod = 'export class Foo8<T> { constructor(public one: T) {} test1<T>(a: T) { return a; } };';
        var classWithGenericMethodOfNumber = typeFactory.get(classWithGenericMethod + 'var x = new Foo8(1);', 'x');
        var classWithGenericMethodOfString = typeFactory.get(classWithGenericMethod + 'var x = new Foo8("a");', 'x');
        var classWithGenericMethodOfArrayOfNumber = typeFactory.get(classWithGenericMethod + 'var x = new Foo8([1]);', 'x');
        var classWithGenericMethodOfArrayOfString = typeFactory.get(classWithGenericMethod + 'var x = new Foo8(["a"]);', 'x');
        var classWithGenericMethodOfArrayOfAny = typeFactory.get(classWithGenericMethod + 'var x = new Foo8(["a", 1]);', 'x');

        var classWithGenericMethodTwoTypeArgs = 'export class Foo8<T,U> { constructor(public one: T, public two: U) {} test1<T,U>(a: T) { return this.two; } };';
        var classWithGenericMethodTwoTypeArgsOfNumberNumber = typeFactory.get(classWithGenericMethodTwoTypeArgs + 'var x = new Foo8(1, 2);', 'x');
        var classWithGenericMethodTwoTypeArgsOfStringNumber = typeFactory.get(classWithGenericMethodTwoTypeArgs + 'var x = new Foo8("a", 2);', 'x');
        var classWithGenericMethodTwoTypeArgsOfArrayOfNumberNumber = typeFactory.get(classWithGenericMethodTwoTypeArgs + 'var x = new Foo8([1], [1]);', 'x');
        var classWithGenericMethodTwoTypeArgsOfArrayOfStringNumber = typeFactory.get(classWithGenericMethodTwoTypeArgs + 'var x = new Foo8(["a"],[1]);', 'x');
        var classWithGenericMethodTwoTypeArgsOfArrayOfAnyAny = typeFactory.get(classWithGenericMethodTwoTypeArgs + 'var x = new Foo8(["a", 1], []);', 'x');

        var AnyGeneric = [classWithGenericMethodOfNumber, classWithGenericMethodOfString, classWithGenericMethodOfArrayOfNumber, classWithGenericMethodOfArrayOfString, classWithGenericMethodOfArrayOfAny,
            classWithGenericMethodTwoTypeArgsOfNumberNumber, classWithGenericMethodTwoTypeArgsOfStringNumber, classWithGenericMethodTwoTypeArgsOfArrayOfNumberNumber, classWithGenericMethodTwoTypeArgsOfArrayOfStringNumber, classWithGenericMethodTwoTypeArgsOfArrayOfAnyAny,
            callSigGeneric, callSigGenericTwoTypeArgs, callSigGenericTwoDifferentTypeArgs];

        var interfaceOne = typeFactory.get('export interface I1<T> { one: T; }; var obj: I1 = { one: 1 };', 'obj');
        var interfaceTwo = typeFactory.get('export interface I2<T,U> { one: T; two: U; }; var obj: I2 = { one: 1, two: "a" };', 'obj');
        var interfaceWithOptional = typeFactory.get('export interface I3<T> { one?: T; }; var obj: I3 = { };', 'obj');
        var interfaceWithPublicAndOptional = typeFactory.get('export interface I4<T,U> { one: T; two?: U; }; var obj: I4 = { one: 1 };', 'obj');

        var AnyClass = [classWithPublic, classWithTwoPublic, classWithOptional, classWithPublicAndOptional, classWithPrivate, classWithTwoPrivate, classWithPublicPrivate];
        var AnyInterface = [interfaceOne, interfaceTwo, interfaceWithOptional, interfaceWithPublicAndOptional];
        var AnyObject = AnyClass.concat(AnyInterface).concat(AnyGeneric);
        function AnyObjectBut(these: any[]) {
            return AnyObject.filter(x => !these.some(y => x === y));
        }

        describe("Generic class methods one type argument", function () {
            var these = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfNumber];
            it("Class with generic method of number assignable to", function () {
                classWithGenericMethodOfNumber.assertAssignmentCompatibleWith(these);
            });
            it("Class with generic method of number not assignable to", function () {
                classWithGenericMethodOfNumber.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfString];
            it("Class with generic method of string assignable to", function () {
                classWithGenericMethodOfString.assertAssignmentCompatibleWith(these2);
            });
            it("Class with generic method of string not assignable to", function () {
                classWithGenericMethodOfString.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfArrayOfAny, classWithGenericMethodOfArrayOfNumber];
            it("Class with generic method of number[] assignable to", function () {
                classWithGenericMethodOfArrayOfNumber.assertAssignmentCompatibleWith(these3);
            });
            it("Class with generic method of number[] not assignable to", function () {
                classWithGenericMethodOfArrayOfNumber.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });

            var these4 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfArrayOfAny, classWithGenericMethodOfArrayOfString];
            it("Class with generic method of string[] assignable to", function () {
                classWithGenericMethodOfArrayOfString.assertAssignmentCompatibleWith(these4);
            });
            it("Class with generic method of string[] not assignable to", function () {
                classWithGenericMethodOfArrayOfString.assertNotAssignmentCompatibleWith(AnyObjectBut(these4));
            });

            var these5 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfArrayOfNumber, classWithGenericMethodOfArrayOfString, classWithGenericMethodOfArrayOfAny];
            it("Class with generic method of any[] assignable to", function () {
                classWithGenericMethodOfArrayOfAny.assertAssignmentCompatibleWith(these5);
            });
            it("Class with generic method of any[] not assignable to", function () {
                classWithGenericMethodOfArrayOfAny.assertNotAssignmentCompatibleWith(AnyObjectBut(these5));
            });
        });

        describe("Generic class methods multiple type arguments", function () {
            var these = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodTwoTypeArgsOfNumberNumber];
            it("Class with generic method, two type args of number assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfNumberNumber.assertAssignmentCompatibleWith(these);
            });
            it("Class with generic method, two type args of number assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfNumberNumber.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodTwoTypeArgsOfStringNumber];
            it("Class with generic method, two type args of string and number assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfStringNumber.assertAssignmentCompatibleWith(these2);
            });
            it("Class with generic method, two type args of string and number assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfStringNumber.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfArrayOfAny, classWithGenericMethodOfArrayOfAny, classWithGenericMethodTwoTypeArgsOfArrayOfNumberNumber];
            it("Class with generic method, two type args of number[] assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfArrayOfNumberNumber.assertAssignmentCompatibleWith(these3);
            });
            it("Class with generic method, two type args of number[] assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfArrayOfNumberNumber.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });

            var these4 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfArrayOfAny, classWithGenericMethodOfArrayOfAny, classWithGenericMethodTwoTypeArgsOfArrayOfStringNumber];
            it("Class with generic method, two type args of string[] and number[] assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfArrayOfStringNumber.assertAssignmentCompatibleWith(these4);
            });
            it("Class with generic method, two type args of string[] and number[] assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfArrayOfStringNumber.assertNotAssignmentCompatibleWith(AnyObjectBut(these4));
            });

            var these5 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional, classWithPublicPrivate, classWithGenericMethodOfArrayOfNumber, classWithGenericMethodOfArrayOfString, classWithGenericMethodOfArrayOfAny, classWithGenericMethodTwoTypeArgsOfArrayOfAnyAny];
            it("Class with generic method, two type args of any[] assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfArrayOfAnyAny.assertAssignmentCompatibleWith(these5);
            });
            it("Class with generic method, two type args of any[] assignable to", function () {
                classWithGenericMethodTwoTypeArgsOfArrayOfAnyAny.assertNotAssignmentCompatibleWith(AnyObjectBut(these5));
            });
        });

        describe("Object literals with generic call signatures", function () {
            var these = [emptyObj, emptySig, callSigGeneric, callSigGenericTwoTypeArgs]
            it("Callable property with one type arg is assignable to", function () {
                callSigGeneric.assertAssignmentCompatibleWith(these);
            });
            it("Callable property with one type arg not assignable to", function () {
                callSigGeneric.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
                callSigGeneric.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, callSigGeneric, callSigGenericTwoTypeArgs]
            it("Callable property with two type args is assignable to", function () {
                callSigGenericTwoTypeArgs.assertAssignmentCompatibleWith(these2);
            });
            it("Callable property with two type args not assignable to", function () {
                callSigGenericTwoTypeArgs.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
                callSigGenericTwoTypeArgs.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, callSigGenericTwoDifferentTypeArgs]
            it("Callable property with two different type args is assignable to", function () {
                callSigGenericTwoDifferentTypeArgs.assertAssignmentCompatibleWith(these3);
            });
            it("Callable property with two different type args not assignable to", function () {
                callSigGenericTwoDifferentTypeArgs.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these3));
                callSigGenericTwoDifferentTypeArgs.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });
        });

        describe("Classes with properties 2", function () {
            var these = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic];
            it("Class with public property assignable to", function () {
                classWithPublic.assertAssignmentCompatibleWith(these);
            });
            it("Class with public property not assignable to", function () {
                classWithPublic.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
                classWithPublic.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, interfaceTwo, interfaceWithOptional, interfaceWithPublicAndOptional, classWithTwoPublic];
            it("Class with public properties assignable to", function () {
                classWithTwoPublic.assertAssignmentCompatibleWith(these2);
            });
            it("Class with public properties not assignable to", function () {
                classWithTwoPublic.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
                classWithTwoPublic.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, interfaceWithOptional, interfaceWithOptional, classWithOptional];
            it("Class with optional property assignable to", function () {
                classWithOptional.assertAssignmentCompatibleWith(these3);
            });
            it("Class with optional property not assignable to", function () {
                classWithOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these3));
                classWithOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });

            var these4 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicAndOptional];
            it("Class with public and optional property assignable to", function () {
                classWithPublicAndOptional.assertAssignmentCompatibleWith(these4);
            });
            it("Class with public and optional property not assignable to", function () {
                classWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these4));
                classWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these4));
            });

            var these5 = [emptyObj, emptySig, interfaceWithOptional, classWithPrivate];
            it("Class with private property assignable to", function () {
                classWithPrivate.assertAssignmentCompatibleWith(these5);
            });
            it("Class with private property not assignable to", function () {
                classWithPrivate.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these5));
                classWithPrivate.assertNotAssignmentCompatibleWith(AnyObjectBut(these5));
            });

            var these6 = [emptyObj, emptySig, interfaceWithOptional, classWithTwoPrivate];
            it("Class with two private properties assignable to", function () {
                classWithTwoPrivate.assertAssignmentCompatibleWith(these6);
            });
            it("Class with two private properties not assignable to", function () {
                classWithTwoPrivate.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these6));
                classWithTwoPrivate.assertNotAssignmentCompatibleWith(AnyObjectBut(these6));
            });

            var these7 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithPublicPrivate];
            it("Class with public and private properties assignable to", function () {
                classWithPublicPrivate.assertAssignmentCompatibleWith(these7);
            });
            it("Class with public and private properties not assignable to", function () {
                classWithPublicPrivate.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these7));
                classWithPublicPrivate.assertNotAssignmentCompatibleWith(AnyObjectBut(these7));
            });
        });

        describe("Interfaces", function () {
            var these = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithTwoPublic, classWithPublicAndOptional, interfaceWithPublicAndOptional];
            it("Interface with public property assignable to", function () {
                interfaceOne.assertAssignmentCompatibleWith(these);
            });
            it("Interface with public property not assignable to", function () {
                interfaceOne.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these));
                interfaceOne.assertNotAssignmentCompatibleWith(AnyObjectBut(these));
            });

            var these2 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, interfaceWithPublicAndOptional, classWithTwoPublic, interfaceTwo];
            it("Interface with public properties assignable to", function () {
                interfaceTwo.assertAssignmentCompatibleWith(these2);
            });
            it("Interface with public properties not assignable to", function () {
                interfaceTwo.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these2));
                interfaceTwo.assertNotAssignmentCompatibleWith(AnyObjectBut(these2));
            });

            var these3 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional];
            it("Interface with public property assignable to", function () {
                interfaceWithOptional.assertAssignmentCompatibleWith(these3);
            });
            it("Interface with public property not assignable to", function () {
                interfaceWithOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these3));
                interfaceWithOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these3));
            });

            var these4 = [emptyObj, emptySig, interfaceOne, interfaceWithOptional, classWithPublic, classWithTwoPublic, classWithPublicAndOptional, interfaceWithPublicAndOptional];
            it("Interface with public and optional property assignable to", function () {
                interfaceWithPublicAndOptional.assertAssignmentCompatibleWith(these4);
            });
            it("Interface with public and optional property not assignable to", function () {
                interfaceWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyLiteralsBut(these4));
                interfaceWithPublicAndOptional.assertNotAssignmentCompatibleWith(AnyObjectBut(these4));
            });
        });
    });
});
