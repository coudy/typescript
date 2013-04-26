var Enum;
(function (Enum) {
    Enum._map = [];
    Enum.None = 0;
})(Enum || (Enum = {}));
var enumType = Enum.None;
var numberType = 0;
var anyType = 0;

enumType ^ numberType;
numberType ^ anyType;

enumType & anyType;
enumType | anyType;
enumType ^ anyType;
~anyType;
enumType << anyType;
enumType >> anyType;
enumType >>> anyType;