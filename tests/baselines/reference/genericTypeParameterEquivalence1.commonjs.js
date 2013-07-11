var a = {
    x: function (y) {
        return null;
    }
};
var a2 = {
    x: function (y) {
        return null;
    }
};

var i;
var i2;

// no error since the type parameters come from different declarations, considered assignment compatible
a = i;
i = a;

a2 = i2;
i2 = a2;

